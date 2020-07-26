# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2020-07-26

### Added

- Added custom error matchers (`.enableErrorMatchers`) for jest including `.toThrowApiError`.
- Added jest types for custom matchers.

### Changed

- Updated `i18n` to `0.10.0`.
- Updated `uuid` to `8.2.0`.

## [1.1.0] - 2020-05-19

### Added

- Replace `icapps-tree-house-translations` with `@tree-house/translations`.

## [1.0.0] - 2020-05-12

Major breaking version!

### Removed

- [BREAKING] Removed support for `express-validation` errors. Default support is `celebrate` now.
