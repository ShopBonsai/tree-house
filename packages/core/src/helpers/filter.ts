const secretKeysRegex = /password|secret|passwd|api_key|apikey|access_token|auth_token|credentials|stripetoken|stripe_token|card\[.*]/i;

/**
 * Filters out null and undefined values.
 * @param value - Any possible value.
 */
export const filterEmpty = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;

/**
 * Scrubs all the possible secrets from the object.
 * @param object - Object.
 */
export const scrubData = <T extends Record<string, unknown>>(object: T): Partial<T> =>
  Object.keys(object).reduce(
    (acc, key) => ({
      ...acc,
      [key]: secretKeysRegex.test(key) ? '[Filtered]' : object[key],
    }),
    {},
  );
