# Changelog

**English** · [Español](CHANGELOG.es.md)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.5] - 2026-10-27

### Fixed

- Updated the quality CI workflow to Node 22 so `chromedriver@156` engine requirements are satisfied, added a `browser-driver-manager install chrome` step to synchronize the Chrome and ChromeDriver versions before the axe-core WCAG audit, and installed `@playwright/test@1.48.2` locally so `import { test, expect }` in the E2E spec resolves correctly at runtime.
- Added WebKit to the Playwright browser install step (`chromium webkit`) and specified `--browser chromium` for the Desktop Chrome screenshot so both device emulations (Desktop Chrome via Chromium, iPhone 13 via WebKit) have their required browser available.
- Replaced the dynamic `getByRole("button", { name: "Eliminar" })` locator in the preset-removal E2E test with the stable `.preset-remove` CSS selector to prevent the locator from losing the element after the confirmation text changes.
- Changed the onboarding translation assertion from `toHaveText` to `toContainText` for `.workflow-shortcuts`, which contains multiple shortcut entries.
- Extended `parseJson` in `web/assets/js/utils.js` and `packages/core/json.js` with a lightweight manual JSON scanner as a final fallback for V8 engine versions (Chrome 109+) whose `JSON.parse` error messages do not include a character position, ensuring line and column information always appears in the input status.
- Removed the unnecessary `\-` escape character from the numeric regex character class in both JSON parsing modules.

## [1.3.4] - 2026-10-27

### Changed

- Refined and synchronized the PayloadForge visual identity across the web PWA, Browser Extension, VS Code extension, Marketplace assets, favicons, maskable icons, and GitHub Pages output.
- Documented the master artwork, approved variants, color system, platform exports, and cross-surface synchronization rules in the READMEs and design system.

## [1.3.3] - 2026-10-27

### Fixed

- Replaced the Favorites and Recent navigation `group` roles with native labelled sections, preserving accessible names while resolving the SonarQube semantic-HTML warning.

## [1.3.2] - 2026-10-27

### Fixed

- Improved contrast for the global-search keyboard hint and editor footer status, cursor-position, tab-hint, and output-status indicators to meet WCAG 2 AA requirements.
- Assigned semantic group roles to the Favorites and Recent navigation containers so their accessible labels are valid.

## [1.3.1] - 2026-10-27

### Added

- A prominent **Open full application** action in the browser-extension popup. It opens the public PayloadForge PWA, providing access to the complete toolset from the quick-action extension.
- Generated distributable extension artifacts: `extensions/payloadforge-browser.zip` for Chromium-based browsers and `extensions/payloadforge-vscode.vsix` for Visual Studio Code.
- A dedicated **PayloadForge** Activity Bar icon and Toolkit view in the VS Code extension, with direct actions to open the toolkit and preferences.

### Changed

- Updated the VS Code extension manifest with Marketplace discovery metadata and an extension-specific README that documents features, commands, privacy behavior, and access instructions.
- Updated English and Spanish installation documentation to distinguish browser-extension quick actions from the full web application, document package locations and installation workflows, and describe opening PayloadForge from the VS Code Activity Bar.

## [1.3.0] - 2026-10-26

### Added

- Premium developer-tool workspace with compact productivity navigation, persistent Favorites and Recent tools, contextual onboarding, and an expanded Command Palette.
- Enterprise editor utilities: synchronized line numbers and JSON highlighting, `Ctrl/Cmd + F` search, next/previous match navigation, `Ctrl/Cmd + G` Go to Line, real-time cursor line/column reporting, and automatic focus/selection for syntax errors with line and column diagnostics.
- Local-first workflow actions: use a generated result as the next input without persisting it, plus explicit local presets scoped to the active tool.
- Per-tool preset save, load, export/import, removal, and clear-active-set workflows, with two-step confirmation before clearing the active set. Presets are limited to 20 per tool, 200 KB per preset, and 1 MB per imported file; they store only name, tool, input, and local timestamp.
- Complete English/Spanish translations for onboarding and preset-management flows.
- `docs/DESIGN-SYSTEM.md` and `CONTRIBUTING.md` with component contracts, design tokens, accessibility expectations, local storage policies, and contribution checks.
- Core/smoke coverage for all core transform families and Playwright E2E product-flow coverage for favorites, recents, onboarding, i18n, editor navigation, local chaining, presets, and error recovery.
- GitHub Actions quality gates for Lighthouse CI, axe-core WCAG 2 A/AA checks, Playwright product flows, and desktop/mobile visual review artifacts.
- Visual-baseline comparison tooling and initialization guidance for approved desktop and mobile screenshots.

### Changed

- Redesigned the web shell with layered surfaces, responsive behavior, compact navigation feedback, premium action hierarchy, and improved editor focus/error states.
- Unified Pages packaging and CI site assembly through `scripts/build-site.mjs`.
- Refactored client navigation, search status, command-action dispatch, and visual-baseline comparison to improve maintainability and static-analysis compliance.
- Updated quality validation to include the site build, smoke coverage, browser accessibility auditing, visual artifacts, and baseline diffs.

## [1.2.0] - 2026-10-26

### Added

- Advanced local JSON Schema validation with `$ref`/`$defs`, combinators, formats, unique arrays, dependencies, conditionals, and additional-property rules.
- Extended JSON Schema fixtures with local references, schema alternatives, and UUID, URI, IPv4, and hostname formats.
- OpenAPI endpoint details with resolved local references, parameters, request bodies, responses, filtering, and Fetch/cURL snippet copying.
- Preferences for system theme, density, editor font size, and line wrapping.
- Opt-in, metadata-only local activity history that never stores payloads or generated results.
- Premium Preferences experiences across all three distribution surfaces: the responsive web modal, the browser-extension popup, and a VS Code Preferences webview opened with `PayloadForge: Open Preferences`.
- Persistent extension preferences for theme, density, editor font size, line wrapping, syntax highlighting, and opt-in local history, backed by `chrome.storage.local` in the browser extension and VS Code `globalState`.

### Changed

- Refined Preferences controls with a larger, more legible editor-font input and left-aligned line-wrap and local-history checkboxes.
- Redesigned the Preferences dialog with grouped appearance, editor, and privacy sections; responsive controls; a clearer activity summary; and improved focus and visual hierarchy.
- Aligned Preferences interaction, accessibility, local-history privacy, confirmation feedback, and reduced-motion support across the web app and both extensions.
- Improved native select controls with themed surfaces, custom chevrons, hover and focus-visible states, and selected-option colors for both tool options and the language picker.
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
