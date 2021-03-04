import request from 'supertest';
import express, { NextFunction, Request, Response } from 'express';
import * as responder from '../../src';

const app = express();

describe('Responder', () => {
  beforeEach(() => {
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      return res.status(500).json(err.message);
    });
  });

  describe('#handleFn', () => {
    beforeAll(() => {
      const fn = (_req: Request, _res: Response) => {
        throw new Error('Something went wrong! 💩');
      };
      app.get('/hello', responder.tryCatchRoute(fn));
    });

    it('should catch an error', async () => {
      const { status, body } = await request(app).get('/hello');
      expect(status).toEqual(500);
      expect(body).toEqual('Something went wrong! 💩');
    });
  });

  describe('#handleAsyncFn', () => {
    beforeAll(() => {
      const fn = (_req: Request, _res: Response) => {
        return new Promise((_resolve, reject) =>
          setTimeout(() => {
            reject(new Error('Something went wrong! 💩💩'));
          }, 2000),
        );
      };

      app.get('/helloAsync', responder.tryCatchRoute(fn));
    });

    it('should catch an async error', async () => {
      const { status, body } = await request(app).get('/helloAsync');
      expect(status).toEqual(500);
      expect(body).toEqual('Something went wrong! 💩💩');
    });
  });
});
