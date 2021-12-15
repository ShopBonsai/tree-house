import { format } from 'winston';

import { emojiLevelFormat } from './common';

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
