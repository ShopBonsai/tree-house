import * as utils from '../../src/lib/utils';
import { replaceDynamicValues } from '../../src/lib/translator';
import { getTranslator } from '../../src';

describe('translator', () => {
  const readSpy = jest.spyOn(utils, 'readFiles');

  afterEach(() => {
    readSpy.mockClear();
  });

  describe('getTranslator', () => {
    it('Should configure i18n and return instance after first time', () => {
      const result = getTranslator('tests/assets');
      getTranslator('tests/assets'); // translator is a singleton, so getTranslator should still be haveBeenCalledTimes = 1
      expect(result).toHaveProperty('translate');
      expect(readSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('translate', () => {
    const translator = getTranslator('tests/assets');

    it('Should succesfully translate text into chosen language', () => {
      const translation = translator.translate('authentication_failed', 'en');
      expect(translation).toEqual('An error occurred trying to authenticate your request.');

      const nlTranslation = translator.translate('authentication_failed', 'nl');
      expect(nlTranslation).toEqual('Authenticatie mislukt');
    });

    it('Should succesfully translate text into default language', () => {
      const translation = translator.translate('authentication_failed');
      expect(translation).toEqual('An error occurred trying to authenticate your request.');
    });

    it('Should throw an error when language file was not found', () => {
      expect.assertions(2);
      try {
        translator.translate('my_key', 'pl');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('Translation file with language pl not found');
      }
    });

    it('Should return null when no translation was found', () => {
      expect(translator.translate('unknown_key', 'en')).toBeNull();
    });
  });

  describe('replaceDynamicValues', () => {
    it('Should replace keys with dynamic value', () => {
      const str = 'This is a string which to replace {{a}} with {{b}} and again {{a}}';
      const result = replaceDynamicValues(str, { a: 'yes', b: 'no' });
      expect(result).toEqual('This is a string which to replace yes with no and again yes');
    });

    it('Should return the original string when passing empty object', () => {
      const str = 'This has no values to replace';
      const result = replaceDynamicValues(str, {});
      expect(result).toEqual('This has no values to replace');

    });
  });
});
