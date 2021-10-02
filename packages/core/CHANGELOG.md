# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2021-10-02

### Breaking

- Dropped support for Node 10!

### Changed

- Upgraded `js-yaml` to 4.x
- Updated `@go-daddy/terminus`, `express-rate-limit`, `rate-limit-redis`
- Updated devDependencies to latest versions

## [2.1.1] - 2021-07-22

### Changed

- Updated route types to match express.

## [2.1.0] - 2021-06-15

### Changed

- Verified working behaviour for version checks

## [2.1.0-rc.3] - 2021-05-31

### Added

- Ability to add "catch all" endpoint if no matching routes were found.

## [2.1.0-rc.1] - 2021-05-28

### Added

- Ability to automatically enable a version endpoint
- Ability to add kubernetes readiness/liveness checks on HTTP server.

## [2.0.0] - 2021-01-30

### Breaking Changes

- Upgraded `helmet` from `3.x` to `4.x`. See [Upgrade guide](https://github.com/helmetjs/helmet/wiki/Helmet-4-upgrade-guide) for more information.

### Changed

- Upgraded `express-rate-limit` from `5.1.3` to `5.2.3`
- Upgraded `swagger-ui-express` from `4.1.4` to `4.1.6`
- Upgraded devDependencies
- Output Typescript target from `esnext` to `ES2019`
- Switched from `build` to `dist` as output folder. This is done internally and shouldn't affect anyone using the package.

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
