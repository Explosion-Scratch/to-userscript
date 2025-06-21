// ==UserScript==
// @name        Return YouTube Dislike
// @version     3.0.0.18
// @description Returns ability to see dislikes
// @namespace   return-youtube-dislike
// @author      Converter Script
// @match       *://youtube.com/*
// @match       *://www.youtube.com/*
// @match       *://m.youtube.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAM5npUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjatZlpdiM7roT/cxW9BE7gsByO5/QO3vL7AzNl+7pkW3WrnlU2VcoUCQKBQIBp1v/9d5v/8BOTJBMll1RTsvzEGqtvvCn2/Wfd4/WZs/H8ffy4+68zTy94xsAYrg9zvK+G+/PH/eltZKInF5x8+kJ4W8Z/XDi3+3Nv/T8s6tY5+/GnvP/uPcve69pdiwk3pGtT1xLmMQ03drwUztcSr8yv8D6fV+VVbLPDRTvtYM3O++q8C3a76KZxzW233GQcbmBj9MtnRu+HD+ezErKvfgQbXIj6ctvnUMMMJfgw/AohRBP8my3urFvPesMVVp6OW71jMsdXvn2Zn2545bX3sPgIB5fjJ3cF2HuNg1M3Bv3LbQTE7Ttuchz8eL39mA+BDURQjpsLG2y2X1N0ce/YCgcAgfuE8cKXy1Oj5g9KImsLxrhACGxyQVxyNnufnYvBFwLUsNyH6DsRcCJ+YqSPISRiU8ARa/Od7M69Xvz1OalCfCSkkIlNDY1gxSjgJ8cChpoEiSKSJEuRKs2kkDTnUspJc67lkGOWnHLOJdfcSiixSEkll1JqadXXQEpKTTXXUmttjTVbNE0a327c0Vr3PfTYpaeee+m1twF8Rhwy0sijjDra9DPMOGWmmWeZdbblFlAyKy5ZaeVVVl1tg7Uddtyy08677LrbW9TuqP7y+o2ouTtq/kRK78tvUePTnHWiM4VTnhGNGRHz0RHxrBEA0F5jZouL0WvkNGa2erJCPEaKxmY624xLhDAu52W7t9i9R+7luBl8/VPc/CuRMxq6vxA5b1b4FLcnUZvKhONE7MpC9akNZB/XV2m+NJztrzdnxIgYp/OzC4bl2lKuwg4iJcHz3UQ27ezWljpjw5u8T9XNTIoM0makiQUh5hxsKm0R90U6dRK/rp4Z4OcJWxQ5721pyrtjSy/6/75qNnv4jn19xshcezLtyN3vPlb0vzGp+TgrkxZ8Aoj0E5Ec3Bp97QA8fcdZfFqi4PS9cpsMc8fOQjFvM7zvWMItYaYV9tpNzkotHDOfG0ndvM209jLU7GMnKx1LLzsJ0WXoZzOfGIn3j5HmiZUPI/9h4rcGYp75vdh87UXzsxtf86L52Y2vedF84cZMth2Ix9lDrM0BcZIzWkig2gjEgZ1bU0qQ6eJqJqYWyQWfyy7zwJxfoCk923bSRr/5MzTNl07lPxfeW3gFnubfOPaZX82/cewzv5rLDx1mGZdPig1tTQRM7HWGtJUo6vJwaBmtsBnYcZTATrokZkSEjiXUNZi5emWV3UNC0Eg8vzCfm+UiqxKgyQ+09Ww0X96gm3HCXor4s1349Hgv+tTW+HzdfL5hHPA7SHYsf5Kyuhw21QMiFEJynF+tDLwslw9X8d0IM353g8xZFiK0bl8xY2/0oKwy5ry8OwSKX9S1y79vfh7jIvNNldqIdQ3v+b6W2k7UVr+iPK0kFCkUH5aHwI0qUSoT8EjBEzgofqFF86H4mRdlJA/K1VAx68cabcxeKrewd+4dYbY+oNosUihBPaxGjYJ3loCa2f0QlPWUXOfoOZ4wV0/Nsu78x34ajf3iwpNRSILSyAFVAeQD0uBEE3mXk/n+MtJkFwrsylekKTitBbsukrXn7yieXZhNyPPeCJDGVL/e8PE67/KGP2o8Qa6OoMSUyAO2Riy9OtTK2YJ9jGTG7ZkZ3C7Z9foGkRYVIiNeEEEozCKGCZnHIxqqqodpO3EZo/dYiEwZKborMpHguCESi1brQTZSuNmsEoyVYlTxdARDunxKj7HGL9bRTIxdQhfkWxmhjwkdugD8pR6MlWraSBpsmpaUkNQNoEMyCz+gJ1fGCxmBAzYn0md6V7yiAIHlMLBMMFwXCHGU7IbgSX25tgrCh8QLMiZzjG5DqQ4ldHgTbp5huN5xah4t4Th0UCN1hBBkQ58kSCx8szpRQApJjin7CFOu5AO7ShlMBJC/GioTxZfj5QftxB5kYZ6xh4LvjR8ucvjAHc+vmps53nnjV9a4KQHfn25UKeEDZdxXzcfLnxkDA59zxq+U0U3scVMJVxbkdEsFV6rmnVoIPUSA2khH67EO6cKmVnRZ286s5abZNjO83A5nZ1BPiVxxVpdsq0hrl1pBtILNN2sOAj9b82aVWTUqSKlh7Hf1igxMVOxF7CmO6FrswKUpbwT2pBKhp4FVJZeTVtkmblIkKdmEHUpC7Uc64hHyGHGFdhgAaOEA6qbdlB64SVwBo7ThA7GbyKAYeqctGDWYCYTZZkszxFYSvQJA8SzX/M5l0vNX9kjn3qcHWGnGPgKCv4mS3w6j2oCUJtdojovWPCAMDjRHkuA2C9iLnymQeU0WXSYoj1Rjsqb5aDEgi6VNAUedYmtkEQdPNxYoqC3JHtmOECbrwexu1Ew8SWVMgpBFBXymOyqpKfQPRPi+dkelAChKc+3TYmnzNRbakxUCAHq9bJrndfP3y6b5oiz+dtk0L+VA+cjk4g+Te2VyL4/tmG9v6MHNPXAq0TnJgWXIxkOctEJ5uvIgU/OZVQEAgT4e2Ze8Q6Eh3hFkW8hG1hlZZdrMIewx0Eh0f26aQAegi1LShlx7aQin864RRdVcRYRerwC/GFxD53YflIoTveqCluk4y1FsNLuBUq7pMdB/WUv2XB1dhs9okAcVhsIBwMZ2euoEdbvoI/hfhE21WzZkuLb3dKjLdwQ0srg7SHnC6mQZ8nOpACCfuQGvTSgE1mGGUJwD+SSGc76eU79KdlSqAHXDYQKNfAckeLZki5BosdKi9uxXS/F2tM8Pp6t/tc266JXiKZdjsYLiObV4cvnLq7VwkRJMksq5ZjzkuBpV73tJVX+QXN10RYoLS26kwGrTVSr2qbulIbXGK8LHPLuAaq/vgGHNd8gk+wXKDDDbEdJe8C1QOfvFgWw9kWxJmRHtR/FEOUBgjiyr+FfVRdFjBli447pl/J6RPgpJSRGfy3U9I6kgxRFsQquEV0tuqgGBwKZ3kNyrfjmDFG9jPAdFZqMd92xIe9IMMTZDq0sJrsIqSKA+EwnGTazqaYQrCJ2oS68oYOKSHCy3USMhkiBWJ9uZnIC/VZ8GuogV67KRCSn7yvPlCF4aPkCU2CUMDivZiBKsbI3ysiGvCYlGVNDUQ0b4lJKCuyaEfNMk1sVvGNO81mn8zJjmtU7jZ8Y0r3Uaz+v0x9E8LeQoOoq16k+3Jz0iGrMItNW3b6RU0E5TuUMrEfCrqU5DeWrQwRAKaKbWdocbiK0WP8QiwdmqwNPiS9IrFSo0PeAiQ7kFSmzECZVgICoQmyMcNkKC6sCe36kmKIn6+iZ152ep+2k0F5v8OZmYi03+nEzMxSZ/Tia/02b9ONG3jdarbZj5qQ97tQ0zP/VhX7VhjHAEirHnDPOIWQFZ5WNsoLim87AC2NiAjbmBJCpjXMK/oeUVZqA8nV+6nLLuCOgjn/R3fK0H40+9+Z2nn7a75p9+1vJ9+VAZSL2oj0ze/fzl9WX+6WeVdC94+nPDa09d+zoRNQ9f7ZDML5fzzXQx/06HdJ9ovX/g6VxdK/GchnQqTLtOQ86jCz0NqWtleu5KY7nFFj1BH3q8aEQbXeiq6nPU01VgHBlLO3FBLepju1GdB2lp3UBD7x+gDYpYyrbT9zOuHVUPhTB2DpMGJNEmE2xUVWjp7TyyazP2JW2bF3j9Gh9E9JGGPhwimXOK9BcOkcw5RfoLh0jmfkO5jkGjEGdx1PQKIdPHpqLPJ+8mTJsj7zSTHZ0qxFnRt21puuNs74a9Kw/CGC1MXNfVKie2669Wme3a0yrrI4+rVV5joSD6Qi6smpbJoF2xgZ/aJOoU+pwRMUx316JUEeo/coB5kSwSvewpC76eVt1pq+78fDCEmC8u6tPArjShRzF3qpD163HW+ktfaM6bVgGyurB268ek29WHWmnqUyevOEbsqVwkHn1S0Q9ifKJHOYjRY3fzJsPwYdQ8m3OsJsx3M3ADMRAB7e2yRRNtsUSfiBecPSvp5KeeQ9LyMMpiLVQgtMB8q7b52AIqNZWfjo7ftvbCjWdkya/aRPM4E/qmj0SnQKPovBn6l42kublTFInqxkBJ0v4/62PJqTC0UYEIMdBvDSWXQ1eVwMZpKVdIa0qRgXAtfkQJD/xYNFF61+d5VLCEukfg6pMNCEDPQFSSqfROCDb0xtD8JB9QYGbXuggu/SJrxVT6nkB+Mt1tunYQP6ksRvPTDc9H14RqfSEvF1Jo6BlbQwrJjb1qb+z1HfeNPZvg5EPJ56DrIE8PujR7wZUwKU3NIeabsarTExx0pwyngEYBOJ0UWkqAr2W4HB81fN6Vk/059jqcnI2ScsD1V6lJQfuEf1NJTHyY/YeVxGgp+RuVxLxUQV4Y/18ngt9mNf8DR5y9ArsaIYgAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1OlRaoOdhBxyFCdLIiKOEorFsFCaSu06mBy6Rc0aUhSXBwF14KDH4tVBxdnXR1cBUHwA8TNzUnRRUr8X1JoEePBcT/e3XvcvQOEZpWpZs8koGqWkU7ExFx+VQy8IoQgBAwgKjFTT2YWs/AcX/fw8fUuyrO8z/05+pWCyQCfSDzPdMMi3iCe3bR0zvvEYVaWFOJz4gmDLkj8yHXZ5TfOJYcFnhk2suk4cZhYLHWx3MWsbKjEM8QRRdUoX8i5rHDe4qxW66x9T/7CUEFbyXCd5igSWEISKYiQUUcFVViI0qqRYiJN+zEP/4jjT5FLJlcFjBwLqEGF5PjB/+B3t2ZxespNCsWA3hfb/hgDArtAq2Hb38e23ToB/M/Aldbx15rA3CfpjY4WOQIGt4GL644m7wGXO8Dwky4ZkiP5aQrFIvB+Rt+UB4Zugb41t7f2Pk4fgCx1tXwDHBwC4yXKXvd4d7C7t3/PtPv7AVb4cpy/J7ghAAAACXBIWXMAAB/mAAAf5gGksLI7AAAAB3RJTUUH5QwJDzkC2XMpsQAAAoNJREFUaN7tmT9oE1Ecxz+Xi0oDVdRqpApZLKJoh1YhSmhBDS5dFEsHh6JgEaQIcWiH0qlgly5ShyJU0MlsLk4VB0sLBZtqoB44aUGtoi5FgkZ/DjmhHrnmcv/yDvKFGw7u93vfz++9d++9O2iqsdJqPSBwCcgBJ4CdPrb9EzCAe8B9DaRK21eBIzbxv4F8LfNjAhLC9UAsxRTIOoh7v5X5ToFySAAiMGBp/5qTuNgWHXAb0EMcztfdBMVsqp/EUpEQdMw3AOAGsCNkgJgvQQLbTYBIqBr1AHAgygDDjqOnp6G/Xx0AgTPAKcfRHR2Qz8PiIqTTSvTALVdZ0mlYWKjApFKNARA4CFx0vynRKsNpdRUmJ6G1NfQeuAls85wxkYCRETAMGBoCXQ8eQKDF7Upoq/Z2mJmBpSXo7Q28B64AbYG00NUFExOQTAYKMBxI9rU1GByEnh5YXw+kibjAWaDT16wbGzA1VZnMpVKgcyBuTl5/VC7D7CyMjwdW8WoA53zJNDcHuRwUi6GvA7s8ZTAM6OuDbDZ08/8WMPenqExGRNf9OpF9cnMii3uin59XcjcaKcWAP1EHeBd1gEeKeBG3AHeA5woAfLDcf3YQ8zauQUnggnmQvwwccmkg5fE70mPL/VNgFOi2ef4HcNevvm8R+OVhDXgh4X/G+Q/gtAfzLwV2N3odOOkybhnIavC90QDdLmIKpvlvKrz/inUOm2WBPaq8vBN1TuCCMuZNgEyd5veqtplzOv5XgPMafFVqLyLw0EHlV/yufJgTuKCseRPgY43Kt6GyBJ7YmH+lvHkT4LDAF4v51wL7InOoEDi6aSi9kQj94dkMcVzgmcB+mmoqOvoL3Z82CBlycfMAAAAASUVORK5CYII=
// @run-at      document-idle
// ==/UserScript==

console.log("Script start:",performance.now());const e=!0,t=e=>e,o="passthrough";let s,c={createHTML:t,createScript:t,createScriptURL:t},i=!1;const r=()=>{try{void 0!==window.isSecureContext&&window.isSecureContext&&window.trustedTypes&&window.trustedTypes.createPolicy&&(i=!0,trustedTypes.defaultPolicy?(l("TT Default Policy exists"),c=window.trustedTypes.createPolicy("default",c),s=trustedTypes.defaultPolicy,l(`Created custom passthrough policy, in case the default policy is too restrictive: Use Policy '${o}' in var 'TTP':`,c)):s=c=window.trustedTypes.createPolicy("default",c),l("Trusted-Type Policies: TTP:",c,"TTP_default:",s))}catch(e){l(e)}},l=(...e)=>{console.log(...e)};r();

