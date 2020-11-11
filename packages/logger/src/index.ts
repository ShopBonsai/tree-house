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

const extraParametersFormat = format((info: TransformableInfo): TransformableInfo => ({
  ...info,
  ...getWinstonParams(info).reduce((acc, param) => ({ ...acc, ...param })),
}));

const messageFormat = format((info: TransformableInfo): TransformableInfo => {
  if (info.level !== 'error') {
    return info;
  }

  const [error] = getWinstonParams(info);
  if (!(error instanceof Error)) {
    return info;
  }

  const { message, stack, ...rest } = info;
  return {
    ...rest,
    label: `${message.replace(` ${error.message}`, '')}`,
    message: error.stack,
  };
});

const instance: Logger = createLogger({
  level: ENV.logLevel,
  format: format.combine(
    extraParametersFormat(),
    messageFormat(),
    emojiLevelFormat(),
    format.timestamp({ alias: 'timestamp' }),
    format.json(),
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
export const NSlogger = (namespace: string = ''): ILogger => ({
  info: instance.info.bind(instance),
  warn: instance.warn.bind(instance),
  debug: LOG_LEVEL === 'debug' ? getDebugger(namespace) : () => {},
  error: instance.error.bind(instance),
});

export interface ILogger {
  error: (message: Error | string, ...args: any[]) => void;
  warn: (message: Error | string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}
