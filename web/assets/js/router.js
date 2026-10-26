import { store } from "./state.js";

export class Router {
  constructor(toolIds, onRouteChange) {
    this.toolIds = new Set(toolIds);
    this.onRouteChange = onRouteChange;
    window.addEventListener("hashchange", () => this.resolve());
  }

  start() {
    if (!location.hash || !this.toolIds.has(location.hash.slice(1))) {
      location.hash = `#${store.get("activeTool")}`;
      return;
    }
    this.resolve();
  }

  navigate(toolId) {
    if (this.toolIds.has(toolId)) location.hash = `#${toolId}`;
  }

  resolve() {
    const toolId = location.hash.slice(1);
    if (!this.toolIds.has(toolId)) return this.navigate("schema");
    store.set("activeTool", toolId, { persist: true });
    this.onRouteChange(toolId);
  }
}
