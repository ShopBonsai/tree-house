import { Application, RequestHandler } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import rateLimit, { Options } from 'express-rate-limit';
import { PathParams } from 'express-serve-static-core';

import * as defaults from '../config/app.config';

/**
 * Set some basic security measurements
 */
export function setBasicSecurity(
  app: Application,
  route: PathParams,
  options: SecurityOptions = {},
): void {
  app.use(route, helmet(Object.assign({}, defaults.helmetOptions, options.helmet)));
  app.use(route, cors(Object.assign({}, defaults.corsOptions, options.cors)));
  // SAFARI BUGFIX: include credentials
  app.use((_req, res, next) => {
    res.set('credentials', 'include');
    next();
  });
}

/**
 * Set a body parser for all specific types at once
 */
export function setBodyParser(
  app: Application,
  route: PathParams,
  options: BodyParserOptions = {},
): void {
  const allOptions = Object.assign({}, defaults.bodyParserOptions, options);

  if (allOptions.json) app.use(route, bodyParser.json(allOptions.json));
  if (allOptions.raw) app.use(route, bodyParser.raw(allOptions.raw));
  if (allOptions.text) app.use(route, bodyParser.text(allOptions.text));
  if (allOptions.urlEncoded) app.use(route, bodyParser.urlencoded(allOptions.urlEncoded));
}

/**
 * Get a rate limiter instance
 * Current support for: built-in memory and Redis
 */
export function getRateLimiter(options: RateLimiterOptions = {}): RequestHandler {
  const allOptions: any = Object.assign({}, defaults.rateLimiterOptions, options);

  return rateLimit(allOptions);
}

// Interfaces
export interface RateLimiterOptions extends Partial<Options> {
}

export interface SecurityOptions {
  cors?: cors.CorsOptions;
  helmet?: Parameters<typeof helmet>[0]; // See https://github.com/helmetjs/helmet/issues/279
}

export interface BodyParserOptions {
  json?: bodyParser.OptionsJson;
  raw?: bodyParser.Options;
  text?: bodyParser.OptionsText;
  urlEncoded?: bodyParser.OptionsUrlencoded;
}
