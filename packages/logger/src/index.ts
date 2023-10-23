import { format, Logger, createLogger, transports } from 'winston';

import { ENV } from './constants';
import { commonFormat, jsonFormat, simpleFormat } from './format';
import { serviceContext } from './serviceContext';

const createLoggerInstance = (defaultMeta: { [key: string]: string; } = {}) => createLogger({
  level: ENV.logLevel,
  format: format.combine(
    ...commonFormat(),
    ...(ENV.logFormat === 'json' ? jsonFormat() : simpleFormat()),
  ),
  defaultMeta: {
    ...defaultMeta,
    serviceContext: {
      service: serviceContext.getName(),
      version: serviceContext.getVersion(),
    },
  },
  transports: [
    new transports.Console({
      stderrLevels: ['debug', 'error'],
      consoleWarnLevels: ['warn'],
    }),
  ],
});

const instance: Logger = createLoggerInstance();

export const logger: ILogger = {
  info: instance.info.bind(instance),
  warn: instance.warn.bind(instance),
  debug: instance.debug.bind(instance),
  error: instance.error.bind(instance),
};

const getNamespace = (namespace: string): string => {
  const service = instance.defaultMeta.serviceContext.service;

  if (service && namespace) {
    return `${service}:${namespace}`;
  }
  if (service && !namespace) {
    return service;
  }

  return namespace;
};

/**
 * Returns `true` if the namespace matched `process.env.DEBUG` glob.
 * @param namespace Namespace used in debug logs.
 */
const shouldLogDebug = (namespace): Boolean => {
  // `ENV.debug` could contain multiple namespaces separated by commas, so split them up.
  const debugGlobs = ENV.debug.split(/[\s,]+/);

  // Convert stars into regex.
  const debugRegexPatterns = debugGlobs.map(ns => ns.replace(/\*/g, '.*?'));

  // Generate a list of regex patterns to be skipped & to be logged.
  const { skips, names } = debugRegexPatterns.reduce((prev, pattern) => {
    const shouldSkip = pattern[0] === '-';
    return {
      skips: [...prev.skips, ...(shouldSkip ? [new RegExp(`^${pattern.substr(1)}$`)] : [])],
      names: [...prev.names, ...(!shouldSkip ? [new RegExp(`^${pattern}$`)] : [])],
    };
  }, { skips: [], names: [] } as Record<string, RegExp[]>);

  const shouldSkip = skips.some(skipRegex => skipRegex.test(namespace));
  if (shouldSkip) {
    return false;
  }

  const shouldLog = names.some(nameRegex => nameRegex.test(namespace));
  return shouldLog;
};

// tslint:disable-next-line: variable-name
export const NSlogger = (namespace: string = ''): ILogger => {
  const newNamespace = getNamespace(namespace);

  const loggerInstance = createLoggerInstance({
    ...instance.defaultMeta,
    namespace: newNamespace,
  });

  return {
    info: loggerInstance.info.bind(loggerInstance),
    warn: loggerInstance.warn.bind(loggerInstance),
    debug: shouldLogDebug(newNamespace) ? loggerInstance.debug.bind(loggerInstance) : () => {},
    error: loggerInstance.error.bind(loggerInstance),
  };
};

export interface ILogger {
  error: (error: Error, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

export interface ISetupOptions {
  // Name of the service
  name: string;
  // Version of the service
  version: string;
}

/**
 * Assigns service name & version to log entries.
 * @param param0 - Name & version of the service to associate with log entries.
 */
export const setup = ({ name, version }: ISetupOptions) => {
  serviceContext.setName(name);
  serviceContext.setVersion(`${version}-${ENV.nodeEnv}`);

  Object.assign(instance.defaultMeta, {
    ...instance.defaultMeta,
    serviceContext: {
      service: serviceContext.getName(),
      version: serviceContext.getVersion(),
    },
  });
};
