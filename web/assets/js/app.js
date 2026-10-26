import { Router } from "./router.js";
import { store } from "./state.js";
import { copyText, downloadText } from "./utils.js";
import { schemaGenerator } from "./modules/schema-generator.js";
import { jsonPathExplorer } from "./modules/jsonpath-explorer.js";
import { formatter } from "./modules/formatter.js";
import { jsonCompare } from "./modules/compare.js";
import { jsonDiff } from "./modules/diff.js";
import { xpathGenerator } from "./modules/xpath-generator.js";
import { yamlConverter } from "./modules/yaml-converter.js";
import { mockGenerator } from "./modules/mock-generator.js";
import { jwtInspector } from "./modules/jwt-inspector.js";
import { encoderDecoder } from "./modules/encoder-decoder.js";
import { uuidGenerator } from "./modules/uuid-generator.js";
import { regexTester } from "./modules/regex-tester.js";
import { secretsRedactor } from "./modules/secrets-redactor.js";
import { typescriptGenerator } from "./modules/typescript-generator.js";
import { curlGenerator } from "./modules/curl-generator.js";
import { schemaValidator } from "./modules/schema-validator.js";
import { schemaFixtures } from "./modules/schema-fixtures.js";
import { openApiExplorer } from "./modules/openapi-explorer.js";
import { getLanguage, setLanguage, t, toolText } from "./i18n.js";

const tools = [schemaGenerator, jsonPathExplorer, formatter, typescriptGenerator, yamlConverter, xpathGenerator, jwtInspector, encoderDecoder, secretsRedactor, curlGenerator, openApiExplorer, schemaValidator, schemaFixtures, regexTester, uuidGenerator, jsonCompare, jsonDiff, mockGenerator];
const registry = new Map(tools.map((tool) => [tool.id, tool]));
const HISTORY_KEY = "payloadforge.history";
const MAX_HISTORY_ENTRIES = 20;
const $ = (selector) => document.querySelector(selector);

const elements = {
  category: $("#tool-category"), title: $("#tool-title"), description: $("#tool-description"),
  status: $("#tool-status"), options: $("#tool-options"), input: $("#input-editor"), output: $("#output-editor"),
  inputLabel: $("#input-label"), outputLabel: $("#output-label"), execute: $("#execute-button"),
  executeLabel: $("#execute-label"), copy: $("#copy-button"), download: $("#download-button"),
  clear: $("#clear-button"), example: $("#example-button"), share: $("#share-button"), results: $("#results-panel"),
  importButton: $("#import-button"), fileImport: $("#file-import"), inputCard: $(".editor-input"),
  inputMeta: $("#input-meta"), outputMeta: $("#output-meta"), inputStatus: $("#input-status"),
  inputLines: $("#input-lines"), outputLines: $("#output-lines"),
  inputHighlight: $("#input-highlight code"), outputHighlight: $("#output-highlight code"),
  outputStatus: $("#output-status"), outputEmpty: $("#output-empty-state"), nav: $("#tool-navigation"), theme: $("#theme-toggle"),
  menu: $("#menu-toggle"), sidebar: $("#sidebar"), overlay: $("#sidebar-overlay"), connection: $("#connection-status"),
  dialog: $("#command-dialog"), commandSearch: $("#command-search"), commandResults: $("#command-results"),
  globalSearch: $("#tool-search"), workspace: $("#workspace"), resize: $("#resize-handle"),
  inputTab: $("#input-tab"), outputTab: $("#output-tab"), editorWorkspace: $(".editor-workspace"),
  preferences: $("#preferences-dialog"), preferencesToggle: $("#preferences-toggle"), preferencesClose: $("#preferences-close"),
  preferenceTheme: $("#preference-theme"), preferenceDensity: $("#preference-density"),
  preferenceWrap: $("#preference-wrap"), preferenceLineNumbers: $("#preference-line-numbers"),
  preferenceSyntaxHighlight: $("#preference-syntax-highlight"), preferenceAutocomplete: $("#preference-autocomplete"),
  preferenceFontSize: $("#preference-font-size"), preferenceFontSizeValue: $("#preference-font-size-value"),
  preferenceHistory: $("#preference-history"), historyStatus: $("#history-status"), historyClear: $("#history-clear"),
  historyCount: $("#history-count"), historySize: $("#history-size"), historyUpdated: $("#history-updated"),
  commandClose: $("#command-close"), language: $("#language-select"),
  readyLabel: $("#ready-label"), tabHint: $("#tab-hint"), outputHint: $("#output-hint"),
  copyLabel: $("#copy-label"), downloadLabel: $("#download-label"), exampleLabel: $("#example-label"),
  clearLabel: $("#clear-label"), shareLabel: $("#share-label"),
};

