# Tree House Translations

NodeJS tranlations utilities for JSON files.

## Installation

Install via npm

```shell
npm install @tree-house/translations
```

or via yarn

```shell
yarn add @tree-house/translations
```

## NodeJS

### getTranslator

Initialise a translator object pointing to the `.json` files where are translations are being stored and set a default locale. This object contains all functions which you can use after initialisation.

This becomes a singleton instance which will cache your translations globally. **It is not possible at the moment to store translations into different folders.**

```javascript
import { getTranslator } from '@tree-house/translations';

const translator = getTranslator('/locales', 'en');
translator.translate(...);
```

> The name of the translation file needs to match the language name.
> For example: /locales/en.json -> en

### .translate

After initialising the translator you can easily find a translation value by its key for the required language in your localisation files.

```javascript
translator.translate('key_to_translate', 'nl');
```

You can also replace values by using `{{}}` in your string values in the translation files.

```javascript
translator.translate('key_to_translate', 'en', { name: 'Brent' });
```

> This is my new sentence from {{name}} -> This is my new sentence from Brent

## Tests

- You can run `npm run test` to run all tests
- You can run `npm run test:coverage` to run all tests with coverage report

## Bugs

When you find issues, please report them:

- web: [https://github.com/knor-el-snor/tree-house/issues](https://github.com/knor-el-snor/tree-house/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.

## Authors

See the list of [contributors](https://github.com/knor-el-snor/tree-house/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
