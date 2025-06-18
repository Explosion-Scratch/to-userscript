// ==UserScript==
// @name        MV3 Messaging Demo
// @version     1.0
// @description A simple example of messaging between a service worker and content script.
// @namespace   mv3-messaging-demo
// @author      Converter Script
// @match       https://*.google.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @run-at      document-idle
// ==/UserScript==

const e=!0,t=e=>e,s="passthrough";let o,c={createHTML:t,createScript:t,createScriptURL:t},i=!1;const r=()=>{try{void 0!==window.isSecureContext&&window.isSecureContext&&window.trustedTypes&&window.trustedTypes.createPolicy&&(i=!0,trustedTypes.defaultPolicy?(d("TT Default Policy exists"),c=window.trustedTypes.createPolicy("default",c),o=trustedTypes.defaultPolicy,d(`Created custom passthrough policy, in case the default policy is too restrictive: Use Policy '${s}' in var 'TTP':`,c)):o=c=window.trustedTypes.createPolicy("default",c),d("Trusted-Type Policies: TTP:",c,"TTP_default:",o))}catch(e){d(e)}},d=(...e)=>{console.log(...e)};r();

(function() {
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
			
			  console.log(
			    "[PostMessage Handler] Abstraction layer message handler initialized",
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
			                new Error("Requires responseType:'blob' in GM_xmlhttpRequest"),
			              );
			            },
			            arrayBuffer: () => {
			              if (response.response instanceof ArrayBuffer) {
			                return Promise.resolve(response.response);
			              }
			              return Promise.reject(
			                new Error(
			                  "Requires responseType:'arraybuffer' in GM_xmlhttpRequest",
			                ),
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
			              }`,
			            ),
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
			  return Promise.resolve();
			}
			
			
			// No assets available
			const EXTENSION_ASSETS_MAP = {};
			function _base64ToBlob() { return null; }
			function _getMimeTypeFromPath() { return 'application/octet-stream'; }
			function _isTextAsset() { return false; }
			function _createAssetUrl() { return ''; }
			
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
		      "mv3-messaging-demo",
		      IS_IFRAME ? "iframe" : "page"
		    );
		    return globalThis.__BUS;
		  })();
		  const RUNTIME = createRuntime(isBackground ? "background" : "tab", BUS);
		  const createNoopListeners = () => ({
		    addListener: (callback) => {
		      console.log("addListener", callback);
		    },
		    removeListener: (callback) => {
		      console.log("removeListener", callback);
		    },
		  });
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
			    },
			    i18n: {
			      getUILanguage: () => {
			        return USED_LOCALE || "en";
			      },
			      getMessage: (key) => {
			        if (typeof LOCALE_KEYS !== "undefined" && LOCALE_KEYS[key]) {
			          return LOCALE_KEYS[key].message;
			        }
			        return key;
			      },
			    },
			    alarms: {
			      onAlarm: createNoopListeners(),
			      create: () => {
			        console.log("alarms.create", arguments);
			      },
			      get: () => {
			        console.log("alarms.get", arguments);
			      },
			    },
			    runtime: {
			      ...RUNTIME,
			      onInstalled: createNoopListeners(),
			      onStartup: createNoopListeners(),
			      openOptionsPage: () => {
			        const url = chrome.runtime.getURL(OPTIONS_PAGE_PATH);
			        console.log("openOptionsPage", _openTab, url);
			        _openTab(url);
			      },
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
			        if (!path) return "";
			        if (path.startsWith("/")) {
			          path = path.substring(1);
			        }
			
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
			                  console.error("Error in storage.get callback:", e);
			                }
			              })
			              .catch((error) => {
			                console.error("Storage.get error:", error);
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
			                  console.error("Error in storage.set callback:", e);
			                }
			              })
			              .catch((error) => {
			                console.error("Storage.set error:", error);
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
			                  console.error("Error in storage.remove callback:", e);
			                }
			              })
			              .catch((error) => {
			                console.error("Storage.remove error:", error);
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
			                  console.error("Error in storage.clear callback:", e);
			                }
			              })
			              .catch((error) => {
			                console.error("Storage.clear error:", error);
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
			          console.warn("chrome.storage.sync polyfill maps to local");
			          return chrome.storage.local.get(keys, callback);
			        },
			        set: function (items, callback) {
			          console.warn("chrome.storage.sync polyfill maps to local");
			
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
			                  console.error("Error in storage.sync.set callback:", e);
			                }
			              })
			              .catch((error) => {
			                console.error("Storage.sync.set error:", error);
			                callback();
			              });
			            return;
			          }
			
			          return promise;
			        },
			        remove: function (keys, callback) {
			          console.warn("chrome.storage.sync polyfill maps to local");
			
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
			                  console.error("Error in storage.sync.remove callback:", e);
			                }
			              })
			              .catch((error) => {
			                console.error("Storage.sync.remove error:", error);
			                callback();
			              });
			            return;
			          }
			
			          return promise;
			        },
			        clear: function (callback) {
			          console.warn("chrome.storage.sync polyfill maps to local");
			
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
			                  console.error("Error in storage.sync.clear callback:", e);
			                }
			              })
			              .catch((error) => {
			                console.error("Storage.sync.clear error:", error);
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
			          console.warn("chrome.storage.managed polyfill is read-only empty.");
			
			          const promise = Promise.resolve({});
			
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
			
			              console.log(`[Notifications] Created notification: ${id}`);
			              return id;
			            } else if (Notification.permission === "default") {
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
			                return id;
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
			
			  const tc = (fn) => {
			    try {
			      fn();
			    } catch (e) {}
			  };
			  const loggingProxyHandler = (_key) => ({
			    get(target, key, receiver) {
			      tc(() =>
			        console.log(`[${contextType}] [CHROME - ${_key}] Getting ${key}`)
			      );
			      return Reflect.get(target, key, receiver);
			    },
			    set(target, key, value, receiver) {
			      tc(() =>
			        console.log(
			          `[${contextType}] [CHROME - ${_key}] Setting ${key} to ${value}`
			        )
			      );
			      return Reflect.set(target, key, value, receiver);
			    },
			    has(target, key) {
			      tc(() =>
			        console.log(
			          `[${contextType}] [CHROME - ${_key}] Checking if ${key} exists`
			        )
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
			      tc(() => console.log(`[${contextType}] Setting ${key} to ${value}`));
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
	  const scriptName = "MV3 Messaging Demo";
	  const debug = "[MV3 Messaging Demo]";
	  console.log(debug + ' Executing background scripts...');
	
	
	  with(backgroundPolyfill){
	    // BG: background.js
	// background.js
	
	// Listener for simple one-time requests
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	  // Check the message type
	  if (message.type === "GET_DATE") {
	    // Create a date and send it back to the content script
	    const date = new Date().toLocaleString();
	    sendResponse({ date: date });
	  }
	
	  // Return true to indicate you wish to send a response asynchronously.
	  // This is required even if you send the response synchronously.
	  return true;
	});
	
	// Listener for long-lived port connections
	chrome.runtime.onConnect.addListener((port) => {
	  console.assert(port.name === "randomNumberPort");
	
	  // Add a listener for messages on this specific port
	  port.onMessage.addListener((msg) => {
	    if (msg.type === "GET_RANDOM_NUMBER") {
	      const randomNumber = Math.floor(Math.random() * 100);
	      // Post a message back to the port
	      port.postMessage({ randomNumber: randomNumber });
	    }
	  });
	});
	  }
	
	  console.log(debug + ' Background scripts execution complete.');
	});
	
	console.log("START_BACKGROUND_SCRIPT", START_BACKGROUND_SCRIPT);
	setTimeout(() => {
	  START_BACKGROUND_SCRIPT();
	}, 100);
	// End background script environment
	
	
   // #endregion
    // #region Orchestration Logic
	const SCRIPT_NAME = "MV3 Messaging Demo";
	
	const INJECTED_MANIFEST = {"manifest_version":3,"name":"MV3 Messaging Demo","version":"1.0","description":"A simple example of messaging between a service worker and content script.","permissions":[],"content_scripts":[{"matches":["https://*.google.com/*"],"css":["style.css"],"js":["content.js"]}],"options_ui":{},"browser_action":{},"page_action":{},"action":{},"icons":{},"web_accessible_resources":[],"background":{"service_worker":"background.js"},"_id":"mv3-messaging-demo"};
	const CONTENT_SCRIPT_CONFIGS_FOR_MATCHING = [
	  {
	    "matches": [
	      "https://*.google.com/*"
	    ]
	  }
	];
	const OPTIONS_PAGE_PATH = null;
	const POPUP_PAGE_PATH = null;
	const EXTENSION_ICON = null;
	const extensionCssData = {    "style.css": "/* style.css */\n\n#my-extension-container {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  background-color: #f0f8ff; /* AliceBlue */\n  border: 2px solid #4682b4; /* SteelBlue */\n  border-radius: 8px;\n  padding: 15px;\n  z-index: 9999;\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);\n  font-family: sans-serif;\n  display: flex;\n  gap: 10px;\n}\n\n#my-extension-container button {\n  background-color: #4682b4;\n  color: white;\n  border: none;\n  padding: 8px 12px;\n  border-radius: 5px;\n  cursor: pointer;\n  font-size: 14px;\n  transition: background-color 0.2s ease;\n}\n\n#my-extension-container button:hover {\n  background-color: #5a9bd8;\n}\n"};
	
	const LOCALE_KEYS = {};
	const USED_LOCALE = "en";
	
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
	
	window._matchGlobPattern = _matchGlobPattern;
	window._isWebAccessibleResource = _isWebAccessibleResource;
	
	// This function contains all the CSS injection and JS execution,
	// ordered by run_at timing internally using await.
	
  // #region Script Execution Logic
		async function executeAllScripts(globalThis, extensionCssData) {
		  const {chrome, browser, global, window, self} = globalThis;
		  const scriptName = "MV3 Messaging Demo";
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
			    
			    const scriptPaths = [];
			   console.log(`  Executing JS (end): ${scriptPaths}`);
			
			   try {
			       // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
			      with (globalThis){;
			
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
			    
			        const cssKey_0 = "style.css";
			    try {
			      if (extensionCssData[cssKey_0]) {
			        console.log(`  Injecting CSS (idle): ${cssKey_0}`);
			        const style = document.createElement('style');
			        style.textContent = extensionCssData[cssKey_0];
			        (document.head || document.documentElement).appendChild(style);
			      } else { console.warn(`  CSS not found (idle): ${cssKey_0}`); }
			    } catch(e) { console.error(`  Failed injecting CSS (${cssKey_0}) in phase idle`, e, extensionCssData); }
			  
			    const scriptPaths = ["content.js"];
			   console.log(`  Executing JS (idle): ${scriptPaths}`);
			
			   try {
			       // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
			      with (globalThis){;
			// START: content.js
			// content.js
			
			// Create the main container element
			const container = document.createElement("div");
			container.id = "my-extension-container";
			
			// Create the "Get Date" button
			const getDateBtn = document.createElement("button");
			getDateBtn.id = "get-date-btn";
			getDateBtn.textContent = "Get Date (Simple Message)";
			
			// Create the "Get Random Number" button
			const getRandomBtn = document.createElement("button");
			getRandomBtn.id = "get-random-btn";
			getRandomBtn.textContent = "Get Random # (Port Message)";
			
  // #endregion
// #region Event Listener for Simple Messaging Get Date ---
			getDateBtn.addEventListener("click", () => {
			  console.log("Sending message to get date...");
			  // Send a message to the background script
			  chrome.runtime.sendMessage({ type: "GET_DATE" }, (response) => {
			    if (chrome.runtime.lastError) {
			      console.error(chrome.runtime.lastError.message);
			      alert("Error: Could not get date. Check the extension's console.");
			    } else {
			      console.log("Received response:", response);
			      alert("Date from background: " + response.date);
			    }
			  });
			});
			
// #endregion
// #region Event Listener for Port Messaging Get Random Number ---
			getRandomBtn.addEventListener("click", () => {
			  console.log("Opening port to get random number...");
			  // Create a port for a long-lived connection
			  const port = chrome.runtime.connect({ name: "randomNumberPort" });
			
			  // Send a message through the port
			  port.postMessage({ type: "GET_RANDOM_NUMBER" });
			
			  // Listen for messages from the background script on this port
			  port.onMessage.addListener((msg) => {
			    console.log("Received random number:", msg);
			    alert("Random number from background: " + msg.randomNumber);
			    // You can disconnect the port if you're done with it
			    port.disconnect();
			  });
			});
			
			// Append buttons to the container and the container to the page body
			container.appendChild(getDateBtn);
			container.appendChild(getRandomBtn);
			document.body.appendChild(container);
			
			console.log("My Extension content script loaded!");
			// END: content.js
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
			
			function generateCompletePolyfillForIframe() {
			    const polyfillString = "\n// -- Messaging implementation\n\nfunction createEventBus(\n  scopeId,\n  type = \"page\", // \"page\" or \"iframe\"\n  { allowedOrigin = \"*\", children = [], parentWindow = null } = {}\n) {\n  if (!scopeId) throw new Error(\"createEventBus requires a scopeId\");\n\n  const handlers = {};\n\n  function handleIncoming(ev) {\n    if (allowedOrigin !== \"*\" && ev.origin !== allowedOrigin) return;\n\n    const msg = ev.data;\n    if (!msg || msg.__eventBus !== true || msg.scopeId !== scopeId) return;\n\n    const { event, payload } = msg;\n\n    // PAGE: if it's an INIT from an iframe, adopt it\n    if (type === \"page\" && event === \"__INIT__\") {\n      const win = ev.source;\n      if (win && !children.includes(win)) {\n        children.push(win);\n      }\n      return;\n    }\n\n    (handlers[event] || []).forEach((fn) =>\n      fn(payload, { origin: ev.origin, source: ev.source })\n    );\n  }\n\n  window.addEventListener(\"message\", handleIncoming);\n\n  function emitTo(win, event, payload) {\n    const envelope = {\n      __eventBus: true,\n      scopeId,\n      event,\n      payload,\n    };\n    win.postMessage(envelope, allowedOrigin);\n  }\n\n  // IFRAME: announce to page on startup\n  if (type === \"iframe\") {\n    setTimeout(() => {\n      const pw = parentWindow || window.parent;\n      if (pw && pw.postMessage) {\n        emitTo(pw, \"__INIT__\", null);\n      }\n    }, 0);\n  }\n\n  return {\n    on(event, fn) {\n      handlers[event] = handlers[event] || [];\n      handlers[event].push(fn);\n    },\n    off(event, fn) {\n      if (!handlers[event]) return;\n      handlers[event] = handlers[event].filter((h) => h !== fn);\n    },\n    /**\n     * Emits an event.\n     * @param {string} event - The event name.\n     * @param {any} payload - The event payload.\n     * @param {object} [options] - Emission options.\n     * @param {Window} [options.to] - A specific window to target. If omitted, broadcasts.\n     */\n    emit(event, payload, { to } = {}) {\n      // dispatch locally first\n      (handlers[event] || []).forEach((fn) =>\n        fn(payload, { origin: location.origin, source: window })\n      );\n\n      // If a specific target window is provided, send only to it.\n      if (to) {\n        if (to && typeof to.postMessage === \"function\") {\n          emitTo(to, event, payload);\n        }\n        return;\n      }\n\n      // Otherwise, perform the default broadcast behavior.\n      if (type === \"page\") {\n        children.forEach((win) => emitTo(win, event, payload));\n      } else {\n        const pw = parentWindow || window.parent;\n        if (pw && pw.postMessage) {\n          emitTo(pw, event, payload);\n        }\n      }\n    },\n  };\n}\n\nfunction createRuntime(type = \"background\", bus) {\n  let nextId = 1;\n  const pending = {};\n  const msgListeners = [];\n\n  let nextPortId = 1;\n  const ports = {};\n  const onConnectListeners = [];\n\n  function parseArgs(args) {\n    let target, message, options, callback;\n    const arr = [...args];\n    if (arr.length === 0) {\n      throw new Error(\"sendMessage requires at least one argument\");\n    }\n    if (arr.length === 1) {\n      return { message: arr[0] };\n    }\n    // last object could be options\n    if (\n      arr.length &&\n      typeof arr[arr.length - 1] === \"object\" &&\n      !Array.isArray(arr[arr.length - 1])\n    ) {\n      options = arr.pop();\n    }\n    // last function is callback\n    if (arr.length && typeof arr[arr.length - 1] === \"function\") {\n      callback = arr.pop();\n    }\n    if (\n      arr.length === 2 &&\n      (typeof arr[0] === \"string\" || typeof arr[0] === \"number\")\n    ) {\n      [target, message] = arr;\n    } else {\n      [message] = arr;\n    }\n    return { target, message, options, callback };\n  }\n\n  if (type === \"background\") {\n    bus.on(\"__REQUEST__\", ({ id, message }, { source }) => {\n      let responded = false,\n        isAsync = false;\n      function sendResponse(resp) {\n        if (responded) return;\n        responded = true;\n        // Target the response directly back to the window that sent the request.\n        bus.emit(\"__RESPONSE__\", { id, response: resp }, { to: source });\n      }\n      const results = msgListeners\n        .map((fn) => {\n          try {\n            // msg, sender, sendResponse\n            const ret = fn(message, { id, tab: { id: source } }, sendResponse);\n            if (ret === true || (ret && typeof ret.then === \"function\")) {\n              isAsync = true;\n              return ret;\n            }\n            return ret;\n          } catch (e) {\n            console.error(e);\n          }\n        })\n        .filter((r) => r !== undefined);\n\n      const promises = results.filter((r) => r && typeof r.then === \"function\");\n      if (!isAsync && promises.length === 0) {\n        const out = results.length === 1 ? results[0] : results;\n        sendResponse(out);\n      } else if (promises.length) {\n        Promise.all(promises).then((vals) => {\n          if (!responded) {\n            const out = vals.length === 1 ? vals[0] : vals;\n            sendResponse(out);\n          }\n        });\n      }\n    });\n  }\n\n  if (type !== \"background\") {\n    bus.on(\"__RESPONSE__\", ({ id, response }) => {\n      const entry = pending[id];\n      if (!entry) return;\n      entry.resolve(response);\n      if (entry.callback) entry.callback(response);\n      delete pending[id];\n    });\n  }\n\n  function sendMessage(...args) {\n    if (type === \"background\") {\n      throw new Error(\"Background cannot sendMessage to itself\");\n    }\n    const { target, message, callback } = parseArgs(args);\n    const id = nextId++;\n    const promise = new Promise((resolve) => {\n      pending[id] = { resolve, callback };\n      bus.emit(\"__REQUEST__\", { id, message });\n    });\n    return promise;\n  }\n\n  bus.on(\"__PORT_CONNECT__\", ({ portId, name }, { source }) => {\n    if (type !== \"background\") return;\n    const backgroundPort = makePort(\"background\", portId, name, source);\n    ports[portId] = backgroundPort;\n\n    onConnectListeners.forEach((fn) => fn(backgroundPort));\n\n    // send back a CONNECT_ACK so the client can\n    // start listening on its end:\n    bus.emit(\"__PORT_CONNECT_ACK__\", { portId, name }, { to: source });\n  });\n\n  // Clients handle the ACK and finalize their Port object:\n  bus.on(\"__PORT_CONNECT_ACK__\", ({ portId, name }) => {\n    if (type === \"background\") return; // ignore\n    const p = ports[portId];\n    if (!p) return;\n    p._ready = true;\n    p._drainBuffer();\n  });\n\n  // Any port message travels via \"__PORT_MESSAGE__\"\n  bus.on(\"__PORT_MESSAGE__\", ({ portId, msg }, { source }) => {\n    const p = ports[portId];\n    if (!p) return;\n    p._receive(msg, source);\n  });\n\n  // Any port disconnect:\n  bus.on(\"__PORT_DISCONNECT__\", ({ portId }) => {\n    const p = ports[portId];\n    if (!p) return;\n    p._disconnect();\n    delete ports[portId];\n  });\n\n  function makePort(side, portId, name, remoteWindow) {\n    let onMessageHandlers = [];\n    let onDisconnectHandlers = [];\n    let buffer = [];\n    let _ready = side === \"background\";\n    // background ends are always ready\n    // client ends wait for CONNECT_ACK\n\n    function _drainBuffer() {\n      buffer.forEach((m) => _post(m));\n      buffer = [];\n    }\n\n    function _post(msg) {\n      // unidirectional: send from this side, receive on the other\n      bus.emit(\"__PORT_MESSAGE__\", { portId, msg }, { to: remoteWindow });\n    }\n\n    function postMessage(msg) {\n      if (!_ready) {\n        buffer.push(msg);\n      } else {\n        _post(msg);\n      }\n    }\n\n    function _receive(msg, source) {\n      onMessageHandlers.forEach((fn) =>\n        fn(msg, { id: portId, tab: { id: source } })\n      );\n    }\n\n    function disconnect() {\n      bus.emit(\"__PORT_DISCONNECT__\", { portId }, { to: remoteWindow });\n      _disconnect();\n      delete ports[portId];\n    }\n\n    function _disconnect() {\n      onDisconnectHandlers.forEach((fn) => fn());\n      onMessageHandlers = [];\n      onDisconnectHandlers = [];\n    }\n\n    return {\n      name,\n      sender: {\n        id: portId,\n      },\n      onMessage: {\n        addListener(fn) {\n          onMessageHandlers.push(fn);\n        },\n        removeListener(fn) {\n          onMessageHandlers = onMessageHandlers.filter((x) => x !== fn);\n        },\n      },\n      onDisconnect: {\n        addListener(fn) {\n          onDisconnectHandlers.push(fn);\n        },\n        removeListener(fn) {\n          onDisconnectHandlers = onDisconnectHandlers.filter((x) => x !== fn);\n        },\n      },\n      postMessage,\n      disconnect,\n      _ready, // internal\n      _drainBuffer, // internal\n      _receive, // internal\n      _disconnect, // internal\n    };\n  }\n\n  function connect(connectInfo = {}) {\n    if (type === \"background\") {\n      throw new Error(\"Background must use onConnect, not connect()\");\n    }\n    const name = connectInfo.name || \"\";\n    const portId = nextPortId++;\n    // create the client side port\n    // remoteWindow is left undefined here; bus.emit will propagate upwards\n    const clientPort = makePort(\"client\", portId, name, null);\n    ports[portId] = clientPort;\n\n    // fire the connect event across the bus\n    bus.emit(\"__PORT_CONNECT__\", { portId, name });\n    return clientPort;\n  }\n\n  function onConnect(fn) {\n    if (type !== \"background\") {\n      throw new Error(\"connect event only fires in background\");\n    }\n    onConnectListeners.push(fn);\n  }\n\n  return {\n    // rpc:\n    sendMessage,\n    onMessage: {\n      addListener(fn) {\n        msgListeners.push(fn);\n      },\n      removeListener(fn) {\n        const i = msgListeners.indexOf(fn);\n        if (i >= 0) msgListeners.splice(i, 1);\n      },\n    },\n\n    // port API:\n    connect,\n    onConnect: {\n      addListener(fn) {\n        onConnect(fn);\n      },\n      removeListener(fn) {\n        const i = onConnectListeners.indexOf(fn);\n        if (i >= 0) onConnectListeners.splice(i, 1);\n      },\n    },\n  };\n}\n\n\n// --- Abstraction Layer: PostMessage Target\n\nlet nextRequestId = 1;\nconst pendingRequests = new Map(); // requestId -> { resolve, reject, timeout }\n\nfunction sendAbstractionRequest(method, args = []) {\n  return new Promise((resolve, reject) => {\n    const requestId = nextRequestId++;\n\n    const timeout = setTimeout(() => {\n      pendingRequests.delete(requestId);\n      reject(new Error(`PostMessage request timeout for method: ${method}`));\n    }, 10000);\n\n    pendingRequests.set(requestId, { resolve, reject, timeout });\n\n    window.parent.postMessage({\n      type: \"abstraction-request\",\n      requestId,\n      method,\n      args,\n    });\n  });\n}\n\nwindow.addEventListener(\"message\", (event) => {\n  const { type, requestId, success, result, error } = event.data;\n\n  if (type === \"abstraction-response\") {\n    const pending = pendingRequests.get(requestId);\n    if (pending) {\n      clearTimeout(pending.timeout);\n      pendingRequests.delete(requestId);\n\n      if (success) {\n        pending.resolve(result);\n      } else {\n        const err = new Error(error.message);\n        err.stack = error.stack;\n        pending.reject(err);\n      }\n    }\n  }\n});\n\nasync function _storageSet(items) {\n  return sendAbstractionRequest(\"_storageSet\", [items]);\n}\n\nasync function _storageGet(keys) {\n  return sendAbstractionRequest(\"_storageGet\", [keys]);\n}\n\nasync function _storageRemove(keysToRemove) {\n  return sendAbstractionRequest(\"_storageRemove\", [keysToRemove]);\n}\n\nasync function _storageClear() {\n  return sendAbstractionRequest(\"_storageClear\");\n}\n\nasync function _fetch(url, options) {\n  return sendAbstractionRequest(\"_fetch\", [url, options]);\n}\n\nfunction _registerMenuCommand(name, func) {\n  console.warn(\"_registerMenuCommand called from iframe context:\", name);\n  return sendAbstractionRequest(\"_registerMenuCommand\", [\n    name,\n    func.toString(),\n  ]);\n}\n\nfunction _openTab(url) {\n  return sendAbstractionRequest(\"_openTab\", [url]);\n}\n\nasync function _initStorage() {\n  return sendAbstractionRequest(\"_initStorage\");\n}\n\n\n// No assets available\nconst EXTENSION_ASSETS_MAP = {};\nfunction _base64ToBlob() { return null; }\nfunction _getMimeTypeFromPath() { return 'application/octet-stream'; }\nfunction _isTextAsset() { return false; }\nfunction _createAssetUrl() { return ''; }\n\n// -- Polyfill Implementation\nfunction buildPolyfill({ isBackground = false, isOtherPage = false } = {}) {\n  // Generate a unique context ID for this polyfill instance\n  const contextType = isBackground\n    ? \"background\"\n    : isOtherPage\n      ? \"options\"\n      : \"content\";\n  const contextId = `${contextType}_${Math.random()\n    .toString(36)\n    .substring(2, 15)}`;\n\n  const IS_IFRAME = \"true\" === \"true\";\n  const BUS = (function () {\n    if (globalThis.__BUS) {\n      return globalThis.__BUS;\n    }\n    globalThis.__BUS = createEventBus(\n      \"mv3-messaging-demo\",\n      IS_IFRAME ? \"iframe\" : \"page\"\n    );\n    return globalThis.__BUS;\n  })();\n  const RUNTIME = createRuntime(isBackground ? \"background\" : \"tab\", BUS);\n  const createNoopListeners = () => ({\n    addListener: (callback) => {\n      console.log(\"addListener\", callback);\n    },\n    removeListener: (callback) => {\n      console.log(\"removeListener\", callback);\n    },\n  });\n  // TODO: Stub\n  const storageChangeListeners = new Set();\n  function broadcastStorageChange(changes, areaName) {\n    storageChangeListeners.forEach((listener) => {\n      listener(changes, areaName);\n    });\n  }\n\n  // --- Chrome polyfill\n  let chrome = {\n    extension: {\n      isAllowedIncognitoAccess: () => Promise.resolve(true),\n      sendMessage: (...args) => _messagingHandler.sendMessage(...args),\n    },\n    permissions: {\n      request: (permissions, callback) => {\n        if (typeof callback === \"function\") {\n          callback(permissions);\n        }\n        return Promise.resolve(permissions);\n      },\n      contains: (permissions, callback) => {\n        if (typeof callback === \"function\") {\n          callback(true);\n        }\n        return Promise.resolve(true);\n      },\n    },\n    i18n: {\n      getUILanguage: () => {\n        return USED_LOCALE || \"en\";\n      },\n      getMessage: (key) => {\n        if (typeof LOCALE_KEYS !== \"undefined\" && LOCALE_KEYS[key]) {\n          return LOCALE_KEYS[key].message;\n        }\n        return key;\n      },\n    },\n    alarms: {\n      onAlarm: createNoopListeners(),\n      create: () => {\n        console.log(\"alarms.create\", arguments);\n      },\n      get: () => {\n        console.log(\"alarms.get\", arguments);\n      },\n    },\n    runtime: {\n      ...RUNTIME,\n      onInstalled: createNoopListeners(),\n      onStartup: createNoopListeners(),\n      openOptionsPage: () => {\n        const url = chrome.runtime.getURL(OPTIONS_PAGE_PATH);\n        console.log(\"openOptionsPage\", _openTab, url);\n        _openTab(url);\n      },\n      getManifest: () => {\n        // The manifest object will be injected into the scope where buildPolyfill is called\n        if (typeof INJECTED_MANIFEST !== \"undefined\") {\n          return JSON.parse(JSON.stringify(INJECTED_MANIFEST)); // Return deep copy\n        }\n        console.warn(\n          \"INJECTED_MANIFEST not found for chrome.runtime.getManifest\"\n        );\n        return { name: \"Unknown\", version: \"0.0\", manifest_version: 2 };\n      },\n      getURL: (path) => {\n        if (!path) return \"\";\n        if (path.startsWith(\"/\")) {\n          path = path.substring(1);\n        }\n\n        if (typeof _createAssetUrl === \"function\") {\n          return _createAssetUrl(path);\n        }\n\n        console.warn(\n          `chrome.runtime.getURL fallback for '${path}'. Assets may not be available.`\n        );\n        // Attempt a relative path resolution (highly context-dependent and likely wrong)\n        try {\n          if (window.location.protocol.startsWith(\"http\")) {\n            return new URL(path, window.location.href).toString();\n          }\n        } catch (e) {\n          /* ignore error, fallback */\n        }\n        return path;\n      },\n      id: \"polyfilled-extension-\" + Math.random().toString(36).substring(2, 15),\n      lastError: null,\n      getPlatformInfo: async () => {\n        const platform = {\n          os: \"unknown\",\n          arch: \"unknown\",\n          nacl_arch: \"unknown\",\n        };\n\n        if (typeof navigator !== \"undefined\") {\n          const userAgent = navigator.userAgent.toLowerCase();\n          if (userAgent.includes(\"mac\")) platform.os = \"mac\";\n          else if (userAgent.includes(\"win\")) platform.os = \"win\";\n          else if (userAgent.includes(\"linux\")) platform.os = \"linux\";\n          else if (userAgent.includes(\"android\")) platform.os = \"android\";\n          else if (userAgent.includes(\"ios\")) platform.os = \"ios\";\n\n          if (userAgent.includes(\"x86_64\") || userAgent.includes(\"amd64\")) {\n            platform.arch = \"x86-64\";\n          } else if (userAgent.includes(\"i386\") || userAgent.includes(\"i686\")) {\n            platform.arch = \"x86-32\";\n          } else if (userAgent.includes(\"arm\")) {\n            platform.arch = \"arm\";\n          }\n        }\n\n        return platform;\n      },\n      getBrowserInfo: async () => {\n        const info = {\n          name: \"unknown\",\n          version: \"unknown\",\n          buildID: \"unknown\",\n        };\n\n        if (typeof navigator !== \"undefined\") {\n          const userAgent = navigator.userAgent;\n          if (userAgent.includes(\"Chrome\")) {\n            info.name = \"Chrome\";\n            const match = userAgent.match(/Chrome\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          } else if (userAgent.includes(\"Firefox\")) {\n            info.name = \"Firefox\";\n            const match = userAgent.match(/Firefox\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          } else if (userAgent.includes(\"Safari\")) {\n            info.name = \"Safari\";\n            const match = userAgent.match(/Version\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          }\n        }\n\n        return info;\n      },\n    },\n    storage: {\n      local: {\n        get: function (keys, callback) {\n          if (typeof _storageGet !== \"function\")\n            throw new Error(\"_storageGet not defined\");\n\n          const promise = _storageGet(keys);\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.get callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.get error:\", error);\n                callback({});\n              });\n            return;\n          }\n\n          return promise;\n        },\n        set: function (items, callback) {\n          if (typeof _storageSet !== \"function\")\n            throw new Error(\"_storageSet not defined\");\n\n          const promise = _storageSet(items).then((result) => {\n            broadcastStorageChange(items, \"local\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.set callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.set error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        remove: function (keys, callback) {\n          if (typeof _storageRemove !== \"function\")\n            throw new Error(\"_storageRemove not defined\");\n\n          const promise = _storageRemove(keys).then((result) => {\n            const changes = {};\n            const keyList = Array.isArray(keys) ? keys : [keys];\n            keyList.forEach((key) => {\n              changes[key] = { oldValue: undefined, newValue: undefined };\n            });\n            broadcastStorageChange(changes, \"local\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.remove callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.remove error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        clear: function (callback) {\n          if (typeof _storageClear !== \"function\")\n            throw new Error(\"_storageClear not defined\");\n\n          const promise = _storageClear().then((result) => {\n            broadcastStorageChange({}, \"local\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.clear callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.clear error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        onChanged: {\n          addListener: (callback) => {\n            storageChangeListeners.add(callback);\n          },\n          removeListener: (callback) => {\n            storageChangeListeners.delete(callback);\n          },\n        },\n      },\n      sync: {\n        get: function (keys, callback) {\n          console.warn(\"chrome.storage.sync polyfill maps to local\");\n          return chrome.storage.local.get(keys, callback);\n        },\n        set: function (items, callback) {\n          console.warn(\"chrome.storage.sync polyfill maps to local\");\n\n          const promise = chrome.storage.local.set(items).then((result) => {\n            broadcastStorageChange(items, \"sync\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.sync.set callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.sync.set error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        remove: function (keys, callback) {\n          console.warn(\"chrome.storage.sync polyfill maps to local\");\n\n          const promise = chrome.storage.local.remove(keys).then((result) => {\n            const changes = {};\n            const keyList = Array.isArray(keys) ? keys : [keys];\n            keyList.forEach((key) => {\n              changes[key] = { oldValue: undefined, newValue: undefined };\n            });\n            broadcastStorageChange(changes, \"sync\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.sync.remove callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.sync.remove error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        clear: function (callback) {\n          console.warn(\"chrome.storage.sync polyfill maps to local\");\n\n          const promise = chrome.storage.local.clear().then((result) => {\n            broadcastStorageChange({}, \"sync\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error(\"Error in storage.sync.clear callback:\", e);\n                }\n              })\n              .catch((error) => {\n                console.error(\"Storage.sync.clear error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        onChanged: {\n          addListener: (callback) => {\n            storageChangeListeners.add(callback);\n          },\n          removeListener: (callback) => {\n            storageChangeListeners.delete(callback);\n          },\n        },\n      },\n      onChanged: {\n        addListener: (callback) => {\n          storageChangeListeners.add(callback);\n        },\n        removeListener: (callback) => {\n          storageChangeListeners.delete(callback);\n        },\n      },\n      managed: {\n        get: function (keys, callback) {\n          console.warn(\"chrome.storage.managed polyfill is read-only empty.\");\n\n          const promise = Promise.resolve({});\n\n          if (typeof callback === \"function\") {\n            promise.then((result) => {\n              try {\n                callback(result);\n              } catch (e) {\n                console.error(\"Error in storage.managed.get callback:\", e);\n              }\n            });\n            return;\n          }\n\n          return promise;\n        },\n      },\n    },\n    tabs: {\n      query: async (queryInfo) => {\n        console.warn(\n          \"chrome.tabs.query polyfill only returns current tab info.\"\n        );\n        const dummyId = Math.floor(Math.random() * 1000) + 1;\n        return [\n          {\n            id: dummyId,\n            url: window.location.href,\n            active: true,\n            windowId: 1,\n            status: \"complete\",\n          },\n        ];\n      },\n      create: async ({ url }) => {\n        console.log(`[Polyfill tabs.create] URL: ${url}`);\n        if (typeof _openTab !== \"function\")\n          throw new Error(\"_openTab not defined\");\n        _openTab(url);\n        const dummyId = Math.floor(Math.random() * 1000) + 1001;\n        return Promise.resolve({\n          id: dummyId,\n          url: url,\n          active: true,\n          windowId: 1,\n        });\n      },\n      sendMessage: async (tabId, message) => {\n        console.warn(\n          `chrome.tabs.sendMessage polyfill (to tab ${tabId}) redirects to runtime.sendMessage (current context).`\n        );\n        return chrome.runtime.sendMessage(message);\n      },\n    },\n    notifications: {\n      create: async (notificationId, options) => {\n        try {\n          let id = notificationId;\n          let notificationOptions = options;\n\n          if (typeof notificationId === \"object\" && notificationId !== null) {\n            notificationOptions = notificationId;\n            id = \"notification_\" + Math.random().toString(36).substring(2, 15);\n          } else if (typeof notificationId === \"string\" && options) {\n            id = notificationId;\n            notificationOptions = options;\n          } else {\n            throw new Error(\"Invalid parameters for notifications.create\");\n          }\n\n          if (!notificationOptions || typeof notificationOptions !== \"object\") {\n            throw new Error(\"Notification options must be an object\");\n          }\n\n          const {\n            title,\n            message,\n            iconUrl,\n            type = \"basic\",\n          } = notificationOptions;\n\n          if (!title || !message) {\n            throw new Error(\"Notification must have title and message\");\n          }\n\n          if (\"Notification\" in window) {\n            if (Notification.permission === \"granted\") {\n              const notification = new Notification(title, {\n                body: message,\n                icon: iconUrl,\n                tag: id,\n              });\n\n              console.log(`[Notifications] Created notification: ${id}`);\n              return id;\n            } else if (Notification.permission === \"default\") {\n              const permission = await Notification.requestPermission();\n              if (permission === \"granted\") {\n                const notification = new Notification(title, {\n                  body: message,\n                  icon: iconUrl,\n                  tag: id,\n                });\n                console.log(\n                  `[Notifications] Created notification after permission: ${id}`\n                );\n                return id;\n              } else {\n                console.warn(\n                  \"[Notifications] Permission denied for notifications\"\n                );\n                return id;\n              }\n            } else {\n              console.warn(\"[Notifications] Notifications are blocked\");\n              return id;\n            }\n          } else {\n            console.warn(\n              \"[Notifications] Native notifications not supported, using console fallback\"\n            );\n            console.log(`[Notification] ${title}: ${message}`);\n            return id;\n          }\n        } catch (error) {\n          console.error(\n            \"[Notifications] Error creating notification:\",\n            error.message\n          );\n          throw error;\n        }\n      },\n      clear: async (notificationId) => {\n        console.log(`[Notifications] Clear notification: ${notificationId}`);\n        // For native notifications, there's no direct way to clear by ID\n        // This is a limitation of the Web Notifications API\n        return true;\n      },\n      getAll: async () => {\n        console.warn(\"[Notifications] getAll not fully supported in polyfill\");\n        return {};\n      },\n      getPermissionLevel: async () => {\n        if (\"Notification\" in window) {\n          const permission = Notification.permission;\n          return { level: permission === \"granted\" ? \"granted\" : \"denied\" };\n        }\n        return { level: \"denied\" };\n      },\n    },\n    contextMenus: {\n      create: (createProperties, callback) => {\n        try {\n          if (!createProperties || typeof createProperties !== \"object\") {\n            throw new Error(\"Context menu create properties must be an object\");\n          }\n\n          const { id, title, contexts = [\"page\"], onclick } = createProperties;\n          const menuId =\n            id || `menu_${Math.random().toString(36).substring(2, 15)}`;\n\n          if (!title || typeof title !== \"string\") {\n            throw new Error(\"Context menu must have a title\");\n          }\n\n          // Store menu items for potential use\n          if (!window._polyfillContextMenus) {\n            window._polyfillContextMenus = new Map();\n          }\n\n          window._polyfillContextMenus.set(menuId, {\n            id: menuId,\n            title,\n            contexts,\n            onclick,\n            enabled: createProperties.enabled !== false,\n          });\n\n          console.log(\n            `[ContextMenus] Created context menu item: ${title} (${menuId})`\n          );\n\n          // Try to register a menu command as fallback\n          if (typeof _registerMenuCommand === \"function\") {\n            try {\n              _registerMenuCommand(\n                title,\n                onclick ||\n                  (() => {\n                    console.log(`Context menu clicked: ${title}`);\n                  })\n              );\n            } catch (e) {\n              console.warn(\n                \"[ContextMenus] Failed to register as menu command:\",\n                e.message\n              );\n            }\n          }\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n\n          return menuId;\n        } catch (error) {\n          console.error(\n            \"[ContextMenus] Error creating context menu:\",\n            error.message\n          );\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n          throw error;\n        }\n      },\n      update: (id, updateProperties, callback) => {\n        try {\n          if (\n            !window._polyfillContextMenus ||\n            !window._polyfillContextMenus.has(id)\n          ) {\n            throw new Error(`Context menu item not found: ${id}`);\n          }\n\n          const menuItem = window._polyfillContextMenus.get(id);\n          Object.assign(menuItem, updateProperties);\n\n          console.log(`[ContextMenus] Updated context menu item: ${id}`);\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          console.error(\n            \"[ContextMenus] Error updating context menu:\",\n            error.message\n          );\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      remove: (menuItemId, callback) => {\n        try {\n          if (\n            window._polyfillContextMenus &&\n            window._polyfillContextMenus.has(menuItemId)\n          ) {\n            window._polyfillContextMenus.delete(menuItemId);\n            console.log(\n              `[ContextMenus] Removed context menu item: ${menuItemId}`\n            );\n          } else {\n            console.warn(\n              `[ContextMenus] Context menu item not found for removal: ${menuItemId}`\n            );\n          }\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          console.error(\n            \"[ContextMenus] Error removing context menu:\",\n            error.message\n          );\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      removeAll: (callback) => {\n        try {\n          if (window._polyfillContextMenus) {\n            const count = window._polyfillContextMenus.size;\n            window._polyfillContextMenus.clear();\n            console.log(\n              `[ContextMenus] Removed all ${count} context menu items`\n            );\n          }\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          console.error(\n            \"[ContextMenus] Error removing all context menus:\",\n            error.message\n          );\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      onClicked: {\n        addListener: (callback) => {\n          if (!window._polyfillContextMenuListeners) {\n            window._polyfillContextMenuListeners = new Set();\n          }\n          window._polyfillContextMenuListeners.add(callback);\n          console.log(\"[ContextMenus] Added click listener\");\n        },\n        removeListener: (callback) => {\n          if (window._polyfillContextMenuListeners) {\n            window._polyfillContextMenuListeners.delete(callback);\n            console.log(\"[ContextMenus] Removed click listener\");\n          }\n        },\n      },\n    },\n  };\n\n  const tc = (fn) => {\n    try {\n      fn();\n    } catch (e) {}\n  };\n  const loggingProxyHandler = (_key) => ({\n    get(target, key, receiver) {\n      tc(() =>\n        console.log(`[${contextType}] [CHROME - ${_key}] Getting ${key}`)\n      );\n      return Reflect.get(target, key, receiver);\n    },\n    set(target, key, value, receiver) {\n      tc(() =>\n        console.log(\n          `[${contextType}] [CHROME - ${_key}] Setting ${key} to ${value}`\n        )\n      );\n      return Reflect.set(target, key, value, receiver);\n    },\n    has(target, key) {\n      tc(() =>\n        console.log(\n          `[${contextType}] [CHROME - ${_key}] Checking if ${key} exists`\n        )\n      );\n      return Reflect.has(target, key);\n    },\n  });\n  chrome = Object.fromEntries(\n    Object.entries(chrome).map(([key, value]) => [\n      key,\n      new Proxy(value, loggingProxyHandler(key)),\n    ])\n  );\n\n  // Alias browser to chrome for common Firefox pattern\n  const browser = new Proxy(chrome, loggingProxyHandler);\n\n  const oldGlobalThis = globalThis;\n  const oldWindow = window;\n  const oldSelf = self;\n  const oldGlobal = globalThis;\n  const __globalsStorage = {};\n\n  const TO_MODIFY = [oldGlobalThis, oldWindow, oldSelf, oldGlobal];\n  const set = (k, v) => {\n    __globalsStorage[k] = v;\n    TO_MODIFY.forEach((target) => {\n      target[k] = v;\n    });\n  };\n  const proxyHandler = {\n    get(target, key, receiver) {\n      return __globalsStorage[key] || Reflect.get(target, key, receiver);\n    },\n    set(target, key, value, receiver) {\n      tc(() => console.log(`[${contextType}] Setting ${key} to ${value}`));\n      set(key, value);\n      return Reflect.set(target, key, value, receiver);\n    },\n    has(target, key) {\n      return key in __globalsStorage || key in target;\n    },\n    getOwnPropertyDescriptor(target, key) {\n      if (key in __globalsStorage) {\n        return {\n          configurable: true,\n          enumerable: true,\n          writable: true,\n          value: __globalsStorage[key],\n        };\n      }\n      // fall back to the real globalThis\n      const desc = Reflect.getOwnPropertyDescriptor(target, key);\n      // ensure it's configurable so the with‑scope binding logic can override it\n      if (desc && !desc.configurable) {\n        desc.configurable = true;\n      }\n      return desc;\n    },\n\n    defineProperty(target, key, descriptor) {\n      // Normalize descriptor to avoid mixed accessor & data attributes\n      const hasAccessor = \"get\" in descriptor || \"set\" in descriptor;\n\n      if (hasAccessor) {\n        // Build a clean descriptor without value/writable when accessors present\n        const normalized = {\n          configurable:\n            \"configurable\" in descriptor ? descriptor.configurable : true,\n          enumerable:\n            \"enumerable\" in descriptor ? descriptor.enumerable : false,\n        };\n        if (\"get\" in descriptor) normalized.get = descriptor.get;\n        if (\"set\" in descriptor) normalized.set = descriptor.set;\n\n        // Store accessor references for inspection but avoid breaking invariants\n        set(key, {\n          get: descriptor.get,\n          set: descriptor.set,\n        });\n\n        return Reflect.defineProperty(target, key, normalized);\n      }\n\n      // Data descriptor path\n      set(key, descriptor.value);\n      return Reflect.defineProperty(target, key, descriptor);\n    },\n  };\n\n  // Create proxies once proxyHandler is defined\n  const proxyWindow = new Proxy(oldWindow, proxyHandler);\n  const proxyGlobalThis = new Proxy(oldGlobalThis, proxyHandler);\n  const proxyGlobal = new Proxy(oldGlobal, proxyHandler);\n  const proxySelf = new Proxy(oldSelf, proxyHandler);\n\n  // Seed storage with core globals so lookups succeed inside `with` blocks\n  Object.assign(__globalsStorage, {\n    chrome,\n    browser,\n    window: proxyWindow,\n    globalThis: proxyGlobalThis,\n    global: proxyGlobal,\n    self: proxySelf,\n  });\n\n  const __globals = {\n    chrome,\n    browser,\n    window: proxyWindow,\n    globalThis: proxyGlobalThis,\n    global: proxyGlobal,\n    self: proxySelf,\n    __globals: __globalsStorage,\n  };\n\n  __globalsStorage.contextId = contextId;\n  __globalsStorage.contextType = contextType;\n  __globalsStorage.module = undefined;\n  __globalsStorage.amd = undefined;\n  __globalsStorage.define = undefined;\n\n  return __globals;\n}\n\n\nif (typeof window !== 'undefined') {\n    window.buildPolyfill = buildPolyfill;\n}\n"
			    let newMap = JSON.parse(JSON.stringify(EXTENSION_ASSETS_MAP));
			    delete newMap[OPTIONS_PAGE_PATH];
			    const PASS_ON = {
			        LOCALE_KEYS,
			        INJECTED_MANIFEST,
			        USED_LOCALE,
			        EXTENSION_ICON,
			    }
			    return `
			        ${Object.entries(PASS_ON).map(i => `const ${i[0]} = ${JSON.stringify(i[1])};`).join('\n')}
			
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
			
			    if (typeof _initStorage === 'function') {
			        try {
			            await _initStorage();
			            console.log(`[${SCRIPT_NAME}] Storage initialized.`);
			        } catch (e) {
			            console.error('Error during storage initialization:', e);
			        }
			    }
			
			    console.log(`[${SCRIPT_NAME}] Starting content scripts...`);
			
			    const currentUrl = window.location.href;
			    let shouldRunAnyScript = false;
			    console.log(`[${SCRIPT_NAME}] Checking URL: ${currentUrl}`);
			
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
			                    console.error(`[${SCRIPT_NAME}] Error testing match pattern "${pattern}":`, e);
			                    return false;
			                }
			            })) {
			                shouldRunAnyScript = true;
			                console.log(`[${SCRIPT_NAME}] URL match found via config:`, config);
			                break;
			            }
			        }
			    } else {
			        console.log(`[${SCRIPT_NAME}] No content script configurations found in manifest data.`);
			    }
			
			
			    if (shouldRunAnyScript) {
			        let polyfillContext;
			        try {
			            polyfillContext = buildPolyfill({ isBackground: false });
			        } catch (e) {
			            console.error(`[${SCRIPT_NAME}] Failed to build polyfill:`, e);
			            return;
			        }
			
			        console.log(`[${SCRIPT_NAME}] Polyfill built. Executing combined script logic...`);
			        // async function executeAllScripts({chrome, browser, global, window, globalThis, self, __globals}, extensionCssData) {
			        await executeAllScripts.call(polyfillContext.globalThis, polyfillContext, extensionCssData);
			
			    } else {
			        console.log(`[${SCRIPT_NAME}] No matching content script patterns for this URL. No scripts will be executed.`);
			    }
			
			    if (OPTIONS_PAGE_PATH) {
			        if (typeof _registerMenuCommand === 'function') {
			            try {
			                _registerMenuCommand('Open Options', openOptionsPage);
			                console.log(`[${SCRIPT_NAME}] Options menu command registered.`);
			            } catch(e) {
			                console.error('Failed to register menu command', e);
			            }
			        }
			    }
			
			    if (POPUP_PAGE_PATH) {
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