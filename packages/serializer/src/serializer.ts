import { isNil } from 'lodash';

import * as errors from './errors';
import { ISerializerOptions, ISerializerConfig, ISerializedResponse, IMeta } from './interfaces';
import { constructData } from './utils/data-construction.util';
import { constructMeta } from './utils/meta-construction.util';

const defaultConfig: ISerializerConfig = {
  attributes: [],
};

export class Serializer {
  public resource: string;
  public config: ISerializerConfig;
  public options: ISerializerOptions;

  constructor(resource: string, config: ISerializerConfig, options: ISerializerOptions = {}) {
    // guards
    if (!resource || isNil(resource)) {
      throw new errors.UndefinedResourceError();
    }

    this.resource = resource;
    this.options = options;
    this.config = { ...defaultConfig, ...config };
  }

  async serialize(data: any, dataSetConfig: IMeta = {}): Promise<ISerializedResponse> {
    return {
      meta: constructMeta(data, this.resource, dataSetConfig),
      data: await constructData(data, this.config, this.options),
    };
  }
}
