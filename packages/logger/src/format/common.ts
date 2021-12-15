import { TransformableInfo } from 'logform';
import { format } from 'winston';

import { ENV } from '../constants';
import { LEVEL_EMOJI } from './constants';
import { getWinstonParams, stringifyParams } from './helpers';

/**
 * Returns emoji format based on level.
 */
export const emojiLevelFormat = format(
  (info: TransformableInfo): TransformableInfo => {
    const { level } = info;
    const emoji = LEVEL_EMOJI[level] || LEVEL_EMOJI.default;
    return { ...info, level: `${emoji} ${level}` };
  },
);

/**
 * Formats parameters by splitting them into multiple strings.
 */
const paramsFormat = format(
  (info: TransformableInfo, { logFormat }): TransformableInfo => {
    const winstonParams = getWinstonParams(info);
    const stringParams = stringifyParams(winstonParams, logFormat);
    return { ...info, params: stringParams };
  },
);

export const commonFormat = () => [
  format.timestamp({ alias: 'timestamp' }),
  paramsFormat({ logFormat: ENV.logFormat }),
];
