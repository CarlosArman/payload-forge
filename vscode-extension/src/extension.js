const vscode = require("vscode");

const corePromise = import("./core/index.js");

function selectedText(editor) {
  const text = editor.document.getText(editor.selection);
  if (!text) throw new Error("Select text in the active editor first.");
  return text;
}

async function replaceSelection(editor, value) {
  await editor.edit((edit) => edit.replace(editor.selection, value));
}

async function formatJson(text) {
  const core = await corePromise;
  const parsed = core.parseJson(text);
  if (parsed.error) throw new Error(parsed.error);
  return core.formatJson(parsed.value);
}

async function minifyJson(text) {
  const core = await corePromise;
  const parsed = core.parseJson(text);
  if (parsed.error) throw new Error(parsed.error);
  return core.minifyJson(parsed.value);
}

async function encodeBase64(text) {
  const core = await corePromise;
  return core.encodeBase64(text);
}

async function redactSecrets(text) {
  const core = await corePromise;
  return core.redactSecrets(text).output;
}

async function jsonToTypeScript(text) {
  const core = await corePromise;
  const parsed = core.parseJson(text);
  if (parsed.error) throw new Error(parsed.error);
  return core.jsonToTypeScript(parsed.value);
}

function registerSelectionCommand(context, command, transform) {
  context.subscriptions.push(vscode.commands.registerCommand(command, async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("Open an editor first.");
      return;
    }

    try {
      const output = await transform(selectedText(editor));
      await replaceSelection(editor, output);
      vscode.window.showInformationMessage("PayloadForge: selection updated.");
    } catch (error) {
      vscode.window.showErrorMessage(`PayloadForge: ${error.message}`);
    }
  }));
}

/**
 * Activates the PayloadForge VS Code extension.
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(vscode.commands.registerCommand("payloadforge.open", () => {
    const panel = vscode.window.createWebviewPanel(
      "payloadforge",
      "PayloadForge",
      vscode.ViewColumn.Beside,
      { enableScripts: false },
    );

    panel.webview.html = `<!doctype html>
<html lang="en">
  <body>
    <h1>PayloadForge</h1>
    <p>Use the Command Palette to run tools on your selected text.</p>
    <ul>
      <li>Format or minify JSON</li>
      <li>Encode text as Base64</li>
      <li>Redact common secrets</li>
      <li>Generate TypeScript from JSON</li>
    </ul>
  </body>
</html>`;
  }));

  registerSelectionCommand(context, "payloadforge.formatJson", formatJson);
  registerSelectionCommand(context, "payloadforge.minifyJson", minifyJson);
  registerSelectionCommand(context, "payloadforge.encodeBase64", encodeBase64);
  registerSelectionCommand(context, "payloadforge.redactSecrets", redactSecrets);
  registerSelectionCommand(context, "payloadforge.jsonToTypeScript", jsonToTypeScript);
}

module.exports = { activate };
