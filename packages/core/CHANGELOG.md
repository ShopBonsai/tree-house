# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2020-07-26

### Added

- Added custom matchers (`.enableCustomMatchers`) for jest including `.toMatchObjectInArray`.
- Added jest types for custom matchers.

### Changed

- Updated `rate-limit-redis` to `2.0.0`.

### Removed

- `https` dependency and used built-in Node `https`.

## [1.0.0] - 2020-05-12

Major breaking version!

### Removed

- [BREAKING] Removed validateSchema. This is now available through [no-hassle](https://www.npmjs.com/package/no-hassle) package. This avoids too many dependencies on different Joi versions.
- [BREAKING] Target for Typescript build from `es6` to `esnext`
- [BREAKING] Removed support for Node 6 and Node 8
- [BREAKING] renamed `handleAsyncFn` to `tryCatchRoute`

### Added

- Support for custom logger when starting server. Extra option when calling `startServer(app, { logger: })`.
- Added prettierrc.js for Prettier IDE support

### Changed

- Give warning when using `setSwagger` since this has become deprecated due to [no-hassle](https://www.npmjs.com/package/no-hassle) package.
