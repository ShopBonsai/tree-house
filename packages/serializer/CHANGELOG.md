# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2023-11- 13

### Breaking

- Dropped support for Node 16!

### Changes

- Add ability to pass `skip` as an option to allow raw data being returned without serialization. Can be useful during migration when not all serializers are set up.

## [2.4.0] - 2021-10-02

### Breaking

- Dropped support for Node 10!

## [2.0.0] - 2021-10-02

### Breaking

- Dropped support for Node 10!

### Changed

- Updated `lodash` dependency version
- Updated devDependencies to latest versions

## [1.1.0] - 2021-01-30

### Changed

- Upgraded `lodash` from `4.17.19` to `4.17.20`
- Upgraded devDependencies
- Output Typescript target from `esnext` to `ES2019`
- Switched from `build` to `dist` as output folder. This is done internally and shouldn't affect anyone using the package.

## [1.0.3] - 2020-07-26

### Changed

- Updated `lodash` to `4.17.19`

## [1.0.0] - 2020-05-12

- Initial release under scoped package and monorepository.
