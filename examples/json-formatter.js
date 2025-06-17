// ==UserScript==
// @name        JSON Formatter
// @version     0.7.3
// @description Makes JSON easy to read. Open source.
// @namespace   json-formatter
// @author      Converter Script
// @require     data:text/javascript;base64,Ly8gTmVlZGVkIG9uIHNvbWUgc2l0ZXMgZm9yIHNjcmlwdHMgdG8gc2V0IC5pbm5lckhUTUwgb2YgdGhpbmdzLgpjb25zdCBvdmVyd3JpdGVfZGVmYXVsdCA9IHRydWU7CmNvbnN0IHBhc3NUaHJvdWdoRnVuYyA9IChzdHJpbmcpID0+IHN0cmluZzsKY29uc3QgVFRQTmFtZSA9ICJwYXNzdGhyb3VnaCI7CmxldCBUVFBfZGVmYXVsdCwKICBUVFAgPSB7CiAgICBjcmVhdGVIVE1MOiBwYXNzVGhyb3VnaEZ1bmMsCiAgICBjcmVhdGVTY3JpcHQ6IHBhc3NUaHJvdWdoRnVuYywKICAgIGNyZWF0ZVNjcmlwdFVSTDogcGFzc1Rocm91Z2hGdW5jLAogIH07CmxldCBuZWVkc1RydXN0ZWRIVE1MID0gZmFsc2U7Cgpjb25zdCBkb2l0ID0gKCkgPT4gewogIHRyeSB7CiAgICBpZiAoCiAgICAgIHR5cGVvZiB3aW5kb3cuaXNTZWN1cmVDb250ZXh0ICE9PSAidW5kZWZpbmVkIiAmJgogICAgICB3aW5kb3cuaXNTZWN1cmVDb250ZXh0CiAgICApIHsKICAgICAgaWYgKHdpbmRvdy50cnVzdGVkVHlwZXMgJiYgd2luZG93LnRydXN0ZWRUeXBlcy5jcmVhdGVQb2xpY3kpIHsKICAgICAgICBuZWVkc1RydXN0ZWRIVE1MID0gdHJ1ZTsKICAgICAgICBpZiAodHJ1c3RlZFR5cGVzLmRlZmF1bHRQb2xpY3kpIHsKICAgICAgICAgIGxvZygiVFQgRGVmYXVsdCBQb2xpY3kgZXhpc3RzIik7CiAgICAgICAgICBpZiAob3ZlcndyaXRlX2RlZmF1bHQpCiAgICAgICAgICAgIFRUUCA9IHdpbmRvdy50cnVzdGVkVHlwZXMuY3JlYXRlUG9saWN5KCJkZWZhdWx0IiwgVFRQKTsKICAgICAgICAgIGVsc2UgVFRQID0gd2luZG93LnRydXN0ZWRUeXBlcy5jcmVhdGVQb2xpY3koVFRQTmFtZSwgVFRQKTsKICAgICAgICAgIFRUUF9kZWZhdWx0ID0gdHJ1c3RlZFR5cGVzLmRlZmF1bHRQb2xpY3k7CiAgICAgICAgICBsb2coCiAgICAgICAgICAgIGBDcmVhdGVkIGN1c3RvbSBwYXNzdGhyb3VnaCBwb2xpY3ksIGluIGNhc2UgdGhlIGRlZmF1bHQgcG9saWN5IGlzIHRvbyByZXN0cmljdGl2ZTogVXNlIFBvbGljeSAnJHtUVFBOYW1lfScgaW4gdmFyICdUVFAnOmAsCiAgICAgICAgICAgIFRUUCwKICAgICAgICAgICk7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgIFRUUF9kZWZhdWx0ID0gVFRQID0gd2luZG93LnRydXN0ZWRUeXBlcy5jcmVhdGVQb2xpY3koImRlZmF1bHQiLCBUVFApOwogICAgICAgIH0KICAgICAgICBsb2coIlRydXN0ZWQtVHlwZSBQb2xpY2llczogVFRQOiIsIFRUUCwgIlRUUF9kZWZhdWx0OiIsIFRUUF9kZWZhdWx0KTsKICAgICAgfQogICAgfQogIH0gY2F0Y2ggKGUpIHsKICAgIGxvZyhlKTsKICB9Cn07Cgpjb25zdCBsb2cgPSAoLi4uYXJncykgPT4gewogIGNvbnNvbGUubG9nKC4uLmFyZ3MpOwp9OwoKZG9pdCgpOwo=
// @match       *://*/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABVJJREFUeNq8V1sspVcU3jg4rq3LEB13SlWbikv0oR1pzGjiElRCeas2Hj1LE6YmM8JLIyNpwoOXJo2gSMpDU4mkWhmDqMvQIhwd17jNYTg42P2+P7/JcdzOOWO6ki85l70ue6+11/q2RlgnzoAv8DbgCngCkcAsoAcMwAawCexbYlBjwRp7wAcIysnJyd3Y2MjW6/VhgGZ3d1e7vr4uXF1dj729vY8cHBw2gb9mZ2d/wvpnwKIa0PFlxu2ucMz/3IODgz+KjY39bnFxMWVubk6DzyIuLk4EBQUJOBUGg0E4OTmJzc1N8fz5czE5OSmmpqZONBrNEoJtPjg4aFGDeQlISwPgrgOys7O/xQ6L9/f3tQkJCSItLU2Eh4cLPz8/4ebmJrRareL88PBQCWRvb0/AqZienhY9PT2ir6/vcHl5+Z+VlZUfYK9LPZETS448KjMz82lSUpLMz8+Xzc3Ncn5+XsKRtES4jutbW1tlQUGBxGmtwGYdEK3av1QcWFR5eXlTyKusqKiQ4+PjEruTtgj1JiYmZGVlpcRpGWG7Foi4Koh3MjIyniQmJsqHDx9K5F2enJzI1xHqLywsyAcPHsjQ0NAF+Pie6b3IubaoqKgWi2R5eblEQb22c/Mg7t+/L1EzvK7F9Hcm776+vinY+UF6erocHh6Wx8fH8iaF9kZGRiQK2WBnZ/cEPj81TYUPiq47LCxMtre3S1wd+SaExdnZ2Slxfdfh8xGbGiOwQ8GFr62t3cHuRXJysnK13oQ4OjqK+Ph4UVhY6IpTSMFPoQzAGYX3JRqJY2pqqkAqzinW1NSIsrIyq5xxPfXMhfbv3bvn4unpGYSvHyptdnt7+3N0PBEREaFEeZGhra0tqwLg+osCp/3IyEgREhLCrx9zFry1s7NzG01H3Lp165yh7u5uUVJSIqqrq60KoL6+Xnh5eSn65uLj48NUOI6OjiopcENxuAUEBHCoiP9D6CcqKsqDU5UBOKFjafz9/ZXebiqYaspRcie2CPWoTztnGg78BAYG0pkHA3DkMHF3dxeYYK8WtbS0KDVBI0yBLUI96tMO7ZnWAf2RDjCAI3t7+xNOMjSLV4vu3r2r5HFoaEg0NDTYFAD1qE87tHcqR0dHPBmSFyMDMCAiA0amwNg9c3zcAcew+Q3AHb728+lNoP7pSZwKR7dOpyNReckADsBitjB4BBiORTtDU7v281XCADBlORP0DOCF0WicIJNBN7z0Ttsil+mRxvX395OY6PjdBdfi65iYGCMJhDnpwP3ntiSO0qq+z/XUo76pIP8SBalHuv7G/9+cBpWAQTRXWloqQaHOGRscHFRYkTXC9dQzF9SaREH+AZ9E0qvmhAH0CHzP2NXVZTMDsoQhdXR0rGP30/BZBfiZ8sBP0IwmsrKyJFrkjZERU1IyNjYmMXMG4Iu4Y07N2IeLcSUPyQXJYG6SES0tLUmM4d9VZvyV6k8hoadC0riGxRrk6V3cDFdOLQ8Pj3P32xrh1URdiaqqqtHGxkb+9Cvwo/p6upCS86lVi5thIIfD9ZRoUDbtnHrUV3e+rVLzKLONX0jNyd8fo3vpcnNzd9va2pSUWPMuIKltamraiI6O/lPN+WPgfXPnV72MAoEsdMl8jOowFKcvmQzTQlbDl5Gzs7MyWJAupY2zw62uroqZmRl9XV3ds97eXmekdAd2WoFfgAXzl9G1b0MgFvgC+MzFxSUIVXwAMqEFozGied0muUBf16GVO2DwrA0MDDihA/qrxUY28jMwAexY8zY0TwmJYjDwAUAy+Z76m6cKPjxfqGCH+011+i8771Wv4/8EGADDWPCX+M7kKwAAAABJRU5ErkJggg==
// @run-at      document-end
// ==/UserScript==

