/**
 * Canal de eventos desacoplado para comunicación entre núcleo, UI y módulos.
 */
export class EventBus {
  #events = new Map();

  on(eventName, listener) {
    const listeners = this.#events.get(eventName) ?? new Set();
    listeners.add(listener);
    this.#events.set(eventName, listeners);
    return () => this.off(eventName, listener);
  }

  off(eventName, listener) {
    this.#events.get(eventName)?.delete(listener);
  }

  emit(eventName, payload) {
    this.#events.get(eventName)?.forEach((listener) => listener(payload));
  }
}

export const eventBus = new EventBus();
