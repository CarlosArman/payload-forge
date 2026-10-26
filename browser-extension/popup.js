import { encodeBase64, formatJson, parseJson, redactSecrets } from "./core/index.js";

const PREFERENCES_KEY = "payloadforgePreferences";
const HISTORY_KEY = "payloadforgeHistory";
const MAX_HISTORY_ENTRIES = 20;
const defaults = {
  theme: "dark",
  density: "comfortable",
  fontSize: 13,
  wrap: false,
  syntaxHighlight: true,
  historyEnabled: false,
};

const $ = (selector) => document.querySelector(selector);
const elements = {
  body: document.body,
  toolView: $("#tool-view"),
  preferencesView: $("#preferences-view"),
  preferencesToggle: $("#preferences-toggle"),
  preferencesClose: $("#preferences-close"),
  input: $("#input"),
  output: $("#output"),
  status: $("#status"),
  copy: $("#copy"),
  theme: $("#pref-theme"),
  density: $("#pref-density"),
  fontSize: $("#pref-font-size"),
  fontValue: $("#font-value"),
  wrap: $("#pref-wrap"),
  highlight: $("#pref-highlight"),
  historyEnabled: $("#pref-history"),
  historyStatus: $("#history-status"),
  historyCount: $("#history-count"),
  historySize: $("#history-size"),
  historyUpdated: $("#history-updated"),
  historyClear: $("#history-clear"),
};

let preferences = { ...defaults };

function transformInput(action, value) {
  if (action === "format") {
    const parsed = parseJson(value);
    if (parsed.error) throw new Error(parsed.error);
    return formatJson(parsed.value);
  }
  if (action === "base64") return encodeBase64(value);
  if (action === "redact") return redactSecrets(value).output;
  throw new Error("Choose a valid action.");
}

function resolvedTheme(theme) {
  if (theme !== "system") return theme;
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyPreferences() {
  elements.body.dataset.density = preferences.density;
  elements.body.dataset.theme = resolvedTheme(preferences.theme);
  elements.body.style.setProperty("--editor-font-size", `${preferences.fontSize}px`);
  elements.input.style.whiteSpace = preferences.wrap ? "pre-wrap" : "pre";
  elements.output.style.whiteSpace = preferences.wrap ? "pre-wrap" : "pre";
  elements.fontValue.textContent = `${preferences.fontSize} px`;
}

function syncControls() {
  elements.theme.value = preferences.theme;
  elements.density.value = preferences.density;
  elements.fontSize.value = preferences.fontSize;
  elements.wrap.checked = preferences.wrap;
  elements.highlight.checked = preferences.syntaxHighlight;
  elements.historyEnabled.checked = preferences.historyEnabled;
  [elements.wrap, elements.highlight, elements.historyEnabled].forEach((control) => {
    control.setAttribute("aria-checked", String(control.checked));
  });
  applyPreferences();
}

function savePreferences() {
  chrome.storage.local.set({ [PREFERENCES_KEY]: preferences });
}

function formatSize(bytes) {
  if (!bytes) return "0 B";
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

function updateHistory() {
  chrome.storage.local.get({ [HISTORY_KEY]: [] }, ({ [HISTORY_KEY]: history }) => {
    const latest = history[0]?.at ? new Date(history[0].at) : null;
    const serialized = JSON.stringify(history);
    elements.historyStatus.textContent = preferences.historyEnabled
      ? `${history.length} local action(s), without input or output.`
      : "Disabled; nothing is stored.";
    elements.historyCount.textContent = String(history.length);
    elements.historySize.textContent = formatSize(new Blob([serialized]).size);
    elements.historyUpdated.textContent = latest
      ? latest.toLocaleDateString(undefined, { month: "short", day: "2-digit" })
      : "—";
    elements.historyClear.disabled = history.length === 0;
  });
}

function recordHistory(action) {
  if (!preferences.historyEnabled) return;
  chrome.storage.local.get({ [HISTORY_KEY]: [] }, ({ [HISTORY_KEY]: history }) => {
    const entry = { action, at: new Date().toISOString() };
    chrome.storage.local.set({ [HISTORY_KEY]: [entry, ...history].slice(0, MAX_HISTORY_ENTRIES) }, updateHistory);
  });
}

function run(action) {
  try {
    const value = elements.input.value;
    if (!value.trim()) throw new Error("Paste or select text first.");
    elements.output.value = transformInput(action, value);
    elements.status.textContent = "Done locally.";
    recordHistory(action);
  } catch (error) {
    elements.status.textContent = error.message;
  }
}

function openPreferences() {
  elements.toolView.hidden = true;
  elements.preferencesView.hidden = false;
  syncControls();
  updateHistory();
  elements.preferencesClose.focus();
}

function closePreferences() {
  elements.preferencesView.hidden = true;
  elements.toolView.hidden = false;
  elements.preferencesToggle.focus();
}

function bindPreference(control, key, valueFor = () => control.value) {
  control.addEventListener("change", () => {
    preferences[key] = valueFor();
    if (control.matches('[role="switch"]')) control.setAttribute("aria-checked", String(control.checked));
    savePreferences();
    applyPreferences();
    updateHistory();
  });
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => run(button.dataset.action));
});

elements.copy.addEventListener("click", async () => {
  if (!elements.output.value) return;
  await navigator.clipboard.writeText(elements.output.value);
  elements.status.textContent = "Result copied.";
});

elements.preferencesToggle.addEventListener("click", openPreferences);
elements.preferencesClose.addEventListener("click", closePreferences);
elements.fontSize.addEventListener("input", () => {
  preferences.fontSize = Number(elements.fontSize.value);
  savePreferences();
  applyPreferences();
});
bindPreference(elements.theme, "theme");
bindPreference(elements.density, "density");
bindPreference(elements.wrap, "wrap", () => elements.wrap.checked);
bindPreference(elements.highlight, "syntaxHighlight", () => elements.highlight.checked);
bindPreference(elements.historyEnabled, "historyEnabled", () => elements.historyEnabled.checked);

elements.historyClear.addEventListener("click", () => {
  if (elements.historyClear.dataset.confirm !== "true") {
    elements.historyClear.dataset.confirm = "true";
    elements.historyClear.textContent = "Confirm clear history";
    setTimeout(() => {
      if (elements.historyClear.dataset.confirm === "true") {
        delete elements.historyClear.dataset.confirm;
        elements.historyClear.textContent = "Clear history";
      }
    }, 4000);
    return;
  }
  delete elements.historyClear.dataset.confirm;
  elements.historyClear.textContent = "Clear history";
  chrome.storage.local.set({ [HISTORY_KEY]: [] }, updateHistory);
});

chrome.storage.local.get({ [PREFERENCES_KEY]: defaults, selectedText: "" }, (stored) => {
  preferences = { ...defaults, ...stored[PREFERENCES_KEY] };
  syncControls();
  if (stored.selectedText) {
    elements.input.value = stored.selectedText;
    chrome.storage.local.remove("selectedText");
    elements.status.textContent = "Loaded selected text.";
  }
});
