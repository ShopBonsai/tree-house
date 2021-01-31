import httpStatus from 'http-status';
import { BadRequestError, errors, enableErrorMatchers } from '../src';

describe('Jest', () => {
  enableErrorMatchers();

  describe('toThrowApiError', () => {
    it('Should throw specific api error', () => {
      const myFn = () => {
        throw new BadRequestError(errors.GENERIC_ERROR);
      };

      expect(() => myFn()).toThrowApiError(httpStatus.BAD_REQUEST, errors.GENERIC_ERROR);
    });
  });
});
