// INITIAL INSTRUCTIONS:
/*
Create a chrome.runtime.sendMessage polyfill https://developer.chrome.com/docs/extensions/reference/api/runtime#method-sendMessage https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage . This should have a function for createRuntime(type = "background"|"tab"|"ext_page", event bus) where the function creates the runtime object with sendMessage and onMessage add listener functions. Create code to create the event bus as well. The event bus comes in one of two types, "page" or "iframe" where page is the main event bus and should be called once, and sets up listeners for the iframe event bus. The iframe event bus has the same on, off, emit, API but uses postMessage on window.parent to send the message to the background which triggers whatever listeners. The event bus should be able to be instantiated in either of these environments then called with .on(event, handler(data)), or .emit(event, data). The createRuntime should then use this as a backend and abstract so that a chrome.runtime type object is returned.
*/

// ===================================================================
// 1) EVENT BUS FACTORY
// ===================================================================
function createEventBus(
  type = "page",
  {
    allowedOrigin = "*",
    children = [],
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
    (handlers[event] || []).forEach(fn =>
      fn(payload, { origin: ev.origin, source: ev.source })
    );
  }

  window.addEventListener("message", handleIncoming);

  function emitTo(win, event, payload) {
    win.postMessage({ __eventBus: true, event, payload }, allowedOrigin);
  }

  // IFRAME announces itself to the PAGE
  if (type === "iframe") {
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
      // 1) dispatch locally
      (handlers[event] || []).forEach(fn =>
        fn(payload, { origin: location.origin, source: window })
      );
      // 2) broadcast
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
// 2) RUNTIME POLYFILL FACTORY WITH PORTS
// ===================================================================
function createRuntime(type = "background", bus) {
  // message-based RPC
  let nextId = 1;
  const pending = {};
  const msgListeners = [];

  // port-based
  let nextPortId = 1;
  const ports = {};      // all open ports by id
  const onConnectListeners = [];

  function parseArgs(args) {
    let target, message, options, callback;
    const arr = [...args];
    if (arr.length === 0) {
      throw new Error("sendMessage requires at least one argument");
    }
    // last object could be options
    if (arr.length && typeof arr[arr.length - 1] === "object" && !Array.isArray(arr[arr.length - 1])) {
      options = arr.pop();
    }
    // last function is callback
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

  // -------------------------
  // 1) BACKGROUND message RPC
  // -------------------------
  if (type === "background") {
    bus.on("__REQUEST__", ({ id, message }, _) => {
      let responded = false, isAsync = false;
      function sendResponse(resp) {
        if (responded) return;
        responded = true;
        bus.emit("__RESPONSE__", { id, response: resp });
      }
      const results = msgListeners.map(fn => {
        try {
          const ret = fn(message, sendResponse);
          if (ret === true || (ret && typeof ret.then === "function")) {
            isAsync = true;
            return ret;
          }
          return ret;
        } catch (e) {
          console.error(e);
        }
      }).filter(r => r !== undefined);

      const promises = results.filter(r => r && typeof r.then === "function");
      if (!isAsync && promises.length === 0) {
        const out = results.length === 1 ? results[0] : results;
        sendResponse(out);
      } else if (promises.length) {
        Promise.all(promises).then(vals => {
          if (!responded) {
            const out = vals.length === 1 ? vals[0] : vals;
            sendResponse(out);
          }
        });
      }
    });
  }

  // -----------------------------
  // 2) NON-BACKGROUND message RPC
  // -----------------------------
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
    return promise;
  }

  // ============================
  // PORT‐BASED CONNECT / DISCONNECT
  // ============================
  // When any side calls .connect(), emit a magic event
  // that the background listens to.  The background then
  // notifies its onConnect listeners with a Port object.
  bus.on("__PORT_CONNECT__", ({ portId, name }, { source }) => {
    // Only the background should handle incoming connect requests:
    if (type !== "background") return;

    // create two ends of the pipe:
    //   - backgroundPort: what background code uses
    //   - contentPort: what the client who called .connect() uses
    //
    // Both share the same portId, but we keep separate
    // handler queues and wire them via the bus.
    const backgroundPort = makePort("background", portId, name, source);
    ports[portId] = backgroundPort;

    // notify background listeners
    onConnectListeners.forEach(fn => fn(backgroundPort));

    // send back a CONNECT_ACK so the client can
    // start listening on its end:
    bus.emit("__PORT_CONNECT_ACK__", { portId, name }, { to: source });
  });

  // Clients handle the ACK and finalize their Port object:
  bus.on("__PORT_CONNECT_ACK__", ({ portId, name }, { source }) => {
    if (type === "background") return; // ignore
    const p = ports[portId];
    if (!p) return;
    p._ready = true;
    p._drainBuffer();
  });

  // Any port message travels via "__PORT_MESSAGE__"
  bus.on("__PORT_MESSAGE__", ({ portId, msg }, { source }) => {
    const p = ports[portId];
    if (!p) return;
    p._receive(msg);
  });

  // Any port disconnect:
  bus.on("__PORT_DISCONNECT__", ({ portId }, { source }) => {
    const p = ports[portId];
    if (!p) return;
    p._disconnect();
    delete ports[portId];
  });

  function makePort(side, portId, name, remoteWindow) {
    let onMessageHandlers = [];
    let onDisconnectHandlers = [];
    let buffer = [];
    let _ready = side === "background";
    // background ends are always ready
    // client ends wait for CONNECT_ACK

    function _drainBuffer() {
      buffer.forEach(m => _post(m));
      buffer = [];
    }

    function _post(msg) {
      // unidirectional: send from this side, receive on the other
      bus.emit("__PORT_MESSAGE__", { portId, msg }, { to: remoteWindow });
    }

    function postMessage(msg) {
      if (!_ready) {
        buffer.push(msg);
      } else {
        _post(msg);
      }
    }

    function _receive(msg) {
      onMessageHandlers.forEach(fn => fn(msg));
    }

    function disconnect() {
      bus.emit("__PORT_DISCONNECT__", { portId }, { to: remoteWindow });
      _disconnect();
      delete ports[portId];
    }

    function _disconnect() {
      onDisconnectHandlers.forEach(fn => fn());
      onMessageHandlers = [];
      onDisconnectHandlers = [];
    }

    return {
      name,
      onMessage: {
        addListener(fn) { onMessageHandlers.push(fn); },
        removeListener(fn) { onMessageHandlers = onMessageHandlers.filter(x => x !== fn); }
      },
      onDisconnect: {
        addListener(fn) { onDisconnectHandlers.push(fn); },
        removeListener(fn) { onDisconnectHandlers = onDisconnectHandlers.filter(x => x !== fn); }
      },
      postMessage,
      disconnect,
      _ready,       // internal
      _drainBuffer  // internal
    };
  }

  function connect(connectInfo = {}) {
    if (type === "background") {
      throw new Error("Background must use onConnect, not connect()");
    }
    const name = connectInfo.name || "";
    const portId = nextPortId++;
    // create the client side port
    // remoteWindow is left undefined here; bus.emit will pick up via { to: page/iframe }
    const clientPort = makePort("client", portId, name, null);
    ports[portId] = clientPort;

    // fire the connect event across the bus
    bus.emit("__PORT_CONNECT__", { portId, name });
    return clientPort;
  }

  function onConnect(fn) {
    if (type !== "background") {
      throw new Error("connect event only fires in background");
    }
    onConnectListeners.push(fn);
  }

  // Finally, wire up the returned runtime object:
  return {
    // rpc:
    sendMessage,
    onMessage: {
      addListener(fn) { msgListeners.push(fn); },
      removeListener(fn) {
        const i = msgListeners.indexOf(fn);
        if (i >= 0) msgListeners.splice(i, 1);
      }
    },

    // port API:
    connect,
    onConnect: {
      addListener(fn) { onConnect(fn); },
      removeListener(fn) {
        const i = onConnectListeners.indexOf(fn);
        if (i >= 0) onConnectListeners.splice(i, 1);
      }
    }
  };
}