# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