(function() {
    // #region Unified Polyfill

// #region Unified Polyfill String ---
// This contains all necessary code to create a complete polyfill environment

// #endregion
// #region Messaging implementation

function createEventBus(
  scopeId,
  type = "page", // "page" or "iframe"
  { allowedOrigin = "*", children = [], parentWindow = null } = {}
) {
  if (!scopeId) throw new Error("createEventBus requires a scopeId");

  const handlers = {};

  function handleIncoming(ev) {
    // origin check
    if (allowedOrigin !== "*" && ev.origin !== allowedOrigin) return;

    const msg = ev.data;
    // must be our eventBus message, same scope
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

    // dispatch to listeners
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
    emit(event, payload) {
      // dispatch locally first
      (handlers[event] || []).forEach((fn) =>
        fn(payload, { origin: location.origin, source: window })
      );

      // then propagate
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
  const ports = {}; // all open ports by id
  const onConnectListeners = [];

  function parseArgs(args) {
    let target, message, options, callback;
    const arr = [...args];
    if (arr.length === 0) {
      throw new Error("sendMessage requires at least one argument");
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
    bus.on("__REQUEST__", ({ id, message }, _) => {
      let responded = false,
        isAsync = false;
      function sendResponse(resp) {
        if (responded) return;
        responded = true;
        bus.emit("__RESPONSE__", { id, response: resp });
      }
      const results = msgListeners
        .map((fn) => {
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

  // ============================
  // PORT‐BASED CONNECT / DISCONNECT
  // ============================
  // When any side calls .connect(), emit a magic event
  // that the background listens to.  The background then
  // notifies its onConnect listeners with a Port object.
  bus.on("__PORT_CONNECT__", ({ portId, name }, { source }) => {
    // Only the background should handle incoming connect requests:
    if (type !== "background") return; //
    // Both share the same portId, but we keep separate
    // handler queues and wire them via the bus.
    const backgroundPort = makePort("background", portId, name, source);
    ports[portId] = backgroundPort;

    // notify background listeners
    onConnectListeners.forEach((fn) => fn(backgroundPort));

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

    function _receive(msg) {
      onMessageHandlers.forEach((fn) => fn(msg));
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


// #region Abstraction layer Handle postmesage for
(function () {
  const pendingRequests = new Map(); // requestId -> { resolve, reject, timeout }
  let nextRequestId = 1;

  // Listen for postmessage requests from iframes
  window.addEventListener("message", async (event) => {
    // // Only handle messages from same origin for security
    // if (event.origin !== window.location.origin) {
    //     return;
    // }

    const { type, requestId, method, args } = event.data;

    if (type === "abstraction-request") {
      try {
        let result;

        switch (method) {
          case "_storageSet":
            result = await _storageSet(args[0]);
            break;
          case "_storageGet":
            result = await _storageGet(args[0]);
            break;
          case "_storageRemove":
            result = await _storageRemove(args[0]);
            break;
          case "_storageClear":
            result = await _storageClear();
            break;
          case "_fetch":
            result = await _fetch(args[0], args[1]);
            break;
          case "_registerMenuCommand":
            result = _registerMenuCommand(args[0], args[1]);
            break;
          case "_openTab":
            result = _openTab(args[0]);
            break;
          case "_initStorage":
            result = await _initStorage();
            break;
          default:
            throw new Error(`Unknown abstraction method: ${method}`);
        }

        // Send success response back to iframe
        event.source.postMessage({
          type: "abstraction-response",
          requestId,
          success: true,
          result,
        });
      } catch (error) {
        // Send error response back to iframe
        event.source.postMessage({
          type: "abstraction-response",
          requestId,
          success: false,
          error: {
            message: error.message,
            stack: error.stack,
          },
        });
      }
    }
  });

  console.log(
    "[PostMessage Handler] Abstraction layer message handler initialized"
  );
})();


// #endregion
// #region Abstraction Layer Userscript Target

async function _storageSet(items) {
  try {
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        await GM_setValue(key, items[key]);
      }
    }
    return Promise.resolve();
  } catch (e) {
    console.error("GM_setValue error:", e);
    return Promise.reject(e);
  }
}

async function _storageGet(keys) {
  if (!keys) {
    keys = null;
  }
  if (
    Array.isArray(keys) &&
    (keys.length === 0 || [null, undefined].includes(keys[0]))
  ) {
    keys = null;
  }
  try {
    const results = {};
    let keyList = [];
    let defaults = {};
    let requestedKeys = [];

    if (keys === null) {
      keyList = await GM_listValues();
      requestedKeys = [...keyList];
    } else if (typeof keys === "string") {
      keyList = [keys];
      requestedKeys = [keys];
    } else if (Array.isArray(keys)) {
      keyList = keys;
      requestedKeys = [...keys];
    } else if (typeof keys === "object" && keys !== null) {
      keyList = Object.keys(keys);
      requestedKeys = [...keyList];
      defaults = keys;
    } else {
      console.error("_storageGet error: Invalid keys format", keys);
      return Promise.reject(new Error("Invalid keys format for get"));
    }

    for (const key of keyList) {
      const defaultValue = defaults.hasOwnProperty(key)
        ? defaults[key]
        : undefined;
      const storedValue = await GM_getValue(key, defaultValue);
      results[key] = storedValue;
    }

    const finalResult = {};
    for (const key of requestedKeys) {
      if (results.hasOwnProperty(key)) {
        finalResult[key] = results[key];
      } else if (defaults.hasOwnProperty(key)) {
        finalResult[key] = defaults[key];
      }
    }

    return Promise.resolve(finalResult);
  } catch (e) {
    console.error("GM_getValue/GM_listValues error:", e);
    return Promise.reject(e);
  }
}

async function _storageRemove(keysToRemove) {
  try {
    let keyList = [];
    if (typeof keysToRemove === "string") {
      keyList = [keysToRemove];
    } else if (Array.isArray(keysToRemove)) {
      keyList = keysToRemove;
    } else {
      console.error("_storageRemove error: Invalid keys format", keysToRemove);
      return Promise.reject(new Error("Invalid keys format for remove"));
    }

    for (const key of keyList) {
      await GM_deleteValue(key);
    }
    return Promise.resolve();
  } catch (e) {
    console.error("GM_deleteValue error:", e);
    return Promise.reject(e);
  }
}

async function _storageClear() {
  try {
    const keys = await GM_listValues();
    await Promise.all(keys.map((key) => GM_deleteValue(key)));
    return Promise.resolve();
  } catch (e) {
    console.error("GM_listValues/GM_deleteValue error during clear:", e);
    return Promise.reject(e);
  }
}

async function _fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      GM_xmlhttpRequest({
        method: options.method || "GET",
        url: url,
        headers: options.headers || {},
        data: options.body,
        responseType: options.responseType,
        timeout: options.timeout || 0,
        binary:
          options.responseType === "blob" ||
          options.responseType === "arraybuffer",
        onload: function (response) {
          const responseHeaders = {};
          if (response.responseHeaders) {
            response.responseHeaders
              .trim()
              .split("\\r\\n")
              .forEach((header) => {
                const parts = header.match(/^([^:]+):\s*(.*)$/);
                if (parts && parts.length === 3) {
                  responseHeaders[parts[1].toLowerCase()] = parts[2];
                }
              });
          }

          const mockResponse = {
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            statusText:
              response.statusText ||
              (response.status >= 200 && response.status < 300 ? "OK" : ""),
            url: response.finalUrl || url,
            headers: new Headers(responseHeaders),
            text: () => Promise.resolve(response.responseText),
            json: () => {
              try {
                return Promise.resolve(JSON.parse(response.responseText));
              } catch (e) {
                return Promise.reject(new SyntaxError("Could not parse JSON"));
              }
            },
            blob: () => {
              if (response.response instanceof Blob) {
                return Promise.resolve(response.response);
              }
              return Promise.reject(
                new Error("Requires responseType:'blob' in GM_xmlhttpRequest")
              );
            },
            arrayBuffer: () => {
              if (response.response instanceof ArrayBuffer) {
                return Promise.resolve(response.response);
              }
              return Promise.reject(
                new Error(
                  "Requires responseType:'arraybuffer' in GM_xmlhttpRequest"
                )
              );
            },
            clone: function () {
              const cloned = { ...this };
              cloned.text = () => Promise.resolve(response.responseText);
              cloned.json = () => this.json();
              cloned.blob = () => this.blob();
              cloned.arrayBuffer = () => this.arrayBuffer();
              return cloned;
            },
          };

          if (mockResponse.ok) {
            resolve(mockResponse);
          } else {
            const error = new Error(`HTTP error! status: ${response.status}`);
            error.response = mockResponse;
            reject(error);
          }
        },
        onerror: function (response) {
          reject(
            new Error(
              `GM_xmlhttpRequest network error: ${
                response.statusText || "Unknown Error"
              }`
            )
          );
        },
        onabort: function () {
          reject(new Error("GM_xmlhttpRequest aborted"));
        },
        ontimeout: function () {
          reject(new Error("GM_xmlhttpRequest timed out"));
        },
      });
    } catch (e) {
      console.error("_fetch (GM_xmlhttpRequest) error:", e);
      reject(e);
    }
  });
}

function _registerMenuCommand(name, func) {
  if (typeof GM_registerMenuCommand === "function") {
    try {
      GM_registerMenuCommand(name, func);
    } catch (e) {
      console.error("GM_registerMenuCommand failed:", e);
    }
  } else {
    console.warn("GM_registerMenuCommand not available.");
  }
}

function _openTab(url) {
  if (typeof GM_openInTab === "function") {
    try {
      GM_openInTab(url, { active: true });
    } catch (e) {
      console.error("GM_openInTab failed:", e);
    }
  } else {
    console.warn("GM_openInTab not available, using window.open as fallback.");
    try {
      window.open(url);
    } catch (e) {
      console.error("window.open fallback failed:", e);
    }
  }
}

async function _initStorage() {
  // No initialization required for GM_* storage.
  return Promise.resolve();
}


// #endregion
// #region Extension Assets Map Helper Functions ---
const EXTENSION_ASSETS_MAP = {
  "options/options.html": "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <title>Options - JSON Formatter</title>\n    <style>\n      body {\n        margin: 18px;\n        font-family: system-ui, sans-serif;\n      }\n\n      fieldset {\n        padding: 20px;\n        border-radius: 8px;\n        border: 1px solid currentColor;\n      }\n\n      legend {\n        font-weight: 600;\n        padding: 0 5px;\n      }\n\n      label {\n        display: flex;\n        gap: 10px;\n        align-items: center;\n        height: 24px;\n      }\n\n      label > input {\n        position: relative;\n        top: -2px;\n      }\n\n      @media (prefers-color-scheme: dark) {\n        body {\n          background: #292a2d;\n          color: #e8eaed;\n        }\n      }\n    </style>\n  </head>\n\n  <body>\n    <fieldset>\n      <legend>Theme</legend>\n\n      <div>\n        <label>\n          <input type=\"radio\" name=\"theme\" value=\"system\" />\n          Automatic (follow OS setting)\n        </label>\n      </div>\n      <div>\n        <label>\n          <input type=\"radio\" name=\"theme\" value=\"force_dark\" />\n          Force dark theme\n        </label>\n      </div>\n      <div>\n        <label>\n          <input type=\"radio\" name=\"theme\" value=\"force_light\" />\n          Force light theme\n        </label>\n      </div>\n    </fieldset>\n\n    <script src=\"options.js\"></script>\n  </body>\n</html>\n"
};

function _testBlobCSP() {
  try {
    // Create a random blob with some simple JavaScript content
    const code = `console.log("Blob CSP test");`;
    const blob = new Blob([code], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);

    // Create a script tag to load the blob URL
    const script = document.createElement('script');
    script.src = blobUrl;

    // Add an error handler in case the CSP blocks it
    let blocked = false;
    script.onerror = () => {
      blocked = true;
    };

    // Append the script to the document
    document.head.appendChild(script);

    // Since CSP blocks are asynchronous, we need to return a promise
    return new Promise((resolve) => {
      // Wait briefly to see if the error handler fires
      setTimeout(() => {
        resolve(!blocked);
        // Clean up
        document.head.removeChild(script);
        URL.revokeObjectURL(blobUrl);
      }, 100);
    });
  } catch (e) {
    // If creating or assigning the blob fails synchronously
    return Promise.resolve(false);
  }
}

let CAN_USE_BLOB_CSP = false;

_testBlobCSP().then((result) => {
  CAN_USE_BLOB_CSP = result;
});

function _base64ToBlob(base64, mimeType = 'application/octet-stream') {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

function _getMimeTypeFromPath(p) {
  const ext = (p.split('.').pop() || '').toLowerCase();
  const map = {
    html: 'text/html',
    htm: 'text/html',
    js: 'text/javascript',
    css: 'text/css',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    ico: 'image/x-icon',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    otf: 'font/otf',
    eot: 'application/vnd.ms-fontobject'
  };
  return map[ext] || 'application/octet-stream';
}

function _isTextAsset(ext) {
  return ['html','htm','js','css','json','svg','txt','xml'].includes(ext);
}

function _createAssetUrl(path = '') {
  if (path.startsWith('/')) path = path.slice(1);
  const assetData = EXTENSION_ASSETS_MAP[path];
  if (typeof assetData === 'undefined') {
    console.warn('[runtime.getURL] Asset not found for', path);
    return path;
  }

  const mime = _getMimeTypeFromPath(path);
  const ext = (path.split('.').pop() || '').toLowerCase();

  if (CAN_USE_BLOB_CSP) {
    // For web accessible resources, handle different content types appropriately
    let blob;
    if (_isTextAsset(ext)) {
      // For text assets (including processed CSS with inlined assets),
      // the content is already processed and should be used as-is
      blob = new Blob([assetData], { type: mime });
    } else {
      // For binary assets, the content is base64 encoded
      blob = _base64ToBlob(assetData, mime);
    }

    return URL.createObjectURL(blob);
  } else {
    if (_isTextAsset(ext)) {
      return `data:${mime};base64,${btoa(assetData)}`;
    } else {
      return `data:${mime};base64,${assetData}`;
    }
  }
}

// #endregion
// #endregion
// #region Polyfill Implementation
function buildPolyfill({ isBackground = false, isOtherPage = false } = {}) {
  // Generate a unique context ID for this polyfill instance
  const contextType = isBackground
    ? "background"
    : isOtherPage
    ? "options"
    : "content";
  const contextId = `${contextType}_${Math.random()
    .toString(36)
    .substring(2, 15)}`;

  const IS_IFRAME = "false" === "true";
  const BUS = createEventBus("json-formatter", IS_IFRAME ? "iframe" : "page");
  const RUNTIME = createRuntime(isBackground ? "background" : "tab", BUS);

  // TODO: Stub
  const storageChangeListeners = new Set();
  function broadcastStorageChange(changes, areaName) {
    storageChangeListeners.forEach((listener) => {
      listener(changes, areaName);
    });
  }

  // #region Chrome polyfill
  let chrome = {
    extension: {
      isAllowedIncognitoAccess: () => Promise.resolve(true),
      sendMessage: (...args) => _messagingHandler.sendMessage(...args),
    },
    permissions: {
      request: (permissions, callback) => {
        callback(permissions);
      },
      contains: (permissions) => {
        // TODO: Shim
        return true;
      },
    },
    i18n: {
      getMessage: (key) => {
        if (typeof LOCALE_KEYS !== "undefined" && LOCALE_KEYS[key]) {
          return LOCALE_KEYS[key].message;
        }
        return key;
      },
    },
    runtime: {
      ...RUNTIME,
      getManifest: () => {
        // The manifest object will be injected into the scope where buildPolyfill is called
        if (typeof INJECTED_MANIFEST !== "undefined") {
          return JSON.parse(JSON.stringify(INJECTED_MANIFEST)); // Return deep copy
        }
        console.warn(
          "INJECTED_MANIFEST not found for chrome.runtime.getManifest"
        );
        return { name: "Unknown", version: "0.0", manifest_version: 2 };
      },
      getURL: (path) => {
        // Integrated implementation using the asset helper functions
        if (!path) return "";
        if (path.startsWith("/")) {
          path = path.substring(1);
        }

        // Use the integrated asset creation function
        if (typeof _createAssetUrl === "function") {
          return _createAssetUrl(path);
        }

        console.warn(
          `chrome.runtime.getURL fallback for '${path}'. Assets may not be available.`
        );
        // Attempt a relative path resolution (highly context-dependent and likely wrong)
        try {
          if (window.location.protocol.startsWith("http")) {
            return new URL(path, window.location.href).toString();
          }
        } catch (e) {
          /* ignore error, fallback */
        }
        return path;
      },
      connect: (extensionIdOrConnectInfo, connectInfo) => {
        // Enhanced connect implementation using the unified message bus
        const getName = () => {
          if (typeof extensionIdOrConnectInfo === "string") {
            return connectInfo && connectInfo.name ? connectInfo.name : "";
          }
          return extensionIdOrConnectInfo && extensionIdOrConnectInfo.name
            ? extensionIdOrConnectInfo.name
            : "";
        };

        return internalMessageBus.createPort(contextId, null, getName());
      },
      onConnect: {
        addListener: function (callback) {
          internalMessageBus.addConnectListener(contextId, callback);
        },
        removeListener: function (callback) {
          internalMessageBus.removeConnectListener(contextId, callback);
        },
      },
      id: "polyfilled-extension-" + Math.random().toString(36).substring(2, 15),
      lastError: null,
      getPlatformInfo: async () => {
        // Basic platform detection
        const platform = {
          os: "unknown",
          arch: "unknown",
          nacl_arch: "unknown",
        };

        if (typeof navigator !== "undefined") {
          const userAgent = navigator.userAgent.toLowerCase();
          if (userAgent.includes("mac")) platform.os = "mac";
          else if (userAgent.includes("win")) platform.os = "win";
          else if (userAgent.includes("linux")) platform.os = "linux";
          else if (userAgent.includes("android")) platform.os = "android";
          else if (userAgent.includes("ios")) platform.os = "ios";

          // Basic architecture detection
          if (userAgent.includes("x86_64") || userAgent.includes("amd64")) {
            platform.arch = "x86-64";
          } else if (userAgent.includes("i386") || userAgent.includes("i686")) {
            platform.arch = "x86-32";
          } else if (userAgent.includes("arm")) {
            platform.arch = "arm";
          }
        }

        return platform;
      },
      getBrowserInfo: async () => {
        // Basic browser detection
        const info = {
          name: "unknown",
          version: "unknown",
          buildID: "unknown",
        };

        if (typeof navigator !== "undefined") {
          const userAgent = navigator.userAgent;
          if (userAgent.includes("Chrome")) {
            info.name = "Chrome";
            const match = userAgent.match(/Chrome\/([0-9.]+)/);
            if (match) info.version = match[1];
          } else if (userAgent.includes("Firefox")) {
            info.name = "Firefox";
            const match = userAgent.match(/Firefox\/([0-9.]+)/);
            if (match) info.version = match[1];
          } else if (userAgent.includes("Safari")) {
            info.name = "Safari";
            const match = userAgent.match(/Version\/([0-9.]+)/);
            if (match) info.version = match[1];
          }
        }

        return info;
      },
    },
    storage: {
      local: {
        // Uses functions from the Abstraction Layer with unified messaging for change events
        get: function (keys, callback) {
          if (typeof _storageGet !== "function")
            throw new Error("_storageGet not defined");

          const promise = _storageGet(keys);

          // Support callback-based syntax
          if (typeof callback === "function") {
            promise
              .then((result) => {
                try {
                  callback(result);
                } catch (e) {
                  console.error("Error in storage.get callback:", e);
                }
              })
              .catch((error) => {
                console.error("Storage.get error:", error);
                callback({});
              });
            return;
          }

          // Return promise for async/await usage
          return promise;
        },
        set: function (items, callback) {
          if (typeof _storageSet !== "function")
            throw new Error("_storageSet not defined");

          const promise = _storageSet(items).then((result) => {
            // Broadcast storage changes to all contexts
            broadcastStorageChange(items, "local");
            return result;
          });

          // Support callback-based syntax
          if (typeof callback === "function") {
            promise
              .then((result) => {
                try {
                  callback(result);
                } catch (e) {
                  console.error("Error in storage.set callback:", e);
                }
              })
              .catch((error) => {
                console.error("Storage.set error:", error);
                callback();
              });
            return;
          }

          // Return promise for async/await usage
          return promise;
        },
        remove: function (keys, callback) {
          if (typeof _storageRemove !== "function")
            throw new Error("_storageRemove not defined");

          const promise = _storageRemove(keys).then((result) => {
            // Create changes object for removed keys
            const changes = {};
            const keyList = Array.isArray(keys) ? keys : [keys];
            keyList.forEach((key) => {
              changes[key] = { oldValue: undefined, newValue: undefined };
            });
            broadcastStorageChange(changes, "local");
            return result;
          });

          // Support callback-based syntax
          if (typeof callback === "function") {
            promise
              .then((result) => {
                try {
                  callback(result);
                } catch (e) {
                  console.error("Error in storage.remove callback:", e);
                }
              })
              .catch((error) => {
                console.error("Storage.remove error:", error);
                callback();
              });
            return;
          }

          // Return promise for async/await usage
          return promise;
        },
        clear: function (callback) {
          if (typeof _storageClear !== "function")
            throw new Error("_storageClear not defined");

          const promise = _storageClear().then((result) => {
            // Broadcast clear event
            broadcastStorageChange({}, "local");
            return result;
          });

          // Support callback-based syntax
          if (typeof callback === "function") {
            promise
              .then((result) => {
                try {
                  callback(result);
                } catch (e) {
                  console.error("Error in storage.clear callback:", e);
                }
              })
              .catch((error) => {
                console.error("Storage.clear error:", error);
                callback();
              });
            return;
          }

          // Return promise for async/await usage
          return promise;
        },
        onChanged: {
          addListener: (callback) => {
            storageChangeListeners.add(callback);
          },
          removeListener: (callback) => {
            storageChangeListeners.delete(callback);
          },
        },
      },
      // Sync/Managed are simple aliases or stubs for Phase 1
      sync: {
        get: function (keys, callback) {
          console.warn("chrome.storage.sync polyfill maps to local");
          return chrome.storage.local.get(keys, callback);
        },
        set: function (items, callback) {
          console.warn("chrome.storage.sync polyfill maps to local");

          // Create a promise that handles sync-specific broadcasting
          const promise = chrome.storage.local.set(items).then((result) => {
            // Sync storage changes also broadcast with 'sync' area name
            broadcastStorageChange(items, "sync");
            return result;
          });

          // Support callback-based syntax
          if (typeof callback === "function") {
            promise
              .then((result) => {
                try {
                  callback(result);
                } catch (e) {
                  console.error("Error in storage.sync.set callback:", e);
                }
              })
              .catch((error) => {
                console.error("Storage.sync.set error:", error);
                callback();
              });
            return;
          }

          // Return promise for async/await usage
          return promise;
        },
        remove: function (keys, callback) {
          console.warn("chrome.storage.sync polyfill maps to local");

          // Create a promise that handles sync-specific broadcasting
          const promise = chrome.storage.local.remove(keys).then((result) => {
            // Create changes object for removed keys
            const changes = {};
            const keyList = Array.isArray(keys) ? keys : [keys];
            keyList.forEach((key) => {
              changes[key] = { oldValue: undefined, newValue: undefined };
            });
            broadcastStorageChange(changes, "sync");
            return result;
          });

          // Support callback-based syntax
          if (typeof callback === "function") {
            promise
              .then((result) => {
                try {
                  callback(result);
                } catch (e) {
                  console.error("Error in storage.sync.remove callback:", e);
                }
              })
              .catch((error) => {
                console.error("Storage.sync.remove error:", error);
                callback();
              });
            return;
          }

          // Return promise for async/await usage
          return promise;
        },
        clear: function (callback) {
          console.warn("chrome.storage.sync polyfill maps to local");

          // Create a promise that handles sync-specific broadcasting
          const promise = chrome.storage.local.clear().then((result) => {
            broadcastStorageChange({}, "sync");
            return result;
          });

          // Support callback-based syntax
          if (typeof callback === "function") {
            promise
              .then((result) => {
                try {
                  callback(result);
                } catch (e) {
                  console.error("Error in storage.sync.clear callback:", e);
                }
              })
              .catch((error) => {
                console.error("Storage.sync.clear error:", error);
                callback();
              });
            return;
          }

          // Return promise for async/await usage
          return promise;
        },
        onChanged: {
          addListener: (callback) => {
            storageChangeListeners.add(callback);
          },
          removeListener: (callback) => {
            storageChangeListeners.delete(callback);
          },
        },
      },
      onChanged: {
        addListener: (callback) => {
          storageChangeListeners.add(callback);
        },
        removeListener: (callback) => {
          storageChangeListeners.delete(callback);
        },
      },
      managed: {
        get: function (keys, callback) {
          console.warn("chrome.storage.managed polyfill is read-only empty.");

          const promise = Promise.resolve({});

          // Support callback-based syntax
          if (typeof callback === "function") {
            promise.then((result) => {
              try {
                callback(result);
              } catch (e) {
                console.error("Error in storage.managed.get callback:", e);
              }
            });
            return;
          }

          // Return promise for async/await usage
          return promise;
        },
      },
    },
    tabs: {
      query: async (queryInfo) => {
        console.warn(
          "chrome.tabs.query polyfill only returns current tab info."
        );
        const dummyId = Math.floor(Math.random() * 1000) + 1;
        return [
          {
            id: dummyId,
            url: window.location.href,
            active: true,
            windowId: 1,
            status: "complete",
          },
        ];
      },
      create: async ({ url }) => {
        console.log(`[Polyfill tabs.create] URL: ${url}`);
        if (typeof _openTab !== "function")
          throw new Error("_openTab not defined");
        _openTab(url);
        const dummyId = Math.floor(Math.random() * 1000) + 1001;
        return Promise.resolve({
          id: dummyId,
          url: url,
          active: true,
          windowId: 1,
        });
      },
      sendMessage: async (tabId, message) => {
        console.warn(
          `chrome.tabs.sendMessage polyfill (to tab ${tabId}) redirects to runtime.sendMessage (current context).`
        );
        return chrome.runtime.sendMessage(message);
      },
    },
    notifications: {
      create: async (notificationId, options) => {
        try {
          // Handle both create(options) and create(id, options) signatures
          let id = notificationId;
          let notificationOptions = options;

          if (typeof notificationId === "object" && notificationId !== null) {
            // Single parameter: create(options)
            notificationOptions = notificationId;
            id = "notification_" + Math.random().toString(36).substring(2, 15);
          } else if (typeof notificationId === "string" && options) {
            // Two parameters: create(id, options)
            id = notificationId;
            notificationOptions = options;
          } else {
            throw new Error("Invalid parameters for notifications.create");
          }

          if (!notificationOptions || typeof notificationOptions !== "object") {
            throw new Error("Notification options must be an object");
          }

          const {
            title,
            message,
            iconUrl,
            type = "basic",
          } = notificationOptions;

          if (!title || !message) {
            throw new Error("Notification must have title and message");
          }

          // Use native browser notifications if available
          if ("Notification" in window) {
            // Check permission
            if (Notification.permission === "granted") {
              const notification = new Notification(title, {
                body: message,
                icon: iconUrl,
                tag: id,
              });

              console.log(`[Notifications] Created notification: ${id}`);
              return id;
            } else if (Notification.permission === "default") {
              // Request permission
              const permission = await Notification.requestPermission();
              if (permission === "granted") {
                const notification = new Notification(title, {
                  body: message,
                  icon: iconUrl,
                  tag: id,
                });
                console.log(
                  `[Notifications] Created notification after permission: ${id}`
                );
                return id;
              } else {
                console.warn(
                  "[Notifications] Permission denied for notifications"
                );
                return id; // Return ID even if notification wasn't shown
              }
            } else {
              console.warn("[Notifications] Notifications are blocked");
              return id;
            }
          } else {
            console.warn(
              "[Notifications] Native notifications not supported, using console fallback"
            );
            console.log(`[Notification] ${title}: ${message}`);
            return id;
          }
        } catch (error) {
          console.error(
            "[Notifications] Error creating notification:",
            error.message
          );
          throw error;
        }
      },
      clear: async (notificationId) => {
        console.log(`[Notifications] Clear notification: ${notificationId}`);
        // For native notifications, there's no direct way to clear by ID
        // This is a limitation of the Web Notifications API
        return true;
      },
      getAll: async () => {
        console.warn("[Notifications] getAll not fully supported in polyfill");
        return {};
      },
      getPermissionLevel: async () => {
        if ("Notification" in window) {
          const permission = Notification.permission;
          return { level: permission === "granted" ? "granted" : "denied" };
        }
        return { level: "denied" };
      },
    },
    contextMenus: {
      create: (createProperties, callback) => {
        try {
          if (!createProperties || typeof createProperties !== "object") {
            throw new Error("Context menu create properties must be an object");
          }

          const { id, title, contexts = ["page"], onclick } = createProperties;
          const menuId =
            id || `menu_${Math.random().toString(36).substring(2, 15)}`;

          if (!title || typeof title !== "string") {
            throw new Error("Context menu must have a title");
          }

          // Store menu items for potential use
          if (!window._polyfillContextMenus) {
            window._polyfillContextMenus = new Map();
          }

          window._polyfillContextMenus.set(menuId, {
            id: menuId,
            title,
            contexts,
            onclick,
            enabled: createProperties.enabled !== false,
          });

          console.log(
            `[ContextMenus] Created context menu item: ${title} (${menuId})`
          );

          // Try to register a menu command as fallback
          if (typeof _registerMenuCommand === "function") {
            try {
              _registerMenuCommand(
                title,
                onclick ||
                  (() => {
                    console.log(`Context menu clicked: ${title}`);
                  })
              );
            } catch (e) {
              console.warn(
                "[ContextMenus] Failed to register as menu command:",
                e.message
              );
            }
          }

          if (callback && typeof callback === "function") {
            setTimeout(() => callback(), 0);
          }

          return menuId;
        } catch (error) {
          console.error(
            "[ContextMenus] Error creating context menu:",
            error.message
          );
          if (callback && typeof callback === "function") {
            setTimeout(() => callback(), 0);
          }
          throw error;
        }
      },
      update: (id, updateProperties, callback) => {
        try {
          if (
            !window._polyfillContextMenus ||
            !window._polyfillContextMenus.has(id)
          ) {
            throw new Error(`Context menu item not found: ${id}`);
          }

          const menuItem = window._polyfillContextMenus.get(id);
          Object.assign(menuItem, updateProperties);

          console.log(`[ContextMenus] Updated context menu item: ${id}`);

          if (callback && typeof callback === "function") {
            setTimeout(() => callback(), 0);
          }
        } catch (error) {
          console.error(
            "[ContextMenus] Error updating context menu:",
            error.message
          );
          if (callback && typeof callback === "function") {
            setTimeout(() => callback(), 0);
          }
        }
      },
      remove: (menuItemId, callback) => {
        try {
          if (
            window._polyfillContextMenus &&
            window._polyfillContextMenus.has(menuItemId)
          ) {
            window._polyfillContextMenus.delete(menuItemId);
            console.log(
              `[ContextMenus] Removed context menu item: ${menuItemId}`
            );
          } else {
            console.warn(
              `[ContextMenus] Context menu item not found for removal: ${menuItemId}`
            );
          }

          if (callback && typeof callback === "function") {
            setTimeout(() => callback(), 0);
          }
        } catch (error) {
          console.error(
            "[ContextMenus] Error removing context menu:",
            error.message
          );
          if (callback && typeof callback === "function") {
            setTimeout(() => callback(), 0);
          }
        }
      },
      removeAll: (callback) => {
        try {
          if (window._polyfillContextMenus) {
            const count = window._polyfillContextMenus.size;
            window._polyfillContextMenus.clear();
            console.log(
              `[ContextMenus] Removed all ${count} context menu items`
            );
          }

          if (callback && typeof callback === "function") {
            setTimeout(() => callback(), 0);
          }
        } catch (error) {
          console.error(
            "[ContextMenus] Error removing all context menus:",
            error.message
          );
          if (callback && typeof callback === "function") {
            setTimeout(() => callback(), 0);
          }
        }
      },
      onClicked: {
        addListener: (callback) => {
          if (!window._polyfillContextMenuListeners) {
            window._polyfillContextMenuListeners = new Set();
          }
          window._polyfillContextMenuListeners.add(callback);
          console.log("[ContextMenus] Added click listener");
        },
        removeListener: (callback) => {
          if (window._polyfillContextMenuListeners) {
            window._polyfillContextMenuListeners.delete(callback);
            console.log("[ContextMenus] Removed click listener");
          }
        },
      },
    },
  };

  const loggingProxyHandler = (_key) => ({
    get(target, key, receiver) {
      console.log(`[${contextType}] [CHROME - ${_key}] Getting ${key}`);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      console.log(
        `[${contextType}] [CHROME - ${_key}] Setting ${key} to ${value}`
      );
      return Reflect.set(target, key, value, receiver);
    },
    has(target, key) {
      console.log(
        `[${contextType}] [CHROME - ${_key}] Checking if ${key} exists`
      );
      return Reflect.has(target, key);
    },
  });
  chrome = Object.fromEntries(
    Object.entries(chrome).map(([key, value]) => [
      key,
      new Proxy(value, loggingProxyHandler(key)),
    ])
  );

  // Alias browser to chrome for common Firefox pattern
  const browser = new Proxy(chrome, loggingProxyHandler);

  const oldGlobalThis = globalThis;
  const oldWindow = window;
  const oldSelf = self;
  const oldGlobal = globalThis;
  const __globalsStorage = {};

  const TO_MODIFY = [oldGlobalThis, oldWindow, oldSelf, oldGlobal];
  const set = (k, v) => {
    __globalsStorage[k] = v;
    TO_MODIFY.forEach((target) => {
      target[k] = v;
    });
  };
  const proxyHandler = {
    get(target, key, receiver) {
      return __globalsStorage[key] || Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      console.log(`[${contextType}] Setting ${key} to ${value}`);
      set(key, value);
      return Reflect.set(target, key, value, receiver);
    },
    has(target, key) {
      return key in __globalsStorage || key in target;
    },
    getOwnPropertyDescriptor(target, key) {
      if (key in __globalsStorage) {
        return {
          configurable: true,
          enumerable: true,
          writable: true,
          value: __globalsStorage[key],
        };
      }
      // fall back to the real globalThis
      const desc = Reflect.getOwnPropertyDescriptor(target, key);
      // ensure it's configurable so the with‑scope binding logic can override it
      if (desc && !desc.configurable) {
        desc.configurable = true;
      }
      return desc;
    },

    defineProperty(target, key, descriptor) {
      // Normalize descriptor to avoid mixed accessor & data attributes
      const hasAccessor = "get" in descriptor || "set" in descriptor;

      if (hasAccessor) {
        // Build a clean descriptor without value/writable when accessors present
        const normalized = {
          configurable:
            "configurable" in descriptor ? descriptor.configurable : true,
          enumerable:
            "enumerable" in descriptor ? descriptor.enumerable : false,
        };
        if ("get" in descriptor) normalized.get = descriptor.get;
        if ("set" in descriptor) normalized.set = descriptor.set;

        // Store accessor references for inspection but avoid breaking invariants
        set(key, {
          get: descriptor.get,
          set: descriptor.set,
        });

        return Reflect.defineProperty(target, key, normalized);
      }

      // Data descriptor path
      set(key, descriptor.value);
      return Reflect.defineProperty(target, key, descriptor);
    },
  };

  // Create proxies once proxyHandler is defined
  const proxyWindow = new Proxy(oldWindow, proxyHandler);
  const proxyGlobalThis = new Proxy(oldGlobalThis, proxyHandler);
  const proxyGlobal = new Proxy(oldGlobal, proxyHandler);
  const proxySelf = new Proxy(oldSelf, proxyHandler);

  // Seed storage with core globals so lookups succeed inside `with` blocks
  Object.assign(__globalsStorage, {
    chrome,
    browser,
    window: proxyWindow,
    globalThis: proxyGlobalThis,
    global: proxyGlobal,
    self: proxySelf,
  });

  const __globals = {
    chrome,
    browser,
    window: proxyWindow,
    globalThis: proxyGlobalThis,
    global: proxyGlobal,
    self: proxySelf,
    __globals: __globalsStorage,
  };

  // Store context info for debugging
  __globalsStorage.contextId = contextId;
  __globalsStorage.contextType = contextType;
  __globalsStorage.module = undefined;
  __globalsStorage.amd = undefined;
  __globalsStorage.define = undefined;

  return __globals;
}


// Export the buildPolyfill function for use
if (typeof window !== 'undefined') {
    window.buildPolyfill = buildPolyfill;
}

  // #endregion
// #endregion
    // #endregion
   // #region Background Script Environment


   // #endregion
    // #region Orchestration Logic
const SCRIPT_NAME = "JSON Formatter";

const INJECTED_MANIFEST = {"manifest_version":3,"name":"JSON Formatter","version":"0.7.3","description":"Makes JSON easy to read. Open source.","permissions":["storage"],"content_scripts":[{"matches":["<all_urls>"],"js":["content.js"],"run_at":"document_end","css":[],"_orderPreserved":true}],"options_ui":{"page":"options/options.html","open_in_tab":false},"browser_action":{},"page_action":{},"action":{},"icons":{"32":"icons/32.png","128":"icons/128.png"},"web_accessible_resources":[],"_id":"json-formatter"};
// Minimal configs just to check if *any* script should run on this page
const CONTENT_SCRIPT_CONFIGS_FOR_MATCHING = [
  {
    "matches": [
      "<all_urls>"
    ]
  }
];
// Options page path (relative inside EXTENSION_ASSETS_MAP) if available
const OPTIONS_PAGE_PATH = "options/options.html";
// Popup page path (relative inside EXTENSION_ASSETS_MAP) if available
const POPUP_PAGE_PATH = null;
// Extension icon as data URL (size closest to 48px)
const EXTENSION_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABVJJREFUeNq8V1sspVcU3jg4rq3LEB13SlWbikv0oR1pzGjiElRCeas2Hj1LE6YmM8JLIyNpwoOXJo2gSMpDU4mkWhmDqMvQIhwd17jNYTg42P2+P7/JcdzOOWO6ki85l70ue6+11/q2RlgnzoAv8DbgCngCkcAsoAcMwAawCexbYlBjwRp7wAcIysnJyd3Y2MjW6/VhgGZ3d1e7vr4uXF1dj729vY8cHBw2gb9mZ2d/wvpnwKIa0PFlxu2ucMz/3IODgz+KjY39bnFxMWVubk6DzyIuLk4EBQUJOBUGg0E4OTmJzc1N8fz5czE5OSmmpqZONBrNEoJtPjg4aFGDeQlISwPgrgOys7O/xQ6L9/f3tQkJCSItLU2Eh4cLPz8/4ebmJrRareL88PBQCWRvb0/AqZienhY9PT2ir6/vcHl5+Z+VlZUfYK9LPZETS448KjMz82lSUpLMz8+Xzc3Ncn5+XsKRtES4jutbW1tlQUGBxGmtwGYdEK3av1QcWFR5eXlTyKusqKiQ4+PjEruTtgj1JiYmZGVlpcRpGWG7Foi4Koh3MjIyniQmJsqHDx9K5F2enJzI1xHqLywsyAcPHsjQ0NAF+Pie6b3IubaoqKgWi2R5eblEQb22c/Mg7t+/L1EzvK7F9Hcm776+vinY+UF6erocHh6Wx8fH8iaF9kZGRiQK2WBnZ/cEPj81TYUPiq47LCxMtre3S1wd+SaExdnZ2Slxfdfh8xGbGiOwQ8GFr62t3cHuRXJysnK13oQ4OjqK+Ph4UVhY6IpTSMFPoQzAGYX3JRqJY2pqqkAqzinW1NSIsrIyq5xxPfXMhfbv3bvn4unpGYSvHyptdnt7+3N0PBEREaFEeZGhra0tqwLg+osCp/3IyEgREhLCrx9zFry1s7NzG01H3Lp165yh7u5uUVJSIqqrq60KoL6+Xnh5eSn65uLj48NUOI6OjiopcENxuAUEBHCoiP9D6CcqKsqDU5UBOKFjafz9/ZXebiqYaspRcie2CPWoTztnGg78BAYG0pkHA3DkMHF3dxeYYK8WtbS0KDVBI0yBLUI96tMO7ZnWAf2RDjCAI3t7+xNOMjSLV4vu3r2r5HFoaEg0NDTYFAD1qE87tHcqR0dHPBmSFyMDMCAiA0amwNg9c3zcAcew+Q3AHb728+lNoP7pSZwKR7dOpyNReckADsBitjB4BBiORTtDU7v281XCADBlORP0DOCF0WicIJNBN7z0Ttsil+mRxvX395OY6PjdBdfi65iYGCMJhDnpwP3ntiSO0qq+z/XUo76pIP8SBalHuv7G/9+cBpWAQTRXWloqQaHOGRscHFRYkTXC9dQzF9SaREH+AZ9E0qvmhAH0CHzP2NXVZTMDsoQhdXR0rGP30/BZBfiZ8sBP0IwmsrKyJFrkjZERU1IyNjYmMXMG4Iu4Y07N2IeLcSUPyQXJYG6SES0tLUmM4d9VZvyV6k8hoadC0riGxRrk6V3cDFdOLQ8Pj3P32xrh1URdiaqqqtHGxkb+9Cvwo/p6upCS86lVi5thIIfD9ZRoUDbtnHrUV3e+rVLzKLONX0jNyd8fo3vpcnNzd9va2pSUWPMuIKltamraiI6O/lPN+WPgfXPnV72MAoEsdMl8jOowFKcvmQzTQlbDl5Gzs7MyWJAupY2zw62uroqZmRl9XV3ds97eXmekdAd2WoFfgAXzl9G1b0MgFvgC+MzFxSUIVXwAMqEFozGied0muUBf16GVO2DwrA0MDDihA/qrxUY28jMwAexY8zY0TwmJYjDwAUAy+Z76m6cKPjxfqGCH+011+i8771Wv4/8EGADDWPCX+M7kKwAAAABJRU5ErkJggg==";
// CSS data is needed by the combined execution logic
const extensionCssData = {};

const LOCALE_KEYS = {}

// Function to convert match pattern string to a RegExp object
const convertMatchPatternToRegExp = function convertMatchPatternToRegExp(pattern) {
    if (pattern === "<all_urls>")
      return new RegExp(".*");
    try {
      const singleEscapedPattern = convertMatchPatternToRegExpString(pattern).replace(/\\\\/g, "\\");
      return new RegExp(singleEscapedPattern);
    } catch (error) {
      console.error(`Error converting match pattern to RegExp: ${pattern}`, error);
      return new RegExp("$.");
    }
  };
// Function to convert match pattern string to a double-escaped string for RegExp constructor
const convertMatchPatternToRegExpString = function convertMatchPatternToRegExpString(pattern) {
    function escapeRegex(s) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, "\\\\$&");
    }
    if (typeof pattern !== "string" || !pattern)
      return "$.";
    const schemeMatch = pattern.match(/^(\*|https?|file|ftp):\/\//);
    if (!schemeMatch)
      return "$.";
    const scheme = schemeMatch[1];
    pattern = pattern.substring(schemeMatch[0].length);
    const schemeRegex = scheme === "*" ? "https?|file|ftp" : scheme, hostMatch = pattern.match(/^([^\/]+)/);
    if (!hostMatch)
      return "$.";
    const host = hostMatch[1];
    pattern = pattern.substring(host.length);
    let hostRegex;
    if (host === "*")
      hostRegex = "[^/]+";
    else if (host.startsWith("*."))
      hostRegex = "(?:[^\\/]+\\.)?" + escapeRegex(host.substring(2));
    else
      hostRegex = escapeRegex(host);
    let pathRegex = pattern;
    if (!pathRegex.startsWith("/"))
      pathRegex = "/" + pathRegex;
    pathRegex = pathRegex.split("*").map(escapeRegex).join(".*");
    if (pathRegex === "/.*")
      pathRegex = "(?:/.*)?";
    else
      pathRegex = pathRegex + "(?:[?#]|$)";
    return `^${schemeRegex}:\\/\\/${hostRegex}${pathRegex}`;
  };

// Web accessible resources utility functions
function _matchGlobPattern(pattern, path) {
  if (!pattern || !path) return false;
  
  // Normalize paths to use forward slashes
  pattern = pattern.replace(/\\/g, '/');
  path = path.replace(/\\/g, '/');
  
  // Handle exact matches first
  if (pattern === path) return true;
  
  // Convert glob pattern to regex
  // Escape special regex chars except * and **
  let regexPattern = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')  // Escape regex chars
    .replace(/\*\*/g, '__DOUBLESTAR__')      // Temporarily replace **
    .replace(/\*/g, '[^/]*')                 // * matches any chars except /
    .replace(/__DOUBLESTAR__/g, '.*');       // ** matches any chars including /
  
  // Ensure pattern matches from start to end
  regexPattern = '^' + regexPattern + '$';
  
  try {
    const regex = new RegExp(regexPattern);
    return regex.test(path);
  } catch (e) {
    console.error(`Invalid glob pattern: ${pattern}`, e);
    return false;
  }
}

function _isWebAccessibleResource(resourcePath, webAccessibleResources) {
  if (!Array.isArray(webAccessibleResources) || webAccessibleResources.length === 0) {
    return false;
  }
  
  // Normalize the resource path
  const normalizedPath = resourcePath.replace(/\\/g, '/').replace(/^\/+/, '');
  
  for (const webAccessibleResource of webAccessibleResources) {
    let patterns = [];
    
    // Handle both manifest v2 and v3 formats
    if (typeof webAccessibleResource === 'string') {
      // Manifest v2 format: array of strings
      patterns = [webAccessibleResource];
    } else if (webAccessibleResource && Array.isArray(webAccessibleResource.resources)) {
      // Manifest v3 format: objects with resources array
      patterns = webAccessibleResource.resources;
    }
    
    // Check if the path matches any pattern
    for (const pattern of patterns) {
      if (_matchGlobPattern(pattern, normalizedPath)) {
        return true;
      }
    }
  }
  
  return false;
}

// Make utility functions available globally
window._matchGlobPattern = _matchGlobPattern;
window._isWebAccessibleResource = _isWebAccessibleResource;

// This function contains all the CSS injection and JS execution,
// ordered by run_at timing internally using await.

  // #region Script Execution Logic
async function executeAllScripts(globalThis, extensionCssData) {
  const {chrome, browser, global, window, self} = globalThis;
  const scriptName = "JSON Formatter"; // Make name available inside
  console.log(`[${scriptName}] Starting execution phases...`);

  // #region Document Start
  if (typeof document !== 'undefined') {
    console.log(`[${scriptName}] Executing document-start phase...`);
    
    const scriptPaths = [];
   console.log(`  Executing JS (start): ${scriptPaths}`);

   try {
       // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
      with (globalThis){;

;}
   } catch(e) { console.error(`  Error executing scripts ${scriptPaths}`, e); }
  
  } else {
      console.log(`[${scriptName}] Skipping document-start phase (no document).`);
  }

  /*
  // #endregion
  // #region Wait for Document End DOMContentLoaded ---
  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    console.log(`[${scriptName}] Waiting for DOMContentLoaded...`);
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
    console.log(`[${scriptName}] DOMContentLoaded fired.`);
  } else if (typeof document !== 'undefined') {
    console.log(`[${scriptName}] DOMContentLoaded already passed or not applicable.`);
  }
  */

  // #endregion
  // #region Document End
   if (typeof document !== 'undefined') {
    console.log(`[${scriptName}] Executing document-end phase...`);
    
    const scriptPaths = ["content.js"];
   console.log(`  Executing JS (end): ${scriptPaths}`);

   try {
       // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
      with (globalThis){;
// START: content.js
(()=>{window.__jsonFormatterStartTime=performance.now();var M="Runtime assertion failed";function f(e,l){if(e)return;let i=typeof l=="function"?l():l,n=i?"".concat(M,": ").concat(i):M;throw new Error(n)}var O=e=>typeof e=="string"?1:typeof e=="number"?2:e===!1||e===!0?5:e===null?6:Array.isArray(e)?4:3;var J=document.createElement("span"),_=()=>J.cloneNode(!1),m=e=>{let l=_();return l.className=e,l},h=(e,l)=>{let i=_();return i.className=l,i.innerText=e,i},s={t_entry:m("entry"),t_exp:m("e"),t_key:m("k"),t_string:m("s"),t_number:m("n"),t_null:h("null","nl"),t_true:h("true","bl"),t_false:h("false","bl"),t_oBrace:h("{","b"),t_cBrace:h("}","b"),t_oBracket:h("[","b"),t_cBracket:h("]","b"),t_sizeComment:m("sizeComment"),t_ellipsis:m("ell"),t_blockInner:m("blockInner"),t_colonAndSpace:document.createTextNode(":\xA0"),t_commaText:document.createTextNode(","),t_dblqText:document.createTextNode('"')};var k=(e,l)=>{let i=O(e),n=s.t_entry.cloneNode(!1),d=0;i===3?d=Object.keys(e).length:i===4&&(d=e.length);let b=!1;if(i===3||i===4){for(let t in e)if(e.hasOwnProperty(t)){b=!0;break}b&&n.appendChild(s.t_exp.cloneNode(!1))}if(l!==!1){n.classList.add("objProp");let t=s.t_key.cloneNode(!1);t.textContent=JSON.stringify(l).slice(1,-1),n.appendChild(s.t_dblqText.cloneNode(!1)),n.appendChild(t),n.appendChild(s.t_dblqText.cloneNode(!1)),n.appendChild(s.t_colonAndSpace.cloneNode(!1))}else n.classList.add("arrElem");let p,c;switch(i){case 1:{f(typeof e=="string");let t=_(),o=JSON.stringify(e);if(o=o.substring(1,o.length-1),e.substring(0,8)==="https://"||e.substring(0,7)==="http://"||e[0]==="/"){let a=document.createElement("a");a.href=e,a.innerText=o,t.appendChild(a)}else t.innerText=o;let r=s.t_string.cloneNode(!1);r.appendChild(s.t_dblqText.cloneNode(!1)),r.appendChild(t),r.appendChild(s.t_dblqText.cloneNode(!1)),n.appendChild(r);break}case 2:{let t=s.t_number.cloneNode(!1);t.innerText=String(e),n.appendChild(t);break}case 3:{if(f(typeof e=="object"),n.appendChild(s.t_oBrace.cloneNode(!0)),b){n.appendChild(s.t_ellipsis.cloneNode(!1)),p=s.t_blockInner.cloneNode(!1);let t;for(let o in e)if(e.hasOwnProperty(o)){c=k(e[o],o);let r=s.t_commaText.cloneNode();c.appendChild(r),p.appendChild(c),t=r}f(typeof c<"u"&&typeof t<"u"),c.removeChild(t),n.appendChild(p)}n.appendChild(s.t_cBrace.cloneNode(!0)),n.dataset.size=` // ${d} ${d===1?"item":"items"}`;break}case 4:{if(f(Array.isArray(e)),n.appendChild(s.t_oBracket.cloneNode(!0)),b){n.appendChild(s.t_ellipsis.cloneNode(!1)),p=s.t_blockInner.cloneNode(!1);for(let t=0,o=e.length,r=o-1;t<o;t++){if(c=k(e[t],!1),t<r){let a=s.t_commaText.cloneNode();c.appendChild(a)}p.appendChild(c)}n.appendChild(p)}n.appendChild(s.t_cBracket.cloneNode(!0)),n.dataset.size=` // ${d} ${d===1?"item":"items"}`;break}case 5:{e?n.appendChild(s.t_true.cloneNode(!0)):n.appendChild(s.t_false.cloneNode(!0));break}case 6:{n.appendChild(s.t_null.cloneNode(!0));break}}return n};var L=`body {
  background-color: #fff;
  user-select: text;
  overflow-y: scroll !important;
  margin: 0;
  position: relative;
  padding-top: 1px; /* hack to prevent margin collapse in 'Raw' */
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
#optionBar {
  user-select: none;
  display: block;
  position: absolute;
  top: 13px;
  right: 15px;
}
#buttonFormatted,
#buttonPlain {
  border-radius: 2px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  user-select: none;
  background: linear-gradient(#fafafa, #f4f4f4 40%, #e5e5e5);
  border: 1px solid #aaa;
  color: #444;
  font-size: 13px;
  /* text-transform: uppercase; */
  margin-bottom: 0px;
  min-width: 4em;
  padding: 3px 0;
  position: relative;
  z-index: 10;
  display: inline-block;
  width: 80px;
  text-shadow: 1px 1px rgba(255, 255, 255, 0.3);
}
#buttonFormatted {
  margin-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
#buttonPlain {
  margin-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: none;
}
:is(#buttonPlain, #buttonFormatted):not(.selected):hover {
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
  background: #ebebeb linear-gradient(#fefefe, #f8f8f8 40%, #e9e9e9);
  border-color: #999;
  color: #222;
}
:is(#buttonPlain, #buttonFormatted):active {
  box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.2);
  background: #ebebeb linear-gradient(#f4f4f4, #efefef 40%, #dcdcdc);
  color: #333;
}
:is(#buttonPlain, #buttonFormatted).selected {
  box-shadow: inset 0px 1px 5px rgba(0, 0, 0, 0.2);
  background: #ebebeb linear-gradient(#e4e4e4, #dfdfdf 40%, #dcdcdc);
  color: #333;
}
:is(#buttonPlain, #buttonFormatted):focus {
  outline: 0;
}
.entry {
  display: block;
  padding-left: 20px;
  margin-left: -20px;
  position: relative;
}
#jsonFormatterParsed {
  padding-left: 28px;
  padding-top: 6px;
  line-height: 1.5;
}
#jsonFormatterRaw {
  padding: 36px 10px 5px;
}
.collapsed {
  white-space: nowrap;
}
.collapsed > .blockInner {
  display: none;
}
.collapsed > .ell:after {
  content: '\u2026';
  font-weight: bold;
}
.collapsed > .ell {
  margin: 0 4px;
  color: #888;
}
.collapsed .entry {
  display: inline;
}

.collapsed:after {
  content: attr(data-size);
  color: #aaa;
}

.e {
  width: 20px;
  height: 18px;
  display: block;
  position: absolute;
  left: 0px;
  top: 1px;
  color: black;
  z-index: 5;
  background-repeat: no-repeat;
  background-position: center center;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.15;
}

.e::after {
  content: '';
  display: block;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 0 4px 6.9px;
  border-color: transparent transparent transparent currentColor;
  transform: rotate(90deg) translateY(1px);
}

.collapsed > .e::after {
  transform: none;
}

.e:hover {
  opacity: 0.35;
}
.e:active {
  opacity: 0.5;
}
.collapsed .entry .e {
  display: none;
}
.blockInner {
  display: block;
  padding-left: 24px;
  border-left: 1px dotted #bbb;
  margin-left: 2px;
}
#jsonFormatterParsed {
  color: #444;
}

.entry {
  font-size: 13px;
  font-family: monospace;
}

.b {
  font-weight: bold;
}
.s {
  color: #0b7500;
  word-wrap: break-word;
}
a:link,
a:visited {
  text-decoration: none;
  color: inherit;
}
a:hover,
a:active {
  text-decoration: underline;
  color: #050;
}
.bl,
.nl,
.n {
  font-weight: bold;
  color: #1a01cc;
}
.k {
  color: #000;
}

[hidden] {
  display: none !important;
}
span {
  white-space: pre-wrap;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

#spinner {
  animation: spin 2s linear infinite;
}
`,F=`body {
  background-color: #1a1a1a;
  color: #eee;
  -webkit-font-smoothing: antialiased;
}

a:hover,
a:active {
  color: hsl(114, 90%, 55%);
}

#optionBar {
  -webkit-font-smoothing: subpixel-antialiased;
}

#jsonFormatterParsed {
  color: #b6b6b6;
}

.blockInner {
  border-color: #4d4d4d;
}

.k {
  color: #fff;
}

.s {
  color: hsl(114, 100%, 35%);
}

.bl,
.nl,
.n {
  color: hsl(200, 100%, 70%);
}

.e {
  color: #fff;
  opacity: 0.25;
}

.e:hover {
  opacity: 0.45;
}
.e:active {
  opacity: 0.6;
}

.collapsed:after {
  color: #707070;
}

:is(#buttonPlain, #buttonFormatted) {
  text-shadow: none;
  border: 0;
  background: hsl(200, 35%, 60%);
  box-shadow: none;
  color: #000;
}

:is(#buttonPlain, #buttonFormatted):not(.selected):hover {
  box-shadow: none;
  background: hsl(200, 50%, 70%);
  color: #000;
}

:is(#buttonPlain, #buttonFormatted).selected {
  box-shadow: inset 0px 1px 5px rgba(0, 0, 0, 0.7);
  background: hsl(200, 40%, 60%);
  color: #000;
}
`,R=!1,Y=new Promise(e=>{chrome.storage.local.get("themeOverride",l=>{switch(l.themeOverride){case"force_light":e(L);break;case"force_dark":e(L+`

`+F);break;case"system":default:e(L+`

@media (prefers-color-scheme: dark) {
`+F+`
}`)}})}),j=(async()=>{let e=(()=>{let t=document.body.children,o=t.length;for(let r=0;r<o;r++){let a=t[r];if(a.tagName==="PRE")return a}return null})();if(e===null)return{formatted:!1,note:"No body>pre found",rawLength:null};let l=e.textContent;if(!l)return{formatted:!1,note:"No content in body>pre",rawLength:0};let i=l.length;if(i>3e6)return{formatted:!1,note:"Too long",rawLength:i};if(!/^\s*[\{\[]/.test(l))return{formatted:!1,note:"Does not start with { or ]",rawLength:i};e.remove();let n=document.createElement("div");n.id="jsonFormatterParsed",document.body.appendChild(n);let d=document.createElement("div");d.hidden=!0,d.id="jsonFormatterRaw",d.append(e),document.body.appendChild(d);{let t;try{t=JSON.parse(l)}catch{return n.remove(),d.remove(),document.body.prepend(e),{formatted:!1,note:"Does not parse as JSON",rawLength:i}}if(typeof t!="object"&&!Array.isArray(t))return{formatted:!1,note:"Technically JSON but not an object or array",rawLength:i};let o=t;{let a=document.createElement("style");a.id="jfStyleEl",a.insertAdjacentHTML("beforeend",await Y),document.head.appendChild(a);let E=document.createElement("div");E.id="optionBar";let g=document.createElement("button"),S=document.createElement("span"),u=document.createElement("button"),B=document.createElement("span");g.appendChild(S),u.appendChild(B),g.id="buttonPlain",S.innerText="Raw",u.id="buttonFormatted",B.innerText="Parsed",u.classList.add("selected");let T=!1;g.addEventListener("mousedown",()=>{T||(T=!0,d.hidden=!1,n.hidden=!0,u.classList.remove("selected"),g.classList.add("selected"))},!1),u.addEventListener("mousedown",function(){T&&(T=!1,d.hidden=!0,n.hidden=!1,u.classList.add("selected"),g.classList.remove("selected"))},!1),E.appendChild(g),E.appendChild(u),document.body.prepend(E),document.addEventListener("mousedown",c)}let r=k(o,!1);await Promise.resolve(),n.append(r)}for(let t of document.getElementsByClassName("json-formatter-container"))t.style.display="none";return{formatted:!0,note:"done",rawLength:i};function b(t){let o,r,a;for(r=t.length-1;r>=0;r--)if(o=t[r],o.classList.add("collapsed"),!o.id){for(a=o.firstElementChild;a&&!a.classList.contains("blockInner");)a=a.nextElementSibling;if(!a)continue}}function p(t){for(let o=t.length-1;o>=0;o--)t[o].classList.remove("collapsed")}function c(t){let o=t.target;if(o instanceof HTMLElement&&o.className==="e"){t.preventDefault();let r=o.parentNode;if(f(r instanceof HTMLElement),r.classList.contains("collapsed"))if(t.metaKey||t.ctrlKey){let a=r.parentNode;f(a instanceof HTMLElement),p(a.children)}else p([r]);else if(t.metaKey||t.ctrlKey){let a=r.parentNode;f(a instanceof HTMLElement),b(a.children)}else b([r])}}})();R&&j.then(e=>{let l=window.__jsonFormatterStartTime,n=performance.now()-l;console.log("JSON Formatter",e),console.log("Duration:",Math.round(n*10)/10,"ms")});})();
// END: content.js
;}
   } catch(e) { console.error(`  Error executing scripts ${scriptPaths}`, e); }
  
  } else {
      console.log(`[${scriptName}] Skipping document-end phase (no document).`);
  }
  
  /*
  // #endregion
  // #region Wait for Document Idle
  console.log(`[${scriptName}] Waiting for document idle state...`);
  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      await new Promise(resolve => window.requestIdleCallback(resolve, { timeout: 2000 })); // 2-second timeout fallback
      console.log(`[${scriptName}] requestIdleCallback fired or timed out.`);
  } else {
      // Fallback: wait a short period after DOMContentLoaded/current execution if requestIdleCallback is unavailable
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log(`[${scriptName}] Idle fallback timer completed.`);
  }
  */

  // #endregion
  // #region Document Idle
   if (typeof document !== 'undefined') {
    console.log(`[${scriptName}] Executing document-idle phase...`);
    
    const scriptPaths = [];
   console.log(`  Executing JS (idle): ${scriptPaths}`);

   try {
       // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
      with (globalThis){;

;}
   } catch(e) { console.error(`  Error executing scripts ${scriptPaths}`, e); }
  
  } else {
      console.log(`[${scriptName}] Skipping document-idle phase (no document).`);
  }

  console.log(`[${scriptName}] All execution phases complete, re-firing load events.`);
  document.dispatchEvent(new Event("DOMContentLoaded", {
    bubbles: true,
    cancelable: true
  }));
}

function closeOptionsModal() {
    const DURATION = 100;
    const backdrop = document.getElementById('extension-options-backdrop');
    const modal = document.getElementById('extension-options-modal');
    
    if (!backdrop || !modal) return;
    
    modal.style.animation = `modalCloseAnimation ${DURATION / 1000}s ease-out forwards`;
    backdrop.style.animation = `backdropFadeOut ${DURATION / 1000}s ease-out forwards`;
    
    setTimeout(() => {
        if (confirm('Close options and reload the page?')) {
            window.location.reload();
        } else {
            backdrop.remove();
        }
    }, DURATION);
}

function closePopupModal() {
    const DURATION = 100;
    const backdrop = document.getElementById('extension-popup-backdrop');
    const modal = document.getElementById('extension-popup-modal');
    
    if (!backdrop || !modal) return;
    
    modal.style.animation = `modalCloseAnimation ${DURATION / 1000}s ease-out forwards`;
    backdrop.style.animation = `backdropFadeOut ${DURATION / 1000}s ease-out forwards`;
    
    setTimeout(() => {
        backdrop.remove();
    }, DURATION);
}

function openPopupPage() {
    if (!POPUP_PAGE_PATH || typeof EXTENSION_ASSETS_MAP === 'undefined') {
        console.warn('No popup page available.');
        return;
    }
    const html = EXTENSION_ASSETS_MAP[POPUP_PAGE_PATH];
    if (!html) { console.warn('Popup HTML not found in asset map'); return; }

    let backdrop = document.getElementById('extension-popup-backdrop');
    let modal, iframe;
    
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'extension-popup-backdrop';
        
        modal = document.createElement('div');
        modal.id = 'extension-popup-modal';
        
        const extensionName = INJECTED_MANIFEST.name || 'Extension Popup';
        const iconSrc = EXTENSION_ICON || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik00IDdoM2ExIDEgMCAwIDAgMSAtMXYtMWEyIDIgMCAwIDEgNCAwdjFhMSAxIDAgMCAwIDEgMWgzYTEgMSAwIDAgMSAxIDF2M2ExIDEgMCAwIDAgMSAxaDFhMiAyIDAgMCAxIDAgNGgtMWExIDEgMCAwIDAgLTEgMXYzYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtMWEyIDIgMCAwIDAgLTQgMHYxYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMWgxYTIgMiAwIDAgMCAwIC00aC0xYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMSIgLz48L3N2Zz4=';
        
        backdrop.innerHTML = `
            <style>
                #extension-popup-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.13);
                    backdrop-filter: blur(3px);
                    z-index: 2147483646;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: backdropFadeIn 0.3s ease-out forwards;
                }
                
                #extension-popup-modal {
                    width: 400px;
                    height: 600px;
                    max-width: calc(100vw - 40px);
                    max-height: calc(100vh - 40px);
                    z-index: 2147483647;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    --background: #ffffff;
                    --rad: 10px;
                    --border: #666;
                    --border-thickness: 2px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    animation: modalOpenAnimation 0.3s ease-out forwards;
                }
                
                #extension-popup-modal .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    padding: 0 16px;
                    position: relative;
                    flex-shrink: 0;
                }
                
                #extension-popup-modal .tab {
                    padding: 12px 16px;
                    color: #606266;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    border-radius: var(--rad) var(--rad) 0 0;
                    transition: background-color 0.2s ease;
                    user-select: none;
                }
                
                #extension-popup-modal .tab.active, #extension-popup-modal .tab.close-button {
                    background-color: var(--background);
                    border: var(--border-thickness) solid var(--border);
                    border-bottom-color: var(--background);
                    margin-bottom: -1px;
                    z-index: 1;
                    color: #303133;
                    font-weight: 500;
                }
                
                #extension-popup-modal .tab.close-button {
                    padding: 8px;
                }
                
                #extension-popup-modal .tab.close-button:hover {
                    background-color: #f5f7fa;
                }
                
                #extension-popup-modal .tab svg {
                    stroke: currentColor;
                }
                
                #extension-popup-modal .tab.active svg {
                    width: 16px;
                    height: 16px;
                }
                
                #extension-popup-modal .tab.close-button svg {
                    width: 20px;
                    height: 20px;
                }
                
                #extension-popup-modal .modal-content {
                    flex-grow: 1;
                    position: relative;
                    border-radius: var(--rad);
                    overflow: hidden;
                    bottom: calc(var(--border-thickness) - 1px);
                    border: var(--border-thickness) solid var(--border);
                }
                
                #extension-popup-modal .modal-content iframe {
                    width: 100%;
                    height: 100%;
                    border: 0;
                    background: white;
                }
            </style>
        `;
        
        modal.innerHTML = `
            <div class="modal-header">
                <div class="tab active">
                    <img src="${iconSrc}" style="width: 16px; height: 16px;" onerror="this.style.display='none'">
                    <span>${extensionName}</span>
                </div>
                <div class="tab close-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                       <line x1="18" y1="6" x2="6" y2="18"></line>
                       <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            </div>
            <div class="modal-content">
                <iframe></iframe>
            </div>
        `;
        
        backdrop.appendChild(modal);
        
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closePopupModal();
            }
        });
        modal.querySelector('.tab.close-button').addEventListener('click', closePopupModal);
        document.body.appendChild(backdrop);
        iframe = modal.querySelector('iframe');
    } else {
        modal = backdrop.querySelector('#extension-popup-modal');
        iframe = modal.querySelector('iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            modal.querySelector('.modal-content').appendChild(iframe);
        }
        backdrop.style.display = 'flex';
    }
    
    try {
        const polyfillString = generateCompletePolyfillForIframe();

        const doc = new DOMParser().parseFromString(html, 'text/html');
        const script = doc.createElement('script');
        script.textContent = polyfillString;
        doc.head.insertAdjacentElement("afterbegin", script);
        iframe.srcdoc = doc.documentElement.outerHTML;
    } catch(e) {
        console.error('Error generating complete polyfill for iframe', e);
        iframe.srcdoc = html;
    }
}

function openOptionsPage() {
    if (!OPTIONS_PAGE_PATH || typeof EXTENSION_ASSETS_MAP === 'undefined') {
        console.warn('No options page available.');
        return;
    }
    const html = EXTENSION_ASSETS_MAP[OPTIONS_PAGE_PATH];
    if (!html) { console.warn('Options HTML not found in asset map'); return; }

    let backdrop = document.getElementById('extension-options-backdrop');
    let modal, iframe;
    
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'extension-options-backdrop';
        
        modal = document.createElement('div');
        modal.id = 'extension-options-modal';
        
        const extensionName = INJECTED_MANIFEST.name || 'Extension Options';
        const iconSrc = EXTENSION_ICON || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik00IDdoM2ExIDEgMCAwIDAgMSAtMXYtMWEyIDIgMCAwIDEgNCAwdjFhMSAxIDAgMCAwIDEgMWgzYTEgMSAwIDAgMSAxIDF2M2ExIDEgMCAwIDAgMSAxaDFhMiAyIDAgMCAxIDAgNGgtMWExIDEgMCAwIDAgLTEgMXYzYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtMWEyIDIgMCAwIDAgLTQgMHYxYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMWgxYTIgMiAwIDAgMCAwIC00aC0xYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMSIgLz48L3N2Zz4=';
        
        backdrop.innerHTML = `
            <style>
                #extension-options-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.13);
                    backdrop-filter: blur(3px);
                    z-index: 2147483646;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: backdropFadeIn 0.3s ease-out forwards;
                }
                
                @keyframes backdropFadeIn {
                    from {
                        opacity: 0;
                        backdrop-filter: blur(0px);
                    }
                    to {
                        opacity: 1;
                        backdrop-filter: blur(3px);
                    }
                }
                
                @keyframes backdropFadeOut {
                    from {
                        opacity: 1;
                        backdrop-filter: blur(3px);
                    }
                    to {
                        opacity: 0;
                        backdrop-filter: blur(0px);
                    }
                }
                
                @keyframes modalOpenAnimation {
                    from {
                        transform: scaleY(0.8);
                        opacity: 0;
                    }
                    to {
                        transform: scaleY(1);
                        opacity: 1;
                    }
                }
                
                @keyframes modalCloseAnimation {
                    from {
                        transform: scaleY(1);
                        opacity: 1;
                    }
                    to {
                        transform: scaleY(0.8);
                        opacity: 0;
                    }
                }
                
                #extension-options-modal {
                    width: calc(100vw - 80px);
                    height: calc(100vh - 80px);
                    max-width: 1200px;
                    max-height: 800px;
                    z-index: 2147483647;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    --background: #ffffff;
                    --rad: 10px;
                    --border: #666;
                    --border-thickness: 2px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    animation: modalOpenAnimation 0.3s ease-out forwards;
                }
                
                #extension-options-modal .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    padding: 0 16px;
                    position: relative;
                    flex-shrink: 0;
                }
                
                #extension-options-modal .tab {
                    padding: 12px 16px;
                    color: #606266;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    border-radius: var(--rad) var(--rad) 0 0;
                    transition: background-color 0.2s ease;
                    user-select: none;
                }
                
                #extension-options-modal .tab.active, #extension-options-modal .tab.close-button {
                    background-color: var(--background);
                    border: var(--border-thickness) solid var(--border);
                    border-bottom-color: var(--background);
                    margin-bottom: -1px;
                    z-index: 1;
                    color: #303133;
                    font-weight: 500;
                }
                
                #extension-options-modal .tab.close-button {
                    padding: 8px;
                }
                
                #extension-options-modal .tab.close-button:hover {
                    background-color: #f5f7fa;
                }
                
                #extension-options-modal .tab svg {
                    stroke: currentColor;
                }
                
                #extension-options-modal .tab.active svg {
                    width: 16px;
                    height: 16px;
                }
                
                #extension-options-modal .tab.close-button svg {
                    width: 20px;
                    height: 20px;
                }
                
                #extension-options-modal .modal-content {
                    flex-grow: 1;
                    position: relative;
                    border-radius: var(--rad);
                    overflow: hidden;
                    bottom: calc(var(--border-thickness) - 1px);
                    border: var(--border-thickness) solid var(--border);
                }
                
                #extension-options-modal .modal-content iframe {
                    width: 100%;
                    height: 100%;
                    border: 0;
                    background: white;
                }
            </style>
        `;
        
        modal.innerHTML = `
            <div class="modal-header">
                <div class="tab active">
                    <img src="${iconSrc}" style="width: 16px; height: 16px;" onerror="this.style.display='none'">
                    <span>${extensionName}</span>
                </div>
                <div class="tab close-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                       <line x1="18" y1="6" x2="6" y2="18"></line>
                       <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            </div>
            <div class="modal-content">
                <iframe></iframe>
            </div>
        `;
        
        backdrop.appendChild(modal);
        
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeOptionsModal();
            }
        });
        modal.querySelector('.tab.close-button').addEventListener('click', closeOptionsModal);
        document.body.appendChild(backdrop);
        iframe = modal.querySelector('iframe');
    } else {
        modal = backdrop.querySelector('#extension-options-modal');
        iframe = modal.querySelector('iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            modal.querySelector('.modal-content').appendChild(iframe);
        }
        backdrop.style.display = 'flex';
    }
    
    try {
        const polyfillString = generateCompletePolyfillForIframe();

        const doc = new DOMParser().parseFromString(html, 'text/html');
        const script = doc.createElement('script');
        script.textContent = polyfillString;
        doc.head.insertAdjacentElement("afterbegin", script);
        iframe.srcdoc = doc.documentElement.outerHTML;
    } catch(e) {
        console.error('Error generating complete polyfill for iframe', e);
        iframe.srcdoc = html;
    }
}

// Helper function to generate complete polyfill code for iframe injection
function generateCompletePolyfillForIframe() {
    // The unified polyfill string is injected here during build
    const polyfillString = "\n// --- Unified Polyfill String ---\n// This contains all necessary code to create a complete polyfill environment\n\n// -- Messaging implementation\n\nfunction createEventBus(\n  scopeId,\n  type = \"page\", // \"page\" or \"iframe\"\n  { allowedOrigin = \"*\", children = [], parentWindow = null } = {}\n) {\n  if (!scopeId) throw new Error(\"createEventBus requires a scopeId\");\n\n  const handlers = {};\n\n  function handleIncoming(ev) {\n    // origin check\n    if (allowedOrigin !== \"*\" && ev.origin !== allowedOrigin) return;\n\n    const msg = ev.data;\n    // must be our eventBus message, same scope\n    if (!msg || msg.__eventBus !== true || msg.scopeId !== scopeId) return;\n\n    const { event, payload } = msg;\n\n    // PAGE: if it's an INIT from an iframe, adopt it\n    if (type === \"page\" && event === \"__INIT__\") {\n      const win = ev.source;\n      if (win && !children.includes(win)) {\n        children.push(win);\n      }\n      return;\n    }\n\n    // dispatch to listeners\n    (handlers[event] || []).forEach((fn) =>\n      fn(payload, { origin: ev.origin, source: ev.source })\n    );\n  }\n\n  window.addEventListener(\"message\", handleIncoming);\n\n  function emitTo(win, event, payload) {\n    const envelope = {\n      __eventBus: true,\n      scopeId,\n      event,\n      payload,\n    };\n    win.postMessage(envelope, allowedOrigin);\n  }\n\n  // IFRAME: announce to page on startup\n  if (type === \"iframe\") {\n    setTimeout(() => {\n      const pw = parentWindow || window.parent;\n      if (pw && pw.postMessage) {\n        emitTo(pw, \"__INIT__\", null);\n      }\n    }, 0);\n  }\n\n  return {\n    on(event, fn) {\n      handlers[event] = handlers[event] || [];\n      handlers[event].push(fn);\n    },\n    off(event, fn) {\n      if (!handlers[event]) return;\n      handlers[event] = handlers[event].filter((h) => h !== fn);\n    },\n    emit(event, payload) {\n      // dispatch locally first\n      (handlers[event] || []).forEach((fn) =>\n        fn(payload, { origin: location.origin, source: window })\n      );\n\n      // then propagate\n      if (type === \"page\") {\n        children.forEach((win) => emitTo(win, event, payload));\n      } else {\n        const pw = parentWindow || window.parent;\n        if (pw && pw.postMessage) {\n          emitTo(pw, event, payload);\n        }\n      }\n    },\n  };\n}\n\n// ===================================================================\n// 2) RUNTIME POLYFILL FACTORY WITH PORTS\n// ===================================================================\nfunction createRuntime(type = \"background\", bus) {\n  // message-based RPC\n  let nextId = 1;\n  const pending = {};\n  const msgListeners = [];\n\n  // port-based\n  let nextPortId = 1;\n  const ports = {}; // all open ports by id\n  const onConnectListeners = [];\n\n  function parseArgs(args) {\n    let target, message, options, callback;\n    const arr = [...args];\n    if (arr.length === 0) {\n      throw new Error(\"sendMessage requires at least one argument\");\n    }\n    // last object could be options\n    if (\n      arr.length &&\n      typeof arr[arr.length - 1] === \"object\" &&\n      !Array.isArray(arr[arr.length - 1])\n    ) {\n      options = arr.pop();\n    }\n    // last function is callback\n    if (arr.length && typeof arr[arr.length - 1] === \"function\") {\n      callback = arr.pop();\n    }\n    if (\n      arr.length === 2 &&\n      (typeof arr[0] === \"string\" || typeof arr[0] === \"number\")\n    ) {\n      [target, message] = arr;\n    } else {\n      [message] = arr;\n    }\n    return { target, message, options, callback };\n  }\n\n  if (type === \"background\") {\n    bus.on(\"__REQUEST__\", ({ id, message }, _) => {\n      let responded = false,\n        isAsync = false;\n      function sendResponse(resp) {\n        if (responded) return;\n        responded = true;\n        bus.emit(\"__RESPONSE__\", { id, response: resp });\n      }\n      const results = msgListeners\n        .map((fn) => {\n          try {\n            const ret = fn(message, sendResponse);\n            if (ret === true || (ret && typeof ret.then === \"function\")) {\n              isAsync = true;\n              return ret;\n            }\n            return ret;\n          } catch (e) {\n            console.error(e);\n          }\n        })\n        .filter((r) => r !== undefined);\n\n      const promises = results.filter((r) => r && typeof r.then === \"function\");\n      if (!isAsync && promises.length === 0) {\n        const out = results.length === 1 ? results[0] : results;\n        sendResponse(out);\n      } else if (promises.length) {\n        Promise.all(promises).then((vals) => {\n          if (!responded) {\n            const out = vals.length === 1 ? vals[0] : vals;\n            sendResponse(out);\n          }\n        });\n      }\n    });\n  }\n\n  if (type !== \"background\") {\n    bus.on(\"__RESPONSE__\", ({ id, response }) => {\n      const entry = pending[id];\n      if (!entry) return;\n      entry.resolve(response);\n      if (entry.callback) entry.callback(response);\n      delete pending[id];\n    });\n  }\n\n  function sendMessage(...args) {\n    if (type === \"background\") {\n      throw new Error(\"Background cannot sendMessage to itself\");\n    }\n    const { target, message, callback } = parseArgs(args);\n    const id = nextId++;\n    const promise = new Promise((resolve) => {\n      pending[id] = { resolve, callback };\n      bus.emit(\"__REQUEST__\", { id, message });\n    });\n    return promise;\n  }\n\n  // ============================\n  // PORT‐BASED CONNECT / DISCONNECT\n  // ============================\n  // When any side calls .connect(), emit a magic event\n  // that the background listens to.  The background then\n  // notifies its onConnect listeners with a Port object.\n  bus.on(\"__PORT_CONNECT__\", ({ portId, name }, { source }) => {\n    // Only the background should handle incoming connect requests:\n    if (type !== \"background\") return; //\n    // Both share the same portId, but we keep separate\n    // handler queues and wire them via the bus.\n    const backgroundPort = makePort(\"background\", portId, name, source);\n    ports[portId] = backgroundPort;\n\n    // notify background listeners\n    onConnectListeners.forEach((fn) => fn(backgroundPort));\n\n    // send back a CONNECT_ACK so the client can\n    // start listening on its end:\n    bus.emit(\"__PORT_CONNECT_ACK__\", { portId, name }, { to: source });\n  });\n\n  // Clients handle the ACK and finalize their Port object:\n  bus.on(\"__PORT_CONNECT_ACK__\", ({ portId, name }, { source }) => {\n    if (type === \"background\") return; // ignore\n    const p = ports[portId];\n    if (!p) return;\n    p._ready = true;\n    p._drainBuffer();\n  });\n\n  // Any port message travels via \"__PORT_MESSAGE__\"\n  bus.on(\"__PORT_MESSAGE__\", ({ portId, msg }, { source }) => {\n    const p = ports[portId];\n    if (!p) return;\n    p._receive(msg);\n  });\n\n  // Any port disconnect:\n  bus.on(\"__PORT_DISCONNECT__\", ({ portId }, { source }) => {\n    const p = ports[portId];\n    if (!p) return;\n    p._disconnect();\n    delete ports[portId];\n  });\n\n  function makePort(side, portId, name, remoteWindow) {\n    let onMessageHandlers = [];\n    let onDisconnectHandlers = [];\n    let buffer = [];\n    let _ready = side === \"background\";\n    // background ends are always ready\n    // client ends wait for CONNECT_ACK\n\n    function _drainBuffer() {\n      buffer.forEach((m) => _post(m));\n      buffer = [];\n    }\n\n    function _post(msg) {\n      // unidirectional: send from this side, receive on the other\n      bus.emit(\"__PORT_MESSAGE__\", { portId, msg }, { to: remoteWindow });\n    }\n\n    function postMessage(msg) {\n      if (!_ready) {\n        buffer.push(msg);\n      } else {\n        _post(msg);\n      }\n    }\n\n    function _receive(msg) {\n      onMessageHandlers.forEach((fn) => fn(msg));\n    }\n\n    function disconnect() {\n      bus.emit(\"__PORT_DISCONNECT__\", { portId }, { to: remoteWindow });\n      _disconnect();\n      delete ports[portId];\n    }\n\n    function _disconnect() {\n      onDisconnectHandlers.forEach((fn) => fn());\n      onMessageHandlers = [];\n      onDisconnectHandlers = [];\n    }\n\n    return {\n      name,\n      onMessage: {\n        addListener(fn) {\n          onMessageHandlers.push(fn);\n        },\n        removeListener(fn) {\n          onMessageHandlers = onMessageHandlers.filter((x) => x !== fn);\n        },\n      },\n      onDisconnect: {\n        addListener(fn) {\n          onDisconnectHandlers.push(fn);\n        },\n        removeListener(fn) {\n          onDisconnectHandlers = onDisconnectHandlers.filter((x) => x !== fn);\n        },\n      },\n      postMessage,\n      disconnect,\n      _ready, // internal\n      _drainBuffer, // internal\n    };\n  }\n\n  function connect(connectInfo = {}) {\n    if (type === \"background\") {\n      throw new Error(\"Background must use onConnect, not connect()\");\n    }\n    const name = connectInfo.name || \"\";\n    const portId = nextPortId++;\n    // create the client side port\n    // remoteWindow is left undefined here; bus.emit will pick up via { to: page/iframe }\n    const clientPort = makePort(\"client\", portId, name, null);\n    ports[portId] = clientPort;\n\n    // fire the connect event across the bus\n    bus.emit(\"__PORT_CONNECT__\", { portId, name });\n    return clientPort;\n  }\n\n  function onConnect(fn) {\n    if (type !== \"background\") {\n      throw new Error(\"connect event only fires in background\");\n    }\n    onConnectListeners.push(fn);\n  }\n\n  // Finally, wire up the returned runtime object:\n  return {\n    // rpc:\n    sendMessage,\n    onMessage: {\n      addListener(fn) {\n        msgListeners.push(fn);\n      },\n      removeListener(fn) {\n        const i = msgListeners.indexOf(fn);\n        if (i >= 0) msgListeners.splice(i, 1);\n      },\n    },\n\n    // port API:\n    connect,\n    onConnect: {\n      addListener(fn) {\n        onConnect(fn);\n      },\n      removeListener(fn) {\n        const i = onConnectListeners.indexOf(fn);\n        if (i >= 0) onConnectListeners.splice(i, 1);\n      },\n    },\n  };\n}\n\n\n// --- Abstraction Layer: PostMessage Target\n\nlet nextRequestId = 1;\nconst pendingRequests = new Map(); // requestId -> { resolve, reject, timeout }\n\n// Helper function to send postmessage requests to parent window\nfunction sendAbstractionRequest(method, args = []) {\n  return new Promise((resolve, reject) => {\n    const requestId = nextRequestId++;\n\n    // Set up timeout\n    const timeout = setTimeout(() => {\n      pendingRequests.delete(requestId);\n      reject(new Error(`PostMessage request timeout for method: ${method}`));\n    }, 10000); // 10 second timeout\n\n    // Store pending request\n    pendingRequests.set(requestId, { resolve, reject, timeout });\n\n    // Send request to parent window\n    window.parent.postMessage({\n      type: \"abstraction-request\",\n      requestId,\n      method,\n      args,\n    });\n  });\n}\n\n// Listen for responses from parent window\nwindow.addEventListener(\"message\", (event) => {\n  // Only handle messages from same origin for security\n  // if (event.origin !== window.location.origin) {\n  //     return;\n  // }\n\n  const { type, requestId, success, result, error } = event.data;\n\n  if (type === \"abstraction-response\") {\n    const pending = pendingRequests.get(requestId);\n    if (pending) {\n      clearTimeout(pending.timeout);\n      pendingRequests.delete(requestId);\n\n      if (success) {\n        pending.resolve(result);\n      } else {\n        const err = new Error(error.message);\n        err.stack = error.stack;\n        pending.reject(err);\n      }\n    }\n  }\n});\n\nasync function _storageSet(items) {\n  return sendAbstractionRequest(\"_storageSet\", [items]);\n}\n\nasync function _storageGet(keys) {\n  return sendAbstractionRequest(\"_storageGet\", [keys]);\n}\n\nasync function _storageRemove(keysToRemove) {\n  return sendAbstractionRequest(\"_storageRemove\", [keysToRemove]);\n}\n\nasync function _storageClear() {\n  return sendAbstractionRequest(\"_storageClear\");\n}\n\nasync function _fetch(url, options) {\n  return sendAbstractionRequest(\"_fetch\", [url, options]);\n}\n\nfunction _registerMenuCommand(name, func) {\n  // Menu commands from iframes don't make much sense, but we'll pass it through\n  console.warn(\"_registerMenuCommand called from iframe context:\", name);\n  return sendAbstractionRequest(\"_registerMenuCommand\", [\n    name,\n    func.toString(),\n  ]);\n}\n\nfunction _openTab(url) {\n  return sendAbstractionRequest(\"_openTab\", [url]);\n}\n\nasync function _initStorage() {\n  return sendAbstractionRequest(\"_initStorage\");\n}\n\n\n// --- Extension Assets Map & Helper Functions ---\nconst EXTENSION_ASSETS_MAP = {{EXTENSION_ASSETS_MAP}};\n\nfunction _testBlobCSP() {\n  try {\n    // Create a random blob with some simple JavaScript content\n    const code = `console.log(\"Blob CSP test\");`;\n    const blob = new Blob([code], { type: 'application/javascript' });\n    const blobUrl = URL.createObjectURL(blob);\n\n    // Create a script tag to load the blob URL\n    const script = document.createElement('script');\n    script.src = blobUrl;\n\n    // Add an error handler in case the CSP blocks it\n    let blocked = false;\n    script.onerror = () => {\n      blocked = true;\n    };\n\n    // Append the script to the document\n    document.head.appendChild(script);\n\n    // Since CSP blocks are asynchronous, we need to return a promise\n    return new Promise((resolve) => {\n      // Wait briefly to see if the error handler fires\n      setTimeout(() => {\n        resolve(!blocked);\n        // Clean up\n        document.head.removeChild(script);\n        URL.revokeObjectURL(blobUrl);\n      }, 100);\n    });\n  } catch (e) {\n    // If creating or assigning the blob fails synchronously\n    return Promise.resolve(false);\n  }\n}\n\nlet CAN_USE_BLOB_CSP = false;\n\n_testBlobCSP().then((result) => {\n  CAN_USE_BLOB_CSP = result;\n});\n\nfunction _base64ToBlob(base64, mimeType = 'application/octet-stream') {\n  const binary = atob(base64);\n  const len = binary.length;\n  const bytes = new Uint8Array(len);\n  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);\n  return new Blob([bytes], { type: mimeType });\n}\n\nfunction _getMimeTypeFromPath(p) {\n  const ext = (p.split('.').pop() || '').toLowerCase();\n  const map = {\n    html: 'text/html',\n    htm: 'text/html',\n    js: 'text/javascript',\n    css: 'text/css',\n    json: 'application/json',\n    png: 'image/png',\n    jpg: 'image/jpeg',\n    jpeg: 'image/jpeg',\n    gif: 'image/gif',\n    svg: 'image/svg+xml',\n    webp: 'image/webp',\n    ico: 'image/x-icon',\n    woff: 'font/woff',\n    woff2: 'font/woff2',\n    ttf: 'font/ttf',\n    otf: 'font/otf',\n    eot: 'application/vnd.ms-fontobject'\n  };\n  return map[ext] || 'application/octet-stream';\n}\n\nfunction _isTextAsset(ext) {\n  return ['html','htm','js','css','json','svg','txt','xml'].includes(ext);\n}\n\nfunction _createAssetUrl(path = '') {\n  if (path.startsWith('/')) path = path.slice(1);\n  const assetData = EXTENSION_ASSETS_MAP[path];\n  if (typeof assetData === 'undefined') {\n    console.warn('[runtime.getURL] Asset not found for', path);\n    return path;\n  }\n\n  const mime = _getMimeTypeFromPath(path);\n  const ext = (path.split('.').pop() || '').toLowerCase();\n\n  if (CAN_USE_BLOB_CSP) {\n    // For web accessible resources, handle different content types appropriately\n    let blob;\n    if (_isTextAsset(ext)) {\n      // For text assets (including processed CSS with inlined assets),\n      // the content is already processed and should be used as-is\n      blob = new Blob([assetData], { type: mime });\n    } else {\n      // For binary assets, the content is base64 encoded\n      blob = _base64ToBlob(assetData, mime);\n    }\n\n    return URL.createObjectURL(blob);\n  } else {\n    if (_isTextAsset(ext)) {\n      return `data:${mime};base64,${btoa(assetData)}`;\n    } else {\n      return `data:${mime};base64,${assetData}`;\n    }\n  }\n}\n\n// -- Polyfill Implementation\nfunction buildPolyfill({ isBackground = false, isOtherPage = false } = {}) {\n  // Generate a unique context ID for this polyfill instance\n  const contextType = isBackground\n    ? \"background\"\n    : isOtherPage\n    ? \"options\"\n    : \"content\";\n  const contextId = `${contextType}_${Math.random()\n    .toString(36)\n    .substring(2, 15)}`;\n\n  const IS_IFRAME = \"true\" === \"true\";\n  const BUS = createEventBus(\"json-formatter\", IS_IFRAME ? \"iframe\" : \"page\");\n  const RUNTIME = createRuntime(isBackground ? \"background\" : \"tab\", BUS);\n\n  // TODO: Stub\n  const storageChangeListeners = new Set();\n  function broadcastStorageChange(changes, areaName) {\n    storageChangeListeners.forEach((listener) => {\n      listener(changes, areaName);\n    });\n  }\n\n  // --- Chrome polyfill\n  let chrome = {\n    extension: {\n      isAllowedIncognitoAccess: () => Promise.resolve(true),\n      sendMessage: (...args) => _messagingHandler.sendMessage(...args),\n    },\n    permissions: {\n      request: (permissions, callback) => {\n        callback(permissions);\n      },\n      contains: (permissions) => {\n        // TODO: Shim\n        return true;\n      },\n    },\n    i18n: {\n      getMessage: (key) => {\n        if (typeof LOCALE_KEYS !== \"undefined\" && LOCALE_KEYS[key]) {\n          return LOCALE_KEYS[key].message;\n        }\n        return key;\n      },\n    },\n    runtime: {\n      ...RUNTIME,\n      getManifest: () => {\n        // The manifest object will be injected into the scope where buildPolyfill is called\n        if (typeof INJECTED_MANIFEST !== \"undefined\") {\n          return JSON.parse(JSON.stringify(INJECTED_MANIFEST)); // Return deep copy\n        }\n        console.warn(\n          \"INJECTED_MANIFEST not found for chrome.runtime.getManifest\"\n        );\n        return { name: \"Unknown\", version: \"0.0\", manifest_version: 2 };\n      },\n      getURL: (path) => {\n        // Integrated implementation using the asset helper functions\n        if (!path) return \"\";\n        if (path.startsWith(\"/\")) {\n          path = path.substring(1);\n        }\n\n        // Use the integrated asset creation function\n        if (typeof _createAssetUrl === \"function\") {\n          return _createAssetUrl(path);\n        }\n\n        console.warn(\n          `chrome.runtime.getURL fallback for '${path}'. Assets may not be available.`\n        );\n        // Attempt a relative path resolution (highly context-dependent and likely wrong)\n        try {\n          if (window.location.protocol.startsWith(\"http\")) {\n            return new URL(path, window.location.href).toString();\n          }\n        } catch (e) {\n          /* ignore error, fallback */\n        }\n        return path;\n      },\n      connect: (extensionIdOrConnectInfo, connectInfo) => {\n        // Enhanced connect implementation using the unified message bus\n        const getName = () => {\n          if (typeof extensionIdOrConnectInfo === \"string\") {\n            return connectInfo && connectInfo.name ? connectInfo.name : \"\";\n          }\n          return extensionIdOrConnectInfo && extensionIdOrConnectInfo.name\n            ? extensionIdOrConnectInfo.name\n            : \"\";\n        };\n\n        return internalMessageBus.createPort(contextId, null, getName());\n      },\n      onConnect: {\n        addListener: function (callback) {\n          internalMessageBus.addConnectListener(contextId, callback);\n        },\n        removeListener: function (callback) {\n          internalMessageBus.removeConnectListener(contextId, callback);\n        },\n      },\n      id: \"polyfilled-extension-\" + Math.random().toString(36).substring(2, 15),\n      lastError: null,\n      getPlatformInfo: async () => {\n        // Basic platform detection\n        const platform = {\n          os: \"unknown\",\n          arch: \"unknown\",\n          nacl_arch: \"unknown\",\n        };\n\n        if (typeof navigator !== \"undefined\") {\n          const userAgent = navigator.userAgent.toLowerCase();\n          if (userAgent.includes(\"mac\")) platform.os = \"mac\";\n          else if (userAgent.includes(\"win\")) platform.os = \"win\";\n          else if (userAgent.includes(\"linux\")) platform.os = \"linux\";\n          else if (userAgent.includes(\"android\")) platform.os = \"android\";\n          else if (userAgent.includes(\"ios\")) platform.os = \"ios\";\n\n          // Basic architecture detection\n          if (userAgent.includes(\"x86_64\") || userAgent.includes(\"amd64\")) {\n            platform.arch = \"x86-64\";\n          } else if (userAgent.includes(\"i386\") || userAgent.includes(\"i686\")) {\n            platform.arch = \"x86-32\";\n          } else if (userAgent.includes(\"arm\")) {\n            platform.arch = \"arm\";\n          }\n        }\n\n        return platform;\n      },\n      getBrowserInfo: async () => {\n        // Basic browser detection\n        const info = {\n          name: \"unknown\",\n          version: \"unknown\",\n          buildID: \"unknown\",\n        };\n\n        if (typeof navigator !== \"undefined\") {\n          const userAgent = navigator.userAgent;\n          if (userAgent.includes(\"Chrome\")) {\n            info.name = \"Chrome\";\n            const match = userAgent.match(/Chrome\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          } else if (userAgent.includes(\"Firefox\")) {\n            info.name = \"Firefox\";\n            const match = userAgent.match(/Firefox\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          } else if (userAgent.includes(\"Safari\")) {\n            info.name = \"Safari\";\n            const match = userAgent.match(/Version\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          }\n        }\n\n        return info;\n      },\n    },\n    storage: {\n      local: {\n        // Uses functions from the Abstraction Layer with unified messaging for change events\n        get: function (keys, callback) {\n          if (typeof _storageGet !== \"function\")\n            throw new Error(\"_storageGet not defined\");\n\n          const promise = _storageGet(keys);\n\n          // Support callback-based syntax\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.get callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.get error:\", error);\n                callback({});\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        set: function (items, callback) {\n          if (typeof _storageSet !== \"function\")\n            throw new Error(\"_storageSet not defined\");\n\n          const promise = _storageSet(items).then((result) => {\n            // Broadcast storage changes to all contexts\n            broadcastStorageChange(items, \"local\");\n            return result;\n          });\n\n          // Support callback-based syntax\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.set callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.set error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        remove: function (keys, callback) {\n          if (typeof _storageRemove !== \"function\")\n            throw new Error(\"_storageRemove not defined\");\n\n          const promise = _storageRemove(keys).then((result) => {\n            // Create changes object for removed keys\n            const changes = {};\n            const keyList = Array.isArray(keys) ? keys : [keys];\n            keyList.forEach((key) => {\n              changes[key] = { oldValue: undefined, newValue: undefined };\n            });\n            broadcastStorageChange(changes, \"local\");\n            return result;\n          });\n\n          // Support callback-based syntax\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.remove callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.remove error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        clear: function (callback) {\n          if (typeof _storageClear !== \"function\")\n            throw new Error(\"_storageClear not defined\");\n\n          const promise = _storageClear().then((result) => {\n            // Broadcast clear event\n            broadcastStorageChange({}, \"local\");\n            return result;\n          });\n\n          // Support callback-based syntax\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.clear callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.clear error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        onChanged: {\n          addListener: (callback) => {\n            storageChangeListeners.add(callback);\n          },\n          removeListener: (callback) => {\n            storageChangeListeners.delete(callback);\n          },\n        },\n      },\n      // Sync/Managed are simple aliases or stubs for Phase 1\n      sync: {\n        get: function (keys, callback) {\n          console.warn(\"chrome.storage.sync polyfill maps to local\");\n          return chrome.storage.local.get(keys, callback);\n        },\n        set: function (items, callback) {\n          console.warn(\"chrome.storage.sync polyfill maps to local\");\n\n          // Create a promise that handles sync-specific broadcasting\n          const promise = chrome.storage.local.set(items).then((result) => {\n            // Sync storage changes also broadcast with 'sync' area name\n            broadcastStorageChange(items, \"sync\");\n            return result;\n          });\n\n          // Support callback-based syntax\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.sync.set callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.sync.set error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        remove: function (keys, callback) {\n          console.warn(\"chrome.storage.sync polyfill maps to local\");\n\n          // Create a promise that handles sync-specific broadcasting\n          const promise = chrome.storage.local.remove(keys).then((result) => {\n            // Create changes object for removed keys\n            const changes = {};\n            const keyList = Array.isArray(keys) ? keys : [keys];\n            keyList.forEach((key) => {\n              changes[key] = { oldValue: undefined, newValue: undefined };\n            });\n            broadcastStorageChange(changes, \"sync\");\n            return result;\n          });\n\n          // Support callback-based syntax\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.sync.remove callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.sync.remove error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        clear: function (callback) {\n          console.warn(\"chrome.storage.sync polyfill maps to local\");\n\n          // Create a promise that handles sync-specific broadcasting\n          const promise = chrome.storage.local.clear().then((result) => {\n            broadcastStorageChange({}, \"sync\");\n            return result;\n          });\n\n          // Support callback-based syntax\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.sync.clear callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.sync.clear error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        onChanged: {\n          addListener: (callback) => {\n            storageChangeListeners.add(callback);\n          },\n          removeListener: (callback) => {\n            storageChangeListeners.delete(callback);\n          },\n        },\n      },\n      onChanged: {\n        addListener: (callback) => {\n          storageChangeListeners.add(callback);\n        },\n        removeListener: (callback) => {\n          storageChangeListeners.delete(callback);\n        },\n      },\n      managed: {\n        get: function (keys, callback) {\n          console.warn(\"chrome.storage.managed polyfill is read-only empty.\");\n\n          const promise = Promise.resolve({});\n\n          // Support callback-based syntax\n          if (typeof callback === \"function\") {\n            promise.then((result) => {\n              try {\n                callback(result);\n              } catch (e) {\n                console.error(\"Error in storage.managed.get callback:\", e);\n              }\n            });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n      },\n    },\n    tabs: {\n      query: async (queryInfo) => {\n        console.warn(\n          \"chrome.tabs.query polyfill only returns current tab info.\"\n        );\n        const dummyId = Math.floor(Math.random() * 1000) + 1;\n        return [\n          {\n            id: dummyId,\n            url: window.location.href,\n            active: true,\n            windowId: 1,\n            status: \"complete\",\n          },\n        ];\n      },\n      create: async ({ url }) => {\n        console.log(`[Polyfill tabs.create] URL: ${url}`);\n        if (typeof _openTab !== \"function\")\n          throw new Error(\"_openTab not defined\");\n        _openTab(url);\n        const dummyId = Math.floor(Math.random() * 1000) + 1001;\n        return Promise.resolve({\n          id: dummyId,\n          url: url,\n          active: true,\n          windowId: 1,\n        });\n      },\n      sendMessage: async (tabId, message) => {\n        console.warn(\n          `chrome.tabs.sendMessage polyfill (to tab ${tabId}) redirects to runtime.sendMessage (current context).`\n        );\n        return chrome.runtime.sendMessage(message);\n      },\n    },\n    notifications: {\n      create: async (notificationId, options) => {\n        try {\n          // Handle both create(options) and create(id, options) signatures\n          let id = notificationId;\n          let notificationOptions = options;\n\n          if (typeof notificationId === \"object\" && notificationId !== null) {\n            // Single parameter: create(options)\n            notificationOptions = notificationId;\n            id = \"notification_\" + Math.random().toString(36).substring(2, 15);\n          } else if (typeof notificationId === \"string\" && options) {\n            // Two parameters: create(id, options)\n            id = notificationId;\n            notificationOptions = options;\n          } else {\n            throw new Error(\"Invalid parameters for notifications.create\");\n          }\n\n          if (!notificationOptions || typeof notificationOptions !== \"object\") {\n            throw new Error(\"Notification options must be an object\");\n          }\n\n          const {\n            title,\n            message,\n            iconUrl,\n            type = \"basic\",\n          } = notificationOptions;\n\n          if (!title || !message) {\n            throw new Error(\"Notification must have title and message\");\n          }\n\n          // Use native browser notifications if available\n          if (\"Notification\" in window) {\n            // Check permission\n            if (Notification.permission === \"granted\") {\n              const notification = new Notification(title, {\n                body: message,\n                icon: iconUrl,\n                tag: id,\n              });\n\n              console.log(`[Notifications] Created notification: ${id}`);\n              return id;\n            } else if (Notification.permission === \"default\") {\n              // Request permission\n              const permission = await Notification.requestPermission();\n              if (permission === \"granted\") {\n                const notification = new Notification(title, {\n                  body: message,\n                  icon: iconUrl,\n                  tag: id,\n                });\n                console.log(\n                  `[Notifications] Created notification after permission: ${id}`\n                );\n                return id;\n              } else {\n                console.warn(\n                  \"[Notifications] Permission denied for notifications\"\n                );\n                return id; // Return ID even if notification wasn't shown\n              }\n            } else {\n              console.warn(\"[Notifications] Notifications are blocked\");\n              return id;\n            }\n          } else {\n            console.warn(\n              \"[Notifications] Native notifications not supported, using console fallback\"\n            );\n            console.log(`[Notification] ${title}: ${message}`);\n            return id;\n          }\n        } catch (error) {\n          console.error(\n            \"[Notifications] Error creating notification:\",\n            error.message\n          );\n          throw error;\n        }\n      },\n      clear: async (notificationId) => {\n        console.log(`[Notifications] Clear notification: ${notificationId}`);\n        // For native notifications, there's no direct way to clear by ID\n        // This is a limitation of the Web Notifications API\n        return true;\n      },\n      getAll: async () => {\n        console.warn(\"[Notifications] getAll not fully supported in polyfill\");\n        return {};\n      },\n      getPermissionLevel: async () => {\n        if (\"Notification\" in window) {\n          const permission = Notification.permission;\n          return { level: permission === \"granted\" ? \"granted\" : \"denied\" };\n        }\n        return { level: \"denied\" };\n      },\n    },\n    contextMenus: {\n      create: (createProperties, callback) => {\n        try {\n          if (!createProperties || typeof createProperties !== \"object\") {\n            throw new Error(\"Context menu create properties must be an object\");\n          }\n\n          const { id, title, contexts = [\"page\"], onclick } = createProperties;\n          const menuId =\n            id || `menu_${Math.random().toString(36).substring(2, 15)}`;\n\n          if (!title || typeof title !== \"string\") {\n            throw new Error(\"Context menu must have a title\");\n          }\n\n          // Store menu items for potential use\n          if (!window._polyfillContextMenus) {\n            window._polyfillContextMenus = new Map();\n          }\n\n          window._polyfillContextMenus.set(menuId, {\n            id: menuId,\n            title,\n            contexts,\n            onclick,\n            enabled: createProperties.enabled !== false,\n          });\n\n          console.log(\n            `[ContextMenus] Created context menu item: ${title} (${menuId})`\n          );\n\n          // Try to register a menu command as fallback\n          if (typeof _registerMenuCommand === \"function\") {\n            try {\n              _registerMenuCommand(\n                title,\n                onclick ||\n                  (() => {\n                    console.log(`Context menu clicked: ${title}`);\n                  })\n              );\n            } catch (e) {\n              console.warn(\n                \"[ContextMenus] Failed to register as menu command:\",\n                e.message\n              );\n            }\n          }\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n\n          return menuId;\n        } catch (error) {\n          console.error(\n            \"[ContextMenus] Error creating context menu:\",\n            error.message\n          );\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n          throw error;\n        }\n      },\n      update: (id, updateProperties, callback) => {\n        try {\n          if (\n            !window._polyfillContextMenus ||\n            !window._polyfillContextMenus.has(id)\n          ) {\n            throw new Error(`Context menu item not found: ${id}`);\n          }\n\n          const menuItem = window._polyfillContextMenus.get(id);\n          Object.assign(menuItem, updateProperties);\n\n          console.log(`[ContextMenus] Updated context menu item: ${id}`);\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          console.error(\n            \"[ContextMenus] Error updating context menu:\",\n            error.message\n          );\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      remove: (menuItemId, callback) => {\n        try {\n          if (\n            window._polyfillContextMenus &&\n            window._polyfillContextMenus.has(menuItemId)\n          ) {\n            window._polyfillContextMenus.delete(menuItemId);\n            console.log(\n              `[ContextMenus] Removed context menu item: ${menuItemId}`\n            );\n          } else {\n            console.warn(\n              `[ContextMenus] Context menu item not found for removal: ${menuItemId}`\n            );\n          }\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          console.error(\n            \"[ContextMenus] Error removing context menu:\",\n            error.message\n          );\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      removeAll: (callback) => {\n        try {\n          if (window._polyfillContextMenus) {\n            const count = window._polyfillContextMenus.size;\n            window._polyfillContextMenus.clear();\n            console.log(\n              `[ContextMenus] Removed all ${count} context menu items`\n            );\n          }\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          console.error(\n            \"[ContextMenus] Error removing all context menus:\",\n            error.message\n          );\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      onClicked: {\n        addListener: (callback) => {\n          if (!window._polyfillContextMenuListeners) {\n            window._polyfillContextMenuListeners = new Set();\n          }\n          window._polyfillContextMenuListeners.add(callback);\n          console.log(\"[ContextMenus] Added click listener\");\n        },\n        removeListener: (callback) => {\n          if (window._polyfillContextMenuListeners) {\n            window._polyfillContextMenuListeners.delete(callback);\n            console.log(\"[ContextMenus] Removed click listener\");\n          }\n        },\n      },\n    },\n  };\n\n  const loggingProxyHandler = (_key) => ({\n    get(target, key, receiver) {\n      console.log(`[${contextType}] [CHROME - ${_key}] Getting ${key}`);\n      return Reflect.get(target, key, receiver);\n    },\n    set(target, key, value, receiver) {\n      console.log(\n        `[${contextType}] [CHROME - ${_key}] Setting ${key} to ${value}`\n      );\n      return Reflect.set(target, key, value, receiver);\n    },\n    has(target, key) {\n      console.log(\n        `[${contextType}] [CHROME - ${_key}] Checking if ${key} exists`\n      );\n      return Reflect.has(target, key);\n    },\n  });\n  chrome = Object.fromEntries(\n    Object.entries(chrome).map(([key, value]) => [\n      key,\n      new Proxy(value, loggingProxyHandler(key)),\n    ])\n  );\n\n  // Alias browser to chrome for common Firefox pattern\n  const browser = new Proxy(chrome, loggingProxyHandler);\n\n  const oldGlobalThis = globalThis;\n  const oldWindow = window;\n  const oldSelf = self;\n  const oldGlobal = globalThis;\n  const __globalsStorage = {};\n\n  const TO_MODIFY = [oldGlobalThis, oldWindow, oldSelf, oldGlobal];\n  const set = (k, v) => {\n    __globalsStorage[k] = v;\n    TO_MODIFY.forEach((target) => {\n      target[k] = v;\n    });\n  };\n  const proxyHandler = {\n    get(target, key, receiver) {\n      return __globalsStorage[key] || Reflect.get(target, key, receiver);\n    },\n    set(target, key, value, receiver) {\n      console.log(`[${contextType}] Setting ${key} to ${value}`);\n      set(key, value);\n      return Reflect.set(target, key, value, receiver);\n    },\n    has(target, key) {\n      return key in __globalsStorage || key in target;\n    },\n    getOwnPropertyDescriptor(target, key) {\n      if (key in __globalsStorage) {\n        return {\n          configurable: true,\n          enumerable: true,\n          writable: true,\n          value: __globalsStorage[key],\n        };\n      }\n      // fall back to the real globalThis\n      const desc = Reflect.getOwnPropertyDescriptor(target, key);\n      // ensure it's configurable so the with‑scope binding logic can override it\n      if (desc && !desc.configurable) {\n        desc.configurable = true;\n      }\n      return desc;\n    },\n\n    defineProperty(target, key, descriptor) {\n      // Normalize descriptor to avoid mixed accessor & data attributes\n      const hasAccessor = \"get\" in descriptor || \"set\" in descriptor;\n\n      if (hasAccessor) {\n        // Build a clean descriptor without value/writable when accessors present\n        const normalized = {\n          configurable:\n            \"configurable\" in descriptor ? descriptor.configurable : true,\n          enumerable:\n            \"enumerable\" in descriptor ? descriptor.enumerable : false,\n        };\n        if (\"get\" in descriptor) normalized.get = descriptor.get;\n        if (\"set\" in descriptor) normalized.set = descriptor.set;\n\n        // Store accessor references for inspection but avoid breaking invariants\n        set(key, {\n          get: descriptor.get,\n          set: descriptor.set,\n        });\n\n        return Reflect.defineProperty(target, key, normalized);\n      }\n\n      // Data descriptor path\n      set(key, descriptor.value);\n      return Reflect.defineProperty(target, key, descriptor);\n    },\n  };\n\n  // Create proxies once proxyHandler is defined\n  const proxyWindow = new Proxy(oldWindow, proxyHandler);\n  const proxyGlobalThis = new Proxy(oldGlobalThis, proxyHandler);\n  const proxyGlobal = new Proxy(oldGlobal, proxyHandler);\n  const proxySelf = new Proxy(oldSelf, proxyHandler);\n\n  // Seed storage with core globals so lookups succeed inside `with` blocks\n  Object.assign(__globalsStorage, {\n    chrome,\n    browser,\n    window: proxyWindow,\n    globalThis: proxyGlobalThis,\n    global: proxyGlobal,\n    self: proxySelf,\n  });\n\n  const __globals = {\n    chrome,\n    browser,\n    window: proxyWindow,\n    globalThis: proxyGlobalThis,\n    global: proxyGlobal,\n    self: proxySelf,\n    __globals: __globalsStorage,\n  };\n\n  // Store context info for debugging\n  __globalsStorage.contextId = contextId;\n  __globalsStorage.contextType = contextType;\n  __globalsStorage.module = undefined;\n  __globalsStorage.amd = undefined;\n  __globalsStorage.define = undefined;\n\n  return __globals;\n}\n\n\n// Export the buildPolyfill function for use\nif (typeof window !== 'undefined') {\n    window.buildPolyfill = buildPolyfill;\n}\n"
    let newMap = JSON.parse(JSON.stringify(EXTENSION_ASSETS_MAP));
    delete newMap[OPTIONS_PAGE_PATH];
    return `
        ${polyfillString.replaceAll("{{EXTENSION_ASSETS_MAP}}", `atob("${btoa(EXTENSION_ASSETS_MAP)}")`)}

        // Initialize the polyfill context for options page
        const polyfillCtx = buildPolyfill({ isOtherPage: true });
        const APPLY_TO = [window, self, globalThis];
        for (const obj of APPLY_TO) {
            obj.chrome = polyfillCtx.chrome;
            obj.browser = polyfillCtx.browser;
            obj.INJECTED_MANIFEST = ${JSON.stringify(INJECTED_MANIFEST)};
        }
    `;
}

async function main() {
    console.log(`[${SCRIPT_NAME}] Initializing...`);

    // A. Initialize Storage (if needed by abstraction layer)
    if (typeof _initStorage === 'function') {
        try {
            await _initStorage();
            console.log(`[${SCRIPT_NAME}] Storage initialized.`);
        } catch (e) {
            console.error('Error during storage initialization:', e);
            // Decide whether to proceed if storage fails
        }
    }

    // A2. Initialize background scripts first (they should always run)
    console.log(`[${SCRIPT_NAME}] Starting background scripts...`);
    // Note: Background scripts are auto-executed before this main() function runs
    // This is just a notification that they should have started

    // B. Determine if any content script matches the current URL
    const currentUrl = window.location.href;
    let shouldRunAnyScript = false;
    console.log(`[${SCRIPT_NAME}] Checking URL: ${currentUrl}`);

    if (CONTENT_SCRIPT_CONFIGS_FOR_MATCHING && CONTENT_SCRIPT_CONFIGS_FOR_MATCHING.length > 0) {
        for (const config of CONTENT_SCRIPT_CONFIGS_FOR_MATCHING) {
            if (config.matches && config.matches.some(pattern => {
                try {
                    // Use the injected utility function
                    const regex = convertMatchPatternToRegExp(pattern);
                    if (regex.test(currentUrl)) {
                       // console.log(`[${SCRIPT_NAME}] URL matched pattern: ${pattern}`); // Verbose logging
                       return true; // Found a matching pattern
                    }
                    return false;
                } catch (e) {
                    console.error(`[${SCRIPT_NAME}] Error testing match pattern "${pattern}":`, e);
                    return false;
                }
            })) {
                shouldRunAnyScript = true;
                console.log(`[${SCRIPT_NAME}] URL match found via config:`, config);
                break; // Found a matching config, no need to check further configs
            }
        }
    } else {
        console.log(`[${SCRIPT_NAME}] No content script configurations found in manifest data.`);
    }


    if (shouldRunAnyScript) {
        // C. Build polyfill for content script context
        // Only build polyfill if we actually need to run scripts
        let polyfillContext;
        try {
            // Content script context
            polyfillContext = buildPolyfill({ isBackground: false });
        } catch (e) {
            console.error(`[${SCRIPT_NAME}] Failed to build polyfill:`, e);
            return; // Cannot proceed without polyfill
        }

        console.log(`[${SCRIPT_NAME}] Polyfill built. Executing combined script logic...`);
        // Note: runtime.getURL is now integrated into the polyfill itself
        // D. Execute the combined logic
        // Pass the polyfill and CSS data to the function
        // async function executeAllScripts({chrome, browser, global, window, globalThis, self, __globals}, extensionCssData) {
        await executeAllScripts.call(polyfillContext.globalThis, polyfillContext, extensionCssData);

    } else {
        console.log(`[${SCRIPT_NAME}] No matching content script patterns for this URL. No scripts will be executed.`);
    }

    // E. Options Page Handling - Register menu command if available
    if (OPTIONS_PAGE_PATH) {
        // Register GM menu command if available
        if (typeof _registerMenuCommand === 'function') {
            try { 
                _registerMenuCommand('Open Options', openOptionsPage); 
                console.log(`[${SCRIPT_NAME}] Options menu command registered.`);
            } catch(e) { 
                console.error('Failed to register menu command', e); 
            }
        }
    }

    // F. Popup Page Handling - Register menu command if available
    if (POPUP_PAGE_PATH) {
        // Register GM menu command if available
        if (typeof _registerMenuCommand === 'function') {
            try { 
                _registerMenuCommand('Open Popup', openPopupPage); 
                console.log(`[${SCRIPT_NAME}] Popup menu command registered.`);
            } catch(e) { 
                console.error('Failed to register popup menu command', e); 
            }
        }
    }

    console.log(`[${SCRIPT_NAME}] Initialization sequence complete.`);

}

main().catch(e => console.error(`[${SCRIPT_NAME}] Error during script initialization:`, e));

try {
    const fnKey = 'OPEN_OPTIONS_PAGE_' + String(SCRIPT_NAME).replace(/\s+/g, '_');
    window[fnKey] = openOptionsPage;
} catch(e) {}

try {
    const fnKey = 'OPEN_POPUP_PAGE_' + String(SCRIPT_NAME).replace(/\s+/g, '_');
    window[fnKey] = openPopupPage;
} catch(e) {}


})();
  // #endregion
  // #endregion
    // #endregion