const examples = {
  schema: '{\n  "user": { "id": 42, "name": "Ada", "active": true },\n  "tags": ["api", "qa"],\n  "metadata": null\n}',
  jsonpath: '{\n  "user": { "id": 42, "profile": { "name": "Ada" } },\n  "orders": [{ "id": "ord_1", "total": 29.9 }]\n}',
  formatter: '{"service":"PayloadForge","enabled":true,"tools":["schema","diff"]}',
  typescript: '{\n  "id": 42,\n  "profile": { "name": "Ada" },\n  "tags": ["api", "qa"],\n  "active": true\n}',
  yaml: '{\n  "service": "PayloadForge",\n  "ports": [80, 443],\n  "enabled": true\n}',
  xpath: '<catalog>\n  <book id="1"><title>Payload Engineering</title></book>\n  <book id="2"><title>API Quality</title></book>\n</catalog>',
  jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSIsImlhdCI6MTcxMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.signature",
  encoder: "PayloadForge: ¡texto UTF-8 local!",
  redactor: "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.signature\nx-api-key: prod_secret_abc123456789\ncontact: ada@example.com",
  curl: "curl -X POST https://api.example.com/users -H 'Content-Type: application/json' -H 'Authorization: Bearer demo-token' -d '{\"name\":\"Ada\"}'",
  validator: '{\n  "email": "ada@example.com",\n  "age": 42\n}',
  fixtures: '{\n  "type": "object",\n  "required": ["id", "email"],\n  "properties": {\n    "id": { "type": "integer", "minimum": 1 },\n    "email": { "type": "string", "format": "email" }\n  }\n}',
  openapi: '{\n  "openapi": "3.0.3",\n  "info": { "title": "Example API", "version": "1.0.0" },\n  "paths": {\n    "/users": { "get": { "summary": "List users" }, "post": { "summary": "Create user" } }\n  }\n}',
  regex: "ada@example.com\ninvalid-address\nsupport@payloadforge.dev",
  uuid: "550e8400-e29b-41d4-a716-446655440000\nnot-a-uuid",
  compare: '{\n  "id": 1,\n  "status": "draft"\n}\n\n---\n\n{\n  "id": 1,\n  "status": "published",\n  "reviewed": true\n}',
  diff: '{\n  "version": 1,\n  "enabled": false\n}\n\n---\n\n{\n  "version": 2,\n  "enabled": true,\n  "environment": "production"\n}',
  mock: '{\n  "team": "platform",\n  "environment": "staging"\n}',
};

let activeTool = registry.get("schema");
const drafts = new Map();
let commandIndex = -1;
let commandOrigin = null;
let menuOrigin = null;
let preferencesOrigin = null;

function applyLanguage() {
  const language = getLanguage();
  document.documentElement.lang = language;
  elements.language.value = language;
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll("[data-tool-label]").forEach((node) => { node.textContent = toolText(node.dataset.toolLabel).title; });
  elements.readyLabel.textContent = t("readyToWork");
  elements.globalSearch.placeholder = t("searchTools");
  elements.commandSearch.placeholder = t("searchTools");
  elements.tabHint.textContent = t("tabIndent");
  elements.outputHint.textContent = t("readOnly");
  elements.copyLabel.textContent = t("copyResult");
  elements.downloadLabel.textContent = t("download");
  elements.exampleLabel.textContent = t("loadExample");
  elements.clearLabel.textContent = t("clear");
  elements.shareLabel.textContent = t("share");
  // Preserve SVG icon when updating import button label
  const importSvg = elements.importButton.querySelector("svg");
  elements.importButton.textContent = t("import");
  if (importSvg) elements.importButton.prepend(importSvg);
  elements.commandClose.setAttribute("aria-label", language === "es" ? "Cerrar buscador" : "Close search");
  document.querySelector("#command-title").textContent = t("commandTitle");
  document.querySelector("#command-help").textContent = t("commandHelp");
  document.querySelectorAll(".nav-group").forEach((group) => {
    const toggle = group.querySelector(".nav-group-toggle");
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    const actions = {
      es: { expanded: "contraer", collapsed: "expandir" },
      en: { expanded: "collapse", collapsed: "expand" },
    };
    const state = isExpanded ? "expanded" : "collapsed";
    toggle.setAttribute("aria-label", `${toggle.firstElementChild.textContent}: ${actions[language][state]}`);
  });
}

function toast(message, type = "success") {
  const note = document.createElement("div");
  note.className = `toast ${type}`;
  note.setAttribute("role", "status");
  note.textContent = message;
  $("#toast-region").append(note);
  window.setTimeout(() => note.remove(), 3400);
}

function setStatus(message, type = "ready") {
  const stateClass = { error: " is-error", working: " is-working" };
  elements.status.textContent = message;
  elements.status.className = `tool-status${stateClass[type] ?? ""}`;
}

const EDITOR_HTML_ENTITIES = Object.freeze({
  amp: String.fromCodePoint(38, 97, 109, 112, 59),
  lt: String.fromCodePoint(38, 108, 116, 59),
  gt: String.fromCodePoint(38, 103, 116, 59),
});

function escapeEditorHtml(value) {
  return value
    .replaceAll("&", EDITOR_HTML_ENTITIES.amp)
    .replaceAll("<", EDITOR_HTML_ENTITIES.lt)
    .replaceAll(">", EDITOR_HTML_ENTITIES.gt);
}

const isDigit = (character) => character >= "0" && character <= "9";
const isWordCharacter = (character) => {
  if (!character) return false;
  const code = character.codePointAt(0);
  const isUppercase = code >= 65 && code <= 90;
  const isLowercase = code >= 97 && code <= 122;
  return isUppercase || isLowercase || isDigit(character) || character === "_" || character === "$" || character === ".";
};
const isWhitespace = (character) => character === " " || character === "\t" || character === "\n" || character === "\r";

