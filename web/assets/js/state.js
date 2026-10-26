import { eventBus } from "./event-bus.js";

const STORAGE_KEY = "payloadforge.preferences";

class Store {
  #state = {
    theme: "system",
    density: "comfortable",
    editorWrap: false,
    editorFontSize: 13,
    historyEnabled: false,
    activeTool: "schema",
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
      editorFontSize,
      historyEnabled,
      activeTool,
    } = this.#state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      theme,
      density,
      editorWrap,
      editorFontSize,
      historyEnabled,
      activeTool,
    }));
  }
}

export const store = new Store();
