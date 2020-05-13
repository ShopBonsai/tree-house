# Tree House Serializer

De/serialize json for consistency!

- [Installation](#installation)
- [Serializer](#serializer)
- [Serializer instance](#serializer-instance)
- [ErrorSerializer](#errorserializer)
- [Examples](#examples)

## Installation

Install via npm

```shell
npm install @tree-house/serializer
```

or via yarn

```shell
yarn add @tree-house/serializer
```

## Serializer

### `constructor`

```javascript
const mySerializer = new Serializer(resource, configuration, options);
```

#### Arguments

`resource (string)`: Name of the resource being serialized

`configuration (Object)`: Configuration for serialisation

`options (Object)`: Extra options for the serializer (optional)

Configuration:

- `attributes (Array)`: attributes to serialize

Options:

- `case`: Convert the case of the keys of `data`
- `Undefined`: Doesn't convert the case
- `camelCase`: Converts keys to camelCase
- `snake_case`: Converts keys to snake_case
- `kebab-case`: Converts keys to kebab-case

#### Returns

Returns an instance of a custom serializer, ready to use for serializing data.

## Serializer instance

### `serialize` - asynchronous

```javascript
await mySerializer.serialize(data, configuration);
```

#### Arguments

`data (Object|Array)`: Dataset to serialize.

`configuration (Object)`: Configuration for serialisation

- `totalCount (Number) *optional`: When serializing an array, the totalCount is part of the meta object. If no totalCount is configured, the length of the provided dataset is used.

Besides `totalCount`, `configuration ` may be used to extend the `meta` response object with arbitrary keys. The `type` key however, cannot be overwritten.

#### Returns

Returns a serialized data respresentation of the given data.

## ErrorSerializer

### `serialize`

#### Arguments

`error (Object|Array)`: Error(s) to serialize.

```javascript
const errors = ErrorSerializer.serialize([error]);
```

#### Returns

- `errors (Object)`: object containing multiple errors.

Every error can have these properties:

| key  |  |
|---|---|
| status | required |
| title | required |
| id  | optional |
| code | optional, application specific |
| detail | optional |
| meta | optional |

##### Example

```json
{
  "errors": [
    {
      "id": "ba4b9f14-5b83-4dfd-ac46-1c3868e1b3ec",
        "status": 400,
        "code": "2006",
        "title": "Article not found",
        "detail": "Article with id 892bb574-090d-4d63-a5b5-cb928d5f5c5f not found",
        "meta": {
          "stack": "NotFoundError: ..."
        }
    }
  ]
}
```

## Examples

### Basic example

#### Create a serializer

```javascript
const { Serializer } = require('tree-house-serializer');

const userSerializer = new Serializer('user', {
  attributes: ['firstName', 'lastName', 'address'],
  address: {
    attributes: ['street', 'number'],
  },
});
```

#### Serialize a single resource

```javascript
const data = {
  firstName: 'John',
  lastName: 'Doe',
  age: 27,
  address: {
    street: 'Markt',
    number: '100',
    city: 'Zonnedorp',
    country: 'Belgium',
  },
};

const result = await userSerializer.serialize(data);

// result:
// {
//   meta: {
//     type: 'user'
//   },
//   data: {
//     firstName: 'John',
//     lastName: 'Doe',
//     address: {
//       street: 'Markt',
//       number: '100',
//     }
//   }
// }
```

#### Serialize a list of resources

```javascript
const data = [
	{
	  firstName: 'John',
	  lastName: 'Doe',
	  age: 27,
	  address: {
	    street: 'Markt',
	    number: '100',
	    city: 'Zonnedorp',
	    country: 'Belgium',
	  },
	}, {
	  firstName: 'Jessie',
	  lastName: 'Doe',
	  age: 26,
	  address: {
	    street: 'Marketstreet',
	    number: '101',
	    city: 'Sunvillage',
	    country: 'United Kingdom',
	  },
	}
];

const result = await userSerializer.serialize(data, { totalCount: 91 });

// result:
// {
//   meta: {
//     type: 'user',
//     count: 2,
//     totalCount: 91
//   },
//   data: [
//     {
//       firstName: 'John',
//       lastName: 'Doe',
//       address: {
//         street: 'Markt',
//         number: '100'
//       }
//     },
//     { ... },
//   ]
// }
```

#### Extend the meta object

```javascript
const data = [
	{
	  firstName: 'John',
	  lastName: 'Doe',
	  age: 25,
	  address: {
	    street: 'Markt',
	    number: '100',
	    city: 'Zonnedorp',
	    country: 'Belgium',
	  },
	}, {
	  firstName: 'Jessie',
	  lastName: 'Doe',
	  age: 27,
	  address: {
	    street: 'Marketstreet',
	    number: '101',
	    city: 'Sunvillage',
	    country: 'United Kingdom',
	  },
	}
];

const result = await userSerializer.serialize(data, { totalCount: 91, averageAge: 26 });

// result:
// {
//   meta: {
//     type: 'user',
//     count: 2,
//     totalCount: 91
//     averageAge: 26
//   },
//   data: [
//     {
//       firstName: 'John',
//       lastName: 'Doe',
//       address: {
//         street: 'Markt',
//         number: '100'
//       }
//     },
//     { ... },
//   ]
// }
```

### Example using a nested serializer

```javascript
const { Serializer } = require('tree-house-serializer');

const addressSerializer = new Serializer('address', {
  attributes: ['street', 'number'],
});

const userSerializer = new Serializer('user', {
  attributes: ['firstName', 'lastName', 'address'],
  address: addresssSerializer,
});

const data = {
  firstName: 'John',
  lastName: 'Doe',
  age: 27,
  address: {
    street: 'Markt',
    number: '100',
    city: 'Zonnedorp',
    country: 'Belgium',
  },
};

const result = await userSerializer.serialize(data);

// result:
// {
//   meta: {
//     type: 'user'
//   },
//   data: {
//     firstName: 'John',
//     lastName: 'Doe',
//     address: {
//       street: 'Markt',
//       number: '100'
//     }
//   }
// }
```
### Example using a case option

```javascript
const { Serializer } = require('tree-house-serializer');

const userSerializer = new Serializer(
  'user', 
  { attributes: ['firstName', 'lastName', 'age', 'greeting'] },
  { case: 'snake_case' },
);

const data = {
  firstName: 'John',
  lastName: 'Doe',
  age: '27',
};

const result = await userSerializer.serialize(data);

// result:
// {
//   meta: {
//     type: 'user'
//   },
//   data: {
//     first_name: 'John',
//     last_name: 'Doe',
//     age: '27 years old'
//     greeting: 'Hello, I\'m John Doe',
//   }
// }
```

### Example using a function to transform one property

```javascript
const { Serializer } = require('tree-house-serializer');

const userSerializer = new Serializer('user', {
  attributes: ['firstName', 'lastName', 'age', 'greeting'],
  age: val => `${val} years old`,
  greeting: (v, data) => `Hello, I'm ${data.firstName} ${data.lastName}`,
});

const data = {
  firstName: 'John',
  lastName: 'Doe',
  age: '27',
};

const result = await userSerializer.serialize(data);

// result:
// {
//   meta: {
//     type: 'user'
//   },
//   data: {
//     firstName: 'John',
//     lastName: 'Doe',
//     age: '27 years old'
//     greeting: 'Hello, I\'m John Doe',
//   }
// }
```

### Example serializing an error

```javascript
const { ErrorSerializer } = require('tree-house-serializer');
const errorResponse = ErrorSerializer.serialize(ex);
```

## Bugs

When you find issues, please report them:

- web: [https://github.com/knor-el-snor/tree-house/issues](https://github.com/knor-el-snor/tree-house/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.

## Authors

See the list of [contributors](https://github.com/knor-el-snor/tree-house/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
