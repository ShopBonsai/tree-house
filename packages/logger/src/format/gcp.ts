import { format } from 'winston';
import { getWinstonParams, isTraceSampled } from './helpers';
import { TransformableInfo } from 'logform';
import { ERROR_PARAM_POSITION } from './constants';

/**
 * Creates a format function that formats the log entry in a GCP friendly format - either for error or regular log entries.
 */
const commonFieldsFormat = format(
  (info: TransformableInfo): TransformableInfo => {
    const { level, trace_id, span_id, trace_flags, ...rest } = info;

    return {
      ...rest,
      level,
      severity: level,
      trace: trace_id,
      spanId: span_id,
      traceSampled: isTraceSampled(trace_flags),
    };
  },
);

/**
 * Creates a format function that formats the error log entry in a GCP friendly format.
 */
const errorFormat = format((info: TransformableInfo): TransformableInfo => {
  const params = getWinstonParams(info);
  const { message, stack, timestamp, ...rest } = info;
  const { httpRequest } = params?.reduce((acc, param) => ({ ...acc, ...param })) || {};

  // GCP Error Reporting compatible format
  const errorReportingFormat = {
    eventTime: timestamp,
    severity: info.level,
    context: { httpRequest },
  };

  const commonParams = {
    ...rest,
    ...errorReportingFormat,
  };

  // No Error object provided
  if (params === undefined || !(params[ERROR_PARAM_POSITION] instanceof Error)) {
    return {
      ...commonParams,
      // GCP Error Reporting won't catch the error if the message doesn't have an error stack
      message: new Error(message).stack,
    };
  }

  const error = params[ERROR_PARAM_POSITION];
  return {
    ...commonParams,
    // User provided message & Error message get concatenated. Clean it up
    label: `${message.replace(error.message, '')}`,
    message: error.stack,
  };
});

const gcpLogFormat = commonFieldsFormat();
const gcpErrorFormat = format.combine(
  gcpLogFormat,
  errorFormat(),
);

/**
 * Formats log entry in a GCP compatible format.
 */
export const gcpLogEntryFormat = format(
  (info: TransformableInfo): TransformableInfo | boolean => {
    if (info.level !== 'error') {
      return gcpLogFormat.transform(info);
    }

    return gcpErrorFormat.transform(info);
  },
);
