import { RequestOptions, ServerResponse } from 'http';
import onFinished from 'on-finished';

import { scrubData } from '../helpers/filter';
import { ILogger } from './server';
import { Application } from 'express';

const requestMessage = ({
  protocol,
  url,
  host,
  method,
  status,
  statusMessage,
}: Partial<{
  protocol: string | null;
  url: string | null;
  host: string | null;
  method: string;
  status: number;
  statusMessage: string;
}>): string => `${method} ${protocol}://${host}${url} ${status} (${statusMessage})`;

const logRequest = (logger: ILogger, request: RequestOptions) => (
  _error: Error | null,
  response: ServerResponse,
): void => {
  const safeData = scrubData({
    protocol: request.protocol,
    url: request.path,
    host: request.hostname,
    method: request.method,
    headers: request.headers ? scrubData(request.headers) : undefined,
    status: response.statusCode,
    statusMessage: response.statusMessage,
  });

  logger.info(requestMessage(safeData), safeData);
};

const requestLogMiddleware = (logger: ILogger) => (
  req: RequestOptions,
  res: ServerResponse,
  next: () => void,
): void => {
  onFinished(res, logRequest(logger, req));
  next();
};

/**
 * Enable request logs middleware.
 * @param app - Express application.
 * @param enableRequestLogs - Flag to enable request logs middleware, by default disabled.
 * @param logger - Logger.
 */
export const enableRequestLogs = (app: Application, { enableRequestLogs = false, logger = console }:
  { enableRequestLogs?: boolean; logger?: ILogger }) => {
  if (enableRequestLogs) {
    app.use(requestLogMiddleware(logger));
  }
};