function readJsonString(value, start) {
  let index = start + 1;
  while (index < value.length) {
    if (value[index] === "\\") index += 2;
    else if (value[index++] === '"') break;
  }
  return index;
}

function readJsonNumber(value, start) {
  let index = start;
  if (value[index] === "-") index += 1;
  while (isDigit(value[index])) index += 1;
  if (value[index] === ".") {
    index += 1;
    while (isDigit(value[index])) index += 1;
  }
  if (value[index] === "e" || value[index] === "E") {
    index += 1;
    if (value[index] === "+" || value[index] === "-") index += 1;
    while (isDigit(value[index])) index += 1;
  }
  return index;
}

function nextNonWhitespace(value, start) {
  let index = start;
  while (index < value.length && isWhitespace(value[index])) index += 1;
  return value[index];
}

function wrapEditorToken(type, token) {
  return `<span class="${type}">${escapeEditorHtml(token)}</span>`;
}

function readJsonScalar(value, index) {
  const scalarTokens = ["true", "false", "null"];
  return scalarTokens.find((token) => value.startsWith(token, index)) ?? "";
}

function scalarTokenClass(scalar) {
  if (scalar === "null") return "token-null";
  return "token-boolean";
}

function isJsonEditorValue(value) {
  const firstCharacter = value.trimStart()[0];
  return firstCharacter === "[" || firstCharacter === "{";
}

function readStringToken(value, index) {
  if (value[index] !== '"') return null;
  const end = readJsonString(value, index);
  const type = nextNonWhitespace(value, end) === ":" ? "token-key" : "token-string";
  return { token: value.slice(index, end), type, end };
}

function readScalarToken(value, index) {
  const scalar = readJsonScalar(value, index);
  if (!scalar) return null;
  if (isWordCharacter(value[index - 1]) || isWordCharacter(value[index + scalar.length])) return null;
  return { token: scalar, type: scalarTokenClass(scalar), end: index + scalar.length };
}

function readNumberToken(value, index) {
  const character = value[index];
  if (character !== "-" && !isDigit(character)) return null;
  if (isWordCharacter(value[index - 1])) return null;

  const end = readJsonNumber(value, index);
  const minimumLength = character === "-" ? 1 : 0;
  if (end <= index + minimumLength) return null;
  return { token: value.slice(index, end), type: "token-number", end };
}

function readEditorToken(value, index) {
  return readStringToken(value, index)
    ?? readScalarToken(value, index)
    ?? readNumberToken(value, index);
}

function highlightEditor(value) {
  if (!isJsonEditorValue(value)) return escapeEditorHtml(value);

  let result = "";
  let index = 0;
  while (index < value.length) {
    const token = readEditorToken(value, index);
    if (token) {
      result += wrapEditorToken(token.type, token.token);
      index = token.end;
    } else {
      result += escapeEditorHtml(value[index]);
      index += 1;
    }
  }
  return result;
}

function renderEditorLayer(editor, lines, highlight) {
  const value = editor.value;
  const lineCount = Math.max(1, value.split("\n").length);
  lines.textContent = Array.from({ length: lineCount }, (_, index) => index + 1).join("\n");
  highlight.innerHTML = `${store.get("editorSyntaxHighlight") ? highlightEditor(value) : escapeEditorHtml(value)}\n`;
  highlight.parentElement.scrollTop = editor.scrollTop;
  highlight.parentElement.scrollLeft = editor.scrollLeft;
  lines.scrollTop = editor.scrollTop;
}

function renderEditorLayers() {
  renderEditorLayer(elements.input, elements.inputLines, elements.inputHighlight);
  renderEditorLayer(elements.output, elements.outputLines, elements.outputHighlight);
}

function updateCounters() {
  elements.inputMeta.textContent = `${elements.input.value.length.toLocaleString()} ${t("chars")}`;
  elements.outputMeta.textContent = `${elements.output.value.length.toLocaleString()} ${t("chars")}`;
  renderEditorLayers();
}

async function importFile(file) {
  if (!file) return;
  if (file.size > 1024 * 1024) {
    toast("El archivo supera el límite local de 1 MB.", "error");
    return;
  }
  try {
    elements.input.value = await file.text();
    elements.input.dispatchEvent(new Event("input"));
    resetResult();
    elements.inputStatus.textContent = `Importado: ${file.name}`;
    toast(`Archivo ${file.name} importado localmente.`, "success");
    elements.input.focus();
  } catch {
    toast("No fue posible leer el archivo seleccionado.", "error");
  } finally {
    elements.fileImport.value = "";
  }
}

