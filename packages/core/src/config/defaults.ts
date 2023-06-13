import { HealthCheckMap, TerminusOptions } from '@godaddy/terminus';

const second_to_millisecond = 1000;

export const defaultHealthCheck = (
  { isProduction, ...rest }: HealthCheckMap & { isProduction?: boolean; }
) => ({
  verbatim: !isProduction,
  __unsafeExposeStackTraces: !isProduction,
  ...rest,
});

export const defaultTerminusOptions: TerminusOptions = ({
  // We have ~20 seconds before receiving SIGKILL
  timeout: 20 * second_to_millisecond,
  signal: 'SIGTERM',
  useExit0: true,
});
