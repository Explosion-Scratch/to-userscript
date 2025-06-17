// ==UserScript==
// @name        Web Search Navigator
// @version     0.5.2
// @description Keyboard shortcuts for Google search, YouTube, Startpage, Brave Search, Google Scholar, Github, and Amazon.
// @namespace   web-search-navigator
// @author      Converter Script
// @require     data:text/javascript;base64,Ly8gTmVlZGVkIG9uIHNvbWUgc2l0ZXMgZm9yIHNjcmlwdHMgdG8gc2V0IC5pbm5lckhUTUwgb2YgdGhpbmdzLgpjb25zdCBvdmVyd3JpdGVfZGVmYXVsdCA9IHRydWU7CmNvbnN0IHBhc3NUaHJvdWdoRnVuYyA9IChzdHJpbmcpID0+IHN0cmluZzsKY29uc3QgVFRQTmFtZSA9ICJwYXNzdGhyb3VnaCI7CmxldCBUVFBfZGVmYXVsdCwKICBUVFAgPSB7CiAgICBjcmVhdGVIVE1MOiBwYXNzVGhyb3VnaEZ1bmMsCiAgICBjcmVhdGVTY3JpcHQ6IHBhc3NUaHJvdWdoRnVuYywKICAgIGNyZWF0ZVNjcmlwdFVSTDogcGFzc1Rocm91Z2hGdW5jLAogIH07CmxldCBuZWVkc1RydXN0ZWRIVE1MID0gZmFsc2U7Cgpjb25zdCBkb2l0ID0gKCkgPT4gewogIHRyeSB7CiAgICBpZiAoCiAgICAgIHR5cGVvZiB3aW5kb3cuaXNTZWN1cmVDb250ZXh0ICE9PSAidW5kZWZpbmVkIiAmJgogICAgICB3aW5kb3cuaXNTZWN1cmVDb250ZXh0CiAgICApIHsKICAgICAgaWYgKHdpbmRvdy50cnVzdGVkVHlwZXMgJiYgd2luZG93LnRydXN0ZWRUeXBlcy5jcmVhdGVQb2xpY3kpIHsKICAgICAgICBuZWVkc1RydXN0ZWRIVE1MID0gdHJ1ZTsKICAgICAgICBpZiAodHJ1c3RlZFR5cGVzLmRlZmF1bHRQb2xpY3kpIHsKICAgICAgICAgIGxvZygiVFQgRGVmYXVsdCBQb2xpY3kgZXhpc3RzIik7CiAgICAgICAgICBpZiAob3ZlcndyaXRlX2RlZmF1bHQpCiAgICAgICAgICAgIFRUUCA9IHdpbmRvdy50cnVzdGVkVHlwZXMuY3JlYXRlUG9saWN5KCJkZWZhdWx0IiwgVFRQKTsKICAgICAgICAgIGVsc2UgVFRQID0gd2luZG93LnRydXN0ZWRUeXBlcy5jcmVhdGVQb2xpY3koVFRQTmFtZSwgVFRQKTsKICAgICAgICAgIFRUUF9kZWZhdWx0ID0gdHJ1c3RlZFR5cGVzLmRlZmF1bHRQb2xpY3k7CiAgICAgICAgICBsb2coCiAgICAgICAgICAgIGBDcmVhdGVkIGN1c3RvbSBwYXNzdGhyb3VnaCBwb2xpY3ksIGluIGNhc2UgdGhlIGRlZmF1bHQgcG9saWN5IGlzIHRvbyByZXN0cmljdGl2ZTogVXNlIFBvbGljeSAnJHtUVFBOYW1lfScgaW4gdmFyICdUVFAnOmAsCiAgICAgICAgICAgIFRUUCwKICAgICAgICAgICk7CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgIFRUUF9kZWZhdWx0ID0gVFRQID0gd2luZG93LnRydXN0ZWRUeXBlcy5jcmVhdGVQb2xpY3koImRlZmF1bHQiLCBUVFApOwogICAgICAgIH0KICAgICAgICBsb2coIlRydXN0ZWQtVHlwZSBQb2xpY2llczogVFRQOiIsIFRUUCwgIlRUUF9kZWZhdWx0OiIsIFRUUF9kZWZhdWx0KTsKICAgICAgfQogICAgfQogIH0gY2F0Y2ggKGUpIHsKICAgIGxvZyhlKTsKICB9Cn07Cgpjb25zdCBsb2cgPSAoLi4uYXJncykgPT4gewogIGNvbnNvbGUubG9nKC4uLmFyZ3MpOwp9OwoKZG9pdCgpOwo=
// @match       *://www.google.com/search*
// @match       *://www.google.ad/search*
// @match       *://www.google.ae/search*
// @match       *://www.google.com.af/search*
// @match       *://www.google.com.ag/search*
// @match       *://www.google.com.ai/search*
// @match       *://www.google.al/search*
// @match       *://www.google.am/search*
// @match       *://www.google.co.ao/search*
// @match       *://www.google.com.ar/search*
// @match       *://www.google.as/search*
// @match       *://www.google.at/search*
// @match       *://www.google.com.au/search*
// @match       *://www.google.az/search*
// @match       *://www.google.ba/search*
// @match       *://www.google.com.bd/search*
// @match       *://www.google.be/search*
// @match       *://www.google.bf/search*
// @match       *://www.google.bg/search*
// @match       *://www.google.com.bh/search*
// @match       *://www.google.bi/search*
// @match       *://www.google.bj/search*
// @match       *://www.google.com.bn/search*
// @match       *://www.google.com.bo/search*
// @match       *://www.google.com.br/search*
// @match       *://www.google.bs/search*
// @match       *://www.google.bt/search*
// @match       *://www.google.co.bw/search*
// @match       *://www.google.by/search*
// @match       *://www.google.com.bz/search*
// @match       *://www.google.ca/search*
// @match       *://www.google.cd/search*
// @match       *://www.google.cf/search*
// @match       *://www.google.cg/search*
// @match       *://www.google.ch/search*
// @match       *://www.google.ci/search*
// @match       *://www.google.co.ck/search*
// @match       *://www.google.cl/search*
// @match       *://www.google.cm/search*
// @match       *://www.google.cn/search*
// @match       *://www.google.com.co/search*
// @match       *://www.google.co.cr/search*
// @match       *://www.google.com.cu/search*
// @match       *://www.google.cv/search*
// @match       *://www.google.com.cy/search*
// @match       *://www.google.cz/search*
// @match       *://www.google.de/search*
// @match       *://www.google.dj/search*
// @match       *://www.google.dk/search*
// @match       *://www.google.dm/search*
// @match       *://www.google.com.do/search*
// @match       *://www.google.dz/search*
// @match       *://www.google.com.ec/search*
// @match       *://www.google.ee/search*
// @match       *://www.google.com.eg/search*
// @match       *://www.google.es/search*
// @match       *://www.google.com.et/search*
// @match       *://www.google.fi/search*
// @match       *://www.google.com.fj/search*
// @match       *://www.google.fm/search*
// @match       *://www.google.fr/search*
// @match       *://www.google.ga/search*
// @match       *://www.google.ge/search*
// @match       *://www.google.gg/search*
// @match       *://www.google.com.gh/search*
// @match       *://www.google.com.gi/search*
// @match       *://www.google.gl/search*
// @match       *://www.google.gm/search*
// @match       *://www.google.gp/search*
// @match       *://www.google.gr/search*
// @match       *://www.google.com.gt/search*
// @match       *://www.google.gy/search*
// @match       *://www.google.com.hk/search*
// @match       *://www.google.hn/search*
// @match       *://www.google.hr/search*
// @match       *://www.google.ht/search*
// @match       *://www.google.hu/search*
// @match       *://www.google.co.id/search*
// @match       *://www.google.ie/search*
// @match       *://www.google.co.il/search*
// @match       *://www.google.im/search*
// @match       *://www.google.co.in/search*
// @match       *://www.google.iq/search*
// @match       *://www.google.is/search*
// @match       *://www.google.it/search*
// @match       *://www.google.je/search*
// @match       *://www.google.com.jm/search*
// @match       *://www.google.jo/search*
// @match       *://www.google.co.jp/search*
// @match       *://www.google.co.ke/search*
// @match       *://www.google.com.kh/search*
// @match       *://www.google.ki/search*
// @match       *://www.google.kg/search*
// @match       *://www.google.co.kr/search*
// @match       *://www.google.com.kw/search*
// @match       *://www.google.kz/search*
// @match       *://www.google.la/search*
// @match       *://www.google.com.lb/search*
// @match       *://www.google.li/search*
// @match       *://www.google.lk/search*
// @match       *://www.google.co.ls/search*
// @match       *://www.google.lt/search*
// @match       *://www.google.lu/search*
// @match       *://www.google.lv/search*
// @match       *://www.google.com.ly/search*
// @match       *://www.google.co.ma/search*
// @match       *://www.google.md/search*
// @match       *://www.google.me/search*
// @match       *://www.google.mg/search*
// @match       *://www.google.mk/search*
// @match       *://www.google.ml/search*
// @match       *://www.google.com.mm/search*
// @match       *://www.google.mn/search*
// @match       *://www.google.ms/search*
// @match       *://www.google.com.mt/search*
// @match       *://www.google.mu/search*
// @match       *://www.google.mv/search*
// @match       *://www.google.mw/search*
// @match       *://www.google.com.mx/search*
// @match       *://www.google.com.my/search*
// @match       *://www.google.co.mz/search*
// @match       *://www.google.com.na/search*
// @match       *://www.google.com.nf/search*
// @match       *://www.google.com.ng/search*
// @match       *://www.google.com.ni/search*
// @match       *://www.google.ne/search*
// @match       *://www.google.nl/search*
// @match       *://www.google.no/search*
// @match       *://www.google.com.np/search*
// @match       *://www.google.nr/search*
// @match       *://www.google.nu/search*
// @match       *://www.google.co.nz/search*
// @match       *://www.google.com.om/search*
// @match       *://www.google.com.pa/search*
// @match       *://www.google.com.pe/search*
// @match       *://www.google.com.pg/search*
// @match       *://www.google.com.ph/search*
// @match       *://www.google.com.pk/search*
// @match       *://www.google.pl/search*
// @match       *://www.google.pn/search*
// @match       *://www.google.com.pr/search*
// @match       *://www.google.ps/search*
// @match       *://www.google.pt/search*
// @match       *://www.google.com.py/search*
// @match       *://www.google.com.qa/search*
// @match       *://www.google.ro/search*
// @match       *://www.google.ru/search*
// @match       *://www.google.rw/search*
// @match       *://www.google.com.sa/search*
// @match       *://www.google.com.sb/search*
// @match       *://www.google.sc/search*
// @match       *://www.google.se/search*
// @match       *://www.google.com.sg/search*
// @match       *://www.google.sh/search*
// @match       *://www.google.si/search*
// @match       *://www.google.sk/search*
// @match       *://www.google.com.sl/search*
// @match       *://www.google.sn/search*
// @match       *://www.google.so/search*
// @match       *://www.google.sm/search*
// @match       *://www.google.sr/search*
// @match       *://www.google.st/search*
// @match       *://www.google.com.sv/search*
// @match       *://www.google.td/search*
// @match       *://www.google.tg/search*
// @match       *://www.google.co.th/search*
// @match       *://www.google.com.tj/search*
// @match       *://www.google.tk/search*
// @match       *://www.google.tl/search*
// @match       *://www.google.tm/search*
// @match       *://www.google.tn/search*
// @match       *://www.google.to/search*
// @match       *://www.google.com.tr/search*
// @match       *://www.google.tt/search*
// @match       *://www.google.com.tw/search*
// @match       *://www.google.co.tz/search*
// @match       *://www.google.com.ua/search*
// @match       *://www.google.co.ug/search*
// @match       *://www.google.co.uk/search*
// @match       *://www.google.com.uy/search*
// @match       *://www.google.co.uz/search*
// @match       *://www.google.com.vc/search*
// @match       *://www.google.co.ve/search*
// @match       *://www.google.vg/search*
// @match       *://www.google.co.vi/search*
// @match       *://www.google.com.vn/search*
// @match       *://www.google.vu/search*
// @match       *://www.google.ws/search*
// @match       *://www.google.rs/search*
// @match       *://www.google.co.za/search*
// @match       *://www.google.co.zm/search*
// @match       *://www.google.co.zw/search*
// @match       *://www.google.cat/search*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @icon        data:image/png;base64,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
// @run-at      document-end
// ==/UserScript==

