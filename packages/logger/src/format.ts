import { TransformableInfo } from 'logform';
import stringify from 'json-stringify-safe';
import { EOL } from 'os';
import { format } from 'winston';

const errorParamPos = 0;

const LEVEL_EMOJI: Record<string, string> = {
  info: '🍺',
  warn: '❗️',
  error: '🔥',
  default: '🤷‍♂️',
};

/**
 * Returns emoji format based on level.
 */
const emojiLevelFormat = format(
  (info: TransformableInfo): TransformableInfo => {
    const { level } = info;
    const emoji = LEVEL_EMOJI[level] || LEVEL_EMOJI.default;
    return { ...info, level: `${emoji} ${level}` };
  },
);

/**
 * Extracts parameters from winston.
 */
const getWinstonParams = (info: TransformableInfo): any[] | undefined => {
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
const stringifyParams = (params: any[] | undefined, logFormat: 'simple' | 'json'): string[] | undefined => {
  if (params === undefined) {
    return params;
  }

  switch (logFormat) {
    case 'json':
      // Remove Error object if it's present where it's expected to be & stringify
      if (params[errorParamPos] instanceof Error) {
        return [
          ...params.slice(0, errorParamPos),
          ...params.slice(errorParamPos + 1),
        ].map(stringifyParam);
      }

      return params.map(stringifyParam);

    default:
      return params.map((v: any) => `${EOL}${stringifyParam(v)}`);
  }
};

/**
 * Formats log entry in a GCP compatible format.
 */
const gcpLogEntryFormat = format((info: TransformableInfo): TransformableInfo => {
  if (info.level !== 'error') {
    // TODO: return object in a compatible GCP Logging format
    return info;
  }

  const params = getWinstonParams(info);
  const { message, stack, timestamp, ...rest } = info;
  const { httpRequest } = params?.reduce((acc, param) => ({ ...acc, ...param })) || {};

  // GCP Error Reporting compatible format
  const errorReportingFormat = {
    eventTime: timestamp,
    context: { httpRequest },
  };

  // No Error object provided
  if (params === undefined || !(params[errorParamPos] instanceof Error)) {
    return {
      ...rest,
      ...errorReportingFormat,
      // GCP Error Reporting won't catch the error if the message doesn't have an error stack
      message: new Error(message).stack,
    };
  }

  const error = params[errorParamPos];
  return {
    ...rest,
    ...errorReportingFormat,
    // User provided message & Error message get concatenated. Clean it up
    label: `${message.replace(error.message, '')}`,
    message: error.stack,
  };
});

/**
 * Formats parameters by splitting them into multiple strings.
 */
export const paramsFormat = format(
  (info: TransformableInfo, { logFormat }): TransformableInfo => {
    const winstonParams = getWinstonParams(info);
    const stringParams = stringifyParams(winstonParams, logFormat);
    return { ...info, params: stringParams };
  },
);

/**
 * Formats the log entry in a developer friendly format.
 */
export const simpleFormat = () => [
  emojiLevelFormat(),
  format.colorize(),
  format.printf(
    ({ level, message, timestamp, params = '' }) => `${level} ${timestamp}: ${message}${params}`,
  ),
];

/**
 * Formats the log entry in a JSON friendly format.
 */
export const jsonFormat = () => [
  gcpLogEntryFormat(),
  emojiLevelFormat(),
  format.json(),
];
