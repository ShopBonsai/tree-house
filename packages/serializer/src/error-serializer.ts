import { pick, isPlainObject } from 'lodash';

import { IErrorDefinition } from './interfaces';

function constructError(data: IErrorDefinition): Partial<IErrorDefinition> {
  const requiredProps = ['title', 'status'];
  const optionalProps = ['id', 'code', 'detail', 'url', 'meta'];

  requiredProps.forEach((prop) => {
    if (!Object.keys(data).includes(prop)) {
      throw new Error(`ErrorSerializer requires property ${prop}`);
    }
  });

  return {
    ...pick(data, requiredProps),
    ...pick(data, optionalProps),
  };
}

function constructErrors(data: any): Partial<IErrorDefinition>[] {
  if (isPlainObject(data)) {
    return [constructError(data)];
  }

  return data.map(constructError);
}

export class ErrorSerializer {
  constructor() {
    throw new Error('ErrorSerializer instances are not implemented');
  }

  static serialize(data: any): { errors: Partial<IErrorDefinition>[] } {
    return {
      errors: constructErrors(data),
    };
  }
}
