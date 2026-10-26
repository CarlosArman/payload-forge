# Extension packages

This directory is the output location for distributable extension artifacts.

- VS Code: `payloadforge-vscode.vsix`
- Chromium-based browsers: `payloadforge-browser.zip`
- Firefox: `payloadforge-browser.xpi`

The package files are intentionally ignored by Git. Build them from their respective source directories:

```bash
cd vscode-extension
npm run package
```

Package the browser extension by zipping the contents of `browser-extension/` (not the directory itself) into `extensions/payloadforge-browser.zip`.
