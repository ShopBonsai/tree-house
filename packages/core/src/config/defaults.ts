import { HealthCheck, TerminusOptions } from '@godaddy/terminus';

const second = 1000;

export const defaultHealthCheck = (isProduction: boolean) => ({
  verbatim: !isProduction,
  __unsafeExposeStackTraces: !isProduction,
  '/healthcheck': ((input) => {
    const { state } = input;
    if (state.isShuttingDown) {
      throw new Error('Server is shutting down. See ya!');
    }
  }) as HealthCheck,
});

export const defaultTerminusOptions = (): TerminusOptions => ({
  // We have ~20 seconds before receiving SIGKILL
  timeout: 20 * second,
  signal: 'SIGTERM',
  useExit0: true,
});