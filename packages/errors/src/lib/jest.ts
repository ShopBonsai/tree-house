// import { ErrorType } from '@tree-house/errors';
// import '../interfaces/jest';

import { ErrorType } from '..';

/**
 * Number of expects when validating error.
 * This can be useful when using validateError with expect.assertions().
 */
export const NUM_ERROR_CHECKS = 4;

/**
 * Validate error against jest expect.
 * @param {object} error - Actual error.
 * @param {number} status - HTTP status code.
 * @param {object} ErrorType - Error object to compare with.
 */
export const validateError = (error: any, status: number, { code, message }: ErrorType): void => {
  expect(error).toBeInstanceOf(Error);
  expect(error.status).toEqual(status);
  expect(error.code).toEqual(code);
  expect(error.message).toEqual(message);
};

/**
 * Extend existing jest matchers.
 */
export const enableErrorMatchers = () => {
  expect.extend({
    /**
     * Validates whether an error has been thrown in a synchronous/asynchronous function.
     * @param {Function} fn - Inner function to avoid immediate execution.
     * @param {number} status - Http status code to expect.
     * @param {object} ErrorType - Error object to compare with.
     * @returns {object} Pass & message.
     */
    async toThrowApiError(fn: Function, status: number, { code, message }: ErrorType): Promise<ICustomMatcherResult> {
      try {
        await fn();
        return { pass: false, message: () => 'Expecting the function to throw an error' };
      } catch (error) {
        validateError(error, status, { code, message });
        return { pass: true, message: () => 'Expecting the function not to throw an error' };
      }
    },
  });
};

export interface ICustomMatcherResult {
  pass: boolean;
  message: () => string;
}
