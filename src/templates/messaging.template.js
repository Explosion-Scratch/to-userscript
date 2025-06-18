// -- Messaging implementation

function createEventBus(
  scopeId,
  type = "page", // "page" or "iframe"
  { allowedOrigin = "*", children = [], parentWindow = null } = {},
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
      fn(payload, { origin: ev.origin, source: ev.source }),
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
     * @param {Window} [options.to] - A specific window to target. If provided, message is ONLY sent to the target.
     */
    emit(event, payload, { to } = {}) {
      // If a specific target window is provided, send only to it and DO NOT dispatch locally.
      // This prevents a port from receiving its own messages.
      if (to) {
        if (to && typeof to.postMessage === "function") {
          emitTo(to, event, payload);
        }
        return; // Exit after targeted send.
      }

      // For broadcast messages (no 'to' target), dispatch locally first.
      (handlers[event] || []).forEach((fn) =>
        fn(payload, { origin: location.origin, source: window }),
      );

      // Then propagate the broadcast to other windows.
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

  // Clients handle the ACK and finalize their Port object by learning the remote window.
  bus.on("__PORT_CONNECT_ACK__", ({ portId, name }, { source }) => {
    if (type === "background") return; // ignore
    const p = ports[portId];
    if (!p) return;
    // Call the port's internal finalize method to complete the handshake
    if (p._finalize) {
      p._finalize(source);
    }
  });

  // Any port message travels via "__PORT_MESSAGE__"
  bus.on("__PORT_MESSAGE__", (envelope, { source }) => {
    const { portId } = envelope;
    const p = ports[portId];
    if (!p) return;
    p._receive(envelope, source);
  });

  // Any port disconnect:
  bus.on("__PORT_DISCONNECT__", ({ portId }) => {
    const p = ports[portId];
    if (!p) return;
    p._disconnect();
    delete ports[portId];
  });

  // Refactored makePort to correctly manage internal state and the connection handshake.
  function makePort(side, portId, name, remoteWindow) {
    let onMessageHandlers = [];
    let onDisconnectHandlers = [];
    let buffer = [];
    // Unique instance ID for this port instance
    const instanceId = Math.random().toString(36).slice(2) + Date.now();
    // These state variables are part of the closure and are updated by _finalize
    let _ready = side === "background";

    function _drainBuffer() {
      buffer.forEach((m) => _post(m));
      buffer = [];
    }

    function _post(msg) {
      // Always use the 'to' parameter for port messages, making them directional.
      // Include senderInstanceId
      bus.emit(
        "__PORT_MESSAGE__",
        { portId, msg, senderInstanceId: instanceId },
        { to: remoteWindow },
      );
    }

    function postMessage(msg) {
      if (!_ready) {
        buffer.push(msg);
      } else {
        _post(msg);
      }
    }

    function _receive(envelope, source) {
      // envelope: { msg, senderInstanceId }
      if (envelope.senderInstanceId === instanceId) return; // Don't dispatch to self
      onMessageHandlers.forEach((fn) =>
        fn(envelope.msg, { id: portId, tab: { id: source } }),
      );
    }

    function disconnect() {
      // Also use the 'to' parameter for disconnect messages
      bus.emit("__PORT_DISCONNECT__", { portId }, { to: remoteWindow });
      _disconnect();
      delete ports[portId];
    }

    function _disconnect() {
      onDisconnectHandlers.forEach((fn) => fn());
      onMessageHandlers = [];
      onDisconnectHandlers = [];
    }

    // This function is called on the client port when the ACK is received from background.
    // It updates the port's state, completing the connection.
    function _finalize(win) {
      remoteWindow = win; // <-- This is the crucial part: learn the destination
      _ready = true;
      _drainBuffer();
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
      // Internal methods used by the runtime
      _receive,
      _disconnect,
      _finalize, // Expose the finalizer for the ACK handler
    };
  }

  function connect(connectInfo = {}) {
    if (type === "background") {
      throw new Error("Background must use onConnect, not connect()");
    }
    const name = connectInfo.name || "";
    const portId = nextPortId++;
    // create the client side port
    // remoteWindow is initially null; it will be set by _finalize upon ACK.
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
