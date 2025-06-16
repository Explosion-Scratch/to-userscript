// ===================================================================
// 1) EVENT BUS FACTORY
// ===================================================================
function createEventBus(
  type = "page",
  {
    allowedOrigin = "*",
    children = [],     // only for page mode
    parentWindow = null
  } = {}
) {
  const handlers = {};

  function handleIncoming(ev) {
    if (allowedOrigin !== "*" && ev.origin !== allowedOrigin) return;
    const msg = ev.data;
    if (!msg || msg.__eventBus !== true) return;

    const { event, payload } = msg;

    // PAGE: if it's an INIT from an iframe, add it to children
    if (type === "page" && event === "__INIT__") {
      const win = ev.source;
      if (win && !children.includes(win)) {
        children.push(win);
      }
      return;
    }

    // Otherwise dispatch to any listeners
    (handlers[event] || []).forEach(fn => {
      fn(payload, { origin: ev.origin, source: ev.source });
    });
  }

  window.addEventListener("message", handleIncoming);

  function emitTo(win, event, payload) {
    win.postMessage({ __eventBus: true, event, payload }, allowedOrigin);
  }

  // If this is an iframe, immediately announce yourself:
  if (type === "iframe") {
    // give the page a moment to attach its listener
    setTimeout(() => {
      const pw = parentWindow || window.parent;
      if (pw && pw.postMessage) {
        emitTo(pw, "__INIT__", null);
      }
    }, 0);
  }

  return {
    on(event, fn) {
      handlers[event] = handlers[event] || [];
      handlers[event].push(fn);
    },

    off(event, fn) {
      if (!handlers[event]) return;
      handlers[event] = handlers[event].filter(h => h !== fn);
    },

    emit(event, payload) {
      // 1) local
      (handlers[event] || []).forEach(fn =>
        fn(payload, { origin: location.origin, source: window })
      );

      // 2) remote
      if (type === "page") {
        children.forEach(win => emitTo(win, event, payload));
      } else {
        const pw = parentWindow || window.parent;
        if (pw && pw.postMessage) {
          emitTo(pw, event, payload);
        }
      }
    }
  };
}

// ===================================================================
// 2) RUNTIME POLYFILL FACTORY
// ===================================================================
function createRuntime(type = "background", bus) {
  let nextId = 1;
  const pending = {};
  const listeners = [];

  function parseArgs(args) {
    let target, message, options, callback;
    const arr = [...args];
    if (arr.length === 0) {
      throw new Error("sendMessage requires at least one argument");
    }
    if (arr.length === 1) { return { message: arr[0] }; }
    if (arr.length && typeof arr[arr.length - 1] === "object" && !Array.isArray(arr[arr.length - 1])) {
      options = arr.pop();
    }
    if (arr.length && typeof arr[arr.length - 1] === "function") {
      callback = arr.pop();
    }

    if (arr.length === 2 && (typeof arr[0] === "string" || typeof arr[0] === "number")) {
      [target, message] = arr;
    } else {
      [message] = arr;
    }

    return { target, message, options, callback };
  }

  // BACKGROUND: handle incoming requests
  if (type === "background") {
    bus.on("__REQUEST__", ({ id, message }, _) => {
      let responded = false, isAsync = false;

      function sendResponse(resp) {
        if (responded) return;
        responded = true;
        bus.emit("__RESPONSE__", { id, response: resp });
      }

      const results = listeners.map(fn => {
        try {
          const ret = fn(message, sendResponse);
          if (ret === true) { isAsync = true; return; }
          if (ret && typeof ret.then === "function") { isAsync = true; return ret; }
          return ret;
        }
        catch (e) { console.error(e); }
      }).filter(Boolean);

      const promises = results.filter(r => r && typeof r.then === "function");
      if (!isAsync && promises.length === 0) {
        const out = results.length === 1 ? results[0] : results;
        sendResponse(out);
      }
      else if (promises.length) {
        Promise.all(promises).then(vals => {
          if (!responded) {
            const out = vals.length === 1 ? vals[0] : vals;
            sendResponse(out);
          }
        });
      }
    });
  }

  // NON-BACKGROUND: handle responses
  if (type !== "background") {
    bus.on("__RESPONSE__", ({ id, response }) => {
      const entry = pending[id];
      if (!entry) return;
      entry.resolve(response);
      if (entry.callback) entry.callback(response);
      delete pending[id];
    });
  }

  function sendMessage(...args) {
    if (type === "background") {
      throw new Error("Background cannot sendMessage to itself");
    }

    const { target, message, callback } = parseArgs(args);
    const id = nextId++;

    const promise = new Promise(resolve => {
      pending[id] = { resolve, callback };
      bus.emit("__REQUEST__", { id, message });
    });

    return promise
  }

  return {
    sendMessage,
    onMessage: {
      addListener(fn) {
        listeners.push(fn);
      },
      removeListener(fn) {
        const i = listeners.indexOf(fn);
        if (i >= 0) listeners.splice(i, 1);
      }
    }
  };
}
