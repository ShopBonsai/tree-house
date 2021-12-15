import { format } from 'winston';
import { getWinstonParams } from './helpers';
import { TransformableInfo } from 'logform';
import { ERROR_PARAM_POSITION } from './constants';

/**
 * Formats log entry in a GCP compatible format.
 */
export const gcpLogEntryFormat = format(
  (info: TransformableInfo): TransformableInfo => {
    if (info.level !== 'error') {
      // TODO: return object in a compatible GCP Logging format
      return { ...info, severity: info.level };
    }

    const params = getWinstonParams(info);
    const { message, stack, timestamp, ...rest } = info;
    const { httpRequest } = params?.reduce((acc, param) => ({ ...acc, ...param })) || {};

    // GCP Error Reporting compatible format
    const errorReportingFormat = {
      eventTime: timestamp,
      severity: info.level,
      context: { httpRequest },
    };

    // No Error object provided
    if (params === undefined || !(params[ERROR_PARAM_POSITION] instanceof Error)) {
      return {
        ...rest,
        ...errorReportingFormat,
        // GCP Error Reporting won't catch the error if the message doesn't have an error stack
        message: new Error(message).stack,
      };
    }

    const error = params[ERROR_PARAM_POSITION];
    return {
      ...rest,
      ...errorReportingFormat,
      // User provided message & Error message get concatenated. Clean it up
      label: `${message.replace(error.message, '')}`,
      message: error.stack,
    };
  },
);
