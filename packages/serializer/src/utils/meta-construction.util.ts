import { isNil, omit, isArray } from 'lodash';

import { IMeta } from '../interfaces';

const getTotalCount = (data: any, totalCount: number | null) =>
  isNil(totalCount) ? data.length : totalCount;

export const constructMeta = (data: any, resource: string, config: IMeta = {}): IMeta => {
  const meta = {
    type: resource,
    ...omit(config, ['type']),
  };

  if (isArray(data)) {
    return Object.assign(
      meta,
      {
        count: data.length,
        totalCount: getTotalCount(data, config.totalCount),
      },
    );
  }

  return meta;
};
