const vscode = require("vscode");

const corePromise = import("./core/index.js");
const PREFERENCES_KEY = "payloadforge.preferences";
const HISTORY_KEY = "payloadforge.history";
const MAX_HISTORY_ENTRIES = 20;
const defaultPreferences = Object.freeze({
  theme: "system",
  density: "comfortable",
  fontSize: 13,
  wrap: false,
  syntaxHighlight: true,
  historyEnabled: false,
});

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

function preferencesFor(context) {
  const savedPreferences = context.globalState.get(PREFERENCES_KEY);
  return savedPreferences ? { ...defaultPreferences, ...savedPreferences } : defaultPreferences;
}

function historyFor(context) {
  return context.globalState.get(HISTORY_KEY) ?? [];
}

function historySummary(context) {
  const history = historyFor(context);
  const latest = history[0]?.at ? new Date(history[0].at) : null;
  const bytes = Buffer.byteLength(JSON.stringify(history), "utf8");
  return {
    count: history.length,
    size: bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`,
    updated: latest ? latest.toLocaleDateString("en", { month: "short", day: "2-digit" }) : "—",
  };
}

async function recordHistory(context, action) {
  if (!preferencesFor(context).historyEnabled) return;
  const history = historyFor(context);
  await context.globalState.update(HISTORY_KEY, [{ action, at: new Date().toISOString() }, ...history].slice(0, MAX_HISTORY_ENTRIES));
}

function registerSelectionCommand(context, command, transform) {
  return vscode.commands.registerCommand(command, async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("Open an editor first.");
      return;
    }

    try {
      const output = await transform(selectedText(editor));
      await replaceSelection(editor, output);
      await recordHistory(context, command.replace("payloadforge.", ""));
      vscode.window.showInformationMessage("PayloadForge: selection updated.");
    } catch (error) {
      vscode.window.showErrorMessage(`PayloadForge: ${error.message}`);
    }
  });
}

function preferencesHtml(preferences, summary) {
  const safe = JSON.stringify({ preferences, summary }).replaceAll("<", String.fromCodePoint(92, 117, 48, 48, 51, 99));
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
:root{font-family:var(--vscode-font-family);color:var(--vscode-foreground);--primary:#ea6b3b;--surface:var(--vscode-editorWidget-background);--border:var(--vscode-widget-border)}
body{max-width:720px;margin:0 auto;padding:24px;background:var(--vscode-editor-background)}
header,.heading,.history-heading,.row{display:flex;align-items:center;gap:12px}header{justify-content:space-between;padding-bottom:20px;border-bottom:1px solid var(--border)}h1,h2,p{margin:0}h1{font-size:21px}.subtitle,small{color:var(--vscode-descriptionForeground);font-size:12px;line-height:1.45}.mark,.history-icon{display:grid;width:36px;height:36px;place-items:center;border:1px solid color-mix(in srgb,var(--primary) 55%,var(--border));border-radius:11px;background:color-mix(in srgb,var(--primary) 12%,transparent);color:var(--primary);font-size:18px}section{margin-top:22px;padding-top:22px;border-top:1px solid var(--border)}section:first-of-type{border:0;padding-top:0}.label{margin-bottom:10px;color:var(--vscode-descriptionForeground);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.card{padding:13px;border:1px solid var(--border);border-radius:13px;background:var(--surface)}label>span{display:block;margin-bottom:7px;font-size:12px;font-weight:600}select,input[type=range]{width:100%}select{min-height:35px;border:1px solid var(--border);border-radius:8px;background:var(--vscode-input-background);color:var(--vscode-input-foreground);padding:0 8px}.font{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center}.font input{grid-column:1/-1;accent-color:var(--primary)}output{padding:5px 8px;border-radius:7px;background:color-mix(in srgb,var(--primary) 14%,transparent);color:var(--primary);font-family:var(--vscode-editor-font-family);font-weight:700;font-size:11px}.switch-list{overflow:hidden;border:1px solid var(--border);border-radius:13px}.row{justify-content:space-between;padding:12px;border-bottom:1px solid var(--border);cursor:pointer}.row:last-child{border:0}.row:hover{background:var(--vscode-list-hoverBackground)}.row p{font-size:12px;font-weight:600}.row small{display:block;margin-top:3px}.row input{position:absolute;opacity:0}.switch{width:40px;height:23px;border-radius:999px;background:#485568;transition:.18s}.switch:after{display:block;width:15px;height:15px;margin:4px;border-radius:50%;background:#b6c2d1;content:"";transition:.18s}.row input:checked+.switch{background:var(--primary);box-shadow:0 0 13px color-mix(in srgb,var(--primary) 38%,transparent)}.row input:checked+.switch:after{transform:translateX(17px);background:white}.history{display:grid;gap:12px}.metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.metric{padding:9px;border-radius:9px;background:var(--vscode-textBlockQuote-background)}.metric strong{display:block;margin-top:3px;font:700 12px var(--vscode-editor-font-family)}button{min-height:34px;border:1px solid color-mix(in srgb,#ef4444 55%,var(--border));border-radius:8px;background:color-mix(in srgb,#ef4444 10%,transparent);color:#ff938b;cursor:pointer}button:hover{background:color-mix(in srgb,#ef4444 18%,transparent)}@media(max-width:520px){.grid{grid-template-columns:1fr}.metrics{grid-template-columns:1fr}}
</style>
</head>
<body>
<header><div class="heading"><span class="mark">⚙</span><div><h1>Preferences</h1><p class="subtitle">Personalize your PayloadForge workspace.</p></div></div></header>
<section><p class="label">Appearance</p><div class="grid"><label class="card"><span>Theme</span><select id="theme"><option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option></select></label><label class="card"><span>Density</span><select id="density"><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></label></div></section>
<section><p class="label">Editor</p><div class="card font"><div><strong>Font size</strong><p class="subtitle">Adjust editor readability.</p></div><output id="font-value"></output><input id="font-size" type="range" min="11" max="20"></div><div class="switch-list" style="margin-top:10px"><label class="row"><span><p>Wrap lines</p><small>Prevent horizontal scrolling in long text.</small></span><input id="wrap" type="checkbox" role="switch" aria-checked="false"><span class="switch"></span></label><label class="row"><span><p>Syntax highlighting</p><small>Use enhanced editor rendering.</small></span><input id="syntax-highlight" type="checkbox" role="switch" aria-checked="false"><span class="switch"></span></label></div></section>
<section><p class="label">Data & privacy</p><label class="row card"><span><p>Local history</p><small>Stores action and timestamp only.</small></span><input id="history-enabled" type="checkbox" role="switch" aria-checked="false"><span class="switch"></span></label><article class="card history" style="margin-top:10px"><div class="history-heading"><span class="history-icon">◷</span><div><strong>Local history</strong><p id="history-status" class="subtitle"></p></div></div><div class="metrics"><div class="metric"><small>Actions</small><strong id="history-count"></strong></div><div class="metric"><small>Space</small><strong id="history-size"></strong></div><div class="metric"><small>Updated</small><strong id="history-updated"></strong></div></div><button id="clear-history" type="button">Clear history</button></article></section>
<script>
const vscode = acquireVsCodeApi(); const state = ${safe};
const $ = (id) => document.getElementById(id);
const controls = { theme: $("theme"), density: $("density"), fontSize: $("font-size"), wrap: $("wrap"), syntaxHighlight: $("syntax-highlight"), historyEnabled: $("history-enabled") };
function render() { const p=state.preferences,s=state.summary; controls.theme.value=p.theme;controls.density.value=p.density;controls.fontSize.value=p.fontSize;controls.wrap.checked=p.wrap;controls.syntaxHighlight.checked=p.syntaxHighlight;controls.historyEnabled.checked=p.historyEnabled;Object.values(controls).filter(x=>x.matches('[role=switch]')).forEach(x=>x.setAttribute('aria-checked',String(x.checked)));$("font-value").textContent=p.fontSize+' px';$("history-status").textContent=p.historyEnabled?s.count+' local action(s), without input or output.':'Disabled; nothing is stored.';$("history-count").textContent=s.count;$("history-size").textContent=s.size;$("history-updated").textContent=s.updated;$("clear-history").disabled=!s.count; }
function save(){vscode.postMessage({type:'save',preferences:state.preferences});}
Object.entries(controls).forEach(([key,control])=>control.addEventListener(key==='fontSize'?'input':'change',()=>{state.preferences[key]=control.type==='checkbox'?control.checked:key==='fontSize'?Number(control.value):control.value;if(control.matches('[role=switch]'))control.setAttribute('aria-checked',String(control.checked));render();save();}));
$("clear-history").addEventListener('click',()=>{if($("clear-history").dataset.confirm!=='true'){$("clear-history").dataset.confirm='true';$("clear-history").textContent='Confirm clear history';setTimeout(()=>{$("clear-history").dataset.confirm='';$("clear-history").textContent='Clear history';},4000);return;}vscode.postMessage({type:'clearHistory'});});
window.addEventListener('message',event=>{if(event.data.type==='history') {state.summary=event.data.summary;render();$("clear-history").dataset.confirm='';$("clear-history").textContent='Clear history';}});render();
</script></body></html>`;
}

function openPreferences(context) {
  const panel = vscode.window.createWebviewPanel("payloadforgePreferences", "PayloadForge Preferences", vscode.ViewColumn.Beside, { enableScripts: true });
  const render = () => { panel.webview.html = preferencesHtml(preferencesFor(context), historySummary(context)); };
  panel.webview.onDidReceiveMessage(async (message) => {
    if (message.type === "save") {
      await context.globalState.update(PREFERENCES_KEY, { ...defaultPreferences, ...message.preferences });
    }
    if (message.type === "clearHistory") {
      await context.globalState.update(HISTORY_KEY, []);
      panel.webview.postMessage({ type: "history", summary: historySummary(context) });
    }
  });
  render();
}

function activate(context) {
  const openToolkitCommand = vscode.commands.registerCommand("payloadforge.open", () => {
    const panel = vscode.window.createWebviewPanel("payloadforge", "PayloadForge", vscode.ViewColumn.Beside, { enableScripts: false });
    panel.webview.html = "<!doctype html><html lang='en'><body><h1>PayloadForge</h1><p>Use the Command Palette to run tools on your selected text.</p><p>Open <strong>PayloadForge: Open Preferences</strong> to personalize the extension.</p></body></html>";
  });

  context.subscriptions.push(
    openToolkitCommand,
    vscode.commands.registerCommand("payloadforge.preferences", () => openPreferences(context)),
    registerSelectionCommand(context, "payloadforge.formatJson", formatJson),
    registerSelectionCommand(context, "payloadforge.minifyJson", minifyJson),
    registerSelectionCommand(context, "payloadforge.encodeBase64", encodeBase64),
    registerSelectionCommand(context, "payloadforge.redactSecrets", redactSecrets),
    registerSelectionCommand(context, "payloadforge.jsonToTypeScript", jsonToTypeScript),
  );
}

module.exports = { activate };
