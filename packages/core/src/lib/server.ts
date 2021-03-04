import { Application } from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';

/**
 * Start an http/https server from the given Express instance
 */
export async function startServer(app: Application, options: ServerOptions): Promise<void> {
  const { logger = console } = options;

  try {
    if (options.pre) await preHook(options.pre, logger);

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
export async function preHook(fn: Function, logger: ILogger) {
  try {
    await fn();
  } catch (error) {
    logger.error('Error trying to execute the pre-hook function');
    throw error;
  }
}

/**
 * Execute a post-hook function
 */
export async function postHook(fn: Function, httpServer: http.Server, logger: ILogger) {
  try {
    await fn(httpServer);
  } catch (error) {
    logger.error('Error trying to execute the post-hook function');
    throw error;
  }
}

/**
 * Get HTTPS credentials
 * Read out the private key and certificate
 */
function getHttpsCredentials(certificate: string, privateKey: string): { key: string; cert: string } {
  try {
    const key = fs.readFileSync(privateKey, 'utf8');
    const cert = fs.readFileSync(certificate, 'utf8');
    return { key, cert };
  } catch (e) {
    throw new Error(`Something went wrong while fetching keys: ${e}`);
  }
}

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
}

export interface ILogger {
  error: (message: Error | string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
}
