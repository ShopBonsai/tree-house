import { NSlogger } from '..';
import { lorem } from 'faker';

const mockDate = new Date(0);
jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any); // TypeScript workaround
const consoleSpy = jest.spyOn((console as any)._stderr, 'write').mockImplementation();

const message = lorem.sentence();
const params: Record<string, unknown>[] = [
  { [lorem.word()]: { [lorem.word()]: lorem.sentence() }, [lorem.word()]: lorem.sentence() },
  { [lorem.word()]: { [lorem.word()]: lorem.sentence() } },
];

const logger = NSlogger('test');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Basic logger test', () => {
  it('Should output formatted info message to console', () => {
    logger.info('message', { param: 'test' });
    expect(consoleSpy).toBeCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith<[string]>(
      expect.stringContaining('1970-01-01T00:00:00.000Z: message\n{"param":"test"}\n'), // cut off color string
    );
  });

  it('Should not output anything to console if not in debug environment', () => {
    logger.debug(message, params[0], params[1]);
    expect(consoleSpy).not.toBeCalledTimes(1);
  });

  it('Should output formatted error message to console', () => {
    logger.error(message, params[0], params[1]);
    expect(consoleSpy).toBeCalledTimes(1);
  });

  it('Should output formatted warn message to console', () => {
    logger.warn(message, params[0], params[1]);
    expect(consoleSpy).toBeCalledTimes(1);
  });
});
