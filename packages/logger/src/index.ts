import { format, Logger, createLogger, transports } from 'winston';
import minimatch from 'minimatch';

import { ENV } from './constants';
import { paramsFormat, jsonFormat, simpleFormat } from './format';

const createLoggerInstance = (defaultMeta: { [key: string]: string; } = {}) => createLogger({
  level: ENV.logLevel,
  format: format.combine(
    format.timestamp({ alias: 'timestamp' }),
    paramsFormat({ logFormat: ENV.logFormat }),
    ...(ENV.logFormat === 'json' ? jsonFormat() : simpleFormat()),
  ),
  defaultMeta: {
    serviceContext: {
      service: ENV.serviceName,
      version: `${ENV.serviceVersion}-${ENV.nodeEnv}`,
      ...defaultMeta,
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
  return minimatch(namespace, ENV.debug);
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
  error: (message: string, ...args: any[]) => void;
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
  Object.assign(instance.defaultMeta, {
    ...instance.defaultMeta,
    serviceContext: {
      service: name,
      version: `${version}-${ENV.nodeEnv}`,
    },
  });
};
