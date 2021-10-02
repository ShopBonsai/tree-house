# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2021-10-02

### Breaking

- Dropped support for Node 10!

### Changed

- Updated `express-session`
- Updated devDependencies to latest versions

## [2.3.0] - 2021-01-30

### Changed

- Upgraded `jwks-rsa` from `1.8.1` to `1.12.2`
- Upgraded devDependencies
- Output Typescript target from `esnext` to `ES2019`
- Switched from `build` to `dist` as output folder. This is done internally and shouldn't affect anyone using the package.

## [2.2.0] - 2021-01-25

### Changed

- Replace `bcrypt` with `bcrypt.js`.

## [2.1.0] - 2020-07-26

### Changed

- Update `bcrypt` to `5.0.0`.

## [2.0.0] - 2020-05-20

### Removed

- Removed `authenticateJwt` in favor of `verifyJwt`.

### Changed

- Correct types for `verifyJwt` allowing all jsonwebtoken opetions.

## [1.0.3] - 2020-05-20

### Changed

- Added better types for jwt functions.

## [1.0.0] - 2020-05-12

### Removed

- [BREAKING] Removed saml support. Shouldn't be in here by default. Moving it to separate package.
- [BREAKING] Removed ldap support. Shouldn't be in here by default. Moving it to separate package.