function updateOutputEmptyState() {
  const language = getLanguage();
  const hints = {
    schema: { es: ["Schema pendiente", "Pega un JSON válido para generar su schema."], en: ["Schema pending", "Paste valid JSON to generate its schema."] },
    jwt: { es: ["JWT pendiente", "Pega un token JWT o carga el ejemplo para inspeccionarlo."], en: ["JWT pending", "Paste a JWT or load the example to inspect it."] },
    encoder: { es: ["Texto pendiente", "Escribe texto y selecciona una operación de codificación."], en: ["Text pending", "Enter text and select an encoding operation."] },
    uuid: { es: ["UUID listo para generar", "Genera un UUID v4 o cambia a validación para pegar una lista."], en: ["UUID ready to generate", "Generate a UUID v4 or switch to validation to paste a list."] },
    compare: { es: ["Comparación pendiente", "Pega dos documentos JSON separados por una línea con ---."], en: ["Comparison pending", "Paste two JSON documents separated by a line with ---."] },
    diff: { es: ["Diferencias pendientes", "Pega dos documentos JSON separados por una línea con ---."], en: ["Diff pending", "Paste two JSON documents separated by a line with ---."] },
  };
  const fallback = language === "es"
    ? ["Resultado pendiente", "Ejecuta la herramienta para ver el resultado."]
    : ["Result pending", "Run the tool to view the result."];
  const [title, description] = hints[activeTool.id]?.[language] ?? fallback;
  $("#output-empty-title").textContent = title;
  $("#output-empty-description").textContent = description;
  elements.outputEmpty.hidden = Boolean(elements.output.value);
}

function syncToolOptions() {
  if (activeTool.id !== "uuid") return;

  const mode = document.querySelector("#uuid-mode")?.value ?? "generate";
  const count = document.querySelector("#uuid-count");
  const isGenerating = mode === "generate";

  if (count) {
    count.disabled = !isGenerating;
    count.closest(".option-control")?.classList.toggle("is-muted", !isGenerating);
  }

  const language = getLanguage();
  const generationPlaceholder = language === "es"
    ? "No se requiere entrada: selecciona la cantidad y genera UUID v4."
    : "No input required: select a count and generate UUID v4.";
  const generationStatus = language === "es"
    ? "Listo para generar UUID v4"
    : "Ready to generate UUID v4.";
  const validationStatus = elements.input.value ? t("unsavedChanges") : t("waiting");

  elements.input.disabled = isGenerating;
  elements.input.placeholder = isGenerating ? generationPlaceholder : activeTool.placeholder;
  elements.inputStatus.textContent = isGenerating ? generationStatus : validationStatus;
}

function setMobileEditorPanel(panel) {
  const showOutput = panel === "output";
  elements.editorWorkspace.classList.toggle("show-output", showOutput);
  elements.inputTab.classList.toggle("is-active", !showOutput);
  elements.outputTab.classList.toggle("is-active", showOutput);
  elements.inputTab.setAttribute("aria-selected", String(!showOutput));
  elements.outputTab.setAttribute("aria-selected", String(showOutput));
}

function resetResult() {
  elements.output.value = "";
  elements.results.replaceChildren();
  elements.results.hidden = true;
  elements.copy.disabled = true;
  elements.download.disabled = true;
  elements.outputStatus.textContent = t("noResult");
  updateOutputEmptyState();
  updateCounters();
}

function renderTool(toolId) {
  if (activeTool) drafts.set(activeTool.id, elements.input.value);
  activeTool = registry.get(toolId);
  const copy = toolText(activeTool.id);
  elements.category.textContent = copy.category.toUpperCase();
  elements.title.textContent = copy.title;
  elements.description.textContent = copy.description;
  elements.inputLabel.textContent = copy.inputLabel;
  elements.outputLabel.textContent = copy.outputLabel;
  elements.executeLabel.textContent = copy.executeLabel;
  elements.input.placeholder = activeTool.placeholder;
  elements.options.innerHTML = copy.options ?? activeTool.options ?? "";
  elements.input.disabled = false;
  elements.input.value = drafts.get(activeTool.id) ?? "";
  elements.input.placeholder = activeTool.placeholder;
  elements.inputStatus.textContent = elements.input.value ? t("restoredDraft") : t("waiting");
  syncToolOptions();
  resetResult();
  updateOutputEmptyState();
  setStatus(t("ready"));
  document.title = `${copy.title} — PayloadForge`;
  document.querySelectorAll(".nav-item").forEach((link) => {
    link.toggleAttribute("aria-current", link.dataset.tool === toolId);
  });
  closeMenu();
  elements.workspace.focus({ preventScroll: true });
}

function setExecutionState(isBusy) {
  elements.execute.classList.toggle("is-loading", isBusy);
  elements.execute.setAttribute("aria-busy", String(isBusy));
  elements.output.setAttribute("aria-busy", String(isBusy));
}

function renderSupplementaryResults(result) {
  if (!result.results) {
    elements.results.replaceChildren();
    elements.results.hidden = true;
    return;
  }

  elements.results.hidden = false;
  elements.results.innerHTML = result.results;
  result.bindResults?.(elements.results, { copy: copyText, toast });
}

function renderExecutionError(error) {
  const language = getLanguage();
  setStatus(language === "es" ? "Error accionable" : "Actionable error", "error");
  elements.inputStatus.textContent = error;
  elements.outputStatus.textContent = language === "es" ? "No se generó resultado" : "No result generated";
  updateOutputEmptyState();
  toast(error, "error");
}

