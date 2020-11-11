import debug from 'debug';
import { format, Logger, createLogger, transports } from 'winston';
import { TransformableInfo } from 'logform';
import { ENV } from './constants';

const isProd = ENV.nodeEnv === 'production';

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
 * Convert extra arguments into an object where possible - arguments that are not objects will be skipped.
 */
const extraParametersFormat = format((info: TransformableInfo): TransformableInfo => ({
  ...info,
  ...getWinstonParams(info).reduce((acc, param) => ({ ...acc, ...param })),
}));

/**
 * Format log entry in a GCP compatible format.
 */
const messageFormat = format((info: TransformableInfo): TransformableInfo => {
  if (info.level !== 'error') {
    // TODO: return object in a compatible GCP Logging format
    return info;
  }

  const [error] = getWinstonParams(info);
  if (!(error instanceof Error)) {
    return info;
  }

  const { message, stack, httpRequest, ...rest } = info;

  // GCP Error Reporting compatible format
  return {
    ...rest,
    label: `${message.replace(` ${error.message}`, '')}`,
    message: error.stack,
    eventTime: rest.timestamp,
    context: { httpRequest },
  };
});

const instance: Logger = createLogger({
  level: ENV.logLevel,
  format: format.combine(
    extraParametersFormat(),
    format.timestamp({ alias: 'timestamp' }),
    messageFormat(),
    emojiLevelFormat(),
    format.json(),
    (isProd ? undefined : format.colorize({ all: true })),
    (isProd ? undefined : format.prettyPrint()),
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
