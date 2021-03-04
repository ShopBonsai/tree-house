import { snakeCase, camelCase, kebabCase } from 'lodash';

import { ICasing } from '../interfaces';

export const convertCase = (str: string, format: ICasing | undefined) => {
  if (format === 'camelCase') return camelCase(str);
  if (format === 'snake_case') return snakeCase(str);
  if (format === 'kebab-case') return kebabCase(str);
  return str;
};