function renderExecutionResult(result) {
  const language = getLanguage();
  elements.output.value = result.output ?? "";
  elements.outputStatus.textContent = result.status ?? (language === "es" ? "Resultado listo" : "Result ready");
  if (window.innerWidth < 768 && elements.output.value) setMobileEditorPanel("output");
  updateOutputEmptyState();
  elements.inputStatus.textContent = t("processed");
  elements.copy.disabled = !elements.output.value;
  elements.download.disabled = !elements.output.value;
  setStatus(t("complete"));
  renderSupplementaryResults(result);
  recordHistory(result);
  updateCounters();
  toast(result.status ?? (language === "es" ? "Operación completada" : "Operation complete"), "success");
}

function runActiveTool() {
  try {
    const result = activeTool.run(elements.input.value);
    if (result.error) renderExecutionError(result.error);
    else renderExecutionResult(result);
  } catch (error) {
    const language = getLanguage();
    setStatus(language === "es" ? "Error inesperado" : "Unexpected error", "error");
    toast(`${language === "es" ? "No se pudo procesar" : "Could not process"}: ${error.message}`, "error");
  } finally {
    setExecutionState(false);
  }
}

function execute() {
  if (!elements.input.value.trim() && !["mock", "uuid"].includes(activeTool.id)) {
    setStatus(t("requiredInput"), "error");
    elements.inputStatus.textContent = t("addData");
    toast(t("addPayload"), "error");
    elements.input.focus();
    return;
  }

  setStatus(t("working"), "working");
  setExecutionState(true);
  window.requestAnimationFrame(runActiveTool);
}

function closeMenu({ restoreFocus = false } = {}) {
  const wasOpen = elements.sidebar.classList.contains("is-open");
  elements.sidebar.classList.remove("is-open");
  elements.overlay.classList.remove("is-visible");
  elements.overlay.hidden = true;
  elements.menu.setAttribute("aria-expanded", "false");
  if (restoreFocus && wasOpen) menuOrigin?.focus();
  menuOrigin = null;
}

function openMenu(origin = document.activeElement) {
  menuOrigin = origin instanceof HTMLElement ? origin : null;
  elements.sidebar.classList.add("is-open");
  elements.overlay.hidden = false;
  requestAnimationFrame(() => elements.overlay.classList.add("is-visible"));
  elements.menu.setAttribute("aria-expanded", "true");
  elements.sidebar.querySelector("a")?.focus();
}

function getCommandTools(query = "") {
  const language = getLanguage();
  const actions = [
    { id: "execute", title: language === "es" ? "Ejecutar herramienta actual" : "Run active tool", category: language === "es" ? "Acción" : "Action" },
    { id: "example", title: t("loadExample"), category: language === "es" ? "Acción" : "Action" },
    { id: "clear", title: t("clear"), category: language === "es" ? "Acción" : "Action" },
    { id: "copy", title: t("copyResult"), category: language === "es" ? "Acción" : "Action" },
    { id: "theme", title: language === "es" ? "Cambiar tema" : "Switch theme", category: language === "es" ? "Acción" : "Action" },
  ].map((action) => ({ ...action, action: action.id }));

  const toolItems = tools.map((tool) => {
    const copy = toolText(tool.id);
    return { id: tool.id, title: copy.title, category: copy.category };
  });

  const normalized = query.toLowerCase().trim();
  return [...actions, ...toolItems].filter((item) => `${item.title} ${item.category}`.toLowerCase().includes(normalized));
}

function renderCommandList(query = "") {
  const filtered = getCommandTools(query);
  if (commandIndex >= filtered.length) commandIndex = filtered.length - 1;
  elements.commandResults.innerHTML = filtered.map((item, index) => {
    const target = item.action ? `data-command-action="${item.action}"` : `data-command-tool="${item.id}"`;
    return `<button class="command-item${index === commandIndex ? " is-active" : ""}" id="command-option-${item.id}" type="button" ${target}><span aria-hidden="true">${item.action ? "⌁" : "→"}</span>${item.title}<span class="command-item-meta">${item.category}</span></button>`;
  }).join("") || `<p class="command-item" role="status">${t("noTools")}</p>`;
}

function openCommand(origin = document.activeElement) {
  if (elements.dialog.open) return;
  commandOrigin = origin instanceof HTMLElement ? origin : null;
  commandIndex = 0;
  elements.commandSearch.value = "";
  renderCommandList();
  elements.dialog.showModal();
  elements.commandSearch.focus();
}

function closeCommand() {
  if (!elements.dialog.open) return;
  elements.dialog.close();
  commandOrigin?.focus();
  commandOrigin = null;
}

function selectCommand(toolId, router, action) {
  if (action) {
    closeCommand();
    if (action === "execute") execute();
    if (action === "example") elements.example.click();
    if (action === "clear") elements.clear.click();
    if (action === "copy") elements.copy.click();
    if (action === "theme") switchTheme();
    return;
  }

  if (!toolId) return;
  closeCommand();
  router.navigate(toolId);
}