(function() {
    // #region Logging
	
	  const SCRIPT_NAME = "Return YouTube Dislike";
	  const _log = (...args) => {};
	  const _warn = (...args) => console.warn(`[${typeof SCRIPT_NAME === 'string' ? SCRIPT_NAME : '[USERSCRIPT_CONVERTED]'}]`, ...args);
	  const _error = (...args) => {
	    let e = args[0];
	    console.error(`[${typeof SCRIPT_NAME === 'string' ? SCRIPT_NAME : '[USERSCRIPT_CONVERTED]'}]`, ...args);
	  }
	  
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
			  "popup.html": "<!doctype html>\r\n<html>\r\n\r\n  <!---   HEADER   -->\r\n  <head>\r\n    <meta content=\"text/html; charset=utf-8\" />\r\n    <title title=\"Return YouTube Dislike\">Return YouTube Dislike</title>\r\n    <link rel=\"stylesheet\" href=\"data:text/css;base64,LyogVmFyaWFibGVzICovDQo6cm9vdCB7DQogIGNvbG9yLXNjaGVtZTogZGFyazsNCg0KICAtLXByaW1hcnk6ICNjYzI5Mjk7DQogIC0tcHJpbWFyeTogI2YzOTA5MDsNCiAgLS1zZWNvbmRhcnk6ICM1MDJlMmU7DQogIC0tdGVydGlhcnk6ICMyMjE4MTg7DQogIC0tYmFja2dyb3VuZDogIzM1MjkyOTsNCg0KICAtLWFjY2VudDogIzU4MTExMTsNCiAgLS1saWdodEdyZXk6ICM5OTk7DQp9DQoNCi8qKiogICBNQVRFUklBTCAzICAgKioqLw0KLm0zLXByaW1hcnkgew0KICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5KSAhaW1wb3J0YW50Ow0KICBjb2xvcjogdmFyKC0tYmFja2dyb3VuZCkgIWltcG9ydGFudDsNCn0NCi5tMy1idG4gew0KICBiYWNrZ3JvdW5kOiB2YXIoLS10ZXJ0aWFyeSk7DQogIGNvbG9yOiB2YXIoLS1wcmltYXJ5KTsNCiAgdHJhbnNpdGlvbjogMC40czsNCiAgYm9yZGVyLXJhZGl1czogNHB4Ow0KICBmb250LXdlaWdodDogNTAwOw0KICBib3JkZXItcmFkaXVzOiAxMDBlbTsNCiAgYm94LXNoYWRvdzogMCA1cHggNXB4IHJnYmEoMCwwLDAsMC4xKTsNCiAgbWFyZ2luOiAwLjI1ZW07DQp9DQoubTMtYnRuOmhvdmVyIHsNCiAgYmFja2dyb3VuZDogdmFyKC0tc2Vjb25kYXJ5KSAhaW1wb3J0YW50Ow0KICBjb2xvcjogdmFyKC0tcHJpbWFyeSkgIWltcG9ydGFudDsNCn0NCg0Kc2VsZWN0IHsNCiAgYm9yZGVyLXJhZGl1czogMWVtOw0KICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpOw0KICBjb2xvcjogdmFyKC0tcHJpbWFyeSk7DQogIGJvcmRlcjogbm9uZTsNCiAgb3V0bGluZTogbm9uZTsNCiAgcGFkZGluZzogM3B4IDJweDsNCn0NCi8qKiogICBFTkQgTUFURVJJQUwgMyAgICoqKi8NCg0KLyogV2luZG93IFN0eWxpbmcgKi8NCmh0bWwsDQpib2R5IHsNCiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tYmFja2dyb3VuZCk7DQogIGNvbG9yOiB2YXIoLS1wcmltYXJ5KTsNCiAgbWluLXdpZHRoOiAzMTBweDsNCiAgbWluLWhlaWdodDogMzUwcHg7DQogIHBhZGRpbmc6IDAuNWVtOw0KICBmb250LWZhbWlseTogIlJvYm90byIsIEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7DQogIGZvbnQtc2l6ZTogMTRweDsNCn0NCg0KaDEgew0KICBmb250LXNpemU6IDI2cHg7DQp9DQoNCiNleHQtdmVyc2lvbiB7DQogIHBhZGRpbmc6IDAuMjVyZW0gMC41cmVtOw0KfQ0KDQpidXR0b24gew0KICBjdXJzb3I6IHBvaW50ZXI7DQogIHBhZGRpbmc6IDVweCAxNnB4Ow0KICBib3JkZXI6IG5vbmU7DQp9DQoNCiNleHQtdXBkYXRlIHsNCiAgY3Vyc29yOiBwb2ludGVyOw0KICBjb2xvcjogdmFyKC0tcHJpbWFyeSk7DQogIHRleHQtZGVjb3JhdGlvbjogbm9uZTsNCiAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeSk7DQogIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07DQp9DQojZXh0LXVwZGF0ZTpob3ZlciB7DQogIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lOw0KfQ0KDQojZXh0IHsNCiAgcGFkZGluZzogMC4yNXJlbSAwOw0KICB6LWluZGV4OiA2OTsNCiAgcG9zaXRpb246IGZpeGVkOw0KICBiYWNrZ3JvdW5kOiB2YXIoLS1zZWNvbmRhcnkpOw0KICBtYXJnaW46IDA7DQogIGJvdHRvbTogMS4xNXJlbTsNCiAgcmlnaHQ6IDEuMTVyZW07DQogIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07DQp9DQoNCi5zd2l0Y2g6OmJlZm9yZSwNCi5sYWJlbC13aXRoLWhvdmVyLXRpcDo6YmVmb3JlIHsNCiAgY29udGVudDogYXR0cihkYXRhLWhvdmVyKTsNCiAgdmlzaWJpbGl0eTogaGlkZGVuOw0KICBvcGFjaXR5OiAwOw0KICB0cmFuc2l0aW9uOg0KICAgIHZpc2liaWxpdHkgMC4xcyBsaW5lYXIsDQogICAgb3BhY2l0eSAwLjFzIGxpbmVhcjsNCiAgd2lkdGg6IDI1MHB4Ow0KICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpOw0KICBib3JkZXItcmFkaXVzOiAwLjVyZW07DQogIHBhZGRpbmc6IDAuNXJlbTsNCg0KICBwb3NpdGlvbjogYWJzb2x1dGU7DQogIHotaW5kZXg6IDE7DQogIGxlZnQ6IDA7DQogIHRvcDogMTYwJTsNCn0NCg0KLnN3aXRjaDpob3Zlcjo6YmVmb3JlLA0KLmxhYmVsLXdpdGgtaG92ZXItdGlwOmhvdmVyOjpiZWZvcmUgew0KICB2aXNpYmlsaXR5OiB2aXNpYmxlOw0KICBvcGFjaXR5OiAxOw0KfQ0KDQouZmFkZS1pbiB7DQogIG9wYWNpdHk6IDE7DQogIGFuaW1hdGlvbi1uYW1lOiBmYWRlSW5PcGFjaXR5Ow0KICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiAxOw0KICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLWluOw0KICBhbmltYXRpb24tZHVyYXRpb246IDJzOw0KfQ0KDQpAa2V5ZnJhbWVzIGZhZGVJbk9wYWNpdHkgew0KICAwJSB7DQogICAgb3BhY2l0eTogMDsNCiAgfQ0KICAxMDAlIHsNCiAgICBvcGFjaXR5OiAxOw0KICB9DQp9DQoNCiNhZHZhbmNlZFRvZ2dsZSB7DQogIHBvc2l0aW9uOiBmaXhlZDsNCiAgYmFja2dyb3VuZDogbm9uZTsNCiAgYm94LXNoYWRvdzogbm9uZTsNCiAgY29sb3I6IHZhcigtLXByaW1hcnkpOw0KICB0b3A6IDI2cHg7DQogIHJpZ2h0OiAyNnB4Ow0KICBwYWRkaW5nOiAycHg7DQogIHotaW5kZXg6IDY5Ow0KICBoZWlnaHQ6IDJyZW07DQogIHdpZHRoOiAycmVtOw0KICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAuMjVzOw0KfQ0KDQojYWR2YW5jZWRUb2dnbGU6aG92ZXIgew0KICB0cmFuc2Zvcm06IHJvdGF0ZSgtOTBkZWcpOw0KfQ0KDQojYWR2YW5jZWRUb2dnbGU6YWN0aXZlIHsNCiAgdHJhbnNmb3JtOiBzY2FsZSgxLjUpOw0KfQ0KDQojYWR2YW5jZWRTZXR0aW5ncyB7DQogIG9wYWNpdHk6IDA7DQogIHBvaW50ZXItZXZlbnRzOiBub25lOw0KICB0cmFuc2l0aW9uLWR1cmF0aW9uOiAwLjE1czsNCiAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2UtaW4tb3V0Ow0KICB0cmFuc2Zvcm06IHNjYWxlKDEuMSk7DQogIHBvc2l0aW9uOiBmaXhlZDsNCiAgYmFja2dyb3VuZDogdmFyKC0tYmFja2dyb3VuZCk7DQogIHRvcDogMTBweDsNCiAgcmlnaHQ6IDE0cHg7DQogIHdpZHRoOiBjYWxjKDEwMCUgLSA2NXB4KTsNCiAgaGVpZ2h0OiBjYWxjKDEwMCUgLSA1OHB4KTsNCiAgcGFkZGluZzogMXJlbTsNCiAgb3ZlcmZsb3cteTogYXV0bzsNCiAgb3ZlcmZsb3cteDogaGlkZGVuOw0KICBib3JkZXI6IG5vbmU7DQp9DQoNCjo6LXdlYmtpdC1zY3JvbGxiYXIgew0KICB3aWR0aDogMXJlbTsNCn0NCg0KOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7DQogIGJhY2tncm91bmQ6ICMxMTE7IC8qIGNvbG9yIG9mIHRoZSB0cmFja2luZyBhcmVhICovDQp9DQoNCjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIgew0KICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1wcmltYXJ5KTsgLyogY29sb3Igb2YgdGhlIHNjcm9sbCB0aHVtYiAqLw0KICBib3JkZXItcmFkaXVzOiAxcmVtIDAgMCAxcmVtOyAvKiByb3VuZG5lc3Mgb2YgdGhlIHNjcm9sbCB0aHVtYiAqLw0KICBib3JkZXItYm90dG9tOiAwLjI1cmVtIHNvbGlkICMxMTE7IC8qIGNyZWF0ZXMgcGFkZGluZyBhcm91bmQgc2Nyb2xsIHRodW1iICovDQogIGJvcmRlci1sZWZ0OiAwLjI1cmVtIHNvbGlkICMxMTE7IC8qIGNyZWF0ZXMgcGFkZGluZyBhcm91bmQgc2Nyb2xsIHRodW1iICovDQogIGJvcmRlci10b3A6IDAuMjVyZW0gc29saWQgIzExMTsgLyogY3JlYXRlcyBwYWRkaW5nIGFyb3VuZCBzY3JvbGwgdGh1bWIgKi8NCn0NCg0KOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7DQogIGJhY2tncm91bmQtY29sb3I6ICNmMjI7IC8qIGNvbG9yIG9mIHRoZSBzY3JvbGwgdGh1bWIgKi8NCiAgYm9yZGVyLXJhZGl1czogMXJlbSAwIDAgMXJlbTsgLyogcm91bmRuZXNzIG9mIHRoZSBzY3JvbGwgdGh1bWIgKi8NCiAgYm9yZGVyLWJvdHRvbTogMC4yNXJlbSBzb2xpZCAjMTExOyAvKiBjcmVhdGVzIHBhZGRpbmcgYXJvdW5kIHNjcm9sbCB0aHVtYiAqLw0KICBib3JkZXItbGVmdDogMC4yNXJlbSBzb2xpZCAjMTExOyAvKiBjcmVhdGVzIHBhZGRpbmcgYXJvdW5kIHNjcm9sbCB0aHVtYiAqLw0KICBib3JkZXItdG9wOiAwLjI1cmVtIHNvbGlkICMxMTE7IC8qIGNyZWF0ZXMgcGFkZGluZyBhcm91bmQgc2Nyb2xsIHRodW1iICovDQp9DQoNCiNhZHZhbmNlZExlZ2VuZCB7DQogIGNvbG9yOiB2YXIoLS1zZWNvbmRhcnkpICFpbXBvcnRhbnQ7DQogIC8qIG1hcmdpbjogYXV0bzsgKi8gLyogQ2VudGVyIHRoZSBsYWJlbCAqLw0KICAvKiBwYWRkaW5nOiAuMjVyZW0gLjVyZW07ICovDQogIC8qIGJvcmRlci1yYWRpdXM6IC4yNXJlbTsgKi8NCiAgLyogYm9yZGVyOiAuMjVyZW0gc29saWQgdmFyKC0tc2Vjb25kYXJ5KTsgKi8NCn0NCg0KLyogICBTd2l0Y2hlcyAgICovDQouc3dpdGNoIHsNCiAgcG9zaXRpb246IHJlbGF0aXZlOw0KICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7DQogIHdpZHRoOiAzMHB4Ow0KICBoZWlnaHQ6IDE3cHg7DQogIG1hcmdpbi1ib3R0b206IDFyZW07DQp9DQoNCi5sYWJlbC13aXRoLWhvdmVyLXRpcCB7DQogIHBvc2l0aW9uOiByZWxhdGl2ZTsNCiAgZGlzcGxheTogaW5saW5lLWJsb2NrOw0KICB3aWR0aDogODBweDsNCiAgaGVpZ2h0OiAxN3B4Ow0KICBtYXJnaW4tYm90dG9tOiAxcmVtOw0KfQ0KDQouc3dpdGNoOmxhc3Qtb2YtdHlwZSB7DQogIG1hcmdpbi1ib3R0b206IDA7DQp9DQoNCi5zd2l0Y2ggaW5wdXQgew0KICBkaXNwbGF5OiBub25lOw0KfQ0KDQouc2xpZGVyIHsNCiAgcG9zaXRpb246IGFic29sdXRlOw0KICBjdXJzb3I6IHBvaW50ZXI7DQogIHRvcDogMDsNCiAgbGVmdDogMDsNCiAgcmlnaHQ6IDA7DQogIGJvdHRvbTogMDsNCiAgYmFja2dyb3VuZDogdmFyKC0tc2Vjb25kYXJ5KTsNCiAgdHJhbnNpdGlvbjogMC40czsNCiAgYm9yZGVyLXJhZGl1czogMzRweDsNCn0NCg0KLnNsaWRlcjo6YmVmb3JlIHsNCiAgcG9zaXRpb246IGFic29sdXRlOw0KICBjb250ZW50OiAiIjsNCiAgaGVpZ2h0OiAxM3B4Ow0KICB3aWR0aDogMTNweDsNCiAgbGVmdDogMnB4Ow0KICBib3R0b206IDJweDsNCiAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeSk7DQogIHRyYW5zaXRpb246IDAuNHM7DQogIGJvcmRlci1yYWRpdXM6IDUwJTsNCn0NCg0KaW5wdXQ6Y2hlY2tlZCArIC5zbGlkZXIgew0KICBiYWNrZ3JvdW5kOiB2YXIoLS1hY2NlbnQpOw0KfQ0KDQppbnB1dDpjaGVja2VkICsgLnNsaWRlcjo6YmVmb3JlIHsNCiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDEzcHgpOw0KICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5KTsNCn0NCg0KLnN3aXRjaExhYmVsIHsNCiAgbWFyZ2luLWxlZnQ6IDAuNXJlbTsNCiAgd2lkdGg6IDI1MHB4ICFpbXBvcnRhbnQ7DQogIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgzNXB4KTsNCiAgZGlzcGxheTogaW5saW5lLWJsb2NrOw0KfQ0KDQojc2VydmVyLXN0YXR1cyB7DQogIGhlaWdodDogNzJweDsNCiAgd2lkdGg6IDkwcHg7DQogIC8qIGZpbHRlcjogaW52ZXJ0KDIxJSkgc2VwaWEoMTAwJSkgc2F0dXJhdGUoMzYxOCUpIGh1ZS1yb3RhdGUoMTAyZGVnKQ0KICAgIGJyaWdodG5lc3MoOTYlKSBjb250cmFzdCgxMDglKTsgKi8NCn0NCg0KLmNvbnRhaW5lciB7DQogIGRpc3BsYXk6IGZsZXg7DQogIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47DQogIGFsaWduLWl0ZW1zOiBjZW50ZXI7DQp9DQo=\" />\r\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\r\n    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\r\n    <link\r\n      href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap\"\r\n      rel=\"stylesheet\"\r\n    />\r\n  </head>\r\n  <!--   END HEADER -->\r\n  <body>\r\n    <center>\r\n      <img src=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8cGF0aA0KICAgICAgICBkPSJNMTQuOSAzSDZjLS45IDAtMS42LjUtMS45IDEuMmwtMyA3Yy0uMS4zLS4xLjUtLjEuN3YyYzAgMS4xLjkgMiAyIDJoNi4zbC0uOSA0LjVjLS4xLjUgMCAxIC40IDEuNGwxLjEgMS4xIDYuNS02LjZjLjQtLjQuNi0uOS42LTEuNFY1Yy0uMS0xLjEtMS0yLTIuMS0yem03LjQgMTIuOGgtMi45Yy0uNCAwLS43LS4zLS43LS43VjMuOWMwLS40LjMtLjcuNy0uN2gyLjljLjQgMCAuNy4zLjcuN1YxNWMwIC40LS4zLjgtLjcuOHoiDQogICAgICAgIGZpbGw9InJlZCINCiAgICAvPg0KICAgIDxwYXRoIGQ9Im04IDEyLjUgNS4xLTIuOUw4IDYuN3Y1Ljh6IiBmaWxsPSIjZmZmIiAvPg0KPC9zdmc+\" />\r\n      <h1 style=\"margin-bottom: 0.75rem\" title=\"Return YouTube Dislike\">\r\n        Return YouTube Dislike\r\n      </h1>\r\n      <p style=\"color: var(--lightGrey)\" title=\"by Dmitry Selivanov & Community\">\r\n        by Dmitry Selivanov & Community\r\n      </p>\r\n\r\n      <button class=\"m3-btn\" id=\"link_website\" title=\"Website\">\r\n        Website\r\n      </button>\r\n      <button\r\n        class=\"m3-btn m3-primary\"\r\n        style=\"margin-top: 0.3em;\"\r\n        id=\"link_donate\"\r\n        title=\"Donate\"\r\n      >\r\n        Donate\r\n      </button>\r\n      <button class=\"m3-btn\" id=\"link_discord\">Discord</button>\r\n      <br />\r\n      <button class=\"m3-btn\" style=\"margin-top: 0.3rem\" id=\"link_faq\" title=\"FAQ\">\r\n        FAQ\r\n      </button>\r\n      <button class=\"m3-btn\" id=\"link_github\">GitHub</button>\r\n      <button class=\"m3-btn\" style=\"margin-top: 0.3em\" id=\"link_help\" title=\"Help\">\r\n        Help\r\n      </button>\r\n      <br />\r\n      <button\r\n        class=\"m3-btn\"\r\n        style=\"margin-top: 0.3em\"\r\n        id=\"link_changelog\"\r\n        title=\"Change Log\"\r\n      >\r\n        Change Log\r\n      </button>\r\n\r\n      <br />\r\n      <br />\r\n      <p style=\"display: none\">API Status: <b id=\"status\"></b></p>\r\n      <img\r\n        id=\"server-status\"\r\n        style=\"display: none; width: 0.75rem; height: 0.75rem\"\r\n        src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNNDgwIDE2MEgzMmMtMTcuNjczIDAtMzItMTQuMzI3LTMyLTMyVjY0YzAtMTcuNjczIDE0LjMyNy0zMiAzMi0zMmg0NDhjMTcuNjczIDAgMzIgMTQuMzI3IDMyIDMydjY0YzAgMTcuNjczLTE0LjMyNyAzMi0zMiAzMnptLTQ4LTg4Yy0xMy4yNTUgMC0yNCAxMC43NDUtMjQgMjRzMTAuNzQ1IDI0IDI0IDI0IDI0LTEwLjc0NSAyNC0yNC0xMC43NDUtMjQtMjQtMjR6bS02NCAwYy0xMy4yNTUgMC0yNCAxMC43NDUtMjQgMjRzMTAuNzQ1IDI0IDI0IDI0IDI0LTEwLjc0NSAyNC0yNC0xMC43NDUtMjQtMjQtMjR6bTExMiAyNDhIMzJjLTE3LjY3MyAwLTMyLTE0LjMyNy0zMi0zMnYtNjRjMC0xNy42NzMgMTQuMzI3LTMyIDMyLTMyaDQ0OGMxNy42NzMgMCAzMiAxNC4zMjcgMzIgMzJ2NjRjMCAxNy42NzMtMTQuMzI3IDMyLTMyIDMyem0tNDgtODhjLTEzLjI1NSAwLTI0IDEwLjc0NS0yNCAyNHMxMC43NDUgMjQgMjQgMjQgMjQtMTAuNzQ1IDI0LTI0LTEwLjc0NS0yNC0yNC0yNHptLTY0IDBjLTEzLjI1NSAwLTI0IDEwLjc0NS0yNCAyNHMxMC43NDUgMjQgMjQgMjQgMjQtMTAuNzQ1IDI0LTI0LTEwLjc0NS0yNC0yNC0yNHptMTEyIDI0OEgzMmMtMTcuNjczIDAtMzItMTQuMzI3LTMyLTMydi02NGMwLTE3LjY3MyAxNC4zMjctMzIgMzItMzJoNDQ4YzE3LjY3MyAwIDMyIDE0LjMyNyAzMiAzMnY2NGMwIDE3LjY3My0xNC4zMjcgMzItMzIgMzJ6bS00OC04OGMtMTMuMjU1IDAtMjQgMTAuNzQ1LTI0IDI0czEwLjc0NSAyNCAyNCAyNCAyNC0xMC43NDUgMjQtMjQtMTAuNzQ1LTI0LTI0LTI0em0tNjQgMGMtMTMuMjU1IDAtMjQgMTAuNzQ1LTI0IDI0czEwLjc0NSAyNCAyNCAyNCAyNC0xMC43NDUgMjQtMjQtMTAuNzQ1LTI0LTI0LTI0eiIvPjwvc3ZnPg==\"\r\n        alt=\"\"\r\n      />\r\n\r\n      <br />\r\n      <br />\r\n    </center>\r\n\r\n    <!-- top-right -->\r\n    <button id=\"advancedToggle\">\r\n      <svg\r\n        xmlns=\"http://www.w3.org/2000/svg\"\r\n        enable-background=\"new 0 0 24 24\"\r\n        height=\"24px\"\r\n        viewBox=\"0 0 24 24\"\r\n        width=\"24px\"\r\n        fill=\"currentColor\"\r\n      >\r\n        <rect fill=\"none\" height=\"24\" width=\"24\" />\r\n        <path\r\n          d=\"M19.5,12c0-0.23-0.01-0.45-0.03-0.68l1.86-1.41c0.4-0.3,0.51-0.86,0.26-1.3l-1.87-3.23c-0.25-0.44-0.79-0.62-1.25-0.42 l-2.15,0.91c-0.37-0.26-0.76-0.49-1.17-0.68l-0.29-2.31C14.8,2.38,14.37,2,13.87,2h-3.73C9.63,2,9.2,2.38,9.14,2.88L8.85,5.19 c-0.41,0.19-0.8,0.42-1.17,0.68L5.53,4.96c-0.46-0.2-1-0.02-1.25,0.42L2.41,8.62c-0.25,0.44-0.14,0.99,0.26,1.3l1.86,1.41 C4.51,11.55,4.5,11.77,4.5,12s0.01,0.45,0.03,0.68l-1.86,1.41c-0.4,0.3-0.51,0.86-0.26,1.3l1.87,3.23c0.25,0.44,0.79,0.62,1.25,0.42 l2.15-0.91c0.37,0.26,0.76,0.49,1.17,0.68l0.29,2.31C9.2,21.62,9.63,22,10.13,22h3.73c0.5,0,0.93-0.38,0.99-0.88l0.29-2.31 c0.41-0.19,0.8-0.42,1.17-0.68l2.15,0.91c0.46,0.2,1,0.02,1.25-0.42l1.87-3.23c0.25-0.44,0.14-0.99-0.26-1.3l-1.86-1.41 C19.49,12.45,19.5,12.23,19.5,12z M12.04,15.5c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5S13.97,15.5,12.04,15.5z\"\r\n        />\r\n      </svg>\r\n    </button>\r\n    <!-- bottom-right -->\r\n    <div id=\"ext\">\r\n      <a\r\n        href=\"https://returnyoutubedislike.com/install\"\r\n        target=\"_blank\"\r\n        id=\"ext-update\"\r\n      ></a>\r\n      <span id=\"ext-version\"></span>\r\n    </div>\r\n\r\n    <!-- dialog box -->\r\n    <fieldset id=\"advancedSettings\">\r\n      <label class=\"switch\" data-hover=\"Stop counting your likes and dislikes\">\r\n        <input type=\"checkbox\" id=\"disable_vote_submission\" />\r\n        <span class=\"slider\"></span>\r\n        <span class=\"switchLabel\" title=\"Disable like/dislike submission\">\r\n          Disable like/dislike submission\r\n        </span>\r\n      </label>\r\n      <label class=\"switch\" data-hover=\"Disable Logging API Response in JavaScript Console.\">\r\n        <input type=\"checkbox\" id=\"disable_logging\"/>\r\n        <span class=\"slider\"/>\r\n        <span class=\"switchLabel\">Disable logging to console</span>\r\n      </label>\r\n      <br />\r\n      <label class=\"switch\" data-hover=\"Make likes and dislikes format consistent.\">\r\n        <input type=\"checkbox\" id=\"number_reformat_likes\" />\r\n        <span class=\"slider\"></span>\r\n        <span class=\"switchLabel\">Re-format like numbers</span>\r\n      </label>\r\n      <br />\r\n      <div class=\"custom-select\">\r\n        <label for=\"number_format\">Number format:</label>\r\n        <select name=\"number_format\" id=\"number_format\">\r\n          <option value=\"compactShort\" id=\"number_format_compactShort\"></option>\r\n          <option value=\"compactLong\" id=\"number_format_compactLong\"></option>\r\n          <option value=\"standard\" id=\"number_format_standard\"></option>\r\n        </select>\r\n      </div>\r\n      <br />\r\n      <div class=\"custom-select\">\r\n        <label class=\"switch\" data-hover=\"Use custom colors for the ratio bar.\">\r\n          <input type=\"checkbox\" id=\"colored_bar\" />\r\n          <span class=\"slider\"></span>\r\n          <span class=\"switchLabel\">Colorize ratio bar</span>\r\n        </label>\r\n      </div>\r\n      <label class=\"switch\" data-hover=\"Use custom colors for the thumb icons.\">\r\n        <input type=\"checkbox\" id=\"colored_thumbs\" />\r\n        <span class=\"slider\"></span>\r\n        <span class=\"switchLabel\">Colorize thumbs</span>\r\n      </label>\r\n      <br />\r\n      <div class=\"custom-select\">\r\n        <label for=\"color_theme\">Color theme:</label>\r\n        <select name=\"color_theme\" id=\"color_theme\">\r\n          <option value=\"classic\" id=\"color_theme_classic\">\r\n            Classic\r\n          </option>\r\n          <option value=\"accessible\" id=\"color_theme_accessible\">\r\n            Accessible\r\n          </option>\r\n          <option value=\"neon\" id=\"color_theme_neon\">\r\n            Neon\r\n          </option>\r\n        </select>\r\n        <span\r\n          id=\"color_theme_example_like\"\r\n          style=\"\r\n            display: inline-block;\r\n            vertical-align: text-top;\r\n            width: 1em;\r\n            height: 1em;\r\n          \"\r\n          >&nbsp;</span\r\n        >\r\n        <span\r\n          id=\"color_theme_example_dislike\"\r\n          style=\"\r\n            display: inline-block;\r\n            vertical-align: text-top;\r\n            width: 1em;\r\n            height: 1em;\r\n          \"\r\n          >&nbsp;</span\r\n        >\r\n      </div>\r\n      <br />\r\n      <label\r\n        class=\"switch\"\r\n        data-hover=\"Display percentage in like/dislike bar tooltip.\"\r\n      >\r\n        <input type=\"checkbox\" id=\"show_tooltip_percentage\" />\r\n        <span class=\"slider\"></span>\r\n        <span class=\"switchLabel\">Percentage in like/dislike bar tooltip.</span>\r\n      </label>\r\n      <div class=\"custom-select\">\r\n        <label\r\n          for=\"tooltip_percentage_mode\"\r\n          data-hover=\"Use custom percentage display on hover.\"\r\n          >Percent mode:</label\r\n        >\r\n        <select name=\"tooltip_percentage_mode\" id=\"tooltip_percentage_mode\">\r\n          <option value=\"dash_like\" id=\"tooltip_percentage_mode_dash_like\">\r\n            190&nbsp;/&nbsp;10&nbsp;&nbsp;-&nbsp;&nbsp;95%\r\n          </option>\r\n          <option\r\n            value=\"dash_dislike\"\r\n            id=\"tooltip_percentage_mode_dash_dislike\"\r\n          >\r\n            190&nbsp;/&nbsp;10&nbsp;&nbsp;-&nbsp;&nbsp;5%\r\n          </option>\r\n          <option value=\"both\" id=\"tooltip_percentage_mode_both\">\r\n            95%&nbsp;/&nbsp;5%\r\n          </option>\r\n          <option value=\"only_like\" id=\"tooltip_percentage_mode_only_like\">\r\n            95%\r\n          </option>\r\n          <option\r\n            value=\"only_dislike\"\r\n            id=\"tooltip_percentage_mode_only_dislike\"\r\n          >\r\n            5%\r\n          </option>\r\n        </select>\r\n      </div>\r\n    </fieldset>\r\n  </body>\r\n  <script src=\"data:text/javascript;base64,LyoqKioqKi8gKCgpID0+IHsgLy8gd2VicGFja0Jvb3RzdHJhcAovKioqKioqLyAJInVzZSBzdHJpY3QiOwp2YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9OwoKOy8vIENPTkNBVEVOQVRFRCBNT0RVTEU6IC4vRXh0ZW5zaW9ucy9jb21iaW5lZC9zcmMvYnV0dG9ucy5qcwoNCg0KDQpmdW5jdGlvbiBidXR0b25zX2dldEJ1dHRvbnMoKSB7DQogIC8vLS0tICAgSWYgV2F0Y2hpbmcgWW91dHViZSBTaG9ydHM6ICAgLS0tLy8NCiAgaWYgKGlzU2hvcnRzKCkpIHsNCiAgICBsZXQgZWxlbWVudHMgPSBpc01vYmlsZSgpDQogICAgICA/IHF1ZXJ5U2VsZWN0b3JBbGwoZXh0Q29uZmlnLnNlbGVjdG9ycy5idXR0b25zLnNob3J0cy5tb2JpbGUpDQogICAgICA6IHF1ZXJ5U2VsZWN0b3JBbGwoZXh0Q29uZmlnLnNlbGVjdG9ycy5idXR0b25zLnNob3J0cy5kZXNrdG9wKTsNCg0KICAgIGZvciAobGV0IGVsZW1lbnQgb2YgZWxlbWVudHMpIHsNCiAgICAgIC8vWW91VHViZSBTaG9ydHMgY2FuIGhhdmUgbXVsdGlwbGUgbGlrZS9kaXNsaWtlIGJ1dHRvbnMgd2hlbiBzY3JvbGxpbmcgdGhyb3VnaCB2aWRlb3MNCiAgICAgIC8vSG93ZXZlciwgb25seSBvbmUgb2YgdGhlbSBzaG91bGQgYmUgdmlzaWJsZSAobm8gbWF0dGVyIGhvdyB5b3Ugem9vbSkNCiAgICAgIGlmIChpc0luVmlld3BvcnQoZWxlbWVudCkpIHsNCiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7DQogICAgICB9DQogICAgfQ0KICB9DQogIC8vLS0tICAgSWYgV2F0Y2hpbmcgT24gTW9iaWxlOiAgIC0tLS8vDQogIGlmIChpc01vYmlsZSgpKSB7DQogICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZXh0Q29uZmlnLnNlbGVjdG9ycy5idXR0b25zLnJlZ3VsYXIubW9iaWxlKTsNCiAgfQ0KICAvLy0tLSAgIElmIE1lbnUgRWxlbWVudCBJcyBEaXNwbGF5ZWQ6ICAgLS0tLy8NCiAgaWYgKHF1ZXJ5U2VsZWN0b3IoZXh0Q29uZmlnLnNlbGVjdG9ycy5tZW51Q29udGFpbmVyKT8ub2Zmc2V0UGFyZW50ID09PSBudWxsKSB7DQogICAgcmV0dXJuIHF1ZXJ5U2VsZWN0b3IoZXh0Q29uZmlnLnNlbGVjdG9ycy5idXR0b25zLnJlZ3VsYXIuZGVza3RvcE1lbnUpOw0KICAgIC8vLS0tICAgSWYgTWVudSBFbGVtZW50IElzbid0IERpc3BsYXllZDogICAtLS0vLw0KICB9IGVsc2Ugew0KICAgIHJldHVybiBxdWVyeVNlbGVjdG9yKGV4dENvbmZpZy5zZWxlY3RvcnMuYnV0dG9ucy5yZWd1bGFyLmRlc2t0b3BOb01lbnUpOw0KICB9DQp9DQoNCmZ1bmN0aW9uIGJ1dHRvbnNfZ2V0TGlrZUJ1dHRvbigpIHsNCiAgcmV0dXJuIGJ1dHRvbnNfZ2V0QnV0dG9ucygpLmNoaWxkcmVuWzBdLnRhZ05hbWUgPT09DQogICAgIllURC1TRUdNRU5URUQtTElLRS1ESVNMSUtFLUJVVFRPTi1SRU5ERVJFUiINCiAgICA/IHF1ZXJ5U2VsZWN0b3IoZXh0Q29uZmlnLnNlbGVjdG9ycy5idXR0b25zLmxpa2VCdXR0b24uc2VnbWVudGVkKSA/Pw0KICAgICAgICBxdWVyeVNlbGVjdG9yKA0KICAgICAgICAgIGV4dENvbmZpZy5zZWxlY3RvcnMuYnV0dG9ucy5saWtlQnV0dG9uLnNlZ21lbnRlZEdldEJ1dHRvbnMsDQogICAgICAgICAgYnV0dG9uc19nZXRCdXR0b25zKCksDQogICAgICAgICkNCiAgICA6IHF1ZXJ5U2VsZWN0b3IoDQogICAgICAgIGV4dENvbmZpZy5zZWxlY3RvcnMuYnV0dG9ucy5saWtlQnV0dG9uLm5vdFNlZ21lbnRlZCwNCiAgICAgICAgYnV0dG9uc19nZXRCdXR0b25zKCksDQogICAgICApOw0KfQ0KDQpmdW5jdGlvbiBidXR0b25zX2dldExpa2VUZXh0Q29udGFpbmVyKCkgew0KICByZXR1cm4gcXVlcnlTZWxlY3RvcihleHRDb25maWcuc2VsZWN0b3JzLmxpa2VUZXh0Q29udGFpbmVyLCBidXR0b25zX2dldExpa2VCdXR0b24oKSk7DQp9DQoNCmZ1bmN0aW9uIGJ1dHRvbnNfZ2V0RGlzbGlrZUJ1dHRvbigpIHsNCiAgcmV0dXJuIGJ1dHRvbnNfZ2V0QnV0dG9ucygpLmNoaWxkcmVuWzBdLnRhZ05hbWUgPT09DQogICAgIllURC1TRUdNRU5URUQtTElLRS1ESVNMSUtFLUJVVFRPTi1SRU5ERVJFUiINCiAgICA/IHF1ZXJ5U2VsZWN0b3IoZXh0Q29uZmlnLnNlbGVjdG9ycy5idXR0b25zLmRpc2xpa2VCdXR0b24uc2VnbWVudGVkKSA/Pw0KICAgICAgICBxdWVyeVNlbGVjdG9yKA0KICAgICAgICAgIGV4dENvbmZpZy5zZWxlY3RvcnMuYnV0dG9ucy5kaXNsaWtlQnV0dG9uLnNlZ21lbnRlZEdldEJ1dHRvbnMsDQogICAgICAgICAgYnV0dG9uc19nZXRCdXR0b25zKCksDQogICAgICAgICkNCiAgICA6IGlzU2hvcnRzKCkNCiAgICAgID8gcXVlcnlTZWxlY3RvcihbIiNkaXNsaWtlLWJ1dHRvbiJdLCBidXR0b25zX2dldEJ1dHRvbnMoKSkNCiAgICAgIDogcXVlcnlTZWxlY3RvcigNCiAgICAgICAgICBleHRDb25maWcuc2VsZWN0b3JzLmJ1dHRvbnMuZGlzbGlrZUJ1dHRvbi5ub3RTZWdtZW50ZWQsDQogICAgICAgICAgYnV0dG9uc19nZXRCdXR0b25zKCksDQogICAgICAgICk7DQp9DQoNCmZ1bmN0aW9uIGNyZWF0ZURpc2xpa2VUZXh0Q29udGFpbmVyKCkgew0KICBjb25zdCB0ZXh0Tm9kZUNsb25lID0gKA0KICAgIGJ1dHRvbnNfZ2V0TGlrZUJ1dHRvbigpLnF1ZXJ5U2VsZWN0b3IoDQogICAgICAiLnl0LXNwZWMtYnV0dG9uLXNoYXBlLW5leHRfX2J1dHRvbi10ZXh0LWNvbnRlbnQiLA0KICAgICkgfHwNCiAgICBidXR0b25zX2dldExpa2VCdXR0b24oKS5xdWVyeVNlbGVjdG9yKCJidXR0b24gPiBkaXZbY2xhc3MqPSdjYm94J10iKSB8fA0KICAgICgNCiAgICAgIGJ1dHRvbnNfZ2V0TGlrZUJ1dHRvbigpLnF1ZXJ5U2VsZWN0b3IoJ2RpdiA+IHNwYW5bcm9sZT0idGV4dCJdJykgfHwNCiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoDQogICAgICAgICdidXR0b24gPiBkaXYueXQtc3BlYy1idXR0b24tc2hhcGUtbmV4dF9fYnV0dG9uLXRleHQtY29udGVudCA+IHNwYW5bcm9sZT0idGV4dCJdJywNCiAgICAgICkNCiAgICApLnBhcmVudE5vZGUNCiAgKS5jbG9uZU5vZGUodHJ1ZSk7DQogIGNvbnN0IGluc2VydFByZUNoaWxkID0gYnV0dG9uc19nZXREaXNsaWtlQnV0dG9uKCkucXVlcnlTZWxlY3RvcigiYnV0dG9uIik7DQogIGluc2VydFByZUNoaWxkLmluc2VydEJlZm9yZSh0ZXh0Tm9kZUNsb25lLCBudWxsKTsNCiAgYnV0dG9uc19nZXREaXNsaWtlQnV0dG9uKCkNCiAgICAucXVlcnlTZWxlY3RvcigiYnV0dG9uIikNCiAgICAuY2xhc3NMaXN0LnJlbW92ZSgieXQtc3BlYy1idXR0b24tc2hhcGUtbmV4dC0taWNvbi1idXR0b24iKTsNCiAgYnV0dG9uc19nZXREaXNsaWtlQnV0dG9uKCkNCiAgICAucXVlcnlTZWxlY3RvcigiYnV0dG9uIikNCiAgICAuY2xhc3NMaXN0LmFkZCgieXQtc3BlYy1idXR0b24tc2hhcGUtbmV4dC0taWNvbi1sZWFkaW5nIik7DQogIGlmICh0ZXh0Tm9kZUNsb25lLnF1ZXJ5U2VsZWN0b3IoInNwYW5bcm9sZT0ndGV4dCddIikgPT09IG51bGwpIHsNCiAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic3BhbiIpOw0KICAgIHNwYW4uc2V0QXR0cmlidXRlKCJyb2xlIiwgInRleHQiKTsNCiAgICB3aGlsZSAodGV4dE5vZGVDbG9uZS5maXJzdENoaWxkKSB7DQogICAgICB0ZXh0Tm9kZUNsb25lLnJlbW92ZUNoaWxkKHRleHROb2RlQ2xvbmUuZmlyc3RDaGlsZCk7DQogICAgfQ0KICAgIHRleHROb2RlQ2xvbmUuYXBwZW5kQ2hpbGQoc3Bhbik7DQogIH0NCiAgdGV4dE5vZGVDbG9uZS5pbm5lclRleHQgPSAiIjsNCiAgcmV0dXJuIHRleHROb2RlQ2xvbmU7DQp9DQoNCmZ1bmN0aW9uIGJ1dHRvbnNfZ2V0RGlzbGlrZVRleHRDb250YWluZXIoKSB7DQogIGxldCByZXN1bHQ7DQogIGZvciAoY29uc3Qgc2VsZWN0b3Igb2YgZXh0Q29uZmlnLnNlbGVjdG9ycy5kaXNsaWtlVGV4dENvbnRhaW5lcikgew0KICAgIHJlc3VsdCA9IGJ1dHRvbnNfZ2V0RGlzbGlrZUJ1dHRvbigpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpOw0KICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHsNCiAgICAgIGJyZWFrOw0KICAgIH0NCiAgfQ0KICBpZiAocmVzdWx0ID09IG51bGwpIHsNCiAgICByZXN1bHQgPSBjcmVhdGVEaXNsaWtlVGV4dENvbnRhaW5lcigpOw0KICB9DQogIHJldHVybiByZXN1bHQ7DQp9DQoNCmZ1bmN0aW9uIGNoZWNrRm9yU2lnbkluQnV0dG9uKCkgew0KICBpZiAoDQogICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcigNCiAgICAgICJhW2hyZWZePSdodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vU2VydmljZUxvZ2luJ10iLA0KICAgICkNCiAgKSB7DQogICAgcmV0dXJuIHRydWU7DQogIH0gZWxzZSB7DQogICAgcmV0dXJuIGZhbHNlOw0KICB9DQp9DQoNCg0KCjsvLyBDT05DQVRFTkFURUQgTU9EVUxFOiAuL0V4dGVuc2lvbnMvY29tYmluZWQvc3JjL2Jhci5qcwoNCg0KDQoNCmZ1bmN0aW9uIGJhcl9jcmVhdGVSYXRlQmFyKGxpa2VzLCBkaXNsaWtlcykgew0KICBsZXQgcmF0ZUJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJyeWQtYmFyLWNvbnRhaW5lciIpOw0KICBpZiAoIWlzTGlrZXNEaXNhYmxlZCgpKSB7DQogICAgLy8gc29tZXRpbWVzIHJhdGUgYmFyIGlzIGhpZGRlbg0KICAgIGlmIChyYXRlQmFyICYmICFpc0luVmlld3BvcnQocmF0ZUJhcikpIHsNCiAgICAgIHJhdGVCYXIucmVtb3ZlKCk7DQogICAgICByYXRlQmFyID0gbnVsbDsNCiAgICB9DQoNCiAgICBjb25zdCB3aWR0aFB4ID0NCiAgICAgIHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUoZ2V0TGlrZUJ1dHRvbigpKS53aWR0aCkgKw0KICAgICAgcGFyc2VGbG9hdCh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShnZXREaXNsaWtlQnV0dG9uKCkpLndpZHRoKSArDQogICAgICAoaXNSb3VuZGVkRGVzaWduKCkgPyAwIDogOCk7DQoNCiAgICBjb25zdCB3aWR0aFBlcmNlbnQgPQ0KICAgICAgbGlrZXMgKyBkaXNsaWtlcyA+IDAgPyAobGlrZXMgLyAobGlrZXMgKyBkaXNsaWtlcykpICogMTAwIDogNTA7DQoNCiAgICB2YXIgbGlrZVBlcmNlbnRhZ2UgPSBwYXJzZUZsb2F0KHdpZHRoUGVyY2VudC50b0ZpeGVkKDEpKTsNCiAgICBjb25zdCBkaXNsaWtlUGVyY2VudGFnZSA9ICgxMDAgLSBsaWtlUGVyY2VudGFnZSkudG9Mb2NhbGVTdHJpbmcoKTsNCiAgICBsaWtlUGVyY2VudGFnZSA9IGxpa2VQZXJjZW50YWdlLnRvTG9jYWxlU3RyaW5nKCk7DQoNCiAgICBpZiAoZXh0Q29uZmlnLnNob3dUb29sdGlwUGVyY2VudGFnZSkgew0KICAgICAgdmFyIHRvb2x0aXBJbm5lckhUTUw7DQogICAgICBzd2l0Y2ggKGV4dENvbmZpZy50b29sdGlwUGVyY2VudGFnZU1vZGUpIHsNCiAgICAgICAgY2FzZSAiZGFzaF9kaXNsaWtlIjoNCiAgICAgICAgICB0b29sdGlwSW5uZXJIVE1MID0gYCR7bGlrZXMudG9Mb2NhbGVTdHJpbmcoKX0mbmJzcDsvJm5ic3A7JHtkaXNsaWtlcy50b0xvY2FsZVN0cmluZygpfSZuYnNwOyZuYnNwOy0mbmJzcDsmbmJzcDske2Rpc2xpa2VQZXJjZW50YWdlfSVgOw0KICAgICAgICAgIGJyZWFrOw0KICAgICAgICBjYXNlICJib3RoIjoNCiAgICAgICAgICB0b29sdGlwSW5uZXJIVE1MID0gYCR7bGlrZVBlcmNlbnRhZ2V9JSZuYnNwOy8mbmJzcDske2Rpc2xpa2VQZXJjZW50YWdlfSVgOw0KICAgICAgICAgIGJyZWFrOw0KICAgICAgICBjYXNlICJvbmx5X2xpa2UiOg0KICAgICAgICAgIHRvb2x0aXBJbm5lckhUTUwgPSBgJHtsaWtlUGVyY2VudGFnZX0lYDsNCiAgICAgICAgICBicmVhazsNCiAgICAgICAgY2FzZSAib25seV9kaXNsaWtlIjoNCiAgICAgICAgICB0b29sdGlwSW5uZXJIVE1MID0gYCR7ZGlzbGlrZVBlcmNlbnRhZ2V9JWA7DQogICAgICAgICAgYnJlYWs7DQogICAgICAgIGRlZmF1bHQ6IC8vIGRhc2hfbGlrZQ0KICAgICAgICAgIHRvb2x0aXBJbm5lckhUTUwgPSBgJHtsaWtlcy50b0xvY2FsZVN0cmluZygpfSZuYnNwOy8mbmJzcDske2Rpc2xpa2VzLnRvTG9jYWxlU3RyaW5nKCl9Jm5ic3A7Jm5ic3A7LSZuYnNwOyZuYnNwOyR7bGlrZVBlcmNlbnRhZ2V9JWA7DQogICAgICB9DQogICAgfSBlbHNlIHsNCiAgICAgIHRvb2x0aXBJbm5lckhUTUwgPSBgJHtsaWtlcy50b0xvY2FsZVN0cmluZygpfSZuYnNwOy8mbmJzcDske2Rpc2xpa2VzLnRvTG9jYWxlU3RyaW5nKCl9YDsNCiAgICB9DQoNCiAgICBpZiAoIWlzU2hvcnRzKCkpIHsNCiAgICAgIGlmICghcmF0ZUJhciAmJiAhaXNNb2JpbGUoKSkgew0KICAgICAgICBsZXQgY29sb3JMaWtlU3R5bGUgPSAiIjsNCiAgICAgICAgbGV0IGNvbG9yRGlzbGlrZVN0eWxlID0gIiI7DQogICAgICAgIGlmIChleHRDb25maWcuY29sb3JlZEJhcikgew0KICAgICAgICAgIGNvbG9yTGlrZVN0eWxlID0gIjsgYmFja2dyb3VuZC1jb2xvcjogIiArIGdldENvbG9yRnJvbVRoZW1lKHRydWUpOw0KICAgICAgICAgIGNvbG9yRGlzbGlrZVN0eWxlID0gIjsgYmFja2dyb3VuZC1jb2xvcjogIiArIGdldENvbG9yRnJvbVRoZW1lKGZhbHNlKTsNCiAgICAgICAgfQ0KICAgICAgICBsZXQgYWN0aW9ucyA9DQogICAgICAgICAgaXNOZXdEZXNpZ24oKSAmJiBnZXRCdXR0b25zKCkuaWQgPT09ICJ0b3AtbGV2ZWwtYnV0dG9ucy1jb21wdXRlZCINCiAgICAgICAgICAgID8gZ2V0QnV0dG9ucygpDQogICAgICAgICAgICA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJtZW51LWNvbnRhaW5lciIpOw0KICAgICAgICAoDQogICAgICAgICAgYWN0aW9ucyB8fA0KICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoInl0bS1zbGltLXZpZGVvLWFjdGlvbi1iYXItcmVuZGVyZXIiKQ0KICAgICAgICApLmluc2VydEFkamFjZW50SFRNTCgNCiAgICAgICAgICAiYmVmb3JlZW5kIiwNCiAgICAgICAgICBgDQogICAgICAgICAgICAgIDxkaXYgY2xhc3M9InJ5ZC10b29sdGlwIHJ5ZC10b29sdGlwLSR7aXNOZXdEZXNpZ24oKSA/ICJuZXciIDogIm9sZCJ9LWRlc2lnbiIgc3R5bGU9IndpZHRoOiAke3dpZHRoUHh9cHgiPg0KICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJyeWQtdG9vbHRpcC1iYXItY29udGFpbmVyIj4NCiAgICAgICAgICAgICAgICA8ZGl2DQogICAgICAgICAgICAgICAgICAgIGlkPSJyeWQtYmFyLWNvbnRhaW5lciINCiAgICAgICAgICAgICAgICAgICAgc3R5bGU9IndpZHRoOiAxMDAlOyBoZWlnaHQ6IDJweDske2NvbG9yRGlzbGlrZVN0eWxlfSINCiAgICAgICAgICAgICAgICAgICAgPg0KICAgICAgICAgICAgICAgICAgICA8ZGl2DQogICAgICAgICAgICAgICAgICAgICAgaWQ9InJ5ZC1iYXIiDQogICAgICAgICAgICAgICAgICAgICAgc3R5bGU9IndpZHRoOiAke3dpZHRoUGVyY2VudH0lOyBoZWlnaHQ6IDEwMCUke2NvbG9yTGlrZVN0eWxlfSINCiAgICAgICAgICAgICAgICAgICAgICA+PC9kaXY+DQogICAgICAgICAgICAgICAgPC9kaXY+DQogICAgICAgICAgICAgIDwvZGl2Pg0KICAgICAgICAgICAgICA8dHAteXQtcGFwZXItdG9vbHRpcCBwb3NpdGlvbj0idG9wIiBpZD0icnlkLWRpc2xpa2UtdG9vbHRpcCIgY2xhc3M9InN0eWxlLXNjb3BlIHl0ZC1zZW50aW1lbnQtYmFyLXJlbmRlcmVyIiByb2xlPSJ0b29sdGlwIiB0YWJpbmRleD0iLTEiPg0KICAgICAgICAgICAgICAgIDwhLS1jc3MtYnVpbGQ6c2hhZHktLT4ke3Rvb2x0aXBJbm5lckhUTUx9DQogICAgICAgICAgICAgIDwvdHAteXQtcGFwZXItdG9vbHRpcD4NCiAgICAgICAgICAgICAgPC9kaXY+DQogICAgICAJCWAsDQogICAgICAgICk7DQoNCiAgICAgICAgaWYgKGlzTmV3RGVzaWduKCkpIHsNCiAgICAgICAgICAvLyBBZGQgYm9yZGVyIGJldHdlZW4gaW5mbyBhbmQgY29tbWVudHMNCiAgICAgICAgICBsZXQgZGVzY3JpcHRpb25BbmRBY3Rpb25zRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJ0b3Atcm93Iik7DQogICAgICAgICAgZGVzY3JpcHRpb25BbmRBY3Rpb25zRWxlbWVudC5zdHlsZS5ib3JkZXJCb3R0b20gPQ0KICAgICAgICAgICAgIjFweCBzb2xpZCB2YXIoLS15dC1zcGVjLTEwLXBlcmNlbnQtbGF5ZXIpIjsNCiAgICAgICAgICBkZXNjcmlwdGlvbkFuZEFjdGlvbnNFbGVtZW50LnN0eWxlLnBhZGRpbmdCb3R0b20gPSAiMTBweCI7DQoNCiAgICAgICAgICAvLyBGaXggbGlrZS9kaXNsaWtlIHJhdGlvIGJhciBvZmZzZXQgaW4gbmV3IFVJDQogICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImFjdGlvbnMtaW5uZXIiKS5zdHlsZS53aWR0aCA9ICJyZXZlcnQiOw0KICAgICAgICAgIGlmIChpc1JvdW5kZWREZXNpZ24oKSkgew0KICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImFjdGlvbnMiKS5zdHlsZS5mbGV4RGlyZWN0aW9uID0NCiAgICAgICAgICAgICAgInJvdy1yZXZlcnNlIjsNCiAgICAgICAgICB9DQogICAgICAgIH0NCiAgICAgIH0gZWxzZSB7DQogICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC5yeWQtdG9vbHRpcGApLnN0eWxlLndpZHRoID0gd2lkdGhQeCArICJweCI7DQogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJyeWQtYmFyIikuc3R5bGUud2lkdGggPSB3aWR0aFBlcmNlbnQgKyAiJSI7DQogICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiNyeWQtZGlzbGlrZS10b29sdGlwID4gI3Rvb2x0aXAiKS5pbm5lckhUTUwgPQ0KICAgICAgICAgIHRvb2x0aXBJbm5lckhUTUw7DQogICAgICAgIGlmIChleHRDb25maWcuY29sb3JlZEJhcikgew0KICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJyeWQtYmFyLWNvbnRhaW5lciIpLnN0eWxlLmJhY2tncm91bmRDb2xvciA9DQogICAgICAgICAgICBnZXRDb2xvckZyb21UaGVtZShmYWxzZSk7DQogICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInJ5ZC1iYXIiKS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPQ0KICAgICAgICAgICAgZ2V0Q29sb3JGcm9tVGhlbWUodHJ1ZSk7DQogICAgICAgIH0NCiAgICAgIH0NCiAgICB9DQogIH0gZWxzZSB7DQogICAgY0xvZygicmVtb3ZpbmcgYmFyIik7DQogICAgaWYgKHJhdGVCYXIpIHsNCiAgICAgIHJhdGVCYXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChyYXRlQmFyKTsNCiAgICB9DQogIH0NCn0NCg0KDQoKOy8vIENPTkNBVEVOQVRFRCBNT0RVTEU6IC4vRXh0ZW5zaW9ucy9jb21iaW5lZC9zcmMvc3RhdGUuanMKDQoNCg0KDQovL1RPRE86IERvIG5vdCBkdXBsaWNhdGUgaGVyZSBhbmQgaW4gcnlkLmJhY2tncm91bmQuanMNCmNvbnN0IGFwaVVybCA9ICJodHRwczovL3JldHVybnlvdXR1YmVkaXNsaWtlYXBpLmNvbSI7DQpjb25zdCBMSUtFRF9TVEFURSA9ICJMSUtFRF9TVEFURSI7DQpjb25zdCBESVNMSUtFRF9TVEFURSA9ICJESVNMSUtFRF9TVEFURSI7DQpjb25zdCBORVVUUkFMX1NUQVRFID0gIk5FVVRSQUxfU1RBVEUiOw0KDQpsZXQgc3RhdGVfZXh0Q29uZmlnID0gew0KICBkaXNhYmxlVm90ZVN1Ym1pc3Npb246IGZhbHNlLA0KICBkaXNhYmxlTG9nZ2luZzogZmFsc2UsDQogIGNvbG9yZWRUaHVtYnM6IGZhbHNlLA0KICBjb2xvcmVkQmFyOiBmYWxzZSwNCiAgY29sb3JUaGVtZTogImNsYXNzaWMiLA0KICBudW1iZXJEaXNwbGF5Rm9ybWF0OiAiY29tcGFjdFNob3J0IiwNCiAgc2hvd1Rvb2x0aXBQZXJjZW50YWdlOiBmYWxzZSwNCiAgdG9vbHRpcFBlcmNlbnRhZ2VNb2RlOiAiZGFzaF9saWtlIiwNCiAgbnVtYmVyRGlzcGxheVJlZm9ybWF0TGlrZXM6IGZhbHNlLA0KICBzZWxlY3RvcnM6IHsNCiAgICBkaXNsaWtlVGV4dENvbnRhaW5lcjogW10sDQogICAgbGlrZVRleHRDb250YWluZXI6IFtdLA0KICAgIGJ1dHRvbnM6IHsNCiAgICAgIHNob3J0czogew0KICAgICAgICBtb2JpbGU6IFtdLA0KICAgICAgICBkZXNrdG9wOiBbXSwNCiAgICAgIH0sDQogICAgICByZWd1bGFyOiB7DQogICAgICAgIG1vYmlsZTogW10sDQogICAgICAgIGRlc2t0b3BNZW51OiBbXSwNCiAgICAgICAgZGVza3RvcE5vTWVudTogW10sDQogICAgICB9LA0KICAgICAgbGlrZUJ1dHRvbjogew0KICAgICAgICBzZWdtZW50ZWQ6IFtdLA0KICAgICAgICBzZWdtZW50ZWRHZXRCdXR0b25zOiBbXSwNCiAgICAgICAgbm90U2VnbWVudGVkOiBbXSwNCiAgICAgIH0sDQogICAgICBkaXNsaWtlQnV0dG9uOiB7DQogICAgICAgIHNlZ21lbnRlZDogW10sDQogICAgICAgIHNlZ21lbnRlZEdldEJ1dHRvbnM6IFtdLA0KICAgICAgICBub3RTZWdtZW50ZWQ6IFtdLA0KICAgICAgfSwNCiAgICB9LA0KICAgIG1lbnVDb250YWluZXI6IFtdLA0KICAgIHJvdW5kZWREZXNpZ246IFtdLA0KICB9LA0KfTsNCg0KbGV0IHN0b3JlZERhdGEgPSB7DQogIGxpa2VzOiAwLA0KICBkaXNsaWtlczogMCwNCiAgcHJldmlvdXNTdGF0ZTogTkVVVFJBTF9TVEFURSwNCn07DQoNCmZ1bmN0aW9uIHN0YXRlX2lzTW9iaWxlKCkgew0KICByZXR1cm4gbG9jYXRpb24uaG9zdG5hbWUgPT0gIm0ueW91dHViZS5jb20iOw0KfQ0KDQpmdW5jdGlvbiBzdGF0ZV9pc1Nob3J0cygpIHsNCiAgcmV0dXJuIGxvY2F0aW9uLnBhdGhuYW1lLnN0YXJ0c1dpdGgoIi9zaG9ydHMiKTsNCn0NCg0KZnVuY3Rpb24gc3RhdGVfaXNOZXdEZXNpZ24oKSB7DQogIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29tbWVudC10ZWFzZXIiKSAhPT0gbnVsbDsNCn0NCg0KZnVuY3Rpb24gc3RhdGVfaXNSb3VuZGVkRGVzaWduKCkgew0KICByZXR1cm4gcXVlcnlTZWxlY3RvcihzdGF0ZV9leHRDb25maWcuc2VsZWN0b3JzLnJvdW5kZWREZXNpZ24pICE9PSBudWxsOw0KfQ0KDQpsZXQgc2hvcnRzT2JzZXJ2ZXIgPSBudWxsOw0KDQppZiAoc3RhdGVfaXNTaG9ydHMoKSAmJiAhc2hvcnRzT2JzZXJ2ZXIpIHsNCiAgdXRpbHNfY0xvZygiSW5pdGlhbGl6aW5nIHNob3J0cyBtdXRhdGlvbiBvYnNlcnZlciIpOw0KICBzaG9ydHNPYnNlcnZlciA9IGNyZWF0ZU9ic2VydmVyKA0KICAgIHsNCiAgICAgIGF0dHJpYnV0ZXM6IHRydWUsDQogICAgfSwNCiAgICAobXV0YXRpb25MaXN0KSA9PiB7DQogICAgICBtdXRhdGlvbkxpc3QuZm9yRWFjaCgobXV0YXRpb24pID0+IHsNCiAgICAgICAgaWYgKA0KICAgICAgICAgIG11dGF0aW9uLnR5cGUgPT09ICJhdHRyaWJ1dGVzIiAmJg0KICAgICAgICAgIG11dGF0aW9uLnRhcmdldC5ub2RlTmFtZSA9PT0gIlRQLVlULVBBUEVSLUJVVFRPTiIgJiYNCiAgICAgICAgICBtdXRhdGlvbi50YXJnZXQuaWQgPT09ICJidXR0b24iDQogICAgICAgICkgew0KICAgICAgICAgIC8vIGNMb2coJ1Nob3J0IHRodW1iIGJ1dHRvbiBzdGF0dXMgY2hhbmdlZCcpOw0KICAgICAgICAgIGlmIChtdXRhdGlvbi50YXJnZXQuZ2V0QXR0cmlidXRlKCJhcmlhLXByZXNzZWQiKSA9PT0gInRydWUiKSB7DQogICAgICAgICAgICBtdXRhdGlvbi50YXJnZXQuc3R5bGUuY29sb3IgPQ0KICAgICAgICAgICAgICBtdXRhdGlvbi50YXJnZXQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LmlkID09PSAibGlrZS1idXR0b24iDQogICAgICAgICAgICAgICAgPyB1dGlsc19nZXRDb2xvckZyb21UaGVtZSh0cnVlKQ0KICAgICAgICAgICAgICAgIDogdXRpbHNfZ2V0Q29sb3JGcm9tVGhlbWUoZmFsc2UpOw0KICAgICAgICAgIH0gZWxzZSB7DQogICAgICAgICAgICBtdXRhdGlvbi50YXJnZXQuc3R5bGUuY29sb3IgPSAidW5zZXQiOw0KICAgICAgICAgIH0NCiAgICAgICAgICByZXR1cm47DQogICAgICAgIH0NCiAgICAgICAgdXRpbHNfY0xvZygiVW5leHBlY3RlZCBtdXRhdGlvbiBvYnNlcnZlciBldmVudDogIiArIG11dGF0aW9uLnRhcmdldCArIG11dGF0aW9uLnR5cGUpOw0KICAgICAgfSk7DQogICAgfSwNCiAgKTsNCn0NCg0KZnVuY3Rpb24gc3RhdGVfaXNMaWtlc0Rpc2FibGVkKCkgew0KICAvLyByZXR1cm4gdHJ1ZSBpZiB0aGUgbGlrZSBidXR0b24ncyB0ZXh0IGRvZXNuJ3QgY29udGFpbiBhbnkgbnVtYmVyDQogIGlmIChzdGF0ZV9pc01vYmlsZSgpKSB7DQogICAgcmV0dXJuIC9eXEQqJC8udGVzdChnZXRCdXR0b25zKCkuY2hpbGRyZW5bMF0ucXVlcnlTZWxlY3RvcigiLmJ1dHRvbi1yZW5kZXJlci10ZXh0IikuaW5uZXJUZXh0KTsNCiAgfQ0KICByZXR1cm4gL15cRCokLy50ZXN0KGdldExpa2VUZXh0Q29udGFpbmVyKCkuaW5uZXJUZXh0KTsNCn0NCg0KZnVuY3Rpb24gaXNWaWRlb0xpa2VkKCkgew0KICBpZiAoc3RhdGVfaXNNb2JpbGUoKSkgew0KICAgIHJldHVybiBnZXRMaWtlQnV0dG9uKCkucXVlcnlTZWxlY3RvcigiYnV0dG9uIikuZ2V0QXR0cmlidXRlKCJhcmlhLWxhYmVsIikgPT09ICJ0cnVlIjsNCiAgfQ0KICByZXR1cm4gKA0KICAgIGdldExpa2VCdXR0b24oKS5jbGFzc0xpc3QuY29udGFpbnMoInN0eWxlLWRlZmF1bHQtYWN0aXZlIikgfHwNCiAgICBnZXRMaWtlQnV0dG9uKCkucXVlcnlTZWxlY3RvcigiYnV0dG9uIik/LmdldEF0dHJpYnV0ZSgiYXJpYS1wcmVzc2VkIikgPT09ICJ0cnVlIg0KICApOw0KfQ0KDQpmdW5jdGlvbiBpc1ZpZGVvRGlzbGlrZWQoKSB7DQogIGlmIChzdGF0ZV9pc01vYmlsZSgpKSB7DQogICAgcmV0dXJuIGdldERpc2xpa2VCdXR0b24oKS5xdWVyeVNlbGVjdG9yKCJidXR0b24iKS5nZXRBdHRyaWJ1dGUoImFyaWEtbGFiZWwiKSA9PT0gInRydWUiOw0KICB9DQogIHJldHVybiAoDQogICAgZ2V0RGlzbGlrZUJ1dHRvbigpLmNsYXNzTGlzdC5jb250YWlucygic3R5bGUtZGVmYXVsdC1hY3RpdmUiKSB8fA0KICAgIGdldERpc2xpa2VCdXR0b24oKS5xdWVyeVNlbGVjdG9yKCJidXR0b24iKT8uZ2V0QXR0cmlidXRlKCJhcmlhLXByZXNzZWQiKSA9PT0gInRydWUiDQogICk7DQp9DQoNCmZ1bmN0aW9uIGdldFN0YXRlKHN0b3JlZERhdGEpIHsNCiAgaWYgKGlzVmlkZW9MaWtlZCgpKSB7DQogICAgcmV0dXJuIHsgY3VycmVudDogTElLRURfU1RBVEUsIHByZXZpb3VzOiBzdG9yZWREYXRhLnByZXZpb3VzU3RhdGUgfTsNCiAgfQ0KICBpZiAoaXNWaWRlb0Rpc2xpa2VkKCkpIHsNCiAgICByZXR1cm4geyBjdXJyZW50OiBESVNMSUtFRF9TVEFURSwgcHJldmlvdXM6IHN0b3JlZERhdGEucHJldmlvdXNTdGF0ZSB9Ow0KICB9DQogIHJldHVybiB7IGN1cnJlbnQ6IE5FVVRSQUxfU1RBVEUsIHByZXZpb3VzOiBzdG9yZWREYXRhLnByZXZpb3VzU3RhdGUgfTsNCn0NCg0KLy8tLS0gICBTZXRzIFRoZSBMaWtlcyBBbmQgRGlzbGlrZXMgVmFsdWVzICAgLS0tLy8NCmZ1bmN0aW9uIHNldExpa2VzKGxpa2VzQ291bnQpIHsNCiAgY0xvZyhgU0VUIGxpa2VzICR7bGlrZXNDb3VudH1gKTsNCiAgZ2V0TGlrZVRleHRDb250YWluZXIoKS5pbm5lclRleHQgPSBsaWtlc0NvdW50Ow0KfQ0KDQpmdW5jdGlvbiBzZXREaXNsaWtlcyhkaXNsaWtlc0NvdW50KSB7DQogIGNMb2coYFNFVCBkaXNsaWtlcyAke2Rpc2xpa2VzQ291bnR9YCk7DQoNCiAgY29uc3QgX2NvbnRhaW5lciA9IGdldERpc2xpa2VUZXh0Q29udGFpbmVyKCk7DQogIF9jb250YWluZXI/LnJlbW92ZUF0dHJpYnV0ZSgiaXMtZW1wdHkiKTsNCg0KICBsZXQgX2Rpc2xpa2VUZXh0DQogIGlmICghc3RhdGVfaXNMaWtlc0Rpc2FibGVkKCkpIHsNCiAgICBpZiAoc3RhdGVfaXNNb2JpbGUoKSkgew0KICAgICAgZ2V0QnV0dG9ucygpLmNoaWxkcmVuWzFdLnF1ZXJ5U2VsZWN0b3IoIi5idXR0b24tcmVuZGVyZXItdGV4dCIpLmlubmVyVGV4dCA9IGRpc2xpa2VzQ291bnQ7DQogICAgICByZXR1cm47DQogICAgfQ0KICAgIF9kaXNsaWtlVGV4dCA9IGRpc2xpa2VzQ291bnQ7DQogIH0gZWxzZSB7DQogICAgY0xvZygibGlrZXMgY291bnQgZGlzYWJsZWQgYnkgY3JlYXRvciIpOw0KICAgIGlmIChzdGF0ZV9pc01vYmlsZSgpKSB7DQogICAgICBnZXRCdXR0b25zKCkuY2hpbGRyZW5bMV0ucXVlcnlTZWxlY3RvcigiLmJ1dHRvbi1yZW5kZXJlci10ZXh0IikuaW5uZXJUZXh0ID0gbG9jYWxpemUoIlRleHRMaWtlc0Rpc2FibGVkIik7DQogICAgICByZXR1cm47DQogICAgfQ0KICAgIF9kaXNsaWtlVGV4dCA9IGxvY2FsaXplKCJUZXh0TGlrZXNEaXNhYmxlZCIpOw0KICB9DQoNCiAgaWYgKF9kaXNsaWtlVGV4dCAhPSBudWxsICYmIF9jb250YWluZXI/LmlubmVyVGV4dCAhPT0gX2Rpc2xpa2VUZXh0KSB7DQogICAgX2NvbnRhaW5lci5pbm5lclRleHQgPSBfZGlzbGlrZVRleHQ7DQogIH0NCn0NCg0KZnVuY3Rpb24gZ2V0TGlrZUNvdW50RnJvbUJ1dHRvbigpIHsNCiAgdHJ5IHsNCiAgICBpZiAoc3RhdGVfaXNTaG9ydHMoKSkgew0KICAgICAgLy9Zb3V0dWJlIFNob3J0cyBkb24ndCB3b3JrIHdpdGggdGhpcyBxdWVyeS4gSXQncyBub3QgbmVjZXNzYXJ5OyB3ZSBjYW4gc2tpcCBpdCBhbmQgc3RpbGwgc2VlIHRoZSByZXN1bHRzLg0KICAgICAgLy9JdCBzaG91bGQgYmUgcG9zc2libGUgdG8gZml4IHRoaXMgZnVuY3Rpb24sIGJ1dCBpdCdzIG5vdCBjcml0aWNhbCB0byBzaG93aW5nIHRoZSBkaXNsaWtlIGNvdW50Lg0KICAgICAgcmV0dXJuIGZhbHNlOw0KICAgIH0NCg0KICAgIGxldCBsaWtlQnV0dG9uID0NCiAgICAgIGdldExpa2VCdXR0b24oKS5xdWVyeVNlbGVjdG9yKCJ5dC1mb3JtYXR0ZWQtc3RyaW5nI3RleHQiKSA/PyBnZXRMaWtlQnV0dG9uKCkucXVlcnlTZWxlY3RvcigiYnV0dG9uIik7DQoNCiAgICBsZXQgbGlrZXNTdHIgPSBsaWtlQnV0dG9uLmdldEF0dHJpYnV0ZSgiYXJpYS1sYWJlbCIpLnJlcGxhY2UoL1xEL2csICIiKTsNCiAgICByZXR1cm4gbGlrZXNTdHIubGVuZ3RoID4gMCA/IHBhcnNlSW50KGxpa2VzU3RyKSA6IGZhbHNlOw0KICB9IGNhdGNoIHsNCiAgICByZXR1cm4gZmFsc2U7DQogIH0NCn0NCg0KZnVuY3Rpb24gcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlLCBzdG9yZWREYXRhKSB7DQogIGNvbnN0IGZvcm1hdHRlZERpc2xpa2UgPSBudW1iZXJGb3JtYXQocmVzcG9uc2UuZGlzbGlrZXMpOw0KICBzZXREaXNsaWtlcyhmb3JtYXR0ZWREaXNsaWtlKTsNCiAgaWYgKHN0YXRlX2V4dENvbmZpZy5udW1iZXJEaXNwbGF5UmVmb3JtYXRMaWtlcyA9PT0gdHJ1ZSkgew0KICAgIGNvbnN0IG5hdGl2ZUxpa2VzID0gZ2V0TGlrZUNvdW50RnJvbUJ1dHRvbigpOw0KICAgIGlmIChuYXRpdmVMaWtlcyAhPT0gZmFsc2UpIHsNCiAgICAgIHNldExpa2VzKG51bWJlckZvcm1hdChuYXRpdmVMaWtlcykpOw0KICAgIH0NCiAgfQ0KICBzdG9yZWREYXRhLmRpc2xpa2VzID0gcGFyc2VJbnQocmVzcG9uc2UuZGlzbGlrZXMpOw0KICBzdG9yZWREYXRhLmxpa2VzID0gZ2V0TGlrZUNvdW50RnJvbUJ1dHRvbigpIHx8IHBhcnNlSW50KHJlc3BvbnNlLmxpa2VzKTsNCiAgY3JlYXRlUmF0ZUJhcihzdG9yZWREYXRhLmxpa2VzLCBzdG9yZWREYXRhLmRpc2xpa2VzKTsNCiAgaWYgKHN0YXRlX2V4dENvbmZpZy5jb2xvcmVkVGh1bWJzID09PSB0cnVlKSB7DQogICAgaWYgKHN0YXRlX2lzU2hvcnRzKCkpIHsNCiAgICAgIC8vIGZvciBzaG9ydHMsIGxlYXZlIGRlYWN0aXZhdGVkIGJ1dHRvbnMgaW4gZGVmYXVsdCBjb2xvcg0KICAgICAgbGV0IHNob3J0TGlrZUJ1dHRvbiA9IGdldExpa2VCdXR0b24oKS5xdWVyeVNlbGVjdG9yKCJ0cC15dC1wYXBlci1idXR0b24jYnV0dG9uIik7DQogICAgICBsZXQgc2hvcnREaXNsaWtlQnV0dG9uID0gZ2V0RGlzbGlrZUJ1dHRvbigpLnF1ZXJ5U2VsZWN0b3IoInRwLXl0LXBhcGVyLWJ1dHRvbiNidXR0b24iKTsNCiAgICAgIGlmIChzaG9ydExpa2VCdXR0b24uZ2V0QXR0cmlidXRlKCJhcmlhLXByZXNzZWQiKSA9PT0gInRydWUiKSB7DQogICAgICAgIHNob3J0TGlrZUJ1dHRvbi5zdHlsZS5jb2xvciA9IGdldENvbG9yRnJvbVRoZW1lKHRydWUpOw0KICAgICAgfQ0KICAgICAgaWYgKHNob3J0RGlzbGlrZUJ1dHRvbi5nZXRBdHRyaWJ1dGUoImFyaWEtcHJlc3NlZCIpID09PSAidHJ1ZSIpIHsNCiAgICAgICAgc2hvcnREaXNsaWtlQnV0dG9uLnN0eWxlLmNvbG9yID0gZ2V0Q29sb3JGcm9tVGhlbWUoZmFsc2UpOw0KICAgICAgfQ0KICAgICAgc2hvcnRzT2JzZXJ2ZXIub2JzZXJ2ZShzaG9ydExpa2VCdXR0b24pOw0KICAgICAgc2hvcnRzT2JzZXJ2ZXIub2JzZXJ2ZShzaG9ydERpc2xpa2VCdXR0b24pOw0KICAgIH0gZWxzZSB7DQogICAgICBnZXRMaWtlQnV0dG9uKCkuc3R5bGUuY29sb3IgPSBnZXRDb2xvckZyb21UaGVtZSh0cnVlKTsNCiAgICAgIGdldERpc2xpa2VCdXR0b24oKS5zdHlsZS5jb2xvciA9IGdldENvbG9yRnJvbVRoZW1lKGZhbHNlKTsNCiAgICB9DQogIH0NCiAgLy9UZW1wb3JhcnkgZGlzYWJsaW5nIHRoaXMgLSBpdCBicmVha3MgYWxsIHBsYWNlcyB3aGVyZSBnZXRCdXR0b25zKClbMV0gaXMgdXNlZA0KICAvLyBjcmVhdGVTdGFyUmF0aW5nKHJlc3BvbnNlLnJhdGluZywgaXNNb2JpbGUoKSk7DQp9DQoNCi8vIFRlbGxzIHRoZSB1c2VyIGlmIHRoZSBBUEkgaXMgZG93bg0KZnVuY3Rpb24gZGlzcGxheUVycm9yKGVycm9yKSB7DQogIGdldERpc2xpa2VUZXh0Q29udGFpbmVyKCkuaW5uZXJUZXh0ID0gbG9jYWxpemUoInRleHRUZW1wVW5hdmFpbGFibGUiKTsNCn0NCg0KYXN5bmMgZnVuY3Rpb24gc2V0U3RhdGUoc3RvcmVkRGF0YSkgew0KICBzdG9yZWREYXRhLnByZXZpb3VzU3RhdGUgPSBpc1ZpZGVvRGlzbGlrZWQoKSA/IERJU0xJS0VEX1NUQVRFIDogaXNWaWRlb0xpa2VkKCkgPyBMSUtFRF9TVEFURSA6IE5FVVRSQUxfU1RBVEU7DQogIGxldCBzdGF0c1NldCA9IGZhbHNlOw0KICBjTG9nKCJWaWRlbyBpcyBsb2FkZWQuIEFkZGluZyBidXR0b25zLi4uIik7DQoNCiAgbGV0IHZpZGVvSWQgPSBnZXRWaWRlb0lkKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTsNCiAgbGV0IGxpa2VDb3VudCA9IGdldExpa2VDb3VudEZyb21CdXR0b24oKSB8fCBudWxsOw0KDQogIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGAke2FwaVVybH0vdm90ZXM/dmlkZW9JZD0ke3ZpZGVvSWR9Jmxpa2VDb3VudD0ke2xpa2VDb3VudCB8fCAiIn1gLCB7DQogICAgbWV0aG9kOiAiR0VUIiwNCiAgICBoZWFkZXJzOiB7DQogICAgICBBY2NlcHQ6ICJhcHBsaWNhdGlvbi9qc29uIiwNCiAgICB9LA0KICB9KQ0KICAgIC50aGVuKChyZXNwb25zZSkgPT4gew0KICAgICAgaWYgKCFyZXNwb25zZS5vaykgZGlzcGxheUVycm9yKHJlc3BvbnNlLmVycm9yKTsNCiAgICAgIHJldHVybiByZXNwb25zZTsNCiAgICB9KQ0KICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKQ0KICAgIC5jYXRjaChkaXNwbGF5RXJyb3IpOw0KICBjTG9nKCJyZXNwb25zZSBmcm9tIGFwaToiKTsNCiAgY0xvZyhKU09OLnN0cmluZ2lmeShyZXNwb25zZSkpOw0KICBpZiAocmVzcG9uc2UgIT09IHVuZGVmaW5lZCAmJiAhKCJ0cmFjZUlkIiBpbiByZXNwb25zZSkgJiYgIXN0YXRzU2V0KSB7DQogICAgcHJvY2Vzc1Jlc3BvbnNlKHJlc3BvbnNlLCBzdG9yZWREYXRhKTsNCiAgfQ0KfQ0KDQphc3luYyBmdW5jdGlvbiBzZXRJbml0aWFsU3RhdGUoKSB7DQogIGF3YWl0IHNldFN0YXRlKHN0b3JlZERhdGEpOw0KfQ0KDQphc3luYyBmdW5jdGlvbiBpbml0RXh0Q29uZmlnKCkgew0KICBpbml0aWFsaXplRGlzYWJsZVZvdGVTdWJtaXNzaW9uKCk7DQogIGluaXRpYWxpemVEaXNhYmxlTG9nZ2luZygpOw0KICBpbml0aWFsaXplQ29sb3JlZFRodW1icygpOw0KICBpbml0aWFsaXplQ29sb3JlZEJhcigpOw0KICBpbml0aWFsaXplQ29sb3JUaGVtZSgpOw0KICBpbml0aWFsaXplTnVtYmVyRGlzcGxheUZvcm1hdCgpOw0KICBpbml0aWFsaXplVG9vbHRpcFBlcmNlbnRhZ2UoKTsNCiAgaW5pdGlhbGl6ZVRvb2x0aXBQZXJjZW50YWdlTW9kZSgpOw0KICBpbml0aWFsaXplTnVtYmVyRGlzcGxheVJlZm9ybWF0TGlrZXMoKTsNCiAgYXdhaXQgaW5pdGlhbGl6ZVNlbGVjdG9ycygpOw0KfQ0KDQphc3luYyBmdW5jdGlvbiBpbml0aWFsaXplU2VsZWN0b3JzKCkgew0KICBjb25zb2xlLmxvZygiaW5pdGlhbGl6aW5nIHNlbGVjdG9ycyIpOw0KICBsZXQgcmVzdWx0ID0gYXdhaXQgZmV0Y2goYCR7YXBpVXJsfS9jb25maWdzL3NlbGVjdG9yc2AsIHsNCiAgICBtZXRob2Q6ICJHRVQiLA0KICAgIGhlYWRlcnM6IHsNCiAgICAgIEFjY2VwdDogImFwcGxpY2F0aW9uL2pzb24iLA0KICAgIH0sDQogIH0pDQogICAgLnRoZW4oKHJlc3BvbnNlKSA9PiByZXNwb25zZS5qc29uKCkpDQogICAgLmNhdGNoKChlcnJvcikgPT4ge30pOw0KICBzdGF0ZV9leHRDb25maWcuc2VsZWN0b3JzID0gcmVzdWx0ID8/IHN0YXRlX2V4dENvbmZpZy5zZWxlY3RvcnM7DQogIGNvbnNvbGUubG9nKHJlc3VsdCk7DQp9DQoNCmZ1bmN0aW9uIGluaXRpYWxpemVEaXNhYmxlVm90ZVN1Ym1pc3Npb24oKSB7DQogIGdldEJyb3dzZXIoKS5zdG9yYWdlLnN5bmMuZ2V0KFsiZGlzYWJsZVZvdGVTdWJtaXNzaW9uIl0sIChyZXMpID0+IHsNCiAgICBpZiAocmVzLmRpc2FibGVWb3RlU3VibWlzc2lvbiA9PT0gdW5kZWZpbmVkKSB7DQogICAgICBnZXRCcm93c2VyKCkuc3RvcmFnZS5zeW5jLnNldCh7IGRpc2FibGVWb3RlU3VibWlzc2lvbjogZmFsc2UgfSk7DQogICAgfSBlbHNlIHsNCiAgICAgIHN0YXRlX2V4dENvbmZpZy5kaXNhYmxlVm90ZVN1Ym1pc3Npb24gPSByZXMuZGlzYWJsZVZvdGVTdWJtaXNzaW9uOw0KICAgIH0NCiAgfSk7DQp9DQoNCmZ1bmN0aW9uIGluaXRpYWxpemVEaXNhYmxlTG9nZ2luZygpIHsNCiAgZ2V0QnJvd3NlcigpLnN0b3JhZ2Uuc3luYy5nZXQoWyJkaXNhYmxlTG9nZ2luZyJdLCAocmVzKSA9PiB7DQogICAgaWYgKHJlcy5kaXNhYmxlTG9nZ2luZyA9PT0gdW5kZWZpbmVkKSB7DQogICAgICBnZXRCcm93c2VyKCkuc3RvcmFnZS5zeW5jLnNldCh7IGRpc2FibGVMb2dnaW5nOiB0cnVlIH0pOw0KICAgIH0gZWxzZSB7DQogICAgICBzdGF0ZV9leHRDb25maWcuZGlzYWJsZUxvZ2dpbmcgPSByZXMuZGlzYWJsZUxvZ2dpbmc7DQogICAgfQ0KICB9KTsNCn0NCg0KZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbG9yZWRUaHVtYnMoKSB7DQogIGdldEJyb3dzZXIoKS5zdG9yYWdlLnN5bmMuZ2V0KFsiY29sb3JlZFRodW1icyJdLCAocmVzKSA9PiB7DQogICAgaWYgKHJlcy5jb2xvcmVkVGh1bWJzID09PSB1bmRlZmluZWQpIHsNCiAgICAgIGdldEJyb3dzZXIoKS5zdG9yYWdlLnN5bmMuc2V0KHsgY29sb3JlZFRodW1iczogZmFsc2UgfSk7DQogICAgfSBlbHNlIHsNCiAgICAgIHN0YXRlX2V4dENvbmZpZy5jb2xvcmVkVGh1bWJzID0gcmVzLmNvbG9yZWRUaHVtYnM7DQogICAgfQ0KICB9KTsNCn0NCg0KZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbG9yZWRCYXIoKSB7DQogIGdldEJyb3dzZXIoKS5zdG9yYWdlLnN5bmMuZ2V0KFsiY29sb3JlZEJhciJdLCAocmVzKSA9PiB7DQogICAgaWYgKHJlcy5jb2xvcmVkQmFyID09PSB1bmRlZmluZWQpIHsNCiAgICAgIGdldEJyb3dzZXIoKS5zdG9yYWdlLnN5bmMuc2V0KHsgY29sb3JlZEJhcjogZmFsc2UgfSk7DQogICAgfSBlbHNlIHsNCiAgICAgIHN0YXRlX2V4dENvbmZpZy5jb2xvcmVkQmFyID0gcmVzLmNvbG9yZWRCYXI7DQogICAgfQ0KICB9KTsNCn0NCg0KZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbG9yVGhlbWUoKSB7DQogIGdldEJyb3dzZXIoKS5zdG9yYWdlLnN5bmMuZ2V0KFsiY29sb3JUaGVtZSJdLCAocmVzKSA9PiB7DQogICAgaWYgKHJlcy5jb2xvclRoZW1lID09PSB1bmRlZmluZWQpIHsNCiAgICAgIGdldEJyb3dzZXIoKS5zdG9yYWdlLnN5bmMuc2V0KHsgY29sb3JUaGVtZTogZmFsc2UgfSk7DQogICAgfSBlbHNlIHsNCiAgICAgIHN0YXRlX2V4dENvbmZpZy5jb2xvclRoZW1lID0gcmVzLmNvbG9yVGhlbWU7DQogICAgfQ0KICB9KTsNCn0NCg0KZnVuY3Rpb24gaW5pdGlhbGl6ZU51bWJlckRpc3BsYXlGb3JtYXQoKSB7DQogIGdldEJyb3dzZXIoKS5zdG9yYWdlLnN5bmMuZ2V0KFsibnVtYmVyRGlzcGxheUZvcm1hdCJdLCAocmVzKSA9PiB7DQogICAgaWYgKHJlcy5udW1iZXJEaXNwbGF5Rm9ybWF0ID09PSB1bmRlZmluZWQpIHsNCiAgICAgIGdldEJyb3dzZXIoKS5zdG9yYWdlLnN5bmMuc2V0KHsgbnVtYmVyRGlzcGxheUZvcm1hdDogImNvbXBhY3RTaG9ydCIgfSk7DQogICAgfSBlbHNlIHsNCiAgICAgIHN0YXRlX2V4dENvbmZpZy5udW1iZXJEaXNwbGF5Rm9ybWF0ID0gcmVzLm51bWJlckRpc3BsYXlGb3JtYXQ7DQogICAgfQ0KICB9KTsNCn0NCg0KZnVuY3Rpb24gaW5pdGlhbGl6ZVRvb2x0aXBQZXJjZW50YWdlKCkgew0KICBnZXRCcm93c2VyKCkuc3RvcmFnZS5zeW5jLmdldChbInNob3dUb29sdGlwUGVyY2VudGFnZSJdLCAocmVzKSA9PiB7DQogICAgaWYgKHJlcy5zaG93VG9vbHRpcFBlcmNlbnRhZ2UgPT09IHVuZGVmaW5lZCkgew0KICAgICAgZ2V0QnJvd3NlcigpLnN0b3JhZ2Uuc3luYy5zZXQoeyBzaG93VG9vbHRpcFBlcmNlbnRhZ2U6IGZhbHNlIH0pOw0KICAgIH0gZWxzZSB7DQogICAgICBzdGF0ZV9leHRDb25maWcuc2hvd1Rvb2x0aXBQZXJjZW50YWdlID0gcmVzLnNob3dUb29sdGlwUGVyY2VudGFnZTsNCiAgICB9DQogIH0pOw0KfQ0KDQpmdW5jdGlvbiBpbml0aWFsaXplVG9vbHRpcFBlcmNlbnRhZ2VNb2RlKCkgew0KICBnZXRCcm93c2VyKCkuc3RvcmFnZS5zeW5jLmdldChbInRvb2x0aXBQZXJjZW50YWdlTW9kZSJdLCAocmVzKSA9PiB7DQogICAgaWYgKHJlcy50b29sdGlwUGVyY2VudGFnZU1vZGUgPT09IHVuZGVmaW5lZCkgew0KICAgICAgZ2V0QnJvd3NlcigpLnN0b3JhZ2Uuc3luYy5zZXQoeyB0b29sdGlwUGVyY2VudGFnZU1vZGU6ICJkYXNoX2xpa2UiIH0pOw0KICAgIH0gZWxzZSB7DQogICAgICBzdGF0ZV9leHRDb25maWcudG9vbHRpcFBlcmNlbnRhZ2VNb2RlID0gcmVzLnRvb2x0aXBQZXJjZW50YWdlTW9kZTsNCiAgICB9DQogIH0pOw0KfQ0KDQpmdW5jdGlvbiBpbml0aWFsaXplTnVtYmVyRGlzcGxheVJlZm9ybWF0TGlrZXMoKSB7DQogIGdldEJyb3dzZXIoKS5zdG9yYWdlLnN5bmMuZ2V0KFsibnVtYmVyRGlzcGxheVJlZm9ybWF0TGlrZXMiXSwgKHJlcykgPT4gew0KICAgIGlmIChyZXMubnVtYmVyRGlzcGxheVJlZm9ybWF0TGlrZXMgPT09IHVuZGVmaW5lZCkgew0KICAgICAgZ2V0QnJvd3NlcigpLnN0b3JhZ2Uuc3luYy5zZXQoeyBudW1iZXJEaXNwbGF5UmVmb3JtYXRMaWtlczogZmFsc2UgfSk7DQogICAgfSBlbHNlIHsNCiAgICAgIHN0YXRlX2V4dENvbmZpZy5udW1iZXJEaXNwbGF5UmVmb3JtYXRMaWtlcyA9IHJlcy5udW1iZXJEaXNwbGF5UmVmb3JtYXRMaWtlczsNCiAgICB9DQogIH0pOw0KfQ0KDQoNCgo7Ly8gQ09OQ0FURU5BVEVEIE1PRFVMRTogLi9FeHRlbnNpb25zL2NvbWJpbmVkL3NyYy91dGlscy5qcwoNCg0KZnVuY3Rpb24gdXRpbHNfbnVtYmVyRm9ybWF0KG51bWJlclN0YXRlKSB7DQogIHJldHVybiBnZXROdW1iZXJGb3JtYXR0ZXIoZXh0Q29uZmlnLm51bWJlckRpc3BsYXlGb3JtYXQpLmZvcm1hdChudW1iZXJTdGF0ZSk7DQp9DQoNCmZ1bmN0aW9uIGdldE51bWJlckZvcm1hdHRlcihvcHRpb25TZWxlY3QpIHsNCiAgbGV0IHVzZXJMb2NhbGVzOw0KICBpZiAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmxhbmcpIHsNCiAgICB1c2VyTG9jYWxlcyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5sYW5nOw0KICB9IGVsc2UgaWYgKG5hdmlnYXRvci5sYW5ndWFnZSkgew0KICAgIHVzZXJMb2NhbGVzID0gbmF2aWdhdG9yLmxhbmd1YWdlOw0KICB9IGVsc2Ugew0KICAgIHRyeSB7DQogICAgICB1c2VyTG9jYWxlcyA9IG5ldyBVUkwoDQogICAgICAgIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgiaGVhZCA+IGxpbmtbcmVsPSdzZWFyY2gnXSIpKQ0KICAgICAgICAgID8uZmluZCgobikgPT4gbj8uZ2V0QXR0cmlidXRlKCJocmVmIik/LmluY2x1ZGVzKCI/bG9jYWxlPSIpKQ0KICAgICAgICAgID8uZ2V0QXR0cmlidXRlKCJocmVmIiksDQogICAgICApPy5zZWFyY2hQYXJhbXM/LmdldCgibG9jYWxlIik7DQogICAgfSBjYXRjaCB7DQogICAgICB1dGlsc19jTG9nKCJDYW5ub3QgZmluZCBicm93c2VyIGxvY2FsZS4gVXNlIGVuIGFzIGRlZmF1bHQgZm9yIG51bWJlciBmb3JtYXR0aW5nLiIpOw0KICAgICAgdXNlckxvY2FsZXMgPSAiZW4iOw0KICAgIH0NCiAgfQ0KDQogIGxldCBmb3JtYXR0ZXJOb3RhdGlvbjsNCiAgbGV0IGZvcm1hdHRlckNvbXBhY3REaXNwbGF5Ow0KICBzd2l0Y2ggKG9wdGlvblNlbGVjdCkgew0KICAgIGNhc2UgImNvbXBhY3RMb25nIjoNCiAgICAgIGZvcm1hdHRlck5vdGF0aW9uID0gImNvbXBhY3QiOw0KICAgICAgZm9ybWF0dGVyQ29tcGFjdERpc3BsYXkgPSAibG9uZyI7DQogICAgICBicmVhazsNCiAgICBjYXNlICJzdGFuZGFyZCI6DQogICAgICBmb3JtYXR0ZXJOb3RhdGlvbiA9ICJzdGFuZGFyZCI7DQogICAgICBmb3JtYXR0ZXJDb21wYWN0RGlzcGxheSA9ICJzaG9ydCI7DQogICAgICBicmVhazsNCiAgICBjYXNlICJjb21wYWN0U2hvcnQiOg0KICAgIGRlZmF1bHQ6DQogICAgICBmb3JtYXR0ZXJOb3RhdGlvbiA9ICJjb21wYWN0IjsNCiAgICAgIGZvcm1hdHRlckNvbXBhY3REaXNwbGF5ID0gInNob3J0IjsNCiAgfQ0KDQogIGNvbnN0IGZvcm1hdHRlciA9IEludGwuTnVtYmVyRm9ybWF0KHVzZXJMb2NhbGVzLCB7DQogICAgbm90YXRpb246IGZvcm1hdHRlck5vdGF0aW9uLA0KICAgIGNvbXBhY3REaXNwbGF5OiBmb3JtYXR0ZXJDb21wYWN0RGlzcGxheSwNCiAgfSk7DQogIHJldHVybiBmb3JtYXR0ZXI7DQp9DQoNCmZ1bmN0aW9uIHV0aWxzX2xvY2FsaXplKGxvY2FsZVN0cmluZykgew0KICByZXR1cm4gY2hyb21lLmkxOG4uZ2V0TWVzc2FnZShsb2NhbGVTdHJpbmcpOw0KfQ0KDQpmdW5jdGlvbiB1dGlsc19nZXRCcm93c2VyKCkgew0KICBpZiAodHlwZW9mIGNocm9tZSAhPT0gInVuZGVmaW5lZCIgJiYgdHlwZW9mIGNocm9tZS5ydW50aW1lICE9PSAidW5kZWZpbmVkIikgew0KICAgIHJldHVybiBjaHJvbWU7DQogIH0gZWxzZSBpZiAodHlwZW9mIGJyb3dzZXIgIT09ICJ1bmRlZmluZWQiICYmIHR5cGVvZiBicm93c2VyLnJ1bnRpbWUgIT09ICJ1bmRlZmluZWQiKSB7DQogICAgcmV0dXJuIGJyb3dzZXI7DQogIH0gZWxzZSB7DQogICAgY29uc29sZS5sb2coImJyb3dzZXIgaXMgbm90IHN1cHBvcnRlZCIpOw0KICAgIHJldHVybiBmYWxzZTsNCiAgfQ0KfQ0KDQpmdW5jdGlvbiB1dGlsc19nZXRWaWRlb0lkKHVybCkgew0KICBjb25zdCB1cmxPYmplY3QgPSBuZXcgVVJMKHVybCk7DQogIGNvbnN0IHBhdGhuYW1lID0gdXJsT2JqZWN0LnBhdGhuYW1lOw0KICBpZiAocGF0aG5hbWUuc3RhcnRzV2l0aCgiL2NsaXAiKSkgew0KICAgIHJldHVybiAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcigibWV0YVtpdGVtcHJvcD0ndmlkZW9JZCddIikgfHwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcigibWV0YVtpdGVtcHJvcD0naWRlbnRpZmllciddIikpDQogICAgICAuY29udGVudDsNCiAgfSBlbHNlIHsNCiAgICBpZiAocGF0aG5hbWUuc3RhcnRzV2l0aCgiL3Nob3J0cyIpKSB7DQogICAgICByZXR1cm4gcGF0aG5hbWUuc2xpY2UoOCk7DQogICAgfQ0KICAgIHJldHVybiB1cmxPYmplY3Quc2VhcmNoUGFyYW1zLmdldCgidiIpOw0KICB9DQp9DQoNCmZ1bmN0aW9uIHV0aWxzX2lzSW5WaWV3cG9ydChlbGVtZW50KSB7DQogIGNvbnN0IHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOw0KICBjb25zdCBoZWlnaHQgPSBpbm5lckhlaWdodCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0Ow0KICBjb25zdCB3aWR0aCA9IGlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoOw0KICByZXR1cm4gKA0KICAgIC8vIFdoZW4gc2hvcnQgKGNoYW5uZWwpIGlzIGlnbm9yZWQsIHRoZSBlbGVtZW50IChsaWtlL2Rpc2xpa2UgQU5EIHNob3J0IGl0c2VsZikgaXMNCiAgICAvLyBoaWRkZW4gd2l0aCBhIDAgRE9NUmVjdC4gSW4gdGhpcyBjYXNlLCBjb25zaWRlciBpdCBvdXRzaWRlIG9mIFZpZXdwb3J0DQogICAgIShyZWN0LnRvcCA9PSAwICYmIHJlY3QubGVmdCA9PSAwICYmIHJlY3QuYm90dG9tID09IDAgJiYgcmVjdC5yaWdodCA9PSAwKSAmJg0KICAgIHJlY3QudG9wID49IDAgJiYNCiAgICByZWN0LmxlZnQgPj0gMCAmJg0KICAgIHJlY3QuYm90dG9tIDw9IGhlaWdodCAmJg0KICAgIHJlY3QucmlnaHQgPD0gd2lkdGgNCiAgKTsNCn0NCg0KZnVuY3Rpb24gaXNWaWRlb0xvYWRlZCgpIHsNCiAgY29uc3QgdmlkZW9JZCA9IHV0aWxzX2dldFZpZGVvSWQod2luZG93LmxvY2F0aW9uLmhyZWYpOw0KICByZXR1cm4gKA0KICAgIC8vIGRlc2t0b3A6IHNwcmluZyAyMDI0IFVJDQogICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgeXRkLXdhdGNoLWdyaWRbdmlkZW8taWQ9JyR7dmlkZW9JZH0nXWApICE9PSBudWxsIHx8DQogICAgLy8gZGVza3RvcDogb2xkZXIgVUkNCiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGB5dGQtd2F0Y2gtZmxleHlbdmlkZW8taWQ9JyR7dmlkZW9JZH0nXWApICE9PSBudWxsIHx8DQogICAgLy8gbW9iaWxlOiBubyB2aWRlby1pZCBhdHRyaWJ1dGUNCiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyW2xvYWRpbmc9ImZhbHNlIl06bm90KFtoaWRkZW5dKScpICE9PSBudWxsDQogICk7DQp9DQoNCmZ1bmN0aW9uIHV0aWxzX2NMb2cobWVzc2FnZSwgd3JpdGVyKSB7DQogIGlmICghc3RhdGVfZXh0Q29uZmlnLmRpc2FibGVMb2dnaW5nKSB7DQogICAgbWVzc2FnZSA9IGBbcmV0dXJuIHlvdXR1YmUgZGlzbGlrZV06ICR7bWVzc2FnZX1gOw0KICAgIGlmICh3cml0ZXIpIHsNCiAgICAgIHdyaXRlcihtZXNzYWdlKTsNCiAgICB9IGVsc2Ugew0KICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7DQogICAgfQ0KICB9DQp9DQoNCmZ1bmN0aW9uIHV0aWxzX2dldENvbG9yRnJvbVRoZW1lKHZvdGVJc0xpa2UpIHsNCiAgbGV0IGNvbG9yU3RyaW5nOw0KICBzd2l0Y2ggKHN0YXRlX2V4dENvbmZpZy5jb2xvclRoZW1lKSB7DQogICAgY2FzZSAiYWNjZXNzaWJsZSI6DQogICAgICBpZiAodm90ZUlzTGlrZSA9PT0gdHJ1ZSkgew0KICAgICAgICBjb2xvclN0cmluZyA9ICJkb2RnZXJibHVlIjsNCiAgICAgIH0gZWxzZSB7DQogICAgICAgIGNvbG9yU3RyaW5nID0gImdvbGQiOw0KICAgICAgfQ0KICAgICAgYnJlYWs7DQogICAgY2FzZSAibmVvbiI6DQogICAgICBpZiAodm90ZUlzTGlrZSA9PT0gdHJ1ZSkgew0KICAgICAgICBjb2xvclN0cmluZyA9ICJhcXVhIjsNCiAgICAgIH0gZWxzZSB7DQogICAgICAgIGNvbG9yU3RyaW5nID0gIm1hZ2VudGEiOw0KICAgICAgfQ0KICAgICAgYnJlYWs7DQogICAgY2FzZSAiY2xhc3NpYyI6DQogICAgZGVmYXVsdDoNCiAgICAgIGlmICh2b3RlSXNMaWtlID09PSB0cnVlKSB7DQogICAgICAgIGNvbG9yU3RyaW5nID0gImxpbWUiOw0KICAgICAgfSBlbHNlIHsNCiAgICAgICAgY29sb3JTdHJpbmcgPSAicmVkIjsNCiAgICAgIH0NCiAgfQ0KICByZXR1cm4gY29sb3JTdHJpbmc7DQp9DQoNCmZ1bmN0aW9uIHV0aWxzX3F1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3JzLCBlbGVtZW50KSB7DQogIGxldCByZXN1bHQ7DQogIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7DQogICAgcmVzdWx0ID0gKGVsZW1lbnQgPz8gZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpOw0KICAgIGlmIChyZXN1bHQgIT09IG51bGwpIHsNCiAgICAgIHJldHVybiByZXN1bHQ7DQogICAgfQ0KICB9DQp9DQoNCmZ1bmN0aW9uIHV0aWxzX3F1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3JzKSB7DQogIGxldCByZXN1bHQ7DQogIGZvciAoY29uc3Qgc2VsZWN0b3Igb2Ygc2VsZWN0b3JzKSB7DQogICAgcmVzdWx0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7DQogICAgaWYgKHJlc3VsdC5sZW5ndGggIT09IDApIHsNCiAgICAgIHJldHVybiByZXN1bHQ7DQogICAgfQ0KICB9DQogIHJldHVybiByZXN1bHQ7DQp9DQoNCmZ1bmN0aW9uIGNyZWF0ZU9ic2VydmVyKG9wdGlvbnMsIGNhbGxiYWNrKSB7DQogIGNvbnN0IG9ic2VydmVyV3JhcHBlciA9IG5ldyBPYmplY3QoKTsNCiAgb2JzZXJ2ZXJXcmFwcGVyLm9wdGlvbnMgPSBvcHRpb25zOw0KICBvYnNlcnZlcldyYXBwZXIub2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjYWxsYmFjayk7DQogIG9ic2VydmVyV3JhcHBlci5vYnNlcnZlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHsNCiAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUoZWxlbWVudCwgdGhpcy5vcHRpb25zKTsNCiAgfTsNCiAgb2JzZXJ2ZXJXcmFwcGVyLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbiAoKSB7DQogICAgdGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KCk7DQogIH07DQogIHJldHVybiBvYnNlcnZlcldyYXBwZXI7DQp9DQoNCg0KCjsvLyBDT05DQVRFTkFURUQgTU9EVUxFOiAuL0V4dGVuc2lvbnMvY29tYmluZWQvcG9wdXAuanMKDQoNCi8qICAgQ29uZmlnICAgKi8NCmNvbnN0IGNvbmZpZyA9IHsNCiAgYWR2YW5jZWQ6IGZhbHNlLA0KICBkaXNhYmxlVm90ZVN1Ym1pc3Npb246IGZhbHNlLA0KICBkaXNhYmxlTG9nZ2luZzogdHJ1ZSwNCiAgY29sb3JlZFRodW1iczogZmFsc2UsDQogIGNvbG9yZWRCYXI6IGZhbHNlLA0KICBjb2xvclRoZW1lOiAiY2xhc3NpYyIsDQogIG51bWJlckRpc3BsYXlGb3JtYXQ6ICJjb21wYWN0U2hvcnQiLA0KICBzaG93VG9vbHRpcFBlcmNlbnRhZ2U6IGZhbHNlLA0KICB0b29sdGlwUGVyY2VudGFnZU1vZGU6ICJkYXNoX2xpa2UiLA0KICBudW1iZXJEaXNwbGF5UmVmb3JtYXRMaWtlczogZmFsc2UsDQogIHNob3dBZHZhbmNlZE1lc3NhZ2U6DQogICAgJzxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNCAyNCIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNHB4IiBmaWxsPSJjdXJyZW50Q29sb3IiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iMjQiIHdpZHRoPSIyNCIvPjxwYXRoIGQ9Ik0xOS41LDEyYzAtMC4yMy0wLjAxLTAuNDUtMC4wMy0wLjY4bDEuODYtMS40MWMwLjQtMC4zLDAuNTEtMC44NiwwLjI2LTEuM2wtMS44Ny0zLjIzYy0wLjI1LTAuNDQtMC43OS0wLjYyLTEuMjUtMC40MiBsLTIuMTUsMC45MWMtMC4zNy0wLjI2LTAuNzYtMC40OS0xLjE3LTAuNjhsLTAuMjktMi4zMUMxNC44LDIuMzgsMTQuMzcsMiwxMy44NywyaC0zLjczQzkuNjMsMiw5LjIsMi4zOCw5LjE0LDIuODhMOC44NSw1LjE5IGMtMC40MSwwLjE5LTAuOCwwLjQyLTEuMTcsMC42OEw1LjUzLDQuOTZjLTAuNDYtMC4yLTEtMC4wMi0xLjI1LDAuNDJMMi40MSw4LjYyYy0wLjI1LDAuNDQtMC4xNCwwLjk5LDAuMjYsMS4zbDEuODYsMS40MSBDNC41MSwxMS41NSw0LjUsMTEuNzcsNC41LDEyczAuMDEsMC40NSwwLjAzLDAuNjhsLTEuODYsMS40MWMtMC40LDAuMy0wLjUxLDAuODYtMC4yNiwxLjNsMS44NywzLjIzYzAuMjUsMC40NCwwLjc5LDAuNjIsMS4yNSwwLjQyIGwyLjE1LTAuOTFjMC4zNywwLjI2LDAuNzYsMC40OSwxLjE3LDAuNjhsMC4yOSwyLjMxQzkuMiwyMS42Miw5LjYzLDIyLDEwLjEzLDIyaDMuNzNjMC41LDAsMC45My0wLjM4LDAuOTktMC44OGwwLjI5LTIuMzEgYzAuNDEtMC4xOSwwLjgtMC40MiwxLjE3LTAuNjhsMi4xNSwwLjkxYzAuNDYsMC4yLDEsMC4wMiwxLjI1LTAuNDJsMS44Ny0zLjIzYzAuMjUtMC40NCwwLjE0LTAuOTktMC4yNi0xLjNsLTEuODYtMS40MSBDMTkuNDksMTIuNDUsMTkuNSwxMi4yMywxOS41LDEyeiBNMTIuMDQsMTUuNWMtMS45MywwLTMuNS0xLjU3LTMuNS0zLjVzMS41Ny0zLjUsMy41LTMuNXMzLjUsMS41NywzLjUsMy41UzEzLjk3LDE1LjUsMTIuMDQsMTUuNXoiLz48L3N2Zz4nLA0KICBoaWRlQWR2YW5jZWRNZXNzYWdlOg0KICAgICc8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSIyNHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNHB4IiBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMFYweiIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iLjg3Ii8+PHBhdGggZD0iTTEyIDJDNi40NyAyIDIgNi40NyAyIDEyczQuNDcgMTAgMTAgMTAgMTAtNC40NyAxMC0xMFMxNy41MyAyIDEyIDJ6bTQuMyAxNC4zYy0uMzkuMzktMS4wMi4zOS0xLjQxIDBMMTIgMTMuNDEgOS4xMSAxNi4zYy0uMzkuMzktMS4wMi4zOS0xLjQxIDAtLjM5LS4zOS0uMzktMS4wMiAwLTEuNDFMMTAuNTkgMTIgNy43IDkuMTFjLS4zOS0uMzktLjM5LTEuMDIgMC0xLjQxLjM5LS4zOSAxLjAyLS4zOSAxLjQxIDBMMTIgMTAuNTlsMi44OS0yLjg5Yy4zOS0uMzkgMS4wMi0uMzkgMS40MSAwIC4zOS4zOS4zOSAxLjAyIDAgMS40MUwxMy40MSAxMmwyLjg5IDIuODljLjM4LjM4LjM4IDEuMDIgMCAxLjQxeiIvPjwvc3ZnPicsDQogIGxpbmtzOiB7DQogICAgd2Vic2l0ZTogImh0dHBzOi8vcmV0dXJueW91dHViZWRpc2xpa2UuY29tIiwNCiAgICBnaXRodWI6ICJodHRwczovL2dpdGh1Yi5jb20vQW5hcmlvcy9yZXR1cm4teW91dHViZS1kaXNsaWtlIiwNCiAgICBkaXNjb3JkOiAiaHR0cHM6Ly9kaXNjb3JkLmdnL21ZbkVTWTRNZDUiLA0KICAgIGRvbmF0ZTogImh0dHBzOi8vcmV0dXJueW91dHViZWRpc2xpa2UuY29tL2RvbmF0ZSIsDQogICAgZmFxOiAiaHR0cHM6Ly9yZXR1cm55b3V0dWJlZGlzbGlrZS5jb20vZmFxIiwNCiAgICBoZWxwOiAiaHR0cHM6Ly9yZXR1cm55b3V0dWJlZGlzbGlrZS5jb20vaGVscCIsDQogICAgY2hhbmdlbG9nOiAiL2NoYW5nZWxvZy8zL2NoYW5nZWxvZ18zLjAuaHRtbCIsDQogIH0sDQp9Ow0KDQovKiAgIENoYW5nZSBsYW5ndWFnZSAgICovDQpmdW5jdGlvbiBsb2NhbGl6ZUh0bWxQYWdlKCkgew0KICAvL0xvY2FsaXplIGJ5IHJlcGxhY2luZyBfX01TR18qKipfXyBtZXRhIHRhZ3MNCiAgdmFyIG9iamVjdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgiaHRtbCIpOw0KICBmb3IgKHZhciBqID0gMDsgaiA8IG9iamVjdHMubGVuZ3RoOyBqKyspIHsNCiAgICB2YXIgb2JqID0gb2JqZWN0c1tqXTsNCg0KICAgIHZhciB2YWxTdHJIID0gb2JqLmlubmVySFRNTC50b1N0cmluZygpOw0KICAgIHZhciB2YWxOZXdIID0gdmFsU3RySC5yZXBsYWNlKC9fX01TR18oXHcrKV9fL2csIGZ1bmN0aW9uIChtYXRjaCwgdjEpIHsNCiAgICAgIHJldHVybiB2MSA/IGNocm9tZS5pMThuLmdldE1lc3NhZ2UodjEpIDogIiI7DQogICAgfSk7DQoNCiAgICBpZiAodmFsTmV3SCAhPSB2YWxTdHJIKSB7DQogICAgICBvYmouaW5uZXJIVE1MID0gdmFsTmV3SDsNCiAgICB9DQogIH0NCn0NCg0KbG9jYWxpemVIdG1sUGFnZSgpOw0KDQovKiAgIExpbmtzICAgKi8NCmNyZWF0ZUxpbmsoY29uZmlnLmxpbmtzLndlYnNpdGUsICJsaW5rX3dlYnNpdGUiKTsNCmNyZWF0ZUxpbmsoY29uZmlnLmxpbmtzLmdpdGh1YiwgImxpbmtfZ2l0aHViIik7DQpjcmVhdGVMaW5rKGNvbmZpZy5saW5rcy5kaXNjb3JkLCAibGlua19kaXNjb3JkIik7DQpjcmVhdGVMaW5rKGNvbmZpZy5saW5rcy5mYXEsICJsaW5rX2ZhcSIpOw0KY3JlYXRlTGluayhjb25maWcubGlua3MuZG9uYXRlLCAibGlua19kb25hdGUiKTsNCmNyZWF0ZUxpbmsoY29uZmlnLmxpbmtzLmhlbHAsICJsaW5rX2hlbHAiKTsNCmNyZWF0ZUxpbmsoY29uZmlnLmxpbmtzLmNoYW5nZWxvZywgImxpbmtfY2hhbmdlbG9nIik7DQoNCmZ1bmN0aW9uIGNyZWF0ZUxpbmsodXJsLCBpZCkgew0KICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCAoKSA9PiB7DQogICAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiB1cmwgfSk7DQogIH0pOw0KfQ0KDQpkb2N1bWVudA0KICAuZ2V0RWxlbWVudEJ5SWQoImRpc2FibGVfdm90ZV9zdWJtaXNzaW9uIikNCiAgLmFkZEV2ZW50TGlzdGVuZXIoImNsaWNrIiwgKGV2KSA9PiB7DQogICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBkaXNhYmxlVm90ZVN1Ym1pc3Npb246IGV2LnRhcmdldC5jaGVja2VkIH0pOw0KICB9KTsNCg0KZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImRpc2FibGVfbG9nZ2luZyIpLmFkZEV2ZW50TGlzdGVuZXIoImNsaWNrIiwgKGV2KSA9PiB7DQogIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgZGlzYWJsZUxvZ2dpbmc6ZXYudGFyZ2V0LmNoZWNrZWQgfSkNCn0pOw0KDQpkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29sb3JlZF90aHVtYnMiKS5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsIChldikgPT4gew0KICBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IGNvbG9yZWRUaHVtYnM6IGV2LnRhcmdldC5jaGVja2VkIH0pOw0KfSk7DQoNCmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJjb2xvcmVkX2JhciIpLmFkZEV2ZW50TGlzdGVuZXIoImNsaWNrIiwgKGV2KSA9PiB7DQogIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgY29sb3JlZEJhcjogZXYudGFyZ2V0LmNoZWNrZWQgfSk7DQp9KTsNCg0KZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImNvbG9yX3RoZW1lIikuYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCAoZXYpID0+IHsNCiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBjb2xvclRoZW1lOiBldi50YXJnZXQudmFsdWUgfSk7DQp9KTsNCg0KZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIm51bWJlcl9mb3JtYXQiKS5hZGRFdmVudExpc3RlbmVyKCJjaGFuZ2UiLCAoZXYpID0+IHsNCiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBudW1iZXJEaXNwbGF5Rm9ybWF0OiBldi50YXJnZXQudmFsdWUgfSk7DQp9KTsNCg0KZG9jdW1lbnQNCiAgLmdldEVsZW1lbnRCeUlkKCJzaG93X3Rvb2x0aXBfcGVyY2VudGFnZSIpDQogIC5hZGRFdmVudExpc3RlbmVyKCJjbGljayIsIChldikgPT4gew0KICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgc2hvd1Rvb2x0aXBQZXJjZW50YWdlOiBldi50YXJnZXQuY2hlY2tlZCB9KTsNCiAgfSk7DQoNCmRvY3VtZW50DQogIC5nZXRFbGVtZW50QnlJZCgidG9vbHRpcF9wZXJjZW50YWdlX21vZGUiKQ0KICAuYWRkRXZlbnRMaXN0ZW5lcigiY2hhbmdlIiwgKGV2KSA9PiB7DQogICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyB0b29sdGlwUGVyY2VudGFnZU1vZGU6IGV2LnRhcmdldC52YWx1ZSB9KTsNCiAgfSk7DQoNCmRvY3VtZW50DQogIC5nZXRFbGVtZW50QnlJZCgibnVtYmVyX3JlZm9ybWF0X2xpa2VzIikNCiAgLmFkZEV2ZW50TGlzdGVuZXIoImNsaWNrIiwgKGV2KSA9PiB7DQogICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBudW1iZXJEaXNwbGF5UmVmb3JtYXRMaWtlczogZXYudGFyZ2V0LmNoZWNrZWQgfSk7DQogIH0pOw0KDQovKiAgIEFkdmFuY2VkIFRvZ2dsZSAgICovDQpjb25zdCBhZHZhbmNlZFRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJhZHZhbmNlZFRvZ2dsZSIpOw0KYWR2YW5jZWRUb2dnbGUuYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCAoKSA9PiB7DQogIGNvbnN0IGFkdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJhZHZhbmNlZFNldHRpbmdzIik7DQogIGlmIChjb25maWcuYWR2YW5jZWQpIHsNCiAgICBhZHYuc3R5bGUudHJhbnNmb3JtID0gInNjYWxlKDEuMSkiOw0KICAgIGFkdi5zdHlsZS5wb2ludGVyRXZlbnRzID0gIm5vbmUiOw0KICAgIGFkdi5zdHlsZS5vcGFjaXR5ID0gIjAiOw0KICAgIGFkdmFuY2VkVG9nZ2xlLmlubmVySFRNTCA9IGNvbmZpZy5zaG93QWR2YW5jZWRNZXNzYWdlOw0KICB9IGVsc2Ugew0KICAgIGFkdi5zdHlsZS50cmFuc2Zvcm0gPSAic2NhbGUoMSkiOw0KICAgIGFkdi5zdHlsZS5wb2ludGVyRXZlbnRzID0gImF1dG8iOw0KICAgIGFkdi5zdHlsZS5vcGFjaXR5ID0gIjEiOw0KICAgIGFkdmFuY2VkVG9nZ2xlLmlubmVySFRNTCA9IGNvbmZpZy5oaWRlQWR2YW5jZWRNZXNzYWdlOw0KICB9DQogIGNvbmZpZy5hZHZhbmNlZCA9ICFjb25maWcuYWR2YW5jZWQ7DQp9KTsNCg0KaW5pdENvbmZpZygpOw0KDQpmdW5jdGlvbiBpbml0Q29uZmlnKCkgew0KICBwb3B1cF9pbml0aWFsaXplRGlzYWJsZVZvdGVTdWJtaXNzaW9uKCk7DQogIHBvcHVwX2luaXRpYWxpemVEaXNhYmxlTG9nZ2luZygpOw0KICBpbml0aWFsaXplVmVyc2lvbk51bWJlcigpOw0KICBwb3B1cF9pbml0aWFsaXplQ29sb3JlZFRodW1icygpOw0KICBwb3B1cF9pbml0aWFsaXplQ29sb3JlZEJhcigpOw0KICBwb3B1cF9pbml0aWFsaXplQ29sb3JUaGVtZSgpOw0KICBwb3B1cF9pbml0aWFsaXplTnVtYmVyRGlzcGxheUZvcm1hdCgpOw0KICBwb3B1cF9pbml0aWFsaXplVG9vbHRpcFBlcmNlbnRhZ2UoKTsNCiAgcG9wdXBfaW5pdGlhbGl6ZVRvb2x0aXBQZXJjZW50YWdlTW9kZSgpOw0KICBwb3B1cF9pbml0aWFsaXplTnVtYmVyRGlzcGxheVJlZm9ybWF0TGlrZXMoKTsNCn0NCg0KZnVuY3Rpb24gaW5pdGlhbGl6ZVZlcnNpb25OdW1iZXIoKSB7DQogIGNvbnN0IHZlcnNpb24gPSBjaHJvbWUucnVudGltZS5nZXRNYW5pZmVzdCgpLnZlcnNpb247DQogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJleHQtdmVyc2lvbiIpLmlubmVySFRNTCA9ICJ2IiArIHZlcnNpb247DQoNCiAgZmV0Y2goDQogICAgImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9BbmFyaW9zL3JldHVybi15b3V0dWJlLWRpc2xpa2UvbWFpbi9FeHRlbnNpb25zL2NvbWJpbmVkL21hbmlmZXN0LWNocm9tZS5qc29uIiwNCiAgKQ0KICAgIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UuanNvbigpKQ0KICAgIC50aGVuKChqc29uKSA9PiB7DQogICAgICBpZiAoY29tcGFyZVZlcnNpb25zKGpzb24udmVyc2lvbiwgdmVyc2lvbikpIHsNCiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImV4dC11cGRhdGUiKS5pbm5lckhUTUwgPQ0KICAgICAgICAgIGNocm9tZS5pMThuLmdldE1lc3NhZ2UoInRleHRVcGRhdGUiKSArICIgdiIgKyBqc29uLnZlcnNpb247DQogICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJleHQtdXBkYXRlIikuc3R5bGUucGFkZGluZyA9ICIuMjVyZW0gLjVyZW0iOw0KICAgICAgfQ0KICAgIH0pOw0KICAvLyAuY2F0Y2goY29uc29sZS5lcnJvcik7DQp9DQoNCi8vIHJldHVybnMgd2hldGhlciBjdXJyZW50IDwgbGF0ZXN0DQpmdW5jdGlvbiBjb21wYXJlVmVyc2lvbnMobGF0ZXN0U3RyLCBjdXJyZW50U3RyKSB7DQogIGxldCBsYXRlc3RhcnIgPSBsYXRlc3RTdHIuc3BsaXQoIi4iKTsNCiAgbGV0IGN1cnJlbnRhcnIgPSBjdXJyZW50U3RyLnNwbGl0KCIuIik7DQogIGxldCBvdXRkYXRlZCA9IGZhbHNlOw0KICAvLyBnb2VzIHRocm91Z2ggdmVyc2lvbiBudW1iZXJzIGZyb20gbGVmdCB0byByaWdodCBmcm9tIGdyZWF0ZXN0IHRvIGxlYXN0IHNpZ25pZmljYW50DQogIGZvciAobGV0IGkgPSAwOyBpIDwgTWF0aC5tYXgobGF0ZXN0YXJyLmxlbmd0aCwgY3VycmVudGFyci5sZW5ndGgpOyBpKyspIHsNCiAgICBsZXQgbGF0ZXN0ID0gaSA8IGxhdGVzdGFyci5sZW5ndGggPyBwYXJzZUludChsYXRlc3RhcnJbaV0pIDogMDsNCiAgICBsZXQgY3VycmVudCA9IGkgPCBjdXJyZW50YXJyLmxlbmd0aCA/IHBhcnNlSW50KGN1cnJlbnRhcnJbaV0pIDogMDsNCiAgICBpZiAobGF0ZXN0ID4gY3VycmVudCkgew0KICAgICAgb3V0ZGF0ZWQgPSB0cnVlOw0KICAgICAgYnJlYWs7DQogICAgfSBlbHNlIGlmIChsYXRlc3QgPCBjdXJyZW50KSB7DQogICAgICBvdXRkYXRlZCA9IGZhbHNlOw0KICAgICAgYnJlYWs7DQogICAgfQ0KICB9DQogIHJldHVybiBvdXRkYXRlZDsNCn0NCg0KZnVuY3Rpb24gcG9wdXBfaW5pdGlhbGl6ZURpc2FibGVWb3RlU3VibWlzc2lvbigpIHsNCiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWyJkaXNhYmxlVm90ZVN1Ym1pc3Npb24iXSwgKHJlcykgPT4gew0KICAgIGhhbmRsZURpc2FibGVWb3RlU3VibWlzc2lvbkNoYW5nZUV2ZW50KHJlcy5kaXNhYmxlVm90ZVN1Ym1pc3Npb24pOw0KICB9KTsNCn0NCg0KZnVuY3Rpb24gcG9wdXBfaW5pdGlhbGl6ZURpc2FibGVMb2dnaW5nKCl7DQogIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFsnZGlzYWJsZUxvZ2dpbmcnXSwgKHJlcykgPT4gew0KICAgIGhhbmRsZURpc2FibGVMb2dnaW5nQ2hhbmdlRXZlbnQocmVzLmRpc2FibGVMb2dnaW5nKTsNCiAgfSk7DQp9DQoNCmZ1bmN0aW9uIHBvcHVwX2luaXRpYWxpemVDb2xvcmVkVGh1bWJzKCkgew0KICBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChbImNvbG9yZWRUaHVtYnMiXSwgKHJlcykgPT4gew0KICAgIGhhbmRsZUNvbG9yZWRUaHVtYnNDaGFuZ2VFdmVudChyZXMuY29sb3JlZFRodW1icyk7DQogIH0pOw0KfQ0KDQpmdW5jdGlvbiBwb3B1cF9pbml0aWFsaXplQ29sb3JlZEJhcigpIHsNCiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWyJjb2xvcmVkQmFyIl0sIChyZXMpID0+IHsNCiAgICBoYW5kbGVDb2xvcmVkQmFyQ2hhbmdlRXZlbnQocmVzLmNvbG9yZWRCYXIpOw0KICB9KTsNCn0NCg0KZnVuY3Rpb24gcG9wdXBfaW5pdGlhbGl6ZUNvbG9yVGhlbWUoKSB7DQogIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFsiY29sb3JUaGVtZSJdLCAocmVzKSA9PiB7DQogICAgaGFuZGxlQ29sb3JUaGVtZUNoYW5nZUV2ZW50KHJlcy5jb2xvclRoZW1lKTsNCiAgfSk7DQp9DQoNCmZ1bmN0aW9uIHBvcHVwX2luaXRpYWxpemVUb29sdGlwUGVyY2VudGFnZSgpIHsNCiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWyJzaG93VG9vbHRpcFBlcmNlbnRhZ2UiXSwgKHJlcykgPT4gew0KICAgIGhhbmRsZVNob3dUb29sdGlwUGVyY2VudGFnZUNoYW5nZUV2ZW50KHJlcy5zaG93VG9vbHRpcFBlcmNlbnRhZ2UpOw0KICB9KTsNCn0NCg0KZnVuY3Rpb24gcG9wdXBfaW5pdGlhbGl6ZVRvb2x0aXBQZXJjZW50YWdlTW9kZSgpIHsNCiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWyJ0b29sdGlwUGVyY2VudGFnZU1vZGUiXSwgKHJlcykgPT4gew0KICAgIGhhbmRsZVRvb2x0aXBQZXJjZW50YWdlTW9kZUNoYW5nZUV2ZW50KHJlcy50b29sdGlwUGVyY2VudGFnZU1vZGUpOw0KICB9KTsNCn0NCg0KZnVuY3Rpb24gcG9wdXBfaW5pdGlhbGl6ZU51bWJlckRpc3BsYXlGb3JtYXQoKSB7DQogIGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFsibnVtYmVyRGlzcGxheUZvcm1hdCJdLCAocmVzKSA9PiB7DQogICAgaGFuZGxlTnVtYmVyRGlzcGxheUZvcm1hdENoYW5nZUV2ZW50KHJlcy5udW1iZXJEaXNwbGF5Rm9ybWF0KTsNCiAgfSk7DQogIHVwZGF0ZU51bWJlckRpc3BsYXlGb3JtYXRDb250ZW50KCk7DQp9DQoNCmZ1bmN0aW9uIHVwZGF0ZU51bWJlckRpc3BsYXlGb3JtYXRDb250ZW50KCkgew0KICBsZXQgdGVzdFZhbHVlID0gMTIzNDU2Ow0KICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgibnVtYmVyX2Zvcm1hdF9jb21wYWN0U2hvcnQiKS5pbm5lckhUTUwgPQ0KICAgIHBvcHVwX2dldE51bWJlckZvcm1hdHRlcigiY29tcGFjdFNob3J0IikuZm9ybWF0KHRlc3RWYWx1ZSk7DQogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJudW1iZXJfZm9ybWF0X2NvbXBhY3RMb25nIikuaW5uZXJIVE1MID0NCiAgICBwb3B1cF9nZXROdW1iZXJGb3JtYXR0ZXIoImNvbXBhY3RMb25nIikuZm9ybWF0KHRlc3RWYWx1ZSk7DQogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJudW1iZXJfZm9ybWF0X3N0YW5kYXJkIikuaW5uZXJIVE1MID0NCiAgICBwb3B1cF9nZXROdW1iZXJGb3JtYXR0ZXIoInN0YW5kYXJkIikuZm9ybWF0KHRlc3RWYWx1ZSk7DQp9DQoNCmZ1bmN0aW9uIHBvcHVwX2luaXRpYWxpemVOdW1iZXJEaXNwbGF5UmVmb3JtYXRMaWtlcygpIHsNCiAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWyJudW1iZXJEaXNwbGF5UmVmb3JtYXRMaWtlcyJdLCAocmVzKSA9PiB7DQogICAgaGFuZGxlTnVtYmVyRGlzcGxheVJlZm9ybWF0TGlrZXNDaGFuZ2VFdmVudChyZXMubnVtYmVyRGlzcGxheVJlZm9ybWF0TGlrZXMpOw0KICB9KTsNCn0NCg0KY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKHN0b3JhZ2VDaGFuZ2VIYW5kbGVyKTsNCg0KZnVuY3Rpb24gc3RvcmFnZUNoYW5nZUhhbmRsZXIoY2hhbmdlcywgYXJlYSkgew0KICBpZiAoY2hhbmdlcy5kaXNhYmxlVm90ZVN1Ym1pc3Npb24gIT09IHVuZGVmaW5lZCkgew0KICAgIGhhbmRsZURpc2FibGVWb3RlU3VibWlzc2lvbkNoYW5nZUV2ZW50KA0KICAgICAgY2hhbmdlcy5kaXNhYmxlVm90ZVN1Ym1pc3Npb24ubmV3VmFsdWUsDQogICAgKTsNCiAgfQ0KICBpZiAoY2hhbmdlcy5kaXNhYmxlTG9nZ2luZyAhPT0gdW5kZWZpbmVkKSB7DQogICAgaGFuZGxlRGlzYWJsZUxvZ2dpbmdDaGFuZ2VFdmVudChjaGFuZ2VzLmRpc2FibGVMb2dnaW5nLm5ld1ZhbHVlKTsNCiAgfQ0KICBpZiAoY2hhbmdlcy5jb2xvcmVkVGh1bWJzICE9PSB1bmRlZmluZWQpIHsNCiAgICBoYW5kbGVDb2xvcmVkVGh1bWJzQ2hhbmdlRXZlbnQoY2hhbmdlcy5jb2xvcmVkVGh1bWJzLm5ld1ZhbHVlKTsNCiAgfQ0KICBpZiAoY2hhbmdlcy5jb2xvcmVkQmFyICE9PSB1bmRlZmluZWQpIHsNCiAgICBoYW5kbGVDb2xvcmVkQmFyQ2hhbmdlRXZlbnQoY2hhbmdlcy5jb2xvcmVkQmFyLm5ld1ZhbHVlKTsNCiAgfQ0KICBpZiAoY2hhbmdlcy5jb2xvclRoZW1lICE9PSB1bmRlZmluZWQpIHsNCiAgICBoYW5kbGVDb2xvclRoZW1lQ2hhbmdlRXZlbnQoY2hhbmdlcy5jb2xvclRoZW1lLm5ld1ZhbHVlKTsNCiAgfQ0KICBpZiAoY2hhbmdlcy5udW1iZXJEaXNwbGF5Rm9ybWF0ICE9PSB1bmRlZmluZWQpIHsNCiAgICBoYW5kbGVOdW1iZXJEaXNwbGF5Rm9ybWF0Q2hhbmdlRXZlbnQoY2hhbmdlcy5udW1iZXJEaXNwbGF5Rm9ybWF0Lm5ld1ZhbHVlKTsNCiAgfQ0KICBpZiAoY2hhbmdlcy5zaG93VG9vbHRpcFBlcmNlbnRhZ2UgIT09IHVuZGVmaW5lZCkgew0KICAgIGhhbmRsZVNob3dUb29sdGlwUGVyY2VudGFnZUNoYW5nZUV2ZW50KA0KICAgICAgY2hhbmdlcy5zaG93VG9vbHRpcFBlcmNlbnRhZ2UubmV3VmFsdWUsDQogICAgKTsNCiAgfQ0KICBpZiAoY2hhbmdlcy5udW1iZXJEaXNwbGF5UmVmb3JtYXRMaWtlcyAhPT0gdW5kZWZpbmVkKSB7DQogICAgaGFuZGxlTnVtYmVyRGlzcGxheVJlZm9ybWF0TGlrZXNDaGFuZ2VFdmVudCgNCiAgICAgIGNoYW5nZXMubnVtYmVyRGlzcGxheVJlZm9ybWF0TGlrZXMubmV3VmFsdWUsDQogICAgKTsNCiAgfQ0KfQ0KDQpmdW5jdGlvbiBoYW5kbGVEaXNhYmxlVm90ZVN1Ym1pc3Npb25DaGFuZ2VFdmVudCh2YWx1ZSkgew0KICBjb25maWcuZGlzYWJsZVZvdGVTdWJtaXNzaW9uID0gdmFsdWU7DQogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJkaXNhYmxlX3ZvdGVfc3VibWlzc2lvbiIpLmNoZWNrZWQgPSB2YWx1ZTsNCn0NCg0KZnVuY3Rpb24gaGFuZGxlRGlzYWJsZUxvZ2dpbmdDaGFuZ2VFdmVudCh2YWx1ZSkgew0KICBjb25maWcuZGlzYWJsZUxvZ2dpbmcgPSB2YWx1ZTsNCiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImRpc2FibGVfbG9nZ2luZyIpLmNoZWNrZWQgPSB2YWx1ZTsNCn0NCg0KZnVuY3Rpb24gaGFuZGxlQ29sb3JlZFRodW1ic0NoYW5nZUV2ZW50KHZhbHVlKSB7DQogIGNvbmZpZy5jb2xvcmVkVGh1bWJzID0gdmFsdWU7DQogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJjb2xvcmVkX3RodW1icyIpLmNoZWNrZWQgPSB2YWx1ZTsNCn0NCg0KZnVuY3Rpb24gaGFuZGxlQ29sb3JlZEJhckNoYW5nZUV2ZW50KHZhbHVlKSB7DQogIGNvbmZpZy5jb2xvcmVkQmFyID0gdmFsdWU7DQogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJjb2xvcmVkX2JhciIpLmNoZWNrZWQgPSB2YWx1ZTsNCn0NCg0KZnVuY3Rpb24gaGFuZGxlQ29sb3JUaGVtZUNoYW5nZUV2ZW50KHZhbHVlKSB7DQogIGlmICghdmFsdWUpIHsNCiAgICB2YWx1ZSA9ICJjbGFzc2ljIjsNCiAgfQ0KICBjb25maWcuY29sb3JUaGVtZSA9IHZhbHVlOw0KICBkb2N1bWVudA0KICAgIC5nZXRFbGVtZW50QnlJZCgiY29sb3JfdGhlbWUiKQ0KICAgIC5xdWVyeVNlbGVjdG9yKCdvcHRpb25bdmFsdWU9IicgKyB2YWx1ZSArICciXScpLnNlbGVjdGVkID0gdHJ1ZTsNCiAgdXBkYXRlQ29sb3JUaGVtZVByZXZpZXdDb250ZW50KHZhbHVlKTsNCn0NCg0KZnVuY3Rpb24gdXBkYXRlQ29sb3JUaGVtZVByZXZpZXdDb250ZW50KHRoZW1lTmFtZSkgew0KICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29sb3JfdGhlbWVfZXhhbXBsZV9saWtlIikuc3R5bGUuYmFja2dyb3VuZENvbG9yID0NCiAgICBwb3B1cF9nZXRDb2xvckZyb21UaGVtZSh0aGVtZU5hbWUsIHRydWUpOw0KICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiY29sb3JfdGhlbWVfZXhhbXBsZV9kaXNsaWtlIikuc3R5bGUuYmFja2dyb3VuZENvbG9yID0NCiAgICBwb3B1cF9nZXRDb2xvckZyb21UaGVtZSh0aGVtZU5hbWUsIGZhbHNlKTsNCn0NCg0KZnVuY3Rpb24gaGFuZGxlTnVtYmVyRGlzcGxheUZvcm1hdENoYW5nZUV2ZW50KHZhbHVlKSB7DQogIGNvbmZpZy5udW1iZXJEaXNwbGF5Rm9ybWF0ID0gdmFsdWU7DQogIGRvY3VtZW50DQogICAgLmdldEVsZW1lbnRCeUlkKCJudW1iZXJfZm9ybWF0IikNCiAgICAucXVlcnlTZWxlY3Rvcignb3B0aW9uW3ZhbHVlPSInICsgdmFsdWUgKyAnIl0nKS5zZWxlY3RlZCA9IHRydWU7DQp9DQoNCmZ1bmN0aW9uIGhhbmRsZVNob3dUb29sdGlwUGVyY2VudGFnZUNoYW5nZUV2ZW50KHZhbHVlKSB7DQogIGNvbmZpZy5zaG93VG9vbHRpcFBlcmNlbnRhZ2UgPSB2YWx1ZTsNCiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInNob3dfdG9vbHRpcF9wZXJjZW50YWdlIikuY2hlY2tlZCA9IHZhbHVlOw0KfQ0KDQpmdW5jdGlvbiBoYW5kbGVUb29sdGlwUGVyY2VudGFnZU1vZGVDaGFuZ2VFdmVudCh2YWx1ZSkgew0KICBpZiAoIXZhbHVlKSB7DQogICAgdmFsdWUgPSAiZGFzaF9saWtlIjsNCiAgfQ0KICBjb25maWcudG9vbHRpcFBlcmNlbnRhZ2VNb2RlID0gdmFsdWU7DQoNCiAgZG9jdW1lbnQNCiAgICAuZ2V0RWxlbWVudEJ5SWQoInRvb2x0aXBfcGVyY2VudGFnZV9tb2RlIikNCiAgICAucXVlcnlTZWxlY3Rvcignb3B0aW9uW3ZhbHVlPSInICsgdmFsdWUgKyAnIl0nKS5zZWxlY3RlZCA9IHRydWU7DQp9DQoNCmZ1bmN0aW9uIGhhbmRsZU51bWJlckRpc3BsYXlSZWZvcm1hdExpa2VzQ2hhbmdlRXZlbnQodmFsdWUpIHsNCiAgY29uZmlnLm51bWJlckRpc3BsYXlSZWZvcm1hdExpa2VzID0gdmFsdWU7DQogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJudW1iZXJfcmVmb3JtYXRfbGlrZXMiKS5jaGVja2VkID0gdmFsdWU7DQp9DQoNCmZ1bmN0aW9uIHBvcHVwX2dldE51bWJlckZvcm1hdHRlcihvcHRpb25TZWxlY3QpIHsNCiAgbGV0IGZvcm1hdHRlck5vdGF0aW9uOw0KICBsZXQgZm9ybWF0dGVyQ29tcGFjdERpc3BsYXk7DQogIGxldCB1c2VyTG9jYWxlczsNCiAgdHJ5IHsNCiAgICB1c2VyTG9jYWxlcyA9IG5ldyBVUkwoDQogICAgICBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoImhlYWQgPiBsaW5rW3JlbD0nc2VhcmNoJ10iKSkNCiAgICAgICAgPy5maW5kKChuKSA9PiBuPy5nZXRBdHRyaWJ1dGUoImhyZWYiKT8uaW5jbHVkZXMoIj9sb2NhbGU9IikpDQogICAgICAgID8uZ2V0QXR0cmlidXRlKCJocmVmIiksDQogICAgKT8uc2VhcmNoUGFyYW1zPy5nZXQoImxvY2FsZSIpOw0KICB9IGNhdGNoIHt9DQoNCiAgc3dpdGNoIChvcHRpb25TZWxlY3QpIHsNCiAgICBjYXNlICJjb21wYWN0TG9uZyI6DQogICAgICBmb3JtYXR0ZXJOb3RhdGlvbiA9ICJjb21wYWN0IjsNCiAgICAgIGZvcm1hdHRlckNvbXBhY3REaXNwbGF5ID0gImxvbmciOw0KICAgICAgYnJlYWs7DQogICAgY2FzZSAic3RhbmRhcmQiOg0KICAgICAgZm9ybWF0dGVyTm90YXRpb24gPSAic3RhbmRhcmQiOw0KICAgICAgZm9ybWF0dGVyQ29tcGFjdERpc3BsYXkgPSAic2hvcnQiOw0KICAgICAgYnJlYWs7DQogICAgY2FzZSAiY29tcGFjdFNob3J0IjoNCiAgICBkZWZhdWx0Og0KICAgICAgZm9ybWF0dGVyTm90YXRpb24gPSAiY29tcGFjdCI7DQogICAgICBmb3JtYXR0ZXJDb21wYWN0RGlzcGxheSA9ICJzaG9ydCI7DQogIH0NCiAgY29uc3QgZm9ybWF0dGVyID0gSW50bC5OdW1iZXJGb3JtYXQoDQogICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmxhbmcgfHwgdXNlckxvY2FsZXMgfHwgbmF2aWdhdG9yLmxhbmd1YWdlLA0KICAgIHsNCiAgICAgIG5vdGF0aW9uOiBmb3JtYXR0ZXJOb3RhdGlvbiwNCiAgICAgIGNvbXBhY3REaXNwbGF5OiBmb3JtYXR0ZXJDb21wYWN0RGlzcGxheSwNCiAgICB9LA0KICApOw0KICByZXR1cm4gZm9ybWF0dGVyOw0KfQ0KDQooYXN5bmMgZnVuY3Rpb24gZ2V0U3RhdHVzKCkgew0KICBsZXQgc3RhdHVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInN0YXR1cyIpOw0KICBsZXQgc2VydmVyU3RhdHVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInNlcnZlci1zdGF0dXMiKTsNCiAgbGV0IHJlc3AgPSBhd2FpdCBmZXRjaCgNCiAgICAiaHR0cHM6Ly9yZXR1cm55b3V0dWJlZGlzbGlrZWFwaS5jb20vdm90ZXM/dmlkZW9JZD1ZYkpPVGRaQlgxZyIsDQogICk7DQogIGxldCByZXN1bHQgPSBhd2FpdCByZXNwLnN0YXR1czsNCiAgaWYgKHJlc3VsdCA9PT0gMjAwKSB7DQogICAgc3RhdHVzLmlubmVyVGV4dCA9ICJPbmxpbmUiOw0KICAgIHN0YXR1cy5zdHlsZS5jb2xvciA9ICJncmVlbiI7DQogICAgc2VydmVyU3RhdHVzLnN0eWxlLmZpbHRlciA9DQogICAgICAiaW52ZXJ0KDU4JSkgc2VwaWEoODElKSBzYXR1cmF0ZSgyNjE4JSkgaHVlLXJvdGF0ZSg4MWRlZykgYnJpZ2h0bmVzcygxMTklKSBjb250cmFzdCgxMjklKSI7DQogIH0gZWxzZSB7DQogICAgc3RhdHVzLmlubmVyVGV4dCA9ICJPZmZsaW5lIjsNCiAgICBzdGF0dXMuc3R5bGUuY29sb3IgPSAicmVkIjsNCiAgICBzZXJ2ZXJTdGF0dXMuc3R5bGUuZmlsdGVyID0NCiAgICAgICJpbnZlcnQoMTElKSBzZXBpYSgxMDAlKSBzYXR1cmF0ZSg2NDQ5JSkgaHVlLXJvdGF0ZSgzZGVnKSBicmlnaHRuZXNzKDExNiUpIGNvbnRyYXN0KDExNSUpIjsNCiAgfQ0KfSkoKTsNCg0KZnVuY3Rpb24gcG9wdXBfZ2V0Q29sb3JGcm9tVGhlbWUoY29sb3JUaGVtZSwgdm90ZUlzTGlrZSkgew0KICBsZXQgY29sb3JTdHJpbmc7DQogIHN3aXRjaCAoY29sb3JUaGVtZSkgew0KICAgIGNhc2UgImFjY2Vzc2libGUiOg0KICAgICAgaWYgKHZvdGVJc0xpa2UgPT09IHRydWUpIHsNCiAgICAgICAgY29sb3JTdHJpbmcgPSAiZG9kZ2VyYmx1ZSI7DQogICAgICB9IGVsc2Ugew0KICAgICAgICBjb2xvclN0cmluZyA9ICJnb2xkIjsNCiAgICAgIH0NCiAgICAgIGJyZWFrOw0KICAgIGNhc2UgIm5lb24iOg0KICAgICAgaWYgKHZvdGVJc0xpa2UgPT09IHRydWUpIHsNCiAgICAgICAgY29sb3JTdHJpbmcgPSAiYXF1YSI7DQogICAgICB9IGVsc2Ugew0KICAgICAgICBjb2xvclN0cmluZyA9ICJtYWdlbnRhIjsNCiAgICAgIH0NCiAgICAgIGJyZWFrOw0KICAgIGNhc2UgImNsYXNzaWMiOg0KICAgIGRlZmF1bHQ6DQogICAgICBpZiAodm90ZUlzTGlrZSA9PT0gdHJ1ZSkgew0KICAgICAgICBjb2xvclN0cmluZyA9ICJsaW1lIjsNCiAgICAgIH0gZWxzZSB7DQogICAgICAgIGNvbG9yU3RyaW5nID0gInJlZCI7DQogICAgICB9DQogIH0NCiAgcmV0dXJuIGNvbG9yU3RyaW5nOw0KfQ0KDQovKiBwb3B1cC1zY3JpcHQuanMNCmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2dpbicpDQouYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7DQogIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgbWVzc2FnZTogJ2dldF9hdXRoX3Rva2VuJyB9KTsNCn0pOw0KDQoNCmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIiNsb2dfb2ZmIikuYWRkRXZlbnRMaXN0ZW5lcigiY2xpY2siLCBmdW5jdGlvbiAoKSB7DQogIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHsgbWVzc2FnZTogImxvZ19vZmYiIH0pOw0KfSk7DQoqLw0KCi8qKioqKiovIH0pKCkKOw==\"></script>\r\n</html>\r\n"
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
		      "return-youtube-dislike",
		      IS_IFRAME ? "iframe" : "page",
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
			      // TODO: Remove origin permission means exclude from origin in startup (when checking for content scripts)
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
			            (match, p1) => substitutions[p1 - 1] || match,
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
			      id: "polyfilled-extension-" + Math.random().toString(36).substring(2, 15),
			      lastError: null,
			      setUninstallURL: () => {},
			      setUpdateURL: () => {},
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
			              callback,
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
			              callback,
			            );
			          }
			          if (details.partitionKey) {
			            _warn(
			              "cookies.getAll: partitionKey is not fully supported in this environment.",
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
			                "cookies.set: partitionKey is not fully supported in this environment.",
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
			            "chrome.cookies.getPartitionKey is not supported in this environment.",
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
			          `chrome.tabs.sendMessage polyfill (to tab ${tabId}) redirects to runtime.sendMessage (current context).`,
			        );
			        return chrome.runtime.sendMessage(message);
			      },
			      onActivated: createNoopListeners(),
			      onUpdated: createNoopListeners(),
			      onRemoved: createNoopListeners(),
			      onReplaced: createNoopListeners(),
			      onCreated: createNoopListeners(),
			      onMoved: createNoopListeners(),
			      onDetached: createNoopListeners(),
			      onAttached: createNoopListeners(),
			    },
			    windows: {
			      onFocusChanged: createNoopListeners(),
			      onCreated: createNoopListeners(),
			      onRemoved: createNoopListeners(),
			      onFocused: createNoopListeners(),
			      onFocus: createNoopListeners(),
			      onBlur: createNoopListeners(),
			      onFocused: createNoopListeners(),
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
			                  `[Notifications] Created notification after permission: ${id}`,
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
			              "[Notifications] Native notifications not supported, using console fallback",
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
			            `[ContextMenus] Created context menu item: ${title} (${menuId})`,
			          );
			
			          // Try to register a menu command as fallback
			          if (typeof _registerMenuCommand === "function") {
			            try {
			              _registerMenuCommand(
			                title,
			                onclick ||
			                  (() => {
			                    _log(`Context menu clicked: ${title}`);
			                  }),
			              );
			            } catch (e) {
			              _warn(
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
			              `[ContextMenus] Context menu item not found for removal: ${menuItemId}`,
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
			        _log(`[${contextType}] [CHROME - ${_key}] Setting ${key} to ${value}`),
			      );
			      return Reflect.set(target, key, value, receiver);
			    },
			    has(target, key) {
			      tc(() =>
			        _log(`[${contextType}] [CHROME - ${_key}] Checking if ${key} exists`),
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
			      const fns = [
			        () => __globalsStorage[key],
			        () => Reflect.get(target, key, target),
			        () => target[key],
			      ];
			      const out = fns
			        .map((f) => {
			          try {
			            let out = f();
			            return out;
			          } catch (e) {
			            return undefined;
			          }
			        })
			        .find((f) => f !== undefined);
			      if (typeof out === "function") {
			        return out.bind(target);
			      }
			      return out;
			    },
			    set(target, key, value, receiver) {
			      try {
			        tc(() => _log(`[${contextType}] Setting ${key} to ${value}`));
			        set(key, value);
			        return Reflect.set(target, key, value, receiver);
			      } catch (e) {
			        _error("Error setting", key, value, e);
			        try {
			          target[key] = value;
			          return true;
			        } catch (e) {
			          _error("Error setting", key, value, e);
			        }
			        return false;
			      }
			    },
			    has(target, key) {
			      try {
			        return key in __globalsStorage || key in target;
			      } catch (e) {
			        _error("Error has", key, e);
			        try {
			          return key in __globalsStorage || key in target;
			        } catch (e) {
			          _error("Error has", key, e);
			        }
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
			    document: oldWindow.document,
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
			
			  __globals.contextId = contextId;
			  __globals.contextType = contextType;
			  __globals.module = undefined;
			  __globals.amd = undefined;
			  __globals.define = undefined;
			  __globals.importScripts = (...args) => {
			    _log("importScripts", args);
			  };
			
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
	  const scriptName = "Return YouTube Dislike";
	  const debug = "[Return YouTube Dislike]";
	  _log(debug + ' Executing background scripts...');
	
	  function executeBackgroundScripts(){
	    with(backgroundPolyfill){
	      // BG: ryd.background.js
	/******/ (() => { // webpackBootstrap
	var __webpack_exports__ = {};
	const apiUrl = "https://returnyoutubedislikeapi.com";
	const voteDisabledIconName = "icon_hold128.png";
	const defaultIconName = "icon128.png";
	let api;
	
	/** stores extension's global config */
	let extConfig = {
	  disableVoteSubmission: false,
	  disableLogging: true,
	  coloredThumbs: false,
	  coloredBar: false,
	  colorTheme: "classic", // classic, accessible, neon
	  numberDisplayFormat: "compactShort", // compactShort, compactLong, standard
	  numberDisplayReformatLikes: false, // use existing (native) likes number
	};
	
	if (isChrome()) api = chrome;
	else if (isFirefox()) api = browser;
	
	initExtConfig();
	
	api.runtime.onMessage.addListener((request, sender, sendResponse) => {
	  if (request.message === "get_auth_token") {
	    chrome.identity.getAuthToken({ interactive: true }, function (token) {
	      console.log(token);
	      chrome.identity.getProfileUserInfo(function (userInfo) {
	        console.log(JSON.stringify(userInfo));
	      });
	    });
	  } else if (request.message === "log_off") {
	    // chrome.identity.clearAllCachedAuthTokens(() => console.log("logged off"));
	  } else if (request.message == "set_state") {
	    // chrome.identity.getAuthToken({ interactive: true }, function (token) {
	    let token = "";
	    fetch(`${apiUrl}/votes?videoId=${request.videoId}&likeCount=${request.likeCount || ""}`, {
	      method: "GET",
	      headers: {
	        Accept: "application/json",
	      },
	    })
	      .then((response) => response.json())
	      .then((response) => {
	        sendResponse(response);
	      })
	      .catch();
	    return true;
	  } else if (request.message == "send_links") {
	    toSend = toSend.concat(request.videoIds.filter((x) => !sentIds.has(x)));
	    if (toSend.length >= 20) {
	      fetch(`${apiUrl}/votes`, {
	        method: "POST",
	        headers: {
	          "Content-Type": "application/json",
	        },
	        body: JSON.stringify(toSend),
	      });
	      for (const toSendUrl of toSend) {
	        sentIds.add(toSendUrl);
	      }
	      toSend = [];
	    }
	  } else if (request.message == "register") {
	    register();
	    return true;
	  } else if (request.message == "send_vote") {
	    sendVote(request.videoId, request.vote);
	    return true;
	  }
	});
	
	api.runtime.onInstalled.addListener((details) => {
	  if (
	    // No need to show changelog if its was a browser update (and not extension update)
	    details.reason === "browser_update" ||
	    // Chromium (e.g., Google Chrome Cannary) uses this name instead of the one above for some reason
	    details.reason === "chrome_update" ||
	    // No need to show changelog if developer just reloaded the extension
	    details.reason === "update"
	  ) {
	    return;
	  } else if (details.reason == "install") {
	    api.tabs.create({
	      url: api.runtime.getURL("/changelog/3/changelog_3.0.html"),
	    });
	  }
	});
	
	// api.storage.sync.get(['lastShowChangelogVersion'], (details) => {
	//   if (extConfig.showUpdatePopup === true &&
	//     details.lastShowChangelogVersion !== chrome.runtime.getManifest().version
	//     ) {
	//     // keep it inside get to avoid race condition
	//     api.storage.sync.set({'lastShowChangelogVersion ': chrome.runtime.getManifest().version});
	//     // wait until async get runs & don't steal tab focus
	//     api.tabs.create({url: api.runtime.getURL("/changelog/3/changelog_3.0.html"), active: false});
	//   }
	// });
	
	async function sendVote(videoId, vote) {
	  api.storage.sync.get(null, async (storageResult) => {
	    if (!storageResult.userId || !storageResult.registrationConfirmed) {
	      await register();
	    }
	    let voteResponse = await fetch(`${apiUrl}/interact/vote`, {
	      method: "POST",
	      headers: {
	        "Content-Type": "application/json",
	      },
	      body: JSON.stringify({
	        userId: storageResult.userId,
	        videoId,
	        value: vote,
	      }),
	    });
	
	    if (voteResponse.status == 401) {
	      await register();
	      await sendVote(videoId, vote);
	      return;
	    }
	    const voteResponseJson = await voteResponse.json();
	    const solvedPuzzle = await solvePuzzle(voteResponseJson);
	    if (!solvedPuzzle.solution) {
	      await sendVote(videoId, vote);
	      return;
	    }
	
	    await fetch(`${apiUrl}/interact/confirmVote`, {
	      method: "POST",
	      headers: {
	        "Content-Type": "application/json",
	      },
	      body: JSON.stringify({
	        ...solvedPuzzle,
	        userId: storageResult.userId,
	        videoId,
	      }),
	    });
	  });
	}
	
	async function register() {
	  const userId = generateUserID();
	  api.storage.sync.set({ userId });
	  const registrationResponse = await fetch(`${apiUrl}/puzzle/registration?userId=${userId}`, {
	    method: "GET",
	    headers: {
	      Accept: "application/json",
	    },
	  }).then((response) => response.json());
	  const solvedPuzzle = await solvePuzzle(registrationResponse);
	  if (!solvedPuzzle.solution) {
	    await register();
	    return;
	  }
	  const result = await fetch(`${apiUrl}/puzzle/registration?userId=${userId}`, {
	    method: "POST",
	    headers: {
	      "Content-Type": "application/json",
	    },
	    body: JSON.stringify(solvedPuzzle),
	  }).then((response) => response.json());
	  if (result === true) {
	    return api.storage.sync.set({ registrationConfirmed: true });
	  }
	}
	
	api.storage.sync.get(null, async (res) => {
	  if (!res || !res.userId || !res.registrationConfirmed) {
	    await register();
	  }
	});
	
	const sentIds = new Set();
	let toSend = [];
	
	function countLeadingZeroes(uInt8View, limit) {
	  let zeroes = 0;
	  let value = 0;
	  for (let i = 0; i < uInt8View.length; i++) {
	    value = uInt8View[i];
	    if (value === 0) {
	      zeroes += 8;
	    } else {
	      let count = 1;
	      if (value >>> 4 === 0) {
	        count += 4;
	        value <<= 4;
	      }
	      if (value >>> 6 === 0) {
	        count += 2;
	        value <<= 2;
	      }
	      zeroes += count - (value >>> 7);
	      break;
	    }
	    if (zeroes >= limit) {
	      break;
	    }
	  }
	  return zeroes;
	}
	
	async function solvePuzzle(puzzle) {
	  let challenge = Uint8Array.from(atob(puzzle.challenge), (c) => c.charCodeAt(0));
	  let buffer = new ArrayBuffer(20);
	  let uInt8View = new Uint8Array(buffer);
	  let uInt32View = new Uint32Array(buffer);
	  let maxCount = Math.pow(2, puzzle.difficulty) * 3;
	  for (let i = 4; i < 20; i++) {
	    uInt8View[i] = challenge[i - 4];
	  }
	
	  for (let i = 0; i < maxCount; i++) {
	    uInt32View[0] = i;
	    let hash = await crypto.subtle.digest("SHA-512", buffer);
	    let hashUint8 = new Uint8Array(hash);
	    if (countLeadingZeroes(hashUint8) >= puzzle.difficulty) {
	      return {
	        solution: btoa(String.fromCharCode.apply(null, uInt8View.slice(0, 4))),
	      };
	    }
	  }
	  return {};
	}
	
	function generateUserID(length = 36) {
	  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	  let result = "";
	  if (crypto && crypto.getRandomValues) {
	    const values = new Uint32Array(length);
	    crypto.getRandomValues(values);
	    for (let i = 0; i < length; i++) {
	      result += charset[values[i] % charset.length];
	    }
	    return result;
	  } else {
	    for (let i = 0; i < length; i++) {
	      result += charset[Math.floor(Math.random() * charset.length)];
	    }
	    return result;
	  }
	}
	
	function storageChangeHandler(changes, area) {
	  if (changes.disableVoteSubmission !== undefined) {
	    handleDisableVoteSubmissionChangeEvent(changes.disableVoteSubmission.newValue);
	  }
	  if (changes.coloredThumbs !== undefined) {
	    handleColoredThumbsChangeEvent(changes.coloredThumbs.newValue);
	  }
	  if (changes.coloredBar !== undefined) {
	    handleColoredBarChangeEvent(changes.coloredBar.newValue);
	  }
	  if (changes.colorTheme !== undefined) {
	    handleColorThemeChangeEvent(changes.colorTheme.newValue);
	  }
	  if (changes.numberDisplayFormat !== undefined) {
	    handleNumberDisplayFormatChangeEvent(changes.numberDisplayFormat.newValue);
	  }
	  if (changes.numberDisplayReformatLikes !== undefined) {
	    handleNumberDisplayReformatLikesChangeEvent(changes.numberDisplayReformatLikes.newValue);
	  }
	  if (changes.disableLogging !== undefined) {
	    handleDisableLoggingChangeEvent(changes.disableLogging.newValue);
	  }
	  if (changes.showTooltipPercentage !== undefined) {
	    handleShowTooltipPercentageChangeEvent(changes.showTooltipPercentage.newValue);
	  }
	  if (changes.numberDisplayReformatLikes !== undefined) {
	    handleNumberDisplayReformatLikesChangeEvent(changes.numberDisplayReformatLikes.newValue);
	  }
	}
	
	function handleDisableVoteSubmissionChangeEvent(value) {
	  extConfig.disableVoteSubmission = value;
	  if (value === true) {
	    changeIcon(voteDisabledIconName);
	  } else {
	    changeIcon(defaultIconName);
	  }
	}
	
	function handleDisableLoggingChangeEvent(value) {
	  extConfig.disableLogging = value;
	}
	
	function handleNumberDisplayFormatChangeEvent(value) {
	  extConfig.numberDisplayFormat = value;
	}
	
	function handleShowTooltipPercentageChangeEvent(value) {
	  extConfig.showTooltipPercentage = value;
	}
	
	function handleTooltipPercentageModeChangeEvent(value) {
	  if (!value) {
	    value = "dash_like";
	  }
	  extConfig.tooltipPercentageMode = value;
	}
	
	function changeIcon(iconName) {
	  if (api.action !== undefined) api.action.setIcon({ path: "/icons/" + iconName });
	  else if (api.browserAction !== undefined) api.browserAction.setIcon({ path: "/icons/" + iconName });
	  else console.log("changing icon is not supported");
	}
	
	function handleColoredThumbsChangeEvent(value) {
	  extConfig.coloredThumbs = value;
	}
	
	function handleColoredBarChangeEvent(value) {
	  extConfig.coloredBar = value;
	}
	
	function handleColorThemeChangeEvent(value) {
	  if (!value) {
	    value = "classic";
	  }
	  extConfig.colorTheme = value;
	}
	
	function handleNumberDisplayReformatLikesChangeEvent(value) {
	  extConfig.numberDisplayReformatLikes = value;
	}
	
	api.storage.onChanged.addListener(storageChangeHandler);
	
	function initExtConfig() {
	  initializeDisableVoteSubmission();
	  initializeDisableLogging();
	  initializeColoredThumbs();
	  initializeColoredBar();
	  initializeColorTheme();
	  initializeNumberDisplayFormat();
	  initializeNumberDisplayReformatLikes();
	  initializeTooltipPercentage();
	  initializeTooltipPercentageMode();
	}
	
	function initializeDisableVoteSubmission() {
	  api.storage.sync.get(["disableVoteSubmission"], (res) => {
	    if (res.disableVoteSubmission === undefined) {
	      api.storage.sync.set({ disableVoteSubmission: false });
	    } else {
	      extConfig.disableVoteSubmission = res.disableVoteSubmission;
	      if (res.disableVoteSubmission) changeIcon(voteDisabledIconName);
	    }
	  });
	}
	
	function initializeDisableLogging() {
	  api.storage.sync.get(["disableLogging"], (res) => {
	    if (res.disableLogging === undefined) {
	      api.storage.sync.set({ disableLogging: true });
	    } else {
	      extConfig.disableLogging = res.disableLogging;
	    }
	  });
	}
	
	function initializeColoredThumbs() {
	  api.storage.sync.get(["coloredThumbs"], (res) => {
	    if (res.coloredThumbs === undefined) {
	      api.storage.sync.set({ coloredThumbs: false });
	    } else {
	      extConfig.coloredThumbs = res.coloredThumbs;
	    }
	  });
	}
	
	function initializeColoredBar() {
	  api.storage.sync.get(["coloredBar"], (res) => {
	    if (res.coloredBar === undefined) {
	      api.storage.sync.set({ coloredBar: false });
	    } else {
	      extConfig.coloredBar = res.coloredBar;
	    }
	  });
	}
	
	function initializeColorTheme() {
	  api.storage.sync.get(["colorTheme"], (res) => {
	    if (res.colorTheme === undefined) {
	      api.storage.sync.set({ colorTheme: false });
	    } else {
	      extConfig.colorTheme = res.colorTheme;
	    }
	  });
	}
	
	function initializeNumberDisplayFormat() {
	  api.storage.sync.get(["numberDisplayFormat"], (res) => {
	    if (res.numberDisplayFormat === undefined) {
	      api.storage.sync.set({ numberDisplayFormat: "compactShort" });
	    } else {
	      extConfig.numberDisplayFormat = res.numberDisplayFormat;
	    }
	  });
	}
	
	function initializeTooltipPercentage() {
	  api.storage.sync.get(["showTooltipPercentage"], (res) => {
	    if (res.showTooltipPercentage === undefined) {
	      api.storage.sync.set({ showTooltipPercentage: false });
	    } else {
	      extConfig.showTooltipPercentage = res.showTooltipPercentage;
	    }
	  });
	}
	
	function initializeTooltipPercentageMode() {
	  api.storage.sync.get(["tooltipPercentageMode"], (res) => {
	    if (res.tooltipPercentageMode === undefined) {
	      api.storage.sync.set({ tooltipPercentageMode: "dash_like" });
	    } else {
	      extConfig.tooltipPercentageMode = res.tooltipPercentageMode;
	    }
	  });
	}
	
	function initializeNumberDisplayReformatLikes() {
	  api.storage.sync.get(["numberDisplayReformatLikes"], (res) => {
	    if (res.numberDisplayReformatLikes === undefined) {
	      api.storage.sync.set({ numberDisplayReformatLikes: false });
	    } else {
	      extConfig.numberDisplayReformatLikes = res.numberDisplayReformatLikes;
	    }
	  });
	}
	
	function isChrome() {
	  return typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined";
	}
	
	function isFirefox() {
	  return typeof browser !== "undefined" && typeof browser.runtime !== "undefined";
	}
	
	/******/ })()
	;
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
	const INJECTED_MANIFEST = {"manifest_version":3,"name":"Return YouTube Dislike","version":"3.0.0.18","description":"Returns ability to see dislikes","permissions":["storage"],"optional_permissions":[],"content_scripts":[{"matches":["*://youtube.com/*","*://www.youtube.com/*","*://m.youtube.com/*"],"exclude_matches":["*://*.music.youtube.com/*"],"js":["ryd.content-script.js"],"css":["content-style.css"]}],"options_ui":{"page":"popup.html","open_in_tab":false},"browser_action":{},"page_action":{},"action":{"default_popup":"popup.html"},"icons":{"48":"icons/icon48.png","128":"icons/icon128.png"},"web_accessible_resources":[{"resources":["ryd.script.js","menu-fixer.js"],"matches":["*://*.youtube.com/*"]}],"background":{"service_worker":"ryd.background.js"},"_id":"return-youtube-dislike"};
	const CONTENT_SCRIPT_CONFIGS_FOR_MATCHING = [
	  {
	    "matches": [
	      "*://youtube.com/*",
	      "*://www.youtube.com/*",
	      "*://m.youtube.com/*"
	    ]
	  }
	];
	const OPTIONS_PAGE_PATH = "popup.html";
	const POPUP_PAGE_PATH = "popup.html";
	const EXTENSION_ICON = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAM5npUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjatZlpdiM7roT/cxW9BE7gsByO5/QO3vL7AzNl+7pkW3WrnlU2VcoUCQKBQIBp1v/9d5v/8BOTJBMll1RTsvzEGqtvvCn2/Wfd4/WZs/H8ffy4+68zTy94xsAYrg9zvK+G+/PH/eltZKInF5x8+kJ4W8Z/XDi3+3Nv/T8s6tY5+/GnvP/uPcve69pdiwk3pGtT1xLmMQ03drwUztcSr8yv8D6fV+VVbLPDRTvtYM3O++q8C3a76KZxzW233GQcbmBj9MtnRu+HD+ezErKvfgQbXIj6ctvnUMMMJfgw/AohRBP8my3urFvPesMVVp6OW71jMsdXvn2Zn2545bX3sPgIB5fjJ3cF2HuNg1M3Bv3LbQTE7Ttuchz8eL39mA+BDURQjpsLG2y2X1N0ce/YCgcAgfuE8cKXy1Oj5g9KImsLxrhACGxyQVxyNnufnYvBFwLUsNyH6DsRcCJ+YqSPISRiU8ARa/Od7M69Xvz1OalCfCSkkIlNDY1gxSjgJ8cChpoEiSKSJEuRKs2kkDTnUspJc67lkGOWnHLOJdfcSiixSEkll1JqadXXQEpKTTXXUmttjTVbNE0a327c0Vr3PfTYpaeee+m1twF8Rhwy0sijjDra9DPMOGWmmWeZdbblFlAyKy5ZaeVVVl1tg7Uddtyy08677LrbW9TuqP7y+o2ouTtq/kRK78tvUePTnHWiM4VTnhGNGRHz0RHxrBEA0F5jZouL0WvkNGa2erJCPEaKxmY624xLhDAu52W7t9i9R+7luBl8/VPc/CuRMxq6vxA5b1b4FLcnUZvKhONE7MpC9akNZB/XV2m+NJztrzdnxIgYp/OzC4bl2lKuwg4iJcHz3UQ27ezWljpjw5u8T9XNTIoM0makiQUh5hxsKm0R90U6dRK/rp4Z4OcJWxQ5721pyrtjSy/6/75qNnv4jn19xshcezLtyN3vPlb0vzGp+TgrkxZ8Aoj0E5Ec3Bp97QA8fcdZfFqi4PS9cpsMc8fOQjFvM7zvWMItYaYV9tpNzkotHDOfG0ndvM209jLU7GMnKx1LLzsJ0WXoZzOfGIn3j5HmiZUPI/9h4rcGYp75vdh87UXzsxtf86L52Y2vedF84cZMth2Ix9lDrM0BcZIzWkig2gjEgZ1bU0qQ6eJqJqYWyQWfyy7zwJxfoCk923bSRr/5MzTNl07lPxfeW3gFnubfOPaZX82/cewzv5rLDx1mGZdPig1tTQRM7HWGtJUo6vJwaBmtsBnYcZTATrokZkSEjiXUNZi5emWV3UNC0Eg8vzCfm+UiqxKgyQ+09Ww0X96gm3HCXor4s1349Hgv+tTW+HzdfL5hHPA7SHYsf5Kyuhw21QMiFEJynF+tDLwslw9X8d0IM353g8xZFiK0bl8xY2/0oKwy5ry8OwSKX9S1y79vfh7jIvNNldqIdQ3v+b6W2k7UVr+iPK0kFCkUH5aHwI0qUSoT8EjBEzgofqFF86H4mRdlJA/K1VAx68cabcxeKrewd+4dYbY+oNosUihBPaxGjYJ3loCa2f0QlPWUXOfoOZ4wV0/Nsu78x34ajf3iwpNRSILSyAFVAeQD0uBEE3mXk/n+MtJkFwrsylekKTitBbsukrXn7yieXZhNyPPeCJDGVL/e8PE67/KGP2o8Qa6OoMSUyAO2Riy9OtTK2YJ9jGTG7ZkZ3C7Z9foGkRYVIiNeEEEozCKGCZnHIxqqqodpO3EZo/dYiEwZKborMpHguCESi1brQTZSuNmsEoyVYlTxdARDunxKj7HGL9bRTIxdQhfkWxmhjwkdugD8pR6MlWraSBpsmpaUkNQNoEMyCz+gJ1fGCxmBAzYn0md6V7yiAIHlMLBMMFwXCHGU7IbgSX25tgrCh8QLMiZzjG5DqQ4ldHgTbp5huN5xah4t4Th0UCN1hBBkQ58kSCx8szpRQApJjin7CFOu5AO7ShlMBJC/GioTxZfj5QftxB5kYZ6xh4LvjR8ucvjAHc+vmps53nnjV9a4KQHfn25UKeEDZdxXzcfLnxkDA59zxq+U0U3scVMJVxbkdEsFV6rmnVoIPUSA2khH67EO6cKmVnRZ286s5abZNjO83A5nZ1BPiVxxVpdsq0hrl1pBtILNN2sOAj9b82aVWTUqSKlh7Hf1igxMVOxF7CmO6FrswKUpbwT2pBKhp4FVJZeTVtkmblIkKdmEHUpC7Uc64hHyGHGFdhgAaOEA6qbdlB64SVwBo7ThA7GbyKAYeqctGDWYCYTZZkszxFYSvQJA8SzX/M5l0vNX9kjn3qcHWGnGPgKCv4mS3w6j2oCUJtdojovWPCAMDjRHkuA2C9iLnymQeU0WXSYoj1Rjsqb5aDEgi6VNAUedYmtkEQdPNxYoqC3JHtmOECbrwexu1Ew8SWVMgpBFBXymOyqpKfQPRPi+dkelAChKc+3TYmnzNRbakxUCAHq9bJrndfP3y6b5oiz+dtk0L+VA+cjk4g+Te2VyL4/tmG9v6MHNPXAq0TnJgWXIxkOctEJ5uvIgU/OZVQEAgT4e2Ze8Q6Eh3hFkW8hG1hlZZdrMIewx0Eh0f26aQAegi1LShlx7aQin864RRdVcRYRerwC/GFxD53YflIoTveqCluk4y1FsNLuBUq7pMdB/WUv2XB1dhs9okAcVhsIBwMZ2euoEdbvoI/hfhE21WzZkuLb3dKjLdwQ0srg7SHnC6mQZ8nOpACCfuQGvTSgE1mGGUJwD+SSGc76eU79KdlSqAHXDYQKNfAckeLZki5BosdKi9uxXS/F2tM8Pp6t/tc266JXiKZdjsYLiObV4cvnLq7VwkRJMksq5ZjzkuBpV73tJVX+QXN10RYoLS26kwGrTVSr2qbulIbXGK8LHPLuAaq/vgGHNd8gk+wXKDDDbEdJe8C1QOfvFgWw9kWxJmRHtR/FEOUBgjiyr+FfVRdFjBli447pl/J6RPgpJSRGfy3U9I6kgxRFsQquEV0tuqgGBwKZ3kNyrfjmDFG9jPAdFZqMd92xIe9IMMTZDq0sJrsIqSKA+EwnGTazqaYQrCJ2oS68oYOKSHCy3USMhkiBWJ9uZnIC/VZ8GuogV67KRCSn7yvPlCF4aPkCU2CUMDivZiBKsbI3ysiGvCYlGVNDUQ0b4lJKCuyaEfNMk1sVvGNO81mn8zJjmtU7jZ8Y0r3Uaz+v0x9E8LeQoOoq16k+3Jz0iGrMItNW3b6RU0E5TuUMrEfCrqU5DeWrQwRAKaKbWdocbiK0WP8QiwdmqwNPiS9IrFSo0PeAiQ7kFSmzECZVgICoQmyMcNkKC6sCe36kmKIn6+iZ152ep+2k0F5v8OZmYi03+nEzMxSZ/Tia/02b9ONG3jdarbZj5qQ97tQ0zP/VhX7VhjHAEirHnDPOIWQFZ5WNsoLim87AC2NiAjbmBJCpjXMK/oeUVZqA8nV+6nLLuCOgjn/R3fK0H40+9+Z2nn7a75p9+1vJ9+VAZSL2oj0ze/fzl9WX+6WeVdC94+nPDa09d+zoRNQ9f7ZDML5fzzXQx/06HdJ9ovX/g6VxdK/GchnQqTLtOQ86jCz0NqWtleu5KY7nFFj1BH3q8aEQbXeiq6nPU01VgHBlLO3FBLepju1GdB2lp3UBD7x+gDYpYyrbT9zOuHVUPhTB2DpMGJNEmE2xUVWjp7TyyazP2JW2bF3j9Gh9E9JGGPhwimXOK9BcOkcw5RfoLh0jmfkO5jkGjEGdx1PQKIdPHpqLPJ+8mTJsj7zSTHZ0qxFnRt21puuNs74a9Kw/CGC1MXNfVKie2669Wme3a0yrrI4+rVV5joSD6Qi6smpbJoF2xgZ/aJOoU+pwRMUx316JUEeo/coB5kSwSvewpC76eVt1pq+78fDCEmC8u6tPArjShRzF3qpD163HW+ktfaM6bVgGyurB268ek29WHWmnqUyevOEbsqVwkHn1S0Q9ifKJHOYjRY3fzJsPwYdQ8m3OsJsx3M3ADMRAB7e2yRRNtsUSfiBecPSvp5KeeQ9LyMMpiLVQgtMB8q7b52AIqNZWfjo7ftvbCjWdkya/aRPM4E/qmj0SnQKPovBn6l42kublTFInqxkBJ0v4/62PJqTC0UYEIMdBvDSWXQ1eVwMZpKVdIa0qRgXAtfkQJD/xYNFF61+d5VLCEukfg6pMNCEDPQFSSqfROCDb0xtD8JB9QYGbXuggu/SJrxVT6nkB+Mt1tunYQP6ksRvPTDc9H14RqfSEvF1Jo6BlbQwrJjb1qb+z1HfeNPZvg5EPJ56DrIE8PujR7wZUwKU3NIeabsarTExx0pwyngEYBOJ0UWkqAr2W4HB81fN6Vk/059jqcnI2ScsD1V6lJQfuEf1NJTHyY/YeVxGgp+RuVxLxUQV4Y/18ngt9mNf8DR5y9ArsaIYgAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1OlRaoOdhBxyFCdLIiKOEorFsFCaSu06mBy6Rc0aUhSXBwF14KDH4tVBxdnXR1cBUHwA8TNzUnRRUr8X1JoEePBcT/e3XvcvQOEZpWpZs8koGqWkU7ExFx+VQy8IoQgBAwgKjFTT2YWs/AcX/fw8fUuyrO8z/05+pWCyQCfSDzPdMMi3iCe3bR0zvvEYVaWFOJz4gmDLkj8yHXZ5TfOJYcFnhk2suk4cZhYLHWx3MWsbKjEM8QRRdUoX8i5rHDe4qxW66x9T/7CUEFbyXCd5igSWEISKYiQUUcFVViI0qqRYiJN+zEP/4jjT5FLJlcFjBwLqEGF5PjB/+B3t2ZxespNCsWA3hfb/hgDArtAq2Hb38e23ToB/M/Aldbx15rA3CfpjY4WOQIGt4GL644m7wGXO8Dwky4ZkiP5aQrFIvB+Rt+UB4Zugb41t7f2Pk4fgCx1tXwDHBwC4yXKXvd4d7C7t3/PtPv7AVb4cpy/J7ghAAAACXBIWXMAAB/mAAAf5gGksLI7AAAAB3RJTUUH5QwJDzkC2XMpsQAAAoNJREFUaN7tmT9oE1Ecxz+Xi0oDVdRqpApZLKJoh1YhSmhBDS5dFEsHh6JgEaQIcWiH0qlgly5ShyJU0MlsLk4VB0sLBZtqoB44aUGtoi5FgkZ/DjmhHrnmcv/yDvKFGw7u93vfz++9d++9O2iqsdJqPSBwCcgBJ4CdPrb9EzCAe8B9DaRK21eBIzbxv4F8LfNjAhLC9UAsxRTIOoh7v5X5ToFySAAiMGBp/5qTuNgWHXAb0EMcztfdBMVsqp/EUpEQdMw3AOAGsCNkgJgvQQLbTYBIqBr1AHAgygDDjqOnp6G/Xx0AgTPAKcfRHR2Qz8PiIqTTSvTALVdZ0mlYWKjApFKNARA4CFx0vynRKsNpdRUmJ6G1NfQeuAls85wxkYCRETAMGBoCXQ8eQKDF7Upoq/Z2mJmBpSXo7Q28B64AbYG00NUFExOQTAYKMBxI9rU1GByEnh5YXw+kibjAWaDT16wbGzA1VZnMpVKgcyBuTl5/VC7D7CyMjwdW8WoA53zJNDcHuRwUi6GvA7s8ZTAM6OuDbDZ08/8WMPenqExGRNf9OpF9cnMii3uin59XcjcaKcWAP1EHeBd1gEeKeBG3AHeA5woAfLDcf3YQ8zauQUnggnmQvwwccmkg5fE70mPL/VNgFOi2ef4HcNevvm8R+OVhDXgh4X/G+Q/gtAfzLwV2N3odOOkybhnIavC90QDdLmIKpvlvKrz/inUOm2WBPaq8vBN1TuCCMuZNgEyd5veqtplzOv5XgPMafFVqLyLw0EHlV/yufJgTuKCseRPgY43Kt6GyBJ7YmH+lvHkT4LDAF4v51wL7InOoEDi6aSi9kQj94dkMcVzgmcB+mmoqOvoL3Z82CBlycfMAAAAASUVORK5CYII=";
	const extensionCssData = {    "content-style.css": ":root {\r\n  /* --yt-spec-icon-disabled: #f44 !important;\r\n  --yt-spec-text-primary: #4f4 !important; */\r\n  /* --yt-spec-general-background-a: #000 !important;\r\n  --yt-spec-general-background-b: #000 !important;\r\n  --yt-spec-general-background-c: #000 !important;\r\n  --yt-spec-brand-background-solid: #000 !important;\r\n  --yt-spec-brand-background-primary: #000 !important;\r\n  --yt-spec-brand-background-secondary: #000 !important; */\r\n}\r\n\r\n/* html:not(.style-scope)[dark], :not(.style-scope)[dark] {\r\n  --yt-spec-general-background-a: #000 !important;\r\n  --yt-spec-general-background-b: #000 !important;\r\n  --yt-spec-general-background-c: #000 !important;\r\n  --yt-spec-brand-background-solid: #000 !important;\r\n  --yt-spec-brand-background-primary: #000 !important;\r\n  --yt-spec-brand-background-secondary: #000 !important;\r\n} */\r\n\r\n#ryd-bar-container {\r\n  background: var(--yt-spec-icon-disabled);\r\n  border-radius: 2px;\r\n}\r\n\r\n#ryd-bar {\r\n  background: var(--yt-spec-text-primary);\r\n  border-radius: 2px;\r\n  transition: all 0.15s ease-in-out;\r\n}\r\n\r\n.ryd-tooltip {\r\n  display: block;\r\n  height: 2px;\r\n}\r\n\r\n.ryd-tooltip-old-design {\r\n  position: relative;\r\n  top: 9px;\r\n}\r\n\r\n.ryd-tooltip-new-design {\r\n  position: absolute;\r\n  bottom: -10px;\r\n}\r\n\r\n.ryd-tooltip-bar-container {\r\n  width: 100%;\r\n  height: 2px;\r\n  position: absolute;\r\n  padding-top: 6px;\r\n  padding-bottom: 12px;\r\n  top: -6px;\r\n}\r\n\r\n/* required to make the ratio bar visible in the new design */\r\nytd-menu-renderer.ytd-watch-metadata {\r\n  overflow-y: visible !important;\r\n}\r\n\r\n#top-level-buttons-computed {\r\n  position: relative !important;\r\n}\r\n"};
	
	const LOCALE_KEYS = {"extensionName":{"message":"Return YouTube Dislike"},"extensionNameBeta":{"message":"Return YouTube Dislike Beta"},"extensionDesc":{"message":"Returns ability to see dislikes"},"textDeveloper":{"message":"by Dmitry Selivanov & Community"},"linkWebsite":{"message":"Website"},"linkFAQ":{"message":"FAQ"},"linkDonate":{"message":"Donate"},"linkHelp":{"message":"Help"},"linkChangelog":{"message":"Change Log"},"legendSettings":{"message":"Settings"},"textSettings":{"message":"Disable like/dislike submission"},"textLikesDisabled":{"message":"Disabled by Owner"},"textSettingsHover":{"message":"Stops counting your likes and dislikes."},"textRoundingNumbers":{"message":"Round down like/dislike stats (default YouTube behavior)"},"textRoundingNumbersHover":{"message":"Show rounded down stats."},"textConsistentFormat":{"message":"Make likes and dislikes format consistent"},"textConsistentFormatHover":{"message":"Re-format like numbers."},"textNumberFormat":{"message":"Number format:"},"textColorizeRatioBar":{"message":"Colorize ratio bar"},"textColorizeRatioBarHover":{"message":"Use custom colors for ratio bar."},"textColorizeThumbs":{"message":"Colorize thumbs"},"textColorizeThumbsHover":{"message":"Use custom colors for thumb icons."},"textColorTheme":{"message":"Color theme:"},"textColorTheme1":{"message":"Classic"},"textColorTheme2":{"message":"Accessible"},"textColorTheme3":{"message":"Neon"},"textTempUnavailable":{"message":"Temporarily Unavailable"},"textUpdate":{"message":"Update to"},"version30installed":{"message":"Version 3.0.0.18 installed"},"whatsnew":{"message":"What's new"},"shortsSupport":{"message":"YouTube Shorts Support"},"customColors":{"message":"Custom colors for dislike bar and buttons"},"customNumberFormats":{"message":"Custom number formats"},"considerDonating":{"message":"The only thing that keeps the extension running is your donations, please consider supporting the project."},"roundNumbers":{"message":"Show rounded down numbers"},"roundNumbersHover":{"message":"Round down numbers (default YouTube behavior)."},"reformatLikes":{"message":"Re-format like numbers"},"reformatLikesHover":{"message":"Make likes and dislikes format consistent."},"numberFormat":{"message":"Number format:"},"colorizeRatio":{"message":"Colorize ratio bar"},"colorizeRatioHover":{"message":"Use custom colors for the ratio bar."},"colorizeThumbs":{"message":"Colorize thumbs"},"colorizeThumbsHover":{"message":"Use custom colors for the thumb icons."},"colorTheme":{"message":"Color theme:"}};
	const USED_LOCALE = "en";
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
	  ...(INJECTED_MANIFEST.content_scripts
	    ?.map((cs) => cs.matches || [])
	    ?.flat() || []),
	];
	
	const isOrigin = (perm) => {
	  if (
	    perm.startsWith("*://") ||
	    perm.startsWith("http://") ||
	    perm.startsWith("https://")
	  ) {
	    return true;
	  }
	  return false;
	};
	const ORIGIN_PERMISSIONS = ALL_PERMISSIONS.filter(isOrigin);
	const EXTENSION_PERMISSIONS = ALL_PERMISSIONS.filter((perm) => !isOrigin(perm));
	
	function _testBlobCSP() {
	  try {
	    const code = `console.log("Blob CSP test");`;
	    const blob = new Blob([code], { type: "application/javascript" });
	    const blobUrl = URL.createObjectURL(blob);
	
	    const script = document.createElement("script");
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
	  if (document.readyState === "loading") {
	    return new Promise((resolve) =>
	      document.addEventListener("DOMContentLoaded", resolve, { once: true })
	    );
	  }
	  return Promise.resolve();
	};
	
	waitForDOMEnd().then(() => {
	  _testBlobCSP().then((result) => {
	    CAN_USE_BLOB_CSP = result;
	  });
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
	    ext
	  );
	}
	
	function _createAssetUrl(path = "") {
	  if (path.startsWith("/")) path = path.slice(1);
	  const assetData = EXTENSION_ASSETS_MAP[path];
	  if (typeof assetData === "undefined") {
	    _warn("[runtime.getURL] Asset not found for", path);
	    return path;
	  }
	
	  const mime = _getMimeTypeFromPath(path);
	  const ext = (path.split(".").pop() || "").toLowerCase();
	
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
	
	  pattern = pattern.replace(/\\/g, "/");
	  path = path.replace(/\\/g, "/");
	
	  if (pattern === path) return true;
	
	  let regexPattern = pattern
	    .replace(/[.+?^${}()|[\]\\]/g, "\\$&") // Escape regex chars
	    .replace(/\*\*/g, "__DOUBLESTAR__") // Temporarily replace **
	    .replace(/\*/g, "[^/]*") // * matches any chars except /
	    .replace(/__DOUBLESTAR__/g, ".*"); // ** matches any chars including /
	
	  regexPattern = "^" + regexPattern + "$";
	
	  try {
	    const regex = new RegExp(regexPattern);
	    return regex.test(path);
	  } catch (e) {
	    _error(`Invalid glob pattern: ${pattern}`, e);
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
	
	window._matchGlobPattern = _matchGlobPattern;
	window._isWebAccessibleResource = _isWebAccessibleResource;
	
	// This function contains all the CSS injection and JS execution,
	// ordered by run_at timing internally using await.
	
  // #region Script Execution Logic
		async function executeAllScripts(globalThis, extensionCssData) {
		  const {chrome, browser, global, window, self} = globalThis;
		  const scriptName = "Return YouTube Dislike";
		  _log(`Starting execution phases...`);
		
  // #region Document Start
			  if (typeof document !== 'undefined') {
			    _log(`Executing document-start phase...`);
			    
			    const scriptPaths = [];
			   _log(`  Executing JS (start): ${scriptPaths}`);
			
			   try {
			       // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
			      with (globalThis){;
			
			;}
			   } catch(e) { _error(`  Error executing scripts ${scriptPaths}`, e); }
			  
			  } else {
			      _log(`Skipping document-start phase (no document).`);
			  }
			
			  
  // #endregion
  // #region Wait for Document End DOMContentLoaded ---
			  if (typeof document !== 'undefined' && document.readyState === 'loading') {
			    _log(`Waiting for DOMContentLoaded...`);
			    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
			    _log(`DOMContentLoaded fired.`);
			  } else if (typeof document !== 'undefined') {
			    _log(`DOMContentLoaded already passed or not applicable.`);
			  }
			  
			
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
			    
			        const cssKey_0 = "content-style.css";
			    try {
			      if (extensionCssData[cssKey_0]) {
			        _log(`  Injecting CSS (idle): ${cssKey_0}`);
			        const style = document.createElement('style');
			        style.textContent = extensionCssData[cssKey_0];
			        (document.head || document.documentElement).appendChild(style);
			      } else { console.warn(`  CSS not found (idle): ${cssKey_0}`); }
			    } catch(e) { _error(`  Failed injecting CSS (${cssKey_0}) in phase idle`, e, extensionCssData); }
			  
			    const scriptPaths = ["ryd.content-script.js"];
			   _log(`  Executing JS (idle): ${scriptPaths}`);
			
			   try {
			       // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
			      with (globalThis){;
			// START: ryd.content-script.js
			/******/ (() => { // webpackBootstrap
			/******/ 	"use strict";
			/******/ 	var __webpack_modules__ = ({
			
			/***/ 805:
			/***/ ((module, __unused_webpack___webpack_exports__, __webpack_require__) => {
			
			__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
			/* harmony import */ var _src_buttons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(423);
			/* harmony import */ var _src_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(935);
			/* harmony import */ var _src_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(67);
			/* harmony import */ var _src_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(27);
  // #endregion
// #region Import Button Functions ---
			
			
// #endregion
// #region Import State Functions ---
			
			
// #endregion
// #region Import Video Browser Functions ---
			
			
			
			await (0,_src_state__WEBPACK_IMPORTED_MODULE_1__/* .initExtConfig */ .qg)();
			
			let jsInitChecktimer = null;
			let isSetInitialStateDone = false;
			
			async function setEventListeners(evt) {
			  async function checkForJS_Finish() {
			    try {
			      if ((0,_src_state__WEBPACK_IMPORTED_MODULE_1__/* .isShorts */ .ol)() || ((0,_src_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getButtons */ .hS)()?.offsetParent && (0,_src_utils__WEBPACK_IMPORTED_MODULE_2__/* .isVideoLoaded */ .x8)())) {
			        clearInterval(jsInitChecktimer);
			        jsInitChecktimer = null;
			        (0,_src_events__WEBPACK_IMPORTED_MODULE_3__/* .createSmartimationObserver */ .Q$)();
			        (0,_src_events__WEBPACK_IMPORTED_MODULE_3__/* .addLikeDislikeEventListener */ .G_)();
			        await (0,_src_state__WEBPACK_IMPORTED_MODULE_1__/* .setInitialState */ .KY)();
			        isSetInitialStateDone = true;
			        (0,_src_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.onChanged.addListener(_src_events__WEBPACK_IMPORTED_MODULE_3__/* .storageChangeHandler */ .F6);
			      }
			    } catch (exception) {
			      if (!isSetInitialStateDone) {
			        (0,_src_utils__WEBPACK_IMPORTED_MODULE_2__/* .cLog */ .D2)("error");
			        await (0,_src_state__WEBPACK_IMPORTED_MODULE_1__/* .setInitialState */ .KY)();
			      }
			    }
			  }
			
			  if (jsInitChecktimer !== null) clearInterval(jsInitChecktimer);
			  jsInitChecktimer = setInterval(await checkForJS_Finish, 111);
			}
			
			await setEventListeners();
			
			document.addEventListener("yt-navigate-finish", async function (event) {
			  if (jsInitChecktimer !== null) clearInterval(jsInitChecktimer);
			  await setEventListeners();
			});
			
			const s = document.createElement("script");
			s.src = chrome.runtime.getURL("menu-fixer.js");
			s.onload = function () {
			  this.remove();
			};
			// see also "Dynamic values in the injected code" section in this answer
			(document.head || document.documentElement).appendChild(s);
			
			__webpack_async_result__();
			} catch(e) { __webpack_async_result__(e); } }, 1);
			
			/***/ }),
			
			/***/ 910:
			/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
			
			/* harmony export */ __webpack_require__.d(__webpack_exports__, {
			/* harmony export */   k: () => (/* binding */ createRateBar)
			/* harmony export */ });
			/* harmony import */ var _buttons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(423);
			/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(935);
			/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(67);
			
			
			
			
			function createRateBar(likes, dislikes) {
			  let rateBar = document.getElementById("ryd-bar-container");
			  if (!(0,_state__WEBPACK_IMPORTED_MODULE_1__/* .isLikesDisabled */ .$L)()) {
			    // sometimes rate bar is hidden
			    if (rateBar && !(0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .isInViewport */ .v4)(rateBar)) {
			      rateBar.remove();
			      rateBar = null;
			    }
			
			    const widthPx =
			      parseFloat(window.getComputedStyle((0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getLikeButton */ .yN)()).width) +
			      parseFloat(window.getComputedStyle((0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getDislikeButton */ .x8)()).width) +
			      ((0,_state__WEBPACK_IMPORTED_MODULE_1__/* .isRoundedDesign */ .MB)() ? 0 : 8);
			
			    const widthPercent =
			      likes + dislikes > 0 ? (likes / (likes + dislikes)) * 100 : 50;
			
			    var likePercentage = parseFloat(widthPercent.toFixed(1));
			    const dislikePercentage = (100 - likePercentage).toLocaleString();
			    likePercentage = likePercentage.toLocaleString();
			
			    if (_state__WEBPACK_IMPORTED_MODULE_1__/* .extConfig */ .zO.showTooltipPercentage) {
			      var tooltipInnerHTML;
			      switch (_state__WEBPACK_IMPORTED_MODULE_1__/* .extConfig */ .zO.tooltipPercentageMode) {
			        case "dash_dislike":
			          tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${dislikePercentage}%`;
			          break;
			        case "both":
			          tooltipInnerHTML = `${likePercentage}%&nbsp;/&nbsp;${dislikePercentage}%`;
			          break;
			        case "only_like":
			          tooltipInnerHTML = `${likePercentage}%`;
			          break;
			        case "only_dislike":
			          tooltipInnerHTML = `${dislikePercentage}%`;
			          break;
			        default: // dash_like
			          tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}&nbsp;&nbsp;-&nbsp;&nbsp;${likePercentage}%`;
			      }
			    } else {
			      tooltipInnerHTML = `${likes.toLocaleString()}&nbsp;/&nbsp;${dislikes.toLocaleString()}`;
			    }
			
			    if (!(0,_state__WEBPACK_IMPORTED_MODULE_1__/* .isShorts */ .ol)()) {
			      if (!rateBar && !(0,_state__WEBPACK_IMPORTED_MODULE_1__/* .isMobile */ .tq)()) {
			        let colorLikeStyle = "";
			        let colorDislikeStyle = "";
			        if (_state__WEBPACK_IMPORTED_MODULE_1__/* .extConfig */ .zO.coloredBar) {
			          colorLikeStyle = "; background-color: " + (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getColorFromTheme */ .t4)(true);
			          colorDislikeStyle = "; background-color: " + (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getColorFromTheme */ .t4)(false);
			        }
			        let actions =
			          (0,_state__WEBPACK_IMPORTED_MODULE_1__/* .isNewDesign */ .am)() && (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getButtons */ .hS)().id === "top-level-buttons-computed"
			            ? (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getButtons */ .hS)()
			            : document.getElementById("menu-container");
			        (
			          actions ||
			          document.querySelector("ytm-slim-video-action-bar-renderer")
			        ).insertAdjacentHTML(
			          "beforeend",
			          `
			              <div class="ryd-tooltip ryd-tooltip-${(0,_state__WEBPACK_IMPORTED_MODULE_1__/* .isNewDesign */ .am)() ? "new" : "old"}-design" style="width: ${widthPx}px">
			              <div class="ryd-tooltip-bar-container">
			                <div
			                    id="ryd-bar-container"
			                    style="width: 100%; height: 2px;${colorDislikeStyle}"
			                    >
			                    <div
			                      id="ryd-bar"
			                      style="width: ${widthPercent}%; height: 100%${colorLikeStyle}"
			                      ></div>
			                </div>
			              </div>
			              <tp-yt-paper-tooltip position="top" id="ryd-dislike-tooltip" class="style-scope ytd-sentiment-bar-renderer" role="tooltip" tabindex="-1">
			                <!--css-build:shady-->${tooltipInnerHTML}
			              </tp-yt-paper-tooltip>
			              </div>
			      		`,
			        );
			
			        if ((0,_state__WEBPACK_IMPORTED_MODULE_1__/* .isNewDesign */ .am)()) {
			          // Add border between info and comments
			          let descriptionAndActionsElement = document.getElementById("top-row");
			          descriptionAndActionsElement.style.borderBottom =
			            "1px solid var(--yt-spec-10-percent-layer)";
			          descriptionAndActionsElement.style.paddingBottom = "10px";
			
			          // Fix like/dislike ratio bar offset in new UI
			          document.getElementById("actions-inner").style.width = "revert";
			          if ((0,_state__WEBPACK_IMPORTED_MODULE_1__/* .isRoundedDesign */ .MB)()) {
			            document.getElementById("actions").style.flexDirection =
			              "row-reverse";
			          }
			        }
			      } else {
			        document.querySelector(`.ryd-tooltip`).style.width = widthPx + "px";
			        document.getElementById("ryd-bar").style.width = widthPercent + "%";
			        document.querySelector("#ryd-dislike-tooltip > #tooltip").innerHTML =
			          tooltipInnerHTML;
			        if (_state__WEBPACK_IMPORTED_MODULE_1__/* .extConfig */ .zO.coloredBar) {
			          document.getElementById("ryd-bar-container").style.backgroundColor =
			            (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getColorFromTheme */ .t4)(false);
			          document.getElementById("ryd-bar").style.backgroundColor =
			            (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getColorFromTheme */ .t4)(true);
			        }
			      }
			    }
			  } else {
			    (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .cLog */ .D2)("removing bar");
			    if (rateBar) {
			      rateBar.parentNode.removeChild(rateBar);
			    }
			  }
			}
			
			
			
			
			/***/ }),
			
			/***/ 423:
			/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
			
			/* harmony export */ __webpack_require__.d(__webpack_exports__, {
			/* harmony export */   $1: () => (/* binding */ checkForSignInButton),
			/* harmony export */   Eq: () => (/* binding */ getLikeTextContainer),
			/* harmony export */   hS: () => (/* binding */ getButtons),
			/* harmony export */   x8: () => (/* binding */ getDislikeButton),
			/* harmony export */   xP: () => (/* binding */ getDislikeTextContainer),
			/* harmony export */   yN: () => (/* binding */ getLikeButton)
			/* harmony export */ });
			/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(935);
			/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67);
			
			
			
			function getButtons() {
			  //---   If Watching Youtube Shorts:   ---//
			  if ((0,_state__WEBPACK_IMPORTED_MODULE_0__/* .isShorts */ .ol)()) {
			    let elements = (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .isMobile */ .tq)()
			      ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .querySelectorAll */ .Wb)(_state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.buttons.shorts.mobile)
			      : (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .querySelectorAll */ .Wb)(_state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.buttons.shorts.desktop);
			
			    for (let element of elements) {
			      //YouTube Shorts can have multiple like/dislike buttons when scrolling through videos
			      //However, only one of them should be visible (no matter how you zoom)
			      if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .isInViewport */ .v4)(element)) {
			        return element;
			      }
			    }
			  }
			  //---   If Watching On Mobile:   ---//
			  if ((0,_state__WEBPACK_IMPORTED_MODULE_0__/* .isMobile */ .tq)()) {
			    return document.querySelector(_state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.buttons.regular.mobile);
			  }
			  //---   If Menu Element Is Displayed:   ---//
			  if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .querySelector */ .R2)(_state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.menuContainer)?.offsetParent === null) {
			    return (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .querySelector */ .R2)(_state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.buttons.regular.desktopMenu);
			    //---   If Menu Element Isn't Displayed:   ---//
			  } else {
			    return (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .querySelector */ .R2)(_state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.buttons.regular.desktopNoMenu);
			  }
			}
			
			function getLikeButton() {
			  return getButtons().children[0].tagName ===
			    "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
			    ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .querySelector */ .R2)(_state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.buttons.likeButton.segmented) ??
			        (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .querySelector */ .R2)(
			          _state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.buttons.likeButton.segmentedGetButtons,
			          getButtons(),
			        )
			    : (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .querySelector */ .R2)(
			        _state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.buttons.likeButton.notSegmented,
			        getButtons(),
			      );
			}
			
			function getLikeTextContainer() {
			  return (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .querySelector */ .R2)(_state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.likeTextContainer, getLikeButton());
			}
			
			function getDislikeButton() {
			  return getButtons().children[0].tagName ===
			    "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
			    ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .querySelector */ .R2)(_state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.buttons.dislikeButton.segmented) ??
			        (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .querySelector */ .R2)(
			          _state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.buttons.dislikeButton.segmentedGetButtons,
			          getButtons(),
			        )
			    : (0,_state__WEBPACK_IMPORTED_MODULE_0__/* .isShorts */ .ol)()
			      ? (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .querySelector */ .R2)(["#dislike-button"], getButtons())
			      : (0,_utils__WEBPACK_IMPORTED_MODULE_1__/* .querySelector */ .R2)(
			          _state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.buttons.dislikeButton.notSegmented,
			          getButtons(),
			        );
			}
			
			function createDislikeTextContainer() {
			  const textNodeClone = (
			    getLikeButton().querySelector(
			      ".yt-spec-button-shape-next__button-text-content",
			    ) ||
			    getLikeButton().querySelector("button > div[class*='cbox']") ||
			    (
			      getLikeButton().querySelector('div > span[role="text"]') ||
			      document.querySelector(
			        'button > div.yt-spec-button-shape-next__button-text-content > span[role="text"]',
			      )
			    ).parentNode
			  ).cloneNode(true);
			  const insertPreChild = getDislikeButton().querySelector("button");
			  insertPreChild.insertBefore(textNodeClone, null);
			  getDislikeButton()
			    .querySelector("button")
			    .classList.remove("yt-spec-button-shape-next--icon-button");
			  getDislikeButton()
			    .querySelector("button")
			    .classList.add("yt-spec-button-shape-next--icon-leading");
			  if (textNodeClone.querySelector("span[role='text']") === null) {
			    const span = document.createElement("span");
			    span.setAttribute("role", "text");
			    while (textNodeClone.firstChild) {
			      textNodeClone.removeChild(textNodeClone.firstChild);
			    }
			    textNodeClone.appendChild(span);
			  }
			  textNodeClone.innerText = "";
			  return textNodeClone;
			}
			
			function getDislikeTextContainer() {
			  let result;
			  for (const selector of _state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.selectors.dislikeTextContainer) {
			    result = getDislikeButton().querySelector(selector);
			    if (result !== null) {
			      break;
			    }
			  }
			  if (result == null) {
			    result = createDislikeTextContainer();
			  }
			  return result;
			}
			
			function checkForSignInButton() {
			  if (
			    document.querySelector(
			      "a[href^='https://accounts.google.com/ServiceLogin']",
			    )
			  ) {
			    return true;
			  } else {
			    return false;
			  }
			}
			
			
			
			
			/***/ }),
			
			/***/ 27:
			/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
			
			/* harmony export */ __webpack_require__.d(__webpack_exports__, {
			/* harmony export */   F6: () => (/* binding */ storageChangeHandler),
			/* harmony export */   G_: () => (/* binding */ addLikeDislikeEventListener),
			/* harmony export */   Q$: () => (/* binding */ createSmartimationObserver)
			/* harmony export */ });
			/* unused harmony exports sendVote, likeClicked, dislikeClicked */
			/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(67);
			/* harmony import */ var _buttons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(423);
			/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(935);
			/* harmony import */ var _bar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(910);
			
			
			
			
			
			function sendVote(vote) {
			  if (_state__WEBPACK_IMPORTED_MODULE_2__/* .extConfig */ .zO.disableVoteSubmission !== true) {
			    (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .getBrowser */ .qs)().runtime.sendMessage({
			      message: "send_vote",
			      vote: vote,
			      videoId: (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .getVideoId */ .gJ)(window.location.href),
			    });
			  }
			}
			
			function updateDOMDislikes() {
			  (0,_state__WEBPACK_IMPORTED_MODULE_2__/* .setDislikes */ .r6)((0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .numberFormat */ .Y4)(_state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.dislikes));
			  (0,_bar__WEBPACK_IMPORTED_MODULE_3__/* .createRateBar */ .k)(_state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.likes, _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.dislikes);
			}
			
			function likeClicked() {
			  if ((0,_buttons__WEBPACK_IMPORTED_MODULE_1__/* .checkForSignInButton */ .$1)() === false) {
			    if (_state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.previousState === _state__WEBPACK_IMPORTED_MODULE_2__/* .DISLIKED_STATE */ .Gv) {
			      sendVote(1);
			      if (_state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.dislikes > 0) _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.dislikes--;
			      _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.likes++;
			      updateDOMDislikes();
			      _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.previousState = _state__WEBPACK_IMPORTED_MODULE_2__/* .LIKED_STATE */ .AV;
			    } else if (_state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.previousState === _state__WEBPACK_IMPORTED_MODULE_2__/* .NEUTRAL_STATE */ .kQ) {
			      sendVote(1);
			      _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.likes++;
			      updateDOMDislikes();
			      _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.previousState = _state__WEBPACK_IMPORTED_MODULE_2__/* .LIKED_STATE */ .AV;
			    } else if ((_state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.previousState = _state__WEBPACK_IMPORTED_MODULE_2__/* .LIKED_STATE */ .AV)) {
			      sendVote(0);
			      if (_state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.likes > 0) _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.likes--;
			      updateDOMDislikes();
			      _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.previousState = _state__WEBPACK_IMPORTED_MODULE_2__/* .NEUTRAL_STATE */ .kQ;
			    }
			    if (_state__WEBPACK_IMPORTED_MODULE_2__/* .extConfig */ .zO.numberDisplayReformatLikes === true) {
			      const nativeLikes = (0,_state__WEBPACK_IMPORTED_MODULE_2__/* .getLikeCountFromButton */ .m8)();
			      if (nativeLikes !== false) {
			        (0,_state__WEBPACK_IMPORTED_MODULE_2__/* .setLikes */ .Xq)((0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .numberFormat */ .Y4)(nativeLikes));
			      }
			    }
			  }
			}
			
			function dislikeClicked() {
			  if ((0,_buttons__WEBPACK_IMPORTED_MODULE_1__/* .checkForSignInButton */ .$1)() == false) {
			    if (_state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.previousState === _state__WEBPACK_IMPORTED_MODULE_2__/* .NEUTRAL_STATE */ .kQ) {
			      sendVote(-1);
			      _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.dislikes++;
			      updateDOMDislikes();
			      _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.previousState = _state__WEBPACK_IMPORTED_MODULE_2__/* .DISLIKED_STATE */ .Gv;
			    } else if (_state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.previousState === _state__WEBPACK_IMPORTED_MODULE_2__/* .DISLIKED_STATE */ .Gv) {
			      sendVote(0);
			      if (_state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.dislikes > 0) _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.dislikes--;
			      updateDOMDislikes();
			      _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.previousState = _state__WEBPACK_IMPORTED_MODULE_2__/* .NEUTRAL_STATE */ .kQ;
			    } else if (_state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.previousState === _state__WEBPACK_IMPORTED_MODULE_2__/* .LIKED_STATE */ .AV) {
			      sendVote(-1);
			      if (_state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.likes > 0) _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.likes--;
			      _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.dislikes++;
			      updateDOMDislikes();
			      _state__WEBPACK_IMPORTED_MODULE_2__/* .storedData */ .vk.previousState = _state__WEBPACK_IMPORTED_MODULE_2__/* .DISLIKED_STATE */ .Gv;
			      if (_state__WEBPACK_IMPORTED_MODULE_2__/* .extConfig */ .zO.numberDisplayReformatLikes === true) {
			        const nativeLikes = (0,_state__WEBPACK_IMPORTED_MODULE_2__/* .getLikeCountFromButton */ .m8)();
			        if (nativeLikes !== false) {
			          (0,_state__WEBPACK_IMPORTED_MODULE_2__/* .setLikes */ .Xq)((0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .numberFormat */ .Y4)(nativeLikes));
			        }
			      }
			    }
			  }
			}
			
			function addLikeDislikeEventListener() {
			  if (window.rydPreNavigateLikeButton !== (0,_buttons__WEBPACK_IMPORTED_MODULE_1__/* .getLikeButton */ .yN)()) {
			    (0,_buttons__WEBPACK_IMPORTED_MODULE_1__/* .getLikeButton */ .yN)().addEventListener("click", likeClicked);
			    (0,_buttons__WEBPACK_IMPORTED_MODULE_1__/* .getLikeButton */ .yN)().addEventListener("touchstart", likeClicked);
			    if ((0,_buttons__WEBPACK_IMPORTED_MODULE_1__/* .getDislikeButton */ .x8)()) {
			      (0,_buttons__WEBPACK_IMPORTED_MODULE_1__/* .getDislikeButton */ .x8)().addEventListener("click", dislikeClicked);
			      (0,_buttons__WEBPACK_IMPORTED_MODULE_1__/* .getDislikeButton */ .x8)().addEventListener("touchstart", dislikeClicked);
			      (0,_buttons__WEBPACK_IMPORTED_MODULE_1__/* .getDislikeButton */ .x8)().addEventListener("focusin", updateDOMDislikes);
			      (0,_buttons__WEBPACK_IMPORTED_MODULE_1__/* .getDislikeButton */ .x8)().addEventListener("focusout", updateDOMDislikes);
			    }
			    window.rydPreNavigateLikeButton = (0,_buttons__WEBPACK_IMPORTED_MODULE_1__/* .getLikeButton */ .yN)();
			  }
			}
			
			let smartimationObserver = null;
			
			function createSmartimationObserver() {
			  if (!smartimationObserver) {
			    smartimationObserver = (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .createObserver */ .zo)(
			      {
			        attributes: true,
			        subtree: true,
			        childList: true,
			      },
			      updateDOMDislikes,
			    );
			    smartimationObserver.container = null;
			  }
			
			  const smartimationContainer = (0,_buttons__WEBPACK_IMPORTED_MODULE_1__/* .getButtons */ .hS)().querySelector("yt-smartimation");
			  if (
			    smartimationContainer &&
			    smartimationObserver.container != smartimationContainer
			  ) {
			    (0,_utils__WEBPACK_IMPORTED_MODULE_0__/* .cLog */ .D2)("Initializing smartimation mutation observer");
			    smartimationObserver.disconnect();
			    smartimationObserver.observe(smartimationContainer);
			    smartimationObserver.container = smartimationContainer;
			  }
			}
			
			function storageChangeHandler(changes, area) {
			  if (changes.disableVoteSubmission !== undefined) {
			    handleDisableVoteSubmissionChangeEvent(
			      changes.disableVoteSubmission.newValue,
			    );
			  }
			  if (changes.coloredThumbs !== undefined) {
			    handleColoredThumbsChangeEvent(changes.coloredThumbs.newValue);
			  }
			  if (changes.coloredBar !== undefined) {
			    handleColoredBarChangeEvent(changes.coloredBar.newValue);
			  }
			  if (changes.colorTheme !== undefined) {
			    handleColorThemeChangeEvent(changes.colorTheme.newValue);
			  }
			  if (changes.numberDisplayFormat !== undefined) {
			    handleNumberDisplayFormatChangeEvent(changes.numberDisplayFormat.newValue);
			  }
			  if (changes.numberDisplayReformatLikes !== undefined) {
			    handleNumberDisplayReformatLikesChangeEvent(
			      changes.numberDisplayReformatLikes.newValue,
			    );
			  }
			}
			
			function handleDisableVoteSubmissionChangeEvent(value) {
			  _state__WEBPACK_IMPORTED_MODULE_2__/* .extConfig */ .zO.disableVoteSubmission = value;
			}
			
			function handleColoredThumbsChangeEvent(value) {
			  _state__WEBPACK_IMPORTED_MODULE_2__/* .extConfig */ .zO.coloredThumbs = value;
			}
			
			function handleColoredBarChangeEvent(value) {
			  _state__WEBPACK_IMPORTED_MODULE_2__/* .extConfig */ .zO.coloredBar = value;
			}
			
			function handleColorThemeChangeEvent(value) {
			  if (!value) value = "classic";
			  _state__WEBPACK_IMPORTED_MODULE_2__/* .extConfig */ .zO.colorTheme = value;
			}
			
			function handleNumberDisplayFormatChangeEvent(value) {
			  _state__WEBPACK_IMPORTED_MODULE_2__/* .extConfig */ .zO.numberDisplayFormat = value;
			}
			
			function handleNumberDisplayReformatLikesChangeEvent(value) {
			  _state__WEBPACK_IMPORTED_MODULE_2__/* .extConfig */ .zO.numberDisplayReformatLikes = value;
			}
			
			
			
			
			/***/ }),
			
			/***/ 935:
			/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
			
			/* harmony export */ __webpack_require__.d(__webpack_exports__, {
			/* harmony export */   $L: () => (/* binding */ isLikesDisabled),
			/* harmony export */   AV: () => (/* binding */ LIKED_STATE),
			/* harmony export */   Gv: () => (/* binding */ DISLIKED_STATE),
			/* harmony export */   KY: () => (/* binding */ setInitialState),
			/* harmony export */   MB: () => (/* binding */ isRoundedDesign),
			/* harmony export */   Xq: () => (/* binding */ setLikes),
			/* harmony export */   am: () => (/* binding */ isNewDesign),
			/* harmony export */   kQ: () => (/* binding */ NEUTRAL_STATE),
			/* harmony export */   m8: () => (/* binding */ getLikeCountFromButton),
			/* harmony export */   ol: () => (/* binding */ isShorts),
			/* harmony export */   qg: () => (/* binding */ initExtConfig),
			/* harmony export */   r6: () => (/* binding */ setDislikes),
			/* harmony export */   tq: () => (/* binding */ isMobile),
			/* harmony export */   vk: () => (/* binding */ storedData),
			/* harmony export */   zO: () => (/* binding */ extConfig)
			/* harmony export */ });
			/* unused harmony exports isVideoDisliked, isVideoLiked, getState, setState */
			/* harmony import */ var _buttons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(423);
			/* harmony import */ var _bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(910);
			/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(67);
			
			
			
			
			//TODO: Do not duplicate here and in ryd.background.js
			const apiUrl = "https://returnyoutubedislikeapi.com";
			const LIKED_STATE = "LIKED_STATE";
			const DISLIKED_STATE = "DISLIKED_STATE";
			const NEUTRAL_STATE = "NEUTRAL_STATE";
			
			let extConfig = {
			  disableVoteSubmission: false,
			  disableLogging: false,
			  coloredThumbs: false,
			  coloredBar: false,
			  colorTheme: "classic",
			  numberDisplayFormat: "compactShort",
			  showTooltipPercentage: false,
			  tooltipPercentageMode: "dash_like",
			  numberDisplayReformatLikes: false,
			  selectors: {
			    dislikeTextContainer: [],
			    likeTextContainer: [],
			    buttons: {
			      shorts: {
			        mobile: [],
			        desktop: [],
			      },
			      regular: {
			        mobile: [],
			        desktopMenu: [],
			        desktopNoMenu: [],
			      },
			      likeButton: {
			        segmented: [],
			        segmentedGetButtons: [],
			        notSegmented: [],
			      },
			      dislikeButton: {
			        segmented: [],
			        segmentedGetButtons: [],
			        notSegmented: [],
			      },
			    },
			    menuContainer: [],
			    roundedDesign: [],
			  },
			};
			
			let storedData = {
			  likes: 0,
			  dislikes: 0,
			  previousState: NEUTRAL_STATE,
			};
			
			function isMobile() {
			  return location.hostname == "m.youtube.com";
			}
			
			function isShorts() {
			  return location.pathname.startsWith("/shorts");
			}
			
			function isNewDesign() {
			  return document.getElementById("comment-teaser") !== null;
			}
			
			function isRoundedDesign() {
			  return (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .querySelector */ .R2)(extConfig.selectors.roundedDesign) !== null;
			}
			
			let shortsObserver = null;
			
			if (isShorts() && !shortsObserver) {
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .cLog */ .D2)("Initializing shorts mutation observer");
			  shortsObserver = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .createObserver */ .zo)(
			    {
			      attributes: true,
			    },
			    (mutationList) => {
			      mutationList.forEach((mutation) => {
			        if (
			          mutation.type === "attributes" &&
			          mutation.target.nodeName === "TP-YT-PAPER-BUTTON" &&
			          mutation.target.id === "button"
			        ) {
			          // cLog('Short thumb button status changed');
			          if (mutation.target.getAttribute("aria-pressed") === "true") {
			            mutation.target.style.color =
			              mutation.target.parentElement.parentElement.id === "like-button"
			                ? (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getColorFromTheme */ .t4)(true)
			                : (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getColorFromTheme */ .t4)(false);
			          } else {
			            mutation.target.style.color = "unset";
			          }
			          return;
			        }
			        (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .cLog */ .D2)("Unexpected mutation observer event: " + mutation.target + mutation.type);
			      });
			    },
			  );
			}
			
			function isLikesDisabled() {
			  // return true if the like button's text doesn't contain any number
			  if (isMobile()) {
			    return /^\D*$/.test((0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getButtons */ .hS)().children[0].querySelector(".button-renderer-text").innerText);
			  }
			  return /^\D*$/.test((0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getLikeTextContainer */ .Eq)().innerText);
			}
			
			function isVideoLiked() {
			  if (isMobile()) {
			    return (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getLikeButton */ .yN)().querySelector("button").getAttribute("aria-label") === "true";
			  }
			  return (
			    (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getLikeButton */ .yN)().classList.contains("style-default-active") ||
			    (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getLikeButton */ .yN)().querySelector("button")?.getAttribute("aria-pressed") === "true"
			  );
			}
			
			function isVideoDisliked() {
			  if (isMobile()) {
			    return (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getDislikeButton */ .x8)().querySelector("button").getAttribute("aria-label") === "true";
			  }
			  return (
			    (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getDislikeButton */ .x8)().classList.contains("style-default-active") ||
			    (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getDislikeButton */ .x8)().querySelector("button")?.getAttribute("aria-pressed") === "true"
			  );
			}
			
			function getState(storedData) {
			  if (isVideoLiked()) {
			    return { current: LIKED_STATE, previous: storedData.previousState };
			  }
			  if (isVideoDisliked()) {
			    return { current: DISLIKED_STATE, previous: storedData.previousState };
			  }
			  return { current: NEUTRAL_STATE, previous: storedData.previousState };
			}
			
			//---   Sets The Likes And Dislikes Values   ---//
			function setLikes(likesCount) {
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .cLog */ .D2)(`SET likes ${likesCount}`);
			  (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getLikeTextContainer */ .Eq)().innerText = likesCount;
			}
			
			function setDislikes(dislikesCount) {
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .cLog */ .D2)(`SET dislikes ${dislikesCount}`);
			
			  const _container = (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getDislikeTextContainer */ .xP)();
			  _container?.removeAttribute("is-empty");
			
			  let _dislikeText
			  if (!isLikesDisabled()) {
			    if (isMobile()) {
			      (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getButtons */ .hS)().children[1].querySelector(".button-renderer-text").innerText = dislikesCount;
			      return;
			    }
			    _dislikeText = dislikesCount;
			  } else {
			    (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .cLog */ .D2)("likes count disabled by creator");
			    if (isMobile()) {
			      (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getButtons */ .hS)().children[1].querySelector(".button-renderer-text").innerText = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .localize */ .NC)("TextLikesDisabled");
			      return;
			    }
			    _dislikeText = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .localize */ .NC)("TextLikesDisabled");
			  }
			
			  if (_dislikeText != null && _container?.innerText !== _dislikeText) {
			    _container.innerText = _dislikeText;
			  }
			}
			
			function getLikeCountFromButton() {
			  try {
			    if (isShorts()) {
			      //Youtube Shorts don't work with this query. It's not necessary; we can skip it and still see the results.
			      //It should be possible to fix this function, but it's not critical to showing the dislike count.
			      return false;
			    }
			
			    let likeButton =
			      (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getLikeButton */ .yN)().querySelector("yt-formatted-string#text") ?? (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getLikeButton */ .yN)().querySelector("button");
			
			    let likesStr = likeButton.getAttribute("aria-label").replace(/\D/g, "");
			    return likesStr.length > 0 ? parseInt(likesStr) : false;
			  } catch {
			    return false;
			  }
			}
			
			function processResponse(response, storedData) {
			  const formattedDislike = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .numberFormat */ .Y4)(response.dislikes);
			  setDislikes(formattedDislike);
			  if (extConfig.numberDisplayReformatLikes === true) {
			    const nativeLikes = getLikeCountFromButton();
			    if (nativeLikes !== false) {
			      setLikes((0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .numberFormat */ .Y4)(nativeLikes));
			    }
			  }
			  storedData.dislikes = parseInt(response.dislikes);
			  storedData.likes = getLikeCountFromButton() || parseInt(response.likes);
			  (0,_bar__WEBPACK_IMPORTED_MODULE_1__/* .createRateBar */ .k)(storedData.likes, storedData.dislikes);
			  if (extConfig.coloredThumbs === true) {
			    if (isShorts()) {
			      // for shorts, leave deactivated buttons in default color
			      let shortLikeButton = (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getLikeButton */ .yN)().querySelector("tp-yt-paper-button#button");
			      let shortDislikeButton = (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getDislikeButton */ .x8)().querySelector("tp-yt-paper-button#button");
			      if (shortLikeButton.getAttribute("aria-pressed") === "true") {
			        shortLikeButton.style.color = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getColorFromTheme */ .t4)(true);
			      }
			      if (shortDislikeButton.getAttribute("aria-pressed") === "true") {
			        shortDislikeButton.style.color = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getColorFromTheme */ .t4)(false);
			      }
			      shortsObserver.observe(shortLikeButton);
			      shortsObserver.observe(shortDislikeButton);
			    } else {
			      (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getLikeButton */ .yN)().style.color = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getColorFromTheme */ .t4)(true);
			      (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getDislikeButton */ .x8)().style.color = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getColorFromTheme */ .t4)(false);
			    }
			  }
			  //Temporary disabling this - it breaks all places where getButtons()[1] is used
			  // createStarRating(response.rating, isMobile());
			}
			
			// Tells the user if the API is down
			function displayError(error) {
			  (0,_buttons__WEBPACK_IMPORTED_MODULE_0__/* .getDislikeTextContainer */ .xP)().innerText = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .localize */ .NC)("textTempUnavailable");
			}
			
			async function setState(storedData) {
			  storedData.previousState = isVideoDisliked() ? DISLIKED_STATE : isVideoLiked() ? LIKED_STATE : NEUTRAL_STATE;
			  let statsSet = false;
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .cLog */ .D2)("Video is loaded. Adding buttons...");
			
			  let videoId = (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getVideoId */ .gJ)(window.location.href);
			  let likeCount = getLikeCountFromButton() || null;
			
			  let response = await fetch(`${apiUrl}/votes?videoId=${videoId}&likeCount=${likeCount || ""}`, {
			    method: "GET",
			    headers: {
			      Accept: "application/json",
			    },
			  })
			    .then((response) => {
			      if (!response.ok) displayError(response.error);
			      return response;
			    })
			    .then((response) => response.json())
			    .catch(displayError);
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .cLog */ .D2)("response from api:");
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .cLog */ .D2)(JSON.stringify(response));
			  if (response !== undefined && !("traceId" in response) && !statsSet) {
			    processResponse(response, storedData);
			  }
			}
			
			async function setInitialState() {
			  await setState(storedData);
			}
			
			async function initExtConfig() {
			  initializeDisableVoteSubmission();
			  initializeDisableLogging();
			  initializeColoredThumbs();
			  initializeColoredBar();
			  initializeColorTheme();
			  initializeNumberDisplayFormat();
			  initializeTooltipPercentage();
			  initializeTooltipPercentageMode();
			  initializeNumberDisplayReformatLikes();
			  await initializeSelectors();
			}
			
			async function initializeSelectors() {
			  console.log("initializing selectors");
			  let result = await fetch(`${apiUrl}/configs/selectors`, {
			    method: "GET",
			    headers: {
			      Accept: "application/json",
			    },
			  })
			    .then((response) => response.json())
			    .catch((error) => {});
			  extConfig.selectors = result ?? extConfig.selectors;
			  console.log(result);
			}
			
			function initializeDisableVoteSubmission() {
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.get(["disableVoteSubmission"], (res) => {
			    if (res.disableVoteSubmission === undefined) {
			      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.set({ disableVoteSubmission: false });
			    } else {
			      extConfig.disableVoteSubmission = res.disableVoteSubmission;
			    }
			  });
			}
			
			function initializeDisableLogging() {
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.get(["disableLogging"], (res) => {
			    if (res.disableLogging === undefined) {
			      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.set({ disableLogging: true });
			    } else {
			      extConfig.disableLogging = res.disableLogging;
			    }
			  });
			}
			
			function initializeColoredThumbs() {
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.get(["coloredThumbs"], (res) => {
			    if (res.coloredThumbs === undefined) {
			      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.set({ coloredThumbs: false });
			    } else {
			      extConfig.coloredThumbs = res.coloredThumbs;
			    }
			  });
			}
			
			function initializeColoredBar() {
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.get(["coloredBar"], (res) => {
			    if (res.coloredBar === undefined) {
			      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.set({ coloredBar: false });
			    } else {
			      extConfig.coloredBar = res.coloredBar;
			    }
			  });
			}
			
			function initializeColorTheme() {
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.get(["colorTheme"], (res) => {
			    if (res.colorTheme === undefined) {
			      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.set({ colorTheme: false });
			    } else {
			      extConfig.colorTheme = res.colorTheme;
			    }
			  });
			}
			
			function initializeNumberDisplayFormat() {
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.get(["numberDisplayFormat"], (res) => {
			    if (res.numberDisplayFormat === undefined) {
			      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.set({ numberDisplayFormat: "compactShort" });
			    } else {
			      extConfig.numberDisplayFormat = res.numberDisplayFormat;
			    }
			  });
			}
			
			function initializeTooltipPercentage() {
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.get(["showTooltipPercentage"], (res) => {
			    if (res.showTooltipPercentage === undefined) {
			      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.set({ showTooltipPercentage: false });
			    } else {
			      extConfig.showTooltipPercentage = res.showTooltipPercentage;
			    }
			  });
			}
			
			function initializeTooltipPercentageMode() {
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.get(["tooltipPercentageMode"], (res) => {
			    if (res.tooltipPercentageMode === undefined) {
			      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.set({ tooltipPercentageMode: "dash_like" });
			    } else {
			      extConfig.tooltipPercentageMode = res.tooltipPercentageMode;
			    }
			  });
			}
			
			function initializeNumberDisplayReformatLikes() {
			  (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.get(["numberDisplayReformatLikes"], (res) => {
			    if (res.numberDisplayReformatLikes === undefined) {
			      (0,_utils__WEBPACK_IMPORTED_MODULE_2__/* .getBrowser */ .qs)().storage.sync.set({ numberDisplayReformatLikes: false });
			    } else {
			      extConfig.numberDisplayReformatLikes = res.numberDisplayReformatLikes;
			    }
			  });
			}
			
			
			
			
			/***/ }),
			
			/***/ 67:
			/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
			
			/* harmony export */ __webpack_require__.d(__webpack_exports__, {
			/* harmony export */   D2: () => (/* binding */ cLog),
			/* harmony export */   NC: () => (/* binding */ localize),
			/* harmony export */   R2: () => (/* binding */ querySelector),
			/* harmony export */   Wb: () => (/* binding */ querySelectorAll),
			/* harmony export */   Y4: () => (/* binding */ numberFormat),
			/* harmony export */   gJ: () => (/* binding */ getVideoId),
			/* harmony export */   qs: () => (/* binding */ getBrowser),
			/* harmony export */   t4: () => (/* binding */ getColorFromTheme),
			/* harmony export */   v4: () => (/* binding */ isInViewport),
			/* harmony export */   x8: () => (/* binding */ isVideoLoaded),
			/* harmony export */   zo: () => (/* binding */ createObserver)
			/* harmony export */ });
			/* unused harmony export getNumberFormatter */
			/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(935);
			
			
			function numberFormat(numberState) {
			  return getNumberFormatter(_state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.numberDisplayFormat).format(numberState);
			}
			
			function getNumberFormatter(optionSelect) {
			  let userLocales;
			  if (document.documentElement.lang) {
			    userLocales = document.documentElement.lang;
			  } else if (navigator.language) {
			    userLocales = navigator.language;
			  } else {
			    try {
			      userLocales = new URL(
			        Array.from(document.querySelectorAll("head > link[rel='search']"))
			          ?.find((n) => n?.getAttribute("href")?.includes("?locale="))
			          ?.getAttribute("href"),
			      )?.searchParams?.get("locale");
			    } catch {
			      cLog("Cannot find browser locale. Use en as default for number formatting.");
			      userLocales = "en";
			    }
			  }
			
			  let formatterNotation;
			  let formatterCompactDisplay;
			  switch (optionSelect) {
			    case "compactLong":
			      formatterNotation = "compact";
			      formatterCompactDisplay = "long";
			      break;
			    case "standard":
			      formatterNotation = "standard";
			      formatterCompactDisplay = "short";
			      break;
			    case "compactShort":
			    default:
			      formatterNotation = "compact";
			      formatterCompactDisplay = "short";
			  }
			
			  const formatter = Intl.NumberFormat(userLocales, {
			    notation: formatterNotation,
			    compactDisplay: formatterCompactDisplay,
			  });
			  return formatter;
			}
			
			function localize(localeString) {
			  return chrome.i18n.getMessage(localeString);
			}
			
			function getBrowser() {
			  if (typeof chrome !== "undefined" && typeof chrome.runtime !== "undefined") {
			    return chrome;
			  } else if (typeof browser !== "undefined" && typeof browser.runtime !== "undefined") {
			    return browser;
			  } else {
			    console.log("browser is not supported");
			    return false;
			  }
			}
			
			function getVideoId(url) {
			  const urlObject = new URL(url);
			  const pathname = urlObject.pathname;
			  if (pathname.startsWith("/clip")) {
			    return (document.querySelector("meta[itemprop='videoId']") || document.querySelector("meta[itemprop='identifier']"))
			      .content;
			  } else {
			    if (pathname.startsWith("/shorts")) {
			      return pathname.slice(8);
			    }
			    return urlObject.searchParams.get("v");
			  }
			}
			
			function isInViewport(element) {
			  const rect = element.getBoundingClientRect();
			  const height = innerHeight || document.documentElement.clientHeight;
			  const width = innerWidth || document.documentElement.clientWidth;
			  return (
			    // When short (channel) is ignored, the element (like/dislike AND short itself) is
			    // hidden with a 0 DOMRect. In this case, consider it outside of Viewport
			    !(rect.top == 0 && rect.left == 0 && rect.bottom == 0 && rect.right == 0) &&
			    rect.top >= 0 &&
			    rect.left >= 0 &&
			    rect.bottom <= height &&
			    rect.right <= width
			  );
			}
			
			function isVideoLoaded() {
			  const videoId = getVideoId(window.location.href);
			  return (
			    // desktop: spring 2024 UI
			    document.querySelector(`ytd-watch-grid[video-id='${videoId}']`) !== null ||
			    // desktop: older UI
			    document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null ||
			    // mobile: no video-id attribute
			    document.querySelector('#player[loading="false"]:not([hidden])') !== null
			  );
			}
			
			function cLog(message, writer) {
			  if (!_state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.disableLogging) {
			    message = `[return youtube dislike]: ${message}`;
			    if (writer) {
			      writer(message);
			    } else {
			      console.log(message);
			    }
			  }
			}
			
			function getColorFromTheme(voteIsLike) {
			  let colorString;
			  switch (_state__WEBPACK_IMPORTED_MODULE_0__/* .extConfig */ .zO.colorTheme) {
			    case "accessible":
			      if (voteIsLike === true) {
			        colorString = "dodgerblue";
			      } else {
			        colorString = "gold";
			      }
			      break;
			    case "neon":
			      if (voteIsLike === true) {
			        colorString = "aqua";
			      } else {
			        colorString = "magenta";
			      }
			      break;
			    case "classic":
			    default:
			      if (voteIsLike === true) {
			        colorString = "lime";
			      } else {
			        colorString = "red";
			      }
			  }
			  return colorString;
			}
			
			function querySelector(selectors, element) {
			  let result;
			  for (const selector of selectors) {
			    result = (element ?? document).querySelector(selector);
			    if (result !== null) {
			      return result;
			    }
			  }
			}
			
			function querySelectorAll(selectors) {
			  let result;
			  for (const selector of selectors) {
			    result = document.querySelectorAll(selector);
			    if (result.length !== 0) {
			      return result;
			    }
			  }
			  return result;
			}
			
			function createObserver(options, callback) {
			  const observerWrapper = new Object();
			  observerWrapper.options = options;
			  observerWrapper.observer = new MutationObserver(callback);
			  observerWrapper.observe = function (element) {
			    this.observer.observe(element, this.options);
			  };
			  observerWrapper.disconnect = function () {
			    this.observer.disconnect();
			  };
			  return observerWrapper;
			}
			
			
			
			
			/***/ })
			
			/******/ 	});
			/************************************************************************/
			/******/ 	// The module cache
			/******/ 	var __webpack_module_cache__ = {};
			/******/ 	
			/******/ 	// The require function
			/******/ 	function __webpack_require__(moduleId) {
			/******/ 		// Check if module is in cache
			/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
			/******/ 		if (cachedModule !== undefined) {
			/******/ 			return cachedModule.exports;
			/******/ 		}
			/******/ 		// Create a new module (and put it into the cache)
			/******/ 		var module = __webpack_module_cache__[moduleId] = {
			/******/ 			// no module.id needed
			/******/ 			// no module.loaded needed
			/******/ 			exports: {}
			/******/ 		};
			/******/ 	
			/******/ 		// Execute the module function
			/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
			/******/ 	
			/******/ 		// Return the exports of the module
			/******/ 		return module.exports;
			/******/ 	}
			/******/ 	
			/************************************************************************/
			/******/ 	/* webpack/runtime/async module */
			/******/ 	(() => {
			/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
			/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
			/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
			/******/ 		var resolveQueue = (queue) => {
			/******/ 			if(queue && queue.d < 1) {
			/******/ 				queue.d = 1;
			/******/ 				queue.forEach((fn) => (fn.r--));
			/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
			/******/ 			}
			/******/ 		}
			/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
			/******/ 			if(dep !== null && typeof dep === "object") {
			/******/ 				if(dep[webpackQueues]) return dep;
			/******/ 				if(dep.then) {
			/******/ 					var queue = [];
			/******/ 					queue.d = 0;
			/******/ 					dep.then((r) => {
			/******/ 						obj[webpackExports] = r;
			/******/ 						resolveQueue(queue);
			/******/ 					}, (e) => {
			/******/ 						obj[webpackError] = e;
			/******/ 						resolveQueue(queue);
			/******/ 					});
			/******/ 					var obj = {};
			/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
			/******/ 					return obj;
			/******/ 				}
			/******/ 			}
			/******/ 			var ret = {};
			/******/ 			ret[webpackQueues] = x => {};
			/******/ 			ret[webpackExports] = dep;
			/******/ 			return ret;
			/******/ 		}));
			/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
			/******/ 			var queue;
			/******/ 			hasAwait && ((queue = []).d = -1);
			/******/ 			var depQueues = new Set();
			/******/ 			var exports = module.exports;
			/******/ 			var currentDeps;
			/******/ 			var outerResolve;
			/******/ 			var reject;
			/******/ 			var promise = new Promise((resolve, rej) => {
			/******/ 				reject = rej;
			/******/ 				outerResolve = resolve;
			/******/ 			});
			/******/ 			promise[webpackExports] = exports;
			/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
			/******/ 			module.exports = promise;
			/******/ 			body((deps) => {
			/******/ 				currentDeps = wrapDeps(deps);
			/******/ 				var fn;
			/******/ 				var getResult = () => (currentDeps.map((d) => {
			/******/ 					if(d[webpackError]) throw d[webpackError];
			/******/ 					return d[webpackExports];
			/******/ 				}))
			/******/ 				var promise = new Promise((resolve) => {
			/******/ 					fn = () => (resolve(getResult));
			/******/ 					fn.r = 0;
			/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
			/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
			/******/ 				});
			/******/ 				return fn.r ? promise : getResult();
			/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
			/******/ 			queue && queue.d < 0 && (queue.d = 0);
			/******/ 		};
			/******/ 	})();
			/******/ 	
			/******/ 	/* webpack/runtime/define property getters */
			/******/ 	(() => {
			/******/ 		// define getter functions for harmony exports
			/******/ 		__webpack_require__.d = (exports, definition) => {
			/******/ 			for(var key in definition) {
			/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
			/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
			/******/ 				}
			/******/ 			}
			/******/ 		};
			/******/ 	})();
			/******/ 	
			/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
			/******/ 	(() => {
			/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
			/******/ 	})();
			/******/ 	
			/************************************************************************/
			/******/ 	
			/******/ 	// startup
			/******/ 	// Load entry module and return exports
			/******/ 	// This entry module used 'module' so it can't be inlined
			/******/ 	var __webpack_exports__ = __webpack_require__(805);
			/******/ 	
			/******/ })()
			;
			// END: ryd.content-script.js
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
			  return new Promise((resolve) => {
			    const DURATION = 100;
			    const backdrop = document.getElementById("extension-options-backdrop");
			    const modal = document.getElementById("extension-options-modal");
			
			    if (!backdrop || !modal) {
			      return resolve();
			    }
			
			    modal.style.animation = `modalCloseAnimation ${DURATION / 1000}s ease-out forwards`;
			    backdrop.style.animation = `backdropFadeOut ${DURATION / 1000}s ease-out forwards`;
			
			    setTimeout(() => {
			      if (confirm("Close options and reload the page?")) {
			        window.location.reload(); // Note: This will stop further execution
			      } else {
			        backdrop.remove();
			      }
			      resolve();
			    }, DURATION);
			  });
			}
			
			function closePopupModal() {
			  return new Promise((resolve) => {
			    const DURATION = 100;
			    const backdrop = document.getElementById("extension-popup-backdrop");
			    const modal = document.getElementById("extension-popup-modal");
			
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
			  if (!POPUP_PAGE_PATH || typeof EXTENSION_ASSETS_MAP === "undefined") {
			    _warn("No popup page available.");
			    return;
			  }
			  await openModal({
			    type: "popup",
			    pagePath: POPUP_PAGE_PATH,
			    defaultTitle: "Extension Popup",
			    closeFn: closePopupModal,
			  });
			}
			
			async function openOptionsPage() {
			  if (!OPTIONS_PAGE_PATH || typeof EXTENSION_ASSETS_MAP === "undefined") {
			    _warn("No options page available.");
			    return;
			  }
			  await openModal({
			    type: "options",
			    pagePath: OPTIONS_PAGE_PATH,
			    defaultTitle: "Extension Options",
			    closeFn: closeOptionsModal,
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
			  const otherType = type === "popup" ? "options" : "popup";
			  const otherBackdrop = document.getElementById(
			    `extension-${otherType}-backdrop`
			  );
			  if (otherBackdrop) {
			    // Await the correct close function
			    await (otherType === "popup" ? closePopupModal() : closeOptionsModal());
			  }
			
			  let backdrop = document.getElementById(backdropId);
			  let modal, iframe;
			
			  if (!backdrop) {
			    backdrop = document.createElement("div");
			    backdrop.id = backdropId;
			    backdrop.className = "extension-backdrop";
			
			    modal = document.createElement("div");
			    modal.id = modalId;
			    modal.className = `extension-modal ${sizeClass}`;
			
			    const extensionName = INJECTED_MANIFEST.name || defaultTitle;
			    const iconSrc =
			      EXTENSION_ICON ||
			      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik00IDdoM2ExIDEgMCAwIDAgMSAtMXYtMWEyIDIgMCAwIDEgNCAwdjFhMSAxIDAgMCAwIDEgMWgzYTEgMSAwIDAgMSAxIDF2M2ExIDEgMCAwIDAgMSAxaDFhMiAyIDAgMCAxIDAgNGgtMWExIDEgMCAwIDAgLTEgMXYzYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtMWEyIDIgMCAwIDAgLTQgMHYxYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMWgxYTIgMiAwIDAgMCAwIC00aC0xYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMSIgLz48L3N2Zz4=";
			
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
			
			    backdrop.addEventListener("click", (e) => {
			      if (e.target === backdrop) closeFn();
			    });
			    modal.querySelector(".close-button").addEventListener("click", closeFn);
			
			    document.body.appendChild(backdrop);
			    iframe = modal.querySelector("iframe");
			  } else {
			    // If it already exists, just make sure it's visible
			    backdrop.style.display = "flex";
			    modal = backdrop.querySelector(".extension-modal");
			    iframe = modal.querySelector("iframe");
			  }
			
			  // Load content into iframe
			  try {
			    const polyfillString = generateCompletePolyfillForIframe();
			    const doc = new DOMParser().parseFromString(html, "text/html");
			    const script = doc.createElement("script");
			    script.textContent = polyfillString;
			    doc.head.insertAdjacentElement("afterbegin", script);
			    iframe.srcdoc = doc.documentElement.outerHTML;
			  } catch (e) {
			    _error("Error generating complete polyfill for iframe", e);
			    iframe.srcdoc = html;
			  }
			}
			
			function generateCompletePolyfillForIframe() {
			  const polyfillString = "\n// -- Messaging implementation\n\nfunction createEventBus(\n  scopeId,\n  type = \"page\", // \"page\" or \"iframe\"\n  { allowedOrigin = \"*\", children = [], parentWindow = null } = {}\n) {\n  if (!scopeId) throw new Error(\"createEventBus requires a scopeId\");\n\n  const handlers = {};\n\n  function handleIncoming(ev) {\n    if (allowedOrigin !== \"*\" && ev.origin !== allowedOrigin) return;\n\n    const msg = ev.data;\n    if (!msg || msg.__eventBus !== true || msg.scopeId !== scopeId) return;\n\n    const { event, payload } = msg;\n\n    // PAGE: if it's an INIT from an iframe, adopt it\n    if (type === \"page\" && event === \"__INIT__\") {\n      const win = ev.source;\n      if (win && !children.includes(win)) {\n        children.push(win);\n      }\n      return;\n    }\n\n    (handlers[event] || []).forEach((fn) =>\n      fn(payload, { origin: ev.origin, source: ev.source })\n    );\n  }\n\n  window.addEventListener(\"message\", handleIncoming);\n\n  function emitTo(win, event, payload) {\n    const envelope = {\n      __eventBus: true,\n      scopeId,\n      event,\n      payload,\n    };\n    win.postMessage(envelope, allowedOrigin);\n  }\n\n  // IFRAME: announce to page on startup\n  if (type === \"iframe\") {\n    setTimeout(() => {\n      const pw = parentWindow || window.parent;\n      if (pw && pw.postMessage) {\n        emitTo(pw, \"__INIT__\", null);\n      }\n    }, 0);\n  }\n\n  return {\n    on(event, fn) {\n      handlers[event] = handlers[event] || [];\n      handlers[event].push(fn);\n    },\n    off(event, fn) {\n      if (!handlers[event]) return;\n      handlers[event] = handlers[event].filter((h) => h !== fn);\n    },\n    /**\n     * Emits an event.\n     * @param {string} event - The event name.\n     * @param {any} payload - The event payload.\n     * @param {object} [options] - Emission options.\n     * @param {Window} [options.to] - A specific window to target. If provided, message is ONLY sent to the target.\n     */\n    emit(event, payload, { to } = {}) {\n      // If a specific target window is provided, send only to it and DO NOT dispatch locally.\n      // This prevents a port from receiving its own messages.\n      if (to) {\n        if (to && typeof to.postMessage === \"function\") {\n          emitTo(to, event, payload);\n        }\n        return; // Exit after targeted send.\n      }\n\n      // For broadcast messages (no 'to' target), dispatch locally first.\n      (handlers[event] || []).forEach((fn) =>\n        fn(payload, { origin: location.origin, source: window })\n      );\n\n      // Then propagate the broadcast to other windows.\n      if (type === \"page\") {\n        children.forEach((win) => emitTo(win, event, payload));\n      } else {\n        const pw = parentWindow || window.parent;\n        if (pw && pw.postMessage) {\n          emitTo(pw, event, payload);\n        }\n      }\n    },\n  };\n}\n\nfunction createRuntime(type = \"background\", bus) {\n  let nextId = 1;\n  const pending = {};\n  const msgListeners = [];\n\n  let nextPortId = 1;\n  const ports = {};\n  const onConnectListeners = [];\n\n  function parseArgs(args) {\n    let target, message, options, callback;\n    const arr = [...args];\n    if (arr.length === 0) {\n      throw new Error(\"sendMessage requires at least one argument\");\n    }\n    if (arr.length === 1) {\n      return { message: arr[0] };\n    }\n    // last object could be options\n    if (\n      arr.length &&\n      typeof arr[arr.length - 1] === \"object\" &&\n      !Array.isArray(arr[arr.length - 1])\n    ) {\n      options = arr.pop();\n    }\n    // last function is callback\n    if (arr.length && typeof arr[arr.length - 1] === \"function\") {\n      callback = arr.pop();\n    }\n    if (\n      arr.length === 2 &&\n      (typeof arr[0] === \"string\" || typeof arr[0] === \"number\")\n    ) {\n      [target, message] = arr;\n    } else {\n      [message] = arr;\n    }\n    return { target, message, options, callback };\n  }\n\n  if (type === \"background\") {\n    bus.on(\"__REQUEST__\", ({ id, message }, { source }) => {\n      let responded = false,\n        isAsync = false;\n      function sendResponse(resp) {\n        if (responded) return;\n        responded = true;\n        // Target the response directly back to the window that sent the request.\n        bus.emit(\"__RESPONSE__\", { id, response: resp }, { to: source });\n      }\n      const results = msgListeners\n        .map((fn) => {\n          try {\n            // msg, sender, sendResponse\n            const ret = fn(message, { id, tab: { id: source } }, sendResponse);\n            if (ret === true || (ret && typeof ret.then === \"function\")) {\n              isAsync = true;\n              return ret;\n            }\n            return ret;\n          } catch (e) {\n            _error(e);\n          }\n        })\n        .filter((r) => r !== undefined);\n\n      const promises = results.filter((r) => r && typeof r.then === \"function\");\n      if (!isAsync && promises.length === 0) {\n        const out = results.length === 1 ? results[0] : results;\n        sendResponse(out);\n      } else if (promises.length) {\n        Promise.all(promises).then((vals) => {\n          if (!responded) {\n            const out = vals.length === 1 ? vals[0] : vals;\n            sendResponse(out);\n          }\n        });\n      }\n    });\n  }\n\n  if (type !== \"background\") {\n    bus.on(\"__RESPONSE__\", ({ id, response }) => {\n      const entry = pending[id];\n      if (!entry) return;\n      entry.resolve(response);\n      if (entry.callback) entry.callback(response);\n      delete pending[id];\n    });\n  }\n\n  function sendMessage(...args) {\n    // Background should be able to send message to itself\n    // if (type === \"background\") {\n    //   throw new Error(\"Background cannot sendMessage to itself\");\n    // }\n    const { target, message, callback } = parseArgs(args);\n    const id = nextId++;\n    const promise = new Promise((resolve) => {\n      pending[id] = { resolve, callback };\n      bus.emit(\"__REQUEST__\", { id, message });\n    });\n    return promise;\n  }\n\n  bus.on(\"__PORT_CONNECT__\", ({ portId, name }, { source }) => {\n    if (type !== \"background\") return;\n    const backgroundPort = makePort(\"background\", portId, name, source);\n    ports[portId] = backgroundPort;\n\n    onConnectListeners.forEach((fn) => fn(backgroundPort));\n\n    // send back a CONNECT_ACK so the client can\n    // start listening on its end:\n    bus.emit(\"__PORT_CONNECT_ACK__\", { portId, name }, { to: source });\n  });\n\n  // Clients handle the ACK and finalize their Port object by learning the remote window.\n  bus.on(\"__PORT_CONNECT_ACK__\", ({ portId, name }, { source }) => {\n    if (type === \"background\") return; // ignore\n    const p = ports[portId];\n    if (!p) return;\n    // Call the port's internal finalize method to complete the handshake\n    if (p._finalize) {\n      p._finalize(source);\n    }\n  });\n\n  // Any port message travels via \"__PORT_MESSAGE__\"\n  bus.on(\"__PORT_MESSAGE__\", (envelope, { source }) => {\n    const { portId } = envelope;\n    const p = ports[portId];\n    if (!p) return;\n    p._receive(envelope, source);\n  });\n\n  // Any port disconnect:\n  bus.on(\"__PORT_DISCONNECT__\", ({ portId }) => {\n    const p = ports[portId];\n    if (!p) return;\n    p._disconnect();\n    delete ports[portId];\n  });\n\n  // Refactored makePort to correctly manage internal state and the connection handshake.\n  function makePort(side, portId, name, remoteWindow) {\n    let onMessageHandlers = [];\n    let onDisconnectHandlers = [];\n    let buffer = [];\n    // Unique instance ID for this port instance\n    const instanceId = Math.random().toString(36).slice(2) + Date.now();\n    // These state variables are part of the closure and are updated by _finalize\n    let _ready = side === \"background\";\n\n    function _drainBuffer() {\n      buffer.forEach((m) => _post(m));\n      buffer = [];\n    }\n\n    function _post(msg) {\n      // Always use the 'to' parameter for port messages, making them directional.\n      // Include senderInstanceId\n      bus.emit(\n        \"__PORT_MESSAGE__\",\n        { portId, msg, senderInstanceId: instanceId },\n        { to: remoteWindow }\n      );\n    }\n\n    function postMessage(msg) {\n      if (!_ready) {\n        buffer.push(msg);\n      } else {\n        _post(msg);\n      }\n    }\n\n    function _receive(envelope, source) {\n      // envelope: { msg, senderInstanceId }\n      if (envelope.senderInstanceId === instanceId) return; // Don't dispatch to self\n      onMessageHandlers.forEach((fn) =>\n        fn(envelope.msg, { id: portId, tab: { id: source } })\n      );\n    }\n\n    function disconnect() {\n      // Also use the 'to' parameter for disconnect messages\n      bus.emit(\"__PORT_DISCONNECT__\", { portId }, { to: remoteWindow });\n      _disconnect();\n      delete ports[portId];\n    }\n\n    function _disconnect() {\n      onDisconnectHandlers.forEach((fn) => fn());\n      onMessageHandlers = [];\n      onDisconnectHandlers = [];\n    }\n\n    // This function is called on the client port when the ACK is received from background.\n    // It updates the port's state, completing the connection.\n    function _finalize(win) {\n      remoteWindow = win; // <-- This is the crucial part: learn the destination\n      _ready = true;\n      _drainBuffer();\n    }\n\n    return {\n      name,\n      sender: {\n        id: portId,\n      },\n      onMessage: {\n        addListener(fn) {\n          onMessageHandlers.push(fn);\n        },\n        removeListener(fn) {\n          onMessageHandlers = onMessageHandlers.filter((x) => x !== fn);\n        },\n      },\n      onDisconnect: {\n        addListener(fn) {\n          onDisconnectHandlers.push(fn);\n        },\n        removeListener(fn) {\n          onDisconnectHandlers = onDisconnectHandlers.filter((x) => x !== fn);\n        },\n      },\n      postMessage,\n      disconnect,\n      // Internal methods used by the runtime\n      _receive,\n      _disconnect,\n      _finalize, // Expose the finalizer for the ACK handler\n    };\n  }\n\n  function connect(connectInfo = {}) {\n    if (type === \"background\") {\n      throw new Error(\"Background must use onConnect, not connect()\");\n    }\n    const name = connectInfo.name || \"\";\n    const portId = nextPortId++;\n    // create the client side port\n    // remoteWindow is initially null; it will be set by _finalize upon ACK.\n    const clientPort = makePort(\"client\", portId, name, null);\n    ports[portId] = clientPort;\n\n    // fire the connect event across the bus\n    bus.emit(\"__PORT_CONNECT__\", { portId, name });\n    return clientPort;\n  }\n\n  function onConnect(fn) {\n    if (type !== \"background\") {\n      throw new Error(\"connect event only fires in background\");\n    }\n    onConnectListeners.push(fn);\n  }\n\n  return {\n    // rpc:\n    sendMessage,\n    onMessage: {\n      addListener(fn) {\n        msgListeners.push(fn);\n      },\n      removeListener(fn) {\n        const i = msgListeners.indexOf(fn);\n        if (i >= 0) msgListeners.splice(i, 1);\n      },\n    },\n\n    // port API:\n    connect,\n    onConnect: {\n      addListener(fn) {\n        onConnect(fn);\n      },\n      removeListener(fn) {\n        const i = onConnectListeners.indexOf(fn);\n        if (i >= 0) onConnectListeners.splice(i, 1);\n      },\n    },\n  };\n}\n\n\n// --- Abstraction Layer: PostMessage Target\n\nlet nextRequestId = 1;\nconst pendingRequests = new Map(); // requestId -> { resolve, reject, timeout }\n\nfunction sendAbstractionRequest(method, args = []) {\n  return new Promise((resolve, reject) => {\n    const requestId = nextRequestId++;\n\n    const timeout = setTimeout(() => {\n      pendingRequests.delete(requestId);\n      reject(new Error(`PostMessage request timeout for method: ${method}`));\n    }, 10000);\n\n    pendingRequests.set(requestId, { resolve, reject, timeout });\n\n    window.parent.postMessage({\n      type: \"abstraction-request\",\n      requestId,\n      method,\n      args,\n    });\n  });\n}\n\nwindow.addEventListener(\"message\", (event) => {\n  const { type, requestId, success, result, error } = event.data;\n\n  if (type === \"abstraction-response\") {\n    const pending = pendingRequests.get(requestId);\n    if (pending) {\n      clearTimeout(pending.timeout);\n      pendingRequests.delete(requestId);\n\n      if (success) {\n        pending.resolve(result);\n      } else {\n        const err = new Error(error.message);\n        err.stack = error.stack;\n        pending.reject(err);\n      }\n    }\n  }\n});\n\nasync function _storageSet(items) {\n  return sendAbstractionRequest(\"_storageSet\", [items]);\n}\n\nasync function _storageGet(keys) {\n  return sendAbstractionRequest(\"_storageGet\", [keys]);\n}\n\nasync function _storageRemove(keysToRemove) {\n  return sendAbstractionRequest(\"_storageRemove\", [keysToRemove]);\n}\n\nasync function _storageClear() {\n  return sendAbstractionRequest(\"_storageClear\");\n}\n\nasync function _cookieList(details) {\n  return sendAbstractionRequest(\"_cookieList\", [details]);\n}\n\nasync function _cookieSet(details) {\n  return sendAbstractionRequest(\"_cookieSet\", [details]);\n}\n\nasync function _cookieDelete(details) {\n  return sendAbstractionRequest(\"_cookieDelete\", [details]);\n}\n\nasync function _fetch(url, options) {\n  return sendAbstractionRequest(\"_fetch\", [url, options]);\n}\n\nfunction _registerMenuCommand(name, func) {\n  _warn(\"_registerMenuCommand called from iframe context:\", name);\n  return sendAbstractionRequest(\"_registerMenuCommand\", [\n    name,\n    func.toString(),\n  ]);\n}\n\nfunction _openTab(url, active) {\n  return sendAbstractionRequest(\"_openTab\", [url, active]);\n}\n\nasync function _initStorage() {\n  return sendAbstractionRequest(\"_initStorage\");\n}\n\n\nconst EXTENSION_ASSETS_MAP = {{EXTENSION_ASSETS_MAP}};\n\n// -- Polyfill Implementation\nfunction buildPolyfill({ isBackground = false, isOtherPage = false } = {}) {\n  // Generate a unique context ID for this polyfill instance\n  const contextType = isBackground\n    ? \"background\"\n    : isOtherPage\n      ? \"options\"\n      : \"content\";\n  const contextId = `${contextType}_${Math.random()\n    .toString(36)\n    .substring(2, 15)}`;\n\n  const IS_IFRAME = \"true\" === \"true\";\n  const BUS = (function () {\n    if (globalThis.__BUS) {\n      return globalThis.__BUS;\n    }\n    globalThis.__BUS = createEventBus(\n      \"return-youtube-dislike\",\n      IS_IFRAME ? \"iframe\" : \"page\",\n    );\n    return globalThis.__BUS;\n  })();\n  const RUNTIME = createRuntime(isBackground ? \"background\" : \"tab\", BUS);\n  const createNoopListeners = () => ({\n    addListener: (callback) => {\n      _log(\"addListener\", callback);\n    },\n    removeListener: (callback) => {\n      _log(\"removeListener\", callback);\n    },\n  });\n  // TODO: Stub\n  const storageChangeListeners = new Set();\n  function broadcastStorageChange(changes, areaName) {\n    storageChangeListeners.forEach((listener) => {\n      listener(changes, areaName);\n    });\n  }\n\n  let REQ_PERMS = [];\n\n  // --- Chrome polyfill\n  let chrome = {\n    extension: {\n      isAllowedIncognitoAccess: () => Promise.resolve(true),\n      sendMessage: (...args) => _messagingHandler.sendMessage(...args),\n    },\n    permissions: {\n      // TODO: Remove origin permission means exclude from origin in startup (when checking for content scripts)\n      request: (permissions, callback) => {\n        _log(\"permissions.request\", permissions, callback);\n        if (Array.isArray(permissions)) {\n          REQ_PERMS = [...REQ_PERMS, ...permissions];\n        }\n        if (typeof callback === \"function\") {\n          callback(permissions);\n        }\n        return Promise.resolve(permissions);\n      },\n      contains: (permissions, callback) => {\n        if (typeof callback === \"function\") {\n          callback(true);\n        }\n        return Promise.resolve(true);\n      },\n      getAll: () => {\n        return Promise.resolve({\n          permissions: EXTENSION_PERMISSIONS,\n          origins: ORIGIN_PERMISSIONS,\n        });\n      },\n      onAdded: createNoopListeners(),\n      onRemoved: createNoopListeners(),\n    },\n    i18n: {\n      getUILanguage: () => {\n        return USED_LOCALE || \"en\";\n      },\n      getMessage: (key, substitutions = []) => {\n        if (typeof substitutions === \"string\") {\n          substitutions = [substitutions];\n        }\n        if (typeof LOCALE_KEYS !== \"undefined\" && LOCALE_KEYS[key]) {\n          return LOCALE_KEYS[key].message?.replace(\n            /\\$(\\d+)/g,\n            (match, p1) => substitutions[p1 - 1] || match,\n          );\n        }\n        return key;\n      },\n    },\n    alarms: {\n      onAlarm: createNoopListeners(),\n      create: () => {\n        _log(\"alarms.create\", arguments);\n      },\n      get: () => {\n        _log(\"alarms.get\", arguments);\n      },\n    },\n    runtime: {\n      ...RUNTIME,\n      onInstalled: createNoopListeners(),\n      onStartup: createNoopListeners(),\n      // TODO: Postmessage to parent to open options page or call openOptionsPage\n      openOptionsPage: () => {\n        // const url = chrome.runtime.getURL(OPTIONS_PAGE_PATH);\n        // console.log(\"openOptionsPage\", _openTab, url, EXTENSION_ASSETS_MAP);\n        // _openTab(url);\n        if (typeof openOptionsPage === \"function\") {\n          openOptionsPage();\n        } else if (window.parent) {\n          window.parent.postMessage({ type: \"openOptionsPage\" }, \"*\");\n        } else {\n          _warn(\"openOptionsPage not available.\");\n        }\n      },\n      getManifest: () => {\n        // The manifest object will be injected into the scope where buildPolyfill is called\n        if (typeof INJECTED_MANIFEST !== \"undefined\") {\n          return JSON.parse(JSON.stringify(INJECTED_MANIFEST)); // Return deep copy\n        }\n        _warn(\"INJECTED_MANIFEST not found for chrome.runtime.getManifest\");\n        return { name: \"Unknown\", version: \"0.0\", manifest_version: 2 };\n      },\n      getURL: (path) => {\n        if (!path) return \"\";\n        if (path.startsWith(\"/\")) {\n          path = path.substring(1);\n        }\n\n        if (typeof _createAssetUrl === \"function\") {\n          return _createAssetUrl(path);\n        }\n\n        _warn(\n          `chrome.runtime.getURL fallback for '${path}'. Assets may not be available.`,\n        );\n        // Attempt a relative path resolution (highly context-dependent and likely wrong)\n        try {\n          if (window.location.protocol.startsWith(\"http\")) {\n            return new URL(path, window.location.href).toString();\n          }\n        } catch (e) {\n          /* ignore error, fallback */\n        }\n        return path;\n      },\n      id: \"polyfilled-extension-\" + Math.random().toString(36).substring(2, 15),\n      lastError: null,\n      setUninstallURL: () => {},\n      setUpdateURL: () => {},\n      getPlatformInfo: async () => {\n        const platform = {\n          os: \"unknown\",\n          arch: \"unknown\",\n          nacl_arch: \"unknown\",\n        };\n\n        if (typeof navigator !== \"undefined\") {\n          const userAgent = navigator.userAgent.toLowerCase();\n          if (userAgent.includes(\"mac\")) platform.os = \"mac\";\n          else if (userAgent.includes(\"win\")) platform.os = \"win\";\n          else if (userAgent.includes(\"linux\")) platform.os = \"linux\";\n          else if (userAgent.includes(\"android\")) platform.os = \"android\";\n          else if (userAgent.includes(\"ios\")) platform.os = \"ios\";\n\n          if (userAgent.includes(\"x86_64\") || userAgent.includes(\"amd64\")) {\n            platform.arch = \"x86-64\";\n          } else if (userAgent.includes(\"i386\") || userAgent.includes(\"i686\")) {\n            platform.arch = \"x86-32\";\n          } else if (userAgent.includes(\"arm\")) {\n            platform.arch = \"arm\";\n          }\n        }\n\n        return platform;\n      },\n      getBrowserInfo: async () => {\n        const info = {\n          name: \"unknown\",\n          version: \"unknown\",\n          buildID: \"unknown\",\n        };\n\n        if (typeof navigator !== \"undefined\") {\n          const userAgent = navigator.userAgent;\n          if (userAgent.includes(\"Chrome\")) {\n            info.name = \"Chrome\";\n            const match = userAgent.match(/Chrome\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          } else if (userAgent.includes(\"Firefox\")) {\n            info.name = \"Firefox\";\n            const match = userAgent.match(/Firefox\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          } else if (userAgent.includes(\"Safari\")) {\n            info.name = \"Safari\";\n            const match = userAgent.match(/Version\\/([0-9.]+)/);\n            if (match) info.version = match[1];\n          }\n        }\n\n        return info;\n      },\n    },\n    storage: {\n      local: {\n        get: function (keys, callback) {\n          if (typeof _storageGet !== \"function\")\n            throw new Error(\"_storageGet not defined\");\n\n          const promise = _storageGet(keys);\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.get callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.get error:\", error);\n                callback({});\n              });\n            return;\n          }\n\n          return promise;\n        },\n        set: function (items, callback) {\n          if (typeof _storageSet !== \"function\")\n            throw new Error(\"_storageSet not defined\");\n\n          const promise = _storageSet(items).then((result) => {\n            broadcastStorageChange(items, \"local\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.set callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.set error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        remove: function (keys, callback) {\n          if (typeof _storageRemove !== \"function\")\n            throw new Error(\"_storageRemove not defined\");\n\n          const promise = _storageRemove(keys).then((result) => {\n            const changes = {};\n            const keyList = Array.isArray(keys) ? keys : [keys];\n            keyList.forEach((key) => {\n              changes[key] = { oldValue: undefined, newValue: undefined };\n            });\n            broadcastStorageChange(changes, \"local\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.remove callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.remove error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        clear: function (callback) {\n          if (typeof _storageClear !== \"function\")\n            throw new Error(\"_storageClear not defined\");\n\n          const promise = _storageClear().then((result) => {\n            broadcastStorageChange({}, \"local\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.clear callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.clear error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        onChanged: {\n          addListener: (callback) => {\n            storageChangeListeners.add(callback);\n          },\n          removeListener: (callback) => {\n            storageChangeListeners.delete(callback);\n          },\n        },\n      },\n      sync: {\n        get: function (keys, callback) {\n          _warn(\"chrome.storage.sync polyfill maps to local\");\n          return chrome.storage.local.get(keys, callback);\n        },\n        set: function (items, callback) {\n          _warn(\"chrome.storage.sync polyfill maps to local\");\n\n          const promise = chrome.storage.local.set(items).then((result) => {\n            broadcastStorageChange(items, \"sync\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.sync.set callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.sync.set error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        remove: function (keys, callback) {\n          _warn(\"chrome.storage.sync polyfill maps to local\");\n\n          const promise = chrome.storage.local.remove(keys).then((result) => {\n            const changes = {};\n            const keyList = Array.isArray(keys) ? keys : [keys];\n            keyList.forEach((key) => {\n              changes[key] = { oldValue: undefined, newValue: undefined };\n            });\n            broadcastStorageChange(changes, \"sync\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.sync.remove callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.sync.remove error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        clear: function (callback) {\n          _warn(\"chrome.storage.sync polyfill maps to local\");\n\n          const promise = chrome.storage.local.clear().then((result) => {\n            broadcastStorageChange({}, \"sync\");\n            return result;\n          });\n\n          if (typeof callback === \"function\") {\n            promise\n              .then((result) => {\n                try {\n                  callback(result);\n                } catch (e) {\n                  _error(\"Error in storage.sync.clear callback:\", e);\n                }\n              })\n              .catch((error) => {\n                _error(\"Storage.sync.clear error:\", error);\n                callback();\n              });\n            return;\n          }\n\n          return promise;\n        },\n        onChanged: {\n          addListener: (callback) => {\n            storageChangeListeners.add(callback);\n          },\n          removeListener: (callback) => {\n            storageChangeListeners.delete(callback);\n          },\n        },\n      },\n      onChanged: {\n        addListener: (callback) => {\n          storageChangeListeners.add(callback);\n        },\n        removeListener: (callback) => {\n          storageChangeListeners.delete(callback);\n        },\n      },\n      managed: {\n        get: function (keys, callback) {\n          _warn(\"chrome.storage.managed polyfill is read-only empty.\");\n\n          const promise = Promise.resolve({});\n\n          if (typeof callback === \"function\") {\n            promise.then((result) => {\n              try {\n                callback(result);\n              } catch (e) {\n                _error(\"Error in storage.managed.get callback:\", e);\n              }\n            });\n            return;\n          }\n\n          return promise;\n        },\n      },\n    },\n    cookies: (function () {\n      const cookieChangeListeners = new Set();\n      function broadcastCookieChange(changeInfo) {\n        cookieChangeListeners.forEach((listener) => {\n          try {\n            listener(changeInfo);\n          } catch (e) {\n            _error(\"Error in cookies.onChanged listener:\", e);\n          }\n        });\n      }\n\n      function handlePromiseCallback(promise, callback) {\n        if (typeof callback === \"function\") {\n          promise\n            .then((result) => callback(result))\n            .catch((error) => {\n              // chrome.runtime.lastError = { message: error.message }; // TODO: Implement lastError\n              _error(error);\n              callback(); // Call with undefined on error\n            });\n          return;\n        }\n        return promise;\n      }\n\n      return {\n        get: function (details, callback) {\n          if (typeof _cookieList !== \"function\") {\n            return handlePromiseCallback(\n              Promise.reject(new Error(\"_cookieList not defined\")),\n              callback,\n            );\n          }\n          const promise = _cookieList({\n            url: details.url,\n            name: details.name,\n            storeId: details.storeId,\n            partitionKey: details.partitionKey,\n          }).then((cookies) => {\n            if (!cookies || cookies.length === 0) {\n              return null;\n            }\n            // Sort by path length (longest first), then creation time (earliest first, if available)\n            cookies.sort((a, b) => {\n              const pathLenDiff = (b.path || \"\").length - (a.path || \"\").length;\n              if (pathLenDiff !== 0) return pathLenDiff;\n              return (a.creationTime || 0) - (b.creationTime || 0);\n            });\n            return cookies[0];\n          });\n          return handlePromiseCallback(promise, callback);\n        },\n\n        getAll: function (details, callback) {\n          if (typeof _cookieList !== \"function\") {\n            return handlePromiseCallback(\n              Promise.reject(new Error(\"_cookieList not defined\")),\n              callback,\n            );\n          }\n          if (details.partitionKey) {\n            _warn(\n              \"cookies.getAll: partitionKey is not fully supported in this environment.\",\n            );\n          }\n          const promise = _cookieList(details);\n          return handlePromiseCallback(promise, callback);\n        },\n\n        set: function (details, callback) {\n          const promise = (async () => {\n            if (\n              typeof _cookieSet !== \"function\" ||\n              typeof _cookieList !== \"function\"\n            ) {\n              throw new Error(\"_cookieSet or _cookieList not defined\");\n            }\n            if (details.partitionKey) {\n              _warn(\n                \"cookies.set: partitionKey is not fully supported in this environment.\",\n              );\n            }\n\n            const getDetails = {\n              url: details.url,\n              name: details.name,\n              storeId: details.storeId,\n            };\n            const oldCookies = await _cookieList(getDetails);\n            const oldCookie = oldCookies && oldCookies[0];\n\n            if (oldCookie) {\n              broadcastCookieChange({\n                cause: \"overwrite\",\n                cookie: oldCookie,\n                removed: true,\n              });\n            }\n\n            await _cookieSet(details);\n            const newCookies = await _cookieList(getDetails);\n            const newCookie = newCookies && newCookies[0];\n\n            if (newCookie) {\n              broadcastCookieChange({\n                cause: \"explicit\",\n                cookie: newCookie,\n                removed: false,\n              });\n            }\n            return newCookie || null;\n          })();\n          return handlePromiseCallback(promise, callback);\n        },\n\n        remove: function (details, callback) {\n          const promise = (async () => {\n            if (\n              typeof _cookieDelete !== \"function\" ||\n              typeof _cookieList !== \"function\"\n            ) {\n              throw new Error(\"_cookieDelete or _cookieList not defined\");\n            }\n            const oldCookies = await _cookieList(details);\n            const oldCookie = oldCookies && oldCookies[0];\n\n            if (!oldCookie) return null; // Nothing to remove\n\n            await _cookieDelete(details);\n\n            broadcastCookieChange({\n              cause: \"explicit\",\n              cookie: oldCookie,\n              removed: true,\n            });\n\n            return {\n              url: details.url,\n              name: details.name,\n              storeId: details.storeId || \"0\",\n              partitionKey: details.partitionKey,\n            };\n          })();\n          return handlePromiseCallback(promise, callback);\n        },\n\n        getAllCookieStores: function (callback) {\n          const promise = Promise.resolve([\n            { id: \"0\", tabIds: [1] }, // Mock store for the current context\n          ]);\n          return handlePromiseCallback(promise, callback);\n        },\n\n        getPartitionKey: function (details, callback) {\n          _warn(\n            \"chrome.cookies.getPartitionKey is not supported in this environment.\",\n          );\n          const promise = Promise.resolve({ partitionKey: {} }); // Return empty partition key\n          return handlePromiseCallback(promise, callback);\n        },\n\n        onChanged: {\n          addListener: (callback) => {\n            if (typeof callback === \"function\") {\n              cookieChangeListeners.add(callback);\n            }\n          },\n          removeListener: (callback) => {\n            cookieChangeListeners.delete(callback);\n          },\n        },\n      };\n    })(),\n    tabs: {\n      query: async (queryInfo) => {\n        _warn(\"chrome.tabs.query polyfill only returns current tab info.\");\n        const dummyId = Math.floor(Math.random() * 1000) + 1;\n        return [\n          {\n            id: dummyId,\n            url: CURRENT_LOCATION,\n            active: true,\n            windowId: 1,\n            status: \"complete\",\n          },\n        ];\n      },\n      create: async ({ url, active = true }) => {\n        _log(`[Polyfill tabs.create] URL: ${url}`);\n        if (typeof _openTab !== \"function\")\n          throw new Error(\"_openTab not defined\");\n        _openTab(url, active);\n        const dummyId = Math.floor(Math.random() * 1000) + 1001;\n        return Promise.resolve({\n          id: dummyId,\n          url: url,\n          active,\n          windowId: 1,\n        });\n      },\n      sendMessage: async (tabId, message) => {\n        _warn(\n          `chrome.tabs.sendMessage polyfill (to tab ${tabId}) redirects to runtime.sendMessage (current context).`,\n        );\n        return chrome.runtime.sendMessage(message);\n      },\n      onActivated: createNoopListeners(),\n      onUpdated: createNoopListeners(),\n      onRemoved: createNoopListeners(),\n      onReplaced: createNoopListeners(),\n      onCreated: createNoopListeners(),\n      onMoved: createNoopListeners(),\n      onDetached: createNoopListeners(),\n      onAttached: createNoopListeners(),\n    },\n    windows: {\n      onFocusChanged: createNoopListeners(),\n      onCreated: createNoopListeners(),\n      onRemoved: createNoopListeners(),\n      onFocused: createNoopListeners(),\n      onFocus: createNoopListeners(),\n      onBlur: createNoopListeners(),\n      onFocused: createNoopListeners(),\n    },\n    notifications: {\n      create: async (notificationId, options) => {\n        try {\n          let id = notificationId;\n          let notificationOptions = options;\n\n          if (typeof notificationId === \"object\" && notificationId !== null) {\n            notificationOptions = notificationId;\n            id = \"notification_\" + Math.random().toString(36).substring(2, 15);\n          } else if (typeof notificationId === \"string\" && options) {\n            id = notificationId;\n            notificationOptions = options;\n          } else {\n            throw new Error(\"Invalid parameters for notifications.create\");\n          }\n\n          if (!notificationOptions || typeof notificationOptions !== \"object\") {\n            throw new Error(\"Notification options must be an object\");\n          }\n\n          const {\n            title,\n            message,\n            iconUrl,\n            type = \"basic\",\n          } = notificationOptions;\n\n          if (!title || !message) {\n            throw new Error(\"Notification must have title and message\");\n          }\n\n          if (\"Notification\" in window) {\n            if (Notification.permission === \"granted\") {\n              const notification = new Notification(title, {\n                body: message,\n                icon: iconUrl,\n                tag: id,\n              });\n\n              _log(`[Notifications] Created notification: ${id}`);\n              return id;\n            } else if (Notification.permission === \"default\") {\n              const permission = await Notification.requestPermission();\n              if (permission === \"granted\") {\n                const notification = new Notification(title, {\n                  body: message,\n                  icon: iconUrl,\n                  tag: id,\n                });\n                _log(\n                  `[Notifications] Created notification after permission: ${id}`,\n                );\n                return id;\n              } else {\n                _warn(\"[Notifications] Permission denied for notifications\");\n                return id;\n              }\n            } else {\n              _warn(\"[Notifications] Notifications are blocked\");\n              return id;\n            }\n          } else {\n            _warn(\n              \"[Notifications] Native notifications not supported, using console fallback\",\n            );\n            _log(`[Notification] ${title}: ${message}`);\n            return id;\n          }\n        } catch (error) {\n          _error(\"[Notifications] Error creating notification:\", error.message);\n          throw error;\n        }\n      },\n      clear: async (notificationId) => {\n        _log(`[Notifications] Clear notification: ${notificationId}`);\n        // For native notifications, there's no direct way to clear by ID\n        // This is a limitation of the Web Notifications API\n        return true;\n      },\n      getAll: async () => {\n        _warn(\"[Notifications] getAll not fully supported in polyfill\");\n        return {};\n      },\n      getPermissionLevel: async () => {\n        if (\"Notification\" in window) {\n          const permission = Notification.permission;\n          return { level: permission === \"granted\" ? \"granted\" : \"denied\" };\n        }\n        return { level: \"denied\" };\n      },\n    },\n    contextMenus: {\n      create: (createProperties, callback) => {\n        try {\n          if (!createProperties || typeof createProperties !== \"object\") {\n            throw new Error(\"Context menu create properties must be an object\");\n          }\n\n          const { id, title, contexts = [\"page\"], onclick } = createProperties;\n          const menuId =\n            id || `menu_${Math.random().toString(36).substring(2, 15)}`;\n\n          if (!title || typeof title !== \"string\") {\n            throw new Error(\"Context menu must have a title\");\n          }\n\n          // Store menu items for potential use\n          if (!window._polyfillContextMenus) {\n            window._polyfillContextMenus = new Map();\n          }\n\n          window._polyfillContextMenus.set(menuId, {\n            id: menuId,\n            title,\n            contexts,\n            onclick,\n            enabled: createProperties.enabled !== false,\n          });\n\n          _log(\n            `[ContextMenus] Created context menu item: ${title} (${menuId})`,\n          );\n\n          // Try to register a menu command as fallback\n          if (typeof _registerMenuCommand === \"function\") {\n            try {\n              _registerMenuCommand(\n                title,\n                onclick ||\n                  (() => {\n                    _log(`Context menu clicked: ${title}`);\n                  }),\n              );\n            } catch (e) {\n              _warn(\n                \"[ContextMenus] Failed to register as menu command:\",\n                e.message,\n              );\n            }\n          }\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n\n          return menuId;\n        } catch (error) {\n          _error(\"[ContextMenus] Error creating context menu:\", error.message);\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n          throw error;\n        }\n      },\n      update: (id, updateProperties, callback) => {\n        try {\n          if (\n            !window._polyfillContextMenus ||\n            !window._polyfillContextMenus.has(id)\n          ) {\n            throw new Error(`Context menu item not found: ${id}`);\n          }\n\n          const menuItem = window._polyfillContextMenus.get(id);\n          Object.assign(menuItem, updateProperties);\n\n          _log(`[ContextMenus] Updated context menu item: ${id}`);\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          _error(\"[ContextMenus] Error updating context menu:\", error.message);\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      remove: (menuItemId, callback) => {\n        try {\n          if (\n            window._polyfillContextMenus &&\n            window._polyfillContextMenus.has(menuItemId)\n          ) {\n            window._polyfillContextMenus.delete(menuItemId);\n            _log(`[ContextMenus] Removed context menu item: ${menuItemId}`);\n          } else {\n            _warn(\n              `[ContextMenus] Context menu item not found for removal: ${menuItemId}`,\n            );\n          }\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          _error(\"[ContextMenus] Error removing context menu:\", error.message);\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      removeAll: (callback) => {\n        try {\n          if (window._polyfillContextMenus) {\n            const count = window._polyfillContextMenus.size;\n            window._polyfillContextMenus.clear();\n            _log(`[ContextMenus] Removed all ${count} context menu items`);\n          }\n\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        } catch (error) {\n          _error(\n            \"[ContextMenus] Error removing all context menus:\",\n            error.message,\n          );\n          if (callback && typeof callback === \"function\") {\n            setTimeout(() => callback(), 0);\n          }\n        }\n      },\n      onClicked: {\n        addListener: (callback) => {\n          if (!window._polyfillContextMenuListeners) {\n            window._polyfillContextMenuListeners = new Set();\n          }\n          window._polyfillContextMenuListeners.add(callback);\n          _log(\"[ContextMenus] Added click listener\");\n        },\n        removeListener: (callback) => {\n          if (window._polyfillContextMenuListeners) {\n            window._polyfillContextMenuListeners.delete(callback);\n            _log(\"[ContextMenus] Removed click listener\");\n          }\n        },\n      },\n    },\n  };\n\n  const tc = (fn) => {\n    try {\n      fn();\n    } catch (e) {}\n  };\n  const loggingProxyHandler = (_key) => ({\n    get(target, key, receiver) {\n      tc(() => _log(`[${contextType}] [CHROME - ${_key}] Getting ${key}`));\n      return Reflect.get(target, key, receiver);\n    },\n    set(target, key, value, receiver) {\n      tc(() =>\n        _log(`[${contextType}] [CHROME - ${_key}] Setting ${key} to ${value}`),\n      );\n      return Reflect.set(target, key, value, receiver);\n    },\n    has(target, key) {\n      tc(() =>\n        _log(`[${contextType}] [CHROME - ${_key}] Checking if ${key} exists`),\n      );\n      return Reflect.has(target, key);\n    },\n  });\n  chrome = Object.fromEntries(\n    Object.entries(chrome).map(([key, value]) => [\n      key,\n      new Proxy(value, loggingProxyHandler(key)),\n    ]),\n  );\n\n  // Alias browser to chrome for common Firefox pattern\n  const browser = new Proxy(chrome, loggingProxyHandler);\n\n  const oldGlobalThis = globalThis;\n  const oldWindow = window;\n  const oldSelf = self;\n  const oldGlobal = globalThis;\n  const __globalsStorage = {};\n\n  const TO_MODIFY = [oldGlobalThis, oldWindow, oldSelf, oldGlobal];\n  const set = (k, v) => {\n    __globalsStorage[k] = v;\n    TO_MODIFY.forEach((target) => {\n      target[k] = v;\n    });\n  };\n  const proxyHandler = {\n    get(target, key, receiver) {\n      const fns = [\n        () => __globalsStorage[key],\n        () => Reflect.get(target, key, target),\n        () => target[key],\n      ];\n      const out = fns\n        .map((f) => {\n          try {\n            let out = f();\n            return out;\n          } catch (e) {\n            return undefined;\n          }\n        })\n        .find((f) => f !== undefined);\n      if (typeof out === \"function\") {\n        return out.bind(target);\n      }\n      return out;\n    },\n    set(target, key, value, receiver) {\n      try {\n        tc(() => _log(`[${contextType}] Setting ${key} to ${value}`));\n        set(key, value);\n        return Reflect.set(target, key, value, receiver);\n      } catch (e) {\n        _error(\"Error setting\", key, value, e);\n        try {\n          target[key] = value;\n          return true;\n        } catch (e) {\n          _error(\"Error setting\", key, value, e);\n        }\n        return false;\n      }\n    },\n    has(target, key) {\n      try {\n        return key in __globalsStorage || key in target;\n      } catch (e) {\n        _error(\"Error has\", key, e);\n        try {\n          return key in __globalsStorage || key in target;\n        } catch (e) {\n          _error(\"Error has\", key, e);\n        }\n        return false;\n      }\n    },\n    getOwnPropertyDescriptor(target, key) {\n      try {\n        if (key in __globalsStorage) {\n          return {\n            configurable: true,\n            enumerable: true,\n            writable: true,\n            value: __globalsStorage[key],\n          };\n        }\n        // fall back to the real globalThis\n        const desc = Reflect.getOwnPropertyDescriptor(target, key);\n        // ensure it's configurable so the with‑scope binding logic can override it\n        if (desc && !desc.configurable) {\n          desc.configurable = true;\n        }\n        return desc;\n      } catch (e) {\n        _error(\"Error getOwnPropertyDescriptor\", key, e);\n        return {\n          configurable: true,\n          enumerable: true,\n          writable: true,\n          value: undefined,\n        };\n      }\n    },\n\n    defineProperty(target, key, descriptor) {\n      try {\n        // Normalize descriptor to avoid mixed accessor & data attributes\n        const hasAccessor = \"get\" in descriptor || \"set\" in descriptor;\n\n        if (hasAccessor) {\n          // Build a clean descriptor without value/writable when accessors present\n          const normalized = {\n            configurable:\n              \"configurable\" in descriptor ? descriptor.configurable : true,\n            enumerable:\n              \"enumerable\" in descriptor ? descriptor.enumerable : false,\n          };\n          if (\"get\" in descriptor) normalized.get = descriptor.get;\n          if (\"set\" in descriptor) normalized.set = descriptor.set;\n\n          // Store accessor references for inspection but avoid breaking invariants\n          set(key, {\n            get: descriptor.get,\n            set: descriptor.set,\n          });\n\n          return Reflect.defineProperty(target, key, normalized);\n        }\n\n        // Data descriptor path\n        set(key, descriptor.value);\n        return Reflect.defineProperty(target, key, descriptor);\n      } catch (e) {\n        _error(\"Error defineProperty\", key, descriptor, e);\n        return false;\n      }\n    },\n  };\n\n  // Create proxies once proxyHandler is defined\n  const proxyWindow = new Proxy(oldWindow, proxyHandler);\n  const proxyGlobalThis = new Proxy(oldGlobalThis, proxyHandler);\n  const proxyGlobal = new Proxy(oldGlobal, proxyHandler);\n  const proxySelf = new Proxy(oldSelf, proxyHandler);\n\n  // Seed storage with core globals so lookups succeed inside `with` blocks\n  Object.assign(__globalsStorage, {\n    chrome,\n    browser,\n    window: proxyWindow,\n    globalThis: proxyGlobalThis,\n    global: proxyGlobal,\n    self: proxySelf,\n    document: oldWindow.document,\n  });\n\n  const __globals = {\n    chrome,\n    browser,\n    window: proxyWindow,\n    globalThis: proxyGlobalThis,\n    global: proxyGlobal,\n    self: proxySelf,\n    __globals: __globalsStorage,\n  };\n\n  __globals.contextId = contextId;\n  __globals.contextType = contextType;\n  __globals.module = undefined;\n  __globals.amd = undefined;\n  __globals.define = undefined;\n  __globals.importScripts = (...args) => {\n    _log(\"importScripts\", args);\n  };\n\n  return __globals;\n}\n\n\nif (typeof window !== 'undefined') {\n    window.buildPolyfill = buildPolyfill;\n}\n"
			  let newMap = JSON.parse(JSON.stringify(EXTENSION_ASSETS_MAP));
			  delete newMap[OPTIONS_PAGE_PATH];
			  const PASS_ON = Object.fromEntries(
			    Object.entries({
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
			      SCRIPT_NAME,
			      _base64ToBlob,
			      _getMimeTypeFromPath,
			      _isTextAsset,
			      _createAssetUrl,
			      _matchGlobPattern,
			      _isWebAccessibleResource,
			      _log,
			      _warn,
			      _error,
			    }).map((i) => {
			      let out = [...i];
			      if (typeof i[1] === "function") {
			        out[1] = i[1].toString();
			      } else {
			        out[1] = JSON.stringify(i[1]);
			      }
			      return out;
			    })
			  );
			  _log(PASS_ON);
			  return `
			    ${Object.entries(PASS_ON)
			      .map(
			        (i) =>
			          `const ${i[0]} = ${i[1]};\nwindow[${JSON.stringify(i[0])}] = ${i[0]}`
			      )
			      .join("\n")}
			
			        _log("Initialized polyfill", {${Object.keys(PASS_ON).join(", ")}})
			        ${polyfillString.replaceAll("{{EXTENSION_ASSETS_MAP}}", `JSON.parse(unescape(atob("${btoa(encodeURIComponent(JSON.stringify(EXTENSION_ASSETS_MAP)))}")))`)}
			
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
			
			  if (typeof _initStorage === "function") {
			    try {
			      _initStorage()
			        .then(() => {
			          _log(`Storage initialized.`);
			        })
			        .catch((e) => {
			          _error("Error during storage initialization:", e);
			        });
			    } catch (e) {
			      _error("Error during storage initialization:", e);
			    }
			  }
			
			  _log(`Starting content scripts...`);
			
			  const currentUrl = window.location.href;
			  let shouldRunAnyScript = false;
			  _log(`Checking URL: ${currentUrl}`);
			
			  if (
			    CONTENT_SCRIPT_CONFIGS_FOR_MATCHING &&
			    CONTENT_SCRIPT_CONFIGS_FOR_MATCHING.length > 0
			  ) {
			    for (const config of CONTENT_SCRIPT_CONFIGS_FOR_MATCHING) {
			      if (
			        config.matches &&
			        config.matches.some((pattern) => {
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
			        })
			      ) {
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
			    await executeAllScripts.call(
			      polyfillContext.globalThis,
			      polyfillContext,
			      extensionCssData
			    );
			  } else {
			    _log(
			      `No matching content script patterns for this URL. No scripts will be executed.`
			    );
			  }
			
			  if (OPTIONS_PAGE_PATH) {
			    if (typeof _registerMenuCommand === "function") {
			      try {
			        _registerMenuCommand("Open Options", openOptionsPage);
			        _log(`Options menu command registered.`);
			      } catch (e) {
			        _error("Failed to register menu command", e);
			      }
			    }
			  }
			
			  if (POPUP_PAGE_PATH) {
			    if (typeof _registerMenuCommand === "function") {
			      try {
			        _registerMenuCommand("Open Popup", openPopupPage);
			        _log(`Popup menu command registered.`);
			      } catch (e) {
			        _error("Failed to register popup menu command", e);
			      }
			    }
			  }
			
			  _log(`Initialization sequence complete.`);
			}
			
			main()//.catch((e) => _error(`Error during script initialization:`, e));
			
			try {
			  const fnKey = "OPEN_OPTIONS_PAGE_" + String(SCRIPT_NAME).replace(/\s+/g, "_");
			  window[fnKey] = openOptionsPage;
			} catch (e) {}
			
			try {
			  const fnKey = "OPEN_POPUP_PAGE_" + String(SCRIPT_NAME).replace(/\s+/g, "_");
			  window[fnKey] = openPopupPage;
			} catch (e) {}
			
			
			})();
  // #endregion
  // #endregion
    // #endregion