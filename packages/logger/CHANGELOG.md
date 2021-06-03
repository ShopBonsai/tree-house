# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.1] - 2021-06-03

### Fixed

- `serviceContext` is no longer nested inside another `serviceContext`.

## [2.3.0] - 2021-05-19

### Fixed

- Fixed initializing multiple logger instances with different namespaces.
- Debug logs now get correctly logged to GCP logging.

## [2.2.0] - 2021-03-04

### Added

- `setup` function to manually set name & version oof the service.


## [2.1.0] - 2021-01-30

### Changed

- Upgraded `debug` from `4.1.1` to `4.3.2`
- Upgraded devDependencies
- Output Typescript target from `esnext` to `ES2019`
- Switched from `build` to `dist` as output folder. This is done internally and shouldn't affect anyone using the package.

## [2.0.0] - 2020-11-11

### Changed

- `Error` is not allowed to be passed in as the first argument anymore. You have to provide it as the second argument instead
- Log entries are being logged in JSON format when `LOG_FORMAT` is `json`
- Errors are following [GCP Error Reporting compatible format](https://cloud.google.com/error-reporting/docs/formatting-error-messages#json_representation). Make sure to provide an `Error` object as a second argument. If you'd like to provide context for http response, pass it in as an argument following your error.

## [1.2.1] - 2020-11-02

### Fixed

- Removed `undefined` from logs when only message provided.

## [1.2.0] - 2020-10-30

### Changed

- Added additional parameters logging.

## [1.1.0] - 2020-07-26

### Changed

- Updated `winston` to `3.3.3`.

## [1.0.0] - 2020-05-13

- Initial version.
