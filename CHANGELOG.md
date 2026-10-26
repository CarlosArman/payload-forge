# Changelog

**English** · [Español](CHANGELOG.es.md)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Advanced local JSON Schema validation with `$ref`/`$defs`, combinators, formats, unique arrays, dependencies, conditionals, and additional-property rules.
- Extended JSON Schema fixtures with local references, schema alternatives, and UUID, URI, IPv4, and hostname formats.
- OpenAPI endpoint details with resolved local references, parameters, request bodies, responses, filtering, and Fetch/cURL snippet copying.
- Preferences for system theme, density, editor font size, and line wrapping.
- Opt-in, metadata-only local activity history that never stores payloads or generated results.

### Changed

- Fixed shared-core imports and Service Worker precache paths in the GitHub Pages artifact so the PWA resolves modules correctly under the `/payload-forge/` deployment path while local development paths remain unchanged.
- Enriched JSON Schema Validator results with path-level copy controls.
- Rotated the PWA offline cache to `payloadforge-v36`.

## [1.1.0] - 2026-10-25

### Added

- Regex Tester with configurable flags, capture groups, match positions, and a safe 500-match limit.
- Secrets Redactor for local masking of Bearer tokens, API keys, JWTs, private keys, and email addresses.
- JSON → TypeScript generator with nested object, array, union, and quoted-property inference.
- cURL → Fetch converter for common methods, headers, and request bodies.
- JSON Schema Validator for local type, required field, enum, const, object, array, number, and string constraint checks.
- JSON Schema Fixtures generator for producing up to 100 local fixtures.
- OpenAPI Explorer for listing local OpenAPI 3.x and Swagger 2.0 operations.
- Functional VS Code selection commands for JSON format/minify, Base64 encoding, secret redaction, and JSON → TypeScript.
- Functional browser extension popup with JSON formatting, Base64 encoding, secret redaction, copy support, and a selection context-menu action.
- JWT Inspector that decodes JWT headers and payloads locally, recognizes `Bearer` prefixes, exposes standard timestamp claims, and reports malformed token errors.
- JWT unit tests covering valid tokens, standard claims, `Bearer` prefixes, and malformed inputs.
- Encoder / Decoder for local UTF-8 Base64, Base64URL, and URL encoding transformations.
- Unit tests for Base64 UTF-8 round trips, Base64URL without padding, and malformed encoded values.
- UUID Generator / Validator with batch generation from 1 to 1,000 UUID v4 values and pasted-list validation.
- UUID unit tests covering v4 recognition, other UUID versions, invalid input, and batch generation.

### Changed

- Added contextual empty states to the output editor with focused guidance for schemas, JWTs, encoding, UUIDs, comparisons, and diffs.
- Made the desktop action bar sticky to keep primary actions available while scrolling; mobile retains its natural, touch-friendly flow.
- Updated the PWA cache to `payloadforge-v8` for the refreshed interface.
- Adapted the UUID workflow: generation now disables the unnecessary input editor and emphasizes batch size, while validation restores the list editor and input guidance.
- Updated the PWA cache to `payloadforge-v9` for the adaptive UUID interaction.
- Enhanced the command palette with Run, Load example, Clear, Copy result, and Switch theme actions.
- Added mobile Input/Output editor tabs that automatically switch to results after a successful run.
- Updated the PWA precache and rotated it to `payloadforge-v18`.
- Added `packages/core/` for shared, browser-safe secrets redaction and JSON → TypeScript inference.
- Migrated PWA adapters and unit tests to consume the shared core transforms.
- Updated the GitHub Pages artifact to publish `packages/` alongside the PWA and rotated the offline cache to `payloadforge-v19`.
- Extracted UTF-8 Base64/Base64URL helpers and cURL → Fetch parsing into `packages/core/`, with PWA adapters and unit tests consuming the shared implementations.
- Updated the PWA precache for the new core modules and rotated the offline cache to `payloadforge-v21`.
- Consolidated the remaining PWA transform logic in `packages/core/`: JSON formatting, JSONPath, JSON Schema generation/validation/fixtures, JSON comparison, YAML, XPath, JWT, UUID, Regex, OpenAPI, and mock data.
- Added `packages/core/index.js` as the public ESM entry point and `packages/core/package.json` to preserve ESM semantics in synchronized extension copies.
- Added `scripts/sync-core.mjs` plus CI checks that synchronize and import the shared core for browser and VS Code extensions.
- Updated the browser extension popup and VS Code commands to use their synchronized shared core copies; VS Code loads ESM through dynamic `import()`.
- Added extension package synchronization to the VS Code packaging lifecycle and documented the release workflow.
- Rotated the PWA offline cache to `payloadforge-v35`.

## [1.0.0] - 2026-10-25

### Added

- Initial public release of PayloadForge.
- Offline-first, dependency-free API payload toolkit built with HTML5, CSS3, and JavaScript ES2023.
- JSON Schema Generator with support for inferred primitive values, nested objects, arrays, and nullable values.
- JSONPath Explorer with up to 1,000 generated paths, filtering, and copy actions.
- JSON Formatter with beautify, minify, validation, and line/column error reporting.
- Local bidirectional JSON ↔ YAML conversion.
- XML → XPath generator with indexed element paths, attributes, filters, copy actions, and namespace prefix preservation.
- JSON Compare for deep added, removed, and modified value summaries.
- JSON Diff with Git-style semantic change rendering.
- Mock Data Generator for producing 1 to 1,000 fixtures.
- Keyboard shortcuts, including `Ctrl/Cmd + K`, `Ctrl + Enter`, and editor indentation with `Tab`.
- Enhanced editors with line numbers, JSON semantic highlighting, synchronized scrolling, drag and drop, local file import, and session-only drafts.
- Persistent dark/light themes and responsive desktop/mobile navigation.
- PWA support through a web manifest, icons, and a Service Worker for offline use after the first HTTP/HTTPS load.
- Accessibility features including semantic landmarks, focus management, visible focus states, live regions, keyboard navigation, and reduced-motion support.
- Unit tests and a CI command through `npm run ci`.