function updateConnectionStatus() {
  const online = navigator.onLine;
  const language = getLanguage();
  const onlineLabel = language === "es" ? "Con conexión" : "Online";
  const offlineLabel = language === "es" ? "Sin conexión; usando datos locales" : "Offline; using local data";

  elements.connection.textContent = online ? t("online") : t("offline");
  elements.connection.classList.toggle("is-offline", !online);
  elements.connection.setAttribute("aria-label", online ? onlineLabel : offlineLabel);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) return;
  navigator.serviceWorker.register("./sw.js")
    .then(() => {
      if (navigator.serviceWorker.controller) toast("PayloadForge está disponible offline.", "success");
    })
    .catch(() => {
      // La aplicación conserva funcionalidad sin Service Worker en hosts estáticos restrictivos.
    });
}

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolvedTheme(theme = store.get("theme")) {
  return theme === "system" ? systemTheme() : theme;
}

function setThemeIcon(theme) {
  const use = elements.theme.querySelector("use");
  if (use) use.setAttribute("href", theme === "dark" ? "#icon-sun" : "#icon-moon");
}

function applyPreferences() {
  const theme = resolvedTheme();
  const density = store.get("density");
  const wrap = store.get("editorWrap");
  const lineNumbers = store.get("editorLineNumbers");
  const fontSize = Number(store.get("editorFontSize"));

  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.density = density;
  document.documentElement.classList.toggle("editor-wrap", wrap);
  document.documentElement.classList.toggle("hide-line-numbers", !lineNumbers);
  document.documentElement.style.setProperty("--editor-font-size", `${fontSize}px`);
  elements.input.autocomplete = store.get("editorAutocomplete") ? "on" : "off";
  elements.output.autocomplete = store.get("editorAutocomplete") ? "on" : "off";
  elements.theme.setAttribute("aria-label", theme === "dark" ? t("themeToLight") : t("themeToDark"));
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#16191d" : "#ebece7";
  setThemeIcon(theme);
  renderEditorLayers();
}

function historyEntries() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function formatStorageSize(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function updateHistoryStatus() {
  const entries = historyEntries();
  const serializedHistory = localStorage.getItem(HISTORY_KEY) ?? "";
  const latest = entries[0]?.at ? new Date(entries[0].at) : null;

  elements.historyStatus.textContent = store.get("historyEnabled")
    ? `${entries.length} operación(es) guardada(s); sin payloads ni resultados.`
    : "Desactivado; no se guardan operaciones.";
  elements.historyCount.textContent = String(entries.length);
  elements.historySize.textContent = formatStorageSize(new Blob([serializedHistory]).size);
  elements.historyUpdated.textContent = latest
    ? latest.toLocaleDateString(getLanguage(), { day: "2-digit", month: "short" })
    : "—";
  elements.historyClear.disabled = !entries.length;
}

function recordHistory(result) {
  if (!store.get("historyEnabled")) return;
  const entry = {
    tool: activeTool.id,
    status: result.status ?? "Completed",
    at: new Date().toISOString(),
  };
  localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...historyEntries()].slice(0, MAX_HISTORY_ENTRIES)));
  updateHistoryStatus();
}

function syncSwitchAria(control) {
  control.setAttribute("aria-checked", String(control.checked));
}

function updateFontSizeControl() {
  const size = Number(elements.preferenceFontSize.value);
  const progress = ((size - Number(elements.preferenceFontSize.min)) / (Number(elements.preferenceFontSize.max) - Number(elements.preferenceFontSize.min))) * 100;
  elements.preferenceFontSize.style.setProperty("--range-progress", `${progress}%`);
  elements.preferenceFontSizeValue.textContent = `${size} px`;
  elements.preferenceFontSize.setAttribute("aria-valuetext", `${size} píxeles`);
}

function syncPreferencesDialog() {
  elements.preferenceTheme.value = store.get("theme");
  elements.preferenceDensity.value = store.get("density");
  elements.preferenceWrap.checked = store.get("editorWrap");
  elements.preferenceLineNumbers.checked = store.get("editorLineNumbers");
  elements.preferenceSyntaxHighlight.checked = store.get("editorSyntaxHighlight");
  elements.preferenceAutocomplete.checked = store.get("editorAutocomplete");
  elements.preferenceFontSize.value = store.get("editorFontSize");
  elements.preferenceHistory.checked = store.get("historyEnabled");
  [
    elements.preferenceWrap,
    elements.preferenceLineNumbers,
    elements.preferenceSyntaxHighlight,
    elements.preferenceAutocomplete,
    elements.preferenceHistory,
  ].forEach(syncSwitchAria);
  updateFontSizeControl();
  updateHistoryStatus();
}

function closePreferences({ restoreFocus = true } = {}) {
  if (!elements.preferences.open) return;
  elements.preferences.close();
  if (restoreFocus) preferencesOrigin?.focus();
  preferencesOrigin = null;
}

function switchTheme() {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  store.set("theme", theme, { persist: true });
  applyPreferences();
}

