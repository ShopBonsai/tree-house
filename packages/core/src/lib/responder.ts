import { RequestHandler, Request, Response, NextFunction } from 'express';

/**
 * Wrapper for safe error handling around ExpressJS functions.
 */
export const tryCatchRoute = <T>(
  fnToExecute: (request: any, response: Response, next?: NextFunction) => T | Promise<T>,
): RequestHandler => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      await fnToExecute(request, response, next);
    } catch (error) {
      return next(error);
    }
  };
};
