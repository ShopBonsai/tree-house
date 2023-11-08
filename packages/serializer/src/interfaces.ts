import { Serializer } from './serializer';

type Attribute<K> = {
  attributes: [keyof K][];
}

// type SerializedInfo<T, K> = keyof T;

type KeyOfSerializer<T> = T;

export type ISerializerConfig <T, K extends keyof T> = Attribute<K> & {
  // attributes: K[];
  // fields : [key:K]: string[],
  // [Object.keys as <T>(obj: T) => Array<keyof T>  ]: any; // Serializer<K> | Function | string[] | ISerializerConfig<K>;
  // [key: string]: Serializer<keyof T> | Function | string[] | ISerializerConfig<keyof T>;

  [key in KeyOfSerializer<K>]: any;
}

export interface ISerializerOptions {
  case?: ICasing;
}

export interface ISerializedResponse {
  meta: IMeta;
  data: any;
}

export interface IMeta {
  type?: string;
  count?: number;
  totalCount?: number;
  [key: string]: any; // Additional properties put onto meta
}

export interface IErrorDefinition {
  title: string;
  status: number;
  id?: string;
  code?: string;
  detail?: any;
  url?: string;
  meta?: any;
}

export type ICasing = 'camelCase' | 'snake_case' | 'kebab-case';
