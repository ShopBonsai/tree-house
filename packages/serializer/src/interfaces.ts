import { Serializer } from './serializer';

export interface ISerializerConfig {
  attributes: string[];
  [key: string]: Serializer | Function | string[] | ISerializerConfig;
}

export interface ISerializerOptions {
  case?: ICasing;
  skip?: boolean;
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
