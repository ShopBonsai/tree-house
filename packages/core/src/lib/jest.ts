/**
 * Extend existing jest matchers.
 */
export const enableCustomMatchers = () => {
  expect.extend({
    /**
     * Check whether an array contains a partially matching object.
     * @param {object[]} received - Array of data.
     * @param {object} expected - Expect object to be in array.
     * @returns {object} Pass & message.
     */
    toMatchObjectInArray(received: any[], expected: object): ICustomMatcherResult {
      expect(received).toEqual(expect.arrayContaining([expect.objectContaining(expected)]));
      return { pass: true, message: () => 'Expecting the object not to match in the array' };
    },
  });
};

export interface ICustomMatcherResult {
  pass: boolean;
  message: () => string;
}
