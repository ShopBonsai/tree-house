import { Application, Request, Response } from 'express';
import http from 'http';
import { createTerminus } from '@godaddy/terminus';

import https from 'https';
import fs from 'fs';

/**
 * Start an http/https server from the given Express instance
 */
export async function startServer(app: Application, options: ServerOptions): Promise<void> {
  const { logger = console, version, healthCheck } = options;

  try {
    if (options.pre) await preHook(options.pre, logger);

    // Optional version check
    if (version?.enabled) {
      enableVersionCheck(app, version.value);
    }

    const httpServer = http.createServer(app);
    httpServer.listen(options.port);
    logger.info(`${options.title || 'TreeHouse'} HTTP NodeJS Server listening on port ${options.port}`);

    // HTTPS - Optional
    if (options.https) {
      const httpsServer = https.createServer(
        getHttpsCredentials(options.https.certificate, options.https.privateKey),
        app,
      );
      httpsServer.listen(options.https.port);
      logger.info(`${options.title || 'TreeHouse'} HTTPS NodeJS Server listening on port ${options.https.port}`);
    }

    // Optional Kubernetes health checks
    if (healthCheck?.enabled) {
      enableHealthCheck(app, httpServer, { ...healthCheck, logger });
    }

    // Optional callback function
    if (options.post) await postHook(options.post, httpServer, logger);
  } catch (error) {
    logger.error('An error occurred trying to start the server:\n', error.message);
    throw error;
  }
}

/**
 * Execute a pre-hook function
 */
export const preHook = async (fn: Function, logger: ILogger) => {
  try {
    await fn();
  } catch (error) {
    logger.error('Error trying to execute the pre-hook function');
    throw error;
  }
};

/**
 * Execute a post-hook function
 */
export const postHook = async (fn: Function, httpServer: http.Server, logger: ILogger) => {
  try {
    await fn(httpServer);
  } catch (error) {
    logger.error('Error trying to execute the post-hook function');
    throw error;
  }
};

/**
 * Adds graceful shutdown and Kubernetes readiness / liveness checks for any HTTP applications.
 * @param {object} app - Express application
 * @param {pbject} server - HTTP server
 * @param {object} options - Health check options.
 */
export const enableHealthCheck = (
  app: Application,
  server: http.Server,
  { checkHealth = async () => true, uri = '/healthcheck', logger }: IHealthCheckOptions & { logger: ILogger },
) => {
  const terminusOptions = {
    healthChecks: {
      [uri]: async (): Promise<void> => {
        const isHealthy = await checkHealth();

        if (!isHealthy) {
          return Promise.reject(new Error('Server is not healthy'));
        }

        return Promise.resolve();
      },
    },
    logger: (message: string, error: Error): void => {
      logger.error(`HEALTH CHECK ERROR ${message}`, error, error.stack);
    },
  };

  app.listen = (...args: any) => server.listen.apply(server, args);
  createTerminus(server, terminusOptions);
};

/**
 * Adds version check endpoint.
 * @param {object} app - Express application.
 * @param {string} version - Version to display.
 */
export const enableVersionCheck = (app: Application, version: string | undefined = process.env.npm_package_version) => {
  app.get('/version', (_req: Request, res: Response) =>
    res.json({
      status: 'ok',
      info: version,
    }),
  );
};

/**
 * Get HTTPS credentials
 * Read out the private key and certificate
 */
const getHttpsCredentials = (certificate: string, privateKey: string): { key: string; cert: string } => {
  try {
    const key = fs.readFileSync(privateKey, 'utf8');
    const cert = fs.readFileSync(certificate, 'utf8');
    return { key, cert };
  } catch (e) {
    throw new Error(`Something went wrong while fetching keys: ${e}`);
  }
};

export interface ServerOptions {
  port: number;
  title?: string;
  https?: {
    port: number;
    privateKey: string;
    certificate: string;
  };
  pre?: Function;
  post?: (server: http.Server) => void | Promise<void>;
  logger?: ILogger;
  version?: IVersionOptions;
  healthCheck?: IHealthCheckOptions;
}

export interface IVersionOptions {
  enabled: boolean;
  value?: string; // Service version to output in `/version`. Defaults to `process.env.npm_package_version`
}

export interface IHealthCheckOptions {
  enabled: boolean;
  checkHealth?: () => Promise<boolean>; // Function that checks the health of the server
  uri?: string; // Custom health check route. Default: /healthcheck
}

export interface ILogger {
  error: (message: Error | string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
}
