import * as _ from 'lodash';
import { readFiles } from './utils';

// Globally cached translations
const translator: ITranslator | any = {};

/**
 * Return translation values in-memory for a specific language
 */
export const getValues = (language: string): string => _.get(translator.values, language);

/**
 * Replace values in a string by key/value object. Use {{...}} as wrapper for these keys to replace
 * @param {String} value
 * @param {Object} dynamicValues
 */
export function replaceDynamicValues(
  value: string,
  dynamicValues: { [key: string]: string },
): string {
  return Object.keys(dynamicValues).reduce((prev, current) => {
    return prev.replace(new RegExp(`{{${current}}}`, 'g'), dynamicValues[current]);
  }, value);
}

/**
 * Returns a translator object
 * @param {String} path
 * @param {String} defaultLocale
 * @returns {Object} translator object with some functions
 */
export function getTranslator(path: string, defaultLocale: string = 'en'): ITranslator {
  if (!translator.values) {
    translator.values = readFiles(path);
  }

  return {
    translate: (
      key: string,
      language?: string,
      dynamicValues: { [key: string]: string } = {},
    ): string | null => {
      const values = getValues(language || defaultLocale);
      if (!values) {
        throw new Error(`Translation file with language ${language} not found`);
      }

      // Find the correct translation key
      const translation = _.get(values, key);
      if (!translation) {
        return null;
      }

      // Make sure to replace dynamic values
      return replaceDynamicValues(translation, dynamicValues);
    },
  };
}

export interface ITranslator {
  translate: (
    key: string,
    language?: string,
    dynamicValues?: { [key: string]: string },
  ) => string | null;
}