(function () {
  // #region Unified Polyfill
	
	  // This contains all necessary code to create a complete polyfill environment
	
  // #region Messaging implementation
		
		  function createEventBus(
		    scopeId,
		    type = "page", // "page" or "iframe"
		    { allowedOrigin = "*", children = [], parentWindow = null } = {},
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
		      emit(event, payload) {
		        // dispatch locally first
		        (handlers[event] || []).forEach((fn) =>
		          fn(payload, { origin: location.origin, source: window }),
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
		
		        const promises = results.filter(
		          (r) => r && typeof r.then === "function",
		        );
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
			        console.error(
			          "_storageRemove error: Invalid keys format",
			          keysToRemove,
			        );
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
			                  return Promise.reject(
			                    new SyntaxError("Could not parse JSON"),
			                  );
			                }
			              },
			              blob: () => {
			                if (response.response instanceof Blob) {
			                  return Promise.resolve(response.response);
			                }
			                return Promise.reject(
			                  new Error(
			                    "Requires responseType:'blob' in GM_xmlhttpRequest",
			                  ),
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
			      console.warn(
			        "GM_openInTab not available, using window.open as fallback.",
			      );
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
			    "options_page.html":
			      '<!DOCTYPE html>\n<html>\n\n<head>\n    <title>Options for Web Search Navigator</title>\n    <link rel="stylesheet" href="data:text/css;base64,Ym9keSB7CiAgd2lkdGg6IDQwMHB4Owp9CgpzZWN0aW9uIHsKICBtYXJnaW4tYm90dG9tOiAxMHB4Owp9CgpoMiB7CiAgZm9udC1zaXplOiAxLjRlbTsKICBmb250LXdlaWdodDogNTUwOwogIG1hcmdpbi10b3A6IDEwcHg7CiAgbWFyZ2luLWJvdHRvbTogMTBweDsKfQoKaDMgewogIGZvbnQtc2l6ZTogMS4yZW07CiAgZm9udC13ZWlnaHQ6IDQ1MDsKICBtYXJnaW4tdG9wOiAxMHB4OwogIG1hcmdpbi1ib3R0b206IDVweDsKfQoKc3VtbWFyeSB7CiAgbWFyZ2luLXRvcDogNXB4OwogIG1hcmdpbi1ib3R0b206IDVweDsKfQoKZGV0YWlscyB7CiAgbWFyZ2luLWJvdHRvbTogNXB4Owp9CgpzdW1tYXJ5IGgzLApzdW1tYXJ5IGgyIHsKICBkaXNwbGF5OiBpbmxpbmU7Cn0KCi5vcHRpb24gewogIG1hcmdpbi1ib3R0b206IDVweDsKfQoKLm9wdGlvbi1kZXNjIHsKICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7CiAgd2lkdGg6IDQ4JTsKfQoKLmlucHV0LWtleWJpbmRpbmcgewogIG1hcmdpbi1sZWZ0OiBhdXRvOwogIG1hcmdpbi1yaWdodDogMDsKICB3aWR0aDogNDglOwp9CgouaGVscCB7CiAgZm9udC13ZWlnaHQ6IDM1MDsKfQoKI2N1c3RvbS1jc3MtdGV4dGFyZWEgewogIHdpZHRoOiAxMDAlOwogIGhlaWdodDogNDAwcHg7Cn0KCi5zZWFyY2gtZW5naW5lLWNoZWNrYm94IHsKICBkaXNwbGF5OiBibG9jazsKfQoKI2RlbGF5LWNvbnRhaW5lciB7CiAgbWFyZ2luLXRvcDogNXB4Owp9CgojZGVsYXkgewogIHdpZHRoOiA3NXB4OwogIG1hcmdpbi1yaWdodDogNXB4Owp9Cgojc3RhdHVzIHsKICBmb250LXdlaWdodDogYm9sZDsKfQoKI2J1dHRvbnMtY29udGFpbmVyIGJ1dHRvbiB7CiAgbWFyZ2luLXRvcDogNXB4OwogIG1hcmdpbi1ib3R0b206IDVweDsKfQoKLyogRmlyZWZveCBzcGVjaWZpYyBvdmVycmlkZXMgKi8KQC1tb3otZG9jdW1lbnQgdXJsLXByZWZpeCgiIikgewogIGJvZHkgewogICAgd2lkdGg6IDYwMHB4OwogICAgLyogV2l0aG91dCB0aGlzLCB0aGUgRmlyZWZveCBvcHRpb25zIHBhZ2UgYm9keSBpcyBjbG9zZSB0byB0aGUgYm9yZGVyICovCiAgICBtYXJnaW4tbGVmdDogMTBweDsKICB9CgogIC5vcHRpb24tZGVzYyB7CiAgICB3aWR0aDogMjgwcHg7CiAgfQoKICAjY3VzdG9tLWNzcy10ZXh0YXJlYSB7CiAgICB3aWR0aDogNjAwcHg7CiAgICBoZWlnaHQ6IDYwMHB4OwogIH0KfQo=">\n</head>\n\n<body>\n    <section id="general-settings-container">\n        <h2>General settings</h2>\n        <div class="option">\n            <label for="wrap-navigation">\n                <input type="checkbox" id="wrap-navigation"> Wrap around when navigating before/after the first/last search result\n            </label>\n        </div>\n        <div class="option">\n            <label for="auto-select-first">\n                <input type="checkbox" id="auto-select-first"> Focus on first search result automatically after the page loads\n            </label>\n        </div>\n    </section>\n    <section id="google-settings-container">\n        <h2>Google specific settings</h2>\n        <div class="option">\n            <label for="google-include-cards">\n                <input type="checkbox" id="google-include-cards"> Include cards (top stories, twitter, videos) in regular Google search page\n            </label>\n        </div>\n        <div class="option">\n            <label for="google-include-places">\n                <input type="checkbox" id="google-include-places"> Include Places in regular Google search page\n            </label>\n        </div>\n        <div class="option">\n            <label for="google-include-memex">\n                <input type="checkbox" id="google-include-memex"> Include WorldBrain\'s Memex extension results in Google search page\n            </label>\n        </div>\n    </section>\n    <section id="keybindings-container">\n        <h2>Keybindings</h2>\n        <details>\n            <summary><h3>Help</h3></summary>\n            <div class="help">\n                All keybindings should be specified in\n                <a href="https://github.com/ccampbell/mousetrap" target="_blank">Mousetrap</a> format. Examples:\n                <ul>\n                    <li>\n                        <kbd class="keybinding">a</kbd>\n                    </li>\n                    <li>\n                        <kbd class="keybinding">z y</kbd>\n                    </li>\n                    <li>\n                        <kbd class="keybinding">ctrl+a</kbd>\n                    </li>\n                    <li>\n                        <kbd class="keybinding">command+a</kbd>\n                    </li>\n                    <li>\n                        <kbd class="keybinding">a, ctrl+b, z y, command+c</kbd> - multiple shortcuts that will be treated equivalently</li>\n                </ul>\n                Special keys names: backspace, tab, clear, enter, return, esc, escape, space, up, down, left, right, home, end, pageup, pagedown,\n                del, delete, and f1 through f19. In order to disable a keybinding, delete its keybinding in the textbox.\n\n                Note that not all search engines support all the keybindings.\n            </div>\n        </details>\n        <details>\n            <summary><h3>Common actions</h3></summary>\n            <div class="option">\n                <label for="next-key" class="option-desc">Next search result</label>\n                <input id="next-key" class="input-keybinding" type="text" value="down, j">\n            </div>\n            <div class="option">\n                <label for="previous-key" class="option-desc">Previous search result</label>\n                <input id="previous-key" class="input-keybinding" type="text" value="up, k">\n            </div>\n            <div class="option">\n                <label for="navigate-key" class="option-desc">Open</label>\n                <input id="navigate-key" class="input-keybinding" type="text" value="return, space">\n            </div>\n            <div class="option">\n                <label for="navigate-new-tab-background-key" class="option-desc">Open in a new background tab</label>\n                <input id="navigate-new-tab-background-key" class="input-keybinding" type="text" value="ctrl+shift+return, command+shift+return, ctrl+shift+space">\n            </div>\n            <div class="option">\n                <label for="navigate-new-tab-key" class="option-desc">Open in a new window/tab</label>\n                <input id="navigate-new-tab-key" class="input-keybinding" type="text" value="ctrl+return, command+return, ctrl+space">\n            </div>\n            <div class="option">\n                <label for="focus-search-input" class="option-desc">Focus search box</label>\n                <input id="focus-search-input" class="input-keybinding" type="text" value="/, escape">\n            </div>\n            <div class="option">\n                <label for="navigate-next-result-page" class="option-desc">Next page</label>\n                <input id="navigate-next-result-page" class="input-keybinding" type="text" value="right">\n            </div>\n            <div class="option">\n                <label for="navigate-previous-result-page" class="option-desc">Previous page</label>\n                <input id="navigate-previous-result-page" class="input-keybinding" type="text" value="left">\n            </div>\n        </details>\n        <details>\n            <summary><h3>Results filtering</h3></summary>\n            <div class="option">\n                <label for="navigate-show-all" class="option-desc">Turn off filter (show all results)</label>\n                <input id="navigate-show-all" class="input-keybinding" type="text" value="z z, ctrl-shift-a">\n            </div>\n            <div class="option">\n                <label for="navigate-show-hour" class="option-desc">Filter results by past hour</label>\n                <input id="navigate-show-hour" class="input-keybinding" type="text" value="z h, ctrl-shift-h">\n            </div>\n            <div class="option">\n                <label for="navigate-show-day" class="option-desc">Filter results by past 24 hours</label>\n                <input id="navigate-show-day" class="input-keybinding" type="text" value="z d, ctrl-shift-d">\n            </div>\n            <div class="option">\n                <label for="navigate-show-week" class="option-desc">Filter results by past week</label>\n                <input id="navigate-show-week" class="input-keybinding" type="text" value="z w, ctrl-shift-w">\n            </div>\n            <div class="option">\n                <label for="navigate-show-month" class="option-desc">Filter results by past month</label>\n                <input id="navigate-show-month" class="input-keybinding" type="text" value="z m, ctrl-shift-m">\n            </div>\n            <div class="option">\n                <label for="navigate-show-year" class="option-desc">Filter results by past year</label>\n                <input id="navigate-show-year" class="input-keybinding" type="text" value="z y, ctrl-shift-y">\n            </div>\n            <div class="option">\n                <label for="toggle-sort" class="option-desc">Toggle sort by date/relevance</label>\n                <input id="toggle-sort" class="input-keybinding" type="text" value="z s, ctrl-shift-s">\n            </div>\n            <div class="option">\n                <label for="toggle-verbatim-search" class="option-desc">Toggle verbatim search</label>\n                <input id="toggle-verbatim-search" class="input-keybinding" type="text" value="z v, ctrl-shift-v">\n            </div>\n            <div class="option">\n                <label for="show-images-large" class="option-desc">Filter image results by large size</label>\n                <input id="show-images-large" class="input-keybinding" type="text" value="z l">\n            </div>\n            <div class="option">\n                <label for="show-images-medium" class="option-desc">Filter image results by medium size</label>\n                <input id="show-images-medium" class="input-keybinding" type="text" value="z e">\n            </div>\n            <div class="option">\n                <label for="show-images-icon" class="option-desc">Filter image results by icon size</label>\n                <input id="show-images-icon" class="input-keybinding" type="text" value="z i">\n            </div>\n        </details>\n        <details>\n            <summary><h3>Google and Startpage</h3></summary>\n            <div class="option">\n                <label for="navigate-search-tab" class="option-desc">Go to All (= default search tab)</label>\n                <input id="navigate-search-tab" class="input-keybinding" type="text" value="a, s">\n            </div>\n            <div class="option">\n                <label for="navigate-images-tab" class="option-desc">Go to Images</label>\n                <input id="navigate-images-tab" class="input-keybinding" type="text" value="i">\n            </div>\n            <div class="option">\n                <label for="navigate-videos-tab" class="option-desc">Go to Videos</label>\n                <input id="navigate-videos-tab" class="input-keybinding" type="text" value="v">\n            </div>\n            <div class="option">\n                <label for="navigate-maps-tab" class="option-desc">Go to Maps</label>\n                <input id="navigate-maps-tab" class="input-keybinding" type="text" value="m">\n            </div>\n            <div class="option">\n                <label for="navigate-news-tab" class="option-desc">Go to News</label>\n                <input id="navigate-news-tab" class="input-keybinding" type="text" value="n">\n            </div>\n            <div class="option">\n                <label for="navigate-shopping-tab" class="option-desc">Go to Shopping</label>\n                <input id="navigate-shopping-tab" class="input-keybinding" type="text" value="alt+n">\n            </div>\n            <div class="option">\n                <label for="navigate-books-tab" class="option-desc">Go to Books</label>\n                <input id="navigate-books-tab" class="input-keybinding" type="text" value="b">\n            </div>\n            <div class="option">\n                <label for="navigate-flights-tab" class="option-desc">Go to Flights</label>\n                <input id="navigate-flights-tab" class="input-keybinding" type="text" value="alt+l">\n            </div>\n            <div class="option">\n                <label for="navigate-financial-tab" class="option-desc">Go to Financial</label>\n                <input id="navigate-financial-tab" class="input-keybinding" type="text" value="f">\n            </div>\n        </details>\n    </section>\n    <section id="search-engines-container">\n        <h2>EXPERIMENTAL: Alternative search engines</h2>\n        <details class="help">\n            <summary><h3>Help</h3></summary>\n            There is experimental support for using this extension in the websites below.\n            Note that some features are still buggy in certain websites.\n            You can enable or disable the extension of these websites at any time by clicking on the checkboxes.\n            When you enable a website, the browser will prompt you for additional permissions which are needed to be able to run this extension on that website.\n        </details>\n        <div class="option">\n            <label for="brave-search">\n                <input type="checkbox" id="brave-search"> Enable on Brave Search\n            </label>\n        </div>\n        <div class="option">\n            <label for="startpage">\n                <input type="checkbox" id="startpage"> Enable on Startpage\n            </label>\n        </div>\n        <div class="option">\n            <label for="youtube">\n                <input type="checkbox" id="youtube"> Enable on YouTube\n            </label>\n        </div>\n        <div class="option">\n            <label for="google-scholar">\n                <input type="checkbox" id="google-scholar"> Enable on Google Scholar\n            </label>\n        </div>\n        <div class="option">\n            <label for="amazon">\n                <input type="checkbox" id="amazon"> Enable on Amazon\n            </label>\n        </div>\n        <div class="option">\n            <label for="github">\n                <input type="checkbox" id="github"> Enable on Github\n            </label>\n        </div>\n        <div class="option">\n            <label for="gitlab">\n                <input type="checkbox" id="gitlab"> Enable on Gitlab\n            </label>\n        </div>\n        <div class="option">\n            <label for="custom-gitlab">\n                <input type="checkbox" id="custom-gitlab"> Enable on custom Gitlab\n            </label>\n        </div>\n    </section>\n    <section id="appearance-container">\n        <h2>Appearance</h2>\n        <div class="option">\n            <label for="hide-outline">\n                <input type="checkbox" id="hide-outline"> Hide outline on selected search result\n            </label>\n        </div>\n        <div class="option">\n            <h3>EXPERIMENTAL: Custom CSS</h3>\n            You can set custom CSS rules to change how the focused search results are highlighted. The textarea below contains the default CSS rules.\n            If you want to reset the CSS to the defaults, set the textarea content to an empty string and save.\n            <details>\n                <summary><h3>Edit CSS rules</h3></summary>\n                <textarea name="custom-css-textarea" id="custom-css-textarea"></textarea>\n            </details>\n        </div>\n    </section>\n    <section id="advanced-settings-container">\n        <details>\n            <summary><h2>Advanced</h2></summary>\n            <div class="option">\n                <div class="help">\n                    This option can be used as a workaround for some websites.\n                </div>\n                <div id="delay-container">\n                    <label for="delay">\n                        <input type="number" id="delay">Delay extension initialization in milliseconds\n                    </label>\n                </div>\n            </div>\n            <div class="option">\n                <label for="simulate-middle-click">\n                    <input type="checkbox" id="simulate-middle-click"> Simulate middle click when opening in a new background tab\n                </label>\n            </div>\n            <div class="option">\n                <h3>Custom Gitlab URL regex</h3>\n                <div class="help">\n                    Define private Gitlab URL regex. Default is ^https://(www\\.)?.*git.*\\. \n                </div>\n                <div id="custom-gitlab-url-container">\n                    <label for="custom-gitlab-url">\n                        <input type="text" id="custom-gitlab-url">\n                    </label>\n                </div>\n            </div>\n        </details>\n    </section>\n\n    <div id="status"></div>\n    <div id="buttons-container">\n        <button id="save">Save</button>\n        <button id="reset">Reset to defaults</button>\n    </div>\n\n    <script src="data:text/javascript;base64,IWZ1bmN0aW9uKGUscil7aWYoImZ1bmN0aW9uIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoIndlYmV4dGVuc2lvbi1wb2x5ZmlsbCIsWyJtb2R1bGUiXSxyKTtlbHNlIGlmKCJ1bmRlZmluZWQiIT10eXBlb2YgZXhwb3J0cylyKG1vZHVsZSk7ZWxzZXt2YXIgcz17ZXhwb3J0czp7fX07cihzKSxlLmJyb3dzZXI9cy5leHBvcnRzfX0oInVuZGVmaW5lZCIhPXR5cGVvZiBnbG9iYWxUaGlzP2dsb2JhbFRoaXM6InVuZGVmaW5lZCIhPXR5cGVvZiBzZWxmP3NlbGY6dGhpcywoZnVuY3Rpb24oZSl7InVzZSBzdHJpY3QiO2lmKCFnbG9iYWxUaGlzLmNocm9tZT8ucnVudGltZT8uaWQpdGhyb3cgbmV3IEVycm9yKCJUaGlzIHNjcmlwdCBzaG91bGQgb25seSBiZSBsb2FkZWQgaW4gYSBicm93c2VyIGV4dGVuc2lvbi4iKTtpZih2b2lkIDA9PT1nbG9iYWxUaGlzLmJyb3dzZXJ8fE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWxUaGlzLmJyb3dzZXIpIT09T2JqZWN0LnByb3RvdHlwZSl7Y29uc3Qgcj0iVGhlIG1lc3NhZ2UgcG9ydCBjbG9zZWQgYmVmb3JlIGEgcmVzcG9uc2Ugd2FzIHJlY2VpdmVkLiIscz1lPT57Y29uc3Qgcz17YWxhcm1zOntjbGVhcjp7bWluQXJnczowLG1heEFyZ3M6MX0sY2xlYXJBbGw6e21pbkFyZ3M6MCxtYXhBcmdzOjB9LGdldDp7bWluQXJnczowLG1heEFyZ3M6MX0sZ2V0QWxsOnttaW5BcmdzOjAsbWF4QXJnczowfX0sYm9va21hcmtzOntjcmVhdGU6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LGdldDp7bWluQXJnczoxLG1heEFyZ3M6MX0sZ2V0Q2hpbGRyZW46e21pbkFyZ3M6MSxtYXhBcmdzOjF9LGdldFJlY2VudDp7bWluQXJnczoxLG1heEFyZ3M6MX0sZ2V0U3ViVHJlZTp7bWluQXJnczoxLG1heEFyZ3M6MX0sZ2V0VHJlZTp7bWluQXJnczowLG1heEFyZ3M6MH0sbW92ZTp7bWluQXJnczoyLG1heEFyZ3M6Mn0scmVtb3ZlOnttaW5BcmdzOjEsbWF4QXJnczoxfSxyZW1vdmVUcmVlOnttaW5BcmdzOjEsbWF4QXJnczoxfSxzZWFyY2g6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LHVwZGF0ZTp7bWluQXJnczoyLG1heEFyZ3M6Mn19LGJyb3dzZXJBY3Rpb246e2Rpc2FibGU6e21pbkFyZ3M6MCxtYXhBcmdzOjEsZmFsbGJhY2tUb05vQ2FsbGJhY2s6ITB9LGVuYWJsZTp7bWluQXJnczowLG1heEFyZ3M6MSxmYWxsYmFja1RvTm9DYWxsYmFjazohMH0sZ2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3I6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LGdldEJhZGdlVGV4dDp7bWluQXJnczoxLG1heEFyZ3M6MX0sZ2V0UG9wdXA6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LGdldFRpdGxlOnttaW5BcmdzOjEsbWF4QXJnczoxfSxvcGVuUG9wdXA6e21pbkFyZ3M6MCxtYXhBcmdzOjB9LHNldEJhZGdlQmFja2dyb3VuZENvbG9yOnttaW5BcmdzOjEsbWF4QXJnczoxLGZhbGxiYWNrVG9Ob0NhbGxiYWNrOiEwfSxzZXRCYWRnZVRleHQ6e21pbkFyZ3M6MSxtYXhBcmdzOjEsZmFsbGJhY2tUb05vQ2FsbGJhY2s6ITB9LHNldEljb246e21pbkFyZ3M6MSxtYXhBcmdzOjF9LHNldFBvcHVwOnttaW5BcmdzOjEsbWF4QXJnczoxLGZhbGxiYWNrVG9Ob0NhbGxiYWNrOiEwfSxzZXRUaXRsZTp7bWluQXJnczoxLG1heEFyZ3M6MSxmYWxsYmFja1RvTm9DYWxsYmFjazohMH19LGJyb3dzaW5nRGF0YTp7cmVtb3ZlOnttaW5BcmdzOjIsbWF4QXJnczoyfSxyZW1vdmVDYWNoZTp7bWluQXJnczoxLG1heEFyZ3M6MX0scmVtb3ZlQ29va2llczp7bWluQXJnczoxLG1heEFyZ3M6MX0scmVtb3ZlRG93bmxvYWRzOnttaW5BcmdzOjEsbWF4QXJnczoxfSxyZW1vdmVGb3JtRGF0YTp7bWluQXJnczoxLG1heEFyZ3M6MX0scmVtb3ZlSGlzdG9yeTp7bWluQXJnczoxLG1heEFyZ3M6MX0scmVtb3ZlTG9jYWxTdG9yYWdlOnttaW5BcmdzOjEsbWF4QXJnczoxfSxyZW1vdmVQYXNzd29yZHM6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LHJlbW92ZVBsdWdpbkRhdGE6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LHNldHRpbmdzOnttaW5BcmdzOjAsbWF4QXJnczowfX0sY29tbWFuZHM6e2dldEFsbDp7bWluQXJnczowLG1heEFyZ3M6MH19LGNvbnRleHRNZW51czp7cmVtb3ZlOnttaW5BcmdzOjEsbWF4QXJnczoxfSxyZW1vdmVBbGw6e21pbkFyZ3M6MCxtYXhBcmdzOjB9LHVwZGF0ZTp7bWluQXJnczoyLG1heEFyZ3M6Mn19LGNvb2tpZXM6e2dldDp7bWluQXJnczoxLG1heEFyZ3M6MX0sZ2V0QWxsOnttaW5BcmdzOjEsbWF4QXJnczoxfSxnZXRBbGxDb29raWVTdG9yZXM6e21pbkFyZ3M6MCxtYXhBcmdzOjB9LHJlbW92ZTp7bWluQXJnczoxLG1heEFyZ3M6MX0sc2V0OnttaW5BcmdzOjEsbWF4QXJnczoxfX0sZGV2dG9vbHM6e2luc3BlY3RlZFdpbmRvdzp7ZXZhbDp7bWluQXJnczoxLG1heEFyZ3M6MixzaW5nbGVDYWxsYmFja0FyZzohMX19LHBhbmVsczp7Y3JlYXRlOnttaW5BcmdzOjMsbWF4QXJnczozLHNpbmdsZUNhbGxiYWNrQXJnOiEwfSxlbGVtZW50czp7Y3JlYXRlU2lkZWJhclBhbmU6e21pbkFyZ3M6MSxtYXhBcmdzOjF9fX19LGRvd25sb2Fkczp7Y2FuY2VsOnttaW5BcmdzOjEsbWF4QXJnczoxfSxkb3dubG9hZDp7bWluQXJnczoxLG1heEFyZ3M6MX0sZXJhc2U6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LGdldEZpbGVJY29uOnttaW5BcmdzOjEsbWF4QXJnczoyfSxvcGVuOnttaW5BcmdzOjEsbWF4QXJnczoxLGZhbGxiYWNrVG9Ob0NhbGxiYWNrOiEwfSxwYXVzZTp7bWluQXJnczoxLG1heEFyZ3M6MX0scmVtb3ZlRmlsZTp7bWluQXJnczoxLG1heEFyZ3M6MX0scmVzdW1lOnttaW5BcmdzOjEsbWF4QXJnczoxfSxzZWFyY2g6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LHNob3c6e21pbkFyZ3M6MSxtYXhBcmdzOjEsZmFsbGJhY2tUb05vQ2FsbGJhY2s6ITB9fSxleHRlbnNpb246e2lzQWxsb3dlZEZpbGVTY2hlbWVBY2Nlc3M6e21pbkFyZ3M6MCxtYXhBcmdzOjB9LGlzQWxsb3dlZEluY29nbml0b0FjY2Vzczp7bWluQXJnczowLG1heEFyZ3M6MH19LGhpc3Rvcnk6e2FkZFVybDp7bWluQXJnczoxLG1heEFyZ3M6MX0sZGVsZXRlQWxsOnttaW5BcmdzOjAsbWF4QXJnczowfSxkZWxldGVSYW5nZTp7bWluQXJnczoxLG1heEFyZ3M6MX0sZGVsZXRlVXJsOnttaW5BcmdzOjEsbWF4QXJnczoxfSxnZXRWaXNpdHM6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LHNlYXJjaDp7bWluQXJnczoxLG1heEFyZ3M6MX19LGkxOG46e2RldGVjdExhbmd1YWdlOnttaW5BcmdzOjEsbWF4QXJnczoxfSxnZXRBY2NlcHRMYW5ndWFnZXM6e21pbkFyZ3M6MCxtYXhBcmdzOjB9fSxpZGVudGl0eTp7bGF1bmNoV2ViQXV0aEZsb3c6e21pbkFyZ3M6MSxtYXhBcmdzOjF9fSxpZGxlOntxdWVyeVN0YXRlOnttaW5BcmdzOjEsbWF4QXJnczoxfX0sbWFuYWdlbWVudDp7Z2V0OnttaW5BcmdzOjEsbWF4QXJnczoxfSxnZXRBbGw6e21pbkFyZ3M6MCxtYXhBcmdzOjB9LGdldFNlbGY6e21pbkFyZ3M6MCxtYXhBcmdzOjB9LHNldEVuYWJsZWQ6e21pbkFyZ3M6MixtYXhBcmdzOjJ9LHVuaW5zdGFsbFNlbGY6e21pbkFyZ3M6MCxtYXhBcmdzOjF9fSxub3RpZmljYXRpb25zOntjbGVhcjp7bWluQXJnczoxLG1heEFyZ3M6MX0sY3JlYXRlOnttaW5BcmdzOjEsbWF4QXJnczoyfSxnZXRBbGw6e21pbkFyZ3M6MCxtYXhBcmdzOjB9LGdldFBlcm1pc3Npb25MZXZlbDp7bWluQXJnczowLG1heEFyZ3M6MH0sdXBkYXRlOnttaW5BcmdzOjIsbWF4QXJnczoyfX0scGFnZUFjdGlvbjp7Z2V0UG9wdXA6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LGdldFRpdGxlOnttaW5BcmdzOjEsbWF4QXJnczoxfSxoaWRlOnttaW5BcmdzOjEsbWF4QXJnczoxLGZhbGxiYWNrVG9Ob0NhbGxiYWNrOiEwfSxzZXRJY29uOnttaW5BcmdzOjEsbWF4QXJnczoxfSxzZXRQb3B1cDp7bWluQXJnczoxLG1heEFyZ3M6MSxmYWxsYmFja1RvTm9DYWxsYmFjazohMH0sc2V0VGl0bGU6e21pbkFyZ3M6MSxtYXhBcmdzOjEsZmFsbGJhY2tUb05vQ2FsbGJhY2s6ITB9LHNob3c6e21pbkFyZ3M6MSxtYXhBcmdzOjEsZmFsbGJhY2tUb05vQ2FsbGJhY2s6ITB9fSxwZXJtaXNzaW9uczp7Y29udGFpbnM6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LGdldEFsbDp7bWluQXJnczowLG1heEFyZ3M6MH0scmVtb3ZlOnttaW5BcmdzOjEsbWF4QXJnczoxfSxyZXF1ZXN0OnttaW5BcmdzOjEsbWF4QXJnczoxfX0scnVudGltZTp7Z2V0QmFja2dyb3VuZFBhZ2U6e21pbkFyZ3M6MCxtYXhBcmdzOjB9LGdldFBsYXRmb3JtSW5mbzp7bWluQXJnczowLG1heEFyZ3M6MH0sb3Blbk9wdGlvbnNQYWdlOnttaW5BcmdzOjAsbWF4QXJnczowfSxyZXF1ZXN0VXBkYXRlQ2hlY2s6e21pbkFyZ3M6MCxtYXhBcmdzOjB9LHNlbmRNZXNzYWdlOnttaW5BcmdzOjEsbWF4QXJnczozfSxzZW5kTmF0aXZlTWVzc2FnZTp7bWluQXJnczoyLG1heEFyZ3M6Mn0sc2V0VW5pbnN0YWxsVVJMOnttaW5BcmdzOjEsbWF4QXJnczoxfX0sc2Vzc2lvbnM6e2dldERldmljZXM6e21pbkFyZ3M6MCxtYXhBcmdzOjF9LGdldFJlY2VudGx5Q2xvc2VkOnttaW5BcmdzOjAsbWF4QXJnczoxfSxyZXN0b3JlOnttaW5BcmdzOjAsbWF4QXJnczoxfX0sc3RvcmFnZTp7bG9jYWw6e2NsZWFyOnttaW5BcmdzOjAsbWF4QXJnczowfSxnZXQ6e21pbkFyZ3M6MCxtYXhBcmdzOjF9LGdldEJ5dGVzSW5Vc2U6e21pbkFyZ3M6MCxtYXhBcmdzOjF9LHJlbW92ZTp7bWluQXJnczoxLG1heEFyZ3M6MX0sc2V0OnttaW5BcmdzOjEsbWF4QXJnczoxfX0sbWFuYWdlZDp7Z2V0OnttaW5BcmdzOjAsbWF4QXJnczoxfSxnZXRCeXRlc0luVXNlOnttaW5BcmdzOjAsbWF4QXJnczoxfX0sc3luYzp7Y2xlYXI6e21pbkFyZ3M6MCxtYXhBcmdzOjB9LGdldDp7bWluQXJnczowLG1heEFyZ3M6MX0sZ2V0Qnl0ZXNJblVzZTp7bWluQXJnczowLG1heEFyZ3M6MX0scmVtb3ZlOnttaW5BcmdzOjEsbWF4QXJnczoxfSxzZXQ6e21pbkFyZ3M6MSxtYXhBcmdzOjF9fX0sdGFiczp7Y2FwdHVyZVZpc2libGVUYWI6e21pbkFyZ3M6MCxtYXhBcmdzOjJ9LGNyZWF0ZTp7bWluQXJnczoxLG1heEFyZ3M6MX0sZGV0ZWN0TGFuZ3VhZ2U6e21pbkFyZ3M6MCxtYXhBcmdzOjF9LGRpc2NhcmQ6e21pbkFyZ3M6MCxtYXhBcmdzOjF9LGR1cGxpY2F0ZTp7bWluQXJnczoxLG1heEFyZ3M6MX0sZXhlY3V0ZVNjcmlwdDp7bWluQXJnczoxLG1heEFyZ3M6Mn0sZ2V0OnttaW5BcmdzOjEsbWF4QXJnczoxfSxnZXRDdXJyZW50OnttaW5BcmdzOjAsbWF4QXJnczowfSxnZXRab29tOnttaW5BcmdzOjAsbWF4QXJnczoxfSxnZXRab29tU2V0dGluZ3M6e21pbkFyZ3M6MCxtYXhBcmdzOjF9LGdvQmFjazp7bWluQXJnczowLG1heEFyZ3M6MX0sZ29Gb3J3YXJkOnttaW5BcmdzOjAsbWF4QXJnczoxfSxoaWdobGlnaHQ6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LGluc2VydENTUzp7bWluQXJnczoxLG1heEFyZ3M6Mn0sbW92ZTp7bWluQXJnczoyLG1heEFyZ3M6Mn0scXVlcnk6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LHJlbG9hZDp7bWluQXJnczowLG1heEFyZ3M6Mn0scmVtb3ZlOnttaW5BcmdzOjEsbWF4QXJnczoxfSxyZW1vdmVDU1M6e21pbkFyZ3M6MSxtYXhBcmdzOjJ9LHNlbmRNZXNzYWdlOnttaW5BcmdzOjIsbWF4QXJnczozfSxzZXRab29tOnttaW5BcmdzOjEsbWF4QXJnczoyfSxzZXRab29tU2V0dGluZ3M6e21pbkFyZ3M6MSxtYXhBcmdzOjJ9LHVwZGF0ZTp7bWluQXJnczoxLG1heEFyZ3M6Mn19LHRvcFNpdGVzOntnZXQ6e21pbkFyZ3M6MCxtYXhBcmdzOjB9fSx3ZWJOYXZpZ2F0aW9uOntnZXRBbGxGcmFtZXM6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LGdldEZyYW1lOnttaW5BcmdzOjEsbWF4QXJnczoxfX0sd2ViUmVxdWVzdDp7aGFuZGxlckJlaGF2aW9yQ2hhbmdlZDp7bWluQXJnczowLG1heEFyZ3M6MH19LHdpbmRvd3M6e2NyZWF0ZTp7bWluQXJnczowLG1heEFyZ3M6MX0sZ2V0OnttaW5BcmdzOjEsbWF4QXJnczoyfSxnZXRBbGw6e21pbkFyZ3M6MCxtYXhBcmdzOjF9LGdldEN1cnJlbnQ6e21pbkFyZ3M6MCxtYXhBcmdzOjF9LGdldExhc3RGb2N1c2VkOnttaW5BcmdzOjAsbWF4QXJnczoxfSxyZW1vdmU6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LHVwZGF0ZTp7bWluQXJnczoyLG1heEFyZ3M6Mn19fTtpZigwPT09T2JqZWN0LmtleXMocykubGVuZ3RoKXRocm93IG5ldyBFcnJvcigiYXBpLW1ldGFkYXRhLmpzb24gaGFzIG5vdCBiZWVuIGluY2x1ZGVkIGluIGJyb3dzZXItcG9seWZpbGwiKTtjbGFzcyBnIGV4dGVuZHMgV2Vha01hcHtjb25zdHJ1Y3RvcihlLHIpe3N1cGVyKHIpLHRoaXMuY3JlYXRlSXRlbT1lfWdldChlKXtyZXR1cm4gdGhpcy5oYXMoZSl8fHRoaXMuc2V0KGUsdGhpcy5jcmVhdGVJdGVtKGUpKSxzdXBlci5nZXQoZSl9fWNvbnN0IGE9KHIscyk9PiguLi5nKT0+e2UucnVudGltZS5sYXN0RXJyb3I/ci5yZWplY3QobmV3IEVycm9yKGUucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpOnMuc2luZ2xlQ2FsbGJhY2tBcmd8fGcubGVuZ3RoPD0xJiYhMSE9PXMuc2luZ2xlQ2FsbGJhY2tBcmc/ci5yZXNvbHZlKGdbMF0pOnIucmVzb2x2ZShnKX0sbT1lPT4xPT1lPyJhcmd1bWVudCI6ImFyZ3VtZW50cyIsbj0oZSxyLHMpPT5uZXcgUHJveHkocix7YXBwbHk6KHIsZyxhKT0+cy5jYWxsKGcsZSwuLi5hKX0pO2xldCB0PUZ1bmN0aW9uLmNhbGwuYmluZChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtjb25zdCBBPShlLHI9e30scz17fSk9PntsZXQgZz1PYmplY3QuY3JlYXRlKG51bGwpLGk9e2hhczoocixzKT0+cyBpbiBlfHxzIGluIGcsZ2V0KGksbyxsKXtpZihvIGluIGcpcmV0dXJuIGdbb107aWYoIShvIGluIGUpKXJldHVybjtsZXQgeD1lW29dO2lmKCJmdW5jdGlvbiI9PXR5cGVvZiB4KWlmKCJmdW5jdGlvbiI9PXR5cGVvZiByW29dKXg9bihlLGVbb10scltvXSk7ZWxzZSBpZih0KHMsbykpe2xldCByPSgoZSxyKT0+ZnVuY3Rpb24ocywuLi5nKXtpZihnLmxlbmd0aDxyLm1pbkFyZ3MpdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke3IubWluQXJnc30gJHttKHIubWluQXJncyl9IGZvciAke2V9KCksIGdvdCAke2cubGVuZ3RofWApO2lmKGcubGVuZ3RoPnIubWF4QXJncyl0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHtyLm1heEFyZ3N9ICR7bShyLm1heEFyZ3MpfSBmb3IgJHtlfSgpLCBnb3QgJHtnLmxlbmd0aH1gKTtyZXR1cm4gbmV3IFByb21pc2UoKChtLG4pPT57aWYoci5mYWxsYmFja1RvTm9DYWxsYmFjayl0cnl7c1tlXSguLi5nLGEoe3Jlc29sdmU6bSxyZWplY3Q6bn0scikpfWNhdGNoKGEpe2NvbnNvbGUud2FybihgJHtlfSBBUEkgbWV0aG9kIGRvZXNuJ3Qgc2VlbSB0byBzdXBwb3J0IHRoZSBjYWxsYmFjayBwYXJhbWV0ZXIsIGZhbGxpbmcgYmFjayB0byBjYWxsIGl0IHdpdGhvdXQgYSBjYWxsYmFjazogYCxhKSxzW2VdKC4uLmcpLHIuZmFsbGJhY2tUb05vQ2FsbGJhY2s9ITEsci5ub0NhbGxiYWNrPSEwLG0oKX1lbHNlIHIubm9DYWxsYmFjaz8oc1tlXSguLi5nKSxtKCkpOnNbZV0oLi4uZyxhKHtyZXNvbHZlOm0scmVqZWN0Om59LHIpKX0pKX0pKG8sc1tvXSk7eD1uKGUsZVtvXSxyKX1lbHNlIHg9eC5iaW5kKGUpO2Vsc2UgaWYoIm9iamVjdCI9PXR5cGVvZiB4JiZudWxsIT09eCYmKHQocixvKXx8dChzLG8pKSl4PUEoeCxyW29dLHNbb10pO2Vsc2V7aWYoIXQocywiKiIpKXJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZyxvLHtjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMCxnZXQ6KCk9PmVbb10sc2V0KHIpe2Vbb109cn19KSx4O3g9QSh4LHJbb10sc1siKiJdKX1yZXR1cm4gZ1tvXT14LHh9LHNldDoocixzLGEsbSk9PihzIGluIGc/Z1tzXT1hOmVbc109YSwhMCksZGVmaW5lUHJvcGVydHk6KGUscixzKT0+UmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShnLHIscyksZGVsZXRlUHJvcGVydHk6KGUscik9PlJlZmxlY3QuZGVsZXRlUHJvcGVydHkoZyxyKX0sbz1PYmplY3QuY3JlYXRlKGUpO3JldHVybiBuZXcgUHJveHkobyxpKX0saT1lPT4oe2FkZExpc3RlbmVyKHIscywuLi5nKXtyLmFkZExpc3RlbmVyKGUuZ2V0KHMpLC4uLmcpfSxoYXNMaXN0ZW5lcjoocixzKT0+ci5oYXNMaXN0ZW5lcihlLmdldChzKSkscmVtb3ZlTGlzdGVuZXIocixzKXtyLnJlbW92ZUxpc3RlbmVyKGUuZ2V0KHMpKX19KSxvPW5ldyBnKChlPT4iZnVuY3Rpb24iIT10eXBlb2YgZT9lOmZ1bmN0aW9uKHIpe2NvbnN0IHM9QShyLHt9LHtnZXRDb250ZW50OnttaW5BcmdzOjAsbWF4QXJnczowfX0pO2Uocyl9KSksbD1uZXcgZygoZT0+ImZ1bmN0aW9uIiE9dHlwZW9mIGU/ZTpmdW5jdGlvbihyLHMsZyl7bGV0IGEsbSxuPSExLHQ9bmV3IFByb21pc2UoKGU9PnthPWZ1bmN0aW9uKHIpe249ITAsZShyKX19KSk7dHJ5e209ZShyLHMsYSl9Y2F0Y2goZSl7bT1Qcm9taXNlLnJlamVjdChlKX1jb25zdCBBPSEwIT09bSYmKChpPW0pJiYib2JqZWN0Ij09dHlwZW9mIGkmJiJmdW5jdGlvbiI9PXR5cGVvZiBpLnRoZW4pO3ZhciBpO2lmKCEwIT09bSYmIUEmJiFuKXJldHVybiExO2NvbnN0IG89ZT0+e2UudGhlbigoZT0+e2coZSl9KSwoZT0+e2xldCByO3I9ZSYmKGUgaW5zdGFuY2VvZiBFcnJvcnx8InN0cmluZyI9PXR5cGVvZiBlLm1lc3NhZ2UpP2UubWVzc2FnZToiQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZCIsZyh7X19tb3pXZWJFeHRlbnNpb25Qb2x5ZmlsbFJlamVjdF9fOiEwLG1lc3NhZ2U6cn0pfSkpLmNhdGNoKChlPT57Y29uc29sZS5lcnJvcigiRmFpbGVkIHRvIHNlbmQgb25NZXNzYWdlIHJlamVjdGVkIHJlcGx5IixlKX0pKX07cmV0dXJuIG8oQT9tOnQpLCEwfSkpLHg9KHtyZWplY3Q6cyxyZXNvbHZlOmd9LGEpPT57ZS5ydW50aW1lLmxhc3RFcnJvcj9lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2U9PT1yP2coKTpzKG5ldyBFcnJvcihlLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpKTphJiZhLl9fbW96V2ViRXh0ZW5zaW9uUG9seWZpbGxSZWplY3RfXz9zKG5ldyBFcnJvcihhLm1lc3NhZ2UpKTpnKGEpfSxjPShlLHIscywuLi5nKT0+e2lmKGcubGVuZ3RoPHIubWluQXJncyl0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IGxlYXN0ICR7ci5taW5BcmdzfSAke20oci5taW5BcmdzKX0gZm9yICR7ZX0oKSwgZ290ICR7Zy5sZW5ndGh9YCk7aWYoZy5sZW5ndGg+ci5tYXhBcmdzKXRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbW9zdCAke3IubWF4QXJnc30gJHttKHIubWF4QXJncyl9IGZvciAke2V9KCksIGdvdCAke2cubGVuZ3RofWApO3JldHVybiBuZXcgUHJvbWlzZSgoKGUscik9Pntjb25zdCBhPXguYmluZChudWxsLHtyZXNvbHZlOmUscmVqZWN0OnJ9KTtnLnB1c2goYSkscy5zZW5kTWVzc2FnZSguLi5nKX0pKX0sZD17ZGV2dG9vbHM6e25ldHdvcms6e29uUmVxdWVzdEZpbmlzaGVkOmkobyl9fSxydW50aW1lOntvbk1lc3NhZ2U6aShsKSxvbk1lc3NhZ2VFeHRlcm5hbDppKGwpLHNlbmRNZXNzYWdlOmMuYmluZChudWxsLCJzZW5kTWVzc2FnZSIse21pbkFyZ3M6MSxtYXhBcmdzOjN9KX0sdGFiczp7c2VuZE1lc3NhZ2U6Yy5iaW5kKG51bGwsInNlbmRNZXNzYWdlIix7bWluQXJnczoyLG1heEFyZ3M6M30pfX0sdT17Y2xlYXI6e21pbkFyZ3M6MSxtYXhBcmdzOjF9LGdldDp7bWluQXJnczoxLG1heEFyZ3M6MX0sc2V0OnttaW5BcmdzOjEsbWF4QXJnczoxfX07cmV0dXJuIHMucHJpdmFjeT17bmV0d29yazp7IioiOnV9LHNlcnZpY2VzOnsiKiI6dX0sd2Vic2l0ZXM6eyIqIjp1fX0sQShlLGQscyl9O2UuZXhwb3J0cz1zKGNocm9tZSl9ZWxzZSBlLmV4cG9ydHM9Z2xvYmFsVGhpcy5icm93c2VyfSkpOw=="></script>\n    <script src="data:text/javascript;base64,Y29uc3QgREVGQVVMVF9DU1MgPSBgLyogTk9URToKICoKICogLSBVc2luZyAhaW1wb3J0YW50IGlzIG5lZWRlZCBmb3Igc29tZSBzdHlsZXMgYmVjYXVzZSBvdGhlcndpc2UgdGhleSBnZXQKICogICBvdmVycmlkZW4gYnkgdGhlIHNlYXJjaCBlbmdpbmUgc3R5bGVzaGVldHMKICogLSBVc2luZyBvdXRsaW5lIHdvcmtzIGJldHRlciB0aGFuIGJvcmRlciBzb21ldGltZXMgYmVjYXVzZSBjcmVhdGluZyB0aGUKICogICBib3JkZXIgY2FuIG1vdmUgb3RoZXIgZWxlbWVudHMsIGZvciBleGFtcGxlIHRoZSBwYWdlIG51bWJlcnMgYXJlIG1vdmVkIGluCiAqICAgR29vZ2xlIFNjaG9sYXIgd2hlbiBoaWdobGlnaHRpbmcgdGhlIHByZXYvbmV4dCBidXR0b25zLgogKi8KCjpyb290IHsKICAtLXJlc3VsdC1vdXRsaW5lOiAxcHggc29saWQgYmxhY2s7Cn0KCkBtZWRpYSAocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspIHsKICA6cm9vdCB7CiAgICAtLXJlc3VsdC1vdXRsaW5lOiAxcHggc29saWQgI2FhYWFhYTsKICB9Cn0KCmh0bWxbZGFya10sIFtkYXJrXSB7CiAgLS1yZXN1bHQtb3V0bGluZTogMXB4IHNvbGlkICNhYWFhYWE7Cn0KCi53c24tZ29vZ2xlLWZvY3VzZWQtbGluayB7CiAgICBwb3NpdGlvbjogcmVsYXRpdmU7CiAgICAvKiBUaGlzIGlzIHJlcXVpcmVkIGZvciB0aGUgYXJyb3cgdG8gYXBwZWFyIHdoZW4gbmF2aWdhdGluZyBzdWItcmVzdWx0cywgc2VlCiAgICAgKiBhbHNvOiBodHRwczovL2dpdGh1Yi5jb20vaW5mb2tpbGxlci93ZWItc2VhcmNoLW5hdmlnYXRvci9pc3N1ZXMvMzU3ICovCiAgICBvdmVyZmxvdzogdmlzaWJsZSAhaW1wb3J0YW50Owp9Cgoud3NuLWdvb2dsZS1mb2N1c2VkLWxpbms6OmJlZm9yZSwKLndzbi1nb29nbGUtZm9jdXNlZC1tYXA6OmJlZm9yZSwKLndzbi1naXRsYWItZm9jdXNlZC1saW5rOjpiZWZvcmUsCi53c24tYnJhdmUtc2VhcmNoLWZvY3VzZWQtbGluazo6YmVmb3JlLAoud3NuLXN0YXJ0cGFnZS1mb2N1c2VkLWxpbms6OmJlZm9yZSB7CiAgICBjb250ZW50OiAiXHUyNUJBIjsKICAgIG1hcmdpbi1yaWdodDogMjVweDsKICAgIGxlZnQ6IC0yNXB4OwogICAgcG9zaXRpb246IGFic29sdXRlOwp9Cgoud3NuLWJyYXZlLXNlYXJjaC1mb2N1c2VkLW5ld3MgewogIHBvc2l0aW9uOiByZWxhdGl2ZTsKfQoKLndzbi1icmF2ZS1zZWFyY2gtZm9jdXNlZC1uZXdzOjpiZWZvcmUgewogIGNvbnRlbnQ6ICJcdTI1QkEiOwogIHRvcDogNXB4OwogIGxlZnQ6IC00NXB4OwogIHBvc2l0aW9uOiBhYnNvbHV0ZTsKfQoKLndzbi1nb29nbGUtZm9jdXNlZC1pbWFnZSB7CiAgICBvdXRsaW5lOiB2YXIoLS1yZXN1bHQtb3V0bGluZSkgIWltcG9ydGFudDsKICAgIC8qIEltYWdlcyBhcmUgbGVzcyB2aXNpYmxlIHdpdGggYSB0aGluIG91dGxpbmUgKi8KICAgIG91dGxpbmUtd2lkdGg6IDJweDsKfQoKLndzbi1nb29nbGUtZm9jdXNlZC1jYXJkLAoud3NuLWJyYXZlLXNlYXJjaC1mb2N1c2VkLWNhcmQsCi53c24tZ29vZ2xlLWZvY3VzZWQtam9iLWNhcmQgewogICAgYm9yZGVyOiB2YXIoLS1yZXN1bHQtb3V0bGluZSkgIWltcG9ydGFudDsKfQoKLndzbi1nb29nbGUtZm9jdXNlZC1tYXAsCi53c24tZ29vZ2xlLWNhcmQtaXRlbSwKLndzbi1naXRsYWItZm9jdXNlZC1ncm91cC1yb3cgewogICAgb3V0bGluZTogdmFyKC0tcmVzdWx0LW91dGxpbmUpICFpbXBvcnRhbnQ7Cn0KCi53c24tZ29vZ2xlLWZvY3VzZWQtbWVtZXgtcmVzdWx0IHsKICAgIGJvcmRlcjogdmFyKC0tcmVzdWx0LW91dGxpbmUpICFpbXBvcnRhbnQ7CiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OwogICAgLW1vei1ib3gtc2l6aW5nOiBib3JkZXItYm94OwogICAgLXdlYmtpdC1ib3gtc2l6aW5nOiBib3JkZXItYm94Owp9CgovKiBTdGFydHBhZ2UgaGFzIGRhcmsgdGhlbWVzIHdoZXJlIGEgYmxhY2sgb3V0bGluZSB3b24ndCBiZSB2aXNpYmxlICovCi53c24tc3RhcnRwYWdlLWZvY3VzZWQtbGluayB7CiAgICBvdXRsaW5lOiAxcHggc29saWQgIzQzNWE2OSAhaW1wb3J0YW50OwogICAgb3V0bGluZS1vZmZzZXQ6IDNweDsKfQoKLndzbi15b3V0dWJlLWZvY3VzZWQtdmlkZW8gewogICAgb3V0bGluZTogdmFyKC0tcmVzdWx0LW91dGxpbmUpICFpbXBvcnRhbnQ7CiAgICBvdXRsaW5lLW9mZnNldDogMXB4Owp9Cgoud3NuLXlvdXR1YmUtZm9jdXNlZC1ncmlkLXZpZGVvIHsKICAgIGJvcmRlcjogdmFyKC0tcmVzdWx0LW91dGxpbmUpICFpbXBvcnRhbnQ7Cn0KCi53c24tZ29vZ2xlLXNjaG9sYXItbmV4dC1wYWdlIHsKICAgIC8qIFVzaW5nIG91dGxpbmUgd29ya3MgYmV0dGVyIHRoYW4gYm9yZGVyIGZvciB0aGUgU2Nob2xhciBwcmV2aW91cy9uZXh0CiAgICAgKiBidXR0b25zIGJlY2F1c2UgYm9yZGVyIG1vdmVzIHRoZSBwYWdlIG51bWJlcnMgYSBiaXQuICovCiAgICBvdXRsaW5lOiB2YXIoLS1yZXN1bHQtb3V0bGluZSkgIWltcG9ydGFudDsKfQoKLndzbi1hbWF6b24tZm9jdXNlZC1pdGVtIHsKICAgIG91dGxpbmU6IHZhcigtLXJlc3VsdC1vdXRsaW5lKSAhaW1wb3J0YW50OwogICAgb3V0bGluZS1vZmZzZXQ6IDNweDsKfQoKLndzbi1hbWF6b24tZm9jdXNlZC1jYXJ0LWl0ZW0sCi53c24tYW1hem9uLWZvY3VzZWQtY2Fyb3VzZWwtaXRlbSB7CiAgICBib3JkZXI6IHZhcigtLXJlc3VsdC1vdXRsaW5lKSAhaW1wb3J0YW50Owp9Cgoud3NuLWdpdGh1Yi1mb2N1c2VkLWl0ZW0sCi53c24tZ2l0aHViLWZvY3VzZWQtcGFnaW5hdGlvbiB7CiAgICBvdXRsaW5lOiB2YXIoLS1yZXN1bHQtb3V0bGluZSkgIWltcG9ydGFudDsKICAgIG91dGxpbmUtb2Zmc2V0OiAycHg7Cn0KCi8qIFRoaXMgcnVsZSBpcyBvbmx5IHVzZWQgd2hlbiB0aGUgImhpZGUgb3V0bGluZSIgb3B0aW9uIGlzIGVuYWJsZWQsIGFuZCBpcyB1c2VkCiAqIHRvIGRpc2FibGUgdGhlIHdlYnNpdGUncyBkZWZhdWx0IHNlYXJjaCByZXN1bHQgb3V0bGluaW5nICovCi53c24tbm8tb3V0bGluZSwKLndzbi1uby1vdXRsaW5lOmZvY3VzIHsKICAgIG91dGxpbmU6IG5vbmU7Cn1gOwoKY29uc3QgREVGQVVMVF9LRVlCSU5ESU5HUyA9IHsKICBuZXh0S2V5OiBbJ2Rvd24nLCAnaiddLAogIHByZXZpb3VzS2V5OiBbJ3VwJywgJ2snXSwKICBuYXZpZ2F0ZVByZXZpb3VzUmVzdWx0UGFnZTogWydsZWZ0JywgJ2gnXSwKICBuYXZpZ2F0ZU5leHRSZXN1bHRQYWdlOiBbJ3JpZ2h0JywgJ2wnXSwKICBuYXZpZ2F0ZUtleTogWydyZXR1cm4nLCAnc3BhY2UnXSwKICBuYXZpZ2F0ZU5ld1RhYkJhY2tncm91bmRLZXk6IFsnY3RybCtyZXR1cm4nLCAnY29tbWFuZCtyZXR1cm4nLCAnY3RybCtzcGFjZSddLAogIG5hdmlnYXRlTmV3VGFiS2V5OiBbCiAgICAnY3RybCtzaGlmdCtyZXR1cm4nLAogICAgJ2NvbW1hbmQrc2hpZnQrcmV0dXJuJywKICAgICdjdHJsK3NoaWZ0K3NwYWNlJywKICBdLAogIG5hdmlnYXRlU2VhcmNoVGFiOiBbJ2EnLCAncyddLAogIG5hdmlnYXRlSW1hZ2VzVGFiOiBbJ2knXSwKICBuYXZpZ2F0ZVZpZGVvc1RhYjogWyd2J10sCiAgbmF2aWdhdGVNYXBzVGFiOiBbJ20nXSwKICBuYXZpZ2F0ZU5ld3NUYWI6IFsnbiddLAogIG5hdmlnYXRlU2hvcHBpbmdUYWI6IFsnYWx0K3MnXSwKICBuYXZpZ2F0ZUJvb2tzVGFiOiBbJ2InXSwKICBuYXZpZ2F0ZUZsaWdodHNUYWI6IFsnYWx0K2wnXSwKICBuYXZpZ2F0ZUZpbmFuY2lhbFRhYjogWydmJ10sCiAgZm9jdXNTZWFyY2hJbnB1dDogWycvJywgJ2VzY2FwZSddLAogIG5hdmlnYXRlU2hvd0FsbDogWyd6IHonXSwKICBuYXZpZ2F0ZVNob3dIb3VyOiBbJ3ogaCddLAogIG5hdmlnYXRlU2hvd0RheTogWyd6IGQnXSwKICBuYXZpZ2F0ZVNob3dXZWVrOiBbJ3ogdyddLAogIG5hdmlnYXRlU2hvd01vbnRoOiBbJ3ogbSddLAogIG5hdmlnYXRlU2hvd1llYXI6IFsneiB5J10sCiAgdG9nZ2xlU29ydDogWyd6IHMnXSwKICB0b2dnbGVWZXJiYXRpbVNlYXJjaDogWyd6IHYnXSwKICBzaG93SW1hZ2VzTGFyZ2U6IFsneiBsJ10sCiAgc2hvd0ltYWdlc01lZGl1bTogWyd6IGUnXSwKICBzaG93SW1hZ2VzSWNvbjogWyd6IGknXSwKfTsKCmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHsKICAuLi5ERUZBVUxUX0tFWUJJTkRJTkdTLAogIHdyYXBOYXZpZ2F0aW9uOiBmYWxzZSwKICBhdXRvU2VsZWN0Rmlyc3Q6IHRydWUsCiAgaGlkZU91dGxpbmU6IGZhbHNlLAogIGRlbGF5OiAwLAogIGdvb2dsZUluY2x1ZGVDYXJkczogdHJ1ZSwKICBnb29nbGVJbmNsdWRlTWVtZXg6IGZhbHNlLAogIGdvb2dsZUluY2x1ZGVQbGFjZXM6IHRydWUsCiAgY3VzdG9tQ1NTOiBERUZBVUxUX0NTUywKICBzaW11bGF0ZU1pZGRsZUNsaWNrOiBmYWxzZSwKICBjdXN0b21HaXRsYWJVcmw6ICdeaHR0cHM6Ly8od3d3Lik/XFwuKmdpdC4qXFwuJywKfTsKCmNvbnN0IGtleWJpbmRpbmdTdHJpbmdUb0FycmF5ID0gKGtiKSA9PiB7CiAgLy8gQWx0ZXJuYXRpdmU6IGtiLnNwbGl0KC8sICovKTsKICByZXR1cm4ga2Iuc3BsaXQoJywnKS5tYXAoKHQpID0+IHQudHJpbSgpKTsKfTsKCi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFycwpjb25zdCBrZXliaW5kaW5nQXJyYXlUb1N0cmluZyA9IChrYikgPT4gewogIHJldHVybiBrYi5qb2luKCcsICcpOwp9OwoKLyoqCiAqIEBwYXJhbSB7U3RvcmFnZUFyZWF9IHN0b3JhZ2UgVGhlIHN0b3JhZ2UgYXJlYSB0byB3aGljaCB0aGlzIHNlY3Rpb24gd2lsbAogKiAgd3JpdGUuCiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZhdWx0VmFsdWVzIFRoZSBkZWZhdWx0IG9wdGlvbnMuCiAqIEBjb25zdHJ1Y3RvcgogKi8KY2xhc3MgQnJvd3NlclN0b3JhZ2UgewogIGNvbnN0cnVjdG9yKHN0b3JhZ2UsIGRlZmF1bHRWYWx1ZXMpIHsKICAgIHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2U7CiAgICB0aGlzLnZhbHVlcyA9IHt9OwogICAgdGhpcy5kZWZhdWx0VmFsdWVzID0gZGVmYXVsdFZhbHVlczsKICB9CiAgbG9hZCgpIHsKICAgIC8vIHRoaXMuc3RvcmFnZS5nZXQobnVsbCkgcmV0dXJucyBhbGwgdGhlIGRhdGEgc3RvcmVkOgogICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL3N0b3JhZ2UjbWV0aG9kLVN0b3JhZ2VBcmVhLWdldAogICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5nZXQobnVsbCkudGhlbigodmFsdWVzKSA9PiB7CiAgICAgIHRoaXMudmFsdWVzID0gdmFsdWVzOwogICAgICAvLyBQcmlvciB0byB2ZXJzaW9ucyAwLjQuKiB0aGUga2V5YmluZGluZ3Mgd2VyZSBzdG9yZWQgYXMgc3RyaW5ncywgc28gd2UKICAgICAgLy8gbWlncmF0ZSB0aGVtIHRvIGFycmF5cyBpZiBuZWVkZWQuCiAgICAgIGxldCBtaWdyYXRlZCA9IGZhbHNlOwogICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLnZhbHVlcykpIHsKICAgICAgICBpZiAoIShrZXkgaW4gREVGQVVMVF9LRVlCSU5ESU5HUykgfHwgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHsKICAgICAgICAgIGNvbnRpbnVlOwogICAgICAgIH0KICAgICAgICBtaWdyYXRlZCA9IHRydWU7CiAgICAgICAgdGhpcy52YWx1ZXNba2V5XSA9IGtleWJpbmRpbmdTdHJpbmdUb0FycmF5KHZhbHVlKTsKICAgICAgfQogICAgICBpZiAobWlncmF0ZWQpIHsKICAgICAgICByZXR1cm4gdGhpcy5zYXZlKCk7CiAgICAgIH0KICAgIH0pOwogIH0KICBzYXZlKCkgewogICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5zZXQodGhpcy52YWx1ZXMpOwogIH0KICBnZXQoa2V5KSB7CiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmFsdWVzW2tleV07CiAgICBpZiAodmFsdWUgIT0gbnVsbCkgewogICAgICByZXR1cm4gdmFsdWU7CiAgICB9CiAgICByZXR1cm4gdGhpcy5kZWZhdWx0VmFsdWVzW2tleV07CiAgfQogIHNldChrZXksIHZhbHVlKSB7CiAgICB0aGlzLnZhbHVlc1trZXldID0gdmFsdWU7CiAgfQogIGNsZWFyKCkgewogICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5jbGVhcigpLnRoZW4oKCkgPT4gewogICAgICB0aGlzLnZhbHVlcyA9IHt9OwogICAgfSk7CiAgfQogIGdldEFsbCgpIHsKICAgIC8vIE1lcmdlIG9wdGlvbnMgZnJvbSBzdG9yYWdlIHdpdGggZGVmYXVsdHMuCiAgICByZXR1cm4gey4uLnRoaXMuZGVmYXVsdFZhbHVlcywgLi4udGhpcy52YWx1ZXN9OwogIH0KfQoKY29uc3QgY3JlYXRlU3luY2VkT3B0aW9ucyA9ICgpID0+IHsKICByZXR1cm4gbmV3IEJyb3dzZXJTdG9yYWdlKGJyb3dzZXIuc3RvcmFnZS5zeW5jLCBERUZBVUxUX09QVElPTlMpOwp9OwoKLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzCmNsYXNzIEV4dGVuc2lvbk9wdGlvbnMgewogIGNvbnN0cnVjdG9yKCkgewogICAgdGhpcy5zeW5jID0gY3JlYXRlU3luY2VkT3B0aW9ucygpOwogICAgdGhpcy5sb2NhbCA9IG5ldyBCcm93c2VyU3RvcmFnZShicm93c2VyLnN0b3JhZ2UubG9jYWwsIHsKICAgICAgbGFzdFF1ZXJ5VXJsOiBudWxsLAogICAgICBsYXN0Rm9jdXNlZEluZGV4OiAwLAogICAgfSk7CiAgfQoKICBsb2FkKCkgewogICAgcmV0dXJuIFByb21pc2UuYWxsKFt0aGlzLmxvY2FsLmxvYWQoKSwgdGhpcy5zeW5jLmxvYWQoKV0pOwogIH0KfQo="></script>\n    <script src="data:text/javascript;base64,Ly8gQmFzZWQgb24gaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9leHRlbnNpb25zL29wdGlvbnNWMgoKLyogZ2xvYmFsIGtleWJpbmRpbmdTdHJpbmdUb0FycmF5LCBrZXliaW5kaW5nQXJyYXlUb1N0cmluZyAqLwovKiBnbG9iYWwgY3JlYXRlU3luY2VkT3B0aW9ucywgREVGQVVMVF9DU1MgKi8KCmNvbnN0IEdPT0dMRV9ET01BSU5TID0gWwogICdhZCcsICdhZScsICdhbCcsICdhbScsICdhcycsICdhdCcsICdheicsICdiYScsICdiZScsICdiZicsICdiZycsICdiaScsICdiaicsCiAgJ2JzJywgJ2J0JywgJ2J5JywgJ2NhJywgJ2NhdCcsICdjZCcsICdjZicsICdjZycsICdjaCcsICdjaScsICdjbCcsICdjbScsICdjbicsCiAgJ2NvLmFvJywgJ2NvLmJ3JywgJ2NvLmNrJywgJ2NvLmNyJywgJ2NvLmlkJywgJ2NvLmlsJywgJ2NvLmluJywgJ2NvLmpwJywKICAnY28ua2UnLCAnY28ua3InLCAnY28ubHMnLCAnY28ubWEnLCAnY28ubXonLCAnY28ubnonLCAnY28udGgnLCAnY28udHonLAogICdjby51ZycsICdjby51aycsICdjby51eicsICdjby52ZScsICdjby52aScsICdjby56YScsICdjby56bScsICdjby56dycsICdjb20nLAogICdjb20uYWYnLCAnY29tLmFnJywgJ2NvbS5haScsICdjb20uYXInLCAnY29tLmF1JywgJ2NvbS5iZCcsICdjb20uYmgnLAogICdjb20uYm4nLCAnY29tLmJvJywgJ2NvbS5icicsICdjb20uYnonLCAnY29tLmNvJywgJ2NvbS5jdScsICdjb20uY3knLAogICdjb20uZG8nLCAnY29tLmVjJywgJ2NvbS5lZycsICdjb20uZXQnLCAnY29tLmZqJywgJ2NvbS5naCcsICdjb20uZ2knLAogICdjb20uZ3QnLCAnY29tLmhrJywgJ2NvbS5qbScsICdjb20ua2gnLCAnY29tLmt3JywgJ2NvbS5sYicsICdjb20ubHknLAogICdjb20ubW0nLCAnY29tLm10JywgJ2NvbS5teCcsICdjb20ubXknLCAnY29tLm5hJywgJ2NvbS5uZicsICdjb20ubmcnLAogICdjb20ubmknLCAnY29tLm5wJywgJ2NvbS5vbScsICdjb20ucGEnLCAnY29tLnBlJywgJ2NvbS5wZycsICdjb20ucGgnLAogICdjb20ucGsnLCAnY29tLnByJywgJ2NvbS5weScsICdjb20ucWEnLCAnY29tLnNhJywgJ2NvbS5zYicsICdjb20uc2cnLAogICdjb20uc2wnLCAnY29tLnN2JywgJ2NvbS50aicsICdjb20udHInLCAnY29tLnR3JywgJ2NvbS51YScsICdjb20udXknLAogICdjb20udmMnLCAnY29tLnZuJywgJ2N2JywgJ2N6JywgJ2RlJywgJ2RqJywgJ2RrJywgJ2RtJywgJ2R6JywgJ2VlJywgJ2VzJywKICAnZmknLCAnZm0nLCAnZnInLCAnZ2EnLCAnZ2UnLCAnZ2cnLCAnZ2wnLCAnZ20nLCAnZ3AnLCAnZ3InLCAnZ3knLCAnaG4nLCAnaHInLAogICdodCcsICdodScsICdpZScsICdpbScsICdpcScsICdpcycsICdpdCcsICdqZScsICdqbycsICdrZycsICdraScsICdreicsICdsYScsCiAgJ2xpJywgJ2xrJywgJ2x0JywgJ2x1JywgJ2x2JywgJ21kJywgJ21lJywgJ21nJywgJ21rJywgJ21sJywgJ21uJywgJ21zJywgJ211JywKICAnbXYnLCAnbXcnLCAnbmUnLCAnbmwnLCAnbm8nLCAnbnInLCAnbnUnLCAncGwnLCAncG4nLCAncHMnLCAncHQnLCAncm8nLCAncnMnLAogICdydScsICdydycsICdzYycsICdzZScsICdzaCcsICdzaScsICdzaycsICdzbScsICdzbicsICdzbycsICdzcicsICdzdCcsICd0ZCcsCiAgJ3RnJywgJ3RrJywgJ3RsJywgJ3RtJywgJ3RuJywgJ3RvJywgJ3R0JywgJ3ZnJywgJ3Z1JywgJ3dzJywKXTsKCmNvbnN0IEFNQVpPTl9ET01BSU5TID0gWwogICdjYScsCiAgJ2NuJywKICAnY28uanAnLAogICdjby51aycsCiAgJ2NvbScsCiAgJ2NvbS5hdScsCiAgJ2NvbS5icicsCiAgJ2NvbS5teCcsCiAgJ2RlJywKICAnZXMnLAogICdmcicsCiAgJ2luJywKICAnaXQnLAogICdubCcsCl07Cgpjb25zdCBnZW5lcmF0ZVVSTFBhdHRlcm5zID0gKHByZWZpeCwgZG9tYWlucywgc3VmZml4KSA9PiB7CiAgY29uc3QgdXJscyA9IFtdOwogIGZvciAoY29uc3QgZG9tYWluIG9mIGRvbWFpbnMpIHsKICAgIHVybHMucHVzaChgJHtwcmVmaXh9LiR7ZG9tYWlufSR7c3VmZml4fWApOwogIH0KICByZXR1cm4gdXJsczsKfTsKCi8vIEF1dGhvcml6ZWQgdXJscyBmb3IgY29tcGF0aWJsZSBzZWFyY2ggZW5naW5lcwpjb25zdCBPUFRJT05BTF9QRVJNSVNTSU9OU19VUkxTID0gewogICdicmF2ZS1zZWFyY2gnOiBbJ2h0dHBzOi8vc2VhcmNoLmJyYXZlLmNvbS8qJ10sCiAgJ3N0YXJ0cGFnZSc6IFsKICAgIC8vIEl0IHVzZWQgdG8gYmUgJ2h0dHBzOi8vd3d3LnN0YXJ0cGFnZS5jb20vKi8qc2VhcmNoKicgYnV0IHdoZW4gcmVxdWVzdGluZwogICAgLy8gdGhpcyBVUkwgY2hyb21lIGFjdHVhbGx5IGdyYW50cyBwZXJtaXNzaW9uIHRvIHRoZSBVUkwgYmVsb3cuIFRoaXMKICAgIC8vIGRpc2NyZXBhbmN5IGNhdXNlcyB0aGUgb3B0aW9ucyBwYWdlIHRvIHRoaW5rIHRoYXQgd2UgZG9uJ3QgaGF2ZQogICAgLy8gcGVybWlzc2lvbiBmb3Igc3RhcnRwYWdlLgogICAgJ2h0dHBzOi8vd3d3LnN0YXJ0cGFnZS5jb20vKicsCiAgICAnaHR0cHM6Ly9zdGFydHBhZ2UuY29tLyonLAogIF0sCiAgJ3lvdXR1YmUnOiBbJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tLyonXSwKICAnZ29vZ2xlLXNjaG9sYXInOiBnZW5lcmF0ZVVSTFBhdHRlcm5zKAogICAgICAnaHR0cHM6Ly9zY2hvbGFyLmdvb2dsZScsCiAgICAgIEdPT0dMRV9ET01BSU5TLAogICAgICAnLyonLAogICksCiAgJ2dpdGh1Yic6IFsnaHR0cHM6Ly9naXRodWIuY29tLyonXSwKICAnYW1hem9uJzogZ2VuZXJhdGVVUkxQYXR0ZXJucygnaHR0cHM6Ly93d3cuYW1hem9uJywgQU1BWk9OX0RPTUFJTlMsICcvKicpLAogICdnaXRsYWInOiBbJ2h0dHBzOi8vZ2l0bGFiLmNvbS8qJ10sCiAgJ2N1c3RvbS1naXRsYWInOiBbJ2h0dHBzOi8vKi8qJ10sCn07Cgpjb25zdCBLRVlCSU5ESU5HX1RPX0RJViA9IHsKICBuZXh0S2V5OiAnbmV4dC1rZXknLAogIHByZXZpb3VzS2V5OiAncHJldmlvdXMta2V5JywKICBuYXZpZ2F0ZVByZXZpb3VzUmVzdWx0UGFnZTogJ25hdmlnYXRlLXByZXZpb3VzLXJlc3VsdC1wYWdlJywKICBuYXZpZ2F0ZU5leHRSZXN1bHRQYWdlOiAnbmF2aWdhdGUtbmV4dC1yZXN1bHQtcGFnZScsCiAgbmF2aWdhdGVLZXk6ICduYXZpZ2F0ZS1rZXknLAogIG5hdmlnYXRlTmV3VGFiS2V5OiAnbmF2aWdhdGUtbmV3LXRhYi1rZXknLAogIG5hdmlnYXRlTmV3VGFiQmFja2dyb3VuZEtleTogJ25hdmlnYXRlLW5ldy10YWItYmFja2dyb3VuZC1rZXknLAogIG5hdmlnYXRlU2VhcmNoVGFiOiAnbmF2aWdhdGUtc2VhcmNoLXRhYicsCiAgbmF2aWdhdGVJbWFnZXNUYWI6ICduYXZpZ2F0ZS1pbWFnZXMtdGFiJywKICBuYXZpZ2F0ZVZpZGVvc1RhYjogJ25hdmlnYXRlLXZpZGVvcy10YWInLAogIG5hdmlnYXRlTWFwc1RhYjogJ25hdmlnYXRlLW1hcHMtdGFiJywKICBuYXZpZ2F0ZU5ld3NUYWI6ICduYXZpZ2F0ZS1uZXdzLXRhYicsCiAgbmF2aWdhdGVTaG9wcGluZ1RhYjogJ25hdmlnYXRlLXNob3BwaW5nLXRhYicsCiAgbmF2aWdhdGVCb29rc1RhYjogJ25hdmlnYXRlLWJvb2tzLXRhYicsCiAgbmF2aWdhdGVGbGlnaHRzVGFiOiAnbmF2aWdhdGUtZmxpZ2h0cy10YWInLAogIG5hdmlnYXRlRmluYW5jaWFsVGFiOiAnbmF2aWdhdGUtZmluYW5jaWFsLXRhYicsCiAgZm9jdXNTZWFyY2hJbnB1dDogJ2ZvY3VzLXNlYXJjaC1pbnB1dCcsCiAgbmF2aWdhdGVTaG93QWxsOiAnbmF2aWdhdGUtc2hvdy1hbGwnLAogIG5hdmlnYXRlU2hvd0hvdXI6ICduYXZpZ2F0ZS1zaG93LWhvdXInLAogIG5hdmlnYXRlU2hvd0RheTogJ25hdmlnYXRlLXNob3ctZGF5JywKICBuYXZpZ2F0ZVNob3dXZWVrOiAnbmF2aWdhdGUtc2hvdy13ZWVrJywKICBuYXZpZ2F0ZVNob3dNb250aDogJ25hdmlnYXRlLXNob3ctbW9udGgnLAogIG5hdmlnYXRlU2hvd1llYXI6ICduYXZpZ2F0ZS1zaG93LXllYXInLAogIHRvZ2dsZVNvcnQ6ICd0b2dnbGUtc29ydCcsCiAgdG9nZ2xlVmVyYmF0aW1TZWFyY2g6ICd0b2dnbGUtdmVyYmF0aW0tc2VhcmNoJywKICBzaG93SW1hZ2VzTGFyZ2U6ICdzaG93LWltYWdlcy1sYXJnZScsCiAgc2hvd0ltYWdlc01lZGl1bTogJ3Nob3ctaW1hZ2VzLW1lZGl1bScsCiAgc2hvd0ltYWdlc0ljb246ICdzaG93LWltYWdlcy1pY29uJywKfTsKCi8qKgogKiBBZGQgb3RoZXIgc2VhcmNoIGVuZ2luZXMgZG9tYWluIG9uIHVzZXIgaW5wdXQKICogQHBhcmFtIHtFbGVtZW50fSBjaGVja2JveAogKi8KY29uc3Qgc2V0U2VhcmNoRW5naW5lUGVybWlzc2lvbl8gPSBhc3luYyAoY2hlY2tib3gpID0+IHsKICBjb25zdCB1cmxzID0gT1BUSU9OQUxfUEVSTUlTU0lPTlNfVVJMU1tjaGVja2JveC5pZF07CiAgaWYgKGNoZWNrYm94LmNoZWNrZWQpIHsKICAgIGNoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTsKICAgIGNvbnN0IGdyYW50ZWQgPSBhd2FpdCBicm93c2VyLnBlcm1pc3Npb25zLnJlcXVlc3Qoe29yaWdpbnM6IHVybHN9KTsKICAgIGNoZWNrYm94LmNoZWNrZWQgPSBncmFudGVkOwogIH0gZWxzZSB7CiAgICBicm93c2VyLnBlcm1pc3Npb25zLnJlbW92ZSh7b3JpZ2luczogdXJsc30pOwogIH0KfTsKCmNsYXNzIE9wdGlvbnNQYWdlTWFuYWdlciB7CiAgYXN5bmMgaW5pdCgpIHsKICAgIGF3YWl0IHRoaXMubG9hZE9wdGlvbnMoKTsKICAgIGNvbnN0IGJyYXZlU2VhcmNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JyYXZlLXNlYXJjaCcpOwogICAgYnJhdmVTZWFyY2guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4gewogICAgICBzZXRTZWFyY2hFbmdpbmVQZXJtaXNzaW9uXyhicmF2ZVNlYXJjaCk7CiAgICB9KTsKICAgIGNvbnN0IHN0YXJ0cGFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFydHBhZ2UnKTsKICAgIHN0YXJ0cGFnZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7CiAgICAgIHNldFNlYXJjaEVuZ2luZVBlcm1pc3Npb25fKHN0YXJ0cGFnZSk7CiAgICB9KTsKICAgIGNvbnN0IHlvdXR1YmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneW91dHViZScpOwogICAgeW91dHViZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7CiAgICAgIHNldFNlYXJjaEVuZ2luZVBlcm1pc3Npb25fKHlvdXR1YmUpOwogICAgfSk7CiAgICBjb25zdCBnb29nbGVTY2hvbGFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dvb2dsZS1zY2hvbGFyJyk7CiAgICBnb29nbGVTY2hvbGFyLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpID0+IHsKICAgICAgc2V0U2VhcmNoRW5naW5lUGVybWlzc2lvbl8oZ29vZ2xlU2Nob2xhcik7CiAgICB9KTsKICAgIGNvbnN0IGdpdGh1YiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnaXRodWInKTsKICAgIGdpdGh1Yi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7CiAgICAgIHNldFNlYXJjaEVuZ2luZVBlcm1pc3Npb25fKGdpdGh1Yik7CiAgICB9KTsKICAgIGNvbnN0IGFtYXpvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhbWF6b24nKTsKICAgIGFtYXpvbi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7CiAgICAgIHNldFNlYXJjaEVuZ2luZVBlcm1pc3Npb25fKGFtYXpvbik7CiAgICB9KTsKICAgIGNvbnN0IGdpdGxhYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnaXRsYWInKTsKICAgIGdpdGxhYi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiB7CiAgICAgIHNldFNlYXJjaEVuZ2luZVBlcm1pc3Npb25fKGdpdGxhYik7CiAgICB9KTsKICAgIGNvbnN0IGN1c3RvbUdpdGxhYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjdXN0b20tZ2l0bGFiJyk7CiAgICBjdXN0b21HaXRsYWIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4gewogICAgICBzZXRTZWFyY2hFbmdpbmVQZXJtaXNzaW9uXyhjdXN0b21HaXRsYWIpOwogICAgfSk7CiAgICAvLyBOT1RFOiB0aGlzLnNhdmVPcHRpb25zIGFuZCB0aGlzLnJlc2V0VG9EZWZhdWx0cyBjYW5ub3QgYmUgcGFzc2VkIGRpcmVjdGx5CiAgICAvLyBvciBvdGhlcndpc2UgYHRoaXNgIHdvbid0IGJlIGJvdW5kIHRvIHRoZSBvYmplY3QuCiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2F2ZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gewogICAgICB0aGlzLnNhdmVPcHRpb25zKCk7CiAgICB9KTsKICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNldCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gewogICAgICB0aGlzLnJlc2V0VG9EZWZhdWx0cygpOwogICAgfSk7CiAgfQoKICAvLyBTYXZlcyBvcHRpb25zIGZyb20gdGhlIERPTSB0byBicm93c2VyLnN0b3JhZ2Uuc3luYy4KICBhc3luYyBzYXZlT3B0aW9ucygpIHsKICAgIGNvbnN0IGdldE9wdCA9IChrZXkpID0+IHsKICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5nZXQoa2V5KTsKICAgIH07CiAgICBjb25zdCBzZXRPcHQgPSAoa2V5LCB2YWx1ZSkgPT4gewogICAgICB0aGlzLm9wdGlvbnMuc2V0KGtleSwgdmFsdWUpOwogICAgfTsKICAgIC8vIEhhbmRsZSBub24ta2V5YmluZGluZ3Mgc2V0dGluZ3MgZmlyc3QKICAgIHNldE9wdCgKICAgICAgICAnd3JhcE5hdmlnYXRpb24nLAogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwLW5hdmlnYXRpb24nKS5jaGVja2VkLAogICAgKTsKICAgIHNldE9wdCgKICAgICAgICAnYXV0b1NlbGVjdEZpcnN0JywKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXV0by1zZWxlY3QtZmlyc3QnKS5jaGVja2VkLAogICAgKTsKICAgIHNldE9wdCgnaGlkZU91dGxpbmUnLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGlkZS1vdXRsaW5lJykuY2hlY2tlZCk7CiAgICBzZXRPcHQoJ2RlbGF5JywgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlbGF5JykudmFsdWUpOwogICAgc2V0T3B0KAogICAgICAgICdnb29nbGVJbmNsdWRlQ2FyZHMnLAogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnb29nbGUtaW5jbHVkZS1jYXJkcycpLmNoZWNrZWQsCiAgICApOwogICAgc2V0T3B0KAogICAgICAgICdnb29nbGVJbmNsdWRlTWVtZXgnLAogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnb29nbGUtaW5jbHVkZS1tZW1leCcpLmNoZWNrZWQsCiAgICApOwogICAgc2V0T3B0KAogICAgICAgICdnb29nbGVJbmNsdWRlUGxhY2VzJywKICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ29vZ2xlLWluY2x1ZGUtcGxhY2VzJykuY2hlY2tlZCwKICAgICk7CiAgICAvLyBIYW5kbGUga2V5YmluZGluZyBvcHRpb25zCiAgICBmb3IgKGNvbnN0IFtrZXksIG9wdE5hbWVdIG9mIE9iamVjdC5lbnRyaWVzKEtFWUJJTkRJTkdfVE9fRElWKSkgewogICAgICAvLyBLZXliaW5kaW5ncyBhcmUgc3RvcmVkIGludGVybmFsbHkgYXMgYXJyYXlzLCBidXQgZWRpdGVkIGJ5IHVzZXJzIGFzCiAgICAgIC8vIGNvbW1hbiBkZWxpbWl0ZWQgc3RyaW5ncy4KICAgICAgc2V0T3B0KAogICAgICAgICAga2V5LAogICAgICAgICAga2V5YmluZGluZ1N0cmluZ1RvQXJyYXkoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob3B0TmFtZSkudmFsdWUpLAogICAgICApOwogICAgfQogICAgY29uc3QgY3VzdG9tQ1NTID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbS1jc3MtdGV4dGFyZWEnKS52YWx1ZTsKICAgIGlmIChnZXRPcHQoJ2N1c3RvbUNTUycpICE9PSBERUZBVUxUX0NTUyB8fCBjdXN0b21DU1MgIT09IERFRkFVTFRfQ1NTKSB7CiAgICAgIGlmIChjdXN0b21DU1MudHJpbSgpKSB7CiAgICAgICAgc2V0T3B0KCdjdXN0b21DU1MnLCBjdXN0b21DU1MpOwogICAgICB9IGVsc2UgewogICAgICAgIHNldE9wdCgnY3VzdG9tQ1NTJywgREVGQVVMVF9DU1MpOwogICAgICB9CiAgICB9CiAgICBzZXRPcHQoCiAgICAgICAgJ3NpbXVsYXRlTWlkZGxlQ2xpY2snLAogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaW11bGF0ZS1taWRkbGUtY2xpY2snKS5jaGVja2VkLAogICAgKTsKICAgIGNvbnN0IGdpdGxhYlVSTFJlZ2V4ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbS1naXRsYWItdXJsJykudmFsdWU7CiAgICB0cnkgewogICAgICBuZXcgUmVnRXhwKGdpdGxhYlVSTFJlZ2V4KTsKICAgICAgc2V0T3B0KAogICAgICAgICAgJ2N1c3RvbUdpdGxhYlVybCcsCiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3VzdG9tLWdpdGxhYi11cmwnKS52YWx1ZSwKICAgICAgKTsKICAgIH0gY2F0Y2ggKGUpIHsKICAgICAgY29uc3Qgc3RhdHVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXR1cycpOwogICAgICBzdGF0dXMudGV4dENvbnRlbnQgPSBgSW52YWxpZCBnaXRsYWIgVVJMIHJlZ2V4OiAke2UubWVzc2FnZX1gOwogICAgICByZXR1cm47CiAgICB9CiAgICB0cnkgewogICAgICBhd2FpdCB0aGlzLm9wdGlvbnMuc2F2ZSgpOwogICAgICB0aGlzLmZsYXNoTWVzc2FnZSgnT3B0aW9ucyBzYXZlZCcpOwogICAgfSBjYXRjaCAoZSkgewogICAgICB0aGlzLmZsYXNoTWVzc2FnZSgnRXJyb3Igd2hlbiBzYXZpbmcgb3B0aW9ucycpOwogICAgfQogIH0KCiAgbG9hZFNlYXJjaEVuZ2luZVBlcm1pc3Npb25zXyhwZXJtaXNzaW9ucykgewogICAgLy8gQ2hlY2sgd2hhdCBVUkxzIHdlIGhhdmUgcGVybWlzc2lvbiBmb3IuCiAgICBjb25zdCBicmF2ZVNlYXJjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdicmF2ZS1zZWFyY2gnKTsKICAgIGJyYXZlU2VhcmNoLmNoZWNrZWQgPSBPUFRJT05BTF9QRVJNSVNTSU9OU19VUkxTWydicmF2ZS1zZWFyY2gnXS5ldmVyeSgKICAgICAgICAodXJsKSA9PiB7CiAgICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMub3JpZ2lucy5pbmNsdWRlcyh1cmwpOwogICAgICAgIH0sCiAgICApOwogICAgY29uc3Qgc3RhcnRwYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YXJ0cGFnZScpOwogICAgc3RhcnRwYWdlLmNoZWNrZWQgPSBPUFRJT05BTF9QRVJNSVNTSU9OU19VUkxTWydzdGFydHBhZ2UnXS5ldmVyeSgodXJsKSA9PiB7CiAgICAgIHJldHVybiBwZXJtaXNzaW9ucy5vcmlnaW5zLmluY2x1ZGVzKHVybCk7CiAgICB9KTsKICAgIGNvbnN0IHlvdXR1YmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneW91dHViZScpOwogICAgeW91dHViZS5jaGVja2VkID0gT1BUSU9OQUxfUEVSTUlTU0lPTlNfVVJMU1sneW91dHViZSddLmV2ZXJ5KCh1cmwpID0+IHsKICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLm9yaWdpbnMuaW5jbHVkZXModXJsKTsKICAgIH0pOwogICAgY29uc3QgZ29vZ2xlU2Nob2xhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnb29nbGUtc2Nob2xhcicpOwogICAgZ29vZ2xlU2Nob2xhci5jaGVja2VkID0gT1BUSU9OQUxfUEVSTUlTU0lPTlNfVVJMU1snZ29vZ2xlLXNjaG9sYXInXS5ldmVyeSgKICAgICAgICAodXJsKSA9PiB7CiAgICAgICAgICByZXR1cm4gcGVybWlzc2lvbnMub3JpZ2lucy5pbmNsdWRlcyh1cmwpOwogICAgICAgIH0sCiAgICApOwogICAgY29uc3QgYW1hem9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FtYXpvbicpOwogICAgYW1hem9uLmNoZWNrZWQgPSBPUFRJT05BTF9QRVJNSVNTSU9OU19VUkxTWydhbWF6b24nXS5ldmVyeSgodXJsKSA9PiB7CiAgICAgIHJldHVybiBwZXJtaXNzaW9ucy5vcmlnaW5zLmluY2x1ZGVzKHVybCk7CiAgICB9KTsKICAgIGNvbnN0IGdpdGh1YiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnaXRodWInKTsKICAgIGdpdGh1Yi5jaGVja2VkID0gT1BUSU9OQUxfUEVSTUlTU0lPTlNfVVJMU1snZ2l0aHViJ10uZXZlcnkoKHVybCkgPT4gewogICAgICByZXR1cm4gcGVybWlzc2lvbnMub3JpZ2lucy5pbmNsdWRlcyh1cmwpOwogICAgfSk7CiAgICBjb25zdCBnaXRsYWIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2l0bGFiJyk7CiAgICBnaXRsYWIuY2hlY2tlZCA9IE9QVElPTkFMX1BFUk1JU1NJT05TX1VSTFNbJ2dpdGxhYiddLmV2ZXJ5KCh1cmwpID0+IHsKICAgICAgcmV0dXJuIHBlcm1pc3Npb25zLm9yaWdpbnMuaW5jbHVkZXModXJsKTsKICAgIH0pOwogICAgY29uc3QgY3VzdG9tR2l0bGFiID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbS1naXRsYWInKTsKICAgIGN1c3RvbUdpdGxhYi5jaGVja2VkID0gT1BUSU9OQUxfUEVSTUlTU0lPTlNfVVJMU1snY3VzdG9tLWdpdGxhYiddLmV2ZXJ5KAogICAgICAgICh1cmwpID0+IHsKICAgICAgICAgIHJldHVybiBwZXJtaXNzaW9ucy5vcmlnaW5zLmluY2x1ZGVzKHVybCk7CiAgICAgICAgfSwKICAgICk7CiAgfQoKICAvLyBMb2FkIG9wdGlvbnMgZnJvbSBicm93c2VyLnN0b3JhZ2Uuc3luYyB0byB0aGUgRE9NLgogIGFzeW5jIGxvYWRPcHRpb25zKCkgewogICAgdGhpcy5vcHRpb25zID0gY3JlYXRlU3luY2VkT3B0aW9ucygpOwogICAgY29uc3QgWywgcGVybWlzc2lvbnNdID0gYXdhaXQgUHJvbWlzZS5hbGwoWwogICAgICB0aGlzLm9wdGlvbnMubG9hZCgpLAogICAgICBicm93c2VyLnBlcm1pc3Npb25zLmdldEFsbCgpLAogICAgXSk7CiAgICB0aGlzLmxvYWRTZWFyY2hFbmdpbmVQZXJtaXNzaW9uc18ocGVybWlzc2lvbnMpOwogICAgY29uc3QgZ2V0T3B0ID0gKGtleSkgPT4gewogICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmdldChrZXkpOwogICAgfTsKICAgIC8vIEhhbmRsZSBjaGVja3Mgc2VwYXJhdGVseS4KICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cmFwLW5hdmlnYXRpb24nKS5jaGVja2VkID0KICAgICAgZ2V0T3B0KCd3cmFwTmF2aWdhdGlvbicpOwogICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2F1dG8tc2VsZWN0LWZpcnN0JykuY2hlY2tlZCA9CiAgICAgIGdldE9wdCgnYXV0b1NlbGVjdEZpcnN0Jyk7CiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaGlkZS1vdXRsaW5lJykuY2hlY2tlZCA9IGdldE9wdCgnaGlkZU91dGxpbmUnKTsKICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWxheScpLnZhbHVlID0gZ2V0T3B0KCdkZWxheScpOwogICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbS1naXRsYWItdXJsJykudmFsdWUgPQogICAgICBnZXRPcHQoJ2N1c3RvbUdpdGxhYlVybCcpOwogICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dvb2dsZS1pbmNsdWRlLWNhcmRzJykuY2hlY2tlZCA9CiAgICAgIGdldE9wdCgnZ29vZ2xlSW5jbHVkZUNhcmRzJyk7CiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ29vZ2xlLWluY2x1ZGUtbWVtZXgnKS5jaGVja2VkID0KICAgICAgZ2V0T3B0KCdnb29nbGVJbmNsdWRlTWVtZXgnKTsKICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdnb29nbGUtaW5jbHVkZS1wbGFjZXMnKS5jaGVja2VkID0gZ2V0T3B0KAogICAgICAgICdnb29nbGVJbmNsdWRlUGxhY2VzJywKICAgICk7CiAgICAvLyBSZXN0b3JlIG9wdGlvbnMgZnJvbSBkaXZzLgogICAgZm9yIChjb25zdCBba2V5LCBvcHROYW1lXSBvZiBPYmplY3QuZW50cmllcyhLRVlCSU5ESU5HX1RPX0RJVikpIHsKICAgICAgLy8gS2V5YmluZGluZ3MgYXJlIHN0b3JlZCBpbnRlcm5hbGx5IGFzIGFycmF5cywgYnV0IGVkaXRlZCBieSB1c2VycyBhcwogICAgICAvLyBjb21tYW4gZGVsaW1pdGVkIHN0cmluZ3MuCiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9wdE5hbWUpLnZhbHVlID0ga2V5YmluZGluZ0FycmF5VG9TdHJpbmcoCiAgICAgICAgICBnZXRPcHQoa2V5KSwKICAgICAgKTsKICAgIH0KICAgIC8vIExvYWQgY3VzdG9tIENTUwogICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1c3RvbS1jc3MtdGV4dGFyZWEnKS52YWx1ZSA9IGdldE9wdCgnY3VzdG9tQ1NTJyk7CiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2ltdWxhdGUtbWlkZGxlLWNsaWNrJykuY2hlY2tlZCA9IGdldE9wdCgKICAgICAgICAnc2ltdWxhdGVNaWRkbGVDbGljaycsCiAgICApOwogIH0KCiAgYXN5bmMgcmVzZXRUb0RlZmF1bHRzKCkgewogICAgdHJ5IHsKICAgICAgYXdhaXQgdGhpcy5vcHRpb25zLmNsZWFyKCk7CiAgICAgIGF3YWl0IHRoaXMubG9hZE9wdGlvbnMoKTsKICAgICAgdGhpcy5mbGFzaE1lc3NhZ2UoJ09wdGlvbnMgc2V0IHRvIGRlZmF1bHRzJyk7CiAgICB9IGNhdGNoIChlKSB7CiAgICAgIHRoaXMuZmxhc2hNZXNzYWdlKCdFcnJvciB3aGVuIHNldHRpbmcgb3B0aW9ucyB0byBkZWZhdWx0cycpOwogICAgfQogIH0KCiAgZmxhc2hNZXNzYWdlKG1lc3NhZ2UpIHsKICAgIC8vIFVwZGF0ZSBzdGF0dXMgdG8gbGV0IHVzZXIga25vdy4KICAgIGNvbnN0IHN0YXR1cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0dXMnKTsKICAgIHN0YXR1cy50ZXh0Q29udGVudCA9IG1lc3NhZ2U7CiAgICBzZXRUaW1lb3V0KCgpID0+IHsKICAgICAgc3RhdHVzLnRleHRDb250ZW50ID0gJyc7CiAgICB9LCAzMDAwKTsKICB9Cn0KCmNvbnN0IG1hbmFnZXIgPSBuZXcgT3B0aW9uc1BhZ2VNYW5hZ2VyKCk7Ci8vIE5PVEU6IG1hbmFnZXIuaW5pdCBjYW5ub3QgYmUgcGFzc2VkIGRpcmVjdGx5IG9yIG90aGVyd2lzZSBgdGhpc2Agd29uJ3QgYmUKLy8gYm91bmQgdG8gdGhlIG9iamVjdC4KZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsKICBtYW5hZ2VyLmluaXQoKTsKfSk7Cg=="></script>\n</body>\n\n</html>\n',
			  };
			
			  function _testBlobCSP() {
			    try {
			      // Create a random blob with some simple JavaScript content
			      const code = `console.log("Blob CSP test");`;
			      const blob = new Blob([code], { type: "application/javascript" });
			      const blobUrl = URL.createObjectURL(blob);
			
			      // Create a script tag to load the blob URL
			      const script = document.createElement("script");
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
			
			  function _base64ToBlob(base64, mimeType = "application/octet-stream") {
			    const binary = atob(base64);
			    const len = binary.length;
			    const bytes = new Uint8Array(len);
			    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
			    return new Blob([bytes], { type: mimeType });
			  }
			
			  function _getMimeTypeFromPath(p) {
			    const ext = (p.split(".").pop() || "").toLowerCase();
			    const map = {
			      html: "text/html",
			      htm: "text/html",
			      js: "text/javascript",
			      css: "text/css",
			      json: "application/json",
			      png: "image/png",
			      jpg: "image/jpeg",
			      jpeg: "image/jpeg",
			      gif: "image/gif",
			      svg: "image/svg+xml",
			      webp: "image/webp",
			      ico: "image/x-icon",
			      woff: "font/woff",
			      woff2: "font/woff2",
			      ttf: "font/ttf",
			      otf: "font/otf",
			      eot: "application/vnd.ms-fontobject",
			    };
			    return map[ext] || "application/octet-stream";
			  }
			
			  function _isTextAsset(ext) {
			    return ["html", "htm", "js", "css", "json", "svg", "txt", "xml"].includes(
			      ext,
			    );
			  }
			
			  function _createAssetUrl(path = "") {
			    if (path.startsWith("/")) path = path.slice(1);
			    const assetData = EXTENSION_ASSETS_MAP[path];
			    if (typeof assetData === "undefined") {
			      console.warn("[runtime.getURL] Asset not found for", path);
			      return path;
			    }
			
			    const mime = _getMimeTypeFromPath(path);
			    const ext = (path.split(".").pop() || "").toLowerCase();
			
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
		    const BUS = createEventBus(
		      "web-search-navigator",
		      IS_IFRAME ? "iframe" : "page",
		    );
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
			            "INJECTED_MANIFEST not found for chrome.runtime.getManifest",
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
			            `chrome.runtime.getURL fallback for '${path}'. Assets may not be available.`,
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
			        id:
			          "polyfilled-extension-" + Math.random().toString(36).substring(2, 15),
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
			            } else if (
			              userAgent.includes("i386") ||
			              userAgent.includes("i686")
			            ) {
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
			            "chrome.tabs.query polyfill only returns current tab info.",
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
			            `chrome.tabs.sendMessage polyfill (to tab ${tabId}) redirects to runtime.sendMessage (current context).`,
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
			              id =
			                "notification_" + Math.random().toString(36).substring(2, 15);
			            } else if (typeof notificationId === "string" && options) {
			              // Two parameters: create(id, options)
			              id = notificationId;
			              notificationOptions = options;
			            } else {
			              throw new Error("Invalid parameters for notifications.create");
			            }
			
			            if (
			              !notificationOptions ||
			              typeof notificationOptions !== "object"
			            ) {
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
			                    `[Notifications] Created notification after permission: ${id}`,
			                  );
			                  return id;
			                } else {
			                  console.warn(
			                    "[Notifications] Permission denied for notifications",
			                  );
			                  return id; // Return ID even if notification wasn't shown
			                }
			              } else {
			                console.warn("[Notifications] Notifications are blocked");
			                return id;
			              }
			            } else {
			              console.warn(
			                "[Notifications] Native notifications not supported, using console fallback",
			              );
			              console.log(`[Notification] ${title}: ${message}`);
			              return id;
			            }
			          } catch (error) {
			            console.error(
			              "[Notifications] Error creating notification:",
			              error.message,
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
			          console.warn(
			            "[Notifications] getAll not fully supported in polyfill",
			          );
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
			              throw new Error(
			                "Context menu create properties must be an object",
			              );
			            }
			
			            const {
			              id,
			              title,
			              contexts = ["page"],
			              onclick,
			            } = createProperties;
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
			              `[ContextMenus] Created context menu item: ${title} (${menuId})`,
			            );
			
			            // Try to register a menu command as fallback
			            if (typeof _registerMenuCommand === "function") {
			              try {
			                _registerMenuCommand(
			                  title,
			                  onclick ||
			                    (() => {
			                      console.log(`Context menu clicked: ${title}`);
			                    }),
			                );
			              } catch (e) {
			                console.warn(
			                  "[ContextMenus] Failed to register as menu command:",
			                  e.message,
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
			              error.message,
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
			              error.message,
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
			                `[ContextMenus] Removed context menu item: ${menuItemId}`,
			              );
			            } else {
			              console.warn(
			                `[ContextMenus] Context menu item not found for removal: ${menuItemId}`,
			              );
			            }
			
			            if (callback && typeof callback === "function") {
			              setTimeout(() => callback(), 0);
			            }
			          } catch (error) {
			            console.error(
			              "[ContextMenus] Error removing context menu:",
			              error.message,
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
			                `[ContextMenus] Removed all ${count} context menu items`,
			              );
			            }
			
			            if (callback && typeof callback === "function") {
			              setTimeout(() => callback(), 0);
			            }
			          } catch (error) {
			            console.error(
			              "[ContextMenus] Error removing all context menus:",
			              error.message,
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
			          `[${contextType}] [CHROME - ${_key}] Setting ${key} to ${value}`,
			        );
			        return Reflect.set(target, key, value, receiver);
			      },
			      has(target, key) {
			        console.log(
			          `[${contextType}] [CHROME - ${_key}] Checking if ${key} exists`,
			        );
			        return Reflect.has(target, key);
			      },
			    });
			    chrome = Object.fromEntries(
			      Object.entries(chrome).map(([key, value]) => [
			        key,
			        new Proxy(value, loggingProxyHandler(key)),
			      ]),
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
			  if (typeof window !== "undefined") {
			    window.buildPolyfill = buildPolyfill;
			  }
			
    // #endregion
  // #endregion
  // #endregion
  // #region Background Script Environment
	
  // #endregion
  // #region Orchestration Logic
	  const SCRIPT_NAME = "Web Search Navigator";
	
	  const INJECTED_MANIFEST = {
	    manifest_version: 2,
	    name: "Web Search Navigator",
	    version: "0.5.2",
	    description:
	      "Keyboard shortcuts for Google search, YouTube, Startpage, Brave Search, Google Scholar, Github, and Amazon.",
	    permissions: ["storage"],
	    content_scripts: [
	      {
	        js: [
	          "browser-polyfill.js",
	          "mousetrap.js",
	          "mousetrap-global-bind.js",
	          "options.js",
	          "search_engines.js",
	          "main.js",
	        ],
	        run_at: "document_end",
	        matches: [
	          "*://www.google.com/search*",
	          "*://www.google.ad/search*",
	          "*://www.google.ae/search*",
	          "*://www.google.com.af/search*",
	          "*://www.google.com.ag/search*",
	          "*://www.google.com.ai/search*",
	          "*://www.google.al/search*",
	          "*://www.google.am/search*",
	          "*://www.google.co.ao/search*",
	          "*://www.google.com.ar/search*",
	          "*://www.google.as/search*",
	          "*://www.google.at/search*",
	          "*://www.google.com.au/search*",
	          "*://www.google.az/search*",
	          "*://www.google.ba/search*",
	          "*://www.google.com.bd/search*",
	          "*://www.google.be/search*",
	          "*://www.google.bf/search*",
	          "*://www.google.bg/search*",
	          "*://www.google.com.bh/search*",
	          "*://www.google.bi/search*",
	          "*://www.google.bj/search*",
	          "*://www.google.com.bn/search*",
	          "*://www.google.com.bo/search*",
	          "*://www.google.com.br/search*",
	          "*://www.google.bs/search*",
	          "*://www.google.bt/search*",
	          "*://www.google.co.bw/search*",
	          "*://www.google.by/search*",
	          "*://www.google.com.bz/search*",
	          "*://www.google.ca/search*",
	          "*://www.google.cd/search*",
	          "*://www.google.cf/search*",
	          "*://www.google.cg/search*",
	          "*://www.google.ch/search*",
	          "*://www.google.ci/search*",
	          "*://www.google.co.ck/search*",
	          "*://www.google.cl/search*",
	          "*://www.google.cm/search*",
	          "*://www.google.cn/search*",
	          "*://www.google.com.co/search*",
	          "*://www.google.co.cr/search*",
	          "*://www.google.com.cu/search*",
	          "*://www.google.cv/search*",
	          "*://www.google.com.cy/search*",
	          "*://www.google.cz/search*",
	          "*://www.google.de/search*",
	          "*://www.google.dj/search*",
	          "*://www.google.dk/search*",
	          "*://www.google.dm/search*",
	          "*://www.google.com.do/search*",
	          "*://www.google.dz/search*",
	          "*://www.google.com.ec/search*",
	          "*://www.google.ee/search*",
	          "*://www.google.com.eg/search*",
	          "*://www.google.es/search*",
	          "*://www.google.com.et/search*",
	          "*://www.google.fi/search*",
	          "*://www.google.com.fj/search*",
	          "*://www.google.fm/search*",
	          "*://www.google.fr/search*",
	          "*://www.google.ga/search*",
	          "*://www.google.ge/search*",
	          "*://www.google.gg/search*",
	          "*://www.google.com.gh/search*",
	          "*://www.google.com.gi/search*",
	          "*://www.google.gl/search*",
	          "*://www.google.gm/search*",
	          "*://www.google.gp/search*",
	          "*://www.google.gr/search*",
	          "*://www.google.com.gt/search*",
	          "*://www.google.gy/search*",
	          "*://www.google.com.hk/search*",
	          "*://www.google.hn/search*",
	          "*://www.google.hr/search*",
	          "*://www.google.ht/search*",
	          "*://www.google.hu/search*",
	          "*://www.google.co.id/search*",
	          "*://www.google.ie/search*",
	          "*://www.google.co.il/search*",
	          "*://www.google.im/search*",
	          "*://www.google.co.in/search*",
	          "*://www.google.iq/search*",
	          "*://www.google.is/search*",
	          "*://www.google.it/search*",
	          "*://www.google.je/search*",
	          "*://www.google.com.jm/search*",
	          "*://www.google.jo/search*",
	          "*://www.google.co.jp/search*",
	          "*://www.google.co.ke/search*",
	          "*://www.google.com.kh/search*",
	          "*://www.google.ki/search*",
	          "*://www.google.kg/search*",
	          "*://www.google.co.kr/search*",
	          "*://www.google.com.kw/search*",
	          "*://www.google.kz/search*",
	          "*://www.google.la/search*",
	          "*://www.google.com.lb/search*",
	          "*://www.google.li/search*",
	          "*://www.google.lk/search*",
	          "*://www.google.co.ls/search*",
	          "*://www.google.lt/search*",
	          "*://www.google.lu/search*",
	          "*://www.google.lv/search*",
	          "*://www.google.com.ly/search*",
	          "*://www.google.co.ma/search*",
	          "*://www.google.md/search*",
	          "*://www.google.me/search*",
	          "*://www.google.mg/search*",
	          "*://www.google.mk/search*",
	          "*://www.google.ml/search*",
	          "*://www.google.com.mm/search*",
	          "*://www.google.mn/search*",
	          "*://www.google.ms/search*",
	          "*://www.google.com.mt/search*",
	          "*://www.google.mu/search*",
	          "*://www.google.mv/search*",
	          "*://www.google.mw/search*",
	          "*://www.google.com.mx/search*",
	          "*://www.google.com.my/search*",
	          "*://www.google.co.mz/search*",
	          "*://www.google.com.na/search*",
	          "*://www.google.com.nf/search*",
	          "*://www.google.com.ng/search*",
	          "*://www.google.com.ni/search*",
	          "*://www.google.ne/search*",
	          "*://www.google.nl/search*",
	          "*://www.google.no/search*",
	          "*://www.google.com.np/search*",
	          "*://www.google.nr/search*",
	          "*://www.google.nu/search*",
	          "*://www.google.co.nz/search*",
	          "*://www.google.com.om/search*",
	          "*://www.google.com.pa/search*",
	          "*://www.google.com.pe/search*",
	          "*://www.google.com.pg/search*",
	          "*://www.google.com.ph/search*",
	          "*://www.google.com.pk/search*",
	          "*://www.google.pl/search*",
	          "*://www.google.pn/search*",
	          "*://www.google.com.pr/search*",
	          "*://www.google.ps/search*",
	          "*://www.google.pt/search*",
	          "*://www.google.com.py/search*",
	          "*://www.google.com.qa/search*",
	          "*://www.google.ro/search*",
	          "*://www.google.ru/search*",
	          "*://www.google.rw/search*",
	          "*://www.google.com.sa/search*",
	          "*://www.google.com.sb/search*",
	          "*://www.google.sc/search*",
	          "*://www.google.se/search*",
	          "*://www.google.com.sg/search*",
	          "*://www.google.sh/search*",
	          "*://www.google.si/search*",
	          "*://www.google.sk/search*",
	          "*://www.google.com.sl/search*",
	          "*://www.google.sn/search*",
	          "*://www.google.so/search*",
	          "*://www.google.sm/search*",
	          "*://www.google.sr/search*",
	          "*://www.google.st/search*",
	          "*://www.google.com.sv/search*",
	          "*://www.google.td/search*",
	          "*://www.google.tg/search*",
	          "*://www.google.co.th/search*",
	          "*://www.google.com.tj/search*",
	          "*://www.google.tk/search*",
	          "*://www.google.tl/search*",
	          "*://www.google.tm/search*",
	          "*://www.google.tn/search*",
	          "*://www.google.to/search*",
	          "*://www.google.com.tr/search*",
	          "*://www.google.tt/search*",
	          "*://www.google.com.tw/search*",
	          "*://www.google.co.tz/search*",
	          "*://www.google.com.ua/search*",
	          "*://www.google.co.ug/search*",
	          "*://www.google.co.uk/search*",
	          "*://www.google.com.uy/search*",
	          "*://www.google.co.uz/search*",
	          "*://www.google.com.vc/search*",
	          "*://www.google.co.ve/search*",
	          "*://www.google.vg/search*",
	          "*://www.google.co.vi/search*",
	          "*://www.google.com.vn/search*",
	          "*://www.google.vu/search*",
	          "*://www.google.ws/search*",
	          "*://www.google.rs/search*",
	          "*://www.google.co.za/search*",
	          "*://www.google.co.zm/search*",
	          "*://www.google.co.zw/search*",
	          "*://www.google.cat/search*",
	        ],
	        css: [],
	        _orderPreserved: true,
	      },
	    ],
	    options_ui: { page: "options_page.html", chrome_style: true },
	    browser_action: {},
	    page_action: {},
	    action: {},
	    icons: { 16: "icon16.png", 48: "icon48.png", 128: "icon128.png" },
	    web_accessible_resources: [],
	    _id: "web-search-navigator",
	  };
	  // Minimal configs just to check if *any* script should run on this page
	  const CONTENT_SCRIPT_CONFIGS_FOR_MATCHING = [
	    {
	      matches: [
	        "*://www.google.com/search*",
	        "*://www.google.ad/search*",
	        "*://www.google.ae/search*",
	        "*://www.google.com.af/search*",
	        "*://www.google.com.ag/search*",
	        "*://www.google.com.ai/search*",
	        "*://www.google.al/search*",
	        "*://www.google.am/search*",
	        "*://www.google.co.ao/search*",
	        "*://www.google.com.ar/search*",
	        "*://www.google.as/search*",
	        "*://www.google.at/search*",
	        "*://www.google.com.au/search*",
	        "*://www.google.az/search*",
	        "*://www.google.ba/search*",
	        "*://www.google.com.bd/search*",
	        "*://www.google.be/search*",
	        "*://www.google.bf/search*",
	        "*://www.google.bg/search*",
	        "*://www.google.com.bh/search*",
	        "*://www.google.bi/search*",
	        "*://www.google.bj/search*",
	        "*://www.google.com.bn/search*",
	        "*://www.google.com.bo/search*",
	        "*://www.google.com.br/search*",
	        "*://www.google.bs/search*",
	        "*://www.google.bt/search*",
	        "*://www.google.co.bw/search*",
	        "*://www.google.by/search*",
	        "*://www.google.com.bz/search*",
	        "*://www.google.ca/search*",
	        "*://www.google.cd/search*",
	        "*://www.google.cf/search*",
	        "*://www.google.cg/search*",
	        "*://www.google.ch/search*",
	        "*://www.google.ci/search*",
	        "*://www.google.co.ck/search*",
	        "*://www.google.cl/search*",
	        "*://www.google.cm/search*",
	        "*://www.google.cn/search*",
	        "*://www.google.com.co/search*",
	        "*://www.google.co.cr/search*",
	        "*://www.google.com.cu/search*",
	        "*://www.google.cv/search*",
	        "*://www.google.com.cy/search*",
	        "*://www.google.cz/search*",
	        "*://www.google.de/search*",
	        "*://www.google.dj/search*",
	        "*://www.google.dk/search*",
	        "*://www.google.dm/search*",
	        "*://www.google.com.do/search*",
	        "*://www.google.dz/search*",
	        "*://www.google.com.ec/search*",
	        "*://www.google.ee/search*",
	        "*://www.google.com.eg/search*",
	        "*://www.google.es/search*",
	        "*://www.google.com.et/search*",
	        "*://www.google.fi/search*",
	        "*://www.google.com.fj/search*",
	        "*://www.google.fm/search*",
	        "*://www.google.fr/search*",
	        "*://www.google.ga/search*",
	        "*://www.google.ge/search*",
	        "*://www.google.gg/search*",
	        "*://www.google.com.gh/search*",
	        "*://www.google.com.gi/search*",
	        "*://www.google.gl/search*",
	        "*://www.google.gm/search*",
	        "*://www.google.gp/search*",
	        "*://www.google.gr/search*",
	        "*://www.google.com.gt/search*",
	        "*://www.google.gy/search*",
	        "*://www.google.com.hk/search*",
	        "*://www.google.hn/search*",
	        "*://www.google.hr/search*",
	        "*://www.google.ht/search*",
	        "*://www.google.hu/search*",
	        "*://www.google.co.id/search*",
	        "*://www.google.ie/search*",
	        "*://www.google.co.il/search*",
	        "*://www.google.im/search*",
	        "*://www.google.co.in/search*",
	        "*://www.google.iq/search*",
	        "*://www.google.is/search*",
	        "*://www.google.it/search*",
	        "*://www.google.je/search*",
	        "*://www.google.com.jm/search*",
	        "*://www.google.jo/search*",
	        "*://www.google.co.jp/search*",
	        "*://www.google.co.ke/search*",
	        "*://www.google.com.kh/search*",
	        "*://www.google.ki/search*",
	        "*://www.google.kg/search*",
	        "*://www.google.co.kr/search*",
	        "*://www.google.com.kw/search*",
	        "*://www.google.kz/search*",
	        "*://www.google.la/search*",
	        "*://www.google.com.lb/search*",
	        "*://www.google.li/search*",
	        "*://www.google.lk/search*",
	        "*://www.google.co.ls/search*",
	        "*://www.google.lt/search*",
	        "*://www.google.lu/search*",
	        "*://www.google.lv/search*",
	        "*://www.google.com.ly/search*",
	        "*://www.google.co.ma/search*",
	        "*://www.google.md/search*",
	        "*://www.google.me/search*",
	        "*://www.google.mg/search*",
	        "*://www.google.mk/search*",
	        "*://www.google.ml/search*",
	        "*://www.google.com.mm/search*",
	        "*://www.google.mn/search*",
	        "*://www.google.ms/search*",
	        "*://www.google.com.mt/search*",
	        "*://www.google.mu/search*",
	        "*://www.google.mv/search*",
	        "*://www.google.mw/search*",
	        "*://www.google.com.mx/search*",
	        "*://www.google.com.my/search*",
	        "*://www.google.co.mz/search*",
	        "*://www.google.com.na/search*",
	        "*://www.google.com.nf/search*",
	        "*://www.google.com.ng/search*",
	        "*://www.google.com.ni/search*",
	        "*://www.google.ne/search*",
	        "*://www.google.nl/search*",
	        "*://www.google.no/search*",
	        "*://www.google.com.np/search*",
	        "*://www.google.nr/search*",
	        "*://www.google.nu/search*",
	        "*://www.google.co.nz/search*",
	        "*://www.google.com.om/search*",
	        "*://www.google.com.pa/search*",
	        "*://www.google.com.pe/search*",
	        "*://www.google.com.pg/search*",
	        "*://www.google.com.ph/search*",
	        "*://www.google.com.pk/search*",
	        "*://www.google.pl/search*",
	        "*://www.google.pn/search*",
	        "*://www.google.com.pr/search*",
	        "*://www.google.ps/search*",
	        "*://www.google.pt/search*",
	        "*://www.google.com.py/search*",
	        "*://www.google.com.qa/search*",
	        "*://www.google.ro/search*",
	        "*://www.google.ru/search*",
	        "*://www.google.rw/search*",
	        "*://www.google.com.sa/search*",
	        "*://www.google.com.sb/search*",
	        "*://www.google.sc/search*",
	        "*://www.google.se/search*",
	        "*://www.google.com.sg/search*",
	        "*://www.google.sh/search*",
	        "*://www.google.si/search*",
	        "*://www.google.sk/search*",
	        "*://www.google.com.sl/search*",
	        "*://www.google.sn/search*",
	        "*://www.google.so/search*",
	        "*://www.google.sm/search*",
	        "*://www.google.sr/search*",
	        "*://www.google.st/search*",
	        "*://www.google.com.sv/search*",
	        "*://www.google.td/search*",
	        "*://www.google.tg/search*",
	        "*://www.google.co.th/search*",
	        "*://www.google.com.tj/search*",
	        "*://www.google.tk/search*",
	        "*://www.google.tl/search*",
	        "*://www.google.tm/search*",
	        "*://www.google.tn/search*",
	        "*://www.google.to/search*",
	        "*://www.google.com.tr/search*",
	        "*://www.google.tt/search*",
	        "*://www.google.com.tw/search*",
	        "*://www.google.co.tz/search*",
	        "*://www.google.com.ua/search*",
	        "*://www.google.co.ug/search*",
	        "*://www.google.co.uk/search*",
	        "*://www.google.com.uy/search*",
	        "*://www.google.co.uz/search*",
	        "*://www.google.com.vc/search*",
	        "*://www.google.co.ve/search*",
	        "*://www.google.vg/search*",
	        "*://www.google.co.vi/search*",
	        "*://www.google.com.vn/search*",
	        "*://www.google.vu/search*",
	        "*://www.google.ws/search*",
	        "*://www.google.rs/search*",
	        "*://www.google.co.za/search*",
	        "*://www.google.co.zm/search*",
	        "*://www.google.co.zw/search*",
	        "*://www.google.cat/search*",
	      ],
	    },
	  ];
	  // Options page path (relative inside EXTENSION_ASSETS_MAP) if available
	  const OPTIONS_PAGE_PATH = "options_page.html";
	  // Popup page path (relative inside EXTENSION_ASSETS_MAP) if available
	  const POPUP_PAGE_PATH = null;
	  // Extension icon as data URL (size closest to 48px)
	  const EXTENSION_ICON =
	    "data:image/png;base64,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";
	  // CSS data is needed by the combined execution logic
	  const extensionCssData = {};
	
	  const LOCALE_KEYS = {};
	
	  // Function to convert match pattern string to a RegExp object
	  const convertMatchPatternToRegExp = function convertMatchPatternToRegExp(
	    pattern,
	  ) {
	    if (pattern === "<all_urls>") return new RegExp(".*");
	    try {
	      const singleEscapedPattern = convertMatchPatternToRegExpString(
	        pattern,
	      ).replace(/\\\\/g, "\\");
	      return new RegExp(singleEscapedPattern);
	    } catch (error) {
	      console.error(
	        `Error converting match pattern to RegExp: ${pattern}`,
	        error,
	      );
	      return new RegExp("$.");
	    }
	  };
	  // Function to convert match pattern string to a double-escaped string for RegExp constructor
	  const convertMatchPatternToRegExpString =
	    function convertMatchPatternToRegExpString(pattern) {
	      function escapeRegex(s) {
	        return s.replace(/[.*+?^${}()|[\]\\]/g, "\\\\$&");
	      }
	      if (typeof pattern !== "string" || !pattern) return "$.";
	      const schemeMatch = pattern.match(/^(\*|https?|file|ftp):\/\//);
	      if (!schemeMatch) return "$.";
	      const scheme = schemeMatch[1];
	      pattern = pattern.substring(schemeMatch[0].length);
	      const schemeRegex = scheme === "*" ? "https?|file|ftp" : scheme,
	        hostMatch = pattern.match(/^([^\/]+)/);
	      if (!hostMatch) return "$.";
	      const host = hostMatch[1];
	      pattern = pattern.substring(host.length);
	      let hostRegex;
	      if (host === "*") hostRegex = "[^/]+";
	      else if (host.startsWith("*."))
	        hostRegex = "(?:[^\\/]+\\.)?" + escapeRegex(host.substring(2));
	      else hostRegex = escapeRegex(host);
	      let pathRegex = pattern;
	      if (!pathRegex.startsWith("/")) pathRegex = "/" + pathRegex;
	      pathRegex = pathRegex.split("*").map(escapeRegex).join(".*");
	      if (pathRegex === "/.*") pathRegex = "(?:/.*)?";
	      else pathRegex = pathRegex + "(?:[?#]|$)";
	      return `^${schemeRegex}:\\/\\/${hostRegex}${pathRegex}`;
	    };
	
	  // Web accessible resources utility functions
	  function _matchGlobPattern(pattern, path) {
	    if (!pattern || !path) return false;
	
	    // Normalize paths to use forward slashes
	    pattern = pattern.replace(/\\/g, "/");
	    path = path.replace(/\\/g, "/");
	
	    // Handle exact matches first
	    if (pattern === path) return true;
	
	    // Convert glob pattern to regex
	    // Escape special regex chars except * and **
	    let regexPattern = pattern
	      .replace(/[.+?^${}()|[\]\\]/g, "\\$&") // Escape regex chars
	      .replace(/\*\*/g, "__DOUBLESTAR__") // Temporarily replace **
	      .replace(/\*/g, "[^/]*") // * matches any chars except /
	      .replace(/__DOUBLESTAR__/g, ".*"); // ** matches any chars including /
	
	    // Ensure pattern matches from start to end
	    regexPattern = "^" + regexPattern + "$";
	
	    try {
	      const regex = new RegExp(regexPattern);
	      return regex.test(path);
	    } catch (e) {
	      console.error(`Invalid glob pattern: ${pattern}`, e);
	      return false;
	    }
	  }
	
	  function _isWebAccessibleResource(resourcePath, webAccessibleResources) {
	    if (
	      !Array.isArray(webAccessibleResources) ||
	      webAccessibleResources.length === 0
	    ) {
	      return false;
	    }
	
	    // Normalize the resource path
	    const normalizedPath = resourcePath.replace(/\\/g, "/").replace(/^\/+/, "");
	
	    for (const webAccessibleResource of webAccessibleResources) {
	      let patterns = [];
	
	      // Handle both manifest v2 and v3 formats
	      if (typeof webAccessibleResource === "string") {
	        // Manifest v2 format: array of strings
	        patterns = [webAccessibleResource];
	      } else if (
	        webAccessibleResource &&
	        Array.isArray(webAccessibleResource.resources)
	      ) {
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
		    const { chrome, browser, global, window, self } = globalThis;
		    const scriptName = "Web Search Navigator"; // Make name available inside
		    console.log(`[${scriptName}] Starting execution phases...`);
		
    // #region Document Start
			    if (typeof document !== "undefined") {
			      console.log(`[${scriptName}] Executing document-start phase...`);
			
			      const scriptPaths = [];
			      console.log(`  Executing JS (start): ${scriptPaths}`);
			
			      try {
			        // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
			        with (globalThis) {
			        }
			      } catch (e) {
			        console.error(`  Error executing scripts ${scriptPaths}`, e);
			      }
			    } else {
			      console.log(
			        `[${scriptName}] Skipping document-start phase (no document).`,
			      );
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
			    if (typeof document !== "undefined") {
			      console.log(`[${scriptName}] Executing document-end phase...`);
			
			      const scriptPaths = [
			        "browser-polyfill.js",
			        "mousetrap.js",
			        "mousetrap-global-bind.js",
			        "options.js",
			        "search_engines.js",
			        "main.js",
			      ];
			      console.log(`  Executing JS (end): ${scriptPaths}`);
			
			      try {
			        // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
			        with (globalThis) {
			          // START: browser-polyfill.js
			          !(function (e, r) {
			            if ("function" == typeof define && define.amd)
			              define("webextension-polyfill", ["module"], r);
			            else if ("undefined" != typeof exports) r(module);
			            else {
			              var s = { exports: {} };
			              r(s), (e.browser = s.exports);
			            }
			          })(
			            "undefined" != typeof globalThis
			              ? globalThis
			              : "undefined" != typeof self
			                ? self
			                : this,
			            function (e) {
			              "use strict";
			              if (!globalThis.chrome?.runtime?.id)
			                throw new Error(
			                  "This script should only be loaded in a browser extension.",
			                );
			              if (
			                void 0 === globalThis.browser ||
			                Object.getPrototypeOf(globalThis.browser) !== Object.prototype
			              ) {
			                const r =
			                    "The message port closed before a response was received.",
			                  s = (e) => {
			                    const s = {
			                      alarms: {
			                        clear: { minArgs: 0, maxArgs: 1 },
			                        clearAll: { minArgs: 0, maxArgs: 0 },
			                        get: { minArgs: 0, maxArgs: 1 },
			                        getAll: { minArgs: 0, maxArgs: 0 },
			                      },
			                      bookmarks: {
			                        create: { minArgs: 1, maxArgs: 1 },
			                        get: { minArgs: 1, maxArgs: 1 },
			                        getChildren: { minArgs: 1, maxArgs: 1 },
			                        getRecent: { minArgs: 1, maxArgs: 1 },
			                        getSubTree: { minArgs: 1, maxArgs: 1 },
			                        getTree: { minArgs: 0, maxArgs: 0 },
			                        move: { minArgs: 2, maxArgs: 2 },
			                        remove: { minArgs: 1, maxArgs: 1 },
			                        removeTree: { minArgs: 1, maxArgs: 1 },
			                        search: { minArgs: 1, maxArgs: 1 },
			                        update: { minArgs: 2, maxArgs: 2 },
			                      },
			                      browserAction: {
			                        disable: {
			                          minArgs: 0,
			                          maxArgs: 1,
			                          fallbackToNoCallback: !0,
			                        },
			                        enable: {
			                          minArgs: 0,
			                          maxArgs: 1,
			                          fallbackToNoCallback: !0,
			                        },
			                        getBadgeBackgroundColor: { minArgs: 1, maxArgs: 1 },
			                        getBadgeText: { minArgs: 1, maxArgs: 1 },
			                        getPopup: { minArgs: 1, maxArgs: 1 },
			                        getTitle: { minArgs: 1, maxArgs: 1 },
			                        openPopup: { minArgs: 0, maxArgs: 0 },
			                        setBadgeBackgroundColor: {
			                          minArgs: 1,
			                          maxArgs: 1,
			                          fallbackToNoCallback: !0,
			                        },
			                        setBadgeText: {
			                          minArgs: 1,
			                          maxArgs: 1,
			                          fallbackToNoCallback: !0,
			                        },
			                        setIcon: { minArgs: 1, maxArgs: 1 },
			                        setPopup: {
			                          minArgs: 1,
			                          maxArgs: 1,
			                          fallbackToNoCallback: !0,
			                        },
			                        setTitle: {
			                          minArgs: 1,
			                          maxArgs: 1,
			                          fallbackToNoCallback: !0,
			                        },
			                      },
			                      browsingData: {
			                        remove: { minArgs: 2, maxArgs: 2 },
			                        removeCache: { minArgs: 1, maxArgs: 1 },
			                        removeCookies: { minArgs: 1, maxArgs: 1 },
			                        removeDownloads: { minArgs: 1, maxArgs: 1 },
			                        removeFormData: { minArgs: 1, maxArgs: 1 },
			                        removeHistory: { minArgs: 1, maxArgs: 1 },
			                        removeLocalStorage: { minArgs: 1, maxArgs: 1 },
			                        removePasswords: { minArgs: 1, maxArgs: 1 },
			                        removePluginData: { minArgs: 1, maxArgs: 1 },
			                        settings: { minArgs: 0, maxArgs: 0 },
			                      },
			                      commands: { getAll: { minArgs: 0, maxArgs: 0 } },
			                      contextMenus: {
			                        remove: { minArgs: 1, maxArgs: 1 },
			                        removeAll: { minArgs: 0, maxArgs: 0 },
			                        update: { minArgs: 2, maxArgs: 2 },
			                      },
			                      cookies: {
			                        get: { minArgs: 1, maxArgs: 1 },
			                        getAll: { minArgs: 1, maxArgs: 1 },
			                        getAllCookieStores: { minArgs: 0, maxArgs: 0 },
			                        remove: { minArgs: 1, maxArgs: 1 },
			                        set: { minArgs: 1, maxArgs: 1 },
			                      },
			                      devtools: {
			                        inspectedWindow: {
			                          eval: {
			                            minArgs: 1,
			                            maxArgs: 2,
			                            singleCallbackArg: !1,
			                          },
			                        },
			                        panels: {
			                          create: {
			                            minArgs: 3,
			                            maxArgs: 3,
			                            singleCallbackArg: !0,
			                          },
			                          elements: {
			                            createSidebarPane: { minArgs: 1, maxArgs: 1 },
			                          },
			                        },
			                      },
			                      downloads: {
			                        cancel: { minArgs: 1, maxArgs: 1 },
			                        download: { minArgs: 1, maxArgs: 1 },
			                        erase: { minArgs: 1, maxArgs: 1 },
			                        getFileIcon: { minArgs: 1, maxArgs: 2 },
			                        open: {
			                          minArgs: 1,
			                          maxArgs: 1,
			                          fallbackToNoCallback: !0,
			                        },
			                        pause: { minArgs: 1, maxArgs: 1 },
			                        removeFile: { minArgs: 1, maxArgs: 1 },
			                        resume: { minArgs: 1, maxArgs: 1 },
			                        search: { minArgs: 1, maxArgs: 1 },
			                        show: {
			                          minArgs: 1,
			                          maxArgs: 1,
			                          fallbackToNoCallback: !0,
			                        },
			                      },
			                      extension: {
			                        isAllowedFileSchemeAccess: { minArgs: 0, maxArgs: 0 },
			                        isAllowedIncognitoAccess: { minArgs: 0, maxArgs: 0 },
			                      },
			                      history: {
			                        addUrl: { minArgs: 1, maxArgs: 1 },
			                        deleteAll: { minArgs: 0, maxArgs: 0 },
			                        deleteRange: { minArgs: 1, maxArgs: 1 },
			                        deleteUrl: { minArgs: 1, maxArgs: 1 },
			                        getVisits: { minArgs: 1, maxArgs: 1 },
			                        search: { minArgs: 1, maxArgs: 1 },
			                      },
			                      i18n: {
			                        detectLanguage: { minArgs: 1, maxArgs: 1 },
			                        getAcceptLanguages: { minArgs: 0, maxArgs: 0 },
			                      },
			                      identity: {
			                        launchWebAuthFlow: { minArgs: 1, maxArgs: 1 },
			                      },
			                      idle: { queryState: { minArgs: 1, maxArgs: 1 } },
			                      management: {
			                        get: { minArgs: 1, maxArgs: 1 },
			                        getAll: { minArgs: 0, maxArgs: 0 },
			                        getSelf: { minArgs: 0, maxArgs: 0 },
			                        setEnabled: { minArgs: 2, maxArgs: 2 },
			                        uninstallSelf: { minArgs: 0, maxArgs: 1 },
			                      },
			                      notifications: {
			                        clear: { minArgs: 1, maxArgs: 1 },
			                        create: { minArgs: 1, maxArgs: 2 },
			                        getAll: { minArgs: 0, maxArgs: 0 },
			                        getPermissionLevel: { minArgs: 0, maxArgs: 0 },
			                        update: { minArgs: 2, maxArgs: 2 },
			                      },
			                      pageAction: {
			                        getPopup: { minArgs: 1, maxArgs: 1 },
			                        getTitle: { minArgs: 1, maxArgs: 1 },
			                        hide: {
			                          minArgs: 1,
			                          maxArgs: 1,
			                          fallbackToNoCallback: !0,
			                        },
			                        setIcon: { minArgs: 1, maxArgs: 1 },
			                        setPopup: {
			                          minArgs: 1,
			                          maxArgs: 1,
			                          fallbackToNoCallback: !0,
			                        },
			                        setTitle: {
			                          minArgs: 1,
			                          maxArgs: 1,
			                          fallbackToNoCallback: !0,
			                        },
			                        show: {
			                          minArgs: 1,
			                          maxArgs: 1,
			                          fallbackToNoCallback: !0,
			                        },
			                      },
			                      permissions: {
			                        contains: { minArgs: 1, maxArgs: 1 },
			                        getAll: { minArgs: 0, maxArgs: 0 },
			                        remove: { minArgs: 1, maxArgs: 1 },
			                        request: { minArgs: 1, maxArgs: 1 },
			                      },
			                      runtime: {
			                        getBackgroundPage: { minArgs: 0, maxArgs: 0 },
			                        getPlatformInfo: { minArgs: 0, maxArgs: 0 },
			                        openOptionsPage: { minArgs: 0, maxArgs: 0 },
			                        requestUpdateCheck: { minArgs: 0, maxArgs: 0 },
			                        sendMessage: { minArgs: 1, maxArgs: 3 },
			                        sendNativeMessage: { minArgs: 2, maxArgs: 2 },
			                        setUninstallURL: { minArgs: 1, maxArgs: 1 },
			                      },
			                      sessions: {
			                        getDevices: { minArgs: 0, maxArgs: 1 },
			                        getRecentlyClosed: { minArgs: 0, maxArgs: 1 },
			                        restore: { minArgs: 0, maxArgs: 1 },
			                      },
			                      storage: {
			                        local: {
			                          clear: { minArgs: 0, maxArgs: 0 },
			                          get: { minArgs: 0, maxArgs: 1 },
			                          getBytesInUse: { minArgs: 0, maxArgs: 1 },
			                          remove: { minArgs: 1, maxArgs: 1 },
			                          set: { minArgs: 1, maxArgs: 1 },
			                        },
			                        managed: {
			                          get: { minArgs: 0, maxArgs: 1 },
			                          getBytesInUse: { minArgs: 0, maxArgs: 1 },
			                        },
			                        sync: {
			                          clear: { minArgs: 0, maxArgs: 0 },
			                          get: { minArgs: 0, maxArgs: 1 },
			                          getBytesInUse: { minArgs: 0, maxArgs: 1 },
			                          remove: { minArgs: 1, maxArgs: 1 },
			                          set: { minArgs: 1, maxArgs: 1 },
			                        },
			                      },
			                      tabs: {
			                        captureVisibleTab: { minArgs: 0, maxArgs: 2 },
			                        create: { minArgs: 1, maxArgs: 1 },
			                        detectLanguage: { minArgs: 0, maxArgs: 1 },
			                        discard: { minArgs: 0, maxArgs: 1 },
			                        duplicate: { minArgs: 1, maxArgs: 1 },
			                        executeScript: { minArgs: 1, maxArgs: 2 },
			                        get: { minArgs: 1, maxArgs: 1 },
			                        getCurrent: { minArgs: 0, maxArgs: 0 },
			                        getZoom: { minArgs: 0, maxArgs: 1 },
			                        getZoomSettings: { minArgs: 0, maxArgs: 1 },
			                        goBack: { minArgs: 0, maxArgs: 1 },
			                        goForward: { minArgs: 0, maxArgs: 1 },
			                        highlight: { minArgs: 1, maxArgs: 1 },
			                        insertCSS: { minArgs: 1, maxArgs: 2 },
			                        move: { minArgs: 2, maxArgs: 2 },
			                        query: { minArgs: 1, maxArgs: 1 },
			                        reload: { minArgs: 0, maxArgs: 2 },
			                        remove: { minArgs: 1, maxArgs: 1 },
			                        removeCSS: { minArgs: 1, maxArgs: 2 },
			                        sendMessage: { minArgs: 2, maxArgs: 3 },
			                        setZoom: { minArgs: 1, maxArgs: 2 },
			                        setZoomSettings: { minArgs: 1, maxArgs: 2 },
			                        update: { minArgs: 1, maxArgs: 2 },
			                      },
			                      topSites: { get: { minArgs: 0, maxArgs: 0 } },
			                      webNavigation: {
			                        getAllFrames: { minArgs: 1, maxArgs: 1 },
			                        getFrame: { minArgs: 1, maxArgs: 1 },
			                      },
			                      webRequest: {
			                        handlerBehaviorChanged: { minArgs: 0, maxArgs: 0 },
			                      },
			                      windows: {
			                        create: { minArgs: 0, maxArgs: 1 },
			                        get: { minArgs: 1, maxArgs: 2 },
			                        getAll: { minArgs: 0, maxArgs: 1 },
			                        getCurrent: { minArgs: 0, maxArgs: 1 },
			                        getLastFocused: { minArgs: 0, maxArgs: 1 },
			                        remove: { minArgs: 1, maxArgs: 1 },
			                        update: { minArgs: 2, maxArgs: 2 },
			                      },
			                    };
			                    if (0 === Object.keys(s).length)
			                      throw new Error(
			                        "api-metadata.json has not been included in browser-polyfill",
			                      );
			                    class g extends WeakMap {
			                      constructor(e, r) {
			                        super(r), (this.createItem = e);
			                      }
			                      get(e) {
			                        return (
			                          this.has(e) || this.set(e, this.createItem(e)),
			                          super.get(e)
			                        );
			                      }
			                    }
			                    const a =
			                        (r, s) =>
			                        (...g) => {
			                          e.runtime.lastError
			                            ? r.reject(new Error(e.runtime.lastError.message))
			                            : s.singleCallbackArg ||
			                                (g.length <= 1 && !1 !== s.singleCallbackArg)
			                              ? r.resolve(g[0])
			                              : r.resolve(g);
			                        },
			                      m = (e) => (1 == e ? "argument" : "arguments"),
			                      n = (e, r, s) =>
			                        new Proxy(r, {
			                          apply: (r, g, a) => s.call(g, e, ...a),
			                        });
			                    let t = Function.call.bind(Object.prototype.hasOwnProperty);
			                    const A = (e, r = {}, s = {}) => {
			                        let g = Object.create(null),
			                          i = {
			                            has: (r, s) => s in e || s in g,
			                            get(i, o, l) {
			                              if (o in g) return g[o];
			                              if (!(o in e)) return;
			                              let x = e[o];
			                              if ("function" == typeof x)
			                                if ("function" == typeof r[o])
			                                  x = n(e, e[o], r[o]);
			                                else if (t(s, o)) {
			                                  let r = ((e, r) =>
			                                    function (s, ...g) {
			                                      if (g.length < r.minArgs)
			                                        throw new Error(
			                                          `Expected at least ${r.minArgs} ${m(r.minArgs)} for ${e}(), got ${g.length}`,
			                                        );
			                                      if (g.length > r.maxArgs)
			                                        throw new Error(
			                                          `Expected at most ${r.maxArgs} ${m(r.maxArgs)} for ${e}(), got ${g.length}`,
			                                        );
			                                      return new Promise((m, n) => {
			                                        if (r.fallbackToNoCallback)
			                                          try {
			                                            s[e](
			                                              ...g,
			                                              a({ resolve: m, reject: n }, r),
			                                            );
			                                          } catch (a) {
			                                            console.warn(
			                                              `${e} API method doesn't seem to support the callback parameter, falling back to call it without a callback: `,
			                                              a,
			                                            ),
			                                              s[e](...g),
			                                              (r.fallbackToNoCallback = !1),
			                                              (r.noCallback = !0),
			                                              m();
			                                          }
			                                        else
			                                          r.noCallback
			                                            ? (s[e](...g), m())
			                                            : s[e](
			                                                ...g,
			                                                a({ resolve: m, reject: n }, r),
			                                              );
			                                      });
			                                    })(o, s[o]);
			                                  x = n(e, e[o], r);
			                                } else x = x.bind(e);
			                              else if (
			                                "object" == typeof x &&
			                                null !== x &&
			                                (t(r, o) || t(s, o))
			                              )
			                                x = A(x, r[o], s[o]);
			                              else {
			                                if (!t(s, "*"))
			                                  return (
			                                    Object.defineProperty(g, o, {
			                                      configurable: !0,
			                                      enumerable: !0,
			                                      get: () => e[o],
			                                      set(r) {
			                                        e[o] = r;
			                                      },
			                                    }),
			                                    x
			                                  );
			                                x = A(x, r[o], s["*"]);
			                              }
			                              return (g[o] = x), x;
			                            },
			                            set: (r, s, a, m) => (
			                              s in g ? (g[s] = a) : (e[s] = a), !0
			                            ),
			                            defineProperty: (e, r, s) =>
			                              Reflect.defineProperty(g, r, s),
			                            deleteProperty: (e, r) =>
			                              Reflect.deleteProperty(g, r),
			                          },
			                          o = Object.create(e);
			                        return new Proxy(o, i);
			                      },
			                      i = (e) => ({
			                        addListener(r, s, ...g) {
			                          r.addListener(e.get(s), ...g);
			                        },
			                        hasListener: (r, s) => r.hasListener(e.get(s)),
			                        removeListener(r, s) {
			                          r.removeListener(e.get(s));
			                        },
			                      }),
			                      o = new g((e) =>
			                        "function" != typeof e
			                          ? e
			                          : function (r) {
			                              const s = A(
			                                r,
			                                {},
			                                { getContent: { minArgs: 0, maxArgs: 0 } },
			                              );
			                              e(s);
			                            },
			                      ),
			                      l = new g((e) =>
			                        "function" != typeof e
			                          ? e
			                          : function (r, s, g) {
			                              let a,
			                                m,
			                                n = !1,
			                                t = new Promise((e) => {
			                                  a = function (r) {
			                                    (n = !0), e(r);
			                                  };
			                                });
			                              try {
			                                m = e(r, s, a);
			                              } catch (e) {
			                                m = Promise.reject(e);
			                              }
			                              const A =
			                                !0 !== m &&
			                                (i = m) &&
			                                "object" == typeof i &&
			                                "function" == typeof i.then;
			                              var i;
			                              if (!0 !== m && !A && !n) return !1;
			                              const o = (e) => {
			                                e.then(
			                                  (e) => {
			                                    g(e);
			                                  },
			                                  (e) => {
			                                    let r;
			                                    (r =
			                                      e &&
			                                      (e instanceof Error ||
			                                        "string" == typeof e.message)
			                                        ? e.message
			                                        : "An unexpected error occurred"),
			                                      g({
			                                        __mozWebExtensionPolyfillReject__: !0,
			                                        message: r,
			                                      });
			                                  },
			                                ).catch((e) => {
			                                  console.error(
			                                    "Failed to send onMessage rejected reply",
			                                    e,
			                                  );
			                                });
			                              };
			                              return o(A ? m : t), !0;
			                            },
			                      ),
			                      x = ({ reject: s, resolve: g }, a) => {
			                        e.runtime.lastError
			                          ? e.runtime.lastError.message === r
			                            ? g()
			                            : s(new Error(e.runtime.lastError.message))
			                          : a && a.__mozWebExtensionPolyfillReject__
			                            ? s(new Error(a.message))
			                            : g(a);
			                      },
			                      c = (e, r, s, ...g) => {
			                        if (g.length < r.minArgs)
			                          throw new Error(
			                            `Expected at least ${r.minArgs} ${m(r.minArgs)} for ${e}(), got ${g.length}`,
			                          );
			                        if (g.length > r.maxArgs)
			                          throw new Error(
			                            `Expected at most ${r.maxArgs} ${m(r.maxArgs)} for ${e}(), got ${g.length}`,
			                          );
			                        return new Promise((e, r) => {
			                          const a = x.bind(null, { resolve: e, reject: r });
			                          g.push(a), s.sendMessage(...g);
			                        });
			                      },
			                      d = {
			                        devtools: { network: { onRequestFinished: i(o) } },
			                        runtime: {
			                          onMessage: i(l),
			                          onMessageExternal: i(l),
			                          sendMessage: c.bind(null, "sendMessage", {
			                            minArgs: 1,
			                            maxArgs: 3,
			                          }),
			                        },
			                        tabs: {
			                          sendMessage: c.bind(null, "sendMessage", {
			                            minArgs: 2,
			                            maxArgs: 3,
			                          }),
			                        },
			                      },
			                      u = {
			                        clear: { minArgs: 1, maxArgs: 1 },
			                        get: { minArgs: 1, maxArgs: 1 },
			                        set: { minArgs: 1, maxArgs: 1 },
			                      };
			                    return (
			                      (s.privacy = {
			                        network: { "*": u },
			                        services: { "*": u },
			                        websites: { "*": u },
			                      }),
			                      A(e, d, s)
			                    );
			                  };
			                e.exports = s(chrome);
			              } else e.exports = globalThis.browser;
			            },
			          );
			          // END: browser-polyfill.js
			
			          // START: mousetrap.js
			          !(function (e, t, n) {
			            if (e) {
			              for (
			                var r,
			                  o = {
			                    8: "backspace",
			                    9: "tab",
			                    13: "enter",
			                    16: "shift",
			                    17: "ctrl",
			                    18: "alt",
			                    20: "capslock",
			                    27: "esc",
			                    32: "space",
			                    33: "pageup",
			                    34: "pagedown",
			                    35: "end",
			                    36: "home",
			                    37: "left",
			                    38: "up",
			                    39: "right",
			                    40: "down",
			                    45: "ins",
			                    46: "del",
			                    91: "meta",
			                    93: "meta",
			                    224: "meta",
			                  },
			                  a = {
			                    106: "*",
			                    107: "+",
			                    109: "-",
			                    110: ".",
			                    111: "/",
			                    186: ";",
			                    187: "=",
			                    188: ",",
			                    189: "-",
			                    190: ".",
			                    191: "/",
			                    192: "`",
			                    219: "[",
			                    220: "\\",
			                    221: "]",
			                    222: "'",
			                  },
			                  i = {
			                    "~": "`",
			                    "!": "1",
			                    "@": "2",
			                    "#": "3",
			                    $: "4",
			                    "%": "5",
			                    "^": "6",
			                    "&": "7",
			                    "*": "8",
			                    "(": "9",
			                    ")": "0",
			                    _: "-",
			                    "+": "=",
			                    ":": ";",
			                    '"': "'",
			                    "<": ",",
			                    ">": ".",
			                    "?": "/",
			                    "|": "\\",
			                  },
			                  c = {
			                    option: "alt",
			                    command: "meta",
			                    return: "enter",
			                    escape: "esc",
			                    plus: "+",
			                    mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform)
			                      ? "meta"
			                      : "ctrl",
			                  },
			                  u = 1;
			                u < 20;
			                ++u
			              )
			                o[111 + u] = "f" + u;
			              for (u = 0; u <= 9; ++u) o[u + 96] = u.toString();
			              (y.prototype.bind = function (e, t, n) {
			                var r = this;
			                return (
			                  (e = e instanceof Array ? e : [e]),
			                  r._bindMultiple.call(r, e, t, n),
			                  r
			                );
			              }),
			                (y.prototype.unbind = function (e, t) {
			                  return this.bind.call(this, e, function () {}, t);
			                }),
			                (y.prototype.trigger = function (e, t) {
			                  var n = this;
			                  return (
			                    n._directMap[e + ":" + t] &&
			                      n._directMap[e + ":" + t]({}, e),
			                    n
			                  );
			                }),
			                (y.prototype.reset = function () {
			                  var e = this;
			                  return (e._callbacks = {}), (e._directMap = {}), e;
			                }),
			                (y.prototype.stopCallback = function (e, t) {
			                  if ((" " + t.className + " ").indexOf(" mousetrap ") > -1)
			                    return !1;
			                  if (d(t, this.target)) return !1;
			                  if (
			                    "composedPath" in e &&
			                    "function" == typeof e.composedPath
			                  ) {
			                    var n = e.composedPath()[0];
			                    n !== e.target && (t = n);
			                  }
			                  return (
			                    "INPUT" == t.tagName ||
			                    "SELECT" == t.tagName ||
			                    "TEXTAREA" == t.tagName ||
			                    t.isContentEditable
			                  );
			                }),
			                (y.prototype.handleKey = function () {
			                  var e = this;
			                  return e._handleKey.apply(e, arguments);
			                }),
			                (y.addKeycodes = function (e) {
			                  for (var t in e) e.hasOwnProperty(t) && (o[t] = e[t]);
			                  r = null;
			                }),
			                (y.init = function () {
			                  var e = y(t);
			                  for (var n in e)
			                    "_" !== n.charAt(0) &&
			                      (y[n] = (function (t) {
			                        return function () {
			                          return e[t].apply(e, arguments);
			                        };
			                      })(n));
			                }),
			                y.init(),
			                (e.Mousetrap = y),
			                "undefined" != typeof module &&
			                  module.exports &&
			                  (module.exports = y),
			                "function" == typeof define &&
			                  define.amd &&
			                  define(function () {
			                    return y;
			                  });
			            }
			            function l(e, t, n) {
			              e.addEventListener
			                ? e.addEventListener(t, n, !1)
			                : e.attachEvent("on" + t, n);
			            }
			            function s(e) {
			              if ("keypress" == e.type) {
			                var t = String.fromCharCode(e.which);
			                return e.shiftKey || (t = t.toLowerCase()), t;
			              }
			              return o[e.which]
			                ? o[e.which]
			                : a[e.which]
			                  ? a[e.which]
			                  : String.fromCharCode(e.which).toLowerCase();
			            }
			            function f(e) {
			              return "shift" == e || "ctrl" == e || "alt" == e || "meta" == e;
			            }
			            function p(e, t, n) {
			              return (
			                n ||
			                  (n = (function () {
			                    if (!r)
			                      for (var e in ((r = {}), o))
			                        (e > 95 && e < 112) ||
			                          (o.hasOwnProperty(e) && (r[o[e]] = e));
			                    return r;
			                  })()[e]
			                    ? "keydown"
			                    : "keypress"),
			                "keypress" == n && t.length && (n = "keydown"),
			                n
			              );
			            }
			            function h(e, t) {
			              var n,
			                r,
			                o,
			                a = [];
			              for (
			                n = (function (e) {
			                  return "+" === e
			                    ? ["+"]
			                    : (e = e.replace(/\+{2}/g, "+plus")).split("+");
			                })(e),
			                  o = 0;
			                o < n.length;
			                ++o
			              )
			                (r = n[o]),
			                  c[r] && (r = c[r]),
			                  t && "keypress" != t && i[r] && ((r = i[r]), a.push("shift")),
			                  f(r) && a.push(r);
			              return { key: r, modifiers: a, action: (t = p(r, a, t)) };
			            }
			            function d(e, n) {
			              return null !== e && e !== t && (e === n || d(e.parentNode, n));
			            }
			            function y(e) {
			              var n = this;
			              if (((e = e || t), !(n instanceof y))) return new y(e);
			              (n.target = e), (n._callbacks = {}), (n._directMap = {});
			              var r,
			                o = {},
			                a = !1,
			                i = !1,
			                c = !1;
			              function u(e) {
			                e = e || {};
			                var t,
			                  n = !1;
			                for (t in o) e[t] ? (n = !0) : (o[t] = 0);
			                n || (c = !1);
			              }
			              function p(e, t, r, a, i, c) {
			                var u,
			                  l,
			                  s,
			                  p,
			                  h = [],
			                  d = r.type;
			                if (!n._callbacks[e]) return [];
			                for (
			                  "keyup" == d && f(e) && (t = [e]), u = 0;
			                  u < n._callbacks[e].length;
			                  ++u
			                )
			                  if (
			                    ((l = n._callbacks[e][u]),
			                    (a || !l.seq || o[l.seq] == l.level) &&
			                      d == l.action &&
			                      (("keypress" == d && !r.metaKey && !r.ctrlKey) ||
			                        ((s = t),
			                        (p = l.modifiers),
			                        s.sort().join(",") === p.sort().join(","))))
			                  ) {
			                    var y = !a && l.combo == i,
			                      m = a && l.seq == a && l.level == c;
			                    (y || m) && n._callbacks[e].splice(u, 1), h.push(l);
			                  }
			                return h;
			              }
			              function d(e, t, r, o) {
			                n.stopCallback(t, t.target || t.srcElement, r, o) ||
			                  (!1 === e(t, r) &&
			                    ((function (e) {
			                      e.preventDefault
			                        ? e.preventDefault()
			                        : (e.returnValue = !1);
			                    })(t),
			                    (function (e) {
			                      e.stopPropagation
			                        ? e.stopPropagation()
			                        : (e.cancelBubble = !0);
			                    })(t)));
			              }
			              function m(e) {
			                "number" != typeof e.which && (e.which = e.keyCode);
			                var t = s(e);
			                t &&
			                  ("keyup" != e.type || a !== t
			                    ? n.handleKey(
			                        t,
			                        (function (e) {
			                          var t = [];
			                          return (
			                            e.shiftKey && t.push("shift"),
			                            e.altKey && t.push("alt"),
			                            e.ctrlKey && t.push("ctrl"),
			                            e.metaKey && t.push("meta"),
			                            t
			                          );
			                        })(e),
			                        e,
			                      )
			                    : (a = !1));
			              }
			              function k(e, t, n, i) {
			                function l(t) {
			                  return function () {
			                    (c = t), ++o[e], clearTimeout(r), (r = setTimeout(u, 1e3));
			                  };
			                }
			                function f(t) {
			                  d(n, t, e), "keyup" !== i && (a = s(t)), setTimeout(u, 10);
			                }
			                o[e] = 0;
			                for (var p = 0; p < t.length; ++p) {
			                  var y = p + 1 === t.length ? f : l(i || h(t[p + 1]).action);
			                  v(t[p], y, i, e, p);
			                }
			              }
			              function v(e, t, r, o, a) {
			                n._directMap[e + ":" + r] = t;
			                var i,
			                  c = (e = e.replace(/\s+/g, " ")).split(" ");
			                c.length > 1
			                  ? k(e, c, t, r)
			                  : ((i = h(e, r)),
			                    (n._callbacks[i.key] = n._callbacks[i.key] || []),
			                    p(i.key, i.modifiers, { type: i.action }, o, e, a),
			                    n._callbacks[i.key][o ? "unshift" : "push"]({
			                      callback: t,
			                      modifiers: i.modifiers,
			                      action: i.action,
			                      seq: o,
			                      level: a,
			                      combo: e,
			                    }));
			              }
			              (n._handleKey = function (e, t, n) {
			                var r,
			                  o = p(e, t, n),
			                  a = {},
			                  l = 0,
			                  s = !1;
			                for (r = 0; r < o.length; ++r)
			                  o[r].seq && (l = Math.max(l, o[r].level));
			                for (r = 0; r < o.length; ++r)
			                  if (o[r].seq) {
			                    if (o[r].level != l) continue;
			                    (s = !0),
			                      (a[o[r].seq] = 1),
			                      d(o[r].callback, n, o[r].combo, o[r].seq);
			                  } else s || d(o[r].callback, n, o[r].combo);
			                var h = "keypress" == n.type && i;
			                n.type != c || f(e) || h || u(a),
			                  (i = s && "keydown" == n.type);
			              }),
			                (n._bindMultiple = function (e, t, n) {
			                  for (var r = 0; r < e.length; ++r) v(e[r], t, n);
			                }),
			                l(e, "keypress", m),
			                l(e, "keydown", m),
			                l(e, "keyup", m);
			            }
			          })(
			            "undefined" != typeof window ? window : null,
			            "undefined" != typeof window ? document : null,
			          );
			          // END: mousetrap.js
			
			          // START: mousetrap-global-bind.js
			          !(function (t) {
			            if (t) {
			              var o = {},
			                i = t.prototype.stopCallback;
			              (t.prototype.stopCallback = function (t, n, e, a) {
			                return (
			                  !!this.paused || (!o[e] && !o[a] && i.call(this, t, n, e))
			                );
			              }),
			                (t.prototype.bindGlobal = function (t, i, n) {
			                  if ((this.bind(t, i, n), t instanceof Array))
			                    for (var e = 0; e < t.length; e++) o[t[e]] = !0;
			                  else o[t] = !0;
			                }),
			                t.init();
			            }
			          })("undefined" != typeof Mousetrap ? Mousetrap : void 0);
			          // END: mousetrap-global-bind.js
			
			          // START: options.js
			          const DEFAULT_CSS = `/* NOTE:
			 *
			 * - Using !important is needed for some styles because otherwise they get
			 *   overriden by the search engine stylesheets
			 * - Using outline works better than border sometimes because creating the
			 *   border can move other elements, for example the page numbers are moved in
			 *   Google Scholar when highlighting the prev/next buttons.
			 */
			
			:root {
			  --result-outline: 1px solid black;
			}
			
			@media (prefers-color-scheme: dark) {
			  :root {
			    --result-outline: 1px solid #aaaaaa;
			  }
			}
			
			html[dark], [dark] {
			  --result-outline: 1px solid #aaaaaa;
			}
			
			.wsn-google-focused-link {
			    position: relative;
			    /* This is required for the arrow to appear when navigating sub-results, see
			     * also: https://github.com/infokiller/web-search-navigator/issues/357 */
			    overflow: visible !important;
			}
			
			.wsn-google-focused-link::before,
			.wsn-google-focused-map::before,
			.wsn-gitlab-focused-link::before,
			.wsn-brave-search-focused-link::before,
			.wsn-startpage-focused-link::before {
			    content: "\u25BA";
			    margin-right: 25px;
			    left: -25px;
			    position: absolute;
			}
			
			.wsn-brave-search-focused-news {
			  position: relative;
			}
			
			.wsn-brave-search-focused-news::before {
			  content: "\u25BA";
			  top: 5px;
			  left: -45px;
			  position: absolute;
			}
			
			.wsn-google-focused-image {
			    outline: var(--result-outline) !important;
			    /* Images are less visible with a thin outline */
			    outline-width: 2px;
			}
			
			.wsn-google-focused-card,
			.wsn-brave-search-focused-card,
			.wsn-google-focused-job-card {
			    border: var(--result-outline) !important;
			}
			
			.wsn-google-focused-map,
			.wsn-google-card-item,
			.wsn-gitlab-focused-group-row {
			    outline: var(--result-outline) !important;
			}
			
			.wsn-google-focused-memex-result {
			    border: var(--result-outline) !important;
			    box-sizing: border-box;
			    -moz-box-sizing: border-box;
			    -webkit-box-sizing: border-box;
			}
			
			/* Startpage has dark themes where a black outline won't be visible */
			.wsn-startpage-focused-link {
			    outline: 1px solid #435a69 !important;
			    outline-offset: 3px;
			}
			
			.wsn-youtube-focused-video {
			    outline: var(--result-outline) !important;
			    outline-offset: 1px;
			}
			
			.wsn-youtube-focused-grid-video {
			    border: var(--result-outline) !important;
			}
			
			.wsn-google-scholar-next-page {
			    /* Using outline works better than border for the Scholar previous/next
			     * buttons because border moves the page numbers a bit. */
			    outline: var(--result-outline) !important;
			}
			
			.wsn-amazon-focused-item {
			    outline: var(--result-outline) !important;
			    outline-offset: 3px;
			}
			
			.wsn-amazon-focused-cart-item,
			.wsn-amazon-focused-carousel-item {
			    border: var(--result-outline) !important;
			}
			
			.wsn-github-focused-item,
			.wsn-github-focused-pagination {
			    outline: var(--result-outline) !important;
			    outline-offset: 2px;
			}
			
			/* This rule is only used when the "hide outline" option is enabled, and is used
			 * to disable the website's default search result outlining */
			.wsn-no-outline,
			.wsn-no-outline:focus {
			    outline: none;
			}`;
			
			          const DEFAULT_KEYBINDINGS = {
			            nextKey: ["down", "j"],
			            previousKey: ["up", "k"],
			            navigatePreviousResultPage: ["left", "h"],
			            navigateNextResultPage: ["right", "l"],
			            navigateKey: ["return", "space"],
			            navigateNewTabBackgroundKey: [
			              "ctrl+return",
			              "command+return",
			              "ctrl+space",
			            ],
			            navigateNewTabKey: [
			              "ctrl+shift+return",
			              "command+shift+return",
			              "ctrl+shift+space",
			            ],
			            navigateSearchTab: ["a", "s"],
			            navigateImagesTab: ["i"],
			            navigateVideosTab: ["v"],
			            navigateMapsTab: ["m"],
			            navigateNewsTab: ["n"],
			            navigateShoppingTab: ["alt+s"],
			            navigateBooksTab: ["b"],
			            navigateFlightsTab: ["alt+l"],
			            navigateFinancialTab: ["f"],
			            focusSearchInput: ["/", "escape"],
			            navigateShowAll: ["z z"],
			            navigateShowHour: ["z h"],
			            navigateShowDay: ["z d"],
			            navigateShowWeek: ["z w"],
			            navigateShowMonth: ["z m"],
			            navigateShowYear: ["z y"],
			            toggleSort: ["z s"],
			            toggleVerbatimSearch: ["z v"],
			            showImagesLarge: ["z l"],
			            showImagesMedium: ["z e"],
			            showImagesIcon: ["z i"],
			          };
			
			          const DEFAULT_OPTIONS = {
			            ...DEFAULT_KEYBINDINGS,
			            wrapNavigation: false,
			            autoSelectFirst: true,
			            hideOutline: false,
			            delay: 0,
			            googleIncludeCards: true,
			            googleIncludeMemex: false,
			            googleIncludePlaces: true,
			            customCSS: DEFAULT_CSS,
			            simulateMiddleClick: false,
			            customGitlabUrl: "^https://(www.)?\\.*git.*\\.",
			          };
			
			          const keybindingStringToArray = (kb) => {
			            // Alternative: kb.split(/, */);
			            return kb.split(",").map((t) => t.trim());
			          };
			
			          // eslint-disable-next-line no-unused-vars
			          const keybindingArrayToString = (kb) => {
			            return kb.join(", ");
			          };
			
			          /**
			           * @param {StorageArea} storage The storage area to which this section will
			           *  write.
			           * @param {Object} defaultValues The default options.
			           * @constructor
			           */
			          class BrowserStorage {
			            constructor(storage, defaultValues) {
			              this.storage = storage;
			              this.values = {};
			              this.defaultValues = defaultValues;
			            }
			            load() {
			              // this.storage.get(null) returns all the data stored:
			              // https://developer.chrome.com/extensions/storage#method-StorageArea-get
			              return this.storage.get(null).then((values) => {
			                this.values = values;
			                // Prior to versions 0.4.* the keybindings were stored as strings, so we
			                // migrate them to arrays if needed.
			                let migrated = false;
			                for (const [key, value] of Object.entries(this.values)) {
			                  if (!(key in DEFAULT_KEYBINDINGS) || Array.isArray(value)) {
			                    continue;
			                  }
			                  migrated = true;
			                  this.values[key] = keybindingStringToArray(value);
			                }
			                if (migrated) {
			                  return this.save();
			                }
			              });
			            }
			            save() {
			              return this.storage.set(this.values);
			            }
			            get(key) {
			              const value = this.values[key];
			              if (value != null) {
			                return value;
			              }
			              return this.defaultValues[key];
			            }
			            set(key, value) {
			              this.values[key] = value;
			            }
			            clear() {
			              return this.storage.clear().then(() => {
			                this.values = {};
			              });
			            }
			            getAll() {
			              // Merge options from storage with defaults.
			              return { ...this.defaultValues, ...this.values };
			            }
			          }
			
			          const createSyncedOptions = () => {
			            return new BrowserStorage(browser.storage.sync, DEFAULT_OPTIONS);
			          };
			
			          // eslint-disable-next-line no-unused-vars
			          class ExtensionOptions {
			            constructor() {
			              this.sync = createSyncedOptions();
			              this.local = new BrowserStorage(browser.storage.local, {
			                lastQueryUrl: null,
			                lastFocusedIndex: 0,
			              });
			            }
			
			            load() {
			              return Promise.all([this.local.load(), this.sync.load()]);
			            }
			          }
			          // END: options.js
			
			          // START: search_engines.js
			          /**
			           * This file contains search engine specific logic via search engine objects.
			           *
			           * A search engine object must provide the following:
			           *  - {regex} urlPattern
			           *  - {CSS selector} searchBoxSelector
			           *  - {SearchResult[]} getSearchResults()
			           *
			           * Optional functions/properties:
			           *  - {Array} tabs
			           *    Default: {}
			           *  - {int} getTopMargin: used if top results are not entirely visible
			           *    Default: 0
			           *  - {int} getBottomMargin: used if bottom results are not entirely visible.
			           *    Relevant for some search engines, since Firefox and Chrome show a tooltip
			           *    with the URL of focused links at the bottom and can hide some of the
			           *    search result at the bottom.
			           *    Default: getDefaultBottomMargin()
			           *  - {Function} onChangedResults: function for registering a callback on
			           *    changed search results. The callback gets a single boolean parameter that
			           *    is set to true if the only change is newly appended results.
			           *    Default: null (meaning there's no support for such events)
			           *  - {None} changeTools(period)
			           *
			           * Every SearchResult must provide the element and highlightClass properties and
			           * optionally the following:
			           *  - {Callback} anchorSelector: callback for getting the anchor
			           *    Default: the element itself
			           *  - {Callback} highlightedElementSelector: callback for getting the
			           *    highlighted element
			           *    Default: the element itself
			           *  - {Callback} containerSelector: callback for getting the container that
			           *    needs to be visible when an element is selected.
			           *    Default: the element itself
			           */
			
			          class SearchResult {
			            // We must declare the private class fields.
			            #element;
			            #anchorSelector;
			            #highlightedElementSelector;
			            #containerSelector;
			
			            /**
			             * @param {Element} element
			             * @param {function|null} anchorSelector
			             * @param {string} highlightClass
			             * @param {function|null} highlightedElementSelector
			             * @param {function|null} containerSelector
			             */
			            constructor(
			              element,
			              anchorSelector,
			              highlightClass,
			              highlightedElementSelector,
			              containerSelector,
			            ) {
			              this.#element = element;
			              this.#anchorSelector = anchorSelector;
			              this.highlightClass = highlightClass;
			              this.#highlightedElementSelector = highlightedElementSelector;
			              this.#containerSelector = containerSelector;
			            }
			            get anchor() {
			              if (!this.#anchorSelector) {
			                return this.#element;
			              }
			              return this.#anchorSelector(this.#element);
			            }
			            get container() {
			              if (!this.#containerSelector) {
			                return this.#element;
			              }
			              return this.#containerSelector(this.#element);
			            }
			            get highlightedElement() {
			              if (!this.#highlightedElementSelector) {
			                return this.#element;
			              }
			              return this.#highlightedElementSelector(this.#element);
			            }
			          }
			
			          // eslint-disable-next-line
			          /**
			           * @param {Array} includedSearchResults An array of
			           * tuples.  Each tuple contains collection of the search results optionally
			           * accompanied with their container selector.
			           * @constructor
			           */
			          const getSortedSearchResults = (
			            includedSearchResults,
			            excludedNodeList = [],
			          ) => {
			            const excludedResultsSet = new Set();
			            for (const node of excludedNodeList) {
			              excludedResultsSet.add(node);
			            }
			            const searchResults = [];
			            for (const results of includedSearchResults) {
			              for (const node of results.nodes) {
			                const searchResult = new SearchResult(
			                  node,
			                  results.anchorSelector,
			                  results.highlightClass,
			                  results.highlightedElementSelector,
			                  results.containerSelector,
			                );
			                const anchor = searchResult.anchor;
			                // Use offsetParent to exclude hidden elements, see:
			                // https://stackoverflow.com/a/21696585/1014208
			                if (
			                  anchor != null &&
			                  !excludedResultsSet.has(anchor) &&
			                  anchor.offsetParent !== null
			                ) {
			                  // Prevent adding the same node multiple times.
			                  excludedResultsSet.add(anchor);
			                  searchResults.push(searchResult);
			                }
			              }
			            }
			            // Sort searchResults by their document position.
			            searchResults.sort((a, b) => {
			              const position = a.anchor.compareDocumentPosition(b.anchor);
			              if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
			                return -1;
			              } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
			                return 1;
			              } else {
			                return 0;
			              }
			            });
			            return searchResults;
			          };
			
			          const getFixedSearchBoxTopMargin = (searchBoxContainer, element) => {
			            // When scrolling down, the search box can have a fixed position and can hide
			            // search results, so we try to compensate for it.
			            if (!searchBoxContainer || searchBoxContainer.contains(element)) {
			              return 0;
			            }
			            return searchBoxContainer.getBoundingClientRect().height;
			          };
			
			          // https://stackoverflow.com/a/7000222/2870889
			          // eslint-disable-next-line no-unused-vars
			          const isFirefox = () => {
			            return navigator.userAgent.toLowerCase().indexOf("firefox") >= 0;
			          };
			
			          // eslint-disable-next-line no-unused-vars
			          const getDefaultBottomMargin = (element) => {
			            return 28;
			          };
			
			          const selectorElementGetter = (selector) => {
			            return () => {
			              return document.querySelector(selector);
			            };
			          };
			
			          const nParent = (element, n) => {
			            while (n > 0 && element) {
			              element = element.parentElement;
			              n--;
			            }
			            return element;
			          };
			
			          const debounce = (callback, delayMs) => {
			            let timeoutId;
			            return (...args) => {
			              clearTimeout(timeoutId);
			              timeoutId = setTimeout(() => {
			                return callback(...args);
			              }, delayMs);
			            };
			          };
			
			          class GoogleSearch {
			            constructor(options) {
			              this.options = options;
			            }
			            get urlPattern() {
			              return /^https:\/\/(www\.)?google\./;
			            }
			            get searchBoxSelector() {
			              // Must match search engine search box
			              // NOTE: we used '#searchform input[name=q]' before 2020-06-05 but that
			              // doesn't work in the images search tab. Another option is to use
			              // 'input[role="combobox"]' but this doesn't work when there's also a
			              // dictionary search box.
			              // return '#searchform input[name=q]',
			              return "form[role=search] [name=q]";
			            }
			            getTopMargin(element) {
			              return getFixedSearchBoxTopMargin(
			                document.querySelector("#searchform.minidiv"),
			                element,
			              );
			            }
			            getBottomMargin(element) {
			              return isFirefox() ? 0 : getDefaultBottomMargin();
			            }
			            onChangedResults(callback) {
			              if (GoogleSearch.#isImagesTab()) {
			                return GoogleSearch.#onImageSearchResults(callback);
			              }
			              if (this.options.googleIncludeMemex) {
			                return GoogleSearch.#onMemexResults(callback);
			              }
			              // https://github.com/infokiller/web-search-navigator/issues/464
			              const container = document.querySelector("#rcnt");
			              if (!container) {
			                return;
			              }
			              const observer = new MutationObserver(
			                debounce((mutationsList, observer) => {
			                  callback(true);
			                }, 50),
			              );
			              observer.observe(container, {
			                attributes: false,
			                childList: true,
			                subtree: true,
			              });
			            }
			
			            static #isImagesTab() {
			              const searchParams = new URLSearchParams(window.location.search);
			              return searchParams.get("tbm") === "isch";
			            }
			
			            static #getImagesTabResults() {
			              const includedElements = [
			                // Image links
			                {
			                  nodes: document.querySelectorAll('.islrc a[data-nav="1"]'),
			                  highlightClass: "wsn-google-focused-image",
			                },
			                // Show more results button
			                {
			                  nodes: document.querySelectorAll('#islmp [type="button"]'),
			                  highlightClass: "wsn-google-focused-image",
			                },
			              ];
			              return getSortedSearchResults(includedElements, []);
			            }
			
			            static #regularResults() {
			              return [
			                {
			                  nodes: document.querySelectorAll(
			                    "#search .r > a:first-of-type",
			                  ),
			                  highlightClass: "wsn-google-focused-link",
			                  containerSelector: (n) => n.parentElement.parentElement,
			                },
			                {
			                  nodes: document.querySelectorAll(
			                    "#search .r g-link > a:first-of-type",
			                  ),
			                  highlightClass: "wsn-google-focused-link",
			                  containerSelector: (n) => n.parentElement.parentElement,
			                },
			                // More results button in continous loading
			                // https://imgur.com/a/X9zyJ24
			                {
			                  nodes: document.querySelectorAll(
			                    '#botstuff a[href^="/search"][href*="start="] h3',
			                  ),
			                  highlightClass: "wsn-google-focused-link",
			                  anchorSelector: (n) => n.closest("a"),
			                },
			                // Continuously loaded results are *sometimes* in the #botstuff container
			                // https://imgur.com/a/s6ow0La
			                {
			                  nodes: document.querySelectorAll("#botstuff a h3"),
			                  highlightClass: "wsn-google-focused-link",
			                  containerSelector: (n) => nParent(n, 5),
			                  highlightedElementSelector: (n) => nParent(n, 5),
			                  anchorSelector: (n) => n.closest("a"),
			                },
			                // Sometimes featured snippets are not contained in #search (possibly when
			                // there are large images?): https://imgur.com/a/VluRKIQ
			                {
			                  nodes: document.querySelectorAll(".xpdopen .g a"),
			                  highlightClass: "wsn-google-focused-link",
			                  highlightedElementSelector: (n) => n.querySelector("h3"),
			                },
			                // Large YouTube video as top result: https://imgur.com/a/JIe62QV
			                {
			                  nodes: document.querySelectorAll('h3 a[href*="youtube.com"]'),
			                  highlightClass: "wsn-google-focused-link",
			                  highlightedElementSelector: (n) => n.closest("h3"),
			                },
			                // Sub-results: https://imgur.com/a/CJePYJM
			                {
			                  nodes: document.querySelectorAll(
			                    "#search h3 a:first-of-type",
			                  ),
			                  highlightClass: "wsn-google-focused-link",
			                  highlightedElementSelector: (n) => n.closest("h3"),
			                  containerSelector: (n) => n.closest("tr"),
			                },
			                // Shopping results: https://imgur.com/a/wccM2iq
			                {
			                  nodes: document.querySelectorAll("#rso a h4"),
			                  anchorSelector: (n) => n.closest("a"),
			                  highlightClass: "wsn-google-focused-card",
			                  highlightedElementSelector: (n) =>
			                    n.closest(".sh-dgr__content"),
			                },
			                // News tab: https://imgur.com/a/MR9q31f
			                {
			                  nodes: document.querySelectorAll("#search g-card a"),
			                  highlightClass: "wsn-google-focused-link",
			                },
			                // Jobs heading for the jobs cards section. Clicking on it takes you
			                // to Google's job search.
			                // As of 2023-05-28, the Google's jobs search URLs seem to contain two
			                // query string params which seem relevant:
    // #endregion
  // #endregion
  // #endregion
                // #region htivrt jobs
	                // The first one matches the jobs heading, but also buttons in the
	                // jobs UI such as filtering by WFH/in-office. Therefore, we use the
	                // second one for specific jobs, but the first one to detect the jobs
	                // heading (otherwise it would be matched later in vaccines).
	                // eslint-disable-next-line max-len
	                // const jobsSelector = '#search a:is([href*="ibp=htl;jobs"], [href*="htivrt=jobs"])';
	                // NOTE: this must be added to the included elements before:
                // #endregion
                // #region books and featured snippets
	                // TODO: add screenshot
	                {
	                  nodes: document.querySelectorAll(
	                    // eslint-disable-next-line max-len
	                    '#search a:is([href*="ibp=htl;jobs"],[href*="htivrt=jobs"]) [role=heading][aria-level="2"]',
	                  ),
	                  anchorSelector: (n) => n.closest("a"),
	                  // highlightedElementSelector: (n) => n.closest('li'),
	                  highlightClass: "wsn-google-focused-job-card",
	                },
	                // Same as above, but for specific job results.
	                // TODO: add screenshot
	                // Jobs cards
	                {
	                  // nodes: document.querySelectorAll('#search a[href*="htivrt=jobs"]'),
	                  // eslint-disable-next-line max-len
	                  nodes: document.querySelectorAll(
	                    '#search li a[href*="htivrt=jobs"]',
	                  ),
	                  highlightedElementSelector: (n) => n.closest("li"),
	                  highlightClass: "wsn-google-focused-job-card",
	                },
	                // Books tab: https://imgur.com/a/QSBIOb6
	                // NOTE: This is required for matching "features snippets" in the general
	                // search tab, and also matches other results.
	                {
	                  nodes: document.querySelectorAll("#search [data-hveid] a h3"),
	                  anchorSelector: (n) => n.closest("a"),
	                  containerSelector: (n) => n.closest("[data-hveid]"),
	                  highlightedElementSelector: (n) => n.closest("[data-hveid]"),
	                  highlightClass: "wsn-google-focused-link",
	                },
	                // Next/previous results page
	                {
	                  nodes: document.querySelectorAll("#pnprev, #pnnext"),
	                  highlightClass: "wsn-google-card-item",
	                },
	              ];
	            }
	
	            static #cardResults() {
	              const nearestChildOrSiblingOrParentAnchor = (element) => {
	                const childAnchor = element.querySelector("a");
	                if (childAnchor && childAnchor.href) {
	                  return childAnchor;
	                }
	                const siblingAnchor = element.parentElement.querySelector("a");
	                if (siblingAnchor && siblingAnchor.href) {
	                  return siblingAnchor;
	                }
	                return element.closest("a");
	              };
	              const nearestCardContainer = (element) => {
	                return element.closest("g-inner-card");
	              };
	              return [
	                // Twitter: https://imgur.com/a/fdI75JG
	                {
	                  nodes: document.querySelectorAll(
	                    "#search [data-init-vis=true] [role=heading]",
	                  ),
	                  anchorSelector: nearestChildOrSiblingOrParentAnchor,
	                  highlightedElementSelector: nearestCardContainer,
	                  highlightClass: "wsn-google-focused-card",
	                },
	                // Vertical "Top stories" results
	                {
	                  nodes: document.querySelectorAll(
	                    "#search [role=text] [role=heading]",
	                  ),
	                  anchorSelector: nearestChildOrSiblingOrParentAnchor,
	                  highlightClass: "wsn-google-focused-link",
	                },
	                // Vertical video results: https://imgur.com/a/GyKhwrx
	                // Vertical video results: https://imgur.com/a/8fbPnvT
	                {
	                  nodes: document.querySelectorAll(
	                    "#search video-voyager a [role=heading]",
	                  ),
	                  anchorSelector: nearestChildOrSiblingOrParentAnchor,
	                  containerSelector: nearestChildOrSiblingOrParentAnchor,
	                  highlightedElementSelector:
	                    nearestChildOrSiblingOrParentAnchor,
	                  highlightClass: "wsn-google-focused-link",
	                },
	                // Horizontal video results: https://imgur.com/a/gRGJ7l9
	                // People also search for: https://imgur.com/a/QpCHKt0
	                {
	                  nodes: document.querySelectorAll(
	                    "#search g-scrolling-carousel g-inner-card a [role=heading]",
	                  ),
	                  anchorSelector: nearestChildOrSiblingOrParentAnchor,
	                  containerSelector: nearestCardContainer,
	                  highlightedElementSelector: nearestCardContainer,
	                  highlightClass: "wsn-google-card-item",
	                },
	                // Vaccines: https://imgur.com/a/325qJzE
	                {
	                  nodes: document.querySelectorAll(
	                    "#search a.a-no-hover-decoration [role=heading]",
	                  ),
	                  anchorSelector: nearestChildOrSiblingOrParentAnchor,
	                  containerSelector: nearestChildOrSiblingOrParentAnchor,
	                  highlightedElementSelector:
	                    nearestChildOrSiblingOrParentAnchor,
	                  highlightClass: "wsn-google-focused-link",
	                },
	                // Things to do in X: https://imgur.com/a/ibXwiuT
	                {
	                  nodes: document.querySelectorAll("td a [role=heading]"),
	                  anchorSelector: nearestChildOrSiblingOrParentAnchor,
	                  containerSelector: (n) => n.closest("td"),
	                  highlightedElementSelector: (n) => n.closest("td"),
	                  highlightClass: "wsn-google-card-item",
	                },
	                // Vertical Maps/Places: https://imgur.com/a/JXrxBCj
	                // Vertical recipes: https://imgur.com/a/3r7klHk
	                // Top stories grid: https://imgur.com/a/mY93YRF
	                // TODO: fix the small movements in recipes item selection.
	                {
	                  nodes: document.querySelectorAll("a [role=heading]"),
	                  anchorSelector: nearestChildOrSiblingOrParentAnchor,
	                  containerSelector: nearestChildOrSiblingOrParentAnchor,
	                  highlightedElementSelector:
	                    nearestChildOrSiblingOrParentAnchor,
	                  highlightClass: "wsn-google-card-item",
	                },
	              ];
	            }
	
	            static #placesResults() {
	              const nodes = document.querySelectorAll(".vk_c a");
	              // The first node is usually the map image which needs to be styled
	              // differently.
	              let map;
	              let links = nodes;
	              if (nodes[0] != null && nodes[0].querySelector("img")) {
	                map = nodes[0];
	                links = Array.from(nodes).slice(1);
	              }
	              const results = [];
	              if (map != null) {
	                results.push({
	                  nodes: [map],
	                  highlightedElementSelector: (n) => n.parentElement,
	                  highlightClass: "wsn-google-focused-map",
	                });
	              }
	              results.push({
	                nodes: links,
	                highlightClass: "wsn-google-focused-link",
	              });
	              return results;
	            }
	
	            static #memexResults() {
	              return [
	                {
	                  nodes: document.querySelectorAll(
	                    "#memexResults ._3d3zwUrsb4CVi1Li4H6CBw a",
	                  ),
	                  highlightClass: "wsn-google-focused-memex-result",
	                },
	              ];
	            }
	
	            getSearchResults() {
	              if (GoogleSearch.#isImagesTab()) {
	                return GoogleSearch.#getImagesTabResults();
	              }
	              const includedElements = GoogleSearch.#regularResults();
	              if (this.options.googleIncludeCards) {
	                includedElements.push(...GoogleSearch.#cardResults());
	              }
	              if (this.options.googleIncludePlaces) {
	                includedElements.push(...GoogleSearch.#placesResults());
	              }
	              if (this.options.googleIncludeMemex) {
	                includedElements.push(...GoogleSearch.#memexResults());
	              }
	              const excludedElements = document.querySelectorAll(
	                [
	                  // People also ask. Each one of the used selectors should be
	                  // sufficient, but we use both to be more robust to upstream DOM
	                  // changes.
	                  ".related-question-pair a",
	                  "#search .kp-blk:not(.c2xzTb) .r > a:first-of-type",
	                  // Right hand sidebar. We exclude it because it is after all the
	                  // results in the document order (as determined by
	                  // Node.DOCUMENT_POSITION_FOLLOWING used in getSortedSearchResults),
	                  // and it's confusing.
	                  "#rhs a",
	                ].join(", "),
	              );
	              return getSortedSearchResults(includedElements, excludedElements);
	            }
	
	            static #onImageSearchResults(callback) {
	              const container = document.querySelector(".islrc");
	              if (!container) {
	                return;
	              }
	              const observer = new MutationObserver(
	                debounce((mutationsList, observer) => {
	                  callback(true);
	                }, 50),
	              );
	              observer.observe(container, {
	                attributes: false,
	                childList: true,
	                subtree: false,
	              });
	            }
	
	            static #onMemexResults(callback) {
	              const container = document.querySelector("#rhs");
	              if (!container) {
	                return;
	              }
	              const observer = new MutationObserver(
	                debounce((mutationsList, observer) => {
	                  if (document.querySelector("#memexResults") != null) {
	                    callback(true);
	                  }
	                }, 50),
	              );
	              observer.observe(container, {
	                attributes: false,
	                childList: true,
	                subtree: true,
	              });
	            }
	
	            static #imageSearchTabs() {
	              const visibleTabs = document.querySelectorAll(".T47uwc > a");
	              // NOTE: The order of the tabs after the first two is dependent on the
	              // query. For example:
                // #endregion
              // #region california maps news videos
	              return {
	                navigateSearchTab: visibleTabs[0],
	                navigateMapsTab: selectorElementGetter(
	                  '.T47uwc > a[href*="maps.google."]',
	                ),
	                navigateVideosTab: selectorElementGetter(
	                  '.T47uwc > a[href*="&tbm=vid"]',
	                ),
	                navigateNewsTab: selectorElementGetter(
	                  '.T47uwc > a[href*="&tbm=nws"]',
	                ),
	                navigateShoppingTab: selectorElementGetter(
	                  'a[role="menuitem"][href*="&tbm=shop"]',
	                ),
	                navigateBooksTab: selectorElementGetter(
	                  'a[role="menuitem"][href*="&tbm=bks"]',
	                ),
	                navigateFlightsTab: selectorElementGetter(
	                  'a[role="menuitem"][href*="&tbm=flm"]',
	                ),
	                navigateFinancialTab: selectorElementGetter(
	                  'a[role="menuitem"][href*="/finance?"]',
	                ),
	                // TODO: Disable image search's default keybindings to avoid confusing the
	                // user, because the default keybindings can cause an indenepdent
	                // navigation of the image results with another outline. The code below
	                // doesn't work because the key event is captured by the image search
	                // code, since Moustrap is bound on document, instead of a more specific
	                // container. The following does work, but the code needs some changes to
	                // support binding on a specific container per search engine:
	                //
	                // Mousetrap(document.querySelector('.islrc')).bind ...
	                // Mousetrap(document.querySelector('#Sva75c')).bind ...
	                //
	                // navigatePreviousResultPage: null,
	                // navigateNextResultPage: null,
	              };
	            }
	
	            // Array storing tuples of tabs navigation keybindings and their corresponding
	            // CSS selector
	            get previousPageButton() {
	              if (GoogleSearch.#isImagesTab()) {
	                return null;
	              }
	              return selectorElementGetter("#pnprev");
	            }
	
	            get nextPageButton() {
	              if (GoogleSearch.#isImagesTab()) {
	                return null;
	              }
	              return selectorElementGetter("#pnnext");
	            }
	            get tabs() {
	              if (GoogleSearch.#isImagesTab()) {
	                return GoogleSearch.#imageSearchTabs();
	              }
	              return {
	                navigateSearchTab: selectorElementGetter(
	                  // eslint-disable-next-line max-len
	                  'a[href*="/search?q="]:not([href*="&tbm="]):not([href*="maps.google."])',
	                ),
	                navigateImagesTab: selectorElementGetter(
	                  'a[href*="&tbm=isch"]',
	                ),
	                navigateVideosTab: selectorElementGetter('a[href*="&tbm=vid"]'),
	                navigateMapsTab: selectorElementGetter(
	                  'a[href*="maps.google."]',
	                ),
	                navigateNewsTab: selectorElementGetter('a[href*="&tbm=nws"]'),
	                navigateShoppingTab: selectorElementGetter(
	                  'a[href*="&tbm=shop"]',
	                ),
	                navigateBooksTab: selectorElementGetter('a[href*="&tbm=bks"]'),
	                navigateFlightsTab: selectorElementGetter(
	                  'a[href*="&tbm=flm"]',
	                ),
	                navigateFinancialTab: selectorElementGetter(
	                  '[href*="/finance?"]',
	                ),
	              };
	            }
	
	            /**
	             *  Filter the results based on special properties
	             * @param {*} period, filter identifier. Accepted filter are :
	             *  'a' : all results
	             *  'h' : last hour
	             *  'd' : last day
	             *  'w' : last week
	             *  'm' : last month
	             *  'y' : last year
	             *  'v' : verbatim search
	             *  null : toggle sort
	             */
	            // TODO: Refactor this function to get enums after migrating to typescript.
	            changeTools(period) {
	              const searchParams = new URLSearchParams(window.location.search);
	              // Use the last value of the tbs param in case there are multiple ones,
	              // since the last one overrides the previous ones.
	              const allTbsValues = searchParams.getAll("tbs");
	              const lastTbsValue = allTbsValues[allTbsValues.length - 1] || "";
	              const match = /(qdr:.|li:1)(,sbd:.)?/.exec(lastTbsValue);
	              const currentPeriod = (match && match[1]) || "";
	              const currentSort = (match && match[2]) || "";
	              if (period === "a") {
	                searchParams.delete("tbs");
	              } else if (period) {
	                let newTbs = "";
	                if (period === "v") {
	                  if (currentPeriod === "li:1") {
	                    newTbs = "";
	                  } else {
	                    newTbs = "li:1";
	                  }
	                } else {
	                  newTbs = `qdr:${period}`;
	                }
	                searchParams.set("tbs", `${newTbs}${currentSort}`);
	                // Can't apply sort when not using period.
	              } else if (currentPeriod) {
	                searchParams.set(
	                  "tbs",
	                  `${currentPeriod}` + (currentSort ? "" : ",sbd:1"),
	                );
	              }
	              const newSearchString = "?" + searchParams.toString();
	              if (newSearchString !== window.location.search) {
	                window.location.search = newSearchString;
	              }
	              return false;
	            }
	
	            changeImageSize(size) {
	              const sizeOptions = {
	                LARGE: { value: 0, name: "Large", code: "l" },
	                MEDIUM: { value: 1, name: "Medium", code: "e" },
	                ICON: { value: 2, name: "Icon", code: "i" },
	              };
	              const openTool = document.querySelector(
	                '[class="PNyWAd ZXJQ7c"][jsname="I4bIT"]',
	              );
	              if (openTool != null) {
	                openTool.click();
	              }
	              const openSizeDropDown = document.querySelector(
	                '[aria-label="Size"]',
	              );
	              if (openSizeDropDown != null) {
	                openSizeDropDown.click();
	              }
	              const dropDownWithSize = document.querySelector(
	                '[class="xFo9P r9PaP Fmo8N"][jsname="wLFV5d"]',
	              );
	              const getButton = (selector) => {
	                let button;
	                if (document.querySelector(selector) != null) {
	                  button = document.querySelector(selector);
	                } else {
	                  button = null;
	                }
	                return button;
	              };
	              const setImageSize = (dropDownWithSize, buttonSelector) => {
	                let button = getButton(buttonSelector);
	                if (dropDownWithSize == null && button != null) {
	                  button.click();
	                } else if (dropDownWithSize != null && button == null) {
	                  dropDownWithSize.click();
	                  button = getButton(buttonSelector);
	                  button.click();
	                } else if (dropDownWithSize != null && button != null) {
	                  button.click();
	                }
	              };
	              switch (size) {
	                case sizeOptions.LARGE.code:
	                  if (
	                    dropDownWithSize == null ||
	                    dropDownWithSize.getAttribute("aria-label") !=
	                      sizeOptions.LARGE.name
	                  ) {
	                    setImageSize(
	                      dropDownWithSize,
	                      '[class="MfLWbb"][aria-label="Large"]',
	                    );
	                  }
	                  break;
	                case sizeOptions.MEDIUM.code:
	                  if (
	                    dropDownWithSize == null ||
	                    dropDownWithSize.getAttribute("aria-label") !=
	                      sizeOptions.MEDIUM.name
	                  ) {
	                    setImageSize(
	                      dropDownWithSize,
	                      '[class="MfLWbb"][aria-label="Medium"]',
	                    );
	                  }
	                  break;
	                case sizeOptions.ICON.code:
	                  if (
	                    dropDownWithSize == null ||
	                    dropDownWithSize.getAttribute("aria-label") !=
	                      sizeOptions.ICON.name
	                  ) {
	                    setImageSize(
	                      dropDownWithSize,
	                      '[class="MfLWbb"][aria-label="Icon"]',
	                    );
	                  }
	                  break;
	                default:
	                  break;
	              }
	            }
	          }
	
	          class BraveSearch {
	            constructor(options) {
	              this.options = options;
	            }
	
	            get urlPattern() {
	              return /^https:\/\/search\.brave\.com/;
	            }
	
	            get searchBoxSelector() {
	              return ".form-input, input[id=searchbox]";
	            }
	
	            getTopMargin(element) {
	              return getFixedSearchBoxTopMargin(
	                document.querySelector("header.navbar"),
	                element,
	              );
	            }
	
	            onChangedResults(callback) {
	              const containers = document.querySelectorAll("#results");
	              const observer = new MutationObserver(
	                debounce((mutationsList, observer) => {
	                  callback(true);
	                }, 50),
	              );
	              for (const container of containers) {
	                observer.observe(container, {
	                  attributes: false,
	                  childList: true,
	                  subtree: true,
	                });
	              }
	            }
	
	            static #getNewsTabResults() {
	              const includedElements = [
	                {
	                  nodes: document.querySelectorAll(".snippet a"),
	                  highlightClass: "wsn-brave-search-focused-news",
	                  containerSelector: (n) => n.parentElement,
	                },
	              ];
	              return getSortedSearchResults(includedElements);
	            }
	
	            static #getVideosTabResults() {
	              const includedElements = [
	                {
	                  nodes: document.querySelectorAll(".card a"),
	                  highlightClass: "wsn-brave-search-focused-card",
	                  highlightedElementSelector: (n) => n.closest(".card"),
	                  containerSelector: (n) => n.parentElement,
	                },
	              ];
	              return getSortedSearchResults(includedElements);
	            }
	
	            getSearchResults() {
	              if (BraveSearch.#isTabActive(this.tabs.navigateNewsTab)) {
	                return BraveSearch.#getNewsTabResults();
	              } else if (
	                BraveSearch.#isTabActive(this.tabs.navigateVideosTab)
	              ) {
	                return BraveSearch.#getVideosTabResults();
	              }
	
	              const includedElements = [
	                {
	                  nodes: document.querySelectorAll(".snippet.fdb > a"),
	                  highlightClass: "wsn-brave-search-focused-link",
	                  containerSelector: (n) => n.parentElement,
	                },
	                // News cards
	                {
	                  nodes: document.querySelectorAll(
	                    '.card[data-type="news"]:nth-child(-n+3)',
	                  ),
	                  highlightClass: "wsn-brave-search-focused-card",
	                },
	                // Video cards
	                {
	                  nodes: document.querySelectorAll(
	                    '.card[data-type="videos"]:nth-child(-n+3)',
	                  ),
	                  highlightClass: "wsn-brave-search-focused-card",
	                },
	              ];
	
	              return getSortedSearchResults(includedElements);
	            }
	
	            static #isTabActive(tab) {
	              return tab && tab.parentElement.classList.contains("active");
	            }
	
	            get tabs() {
	              return {
	                navigateSearchTab: document.querySelector(
	                  'a[href*="/search?q="]',
	                ),
	                navigateImagesTab: document.querySelector(
	                  "#tab-images > a:first-of-type",
	                ),
	                navigateNewsTab: document.querySelector('a[href*="/news?q="]'),
	                navigateVideosTab: document.querySelector(
	                  "#tab-videos > a:first-of-type",
	                ),
	              };
	            }
	          }
	
	          class StartPage {
	            constructor(options) {
	              this.options = options;
	            }
	            get urlPattern() {
	              return /^https:\/\/(www\.)?startpage\./;
	            }
	            get searchBoxSelector() {
	              return "#q";
	            }
	            getTopMargin(element) {
	              return getFixedSearchBoxTopMargin(
	                document.querySelector("div.layout-web__header"),
	                element,
	              );
	            }
	            getBottomMargin(element) {
	              // Startpage in Firefox has an issue where trying to scroll can result in
	              // window.scrollY being updated for a brief time although no scrolling is
	              // done, which confuses the scrollToElement function, which can lead to
	              // being stuck focused on a search result.
	              return isFirefox() ? 0 : getDefaultBottomMargin();
	            }
	
	            static #isSearchTab() {
	              return document.querySelector("div.layout-web") != null;
	            }
	            static #isImagesTab() {
	              return document.querySelector("div.layout-images") != null;
	            }
	
	            getSearchResults() {
	              // Don't initialize results navigation on image search, since it doesn't
	              // work there.
	              if (StartPage.#isImagesTab()) {
	                return [];
	              }
	              const containerSelector = (element) => {
	                if (StartPage.#isSearchTab()) {
	                  return element.closest(".w-gl__result");
	                }
	                return element;
	              };
	              const includedElements = [
	                {
	                  nodes: document.querySelectorAll("a.w-gl__result-url"),
	                  highlightedElementSelector: containerSelector,
	                  highlightClass: "wsn-startpage-focused-link",
	                  containerSelector: containerSelector,
	                },
	                {
	                  nodes: document.querySelectorAll(
	                    ".pagination--desktop button",
	                  ),
	                  highlightClass: "wsn-startpage-focused-link",
	                },
	                // As of 2020-06-20, this doesn't seem to match anything.
	                {
	                  nodes: document.querySelectorAll(
	                    ".vo-sp.vo-sp--default > a.vo-sp__link",
	                  ),
	                  highlightedElementSelector: containerSelector,
	                  highlightClass: "wsn-startpage-focused-link",
	                },
	              ];
	              const excludedElements =
	                document.querySelectorAll("button[disabled]");
	              return getSortedSearchResults(includedElements, excludedElements);
	            }
	
	            get previousPageButton() {
	              const menuLinks = document.querySelectorAll(
	                ".inline-nav-menu__link",
	              );
	              if (!menuLinks || menuLinks.length < 4) {
	                return null;
	              }
	
	              return document.querySelector(
	                "form.pagination__form.next-prev-form--desktop:first-of-type",
	              );
	            }
	
	            get nextPageButton() {
	              const menuLinks = document.querySelectorAll(
	                ".inline-nav-menu__link",
	              );
	              if (!menuLinks || menuLinks.length < 4) {
	                return null;
	              }
	
	              return document.querySelector(
	                "form.pagination__form.next-prev-form--desktop:last-of-type",
	              );
	            }
	
	            get tabs() {
	              const menuLinks = document.querySelectorAll(
	                ".inline-nav-menu__link",
	              );
	              if (!menuLinks || menuLinks.length < 4) {
	                return {};
	              }
	              return {
	                navigateSearchTab: menuLinks[0],
	                navigateImagesTab: menuLinks[1],
	                navigateVideosTab: menuLinks[2],
	                navigateNewsTab: menuLinks[3],
	              };
	            }
	
	            changeTools(period) {
	              const forms = document.forms;
	              let timeForm;
	
	              for (let i = 0; i < forms.length; i++) {
	                if (forms[i].className === "search-filter-time__form") {
	                  timeForm = forms[i];
	                }
	              }
	
	              switch (period) {
	                case "d":
	                  timeForm.elements["with_date"][1].click();
	                  break;
	                case "w":
	                  timeForm.elements["with_date"][2].click();
	                  break;
	                case "m":
	                  timeForm.elements["with_date"][3].click();
	                  break;
	                case "y":
	                  timeForm.elements["with_date"][4].click();
	                  break;
	                default:
	                  break;
	              }
	            }
	          }
	
	          class YouTube {
	            constructor(options) {
	              this.options = options;
	              this.gridNavigation = false;
	            }
	            get urlPattern() {
	              return /^https:\/\/(www)\.youtube\./;
	            }
	            get searchBoxSelector() {
	              return "input#search";
	            }
	            getTopMargin(element) {
	              return getFixedSearchBoxTopMargin(
	                document.querySelector("#masthead-container"),
	                element,
	              );
	            }
	
	            onChangedResults(callback) {
	              // The ytd-section-list-renderer element may not exist yet when this code
	              // runs, so we look for changes in the higher level elements until we find
	              // ytd-section-list-renderer.
	              const YT_CONTAINER_SELECTOR = [
	                "ytd-section-list-renderer",
	                ".ytd-section-list-renderer",
	                "ytd-rich-grid-renderer",
	                "ytd-shelf-renderer",
	              ].join(",");
	              const resultsObserver = new MutationObserver(
	                debounce((mutationsList, observer) => {
	                  callback(true);
	                }, 50),
	              );
	              let lastLoadedURL = null;
	              const pageObserverCallback = (mutationsList, observer) => {
	                const url = window.location.pathname + window.location.search;
	                if (url === lastLoadedURL) {
	                  return;
	                } else {
	                  resultsObserver.disconnect();
	                }
	                const containers = document.querySelectorAll(
	                  YT_CONTAINER_SELECTOR,
	                );
	                if (containers.length == 0) {
	                  return;
	                }
	                lastLoadedURL = url;
	                callback(false);
	                for (const container of containers) {
	                  resultsObserver.observe(container, {
	                    attributes: false,
	                    childList: true,
	                    subtree: true,
	                  });
	                }
	              };
	              // TODO: the observer callback is triggered many times because of the broad
	              // changes that the observer tracks. I tried to use other observation specs
	              // to limit it, but then it failed to detect URL changes without page load
	              // (which is what happened in issue #337 [1]).
	              // [1] https://github.com/infokiller/web-search-navigator/issues/337
	              const pageObserver = new MutationObserver(
	                debounce(pageObserverCallback, 50),
	              );
	              pageObserver.observe(document.querySelector("#page-manager"), {
	                attributes: false,
	                childList: true,
	                subtree: true,
	              });
	            }
	
	            getSearchResults() {
	              const includedElements = [
	                // Videos in vertical search results: https://imgur.com/a/Z8KV5Oe
	                {
	                  nodes: document.querySelectorAll(
	                    "a#video-title.ytd-video-renderer",
	                  ),
	                  highlightClass: "wsn-youtube-focused-video",
	                  highlightedElementSelector: (n) =>
	                    n.closest("ytd-video-renderer"),
	                  containerSelector: (n) => n.closest("ytd-video-renderer"),
	                },
	                // Playlist results in vertical search results: https://imgur.com/a/nPjGd9H
	                {
	                  nodes: document.querySelectorAll(
	                    'ytd-playlist-renderer a[href*="/playlist"]',
	                  ),
	                  highlightClass: "wsn-youtube-focused-video",
	                  highlightedElementSelector: (n) =>
	                    n.closest("ytd-playlist-renderer"),
	                  containerSelector: (n) => n.closest("ytd-playlist-renderer"),
	                },
	                // Playlists
	                {
	                  nodes: document.querySelectorAll(
	                    "a.ytd-playlist-video-renderer",
	                  ),
	                  highlightClass: "wsn-youtube-focused-video",
	                  highlightedElementSelector: (n) =>
	                    n.closest("ytd-playlist-video-renderer"),
	                  containerSelector: (n) =>
	                    n.closest("ytd-playlist-video-renderer"),
	                },
	                // Mixes
	                {
	                  nodes: document.querySelectorAll(
	                    "div#content a.ytd-radio-renderer",
	                  ),
	                  highlightClass: "wsn-youtube-focused-video",
	                },
	                // Channels
	                {
	                  nodes: document.querySelectorAll(
	                    'ytd-grid-video-renderer a#video-title:not([aria-hidden="true"])',
	                  ),
	                  highlightClass: "wsn-youtube-focused-grid-video",
	                  highlightedElementSelector: (n) =>
	                    n.closest("ytd-grid-video-renderer"),
	                  containerSelector: (n) =>
	                    n.closest("ytd-grid-video-renderer"),
	                },
	              ];
	              // checking if homepage results are present
	              const homePageElements = {
	                nodes: document.querySelectorAll(
	                  "ytd-rich-item-renderer a#video-title-link",
	                ),
	                highlightClass: "wsn-youtube-focused-video",
	                highlightedElementSelector: (n) =>
	                  n.closest("ytd-rich-item-renderer"),
	                containerSelector: (n) => n.closest("ytd-rich-item-renderer"),
	              };
	              const results = getSortedSearchResults(
	                [...includedElements, homePageElements],
	                [],
	              );
	              // When navigating away from the home page, the home page elements are still
	              // in the DOM but they are not visible, so we must check if they are
	              // visible (using offsetParent), not just if they are present.
	              const isHomePage = Array.from(homePageElements.nodes).some(
	                (n) => n.offsetParent != null,
	              );
	              const gridRow = document.querySelector("ytd-rich-grid-row");
	              if (isHomePage && gridRow != null) {
	                results.itemsPerRow = gridRow.getElementsByTagName(
	                  "ytd-rich-item-renderer",
	                ).length;
	                results.gridNavigation = results.itemsPerRow > 0;
	              }
	              return results;
	            }
	
	            changeTools(period) {
	              if (!document.querySelector("div#collapse-content")) {
	                const toggleButton = document.querySelectorAll(
	                  "a.ytd-toggle-button-renderer",
	                )[0];
	                // Toggling the buttons ensures that div#collapse-content is loaded
	                toggleButton.click();
	                toggleButton.click();
	              }
	              const forms = document.querySelectorAll(
	                "div#collapse-content > *:first-of-type ytd-search-filter-renderer",
	              );
	              let neededForm = null;
	              switch (period) {
	                case "h":
	                  neededForm = forms[0];
	                  break;
	                case "d":
	                  neededForm = forms[1];
	                  break;
	                case "w":
	                  neededForm = forms[2];
	                  break;
	                case "m":
	                  neededForm = forms[3];
	                  break;
	                case "y":
	                  neededForm = forms[4];
	                  break;
	              }
	              if (neededForm) {
	                neededForm.childNodes[1].click();
	              }
	            }
	          }
	
	          class GoogleScholar {
	            constructor(options) {
	              this.options = options;
	            }
	            get urlPattern() {
	              return /^https:\/\/scholar\.google\./;
	            }
	            get searchBoxSelector() {
	              return "#gs_hdr_tsi";
	            }
	
	            getSearchResults() {
	              const includedElements = [
	                {
	                  nodes: document.querySelectorAll(".gs_rt a"),
	                  highlightClass: "wsn-google-focused-link",
	                  highlightedElementSelector: (n) => n.closest(".gs_rt"),
	                  containerSelector: (n) => n.parentElement.parentElement,
	                },
	                {
	                  nodes: document.querySelectorAll(
	                    ".gs_ico_nav_previous, .gs_ico_nav_next",
	                  ),
	                  anchorSelector: (n) => n.parentElement,
	                  highlightClass: "wsn-google-scholar-next-page",
	                  highlightedElementSelector: (n) =>
	                    n.parentElement.children[1],
	                  containerSelector: (n) => n.parentElement.children[1],
	                },
	              ];
	              return getSortedSearchResults(includedElements, []);
	            }
	
	            get previousPageButton() {
	              const previousPageElement = document.querySelector(
	                ".gs_ico_nav_previous",
	              );
	              if (previousPageElement !== null) {
	                return previousPageElement.parentElement;
	              }
	
	              return null;
	            }
	
	            get nextPageButton() {
	              const nextPageElement =
	                document.querySelector(".gs_ico_nav_next");
	              if (nextPageElement !== null) {
	                return nextPageElement.parentElement;
	              }
	              return null;
	            }
	          }
	
	          class Amazon {
	            constructor(options) {
	              this.options = options;
	            }
	            get urlPattern() {
	              return /^https:\/\/(www\.)?amazon\./;
	            }
	            get searchBoxSelector() {
	              return "#twotabsearchtextbox";
	            }
	            onChangedResults(callback) {
	              const container = document.querySelector(".s-main-slot");
	              if (!container) {
	                return;
	              }
	              const observer = new MutationObserver(
	                debounce((mutationsList, observer) => {
	                  callback(false);
	                }, 50),
	              );
	              observer.observe(container, {
	                attributes: false,
	                childList: true,
	                subtree: false,
	              });
	            }
	
	            getSearchResults() {
	              const includedElements = [
	                // Carousel items
	                {
	                  nodes: document.querySelectorAll(
	                    ".s-main-slot .a-carousel-card h2 .a-link-normal.a-text-normal",
	                  ),
	                  highlightedElementSelector: (n) =>
	                    n.closest(".a-carousel-card"),
	                  highlightClass: "wsn-amazon-focused-carousel-item",
	                  containerSelector: (n) => n.closest(".a-carousel-card"),
	                },
	                // Regular items.
	                // NOTE: Must appear after the carousel items because this selector is
	                // more general.
	                {
	                  nodes: document.querySelectorAll(
	                    ".s-main-slot h2 .a-link-normal.a-text-normal",
	                  ),
	                  // highlightedElementSelector: (n) => n.parentElement.children[1],
	                  highlightedElementSelector: (n) =>
	                    n.closest(".a-section").parentElement.closest(".a-section"),
	                  highlightClass: "wsn-amazon-focused-item",
	                  containerSelector: (n) =>
	                    n.closest(".a-section").parentElement.closest(".a-section"),
	                },
	                // Next/previous and page numbers.
	                {
	                  nodes: document.querySelectorAll("a.s-pagination-item"),
	                  highlightClass: "wsn-amazon-focused-item",
	                },
	                // Shopping card items
	                {
	                  nodes: document.querySelectorAll(
	                    ".sc-list-item-content .a-list-item .a-link-normal",
	                  ),
	                  highlightClass: "wsn-amazon-focused-cart-item",
	                  highlightedElementSelector: (n) =>
	                    n.closest(".sc-list-item-content"),
	                  containerSelector: (n) => n.closest(".sc-list-item-content"),
	                },
	              ];
	              // Exclude active page number and hidden carousel elements.
	              // TODO: The hidden carousel elements do not match at page load because
	              // they don't yet have the aria-hidden property set.
	              const excludedElements = document.querySelectorAll(
	                '.a-pagination .a-selected a, .a-carousel-card[aria-hidden="true"] a',
	              );
	              return getSortedSearchResults(includedElements, excludedElements);
	            }
	
	            get previousPageButton() {
	              return document.querySelector("a.s-pagination-previous");
	            }
	
	            get nextPageButton() {
	              return document.querySelector("a.s-pagination-next");
	            }
	          }
	
	          class Github {
	            constructor(options) {
	              this.options = options;
	            }
	            get urlPattern() {
	              return /^https:\/\/(www\.)?github\.com/;
	            }
	            get searchBoxSelector() {
	              // TODO: With the escape key, this only works the first time the keybinding
	              // is used, Since Github seem to capture this as well, which causes it to
	              // leave the search box.
	              return 'input[name="q"]';
	            }
	
	            static #getCommitSearchLinks() {
	              const commitsContainers = document.querySelectorAll(
	                "#commit_search_results .text-normal",
	              );
	              const commits = [];
	              for (const con of commitsContainers) {
	                const links = con.querySelectorAll("a");
	                if (links.length === 0) {
	                  continue;
	                }
	                if (links.length === 1) {
	                  commits.push(links[0]);
	                } else {
	                  const prLink = con.querySelector(
	                    'a[data-hovercard-type="pull_request"]',
	                  );
	                  if (prLink != null) {
	                    commits.push(prLink);
	                  }
	                }
	              }
	              return commits;
	            }
	
	            getSearchResults() {
	              const includedElements = [
	                // Repos
	                {
	                  nodes: document.querySelectorAll(".repo-list a"),
	                  highlightClass: "wsn-github-focused-item",
	                  containerSelector: (n) => n.closest(".mt-n1"),
	                },
	                // Code
	                {
	                  nodes: document.querySelectorAll(
	                    "#code_search_results .text-normal a",
	                  ),
	                  highlightClass: "wsn-github-focused-item",
	                },
	                // Commits/PRs
	                {
	                  nodes: Github.#getCommitSearchLinks(),
	                  highlightClass: "wsn-github-focused-item",
	                },
	                // Issues
	                {
	                  nodes: document.querySelectorAll(
	                    "#issue_search_results .text-normal a",
	                  ),
	                  highlightClass: "wsn-github-focused-item",
	                },
	                // Marketplace
	                {
	                  nodes: document.querySelectorAll(
	                    "#marketplace_search_results .text-normal a",
	                  ),
	                  highlightClass: "wsn-github-focused-item",
	                },
	                // Topics
	                {
	                  nodes: document.querySelectorAll(
	                    "#topic_search_results .text-normal a",
	                  ),
	                  highlightClass: "wsn-github-focused-item",
	                },
	                // Wikis
	                {
	                  nodes: document.querySelectorAll(
	                    "#wiki_search_results .text-normal a",
	                  ),
	                  highlightClass: "wsn-github-focused-item",
	                },
	                // Users
	                {
	                  nodes: document.querySelectorAll(
	                    "#user_search_results .text-normal a",
	                  ),
	                  highlightClass: "wsn-github-focused-item",
	                },
	                // Pinned repos in user profile
	                {
	                  nodes: document.querySelectorAll(
	                    ".pinned-item-list-item-content span.repo",
	                  ),
	                  highlightClass: "wsn-github-focused-item",
	                  highlightedElementSelector: (n) => n.closest("a"),
	                  containerSelector: (n) => n.closest("a"),
	                  anchorSelector: (n) => n.closest("a"),
	                },
	                // Personal repos list in user profile
	                {
	                  nodes: document.querySelectorAll(
	                    '#user-repositories-list a[itemprop*="codeRepository"]',
	                  ),
	                  highlightClass: "wsn-github-focused-item",
	                  containerSelector: (n) => n.closest("li") || n,
	                },
	                // Next/previous and page numbers.
	                {
	                  nodes: document.querySelectorAll(".paginate-container a"),
	                  highlightClass: "wsn-github-focused-pagination",
	                },
	              ];
	              const searchParams = new URLSearchParams(window.location.search);
	              // Starred repos of user
	              if (searchParams.get("tab") === "stars") {
	                includedElements.push({
	                  nodes: document.querySelectorAll("h3 a"),
	                  highlightClass: "wsn-github-focused-item",
	                });
	              }
	              const excludedElements = [
	                // Exclude small links
	                ...document.querySelectorAll(".muted-link, .Link--muted"),
	                // Exclude topic tags
	                ...document.querySelectorAll(".topic-tag"),
	                // Exclude small links in commits
	                // ...document.querySelectorAll(
	                //     '#commit_search_results .text-normal a.message'),
	              ];
	              return getSortedSearchResults(includedElements, excludedElements);
	            }
	
	            onChangedResults(callback) {
	              const container = document.querySelector("body");
	              if (!container) {
	                return;
	              }
	              // Store the last URL to detect page navigations (for example going to the
	              // next page of results).
	              let lastURL = window.location.href;
	              const observer = new MutationObserver(
	                debounce((mutationsList, observer) => {
	                  let appendOnly = true;
	                  if (window.location.href !== lastURL) {
	                    lastURL = window.location.href;
	                    appendOnly = false;
	                  }
	                  callback(appendOnly);
	                }, 50),
	              );
	              observer.observe(container, {
	                attributes: false,
	                childList: true,
	                subtree: false,
	              });
	            }
	
	            // Github already has built-in support for tabs:
	            // https://docs.github.com/en/github/getting-started-with-github/keyboard-shortcuts
	            get tabs() {
	              return {};
	            }
	          }
	
	          class Gitlab {
	            constructor(options) {
	              this.options = options;
	            }
	
	            get urlPattern() {
	              return /^https:\/\/(www\.)?gitlab\.com/;
	            }
	
	            get searchBoxSelector() {
	              return ".form-input, input[id=search]";
	            }
	
	            getTopMargin(element) {
	              return getFixedSearchBoxTopMargin(
	                document.querySelector("header.navbar"),
	                element,
	              );
	            }
	
	            onChangedResults(callback) {
	              const containers = document.querySelectorAll(
	                ".projects-list, .groups-list, #content-body",
	              );
	              const observer = new MutationObserver(
	                async (mutationsList, observer) => {
	                  callback(true);
	                },
	              );
	              for (const container of containers) {
	                observer.observe(container, {
	                  attributes: false,
	                  childList: true,
	                  subtree: true,
	                });
	              }
	            }
	
	            getSearchResults() {
	              const includedElements = [
	                {
	                  nodes: document.querySelectorAll("li.project-row h2 a"),
	                  containerSelector: (n) => n.closest("li.project-row"),
	                  highlightedElementSelector: (n) =>
	                    n.closest("li.project-row"),
	                  highlightClass: "wsn-gitlab-focused-group-row",
	                },
	                // Org subgroups, for example:
	                // https://gitlab.archlinux.org/archlinux
	                {
	                  nodes: document.querySelectorAll(
	                    "ul.groups-list li.group-row a[aria-label]",
	                  ),
	                  containerSelector: (n) => n.closest("li.group-row"),
	                  highlightedElementSelector: (n) => n.closest("li.group-row"),
	                  highlightClass: "wsn-gitlab-focused-group-row",
	                },
	                // Prev/next page
	                {
	                  nodes: document.querySelectorAll("li.page-item a.page-link"),
	                  containerSelector: (n) => n.closest("li.page-item"),
	                  highlightedElementSelector: (n) => n.closest("li.group-row"),
	                  highlightClass: "wsn-gitlab-focused-group-row",
	                },
	              ];
	              return getSortedSearchResults(includedElements);
	            }
	          }
	
	          class CustomGitlab extends Gitlab {
	            get urlPattern() {
	              return new RegExp(this.options.customGitlabUrl);
	            }
	          }
	
	          // Get search engine object matching the current url
	          /* eslint-disable-next-line no-unused-vars */
	          const getSearchEngine = (options) => {
	            const searchEngines = [
	              new GoogleSearch(options),
	              new BraveSearch(options),
	              new StartPage(options),
	              new YouTube(options),
	              new GoogleScholar(options),
	              new Amazon(options),
	              new Github(options),
	              new Gitlab(options),
	              new CustomGitlab(options),
	            ];
	            // Switch over all compatible search engines
	            const href = window.location.href;
	            for (let i = 0; i < searchEngines.length; i++) {
	              if (href.match(searchEngines[i].urlPattern)) {
	                return searchEngines[i];
	              }
	            }
	            return null;
	          };
	          // END: search_engines.js
	
	          // START: main.js
	          /* global ExtensionOptions, getSearchEngine, Mousetrap */
	          /* global getDefaultBottomMargin */
	
	          // TODO: Replace with enums when switching to typescript.
	          const FOCUS_SCROLL_OFF = 0;
	          const FOCUS_SCROLL_ON = 1;
	          const FOCUS_SCROLL_ONLY = 2;
	
	          // Returns true if scrolling was done.
	          const scrollToElement = (searchEngine, element) => {
	            if (element == null) {
	              console.error("Cannot scroll to null element");
	              return;
	            }
	            let topMargin = 0;
	            if (searchEngine.getTopMargin) {
	              topMargin = searchEngine.getTopMargin(element);
	            }
	            let bottomMargin = getDefaultBottomMargin();
	            if (searchEngine.getBottomMargin) {
	              bottomMargin = searchEngine.getBottomMargin(element);
	            }
	            const elementBounds = element.getBoundingClientRect();
	            const scrollY = window.scrollY;
	            if (elementBounds.top < topMargin) {
	              // scroll element to top
	              element.scrollIntoView(true);
	              window.scrollBy(0, -topMargin);
	            } else if (
	              elementBounds.bottom + bottomMargin >
	              window.innerHeight
	            ) {
	              // scroll element to bottom
	              element.scrollIntoView(false);
	              window.scrollBy(0, bottomMargin);
	            }
	            return Math.abs(window.scrollY - scrollY) > 0.01;
	          };
	
	          const bindKeys = (bindings, toggle) => {
	            // NOTE: Mousetrap calls the handler even if there's a larger sequence that
	            // ends with the same key. For example, if the user binds both 'a b' and
	            // 'b', when pressing the sequence 'a b' both handlers will be called, which
	            // is not the desired behavior for this extension. Therefore, we first sort
	            // all keybindings by their sequence length, so that handlers of larger
	            // sequences will be called before the shorter ones. Then, we only call
	            // other handlers if the previous handler returned true.
	            bindings.sort((a, b) => {
	              return b[0].split(" ").length - a[0].split(" ").length;
	            });
	            let lastEvent;
	            let lastHandlerResult;
	            for (const [shortcut, element, global, callback] of bindings) {
	              const wrappedCallback = (event) => {
	                if (!toggle["active"]) {
	                  return true;
	                }
	                if (event === lastEvent && !lastHandlerResult) {
	                  return;
	                }
	                lastEvent = event;
	                lastHandlerResult = callback(event);
	                return lastHandlerResult;
	              };
	              if (global) {
	                /* eslint-disable-next-line new-cap */
	                Mousetrap(element).bindGlobal(shortcut, wrappedCallback);
	              } else {
	                /* eslint-disable-next-line new-cap */
	                Mousetrap(element).bind(shortcut, wrappedCallback);
	              }
	            }
	          };
	
	          class SearchResultsManager {
	            constructor(searchEngine, options) {
	              this.searchEngine = searchEngine;
	              this.options = options;
	              this.focusedIndex = -1;
	              this.isInitialFocusSet = false;
	            }
	
	            reloadSearchResults() {
	              this.searchResults = this.searchEngine.getSearchResults();
	              if (!this.isInitialFocusSet) {
	                this.setInitialFocus();
	              }
	            }
	
	            setInitialFocus() {
	              if (this.searchResults.length === 0) {
	                return;
	              }
	              const lastNavigation = this.options.local.values;
	              if (
	                location.href === lastNavigation.lastQueryUrl &&
	                lastNavigation.lastFocusedIndex >= 0 &&
	                lastNavigation.lastFocusedIndex < this.searchResults.length
	              ) {
	                this.focus(lastNavigation.lastFocusedIndex, FOCUS_SCROLL_ON);
	              } else if (this.options.sync.get("autoSelectFirst")) {
	                // Highlight the first result when the page is loaded, but don't scroll to
	                // it because there may be KP cards such as stock graphs.
	                this.focus(0, FOCUS_SCROLL_OFF);
	              }
	            }
	
	            /**
	             * Returns the element to click on upon navigation. The focused element in the
	             * document is preferred (if there is one) over the highlighted result. Note
	             * that the focused element does not have to be an anchor <a> element.
	             *
	             * @param {boolean} linkOnly If true the focused element is preferred only
	             * when it is a link with "href" attribute.
	             * @return {Element}
	             */
	            getElementToNavigate(linkOnly = false) {
	              const focusedElement = document.activeElement;
	              // StartPage seems to still focus and change it to body when the page loads.
	              if (
	                focusedElement == null ||
	                focusedElement.localName === "body"
	              ) {
	                if (
	                  this.focusedIndex < 0 ||
	                  this.focusedIndex >= this.searchResults.length
	                ) {
	                  return null;
	                }
	                return this.searchResults[this.focusedIndex].anchor;
	              }
	              const isLink =
	                focusedElement.localName === "a" &&
	                focusedElement.hasAttribute("href");
	              if (!linkOnly || isLink) {
	                return focusedElement;
	              }
	            }
	
	            highlight(searchResult) {
	              const highlighted = searchResult.highlightedElement;
	              if (highlighted == null) {
	                console.error("No element to highlight: %o", highlighted);
	                return;
	              }
	              highlighted.classList.add(searchResult.highlightClass);
	              if (
	                this.options.sync.get("hideOutline") ||
	                searchResult.anchor !== highlighted
	              ) {
	                searchResult.anchor.classList.add("wsn-no-outline");
	              }
	            }
	
	            unhighlight(searchResult) {
	              const highlighted = searchResult.highlightedElement;
	              if (highlighted == null) {
	                console.error("No element to unhighlight: %o", highlighted);
	                return;
	              }
	              highlighted.classList.remove(searchResult.highlightClass);
	              highlighted.classList.remove("wsn-no-outline");
	            }
	
	            focus(index, scroll = FOCUS_SCROLL_ONLY) {
	              if (this.focusedIndex >= 0) {
	                const searchResult = this.searchResults[this.focusedIndex];
	                // If the current result is outside the viewport and FOCUS_SCROLL_ONLY was
	                // requested, scroll to the current hidden result, but don't focus on the
	                // new result.
	                // This behavior is intended to handle cases where the user scrolls away
	                // from the currently focused result and then presses the keybindings to
	                // focus on the previous/next result. In this case, since the user
	                // doesn't see the current result, it's more intuitive to only scroll to
	                // the current result, and then on the next keypress they can focus on the
	                // previous/next result and actually see on what result they want to focus
	                // on.
	                if (
	                  scroll === FOCUS_SCROLL_ONLY &&
	                  scrollToElement(this.searchEngine, searchResult.container)
	                ) {
	                  return;
	                }
	                // Remove highlighting from previous item.
	                this.unhighlight(searchResult);
	              }
	              const searchResult = this.searchResults[index];
	              if (!searchResult) {
	                this.focusedIndex = -1;
	                return;
	              }
	              this.highlight(searchResult);
	              // We already scroll below, so no need for focus to scroll. The scrolling
	              // behavior of `focus` also seems less predictable and caused an issue, see:
	              // https://github.com/infokiller/web-search-navigator/issues/35
	              searchResult.anchor.focus({ preventScroll: true });
	              // Ensure whole search result container is visible in the viewport, not only
	              // the search result link.
	              if (scroll !== FOCUS_SCROLL_OFF) {
	                scrollToElement(this.searchEngine, searchResult.container);
	              }
	              this.focusedIndex = index;
	              this.isInitialFocusSet = true;
	            }
	
	            focusNext(shouldWrap) {
	              if (this.focusedIndex < this.searchResults.length - 1) {
	                this.focus(this.focusedIndex + 1);
	              } else if (shouldWrap) {
	                this.focus(0);
	              }
	            }
	
	            focusPrevious(shouldWrap) {
	              if (this.focusedIndex > 0) {
	                this.focus(this.focusedIndex - 1);
	              } else if (shouldWrap) {
	                this.focus(this.searchResults.length - 1);
	              } else {
	                window.scrollTo(window.scrollX, 0);
	              }
	            }
	
	            focusDown(shouldWrap) {
	              if (
	                this.focusedIndex + this.searchResults.itemsPerRow <
	                this.searchResults.length
	              ) {
	                this.focus(this.focusedIndex + this.searchResults.itemsPerRow);
	              } else if (shouldWrap) {
	                const focusedRowIndex =
	                  this.focusedIndex % this.searchResults.itemsPerRow;
	                this.focus(focusedRowIndex);
	              }
	            }
	
	            focusUp(shouldWrap) {
	              if (this.focusedIndex - this.searchResults.itemsPerRow >= 0) {
	                this.focus(this.focusedIndex - this.searchResults.itemsPerRow);
	              } else if (shouldWrap) {
	                const focusedRowIndex =
	                  this.focusedIndex % this.searchResults.itemsPerRow;
	                this.focus(
	                  this.searchResults -
	                    1 -
	                    this.searchResults.itemsPerRow +
	                    focusedRowIndex,
	                );
	              } else {
	                window.scrollTo(window.scrollY, 0);
	              }
	            }
	          }
	
	          class WebSearchNavigator {
	            constructor() {
	              this.bindings = [];
	              this.bindingsToggle = { active: true };
	            }
	
	            async init() {
	              this.options = new ExtensionOptions();
	              await this.options.load();
	              this.searchEngine = await getSearchEngine(
	                this.options.sync.getAll(),
	              );
	              if (this.searchEngine == null) {
	                return;
	              }
	              const sleep = (milliseconds) => {
	                return new Promise((resolve) =>
	                  setTimeout(resolve, milliseconds),
	                );
	              };
	              await sleep(this.options.sync.get("delay"));
	              this.injectCSS();
	              this.initKeybindings();
	            }
	
	            injectCSS() {
	              const style = document.createElement("style");
	              style.textContent = this.options.sync.get("customCSS");
	              document.head.append(style);
	            }
	
	            initKeybindings() {
	              this.bindingsToggle["active"] = false;
	              for (const [shortcut, element, ,] of this.bindings) {
	                /* eslint-disable-next-line new-cap */
	                const ms = Mousetrap(element);
	                ms.unbind(shortcut);
	                ms.reset();
	              }
	              const isFirstCall = this.bindings.length === 0;
	              this.bindings = [];
	              // UGLY WORKAROUND: Results navigation breaks YouTube space keybinding for
	              // pausing/resuming a video. A workaround is to click on an element on the
	              // page (except the video), but for now I'm disabling results navigation
	              // when watching a video.
	              // TODO: Find a proper fix.
	              if (
	                !window.location.href.match(
	                  /^https:\/\/(www)\.youtube\.com\/watch/,
	                )
	              ) {
	                this.initResultsNavigation(isFirstCall);
	              }
	              this.initTabsNavigation();
	              this.initChangeToolsNavigation();
	              this.initSearchInputNavigation();
	              this.bindingsToggle = { active: true };
	              bindKeys(this.bindings, this.bindingsToggle);
	            }
	
	            initSearchInputNavigation() {
	              let searchInput = document.querySelector(
	                this.searchEngine.searchBoxSelector,
	              );
	              if (searchInput == null) {
	                return;
	              }
	              // Only apply the extension logic if the key is not something the user may
	              // have wanted to type into the searchbox, so that we don't interfere with
	              // regular typing.
	              const shouldHandleSearchInputKey = (event) => {
	                return event.ctrlKey || event.metaKey || event.key === "Escape";
	              };
	              // In Github, the search input element changes while in the page, so we
	              // redetect it if it's not visible.
	              const detectSearchInput = () => {
	                if (searchInput != null && searchInput.offsetParent != null) {
	                  return true;
	                }
	                searchInput = document.querySelector(
	                  this.searchEngine.searchBoxSelector,
	                );
	                return searchInput != null && searchInput.offsetParent != null;
	              };
	              // If insideSearchboxHandler returns true, outsideSearchboxHandler will also
	              // be called (because it's defined on document, hence has lower priority),
	              // in which case we don't want to handle the event. Therefore, we store the
	              // last event handled in insideSearchboxHandler, and only handle the event
	              // in outsideSearchboxHandler if it's not the same one.
	              let lastEvent;
	              const outsideSearchboxHandler = (event) => {
	                if (!detectSearchInput()) {
	                  return;
	                }
	                if (event === lastEvent) {
	                  return !shouldHandleSearchInputKey(event);
	                }
	                const element = document.activeElement;
	                if (
	                  element.isContentEditable ||
	                  ["textarea", "input"].includes(element.tagName.toLowerCase())
	                ) {
	                  return true;
	                }
	                // Scroll to the search box in case it's outside the viewport so that it's
	                // clear to the user that it has focus.
	                scrollToElement(this.searchEngine, searchInput);
	                searchInput.select();
	                // searchInput.click();
	                return false;
	              };
	              const insideSearchboxHandler = (event) => {
	                if (!detectSearchInput()) {
	                  return;
	                }
	                lastEvent = event;
	                if (!shouldHandleSearchInputKey(event)) {
	                  return true;
	                }
	                // Everything is selected; deselect all.
	                if (
	                  searchInput.selectionStart === 0 &&
	                  searchInput.selectionEnd === searchInput.value.length
	                ) {
	                  // Scroll to the search box in case it's outside the viewport so that
	                  // it's clear to the user that it has focus.
	                  scrollToElement(this.searchEngine, searchInput);
	                  searchInput.setSelectionRange(
	                    searchInput.value.length,
	                    searchInput.value.length,
	                  );
	                  return false;
	                }
	                // Closing search suggestions via document.body.click() or
	                // searchInput.blur() breaks the state of google's controller.
	                // The suggestion box is closed, yet it won't re-appear on the next
	                // search box focus event.
	
	                // Input can be blurred only when the suggestion box is already
	                // closed, hence the blur event is queued.
	                window.setTimeout(() => searchInput.blur());
	                // Invoke the default handler which will close-up search suggestions
	                // properly (google's controller won't break), but it won't remove the
	                // focus.
	                return true;
	              };
	              this.register(
	                this.options.sync.get("focusSearchInput"),
	                outsideSearchboxHandler,
	              );
	              // Bind globally, otherwise Mousetrap ignores keypresses inside inputs.
	              // We must bind it separately to the search box element, or otherwise the
	              // key event won't always be captured (for example this is the case on
	              // Google Search as of 2020-06-22), presumably because the javascript in the
	              // page will disable further processing.
	              this.register(
	                this.options.sync.get("focusSearchInput"),
	                insideSearchboxHandler,
	                searchInput,
	                true,
	              );
	            }
	
	            registerObject(obj) {
	              for (const [optionName, elementOrGetter] of Object.entries(obj)) {
	                this.register(this.options.sync.get(optionName), () => {
	                  if (elementOrGetter == null) {
	                    return true;
	                  }
	                  let element;
	                  if (elementOrGetter instanceof HTMLElement) {
	                    element = elementOrGetter;
	                  } else {
	                    element = elementOrGetter();
	                  }
	                  if (element == null) {
	                    return true;
	                  }
	                  // Some search engines use forms instead of links for navigation
	                  if (element.tagName == "FORM") {
	                    element.submit();
	                  } else {
	                    element.click();
	                  }
	                  return false;
	                });
	              }
	            }
	
	            initTabsNavigation() {
	              const tabs = this.searchEngine.tabs || {};
	              this.registerObject(tabs);
	            }
	
	            initResultsNavigation(isFirstCall) {
	              this.registerObject({
	                navigatePreviousResultPage:
	                  this.searchEngine.previousPageButton,
	                navigateNextResultPage: this.searchEngine.nextPageButton,
	              });
	              this.resetResultsManager();
	              let gridNavigation =
	                this.resultsManager.searchResults.gridNavigation;
	              this.registerResultsNavigationKeybindings(gridNavigation);
	              // NOTE: we must not call onChangedResults multiple times, otherwise the
	              // URL change detection logic (which exists in YouTube) will break.
	              if (!isFirstCall || !this.searchEngine.onChangedResults) {
	                return;
	              }
	              this.searchEngine.onChangedResults((appendedOnly) => {
	                if (appendedOnly) {
	                  this.resultsManager.reloadSearchResults();
	                } else {
	                  this.resetResultsManager();
	                }
	                // In YouTube, the initial load does not always detect the grid navigation
	                // (because it can happen before results are actually loaded to the page).
	                // In this case, we must rebind the navigation keys after the results are
	                // loaded.
	                if (
	                  gridNavigation !=
	                  this.resultsManager.searchResults.gridNavigation
	                ) {
	                  gridNavigation =
	                    this.resultsManager.searchResults.gridNavigation;
	                  this.initKeybindings();
	                }
	              });
	            }
	
	            resetResultsManager() {
	              if (
	                this.resultsManager != null &&
	                this.resultsManager.focusedIndex >= 0
	              ) {
	                const searchResult =
	                  this.resultsManager.searchResults[
	                    this.resultsManager.focusedIndex
	                  ];
	                // NOTE: it seems that search results can become undefined when the DOM
	                // elements are removed (for example when the results change).
	                if (searchResult != null) {
	                  this.resultsManager.unhighlight(searchResult);
	                }
	              }
	              this.resultsManager = new SearchResultsManager(
	                this.searchEngine,
	                this.options,
	              );
	              this.resultsManager.reloadSearchResults();
	            }
	
	            registerResultsNavigationKeybindings(gridNavigation) {
	              const getOpt = (key) => {
	                return this.options.sync.get(key);
	              };
	              const onFocusChange = (callback) => {
	                return () => {
	                  if (!this.resultsManager.isInitialFocusSet) {
	                    this.resultsManager.focus(0);
	                  } else {
	                    const _callback = callback.bind(this.resultsManager);
	                    _callback(getOpt("wrapNavigation"));
	                  }
	                  return false;
	                };
	              };
	
	              if (!gridNavigation) {
	                this.register(
	                  getOpt("nextKey"),
	                  onFocusChange(this.resultsManager.focusNext),
	                );
	                this.register(
	                  getOpt("previousKey"),
	                  onFocusChange(this.resultsManager.focusPrevious),
	                );
	              } else {
	                this.register(
	                  getOpt("nextKey"),
	                  onFocusChange(this.resultsManager.focusDown),
	                );
	                this.register(
	                  getOpt("previousKey"),
	                  onFocusChange(this.resultsManager.focusUp),
	                );
	                // Left
	                this.register(
	                  getOpt("navigatePreviousResultPage"),
	                  onFocusChange(this.resultsManager.focusPrevious),
	                );
	                // Right
	                this.register(
	                  getOpt("navigateNextResultPage"),
	                  onFocusChange(this.resultsManager.focusNext),
	                );
	              }
	              this.register(getOpt("navigateKey"), () => {
	                const link = this.resultsManager.getElementToNavigate();
	                if (link == null) {
	                  return true;
	                }
	                const lastNavigation = this.options.local.values;
	                lastNavigation.lastQueryUrl = location.href;
	                lastNavigation.lastFocusedIndex =
	                  this.resultsManager.focusedIndex;
	                this.options.local.save();
	                // If the element is a link, use the href to directly navigate, since some
	                // websites will open it in a new tab.
	                if (link.localName === "a" && link.href) {
	                  window.location.href = link.href;
	                } else {
	                  link.click();
	                }
	                return false;
	              });
	              this.register(getOpt("navigateNewTabKey"), () => {
	                const link = this.resultsManager.getElementToNavigate(true);
	                if (link == null) {
	                  return true;
	                }
	                browser.runtime.sendMessage({
	                  type: "tabsCreate",
	                  options: {
	                    url: link.href,
	                    active: true,
	                  },
	                });
	                return false;
	              });
	              this.register(getOpt("navigateNewTabBackgroundKey"), () => {
	                const link = this.resultsManager.getElementToNavigate(true);
	                if (link == null) {
	                  return true;
	                }
	                if (getOpt("simulateMiddleClick")) {
	                  const mouseEventParams = {
	                    bubbles: true,
	                    cancelable: false,
	                    view: window,
	                    button: 1,
	                    which: 2,
	                    buttons: 0,
	                    clientX: link.getBoundingClientRect().x,
	                    clientY: link.getBoundingClientRect().y,
	                  };
	                  const middleClickMousedown = new MouseEvent(
	                    "mousedown",
	                    mouseEventParams,
	                  );
	                  link.dispatchEvent(middleClickMousedown);
	                  const middleClickMouseup = new MouseEvent(
	                    "mouseup",
	                    mouseEventParams,
	                  );
	                  link.dispatchEvent(middleClickMouseup);
	                }
	                browser.runtime.sendMessage({
	                  type: "tabsCreate",
	                  options: {
	                    url: link.href,
	                    active: false,
	                  },
	                });
	                return false;
	              });
	            }
	
	            initChangeToolsNavigation() {
	              if (this.searchEngine.changeTools == null) {
	                return;
	              }
	              const getOpt = (key) => {
	                return this.options.sync.get(key);
	              };
	              this.register(getOpt("navigateShowAll"), () =>
	                this.searchEngine.changeTools("a"),
	              );
	              this.register(getOpt("navigateShowHour"), () =>
	                this.searchEngine.changeTools("h"),
	              );
	              this.register(getOpt("navigateShowDay"), () =>
	                this.searchEngine.changeTools("d"),
	              );
	              this.register(getOpt("navigateShowWeek"), () =>
	                this.searchEngine.changeTools("w"),
	              );
	              this.register(getOpt("navigateShowMonth"), () =>
	                this.searchEngine.changeTools("m"),
	              );
	              this.register(getOpt("navigateShowYear"), () =>
	                this.searchEngine.changeTools("y"),
	              );
	              this.register(getOpt("toggleVerbatimSearch"), () =>
	                this.searchEngine.changeTools("v"),
	              );
	              this.register(getOpt("toggleSort"), () =>
	                this.searchEngine.changeTools(null),
	              );
	              this.register(getOpt("showImagesLarge"), () =>
	                this.searchEngine.changeImageSize("l"),
	              );
	              this.register(getOpt("showImagesMedium"), () =>
	                this.searchEngine.changeImageSize("e"),
	              );
	              this.register(getOpt("showImagesIcon"), () =>
	                this.searchEngine.changeImageSize("i"),
	              );
	            }
	
	            register(shortcuts, callback, element = document, global = false) {
	              for (const shortcut of shortcuts) {
	                this.bindings.push([shortcut, element, global, callback]);
	              }
	            }
	          }
	
	          const extension = new WebSearchNavigator();
	          extension.init();
	          // END: main.js
	        }
	      } catch (e) {
	        console.error(`  Error executing scripts ${scriptPaths}`, e);
	      }
	    } else {
	      console.log(`[${scriptName}] Skipping document-end phase (no document).`);
	    }
	
	    /*
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
		    if (typeof document !== "undefined") {
		      console.log(`[${scriptName}] Executing document-idle phase...`);
		
		      const scriptPaths = [];
		      console.log(`  Executing JS (idle): ${scriptPaths}`);
		
		      try {
		        // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
		        with (globalThis) {
		        }
		      } catch (e) {
		        console.error(`  Error executing scripts ${scriptPaths}`, e);
		      }
		    } else {
		      console.log(
		        `[${scriptName}] Skipping document-idle phase (no document).`,
		      );
		    }
		
		    console.log(
		      `[${scriptName}] All execution phases complete, re-firing load events.`,
		    );
		    document.dispatchEvent(
		      new Event("DOMContentLoaded", {
		        bubbles: true,
		        cancelable: true,
		      }),
		    );
		  }
		
		  function closeOptionsModal() {
		    const DURATION = 100;
		    const backdrop = document.getElementById("extension-options-backdrop");
		    const modal = document.getElementById("extension-options-modal");
		
		    if (!backdrop || !modal) return;
		
		    modal.style.animation = `modalCloseAnimation ${DURATION / 1000}s ease-out forwards`;
		    backdrop.style.animation = `backdropFadeOut ${DURATION / 1000}s ease-out forwards`;
		
		    setTimeout(() => {
		      if (confirm("Close options and reload the page?")) {
		        window.location.reload();
		      } else {
		        backdrop.remove();
		      }
		    }, DURATION);
		  }
		
		  function closePopupModal() {
		    const DURATION = 100;
		    const backdrop = document.getElementById("extension-popup-backdrop");
		    const modal = document.getElementById("extension-popup-modal");
		
		    if (!backdrop || !modal) return;
		
		    modal.style.animation = `modalCloseAnimation ${DURATION / 1000}s ease-out forwards`;
		    backdrop.style.animation = `backdropFadeOut ${DURATION / 1000}s ease-out forwards`;
		
		    setTimeout(() => {
		      backdrop.remove();
		    }, DURATION);
		  }
		
		  function openPopupPage() {
		    if (!POPUP_PAGE_PATH || typeof EXTENSION_ASSETS_MAP === "undefined") {
		      console.warn("No popup page available.");
		      return;
		    }
		    const html = EXTENSION_ASSETS_MAP[POPUP_PAGE_PATH];
		    if (!html) {
		      console.warn("Popup HTML not found in asset map");
		      return;
		    }
		
		    let backdrop = document.getElementById("extension-popup-backdrop");
		    let modal, iframe;
		
		    if (!backdrop) {
		      backdrop = document.createElement("div");
		      backdrop.id = "extension-popup-backdrop";
		
		      modal = document.createElement("div");
		      modal.id = "extension-popup-modal";
		
		      const extensionName = INJECTED_MANIFEST.name || "Extension Popup";
		      const iconSrc =
		        EXTENSION_ICON ||
		        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik00IDdoM2ExIDEgMCAwIDAgMSAtMXYtMWEyIDIgMCAwIDEgNCAwdjFhMSAxIDAgMCAwIDEgMWgzYTEgMSAwIDAgMSAxIDF2M2ExIDEgMCAwIDAgMSAxaDFhMiAyIDAgMCAxIDAgNGgtMWExIDEgMCAwIDAgLTEgMXYzYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtMWEyIDIgMCAwIDAgLTQgMHYxYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMWgxYTIgMiAwIDAgMCAwIC00aC0xYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMSIgLz48L3N2Zz4=";
		
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
		
		      backdrop.addEventListener("click", (e) => {
		        if (e.target === backdrop) {
		          closePopupModal();
		        }
		      });
		      modal
		        .querySelector(".tab.close-button")
		        .addEventListener("click", closePopupModal);
		      document.body.appendChild(backdrop);
		      iframe = modal.querySelector("iframe");
		    } else {
		      modal = backdrop.querySelector("#extension-popup-modal");
		      iframe = modal.querySelector("iframe");
		      if (!iframe) {
		        iframe = document.createElement("iframe");
		        modal.querySelector(".modal-content").appendChild(iframe);
		      }
		      backdrop.style.display = "flex";
		    }
		
		    try {
		      const polyfillString = generateCompletePolyfillForIframe();
		
		      const doc = new DOMParser().parseFromString(html, "text/html");
		      const script = doc.createElement("script");
		      script.textContent = polyfillString;
		      doc.head.insertAdjacentElement("afterbegin", script);
		      iframe.srcdoc = doc.documentElement.outerHTML;
		    } catch (e) {
		      console.error("Error generating complete polyfill for iframe", e);
		      iframe.srcdoc = html;
		    }
		  }
		
		  function openOptionsPage() {
		    if (!OPTIONS_PAGE_PATH || typeof EXTENSION_ASSETS_MAP === "undefined") {
		      console.warn("No options page available.");
		      return;
		    }
		    const html = EXTENSION_ASSETS_MAP[OPTIONS_PAGE_PATH];
		    if (!html) {
		      console.warn("Options HTML not found in asset map");
		      return;
		    }
		
		    let backdrop = document.getElementById("extension-options-backdrop");
		    let modal, iframe;
		
		    if (!backdrop) {
		      backdrop = document.createElement("div");
		      backdrop.id = "extension-options-backdrop";
		
		      modal = document.createElement("div");
		      modal.id = "extension-options-modal";
		
		      const extensionName = INJECTED_MANIFEST.name || "Extension Options";
		      const iconSrc =
		        EXTENSION_ICON ||
		        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik00IDdoM2ExIDEgMCAwIDAgMSAtMXYtMWEyIDIgMCAwIDEgNCAwdjFhMSAxIDAgMCAwIDEgMWgzYTEgMSAwIDAgMSAxIDF2M2ExIDEgMCAwIDAgMSAxaDFhMiAyIDAgMCAxIDAgNGgtMWExIDEgMCAwIDAgLTEgMXYzYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtMWEyIDIgMCAwIDAgLTQgMHYxYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMWgxYTIgMiAwIDAgMCAwIC00aC0xYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMSIgLz48L3N2Zz4=";
		
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
		
		      backdrop.addEventListener("click", (e) => {
		        if (e.target === backdrop) {
		          closeOptionsModal();
		        }
		      });
		      modal
		        .querySelector(".tab.close-button")
		        .addEventListener("click", closeOptionsModal);
		      document.body.appendChild(backdrop);
		      iframe = modal.querySelector("iframe");
		    } else {
		      modal = backdrop.querySelector("#extension-options-modal");
		      iframe = modal.querySelector("iframe");
		      if (!iframe) {
		        iframe = document.createElement("iframe");
		        modal.querySelector(".modal-content").appendChild(iframe);
		      }
		      backdrop.style.display = "flex";
		    }
		
		    try {
		      const polyfillString = generateCompletePolyfillForIframe();
		
		      const doc = new DOMParser().parseFromString(html, "text/html");
		      const script = doc.createElement("script");
		      script.textContent = polyfillString;
		      doc.head.insertAdjacentElement("afterbegin", script);
		      iframe.srcdoc = doc.documentElement.outerHTML;
		    } catch (e) {
		      console.error("Error generating complete polyfill for iframe", e);
		      iframe.srcdoc = html;
		    }
		  }
		
		  // Helper function to generate complete polyfill code for iframe injection
		  function generateCompletePolyfillForIframe() {
		    // The unified polyfill string is injected here during build
		    const polyfillString =
		      '\n// This contains all necessary code to create a complete polyfill environment\n\n// -- Messaging implementation\n\nfunction createEventBus(\n  scopeId,\n  type = "page", // "page" or "iframe"\n  { allowedOrigin = "*", children = [], parentWindow = null } = {}\n) {\n  if (!scopeId) throw new Error("createEventBus requires a scopeId");\n\n  const handlers = {};\n\n  function handleIncoming(ev) {\n    // origin check\n    if (allowedOrigin !== "*" && ev.origin !== allowedOrigin) return;\n\n    const msg = ev.data;\n    // must be our eventBus message, same scope\n    if (!msg || msg.__eventBus !== true || msg.scopeId !== scopeId) return;\n\n    const { event, payload } = msg;\n\n    // PAGE: if it\'s an INIT from an iframe, adopt it\n    if (type === "page" && event === "__INIT__") {\n      const win = ev.source;\n      if (win && !children.includes(win)) {\n        children.push(win);\n      }\n      return;\n    }\n\n    // dispatch to listeners\n    (handlers[event] || []).forEach((fn) =>\n      fn(payload, { origin: ev.origin, source: ev.source })\n    );\n  }\n\n  window.addEventListener("message", handleIncoming);\n\n  function emitTo(win, event, payload) {\n    const envelope = {\n      __eventBus: true,\n      scopeId,\n      event,\n      payload,\n    };\n    win.postMessage(envelope, allowedOrigin);\n  }\n\n  // IFRAME: announce to page on startup\n  if (type === "iframe") {\n    setTimeout(() => {\n      const pw = parentWindow || window.parent;\n      if (pw && pw.postMessage) {\n        emitTo(pw, "__INIT__", null);\n      }\n    }, 0);\n  }\n\n  return {\n    on(event, fn) {\n      handlers[event] = handlers[event] || [];\n      handlers[event].push(fn);\n    },\n    off(event, fn) {\n      if (!handlers[event]) return;\n      handlers[event] = handlers[event].filter((h) => h !== fn);\n    },\n    emit(event, payload) {\n      // dispatch locally first\n      (handlers[event] || []).forEach((fn) =>\n        fn(payload, { origin: location.origin, source: window })\n      );\n\n      // then propagate\n      if (type === "page") {\n        children.forEach((win) => emitTo(win, event, payload));\n      } else {\n        const pw = parentWindow || window.parent;\n        if (pw && pw.postMessage) {\n          emitTo(pw, event, payload);\n        }\n      }\n    },\n  };\n}\n\n// ===================================================================\n// 2) RUNTIME POLYFILL FACTORY WITH PORTS\n// ===================================================================\nfunction createRuntime(type = "background", bus) {\n  // message-based RPC\n  let nextId = 1;\n  const pending = {};\n  const msgListeners = [];\n\n  // port-based\n  let nextPortId = 1;\n  const ports = {}; // all open ports by id\n  const onConnectListeners = [];\n\n  function parseArgs(args) {\n    let target, message, options, callback;\n    const arr = [...args];\n    if (arr.length === 0) {\n      throw new Error("sendMessage requires at least one argument");\n    }\n    // last object could be options\n    if (\n      arr.length &&\n      typeof arr[arr.length - 1] === "object" &&\n      !Array.isArray(arr[arr.length - 1])\n    ) {\n      options = arr.pop();\n    }\n    // last function is callback\n    if (arr.length && typeof arr[arr.length - 1] === "function") {\n      callback = arr.pop();\n    }\n    if (\n      arr.length === 2 &&\n      (typeof arr[0] === "string" || typeof arr[0] === "number")\n    ) {\n      [target, message] = arr;\n    } else {\n      [message] = arr;\n    }\n    return { target, message, options, callback };\n  }\n\n  if (type === "background") {\n    bus.on("__REQUEST__", ({ id, message }, _) => {\n      let responded = false,\n        isAsync = false;\n      function sendResponse(resp) {\n        if (responded) return;\n        responded = true;\n        bus.emit("__RESPONSE__", { id, response: resp });\n      }\n      const results = msgListeners\n        .map((fn) => {\n          try {\n            const ret = fn(message, sendResponse);\n            if (ret === true || (ret && typeof ret.then === "function")) {\n              isAsync = true;\n              return ret;\n            }\n            return ret;\n          } catch (e) {\n            console.error(e);\n          }\n        })\n        .filter((r) => r !== undefined);\n\n      const promises = results.filter((r) => r && typeof r.then === "function");\n      if (!isAsync && promises.length === 0) {\n        const out = results.length === 1 ? results[0] : results;\n        sendResponse(out);\n      } else if (promises.length) {\n        Promise.all(promises).then((vals) => {\n          if (!responded) {\n            const out = vals.length === 1 ? vals[0] : vals;\n            sendResponse(out);\n          }\n        });\n      }\n    });\n  }\n\n  if (type !== "background") {\n    bus.on("__RESPONSE__", ({ id, response }) => {\n      const entry = pending[id];\n      if (!entry) return;\n      entry.resolve(response);\n      if (entry.callback) entry.callback(response);\n      delete pending[id];\n    });\n  }\n\n  function sendMessage(...args) {\n    if (type === "background") {\n      throw new Error("Background cannot sendMessage to itself");\n    }\n    const { target, message, callback } = parseArgs(args);\n    const id = nextId++;\n    const promise = new Promise((resolve) => {\n      pending[id] = { resolve, callback };\n      bus.emit("__REQUEST__", { id, message });\n    });\n    return promise;\n  }\n\n  // ============================\n  // PORT‐BASED CONNECT / DISCONNECT\n  // ============================\n  // When any side calls .connect(), emit a magic event\n  // that the background listens to.  The background then\n  // notifies its onConnect listeners with a Port object.\n  bus.on("__PORT_CONNECT__", ({ portId, name }, { source }) => {\n    // Only the background should handle incoming connect requests:\n    if (type !== "background") return; //\n    // Both share the same portId, but we keep separate\n    // handler queues and wire them via the bus.\n    const backgroundPort = makePort("background", portId, name, source);\n    ports[portId] = backgroundPort;\n\n    // notify background listeners\n    onConnectListeners.forEach((fn) => fn(backgroundPort));\n\n    // send back a CONNECT_ACK so the client can\n    // start listening on its end:\n    bus.emit("__PORT_CONNECT_ACK__", { portId, name }, { to: source });\n  });\n\n  // Clients handle the ACK and finalize their Port object:\n  bus.on("__PORT_CONNECT_ACK__", ({ portId, name }, { source }) => {\n    if (type === "background") return; // ignore\n    const p = ports[portId];\n    if (!p) return;\n    p._ready = true;\n    p._drainBuffer();\n  });\n\n  // Any port message travels via "__PORT_MESSAGE__"\n  bus.on("__PORT_MESSAGE__", ({ portId, msg }, { source }) => {\n    const p = ports[portId];\n    if (!p) return;\n    p._receive(msg);\n  });\n\n  // Any port disconnect:\n  bus.on("__PORT_DISCONNECT__", ({ portId }, { source }) => {\n    const p = ports[portId];\n    if (!p) return;\n    p._disconnect();\n    delete ports[portId];\n  });\n\n  function makePort(side, portId, name, remoteWindow) {\n    let onMessageHandlers = [];\n    let onDisconnectHandlers = [];\n    let buffer = [];\n    let _ready = side === "background";\n    // background ends are always ready\n    // client ends wait for CONNECT_ACK\n\n    function _drainBuffer() {\n      buffer.forEach((m) => _post(m));\n      buffer = [];\n    }\n\n    function _post(msg) {\n      // unidirectional: send from this side, receive on the other\n      bus.emit("__PORT_MESSAGE__", { portId, msg }, { to: remoteWindow });\n    }\n\n    function postMessage(msg) {\n      if (!_ready) {\n        buffer.push(msg);\n      } else {\n        _post(msg);\n      }\n    }\n\n    function _receive(msg) {\n      onMessageHandlers.forEach((fn) => fn(msg));\n    }\n\n    function disconnect() {\n      bus.emit("__PORT_DISCONNECT__", { portId }, { to: remoteWindow });\n      _disconnect();\n      delete ports[portId];\n    }\n\n    function _disconnect() {\n      onDisconnectHandlers.forEach((fn) => fn());\n      onMessageHandlers = [];\n      onDisconnectHandlers = [];\n    }\n\n    return {\n      name,\n      onMessage: {\n        addListener(fn) {\n          onMessageHandlers.push(fn);\n        },\n        removeListener(fn) {\n          onMessageHandlers = onMessageHandlers.filter((x) => x !== fn);\n        },\n      },\n      onDisconnect: {\n        addListener(fn) {\n          onDisconnectHandlers.push(fn);\n        },\n        removeListener(fn) {\n          onDisconnectHandlers = onDisconnectHandlers.filter((x) => x !== fn);\n        },\n      },\n      postMessage,\n      disconnect,\n      _ready, // internal\n      _drainBuffer, // internal\n    };\n  }\n\n  function connect(connectInfo = {}) {\n    if (type === "background") {\n      throw new Error("Background must use onConnect, not connect()");\n    }\n    const name = connectInfo.name || "";\n    const portId = nextPortId++;\n    // create the client side port\n    // remoteWindow is left undefined here; bus.emit will pick up via { to: page/iframe }\n    const clientPort = makePort("client", portId, name, null);\n    ports[portId] = clientPort;\n\n    // fire the connect event across the bus\n    bus.emit("__PORT_CONNECT__", { portId, name });\n    return clientPort;\n  }\n\n  function onConnect(fn) {\n    if (type !== "background") {\n      throw new Error("connect event only fires in background");\n    }\n    onConnectListeners.push(fn);\n  }\n\n  // Finally, wire up the returned runtime object:\n  return {\n    // rpc:\n    sendMessage,\n    onMessage: {\n      addListener(fn) {\n        msgListeners.push(fn);\n      },\n      removeListener(fn) {\n        const i = msgListeners.indexOf(fn);\n        if (i >= 0) msgListeners.splice(i, 1);\n      },\n    },\n\n    // port API:\n    connect,\n    onConnect: {\n      addListener(fn) {\n        onConnect(fn);\n      },\n      removeListener(fn) {\n        const i = onConnectListeners.indexOf(fn);\n        if (i >= 0) onConnectListeners.splice(i, 1);\n      },\n    },\n  };\n}\n\n\n// --- Abstraction Layer: PostMessage Target\n\nlet nextRequestId = 1;\nconst pendingRequests = new Map(); // requestId -> { resolve, reject, timeout }\n\n// Helper function to send postmessage requests to parent window\nfunction sendAbstractionRequest(method, args = []) {\n  return new Promise((resolve, reject) => {\n    const requestId = nextRequestId++;\n\n    // Set up timeout\n    const timeout = setTimeout(() => {\n      pendingRequests.delete(requestId);\n      reject(new Error(`PostMessage request timeout for method: ${method}`));\n    }, 10000); // 10 second timeout\n\n    // Store pending request\n    pendingRequests.set(requestId, { resolve, reject, timeout });\n\n    // Send request to parent window\n    window.parent.postMessage({\n      type: "abstraction-request",\n      requestId,\n      method,\n      args,\n    });\n  });\n}\n\n// Listen for responses from parent window\nwindow.addEventListener("message", (event) => {\n  // Only handle messages from same origin for security\n  // if (event.origin !== window.location.origin) {\n  //     return;\n  // }\n\n  const { type, requestId, success, result, error } = event.data;\n\n  if (type === "abstraction-response") {\n    const pending = pendingRequests.get(requestId);\n    if (pending) {\n      clearTimeout(pending.timeout);\n      pendingRequests.delete(requestId);\n\n      if (success) {\n        pending.resolve(result);\n      } else {\n        const err = new Error(error.message);\n        err.stack = error.stack;\n        pending.reject(err);\n      }\n    }\n  }\n});\n\nasync function _storageSet(items) {\n  return sendAbstractionRequest("_storageSet", [items]);\n}\n\nasync function _storageGet(keys) {\n  return sendAbstractionRequest("_storageGet", [keys]);\n}\n\nasync function _storageRemove(keysToRemove) {\n  return sendAbstractionRequest("_storageRemove", [keysToRemove]);\n}\n\nasync function _storageClear() {\n  return sendAbstractionRequest("_storageClear");\n}\n\nasync function _fetch(url, options) {\n  return sendAbstractionRequest("_fetch", [url, options]);\n}\n\nfunction _registerMenuCommand(name, func) {\n  // Menu commands from iframes don\'t make much sense, but we\'ll pass it through\n  console.warn("_registerMenuCommand called from iframe context:", name);\n  return sendAbstractionRequest("_registerMenuCommand", [\n    name,\n    func.toString(),\n  ]);\n}\n\nfunction _openTab(url) {\n  return sendAbstractionRequest("_openTab", [url]);\n}\n\nasync function _initStorage() {\n  return sendAbstractionRequest("_initStorage");\n}\n\n\n// --- Extension Assets Map & Helper Functions ---\nconst EXTENSION_ASSETS_MAP = {{EXTENSION_ASSETS_MAP}};\n\nfunction _testBlobCSP() {\n  try {\n    // Create a random blob with some simple JavaScript content\n    const code = `console.log("Blob CSP test");`;\n    const blob = new Blob([code], { type: \'application/javascript\' });\n    const blobUrl = URL.createObjectURL(blob);\n\n    // Create a script tag to load the blob URL\n    const script = document.createElement(\'script\');\n    script.src = blobUrl;\n\n    // Add an error handler in case the CSP blocks it\n    let blocked = false;\n    script.onerror = () => {\n      blocked = true;\n    };\n\n    // Append the script to the document\n    document.head.appendChild(script);\n\n    // Since CSP blocks are asynchronous, we need to return a promise\n    return new Promise((resolve) => {\n      // Wait briefly to see if the error handler fires\n      setTimeout(() => {\n        resolve(!blocked);\n        // Clean up\n        document.head.removeChild(script);\n        URL.revokeObjectURL(blobUrl);\n      }, 100);\n    });\n  } catch (e) {\n    // If creating or assigning the blob fails synchronously\n    return Promise.resolve(false);\n  }\n}\n\nlet CAN_USE_BLOB_CSP = false;\n\n_testBlobCSP().then((result) => {\n  CAN_USE_BLOB_CSP = result;\n});\n\nfunction _base64ToBlob(base64, mimeType = \'application/octet-stream\') {\n  const binary = atob(base64);\n  const len = binary.length;\n  const bytes = new Uint8Array(len);\n  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);\n  return new Blob([bytes], { type: mimeType });\n}\n\nfunction _getMimeTypeFromPath(p) {\n  const ext = (p.split(\'.\').pop() || \'\').toLowerCase();\n  const map = {\n    html: \'text/html\',\n    htm: \'text/html\',\n    js: \'text/javascript\',\n    css: \'text/css\',\n    json: \'application/json\',\n    png: \'image/png\',\n    jpg: \'image/jpeg\',\n    jpeg: \'image/jpeg\',\n    gif: \'image/gif\',\n    svg: \'image/svg+xml\',\n    webp: \'image/webp\',\n    ico: \'image/x-icon\',\n    woff: \'font/woff\',\n    woff2: \'font/woff2\',\n    ttf: \'font/ttf\',\n    otf: \'font/otf\',\n    eot: \'application/vnd.ms-fontobject\'\n  };\n  return map[ext] || \'application/octet-stream\';\n}\n\nfunction _isTextAsset(ext) {\n  return [\'html\',\'htm\',\'js\',\'css\',\'json\',\'svg\',\'txt\',\'xml\'].includes(ext);\n}\n\nfunction _createAssetUrl(path = \'\') {\n  if (path.startsWith(\'/\')) path = path.slice(1);\n  const assetData = EXTENSION_ASSETS_MAP[path];\n  if (typeof assetData === \'undefined\') {\n    console.warn(\'[runtime.getURL] Asset not found for\', path);\n    return path;\n  }\n\n  const mime = _getMimeTypeFromPath(path);\n  const ext = (path.split(\'.\').pop() || \'\').toLowerCase();\n\n  if (CAN_USE_BLOB_CSP) {\n    // For web accessible resources, handle different content types appropriately\n    let blob;\n    if (_isTextAsset(ext)) {\n      // For text assets (including processed CSS with inlined assets),\n      // the content is already processed and should be used as-is\n      blob = new Blob([assetData], { type: mime });\n    } else {\n      // For binary assets, the content is base64 encoded\n      blob = _base64ToBlob(assetData, mime);\n    }\n\n    return URL.createObjectURL(blob);\n  } else {\n    if (_isTextAsset(ext)) {\n      return `data:${mime};base64,${btoa(assetData)}`;\n    } else {\n      return `data:${mime};base64,${assetData}`;\n    }\n  }\n}\n\n// -- Polyfill Implementation\nfunction buildPolyfill({ isBackground = false, isOtherPage = false } = {}) {\n  // Generate a unique context ID for this polyfill instance\n  const contextType = isBackground\n    ? "background"\n    : isOtherPage\n    ? "options"\n    : "content";\n  const contextId = `${contextType}_${Math.random()\n    .toString(36)\n    .substring(2, 15)}`;\n\n  const IS_IFRAME = "true" === "true";\n  const BUS = createEventBus("web-search-navigator", IS_IFRAME ? "iframe" : "page");\n  const RUNTIME = createRuntime(isBackground ? "background" : "tab", BUS);\n\n  // TODO: Stub\n  const storageChangeListeners = new Set();\n  function broadcastStorageChange(changes, areaName) {\n    storageChangeListeners.forEach((listener) => {\n      listener(changes, areaName);\n    });\n  }\n\n  // --- Chrome polyfill\n  let chrome = {\n    extension: {\n      isAllowedIncognitoAccess: () => Promise.resolve(true),\n      sendMessage: (...args) => _messagingHandler.sendMessage(...args),\n    },\n    permissions: {\n      request: (permissions, callback) => {\n        callback(permissions);\n      },\n      contains: (permissions) => {\n        // TODO: Shim\n        return true;\n      },\n    },\n    i18n: {\n      getMessage: (key) => {\n        if (typeof LOCALE_KEYS !== "undefined" && LOCALE_KEYS[key]) {\n          return LOCALE_KEYS[key].message;\n        }\n        return key;\n      },\n    },\n    runtime: {\n      ...RUNTIME,\n      getManifest: () => {\n        // The manifest object will be injected into the scope where buildPolyfill is called\n        if (typeof INJECTED_MANIFEST !== "undefined") {\n          return JSON.parse(JSON.stringify(INJECTED_MANIFEST)); // Return deep copy\n        }\n        console.warn(\n          "INJECTED_MANIFEST not found for chrome.runtime.getManifest"\n        );\n        return { name: "Unknown", version: "0.0", manifest_version: 2 };\n      },\n      getURL: (path) => {\n        // Integrated implementation using the asset helper functions\n        if (!path) return "";\n        if (path.startsWith("/")) {\n          path = path.substring(1);\n        }\n\n        // Use the integrated asset creation function\n        if (typeof _createAssetUrl === "function") {\n          return _createAssetUrl(path);\n        }\n\n        console.warn(\n          `chrome.runtime.getURL fallback for \'${path}\'. Assets may not be available.`\n        );\n        // Attempt a relative path resolution (highly context-dependent and likely wrong)\n        try {\n          if (window.location.protocol.startsWith("http")) {\n            return new URL(path, window.location.href).toString();\n          }\n        } catch (e) {\n          /* ignore error, fallback */\n        }\n        return path;\n      },\n      connect: (extensionIdOrConnectInfo, connectInfo) => {\n        // Enhanced connect implementation using the unified message bus\n        const getName = () => {\n          if (typeof extensionIdOrConnectInfo === "string") {\n            return connectInfo && connectInfo.name ? connectInfo.name : "";\n          }\n          return extensionIdOrConnectInfo && extensionIdOrConnectInfo.name\n            ? extensionIdOrConnectInfo.name\n            : "";\n        };\n\n        return internalMessageBus.createPort(contextId, null, getName());\n      },\n      onConnect: {\n        addListener: function (callback) {\n          internalMessageBus.addConnectListener(contextId, callback);\n        },\n        removeListener: function (callback) {\n          internalMessageBus.removeConnectListener(contextId, callback);\n        },\n      },\n      id: "polyfilled-extension-" + Math.random().toString(36).substring(2, 15),\n      lastError: null,\n      getPlatformInfo: async () => {\n        // Basic platform detection\n        const platform = {\n          os: "unknown",\n          arch: "unknown",\n          nacl_arch: "unknown",\n        };\n\n        if (typeof navigator !== "undefined") {\n          const userAgent = navigator.userAgent.toLowerCase();\n          if (userAgent.includes("mac")) platform.os = "mac";\n          else if (userAgent.includes("win")) platform.os = "win";\n          else if (userAgent.includes("linux")) platform.os = "linux";\n          else if (userAgent.includes("android")) platform.os = "android";\n          else if (userAgent.includes("ios")) platform.os = "ios";\n\n          // Basic architecture detection\n          if (userAgent.includes("x86_64") || userAgent.includes("amd64")) {\n            platform.arch = "x86-64";\n          } else if (userAgent.includes("i386") || userAgent.includes("i686")) {\n            platform.arch = "x86-32";\n          } else if (userAgent.includes("arm")) {\n            platform.arch = "arm";\n          }\n        }\n\n        return platform;\n      },\n      getBrowserInfo: async () => {\n        // Basic browser detection\n        const info = {\n          name: "unknown",\n          version: "unknown",\n          buildID: "unknown",\n        };\n\n        if (typeof navigator !== "undefined") {\n          const userAgent = navigator.userAgent;\n          if (userAgent.includes("Chrome")) {\n            info.name = "Chrome";\n            const match = userAgent.match(/Chrome\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          } else if (userAgent.includes("Firefox")) {\n            info.name = "Firefox";\n            const match = userAgent.match(/Firefox\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          } else if (userAgent.includes("Safari")) {\n            info.name = "Safari";\n            const match = userAgent.match(/Version\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          }\n        }\n\n        return info;\n      },\n    },\n    storage: {\n      local: {\n        // Uses functions from the Abstraction Layer with unified messaging for change events\n        get: function (keys, callback) {\n          if (typeof _storageGet !== "function")\n            throw new Error("_storageGet not defined");\n\n          const promise = _storageGet(keys);\n\n          // Support callback-based syntax\n          if (typeof callback === "function") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error("Error in storage.get callback:", e);\n                }\n              })\n              .catch((error) => {\n                console.error("Storage.get error:", error);\n                callback({});\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        set: function (items, callback) {\n          if (typeof _storageSet !== "function")\n            throw new Error("_storageSet not defined");\n\n          const promise = _storageSet(items).then((result) => {\n            // Broadcast storage changes to all contexts\n            broadcastStorageChange(items, "local");\n            return result;\n          });\n\n          // Support callback-based syntax\n          if (typeof callback === "function") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error("Error in storage.set callback:", e);\n                }\n              })\n              .catch((error) => {\n                console.error("Storage.set error:", error);\n                callback();\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        remove: function (keys, callback) {\n          if (typeof _storageRemove !== "function")\n            throw new Error("_storageRemove not defined");\n\n          const promise = _storageRemove(keys).then((result) => {\n            // Create changes object for removed keys\n            const changes = {};\n            const keyList = Array.isArray(keys) ? keys : [keys];\n            keyList.forEach((key) => {\n              changes[key] = { oldValue: undefined, newValue: undefined };\n            });\n            broadcastStorageChange(changes, "local");\n            return result;\n          });\n\n          // Support callback-based syntax\n          if (typeof callback === "function") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error("Error in storage.remove callback:", e);\n                }\n              })\n              .catch((error) => {\n                console.error("Storage.remove error:", error);\n                callback();\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        clear: function (callback) {\n          if (typeof _storageClear !== "function")\n            throw new Error("_storageClear not defined");\n\n          const promise = _storageClear().then((result) => {\n            // Broadcast clear event\n            broadcastStorageChange({}, "local");\n            return result;\n          });\n\n          // Support callback-based syntax\n          if (typeof callback === "function") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error("Error in storage.clear callback:", e);\n                }\n              })\n              .catch((error) => {\n                console.error("Storage.clear error:", error);\n                callback();\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        onChanged: {\n          addListener: (callback) => {\n            storageChangeListeners.add(callback);\n          },\n          removeListener: (callback) => {\n            storageChangeListeners.delete(callback);\n          },\n        },\n      },\n      // Sync/Managed are simple aliases or stubs for Phase 1\n      sync: {\n        get: function (keys, callback) {\n          console.warn("chrome.storage.sync polyfill maps to local");\n          return chrome.storage.local.get(keys, callback);\n        },\n        set: function (items, callback) {\n          console.warn("chrome.storage.sync polyfill maps to local");\n\n          // Create a promise that handles sync-specific broadcasting\n          const promise = chrome.storage.local.set(items).then((result) => {\n            // Sync storage changes also broadcast with \'sync\' area name\n            broadcastStorageChange(items, "sync");\n            return result;\n          });\n\n          // Support callback-based syntax\n          if (typeof callback === "function") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error("Error in storage.sync.set callback:", e);\n                }\n              })\n              .catch((error) => {\n                console.error("Storage.sync.set error:", error);\n                callback();\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        remove: function (keys, callback) {\n          console.warn("chrome.storage.sync polyfill maps to local");\n\n          // Create a promise that handles sync-specific broadcasting\n          const promise = chrome.storage.local.remove(keys).then((result) => {\n            // Create changes object for removed keys\n            const changes = {};\n            const keyList = Array.isArray(keys) ? keys : [keys];\n            keyList.forEach((key) => {\n              changes[key] = { oldValue: undefined, newValue: undefined };\n            });\n            broadcastStorageChange(changes, "sync");\n            return result;\n          });\n\n          // Support callback-based syntax\n          if (typeof callback === "function") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error("Error in storage.sync.remove callback:", e);\n                }\n              })\n              .catch((error) => {\n                console.error("Storage.sync.remove error:", error);\n                callback();\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        clear: function (callback) {\n          console.warn("chrome.storage.sync polyfill maps to local");\n\n          // Create a promise that handles sync-specific broadcasting\n          const promise = chrome.storage.local.clear().then((result) => {\n            broadcastStorageChange({}, "sync");\n            return result;\n          });\n\n          // Support callback-based syntax\n          if (typeof callback === "function") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  console.error("Error in storage.sync.clear callback:", e);\n                }\n              })\n              .catch((error) => {\n                console.error("Storage.sync.clear error:", error);\n                callback();\n              });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n        onChanged: {\n          addListener: (callback) => {\n            storageChangeListeners.add(callback);\n          },\n          removeListener: (callback) => {\n            storageChangeListeners.delete(callback);\n          },\n        },\n      },\n      onChanged: {\n        addListener: (callback) => {\n          storageChangeListeners.add(callback);\n        },\n        removeListener: (callback) => {\n          storageChangeListeners.delete(callback);\n        },\n      },\n      managed: {\n        get: function (keys, callback) {\n          console.warn("chrome.storage.managed polyfill is read-only empty.");\n\n          const promise = Promise.resolve({});\n\n          // Support callback-based syntax\n          if (typeof callback === "function") {\n            promise.then((result) => {\n              try {\n                callback(result);\n              } catch (e) {\n                console.error("Error in storage.managed.get callback:", e);\n              }\n            });\n            return;\n          }\n\n          // Return promise for async/await usage\n          return promise;\n        },\n      },\n    },\n    tabs: {\n      query: async (queryInfo) => {\n        console.warn(\n          "chrome.tabs.query polyfill only returns current tab info."\n        );\n        const dummyId = Math.floor(Math.random() * 1000) + 1;\n        return [\n          {\n            id: dummyId,\n            url: window.location.href,\n            active: true,\n            windowId: 1,\n            status: "complete",\n          },\n        ];\n      },\n      create: async ({ url }) => {\n        console.log(`[Polyfill tabs.create] URL: ${url}`);\n        if (typeof _openTab !== "function")\n          throw new Error("_openTab not defined");\n        _openTab(url);\n        const dummyId = Math.floor(Math.random() * 1000) + 1001;\n        return Promise.resolve({\n          id: dummyId,\n          url: url,\n          active: true,\n          windowId: 1,\n        });\n      },\n      sendMessage: async (tabId, message) => {\n        console.warn(\n          `chrome.tabs.sendMessage polyfill (to tab ${tabId}) redirects to runtime.sendMessage (current context).`\n        );\n        return chrome.runtime.sendMessage(message);\n      },\n    },\n    notifications: {\n      create: async (notificationId, options) => {\n        try {\n          // Handle both create(options) and create(id, options) signatures\n          let id = notificationId;\n          let notificationOptions = options;\n\n          if (typeof notificationId === "object" && notificationId !== null) {\n            // Single parameter: create(options)\n            notificationOptions = notificationId;\n            id = "notification_" + Math.random().toString(36).substring(2, 15);\n          } else if (typeof notificationId === "string" && options) {\n            // Two parameters: create(id, options)\n            id = notificationId;\n            notificationOptions = options;\n          } else {\n            throw new Error("Invalid parameters for notifications.create");\n          }\n\n          if (!notificationOptions || typeof notificationOptions !== "object") {\n            throw new Error("Notification options must be an object");\n          }\n\n          const {\n            title,\n            message,\n            iconUrl,\n            type = "basic",\n          } = notificationOptions;\n\n          if (!title || !message) {\n            throw new Error("Notification must have title and message");\n          }\n\n          // Use native browser notifications if available\n          if ("Notification" in window) {\n            // Check permission\n            if (Notification.permission === "granted") {\n              const notification = new Notification(title, {\n                body: message,\n                icon: iconUrl,\n                tag: id,\n              });\n\n              console.log(`[Notifications] Created notification: ${id}`);\n              return id;\n            } else if (Notification.permission === "default") {\n              // Request permission\n              const permission = await Notification.requestPermission();\n              if (permission === "granted") {\n                const notification = new Notification(title, {\n                  body: message,\n                  icon: iconUrl,\n                  tag: id,\n                });\n                console.log(\n                  `[Notifications] Created notification after permission: ${id}`\n                );\n                return id;\n              } else {\n                console.warn(\n                  "[Notifications] Permission denied for notifications"\n                );\n                return id; // Return ID even if notification wasn\'t shown\n              }\n            } else {\n              console.warn("[Notifications] Notifications are blocked");\n              return id;\n            }\n          } else {\n            console.warn(\n              "[Notifications] Native notifications not supported, using console fallback"\n            );\n            console.log(`[Notification] ${title}: ${message}`);\n            return id;\n          }\n        } catch (error) {\n          console.error(\n            "[Notifications] Error creating notification:",\n            error.message\n          );\n          throw error;\n        }\n      },\n      clear: async (notificationId) => {\n        console.log(`[Notifications] Clear notification: ${notificationId}`);\n        // For native notifications, there\'s no direct way to clear by ID\n        // This is a limitation of the Web Notifications API\n        return true;\n      },\n      getAll: async () => {\n        console.warn("[Notifications] getAll not fully supported in polyfill");\n        return {};\n      },\n      getPermissionLevel: async () => {\n        if ("Notification" in window) {\n          const permission = Notification.permission;\n          return { level: permission === "granted" ? "granted" : "denied" };\n        }\n        return { level: "denied" };\n      },\n    },\n    contextMenus: {\n      create: (createProperties, callback) => {\n        try {\n          if (!createProperties || typeof createProperties !== "object") {\n            throw new Error("Context menu create properties must be an object");\n          }\n\n          const { id, title, contexts = ["page"], onclick } = createProperties;\n          const menuId =\n            id || `menu_${Math.random().toString(36).substring(2, 15)}`;\n\n          if (!title || typeof title !== "string") {\n            throw new Error("Context menu must have a title");\n          }\n\n          // Store menu items for potential use\n          if (!window._polyfillContextMenus) {\n            window._polyfillContextMenus = new Map();\n          }\n\n          window._polyfillContextMenus.set(menuId, {\n            id: menuId,\n            title,\n            contexts,\n            onclick,\n            enabled: createProperties.enabled !== false,\n          });\n\n          console.log(\n            `[ContextMenus] Created context menu item: ${title} (${menuId})`\n          );\n\n          // Try to register a menu command as fallback\n          if (typeof _registerMenuCommand === "function") {\n            try {\n              _registerMenuCommand(\n                title,\n                onclick ||\n                  (() => {\n                    console.log(`Context menu clicked: ${title}`);\n                  })\n              );\n            } catch (e) {\n              console.warn(\n                "[ContextMenus] Failed to register as menu command:",\n                e.message\n              );\n            }\n          }\n\n          if (callback && typeof callback === "function") {\n            setTimeout(() => callback(), 0);\n          }\n\n          return menuId;\n        } catch (error) {\n          console.error(\n            "[ContextMenus] Error creating context menu:",\n            error.message\n          );\n          if (callback && typeof callback === "function") {\n            setTimeout(() => callback(), 0);\n          }\n          throw error;\n        }\n      },\n      update: (id, updateProperties, callback) => {\n        try {\n          if (\n            !window._polyfillContextMenus ||\n            !window._polyfillContextMenus.has(id)\n          ) {\n            throw new Error(`Context menu item not found: ${id}`);\n          }\n\n          const menuItem = window._polyfillContextMenus.get(id);\n          Object.assign(menuItem, updateProperties);\n\n          console.log(`[ContextMenus] Updated context menu item: ${id}`);\n\n          if (callback && typeof callback === "function") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          console.error(\n            "[ContextMenus] Error updating context menu:",\n            error.message\n          );\n          if (callback && typeof callback === "function") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      remove: (menuItemId, callback) => {\n        try {\n          if (\n            window._polyfillContextMenus &&\n            window._polyfillContextMenus.has(menuItemId)\n          ) {\n            window._polyfillContextMenus.delete(menuItemId);\n            console.log(\n              `[ContextMenus] Removed context menu item: ${menuItemId}`\n            );\n          } else {\n            console.warn(\n              `[ContextMenus] Context menu item not found for removal: ${menuItemId}`\n            );\n          }\n\n          if (callback && typeof callback === "function") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          console.error(\n            "[ContextMenus] Error removing context menu:",\n            error.message\n          );\n          if (callback && typeof callback === "function") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      removeAll: (callback) => {\n        try {\n          if (window._polyfillContextMenus) {\n            const count = window._polyfillContextMenus.size;\n            window._polyfillContextMenus.clear();\n            console.log(\n              `[ContextMenus] Removed all ${count} context menu items`\n            );\n          }\n\n          if (callback && typeof callback === "function") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          console.error(\n            "[ContextMenus] Error removing all context menus:",\n            error.message\n          );\n          if (callback && typeof callback === "function") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      onClicked: {\n        addListener: (callback) => {\n          if (!window._polyfillContextMenuListeners) {\n            window._polyfillContextMenuListeners = new Set();\n          }\n          window._polyfillContextMenuListeners.add(callback);\n          console.log("[ContextMenus] Added click listener");\n        },\n        removeListener: (callback) => {\n          if (window._polyfillContextMenuListeners) {\n            window._polyfillContextMenuListeners.delete(callback);\n            console.log("[ContextMenus] Removed click listener");\n          }\n        },\n      },\n    },\n  };\n\n  const loggingProxyHandler = (_key) => ({\n    get(target, key, receiver) {\n      console.log(`[${contextType}] [CHROME - ${_key}] Getting ${key}`);\n      return Reflect.get(target, key, receiver);\n    },\n    set(target, key, value, receiver) {\n      console.log(\n        `[${contextType}] [CHROME - ${_key}] Setting ${key} to ${value}`\n      );\n      return Reflect.set(target, key, value, receiver);\n    },\n    has(target, key) {\n      console.log(\n        `[${contextType}] [CHROME - ${_key}] Checking if ${key} exists`\n      );\n      return Reflect.has(target, key);\n    },\n  });\n  chrome = Object.fromEntries(\n    Object.entries(chrome).map(([key, value]) => [\n      key,\n      new Proxy(value, loggingProxyHandler(key)),\n    ])\n  );\n\n  // Alias browser to chrome for common Firefox pattern\n  const browser = new Proxy(chrome, loggingProxyHandler);\n\n  const oldGlobalThis = globalThis;\n  const oldWindow = window;\n  const oldSelf = self;\n  const oldGlobal = globalThis;\n  const __globalsStorage = {};\n\n  const TO_MODIFY = [oldGlobalThis, oldWindow, oldSelf, oldGlobal];\n  const set = (k, v) => {\n    __globalsStorage[k] = v;\n    TO_MODIFY.forEach((target) => {\n      target[k] = v;\n    });\n  };\n  const proxyHandler = {\n    get(target, key, receiver) {\n      return __globalsStorage[key] || Reflect.get(target, key, receiver);\n    },\n    set(target, key, value, receiver) {\n      console.log(`[${contextType}] Setting ${key} to ${value}`);\n      set(key, value);\n      return Reflect.set(target, key, value, receiver);\n    },\n    has(target, key) {\n      return key in __globalsStorage || key in target;\n    },\n    getOwnPropertyDescriptor(target, key) {\n      if (key in __globalsStorage) {\n        return {\n          configurable: true,\n          enumerable: true,\n          writable: true,\n          value: __globalsStorage[key],\n        };\n      }\n      // fall back to the real globalThis\n      const desc = Reflect.getOwnPropertyDescriptor(target, key);\n      // ensure it\'s configurable so the with‑scope binding logic can override it\n      if (desc && !desc.configurable) {\n        desc.configurable = true;\n      }\n      return desc;\n    },\n\n    defineProperty(target, key, descriptor) {\n      // Normalize descriptor to avoid mixed accessor & data attributes\n      const hasAccessor = "get" in descriptor || "set" in descriptor;\n\n      if (hasAccessor) {\n        // Build a clean descriptor without value/writable when accessors present\n        const normalized = {\n          configurable:\n            "configurable" in descriptor ? descriptor.configurable : true,\n          enumerable:\n            "enumerable" in descriptor ? descriptor.enumerable : false,\n        };\n        if ("get" in descriptor) normalized.get = descriptor.get;\n        if ("set" in descriptor) normalized.set = descriptor.set;\n\n        // Store accessor references for inspection but avoid breaking invariants\n        set(key, {\n          get: descriptor.get,\n          set: descriptor.set,\n        });\n\n        return Reflect.defineProperty(target, key, normalized);\n      }\n\n      // Data descriptor path\n      set(key, descriptor.value);\n      return Reflect.defineProperty(target, key, descriptor);\n    },\n  };\n\n  // Create proxies once proxyHandler is defined\n  const proxyWindow = new Proxy(oldWindow, proxyHandler);\n  const proxyGlobalThis = new Proxy(oldGlobalThis, proxyHandler);\n  const proxyGlobal = new Proxy(oldGlobal, proxyHandler);\n  const proxySelf = new Proxy(oldSelf, proxyHandler);\n\n  // Seed storage with core globals so lookups succeed inside `with` blocks\n  Object.assign(__globalsStorage, {\n    chrome,\n    browser,\n    window: proxyWindow,\n    globalThis: proxyGlobalThis,\n    global: proxyGlobal,\n    self: proxySelf,\n  });\n\n  const __globals = {\n    chrome,\n    browser,\n    window: proxyWindow,\n    globalThis: proxyGlobalThis,\n    global: proxyGlobal,\n    self: proxySelf,\n    __globals: __globalsStorage,\n  };\n\n  // Store context info for debugging\n  __globalsStorage.contextId = contextId;\n  __globalsStorage.contextType = contextType;\n  __globalsStorage.module = undefined;\n  __globalsStorage.amd = undefined;\n  __globalsStorage.define = undefined;\n\n  return __globals;\n}\n\n\n// Export the buildPolyfill function for use\nif (typeof window !== \'undefined\') {\n    window.buildPolyfill = buildPolyfill;\n}\n';
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
		    if (typeof _initStorage === "function") {
		      try {
		        await _initStorage();
		        console.log(`[${SCRIPT_NAME}] Storage initialized.`);
		      } catch (e) {
		        console.error("Error during storage initialization:", e);
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
		
		    if (
		      CONTENT_SCRIPT_CONFIGS_FOR_MATCHING &&
		      CONTENT_SCRIPT_CONFIGS_FOR_MATCHING.length > 0
		    ) {
		      for (const config of CONTENT_SCRIPT_CONFIGS_FOR_MATCHING) {
		        if (
		          config.matches &&
		          config.matches.some((pattern) => {
		            try {
		              // Use the injected utility function
		              const regex = convertMatchPatternToRegExp(pattern);
		              if (regex.test(currentUrl)) {
		                // console.log(`[${SCRIPT_NAME}] URL matched pattern: ${pattern}`); // Verbose logging
		                return true; // Found a matching pattern
		              }
		              return false;
		            } catch (e) {
		              console.error(
		                `[${SCRIPT_NAME}] Error testing match pattern "${pattern}":`,
		                e,
		              );
		              return false;
		            }
		          })
		        ) {
		          shouldRunAnyScript = true;
		          console.log(`[${SCRIPT_NAME}] URL match found via config:`, config);
		          break; // Found a matching config, no need to check further configs
		        }
		      }
		    } else {
		      console.log(
		        `[${SCRIPT_NAME}] No content script configurations found in manifest data.`,
		      );
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
		
		      console.log(
		        `[${SCRIPT_NAME}] Polyfill built. Executing combined script logic...`,
		      );
		      // Note: runtime.getURL is now integrated into the polyfill itself
		      // D. Execute the combined logic
		      // Pass the polyfill and CSS data to the function
		      // async function executeAllScripts({chrome, browser, global, window, globalThis, self, __globals}, extensionCssData) {
		      await executeAllScripts.call(
		        polyfillContext.globalThis,
		        polyfillContext,
		        extensionCssData,
		      );
		    } else {
		      console.log(
		        `[${SCRIPT_NAME}] No matching content script patterns for this URL. No scripts will be executed.`,
		      );
		    }
		
		    // E. Options Page Handling - Register menu command if available
		    if (OPTIONS_PAGE_PATH) {
		      // Register GM menu command if available
		      if (typeof _registerMenuCommand === "function") {
		        try {
		          _registerMenuCommand("Open Options", openOptionsPage);
		          console.log(`[${SCRIPT_NAME}] Options menu command registered.`);
		        } catch (e) {
		          console.error("Failed to register menu command", e);
		        }
		      }
		    }
		
		    // F. Popup Page Handling - Register menu command if available
		    if (POPUP_PAGE_PATH) {
		      // Register GM menu command if available
		      if (typeof _registerMenuCommand === "function") {
		        try {
		          _registerMenuCommand("Open Popup", openPopupPage);
		          console.log(`[${SCRIPT_NAME}] Popup menu command registered.`);
		        } catch (e) {
		          console.error("Failed to register popup menu command", e);
		        }
		      }
		    }
		
		    console.log(`[${SCRIPT_NAME}] Initialization sequence complete.`);
		  }
		
		  main().catch((e) =>
		    console.error(`[${SCRIPT_NAME}] Error during script initialization:`, e),
		  );
		
		  try {
		    const fnKey =
		      "OPEN_OPTIONS_PAGE_" + String(SCRIPT_NAME).replace(/\s+/g, "_");
		    window[fnKey] = openOptionsPage;
		  } catch (e) {}
		
		  try {
		    const fnKey = "OPEN_POPUP_PAGE_" + String(SCRIPT_NAME).replace(/\s+/g, "_");
		    window[fnKey] = openPopupPage;
		  } catch (e) {}
		})();
		
    // #endregion
              // #endregion