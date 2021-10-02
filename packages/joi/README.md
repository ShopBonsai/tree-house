# Tree House Joi

Custom extended Joi for Typescript.

## Installation

Install via npm

```shell
import '@tree-house/joi'
```

## Usage

### Typescript

The main goal of this package is to provide extensive Typescript types for Joi based on [joi-extract-type](https://github.com/TCMiranda/joi-extract-type). By installing the module you'll automatically gain access to these types and be able to use `Joi.extractType`.

```typescript
export type MySchemaType = Joi.extractType<typeof anyJoiSchema>;
```

### validateJoiSchema

Compare any value against a Joi schema. Function will throw an error if they do not match.

```typescript
import { validateJoiSchema } from '@tree-house/joi';

// Schema
const schema = Joi.object({
  name: Joi.string()
    .required()
})

// Object to compare schema against
const myObject = {
  name: 'Hello',
}

// Will pass without issues
validateJoiSchema(myObject, schema)
```

## Bugs

When you find issues, please report them:

- web: [https://github.com/ShopBonsai/tree-house/issues](https://github.com/ShopBonsai/tree-house/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.

## Authors

See the list of [contributors](https://github.com/ShopBonsai/tree-house/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
