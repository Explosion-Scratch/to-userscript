/**
 * Minimal event bus and chrome.runtime polyfill.
 * @module runtimePolyfill
 */

/**
 * @typedef {"page"|"iframe"} BusEnvironment
 * @typedef {"background"|"tab"|"ext_page"} RuntimeType
 */

/**
 * @typedef {object} EventBus
 * @property {(event: string, handler: (data: any) => void) => void} on
 * @property {(event: string, handler: (data: any) => void) => void} off
 * @property {(event: string, data: any) => void} emit
 */

const FLAG = '__eventBus';

/**
 * Creates an event bus.
 * @param {BusEnvironment} env
 * @returns {EventBus}
 */
export function createEventBus(env = 'page') {
  const listeners = new Map();

  const dispatch = (event, data) => {
    const subs = listeners.get(event);
    if (subs) subs.forEach((fn) => fn(data));
  };

  window.addEventListener('message', (e) => {
    const { data } = e;
    if (data && data[FLAG]) dispatch(data.event, data.payload);
  });

  return {
    on(event, handler) {
      const set = listeners.get(event) || new Set();
      set.add(handler);
      listeners.set(event, set);
    },

    off(event, handler) {
      const set = listeners.get(event);
      if (!set) return;
      set.delete(handler);
      if (!set.size) listeners.delete(event);
    },

    emit(event, payload) {
      dispatch(event, payload);
      const message = { [FLAG]: true, event, payload };
      if (env === 'iframe') {
        if (window.parent) window.parent.postMessage(message, '*');
      } else {
        Array.from(document.querySelectorAll('iframe')).forEach((frame) => {
          if (frame.contentWindow) frame.contentWindow.postMessage(message, '*');
        });
      }
    }
  };
}

/**
 * Returns a chrome.runtime like object built on top of the event bus.
 * @param {RuntimeType} type
 * @param {EventBus} bus
 */
export function createRuntime(type = 'tab', bus) {
  const messageEvent = 'runtime-message';
  const handlers = new Set();

  bus.on(messageEvent, ({ sender, payload }) => {
    if (sender === type) return;
    handlers.forEach((fn) => fn(payload, { sender }, () => {}));
  });

  return {
    sendMessage(payload) {
      bus.emit(messageEvent, { sender: type, payload });
    },
    onMessage: {
      addListener(fn) {
        handlers.add(fn);
      },
      removeListener(fn) {
        handlers.delete(fn);
      },
      hasListener(fn) {
        return handlers.has(fn);
      }
    }
  };
} 