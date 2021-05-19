import { lorem } from 'faker';
import { ILogger } from '../index';

const mockDate = new Date(0);
jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any); // TypeScript workaround
const consoleSpy = jest.spyOn((console as any)._stderr, 'write').mockImplementation();

const message = lorem.sentence();
const params: Record<string, unknown>[] = [
  { [lorem.word()]: { [lorem.word()]: lorem.sentence() }, [lorem.word()]: lorem.sentence() },
  { [lorem.word()]: { [lorem.word()]: lorem.sentence() } },
];

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe('Basic logger test', () => {
  describe('LOG_FORMAT = simple', () => {
    const getLogger = () => {
      const { NSlogger } = require('..');
      return NSlogger('test');
    };

    it('Should output formatted info message to console', () => {
      getLogger().info('message', { param: 'test' });
      expect(consoleSpy).toBeCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith<[string]>(
        expect.stringContaining('1970-01-01T00:00:00.000Z: message\n{"param":"test"}\n'), // cut off color string
      );
    });

    it('Should not output anything to console if not in debug environment', () => {
      process.env.LOG_LEVEL = 'test';
      getLogger().debug(message, ...params);
      expect(consoleSpy).not.toBeCalledTimes(1);
      process.env.LOG_LEVEL = 'debug';
    });

    it('Should output formatted error message to console', () => {
      getLogger().error(message, ...params);
      expect(consoleSpy).toBeCalledTimes(1);
    });

    it('Should output only one line', () => {
      getLogger().error(message);
      expect(consoleSpy).toHaveBeenCalledWith<[string]>(
        expect.stringMatching(new RegExp(`.*${message}\n$`)), // cut off color string
      );
    });

    it('Should output multiple line', () => {
      getLogger().error(message, undefined);
      expect(consoleSpy).toHaveBeenCalledWith<[string]>(
        expect.stringMatching(new RegExp(`.*${message}\nundefined\n$`)), // cut off color string
      );
    });

    it('Should output formatted warn message to console', () => {
      getLogger().warn(message, ...params);
      expect(consoleSpy).toBeCalledTimes(1);
    });

    it('Should output formatted error message to console two', () => {
      getLogger().error(message);
      expect(consoleSpy).toBeCalledTimes(1);
    });
  });

  describe('LOG_FORMAT = json', () => {
    const getLogger = (namespace = 'test'): ILogger => {
      process.env.LOG_FORMAT = 'json';
      const { NSlogger, setup } = require('..');
      setup({ name: '@tree-house/logger', version: '1.2.3' });

      return NSlogger(namespace);
    };

    it('Should output a JSON format', () => {
      getLogger().info(message);
      expect(consoleSpy).toHaveBeenCalledWith<[string]>(
        expect.stringMatching(new RegExp(`^{.*\\"message\\":\\"${message.replace('.', '.')}\\".*}\n$`)),
      );
    });

    it('Should output an Error stack when only a message is provided', () => {
      const error = new Error(message);
      error.stack = lorem.sentence();
      jest.spyOn(global, 'Error').mockImplementation(() => error);

      getLogger().error(message);
      expect(consoleSpy).toHaveBeenCalledWith<[string]>(
        expect.stringMatching(new RegExp(`^{.*\\"message\\":\\"${error.stack}\\".*}\n$`)),
      );
    });

    it('Should output serviceContext', () => {
      getLogger().error(message);
      expect(consoleSpy).toHaveBeenCalledWith<[string]>(
        expect.stringMatching(
          new RegExp(
            `^{.*\\"serviceContext\\":{\\"service\\":\\"@tree-house/logger\\",\\"version\\":\\".*-${process.env.NODE_ENV}\\"}.*}\n$`,
          ),
        ),
      );
    });

    it('Should output namespace', () => {
      getLogger().error(message);
      expect(consoleSpy).toHaveBeenCalledWith<[string]>(
        expect.stringMatching(new RegExp('^{.*\\"namespace\\":\\"@tree-house/logger:test\\".*}\n$')),
      );
    });

    it('Should output 2 different namespaces', () => {
      const logger1 = getLogger();
      const logger2 = getLogger('namespace');

      const testNamespace = ({ logger, namespace }: { logger: ILogger, namespace: string }) => {
        logger.error(message);

        expect(consoleSpy).toHaveBeenCalledWith<[string]>(
          expect.stringMatching(new RegExp(`^{.*\\"namespace\\":\\"@tree-house/logger:${namespace}\\".*}\n$`)),
        );
      };

      const loggers = [
        { logger: logger1, namespace: 'test' },
        { logger: logger2, namespace: 'namespace' },
      ];

      loggers.forEach(testNamespace);
    });

    it('Should output Error stack as message', () => {
      const error = new Error(message);
      // Set a custom error stack, otherwise using regex to match an error stack is a nightmare
      error.stack = lorem.sentence();
      getLogger().error(message, error);
      expect(consoleSpy).toHaveBeenCalledWith<[string]>(
        expect.stringMatching(new RegExp(`^{.*\\"message\\":\\"${error.stack}\\".*}\n$`)),
      );
    });
  });

  describe('Testing DEBUG', () => {
    const getDebugLogger = (namespace: string, logLevel: string = 'debug') => {
      process.env.LOG_LEVEL = logLevel;
      process.env.DEBUG = namespace;
      const { NSlogger, setup } = require('..');
      setup({ name: '@tree-house/logger', version: '1.2.3' });
      return NSlogger('test');
    };

    it('Should not output debug message to console when log level is `info`', () => {
      getDebugLogger('@tree-house/logger:test', 'info').debug(message, ...params);
      expect(consoleSpy).not.toBeCalled();
    });

    it('Should not output debug message to console when namespaces don\'t match', () => {
      getDebugLogger('fail').debug(message, ...params);
      expect(consoleSpy).not.toBeCalled();
    });

    it('Should output formatted debug message to console when full namespace matches', () => {
      getDebugLogger('@tree-house/logger:test').debug(message, ...params);
      expect(consoleSpy).toBeCalledTimes(1);
    });

    it('Should output formatted debug message to console when glob namespace matches', () => {
      getDebugLogger('@tree-house/*').debug(message, ...params);
      expect(consoleSpy).toBeCalledTimes(1);
    });
  });
});
