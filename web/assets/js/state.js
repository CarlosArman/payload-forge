import { eventBus } from "./event-bus.js";

const STORAGE_KEY = "payloadforge.preferences";

class Store {
  #state = {
    theme: "system",
    density: "comfortable",
    editorWrap: false,
    editorLineNumbers: true,
    editorSyntaxHighlight: true,
    editorAutocomplete: true,
    editorFontSize: 13,
    historyEnabled: false,
    activeTool: "schema",
    favoriteTools: [],
    recentTools: [],
    workflowGuideCollapsed: false,
    input: "",
    output: "",
  };

  constructor() {
    try {
      this.#state = { ...this.#state, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") };
    } catch {
      // Si el almacenamiento está corrupto se mantienen las preferencias seguras.
    }
  }

  get(key) {
    return this.#state[key];
  }

  set(key, value, { persist = false } = {}) {
    this.#state[key] = value;
    if (persist) this.persist();
    eventBus.emit("state:changed", { key, value });
  }

  snapshot() {
    return { ...this.#state };
  }

  persist() {
    const {
      theme,
      density,
      editorWrap,
      editorLineNumbers,
      editorSyntaxHighlight,
      editorAutocomplete,
      editorFontSize,
      historyEnabled,
      activeTool,
      favoriteTools,
      recentTools,
      workflowGuideCollapsed,
    } = this.#state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      theme,
      density,
      editorWrap,
      editorLineNumbers,
      editorSyntaxHighlight,
      editorAutocomplete,
      editorFontSize,
      historyEnabled,
      activeTool,
      favoriteTools,
      recentTools,
      workflowGuideCollapsed,
    }));
  }
}

export const store = new Store();
