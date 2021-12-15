import stringify from 'json-stringify-safe';
import { TransformableInfo } from 'logform';
import { EOL } from 'os';

import { ERROR_PARAM_POSITION } from './constants';

/**
 * Extracts parameters from winston.
 */
export const getWinstonParams = (info: TransformableInfo): any[] | undefined => {
  // Winston adds all parameters to 'splat' property which is accessible only by Symbol[splat]
  return info[Symbol.for('splat') as any];
};

/**
 * Stringifies an object using `stringify` and a default serializer.
 * @param obj Any object to be stringified.
 */
const stringifyParam = (obj: any) => stringify(obj);

/**
 * Returns stringified parameters.
 * Returns undefined if parameters are undefined.
 * If `logFormat` is `json`, Error object is omitted since it'll be included as `message`.
 * If `logFormat` is `simple`, `EOL` is printed at the start of each string.
 */
export const stringifyParams = (
  params: any[] | undefined,
  logFormat: 'simple' | 'json',
): string[] | undefined => {
  if (params === undefined) {
    return params;
  }

  switch (logFormat) {
    case 'json':
      // Remove Error object if it's present where it's expected to be & stringify
      if (params[ERROR_PARAM_POSITION] instanceof Error) {
        return [...params.slice(0, ERROR_PARAM_POSITION), ...params.slice(ERROR_PARAM_POSITION + 1)].map(
          stringifyParam,
        );
      }

      return params.map(stringifyParam);

    default:
      return params.map((v: any) => `${EOL}${stringifyParam(v)}`);
  }
};
