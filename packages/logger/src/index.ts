import * as debug from 'debug';
import * as winston from 'winston';

const { LOG_LEVEL = 'debug', LOG_SIMPLE = false } = process.env;

const formatLogLevel = (level: string): string => {
  // Clean [31m and invisible character used to show colored strings by Winston
  const cleaned = level.replace(/\[\d{2}m{1}|[^a-zA-Z ]/g, '');
  switch (cleaned) {
    case 'info':
      return `🍺 ${level}`;
    case 'warn':
      return `❗️ ${level}`;
    case 'error':
      return `🔥 ${level}`;
    default:
      return `🤷‍♂️ ${level}`;
  }
};

const instance: winston.Logger = winston.createLogger({
  level: LOG_LEVEL,
  format: LOG_SIMPLE ? winston.format.simple() : winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message }) => `${formatLogLevel(level)}: ${message}`),
  ),
  transports: [
    new winston.transports.Console({
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
