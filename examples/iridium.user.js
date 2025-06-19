// ==UserScript==
// @name        Iridium for YouTube
// @version     2.1.2
// @description Take control of YouTube and boost your user experience with Iridium
// @namespace   iridium-for-youtube
// @author      Converter Script
// @match       *://www.youtube.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABSBJREFUeNrUWktsG0UYnsnaUXjGVZS0gEQj0UO5IKuq1F4A3yIuODcOSDQ5IK41NyQk8AGJW+wrQmoi7pDcKJd1b6lASrigSCDFEq/KLY1bKSU0sYfvX8+uZ8czs7bjV1b6NLNee/f/Zr7/MbNmzHIIJnxgDciws3g0OQhwIUDgAP2VM0fgaVr4gDhORdjBee7MEDh8VviAIDx5poV/ZwJ8ByxOip3cdqE+K3w0wYhzIb8s2sBRBErPH/L6RBKozQsfhloJSFSJyOxjvj5xBP58GQRoBuzGq6jgu8VzB7wyMQSqF1sS4l0QmGpG/XUiMvcPr46dwK+XeidALVDHTcvz9/nnYyXwy+txJ04ioJEgVHFeWLjPN8dC4Oc3DARaKZpNUT80WPYNBJjXDK5ViMj5Gt8dKYEfr8ajkColG4EA9FlDI9KQ/tEiMtCwO2W7cJyO4+m00levpbTvaucn8rzhsZXmFNu/d17cHMkM3Hmr7cQmR1Ylo0tHHflQSjQrXiP6rIqZWl2onT7splwz4EpiMGIXbQbtookAGYoRD/pNMpy3zgm4tgj4tQVRgfxW5x/0H3ZPQ+AR2i0iAOQlmWi0Q+OJiOCR4UE/QoPlPMb2H8yJEn5fnHvYu3907QMOVIEytH4bOFJ94ETr29BIsZsgtP/wXO9lu5VA6LSq8yZgWxLZVo2PGZtWoH7uBW2m6bFbILHz6MXuy3anhFxZ2JK8jiCV22jvYkTzJC+haJ98oRnKh7WlxFi7BZcs7uk/fkFsQo6F5w7d/jFQAorj1tFu4Pwy2iW0mZj2HQSU0LiMey9jHVLE/Uoz/5n9oysn7jBeT14SquPKUd9Dfw/G5YBrwIzNaMOiPHzeZ3jejeO0KKaPO8v2/ggkxH5DxKkA28ASkNUJxEZfGJMThepbJ564gfsWOWvnj4ES6DBeap9anB8BW8Bd3HaJjIplVGGdARU5PCcnhKCZICLVgRBQY39gvOK0nq59zu7hthtoLwdEOMvoRKxVr5QunrFC/iGYKKdcYVQtI2IFnK59aqcU7RsMl4Nq1r1S7UawDZzX6tOzeopCLgIO7ZsizQWThFQyLHnhtA57EJ0SJNQtgSTjpeEUgcjwbEdFaZNNM248KtoKGT79pA8njkKnFkI9k/bbjhuCMus1ItGL3httAnU8i1Z3/YfRmOFtZ4qM17XPWsmKMnEeZ52OytyaD/VOI94QrPTq76dMZKbkpRqvyYcyb14ScCarSPPNDgKbeGbh0l6/pcR03JlMBAzGk87fBq5bV1DJWzO7ZHj2p+4WO/Ywmk5OXqrx6F+Xxs9YM6xb73VaE+Tu8NLAFjQ2AuFSURq+COSpYGNagWbMsGa9l2BJcemH3hc0PRHQirZZtO9RxdlNgWaRC4XF1Xe/HdKS0kZAzkLWkayS9E6bXqsffDPkRb2NgClhWcNk3HiK5+UPvx7ctmNPBMKiLaw01WRl3KSJO+o64nmhUBrsxlZXBPSiLUxa4crKVQbjdxU8pfDpF8PZWnTmAW6J/XqFadF8sLn75SfD3dxNngGH9k3bfKRzoAyU1j4e/usnNwEt9juNl2UuRzz/6qPRveBwZmJVOkanZbF4Xtx4f/SvmJwzEEtemtOGYZF0vrU8vpd8XREI5aM6LZevWb9/Z7yvWa0ETtLtml+TTVDm+m+OTuf9zUCqXbBJ42k7vbBzZfQ67+t46S/hv/KHEBer4uC13wb7VmUkx3xN+Bf+FmsgMdF/t/lfgAEAeu5nx8gUITUAAAAASUVORK5CYII=
// @run-at      document-start
// ==/UserScript==

console.log("Script start:",performance.now());const e=!0,t=e=>e,o="passthrough";let s,c={createHTML:t,createScript:t,createScriptURL:t},i=!1;const r=()=>{try{void 0!==window.isSecureContext&&window.isSecureContext&&window.trustedTypes&&window.trustedTypes.createPolicy&&(i=!0,trustedTypes.defaultPolicy?(l("TT Default Policy exists"),c=window.trustedTypes.createPolicy("default",c),s=trustedTypes.defaultPolicy,l(`Created custom passthrough policy, in case the default policy is too restrictive: Use Policy '${o}' in var 'TTP':`,c)):s=c=window.trustedTypes.createPolicy("default",c),l("Trusted-Type Policies: TTP:",c,"TTP_default:",s))}catch(e){l(e)}},l=(...e)=>{console.log(...e)};r();

(function() {
    // #region Logging
	
	  const SCRIPT_NAME = "Iridium for YouTube";
	  const _log = (...args) => {};
	  const _warn = (...args) => console.warn(`[${typeof SCRIPT_NAME === 'string' ? SCRIPT_NAME : '[USERSCRIPT_CONVERTED]'}]`, ...args);
	  const _error = (...args) => console.error(`[${typeof SCRIPT_NAME === 'string' ? SCRIPT_NAME : '[USERSCRIPT_CONVERTED]'}]`, ...args);
	  
    // #endregion
    // #region Unified Polyfill
	
// #region Messaging implementation
		
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
		        fn(payload, { origin: location.origin, source: window })
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
		            _error(e);
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
		    // Background should be able to send message to itself
		    // if (type === "background") {
		    //   throw new Error("Background cannot sendMessage to itself");
		    // }
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
		        { to: remoteWindow }
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
		        fn(envelope.msg, { id: portId, tab: { id: source } })
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
		
		
// #region Abstraction layer Handle postmesage for
			(function () {
			  const pendingRequests = new Map(); // requestId -> { resolve, reject, timeout }
			  let nextRequestId = 1;
			
			  window.addEventListener("message", async (event) => {
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
			          case "_cookieList":
			            result = await _cookieList(args[0]);
			            break;
			          case "_cookieSet":
			            result = await _cookieSet(args[0]);
			            break;
			          case "_cookieDelete":
			            result = await _cookieDelete(args[0]);
			            break;
			          case "_fetch":
			            result = await _fetch(args[0], args[1]);
			            break;
			          case "_registerMenuCommand":
			            result = _registerMenuCommand(args[0], args[1]);
			            break;
			          case "_openTab":
			            result = _openTab(args[0], args[1]);
			            break;
			          case "_initStorage":
			            result = await _initStorage();
			            break;
			          default:
			            throw new Error(`Unknown abstraction method: ${method}`);
			        }
			
			        event.source.postMessage({
			          type: "abstraction-response",
			          requestId,
			          success: true,
			          result,
			        });
			      } catch (error) {
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
			
			  _log("[PostMessage Handler] Abstraction layer message handler initialized");
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
			    _error("GM_setValue error:", e);
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
			      _error("_storageGet error: Invalid keys format", keys);
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
			    _error("GM_getValue/GM_listValues error:", e);
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
			      _error("_storageRemove error: Invalid keys format", keysToRemove);
			      return Promise.reject(new Error("Invalid keys format for remove"));
			    }
			
			    for (const key of keyList) {
			      await GM_deleteValue(key);
			    }
			    return Promise.resolve();
			  } catch (e) {
			    _error("GM_deleteValue error:", e);
			    return Promise.reject(e);
			  }
			}
			
			async function _storageClear() {
			  try {
			    const keys = await GM_listValues();
			    await Promise.all(keys.map((key) => GM_deleteValue(key)));
			    return Promise.resolve();
			  } catch (e) {
			    _error("GM_listValues/GM_deleteValue error during clear:", e);
			    return Promise.reject(e);
			  }
			}
			
			async function _cookieList(details) {
			  return new Promise((resolve, reject) => {
			    if (typeof GM_cookie === "undefined" || !GM_cookie.list) {
			      return reject(new Error("GM_cookie.list is not available."));
			    }
			    GM_cookie.list(details, (cookies, error) => {
			      if (error) {
			        return reject(new Error(error));
			      }
			      resolve(cookies);
			    });
			  });
			}
			
			async function _cookieSet(details) {
			  return new Promise((resolve, reject) => {
			    if (typeof GM_cookie === "undefined" || !GM_cookie.set) {
			      return reject(new Error("GM_cookie.set is not available."));
			    }
			    GM_cookie.set(details, (error) => {
			      if (error) {
			        return reject(new Error(error));
			      }
			      resolve();
			    });
			  });
			}
			
			async function _cookieDelete(details) {
			  return new Promise((resolve, reject) => {
			    if (typeof GM_cookie === "undefined" || !GM_cookie.delete) {
			      return reject(new Error("GM_cookie.delete is not available."));
			    }
			    GM_cookie.delete(details, (error) => {
			      if (error) {
			        return reject(new Error(error));
			      }
			      resolve();
			    });
			  });
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
			      _error("_fetch (GM_xmlhttpRequest) error:", e);
			      reject(e);
			    }
			  });
			}
			
			function _registerMenuCommand(name, func) {
			  if (typeof GM_registerMenuCommand === "function") {
			    try {
			      GM_registerMenuCommand(name, func);
			    } catch (e) {
			      _error("GM_registerMenuCommand failed:", e);
			    }
			  } else {
			    _warn("GM_registerMenuCommand not available.");
			  }
			}
			
			function _openTab(url, active) {
			  if (typeof GM_openInTab === "function") {
			    try {
			      GM_openInTab(url, { loadInBackground: !active });
			    } catch (e) {
			      _error("GM_openInTab failed:", e);
			    }
			  } else {
			    _warn("GM_openInTab not available, using window.open as fallback.");
			    try {
			      window.open(url);
			    } catch (e) {
			      _error("window.open fallback failed:", e);
			    }
			  }
			}
			
			async function _initStorage() {
			  return Promise.resolve();
			}
			
			
			const EXTENSION_ASSETS_MAP = {
			  "html/options.html": "<!DOCTYPE html>\r\n<html dark=\"\" lang=\"en\">\r\n<head>\r\n    <meta charset=\"UTF-8\">\r\n    <title data-locale=\"text|page-title\">Iridium</title>\r\n    <link href=\"data:text/css;base64,QGZvbnQtZmFjZSB7DQogICAgZm9udC1mYW1pbHk6ICJSb2JvdG8iOw0KICAgIGZvbnQtd2VpZ2h0OiA0MDA7DQogICAgc3JjOiB1cmwoIi4uL2ZvbnQvUm9ib3RvLVJlZ3VsYXIudHRmIik7DQp9DQoNCkBmb250LWZhY2Ugew0KICAgIGZvbnQtZmFtaWx5OiAiUm9ib3RvIjsNCiAgICBmb250LXdlaWdodDogNTAwOw0KICAgIHNyYzogdXJsKCIuLi9mb250L1JvYm90by1NZWRpdW0udHRmIik7DQp9DQoNCkBmb250LWZhY2Ugew0KICAgIGZvbnQtZmFtaWx5OiAiUm9ib3RvIjsNCiAgICBmb250LXdlaWdodDogNjAwOw0KICAgIHNyYzogdXJsKCIuLi9mb250L1JvYm90by1Cb2xkLnR0ZiIpOw0KfQ0KDQpAa2V5ZnJhbWVzIGJyZWF0aGVTdGFydEVmZmVjdCB7DQogICAgMCUgew0KICAgICAgICBzdG9wLWNvbG9yOiAjMGZmOw0KICAgIH0NCiAgICA1MCUgew0KICAgICAgICBzdG9wLWNvbG9yOiB2YXIoLS1sb2dvLWNvbG9yKTsNCiAgICB9DQogICAgMTAwJSB7DQogICAgICAgIHN0b3AtY29sb3I6ICMwZmY7DQogICAgfQ0KfQ0KDQpAa2V5ZnJhbWVzIGJyZWF0aGVTdG9wRWZmZWN0IHsNCiAgICAwJSB7DQogICAgICAgIHN0b3AtY29sb3I6ICNmMGY7DQogICAgfQ0KICAgIDUwJSB7DQogICAgICAgIHN0b3AtY29sb3I6IHZhcigtLWxvZ28tY29sb3IpOw0KICAgIH0NCiAgICAxMDAlIHsNCiAgICAgICAgc3RvcC1jb2xvcjogI2YwZjsNCiAgICB9DQp9DQoNCkBrZXlmcmFtZXMgc2hpbW1lciB7DQogICAgMTAwJSB7DQogICAgICAgIG1hc2stcG9zaXRpb246IGxlZnQNCiAgICB9DQp9DQoNCmh0bWwgew0KICAgIC0tc2lkZWJhci13aWR0aDogMjQwcHg7DQogICAgLS1sb2dvLWhlaWdodDogMjBweDsNCiAgICAtLWxvZ28tY29sb3I6ICMyMTIxMjE7DQogICAgLS1saW5rLWNvbG9yOiAjMDY1ZmQ0Ow0KICAgIC0tYmFja2dyb3VuZC1jb2xvcjogI2ZmZjsNCiAgICAtLXRleHQtY29sb3I6ICMwZjBmMGY7DQogICAgLS10ZXh0LXByaW1hcnktY29sb3I6ICMwZjBmMGY7DQogICAgLS10ZXh0LXNlY29uZGFyeS1jb2xvcjogIzYwNjA2MDsNCiAgICAtLWRpdmlkZXItYm9yZGVyLWNvbG9yOiAjMDAwMDAwMWE7DQogICAgLS1wcmUtYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDI0Ow0KICAgIC0taXRlbS1ob3Zlci1iYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwMGQ7DQogICAgLS1pdGVtLXNlbGVjdGVkLWJhY2tncm91bmQtY29sb3I6ICMwMDAwMDAxYTsNCiAgICAtLXRvZ2dsZS1zd2l0Y2gtYnV0dG9uLWNvbG9yOiAjMDMwMzAzOw0KICAgIC0tdG9nZ2xlLXN3aXRjaC1idXR0b24tYWN0aXZlLWNvbG9yOiAjMDY1ZmQ0Ow0KICAgIC0tdG9nZ2xlLXN3aXRjaC1zbGlkZXItY29sb3I6ICM5MDkwOTA7DQogICAgLS1kcm9wZG93bi1iYWNrZ3JvdW5kLWNvbG9yOiAjZTVlNWU1Ow0KICAgIC0tYnV0dG9uLWJhY2tncm91bmQtY29sb3I6IHZhcigtLWJhY2tncm91bmQtY29sb3IpOw0KICAgIC0tYnV0dG9uLWJhY2tncm91bmQtY29sb3ItaG92ZXI6ICNkZWYxZmY7DQogICAgLS1idXR0b24tdGV4dC1jb2xvcjogdmFyKC0tdG9nZ2xlLXN3aXRjaC1idXR0b24tYWN0aXZlLWNvbG9yKTsNCn0NCg0KaHRtbFtkYXJrXSB7DQogICAgLS1sb2dvLWNvbG9yOiAjZmZmOw0KICAgIC0tbGluay1jb2xvcjogIzNlYTZmZjsNCiAgICAtLWJhY2tncm91bmQtY29sb3I6ICMwZjBmMGY7DQogICAgLS10ZXh0LWNvbG9yOiAjZjFmMWYxOw0KICAgIC0tdGV4dC1wcmltYXJ5LWNvbG9yOiAjZmZmOw0KICAgIC0tdGV4dC1zZWNvbmRhcnktY29sb3I6ICNhYWE7DQogICAgLS1kaXZpZGVyLWJvcmRlci1jb2xvcjogI2ZmZjM7DQogICAgLS1wcmUtYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjI0Ow0KICAgIC0taXRlbS1ob3Zlci1iYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmMWE7DQogICAgLS1pdGVtLXNlbGVjdGVkLWJhY2tncm91bmQtY29sb3I6ICNmZmYzOw0KICAgIC0tdG9nZ2xlLXN3aXRjaC1idXR0b24tY29sb3I6ICNmZmY7DQogICAgLS10b2dnbGUtc3dpdGNoLWJ1dHRvbi1hY3RpdmUtY29sb3I6ICMzZWE2ZmY7DQogICAgLS10b2dnbGUtc3dpdGNoLXNsaWRlci1jb2xvcjogIzcxNzE3MTsNCiAgICAtLWRyb3Bkb3duLWJhY2tncm91bmQtY29sb3I6ICMzZjNmM2Y7DQogICAgLS1idXR0b24tYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZC1jb2xvcik7DQogICAgLS1idXR0b24tYmFja2dyb3VuZC1jb2xvci1ob3ZlcjogIzI2Mzg1MDsNCiAgICAtLWJ1dHRvbi10ZXh0LWNvbG9yOiB2YXIoLS10b2dnbGUtc3dpdGNoLWJ1dHRvbi1hY3RpdmUtY29sb3IpOw0KfQ0KDQpib2R5IHsNCiAgICBmb250LWZhbWlseTogIlJvYm90byIsICJBcmlhbCIsIHNhbnMtc2VyaWY7DQogICAgbWFyZ2luOiAwIGF1dG87DQogICAgcG9zaXRpb246IHJlbGF0aXZlOw0KICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJhY2tncm91bmQtY29sb3IpOw0KICAgIGhlaWdodDogMTAwJTsNCiAgICB3aWR0aDogMTAwJTsNCiAgICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7DQp9DQoNCmEsDQouZmF1eC1saW5rIHsNCiAgICBkaXNwbGF5OiBpbmxpbmU7DQogICAgY29sb3I6IHZhcigtLWxpbmstY29sb3IpICFpbXBvcnRhbnQ7DQogICAgdGV4dC1kZWNvcmF0aW9uOiBub25lOw0KICAgIGN1cnNvcjogcG9pbnRlcjsNCn0NCg0KOmZvY3VzIHsNCiAgICBvdXRsaW5lOiBub25lOw0KfQ0KDQo6Oi1tb3otZm9jdXMtaW5uZXIgew0KICAgIGJvcmRlcjogMDsNCn0NCg0KW2hpZGRlbl0gew0KICAgIGRpc3BsYXk6IG5vbmU7DQp9DQoNCnByZSB7DQogICAgZGlzcGxheTogaW5saW5lOw0KICAgIGJhY2tncm91bmQ6IHZhcigtLXByZS1iYWNrZ3JvdW5kLWNvbG9yKTsNCiAgICBwYWRkaW5nOiAycHggNnB4Ow0KICAgIGJvcmRlci1yYWRpdXM6IDRweDsNCn0NCg0KI3ZlcnNpb24gew0KICAgIHBvc2l0aW9uOiBmaXhlZDsNCiAgICBib3R0b206IDA7DQogICAgcmlnaHQ6IDA7DQogICAgb3BhY2l0eTogMC41Ow0KICAgIGZvbnQtc2l6ZTogMTJweDsNCiAgICBwYWRkaW5nOiA2cHggMTJweDsNCiAgICB1c2VyLXNlbGVjdDogbm9uZTsNCiAgICBwb2ludGVyLWV2ZW50czogbm9uZTsNCn0NCg0KLnNoaW1tZXIgew0KICAgIG1hc2s6IGxpbmVhci1ncmFkaWVudCgtNjBkZWcsICMwMDAgMzAlLCAjMDAwNSwgIzAwMCA3MCUpIHJpZ2h0LzQwMCUgMTAwJTsNCiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0Ow0KICAgIGFuaW1hdGlvbjogc2hpbW1lciAyLjVzIGluZmluaXRlOw0KICAgIHdpZHRoOiBmaXQtY29udGVudDsNCn0NCg0KLmJvcmRlckJvdHRvbSB7DQogICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWRpdmlkZXItYm9yZGVyLWNvbG9yKTsNCn0NCg0KI3RpdGxlIHsNCiAgICB3aWR0aDogdmFyKC0tc2lkZWJhci13aWR0aCk7DQogICAgZm9udC1zaXplOiAwOw0KICAgIHRleHQtYWxpZ246IGNlbnRlcjsNCn0NCg0KI2xvZ28gew0KICAgIGhlaWdodDogdmFyKC0tbG9nby1oZWlnaHQpOw0KICAgIHBhZGRpbmc6IDAgMTZweDsNCiAgICBtYXJnaW46IDE4cHggMTJweDsNCn0NCg0KI2xvZ28gLm5hbWUgcGF0aCB7DQogICAgZmlsbDogdmFyKC0tbG9nby1jb2xvcik7DQp9DQoNCi5sb2dvLXN0YXJ0LWdyYWRpZW50IHsNCiAgICBhbmltYXRpb246IGJyZWF0aGVTdGFydEVmZmVjdCA1cyBsaW5lYXIgaW5maW5pdGU7DQp9DQoNCi5sb2dvLXN0b3AtZ3JhZGllbnQgew0KICAgIGFuaW1hdGlvbjogYnJlYXRoZVN0b3BFZmZlY3QgNXMgbGluZWFyIGluZmluaXRlOw0KfQ0KDQojY29udGFpbmVyIHsNCiAgICBkaXNwbGF5OiBmbGV4Ow0KfQ0KDQojbWVudSB7DQogICAgd2lkdGg6IHZhcigtLXNpZGViYXItd2lkdGgpOw0KICAgIG1pbi13aWR0aDogdmFyKC0tc2lkZWJhci13aWR0aCk7DQogICAgcGFkZGluZzogMThweCAwOw0KfQ0KDQouaXRlbSB7DQogICAgaGVpZ2h0OiA0MHB4Ow0KICAgIG1hcmdpbjogMCAxMnB4Ow0KICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7DQogICAgY3Vyc29yOiBwb2ludGVyOw0KICAgIHVzZXItc2VsZWN0OiBub25lOw0KICAgIHBhZGRpbmc6IDAgMTZweDsNCiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpczsNCiAgICBkaXNwbGF5OiBibG9jazsNCiAgICBvdmVyZmxvdzogaGlkZGVuOw0KICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7DQogICAgZm9udC1zaXplOiAxNHB4Ow0KICAgIGxpbmUtaGVpZ2h0OiA0MHB4Ow0KICAgIGZvbnQtd2VpZ2h0OiA0MDA7DQp9DQoNCi5pdGVtOmhvdmVyIHsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1pdGVtLWhvdmVyLWJhY2tncm91bmQtY29sb3IpOw0KfQ0KDQouaXRlbVtkYXRhLWFjdGl2ZV0gew0KICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWl0ZW0tc2VsZWN0ZWQtYmFja2dyb3VuZC1jb2xvcik7DQogICAgZm9udC13ZWlnaHQ6IDUwMDsNCn0NCg0KI2NvbnRlbnRzIHsNCiAgICBwYWRkaW5nOiAxOHB4IDMycHg7DQogICAgbWF4LXdpZHRoOiAxMDAwcHg7DQogICAgZmxleC1ncm93OiAxOw0KICAgIG1hcmdpbjogMCBhdXRvOw0KfQ0KDQouY29udGVudDpub3QoW2RhdGEtYWN0aXZlXSkgew0KICAgIGRpc3BsYXk6IG5vbmU7DQp9DQoNCi5jb250ZW50VGl0bGUgew0KICAgIGxpbmUtaGVpZ2h0OiA0MHB4Ow0KICAgIGZvbnQtc2l6ZTogMjBweDsNCiAgICBmb250LXdlaWdodDogNTAwOw0KfQ0KDQouY29udGVudERlc2NyaXB0aW9uIHsNCiAgICBjb2xvcjogdmFyKC0tdGV4dC1zZWNvbmRhcnktY29sb3IpOw0KICAgIGZvbnQtc2l6ZTogMTJweDsNCiAgICBwYWRkaW5nLWJvdHRvbTogMjRweDsNCiAgICBtYXJnaW4tYm90dG9tOiAyNHB4Ow0KfQ0KDQouc2V0dGluZ0dyb3VwIHsNCiAgICBkaXNwbGF5OiBmbGV4Ow0KfQ0KDQouc2V0dGluZ0xhYmVsIHsNCiAgICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7DQogICAgZm9udC1zaXplOiAxNHB4Ow0KICAgIGZvbnQtd2VpZ2h0OiA1MDA7DQogICAgd2lkdGg6IDE2MHB4Ow0KICAgIG1pbi13aWR0aDogMTYwcHg7DQogICAgbWFyZ2luLXJpZ2h0OiA1NnB4Ow0KfQ0KDQouc2V0dGluZyB7DQogICAgd2lkdGg6IDEwMCU7DQogICAgZGlzcGxheTogZmxleDsNCiAgICBtYXJnaW4tYm90dG9tOiAyNHB4Ow0KICAgIHRyYW5zaXRpb246IG9wYWNpdHkgLjA4czsNCiAgICBjdXJzb3I6IGRlZmF1bHQ7DQp9DQoNCi5zZXR0aW5nLmRpc2FibGVkIHsNCiAgICBvcGFjaXR5OiAwLjQ7DQogICAgdXNlci1zZWxlY3Q6IG5vbmU7DQogICAgcG9pbnRlci1ldmVudHM6IG5vbmU7DQp9DQoNCi5zZXR0aW5nIHNlbGVjdCB7DQogICAgZm9udC1mYW1pbHk6ICJSb2JvdG8iLCAiQXJpYWwiLCBzYW5zLXNlcmlmOw0KICAgIGZvbnQtc2l6ZTogMTRweDsNCiAgICBmb250LXdlaWdodDogNTAwOw0KICAgIHBhZGRpbmc6IDhweCAxNnB4Ow0KICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWRyb3Bkb3duLWJhY2tncm91bmQtY29sb3IpOw0KICAgIGNvbG9yOiB2YXIoLS10ZXh0LXByaW1hcnktY29sb3IpOw0KICAgIGJvcmRlci1yYWRpdXM6IDZweDsNCiAgICBib3JkZXI6IDAgbm9uZTsNCiAgICBtYXJnaW4tYm90dG9tOiA2cHg7DQogICAgbWluLXdpZHRoOiAxMjBweDsNCn0NCg0KLnNldHRpbmdEZXNjcmlwdGlvbiB7DQp9DQoNCi5zZXR0aW5nRGVzY3JpcHRpb24uaGlnaGxpZ2h0IHsNCiAgICBjb2xvcjogdmFyKC0tdGV4dC1wcmltYXJ5LWNvbG9yKTsNCiAgICBmb250LXNpemU6IDE0cHg7DQogICAgZm9udC13ZWlnaHQ6IDUwMDsNCiAgICBtYXJnaW4tYm90dG9tOiA0cHg7DQp9DQoNCi5zZXR0aW5nRGVzY3JpcHRpb246bm90KC5oaWdobGlnaHQpIHsNCiAgICBjb2xvcjogdmFyKC0tdGV4dC1zZWNvbmRhcnktY29sb3IpOw0KICAgIGZvbnQtc2l6ZTogMTRweDsNCiAgICBmb250LXdlaWdodDogNDAwOw0KfQ0KDQouc3dpdGNoIHsNCiAgICBwb3NpdGlvbjogcmVsYXRpdmU7DQogICAgZGlzcGxheTogZmxleDsNCiAgICB3aWR0aDogMzhweDsNCiAgICBoZWlnaHQ6IDIwcHg7DQogICAgbWluLXdpZHRoOiAzOHB4Ow0KICAgIHBhZGRpbmctcmlnaHQ6IDIwcHg7DQp9DQoNCi5zd2l0Y2ggaW5wdXQgew0KICAgIG9wYWNpdHk6IDA7DQogICAgd2lkdGg6IDA7DQogICAgaGVpZ2h0OiAwOw0KICAgIHBvaW50ZXItZXZlbnRzOiBub25lOw0KfQ0KDQouc2xpZGVyIHsNCiAgICBwb3NpdGlvbjogYWJzb2x1dGU7DQogICAgdG9wOiAwOw0KICAgIGxlZnQ6IDA7DQogICAgcmlnaHQ6IDA7DQogICAgYm90dG9tOiAwOw0KICAgIHBvaW50ZXItZXZlbnRzOiBub25lOw0KfQ0KDQouc2xpZGVyOjpiZWZvcmUgew0KICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsNCiAgICBjb250ZW50OiAiIjsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10b2dnbGUtc3dpdGNoLXNsaWRlci1jb2xvcik7DQogICAgb3BhY2l0eTogMC40Ow0KICAgIGhlaWdodDogMTRweDsNCiAgICB3aWR0aDogMzZweDsNCiAgICB0cmFuc2l0aW9uOiAuMDhzOw0KICAgIG1hcmdpbjogM3B4IDFweDsNCiAgICBib3JkZXItcmFkaXVzOiA4cHg7DQp9DQoNCi5zbGlkZXI6OmFmdGVyIHsNCiAgICBwb3NpdGlvbjogYWJzb2x1dGU7DQogICAgYm94LXNoYWRvdzogMCAxcHggNXB4IDAgcmdiYSgwLCAwLCAwLCAwLjYpOw0KICAgIGNvbnRlbnQ6ICIiOw0KICAgIGhlaWdodDogMjBweDsNCiAgICB3aWR0aDogMjBweDsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS10b2dnbGUtc3dpdGNoLWJ1dHRvbi1jb2xvcik7DQogICAgdHJhbnNpdGlvbjogLjA4czsNCiAgICB0b3A6IDA7DQogICAgbGVmdDogMDsNCiAgICBib3JkZXItcmFkaXVzOiA1MCU7DQp9DQoNCmlucHV0OmNoZWNrZWQgKyAuc2xpZGVyOjphZnRlciB7DQogICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdG9nZ2xlLXN3aXRjaC1idXR0b24tYWN0aXZlLWNvbG9yKTsNCiAgICBsZWZ0OiAxOHB4Ow0KfQ0KDQoucmFkaW9Hcm91cCB7DQogICAgbWFyZ2luOiAwIDAgMjRweDsNCiAgICBwYWRkaW5nOiAwOw0KICAgIGJvcmRlcjogbm9uZTsNCiAgICBjb2xvcjogdmFyKC0tdGV4dC1zZWNvbmRhcnktY29sb3IpOw0KfQ0KDQoucmFkaW8gew0KICAgIC0tcmFkaW8td2lkdGg6IDIwcHg7DQogICAgZm9udC1zaXplOiAxNnB4Ow0KICAgIHBvc2l0aW9uOiByZWxhdGl2ZTsNCiAgICBkaXNwbGF5OiBmbGV4Ow0KICAgIGhlaWdodDogMjBweDsNCiAgICBtaW4td2lkdGg6IHZhcigtLXJhZGlvLXdpZHRoKTsNCiAgICBtaW4taGVpZ2h0OiAyMHB4Ow0KICAgIHBhZGRpbmctbGVmdDogY2FsYyh2YXIoLS1yYWRpby13aWR0aCkgKyAxNnB4KTsNCiAgICBtYXJnaW4tYm90dG9tOiAyMHB4Ow0KfQ0KDQoucmFkaW8gaW5wdXQgew0KICAgIG9wYWNpdHk6IDA7DQogICAgd2lkdGg6IDA7DQogICAgaGVpZ2h0OiAwOw0KICAgIHBvaW50ZXItZXZlbnRzOiBub25lOw0KICAgIGRpc3BsYXk6IG5vbmU7DQp9DQoNCi5yYWRpbyAuYnV0dG9uOjpiZWZvcmUgew0KICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsNCiAgICBjb250ZW50OiAiIjsNCiAgICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS10b2dnbGUtc3dpdGNoLWJ1dHRvbi1jb2xvcik7DQogICAgaGVpZ2h0OiAyMHB4Ow0KICAgIHdpZHRoOiAyMHB4Ow0KICAgIGxlZnQ6IDA7DQogICAgdHJhbnNpdGlvbjogLjA4czsNCiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94Ow0KICAgIGJvcmRlci1yYWRpdXM6IDUwJTsNCn0NCg0KLnJhZGlvIC5idXR0b246OmFmdGVyIHsNCiAgICBwb3NpdGlvbjogYWJzb2x1dGU7DQogICAgY29udGVudDogIiI7DQogICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdG9nZ2xlLXN3aXRjaC1idXR0b24tY29sb3IpOw0KICAgIGhlaWdodDogMTBweDsNCiAgICB3aWR0aDogMTBweDsNCiAgICBsZWZ0OiA1cHg7DQogICAgdG9wOiAwOw0KICAgIGJvdHRvbTogMDsNCiAgICBtYXJnaW46IGF1dG87DQogICAgdHJhbnNpdGlvbjogLjA4czsNCiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94Ow0KICAgIGJvcmRlci1yYWRpdXM6IDUwJTsNCiAgICB0cmFuc2Zvcm06IHNjYWxlKDApOw0KfQ0KDQppbnB1dDpjaGVja2VkICsgLmJ1dHRvbjo6YmVmb3JlIHsNCiAgICBib3JkZXItY29sb3I6IHZhcigtLXRvZ2dsZS1zd2l0Y2gtYnV0dG9uLWFjdGl2ZS1jb2xvcik7DQp9DQoNCmlucHV0OmNoZWNrZWQgKyAuYnV0dG9uOjphZnRlciB7DQogICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tdG9nZ2xlLXN3aXRjaC1idXR0b24tYWN0aXZlLWNvbG9yKTsNCiAgICB0cmFuc2Zvcm06IHNjYWxlKDEpOw0KfQ0KDQojYmxhY2tsaXN0Q29udHJvbHMgew0KICAgIGRpc3BsYXk6IGZsZXg7DQogICAgbWFyZ2luLWJvdHRvbTogMTJweDsNCiAgICBnYXA6IDE2cHg7DQogICAgYWxpZ24taXRlbXM6IGNlbnRlcjsNCiAgICBmb250LXNpemU6IDE0cHg7DQogICAgZm9udC13ZWlnaHQ6IDUwMDsNCiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47DQp9DQoNCiNmaWx0ZXJDaGFubmVsc0NvbnRhaW5lciB7DQogICAgcG9zaXRpb246IHJlbGF0aXZlOw0KICAgIGxpbmUtaGVpZ2h0OiA0NnB4Ow0KICAgIHBhZGRpbmc6IDAgMTZweDsNCn0NCg0KI2ZpbHRlckNoYW5uZWxzQ29udGFpbmVyOjpiZWZvcmUgew0KICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsNCiAgICBjb250ZW50OiAiIjsNCiAgICB0b3A6IDA7DQogICAgYm90dG9tOiAwOw0KICAgIGxlZnQ6IDA7DQogICAgcmlnaHQ6IDA7DQogICAgYm9yZGVyLXJhZGl1czogMTJweDsNCiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1kaXZpZGVyLWJvcmRlci1jb2xvcik7DQp9DQoNCiNmaWx0ZXJDaGFubmVscyB7DQogICAgZm9udC1mYW1pbHk6ICJSb2JvdG8iLCAiQXJpYWwiLCBzYW5zLXNlcmlmOw0KICAgIHBvc2l0aW9uOiByZWxhdGl2ZTsNCiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iYWNrZ3JvdW5kLWNvbG9yKTsNCiAgICBjb2xvcjogdmFyKC0tdGV4dC1jb2xvcik7DQogICAgYm9yZGVyOiBub25lOw0KICAgIGZvbnQtc2l6ZTogMTRweDsNCiAgICBmb250LXdlaWdodDogNTAwOw0KfQ0KDQojYmxhY2tsaXN0Q2hhbm5lbHMgew0KICAgIHBhZGRpbmc6IDhweDsNCiAgICBwb3NpdGlvbjogcmVsYXRpdmU7DQogICAgZGlzcGxheTogZmxleDsNCiAgICBmbGV4LXdyYXA6IHdyYXA7DQogICAgZ2FwOiA4cHg7DQogICAgbGluZS1oZWlnaHQ6IDM2cHg7DQp9DQoNCiNibGFja2xpc3RDaGFubmVsczo6YmVmb3JlIHsNCiAgICBwb3NpdGlvbjogYWJzb2x1dGU7DQogICAgY29udGVudDogIiI7DQogICAgYm9yZGVyLXJhZGl1czogMTBweDsNCiAgICBiYWNrZ3JvdW5kOiB2YXIoLS10b2dnbGUtc3dpdGNoLXNsaWRlci1jb2xvcik7DQogICAgb3BhY2l0eTogMC4xOw0KICAgIHRvcDogMDsNCiAgICBib3R0b206IDA7DQogICAgbGVmdDogMDsNCiAgICByaWdodDogMDsNCiAgICB6LWluZGV4OiAtMTsNCn0NCg0KI2JsYWNrbGlzdEFjdGlvbnMgew0KICAgIGRpc3BsYXk6IGZsZXg7DQogICAgZ2FwOiAxNnB4Ow0KICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7DQp9DQoNCi5hY3Rpb24tYnV0dG9uIHsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1idXR0b24tYmFja2dyb3VuZC1jb2xvcik7DQogICAgY29sb3I6IHZhcigtLWJ1dHRvbi10ZXh0LWNvbG9yKTsNCiAgICBmb250LXNpemU6IDE0cHg7DQogICAgZm9udC13ZWlnaHQ6IDUwMDsNCiAgICBib3JkZXItcmFkaXVzOiAxMDBweDsNCiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7DQogICAgcGFkZGluZzogMTBweCAxNnB4Ow0KICAgIGN1cnNvcjogcG9pbnRlcjsNCiAgICB1c2VyLXNlbGVjdDogbm9uZTsNCiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1kaXZpZGVyLWJvcmRlci1jb2xvcik7DQogICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsNCn0NCg0KLmFjdGlvbi1idXR0b246bm90KC5kaXNhYmxlZCk6aG92ZXIgew0KICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yLWhvdmVyKTsNCiAgICBib3JkZXItY29sb3I6IHRyYW5zcGFyZW50Ow0KfQ0KDQouYWN0aW9uLWJ1dHRvbi5kaXNhYmxlZCB7DQogICAgcG9pbnRlci1ldmVudHM6IG5vbmU7DQogICAgZmlsdGVyOiBncmF5c2NhbGUoMSk7DQp9DQoNCi5jaGFubmVsIHsNCiAgICBwb3NpdGlvbjogcmVsYXRpdmU7DQogICAgZGlzcGxheTogZmxleDsNCiAgICBhbGlnbi1pdGVtczogY2VudGVyOw0KICAgIHdpZHRoOiBmaXQtY29udGVudDsNCiAgICBwYWRkaW5nOiAwIDE2cHg7DQogICAgYmFja2dyb3VuZDogdmFyKC0taXRlbS1zZWxlY3RlZC1iYWNrZ3JvdW5kLWNvbG9yKTsNCiAgICBib3JkZXItcmFkaXVzOiAxMHB4Ow0KICAgIGZvbnQtd2VpZ2h0OiA1MDA7DQogICAgY3Vyc29yOiBwb2ludGVyOw0KICAgIGxpbmUtaGVpZ2h0OiAzNnB4Ow0KICAgIG1pbi13aWR0aDogNjBweDsNCiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsNCn0NCg0KLnJlbW92ZSB7DQogICAgcG9zaXRpb246IGFic29sdXRlOw0KICAgIGxlZnQ6IDA7DQogICAgcmlnaHQ6IDA7DQogICAgbWFyZ2luOiAwIGF1dG87DQogICAgZmlsbDogdmFyKC0tdGV4dC1jb2xvcik7DQogICAgdHJhbnNpdGlvbjogMC4yczsNCiAgICB1c2VyLXNlbGVjdDogbm9uZTsNCiAgICBwb2ludGVyLWV2ZW50czogbm9uZTsNCn0NCg0KLmNoYW5uZWw6bm90KDpob3ZlcikgLnJlbW92ZSB7DQogICAgb3BhY2l0eTogMDsNCn0NCg0KLmNoYW5uZWxOYW1lIHsNCiAgICB0cmFuc2l0aW9uOiAwLjJzOw0KICAgIHVzZXItc2VsZWN0OiBub25lOw0KICAgIHBvaW50ZXItZXZlbnRzOiBub25lOw0KfQ0KDQouY2hhbm5lbDpob3ZlciAuY2hhbm5lbE5hbWUgew0KICAgIG9wYWNpdHk6IDAuMjsNCn0NCg0KI2JhY2tkcm9wIHsNCiAgICBwb3NpdGlvbjogZml4ZWQ7DQogICAgdG9wOiAwOw0KICAgIGJvdHRvbTogMDsNCiAgICBsZWZ0OiAwOw0KICAgIHJpZ2h0OiAwOw0KICAgIGRpc3BsYXk6IGZsZXg7DQogICAgYWxpZ24taXRlbXM6IGNlbnRlcjsNCiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsNCn0NCg0KI2JhY2tkcm9wOjpiZWZvcmUgew0KICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsNCiAgICBjb250ZW50OiAiIjsNCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1idXR0b24tYmFja2dyb3VuZC1jb2xvcik7DQogICAgb3BhY2l0eTogMC45Ow0KICAgIHRvcDogMDsNCiAgICBib3R0b206IDA7DQogICAgbGVmdDogMDsNCiAgICByaWdodDogMDsNCiAgICB6LWluZGV4OiAtMTsNCn0NCg0KI2RpYWxvZyB7DQogICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZC1jb2xvcik7DQogICAgbWluLXdpZHRoOiA0MDBweDsNCiAgICBwYWRkaW5nOiAyNHB4Ow0KICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7DQogICAgYm94LXNoYWRvdzogMCA1cHggMjBweCBibGFjazsNCiAgICBkaXNwbGF5OiBmbGV4Ow0KICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47DQogICAgZ2FwOiAxNnB4Ow0KfQ0KDQojZGlhbG9nIGlucHV0IHsNCiAgICBmb250LWZhbWlseTogIlJvYm90byIsICJBcmlhbCIsIHNhbnMtc2VyaWY7DQogICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZC1jb2xvcik7DQogICAgZm9udC1zaXplOiAxNnB4Ow0KICAgIGJvcmRlci1yYWRpdXM6IDhweDsNCiAgICBsaW5lLWhlaWdodDogMjZweDsNCiAgICBwYWRkaW5nOiA0cHggOHB4Ow0KICAgIGZsZXg6IDE7DQogICAgY29sb3I6IHZhcigtLXRleHQtY29sb3IpOw0KICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWRpdmlkZXItYm9yZGVyLWNvbG9yKTsNCn0NCg0KI3NlYXJjaEZvcm0gew0KICAgIGRpc3BsYXk6IGZsZXg7DQogICAgZ2FwOiAxNnB4Ow0KICAgIGNvbG9yOiB2YXIoLS10ZXh0LXNlY29uZGFyeS1jb2xvcik7DQp9DQoNCiNzZWFyY2hSZXN1bHQgew0KICAgIHBvc2l0aW9uOiByZWxhdGl2ZTsNCiAgICBkaXNwbGF5OiBmbGV4Ow0KICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7DQogICAgcGFkZGluZzogMTZweDsNCiAgICBmbGV4LWZsb3c6IGNvbHVtbjsNCiAgICBnYXA6IDhweDsNCn0NCg0KI3NlYXJjaFJlc3VsdDo6YmVmb3JlIHsNCiAgICBwb3NpdGlvbjogYWJzb2x1dGU7DQogICAgY29udGVudDogIiI7DQogICAgYmFja2dyb3VuZDogdmFyKC0tdG9nZ2xlLXN3aXRjaC1zbGlkZXItY29sb3IpOw0KICAgIG9wYWNpdHk6IDAuMTsNCiAgICB0b3A6IDA7DQogICAgYm90dG9tOiAwOw0KICAgIGxlZnQ6IDA7DQogICAgcmlnaHQ6IDA7DQogICAgYm9yZGVyLXJhZGl1czogMTBweDsNCiAgICB1c2VyLXNlbGVjdDogbm9uZTsNCiAgICBwb2ludGVyLWV2ZW50czogbm9uZTsNCn0NCg0KI3NlYXJjaFJlc3VsdCA+IGRpdiB7DQogICAgei1pbmRleDogMDsNCn0NCg0KI3NlYXJjaENoYW5uZWxBdmF0YXJDb250YWluZXIgew0KICAgIGJvcmRlci1yYWRpdXM6IDEwMCU7DQogICAgd2lkdGg6IDY0cHg7DQogICAgaGVpZ2h0OiA2NHB4Ow0KICAgIG92ZXJmbG93OiBoaWRkZW47DQp9DQoNCiNzZWFyY2hDaGFubmVsTmFtZSB7DQogICAgYm9yZGVyLXJhZGl1czogNHB4Ow0KICAgIGZvbnQtd2VpZ2h0OiA1MDA7DQp9DQoNCiNzZWFyY2hSZXN1bHRNZXNzYWdlIHsNCiAgICBwb3NpdGlvbjogYWJzb2x1dGU7DQogICAgb3BhY2l0eTogMTsNCiAgICB0b3A6IDA7DQogICAgYm90dG9tOiAwOw0KICAgIG1hcmdpbjogMCBhdXRvOw0KICAgIGRpc3BsYXk6IGZsZXg7DQogICAgYWxpZ24taXRlbXM6IGNlbnRlcjsNCn0NCg0KI3NlYXJjaENoYW5uZWxBdmF0YXIgew0KICAgIGhlaWdodDogMTAwJTsNCiAgICB3aWR0aDogMTAwJTsNCn0NCg0KI2RpYWxvZzpub3QoLm5vUmVzdWx0cykgI3NlYXJjaFJlc3VsdE1lc3NhZ2Ugew0KICAgIGRpc3BsYXk6IG5vbmU7DQp9DQoNCiNkaWFsb2cubm9SZXN1bHRzICNzZWFyY2hDaGFubmVsQXZhdGFyQ29udGFpbmVyLA0KI2RpYWxvZy5ub1Jlc3VsdHMgI3NlYXJjaENoYW5uZWxOYW1lIHsNCiAgICBvcGFjaXR5OiAwOw0KICAgIHVzZXItc2VsZWN0OiBub25lOw0KICAgIHBvaW50ZXItZXZlbnRzOiBub25lOw0KfQ0KDQojYmxvY2tlZEluZGljYXRvciB7DQogICAgY29sb3I6IHZhcigtLWJhY2tncm91bmQtY29sb3IpOw0KICAgIGZvbnQtc2l6ZTogMTBweDsNCiAgICBmb250LXdlaWdodDogNTAwOw0KICAgIG1hcmdpbi10b3A6IC0yMHB4Ow0KICAgIGJhY2tncm91bmQ6IHZhcigtLWxpbmstY29sb3IpOw0KICAgIHBhZGRpbmc6IDJweCA0cHg7DQogICAgYm9yZGVyLXJhZGl1czogNHB4Ow0KICAgIHVzZXItc2VsZWN0OiBub25lOw0KICAgIHBvaW50ZXItZXZlbnRzOiBub25lOw0KfQ0KDQojZGlhbG9nOm5vdCguY2hhbm5lbEJsb2NrZWQpICNibG9ja2VkSW5kaWNhdG9yIHsNCiAgICBvcGFjaXR5OiAwOw0KfQ0KDQojZGlhbG9nQWN0aW9uIHsNCiAgICBkaXNwbGF5OiBmbGV4Ow0KICAgIGdhcDogMTZweDsNCiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsNCn0NCg0KI2RpYWxvZzpub3QoLm5vUmVzdWx0cykgI2FkZERpYWxvZzpob3ZlciwNCiNkaWFsb2c6bm90KC5jaGFubmVsQmxvY2tlZCkgI2FkZERpYWxvZzpob3ZlciB7DQogICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYnV0dG9uLWJhY2tncm91bmQtY29sb3ItaG92ZXIpOw0KICAgIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7DQp9DQoNCiNkaWFsb2cubm9SZXN1bHRzICNhZGREaWFsb2csDQojZGlhbG9nLmNoYW5uZWxCbG9ja2VkICNhZGREaWFsb2cgew0KICAgIHBvaW50ZXItZXZlbnRzOiBub25lOw0KICAgIGZpbHRlcjogZ3JheXNjYWxlKDEpOw0KfQ==\" rel=\"stylesheet\" type=\"text/css\">\r\n    <link href=\"data:image/x-icon;base64,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\" rel=\"shortcut icon\" type=\"image/x-icon\">\r\n    <link href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAzRJREFUeNrEV79v00AY/c5x2gCiChItbGSDsTBlawQDI5VgJ5XY2/wF1H8BCRsDamFjgHbtUocNpmRELImYSkEQKn60TezjffGPfHactAlJsfR0l4vs9+597+5sotilSW8B6/S/rk5K24AGGm1TL5+5gJ8XtA3oX+e1/n2uCxtYnBafER84zBAdzXot43iGCu001Q7m9MaPOZ09EwGBiEDIEWOGih2TGt8u6bWpCpCzDzEbCsrCkSf787rx5bIuTEKAmeQAX0p7MNxemwIMB61DOfTtzwu6qohWFvZVc+IZiJQg6Isx7nM+Oilq7F3R7Ep2ohmQWYj3pUAGQrrmQAgcKU4lAxhrAYdJ5ALZTpo24EZtlHwMLoFoMcYCKrD8bZwYYyGwUtiNRcckGyK2sGJy45dgNroC0GcHqiwE+JDkghQDN5Zdgxrfs3r94OLgfAzNQLz+PtiNVyB5AezFiY+D32lfiEmPtUE17KzFkTKQFLjY7ybwDJbvcD4iItK9Pv6ntkk5lGXjT0bbOF8KJ+4D4R7Ardtd994+gBZpD1sf79JtqmtFS0AewIkKKLGfkA9NBTyn4Bp6E8+1FKnmcAFuDymnXwBq3AXIDoEd4D1wD2w5uZl1yV0BTcW0S8s49itmUgm6tfF3QDn7gNjs9Mh9ASHEi0VPgA6J+yZ1KgcCcmm9m4qQZ7gEuD0fPEfpfgjyTcAynSEl4PobsdnzzKX1rkee98kzg8jFRKpMPP9VVU8MoZw9twG5sD8H4rvAVXn/APIWnlO69kltnngacgaSHBCpz4KciW9Eak4DZ23hd/lmXbVOfRzHHfBnnQF5Hu1SX+AounT9e7eB0m17+FGdKCCeVJ41sAohmaHk3j11OFe6/6ZX55EEhCWILr2sXHJxclFn69FzVf7nN6IE+z1yf+MONAi7yxBirT5NrvNYAuS6l+SBAOUR87JaWbfGfyVLLIEUEJBH9naXmsBKZe10dR7LAbaeEYbOC1oLxJWXD9XEPt0GOuCkoqEDOW8ipdcPRq/zWAIEOdtc2r2j6tP4NEssgW89B6tUu6W2p/kt2icAbzEtkFvolj9en6zdSddfAQYAOENHqx8aocYAAAAASUVORK5CYII=\" rel=\"icon\" sizes=\"32x32\">\r\n    <link href=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABSBJREFUeNrUWktsG0UYnsnaUXjGVZS0gEQj0UO5IKuq1F4A3yIuODcOSDQ5IK41NyQk8AGJW+wrQmoi7pDcKJd1b6lASrigSCDFEq/KLY1bKSU0sYfvX8+uZ8czs7bjV1b6NLNee/f/Zr7/MbNmzHIIJnxgDciws3g0OQhwIUDgAP2VM0fgaVr4gDhORdjBee7MEDh8VviAIDx5poV/ZwJ8ByxOip3cdqE+K3w0wYhzIb8s2sBRBErPH/L6RBKozQsfhloJSFSJyOxjvj5xBP58GQRoBuzGq6jgu8VzB7wyMQSqF1sS4l0QmGpG/XUiMvcPr46dwK+XeidALVDHTcvz9/nnYyXwy+txJ04ioJEgVHFeWLjPN8dC4Oc3DARaKZpNUT80WPYNBJjXDK5ViMj5Gt8dKYEfr8ajkColG4EA9FlDI9KQ/tEiMtCwO2W7cJyO4+m00levpbTvaucn8rzhsZXmFNu/d17cHMkM3Hmr7cQmR1Ylo0tHHflQSjQrXiP6rIqZWl2onT7splwz4EpiMGIXbQbtookAGYoRD/pNMpy3zgm4tgj4tQVRgfxW5x/0H3ZPQ+AR2i0iAOQlmWi0Q+OJiOCR4UE/QoPlPMb2H8yJEn5fnHvYu3907QMOVIEytH4bOFJ94ETr29BIsZsgtP/wXO9lu5VA6LSq8yZgWxLZVo2PGZtWoH7uBW2m6bFbILHz6MXuy3anhFxZ2JK8jiCV22jvYkTzJC+haJ98oRnKh7WlxFi7BZcs7uk/fkFsQo6F5w7d/jFQAorj1tFu4Pwy2iW0mZj2HQSU0LiMey9jHVLE/Uoz/5n9oysn7jBeT14SquPKUd9Dfw/G5YBrwIzNaMOiPHzeZ3jejeO0KKaPO8v2/ggkxH5DxKkA28ASkNUJxEZfGJMThepbJ564gfsWOWvnj4ES6DBeap9anB8BW8Bd3HaJjIplVGGdARU5PCcnhKCZICLVgRBQY39gvOK0nq59zu7hthtoLwdEOMvoRKxVr5QunrFC/iGYKKdcYVQtI2IFnK59aqcU7RsMl4Nq1r1S7UawDZzX6tOzeopCLgIO7ZsizQWThFQyLHnhtA57EJ0SJNQtgSTjpeEUgcjwbEdFaZNNM248KtoKGT79pA8njkKnFkI9k/bbjhuCMus1ItGL3httAnU8i1Z3/YfRmOFtZ4qM17XPWsmKMnEeZ52OytyaD/VOI94QrPTq76dMZKbkpRqvyYcyb14ScCarSPPNDgKbeGbh0l6/pcR03JlMBAzGk87fBq5bV1DJWzO7ZHj2p+4WO/Ywmk5OXqrx6F+Xxs9YM6xb73VaE+Tu8NLAFjQ2AuFSURq+COSpYGNagWbMsGa9l2BJcemH3hc0PRHQirZZtO9RxdlNgWaRC4XF1Xe/HdKS0kZAzkLWkayS9E6bXqsffDPkRb2NgClhWcNk3HiK5+UPvx7ctmNPBMKiLaw01WRl3KSJO+o64nmhUBrsxlZXBPSiLUxa4crKVQbjdxU8pfDpF8PZWnTmAW6J/XqFadF8sLn75SfD3dxNngGH9k3bfKRzoAyU1j4e/usnNwEt9juNl2UuRzz/6qPRveBwZmJVOkanZbF4Xtx4f/SvmJwzEEtemtOGYZF0vrU8vpd8XREI5aM6LZevWb9/Z7yvWa0ETtLtml+TTVDm+m+OTuf9zUCqXbBJ42k7vbBzZfQ67+t46S/hv/KHEBer4uC13wb7VmUkx3xN+Bf+FmsgMdF/t/lfgAEAeu5nx8gUITUAAAAASUVORK5CYII=\" rel=\"icon\" sizes=\"48x48\">\r\n    <link href=\"data:image/png;base64,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\" rel=\"icon\" sizes=\"64x64\">\r\n    <link href=\"data:image/png;base64,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\" rel=\"icon\" sizes=\"128x128\">\r\n    <link href=\"data:image/png;base64,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\" rel=\"icon\" sizes=\"144x144\">\r\n    <script src=\"data:text/javascript;base64,Y29uc3QgU2V0dGluZ0RhdGEgPSB7DQogICAgZXh0ZW5zaW9uQnV0dG9uOiB7DQogICAgICAgIGlkOiAiZXh0ZW5zaW9uQnV0dG9uIiwNCiAgICAgICAgZGVmYXVsdDogdHJ1ZSwNCiAgICB9LA0KICAgIHN5bmNTZXR0aW5nczogew0KICAgICAgICBpZDogInN5bmNTZXR0aW5ncyIsDQogICAgICAgIGRlZmF1bHQ6IGZhbHNlLA0KICAgIH0sDQogICAgZnVsbFRpdGxlczogew0KICAgICAgICBpZDogImZ1bGxUaXRsZXMiLA0KICAgICAgICBkZWZhdWx0OiB0cnVlLA0KICAgIH0sDQogICAgdGhlbWU6IHsNCiAgICAgICAgaWQ6ICJ0aGVtZSIsDQogICAgICAgIGRlZmF1bHQ6ICJkZXZpY2VUaGVtZSIsDQogICAgfSwNCiAgICBsb2dvU3Vic2NyaXB0aW9uczogew0KICAgICAgICBpZDogImxvZ29TdWJzY3JpcHRpb25zIiwNCiAgICAgICAgZGVmYXVsdDogZmFsc2UsDQogICAgfSwNCiAgICBhdXRvcGxheUNoYW5uZWxUcmFpbGVyOiB7DQogICAgICAgIGlkOiAiYXV0b3BsYXlDaGFubmVsVHJhaWxlciIsDQogICAgICAgIGRlZmF1bHQ6IGZhbHNlLA0KICAgIH0sDQogICAgY2hhbm5lbFRhYjogew0KICAgICAgICBpZDogImNoYW5uZWxUYWIiLA0KICAgICAgICBkZWZhdWx0OiAiZmVhdHVyZWQiLA0KICAgIH0sDQogICAgaG9tZVNob3J0czogew0KICAgICAgICBpZDogImhvbWVTaG9ydHMiLA0KICAgICAgICBkZWZhdWx0OiB0cnVlLA0KICAgIH0sDQogICAgc3Vic2NyaXB0aW9uc1Nob3J0czogew0KICAgICAgICBpZDogInN1YnNjcmlwdGlvbnNTaG9ydHMiLA0KICAgICAgICBkZWZhdWx0OiB0cnVlLA0KICAgIH0sDQogICAgdmlkZW9QYWdlU2hvcnRzOiB7DQogICAgICAgIGlkOiAidmlkZW9QYWdlU2hvcnRzIiwNCiAgICAgICAgZGVmYXVsdDogdHJ1ZSwNCiAgICB9LA0KICAgIHNlYXJjaFNob3J0czogew0KICAgICAgICBpZDogInNlYXJjaFNob3J0cyIsDQogICAgICAgIGRlZmF1bHQ6IHRydWUsDQogICAgfSwNCiAgICBhZE9wdE91dEFsbDogew0KICAgICAgICBpZDogImFkT3B0T3V0QWxsIiwNCiAgICAgICAgZGVmYXVsdDogZmFsc2UsDQogICAgfSwNCiAgICBhZFN1YnNjcmliZWQ6IHsNCiAgICAgICAgaWQ6ICJhZFN1YnNjcmliZWQiLA0KICAgICAgICBkZWZhdWx0OiBmYWxzZSwNCiAgICB9LA0KICAgIGFkVmlkZW9GZWVkOiB7DQogICAgICAgIGlkOiAiYWRWaWRlb0ZlZWQiLA0KICAgICAgICBkZWZhdWx0OiBmYWxzZSwNCiAgICB9LA0KICAgIGFkSW5WaWRlbzogew0KICAgICAgICBpZDogImFkSW5WaWRlbyIsDQogICAgICAgIGRlZmF1bHQ6IGZhbHNlLA0KICAgIH0sDQogICAgYWRUYWdnZWRQcm9kdWN0czogew0KICAgICAgICBpZDogImFkVGFnZ2VkUHJvZHVjdHMiLA0KICAgICAgICBkZWZhdWx0OiBmYWxzZSwNCiAgICB9LA0KICAgIGFkTWFzdGhlYWQ6IHsNCiAgICAgICAgaWQ6ICJhZE1hc3RoZWFkIiwNCiAgICAgICAgZGVmYXVsdDogZmFsc2UsDQogICAgfSwNCiAgICBhZEhvbWVGZWVkOiB7DQogICAgICAgIGlkOiAiYWRIb21lRmVlZCIsDQogICAgICAgIGRlZmF1bHQ6IGZhbHNlLA0KICAgIH0sDQogICAgYWRTZWFyY2hGZWVkOiB7DQogICAgICAgIGlkOiAiYWRTZWFyY2hGZWVkIiwNCiAgICAgICAgZGVmYXVsdDogZmFsc2UsDQogICAgfSwNCiAgICB2aWRlb0ZvY3VzOiB7DQogICAgICAgIGlkOiAidmlkZW9Gb2N1cyIsDQogICAgICAgIGRlZmF1bHQ6IHRydWUsDQogICAgfSwNCiAgICBjcmVhdG9yTWVyY2g6IHsNCiAgICAgICAgaWQ6ICJjcmVhdG9yTWVyY2giLA0KICAgICAgICBkZWZhdWx0OiB0cnVlLA0KICAgIH0sDQogICAgdmlkZW9Db3VudDogew0KICAgICAgICBpZDogInZpZGVvQ291bnQiLA0KICAgICAgICBkZWZhdWx0OiB0cnVlLA0KICAgIH0sDQogICAgYW1iaWVudE1vZGU6IHsNCiAgICAgICAgaWQ6ICJhbWJpZW50TW9kZSIsDQogICAgICAgIGRlZmF1bHQ6IHRydWUsDQogICAgfSwNCiAgICByZXZlcnNlUGxheWxpc3Q6IHsNCiAgICAgICAgaWQ6ICJyZXZlcnNlUGxheWxpc3QiLA0KICAgICAgICBkZWZhdWx0OiB0cnVlLA0KICAgIH0sDQogICAgcmV2ZXJzZVBsYXlsaXN0VG9nZ2xlZDogew0KICAgICAgICBpZDogInJldmVyc2VQbGF5bGlzdFRvZ2dsZWQiLA0KICAgICAgICBkZWZhdWx0OiBmYWxzZSwNCiAgICB9LA0KICAgIHN1cGVyVGhlYXRlcjogew0KICAgICAgICBpZDogInN1cGVyVGhlYXRlciIsDQogICAgICAgIGRlZmF1bHQ6IHRydWUsDQogICAgfSwNCiAgICBzdXBlclRoZWF0ZXJTY3JvbGxiYXI6IHsNCiAgICAgICAgaWQ6ICJzdXBlclRoZWF0ZXJTY3JvbGxiYXIiLA0KICAgICAgICBkZWZhdWx0OiB0cnVlLA0KICAgIH0sDQogICAgZGVmYXVsdFF1YWxpdHk6IHsNCiAgICAgICAgaWQ6ICJkZWZhdWx0UXVhbGl0eSIsDQogICAgICAgIGRlZmF1bHQ6ICJhdXRvIiwNCiAgICB9LA0KICAgIGRlZmF1bHRTcGVlZDogew0KICAgICAgICBpZDogImRlZmF1bHRTcGVlZCIsDQogICAgICAgIGRlZmF1bHQ6ICItMSIsDQogICAgfSwNCiAgICBhbHdheXNWaXNpYmxlOiB7DQogICAgICAgIGlkOiAiYWx3YXlzVmlzaWJsZSIsDQogICAgICAgIGRlZmF1bHQ6IHRydWUsDQogICAgfSwNCiAgICBhbHdheXNWaXNpYmxlUG9zaXRpb246IHsNCiAgICAgICAgaWQ6ICJhbHdheXNWaXNpYmxlUG9zaXRpb24iLA0KICAgICAgICBkZWZhdWx0OiB7fSwNCiAgICB9LA0KICAgIGhmckFsbG93ZWQ6IHsNCiAgICAgICAgaWQ6ICJoZnJBbGxvd2VkIiwNCiAgICAgICAgZGVmYXVsdDogdHJ1ZSwNCiAgICB9LA0KICAgIGF1dG9wbGF5OiB7DQogICAgICAgIGlkOiAiYXV0b3BsYXkiLA0KICAgICAgICBkZWZhdWx0OiBmYWxzZSwNCiAgICB9LA0KICAgIGxvdWRuZXNzOiB7DQogICAgICAgIGlkOiAibG91ZG5lc3MiLA0KICAgICAgICBkZWZhdWx0OiBmYWxzZSwNCiAgICB9LA0KICAgIHNjcm9sbFZvbHVtZTogew0KICAgICAgICBpZDogInNjcm9sbFZvbHVtZSIsDQogICAgICAgIGRlZmF1bHQ6IHRydWUsDQogICAgfSwNCiAgICBzY3JvbGxWb2x1bWVTaGlmdDogew0KICAgICAgICBpZDogInNjcm9sbFZvbHVtZVNoaWZ0IiwNCiAgICAgICAgZGVmYXVsdDogdHJ1ZSwNCiAgICB9LA0KICAgIHNjcm9sbFZvbHVtZVN0ZXA6IHsNCiAgICAgICAgaWQ6ICJzY3JvbGxWb2x1bWVTdGVwIiwNCiAgICAgICAgZGVmYXVsdDogNSwNCiAgICB9LA0KICAgIGluZm9DYXJkczogew0KICAgICAgICBpZDogImluZm9DYXJkcyIsDQogICAgICAgIGRlZmF1bHQ6IGZhbHNlLA0KICAgIH0sDQogICAgYW5ub3RhdGlvbnM6IHsNCiAgICAgICAgaWQ6ICJhbm5vdGF0aW9ucyIsDQogICAgICAgIGRlZmF1bHQ6IHRydWUsDQogICAgfSwNCiAgICBlbmRTY3JlZW46IHsNCiAgICAgICAgaWQ6ICJlbmRTY3JlZW4iLA0KICAgICAgICBkZWZhdWx0OiBmYWxzZSwNCiAgICB9LA0KICAgIGF1dG9wbGF5U2hvcnRjdXQ6IHsNCiAgICAgICAgaWQ6ICJhdXRvcGxheVNob3J0Y3V0IiwNCiAgICAgICAgZGVmYXVsdDogdHJ1ZSwNCiAgICB9LA0KICAgIHZpZGVvRm9jdXNUb2dnbGU6IHsNCiAgICAgICAgaWQ6ICJ2aWRlb0ZvY3VzVG9nZ2xlIiwNCiAgICAgICAgZGVmYXVsdDogdHJ1ZSwNCiAgICB9LA0KICAgIHZpZGVvU2NyZWVuc2hvdDogew0KICAgICAgICBpZDogInZpZGVvU2NyZWVuc2hvdCIsDQogICAgICAgIGRlZmF1bHQ6IHRydWUsDQogICAgfSwNCiAgICB2aWRlb1RodW1ibmFpbDogew0KICAgICAgICBpZDogInZpZGVvVGh1bWJuYWlsIiwNCiAgICAgICAgZGVmYXVsdDogdHJ1ZSwNCiAgICB9LA0KICAgIG1vbmV0aXphdGlvbkluZm86IHsNCiAgICAgICAgaWQ6ICJtb25ldGl6YXRpb25JbmZvIiwNCiAgICAgICAgZGVmYXVsdDogdHJ1ZSwNCiAgICB9LA0KICAgIGJsYWNrbGlzdEVuYWJsZWQ6IHsNCiAgICAgICAgaWQ6ICJibGFja2xpc3RFbmFibGVkIiwNCiAgICAgICAgZGVmYXVsdDogdHJ1ZSwNCiAgICB9LA0KICAgIGJsYWNrbGlzdEJ1dHRvbjogew0KICAgICAgICBpZDogImJsYWNrbGlzdEJ1dHRvbiIsDQogICAgICAgIGRlZmF1bHQ6IHRydWUsDQogICAgfSwNCiAgICBibGFja2xpc3Q6IHsNCiAgICAgICAgaWQ6ICJibGFja2xpc3QiLA0KICAgICAgICBkZWZhdWx0OiB7fSwNCiAgICB9LA0KfTsNCmNvbnN0IGdldERlZmF1bHRTZXR0aW5ncyA9ICgpID0+IE9iamVjdC5rZXlzKFNldHRpbmdEYXRhKS5yZWR1Y2UoKHByZXZpb3VzVmFsdWUsIGN1cnJlbnRWYWx1ZSkgPT4gKHsNCiAgICAuLi5wcmV2aW91c1ZhbHVlLA0KICAgIFtjdXJyZW50VmFsdWVdOiBTZXR0aW5nRGF0YVtjdXJyZW50VmFsdWVdLmRlZmF1bHQNCn0pLCB7fSk7\"></script>\r\n</head>\r\n<body>\r\n<div id=\"title\">\r\n    <svg id=\"logo\" xmlns=\"http://www.w3.org/2000/svg\" x=\"0px\" y=\"0px\" viewBox=\"0 0 80 20\" focusable=\"false\">\r\n        <g>\r\n            <radialGradient id=\"logo-gradient\" cx=\"-0.8889\" cy=\"2101.1111\" r=\"20.5555\" gradientTransform=\"matrix(1 0 0 1 0 -2080)\" gradientUnits=\"userSpaceOnUse\">\r\n                <stop class=\"logo-start-gradient\" offset=\"0\"/>\r\n                <stop class=\"logo-stop-gradient\" offset=\"1\"/>\r\n            </radialGradient>\r\n            <polygon opacity=\"0.5\" fill=\"url(#logo-gradient)\" points=\"0,0 17.3,10 0,20 \t\"/>\r\n            <path fill=\"url(#logo-gradient)\" d=\"M0,0v20l17.3-10L0,0z M3.3,5.8l7.3,4.2l-7.3,4.2C3.3,14.2,3.3,5.8,3.3,5.8z\"/>\r\n        </g>\r\n        <g class=\"name\">\r\n            <path d=\"M25,20V0h3v20H25z\"/>\r\n            <path d=\"M29,20V5h2.9v1.7l0,0c0.7-1.2,2-2,3.5-2H36V8c-0.5-0.1-1.1-0.3-1.9-0.3c-1,0-2.1,0.6-2.1,1.9V20H29L29,20z\"/>\r\n            <path d=\"M37,2.8V0h3v2.8H37z M37,20V5h3v15H37z\"/>\r\n            <path d=\"M47.2,20v-1.8l0,0c-1,1.2-1.7,1.8-3.2,1.8c-1.8,0-3-1.4-3-4.1v-7c0-2.7,1.2-4.1,3-4.1c1.3,0,1.9,0.5,3,1.5V0h3v20H47.2zM47.1,8c-0.6-0.4-1.1-0.7-1.7-0.7c-0.8,0-1.5,0.4-1.5,2.4v5.4c0,1.9,0.6,2.4,1.5,2.4c0.6,0,1.1-0.3,1.7-0.7V8z\"/>\r\n            <path d=\"M51,2.8V0h3v2.8H51z M51,20V5h3v15H51z\"/>\r\n            <path d=\"M64,5v15h-2.9v-1.7c-1.3,1.1-1.9,1.7-3.6,1.7c-1.6,0-2.5-1.1-2.5-3.1V5h3v11.5c0,0.7,0.4,1.1,1.1,1.1c0.6,0,1.2-0.4,1.9-0.9V5H64z\"/>\r\n            <path d=\"M71,8.3c0-0.7-0.4-1.1-1.1-1.1s-1.3,0.5-1.9,1V20h-3V5h2.9v1.5c1.3-1.1,1.9-1.7,3.3-1.7c1.5,0,2,0.5,2.7,1.7c1.5-1.4,2.3-1.7,3.3-1.7C79.1,4.8,80,6,80,7.9V20h-3V8.3c0-0.7-0.5-1.1-1.1-1.1S74.7,7.6,74,8.1V20h-3\"/>\r\n        </g>\r\n    </svg>\r\n</div>\r\n<div id=\"container\">\r\n    <div id=\"menu\">\r\n        <div id=\"items\">\r\n            <div class=\"item\" data-menu=\"general\" data-id=\"general\" data-locale=\"item\" data-active=\"\">General</div>\r\n            <div class=\"item\" data-menu=\"adManager\" data-id=\"adManager\" data-locale=\"item\">Ad manager</div>\r\n            <div class=\"item\" data-menu=\"website\" data-id=\"website\" data-locale=\"item\">Website</div>\r\n            <div class=\"item\" data-menu=\"videoPage\" data-id=\"videoPage\" data-locale=\"item\">Video page</div>\r\n            <div class=\"item\" data-menu=\"blackList\" data-id=\"blackList\" data-locale=\"item\">Blacklist</div>\r\n            <div class=\"item\" data-menu=\"help\" data-id=\"help\" data-locale=\"item\">Help</div>\r\n        </div>\r\n    </div>\r\n    <div id=\"contents\">\r\n        <div class=\"content\" data-content=\"general\" data-active=\"\">\r\n            <div class=\"contentTitle\" data-id=\"general\" data-locale=\"contentTitle\">General</div>\r\n            <div class=\"contentDescription borderBottom\" data-id=\"general\" data-locale=\"contentDescription\">Various settings that control the extension and website</div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\" data-id=\"general\" data-locale=\"extensionSettings\">Extension settings</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"extensionButton\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\" data-id=\"extensionButton\" data-locale=\"highlight\">Display extension button on YouTube</div>\r\n                            <div class=\"settingDescription\" data-id=\"extensionButton\" data-locale=\"description\">Show an extension shortcut button on YouTube pages</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"syncSettings\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\" data-id=\"syncSettings\" data-locale=\"highlight\">Sync extension settings</div>\r\n                            <div class=\"settingDescription\" data-id=\"syncSettings\" data-locale=\"description\">Extension settings will be synced across browsers with the same user profile logged in</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\" data-id=\"general\" data-locale=\"manageSettings\">Manage settings</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\">\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight faux-link\" data-id=\"export\" data-locale=\"export\" data-action=\"export\">Export settings into a file</div>\r\n                            <div class=\"settingDescription\" data-id=\"export\" data-locale=\"description\">Extension settings are exported in a json file format</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\">\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight faux-link\" data-id=\"import\" data-locale=\"import\" data-action=\"import\">Import settings from backup</div>\r\n                            <div class=\"settingDescription\" data-id=\"import\" data-locale=\"description\">Restore settings from an existing backup json file format</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\">\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight faux-link\" data-id=\"reset\" data-locale=\"reset\" data-action=\"reset\">Reset settings</div>\r\n                            <div class=\"settingDescription\" data-id=\"reset\" data-locale=\"description\">Resetting the extension settings may help resolve certain issues, but remember to back up the current settings first</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"contentTitle shimmer\" data-id=\"donate\" data-locale=\"contentTitle\">Donate</div>\r\n            <div class=\"contentDescription borderBottom\" data-id=\"donate\" data-locale=\"contentDescription\">Contribute to help keep the extension alive</div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Donation options</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\">\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\"><a target=\"_blank\" href=\"https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=UMVQJJFG4BFHW&lc=US\">Paypal</a></div>\r\n                            <div class=\"settingDescription\">You may donate one time only or set up a monthly donation</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\">\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\"><a target=\"_blank\" href=\"https://www.patreon.com/particle\">Patreon</a></div>\r\n                            <div class=\"settingDescription\">Join my patreon and follow up with less technical summarized updates</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"content\" data-content=\"adManager\">\r\n            <div class=\"contentTitle\" data-id=\"adManager\" data-locale=\"contentTitle\">Ad manager</div>\r\n            <div class=\"contentDescription borderBottom\" data-id=\"adManager\" data-locale=\"contentDescription\">Manage how ads are displayed in video and other web pages</div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\" data-id=\"adManager\" data-locale=\"videoPage\">General</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"adOptOutAll\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"adOptOutAll\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\" data-locale=\"highlight\">Opt out of all ads</div>\r\n                            <div class=\"settingDescription\" data-locale=\"description\">No ads will be displayed on the website, but other settings may take precedence</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\" data-id=\"adManager\" data-locale=\"homePage\">Home page</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"adMasthead\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"adMasthead\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\" data-locale=\"highlight\">Masthead ad</div>\r\n                            <div class=\"settingDescription\" data-locale=\"description\">Allow a large banner ad to show on the top of the page</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"adHomeFeed\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"adHomeFeed\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\" data-locale=\"highlight\">In-feed ads</div>\r\n                            <div class=\"settingDescription\" data-locale=\"description\">Allow ads to show in the home page video list</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\" data-id=\"adManager\" data-locale=\"searchPage\">Search page</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"adSearchFeed\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"adSearchFeed\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\" data-locale=\"highlight\">In-feed ads</div>\r\n                            <div class=\"settingDescription\" data-locale=\"description\">Allow ads to show in the search page results</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\" data-id=\"adManager\" data-locale=\"videoPage\">Video page</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"adSubscribed\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"adSubscribed\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\" data-locale=\"highlight\">Subscribed ads</div>\r\n                            <div class=\"settingDescription\" data-locale=\"description\">Only show ads on videos from subscribed channels</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"adVideoFeed\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"adVideoFeed\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\" data-locale=\"highlight\">In-feed ads</div>\r\n                            <div class=\"settingDescription\" data-locale=\"description\">Allow ads to be displayed in the suggested videos sidebar</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"adInVideo\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"adInVideo\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\" data-locale=\"highlight\">Video ads</div>\r\n                            <div class=\"settingDescription\" data-locale=\"description\">Allow ads to be displayed in the video</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"adTaggedProducts\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"adTaggedProducts\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\" data-locale=\"highlight\">Tagged product ads</div>\r\n                            <div class=\"settingDescription\" data-locale=\"description\">Allow small banners of tagged affiliate products in the video</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"content\" data-content=\"website\">\r\n            <div class=\"contentTitle\" data-id=\"website\" data-locale=\"contentTitle\">Website</div>\r\n            <div class=\"contentDescription borderBottom\" data-id=\"website\" data-locale=\"contentDescription\">Personalize the aspect and behavior of YouTube</div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Visual</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"fullTitles\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"fullTitles\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Show full titles in thumbnails</div>\r\n                            <div class=\"settingDescription\">Makes the titles in the thumbnails display in full</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\" data-id=\"website\" data-locale=\"theme\">Theme</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"theme\">\r\n                        <fieldset class=\"radioGroup\">\r\n                            <label class=\"radio\">\r\n                                <input data-setting=\"theme\" value=\"deviceTheme\" type=\"radio\" name=\"theme\">\r\n                                <span class=\"button\"></span>\r\n                                Device theme\r\n                            </label>\r\n                            <label class=\"radio\">\r\n                                <input data-setting=\"theme\" value=\"lightTheme\" type=\"radio\" name=\"theme\">\r\n                                <span class=\"button\"></span>\r\n                                Light theme\r\n                            </label>\r\n                            <label class=\"radio\">\r\n                                <input data-setting=\"theme\" value=\"darkTheme\" type=\"radio\" name=\"theme\">\r\n                                <span class=\"button\"></span>\r\n                                Dark theme\r\n                            </label>\r\n                            <div class=\"settingDescription\">\r\n                                <div class=\"settingDescription\" data-locale=\"description\">Enforces the selected theme on YouTube and in the extension options page. Device theme will default to Dark theme when not available</div>\r\n                            </div>\r\n                        </fieldset>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Logo redirect</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"logoSubscriptions\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"logoSubscriptions\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Redirect to subscriptions page</div>\r\n                            <div class=\"settingDescription\">Clicking on the YouTube logo will redirect to the subscriptions page instead of the homepage</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Channel</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"autoplayChannelTrailer\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"autoplayChannelTrailer\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Autoplay channel trailer</div>\r\n                            <div class=\"settingDescription\">Channel trailers will play automatically. Does not override the browser settings</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Channel tab</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"channelTab\">\r\n                        <div class=\"settingDescription\">\r\n                            <label>\r\n                                <select data-setting=\"channelTab\">\r\n                                    <option value=\"featured\" selected=\"selected\">Home</option>\r\n                                    <option value=\"videos\">Videos</option>\r\n                                    <option value=\"shorts\">Shorts</option>\r\n                                    <option value=\"streams\">Live</option>\r\n                                    <option value=\"podcasts\">Podcasts</option>\r\n                                    <option value=\"playlists\">Playlists</option>\r\n                                    <option value=\"community\">Community</option>\r\n                                    <option value=\"channels\">Channels</option>\r\n                                    <option value=\"store\">Store</option>\r\n                                </select>\r\n                            </label>\r\n                            <div class=\"settingDescription\">Clicking on a channel link will automatically open the specified tab</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Shorts</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"homeShorts\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"homeShorts\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Home page</div>\r\n                            <div class=\"settingDescription\">Short videos will show on the home page</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"subscriptionsShorts\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"subscriptionsShorts\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Subscriptions</div>\r\n                            <div class=\"settingDescription\">Short videos will show in the subscriptions</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"videoPageShorts\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"videoPageShorts\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Video Page</div>\r\n                            <div class=\"settingDescription\">Short videos will show in video page sidebar</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"searchShorts\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"searchShorts\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Search results</div>\r\n                            <div class=\"settingDescription\">Short videos will show in search results</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"content\" data-content=\"videoPage\">\r\n            <div class=\"contentTitle\" data-id=\"videoPage\" data-locale=\"contentTitle\">Video page</div>\r\n            <div class=\"contentDescription borderBottom\" data-id=\"videoPage\" data-locale=\"contentDescription\">Customize the video page and player</div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Page</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"videoFocus\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"videoFocus\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Video focus</div>\r\n                            <div class=\"settingDescription\">Fade out the webpage while the video is playing</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"creatorMerch\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"creatorMerch\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Creator merch</div>\r\n                            <div class=\"settingDescription\">Allows the creator merch to be shown below the video details</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"videoCount\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"videoCount\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Linked video count</div>\r\n                            <div class=\"settingDescription\">Creates a link that shows the number of videos uploaded by the channel next to the subscriber count</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"ambientMode\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"ambientMode\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Ambient Mode</div>\r\n                            <div class=\"settingDescription\">Allows the lighting effect around the video player to be displayed if it is enabled in the player settings</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Playlist</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"reversePlaylist\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"reversePlaylist\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Reverse playlist control</div>\r\n                            <div class=\"settingDescription\">Show a button on playlists to reverse the playlist order</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Video quality</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"defaultQuality\">\r\n                        <div class=\"settingDescription\">\r\n                            <label>\r\n                                <select data-setting=\"defaultQuality\">\r\n                                    <option value=\"highres\">4320p (8k)</option>\r\n                                    <option value=\"hd2880\">2880p (5k)</option>\r\n                                    <option value=\"hd2160\">2160p (4k)</option>\r\n                                    <option value=\"hd1440\">1440p</option>\r\n                                    <option value=\"hd1080\">1080p</option>\r\n                                    <option value=\"hd720\">720p</option>\r\n                                    <option value=\"large\">480p</option>\r\n                                    <option value=\"medium\">360p</option>\r\n                                    <option value=\"small\">240p</option>\r\n                                    <option value=\"tiny\">144p</option>\r\n                                    <option value=\"auto\" selected=\"selected\">Auto</option>\r\n                                </select>\r\n                            </label>\r\n                            <div class=\"settingDescription\">Enforces the preferred or closest quality option</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Playback speed</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"defaultSpeed\">\r\n                        <div class=\"settingDescription\">\r\n                            <label>\r\n                                <select data-setting=\"defaultSpeed\">\r\n                                    <option value=\"0.25\">0.25</option>\r\n                                    <option value=\"0.5\">0.5</option>\r\n                                    <option value=\"0.75\">0.75</option>\r\n                                    <option value=\"1\">Normal</option>\r\n                                    <option value=\"1.25\">1.25</option>\r\n                                    <option value=\"1.5\">1.5</option>\r\n                                    <option value=\"1.75\">1.75</option>\r\n                                    <option value=\"2\">2</option>\r\n                                    <option value=\"-1\" selected=\"selected\">Auto</option>\r\n                                </select>\r\n                            </label>\r\n                            <div class=\"settingDescription\">Enforces the preferred or closest playback speed option</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Player</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"superTheater\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"superTheater\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Super theater</div>\r\n                            <div class=\"settingDescription\">Switching to theater mode will make the player cover the full browser while allowing the page to be scrolled</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"superTheaterScrollbar\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"superTheaterScrollbar\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Show super theater scrollbar</div>\r\n                            <div class=\"settingDescription\">Controls the vertical scrollbar visibility while in super theater mode</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"alwaysVisible\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"alwaysVisible\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Always visible</div>\r\n                            <div class=\"settingDescription\">Changes into an always visible mini player when less than half of the video is visible. The mini player can be moved using the right mouse button</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"hfrAllowed\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"hfrAllowed\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">HFR allowed</div>\r\n                            <div class=\"settingDescription\">Allows HFR (High Frame Rate) streams to be played. YouTube no longer provides normal framerate options above 720p when the respective HFR exists</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"autoplay\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"autoplay\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Autoplay</div>\r\n                            <div class=\"settingDescription\">Videos will play automatically. Does not override the browser settings</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"loudness\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"loudness\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Loudness normalization</div>\r\n                            <div class=\"settingDescription\">Enables YouTube's audio loudness normalization</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"infoCards\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"infoCards\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Info cards</div>\r\n                            <div class=\"settingDescription\">Allows info cards to show on the video</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"annotations\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"annotations\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Annotations</div>\r\n                            <div class=\"settingDescription\">Allow annotations to show on the video</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"endScreen\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"endScreen\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">End screen hidden</div>\r\n                            <div class=\"settingDescription\">Hide end screen when the cursor is over the video</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Volume</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"scrollVolume\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"scrollVolume\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Scroll volume</div>\r\n                            <div class=\"settingDescription\">Change video volume by scrolling on the video player, or by holding shift and scrolling anywhere in the page if the option below is enabled</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"scrollVolumeShift\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"scrollVolumeShift\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Shift + scroll volume</div>\r\n                            <div class=\"settingDescription\">Changing volume using the scroll wheel requires the shift key to be pressed, and can be done from anywhere in the page</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Volume step</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"scrollVolumeStep\">\r\n                        <div class=\"settingDescription\">\r\n                            <label>\r\n                                <select data-setting=\"scrollVolumeStep\">\r\n                                    <option value=\"10\">10</option>\r\n                                    <option value=\"9\">9</option>\r\n                                    <option value=\"8\">8</option>\r\n                                    <option value=\"7\">7</option>\r\n                                    <option value=\"6\">6</option>\r\n                                    <option value=\"5\" selected=\"selected\">5</option>\r\n                                    <option value=\"4\">4</option>\r\n                                    <option value=\"3\">3</option>\r\n                                    <option value=\"2\">2</option>\r\n                                    <option value=\"1\">1</option>\r\n                                </select>\r\n                            </label>\r\n                            <div class=\"settingDescription\">Number of volume steps each scroll will change at once</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"contentTitle\" data-id=\"utilsAndShortcuts\" data-locale=\"contentTitle\">Utils and shortcuts</div>\r\n            <div class=\"contentDescription borderBottom\" data-id=\"utilsAndShortcuts\" data-locale=\"contentDescription\">Show utils and shortcuts below the player. Shortcuts allow features to be controlled directly</div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Utils</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"videoScreenshot\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"videoScreenshot\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Video screenshot</div>\r\n                            <div class=\"settingDescription\">Allows a screenshot to be taken of a playing video at the current native resolution</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"videoThumbnail\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"videoThumbnail\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Video thumbnail</div>\r\n                            <div class=\"settingDescription\">Opens the highest quality thumbnail available</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"monetizationInfo\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"monetizationInfo\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Monetization info</div>\r\n                            <div class=\"settingDescription\">Shows if a video is monetized and how many ads are configured</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Shortcuts</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"autoplayShortcut\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"autoplayShortcut\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Autoplay shortcut</div>\r\n                            <div class=\"settingDescription\">Shortcut that allows autoplay to be controlled from the video page</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"videoFocusToggle\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"videoFocusToggle\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Video focus shortcut</div>\r\n                            <div class=\"settingDescription\">Shortcut that allows video focus to be controlled from the video page</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"content\" data-content=\"blackList\">\r\n            <div class=\"contentTitle\" data-id=\"blackList\" data-locale=\"contentTitle\">Blacklist</div>\r\n            <div class=\"contentDescription borderBottom\" data-id=\"blackList\" data-locale=\"contentDescription\">Videos from blocked channels will no longer be displayed</div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingLabel\">Blacklist</div>\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\" data-id=\"blacklistEnabled\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"blacklistEnabled\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Blacklist enabled</div>\r\n                            <div class=\"settingDescription\">Videos from channels in the blacklist will not be displayed except in its own channel page</div>\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"setting\" data-id=\"blacklistButton\">\r\n                        <label class=\"switch\">\r\n                            <input data-setting=\"blacklistButton\" type=\"checkbox\">\r\n                            <span class=\"slider\"></span>\r\n                        </label>\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Blacklist button</div>\r\n                            <div class=\"settingDescription\">Displays a button in the three vertical dots context menu of video thumbnails to add that channel to the blacklist. This option is not available on vertical shorts thumbnails</div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"contentTitle\" data-locale=\"contentTitle\">Blacklisted channels</div>\r\n            <div class=\"contentDescription borderBottom\" data-locale=\"contentDescription\">Remove blacklisted channels, add channels manually, import from an existing backup, or export the current list</div>\r\n            <div id=\"blacklistControls\">\r\n                <div id=\"filterChannelsContainer\">\r\n                    <input id=\"filterChannels\" type=\"text\" placeholder=\"filter channels\"/>\r\n                </div>\r\n                <div id=\"blacklistActions\">\r\n                    <div id=\"addChannel\" class=\"action-button\">Add</div>\r\n                    <div id=\"importList\" class=\"action-button\">Import</div>\r\n                    <div id=\"exportList\" class=\"action-button\">Export</div>\r\n                </div>\r\n            </div>\r\n            <div id=\"blacklistChannels\"></div>\r\n        </div>\r\n        <div class=\"content\" data-content=\"help\">\r\n            <div class=\"contentTitle\" data-id=\"help\" data-locale=\"contentTitle\">Help</div>\r\n            <div class=\"contentDescription borderBottom\" data-id=\"help\" data-locale=\"contentDescription\">Troubleshoot or report problems with the extension</div>\r\n            <div class=\"settingGroup\">\r\n                <div class=\"settingOptions\">\r\n                    <div class=\"setting\">\r\n                        <div class=\"settingDescription\">\r\n                            <div class=\"settingDescription highlight\">Report a problem</div>\r\n                            <div class=\"settingDescription\">If you found an issue or a bug with the extension please follow the instructions for reporting a bug below</div>\r\n                            <div class=\"settingDescription\"><a target=\"_blank\" href=\"https://github.com/ParticleCore/Iridium/wiki/Report-a-bug\">Report bug</a></div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n<div id=\"version\"></div>\r\n<script src=\"data:text/javascript;base64,InVzZSBzdHJpY3QiOw0KDQpnbG9iYWxUaGlzLmJyb3dzZXIgPz89IGNocm9tZTsNCg0KY29uc3Qgc2V0dGluZ3MgPSB7fTsNCmNvbnN0IG9wdGlvbnMgPSBbXTsNCmNvbnN0IGoyZCA9ICgoKSA9PiB7DQoNCiAgICBjb25zdCBwcm9jZXNzTm9kZSA9IChlbGVtZW50LCBhdHRyaWJ1dGVzLCBjaGlsZHJlbikgPT4gew0KDQogICAgICAgIGlmIChBcnJheS5pc0FycmF5KGF0dHJpYnV0ZXMpDQogICAgICAgICAgICB8fCB0eXBlb2YgYXR0cmlidXRlcyA9PT0gInN0cmluZyINCiAgICAgICAgICAgIHx8IGF0dHJpYnV0ZXMgaW5zdGFuY2VvZiBTdHJpbmcNCiAgICAgICAgKSB7DQogICAgICAgICAgICBjaGlsZHJlbiA9IGF0dHJpYnV0ZXM7DQogICAgICAgICAgICBhdHRyaWJ1dGVzID0ge307DQogICAgICAgIH0NCg0KICAgICAgICBmb3IgKGxldCBuYW1lIGluIGF0dHJpYnV0ZXMpIHsNCiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKG5hbWUsIGF0dHJpYnV0ZXNbbmFtZV0pOw0KICAgICAgICB9DQoNCiAgICAgICAgaWYgKGNoaWxkcmVuKSB7DQogICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZHJlbikpIHsNCiAgICAgICAgICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbikgew0KICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQuY29uc3RydWN0b3IgPT09IFN0cmluZykgew0KICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dE5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGlsZCk7DQogICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRleHROb2RlKTsNCiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsNCiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQoY2hpbGQpOw0KICAgICAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZHJlbi5jb25zdHJ1Y3RvciA9PT0gU3RyaW5nKSB7DQogICAgICAgICAgICAgICAgZWxlbWVudC50ZXh0Q29udGVudCA9IGNoaWxkcmVuOw0KICAgICAgICAgICAgfQ0KICAgICAgICB9DQoNCiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7DQoNCiAgICB9Ow0KDQogICAgcmV0dXJuIHsNCiAgICAgICAgbWFrZTogKG5vZGUsIGF0dHJpYnV0ZXMsIGNoaWxkcmVuKSA9PiBwcm9jZXNzTm9kZShkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGUpLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbiksDQogICAgICAgIG1ha2VTVkc6IChub2RlLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbikgPT4gcHJvY2Vzc05vZGUoZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIsIG5vZGUpLCBhdHRyaWJ1dGVzLCBjaGlsZHJlbikNCiAgICB9Ow0KDQp9KSgpOw0KY29uc3QgTWFuYWdlciA9IHsNCiAgICB1cGRhdGVTeW5jU2V0dGluZ3M6IChuZXdTdGF0ZSwgdXNlckludGVyYWN0aW9uKSA9PiB7DQoNCiAgICAgICAgY29uc3Qgc2V0dGluZ0lkID0gU2V0dGluZ0RhdGEuc3luY1NldHRpbmdzLmlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLmNoZWNrZWQgIT09IG5ld1N0YXRlKSB7DQogICAgICAgICAgICB1aS5jaGVja2VkID0gbmV3U3RhdGU7DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoIXVzZXJJbnRlcmFjdGlvbikgcmV0dXJuOw0KDQogICAgICAgIHNldHRpbmdzW3NldHRpbmdJZF0gPSBuZXdTdGF0ZTsNCg0KICAgICAgICAoYXN5bmMgKCkgPT4gew0KDQogICAgICAgICAgICAvLyB0byBwcm9wZXJseSBtaWdyYXRlIHN0b3JhZ2UgYXJlYXM6DQogICAgICAgICAgICAvLyByZW1vdmUgbGlzdGVuZXIgZnJvbSBvbGQgc3RvcmFnZSBhcmVhDQogICAgICAgICAgICAvLyBhZGQgbGlzdGVuZXIgdG8gbmV3IHN0b3JhZ2UgYXJlYQ0KICAgICAgICAgICAgLy8gc2F2ZSBhbGwgc2V0dGluZ3MgaW4gbmV3IHN0b3JhZ2UgYXJlYQ0KICAgICAgICAgICAgLy8gdXBkYXRlIHN5bmMgc2V0dGluZyBpbiBwcmV2aW91cyBzdG9yYWdlIGFyZWEgdG8gc2lnbmFsIGNoYW5nZSB0byBvcGVuIHRhYnMNCiAgICAgICAgICAgIC8vIGNsZWFyIG9sZCBzdG9yYWdlIGFyZWENCg0KICAgICAgICAgICAgaWYgKG5ld1N0YXRlID09PSB0cnVlKSB7DQogICAgICAgICAgICAgICAgYnJvd3Nlci5zdG9yYWdlLmxvY2FsLm9uQ2hhbmdlZC5yZW1vdmVMaXN0ZW5lcihVdGlsLm9uU3RvcmFnZUNoYW5nZWRMaXN0ZW5lcik7DQogICAgICAgICAgICAgICAgYnJvd3Nlci5zdG9yYWdlLnN5bmMub25DaGFuZ2VkLmFkZExpc3RlbmVyKFV0aWwub25TdG9yYWdlQ2hhbmdlZExpc3RlbmVyKTsNCiAgICAgICAgICAgICAgICBhd2FpdCBVdGlsLnNhdmVEYXRhKHNldHRpbmdzKTsNCiAgICAgICAgICAgICAgICBhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuc2V0KHtbU2V0dGluZ0RhdGEuc3luY1NldHRpbmdzLmlkXTogbmV3U3RhdGV9KTsNCiAgICAgICAgICAgICAgICBhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuY2xlYXIoKTsNCiAgICAgICAgICAgIH0gZWxzZSB7DQogICAgICAgICAgICAgICAgYnJvd3Nlci5zdG9yYWdlLnN5bmMub25DaGFuZ2VkLnJlbW92ZUxpc3RlbmVyKFV0aWwub25TdG9yYWdlQ2hhbmdlZExpc3RlbmVyKTsNCiAgICAgICAgICAgICAgICBicm93c2VyLnN0b3JhZ2UubG9jYWwub25DaGFuZ2VkLmFkZExpc3RlbmVyKFV0aWwub25TdG9yYWdlQ2hhbmdlZExpc3RlbmVyKTsNCiAgICAgICAgICAgICAgICBhd2FpdCBVdGlsLnNhdmVEYXRhKHNldHRpbmdzKTsNCiAgICAgICAgICAgICAgICBhd2FpdCBicm93c2VyLnN0b3JhZ2Uuc3luYy5zZXQoe1tTZXR0aW5nRGF0YS5zeW5jU2V0dGluZ3MuaWRdOiBuZXdTdGF0ZX0pOw0KICAgICAgICAgICAgICAgIGF3YWl0IGJyb3dzZXIuc3RvcmFnZS5zeW5jLmNsZWFyKCk7DQogICAgICAgICAgICB9DQoNCiAgICAgICAgfSkoKTsNCg0KICAgIH0sDQogICAgdXBkYXRlRXh0ZW5zaW9uQnV0dG9uOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLmV4dGVuc2lvbkJ1dHRvbi5pZDsNCiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zZXR0aW5nPSR7c2V0dGluZ0lkfV1gKTsNCg0KICAgICAgICBpZiAodWkgIT0gbnVsbCAmJiB1aS5jaGVja2VkICE9PSBuZXdTdGF0ZSkgew0KICAgICAgICAgICAgdWkuY2hlY2tlZCA9IG5ld1N0YXRlOw0KICAgICAgICB9DQoNCiAgICAgICAgaWYgKCF1c2VySW50ZXJhY3Rpb24pIHJldHVybjsNCg0KICAgICAgICBVdGlsLnVwZGF0ZVNpbmdsZVNldHRpbmcoc2V0dGluZ0lkLCBuZXdTdGF0ZSk7DQoNCiAgICB9LA0KICAgIHVwZGF0ZUZ1bGxUaXRsZXM6IChuZXdTdGF0ZSwgdXNlckludGVyYWN0aW9uKSA9PiB7DQoNCiAgICAgICAgY29uc3Qgc2V0dGluZ0lkID0gU2V0dGluZ0RhdGEuZnVsbFRpdGxlcy5pZDsNCiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zZXR0aW5nPSR7c2V0dGluZ0lkfV1gKTsNCg0KICAgICAgICBpZiAodWkgIT0gbnVsbCAmJiB1aS5jaGVja2VkICE9PSBuZXdTdGF0ZSkgew0KICAgICAgICAgICAgdWkuY2hlY2tlZCA9IG5ld1N0YXRlOw0KICAgICAgICB9DQoNCiAgICAgICAgaWYgKCF1c2VySW50ZXJhY3Rpb24pIHJldHVybjsNCg0KICAgICAgICBVdGlsLnVwZGF0ZVNpbmdsZVNldHRpbmcoc2V0dGluZ0lkLCBuZXdTdGF0ZSk7DQoNCiAgICB9LA0KICAgIHVwZGF0ZVRoZW1lOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGZ1bmN0aW9uIHRvZ2dsZVRoZW1lKGlzRGFyaykgew0KICAgICAgICAgICAgaWYgKGlzRGFyaykgew0KICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoImRhcmsiLCAiIik7DQogICAgICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoImRhcmsiKTsNCiAgICAgICAgICAgIH0NCiAgICAgICAgfQ0KDQogICAgICAgIGNvbnN0IGFsbG93ZWRWYWx1ZXMgPSBbDQogICAgICAgICAgICAiZGV2aWNlVGhlbWUiLA0KICAgICAgICAgICAgImRhcmtUaGVtZSIsDQogICAgICAgICAgICAibGlnaHRUaGVtZSIsDQogICAgICAgIF07DQoNCiAgICAgICAgaWYgKGFsbG93ZWRWYWx1ZXMuaW5kZXhPZihuZXdTdGF0ZSkgPCAwKSB7DQogICAgICAgICAgICBuZXdTdGF0ZSA9ICJkZXZpY2VUaGVtZSI7DQogICAgICAgIH0NCg0KICAgICAgICAvLyB0aGUgYnJvd3NlciBtaWdodCBub3QgYmUgYWJsZSB0byBpbmZvcm0gdGhlIHVzZXIncyBzeXN0ZW0gdGhlbWUNCiAgICAgICAgLy8gd2UgbXVzdCBjaGVjayBmb3IgdGhpcyBmaXJzdCBhbmQgZmFsbGJhY2sgdG8gZGFyayBpZiBpdCBpcyBub3QNCiAgICAgICAgaWYgKG5ld1N0YXRlID09PSAiZGV2aWNlVGhlbWUiICYmIHdpbmRvdz8ubWF0Y2hNZWRpYSgiKHByZWZlcnMtY29sb3Itc2NoZW1lKSIpPy5tYXRjaGVzICE9PSB0cnVlKSB7DQogICAgICAgICAgICBuZXdTdGF0ZSA9ICJkYXJrVGhlbWUiOw0KICAgICAgICB9DQoNCiAgICAgICAgY29uc3Qgc2V0dGluZ0lkID0gU2V0dGluZ0RhdGEudGhlbWUuaWQ7DQogICAgICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2V0dGluZz0ke3NldHRpbmdJZH1dW3ZhbHVlPSR7bmV3U3RhdGV9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmICF1aS5jaGVja2VkKSB7DQogICAgICAgICAgICB1aS5jaGVja2VkID0gdHJ1ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIHN3aXRjaCAobmV3U3RhdGUpIHsNCiAgICAgICAgICAgIGNhc2UgImRldmljZVRoZW1lIjoNCiAgICAgICAgICAgICAgICB0b2dnbGVUaGVtZSh3aW5kb3c/Lm1hdGNoTWVkaWEoIihwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyaykiKT8ubWF0Y2hlcyA9PT0gdHJ1ZSk7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICBjYXNlICJkYXJrVGhlbWUiOg0KICAgICAgICAgICAgICAgIHRvZ2dsZVRoZW1lKHRydWUpOw0KICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICAgICAgY2FzZSAibGlnaHRUaGVtZSI6DQogICAgICAgICAgICAgICAgdG9nZ2xlVGhlbWUoZmFsc2UpOw0KICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICB9DQoNCiAgICAgICAgaWYgKCF1c2VySW50ZXJhY3Rpb24pIHJldHVybjsNCg0KICAgICAgICBVdGlsLnVwZGF0ZVNpbmdsZVNldHRpbmcoc2V0dGluZ0lkLCBuZXdTdGF0ZSk7DQoNCiAgICB9LA0KICAgIHVwZGF0ZUxvZ29TdWJzY3JpcHRpb25zOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLmxvZ29TdWJzY3JpcHRpb25zLmlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLmNoZWNrZWQgIT09IG5ld1N0YXRlKSB7DQogICAgICAgICAgICB1aS5jaGVja2VkID0gbmV3U3RhdGU7DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoIXVzZXJJbnRlcmFjdGlvbikgcmV0dXJuOw0KDQogICAgICAgIFV0aWwudXBkYXRlU2luZ2xlU2V0dGluZyhzZXR0aW5nSWQsIG5ld1N0YXRlKTsNCg0KICAgIH0sDQogICAgdXBkYXRlQXV0b3BsYXlDaGFubmVsVHJhaWxlcjogKG5ld1N0YXRlLCB1c2VySW50ZXJhY3Rpb24pID0+IHsNCg0KICAgICAgICBjb25zdCBzZXR0aW5nSWQgPSBTZXR0aW5nRGF0YS5hdXRvcGxheUNoYW5uZWxUcmFpbGVyLmlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLmNoZWNrZWQgIT09IG5ld1N0YXRlKSB7DQogICAgICAgICAgICB1aS5jaGVja2VkID0gbmV3U3RhdGU7DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoIXVzZXJJbnRlcmFjdGlvbikgcmV0dXJuOw0KDQogICAgICAgIFV0aWwudXBkYXRlU2luZ2xlU2V0dGluZyhzZXR0aW5nSWQsIG5ld1N0YXRlKTsNCg0KICAgIH0sDQogICAgdXBkYXRlQ2hhbm5lbFRhYjogKG5ld1N0YXRlLCB1c2VySW50ZXJhY3Rpb24pID0+IHsNCg0KICAgICAgICBjb25zdCBzZXR0aW5nSWQgPSBTZXR0aW5nRGF0YS5jaGFubmVsVGFiLmlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLnZhbHVlICE9PSBuZXdTdGF0ZSkgew0KICAgICAgICAgICAgdWkudmFsdWUgPSBuZXdTdGF0ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVTaG9ydHM6IChpZCwgbmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IGlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLmNoZWNrZWQgIT09IG5ld1N0YXRlKSB7DQogICAgICAgICAgICB1aS5jaGVja2VkID0gbmV3U3RhdGU7DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoIXVzZXJJbnRlcmFjdGlvbikgcmV0dXJuOw0KDQogICAgICAgIFV0aWwudXBkYXRlU2luZ2xlU2V0dGluZyhzZXR0aW5nSWQsIG5ld1N0YXRlKTsNCg0KICAgIH0sDQogICAgdXBkYXRlQWRNYW5hZ2VyOiAoaWQsIG5ld1N0YXRlLCB1c2VySW50ZXJhY3Rpb24pID0+IHsNCg0KICAgICAgICBjb25zdCBzZXR0aW5nSWQgPSBpZDsNCiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zZXR0aW5nPSR7c2V0dGluZ0lkfV1gKTsNCg0KICAgICAgICBpZiAodWkgIT0gbnVsbCAmJiB1aS5jaGVja2VkICE9PSBuZXdTdGF0ZSkgew0KICAgICAgICAgICAgdWkuY2hlY2tlZCA9IG5ld1N0YXRlOw0KICAgICAgICB9DQoNCiAgICAgICAgaWYgKGlkID09PSBTZXR0aW5nRGF0YS5hZE9wdE91dEFsbC5pZCkgew0KDQogICAgICAgICAgICBjb25zdCBpZExpc3QgPSBbDQogICAgICAgICAgICAgICAgU2V0dGluZ0RhdGEuYWRWaWRlb0ZlZWQuaWQsDQogICAgICAgICAgICAgICAgU2V0dGluZ0RhdGEuYWRJblZpZGVvLmlkLA0KICAgICAgICAgICAgICAgIFNldHRpbmdEYXRhLmFkVGFnZ2VkUHJvZHVjdHMuaWQsDQogICAgICAgICAgICAgICAgU2V0dGluZ0RhdGEuYWRNYXN0aGVhZC5pZCwNCiAgICAgICAgICAgICAgICBTZXR0aW5nRGF0YS5hZEhvbWVGZWVkLmlkLA0KICAgICAgICAgICAgICAgIFNldHRpbmdEYXRhLmFkU2VhcmNoRmVlZC5pZCwNCiAgICAgICAgICAgIF0ubWFwKHZhbHVlID0+IGBbZGF0YS1pZD0iJHt2YWx1ZX0iXWApLmpvaW4oKTsNCg0KICAgICAgICAgICAgY29uc3QgZGVwZW5kZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoaWRMaXN0KTsNCg0KICAgICAgICAgICAgaWYgKG5ld1N0YXRlKSB7DQogICAgICAgICAgICAgICAgZGVwZW5kZW50cy5mb3JFYWNoKHZhbHVlID0+IHZhbHVlLmNsYXNzTGlzdC5hZGQoImRpc2FibGVkIikpOw0KICAgICAgICAgICAgfSBlbHNlIHsNCiAgICAgICAgICAgICAgICBkZXBlbmRlbnRzLmZvckVhY2godmFsdWUgPT4gdmFsdWUuY2xhc3NMaXN0LnJlbW92ZSgiZGlzYWJsZWQiKSk7DQogICAgICAgICAgICB9DQoNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVWaWRlb0ZvY3VzOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLnZpZGVvRm9jdXMuaWQ7DQogICAgICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2V0dGluZz0ke3NldHRpbmdJZH1dYCk7DQoNCiAgICAgICAgaWYgKHVpICE9IG51bGwgJiYgdWkuY2hlY2tlZCAhPT0gbmV3U3RhdGUpIHsNCiAgICAgICAgICAgIHVpLmNoZWNrZWQgPSBuZXdTdGF0ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVDcmVhdG9yTWVyY2g6IChuZXdTdGF0ZSwgdXNlckludGVyYWN0aW9uKSA9PiB7DQoNCiAgICAgICAgY29uc3Qgc2V0dGluZ0lkID0gU2V0dGluZ0RhdGEuY3JlYXRvck1lcmNoLmlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLmNoZWNrZWQgIT09IG5ld1N0YXRlKSB7DQogICAgICAgICAgICB1aS5jaGVja2VkID0gbmV3U3RhdGU7DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoIXVzZXJJbnRlcmFjdGlvbikgcmV0dXJuOw0KDQogICAgICAgIFV0aWwudXBkYXRlU2luZ2xlU2V0dGluZyhzZXR0aW5nSWQsIG5ld1N0YXRlKTsNCg0KICAgIH0sDQogICAgdXBkYXRlVmlkZW9Db3VudDogKG5ld1N0YXRlLCB1c2VySW50ZXJhY3Rpb24pID0+IHsNCg0KICAgICAgICBjb25zdCBzZXR0aW5nSWQgPSBTZXR0aW5nRGF0YS52aWRlb0NvdW50LmlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLmNoZWNrZWQgIT09IG5ld1N0YXRlKSB7DQogICAgICAgICAgICB1aS5jaGVja2VkID0gbmV3U3RhdGU7DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoIXVzZXJJbnRlcmFjdGlvbikgcmV0dXJuOw0KDQogICAgICAgIFV0aWwudXBkYXRlU2luZ2xlU2V0dGluZyhzZXR0aW5nSWQsIG5ld1N0YXRlKTsNCg0KICAgIH0sDQogICAgdXBkYXRlQW1iaWVudE1vZGU6IChuZXdTdGF0ZSwgdXNlckludGVyYWN0aW9uKSA9PiB7DQoNCiAgICAgICAgY29uc3Qgc2V0dGluZ0lkID0gU2V0dGluZ0RhdGEuYW1iaWVudE1vZGUuaWQ7DQogICAgICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2V0dGluZz0ke3NldHRpbmdJZH1dYCk7DQoNCiAgICAgICAgaWYgKHVpICE9IG51bGwgJiYgdWkuY2hlY2tlZCAhPT0gbmV3U3RhdGUpIHsNCiAgICAgICAgICAgIHVpLmNoZWNrZWQgPSBuZXdTdGF0ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVSZXZlcnNlUGxheWxpc3Q6IChuZXdTdGF0ZSwgdXNlckludGVyYWN0aW9uKSA9PiB7DQoNCiAgICAgICAgY29uc3Qgc2V0dGluZ0lkID0gU2V0dGluZ0RhdGEucmV2ZXJzZVBsYXlsaXN0LmlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLmNoZWNrZWQgIT09IG5ld1N0YXRlKSB7DQogICAgICAgICAgICB1aS5jaGVja2VkID0gbmV3U3RhdGU7DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoIXVzZXJJbnRlcmFjdGlvbikgcmV0dXJuOw0KDQogICAgICAgIFV0aWwudXBkYXRlU2luZ2xlU2V0dGluZyhzZXR0aW5nSWQsIG5ld1N0YXRlKTsNCg0KICAgIH0sDQogICAgdXBkYXRlU3VwZXJUaGVhdGVyOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLnN1cGVyVGhlYXRlci5pZDsNCiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zZXR0aW5nPSR7c2V0dGluZ0lkfV1gKTsNCg0KICAgICAgICBpZiAodWkgIT0gbnVsbCAmJiB1aS5jaGVja2VkICE9PSBuZXdTdGF0ZSkgew0KICAgICAgICAgICAgdWkuY2hlY2tlZCA9IG5ld1N0YXRlOw0KICAgICAgICB9DQoNCiAgICAgICAgaWYgKCF1c2VySW50ZXJhY3Rpb24pIHJldHVybjsNCg0KICAgICAgICBVdGlsLnVwZGF0ZVNpbmdsZVNldHRpbmcoc2V0dGluZ0lkLCBuZXdTdGF0ZSk7DQoNCiAgICB9LA0KICAgIHVwZGF0ZVN1cGVyVGhlYXRlclNjcm9sbGJhcjogKG5ld1N0YXRlLCB1c2VySW50ZXJhY3Rpb24pID0+IHsNCg0KICAgICAgICBjb25zdCBzZXR0aW5nSWQgPSBTZXR0aW5nRGF0YS5zdXBlclRoZWF0ZXJTY3JvbGxiYXIuaWQ7DQogICAgICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2V0dGluZz0ke3NldHRpbmdJZH1dYCk7DQoNCiAgICAgICAgaWYgKHVpICE9IG51bGwgJiYgdWkuY2hlY2tlZCAhPT0gbmV3U3RhdGUpIHsNCiAgICAgICAgICAgIHVpLmNoZWNrZWQgPSBuZXdTdGF0ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVBdXRvcGxheTogKG5ld1N0YXRlLCB1c2VySW50ZXJhY3Rpb24pID0+IHsNCg0KICAgICAgICBjb25zdCBzZXR0aW5nSWQgPSBTZXR0aW5nRGF0YS5hdXRvcGxheS5pZDsNCiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zZXR0aW5nPSR7c2V0dGluZ0lkfV1gKTsNCg0KICAgICAgICBpZiAodWkgIT0gbnVsbCAmJiB1aS5jaGVja2VkICE9PSBuZXdTdGF0ZSkgew0KICAgICAgICAgICAgdWkuY2hlY2tlZCA9IG5ld1N0YXRlOw0KICAgICAgICB9DQoNCiAgICAgICAgaWYgKCF1c2VySW50ZXJhY3Rpb24pIHJldHVybjsNCg0KICAgICAgICBVdGlsLnVwZGF0ZVNpbmdsZVNldHRpbmcoc2V0dGluZ0lkLCBuZXdTdGF0ZSk7DQoNCiAgICB9LA0KICAgIHVwZGF0ZUxvdWRuZXNzOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLmxvdWRuZXNzLmlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLmNoZWNrZWQgIT09IG5ld1N0YXRlKSB7DQogICAgICAgICAgICB1aS5jaGVja2VkID0gbmV3U3RhdGU7DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoIXVzZXJJbnRlcmFjdGlvbikgcmV0dXJuOw0KDQogICAgICAgIFV0aWwudXBkYXRlU2luZ2xlU2V0dGluZyhzZXR0aW5nSWQsIG5ld1N0YXRlKTsNCg0KICAgIH0sDQogICAgdXBkYXRlU2Nyb2xsVm9sdW1lOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLnNjcm9sbFZvbHVtZS5pZDsNCiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zZXR0aW5nPSR7c2V0dGluZ0lkfV1gKTsNCg0KICAgICAgICBpZiAodWkgIT0gbnVsbCAmJiB1aS5jaGVja2VkICE9PSBuZXdTdGF0ZSkgew0KICAgICAgICAgICAgdWkuY2hlY2tlZCA9IG5ld1N0YXRlOw0KICAgICAgICB9DQoNCiAgICAgICAgY29uc3QgaWRMaXN0ID0gWw0KICAgICAgICAgICAgU2V0dGluZ0RhdGEuc2Nyb2xsVm9sdW1lU2hpZnQuaWQsDQogICAgICAgICAgICBTZXR0aW5nRGF0YS5zY3JvbGxWb2x1bWVTdGVwLmlkLA0KICAgICAgICBdLm1hcCh2YWx1ZSA9PiBgW2RhdGEtaWQ9IiR7dmFsdWV9Il1gKS5qb2luKCk7DQoNCiAgICAgICAgY29uc3QgZGVwZW5kZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoaWRMaXN0KTsNCg0KICAgICAgICBpZiAobmV3U3RhdGUpIHsNCiAgICAgICAgICAgIGRlcGVuZGVudHMuZm9yRWFjaCh2YWx1ZSA9PiB2YWx1ZS5jbGFzc0xpc3QucmVtb3ZlKCJkaXNhYmxlZCIpKTsNCiAgICAgICAgfSBlbHNlIHsNCiAgICAgICAgICAgIGRlcGVuZGVudHMuZm9yRWFjaCh2YWx1ZSA9PiB2YWx1ZS5jbGFzc0xpc3QuYWRkKCJkaXNhYmxlZCIpKTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVTY3JvbGxWb2x1bWVTaGlmdDogKG5ld1N0YXRlLCB1c2VySW50ZXJhY3Rpb24pID0+IHsNCg0KICAgICAgICBjb25zdCBzZXR0aW5nSWQgPSBTZXR0aW5nRGF0YS5zY3JvbGxWb2x1bWVTaGlmdC5pZDsNCiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zZXR0aW5nPSR7c2V0dGluZ0lkfV1gKTsNCg0KICAgICAgICBpZiAodWkgIT0gbnVsbCAmJiB1aS5jaGVja2VkICE9PSBuZXdTdGF0ZSkgew0KICAgICAgICAgICAgdWkuY2hlY2tlZCA9IG5ld1N0YXRlOw0KICAgICAgICB9DQoNCiAgICAgICAgaWYgKCF1c2VySW50ZXJhY3Rpb24pIHJldHVybjsNCg0KICAgICAgICBVdGlsLnVwZGF0ZVNpbmdsZVNldHRpbmcoc2V0dGluZ0lkLCBuZXdTdGF0ZSk7DQoNCiAgICB9LA0KICAgIHVwZGF0ZVNjcm9sbFZvbHVtZVN0ZXA6IChuZXdTdGF0ZSwgdXNlckludGVyYWN0aW9uKSA9PiB7DQoNCiAgICAgICAgY29uc3Qgc2V0dGluZ0lkID0gU2V0dGluZ0RhdGEuc2Nyb2xsVm9sdW1lU3RlcC5pZDsNCiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zZXR0aW5nPSR7c2V0dGluZ0lkfV1gKTsNCg0KICAgICAgICBpZiAodWkgIT0gbnVsbCAmJiB1aS52YWx1ZSAhPT0gbmV3U3RhdGUpIHsNCiAgICAgICAgICAgIHVpLnZhbHVlID0gbmV3U3RhdGU7DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoIXVzZXJJbnRlcmFjdGlvbikgcmV0dXJuOw0KDQogICAgICAgIFV0aWwudXBkYXRlU2luZ2xlU2V0dGluZyhzZXR0aW5nSWQsIG5ld1N0YXRlKTsNCg0KICAgIH0sDQogICAgdXBkYXRlSW5mb0NhcmRzOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLmluZm9DYXJkcy5pZDsNCiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zZXR0aW5nPSR7c2V0dGluZ0lkfV1gKTsNCg0KICAgICAgICBpZiAodWkgIT0gbnVsbCAmJiB1aS5jaGVja2VkICE9PSBuZXdTdGF0ZSkgew0KICAgICAgICAgICAgdWkuY2hlY2tlZCA9IG5ld1N0YXRlOw0KICAgICAgICB9DQoNCiAgICAgICAgaWYgKCF1c2VySW50ZXJhY3Rpb24pIHJldHVybjsNCg0KICAgICAgICBVdGlsLnVwZGF0ZVNpbmdsZVNldHRpbmcoc2V0dGluZ0lkLCBuZXdTdGF0ZSk7DQoNCiAgICB9LA0KICAgIHVwZGF0ZUFubm90YXRpb25zOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLmFubm90YXRpb25zLmlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLmNoZWNrZWQgIT09IG5ld1N0YXRlKSB7DQogICAgICAgICAgICB1aS5jaGVja2VkID0gbmV3U3RhdGU7DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoIXVzZXJJbnRlcmFjdGlvbikgcmV0dXJuOw0KDQogICAgICAgIFV0aWwudXBkYXRlU2luZ2xlU2V0dGluZyhzZXR0aW5nSWQsIG5ld1N0YXRlKTsNCg0KICAgIH0sDQogICAgdXBkYXRlRW5kU2NyZWVuOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLmVuZFNjcmVlbi5pZDsNCiAgICAgICAgY29uc3QgdWkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1zZXR0aW5nPSR7c2V0dGluZ0lkfV1gKTsNCg0KICAgICAgICBpZiAodWkgIT0gbnVsbCAmJiB1aS5jaGVja2VkICE9PSBuZXdTdGF0ZSkgew0KICAgICAgICAgICAgdWkuY2hlY2tlZCA9IG5ld1N0YXRlOw0KICAgICAgICB9DQoNCiAgICAgICAgaWYgKCF1c2VySW50ZXJhY3Rpb24pIHJldHVybjsNCg0KICAgICAgICBVdGlsLnVwZGF0ZVNpbmdsZVNldHRpbmcoc2V0dGluZ0lkLCBuZXdTdGF0ZSk7DQoNCiAgICB9LA0KICAgIHVwZGF0ZURlZmF1bHRRdWFsaXR5OiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLmRlZmF1bHRRdWFsaXR5LmlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLnZhbHVlICE9PSBuZXdTdGF0ZSkgew0KICAgICAgICAgICAgdWkudmFsdWUgPSBuZXdTdGF0ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVEZWZhdWx0U3BlZWQ6IChuZXdTdGF0ZSwgdXNlckludGVyYWN0aW9uKSA9PiB7DQoNCiAgICAgICAgY29uc3Qgc2V0dGluZ0lkID0gU2V0dGluZ0RhdGEuZGVmYXVsdFNwZWVkLmlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLnZhbHVlICE9PSBuZXdTdGF0ZSkgew0KICAgICAgICAgICAgdWkudmFsdWUgPSBuZXdTdGF0ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVBbHdheXNWaXNpYmxlOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLmFsd2F5c1Zpc2libGUuaWQ7DQogICAgICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2V0dGluZz0ke3NldHRpbmdJZH1dYCk7DQoNCiAgICAgICAgaWYgKHVpICE9IG51bGwgJiYgdWkuY2hlY2tlZCAhPT0gbmV3U3RhdGUpIHsNCiAgICAgICAgICAgIHVpLmNoZWNrZWQgPSBuZXdTdGF0ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVIRlJBbGxvd2VkOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLmhmckFsbG93ZWQuaWQ7DQogICAgICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2V0dGluZz0ke3NldHRpbmdJZH1dYCk7DQoNCiAgICAgICAgaWYgKHVpICE9IG51bGwgJiYgdWkuY2hlY2tlZCAhPT0gbmV3U3RhdGUpIHsNCiAgICAgICAgICAgIHVpLmNoZWNrZWQgPSBuZXdTdGF0ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVBdXRvcGxheVNob3J0Y3V0OiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLmF1dG9wbGF5U2hvcnRjdXQuaWQ7DQogICAgICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2V0dGluZz0ke3NldHRpbmdJZH1dYCk7DQoNCiAgICAgICAgaWYgKHVpICE9IG51bGwgJiYgdWkuY2hlY2tlZCAhPT0gbmV3U3RhdGUpIHsNCiAgICAgICAgICAgIHVpLmNoZWNrZWQgPSBuZXdTdGF0ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVWaWRlb0ZvY3VzVG9nZ2xlOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLnZpZGVvRm9jdXNUb2dnbGUuaWQ7DQogICAgICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2V0dGluZz0ke3NldHRpbmdJZH1dYCk7DQoNCiAgICAgICAgaWYgKHVpICE9IG51bGwgJiYgdWkuY2hlY2tlZCAhPT0gbmV3U3RhdGUpIHsNCiAgICAgICAgICAgIHVpLmNoZWNrZWQgPSBuZXdTdGF0ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVWaWRlb1NjcmVlbnNob3Q6IChuZXdTdGF0ZSwgdXNlckludGVyYWN0aW9uKSA9PiB7DQoNCiAgICAgICAgY29uc3Qgc2V0dGluZ0lkID0gU2V0dGluZ0RhdGEudmlkZW9TY3JlZW5zaG90LmlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLmNoZWNrZWQgIT09IG5ld1N0YXRlKSB7DQogICAgICAgICAgICB1aS5jaGVja2VkID0gbmV3U3RhdGU7DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoIXVzZXJJbnRlcmFjdGlvbikgcmV0dXJuOw0KDQogICAgICAgIFV0aWwudXBkYXRlU2luZ2xlU2V0dGluZyhzZXR0aW5nSWQsIG5ld1N0YXRlKTsNCg0KICAgIH0sDQogICAgdXBkYXRlVmlkZW9UaHVtYm5haWw6IChuZXdTdGF0ZSwgdXNlckludGVyYWN0aW9uKSA9PiB7DQoNCiAgICAgICAgY29uc3Qgc2V0dGluZ0lkID0gU2V0dGluZ0RhdGEudmlkZW9UaHVtYm5haWwuaWQ7DQogICAgICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2V0dGluZz0ke3NldHRpbmdJZH1dYCk7DQoNCiAgICAgICAgaWYgKHVpICE9IG51bGwgJiYgdWkuY2hlY2tlZCAhPT0gbmV3U3RhdGUpIHsNCiAgICAgICAgICAgIHVpLmNoZWNrZWQgPSBuZXdTdGF0ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVNb25ldGl6YXRpb25JbmZvOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLm1vbmV0aXphdGlvbkluZm8uaWQ7DQogICAgICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2V0dGluZz0ke3NldHRpbmdJZH1dYCk7DQoNCiAgICAgICAgaWYgKHVpICE9IG51bGwgJiYgdWkuY2hlY2tlZCAhPT0gbmV3U3RhdGUpIHsNCiAgICAgICAgICAgIHVpLmNoZWNrZWQgPSBuZXdTdGF0ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVCbGFja2xpc3RFbmFibGVkOiAobmV3U3RhdGUsIHVzZXJJbnRlcmFjdGlvbikgPT4gew0KDQogICAgICAgIGNvbnN0IHNldHRpbmdJZCA9IFNldHRpbmdEYXRhLmJsYWNrbGlzdEVuYWJsZWQuaWQ7DQogICAgICAgIGNvbnN0IHVpID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2RhdGEtc2V0dGluZz0ke3NldHRpbmdJZH1dYCk7DQoNCiAgICAgICAgaWYgKHVpICE9IG51bGwgJiYgdWkuY2hlY2tlZCAhPT0gbmV3U3RhdGUpIHsNCiAgICAgICAgICAgIHVpLmNoZWNrZWQgPSBuZXdTdGF0ZTsNCiAgICAgICAgfQ0KDQogICAgICAgIGNvbnN0IGRlcGVuZGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWlkPSR7U2V0dGluZ0RhdGEuYmxhY2tsaXN0QnV0dG9uLmlkfV1gKTsNCg0KICAgICAgICBpZiAobmV3U3RhdGUpIHsNCiAgICAgICAgICAgIGRlcGVuZGVudD8uY2xhc3NMaXN0LnJlbW92ZSgiZGlzYWJsZWQiKTsNCiAgICAgICAgfSBlbHNlIHsNCiAgICAgICAgICAgIGRlcGVuZGVudD8uY2xhc3NMaXN0LmFkZCgiZGlzYWJsZWQiKTsNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3U3RhdGUpOw0KDQogICAgfSwNCiAgICB1cGRhdGVCbGFja2xpc3RCdXR0b246IChuZXdTdGF0ZSwgdXNlckludGVyYWN0aW9uKSA9PiB7DQoNCiAgICAgICAgY29uc3Qgc2V0dGluZ0lkID0gU2V0dGluZ0RhdGEuYmxhY2tsaXN0QnV0dG9uLmlkOw0KICAgICAgICBjb25zdCB1aSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXNldHRpbmc9JHtzZXR0aW5nSWR9XWApOw0KDQogICAgICAgIGlmICh1aSAhPSBudWxsICYmIHVpLmNoZWNrZWQgIT09IG5ld1N0YXRlKSB7DQogICAgICAgICAgICB1aS5jaGVja2VkID0gbmV3U3RhdGU7DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoIXVzZXJJbnRlcmFjdGlvbikgcmV0dXJuOw0KDQogICAgICAgIFV0aWwudXBkYXRlU2luZ2xlU2V0dGluZyhzZXR0aW5nSWQsIG5ld1N0YXRlKTsNCg0KICAgIH0sDQogICAgdXBkYXRlQmxhY2tsaXN0OiAobmV3TGlzdCwgdXNlckludGVyYWN0aW9uKSA9PiB7DQoNCiAgICAgICAgY29uc3Qgc2V0dGluZ0lkID0gU2V0dGluZ0RhdGEuYmxhY2tsaXN0LmlkOw0KICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYmxhY2tsaXN0Q2hhbm5lbHMiKTsNCg0KICAgICAgICBpZiAoY29udGFpbmVyKSB7DQogICAgICAgICAgICBjb250YWluZXIucmVwbGFjZUNoaWxkcmVuKCk7DQogICAgICAgIH0NCg0KICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobmV3TGlzdCk7DQoNCiAgICAgICAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7DQoNCiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiZGl2Iik7DQoNCiAgICAgICAgICAgIGNoaWxkLmlkID0gImJsYWNrbGlzdEVtcHR5IjsNCiAgICAgICAgICAgIGNoaWxkLnRleHRDb250ZW50ID0gIm5vdGhpbmcgaXMgYmxvY2tlZCI7DQogICAgICAgICAgICBjaGlsZC5zdHlsZS5mbGV4ID0gIjEiOw0KICAgICAgICAgICAgY2hpbGQuc3R5bGUudGV4dEFsaWduID0gImNlbnRlciI7DQoNCiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJibGFja2xpc3RDaGFubmVscyIpPy5hcHBlbmRDaGlsZChjaGlsZCk7DQoNCiAgICAgICAgfSBlbHNlIHsNCg0KICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImJsYWNrbGlzdEVtcHR5Iik/LnJlbW92ZSgpOw0KDQogICAgICAgICAgICBjb25zdCBuZXdOb2RlTGlzdCA9IFtdDQoNCiAgICAgICAgICAgIGtleXMuZm9yRWFjaCgoaXRlbSkgPT4gew0KDQogICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJkaXYiKTsNCiAgICAgICAgICAgICAgICBjaGlsZC50aXRsZSA9ICJyZW1vdmUiOw0KICAgICAgICAgICAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoImNoYW5uZWwiKTsNCiAgICAgICAgICAgICAgICBjaGlsZC5kYXRhc2V0Lm5hbWUgPSBuZXdMaXN0W2l0ZW1dLm5hbWUudG9Mb3dlckNhc2UoKTsNCiAgICAgICAgICAgICAgICBjaGlsZC5kYXRhc2V0LmhhbmRsZSA9IG5ld0xpc3RbaXRlbV0uaGFuZGxlOw0KICAgICAgICAgICAgICAgIGNoaWxkLmRhdGFzZXQudWNpZCA9IGl0ZW07DQogICAgICAgICAgICAgICAgY2hpbGQucmVwbGFjZUNoaWxkcmVuKA0KICAgICAgICAgICAgICAgICAgICBqMmQubWFrZSgiZGl2Iiwge2NsYXNzOiAiY2hhbm5lbE5hbWUifSksDQogICAgICAgICAgICAgICAgICAgIGoyZC5tYWtlU1ZHKCJzdmciLCB7Y2xhc3M6ICJyZW1vdmUiLCB2aWV3Qm94OiAiMCAtOTYwIDk2MCA5NjAiLCBoZWlnaHQ6ICIyNCIsIHdpZHRoOiAiMjQifSwgWw0KICAgICAgICAgICAgICAgICAgICAgICAgajJkLm1ha2VTVkcoInBhdGgiLCB7ZDogIk0yODAtMTIwcS0zMyAwLTU2LjUtMjMuNVQyMDAtMjAwdi01MjBoLTQwdi04MGgyMDB2LTQwaDI0MHY0MGgyMDB2ODBoLTQwdjUyMHEwIDMzLTIzLjUgNTYuNVQ2ODAtMTIwSDI4MFptNDAwLTYwMEgyODB2NTIwaDQwMHYtNTIwWk0zNjAtMjgwaDgwdi0zNjBoLTgwdjM2MFptMTYwIDBoODB2LTM2MGgtODB2MzYwWk0yODAtNzIwdjUyMC01MjBaIn0pDQogICAgICAgICAgICAgICAgICAgIF0pDQogICAgICAgICAgICAgICAgKTsNCg0KICAgICAgICAgICAgICAgIGNvbnN0IGNoYW5uZWxOYW1lID0gY2hpbGQucXVlcnlTZWxlY3RvcigiLmNoYW5uZWxOYW1lIik7DQoNCiAgICAgICAgICAgICAgICBpZiAoY2hhbm5lbE5hbWUpIHsNCg0KICAgICAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gbmV3TGlzdFtpdGVtXS5uYW1lOw0KDQogICAgICAgICAgICAgICAgICAgIGlmIChuYW1lKSB7DQogICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsTmFtZS50ZXh0Q29udGVudCA9IG5hbWU7DQogICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7DQogICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsTmFtZS5hcHBlbmRDaGlsZChqMmQubWFrZSgiaSIsIGBAJHtuZXdMaXN0W2l0ZW1dLmhhbmRsZX1gKSk7DQogICAgICAgICAgICAgICAgICAgIH0NCg0KICAgICAgICAgICAgICAgIH0NCg0KICAgICAgICAgICAgICAgIG5ld05vZGVMaXN0LnB1c2goY2hpbGQpOw0KDQogICAgICAgICAgICB9KTsNCg0KICAgICAgICAgICAgaWYgKG5ld05vZGVMaXN0Lmxlbmd0aCA+IDApIHsNCiAgICAgICAgICAgICAgICBjb250YWluZXI/LmFwcGVuZCguLi5uZXdOb2RlTGlzdCk7DQogICAgICAgICAgICB9DQoNCiAgICAgICAgfQ0KDQogICAgICAgIGlmICghdXNlckludGVyYWN0aW9uKSByZXR1cm47DQoNCiAgICAgICAgVXRpbC51cGRhdGVTaW5nbGVTZXR0aW5nKHNldHRpbmdJZCwgbmV3TGlzdCk7DQoNCiAgICB9LA0KfTsNCmNvbnN0IFV0aWwgPSB7DQogICAgc2F2ZURhdGE6IGFzeW5jIGRhdGEgPT4gew0KICAgICAgICBpZiAoc2V0dGluZ3Muc3luY1NldHRpbmdzID09PSB0cnVlKSB7DQogICAgICAgICAgICBhd2FpdCBicm93c2VyLnN0b3JhZ2Uuc3luYy5zZXQoZGF0YSk7DQogICAgICAgIH0gZWxzZSB7DQogICAgICAgICAgICBhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuc2V0KGRhdGEpOw0KICAgICAgICB9DQogICAgfSwNCiAgICB1cGRhdGVTZXR0aW5nczogZGF0YSA9PiB7DQoNCiAgICAgICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHsNCiAgICAgICAgICAgIHNldHRpbmdzW2tleV0gPSBkYXRhW2tleV07DQogICAgICAgIH0NCg0KICAgICAgICBVdGlsLnNhdmVEYXRhKGRhdGEpLnRoZW4oKTsNCg0KICAgIH0sDQogICAgdXBkYXRlU2luZ2xlU2V0dGluZzogKGtleSwgdmFsdWUpID0+IHsNCg0KICAgICAgICBpZiAoc2V0dGluZ3Nba2V5XSA9PT0gdmFsdWUpIHsNCiAgICAgICAgICAgIHJldHVybjsNCiAgICAgICAgfQ0KDQogICAgICAgIHNldHRpbmdzW2tleV0gPSB2YWx1ZTsNCg0KICAgICAgICBVdGlsLnNhdmVEYXRhKHtba2V5XTogdmFsdWV9KS50aGVuKCk7DQoNCiAgICB9LA0KICAgIHBvcHVsYXRlT3B0aW9uczogaXRlbSA9PiB7DQogICAgICAgIGNvbnN0IGlkID0gaXRlbT8uZGF0YXNldD8ubWVudT8udHJpbSgpOw0KICAgICAgICBpZiAoaWQgIT0gbnVsbCAmJiBpZCAhPT0gIiIpIHsNCiAgICAgICAgICAgIG9wdGlvbnMucHVzaChpZCk7DQogICAgICAgIH0NCiAgICB9LA0KICAgIHRvZ2dsZU1lbnVJdGVtOiBldmVudCA9PiB7DQoNCiAgICAgICAgY29uc3QgaXRlbUlkID0gZXZlbnQ/LnRhcmdldD8uZGF0YXNldD8ubWVudTsNCg0KICAgICAgICBpZiAob3B0aW9ucy5pbmRleE9mKGl0ZW1JZCkgPCAwKSB7DQogICAgICAgICAgICByZXR1cm47DQogICAgICAgIH0NCg0KICAgICAgICBjb25zdCBuZXdTZWxlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbZGF0YS1tZW51PScke2l0ZW1JZH0nXWApOw0KICAgICAgICBjb25zdCBjdXJyZW50U2VsZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiW2RhdGEtbWVudV1bZGF0YS1hY3RpdmVdIik7DQoNCiAgICAgICAgaWYgKG5ld1NlbGVjdGlvbiAhPSBudWxsICYmIG5ld1NlbGVjdGlvbiAhPT0gY3VycmVudFNlbGVjdGlvbikgew0KDQogICAgICAgICAgICBjdXJyZW50U2VsZWN0aW9uPy5yZW1vdmVBdHRyaWJ1dGUoImRhdGEtYWN0aXZlIik7DQogICAgICAgICAgICBuZXdTZWxlY3Rpb24uc2V0QXR0cmlidXRlKCJkYXRhLWFjdGl2ZSIsICIiKTsNCg0KICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcigiW2RhdGEtY29udGVudF1bZGF0YS1hY3RpdmVdIik/LnJlbW92ZUF0dHJpYnV0ZSgiZGF0YS1hY3RpdmUiKTsNCiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLWNvbnRlbnQ9JyR7aXRlbUlkfSddYCk/LnNldEF0dHJpYnV0ZSgiZGF0YS1hY3RpdmUiLCAiIik7DQoNCiAgICAgICAgfQ0KDQogICAgfSwNCiAgICBoYW5kbGVTZXR0aW5nOiAoa2V5LCB2YWx1ZSwgdXNlckludGVyYWN0aW9uKSA9PiB7DQogICAgICAgIHN3aXRjaCAoa2V5KSB7DQogICAgICAgICAgICBjYXNlIFNldHRpbmdEYXRhLmV4dGVuc2lvbkJ1dHRvbi5pZDoNCiAgICAgICAgICAgICAgICBNYW5hZ2VyLnVwZGF0ZUV4dGVuc2lvbkJ1dHRvbih2YWx1ZSwgdXNlckludGVyYWN0aW9uKTsNCiAgICAgICAgICAgICAgICBicmVhazsNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEuc3luY1NldHRpbmdzLmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlU3luY1NldHRpbmdzKHZhbHVlLCB1c2VySW50ZXJhY3Rpb24pOw0KICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5hZE9wdE91dEFsbC5pZDoNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEuYWRTdWJzY3JpYmVkLmlkOg0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5hZFZpZGVvRmVlZC5pZDoNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEuYWRJblZpZGVvLmlkOg0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5hZFRhZ2dlZFByb2R1Y3RzLmlkOg0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5hZE1hc3RoZWFkLmlkOg0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5hZEhvbWVGZWVkLmlkOg0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5hZFNlYXJjaEZlZWQuaWQ6DQogICAgICAgICAgICAgICAgTWFuYWdlci51cGRhdGVBZE1hbmFnZXIoa2V5LCB2YWx1ZSwgdXNlckludGVyYWN0aW9uKTsNCiAgICAgICAgICAgICAgICBicmVhazsNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEuZnVsbFRpdGxlcy5pZDoNCiAgICAgICAgICAgICAgICBNYW5hZ2VyLnVwZGF0ZUZ1bGxUaXRsZXModmFsdWUsIHVzZXJJbnRlcmFjdGlvbik7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICBjYXNlIFNldHRpbmdEYXRhLnRoZW1lLmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlVGhlbWUodmFsdWUsIHVzZXJJbnRlcmFjdGlvbik7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICBjYXNlIFNldHRpbmdEYXRhLmxvZ29TdWJzY3JpcHRpb25zLmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlTG9nb1N1YnNjcmlwdGlvbnModmFsdWUsIHVzZXJJbnRlcmFjdGlvbik7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICBjYXNlIFNldHRpbmdEYXRhLmF1dG9wbGF5Q2hhbm5lbFRyYWlsZXIuaWQ6DQogICAgICAgICAgICAgICAgTWFuYWdlci51cGRhdGVBdXRvcGxheUNoYW5uZWxUcmFpbGVyKHZhbHVlLCB1c2VySW50ZXJhY3Rpb24pOw0KICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5jaGFubmVsVGFiLmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlQ2hhbm5lbFRhYih2YWx1ZSwgdXNlckludGVyYWN0aW9uKTsNCiAgICAgICAgICAgICAgICBicmVhazsNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEuaG9tZVNob3J0cy5pZDoNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEuc3Vic2NyaXB0aW9uc1Nob3J0cy5pZDoNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEudmlkZW9QYWdlU2hvcnRzLmlkOg0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5zZWFyY2hTaG9ydHMuaWQ6DQogICAgICAgICAgICAgICAgTWFuYWdlci51cGRhdGVTaG9ydHMoa2V5LCB2YWx1ZSwgdXNlckludGVyYWN0aW9uKTsNCiAgICAgICAgICAgICAgICBicmVhazsNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEudmlkZW9Gb2N1cy5pZDoNCiAgICAgICAgICAgICAgICBNYW5hZ2VyLnVwZGF0ZVZpZGVvRm9jdXModmFsdWUsIHVzZXJJbnRlcmFjdGlvbik7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICBjYXNlIFNldHRpbmdEYXRhLmNyZWF0b3JNZXJjaC5pZDoNCiAgICAgICAgICAgICAgICBNYW5hZ2VyLnVwZGF0ZUNyZWF0b3JNZXJjaCh2YWx1ZSwgdXNlckludGVyYWN0aW9uKTsNCiAgICAgICAgICAgICAgICBicmVhazsNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEudmlkZW9Db3VudC5pZDoNCiAgICAgICAgICAgICAgICBNYW5hZ2VyLnVwZGF0ZVZpZGVvQ291bnQodmFsdWUsIHVzZXJJbnRlcmFjdGlvbik7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICBjYXNlIFNldHRpbmdEYXRhLmFtYmllbnRNb2RlLmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlQW1iaWVudE1vZGUodmFsdWUsIHVzZXJJbnRlcmFjdGlvbik7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICBjYXNlIFNldHRpbmdEYXRhLnJldmVyc2VQbGF5bGlzdC5pZDoNCiAgICAgICAgICAgICAgICBNYW5hZ2VyLnVwZGF0ZVJldmVyc2VQbGF5bGlzdCh2YWx1ZSwgdXNlckludGVyYWN0aW9uKTsNCiAgICAgICAgICAgICAgICBicmVhazsNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEuc3VwZXJUaGVhdGVyLmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlU3VwZXJUaGVhdGVyKHZhbHVlLCB1c2VySW50ZXJhY3Rpb24pOw0KICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5zdXBlclRoZWF0ZXJTY3JvbGxiYXIuaWQ6DQogICAgICAgICAgICAgICAgTWFuYWdlci51cGRhdGVTdXBlclRoZWF0ZXJTY3JvbGxiYXIodmFsdWUsIHVzZXJJbnRlcmFjdGlvbik7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICBjYXNlIFNldHRpbmdEYXRhLmRlZmF1bHRRdWFsaXR5LmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlRGVmYXVsdFF1YWxpdHkodmFsdWUsIHVzZXJJbnRlcmFjdGlvbik7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICBjYXNlIFNldHRpbmdEYXRhLmRlZmF1bHRTcGVlZC5pZDoNCiAgICAgICAgICAgICAgICBNYW5hZ2VyLnVwZGF0ZURlZmF1bHRTcGVlZCh2YWx1ZSwgdXNlckludGVyYWN0aW9uKTsNCiAgICAgICAgICAgICAgICBicmVhazsNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEuYXV0b3BsYXkuaWQ6DQogICAgICAgICAgICAgICAgTWFuYWdlci51cGRhdGVBdXRvcGxheSh2YWx1ZSwgdXNlckludGVyYWN0aW9uKTsNCiAgICAgICAgICAgICAgICBicmVhazsNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEubG91ZG5lc3MuaWQ6DQogICAgICAgICAgICAgICAgTWFuYWdlci51cGRhdGVMb3VkbmVzcyh2YWx1ZSwgdXNlckludGVyYWN0aW9uKTsNCiAgICAgICAgICAgICAgICBicmVhazsNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEuc2Nyb2xsVm9sdW1lLmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlU2Nyb2xsVm9sdW1lKHZhbHVlLCB1c2VySW50ZXJhY3Rpb24pOw0KICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5zY3JvbGxWb2x1bWVTaGlmdC5pZDoNCiAgICAgICAgICAgICAgICBNYW5hZ2VyLnVwZGF0ZVNjcm9sbFZvbHVtZVNoaWZ0KHZhbHVlLCB1c2VySW50ZXJhY3Rpb24pOw0KICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5zY3JvbGxWb2x1bWVTdGVwLmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlU2Nyb2xsVm9sdW1lU3RlcCh2YWx1ZSwgdXNlckludGVyYWN0aW9uKTsNCiAgICAgICAgICAgICAgICBicmVhazsNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEuaW5mb0NhcmRzLmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlSW5mb0NhcmRzKHZhbHVlLCB1c2VySW50ZXJhY3Rpb24pOw0KICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5hbm5vdGF0aW9ucy5pZDoNCiAgICAgICAgICAgICAgICBNYW5hZ2VyLnVwZGF0ZUFubm90YXRpb25zKHZhbHVlLCB1c2VySW50ZXJhY3Rpb24pOw0KICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5lbmRTY3JlZW4uaWQ6DQogICAgICAgICAgICAgICAgTWFuYWdlci51cGRhdGVFbmRTY3JlZW4odmFsdWUsIHVzZXJJbnRlcmFjdGlvbik7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICBjYXNlIFNldHRpbmdEYXRhLmFsd2F5c1Zpc2libGUuaWQ6DQogICAgICAgICAgICAgICAgTWFuYWdlci51cGRhdGVBbHdheXNWaXNpYmxlKHZhbHVlLCB1c2VySW50ZXJhY3Rpb24pOw0KICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5oZnJBbGxvd2VkLmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlSEZSQWxsb3dlZCh2YWx1ZSwgdXNlckludGVyYWN0aW9uKTsNCiAgICAgICAgICAgICAgICBicmVhazsNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEuYXV0b3BsYXlTaG9ydGN1dC5pZDoNCiAgICAgICAgICAgICAgICBNYW5hZ2VyLnVwZGF0ZUF1dG9wbGF5U2hvcnRjdXQodmFsdWUsIHVzZXJJbnRlcmFjdGlvbik7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICBjYXNlIFNldHRpbmdEYXRhLnZpZGVvRm9jdXNUb2dnbGUuaWQ6DQogICAgICAgICAgICAgICAgTWFuYWdlci51cGRhdGVWaWRlb0ZvY3VzVG9nZ2xlKHZhbHVlLCB1c2VySW50ZXJhY3Rpb24pOw0KICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS52aWRlb1NjcmVlbnNob3QuaWQ6DQogICAgICAgICAgICAgICAgTWFuYWdlci51cGRhdGVWaWRlb1NjcmVlbnNob3QodmFsdWUsIHVzZXJJbnRlcmFjdGlvbik7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICBjYXNlIFNldHRpbmdEYXRhLnZpZGVvVGh1bWJuYWlsLmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlVmlkZW9UaHVtYm5haWwodmFsdWUsIHVzZXJJbnRlcmFjdGlvbik7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICBjYXNlIFNldHRpbmdEYXRhLm1vbmV0aXphdGlvbkluZm8uaWQ6DQogICAgICAgICAgICAgICAgTWFuYWdlci51cGRhdGVNb25ldGl6YXRpb25JbmZvKHZhbHVlLCB1c2VySW50ZXJhY3Rpb24pOw0KICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5ibGFja2xpc3RFbmFibGVkLmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlQmxhY2tsaXN0RW5hYmxlZCh2YWx1ZSwgdXNlckludGVyYWN0aW9uKTsNCiAgICAgICAgICAgICAgICBicmVhazsNCiAgICAgICAgICAgIGNhc2UgU2V0dGluZ0RhdGEuYmxhY2tsaXN0QnV0dG9uLmlkOg0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlQmxhY2tsaXN0QnV0dG9uKHZhbHVlLCB1c2VySW50ZXJhY3Rpb24pOw0KICAgICAgICAgICAgICAgIGJyZWFrOw0KICAgICAgICAgICAgY2FzZSBTZXR0aW5nRGF0YS5ibGFja2xpc3QuaWQ6DQogICAgICAgICAgICAgICAgTWFuYWdlci51cGRhdGVCbGFja2xpc3QodmFsdWUsIHVzZXJJbnRlcmFjdGlvbik7DQogICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgIH0NCiAgICB9LA0KICAgIHNldHRpbmdBY3Rpb246IGV2ZW50ID0+IHsNCiAgICAgICAgaWYgKGV2ZW50LnRhcmdldD8udHlwZSA9PT0gImNoZWNrYm94Iikgew0KICAgICAgICAgICAgVXRpbC5oYW5kbGVTZXR0aW5nKGV2ZW50LnRhcmdldD8uZGF0YXNldD8uc2V0dGluZywgZXZlbnQudGFyZ2V0Py5jaGVja2VkLCB0cnVlKTsNCiAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQ/LnR5cGUgPT09ICJyYWRpbyIpIHsNCiAgICAgICAgICAgIFV0aWwuaGFuZGxlU2V0dGluZyhldmVudC50YXJnZXQ/LmRhdGFzZXQ/LnNldHRpbmcsIGV2ZW50LnRhcmdldD8udmFsdWUsIHRydWUpOw0KICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldD8udHlwZSA9PT0gInNlbGVjdC1vbmUiKSB7DQogICAgICAgICAgICBVdGlsLmhhbmRsZVNldHRpbmcoZXZlbnQudGFyZ2V0Py5kYXRhc2V0Py5zZXR0aW5nLCBldmVudC50YXJnZXQ/LnZhbHVlLCB0cnVlKTsNCiAgICAgICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQ/LmRhdGFzZXQ/LmFjdGlvbikgew0KICAgICAgICAgICAgc3dpdGNoIChldmVudC50YXJnZXQ/LmRhdGFzZXQ/LmFjdGlvbikgew0KICAgICAgICAgICAgICAgIGNhc2UgImltcG9ydCI6DQogICAgICAgICAgICAgICAgICAgIFV0aWwuaW1wb3J0U2V0dGluZ3MoKTsNCiAgICAgICAgICAgICAgICAgICAgYnJlYWs7DQogICAgICAgICAgICAgICAgY2FzZSAiZXhwb3J0IjoNCiAgICAgICAgICAgICAgICAgICAgVXRpbC5leHBvcnRTZXR0aW5ncygpOw0KICAgICAgICAgICAgICAgICAgICBicmVhaw0KICAgICAgICAgICAgICAgIGNhc2UgInJlc2V0IjoNCiAgICAgICAgICAgICAgICAgICAgVXRpbC5yZXNldFNldHRpbmdzKCk7DQogICAgICAgICAgICAgICAgICAgIGJyZWFrDQogICAgICAgICAgICB9DQogICAgICAgIH0NCiAgICB9LA0KICAgIGltcG9ydFNldHRpbmdzOiAoKSA9PiB7DQogICAgICAgIHRyeSB7DQogICAgICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoImlucHV0Iik7DQogICAgICAgICAgICBpbnB1dC5tdWx0aXBsZSA9IGZhbHNlOw0KICAgICAgICAgICAgaW5wdXQuYWNjZXB0ID0gImFwcGxpY2F0aW9uL2pzb24iOw0KICAgICAgICAgICAgaW5wdXQudHlwZSA9ICJmaWxlIjsNCiAgICAgICAgICAgIGlucHV0Lm9uY2hhbmdlID0gXyA9PiB7DQogICAgICAgICAgICAgICAgaWYgKGlucHV0LmZpbGVzLmxlbmd0aCA+IDApIHsNCiAgICAgICAgICAgICAgICAgICAgaW5wdXQuZmlsZXNbMF0udGV4dCgpLnRoZW4oZGF0YSA9PiBVdGlsLmluaXRpYWxMb2FkKEpTT04ucGFyc2UoZGF0YSkpKTsNCiAgICAgICAgICAgICAgICB9DQogICAgICAgICAgICB9Ow0KICAgICAgICAgICAgaW5wdXQuY2xpY2soKTsNCiAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7DQogICAgICAgIH0NCiAgICB9LA0KICAgIGV4cG9ydFNldHRpbmdzOiAoKSA9PiB7DQogICAgICAgIHRyeSB7DQogICAgICAgICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiYSIpOw0KICAgICAgICAgICAgYS5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MsIG51bGwsIDIpXSwge3R5cGU6ICJhcHBsaWNhdGlvbi9qc29uIn0pKTsNCiAgICAgICAgICAgIGEuZG93bmxvYWQgPSBgSXJpZGl1bSR7YnJvd3Nlci5ydW50aW1lLmdldE1hbmlmZXN0KCkudmVyc2lvbn0uanNvbmA7DQogICAgICAgICAgICBhLmNsaWNrKCk7DQogICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkgew0KICAgICAgICB9DQogICAgfSwNCiAgICByZXNldFNldHRpbmdzOiAoKSA9PiB7DQogICAgICAgIGlmICh3aW5kb3cuY29uZmlybSgiWW91IGFyZSBhYm91dCB0byByZXNldCB0aGUgc2V0dGluZ3MgdG8gZGVmYXVsdCwgZG8geW91IHdhbnQgdG8gY29udGludWU/IikpIHsNCg0KICAgICAgICAgICAgVXRpbC51cGRhdGVTZXR0aW5ncyhnZXREZWZhdWx0U2V0dGluZ3MoKSk7DQoNCiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBzZXR0aW5ncykgew0KICAgICAgICAgICAgICAgIFV0aWwuaGFuZGxlU2V0dGluZyhrZXksIHNldHRpbmdzW2tleV0sIGZhbHNlKTsNCiAgICAgICAgICAgIH0NCg0KICAgICAgICB9DQogICAgfSwNCiAgICBvblN0b3JhZ2VDaGFuZ2VkTGlzdGVuZXI6IGRhdGEgPT4gew0KDQogICAgICAgIGNvbnN0IGNoYW5nZWREYXRhID0ge307DQoNCiAgICAgICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHsNCg0KICAgICAgICAgICAgY29uc3QgY2hhbmdlID0gZGF0YVtrZXldOw0KICAgICAgICAgICAgbGV0IG5ld09iamVjdCA9IGNoYW5nZS5uZXdWYWx1ZTsNCiAgICAgICAgICAgIGxldCBvbGRPYmplY3QgPSBjaGFuZ2Uub2xkVmFsdWU7DQogICAgICAgICAgICBsZXQgY3VycmVudE9iamVjdCA9IHNldHRpbmdzW2tleV07DQoNCiAgICAgICAgICAgIGlmIChjaGFuZ2UubmV3VmFsdWU/LmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHsNCiAgICAgICAgICAgICAgICBuZXdPYmplY3QgPSBKU09OLnN0cmluZ2lmeShjaGFuZ2UubmV3VmFsdWUpOw0KICAgICAgICAgICAgICAgIG9sZE9iamVjdCA9IEpTT04uc3RyaW5naWZ5KGNoYW5nZS5vbGRWYWx1ZSk7DQogICAgICAgICAgICAgICAgY3VycmVudE9iamVjdCA9IEpTT04uc3RyaW5naWZ5KHNldHRpbmdzW2tleV0pOw0KICAgICAgICAgICAgfQ0KDQogICAgICAgICAgICBpZiAobmV3T2JqZWN0ICE9PSBvbGRPYmplY3QgJiYgY3VycmVudE9iamVjdCAhPT0gbmV3T2JqZWN0KSB7DQogICAgICAgICAgICAgICAgc2V0dGluZ3Nba2V5XSA9IGNoYW5nZWREYXRhW2tleV0gPSBjaGFuZ2UubmV3VmFsdWU7DQogICAgICAgICAgICB9DQoNCiAgICAgICAgfQ0KDQogICAgICAgIGlmIChPYmplY3Qua2V5cyhjaGFuZ2VkRGF0YSkubGVuZ3RoID4gMCkgew0KICAgICAgICAgICAgVXRpbC51cGRhdGVTZXR0aW5ncyhjaGFuZ2VkRGF0YSk7DQogICAgICAgIH0NCg0KICAgIH0sDQogICAgaW5pdGlhbExvYWQ6IGFzeW5jIGl0ZW1zID0+IHsNCg0KICAgICAgICBjb25zdCBuZXdGZWF0dXJlcyA9IHt9Ow0KICAgICAgICBjb25zdCBkZWZhdWx0U2V0dGluZ3MgPSBnZXREZWZhdWx0U2V0dGluZ3MoKTsNCg0KICAgICAgICAvLyBlbnN1cmUgbmV3IGZlYXR1cmVzIGFyZSBhcHBsaWVkDQogICAgICAgIGZvciAobGV0IGtleSBpbiBkZWZhdWx0U2V0dGluZ3MpIHsNCiAgICAgICAgICAgIGlmICghT2JqZWN0Lmhhc093bihpdGVtcywga2V5KSkgew0KICAgICAgICAgICAgICAgIGl0ZW1zW2tleV0gPSBuZXdGZWF0dXJlc1trZXldID0gZGVmYXVsdFNldHRpbmdzW2tleV07DQogICAgICAgICAgICB9DQogICAgICAgIH0NCg0KICAgICAgICBpZiAoT2JqZWN0LmtleXMobmV3RmVhdHVyZXMpLmxlbmd0aCA+IDApIHsNCiAgICAgICAgICAgIGlmIChpdGVtc1tTZXR0aW5nRGF0YS5zeW5jU2V0dGluZ3MuaWRdID09PSB0cnVlKSB7DQogICAgICAgICAgICAgICAgYXdhaXQgYnJvd3Nlci5zdG9yYWdlLnN5bmMuc2V0KG5ld0ZlYXR1cmVzKTsNCiAgICAgICAgICAgIH0gZWxzZSB7DQogICAgICAgICAgICAgICAgYXdhaXQgYnJvd3Nlci5zdG9yYWdlLmxvY2FsLnNldChuZXdGZWF0dXJlcyk7DQogICAgICAgICAgICB9DQogICAgICAgIH0NCg0KICAgICAgICBmb3IgKGxldCBrZXkgaW4gaXRlbXMpIHsNCiAgICAgICAgICAgIHNldHRpbmdzW2tleV0gPSBpdGVtc1trZXldOw0KICAgICAgICB9DQoNCiAgICAgICAgZm9yIChsZXQga2V5IGluIHNldHRpbmdzKSB7DQogICAgICAgICAgICBVdGlsLmhhbmRsZVNldHRpbmcoa2V5LCBzZXR0aW5nc1trZXldLCBmYWxzZSk7DQogICAgICAgIH0NCg0KICAgIH0sDQogICAgY2hlY2tTdG9yYWdlOiBhc3luYyAoKSA9PiB7DQoNCiAgICAgICAgY29uc3QgZGF0YVN5bmMgPSBhd2FpdCBicm93c2VyLnN0b3JhZ2Uuc3luYy5nZXQoKTsNCg0KICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YVN5bmMpLmxlbmd0aCA+IDAgJiYgZGF0YVN5bmNbU2V0dGluZ0RhdGEuc3luY1NldHRpbmdzLmlkXSA9PT0gdHJ1ZSkgew0KICAgICAgICAgICAgYXdhaXQgVXRpbC5pbml0aWFsTG9hZChkYXRhU3luYyk7DQogICAgICAgICAgICBicm93c2VyLnN0b3JhZ2Uuc3luYy5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoVXRpbC5vblN0b3JhZ2VDaGFuZ2VkTGlzdGVuZXIpOw0KICAgICAgICB9IGVsc2Ugew0KDQogICAgICAgICAgICBjb25zdCBkYXRhTG9jYWwgPSBhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuZ2V0KCk7DQoNCiAgICAgICAgICAgIC8vIHN0b3JhZ2Ugd2lsbCBiZSBlbXB0eSBkdXJpbmcgZmlyc3QgaW5zdGFsbGF0aW9uDQogICAgICAgICAgICAvLyB0aGlzIGVuc3VyZXMgdGhlIGZpcnN0IGxvYWQgc3RvcmVzIHRoZSBkZWZhdWx0IHNldHRpbmdzDQogICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGF0YUxvY2FsKS5sZW5ndGggPT09IDApIHsNCiAgICAgICAgICAgICAgICBjb25zdCBkZWZhdWx0U2V0dGluZ3MgPSBnZXREZWZhdWx0U2V0dGluZ3MoKTsNCiAgICAgICAgICAgICAgICBhd2FpdCBicm93c2VyLnN0b3JhZ2UubG9jYWwuc2V0KGRlZmF1bHRTZXR0aW5ncyk7DQogICAgICAgICAgICAgICAgYXdhaXQgVXRpbC5pbml0aWFsTG9hZChkZWZhdWx0U2V0dGluZ3MpOw0KICAgICAgICAgICAgfSBlbHNlIHsNCiAgICAgICAgICAgICAgICBhd2FpdCBVdGlsLmluaXRpYWxMb2FkKGRhdGFMb2NhbCk7DQogICAgICAgICAgICB9DQoNCiAgICAgICAgICAgIGJyb3dzZXIuc3RvcmFnZS5sb2NhbC5vbkNoYW5nZWQuYWRkTGlzdGVuZXIoVXRpbC5vblN0b3JhZ2VDaGFuZ2VkTGlzdGVuZXIpOw0KDQogICAgICAgIH0NCg0KICAgIH0sDQogICAgb25CbGFja2xpc3RGaWx0ZXJDaGFuZ2U6IChldmVudCkgPT4gew0KDQogICAgICAgIGNvbnN0IGl0ZW1zID0gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCIuY2hhbm5lbCIpKS5tYXAoKGl0ZW0pID0+ICh7bmFtZTogaXRlbS5kYXRhc2V0Lm5hbWUsIHRhcmdldDogaXRlbX0pKTsNCg0KICAgICAgICBpZiAoaXRlbXMubGVuZ3RoID09PSAwKSB7DQogICAgICAgICAgICByZXR1cm47DQogICAgICAgIH0NCg0KICAgICAgICBjb25zdCBmaWx0ZXJlZEl0ZW1zID0gaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7DQogICAgICAgICAgICBjb25zdCBuYW1lID0gaXRlbS50YXJnZXQuZGF0YXNldC5uYW1lIHx8IGl0ZW0udGFyZ2V0LmRhdGFzZXQuaGFuZGxlOw0KICAgICAgICAgICAgY29uc3QgbWF0Y2hlZCA9IG5hbWU/LmluY2x1ZGVzKGV2ZW50Py50YXJnZXQ/LnZhbHVlPy50b0xvd2VyQ2FzZSgpIHx8ICIiKSA9PT0gdHJ1ZTsNCiAgICAgICAgICAgIGl0ZW0udGFyZ2V0LnN0eWxlLmRpc3BsYXkgPSBtYXRjaGVkID8gIiIgOiAibm9uZSI7DQogICAgICAgICAgICByZXR1cm4gbWF0Y2hlZDsNCiAgICAgICAgfSk7DQoNCiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImJsYWNrbGlzdE5vUmVzdWx0cyIpPy5yZW1vdmUoKTsNCg0KICAgICAgICBpZiAoZmlsdGVyZWRJdGVtcy5sZW5ndGggPT09IDApIHsNCg0KICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJkaXYiKTsNCg0KICAgICAgICAgICAgY2hpbGQuaWQgPSAiYmxhY2tsaXN0Tm9SZXN1bHRzIjsNCiAgICAgICAgICAgIGNoaWxkLnRleHRDb250ZW50ID0gIm5vIHJlc3VsdHMgZm91bmQiOw0KICAgICAgICAgICAgY2hpbGQuc3R5bGUuZmxleCA9ICIxIjsNCiAgICAgICAgICAgIGNoaWxkLnN0eWxlLnRleHRBbGlnbiA9ICJjZW50ZXIiOw0KDQogICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYmxhY2tsaXN0Q2hhbm5lbHMiKT8uYXBwZW5kQ2hpbGQoY2hpbGQpOw0KDQogICAgICAgIH0NCg0KICAgIH0sDQogICAgaW5pQmxhY2tsaXN0U2VhcmNoOiAoKSA9PiB7DQoNCiAgICAgICAgbGV0IHVybCA9ICIiOw0KICAgICAgICBjb25zdCBjaGFubmVsRGF0YSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJjaGFubmVsRGF0YUlucHV0Iik/LnZhbHVlPy50cmltKCk7DQogICAgICAgIGNvbnN0IG9uRXJyb3IgPSAoZXJyb3IpID0+IHsNCg0KICAgICAgICAgICAgY29uc3QgZGlhbG9nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImRpYWxvZyIpOw0KDQogICAgICAgICAgICBpZiAoZGlhbG9nKSB7DQogICAgICAgICAgICAgICAgZGlhbG9nLmNsYXNzTGlzdC5hZGQoIm5vUmVzdWx0cyIpOw0KICAgICAgICAgICAgICAgIGRpYWxvZy5jbGFzc0xpc3QucmVtb3ZlKCJjaGFubmVsQmxvY2tlZCIpOw0KICAgICAgICAgICAgfQ0KDQogICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInNlYXJjaFJlc3VsdE1lc3NhZ2UiKTsNCg0KICAgICAgICAgICAgaWYgKG1lc3NhZ2UpIHsNCiAgICAgICAgICAgICAgICBtZXNzYWdlLnRleHRDb250ZW50ID0gZXJyb3I7DQogICAgICAgICAgICB9DQoNCiAgICAgICAgfTsNCg0KICAgICAgICBpZiAoY2hhbm5lbERhdGEpIHsNCiAgICAgICAgICAgIGlmIChjaGFubmVsRGF0YS5zdGFydHNXaXRoKCJAIikpIHsNCiAgICAgICAgICAgICAgICB1cmwgPSAiaHR0cHM6Ly93d3cueW91dHViZS5jb20vIiArIGNoYW5uZWxEYXRhOw0KICAgICAgICAgICAgfSBlbHNlIGlmIChjaGFubmVsRGF0YS50b1VwcGVyQ2FzZSgpLnN0YXJ0c1dpdGgoIlVDIikpIHsNCiAgICAgICAgICAgICAgICB1cmwgPSAiaHR0cHM6Ly93d3cueW91dHViZS5jb20vY2hhbm5lbC8iICsgY2hhbm5lbERhdGE7DQogICAgICAgICAgICB9DQogICAgICAgIH0NCg0KICAgICAgICBpZiAodXJsID09PSAiIikgew0KICAgICAgICAgICAgb25FcnJvcigiU2VhcmNoIHRlcm0gbXVzdCBzdGFydCB3aXRoIEAuLi4gb3IgVUMuLi4iKTsNCiAgICAgICAgICAgIHJldHVybjsNCiAgICAgICAgfQ0KDQogICAgICAgIGZldGNoKHVybCkudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLnRleHQoKS50aGVuKChiKSA9PiB7DQoNCiAgICAgICAgICAgIGxldCBtYXRjaGVkID0gYi5tYXRjaCgvdmFyIHl0SW5pdGlhbERhdGEgPSAoXHsuKj99KTsvKT8uWzFdOw0KDQogICAgICAgICAgICBpZiAobWF0Y2hlZCkgew0KICAgICAgICAgICAgICAgIHRyeSB7DQoNCiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFnZURhdGEgPSBKU09OLnBhcnNlKG1hdGNoZWQpOw0KICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRhZGF0YSA9IHBhZ2VEYXRhPy5tZXRhZGF0YT8uWyJjaGFubmVsTWV0YWRhdGFSZW5kZXJlciJdOw0KDQogICAgICAgICAgICAgICAgICAgIGlmIChtZXRhZGF0YSkgew0KDQogICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhT2JqZWN0ID0gew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2YXRhcjogbWV0YWRhdGE/LlsiYXZhdGFyIl0/LlsidGh1bWJuYWlscyJdWzBdPy51cmw/LnNwbGl0KCI9Iik/LlswXSwNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsSGFuZGxlOiBtZXRhZGF0YT8uWyJ2YW5pdHlDaGFubmVsVXJsIl0/LnNwbGl0KCJAIik/LlsxXSwNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFubmVsTmFtZTogbWV0YWRhdGE/LnRpdGxlLA0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5uZWxJZDogbWV0YWRhdGE/LlsiZXh0ZXJuYWxJZCJdDQogICAgICAgICAgICAgICAgICAgICAgICB9DQoNCiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpYWxvZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJkaWFsb2ciKTsNCg0KICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpYWxvZykgew0KDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoIm5vUmVzdWx0cyIpOw0KDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5oYXNPd24oc2V0dGluZ3MuYmxhY2tsaXN0LCBkYXRhT2JqZWN0LmNoYW5uZWxJZCkpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nLmNsYXNzTGlzdC5hZGQoImNoYW5uZWxCbG9ja2VkIik7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlhbG9nLmNsYXNzTGlzdC5yZW1vdmUoImNoYW5uZWxCbG9ja2VkIik7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgfQ0KDQogICAgICAgICAgICAgICAgICAgICAgICB9DQoNCiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGF2YXRhckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJzZWFyY2hDaGFubmVsQXZhdGFyIik7DQoNCiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhdmF0YXJDb250YWluZXIpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdmF0YXJDb250YWluZXIuc3JjID0gZGF0YU9iamVjdC5hdmF0YXI7DQogICAgICAgICAgICAgICAgICAgICAgICB9DQoNCiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hbWVDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgic2VhcmNoQ2hhbm5lbE5hbWUiKTsNCg0KICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWVDb250YWluZXIpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YU9iamVjdC5jaGFubmVsTmFtZSkgew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lQ29udGFpbmVyLnRleHRDb250ZW50ID0gZGF0YU9iamVjdC5jaGFubmVsTmFtZTsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lQ29udGFpbmVyLnJlcGxhY2VDaGlsZHJlbihqMmQubWFrZSgiaSIsICJlbXB0eSBjaGFubmVsIG5hbWUiKSk7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICAgICAgfQ0KDQogICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhZGREaWFsb2cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYWRkRGlhbG9nIik7DQoNCiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhZGREaWFsb2cpIHsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGREaWFsb2cuZGF0YXNldC5jaGFubmVsSGFuZGxlID0gZGF0YU9iamVjdC5jaGFubmVsSGFuZGxlOw0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZERpYWxvZy5kYXRhc2V0LmNoYW5uZWxOYW1lID0gZGF0YU9iamVjdC5jaGFubmVsTmFtZTsNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGREaWFsb2cuZGF0YXNldC5jaGFubmVsSWQgPSBkYXRhT2JqZWN0LmNoYW5uZWxJZDsNCiAgICAgICAgICAgICAgICAgICAgICAgIH0NCg0KICAgICAgICAgICAgICAgICAgICB9IGVsc2Ugew0KICAgICAgICAgICAgICAgICAgICAgICAgb25FcnJvcigiU29tZXRoaW5nIHdlbnQgd3JvbmciKTsNCiAgICAgICAgICAgICAgICAgICAgfQ0KDQogICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkgew0KICAgICAgICAgICAgICAgICAgICBvbkVycm9yKCJTb21ldGhpbmcgd2VudCB3cm9uZyIpOw0KICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgIH0gZWxzZSB7DQogICAgICAgICAgICAgICAgb25FcnJvcihgTm8gcmVzdWx0cyBmb3IgJHtjaGFubmVsRGF0YX1gKTsNCiAgICAgICAgICAgIH0NCg0KICAgICAgICB9KSk7DQoNCiAgICB9LA0KICAgIGluaUJsYWNrbGlzdEFkZDogKCkgPT4gew0KDQogICAgICAgIGNvbnN0IGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiZGl2Iik7DQogICAgICAgIGJhY2tkcm9wLmlkID0gImJhY2tkcm9wIjsNCiAgICAgICAgYmFja2Ryb3AuYXBwZW5kQ2hpbGQoDQogICAgICAgICAgICBqMmQubWFrZSgiZGl2Iiwge2lkOiAiZGlhbG9nIiwgY2xhc3M6ICJub1Jlc3VsdHMifSwgWw0KICAgICAgICAgICAgICAgIGoyZC5tYWtlKCJkaXYiLCB7aWQ6ICJzZWFyY2hGb3JtIn0sIFsNCiAgICAgICAgICAgICAgICAgICAgajJkLm1ha2UoImlucHV0Iiwge2lkOiAiY2hhbm5lbERhdGFJbnB1dCIsIHR5cGU6ICJ0ZXh0IiwgcGxhY2Vob2xkZXI6ICJAaGFuZGxlIG9yIFVDeHh4In0pLA0KICAgICAgICAgICAgICAgICAgICBqMmQubWFrZSgiZGl2Iiwge2lkOiAic2VhcmNoRGlhbG9nIiwgY2xhc3M6ICJhY3Rpb24tYnV0dG9uIn0sICJTZWFyY2giKQ0KICAgICAgICAgICAgICAgIF0pLA0KICAgICAgICAgICAgICAgIGoyZC5tYWtlKCJkaXYiLCB7aWQ6ICJzZWFyY2hSZXN1bHQifSwgWw0KICAgICAgICAgICAgICAgICAgICBqMmQubWFrZSgiZGl2Iiwge2lkOiAic2VhcmNoUmVzdWx0TWVzc2FnZSJ9LCAiRW50ZXIgY2hhbm5lbCBoYW5kbGUgb3IgY2hhbm5lbCBpZCIpLA0KICAgICAgICAgICAgICAgICAgICBqMmQubWFrZSgiZGl2Iiwge2lkOiAic2VhcmNoQ2hhbm5lbEF2YXRhckNvbnRhaW5lciJ9LCBbDQogICAgICAgICAgICAgICAgICAgICAgICBqMmQubWFrZSgiaW1nIiwge2lkOiAic2VhcmNoQ2hhbm5lbEF2YXRhciIsIGFsdDogIiIsIHNyYzogIiJ9KSwNCiAgICAgICAgICAgICAgICAgICAgXSksDQogICAgICAgICAgICAgICAgICAgIGoyZC5tYWtlKCJkaXYiLCB7aWQ6ICJibG9ja2VkSW5kaWNhdG9yIn0sICJCTE9DS0VEIiksDQogICAgICAgICAgICAgICAgICAgIGoyZC5tYWtlKCJkaXYiLCB7aWQ6ICJzZWFyY2hDaGFubmVsTmFtZSJ9LCAiLiIpLA0KICAgICAgICAgICAgICAgIF0pLA0KICAgICAgICAgICAgICAgIGoyZC5tYWtlKCJkaXYiLCB7aWQ6ICJkaWFsb2dBY3Rpb24ifSwgWw0KICAgICAgICAgICAgICAgICAgICBqMmQubWFrZSgiZGl2Iiwge2lkOiAiY2xvc2VEaWFsb2ciLCBjbGFzczogImFjdGlvbi1idXR0b24ifSwgIkNsb3NlIiksDQogICAgICAgICAgICAgICAgICAgIGoyZC5tYWtlKCJkaXYiLCB7aWQ6ICJhZGREaWFsb2ciLCBjbGFzczogImFjdGlvbi1idXR0b24ifSwgIkFkZCIpLA0KICAgICAgICAgICAgICAgIF0pLA0KICAgICAgICAgICAgXSkNCiAgICAgICAgKTsNCg0KICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGJhY2tkcm9wKTsNCg0KICAgICAgICBiYWNrZHJvcC5xdWVyeVNlbGVjdG9yKCIjY2xvc2VEaWFsb2ciKT8uYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCAoKSA9PiBiYWNrZHJvcC5yZW1vdmUoKSk7DQogICAgICAgIGJhY2tkcm9wLnF1ZXJ5U2VsZWN0b3IoIiNzZWFyY2hEaWFsb2ciKT8uYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCAoKSA9PiBVdGlsLmluaUJsYWNrbGlzdFNlYXJjaCgpKTsNCiAgICAgICAgYmFja2Ryb3AucXVlcnlTZWxlY3RvcigiI2NoYW5uZWxEYXRhSW5wdXQiKT8uZm9jdXMoKTsNCiAgICAgICAgYmFja2Ryb3AucXVlcnlTZWxlY3RvcigiI2NoYW5uZWxEYXRhSW5wdXQiKT8uYWRkRXZlbnRMaXN0ZW5lcigia2V5dXAiLCAoZXZlbnQpID0+IHsNCiAgICAgICAgICAgIGlmIChldmVudC5rZXkgPT09ICJFbnRlciIpIHsNCiAgICAgICAgICAgICAgICBVdGlsLmluaUJsYWNrbGlzdFNlYXJjaCgpOw0KICAgICAgICAgICAgfQ0KICAgICAgICB9KTsNCiAgICAgICAgYmFja2Ryb3AucXVlcnlTZWxlY3RvcigiI2FkZERpYWxvZyIpPy5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsIChldmVudCkgPT4gew0KDQogICAgICAgICAgICBjb25zdCBkYXRhT2JqZWN0ID0gew0KICAgICAgICAgICAgICAgIGNoYW5uZWxIYW5kbGU6IGV2ZW50LnRhcmdldC5kYXRhc2V0Py5jaGFubmVsSGFuZGxlLA0KICAgICAgICAgICAgICAgIGNoYW5uZWxOYW1lOiBldmVudC50YXJnZXQuZGF0YXNldD8uY2hhbm5lbE5hbWUsDQogICAgICAgICAgICAgICAgY2hhbm5lbElkOiBldmVudC50YXJnZXQuZGF0YXNldD8uY2hhbm5lbElkDQogICAgICAgICAgICB9DQoNCiAgICAgICAgICAgIGlmICghT2JqZWN0Lmhhc093bihzZXR0aW5ncy5ibGFja2xpc3QsIGRhdGFPYmplY3QuY2hhbm5lbElkKSkgew0KICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJkaWFsb2ciKT8uY2xhc3NMaXN0LmFkZCgiY2hhbm5lbEJsb2NrZWQiKTsNCiAgICAgICAgICAgICAgICBjb25zdCBsaXN0Q29weSA9IHN0cnVjdHVyZWRDbG9uZShzZXR0aW5ncy5ibGFja2xpc3QpOw0KICAgICAgICAgICAgICAgIGxpc3RDb3B5W2RhdGFPYmplY3QuY2hhbm5lbElkXSA9IHsNCiAgICAgICAgICAgICAgICAgICAgbmFtZTogZGF0YU9iamVjdC5jaGFubmVsTmFtZSwNCiAgICAgICAgICAgICAgICAgICAgaGFuZGxlOiBkYXRhT2JqZWN0LmNoYW5uZWxIYW5kbGUNCiAgICAgICAgICAgICAgICB9Ow0KICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlQmxhY2tsaXN0KGxpc3RDb3B5LCB0cnVlKTsNCiAgICAgICAgICAgIH0NCg0KICAgICAgICB9KTsNCg0KICAgIH0sDQogICAgb25CbGFja2xpc3RSZW1vdmU6IGV2ZW50ID0+IHsNCg0KICAgICAgICBjb25zdCBjaGFubmVsSWQgPSBldmVudC50YXJnZXQ/LmRhdGFzZXQ/LnVjaWQ7DQoNCiAgICAgICAgaWYgKGNoYW5uZWxJZCAmJiBPYmplY3QuaGFzT3duKHNldHRpbmdzLmJsYWNrbGlzdCwgY2hhbm5lbElkKSkgew0KICAgICAgICAgICAgY29uc3QgbmV3TGlzdCA9IHN0cnVjdHVyZWRDbG9uZShzZXR0aW5ncy5ibGFja2xpc3QpOw0KICAgICAgICAgICAgZGVsZXRlIG5ld0xpc3RbY2hhbm5lbElkXTsNCiAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlQmxhY2tsaXN0KG5ld0xpc3QsIHRydWUpOw0KICAgICAgICB9DQoNCiAgICB9LA0KICAgIG9uQmxhY2tsaXN0SW1wb3J0OiAoKSA9PiB7DQogICAgICAgIHRyeSB7DQogICAgICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoImlucHV0Iik7DQogICAgICAgICAgICBpbnB1dC5tdWx0aXBsZSA9IGZhbHNlOw0KICAgICAgICAgICAgaW5wdXQuYWNjZXB0ID0gImFwcGxpY2F0aW9uL2pzb24iOw0KICAgICAgICAgICAgaW5wdXQudHlwZSA9ICJmaWxlIjsNCiAgICAgICAgICAgIGlucHV0Lm9uY2hhbmdlID0gKCkgPT4gew0KICAgICAgICAgICAgICAgIGlmIChpbnB1dC5maWxlcy5sZW5ndGggPiAwKSB7DQogICAgICAgICAgICAgICAgICAgIGlucHV0LmZpbGVzWzBdLnRleHQoKS50aGVuKGRhdGEgPT4gew0KDQogICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJzZWREYXRhID0gSlNPTi5wYXJzZShkYXRhKTsNCiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0xpc3QgPSBzdHJ1Y3R1cmVkQ2xvbmUoc2V0dGluZ3MuYmxhY2tsaXN0KTsNCg0KICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXMocGFyc2VkRGF0YSkuZm9yRWFjaCgoaXRlbSkgPT4gew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghT2JqZWN0Lmhhc093bihzZXR0aW5ncy5ibGFja2xpc3QsIGl0ZW0pKSB7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBwYXJzZWREYXRhW2l0ZW1dPy5uYW1lOw0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBoYW5kbGUgPSBwYXJzZWREYXRhW2l0ZW1dPy5oYW5kbGU7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNoYW5uZWwgbXVzdCBoYXZlIGVpdGhlciBhIG5hbWUgb3IgYSBoYW5kbGUNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5hbWUgfHwgaGFuZGxlKSB7DQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdMaXN0W2l0ZW1dID0gew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHBhcnNlZERhdGFbaXRlbV0/Lm5hbWUsDQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlOiBwYXJzZWREYXRhW2l0ZW1dPy5oYW5kbGUNCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfQ0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgICAgICAgICAgICAgIH0pOw0KDQogICAgICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMobmV3TGlzdCkubGVuZ3RoID4gMCkgew0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hbmFnZXIudXBkYXRlQmxhY2tsaXN0KG5ld0xpc3QsIHRydWUpOw0KICAgICAgICAgICAgICAgICAgICAgICAgfQ0KDQogICAgICAgICAgICAgICAgICAgIH0pOw0KICAgICAgICAgICAgICAgIH0NCiAgICAgICAgICAgIH07DQogICAgICAgICAgICBpbnB1dC5jbGljaygpOw0KICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHsNCiAgICAgICAgfQ0KICAgIH0sDQogICAgb25CbGFja2xpc3RFeHBvcnQ6ICgpID0+IHsNCiAgICAgICAgdHJ5IHsNCiAgICAgICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCJhIik7DQogICAgICAgICAgICBhLmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFtKU09OLnN0cmluZ2lmeShzZXR0aW5ncy5ibGFja2xpc3QsIG51bGwsIDIpXSwge3R5cGU6ICJhcHBsaWNhdGlvbi9qc29uIn0pKTsNCiAgICAgICAgICAgIGEuZG93bmxvYWQgPSBgSXJpZGl1bSR7YnJvd3Nlci5ydW50aW1lLmdldE1hbmlmZXN0KCkudmVyc2lvbn0tYmxhY2tsaXN0Lmpzb25gOw0KICAgICAgICAgICAgYS5jbGljaygpOw0KICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHsNCiAgICAgICAgfQ0KICAgIH0sDQogICAgaW5pQmxhY2tsaXN0OiAoKSA9PiB7DQogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJmaWx0ZXJDaGFubmVscyIpPy5hZGRFdmVudExpc3RlbmVyKCJrZXl1cCIsIFV0aWwub25CbGFja2xpc3RGaWx0ZXJDaGFuZ2UpOw0KICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiYmxhY2tsaXN0Q2hhbm5lbHMiKT8uYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCBVdGlsLm9uQmxhY2tsaXN0UmVtb3ZlKTsNCiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImFkZENoYW5uZWwiKT8uYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCBVdGlsLmluaUJsYWNrbGlzdEFkZCk7DQogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJpbXBvcnRMaXN0Iik/LmFkZEV2ZW50TGlzdGVuZXIoImNsaWNrIiwgVXRpbC5vbkJsYWNrbGlzdEltcG9ydCk7DQogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJleHBvcnRMaXN0Iik/LmFkZEV2ZW50TGlzdGVuZXIoImNsaWNrIiwgVXRpbC5vbkJsYWNrbGlzdEV4cG9ydCk7DQogICAgfSwNCiAgICBpbmk6ICgpID0+IHsNCg0KICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgidmVyc2lvbiIpLnRleHRDb250ZW50ID0gYnJvd3Nlci5ydW50aW1lLmdldE1hbmlmZXN0KCkudmVyc2lvbjsNCiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIml0ZW1zIik/LmFkZEV2ZW50TGlzdGVuZXIoImNsaWNrIiwgVXRpbC50b2dnbGVNZW51SXRlbSwgdHJ1ZSk7DQogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJjb250ZW50cyIpPy5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsIFV0aWwuc2V0dGluZ0FjdGlvbiwgdHJ1ZSk7DQogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJjb250ZW50cyIpPy5hZGRFdmVudExpc3RlbmVyKCJjaGFuZ2UiLCBVdGlsLnNldHRpbmdBY3Rpb24sIHRydWUpOw0KICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCJbZGF0YS1tZW51XSIpLmZvckVhY2goVXRpbC5wb3B1bGF0ZU9wdGlvbnMpOw0KDQogICAgICAgIFV0aWwuaW5pQmxhY2tsaXN0KCk7DQogICAgICAgIFV0aWwuY2hlY2tTdG9yYWdlKCkudGhlbigpOw0KDQogICAgfSwNCn07DQoNClV0aWwuaW5pKCk7\"></script>\r\n</body>\r\n</html>"
			};
			
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
		  const BUS = (function () {
		    if (globalThis.__BUS) {
		      return globalThis.__BUS;
		    }
		    globalThis.__BUS = createEventBus(
		      "iridium-for-youtube",
		      IS_IFRAME ? "iframe" : "page"
		    );
		    return globalThis.__BUS;
		  })();
		  const RUNTIME = createRuntime(isBackground ? "background" : "tab", BUS);
		  const createNoopListeners = () => ({
		    addListener: (callback) => {
		      _log("addListener", callback);
		    },
		    removeListener: (callback) => {
		      _log("removeListener", callback);
		    },
		  });
		  // TODO: Stub
		  const storageChangeListeners = new Set();
		  function broadcastStorageChange(changes, areaName) {
		    storageChangeListeners.forEach((listener) => {
		      listener(changes, areaName);
		    });
		  }
		
		  let REQ_PERMS = [];
		
  // #region Chrome polyfill
			  let chrome = {
			    extension: {
			      isAllowedIncognitoAccess: () => Promise.resolve(true),
			      sendMessage: (...args) => _messagingHandler.sendMessage(...args),
			    },
			    permissions: {
			      // TODO: Remove origin permission means exclude from origin in startup
			      request: (permissions, callback) => {
			        _log("permissions.request", permissions, callback);
			        if (Array.isArray(permissions)) {
			          REQ_PERMS = [...REQ_PERMS, ...permissions];
			        }
			        if (typeof callback === "function") {
			          callback(permissions);
			        }
			        return Promise.resolve(permissions);
			      },
			      contains: (permissions, callback) => {
			        if (typeof callback === "function") {
			          callback(true);
			        }
			        return Promise.resolve(true);
			      },
			      getAll: () => {
			        return Promise.resolve({
			          permissions: EXTENSION_PERMISSIONS,
			          origins: ORIGIN_PERMISSIONS,
			        });
			      },
			      onAdded: createNoopListeners(),
			      onRemoved: createNoopListeners(),
			    },
			    i18n: {
			      getUILanguage: () => {
			        return USED_LOCALE || "en";
			      },
			      getMessage: (key, substitutions = []) => {
			        if (typeof substitutions === "string") {
			          substitutions = [substitutions];
			        }
			        if (typeof LOCALE_KEYS !== "undefined" && LOCALE_KEYS[key]) {
			          return LOCALE_KEYS[key].message?.replace(
			            /\$(\d+)/g,
			            (match, p1) => substitutions[p1 - 1] || match
			          );
			        }
			        return key;
			      },
			    },
			    alarms: {
			      onAlarm: createNoopListeners(),
			      create: () => {
			        _log("alarms.create", arguments);
			      },
			      get: () => {
			        _log("alarms.get", arguments);
			      },
			    },
			    runtime: {
			      ...RUNTIME,
			      onInstalled: createNoopListeners(),
			      onStartup: createNoopListeners(),
			      // TODO: Postmessage to parent to open options page or call openOptionsPage
			      openOptionsPage: () => {
			        // const url = chrome.runtime.getURL(OPTIONS_PAGE_PATH);
			        // console.log("openOptionsPage", _openTab, url, EXTENSION_ASSETS_MAP);
			        // _openTab(url);
			        if (typeof openOptionsPage === "function") {
			          openOptionsPage();
			        } else if (window.parent) {
			          window.parent.postMessage({ type: "openOptionsPage" }, "*");
			        } else {
			          _warn("openOptionsPage not available.");
			        }
			      },
			      getManifest: () => {
			        // The manifest object will be injected into the scope where buildPolyfill is called
			        if (typeof INJECTED_MANIFEST !== "undefined") {
			          return JSON.parse(JSON.stringify(INJECTED_MANIFEST)); // Return deep copy
			        }
			        _warn("INJECTED_MANIFEST not found for chrome.runtime.getManifest");
			        return { name: "Unknown", version: "0.0", manifest_version: 2 };
			      },
			      getURL: (path) => {
			        if (!path) return "";
			        if (path.startsWith("/")) {
			          path = path.substring(1);
			        }
			
			        if (typeof _createAssetUrl === "function") {
			          return _createAssetUrl(path);
			        }
			
			        _warn(
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
			      id: "polyfilled-extension-" + Math.random().toString(36).substring(2, 15),
			      lastError: null,
			      getPlatformInfo: async () => {
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
			        get: function (keys, callback) {
			          if (typeof _storageGet !== "function")
			            throw new Error("_storageGet not defined");
			
			          const promise = _storageGet(keys);
			
			          if (typeof callback === "function") {
			            promise
			              .then((result) => {
			                try {
			                  callback(result);
			                } catch (e) {
			                  _error("Error in storage.get callback:", e);
			                }
			              })
			              .catch((error) => {
			                _error("Storage.get error:", error);
			                callback({});
			              });
			            return;
			          }
			
			          return promise;
			        },
			        set: function (items, callback) {
			          if (typeof _storageSet !== "function")
			            throw new Error("_storageSet not defined");
			
			          const promise = _storageSet(items).then((result) => {
			            broadcastStorageChange(items, "local");
			            return result;
			          });
			
			          if (typeof callback === "function") {
			            promise
			              .then((result) => {
			                try {
			                  callback(result);
			                } catch (e) {
			                  _error("Error in storage.set callback:", e);
			                }
			              })
			              .catch((error) => {
			                _error("Storage.set error:", error);
			                callback();
			              });
			            return;
			          }
			
			          return promise;
			        },
			        remove: function (keys, callback) {
			          if (typeof _storageRemove !== "function")
			            throw new Error("_storageRemove not defined");
			
			          const promise = _storageRemove(keys).then((result) => {
			            const changes = {};
			            const keyList = Array.isArray(keys) ? keys : [keys];
			            keyList.forEach((key) => {
			              changes[key] = { oldValue: undefined, newValue: undefined };
			            });
			            broadcastStorageChange(changes, "local");
			            return result;
			          });
			
			          if (typeof callback === "function") {
			            promise
			              .then((result) => {
			                try {
			                  callback(result);
			                } catch (e) {
			                  _error("Error in storage.remove callback:", e);
			                }
			              })
			              .catch((error) => {
			                _error("Storage.remove error:", error);
			                callback();
			              });
			            return;
			          }
			
			          return promise;
			        },
			        clear: function (callback) {
			          if (typeof _storageClear !== "function")
			            throw new Error("_storageClear not defined");
			
			          const promise = _storageClear().then((result) => {
			            broadcastStorageChange({}, "local");
			            return result;
			          });
			
			          if (typeof callback === "function") {
			            promise
			              .then((result) => {
			                try {
			                  callback(result);
			                } catch (e) {
			                  _error("Error in storage.clear callback:", e);
			                }
			              })
			              .catch((error) => {
			                _error("Storage.clear error:", error);
			                callback();
			              });
			            return;
			          }
			
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
			      sync: {
			        get: function (keys, callback) {
			          _warn("chrome.storage.sync polyfill maps to local");
			          return chrome.storage.local.get(keys, callback);
			        },
			        set: function (items, callback) {
			          _warn("chrome.storage.sync polyfill maps to local");
			
			          const promise = chrome.storage.local.set(items).then((result) => {
			            broadcastStorageChange(items, "sync");
			            return result;
			          });
			
			          if (typeof callback === "function") {
			            promise
			              .then((result) => {
			                try {
			                  callback(result);
			                } catch (e) {
			                  _error("Error in storage.sync.set callback:", e);
			                }
			              })
			              .catch((error) => {
			                _error("Storage.sync.set error:", error);
			                callback();
			              });
			            return;
			          }
			
			          return promise;
			        },
			        remove: function (keys, callback) {
			          _warn("chrome.storage.sync polyfill maps to local");
			
			          const promise = chrome.storage.local.remove(keys).then((result) => {
			            const changes = {};
			            const keyList = Array.isArray(keys) ? keys : [keys];
			            keyList.forEach((key) => {
			              changes[key] = { oldValue: undefined, newValue: undefined };
			            });
			            broadcastStorageChange(changes, "sync");
			            return result;
			          });
			
			          if (typeof callback === "function") {
			            promise
			              .then((result) => {
			                try {
			                  callback(result);
			                } catch (e) {
			                  _error("Error in storage.sync.remove callback:", e);
			                }
			              })
			              .catch((error) => {
			                _error("Storage.sync.remove error:", error);
			                callback();
			              });
			            return;
			          }
			
			          return promise;
			        },
			        clear: function (callback) {
			          _warn("chrome.storage.sync polyfill maps to local");
			
			          const promise = chrome.storage.local.clear().then((result) => {
			            broadcastStorageChange({}, "sync");
			            return result;
			          });
			
			          if (typeof callback === "function") {
			            promise
			              .then((result) => {
			                try {
			                  callback(result);
			                } catch (e) {
			                  _error("Error in storage.sync.clear callback:", e);
			                }
			              })
			              .catch((error) => {
			                _error("Storage.sync.clear error:", error);
			                callback();
			              });
			            return;
			          }
			
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
			          _warn("chrome.storage.managed polyfill is read-only empty.");
			
			          const promise = Promise.resolve({});
			
			          if (typeof callback === "function") {
			            promise.then((result) => {
			              try {
			                callback(result);
			              } catch (e) {
			                _error("Error in storage.managed.get callback:", e);
			              }
			            });
			            return;
			          }
			
			          return promise;
			        },
			      },
			    },
			    cookies: (function () {
			      const cookieChangeListeners = new Set();
			      function broadcastCookieChange(changeInfo) {
			        cookieChangeListeners.forEach((listener) => {
			          try {
			            listener(changeInfo);
			          } catch (e) {
			            _error("Error in cookies.onChanged listener:", e);
			          }
			        });
			      }
			
			      function handlePromiseCallback(promise, callback) {
			        if (typeof callback === "function") {
			          promise
			            .then((result) => callback(result))
			            .catch((error) => {
			              // chrome.runtime.lastError = { message: error.message }; // TODO: Implement lastError
			              _error(error);
			              callback(); // Call with undefined on error
			            });
			          return;
			        }
			        return promise;
			      }
			
			      return {
			        get: function (details, callback) {
			          if (typeof _cookieList !== "function") {
			            return handlePromiseCallback(
			              Promise.reject(new Error("_cookieList not defined")),
			              callback
			            );
			          }
			          const promise = _cookieList({
			            url: details.url,
			            name: details.name,
			            storeId: details.storeId,
			            partitionKey: details.partitionKey,
			          }).then((cookies) => {
			            if (!cookies || cookies.length === 0) {
			              return null;
			            }
			            // Sort by path length (longest first), then creation time (earliest first, if available)
			            cookies.sort((a, b) => {
			              const pathLenDiff = (b.path || "").length - (a.path || "").length;
			              if (pathLenDiff !== 0) return pathLenDiff;
			              return (a.creationTime || 0) - (b.creationTime || 0);
			            });
			            return cookies[0];
			          });
			          return handlePromiseCallback(promise, callback);
			        },
			
			        getAll: function (details, callback) {
			          if (typeof _cookieList !== "function") {
			            return handlePromiseCallback(
			              Promise.reject(new Error("_cookieList not defined")),
			              callback
			            );
			          }
			          if (details.partitionKey) {
			            _warn(
			              "cookies.getAll: partitionKey is not fully supported in this environment."
			            );
			          }
			          const promise = _cookieList(details);
			          return handlePromiseCallback(promise, callback);
			        },
			
			        set: function (details, callback) {
			          const promise = (async () => {
			            if (
			              typeof _cookieSet !== "function" ||
			              typeof _cookieList !== "function"
			            ) {
			              throw new Error("_cookieSet or _cookieList not defined");
			            }
			            if (details.partitionKey) {
			              _warn(
			                "cookies.set: partitionKey is not fully supported in this environment."
			              );
			            }
			
			            const getDetails = {
			              url: details.url,
			              name: details.name,
			              storeId: details.storeId,
			            };
			            const oldCookies = await _cookieList(getDetails);
			            const oldCookie = oldCookies && oldCookies[0];
			
			            if (oldCookie) {
			              broadcastCookieChange({
			                cause: "overwrite",
			                cookie: oldCookie,
			                removed: true,
			              });
			            }
			
			            await _cookieSet(details);
			            const newCookies = await _cookieList(getDetails);
			            const newCookie = newCookies && newCookies[0];
			
			            if (newCookie) {
			              broadcastCookieChange({
			                cause: "explicit",
			                cookie: newCookie,
			                removed: false,
			              });
			            }
			            return newCookie || null;
			          })();
			          return handlePromiseCallback(promise, callback);
			        },
			
			        remove: function (details, callback) {
			          const promise = (async () => {
			            if (
			              typeof _cookieDelete !== "function" ||
			              typeof _cookieList !== "function"
			            ) {
			              throw new Error("_cookieDelete or _cookieList not defined");
			            }
			            const oldCookies = await _cookieList(details);
			            const oldCookie = oldCookies && oldCookies[0];
			
			            if (!oldCookie) return null; // Nothing to remove
			
			            await _cookieDelete(details);
			
			            broadcastCookieChange({
			              cause: "explicit",
			              cookie: oldCookie,
			              removed: true,
			            });
			
			            return {
			              url: details.url,
			              name: details.name,
			              storeId: details.storeId || "0",
			              partitionKey: details.partitionKey,
			            };
			          })();
			          return handlePromiseCallback(promise, callback);
			        },
			
			        getAllCookieStores: function (callback) {
			          const promise = Promise.resolve([
			            { id: "0", tabIds: [1] }, // Mock store for the current context
			          ]);
			          return handlePromiseCallback(promise, callback);
			        },
			
			        getPartitionKey: function (details, callback) {
			          _warn(
			            "chrome.cookies.getPartitionKey is not supported in this environment."
			          );
			          const promise = Promise.resolve({ partitionKey: {} }); // Return empty partition key
			          return handlePromiseCallback(promise, callback);
			        },
			
			        onChanged: {
			          addListener: (callback) => {
			            if (typeof callback === "function") {
			              cookieChangeListeners.add(callback);
			            }
			          },
			          removeListener: (callback) => {
			            cookieChangeListeners.delete(callback);
			          },
			        },
			      };
			    })(),
			    tabs: {
			      query: async (queryInfo) => {
			        _warn("chrome.tabs.query polyfill only returns current tab info.");
			        const dummyId = Math.floor(Math.random() * 1000) + 1;
			        return [
			          {
			            id: dummyId,
			            url: CURRENT_LOCATION,
			            active: true,
			            windowId: 1,
			            status: "complete",
			          },
			        ];
			      },
			      create: async ({ url, active = true }) => {
			        _log(`[Polyfill tabs.create] URL: ${url}`);
			        if (typeof _openTab !== "function")
			          throw new Error("_openTab not defined");
			        _openTab(url, active);
			        const dummyId = Math.floor(Math.random() * 1000) + 1001;
			        return Promise.resolve({
			          id: dummyId,
			          url: url,
			          active,
			          windowId: 1,
			        });
			      },
			      sendMessage: async (tabId, message) => {
			        _warn(
			          `chrome.tabs.sendMessage polyfill (to tab ${tabId}) redirects to runtime.sendMessage (current context).`
			        );
			        return chrome.runtime.sendMessage(message);
			      },
			    },
			    notifications: {
			      create: async (notificationId, options) => {
			        try {
			          let id = notificationId;
			          let notificationOptions = options;
			
			          if (typeof notificationId === "object" && notificationId !== null) {
			            notificationOptions = notificationId;
			            id = "notification_" + Math.random().toString(36).substring(2, 15);
			          } else if (typeof notificationId === "string" && options) {
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
			
			          if ("Notification" in window) {
			            if (Notification.permission === "granted") {
			              const notification = new Notification(title, {
			                body: message,
			                icon: iconUrl,
			                tag: id,
			              });
			
			              _log(`[Notifications] Created notification: ${id}`);
			              return id;
			            } else if (Notification.permission === "default") {
			              const permission = await Notification.requestPermission();
			              if (permission === "granted") {
			                const notification = new Notification(title, {
			                  body: message,
			                  icon: iconUrl,
			                  tag: id,
			                });
			                _log(
			                  `[Notifications] Created notification after permission: ${id}`
			                );
			                return id;
			              } else {
			                _warn("[Notifications] Permission denied for notifications");
			                return id;
			              }
			            } else {
			              _warn("[Notifications] Notifications are blocked");
			              return id;
			            }
			          } else {
			            _warn(
			              "[Notifications] Native notifications not supported, using console fallback"
			            );
			            _log(`[Notification] ${title}: ${message}`);
			            return id;
			          }
			        } catch (error) {
			          _error("[Notifications] Error creating notification:", error.message);
			          throw error;
			        }
			      },
			      clear: async (notificationId) => {
			        _log(`[Notifications] Clear notification: ${notificationId}`);
			        // For native notifications, there's no direct way to clear by ID
			        // This is a limitation of the Web Notifications API
			        return true;
			      },
			      getAll: async () => {
			        _warn("[Notifications] getAll not fully supported in polyfill");
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
			
			          _log(
			            `[ContextMenus] Created context menu item: ${title} (${menuId})`
			          );
			
			          // Try to register a menu command as fallback
			          if (typeof _registerMenuCommand === "function") {
			            try {
			              _registerMenuCommand(
			                title,
			                onclick ||
			                  (() => {
			                    _log(`Context menu clicked: ${title}`);
			                  })
			              );
			            } catch (e) {
			              _warn(
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
			          _error("[ContextMenus] Error creating context menu:", error.message);
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
			
			          _log(`[ContextMenus] Updated context menu item: ${id}`);
			
			          if (callback && typeof callback === "function") {
			            setTimeout(() => callback(), 0);
			          }
			        } catch (error) {
			          _error("[ContextMenus] Error updating context menu:", error.message);
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
			            _log(`[ContextMenus] Removed context menu item: ${menuItemId}`);
			          } else {
			            _warn(
			              `[ContextMenus] Context menu item not found for removal: ${menuItemId}`
			            );
			          }
			
			          if (callback && typeof callback === "function") {
			            setTimeout(() => callback(), 0);
			          }
			        } catch (error) {
			          _error("[ContextMenus] Error removing context menu:", error.message);
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
			            _log(`[ContextMenus] Removed all ${count} context menu items`);
			          }
			
			          if (callback && typeof callback === "function") {
			            setTimeout(() => callback(), 0);
			          }
			        } catch (error) {
			          _error(
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
			          _log("[ContextMenus] Added click listener");
			        },
			        removeListener: (callback) => {
			          if (window._polyfillContextMenuListeners) {
			            window._polyfillContextMenuListeners.delete(callback);
			            _log("[ContextMenus] Removed click listener");
			          }
			        },
			      },
			    },
			  };
			
			  const tc = (fn) => {
			    try {
			      fn();
			    } catch (e) {}
			  };
			  const loggingProxyHandler = (_key) => ({
			    get(target, key, receiver) {
			      tc(() => _log(`[${contextType}] [CHROME - ${_key}] Getting ${key}`));
			      return Reflect.get(target, key, receiver);
			    },
			    set(target, key, value, receiver) {
			      tc(() =>
			        _log(`[${contextType}] [CHROME - ${_key}] Setting ${key} to ${value}`)
			      );
			      return Reflect.set(target, key, value, receiver);
			    },
			    has(target, key) {
			      tc(() =>
			        _log(`[${contextType}] [CHROME - ${_key}] Checking if ${key} exists`)
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
			      try {
			        return __globalsStorage[key] || Reflect.get(target, key, receiver);
			      } catch (e) {
			        _error("Error getting", key, e);
			        return undefined;
			      }
			    },
			    set(target, key, value, receiver) {
			      try {
			        tc(() => _log(`[${contextType}] Setting ${key} to ${value}`));
			        set(key, value);
			        return Reflect.set(target, key, value, receiver);
			      } catch (e) {
			        _error("Error setting", key, value, e);
			        return false;
			      }
			    },
			    has(target, key) {
			      try {
			        return key in __globalsStorage || key in target;
			      } catch (e) {
			        _error("Error has", key, e);
			        return false;
			      }
			    },
			    getOwnPropertyDescriptor(target, key) {
			      try {
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
			      } catch (e) {
			        _error("Error getOwnPropertyDescriptor", key, e);
			        return {
			          configurable: true,
			          enumerable: true,
			          writable: true,
			          value: undefined,
			        };
			      }
			    },
			
			    defineProperty(target, key, descriptor) {
			      try {
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
			      } catch (e) {
			        _error("Error defineProperty", key, descriptor, e);
			        return false;
			      }
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
			
			  __globalsStorage.contextId = contextId;
			  __globalsStorage.contextType = contextType;
			  __globalsStorage.module = undefined;
			  __globalsStorage.amd = undefined;
			  __globalsStorage.define = undefined;
			
			  return __globals;
			}
			
			
			if (typeof window !== 'undefined') {
			    window.buildPolyfill = buildPolyfill;
			}
			
  // #endregion
// #endregion
    // #endregion
   // #region Background Script Environment
	
	const START_BACKGROUND_SCRIPT = (function(){
	  const backgroundPolyfill = buildPolyfill({ isBackground: true });
	  const scriptName = "Iridium for YouTube";
	  const debug = "[Iridium for YouTube]";
	  _log(debug + ' Executing background scripts...');
	
	  function executeBackgroundScripts(){
	    with(backgroundPolyfill){
	      // BG: js/setting-data.js
	const SettingData = {
	    extensionButton: {
	        id: "extensionButton",
	        default: true,
	    },
	    syncSettings: {
	        id: "syncSettings",
	        default: false,
	    },
	    fullTitles: {
	        id: "fullTitles",
	        default: true,
	    },
	    theme: {
	        id: "theme",
	        default: "deviceTheme",
	    },
	    logoSubscriptions: {
	        id: "logoSubscriptions",
	        default: false,
	    },
	    autoplayChannelTrailer: {
	        id: "autoplayChannelTrailer",
	        default: false,
	    },
	    channelTab: {
	        id: "channelTab",
	        default: "featured",
	    },
	    homeShorts: {
	        id: "homeShorts",
	        default: true,
	    },
	    subscriptionsShorts: {
	        id: "subscriptionsShorts",
	        default: true,
	    },
	    videoPageShorts: {
	        id: "videoPageShorts",
	        default: true,
	    },
	    searchShorts: {
	        id: "searchShorts",
	        default: true,
	    },
	    adOptOutAll: {
	        id: "adOptOutAll",
	        default: false,
	    },
	    adSubscribed: {
	        id: "adSubscribed",
	        default: false,
	    },
	    adVideoFeed: {
	        id: "adVideoFeed",
	        default: false,
	    },
	    adInVideo: {
	        id: "adInVideo",
	        default: false,
	    },
	    adTaggedProducts: {
	        id: "adTaggedProducts",
	        default: false,
	    },
	    adMasthead: {
	        id: "adMasthead",
	        default: false,
	    },
	    adHomeFeed: {
	        id: "adHomeFeed",
	        default: false,
	    },
	    adSearchFeed: {
	        id: "adSearchFeed",
	        default: false,
	    },
	    videoFocus: {
	        id: "videoFocus",
	        default: true,
	    },
	    creatorMerch: {
	        id: "creatorMerch",
	        default: true,
	    },
	    videoCount: {
	        id: "videoCount",
	        default: true,
	    },
	    ambientMode: {
	        id: "ambientMode",
	        default: true,
	    },
	    reversePlaylist: {
	        id: "reversePlaylist",
	        default: true,
	    },
	    reversePlaylistToggled: {
	        id: "reversePlaylistToggled",
	        default: false,
	    },
	    superTheater: {
	        id: "superTheater",
	        default: true,
	    },
	    superTheaterScrollbar: {
	        id: "superTheaterScrollbar",
	        default: true,
	    },
	    defaultQuality: {
	        id: "defaultQuality",
	        default: "auto",
	    },
	    defaultSpeed: {
	        id: "defaultSpeed",
	        default: "-1",
	    },
	    alwaysVisible: {
	        id: "alwaysVisible",
	        default: true,
	    },
	    alwaysVisiblePosition: {
	        id: "alwaysVisiblePosition",
	        default: {},
	    },
	    hfrAllowed: {
	        id: "hfrAllowed",
	        default: true,
	    },
	    autoplay: {
	        id: "autoplay",
	        default: false,
	    },
	    loudness: {
	        id: "loudness",
	        default: false,
	    },
	    scrollVolume: {
	        id: "scrollVolume",
	        default: true,
	    },
	    scrollVolumeShift: {
	        id: "scrollVolumeShift",
	        default: true,
	    },
	    scrollVolumeStep: {
	        id: "scrollVolumeStep",
	        default: 5,
	    },
	    infoCards: {
	        id: "infoCards",
	        default: false,
	    },
	    annotations: {
	        id: "annotations",
	        default: true,
	    },
	    endScreen: {
	        id: "endScreen",
	        default: false,
	    },
	    autoplayShortcut: {
	        id: "autoplayShortcut",
	        default: true,
	    },
	    videoFocusToggle: {
	        id: "videoFocusToggle",
	        default: true,
	    },
	    videoScreenshot: {
	        id: "videoScreenshot",
	        default: true,
	    },
	    videoThumbnail: {
	        id: "videoThumbnail",
	        default: true,
	    },
	    monetizationInfo: {
	        id: "monetizationInfo",
	        default: true,
	    },
	    blacklistEnabled: {
	        id: "blacklistEnabled",
	        default: true,
	    },
	    blacklistButton: {
	        id: "blacklistButton",
	        default: true,
	    },
	    blacklist: {
	        id: "blacklist",
	        default: {},
	    },
	};
	const getDefaultSettings = () => Object.keys(SettingData).reduce((previousValue, currentValue) => ({
	    ...previousValue,
	    [currentValue]: SettingData[currentValue].default
	}), {});
	
	    // BG: js/background.js
	
	
	globalThis.browser ??= chrome;
	
	const openOptions = () => {
	    browser.runtime.openOptionsPage()?.then?.();
	}
	const Api = {
	    debounce: false,
	    onMessageListener: (data) => {
	
	        if (!data.type || !data.payload || Api.debounce) {
	            return;
	        }
	
	        // prevents the options page from opening in duplicate
	        Api.debounce = true;
	        setTimeout(() => Api.debounce = false, 1000);
	
	        if (data.payload === SettingData.extensionButton.id) {
	            openOptions();
	        }
	
	    }
	}
	const onConnect = (port) => {
	    port.onMessage.addListener(Api.onMessageListener);
	}
	
	browser.runtime.onConnect.addListener(onConnect);
	// firefox mv2
	browser.browserAction.onClicked.addListener(openOptions);
	    }
	  }
	
	  executeBackgroundScripts.call(backgroundPolyfill);
	
	  _log(debug + ' Background scripts execution complete.');
	});
	
	setTimeout(() => {
	  // Wait for things to be defined
	  START_BACKGROUND_SCRIPT();
	}, 10);
	_log("START_BACKGROUND_SCRIPT", START_BACKGROUND_SCRIPT);
	// End background script environment
	
	
   // #endregion
    // #region Orchestration Logic
	// Other globals currently defined at this spot: SCRIPT_NAME, _log, _warn, _error
	const INJECTED_MANIFEST = {"manifest_version":2,"name":"Iridium for YouTube","version":"2.1.2","description":"Take control of YouTube and boost your user experience with Iridium","permissions":["storage","*://www.youtube.com/*"],"optional_permissions":[],"content_scripts":[{"matches":["*://www.youtube.com/*"],"css":["css/content-script.css"],"js":["js/setting-data.js","js/background-inject.js","js/content-script.js"],"run_at":"document_start"}],"options_ui":{"page":"html/options.html","open_in_tab":true},"browser_action":{"default_icon":{"16":"icons/16.png","32":"icons/32.png","48":"icons/48.png","64":"icons/64.png","128":"icons/128.png"}},"page_action":{},"action":{},"icons":{"16":"icons/16.png","32":"icons/32.png","48":"icons/48.png","64":"icons/64.png","128":"icons/128.png"},"web_accessible_resources":[],"background":{"scripts":["js/setting-data.js","js/background.js"],"persistent":false},"_id":"iridium-for-youtube"};
	const CONTENT_SCRIPT_CONFIGS_FOR_MATCHING = [
	  {
	    "matches": [
	      "*://www.youtube.com/*"
	    ]
	  }
	];
	const OPTIONS_PAGE_PATH = "html/options.html";
	const POPUP_PAGE_PATH = null;
	const EXTENSION_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABSBJREFUeNrUWktsG0UYnsnaUXjGVZS0gEQj0UO5IKuq1F4A3yIuODcOSDQ5IK41NyQk8AGJW+wrQmoi7pDcKJd1b6lASrigSCDFEq/KLY1bKSU0sYfvX8+uZ8czs7bjV1b6NLNee/f/Zr7/MbNmzHIIJnxgDciws3g0OQhwIUDgAP2VM0fgaVr4gDhORdjBee7MEDh8VviAIDx5poV/ZwJ8ByxOip3cdqE+K3w0wYhzIb8s2sBRBErPH/L6RBKozQsfhloJSFSJyOxjvj5xBP58GQRoBuzGq6jgu8VzB7wyMQSqF1sS4l0QmGpG/XUiMvcPr46dwK+XeidALVDHTcvz9/nnYyXwy+txJ04ioJEgVHFeWLjPN8dC4Oc3DARaKZpNUT80WPYNBJjXDK5ViMj5Gt8dKYEfr8ajkColG4EA9FlDI9KQ/tEiMtCwO2W7cJyO4+m00levpbTvaucn8rzhsZXmFNu/d17cHMkM3Hmr7cQmR1Ylo0tHHflQSjQrXiP6rIqZWl2onT7splwz4EpiMGIXbQbtookAGYoRD/pNMpy3zgm4tgj4tQVRgfxW5x/0H3ZPQ+AR2i0iAOQlmWi0Q+OJiOCR4UE/QoPlPMb2H8yJEn5fnHvYu3907QMOVIEytH4bOFJ94ETr29BIsZsgtP/wXO9lu5VA6LSq8yZgWxLZVo2PGZtWoH7uBW2m6bFbILHz6MXuy3anhFxZ2JK8jiCV22jvYkTzJC+haJ98oRnKh7WlxFi7BZcs7uk/fkFsQo6F5w7d/jFQAorj1tFu4Pwy2iW0mZj2HQSU0LiMey9jHVLE/Uoz/5n9oysn7jBeT14SquPKUd9Dfw/G5YBrwIzNaMOiPHzeZ3jejeO0KKaPO8v2/ggkxH5DxKkA28ASkNUJxEZfGJMThepbJ564gfsWOWvnj4ES6DBeap9anB8BW8Bd3HaJjIplVGGdARU5PCcnhKCZICLVgRBQY39gvOK0nq59zu7hthtoLwdEOMvoRKxVr5QunrFC/iGYKKdcYVQtI2IFnK59aqcU7RsMl4Nq1r1S7UawDZzX6tOzeopCLgIO7ZsizQWThFQyLHnhtA57EJ0SJNQtgSTjpeEUgcjwbEdFaZNNM248KtoKGT79pA8njkKnFkI9k/bbjhuCMus1ItGL3httAnU8i1Z3/YfRmOFtZ4qM17XPWsmKMnEeZ52OytyaD/VOI94QrPTq76dMZKbkpRqvyYcyb14ScCarSPPNDgKbeGbh0l6/pcR03JlMBAzGk87fBq5bV1DJWzO7ZHj2p+4WO/Ywmk5OXqrx6F+Xxs9YM6xb73VaE+Tu8NLAFjQ2AuFSURq+COSpYGNagWbMsGa9l2BJcemH3hc0PRHQirZZtO9RxdlNgWaRC4XF1Xe/HdKS0kZAzkLWkayS9E6bXqsffDPkRb2NgClhWcNk3HiK5+UPvx7ctmNPBMKiLaw01WRl3KSJO+o64nmhUBrsxlZXBPSiLUxa4crKVQbjdxU8pfDpF8PZWnTmAW6J/XqFadF8sLn75SfD3dxNngGH9k3bfKRzoAyU1j4e/usnNwEt9juNl2UuRzz/6qPRveBwZmJVOkanZbF4Xtx4f/SvmJwzEEtemtOGYZF0vrU8vpd8XREI5aM6LZevWb9/Z7yvWa0ETtLtml+TTVDm+m+OTuf9zUCqXbBJ42k7vbBzZfQ67+t46S/hv/KHEBer4uC13wb7VmUkx3xN+Bf+FmsgMdF/t/lfgAEAeu5nx8gUITUAAAAASUVORK5CYII=";
	const extensionCssData = {    "css/content-script.css": "/* ini | autoplay */\r\n#movie_player.unstarted-mode:is(.playing-mode, .paused-mode):not(.buffering-mode, .ytp-player-minimized) > *:not(.ytp-cued-thumbnail-overlay) {\r\n    display: none;\r\n}\r\n/* end | autoplay */\r\n\r\n/* ini | autoplay channel trailer */\r\n#c4-player.unstarted-mode:is(.playing-mode, .paused-mode):not(.buffering-mode) > *:not(.ytp-cued-thumbnail-overlay) {\r\n    display: none;\r\n}\r\n/* end | autoplay channel trailer */\r\n\r\n/* ini | video focus */\r\nhtml #masthead-container,\r\nhtml #secondary,\r\nhtml #below {\r\n    transition-property: opacity !important;\r\n    transition-duration: 0.8s !important;;\r\n    transition-timing-function: ease !important;;\r\n    transition-delay: 0.25s !important;;\r\n}\r\nhtml[dim] #masthead-container:not(:hover),\r\nhtml[dim] #secondary:not(:hover),\r\nhtml[dim] #below:not(:hover) {\r\n    opacity: 0.1;\r\n}\r\n/* end | video focus */\r\n\r\n/* ini | iridium icon */\r\nhtml[dark] .iridium-options yt-icon {\r\n    background: #fff;\r\n}\r\nhtml .iridium-options:hover yt-icon {\r\n    background: radial-gradient(circle at 0% 150%, #0ff 35%, #f0f 75%);\r\n}\r\n.iridium-options yt-icon {\r\n    mask-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><polygon opacity=\"0.5\" points=\"6.8,3 22.4,12 6.8,21\"/><path d=\"M6.8,3v18l15.6-9L6.8,3z M9.8,8.2l6.6,3.8l-6.6,3.8V8.2z\"/></svg>');\r\n    background: #030303;\r\n}\r\n/* end | iridium icon */\r\n\r\n/* ini | reverse playlist */\r\nytd-toggle-button-renderer:has([aria-label=\"reversePlaylistButton\"]) {\r\n    margin-left: 0 !important;\r\n}\r\nhtml[dark] [aria-label=\"reversePlaylistButton\"] yt-icon {\r\n    background: #f1f1f1;\r\n}\r\n[aria-label=\"reversePlaylistButton\"] yt-icon {\r\n    background: #0f0f0f;\r\n}\r\n[aria-label=\"reversePlaylistButton\"] yt-icon {\r\n    mask-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path d=\"M352.307-467.692v-295.462L228.538-639.385 200-667.692 372.308-840l172.307 172.308-28.538 28.307-123.769-123.769v295.462h-40.001ZM586.923-120 414.615-292.308l28.539-28.307 123.769 123.769v-295.462h40v295.462l123.769-123.769 28.539 28.307L586.923-120Z\"/></svg>');\r\n}\r\n[aria-label=\"reversePlaylistButton\"][aria-pressed=\"true\"] yt-icon {\r\n    mask-image: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 -960 960 960\"><path d=\"M320-440v-287L217-624l-57-56 200-200 200 200-57 56-103-103v287h-80ZM600-80 400-280l57-56 103 103v-287h80v287l103-103 57 56L600-80Z\"/></svg>');\r\n}\r\n/* end | reverse playlist */\r\n\r\n/* ini | full titles */\r\nhtml.iridium-full-titles #video-title.ytd-video-renderer,\r\nhtml.iridium-full-titles #video-title.ytd-compact-video-renderer,\r\nhtml.iridium-full-titles #video-title.ytd-reel-item-renderer,\r\nhtml.iridium-full-titles #video-title.ytd-rich-grid-media {\r\n    max-height: unset;\r\n    -webkit-line-clamp: unset;\r\n}\r\n/* end | full titles */\r\n\r\n/* ini | super theater */\r\nhtml[super-theater] #masthead-container.ytd-app:has( > [theater][is-watch-page]) #masthead {\r\n    transform: translateY(-100%);\r\n    transition: transform .5s ease-out !important;\r\n}\r\nhtml[super-theater] #masthead-container.ytd-app:has( > [theater][is-watch-page]):hover #masthead {\r\n    transform: translateY(0);\r\n}\r\nhtml[super-theater] ytd-watch-flexy[full-bleed-player]:not([hidden]) #full-bleed-container.ytd-watch-flexy,\r\nhtml[super-theater] ytd-watch-grid[full-bleed-player]:not([hidden]) #player-full-bleed-container.ytd-watch-grid {\r\n    max-height: calc(100vh);\r\n    height: calc(100vh);\r\n    min-height: unset;\r\n}\r\nhtml[super-theater] #page-manager.ytd-app:has( > [theater]:not([hidden])) {\r\n    margin-top: 0;\r\n}\r\nhtml[super-theater] #page-manager.ytd-app:has( > [theater]:not([hidden])) ytd-live-chat-frame {\r\n    top: 0 !important;\r\n}\r\nhtml[super-theater] #player-full-bleed-container {\r\n    display: flex;\r\n    flex-direction: row;\r\n}\r\nhtml[super-theater] #player-full-bleed-container #player-container {\r\n    position: relative;\r\n    flex: 1;\r\n}\r\nhtml[super-theater]:not([super-theater]) #masthead-container.ytd-app,\r\nhtml[super-theater][super-theater] #masthead-container.ytd-app:not(:has( > [is-watch-page])) {\r\n    width: 100% !important;\r\n}\r\nhtml[super-theater] #page-manager.ytd-app:has( > [theater]:not([hidden])) #chat-container {\r\n    position: relative;\r\n}\r\nhtml[super-theater] #page-manager.ytd-app:has( > [theater]:not([hidden])) ytd-live-chat-frame {\r\n    height: 100% !important;\r\n    min-height: unset !important;\r\n    top: unset !important;\r\n}\r\n/* end | super theater */\r\n\r\n/* ini | super theater scrollbar */\r\nhtml[super-theater][super-theater-scrollbar]:has( ytd-watch-flexy[theater]:not([hidden])) {\r\n    scrollbar-width: none;\r\n}\r\n/* end | super theater scrollbar */\r\n\r\n/* ini | hide end screen cards */\r\n.iridium-hide-end-screen-cards #movie_player:hover .ytp-ce-element:not(:hover) {\r\n    opacity: 0;\r\n}\r\n/* end | hide end screen cards */\r\n\r\n/* ini | scroll volume */\r\n#iridium-scroll-volume-level-container {\r\n    text-align: center;\r\n    position: absolute;\r\n    left: 0;\r\n    right: 0;\r\n    top: 10%;\r\n    z-index: 19;\r\n}\r\n#iridium-scroll-volume-level {\r\n    display: inline-block;\r\n    padding: 10px 20px;\r\n    font-size: 175%;\r\n    background: rgba(0, 0, 0, .5);\r\n    pointer-events: none;\r\n    border-radius: 3px;\r\n}\r\n/* end | scroll volume */\r\n\r\n/* ini | player tools */\r\n#iridium-player-tools {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    font-size: 0;\r\n    position: absolute;\r\n    top: 0;\r\n    right: 0;\r\n    bottom: 0;\r\n}\r\n#bottom-grid #iridium-player-tools {\r\n    position: unset;\r\n    margin-left: auto;\r\n}\r\n#iridium-player-tools > div {\r\n    cursor: pointer;\r\n    width: 36px;\r\n    height: 36px;\r\n    justify-content: center;\r\n    display: flex;\r\n    align-items: center;\r\n    fill: var(--yt-spec-text-primary);\r\n    position: relative;\r\n}\r\n#iridium-player-tools > div:hover {\r\n    background-color: var(--yt-spec-10-percent-layer);\r\n    border-radius: 18px;\r\n}\r\n#iridium-player-tools > div > svg {\r\n    pointer-events: none;\r\n    user-select: none;\r\n}\r\n#iridium-autoplay-shortcut:not([iridium-enabled]) {\r\n    opacity: 0.5;\r\n}\r\n#iridium-video-focus:not([iridium-enabled]) #iridium-on,\r\n#iridium-video-focus[iridium-enabled] #iridium-off {\r\n    display: none;\r\n}\r\n#iridium-monetization:not(.monetized) .iridium-on,\r\n#iridium-monetization.monetized .iridium-off {\r\n    display: none;\r\n}\r\nhtml[dark] #iridium-player-tools .monetized {\r\n    fill: #3fd20a;\r\n}\r\n#iridium-player-tools .monetized {\r\n    fill: #3ad406;\r\n}\r\nhtml[dark] #iridium-player-tools .sponsored {\r\n    fill: #3e8bff;\r\n}\r\n#iridium-player-tools .sponsored {\r\n    fill: #0677d4;\r\n}\r\n#iridium-monetization-count {\r\n    font-size: 10px;\r\n    position: absolute;\r\n    color: var(--yt-spec-text-primary);\r\n    bottom: 0;\r\n    right: 0;\r\n    background: var(--yt-spec-base-background);\r\n    border-radius: 12px;\r\n    padding: 0 3px;\r\n}\r\n#iridium-monetization-count {\r\n    font-size: 10px;\r\n    position: absolute;\r\n    color: var(--yt-spec-text-primary);\r\n    bottom: 0;\r\n    right: 0;\r\n    background: var(--yt-spec-base-background);\r\n    border-radius: 12px;\r\n    padding: 0 3px;\r\n}\r\n#iridium-player-tools > div:hover #iridium-monetization-count {\r\n    display: none;\r\n}\r\n/* end | player tools */\r\n\r\n/* ini | always visible */\r\nhtml[always-visible-player] .ytp-miniplayer-button,\r\nhtml[always-visible-player] .ytp-size-button {\r\n    display: none !important;\r\n}\r\nhtml[always-visible-player]:not(:has(ytd-watch-flexy[fullscreen])) #movie_player {\r\n    position: fixed;\r\n    z-index: 9999;\r\n    height: 225px;\r\n    width: 400px;\r\n    bottom: 10px;\r\n    right: 10px;\r\n    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, .14), 0 1px 10px 0 rgba(0, 0, 0, .12), 0 2px 4px -1px rgba(0, 0, 0, .4);\r\n}\r\nhtml[always-visible-player] #movie_player::before {\r\n    background-color: #000;\r\n    bottom: 0;\r\n    content: \"\";\r\n    display: block;\r\n    left: 0;\r\n    position: absolute;\r\n    right: 0;\r\n    top: 0;\r\n}\r\nhtml[always-visible-player][moving] #movie_player {\r\n    opacity: 0.9;\r\n}\r\nhtml[always-visible-player][moving] #movie_player::after {\r\n    background-color: #fff;\r\n    bottom: 0;\r\n    content: \"\";\r\n    display: block;\r\n    left: 0;\r\n    opacity: .4;\r\n    position: absolute;\r\n    right: 0;\r\n    top: 0;\r\n    z-index: 99;\r\n}\r\nhtml[dark][always-visible-player][moving] #movie_player::after {\r\n    background-color: #000;\r\n}\r\n/* end | always visible */\r\n\r\n/* ini | ambient mode disabled */\r\nhtml[ambient-mode-disabled] #cinematics-container {\r\n    display: none;\r\n}\r\n/* end | ambient mode disabled */"};
	
	const LOCALE_KEYS = {"locale_id":{"message":"English (US)"},"page_title":{"message":"Iridium"}};
	const USED_LOCALE = "en_US";
	const CURRENT_LOCATION = window.location.href;
	
	const convertMatchPatternToRegExp = function convertMatchPatternToRegExp(pattern) {
	    if (pattern === "<all_urls>")
	      return new RegExp(".*");
	    try {
	      const singleEscapedPattern = convertMatchPatternToRegExpString(pattern).replace(/\\\\/g, "\\");
	      return new RegExp(singleEscapedPattern);
	    } catch (error) {
	      debug("Error converting match pattern to RegExp: %s, Error: %s", pattern, error.message);
	      return new RegExp("$.");
	    }
	  };
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
	const ALL_PERMISSIONS = [
	    ...(INJECTED_MANIFEST.permissions || []),
	    ...(INJECTED_MANIFEST.optional_permissions || []),
	    ...(INJECTED_MANIFEST.host_permissions || []),
	    ...(INJECTED_MANIFEST.content_scripts?.map(cs => cs.matches || [])?.flat() || []),
	  ];
	
	const isOrigin = (perm) => {
	    if (perm.startsWith("*://") || perm.startsWith("http://") || perm.startsWith("https://")) {
	        return true;
	    }
	    return false;
	};
	const ORIGIN_PERMISSIONS = ALL_PERMISSIONS.filter(isOrigin);
	const EXTENSION_PERMISSIONS = ALL_PERMISSIONS.filter(perm => !isOrigin(perm));
	
	function _testBlobCSP() {
	  try {
	    const code = `console.log("Blob CSP test");`;
	    const blob = new Blob([code], { type: 'application/javascript' });
	    const blobUrl = URL.createObjectURL(blob);
	
	    const script = document.createElement('script');
	    script.src = blobUrl;
	
	    let blocked = false;
	    script.onerror = () => {
	      blocked = true;
	    };
	
	    document.head.appendChild(script);
	
	    return new Promise((resolve) => {
	      setTimeout(() => {
	        resolve(!blocked);
	        document.head.removeChild(script);
	        URL.revokeObjectURL(blobUrl);
	      }, 100);
	    });
	  } catch (e) {
	    return Promise.resolve(false);
	  }
	}
	
	let CAN_USE_BLOB_CSP = false;
	
	const waitForDOMEnd = () => {
	    if (document.readyState === 'loading') {
	      return new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
	    }
	    return Promise.resolve();
	};
	
	waitForDOMEnd().then(() => {
	  _testBlobCSP().then((result) => {
	    CAN_USE_BLOB_CSP = result;
	  });
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
	    _warn('[runtime.getURL] Asset not found for', path);
	    return path;
	  }
	
	  const mime = _getMimeTypeFromPath(path);
	  const ext = (path.split('.').pop() || '').toLowerCase();
	
	  if (CAN_USE_BLOB_CSP) {
	    let blob;
	    if (_isTextAsset(ext)) {
	      blob = new Blob([assetData], { type: mime });
	    } else {
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
	
	function _matchGlobPattern(pattern, path) {
	  if (!pattern || !path) return false;
	
	  pattern = pattern.replace(/\\/g, '/');
	  path = path.replace(/\\/g, '/');
	
	  if (pattern === path) return true;
	
	  let regexPattern = pattern
	    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')  // Escape regex chars
	    .replace(/\*\*/g, '__DOUBLESTAR__')      // Temporarily replace **
	    .replace(/\*/g, '[^/]*')                 // * matches any chars except /
	    .replace(/__DOUBLESTAR__/g, '.*');       // ** matches any chars including /
	
	  regexPattern = '^' + regexPattern + '$';
	
	  try {
	    const regex = new RegExp(regexPattern);
	    return regex.test(path);
	  } catch (e) {
	    _error(`Invalid glob pattern: ${pattern}`, e);
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
	
	window._matchGlobPattern = _matchGlobPattern;
	window._isWebAccessibleResource = _isWebAccessibleResource;
	
	// This function contains all the CSS injection and JS execution,
	// ordered by run_at timing internally using await.
	
  // #region Script Execution Logic
		async function executeAllScripts(globalThis, extensionCssData) {
		  const {chrome, browser, global, window, self} = globalThis;
		  const scriptName = "Iridium for YouTube";
		  _log(`Starting execution phases...`);
		
  // #region Document Start
			  if (typeof document !== 'undefined') {
			    _log(`Executing document-start phase...`);
			    
			        const cssKey_0 = "css/content-script.css";
			    try {
			      if (extensionCssData[cssKey_0]) {
			        _log(`  Injecting CSS (start): ${cssKey_0}`);
			        const style = document.createElement('style');
			        style.textContent = extensionCssData[cssKey_0];
			        (document.head || document.documentElement).appendChild(style);
			      } else { console.warn(`  CSS not found (start): ${cssKey_0}`); }
			    } catch(e) { _error(`  Failed injecting CSS (${cssKey_0}) in phase start`, e, extensionCssData); }
			  
			    const scriptPaths = ["js/setting-data.js","js/background-inject.js","js/content-script.js"];
			   _log(`  Executing JS (start): ${scriptPaths}`);
			
			   try {
			       // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
			      with (globalThis){;
			// START: js/setting-data.js
			const SettingData = {
			    extensionButton: {
			        id: "extensionButton",
			        default: true,
			    },
			    syncSettings: {
			        id: "syncSettings",
			        default: false,
			    },
			    fullTitles: {
			        id: "fullTitles",
			        default: true,
			    },
			    theme: {
			        id: "theme",
			        default: "deviceTheme",
			    },
			    logoSubscriptions: {
			        id: "logoSubscriptions",
			        default: false,
			    },
			    autoplayChannelTrailer: {
			        id: "autoplayChannelTrailer",
			        default: false,
			    },
			    channelTab: {
			        id: "channelTab",
			        default: "featured",
			    },
			    homeShorts: {
			        id: "homeShorts",
			        default: true,
			    },
			    subscriptionsShorts: {
			        id: "subscriptionsShorts",
			        default: true,
			    },
			    videoPageShorts: {
			        id: "videoPageShorts",
			        default: true,
			    },
			    searchShorts: {
			        id: "searchShorts",
			        default: true,
			    },
			    adOptOutAll: {
			        id: "adOptOutAll",
			        default: false,
			    },
			    adSubscribed: {
			        id: "adSubscribed",
			        default: false,
			    },
			    adVideoFeed: {
			        id: "adVideoFeed",
			        default: false,
			    },
			    adInVideo: {
			        id: "adInVideo",
			        default: false,
			    },
			    adTaggedProducts: {
			        id: "adTaggedProducts",
			        default: false,
			    },
			    adMasthead: {
			        id: "adMasthead",
			        default: false,
			    },
			    adHomeFeed: {
			        id: "adHomeFeed",
			        default: false,
			    },
			    adSearchFeed: {
			        id: "adSearchFeed",
			        default: false,
			    },
			    videoFocus: {
			        id: "videoFocus",
			        default: true,
			    },
			    creatorMerch: {
			        id: "creatorMerch",
			        default: true,
			    },
			    videoCount: {
			        id: "videoCount",
			        default: true,
			    },
			    ambientMode: {
			        id: "ambientMode",
			        default: true,
			    },
			    reversePlaylist: {
			        id: "reversePlaylist",
			        default: true,
			    },
			    reversePlaylistToggled: {
			        id: "reversePlaylistToggled",
			        default: false,
			    },
			    superTheater: {
			        id: "superTheater",
			        default: true,
			    },
			    superTheaterScrollbar: {
			        id: "superTheaterScrollbar",
			        default: true,
			    },
			    defaultQuality: {
			        id: "defaultQuality",
			        default: "auto",
			    },
			    defaultSpeed: {
			        id: "defaultSpeed",
			        default: "-1",
			    },
			    alwaysVisible: {
			        id: "alwaysVisible",
			        default: true,
			    },
			    alwaysVisiblePosition: {
			        id: "alwaysVisiblePosition",
			        default: {},
			    },
			    hfrAllowed: {
			        id: "hfrAllowed",
			        default: true,
			    },
			    autoplay: {
			        id: "autoplay",
			        default: false,
			    },
			    loudness: {
			        id: "loudness",
			        default: false,
			    },
			    scrollVolume: {
			        id: "scrollVolume",
			        default: true,
			    },
			    scrollVolumeShift: {
			        id: "scrollVolumeShift",
			        default: true,
			    },
			    scrollVolumeStep: {
			        id: "scrollVolumeStep",
			        default: 5,
			    },
			    infoCards: {
			        id: "infoCards",
			        default: false,
			    },
			    annotations: {
			        id: "annotations",
			        default: true,
			    },
			    endScreen: {
			        id: "endScreen",
			        default: false,
			    },
			    autoplayShortcut: {
			        id: "autoplayShortcut",
			        default: true,
			    },
			    videoFocusToggle: {
			        id: "videoFocusToggle",
			        default: true,
			    },
			    videoScreenshot: {
			        id: "videoScreenshot",
			        default: true,
			    },
			    videoThumbnail: {
			        id: "videoThumbnail",
			        default: true,
			    },
			    monetizationInfo: {
			        id: "monetizationInfo",
			        default: true,
			    },
			    blacklistEnabled: {
			        id: "blacklistEnabled",
			        default: true,
			    },
			    blacklistButton: {
			        id: "blacklistButton",
			        default: true,
			    },
			    blacklist: {
			        id: "blacklist",
			        default: {},
			    },
			};
			const getDefaultSettings = () => Object.keys(SettingData).reduce((previousValue, currentValue) => ({
			    ...previousValue,
			    [currentValue]: SettingData[currentValue].default
			}), {});
			// END: js/setting-data.js
			
			// START: js/background-inject.js
			function mainScript(extensionId, SettingData, defaultSettings) {
			  const iridiumSettings = defaultSettings;
			
			  // ini listeners
			
			  const OnPageDataChanged = (() => {
			    const listeners = [];
			    const onEvent = (event) =>
			      listeners.forEach((listener) => listener?.(event));
			
			    window.addEventListener("yt-page-data-updated", onEvent, true);
			    window.addEventListener("yt-navigate-start", onEvent, false);
			    window.addEventListener("yt-navigate-finish", onEvent, false);
			    window.addEventListener("yt-next-continuation-data-updated", onEvent, true);
			    window.addEventListener("popstate", onEvent, true);
			
			    return {
			      addListener: (listener) => listeners.push(listener),
			    };
			  })();
			
			  const OnYtPageDataFetched = (() => {
			    const listeners = [];
			    const onEvent = (data) => {
			      const response = data?.["detail"]?.["pageData"]?.["response"];
			
			      if (response) {
			        listeners.forEach((listener) => listener?.(response));
			      }
			    };
			
			    window.addEventListener("yt-page-data-fetched", onEvent, true);
			
			    return {
			      addListener: (listener) => listeners.push(listener),
			    };
			  })();
			
			  // end listeners
			
			  // ini utils
			
			  const j2d = (() => {
			    const processNode = (element, attributes, children) => {
			      if (
			        Array.isArray(attributes) ||
			        typeof attributes === "string" ||
			        attributes instanceof String
			      ) {
			        children = attributes;
			        attributes = {};
			      }
			
			      for (let name in attributes) {
			        element.setAttribute(name, attributes[name]);
			      }
			
			      if (children) {
			        if (Array.isArray(children)) {
			          for (let child of children) {
			            if (child.constructor === String) {
			              const textNode = document.createTextNode(child);
			              element.appendChild(textNode);
			            } else {
			              element.appendChild(child);
			            }
			          }
			        } else if (children.constructor === String) {
			          element.textContent = children;
			        }
			      }
			
			      return element;
			    };
			
			    return {
			      make: (node, attributes, children) =>
			        processNode(document.createElement(node), attributes, children),
			      makeSVG: (node, attributes, children) =>
			        processNode(
			          document.createElementNS("http://www.w3.org/2000/svg", node),
			          attributes,
			          children,
			        ),
			    };
			  })();
			
			  const Util = {
			    getSingleObjectByKey: (obj, keys, match) => {
			      if (!obj) {
			        return null;
			      }
			
			      for (let property in obj) {
			        if (
			          !obj.hasOwnProperty(property) ||
			          obj[property] === null ||
			          obj[property] === undefined
			        ) {
			          continue;
			        }
			
			        if (
			          (keys.constructor.name === "String"
			            ? keys === property
			            : keys.indexOf(property) > -1) &&
			          (!match ||
			            (obj[property].constructor.name !== "Object" &&
			              match(obj[property], obj)))
			        ) {
			          return obj[property];
			        }
			
			        if (obj[property].constructor.name === "Object") {
			          let result = Util.getSingleObjectByKey(obj[property], keys, match);
			          if (result) {
			            return result;
			          }
			        } else if (obj[property].constructor.name === "Array") {
			          for (let i = 0; i < obj[property].length; i++) {
			            let result = Util.getSingleObjectByKey(
			              obj[property][i],
			              keys,
			              match,
			            );
			            if (result) {
			              return result;
			            }
			          }
			        }
			      }
			    },
			    getSingleObjectAndParentByKey: (obj, keys, match) => {
			      for (let property in obj) {
			        if (
			          !obj.hasOwnProperty(property) ||
			          obj[property] === null ||
			          obj[property] === undefined
			        ) {
			          continue;
			        }
			
			        if (
			          (keys.constructor.name === "String"
			            ? keys === property
			            : keys.indexOf(property) > -1) &&
			          (!match || match(obj[property], obj))
			        ) {
			          return {
			            parent: obj,
			            object: obj[property],
			          };
			        }
			
			        if (obj[property].constructor.name === "Object") {
			          let result = Util.getSingleObjectAndParentByKey(
			            obj[property],
			            keys,
			            match,
			          );
			          if (result) {
			            return result;
			          }
			        } else if (obj[property].constructor.name === "Array") {
			          for (let i = 0; i < obj[property].length; i++) {
			            let result = Util.getSingleObjectAndParentByKey(
			              obj[property][i],
			              keys,
			              match,
			            );
			            if (result) {
			              return result;
			            }
			          }
			        }
			      }
			    },
			    isWatchPage: () =>
			      window.location.pathname === "/watch" ||
			      window.location.pathname.startsWith("/clip"),
			  };
			
			  const FeatureUpdater = (() => {
			    const features = {};
			    const register = (id, feature) => (features[id] ??= []).push(feature);
			    const updateAll = () =>
			      Object.keys(features).forEach((id) =>
			        features[id]?.forEach((feature) => feature?.()),
			      );
			    const update = (id) => features[id]?.forEach((feature) => feature?.());
			
			    OnPageDataChanged.addListener(updateAll);
			
			    return {
			      update: update,
			      register: register,
			    };
			  })();
			
			  const Broadcaster = (() => {
			    const channel = new BroadcastChannel(extensionId);
			    const onMessageListener = (event) => {
			      if (event?.data) {
			        // first update setting(s)
			        for (let key in event.data) {
			          iridiumSettings[key] = event.data?.[key];
			        }
			
			        // then update feature(s)
			        for (let key in event.data) {
			          FeatureUpdater.update(key);
			        }
			      }
			    };
			
			    channel.addEventListener("message", onMessageListener);
			
			    return {
			      postMessage: (message) => channel.postMessage(message),
			      doAction: (action) =>
			        channel.postMessage({
			          type: "action",
			          payload: action,
			        }),
			      saveSetting: (settingId) =>
			        channel.postMessage({
			          type: "setting",
			          payload: { [settingId]: iridiumSettings[settingId] },
			        }),
			    };
			  })();
			
			  // end utils
			
			  // ini overrides
			
			  const OverrideHandleResponse = (() => {
			    const listeners = [];
			    const handleResponseKey = crypto.randomUUID();
			
			    Object.defineProperty(Object.prototype, "handleResponse", {
			      set(data) {
			        this[handleResponseKey] = data;
			      },
			      get() {
			        const original = this[handleResponseKey];
			        return function (url, code, response, callback) {
			          if (
			            response?.constructor === String &&
			            original?.toString()?.indexOf('")]}\'"') !== -1
			          ) {
			            try {
			              const parsed = JSON.parse(response);
			              listeners?.forEach((listener) => listener?.(parsed));
			              arguments[2] = JSON.stringify(parsed);
			            } catch (e) {}
			          }
			          return original?.apply(this, arguments);
			        };
			      },
			    });
			
			    return {
			      onHandleResponseListener: (listener) => listeners.push(listener),
			    };
			  })();
			
			  const OverrideFetch = (() => {
			    const listeners = [];
			
			    const canProceed = (data) => {
			      const endpoints = data?.["onResponseReceivedEndpoints"];
			
			      if (
			        endpoints != null &&
			        endpoints?.constructor === Array &&
			        endpoints.length > 0
			      ) {
			        for (let i = endpoints.length - 1; i >= 0; i--) {
			          if (
			            endpoints[i]?.["reloadContinuationItemsCommand"]?.["targetId"] ===
			            "comments-section"
			          ) {
			            return false;
			          }
			        }
			      }
			
			      return (
			        data?.["contents"] ||
			        data?.["videoDetails"] ||
			        data?.["items"] ||
			        data?.["onResponseReceivedActions"] ||
			        data?.["onResponseReceivedEndpoints"] ||
			        data?.["onResponseReceivedCommands"]
			      );
			    };
			
			    const override = function (target, thisArg, argArray) {
			      if (
			        !argArray?.[0]?.url ||
			        Object.getOwnPropertyDescriptor(argArray[0], "url") !== undefined
			      ) {
			        return target.apply(thisArg, argArray);
			      } else {
			        return target.apply(thisArg, argArray).then((response) => {
			          return response
			            .clone()
			            .text()
			            .then((text) => {
			              const data = JSON.parse(text.replace(")]}'\n", ""));
			              if (canProceed(data)) {
			                listeners?.forEach((listener) => listener?.(data));
			                return new Response(JSON.stringify(data));
			              } else {
			                return response;
			              }
			            })
			            .catch(() => response);
			        });
			      }
			    };
			
			    const original = window.fetch?.["original"] || window.fetch;
			
			    window.fetch = new Proxy(window.fetch, { apply: override });
			    window.fetch.original = original;
			
			    let ytInitialData = undefined;
			
			    Object.defineProperty(window, "ytInitialData", {
			      set(data) {
			        ytInitialData = data;
			        listeners?.forEach((listener) => listener?.(ytInitialData));
			      },
			      get() {
			        return ytInitialData;
			      },
			    });
			
			    let ytInitialPlayerResponse = undefined;
			
			    Object.defineProperty(window, "ytInitialPlayerResponse", {
			      set(data) {
			        ytInitialPlayerResponse = data;
			        listeners?.forEach((listener) => listener?.(ytInitialPlayerResponse));
			      },
			      get() {
			        return ytInitialPlayerResponse;
			      },
			    });
			
			    return {
			      onFetchListener: (listener) => listeners.push(listener),
			    };
			  })();
			
			  const OverrideVideoPlay = (() => {
			    let canPlay = false;
			    let timer = null;
			    let previousVideoId = null;
			    let lastKey = -1;
			
			    const spacebar = 32;
			    const keyK = 75;
			    const moviePlayerContainers = [
			      "#player:has(#movie_player)",
			      "#player-container:has(#movie_player)",
			      "#ytd-player:has(#movie_player)",
			      "#movie_player",
			    ].join(",");
			    const c4PlayerContainers = [
			      "#player:has(#c4-player)",
			      "#player-container:has(#c4-player)",
			      "#ytd-player:has(#c4-player)",
			      "#c4-player",
			    ].join(",");
			
			    const onClick = (event) => {
			      lastKey = -1;
			
			      clearTimeout(timer);
			
			      canPlay =
			        event.target.id !== "player-wrap" &&
			        (document
			          .querySelector(moviePlayerContainers)
			          ?.contains(event.target) === true ||
			          document.querySelector(c4PlayerContainers)?.contains(event.target) ===
			            true);
			
			      if (canPlay) {
			        previousVideoId =
			          document.getElementById("movie_player")?.["getVideoData"]()?.[
			            "video_id"
			          ] || null;
			        timer = setTimeout(() => (canPlay = false), 300);
			      }
			    };
			
			    const isAllowed = (target) => {
			      const currentKey = lastKey;
			
			      lastKey = -1;
			
			      const isMoviePlayer =
			        document.getElementById("movie_player")?.contains(target) === true;
			
			      if (isMoviePlayer) {
			        return (
			          iridiumSettings.autoplay ||
			          canPlay ||
			          previousVideoId ===
			            (document.getElementById("movie_player")?.["getVideoData"]()?.[
			              "video_id"
			            ] || "") ||
			          lastKey === keyK ||
			          lastKey === spacebar
			        );
			      }
			
			      const isC4Player =
			        document.getElementById("c4-player")?.contains(target) === true;
			
			      if (isC4Player) {
			        return (
			          iridiumSettings.autoplayChannelTrailer ||
			          canPlay ||
			          lastKey === keyK ||
			          lastKey === spacebar
			        );
			      }
			
			      return true;
			    };
			
			    const override = () => {
			      const original =
			        HTMLVideoElement.prototype.play?.["original"] ||
			        HTMLVideoElement.prototype.play;
			
			      HTMLVideoElement.prototype.play = function () {
			        const moviePlayer = document.getElementById("movie_player");
			        const isMoviePlayer = moviePlayer?.contains(this) === true;
			        const currentVideoId =
			          moviePlayer?.["getVideoData"]()?.["video_id"] || "";
			
			        if (isAllowed(this)) {
			          if (isMoviePlayer) {
			            previousVideoId = currentVideoId;
			          } else {
			            previousVideoId = null;
			          }
			
			          return original.apply(this, arguments);
			        } else {
			          previousVideoId = null;
			
			          return new Promise((resolve, reject) =>
			            reject(new DOMException("rejected")),
			          );
			        }
			      };
			
			      HTMLVideoElement.prototype.play.original = original;
			    };
			
			    const reset = () => {
			      HTMLVideoElement.prototype.play =
			        HTMLVideoElement.prototype.play?.["original"] ||
			        HTMLVideoElement.prototype.play;
			      delete HTMLVideoElement.prototype.play?.["original"];
			
			      canPlay = false;
			      timer = null;
			      previousVideoId = null;
			    };
			
			    const onNavigate = () => {
			      clearTimeout(timer);
			      canPlay = false;
			      previousVideoId = null;
			    };
			
			    const onKeyEvent = (event) => {
			      lastKey = event.keyCode;
			    };
			
			    let listenersActive = false;
			
			    const update = () => {
			      if (iridiumSettings.autoplay && iridiumSettings.autoplayChannelTrailer) {
			        listenersActive = false;
			        window.removeEventListener("yt-navigate-start", onNavigate, false);
			        window.removeEventListener("popstate", onNavigate, true);
			        document.removeEventListener("keydown", onKeyEvent, true);
			        document.removeEventListener("keyup", onKeyEvent, true);
			        document.removeEventListener("click", onClick, true);
			        reset();
			      } else if (!listenersActive) {
			        listenersActive = true;
			        window.addEventListener("yt-navigate-start", onNavigate, false);
			        window.addEventListener("popstate", onNavigate, true);
			        document.addEventListener("keydown", onKeyEvent, true);
			        document.addEventListener("keyup", onKeyEvent, true);
			        document.addEventListener("click", onClick, true);
			        override();
			      }
			    };
			
			    update();
			
			    FeatureUpdater.register(SettingData.autoplay.id, update);
			    FeatureUpdater.register(SettingData.autoplayChannelTrailer.id, update);
			
			    return {};
			  })();
			
			  const OverrideOnPlayerReady = (() => {
			    const listeners = [];
			    const onPlayerReadyEventKey = crypto.randomUUID();
			    let recentApi = null;
			
			    Object.defineProperty(Object.prototype, "onPlayerReadyEvent_", {
			      set(data) {
			        this[onPlayerReadyEventKey] = data;
			      },
			      get() {
			        const original = this[onPlayerReadyEventKey];
			
			        if (original.constructor === Boolean) {
			          return original;
			        }
			
			        return function (api) {
			          recentApi = api;
			          listeners?.forEach((listener) => listener?.(api));
			          return original?.apply(this, arguments);
			        };
			      },
			    });
			
			    function addListener(listener) {
			      if (recentApi) {
			        listener(recentApi);
			      }
			
			      listeners.push(listener);
			    }
			
			    return {
			      onReadyListener: (listener) => addListener(listener),
			    };
			  })();
			
			  const OverrideSetInternalSize = (() => {
			    const setInternalSizeKey = crypto.randomUUID();
			
			    Object.defineProperty(Object.prototype, "setInternalSize", {
			      set(data) {
			        this[setInternalSizeKey] = data;
			      },
			      get() {
			        const original = this[setInternalSizeKey];
			        if (original?.toString()?.startsWith("function(a)")) {
			          return function (size) {
			            if (
			              iridiumSettings.alwaysVisible &&
			              Object.hasOwn(size, "width") &&
			              Object.hasOwn(size, "height")
			            ) {
			              arguments[0].width = NaN;
			              arguments[0].height = NaN;
			            }
			            return original?.apply(this, arguments);
			          };
			        } else {
			          return original;
			        }
			      },
			    });
			
			    return {};
			  })();
			
			  // end overrides
			
			  // ini features
			
			  const FeatureFullTitles = (() => {
			    const update = () => {
			      if (iridiumSettings.fullTitles) {
			        document.documentElement.classList.add("iridium-full-titles");
			      } else {
			        document.documentElement.classList.remove("iridium-full-titles");
			      }
			    };
			
			    FeatureUpdater.register(SettingData.fullTitles.id, update);
			
			    return {
			      update: update,
			    };
			  })();
			
			  const FeatureTheme = (() => {
			    const update = () => {
			      switch (iridiumSettings.theme) {
			        case "deviceTheme":
			          document
			            .querySelector("ytd-app")
			            ?.["handleSignalActionToggleDarkThemeDevice"]?.();
			          break;
			        case "darkTheme":
			          document
			            .querySelector("ytd-app")
			            ?.["handleSignalActionToggleDarkThemeOn"]?.();
			          break;
			        case "lightTheme":
			          document
			            .querySelector("ytd-app")
			            ?.["handleSignalActionToggleDarkThemeOff"]?.();
			          break;
			      }
			    };
			
			    FeatureUpdater.register(SettingData.theme.id, update);
			
			    return {
			      update: update,
			    };
			  })();
			
			  const FeatureSettingsButton = (() => {
			    const listener = (data) => {
			      if (!iridiumSettings.extensionButton) {
			        return;
			      }
			
			      const topBarButtons =
			        data?.["topbar"]?.["desktopTopbarRenderer"]?.["topbarButtons"];
			
			      if (!topBarButtons) {
			        return;
			      }
			
			      let alreadySet;
			
			      topBarButtons.forEach(function (value) {
			        if (
			          value.hasOwnProperty("topbarMenuButtonRenderer") &&
			          value.topbarMenuButtonRenderer.icon &&
			          value.topbarMenuButtonRenderer.icon.iconType === "IRIDIUM_LOGO"
			        ) {
			          return (alreadySet = true);
			        }
			      });
			
			      if (alreadySet) {
			        return;
			      }
			
			      topBarButtons.unshift({
			        topbarMenuButtonRenderer: {
			          icon: { iconType: "IRIDIUM_LOGO" },
			          tooltip: "Iridium",
			          style: "IRIDIUM_OPTIONS",
			          isDisabled: false,
			        },
			      });
			    };
			
			    const onDocumentClick = (event) => {
			      if (!iridiumSettings.extensionButton) {
			        return;
			      }
			
			      const optionsButton =
			        document.documentElement.querySelector(".iridium-options");
			      const buttonClicked =
			        optionsButton === event.target || optionsButton?.contains(event.target);
			
			      if (!buttonClicked) {
			        return;
			      }
			
			      if (document.activeElement && document.activeElement.blur) {
			        document.activeElement.blur();
			      }
			
			      Broadcaster.doAction("extensionButton");
			    };
			
			    document.documentElement.addEventListener("click", onDocumentClick, false);
			
			    OnYtPageDataFetched.addListener(listener);
			    OverrideFetch.onFetchListener(listener);
			
			    return {};
			  })();
			
			  const FeatureDefaultTab = (() => {
			    const iniDefaultTab = (event) => {
			      if (iridiumSettings.channelTab === "featured") {
			        return;
			      }
			
			      let link = event.target;
			
			      while (link && link?.tagName !== "A") {
			        link = link.parentNode;
			      }
			
			      if (!link) {
			        return;
			      }
			
			      const browseEndpoint = link?.["data"]?.["browseEndpoint"];
			      const metadata =
			        link?.["data"]?.["commandMetadata"]?.["webCommandMetadata"];
			
			      if (
			        !browseEndpoint ||
			        metadata["webPageType"] !== "WEB_PAGE_TYPE_CHANNEL"
			      ) {
			        return;
			      }
			
			      let param = "";
			
			      switch (iridiumSettings.channelTab) {
			        case "featured":
			          param = "EghmZWF0dXJlZPIGBAoCMgA%3D";
			          break;
			        case "videos":
			          param = "EgZ2aWRlb3PyBgQKAjoA";
			          break;
			        case "shorts":
			          param = "EgZzaG9ydHPyBgUKA5oBAA%3D%3D";
			          break;
			        case "streams":
			          param = "EgdzdHJlYW1z8gYECgJ6AA%3D%3D";
			          break;
			        case "podcasts":
			          param = "Eghwb2RjYXN0c_IGBQoDugEA";
			          break;
			        case "playlists":
			          param = "EglwbGF5bGlzdHPyBgQKAkIA";
			          break;
			        case "community":
			          param = "Egljb21tdW5pdHnyBgQKAkoA";
			          break;
			        case "channels":
			          param = "EghjaGFubmVscw%3D%3D";
			          break;
			        case "store":
			          param = "EgVzdG9yZfIGBAoCGgA%3D";
			          break;
			      }
			
			      if (param !== "") {
			        browseEndpoint.params = param;
			      }
			
			      const url =
			        browseEndpoint["canonicalBaseUrl"] ||
			        (browseEndpoint["browseId"]
			          ? `/channel/${browseEndpoint["browseId"]}`
			          : undefined);
			
			      if (url) {
			        metadata.url = link.href = `${url}/${iridiumSettings.channelTab}`;
			      }
			    };
			
			    const update = () => {
			      if (iridiumSettings.channelTab) {
			        window.addEventListener("mouseup", iniDefaultTab, true);
			      } else {
			        window.removeEventListener("mouseup", iniDefaultTab, true);
			      }
			    };
			
			    FeatureUpdater.register(SettingData.channelTab.id, update);
			
			    return {
			      update: update,
			    };
			  })();
			
			  const FeatureLogoSubscriptions = (() => {
			    const iniLogoShortcut = (event) => {
			      let link = event.target;
			
			      while (link && (link?.tagName !== "A" || link?.id !== "logo")) {
			        link = link.parentNode;
			      }
			
			      if (!link) {
			        return;
			      }
			
			      const browseEndpoint = link?.["data"]?.["browseEndpoint"];
			      const metadata =
			        link?.["data"]?.["commandMetadata"]?.["webCommandMetadata"];
			
			      if (browseEndpoint && metadata) {
			        browseEndpoint.browseId = "FEsubscriptions";
			        metadata.url = "/feed/subscriptions";
			      }
			    };
			
			    const update = () => {
			      if (iridiumSettings.logoSubscriptions) {
			        window.addEventListener("mouseup", iniLogoShortcut, true);
			      } else {
			        window.removeEventListener("mouseup", iniLogoShortcut, true);
			      }
			    };
			
			    FeatureUpdater.register(SettingData.logoSubscriptions.id, update);
			
			    return {
			      update: update,
			    };
			  })();
			
			  const FeaturePlaylistReverse = (() => {
			    const buttonId = "reversePlaylistButton";
			
			    const reversePlaylist = (data) => {
			      if (!data) {
			        return;
			      }
			
			      const watchNextResults =
			        data?.["contents"]?.["twoColumnWatchNextResults"];
			      const playlist = watchNextResults?.["playlist"]?.["playlist"];
			
			      if (
			        !!playlist?.["isReversed"] === iridiumSettings.reversePlaylistToggled
			      ) {
			        return;
			      }
			
			      if (playlist) {
			        playlist["isReversed"] = iridiumSettings.reversePlaylistToggled;
			      }
			
			      const topLevelButtons =
			        playlist?.["playlistButtons"]?.["menuRenderer"]?.["topLevelButtons"];
			
			      if (topLevelButtons?.constructor === Array) {
			        const length = topLevelButtons.length;
			
			        for (let i = 0; i < length; i++) {
			          const button = topLevelButtons[i]?.["toggleButtonRenderer"];
			
			          if (button?.id === "reversePlaylist") {
			            button.isToggled = iridiumSettings.reversePlaylistToggled;
			            break;
			          }
			        }
			      }
			
			      const autoplay = watchNextResults?.["autoplay"]?.["autoplay"];
			      const autoplaySets = autoplay?.["sets"];
			
			      if (autoplaySets?.constructor === Array) {
			        for (let i = 0; i < autoplaySets.length; i++) {
			          const item = autoplaySets[i];
			
			          if (!item) {
			            continue;
			          }
			
			          if (item["previousButtonVideo"] && item["nextButtonVideo"]) {
			            item["autoplayVideo"] = item["previousButtonVideo"];
			            item["previousButtonVideo"] = item["nextButtonVideo"];
			            item["nextButtonVideo"] = item["autoplayVideo"];
			          }
			        }
			      }
			
			      const contents = playlist?.["contents"];
			
			      if (contents?.constructor === Array) {
			        contents.reverse();
			
			        const count = contents.length;
			
			        for (let i = 0; i < count; i++) {
			          const item = contents[i];
			
			          if (
			            item?.["playlistPanelVideoRenderer"]?.["indexText"]?.["simpleText"]
			          ) {
			            item["playlistPanelVideoRenderer"]["indexText"]["simpleText"] =
			              `${i + 1}`;
			          }
			        }
			
			        if (playlist?.["currentIndex"]?.constructor === Number) {
			          playlist["currentIndex"] =
			            contents.length - playlist["currentIndex"] - 1;
			        }
			
			        if (playlist?.["localCurrentIndex"]?.constructor === Number) {
			          playlist["localCurrentIndex"] =
			            contents.length - playlist["localCurrentIndex"] - 1;
			        }
			      }
			    };
			
			    const listener = (data) => {
			      const topLevelButtons =
			        data?.["contents"]?.["twoColumnWatchNextResults"]?.["playlist"]?.[
			          "playlist"
			        ]?.["playlistButtons"]?.["menuRenderer"]?.["topLevelButtons"];
			
			      if (topLevelButtons?.constructor !== Array) {
			        return;
			      }
			
			      const length = topLevelButtons.length;
			
			      for (let i = 0; i < length; i++) {
			        if (
			          topLevelButtons[i]?.["toggleButtonRenderer"]?.id === "reversePlaylist"
			        ) {
			          if (iridiumSettings.reversePlaylist !== true) {
			            topLevelButtons.splice(i, 1);
			          }
			
			          break;
			        }
			
			        if (i === length - 1 && iridiumSettings.reversePlaylist === true) {
			          topLevelButtons.push({
			            toggleButtonRenderer: {
			              id: "reversePlaylist",
			              style: { styleType: "STYLE_GREY_TEXT" },
			              size: { sizeType: "SIZE_DEFAULT" },
			              isToggled: iridiumSettings.reversePlaylistToggled,
			              isDisabled: false,
			              defaultIcon: { iconType: "IRIDIUM_PLAYLIST_SHUFFLE" },
			              accessibility: { label: "reversePlaylistButton" },
			              defaultTooltip: "Reverse playlist",
			              toggledTooltip: "Reverse playlist",
			              toggledStyle: { styleType: "STYLE_DEFAULT_ACTIVE" },
			            },
			          });
			        }
			      }
			
			      reversePlaylist(data);
			    };
			
			    const updateUI = (data) => {
			      if (!data) {
			        return;
			      }
			
			      const ytPlaylistManager = document.querySelector("yt-playlist-manager");
			
			      if (!ytPlaylistManager) {
			        return;
			      }
			
			      const watchNextResults =
			        data?.["contents"]?.["twoColumnWatchNextResults"];
			      const autoplay = watchNextResults?.["autoplay"]?.["autoplay"];
			      const playlist = structuredClone(
			        watchNextResults?.["playlist"]?.["playlist"],
			      );
			
			      ytPlaylistManager?.["setAutoplayRenderer"]?.(autoplay);
			      ytPlaylistManager?.["setPlaylistData"]?.(playlist);
			      ytPlaylistManager?.["setPlayerPlaybackControlData"]?.({
			        playlistPanelRenderer: playlist,
			      });
			    };
			
			    const onDocumentClick = (event) => {
			      const ytdWatchData = document.querySelector("ytd-watch-flexy")?.["data"];
			      const reverseButton = document.querySelector(
			        `ytd-toggle-button-renderer:has([aria-label='${buttonId}'])`,
			      );
			      const isReverseButton = reverseButton?.contains(event.target);
			
			      if (isReverseButton && ytdWatchData) {
			        iridiumSettings.reversePlaylistToggled =
			          !iridiumSettings.reversePlaylistToggled;
			        Broadcaster.saveSetting(SettingData.reversePlaylistToggled.id);
			
			        reversePlaylist(ytdWatchData);
			        updateUI(ytdWatchData);
			
			        document
			          .querySelector("ytd-playlist-panel-video-renderer[selected]")
			          ?.scrollIntoView({ block: "nearest" });
			      }
			    };
			
			    const update = () => {
			      const ytdWatchData = document.querySelector("ytd-watch-flexy")?.["data"];
			
			      if (iridiumSettings.reversePlaylist) {
			        document.documentElement.addEventListener(
			          "click",
			          onDocumentClick,
			          false,
			        );
			
			        if (ytdWatchData) {
			          listener(ytdWatchData);
			          updateUI(ytdWatchData);
			        }
			      } else {
			        iridiumSettings.reversePlaylistToggled = false;
			        Broadcaster.saveSetting(SettingData.reversePlaylistToggled.id);
			
			        if (ytdWatchData) {
			          listener(ytdWatchData);
			          updateUI(ytdWatchData);
			          document
			            .querySelector("ytd-playlist-panel-video-renderer[selected]")
			            ?.scrollIntoView({ block: "nearest" });
			        }
			
			        document.documentElement.removeEventListener(
			          "click",
			          onDocumentClick,
			          false,
			        );
			      }
			    };
			
			    FeatureUpdater.register(SettingData.reversePlaylist.id, update);
			
			    OnYtPageDataFetched.addListener(listener);
			    OverrideFetch.onFetchListener(listener);
			    OverrideHandleResponse.onHandleResponseListener(listener);
			
			    return {};
			  })();
			
			  const FeatureSuperTheater = (() => {
			    const onResize = () => {
			      const ytdApp = document.querySelector("ytd-app");
			
			      if (
			        iridiumSettings.superTheater &&
			        ytdApp?.["fullscreen"] !== true &&
			        ytdApp?.["isWatchPage"] === true &&
			        ytdApp?.["isTheaterMode"]?.() === true &&
			        document.getElementById("chat")?.["isHiddenByUser"] !== true
			      ) {
			        const chat = document.getElementById("chat-container");
			
			        if (chat && !chat.firstElementChild.hasAttribute("collapsed")) {
			          const videoContainer = document.getElementById(
			            "player-full-bleed-container",
			          );
			
			          if (videoContainer && !videoContainer.contains(chat)) {
			            videoContainer.appendChild(chat);
			          }
			        }
			
			        const masthead = document.getElementById("masthead-container");
			        const moviePlayerParent =
			          document.getElementById("movie_player")?.parentElement;
			
			        if (masthead && moviePlayerParent?.offsetWidth > 0) {
			          const width = `${moviePlayerParent.offsetWidth}px`;
			
			          if (masthead.style.width !== width) {
			            masthead.style.width = width;
			          }
			        }
			      } else {
			        const masthead = document.getElementById("masthead-container");
			        const moviePlayerParent =
			          document.getElementById("movie_player")?.parentElement;
			
			        if (masthead) {
			          masthead.style.width = "";
			        }
			
			        const chat = document.getElementById("chat-container");
			
			        if (chat && document.getElementById("full-bleed-container")) {
			          const sidebar = document.getElementById("secondary-inner");
			
			          if (sidebar && !sidebar.contains(chat)) {
			            const donationShelf = document.getElementById("donation-shelf");
			
			            if (donationShelf && sidebar === donationShelf.parentElement) {
			              sidebar.insertBefore(chat, donationShelf);
			            } else {
			              sidebar.prepend(chat);
			            }
			          }
			        }
			      }
			    };
			
			    const onYTAction = (event) => {
			      if (
			        iridiumSettings.superTheater &&
			        event?.detail?.["actionName"] === "yt-set-live-chat-collapsed"
			      ) {
			        window.dispatchEvent(new CustomEvent("resize"));
			      }
			    };
			
			    const created = (api) => {
			      api.addEventListener("resize", onResize, false);
			      document.documentElement.addEventListener("yt-action", onYTAction, false);
			    };
			
			    const update = () => {
			      if (iridiumSettings.superTheater) {
			        document.documentElement.setAttribute("super-theater", "");
			      } else {
			        document.documentElement.removeAttribute("super-theater");
			      }
			
			      window.dispatchEvent(new CustomEvent("resize"));
			    };
			
			    FeatureUpdater.register(SettingData.superTheater.id, update);
			
			    OverrideOnPlayerReady.onReadyListener(created);
			
			    return {};
			  })();
			
			  const FeatureSuperTheaterScrollbar = (() => {
			    const update = () => {
			      if (iridiumSettings.superTheaterScrollbar) {
			        document.documentElement.removeAttribute("super-theater-scrollbar");
			      } else {
			        document.documentElement.setAttribute("super-theater-scrollbar", "");
			      }
			    };
			
			    FeatureUpdater.register(SettingData.superTheaterScrollbar.id, update);
			
			    return {};
			  })();
			
			  const FeatureAlwaysVisible = (() => {
			    let moviePlayer = null;
			    let maxX = null;
			    let maxY = null;
			    let pos = { x1: 0, x2: 0, y1: 0, y2: 0 };
			
			    const offset = 10;
			
			    const isPlayer = (target) =>
			      target.id === "movie_player" ||
			      document.getElementById("movie_player")?.contains(target);
			
			    const isAlwaysVisible = () =>
			      document.documentElement.hasAttribute("always-visible-player");
			
			    const updatePosition = () => {
			      if (
			        !iridiumSettings.alwaysVisible ||
			        !isAlwaysVisible() ||
			        !moviePlayer
			      ) {
			        return;
			      }
			
			      const newX = (iridiumSettings.alwaysVisiblePosition.x ??= offset);
			      const newY = (iridiumSettings.alwaysVisiblePosition.y ??= offset);
			      const snapRight =
			        (iridiumSettings.alwaysVisiblePosition.snapRight ??= true);
			      const snapBottom =
			        (iridiumSettings.alwaysVisiblePosition.snapBottom ??= true);
			
			      if (newX < offset) {
			        moviePlayer.style.left = `${offset}px`;
			        moviePlayer.style.right = "unset";
			      } else if (snapRight || newX > maxX) {
			        moviePlayer.style.left = "unset";
			        moviePlayer.style.right = `${offset}px`;
			      } else {
			        moviePlayer.style.left = `${newX}px`;
			        moviePlayer.style.right = "unset";
			      }
			
			      if (newY < offset) {
			        moviePlayer.style.top = `${offset}px`;
			        moviePlayer.style.bottom = "unset";
			      } else if (snapBottom || newY > maxY) {
			        moviePlayer.style.top = "unset";
			        moviePlayer.style.bottom = `${offset}px`;
			      } else {
			        moviePlayer.style.top = `${newY}px`;
			        moviePlayer.style.bottom = "unset";
			      }
			    };
			
			    const onMouseMove = (event) => {
			      if (document.fullscreenElement || !moviePlayer) {
			        return false;
			      }
			
			      pos.x1 = pos.x2 - event.clientX;
			      pos.y1 = pos.y2 - event.clientY;
			
			      const newX = moviePlayer.offsetLeft - pos.x1;
			      const newY = moviePlayer.offsetTop - pos.y1;
			
			      if (newX > offset && newX < maxX) {
			        pos.x2 = event.clientX;
			        iridiumSettings.alwaysVisiblePosition.x = newX;
			        iridiumSettings.alwaysVisiblePosition.snapRight = false;
			      }
			
			      if (newY > offset && newY < maxY) {
			        pos.y2 = event.clientY;
			        iridiumSettings.alwaysVisiblePosition.y = newY;
			        iridiumSettings.alwaysVisiblePosition.snapBottom = false;
			      }
			
			      iridiumSettings.alwaysVisiblePosition.snapRight = newX >= maxX;
			      iridiumSettings.alwaysVisiblePosition.snapBottom = newY >= maxY;
			
			      updatePosition();
			
			      event.preventDefault();
			      event.stopPropagation();
			
			      return true;
			    };
			
			    const onMouseDown = (event) => {
			      if (
			        document.fullscreenElement ||
			        event.buttons !== 2 ||
			        !isPlayer(event.target)
			      ) {
			        return true;
			      }
			
			      document.documentElement.setAttribute("moving", "");
			
			      pos.x2 = event.clientX;
			      pos.y2 = event.clientY;
			
			      maxX =
			        document.documentElement.clientWidth - moviePlayer.offsetWidth - offset;
			      maxY =
			        document.documentElement.clientHeight -
			        moviePlayer.offsetHeight -
			        offset;
			
			      const onMouseUp = function () {
			        document.documentElement.removeAttribute("moving");
			        window.removeEventListener("mouseup", onMouseUp, true);
			        window.removeEventListener("mousemove", onMouseMove, true);
			        Broadcaster.saveSetting(SettingData.alwaysVisiblePosition.id);
			      };
			
			      window.addEventListener("mousemove", onMouseMove, true);
			      window.addEventListener("mouseup", onMouseUp, true);
			
			      event.preventDefault();
			      event.stopPropagation();
			
			      return true;
			    };
			
			    const onContextMenu = function (event) {
			      if (
			        document.fullscreenElement ||
			        !isAlwaysVisible() ||
			        !isPlayer(event.target)
			      ) {
			        return false;
			      }
			
			      event.preventDefault();
			      event.stopPropagation();
			
			      return true;
			    };
			
			    const preventScrollTop = (() => {
			      let original = null;
			
			      const override = () => {
			        const watchFlexy = document.querySelector("ytd-watch-flexy");
			
			        if (watchFlexy) {
			          original = watchFlexy.setScrollTop;
			          watchFlexy.setScrollTop = () => {};
			        }
			      };
			
			      const restore = () => {
			        const watchFlexy = document.querySelector("ytd-watch-flexy");
			
			        if (watchFlexy) {
			          watchFlexy.setScrollTop = original;
			          original = null;
			        }
			      };
			
			      return {
			        override: override,
			        restore: restore,
			      };
			    })();
			
			    const updateState = (event) => {
			      moviePlayer ??= document.getElementById("movie_player");
			
			      const parentRects = moviePlayer?.parentElement?.getBoundingClientRect();
			
			      if (!parentRects) {
			        return;
			      }
			
			      maxX =
			        document.documentElement.clientWidth - moviePlayer.offsetWidth - offset;
			      maxY =
			        document.documentElement.clientHeight -
			        moviePlayer.offsetHeight -
			        offset;
			
			      if (event?.type === "resize") {
			        updatePosition();
			      }
			
			      if (
			        iridiumSettings.alwaysVisible &&
			        !document.fullscreenElement &&
			        Util.isWatchPage() &&
			        parentRects.bottom < parentRects.height * 0.5
			      ) {
			        if (!isAlwaysVisible()) {
			          preventScrollTop.override();
			          document.documentElement.setAttribute("always-visible-player", "");
			          window.addEventListener("mousedown", onMouseDown, true);
			          window.addEventListener("contextmenu", onContextMenu, true);
			          updatePosition();
			          window.dispatchEvent(new CustomEvent("resize"));
			        }
			      } else if (isAlwaysVisible()) {
			        preventScrollTop.restore();
			        document.documentElement.removeAttribute("always-visible-player");
			        window.removeEventListener("mousedown", onMouseDown, true);
			        window.removeEventListener("contextmenu", onContextMenu, true);
			        moviePlayer.removeAttribute("style");
			        window.dispatchEvent(new CustomEvent("resize"));
			      }
			    };
			
			    const update = () => {
			      if (iridiumSettings.alwaysVisible) {
			        window.addEventListener("yt-navigate-finish", updateState, false);
			        window.addEventListener("scroll", updateState, false);
			        window.addEventListener("resize", updateState, false);
			      } else {
			        window.removeEventListener("yt-navigate-finish", updateState, false);
			        window.removeEventListener("scroll", updateState, false);
			        window.removeEventListener("resize", updateState, false);
			      }
			
			      updateState();
			    };
			
			    FeatureUpdater.register(SettingData.alwaysVisible.id, update);
			
			    return {};
			  })();
			
			  const FeaturePlayerTools = (() => {
			    const getPlayerTools = () => {
			      const titleSection =
			        document.querySelector("#below ytd-watch-metadata #title") ||
			        document.querySelector("#bottom-grid");
			
			      if (!titleSection) {
			        return null;
			      }
			
			      let playerTools = document.getElementById("iridium-player-tools");
			
			      if (!playerTools) {
			        playerTools = document.createElement("div");
			        playerTools.id = "iridium-player-tools";
			        titleSection.prepend(playerTools);
			        titleSection.style.position = "relative";
			      } else {
			        playerTools.replaceChildren();
			      }
			
			      return playerTools;
			    };
			
			    const checkPlayerToolsSpacing = (playerTools) => {
			      if (!playerTools) {
			        playerTools = document.getElementById("iridium-player-tools");
			
			        if (!playerTools || playerTools.childElementCount === 0) {
			          playerTools?.remove();
			          return;
			        }
			      }
			
			      const titleSection = document.querySelector(
			        "#below ytd-watch-metadata #title",
			      );
			
			      if (titleSection) {
			        titleSection.style.paddingRight = (playerTools.offsetWidth || 0) + "px";
			      }
			    };
			
			    const update = () => {
			      const playerTools = getPlayerTools();
			
			      if (!playerTools) {
			        return;
			      }
			
			      FeatureAutoplayShortcut.check(playerTools);
			      FeatureVideoFocus.check(playerTools);
			      FeatureScreenshot.update(playerTools);
			      FeatureThumbnail.update(playerTools);
			      FeatureMonetizationInfo.update(playerTools);
			
			      checkPlayerToolsSpacing(playerTools);
			    };
			
			    OnPageDataChanged.addListener(update);
			
			    FeatureUpdater.register(SettingData.videoFocusToggle.id, update);
			    FeatureUpdater.register(SettingData.videoScreenshot.id, update);
			    FeatureUpdater.register(SettingData.videoThumbnail.id, update);
			    FeatureUpdater.register(SettingData.monetizationInfo.id, update);
			
			    return {};
			  })();
			
			  const FeatureVideoFocus = (() => {
			    const onCreated = (api) => {
			      api.addEventListener("onStateChange", (state) => {
			        if (iridiumSettings.videoFocus) {
			          switch (state) {
			            case 1:
			            case 3:
			              document.documentElement.setAttribute("dim", "");
			              break;
			            default:
			              document.documentElement.removeAttribute("dim");
			          }
			        }
			      });
			    };
			
			    const update = () => {
			      if (iridiumSettings.videoFocus) {
			        document
			          .getElementById("iridium-video-focus")
			          ?.setAttribute("iridium-enabled", "");
			        switch (
			          document.getElementById("movie_player")?.["getPlayerState"]?.()
			        ) {
			          case 1:
			          case 3:
			            document.documentElement.setAttribute("dim", "");
			            break;
			        }
			      } else {
			        document
			          .getElementById("iridium-video-focus")
			          ?.removeAttribute("iridium-enabled");
			        document.documentElement.removeAttribute("dim");
			      }
			    };
			
			    const check = (playerTools) => {
			      if (!iridiumSettings.videoFocusToggle) {
			        document.getElementById("iridium-focus")?.remove();
			      } else {
			        let videoFocusButton = document.getElementById("iridium-focus");
			
			        if (!videoFocusButton) {
			          videoFocusButton = document.createElement("div");
			          videoFocusButton.id = "iridium-focus";
			          videoFocusButton.title = "Video focus";
			          videoFocusButton.appendChild(
			            j2d.makeSVG(
			              "svg",
			              {
			                id: "iridium-video-focus",
			                "iridium-enabled": "",
			                viewBox: "0 -960 960 960",
			                height: "24",
			                width: "24",
			              },
			              [
			                j2d.makeSVG("path", {
			                  id: "iridium-on",
			                  d: "M112.857-378Q104-378 97.5-384.643t-6.5-15.5Q91-409 97.643-415.5t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5Zm0-160Q104-538 97.5-544.643t-6.5-15.5Q91-569 97.643-575.5t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5ZM235-196.154q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm0-164q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm0-162q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm0-164q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm164.299 343.846q-23.914 0-40.953-16.739-17.038-16.74-17.038-40.654 0-23.914 16.739-40.953 16.74-17.038 40.654-17.038 23.914 0 40.953 16.739 17.038 16.74 17.038 40.654 0 23.914-16.739 40.953-16.74 17.038-40.654 17.038Zm0-162q-23.914 0-40.953-16.739-17.038-16.74-17.038-40.654 0-23.914 16.739-40.953 16.74-17.038 40.654-17.038 23.914 0 40.953 16.739 17.038 16.74 17.038 40.654 0 23.914-16.739 40.953-16.74 17.038-40.654 17.038ZM397-196.154q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm0-490q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731ZM396.857-92Q388-92 381.5-98.643t-6.5-15.5q0-8.857 6.643-15.357t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5Zm0-734q-8.857 0-15.357-6.643t-6.5-15.5q0-8.857 6.643-15.357t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5Zm164.442 483.692q-23.914 0-40.953-16.739-17.038-16.74-17.038-40.654 0-23.914 16.739-40.953 16.74-17.038 40.654-17.038 23.914 0 40.953 16.739 17.038 16.74 17.038 40.654 0 23.914-16.739 40.953-16.74 17.038-40.654 17.038Zm0-162q-23.914 0-40.953-16.739-17.038-16.74-17.038-40.654 0-23.914 16.739-40.953 16.74-17.038 40.654-17.038 23.914 0 40.953 16.739 17.038 16.74 17.038 40.654 0 23.914-16.739 40.953-16.74 17.038-40.654 17.038ZM561-196.154q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm0-490q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731ZM560.857-92Q552-92 545.5-98.643t-6.5-15.5q0-8.857 6.643-15.357t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5Zm0-734q-8.857 0-15.357-6.643t-6.5-15.5q0-8.857 6.643-15.357t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5ZM725-196.154q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm0-164q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm0-162q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm0-164q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731ZM846.857-378q-8.857 0-15.357-6.643t-6.5-15.5q0-8.857 6.643-15.357t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5Zm0-160q-8.857 0-15.357-6.643t-6.5-15.5q0-8.857 6.643-15.357t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5Z",
			                }),
			                j2d.makeSVG("path", {
			                  id: "iridium-off",
			                  d: "M798.923-96.23 95.231-798.924q-10.616-10.615-11-23.269-.385-12.654 11-24.039 11.384-11.384 23.654-11.384 12.269 0 23.654 11.384l703.692 703.692q10.615 10.616 11 22.77.384 12.154-11 23.538-11.385 11.385-23.654 11.385-12.27 0-23.654-11.385ZM396.857-92Q388-92 381.5-98.643t-6.5-15.5q0-8.857 6.643-15.357t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5Zm164 0Q552-92 545.5-98.643t-6.5-15.5q0-8.857 6.643-15.357t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5ZM235-196.154q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm162 0q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm164 0q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731ZM399-342.308q-22.846 0-40.269-17.423T341.308-400q0-22.846 17.423-40.269T399-457.692q22.846 0 40.269 17.423T456.692-400q0 22.846-17.423 40.269T399-342.308Zm-164-17.846q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm507.154-.231-56.769-56.769q6.076-10.384 15.884-16.538t23.943-6.154q16.295 0 27.964 11.67 11.67 11.669 11.67 27.964 0 14.135-6.154 23.943-6.154 9.808-16.538 15.884ZM112.857-378Q104-378 97.5-384.643t-6.5-15.5Q91-409 97.643-415.5t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5Zm734 0q-8.857 0-15.357-6.643t-6.5-15.5q0-8.857 6.643-15.357t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5ZM591.231-510.538l-81.693-81.693q8.231-12.952 22.423-20.207 14.193-7.254 29.416-7.254 22.469 0 39.892 17.423 17.423 17.423 17.423 39.892 0 15.223-7.038 29.031-7.039 13.808-20.423 22.808ZM235-522.154q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm490 0q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731ZM112.857-538Q104-538 97.5-544.643t-6.5-15.5Q91-569 97.643-575.5t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5Zm734 0q-8.857 0-15.357-6.643t-6.5-15.5q0-8.857 6.643-15.357t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5ZM561-686.154q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731Zm-146.615-1.231-56-56q5.307-9.384 15.109-15.923 9.803-6.538 23.506-6.538 16.385 0 28.115 11.67 11.731 11.669 11.731 27.964 0 14.135-6.538 23.827-6.539 9.693-15.923 15ZM725-686.154q-16.385 0-28.115-11.731-11.731-11.73-11.731-28.115 0-16.385 11.731-28.115 11.73-11.731 28.115-11.731 16.385 0 28.115 11.731 11.731 11.73 11.731 28.115 0 16.385-11.731 28.115-11.73 11.731-28.115 11.731ZM396.857-826q-8.857 0-15.357-6.643t-6.5-15.5q0-8.857 6.643-15.357t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5Zm164 0q-8.857 0-15.357-6.643t-6.5-15.5q0-8.857 6.643-15.357t15.5-6.5q8.857 0 15.357 6.643t6.5 15.5q0 8.857-6.643 15.357t-15.5 6.5Z",
			                }),
			              ],
			            ),
			          );
			
			          playerTools?.appendChild(videoFocusButton);
			        }
			
			        if (videoFocusButton) {
			          update();
			
			          videoFocusButton.onclick = () => {
			            iridiumSettings.videoFocus = !iridiumSettings.videoFocus;
			            Broadcaster.saveSetting(SettingData.videoFocus.id);
			            update();
			          };
			        }
			      }
			    };
			
			    FeatureUpdater.register(SettingData.videoFocusToggle.id, update);
			    FeatureUpdater.register(SettingData.videoFocus.id, update);
			
			    OverrideOnPlayerReady.onReadyListener(onCreated);
			
			    return {
			      check: check,
			    };
			  })();
			
			  const FeatureScreenshot = (() => {
			    const update = (playerTools) => {
			      if (!iridiumSettings.videoScreenshot) {
			        document.getElementById("iridium-screenshot")?.remove();
			      } else if (playerTools) {
			        let screenshotButton = document.getElementById("iridium-screenshot");
			
			        if (!screenshotButton) {
			          screenshotButton = document.createElement("div");
			          screenshotButton.id = "iridium-screenshot";
			          screenshotButton.title = "Screenshot";
			          screenshotButton.appendChild(
			            j2d.makeSVG(
			              "svg",
			              { viewBox: "0 -960 960 960", height: "24", width: "24" },
			              [
			                j2d.makeSVG("path", {
			                  d: "M686.308-395.692h-61.616q-12.615 0-21.654 9.038Q594-377.615 594-365t9.038 21.654q9.039 9.038 21.654 9.038h77.693q18.923 0 32.115-13.192 13.192-13.192 13.192-32.115v-77.693q0-12.615-9.038-21.654Q729.615-488 717-488t-21.654 9.038q-9.038 9.039-9.038 21.654v61.616ZM273.692-652.308h61.616q12.615 0 21.654-9.038Q366-670.385 366-683t-9.038-21.654q-9.039-9.038-21.654-9.038h-77.693q-18.923 0-32.115 13.192-13.192 13.192-13.192 32.115v77.693q0 12.615 9.038 21.654Q230.385-560 243-560t21.654-9.038q9.038-9.039 9.038-21.654v-61.616ZM184.615-216q-38.34 0-64.478-26.137Q94-268.275 94-306.615v-434.77q0-38.34 26.137-64.478Q146.275-832 184.615-832h590.77q38.34 0 64.478 26.137Q866-779.725 866-741.385v434.77q0 38.34-26.137 64.478Q813.725-216 775.385-216H628v42.693q0 18.923-13.192 32.115Q601.616-128 582.693-128H377.307q-18.923 0-32.115-13.192Q332-154.384 332-173.307V-216H184.615Zm0-66h590.77q9.23 0 16.923-7.692Q800-297.385 800-306.615v-434.77q0-9.23-7.692-16.923Q784.615-766 775.385-766h-590.77q-9.23 0-16.923 7.692Q160-750.615 160-741.385v434.77q0 9.23 7.692 16.923Q175.385-282 184.615-282ZM160-282v-484 484Z",
			                }),
			              ],
			            ),
			          );
			
			          playerTools.appendChild(screenshotButton);
			        }
			
			        if (screenshotButton) {
			          screenshotButton.onclick = function () {
			            const video = document.querySelector("video");
			
			            if (!video || !video.src) {
			              return;
			            }
			
			            const canvas = document.createElement("canvas");
			            const context = canvas.getContext("2d");
			            const aspectRatio = video.videoWidth / video.videoHeight;
			            const canvasWidth = video.videoWidth;
			            const canvasHeight = parseInt(`${canvasWidth / aspectRatio}`, 10);
			
			            canvas.width = canvasWidth;
			            canvas.height = canvasHeight;
			            context.drawImage(video, 0, 0, canvasWidth, canvasHeight);
			            canvas.toBlob((blob) => window.open(URL.createObjectURL(blob)));
			          };
			        }
			      }
			    };
			
			    return {
			      update: update,
			    };
			  })();
			
			  const FeatureThumbnail = (() => {
			    const update = (playerTools) => {
			      if (!iridiumSettings.videoThumbnail) {
			        document.getElementById("iridium-thumbnail")?.remove();
			      } else {
			        let thumbnailButton = document.getElementById("iridium-thumbnail");
			
			        if (!thumbnailButton) {
			          thumbnailButton = document.createElement("div");
			          thumbnailButton.id = "iridium-thumbnail";
			          thumbnailButton.title = "Thumbnail";
			          thumbnailButton.appendChild(
			            j2d.makeSVG(
			              "svg",
			              { viewBox: "0 -960 960 960", height: "24", width: "24" },
			              [
			                j2d.makeSVG("path", {
			                  d: "M224.615-134q-38.34 0-64.478-26.137Q134-186.275 134-224.615v-510.77q0-38.34 26.137-64.478Q186.275-826 224.615-826h510.77q38.34 0 64.478 26.137Q826-773.725 826-735.385v510.77q0 38.34-26.137 64.478Q773.725-134 735.385-134h-510.77Zm0-66h510.77q9.23 0 16.923-7.692Q760-215.385 760-224.615v-510.77q0-9.23-7.692-16.923Q744.615-760 735.385-760h-510.77q-9.23 0-16.923 7.692Q200-744.615 200-735.385v510.77q0 9.23 7.692 16.923Q215.385-200 224.615-200ZM200-200v-560 560Zm127.307-84h311.539q14.693 0 20.154-12.192 5.462-12.193-2.23-23.654L573-433.385q-7.231-9.461-17.923-8.961-10.692.5-17.923 9.961l-88.692 111.923-54.077-64q-7.077-8.692-17.462-8.692t-17.615 9.461l-49.154 63.847q-8.462 11.461-3 23.654Q312.615-284 327.307-284ZM340-567q21.955 0 37.478-15.522Q393-598.045 393-620q0-21.955-15.522-37.478Q361.955-673 340-673q-21.955 0-37.478 15.522Q287-641.955 287-620q0 21.955 15.522 37.478Q318.045-567 340-567Z",
			                }),
			              ],
			            ),
			          );
			
			          playerTools?.appendChild(thumbnailButton);
			        }
			
			        if (thumbnailButton) {
			          thumbnailButton.onclick = function () {
			            const playerResponse =
			              document.querySelector("ytd-app")?.["data"]?.["playerResponse"];
			            const thumbnails = Util.getSingleObjectByKey(
			              playerResponse,
			              "thumbnails",
			            );
			
			            if (thumbnails) {
			              let maxRes = null;
			
			              for (let thumbnailsKey in thumbnails) {
			                const thumbnail = thumbnails[thumbnailsKey];
			
			                if (
			                  maxRes === null ||
			                  thumbnail?.["width"] > maxRes?.["width"]
			                ) {
			                  maxRes = thumbnail;
			                }
			              }
			
			              if (maxRes?.["url"]) {
			                window.open(maxRes["url"]);
			              }
			            }
			          };
			        }
			      }
			    };
			
			    return {
			      update: update,
			    };
			  })();
			
			  const FeatureMonetizationInfo = (() => {
			    const monetizationKey = crypto.randomUUID();
			
			    const getData = (data) => {
			      if (data.constructor === Object) {
			        if (data["videoDetails"]) {
			          return data;
			        } else {
			          return Util.getSingleObjectByKey(data, "raw_player_response");
			        }
			      } else {
			        return document
			          .querySelector("ytd-page-manager")
			          ?.["getCurrentData"]?.()?.["playerResponse"];
			      }
			    };
			
			    const update = (data) => {
			      if (!iridiumSettings.monetizationInfo) {
			        document.getElementById("iridium-monetization")?.remove();
			      } else {
			        const playerResponse = getData(data);
			
			        if (!playerResponse) {
			          return;
			        }
			
			        const videoId = playerResponse["videoDetails"]?.["videoId"];
			        const stored = (playerResponse[monetizationKey] ??= {
			          id: "",
			          sponsored: false,
			          adCount: 0,
			        });
			
			        if (stored.id !== videoId) {
			          stored.id = videoId;
			          stored.sponsored = playerResponse["paidContentOverlay"];
			          stored.adCount = playerResponse["adPlacements"]?.length || 0;
			        }
			
			        const playerTools = data instanceof HTMLElement ? data : null;
			
			        let monetizationButton = document.getElementById(
			          "iridium-monetization",
			        );
			
			        if (!monetizationButton && playerTools) {
			          monetizationButton = j2d.make(
			            "div",
			            { id: "iridium-monetization", title: "Monetization state" },
			            [
			              j2d.makeSVG(
			                "svg",
			                { viewBox: "0 -960 960 960", height: "24", width: "24" },
			                [
			                  j2d.makeSVG("path", {
			                    class: "iridium-on",
			                    d: "M324-370q14 48 43.5 77.5T444-252v17q0 14 10.5 24.5T479-200q14 0 24.5-10.5T514-235v-15q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-15q0-14-10.5-24.5T481-760q-14 0-24.5 10.5T446-725v15q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z",
			                  }),
			                  j2d.makeSVG("path", {
			                    class: "iridium-off",
			                    d: "M328-364.769q15.077 47.077 45.808 74.538 30.73 27.462 75.577 37.923V-231q0 12.846 8.384 21.231 8.385 8.384 21.231 8.384 12.846 0 21.231-8.384 8.384-8.385 8.384-21.231v-19.308q49.077-8.615 86.539-36.923 37.461-28.307 37.461-88.769 0-44-24.538-76.615-24.538-32.616-98.538-58.616-65.154-23.077-86.039-38.615-20.885-15.539-20.885-44.154 0-27.615 21.385-45.5t58-17.885q31.462 0 50.269 15.462 18.808 15.462 29.423 37.923l54.77-21.692q-12.077-32.846-40.77-57.308-28.692-24.462-65.077-26.692V-729q0-12.846-8.384-21.231-8.385-8.384-21.231-8.384-12.846 0-21.231 8.384-8.384 8.385-8.384 21.231v19.308q-52.308 9.692-80.154 42.5-27.846 32.807-27.846 73.192 0 46.154 28.115 75.077Q399.615-490 462-467.692q64.538 23.769 88.731 41.923 24.192 18.154 24.192 49.769 0 38.231-27.308 54.808-27.307 16.577-61.23 16.577-34.923 0-62.231-20.616-27.308-20.615-40.923-60.769L328-364.769Zm152.134 276.77q-81.673 0-152.91-30.84t-124.365-83.922q-53.127-53.082-83.993-124.257Q88-398.194 88-479.866q0-81.673 30.839-153.41 30.84-71.737 83.922-124.865 53.082-53.127 124.257-83.493Q398.194-872 479.866-872q81.673 0 153.41 30.339 71.737 30.34 124.865 83.422 53.127 53.082 83.493 124.757Q872-561.806 872-480.134q0 81.673-30.339 152.91-30.34 71.237-83.422 124.365-53.082 53.127-124.757 83.993Q561.806-88 480.134-88ZM480-154q137 0 231.5-94.5T806-480q0-137-94.5-231.5T480-806q-137 0-231.5 94.5T154-480q0 137 94.5 231.5T480-154Zm0-326Z",
			                  }),
			                ],
			              ),
			              j2d.make("div", { id: "iridium-monetization-count" }),
			            ],
			          );
			
			          playerTools.appendChild(monetizationButton);
			        }
			
			        if (monetizationButton) {
			          const title = [];
			
			          if (stored.sponsored) {
			            monetizationButton.classList.add("sponsored");
			            title.push("Sponsored");
			          } else {
			            monetizationButton.classList.remove("sponsored");
			          }
			
			          if (stored.adCount > 0) {
			            monetizationButton.classList.add("monetized");
			            title.push(`Monetized (${stored.adCount} ads)`);
			            document
			              .getElementById("iridium-monetization-count")
			              ?.replaceChildren(document.createTextNode(stored.adCount));
			          } else {
			            monetizationButton.classList.remove("monetized");
			            title.push("Not monetized");
			            document
			              .getElementById("iridium-monetization-count")
			              ?.replaceChildren(document.createTextNode(""));
			          }
			
			          monetizationButton.title = title.join("\n");
			        }
			      }
			    };
			
			    OverrideFetch.onFetchListener(update);
			    OverrideHandleResponse.onHandleResponseListener(update);
			
			    return {
			      update: update,
			    };
			  })();
			
			  const FeatureAutoplayShortcut = (() => {
			    const update = () => {
			      const button = document.getElementById("iridium-autoplay-shortcut");
			
			      if (!button) {
			        return;
			      }
			
			      if (iridiumSettings.autoplay) {
			        button.setAttribute("iridium-enabled", "");
			        button.title = "Autoplay on";
			      } else {
			        button.removeAttribute("iridium-enabled");
			        button.title = "Autoplay off";
			      }
			    };
			
			    const check = (playerTools) => {
			      if (!iridiumSettings.autoplayShortcut) {
			        document.getElementById("iridium-autoplay-shortcut")?.remove();
			      } else if (playerTools) {
			        let button = document.getElementById("iridium-autoplay-shortcut");
			
			        if (!button) {
			          button = j2d.make(
			            "div",
			            {
			              id: "iridium-autoplay-shortcut",
			              title: "Monetization state",
			              "iridium-enabled": "",
			            },
			            [
			              j2d.makeSVG(
			                "svg",
			                { viewBox: "0 -960 960 960", height: "24", width: "24" },
			                [
			                  j2d.makeSVG("path", {
			                    d: "M320-263v-438q0-15 10-24.167 10-9.167 23.333-9.167 4.333 0 8.833 1.167t8.834 3.5L715.667-510q7.667 5.333 11.5 12.333T731-482q0 8.667-3.833 15.667-3.833 6.999-11.5 12.333L371-234.333q-4.334 2.333-8.834 3.5-4.5 1.166-8.833 1.166-13.333 0-23.333-9.166Q320-248 320-263Z",
			                  }),
			                ],
			              ),
			            ],
			          );
			
			          playerTools.appendChild(button);
			        }
			
			        if (button) {
			          update();
			
			          button.onclick = () => {
			            iridiumSettings.autoplay = !iridiumSettings.autoplay;
			            Broadcaster.saveSetting(SettingData.autoplay.id);
			            update();
			          };
			        }
			      }
			    };
			
			    FeatureUpdater.register(SettingData.autoplayShortcut.id, update);
			
			    return {
			      check: check,
			    };
			  })();
			
			  const FeatureDefaultQuality = (() => {
			    const qualityList = [
			      "highres",
			      "hd2880",
			      "hd2160",
			      "hd1440",
			      "hd1080",
			      "hd720",
			      "large",
			      "medium",
			      "small",
			      "tiny",
			      "auto",
			    ];
			    const isValidQuality = (quality) => qualityList.indexOf(quality) > -1;
			    const getClosestAvailableQuality = (quality, availableList) => {
			      const qualityIndex = qualityList.indexOf(quality);
			
			      if (qualityIndex === -1 || availableList?.length < 1) {
			        return availableList[0] || "auto";
			      }
			
			      const total = qualityList.length - 1;
			      let top = qualityIndex + 1;
			      let bottom = qualityIndex - 1;
			
			      for (let i = 0; i < total; i++) {
			        const topIndex = availableList.indexOf(qualityList[top]);
			        const bottomIndex = availableList.indexOf(qualityList[bottom]);
			
			        if (topIndex > -1) {
			          return availableList[topIndex];
			        }
			
			        if (bottomIndex > -1) {
			          return availableList[bottomIndex];
			        }
			
			        top += 1;
			        bottom -= 1;
			      }
			
			      return availableList[0] || "auto";
			    };
			    const getAvailableQuality = (quality, availableList) => {
			      if (availableList.indexOf(quality) > -1) {
			        return quality;
			      }
			
			      return getClosestAvailableQuality(quality, availableList);
			    };
			    const onCreated = (api) =>
			      api.addEventListener("onStateChange", () => {
			        if (
			          iridiumSettings.defaultQuality !== "auto" &&
			          isValidQuality(iridiumSettings.defaultQuality)
			        ) {
			          const currentQuality = api?.["getPreferredQuality"]?.();
			
			          if (currentQuality === "auto") {
			            const availableQualityList = api?.["getAvailableQualityLevels"]?.();
			
			            if (availableQualityList?.length > 0) {
			              const qualitySet = getAvailableQuality(
			                iridiumSettings.defaultQuality,
			                availableQualityList,
			              );
			
			              api?.["setPlaybackQuality"]?.(qualitySet);
			              api?.["setPlaybackQualityRange"]?.(qualitySet);
			            }
			          }
			        }
			      });
			
			    OverrideOnPlayerReady.onReadyListener(onCreated);
			
			    return {};
			  })();
			
			  const FeatureDefaultSpeed = (() => {
			    const isValidSpeed = (speed) =>
			      ["0.25", "0.5", "0.75", "1", "1.25", "1.5", "1.75", "2", "-1"].indexOf(
			        speed,
			      ) > -1;
			    const getAvailableSpeed = (speed, availableList) => {
			      const speedNumber = Number(speed);
			
			      if (availableList.indexOf(speedNumber) > -1) {
			        return speedNumber;
			      } else {
			        return 1;
			      }
			    };
			
			    let currentId = "";
			
			    const onCreated = (api) =>
			      api.addEventListener("onStateChange", () => {
			        if (
			          iridiumSettings.defaultSpeed !== "-1" &&
			          isValidSpeed(iridiumSettings.defaultSpeed)
			        ) {
			          const videoId = api?.["getVideoData"]?.()?.["video_id"] || "";
			          const currentSpeed = api?.["getPlaybackRate"]?.()?.toString();
			
			          if (
			            iridiumSettings.defaultSpeed !== currentSpeed &&
			            currentId !== videoId
			          ) {
			            const availableSpeedList = api?.["getAvailablePlaybackRates"]?.();
			
			            if (availableSpeedList?.length > 0) {
			              currentId = videoId;
			
			              const speedSet = getAvailableSpeed(
			                iridiumSettings.defaultSpeed,
			                availableSpeedList,
			              );
			
			              api?.["setPlaybackRate"]?.(speedSet);
			            }
			          }
			        }
			      });
			
			    OverrideOnPlayerReady.onReadyListener(onCreated);
			
			    return {};
			  })();
			
			  const FeatureAnnotations = (() => {
			    const onCreated = (api) =>
			      api.addEventListener("videodatachange", () => {
			        if (!iridiumSettings.annotations) {
			          api?.["unloadModule"]?.("annotations_module");
			        }
			      });
			
			    OverrideOnPlayerReady.onReadyListener(onCreated);
			
			    return {};
			  })();
			
			  const FeatureAdManager = (() => {
			    const isAdAllowed = (isSubscribed, enabled) => {
			      // when all ads are opted out
			      if (iridiumSettings.adOptOutAll) {
			        // ads will be allowed only if:
			        // the exception for videos from subscribed channels is enabled
			        // and the video belongs to a subscribed channel
			        return iridiumSettings.adSubscribed && isSubscribed;
			      }
			
			      // ads will be allowed if:
			      // the exception for videos from subscribed channels is enabled
			      // the video belongs to a subscribed channel
			      // and the option is enabled
			      if (iridiumSettings.adSubscribed) {
			        return isSubscribed && enabled;
			      }
			
			      // otherwise the setting itself prevails
			      return enabled;
			    };
			
			    const checkHomePageAds = (itemContainer) => {
			      for (let i = itemContainer.length - 1; i >= 0; i--) {
			        const itemRenderer = itemContainer[i];
			        const exists =
			          itemRenderer?.["richItemRenderer"]?.["content"]?.["adSlotRenderer"] ||
			          itemRenderer?.["richSectionRenderer"]?.["content"]?.[
			            "statementBannerRenderer"
			          ] ||
			          itemRenderer?.["richSectionRenderer"]?.["content"]?.[
			            "brandVideoShelfRenderer"
			          ] ||
			          itemRenderer?.["richSectionRenderer"]?.["content"]?.[
			            "brandVideoSingletonRenderer"
			          ];
			
			        if (exists) {
			          itemContainer.splice(i, 1);
			        }
			      }
			    };
			
			    const listener = (data) => {
			      const subscribeButtonRenderer = Util.getSingleObjectByKey(
			        data,
			        "subscribeButtonRenderer",
			      );
			      const isSubscribed = subscribeButtonRenderer?.["subscribed"] === true;
			      const isAdTaggedProductsAllowed = isAdAllowed(
			        isSubscribed,
			        iridiumSettings.adTaggedProducts,
			      );
			
			      if (!isAdTaggedProductsAllowed) {
			        // player args
			        const playerOverlayRenderer = Util.getSingleObjectByKey(
			          data,
			          "playerOverlayRenderer",
			        );
			
			        // video tagged products
			        if (playerOverlayRenderer?.["productsInVideoOverlayRenderer"]) {
			          delete playerOverlayRenderer["productsInVideoOverlayRenderer"];
			        }
			      }
			
			      const isAdMastheadAllowed = isAdAllowed(
			        isSubscribed,
			        iridiumSettings.adMasthead,
			      );
			      const isAdHomeFeedAllowed = isAdAllowed(
			        isSubscribed,
			        iridiumSettings.adHomeFeed,
			      );
			
			      if (!isAdMastheadAllowed || !isAdHomeFeedAllowed) {
			        // home page ads
			        const richGridRenderer = Util.getSingleObjectByKey(
			          data,
			          "richGridRenderer",
			        );
			
			        if (!isAdMastheadAllowed) {
			          const exists =
			            richGridRenderer?.["masthead"]?.["bannerPromoRenderer"] ||
			            richGridRenderer?.["masthead"]?.["adSlotRenderer"];
			
			          if (exists) {
			            delete richGridRenderer["masthead"];
			          }
			
			          const bigYoodle = richGridRenderer?.["bigYoodle"];
			
			          if (bigYoodle) {
			            delete richGridRenderer?.["bigYoodle"];
			          }
			        }
			
			        if (!isAdHomeFeedAllowed) {
			          const itemContainer = richGridRenderer?.["contents"];
			
			          // home page list ads
			          if (
			            itemContainer?.constructor === Array &&
			            itemContainer.length > 0
			          ) {
			            checkHomePageAds(itemContainer);
			          }
			
			          const actions = data?.["onResponseReceivedActions"];
			
			          // home page list continuation ads
			          if (actions?.constructor === Array && actions.length > 0) {
			            for (let i = actions.length - 1; i >= 0; i--) {
			              const continuationItems =
			                actions[i]?.["appendContinuationItemsAction"]?.[
			                  "continuationItems"
			                ];
			
			              if (
			                continuationItems?.constructor === Array &&
			                continuationItems.length > 0
			              ) {
			                checkHomePageAds(continuationItems);
			              }
			            }
			          }
			        }
			      }
			
			      const isAdSearchFeedAllowed = isAdAllowed(
			        isSubscribed,
			        iridiumSettings.adSearchFeed,
			      );
			
			      if (!isAdSearchFeedAllowed) {
			        // search results ads
			        const sectionListRenderer = Util.getSingleObjectByKey(
			          data,
			          "sectionListRenderer",
			        );
			        const sectionListRendererContents = sectionListRenderer?.["contents"];
			
			        if (
			          sectionListRendererContents?.constructor === Array &&
			          sectionListRendererContents.length > 0
			        ) {
			          for (let i = sectionListRendererContents.length - 1; i >= 0; i--) {
			            const itemRenderer = sectionListRendererContents[i];
			            const itemRendererContents =
			              itemRenderer?.["itemSectionRenderer"]?.["contents"];
			
			            if (
			              itemRendererContents?.constructor === Array &&
			              itemRendererContents.length > 0
			            ) {
			              for (let j = itemRendererContents.length - 1; j >= 0; j--) {
			                const subItemRender = itemRendererContents[j];
			                if (
			                  subItemRender?.["adSlotRenderer"] ||
			                  subItemRender?.["searchPyvRenderer"]
			                ) {
			                  itemRendererContents.splice(j, 1);
			                }
			              }
			
			              if (itemRendererContents.length === 0) {
			                sectionListRendererContents.splice(i, 1);
			              }
			            }
			          }
			        }
			      }
			
			      const isAdVideoFeedAllowed = isAdAllowed(
			        isSubscribed,
			        iridiumSettings.adVideoFeed,
			      );
			
			      if (!isAdVideoFeedAllowed) {
			        // video page sidebar ads
			        const secondaryResults = Util.getSingleObjectByKey(
			          data,
			          "secondaryResults",
			        )?.["secondaryResults"];
			        const results = secondaryResults?.["results"];
			
			        if (results?.constructor === Array && results.length > 0) {
			          for (let i = results.length - 1; i >= 0; i--) {
			            const itemRenderer = results[i];
			            const adSlotRenderer = itemRenderer["adSlotRenderer"];
			
			            if (adSlotRenderer) {
			              results.splice(i, 1);
			            } else {
			              const itemRendererContents =
			                itemRenderer?.["itemSectionRenderer"]?.["contents"];
			
			              if (
			                itemRendererContents?.constructor === Array &&
			                itemRendererContents.length > 0
			              ) {
			                for (let j = itemRendererContents.length - 1; j >= 0; j--) {
			                  const subItemRender = itemRendererContents[j];
			                  if (subItemRender?.["adSlotRenderer"]) {
			                    itemRendererContents.splice(j, 1);
			                  }
			                }
			
			                if (itemRendererContents.length === 0) {
			                  results.splice(i, 1);
			                }
			              }
			            }
			          }
			        }
			      }
			    };
			
			    const playerConfig = (args) => {
			      const subscribeButtonRenderer = Util.getSingleObjectByKey(
			        args,
			        "subscribeButtonRenderer",
			      );
			      const isSubscribed = subscribeButtonRenderer?.["subscribed"] === true;
			      const isInVideoAdsAllowed = isAdAllowed(
			        isSubscribed,
			        iridiumSettings.adInVideo,
			      );
			
			      if (!isInVideoAdsAllowed) {
			        const adPlacementsParent = Util.getSingleObjectAndParentByKey(
			          args,
			          "adPlacements",
			        );
			        const adSlotsParent = Util.getSingleObjectAndParentByKey(
			          args,
			          "adSlots",
			        );
			        const playerAdsParent = Util.getSingleObjectAndParentByKey(
			          args,
			          "playerAds",
			        );
			
			        if (adPlacementsParent?.parent?.["adPlacements"]) {
			          delete adPlacementsParent.parent["adPlacements"];
			        }
			
			        if (adSlotsParent?.parent?.["adSlots"]) {
			          delete adSlotsParent.parent["adSlots"];
			        }
			
			        if (playerAdsParent?.parent?.["playerAds"]) {
			          delete playerAdsParent.parent["playerAds"];
			        }
			      }
			    };
			
			    OnYtPageDataFetched.addListener(listener);
			    OverrideFetch.onFetchListener(listener);
			    OverrideFetch.onFetchListener(playerConfig);
			    OverrideHandleResponse.onHandleResponseListener(listener);
			    OverrideHandleResponse.onHandleResponseListener(playerConfig);
			
			    return {};
			  })();
			
			  const FeatureShorts = (() => {
			    const listener = (data) => {
			      if (!iridiumSettings.searchShorts) {
			        // search results shorts
			        const listContents =
			          Util.getSingleObjectByKey(data, "sectionListRenderer")?.[
			            "contents"
			          ] ||
			          Util.getSingleObjectByKey(data, "appendContinuationItemsAction")?.[
			            "continuationItems"
			          ];
			
			        if (listContents?.constructor === Array && listContents.length > 0) {
			          for (let i = listContents.length - 1; i >= 0; i--) {
			            const itemSectionRenderer =
			              listContents[i]?.["itemSectionRenderer"];
			            const itemSectionRendererContents =
			              itemSectionRenderer?.["contents"];
			
			            if (
			              itemSectionRendererContents?.constructor === Array &&
			              itemSectionRendererContents.length > 0
			            ) {
			              for (
			                let j = itemSectionRendererContents.length - 1;
			                j >= 0;
			                j--
			              ) {
			                if (
			                  itemSectionRendererContents[j]?.["reelShelfRenderer"] ||
			                  itemSectionRendererContents[j]?.["videoRenderer"]?.[
			                    "navigationEndpoint"
			                  ]?.["reelWatchEndpoint"]
			                ) {
			                  itemSectionRendererContents.splice(j, 1);
			                } else if (itemSectionRendererContents[j]?.["shelfRenderer"]) {
			                  const shelfRendererItems =
			                    itemSectionRendererContents[j]?.["shelfRenderer"]?.[
			                      "content"
			                    ]?.["verticalListRenderer"]?.["items"];
			
			                  if (
			                    shelfRendererItems?.constructor === Array &&
			                    shelfRendererItems.length > 0
			                  ) {
			                    for (let k = shelfRendererItems.length - 1; k >= 0; k--) {
			                      const reelWatchEndpoint =
			                        shelfRendererItems[k]?.["videoRenderer"]?.[
			                          "navigationEndpoint"
			                        ]?.["reelWatchEndpoint"];
			                      if (reelWatchEndpoint) {
			                        shelfRendererItems.splice(k, 1);
			                      }
			                    }
			
			                    if (shelfRendererItems.length === 0) {
			                      itemSectionRendererContents.splice(j, 1);
			                    }
			                  }
			                }
			              }
			
			              if (itemSectionRendererContents.length === 0) {
			                listContents.splice(i, 1);
			              }
			            }
			          }
			        }
			      }
			
			      if (
			        (!iridiumSettings.homeShorts && window.location.pathname === "/") ||
			        (!iridiumSettings.subscriptionsShorts &&
			          window.location.pathname === "/feed/subscriptions")
			      ) {
			        // home page and grid view subscriptions shorts
			        const richGridRenderer = Util.getSingleObjectByKey(
			          data,
			          "richGridRenderer",
			        );
			        const richGridRendererContents = richGridRenderer?.["contents"];
			
			        if (
			          richGridRendererContents?.constructor === Array &&
			          richGridRendererContents.length > 0
			        ) {
			          for (let i = richGridRendererContents.length - 1; i >= 0; i--) {
			            const richShelfRendererContents =
			              richGridRendererContents[i]?.["richSectionRenderer"]?.[
			                "content"
			              ]?.["richShelfRenderer"]?.["contents"];
			
			            if (
			              richShelfRendererContents?.constructor === Array &&
			              richShelfRendererContents.length > 0
			            ) {
			              for (let j = richShelfRendererContents.length - 1; j >= 0; j--) {
			                const richItemRendererContent =
			                  richShelfRendererContents[j]?.["richItemRenderer"]?.[
			                    "content"
			                  ];
			                const reelItemRenderer =
			                  richItemRendererContent?.["reelItemRenderer"];
			                const shortsLockupViewModel =
			                  richItemRendererContent?.["shortsLockupViewModel"];
			
			                if (reelItemRenderer || shortsLockupViewModel) {
			                  richShelfRendererContents.splice(j, 1);
			                }
			              }
			
			              if (richShelfRendererContents.length === 0) {
			                richGridRendererContents.splice(i, 1);
			              }
			            }
			          }
			        }
			
			        // list view subscriptions shorts
			        const sectionListRenderer = Util.getSingleObjectByKey(
			          data,
			          "sectionListRenderer",
			        );
			        const sectionListRendererContents = sectionListRenderer?.["contents"];
			
			        if (
			          sectionListRendererContents?.constructor === Array &&
			          sectionListRendererContents.length > 0
			        ) {
			          for (let i = sectionListRendererContents.length - 1; i >= 0; i--) {
			            const itemSectionRendererContents =
			              sectionListRendererContents[i]?.["itemSectionRenderer"]?.[
			                "contents"
			              ];
			
			            if (
			              itemSectionRendererContents?.constructor === Array &&
			              itemSectionRendererContents.length > 0
			            ) {
			              for (
			                let j = itemSectionRendererContents.length - 1;
			                j >= 0;
			                j--
			              ) {
			                const reelShelfRenderer =
			                  itemSectionRendererContents[j]?.["reelShelfRenderer"];
			                if (reelShelfRenderer) {
			                  itemSectionRendererContents.splice(j, 1);
			                }
			              }
			
			              if (itemSectionRendererContents.length === 0) {
			                sectionListRendererContents.splice(i, 1);
			              }
			            }
			          }
			        }
			      }
			
			      // video page sidebar shorts
			      if (!iridiumSettings.videoPageShorts && Util.isWatchPage()) {
			        const twoColumnWatchNextResults = Util.getSingleObjectByKey(
			          data,
			          "twoColumnWatchNextResults",
			        );
			        const itemContainer =
			          twoColumnWatchNextResults?.["secondaryResults"]?.[
			            "secondaryResults"
			          ]?.["results"];
			
			        if (itemContainer?.constructor === Array && itemContainer.length > 0) {
			          for (let i = itemContainer.length - 1; i >= 0; i--) {
			            const itemRendererContents =
			              itemContainer[i]?.["itemSectionRenderer"]?.["contents"];
			
			            if (
			              itemRendererContents?.constructor === Array &&
			              itemRendererContents.length > 0
			            ) {
			              for (let j = itemRendererContents.length - 1; j >= 0; j--) {
			                const reelShelfRenderer =
			                  itemRendererContents[j]?.["reelShelfRenderer"];
			
			                if (reelShelfRenderer) {
			                  itemRendererContents.splice(j, 1);
			                }
			              }
			            }
			          }
			        }
			      }
			    };
			
			    OnYtPageDataFetched.addListener(listener);
			    OverrideFetch.onFetchListener(listener);
			    OverrideHandleResponse.onHandleResponseListener(listener);
			
			    return {};
			  })();
			
			  const FeatureCreatorMerch = (() => {
			    const listener = (data) => {
			      if (!iridiumSettings.creatorMerch) {
			        const contents = Util.getSingleObjectByKey(
			          data,
			          "contents",
			          (matched, _) =>
			            matched?.find((item) =>
			              Object.hasOwn(item, "merchandiseShelfRenderer"),
			            ),
			        );
			
			        if (contents?.length > 0) {
			          for (let i = contents.length - 1; i >= 0; i--) {
			            const item = contents[i];
			            if (Object.hasOwn(item, "merchandiseShelfRenderer")) {
			              contents.splice(i, 1);
			            }
			          }
			        }
			      }
			    };
			
			    OnYtPageDataFetched.addListener(listener);
			    OverrideFetch.onFetchListener(listener);
			    OverrideHandleResponse.onHandleResponseListener(listener);
			
			    return {};
			  })();
			
			  const FeatureVideoCount = (() => {
			    const onVideoCountData = (pageData, subCount, profileCounts) => {
			      if (!subCount?.["text"]?.["simpleText"]) {
			        return;
			      }
			
			      if (subCount["textChanged_"]) {
			        subCount["textChanged_"]?.({ runs: [{ text: profileCounts }] });
			      } else if (subCount.textContent === subCount["text"]["simpleText"]) {
			        subCount.textContent = profileCounts;
			      }
			
			      const parent = subCount.parentElement;
			
			      if (parent?.nodeName === "A") {
			        parent.title = subCount.textContent;
			      }
			    };
			
			    const onEvent = () => {
			      const subCount = document.getElementById("owner-sub-count");
			
			      if (!subCount) {
			        return;
			      }
			
			      const channelId =
			        document.getElementById("movie_player")?.["getPlayerResponse"]()?.[
			          "videoDetails"
			        ]?.["channelId"] || "";
			
			      let url = null;
			
			      if (channelId.startsWith("UC")) {
			        url = `/channel/${channelId}`;
			      } else if (channelId.startsWith("/@")) {
			        url = channelId;
			      } else {
			        return;
			      }
			
			      if (subCount.parentElement.nodeName !== "A") {
			        const link = document.createElement("a");
			
			        link.href = `${url}/videos`;
			        link.className = "yt-simple-endpoint";
			
			        subCount.parentElement.appendChild(link);
			        link.appendChild(subCount);
			      }
			
			      fetch(url).then((response) =>
			        response.text().then((data) => {
			          let matched = data.match(/var ytInitialData = (\{.*?});/)?.[1];
			
			          if (matched) {
			            try {
			              const pageData = JSON.parse(matched);
			              const metadataRows =
			                pageData?.header?.["pageHeaderRenderer"]?.["content"]?.[
			                  "pageHeaderViewModel"
			                ]?.["metadata"]?.["contentMetadataViewModel"]?.["metadataRows"];
			
			              if (
			                metadataRows?.constructor === Array &&
			                metadataRows.length > 0
			              ) {
			                for (let i = metadataRows.length - 1; i >= 0; i--) {
			                  const metadataParts = metadataRows[i]?.["metadataParts"];
			
			                  if (
			                    metadataParts?.constructor === Array &&
			                    metadataParts.length > 0
			                  ) {
			                    onVideoCountData(
			                      pageData,
			                      subCount,
			                      metadataParts
			                        .map((entry) => entry?.text?.content)
			                        ?.join(" ‧ "),
			                    );
			                    break;
			                  }
			                }
			              }
			            } catch (e) {}
			          }
			        }),
			      );
			    };
			
			    const update = () => {
			      if (iridiumSettings.videoCount) {
			        window.addEventListener("yt-page-data-updated", onEvent, true);
			        onEvent();
			      } else {
			        window.removeEventListener("yt-page-data-updated", onEvent, true);
			
			        const subCount = document.getElementById("owner-sub-count");
			        const link = subCount?.parentElement;
			
			        if (link?.nodeName === "A") {
			          link?.parentElement?.appendChild(subCount);
			          link?.remove();
			        }
			
			        if (subCount?.["textChanged_"] && subCount?.["text"]?.["simpleText"]) {
			          subCount["textChanged_"]?.({
			            runs: [{ text: subCount["text"]["simpleText"] }],
			          });
			        }
			      }
			    };
			
			    FeatureUpdater.register(SettingData.videoCount.id, update);
			
			    return {};
			  })();
			
			  const FeatureAmbientMode = (() => {
			    const created = (api) => {
			      api?.["updateCinematicSettings"]?.(iridiumSettings.ambientMode);
			    };
			
			    const update = () => {
			      if (iridiumSettings.ambientMode) {
			        document.documentElement.removeAttribute("ambient-mode-disabled");
			      } else {
			        document.documentElement.setAttribute("ambient-mode-disabled", "");
			      }
			
			      document
			        .getElementById("movie_player")
			        ?.["updateCinematicSettings"]?.(iridiumSettings.ambientMode);
			    };
			
			    FeatureUpdater.register(SettingData.ambientMode.id, update);
			
			    OverrideOnPlayerReady.onReadyListener(created);
			
			    return {};
			  })();
			
			  const FeatureInfoCards = (() => {
			    const listener = (data) => {
			      if (!iridiumSettings.infoCards) {
			        const cards = Util.getSingleObjectAndParentByKey(
			          data,
			          "cards",
			          (cards, _) => !!cards?.["cardCollectionRenderer"],
			        );
			        if (cards?.parent?.["cards"]) {
			          delete cards.parent["cards"];
			        }
			      }
			    };
			
			    OnYtPageDataFetched.addListener(listener);
			    OverrideFetch.onFetchListener(listener);
			    OverrideHandleResponse.onHandleResponseListener(listener);
			
			    return {};
			  })();
			
			  const FeatureEndScreen = (() => {
			    const update = () => {
			      if (iridiumSettings.endScreen) {
			        document.documentElement.classList.add("iridium-hide-end-screen-cards");
			      } else {
			        document.documentElement.classList.remove(
			          "iridium-hide-end-screen-cards",
			        );
			      }
			    };
			
			    FeatureUpdater.register(SettingData.endScreen.id, update);
			
			    return {
			      update: update,
			    };
			  })();
			
			  const FeatureLoudness = (() => {
			    const listener = (data) => {
			      if (!iridiumSettings.loudness) {
			        const audioConfig = Util.getSingleObjectByKey(data, "audioConfig");
			        const adaptiveFormats = Util.getSingleObjectByKey(
			          data,
			          "adaptiveFormats",
			        );
			
			        if (audioConfig && Object.hasOwn(audioConfig, "loudnessDb")) {
			          audioConfig["loudnessDb"] = 0;
			        }
			
			        if (adaptiveFormats) {
			          if (
			            adaptiveFormats.constructor === Array &&
			            adaptiveFormats.length > 0
			          ) {
			            for (let i = 0; i < adaptiveFormats.length; i++) {
			              if (adaptiveFormats[i]?.["loudnessDb"]) {
			                adaptiveFormats[i]["loudnessDb"] = 0;
			              }
			            }
			          }
			        }
			      }
			    };
			
			    OverrideFetch.onFetchListener(listener);
			    OverrideHandleResponse.onHandleResponseListener(listener);
			
			    return {};
			  })();
			
			  const FeatureHFRAllowed = (() => {
			    const listener = (data) => {
			      if (!iridiumSettings.hfrAllowed) {
			        const adaptiveFormats = Util.getSingleObjectByKey(
			          data,
			          "adaptiveFormats",
			        );
			
			        if (
			          adaptiveFormats?.constructor === Array &&
			          adaptiveFormats.length > 0
			        ) {
			          for (let i = adaptiveFormats.length - 1; i >= 0; i--) {
			            if (adaptiveFormats[i]?.["fps"] > 30) {
			              adaptiveFormats.splice(i, 1);
			            }
			          }
			        }
			      }
			    };
			
			    OverrideFetch.onFetchListener(listener);
			    OverrideHandleResponse.onHandleResponseListener(listener);
			
			    return {};
			  })();
			
			  const FeatureScrollVolume = (() => {
			    const iniScrollVolume = (event) => {
			      if (iridiumSettings.scrollVolumeShift && !event.shiftKey) {
			        return;
			      }
			
			      const ytdApp = document.querySelector("ytd-app");
			
			      if (ytdApp?.["isWatchPage"] !== true) {
			        return;
			      }
			
			      const api = document.getElementById("movie_player");
			
			      if (!api) {
			        return;
			      }
			
			      if (!iridiumSettings.scrollVolumeShift) {
			        const playerState = api["getPlayerState"]?.() || -1;
			
			        if (
			          !api.contains(event.target) ||
			          !(playerState > 0) ||
			          !(playerState < 5)
			        ) {
			          return;
			        }
			
			        const canScroll =
			          document
			            .querySelector(".ytp-playlist-menu")
			            ?.contains(event.target) === true ||
			          document.querySelector(".iv-drawer")?.contains(event.target) ===
			            true ||
			          document
			            .querySelector(".ytp-settings-menu")
			            ?.contains(event.target) === true;
			
			        if (canScroll) {
			          return;
			        }
			      }
			
			      event.preventDefault();
			
			      const direction = event.deltaY;
			      const oldVolume = api?.["getVolume"]?.() || 0;
			      const steps = Math.max(
			        1,
			        Math.min(iridiumSettings.scrollVolumeStep || 5, 10),
			      );
			      let newVolume = oldVolume - Math.sign(direction) * steps;
			
			      if (newVolume < 0) {
			        newVolume = 0;
			      } else if (newVolume > 100) {
			        newVolume = 100;
			      }
			
			      if (newVolume > oldVolume && api?.["isMuted"]?.() === true) {
			        api?.["unMute"]?.();
			      }
			
			      api?.["setVolume"]?.(newVolume, true);
			
			      let levelText = document.getElementById("iridium-scroll-volume-level");
			
			      if (!levelText) {
			        levelText = document.createElement("div");
			        levelText.id = "iridium-scroll-volume-level";
			      }
			
			      levelText.textContent = `${newVolume}%`;
			
			      let levelContainer = document.getElementById(
			        "iridium-scroll-volume-level-container",
			      );
			
			      if (!levelContainer) {
			        levelContainer = document.createElement("div");
			        levelContainer.id = "iridium-scroll-volume-level-container";
			        levelContainer.appendChild(levelText);
			        api.prepend(levelContainer);
			      } else {
			        levelContainer.style.display = "";
			      }
			
			      clearTimeout(levelContainer.timeoutId);
			
			      levelContainer.timeoutId = setTimeout(
			        () => (levelContainer.style.display = "none"),
			        1000,
			      );
			    };
			
			    const update = () => {
			      if (iridiumSettings.scrollVolume) {
			        document.addEventListener("wheel", iniScrollVolume, { passive: false });
			      } else {
			        document.removeEventListener("wheel", iniScrollVolume);
			      }
			    };
			
			    FeatureUpdater.register(SettingData.scrollVolume.id, update);
			
			    return {
			      update: update,
			    };
			  })();
			
			  const FeatureBlacklist = (() => {
			    const targetTags = [
			      "ytd-rich-item-renderer",
			      "ytd-video-renderer",
			      "ytd-grid-video-renderer",
			      "ytd-compact-video-renderer",
			    ];
			    const richGridPages = ["/", "/podcasts"];
			    const sectionListPages = ["/results", "/feed/trending", "/gaming"];
			    const removeItems = (data) => {
			      if (!data) {
			        return;
			      }
			
			      if (richGridPages.indexOf(window.location.pathname) > -1) {
			        const richGridRenderer = Util.getSingleObjectByKey(
			          data,
			          "richGridRenderer",
			        );
			        const itemContainer = richGridRenderer?.["contents"];
			
			        if (itemContainer?.constructor === Array && itemContainer.length > 0) {
			          for (let i = itemContainer.length - 1; i >= 0; i--) {
			            const richShelfRendererContents =
			              itemContainer[i]?.["richSectionRenderer"]?.["content"]?.[
			                "richShelfRenderer"
			              ]?.["contents"];
			
			            if (
			              richShelfRendererContents?.constructor === Array &&
			              richShelfRendererContents.length > 0
			            ) {
			              for (let j = richShelfRendererContents.length - 1; j >= 0; j--) {
			                const browseId =
			                  richShelfRendererContents[j]?.["richItemRenderer"]?.[
			                    "content"
			                  ]?.["videoRenderer"]?.["shortBylineText"]?.["runs"]?.[0]?.[
			                    "navigationEndpoint"
			                  ]?.["browseEndpoint"]?.["browseId"];
			
			                if (iridiumSettings.blacklist[browseId]) {
			                  richShelfRendererContents.splice(j, 1);
			                }
			              }
			
			              if (richShelfRendererContents.length === 0) {
			                itemContainer.splice(i, 1);
			              }
			            }
			
			            const browseId =
			              itemContainer[i]?.["richItemRenderer"]?.["content"]?.[
			                "videoRenderer"
			              ]?.["shortBylineText"]?.["runs"]?.[0]?.["navigationEndpoint"]?.[
			                "browseEndpoint"
			              ]?.["browseId"];
			
			            if (iridiumSettings.blacklist[browseId]) {
			              itemContainer.splice(i, 1);
			            }
			          }
			        }
			      } else if (Util.isWatchPage()) {
			        const secondaryResults = Util.getSingleObjectByKey(
			          data,
			          "secondaryResults",
			        );
			        const itemContainer =
			          secondaryResults?.["secondaryResults"]?.["results"];
			
			        if (itemContainer?.constructor === Array && itemContainer.length > 0) {
			          for (let i = itemContainer.length - 1; i >= 0; i--) {
			            const itemSectionRendererContents =
			              itemContainer[i]?.["itemSectionRenderer"]?.["contents"];
			
			            if (
			              itemSectionRendererContents?.constructor === Array &&
			              itemSectionRendererContents.length > 0
			            ) {
			              for (
			                let j = itemSectionRendererContents.length - 1;
			                j >= 0;
			                j--
			              ) {
			                const browseId =
			                  itemSectionRendererContents[j]?.["compactVideoRenderer"]?.[
			                    "shortBylineText"
			                  ]?.["runs"]?.[0]?.["navigationEndpoint"]?.[
			                    "browseEndpoint"
			                  ]?.["browseId"];
			
			                if (iridiumSettings.blacklist[browseId]) {
			                  itemSectionRendererContents.splice(j, 1);
			                }
			              }
			            }
			          }
			        }
			
			        const playerOverlays = Util.getSingleObjectByKey(
			          data,
			          "playerOverlays",
			        );
			        const endScreenRenderer =
			          playerOverlays?.["playerOverlayRenderer"]?.["endScreen"]?.[
			            "watchNextEndScreenRenderer"
			          ];
			        const endScreenRendererResults = endScreenRenderer?.["results"];
			
			        if (
			          endScreenRendererResults?.constructor === Array &&
			          endScreenRendererResults.length > 0
			        ) {
			          for (let i = endScreenRendererResults.length - 1; i >= 0; i--) {
			            const browseId =
			              endScreenRendererResults[i]?.["endScreenVideoRenderer"]?.[
			                "shortBylineText"
			              ]?.["runs"]?.[0]?.["navigationEndpoint"]?.["browseEndpoint"]?.[
			                "browseId"
			              ];
			
			            if (iridiumSettings.blacklist[browseId]) {
			              endScreenRendererResults.splice(i, 1);
			            }
			          }
			        }
			      } else if (sectionListPages.indexOf(window.location.pathname) > -1) {
			        const sectionListRenderer = Util.getSingleObjectByKey(
			          data,
			          "sectionListRenderer",
			        );
			        const itemContainer = sectionListRenderer?.["contents"];
			
			        if (itemContainer?.constructor === Array && itemContainer.length > 0) {
			          for (let i = itemContainer.length - 1; i >= 0; i--) {
			            const items =
			              itemContainer[i]?.["itemSectionRenderer"]?.["contents"] ||
			              itemContainer[i]?.["shelfRenderer"]?.["content"]?.[
			                "verticalListRenderer"
			              ]?.["items"];
			
			            if (items?.constructor === Array && items.length > 0) {
			              for (let j = items.length - 1; j >= 0; j--) {
			                const browseId =
			                  items[j]?.["channelRenderer"]?.["channelId"] ||
			                  items[j]?.["videoRenderer"]?.["ownerText"]?.["runs"]?.[0]?.[
			                    "navigationEndpoint"
			                  ]?.["browseEndpoint"]?.["browseId"];
			
			                if (iridiumSettings.blacklist[browseId]) {
			                  items.splice(j, 1);
			                }
			
			                const shelfRenderer = items[j]?.["shelfRenderer"];
			                const shelfRendererId =
			                  shelfRenderer?.["endpoint"]?.["browseEndpoint"]?.["browseId"];
			
			                if (iridiumSettings.blacklist[shelfRendererId]) {
			                  items.splice(j, 1);
			                } else {
			                  const shelfRendererContent = shelfRenderer?.["content"];
			                  const shelfItems =
			                    shelfRendererContent?.["verticalListRenderer"]?.["items"] ||
			                    shelfRendererContent?.["horizontalListRenderer"]?.[
			                      "items"
			                    ] ||
			                    shelfRendererContent?.["expandedShelfContentsRenderer"]?.[
			                      "items"
			                    ];
			
			                  if (
			                    shelfItems?.constructor === Array &&
			                    shelfItems.length > 0
			                  ) {
			                    for (let k = shelfItems.length - 1; k >= 0; k--) {
			                      const shelfItemId =
			                        shelfItems[k]?.["videoRenderer"]?.["ownerText"]?.[
			                          "runs"
			                        ]?.[0]?.["navigationEndpoint"]?.["browseEndpoint"]?.[
			                          "browseId"
			                        ];
			
			                      if (iridiumSettings.blacklist[shelfItemId]) {
			                        shelfItems.splice(k, 1);
			                      }
			                    }
			
			                    if (shelfItems.length === 0) {
			                      items.splice(j, 1);
			                    }
			                  }
			                }
			              }
			
			              if (items.length === 0) {
			                itemContainer.splice(i, 1);
			              }
			            }
			          }
			        }
			      }
			    };
			
			    const update = (data) => {
			      if (!iridiumSettings.blacklistEnabled) {
			        return;
			      }
			
			      if (data?.constructor !== Object || !data?.["responseContext"]) {
			        return;
			      }
			
			      removeItems(data);
			
			      const items = Array.from(document.querySelectorAll(targetTags.join(",")));
			
			      items.forEach((item) => {
			        const renderer =
			          item?.["data"]?.["content"]?.["videoRenderer"] || item?.["data"];
			        const browseId =
			          renderer?.["shortBylineText"]?.["runs"]?.[0]?.[
			            "navigationEndpoint"
			          ]?.["browseEndpoint"]?.["browseId"];
			
			        if (iridiumSettings.blacklist[browseId]) {
			          item.remove();
			        }
			      });
			
			      document.querySelector("ytd-rich-grid-renderer")?.["reflowContent"]?.();
			      document.querySelector("ytd-video-preview")?.["deactivate"]?.();
			    };
			
			    FeatureUpdater.register(SettingData.blacklist.id, () => {
			      update(document.querySelector("ytd-app")?.["data"]?.["response"]);
			    });
			
			    OnYtPageDataFetched.addListener(update);
			
			    return {
			      targetTags: targetTags,
			      update: update,
			      allowedRichGridPages: richGridPages,
			      allowedSectionListPages: sectionListPages,
			    };
			  })();
			
			  const FeatureBlacklistButton = (() => {
			    const update = () => {
			      document.querySelector("tp-yt-iron-dropdown")?.["close"]?.();
			
			      if (!iridiumSettings.blacklistButton) {
			        const menus = Array.from(
			          document.querySelectorAll("ytd-menu-renderer"),
			        );
			
			        menus.forEach((menu) => {
			          const items = menu?.["data"]?.["items"];
			          const backupItems = menu?.["__data"]?.["items"];
			
			          if (items?.constructor === Array) {
			            for (let i = items.length - 1; i >= 0; i--) {
			              if (
			                items[i]?.["menuServiceItemRenderer"]?.["id"] === "blockChannel"
			              ) {
			                items.splice(i, 1);
			              }
			            }
			          }
			
			          if (backupItems?.constructor === Array) {
			            for (let i = backupItems.length - 1; i >= 0; i--) {
			              if (
			                backupItems[i]?.["menuServiceItemRenderer"]?.["id"] ===
			                "blockChannel"
			              ) {
			                backupItems.splice(i, 1);
			              }
			            }
			          }
			        });
			      }
			    };
			
			    const onItemSelectedAction = (event) => {
			      const channelData = event.detail?.["args"]?.[0]?.["channelData"];
			      const channelUC = channelData?.["channelUC"];
			
			      if (!channelUC) {
			        return;
			      }
			
			      const channelName = channelData?.["channelName"];
			      const canonicalBaseUrl = channelData?.["canonicalBaseUrl"];
			
			      if (!channelName && !canonicalBaseUrl) {
			        return;
			      }
			
			      if (!iridiumSettings.blacklist[channelUC]) {
			        iridiumSettings.blacklist[channelUC] = {
			          name: channelName,
			          handle: canonicalBaseUrl,
			        };
			
			        Broadcaster.saveSetting(SettingData.blacklist.id);
			      }
			
			      FeatureBlacklist.update(
			        document.querySelector("ytd-app")?.["data"]?.["response"],
			      );
			    };
			
			    const iniBlacklistButton = (event) => {
			      if (
			        !iridiumSettings.blacklistEnabled ||
			        !iridiumSettings.blacklistButton
			      ) {
			        return;
			      }
			
			      if (
			        window.location.pathname !== "/" &&
			        !Util.isWatchPage() &&
			        FeatureBlacklist.allowedRichGridPages.indexOf(
			          window.location.pathname,
			        ) < 0 &&
			        FeatureBlacklist.allowedSectionListPages.indexOf(
			          window.location.pathname,
			        ) < 0
			      ) {
			        return;
			      }
			
			      if (
			        event.detail?.["actionName"] === "yt-menu-service-item-selected-action"
			      ) {
			        onItemSelectedAction(event);
			      }
			    };
			
			    const checkBlacklistButton = (data) => {
			      const hostElement = data?.["hostElement"];
			      const items = data?.["items"];
			
			      if (!hostElement || items?.constructor !== Array) {
			        return;
			      }
			
			      const parent = Array.from(
			        document.querySelectorAll(FeatureBlacklist.targetTags.join(",")),
			      ).find((item) => item.contains(hostElement));
			
			      if (!parent) {
			        for (let i = items.length - 1; i >= 0; i--) {
			          if (
			            items[i]?.["menuServiceItemRenderer"]?.["id"] === "blockChannel"
			          ) {
			            items.splice(i, 1);
			          }
			        }
			      } else if (
			        !items.some(
			          (item) =>
			            item?.["menuServiceItemRenderer"]?.["id"] === "blockChannel",
			        )
			      ) {
			        const renderer =
			          parent?.["data"]?.["content"]?.["videoRenderer"] || parent?.["data"];
			        const channelUC =
			          renderer?.["shortBylineText"]?.["runs"]?.[0]?.[
			            "navigationEndpoint"
			          ]?.["browseEndpoint"]?.["browseId"];
			
			        if (!channelUC) {
			          return;
			        }
			
			        const channelName = parent.querySelector(
			          "yt-formatted-string.ytd-channel-name",
			        )?.title;
			        const canonicalBaseUrl = Util.getSingleObjectByKey(
			          parent.data,
			          "canonicalBaseUrl",
			        );
			
			        if (!channelName && !canonicalBaseUrl) {
			          return;
			        }
			
			        items.unshift({
			          menuServiceItemRenderer: {
			            id: "blockChannel",
			            channelData: {
			              channelUC: channelUC,
			              channelName: channelName,
			              canonicalBaseUrl: canonicalBaseUrl,
			            },
			            hasSeparator: true,
			            text: { runs: [{ text: "Block channel" }] },
			            icon: { iconType: "CANCEL" },
			          },
			        });
			      }
			    };
			
			    const onOverflowTapKey = crypto.randomUUID();
			
			    Object.defineProperty(Object.prototype, "onOverflowTap", {
			      set(data) {
			        this[onOverflowTapKey] = data;
			      },
			      get() {
			        if (
			          iridiumSettings.blacklistEnabled &&
			          iridiumSettings.blacklistButton
			        ) {
			          checkBlacklistButton(this);
			        }
			        return this[onOverflowTapKey]?.apply(this, arguments);
			      },
			    });
			
			    FeatureUpdater.register(SettingData.blacklistButton.id, update);
			
			    document.documentElement.addEventListener(
			      "yt-action",
			      iniBlacklistButton,
			      false,
			    );
			
			    return {
			      update: update,
			    };
			  })();
			
			  // end features
			}
			// END: js/background-inject.js
			
			// START: js/content-script.js
			
			
			const channel = new BroadcastChannel(browser.runtime.id);
			let port = null;
			
			const validContext = () => {
			
			    const isValid = !!browser.runtime?.id;
			
			    if (!isValid) {
			        channel.removeEventListener("message", channelListener);
			        channel.close();
			    }
			
			    return isValid;
			
			};
			
			const channelListener = message => {
			
			    if (!validContext()) {
			        return;
			    }
			
			    if (message?.data?.type === "setting") {
			        saveSettings(message?.data?.payload).then();
			    } else if (message?.data?.type === "action") {
			        portMessage(message?.data);
			    }
			
			};
			
			const portMessage = data => {
			
			    if (!data) {
			        return;
			    }
			
			    if (!validContext()) {
			        return;
			    }
			
			    if (!port) {
			        port = browser.runtime.connect(browser.runtime.id);
			        port?.onDisconnect?.addListener(() => port = null);
			    }
			
			    port?.postMessage(data);
			
			};
			
			const saveSettings = async data => {
			
			    if (!data) {
			        return;
			    }
			
			    if (!validContext()) {
			        return;
			    }
			
			    const dataSync = await browser.storage.sync.get();
			
			    if (dataSync?.[SettingData.syncSettings.id] === true) {
			        await browser.storage.sync.set(data);
			    } else {
			        await browser.storage.local.set(data);
			    }
			
			};
			
			const onStorageChanged = changes => {
			
			    if (!validContext()) {
			        return;
			    }
			
			    const changeData = {};
			
			    for (let key in changes) {
			
			        const change = changes[key];
			
			        if (change.newValue !== change.oldValue) {
			            changeData[key] = change.newValue;
			        }
			
			    }
			
			    if (Object.keys(changeData).length > 0) {
			
			        channel.postMessage(changeData);
			
			        // check if user switched storage areas
			        if (Object.hasOwn(changeData, SettingData.syncSettings.id)) {
			            if (changeData[SettingData.syncSettings.id] === true) {
			                browser.storage.local.onChanged.removeListener(onStorageChanged);
			                browser.storage.sync.onChanged.addListener(onStorageChanged);
			            } else {
			                browser.storage.sync.onChanged.removeListener(onStorageChanged);
			                browser.storage.local.onChanged.addListener(onStorageChanged);
			            }
			        }
			
			    }
			
			};
			
			const checkNewFeatures = async settings => {
			
			    const newFeatures = {};
			
			    for (let key in SettingData) {
			        if (!Object.hasOwn(settings, key)) {
			            settings[key] = newFeatures[key] = SettingData[key].default;
			        }
			    }
			
			    if (Object.keys(newFeatures).length > 0) {
			        if (settings[SettingData.syncSettings.id] === true) {
			            await browser.storage.sync.set(newFeatures);
			        } else {
			            await browser.storage.local.set(newFeatures);
			        }
			    }
			
			    return settings;
			
			};
			
			const getSettings = async () => {
			
			    const dataSync = await browser.storage.sync.get();
			
			    if (dataSync?.[SettingData.syncSettings.id] === true) {
			        return await checkNewFeatures(dataSync);
			    }
			
			    const dataLocal = await browser.storage.local.get();
			
			    // storage will be empty during first installation
			    // this ensures the first load stores the default settings
			    if (Object.keys(dataLocal).length === 0) {
			        const defaultSettings = getDefaultSettings();
			        await browser.storage.local.set(defaultSettings);
			        return defaultSettings;
			    }
			
			    return await checkNewFeatures(dataLocal);
			
			};
			
			channel.addEventListener("message", channelListener);
			
			browser.storage.sync.get().then(dataSync => {
			    if (dataSync?.[SettingData.syncSettings.id] === true) {
			        browser.storage.sync.onChanged.addListener(onStorageChanged);
			    } else {
			        browser.storage.local.onChanged.addListener(onStorageChanged);
			    }
			});
			
			getSettings().then(settings => channel.postMessage(settings));
			
			if (!document.getElementById("iridium-inject")) {
			    const script = document.createElement("script");
			    script.id = "iridium-inject";
			    script.textContent = `(${mainScript}("${browser.runtime.id}",${JSON.stringify(SettingData)},${JSON.stringify(getDefaultSettings())}))`;
			    document.documentElement.appendChild(script);
			}
			// END: js/content-script.js
			;}
			   } catch(e) { _error(`  Error executing scripts ${scriptPaths}`, e); }
			  
			  } else {
			      _log(`Skipping document-start phase (no document).`);
			  }
			
			  /*
  // #endregion
  // #region Wait for Document End DOMContentLoaded ---
			  if (typeof document !== 'undefined' && document.readyState === 'loading') {
			    _log(`Waiting for DOMContentLoaded...`);
			    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
			    _log(`DOMContentLoaded fired.`);
			  } else if (typeof document !== 'undefined') {
			    _log(`DOMContentLoaded already passed or not applicable.`);
			  }
			  */
			
  // #endregion
  // #region Document End
			   if (typeof document !== 'undefined') {
			    _log(`Executing document-end phase...`);
			    
			    const scriptPaths = [];
			   _log(`  Executing JS (end): ${scriptPaths}`);
			
			   try {
			       // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
			      with (globalThis){;
			
			;}
			   } catch(e) { _error(`  Error executing scripts ${scriptPaths}`, e); }
			  
			  } else {
			      _log(`Skipping document-end phase (no document).`);
			  }
			
			  
  // #endregion
  // #region Wait for Document Idle
			  _log(`Waiting for document idle state...`);
			  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
			      await new Promise(resolve => window.requestIdleCallback(resolve, { timeout: 2000 })); // 2-second timeout fallback
			      _log(`requestIdleCallback fired or timed out.`);
			  } else {
			      // Fallback: wait a short period after DOMContentLoaded/current execution if requestIdleCallback is unavailable
			      await new Promise(resolve => setTimeout(resolve, 50));
			      _log(`Idle fallback timer completed.`);
			  }
			  
			
  // #endregion
  // #region Document Idle
			   if (typeof document !== 'undefined') {
			    _log(`Executing document-idle phase...`);
			    
			    const scriptPaths = [];
			   _log(`  Executing JS (idle): ${scriptPaths}`);
			
			   try {
			       // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
			      with (globalThis){;
			
			;}
			   } catch(e) { _error(`  Error executing scripts ${scriptPaths}`, e); }
			  
			  } else {
			      _log(`Skipping document-idle phase (no document).`);
			  }
			
			  _log(`All execution phases complete, re-firing load events.`);
			  document.dispatchEvent(new Event("DOMContentLoaded", {
			    bubbles: true,
			    cancelable: true
			  }));
			}
			
			
  // #endregion
// #region Event Listener No changes needed here ---
			window.addEventListener("message", (event) => {
			    if (event.data.type === "openOptionsPage") {
			        openOptionsPage();
			    }
			    if (event.data.type === "openPopupPage") {
			        openPopupPage();
			    }
			    if (event.data.type === "closeOptionsPage") {
			        closeOptionsModal();
			    }
			    if (event.data.type === "closePopupPage") {
			        closePopupModal();
			    }
			});
			
			
// #endregion
// #region Refactored Modal Closing Functions Promise-based ---
			
			function closeOptionsModal() {
			    return new Promise(resolve => {
			        const DURATION = 100;
			        const backdrop = document.getElementById('extension-options-backdrop');
			        const modal = document.getElementById('extension-options-modal');
			
			        if (!backdrop || !modal) {
			            return resolve();
			        }
			
			        modal.style.animation = `modalCloseAnimation ${DURATION / 1000}s ease-out forwards`;
			        backdrop.style.animation = `backdropFadeOut ${DURATION / 1000}s ease-out forwards`;
			
			        setTimeout(() => {
			            if (confirm('Close options and reload the page?')) {
			                window.location.reload(); // Note: This will stop further execution
			            } else {
			                backdrop.remove();
			            }
			            resolve();
			        }, DURATION);
			    });
			}
			
			function closePopupModal() {
			    return new Promise(resolve => {
			        const DURATION = 100;
			        const backdrop = document.getElementById('extension-popup-backdrop');
			        const modal = document.getElementById('extension-popup-modal');
			
			        if (!backdrop || !modal) {
			            return resolve();
			        }
			
			        modal.style.animation = `modalCloseAnimation ${DURATION / 1000}s ease-out forwards`;
			        backdrop.style.animation = `backdropFadeOut ${DURATION / 1000}s ease-out forwards`;
			
			        setTimeout(() => {
			            backdrop.remove();
			            resolve();
			        }, DURATION);
			    });
			}
			
			
// #endregion
// #region Simplified Public API Functions ---
			
			async function openPopupPage() {
			    if (!POPUP_PAGE_PATH || typeof EXTENSION_ASSETS_MAP === 'undefined') {
			        _warn('No popup page available.');
			        return;
			    }
			    await openModal({
			        type: 'popup',
			        pagePath: POPUP_PAGE_PATH,
			        defaultTitle: 'Extension Popup',
			        closeFn: closePopupModal
			    });
			}
			
			async function openOptionsPage() {
			    if (!OPTIONS_PAGE_PATH || typeof EXTENSION_ASSETS_MAP === 'undefined') {
			        _warn('No options page available.');
			        return;
			    }
			    await openModal({
			        type: 'options',
			        pagePath: OPTIONS_PAGE_PATH,
			        defaultTitle: 'Extension Options',
			        closeFn: closeOptionsModal
			    });
			}
			
			
// #endregion
// #region Generic Modal Logic Style Injection ---
			
			let stylesInjected = false;
			function injectGlobalStyles() {
			    if (stylesInjected) return;
			    stylesInjected = true;
			
			    const styles = `
			        .extension-backdrop {
			            position: fixed;
			            top: 0; left: 0;
			            width: 100vw; height: 100vh;
			            background: rgba(0, 0, 0, 0.13);
			            backdrop-filter: blur(3px);
			            z-index: 2147483646;
			            display: flex;
			            align-items: center;
			            justify-content: center;
			            animation: backdropFadeIn 0.3s ease-out forwards;
			        }
			
			        .extension-modal {
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
			
			        /* Size specific styles */
			        .extension-modal.popup-size {
			            width: 400px; height: 600px;
			            max-width: calc(100vw - 40px);
			            max-height: calc(100vh - 40px);
			        }
			        .extension-modal.options-size {
			            width: calc(100vw - 80px); height: calc(100vh - 80px);
			            max-width: 1200px;
			            max-height: 800px;
			        }
			
			        /* Common modal components */
			        .extension-modal .modal-header {
			            display: flex; justify-content: space-between; align-items: flex-end;
			            padding: 0 16px; position: relative; flex-shrink: 0;
			        }
			        .extension-modal .tab {
			            padding: 12px 16px; color: #606266;
			            display: flex; align-items: center; gap: 8px;
			            font-size: 14px; cursor: pointer;
			            border-radius: var(--rad) var(--rad) 0 0;
			            transition: background-color 0.2s ease; user-select: none;
			        }
			        .extension-modal .tab.active, .extension-modal .tab.close-button {
			            background-color: var(--background);
			            border: var(--border-thickness) solid var(--border);
			            border-bottom-color: var(--background);
			            margin-bottom: -1px; z-index: 1;
			            color: #303133; font-weight: 500;
			        }
			        .extension-modal .tab.close-button { padding: 8px; }
			        .extension-modal .tab.close-button:hover { background-color: #f5f7fa; }
			        .extension-modal .tab svg { stroke: currentColor; }
			        .extension-modal .tab.active img { width: 16px; height: 16px; }
			        .extension-modal .tab.close-button svg { width: 20px; height: 20px; }
			
			        .extension-modal .modal-content {
			            flex-grow: 1; position: relative;
			            border-radius: var(--rad); overflow: hidden;
			            bottom: calc(var(--border-thickness) - 1px);
			            border: var(--border-thickness) solid var(--border);
			        }
			        .extension-modal .modal-content iframe {
			            width: 100%; height: 100%; border: 0; background: white;
			        }
			
			        /* Animations */
			        @keyframes backdropFadeIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(3px); } }
			        @keyframes backdropFadeOut { from { opacity: 1; backdrop-filter: blur(3px); } to { opacity: 0; backdrop-filter: blur(0px); } }
			        @keyframes modalOpenAnimation { from { transform: scaleY(0.8); opacity: 0; } to { transform: scaleY(1); opacity: 1; } }
			        @keyframes modalCloseAnimation { from { transform: scaleY(1); opacity: 1; } to { transform: scaleY(0.8); opacity: 0; } }
			    `;
			    const styleSheet = document.createElement("style");
			    styleSheet.id = "extension-global-styles";
			    styleSheet.innerText = styles;
			    document.head.appendChild(styleSheet);
			}
			
			async function openModal(config) {
			    injectGlobalStyles();
			
			    const { type, pagePath, defaultTitle, closeFn } = config;
			    const html = EXTENSION_ASSETS_MAP[pagePath];
			    if (!html) {
			        _warn(`${defaultTitle} HTML not found in asset map`);
			        return;
			    }
			
			    const backdropId = `extension-${type}-backdrop`;
			    const modalId = `extension-${type}-modal`;
			    const sizeClass = `${type}-size`;
			
// #endregion
    // #region Smoothly close the other modal if it s open ---
			    const otherType = type === 'popup' ? 'options' : 'popup';
			    const otherBackdrop = document.getElementById(`extension-${otherType}-backdrop`);
			    if (otherBackdrop) {
			        // Await the correct close function
			        await (otherType === 'popup' ? closePopupModal() : closeOptionsModal());
			    }
			
			    let backdrop = document.getElementById(backdropId);
			    let modal, iframe;
			
			    if (!backdrop) {
			        backdrop = document.createElement('div');
			        backdrop.id = backdropId;
			        backdrop.className = 'extension-backdrop';
			
			        modal = document.createElement('div');
			        modal.id = modalId;
			        modal.className = `extension-modal ${sizeClass}`;
			
			        const extensionName = INJECTED_MANIFEST.name || defaultTitle;
			        const iconSrc = EXTENSION_ICON || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik00IDdoM2ExIDEgMCAwIDAgMSAtMXYtMWEyIDIgMCAwIDEgNCAwdjFhMSAxIDAgMCAwIDEgMWgzYTEgMSAwIDAgMSAxIDF2M2ExIDEgMCAwIDAgMSAxaDFhMiAyIDAgMCAxIDAgNGgtMWExIDEgMCAwIDAgLTEgMXYzYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtMWEyIDIgMCAwIDAgLTQgMHYxYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMWgxYTIgMiAwIDAgMCAwIC00aC0xYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMSIgLz48L3N2Zz4=';
			
			        modal.innerHTML = `
			            <div class="modal-header">
			                <div class="tab active">
			                    <img src="${iconSrc}" onerror="this.style.display='none'">
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
			            if (e.target === backdrop) closeFn();
			        });
			        modal.querySelector('.close-button').addEventListener('click', closeFn);
			        
			        document.body.appendChild(backdrop);
			        iframe = modal.querySelector('iframe');
			
			    } else {
			        // If it already exists, just make sure it's visible
			        backdrop.style.display = 'flex';
			        modal = backdrop.querySelector('.extension-modal');
			        iframe = modal.querySelector('iframe');
			    }
			
			    // Load content into iframe
			    try {
			        const polyfillString = generateCompletePolyfillForIframe();
			        const doc = new DOMParser().parseFromString(html, 'text/html');
			        const script = doc.createElement('script');
			        script.textContent = polyfillString;
			        doc.head.insertAdjacentElement("afterbegin", script);
			        iframe.srcdoc = doc.documentElement.outerHTML;
			    } catch (e) {
			        _error('Error generating complete polyfill for iframe', e);
			        iframe.srcdoc = html;
			    }
			}
			
			function generateCompletePolyfillForIframe() {
			    const polyfillString = "\n// -- Messaging implementation\n\nfunction createEventBus(\n  scopeId,\n  type = \"page\", // \"page\" or \"iframe\"\n  { allowedOrigin = \"*\", children = [], parentWindow = null } = {}\n) {\n  if (!scopeId) throw new Error(\"createEventBus requires a scopeId\");\n\n  const handlers = {};\n\n  function handleIncoming(ev) {\n    if (allowedOrigin !== \"*\" && ev.origin !== allowedOrigin) return;\n\n    const msg = ev.data;\n    if (!msg || msg.__eventBus !== true || msg.scopeId !== scopeId) return;\n\n    const { event, payload } = msg;\n\n    // PAGE: if it's an INIT from an iframe, adopt it\n    if (type === \"page\" && event === \"__INIT__\") {\n      const win = ev.source;\n      if (win && !children.includes(win)) {\n        children.push(win);\n      }\n      return;\n    }\n\n    (handlers[event] || []).forEach((fn) =>\n      fn(payload, { origin: ev.origin, source: ev.source })\n    );\n  }\n\n  window.addEventListener(\"message\", handleIncoming);\n\n  function emitTo(win, event, payload) {\n    const envelope = {\n      __eventBus: true,\n      scopeId,\n      event,\n      payload,\n    };\n    win.postMessage(envelope, allowedOrigin);\n  }\n\n  // IFRAME: announce to page on startup\n  if (type === \"iframe\") {\n    setTimeout(() => {\n      const pw = parentWindow || window.parent;\n      if (pw && pw.postMessage) {\n        emitTo(pw, \"__INIT__\", null);\n      }\n    }, 0);\n  }\n\n  return {\n    on(event, fn) {\n      handlers[event] = handlers[event] || [];\n      handlers[event].push(fn);\n    },\n    off(event, fn) {\n      if (!handlers[event]) return;\n      handlers[event] = handlers[event].filter((h) => h !== fn);\n    },\n    /**\n     * Emits an event.\n     * @param {string} event - The event name.\n     * @param {any} payload - The event payload.\n     * @param {object} [options] - Emission options.\n     * @param {Window} [options.to] - A specific window to target. If provided, message is ONLY sent to the target.\n     */\n    emit(event, payload, { to } = {}) {\n      // If a specific target window is provided, send only to it and DO NOT dispatch locally.\n      // This prevents a port from receiving its own messages.\n      if (to) {\n        if (to && typeof to.postMessage === \"function\") {\n          emitTo(to, event, payload);\n        }\n        return; // Exit after targeted send.\n      }\n\n      // For broadcast messages (no 'to' target), dispatch locally first.\n      (handlers[event] || []).forEach((fn) =>\n        fn(payload, { origin: location.origin, source: window })\n      );\n\n      // Then propagate the broadcast to other windows.\n      if (type === \"page\") {\n        children.forEach((win) => emitTo(win, event, payload));\n      } else {\n        const pw = parentWindow || window.parent;\n        if (pw && pw.postMessage) {\n          emitTo(pw, event, payload);\n        }\n      }\n    },\n  };\n}\n\nfunction createRuntime(type = \"background\", bus) {\n  let nextId = 1;\n  const pending = {};\n  const msgListeners = [];\n\n  let nextPortId = 1;\n  const ports = {};\n  const onConnectListeners = [];\n\n  function parseArgs(args) {\n    let target, message, options, callback;\n    const arr = [...args];\n    if (arr.length === 0) {\n      throw new Error(\"sendMessage requires at least one argument\");\n    }\n    if (arr.length === 1) {\n      return { message: arr[0] };\n    }\n    // last object could be options\n    if (\n      arr.length &&\n      typeof arr[arr.length - 1] === \"object\" &&\n      !Array.isArray(arr[arr.length - 1])\n    ) {\n      options = arr.pop();\n    }\n    // last function is callback\n    if (arr.length && typeof arr[arr.length - 1] === \"function\") {\n      callback = arr.pop();\n    }\n    if (\n      arr.length === 2 &&\n      (typeof arr[0] === \"string\" || typeof arr[0] === \"number\")\n    ) {\n      [target, message] = arr;\n    } else {\n      [message] = arr;\n    }\n    return { target, message, options, callback };\n  }\n\n  if (type === \"background\") {\n    bus.on(\"__REQUEST__\", ({ id, message }, { source }) => {\n      let responded = false,\n        isAsync = false;\n      function sendResponse(resp) {\n        if (responded) return;\n        responded = true;\n        // Target the response directly back to the window that sent the request.\n        bus.emit(\"__RESPONSE__\", { id, response: resp }, { to: source });\n      }\n      const results = msgListeners\n        .map((fn) => {\n          try {\n            // msg, sender, sendResponse\n            const ret = fn(message, { id, tab: { id: source } }, sendResponse);\n            if (ret === true || (ret && typeof ret.then === \"function\")) {\n              isAsync = true;\n              return ret;\n            }\n            return ret;\n          } catch (e) {\n            _error(e);\n          }\n        })\n        .filter((r) => r !== undefined);\n\n      const promises = results.filter((r) => r && typeof r.then === \"function\");\n      if (!isAsync && promises.length === 0) {\n        const out = results.length === 1 ? results[0] : results;\n        sendResponse(out);\n      } else if (promises.length) {\n        Promise.all(promises).then((vals) => {\n          if (!responded) {\n            const out = vals.length === 1 ? vals[0] : vals;\n            sendResponse(out);\n          }\n        });\n      }\n    });\n  }\n\n  if (type !== \"background\") {\n    bus.on(\"__RESPONSE__\", ({ id, response }) => {\n      const entry = pending[id];\n      if (!entry) return;\n      entry.resolve(response);\n      if (entry.callback) entry.callback(response);\n      delete pending[id];\n    });\n  }\n\n  function sendMessage(...args) {\n    // Background should be able to send message to itself\n    // if (type === \"background\") {\n    //   throw new Error(\"Background cannot sendMessage to itself\");\n    // }\n    const { target, message, callback } = parseArgs(args);\n    const id = nextId++;\n    const promise = new Promise((resolve) => {\n      pending[id] = { resolve, callback };\n      bus.emit(\"__REQUEST__\", { id, message });\n    });\n    return promise;\n  }\n\n  bus.on(\"__PORT_CONNECT__\", ({ portId, name }, { source }) => {\n    if (type !== \"background\") return;\n    const backgroundPort = makePort(\"background\", portId, name, source);\n    ports[portId] = backgroundPort;\n\n    onConnectListeners.forEach((fn) => fn(backgroundPort));\n\n    // send back a CONNECT_ACK so the client can\n    // start listening on its end:\n    bus.emit(\"__PORT_CONNECT_ACK__\", { portId, name }, { to: source });\n  });\n\n  // Clients handle the ACK and finalize their Port object by learning the remote window.\n  bus.on(\"__PORT_CONNECT_ACK__\", ({ portId, name }, { source }) => {\n    if (type === \"background\") return; // ignore\n    const p = ports[portId];\n    if (!p) return;\n    // Call the port's internal finalize method to complete the handshake\n    if (p._finalize) {\n      p._finalize(source);\n    }\n  });\n\n  // Any port message travels via \"__PORT_MESSAGE__\"\n  bus.on(\"__PORT_MESSAGE__\", (envelope, { source }) => {\n    const { portId } = envelope;\n    const p = ports[portId];\n    if (!p) return;\n    p._receive(envelope, source);\n  });\n\n  // Any port disconnect:\n  bus.on(\"__PORT_DISCONNECT__\", ({ portId }) => {\n    const p = ports[portId];\n    if (!p) return;\n    p._disconnect();\n    delete ports[portId];\n  });\n\n  // Refactored makePort to correctly manage internal state and the connection handshake.\n  function makePort(side, portId, name, remoteWindow) {\n    let onMessageHandlers = [];\n    let onDisconnectHandlers = [];\n    let buffer = [];\n    // Unique instance ID for this port instance\n    const instanceId = Math.random().toString(36).slice(2) + Date.now();\n    // These state variables are part of the closure and are updated by _finalize\n    let _ready = side === \"background\";\n\n    function _drainBuffer() {\n      buffer.forEach((m) => _post(m));\n      buffer = [];\n    }\n\n    function _post(msg) {\n      // Always use the 'to' parameter for port messages, making them directional.\n      // Include senderInstanceId\n      bus.emit(\n        \"__PORT_MESSAGE__\",\n        { portId, msg, senderInstanceId: instanceId },\n        { to: remoteWindow }\n      );\n    }\n\n    function postMessage(msg) {\n      if (!_ready) {\n        buffer.push(msg);\n      } else {\n        _post(msg);\n      }\n    }\n\n    function _receive(envelope, source) {\n      // envelope: { msg, senderInstanceId }\n      if (envelope.senderInstanceId === instanceId) return; // Don't dispatch to self\n      onMessageHandlers.forEach((fn) =>\n        fn(envelope.msg, { id: portId, tab: { id: source } })\n      );\n    }\n\n    function disconnect() {\n      // Also use the 'to' parameter for disconnect messages\n      bus.emit(\"__PORT_DISCONNECT__\", { portId }, { to: remoteWindow });\n      _disconnect();\n      delete ports[portId];\n    }\n\n    function _disconnect() {\n      onDisconnectHandlers.forEach((fn) => fn());\n      onMessageHandlers = [];\n      onDisconnectHandlers = [];\n    }\n\n    // This function is called on the client port when the ACK is received from background.\n    // It updates the port's state, completing the connection.\n    function _finalize(win) {\n      remoteWindow = win; // <-- This is the crucial part: learn the destination\n      _ready = true;\n      _drainBuffer();\n    }\n\n    return {\n      name,\n      sender: {\n        id: portId,\n      },\n      onMessage: {\n        addListener(fn) {\n          onMessageHandlers.push(fn);\n        },\n        removeListener(fn) {\n          onMessageHandlers = onMessageHandlers.filter((x) => x !== fn);\n        },\n      },\n      onDisconnect: {\n        addListener(fn) {\n          onDisconnectHandlers.push(fn);\n        },\n        removeListener(fn) {\n          onDisconnectHandlers = onDisconnectHandlers.filter((x) => x !== fn);\n        },\n      },\n      postMessage,\n      disconnect,\n      // Internal methods used by the runtime\n      _receive,\n      _disconnect,\n      _finalize, // Expose the finalizer for the ACK handler\n    };\n  }\n\n  function connect(connectInfo = {}) {\n    if (type === \"background\") {\n      throw new Error(\"Background must use onConnect, not connect()\");\n    }\n    const name = connectInfo.name || \"\";\n    const portId = nextPortId++;\n    // create the client side port\n    // remoteWindow is initially null; it will be set by _finalize upon ACK.\n    const clientPort = makePort(\"client\", portId, name, null);\n    ports[portId] = clientPort;\n\n    // fire the connect event across the bus\n    bus.emit(\"__PORT_CONNECT__\", { portId, name });\n    return clientPort;\n  }\n\n  function onConnect(fn) {\n    if (type !== \"background\") {\n      throw new Error(\"connect event only fires in background\");\n    }\n    onConnectListeners.push(fn);\n  }\n\n  return {\n    // rpc:\n    sendMessage,\n    onMessage: {\n      addListener(fn) {\n        msgListeners.push(fn);\n      },\n      removeListener(fn) {\n        const i = msgListeners.indexOf(fn);\n        if (i >= 0) msgListeners.splice(i, 1);\n      },\n    },\n\n    // port API:\n    connect,\n    onConnect: {\n      addListener(fn) {\n        onConnect(fn);\n      },\n      removeListener(fn) {\n        const i = onConnectListeners.indexOf(fn);\n        if (i >= 0) onConnectListeners.splice(i, 1);\n      },\n    },\n  };\n}\n\n\n// --- Abstraction Layer: PostMessage Target\n\nlet nextRequestId = 1;\nconst pendingRequests = new Map(); // requestId -> { resolve, reject, timeout }\n\nfunction sendAbstractionRequest(method, args = []) {\n  return new Promise((resolve, reject) => {\n    const requestId = nextRequestId++;\n\n    const timeout = setTimeout(() => {\n      pendingRequests.delete(requestId);\n      reject(new Error(`PostMessage request timeout for method: ${method}`));\n    }, 10000);\n\n    pendingRequests.set(requestId, { resolve, reject, timeout });\n\n    window.parent.postMessage({\n      type: \"abstraction-request\",\n      requestId,\n      method,\n      args,\n    });\n  });\n}\n\nwindow.addEventListener(\"message\", (event) => {\n  const { type, requestId, success, result, error } = event.data;\n\n  if (type === \"abstraction-response\") {\n    const pending = pendingRequests.get(requestId);\n    if (pending) {\n      clearTimeout(pending.timeout);\n      pendingRequests.delete(requestId);\n\n      if (success) {\n        pending.resolve(result);\n      } else {\n        const err = new Error(error.message);\n        err.stack = error.stack;\n        pending.reject(err);\n      }\n    }\n  }\n});\n\nasync function _storageSet(items) {\n  return sendAbstractionRequest(\"_storageSet\", [items]);\n}\n\nasync function _storageGet(keys) {\n  return sendAbstractionRequest(\"_storageGet\", [keys]);\n}\n\nasync function _storageRemove(keysToRemove) {\n  return sendAbstractionRequest(\"_storageRemove\", [keysToRemove]);\n}\n\nasync function _storageClear() {\n  return sendAbstractionRequest(\"_storageClear\");\n}\n\nasync function _cookieList(details) {\n  return sendAbstractionRequest(\"_cookieList\", [details]);\n}\n\nasync function _cookieSet(details) {\n  return sendAbstractionRequest(\"_cookieSet\", [details]);\n}\n\nasync function _cookieDelete(details) {\n  return sendAbstractionRequest(\"_cookieDelete\", [details]);\n}\n\nasync function _fetch(url, options) {\n  return sendAbstractionRequest(\"_fetch\", [url, options]);\n}\n\nfunction _registerMenuCommand(name, func) {\n  _warn(\"_registerMenuCommand called from iframe context:\", name);\n  return sendAbstractionRequest(\"_registerMenuCommand\", [\n    name,\n    func.toString(),\n  ]);\n}\n\nfunction _openTab(url, active) {\n  return sendAbstractionRequest(\"_openTab\", [url, active]);\n}\n\nasync function _initStorage() {\n  return sendAbstractionRequest(\"_initStorage\");\n}\n\n\nconst EXTENSION_ASSETS_MAP = {{EXTENSION_ASSETS_MAP}};\n\n// -- Polyfill Implementation\nfunction buildPolyfill({ isBackground = false, isOtherPage = false } = {}) {\n  // Generate a unique context ID for this polyfill instance\n  const contextType = isBackground\n    ? \"background\"\n    : isOtherPage\n      ? \"options\"\n      : \"content\";\n  const contextId = `${contextType}_${Math.random()\n    .toString(36)\n    .substring(2, 15)}`;\n\n  const IS_IFRAME = \"true\" === \"true\";\n  const BUS = (function () {\n    if (globalThis.__BUS) {\n      return globalThis.__BUS;\n    }\n    globalThis.__BUS = createEventBus(\n      \"iridium-for-youtube\",\n      IS_IFRAME ? \"iframe\" : \"page\"\n    );\n    return globalThis.__BUS;\n  })();\n  const RUNTIME = createRuntime(isBackground ? \"background\" : \"tab\", BUS);\n  const createNoopListeners = () => ({\n    addListener: (callback) => {\n      _log(\"addListener\", callback);\n    },\n    removeListener: (callback) => {\n      _log(\"removeListener\", callback);\n    },\n  });\n  // TODO: Stub\n  const storageChangeListeners = new Set();\n  function broadcastStorageChange(changes, areaName) {\n    storageChangeListeners.forEach((listener) => {\n      listener(changes, areaName);\n    });\n  }\n\n  let REQ_PERMS = [];\n\n  // --- Chrome polyfill\n  let chrome = {\n    extension: {\n      isAllowedIncognitoAccess: () => Promise.resolve(true),\n      sendMessage: (...args) => _messagingHandler.sendMessage(...args),\n    },\n    permissions: {\n      // TODO: Remove origin permission means exclude from origin in startup\n      request: (permissions, callback) => {\n        _log(\"permissions.request\", permissions, callback);\n        if (Array.isArray(permissions)) {\n          REQ_PERMS = [...REQ_PERMS, ...permissions];\n        }\n        if (typeof callback === \"function\") {\n          callback(permissions);\n        }\n        return Promise.resolve(permissions);\n      },\n      contains: (permissions, callback) => {\n        if (typeof callback === \"function\") {\n          callback(true);\n        }\n        return Promise.resolve(true);\n      },\n      getAll: () => {\n        return Promise.resolve({\n          permissions: EXTENSION_PERMISSIONS,\n          origins: ORIGIN_PERMISSIONS,\n        });\n      },\n      onAdded: createNoopListeners(),\n      onRemoved: createNoopListeners(),\n    },\n    i18n: {\n      getUILanguage: () => {\n        return USED_LOCALE || \"en\";\n      },\n      getMessage: (key, substitutions = []) => {\n        if (typeof substitutions === \"string\") {\n          substitutions = [substitutions];\n        }\n        if (typeof LOCALE_KEYS !== \"undefined\" && LOCALE_KEYS[key]) {\n          return LOCALE_KEYS[key].message?.replace(\n            /\\$(\\d+)/g,\n            (match, p1) => substitutions[p1 - 1] || match\n          );\n        }\n        return key;\n      },\n    },\n    alarms: {\n      onAlarm: createNoopListeners(),\n      create: () => {\n        _log(\"alarms.create\", arguments);\n      },\n      get: () => {\n        _log(\"alarms.get\", arguments);\n      },\n    },\n    runtime: {\n      ...RUNTIME,\n      onInstalled: createNoopListeners(),\n      onStartup: createNoopListeners(),\n      // TODO: Postmessage to parent to open options page or call openOptionsPage\n      openOptionsPage: () => {\n        // const url = chrome.runtime.getURL(OPTIONS_PAGE_PATH);\n        // console.log(\"openOptionsPage\", _openTab, url, EXTENSION_ASSETS_MAP);\n        // _openTab(url);\n        if (typeof openOptionsPage === \"function\") {\n          openOptionsPage();\n        } else if (window.parent) {\n          window.parent.postMessage({ type: \"openOptionsPage\" }, \"*\");\n        } else {\n          _warn(\"openOptionsPage not available.\");\n        }\n      },\n      getManifest: () => {\n        // The manifest object will be injected into the scope where buildPolyfill is called\n        if (typeof INJECTED_MANIFEST !== \"undefined\") {\n          return JSON.parse(JSON.stringify(INJECTED_MANIFEST)); // Return deep copy\n        }\n        _warn(\"INJECTED_MANIFEST not found for chrome.runtime.getManifest\");\n        return { name: \"Unknown\", version: \"0.0\", manifest_version: 2 };\n      },\n      getURL: (path) => {\n        if (!path) return \"\";\n        if (path.startsWith(\"/\")) {\n          path = path.substring(1);\n        }\n\n        if (typeof _createAssetUrl === \"function\") {\n          return _createAssetUrl(path);\n        }\n\n        _warn(\n          `chrome.runtime.getURL fallback for '${path}'. Assets may not be available.`\n        );\n        // Attempt a relative path resolution (highly context-dependent and likely wrong)\n        try {\n          if (window.location.protocol.startsWith(\"http\")) {\n            return new URL(path, window.location.href).toString();\n          }\n        } catch (e) {\n          /* ignore error, fallback */\n        }\n        return path;\n      },\n      id: \"polyfilled-extension-\" + Math.random().toString(36).substring(2, 15),\n      lastError: null,\n      getPlatformInfo: async () => {\n        const platform = {\n          os: \"unknown\",\n          arch: \"unknown\",\n          nacl_arch: \"unknown\",\n        };\n\n        if (typeof navigator !== \"undefined\") {\n          const userAgent = navigator.userAgent.toLowerCase();\n          if (userAgent.includes(\"mac\")) platform.os = \"mac\";\n          else if (userAgent.includes(\"win\")) platform.os = \"win\";\n          else if (userAgent.includes(\"linux\")) platform.os = \"linux\";\n          else if (userAgent.includes(\"android\")) platform.os = \"android\";\n          else if (userAgent.includes(\"ios\")) platform.os = \"ios\";\n\n          if (userAgent.includes(\"x86_64\") || userAgent.includes(\"amd64\")) {\n            platform.arch = \"x86-64\";\n          } else if (userAgent.includes(\"i386\") || userAgent.includes(\"i686\")) {\n            platform.arch = \"x86-32\";\n          } else if (userAgent.includes(\"arm\")) {\n            platform.arch = \"arm\";\n          }\n        }\n\n        return platform;\n      },\n      getBrowserInfo: async () => {\n        const info = {\n          name: \"unknown\",\n          version: \"unknown\",\n          buildID: \"unknown\",\n        };\n\n        if (typeof navigator !== \"undefined\") {\n          const userAgent = navigator.userAgent;\n          if (userAgent.includes(\"Chrome\")) {\n            info.name = \"Chrome\";\n            const match = userAgent.match(/Chrome\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          } else if (userAgent.includes(\"Firefox\")) {\n            info.name = \"Firefox\";\n            const match = userAgent.match(/Firefox\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          } else if (userAgent.includes(\"Safari\")) {\n            info.name = \"Safari\";\n            const match = userAgent.match(/Version\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          }\n        }\n\n        return info;\n      },\n    },\n    storage: {\n      local: {\n        get: function (keys, callback) {\n          if (typeof _storageGet !== \"function\")\n            throw new Error(\"_storageGet not defined\");\n\n          const promise = _storageGet(keys);\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.get callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.get error:\", error);\n                callback({});\n              });\n            return;\n          }\n\n          return promise;\n        },\n        set: function (items, callback) {\n          if (typeof _storageSet !== \"function\")\n            throw new Error(\"_storageSet not defined\");\n\n          const promise = _storageSet(items).then((result) => {\n            broadcastStorageChange(items, \"local\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.set callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.set error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        remove: function (keys, callback) {\n          if (typeof _storageRemove !== \"function\")\n            throw new Error(\"_storageRemove not defined\");\n\n          const promise = _storageRemove(keys).then((result) => {\n            const changes = {};\n            const keyList = Array.isArray(keys) ? keys : [keys];\n            keyList.forEach((key) => {\n              changes[key] = { oldValue: undefined, newValue: undefined };\n            });\n            broadcastStorageChange(changes, \"local\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.remove callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.remove error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        clear: function (callback) {\n          if (typeof _storageClear !== \"function\")\n            throw new Error(\"_storageClear not defined\");\n\n          const promise = _storageClear().then((result) => {\n            broadcastStorageChange({}, \"local\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.clear callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.clear error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        onChanged: {\n          addListener: (callback) => {\n            storageChangeListeners.add(callback);\n          },\n          removeListener: (callback) => {\n            storageChangeListeners.delete(callback);\n          },\n        },\n      },\n      sync: {\n        get: function (keys, callback) {\n          _warn(\"chrome.storage.sync polyfill maps to local\");\n          return chrome.storage.local.get(keys, callback);\n        },\n        set: function (items, callback) {\n          _warn(\"chrome.storage.sync polyfill maps to local\");\n\n          const promise = chrome.storage.local.set(items).then((result) => {\n            broadcastStorageChange(items, \"sync\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.sync.set callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.sync.set error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        remove: function (keys, callback) {\n          _warn(\"chrome.storage.sync polyfill maps to local\");\n\n          const promise = chrome.storage.local.remove(keys).then((result) => {\n            const changes = {};\n            const keyList = Array.isArray(keys) ? keys : [keys];\n            keyList.forEach((key) => {\n              changes[key] = { oldValue: undefined, newValue: undefined };\n            });\n            broadcastStorageChange(changes, \"sync\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.sync.remove callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.sync.remove error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        clear: function (callback) {\n          _warn(\"chrome.storage.sync polyfill maps to local\");\n\n          const promise = chrome.storage.local.clear().then((result) => {\n            broadcastStorageChange({}, \"sync\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.sync.clear callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.sync.clear error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        onChanged: {\n          addListener: (callback) => {\n            storageChangeListeners.add(callback);\n          },\n          removeListener: (callback) => {\n            storageChangeListeners.delete(callback);\n          },\n        },\n      },\n      onChanged: {\n        addListener: (callback) => {\n          storageChangeListeners.add(callback);\n        },\n        removeListener: (callback) => {\n          storageChangeListeners.delete(callback);\n        },\n      },\n      managed: {\n        get: function (keys, callback) {\n          _warn(\"chrome.storage.managed polyfill is read-only empty.\");\n\n          const promise = Promise.resolve({});\n\n          if (typeof callback === \"function\") {\n            promise.then((result) => {\n              try {\n                callback(result);\n              } catch (e) {\n                _error(\"Error in storage.managed.get callback:\", e);\n              }\n            });\n            return;\n          }\n\n          return promise;\n        },\n      },\n    },\n    cookies: (function () {\n      const cookieChangeListeners = new Set();\n      function broadcastCookieChange(changeInfo) {\n        cookieChangeListeners.forEach((listener) => {\n          try {\n            listener(changeInfo);\n          } catch (e) {\n            _error(\"Error in cookies.onChanged listener:\", e);\n          }\n        });\n      }\n\n      function handlePromiseCallback(promise, callback) {\n        if (typeof callback === \"function\") {\n          promise\n            .then((result) => callback(result))\n            .catch((error) => {\n              // chrome.runtime.lastError = { message: error.message }; // TODO: Implement lastError\n              _error(error);\n              callback(); // Call with undefined on error\n            });\n          return;\n        }\n        return promise;\n      }\n\n      return {\n        get: function (details, callback) {\n          if (typeof _cookieList !== \"function\") {\n            return handlePromiseCallback(\n              Promise.reject(new Error(\"_cookieList not defined\")),\n              callback\n            );\n          }\n          const promise = _cookieList({\n            url: details.url,\n            name: details.name,\n            storeId: details.storeId,\n            partitionKey: details.partitionKey,\n          }).then((cookies) => {\n            if (!cookies || cookies.length === 0) {\n              return null;\n            }\n            // Sort by path length (longest first), then creation time (earliest first, if available)\n            cookies.sort((a, b) => {\n              const pathLenDiff = (b.path || \"\").length - (a.path || \"\").length;\n              if (pathLenDiff !== 0) return pathLenDiff;\n              return (a.creationTime || 0) - (b.creationTime || 0);\n            });\n            return cookies[0];\n          });\n          return handlePromiseCallback(promise, callback);\n        },\n\n        getAll: function (details, callback) {\n          if (typeof _cookieList !== \"function\") {\n            return handlePromiseCallback(\n              Promise.reject(new Error(\"_cookieList not defined\")),\n              callback\n            );\n          }\n          if (details.partitionKey) {\n            _warn(\n              \"cookies.getAll: partitionKey is not fully supported in this environment.\"\n            );\n          }\n          const promise = _cookieList(details);\n          return handlePromiseCallback(promise, callback);\n        },\n\n        set: function (details, callback) {\n          const promise = (async () => {\n            if (\n              typeof _cookieSet !== \"function\" ||\n              typeof _cookieList !== \"function\"\n            ) {\n              throw new Error(\"_cookieSet or _cookieList not defined\");\n            }\n            if (details.partitionKey) {\n              _warn(\n                \"cookies.set: partitionKey is not fully supported in this environment.\"\n              );\n            }\n\n            const getDetails = {\n              url: details.url,\n              name: details.name,\n              storeId: details.storeId,\n            };\n            const oldCookies = await _cookieList(getDetails);\n            const oldCookie = oldCookies && oldCookies[0];\n\n            if (oldCookie) {\n              broadcastCookieChange({\n                cause: \"overwrite\",\n                cookie: oldCookie,\n                removed: true,\n              });\n            }\n\n            await _cookieSet(details);\n            const newCookies = await _cookieList(getDetails);\n            const newCookie = newCookies && newCookies[0];\n\n            if (newCookie) {\n              broadcastCookieChange({\n                cause: \"explicit\",\n                cookie: newCookie,\n                removed: false,\n              });\n            }\n            return newCookie || null;\n          })();\n          return handlePromiseCallback(promise, callback);\n        },\n\n        remove: function (details, callback) {\n          const promise = (async () => {\n            if (\n              typeof _cookieDelete !== \"function\" ||\n              typeof _cookieList !== \"function\"\n            ) {\n              throw new Error(\"_cookieDelete or _cookieList not defined\");\n            }\n            const oldCookies = await _cookieList(details);\n            const oldCookie = oldCookies && oldCookies[0];\n\n            if (!oldCookie) return null; // Nothing to remove\n\n            await _cookieDelete(details);\n\n            broadcastCookieChange({\n              cause: \"explicit\",\n              cookie: oldCookie,\n              removed: true,\n            });\n\n            return {\n              url: details.url,\n              name: details.name,\n              storeId: details.storeId || \"0\",\n              partitionKey: details.partitionKey,\n            };\n          })();\n          return handlePromiseCallback(promise, callback);\n        },\n\n        getAllCookieStores: function (callback) {\n          const promise = Promise.resolve([\n            { id: \"0\", tabIds: [1] }, // Mock store for the current context\n          ]);\n          return handlePromiseCallback(promise, callback);\n        },\n\n        getPartitionKey: function (details, callback) {\n          _warn(\n            \"chrome.cookies.getPartitionKey is not supported in this environment.\"\n          );\n          const promise = Promise.resolve({ partitionKey: {} }); // Return empty partition key\n          return handlePromiseCallback(promise, callback);\n        },\n\n        onChanged: {\n          addListener: (callback) => {\n            if (typeof callback === \"function\") {\n              cookieChangeListeners.add(callback);\n            }\n          },\n          removeListener: (callback) => {\n            cookieChangeListeners.delete(callback);\n          },\n        },\n      };\n    })(),\n    tabs: {\n      query: async (queryInfo) => {\n        _warn(\"chrome.tabs.query polyfill only returns current tab info.\");\n        const dummyId = Math.floor(Math.random() * 1000) + 1;\n        return [\n          {\n            id: dummyId,\n            url: CURRENT_LOCATION,\n            active: true,\n            windowId: 1,\n            status: \"complete\",\n          },\n        ];\n      },\n      create: async ({ url, active = true }) => {\n        _log(`[Polyfill tabs.create] URL: ${url}`);\n        if (typeof _openTab !== \"function\")\n          throw new Error(\"_openTab not defined\");\n        _openTab(url, active);\n        const dummyId = Math.floor(Math.random() * 1000) + 1001;\n        return Promise.resolve({\n          id: dummyId,\n          url: url,\n          active,\n          windowId: 1,\n        });\n      },\n      sendMessage: async (tabId, message) => {\n        _warn(\n          `chrome.tabs.sendMessage polyfill (to tab ${tabId}) redirects to runtime.sendMessage (current context).`\n        );\n        return chrome.runtime.sendMessage(message);\n      },\n    },\n    notifications: {\n      create: async (notificationId, options) => {\n        try {\n          let id = notificationId;\n          let notificationOptions = options;\n\n          if (typeof notificationId === \"object\" && notificationId !== null) {\n            notificationOptions = notificationId;\n            id = \"notification_\" + Math.random().toString(36).substring(2, 15);\n          } else if (typeof notificationId === \"string\" && options) {\n            id = notificationId;\n            notificationOptions = options;\n          } else {\n            throw new Error(\"Invalid parameters for notifications.create\");\n          }\n\n          if (!notificationOptions || typeof notificationOptions !== \"object\") {\n            throw new Error(\"Notification options must be an object\");\n          }\n\n          const {\n            title,\n            message,\n            iconUrl,\n            type = \"basic\",\n          } = notificationOptions;\n\n          if (!title || !message) {\n            throw new Error(\"Notification must have title and message\");\n          }\n\n          if (\"Notification\" in window) {\n            if (Notification.permission === \"granted\") {\n              const notification = new Notification(title, {\n                body: message,\n                icon: iconUrl,\n                tag: id,\n              });\n\n              _log(`[Notifications] Created notification: ${id}`);\n              return id;\n            } else if (Notification.permission === \"default\") {\n              const permission = await Notification.requestPermission();\n              if (permission === \"granted\") {\n                const notification = new Notification(title, {\n                  body: message,\n                  icon: iconUrl,\n                  tag: id,\n                });\n                _log(\n                  `[Notifications] Created notification after permission: ${id}`\n                );\n                return id;\n              } else {\n                _warn(\"[Notifications] Permission denied for notifications\");\n                return id;\n              }\n            } else {\n              _warn(\"[Notifications] Notifications are blocked\");\n              return id;\n            }\n          } else {\n            _warn(\n              \"[Notifications] Native notifications not supported, using console fallback\"\n            );\n            _log(`[Notification] ${title}: ${message}`);\n            return id;\n          }\n        } catch (error) {\n          _error(\"[Notifications] Error creating notification:\", error.message);\n          throw error;\n        }\n      },\n      clear: async (notificationId) => {\n        _log(`[Notifications] Clear notification: ${notificationId}`);\n        // For native notifications, there's no direct way to clear by ID\n        // This is a limitation of the Web Notifications API\n        return true;\n      },\n      getAll: async () => {\n        _warn(\"[Notifications] getAll not fully supported in polyfill\");\n        return {};\n      },\n      getPermissionLevel: async () => {\n        if (\"Notification\" in window) {\n          const permission = Notification.permission;\n          return { level: permission === \"granted\" ? \"granted\" : \"denied\" };\n        }\n        return { level: \"denied\" };\n      },\n    },\n    contextMenus: {\n      create: (createProperties, callback) => {\n        try {\n          if (!createProperties || typeof createProperties !== \"object\") {\n            throw new Error(\"Context menu create properties must be an object\");\n          }\n\n          const { id, title, contexts = [\"page\"], onclick } = createProperties;\n          const menuId =\n            id || `menu_${Math.random().toString(36).substring(2, 15)}`;\n\n          if (!title || typeof title !== \"string\") {\n            throw new Error(\"Context menu must have a title\");\n          }\n\n          // Store menu items for potential use\n          if (!window._polyfillContextMenus) {\n            window._polyfillContextMenus = new Map();\n          }\n\n          window._polyfillContextMenus.set(menuId, {\n            id: menuId,\n            title,\n            contexts,\n            onclick,\n            enabled: createProperties.enabled !== false,\n          });\n\n          _log(\n            `[ContextMenus] Created context menu item: ${title} (${menuId})`\n          );\n\n          // Try to register a menu command as fallback\n          if (typeof _registerMenuCommand === \"function\") {\n            try {\n              _registerMenuCommand(\n                title,\n                onclick ||\n                  (() => {\n                    _log(`Context menu clicked: ${title}`);\n                  })\n              );\n            } catch (e) {\n              _warn(\n                \"[ContextMenus] Failed to register as menu command:\",\n                e.message\n              );\n            }\n          }\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n\n          return menuId;\n        } catch (error) {\n          _error(\"[ContextMenus] Error creating context menu:\", error.message);\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n          throw error;\n        }\n      },\n      update: (id, updateProperties, callback) => {\n        try {\n          if (\n            !window._polyfillContextMenus ||\n            !window._polyfillContextMenus.has(id)\n          ) {\n            throw new Error(`Context menu item not found: ${id}`);\n          }\n\n          const menuItem = window._polyfillContextMenus.get(id);\n          Object.assign(menuItem, updateProperties);\n\n          _log(`[ContextMenus] Updated context menu item: ${id}`);\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          _error(\"[ContextMenus] Error updating context menu:\", error.message);\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      remove: (menuItemId, callback) => {\n        try {\n          if (\n            window._polyfillContextMenus &&\n            window._polyfillContextMenus.has(menuItemId)\n          ) {\n            window._polyfillContextMenus.delete(menuItemId);\n            _log(`[ContextMenus] Removed context menu item: ${menuItemId}`);\n          } else {\n            _warn(\n              `[ContextMenus] Context menu item not found for removal: ${menuItemId}`\n            );\n          }\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          _error(\"[ContextMenus] Error removing context menu:\", error.message);\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      removeAll: (callback) => {\n        try {\n          if (window._polyfillContextMenus) {\n            const count = window._polyfillContextMenus.size;\n            window._polyfillContextMenus.clear();\n            _log(`[ContextMenus] Removed all ${count} context menu items`);\n          }\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          _error(\n            \"[ContextMenus] Error removing all context menus:\",\n            error.message\n          );\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      onClicked: {\n        addListener: (callback) => {\n          if (!window._polyfillContextMenuListeners) {\n            window._polyfillContextMenuListeners = new Set();\n          }\n          window._polyfillContextMenuListeners.add(callback);\n          _log(\"[ContextMenus] Added click listener\");\n        },\n        removeListener: (callback) => {\n          if (window._polyfillContextMenuListeners) {\n            window._polyfillContextMenuListeners.delete(callback);\n            _log(\"[ContextMenus] Removed click listener\");\n          }\n        },\n      },\n    },\n  };\n\n  const tc = (fn) => {\n    try {\n      fn();\n    } catch (e) {}\n  };\n  const loggingProxyHandler = (_key) => ({\n    get(target, key, receiver) {\n      tc(() => _log(`[${contextType}] [CHROME - ${_key}] Getting ${key}`));\n      return Reflect.get(target, key, receiver);\n    },\n    set(target, key, value, receiver) {\n      tc(() =>\n        _log(`[${contextType}] [CHROME - ${_key}] Setting ${key} to ${value}`)\n      );\n      return Reflect.set(target, key, value, receiver);\n    },\n    has(target, key) {\n      tc(() =>\n        _log(`[${contextType}] [CHROME - ${_key}] Checking if ${key} exists`)\n      );\n      return Reflect.has(target, key);\n    },\n  });\n  chrome = Object.fromEntries(\n    Object.entries(chrome).map(([key, value]) => [\n      key,\n      new Proxy(value, loggingProxyHandler(key)),\n    ])\n  );\n\n  // Alias browser to chrome for common Firefox pattern\n  const browser = new Proxy(chrome, loggingProxyHandler);\n\n  const oldGlobalThis = globalThis;\n  const oldWindow = window;\n  const oldSelf = self;\n  const oldGlobal = globalThis;\n  const __globalsStorage = {};\n\n  const TO_MODIFY = [oldGlobalThis, oldWindow, oldSelf, oldGlobal];\n  const set = (k, v) => {\n    __globalsStorage[k] = v;\n    TO_MODIFY.forEach((target) => {\n      target[k] = v;\n    });\n  };\n  const proxyHandler = {\n    get(target, key, receiver) {\n      try {\n        return __globalsStorage[key] || Reflect.get(target, key, receiver);\n      } catch (e) {\n        _error(\"Error getting\", key, e);\n        return undefined;\n      }\n    },\n    set(target, key, value, receiver) {\n      try {\n        tc(() => _log(`[${contextType}] Setting ${key} to ${value}`));\n        set(key, value);\n        return Reflect.set(target, key, value, receiver);\n      } catch (e) {\n        _error(\"Error setting\", key, value, e);\n        return false;\n      }\n    },\n    has(target, key) {\n      try {\n        return key in __globalsStorage || key in target;\n      } catch (e) {\n        _error(\"Error has\", key, e);\n        return false;\n      }\n    },\n    getOwnPropertyDescriptor(target, key) {\n      try {\n        if (key in __globalsStorage) {\n          return {\n            configurable: true,\n            enumerable: true,\n            writable: true,\n            value: __globalsStorage[key],\n          };\n        }\n        // fall back to the real globalThis\n        const desc = Reflect.getOwnPropertyDescriptor(target, key);\n        // ensure it's configurable so the with‑scope binding logic can override it\n        if (desc && !desc.configurable) {\n          desc.configurable = true;\n        }\n        return desc;\n      } catch (e) {\n        _error(\"Error getOwnPropertyDescriptor\", key, e);\n        return {\n          configurable: true,\n          enumerable: true,\n          writable: true,\n          value: undefined,\n        };\n      }\n    },\n\n    defineProperty(target, key, descriptor) {\n      try {\n        // Normalize descriptor to avoid mixed accessor & data attributes\n        const hasAccessor = \"get\" in descriptor || \"set\" in descriptor;\n\n        if (hasAccessor) {\n          // Build a clean descriptor without value/writable when accessors present\n          const normalized = {\n            configurable:\n              \"configurable\" in descriptor ? descriptor.configurable : true,\n            enumerable:\n              \"enumerable\" in descriptor ? descriptor.enumerable : false,\n          };\n          if (\"get\" in descriptor) normalized.get = descriptor.get;\n          if (\"set\" in descriptor) normalized.set = descriptor.set;\n\n          // Store accessor references for inspection but avoid breaking invariants\n          set(key, {\n            get: descriptor.get,\n            set: descriptor.set,\n          });\n\n          return Reflect.defineProperty(target, key, normalized);\n        }\n\n        // Data descriptor path\n        set(key, descriptor.value);\n        return Reflect.defineProperty(target, key, descriptor);\n      } catch (e) {\n        _error(\"Error defineProperty\", key, descriptor, e);\n        return false;\n      }\n    },\n  };\n\n  // Create proxies once proxyHandler is defined\n  const proxyWindow = new Proxy(oldWindow, proxyHandler);\n  const proxyGlobalThis = new Proxy(oldGlobalThis, proxyHandler);\n  const proxyGlobal = new Proxy(oldGlobal, proxyHandler);\n  const proxySelf = new Proxy(oldSelf, proxyHandler);\n\n  // Seed storage with core globals so lookups succeed inside `with` blocks\n  Object.assign(__globalsStorage, {\n    chrome,\n    browser,\n    window: proxyWindow,\n    globalThis: proxyGlobalThis,\n    global: proxyGlobal,\n    self: proxySelf,\n  });\n\n  const __globals = {\n    chrome,\n    browser,\n    window: proxyWindow,\n    globalThis: proxyGlobalThis,\n    global: proxyGlobal,\n    self: proxySelf,\n    __globals: __globalsStorage,\n  };\n\n  __globalsStorage.contextId = contextId;\n  __globalsStorage.contextType = contextType;\n  __globalsStorage.module = undefined;\n  __globalsStorage.amd = undefined;\n  __globalsStorage.define = undefined;\n\n  return __globals;\n}\n\n\nif (typeof window !== 'undefined') {\n    window.buildPolyfill = buildPolyfill;\n}\n"
			    let newMap = JSON.parse(JSON.stringify(EXTENSION_ASSETS_MAP));
			    delete newMap[OPTIONS_PAGE_PATH];
			    const PASS_ON = Object.fromEntries(Object.entries({
			        LOCALE_KEYS,
			        INJECTED_MANIFEST,
			        USED_LOCALE,
			        EXTENSION_ICON,
			        CURRENT_LOCATION,
			        OPTIONS_PAGE_PATH,
			        CAN_USE_BLOB_CSP,
			        ALL_PERMISSIONS,
			        ORIGIN_PERMISSIONS,
			        EXTENSION_PERMISSIONS,
			        _base64ToBlob,
			        _getMimeTypeFromPath,
			        _isTextAsset,
			        _createAssetUrl,
			        _matchGlobPattern,
			        _isWebAccessibleResource,
			        _log,
			        _warn,
			        _error,
			    }).map(i => {
			      let out = [...i];
			      if (typeof i[1] === 'function'){
			        out[1] = i[1].toString();
			      } else {
			        out[1] = JSON.stringify(i[1])
			      }
			      return out;
			    }))
			    _log(PASS_ON);
			    return `
			    ${Object.entries(PASS_ON).map(i => `const ${i[0]} = ${i[1]};\nwindow[${JSON.stringify(i[0])}] = ${i[0]}`).join('\n')}
			
			        _log("Initialized polyfill", {${Object.keys(PASS_ON).join(', ')}})
			        ${polyfillString.replaceAll("{{EXTENSION_ASSETS_MAP}}", `JSON.parse(atob("${btoa(JSON.stringify(EXTENSION_ASSETS_MAP))}"))`)}
			
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
			    _log(`Initializing...`, performance.now());
			
			    if (typeof _initStorage === 'function') {
			        try {
			            _initStorage().then(() => {
			                _log(`Storage initialized.`);
			            }).catch(e => {
			                _error('Error during storage initialization:', e);
			            });
			        } catch (e) {
			            _error('Error during storage initialization:', e);
			        }
			    }
			
			    _log(`Starting content scripts...`);
			
			    const currentUrl = window.location.href;
			    let shouldRunAnyScript = false;
			    _log(`Checking URL: ${currentUrl}`);
			
			    if (CONTENT_SCRIPT_CONFIGS_FOR_MATCHING && CONTENT_SCRIPT_CONFIGS_FOR_MATCHING.length > 0) {
			        for (const config of CONTENT_SCRIPT_CONFIGS_FOR_MATCHING) {
			            if (config.matches && config.matches.some(pattern => {
			                try {
			                    const regex = convertMatchPatternToRegExp(pattern);
			                    if (regex.test(currentUrl)) {
			                       return true;
			                    }
			                    return false;
			                } catch (e) {
			                    _error(`Error testing match pattern "${pattern}":`, e);
			                    return false;
			                }
			            })) {
			                shouldRunAnyScript = true;
			                _log(`URL match found via config:`, config);
			                break;
			            }
			        }
			    } else {
			        _log(`No content script configurations found in manifest data.`);
			    }
			
			
			    if (shouldRunAnyScript) {
			        let polyfillContext;
			        try {
			            polyfillContext = buildPolyfill({ isBackground: false });
			        } catch (e) {
			            _error(`Failed to build polyfill:`, e);
			            return;
			        }
			
			        _log(`Polyfill built. Executing combined script logic...`);
			        // async function executeAllScripts({chrome, browser, global, window, globalThis, self, __globals}, extensionCssData) {
			        await executeAllScripts.call(polyfillContext.globalThis, polyfillContext, extensionCssData);
			
			    } else {
			        _log(`No matching content script patterns for this URL. No scripts will be executed.`);
			    }
			
			    if (OPTIONS_PAGE_PATH) {
			        if (typeof _registerMenuCommand === 'function') {
			            try {
			                _registerMenuCommand('Open Options', openOptionsPage);
			                _log(`Options menu command registered.`);
			            } catch(e) {
			                _error('Failed to register menu command', e);
			            }
			        }
			    }
			
			    if (POPUP_PAGE_PATH) {
			        if (typeof _registerMenuCommand === 'function') {
			            try {
			                _registerMenuCommand('Open Popup', openPopupPage);
			                _log(`Popup menu command registered.`);
			            } catch(e) {
			                _error('Failed to register popup menu command', e);
			            }
			        }
			    }
			
			    _log(`Initialization sequence complete.`);
			
			}
			
			main().catch(e => _error(`Error during script initialization:`, e));
			
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