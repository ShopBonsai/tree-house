import { NSlogger } from '..';
import { lorem } from 'faker';

const mockDate = new Date(0);
jest.spyOn(global, 'Date').mockImplementation(() => (mockDate as unknown) as string); // TypeScript workaround
const spyOnConsole = jest.spyOn((console as any)._stderr, 'write').mockImplementation();

const message = lorem.sentence();
const params: Record<string, unknown>[] = [
  { [lorem.word()]: { [lorem.word()]: lorem.sentence() }, [lorem.word()]: lorem.sentence() },
  { [lorem.word()]: { [lorem.word()]: lorem.sentence() } },
];

const OLD_ENV = process.env;

describe('logger', () => {
  const logger = NSlogger('test');

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    jest.restoreAllMocks();
    process.env = OLD_ENV;
  });

  it('info', () => {
    logger.info('message', { param: 'test' });
    expect(spyOnConsole).toBeCalledTimes(1);
    expect(spyOnConsole).toHaveBeenCalledWith<[string]>(
      expect.stringContaining('1970-01-01T00:00:00.000Z: message\n{"param":"test"}\n'), // cut off color string
    );
  });

  it('debug off', () => {
    logger.debug(message, params[0], params[1]);
    expect(spyOnConsole).not.toBeCalledTimes(1);
  });
  it('error', () => {
    logger.error(message, params[0], params[1]);
    expect(spyOnConsole).toBeCalledTimes(1);
  });
  it('warn', () => {
    logger.warn(message, params[0], params[1]);
    expect(spyOnConsole).toBeCalledTimes(1);
  });

  it('real console output', () => {
    spyOnConsole.mockRestore();
    logger.warn(message, params[0], params[1]);
  });
});
