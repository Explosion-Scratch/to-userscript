// -- Messaging implementation

function createEventBus(
  scopeId,
  type = "page", // "page" or "iframe"
  { allowedOrigin = "*", children = [], parentWindow = null } = {}
) {
  if (!scopeId) throw new Error("createEventBus requires a scopeId");

  const handlers = {};

  function handleIncoming(ev) {
    if (allowedOrigin !== "*" && ev.origin !== allowedOrigin) return;

    const msg = ev.data;
    if (!msg || msg.__eventBus !== true || msg.scopeId !== scopeId) return;

    const { event, payload } = msg;

    // PAGE: if it's an INIT from an iframe, adopt it
    if (type === "page" && event === "__INIT__") {
      const win = ev.source;
      if (win && !children.includes(win)) {
        children.push(win);
      }
      return;
    }

    (handlers[event] || []).forEach((fn) =>
      fn(payload, { origin: ev.origin, source: ev.source })
    );
  }

  window.addEventListener("message", handleIncoming);

  function emitTo(win, event, payload) {
    const envelope = {
      __eventBus: true,
      scopeId,
      event,
      payload,
    };
    win.postMessage(envelope, allowedOrigin);
  }

  // IFRAME: announce to page on startup
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
      handlers[event] = handlers[event].filter((h) => h !== fn);
    },
    /**
     * Emits an event.
     * @param {string} event - The event name.
     * @param {any} payload - The event payload.
     * @param {object} [options] - Emission options.
     * @param {Window} [options.to] - A specific window to target. If omitted, broadcasts.
     */
    emit(event, payload, { to } = {}) {
      // dispatch locally first
      (handlers[event] || []).forEach((fn) =>
        fn(payload, { origin: location.origin, source: window })
      );

      // If a specific target window is provided, send only to it.
      if (to) {
        if (to && typeof to.postMessage === "function") {
          emitTo(to, event, payload);
        }
        return;
      }

      // Otherwise, perform the default broadcast behavior.
      if (type === "page") {
        children.forEach((win) => emitTo(win, event, payload));
      } else {
        const pw = parentWindow || window.parent;
        if (pw && pw.postMessage) {
          emitTo(pw, event, payload);
        }
      }
    },
  };
}

function createRuntime(type = "background", bus) {
  let nextId = 1;
  const pending = {};
  const msgListeners = [];

  let nextPortId = 1;
  const ports = {};
  const onConnectListeners = [];

  function parseArgs(args) {
    let target, message, options, callback;
    const arr = [...args];
    if (arr.length === 0) {
      throw new Error("sendMessage requires at least one argument");
    }
    if (arr.length === 1) {
      return { message: arr[0] };
    }
    // last object could be options
    if (
      arr.length &&
      typeof arr[arr.length - 1] === "object" &&
      !Array.isArray(arr[arr.length - 1])
    ) {
      options = arr.pop();
    }
    // last function is callback
    if (arr.length && typeof arr[arr.length - 1] === "function") {
      callback = arr.pop();
    }
    if (
      arr.length === 2 &&
      (typeof arr[0] === "string" || typeof arr[0] === "number")
    ) {
      [target, message] = arr;
    } else {
      [message] = arr;
    }
    return { target, message, options, callback };
  }

  if (type === "background") {
    bus.on("__REQUEST__", ({ id, message }, { source }) => {
      let responded = false,
        isAsync = false;
      function sendResponse(resp) {
        if (responded) return;
        responded = true;
        // Target the response directly back to the window that sent the request.
        bus.emit("__RESPONSE__", { id, response: resp }, { to: source });
      }
      const results = msgListeners
        .map((fn) => {
          try {
            // msg, sender, sendResponse
            const ret = fn(message, { id, tab: { id: source } }, sendResponse);
            if (ret === true || (ret && typeof ret.then === "function")) {
              isAsync = true;
              return ret;
            }
            return ret;
          } catch (e) {
            console.error(e);
          }
        })
        .filter((r) => r !== undefined);

      const promises = results.filter((r) => r && typeof r.then === "function");
      if (!isAsync && promises.length === 0) {
        const out = results.length === 1 ? results[0] : results;
        sendResponse(out);
      } else if (promises.length) {
        Promise.all(promises).then((vals) => {
          if (!responded) {
            const out = vals.length === 1 ? vals[0] : vals;
            sendResponse(out);
          }
        });
      }
    });
  }

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
    const promise = new Promise((resolve) => {
      pending[id] = { resolve, callback };
      bus.emit("__REQUEST__", { id, message });
    });
    return promise;
  }

  bus.on("__PORT_CONNECT__", ({ portId, name }, { source }) => {
    if (type !== "background") return;
    const backgroundPort = makePort("background", portId, name, source);
    ports[portId] = backgroundPort;

    onConnectListeners.forEach((fn) => fn(backgroundPort));

    // send back a CONNECT_ACK so the client can
    // start listening on its end:
    bus.emit("__PORT_CONNECT_ACK__", { portId, name }, { to: source });
  });

  // Clients handle the ACK and finalize their Port object:
  bus.on("__PORT_CONNECT_ACK__", ({ portId, name }) => {
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
    p._receive(msg, source);
  });

  // Any port disconnect:
  bus.on("__PORT_DISCONNECT__", ({ portId }) => {
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
      buffer.forEach((m) => _post(m));
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

    function _receive(msg, source) {
      onMessageHandlers.forEach((fn) =>
        fn(msg, { id: portId, tab: { id: source } })
      );
    }

    function disconnect() {
      bus.emit("__PORT_DISCONNECT__", { portId }, { to: remoteWindow });
      _disconnect();
      delete ports[portId];
    }

    function _disconnect() {
      onDisconnectHandlers.forEach((fn) => fn());
      onMessageHandlers = [];
      onDisconnectHandlers = [];
    }

    return {
      name,
      sender: {
        id: portId,
      },
      onMessage: {
        addListener(fn) {
          onMessageHandlers.push(fn);
        },
        removeListener(fn) {
          onMessageHandlers = onMessageHandlers.filter((x) => x !== fn);
        },
      },
      onDisconnect: {
        addListener(fn) {
          onDisconnectHandlers.push(fn);
        },
        removeListener(fn) {
          onDisconnectHandlers = onDisconnectHandlers.filter((x) => x !== fn);
        },
      },
      postMessage,
      disconnect,
      _ready, // internal
      _drainBuffer, // internal
      _receive, // internal
      _disconnect, // internal
    };
  }

  function connect(connectInfo = {}) {
    if (type === "background") {
      throw new Error("Background must use onConnect, not connect()");
    }
    const name = connectInfo.name || "";
    const portId = nextPortId++;
    // create the client side port
    // remoteWindow is left undefined here; bus.emit will propagate upwards
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

  return {
    // rpc:
    sendMessage,
    onMessage: {
      addListener(fn) {
        msgListeners.push(fn);
      },
      removeListener(fn) {
        const i = msgListeners.indexOf(fn);
        if (i >= 0) msgListeners.splice(i, 1);
      },
    },

    // port API:
    connect,
    onConnect: {
      addListener(fn) {
        onConnect(fn);
      },
      removeListener(fn) {
        const i = onConnectListeners.indexOf(fn);
        if (i >= 0) onConnectListeners.splice(i, 1);
      },
    },
  };
}
