import { format } from 'winston';

import { emojiLevelFormat } from './common';
import { gcpLogEntryFormat } from './gcp';

/**
 * Formats the log entry in a JSON friendly format.
 */
export const jsonFormat = () => [
  gcpLogEntryFormat(),
  emojiLevelFormat(),
  format.json(),
];
