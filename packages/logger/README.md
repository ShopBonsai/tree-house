# Tree House Logger

Custom NodeJS error classes and definitions with an error parser utility function.

## Installation

Install via npm

```shell
npm install @tree-house/logger
```

or via yarn

```shell
yarn add @tree-house/logger
```

## Usage

### Setup

Service name & version (required for GCP Error Reporting) are determined by:

1. Environment variables `npm_package_name` and `npm_package_version`.
2. The options passed into the `setup` function.

The options passed into the `setup` function will override the values provided by the environment
variables (if they were populated to begin with).

To use the `setup` function to populate name & version of your service, add the following to your
startup code before using `NSLogger`:

```typescript
import { setup } from '@tree-house/logger';

// NOTE: Name & version should ideally be grabbed from `package.json`
setup({ name: 'my-service', version: '1.2.3' })
```

### Namespaces

You can use this logger with or without namespaces - namespaces help during debugging & are logged to
stdout:

```typescript
import { NSLogger, logger } from '@tree-house/logger';

NSLogger('my-namespace').info('tree house logger');
logger.info('tree house logger');
```

### Debug

You can enable/disable all/some debug logs based on `LOG_LEVEL` and `DEBUG` environment variables.
If you set `LOG_LEVEL` to `debug` (the default), you can use the `DEBUG` environment variable to
enable these based on comma-delimited names.

To skip a specific namespace: `DEBUG=*,-not_this`
To log a specific namespace: `DEBUG=this:*`
To log multiple namespaces: `DEBUG=this:*,that:*`

### Errors

#### LOG_FORMAT = simple

When `LOG_FORMAT` environment variable is not set, it defaults to `simple`. When using simple log format,
log messages are outputted on one line, while parameters are outputted on the subsequent lines.
This is ideal for a development environment.

#### LOG_FORMAT = json

When `LOG_FORMAT` environment variable is set to `json`, logs are in JSON format.
Error log entries are following [GCP Error Reporting format](https://cloud.google.com/error-reporting/docs/formatting-error-messages#json_representation). To use it, you must pass an error object while calling `.error`.
You can also provide `httpRequest` if you are logging an HTTP error:

```typescript
import { NSLogger } from '@tree-house/logger';

NSlogger('my-namespace').error(
  'tree house logger',
  new Error('Something went wrong'),
  {
    httpRequest: { responseStatusCode: 404, url: 'https://google.com', method: 'GET' },
  },
)
```

## Bugs

When you find issues, please report them:

- web: [https://github.com/ShopBonsai/tree-house/issues](https://github.com/ShopBonsai/tree-house/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.

## Authors

See the list of [contributors](https://github.com/ShopBonsai/tree-house/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
