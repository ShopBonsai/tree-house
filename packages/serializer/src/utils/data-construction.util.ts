import {
  isString,
  isPlainObject,
  isArray,
  isFunction,
  isBoolean,
  isDate,
  isNumber,
  some,
  every,
} from 'lodash';

import { Serializer } from '../serializer';
import { convertCase } from './key-conversion.util';
import { ISerializerOptions, ISerializerConfig } from '../interfaces';

function isFlatValue(value: any): boolean {
  // if the value is an atomic array, return this array
  if (isArray(value)) return every(value, isString);

  return some([
    isNumber(value),
    isString(value),
    isBoolean(value),
    isDate(value),
  ], Boolean);
}

async function getValue(data: any = {}, key: string, config: { [key: string]: any }, options: ISerializerOptions): Promise<any | null> {
  if (data[key] === null) return null;

  if (config[key]) {
    if (config[key] instanceof Serializer) {
      return data[key] == null ?
        null : // Don't serialize null objects into separate null properties!
        await constructData(data[key], config[key].config, options);
    }
  }

  // if value has a callback function config
  if (isFunction(config[key])) {
    return await config[key].apply(data, [data[key], data]);
  }

  // if value is a string
  if (isFlatValue(data[key])) {
    return data[key];
  }

  // if value is an object
  if (isPlainObject(data[key])) {
    if (config[key]) return await constructData(data[key], config[key]);
    return data[key]; // if no corresponding config is found, return plain object
  }

  // if value is an array
  if (isArray(data[key])) {
    return await Promise.all(data[key].map(async (value: any) => await constructData(value, config[key])));
  }

  // If value is a mongoDB ID
  if (new RegExp('^[0-9a-fA-F]{24}$').test(data[key])) {
    return data[key];
  }

  return null;
}

export const constructData = async (data: any, customConfig: ISerializerConfig = { attributes: [] }, options: ISerializerOptions = {}):
  Promise<any> => {
  const defaultConfig: ISerializerConfig = {
    attributes: [],
  };

  const config = { ...defaultConfig, ...customConfig };

  // if the dataset is an array
  if (isArray(data)) {
    return await Promise.all(data.map(async item => await constructData(item, config, options)));
  }

  // Make sure to have support for asynchronous operations within getting value
  return await config.attributes.reduce(async (acc, key) => {
    const previousData = await acc;

    const value = await getValue(data, key, config, options);
    const formattedKey = convertCase(key, options.case);

    return Promise.resolve({
      ...previousData,
      [formattedKey]: value,
    });
  }, Promise.resolve({}));
};