function bindEditorEnhancements() {
  elements.input.addEventListener("input", () => {
    drafts.set(activeTool.id, elements.input.value);
    elements.inputStatus.textContent = elements.input.value ? t("unsavedChanges") : t("waiting");
    updateCounters();
  });
  elements.input.addEventListener("scroll", () => renderEditorLayer(elements.input, elements.inputLines, elements.inputHighlight));
  elements.output.addEventListener("scroll", () => renderEditorLayer(elements.output, elements.outputLines, elements.outputHighlight));
  elements.input.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      const { selectionStart, selectionEnd } = elements.input;
      elements.input.setRangeText("  ", selectionStart, selectionEnd, "end");
      elements.input.dispatchEvent(new Event("input"));
    }
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      execute();
    }
  });

  let startX = 0;
  document.addEventListener("touchstart", (event) => { startX = event.changedTouches[0].clientX; }, { passive: true });
  document.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - startX;
    if (distance > 75 && startX < 36) openMenu();
    if (distance < -75 && elements.sidebar.classList.contains("is-open")) closeMenu();
  }, { passive: true });

  let resizing = false;
  const resize = (clientX, force = false) => {
    if ((!resizing && !force) || window.innerWidth < 768) return;
    const area = document.querySelector(".editor-workspace");
    const rect = area.getBoundingClientRect();
    const percent = Math.min(70, Math.max(30, ((clientX - rect.left) / rect.width) * 100));
    area.style.gridTemplateColumns = `minmax(280px, ${percent}fr) 10px minmax(280px, ${100 - percent}fr)`;
  };
  elements.resize.addEventListener("pointerdown", (event) => { resizing = true; elements.resize.setPointerCapture(event.pointerId); });
  elements.resize.addEventListener("pointermove", (event) => resize(event.clientX));
  elements.resize.addEventListener("pointerup", () => { resizing = false; });
  elements.resize.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const area = document.querySelector(".editor-workspace");
    const columns = getComputedStyle(area).gridTemplateColumns.split(" ");
    const first = Number.parseFloat(columns[0]) || area.clientWidth / 2;
    resize(first + area.getBoundingClientRect().left + (event.key === "ArrowLeft" ? -30 : 30), true);
  });
}

