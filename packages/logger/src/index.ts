import debug from 'debug';
import { format, Logger, createLogger, transports } from 'winston';
import { TransformableInfo } from 'logform';
import stringify from 'json-stringify-safe';
import { EOL } from 'os';

import { ENV } from './constants';

const errorParamPos = 0;

const LEVEL_EMOJI: Record<string, string> = {
  info: '🍺',
  warn: '❗️',
  error: '🔥',
  default: '🤷‍♂️',
};

/**
 * Returns emoji format based on level.
 */
const emojiLevelFormat = format(
  (info: TransformableInfo): TransformableInfo => {
    const { level } = info;
    const emoji = LEVEL_EMOJI[level] || LEVEL_EMOJI.default;
    return { ...info, level: `${emoji} ${level}` };
  },
);

/**
 * Extracts parameters from winston.
 */
const getWinstonParams = (info: TransformableInfo): any[] | undefined => {
  // Winston adds all parameters to 'splat' property which is accessible only by Symbol[splat]
  return info[Symbol.for('splat') as any];
};

/**
 * Returns stringified parameters, omitting Error object since it'll be included as `message`.
 * Returns undefined if parameters are undefined.
 */
const stringifyParams = (params: any[] | undefined, logFormat: 'simple' | 'json'): string[] | undefined => {
  if (params === undefined) {
    return params;
  }

  switch (logFormat) {
    case 'json':
      // Remove Error object if it's present where it's expected to be & stringify
      if (params[errorParamPos] instanceof Error) {
        return [
          ...params.slice(0, errorParamPos),
          ...params.slice(errorParamPos + 1),
        ].map(p => stringify(p))
      }

      return params.map(p => stringify(p));

    default:
      return params.map((v: any) => `${EOL}${stringify(v)}`);
  }
}

/**
 * Formats parameters by splitting them into multiple strings.
 */
const paramsFormat = format(
  (info: TransformableInfo, { logFormat }): TransformableInfo => {
    const winstonParams = getWinstonParams(info);
    const stringParams = stringifyParams(winstonParams, logFormat);
    return { ...info, params: stringParams };
  },
);

/**
 * Format log entry in a GCP compatible format.
 */
const jsonFormat = format((info: TransformableInfo): TransformableInfo => {
  if (info.level !== 'error') {
    // TODO: return object in a compatible GCP Logging format
    return info;
  }

  const params = getWinstonParams(info);
  if (params === undefined || !(params[errorParamPos] instanceof Error)) {
    return info;
  }

  const [error] = params;
  const { httpRequest } = params.reduce((acc, param) => ({ ...acc, ...param }))
  const { message, stack, timestamp, ...rest } = info;

  // GCP Error Reporting compatible format
  return {
    ...rest,
    // User provided message & Error message get concatenated. Clean it up
    label: `${message.replace(` ${error.message}`, '')}`,
    message: error.stack,
    eventTime: timestamp,
    context: { httpRequest },
  };
});

const simpleFormat = () => [
  format.colorize(),
  format.printf(
    ({ level, message, timestamp, params = '' }) => `${level} ${timestamp}: ${message}${params}`,
  )
]

const instance: Logger = createLogger({
  level: ENV.logLevel,
  format: format.combine(
    format.timestamp({ alias: 'timestamp' }),
    paramsFormat({ logFormat: ENV.logFormat }),
    emojiLevelFormat(),
    ...(ENV.logFormat === 'json' ? [jsonFormat(), format.json()] : simpleFormat()),
  ),
  defaultMeta: {
    serviceContext: {
      service: ENV.serviceName,
      version: `${ENV.serviceVersion}-${ENV.nodeEnv}`,
    },
  },
  transports: [
    new transports.Console({
      stderrLevels: ['debug', 'error'],
      consoleWarnLevels: ['warn'],
    }),
  ],
});

const namespaceRegistry = {};
const getDebugger = (namespace: string = ''): debug.IDebugger => {
  if (!namespace) {
    return debug('');
  }
  if (!namespaceRegistry[namespace]) {
    namespaceRegistry[namespace] = debug(namespace);
  }
  return namespaceRegistry[namespace];
};

export const logger: ILogger = {
  info: instance.info.bind(instance),
  warn: instance.warn.bind(instance),
  debug: instance.debug.bind(instance),
  error: instance.error.bind(instance),
};

// tslint:disable-next-line: variable-name
export const NSlogger = (namespace: string = ''): ILogger => {
  instance.defaultMeta = {
    ...instance.defaultMeta,
    namespace,
  };

  return {
    info: instance.info.bind(instance),
    warn: instance.warn.bind(instance),
    debug: ENV.logLevel === 'debug' ? getDebugger(namespace) : () => {},
    error: instance.error.bind(instance),
  };
};

export interface ILogger {
  error: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}
