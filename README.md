# 🛠️ PayloadForge

<p align="center">
  <img src="https://img.shields.io/badge/Version-1.3.1-blueviolet" alt="Version 1.3.1" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript ES2023" />
  <img src="https://img.shields.io/badge/Architecture-Vanilla%20ESM-0b6e4f" alt="Vanilla ESM architecture" />
  <img src="https://img.shields.io/badge/Offline-first-2ea44f" alt="Offline first" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PWA-Installable-5c2d91" alt="Installable PWA" />
  <img src="https://img.shields.io/badge/Platforms-Web%20%7C%20Browser%20Extension%20%7C%20VS%20Code-0969da" alt="Supported platforms" />
  <img src="https://img.shields.io/badge/Privacy-Local%20processing-success" alt="Local processing" />
  <img src="https://img.shields.io/badge/Status-Active%20development-yellow" alt="Active development" />
</p>

<p align="center"><strong>🌐 Language / Idioma</strong></p>

<p align="center">
  <a href="./README.md">🇬🇧 English</a> &nbsp;|&nbsp; <a href="./README.es.md">🇪🇸 Español</a>
</p>

<p align="center">
  <strong>Generate, transform, compare, and validate API payloads locally.</strong><br />
  Built with <strong>HTML5, CSS3, and vanilla JavaScript ES2023</strong>; available as a <strong>web PWA</strong>, <strong>browser extension</strong>, and <strong>VS Code extension</strong>.
</p>

---

PayloadForge is an offline-first developer toolkit for API payloads. It helps developers, QA engineers, and API teams inspect, transform, validate, generate, and compare structured data without sending payloads to a server or depending on external runtime services.

---

## 🎯 Why this project matters

This project demonstrates how to build a **multi-surface developer productivity tool** with native browser capabilities and reusable JavaScript modules:

- A framework-free, dependency-free web application built with ES modules.
- A shared, browser-safe core reused by the PWA, browser extension, and VS Code extension.
- Local API-data workflows for JSON, YAML, XML, JWT, OpenAPI, regular expressions, schemas, and secrets.
- Offline support through a Progressive Web App and Service Worker.
- Accessible interaction patterns: semantic landmarks, keyboard navigation, dialogs, focus management, live regions, and reduced-motion support.
- Privacy-first operation: payloads are processed in the browser and optional history stores metadata only.

The result is a practical example of **offline-first frontend engineering for API and QA workflows**.

---

## 🚀 Project overview

This repository provides PayloadForge through three distribution surfaces:

- A **public web application** and installable PWA.
- A **Manifest V3 browser extension** for focused JSON formatting, Base64 encoding, secret redaction, and selection actions; its popup links directly to the complete web application.
- A **VS Code extension** with selection commands for JSON formatting/minification, Base64, secret redaction, and JSON → TypeScript.

The solution combines local parsing and transformation utilities, reusable core modules, a responsive single-page interface, synchronized editors, and CI validation.