function bindEvents(router) {
  elements.execute.addEventListener("click", execute);
  elements.inputTab.addEventListener("click", () => setMobileEditorPanel("input"));
  elements.outputTab.addEventListener("click", () => setMobileEditorPanel("output"));
  elements.copy.addEventListener("click", async () => {
    if (await copyText(elements.output.value)) toast(t("copied"), "success");
    else toast(t("copyFailed"), "error");
  });
  elements.download.addEventListener("click", () => {
    const extension = activeTool.id === "yaml" && document.querySelector("#yaml-direction")?.value === "json-to-yaml" ? "yaml" : "json";
    downloadText(elements.output.value, `payloadforge-${activeTool.id}.${extension}`, extension === "yaml" ? "text/yaml;charset=utf-8" : undefined);
    toast(t("downloaded"), "success");
  });
  elements.importButton.addEventListener("click", () => elements.fileImport.click());
  elements.fileImport.addEventListener("change", (event) => importFile(event.target.files[0]));
  ["dragenter", "dragover"].forEach((eventName) => {
    elements.inputCard.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.inputCard.classList.add("is-dragging");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    elements.inputCard.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.inputCard.classList.remove("is-dragging");
    });
  });
  elements.inputCard.addEventListener("drop", (event) => importFile(event.dataTransfer.files[0]));
  elements.example.addEventListener("click", () => {
    elements.input.value = examples[activeTool.id] ?? "";
    elements.input.dispatchEvent(new Event("input"));
    resetResult();
    toast(t("exampleLoaded"), "success");
    elements.input.focus();
  });
  elements.clear.addEventListener("click", () => {
    elements.input.value = "";
    drafts.delete(activeTool.id);
    resetResult();
    elements.inputStatus.textContent = t("waiting");
    setStatus(t("ready"));
    elements.input.focus();
  });
  elements.share.addEventListener("click", async () => {
    const url = location.href;
    if (navigator.share) await navigator.share({ title: document.title, url }).catch(() => {});
    else if (await copyText(url)) toast(t("toolLinkCopied"), "success");
  });
  elements.theme.addEventListener("click", switchTheme);
  elements.preferencesToggle.addEventListener("click", () => {
    preferencesOrigin = elements.preferencesToggle;
    syncPreferencesDialog();
    elements.preferences.showModal();
    elements.preferencesClose.focus();
  });
  elements.preferencesClose.addEventListener("click", closePreferences);
  elements.historyClear.addEventListener("click", () => {
    if (elements.historyClear.dataset.confirm !== "true") {
      elements.historyClear.dataset.confirm = "true";
      elements.historyClear.querySelector("span").textContent = "¿Confirmar limpieza?";
      elements.historyClear.setAttribute("aria-label", "Confirmar limpieza del historial");
      window.setTimeout(() => {
        if (elements.historyClear.dataset.confirm !== "true") return;
        delete elements.historyClear.dataset.confirm;
        elements.historyClear.querySelector("span").textContent = "Limpiar historial";
        elements.historyClear.removeAttribute("aria-label");
      }, 4000);
      return;
    }
    delete elements.historyClear.dataset.confirm;
    elements.historyClear.querySelector("span").textContent = "Limpiar historial";
    elements.historyClear.removeAttribute("aria-label");
    localStorage.removeItem(HISTORY_KEY);
    updateHistoryStatus();
    toast("Historial local eliminado.", "success");
  });
  elements.preferences.addEventListener("cancel", (event) => {
    event.preventDefault();
    closePreferences();
  });
  elements.preferences.addEventListener("click", (event) => {
    if (event.target === elements.preferences) closePreferences();
  });
  elements.preferences.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...elements.preferences.querySelectorAll("button:not(:disabled), select:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex='-1'])")];
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  elements.preferenceFontSize.addEventListener("input", () => {
    const size = Math.min(20, Math.max(11, Number(elements.preferenceFontSize.value) || 13));
    store.set("editorFontSize", size, { persist: true });
    updateFontSizeControl();
    applyPreferences();
  });
  [
    [elements.preferenceTheme, "theme", (value) => value],
    [elements.preferenceDensity, "density", (value) => value],
    [elements.preferenceWrap, "editorWrap", (_, control) => control.checked],
    [elements.preferenceLineNumbers, "editorLineNumbers", (_, control) => control.checked],
    [elements.preferenceSyntaxHighlight, "editorSyntaxHighlight", (_, control) => control.checked],
    [elements.preferenceAutocomplete, "editorAutocomplete", (_, control) => control.checked],
    [elements.preferenceFontSize, "editorFontSize", (value) => Math.min(20, Math.max(11, Number(value) || 13))],
    [elements.preferenceHistory, "historyEnabled", (_, control) => control.checked],
  ].forEach(([control, key, valueFor]) => {
    control.addEventListener("change", () => {
      store.set(key, valueFor(control.value, control), { persist: true });
      if (control.matches('[role="switch"]')) syncSwitchAria(control);
      applyPreferences();
      if (control === elements.preferenceFontSize) updateFontSizeControl();
      updateHistoryStatus();
    });
  });
  elements.language.addEventListener("change", () => {
    setLanguage(elements.language.value);
    store.set("language", getLanguage(), { persist: true });
    applyLanguage();
    updateConnectionStatus();
    renderTool(activeTool.id);
  });
  elements.options.addEventListener("change", (event) => {
    if (event.target.id !== "uuid-mode") return;
    syncToolOptions();
    resetResult();
  });
  elements.nav.addEventListener("click", (event) => {
    const toggle = event.target.closest(".nav-group-toggle");
    if (!toggle) return;
    const group = toggle.closest(".nav-group");
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    group.classList.toggle("is-collapsed", expanded);
    store.set(`nav-group-${group.dataset.group}`, !expanded ? "expanded" : "collapsed", { persist: true });
    applyLanguage();
  });
  elements.menu.addEventListener("click", () => elements.sidebar.classList.contains("is-open")
    ? closeMenu({ restoreFocus: true })
    : openMenu(elements.menu));
  elements.overlay.addEventListener("click", () => closeMenu({ restoreFocus: true }));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && elements.sidebar.classList.contains("is-open")) {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    }
  });
  elements.nav.addEventListener("click", (event) => {
    const target = event.target.closest("[data-tool]");
    if (target) closeMenu();
  });

  elements.globalSearch.addEventListener("click", () => openCommand(elements.globalSearch));
  elements.globalSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCommand(elements.globalSearch);
    }
  });
  elements.commandSearch.addEventListener("input", () => {
    commandIndex = 0;
    renderCommandList(elements.commandSearch.value);
  });
  elements.commandSearch.addEventListener("keydown", (event) => {
    const filtered = getCommandTools(elements.commandSearch.value);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!filtered.length) return;
      commandIndex = event.key === "ArrowDown"
        ? (commandIndex + 1) % filtered.length
        : (commandIndex - 1 + filtered.length) % filtered.length;
      renderCommandList(elements.commandSearch.value);
      document.querySelector(".command-item.is-active")?.scrollIntoView({ block: "nearest" });
    }
    if (event.key === "Enter") {
      event.preventDefault();
      selectCommand(filtered[commandIndex]?.id, router, filtered[commandIndex]?.action);
    }
  });
  elements.commandClose.addEventListener("click", closeCommand);
  elements.dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeCommand();
  });
  elements.dialog.addEventListener("click", (event) => {
    if (event.target === elements.dialog) closeCommand();
  });
  elements.commandResults.addEventListener("click", (event) => {
    const command = event.target.closest("[data-command-tool], [data-command-action]");
    selectCommand(command?.dataset.commandTool, router, command?.dataset.commandAction);
  });
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openCommand(document.activeElement);
    }
  });
}

function boot() {
  if (!store.get("theme")) store.set("theme", "system", { persist: true });
  setLanguage(store.get("language") ?? "es");
  document.querySelectorAll(".nav-group").forEach((group) => {
    const collapsed = store.get(`nav-group-${group.dataset.group}`) === "collapsed";
    group.classList.toggle("is-collapsed", collapsed);
    group.querySelector(".nav-group-toggle").setAttribute("aria-expanded", String(!collapsed));
  });
  applyLanguage();
  applyPreferences();
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (store.get("theme") === "system") applyPreferences();
  });
  updateConnectionStatus();
  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);
  registerServiceWorker();
  bindEditorEnhancements();
  const router = new Router(tools.map((tool) => tool.id), renderTool);
  bindEvents(router);
  router.start();
  updateCounters();
}

boot();