🔗 **Live web application:** [carlosarman.github.io/payload-forge](https://carlosarman.github.io/payload-forge/)  
🔗 **Web application source:** [`web/`](./web/)  
🔗 **Browser extension:** [`browser-extension/`](./browser-extension/)  
🔗 **VS Code extension:** [`vscode-extension/`](./vscode-extension/)  
🔗 **Shared core:** [`packages/core/`](./packages/core/)  
🔗 **Spanish README:** [`README.es.md`](./README.es.md)  
🔗 **Changelog:** [`CHANGELOG.md`](./CHANGELOG.md) · [Spanish changelog](./CHANGELOG.es.md)

---

## 🧩 Core features

### 📦 JSON and API data tools

- **JSON Schema Generator:** infers primitive values, nested objects, arrays, nullable values, and common JSON structures.
- **JSONPath Explorer:** generates up to 1,000 JSONPaths, filters paths, and supports individual path copying.
- **JSON Formatter:** beautifies, minifies, and validates JSON with actionable line and column errors.
- **JSON → TypeScript:** infers TypeScript interfaces and types from JSON payloads, including nested objects, arrays, unions, and quoted properties.
- **JSON Compare:** reports deep additions, removals, and modifications with a visual summary.
- **JSON Diff:** renders Git-style semantic changes with addition, removal, and modification states.

### 🔄 Local transformations

- **JSON ↔ YAML:** converts common API payloads in both directions without a runtime dependency.
- **XML → XPath:** parses XML and generates indexed element and attribute paths while retaining namespace prefixes.
- **JWT Inspector:** decodes headers and payloads locally, recognizes `Bearer` prefixes, and presents standard timestamp claims. It does not verify signatures.
- **Encoder / Decoder:** supports UTF-8 Base64, Base64URL, and URL encoding/decoding.
- **Secrets Redactor:** masks Bearer tokens, API keys, JWTs, private keys, and email addresses locally.
- **cURL → Fetch:** converts common cURL requests into JavaScript Fetch calls.

### ✅ Validation and testing

- **JSON Schema Validator:** validates local `$ref`/`$defs`, combinators, formats, dependencies, conditionals, arrays, scalar constraints, and additional-property rules.
- **JSON Schema Fixtures:** generates up to 100 local fixtures, including schemas with references, alternatives, and selected formats.
- **OpenAPI Explorer:** inspects local OpenAPI 3.x and Swagger 2.0 documents, resolving local references and exposing operations, parameters, request bodies, responses, and Fetch/cURL snippets.
- **Regex Tester:** evaluates patterns with configurable flags, captured groups, match positions, and a safe 500-match limit.
- **UUID Generator / Validator:** generates batches of 1 to 1,000 UUID v4 values or validates a pasted list.
- **Mock Data Generator:** creates 1 to 1,000 local fixtures with UUID, identity, email, phone, address, and date fields.

### 🧠 Productive and accessible workspace

- Synchronized line numbers and local JSON syntax highlighting.
- File import and drag-and-drop support for `.json`, `.yaml`, `.yml`, `.xml`, and `.txt` files, with a 1 MB limit.
- Session-only drafts isolated by tool.
- Desktop editor resizing plus mobile Input/Output tabs.
- Productivity navigation with persistent Favorites and Recent tools, contextual onboarding, and an expanded Command Palette.
- Enterprise editor utilities: `Ctrl/Cmd + F` search, match navigation, `Ctrl/Cmd + G` Go to Line, real-time cursor line/column reporting, and automatic selection of line/column diagnostics.
- Local chaining: reuse the current result as the next input without persisting it.
- Explicit local presets per tool: save with `Ctrl/Cmd + S`, load, export/import, delete, and clear the active set with two-step confirmation. Results are never stored; limits are 20 presets, 200 KB per preset, and 1 MB per imported file. See the [portable preset format](./docs/PRESET-FORMAT.md).
- Command palette, local examples, result copying, downloads, and share links.
- Premium Preferences modal with dark, light, and system themes; density; font size; wrapping; line numbers; syntax highlighting; autocomplete; accessible switches; and focus-trapped keyboard navigation.
- Optional local activity history with operation count, local storage usage, last update, and visual confirmation before clearing; it stores only tool ID, completion status, and timestamp.

---

## 💻 Installation and local development

### Requirements

- Node.js is optional but recommended for local serving and validation scripts.
- A modern browser with ES module support: Chrome, Edge, or Firefox.

> You may open `web/index.html` directly through `file://` for the basic application. Serve the `web/` directory through HTTP/HTTPS to register the Service Worker and verify PWA offline behavior.

### Run locally

```bash
npx serve web
```

Then open the URL provided by the static server.

### Quality checks

No production npm dependencies are required. Run the project checks and unit tests with:

```bash
npm run ci
```

This checks key application files, synchronizes and validates extension core copies, and runs the `node:test` suite.

To build the same artifact consumed by GitHub Pages:

```bash
npm run build:site
```

In CI, GitHub Actions also runs Lighthouse, axe-core WCAG 2 A/AA checks, Playwright E2E product flows, desktop/mobile captures, and optional visual-baseline comparison. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and [`docs/DESIGN-SYSTEM.md`](./docs/DESIGN-SYSTEM.md) for contribution, accessibility, and baseline-approval workflows.

### GitHub Pages deployment

The live PWA is published at [https://carlosarman.github.io/payload-forge/](https://carlosarman.github.io/payload-forge/).

The [`deploy-pages.yml`](./.github/workflows/deploy-pages.yml) workflow validates the project and publishes the web application after pushes to `main`. It copies `web/` and `packages/` into the Pages artifact, then resolves shared-core module imports and Service Worker precache paths relative to that artifact so deployment under the `/payload-forge/` path works without changing local development paths. Configure **Pages → Build and deployment → Source** as **GitHub Actions** in the repository settings. The workflow can also be run manually from the **Actions** tab.

---

## ⌨️ Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + K` | Open the Command Palette for tools and actions |
| `Ctrl/Cmd + Enter` | Run the active tool |
| `Ctrl/Cmd + F` | Search Input or Output |
| `Ctrl/Cmd + G` | Go to a line in the selected panel |
| `Ctrl/Cmd + S` | Open the dialog to save a local preset |
| `Tab` | Insert two spaces in the input editor |
| `←` / `→` on the desktop divider | Resize the editors |
| Swipe from left edge on mobile | Open the navigation menu |
| Swipe left on mobile | Close the navigation menu |

### Comparing documents

**JSON Compare** and **JSON Diff** accept exactly two JSON documents, separated by a line containing `---`:

```json
{ "state": "draft" }

---

{ "state": "published", "reviewed": true }
```

---

## 🧩 Extensions

### Browser extension

The Manifest V3 browser extension provides focused local JSON formatting, Base64 encoding, secret redaction, copy support, a selection context-menu action, and a dedicated Preferences view in its popup.

Its primary **Open full application** button opens the public PayloadForge PWA with every available tool. The popup remains a lightweight shortcut surface for the most common transformations.

The popup Preferences view persists theme, density, editor font size, wrapping, syntax-highlighting preference, and opt-in metadata-only activity history through `chrome.storage.local`. It also exposes local-history metrics and an explicit clear confirmation.

1. Run `npm run sync:core`.
2. Open your browser extension manager (`chrome://extensions` or `edge://extensions`).
3. Enable **Developer mode**.
4. Choose **Load unpacked**.
5. Select the [`browser-extension/`](./browser-extension/) directory.

The generated Chromium package is available at `extensions/payloadforge-browser.zip`. To recreate it, synchronize the shared core and zip the **contents** of `browser-extension/`:

```bash
node scripts/sync-core.mjs
powershell -NoProfile -Command "Compress-Archive -Path 'browser-extension\*' -DestinationPath 'extensions\payloadforge-browser.zip' -Force"
```

### VS Code extension

The VS Code extension exposes selection commands for JSON format/minify, Base64 encoding, secret redaction, and JSON → TypeScript generation.

Open the toolkit with **PayloadForge: Open Toolkit** from the Command Palette, or select the **PayloadForge** icon in the Activity Bar and use the **Open PayloadForge Toolkit** action. VS Code displays the Activity Bar on the left by default; move it to the right through **View → Appearance → Activity Bar Position → Right**.

Run **PayloadForge: Open Preferences** from the Command Palette or from the PayloadForge Activity Bar view to open its native webview. It persists theme, density, font-size, wrapping, syntax-highlighting, and metadata-only local-history preferences through VS Code `globalState`; the history card reports operation count, storage usage, and latest update. See the extension-specific [usage guide](./vscode-extension/README.md) for every command and usage instructions.

```bash
cd vscode-extension
npm run package
```

The package lifecycle automatically runs `npm run sync:core` before packaging. The generated VS Code installer is `extensions/payloadforge-vscode.vsix`; install it from VS Code with **Extensions: Install from VSIX...**. Generated `.vsix`, `.zip`, and `.xpi` artifacts belong in `extensions/`, which is excluded from Git.

---

## 🏗️ Architecture

```text
.
├── packages/
│   └── core/                  # Shared pure browser-safe ESM transforms
├── web/                       # Standalone PWA
│   ├── assets/js/modules/     # Tool adapters and UI contracts
│   ├── tests/                 # node:test coverage
│   ├── sw.js                  # Offline application shell cache
│   └── index.html
├── browser-extension/         # Manifest V3 integration
├── vscode-extension/          # VS Code integration
├── scripts/sync-core.mjs      # Synchronizes shared core to extensions
└── extensions/                # Local generated distributable packages
```

### Shared core

[`packages/core/index.js`](./packages/core/index.js) is the public ESM entry point for reusable transforms:

- JSON parsing/formatting, JSONPath, schema inference/validation/fixtures, and JSON comparison.
- YAML, XPath, JWT, Base64/Base64URL, UUID, Regex, cURL → Fetch, OpenAPI, and mock data.
- Secrets redaction and JSON → TypeScript generation.

Each web tool follows a focused module contract (`metadata`, `options`, `run`). The application registry in [`web/assets/js/app.js`](./web/assets/js/app.js) composes those modules without coupling them to layout or navigation.

### Principles

- **Separation of concerns:** routing, state, rendering, tool adapters, and pure transforms are isolated.
- **Registry/factory approach:** tools are added through the registry rather than by rewriting global UI logic.
- **Observer pattern:** `EventBus` and `Store` support decoupled state changes.
- **DRY:** shared transformations live in `packages/core/`.
- **KISS:** native APIs handle parsing, clipboard, downloads, persistence, UUIDs, and PWA capabilities.
- **Privacy by design:** no payload or generated result is transmitted or persisted by default.

---

## ♿ Privacy, offline, and accessibility

PayloadForge makes no network requests for payload processing and uses no remote runtime assets. All parsing, transformations, comparisons, and mock data generation run locally.

The PWA includes a web manifest, standard and maskable icons, and a Service Worker. After its first HTTP/HTTPS load, the application shell and tools can remain available offline.

The interface provides semantic HTML, labels and ARIA states, `aria-live` announcements, visible focus, a skip link, keyboard access, dialog focus handling, responsive navigation, and support for `prefers-reduced-motion`.

---

## 🧪 Quality and CI

The project uses native `node:test` unit tests and syntax/import checks. The [`quality.yml`](./.github/workflows/quality.yml) workflow runs the same verification for pushes to `main` and pull requests.

Current release notes are maintained in [`CHANGELOG.md`](./CHANGELOG.md), using Keep a Changelog and Semantic Versioning conventions.

---

## 🔮 Future extensions

The module contract can support additional tools such as a SQL Formatter, GraphQL Explorer, HAR Analyzer, or HTTP Request Builder under [`web/assets/js/modules/`](./web/assets/js/modules/) and through the application registry.
