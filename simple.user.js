// ==UserScript==
// @name        Modern for Hacker News
// @version     1.14
// @description A redesigned web interface for Hacker News.
// @namespace   modern-for-hacker-news-namespace
// @author      Converter Script
// @match       *://news.ycombinator.com/*
// @match       https://extensionpay.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @run-at      document-idle
// ==/UserScript==

(function() {
    // --- Polyfill Dependencies (Message Bus) ---

    // Singleton message bus for sharing between multiple polyfill instances
    const internalMessageBus = {
        listeners: [],
        emit: function(message, sender) {
            // Simple broadcast for now
            this.listeners.forEach(callback => {
                try {
                    // Provide a sender object similar to chrome.runtime.onMessage
                    const messageSender = sender ? sender : { id: 'self', url: window.location.href };
                    // Respond function placeholder (complex to implement fully)
                    const sendResponse = (response) => { console.warn('sendResponse function in polyfill is rudimentary.'); };
                    callback(message, messageSender, sendResponse);
                } catch (e) {
                    console.error('Error in message listener:', e);
                }
            });
        },
        addListener: function(callback) {
            if (typeof callback === 'function') {
                this.listeners.push(callback);
            }
        },
        removeListener: function(callback) {
            this.listeners = this.listeners.filter(l => l !== callback);
        },
        hasListener: function(callback) {
             return this.listeners.includes(callback);
        }
    };


    // --- 1. GM/Vanilla Abstraction Layer Implementation ---
// --- Abstraction Layer: Userscript Target ---
// These functions provide the low-level implementation using GM_* APIs

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
  try {
    const results = {};
    let keyList = [];
    let defaults = {};
    let requestedKeys = [];

    if (keys === null) {
      keyList = await GM_listValues();
      requestedKeys = [...keyList];
    } else if (typeof keys === 'string') {
      keyList = [keys];
      requestedKeys = [keys];
    } else if (Array.isArray(keys)) {
      keyList = keys;
      requestedKeys = [...keys];
    } else if (typeof keys === 'object' && keys !== null) {
      keyList = Object.keys(keys);
      requestedKeys = [...keyList];
      defaults = keys;
    } else {
      console.error("_storageGet error: Invalid keys format", keys);
      return Promise.reject(new Error("Invalid keys format for get"));
    }

    for (const key of keyList) {
       const defaultValue = defaults.hasOwnProperty(key) ? defaults[key] : undefined;
       const storedValue = await GM_getValue(key, defaultValue);
       results[key] = storedValue;
    }

    const finalResult = {};
    for(const key of requestedKeys){
         if (results.hasOwnProperty(key)) {
             finalResult[key] = results[key];
         }
         else if (defaults.hasOwnProperty(key)) {
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
    if (typeof keysToRemove === 'string') {
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
    await Promise.all(keys.map(key => GM_deleteValue(key)));
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
        binary: options.responseType === 'blob' || options.responseType === 'arraybuffer',
        onload: function (response) {
          const responseHeaders = {};
          if (response.responseHeaders) {
            response.responseHeaders.trim().split('\\r\\n').forEach(header => {
                const parts = header.match(/^([^:]+):\s*(.*)$/);
                if (parts && parts.length === 3) {
                    responseHeaders[parts[1].toLowerCase()] = parts[2];
                }
            });
          }

          const mockResponse = {
            ok: response.status >= 200 && response.status < 300,
            status: response.status,
            statusText: response.statusText || (response.status >= 200 && response.status < 300 ? 'OK' : ''),
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
               if(response.response instanceof Blob){
                   return Promise.resolve(response.response);
               }
               return Promise.reject(new Error("Requires responseType:'blob' in GM_xmlhttpRequest"));
            },
            arrayBuffer: () => {
               if(response.response instanceof ArrayBuffer){
                   return Promise.resolve(response.response);
               }
               return Promise.reject(new Error("Requires responseType:'arraybuffer' in GM_xmlhttpRequest"));
            },
            clone: function() {
               const cloned = { ...this }; 
               cloned.text = () => Promise.resolve(response.responseText);
               cloned.json = () => this.json();
               cloned.blob = () => this.blob();
               cloned.arrayBuffer = () => this.arrayBuffer();
               return cloned;
            }
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
          reject(new Error(`GM_xmlhttpRequest network error: ${response.statusText || 'Unknown Error'}`));
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
    } catch(e) {
        console.error("window.open fallback failed:", e);
    }
  }
}

async function _initStorage() {
  // No initialization required for GM_* storage.
  return Promise.resolve();
}

    // --- 2. Polyfill Implementation (buildPolyfill function definition) ---
// This function definition is injected as a string into the final script.
function buildPolyfill({ isBackground }) {
  // This function is executed within the generated userscript / vanilla JS
  // It uses the globally available abstraction layer functions (_storageSet, _fetch etc.)
  // and the globally defined 'internalMessageBus'.

  // --- Polyfill Implementation ---
  const chrome = {
    runtime: {
      // Use the globally defined message bus.
      sendMessage: async (message) => {
        internalMessageBus.emit(message, {
          id: "polyfilled-extension",
          url: window.location.href,
        });
        // Return undefined, as the response handling is complex.
        return Promise.resolve(undefined);
      },
      onMessage: {
        addListener: (callback) => {
          internalMessageBus.addListener(callback);
        },
        removeListener: (callback) => {
          internalMessageBus.removeListener(callback);
        },
        hasListener: (callback) => {
          return internalMessageBus.hasListener(callback);
        },
      },
      getManifest: () => {
        // The manifest object will be injected into the scope where buildPolyfill is called
        if (typeof injectedManifest !== "undefined") {
          return JSON.parse(JSON.stringify(injectedManifest)); // Return deep copy
        }
        console.warn(
          "injectedManifest not found for chrome.runtime.getManifest",
        );
        return { name: "Unknown", version: "0.0", manifest_version: 2 };
      },
      getURL: (path) => {
        // Basic implementation, assumes resources are not handled specially yet.
        if (!path) return "";
        if (path.startsWith("/")) {
          path = path.substring(1);
        }
        console.warn(
          `chrome.runtime.getURL basic polyfill for '${path}'. May not be accurate without @resource handling.`,
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
    },
    storage: {
      local: {
        // Uses functions from the Abstraction Layer
        get: async (keys) => {
          if (typeof _storageGet !== "function")
            throw new Error("_storageGet not defined");
          return _storageGet(keys);
        },
        set: async (items) => {
          if (typeof _storageSet !== "function")
            throw new Error("_storageSet not defined");
          return _storageSet(items);
        },
        remove: async (keys) => {
          if (typeof _storageRemove !== "function")
            throw new Error("_storageRemove not defined");
          return _storageRemove(keys);
        },
        clear: async () => {
          if (typeof _storageClear !== "function")
            throw new Error("_storageClear not defined");
          return _storageClear();
        },
      },
      // Sync/Managed are simple aliases or stubs for Phase 1
      sync: {
        get: async (keys) => {
          console.warn("chrome.storage.sync polyfill maps to local");
          return chrome.storage.local.get(keys);
        },
        set: async (items) => {
          console.warn("chrome.storage.sync polyfill maps to local");
          return chrome.storage.local.set(items);
        },
        remove: async (keys) => {
          console.warn("chrome.storage.sync polyfill maps to local");
          return chrome.storage.local.remove(keys);
        },
        clear: async () => {
          console.warn("chrome.storage.sync polyfill maps to local");
          return chrome.storage.local.clear();
        },
      },
      managed: {
        get: async (keys) => {
          console.warn("chrome.storage.managed polyfill is read-only empty.");
          return Promise.resolve({});
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
  };

  // Alias browser to chrome for common Firefox pattern
  const browser = chrome;

  const oldGlobalThis = globalThis;
  const oldWindow = window;
  const oldSelf = self;
  const oldGlobal = globalThis;
  const __globalsStorage = {};

  const proxyHandler = {
    get(target, key) {
      return __globalsStorage[key] || target[key];
    },
    set(target, key, value) {
      console.log(`[${SCRIPT_NAME}] Setting ${key} to ${value}`);
      __globalsStorage[key] = value;
      try {
        oldGlobalThis[key] = value;
      } catch (error) {
        console.error(`Failed to set ${key}: ${error.message}`);
      }
      try {
        oldGlobal[key] = value;
      } catch (error) {
        console.error(`Failed to set ${key}: ${error.message}`);
      }
      try {
        oldWindow[key] = value;
      } catch (error) {
        console.error(`Failed to set ${key}: ${error.message}`);
      }
      try {
        oldSelf[key] = value;
      } catch (error) {
        console.error(`Failed to set ${key}: ${error.message}`);
      }
      target[key] = value;
      return true;
    },
  };

  const __globals = {
    window: new Proxy(window, proxyHandler),
    globalThis: new Proxy(globalThis, proxyHandler),
    global: new Proxy(globalThis, proxyHandler),
    self: new Proxy(globalThis, proxyHandler),
  };
  return { chrome, browser, ...__globals, __globals: __globalsStorage };
}


    // --- 3. Orchestration Logic & Combined Execution ---
    // (Includes injected data, the main() function, URL matching, and executeAllScripts)
// This script is template-generated and contains the main execution logic.
const SCRIPT_NAME = "Modern for Hacker News";

const INJECTED_MANIFEST = {"manifest_version":3,"name":"Modern for Hacker News","version":"1.14","description":"A redesigned web interface for Hacker News.","permissions":["activeTab","storage","unlimitedStorage"],"content_scripts":[{"matches":["*://news.ycombinator.com/*"],"js":["content_start.js"],"run_at":"document_start","css":[],"_orderPreserved":true},{"matches":["*://news.ycombinator.com/*"],"js":["jquery-3.5.1.min.js","popper.min.js","tippy-bundle.umd.min.js","linkify.min.js","linkify-jquery.min.js","luxon.min.js","litepicker.js","clipboard-polyfill.js","ExtPay.js","content.js"],"run_at":"document_end","css":[],"_orderPreserved":true},{"matches":["https://extensionpay.com/*"],"js":["ExtPay.js"],"run_at":"document_start","css":[],"_orderPreserved":true}]};
// Minimal configs just to check if *any* script should run on this page
const CONTENT_SCRIPT_CONFIGS_FOR_MATCHING = [
  {
    "matches": [
      "*://news.ycombinator.com/*"
    ]
  },
  {
    "matches": [
      "*://news.ycombinator.com/*"
    ]
  },
  {
    "matches": [
      "https://extensionpay.com/*"
    ]
  }
];
// CSS data is needed by the combined execution logic
const extensionCssData = {
};

// --- Utility Functions Injected During Build ---
// Function to convert match pattern string to a RegExp object
const convertMatchPatternToRegExp = function convertMatchPatternToRegExp(pattern) {
  try {
    // Remove the double escaping for RegExp constructor
    const singleEscapedPattern = convertMatchPatternToRegExpString(
      pattern,
    ).replace(/\\\\/g, "\\");
    return new RegExp(singleEscapedPattern);
  } catch (error) {
    console.error(
      `Error converting match pattern to RegExp: ${pattern}`,
      error,
    );
    return new RegExp("$."); // Matches nothing on error
  }
};
// Function to convert match pattern string to a double-escaped string for RegExp constructor
const convertMatchPatternToRegExpString = function convertMatchPatternToRegExpString(pattern) {
  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\\\$&");
  }

  if (typeof pattern !== "string" || !pattern) {
    return "$."; // Matches nothing
  }

  // 1. Scheme
  const schemeMatch = pattern.match(/^(\*|https?|file|ftp):\/\//);
  if (!schemeMatch) return "$."; // Invalid pattern
  const scheme = schemeMatch[1];
  pattern = pattern.substring(schemeMatch[0].length);
  const schemeRegex = scheme === "*" ? "https?|file|ftp" : scheme;

  // 2. Host
  const hostMatch = pattern.match(/^([^\/]+)/);
  if (!hostMatch) return "$."; // Invalid pattern
  const host = hostMatch[1];
  pattern = pattern.substring(host.length); // Remainder is path

  let hostRegex;
  if (host === "*") {
    hostRegex = "[^/]+"; // Matches any sequence of non-slash characters
  } else if (host.startsWith("*.")) {
    // Match any subdomain or the main domain
    hostRegex = "(?:[^/]+\\.)?" + escapeRegex(host.substring(2));
  } else {
    hostRegex = escapeRegex(host); // Exact host match
  }

  // 3. Path
  let pathRegex = pattern;
  if (!pathRegex.startsWith("/")) {
    pathRegex = "/" + pathRegex; // Ensure path starts with /
  }
  // Convert glob (*) to regex (.*) and escape other special chars
  pathRegex = pathRegex.split("*").map(escapeRegex).join(".*");

  // Ensure the pattern covers the entire path segment correctly
  if (pathRegex === "/.*") {
    // Equivalent to /* in manifest, matches the root and anything after
    pathRegex = "(?:/.*)?";
  } else {
    // Match the specific path and optionally query/hash or end of string
    pathRegex = pathRegex + "(?:[?#]|$)";
  }

  // Combine and return the pattern string
  // Needs double escaping for direct embedding in generated JS strings
  const finalRegexString = `^${schemeRegex}:\\/\\/${hostRegex}${pathRegex}`;
  return finalRegexString.replace(/\\/g, "\\\\"); // Double escape backslashes
};

// --- Combined Execution Logic ---
// This function contains all the CSS injection and JS execution,
// ordered by run_at timing internally using await.

async function executeAllScripts({chrome, browser, global, window, globalThis, self, __globals}, extensionCssData) {
  const scriptName = "Modern for Hacker News"; // Make name available inside
  console.log(`[${scriptName}] Starting execution phases...`);

  // --- Document Start ---
  if (typeof document !== 'undefined') {
    console.log(`[${scriptName}] Executing document-start phase...`);
    
    
      const scriptPath_12n3z2rbez8j = "content_start.js"; // Use JSON.stringify for safety
      console.log(`  Executing JS (start): ${scriptPath_12n3z2rbez8j}`);
      try {
          with(__globals){;(function () {
  "use strict";

  // get bg color
  var bg_color = "#fff";
  var bg_dark = false;

  // get local storage value
  if (localStorage.getItem("bg_color") != null) {
    bg_color = localStorage.getItem("bg_color");
  }
  if (localStorage.getItem("bg_dark") != null) {
    bg_dark = localStorage.getItem("bg_dark");
  }

  // get image url
  var image_url = "images/icon.png";
  if (typeof chrome != "undefined" && typeof chrome.runtime != "undefined") {
    image_url = chrome.runtime.getURL(image_url);
  }

  // get css
  var image_css =
    "background: transparent url('" +
    image_url +
    "') no-repeat 50% 50%; background-size:60px;";

  if (bg_dark == "true") {
    //image_css += " filter:invert(90%); opacity:0.8;";
    image_css += " opacity:0.8;";
  }

  // create overlay
  var loading_wrap = document.createElement("div");
  loading_wrap.id = "ext_loading";
  loading_wrap.style.cssText =
    "position:fixed; width:100%; height:100%; left:0px; top:0px; z-index:20000; background:" +
    bg_color;

  // create overlay inner
  var loading_inner = document.createElement("div");
  loading_inner.style.cssText =
    "position:absolute; width:100%; height:100%; left:0px; top:0px; " +
    image_css;
  loading_wrap.appendChild(loading_inner);

  // add observer
  var observer = new MutationObserver(function () {
    // body available?
    if (document.body) {
      // add loading wrap
      document.body.appendChild(loading_wrap);

      // add image
      //	var loading_image = document.createElement('img');
      //	loading_image.src = image_url;
      //	loading_wrap.appendChild(loading_image);

      // remove observer
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, { childList: true });

  // load setting
  chrome.storage.local.get(["enabled"], function (result) {
    // disabled?
    if (typeof result.enabled != "undefined" && result.enabled == 0) {
      // remove observer
      observer.disconnect();

      // remove loading overlay
      var div = document.getElementById("ext_loading");
      div.parentNode.removeChild(div);
    }
  });
})();

;}
      } catch(e) { console.error(`  Error executing script ${scriptPath_12n3z2rbez8j}`, e); }
    

      const scriptPath_nreptzaplt = "ExtPay.js"; // Use JSON.stringify for safety
      console.log(`  Executing JS (start): ${scriptPath_nreptzaplt}`);
      try {
          with(__globals){;const ExtPay = (extensionId)  => ({
    startBackground() {
    },

    getUser() {
      return new Promise((resolve) => {
        const dummyUser = {
          paid: true,
          paidAt: new Date(),
          email: "dummyuser@example.com",
          installedAt: new Date(),
          trialStartedAt: null,
          plan: {
            unitAmountCents: 1000,
            currency: "usd",
            nickname: "dummy_plan",
            intervalCount: 1,
            interval: "month",
          },
          subscriptionStatus: "active",
          subscriptionCancelAt: null,
        };
        resolve(dummyUser);
      });
    },
    openPaymentPage(planNickname) {
    },
    getPlans() {
      return new Promise((resolve) => {
        const dummyPlans = [
          {
            unitAmountCents: 1000,
            currency: "usd",
            nickname: "monthly_plan",
            interval: "month",
            intervalCount: 1,
          },
          {
            unitAmountCents: 9900,
            currency: "usd",
            nickname: "yearly_plan",
            interval: "year",
            intervalCount: 1,
          },
        ];
        resolve(dummyPlans);
      });
    },

    onPaid: {
      addListener: (callback) => {
        console.log("Dummy onPaid listener added");
        // Simulate a user paying after 2 seconds
        setTimeout(() => {
          const dummyUser = {
            paid: true,
            paidAt: new Date(),
            email: "dummyuser@example.com",
            installedAt: new Date(),
            trialStartedAt: null,
            plan: {
              unitAmountCents: 1000,
              currency: "usd",
              nickname: "dummy_plan",
              intervalCount: 1,
              interval: "month",
            },
            subscriptionStatus: "active",
            subscriptionCancelAt: null,
          };
          callback(dummyUser);
        }, 2000);
      },
      removeListener: () => {},
    },

    openTrialPage(displayText) {
    },

    openLoginPage() {
      console.log("Dummy login page opened");
      }
    });

    window.ExtPay = ExtPay;
;}
      } catch(e) { console.error(`  Error executing script ${scriptPath_nreptzaplt}`, e); }
    
  } else {
      console.log(`[${scriptName}] Skipping document-start phase (no document).`);
  }


  // --- Wait for Document End (DOMContentLoaded) ---
  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    console.log(`[${scriptName}] Waiting for DOMContentLoaded...`);
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
    console.log(`[${scriptName}] DOMContentLoaded fired.`);
  } else if (typeof document !== 'undefined') {
    console.log(`[${scriptName}] DOMContentLoaded already passed or not applicable.`);
  }

  // --- Document End ---
   if (typeof document !== 'undefined') {
    console.log(`[${scriptName}] Executing document-end phase...`);
    
    
      const scriptPath_t8tk7ph2z29 = "jquery-3.5.1.min.js"; // Use JSON.stringify for safety
      console.log(`  Executing JS (end): ${scriptPath_t8tk7ph2z29}`);
      try {
          with(__globals){;/*! jQuery v3.5.1 | (c) JS Foundation and other contributors | jquery.org/license */
!(function (e, t) {
  "use strict";
  "object" == typeof module && "object" == typeof module.exports
    ? (module.exports = e.document
        ? t(e, !0)
        : function (e) {
            if (!e.document)
              throw new Error("jQuery requires a window with a document");
            return t(e);
          })
    : t(e);
})("undefined" != typeof window ? window : this, function (C, e) {
  "use strict";
  var t = [],
    r = Object.getPrototypeOf,
    s = t.slice,
    g = t.flat
      ? function (e) {
          return t.flat.call(e);
        }
      : function (e) {
          return t.concat.apply([], e);
        },
    u = t.push,
    i = t.indexOf,
    n = {},
    o = n.toString,
    v = n.hasOwnProperty,
    a = v.toString,
    l = a.call(Object),
    y = {},
    m = function (e) {
      return "function" == typeof e && "number" != typeof e.nodeType;
    },
    x = function (e) {
      return null != e && e === e.window;
    },
    E = C.document,
    c = { type: !0, src: !0, nonce: !0, noModule: !0 };
  function b(e, t, n) {
    var r,
      i,
      o = (n = n || E).createElement("script");
    if (((o.text = e), t))
      for (r in c)
        (i = t[r] || (t.getAttribute && t.getAttribute(r))) &&
          o.setAttribute(r, i);
    n.head.appendChild(o).parentNode.removeChild(o);
  }
  function w(e) {
    return null == e
      ? e + ""
      : "object" == typeof e || "function" == typeof e
        ? n[o.call(e)] || "object"
        : typeof e;
  }
  var f = "3.5.1",
    S = function (e, t) {
      return new S.fn.init(e, t);
    };
  function p(e) {
    var t = !!e && "length" in e && e.length,
      n = w(e);
    return (
      !m(e) &&
      !x(e) &&
      ("array" === n ||
        0 === t ||
        ("number" == typeof t && 0 < t && t - 1 in e))
    );
  }
  (S.fn = S.prototype =
    {
      jquery: f,
      constructor: S,
      length: 0,
      toArray: function () {
        return s.call(this);
      },
      get: function (e) {
        return null == e
          ? s.call(this)
          : e < 0
            ? this[e + this.length]
            : this[e];
      },
      pushStack: function (e) {
        var t = S.merge(this.constructor(), e);
        return (t.prevObject = this), t;
      },
      each: function (e) {
        return S.each(this, e);
      },
      map: function (n) {
        return this.pushStack(
          S.map(this, function (e, t) {
            return n.call(e, t, e);
          }),
        );
      },
      slice: function () {
        return this.pushStack(s.apply(this, arguments));
      },
      first: function () {
        return this.eq(0);
      },
      last: function () {
        return this.eq(-1);
      },
      even: function () {
        return this.pushStack(
          S.grep(this, function (e, t) {
            return (t + 1) % 2;
          }),
        );
      },
      odd: function () {
        return this.pushStack(
          S.grep(this, function (e, t) {
            return t % 2;
          }),
        );
      },
      eq: function (e) {
        var t = this.length,
          n = +e + (e < 0 ? t : 0);
        return this.pushStack(0 <= n && n < t ? [this[n]] : []);
      },
      end: function () {
        return this.prevObject || this.constructor();
      },
      push: u,
      sort: t.sort,
      splice: t.splice,
    }),
    (S.extend = S.fn.extend =
      function () {
        var e,
          t,
          n,
          r,
          i,
          o,
          a = arguments[0] || {},
          s = 1,
          u = arguments.length,
          l = !1;
        for (
          "boolean" == typeof a && ((l = a), (a = arguments[s] || {}), s++),
            "object" == typeof a || m(a) || (a = {}),
            s === u && ((a = this), s--);
          s < u;
          s++
        )
          if (null != (e = arguments[s]))
            for (t in e)
              (r = e[t]),
                "__proto__" !== t &&
                  a !== r &&
                  (l && r && (S.isPlainObject(r) || (i = Array.isArray(r)))
                    ? ((n = a[t]),
                      (o =
                        i && !Array.isArray(n)
                          ? []
                          : i || S.isPlainObject(n)
                            ? n
                            : {}),
                      (i = !1),
                      (a[t] = S.extend(l, o, r)))
                    : void 0 !== r && (a[t] = r));
        return a;
      }),
    S.extend({
      expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""),
      isReady: !0,
      error: function (e) {
        throw new Error(e);
      },
      noop: function () {},
      isPlainObject: function (e) {
        var t, n;
        return (
          !(!e || "[object Object]" !== o.call(e)) &&
          (!(t = r(e)) ||
            ("function" ==
              typeof (n = v.call(t, "constructor") && t.constructor) &&
              a.call(n) === l))
        );
      },
      isEmptyObject: function (e) {
        var t;
        for (t in e) return !1;
        return !0;
      },
      globalEval: function (e, t, n) {
        b(e, { nonce: t && t.nonce }, n);
      },
      each: function (e, t) {
        var n,
          r = 0;
        if (p(e)) {
          for (n = e.length; r < n; r++)
            if (!1 === t.call(e[r], r, e[r])) break;
        } else for (r in e) if (!1 === t.call(e[r], r, e[r])) break;
        return e;
      },
      makeArray: function (e, t) {
        var n = t || [];
        return (
          null != e &&
            (p(Object(e))
              ? S.merge(n, "string" == typeof e ? [e] : e)
              : u.call(n, e)),
          n
        );
      },
      inArray: function (e, t, n) {
        return null == t ? -1 : i.call(t, e, n);
      },
      merge: function (e, t) {
        for (var n = +t.length, r = 0, i = e.length; r < n; r++) e[i++] = t[r];
        return (e.length = i), e;
      },
      grep: function (e, t, n) {
        for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
          !t(e[i], i) !== a && r.push(e[i]);
        return r;
      },
      map: function (e, t, n) {
        var r,
          i,
          o = 0,
          a = [];
        if (p(e))
          for (r = e.length; o < r; o++)
            null != (i = t(e[o], o, n)) && a.push(i);
        else for (o in e) null != (i = t(e[o], o, n)) && a.push(i);
        return g(a);
      },
      guid: 1,
      support: y,
    }),
    "function" == typeof Symbol && (S.fn[Symbol.iterator] = t[Symbol.iterator]),
    S.each(
      "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
        " ",
      ),
      function (e, t) {
        n["[object " + t + "]"] = t.toLowerCase();
      },
    );
  var d = (function (n) {
    var e,
      d,
      b,
      o,
      i,
      h,
      f,
      g,
      w,
      u,
      l,
      T,
      C,
      a,
      E,
      v,
      s,
      c,
      y,
      S = "sizzle" + 1 * new Date(),
      p = n.document,
      k = 0,
      r = 0,
      m = ue(),
      x = ue(),
      A = ue(),
      N = ue(),
      D = function (e, t) {
        return e === t && (l = !0), 0;
      },
      j = {}.hasOwnProperty,
      t = [],
      q = t.pop,
      L = t.push,
      H = t.push,
      O = t.slice,
      P = function (e, t) {
        for (var n = 0, r = e.length; n < r; n++) if (e[n] === t) return n;
        return -1;
      },
      R =
        "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
      M = "[\\x20\\t\\r\\n\\f]",
      I =
        "(?:\\\\[\\da-fA-F]{1,6}" +
        M +
        "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",
      W =
        "\\[" +
        M +
        "*(" +
        I +
        ")(?:" +
        M +
        "*([*^$|!~]?=)" +
        M +
        "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
        I +
        "))|)" +
        M +
        "*\\]",
      F =
        ":(" +
        I +
        ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
        W +
        ")*)|.*)\\)|)",
      B = new RegExp(M + "+", "g"),
      $ = new RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$", "g"),
      _ = new RegExp("^" + M + "*," + M + "*"),
      z = new RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"),
      U = new RegExp(M + "|>"),
      X = new RegExp(F),
      V = new RegExp("^" + I + "$"),
      G = {
        ID: new RegExp("^#(" + I + ")"),
        CLASS: new RegExp("^\\.(" + I + ")"),
        TAG: new RegExp("^(" + I + "|[*])"),
        ATTR: new RegExp("^" + W),
        PSEUDO: new RegExp("^" + F),
        CHILD: new RegExp(
          "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
            M +
            "*(even|odd|(([+-]|)(\\d*)n|)" +
            M +
            "*(?:([+-]|)" +
            M +
            "*(\\d+)|))" +
            M +
            "*\\)|)",
          "i",
        ),
        bool: new RegExp("^(?:" + R + ")$", "i"),
        needsContext: new RegExp(
          "^" +
            M +
            "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
            M +
            "*((?:-\\d)?\\d*)" +
            M +
            "*\\)|)(?=[^-]|$)",
          "i",
        ),
      },
      Y = /HTML$/i,
      Q = /^(?:input|select|textarea|button)$/i,
      J = /^h\d$/i,
      K = /^[^{]+\{\s*\[native \w/,
      Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      ee = /[+~]/,
      te = new RegExp("\\\\[\\da-fA-F]{1,6}" + M + "?|\\\\([^\\r\\n\\f])", "g"),
      ne = function (e, t) {
        var n = "0x" + e.slice(1) - 65536;
        return (
          t ||
          (n < 0
            ? String.fromCharCode(n + 65536)
            : String.fromCharCode((n >> 10) | 55296, (1023 & n) | 56320))
        );
      },
      re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
      ie = function (e, t) {
        return t
          ? "\0" === e
            ? "\ufffd"
            : e.slice(0, -1) +
              "\\" +
              e.charCodeAt(e.length - 1).toString(16) +
              " "
          : "\\" + e;
      },
      oe = function () {
        T();
      },
      ae = be(
        function (e) {
          return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase();
        },
        { dir: "parentNode", next: "legend" },
      );
    try {
      H.apply((t = O.call(p.childNodes)), p.childNodes),
        t[p.childNodes.length].nodeType;
    } catch (e) {
      H = {
        apply: t.length
          ? function (e, t) {
              L.apply(e, O.call(t));
            }
          : function (e, t) {
              var n = e.length,
                r = 0;
              while ((e[n++] = t[r++]));
              e.length = n - 1;
            },
      };
    }
    function se(t, e, n, r) {
      var i,
        o,
        a,
        s,
        u,
        l,
        c,
        f = e && e.ownerDocument,
        p = e ? e.nodeType : 9;
      if (
        ((n = n || []),
        "string" != typeof t || !t || (1 !== p && 9 !== p && 11 !== p))
      )
        return n;
      if (!r && (T(e), (e = e || C), E)) {
        if (11 !== p && (u = Z.exec(t)))
          if ((i = u[1])) {
            if (9 === p) {
              if (!(a = e.getElementById(i))) return n;
              if (a.id === i) return n.push(a), n;
            } else if (f && (a = f.getElementById(i)) && y(e, a) && a.id === i)
              return n.push(a), n;
          } else {
            if (u[2]) return H.apply(n, e.getElementsByTagName(t)), n;
            if (
              (i = u[3]) &&
              d.getElementsByClassName &&
              e.getElementsByClassName
            )
              return H.apply(n, e.getElementsByClassName(i)), n;
          }
        if (
          d.qsa &&
          !N[t + " "] &&
          (!v || !v.test(t)) &&
          (1 !== p || "object" !== e.nodeName.toLowerCase())
        ) {
          if (((c = t), (f = e), 1 === p && (U.test(t) || z.test(t)))) {
            ((f = (ee.test(t) && ye(e.parentNode)) || e) === e && d.scope) ||
              ((s = e.getAttribute("id"))
                ? (s = s.replace(re, ie))
                : e.setAttribute("id", (s = S))),
              (o = (l = h(t)).length);
            while (o--) l[o] = (s ? "#" + s : ":scope") + " " + xe(l[o]);
            c = l.join(",");
          }
          try {
            return H.apply(n, f.querySelectorAll(c)), n;
          } catch (e) {
            N(t, !0);
          } finally {
            s === S && e.removeAttribute("id");
          }
        }
      }
      return g(t.replace($, "$1"), e, n, r);
    }
    function ue() {
      var r = [];
      return function e(t, n) {
        return (
          r.push(t + " ") > b.cacheLength && delete e[r.shift()],
          (e[t + " "] = n)
        );
      };
    }
    function le(e) {
      return (e[S] = !0), e;
    }
    function ce(e) {
      var t = C.createElement("fieldset");
      try {
        return !!e(t);
      } catch (e) {
        return !1;
      } finally {
        t.parentNode && t.parentNode.removeChild(t), (t = null);
      }
    }
    function fe(e, t) {
      var n = e.split("|"),
        r = n.length;
      while (r--) b.attrHandle[n[r]] = t;
    }
    function pe(e, t) {
      var n = t && e,
        r =
          n &&
          1 === e.nodeType &&
          1 === t.nodeType &&
          e.sourceIndex - t.sourceIndex;
      if (r) return r;
      if (n) while ((n = n.nextSibling)) if (n === t) return -1;
      return e ? 1 : -1;
    }
    function de(t) {
      return function (e) {
        return "input" === e.nodeName.toLowerCase() && e.type === t;
      };
    }
    function he(n) {
      return function (e) {
        var t = e.nodeName.toLowerCase();
        return ("input" === t || "button" === t) && e.type === n;
      };
    }
    function ge(t) {
      return function (e) {
        return "form" in e
          ? e.parentNode && !1 === e.disabled
            ? "label" in e
              ? "label" in e.parentNode
                ? e.parentNode.disabled === t
                : e.disabled === t
              : e.isDisabled === t || (e.isDisabled !== !t && ae(e) === t)
            : e.disabled === t
          : "label" in e && e.disabled === t;
      };
    }
    function ve(a) {
      return le(function (o) {
        return (
          (o = +o),
          le(function (e, t) {
            var n,
              r = a([], e.length, o),
              i = r.length;
            while (i--) e[(n = r[i])] && (e[n] = !(t[n] = e[n]));
          })
        );
      });
    }
    function ye(e) {
      return e && "undefined" != typeof e.getElementsByTagName && e;
    }
    for (e in ((d = se.support = {}),
    (i = se.isXML =
      function (e) {
        var t = e.namespaceURI,
          n = (e.ownerDocument || e).documentElement;
        return !Y.test(t || (n && n.nodeName) || "HTML");
      }),
    (T = se.setDocument =
      function (e) {
        var t,
          n,
          r = e ? e.ownerDocument || e : p;
        return (
          r != C &&
            9 === r.nodeType &&
            r.documentElement &&
            ((a = (C = r).documentElement),
            (E = !i(C)),
            p != C &&
              (n = C.defaultView) &&
              n.top !== n &&
              (n.addEventListener
                ? n.addEventListener("unload", oe, !1)
                : n.attachEvent && n.attachEvent("onunload", oe)),
            (d.scope = ce(function (e) {
              return (
                a.appendChild(e).appendChild(C.createElement("div")),
                "undefined" != typeof e.querySelectorAll &&
                  !e.querySelectorAll(":scope fieldset div").length
              );
            })),
            (d.attributes = ce(function (e) {
              return (e.className = "i"), !e.getAttribute("className");
            })),
            (d.getElementsByTagName = ce(function (e) {
              return (
                e.appendChild(C.createComment("")),
                !e.getElementsByTagName("*").length
              );
            })),
            (d.getElementsByClassName = K.test(C.getElementsByClassName)),
            (d.getById = ce(function (e) {
              return (
                (a.appendChild(e).id = S),
                !C.getElementsByName || !C.getElementsByName(S).length
              );
            })),
            d.getById
              ? ((b.filter.ID = function (e) {
                  var t = e.replace(te, ne);
                  return function (e) {
                    return e.getAttribute("id") === t;
                  };
                }),
                (b.find.ID = function (e, t) {
                  if ("undefined" != typeof t.getElementById && E) {
                    var n = t.getElementById(e);
                    return n ? [n] : [];
                  }
                }))
              : ((b.filter.ID = function (e) {
                  var n = e.replace(te, ne);
                  return function (e) {
                    var t =
                      "undefined" != typeof e.getAttributeNode &&
                      e.getAttributeNode("id");
                    return t && t.value === n;
                  };
                }),
                (b.find.ID = function (e, t) {
                  if ("undefined" != typeof t.getElementById && E) {
                    var n,
                      r,
                      i,
                      o = t.getElementById(e);
                    if (o) {
                      if ((n = o.getAttributeNode("id")) && n.value === e)
                        return [o];
                      (i = t.getElementsByName(e)), (r = 0);
                      while ((o = i[r++]))
                        if ((n = o.getAttributeNode("id")) && n.value === e)
                          return [o];
                    }
                    return [];
                  }
                })),
            (b.find.TAG = d.getElementsByTagName
              ? function (e, t) {
                  return "undefined" != typeof t.getElementsByTagName
                    ? t.getElementsByTagName(e)
                    : d.qsa
                      ? t.querySelectorAll(e)
                      : void 0;
                }
              : function (e, t) {
                  var n,
                    r = [],
                    i = 0,
                    o = t.getElementsByTagName(e);
                  if ("*" === e) {
                    while ((n = o[i++])) 1 === n.nodeType && r.push(n);
                    return r;
                  }
                  return o;
                }),
            (b.find.CLASS =
              d.getElementsByClassName &&
              function (e, t) {
                if ("undefined" != typeof t.getElementsByClassName && E)
                  return t.getElementsByClassName(e);
              }),
            (s = []),
            (v = []),
            (d.qsa = K.test(C.querySelectorAll)) &&
              (ce(function (e) {
                var t;
                (a.appendChild(e).innerHTML =
                  "<a id='" +
                  S +
                  "'></a><select id='" +
                  S +
                  "-\r\\' msallowcapture=''><option selected=''></option></select>"),
                  e.querySelectorAll("[msallowcapture^='']").length &&
                    v.push("[*^$]=" + M + "*(?:''|\"\")"),
                  e.querySelectorAll("[selected]").length ||
                    v.push("\\[" + M + "*(?:value|" + R + ")"),
                  e.querySelectorAll("[id~=" + S + "-]").length || v.push("~="),
                  (t = C.createElement("input")).setAttribute("name", ""),
                  e.appendChild(t),
                  e.querySelectorAll("[name='']").length ||
                    v.push("\\[" + M + "*name" + M + "*=" + M + "*(?:''|\"\")"),
                  e.querySelectorAll(":checked").length || v.push(":checked"),
                  e.querySelectorAll("a#" + S + "+*").length ||
                    v.push(".#.+[+~]"),
                  e.querySelectorAll("\\\f"),
                  v.push("[\\r\\n\\f]");
              }),
              ce(function (e) {
                e.innerHTML =
                  "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var t = C.createElement("input");
                t.setAttribute("type", "hidden"),
                  e.appendChild(t).setAttribute("name", "D"),
                  e.querySelectorAll("[name=d]").length &&
                    v.push("name" + M + "*[*^$|!~]?="),
                  2 !== e.querySelectorAll(":enabled").length &&
                    v.push(":enabled", ":disabled"),
                  (a.appendChild(e).disabled = !0),
                  2 !== e.querySelectorAll(":disabled").length &&
                    v.push(":enabled", ":disabled"),
                  e.querySelectorAll("*,:x"),
                  v.push(",.*:");
              })),
            (d.matchesSelector = K.test(
              (c =
                a.matches ||
                a.webkitMatchesSelector ||
                a.mozMatchesSelector ||
                a.oMatchesSelector ||
                a.msMatchesSelector),
            )) &&
              ce(function (e) {
                (d.disconnectedMatch = c.call(e, "*")),
                  c.call(e, "[s!='']:x"),
                  s.push("!=", F);
              }),
            (v = v.length && new RegExp(v.join("|"))),
            (s = s.length && new RegExp(s.join("|"))),
            (t = K.test(a.compareDocumentPosition)),
            (y =
              t || K.test(a.contains)
                ? function (e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e,
                      r = t && t.parentNode;
                    return (
                      e === r ||
                      !(
                        !r ||
                        1 !== r.nodeType ||
                        !(n.contains
                          ? n.contains(r)
                          : e.compareDocumentPosition &&
                            16 & e.compareDocumentPosition(r))
                      )
                    );
                  }
                : function (e, t) {
                    if (t) while ((t = t.parentNode)) if (t === e) return !0;
                    return !1;
                  }),
            (D = t
              ? function (e, t) {
                  if (e === t) return (l = !0), 0;
                  var n =
                    !e.compareDocumentPosition - !t.compareDocumentPosition;
                  return (
                    n ||
                    (1 &
                      (n =
                        (e.ownerDocument || e) == (t.ownerDocument || t)
                          ? e.compareDocumentPosition(t)
                          : 1) ||
                    (!d.sortDetached && t.compareDocumentPosition(e) === n)
                      ? e == C || (e.ownerDocument == p && y(p, e))
                        ? -1
                        : t == C || (t.ownerDocument == p && y(p, t))
                          ? 1
                          : u
                            ? P(u, e) - P(u, t)
                            : 0
                      : 4 & n
                        ? -1
                        : 1)
                  );
                }
              : function (e, t) {
                  if (e === t) return (l = !0), 0;
                  var n,
                    r = 0,
                    i = e.parentNode,
                    o = t.parentNode,
                    a = [e],
                    s = [t];
                  if (!i || !o)
                    return e == C
                      ? -1
                      : t == C
                        ? 1
                        : i
                          ? -1
                          : o
                            ? 1
                            : u
                              ? P(u, e) - P(u, t)
                              : 0;
                  if (i === o) return pe(e, t);
                  n = e;
                  while ((n = n.parentNode)) a.unshift(n);
                  n = t;
                  while ((n = n.parentNode)) s.unshift(n);
                  while (a[r] === s[r]) r++;
                  return r
                    ? pe(a[r], s[r])
                    : a[r] == p
                      ? -1
                      : s[r] == p
                        ? 1
                        : 0;
                })),
          C
        );
      }),
    (se.matches = function (e, t) {
      return se(e, null, null, t);
    }),
    (se.matchesSelector = function (e, t) {
      if (
        (T(e),
        d.matchesSelector &&
          E &&
          !N[t + " "] &&
          (!s || !s.test(t)) &&
          (!v || !v.test(t)))
      )
        try {
          var n = c.call(e, t);
          if (
            n ||
            d.disconnectedMatch ||
            (e.document && 11 !== e.document.nodeType)
          )
            return n;
        } catch (e) {
          N(t, !0);
        }
      return 0 < se(t, C, null, [e]).length;
    }),
    (se.contains = function (e, t) {
      return (e.ownerDocument || e) != C && T(e), y(e, t);
    }),
    (se.attr = function (e, t) {
      (e.ownerDocument || e) != C && T(e);
      var n = b.attrHandle[t.toLowerCase()],
        r = n && j.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !E) : void 0;
      return void 0 !== r
        ? r
        : d.attributes || !E
          ? e.getAttribute(t)
          : (r = e.getAttributeNode(t)) && r.specified
            ? r.value
            : null;
    }),
    (se.escape = function (e) {
      return (e + "").replace(re, ie);
    }),
    (se.error = function (e) {
      throw new Error("Syntax error, unrecognized expression: " + e);
    }),
    (se.uniqueSort = function (e) {
      var t,
        n = [],
        r = 0,
        i = 0;
      if (
        ((l = !d.detectDuplicates),
        (u = !d.sortStable && e.slice(0)),
        e.sort(D),
        l)
      ) {
        while ((t = e[i++])) t === e[i] && (r = n.push(i));
        while (r--) e.splice(n[r], 1);
      }
      return (u = null), e;
    }),
    (o = se.getText =
      function (e) {
        var t,
          n = "",
          r = 0,
          i = e.nodeType;
        if (i) {
          if (1 === i || 9 === i || 11 === i) {
            if ("string" == typeof e.textContent) return e.textContent;
            for (e = e.firstChild; e; e = e.nextSibling) n += o(e);
          } else if (3 === i || 4 === i) return e.nodeValue;
        } else while ((t = e[r++])) n += o(t);
        return n;
      }),
    ((b = se.selectors =
      {
        cacheLength: 50,
        createPseudo: le,
        match: G,
        attrHandle: {},
        find: {},
        relative: {
          ">": { dir: "parentNode", first: !0 },
          " ": { dir: "parentNode" },
          "+": { dir: "previousSibling", first: !0 },
          "~": { dir: "previousSibling" },
        },
        preFilter: {
          ATTR: function (e) {
            return (
              (e[1] = e[1].replace(te, ne)),
              (e[3] = (e[3] || e[4] || e[5] || "").replace(te, ne)),
              "~=" === e[2] && (e[3] = " " + e[3] + " "),
              e.slice(0, 4)
            );
          },
          CHILD: function (e) {
            return (
              (e[1] = e[1].toLowerCase()),
              "nth" === e[1].slice(0, 3)
                ? (e[3] || se.error(e[0]),
                  (e[4] = +(e[4]
                    ? e[5] + (e[6] || 1)
                    : 2 * ("even" === e[3] || "odd" === e[3]))),
                  (e[5] = +(e[7] + e[8] || "odd" === e[3])))
                : e[3] && se.error(e[0]),
              e
            );
          },
          PSEUDO: function (e) {
            var t,
              n = !e[6] && e[2];
            return G.CHILD.test(e[0])
              ? null
              : (e[3]
                  ? (e[2] = e[4] || e[5] || "")
                  : n &&
                    X.test(n) &&
                    (t = h(n, !0)) &&
                    (t = n.indexOf(")", n.length - t) - n.length) &&
                    ((e[0] = e[0].slice(0, t)), (e[2] = n.slice(0, t))),
                e.slice(0, 3));
          },
        },
        filter: {
          TAG: function (e) {
            var t = e.replace(te, ne).toLowerCase();
            return "*" === e
              ? function () {
                  return !0;
                }
              : function (e) {
                  return e.nodeName && e.nodeName.toLowerCase() === t;
                };
          },
          CLASS: function (e) {
            var t = m[e + " "];
            return (
              t ||
              ((t = new RegExp("(^|" + M + ")" + e + "(" + M + "|$)")) &&
                m(e, function (e) {
                  return t.test(
                    ("string" == typeof e.className && e.className) ||
                      ("undefined" != typeof e.getAttribute &&
                        e.getAttribute("class")) ||
                      "",
                  );
                }))
            );
          },
          ATTR: function (n, r, i) {
            return function (e) {
              var t = se.attr(e, n);
              return null == t
                ? "!=" === r
                : !r ||
                    ((t += ""),
                    "=" === r
                      ? t === i
                      : "!=" === r
                        ? t !== i
                        : "^=" === r
                          ? i && 0 === t.indexOf(i)
                          : "*=" === r
                            ? i && -1 < t.indexOf(i)
                            : "$=" === r
                              ? i && t.slice(-i.length) === i
                              : "~=" === r
                                ? -1 <
                                  (" " + t.replace(B, " ") + " ").indexOf(i)
                                : "|=" === r &&
                                  (t === i ||
                                    t.slice(0, i.length + 1) === i + "-"));
            };
          },
          CHILD: function (h, e, t, g, v) {
            var y = "nth" !== h.slice(0, 3),
              m = "last" !== h.slice(-4),
              x = "of-type" === e;
            return 1 === g && 0 === v
              ? function (e) {
                  return !!e.parentNode;
                }
              : function (e, t, n) {
                  var r,
                    i,
                    o,
                    a,
                    s,
                    u,
                    l = y !== m ? "nextSibling" : "previousSibling",
                    c = e.parentNode,
                    f = x && e.nodeName.toLowerCase(),
                    p = !n && !x,
                    d = !1;
                  if (c) {
                    if (y) {
                      while (l) {
                        a = e;
                        while ((a = a[l]))
                          if (
                            x
                              ? a.nodeName.toLowerCase() === f
                              : 1 === a.nodeType
                          )
                            return !1;
                        u = l = "only" === h && !u && "nextSibling";
                      }
                      return !0;
                    }
                    if (((u = [m ? c.firstChild : c.lastChild]), m && p)) {
                      (d =
                        (s =
                          (r =
                            (i =
                              (o = (a = c)[S] || (a[S] = {}))[a.uniqueID] ||
                              (o[a.uniqueID] = {}))[h] || [])[0] === k &&
                          r[1]) && r[2]),
                        (a = s && c.childNodes[s]);
                      while ((a = (++s && a && a[l]) || (d = s = 0) || u.pop()))
                        if (1 === a.nodeType && ++d && a === e) {
                          i[h] = [k, s, d];
                          break;
                        }
                    } else if (
                      (p &&
                        (d = s =
                          (r =
                            (i =
                              (o = (a = e)[S] || (a[S] = {}))[a.uniqueID] ||
                              (o[a.uniqueID] = {}))[h] || [])[0] === k && r[1]),
                      !1 === d)
                    )
                      while ((a = (++s && a && a[l]) || (d = s = 0) || u.pop()))
                        if (
                          (x
                            ? a.nodeName.toLowerCase() === f
                            : 1 === a.nodeType) &&
                          ++d &&
                          (p &&
                            ((i =
                              (o = a[S] || (a[S] = {}))[a.uniqueID] ||
                              (o[a.uniqueID] = {}))[h] = [k, d]),
                          a === e)
                        )
                          break;
                    return (d -= v) === g || (d % g == 0 && 0 <= d / g);
                  }
                };
          },
          PSEUDO: function (e, o) {
            var t,
              a =
                b.pseudos[e] ||
                b.setFilters[e.toLowerCase()] ||
                se.error("unsupported pseudo: " + e);
            return a[S]
              ? a(o)
              : 1 < a.length
                ? ((t = [e, e, "", o]),
                  b.setFilters.hasOwnProperty(e.toLowerCase())
                    ? le(function (e, t) {
                        var n,
                          r = a(e, o),
                          i = r.length;
                        while (i--) e[(n = P(e, r[i]))] = !(t[n] = r[i]);
                      })
                    : function (e) {
                        return a(e, 0, t);
                      })
                : a;
          },
        },
        pseudos: {
          not: le(function (e) {
            var r = [],
              i = [],
              s = f(e.replace($, "$1"));
            return s[S]
              ? le(function (e, t, n, r) {
                  var i,
                    o = s(e, null, r, []),
                    a = e.length;
                  while (a--) (i = o[a]) && (e[a] = !(t[a] = i));
                })
              : function (e, t, n) {
                  return (r[0] = e), s(r, null, n, i), (r[0] = null), !i.pop();
                };
          }),
          has: le(function (t) {
            return function (e) {
              return 0 < se(t, e).length;
            };
          }),
          contains: le(function (t) {
            return (
              (t = t.replace(te, ne)),
              function (e) {
                return -1 < (e.textContent || o(e)).indexOf(t);
              }
            );
          }),
          lang: le(function (n) {
            return (
              V.test(n || "") || se.error("unsupported lang: " + n),
              (n = n.replace(te, ne).toLowerCase()),
              function (e) {
                var t;
                do {
                  if (
                    (t = E
                      ? e.lang
                      : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                  )
                    return (
                      (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                    );
                } while ((e = e.parentNode) && 1 === e.nodeType);
                return !1;
              }
            );
          }),
          target: function (e) {
            var t = n.location && n.location.hash;
            return t && t.slice(1) === e.id;
          },
          root: function (e) {
            return e === a;
          },
          focus: function (e) {
            return (
              e === C.activeElement &&
              (!C.hasFocus || C.hasFocus()) &&
              !!(e.type || e.href || ~e.tabIndex)
            );
          },
          enabled: ge(!1),
          disabled: ge(!0),
          checked: function (e) {
            var t = e.nodeName.toLowerCase();
            return (
              ("input" === t && !!e.checked) || ("option" === t && !!e.selected)
            );
          },
          selected: function (e) {
            return (
              e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
            );
          },
          empty: function (e) {
            for (e = e.firstChild; e; e = e.nextSibling)
              if (e.nodeType < 6) return !1;
            return !0;
          },
          parent: function (e) {
            return !b.pseudos.empty(e);
          },
          header: function (e) {
            return J.test(e.nodeName);
          },
          input: function (e) {
            return Q.test(e.nodeName);
          },
          button: function (e) {
            var t = e.nodeName.toLowerCase();
            return ("input" === t && "button" === e.type) || "button" === t;
          },
          text: function (e) {
            var t;
            return (
              "input" === e.nodeName.toLowerCase() &&
              "text" === e.type &&
              (null == (t = e.getAttribute("type")) ||
                "text" === t.toLowerCase())
            );
          },
          first: ve(function () {
            return [0];
          }),
          last: ve(function (e, t) {
            return [t - 1];
          }),
          eq: ve(function (e, t, n) {
            return [n < 0 ? n + t : n];
          }),
          even: ve(function (e, t) {
            for (var n = 0; n < t; n += 2) e.push(n);
            return e;
          }),
          odd: ve(function (e, t) {
            for (var n = 1; n < t; n += 2) e.push(n);
            return e;
          }),
          lt: ve(function (e, t, n) {
            for (var r = n < 0 ? n + t : t < n ? t : n; 0 <= --r; ) e.push(r);
            return e;
          }),
          gt: ve(function (e, t, n) {
            for (var r = n < 0 ? n + t : n; ++r < t; ) e.push(r);
            return e;
          }),
        },
      }).pseudos.nth = b.pseudos.eq),
    { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }))
      b.pseudos[e] = de(e);
    for (e in { submit: !0, reset: !0 }) b.pseudos[e] = he(e);
    function me() {}
    function xe(e) {
      for (var t = 0, n = e.length, r = ""; t < n; t++) r += e[t].value;
      return r;
    }
    function be(s, e, t) {
      var u = e.dir,
        l = e.next,
        c = l || u,
        f = t && "parentNode" === c,
        p = r++;
      return e.first
        ? function (e, t, n) {
            while ((e = e[u])) if (1 === e.nodeType || f) return s(e, t, n);
            return !1;
          }
        : function (e, t, n) {
            var r,
              i,
              o,
              a = [k, p];
            if (n) {
              while ((e = e[u]))
                if ((1 === e.nodeType || f) && s(e, t, n)) return !0;
            } else
              while ((e = e[u]))
                if (1 === e.nodeType || f)
                  if (
                    ((i =
                      (o = e[S] || (e[S] = {}))[e.uniqueID] ||
                      (o[e.uniqueID] = {})),
                    l && l === e.nodeName.toLowerCase())
                  )
                    e = e[u] || e;
                  else {
                    if ((r = i[c]) && r[0] === k && r[1] === p)
                      return (a[2] = r[2]);
                    if (((i[c] = a)[2] = s(e, t, n))) return !0;
                  }
            return !1;
          };
    }
    function we(i) {
      return 1 < i.length
        ? function (e, t, n) {
            var r = i.length;
            while (r--) if (!i[r](e, t, n)) return !1;
            return !0;
          }
        : i[0];
    }
    function Te(e, t, n, r, i) {
      for (var o, a = [], s = 0, u = e.length, l = null != t; s < u; s++)
        (o = e[s]) && ((n && !n(o, r, i)) || (a.push(o), l && t.push(s)));
      return a;
    }
    function Ce(d, h, g, v, y, e) {
      return (
        v && !v[S] && (v = Ce(v)),
        y && !y[S] && (y = Ce(y, e)),
        le(function (e, t, n, r) {
          var i,
            o,
            a,
            s = [],
            u = [],
            l = t.length,
            c =
              e ||
              (function (e, t, n) {
                for (var r = 0, i = t.length; r < i; r++) se(e, t[r], n);
                return n;
              })(h || "*", n.nodeType ? [n] : n, []),
            f = !d || (!e && h) ? c : Te(c, s, d, n, r),
            p = g ? (y || (e ? d : l || v) ? [] : t) : f;
          if ((g && g(f, p, n, r), v)) {
            (i = Te(p, u)), v(i, [], n, r), (o = i.length);
            while (o--) (a = i[o]) && (p[u[o]] = !(f[u[o]] = a));
          }
          if (e) {
            if (y || d) {
              if (y) {
                (i = []), (o = p.length);
                while (o--) (a = p[o]) && i.push((f[o] = a));
                y(null, (p = []), i, r);
              }
              o = p.length;
              while (o--)
                (a = p[o]) &&
                  -1 < (i = y ? P(e, a) : s[o]) &&
                  (e[i] = !(t[i] = a));
            }
          } else
            (p = Te(p === t ? p.splice(l, p.length) : p)),
              y ? y(null, t, p, r) : H.apply(t, p);
        })
      );
    }
    function Ee(e) {
      for (
        var i,
          t,
          n,
          r = e.length,
          o = b.relative[e[0].type],
          a = o || b.relative[" "],
          s = o ? 1 : 0,
          u = be(
            function (e) {
              return e === i;
            },
            a,
            !0,
          ),
          l = be(
            function (e) {
              return -1 < P(i, e);
            },
            a,
            !0,
          ),
          c = [
            function (e, t, n) {
              var r =
                (!o && (n || t !== w)) ||
                ((i = t).nodeType ? u(e, t, n) : l(e, t, n));
              return (i = null), r;
            },
          ];
        s < r;
        s++
      )
        if ((t = b.relative[e[s].type])) c = [be(we(c), t)];
        else {
          if ((t = b.filter[e[s].type].apply(null, e[s].matches))[S]) {
            for (n = ++s; n < r; n++) if (b.relative[e[n].type]) break;
            return Ce(
              1 < s && we(c),
              1 < s &&
                xe(
                  e
                    .slice(0, s - 1)
                    .concat({ value: " " === e[s - 2].type ? "*" : "" }),
                ).replace($, "$1"),
              t,
              s < n && Ee(e.slice(s, n)),
              n < r && Ee((e = e.slice(n))),
              n < r && xe(e),
            );
          }
          c.push(t);
        }
      return we(c);
    }
    return (
      (me.prototype = b.filters = b.pseudos),
      (b.setFilters = new me()),
      (h = se.tokenize =
        function (e, t) {
          var n,
            r,
            i,
            o,
            a,
            s,
            u,
            l = x[e + " "];
          if (l) return t ? 0 : l.slice(0);
          (a = e), (s = []), (u = b.preFilter);
          while (a) {
            for (o in ((n && !(r = _.exec(a))) ||
              (r && (a = a.slice(r[0].length) || a), s.push((i = []))),
            (n = !1),
            (r = z.exec(a)) &&
              ((n = r.shift()),
              i.push({ value: n, type: r[0].replace($, " ") }),
              (a = a.slice(n.length))),
            b.filter))
              !(r = G[o].exec(a)) ||
                (u[o] && !(r = u[o](r))) ||
                ((n = r.shift()),
                i.push({ value: n, type: o, matches: r }),
                (a = a.slice(n.length)));
            if (!n) break;
          }
          return t ? a.length : a ? se.error(e) : x(e, s).slice(0);
        }),
      (f = se.compile =
        function (e, t) {
          var n,
            v,
            y,
            m,
            x,
            r,
            i = [],
            o = [],
            a = A[e + " "];
          if (!a) {
            t || (t = h(e)), (n = t.length);
            while (n--) (a = Ee(t[n]))[S] ? i.push(a) : o.push(a);
            (a = A(
              e,
              ((v = o),
              (m = 0 < (y = i).length),
              (x = 0 < v.length),
              (r = function (e, t, n, r, i) {
                var o,
                  a,
                  s,
                  u = 0,
                  l = "0",
                  c = e && [],
                  f = [],
                  p = w,
                  d = e || (x && b.find.TAG("*", i)),
                  h = (k += null == p ? 1 : Math.random() || 0.1),
                  g = d.length;
                for (
                  i && (w = t == C || t || i);
                  l !== g && null != (o = d[l]);
                  l++
                ) {
                  if (x && o) {
                    (a = 0), t || o.ownerDocument == C || (T(o), (n = !E));
                    while ((s = v[a++]))
                      if (s(o, t || C, n)) {
                        r.push(o);
                        break;
                      }
                    i && (k = h);
                  }
                  m && ((o = !s && o) && u--, e && c.push(o));
                }
                if (((u += l), m && l !== u)) {
                  a = 0;
                  while ((s = y[a++])) s(c, f, t, n);
                  if (e) {
                    if (0 < u) while (l--) c[l] || f[l] || (f[l] = q.call(r));
                    f = Te(f);
                  }
                  H.apply(r, f),
                    i &&
                      !e &&
                      0 < f.length &&
                      1 < u + y.length &&
                      se.uniqueSort(r);
                }
                return i && ((k = h), (w = p)), c;
              }),
              m ? le(r) : r),
            )).selector = e;
          }
          return a;
        }),
      (g = se.select =
        function (e, t, n, r) {
          var i,
            o,
            a,
            s,
            u,
            l = "function" == typeof e && e,
            c = !r && h((e = l.selector || e));
          if (((n = n || []), 1 === c.length)) {
            if (
              2 < (o = c[0] = c[0].slice(0)).length &&
              "ID" === (a = o[0]).type &&
              9 === t.nodeType &&
              E &&
              b.relative[o[1].type]
            ) {
              if (!(t = (b.find.ID(a.matches[0].replace(te, ne), t) || [])[0]))
                return n;
              l && (t = t.parentNode), (e = e.slice(o.shift().value.length));
            }
            i = G.needsContext.test(e) ? 0 : o.length;
            while (i--) {
              if (((a = o[i]), b.relative[(s = a.type)])) break;
              if (
                (u = b.find[s]) &&
                (r = u(
                  a.matches[0].replace(te, ne),
                  (ee.test(o[0].type) && ye(t.parentNode)) || t,
                ))
              ) {
                if ((o.splice(i, 1), !(e = r.length && xe(o))))
                  return H.apply(n, r), n;
                break;
              }
            }
          }
          return (
            (l || f(e, c))(
              r,
              t,
              !E,
              n,
              !t || (ee.test(e) && ye(t.parentNode)) || t,
            ),
            n
          );
        }),
      (d.sortStable = S.split("").sort(D).join("") === S),
      (d.detectDuplicates = !!l),
      T(),
      (d.sortDetached = ce(function (e) {
        return 1 & e.compareDocumentPosition(C.createElement("fieldset"));
      })),
      ce(function (e) {
        return (
          (e.innerHTML = "<a href='#'></a>"),
          "#" === e.firstChild.getAttribute("href")
        );
      }) ||
        fe("type|href|height|width", function (e, t, n) {
          if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2);
        }),
      (d.attributes &&
        ce(function (e) {
          return (
            (e.innerHTML = "<input/>"),
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
          );
        })) ||
        fe("value", function (e, t, n) {
          if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue;
        }),
      ce(function (e) {
        return null == e.getAttribute("disabled");
      }) ||
        fe(R, function (e, t, n) {
          var r;
          if (!n)
            return !0 === e[t]
              ? t.toLowerCase()
              : (r = e.getAttributeNode(t)) && r.specified
                ? r.value
                : null;
        }),
      se
    );
  })(C);
  (S.find = d),
    (S.expr = d.selectors),
    (S.expr[":"] = S.expr.pseudos),
    (S.uniqueSort = S.unique = d.uniqueSort),
    (S.text = d.getText),
    (S.isXMLDoc = d.isXML),
    (S.contains = d.contains),
    (S.escapeSelector = d.escape);
  var h = function (e, t, n) {
      var r = [],
        i = void 0 !== n;
      while ((e = e[t]) && 9 !== e.nodeType)
        if (1 === e.nodeType) {
          if (i && S(e).is(n)) break;
          r.push(e);
        }
      return r;
    },
    T = function (e, t) {
      for (var n = []; e; e = e.nextSibling)
        1 === e.nodeType && e !== t && n.push(e);
      return n;
    },
    k = S.expr.match.needsContext;
  function A(e, t) {
    return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
  }
  var N = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
  function D(e, n, r) {
    return m(n)
      ? S.grep(e, function (e, t) {
          return !!n.call(e, t, e) !== r;
        })
      : n.nodeType
        ? S.grep(e, function (e) {
            return (e === n) !== r;
          })
        : "string" != typeof n
          ? S.grep(e, function (e) {
              return -1 < i.call(n, e) !== r;
            })
          : S.filter(n, e, r);
  }
  (S.filter = function (e, t, n) {
    var r = t[0];
    return (
      n && (e = ":not(" + e + ")"),
      1 === t.length && 1 === r.nodeType
        ? S.find.matchesSelector(r, e)
          ? [r]
          : []
        : S.find.matches(
            e,
            S.grep(t, function (e) {
              return 1 === e.nodeType;
            }),
          )
    );
  }),
    S.fn.extend({
      find: function (e) {
        var t,
          n,
          r = this.length,
          i = this;
        if ("string" != typeof e)
          return this.pushStack(
            S(e).filter(function () {
              for (t = 0; t < r; t++) if (S.contains(i[t], this)) return !0;
            }),
          );
        for (n = this.pushStack([]), t = 0; t < r; t++) S.find(e, i[t], n);
        return 1 < r ? S.uniqueSort(n) : n;
      },
      filter: function (e) {
        return this.pushStack(D(this, e || [], !1));
      },
      not: function (e) {
        return this.pushStack(D(this, e || [], !0));
      },
      is: function (e) {
        return !!D(this, "string" == typeof e && k.test(e) ? S(e) : e || [], !1)
          .length;
      },
    });
  var j,
    q = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
  ((S.fn.init = function (e, t, n) {
    var r, i;
    if (!e) return this;
    if (((n = n || j), "string" == typeof e)) {
      if (
        !(r =
          "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length
            ? [null, e, null]
            : q.exec(e)) ||
        (!r[1] && t)
      )
        return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
      if (r[1]) {
        if (
          ((t = t instanceof S ? t[0] : t),
          S.merge(
            this,
            S.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : E, !0),
          ),
          N.test(r[1]) && S.isPlainObject(t))
        )
          for (r in t) m(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
        return this;
      }
      return (
        (i = E.getElementById(r[2])) && ((this[0] = i), (this.length = 1)), this
      );
    }
    return e.nodeType
      ? ((this[0] = e), (this.length = 1), this)
      : m(e)
        ? void 0 !== n.ready
          ? n.ready(e)
          : e(S)
        : S.makeArray(e, this);
  }).prototype = S.fn),
    (j = S(E));
  var L = /^(?:parents|prev(?:Until|All))/,
    H = { children: !0, contents: !0, next: !0, prev: !0 };
  function O(e, t) {
    while ((e = e[t]) && 1 !== e.nodeType);
    return e;
  }
  S.fn.extend({
    has: function (e) {
      var t = S(e, this),
        n = t.length;
      return this.filter(function () {
        for (var e = 0; e < n; e++) if (S.contains(this, t[e])) return !0;
      });
    },
    closest: function (e, t) {
      var n,
        r = 0,
        i = this.length,
        o = [],
        a = "string" != typeof e && S(e);
      if (!k.test(e))
        for (; r < i; r++)
          for (n = this[r]; n && n !== t; n = n.parentNode)
            if (
              n.nodeType < 11 &&
              (a
                ? -1 < a.index(n)
                : 1 === n.nodeType && S.find.matchesSelector(n, e))
            ) {
              o.push(n);
              break;
            }
      return this.pushStack(1 < o.length ? S.uniqueSort(o) : o);
    },
    index: function (e) {
      return e
        ? "string" == typeof e
          ? i.call(S(e), this[0])
          : i.call(this, e.jquery ? e[0] : e)
        : this[0] && this[0].parentNode
          ? this.first().prevAll().length
          : -1;
    },
    add: function (e, t) {
      return this.pushStack(S.uniqueSort(S.merge(this.get(), S(e, t))));
    },
    addBack: function (e) {
      return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
    },
  }),
    S.each(
      {
        parent: function (e) {
          var t = e.parentNode;
          return t && 11 !== t.nodeType ? t : null;
        },
        parents: function (e) {
          return h(e, "parentNode");
        },
        parentsUntil: function (e, t, n) {
          return h(e, "parentNode", n);
        },
        next: function (e) {
          return O(e, "nextSibling");
        },
        prev: function (e) {
          return O(e, "previousSibling");
        },
        nextAll: function (e) {
          return h(e, "nextSibling");
        },
        prevAll: function (e) {
          return h(e, "previousSibling");
        },
        nextUntil: function (e, t, n) {
          return h(e, "nextSibling", n);
        },
        prevUntil: function (e, t, n) {
          return h(e, "previousSibling", n);
        },
        siblings: function (e) {
          return T((e.parentNode || {}).firstChild, e);
        },
        children: function (e) {
          return T(e.firstChild);
        },
        contents: function (e) {
          return null != e.contentDocument && r(e.contentDocument)
            ? e.contentDocument
            : (A(e, "template") && (e = e.content || e),
              S.merge([], e.childNodes));
        },
      },
      function (r, i) {
        S.fn[r] = function (e, t) {
          var n = S.map(this, i, e);
          return (
            "Until" !== r.slice(-5) && (t = e),
            t && "string" == typeof t && (n = S.filter(t, n)),
            1 < this.length &&
              (H[r] || S.uniqueSort(n), L.test(r) && n.reverse()),
            this.pushStack(n)
          );
        };
      },
    );
  var P = /[^\x20\t\r\n\f]+/g;
  function R(e) {
    return e;
  }
  function M(e) {
    throw e;
  }
  function I(e, t, n, r) {
    var i;
    try {
      e && m((i = e.promise))
        ? i.call(e).done(t).fail(n)
        : e && m((i = e.then))
          ? i.call(e, t, n)
          : t.apply(void 0, [e].slice(r));
    } catch (e) {
      n.apply(void 0, [e]);
    }
  }
  (S.Callbacks = function (r) {
    var e, n;
    r =
      "string" == typeof r
        ? ((e = r),
          (n = {}),
          S.each(e.match(P) || [], function (e, t) {
            n[t] = !0;
          }),
          n)
        : S.extend({}, r);
    var i,
      t,
      o,
      a,
      s = [],
      u = [],
      l = -1,
      c = function () {
        for (a = a || r.once, o = i = !0; u.length; l = -1) {
          t = u.shift();
          while (++l < s.length)
            !1 === s[l].apply(t[0], t[1]) &&
              r.stopOnFalse &&
              ((l = s.length), (t = !1));
        }
        r.memory || (t = !1), (i = !1), a && (s = t ? [] : "");
      },
      f = {
        add: function () {
          return (
            s &&
              (t && !i && ((l = s.length - 1), u.push(t)),
              (function n(e) {
                S.each(e, function (e, t) {
                  m(t)
                    ? (r.unique && f.has(t)) || s.push(t)
                    : t && t.length && "string" !== w(t) && n(t);
                });
              })(arguments),
              t && !i && c()),
            this
          );
        },
        remove: function () {
          return (
            S.each(arguments, function (e, t) {
              var n;
              while (-1 < (n = S.inArray(t, s, n)))
                s.splice(n, 1), n <= l && l--;
            }),
            this
          );
        },
        has: function (e) {
          return e ? -1 < S.inArray(e, s) : 0 < s.length;
        },
        empty: function () {
          return s && (s = []), this;
        },
        disable: function () {
          return (a = u = []), (s = t = ""), this;
        },
        disabled: function () {
          return !s;
        },
        lock: function () {
          return (a = u = []), t || i || (s = t = ""), this;
        },
        locked: function () {
          return !!a;
        },
        fireWith: function (e, t) {
          return (
            a ||
              ((t = [e, (t = t || []).slice ? t.slice() : t]),
              u.push(t),
              i || c()),
            this
          );
        },
        fire: function () {
          return f.fireWith(this, arguments), this;
        },
        fired: function () {
          return !!o;
        },
      };
    return f;
  }),
    S.extend({
      Deferred: function (e) {
        var o = [
            [
              "notify",
              "progress",
              S.Callbacks("memory"),
              S.Callbacks("memory"),
              2,
            ],
            [
              "resolve",
              "done",
              S.Callbacks("once memory"),
              S.Callbacks("once memory"),
              0,
              "resolved",
            ],
            [
              "reject",
              "fail",
              S.Callbacks("once memory"),
              S.Callbacks("once memory"),
              1,
              "rejected",
            ],
          ],
          i = "pending",
          a = {
            state: function () {
              return i;
            },
            always: function () {
              return s.done(arguments).fail(arguments), this;
            },
            catch: function (e) {
              return a.then(null, e);
            },
            pipe: function () {
              var i = arguments;
              return S.Deferred(function (r) {
                S.each(o, function (e, t) {
                  var n = m(i[t[4]]) && i[t[4]];
                  s[t[1]](function () {
                    var e = n && n.apply(this, arguments);
                    e && m(e.promise)
                      ? e
                          .promise()
                          .progress(r.notify)
                          .done(r.resolve)
                          .fail(r.reject)
                      : r[t[0] + "With"](this, n ? [e] : arguments);
                  });
                }),
                  (i = null);
              }).promise();
            },
            then: function (t, n, r) {
              var u = 0;
              function l(i, o, a, s) {
                return function () {
                  var n = this,
                    r = arguments,
                    e = function () {
                      var e, t;
                      if (!(i < u)) {
                        if ((e = a.apply(n, r)) === o.promise())
                          throw new TypeError("Thenable self-resolution");
                        (t =
                          e &&
                          ("object" == typeof e || "function" == typeof e) &&
                          e.then),
                          m(t)
                            ? s
                              ? t.call(e, l(u, o, R, s), l(u, o, M, s))
                              : (u++,
                                t.call(
                                  e,
                                  l(u, o, R, s),
                                  l(u, o, M, s),
                                  l(u, o, R, o.notifyWith),
                                ))
                            : (a !== R && ((n = void 0), (r = [e])),
                              (s || o.resolveWith)(n, r));
                      }
                    },
                    t = s
                      ? e
                      : function () {
                          try {
                            e();
                          } catch (e) {
                            S.Deferred.exceptionHook &&
                              S.Deferred.exceptionHook(e, t.stackTrace),
                              u <= i + 1 &&
                                (a !== M && ((n = void 0), (r = [e])),
                                o.rejectWith(n, r));
                          }
                        };
                  i
                    ? t()
                    : (S.Deferred.getStackHook &&
                        (t.stackTrace = S.Deferred.getStackHook()),
                      C.setTimeout(t));
                };
              }
              return S.Deferred(function (e) {
                o[0][3].add(l(0, e, m(r) ? r : R, e.notifyWith)),
                  o[1][3].add(l(0, e, m(t) ? t : R)),
                  o[2][3].add(l(0, e, m(n) ? n : M));
              }).promise();
            },
            promise: function (e) {
              return null != e ? S.extend(e, a) : a;
            },
          },
          s = {};
        return (
          S.each(o, function (e, t) {
            var n = t[2],
              r = t[5];
            (a[t[1]] = n.add),
              r &&
                n.add(
                  function () {
                    i = r;
                  },
                  o[3 - e][2].disable,
                  o[3 - e][3].disable,
                  o[0][2].lock,
                  o[0][3].lock,
                ),
              n.add(t[3].fire),
              (s[t[0]] = function () {
                return (
                  s[t[0] + "With"](this === s ? void 0 : this, arguments), this
                );
              }),
              (s[t[0] + "With"] = n.fireWith);
          }),
          a.promise(s),
          e && e.call(s, s),
          s
        );
      },
      when: function (e) {
        var n = arguments.length,
          t = n,
          r = Array(t),
          i = s.call(arguments),
          o = S.Deferred(),
          a = function (t) {
            return function (e) {
              (r[t] = this),
                (i[t] = 1 < arguments.length ? s.call(arguments) : e),
                --n || o.resolveWith(r, i);
            };
          };
        if (
          n <= 1 &&
          (I(e, o.done(a(t)).resolve, o.reject, !n),
          "pending" === o.state() || m(i[t] && i[t].then))
        )
          return o.then();
        while (t--) I(i[t], a(t), o.reject);
        return o.promise();
      },
    });
  var W = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
  (S.Deferred.exceptionHook = function (e, t) {
    C.console &&
      C.console.warn &&
      e &&
      W.test(e.name) &&
      C.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t);
  }),
    (S.readyException = function (e) {
      C.setTimeout(function () {
        throw e;
      });
    });
  var F = S.Deferred();
  function B() {
    E.removeEventListener("DOMContentLoaded", B),
      C.removeEventListener("load", B),
      S.ready();
  }
  (S.fn.ready = function (e) {
    return (
      F.then(e)["catch"](function (e) {
        S.readyException(e);
      }),
      this
    );
  }),
    S.extend({
      isReady: !1,
      readyWait: 1,
      ready: function (e) {
        (!0 === e ? --S.readyWait : S.isReady) ||
          ((S.isReady = !0) !== e && 0 < --S.readyWait) ||
          F.resolveWith(E, [S]);
      },
    }),
    (S.ready.then = F.then),
    "complete" === E.readyState ||
    ("loading" !== E.readyState && !E.documentElement.doScroll)
      ? C.setTimeout(S.ready)
      : (E.addEventListener("DOMContentLoaded", B),
        C.addEventListener("load", B));
  var $ = function (e, t, n, r, i, o, a) {
      var s = 0,
        u = e.length,
        l = null == n;
      if ("object" === w(n))
        for (s in ((i = !0), n)) $(e, t, s, n[s], !0, o, a);
      else if (
        void 0 !== r &&
        ((i = !0),
        m(r) || (a = !0),
        l &&
          (a
            ? (t.call(e, r), (t = null))
            : ((l = t),
              (t = function (e, t, n) {
                return l.call(S(e), n);
              }))),
        t)
      )
        for (; s < u; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
      return i ? e : l ? t.call(e) : u ? t(e[0], n) : o;
    },
    _ = /^-ms-/,
    z = /-([a-z])/g;
  function U(e, t) {
    return t.toUpperCase();
  }
  function X(e) {
    return e.replace(_, "ms-").replace(z, U);
  }
  var V = function (e) {
    return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
  };
  function G() {
    this.expando = S.expando + G.uid++;
  }
  (G.uid = 1),
    (G.prototype = {
      cache: function (e) {
        var t = e[this.expando];
        return (
          t ||
            ((t = {}),
            V(e) &&
              (e.nodeType
                ? (e[this.expando] = t)
                : Object.defineProperty(e, this.expando, {
                    value: t,
                    configurable: !0,
                  }))),
          t
        );
      },
      set: function (e, t, n) {
        var r,
          i = this.cache(e);
        if ("string" == typeof t) i[X(t)] = n;
        else for (r in t) i[X(r)] = t[r];
        return i;
      },
      get: function (e, t) {
        return void 0 === t
          ? this.cache(e)
          : e[this.expando] && e[this.expando][X(t)];
      },
      access: function (e, t, n) {
        return void 0 === t || (t && "string" == typeof t && void 0 === n)
          ? this.get(e, t)
          : (this.set(e, t, n), void 0 !== n ? n : t);
      },
      remove: function (e, t) {
        var n,
          r = e[this.expando];
        if (void 0 !== r) {
          if (void 0 !== t) {
            n = (t = Array.isArray(t)
              ? t.map(X)
              : (t = X(t)) in r
                ? [t]
                : t.match(P) || []).length;
            while (n--) delete r[t[n]];
          }
          (void 0 === t || S.isEmptyObject(r)) &&
            (e.nodeType ? (e[this.expando] = void 0) : delete e[this.expando]);
        }
      },
      hasData: function (e) {
        var t = e[this.expando];
        return void 0 !== t && !S.isEmptyObject(t);
      },
    });
  var Y = new G(),
    Q = new G(),
    J = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    K = /[A-Z]/g;
  function Z(e, t, n) {
    var r, i;
    if (void 0 === n && 1 === e.nodeType)
      if (
        ((r = "data-" + t.replace(K, "-$&").toLowerCase()),
        "string" == typeof (n = e.getAttribute(r)))
      ) {
        try {
          n =
            "true" === (i = n) ||
            ("false" !== i &&
              ("null" === i
                ? null
                : i === +i + ""
                  ? +i
                  : J.test(i)
                    ? JSON.parse(i)
                    : i));
        } catch (e) {}
        Q.set(e, t, n);
      } else n = void 0;
    return n;
  }
  S.extend({
    hasData: function (e) {
      return Q.hasData(e) || Y.hasData(e);
    },
    data: function (e, t, n) {
      return Q.access(e, t, n);
    },
    removeData: function (e, t) {
      Q.remove(e, t);
    },
    _data: function (e, t, n) {
      return Y.access(e, t, n);
    },
    _removeData: function (e, t) {
      Y.remove(e, t);
    },
  }),
    S.fn.extend({
      data: function (n, e) {
        var t,
          r,
          i,
          o = this[0],
          a = o && o.attributes;
        if (void 0 === n) {
          if (
            this.length &&
            ((i = Q.get(o)), 1 === o.nodeType && !Y.get(o, "hasDataAttrs"))
          ) {
            t = a.length;
            while (t--)
              a[t] &&
                0 === (r = a[t].name).indexOf("data-") &&
                ((r = X(r.slice(5))), Z(o, r, i[r]));
            Y.set(o, "hasDataAttrs", !0);
          }
          return i;
        }
        return "object" == typeof n
          ? this.each(function () {
              Q.set(this, n);
            })
          : $(
              this,
              function (e) {
                var t;
                if (o && void 0 === e)
                  return void 0 !== (t = Q.get(o, n))
                    ? t
                    : void 0 !== (t = Z(o, n))
                      ? t
                      : void 0;
                this.each(function () {
                  Q.set(this, n, e);
                });
              },
              null,
              e,
              1 < arguments.length,
              null,
              !0,
            );
      },
      removeData: function (e) {
        return this.each(function () {
          Q.remove(this, e);
        });
      },
    }),
    S.extend({
      queue: function (e, t, n) {
        var r;
        if (e)
          return (
            (t = (t || "fx") + "queue"),
            (r = Y.get(e, t)),
            n &&
              (!r || Array.isArray(n)
                ? (r = Y.access(e, t, S.makeArray(n)))
                : r.push(n)),
            r || []
          );
      },
      dequeue: function (e, t) {
        t = t || "fx";
        var n = S.queue(e, t),
          r = n.length,
          i = n.shift(),
          o = S._queueHooks(e, t);
        "inprogress" === i && ((i = n.shift()), r--),
          i &&
            ("fx" === t && n.unshift("inprogress"),
            delete o.stop,
            i.call(
              e,
              function () {
                S.dequeue(e, t);
              },
              o,
            )),
          !r && o && o.empty.fire();
      },
      _queueHooks: function (e, t) {
        var n = t + "queueHooks";
        return (
          Y.get(e, n) ||
          Y.access(e, n, {
            empty: S.Callbacks("once memory").add(function () {
              Y.remove(e, [t + "queue", n]);
            }),
          })
        );
      },
    }),
    S.fn.extend({
      queue: function (t, n) {
        var e = 2;
        return (
          "string" != typeof t && ((n = t), (t = "fx"), e--),
          arguments.length < e
            ? S.queue(this[0], t)
            : void 0 === n
              ? this
              : this.each(function () {
                  var e = S.queue(this, t, n);
                  S._queueHooks(this, t),
                    "fx" === t && "inprogress" !== e[0] && S.dequeue(this, t);
                })
        );
      },
      dequeue: function (e) {
        return this.each(function () {
          S.dequeue(this, e);
        });
      },
      clearQueue: function (e) {
        return this.queue(e || "fx", []);
      },
      promise: function (e, t) {
        var n,
          r = 1,
          i = S.Deferred(),
          o = this,
          a = this.length,
          s = function () {
            --r || i.resolveWith(o, [o]);
          };
        "string" != typeof e && ((t = e), (e = void 0)), (e = e || "fx");
        while (a--)
          (n = Y.get(o[a], e + "queueHooks")) &&
            n.empty &&
            (r++, n.empty.add(s));
        return s(), i.promise(t);
      },
    });
  var ee = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    te = new RegExp("^(?:([+-])=|)(" + ee + ")([a-z%]*)$", "i"),
    ne = ["Top", "Right", "Bottom", "Left"],
    re = E.documentElement,
    ie = function (e) {
      return S.contains(e.ownerDocument, e);
    },
    oe = { composed: !0 };
  re.getRootNode &&
    (ie = function (e) {
      return (
        S.contains(e.ownerDocument, e) || e.getRootNode(oe) === e.ownerDocument
      );
    });
  var ae = function (e, t) {
    return (
      "none" === (e = t || e).style.display ||
      ("" === e.style.display && ie(e) && "none" === S.css(e, "display"))
    );
  };
  function se(e, t, n, r) {
    var i,
      o,
      a = 20,
      s = r
        ? function () {
            return r.cur();
          }
        : function () {
            return S.css(e, t, "");
          },
      u = s(),
      l = (n && n[3]) || (S.cssNumber[t] ? "" : "px"),
      c =
        e.nodeType &&
        (S.cssNumber[t] || ("px" !== l && +u)) &&
        te.exec(S.css(e, t));
    if (c && c[3] !== l) {
      (u /= 2), (l = l || c[3]), (c = +u || 1);
      while (a--)
        S.style(e, t, c + l),
          (1 - o) * (1 - (o = s() / u || 0.5)) <= 0 && (a = 0),
          (c /= o);
      (c *= 2), S.style(e, t, c + l), (n = n || []);
    }
    return (
      n &&
        ((c = +c || +u || 0),
        (i = n[1] ? c + (n[1] + 1) * n[2] : +n[2]),
        r && ((r.unit = l), (r.start = c), (r.end = i))),
      i
    );
  }
  var ue = {};
  function le(e, t) {
    for (var n, r, i, o, a, s, u, l = [], c = 0, f = e.length; c < f; c++)
      (r = e[c]).style &&
        ((n = r.style.display),
        t
          ? ("none" === n &&
              ((l[c] = Y.get(r, "display") || null),
              l[c] || (r.style.display = "")),
            "" === r.style.display &&
              ae(r) &&
              (l[c] =
                ((u = a = o = void 0),
                (a = (i = r).ownerDocument),
                (s = i.nodeName),
                (u = ue[s]) ||
                  ((o = a.body.appendChild(a.createElement(s))),
                  (u = S.css(o, "display")),
                  o.parentNode.removeChild(o),
                  "none" === u && (u = "block"),
                  (ue[s] = u)))))
          : "none" !== n && ((l[c] = "none"), Y.set(r, "display", n)));
    for (c = 0; c < f; c++) null != l[c] && (e[c].style.display = l[c]);
    return e;
  }
  S.fn.extend({
    show: function () {
      return le(this, !0);
    },
    hide: function () {
      return le(this);
    },
    toggle: function (e) {
      return "boolean" == typeof e
        ? e
          ? this.show()
          : this.hide()
        : this.each(function () {
            ae(this) ? S(this).show() : S(this).hide();
          });
    },
  });
  var ce,
    fe,
    pe = /^(?:checkbox|radio)$/i,
    de = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
    he = /^$|^module$|\/(?:java|ecma)script/i;
  (ce = E.createDocumentFragment().appendChild(E.createElement("div"))),
    (fe = E.createElement("input")).setAttribute("type", "radio"),
    fe.setAttribute("checked", "checked"),
    fe.setAttribute("name", "t"),
    ce.appendChild(fe),
    (y.checkClone = ce.cloneNode(!0).cloneNode(!0).lastChild.checked),
    (ce.innerHTML = "<textarea>x</textarea>"),
    (y.noCloneChecked = !!ce.cloneNode(!0).lastChild.defaultValue),
    (ce.innerHTML = "<option></option>"),
    (y.option = !!ce.lastChild);
  var ge = {
    thead: [1, "<table>", "</table>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default: [0, "", ""],
  };
  function ve(e, t) {
    var n;
    return (
      (n =
        "undefined" != typeof e.getElementsByTagName
          ? e.getElementsByTagName(t || "*")
          : "undefined" != typeof e.querySelectorAll
            ? e.querySelectorAll(t || "*")
            : []),
      void 0 === t || (t && A(e, t)) ? S.merge([e], n) : n
    );
  }
  function ye(e, t) {
    for (var n = 0, r = e.length; n < r; n++)
      Y.set(e[n], "globalEval", !t || Y.get(t[n], "globalEval"));
  }
  (ge.tbody = ge.tfoot = ge.colgroup = ge.caption = ge.thead),
    (ge.th = ge.td),
    y.option ||
      (ge.optgroup = ge.option =
        [1, "<select multiple='multiple'>", "</select>"]);
  var me = /<|&#?\w+;/;
  function xe(e, t, n, r, i) {
    for (
      var o,
        a,
        s,
        u,
        l,
        c,
        f = t.createDocumentFragment(),
        p = [],
        d = 0,
        h = e.length;
      d < h;
      d++
    )
      if ((o = e[d]) || 0 === o)
        if ("object" === w(o)) S.merge(p, o.nodeType ? [o] : o);
        else if (me.test(o)) {
          (a = a || f.appendChild(t.createElement("div"))),
            (s = (de.exec(o) || ["", ""])[1].toLowerCase()),
            (u = ge[s] || ge._default),
            (a.innerHTML = u[1] + S.htmlPrefilter(o) + u[2]),
            (c = u[0]);
          while (c--) a = a.lastChild;
          S.merge(p, a.childNodes), ((a = f.firstChild).textContent = "");
        } else p.push(t.createTextNode(o));
    (f.textContent = ""), (d = 0);
    while ((o = p[d++]))
      if (r && -1 < S.inArray(o, r)) i && i.push(o);
      else if (
        ((l = ie(o)), (a = ve(f.appendChild(o), "script")), l && ye(a), n)
      ) {
        c = 0;
        while ((o = a[c++])) he.test(o.type || "") && n.push(o);
      }
    return f;
  }
  var be = /^key/,
    we = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    Te = /^([^.]*)(?:\.(.+)|)/;
  function Ce() {
    return !0;
  }
  function Ee() {
    return !1;
  }
  function Se(e, t) {
    return (
      (e ===
        (function () {
          try {
            return E.activeElement;
          } catch (e) {}
        })()) ==
      ("focus" === t)
    );
  }
  function ke(e, t, n, r, i, o) {
    var a, s;
    if ("object" == typeof t) {
      for (s in ("string" != typeof n && ((r = r || n), (n = void 0)), t))
        ke(e, s, n, r, t[s], o);
      return e;
    }
    if (
      (null == r && null == i
        ? ((i = n), (r = n = void 0))
        : null == i &&
          ("string" == typeof n
            ? ((i = r), (r = void 0))
            : ((i = r), (r = n), (n = void 0))),
      !1 === i)
    )
      i = Ee;
    else if (!i) return e;
    return (
      1 === o &&
        ((a = i),
        ((i = function (e) {
          return S().off(e), a.apply(this, arguments);
        }).guid = a.guid || (a.guid = S.guid++))),
      e.each(function () {
        S.event.add(this, t, i, r, n);
      })
    );
  }
  function Ae(e, i, o) {
    o
      ? (Y.set(e, i, !1),
        S.event.add(e, i, {
          namespace: !1,
          handler: function (e) {
            var t,
              n,
              r = Y.get(this, i);
            if (1 & e.isTrigger && this[i]) {
              if (r.length)
                (S.event.special[i] || {}).delegateType && e.stopPropagation();
              else if (
                ((r = s.call(arguments)),
                Y.set(this, i, r),
                (t = o(this, i)),
                this[i](),
                r !== (n = Y.get(this, i)) || t ? Y.set(this, i, !1) : (n = {}),
                r !== n)
              )
                return (
                  e.stopImmediatePropagation(), e.preventDefault(), n.value
                );
            } else
              r.length &&
                (Y.set(this, i, {
                  value: S.event.trigger(
                    S.extend(r[0], S.Event.prototype),
                    r.slice(1),
                    this,
                  ),
                }),
                e.stopImmediatePropagation());
          },
        }))
      : void 0 === Y.get(e, i) && S.event.add(e, i, Ce);
  }
  (S.event = {
    global: {},
    add: function (t, e, n, r, i) {
      var o,
        a,
        s,
        u,
        l,
        c,
        f,
        p,
        d,
        h,
        g,
        v = Y.get(t);
      if (V(t)) {
        n.handler && ((n = (o = n).handler), (i = o.selector)),
          i && S.find.matchesSelector(re, i),
          n.guid || (n.guid = S.guid++),
          (u = v.events) || (u = v.events = Object.create(null)),
          (a = v.handle) ||
            (a = v.handle =
              function (e) {
                return "undefined" != typeof S && S.event.triggered !== e.type
                  ? S.event.dispatch.apply(t, arguments)
                  : void 0;
              }),
          (l = (e = (e || "").match(P) || [""]).length);
        while (l--)
          (d = g = (s = Te.exec(e[l]) || [])[1]),
            (h = (s[2] || "").split(".").sort()),
            d &&
              ((f = S.event.special[d] || {}),
              (d = (i ? f.delegateType : f.bindType) || d),
              (f = S.event.special[d] || {}),
              (c = S.extend(
                {
                  type: d,
                  origType: g,
                  data: r,
                  handler: n,
                  guid: n.guid,
                  selector: i,
                  needsContext: i && S.expr.match.needsContext.test(i),
                  namespace: h.join("."),
                },
                o,
              )),
              (p = u[d]) ||
                (((p = u[d] = []).delegateCount = 0),
                (f.setup && !1 !== f.setup.call(t, r, h, a)) ||
                  (t.addEventListener && t.addEventListener(d, a))),
              f.add &&
                (f.add.call(t, c), c.handler.guid || (c.handler.guid = n.guid)),
              i ? p.splice(p.delegateCount++, 0, c) : p.push(c),
              (S.event.global[d] = !0));
      }
    },
    remove: function (e, t, n, r, i) {
      var o,
        a,
        s,
        u,
        l,
        c,
        f,
        p,
        d,
        h,
        g,
        v = Y.hasData(e) && Y.get(e);
      if (v && (u = v.events)) {
        l = (t = (t || "").match(P) || [""]).length;
        while (l--)
          if (
            ((d = g = (s = Te.exec(t[l]) || [])[1]),
            (h = (s[2] || "").split(".").sort()),
            d)
          ) {
            (f = S.event.special[d] || {}),
              (p = u[(d = (r ? f.delegateType : f.bindType) || d)] || []),
              (s =
                s[2] &&
                new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)")),
              (a = o = p.length);
            while (o--)
              (c = p[o]),
                (!i && g !== c.origType) ||
                  (n && n.guid !== c.guid) ||
                  (s && !s.test(c.namespace)) ||
                  (r && r !== c.selector && ("**" !== r || !c.selector)) ||
                  (p.splice(o, 1),
                  c.selector && p.delegateCount--,
                  f.remove && f.remove.call(e, c));
            a &&
              !p.length &&
              ((f.teardown && !1 !== f.teardown.call(e, h, v.handle)) ||
                S.removeEvent(e, d, v.handle),
              delete u[d]);
          } else for (d in u) S.event.remove(e, d + t[l], n, r, !0);
        S.isEmptyObject(u) && Y.remove(e, "handle events");
      }
    },
    dispatch: function (e) {
      var t,
        n,
        r,
        i,
        o,
        a,
        s = new Array(arguments.length),
        u = S.event.fix(e),
        l = (Y.get(this, "events") || Object.create(null))[u.type] || [],
        c = S.event.special[u.type] || {};
      for (s[0] = u, t = 1; t < arguments.length; t++) s[t] = arguments[t];
      if (
        ((u.delegateTarget = this),
        !c.preDispatch || !1 !== c.preDispatch.call(this, u))
      ) {
        (a = S.event.handlers.call(this, u, l)), (t = 0);
        while ((i = a[t++]) && !u.isPropagationStopped()) {
          (u.currentTarget = i.elem), (n = 0);
          while ((o = i.handlers[n++]) && !u.isImmediatePropagationStopped())
            (u.rnamespace &&
              !1 !== o.namespace &&
              !u.rnamespace.test(o.namespace)) ||
              ((u.handleObj = o),
              (u.data = o.data),
              void 0 !==
                (r = (
                  (S.event.special[o.origType] || {}).handle || o.handler
                ).apply(i.elem, s)) &&
                !1 === (u.result = r) &&
                (u.preventDefault(), u.stopPropagation()));
        }
        return c.postDispatch && c.postDispatch.call(this, u), u.result;
      }
    },
    handlers: function (e, t) {
      var n,
        r,
        i,
        o,
        a,
        s = [],
        u = t.delegateCount,
        l = e.target;
      if (u && l.nodeType && !("click" === e.type && 1 <= e.button))
        for (; l !== this; l = l.parentNode || this)
          if (1 === l.nodeType && ("click" !== e.type || !0 !== l.disabled)) {
            for (o = [], a = {}, n = 0; n < u; n++)
              void 0 === a[(i = (r = t[n]).selector + " ")] &&
                (a[i] = r.needsContext
                  ? -1 < S(i, this).index(l)
                  : S.find(i, this, null, [l]).length),
                a[i] && o.push(r);
            o.length && s.push({ elem: l, handlers: o });
          }
      return (
        (l = this), u < t.length && s.push({ elem: l, handlers: t.slice(u) }), s
      );
    },
    addProp: function (t, e) {
      Object.defineProperty(S.Event.prototype, t, {
        enumerable: !0,
        configurable: !0,
        get: m(e)
          ? function () {
              if (this.originalEvent) return e(this.originalEvent);
            }
          : function () {
              if (this.originalEvent) return this.originalEvent[t];
            },
        set: function (e) {
          Object.defineProperty(this, t, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: e,
          });
        },
      });
    },
    fix: function (e) {
      return e[S.expando] ? e : new S.Event(e);
    },
    special: {
      load: { noBubble: !0 },
      click: {
        setup: function (e) {
          var t = this || e;
          return (
            pe.test(t.type) && t.click && A(t, "input") && Ae(t, "click", Ce),
            !1
          );
        },
        trigger: function (e) {
          var t = this || e;
          return (
            pe.test(t.type) && t.click && A(t, "input") && Ae(t, "click"), !0
          );
        },
        _default: function (e) {
          var t = e.target;
          return (
            (pe.test(t.type) &&
              t.click &&
              A(t, "input") &&
              Y.get(t, "click")) ||
            A(t, "a")
          );
        },
      },
      beforeunload: {
        postDispatch: function (e) {
          void 0 !== e.result &&
            e.originalEvent &&
            (e.originalEvent.returnValue = e.result);
        },
      },
    },
  }),
    (S.removeEvent = function (e, t, n) {
      e.removeEventListener && e.removeEventListener(t, n);
    }),
    (S.Event = function (e, t) {
      if (!(this instanceof S.Event)) return new S.Event(e, t);
      e && e.type
        ? ((this.originalEvent = e),
          (this.type = e.type),
          (this.isDefaultPrevented =
            e.defaultPrevented ||
            (void 0 === e.defaultPrevented && !1 === e.returnValue)
              ? Ce
              : Ee),
          (this.target =
            e.target && 3 === e.target.nodeType
              ? e.target.parentNode
              : e.target),
          (this.currentTarget = e.currentTarget),
          (this.relatedTarget = e.relatedTarget))
        : (this.type = e),
        t && S.extend(this, t),
        (this.timeStamp = (e && e.timeStamp) || Date.now()),
        (this[S.expando] = !0);
    }),
    (S.Event.prototype = {
      constructor: S.Event,
      isDefaultPrevented: Ee,
      isPropagationStopped: Ee,
      isImmediatePropagationStopped: Ee,
      isSimulated: !1,
      preventDefault: function () {
        var e = this.originalEvent;
        (this.isDefaultPrevented = Ce),
          e && !this.isSimulated && e.preventDefault();
      },
      stopPropagation: function () {
        var e = this.originalEvent;
        (this.isPropagationStopped = Ce),
          e && !this.isSimulated && e.stopPropagation();
      },
      stopImmediatePropagation: function () {
        var e = this.originalEvent;
        (this.isImmediatePropagationStopped = Ce),
          e && !this.isSimulated && e.stopImmediatePropagation(),
          this.stopPropagation();
      },
    }),
    S.each(
      {
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function (e) {
          var t = e.button;
          return null == e.which && be.test(e.type)
            ? null != e.charCode
              ? e.charCode
              : e.keyCode
            : !e.which && void 0 !== t && we.test(e.type)
              ? 1 & t
                ? 1
                : 2 & t
                  ? 3
                  : 4 & t
                    ? 2
                    : 0
              : e.which;
        },
      },
      S.event.addProp,
    ),
    S.each({ focus: "focusin", blur: "focusout" }, function (e, t) {
      S.event.special[e] = {
        setup: function () {
          return Ae(this, e, Se), !1;
        },
        trigger: function () {
          return Ae(this, e), !0;
        },
        delegateType: t,
      };
    }),
    S.each(
      {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout",
      },
      function (e, i) {
        S.event.special[e] = {
          delegateType: i,
          bindType: i,
          handle: function (e) {
            var t,
              n = e.relatedTarget,
              r = e.handleObj;
            return (
              (n && (n === this || S.contains(this, n))) ||
                ((e.type = r.origType),
                (t = r.handler.apply(this, arguments)),
                (e.type = i)),
              t
            );
          },
        };
      },
    ),
    S.fn.extend({
      on: function (e, t, n, r) {
        return ke(this, e, t, n, r);
      },
      one: function (e, t, n, r) {
        return ke(this, e, t, n, r, 1);
      },
      off: function (e, t, n) {
        var r, i;
        if (e && e.preventDefault && e.handleObj)
          return (
            (r = e.handleObj),
            S(e.delegateTarget).off(
              r.namespace ? r.origType + "." + r.namespace : r.origType,
              r.selector,
              r.handler,
            ),
            this
          );
        if ("object" == typeof e) {
          for (i in e) this.off(i, t, e[i]);
          return this;
        }
        return (
          (!1 !== t && "function" != typeof t) || ((n = t), (t = void 0)),
          !1 === n && (n = Ee),
          this.each(function () {
            S.event.remove(this, e, n, t);
          })
        );
      },
    });
  var Ne = /<script|<style|<link/i,
    De = /checked\s*(?:[^=]|=\s*.checked.)/i,
    je = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  function qe(e, t) {
    return (
      (A(e, "table") &&
        A(11 !== t.nodeType ? t : t.firstChild, "tr") &&
        S(e).children("tbody")[0]) ||
      e
    );
  }
  function Le(e) {
    return (e.type = (null !== e.getAttribute("type")) + "/" + e.type), e;
  }
  function He(e) {
    return (
      "true/" === (e.type || "").slice(0, 5)
        ? (e.type = e.type.slice(5))
        : e.removeAttribute("type"),
      e
    );
  }
  function Oe(e, t) {
    var n, r, i, o, a, s;
    if (1 === t.nodeType) {
      if (Y.hasData(e) && (s = Y.get(e).events))
        for (i in (Y.remove(t, "handle events"), s))
          for (n = 0, r = s[i].length; n < r; n++) S.event.add(t, i, s[i][n]);
      Q.hasData(e) && ((o = Q.access(e)), (a = S.extend({}, o)), Q.set(t, a));
    }
  }
  function Pe(n, r, i, o) {
    r = g(r);
    var e,
      t,
      a,
      s,
      u,
      l,
      c = 0,
      f = n.length,
      p = f - 1,
      d = r[0],
      h = m(d);
    if (h || (1 < f && "string" == typeof d && !y.checkClone && De.test(d)))
      return n.each(function (e) {
        var t = n.eq(e);
        h && (r[0] = d.call(this, e, t.html())), Pe(t, r, i, o);
      });
    if (
      f &&
      ((t = (e = xe(r, n[0].ownerDocument, !1, n, o)).firstChild),
      1 === e.childNodes.length && (e = t),
      t || o)
    ) {
      for (s = (a = S.map(ve(e, "script"), Le)).length; c < f; c++)
        (u = e),
          c !== p &&
            ((u = S.clone(u, !0, !0)), s && S.merge(a, ve(u, "script"))),
          i.call(n[c], u, c);
      if (s)
        for (l = a[a.length - 1].ownerDocument, S.map(a, He), c = 0; c < s; c++)
          (u = a[c]),
            he.test(u.type || "") &&
              !Y.access(u, "globalEval") &&
              S.contains(l, u) &&
              (u.src && "module" !== (u.type || "").toLowerCase()
                ? S._evalUrl &&
                  !u.noModule &&
                  S._evalUrl(
                    u.src,
                    { nonce: u.nonce || u.getAttribute("nonce") },
                    l,
                  )
                : b(u.textContent.replace(je, ""), u, l));
    }
    return n;
  }
  function Re(e, t, n) {
    for (var r, i = t ? S.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
      n || 1 !== r.nodeType || S.cleanData(ve(r)),
        r.parentNode &&
          (n && ie(r) && ye(ve(r, "script")), r.parentNode.removeChild(r));
    return e;
  }
  S.extend({
    htmlPrefilter: function (e) {
      return e;
    },
    clone: function (e, t, n) {
      var r,
        i,
        o,
        a,
        s,
        u,
        l,
        c = e.cloneNode(!0),
        f = ie(e);
      if (
        !(
          y.noCloneChecked ||
          (1 !== e.nodeType && 11 !== e.nodeType) ||
          S.isXMLDoc(e)
        )
      )
        for (a = ve(c), r = 0, i = (o = ve(e)).length; r < i; r++)
          (s = o[r]),
            (u = a[r]),
            void 0,
            "input" === (l = u.nodeName.toLowerCase()) && pe.test(s.type)
              ? (u.checked = s.checked)
              : ("input" !== l && "textarea" !== l) ||
                (u.defaultValue = s.defaultValue);
      if (t)
        if (n)
          for (o = o || ve(e), a = a || ve(c), r = 0, i = o.length; r < i; r++)
            Oe(o[r], a[r]);
        else Oe(e, c);
      return (
        0 < (a = ve(c, "script")).length && ye(a, !f && ve(e, "script")), c
      );
    },
    cleanData: function (e) {
      for (var t, n, r, i = S.event.special, o = 0; void 0 !== (n = e[o]); o++)
        if (V(n)) {
          if ((t = n[Y.expando])) {
            if (t.events)
              for (r in t.events)
                i[r] ? S.event.remove(n, r) : S.removeEvent(n, r, t.handle);
            n[Y.expando] = void 0;
          }
          n[Q.expando] && (n[Q.expando] = void 0);
        }
    },
  }),
    S.fn.extend({
      detach: function (e) {
        return Re(this, e, !0);
      },
      remove: function (e) {
        return Re(this, e);
      },
      text: function (e) {
        return $(
          this,
          function (e) {
            return void 0 === e
              ? S.text(this)
              : this.empty().each(function () {
                  (1 !== this.nodeType &&
                    11 !== this.nodeType &&
                    9 !== this.nodeType) ||
                    (this.textContent = e);
                });
          },
          null,
          e,
          arguments.length,
        );
      },
      append: function () {
        return Pe(this, arguments, function (e) {
          (1 !== this.nodeType &&
            11 !== this.nodeType &&
            9 !== this.nodeType) ||
            qe(this, e).appendChild(e);
        });
      },
      prepend: function () {
        return Pe(this, arguments, function (e) {
          if (
            1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType
          ) {
            var t = qe(this, e);
            t.insertBefore(e, t.firstChild);
          }
        });
      },
      before: function () {
        return Pe(this, arguments, function (e) {
          this.parentNode && this.parentNode.insertBefore(e, this);
        });
      },
      after: function () {
        return Pe(this, arguments, function (e) {
          this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
        });
      },
      empty: function () {
        for (var e, t = 0; null != (e = this[t]); t++)
          1 === e.nodeType && (S.cleanData(ve(e, !1)), (e.textContent = ""));
        return this;
      },
      clone: function (e, t) {
        return (
          (e = null != e && e),
          (t = null == t ? e : t),
          this.map(function () {
            return S.clone(this, e, t);
          })
        );
      },
      html: function (e) {
        return $(
          this,
          function (e) {
            var t = this[0] || {},
              n = 0,
              r = this.length;
            if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
            if (
              "string" == typeof e &&
              !Ne.test(e) &&
              !ge[(de.exec(e) || ["", ""])[1].toLowerCase()]
            ) {
              e = S.htmlPrefilter(e);
              try {
                for (; n < r; n++)
                  1 === (t = this[n] || {}).nodeType &&
                    (S.cleanData(ve(t, !1)), (t.innerHTML = e));
                t = 0;
              } catch (e) {}
            }
            t && this.empty().append(e);
          },
          null,
          e,
          arguments.length,
        );
      },
      replaceWith: function () {
        var n = [];
        return Pe(
          this,
          arguments,
          function (e) {
            var t = this.parentNode;
            S.inArray(this, n) < 0 &&
              (S.cleanData(ve(this)), t && t.replaceChild(e, this));
          },
          n,
        );
      },
    }),
    S.each(
      {
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith",
      },
      function (e, a) {
        S.fn[e] = function (e) {
          for (var t, n = [], r = S(e), i = r.length - 1, o = 0; o <= i; o++)
            (t = o === i ? this : this.clone(!0)),
              S(r[o])[a](t),
              u.apply(n, t.get());
          return this.pushStack(n);
        };
      },
    );
  var Me = new RegExp("^(" + ee + ")(?!px)[a-z%]+$", "i"),
    Ie = function (e) {
      var t = e.ownerDocument.defaultView;
      return (t && t.opener) || (t = C), t.getComputedStyle(e);
    },
    We = function (e, t, n) {
      var r,
        i,
        o = {};
      for (i in t) (o[i] = e.style[i]), (e.style[i] = t[i]);
      for (i in ((r = n.call(e)), t)) e.style[i] = o[i];
      return r;
    },
    Fe = new RegExp(ne.join("|"), "i");
  function Be(e, t, n) {
    var r,
      i,
      o,
      a,
      s = e.style;
    return (
      (n = n || Ie(e)) &&
        ("" !== (a = n.getPropertyValue(t) || n[t]) ||
          ie(e) ||
          (a = S.style(e, t)),
        !y.pixelBoxStyles() &&
          Me.test(a) &&
          Fe.test(t) &&
          ((r = s.width),
          (i = s.minWidth),
          (o = s.maxWidth),
          (s.minWidth = s.maxWidth = s.width = a),
          (a = n.width),
          (s.width = r),
          (s.minWidth = i),
          (s.maxWidth = o))),
      void 0 !== a ? a + "" : a
    );
  }
  function $e(e, t) {
    return {
      get: function () {
        if (!e()) return (this.get = t).apply(this, arguments);
        delete this.get;
      },
    };
  }
  !(function () {
    function e() {
      if (l) {
        (u.style.cssText =
          "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0"),
          (l.style.cssText =
            "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%"),
          re.appendChild(u).appendChild(l);
        var e = C.getComputedStyle(l);
        (n = "1%" !== e.top),
          (s = 12 === t(e.marginLeft)),
          (l.style.right = "60%"),
          (o = 36 === t(e.right)),
          (r = 36 === t(e.width)),
          (l.style.position = "absolute"),
          (i = 12 === t(l.offsetWidth / 3)),
          re.removeChild(u),
          (l = null);
      }
    }
    function t(e) {
      return Math.round(parseFloat(e));
    }
    var n,
      r,
      i,
      o,
      a,
      s,
      u = E.createElement("div"),
      l = E.createElement("div");
    l.style &&
      ((l.style.backgroundClip = "content-box"),
      (l.cloneNode(!0).style.backgroundClip = ""),
      (y.clearCloneStyle = "content-box" === l.style.backgroundClip),
      S.extend(y, {
        boxSizingReliable: function () {
          return e(), r;
        },
        pixelBoxStyles: function () {
          return e(), o;
        },
        pixelPosition: function () {
          return e(), n;
        },
        reliableMarginLeft: function () {
          return e(), s;
        },
        scrollboxSize: function () {
          return e(), i;
        },
        reliableTrDimensions: function () {
          var e, t, n, r;
          return (
            null == a &&
              ((e = E.createElement("table")),
              (t = E.createElement("tr")),
              (n = E.createElement("div")),
              (e.style.cssText = "position:absolute;left:-11111px"),
              (t.style.height = "1px"),
              (n.style.height = "9px"),
              re.appendChild(e).appendChild(t).appendChild(n),
              (r = C.getComputedStyle(t)),
              (a = 3 < parseInt(r.height)),
              re.removeChild(e)),
            a
          );
        },
      }));
  })();
  var _e = ["Webkit", "Moz", "ms"],
    ze = E.createElement("div").style,
    Ue = {};
  function Xe(e) {
    var t = S.cssProps[e] || Ue[e];
    return (
      t ||
      (e in ze
        ? e
        : (Ue[e] =
            (function (e) {
              var t = e[0].toUpperCase() + e.slice(1),
                n = _e.length;
              while (n--) if ((e = _e[n] + t) in ze) return e;
            })(e) || e))
    );
  }
  var Ve = /^(none|table(?!-c[ea]).+)/,
    Ge = /^--/,
    Ye = { position: "absolute", visibility: "hidden", display: "block" },
    Qe = { letterSpacing: "0", fontWeight: "400" };
  function Je(e, t, n) {
    var r = te.exec(t);
    return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t;
  }
  function Ke(e, t, n, r, i, o) {
    var a = "width" === t ? 1 : 0,
      s = 0,
      u = 0;
    if (n === (r ? "border" : "content")) return 0;
    for (; a < 4; a += 2)
      "margin" === n && (u += S.css(e, n + ne[a], !0, i)),
        r
          ? ("content" === n && (u -= S.css(e, "padding" + ne[a], !0, i)),
            "margin" !== n &&
              (u -= S.css(e, "border" + ne[a] + "Width", !0, i)))
          : ((u += S.css(e, "padding" + ne[a], !0, i)),
            "padding" !== n
              ? (u += S.css(e, "border" + ne[a] + "Width", !0, i))
              : (s += S.css(e, "border" + ne[a] + "Width", !0, i)));
    return (
      !r &&
        0 <= o &&
        (u +=
          Math.max(
            0,
            Math.ceil(
              e["offset" + t[0].toUpperCase() + t.slice(1)] - o - u - s - 0.5,
            ),
          ) || 0),
      u
    );
  }
  function Ze(e, t, n) {
    var r = Ie(e),
      i =
        (!y.boxSizingReliable() || n) &&
        "border-box" === S.css(e, "boxSizing", !1, r),
      o = i,
      a = Be(e, t, r),
      s = "offset" + t[0].toUpperCase() + t.slice(1);
    if (Me.test(a)) {
      if (!n) return a;
      a = "auto";
    }
    return (
      ((!y.boxSizingReliable() && i) ||
        (!y.reliableTrDimensions() && A(e, "tr")) ||
        "auto" === a ||
        (!parseFloat(a) && "inline" === S.css(e, "display", !1, r))) &&
        e.getClientRects().length &&
        ((i = "border-box" === S.css(e, "boxSizing", !1, r)),
        (o = s in e) && (a = e[s])),
      (a = parseFloat(a) || 0) +
        Ke(e, t, n || (i ? "border" : "content"), o, r, a) +
        "px"
    );
  }
  function et(e, t, n, r, i) {
    return new et.prototype.init(e, t, n, r, i);
  }
  S.extend({
    cssHooks: {
      opacity: {
        get: function (e, t) {
          if (t) {
            var n = Be(e, "opacity");
            return "" === n ? "1" : n;
          }
        },
      },
    },
    cssNumber: {
      animationIterationCount: !0,
      columnCount: !0,
      fillOpacity: !0,
      flexGrow: !0,
      flexShrink: !0,
      fontWeight: !0,
      gridArea: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnStart: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowStart: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
    },
    cssProps: {},
    style: function (e, t, n, r) {
      if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
        var i,
          o,
          a,
          s = X(t),
          u = Ge.test(t),
          l = e.style;
        if (
          (u || (t = Xe(s)), (a = S.cssHooks[t] || S.cssHooks[s]), void 0 === n)
        )
          return a && "get" in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
        "string" === (o = typeof n) &&
          (i = te.exec(n)) &&
          i[1] &&
          ((n = se(e, t, i)), (o = "number")),
          null != n &&
            n == n &&
            ("number" !== o ||
              u ||
              (n += (i && i[3]) || (S.cssNumber[s] ? "" : "px")),
            y.clearCloneStyle ||
              "" !== n ||
              0 !== t.indexOf("background") ||
              (l[t] = "inherit"),
            (a && "set" in a && void 0 === (n = a.set(e, n, r))) ||
              (u ? l.setProperty(t, n) : (l[t] = n)));
      }
    },
    css: function (e, t, n, r) {
      var i,
        o,
        a,
        s = X(t);
      return (
        Ge.test(t) || (t = Xe(s)),
        (a = S.cssHooks[t] || S.cssHooks[s]) &&
          "get" in a &&
          (i = a.get(e, !0, n)),
        void 0 === i && (i = Be(e, t, r)),
        "normal" === i && t in Qe && (i = Qe[t]),
        "" === n || n
          ? ((o = parseFloat(i)), !0 === n || isFinite(o) ? o || 0 : i)
          : i
      );
    },
  }),
    S.each(["height", "width"], function (e, u) {
      S.cssHooks[u] = {
        get: function (e, t, n) {
          if (t)
            return !Ve.test(S.css(e, "display")) ||
              (e.getClientRects().length && e.getBoundingClientRect().width)
              ? Ze(e, u, n)
              : We(e, Ye, function () {
                  return Ze(e, u, n);
                });
        },
        set: function (e, t, n) {
          var r,
            i = Ie(e),
            o = !y.scrollboxSize() && "absolute" === i.position,
            a = (o || n) && "border-box" === S.css(e, "boxSizing", !1, i),
            s = n ? Ke(e, u, n, a, i) : 0;
          return (
            a &&
              o &&
              (s -= Math.ceil(
                e["offset" + u[0].toUpperCase() + u.slice(1)] -
                  parseFloat(i[u]) -
                  Ke(e, u, "border", !1, i) -
                  0.5,
              )),
            s &&
              (r = te.exec(t)) &&
              "px" !== (r[3] || "px") &&
              ((e.style[u] = t), (t = S.css(e, u))),
            Je(0, t, s)
          );
        },
      };
    }),
    (S.cssHooks.marginLeft = $e(y.reliableMarginLeft, function (e, t) {
      if (t)
        return (
          (parseFloat(Be(e, "marginLeft")) ||
            e.getBoundingClientRect().left -
              We(e, { marginLeft: 0 }, function () {
                return e.getBoundingClientRect().left;
              })) + "px"
        );
    })),
    S.each({ margin: "", padding: "", border: "Width" }, function (i, o) {
      (S.cssHooks[i + o] = {
        expand: function (e) {
          for (
            var t = 0, n = {}, r = "string" == typeof e ? e.split(" ") : [e];
            t < 4;
            t++
          )
            n[i + ne[t] + o] = r[t] || r[t - 2] || r[0];
          return n;
        },
      }),
        "margin" !== i && (S.cssHooks[i + o].set = Je);
    }),
    S.fn.extend({
      css: function (e, t) {
        return $(
          this,
          function (e, t, n) {
            var r,
              i,
              o = {},
              a = 0;
            if (Array.isArray(t)) {
              for (r = Ie(e), i = t.length; a < i; a++)
                o[t[a]] = S.css(e, t[a], !1, r);
              return o;
            }
            return void 0 !== n ? S.style(e, t, n) : S.css(e, t);
          },
          e,
          t,
          1 < arguments.length,
        );
      },
    }),
    (((S.Tween = et).prototype = {
      constructor: et,
      init: function (e, t, n, r, i, o) {
        (this.elem = e),
          (this.prop = n),
          (this.easing = i || S.easing._default),
          (this.options = t),
          (this.start = this.now = this.cur()),
          (this.end = r),
          (this.unit = o || (S.cssNumber[n] ? "" : "px"));
      },
      cur: function () {
        var e = et.propHooks[this.prop];
        return e && e.get ? e.get(this) : et.propHooks._default.get(this);
      },
      run: function (e) {
        var t,
          n = et.propHooks[this.prop];
        return (
          this.options.duration
            ? (this.pos = t =
                S.easing[this.easing](
                  e,
                  this.options.duration * e,
                  0,
                  1,
                  this.options.duration,
                ))
            : (this.pos = t = e),
          (this.now = (this.end - this.start) * t + this.start),
          this.options.step &&
            this.options.step.call(this.elem, this.now, this),
          n && n.set ? n.set(this) : et.propHooks._default.set(this),
          this
        );
      },
    }).init.prototype = et.prototype),
    ((et.propHooks = {
      _default: {
        get: function (e) {
          var t;
          return 1 !== e.elem.nodeType ||
            (null != e.elem[e.prop] && null == e.elem.style[e.prop])
            ? e.elem[e.prop]
            : (t = S.css(e.elem, e.prop, "")) && "auto" !== t
              ? t
              : 0;
        },
        set: function (e) {
          S.fx.step[e.prop]
            ? S.fx.step[e.prop](e)
            : 1 !== e.elem.nodeType ||
                (!S.cssHooks[e.prop] && null == e.elem.style[Xe(e.prop)])
              ? (e.elem[e.prop] = e.now)
              : S.style(e.elem, e.prop, e.now + e.unit);
        },
      },
    }).scrollTop = et.propHooks.scrollLeft =
      {
        set: function (e) {
          e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
        },
      }),
    (S.easing = {
      linear: function (e) {
        return e;
      },
      swing: function (e) {
        return 0.5 - Math.cos(e * Math.PI) / 2;
      },
      _default: "swing",
    }),
    (S.fx = et.prototype.init),
    (S.fx.step = {});
  var tt,
    nt,
    rt,
    it,
    ot = /^(?:toggle|show|hide)$/,
    at = /queueHooks$/;
  function st() {
    nt &&
      (!1 === E.hidden && C.requestAnimationFrame
        ? C.requestAnimationFrame(st)
        : C.setTimeout(st, S.fx.interval),
      S.fx.tick());
  }
  function ut() {
    return (
      C.setTimeout(function () {
        tt = void 0;
      }),
      (tt = Date.now())
    );
  }
  function lt(e, t) {
    var n,
      r = 0,
      i = { height: e };
    for (t = t ? 1 : 0; r < 4; r += 2 - t)
      i["margin" + (n = ne[r])] = i["padding" + n] = e;
    return t && (i.opacity = i.width = e), i;
  }
  function ct(e, t, n) {
    for (
      var r,
        i = (ft.tweeners[t] || []).concat(ft.tweeners["*"]),
        o = 0,
        a = i.length;
      o < a;
      o++
    )
      if ((r = i[o].call(n, t, e))) return r;
  }
  function ft(o, e, t) {
    var n,
      a,
      r = 0,
      i = ft.prefilters.length,
      s = S.Deferred().always(function () {
        delete u.elem;
      }),
      u = function () {
        if (a) return !1;
        for (
          var e = tt || ut(),
            t = Math.max(0, l.startTime + l.duration - e),
            n = 1 - (t / l.duration || 0),
            r = 0,
            i = l.tweens.length;
          r < i;
          r++
        )
          l.tweens[r].run(n);
        return (
          s.notifyWith(o, [l, n, t]),
          n < 1 && i
            ? t
            : (i || s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l]), !1)
        );
      },
      l = s.promise({
        elem: o,
        props: S.extend({}, e),
        opts: S.extend(!0, { specialEasing: {}, easing: S.easing._default }, t),
        originalProperties: e,
        originalOptions: t,
        startTime: tt || ut(),
        duration: t.duration,
        tweens: [],
        createTween: function (e, t) {
          var n = S.Tween(
            o,
            l.opts,
            e,
            t,
            l.opts.specialEasing[e] || l.opts.easing,
          );
          return l.tweens.push(n), n;
        },
        stop: function (e) {
          var t = 0,
            n = e ? l.tweens.length : 0;
          if (a) return this;
          for (a = !0; t < n; t++) l.tweens[t].run(1);
          return (
            e
              ? (s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l, e]))
              : s.rejectWith(o, [l, e]),
            this
          );
        },
      }),
      c = l.props;
    for (
      !(function (e, t) {
        var n, r, i, o, a;
        for (n in e)
          if (
            ((i = t[(r = X(n))]),
            (o = e[n]),
            Array.isArray(o) && ((i = o[1]), (o = e[n] = o[0])),
            n !== r && ((e[r] = o), delete e[n]),
            (a = S.cssHooks[r]) && ("expand" in a))
          )
            for (n in ((o = a.expand(o)), delete e[r], o))
              (n in e) || ((e[n] = o[n]), (t[n] = i));
          else t[r] = i;
      })(c, l.opts.specialEasing);
      r < i;
      r++
    )
      if ((n = ft.prefilters[r].call(l, o, c, l.opts)))
        return (
          m(n.stop) &&
            (S._queueHooks(l.elem, l.opts.queue).stop = n.stop.bind(n)),
          n
        );
    return (
      S.map(c, ct, l),
      m(l.opts.start) && l.opts.start.call(o, l),
      l
        .progress(l.opts.progress)
        .done(l.opts.done, l.opts.complete)
        .fail(l.opts.fail)
        .always(l.opts.always),
      S.fx.timer(S.extend(u, { elem: o, anim: l, queue: l.opts.queue })),
      l
    );
  }
  (S.Animation = S.extend(ft, {
    tweeners: {
      "*": [
        function (e, t) {
          var n = this.createTween(e, t);
          return se(n.elem, e, te.exec(t), n), n;
        },
      ],
    },
    tweener: function (e, t) {
      m(e) ? ((t = e), (e = ["*"])) : (e = e.match(P));
      for (var n, r = 0, i = e.length; r < i; r++)
        (n = e[r]),
          (ft.tweeners[n] = ft.tweeners[n] || []),
          ft.tweeners[n].unshift(t);
    },
    prefilters: [
      function (e, t, n) {
        var r,
          i,
          o,
          a,
          s,
          u,
          l,
          c,
          f = "width" in t || "height" in t,
          p = this,
          d = {},
          h = e.style,
          g = e.nodeType && ae(e),
          v = Y.get(e, "fxshow");
        for (r in (n.queue ||
          (null == (a = S._queueHooks(e, "fx")).unqueued &&
            ((a.unqueued = 0),
            (s = a.empty.fire),
            (a.empty.fire = function () {
              a.unqueued || s();
            })),
          a.unqueued++,
          p.always(function () {
            p.always(function () {
              a.unqueued--, S.queue(e, "fx").length || a.empty.fire();
            });
          })),
        t))
          if (((i = t[r]), ot.test(i))) {
            if (
              (delete t[r],
              (o = o || "toggle" === i),
              i === (g ? "hide" : "show"))
            ) {
              if ("show" !== i || !v || void 0 === v[r]) continue;
              g = !0;
            }
            d[r] = (v && v[r]) || S.style(e, r);
          }
        if ((u = !S.isEmptyObject(t)) || !S.isEmptyObject(d))
          for (r in (f &&
            1 === e.nodeType &&
            ((n.overflow = [h.overflow, h.overflowX, h.overflowY]),
            null == (l = v && v.display) && (l = Y.get(e, "display")),
            "none" === (c = S.css(e, "display")) &&
              (l
                ? (c = l)
                : (le([e], !0),
                  (l = e.style.display || l),
                  (c = S.css(e, "display")),
                  le([e]))),
            ("inline" === c || ("inline-block" === c && null != l)) &&
              "none" === S.css(e, "float") &&
              (u ||
                (p.done(function () {
                  h.display = l;
                }),
                null == l && ((c = h.display), (l = "none" === c ? "" : c))),
              (h.display = "inline-block"))),
          n.overflow &&
            ((h.overflow = "hidden"),
            p.always(function () {
              (h.overflow = n.overflow[0]),
                (h.overflowX = n.overflow[1]),
                (h.overflowY = n.overflow[2]);
            })),
          (u = !1),
          d))
            u ||
              (v
                ? "hidden" in v && (g = v.hidden)
                : (v = Y.access(e, "fxshow", { display: l })),
              o && (v.hidden = !g),
              g && le([e], !0),
              p.done(function () {
                for (r in (g || le([e]), Y.remove(e, "fxshow"), d))
                  S.style(e, r, d[r]);
              })),
              (u = ct(g ? v[r] : 0, r, p)),
              r in v ||
                ((v[r] = u.start), g && ((u.end = u.start), (u.start = 0)));
      },
    ],
    prefilter: function (e, t) {
      t ? ft.prefilters.unshift(e) : ft.prefilters.push(e);
    },
  })),
    (S.speed = function (e, t, n) {
      var r =
        e && "object" == typeof e
          ? S.extend({}, e)
          : {
              complete: n || (!n && t) || (m(e) && e),
              duration: e,
              easing: (n && t) || (t && !m(t) && t),
            };
      return (
        S.fx.off
          ? (r.duration = 0)
          : "number" != typeof r.duration &&
            (r.duration in S.fx.speeds
              ? (r.duration = S.fx.speeds[r.duration])
              : (r.duration = S.fx.speeds._default)),
        (null != r.queue && !0 !== r.queue) || (r.queue = "fx"),
        (r.old = r.complete),
        (r.complete = function () {
          m(r.old) && r.old.call(this), r.queue && S.dequeue(this, r.queue);
        }),
        r
      );
    }),
    S.fn.extend({
      fadeTo: function (e, t, n, r) {
        return this.filter(ae)
          .css("opacity", 0)
          .show()
          .end()
          .animate({ opacity: t }, e, n, r);
      },
      animate: function (t, e, n, r) {
        var i = S.isEmptyObject(t),
          o = S.speed(e, n, r),
          a = function () {
            var e = ft(this, S.extend({}, t), o);
            (i || Y.get(this, "finish")) && e.stop(!0);
          };
        return (
          (a.finish = a),
          i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
        );
      },
      stop: function (i, e, o) {
        var a = function (e) {
          var t = e.stop;
          delete e.stop, t(o);
        };
        return (
          "string" != typeof i && ((o = e), (e = i), (i = void 0)),
          e && this.queue(i || "fx", []),
          this.each(function () {
            var e = !0,
              t = null != i && i + "queueHooks",
              n = S.timers,
              r = Y.get(this);
            if (t) r[t] && r[t].stop && a(r[t]);
            else for (t in r) r[t] && r[t].stop && at.test(t) && a(r[t]);
            for (t = n.length; t--; )
              n[t].elem !== this ||
                (null != i && n[t].queue !== i) ||
                (n[t].anim.stop(o), (e = !1), n.splice(t, 1));
            (!e && o) || S.dequeue(this, i);
          })
        );
      },
      finish: function (a) {
        return (
          !1 !== a && (a = a || "fx"),
          this.each(function () {
            var e,
              t = Y.get(this),
              n = t[a + "queue"],
              r = t[a + "queueHooks"],
              i = S.timers,
              o = n ? n.length : 0;
            for (
              t.finish = !0,
                S.queue(this, a, []),
                r && r.stop && r.stop.call(this, !0),
                e = i.length;
              e--;

            )
              i[e].elem === this &&
                i[e].queue === a &&
                (i[e].anim.stop(!0), i.splice(e, 1));
            for (e = 0; e < o; e++)
              n[e] && n[e].finish && n[e].finish.call(this);
            delete t.finish;
          })
        );
      },
    }),
    S.each(["toggle", "show", "hide"], function (e, r) {
      var i = S.fn[r];
      S.fn[r] = function (e, t, n) {
        return null == e || "boolean" == typeof e
          ? i.apply(this, arguments)
          : this.animate(lt(r, !0), e, t, n);
      };
    }),
    S.each(
      {
        slideDown: lt("show"),
        slideUp: lt("hide"),
        slideToggle: lt("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" },
      },
      function (e, r) {
        S.fn[e] = function (e, t, n) {
          return this.animate(r, e, t, n);
        };
      },
    ),
    (S.timers = []),
    (S.fx.tick = function () {
      var e,
        t = 0,
        n = S.timers;
      for (tt = Date.now(); t < n.length; t++)
        (e = n[t])() || n[t] !== e || n.splice(t--, 1);
      n.length || S.fx.stop(), (tt = void 0);
    }),
    (S.fx.timer = function (e) {
      S.timers.push(e), S.fx.start();
    }),
    (S.fx.interval = 13),
    (S.fx.start = function () {
      nt || ((nt = !0), st());
    }),
    (S.fx.stop = function () {
      nt = null;
    }),
    (S.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
    (S.fn.delay = function (r, e) {
      return (
        (r = (S.fx && S.fx.speeds[r]) || r),
        (e = e || "fx"),
        this.queue(e, function (e, t) {
          var n = C.setTimeout(e, r);
          t.stop = function () {
            C.clearTimeout(n);
          };
        })
      );
    }),
    (rt = E.createElement("input")),
    (it = E.createElement("select").appendChild(E.createElement("option"))),
    (rt.type = "checkbox"),
    (y.checkOn = "" !== rt.value),
    (y.optSelected = it.selected),
    ((rt = E.createElement("input")).value = "t"),
    (rt.type = "radio"),
    (y.radioValue = "t" === rt.value);
  var pt,
    dt = S.expr.attrHandle;
  S.fn.extend({
    attr: function (e, t) {
      return $(this, S.attr, e, t, 1 < arguments.length);
    },
    removeAttr: function (e) {
      return this.each(function () {
        S.removeAttr(this, e);
      });
    },
  }),
    S.extend({
      attr: function (e, t, n) {
        var r,
          i,
          o = e.nodeType;
        if (3 !== o && 8 !== o && 2 !== o)
          return "undefined" == typeof e.getAttribute
            ? S.prop(e, t, n)
            : ((1 === o && S.isXMLDoc(e)) ||
                (i =
                  S.attrHooks[t.toLowerCase()] ||
                  (S.expr.match.bool.test(t) ? pt : void 0)),
              void 0 !== n
                ? null === n
                  ? void S.removeAttr(e, t)
                  : i && "set" in i && void 0 !== (r = i.set(e, n, t))
                    ? r
                    : (e.setAttribute(t, n + ""), n)
                : i && "get" in i && null !== (r = i.get(e, t))
                  ? r
                  : null == (r = S.find.attr(e, t))
                    ? void 0
                    : r);
      },
      attrHooks: {
        type: {
          set: function (e, t) {
            if (!y.radioValue && "radio" === t && A(e, "input")) {
              var n = e.value;
              return e.setAttribute("type", t), n && (e.value = n), t;
            }
          },
        },
      },
      removeAttr: function (e, t) {
        var n,
          r = 0,
          i = t && t.match(P);
        if (i && 1 === e.nodeType) while ((n = i[r++])) e.removeAttribute(n);
      },
    }),
    (pt = {
      set: function (e, t, n) {
        return !1 === t ? S.removeAttr(e, n) : e.setAttribute(n, n), n;
      },
    }),
    S.each(S.expr.match.bool.source.match(/\w+/g), function (e, t) {
      var a = dt[t] || S.find.attr;
      dt[t] = function (e, t, n) {
        var r,
          i,
          o = t.toLowerCase();
        return (
          n ||
            ((i = dt[o]),
            (dt[o] = r),
            (r = null != a(e, t, n) ? o : null),
            (dt[o] = i)),
          r
        );
      };
    });
  var ht = /^(?:input|select|textarea|button)$/i,
    gt = /^(?:a|area)$/i;
  function vt(e) {
    return (e.match(P) || []).join(" ");
  }
  function yt(e) {
    return (e.getAttribute && e.getAttribute("class")) || "";
  }
  function mt(e) {
    return Array.isArray(e) ? e : ("string" == typeof e && e.match(P)) || [];
  }
  S.fn.extend({
    prop: function (e, t) {
      return $(this, S.prop, e, t, 1 < arguments.length);
    },
    removeProp: function (e) {
      return this.each(function () {
        delete this[S.propFix[e] || e];
      });
    },
  }),
    S.extend({
      prop: function (e, t, n) {
        var r,
          i,
          o = e.nodeType;
        if (3 !== o && 8 !== o && 2 !== o)
          return (
            (1 === o && S.isXMLDoc(e)) ||
              ((t = S.propFix[t] || t), (i = S.propHooks[t])),
            void 0 !== n
              ? i && "set" in i && void 0 !== (r = i.set(e, n, t))
                ? r
                : (e[t] = n)
              : i && "get" in i && null !== (r = i.get(e, t))
                ? r
                : e[t]
          );
      },
      propHooks: {
        tabIndex: {
          get: function (e) {
            var t = S.find.attr(e, "tabindex");
            return t
              ? parseInt(t, 10)
              : ht.test(e.nodeName) || (gt.test(e.nodeName) && e.href)
                ? 0
                : -1;
          },
        },
      },
      propFix: { for: "htmlFor", class: "className" },
    }),
    y.optSelected ||
      (S.propHooks.selected = {
        get: function (e) {
          var t = e.parentNode;
          return t && t.parentNode && t.parentNode.selectedIndex, null;
        },
        set: function (e) {
          var t = e.parentNode;
          t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
        },
      }),
    S.each(
      [
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable",
      ],
      function () {
        S.propFix[this.toLowerCase()] = this;
      },
    ),
    S.fn.extend({
      addClass: function (t) {
        var e,
          n,
          r,
          i,
          o,
          a,
          s,
          u = 0;
        if (m(t))
          return this.each(function (e) {
            S(this).addClass(t.call(this, e, yt(this)));
          });
        if ((e = mt(t)).length)
          while ((n = this[u++]))
            if (((i = yt(n)), (r = 1 === n.nodeType && " " + vt(i) + " "))) {
              a = 0;
              while ((o = e[a++]))
                r.indexOf(" " + o + " ") < 0 && (r += o + " ");
              i !== (s = vt(r)) && n.setAttribute("class", s);
            }
        return this;
      },
      removeClass: function (t) {
        var e,
          n,
          r,
          i,
          o,
          a,
          s,
          u = 0;
        if (m(t))
          return this.each(function (e) {
            S(this).removeClass(t.call(this, e, yt(this)));
          });
        if (!arguments.length) return this.attr("class", "");
        if ((e = mt(t)).length)
          while ((n = this[u++]))
            if (((i = yt(n)), (r = 1 === n.nodeType && " " + vt(i) + " "))) {
              a = 0;
              while ((o = e[a++]))
                while (-1 < r.indexOf(" " + o + " "))
                  r = r.replace(" " + o + " ", " ");
              i !== (s = vt(r)) && n.setAttribute("class", s);
            }
        return this;
      },
      toggleClass: function (i, t) {
        var o = typeof i,
          a = "string" === o || Array.isArray(i);
        return "boolean" == typeof t && a
          ? t
            ? this.addClass(i)
            : this.removeClass(i)
          : m(i)
            ? this.each(function (e) {
                S(this).toggleClass(i.call(this, e, yt(this), t), t);
              })
            : this.each(function () {
                var e, t, n, r;
                if (a) {
                  (t = 0), (n = S(this)), (r = mt(i));
                  while ((e = r[t++]))
                    n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
                } else
                  (void 0 !== i && "boolean" !== o) ||
                    ((e = yt(this)) && Y.set(this, "__className__", e),
                    this.setAttribute &&
                      this.setAttribute(
                        "class",
                        e || !1 === i ? "" : Y.get(this, "__className__") || "",
                      ));
              });
      },
      hasClass: function (e) {
        var t,
          n,
          r = 0;
        t = " " + e + " ";
        while ((n = this[r++]))
          if (1 === n.nodeType && -1 < (" " + vt(yt(n)) + " ").indexOf(t))
            return !0;
        return !1;
      },
    });
  var xt = /\r/g;
  S.fn.extend({
    val: function (n) {
      var r,
        e,
        i,
        t = this[0];
      return arguments.length
        ? ((i = m(n)),
          this.each(function (e) {
            var t;
            1 === this.nodeType &&
              (null == (t = i ? n.call(this, e, S(this).val()) : n)
                ? (t = "")
                : "number" == typeof t
                  ? (t += "")
                  : Array.isArray(t) &&
                    (t = S.map(t, function (e) {
                      return null == e ? "" : e + "";
                    })),
              ((r =
                S.valHooks[this.type] ||
                S.valHooks[this.nodeName.toLowerCase()]) &&
                "set" in r &&
                void 0 !== r.set(this, t, "value")) ||
                (this.value = t));
          }))
        : t
          ? (r = S.valHooks[t.type] || S.valHooks[t.nodeName.toLowerCase()]) &&
            "get" in r &&
            void 0 !== (e = r.get(t, "value"))
            ? e
            : "string" == typeof (e = t.value)
              ? e.replace(xt, "")
              : null == e
                ? ""
                : e
          : void 0;
    },
  }),
    S.extend({
      valHooks: {
        option: {
          get: function (e) {
            var t = S.find.attr(e, "value");
            return null != t ? t : vt(S.text(e));
          },
        },
        select: {
          get: function (e) {
            var t,
              n,
              r,
              i = e.options,
              o = e.selectedIndex,
              a = "select-one" === e.type,
              s = a ? null : [],
              u = a ? o + 1 : i.length;
            for (r = o < 0 ? u : a ? o : 0; r < u; r++)
              if (
                ((n = i[r]).selected || r === o) &&
                !n.disabled &&
                (!n.parentNode.disabled || !A(n.parentNode, "optgroup"))
              ) {
                if (((t = S(n).val()), a)) return t;
                s.push(t);
              }
            return s;
          },
          set: function (e, t) {
            var n,
              r,
              i = e.options,
              o = S.makeArray(t),
              a = i.length;
            while (a--)
              ((r = i[a]).selected =
                -1 < S.inArray(S.valHooks.option.get(r), o)) && (n = !0);
            return n || (e.selectedIndex = -1), o;
          },
        },
      },
    }),
    S.each(["radio", "checkbox"], function () {
      (S.valHooks[this] = {
        set: function (e, t) {
          if (Array.isArray(t))
            return (e.checked = -1 < S.inArray(S(e).val(), t));
        },
      }),
        y.checkOn ||
          (S.valHooks[this].get = function (e) {
            return null === e.getAttribute("value") ? "on" : e.value;
          });
    }),
    (y.focusin = "onfocusin" in C);
  var bt = /^(?:focusinfocus|focusoutblur)$/,
    wt = function (e) {
      e.stopPropagation();
    };
  S.extend(S.event, {
    trigger: function (e, t, n, r) {
      var i,
        o,
        a,
        s,
        u,
        l,
        c,
        f,
        p = [n || E],
        d = v.call(e, "type") ? e.type : e,
        h = v.call(e, "namespace") ? e.namespace.split(".") : [];
      if (
        ((o = f = a = n = n || E),
        3 !== n.nodeType &&
          8 !== n.nodeType &&
          !bt.test(d + S.event.triggered) &&
          (-1 < d.indexOf(".") && ((d = (h = d.split(".")).shift()), h.sort()),
          (u = d.indexOf(":") < 0 && "on" + d),
          ((e = e[S.expando]
            ? e
            : new S.Event(d, "object" == typeof e && e)).isTrigger = r ? 2 : 3),
          (e.namespace = h.join(".")),
          (e.rnamespace = e.namespace
            ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)")
            : null),
          (e.result = void 0),
          e.target || (e.target = n),
          (t = null == t ? [e] : S.makeArray(t, [e])),
          (c = S.event.special[d] || {}),
          r || !c.trigger || !1 !== c.trigger.apply(n, t)))
      ) {
        if (!r && !c.noBubble && !x(n)) {
          for (
            s = c.delegateType || d, bt.test(s + d) || (o = o.parentNode);
            o;
            o = o.parentNode
          )
            p.push(o), (a = o);
          a === (n.ownerDocument || E) &&
            p.push(a.defaultView || a.parentWindow || C);
        }
        i = 0;
        while ((o = p[i++]) && !e.isPropagationStopped())
          (f = o),
            (e.type = 1 < i ? s : c.bindType || d),
            (l =
              (Y.get(o, "events") || Object.create(null))[e.type] &&
              Y.get(o, "handle")) && l.apply(o, t),
            (l = u && o[u]) &&
              l.apply &&
              V(o) &&
              ((e.result = l.apply(o, t)),
              !1 === e.result && e.preventDefault());
        return (
          (e.type = d),
          r ||
            e.isDefaultPrevented() ||
            (c._default && !1 !== c._default.apply(p.pop(), t)) ||
            !V(n) ||
            (u &&
              m(n[d]) &&
              !x(n) &&
              ((a = n[u]) && (n[u] = null),
              (S.event.triggered = d),
              e.isPropagationStopped() && f.addEventListener(d, wt),
              n[d](),
              e.isPropagationStopped() && f.removeEventListener(d, wt),
              (S.event.triggered = void 0),
              a && (n[u] = a))),
          e.result
        );
      }
    },
    simulate: function (e, t, n) {
      var r = S.extend(new S.Event(), n, { type: e, isSimulated: !0 });
      S.event.trigger(r, null, t);
    },
  }),
    S.fn.extend({
      trigger: function (e, t) {
        return this.each(function () {
          S.event.trigger(e, t, this);
        });
      },
      triggerHandler: function (e, t) {
        var n = this[0];
        if (n) return S.event.trigger(e, t, n, !0);
      },
    }),
    y.focusin ||
      S.each({ focus: "focusin", blur: "focusout" }, function (n, r) {
        var i = function (e) {
          S.event.simulate(r, e.target, S.event.fix(e));
        };
        S.event.special[r] = {
          setup: function () {
            var e = this.ownerDocument || this.document || this,
              t = Y.access(e, r);
            t || e.addEventListener(n, i, !0), Y.access(e, r, (t || 0) + 1);
          },
          teardown: function () {
            var e = this.ownerDocument || this.document || this,
              t = Y.access(e, r) - 1;
            t
              ? Y.access(e, r, t)
              : (e.removeEventListener(n, i, !0), Y.remove(e, r));
          },
        };
      });
  var Tt = C.location,
    Ct = { guid: Date.now() },
    Et = /\?/;
  S.parseXML = function (e) {
    var t;
    if (!e || "string" != typeof e) return null;
    try {
      t = new C.DOMParser().parseFromString(e, "text/xml");
    } catch (e) {
      t = void 0;
    }
    return (
      (t && !t.getElementsByTagName("parsererror").length) ||
        S.error("Invalid XML: " + e),
      t
    );
  };
  var St = /\[\]$/,
    kt = /\r?\n/g,
    At = /^(?:submit|button|image|reset|file)$/i,
    Nt = /^(?:input|select|textarea|keygen)/i;
  function Dt(n, e, r, i) {
    var t;
    if (Array.isArray(e))
      S.each(e, function (e, t) {
        r || St.test(n)
          ? i(n, t)
          : Dt(
              n + "[" + ("object" == typeof t && null != t ? e : "") + "]",
              t,
              r,
              i,
            );
      });
    else if (r || "object" !== w(e)) i(n, e);
    else for (t in e) Dt(n + "[" + t + "]", e[t], r, i);
  }
  (S.param = function (e, t) {
    var n,
      r = [],
      i = function (e, t) {
        var n = m(t) ? t() : t;
        r[r.length] =
          encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n);
      };
    if (null == e) return "";
    if (Array.isArray(e) || (e.jquery && !S.isPlainObject(e)))
      S.each(e, function () {
        i(this.name, this.value);
      });
    else for (n in e) Dt(n, e[n], t, i);
    return r.join("&");
  }),
    S.fn.extend({
      serialize: function () {
        return S.param(this.serializeArray());
      },
      serializeArray: function () {
        return this.map(function () {
          var e = S.prop(this, "elements");
          return e ? S.makeArray(e) : this;
        })
          .filter(function () {
            var e = this.type;
            return (
              this.name &&
              !S(this).is(":disabled") &&
              Nt.test(this.nodeName) &&
              !At.test(e) &&
              (this.checked || !pe.test(e))
            );
          })
          .map(function (e, t) {
            var n = S(this).val();
            return null == n
              ? null
              : Array.isArray(n)
                ? S.map(n, function (e) {
                    return { name: t.name, value: e.replace(kt, "\r\n") };
                  })
                : { name: t.name, value: n.replace(kt, "\r\n") };
          })
          .get();
      },
    });
  var jt = /%20/g,
    qt = /#.*$/,
    Lt = /([?&])_=[^&]*/,
    Ht = /^(.*?):[ \t]*([^\r\n]*)$/gm,
    Ot = /^(?:GET|HEAD)$/,
    Pt = /^\/\//,
    Rt = {},
    Mt = {},
    It = "*/".concat("*"),
    Wt = E.createElement("a");
  function Ft(o) {
    return function (e, t) {
      "string" != typeof e && ((t = e), (e = "*"));
      var n,
        r = 0,
        i = e.toLowerCase().match(P) || [];
      if (m(t))
        while ((n = i[r++]))
          "+" === n[0]
            ? ((n = n.slice(1) || "*"), (o[n] = o[n] || []).unshift(t))
            : (o[n] = o[n] || []).push(t);
    };
  }
  function Bt(t, i, o, a) {
    var s = {},
      u = t === Mt;
    function l(e) {
      var r;
      return (
        (s[e] = !0),
        S.each(t[e] || [], function (e, t) {
          var n = t(i, o, a);
          return "string" != typeof n || u || s[n]
            ? u
              ? !(r = n)
              : void 0
            : (i.dataTypes.unshift(n), l(n), !1);
        }),
        r
      );
    }
    return l(i.dataTypes[0]) || (!s["*"] && l("*"));
  }
  function $t(e, t) {
    var n,
      r,
      i = S.ajaxSettings.flatOptions || {};
    for (n in t) void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
    return r && S.extend(!0, e, r), e;
  }
  (Wt.href = Tt.href),
    S.extend({
      active: 0,
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: Tt.href,
        type: "GET",
        isLocal:
          /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(
            Tt.protocol,
          ),
        global: !0,
        processData: !0,
        async: !0,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        accepts: {
          "*": It,
          text: "text/plain",
          html: "text/html",
          xml: "application/xml, text/xml",
          json: "application/json, text/javascript",
        },
        contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
        responseFields: {
          xml: "responseXML",
          text: "responseText",
          json: "responseJSON",
        },
        converters: {
          "* text": String,
          "text html": !0,
          "text json": JSON.parse,
          "text xml": S.parseXML,
        },
        flatOptions: { url: !0, context: !0 },
      },
      ajaxSetup: function (e, t) {
        return t ? $t($t(e, S.ajaxSettings), t) : $t(S.ajaxSettings, e);
      },
      ajaxPrefilter: Ft(Rt),
      ajaxTransport: Ft(Mt),
      ajax: function (e, t) {
        "object" == typeof e && ((t = e), (e = void 0)), (t = t || {});
        var c,
          f,
          p,
          n,
          d,
          r,
          h,
          g,
          i,
          o,
          v = S.ajaxSetup({}, t),
          y = v.context || v,
          m = v.context && (y.nodeType || y.jquery) ? S(y) : S.event,
          x = S.Deferred(),
          b = S.Callbacks("once memory"),
          w = v.statusCode || {},
          a = {},
          s = {},
          u = "canceled",
          T = {
            readyState: 0,
            getResponseHeader: function (e) {
              var t;
              if (h) {
                if (!n) {
                  n = {};
                  while ((t = Ht.exec(p)))
                    n[t[1].toLowerCase() + " "] = (
                      n[t[1].toLowerCase() + " "] || []
                    ).concat(t[2]);
                }
                t = n[e.toLowerCase() + " "];
              }
              return null == t ? null : t.join(", ");
            },
            getAllResponseHeaders: function () {
              return h ? p : null;
            },
            setRequestHeader: function (e, t) {
              return (
                null == h &&
                  ((e = s[e.toLowerCase()] = s[e.toLowerCase()] || e),
                  (a[e] = t)),
                this
              );
            },
            overrideMimeType: function (e) {
              return null == h && (v.mimeType = e), this;
            },
            statusCode: function (e) {
              var t;
              if (e)
                if (h) T.always(e[T.status]);
                else for (t in e) w[t] = [w[t], e[t]];
              return this;
            },
            abort: function (e) {
              var t = e || u;
              return c && c.abort(t), l(0, t), this;
            },
          };
        if (
          (x.promise(T),
          (v.url = ((e || v.url || Tt.href) + "").replace(
            Pt,
            Tt.protocol + "//",
          )),
          (v.type = t.method || t.type || v.method || v.type),
          (v.dataTypes = (v.dataType || "*").toLowerCase().match(P) || [""]),
          null == v.crossDomain)
        ) {
          r = E.createElement("a");
          try {
            (r.href = v.url),
              (r.href = r.href),
              (v.crossDomain =
                Wt.protocol + "//" + Wt.host != r.protocol + "//" + r.host);
          } catch (e) {
            v.crossDomain = !0;
          }
        }
        if (
          (v.data &&
            v.processData &&
            "string" != typeof v.data &&
            (v.data = S.param(v.data, v.traditional)),
          Bt(Rt, v, t, T),
          h)
        )
          return T;
        for (i in ((g = S.event && v.global) &&
          0 == S.active++ &&
          S.event.trigger("ajaxStart"),
        (v.type = v.type.toUpperCase()),
        (v.hasContent = !Ot.test(v.type)),
        (f = v.url.replace(qt, "")),
        v.hasContent
          ? v.data &&
            v.processData &&
            0 ===
              (v.contentType || "").indexOf(
                "application/x-www-form-urlencoded",
              ) &&
            (v.data = v.data.replace(jt, "+"))
          : ((o = v.url.slice(f.length)),
            v.data &&
              (v.processData || "string" == typeof v.data) &&
              ((f += (Et.test(f) ? "&" : "?") + v.data), delete v.data),
            !1 === v.cache &&
              ((f = f.replace(Lt, "$1")),
              (o = (Et.test(f) ? "&" : "?") + "_=" + Ct.guid++ + o)),
            (v.url = f + o)),
        v.ifModified &&
          (S.lastModified[f] &&
            T.setRequestHeader("If-Modified-Since", S.lastModified[f]),
          S.etag[f] && T.setRequestHeader("If-None-Match", S.etag[f])),
        ((v.data && v.hasContent && !1 !== v.contentType) || t.contentType) &&
          T.setRequestHeader("Content-Type", v.contentType),
        T.setRequestHeader(
          "Accept",
          v.dataTypes[0] && v.accepts[v.dataTypes[0]]
            ? v.accepts[v.dataTypes[0]] +
                ("*" !== v.dataTypes[0] ? ", " + It + "; q=0.01" : "")
            : v.accepts["*"],
        ),
        v.headers))
          T.setRequestHeader(i, v.headers[i]);
        if (v.beforeSend && (!1 === v.beforeSend.call(y, T, v) || h))
          return T.abort();
        if (
          ((u = "abort"),
          b.add(v.complete),
          T.done(v.success),
          T.fail(v.error),
          (c = Bt(Mt, v, t, T)))
        ) {
          if (((T.readyState = 1), g && m.trigger("ajaxSend", [T, v]), h))
            return T;
          v.async &&
            0 < v.timeout &&
            (d = C.setTimeout(function () {
              T.abort("timeout");
            }, v.timeout));
          try {
            (h = !1), c.send(a, l);
          } catch (e) {
            if (h) throw e;
            l(-1, e);
          }
        } else l(-1, "No Transport");
        function l(e, t, n, r) {
          var i,
            o,
            a,
            s,
            u,
            l = t;
          h ||
            ((h = !0),
            d && C.clearTimeout(d),
            (c = void 0),
            (p = r || ""),
            (T.readyState = 0 < e ? 4 : 0),
            (i = (200 <= e && e < 300) || 304 === e),
            n &&
              (s = (function (e, t, n) {
                var r,
                  i,
                  o,
                  a,
                  s = e.contents,
                  u = e.dataTypes;
                while ("*" === u[0])
                  u.shift(),
                    void 0 === r &&
                      (r = e.mimeType || t.getResponseHeader("Content-Type"));
                if (r)
                  for (i in s)
                    if (s[i] && s[i].test(r)) {
                      u.unshift(i);
                      break;
                    }
                if (u[0] in n) o = u[0];
                else {
                  for (i in n) {
                    if (!u[0] || e.converters[i + " " + u[0]]) {
                      o = i;
                      break;
                    }
                    a || (a = i);
                  }
                  o = o || a;
                }
                if (o) return o !== u[0] && u.unshift(o), n[o];
              })(v, T, n)),
            !i &&
              -1 < S.inArray("script", v.dataTypes) &&
              (v.converters["text script"] = function () {}),
            (s = (function (e, t, n, r) {
              var i,
                o,
                a,
                s,
                u,
                l = {},
                c = e.dataTypes.slice();
              if (c[1])
                for (a in e.converters) l[a.toLowerCase()] = e.converters[a];
              o = c.shift();
              while (o)
                if (
                  (e.responseFields[o] && (n[e.responseFields[o]] = t),
                  !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                  (u = o),
                  (o = c.shift()))
                )
                  if ("*" === o) o = u;
                  else if ("*" !== u && u !== o) {
                    if (!(a = l[u + " " + o] || l["* " + o]))
                      for (i in l)
                        if (
                          (s = i.split(" "))[1] === o &&
                          (a = l[u + " " + s[0]] || l["* " + s[0]])
                        ) {
                          !0 === a
                            ? (a = l[i])
                            : !0 !== l[i] && ((o = s[0]), c.unshift(s[1]));
                          break;
                        }
                    if (!0 !== a)
                      if (a && e["throws"]) t = a(t);
                      else
                        try {
                          t = a(t);
                        } catch (e) {
                          return {
                            state: "parsererror",
                            error: a
                              ? e
                              : "No conversion from " + u + " to " + o,
                          };
                        }
                  }
              return { state: "success", data: t };
            })(v, s, T, i)),
            i
              ? (v.ifModified &&
                  ((u = T.getResponseHeader("Last-Modified")) &&
                    (S.lastModified[f] = u),
                  (u = T.getResponseHeader("etag")) && (S.etag[f] = u)),
                204 === e || "HEAD" === v.type
                  ? (l = "nocontent")
                  : 304 === e
                    ? (l = "notmodified")
                    : ((l = s.state), (o = s.data), (i = !(a = s.error))))
              : ((a = l), (!e && l) || ((l = "error"), e < 0 && (e = 0))),
            (T.status = e),
            (T.statusText = (t || l) + ""),
            i ? x.resolveWith(y, [o, l, T]) : x.rejectWith(y, [T, l, a]),
            T.statusCode(w),
            (w = void 0),
            g && m.trigger(i ? "ajaxSuccess" : "ajaxError", [T, v, i ? o : a]),
            b.fireWith(y, [T, l]),
            g &&
              (m.trigger("ajaxComplete", [T, v]),
              --S.active || S.event.trigger("ajaxStop")));
        }
        return T;
      },
      getJSON: function (e, t, n) {
        return S.get(e, t, n, "json");
      },
      getScript: function (e, t) {
        return S.get(e, void 0, t, "script");
      },
    }),
    S.each(["get", "post"], function (e, i) {
      S[i] = function (e, t, n, r) {
        return (
          m(t) && ((r = r || n), (n = t), (t = void 0)),
          S.ajax(
            S.extend(
              { url: e, type: i, dataType: r, data: t, success: n },
              S.isPlainObject(e) && e,
            ),
          )
        );
      };
    }),
    S.ajaxPrefilter(function (e) {
      var t;
      for (t in e.headers)
        "content-type" === t.toLowerCase() &&
          (e.contentType = e.headers[t] || "");
    }),
    (S._evalUrl = function (e, t, n) {
      return S.ajax({
        url: e,
        type: "GET",
        dataType: "script",
        cache: !0,
        async: !1,
        global: !1,
        converters: { "text script": function () {} },
        dataFilter: function (e) {
          S.globalEval(e, t, n);
        },
      });
    }),
    S.fn.extend({
      wrapAll: function (e) {
        var t;
        return (
          this[0] &&
            (m(e) && (e = e.call(this[0])),
            (t = S(e, this[0].ownerDocument).eq(0).clone(!0)),
            this[0].parentNode && t.insertBefore(this[0]),
            t
              .map(function () {
                var e = this;
                while (e.firstElementChild) e = e.firstElementChild;
                return e;
              })
              .append(this)),
          this
        );
      },
      wrapInner: function (n) {
        return m(n)
          ? this.each(function (e) {
              S(this).wrapInner(n.call(this, e));
            })
          : this.each(function () {
              var e = S(this),
                t = e.contents();
              t.length ? t.wrapAll(n) : e.append(n);
            });
      },
      wrap: function (t) {
        var n = m(t);
        return this.each(function (e) {
          S(this).wrapAll(n ? t.call(this, e) : t);
        });
      },
      unwrap: function (e) {
        return (
          this.parent(e)
            .not("body")
            .each(function () {
              S(this).replaceWith(this.childNodes);
            }),
          this
        );
      },
    }),
    (S.expr.pseudos.hidden = function (e) {
      return !S.expr.pseudos.visible(e);
    }),
    (S.expr.pseudos.visible = function (e) {
      return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
    }),
    (S.ajaxSettings.xhr = function () {
      try {
        return new C.XMLHttpRequest();
      } catch (e) {}
    });
  var _t = { 0: 200, 1223: 204 },
    zt = S.ajaxSettings.xhr();
  (y.cors = !!zt && "withCredentials" in zt),
    (y.ajax = zt = !!zt),
    S.ajaxTransport(function (i) {
      var o, a;
      if (y.cors || (zt && !i.crossDomain))
        return {
          send: function (e, t) {
            var n,
              r = i.xhr();
            if (
              (r.open(i.type, i.url, i.async, i.username, i.password),
              i.xhrFields)
            )
              for (n in i.xhrFields) r[n] = i.xhrFields[n];
            for (n in (i.mimeType &&
              r.overrideMimeType &&
              r.overrideMimeType(i.mimeType),
            i.crossDomain ||
              e["X-Requested-With"] ||
              (e["X-Requested-With"] = "XMLHttpRequest"),
            e))
              r.setRequestHeader(n, e[n]);
            (o = function (e) {
              return function () {
                o &&
                  ((o =
                    a =
                    r.onload =
                    r.onerror =
                    r.onabort =
                    r.ontimeout =
                    r.onreadystatechange =
                      null),
                  "abort" === e
                    ? r.abort()
                    : "error" === e
                      ? "number" != typeof r.status
                        ? t(0, "error")
                        : t(r.status, r.statusText)
                      : t(
                          _t[r.status] || r.status,
                          r.statusText,
                          "text" !== (r.responseType || "text") ||
                            "string" != typeof r.responseText
                            ? { binary: r.response }
                            : { text: r.responseText },
                          r.getAllResponseHeaders(),
                        ));
              };
            }),
              (r.onload = o()),
              (a = r.onerror = r.ontimeout = o("error")),
              void 0 !== r.onabort
                ? (r.onabort = a)
                : (r.onreadystatechange = function () {
                    4 === r.readyState &&
                      C.setTimeout(function () {
                        o && a();
                      });
                  }),
              (o = o("abort"));
            try {
              r.send((i.hasContent && i.data) || null);
            } catch (e) {
              if (o) throw e;
            }
          },
          abort: function () {
            o && o();
          },
        };
    }),
    S.ajaxPrefilter(function (e) {
      e.crossDomain && (e.contents.script = !1);
    }),
    S.ajaxSetup({
      accepts: {
        script:
          "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
      },
      contents: { script: /\b(?:java|ecma)script\b/ },
      converters: {
        "text script": function (e) {
          return S.globalEval(e), e;
        },
      },
    }),
    S.ajaxPrefilter("script", function (e) {
      void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET");
    }),
    S.ajaxTransport("script", function (n) {
      var r, i;
      if (n.crossDomain || n.scriptAttrs)
        return {
          send: function (e, t) {
            (r = S("<script>")
              .attr(n.scriptAttrs || {})
              .prop({ charset: n.scriptCharset, src: n.url })
              .on(
                "load error",
                (i = function (e) {
                  r.remove(),
                    (i = null),
                    e && t("error" === e.type ? 404 : 200, e.type);
                }),
              )),
              E.head.appendChild(r[0]);
          },
          abort: function () {
            i && i();
          },
        };
    });
  var Ut,
    Xt = [],
    Vt = /(=)\?(?=&|$)|\?\?/;
  S.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      var e = Xt.pop() || S.expando + "_" + Ct.guid++;
      return (this[e] = !0), e;
    },
  }),
    S.ajaxPrefilter("json jsonp", function (e, t, n) {
      var r,
        i,
        o,
        a =
          !1 !== e.jsonp &&
          (Vt.test(e.url)
            ? "url"
            : "string" == typeof e.data &&
              0 ===
                (e.contentType || "").indexOf(
                  "application/x-www-form-urlencoded",
                ) &&
              Vt.test(e.data) &&
              "data");
      if (a || "jsonp" === e.dataTypes[0])
        return (
          (r = e.jsonpCallback =
            m(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback),
          a
            ? (e[a] = e[a].replace(Vt, "$1" + r))
            : !1 !== e.jsonp &&
              (e.url += (Et.test(e.url) ? "&" : "?") + e.jsonp + "=" + r),
          (e.converters["script json"] = function () {
            return o || S.error(r + " was not called"), o[0];
          }),
          (e.dataTypes[0] = "json"),
          (i = C[r]),
          (C[r] = function () {
            o = arguments;
          }),
          n.always(function () {
            void 0 === i ? S(C).removeProp(r) : (C[r] = i),
              e[r] && ((e.jsonpCallback = t.jsonpCallback), Xt.push(r)),
              o && m(i) && i(o[0]),
              (o = i = void 0);
          }),
          "script"
        );
    }),
    (y.createHTMLDocument =
      (((Ut = E.implementation.createHTMLDocument("").body).innerHTML =
        "<form></form><form></form>"),
      2 === Ut.childNodes.length)),
    (S.parseHTML = function (e, t, n) {
      return "string" != typeof e
        ? []
        : ("boolean" == typeof t && ((n = t), (t = !1)),
          t ||
            (y.createHTMLDocument
              ? (((r = (t =
                  E.implementation.createHTMLDocument("")).createElement(
                  "base",
                )).href = E.location.href),
                t.head.appendChild(r))
              : (t = E)),
          (o = !n && []),
          (i = N.exec(e))
            ? [t.createElement(i[1])]
            : ((i = xe([e], t, o)),
              o && o.length && S(o).remove(),
              S.merge([], i.childNodes)));
      var r, i, o;
    }),
    (S.fn.load = function (e, t, n) {
      var r,
        i,
        o,
        a = this,
        s = e.indexOf(" ");
      return (
        -1 < s && ((r = vt(e.slice(s))), (e = e.slice(0, s))),
        m(t)
          ? ((n = t), (t = void 0))
          : t && "object" == typeof t && (i = "POST"),
        0 < a.length &&
          S.ajax({ url: e, type: i || "GET", dataType: "html", data: t })
            .done(function (e) {
              (o = arguments),
                a.html(r ? S("<div>").append(S.parseHTML(e)).find(r) : e);
            })
            .always(
              n &&
                function (e, t) {
                  a.each(function () {
                    n.apply(this, o || [e.responseText, t, e]);
                  });
                },
            ),
        this
      );
    }),
    (S.expr.pseudos.animated = function (t) {
      return S.grep(S.timers, function (e) {
        return t === e.elem;
      }).length;
    }),
    (S.offset = {
      setOffset: function (e, t, n) {
        var r,
          i,
          o,
          a,
          s,
          u,
          l = S.css(e, "position"),
          c = S(e),
          f = {};
        "static" === l && (e.style.position = "relative"),
          (s = c.offset()),
          (o = S.css(e, "top")),
          (u = S.css(e, "left")),
          ("absolute" === l || "fixed" === l) && -1 < (o + u).indexOf("auto")
            ? ((a = (r = c.position()).top), (i = r.left))
            : ((a = parseFloat(o) || 0), (i = parseFloat(u) || 0)),
          m(t) && (t = t.call(e, n, S.extend({}, s))),
          null != t.top && (f.top = t.top - s.top + a),
          null != t.left && (f.left = t.left - s.left + i),
          "using" in t
            ? t.using.call(e, f)
            : ("number" == typeof f.top && (f.top += "px"),
              "number" == typeof f.left && (f.left += "px"),
              c.css(f));
      },
    }),
    S.fn.extend({
      offset: function (t) {
        if (arguments.length)
          return void 0 === t
            ? this
            : this.each(function (e) {
                S.offset.setOffset(this, t, e);
              });
        var e,
          n,
          r = this[0];
        return r
          ? r.getClientRects().length
            ? ((e = r.getBoundingClientRect()),
              (n = r.ownerDocument.defaultView),
              { top: e.top + n.pageYOffset, left: e.left + n.pageXOffset })
            : { top: 0, left: 0 }
          : void 0;
      },
      position: function () {
        if (this[0]) {
          var e,
            t,
            n,
            r = this[0],
            i = { top: 0, left: 0 };
          if ("fixed" === S.css(r, "position")) t = r.getBoundingClientRect();
          else {
            (t = this.offset()),
              (n = r.ownerDocument),
              (e = r.offsetParent || n.documentElement);
            while (
              e &&
              (e === n.body || e === n.documentElement) &&
              "static" === S.css(e, "position")
            )
              e = e.parentNode;
            e &&
              e !== r &&
              1 === e.nodeType &&
              (((i = S(e).offset()).top += S.css(e, "borderTopWidth", !0)),
              (i.left += S.css(e, "borderLeftWidth", !0)));
          }
          return {
            top: t.top - i.top - S.css(r, "marginTop", !0),
            left: t.left - i.left - S.css(r, "marginLeft", !0),
          };
        }
      },
      offsetParent: function () {
        return this.map(function () {
          var e = this.offsetParent;
          while (e && "static" === S.css(e, "position")) e = e.offsetParent;
          return e || re;
        });
      },
    }),
    S.each(
      { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" },
      function (t, i) {
        var o = "pageYOffset" === i;
        S.fn[t] = function (e) {
          return $(
            this,
            function (e, t, n) {
              var r;
              if (
                (x(e) ? (r = e) : 9 === e.nodeType && (r = e.defaultView),
                void 0 === n)
              )
                return r ? r[i] : e[t];
              r
                ? r.scrollTo(o ? r.pageXOffset : n, o ? n : r.pageYOffset)
                : (e[t] = n);
            },
            t,
            e,
            arguments.length,
          );
        };
      },
    ),
    S.each(["top", "left"], function (e, n) {
      S.cssHooks[n] = $e(y.pixelPosition, function (e, t) {
        if (t)
          return (t = Be(e, n)), Me.test(t) ? S(e).position()[n] + "px" : t;
      });
    }),
    S.each({ Height: "height", Width: "width" }, function (a, s) {
      S.each(
        { padding: "inner" + a, content: s, "": "outer" + a },
        function (r, o) {
          S.fn[o] = function (e, t) {
            var n = arguments.length && (r || "boolean" != typeof e),
              i = r || (!0 === e || !0 === t ? "margin" : "border");
            return $(
              this,
              function (e, t, n) {
                var r;
                return x(e)
                  ? 0 === o.indexOf("outer")
                    ? e["inner" + a]
                    : e.document.documentElement["client" + a]
                  : 9 === e.nodeType
                    ? ((r = e.documentElement),
                      Math.max(
                        e.body["scroll" + a],
                        r["scroll" + a],
                        e.body["offset" + a],
                        r["offset" + a],
                        r["client" + a],
                      ))
                    : void 0 === n
                      ? S.css(e, t, i)
                      : S.style(e, t, n, i);
              },
              s,
              n ? e : void 0,
              n,
            );
          };
        },
      );
    }),
    S.each(
      [
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend",
      ],
      function (e, t) {
        S.fn[t] = function (e) {
          return this.on(t, e);
        };
      },
    ),
    S.fn.extend({
      bind: function (e, t, n) {
        return this.on(e, null, t, n);
      },
      unbind: function (e, t) {
        return this.off(e, null, t);
      },
      delegate: function (e, t, n, r) {
        return this.on(t, e, n, r);
      },
      undelegate: function (e, t, n) {
        return 1 === arguments.length
          ? this.off(e, "**")
          : this.off(t, e || "**", n);
      },
      hover: function (e, t) {
        return this.mouseenter(e).mouseleave(t || e);
      },
    }),
    S.each(
      "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(
        " ",
      ),
      function (e, n) {
        S.fn[n] = function (e, t) {
          return 0 < arguments.length
            ? this.on(n, null, e, t)
            : this.trigger(n);
        };
      },
    );
  var Gt = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  (S.proxy = function (e, t) {
    var n, r, i;
    if (("string" == typeof t && ((n = e[t]), (t = e), (e = n)), m(e)))
      return (
        (r = s.call(arguments, 2)),
        ((i = function () {
          return e.apply(t || this, r.concat(s.call(arguments)));
        }).guid = e.guid =
          e.guid || S.guid++),
        i
      );
  }),
    (S.holdReady = function (e) {
      e ? S.readyWait++ : S.ready(!0);
    }),
    (S.isArray = Array.isArray),
    (S.parseJSON = JSON.parse),
    (S.nodeName = A),
    (S.isFunction = m),
    (S.isWindow = x),
    (S.camelCase = X),
    (S.type = w),
    (S.now = Date.now),
    (S.isNumeric = function (e) {
      var t = S.type(e);
      return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e));
    }),
    (S.trim = function (e) {
      return null == e ? "" : (e + "").replace(Gt, "");
    }),
    "function" == typeof define &&
      define.amd &&
      define("jquery", [], function () {
        return S;
      });
  var Yt = C.jQuery,
    Qt = C.$;
  return (
    (S.noConflict = function (e) {
      return C.$ === S && (C.$ = Qt), e && C.jQuery === S && (C.jQuery = Yt), S;
    }),
    "undefined" == typeof e && (C.jQuery = C.$ = S),
    S
  );
});

;}
      } catch(e) { console.error(`  Error executing script ${scriptPath_t8tk7ph2z29}`, e); }
    

      const scriptPath_zlhh3qvrbf = "popper.min.js"; // Use JSON.stringify for safety
      console.log(`  Executing JS (end): ${scriptPath_zlhh3qvrbf}`);
      try {
          with(__globals){;/**
 * @popperjs/core v2.11.8 - MIT License
 */

(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? factory(exports)
    : typeof define === "function" && define.amd
      ? define(["exports"], factory)
      : ((global =
          typeof globalThis !== "undefined" ? globalThis : global || self),
        factory((global.Popper = {})));
})(this, function (exports) {
  "use strict";

  function getWindow(node) {
    if (node == null) {
      return window;
    }

    if (node.toString() !== "[object Window]") {
      var ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }

    return node;
  }

  function isElement(node) {
    var OwnElement = getWindow(node).Element;
    return node instanceof OwnElement || node instanceof Element;
  }

  function isHTMLElement(node) {
    var OwnElement = getWindow(node).HTMLElement;
    return node instanceof OwnElement || node instanceof HTMLElement;
  }

  function isShadowRoot(node) {
    // IE 11 has no ShadowRoot
    if (typeof ShadowRoot === "undefined") {
      return false;
    }

    var OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }

  var max = Math.max;
  var min = Math.min;
  var round = Math.round;

  function getUAString() {
    var uaData = navigator.userAgentData;

    if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
      return uaData.brands
        .map(function (item) {
          return item.brand + "/" + item.version;
        })
        .join(" ");
    }

    return navigator.userAgent;
  }

  function isLayoutViewport() {
    return !/^((?!chrome|android).)*safari/i.test(getUAString());
  }

  function getBoundingClientRect(element, includeScale, isFixedStrategy) {
    if (includeScale === void 0) {
      includeScale = false;
    }

    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }

    var clientRect = element.getBoundingClientRect();
    var scaleX = 1;
    var scaleY = 1;

    if (includeScale && isHTMLElement(element)) {
      scaleX =
        element.offsetWidth > 0
          ? round(clientRect.width) / element.offsetWidth || 1
          : 1;
      scaleY =
        element.offsetHeight > 0
          ? round(clientRect.height) / element.offsetHeight || 1
          : 1;
    }

    var _ref = isElement(element) ? getWindow(element) : window,
      visualViewport = _ref.visualViewport;

    var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
    var x =
      (clientRect.left +
        (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) /
      scaleX;
    var y =
      (clientRect.top +
        (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) /
      scaleY;
    var width = clientRect.width / scaleX;
    var height = clientRect.height / scaleY;
    return {
      width: width,
      height: height,
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
      x: x,
      y: y,
    };
  }

  function getWindowScroll(node) {
    var win = getWindow(node);
    var scrollLeft = win.pageXOffset;
    var scrollTop = win.pageYOffset;
    return {
      scrollLeft: scrollLeft,
      scrollTop: scrollTop,
    };
  }

  function getHTMLElementScroll(element) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
    };
  }

  function getNodeScroll(node) {
    if (node === getWindow(node) || !isHTMLElement(node)) {
      return getWindowScroll(node);
    } else {
      return getHTMLElementScroll(node);
    }
  }

  function getNodeName(element) {
    return element ? (element.nodeName || "").toLowerCase() : null;
  }

  function getDocumentElement(element) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return (
      (isElement(element)
        ? element.ownerDocument // $FlowFixMe[prop-missing]
        : element.document) || window.document
    ).documentElement;
  }

  function getWindowScrollBarX(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    // Popper 1 is broken in this case and never had a bug report so let's assume
    // it's not an issue. I don't think anyone ever specifies width on <html>
    // anyway.
    // Browsers where the left scrollbar doesn't cause an issue report `0` for
    // this (e.g. Edge 2019, IE11, Safari)
    return (
      getBoundingClientRect(getDocumentElement(element)).left +
      getWindowScroll(element).scrollLeft
    );
  }

  function getComputedStyle(element) {
    return getWindow(element).getComputedStyle(element);
  }

  function isScrollParent(element) {
    // Firefox wants us to check `-x` and `-y` variations as well
    var _getComputedStyle = getComputedStyle(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }

  function isElementScaled(element) {
    var rect = element.getBoundingClientRect();
    var scaleX = round(rect.width) / element.offsetWidth || 1;
    var scaleY = round(rect.height) / element.offsetHeight || 1;
    return scaleX !== 1 || scaleY !== 1;
  } // Returns the composite rect of an element relative to its offsetParent.
  // Composite means it takes into account transforms as well as layout.

  function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
    if (isFixed === void 0) {
      isFixed = false;
    }

    var isOffsetParentAnElement = isHTMLElement(offsetParent);
    var offsetParentIsScaled =
      isHTMLElement(offsetParent) && isElementScaled(offsetParent);
    var documentElement = getDocumentElement(offsetParent);
    var rect = getBoundingClientRect(
      elementOrVirtualElement,
      offsetParentIsScaled,
      isFixed,
    );
    var scroll = {
      scrollLeft: 0,
      scrollTop: 0,
    };
    var offsets = {
      x: 0,
      y: 0,
    };

    if (isOffsetParentAnElement || (!isOffsetParentAnElement && !isFixed)) {
      if (
        getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
        isScrollParent(documentElement)
      ) {
        scroll = getNodeScroll(offsetParent);
      }

      if (isHTMLElement(offsetParent)) {
        offsets = getBoundingClientRect(offsetParent, true);
        offsets.x += offsetParent.clientLeft;
        offsets.y += offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }

    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height,
    };
  }

  // means it doesn't take into account transforms.

  function getLayoutRect(element) {
    var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
    // Fixes https://github.com/popperjs/popper-core/issues/1223

    var width = element.offsetWidth;
    var height = element.offsetHeight;

    if (Math.abs(clientRect.width - width) <= 1) {
      width = clientRect.width;
    }

    if (Math.abs(clientRect.height - height) <= 1) {
      height = clientRect.height;
    }

    return {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: width,
      height: height,
    };
  }

  function getParentNode(element) {
    if (getNodeName(element) === "html") {
      return element;
    }

    return (
      // this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // $FlowFixMe[incompatible-return]
      // $FlowFixMe[prop-missing]
      element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      element.parentNode || // DOM Element detected
      (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
      // $FlowFixMe[incompatible-call]: HTMLElement is a Node
      getDocumentElement(element) // fallback
    );
  }

  function getScrollParent(node) {
    if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
      // $FlowFixMe[incompatible-return]: assume body is always available
      return node.ownerDocument.body;
    }

    if (isHTMLElement(node) && isScrollParent(node)) {
      return node;
    }

    return getScrollParent(getParentNode(node));
  }

  /*
  given a DOM element, return the list of all scroll parents, up the list of ancesors
  until we get to the top window object. This list is what we attach scroll listeners
  to, because if any of these parent elements scroll, we'll need to re-calculate the
  reference element's position.
  */

  function listScrollParents(element, list) {
    var _element$ownerDocumen;

    if (list === void 0) {
      list = [];
    }

    var scrollParent = getScrollParent(element);
    var isBody =
      scrollParent ===
      ((_element$ownerDocumen = element.ownerDocument) == null
        ? void 0
        : _element$ownerDocumen.body);
    var win = getWindow(scrollParent);
    var target = isBody
      ? [win].concat(
          win.visualViewport || [],
          isScrollParent(scrollParent) ? scrollParent : [],
        )
      : scrollParent;
    var updatedList = list.concat(target);
    return isBody
      ? updatedList // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
      : updatedList.concat(listScrollParents(getParentNode(target)));
  }

  function isTableElement(element) {
    return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
  }

  function getTrueOffsetParent(element) {
    if (
      !isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
      getComputedStyle(element).position === "fixed"
    ) {
      return null;
    }

    return element.offsetParent;
  } // `.offsetParent` reports `null` for fixed elements, while absolute elements
  // return the containing block

  function getContainingBlock(element) {
    var isFirefox = /firefox/i.test(getUAString());
    var isIE = /Trident/i.test(getUAString());

    if (isIE && isHTMLElement(element)) {
      // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
      var elementCss = getComputedStyle(element);

      if (elementCss.position === "fixed") {
        return null;
      }
    }

    var currentNode = getParentNode(element);

    if (isShadowRoot(currentNode)) {
      currentNode = currentNode.host;
    }

    while (
      isHTMLElement(currentNode) &&
      ["html", "body"].indexOf(getNodeName(currentNode)) < 0
    ) {
      var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
      // create a containing block.
      // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

      if (
        css.transform !== "none" ||
        css.perspective !== "none" ||
        css.contain === "paint" ||
        ["transform", "perspective"].indexOf(css.willChange) !== -1 ||
        (isFirefox && css.willChange === "filter") ||
        (isFirefox && css.filter && css.filter !== "none")
      ) {
        return currentNode;
      } else {
        currentNode = currentNode.parentNode;
      }
    }

    return null;
  } // Gets the closest ancestor positioned element. Handles some edge cases,
  // such as table ancestors and cross browser bugs.

  function getOffsetParent(element) {
    var window = getWindow(element);
    var offsetParent = getTrueOffsetParent(element);

    while (
      offsetParent &&
      isTableElement(offsetParent) &&
      getComputedStyle(offsetParent).position === "static"
    ) {
      offsetParent = getTrueOffsetParent(offsetParent);
    }

    if (
      offsetParent &&
      (getNodeName(offsetParent) === "html" ||
        (getNodeName(offsetParent) === "body" &&
          getComputedStyle(offsetParent).position === "static"))
    ) {
      return window;
    }

    return offsetParent || getContainingBlock(element) || window;
  }

  var top = "top";
  var bottom = "bottom";
  var right = "right";
  var left = "left";
  var auto = "auto";
  var basePlacements = [top, bottom, right, left];
  var start = "start";
  var end = "end";
  var clippingParents = "clippingParents";
  var viewport = "viewport";
  var popper = "popper";
  var reference = "reference";
  var variationPlacements = /*#__PURE__*/ basePlacements.reduce(function (
    acc,
    placement,
  ) {
    return acc.concat([placement + "-" + start, placement + "-" + end]);
  }, []);
  var placements = /*#__PURE__*/ []
    .concat(basePlacements, [auto])
    .reduce(function (acc, placement) {
      return acc.concat([
        placement,
        placement + "-" + start,
        placement + "-" + end,
      ]);
    }, []); // modifiers that need to read the DOM

  var beforeRead = "beforeRead";
  var read = "read";
  var afterRead = "afterRead"; // pure-logic modifiers

  var beforeMain = "beforeMain";
  var main = "main";
  var afterMain = "afterMain"; // modifier with the purpose to write to the DOM (or write into a framework state)

  var beforeWrite = "beforeWrite";
  var write = "write";
  var afterWrite = "afterWrite";
  var modifierPhases = [
    beforeRead,
    read,
    afterRead,
    beforeMain,
    main,
    afterMain,
    beforeWrite,
    write,
    afterWrite,
  ];

  function order(modifiers) {
    var map = new Map();
    var visited = new Set();
    var result = [];
    modifiers.forEach(function (modifier) {
      map.set(modifier.name, modifier);
    }); // On visiting object, check for its dependencies and visit them recursively

    function sort(modifier) {
      visited.add(modifier.name);
      var requires = [].concat(
        modifier.requires || [],
        modifier.requiresIfExists || [],
      );
      requires.forEach(function (dep) {
        if (!visited.has(dep)) {
          var depModifier = map.get(dep);

          if (depModifier) {
            sort(depModifier);
          }
        }
      });
      result.push(modifier);
    }

    modifiers.forEach(function (modifier) {
      if (!visited.has(modifier.name)) {
        // check for visited object
        sort(modifier);
      }
    });
    return result;
  }

  function orderModifiers(modifiers) {
    // order based on dependencies
    var orderedModifiers = order(modifiers); // order based on phase

    return modifierPhases.reduce(function (acc, phase) {
      return acc.concat(
        orderedModifiers.filter(function (modifier) {
          return modifier.phase === phase;
        }),
      );
    }, []);
  }

  function debounce(fn) {
    var pending;
    return function () {
      if (!pending) {
        pending = new Promise(function (resolve) {
          Promise.resolve().then(function () {
            pending = undefined;
            resolve(fn());
          });
        });
      }

      return pending;
    };
  }

  function mergeByName(modifiers) {
    var merged = modifiers.reduce(function (merged, current) {
      var existing = merged[current.name];
      merged[current.name] = existing
        ? Object.assign({}, existing, current, {
            options: Object.assign({}, existing.options, current.options),
            data: Object.assign({}, existing.data, current.data),
          })
        : current;
      return merged;
    }, {}); // IE11 does not support Object.values

    return Object.keys(merged).map(function (key) {
      return merged[key];
    });
  }

  function getViewportRect(element, strategy) {
    var win = getWindow(element);
    var html = getDocumentElement(element);
    var visualViewport = win.visualViewport;
    var width = html.clientWidth;
    var height = html.clientHeight;
    var x = 0;
    var y = 0;

    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      var layoutViewport = isLayoutViewport();

      if (layoutViewport || (!layoutViewport && strategy === "fixed")) {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }

    return {
      width: width,
      height: height,
      x: x + getWindowScrollBarX(element),
      y: y,
    };
  }

  // of the `<html>` and `<body>` rect bounds if horizontally scrollable

  function getDocumentRect(element) {
    var _element$ownerDocumen;

    var html = getDocumentElement(element);
    var winScroll = getWindowScroll(element);
    var body =
      (_element$ownerDocumen = element.ownerDocument) == null
        ? void 0
        : _element$ownerDocumen.body;
    var width = max(
      html.scrollWidth,
      html.clientWidth,
      body ? body.scrollWidth : 0,
      body ? body.clientWidth : 0,
    );
    var height = max(
      html.scrollHeight,
      html.clientHeight,
      body ? body.scrollHeight : 0,
      body ? body.clientHeight : 0,
    );
    var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
    var y = -winScroll.scrollTop;

    if (getComputedStyle(body || html).direction === "rtl") {
      x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
    }

    return {
      width: width,
      height: height,
      x: x,
      y: y,
    };
  }

  function contains(parent, child) {
    var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

    if (parent.contains(child)) {
      return true;
    } // then fallback to custom implementation with Shadow DOM support
    else if (rootNode && isShadowRoot(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...

        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false

    return false;
  }

  function rectToClientRect(rect) {
    return Object.assign({}, rect, {
      left: rect.x,
      top: rect.y,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height,
    });
  }

  function getInnerBoundingClientRect(element, strategy) {
    var rect = getBoundingClientRect(element, false, strategy === "fixed");
    rect.top = rect.top + element.clientTop;
    rect.left = rect.left + element.clientLeft;
    rect.bottom = rect.top + element.clientHeight;
    rect.right = rect.left + element.clientWidth;
    rect.width = element.clientWidth;
    rect.height = element.clientHeight;
    rect.x = rect.left;
    rect.y = rect.top;
    return rect;
  }

  function getClientRectFromMixedType(element, clippingParent, strategy) {
    return clippingParent === viewport
      ? rectToClientRect(getViewportRect(element, strategy))
      : isElement(clippingParent)
        ? getInnerBoundingClientRect(clippingParent, strategy)
        : rectToClientRect(getDocumentRect(getDocumentElement(element)));
  } // A "clipping parent" is an overflowable container with the characteristic of
  // clipping (or hiding) overflowing elements with a position different from
  // `initial`

  function getClippingParents(element) {
    var clippingParents = listScrollParents(getParentNode(element));
    var canEscapeClipping =
      ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
    var clipperElement =
      canEscapeClipping && isHTMLElement(element)
        ? getOffsetParent(element)
        : element;

    if (!isElement(clipperElement)) {
      return [];
    } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414

    return clippingParents.filter(function (clippingParent) {
      return (
        isElement(clippingParent) &&
        contains(clippingParent, clipperElement) &&
        getNodeName(clippingParent) !== "body"
      );
    });
  } // Gets the maximum area that the element is visible in due to any number of
  // clipping parents

  function getClippingRect(element, boundary, rootBoundary, strategy) {
    var mainClippingParents =
      boundary === "clippingParents"
        ? getClippingParents(element)
        : [].concat(boundary);
    var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
    var firstClippingParent = clippingParents[0];
    var clippingRect = clippingParents.reduce(
      function (accRect, clippingParent) {
        var rect = getClientRectFromMixedType(
          element,
          clippingParent,
          strategy,
        );
        accRect.top = max(rect.top, accRect.top);
        accRect.right = min(rect.right, accRect.right);
        accRect.bottom = min(rect.bottom, accRect.bottom);
        accRect.left = max(rect.left, accRect.left);
        return accRect;
      },
      getClientRectFromMixedType(element, firstClippingParent, strategy),
    );
    clippingRect.width = clippingRect.right - clippingRect.left;
    clippingRect.height = clippingRect.bottom - clippingRect.top;
    clippingRect.x = clippingRect.left;
    clippingRect.y = clippingRect.top;
    return clippingRect;
  }

  function getBasePlacement(placement) {
    return placement.split("-")[0];
  }

  function getVariation(placement) {
    return placement.split("-")[1];
  }

  function getMainAxisFromPlacement(placement) {
    return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
  }

  function computeOffsets(_ref) {
    var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
    var basePlacement = placement ? getBasePlacement(placement) : null;
    var variation = placement ? getVariation(placement) : null;
    var commonX = reference.x + reference.width / 2 - element.width / 2;
    var commonY = reference.y + reference.height / 2 - element.height / 2;
    var offsets;

    switch (basePlacement) {
      case top:
        offsets = {
          x: commonX,
          y: reference.y - element.height,
        };
        break;

      case bottom:
        offsets = {
          x: commonX,
          y: reference.y + reference.height,
        };
        break;

      case right:
        offsets = {
          x: reference.x + reference.width,
          y: commonY,
        };
        break;

      case left:
        offsets = {
          x: reference.x - element.width,
          y: commonY,
        };
        break;

      default:
        offsets = {
          x: reference.x,
          y: reference.y,
        };
    }

    var mainAxis = basePlacement
      ? getMainAxisFromPlacement(basePlacement)
      : null;

    if (mainAxis != null) {
      var len = mainAxis === "y" ? "height" : "width";

      switch (variation) {
        case start:
          offsets[mainAxis] =
            offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
          break;

        case end:
          offsets[mainAxis] =
            offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
          break;
      }
    }

    return offsets;
  }

  function getFreshSideObject() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
  }

  function mergePaddingObject(paddingObject) {
    return Object.assign({}, getFreshSideObject(), paddingObject);
  }

  function expandToHashMap(value, keys) {
    return keys.reduce(function (hashMap, key) {
      hashMap[key] = value;
      return hashMap;
    }, {});
  }

  function detectOverflow(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
      _options$placement = _options.placement,
      placement =
        _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy =
        _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary =
        _options$boundary === void 0 ? clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary =
        _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext =
        _options$elementConte === void 0 ? popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary =
        _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
    var paddingObject = mergePaddingObject(
      typeof padding !== "number"
        ? padding
        : expandToHashMap(padding, basePlacements),
    );
    var altContext = elementContext === popper ? reference : popper;
    var popperRect = state.rects.popper;
    var element = state.elements[altBoundary ? altContext : elementContext];
    var clippingClientRect = getClippingRect(
      isElement(element)
        ? element
        : element.contextElement || getDocumentElement(state.elements.popper),
      boundary,
      rootBoundary,
      strategy,
    );
    var referenceClientRect = getBoundingClientRect(state.elements.reference);
    var popperOffsets = computeOffsets({
      reference: referenceClientRect,
      element: popperRect,
      strategy: "absolute",
      placement: placement,
    });
    var popperClientRect = rectToClientRect(
      Object.assign({}, popperRect, popperOffsets),
    );
    var elementClientRect =
      elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
    // 0 or negative = within the clipping rect

    var overflowOffsets = {
      top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
      bottom:
        elementClientRect.bottom -
        clippingClientRect.bottom +
        paddingObject.bottom,
      left:
        clippingClientRect.left - elementClientRect.left + paddingObject.left,
      right:
        elementClientRect.right -
        clippingClientRect.right +
        paddingObject.right,
    };
    var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

    if (elementContext === popper && offsetData) {
      var offset = offsetData[placement];
      Object.keys(overflowOffsets).forEach(function (key) {
        var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
        var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
        overflowOffsets[key] += offset[axis] * multiply;
      });
    }

    return overflowOffsets;
  }

  var DEFAULT_OPTIONS = {
    placement: "bottom",
    modifiers: [],
    strategy: "absolute",
  };

  function areValidElements() {
    for (
      var _len = arguments.length, args = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    return !args.some(function (element) {
      return !(element && typeof element.getBoundingClientRect === "function");
    });
  }

  function popperGenerator(generatorOptions) {
    if (generatorOptions === void 0) {
      generatorOptions = {};
    }

    var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers =
        _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions =
        _generatorOptions$def2 === void 0
          ? DEFAULT_OPTIONS
          : _generatorOptions$def2;
    return function createPopper(reference, popper, options) {
      if (options === void 0) {
        options = defaultOptions;
      }

      var state = {
        placement: "bottom",
        orderedModifiers: [],
        options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
        modifiersData: {},
        elements: {
          reference: reference,
          popper: popper,
        },
        attributes: {},
        styles: {},
      };
      var effectCleanupFns = [];
      var isDestroyed = false;
      var instance = {
        state: state,
        setOptions: function setOptions(setOptionsAction) {
          var options =
            typeof setOptionsAction === "function"
              ? setOptionsAction(state.options)
              : setOptionsAction;
          cleanupModifierEffects();
          state.options = Object.assign(
            {},
            defaultOptions,
            state.options,
            options,
          );
          state.scrollParents = {
            reference: isElement(reference)
              ? listScrollParents(reference)
              : reference.contextElement
                ? listScrollParents(reference.contextElement)
                : [],
            popper: listScrollParents(popper),
          }; // Orders the modifiers based on their dependencies and `phase`
          // properties

          var orderedModifiers = orderModifiers(
            mergeByName([].concat(defaultModifiers, state.options.modifiers)),
          ); // Strip out disabled modifiers

          state.orderedModifiers = orderedModifiers.filter(function (m) {
            return m.enabled;
          });
          runModifierEffects();
          return instance.update();
        },
        // Sync update – it will always be executed, even if not necessary. This
        // is useful for low frequency updates where sync behavior simplifies the
        // logic.
        // For high frequency updates (e.g. `resize` and `scroll` events), always
        // prefer the async Popper#update method
        forceUpdate: function forceUpdate() {
          if (isDestroyed) {
            return;
          }

          var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
          // anymore

          if (!areValidElements(reference, popper)) {
            return;
          } // Store the reference and popper rects to be read by modifiers

          state.rects = {
            reference: getCompositeRect(
              reference,
              getOffsetParent(popper),
              state.options.strategy === "fixed",
            ),
            popper: getLayoutRect(popper),
          }; // Modifiers have the ability to reset the current update cycle. The
          // most common use case for this is the `flip` modifier changing the
          // placement, which then needs to re-run all the modifiers, because the
          // logic was previously ran for the previous placement and is therefore
          // stale/incorrect

          state.reset = false;
          state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
          // is filled with the initial data specified by the modifier. This means
          // it doesn't persist and is fresh on each update.
          // To ensure persistent data, use `${name}#persistent`

          state.orderedModifiers.forEach(function (modifier) {
            return (state.modifiersData[modifier.name] = Object.assign(
              {},
              modifier.data,
            ));
          });

          for (var index = 0; index < state.orderedModifiers.length; index++) {
            if (state.reset === true) {
              state.reset = false;
              index = -1;
              continue;
            }

            var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options =
                _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

            if (typeof fn === "function") {
              state =
                fn({
                  state: state,
                  options: _options,
                  name: name,
                  instance: instance,
                }) || state;
            }
          }
        },
        // Async and optimistically optimized update – it will not be executed if
        // not necessary (debounced to run at most once-per-tick)
        update: debounce(function () {
          return new Promise(function (resolve) {
            instance.forceUpdate();
            resolve(state);
          });
        }),
        destroy: function destroy() {
          cleanupModifierEffects();
          isDestroyed = true;
        },
      };

      if (!areValidElements(reference, popper)) {
        return instance;
      }

      instance.setOptions(options).then(function (state) {
        if (!isDestroyed && options.onFirstUpdate) {
          options.onFirstUpdate(state);
        }
      }); // Modifiers have the ability to execute arbitrary code before the first
      // update cycle runs. They will be executed in the same order as the update
      // cycle. This is useful when a modifier adds some persistent data that
      // other modifiers need to use, but the modifier is run after the dependent
      // one.

      function runModifierEffects() {
        state.orderedModifiers.forEach(function (_ref) {
          var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

          if (typeof effect === "function") {
            var cleanupFn = effect({
              state: state,
              name: name,
              instance: instance,
              options: options,
            });

            var noopFn = function noopFn() {};

            effectCleanupFns.push(cleanupFn || noopFn);
          }
        });
      }

      function cleanupModifierEffects() {
        effectCleanupFns.forEach(function (fn) {
          return fn();
        });
        effectCleanupFns = [];
      }

      return instance;
    };
  }

  var passive = {
    passive: true,
  };

  function effect$2(_ref) {
    var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
    var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
    var window = getWindow(state.elements.popper);
    var scrollParents = [].concat(
      state.scrollParents.reference,
      state.scrollParents.popper,
    );

    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.addEventListener("scroll", instance.update, passive);
      });
    }

    if (resize) {
      window.addEventListener("resize", instance.update, passive);
    }

    return function () {
      if (scroll) {
        scrollParents.forEach(function (scrollParent) {
          scrollParent.removeEventListener("scroll", instance.update, passive);
        });
      }

      if (resize) {
        window.removeEventListener("resize", instance.update, passive);
      }
    };
  } // eslint-disable-next-line import/no-unused-modules

  var eventListeners = {
    name: "eventListeners",
    enabled: true,
    phase: "write",
    fn: function fn() {},
    effect: effect$2,
    data: {},
  };

  function popperOffsets(_ref) {
    var state = _ref.state,
      name = _ref.name;
    // Offsets are the actual position the popper needs to have to be
    // properly positioned near its reference element
    // This is the most basic placement, and will be adjusted by
    // the modifiers in the next step
    state.modifiersData[name] = computeOffsets({
      reference: state.rects.reference,
      element: state.rects.popper,
      strategy: "absolute",
      placement: state.placement,
    });
  } // eslint-disable-next-line import/no-unused-modules

  var popperOffsets$1 = {
    name: "popperOffsets",
    enabled: true,
    phase: "read",
    fn: popperOffsets,
    data: {},
  };

  var unsetSides = {
    top: "auto",
    right: "auto",
    bottom: "auto",
    left: "auto",
  }; // Round the offsets to the nearest suitable subpixel based on the DPR.
  // Zooming can change the DPR, but it seems to report a value that will
  // cleanly divide the values into the appropriate subpixels.

  function roundOffsetsByDPR(_ref, win) {
    var x = _ref.x,
      y = _ref.y;
    var dpr = win.devicePixelRatio || 1;
    return {
      x: round(x * dpr) / dpr || 0,
      y: round(y * dpr) / dpr || 0,
    };
  }

  function mapToStyles(_ref2) {
    var _Object$assign2;

    var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
    var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

    var _ref3 =
      typeof roundOffsets === "function"
        ? roundOffsets({
            x: x,
            y: y,
          })
        : {
            x: x,
            y: y,
          };

    x = _ref3.x;
    y = _ref3.y;
    var hasX = offsets.hasOwnProperty("x");
    var hasY = offsets.hasOwnProperty("y");
    var sideX = left;
    var sideY = top;
    var win = window;

    if (adaptive) {
      var offsetParent = getOffsetParent(popper);
      var heightProp = "clientHeight";
      var widthProp = "clientWidth";

      if (offsetParent === getWindow(popper)) {
        offsetParent = getDocumentElement(popper);

        if (
          getComputedStyle(offsetParent).position !== "static" &&
          position === "absolute"
        ) {
          heightProp = "scrollHeight";
          widthProp = "scrollWidth";
        }
      } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it

      offsetParent = offsetParent;

      if (
        placement === top ||
        ((placement === left || placement === right) && variation === end)
      ) {
        sideY = bottom;
        var offsetY =
          isFixed && offsetParent === win && win.visualViewport
            ? win.visualViewport.height // $FlowFixMe[prop-missing]
            : offsetParent[heightProp];
        y -= offsetY - popperRect.height;
        y *= gpuAcceleration ? 1 : -1;
      }

      if (
        placement === left ||
        ((placement === top || placement === bottom) && variation === end)
      ) {
        sideX = right;
        var offsetX =
          isFixed && offsetParent === win && win.visualViewport
            ? win.visualViewport.width // $FlowFixMe[prop-missing]
            : offsetParent[widthProp];
        x -= offsetX - popperRect.width;
        x *= gpuAcceleration ? 1 : -1;
      }
    }

    var commonStyles = Object.assign(
      {
        position: position,
      },
      adaptive && unsetSides,
    );

    var _ref4 =
      roundOffsets === true
        ? roundOffsetsByDPR(
            {
              x: x,
              y: y,
            },
            getWindow(popper),
          )
        : {
            x: x,
            y: y,
          };

    x = _ref4.x;
    y = _ref4.y;

    if (gpuAcceleration) {
      var _Object$assign;

      return Object.assign(
        {},
        commonStyles,
        ((_Object$assign = {}),
        (_Object$assign[sideY] = hasY ? "0" : ""),
        (_Object$assign[sideX] = hasX ? "0" : ""),
        (_Object$assign.transform =
          (win.devicePixelRatio || 1) <= 1
            ? "translate(" + x + "px, " + y + "px)"
            : "translate3d(" + x + "px, " + y + "px, 0)"),
        _Object$assign),
      );
    }

    return Object.assign(
      {},
      commonStyles,
      ((_Object$assign2 = {}),
      (_Object$assign2[sideY] = hasY ? y + "px" : ""),
      (_Object$assign2[sideX] = hasX ? x + "px" : ""),
      (_Object$assign2.transform = ""),
      _Object$assign2),
    );
  }

  function computeStyles(_ref5) {
    var state = _ref5.state,
      options = _ref5.options;
    var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration =
        _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets =
        _options$roundOffsets === void 0 ? true : _options$roundOffsets;
    var commonStyles = {
      placement: getBasePlacement(state.placement),
      variation: getVariation(state.placement),
      popper: state.elements.popper,
      popperRect: state.rects.popper,
      gpuAcceleration: gpuAcceleration,
      isFixed: state.options.strategy === "fixed",
    };

    if (state.modifiersData.popperOffsets != null) {
      state.styles.popper = Object.assign(
        {},
        state.styles.popper,
        mapToStyles(
          Object.assign({}, commonStyles, {
            offsets: state.modifiersData.popperOffsets,
            position: state.options.strategy,
            adaptive: adaptive,
            roundOffsets: roundOffsets,
          }),
        ),
      );
    }

    if (state.modifiersData.arrow != null) {
      state.styles.arrow = Object.assign(
        {},
        state.styles.arrow,
        mapToStyles(
          Object.assign({}, commonStyles, {
            offsets: state.modifiersData.arrow,
            position: "absolute",
            adaptive: false,
            roundOffsets: roundOffsets,
          }),
        ),
      );
    }

    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      "data-popper-placement": state.placement,
    });
  } // eslint-disable-next-line import/no-unused-modules

  var computeStyles$1 = {
    name: "computeStyles",
    enabled: true,
    phase: "beforeWrite",
    fn: computeStyles,
    data: {},
  };

  // and applies them to the HTMLElements such as popper and arrow

  function applyStyles(_ref) {
    var state = _ref.state;
    Object.keys(state.elements).forEach(function (name) {
      var style = state.styles[name] || {};
      var attributes = state.attributes[name] || {};
      var element = state.elements[name]; // arrow is optional + virtual elements

      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      } // Flow doesn't support to extend this property, but it's the most
      // effective way to apply styles to an HTMLElement
      // $FlowFixMe[cannot-write]

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (name) {
        var value = attributes[name];

        if (value === false) {
          element.removeAttribute(name);
        } else {
          element.setAttribute(name, value === true ? "" : value);
        }
      });
    });
  }

  function effect$1(_ref2) {
    var state = _ref2.state;
    var initialStyles = {
      popper: {
        position: state.options.strategy,
        left: "0",
        top: "0",
        margin: "0",
      },
      arrow: {
        position: "absolute",
      },
      reference: {},
    };
    Object.assign(state.elements.popper.style, initialStyles.popper);
    state.styles = initialStyles;

    if (state.elements.arrow) {
      Object.assign(state.elements.arrow.style, initialStyles.arrow);
    }

    return function () {
      Object.keys(state.elements).forEach(function (name) {
        var element = state.elements[name];
        var attributes = state.attributes[name] || {};
        var styleProperties = Object.keys(
          state.styles.hasOwnProperty(name)
            ? state.styles[name]
            : initialStyles[name],
        ); // Set all values to an empty string to unset them

        var style = styleProperties.reduce(function (style, property) {
          style[property] = "";
          return style;
        }, {}); // arrow is optional + virtual elements

        if (!isHTMLElement(element) || !getNodeName(element)) {
          return;
        }

        Object.assign(element.style, style);
        Object.keys(attributes).forEach(function (attribute) {
          element.removeAttribute(attribute);
        });
      });
    };
  } // eslint-disable-next-line import/no-unused-modules

  var applyStyles$1 = {
    name: "applyStyles",
    enabled: true,
    phase: "write",
    fn: applyStyles,
    effect: effect$1,
    requires: ["computeStyles"],
  };

  function distanceAndSkiddingToXY(placement, rects, offset) {
    var basePlacement = getBasePlacement(placement);
    var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

    var _ref =
        typeof offset === "function"
          ? offset(
              Object.assign({}, rects, {
                placement: placement,
              }),
            )
          : offset,
      skidding = _ref[0],
      distance = _ref[1];

    skidding = skidding || 0;
    distance = (distance || 0) * invertDistance;
    return [left, right].indexOf(basePlacement) >= 0
      ? {
          x: distance,
          y: skidding,
        }
      : {
          x: skidding,
          y: distance,
        };
  }

  function offset(_ref2) {
    var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
    var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
    var data = placements.reduce(function (acc, placement) {
      acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
      return acc;
    }, {});
    var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

    if (state.modifiersData.popperOffsets != null) {
      state.modifiersData.popperOffsets.x += x;
      state.modifiersData.popperOffsets.y += y;
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules

  var offset$1 = {
    name: "offset",
    enabled: true,
    phase: "main",
    requires: ["popperOffsets"],
    fn: offset,
  };

  var hash$1 = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom",
  };
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, function (matched) {
      return hash$1[matched];
    });
  }

  var hash = {
    start: "end",
    end: "start",
  };
  function getOppositeVariationPlacement(placement) {
    return placement.replace(/start|end/g, function (matched) {
      return hash[matched];
    });
  }

  function computeAutoPlacement(state, options) {
    if (options === void 0) {
      options = {};
    }

    var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements =
        _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
    var variation = getVariation(placement);
    var placements$1 = variation
      ? flipVariations
        ? variationPlacements
        : variationPlacements.filter(function (placement) {
            return getVariation(placement) === variation;
          })
      : basePlacements;
    var allowedPlacements = placements$1.filter(function (placement) {
      return allowedAutoPlacements.indexOf(placement) >= 0;
    });

    if (allowedPlacements.length === 0) {
      allowedPlacements = placements$1;
    } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...

    var overflows = allowedPlacements.reduce(function (acc, placement) {
      acc[placement] = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        padding: padding,
      })[getBasePlacement(placement)];
      return acc;
    }, {});
    return Object.keys(overflows).sort(function (a, b) {
      return overflows[a] - overflows[b];
    });
  }

  function getExpandedFallbackPlacements(placement) {
    if (getBasePlacement(placement) === auto) {
      return [];
    }

    var oppositePlacement = getOppositePlacement(placement);
    return [
      getOppositeVariationPlacement(placement),
      oppositePlacement,
      getOppositeVariationPlacement(oppositePlacement),
    ];
  }

  function flip(_ref) {
    var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

    if (state.modifiersData[name]._skip) {
      return;
    }

    var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations =
        _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
    var preferredPlacement = state.options.placement;
    var basePlacement = getBasePlacement(preferredPlacement);
    var isBasePlacement = basePlacement === preferredPlacement;
    var fallbackPlacements =
      specifiedFallbackPlacements ||
      (isBasePlacement || !flipVariations
        ? [getOppositePlacement(preferredPlacement)]
        : getExpandedFallbackPlacements(preferredPlacement));
    var placements = [preferredPlacement]
      .concat(fallbackPlacements)
      .reduce(function (acc, placement) {
        return acc.concat(
          getBasePlacement(placement) === auto
            ? computeAutoPlacement(state, {
                placement: placement,
                boundary: boundary,
                rootBoundary: rootBoundary,
                padding: padding,
                flipVariations: flipVariations,
                allowedAutoPlacements: allowedAutoPlacements,
              })
            : placement,
        );
      }, []);
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var checksMap = new Map();
    var makeFallbackChecks = true;
    var firstFittingPlacement = placements[0];

    for (var i = 0; i < placements.length; i++) {
      var placement = placements[i];

      var _basePlacement = getBasePlacement(placement);

      var isStartVariation = getVariation(placement) === start;
      var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
      var len = isVertical ? "width" : "height";
      var overflow = detectOverflow(state, {
        placement: placement,
        boundary: boundary,
        rootBoundary: rootBoundary,
        altBoundary: altBoundary,
        padding: padding,
      });
      var mainVariationSide = isVertical
        ? isStartVariation
          ? right
          : left
        : isStartVariation
          ? bottom
          : top;

      if (referenceRect[len] > popperRect[len]) {
        mainVariationSide = getOppositePlacement(mainVariationSide);
      }

      var altVariationSide = getOppositePlacement(mainVariationSide);
      var checks = [];

      if (checkMainAxis) {
        checks.push(overflow[_basePlacement] <= 0);
      }

      if (checkAltAxis) {
        checks.push(
          overflow[mainVariationSide] <= 0,
          overflow[altVariationSide] <= 0,
        );
      }

      if (
        checks.every(function (check) {
          return check;
        })
      ) {
        firstFittingPlacement = placement;
        makeFallbackChecks = false;
        break;
      }

      checksMap.set(placement, checks);
    }

    if (makeFallbackChecks) {
      // `2` may be desired in some cases – research later
      var numberOfChecks = flipVariations ? 3 : 1;

      var _loop = function _loop(_i) {
        var fittingPlacement = placements.find(function (placement) {
          var checks = checksMap.get(placement);

          if (checks) {
            return checks.slice(0, _i).every(function (check) {
              return check;
            });
          }
        });

        if (fittingPlacement) {
          firstFittingPlacement = fittingPlacement;
          return "break";
        }
      };

      for (var _i = numberOfChecks; _i > 0; _i--) {
        var _ret = _loop(_i);

        if (_ret === "break") break;
      }
    }

    if (state.placement !== firstFittingPlacement) {
      state.modifiersData[name]._skip = true;
      state.placement = firstFittingPlacement;
      state.reset = true;
    }
  } // eslint-disable-next-line import/no-unused-modules

  var flip$1 = {
    name: "flip",
    enabled: true,
    phase: "main",
    fn: flip,
    requiresIfExists: ["offset"],
    data: {
      _skip: false,
    },
  };

  function getAltAxis(axis) {
    return axis === "x" ? "y" : "x";
  }

  function within(min$1, value, max$1) {
    return max(min$1, min(value, max$1));
  }
  function withinMaxClamp(min, value, max) {
    var v = within(min, value, max);
    return v > max ? max : v;
  }

  function preventOverflow(_ref) {
    var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
    var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset =
        _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
    var overflow = detectOverflow(state, {
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      altBoundary: altBoundary,
    });
    var basePlacement = getBasePlacement(state.placement);
    var variation = getVariation(state.placement);
    var isBasePlacement = !variation;
    var mainAxis = getMainAxisFromPlacement(basePlacement);
    var altAxis = getAltAxis(mainAxis);
    var popperOffsets = state.modifiersData.popperOffsets;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var tetherOffsetValue =
      typeof tetherOffset === "function"
        ? tetherOffset(
            Object.assign({}, state.rects, {
              placement: state.placement,
            }),
          )
        : tetherOffset;
    var normalizedTetherOffsetValue =
      typeof tetherOffsetValue === "number"
        ? {
            mainAxis: tetherOffsetValue,
            altAxis: tetherOffsetValue,
          }
        : Object.assign(
            {
              mainAxis: 0,
              altAxis: 0,
            },
            tetherOffsetValue,
          );
    var offsetModifierState = state.modifiersData.offset
      ? state.modifiersData.offset[state.placement]
      : null;
    var data = {
      x: 0,
      y: 0,
    };

    if (!popperOffsets) {
      return;
    }

    if (checkMainAxis) {
      var _offsetModifierState$;

      var mainSide = mainAxis === "y" ? top : left;
      var altSide = mainAxis === "y" ? bottom : right;
      var len = mainAxis === "y" ? "height" : "width";
      var offset = popperOffsets[mainAxis];
      var min$1 = offset + overflow[mainSide];
      var max$1 = offset - overflow[altSide];
      var additive = tether ? -popperRect[len] / 2 : 0;
      var minLen = variation === start ? referenceRect[len] : popperRect[len];
      var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
      // outside the reference bounds

      var arrowElement = state.elements.arrow;
      var arrowRect =
        tether && arrowElement
          ? getLayoutRect(arrowElement)
          : {
              width: 0,
              height: 0,
            };
      var arrowPaddingObject = state.modifiersData["arrow#persistent"]
        ? state.modifiersData["arrow#persistent"].padding
        : getFreshSideObject();
      var arrowPaddingMin = arrowPaddingObject[mainSide];
      var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
      // to include its full size in the calculation. If the reference is small
      // and near the edge of a boundary, the popper can overflow even if the
      // reference is not overflowing as well (e.g. virtual elements with no
      // width or height)

      var arrowLen = within(0, referenceRect[len], arrowRect[len]);
      var minOffset = isBasePlacement
        ? referenceRect[len] / 2 -
          additive -
          arrowLen -
          arrowPaddingMin -
          normalizedTetherOffsetValue.mainAxis
        : minLen -
          arrowLen -
          arrowPaddingMin -
          normalizedTetherOffsetValue.mainAxis;
      var maxOffset = isBasePlacement
        ? -referenceRect[len] / 2 +
          additive +
          arrowLen +
          arrowPaddingMax +
          normalizedTetherOffsetValue.mainAxis
        : maxLen +
          arrowLen +
          arrowPaddingMax +
          normalizedTetherOffsetValue.mainAxis;
      var arrowOffsetParent =
        state.elements.arrow && getOffsetParent(state.elements.arrow);
      var clientOffset = arrowOffsetParent
        ? mainAxis === "y"
          ? arrowOffsetParent.clientTop || 0
          : arrowOffsetParent.clientLeft || 0
        : 0;
      var offsetModifierValue =
        (_offsetModifierState$ =
          offsetModifierState == null
            ? void 0
            : offsetModifierState[mainAxis]) != null
          ? _offsetModifierState$
          : 0;
      var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
      var tetherMax = offset + maxOffset - offsetModifierValue;
      var preventedOffset = within(
        tether ? min(min$1, tetherMin) : min$1,
        offset,
        tether ? max(max$1, tetherMax) : max$1,
      );
      popperOffsets[mainAxis] = preventedOffset;
      data[mainAxis] = preventedOffset - offset;
    }

    if (checkAltAxis) {
      var _offsetModifierState$2;

      var _mainSide = mainAxis === "x" ? top : left;

      var _altSide = mainAxis === "x" ? bottom : right;

      var _offset = popperOffsets[altAxis];

      var _len = altAxis === "y" ? "height" : "width";

      var _min = _offset + overflow[_mainSide];

      var _max = _offset - overflow[_altSide];

      var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

      var _offsetModifierValue =
        (_offsetModifierState$2 =
          offsetModifierState == null
            ? void 0
            : offsetModifierState[altAxis]) != null
          ? _offsetModifierState$2
          : 0;

      var _tetherMin = isOriginSide
        ? _min
        : _offset -
          referenceRect[_len] -
          popperRect[_len] -
          _offsetModifierValue +
          normalizedTetherOffsetValue.altAxis;

      var _tetherMax = isOriginSide
        ? _offset +
          referenceRect[_len] +
          popperRect[_len] -
          _offsetModifierValue -
          normalizedTetherOffsetValue.altAxis
        : _max;

      var _preventedOffset =
        tether && isOriginSide
          ? withinMaxClamp(_tetherMin, _offset, _tetherMax)
          : within(
              tether ? _tetherMin : _min,
              _offset,
              tether ? _tetherMax : _max,
            );

      popperOffsets[altAxis] = _preventedOffset;
      data[altAxis] = _preventedOffset - _offset;
    }

    state.modifiersData[name] = data;
  } // eslint-disable-next-line import/no-unused-modules

  var preventOverflow$1 = {
    name: "preventOverflow",
    enabled: true,
    phase: "main",
    fn: preventOverflow,
    requiresIfExists: ["offset"],
  };

  var toPaddingObject = function toPaddingObject(padding, state) {
    padding =
      typeof padding === "function"
        ? padding(
            Object.assign({}, state.rects, {
              placement: state.placement,
            }),
          )
        : padding;
    return mergePaddingObject(
      typeof padding !== "number"
        ? padding
        : expandToHashMap(padding, basePlacements),
    );
  };

  function arrow(_ref) {
    var _state$modifiersData$;

    var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
    var arrowElement = state.elements.arrow;
    var popperOffsets = state.modifiersData.popperOffsets;
    var basePlacement = getBasePlacement(state.placement);
    var axis = getMainAxisFromPlacement(basePlacement);
    var isVertical = [left, right].indexOf(basePlacement) >= 0;
    var len = isVertical ? "height" : "width";

    if (!arrowElement || !popperOffsets) {
      return;
    }

    var paddingObject = toPaddingObject(options.padding, state);
    var arrowRect = getLayoutRect(arrowElement);
    var minProp = axis === "y" ? top : left;
    var maxProp = axis === "y" ? bottom : right;
    var endDiff =
      state.rects.reference[len] +
      state.rects.reference[axis] -
      popperOffsets[axis] -
      state.rects.popper[len];
    var startDiff = popperOffsets[axis] - state.rects.reference[axis];
    var arrowOffsetParent = getOffsetParent(arrowElement);
    var clientSize = arrowOffsetParent
      ? axis === "y"
        ? arrowOffsetParent.clientHeight || 0
        : arrowOffsetParent.clientWidth || 0
      : 0;
    var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
    // outside of the popper bounds

    var min = paddingObject[minProp];
    var max = clientSize - arrowRect[len] - paddingObject[maxProp];
    var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
    var offset = within(min, center, max); // Prevents breaking syntax highlighting...

    var axisProp = axis;
    state.modifiersData[name] =
      ((_state$modifiersData$ = {}),
      (_state$modifiersData$[axisProp] = offset),
      (_state$modifiersData$.centerOffset = offset - center),
      _state$modifiersData$);
  }

  function effect(_ref2) {
    var state = _ref2.state,
      options = _ref2.options;
    var _options$element = options.element,
      arrowElement =
        _options$element === void 0 ? "[data-popper-arrow]" : _options$element;

    if (arrowElement == null) {
      return;
    } // CSS selector

    if (typeof arrowElement === "string") {
      arrowElement = state.elements.popper.querySelector(arrowElement);

      if (!arrowElement) {
        return;
      }
    }

    if (!contains(state.elements.popper, arrowElement)) {
      return;
    }

    state.elements.arrow = arrowElement;
  } // eslint-disable-next-line import/no-unused-modules

  var arrow$1 = {
    name: "arrow",
    enabled: true,
    phase: "main",
    fn: arrow,
    effect: effect,
    requires: ["popperOffsets"],
    requiresIfExists: ["preventOverflow"],
  };

  function getSideOffsets(overflow, rect, preventedOffsets) {
    if (preventedOffsets === void 0) {
      preventedOffsets = {
        x: 0,
        y: 0,
      };
    }

    return {
      top: overflow.top - rect.height - preventedOffsets.y,
      right: overflow.right - rect.width + preventedOffsets.x,
      bottom: overflow.bottom - rect.height + preventedOffsets.y,
      left: overflow.left - rect.width - preventedOffsets.x,
    };
  }

  function isAnySideFullyClipped(overflow) {
    return [top, right, bottom, left].some(function (side) {
      return overflow[side] >= 0;
    });
  }

  function hide(_ref) {
    var state = _ref.state,
      name = _ref.name;
    var referenceRect = state.rects.reference;
    var popperRect = state.rects.popper;
    var preventedOffsets = state.modifiersData.preventOverflow;
    var referenceOverflow = detectOverflow(state, {
      elementContext: "reference",
    });
    var popperAltOverflow = detectOverflow(state, {
      altBoundary: true,
    });
    var referenceClippingOffsets = getSideOffsets(
      referenceOverflow,
      referenceRect,
    );
    var popperEscapeOffsets = getSideOffsets(
      popperAltOverflow,
      popperRect,
      preventedOffsets,
    );
    var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
    var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
    state.modifiersData[name] = {
      referenceClippingOffsets: referenceClippingOffsets,
      popperEscapeOffsets: popperEscapeOffsets,
      isReferenceHidden: isReferenceHidden,
      hasPopperEscaped: hasPopperEscaped,
    };
    state.attributes.popper = Object.assign({}, state.attributes.popper, {
      "data-popper-reference-hidden": isReferenceHidden,
      "data-popper-escaped": hasPopperEscaped,
    });
  } // eslint-disable-next-line import/no-unused-modules

  var hide$1 = {
    name: "hide",
    enabled: true,
    phase: "main",
    requiresIfExists: ["preventOverflow"],
    fn: hide,
  };

  var defaultModifiers$1 = [
    eventListeners,
    popperOffsets$1,
    computeStyles$1,
    applyStyles$1,
  ];
  var createPopper$1 = /*#__PURE__*/ popperGenerator({
    defaultModifiers: defaultModifiers$1,
  }); // eslint-disable-next-line import/no-unused-modules

  var defaultModifiers = [
    eventListeners,
    popperOffsets$1,
    computeStyles$1,
    applyStyles$1,
    offset$1,
    flip$1,
    preventOverflow$1,
    arrow$1,
    hide$1,
  ];
  var createPopper = /*#__PURE__*/ popperGenerator({
    defaultModifiers: defaultModifiers,
  }); // eslint-disable-next-line import/no-unused-modules

  exports.applyStyles = applyStyles$1;
  exports.arrow = arrow$1;
  exports.computeStyles = computeStyles$1;
  exports.createPopper = createPopper;
  exports.createPopperLite = createPopper$1;
  exports.defaultModifiers = defaultModifiers;
  exports.detectOverflow = detectOverflow;
  exports.eventListeners = eventListeners;
  exports.flip = flip$1;
  exports.hide = hide$1;
  exports.offset = offset$1;
  exports.popperGenerator = popperGenerator;
  exports.popperOffsets = popperOffsets$1;
  exports.preventOverflow = preventOverflow$1;

  Object.defineProperty(exports, "__esModule", { value: true });
});

;}
      } catch(e) { console.error(`  Error executing script ${scriptPath_zlhh3qvrbf}`, e); }
    

      const scriptPath_we18si99pl = "tippy-bundle.umd.min.js"; // Use JSON.stringify for safety
      console.log(`  Executing JS (end): ${scriptPath_we18si99pl}`);
      try {
          with(__globals){;/**!
 * tippy.js v6.3.7
 * (c) 2017-2021 atomiks
 * MIT License
 */
(function (global, factory) {
  typeof exports === "object" && typeof module !== "undefined"
    ? (module.exports = factory(require("@popperjs/core")))
    : typeof define === "function" && define.amd
      ? define(["@popperjs/core"], factory)
      : ((global = global || self), (global.tippy = factory(global.Popper)));
})(this, function (core) {
  debugger;
  console.log("Core", core);
});

;}
      } catch(e) { console.error(`  Error executing script ${scriptPath_we18si99pl}`, e); }
    

      const scriptPath_9lur7wdcz3w = "linkify.min.js"; // Use JSON.stringify for safety
      console.log(`  Executing JS (end): ${scriptPath_9lur7wdcz3w}`);
      try {
          with(__globals){;var linkify = (function (u) {
  "use strict";
  function D(u) {
    (this.j = {}), (this.jr = []), (this.jd = null), (this.t = u);
  }
  D.prototype = {
    accepts: function () {
      return !!this.t;
    },
    tt: function (u, D) {
      if (D && D.j) return (this.j[u] = D), D;
      var t = D,
        a = this.j[u];
      if (a) return t && (a.t = t), a;
      a = e();
      var r = i(this, u);
      return (
        r
          ? (Object.assign(a.j, r.j),
            a.jr.append(r.jr),
            (a.jr = r.jd),
            (a.t = t || r.t))
          : (a.t = t),
        (this.j[u] = a),
        a
      );
    },
  };
  var e = function () {
      return new D();
    },
    t = function (u) {
      return new D(u);
    },
    a = function (u, D, e) {
      u.j[D] || (u.j[D] = e);
    },
    r = function (u, D, e) {
      u.jr.push([D, e]);
    },
    i = function (u, D) {
      var e = u.j[D];
      if (e) return e;
      for (var t = 0; t < u.jr.length; t++) {
        var a = u.jr[t][0],
          r = u.jr[t][1];
        if (a.test(D)) return r;
      }
      return u.jd;
    },
    n = function (u, D, e) {
      for (var t = 0; t < D.length; t++) a(u, D[t], e);
    },
    o = function (u, D) {
      for (var e = 0; e < D.length; e++) {
        var t = D[e][0],
          r = D[e][1];
        a(u, t, r);
      }
    },
    s = function (u, D, e, t) {
      for (var r, i = 0, n = D.length; i < n && (r = u.j[D[i]]); ) (u = r), i++;
      if (i >= n) return [];
      for (; i < n - 1; ) (r = t()), a(u, D[i], r), (u = r), i++;
      a(u, D[n - 1], e);
    },
    l = "DOMAIN",
    c = "LOCALHOST",
    F = "TLD",
    A = "NUM",
    E = "PROTOCOL",
    C = "MAILTO",
    g = "WS",
    h = "NL",
    f = "OPENBRACE",
    m = "OPENBRACKET",
    d = "OPENANGLEBRACKET",
    p = "OPENPAREN",
    B = "CLOSEBRACE",
    b = "CLOSEBRACKET",
    v = "CLOSEANGLEBRACKET",
    y = "CLOSEPAREN",
    k = "AMPERSAND",
    w = "APOSTROPHE",
    j = "ASTERISK",
    x = "AT",
    O = "BACKSLASH",
    z = "BACKTICK",
    L = "CARET",
    N = "COLON",
    P = "COMMA",
    S = "DOLLAR",
    T = "DOT",
    R = "EQUALS",
    H = "EXCLAMATION",
    M = "HYPHEN",
    I = "PERCENT",
    K = "PIPE",
    U = "PLUS",
    q = "POUND",
    _ = "QUERY",
    Q = "QUOTE",
    Y = "SEMI",
    G = "SLASH",
    W = "TILDE",
    X = "UNDERSCORE",
    Z = "SYM",
    $ = Object.freeze({
      __proto__: null,
      DOMAIN: l,
      LOCALHOST: c,
      TLD: F,
      NUM: A,
      PROTOCOL: E,
      MAILTO: C,
      WS: g,
      NL: h,
      OPENBRACE: f,
      OPENBRACKET: m,
      OPENANGLEBRACKET: d,
      OPENPAREN: p,
      CLOSEBRACE: B,
      CLOSEBRACKET: b,
      CLOSEANGLEBRACKET: v,
      CLOSEPAREN: y,
      AMPERSAND: k,
      APOSTROPHE: w,
      ASTERISK: j,
      AT: x,
      BACKSLASH: O,
      BACKTICK: z,
      CARET: L,
      COLON: N,
      COMMA: P,
      DOLLAR: S,
      DOT: T,
      EQUALS: R,
      EXCLAMATION: H,
      HYPHEN: M,
      PERCENT: I,
      PIPE: K,
      PLUS: U,
      POUND: q,
      QUERY: _,
      QUOTE: Q,
      SEMI: Y,
      SLASH: G,
      TILDE: W,
      UNDERSCORE: X,
      SYM: Z,
    }),
    J =
      "aaa aarp abarth abb abbott abbvie abc able abogado abudhabi ac academy accenture accountant accountants aco actor ad adac ads adult ae aeg aero aetna af afamilycompany afl africa ag agakhan agency ai aig airbus airforce airtel akdn al alfaromeo alibaba alipay allfinanz allstate ally alsace alstom am amazon americanexpress americanfamily amex amfam amica amsterdam analytics android anquan anz ao aol apartments app apple aq aquarelle ar arab aramco archi army arpa art arte as asda asia associates at athleta attorney au auction audi audible audio auspost author auto autos avianca aw aws ax axa az azure ba baby baidu banamex bananarepublic band bank bar barcelona barclaycard barclays barefoot bargains baseball basketball bauhaus bayern bb bbc bbt bbva bcg bcn bd be beats beauty beer bentley berlin best bestbuy bet bf bg bh bharti bi bible bid bike bing bingo bio biz bj black blackfriday blockbuster blog bloomberg blue bm bms bmw bn bnpparibas bo boats boehringer bofa bom bond boo book booking bosch bostik boston bot boutique box br bradesco bridgestone broadway broker brother brussels bs bt budapest bugatti build builders business buy buzz bv bw by bz bzh ca cab cafe cal call calvinklein cam camera camp cancerresearch canon capetown capital capitalone car caravan cards care career careers cars casa case cash casino cat catering catholic cba cbn cbre cbs cc cd center ceo cern cf cfa cfd cg ch chanel channel charity chase chat cheap chintai christmas chrome church ci cipriani circle cisco citadel citi citic city cityeats ck cl claims cleaning click clinic clinique clothing cloud club clubmed cm cn co coach codes coffee college cologne com comcast commbank community company compare computer comsec condos construction consulting contact contractors cooking cookingchannel cool coop corsica country coupon coupons courses cpa cr credit creditcard creditunion cricket crown crs cruise cruises csc cu cuisinella cv cw cx cy cymru cyou cz dabur dad dance data date dating datsun day dclk dds de deal dealer deals degree delivery dell deloitte delta democrat dental dentist desi design dev dhl diamonds diet digital direct directory discount discover dish diy dj dk dm dnp do docs doctor dog domains dot download drive dtv dubai duck dunlop dupont durban dvag dvr dz earth eat ec eco edeka edu education ee eg email emerck energy engineer engineering enterprises epson equipment er ericsson erni es esq estate et etisalat eu eurovision eus events exchange expert exposed express extraspace fage fail fairwinds faith family fan fans farm farmers fashion fast fedex feedback ferrari ferrero fi fiat fidelity fido film final finance financial fire firestone firmdale fish fishing fit fitness fj fk flickr flights flir florist flowers fly fm fo foo food foodnetwork football ford forex forsale forum foundation fox fr free fresenius frl frogans frontdoor frontier ftr fujitsu fujixerox fun fund furniture futbol fyi ga gal gallery gallo gallup game games gap garden gay gb gbiz gd gdn ge gea gent genting george gf gg ggee gh gi gift gifts gives giving gl glade glass gle global globo gm gmail gmbh gmo gmx gn godaddy gold goldpoint golf goo goodyear goog google gop got gov gp gq gr grainger graphics gratis green gripe grocery group gs gt gu guardian gucci guge guide guitars guru gw gy hair hamburg hangout haus hbo hdfc hdfcbank health healthcare help helsinki here hermes hgtv hiphop hisamitsu hitachi hiv hk hkt hm hn hockey holdings holiday homedepot homegoods homes homesense honda horse hospital host hosting hot hoteles hotels hotmail house how hr hsbc ht hu hughes hyatt hyundai ibm icbc ice icu id ie ieee ifm ikano il im imamat imdb immo immobilien in inc industries infiniti info ing ink institute insurance insure int international intuit investments io ipiranga iq ir irish is ismaili ist istanbul it itau itv iveco jaguar java jcb je jeep jetzt jewelry jio jll jm jmp jnj jo jobs joburg jot joy jp jpmorgan jprs juegos juniper kaufen kddi ke kerryhotels kerrylogistics kerryproperties kfh kg kh ki kia kim kinder kindle kitchen kiwi km kn koeln komatsu kosher kp kpmg kpn kr krd kred kuokgroup kw ky kyoto kz la lacaixa lamborghini lamer lancaster lancia land landrover lanxess lasalle lat latino latrobe law lawyer lb lc lds lease leclerc lefrak legal lego lexus lgbt li lidl life lifeinsurance lifestyle lighting like lilly limited limo lincoln linde link lipsy live living lixil lk llc llp loan loans locker locus loft lol london lotte lotto love lpl lplfinancial lr ls lt ltd ltda lu lundbeck luxe luxury lv ly ma macys madrid maif maison makeup man management mango map market marketing markets marriott marshalls maserati mattel mba mc mckinsey md me med media meet melbourne meme memorial men menu merckmsd mg mh miami microsoft mil mini mint mit mitsubishi mk ml mlb mls mm mma mn mo mobi mobile moda moe moi mom monash money monster mormon mortgage moscow moto motorcycles mov movie mp mq mr ms msd mt mtn mtr mu museum mutual mv mw mx my mz na nab nagoya name nationwide natura navy nba nc ne nec net netbank netflix network neustar new news next nextdirect nexus nf nfl ng ngo nhk ni nico nike nikon ninja nissan nissay nl no nokia northwesternmutual norton now nowruz nowtv np nr nra nrw ntt nu nyc nz obi observer off office okinawa olayan olayangroup oldnavy ollo om omega one ong onl online onyourside ooo open oracle orange org organic origins osaka otsuka ott ovh pa page panasonic paris pars partners parts party passagens pay pccw pe pet pf pfizer pg ph pharmacy phd philips phone photo photography photos physio pics pictet pictures pid pin ping pink pioneer pizza pk pl place play playstation plumbing plus pm pn pnc pohl poker politie porn post pr pramerica praxi press prime pro prod productions prof progressive promo properties property protection pru prudential ps pt pub pw pwc py qa qpon quebec quest qvc racing radio raid re read realestate realtor realty recipes red redstone redumbrella rehab reise reisen reit reliance ren rent rentals repair report republican rest restaurant review reviews rexroth rich richardli ricoh ril rio rip rmit ro rocher rocks rodeo rogers room rs rsvp ru rugby ruhr run rw rwe ryukyu sa saarland safe safety sakura sale salon samsclub samsung sandvik sandvikcoromant sanofi sap sarl sas save saxo sb sbi sbs sc sca scb schaeffler schmidt scholarships school schule schwarz science scjohnson scot sd se search seat secure security seek select sener services ses seven sew sex sexy sfr sg sh shangrila sharp shaw shell shia shiksha shoes shop shopping shouji show showtime si silk sina singles site sj sk ski skin sky skype sl sling sm smart smile sn sncf so soccer social softbank software sohu solar solutions song sony soy spa space sport spot spreadbetting sr srl ss st stada staples star statebank statefarm stc stcgroup stockholm storage store stream studio study style su sucks supplies supply support surf surgery suzuki sv swatch swiftcover swiss sx sy sydney systems sz tab taipei talk taobao target tatamotors tatar tattoo tax taxi tc tci td tdk team tech technology tel temasek tennis teva tf tg th thd theater theatre tiaa tickets tienda tiffany tips tires tirol tj tjmaxx tjx tk tkmaxx tl tm tmall tn to today tokyo tools top toray toshiba total tours town toyota toys tr trade trading training travel travelchannel travelers travelersinsurance trust trv tt tube tui tunes tushu tv tvs tw tz ua ubank ubs ug uk unicom university uno uol ups us uy uz va vacations vana vanguard vc ve vegas ventures verisign versicherung vet vg vi viajes video vig viking villas vin vip virgin visa vision viva vivo vlaanderen vn vodka volkswagen volvo vote voting voto voyage vu vuelos wales walmart walter wang wanggou watch watches weather weatherchannel webcam weber website wed wedding weibo weir wf whoswho wien wiki williamhill win windows wine winners wme wolterskluwer woodside work works world wow ws wtc wtf xbox xerox xfinity xihuan xin xxx xyz yachts yahoo yamaxun yandex ye yodobashi yoga yokohama you youtube yt yun za zappos zara zero zip zm zone zuerich zw vermögensberater-ctb vermögensberatung-pwb ελ ευ бг бел дети ею католик ком қаз мкд мон москва онлайн орг рус рф сайт срб укр გე հայ ישראל קום ابوظبي اتصالات ارامكو الاردن البحرين الجزائر السعودية العليان المغرب امارات ایران بارت بازار بھارت بيتك پاکستان ڀارت تونس سودان سورية شبكة عراق عرب عمان فلسطين قطر كاثوليك كوم مصر مليسيا موريتانيا موقع همراه कॉम नेट भारत भारतम् भारोत संगठन বাংলা ভারত ভাৰত ਭਾਰਤ ભારત ଭାରତ இந்தியா இலங்கை சிங்கப்பூர் భారత్ ಭಾರತ ഭാരതം ලංකා คอม ไทย ລາວ 닷넷 닷컴 삼성 한국 アマゾン グーグル クラウド コム ストア セール ファッション ポイント みんな 世界 中信 中国 中國 中文网 亚马逊 企业 佛山 信息 健康 八卦 公司 公益 台湾 台灣 商城 商店 商标 嘉里 嘉里大酒店 在线 大众汽车 大拿 天主教 娱乐 家電 广东 微博 慈善 我爱你 手机 招聘 政务 政府 新加坡 新闻 时尚 書籍 机构 淡马锡 游戏 澳門 点看 移动 组织机构 网址 网店 网站 网络 联通 诺基亚 谷歌 购物 通販 集团 電訊盈科 飞利浦 食品 餐厅 香格里拉 香港".split(
        " ",
      ),
    V =
      /(?:[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08C7\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\u9FFC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7CA\uA7F5-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82C[\uDC00-\uDD1E\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDEC0-\uDEEB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDD\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/,
    uu =
      /(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDD78\uDD7A-\uDDCB\uDDCD-\uDDFF\uDE70-\uDE74\uDE78-\uDE7A\uDE80-\uDE86\uDE90-\uDEA8\uDEB0-\uDEB6\uDEC0-\uDEC2\uDED0-\uDED6])/,
    Du = /\uFE0F/,
    eu = /\d/,
    tu = /\s/;
  function au() {
    var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      D = e(),
      i = t(A),
      n = t(l),
      $ = e(),
      au = t(g),
      ru = [
        [eu, n],
        [V, n],
        [uu, n],
        [Du, n],
      ],
      iu = function () {
        var u = t(l);
        return (u.j = { "-": $ }), (u.jr = [].concat(ru)), u;
      },
      nu = function (u) {
        var D = iu();
        return (D.t = u), D;
      };
    o(D, [
      ["'", t(w)],
      ["{", t(f)],
      ["[", t(m)],
      ["<", t(d)],
      ["(", t(p)],
      ["}", t(B)],
      ["]", t(b)],
      [">", t(v)],
      [")", t(y)],
      ["&", t(k)],
      ["*", t(j)],
      ["@", t(x)],
      ["`", t(z)],
      ["^", t(L)],
      [":", t(N)],
      [",", t(P)],
      ["$", t(S)],
      [".", t(T)],
      ["=", t(R)],
      ["!", t(H)],
      ["-", t(M)],
      ["%", t(I)],
      ["|", t(K)],
      ["+", t(U)],
      ["#", t(q)],
      ["?", t(_)],
      ['"', t(Q)],
      ["/", t(G)],
      [";", t(Y)],
      ["~", t(W)],
      ["_", t(X)],
      ["\\", t(O)],
    ]),
      a(D, "\n", t(h)),
      r(D, tu, au),
      a(au, "\n", e()),
      r(au, tu, au);
    for (var ou = 0; ou < J.length; ou++) s(D, J[ou], nu(F), iu);
    var su = iu(),
      lu = iu(),
      cu = iu(),
      Fu = iu();
    s(D, "file", su, iu),
      s(D, "ftp", lu, iu),
      s(D, "http", cu, iu),
      s(D, "mailto", Fu, iu);
    var Au = iu(),
      Eu = t(E),
      Cu = t(C);
    a(lu, "s", Au),
      a(lu, ":", Eu),
      a(cu, "s", Au),
      a(cu, ":", Eu),
      a(su, ":", Eu),
      a(Au, ":", Eu),
      a(Fu, ":", Cu);
    for (var gu = iu(), hu = 0; hu < u.length; hu++) s(D, u[hu], gu, iu);
    return (
      a(gu, ":", Eu),
      s(D, "localhost", nu(c), iu),
      r(D, eu, i),
      r(D, V, n),
      r(D, uu, n),
      r(D, Du, n),
      r(i, eu, i),
      r(i, V, n),
      r(i, uu, n),
      r(i, Du, n),
      a(i, "-", $),
      a(n, "-", $),
      a($, "-", $),
      r(n, eu, n),
      r(n, V, n),
      r(n, uu, n),
      r(n, Du, n),
      r($, eu, n),
      r($, V, n),
      r($, uu, n),
      r($, Du, n),
      (D.jd = t(Z)),
      D
    );
  }
  function ru(u) {
    return (ru =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (u) {
            return typeof u;
          }
        : function (u) {
            return u &&
              "function" == typeof Symbol &&
              u.constructor === Symbol &&
              u !== Symbol.prototype
              ? "symbol"
              : typeof u;
          })(u);
  }
  var iu = {
    defaultProtocol: "http",
    events: null,
    format: ou,
    formatHref: ou,
    nl2br: !1,
    tagName: "a",
    target: null,
    rel: null,
    validate: !0,
    truncate: 0,
    className: null,
    attributes: null,
    ignoreTags: [],
  };
  function nu(u) {
    (u = u || {}),
      (this.defaultProtocol =
        "defaultProtocol" in u ? u.defaultProtocol : iu.defaultProtocol),
      (this.events = "events" in u ? u.events : iu.events),
      (this.format = "format" in u ? u.format : iu.format),
      (this.formatHref = "formatHref" in u ? u.formatHref : iu.formatHref),
      (this.nl2br = "nl2br" in u ? u.nl2br : iu.nl2br),
      (this.tagName = "tagName" in u ? u.tagName : iu.tagName),
      (this.target = "target" in u ? u.target : iu.target),
      (this.rel = "rel" in u ? u.rel : iu.rel),
      (this.validate = "validate" in u ? u.validate : iu.validate),
      (this.truncate = "truncate" in u ? u.truncate : iu.truncate),
      (this.className = "className" in u ? u.className : iu.className),
      (this.attributes = u.attributes || iu.attributes),
      (this.ignoreTags = []);
    for (
      var D = ("ignoreTags" in u) ? u.ignoreTags : iu.ignoreTags, e = 0;
      e < D.length;
      e++
    )
      this.ignoreTags.push(D[e].toUpperCase());
  }
  function ou(u) {
    return u;
  }
  nu.prototype = {
    resolve: function (u) {
      var D = u.toHref(this.defaultProtocol);
      return {
        formatted: this.get("format", u.toString(), u),
        formattedHref: this.get("formatHref", D, u),
        tagName: this.get("tagName", D, u),
        className: this.get("className", D, u),
        target: this.get("target", D, u),
        rel: this.get("rel", D, u),
        events: this.getObject("events", D, u),
        attributes: this.getObject("attributes", D, u),
        truncate: this.get("truncate", D, u),
      };
    },
    check: function (u) {
      return this.get("validate", u.toString(), u);
    },
    get: function (u, D, e) {
      var t,
        a = this[u];
      if (!a) return a;
      switch (ru(a)) {
        case "function":
          return a(D, e.t);
        case "object":
          return "function" == typeof (t = e.t in a ? a[e.t] : iu[u])
            ? t(D, e.t)
            : t;
      }
      return a;
    },
    getObject: function (u, D, e) {
      var t = this[u];
      return "function" == typeof t ? t(D, e.t) : t;
    },
  };
  var su = Object.freeze({ __proto__: null, defaults: iu, Options: nu });
  function lu() {}
  function cu(u, D) {
    function e(D, e) {
      (this.t = u), (this.v = D), (this.tk = e);
    }
    return (
      (function (u, D) {
        var e =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
          t = Object.create(u.prototype);
        for (var a in e) t[a] = e[a];
        (t.constructor = D), (D.prototype = t);
      })(lu, e, D),
      e
    );
  }
  lu.prototype = {
    t: "token",
    isLink: !1,
    toString: function () {
      return this.v;
    },
    toHref: function () {
      return this.toString();
    },
    startIndex: function () {
      return this.tk[0].s;
    },
    endIndex: function () {
      return this.tk[this.tk.length - 1].e;
    },
    toObject: function () {
      var u =
        arguments.length > 0 && void 0 !== arguments[0]
          ? arguments[0]
          : iu.defaultProtocol;
      return {
        type: this.t,
        value: this.v,
        isLink: this.isLink,
        href: this.toHref(u),
        start: this.startIndex(),
        end: this.endIndex(),
      };
    },
  };
  var Fu = cu("email", { isLink: !0 }),
    Au = cu("email", {
      isLink: !0,
      toHref: function () {
        return "mailto:" + this.toString();
      },
    }),
    Eu = cu("text"),
    Cu = cu("nl"),
    gu = cu("url", {
      isLink: !0,
      toHref: function () {
        for (
          var u =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : iu.defaultProtocol,
            D = this.tk,
            e = !1,
            t = !1,
            a = [],
            r = 0;
          D[r].t === E;

        )
          (e = !0), a.push(D[r].v), r++;
        for (; D[r].t === G; ) (t = !0), a.push(D[r].v), r++;
        for (; r < D.length; r++) a.push(D[r].v);
        return (
          (a = a.join("")), e || t || (a = "".concat(u, "://").concat(a)), a
        );
      },
      hasProtocol: function () {
        return this.tk[0].t === E;
      },
    }),
    hu = Object.freeze({
      __proto__: null,
      MultiToken: lu,
      Base: lu,
      createTokenClass: cu,
      MailtoEmail: Fu,
      Email: Au,
      Text: Eu,
      Nl: Cu,
      Url: gu,
    });
  function fu() {
    var u = e(),
      D = e(),
      r = e(),
      i = e(),
      o = e(),
      s = e(),
      g = e(),
      $ = t(gu),
      J = e(),
      V = t(gu),
      uu = t(gu),
      Du = e(),
      eu = e(),
      tu = e(),
      au = e(),
      ru = e(),
      iu = t(gu),
      nu = t(gu),
      ou = t(gu),
      su = t(gu),
      lu = e(),
      cu = e(),
      Eu = e(),
      hu = e(),
      fu = e(),
      mu = e(),
      du = t(Au),
      pu = e(),
      Bu = t(Au),
      bu = t(Fu),
      vu = e(),
      yu = e(),
      ku = e(),
      wu = e(),
      ju = t(Cu);
    a(u, h, ju),
      a(u, E, D),
      a(u, C, r),
      a(D, G, i),
      a(i, G, o),
      a(u, F, s),
      a(u, l, s),
      a(u, c, $),
      a(u, A, s),
      a(o, F, uu),
      a(o, l, uu),
      a(o, A, uu),
      a(o, c, uu),
      a(s, T, g),
      a(fu, T, mu),
      a(g, F, $),
      a(g, l, s),
      a(g, A, s),
      a(g, c, s),
      a(mu, F, du),
      a(mu, l, fu),
      a(mu, A, fu),
      a(mu, c, fu),
      a($, T, g),
      a(du, T, mu),
      a($, N, J),
      a($, G, uu),
      a(J, A, V),
      a(V, G, uu),
      a(du, N, pu),
      a(pu, A, Bu);
    var xu = [k, j, x, O, z, L, S, l, R, M, c, A, I, K, U, q, E, G, Z, W, F, X],
      Ou = [w, v, B, b, y, N, P, T, H, d, f, m, p, _, Q, Y];
    a(uu, f, eu),
      a(uu, m, tu),
      a(uu, d, au),
      a(uu, p, ru),
      a(Du, f, eu),
      a(Du, m, tu),
      a(Du, d, au),
      a(Du, p, ru),
      a(eu, B, uu),
      a(tu, b, uu),
      a(au, v, uu),
      a(ru, y, uu),
      a(iu, B, uu),
      a(nu, b, uu),
      a(ou, v, uu),
      a(su, y, uu),
      a(lu, B, uu),
      a(cu, b, uu),
      a(Eu, v, uu),
      a(hu, y, uu),
      n(eu, xu, iu),
      n(tu, xu, nu),
      n(au, xu, ou),
      n(ru, xu, su),
      n(eu, Ou, lu),
      n(tu, Ou, cu),
      n(au, Ou, Eu),
      n(ru, Ou, hu),
      n(iu, xu, iu),
      n(nu, xu, nu),
      n(ou, xu, ou),
      n(su, xu, su),
      n(iu, Ou, iu),
      n(nu, Ou, nu),
      n(ou, Ou, ou),
      n(su, Ou, su),
      n(lu, xu, iu),
      n(cu, xu, nu),
      n(Eu, xu, ou),
      n(hu, xu, su),
      n(lu, Ou, lu),
      n(cu, Ou, cu),
      n(Eu, Ou, Eu),
      n(hu, Ou, hu),
      n(uu, xu, uu),
      n(Du, xu, uu),
      n(uu, Ou, Du),
      n(Du, Ou, Du),
      a(r, F, bu),
      a(r, l, bu),
      a(r, A, bu),
      a(r, c, bu),
      n(bu, xu, bu),
      n(bu, Ou, vu),
      n(vu, xu, bu),
      n(vu, Ou, vu);
    var zu = [
      k,
      w,
      j,
      O,
      z,
      L,
      B,
      S,
      l,
      R,
      M,
      A,
      f,
      I,
      K,
      U,
      q,
      _,
      G,
      Z,
      W,
      F,
      X,
    ];
    return (
      n(s, zu, yu),
      a(s, x, ku),
      n($, zu, yu),
      a($, x, ku),
      n(g, zu, yu),
      n(yu, zu, yu),
      a(yu, x, ku),
      a(yu, T, wu),
      n(wu, zu, yu),
      a(ku, F, fu),
      a(ku, l, fu),
      a(ku, A, fu),
      a(ku, c, du),
      u
    );
  }
  function mu(u, D, e) {
    var t = e[0].s,
      a = e[e.length - 1].e;
    return new u(D.substr(t, a - t), e);
  }
  var du =
      ("undefined" != typeof console && console && console.warn) ||
      function () {},
    pu = {
      scanner: null,
      parser: null,
      pluginQueue: [],
      customProtocols: [],
      initialized: !1,
    };
  function Bu() {
    (pu.scanner = { start: au(pu.customProtocols), tokens: $ }),
      (pu.parser = { start: fu(), tokens: hu });
    for (
      var u = { createTokenClass: cu }, D = 0;
      D < pu.pluginQueue.length;
      D++
    )
      pu.pluginQueue[D][1]({
        scanner: pu.scanner,
        parser: pu.parser,
        utils: u,
      });
    pu.initialized = !0;
  }
  function bu(u) {
    return (
      pu.initialized || Bu(),
      (function (u, D, e) {
        for (var t = e.length, a = 0, r = [], n = []; a < t; ) {
          for (
            var o = u, s = null, l = null, c = 0, F = null, A = -1;
            a < t && !(s = i(o, e[a].t));

          )
            n.push(e[a++]);
          for (; a < t && (l = s || i(o, e[a].t)); )
            (s = null),
              (o = l).accepts() ? ((A = 0), (F = o)) : A >= 0 && A++,
              a++,
              c++;
          if (A < 0) for (var E = a - c; E < a; E++) n.push(e[E]);
          else {
            n.length > 0 && (r.push(mu(Eu, D, n)), (n = [])),
              (a -= A),
              (c -= A);
            var C = F.t,
              g = e.slice(a - c, a);
            r.push(mu(C, D, g));
          }
        }
        return n.length > 0 && r.push(mu(Eu, D, n)), r;
      })(
        pu.parser.start,
        u,
        (function (u, D) {
          for (
            var e = (function (u) {
                for (var D = [], e = u.length, t = 0; t < e; ) {
                  var a = u.charCodeAt(t),
                    r = void 0,
                    i =
                      a < 55296 ||
                      a > 56319 ||
                      t + 1 === e ||
                      (r = u.charCodeAt(t + 1)) < 56320 ||
                      r > 57343
                        ? u[t]
                        : u.slice(t, t + 2);
                  D.push(i), (t += i.length);
                }
                return D;
              })(
                D.replace(/[A-Z]/g, function (u) {
                  return u.toLowerCase();
                }),
              ),
              t = e.length,
              a = [],
              r = 0,
              n = 0;
            n < t;

          ) {
            for (
              var o = u, s = null, l = 0, c = null, F = -1, A = -1;
              n < t && (s = i(o, e[n]));

            )
              (o = s).accepts()
                ? ((F = 0), (A = 0), (c = o))
                : F >= 0 && ((F += e[n].length), A++),
                (l += e[n].length),
                (r += e[n].length),
                n++;
            (r -= F),
              (n -= A),
              (l -= F),
              a.push({ t: c.t, v: D.substr(r - l, l), s: r - l, e: r });
          }
          return a;
        })(pu.scanner.start, u),
      )
    );
  }
  return (
    (u.Options = nu),
    (u.find = function (u) {
      for (
        var D =
            arguments.length > 1 && void 0 !== arguments[1]
              ? arguments[1]
              : null,
          e = bu(u),
          t = [],
          a = 0;
        a < e.length;
        a++
      ) {
        var r = e[a];
        !r.isLink || (D && r.t !== D) || t.push(r.toObject());
      }
      return t;
    }),
    (u.init = Bu),
    (u.options = su),
    (u.registerCustomProtocol = function (u) {
      if (
        (pu.initialized &&
          du(
            'linkifyjs: already initialized - will not register custom protocol "'.concat(
              u,
              '" until you manually call linkify.init(). To avoid this warning, please register all custom protocols before invoking linkify the first time.',
            ),
          ),
        !/^[a-z-]+$/.test(u))
      )
        throw Error(
          "linkifyjs: protocols containing characters other than a-z or - (hyphen) are not supported",
        );
      pu.customProtocols.push(u);
    }),
    (u.registerPlugin = function (u, D) {
      for (var e = 0; e < pu.pluginQueue.length; e++)
        if (u === pu.pluginQueue[e][0])
          return (
            du(
              'linkifyjs: plugin "'.concat(
                u,
                '" already registered - will be overwritten',
              ),
            ),
            void (pu.pluginQueue[e] = [u, D])
          );
      pu.pluginQueue.push([u, D]),
        pu.initialized &&
          du(
            'linkifyjs: already initialized - will not register plugin "'.concat(
              u,
              '" until you manually call linkify.init(). To avoid this warning, please register all plugins before invoking linkify the first time.',
            ),
          );
    }),
    (u.reset = function () {
      (pu.scanner = null),
        (pu.parser = null),
        (pu.pluginQueue = []),
        (pu.customProtocols = []),
        (pu.initialized = !1);
    }),
    (u.test = function (u) {
      var D =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
        e = bu(u);
      return 1 === e.length && e[0].isLink && (!D || e[0].t === D);
    }),
    (u.tokenize = bu),
    Object.defineProperty(u, "__esModule", { value: !0 }),
    u
  );
})({});

;}
      } catch(e) { console.error(`  Error executing script ${scriptPath_9lur7wdcz3w}`, e); }
    

      const scriptPath_437nxn7v5hz = "linkify-jquery.min.js"; // Use JSON.stringify for safety
      console.log(`  Executing JS (end): ${scriptPath_437nxn7v5hz}`);
      try {
          with(__globals){;!(function (e, n) {
  "use strict";
  function t(e) {
    return e && "object" == typeof e && "default" in e ? e : { default: e };
  }
  var i = t(e),
    a = t(n),
    r =
      "undefined" != typeof globalThis
        ? globalThis
        : "undefined" != typeof window
          ? window
          : "undefined" != typeof global
            ? global
            : "undefined" != typeof self
              ? self
              : {};
  function o(e, n, t) {
    var i = t[t.length - 1];
    e.replaceChild(i, n);
    for (var a = t.length - 2; a >= 0; a--) e.insertBefore(t[a], i), (i = t[a]);
  }
  function l(e, n, t) {
    for (var i = [], a = 0; a < e.length; a++) {
      var r = e[a];
      if ("nl" === r.t && n.nl2br) i.push(t.createElement("br"));
      else if (r.isLink && n.check(r)) {
        var o = n.resolve(r),
          l = o.formatted,
          f = o.formattedHref,
          d = o.tagName,
          s = o.className,
          u = o.target,
          c = o.rel,
          y = o.events,
          m = o.attributes,
          h = t.createElement(d);
        if (
          (h.setAttribute("href", f),
          s && h.setAttribute("class", s),
          u && h.setAttribute("target", u),
          c && h.setAttribute("rel", c),
          m)
        )
          for (var k in m) h.setAttribute(k, m[k]);
        if (y)
          for (var g in y)
            h.addEventListener
              ? h.addEventListener(g, y[g])
              : h.attachEvent && h.attachEvent("on" + g, y[g]);
        h.appendChild(t.createTextNode(l)), i.push(h);
      } else i.push(t.createTextNode(r.toString()));
    }
    return i;
  }
  function f(e, n, t) {
    if (!e || 1 !== e.nodeType)
      throw new Error("Cannot linkify ".concat(e, " - Invalid DOM Node type"));
    var i = n.ignoreTags;
    if ("A" === e.tagName || i.indexOf(e.tagName) >= 0) return e;
    for (var r = e.firstChild; r; ) {
      var d = void 0,
        s = void 0,
        u = void 0;
      switch (r.nodeType) {
        case 1:
          f(r, n, t);
          break;
        case 3:
          if (
            ((d = r.nodeValue),
            0 === (s = a.default.tokenize(d)).length ||
              (1 === s.length && "text" === s[0].t))
          )
            break;
          o(e, r, (u = l(s, n, t))), (r = u[u.length - 1]);
      }
      r = r.nextSibling;
    }
    return e;
  }
  function d(e, n) {
    var t =
      arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
    try {
      t = t || document || (window && window.document) || (r && r.document);
    } catch (e) {}
    if (!t)
      throw new Error(
        "Cannot find document implementation. If you are in a non-browser environment like Node.js, pass the document implementation as the third argument to linkifyElement.",
      );
    return f(e, (n = new a.default.Options(n)), t);
  }
  (d.helper = f),
    (d.normalize = function (e) {
      return new a.default.Options(e);
    });
  var s = d;
  function u(e) {
    var n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
    if (((e.fn = e.fn || {}), "function" != typeof e.fn.linkify)) {
      try {
        n =
          n ||
          document ||
          (window && window.document) ||
          (global && global.document);
      } catch (e) {}
      if (!n)
        throw new Error(
          "Cannot find document implementation. If you are in a non-browser environment like Node.js, pass the document implementation as the second argument to linkify-jquery",
        );
      (e.fn.linkify = t),
        e(function () {
          e("[data-linkify]").each(function () {
            var n = e(this),
              t = n.data(),
              i = t.linkify,
              a = t.linkifyNl2br,
              r = { nl2br: !!a && 0 !== a && "false" !== a };
            "linkifyAttributes" in t && (r.attributes = t.linkifyAttributes),
              "linkifyDefaultProtocol" in t &&
                (r.defaultProtocol = t.linkifyDefaultProtocol),
              "linkifyEvents" in t && (r.events = t.linkifyEvents),
              "linkifyFormat" in t && (r.format = t.linkifyFormat),
              "linkifyFormatHref" in t && (r.formatHref = t.linkifyFormatHref),
              "linkifyTagname" in t && (r.tagName = t.linkifyTagname),
              "linkifyTarget" in t && (r.target = t.linkifyTarget),
              "linkifyRel" in t && (r.rel = t.linkifyRel),
              "linkifyValidate" in t && (r.validate = t.linkifyValidate),
              "linkifyIgnoreTags" in t && (r.ignoreTags = t.linkifyIgnoreTags),
              "linkifyClassName" in t && (r.className = t.linkifyClassName),
              (r = s.normalize(r)),
              ("this" === i ? n : n.find(i)).linkify(r);
          });
        });
    }
    function t(e) {
      return (
        (e = s.normalize(e)),
        this.each(function () {
          s.helper(this, e, n);
        })
      );
    }
  }
  try {
    u(i.default);
  } catch (e) {}
  try {
    window.linkifyElement = s;
  } catch (e) {}
})(jQuery, linkify);

;}
      } catch(e) { console.error(`  Error executing script ${scriptPath_437nxn7v5hz}`, e); }
    

      const scriptPath_s3nrp2jjx = "luxon.min.js"; // Use JSON.stringify for safety
      console.log(`  Executing JS (end): ${scriptPath_s3nrp2jjx}`);
      try {
          with(__globals){;var luxon = (function (e) {
  "use strict";
  function r(e, t) {
    for (var n = 0; n < t.length; n++) {
      var r = t[n];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(e, r.key, r);
    }
  }
  function o(e, t, n) {
    return t && r(e.prototype, t), n && r(e, n), e;
  }
  function u() {
    return (u =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var n,
            r = arguments[t];
          for (n in r)
            Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
        }
        return e;
      }).apply(this, arguments);
  }
  function i(e, t) {
    (e.prototype = Object.create(t.prototype)),
      s((e.prototype.constructor = e), t);
  }
  function a(e) {
    return (a = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (e) {
          return e.__proto__ || Object.getPrototypeOf(e);
        })(e);
  }
  function s(e, t) {
    return (s =
      Object.setPrototypeOf ||
      function (e, t) {
        return (e.__proto__ = t), e;
      })(e, t);
  }
  function c(e, t, n) {
    return (c = (function () {
      if (
        "undefined" != typeof Reflect &&
        Reflect.construct &&
        !Reflect.construct.sham
      ) {
        if ("function" == typeof Proxy) return 1;
        try {
          return (
            Boolean.prototype.valueOf.call(
              Reflect.construct(Boolean, [], function () {}),
            ),
            1
          );
        } catch (e) {
          return;
        }
      }
    })()
      ? Reflect.construct
      : function (e, t, n) {
          var r = [null];
          r.push.apply(r, t);
          r = new (Function.bind.apply(e, r))();
          return n && s(r, n.prototype), r;
        }).apply(null, arguments);
  }
  function t(e) {
    var n = "function" == typeof Map ? new Map() : void 0;
    return (t = function (e) {
      if (
        null === e ||
        -1 === Function.toString.call(e).indexOf("[native code]")
      )
        return e;
      if ("function" != typeof e)
        throw new TypeError(
          "Super expression must either be null or a function",
        );
      if (void 0 !== n) {
        if (n.has(e)) return n.get(e);
        n.set(e, t);
      }
      function t() {
        return c(e, arguments, a(this).constructor);
      }
      return (
        (t.prototype = Object.create(e.prototype, {
          constructor: {
            value: t,
            enumerable: !1,
            writable: !0,
            configurable: !0,
          },
        })),
        s(t, e)
      );
    })(e);
  }
  function l(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
    return r;
  }
  function k(e, t) {
    var n =
      ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
    if (n) return (n = n.call(e)).next.bind(n);
    if (
      Array.isArray(e) ||
      (n = (function (e, t) {
        if (e) {
          if ("string" == typeof e) return l(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          return "Map" ===
            (n = "Object" === n && e.constructor ? e.constructor.name : n) ||
            "Set" === n
            ? Array.from(e)
            : "Arguments" === n ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
              ? l(e, t)
              : void 0;
        }
      })(e)) ||
      (t && e && "number" == typeof e.length)
    ) {
      n && (e = n);
      var r = 0;
      return function () {
        return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
    );
  }
  var n = (function (e) {
      function t() {
        return e.apply(this, arguments) || this;
      }
      return i(t, e), t;
    })(t(Error)),
    f = (function (t) {
      function e(e) {
        return t.call(this, "Invalid DateTime: " + e.toMessage()) || this;
      }
      return i(e, t), e;
    })(n),
    d = (function (t) {
      function e(e) {
        return t.call(this, "Invalid Interval: " + e.toMessage()) || this;
      }
      return i(e, t), e;
    })(n),
    h = (function (t) {
      function e(e) {
        return t.call(this, "Invalid Duration: " + e.toMessage()) || this;
      }
      return i(e, t), e;
    })(n),
    S = (function (e) {
      function t() {
        return e.apply(this, arguments) || this;
      }
      return i(t, e), t;
    })(n),
    y = (function (t) {
      function e(e) {
        return t.call(this, "Invalid unit " + e) || this;
      }
      return i(e, t), e;
    })(n),
    v = (function (e) {
      function t() {
        return e.apply(this, arguments) || this;
      }
      return i(t, e), t;
    })(n),
    m = (function (e) {
      function t() {
        return e.call(this, "Zone is an abstract class") || this;
      }
      return i(t, e), t;
    })(n),
    p = "numeric",
    g = "short",
    w = "long",
    T = { year: p, month: p, day: p },
    b = { year: p, month: g, day: p },
    O = { year: p, month: g, day: p, weekday: g },
    M = { year: p, month: w, day: p },
    N = { year: p, month: w, day: p, weekday: w },
    D = { hour: p, minute: p },
    E = { hour: p, minute: p, second: p },
    I = { hour: p, minute: p, second: p, timeZoneName: g },
    V = { hour: p, minute: p, second: p, timeZoneName: w },
    x = { hour: p, minute: p, hourCycle: "h23" },
    C = { hour: p, minute: p, second: p, hourCycle: "h23" },
    F = { hour: p, minute: p, second: p, hourCycle: "h23", timeZoneName: g },
    Z = { hour: p, minute: p, second: p, hourCycle: "h23", timeZoneName: w },
    L = { year: p, month: p, day: p, hour: p, minute: p },
    A = { year: p, month: p, day: p, hour: p, minute: p, second: p },
    z = { year: p, month: g, day: p, hour: p, minute: p },
    j = { year: p, month: g, day: p, hour: p, minute: p, second: p },
    q = { year: p, month: g, day: p, weekday: g, hour: p, minute: p },
    _ = { year: p, month: w, day: p, hour: p, minute: p, timeZoneName: g },
    U = {
      year: p,
      month: w,
      day: p,
      hour: p,
      minute: p,
      second: p,
      timeZoneName: g,
    },
    R = {
      year: p,
      month: w,
      day: p,
      weekday: w,
      hour: p,
      minute: p,
      timeZoneName: w,
    },
    H = {
      year: p,
      month: w,
      day: p,
      weekday: w,
      hour: p,
      minute: p,
      second: p,
      timeZoneName: w,
    };
  function P(e) {
    return void 0 === e;
  }
  function W(e) {
    return "number" == typeof e;
  }
  function J(e) {
    return "number" == typeof e && e % 1 == 0;
  }
  function Y() {
    try {
      return "undefined" != typeof Intl && !!Intl.RelativeTimeFormat;
    } catch (e) {
      return !1;
    }
  }
  function G(e, n, r) {
    if (0 !== e.length)
      return e.reduce(function (e, t) {
        t = [n(t), t];
        return e && r(e[0], t[0]) === e[0] ? e : t;
      }, null)[1];
  }
  function $(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }
  function B(e, t, n) {
    return J(e) && t <= e && e <= n;
  }
  function Q(e, t) {
    void 0 === t && (t = 2);
    var n = e < 0 ? "-" : "",
      e = n ? -1 * e : e,
      e =
        e.toString().length < t ? ("0".repeat(t) + e).slice(-t) : e.toString();
    return n + e;
  }
  function K(e) {
    if (!P(e) && null !== e && "" !== e) return parseInt(e, 10);
  }
  function X(e) {
    if (!P(e) && null !== e && "" !== e) {
      e = 1e3 * parseFloat("0." + e);
      return Math.floor(e);
    }
  }
  function ee(e, t, n) {
    void 0 === n && (n = !1);
    t = Math.pow(10, t);
    return (n ? Math.trunc : Math.round)(e * t) / t;
  }
  function te(e) {
    return e % 4 == 0 && (e % 100 != 0 || e % 400 == 0);
  }
  function ne(e) {
    return te(e) ? 366 : 365;
  }
  function re(e, t) {
    var n,
      r,
      r = (n = t - 1) - (r = 12) * Math.floor(n / r) + 1;
    return 2 == r
      ? te(e + (t - r) / 12)
        ? 29
        : 28
      : [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][r - 1];
  }
  function ie(e) {
    var t = Date.UTC(
      e.year,
      e.month - 1,
      e.day,
      e.hour,
      e.minute,
      e.second,
      e.millisecond,
    );
    return (
      e.year < 100 &&
        0 <= e.year &&
        (t = new Date(t)).setUTCFullYear(t.getUTCFullYear() - 1900),
      +t
    );
  }
  function oe(e) {
    var t =
        (e + Math.floor(e / 4) - Math.floor(e / 100) + Math.floor(e / 400)) % 7,
      e = e - 1,
      e =
        (e + Math.floor(e / 4) - Math.floor(e / 100) + Math.floor(e / 400)) % 7;
    return 4 == t || 3 == e ? 53 : 52;
  }
  function ae(e) {
    return 99 < e ? e : 60 < e ? 1900 + e : 2e3 + e;
  }
  function ue(e, t, n, r) {
    void 0 === r && (r = null);
    var i = new Date(e),
      e = {
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
    r && (e.timeZone = r);
    (e = u({ timeZoneName: t }, e)),
      (i = new Intl.DateTimeFormat(n, e).formatToParts(i).find(function (e) {
        return "timezonename" === e.type.toLowerCase();
      }));
    return i ? i.value : null;
  }
  function se(e, t) {
    e = parseInt(e, 10);
    Number.isNaN(e) && (e = 0);
    t = parseInt(t, 10) || 0;
    return 60 * e + (e < 0 || Object.is(e, -0) ? -t : t);
  }
  function ce(e) {
    var t = Number(e);
    if ("boolean" == typeof e || "" === e || Number.isNaN(t))
      throw new v("Invalid unit value " + e);
    return t;
  }
  function le(e, t) {
    var n,
      r,
      i = {};
    for (n in e) !$(e, n) || (null != (r = e[n]) && (i[t(n)] = ce(r)));
    return i;
  }
  function fe(e, t) {
    var n = Math.trunc(Math.abs(e / 60)),
      r = Math.trunc(Math.abs(e % 60)),
      i = 0 <= e ? "+" : "-";
    switch (t) {
      case "short":
        return i + Q(n, 2) + ":" + Q(r, 2);
      case "narrow":
        return i + n + (0 < r ? ":" + r : "");
      case "techie":
        return i + Q(n, 2) + Q(r, 2);
      default:
        throw new RangeError(
          "Value format " + t + " is out of range for property format",
        );
    }
  }
  function de(e) {
    return (
      (n = e),
      ["hour", "minute", "second", "millisecond"].reduce(function (e, t) {
        return (e[t] = n[t]), e;
      }, {})
    );
    var n;
  }
  var he = /[A-Za-z_+-]{1,256}(:?\/[A-Za-z_+-]{1,256}(\/[A-Za-z_+-]{1,256})?)?/,
    me = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    ye = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    ve = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  function pe(e) {
    switch (e) {
      case "narrow":
        return [].concat(ve);
      case "short":
        return [].concat(ye);
      case "long":
        return [].concat(me);
      case "numeric":
        return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
      case "2-digit":
        return [
          "01",
          "02",
          "03",
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
        ];
      default:
        return null;
    }
  }
  var ge = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    we = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    ke = ["M", "T", "W", "T", "F", "S", "S"];
  function Se(e) {
    switch (e) {
      case "narrow":
        return [].concat(ke);
      case "short":
        return [].concat(we);
      case "long":
        return [].concat(ge);
      case "numeric":
        return ["1", "2", "3", "4", "5", "6", "7"];
      default:
        return null;
    }
  }
  var Te = ["AM", "PM"],
    be = ["Before Christ", "Anno Domini"],
    Oe = ["BC", "AD"],
    Me = ["B", "A"];
  function Ne(e) {
    switch (e) {
      case "narrow":
        return [].concat(Me);
      case "short":
        return [].concat(Oe);
      case "long":
        return [].concat(be);
      default:
        return null;
    }
  }
  function De(e, t) {
    for (var n = "", r = k(e); !(i = r()).done; ) {
      var i = i.value;
      i.literal ? (n += i.val) : (n += t(i.val));
    }
    return n;
  }
  var Ee = {
      D: T,
      DD: b,
      DDD: M,
      DDDD: N,
      t: D,
      tt: E,
      ttt: I,
      tttt: V,
      T: x,
      TT: C,
      TTT: F,
      TTTT: Z,
      f: L,
      ff: z,
      fff: _,
      ffff: R,
      F: A,
      FF: j,
      FFF: U,
      FFFF: H,
    },
    Ie = (function () {
      function h(e, t) {
        (this.opts = t), (this.loc = e), (this.systemLoc = null);
      }
      (h.create = function (e, t) {
        return new h(e, (t = void 0 === t ? {} : t));
      }),
        (h.parseFormat = function (e) {
          for (var t = null, n = "", r = !1, i = [], o = 0; o < e.length; o++) {
            var a = e.charAt(o);
            "'" === a
              ? (0 < n.length && i.push({ literal: r, val: n }),
                (t = null),
                (n = ""),
                (r = !r))
              : r || a === t
                ? (n += a)
                : (0 < n.length && i.push({ literal: !1, val: n }),
                  (t = n = a));
          }
          return 0 < n.length && i.push({ literal: r, val: n }), i;
        }),
        (h.macroTokenToFormatOpts = function (e) {
          return Ee[e];
        });
      var e = h.prototype;
      return (
        (e.formatWithSystemDefault = function (e, t) {
          return (
            null === this.systemLoc &&
              (this.systemLoc = this.loc.redefaultToSystem()),
            this.systemLoc.dtFormatter(e, u({}, this.opts, t)).format()
          );
        }),
        (e.formatDateTime = function (e, t) {
          return this.loc
            .dtFormatter(e, u({}, this.opts, (t = void 0 === t ? {} : t)))
            .format();
        }),
        (e.formatDateTimeParts = function (e, t) {
          return this.loc
            .dtFormatter(e, u({}, this.opts, (t = void 0 === t ? {} : t)))
            .formatToParts();
        }),
        (e.resolvedOptions = function (e, t) {
          return this.loc
            .dtFormatter(e, u({}, this.opts, (t = void 0 === t ? {} : t)))
            .resolvedOptions();
        }),
        (e.num = function (e, t) {
          if ((void 0 === t && (t = 0), this.opts.forceSimple)) return Q(e, t);
          var n = u({}, this.opts);
          return 0 < t && (n.padTo = t), this.loc.numberFormatter(n).format(e);
        }),
        (e.formatDateTimeFromString = function (r, e) {
          function i(e, t) {
            return l.loc.extract(r, e, t);
          }
          function o(e) {
            return r.isOffsetFixed && 0 === r.offset && e.allowZ
              ? "Z"
              : r.isValid
                ? r.zone.formatOffset(r.ts, e.format)
                : "";
          }
          function a() {
            return f
              ? Te[r.hour < 12 ? 0 : 1]
              : i({ hour: "numeric", hourCycle: "h12" }, "dayperiod");
          }
          function u(e, t) {
            return f
              ? ((n = r), pe(e)[n.month - 1])
              : i(t ? { month: e } : { month: e, day: "numeric" }, "month");
            var n;
          }
          function s(e, t) {
            return f
              ? ((n = r), Se(e)[n.weekday - 1])
              : i(
                  t
                    ? { weekday: e }
                    : { weekday: e, month: "long", day: "numeric" },
                  "weekday",
                );
            var n;
          }
          function c(e) {
            return f
              ? ((t = r), Ne(e)[t.year < 0 ? 0 : 1])
              : i({ era: e }, "era");
            var t;
          }
          var l = this,
            f = "en" === this.loc.listingMode(),
            d =
              this.loc.outputCalendar && "gregory" !== this.loc.outputCalendar;
          return De(h.parseFormat(e), function (e) {
            switch (e) {
              case "S":
                return l.num(r.millisecond);
              case "u":
              case "SSS":
                return l.num(r.millisecond, 3);
              case "s":
                return l.num(r.second);
              case "ss":
                return l.num(r.second, 2);
              case "m":
                return l.num(r.minute);
              case "mm":
                return l.num(r.minute, 2);
              case "h":
                return l.num(r.hour % 12 == 0 ? 12 : r.hour % 12);
              case "hh":
                return l.num(r.hour % 12 == 0 ? 12 : r.hour % 12, 2);
              case "H":
                return l.num(r.hour);
              case "HH":
                return l.num(r.hour, 2);
              case "Z":
                return o({ format: "narrow", allowZ: l.opts.allowZ });
              case "ZZ":
                return o({ format: "short", allowZ: l.opts.allowZ });
              case "ZZZ":
                return o({ format: "techie", allowZ: l.opts.allowZ });
              case "ZZZZ":
                return r.zone.offsetName(r.ts, {
                  format: "short",
                  locale: l.loc.locale,
                });
              case "ZZZZZ":
                return r.zone.offsetName(r.ts, {
                  format: "long",
                  locale: l.loc.locale,
                });
              case "z":
                return r.zoneName;
              case "a":
                return a();
              case "d":
                return d ? i({ day: "numeric" }, "day") : l.num(r.day);
              case "dd":
                return d ? i({ day: "2-digit" }, "day") : l.num(r.day, 2);
              case "c":
                return l.num(r.weekday);
              case "ccc":
                return s("short", !0);
              case "cccc":
                return s("long", !0);
              case "ccccc":
                return s("narrow", !0);
              case "E":
                return l.num(r.weekday);
              case "EEE":
                return s("short", !1);
              case "EEEE":
                return s("long", !1);
              case "EEEEE":
                return s("narrow", !1);
              case "L":
                return d
                  ? i({ month: "numeric", day: "numeric" }, "month")
                  : l.num(r.month);
              case "LL":
                return d
                  ? i({ month: "2-digit", day: "numeric" }, "month")
                  : l.num(r.month, 2);
              case "LLL":
                return u("short", !0);
              case "LLLL":
                return u("long", !0);
              case "LLLLL":
                return u("narrow", !0);
              case "M":
                return d ? i({ month: "numeric" }, "month") : l.num(r.month);
              case "MM":
                return d ? i({ month: "2-digit" }, "month") : l.num(r.month, 2);
              case "MMM":
                return u("short", !1);
              case "MMMM":
                return u("long", !1);
              case "MMMMM":
                return u("narrow", !1);
              case "y":
                return d ? i({ year: "numeric" }, "year") : l.num(r.year);
              case "yy":
                return d
                  ? i({ year: "2-digit" }, "year")
                  : l.num(r.year.toString().slice(-2), 2);
              case "yyyy":
                return d ? i({ year: "numeric" }, "year") : l.num(r.year, 4);
              case "yyyyyy":
                return d ? i({ year: "numeric" }, "year") : l.num(r.year, 6);
              case "G":
                return c("short");
              case "GG":
                return c("long");
              case "GGGGG":
                return c("narrow");
              case "kk":
                return l.num(r.weekYear.toString().slice(-2), 2);
              case "kkkk":
                return l.num(r.weekYear, 4);
              case "W":
                return l.num(r.weekNumber);
              case "WW":
                return l.num(r.weekNumber, 2);
              case "o":
                return l.num(r.ordinal);
              case "ooo":
                return l.num(r.ordinal, 3);
              case "q":
                return l.num(r.quarter);
              case "qq":
                return l.num(r.quarter, 2);
              case "X":
                return l.num(Math.floor(r.ts / 1e3));
              case "x":
                return l.num(r.ts);
              default:
                return (n = h.macroTokenToFormatOpts((t = e)))
                  ? l.formatWithSystemDefault(r, n)
                  : t;
            }
            var t, n;
          });
        }),
        (e.formatDurationFromString = function (e, t) {
          function n(e) {
            switch (e[0]) {
              case "S":
                return "millisecond";
              case "s":
                return "second";
              case "m":
                return "minute";
              case "h":
                return "hour";
              case "d":
                return "day";
              case "M":
                return "month";
              case "y":
                return "year";
              default:
                return null;
            }
          }
          var r,
            i = this,
            o = h.parseFormat(t),
            t = o.reduce(function (e, t) {
              var n = t.literal,
                t = t.val;
              return n ? e : e.concat(t);
            }, []),
            t = e.shiftTo.apply(
              e,
              t.map(n).filter(function (e) {
                return e;
              }),
            );
          return De(
            o,
            ((r = t),
            function (e) {
              var t = n(e);
              return t ? i.num(r.get(t), e.length) : e;
            }),
          );
        }),
        h
      );
    })(),
    Ve = (function () {
      function e(e, t) {
        (this.reason = e), (this.explanation = t);
      }
      return (
        (e.prototype.toMessage = function () {
          return this.explanation
            ? this.reason + ": " + this.explanation
            : this.reason;
        }),
        e
      );
    })(),
    xe = (function () {
      function e() {}
      var t = e.prototype;
      return (
        (t.offsetName = function (e, t) {
          throw new m();
        }),
        (t.formatOffset = function (e, t) {
          throw new m();
        }),
        (t.offset = function (e) {
          throw new m();
        }),
        (t.equals = function (e) {
          throw new m();
        }),
        o(e, [
          {
            key: "type",
            get: function () {
              throw new m();
            },
          },
          {
            key: "name",
            get: function () {
              throw new m();
            },
          },
          {
            key: "isUniversal",
            get: function () {
              throw new m();
            },
          },
          {
            key: "isValid",
            get: function () {
              throw new m();
            },
          },
        ]),
        e
      );
    })(),
    Ce = null,
    Fe = (function (e) {
      function t() {
        return e.apply(this, arguments) || this;
      }
      i(t, e);
      var n = t.prototype;
      return (
        (n.offsetName = function (e, t) {
          return ue(e, t.format, t.locale);
        }),
        (n.formatOffset = function (e, t) {
          return fe(this.offset(e), t);
        }),
        (n.offset = function (e) {
          return -new Date(e).getTimezoneOffset();
        }),
        (n.equals = function (e) {
          return "system" === e.type;
        }),
        o(
          t,
          [
            {
              key: "type",
              get: function () {
                return "system";
              },
            },
            {
              key: "name",
              get: function () {
                return new Intl.DateTimeFormat().resolvedOptions().timeZone;
              },
            },
            {
              key: "isUniversal",
              get: function () {
                return !1;
              },
            },
            {
              key: "isValid",
              get: function () {
                return !0;
              },
            },
          ],
          [
            {
              key: "instance",
              get: function () {
                return (Ce = null === Ce ? new t() : Ce);
              },
            },
          ],
        ),
        t
      );
    })(xe),
    Ze = RegExp("^" + he.source + "$"),
    Le = {};
  var Ae = { year: 0, month: 1, day: 2, hour: 3, minute: 4, second: 5 };
  var ze = {},
    je = (function (n) {
      function r(e) {
        var t = n.call(this) || this;
        return (t.zoneName = e), (t.valid = r.isValidZone(e)), t;
      }
      i(r, n),
        (r.create = function (e) {
          return ze[e] || (ze[e] = new r(e)), ze[e];
        }),
        (r.resetCache = function () {
          (ze = {}), (Le = {});
        }),
        (r.isValidSpecifier = function (e) {
          return !(!e || !e.match(Ze));
        }),
        (r.isValidZone = function (e) {
          try {
            return (
              new Intl.DateTimeFormat("en-US", { timeZone: e }).format(), !0
            );
          } catch (e) {
            return !1;
          }
        }),
        (r.parseGMTOffset = function (e) {
          if (e) {
            e = e.match(/^Etc\/GMT(0|[+-]\d{1,2})$/i);
            if (e) return -60 * parseInt(e[1]);
          }
          return null;
        });
      var e = r.prototype;
      return (
        (e.offsetName = function (e, t) {
          return ue(e, t.format, t.locale, this.name);
        }),
        (e.formatOffset = function (e, t) {
          return fe(this.offset(e), t);
        }),
        (e.offset = function (e) {
          var t = new Date(e);
          if (isNaN(t)) return NaN;
          var n,
            r,
            e =
              ((r = this.name),
              Le[r] ||
                (Le[r] = new Intl.DateTimeFormat("en-US", {
                  hourCycle: "h23",
                  timeZone: r,
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })),
              Le[r]),
            n = e.formatToParts
              ? (function (e, t) {
                  for (
                    var n = e.formatToParts(t), r = [], i = 0;
                    i < n.length;
                    i++
                  ) {
                    var o = n[i],
                      a = o.type,
                      o = o.value,
                      a = Ae[a];
                    P(a) || (r[a] = parseInt(o, 10));
                  }
                  return r;
                })(e, t)
              : ((r = t),
                (n = (i = e).format(r).replace(/\u200E/g, "")),
                (r = (i = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(
                  n,
                ))[1]),
                (n = i[2]),
                [i[3], r, n, i[4], i[5], i[6]]),
            i = +t,
            t = i % 1e3;
          return (
            (ie({
              year: n[0],
              month: n[1],
              day: n[2],
              hour: n[3],
              minute: n[4],
              second: n[5],
              millisecond: 0,
            }) -
              (i -= 0 <= t ? t : 1e3 + t)) /
            6e4
          );
        }),
        (e.equals = function (e) {
          return "iana" === e.type && e.name === this.name;
        }),
        o(r, [
          {
            key: "type",
            get: function () {
              return "iana";
            },
          },
          {
            key: "name",
            get: function () {
              return this.zoneName;
            },
          },
          {
            key: "isUniversal",
            get: function () {
              return !1;
            },
          },
          {
            key: "isValid",
            get: function () {
              return this.valid;
            },
          },
        ]),
        r
      );
    })(xe),
    qe = null,
    _e = (function (n) {
      function t(e) {
        var t = n.call(this) || this;
        return (t.fixed = e), t;
      }
      i(t, n),
        (t.instance = function (e) {
          return 0 === e ? t.utcInstance : new t(e);
        }),
        (t.parseSpecifier = function (e) {
          if (e) {
            e = e.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
            if (e) return new t(se(e[1], e[2]));
          }
          return null;
        });
      var e = t.prototype;
      return (
        (e.offsetName = function () {
          return this.name;
        }),
        (e.formatOffset = function (e, t) {
          return fe(this.fixed, t);
        }),
        (e.offset = function () {
          return this.fixed;
        }),
        (e.equals = function (e) {
          return "fixed" === e.type && e.fixed === this.fixed;
        }),
        o(
          t,
          [
            {
              key: "type",
              get: function () {
                return "fixed";
              },
            },
            {
              key: "name",
              get: function () {
                return 0 === this.fixed
                  ? "UTC"
                  : "UTC" + fe(this.fixed, "narrow");
              },
            },
            {
              key: "isUniversal",
              get: function () {
                return !0;
              },
            },
            {
              key: "isValid",
              get: function () {
                return !0;
              },
            },
          ],
          [
            {
              key: "utcInstance",
              get: function () {
                return (qe = null === qe ? new t(0) : qe);
              },
            },
          ],
        ),
        t
      );
    })(xe),
    Ue = (function (n) {
      function e(e) {
        var t = n.call(this) || this;
        return (t.zoneName = e), t;
      }
      i(e, n);
      var t = e.prototype;
      return (
        (t.offsetName = function () {
          return null;
        }),
        (t.formatOffset = function () {
          return "";
        }),
        (t.offset = function () {
          return NaN;
        }),
        (t.equals = function () {
          return !1;
        }),
        o(e, [
          {
            key: "type",
            get: function () {
              return "invalid";
            },
          },
          {
            key: "name",
            get: function () {
              return this.zoneName;
            },
          },
          {
            key: "isUniversal",
            get: function () {
              return !1;
            },
          },
          {
            key: "isValid",
            get: function () {
              return !1;
            },
          },
        ]),
        e
      );
    })(xe);
  function Re(e, t) {
    if (P(e) || null === e) return t;
    if (e instanceof xe) return e;
    if ("string" != typeof e)
      return W(e)
        ? _e.instance(e)
        : "object" == typeof e && e.offset && "number" == typeof e.offset
          ? e
          : new Ue(e);
    var n = e.toLowerCase();
    return "local" === n || "system" === n
      ? t
      : "utc" === n || "gmt" === n
        ? _e.utcInstance
        : null != (t = je.parseGMTOffset(e))
          ? _e.instance(t)
          : je.isValidSpecifier(n)
            ? je.create(e)
            : _e.parseSpecifier(n) || new Ue(e);
  }
  var He,
    Pe = function () {
      return Date.now();
    },
    We = "system",
    Je = null,
    Ye = null,
    Ge = null,
    $e = (function () {
      function e() {}
      return (
        (e.resetCaches = function () {
          ut.resetCache(), je.resetCache();
        }),
        o(e, null, [
          {
            key: "now",
            get: function () {
              return Pe;
            },
            set: function (e) {
              Pe = e;
            },
          },
          {
            key: "defaultZone",
            get: function () {
              return Re(We, Fe.instance);
            },
            set: function (e) {
              We = e;
            },
          },
          {
            key: "defaultLocale",
            get: function () {
              return Je;
            },
            set: function (e) {
              Je = e;
            },
          },
          {
            key: "defaultNumberingSystem",
            get: function () {
              return Ye;
            },
            set: function (e) {
              Ye = e;
            },
          },
          {
            key: "defaultOutputCalendar",
            get: function () {
              return Ge;
            },
            set: function (e) {
              Ge = e;
            },
          },
          {
            key: "throwOnInvalid",
            get: function () {
              return He;
            },
            set: function (e) {
              He = e;
            },
          },
        ]),
        e
      );
    })(),
    Be = ["base"],
    Qe = {};
  function Ke(e, t) {
    void 0 === t && (t = {});
    var n = JSON.stringify([e, t]),
      r = Qe[n];
    return r || ((r = new Intl.DateTimeFormat(e, t)), (Qe[n] = r)), r;
  }
  var Xe = {};
  var et = {};
  function tt(e, t) {
    var n = (t = void 0 === t ? {} : t);
    n.base;
    var r = (function (e, t) {
        if (null == e) return {};
        for (var n, r = {}, i = Object.keys(e), o = 0; o < i.length; o++)
          (n = i[o]), 0 <= t.indexOf(n) || (r[n] = e[n]);
        return r;
      })(n, Be),
      n = JSON.stringify([e, r]),
      r = et[n];
    return r || ((r = new Intl.RelativeTimeFormat(e, t)), (et[n] = r)), r;
  }
  var nt = null;
  function rt(e, t, n, r, i) {
    n = e.listingMode(n);
    return "error" === n ? null : ("en" === n ? r : i)(t);
  }
  var it = (function () {
      function e(e, t, n) {
        (this.padTo = n.padTo || 0),
          (this.floor = n.floor || !1),
          t ||
            ((t = { useGrouping: !1 }),
            0 < n.padTo && (t.minimumIntegerDigits = n.padTo),
            (this.inf = (function (e, t) {
              void 0 === t && (t = {});
              var n = JSON.stringify([e, t]),
                r = Xe[n];
              return r || ((r = new Intl.NumberFormat(e, t)), (Xe[n] = r)), r;
            })(e, t)));
      }
      return (
        (e.prototype.format = function (e) {
          if (this.inf) {
            var t = this.floor ? Math.floor(e) : e;
            return this.inf.format(t);
          }
          return Q(this.floor ? Math.floor(e) : ee(e, 3), this.padTo);
        }),
        e
      );
    })(),
    ot = (function () {
      function e(e, t, n) {
        var r, i, o;
        (this.opts = n),
          e.zone.isUniversal
            ? ((o = (e.offset / 60) * -1),
              (o = je.isValidZone(
                (i = 0 <= o ? "Etc/GMT+" + o : "Etc/GMT" + o),
              )),
              0 !== e.offset && o
                ? ((r = i), (this.dt = e))
                : ((r = "UTC"),
                  n.timeZoneName
                    ? (this.dt = e)
                    : (this.dt =
                        0 === e.offset
                          ? e
                          : tr.fromMillis(e.ts + 60 * e.offset * 1e3))))
            : "system" === e.zone.type
              ? (this.dt = e)
              : (r = (this.dt = e).zone.name);
        e = u({}, this.opts);
        r && (e.timeZone = r), (this.dtf = Ke(t, e));
      }
      var t = e.prototype;
      return (
        (t.format = function () {
          return this.dtf.format(this.dt.toJSDate());
        }),
        (t.formatToParts = function () {
          return this.dtf.formatToParts(this.dt.toJSDate());
        }),
        (t.resolvedOptions = function () {
          return this.dtf.resolvedOptions();
        }),
        e
      );
    })(),
    at = (function () {
      function e(e, t, n) {
        (this.opts = u({ style: "long" }, n)),
          !t && Y() && (this.rtf = tt(e, n));
      }
      var t = e.prototype;
      return (
        (t.format = function (e, t) {
          return this.rtf
            ? this.rtf.format(e, t)
            : (function (e, t, n, r) {
                void 0 === n && (n = "always"), void 0 === r && (r = !1);
                var i = {
                    years: ["year", "yr."],
                    quarters: ["quarter", "qtr."],
                    months: ["month", "mo."],
                    weeks: ["week", "wk."],
                    days: ["day", "day", "days"],
                    hours: ["hour", "hr."],
                    minutes: ["minute", "min."],
                    seconds: ["second", "sec."],
                  },
                  o = -1 === ["hours", "minutes", "seconds"].indexOf(e);
                if ("auto" === n && o) {
                  var a = "days" === e;
                  switch (t) {
                    case 1:
                      return a ? "tomorrow" : "next " + i[e][0];
                    case -1:
                      return a ? "yesterday" : "last " + i[e][0];
                    case 0:
                      return a ? "today" : "this " + i[e][0];
                  }
                }
                var u = Object.is(t, -0) || t < 0,
                  o = 1 === (n = Math.abs(t)),
                  t = i[e],
                  o = r ? (!o && t[2]) || t[1] : o ? i[e][0] : e;
                return u ? n + " " + o + " ago" : "in " + n + " " + o;
              })(t, e, this.opts.numeric, "long" !== this.opts.style);
        }),
        (t.formatToParts = function (e, t) {
          return this.rtf ? this.rtf.formatToParts(e, t) : [];
        }),
        e
      );
    })(),
    ut = (function () {
      function i(e, t, n, r) {
        var i = (function (e) {
            var t = e.indexOf("-u-");
            if (-1 === t) return [e];
            t = e.substring(0, t);
            try {
              n = Ke(e).resolvedOptions();
            } catch (e) {
              n = Ke(t).resolvedOptions();
            }
            var n = n;
            return [t, n.numberingSystem, n.calendar];
          })(e),
          o = i[0],
          e = i[1],
          i = i[2];
        (this.locale = o),
          (this.numberingSystem = t || e || null),
          (this.outputCalendar = n || i || null),
          (this.intl =
            ((e = this.locale),
            (n = this.numberingSystem),
            ((i = this.outputCalendar) || n) &&
              ((e += "-u"), i && (e += "-ca-" + i), n && (e += "-nu-" + n)),
            e)),
          (this.weekdaysCache = { format: {}, standalone: {} }),
          (this.monthsCache = { format: {}, standalone: {} }),
          (this.meridiemCache = null),
          (this.eraCache = {}),
          (this.specifiedLocale = r),
          (this.fastNumbersCached = null);
      }
      (i.fromOpts = function (e) {
        return i.create(
          e.locale,
          e.numberingSystem,
          e.outputCalendar,
          e.defaultToEN,
        );
      }),
        (i.create = function (e, t, n, r) {
          void 0 === r && (r = !1);
          e = e || $e.defaultLocale;
          return new i(
            e ||
              (r
                ? "en-US"
                : (nt =
                    nt || new Intl.DateTimeFormat().resolvedOptions().locale)),
            t || $e.defaultNumberingSystem,
            n || $e.defaultOutputCalendar,
            e,
          );
        }),
        (i.resetCache = function () {
          (nt = null), (Qe = {}), (Xe = {}), (et = {});
        }),
        (i.fromObject = function (e) {
          var t = void 0 === e ? {} : e,
            n = t.locale,
            e = t.numberingSystem,
            t = t.outputCalendar;
          return i.create(n, e, t);
        });
      var e = i.prototype;
      return (
        (e.listingMode = function (e) {
          var t = this.isEnglish(),
            n = !(
              (null !== this.numberingSystem &&
                "latn" !== this.numberingSystem) ||
              (null !== this.outputCalendar &&
                "gregory" !== this.outputCalendar)
            );
          return t && n ? "en" : "intl";
        }),
        (e.clone = function (e) {
          return e && 0 !== Object.getOwnPropertyNames(e).length
            ? i.create(
                e.locale || this.specifiedLocale,
                e.numberingSystem || this.numberingSystem,
                e.outputCalendar || this.outputCalendar,
                e.defaultToEN || !1,
              )
            : this;
        }),
        (e.redefaultToEN = function (e) {
          return this.clone(
            u({}, (e = void 0 === e ? {} : e), { defaultToEN: !0 }),
          );
        }),
        (e.redefaultToSystem = function (e) {
          return this.clone(
            u({}, (e = void 0 === e ? {} : e), { defaultToEN: !1 }),
          );
        }),
        (e.months = function (n, r, e) {
          var i = this;
          return (
            void 0 === r && (r = !1),
            rt(this, n, (e = void 0 === e ? !0 : e), pe, function () {
              var t = r ? { month: n, day: "numeric" } : { month: n },
                e = r ? "format" : "standalone";
              return (
                i.monthsCache[e][n] ||
                  (i.monthsCache[e][n] = (function (e) {
                    for (var t = [], n = 1; n <= 12; n++) {
                      var r = tr.utc(2016, n, 1);
                      t.push(e(r));
                    }
                    return t;
                  })(function (e) {
                    return i.extract(e, t, "month");
                  })),
                i.monthsCache[e][n]
              );
            })
          );
        }),
        (e.weekdays = function (n, r, e) {
          var i = this;
          return (
            void 0 === r && (r = !1),
            rt(this, n, (e = void 0 === e ? !0 : e), Se, function () {
              var t = r
                  ? {
                      weekday: n,
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  : { weekday: n },
                e = r ? "format" : "standalone";
              return (
                i.weekdaysCache[e][n] ||
                  (i.weekdaysCache[e][n] = (function (e) {
                    for (var t = [], n = 1; n <= 7; n++) {
                      var r = tr.utc(2016, 11, 13 + n);
                      t.push(e(r));
                    }
                    return t;
                  })(function (e) {
                    return i.extract(e, t, "weekday");
                  })),
                i.weekdaysCache[e][n]
              );
            })
          );
        }),
        (e.meridiems = function (e) {
          var n = this;
          return rt(
            this,
            void 0,
            (e = void 0 === e ? !0 : e),
            function () {
              return Te;
            },
            function () {
              var t;
              return (
                n.meridiemCache ||
                  ((t = { hour: "numeric", hourCycle: "h12" }),
                  (n.meridiemCache = [
                    tr.utc(2016, 11, 13, 9),
                    tr.utc(2016, 11, 13, 19),
                  ].map(function (e) {
                    return n.extract(e, t, "dayperiod");
                  }))),
                n.meridiemCache
              );
            },
          );
        }),
        (e.eras = function (e, t) {
          var n = this;
          return rt(this, e, (t = void 0 === t ? !0 : t), Ne, function () {
            var t = { era: e };
            return (
              n.eraCache[e] ||
                (n.eraCache[e] = [tr.utc(-40, 1, 1), tr.utc(2017, 1, 1)].map(
                  function (e) {
                    return n.extract(e, t, "era");
                  },
                )),
              n.eraCache[e]
            );
          });
        }),
        (e.extract = function (e, t, n) {
          t = this.dtFormatter(e, t)
            .formatToParts()
            .find(function (e) {
              return e.type.toLowerCase() === n;
            });
          return t ? t.value : null;
        }),
        (e.numberFormatter = function (e) {
          return new it(
            this.intl,
            (e = void 0 === e ? {} : e).forceSimple || this.fastNumbers,
            e,
          );
        }),
        (e.dtFormatter = function (e, t) {
          return new ot(e, this.intl, (t = void 0 === t ? {} : t));
        }),
        (e.relFormatter = function (e) {
          return (
            void 0 === e && (e = {}), new at(this.intl, this.isEnglish(), e)
          );
        }),
        (e.isEnglish = function () {
          return (
            "en" === this.locale ||
            "en-us" === this.locale.toLowerCase() ||
            new Intl.DateTimeFormat(this.intl)
              .resolvedOptions()
              .locale.startsWith("en-us")
          );
        }),
        (e.equals = function (e) {
          return (
            this.locale === e.locale &&
            this.numberingSystem === e.numberingSystem &&
            this.outputCalendar === e.outputCalendar
          );
        }),
        o(i, [
          {
            key: "fastNumbers",
            get: function () {
              var e;
              return (
                null == this.fastNumbersCached &&
                  (this.fastNumbersCached =
                    (!(e = this).numberingSystem ||
                      "latn" === e.numberingSystem) &&
                    ("latn" === e.numberingSystem ||
                      !e.locale ||
                      e.locale.startsWith("en") ||
                      "latn" ===
                        new Intl.DateTimeFormat(e.intl).resolvedOptions()
                          .numberingSystem)),
                this.fastNumbersCached
              );
            },
          },
        ]),
        i
      );
    })();
  function st() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
      t[n] = arguments[n];
    var r = t.reduce(function (e, t) {
      return e + t.source;
    }, "");
    return RegExp("^" + r + "$");
  }
  function ct() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
      t[n] = arguments[n];
    return function (o) {
      return t
        .reduce(
          function (e, t) {
            var n = e[0],
              r = e[1],
              i = e[2],
              e = t(o, i),
              t = e[0],
              i = e[1],
              e = e[2];
            return [u({}, n, t), r || i, e];
          },
          [{}, null, 1],
        )
        .slice(0, 2);
    };
  }
  function lt(e) {
    if (null == e) return [null, null];
    for (
      var t = arguments.length, n = new Array(1 < t ? t - 1 : 0), r = 1;
      r < t;
      r++
    )
      n[r - 1] = arguments[r];
    for (var i = 0, o = n; i < o.length; i++) {
      var a = o[i],
        u = a[0],
        a = a[1],
        u = u.exec(e);
      if (u) return a(u);
    }
    return [null, null];
  }
  function ft() {
    for (var e = arguments.length, i = new Array(e), t = 0; t < e; t++)
      i[t] = arguments[t];
    return function (e, t) {
      for (var n = {}, r = 0; r < i.length; r++) n[i[r]] = K(e[t + r]);
      return [n, null, t + r];
    };
  }
  var dt = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/,
    ht = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/,
    n = RegExp("" + ht.source + dt.source + "?"),
    g = RegExp("(?:T" + n.source + ")?"),
    p = ft("weekYear", "weekNumber", "weekDay"),
    w = ft("year", "ordinal"),
    dt = RegExp(ht.source + " ?(?:" + dt.source + "|(" + he.source + "))?"),
    he = RegExp("(?: " + dt.source + ")?");
  function mt(e, t, n) {
    t = e[t];
    return P(t) ? n : K(t);
  }
  function yt(e, t) {
    return [
      { year: mt(e, t), month: mt(e, t + 1, 1), day: mt(e, t + 2, 1) },
      null,
      t + 3,
    ];
  }
  function vt(e, t) {
    return [
      {
        hours: mt(e, t, 0),
        minutes: mt(e, t + 1, 0),
        seconds: mt(e, t + 2, 0),
        milliseconds: X(e[t + 3]),
      },
      null,
      t + 4,
    ];
  }
  function pt(e, t) {
    var n = !e[t] && !e[t + 1],
      e = se(e[t + 1], e[t + 2]);
    return [{}, n ? null : _e.instance(e), t + 3];
  }
  function gt(e, t) {
    return [{}, e[t] ? je.create(e[t]) : null, t + 1];
  }
  var wt = RegExp("^T?" + ht.source + "$"),
    kt =
      /^-?P(?:(?:(-?\d{1,9})Y)?(?:(-?\d{1,9})M)?(?:(-?\d{1,9})W)?(?:(-?\d{1,9})D)?(?:T(?:(-?\d{1,9})H)?(?:(-?\d{1,9})M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,9}))?S)?)?)$/;
  function St(e) {
    var t = e[0],
      n = e[1],
      r = e[2],
      i = e[3],
      o = e[4],
      a = e[5],
      u = e[6],
      s = e[7],
      c = e[8],
      l = "-" === t[0],
      e = s && "-" === s[0],
      t = function (e, t) {
        return (
          void 0 === t && (t = !1), void 0 !== e && (t || (e && l)) ? -e : e
        );
      };
    return [
      {
        years: t(K(n)),
        months: t(K(r)),
        weeks: t(K(i)),
        days: t(K(o)),
        hours: t(K(a)),
        minutes: t(K(u)),
        seconds: t(K(s), "-0" === s),
        milliseconds: t(X(c), e),
      },
    ];
  }
  var Tt = {
    GMT: 0,
    EDT: -240,
    EST: -300,
    CDT: -300,
    CST: -360,
    MDT: -360,
    MST: -420,
    PDT: -420,
    PST: -480,
  };
  function bt(e, t, n, r, i, o, a) {
    o = {
      year: 2 === t.length ? ae(K(t)) : K(t),
      month: ye.indexOf(n) + 1,
      day: K(r),
      hour: K(i),
      minute: K(o),
    };
    return (
      a && (o.second = K(a)),
      e && (o.weekday = 3 < e.length ? ge.indexOf(e) + 1 : we.indexOf(e) + 1),
      o
    );
  }
  var Ot =
    /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
  function Mt(e) {
    var t = e[1],
      n = e[2],
      r = e[3],
      i = e[4],
      o = e[5],
      a = e[6],
      u = e[7],
      s = e[8],
      c = e[9],
      l = e[10],
      e = e[11],
      u = bt(t, i, r, n, o, a, u),
      e = s ? Tt[s] : c ? 0 : se(l, e);
    return [u, new _e(e)];
  }
  var Nt =
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/,
    Dt =
      /^(Monday|Tuesday|Wedsday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/,
    Et =
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
  function It(e) {
    var t = e[1],
      n = e[2],
      r = e[3];
    return [bt(t, e[4], r, n, e[5], e[6], e[7]), _e.utcInstance];
  }
  function Vt(e) {
    var t = e[1],
      n = e[2],
      r = e[3],
      i = e[4],
      o = e[5],
      a = e[6];
    return [bt(t, e[7], n, r, i, o, a), _e.utcInstance];
  }
  var xt = st(/([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/, g),
    Ct = st(/(\d{4})-?W(\d\d)(?:-?(\d))?/, g),
    Ft = st(/(\d{4})-?(\d{3})/, g),
    Zt = st(n),
    Lt = ct(yt, vt, pt),
    At = ct(p, vt, pt),
    zt = ct(w, vt, pt),
    jt = ct(vt, pt);
  var qt = ct(vt);
  var _t = st(/(\d{4})-(\d\d)-(\d\d)/, he),
    Ut = st(dt),
    Rt = ct(yt, vt, pt, gt),
    Ht = ct(vt, pt, gt);
  var w = {
      weeks: {
        days: 7,
        hours: 168,
        minutes: 10080,
        seconds: 604800,
        milliseconds: 6048e5,
      },
      days: { hours: 24, minutes: 1440, seconds: 86400, milliseconds: 864e5 },
      hours: { minutes: 60, seconds: 3600, milliseconds: 36e5 },
      minutes: { seconds: 60, milliseconds: 6e4 },
      seconds: { milliseconds: 1e3 },
    },
    Pt = u(
      {
        years: {
          quarters: 4,
          months: 12,
          weeks: 52,
          days: 365,
          hours: 8760,
          minutes: 525600,
          seconds: 31536e3,
          milliseconds: 31536e6,
        },
        quarters: {
          months: 3,
          weeks: 13,
          days: 91,
          hours: 2184,
          minutes: 131040,
          seconds: 7862400,
          milliseconds: 78624e5,
        },
        months: {
          weeks: 4,
          days: 30,
          hours: 720,
          minutes: 43200,
          seconds: 2592e3,
          milliseconds: 2592e6,
        },
      },
      w,
    ),
    he = 365.2425,
    dt = 30.436875,
    Wt = u(
      {
        years: {
          quarters: 4,
          months: 12,
          weeks: he / 7,
          days: he,
          hours: 24 * he,
          minutes: 525949.2,
          seconds: 525949.2 * 60,
          milliseconds: 525949.2 * 60 * 1e3,
        },
        quarters: {
          months: 3,
          weeks: he / 28,
          days: he / 4,
          hours: (24 * he) / 4,
          minutes: 131487.3,
          seconds: (525949.2 * 60) / 4,
          milliseconds: 7889237999.999999,
        },
        months: {
          weeks: dt / 7,
          days: dt,
          hours: 24 * dt,
          minutes: 43829.1,
          seconds: 2629746,
          milliseconds: 2629746e3,
        },
      },
      w,
    ),
    Jt = [
      "years",
      "quarters",
      "months",
      "weeks",
      "days",
      "hours",
      "minutes",
      "seconds",
      "milliseconds",
    ],
    Yt = Jt.slice(0).reverse();
  function Gt(e, t, n) {
    e = {
      values: (n = void 0 === n ? !1 : n)
        ? t.values
        : u({}, e.values, t.values || {}),
      loc: e.loc.clone(t.loc),
      conversionAccuracy: t.conversionAccuracy || e.conversionAccuracy,
    };
    return new Bt(e);
  }
  function $t(e, t, n, r, i) {
    var o = e[i][n],
      a = t[n] / o,
      a =
        !(Math.sign(a) === Math.sign(r[i])) && 0 !== r[i] && Math.abs(a) <= 1
          ? (e = a) < 0
            ? Math.floor(e)
            : Math.ceil(e)
          : Math.trunc(a);
    (r[i] += a), (t[n] -= a * o);
  }
  var Bt = (function () {
    function m(e) {
      var t = "longterm" === e.conversionAccuracy || !1;
      (this.values = e.values),
        (this.loc = e.loc || ut.create()),
        (this.conversionAccuracy = t ? "longterm" : "casual"),
        (this.invalid = e.invalid || null),
        (this.matrix = t ? Wt : Pt),
        (this.isLuxonDuration = !0);
    }
    (m.fromMillis = function (e, t) {
      return m.fromObject({ milliseconds: e }, t);
    }),
      (m.fromObject = function (e, t) {
        if ((void 0 === t && (t = {}), null == e || "object" != typeof e))
          throw new v(
            "Duration.fromObject: argument expected to be an object, got " +
              (null === e ? "null" : typeof e),
          );
        return new m({
          values: le(e, m.normalizeUnit),
          loc: ut.fromObject(t),
          conversionAccuracy: t.conversionAccuracy,
        });
      }),
      (m.fromISO = function (e, t) {
        var n = lt(e, [kt, St])[0];
        return n
          ? m.fromObject(n, t)
          : m.invalid(
              "unparsable",
              'the input "' + e + "\" can't be parsed as ISO 8601",
            );
      }),
      (m.fromISOTime = function (e, t) {
        var n = lt(e, [wt, qt])[0];
        return n
          ? m.fromObject(n, t)
          : m.invalid(
              "unparsable",
              'the input "' + e + "\" can't be parsed as ISO 8601",
            );
      }),
      (m.invalid = function (e, t) {
        if ((void 0 === t && (t = null), !e))
          throw new v("need to specify a reason the Duration is invalid");
        var n = e instanceof Ve ? e : new Ve(e, t);
        if ($e.throwOnInvalid) throw new h(n);
        return new m({ invalid: n });
      }),
      (m.normalizeUnit = function (e) {
        var t = {
          year: "years",
          years: "years",
          quarter: "quarters",
          quarters: "quarters",
          month: "months",
          months: "months",
          week: "weeks",
          weeks: "weeks",
          day: "days",
          days: "days",
          hour: "hours",
          hours: "hours",
          minute: "minutes",
          minutes: "minutes",
          second: "seconds",
          seconds: "seconds",
          millisecond: "milliseconds",
          milliseconds: "milliseconds",
        }[e && e.toLowerCase()];
        if (!t) throw new y(e);
        return t;
      }),
      (m.isDuration = function (e) {
        return (e && e.isLuxonDuration) || !1;
      });
    var e = m.prototype;
    return (
      (e.toFormat = function (e, t) {
        t = u({}, (t = void 0 === t ? {} : t), {
          floor: !1 !== t.round && !1 !== t.floor,
        });
        return this.isValid
          ? Ie.create(this.loc, t).formatDurationFromString(this, e)
          : "Invalid Duration";
      }),
      (e.toObject = function () {
        return this.isValid ? u({}, this.values) : {};
      }),
      (e.toISO = function () {
        if (!this.isValid) return null;
        var e = "P";
        return (
          0 !== this.years && (e += this.years + "Y"),
          (0 === this.months && 0 === this.quarters) ||
            (e += this.months + 3 * this.quarters + "M"),
          0 !== this.weeks && (e += this.weeks + "W"),
          0 !== this.days && (e += this.days + "D"),
          (0 === this.hours &&
            0 === this.minutes &&
            0 === this.seconds &&
            0 === this.milliseconds) ||
            (e += "T"),
          0 !== this.hours && (e += this.hours + "H"),
          0 !== this.minutes && (e += this.minutes + "M"),
          (0 === this.seconds && 0 === this.milliseconds) ||
            (e += ee(this.seconds + this.milliseconds / 1e3, 3) + "S"),
          "P" === e && (e += "T0S"),
          e
        );
      }),
      (e.toISOTime = function (e) {
        if ((void 0 === e && (e = {}), !this.isValid)) return null;
        var t = this.toMillis();
        if (t < 0 || 864e5 <= t) return null;
        e = u(
          {
            suppressMilliseconds: !1,
            suppressSeconds: !1,
            includePrefix: !1,
            format: "extended",
          },
          e,
        );
        var n = this.shiftTo("hours", "minutes", "seconds", "milliseconds"),
          t = "basic" === e.format ? "hhmm" : "hh:mm";
        (e.suppressSeconds && 0 === n.seconds && 0 === n.milliseconds) ||
          ((t += "basic" === e.format ? "ss" : ":ss"),
          (e.suppressMilliseconds && 0 === n.milliseconds) || (t += ".SSS"));
        t = n.toFormat(t);
        return (t = e.includePrefix ? "T" + t : t);
      }),
      (e.toJSON = function () {
        return this.toISO();
      }),
      (e.toString = function () {
        return this.toISO();
      }),
      (e.toMillis = function () {
        return this.as("milliseconds");
      }),
      (e.valueOf = function () {
        return this.toMillis();
      }),
      (e.plus = function (e) {
        if (!this.isValid) return this;
        for (var t = Qt(e), n = {}, r = k(Jt); !(i = r()).done; ) {
          var i = i.value;
          ($(t.values, i) || $(this.values, i)) &&
            (n[i] = t.get(i) + this.get(i));
        }
        return Gt(this, { values: n }, !0);
      }),
      (e.minus = function (e) {
        if (!this.isValid) return this;
        e = Qt(e);
        return this.plus(e.negate());
      }),
      (e.mapUnits = function (e) {
        if (!this.isValid) return this;
        for (
          var t = {}, n = 0, r = Object.keys(this.values);
          n < r.length;
          n++
        ) {
          var i = r[n];
          t[i] = ce(e(this.values[i], i));
        }
        return Gt(this, { values: t }, !0);
      }),
      (e.get = function (e) {
        return this[m.normalizeUnit(e)];
      }),
      (e.set = function (e) {
        return this.isValid
          ? Gt(this, { values: u({}, this.values, le(e, m.normalizeUnit)) })
          : this;
      }),
      (e.reconfigure = function (e) {
        var t = void 0 === e ? {} : e,
          n = t.locale,
          e = t.numberingSystem,
          t = t.conversionAccuracy,
          e = { loc: this.loc.clone({ locale: n, numberingSystem: e }) };
        return t && (e.conversionAccuracy = t), Gt(this, e);
      }),
      (e.as = function (e) {
        return this.isValid ? this.shiftTo(e).get(e) : NaN;
      }),
      (e.normalize = function () {
        if (!this.isValid) return this;
        var n,
          r,
          e = this.toObject();
        return (
          (n = this.matrix),
          (r = e),
          Yt.reduce(function (e, t) {
            return P(r[t]) ? e : (e && $t(n, r, e, r, t), t);
          }, null),
          Gt(this, { values: e }, !0)
        );
      }),
      (e.shiftTo = function () {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        if (!this.isValid) return this;
        if (0 === t.length) return this;
        for (
          var r,
            t = t.map(function (e) {
              return m.normalizeUnit(e);
            }),
            i = {},
            o = {},
            a = this.toObject(),
            u = k(Jt);
          !(h = u()).done;

        ) {
          var s = h.value;
          if (0 <= t.indexOf(s)) {
            var c,
              l = s,
              f = 0;
            for (c in o) (f += this.matrix[c][s] * o[c]), (o[c] = 0);
            W(a[s]) && (f += a[s]);
            var d,
              h = Math.trunc(f);
            for (d in ((i[s] = h), (o[s] = f - h), a))
              Jt.indexOf(d) > Jt.indexOf(s) && $t(this.matrix, a, d, i, s);
          } else W(a[s]) && (o[s] = a[s]);
        }
        for (r in o)
          0 !== o[r] && (i[l] += r === l ? o[r] : o[r] / this.matrix[l][r]);
        return Gt(this, { values: i }, !0).normalize();
      }),
      (e.negate = function () {
        if (!this.isValid) return this;
        for (
          var e = {}, t = 0, n = Object.keys(this.values);
          t < n.length;
          t++
        ) {
          var r = n[t];
          e[r] = -this.values[r];
        }
        return Gt(this, { values: e }, !0);
      }),
      (e.equals = function (e) {
        if (!this.isValid || !e.isValid) return !1;
        if (!this.loc.equals(e.loc)) return !1;
        for (var t, n, r = k(Jt); !(i = r()).done; ) {
          var i = i.value;
          if (
            ((t = this.values[i]),
            (n = e.values[i]),
            !(void 0 === t || 0 === t ? void 0 === n || 0 === n : t === n))
          )
            return !1;
        }
        return !0;
      }),
      o(m, [
        {
          key: "locale",
          get: function () {
            return this.isValid ? this.loc.locale : null;
          },
        },
        {
          key: "numberingSystem",
          get: function () {
            return this.isValid ? this.loc.numberingSystem : null;
          },
        },
        {
          key: "years",
          get: function () {
            return this.isValid ? this.values.years || 0 : NaN;
          },
        },
        {
          key: "quarters",
          get: function () {
            return this.isValid ? this.values.quarters || 0 : NaN;
          },
        },
        {
          key: "months",
          get: function () {
            return this.isValid ? this.values.months || 0 : NaN;
          },
        },
        {
          key: "weeks",
          get: function () {
            return this.isValid ? this.values.weeks || 0 : NaN;
          },
        },
        {
          key: "days",
          get: function () {
            return this.isValid ? this.values.days || 0 : NaN;
          },
        },
        {
          key: "hours",
          get: function () {
            return this.isValid ? this.values.hours || 0 : NaN;
          },
        },
        {
          key: "minutes",
          get: function () {
            return this.isValid ? this.values.minutes || 0 : NaN;
          },
        },
        {
          key: "seconds",
          get: function () {
            return this.isValid ? this.values.seconds || 0 : NaN;
          },
        },
        {
          key: "milliseconds",
          get: function () {
            return this.isValid ? this.values.milliseconds || 0 : NaN;
          },
        },
        {
          key: "isValid",
          get: function () {
            return null === this.invalid;
          },
        },
        {
          key: "invalidReason",
          get: function () {
            return this.invalid ? this.invalid.reason : null;
          },
        },
        {
          key: "invalidExplanation",
          get: function () {
            return this.invalid ? this.invalid.explanation : null;
          },
        },
      ]),
      m
    );
  })();
  function Qt(e) {
    if (W(e)) return Bt.fromMillis(e);
    if (Bt.isDuration(e)) return e;
    if ("object" == typeof e) return Bt.fromObject(e);
    throw new v("Unknown duration argument " + e + " of type " + typeof e);
  }
  var Kt = "Invalid Interval";
  var Xt = (function () {
      function c(e) {
        (this.s = e.start),
          (this.e = e.end),
          (this.invalid = e.invalid || null),
          (this.isLuxonInterval = !0);
      }
      (c.invalid = function (e, t) {
        if ((void 0 === t && (t = null), !e))
          throw new v("need to specify a reason the Interval is invalid");
        var n = e instanceof Ve ? e : new Ve(e, t);
        if ($e.throwOnInvalid) throw new d(n);
        return new c({ invalid: n });
      }),
        (c.fromDateTimes = function (e, t) {
          var n = nr(e),
            r = nr(t),
            e =
              ((e = r),
              (t = n) && t.isValid
                ? e && e.isValid
                  ? e < t
                    ? Xt.invalid(
                        "end before start",
                        "The end of an interval must be after its start, but you had start=" +
                          t.toISO() +
                          " and end=" +
                          e.toISO(),
                      )
                    : null
                  : Xt.invalid("missing or invalid end")
                : Xt.invalid("missing or invalid start"));
          return null == e ? new c({ start: n, end: r }) : e;
        }),
        (c.after = function (e, t) {
          (t = Qt(t)), (e = nr(e));
          return c.fromDateTimes(e, e.plus(t));
        }),
        (c.before = function (e, t) {
          (t = Qt(t)), (e = nr(e));
          return c.fromDateTimes(e.minus(t), e);
        }),
        (c.fromISO = function (e, t) {
          var n,
            r,
            i,
            o = (e || "").split("/", 2),
            a = o[0],
            u = o[1];
          if (a && u) {
            try {
              s = (n = tr.fromISO(a, t)).isValid;
            } catch (u) {
              s = !1;
            }
            try {
              i = (r = tr.fromISO(u, t)).isValid;
            } catch (u) {
              i = !1;
            }
            if (s && i) return c.fromDateTimes(n, r);
            if (s) {
              var s = Bt.fromISO(u, t);
              if (s.isValid) return c.after(n, s);
            } else if (i) {
              t = Bt.fromISO(a, t);
              if (t.isValid) return c.before(r, t);
            }
          }
          return c.invalid(
            "unparsable",
            'the input "' + e + "\" can't be parsed as ISO 8601",
          );
        }),
        (c.isInterval = function (e) {
          return (e && e.isLuxonInterval) || !1;
        });
      var e = c.prototype;
      return (
        (e.length = function (e) {
          return (
            void 0 === e && (e = "milliseconds"),
            this.isValid ? this.toDuration.apply(this, [e]).get(e) : NaN
          );
        }),
        (e.count = function (e) {
          if (!this.isValid) return NaN;
          var t = this.start.startOf((e = void 0 === e ? "milliseconds" : e)),
            n = this.end.startOf(e);
          return Math.floor(n.diff(t, e).get(e)) + 1;
        }),
        (e.hasSame = function (e) {
          return (
            !!this.isValid &&
            (this.isEmpty() || this.e.minus(1).hasSame(this.s, e))
          );
        }),
        (e.isEmpty = function () {
          return this.s.valueOf() === this.e.valueOf();
        }),
        (e.isAfter = function (e) {
          return !!this.isValid && this.s > e;
        }),
        (e.isBefore = function (e) {
          return !!this.isValid && this.e <= e;
        }),
        (e.contains = function (e) {
          return !!this.isValid && this.s <= e && this.e > e;
        }),
        (e.set = function (e) {
          var t = void 0 === e ? {} : e,
            e = t.start,
            t = t.end;
          return this.isValid
            ? c.fromDateTimes(e || this.s, t || this.e)
            : this;
        }),
        (e.splitAt = function () {
          var t = this;
          if (!this.isValid) return [];
          for (var e = arguments.length, n = new Array(e), r = 0; r < e; r++)
            n[r] = arguments[r];
          for (
            var i = n
                .map(nr)
                .filter(function (e) {
                  return t.contains(e);
                })
                .sort(),
              o = [],
              a = this.s,
              u = 0;
            a < this.e;

          ) {
            var s = i[u] || this.e,
              s = +s > +this.e ? this.e : s;
            o.push(c.fromDateTimes(a, s)), (a = s), (u += 1);
          }
          return o;
        }),
        (e.splitBy = function (e) {
          var t = Qt(e);
          if (!this.isValid || !t.isValid || 0 === t.as("milliseconds"))
            return [];
          for (var n = this.s, r = 1, i = []; n < this.e; ) {
            var o = this.start.plus(
                t.mapUnits(function (e) {
                  return e * r;
                }),
              ),
              o = +o > +this.e ? this.e : o;
            i.push(c.fromDateTimes(n, o)), (n = o), (r += 1);
          }
          return i;
        }),
        (e.divideEqually = function (e) {
          return this.isValid
            ? this.splitBy(this.length() / e).slice(0, e)
            : [];
        }),
        (e.overlaps = function (e) {
          return this.e > e.s && this.s < e.e;
        }),
        (e.abutsStart = function (e) {
          return !!this.isValid && +this.e == +e.s;
        }),
        (e.abutsEnd = function (e) {
          return !!this.isValid && +e.e == +this.s;
        }),
        (e.engulfs = function (e) {
          return !!this.isValid && this.s <= e.s && this.e >= e.e;
        }),
        (e.equals = function (e) {
          return (
            !(!this.isValid || !e.isValid) &&
            this.s.equals(e.s) &&
            this.e.equals(e.e)
          );
        }),
        (e.intersection = function (e) {
          if (!this.isValid) return this;
          var t = (this.s > e.s ? this : e).s,
            e = (this.e < e.e ? this : e).e;
          return e <= t ? null : c.fromDateTimes(t, e);
        }),
        (e.union = function (e) {
          if (!this.isValid) return this;
          var t = (this.s < e.s ? this : e).s,
            e = (this.e > e.e ? this : e).e;
          return c.fromDateTimes(t, e);
        }),
        (c.merge = function (e) {
          var t = e
              .sort(function (e, t) {
                return e.s - t.s;
              })
              .reduce(
                function (e, t) {
                  var n = e[0],
                    e = e[1];
                  return e
                    ? e.overlaps(t) || e.abutsStart(t)
                      ? [n, e.union(t)]
                      : [n.concat([e]), t]
                    : [n, t];
                },
                [[], null],
              ),
            e = t[0],
            t = t[1];
          return t && e.push(t), e;
        }),
        (c.xor = function (e) {
          for (
            var t = null,
              n = 0,
              r = [],
              i = e.map(function (e) {
                return [
                  { time: e.s, type: "s" },
                  { time: e.e, type: "e" },
                ];
              }),
              o = k(
                (e = Array.prototype).concat.apply(e, i).sort(function (e, t) {
                  return e.time - t.time;
                }),
              );
            !(a = o()).done;

          )
            var a = a.value,
              t =
                1 === (n += "s" === a.type ? 1 : -1)
                  ? a.time
                  : (t && +t != +a.time && r.push(c.fromDateTimes(t, a.time)),
                    null);
          return c.merge(r);
        }),
        (e.difference = function () {
          for (
            var t = this, e = arguments.length, n = new Array(e), r = 0;
            r < e;
            r++
          )
            n[r] = arguments[r];
          return c
            .xor([this].concat(n))
            .map(function (e) {
              return t.intersection(e);
            })
            .filter(function (e) {
              return e && !e.isEmpty();
            });
        }),
        (e.toString = function () {
          return this.isValid
            ? "[" + this.s.toISO() + " – " + this.e.toISO() + ")"
            : Kt;
        }),
        (e.toISO = function (e) {
          return this.isValid ? this.s.toISO(e) + "/" + this.e.toISO(e) : Kt;
        }),
        (e.toISODate = function () {
          return this.isValid
            ? this.s.toISODate() + "/" + this.e.toISODate()
            : Kt;
        }),
        (e.toISOTime = function (e) {
          return this.isValid
            ? this.s.toISOTime(e) + "/" + this.e.toISOTime(e)
            : Kt;
        }),
        (e.toFormat = function (e, t) {
          (t = (void 0 === t ? {} : t).separator),
            (t = void 0 === t ? " – " : t);
          return this.isValid
            ? "" + this.s.toFormat(e) + t + this.e.toFormat(e)
            : Kt;
        }),
        (e.toDuration = function (e, t) {
          return this.isValid
            ? this.e.diff(this.s, e, t)
            : Bt.invalid(this.invalidReason);
        }),
        (e.mapEndpoints = function (e) {
          return c.fromDateTimes(e(this.s), e(this.e));
        }),
        o(c, [
          {
            key: "start",
            get: function () {
              return this.isValid ? this.s : null;
            },
          },
          {
            key: "end",
            get: function () {
              return this.isValid ? this.e : null;
            },
          },
          {
            key: "isValid",
            get: function () {
              return null === this.invalidReason;
            },
          },
          {
            key: "invalidReason",
            get: function () {
              return this.invalid ? this.invalid.reason : null;
            },
          },
          {
            key: "invalidExplanation",
            get: function () {
              return this.invalid ? this.invalid.explanation : null;
            },
          },
        ]),
        c
      );
    })(),
    en = (function () {
      function e() {}
      return (
        (e.hasDST = function (e) {
          void 0 === e && (e = $e.defaultZone);
          var t = tr.now().setZone(e).set({ month: 12 });
          return !e.isUniversal && t.offset !== t.set({ month: 6 }).offset;
        }),
        (e.isValidIANAZone = function (e) {
          return je.isValidSpecifier(e) && je.isValidZone(e);
        }),
        (e.normalizeZone = function (e) {
          return Re(e, $e.defaultZone);
        }),
        (e.months = function (e, t) {
          void 0 === e && (e = "long");
          var n = void 0 === t ? {} : t,
            r = n.locale,
            i = n.numberingSystem,
            t = n.locObj,
            t = void 0 === t ? null : t,
            n = n.outputCalendar;
          return (
            t ||
            ut.create(
              void 0 === r ? null : r,
              void 0 === i ? null : i,
              void 0 === n ? "gregory" : n,
            )
          ).months(e);
        }),
        (e.monthsFormat = function (e, t) {
          void 0 === e && (e = "long");
          var n = void 0 === t ? {} : t,
            r = n.locale,
            i = n.numberingSystem,
            t = n.locObj,
            t = void 0 === t ? null : t,
            n = n.outputCalendar;
          return (
            t ||
            ut.create(
              void 0 === r ? null : r,
              void 0 === i ? null : i,
              void 0 === n ? "gregory" : n,
            )
          ).months(e, !0);
        }),
        (e.weekdays = function (e, t) {
          void 0 === e && (e = "long");
          var n = void 0 === t ? {} : t,
            r = n.locale,
            t = n.numberingSystem,
            n = n.locObj;
          return (
            (void 0 === n ? null : n) ||
            ut.create(void 0 === r ? null : r, void 0 === t ? null : t, null)
          ).weekdays(e);
        }),
        (e.weekdaysFormat = function (e, t) {
          void 0 === e && (e = "long");
          var n = void 0 === t ? {} : t,
            r = n.locale,
            t = n.numberingSystem,
            n = n.locObj;
          return (
            (void 0 === n ? null : n) ||
            ut.create(void 0 === r ? null : r, void 0 === t ? null : t, null)
          ).weekdays(e, !0);
        }),
        (e.meridiems = function (e) {
          e = (void 0 === e ? {} : e).locale;
          return ut.create(void 0 === e ? null : e).meridiems();
        }),
        (e.eras = function (e, t) {
          void 0 === e && (e = "short");
          t = (void 0 === t ? {} : t).locale;
          return ut.create(void 0 === t ? null : t, null, "gregory").eras(e);
        }),
        (e.features = function () {
          return { relative: Y() };
        }),
        e
      );
    })();
  function tn(e, t) {
    function n(e) {
      return e.toUTC(0, { keepLocalTime: !0 }).startOf("day").valueOf();
    }
    e = n(t) - n(e);
    return Math.floor(Bt.fromMillis(e).as("days"));
  }
  function nn(e, t, n, r) {
    var i = (function (e, t, n) {
        for (
          var r = {},
            i = 0,
            o = [
              [
                "years",
                function (e, t) {
                  return t.year - e.year;
                },
              ],
              [
                "quarters",
                function (e, t) {
                  return t.quarter - e.quarter;
                },
              ],
              [
                "months",
                function (e, t) {
                  return t.month - e.month + 12 * (t.year - e.year);
                },
              ],
              [
                "weeks",
                function (e, t) {
                  t = tn(e, t);
                  return (t - (t % 7)) / 7;
                },
              ],
              ["days", tn],
            ];
          i < o.length;
          i++
        ) {
          var a,
            u,
            s = o[i],
            c = s[0],
            l = s[1];
          0 <= n.indexOf(c) &&
            ((a = c),
            (s = l(e, t)),
            t < (u = e.plus((((l = {})[c] = s), l)))
              ? ((e = e.plus((((l = {})[c] = s - 1), l))), --s)
              : (e = u),
            (r[c] = s));
        }
        return [e, r, u, a];
      })(e, t, n),
      o = i[0],
      a = i[1],
      u = i[2],
      e = i[3],
      i = t - o,
      n = n.filter(function (e) {
        return 0 <= ["hours", "minutes", "seconds", "milliseconds"].indexOf(e);
      });
    0 === n.length &&
      (u = u < t ? o.plus((((t = {})[e] = 1), t)) : u) !== o &&
      (a[e] = (a[e] || 0) + i / (u - o));
    a = Bt.fromObject(a, r);
    return 0 < n.length
      ? (r = Bt.fromMillis(i, r)).shiftTo.apply(r, n).plus(a)
      : a;
  }
  var rn = {
      arab: "[٠-٩]",
      arabext: "[۰-۹]",
      bali: "[᭐-᭙]",
      beng: "[০-৯]",
      deva: "[०-९]",
      fullwide: "[０-９]",
      gujr: "[૦-૯]",
      hanidec: "[〇|一|二|三|四|五|六|七|八|九]",
      khmr: "[០-៩]",
      knda: "[೦-೯]",
      laoo: "[໐-໙]",
      limb: "[᥆-᥏]",
      mlym: "[൦-൯]",
      mong: "[᠐-᠙]",
      mymr: "[၀-၉]",
      orya: "[୦-୯]",
      tamldec: "[௦-௯]",
      telu: "[౦-౯]",
      thai: "[๐-๙]",
      tibt: "[༠-༩]",
      latn: "\\d",
    },
    on = {
      arab: [1632, 1641],
      arabext: [1776, 1785],
      bali: [6992, 7001],
      beng: [2534, 2543],
      deva: [2406, 2415],
      fullwide: [65296, 65303],
      gujr: [2790, 2799],
      khmr: [6112, 6121],
      knda: [3302, 3311],
      laoo: [3792, 3801],
      limb: [6470, 6479],
      mlym: [3430, 3439],
      mong: [6160, 6169],
      mymr: [4160, 4169],
      orya: [2918, 2927],
      tamldec: [3046, 3055],
      telu: [3174, 3183],
      thai: [3664, 3673],
      tibt: [3872, 3881],
    },
    an = rn.hanidec.replace(/[\[|\]]/g, "").split("");
  function un(e, t) {
    e = e.numberingSystem;
    return void 0 === t && (t = ""), new RegExp("" + rn[e || "latn"] + t);
  }
  var sn = "missing Intl.DateTimeFormat.formatToParts support";
  function cn(e, t) {
    return (
      void 0 === t &&
        (t = function (e) {
          return e;
        }),
      {
        regex: e,
        deser: function (e) {
          e = e[0];
          return t(
            (function (e) {
              var t = parseInt(e, 10);
              if (isNaN(t)) {
                for (var t = "", n = 0; n < e.length; n++) {
                  var r = e.charCodeAt(n);
                  if (-1 !== e[n].search(rn.hanidec)) t += an.indexOf(e[n]);
                  else
                    for (var i in on) {
                      var o = on[i],
                        i = o[0],
                        o = o[1];
                      i <= r && r <= o && (t += r - i);
                    }
                }
                return parseInt(t, 10);
              }
              return t;
            })(e),
          );
        },
      }
    );
  }
  var ln = "( |" + String.fromCharCode(160) + ")",
    fn = new RegExp(ln, "g");
  function dn(e) {
    return e.replace(/\./g, "\\.?").replace(fn, ln);
  }
  function hn(e) {
    return e.replace(/\./g, "").replace(fn, " ").toLowerCase();
  }
  function mn(n, r) {
    return null === n
      ? null
      : {
          regex: RegExp(n.map(dn).join("|")),
          deser: function (e) {
            var t = e[0];
            return (
              n.findIndex(function (e) {
                return hn(t) === hn(e);
              }) + r
            );
          },
        };
  }
  function yn(e, t) {
    return {
      regex: e,
      deser: function (e) {
        return se(e[1], e[2]);
      },
      groups: t,
    };
  }
  function vn(e) {
    return {
      regex: e,
      deser: function (e) {
        return e[0];
      },
    };
  }
  function pn(t, n) {
    function r(e) {
      return {
        regex: RegExp(e.val.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")),
        deser: function (e) {
          return e[0];
        },
        literal: !0,
      };
    }
    var i = un(n),
      o = un(n, "{2}"),
      a = un(n, "{3}"),
      u = un(n, "{4}"),
      s = un(n, "{6}"),
      c = un(n, "{1,2}"),
      l = un(n, "{1,3}"),
      f = un(n, "{1,6}"),
      d = un(n, "{1,9}"),
      h = un(n, "{2,4}"),
      m = un(n, "{4,6}"),
      e = (function (e) {
        if (t.literal) return r(e);
        switch (e.val) {
          case "G":
            return mn(n.eras("short", !1), 0);
          case "GG":
            return mn(n.eras("long", !1), 0);
          case "y":
            return cn(f);
          case "yy":
            return cn(h, ae);
          case "yyyy":
            return cn(u);
          case "yyyyy":
            return cn(m);
          case "yyyyyy":
            return cn(s);
          case "M":
            return cn(c);
          case "MM":
            return cn(o);
          case "MMM":
            return mn(n.months("short", !0, !1), 1);
          case "MMMM":
            return mn(n.months("long", !0, !1), 1);
          case "L":
            return cn(c);
          case "LL":
            return cn(o);
          case "LLL":
            return mn(n.months("short", !1, !1), 1);
          case "LLLL":
            return mn(n.months("long", !1, !1), 1);
          case "d":
            return cn(c);
          case "dd":
            return cn(o);
          case "o":
            return cn(l);
          case "ooo":
            return cn(a);
          case "HH":
            return cn(o);
          case "H":
            return cn(c);
          case "hh":
            return cn(o);
          case "h":
            return cn(c);
          case "mm":
            return cn(o);
          case "m":
          case "q":
            return cn(c);
          case "qq":
            return cn(o);
          case "s":
            return cn(c);
          case "ss":
            return cn(o);
          case "S":
            return cn(l);
          case "SSS":
            return cn(a);
          case "u":
            return vn(d);
          case "a":
            return mn(n.meridiems(), 0);
          case "kkkk":
            return cn(u);
          case "kk":
            return cn(h, ae);
          case "W":
            return cn(c);
          case "WW":
            return cn(o);
          case "E":
          case "c":
            return cn(i);
          case "EEE":
            return mn(n.weekdays("short", !1, !1), 1);
          case "EEEE":
            return mn(n.weekdays("long", !1, !1), 1);
          case "ccc":
            return mn(n.weekdays("short", !0, !1), 1);
          case "cccc":
            return mn(n.weekdays("long", !0, !1), 1);
          case "Z":
          case "ZZ":
            return yn(
              new RegExp("([+-]" + c.source + ")(?::(" + o.source + "))?"),
              2,
            );
          case "ZZZ":
            return yn(
              new RegExp("([+-]" + c.source + ")(" + o.source + ")?"),
              2,
            );
          case "z":
            return vn(/[a-z_+-/]{1,256}?/i);
          default:
            return r(e);
        }
      })(t) || { invalidReason: sn };
    return (e.token = t), e;
  }
  var gn = {
    year: { "2-digit": "yy", numeric: "yyyyy" },
    month: { numeric: "M", "2-digit": "MM", short: "MMM", long: "MMMM" },
    day: { numeric: "d", "2-digit": "dd" },
    weekday: { short: "EEE", long: "EEEE" },
    dayperiod: "a",
    dayPeriod: "a",
    hour: { numeric: "h", "2-digit": "hh" },
    minute: { numeric: "m", "2-digit": "mm" },
    second: { numeric: "s", "2-digit": "ss" },
  };
  var wn = null;
  function kn(e, t) {
    if (e.literal) return e;
    var i = Ie.macroTokenToFormatOpts(e.val);
    if (!i) return e;
    t = Ie.create(t, i)
      .formatDateTimeParts((wn = wn || tr.fromMillis(1555555555555)))
      .map(function (e) {
        return (
          (n = i),
          (r = (t = e).type),
          (t = e.value),
          "literal" === r
            ? { literal: !0, val: t }
            : ((n = n[r]),
              (r = "object" == typeof (r = gn[r]) ? r[n] : r)
                ? { literal: !1, val: r }
                : void 0)
        );
        var t, n, r;
      });
    return t.includes(void 0) ? e : t;
  }
  function Sn(t, e, n) {
    var r,
      i =
        ((c = Ie.parseFormat(n)),
        (r = t),
        (s = Array.prototype).concat.apply(
          s,
          c.map(function (e) {
            return kn(e, r);
          }),
        )),
      o = i.map(function (e) {
        return pn(e, t);
      }),
      n = o.find(function (e) {
        return e.invalidReason;
      });
    if (n) return { input: e, tokens: i, invalidReason: n.invalidReason };
    var a,
      u,
      s,
      c = [
        "^" +
          (s = o)
            .map(function (e) {
              return e.regex;
            })
            .reduce(function (e, t) {
              return e + "(" + t.source + ")";
            }, "") +
          "$",
        s,
      ],
      n = c[1],
      o = RegExp(c[0], "i"),
      s = (function (e, t, n) {
        var r = e.match(t);
        if (r) {
          var i,
            o,
            a,
            u = {},
            s = 1;
          for (i in n)
            $(n, i) &&
              ((a = (o = n[i]).groups ? o.groups + 1 : 1),
              !o.literal &&
                o.token &&
                (u[o.token.val[0]] = o.deser(r.slice(s, s + a))),
              (s += a));
          return [r, u];
        }
        return [r, {}];
      })(e, o, n),
      c = s[0],
      n = s[1],
      s = n
        ? ((u = P((a = n).Z) ? (P(a.z) ? null : je.create(a.z)) : new _e(a.Z)),
          P(a.q) || (a.M = 3 * (a.q - 1) + 1),
          P(a.h) ||
            (a.h < 12 && 1 === a.a
              ? (a.h += 12)
              : 12 === a.h && 0 === a.a && (a.h = 0)),
          0 === a.G && a.y && (a.y = -a.y),
          P(a.u) || (a.S = X(a.u)),
          [
            Object.keys(a).reduce(function (e, t) {
              var n = (function (e) {
                switch (e) {
                  case "S":
                    return "millisecond";
                  case "s":
                    return "second";
                  case "m":
                    return "minute";
                  case "h":
                  case "H":
                    return "hour";
                  case "d":
                    return "day";
                  case "o":
                    return "ordinal";
                  case "L":
                  case "M":
                    return "month";
                  case "y":
                    return "year";
                  case "E":
                  case "c":
                    return "weekday";
                  case "W":
                    return "weekNumber";
                  case "k":
                    return "weekYear";
                  case "q":
                    return "quarter";
                  default:
                    return null;
                }
              })(t);
              return n && (e[n] = a[t]), e;
            }, {}),
            u,
          ])
        : [null, null],
      u = s[0],
      s = s[1];
    if ($(n, "a") && $(n, "H"))
      throw new S("Can't include meridiem when specifying 24-hour format");
    return {
      input: e,
      tokens: i,
      regex: o,
      rawMatches: c,
      matches: n,
      result: u,
      zone: s,
    };
  }
  var Tn = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
    bn = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
  function On(e, t) {
    return new Ve(
      "unit out of range",
      "you specified " +
        t +
        " (of type " +
        typeof t +
        ") as a " +
        e +
        ", which is invalid",
    );
  }
  function Mn(e, t, n) {
    n = new Date(Date.UTC(e, t - 1, n)).getUTCDay();
    return 0 === n ? 7 : n;
  }
  function Nn(e, t, n) {
    return n + (te(e) ? bn : Tn)[t - 1];
  }
  function Dn(e, t) {
    var n = te(e) ? bn : Tn,
      e = n.findIndex(function (e) {
        return e < t;
      });
    return { month: e + 1, day: t - n[e] };
  }
  function En(e) {
    var t,
      n = e.year,
      r = e.month,
      i = e.day,
      o = Nn(n, r, i),
      i = Mn(n, r, i),
      o = Math.floor((o - i + 10) / 7);
    return (
      o < 1
        ? (o = oe((t = n - 1)))
        : o > oe(n)
          ? ((t = n + 1), (o = 1))
          : (t = n),
      u({ weekYear: t, weekNumber: o, weekday: i }, de(e))
    );
  }
  function In(e) {
    var t,
      n = e.weekYear,
      r = e.weekNumber,
      i = e.weekday,
      o = Mn(n, 1, 4),
      a = ne(n),
      o = 7 * r + i - o - 3;
    o < 1
      ? (o += ne((t = n - 1)))
      : a < o
        ? ((t = n + 1), (o -= ne(n)))
        : (t = n);
    o = Dn(t, o);
    return u({ year: t, month: o.month, day: o.day }, de(e));
  }
  function Vn(e) {
    var t = e.year;
    return u({ year: t, ordinal: Nn(t, e.month, e.day) }, de(e));
  }
  function xn(e) {
    var t = e.year,
      n = Dn(t, e.ordinal);
    return u({ year: t, month: n.month, day: n.day }, de(e));
  }
  function Cn(e) {
    var t = J(e.year),
      n = B(e.month, 1, 12),
      r = B(e.day, 1, re(e.year, e.month));
    return t
      ? n
        ? !r && On("day", e.day)
        : On("month", e.month)
      : On("year", e.year);
  }
  function Fn(e) {
    var t = e.hour,
      n = e.minute,
      r = e.second,
      i = e.millisecond,
      o = B(t, 0, 23) || (24 === t && 0 === n && 0 === r && 0 === i),
      a = B(n, 0, 59),
      u = B(r, 0, 59),
      e = B(i, 0, 999);
    return o
      ? a
        ? u
          ? !e && On("millisecond", i)
          : On("second", r)
        : On("minute", n)
      : On("hour", t);
  }
  var Zn = "Invalid DateTime";
  function Ln(e) {
    return new Ve(
      "unsupported zone",
      'the zone "' + e.name + '" is not supported',
    );
  }
  function An(e) {
    return null === e.weekData && (e.weekData = En(e.c)), e.weekData;
  }
  function zn(e, t) {
    e = {
      ts: e.ts,
      zone: e.zone,
      c: e.c,
      o: e.o,
      loc: e.loc,
      invalid: e.invalid,
    };
    return new tr(u({}, e, t, { old: e }));
  }
  function jn(e, t, n) {
    var r = e - 60 * t * 1e3,
      i = n.offset(r);
    if (t === i) return [r, t];
    t = n.offset((r -= 60 * (i - t) * 1e3));
    return i === t ? [r, i] : [e - 60 * Math.min(i, t) * 1e3, Math.max(i, t)];
  }
  function qn(e, t) {
    e += 60 * t * 1e3;
    e = new Date(e);
    return {
      year: e.getUTCFullYear(),
      month: e.getUTCMonth() + 1,
      day: e.getUTCDate(),
      hour: e.getUTCHours(),
      minute: e.getUTCMinutes(),
      second: e.getUTCSeconds(),
      millisecond: e.getUTCMilliseconds(),
    };
  }
  function _n(e, t, n) {
    return jn(ie(e), t, n);
  }
  function Un(e, t) {
    var n = e.o,
      r = e.c.year + Math.trunc(t.years),
      i = e.c.month + Math.trunc(t.months) + 3 * Math.trunc(t.quarters),
      i = u({}, e.c, {
        year: r,
        month: i,
        day:
          Math.min(e.c.day, re(r, i)) +
          Math.trunc(t.days) +
          7 * Math.trunc(t.weeks),
      }),
      t = Bt.fromObject({
        years: t.years - Math.trunc(t.years),
        quarters: t.quarters - Math.trunc(t.quarters),
        months: t.months - Math.trunc(t.months),
        weeks: t.weeks - Math.trunc(t.weeks),
        days: t.days - Math.trunc(t.days),
        hours: t.hours,
        minutes: t.minutes,
        seconds: t.seconds,
        milliseconds: t.milliseconds,
      }).as("milliseconds"),
      i = jn(ie(i), n, e.zone),
      n = i[0],
      i = i[1];
    return 0 !== t && (i = e.zone.offset((n += t))), { ts: n, o: i };
  }
  function Rn(e, t, n, r, i) {
    var o = n.setZone,
      a = n.zone;
    if (e && 0 !== Object.keys(e).length) {
      t = tr.fromObject(e, u({}, n, { zone: t || a }));
      return o ? t : t.setZone(a);
    }
    return tr.invalid(
      new Ve("unparsable", 'the input "' + i + "\" can't be parsed as " + r),
    );
  }
  function Hn(e, t, n) {
    return (
      void 0 === n && (n = !0),
      e.isValid
        ? Ie.create(ut.create("en-US"), {
            allowZ: n,
            forceSimple: !0,
          }).formatDateTimeFromString(e, t)
        : null
    );
  }
  function Pn(e, t) {
    var n = t.suppressSeconds,
      r = t.suppressMilliseconds,
      i = t.includeOffset,
      o = t.includePrefix,
      a = void 0 !== o && o,
      u = t.includeZone,
      s = void 0 !== u && u,
      o = t.spaceZone,
      u = t.format,
      t = void 0 === u ? "extended" : u,
      u = "basic" === t ? "HHmm" : "HH:mm";
    (void 0 !== n && n && 0 === e.second && 0 === e.millisecond) ||
      ((u += "basic" === t ? "ss" : ":ss"),
      (void 0 !== r && r && 0 === e.millisecond) || (u += ".SSS")),
      (s || i) && void 0 !== o && o && (u += " "),
      s ? (u += "z") : i && (u += "basic" === t ? "ZZZ" : "ZZ");
    u = Hn(e, u);
    return (u = a ? "T" + u : u);
  }
  var Wn = { month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
    Jn = {
      weekNumber: 1,
      weekday: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    },
    Yn = { ordinal: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
    Gn = ["year", "month", "day", "hour", "minute", "second", "millisecond"],
    $n = [
      "weekYear",
      "weekNumber",
      "weekday",
      "hour",
      "minute",
      "second",
      "millisecond",
    ],
    Bn = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
  function Qn(e) {
    var t = {
      year: "year",
      years: "year",
      month: "month",
      months: "month",
      day: "day",
      days: "day",
      hour: "hour",
      hours: "hour",
      minute: "minute",
      minutes: "minute",
      quarter: "quarter",
      quarters: "quarter",
      second: "second",
      seconds: "second",
      millisecond: "millisecond",
      milliseconds: "millisecond",
      weekday: "weekday",
      weekdays: "weekday",
      weeknumber: "weekNumber",
      weeksnumber: "weekNumber",
      weeknumbers: "weekNumber",
      weekyear: "weekYear",
      weekyears: "weekYear",
      ordinal: "ordinal",
    }[e.toLowerCase()];
    if (!t) throw new y(e);
    return t;
  }
  function Kn(e, t) {
    var n = Re(t.zone, $e.defaultZone),
      r = ut.fromObject(t),
      t = $e.now();
    if (P(e.year)) u = t;
    else {
      for (var i = k(Gn); !(o = i()).done; ) {
        var o = o.value;
        P(e[o]) && (e[o] = Wn[o]);
      }
      var a = Cn(e) || Fn(e);
      if (a) return tr.invalid(a);
      var a = _n(e, n.offset(t), n),
        u = a[0],
        a = a[1];
    }
    return new tr({ ts: u, zone: n, loc: r, o: a });
  }
  function Xn(t, n, r) {
    function e(e, t) {
      return (
        (e = ee(e, o || r.calendary ? 0 : 2, !0)),
        n.loc.clone(r).relFormatter(r).format(e, t)
      );
    }
    function i(e) {
      return r.calendary
        ? n.hasSame(t, e)
          ? 0
          : n.startOf(e).diff(t.startOf(e), e).get(e)
        : n.diff(t, e).get(e);
    }
    var o = !!P(r.round) || r.round;
    if (r.unit) return e(i(r.unit), r.unit);
    for (var a = k(r.units); !(s = a()).done; ) {
      var u = s.value,
        s = i(u);
      if (1 <= Math.abs(s)) return e(s, u);
    }
    return e(n < t ? -0 : 0, r.units[r.units.length - 1]);
  }
  function er(e) {
    var t = {},
      e =
        0 < e.length && "object" == typeof e[e.length - 1]
          ? ((t = e[e.length - 1]), Array.from(e).slice(0, e.length - 1))
          : Array.from(e);
    return [t, e];
  }
  var tr = (function () {
    function w(e) {
      var t = e.zone || $e.defaultZone,
        n =
          e.invalid ||
          (Number.isNaN(e.ts) ? new Ve("invalid input") : null) ||
          (t.isValid ? null : Ln(t));
      this.ts = P(e.ts) ? $e.now() : e.ts;
      var r,
        i = null,
        o = null;
      n ||
        (o =
          e.old && e.old.ts === this.ts && e.old.zone.equals(t)
            ? ((i = (r = [e.old.c, e.old.o])[0]), r[1])
            : ((r = t.offset(this.ts)),
              (i = qn(this.ts, r)),
              (i = (n = Number.isNaN(i.year) ? new Ve("invalid input") : null)
                ? null
                : i),
              n ? null : r)),
        (this._zone = t),
        (this.loc = e.loc || ut.create()),
        (this.invalid = n),
        (this.weekData = null),
        (this.c = i),
        (this.o = o),
        (this.isLuxonDateTime = !0);
    }
    (w.now = function () {
      return new w({});
    }),
      (w.local = function () {
        var e = er(arguments),
          t = e[0],
          e = e[1];
        return Kn(
          {
            year: e[0],
            month: e[1],
            day: e[2],
            hour: e[3],
            minute: e[4],
            second: e[5],
            millisecond: e[6],
          },
          t,
        );
      }),
      (w.utc = function () {
        var e = er(arguments),
          t = e[0],
          n = e[1],
          r = n[0],
          i = n[1],
          o = n[2],
          a = n[3],
          u = n[4],
          e = n[5],
          n = n[6];
        return (
          (t.zone = _e.utcInstance),
          Kn(
            {
              year: r,
              month: i,
              day: o,
              hour: a,
              minute: u,
              second: e,
              millisecond: n,
            },
            t,
          )
        );
      }),
      (w.fromJSDate = function (e, t) {
        void 0 === t && (t = {});
        var n =
          "[object Date]" === Object.prototype.toString.call(e)
            ? e.valueOf()
            : NaN;
        if (Number.isNaN(n)) return w.invalid("invalid input");
        e = Re(t.zone, $e.defaultZone);
        return e.isValid
          ? new w({ ts: n, zone: e, loc: ut.fromObject(t) })
          : w.invalid(Ln(e));
      }),
      (w.fromMillis = function (e, t) {
        if ((void 0 === t && (t = {}), W(e)))
          return e < -864e13 || 864e13 < e
            ? w.invalid("Timestamp out of range")
            : new w({
                ts: e,
                zone: Re(t.zone, $e.defaultZone),
                loc: ut.fromObject(t),
              });
        throw new v(
          "fromMillis requires a numerical input, but received a " +
            typeof e +
            " with value " +
            e,
        );
      }),
      (w.fromSeconds = function (e, t) {
        if ((void 0 === t && (t = {}), W(e)))
          return new w({
            ts: 1e3 * e,
            zone: Re(t.zone, $e.defaultZone),
            loc: ut.fromObject(t),
          });
        throw new v("fromSeconds requires a numerical input");
      }),
      (w.fromObject = function (e, t) {
        e = e || {};
        var n = Re((t = void 0 === t ? {} : t).zone, $e.defaultZone);
        if (!n.isValid) return w.invalid(Ln(n));
        var r = $e.now(),
          i = n.offset(r),
          o = le(e, Qn),
          a = !P(o.ordinal),
          u = !P(o.year),
          s = !P(o.month) || !P(o.day),
          c = u || s,
          u = o.weekYear || o.weekNumber,
          t = ut.fromObject(t);
        if ((c || a) && u)
          throw new S(
            "Can't mix weekYear/weekNumber units with year/month/day or ordinals",
          );
        if (s && a) throw new S("Can't mix ordinal dates with month/day");
        var l,
          u = u || (o.weekday && !c),
          f = qn(r, i);
        u
          ? ((p = $n), (l = Jn), (f = En(f)))
          : a
            ? ((p = Bn), (l = Yn), (f = Vn(f)))
            : ((p = Gn), (l = Wn));
        for (var d = !1, h = k(p); !(m = h()).done; ) {
          var m = m.value;
          P(o[m]) ? (o[m] = (d ? l : f)[m]) : (d = !0);
        }
        var y,
          v,
          p,
          g,
          y =
            (u
              ? ((r = J((v = o).weekYear)),
                (p = B(v.weekNumber, 1, oe(v.weekYear))),
                (g = B(v.weekday, 1, 7)),
                r
                  ? p
                    ? !g && On("weekday", v.weekday)
                    : On("week", v.week)
                  : On("weekYear", v.weekYear))
              : a
                ? ((g = J((y = o).year)),
                  (v = B(y.ordinal, 1, ne(y.year))),
                  g ? !v && On("ordinal", y.ordinal) : On("year", y.year))
                : Cn(o)) || Fn(o);
        if (y) return w.invalid(y);
        (i = _n(u ? In(o) : a ? xn(o) : o, i, n)),
          (t = new w({ ts: i[0], zone: n, o: i[1], loc: t }));
        return o.weekday && c && e.weekday !== t.weekday
          ? w.invalid(
              "mismatched weekday",
              "you can't specify both a weekday of " +
                o.weekday +
                " and a date of " +
                t.toISO(),
            )
          : t;
      }),
      (w.fromISO = function (e, t) {
        void 0 === t && (t = {});
        var n = lt(e, [xt, Lt], [Ct, At], [Ft, zt], [Zt, jt]);
        return Rn(n[0], n[1], t, "ISO 8601", e);
      }),
      (w.fromRFC2822 = function (e, t) {
        void 0 === t && (t = {});
        var n = lt(
          e
            .replace(/\([^)]*\)|[\n\t]/g, " ")
            .replace(/(\s\s+)/g, " ")
            .trim(),
          [Ot, Mt],
        );
        return Rn(n[0], n[1], t, "RFC 2822", e);
      }),
      (w.fromHTTP = function (e, t) {
        void 0 === t && (t = {});
        e = lt(e, [Nt, It], [Dt, It], [Et, Vt]);
        return Rn(e[0], e[1], t, "HTTP", t);
      }),
      (w.fromFormat = function (e, t, n) {
        if ((void 0 === n && (n = {}), P(e) || P(t)))
          throw new v("fromFormat requires an input string and a format");
        var r = n,
          i = r.locale,
          o = r.numberingSystem,
          r = ut.fromOpts({
            locale: void 0 === i ? null : i,
            numberingSystem: void 0 === o ? null : o,
            defaultToEN: !0,
          }),
          o = [(i = Sn(r, e, (i = t))).result, i.zone, i.invalidReason],
          r = o[0],
          i = o[1],
          o = o[2];
        return o ? w.invalid(o) : Rn(r, i, n, "format " + t, e);
      }),
      (w.fromString = function (e, t, n) {
        return w.fromFormat(e, t, (n = void 0 === n ? {} : n));
      }),
      (w.fromSQL = function (e, t) {
        void 0 === t && (t = {});
        var n = lt(e, [_t, Rt], [Ut, Ht]);
        return Rn(n[0], n[1], t, "SQL", e);
      }),
      (w.invalid = function (e, t) {
        if ((void 0 === t && (t = null), !e))
          throw new v("need to specify a reason the DateTime is invalid");
        var n = e instanceof Ve ? e : new Ve(e, t);
        if ($e.throwOnInvalid) throw new f(n);
        return new w({ invalid: n });
      }),
      (w.isDateTime = function (e) {
        return (e && e.isLuxonDateTime) || !1;
      });
    var e = w.prototype;
    return (
      (e.get = function (e) {
        return this[e];
      }),
      (e.resolvedLocaleOptions = function (e) {
        e = Ie.create(
          this.loc.clone((e = void 0 === e ? {} : e)),
          e,
        ).resolvedOptions(this);
        return {
          locale: e.locale,
          numberingSystem: e.numberingSystem,
          outputCalendar: e.calendar,
        };
      }),
      (e.toUTC = function (e, t) {
        return (
          void 0 === t && (t = {}),
          this.setZone(_e.instance((e = void 0 === e ? 0 : e)), t)
        );
      }),
      (e.toLocal = function () {
        return this.setZone($e.defaultZone);
      }),
      (e.setZone = function (e, t) {
        var n = void 0 === t ? {} : t,
          r = n.keepLocalTime,
          t = void 0 !== r && r,
          r = n.keepCalendarTime,
          n = void 0 !== r && r;
        if ((e = Re(e, $e.defaultZone)).equals(this.zone)) return this;
        if (e.isValid) {
          r = this.ts;
          return (
            (t || n) &&
              ((n = e.offset(this.ts)), (r = _n(this.toObject(), n, e)[0])),
            zn(this, { ts: r, zone: e })
          );
        }
        return w.invalid(Ln(e));
      }),
      (e.reconfigure = function (e) {
        var t = void 0 === e ? {} : e,
          n = t.locale,
          e = t.numberingSystem,
          t = t.outputCalendar,
          t = this.loc.clone({
            locale: n,
            numberingSystem: e,
            outputCalendar: t,
          });
        return zn(this, { loc: t });
      }),
      (e.setLocale = function (e) {
        return this.reconfigure({ locale: e });
      }),
      (e.set = function (e) {
        if (!this.isValid) return this;
        var t = le(e, Qn),
          n = !P(t.weekYear) || !P(t.weekNumber) || !P(t.weekday),
          r = !P(t.ordinal),
          i = !P(t.year),
          o = !P(t.month) || !P(t.day),
          e = t.weekYear || t.weekNumber;
        if ((i || o || r) && e)
          throw new S(
            "Can't mix weekYear/weekNumber units with year/month/day or ordinals",
          );
        if (o && r) throw new S("Can't mix ordinal dates with month/day");
        n
          ? (a = In(u({}, En(this.c), t)))
          : P(t.ordinal)
            ? ((a = u({}, this.toObject(), t)),
              P(t.day) && (a.day = Math.min(re(a.year, a.month), a.day)))
            : (a = xn(u({}, Vn(this.c), t)));
        var a = _n(a, this.o, this.zone);
        return zn(this, { ts: a[0], o: a[1] });
      }),
      (e.plus = function (e) {
        return this.isValid ? zn(this, Un(this, Qt(e))) : this;
      }),
      (e.minus = function (e) {
        return this.isValid ? zn(this, Un(this, Qt(e).negate())) : this;
      }),
      (e.startOf = function (e) {
        if (!this.isValid) return this;
        var t = {},
          e = Bt.normalizeUnit(e);
        switch (e) {
          case "years":
            t.month = 1;
          case "quarters":
          case "months":
            t.day = 1;
          case "weeks":
          case "days":
            t.hour = 0;
          case "hours":
            t.minute = 0;
          case "minutes":
            t.second = 0;
          case "seconds":
            t.millisecond = 0;
        }
        return (
          "weeks" === e && (t.weekday = 1),
          "quarters" === e &&
            ((e = Math.ceil(this.month / 3)), (t.month = 3 * (e - 1) + 1)),
          this.set(t)
        );
      }),
      (e.endOf = function (e) {
        var t;
        return this.isValid
          ? this.plus((((t = {})[e] = 1), t))
              .startOf(e)
              .minus(1)
          : this;
      }),
      (e.toFormat = function (e, t) {
        return (
          void 0 === t && (t = {}),
          this.isValid
            ? Ie.create(this.loc.redefaultToEN(t)).formatDateTimeFromString(
                this,
                e,
              )
            : Zn
        );
      }),
      (e.toLocaleString = function (e, t) {
        return (
          void 0 === e && (e = T),
          void 0 === t && (t = {}),
          this.isValid
            ? Ie.create(this.loc.clone(t), e).formatDateTime(this)
            : Zn
        );
      }),
      (e.toLocaleParts = function (e) {
        return (
          void 0 === e && (e = {}),
          this.isValid
            ? Ie.create(this.loc.clone(e), e).formatDateTimeParts(this)
            : []
        );
      }),
      (e.toISO = function (e) {
        return (
          void 0 === e && (e = {}),
          this.isValid ? this.toISODate(e) + "T" + this.toISOTime(e) : null
        );
      }),
      (e.toISODate = function (e) {
        (e = (void 0 === e ? {} : e).format),
          (e =
            "basic" === (void 0 === e ? "extended" : e)
              ? "yyyyMMdd"
              : "yyyy-MM-dd");
        return Hn(this, (e = 9999 < this.year ? "+" + e : e));
      }),
      (e.toISOWeekDate = function () {
        return Hn(this, "kkkk-'W'WW-c");
      }),
      (e.toISOTime = function (e) {
        var t = void 0 === e ? {} : e,
          n = t.suppressMilliseconds,
          r = t.suppressSeconds,
          i = t.includeOffset,
          e = t.includePrefix,
          t = t.format;
        return Pn(this, {
          suppressSeconds: void 0 !== r && r,
          suppressMilliseconds: void 0 !== n && n,
          includeOffset: void 0 === i || i,
          includePrefix: void 0 !== e && e,
          format: void 0 === t ? "extended" : t,
        });
      }),
      (e.toRFC2822 = function () {
        return Hn(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", !1);
      }),
      (e.toHTTP = function () {
        return Hn(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
      }),
      (e.toSQLDate = function () {
        return Hn(this, "yyyy-MM-dd");
      }),
      (e.toSQLTime = function (e) {
        var t = void 0 === e ? {} : e,
          e = t.includeOffset,
          t = t.includeZone;
        return Pn(this, {
          includeOffset: void 0 === e || e,
          includeZone: void 0 !== t && t,
          spaceZone: !0,
        });
      }),
      (e.toSQL = function (e) {
        return (
          void 0 === e && (e = {}),
          this.isValid ? this.toSQLDate() + " " + this.toSQLTime(e) : null
        );
      }),
      (e.toString = function () {
        return this.isValid ? this.toISO() : Zn;
      }),
      (e.valueOf = function () {
        return this.toMillis();
      }),
      (e.toMillis = function () {
        return this.isValid ? this.ts : NaN;
      }),
      (e.toSeconds = function () {
        return this.isValid ? this.ts / 1e3 : NaN;
      }),
      (e.toJSON = function () {
        return this.toISO();
      }),
      (e.toBSON = function () {
        return this.toJSDate();
      }),
      (e.toObject = function (e) {
        if ((void 0 === e && (e = {}), !this.isValid)) return {};
        var t = u({}, this.c);
        return (
          e.includeConfig &&
            ((t.outputCalendar = this.outputCalendar),
            (t.numberingSystem = this.loc.numberingSystem),
            (t.locale = this.loc.locale)),
          t
        );
      }),
      (e.toJSDate = function () {
        return new Date(this.isValid ? this.ts : NaN);
      }),
      (e.diff = function (e, t, n) {
        if (
          (void 0 === t && (t = "milliseconds"),
          void 0 === n && (n = {}),
          !this.isValid || !e.isValid)
        )
          return Bt.invalid("created by diffing an invalid DateTime");
        var r = u(
            { locale: this.locale, numberingSystem: this.numberingSystem },
            n,
          ),
          t = ((n = t), (Array.isArray(n) ? n : [n]).map(Bt.normalizeUnit)),
          n = e.valueOf() > this.valueOf(),
          r = nn(n ? this : e, n ? e : this, t, r);
        return n ? r.negate() : r;
      }),
      (e.diffNow = function (e, t) {
        return (
          void 0 === e && (e = "milliseconds"),
          void 0 === t && (t = {}),
          this.diff(w.now(), e, t)
        );
      }),
      (e.until = function (e) {
        return this.isValid ? Xt.fromDateTimes(this, e) : this;
      }),
      (e.hasSame = function (e, t) {
        if (!this.isValid) return !1;
        var n = e.valueOf(),
          e = this.setZone(e.zone, { keepLocalTime: !0 });
        return e.startOf(t) <= n && n <= e.endOf(t);
      }),
      (e.equals = function (e) {
        return (
          this.isValid &&
          e.isValid &&
          this.valueOf() === e.valueOf() &&
          this.zone.equals(e.zone) &&
          this.loc.equals(e.loc)
        );
      }),
      (e.toRelative = function (e) {
        if (!this.isValid) return null;
        var t =
            (e = void 0 === e ? {} : e).base ||
            w.fromObject({}, { zone: this.zone }),
          n = e.padding ? (this < t ? -e.padding : e.padding) : 0,
          r = ["years", "months", "days", "hours", "minutes", "seconds"],
          i = e.unit;
        return (
          Array.isArray(e.unit) && ((r = e.unit), (i = void 0)),
          Xn(
            t,
            this.plus(n),
            u({}, e, { numeric: "always", units: r, unit: i }),
          )
        );
      }),
      (e.toRelativeCalendar = function (e) {
        return (
          void 0 === e && (e = {}),
          this.isValid
            ? Xn(
                e.base || w.fromObject({}, { zone: this.zone }),
                this,
                u({}, e, {
                  numeric: "auto",
                  units: ["years", "months", "days"],
                  calendary: !0,
                }),
              )
            : null
        );
      }),
      (w.min = function () {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        if (!t.every(w.isDateTime))
          throw new v("min requires all arguments be DateTimes");
        return G(
          t,
          function (e) {
            return e.valueOf();
          },
          Math.min,
        );
      }),
      (w.max = function () {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
          t[n] = arguments[n];
        if (!t.every(w.isDateTime))
          throw new v("max requires all arguments be DateTimes");
        return G(
          t,
          function (e) {
            return e.valueOf();
          },
          Math.max,
        );
      }),
      (w.fromFormatExplain = function (e, t, n) {
        var r = (n = void 0 === n ? {} : n),
          n = r.locale,
          r = r.numberingSystem;
        return Sn(
          ut.fromOpts({
            locale: void 0 === n ? null : n,
            numberingSystem: void 0 === r ? null : r,
            defaultToEN: !0,
          }),
          e,
          t,
        );
      }),
      (w.fromStringExplain = function (e, t, n) {
        return w.fromFormatExplain(e, t, (n = void 0 === n ? {} : n));
      }),
      o(
        w,
        [
          {
            key: "isValid",
            get: function () {
              return null === this.invalid;
            },
          },
          {
            key: "invalidReason",
            get: function () {
              return this.invalid ? this.invalid.reason : null;
            },
          },
          {
            key: "invalidExplanation",
            get: function () {
              return this.invalid ? this.invalid.explanation : null;
            },
          },
          {
            key: "locale",
            get: function () {
              return this.isValid ? this.loc.locale : null;
            },
          },
          {
            key: "numberingSystem",
            get: function () {
              return this.isValid ? this.loc.numberingSystem : null;
            },
          },
          {
            key: "outputCalendar",
            get: function () {
              return this.isValid ? this.loc.outputCalendar : null;
            },
          },
          {
            key: "zone",
            get: function () {
              return this._zone;
            },
          },
          {
            key: "zoneName",
            get: function () {
              return this.isValid ? this.zone.name : null;
            },
          },
          {
            key: "year",
            get: function () {
              return this.isValid ? this.c.year : NaN;
            },
          },
          {
            key: "quarter",
            get: function () {
              return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
            },
          },
          {
            key: "month",
            get: function () {
              return this.isValid ? this.c.month : NaN;
            },
          },
          {
            key: "day",
            get: function () {
              return this.isValid ? this.c.day : NaN;
            },
          },
          {
            key: "hour",
            get: function () {
              return this.isValid ? this.c.hour : NaN;
            },
          },
          {
            key: "minute",
            get: function () {
              return this.isValid ? this.c.minute : NaN;
            },
          },
          {
            key: "second",
            get: function () {
              return this.isValid ? this.c.second : NaN;
            },
          },
          {
            key: "millisecond",
            get: function () {
              return this.isValid ? this.c.millisecond : NaN;
            },
          },
          {
            key: "weekYear",
            get: function () {
              return this.isValid ? An(this).weekYear : NaN;
            },
          },
          {
            key: "weekNumber",
            get: function () {
              return this.isValid ? An(this).weekNumber : NaN;
            },
          },
          {
            key: "weekday",
            get: function () {
              return this.isValid ? An(this).weekday : NaN;
            },
          },
          {
            key: "ordinal",
            get: function () {
              return this.isValid ? Vn(this.c).ordinal : NaN;
            },
          },
          {
            key: "monthShort",
            get: function () {
              return this.isValid
                ? en.months("short", { locObj: this.loc })[this.month - 1]
                : null;
            },
          },
          {
            key: "monthLong",
            get: function () {
              return this.isValid
                ? en.months("long", { locObj: this.loc })[this.month - 1]
                : null;
            },
          },
          {
            key: "weekdayShort",
            get: function () {
              return this.isValid
                ? en.weekdays("short", { locObj: this.loc })[this.weekday - 1]
                : null;
            },
          },
          {
            key: "weekdayLong",
            get: function () {
              return this.isValid
                ? en.weekdays("long", { locObj: this.loc })[this.weekday - 1]
                : null;
            },
          },
          {
            key: "offset",
            get: function () {
              return this.isValid ? +this.o : NaN;
            },
          },
          {
            key: "offsetNameShort",
            get: function () {
              return this.isValid
                ? this.zone.offsetName(this.ts, {
                    format: "short",
                    locale: this.locale,
                  })
                : null;
            },
          },
          {
            key: "offsetNameLong",
            get: function () {
              return this.isValid
                ? this.zone.offsetName(this.ts, {
                    format: "long",
                    locale: this.locale,
                  })
                : null;
            },
          },
          {
            key: "isOffsetFixed",
            get: function () {
              return this.isValid ? this.zone.isUniversal : null;
            },
          },
          {
            key: "isInDST",
            get: function () {
              return (
                !this.isOffsetFixed &&
                (this.offset > this.set({ month: 1 }).offset ||
                  this.offset > this.set({ month: 5 }).offset)
              );
            },
          },
          {
            key: "isInLeapYear",
            get: function () {
              return te(this.year);
            },
          },
          {
            key: "daysInMonth",
            get: function () {
              return re(this.year, this.month);
            },
          },
          {
            key: "daysInYear",
            get: function () {
              return this.isValid ? ne(this.year) : NaN;
            },
          },
          {
            key: "weeksInWeekYear",
            get: function () {
              return this.isValid ? oe(this.weekYear) : NaN;
            },
          },
        ],
        [
          {
            key: "DATE_SHORT",
            get: function () {
              return T;
            },
          },
          {
            key: "DATE_MED",
            get: function () {
              return b;
            },
          },
          {
            key: "DATE_MED_WITH_WEEKDAY",
            get: function () {
              return O;
            },
          },
          {
            key: "DATE_FULL",
            get: function () {
              return M;
            },
          },
          {
            key: "DATE_HUGE",
            get: function () {
              return N;
            },
          },
          {
            key: "TIME_SIMPLE",
            get: function () {
              return D;
            },
          },
          {
            key: "TIME_WITH_SECONDS",
            get: function () {
              return E;
            },
          },
          {
            key: "TIME_WITH_SHORT_OFFSET",
            get: function () {
              return I;
            },
          },
          {
            key: "TIME_WITH_LONG_OFFSET",
            get: function () {
              return V;
            },
          },
          {
            key: "TIME_24_SIMPLE",
            get: function () {
              return x;
            },
          },
          {
            key: "TIME_24_WITH_SECONDS",
            get: function () {
              return C;
            },
          },
          {
            key: "TIME_24_WITH_SHORT_OFFSET",
            get: function () {
              return F;
            },
          },
          {
            key: "TIME_24_WITH_LONG_OFFSET",
            get: function () {
              return Z;
            },
          },
          {
            key: "DATETIME_SHORT",
            get: function () {
              return L;
            },
          },
          {
            key: "DATETIME_SHORT_WITH_SECONDS",
            get: function () {
              return A;
            },
          },
          {
            key: "DATETIME_MED",
            get: function () {
              return z;
            },
          },
          {
            key: "DATETIME_MED_WITH_SECONDS",
            get: function () {
              return j;
            },
          },
          {
            key: "DATETIME_MED_WITH_WEEKDAY",
            get: function () {
              return q;
            },
          },
          {
            key: "DATETIME_FULL",
            get: function () {
              return _;
            },
          },
          {
            key: "DATETIME_FULL_WITH_SECONDS",
            get: function () {
              return U;
            },
          },
          {
            key: "DATETIME_HUGE",
            get: function () {
              return R;
            },
          },
          {
            key: "DATETIME_HUGE_WITH_SECONDS",
            get: function () {
              return H;
            },
          },
        ],
      ),
      w
    );
  })();
  function nr(e) {
    if (tr.isDateTime(e)) return e;
    if (e && e.valueOf && W(e.valueOf())) return tr.fromJSDate(e);
    if (e && "object" == typeof e) return tr.fromObject(e);
    throw new v("Unknown datetime argument: " + e + ", of type " + typeof e);
  }
  return (
    (e.DateTime = tr),
    (e.Duration = Bt),
    (e.FixedOffsetZone = _e),
    (e.IANAZone = je),
    (e.Info = en),
    (e.Interval = Xt),
    (e.InvalidZone = Ue),
    (e.Settings = $e),
    (e.SystemZone = Fe),
    (e.VERSION = "2.0.2"),
    (e.Zone = xe),
    Object.defineProperty(e, "__esModule", { value: !0 }),
    e
  );
})({});

;}
      } catch(e) { console.error(`  Error executing script ${scriptPath_s3nrp2jjx}`, e); }
    

      const scriptPath_2ku1geal211 = "litepicker.js"; // Use JSON.stringify for safety
      console.log(`  Executing JS (end): ${scriptPath_2ku1geal211}`);
      try {
          with(__globals){;/*!
 *
 * litepicker.js
 * Litepicker v2.0.11 (https://github.com/wakirin/Litepicker)
 * Package: litepicker (https://www.npmjs.com/package/litepicker)
 * License: MIT (https://github.com/wakirin/Litepicker/blob/master/LICENCE.md)
 * Copyright 2019-2021 Rinat G.
 *
 * Hash: 339a4d0206c05127153e
 *
 */
var Litepicker = (function (t) {
  var e = {};
  function i(n) {
    if (e[n]) return e[n].exports;
    var o = (e[n] = { i: n, l: !1, exports: {} });
    return t[n].call(o.exports, o, o.exports, i), (o.l = !0), o.exports;
  }
  return (
    (i.m = t),
    (i.c = e),
    (i.d = function (t, e, n) {
      i.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
    }),
    (i.r = function (t) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (i.t = function (t, e) {
      if ((1 & e && (t = i(t)), 8 & e)) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var n = Object.create(null);
      if (
        (i.r(n),
        Object.defineProperty(n, "default", { enumerable: !0, value: t }),
        2 & e && "string" != typeof t)
      )
        for (var o in t)
          i.d(
            n,
            o,
            function (e) {
              return t[e];
            }.bind(null, o),
          );
      return n;
    }),
    (i.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return i.d(e, "a", e), e;
    }),
    (i.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (i.p = ""),
    i((i.s = 4))
  );
})([
  function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });
    var n = (function () {
      function t(e, i, n) {
        void 0 === e && (e = null),
          void 0 === i && (i = null),
          void 0 === n && (n = "en-US"),
          (this.dateInstance =
            "object" == typeof i && null !== i
              ? i.parse(e instanceof t ? e.clone().toJSDate() : e)
              : "string" == typeof i
                ? t.parseDateTime(e, i, n)
                : e
                  ? t.parseDateTime(e)
                  : t.parseDateTime(new Date())),
          (this.lang = n);
      }
      return (
        (t.parseDateTime = function (e, i, n) {
          if (
            (void 0 === i && (i = "YYYY-MM-DD"),
            void 0 === n && (n = "en-US"),
            !e)
          )
            return new Date(NaN);
          if (e instanceof Date) return new Date(e);
          if (e instanceof t) return e.clone().toJSDate();
          if (/^-?\d{10,}$/.test(e))
            return t.getDateZeroTime(new Date(Number(e)));
          if ("string" == typeof e) {
            for (var o = [], s = null; null != (s = t.regex.exec(i)); )
              "\\" !== s[1] && o.push(s);
            if (o.length) {
              var r = {
                year: null,
                month: null,
                shortMonth: null,
                longMonth: null,
                day: null,
                value: "",
              };
              o[0].index > 0 && (r.value += ".*?");
              for (var a = 0, l = Object.entries(o); a < l.length; a++) {
                var c = l[a],
                  h = c[0],
                  p = c[1],
                  d = Number(h),
                  u = t.formatPatterns(p[0], n),
                  m = u.group,
                  f = u.pattern;
                (r[m] = d + 1), (r.value += f), (r.value += ".*?");
              }
              var g = new RegExp("^" + r.value + "$");
              if (g.test(e)) {
                var v = g.exec(e),
                  y = Number(v[r.year]),
                  b = null;
                r.month
                  ? (b = Number(v[r.month]) - 1)
                  : r.shortMonth
                    ? (b = t.shortMonths(n).indexOf(v[r.shortMonth]))
                    : r.longMonth &&
                      (b = t.longMonths(n).indexOf(v[r.longMonth]));
                var k = Number(v[r.day]) || 1;
                return new Date(y, b, k, 0, 0, 0, 0);
              }
            }
          }
          return t.getDateZeroTime(new Date(e));
        }),
        (t.convertArray = function (e, i) {
          return e.map(function (e) {
            return e instanceof Array
              ? e.map(function (e) {
                  return new t(e, i);
                })
              : new t(e, i);
          });
        }),
        (t.getDateZeroTime = function (t) {
          return new Date(
            t.getFullYear(),
            t.getMonth(),
            t.getDate(),
            0,
            0,
            0,
            0,
          );
        }),
        (t.shortMonths = function (e) {
          return t.MONTH_JS.map(function (t) {
            return new Date(2019, t).toLocaleString(e, { month: "short" });
          });
        }),
        (t.longMonths = function (e) {
          return t.MONTH_JS.map(function (t) {
            return new Date(2019, t).toLocaleString(e, { month: "long" });
          });
        }),
        (t.formatPatterns = function (e, i) {
          switch (e) {
            case "YY":
            case "YYYY":
              return { group: "year", pattern: "(\\d{" + e.length + "})" };
            case "M":
              return { group: "month", pattern: "(\\d{1,2})" };
            case "MM":
              return { group: "month", pattern: "(\\d{2})" };
            case "MMM":
              return {
                group: "shortMonth",
                pattern: "(" + t.shortMonths(i).join("|") + ")",
              };
            case "MMMM":
              return {
                group: "longMonth",
                pattern: "(" + t.longMonths(i).join("|") + ")",
              };
            case "D":
              return { group: "day", pattern: "(\\d{1,2})" };
            case "DD":
              return { group: "day", pattern: "(\\d{2})" };
          }
        }),
        (t.prototype.toJSDate = function () {
          return this.dateInstance;
        }),
        (t.prototype.toLocaleString = function (t, e) {
          return this.dateInstance.toLocaleString(t, e);
        }),
        (t.prototype.toDateString = function () {
          return this.dateInstance.toDateString();
        }),
        (t.prototype.getSeconds = function () {
          return this.dateInstance.getSeconds();
        }),
        (t.prototype.getDay = function () {
          return this.dateInstance.getDay();
        }),
        (t.prototype.getTime = function () {
          return this.dateInstance.getTime();
        }),
        (t.prototype.getDate = function () {
          return this.dateInstance.getDate();
        }),
        (t.prototype.getMonth = function () {
          return this.dateInstance.getMonth();
        }),
        (t.prototype.getFullYear = function () {
          return this.dateInstance.getFullYear();
        }),
        (t.prototype.setMonth = function (t) {
          return this.dateInstance.setMonth(t);
        }),
        (t.prototype.setHours = function (t, e, i, n) {
          void 0 === t && (t = 0),
            void 0 === e && (e = 0),
            void 0 === i && (i = 0),
            void 0 === n && (n = 0),
            this.dateInstance.setHours(t, e, i, n);
        }),
        (t.prototype.setSeconds = function (t) {
          return this.dateInstance.setSeconds(t);
        }),
        (t.prototype.setDate = function (t) {
          return this.dateInstance.setDate(t);
        }),
        (t.prototype.setFullYear = function (t) {
          return this.dateInstance.setFullYear(t);
        }),
        (t.prototype.getWeek = function (t) {
          var e = new Date(this.timestamp()),
            i = (this.getDay() + (7 - t)) % 7;
          e.setDate(e.getDate() - i);
          var n = e.getTime();
          return (
            e.setMonth(0, 1),
            e.getDay() !== t && e.setMonth(0, 1 + ((4 - e.getDay() + 7) % 7)),
            1 + Math.ceil((n - e.getTime()) / 6048e5)
          );
        }),
        (t.prototype.clone = function () {
          return new t(this.toJSDate());
        }),
        (t.prototype.isBetween = function (t, e, i) {
          switch ((void 0 === i && (i = "()"), i)) {
            default:
            case "()":
              return (
                this.timestamp() > t.getTime() && this.timestamp() < e.getTime()
              );
            case "[)":
              return (
                this.timestamp() >= t.getTime() &&
                this.timestamp() < e.getTime()
              );
            case "(]":
              return (
                this.timestamp() > t.getTime() &&
                this.timestamp() <= e.getTime()
              );
            case "[]":
              return (
                this.timestamp() >= t.getTime() &&
                this.timestamp() <= e.getTime()
              );
          }
        }),
        (t.prototype.isBefore = function (t, e) {
          switch ((void 0 === e && (e = "seconds"), e)) {
            case "second":
            case "seconds":
              return t.getTime() > this.getTime();
            case "day":
            case "days":
              return (
                new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime() >
                new Date(
                  this.getFullYear(),
                  this.getMonth(),
                  this.getDate(),
                ).getTime()
              );
            case "month":
            case "months":
              return (
                new Date(t.getFullYear(), t.getMonth(), 1).getTime() >
                new Date(this.getFullYear(), this.getMonth(), 1).getTime()
              );
            case "year":
            case "years":
              return t.getFullYear() > this.getFullYear();
          }
          throw new Error("isBefore: Invalid unit!");
        }),
        (t.prototype.isSameOrBefore = function (t, e) {
          switch ((void 0 === e && (e = "seconds"), e)) {
            case "second":
            case "seconds":
              return t.getTime() >= this.getTime();
            case "day":
            case "days":
              return (
                new Date(
                  t.getFullYear(),
                  t.getMonth(),
                  t.getDate(),
                ).getTime() >=
                new Date(
                  this.getFullYear(),
                  this.getMonth(),
                  this.getDate(),
                ).getTime()
              );
            case "month":
            case "months":
              return (
                new Date(t.getFullYear(), t.getMonth(), 1).getTime() >=
                new Date(this.getFullYear(), this.getMonth(), 1).getTime()
              );
          }
          throw new Error("isSameOrBefore: Invalid unit!");
        }),
        (t.prototype.isAfter = function (t, e) {
          switch ((void 0 === e && (e = "seconds"), e)) {
            case "second":
            case "seconds":
              return this.getTime() > t.getTime();
            case "day":
            case "days":
              return (
                new Date(
                  this.getFullYear(),
                  this.getMonth(),
                  this.getDate(),
                ).getTime() >
                new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime()
              );
            case "month":
            case "months":
              return (
                new Date(this.getFullYear(), this.getMonth(), 1).getTime() >
                new Date(t.getFullYear(), t.getMonth(), 1).getTime()
              );
            case "year":
            case "years":
              return this.getFullYear() > t.getFullYear();
          }
          throw new Error("isAfter: Invalid unit!");
        }),
        (t.prototype.isSameOrAfter = function (t, e) {
          switch ((void 0 === e && (e = "seconds"), e)) {
            case "second":
            case "seconds":
              return this.getTime() >= t.getTime();
            case "day":
            case "days":
              return (
                new Date(
                  this.getFullYear(),
                  this.getMonth(),
                  this.getDate(),
                ).getTime() >=
                new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime()
              );
            case "month":
            case "months":
              return (
                new Date(this.getFullYear(), this.getMonth(), 1).getTime() >=
                new Date(t.getFullYear(), t.getMonth(), 1).getTime()
              );
          }
          throw new Error("isSameOrAfter: Invalid unit!");
        }),
        (t.prototype.isSame = function (t, e) {
          switch ((void 0 === e && (e = "seconds"), e)) {
            case "second":
            case "seconds":
              return this.getTime() === t.getTime();
            case "day":
            case "days":
              return (
                new Date(
                  this.getFullYear(),
                  this.getMonth(),
                  this.getDate(),
                ).getTime() ===
                new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime()
              );
            case "month":
            case "months":
              return (
                new Date(this.getFullYear(), this.getMonth(), 1).getTime() ===
                new Date(t.getFullYear(), t.getMonth(), 1).getTime()
              );
          }
          throw new Error("isSame: Invalid unit!");
        }),
        (t.prototype.add = function (t, e) {
          switch ((void 0 === e && (e = "seconds"), e)) {
            case "second":
            case "seconds":
              this.setSeconds(this.getSeconds() + t);
              break;
            case "day":
            case "days":
              this.setDate(this.getDate() + t);
              break;
            case "month":
            case "months":
              this.setMonth(this.getMonth() + t);
          }
          return this;
        }),
        (t.prototype.subtract = function (t, e) {
          switch ((void 0 === e && (e = "seconds"), e)) {
            case "second":
            case "seconds":
              this.setSeconds(this.getSeconds() - t);
              break;
            case "day":
            case "days":
              this.setDate(this.getDate() - t);
              break;
            case "month":
            case "months":
              this.setMonth(this.getMonth() - t);
          }
          return this;
        }),
        (t.prototype.diff = function (t, e) {
          void 0 === e && (e = "seconds");
          switch (e) {
            default:
            case "second":
            case "seconds":
              return this.getTime() - t.getTime();
            case "day":
            case "days":
              return Math.round((this.timestamp() - t.getTime()) / 864e5);
            case "month":
            case "months":
          }
        }),
        (t.prototype.format = function (e, i) {
          if ((void 0 === i && (i = "en-US"), "object" == typeof e))
            return e.output(this.clone().toJSDate());
          for (var n = "", o = [], s = null; null != (s = t.regex.exec(e)); )
            "\\" !== s[1] && o.push(s);
          if (o.length) {
            o[0].index > 0 && (n += e.substring(0, o[0].index));
            for (var r = 0, a = Object.entries(o); r < a.length; r++) {
              var l = a[r],
                c = l[0],
                h = l[1],
                p = Number(c);
              (n += this.formatTokens(h[0], i)),
                o[p + 1] &&
                  (n += e.substring(h.index + h[0].length, o[p + 1].index)),
                p === o.length - 1 && (n += e.substring(h.index + h[0].length));
            }
          }
          return n.replace(/\\/g, "");
        }),
        (t.prototype.timestamp = function () {
          return new Date(
            this.getFullYear(),
            this.getMonth(),
            this.getDate(),
            0,
            0,
            0,
            0,
          ).getTime();
        }),
        (t.prototype.formatTokens = function (e, i) {
          switch (e) {
            case "YY":
              return String(this.getFullYear()).slice(-2);
            case "YYYY":
              return String(this.getFullYear());
            case "M":
              return String(this.getMonth() + 1);
            case "MM":
              return ("0" + (this.getMonth() + 1)).slice(-2);
            case "MMM":
              return t.shortMonths(i)[this.getMonth()];
            case "MMMM":
              return t.longMonths(i)[this.getMonth()];
            case "D":
              return String(this.getDate());
            case "DD":
              return ("0" + this.getDate()).slice(-2);
            default:
              return "";
          }
        }),
        (t.regex = /(\\)?(Y{2,4}|M{1,4}|D{1,2}|d{1,4})/g),
        (t.MONTH_JS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
        t
      );
    })();
    e.DateTime = n;
  },
  function (t, e, i) {
    "use strict";
    var n,
      o =
        (this && this.__extends) ||
        ((n = function (t, e) {
          return (n =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
            })(t, e);
        }),
        function (t, e) {
          function i() {
            this.constructor = t;
          }
          n(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((i.prototype = e.prototype), new i()));
        }),
      s =
        (this && this.__spreadArrays) ||
        function () {
          for (var t = 0, e = 0, i = arguments.length; e < i; e++)
            t += arguments[e].length;
          var n = Array(t),
            o = 0;
          for (e = 0; e < i; e++)
            for (var s = arguments[e], r = 0, a = s.length; r < a; r++, o++)
              n[o] = s[r];
          return n;
        };
    Object.defineProperty(e, "__esModule", { value: !0 });
    var r = i(5),
      a = i(0),
      l = i(3),
      c = i(2),
      h = (function (t) {
        function e(e) {
          var i = t.call(this, e) || this;
          return (i.preventClick = !1), i.bindEvents(), i;
        }
        return (
          o(e, t),
          (e.prototype.scrollToDate = function (t) {
            if (this.options.scrollToDate) {
              var e =
                  this.options.startDate instanceof a.DateTime
                    ? this.options.startDate.clone()
                    : null,
                i =
                  this.options.endDate instanceof a.DateTime
                    ? this.options.endDate.clone()
                    : null;
              !this.options.startDate || (t && t !== this.options.element)
                ? t &&
                  this.options.endDate &&
                  t === this.options.elementEnd &&
                  (i.setDate(1),
                  this.options.numberOfMonths > 1 &&
                    i.isAfter(e) &&
                    i.setMonth(
                      i.getMonth() - (this.options.numberOfMonths - 1),
                    ),
                  (this.calendars[0] = i.clone()))
                : (e.setDate(1), (this.calendars[0] = e.clone()));
            }
          }),
          (e.prototype.bindEvents = function () {
            document.addEventListener("click", this.onClick.bind(this), !0),
              (this.ui = document.createElement("div")),
              (this.ui.className = l.litepicker),
              (this.ui.style.display = "none"),
              this.ui.addEventListener(
                "mouseenter",
                this.onMouseEnter.bind(this),
                !0,
              ),
              this.ui.addEventListener(
                "mouseleave",
                this.onMouseLeave.bind(this),
                !1,
              ),
              this.options.autoRefresh
                ? (this.options.element instanceof HTMLElement &&
                    this.options.element.addEventListener(
                      "keyup",
                      this.onInput.bind(this),
                      !0,
                    ),
                  this.options.elementEnd instanceof HTMLElement &&
                    this.options.elementEnd.addEventListener(
                      "keyup",
                      this.onInput.bind(this),
                      !0,
                    ))
                : (this.options.element instanceof HTMLElement &&
                    this.options.element.addEventListener(
                      "change",
                      this.onInput.bind(this),
                      !0,
                    ),
                  this.options.elementEnd instanceof HTMLElement &&
                    this.options.elementEnd.addEventListener(
                      "change",
                      this.onInput.bind(this),
                      !0,
                    )),
              this.options.parentEl
                ? this.options.parentEl instanceof HTMLElement
                  ? this.options.parentEl.appendChild(this.ui)
                  : document
                      .querySelector(this.options.parentEl)
                      .appendChild(this.ui)
                : this.options.inlineMode
                  ? this.options.element instanceof HTMLInputElement
                    ? this.options.element.parentNode.appendChild(this.ui)
                    : this.options.element.appendChild(this.ui)
                  : document.body.appendChild(this.ui),
              this.updateInput(),
              this.init(),
              "function" == typeof this.options.setup &&
                this.options.setup.call(this, this),
              this.render(),
              this.options.inlineMode && this.show();
          }),
          (e.prototype.updateInput = function () {
            if (this.options.element instanceof HTMLInputElement) {
              var t = this.options.startDate,
                e = this.options.endDate;
              if (this.options.singleMode && t)
                this.options.element.value = t.format(
                  this.options.format,
                  this.options.lang,
                );
              else if (!this.options.singleMode && t && e) {
                var i = t.format(this.options.format, this.options.lang),
                  n = e.format(this.options.format, this.options.lang);
                this.options.elementEnd instanceof HTMLInputElement
                  ? ((this.options.element.value = i),
                    (this.options.elementEnd.value = n))
                  : (this.options.element.value =
                      "" + i + this.options.delimiter + n);
              }
              t ||
                e ||
                ((this.options.element.value = ""),
                this.options.elementEnd instanceof HTMLInputElement &&
                  (this.options.elementEnd.value = ""));
            }
          }),
          (e.prototype.isSamePicker = function (t) {
            return t.closest("." + l.litepicker) === this.ui;
          }),
          (e.prototype.shouldShown = function (t) {
            return (
              !t.disabled &&
              (t === this.options.element ||
                (this.options.elementEnd && t === this.options.elementEnd))
            );
          }),
          (e.prototype.shouldResetDatePicked = function () {
            return this.options.singleMode || 2 === this.datePicked.length;
          }),
          (e.prototype.shouldSwapDatePicked = function () {
            return (
              2 === this.datePicked.length &&
              this.datePicked[0].getTime() > this.datePicked[1].getTime()
            );
          }),
          (e.prototype.shouldCheckLockDays = function () {
            return (
              this.options.disallowLockDaysInRange &&
              2 === this.datePicked.length
            );
          }),
          (e.prototype.onClick = function (t) {
            var e = t.target;
            if (e && this.ui)
              if (this.shouldShown(e)) this.show(e);
              else if (e.closest("." + l.litepicker) || !this.isShowning()) {
                if (this.isSamePicker(e))
                  if ((this.emit("before:click", e), this.preventClick))
                    this.preventClick = !1;
                  else {
                    if (e.classList.contains(l.dayItem)) {
                      if (
                        (t.preventDefault(), e.classList.contains(l.isLocked))
                      )
                        return;
                      if (
                        (this.shouldResetDatePicked() &&
                          (this.datePicked.length = 0),
                        (this.datePicked[this.datePicked.length] =
                          new a.DateTime(e.dataset.time)),
                        this.shouldSwapDatePicked())
                      ) {
                        var i = this.datePicked[1].clone();
                        (this.datePicked[1] = this.datePicked[0].clone()),
                          (this.datePicked[0] = i.clone());
                      }
                      if (this.shouldCheckLockDays())
                        c.rangeIsLocked(this.datePicked, this.options) &&
                          (this.emit("error:range", this.datePicked),
                          (this.datePicked.length = 0));
                      return (
                        this.render(),
                        this.emit.apply(
                          this,
                          s(
                            ["preselect"],
                            s(this.datePicked).map(function (t) {
                              return t.clone();
                            }),
                          ),
                        ),
                        void (
                          this.options.autoApply &&
                          (this.options.singleMode && this.datePicked.length
                            ? (this.setDate(this.datePicked[0]), this.hide())
                            : this.options.singleMode ||
                              2 !== this.datePicked.length ||
                              (this.setDateRange(
                                this.datePicked[0],
                                this.datePicked[1],
                              ),
                              this.hide()))
                        )
                      );
                    }
                    if (e.classList.contains(l.buttonPreviousMonth)) {
                      t.preventDefault();
                      var n = 0,
                        o =
                          this.options.switchingMonths ||
                          this.options.numberOfMonths;
                      if (this.options.splitView) {
                        var r = e.closest("." + l.monthItem);
                        (n = c.findNestedMonthItem(r)), (o = 1);
                      }
                      return (
                        this.calendars[n].setMonth(
                          this.calendars[n].getMonth() - o,
                        ),
                        this.gotoDate(this.calendars[n], n),
                        void this.emit("change:month", this.calendars[n], n)
                      );
                    }
                    if (e.classList.contains(l.buttonNextMonth)) {
                      t.preventDefault();
                      (n = 0),
                        (o =
                          this.options.switchingMonths ||
                          this.options.numberOfMonths);
                      if (this.options.splitView) {
                        r = e.closest("." + l.monthItem);
                        (n = c.findNestedMonthItem(r)), (o = 1);
                      }
                      return (
                        this.calendars[n].setMonth(
                          this.calendars[n].getMonth() + o,
                        ),
                        this.gotoDate(this.calendars[n], n),
                        void this.emit("change:month", this.calendars[n], n)
                      );
                    }
                    e.classList.contains(l.buttonCancel) &&
                      (t.preventDefault(),
                      this.hide(),
                      this.emit("button:cancel")),
                      e.classList.contains(l.buttonApply) &&
                        (t.preventDefault(),
                        this.options.singleMode && this.datePicked.length
                          ? this.setDate(this.datePicked[0])
                          : this.options.singleMode ||
                            2 !== this.datePicked.length ||
                            this.setDateRange(
                              this.datePicked[0],
                              this.datePicked[1],
                            ),
                        this.hide(),
                        this.emit(
                          "button:apply",
                          this.options.startDate,
                          this.options.endDate,
                        ));
                  }
              } else this.hide();
          }),
          (e.prototype.showTooltip = function (t, e) {
            var i = this.ui.querySelector("." + l.containerTooltip);
            (i.style.visibility = "visible"), (i.innerHTML = e);
            var n = this.ui.getBoundingClientRect(),
              o = i.getBoundingClientRect(),
              s = t.getBoundingClientRect(),
              r = s.top,
              a = s.left;
            if (this.options.inlineMode && this.options.parentEl) {
              var c = this.ui.parentNode.getBoundingClientRect();
              (r -= c.top), (a -= c.left);
            } else (r -= n.top), (a -= n.left);
            (r -= o.height),
              (a -= o.width / 2),
              (a += s.width / 2),
              (i.style.top = r + "px"),
              (i.style.left = a + "px"),
              this.emit("tooltip", i, t);
          }),
          (e.prototype.hideTooltip = function () {
            this.ui.querySelector("." + l.containerTooltip).style.visibility =
              "hidden";
          }),
          (e.prototype.shouldAllowMouseEnter = function (t) {
            return (
              !this.options.singleMode && !t.classList.contains(l.isLocked)
            );
          }),
          (e.prototype.shouldAllowRepick = function () {
            return (
              this.options.elementEnd &&
              this.options.allowRepick &&
              this.options.startDate &&
              this.options.endDate
            );
          }),
          (e.prototype.isDayItem = function (t) {
            return t.classList.contains(l.dayItem);
          }),
          (e.prototype.onMouseEnter = function (t) {
            var e = this,
              i = t.target;
            if (this.isDayItem(i) && this.shouldAllowMouseEnter(i)) {
              if (
                (this.shouldAllowRepick() &&
                  (this.triggerElement === this.options.element
                    ? (this.datePicked[0] = this.options.endDate.clone())
                    : this.triggerElement === this.options.elementEnd &&
                      (this.datePicked[0] = this.options.startDate.clone())),
                1 !== this.datePicked.length)
              )
                return;
              var n = this.ui.querySelector(
                  "." +
                    l.dayItem +
                    '[data-time="' +
                    this.datePicked[0].getTime() +
                    '"]',
                ),
                o = this.datePicked[0].clone(),
                s = new a.DateTime(i.dataset.time),
                r = !1;
              if (o.getTime() > s.getTime()) {
                var c = o.clone();
                (o = s.clone()), (s = c.clone()), (r = !0);
              }
              if (
                (Array.prototype.slice
                  .call(this.ui.querySelectorAll("." + l.dayItem))
                  .forEach(function (t) {
                    var i = new a.DateTime(t.dataset.time),
                      n = e.renderDay(i);
                    i.isBetween(o, s) && n.classList.add(l.isInRange),
                      (t.className = n.className);
                  }),
                i.classList.add(l.isEndDate),
                r
                  ? (n && n.classList.add(l.isFlipped),
                    i.classList.add(l.isFlipped))
                  : (n && n.classList.remove(l.isFlipped),
                    i.classList.remove(l.isFlipped)),
                this.options.showTooltip)
              ) {
                var h = s.diff(o, "day") + 1;
                if (
                  ("function" == typeof this.options.tooltipNumber &&
                    (h = this.options.tooltipNumber.call(this, h)),
                  h > 0)
                ) {
                  var p = this.pluralSelector(h),
                    d =
                      h +
                      " " +
                      (this.options.tooltipText[p]
                        ? this.options.tooltipText[p]
                        : "[" + p + "]");
                  this.showTooltip(i, d);
                  var u = window.navigator.userAgent,
                    m = /(iphone|ipad)/i.test(u),
                    f = /OS 1([0-2])/i.test(u);
                  m && f && i.dispatchEvent(new Event("click"));
                } else this.hideTooltip();
              }
            }
          }),
          (e.prototype.onMouseLeave = function (t) {
            t.target;
            this.options.allowRepick &&
              (!this.options.allowRepick ||
                this.options.startDate ||
                this.options.endDate) &&
              ((this.datePicked.length = 0), this.render());
          }),
          (e.prototype.onInput = function (t) {
            var e = this.parseInput(),
              i = e[0],
              n = e[1],
              o = this.options.format;
            if (
              this.options.elementEnd
                ? i instanceof a.DateTime &&
                  n instanceof a.DateTime &&
                  i.format(o) === this.options.element.value &&
                  n.format(o) === this.options.elementEnd.value
                : this.options.singleMode
                  ? i instanceof a.DateTime &&
                    i.format(o) === this.options.element.value
                  : i instanceof a.DateTime &&
                    n instanceof a.DateTime &&
                    "" + i.format(o) + this.options.delimiter + n.format(o) ===
                      this.options.element.value
            ) {
              if (n && i.getTime() > n.getTime()) {
                var s = i.clone();
                (i = n.clone()), (n = s.clone());
              }
              (this.options.startDate = new a.DateTime(
                i,
                this.options.format,
                this.options.lang,
              )),
                n &&
                  (this.options.endDate = new a.DateTime(
                    n,
                    this.options.format,
                    this.options.lang,
                  )),
                this.updateInput(),
                this.render();
              var r = i.clone(),
                l = 0;
              (this.options.elementEnd
                ? i.format(o) === t.target.value
                : t.target.value.startsWith(i.format(o))) ||
                ((r = n.clone()), (l = this.options.numberOfMonths - 1)),
                this.emit("selected", this.getStartDate(), this.getEndDate()),
                this.gotoDate(r, l);
            }
          }),
          e
        );
      })(r.Calendar);
    e.Litepicker = h;
  },
  function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 }),
      (e.findNestedMonthItem = function (t) {
        for (var e = t.parentNode.childNodes, i = 0; i < e.length; i += 1) {
          if (e.item(i) === t) return i;
        }
        return 0;
      }),
      (e.dateIsLocked = function (t, e, i) {
        var n = !1;
        return (
          e.lockDays.length &&
            (n = e.lockDays.filter(function (i) {
              return i instanceof Array
                ? t.isBetween(i[0], i[1], e.lockDaysInclusivity)
                : i.isSame(t, "day");
            }).length),
          n ||
            "function" != typeof e.lockDaysFilter ||
            (n = e.lockDaysFilter.call(this, t.clone(), null, i)),
          n
        );
      }),
      (e.rangeIsLocked = function (t, e) {
        var i = !1;
        return (
          e.lockDays.length &&
            (i = e.lockDays.filter(function (i) {
              if (i instanceof Array) {
                var n =
                  t[0].toDateString() === i[0].toDateString() &&
                  t[1].toDateString() === i[1].toDateString();
                return (
                  i[0].isBetween(t[0], t[1], e.lockDaysInclusivity) ||
                  i[1].isBetween(t[0], t[1], e.lockDaysInclusivity) ||
                  n
                );
              }
              return i.isBetween(t[0], t[1], e.lockDaysInclusivity);
            }).length),
          i ||
            "function" != typeof e.lockDaysFilter ||
            (i = e.lockDaysFilter.call(this, t[0].clone(), t[1].clone(), t)),
          i
        );
      });
  },
  function (t, e, i) {
    var n = i(8);
    "string" == typeof n && (n = [[t.i, n, ""]]);
    var o = {
      insert: function (t) {
        var e = document.querySelector("head"),
          i = window._lastElementInsertedByStyleLoader;
        window.disableLitepickerStyles ||
          (i
            ? i.nextSibling
              ? e.insertBefore(t, i.nextSibling)
              : e.appendChild(t)
            : e.insertBefore(t, e.firstChild),
          (window._lastElementInsertedByStyleLoader = t));
      },
      singleton: !1,
    };
    i(10)(n, o);
    n.locals && (t.exports = n.locals);
  },
  function (t, e, i) {
    "use strict";
    Object.defineProperty(e, "__esModule", { value: !0 });
    var n = i(1);
    (e.Litepicker = n.Litepicker),
      i(11),
      (window.Litepicker = n.Litepicker),
      (e.default = n.Litepicker);
  },
  function (t, e, i) {
    "use strict";
    var n,
      o =
        (this && this.__extends) ||
        ((n = function (t, e) {
          return (n =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
            })(t, e);
        }),
        function (t, e) {
          function i() {
            this.constructor = t;
          }
          n(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((i.prototype = e.prototype), new i()));
        });
    Object.defineProperty(e, "__esModule", { value: !0 });
    var s = i(6),
      r = i(0),
      a = i(3),
      l = i(2),
      c = (function (t) {
        function e(e) {
          return t.call(this, e) || this;
        }
        return (
          o(e, t),
          (e.prototype.render = function () {
            var t = this;
            this.emit("before:render", this.ui);
            var e = document.createElement("div");
            e.className = a.containerMain;
            var i = document.createElement("div");
            (i.className = a.containerMonths),
              a["columns" + this.options.numberOfColumns] &&
                (i.classList.remove(a.columns2, a.columns3, a.columns4),
                i.classList.add(a["columns" + this.options.numberOfColumns])),
              this.options.splitView && i.classList.add(a.splitView),
              this.options.showWeekNumbers &&
                i.classList.add(a.showWeekNumbers);
            for (
              var n = this.calendars[0].clone(),
                o = n.getMonth(),
                s = n.getMonth() + this.options.numberOfMonths,
                r = 0,
                l = o;
              l < s;
              l += 1
            ) {
              var c = n.clone();
              c.setDate(1),
                c.setHours(0, 0, 0, 0),
                this.options.splitView
                  ? (c = this.calendars[r].clone())
                  : c.setMonth(l),
                i.appendChild(this.renderMonth(c, r)),
                (r += 1);
            }
            if (
              ((this.ui.innerHTML = ""),
              e.appendChild(i),
              this.options.resetButton)
            ) {
              var h = void 0;
              "function" == typeof this.options.resetButton
                ? (h = this.options.resetButton.call(this))
                : (((h = document.createElement("button")).type = "button"),
                  (h.className = a.resetButton),
                  (h.innerHTML = this.options.buttonText.reset)),
                h.addEventListener("click", function (e) {
                  e.preventDefault(), t.clearSelection();
                }),
                e
                  .querySelector("." + a.monthItem + ":last-child")
                  .querySelector("." + a.monthItemHeader)
                  .appendChild(h);
            }
            this.ui.appendChild(e),
              (this.options.autoApply && !this.options.footerHTML) ||
                this.ui.appendChild(this.renderFooter()),
              this.options.showTooltip &&
                this.ui.appendChild(this.renderTooltip()),
              (this.ui.dataset.plugins = (this.options.plugins || []).join(
                "|",
              )),
              this.emit("render", this.ui);
          }),
          (e.prototype.renderMonth = function (t, e) {
            var i = this,
              n = t.clone(),
              o = 32 - new Date(n.getFullYear(), n.getMonth(), 32).getDate(),
              s = document.createElement("div");
            s.className = a.monthItem;
            var c = document.createElement("div");
            c.className = a.monthItemHeader;
            var h = document.createElement("div");
            if (this.options.dropdowns.months) {
              var p = document.createElement("select");
              p.className = a.monthItemName;
              for (var d = 0; d < 12; d += 1) {
                var u = document.createElement("option"),
                  m = new r.DateTime(new Date(t.getFullYear(), d, 2, 0, 0, 0)),
                  f = new r.DateTime(new Date(t.getFullYear(), d, 1, 0, 0, 0));
                (u.value = String(d)),
                  (u.text = m.toLocaleString(this.options.lang, {
                    month: "long",
                  })),
                  (u.disabled =
                    (this.options.minDate &&
                      f.isBefore(
                        new r.DateTime(this.options.minDate),
                        "month",
                      )) ||
                    (this.options.maxDate &&
                      f.isAfter(
                        new r.DateTime(this.options.maxDate),
                        "month",
                      ))),
                  (u.selected = f.getMonth() === t.getMonth()),
                  p.appendChild(u);
              }
              p.addEventListener("change", function (t) {
                var e = t.target,
                  n = 0;
                if (i.options.splitView) {
                  var o = e.closest("." + a.monthItem);
                  n = l.findNestedMonthItem(o);
                }
                i.calendars[n].setMonth(Number(e.value)),
                  i.render(),
                  i.emit("change:month", i.calendars[n], n, t);
              }),
                h.appendChild(p);
            } else {
              ((m = document.createElement("strong")).className =
                a.monthItemName),
                (m.innerHTML = t.toLocaleString(this.options.lang, {
                  month: "long",
                })),
                h.appendChild(m);
            }
            if (this.options.dropdowns.years) {
              var g = document.createElement("select");
              g.className = a.monthItemYear;
              var v = this.options.dropdowns.minYear,
                y = this.options.dropdowns.maxYear
                  ? this.options.dropdowns.maxYear
                  : new Date().getFullYear();
              if (t.getFullYear() > y)
                ((u = document.createElement("option")).value = String(
                  t.getFullYear(),
                )),
                  (u.text = String(t.getFullYear())),
                  (u.selected = !0),
                  (u.disabled = !0),
                  g.appendChild(u);
              for (d = y; d >= v; d -= 1) {
                var u = document.createElement("option"),
                  b = new r.DateTime(new Date(d, 0, 1, 0, 0, 0));
                (u.value = String(d)),
                  (u.text = String(d)),
                  (u.disabled =
                    (this.options.minDate &&
                      b.isBefore(
                        new r.DateTime(this.options.minDate),
                        "year",
                      )) ||
                    (this.options.maxDate &&
                      b.isAfter(new r.DateTime(this.options.maxDate), "year"))),
                  (u.selected = t.getFullYear() === d),
                  g.appendChild(u);
              }
              if (t.getFullYear() < v)
                ((u = document.createElement("option")).value = String(
                  t.getFullYear(),
                )),
                  (u.text = String(t.getFullYear())),
                  (u.selected = !0),
                  (u.disabled = !0),
                  g.appendChild(u);
              if ("asc" === this.options.dropdowns.years) {
                var k = Array.prototype.slice.call(g.childNodes).reverse();
                (g.innerHTML = ""),
                  k.forEach(function (t) {
                    (t.innerHTML = t.value), g.appendChild(t);
                  });
              }
              g.addEventListener("change", function (t) {
                var e = t.target,
                  n = 0;
                if (i.options.splitView) {
                  var o = e.closest("." + a.monthItem);
                  n = l.findNestedMonthItem(o);
                }
                i.calendars[n].setFullYear(Number(e.value)),
                  i.render(),
                  i.emit("change:year", i.calendars[n], n, t);
              }),
                h.appendChild(g);
            } else {
              var D = document.createElement("span");
              (D.className = a.monthItemYear),
                (D.innerHTML = String(t.getFullYear())),
                h.appendChild(D);
            }
            var w = document.createElement("button");
            (w.type = "button"),
              (w.className = a.buttonPreviousMonth),
              (w.innerHTML = this.options.buttonText.previousMonth);
            var x = document.createElement("button");
            (x.type = "button"),
              (x.className = a.buttonNextMonth),
              (x.innerHTML = this.options.buttonText.nextMonth),
              c.appendChild(w),
              c.appendChild(h),
              c.appendChild(x),
              this.options.minDate &&
                n.isSameOrBefore(
                  new r.DateTime(this.options.minDate),
                  "month",
                ) &&
                s.classList.add(a.noPreviousMonth),
              this.options.maxDate &&
                n.isSameOrAfter(
                  new r.DateTime(this.options.maxDate),
                  "month",
                ) &&
                s.classList.add(a.noNextMonth);
            var M = document.createElement("div");
            (M.className = a.monthItemWeekdaysRow),
              this.options.showWeekNumbers && (M.innerHTML = "<div>W</div>");
            for (var _ = 1; _ <= 7; _ += 1) {
              var T = 3 + this.options.firstDay + _,
                L = document.createElement("div");
              (L.innerHTML = this.weekdayName(T)),
                (L.title = this.weekdayName(T, "long")),
                M.appendChild(L);
            }
            var E = document.createElement("div");
            E.className = a.containerDays;
            var S = this.calcSkipDays(n);
            this.options.showWeekNumbers &&
              S &&
              E.appendChild(this.renderWeekNumber(n));
            for (var I = 0; I < S; I += 1) {
              var P = document.createElement("div");
              E.appendChild(P);
            }
            for (I = 1; I <= o; I += 1)
              n.setDate(I),
                this.options.showWeekNumbers &&
                  n.getDay() === this.options.firstDay &&
                  E.appendChild(this.renderWeekNumber(n)),
                E.appendChild(this.renderDay(n));
            return (
              s.appendChild(c),
              s.appendChild(M),
              s.appendChild(E),
              this.emit("render:month", s, t),
              s
            );
          }),
          (e.prototype.renderDay = function (t) {
            t.setHours();
            var e = document.createElement("div");
            if (
              ((e.className = a.dayItem),
              (e.innerHTML = String(t.getDate())),
              (e.dataset.time = String(t.getTime())),
              t.toDateString() === new Date().toDateString() &&
                e.classList.add(a.isToday),
              this.datePicked.length)
            )
              this.datePicked[0].toDateString() === t.toDateString() &&
                (e.classList.add(a.isStartDate),
                this.options.singleMode && e.classList.add(a.isEndDate)),
                2 === this.datePicked.length &&
                  this.datePicked[1].toDateString() === t.toDateString() &&
                  e.classList.add(a.isEndDate),
                2 === this.datePicked.length &&
                  t.isBetween(this.datePicked[0], this.datePicked[1]) &&
                  e.classList.add(a.isInRange);
            else if (this.options.startDate) {
              var i = this.options.startDate,
                n = this.options.endDate;
              i.toDateString() === t.toDateString() &&
                (e.classList.add(a.isStartDate),
                this.options.singleMode && e.classList.add(a.isEndDate)),
                n &&
                  n.toDateString() === t.toDateString() &&
                  e.classList.add(a.isEndDate),
                i && n && t.isBetween(i, n) && e.classList.add(a.isInRange);
            }
            if (
              (this.options.minDate &&
                t.isBefore(new r.DateTime(this.options.minDate)) &&
                e.classList.add(a.isLocked),
              this.options.maxDate &&
                t.isAfter(new r.DateTime(this.options.maxDate)) &&
                e.classList.add(a.isLocked),
              this.options.minDays > 1 && 1 === this.datePicked.length)
            ) {
              var o = this.options.minDays - 1,
                s = this.datePicked[0].clone().subtract(o, "day"),
                c = this.datePicked[0].clone().add(o, "day");
              t.isBetween(s, this.datePicked[0], "(]") &&
                e.classList.add(a.isLocked),
                t.isBetween(this.datePicked[0], c, "[)") &&
                  e.classList.add(a.isLocked);
            }
            if (this.options.maxDays && 1 === this.datePicked.length) {
              var h = this.options.maxDays;
              (s = this.datePicked[0].clone().subtract(h, "day")),
                (c = this.datePicked[0].clone().add(h, "day"));
              t.isSameOrBefore(s) && e.classList.add(a.isLocked),
                t.isSameOrAfter(c) && e.classList.add(a.isLocked);
            }
            (this.options.selectForward &&
              1 === this.datePicked.length &&
              t.isBefore(this.datePicked[0]) &&
              e.classList.add(a.isLocked),
            this.options.selectBackward &&
              1 === this.datePicked.length &&
              t.isAfter(this.datePicked[0]) &&
              e.classList.add(a.isLocked),
            l.dateIsLocked(t, this.options, this.datePicked) &&
              e.classList.add(a.isLocked),
            this.options.highlightedDays.length) &&
              this.options.highlightedDays.filter(function (e) {
                return e instanceof Array
                  ? t.isBetween(e[0], e[1], "[]")
                  : e.isSame(t, "day");
              }).length &&
              e.classList.add(a.isHighlighted);
            return (
              (e.tabIndex = e.classList.contains("is-locked") ? -1 : 0),
              this.emit("render:day", e, t),
              e
            );
          }),
          (e.prototype.renderFooter = function () {
            var t = document.createElement("div");
            if (
              ((t.className = a.containerFooter),
              this.options.footerHTML
                ? (t.innerHTML = this.options.footerHTML)
                : (t.innerHTML =
                    '\n      <span class="' +
                    a.previewDateRange +
                    '"></span>\n      <button type="button" class="' +
                    a.buttonCancel +
                    '">' +
                    this.options.buttonText.cancel +
                    '</button>\n      <button type="button" class="' +
                    a.buttonApply +
                    '">' +
                    this.options.buttonText.apply +
                    "</button>\n      "),
              this.options.singleMode)
            ) {
              if (1 === this.datePicked.length) {
                var e = this.datePicked[0].format(
                  this.options.format,
                  this.options.lang,
                );
                t.querySelector("." + a.previewDateRange).innerHTML = e;
              }
            } else if (
              (1 === this.datePicked.length &&
                t
                  .querySelector("." + a.buttonApply)
                  .setAttribute("disabled", ""),
              2 === this.datePicked.length)
            ) {
              e = this.datePicked[0].format(
                this.options.format,
                this.options.lang,
              );
              var i = this.datePicked[1].format(
                this.options.format,
                this.options.lang,
              );
              t.querySelector("." + a.previewDateRange).innerHTML =
                "" + e + this.options.delimiter + i;
            }
            return this.emit("render:footer", t), t;
          }),
          (e.prototype.renderWeekNumber = function (t) {
            var e = document.createElement("div"),
              i = t.getWeek(this.options.firstDay);
            return (
              (e.className = a.weekNumber),
              (e.innerHTML = 53 === i && 0 === t.getMonth() ? "53 / 1" : i),
              e
            );
          }),
          (e.prototype.renderTooltip = function () {
            var t = document.createElement("div");
            return (t.className = a.containerTooltip), t;
          }),
          (e.prototype.weekdayName = function (t, e) {
            return (
              void 0 === e && (e = "short"),
              new Date(1970, 0, t, 12, 0, 0, 0).toLocaleString(
                this.options.lang,
                { weekday: e },
              )
            );
          }),
          (e.prototype.calcSkipDays = function (t) {
            var e = t.getDay() - this.options.firstDay;
            return e < 0 && (e += 7), e;
          }),
          e
        );
      })(s.LPCore);
    e.Calendar = c;
  },
  function (t, e, i) {
    "use strict";
    var n,
      o =
        (this && this.__extends) ||
        ((n = function (t, e) {
          return (n =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (t, e) {
                t.__proto__ = e;
              }) ||
            function (t, e) {
              for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
            })(t, e);
        }),
        function (t, e) {
          function i() {
            this.constructor = t;
          }
          n(t, e),
            (t.prototype =
              null === e
                ? Object.create(e)
                : ((i.prototype = e.prototype), new i()));
        }),
      s =
        (this && this.__assign) ||
        function () {
          return (s =
            Object.assign ||
            function (t) {
              for (var e, i = 1, n = arguments.length; i < n; i++)
                for (var o in (e = arguments[i]))
                  Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
              return t;
            }).apply(this, arguments);
        };
    Object.defineProperty(e, "__esModule", { value: !0 });
    var r = i(7),
      a = i(0),
      l = i(1),
      c = (function (t) {
        function e(e) {
          var i = t.call(this) || this;
          (i.datePicked = []),
            (i.calendars = []),
            (i.options = {
              element: null,
              elementEnd: null,
              parentEl: null,
              firstDay: 1,
              format: "YYYY-MM-DD",
              lang: "en-US",
              delimiter: " - ",
              numberOfMonths: 1,
              numberOfColumns: 1,
              startDate: null,
              endDate: null,
              zIndex: 9999,
              position: "auto",
              selectForward: !1,
              selectBackward: !1,
              splitView: !1,
              inlineMode: !1,
              singleMode: !0,
              autoApply: !0,
              allowRepick: !1,
              showWeekNumbers: !1,
              showTooltip: !0,
              scrollToDate: !0,
              mobileFriendly: !0,
              resetButton: !1,
              autoRefresh: !1,
              lockDaysFormat: "YYYY-MM-DD",
              lockDays: [],
              disallowLockDaysInRange: !1,
              lockDaysInclusivity: "[]",
              highlightedDaysFormat: "YYYY-MM-DD",
              highlightedDays: [],
              dropdowns: {
                minYear: 1990,
                maxYear: null,
                months: !1,
                years: !1,
              },
              buttonText: {
                apply: "Apply",
                cancel: "Cancel",
                previousMonth:
                  '<svg width="11" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M7.919 0l2.748 2.667L5.333 8l5.334 5.333L7.919 16 0 8z" fill-rule="nonzero"/></svg>',
                nextMonth:
                  '<svg width="11" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M2.748 16L0 13.333 5.333 8 0 2.667 2.748 0l7.919 8z" fill-rule="nonzero"/></svg>',
                reset:
                  '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">\n        <path d="M0 0h24v24H0z" fill="none"/>\n        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>\n      </svg>',
              },
              tooltipText: { one: "day", other: "days" },
            }),
            (i.options = s(s({}, i.options), e.element.dataset)),
            Object.keys(i.options).forEach(function (t) {
              ("true" !== i.options[t] && "false" !== i.options[t]) ||
                (i.options[t] = "true" === i.options[t]);
            });
          var n = s(s({}, i.options.dropdowns), e.dropdowns),
            o = s(s({}, i.options.buttonText), e.buttonText),
            r = s(s({}, i.options.tooltipText), e.tooltipText);
          (i.options = s(s({}, i.options), e)),
            (i.options.dropdowns = s({}, n)),
            (i.options.buttonText = s({}, o)),
            (i.options.tooltipText = s({}, r)),
            i.options.elementEnd || (i.options.allowRepick = !1),
            i.options.lockDays.length &&
              (i.options.lockDays = a.DateTime.convertArray(
                i.options.lockDays,
                i.options.lockDaysFormat,
              )),
            i.options.highlightedDays.length &&
              (i.options.highlightedDays = a.DateTime.convertArray(
                i.options.highlightedDays,
                i.options.highlightedDaysFormat,
              ));
          var l = i.parseInput(),
            c = l[0],
            h = l[1];
          i.options.startDate &&
            (i.options.singleMode || i.options.endDate) &&
            (c = new a.DateTime(
              i.options.startDate,
              i.options.format,
              i.options.lang,
            )),
            c &&
              i.options.endDate &&
              (h = new a.DateTime(
                i.options.endDate,
                i.options.format,
                i.options.lang,
              )),
            c instanceof a.DateTime &&
              !isNaN(c.getTime()) &&
              (i.options.startDate = c),
            i.options.startDate &&
              h instanceof a.DateTime &&
              !isNaN(h.getTime()) &&
              (i.options.endDate = h),
            !i.options.singleMode ||
              i.options.startDate instanceof a.DateTime ||
              (i.options.startDate = null),
            i.options.singleMode ||
              (i.options.startDate instanceof a.DateTime &&
                i.options.endDate instanceof a.DateTime) ||
              ((i.options.startDate = null), (i.options.endDate = null));
          for (var p = 0; p < i.options.numberOfMonths; p += 1) {
            var d =
              i.options.startDate instanceof a.DateTime
                ? i.options.startDate.clone()
                : new a.DateTime();
            if (!i.options.startDate && (0 === p || i.options.splitView)) {
              var u = i.options.maxDate
                  ? new a.DateTime(i.options.maxDate)
                  : null,
                m = i.options.minDate
                  ? new a.DateTime(i.options.minDate)
                  : null,
                f = i.options.numberOfMonths - 1;
              m && u && d.isAfter(u)
                ? (d = m.clone()).setDate(1)
                : !m &&
                  u &&
                  d.isAfter(u) &&
                  ((d = u.clone()).setDate(1), d.setMonth(d.getMonth() - f));
            }
            d.setDate(1), d.setMonth(d.getMonth() + p), (i.calendars[p] = d);
          }
          if (i.options.showTooltip)
            if (i.options.tooltipPluralSelector)
              i.pluralSelector = i.options.tooltipPluralSelector;
            else
              try {
                var g = new Intl.PluralRules(i.options.lang);
                i.pluralSelector = g.select.bind(g);
              } catch (t) {
                i.pluralSelector = function (t) {
                  return 0 === Math.abs(t) ? "one" : "other";
                };
              }
          return i;
        }
        return (
          o(e, t),
          (e.add = function (t, e) {
            l.Litepicker.prototype[t] = e;
          }),
          (e.prototype.DateTime = function (t, e) {
            return t ? new a.DateTime(t, e) : new a.DateTime();
          }),
          (e.prototype.init = function () {
            var t = this;
            this.options.plugins &&
              this.options.plugins.length &&
              this.options.plugins.forEach(function (e) {
                l.Litepicker.prototype.hasOwnProperty(e)
                  ? l.Litepicker.prototype[e].init.call(t, t)
                  : console.warn("Litepicker: plugin «" + e + "» not found.");
              });
          }),
          (e.prototype.parseInput = function () {
            var t = this.options.delimiter,
              e = new RegExp("" + t),
              i =
                this.options.element instanceof HTMLInputElement
                  ? this.options.element.value.split(t)
                  : [];
            if (this.options.elementEnd) {
              if (
                this.options.element instanceof HTMLInputElement &&
                this.options.element.value.length &&
                this.options.elementEnd instanceof HTMLInputElement &&
                this.options.elementEnd.value.length
              )
                return [
                  new a.DateTime(
                    this.options.element.value,
                    this.options.format,
                  ),
                  new a.DateTime(
                    this.options.elementEnd.value,
                    this.options.format,
                  ),
                ];
            } else if (this.options.singleMode) {
              if (
                this.options.element instanceof HTMLInputElement &&
                this.options.element.value.length
              )
                return [
                  new a.DateTime(
                    this.options.element.value,
                    this.options.format,
                  ),
                ];
            } else if (
              this.options.element instanceof HTMLInputElement &&
              e.test(this.options.element.value) &&
              i.length &&
              i.length % 2 == 0
            ) {
              var n = i.slice(0, i.length / 2).join(t),
                o = i.slice(i.length / 2).join(t);
              return [
                new a.DateTime(n, this.options.format),
                new a.DateTime(o, this.options.format),
              ];
            }
            return [];
          }),
          (e.prototype.isShowning = function () {
            return this.ui && "none" !== this.ui.style.display;
          }),
          (e.prototype.findPosition = function (t) {
            var e = t.getBoundingClientRect(),
              i = this.ui.getBoundingClientRect(),
              n = this.options.position.split(" "),
              o = window.scrollX || window.pageXOffset,
              s = window.scrollY || window.pageYOffset,
              r = 0,
              a = 0;
            if ("auto" !== n[0] && /top|bottom/.test(n[0]))
              (r = e[n[0]] + s), "top" === n[0] && (r -= i.height);
            else {
              r = e.bottom + s;
              var l = e.bottom + i.height > window.innerHeight,
                c = e.top + s - i.height >= i.height;
              l && c && (r = e.top + s - i.height);
            }
            if (
              /left|right/.test(n[0]) ||
              (n[1] && "auto" !== n[1] && /left|right/.test(n[1]))
            )
              (a = /left|right/.test(n[0]) ? e[n[0]] + o : e[n[1]] + o),
                ("right" !== n[0] && "right" !== n[1]) || (a -= i.width);
            else {
              a = e.left + o;
              l = e.left + i.width > window.innerWidth;
              var h = e.right + o - i.width >= 0;
              l && h && (a = e.right + o - i.width);
            }
            return { left: a, top: r };
          }),
          e
        );
      })(r.EventEmitter);
    e.LPCore = c;
  },
  function (t, e, i) {
    "use strict";
    var n,
      o = "object" == typeof Reflect ? Reflect : null,
      s =
        o && "function" == typeof o.apply
          ? o.apply
          : function (t, e, i) {
              return Function.prototype.apply.call(t, e, i);
            };
    n =
      o && "function" == typeof o.ownKeys
        ? o.ownKeys
        : Object.getOwnPropertySymbols
          ? function (t) {
              return Object.getOwnPropertyNames(t).concat(
                Object.getOwnPropertySymbols(t),
              );
            }
          : function (t) {
              return Object.getOwnPropertyNames(t);
            };
    var r =
      Number.isNaN ||
      function (t) {
        return t != t;
      };
    function a() {
      a.init.call(this);
    }
    (t.exports = a),
      (a.EventEmitter = a),
      (a.prototype._events = void 0),
      (a.prototype._eventsCount = 0),
      (a.prototype._maxListeners = void 0);
    var l = 10;
    function c(t) {
      return void 0 === t._maxListeners
        ? a.defaultMaxListeners
        : t._maxListeners;
    }
    function h(t, e, i, n) {
      var o, s, r, a;
      if ("function" != typeof i)
        throw new TypeError(
          'The "listener" argument must be of type Function. Received type ' +
            typeof i,
        );
      if (
        (void 0 === (s = t._events)
          ? ((s = t._events = Object.create(null)), (t._eventsCount = 0))
          : (void 0 !== s.newListener &&
              (t.emit("newListener", e, i.listener ? i.listener : i),
              (s = t._events)),
            (r = s[e])),
        void 0 === r)
      )
        (r = s[e] = i), ++t._eventsCount;
      else if (
        ("function" == typeof r
          ? (r = s[e] = n ? [i, r] : [r, i])
          : n
            ? r.unshift(i)
            : r.push(i),
        (o = c(t)) > 0 && r.length > o && !r.warned)
      ) {
        r.warned = !0;
        var l = new Error(
          "Possible EventEmitter memory leak detected. " +
            r.length +
            " " +
            String(e) +
            " listeners added. Use emitter.setMaxListeners() to increase limit",
        );
        (l.name = "MaxListenersExceededWarning"),
          (l.emitter = t),
          (l.type = e),
          (l.count = r.length),
          (a = l),
          console && console.warn && console.warn(a);
      }
      return t;
    }
    function p() {
      for (var t = [], e = 0; e < arguments.length; e++) t.push(arguments[e]);
      this.fired ||
        (this.target.removeListener(this.type, this.wrapFn),
        (this.fired = !0),
        s(this.listener, this.target, t));
    }
    function d(t, e, i) {
      var n = { fired: !1, wrapFn: void 0, target: t, type: e, listener: i },
        o = p.bind(n);
      return (o.listener = i), (n.wrapFn = o), o;
    }
    function u(t, e, i) {
      var n = t._events;
      if (void 0 === n) return [];
      var o = n[e];
      return void 0 === o
        ? []
        : "function" == typeof o
          ? i
            ? [o.listener || o]
            : [o]
          : i
            ? (function (t) {
                for (var e = new Array(t.length), i = 0; i < e.length; ++i)
                  e[i] = t[i].listener || t[i];
                return e;
              })(o)
            : f(o, o.length);
    }
    function m(t) {
      var e = this._events;
      if (void 0 !== e) {
        var i = e[t];
        if ("function" == typeof i) return 1;
        if (void 0 !== i) return i.length;
      }
      return 0;
    }
    function f(t, e) {
      for (var i = new Array(e), n = 0; n < e; ++n) i[n] = t[n];
      return i;
    }
    Object.defineProperty(a, "defaultMaxListeners", {
      enumerable: !0,
      get: function () {
        return l;
      },
      set: function (t) {
        if ("number" != typeof t || t < 0 || r(t))
          throw new RangeError(
            'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
              t +
              ".",
          );
        l = t;
      },
    }),
      (a.init = function () {
        (void 0 !== this._events &&
          this._events !== Object.getPrototypeOf(this)._events) ||
          ((this._events = Object.create(null)), (this._eventsCount = 0)),
          (this._maxListeners = this._maxListeners || void 0);
      }),
      (a.prototype.setMaxListeners = function (t) {
        if ("number" != typeof t || t < 0 || r(t))
          throw new RangeError(
            'The value of "n" is out of range. It must be a non-negative number. Received ' +
              t +
              ".",
          );
        return (this._maxListeners = t), this;
      }),
      (a.prototype.getMaxListeners = function () {
        return c(this);
      }),
      (a.prototype.emit = function (t) {
        for (var e = [], i = 1; i < arguments.length; i++) e.push(arguments[i]);
        var n = "error" === t,
          o = this._events;
        if (void 0 !== o) n = n && void 0 === o.error;
        else if (!n) return !1;
        if (n) {
          var r;
          if ((e.length > 0 && (r = e[0]), r instanceof Error)) throw r;
          var a = new Error(
            "Unhandled error." + (r ? " (" + r.message + ")" : ""),
          );
          throw ((a.context = r), a);
        }
        var l = o[t];
        if (void 0 === l) return !1;
        if ("function" == typeof l) s(l, this, e);
        else {
          var c = l.length,
            h = f(l, c);
          for (i = 0; i < c; ++i) s(h[i], this, e);
        }
        return !0;
      }),
      (a.prototype.addListener = function (t, e) {
        return h(this, t, e, !1);
      }),
      (a.prototype.on = a.prototype.addListener),
      (a.prototype.prependListener = function (t, e) {
        return h(this, t, e, !0);
      }),
      (a.prototype.once = function (t, e) {
        if ("function" != typeof e)
          throw new TypeError(
            'The "listener" argument must be of type Function. Received type ' +
              typeof e,
          );
        return this.on(t, d(this, t, e)), this;
      }),
      (a.prototype.prependOnceListener = function (t, e) {
        if ("function" != typeof e)
          throw new TypeError(
            'The "listener" argument must be of type Function. Received type ' +
              typeof e,
          );
        return this.prependListener(t, d(this, t, e)), this;
      }),
      (a.prototype.removeListener = function (t, e) {
        var i, n, o, s, r;
        if ("function" != typeof e)
          throw new TypeError(
            'The "listener" argument must be of type Function. Received type ' +
              typeof e,
          );
        if (void 0 === (n = this._events)) return this;
        if (void 0 === (i = n[t])) return this;
        if (i === e || i.listener === e)
          0 == --this._eventsCount
            ? (this._events = Object.create(null))
            : (delete n[t],
              n.removeListener &&
                this.emit("removeListener", t, i.listener || e));
        else if ("function" != typeof i) {
          for (o = -1, s = i.length - 1; s >= 0; s--)
            if (i[s] === e || i[s].listener === e) {
              (r = i[s].listener), (o = s);
              break;
            }
          if (o < 0) return this;
          0 === o
            ? i.shift()
            : (function (t, e) {
                for (; e + 1 < t.length; e++) t[e] = t[e + 1];
                t.pop();
              })(i, o),
            1 === i.length && (n[t] = i[0]),
            void 0 !== n.removeListener &&
              this.emit("removeListener", t, r || e);
        }
        return this;
      }),
      (a.prototype.off = a.prototype.removeListener),
      (a.prototype.removeAllListeners = function (t) {
        var e, i, n;
        if (void 0 === (i = this._events)) return this;
        if (void 0 === i.removeListener)
          return (
            0 === arguments.length
              ? ((this._events = Object.create(null)), (this._eventsCount = 0))
              : void 0 !== i[t] &&
                (0 == --this._eventsCount
                  ? (this._events = Object.create(null))
                  : delete i[t]),
            this
          );
        if (0 === arguments.length) {
          var o,
            s = Object.keys(i);
          for (n = 0; n < s.length; ++n)
            "removeListener" !== (o = s[n]) && this.removeAllListeners(o);
          return (
            this.removeAllListeners("removeListener"),
            (this._events = Object.create(null)),
            (this._eventsCount = 0),
            this
          );
        }
        if ("function" == typeof (e = i[t])) this.removeListener(t, e);
        else if (void 0 !== e)
          for (n = e.length - 1; n >= 0; n--) this.removeListener(t, e[n]);
        return this;
      }),
      (a.prototype.listeners = function (t) {
        return u(this, t, !0);
      }),
      (a.prototype.rawListeners = function (t) {
        return u(this, t, !1);
      }),
      (a.listenerCount = function (t, e) {
        return "function" == typeof t.listenerCount
          ? t.listenerCount(e)
          : m.call(t, e);
      }),
      (a.prototype.listenerCount = m),
      (a.prototype.eventNames = function () {
        return this._eventsCount > 0 ? n(this._events) : [];
      });
  },
  function (t, e, i) {
    (e = i(9)(!1)).push([
      t.i,
      ':root{--litepicker-container-months-color-bg: #fff;--litepicker-container-months-box-shadow-color: #ddd;--litepicker-footer-color-bg: #fafafa;--litepicker-footer-box-shadow-color: #ddd;--litepicker-tooltip-color-bg: #fff;--litepicker-month-header-color: #333;--litepicker-button-prev-month-color: #9e9e9e;--litepicker-button-next-month-color: #9e9e9e;--litepicker-button-prev-month-color-hover: #2196f3;--litepicker-button-next-month-color-hover: #2196f3;--litepicker-month-width: calc(var(--litepicker-day-width) * 7);--litepicker-month-weekday-color: #9e9e9e;--litepicker-month-week-number-color: #9e9e9e;--litepicker-day-width: 38px;--litepicker-day-color: #333;--litepicker-day-color-hover: #2196f3;--litepicker-is-today-color: #f44336;--litepicker-is-in-range-color: #bbdefb;--litepicker-is-locked-color: #9e9e9e;--litepicker-is-start-color: #fff;--litepicker-is-start-color-bg: #2196f3;--litepicker-is-end-color: #fff;--litepicker-is-end-color-bg: #2196f3;--litepicker-button-cancel-color: #fff;--litepicker-button-cancel-color-bg: #9e9e9e;--litepicker-button-apply-color: #fff;--litepicker-button-apply-color-bg: #2196f3;--litepicker-button-reset-color: #909090;--litepicker-button-reset-color-hover: #2196f3;--litepicker-highlighted-day-color: #333;--litepicker-highlighted-day-color-bg: #ffeb3b}.show-week-numbers{--litepicker-month-width: calc(var(--litepicker-day-width) * 8)}.litepicker{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;font-size:0.8em;display:none}.litepicker button{border:none;background:none}.litepicker .container__main{display:-webkit-box;display:-ms-flexbox;display:flex}.litepicker .container__months{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;background-color:var(--litepicker-container-months-color-bg);border-radius:5px;-webkit-box-shadow:0 0 5px var(--litepicker-container-months-box-shadow-color);box-shadow:0 0 5px var(--litepicker-container-months-box-shadow-color);width:calc(var(--litepicker-month-width) + 10px);-webkit-box-sizing:content-box;box-sizing:content-box}.litepicker .container__months.columns-2{width:calc((var(--litepicker-month-width) * 2) + 20px)}.litepicker .container__months.columns-3{width:calc((var(--litepicker-month-width) * 3) + 30px)}.litepicker .container__months.columns-4{width:calc((var(--litepicker-month-width) * 4) + 40px)}.litepicker .container__months.split-view .month-item-header .button-previous-month,.litepicker .container__months.split-view .month-item-header .button-next-month{visibility:visible}.litepicker .container__months .month-item{padding:5px;width:var(--litepicker-month-width);-webkit-box-sizing:content-box;box-sizing:content-box}.litepicker .container__months .month-item-header{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;font-weight:500;padding:10px 5px;text-align:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;color:var(--litepicker-month-header-color)}.litepicker .container__months .month-item-header div{-webkit-box-flex:1;-ms-flex:1;flex:1}.litepicker .container__months .month-item-header div>.month-item-name{margin-right:5px}.litepicker .container__months .month-item-header div>.month-item-year{padding:0}.litepicker .container__months .month-item-header .reset-button{color:var(--litepicker-button-reset-color)}.litepicker .container__months .month-item-header .reset-button>svg{fill:var(--litepicker-button-reset-color)}.litepicker .container__months .month-item-header .reset-button *{pointer-events:none}.litepicker .container__months .month-item-header .reset-button:hover{color:var(--litepicker-button-reset-color-hover)}.litepicker .container__months .month-item-header .reset-button:hover>svg{fill:var(--litepicker-button-reset-color-hover)}.litepicker .container__months .month-item-header .button-previous-month,.litepicker .container__months .month-item-header .button-next-month{visibility:hidden;text-decoration:none;padding:3px 5px;border-radius:3px;-webkit-transition:color 0.3s, border 0.3s;transition:color 0.3s, border 0.3s;cursor:default}.litepicker .container__months .month-item-header .button-previous-month *,.litepicker .container__months .month-item-header .button-next-month *{pointer-events:none}.litepicker .container__months .month-item-header .button-previous-month{color:var(--litepicker-button-prev-month-color)}.litepicker .container__months .month-item-header .button-previous-month>svg,.litepicker .container__months .month-item-header .button-previous-month>img{fill:var(--litepicker-button-prev-month-color)}.litepicker .container__months .month-item-header .button-previous-month:hover{color:var(--litepicker-button-prev-month-color-hover)}.litepicker .container__months .month-item-header .button-previous-month:hover>svg{fill:var(--litepicker-button-prev-month-color-hover)}.litepicker .container__months .month-item-header .button-next-month{color:var(--litepicker-button-next-month-color)}.litepicker .container__months .month-item-header .button-next-month>svg,.litepicker .container__months .month-item-header .button-next-month>img{fill:var(--litepicker-button-next-month-color)}.litepicker .container__months .month-item-header .button-next-month:hover{color:var(--litepicker-button-next-month-color-hover)}.litepicker .container__months .month-item-header .button-next-month:hover>svg{fill:var(--litepicker-button-next-month-color-hover)}.litepicker .container__months .month-item-weekdays-row{display:-webkit-box;display:-ms-flexbox;display:flex;justify-self:center;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;color:var(--litepicker-month-weekday-color)}.litepicker .container__months .month-item-weekdays-row>div{padding:5px 0;font-size:85%;-webkit-box-flex:1;-ms-flex:1;flex:1;width:var(--litepicker-day-width);text-align:center}.litepicker .container__months .month-item:first-child .button-previous-month{visibility:visible}.litepicker .container__months .month-item:last-child .button-next-month{visibility:visible}.litepicker .container__months .month-item.no-previous-month .button-previous-month{visibility:hidden}.litepicker .container__months .month-item.no-next-month .button-next-month{visibility:hidden}.litepicker .container__days{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;justify-self:center;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;text-align:center;-webkit-box-sizing:content-box;box-sizing:content-box}.litepicker .container__days>div,.litepicker .container__days>a{padding:5px 0;width:var(--litepicker-day-width)}.litepicker .container__days .day-item{color:var(--litepicker-day-color);text-align:center;text-decoration:none;border-radius:3px;-webkit-transition:color 0.3s, border 0.3s;transition:color 0.3s, border 0.3s;cursor:default}.litepicker .container__days .day-item:hover{color:var(--litepicker-day-color-hover);-webkit-box-shadow:inset 0 0 0 1px var(--litepicker-day-color-hover);box-shadow:inset 0 0 0 1px var(--litepicker-day-color-hover)}.litepicker .container__days .day-item.is-today{color:var(--litepicker-is-today-color)}.litepicker .container__days .day-item.is-locked{color:var(--litepicker-is-locked-color)}.litepicker .container__days .day-item.is-locked:hover{color:var(--litepicker-is-locked-color);-webkit-box-shadow:none;box-shadow:none;cursor:default}.litepicker .container__days .day-item.is-in-range{background-color:var(--litepicker-is-in-range-color);border-radius:0}.litepicker .container__days .day-item.is-start-date{color:var(--litepicker-is-start-color);background-color:var(--litepicker-is-start-color-bg);border-top-left-radius:5px;border-bottom-left-radius:5px;border-top-right-radius:0;border-bottom-right-radius:0}.litepicker .container__days .day-item.is-start-date.is-flipped{border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:5px;border-bottom-right-radius:5px}.litepicker .container__days .day-item.is-end-date{color:var(--litepicker-is-end-color);background-color:var(--litepicker-is-end-color-bg);border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:5px;border-bottom-right-radius:5px}.litepicker .container__days .day-item.is-end-date.is-flipped{border-top-left-radius:5px;border-bottom-left-radius:5px;border-top-right-radius:0;border-bottom-right-radius:0}.litepicker .container__days .day-item.is-start-date.is-end-date{border-top-left-radius:5px;border-bottom-left-radius:5px;border-top-right-radius:5px;border-bottom-right-radius:5px}.litepicker .container__days .day-item.is-highlighted{color:var(--litepicker-highlighted-day-color);background-color:var(--litepicker-highlighted-day-color-bg)}.litepicker .container__days .week-number{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;color:var(--litepicker-month-week-number-color);font-size:85%}.litepicker .container__footer{text-align:right;padding:10px 5px;margin:0 5px;background-color:var(--litepicker-footer-color-bg);-webkit-box-shadow:inset 0px 3px 3px 0px var(--litepicker-footer-box-shadow-color);box-shadow:inset 0px 3px 3px 0px var(--litepicker-footer-box-shadow-color);border-bottom-left-radius:5px;border-bottom-right-radius:5px}.litepicker .container__footer .preview-date-range{margin-right:10px;font-size:90%}.litepicker .container__footer .button-cancel{background-color:var(--litepicker-button-cancel-color-bg);color:var(--litepicker-button-cancel-color);border:0;padding:3px 7px 4px;border-radius:3px}.litepicker .container__footer .button-cancel *{pointer-events:none}.litepicker .container__footer .button-apply{background-color:var(--litepicker-button-apply-color-bg);color:var(--litepicker-button-apply-color);border:0;padding:3px 7px 4px;border-radius:3px;margin-left:10px;margin-right:10px}.litepicker .container__footer .button-apply:disabled{opacity:0.7}.litepicker .container__footer .button-apply *{pointer-events:none}.litepicker .container__tooltip{position:absolute;margin-top:-4px;padding:4px 8px;border-radius:4px;background-color:var(--litepicker-tooltip-color-bg);-webkit-box-shadow:0 1px 3px rgba(0,0,0,0.25);box-shadow:0 1px 3px rgba(0,0,0,0.25);white-space:nowrap;font-size:11px;pointer-events:none;visibility:hidden}.litepicker .container__tooltip:before{position:absolute;bottom:-5px;left:calc(50% - 5px);border-top:5px solid rgba(0,0,0,0.12);border-right:5px solid transparent;border-left:5px solid transparent;content:""}.litepicker .container__tooltip:after{position:absolute;bottom:-4px;left:calc(50% - 4px);border-top:4px solid var(--litepicker-tooltip-color-bg);border-right:4px solid transparent;border-left:4px solid transparent;content:""}\n',
      "",
    ]),
      (e.locals = {
        showWeekNumbers: "show-week-numbers",
        litepicker: "litepicker",
        containerMain: "container__main",
        containerMonths: "container__months",
        columns2: "columns-2",
        columns3: "columns-3",
        columns4: "columns-4",
        splitView: "split-view",
        monthItemHeader: "month-item-header",
        buttonPreviousMonth: "button-previous-month",
        buttonNextMonth: "button-next-month",
        monthItem: "month-item",
        monthItemName: "month-item-name",
        monthItemYear: "month-item-year",
        resetButton: "reset-button",
        monthItemWeekdaysRow: "month-item-weekdays-row",
        noPreviousMonth: "no-previous-month",
        noNextMonth: "no-next-month",
        containerDays: "container__days",
        dayItem: "day-item",
        isToday: "is-today",
        isLocked: "is-locked",
        isInRange: "is-in-range",
        isStartDate: "is-start-date",
        isFlipped: "is-flipped",
        isEndDate: "is-end-date",
        isHighlighted: "is-highlighted",
        weekNumber: "week-number",
        containerFooter: "container__footer",
        previewDateRange: "preview-date-range",
        buttonCancel: "button-cancel",
        buttonApply: "button-apply",
        containerTooltip: "container__tooltip",
      }),
      (t.exports = e);
  },
  function (t, e, i) {
    "use strict";
    t.exports = function (t) {
      var e = [];
      return (
        (e.toString = function () {
          return this.map(function (e) {
            var i = (function (t, e) {
              var i = t[1] || "",
                n = t[3];
              if (!n) return i;
              if (e && "function" == typeof btoa) {
                var o =
                    ((r = n),
                    (a = btoa(unescape(encodeURIComponent(JSON.stringify(r))))),
                    (l =
                      "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(
                        a,
                      )),
                    "/*# ".concat(l, " */")),
                  s = n.sources.map(function (t) {
                    return "/*# sourceURL="
                      .concat(n.sourceRoot || "")
                      .concat(t, " */");
                  });
                return [i].concat(s).concat([o]).join("\n");
              }
              var r, a, l;
              return [i].join("\n");
            })(e, t);
            return e[2] ? "@media ".concat(e[2], " {").concat(i, "}") : i;
          }).join("");
        }),
        (e.i = function (t, i, n) {
          "string" == typeof t && (t = [[null, t, ""]]);
          var o = {};
          if (n)
            for (var s = 0; s < this.length; s++) {
              var r = this[s][0];
              null != r && (o[r] = !0);
            }
          for (var a = 0; a < t.length; a++) {
            var l = [].concat(t[a]);
            (n && o[l[0]]) ||
              (i &&
                (l[2]
                  ? (l[2] = "".concat(i, " and ").concat(l[2]))
                  : (l[2] = i)),
              e.push(l));
          }
        }),
        e
      );
    };
  },
  function (t, e, i) {
    "use strict";
    var n,
      o = {},
      s = function () {
        return (
          void 0 === n &&
            (n = Boolean(window && document && document.all && !window.atob)),
          n
        );
      },
      r = (function () {
        var t = {};
        return function (e) {
          if (void 0 === t[e]) {
            var i = document.querySelector(e);
            if (
              window.HTMLIFrameElement &&
              i instanceof window.HTMLIFrameElement
            )
              try {
                i = i.contentDocument.head;
              } catch (t) {
                i = null;
              }
            t[e] = i;
          }
          return t[e];
        };
      })();
    function a(t, e) {
      for (var i = [], n = {}, o = 0; o < t.length; o++) {
        var s = t[o],
          r = e.base ? s[0] + e.base : s[0],
          a = { css: s[1], media: s[2], sourceMap: s[3] };
        n[r] ? n[r].parts.push(a) : i.push((n[r] = { id: r, parts: [a] }));
      }
      return i;
    }
    function l(t, e) {
      for (var i = 0; i < t.length; i++) {
        var n = t[i],
          s = o[n.id],
          r = 0;
        if (s) {
          for (s.refs++; r < s.parts.length; r++) s.parts[r](n.parts[r]);
          for (; r < n.parts.length; r++) s.parts.push(g(n.parts[r], e));
        } else {
          for (var a = []; r < n.parts.length; r++) a.push(g(n.parts[r], e));
          o[n.id] = { id: n.id, refs: 1, parts: a };
        }
      }
    }
    function c(t) {
      var e = document.createElement("style");
      if (void 0 === t.attributes.nonce) {
        var n = i.nc;
        n && (t.attributes.nonce = n);
      }
      if (
        (Object.keys(t.attributes).forEach(function (i) {
          e.setAttribute(i, t.attributes[i]);
        }),
        "function" == typeof t.insert)
      )
        t.insert(e);
      else {
        var o = r(t.insert || "head");
        if (!o)
          throw new Error(
            "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.",
          );
        o.appendChild(e);
      }
      return e;
    }
    var h,
      p =
        ((h = []),
        function (t, e) {
          return (h[t] = e), h.filter(Boolean).join("\n");
        });
    function d(t, e, i, n) {
      var o = i ? "" : n.css;
      if (t.styleSheet) t.styleSheet.cssText = p(e, o);
      else {
        var s = document.createTextNode(o),
          r = t.childNodes;
        r[e] && t.removeChild(r[e]),
          r.length ? t.insertBefore(s, r[e]) : t.appendChild(s);
      }
    }
    function u(t, e, i) {
      var n = i.css,
        o = i.media,
        s = i.sourceMap;
      if (
        (o && t.setAttribute("media", o),
        s &&
          btoa &&
          (n += "\n/*# sourceMappingURL=data:application/json;base64,".concat(
            btoa(unescape(encodeURIComponent(JSON.stringify(s)))),
            " */",
          )),
        t.styleSheet)
      )
        t.styleSheet.cssText = n;
      else {
        for (; t.firstChild; ) t.removeChild(t.firstChild);
        t.appendChild(document.createTextNode(n));
      }
    }
    var m = null,
      f = 0;
    function g(t, e) {
      var i, n, o;
      if (e.singleton) {
        var s = f++;
        (i = m || (m = c(e))),
          (n = d.bind(null, i, s, !1)),
          (o = d.bind(null, i, s, !0));
      } else
        (i = c(e)),
          (n = u.bind(null, i, e)),
          (o = function () {
            !(function (t) {
              if (null === t.parentNode) return !1;
              t.parentNode.removeChild(t);
            })(i);
          });
      return (
        n(t),
        function (e) {
          if (e) {
            if (
              e.css === t.css &&
              e.media === t.media &&
              e.sourceMap === t.sourceMap
            )
              return;
            n((t = e));
          } else o();
        }
      );
    }
    t.exports = function (t, e) {
      ((e = e || {}).attributes =
        "object" == typeof e.attributes ? e.attributes : {}),
        e.singleton || "boolean" == typeof e.singleton || (e.singleton = s());
      var i = a(t, e);
      return (
        l(i, e),
        function (t) {
          for (var n = [], s = 0; s < i.length; s++) {
            var r = i[s],
              c = o[r.id];
            c && (c.refs--, n.push(c));
          }
          t && l(a(t, e), e);
          for (var h = 0; h < n.length; h++) {
            var p = n[h];
            if (0 === p.refs) {
              for (var d = 0; d < p.parts.length; d++) p.parts[d]();
              delete o[p.id];
            }
          }
        }
      );
    };
  },
  function (t, e, i) {
    "use strict";
    var n =
      (this && this.__assign) ||
      function () {
        return (n =
          Object.assign ||
          function (t) {
            for (var e, i = 1, n = arguments.length; i < n; i++)
              for (var o in (e = arguments[i]))
                Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
            return t;
          }).apply(this, arguments);
      };
    Object.defineProperty(e, "__esModule", { value: !0 });
    var o = i(0),
      s = i(1),
      r = i(2);
    (s.Litepicker.prototype.show = function (t) {
      void 0 === t && (t = null), this.emit("before:show", t);
      var e = t || this.options.element;
      if (((this.triggerElement = e), !this.isShowning())) {
        if (this.options.inlineMode)
          return (
            (this.ui.style.position = "relative"),
            (this.ui.style.display = "inline-block"),
            (this.ui.style.top = null),
            (this.ui.style.left = null),
            (this.ui.style.bottom = null),
            void (this.ui.style.right = null)
          );
        this.scrollToDate(t),
          this.render(),
          (this.ui.style.position = "absolute"),
          (this.ui.style.display = "block"),
          (this.ui.style.zIndex = this.options.zIndex);
        var i = this.findPosition(e);
        (this.ui.style.top = i.top + "px"),
          (this.ui.style.left = i.left + "px"),
          (this.ui.style.right = null),
          (this.ui.style.bottom = null),
          this.emit("show", t);
      }
    }),
      (s.Litepicker.prototype.hide = function () {
        this.isShowning() &&
          ((this.datePicked.length = 0),
          this.updateInput(),
          this.options.inlineMode
            ? this.render()
            : ((this.ui.style.display = "none"), this.emit("hide")));
      }),
      (s.Litepicker.prototype.getDate = function () {
        return this.getStartDate();
      }),
      (s.Litepicker.prototype.getStartDate = function () {
        return this.options.startDate ? this.options.startDate.clone() : null;
      }),
      (s.Litepicker.prototype.getEndDate = function () {
        return this.options.endDate ? this.options.endDate.clone() : null;
      }),
      (s.Litepicker.prototype.setDate = function (t, e) {
        void 0 === e && (e = !1);
        var i = new o.DateTime(t, this.options.format, this.options.lang);
        r.dateIsLocked(i, this.options, [i]) && !e
          ? this.emit("error:date", i)
          : (this.setStartDate(t),
            this.options.inlineMode && this.render(),
            this.emit("selected", this.getDate()));
      }),
      (s.Litepicker.prototype.setStartDate = function (t) {
        t &&
          ((this.options.startDate = new o.DateTime(
            t,
            this.options.format,
            this.options.lang,
          )),
          this.updateInput());
      }),
      (s.Litepicker.prototype.setEndDate = function (t) {
        t &&
          ((this.options.endDate = new o.DateTime(
            t,
            this.options.format,
            this.options.lang,
          )),
          this.options.startDate.getTime() > this.options.endDate.getTime() &&
            ((this.options.endDate = this.options.startDate.clone()),
            (this.options.startDate = new o.DateTime(
              t,
              this.options.format,
              this.options.lang,
            ))),
          this.updateInput());
      }),
      (s.Litepicker.prototype.setDateRange = function (t, e, i) {
        void 0 === i && (i = !1), (this.triggerElement = void 0);
        var n = new o.DateTime(t, this.options.format, this.options.lang),
          s = new o.DateTime(e, this.options.format, this.options.lang);
        (this.options.disallowLockDaysInRange
          ? r.rangeIsLocked([n, s], this.options)
          : r.dateIsLocked(n, this.options, [n, s]) ||
            r.dateIsLocked(s, this.options, [n, s])) && !i
          ? this.emit("error:range", [n, s])
          : (this.setStartDate(n),
            this.setEndDate(s),
            this.options.inlineMode && this.render(),
            this.updateInput(),
            this.emit("selected", this.getStartDate(), this.getEndDate()));
      }),
      (s.Litepicker.prototype.gotoDate = function (t, e) {
        void 0 === e && (e = 0);
        var i = new o.DateTime(t);
        i.setDate(1), (this.calendars[e] = i.clone()), this.render();
      }),
      (s.Litepicker.prototype.setLockDays = function (t) {
        (this.options.lockDays = o.DateTime.convertArray(
          t,
          this.options.lockDaysFormat,
        )),
          this.render();
      }),
      (s.Litepicker.prototype.setHighlightedDays = function (t) {
        (this.options.highlightedDays = o.DateTime.convertArray(
          t,
          this.options.highlightedDaysFormat,
        )),
          this.render();
      }),
      (s.Litepicker.prototype.setOptions = function (t) {
        delete t.element,
          delete t.elementEnd,
          delete t.parentEl,
          t.startDate &&
            (t.startDate = new o.DateTime(
              t.startDate,
              this.options.format,
              this.options.lang,
            )),
          t.endDate &&
            (t.endDate = new o.DateTime(
              t.endDate,
              this.options.format,
              this.options.lang,
            ));
        var e = n(n({}, this.options.dropdowns), t.dropdowns),
          i = n(n({}, this.options.buttonText), t.buttonText),
          s = n(n({}, this.options.tooltipText), t.tooltipText);
        (this.options = n(n({}, this.options), t)),
          (this.options.dropdowns = n({}, e)),
          (this.options.buttonText = n({}, i)),
          (this.options.tooltipText = n({}, s)),
          !this.options.singleMode ||
            this.options.startDate instanceof o.DateTime ||
            ((this.options.startDate = null), (this.options.endDate = null)),
          this.options.singleMode ||
            (this.options.startDate instanceof o.DateTime &&
              this.options.endDate instanceof o.DateTime) ||
            ((this.options.startDate = null), (this.options.endDate = null));
        for (var r = 0; r < this.options.numberOfMonths; r += 1) {
          var a = this.options.startDate
            ? this.options.startDate.clone()
            : new o.DateTime();
          a.setDate(1), a.setMonth(a.getMonth() + r), (this.calendars[r] = a);
        }
        this.options.lockDays.length &&
          (this.options.lockDays = o.DateTime.convertArray(
            this.options.lockDays,
            this.options.lockDaysFormat,
          )),
          this.options.highlightedDays.length &&
            (this.options.highlightedDays = o.DateTime.convertArray(
              this.options.highlightedDays,
              this.options.highlightedDaysFormat,
            )),
          this.render(),
          this.options.inlineMode && this.show(),
          this.updateInput();
      }),
      (s.Litepicker.prototype.clearSelection = function () {
        (this.options.startDate = null),
          (this.options.endDate = null),
          (this.datePicked.length = 0),
          this.updateInput(),
          this.isShowning() && this.render(),
          this.emit("clear:selection");
      }),
      (s.Litepicker.prototype.destroy = function () {
        this.ui &&
          this.ui.parentNode &&
          (this.ui.parentNode.removeChild(this.ui), (this.ui = null)),
          this.emit("destroy");
      });
  },
]).Litepicker;
/*!
 *
 * plugins/keyboardnav.js
 * Litepicker v2.0.11 (https://github.com/wakirin/Litepicker)
 * Package: litepicker (https://www.npmjs.com/package/litepicker)
 * License: MIT (https://github.com/wakirin/Litepicker/blob/master/LICENCE.md)
 * Copyright 2019-2021 Rinat G.
 *
 * Hash: 277f45be8f40444f8bed
 *
 */ !(function (e) {
  var t = {};
  function n(r) {
    if (t[r]) return t[r].exports;
    var o = (t[r] = { i: r, l: !1, exports: {} });
    return e[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function (e, t, r) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
    }),
    (n.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if (
        (n.r(r),
        Object.defineProperty(r, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var o in e)
          n.d(
            r,
            o,
            function (t) {
              return e[t];
            }.bind(null, o),
          );
      return r;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return n.d(t, "a", t), t;
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ""),
    n((n.s = 2));
})([
  function (e, t, n) {
    "use strict";
    e.exports = function (e) {
      var t = [];
      return (
        (t.toString = function () {
          return this.map(function (t) {
            var n = (function (e, t) {
              var n = e[1] || "",
                r = e[3];
              if (!r) return n;
              if (t && "function" == typeof btoa) {
                var o =
                    ((a = r),
                    (c = btoa(unescape(encodeURIComponent(JSON.stringify(a))))),
                    (s =
                      "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(
                        c,
                      )),
                    "/*# ".concat(s, " */")),
                  i = r.sources.map(function (e) {
                    return "/*# sourceURL="
                      .concat(r.sourceRoot || "")
                      .concat(e, " */");
                  });
                return [n].concat(i).concat([o]).join("\n");
              }
              var a, c, s;
              return [n].join("\n");
            })(t, e);
            return t[2] ? "@media ".concat(t[2], " {").concat(n, "}") : n;
          }).join("");
        }),
        (t.i = function (e, n, r) {
          "string" == typeof e && (e = [[null, e, ""]]);
          var o = {};
          if (r)
            for (var i = 0; i < this.length; i++) {
              var a = this[i][0];
              null != a && (o[a] = !0);
            }
          for (var c = 0; c < e.length; c++) {
            var s = [].concat(e[c]);
            (r && o[s[0]]) ||
              (n &&
                (s[2]
                  ? (s[2] = "".concat(n, " and ").concat(s[2]))
                  : (s[2] = n)),
              t.push(s));
          }
        }),
        t
      );
    };
  },
  function (e, t, n) {
    "use strict";
    var r,
      o = {},
      i = function () {
        return (
          void 0 === r &&
            (r = Boolean(window && document && document.all && !window.atob)),
          r
        );
      },
      a = (function () {
        var e = {};
        return function (t) {
          if (void 0 === e[t]) {
            var n = document.querySelector(t);
            if (
              window.HTMLIFrameElement &&
              n instanceof window.HTMLIFrameElement
            )
              try {
                n = n.contentDocument.head;
              } catch (e) {
                n = null;
              }
            e[t] = n;
          }
          return e[t];
        };
      })();
    function c(e, t) {
      for (var n = [], r = {}, o = 0; o < e.length; o++) {
        var i = e[o],
          a = t.base ? i[0] + t.base : i[0],
          c = { css: i[1], media: i[2], sourceMap: i[3] };
        r[a] ? r[a].parts.push(c) : n.push((r[a] = { id: a, parts: [c] }));
      }
      return n;
    }
    function s(e, t) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n],
          i = o[r.id],
          a = 0;
        if (i) {
          for (i.refs++; a < i.parts.length; a++) i.parts[a](r.parts[a]);
          for (; a < r.parts.length; a++) i.parts.push(m(r.parts[a], t));
        } else {
          for (var c = []; a < r.parts.length; a++) c.push(m(r.parts[a], t));
          o[r.id] = { id: r.id, refs: 1, parts: c };
        }
      }
    }
    function u(e) {
      var t = document.createElement("style");
      if (void 0 === e.attributes.nonce) {
        var r = n.nc;
        r && (e.attributes.nonce = r);
      }
      if (
        (Object.keys(e.attributes).forEach(function (n) {
          t.setAttribute(n, e.attributes[n]);
        }),
        "function" == typeof e.insert)
      )
        e.insert(t);
      else {
        var o = a(e.insert || "head");
        if (!o)
          throw new Error(
            "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.",
          );
        o.appendChild(t);
      }
      return t;
    }
    var l,
      f =
        ((l = []),
        function (e, t) {
          return (l[e] = t), l.filter(Boolean).join("\n");
        });
    function d(e, t, n, r) {
      var o = n ? "" : r.css;
      if (e.styleSheet) e.styleSheet.cssText = f(t, o);
      else {
        var i = document.createTextNode(o),
          a = e.childNodes;
        a[t] && e.removeChild(a[t]),
          a.length ? e.insertBefore(i, a[t]) : e.appendChild(i);
      }
    }
    function p(e, t, n) {
      var r = n.css,
        o = n.media,
        i = n.sourceMap;
      if (
        (o && e.setAttribute("media", o),
        i &&
          btoa &&
          (r += "\n/*# sourceMappingURL=data:application/json;base64,".concat(
            btoa(unescape(encodeURIComponent(JSON.stringify(i)))),
            " */",
          )),
        e.styleSheet)
      )
        e.styleSheet.cssText = r;
      else {
        for (; e.firstChild; ) e.removeChild(e.firstChild);
        e.appendChild(document.createTextNode(r));
      }
    }
    var b = null,
      v = 0;
    function m(e, t) {
      var n, r, o;
      if (t.singleton) {
        var i = v++;
        (n = b || (b = u(t))),
          (r = d.bind(null, n, i, !1)),
          (o = d.bind(null, n, i, !0));
      } else
        (n = u(t)),
          (r = p.bind(null, n, t)),
          (o = function () {
            !(function (e) {
              if (null === e.parentNode) return !1;
              e.parentNode.removeChild(e);
            })(n);
          });
      return (
        r(e),
        function (t) {
          if (t) {
            if (
              t.css === e.css &&
              t.media === e.media &&
              t.sourceMap === e.sourceMap
            )
              return;
            r((e = t));
          } else o();
        }
      );
    }
    e.exports = function (e, t) {
      ((t = t || {}).attributes =
        "object" == typeof t.attributes ? t.attributes : {}),
        t.singleton || "boolean" == typeof t.singleton || (t.singleton = i());
      var n = c(e, t);
      return (
        s(n, t),
        function (e) {
          for (var r = [], i = 0; i < n.length; i++) {
            var a = n[i],
              u = o[a.id];
            u && (u.refs--, r.push(u));
          }
          e && s(c(e, t), t);
          for (var l = 0; l < r.length; l++) {
            var f = r[l];
            if (0 === f.refs) {
              for (var d = 0; d < f.parts.length; d++) f.parts[d]();
              delete o[f.id];
            }
          }
        }
      );
    };
  },
  function (e, t, n) {
    "use strict";
    n.r(t);
    n(3);
    function r(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t &&
          (r = r.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          n.push.apply(n, r);
      }
      return n;
    }
    function o(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? r(Object(n), !0).forEach(function (t) {
              i(e, t, n[t]);
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : r(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t),
                );
              });
      }
      return e;
    }
    function i(e, t, n) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            })
          : (e[t] = n),
        e
      );
    }
    Litepicker.add("keyboardnav", {
      init: function (e) {
        Object.defineProperties(e, {
          isMouseDown: { value: !1, writable: !0 },
        });
        function t(t, r) {
          if (t.classList.contains("day-item")) {
            r.preventDefault();
            var o = n(e.ui, t, function (e, t) {
              return e === (t = "ArrowLeft" === r.code ? t - 1 : t + 1);
            });
            o
              ? o.focus()
              : (function (t) {
                  var n = e.ui.querySelector(
                    "".concat(
                      {
                        ArrowLeft: ".button-previous-month",
                        ArrowRight: ".button-next-month",
                      }[t.code],
                      '[tabindex="1"]',
                    ),
                  );
                  n && n.dispatchEvent(new Event("click"));
                  setTimeout(function () {
                    var n = null;
                    switch (t.code) {
                      case "ArrowLeft":
                        var r = e.ui.querySelectorAll('[tabindex="2"]');
                        n = r[r.length - 1];
                        break;
                      case "ArrowRight":
                        n = e.ui.querySelector('[tabindex="2"]');
                    }
                    n.focus();
                  });
                })(r);
          }
        }
        function n(e, t, n) {
          var r = Array.from(e.querySelectorAll('.day-item[tabindex="2"]')),
            o = r.indexOf(t);
          return r.filter(function (e, t) {
            return n(t, o) && 2 === e.tabIndex;
          })[0];
        }
        function r(t) {
          e.isMouseDown = !0;
        }
        function i(t) {
          e.isMouseDown
            ? (e.isMouseDown = !1)
            : this.options.inlineMode ||
              this.isShowning() ||
              (this.show(t.target),
              this.ui
                .querySelector(
                  '[tabindex="'.concat(
                    e.options.keyboardnav.firstTabIndex,
                    '"]',
                  ),
                )
                .focus());
        }
        function a(e) {
          var t = this;
          this.options.inlineMode ||
            setTimeout(function () {
              var e = document.activeElement;
              t.ui.contains(e) || (t.nextFocusElement = e);
            });
        }
        (e.options.keyboardnav = o(
          o({}, { firstTabIndex: 1 }),
          e.options.keyboardnav,
        )),
          e.ui.addEventListener(
            "keydown",
            function (r) {
              var o = this,
                i = r.target;
              switch (
                (setTimeout(function () {
                  o.onMouseEnter({ target: document.activeElement });
                }),
                r.code)
              ) {
                case "ArrowUp":
                case "ArrowDown":
                  !(function (t, r) {
                    if (t.classList.contains("day-item")) {
                      r.preventDefault();
                      var o = n(e.ui, t, function (e, t) {
                        return e === (t = "ArrowUp" === r.code ? t - 7 : t + 7);
                      });
                      o && o.focus();
                    }
                  })(i, r);
                  break;
                case "ArrowLeft":
                case "ArrowRight":
                  t(i, r);
                  break;
                case "Tab":
                  !(function (t, n) {
                    setTimeout(function () {
                      if (!document.activeElement.closest(".litepicker")) {
                        var n = e.ui.querySelector('[tabindex="1"]');
                        if (t === n) {
                          var r = e.ui.querySelectorAll('[tabindex="2"]');
                          n = r[r.length - 1];
                        }
                        n.focus();
                      }
                    });
                  })(i);
                  break;
                case "Enter":
                case "Space":
                  !(function (t, n) {
                    t.classList.contains("day-item") &&
                      (n.preventDefault(),
                      document.activeElement.dispatchEvent(new Event("click")),
                      setTimeout(function () {
                        var t = e.ui.querySelector(
                          '.is-start-date[tabindex="2"]',
                        );
                        t || (t = e.ui.querySelector('[tabindex="2"]')),
                          t.focus();
                      }));
                  })(i, r);
                  break;
                case "Escape":
                  e.hide();
              }
            }.bind(e),
            !0,
          );
        var c = e.options;
        c.element instanceof HTMLElement &&
          (c.element.addEventListener("mousedown", r.bind(e), !0),
          c.element.addEventListener("focus", i.bind(e), !0)),
          c.elementEnd instanceof HTMLElement &&
            (c.elementEnd.addEventListener("mousedown", r.bind(e), !0),
            c.elementEnd.addEventListener("focus", i.bind(e), !0)),
          c.element instanceof HTMLElement &&
            c.element.addEventListener("blur", a.bind(e), !0),
          c.elementEnd instanceof HTMLElement &&
            c.elementEnd.addEventListener("blur", a.bind(e), !0),
          e.on("render", function (e) {
            Array.from(
              e.querySelectorAll(
                [
                  ".month-item:first-child:not(.no-previous-month) .button-previous-month",
                  ".month-item:last-child:not(.no-next-month) .button-next-month",
                  ".reset-button",
                  "select",
                ].join(","),
              ),
            ).forEach(function (e) {
              return (e.tabIndex = 1);
            });
          }),
          e.on("render:day", function (e) {
            e.tabIndex = e.classList.contains("is-locked") ? -1 : 2;
          });
      },
    });
  },
  function (e, t, n) {
    var r = n(4);
    "string" == typeof r && (r = [[e.i, r, ""]]);
    var o = {
      insert: function (e) {
        var t = document.querySelector("head"),
          n = window._lastElementInsertedByStyleLoader;
        window.disableLitepickerStyles ||
          (n
            ? n.nextSibling
              ? t.insertBefore(e, n.nextSibling)
              : t.appendChild(e)
            : t.insertBefore(e, t.firstChild),
          (window._lastElementInsertedByStyleLoader = e));
      },
      singleton: !1,
    };
    n(1)(r, o);
    r.locals && (e.exports = r.locals);
  },
  function (e, t, n) {
    (t = n(0)(!1)).push([e.i, "", ""]), (e.exports = t);
  },
]);
/*!
 *
 * plugins/mobilefriendly.js
 * Litepicker v2.0.11 (https://github.com/wakirin/Litepicker)
 * Package: litepicker (https://www.npmjs.com/package/litepicker)
 * License: MIT (https://github.com/wakirin/Litepicker/blob/master/LICENCE.md)
 * Copyright 2019-2021 Rinat G.
 *
 * Hash: 277f45be8f40444f8bed
 *
 */ !(function (e) {
  var t = {};
  function n(r) {
    if (t[r]) return t[r].exports;
    var i = (t[r] = { i: r, l: !1, exports: {} });
    return e[r].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function (e, t, r) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
    }),
    (n.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if (
        (n.r(r),
        Object.defineProperty(r, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var i in e)
          n.d(
            r,
            i,
            function (t) {
              return e[t];
            }.bind(null, i),
          );
      return r;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return n.d(t, "a", t), t;
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ""),
    n((n.s = 5));
})([
  function (e, t, n) {
    "use strict";
    e.exports = function (e) {
      var t = [];
      return (
        (t.toString = function () {
          return this.map(function (t) {
            var n = (function (e, t) {
              var n = e[1] || "",
                r = e[3];
              if (!r) return n;
              if (t && "function" == typeof btoa) {
                var i =
                    ((a = r),
                    (l = btoa(unescape(encodeURIComponent(JSON.stringify(a))))),
                    (c =
                      "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(
                        l,
                      )),
                    "/*# ".concat(c, " */")),
                  o = r.sources.map(function (e) {
                    return "/*# sourceURL="
                      .concat(r.sourceRoot || "")
                      .concat(e, " */");
                  });
                return [n].concat(o).concat([i]).join("\n");
              }
              var a, l, c;
              return [n].join("\n");
            })(t, e);
            return t[2] ? "@media ".concat(t[2], " {").concat(n, "}") : n;
          }).join("");
        }),
        (t.i = function (e, n, r) {
          "string" == typeof e && (e = [[null, e, ""]]);
          var i = {};
          if (r)
            for (var o = 0; o < this.length; o++) {
              var a = this[o][0];
              null != a && (i[a] = !0);
            }
          for (var l = 0; l < e.length; l++) {
            var c = [].concat(e[l]);
            (r && i[c[0]]) ||
              (n &&
                (c[2]
                  ? (c[2] = "".concat(n, " and ").concat(c[2]))
                  : (c[2] = n)),
              t.push(c));
          }
        }),
        t
      );
    };
  },
  function (e, t, n) {
    "use strict";
    var r,
      i = {},
      o = function () {
        return (
          void 0 === r &&
            (r = Boolean(window && document && document.all && !window.atob)),
          r
        );
      },
      a = (function () {
        var e = {};
        return function (t) {
          if (void 0 === e[t]) {
            var n = document.querySelector(t);
            if (
              window.HTMLIFrameElement &&
              n instanceof window.HTMLIFrameElement
            )
              try {
                n = n.contentDocument.head;
              } catch (e) {
                n = null;
              }
            e[t] = n;
          }
          return e[t];
        };
      })();
    function l(e, t) {
      for (var n = [], r = {}, i = 0; i < e.length; i++) {
        var o = e[i],
          a = t.base ? o[0] + t.base : o[0],
          l = { css: o[1], media: o[2], sourceMap: o[3] };
        r[a] ? r[a].parts.push(l) : n.push((r[a] = { id: a, parts: [l] }));
      }
      return n;
    }
    function c(e, t) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n],
          o = i[r.id],
          a = 0;
        if (o) {
          for (o.refs++; a < o.parts.length; a++) o.parts[a](r.parts[a]);
          for (; a < r.parts.length; a++) o.parts.push(b(r.parts[a], t));
        } else {
          for (var l = []; a < r.parts.length; a++) l.push(b(r.parts[a], t));
          i[r.id] = { id: r.id, refs: 1, parts: l };
        }
      }
    }
    function s(e) {
      var t = document.createElement("style");
      if (void 0 === e.attributes.nonce) {
        var r = n.nc;
        r && (e.attributes.nonce = r);
      }
      if (
        (Object.keys(e.attributes).forEach(function (n) {
          t.setAttribute(n, e.attributes[n]);
        }),
        "function" == typeof e.insert)
      )
        e.insert(t);
      else {
        var i = a(e.insert || "head");
        if (!i)
          throw new Error(
            "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.",
          );
        i.appendChild(t);
      }
      return t;
    }
    var u,
      d =
        ((u = []),
        function (e, t) {
          return (u[e] = t), u.filter(Boolean).join("\n");
        });
    function p(e, t, n, r) {
      var i = n ? "" : r.css;
      if (e.styleSheet) e.styleSheet.cssText = d(t, i);
      else {
        var o = document.createTextNode(i),
          a = e.childNodes;
        a[t] && e.removeChild(a[t]),
          a.length ? e.insertBefore(o, a[t]) : e.appendChild(o);
      }
    }
    function f(e, t, n) {
      var r = n.css,
        i = n.media,
        o = n.sourceMap;
      if (
        (i && e.setAttribute("media", i),
        o &&
          btoa &&
          (r += "\n/*# sourceMappingURL=data:application/json;base64,".concat(
            btoa(unescape(encodeURIComponent(JSON.stringify(o)))),
            " */",
          )),
        e.styleSheet)
      )
        e.styleSheet.cssText = r;
      else {
        for (; e.firstChild; ) e.removeChild(e.firstChild);
        e.appendChild(document.createTextNode(r));
      }
    }
    var m = null,
      h = 0;
    function b(e, t) {
      var n, r, i;
      if (t.singleton) {
        var o = h++;
        (n = m || (m = s(t))),
          (r = p.bind(null, n, o, !1)),
          (i = p.bind(null, n, o, !0));
      } else
        (n = s(t)),
          (r = f.bind(null, n, t)),
          (i = function () {
            !(function (e) {
              if (null === e.parentNode) return !1;
              e.parentNode.removeChild(e);
            })(n);
          });
      return (
        r(e),
        function (t) {
          if (t) {
            if (
              t.css === e.css &&
              t.media === e.media &&
              t.sourceMap === e.sourceMap
            )
              return;
            r((e = t));
          } else i();
        }
      );
    }
    e.exports = function (e, t) {
      ((t = t || {}).attributes =
        "object" == typeof t.attributes ? t.attributes : {}),
        t.singleton || "boolean" == typeof t.singleton || (t.singleton = o());
      var n = l(e, t);
      return (
        c(n, t),
        function (e) {
          for (var r = [], o = 0; o < n.length; o++) {
            var a = n[o],
              s = i[a.id];
            s && (s.refs--, r.push(s));
          }
          e && c(l(e, t), t);
          for (var u = 0; u < r.length; u++) {
            var d = r[u];
            if (0 === d.refs) {
              for (var p = 0; p < d.parts.length; p++) d.parts[p]();
              delete i[d.id];
            }
          }
        }
      );
    };
  },
  ,
  ,
  ,
  function (e, t, n) {
    "use strict";
    n.r(t);
    n(6);
    function r(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t &&
          (r = r.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          n.push.apply(n, r);
      }
      return n;
    }
    function i(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? r(Object(n), !0).forEach(function (t) {
              o(e, t, n[t]);
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : r(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t),
                );
              });
      }
      return e;
    }
    function o(e, t, n) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            })
          : (e[t] = n),
        e
      );
    }
    Litepicker.add("mobilefriendly", {
      init: function (e) {
        var t = e.options;
        (e.options.mobilefriendly = i(
          i({}, { breakpoint: 480 }),
          t.mobilefriendly,
        )),
          Object.defineProperties(e, {
            xTouchDown: { value: null, writable: !0 },
            yTouchDown: { value: null, writable: !0 },
            touchTargetMonth: { value: null, writable: !0 },
          });
        var n = !1;
        try {
          var r = Object.defineProperty({}, "passive", {
            get: function () {
              n = !0;
            },
          });
          window.addEventListener("testPassive", null, r),
            window.removeEventListener("testPassive", null, r);
        } catch (e) {}
        function o() {
          var t = "portrait" === a();
          return window.matchMedia(
            "(max-device-"
              .concat(t ? "width" : "height", ": ")
              .concat(e.options.mobilefriendly.breakpoint, "px)"),
          ).matches;
        }
        function a() {
          return "orientation" in window.screen &&
            "type" in window.screen.orientation
            ? window.screen.orientation.type.replace(/\-\w+$/, "")
            : window.matchMedia("(orientation: portrait)").matches
              ? "portrait"
              : "landscape";
        }
        function l() {
          "portrait" === a()
            ? ((e.options.numberOfMonths = 1), (e.options.numberOfColumns = 1))
            : ((e.options.numberOfMonths = 2), (e.options.numberOfColumns = 2));
        }
        var c = function (t) {
            var n = t.touches[0];
            (e.xTouchDown = n.clientX), (e.yTouchDown = n.clientY);
          },
          s = function (t) {
            if (e.xTouchDown && e.yTouchDown) {
              var n = t.touches[0].clientX,
                r = t.touches[0].clientY,
                i = e.xTouchDown - n,
                o = e.yTouchDown - r,
                a = Math.abs(i) > Math.abs(o),
                l = e.options.numberOfMonths,
                c = null,
                s = !1,
                u = "",
                d = Array.from(e.ui.querySelectorAll(".month-item"));
              if (a) {
                var p = e.DateTime(
                    e.ui.querySelector(".day-item").dataset.time,
                  ),
                  f = Number("".concat(1 - Math.abs(i) / 100)),
                  m = 0;
                if (i > 0) {
                  (m = -Math.abs(i)), (c = p.clone().add(l, "month"));
                  var h = e.options.maxDate;
                  (s = !h || c.isSameOrBefore(e.DateTime(h), "month")),
                    (u = "next");
                } else {
                  (m = Math.abs(i)), (c = p.clone().subtract(l, "month"));
                  var b = e.options.minDate;
                  (s = !b || c.isSameOrAfter(e.DateTime(b), "month")),
                    (u = "prev");
                }
                s &&
                  d.map(function (e) {
                    (e.style.opacity = f),
                      (e.style.transform = "translateX(".concat(m, "px)"));
                  });
              }
              Math.abs(i) + Math.abs(o) > 100 &&
                a &&
                c &&
                s &&
                ((e.touchTargetMonth = u), e.gotoDate(c));
            }
          },
          u = function (t) {
            e.touchTargetMonth ||
              Array.from(e.ui.querySelectorAll(".month-item")).map(
                function (e) {
                  (e.style.transform = "translateX(0px)"),
                    (e.style.opacity = 1);
                },
              );
            (e.xTouchDown = null), (e.yTouchDown = null);
          };
        (e.backdrop = document.createElement("div")),
          (e.backdrop.className = "litepicker-backdrop"),
          e.backdrop.addEventListener("click", e.hide()),
          t.element &&
            t.element.parentNode &&
            t.element.parentNode.appendChild(e.backdrop),
          window.addEventListener("orientationchange", function (n) {
            window.addEventListener("resize", function n() {
              if (o() && e.isShowning()) {
                var r = a();
                switch (r) {
                  case "landscape":
                    (t.numberOfMonths = 2), (t.numberOfColumns = 2);
                    break;
                  default:
                    (t.numberOfMonths = 1), (t.numberOfColumns = 1);
                }
                e.ui.classList.toggle(
                  "mobilefriendly-portrait",
                  "portrait" === r,
                ),
                  e.ui.classList.toggle(
                    "mobilefriendly-landscape",
                    "landscape" === r,
                  ),
                  e.render();
              }
              window.removeEventListener("resize", n);
            });
          }),
          t.inlineMode &&
            o() &&
            (window.dispatchEvent(new Event("orientationchange")),
            window.dispatchEvent(new Event("resize"))),
          e.on("before:show", function (t) {
            if (((e.triggerElement = t), !e.options.inlineMode && o())) {
              e.emit("mobilefriendly.before:show", t),
                (e.ui.style.position = "fixed"),
                (e.ui.style.display = "block"),
                l(),
                e.scrollToDate(t),
                e.render();
              var n = a();
              e.ui.classList.add("mobilefriendly"),
                e.ui.classList.toggle(
                  "mobilefriendly-portrait",
                  "portrait" === n,
                ),
                e.ui.classList.toggle(
                  "mobilefriendly-landscape",
                  "landscape" === n,
                ),
                (e.ui.style.top = "50%"),
                (e.ui.style.left = "50%"),
                (e.ui.style.right = null),
                (e.ui.style.bottom = null),
                (e.ui.style.zIndex = e.options.zIndex),
                (e.backdrop.style.display = "block"),
                (e.backdrop.style.zIndex = e.options.zIndex - 1),
                document.body.classList.add("litepicker-open"),
                (t || e.options.element).blur(),
                e.emit("mobilefriendly.show", t);
            } else o() && (l(), e.render());
          }),
          e.on("render", function (t) {
            e.touchTargetMonth &&
              Array.from(e.ui.querySelectorAll(".month-item")).map(
                function (t) {
                  return t.classList.add(
                    "touch-target-".concat(e.touchTargetMonth),
                  );
                },
              );
            e.touchTargetMonth = null;
          }),
          e.on("hide", function () {
            document.body.classList.remove("litepicker-open"),
              (e.backdrop.style.display = "none"),
              e.ui.classList.remove(
                "mobilefriendly",
                "mobilefriendly-portrait",
                "mobilefriendly-landscape",
              );
          }),
          e.on("destroy", function () {
            e.backdrop &&
              e.backdrop.parentNode &&
              e.backdrop.parentNode.removeChild(e.backdrop);
          }),
          e.ui.addEventListener("touchstart", c, !!n && { passive: !0 }),
          e.ui.addEventListener("touchmove", s, !!n && { passive: !0 }),
          e.ui.addEventListener("touchend", u, !!n && { passive: !0 });
      },
    });
  },
  function (e, t, n) {
    var r = n(7);
    "string" == typeof r && (r = [[e.i, r, ""]]);
    var i = {
      insert: function (e) {
        var t = document.querySelector("head"),
          n = window._lastElementInsertedByStyleLoader;
        window.disableLitepickerStyles ||
          (n
            ? n.nextSibling
              ? t.insertBefore(e, n.nextSibling)
              : t.appendChild(e)
            : t.insertBefore(e, t.firstChild),
          (window._lastElementInsertedByStyleLoader = e));
      },
      singleton: !1,
    };
    n(1)(r, i);
    r.locals && (e.exports = r.locals);
  },
  function (e, t, n) {
    (t = n(0)(!1)).push([
      e.i,
      ':root {\n  --litepicker-mobilefriendly-backdrop-color-bg: #000;\n}\n\n.litepicker-backdrop {\n  display: none;\n  background-color: var(--litepicker-mobilefriendly-backdrop-color-bg);\n  opacity: 0.3;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n\n.litepicker-open {\n  overflow: hidden;\n}\n\n.litepicker.mobilefriendly[data-plugins*="mobilefriendly"] {\n  transform: translate(-50%, -50%);\n  font-size: 1.1rem;\n  --litepicker-container-months-box-shadow-color: #616161;\n}\n.litepicker.mobilefriendly-portrait {\n  --litepicker-day-width: 13.5vw;\n  --litepicker-month-width: calc(var(--litepicker-day-width) * 7);\n}\n.litepicker.mobilefriendly-landscape {\n  --litepicker-day-width: 5.5vw;\n  --litepicker-month-width: calc(var(--litepicker-day-width) * 7);\n}\n\n.litepicker[data-plugins*="mobilefriendly"] .container__months {\n  overflow: hidden;\n}\n\n.litepicker.mobilefriendly[data-plugins*="mobilefriendly"] .container__months .month-item-header {\n  height: var(--litepicker-day-width);\n}\n\n.litepicker.mobilefriendly[data-plugins*="mobilefriendly"] .container__days > div {\n  height: var(--litepicker-day-width);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n\n.litepicker[data-plugins*="mobilefriendly"] .container__months .month-item {\n  transform-origin: center;\n}\n\n.litepicker[data-plugins*="mobilefriendly"] .container__months .month-item.touch-target-next {\n  animation-name: lp-bounce-target-next;\n  animation-duration: .5s;\n  animation-timing-function: ease;\n}\n\n.litepicker[data-plugins*="mobilefriendly"] .container__months .month-item.touch-target-prev {\n  animation-name: lp-bounce-target-prev;\n  animation-duration: .5s;\n  animation-timing-function: ease;\n}\n\n@keyframes lp-bounce-target-next {\n  from {\n    transform: translateX(100px) scale(0.5);\n  }\n  to {\n    transform: translateX(0px) scale(1);\n  }\n}\n\n@keyframes lp-bounce-target-prev {\n  from {\n    transform: translateX(-100px) scale(0.5);\n  }\n  to {\n    transform: translateX(0px) scale(1);\n  }\n}',
      "",
    ]),
      (e.exports = t);
  },
]);
/*!
 *
 * plugins/ranges.js
 * Litepicker v2.0.11 (https://github.com/wakirin/Litepicker)
 * Package: litepicker (https://www.npmjs.com/package/litepicker)
 * License: MIT (https://github.com/wakirin/Litepicker/blob/master/LICENCE.md)
 * Copyright 2019-2021 Rinat G.
 *
 * Hash: 277f45be8f40444f8bed
 *
 */ !(function (e) {
  var n = {};
  function t(r) {
    if (n[r]) return n[r].exports;
    var a = (n[r] = { i: r, l: !1, exports: {} });
    return e[r].call(a.exports, a, a.exports, t), (a.l = !0), a.exports;
  }
  (t.m = e),
    (t.c = n),
    (t.d = function (e, n, r) {
      t.o(e, n) || Object.defineProperty(e, n, { enumerable: !0, get: r });
    }),
    (t.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (t.t = function (e, n) {
      if ((1 & n && (e = t(e)), 8 & n)) return e;
      if (4 & n && "object" == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if (
        (t.r(r),
        Object.defineProperty(r, "default", { enumerable: !0, value: e }),
        2 & n && "string" != typeof e)
      )
        for (var a in e)
          t.d(
            r,
            a,
            function (n) {
              return e[n];
            }.bind(null, a),
          );
      return r;
    }),
    (t.n = function (e) {
      var n =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return t.d(n, "a", n), n;
    }),
    (t.o = function (e, n) {
      return Object.prototype.hasOwnProperty.call(e, n);
    }),
    (t.p = ""),
    t((t.s = 8));
})([
  function (e, n, t) {
    "use strict";
    e.exports = function (e) {
      var n = [];
      return (
        (n.toString = function () {
          return this.map(function (n) {
            var t = (function (e, n) {
              var t = e[1] || "",
                r = e[3];
              if (!r) return t;
              if (n && "function" == typeof btoa) {
                var a =
                    ((i = r),
                    (s = btoa(unescape(encodeURIComponent(JSON.stringify(i))))),
                    (c =
                      "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(
                        s,
                      )),
                    "/*# ".concat(c, " */")),
                  o = r.sources.map(function (e) {
                    return "/*# sourceURL="
                      .concat(r.sourceRoot || "")
                      .concat(e, " */");
                  });
                return [t].concat(o).concat([a]).join("\n");
              }
              var i, s, c;
              return [t].join("\n");
            })(n, e);
            return n[2] ? "@media ".concat(n[2], " {").concat(t, "}") : t;
          }).join("");
        }),
        (n.i = function (e, t, r) {
          "string" == typeof e && (e = [[null, e, ""]]);
          var a = {};
          if (r)
            for (var o = 0; o < this.length; o++) {
              var i = this[o][0];
              null != i && (a[i] = !0);
            }
          for (var s = 0; s < e.length; s++) {
            var c = [].concat(e[s]);
            (r && a[c[0]]) ||
              (t &&
                (c[2]
                  ? (c[2] = "".concat(t, " and ").concat(c[2]))
                  : (c[2] = t)),
              n.push(c));
          }
        }),
        n
      );
    };
  },
  function (e, n, t) {
    "use strict";
    var r,
      a = {},
      o = function () {
        return (
          void 0 === r &&
            (r = Boolean(window && document && document.all && !window.atob)),
          r
        );
      },
      i = (function () {
        var e = {};
        return function (n) {
          if (void 0 === e[n]) {
            var t = document.querySelector(n);
            if (
              window.HTMLIFrameElement &&
              t instanceof window.HTMLIFrameElement
            )
              try {
                t = t.contentDocument.head;
              } catch (e) {
                t = null;
              }
            e[n] = t;
          }
          return e[n];
        };
      })();
    function s(e, n) {
      for (var t = [], r = {}, a = 0; a < e.length; a++) {
        var o = e[a],
          i = n.base ? o[0] + n.base : o[0],
          s = { css: o[1], media: o[2], sourceMap: o[3] };
        r[i] ? r[i].parts.push(s) : t.push((r[i] = { id: i, parts: [s] }));
      }
      return t;
    }
    function c(e, n) {
      for (var t = 0; t < e.length; t++) {
        var r = e[t],
          o = a[r.id],
          i = 0;
        if (o) {
          for (o.refs++; i < o.parts.length; i++) o.parts[i](r.parts[i]);
          for (; i < r.parts.length; i++) o.parts.push(m(r.parts[i], n));
        } else {
          for (var s = []; i < r.parts.length; i++) s.push(m(r.parts[i], n));
          a[r.id] = { id: r.id, refs: 1, parts: s };
        }
      }
    }
    function l(e) {
      var n = document.createElement("style");
      if (void 0 === e.attributes.nonce) {
        var r = t.nc;
        r && (e.attributes.nonce = r);
      }
      if (
        (Object.keys(e.attributes).forEach(function (t) {
          n.setAttribute(t, e.attributes[t]);
        }),
        "function" == typeof e.insert)
      )
        e.insert(n);
      else {
        var a = i(e.insert || "head");
        if (!a)
          throw new Error(
            "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.",
          );
        a.appendChild(n);
      }
      return n;
    }
    var u,
      p =
        ((u = []),
        function (e, n) {
          return (u[e] = n), u.filter(Boolean).join("\n");
        });
    function d(e, n, t, r) {
      var a = t ? "" : r.css;
      if (e.styleSheet) e.styleSheet.cssText = p(n, a);
      else {
        var o = document.createTextNode(a),
          i = e.childNodes;
        i[n] && e.removeChild(i[n]),
          i.length ? e.insertBefore(o, i[n]) : e.appendChild(o);
      }
    }
    function f(e, n, t) {
      var r = t.css,
        a = t.media,
        o = t.sourceMap;
      if (
        (a && e.setAttribute("media", a),
        o &&
          btoa &&
          (r += "\n/*# sourceMappingURL=data:application/json;base64,".concat(
            btoa(unescape(encodeURIComponent(JSON.stringify(o)))),
            " */",
          )),
        e.styleSheet)
      )
        e.styleSheet.cssText = r;
      else {
        for (; e.firstChild; ) e.removeChild(e.firstChild);
        e.appendChild(document.createTextNode(r));
      }
    }
    var g = null,
      b = 0;
    function m(e, n) {
      var t, r, a;
      if (n.singleton) {
        var o = b++;
        (t = g || (g = l(n))),
          (r = d.bind(null, t, o, !1)),
          (a = d.bind(null, t, o, !0));
      } else
        (t = l(n)),
          (r = f.bind(null, t, n)),
          (a = function () {
            !(function (e) {
              if (null === e.parentNode) return !1;
              e.parentNode.removeChild(e);
            })(t);
          });
      return (
        r(e),
        function (n) {
          if (n) {
            if (
              n.css === e.css &&
              n.media === e.media &&
              n.sourceMap === e.sourceMap
            )
              return;
            r((e = n));
          } else a();
        }
      );
    }
    e.exports = function (e, n) {
      ((n = n || {}).attributes =
        "object" == typeof n.attributes ? n.attributes : {}),
        n.singleton || "boolean" == typeof n.singleton || (n.singleton = o());
      var t = s(e, n);
      return (
        c(t, n),
        function (e) {
          for (var r = [], o = 0; o < t.length; o++) {
            var i = t[o],
              l = a[i.id];
            l && (l.refs--, r.push(l));
          }
          e && c(s(e, n), n);
          for (var u = 0; u < r.length; u++) {
            var p = r[u];
            if (0 === p.refs) {
              for (var d = 0; d < p.parts.length; d++) p.parts[d]();
              delete a[p.id];
            }
          }
        }
      );
    };
  },
  ,
  ,
  ,
  ,
  ,
  ,
  function (e, n, t) {
    "use strict";
    t.r(n);
    t(9);
    function r(e, n) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        n &&
          (r = r.filter(function (n) {
            return Object.getOwnPropertyDescriptor(e, n).enumerable;
          })),
          t.push.apply(t, r);
      }
      return t;
    }
    function a(e) {
      for (var n = 1; n < arguments.length; n++) {
        var t = null != arguments[n] ? arguments[n] : {};
        n % 2
          ? r(Object(t), !0).forEach(function (n) {
              o(e, n, t[n]);
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t))
            : r(Object(t)).forEach(function (n) {
                Object.defineProperty(
                  e,
                  n,
                  Object.getOwnPropertyDescriptor(t, n),
                );
              });
      }
      return e;
    }
    function o(e, n, t) {
      return (
        n in e
          ? Object.defineProperty(e, n, {
              value: t,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            })
          : (e[n] = t),
        e
      );
    }
    Litepicker.add("ranges", {
      init: function (e) {
        var n = {
          position: "left",
          customRanges: {},
          force: !1,
          autoApply: e.options.autoApply,
        };
        if (
          ((e.options.ranges = a(a({}, n), e.options.ranges)),
          (e.options.singleMode = !1),
          !Object.keys(e.options.ranges.customRanges).length)
        ) {
          var t = e.DateTime();
          e.options.ranges.customRanges = {
            Today: [t.clone(), t.clone()],
            Yesterday: [
              t.clone().subtract(1, "day"),
              t.clone().subtract(1, "day"),
            ],
            "Last 7 Days": [t.clone().subtract(6, "day"), t],
            "Last 30 Days": [t.clone().subtract(29, "day"), t],
            "This Month": (function (e) {
              var n = e.clone();
              return (
                n.setDate(1),
                [n, new Date(e.getFullYear(), e.getMonth() + 1, 0)]
              );
            })(t),
            "Last Month": (function (e) {
              var n = e.clone();
              return (
                n.setDate(1),
                n.setMonth(e.getMonth() - 1),
                [n, new Date(e.getFullYear(), e.getMonth(), 0)]
              );
            })(t),
          };
        }
        var r = e.options.ranges;
        e.on("render", function (n) {
          var t = document.createElement("div");
          (t.className = "container__predefined-ranges"),
            (e.ui.dataset.rangesPosition = r.position),
            Object.keys(r.customRanges).forEach(function (a) {
              var o = r.customRanges[a],
                i = document.createElement("button");
              (i.innerText = a),
                (i.tabIndex =
                  n.dataset.plugins.indexOf("keyboardnav") >= 0 ? 1 : -1),
                (i.dataset.start = o[0].getTime()),
                (i.dataset.end = o[1].getTime()),
                i.addEventListener("click", function (n) {
                  var t = n.target;
                  if (t) {
                    var a = e.DateTime(Number(t.dataset.start)),
                      o = e.DateTime(Number(t.dataset.end));
                    r.autoApply
                      ? (e.setDateRange(a, o, r.force),
                        e.emit("ranges.selected", a, o),
                        e.hide())
                      : ((e.datePicked = [a, o]),
                        e.emit("ranges.preselect", a, o)),
                      (!e.options.inlineMode && r.autoApply) || e.gotoDate(a);
                  }
                }),
                t.appendChild(i);
            }),
            n.querySelector(".container__main").prepend(t);
        });
      },
    });
  },
  function (e, n, t) {
    var r = t(10);
    "string" == typeof r && (r = [[e.i, r, ""]]);
    var a = {
      insert: function (e) {
        var n = document.querySelector("head"),
          t = window._lastElementInsertedByStyleLoader;
        window.disableLitepickerStyles ||
          (t
            ? t.nextSibling
              ? n.insertBefore(e, t.nextSibling)
              : n.appendChild(e)
            : n.insertBefore(e, n.firstChild),
          (window._lastElementInsertedByStyleLoader = e));
      },
      singleton: !1,
    };
    t(1)(r, a);
    r.locals && (e.exports = r.locals);
  },
  function (e, n, t) {
    (n = t(0)(!1)).push([
      e.i,
      '.litepicker[data-plugins*="ranges"] > .container__main > .container__predefined-ranges {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  background: var(--litepicker-container-months-color-bg);\n  box-shadow: -2px 0px 5px var(--litepicker-footer-box-shadow-color);\n  border-radius: 3px;\n}\n.litepicker[data-plugins*="ranges"][data-ranges-position="left"] > .container__main {\n  /* */\n}\n.litepicker[data-plugins*="ranges"][data-ranges-position="right"] > .container__main{\n  flex-direction: row-reverse;\n}\n.litepicker[data-plugins*="ranges"][data-ranges-position="right"] > .container__main > .container__predefined-ranges {\n  box-shadow: 2px 0px 2px var(--litepicker-footer-box-shadow-color);\n}\n.litepicker[data-plugins*="ranges"][data-ranges-position="top"] > .container__main {\n  flex-direction: column;\n}\n.litepicker[data-plugins*="ranges"][data-ranges-position="top"] > .container__main > .container__predefined-ranges {\n  flex-direction: row;\n  box-shadow: 2px 0px 2px var(--litepicker-footer-box-shadow-color);\n}\n.litepicker[data-plugins*="ranges"][data-ranges-position="bottom"] > .container__main {\n  flex-direction: column-reverse;\n}\n.litepicker[data-plugins*="ranges"][data-ranges-position="bottom"] > .container__main > .container__predefined-ranges {\n  flex-direction: row;\n  box-shadow: 2px 0px 2px var(--litepicker-footer-box-shadow-color);\n}\n.litepicker[data-plugins*="ranges"] > .container__main > .container__predefined-ranges button {\n  padding: 5px;\n  margin: 2px 0;\n}\n.litepicker[data-plugins*="ranges"][data-ranges-position="left"] > .container__main > .container__predefined-ranges button,\n.litepicker[data-plugins*="ranges"][data-ranges-position="right"] > .container__main > .container__predefined-ranges button{\n  width: 100%;\n  text-align: left;\n}\n.litepicker[data-plugins*="ranges"] > .container__main > .container__predefined-ranges button:hover {\n  cursor: default;\n  opacity: .6;\n}',
      "",
    ]),
      (e.exports = n);
  },
]);
/*!
 *
 * plugins/multiselect.js
 * Litepicker v2.0.11 (https://github.com/wakirin/Litepicker)
 * Package: litepicker (https://www.npmjs.com/package/litepicker)
 * License: MIT (https://github.com/wakirin/Litepicker/blob/master/LICENCE.md)
 * Copyright 2019-2021 Rinat G.
 *
 * Hash: 277f45be8f40444f8bed
 *
 */ !(function (e) {
  var t = {};
  function n(r) {
    if (t[r]) return t[r].exports;
    var i = (t[r] = { i: r, l: !1, exports: {} });
    return e[r].call(i.exports, i, i.exports, n), (i.l = !0), i.exports;
  }
  (n.m = e),
    (n.c = t),
    (n.d = function (e, t, r) {
      n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r });
    }),
    (n.r = function (e) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(e, "__esModule", { value: !0 });
    }),
    (n.t = function (e, t) {
      if ((1 & t && (e = n(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var r = Object.create(null);
      if (
        (n.r(r),
        Object.defineProperty(r, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var i in e)
          n.d(
            r,
            i,
            function (t) {
              return e[t];
            }.bind(null, i),
          );
      return r;
    }),
    (n.n = function (e) {
      var t =
        e && e.__esModule
          ? function () {
              return e.default;
            }
          : function () {
              return e;
            };
      return n.d(t, "a", t), t;
    }),
    (n.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }),
    (n.p = ""),
    n((n.s = 11));
})([
  function (e, t, n) {
    "use strict";
    e.exports = function (e) {
      var t = [];
      return (
        (t.toString = function () {
          return this.map(function (t) {
            var n = (function (e, t) {
              var n = e[1] || "",
                r = e[3];
              if (!r) return n;
              if (t && "function" == typeof btoa) {
                var i =
                    ((l = r),
                    (a = btoa(unescape(encodeURIComponent(JSON.stringify(l))))),
                    (c =
                      "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(
                        a,
                      )),
                    "/*# ".concat(c, " */")),
                  o = r.sources.map(function (e) {
                    return "/*# sourceURL="
                      .concat(r.sourceRoot || "")
                      .concat(e, " */");
                  });
                return [n].concat(o).concat([i]).join("\n");
              }
              var l, a, c;
              return [n].join("\n");
            })(t, e);
            return t[2] ? "@media ".concat(t[2], " {").concat(n, "}") : n;
          }).join("");
        }),
        (t.i = function (e, n, r) {
          "string" == typeof e && (e = [[null, e, ""]]);
          var i = {};
          if (r)
            for (var o = 0; o < this.length; o++) {
              var l = this[o][0];
              null != l && (i[l] = !0);
            }
          for (var a = 0; a < e.length; a++) {
            var c = [].concat(e[a]);
            (r && i[c[0]]) ||
              (n &&
                (c[2]
                  ? (c[2] = "".concat(n, " and ").concat(c[2]))
                  : (c[2] = n)),
              t.push(c));
          }
        }),
        t
      );
    };
  },
  function (e, t, n) {
    "use strict";
    var r,
      i = {},
      o = function () {
        return (
          void 0 === r &&
            (r = Boolean(window && document && document.all && !window.atob)),
          r
        );
      },
      l = (function () {
        var e = {};
        return function (t) {
          if (void 0 === e[t]) {
            var n = document.querySelector(t);
            if (
              window.HTMLIFrameElement &&
              n instanceof window.HTMLIFrameElement
            )
              try {
                n = n.contentDocument.head;
              } catch (e) {
                n = null;
              }
            e[t] = n;
          }
          return e[t];
        };
      })();
    function a(e, t) {
      for (var n = [], r = {}, i = 0; i < e.length; i++) {
        var o = e[i],
          l = t.base ? o[0] + t.base : o[0],
          a = { css: o[1], media: o[2], sourceMap: o[3] };
        r[l] ? r[l].parts.push(a) : n.push((r[l] = { id: l, parts: [a] }));
      }
      return n;
    }
    function c(e, t) {
      for (var n = 0; n < e.length; n++) {
        var r = e[n],
          o = i[r.id],
          l = 0;
        if (o) {
          for (o.refs++; l < o.parts.length; l++) o.parts[l](r.parts[l]);
          for (; l < r.parts.length; l++) o.parts.push(v(r.parts[l], t));
        } else {
          for (var a = []; l < r.parts.length; l++) a.push(v(r.parts[l], t));
          i[r.id] = { id: r.id, refs: 1, parts: a };
        }
      }
    }
    function s(e) {
      var t = document.createElement("style");
      if (void 0 === e.attributes.nonce) {
        var r = n.nc;
        r && (e.attributes.nonce = r);
      }
      if (
        (Object.keys(e.attributes).forEach(function (n) {
          t.setAttribute(n, e.attributes[n]);
        }),
        "function" == typeof e.insert)
      )
        e.insert(t);
      else {
        var i = l(e.insert || "head");
        if (!i)
          throw new Error(
            "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.",
          );
        i.appendChild(t);
      }
      return t;
    }
    var u,
      p =
        ((u = []),
        function (e, t) {
          return (u[e] = t), u.filter(Boolean).join("\n");
        });
    function f(e, t, n, r) {
      var i = n ? "" : r.css;
      if (e.styleSheet) e.styleSheet.cssText = p(t, i);
      else {
        var o = document.createTextNode(i),
          l = e.childNodes;
        l[t] && e.removeChild(l[t]),
          l.length ? e.insertBefore(o, l[t]) : e.appendChild(o);
      }
    }
    function d(e, t, n) {
      var r = n.css,
        i = n.media,
        o = n.sourceMap;
      if (
        (i && e.setAttribute("media", i),
        o &&
          btoa &&
          (r += "\n/*# sourceMappingURL=data:application/json;base64,".concat(
            btoa(unescape(encodeURIComponent(JSON.stringify(o)))),
            " */",
          )),
        e.styleSheet)
      )
        e.styleSheet.cssText = r;
      else {
        for (; e.firstChild; ) e.removeChild(e.firstChild);
        e.appendChild(document.createTextNode(r));
      }
    }
    var m = null,
      b = 0;
    function v(e, t) {
      var n, r, i;
      if (t.singleton) {
        var o = b++;
        (n = m || (m = s(t))),
          (r = f.bind(null, n, o, !1)),
          (i = f.bind(null, n, o, !0));
      } else
        (n = s(t)),
          (r = d.bind(null, n, t)),
          (i = function () {
            !(function (e) {
              if (null === e.parentNode) return !1;
              e.parentNode.removeChild(e);
            })(n);
          });
      return (
        r(e),
        function (t) {
          if (t) {
            if (
              t.css === e.css &&
              t.media === e.media &&
              t.sourceMap === e.sourceMap
            )
              return;
            r((e = t));
          } else i();
        }
      );
    }
    e.exports = function (e, t) {
      ((t = t || {}).attributes =
        "object" == typeof t.attributes ? t.attributes : {}),
        t.singleton || "boolean" == typeof t.singleton || (t.singleton = o());
      var n = a(e, t);
      return (
        c(n, t),
        function (e) {
          for (var r = [], o = 0; o < n.length; o++) {
            var l = n[o],
              s = i[l.id];
            s && (s.refs--, r.push(s));
          }
          e && c(a(e, t), t);
          for (var u = 0; u < r.length; u++) {
            var p = r[u];
            if (0 === p.refs) {
              for (var f = 0; f < p.parts.length; f++) p.parts[f]();
              delete i[p.id];
            }
          }
        }
      );
    };
  },
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  ,
  function (e, t, n) {
    "use strict";
    n.r(t);
    n(12);
    function r(e) {
      return (
        (function (e) {
          if (Array.isArray(e)) return i(e);
        })(e) ||
        (function (e) {
          if ("undefined" != typeof Symbol && Symbol.iterator in Object(e))
            return Array.from(e);
        })(e) ||
        (function (e, t) {
          if (!e) return;
          if ("string" == typeof e) return i(e, t);
          var n = Object.prototype.toString.call(e).slice(8, -1);
          "Object" === n && e.constructor && (n = e.constructor.name);
          if ("Map" === n || "Set" === n) return Array.from(e);
          if (
            "Arguments" === n ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
          )
            return i(e, t);
        })(e) ||
        (function () {
          throw new TypeError(
            "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
          );
        })()
      );
    }
    function i(e, t) {
      (null == t || t > e.length) && (t = e.length);
      for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
      return r;
    }
    function o(e, t) {
      var n = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t &&
          (r = r.filter(function (t) {
            return Object.getOwnPropertyDescriptor(e, t).enumerable;
          })),
          n.push.apply(n, r);
      }
      return n;
    }
    function l(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = null != arguments[t] ? arguments[t] : {};
        t % 2
          ? o(Object(n), !0).forEach(function (t) {
              a(e, t, n[t]);
            })
          : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
            : o(Object(n)).forEach(function (t) {
                Object.defineProperty(
                  e,
                  t,
                  Object.getOwnPropertyDescriptor(n, t),
                );
              });
      }
      return e;
    }
    function a(e, t, n) {
      return (
        t in e
          ? Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            })
          : (e[t] = n),
        e
      );
    }
    Litepicker.add("multiselect", {
      init: function (e) {
        Object.defineProperties(e, {
          multipleDates: { value: [], enumerable: !0, writable: !0 },
          preMultipleDates: { value: [], writable: !0 },
        });
        (e.options.multiselect = l(
          l({}, { max: null }),
          e.options.multiselect,
        )),
          (e.options.autoApply = e.options.inlineMode),
          (e.options.showTooltip = !1);
        var t = function () {
          var t = e.preMultipleDates.length,
            n = e.ui.querySelector(".preview-date-range");
          if (n && t > 0) {
            var r = e.pluralSelector(t),
              i = e.options.tooltipText[r]
                ? e.options.tooltipText[r]
                : "[".concat(r, "]"),
              o = "".concat(t, " ").concat(i);
            n.innerText = o;
          }
        };
        e.on("before:show", function () {
          e.preMultipleDates = r(e.multipleDates);
        }),
          e.on("show", function () {
            t();
          }),
          e.on("before:click", function (n) {
            if (n.classList.contains("day-item")) {
              if (((e.preventClick = !0), n.classList.contains("is-locked")))
                return void n.blur();
              var r = Number(n.dataset.time);
              n.classList.contains("is-selected")
                ? ((e.preMultipleDates = e.preMultipleDates.filter(
                    function (e) {
                      return e !== r;
                    },
                  )),
                  e.emit("multiselect.deselect", e.DateTime(r)))
                : ((e.preMultipleDates[e.preMultipleDates.length] = r),
                  e.emit("multiselect.select", e.DateTime(r))),
                e.options.autoApply && e.emit("button:apply"),
                e.render(),
                t();
            }
          }),
          e.on("render:day", function (t) {
            var n = e.preMultipleDates.filter(function (e) {
                return e === Number(t.dataset.time);
              }).length,
              r = Number(e.options.multiselect.max);
            n
              ? t.classList.add("is-selected")
              : r &&
                e.preMultipleDates.length >= r &&
                t.classList.add("is-locked");
          }),
          e.on("button:cancel", function () {
            e.preMultipleDates.length = 0;
          }),
          e.on("button:apply", function () {
            e.multipleDates = r(e.preMultipleDates).sort(function (e, t) {
              return e - t;
            });
          }),
          e.on("clear:selection", function () {
            e.clearMultipleDates(), e.render();
          }),
          (e.clearMultipleDates = function () {
            (e.preMultipleDates.length = 0), (e.multipleDates.length = 0);
          }),
          (e.getMultipleDates = function () {
            return e.multipleDates.map(function (t) {
              return e.DateTime(t);
            });
          }),
          (e.multipleDatesToString = function () {
            var t =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : "YYYY-MM-DD",
              n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : ",";
            return e.multipleDates
              .map(function (n) {
                return e.DateTime(n).format(t);
              })
              .join(n);
          });
      },
    });
  },
  function (e, t, n) {
    var r = n(13);
    "string" == typeof r && (r = [[e.i, r, ""]]);
    var i = {
      insert: function (e) {
        var t = document.querySelector("head"),
          n = window._lastElementInsertedByStyleLoader;
        window.disableLitepickerStyles ||
          (n
            ? n.nextSibling
              ? t.insertBefore(e, n.nextSibling)
              : t.appendChild(e)
            : t.insertBefore(e, t.firstChild),
          (window._lastElementInsertedByStyleLoader = e));
      },
      singleton: !1,
    };
    n(1)(r, i);
    r.locals && (e.exports = r.locals);
  },
  function (e, t, n) {
    (t = n(0)(!1)).push([
      e.i,
      ':root {\n  --litepicker-multiselect-is-selected-color-bg: #2196f3;\n  --litepicker-multiselect-is-selected-color: #fff;\n  --litepicker-multiselect-hover-color-bg: #2196f3;\n  --litepicker-multiselect-hover-color: #fff;\n}\n\n.litepicker[data-plugins*="multiselect"] .container__days .day-item {\n  position: relative;\n  z-index: 1;\n}\n\n.litepicker[data-plugins*="multiselect"] .container__days .day-item:not(.is-locked):after {\n  content: \'\';\n  position: absolute;\n  width: 27px;\n  height: 27px;\n  top: 50%;\n  left: 50%;\n  z-index: -1;\n  border-radius: 50%;\n  transform: translate(-50%, -50%);\n}\n\n.litepicker[data-plugins*="multiselect"] .container__days .day-item:not(.is-locked):hover {\n  box-shadow: none;\n  color: var(--litepicker-day-color);\n  font-weight: bold;\n}\n\n\n.litepicker[data-plugins*="multiselect"] .container__days .day-item.is-selected,\n.litepicker[data-plugins*="multiselect"] .container__days .day-item.is-selected:hover {\n  color: var(--litepicker-multiselect-is-selected-color);\n}\n\n.litepicker[data-plugins*="multiselect"] .container__days .day-item.is-selected:after {\n  color: var(--litepicker-multiselect-is-selected-color);\n  background-color: var(--litepicker-multiselect-is-selected-color-bg);\n}\n',
      "",
    ]),
      (e.exports = t);
  },
]);

;}
      } catch(e) { console.error(`  Error executing script ${scriptPath_2ku1geal211}`, e); }
    

      const scriptPath_qyntxdmtbpj = "clipboard-polyfill.js"; // Use JSON.stringify for safety
      console.log(`  Executing JS (end): ${scriptPath_qyntxdmtbpj}`);
      try {
          with(__globals){;!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? e(exports)
    : "function" == typeof define && define.amd
      ? define(["exports"], e)
      : e(((t = t || self).clipboard = {}));
})(this, function (t) {
  "use strict";
  function e(t, e, n, r) {
    return new (n || (n = Promise))(function (o, i) {
      function a(t) {
        try {
          c(r.next(t));
        } catch (t) {
          i(t);
        }
      }
      function u(t) {
        try {
          c(r.throw(t));
        } catch (t) {
          i(t);
        }
      }
      function c(t) {
        t.done
          ? o(t.value)
          : new n(function (e) {
              e(t.value);
            }).then(a, u);
      }
      c((r = r.apply(t, e || [])).next());
    });
  }
  function n(t, e) {
    var n,
      r,
      o,
      i,
      a = {
        label: 0,
        sent: function () {
          if (1 & o[0]) throw o[1];
          return o[1];
        },
        trys: [],
        ops: [],
      };
    return (
      (i = { next: u(0), throw: u(1), return: u(2) }),
      "function" == typeof Symbol &&
        (i[Symbol.iterator] = function () {
          return this;
        }),
      i
    );
    function u(i) {
      return function (u) {
        return (function (i) {
          if (n) throw new TypeError("Generator is already executing.");
          for (; a; )
            try {
              if (
                ((n = 1),
                r &&
                  (o =
                    2 & i[0]
                      ? r.return
                      : i[0]
                        ? r.throw || ((o = r.return) && o.call(r), 0)
                        : r.next) &&
                  !(o = o.call(r, i[1])).done)
              )
                return o;
              switch (((r = 0), o && (i = [2 & i[0], o.value]), i[0])) {
                case 0:
                case 1:
                  o = i;
                  break;
                case 4:
                  return a.label++, { value: i[1], done: !1 };
                case 5:
                  a.label++, (r = i[1]), (i = [0]);
                  continue;
                case 7:
                  (i = a.ops.pop()), a.trys.pop();
                  continue;
                default:
                  if (
                    !(o = (o = a.trys).length > 0 && o[o.length - 1]) &&
                    (6 === i[0] || 2 === i[0])
                  ) {
                    a = 0;
                    continue;
                  }
                  if (3 === i[0] && (!o || (i[1] > o[0] && i[1] < o[3]))) {
                    a.label = i[1];
                    break;
                  }
                  if (6 === i[0] && a.label < o[1]) {
                    (a.label = o[1]), (o = i);
                    break;
                  }
                  if (o && a.label < o[2]) {
                    (a.label = o[2]), a.ops.push(i);
                    break;
                  }
                  o[2] && a.ops.pop(), a.trys.pop();
                  continue;
              }
              i = e.call(t, a);
            } catch (t) {
              (i = [6, t]), (r = 0);
            } finally {
              n = o = 0;
            }
          if (5 & i[0]) throw i[1];
          return { value: i[0] ? i[1] : void 0, done: !0 };
        })([i, u]);
      };
    }
  }
  var r = ["text/plain", "text/html"];
  var o = function () {
      (console.warn || console.log).call(arguments);
    }.bind(console, "[clipboard-polyfill]"),
    i = !0;
  var a = (function () {
      function t() {
        this.m = {};
      }
      return (
        (t.prototype.setData = function (t, e) {
          i &&
            -1 === r.indexOf(t) &&
            o(
              "Unknown data type: " + t,
              "Call clipboard.suppressWarnings() to suppress this warning.",
            ),
            (this.m[t] = e);
        }),
        (t.prototype.getData = function (t) {
          return this.m[t];
        }),
        (t.prototype.forEach = function (t) {
          for (var e in this.m) t(this.m[e], e);
        }),
        t
      );
    })(),
    u = function (t) {},
    c = !0;
  var s = function () {
      (console.warn || console.log).apply(console, arguments);
    }.bind("[clipboard-polyfill]"),
    d = "text/plain";
  function l(t) {
    u = t;
  }
  function f() {
    (c = !1), (i = !1);
  }
  function p(t) {
    return e(this, void 0, void 0, function () {
      var e;
      return n(this, function (n) {
        if (
          (c &&
            !t.getData(d) &&
            s(
              "clipboard.write() was called without a `text/plain` data type. On some platforms, this may result in an empty clipboard. Call clipboard.suppressWarnings() to suppress this warning.",
            ),
          k())
        ) {
          if (
            (function (t) {
              var e = t.getData(d);
              if (void 0 !== e) return window.clipboardData.setData("Text", e);
              throw new Error("No `text/plain` value was specified.");
            })(t)
          )
            return [2];
          throw new Error(
            "Copying failed, possibly because the user rejected it.",
          );
        }
        if (x(t)) return u("regular execCopy worked"), [2];
        if (navigator.userAgent.indexOf("Edge") > -1)
          return u('UA "Edge" => assuming success'), [2];
        if (D(document.body, t)) return u("copyUsingTempSelection worked"), [2];
        if (
          (function (t) {
            var e = document.createElement("div");
            e.setAttribute("style", "-webkit-user-select: text !important"),
              (e.textContent = "temporary element"),
              document.body.appendChild(e);
            var n = D(e, t);
            return document.body.removeChild(e), n;
          })(t)
        )
          return u("copyUsingTempElem worked"), [2];
        if (
          void 0 !== (e = t.getData(d)) &&
          (function (t) {
            u("copyTextUsingDOM");
            var e = document.createElement("div");
            e.setAttribute("style", "-webkit-user-select: text !important");
            var n = e;
            e.attachShadow &&
              (u("Using shadow DOM."), (n = e.attachShadow({ mode: "open" })));
            var r = document.createElement("span");
            (r.innerText = t),
              n.appendChild(r),
              document.body.appendChild(e),
              T(r);
            var o = document.execCommand("copy");
            return E(), document.body.removeChild(e), o;
          })(e)
        )
          return u("copyTextUsingDOM worked"), [2];
        throw new Error("Copy command failed.");
      });
    });
  }
  function v(t) {
    return e(this, void 0, void 0, function () {
      return n(this, function (e) {
        return navigator.clipboard && navigator.clipboard.writeText
          ? (u("Using `navigator.clipboard.writeText()`."),
            [2, navigator.clipboard.writeText(t)])
          : [2, p(C(t))];
      });
    });
  }
  function h() {
    return e(this, void 0, void 0, function () {
      var t;
      return n(this, function (e) {
        switch (e.label) {
          case 0:
            return (t = C), [4, b()];
          case 1:
            return [2, t.apply(void 0, [e.sent()])];
        }
      });
    });
  }
  function b() {
    return e(this, void 0, void 0, function () {
      return n(this, function (t) {
        if (navigator.clipboard && navigator.clipboard.readText)
          return (
            u("Using `navigator.clipboard.readText()`."),
            [2, navigator.clipboard.readText()]
          );
        if (k()) return u("Reading text using IE strategy."), [2, U()];
        throw new Error("Read is not supported in your browser.");
      });
    });
  }
  var m = !1;
  function w() {
    m ||
      (c &&
        s(
          'The deprecated default object of `clipboard-polyfill` was called. Please switch to `import * as clipboard from "clipboard-polyfill"` and see https://github.com/lgarron/clipboard-polyfill/issues/101 for more info.',
        ),
      (m = !0));
  }
  var y = {
      DT: a,
      setDebugLog: function (t) {
        return w(), l(t);
      },
      suppressWarnings: function () {
        return w(), f();
      },
      write: function (t) {
        return e(this, void 0, void 0, function () {
          return n(this, function (e) {
            return w(), [2, p(t)];
          });
        });
      },
      writeText: function (t) {
        return e(this, void 0, void 0, function () {
          return n(this, function (e) {
            return w(), [2, v(t)];
          });
        });
      },
      read: function () {
        return e(this, void 0, void 0, function () {
          return n(this, function (t) {
            return w(), [2, h()];
          });
        });
      },
      readText: function () {
        return e(this, void 0, void 0, function () {
          return n(this, function (t) {
            return w(), [2, b()];
          });
        });
      },
    },
    g = function () {
      this.success = !1;
    };
  function x(t) {
    var e = new g(),
      n = function (t, e, n) {
        u("listener called"),
          (t.success = !0),
          e.forEach(function (e, r) {
            var o = n.clipboardData;
            o.setData(r, e),
              r === d &&
                o.getData(r) !== e &&
                (u("setting text/plain failed"), (t.success = !1));
          }),
          n.preventDefault();
      }.bind(this, e, t);
    document.addEventListener("copy", n);
    try {
      document.execCommand("copy");
    } finally {
      document.removeEventListener("copy", n);
    }
    return e.success;
  }
  function D(t, e) {
    T(t);
    var n = x(e);
    return E(), n;
  }
  function T(t) {
    var e = document.getSelection();
    if (e) {
      var n = document.createRange();
      n.selectNodeContents(t), e.removeAllRanges(), e.addRange(n);
    }
  }
  function E() {
    var t = document.getSelection();
    t && t.removeAllRanges();
  }
  function C(t) {
    var e = new a();
    return e.setData(d, t), e;
  }
  function k() {
    return (
      "undefined" == typeof ClipboardEvent &&
      void 0 !== window.clipboardData &&
      void 0 !== window.clipboardData.setData
    );
  }
  function U() {
    return e(this, void 0, void 0, function () {
      var t;
      return n(this, function (e) {
        if ("" === (t = window.clipboardData.getData("Text")))
          throw new Error(
            "Empty clipboard or could not read plain text from clipboard",
          );
        return [2, t];
      });
    });
  }
  (t.DT = a),
    (t.default = y),
    (t.read = h),
    (t.readText = b),
    (t.setDebugLog = l),
    (t.suppressWarnings = f),
    (t.write = p),
    (t.writeText = v),
    Object.defineProperty(t, "__esModule", { value: !0 });
});
//# sourceMappingURL=clipboard-polyfill.js.map

;}
      } catch(e) { console.error(`  Error executing script ${scriptPath_qyntxdmtbpj}`, e); }
    

      const scriptPath_vkn6iwnj73a = "ExtPay.js"; // Use JSON.stringify for safety
      console.log(`  Executing JS (end): ${scriptPath_vkn6iwnj73a}`);
      try {
          with(__globals){;const ExtPay = (extensionId)  => ({
    startBackground() {
    },

    getUser() {
      return new Promise((resolve) => {
        const dummyUser = {
          paid: true,
          paidAt: new Date(),
          email: "dummyuser@example.com",
          installedAt: new Date(),
          trialStartedAt: null,
          plan: {
            unitAmountCents: 1000,
            currency: "usd",
            nickname: "dummy_plan",
            intervalCount: 1,
            interval: "month",
          },
          subscriptionStatus: "active",
          subscriptionCancelAt: null,
        };
        resolve(dummyUser);
      });
    },
    openPaymentPage(planNickname) {
    },
    getPlans() {
      return new Promise((resolve) => {
        const dummyPlans = [
          {
            unitAmountCents: 1000,
            currency: "usd",
            nickname: "monthly_plan",
            interval: "month",
            intervalCount: 1,
          },
          {
            unitAmountCents: 9900,
            currency: "usd",
            nickname: "yearly_plan",
            interval: "year",
            intervalCount: 1,
          },
        ];
        resolve(dummyPlans);
      });
    },

    onPaid: {
      addListener: (callback) => {
        console.log("Dummy onPaid listener added");
        // Simulate a user paying after 2 seconds
        setTimeout(() => {
          const dummyUser = {
            paid: true,
            paidAt: new Date(),
            email: "dummyuser@example.com",
            installedAt: new Date(),
            trialStartedAt: null,
            plan: {
              unitAmountCents: 1000,
              currency: "usd",
              nickname: "dummy_plan",
              intervalCount: 1,
              interval: "month",
            },
            subscriptionStatus: "active",
            subscriptionCancelAt: null,
          };
          callback(dummyUser);
        }, 2000);
      },
      removeListener: () => {},
    },

    openTrialPage(displayText) {
    },

    openLoginPage() {
      console.log("Dummy login page opened");
      }
    });

    window.ExtPay = ExtPay;
;}
      } catch(e) { console.error(`  Error executing script ${scriptPath_vkn6iwnj73a}`, e); }
    

      const scriptPath_2ogw9rwb36i = "content.js"; // Use JSON.stringify for safety
      console.log(`  Executing JS (end): ${scriptPath_2ogw9rwb36i}`);
      try {
          with(__globals){;var app = {
    version: "1.14",
    browser: "chrome",
    test: !1,
    log: !1,
    settings: {
      installed: !1,
      section: "top",
      settings_tab: "theme",
      stories_view: "list",
      theme: "light",
      font: "sans",
      font_size: 15,
      line_height: 1.35,
      width: 48,
      table_font: "sans",
      table_font_size: 13.5,
      table_line_height: 2.5,
      table_width: 57,
      list_font: "sans",
      list_font_size: 14.5,
      list_line_height: 13.5,
      list_width: 55,
      justify: !1,
      contents: !0,
      fixed_header: !0,
      new_tab: !0,
      fade_low: !0,
      fade_visited: !0,
      highlight_new: !0,
      font_smoothing: !1,
      hover_icons: !0,
      auto_theme: !1,
      auto_theme_light: "light",
      auto_theme_dark: "black",
      table_number: !0,
      table_points: !0,
      table_age: !0,
      table_replies: !0,
      table_user: !1,
      table_domain: !0,
      table_new: !0,
      table_title_bold: !1,
      list_number: !0,
      list_points: !0,
      list_age: !0,
      list_replies: !0,
      list_user: !0,
      list_domain: !0,
      list_new: !0,
      list_title_bold: !1,
      update_msg: "",
    },
    user: null,
    profile: null,
    stories: null,
    story: null,
    more_link: null,
    history: [],
    bookmarks: {
      stories_fav: { updated: null, items: [] },
      stories_fav_private: { updated: null, items: [] },
      stories_upvoted: { updated: null, items: [] },
      stories_posted: { updated: null, items: [] },
      comments_fav: { updated: null, items: [] },
      comments_fav_private: { updated: null, items: [] },
      comments_upvoted: { updated: null, items: [] },
      comments_posted: { updated: null, items: [] },
      users: { updated: null, items: [] },
      highlights: { updated: null, items: [] },
      highlights_tab: "all",
      tab: "stories_fav",
      tab_last: "stories_fav",
      storage: "private",
      comments_truncate: !0,
      stories_truncate: !0,
      highlights_truncate: !1,
    },
    pro: !1,
  },
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  currentMenuCommentIndex = 0,
  currentMenuStoryIndex = 0,
  DateTime = luxon.DateTime,
  extpay = ExtPay("modern-for-hn");
function consoleLog(e) {
  1 == app.log && console.log(e);
}
function startup() {
  chrome.storage.local.get(["enabled", "pro"], function (e) {
    var t;
    (void 0 !== e.enabled && 1 != e.enabled) ||
      ((t = getImageUrl("content.css")),
      document.head.insertAdjacentHTML(
        "beforeend",
        '<link rel="stylesheet" type="text/css" href="' + t + '">',
      ),
      void 0 !== e.pro && (app.pro = 1 == parseInt(e.pro)),
      setup());
  }),
    document.removeEventListener("click", onclick),
    window.matchMedia("(prefers-color-scheme: dark)").addListener(function (e) {
      1 == app.settings.auto_theme &&
        (e.matches
          ? updateSettingTheme(app.settings.auto_theme_dark)
          : updateSettingTheme(app.settings.auto_theme_light));
    });
}
function setup() {
  (linkify.options.defaults.defaultProtocol = "https"),
    (linkify.options.defaults.target = "_blank"),
    loadPro(),
    loadSettings(),
    loadHistory(),
    loadBookmarks(),
    setTimeout(function () {
      loadCommentFavs();
    }, 1500),
    storeSection(),
    drawHeader(),
    setupPage(),
    setupEvents(),
    setupImages(),
    setupHighlighter(),
    drawNavButtons(),
    setupPro(),
    window.addEventListener("pageshow", pageShown, !1);
}
function loadPro() {
  try {
    extpay.getUser().then((e) => {
      app.pro != e.paid && reloadAfterTimeout(),
        (app.pro = e.paid),
        chrome.storage.local.set({ pro: 1 == app.pro ? 1 : 0 });
    });
  } catch (e) {
    console.log("loadPro() - error: " + e);
  }
}
function reloadAfterTimeout() {
  setTimeout(function () {
    location.reload();
  }, 1e3);
}
function setupPro() {
  1 == app.pro ? $("#button_bookmark").show() : $("#button_bookmark").hide();
}
function isPro() {
  return app.pro;
}
extpay.onPaid.addListener((e) => {
  console.log("onPaid"), chrome.storage.local.set({ pro: 1 });
}),
  chrome.runtime.onMessage.addListener(function (e, t, a) {
    e.action;
  });
var paidTimer = null;
function openPayment() {
  extpay.openPaymentPage(),
    clearInterval(paidTimer),
    (paidTimer = setInterval(function () {
      chrome.storage.local.get(["pro"], function (e) {
        void 0 !== e.pro &&
          1 == parseInt(e.pro) &&
          (clearInterval(paidTimer),
          (app.pro = !0),
          chrome.storage.local.set({ pro: 1 }),
          alert(
            "Thanks for upgrading! Click OK and wait for the page to reload to enable Pro features.",
          ),
          location.reload());
      });
    }, 500));
}
function pageShown(e) {
  e.persisted && (drawHeaderTabs(), drawSwitcher()), updateHeaderTitleShow();
}
function storeSection() {
  0 == onItemPage() && (app.settings.section = getSectionFromUrl()),
    saveSettings(),
    drawHeaderTabs();
}
function hideLoadingOverlay() {
  $("#ext_loading").addClass("ext-loading-hide"),
    setTimeout(function () {
      $("#ext_loading").remove();
    }, 420);
}
function setupPage() {
  1 == onItemPage()
    ? (parseStory(), drawStory())
    : 1 == onListPage()
      ? (parseStories(), drawStories())
      : 1 == onCommentsPage()
        ? (parseComments(), drawProfileComments())
        : "user" == getSectionFromUrl()
          ? (parseProfile(), drawProfile())
          : "leaders" == getSectionFromUrl() && drawLeaders(),
    setupUserHover(),
    setTimeout(function () {
      scrollToAnchor();
    }, 250);
}
var wikiHighlightPopupOpen = !1,
  wikiHidingHighlight = !1,
  lastMouseUpTop = 0,
  showHighlightTimer = null,
  doShowHighlightTimer = null,
  selectedHighlightId = null;
function setupHighlighter() {
  $("#wiki_highlight_popup").remove(),
    drawHighlightMenu(
      $("<div />")
        .addClass("wiki-highlight-popup")
        .attr("id", "wiki_highlight_popup")
        .appendTo("body"),
    );
}
function drawHighlightMenu(e) {
  e.html("");
  var t = $("<div />").addClass("wiki-highlight-popup-inner"),
    a = $("<div />").addClass("wiki-highlight-popup-arrow");
  1 == contextMenuOpen && a.addClass("wiki-highlight-popup-arrow-right"),
    t.appendTo(e),
    a.appendTo(e);
  var o = $("<div />")
      .addClass("wiki-highlight-popup-button wiki-highlight-popup-colors")
      .appendTo(t),
    s =
      ($("<div />")
        .addClass("wiki-highlight-color3")
        .data("color_index", 3)
        .appendTo(o),
      $("<div />")
        .addClass("wiki-highlight-popup-button wiki-highlight-popup-save")
        .appendTo(t)),
    n = $("<div />")
      .addClass("wiki-highlight-popup-button wiki-highlight-popup-delete")
      .appendTo(t);
  n.css(
    "background-image",
    "url('" + getImageUrl("images/icon-cross-thin.png") + "')",
  );
  var i = $("<div />").addClass("wiki-highlight-popup-others").appendTo(t),
    a = $("<div />")
      .addClass("wiki-highlight-popup-button wiki-highlight-popup-quote")
      .appendTo(i),
    e = $("<div />")
      .addClass("wiki-highlight-popup-button wiki-highlight-popup-copy")
      .appendTo(i),
    o = $("<div />")
      .addClass("wiki-highlight-popup-button wiki-highlight-popup-speak")
      .appendTo(i),
    i = $("<div />")
      .addClass("wiki-highlight-popup-button wiki-highlight-popup-search")
      .appendTo(i);
  s.css(
    "background-image",
    "url('" + getImageUrl("images/icon-bookmark-small.png") + "')",
  ),
    a.css(
      "background-image",
      "url('" + getImageUrl("images/icon-reply.png") + "')",
    ),
    e.css(
      "background-image",
      "url('" + getImageUrl("images/icon-copy.png") + "')",
    ),
    o.css(
      "background-image",
      "url('" + getImageUrl("images/icon-speak4.png") + "')",
    ),
    i.css(
      "background-image",
      "url('" + getImageUrl("images/icon-search2.png") + "')",
    ),
    $(".wiki-highlight-popup-colors div")
      .off("mousedown")
      .on("mousedown", function () {
        highlightSelection(parseInt($(this).data("color_index")));
      }),
    $(".wiki-highlight-popup-colors div")
      .off("mouseup")
      .on("mouseup", function () {
        (null != selectedHighlightId ? hideContextMenu : hideHighlightPopup)();
      }),
    s.off("mousedown").on("mousedown", function () {
      highlightSelection();
    }),
    s.off("mouseup").on("mouseup", function () {
      hideHighlightPopup();
    }),
    a.off("mousedown").on("mousedown", function () {
      var e,
        t = "",
        a = null;
      if (
        (null != selectedHighlightId
          ? ((e = getHighlightIndexFromId(selectedHighlightId)),
            (t = app.bookmarks.highlights.items[e].text),
            (a = new Highlighter(document).getRange(
              "highlight_" + selectedHighlightId,
            )))
          : ((a = window.getSelection().getRangeAt(0)),
            (t = $.trim(a.toString()))),
        0 != t.length)
      ) {
        for (var o = null, s = 0; s < app.story.comments.length; s++)
          if (parseInt(app.story.comments[s].id) == menuCommentId) {
            o = s;
            break;
          }
        null != o &&
          (showCommentReply(o),
          $("#comment_reply_input_" + menuCommentId).val("> " + t + "\n\n"),
          setTimeout(function () {
            $("#comment_reply_input_" + menuCommentId).focus();
          }, 50));
      }
    }),
    a.off("mouseup").on("mouseup", function () {
      hideHighlightPopup();
    }),
    e.off("mousedown").on("mousedown", function () {
      var e,
        t = "";
      0 !=
        (t =
          null != selectedHighlightId
            ? ((e = getHighlightIndexFromId(selectedHighlightId)),
              app.bookmarks.highlights.items[e].text)
            : $.trim(window.getSelection().getRangeAt(0).toString())).length &&
        clipboard.writeText(t);
    }),
    e.off("mouseup").on("mouseup", function () {
      hideContextMenu(), hideHighlightPopup();
    }),
    o.off("mousedown").on("mousedown", function () {
      var e,
        t = "",
        a = null;
      null != selectedHighlightId
        ? ((e = getHighlightIndexFromId(selectedHighlightId)),
          (t = app.bookmarks.highlights.items[e].text),
          (a = new Highlighter(document).getRange(
            "highlight_" + selectedHighlightId,
          )))
        : ((a = window.getSelection().getRangeAt(0)),
          (t = $.trim(a.toString()))),
        0 != t.length &&
          ("speechSynthesis" in window
            ? (((e = new SpeechSynthesisUtterance()).text = t),
              (e.volume = 0.8),
              (e.rate = 1.05),
              (e.pitch = 1.25),
              (e.onstart = function () {
                createHighlight(a, "speech", 7);
              }),
              (e.onend = function () {
                $("#highlight_speech").contents().unwrap(),
                  $("mark[data-first-mark-id='highlight_speech']")
                    .contents()
                    .unwrap();
              }),
              window.speechSynthesis.speak(e))
            : alert("Sorry, your browser doesn't support text to speech."));
    }),
    o.off("mouseup").on("mouseup", function () {
      hideHighlightPopup();
    }),
    i.off("mousedown").on("mousedown", function () {
      var e = $.trim(window.getSelection().getRangeAt(0).toString());
      0 != e.length &&
        window.open("https://hn.algolia.com/?q=" + e, "_blank").focus();
    }),
    i.off("mouseup").on("mouseup", function () {
      hideHighlightPopup();
    }),
    n.off("mousedown").on("mousedown", function () {
      removeFromHighlights(selectedHighlightId);
    }),
    n.off("mouseup").on("mouseup", function () {
      1 == contextMenuOpen && drawBookmarksMenu(),
        hideContextMenu(),
        hideHighlightPopup();
    }),
    updateHighlightMenu(t);
}
function updateHighlightMenu(e) {
  var t = $(".wiki-highlight-popup-save", e),
    a = $(".wiki-highlight-popup-quote", e),
    o = $(".wiki-highlight-popup-copy", e),
    s = $(".wiki-highlight-popup-search", e),
    n = $(".wiki-highlight-popup-delete", e),
    e = $(".wiki-highlight-popup-sep-right", e);
  null != selectedHighlightId
    ? (e.show(), t.hide(), n.show(), s.hide(), 1 == contextMenuOpen && a.hide())
    : (e.hide(),
      t.show(),
      a.show(),
      n.hide(),
      100 < window.getSelection().toString().length
        ? (s.hide(), o.addClass("wiki-highlight-popup-tab-no-border"))
        : (s.show(), o.removeClass("wiki-highlight-popup-tab-no-border")));
}
function getHighlightFromId(e) {
  for (var t = 0; t < app.bookmarks.highlights.items.length; t++)
    if (app.bookmarks.highlights.items[t].id == e)
      return app.bookmarks.highlights.items[t];
  return null;
}
function getHighlightIndexFromId(e) {
  for (var t = 0; t < app.bookmarks.highlights.items.length; t++)
    if (app.bookmarks.highlights.items[t].id == e) return t;
  return null;
}
function showHighlight(e) {
  e = void 0 === e ? selectedHighlightId : e;
  0 != isPro() &&
    1 != wikiHighlightPopupOpen &&
    ((wikiHighlightPopupOpen = !0),
    clearTimeout(doShowHighlightTimer),
    (doShowHighlightTimer = setTimeout(function () {
      doShowHighlight(e);
    }, 0)));
}
function doShowHighlight(e) {
  if (1 != wikiHidingHighlight || 0 != contextMenuOpen) {
    selectedHighlightId = e;
    var t = $("#wiki_highlight_popup"),
      a = $(".wiki-highlight-popup-arrow", t);
    $(".wiki-highlight-popup-search", t), $(".wiki-highlight-popup-copy", t);
    if (null != e) {
      var o = getHighlightFromId(e),
        s = $("#highlight_" + o.id),
        n = $(".wiki-highlight-first-left", s).offset(),
        i = new Highlighter(this.document)
          .getRange("highlight_" + e)
          .getBoundingClientRect(),
        o = document.body.parentNode.getBoundingClientRect();
      (s = i.left + i.width / 2 - t.width() / 2) < n.left - t.width() / 2 &&
        (s = n.left - t.width() / 2),
        t.css("top", i.top - o.top - 53 + "px"),
        t.css("left", s + "px");
    } else {
      if (window.getSelection().isCollapsed) return;
      if (0 == $.trim(window.getSelection().getRangeAt(0).toString()).length)
        return;
      (i = window.getSelection().getRangeAt(0).getBoundingClientRect()),
        (o = document.body.parentNode.getBoundingClientRect()),
        (s = i.left + i.width / 2 - t.width() / 2);
      t.css("top", i.top - o.top - 53 + "px"), t.css("left", s + "px");
    }
    a.css("left", t.width() / 2 - 6 + "px"),
      t.addClass("wiki-highlight-popup-show"),
      updateHighlightMenu(t);
  }
}
var wikiHidingHighlightTimer = null;
function hideHighlightPopup() {
  0 < $("#wiki_highlight_popup").length &&
    ($("#wiki_highlight_popup").removeClass("wiki-highlight-popup-show"),
    (wikiHighlightPopupOpen = !(wikiHidingHighlight = !(selectedHighlightId =
      null))),
    clearTimeout(wikiHidingHighlightTimer),
    (wikiHidingHighlightTimer = setTimeout(function () {
      wikiHidingHighlight = !1;
    }, 100)));
}
function highlightSelection(e) {
  e = void 0 === e ? 3 : e;
  if (null != selectedHighlightId) {
    var t = getHighlightIndexFromId(selectedHighlightId);
    (app.bookmarks.highlights.items[t].color = e), saveBookmarks();
    for (const i of new Highlighter(this.document).getMarkElements(
      "highlight_" + selectedHighlightId,
    ))
      $(i).removeClass(
        "wiki-highlight-color1 wiki-highlight-color2 wiki-highlight-color3 wiki-highlight-color4 wiki-highlight-color5 wiki-highlight-color6",
      ),
        $(i).addClass("wiki-highlight-color" + e),
        $(
          "#menu_highlight_row_" +
            selectedHighlightId +
            " .wiki-menu-highlight-dot",
        ).removeClass(
          "wiki-highlight-color1 wiki-highlight-color2 wiki-highlight-color3 wiki-highlight-color4 wiki-highlight-color5 wiki-highlight-color6",
        ),
        $(
          "#menu_highlight_row_" +
            selectedHighlightId +
            " .wiki-menu-highlight-dot",
        ).addClass("wiki-highlight-color" + e);
  } else {
    var a = window.getSelection().getRangeAt(0),
      o = getXRangeFromRange(a),
      s = $(window.getSelection().anchorNode).closest(".hn-comment"),
      n = s.attr("id"),
      t = $(".hn-comment-info-user", s).first().attr("data-username"),
      s = $(".hn-story-info-age", s).first().attr("title"),
      a = (a = $.trim(a.toString())).replace(/\[[0-9]+\]/g, "");
    addToHighlights({
      story_id: app.story.id,
      story_title: app.story.title,
      comment_id: n,
      comment_age: s,
      user: t,
      id: getUUID(),
      xrange: o,
      text: a,
      color: e,
      top: lastMouseUpTop,
      timestamp: Math.floor(Date.now() / 1e3),
      deleted: !1,
    });
  }
}
function addToHighlights(e) {
  app.bookmarks.highlights.items.push(e),
    (app.bookmarks.highlights.updated = Math.floor(Date.now() / 1e3));
  createHighlight(getRangeFromXRange(e.xrange), e.id, e.color);
  saveBookmarks();
}
function removeFromHighlights(e) {
  var t = getHighlightIndexFromId((e = void 0 === e ? selectedHighlightId : e));
  $("#menu_highlight_row_" + e).remove(),
    (app.bookmarks.highlights.items[t].deleted = !0),
    (app.bookmarks.highlights.updated = Math.floor(Date.now() / 1e3));
  for (const a of new Highlighter(this.document).getMarkElements(
    "highlight_" + e,
  ))
    $(a).addClass("wiki-highlight-deleted");
  saveBookmarks();
}
function getArticleHighlights() {
  if (
    void 0 === app.bookmarks.highlights.items ||
    0 == app.bookmarks.highlights.items.length
  )
    return [];
  for (var e = [], t = 0; t < app.bookmarks.highlights.items.length; t++)
    app.bookmarks.highlights.items[t].story_id == app.story.id &&
      e.push(app.bookmarks.highlights.items[t]);
  return e;
}
function drawHighlights() {
  if (
    0 != isPro() &&
    void 0 !== app.bookmarks.highlights.items &&
    0 != app.bookmarks.highlights.items.length &&
    0 != onItemPage()
  )
    for (var e, t = getArticleHighlights(), a = 0; a < t.length; a++) {
      try {
        if (!(e = getRangeFromXRange(t[a].xrange)))
          throw new Error("Unable to parse xrange.");
      } catch (e) {
        console.log("drawHighlights() - error parsing xrange: " + e);
        continue;
      }
      createHighlight(e, t[a].id, t[a].color);
    }
}
function createHighlight(e, t, a) {
  var o = [],
    s = getHighlightFromId(t);
  try {
    o = new Highlighter(this.document).mark(e, "highlight_" + t, "mark");
  } catch (e) {
    return console.log("createHighlight() error - " + e), [];
  }
  if (0 === o.length) return [];
  var n,
    i = 0;
  for ({ classList: n } of o)
    n.add("wiki-highlight-text"),
      n.add("wiki-highlight-color3"),
      0 == i
        ? n.add("wiki-highlight-text-first")
        : i == o.length - 1 && n.add("wiki-highlight-text-last"),
      null != s && 1 == s.deleted && n.add("wiki-highlight-deleted"),
      i++;
  if (null != s && 0 == s.deleted)
    for (var r = 0; r < o.length; r++)
      $(o[r]).hasClass("wiki-highlight-text-first") &&
        $("<span />").addClass("wiki-highlight-first-left").prependTo($(o[r])),
        $(o[r]).on("click", function (e) {
          0 == $(this).hasClass("wiki-highlight-deleted") &&
            highlightClick($(this));
        }),
        $(o[r]).on("mouseenter", function () {
          0 == $(this).hasClass("wiki-highlight-deleted") &&
            highlightHover($(this));
        }),
        $(o[r]).on("mouseleave", function () {
          0 == $(this).hasClass("wiki-highlight-deleted") &&
            highlightHoverOff($(this));
        });
  return o;
}
function highlightClick(e) {
  var t = e.attr("data-first-mark-id");
  showHighlight(
    (t = (t = null == t ? e.attr("id") : t).replace("highlight_", "")),
  );
}
function highlightHover(e) {
  var t = e.attr("data-first-mark-id");
  null == t && (t = e.attr("id")),
    $("#" + t).addClass("wiki-highlight-hover"),
    $("[data-first-mark-id='" + t + "']").addClass("wiki-highlight-hover");
}
function highlightHoverOff(e) {
  $(".wiki-highlight-hover").removeClass("wiki-highlight-hover");
}
var showUserHoverTimer,
  highlighterSettings = {
    firstMarkId: "firstMarkId",
    privateId: "privateId",
    nextPrivateId: "nextPrivateId",
    nodeTypes: {
      table: [
        HTMLTableElement,
        HTMLTableRowElement,
        HTMLTableColElement,
        HTMLTableSectionElement,
      ],
      terminal: [HTMLScriptElement, HTMLStyleElement, HTMLSelectElement],
    },
  };
class Highlighter {
  constructor(e) {
    this.document = e;
  }
  mark(e, a, t = "mark") {
    const o = this.document.createElement(t),
      s = [];
    return (
      this.doMark(e, s, () => {
        const e = o.cloneNode(!1);
        var t = s.length;
        return (
          0 === t && a && (e.id = a),
          (e.dataset[highlighterSettings.privateId] = getUUID()),
          0 < t &&
            ((e.dataset[highlighterSettings.firstMarkId] = s[0].id),
            (s[t - 1].dataset[highlighterSettings.nextPrivateId] =
              e.dataset[highlighterSettings.privateId])),
          s.push(e),
          e
        );
      }),
      s
    );
  }
  doMark(e, n, i) {
    if (!e.collapsed) {
      let a = e.startContainer,
        o = e.endContainer,
        s = !0;
      if (0 === e.endOffset) {
        for (
          ;
          !o.previousSibling && o.parentNode !== e.commonAncestorContainer;

        )
          o = o.parentNode;
        o = o.previousSibling;
      } else
        o.nodeType === Node.TEXT_NODE
          ? e.endOffset < o.nodeValue.length && o.splitText(e.endOffset)
          : 0 < e.endOffset && (o = o.childNodes.item(e.endOffset - 1));
      a.nodeType === Node.TEXT_NODE
        ? e.startOffset === a.nodeValue.length
          ? (s = !1)
          : 0 < e.startOffset &&
            ((a = a.splitText(e.startOffset)),
            o === a.previousSibling && (o = a))
        : e.startOffset < a.childNodes.length
          ? (a = a.childNodes.item(e.startOffset))
          : (s = !1),
        e.setStart(e.startContainer, 0),
        e.setEnd(e.startContainer, 0);
      for (let e = !1, t = a; !1 === e; ) {
        if (
          s &&
          t.nodeType === Node.TEXT_NODE &&
          !highlighterSettings.nodeTypes.table.some(
            (e) => t.parentNode instanceof e,
          )
        ) {
          let e = t.previousSibling;
          (e && 0 != n.length && e === n[n.length - 1]) ||
            ((e = i()), t.parentNode.insertBefore(e, t)),
            e.appendChild(t),
            (t = e.lastChild),
            (s = !1);
        }
        t !== o || (s && o.hasChildNodes()) || (e = !0),
          highlighterSettings.nodeTypes.terminal.some((e) => t instanceof e) &&
            (s = !1),
          s && t.hasChildNodes()
            ? (t = t.firstChild)
            : t.nextSibling
              ? ((t = t.nextSibling), (s = !0))
              : t.nextSibling || ((t = t.parentNode), (s = !1));
      }
    }
  }
  removeMark(e) {
    e = this.getMarkElements(e);
    if (0 === e.length) return [];
    for (const o of e) {
      for (; o.hasChildNodes(); ) {
        var t = o.parentNode.insertBefore(o.firstChild, o);
        t.nodeType === Node.TEXT_NODE && this.doMergeTextNode(t);
      }
      var a = o.previousSibling;
      o.parentNode.removeChild(o),
        a && a.nodeType === Node.TEXT_NODE && this.doMergeTextNode(a);
    }
    return e;
  }
  doMergeTextNode(e) {
    console.assert(e.nodeType === Node.TEXT_NODE),
      e.nextSibling &&
        e.nextSibling.nodeType === Node.TEXT_NODE &&
        ((e.textContent += e.nextSibling.textContent),
        e.nextSibling.parentNode.removeChild(e.nextSibling)),
      e.previousSibling &&
        e.previousSibling.nodeType === Node.TEXT_NODE &&
        ((e.previousSibling.textContent += e.textContent),
        e.parentNode.removeChild(e));
  }
  update(e, t, a = []) {
    const o = new Set(Array.isArray(a) ? a : [a]);
    var s,
      e = this.getMarkElements(e);
    for ({ classList: s } of e)
      s.remove(...Array.from(s).filter((e) => !1 === o.has(e))), s.add(t);
    return e;
  }
  getMarkElements(e) {
    var t = this.document.getElementById(e),
      e = highlighterSettings.firstMarkId;
    const a = [
      (t && t.dataset[e] && this.document.getElementById(t.dataset[e])) || t,
    ];
    if (!a[0]) return [];
    for (
      var o = `data-${camelCaseToHyphen(highlighterSettings.privateId)}`;
      ;

    ) {
      var s = a[a.length - 1].dataset[highlighterSettings.nextPrivateId],
        s = (s && this.document.querySelector(`[${o}="${s}"]`)) || null;
      if (!s) break;
      a.push(s);
    }
    return a;
  }
  getRange(e) {
    e = this.getMarkElements(e);
    const t = this.document.createRange();
    for (const a of e) t.collapsed && t.setStartBefore(a), t.setEndAfter(a);
    return t;
  }
}
function getXRangeFromRange(e) {
  return {
    startContainerPath: getNodeXPath(e.startContainer),
    startOffset: e.startOffset,
    endContainerPath: getNodeXPath(e.endContainer),
    endOffset: e.endOffset,
    collapsed: e.collapsed,
  };
}
function getNodeXPath(a) {
  for (
    var e = [];
    a && (a.nodeType === Node.ELEMENT_NODE || a.nodeType === Node.TEXT_NODE);
    a = a.parentNode
  ) {
    var o = [],
      t = (() => {
        switch (a.nodeType) {
          case Node.ELEMENT_NODE:
            return a.nodeName.toLowerCase();
          case Node.TEXT_NODE:
            return "text()";
          default:
            console.error(`Not a valid node type: ${a.nodeType}`);
        }
      })();
    if (a.nodeType === Node.ELEMENT_NODE && 0 < a.id.length) {
      if (1 === $("#" + a.id, a.ownerDocument).length) {
        e.unshift(`/${t}[@id="${a.id}"]`);
        break;
      }
      a.parentElement &&
        !Array.prototype.slice
          .call(a.parentElement.children)
          .some((e) => e !== a && e.id === a.id) &&
        o.push(`@id="${a.id}"`);
    }
    if (0 === o.length) {
      let t = 1;
      for (let e = a.previousSibling; e; e = e.previousSibling)
        e.nodeType !== Node.DOCUMENT_TYPE_NODE &&
          a.nodeType === e.nodeType &&
          e.nodeName === a.nodeName &&
          t++;
      1 < t && o.push(`${t}`);
    }
    e.unshift(t + o.map((e) => `[${e}]`).join(""));
  }
  return 0 === e.length ? "" : `/${e.join("/")}`;
}
function getRangeFromXRange(e, t = window.document) {
  let a, o;
  const s = new XPathEvaluator();
  var n = s.evaluate(
    e.startContainerPath,
    t.documentElement,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  );
  if (!n.singleNodeValue) return null;
  if (e.collapsed || !e.endContainerPath) (a = n), (o = e.startOffset);
  else {
    if (
      ((a = s.evaluate(
        e.endContainerPath,
        t.documentElement,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      )),
      !a.singleNodeValue)
    )
      return null;
    o = e.endOffset;
  }
  const i = t.createRange();
  return (
    i.setStart(n.singleNodeValue, e.startOffset),
    i.setEnd(a.singleNodeValue, o),
    i
  );
}
function getUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e, t) => {
    let a = (16 * Math.random()) | 0,
      o = "x" == e ? a : (3 & a) | 8;
    return 0 === t && (o = (o % 6) + 10), o.toString(16);
  });
}
function camelCaseToHyphen(e) {
  return e.replace(/([A-Z])/g, "-$1").toLowerCase();
}
function setupUserHover() {
  $(".hn-user-link")
    .off("mouseenter")
    .on("mouseenter", function () {
      showUserHover($(this));
    }),
    $(".hn-user-link")
      .off("mouseleave")
      .on("mouseleave", function (e) {
        hideUserHover(e);
      });
}
var hideUserHoverTimer,
  userHoverLink = null,
  userHoverCache = [],
  userHoverUsername = "";
function showUserHover(a) {
  0 != isPro() &&
    (clearTimeout(hideUserHoverTimer),
    $("#hn_user_hover").remove(),
    clearTimeout(showUserHoverTimer),
    (showUserHoverTimer = setTimeout(function () {
      (userHoverLink = a), $("#hn_user_hover").remove();
      var e = a.data("username"),
        t = $("<div />")
          .addClass("hn-user-hover")
          .attr("id", "hn_user_hover")
          .appendTo("body");
      $("<div />")
        .addClass("hn-user-hover-loading")
        .css("background-image", "url('" + getLoadingImage() + "')")
        .appendTo(t),
        loadUserHover(e),
        updateUserHoverPosition(),
        t.css("animation", "hover-show-anim 0.2s ease 0s 1 normal forwards"),
        t.on("mouseenter", function (e) {
          clearTimeout(hideUserHoverTimer);
        }),
        t.on("mouseleave", function (e) {
          hideUserHover(e, 50);
        });
    }, 50)));
}
function getLoadingImage() {
  var e = getImageUrl("images/loading-dots.gif");
  return (
    "sepia" == app.settings.theme
      ? (e = getImageUrl("images/loading-dots-sepia-box.gif"))
      : "slate" == app.settings.theme
        ? (e = getImageUrl("images/loading-dots-slate-box.gif"))
        : "dark" == app.settings.theme
          ? (e = getImageUrl("images/loading-dots-dark-box.gif"))
          : "black" == app.settings.theme &&
            (e = getImageUrl("images/loading-dots-black-box.gif")),
    e
  );
}
function updateUserHoverPosition() {
  var e = $("#hn_user_hover"),
    t = userHoverLink.offset(),
    a = t.left + 0,
    o = t.top + userHoverLink.height() + 6;
  e.css("left", a + "px"),
    o + e.outerHeight() > $(window).scrollTop() + window.innerHeight
      ? ((o = window.innerHeight - t.top + 6),
        e
          .css("top", "")
          .css("bottom", o + "px")
          .addClass("hn-user-hover-above"))
      : e.css("bottom", "").css("top", o + "px");
}
function loadUserHover(e) {
  userHoverUsername = e;
  for (var t = null, a = 0; a < userHoverCache.length; a++)
    if (userHoverCache[a].name == e) {
      t = a;
      break;
    }
  null == t
    ? (userHoverCache.push({
        name: e,
        created: null,
        karma: null,
        about: null,
        loaded: !1,
      }),
      $.ajax({
        url: "https://hacker-news.firebaseio.com/v0/user/" + e + ".json",
        type: "GET",
        data: {},
        timeout: 15e3,
        dataType: "json",
        success: function (e) {
          if (void 0 !== e.created) {
            for (var t = null, a = 0; a < userHoverCache.length; a++)
              if (userHoverCache[a].name == e.id) {
                t = a;
                break;
              }
            null != t &&
              ((userHoverCache[t].created = e.created),
              (userHoverCache[t].karma = e.karma),
              (userHoverCache[t].about = e.about),
              (userHoverCache[t].loaded = !0),
              e.id == userHoverUsername &&
                drawUserHover((t = userHoverCache.length - 1)));
          } else $("#hn_user_hover").text("Error loading profile.");
        },
      }))
    : 1 == userHoverCache[t].loaded && drawUserHover(t);
}
function drawUserHover(e) {
  var t, a, o;
  0 != $("#hn_user_hover").length &&
    ((t = userHoverCache[e]),
    (a = $("#hn_user_hover").text("")),
    (e = $("<div />").addClass("hn-user-hover-wrap").appendTo(a)),
    $("<a />")
      .addClass("hn-user-hover-name")
      .attr("href", "https://news.ycombinator.com/user?id=" + t.name)
      .text(t.name)
      .appendTo(e),
    $("<div />")
      .addClass("hn-user-hover-info")
      .html(
        "Joined <i title='" +
          getFormattedDate(t.created) +
          "'>" +
          getOldness(t.created) +
          " ago</i> <span>&bull;</span> " +
          commaSeparateNumber(t.karma) +
          " Karma",
      )
      .appendTo(e),
    void 0 !== t.about &&
      ((o = $.trim($("<div />").html(t.about).html())),
      $("<div />")
        .addClass("hn-user-hover-about")
        .html(o)
        .linkify()
        .appendTo(e)),
    (o = $("<div />")
      .addClass("hn-user-hover-bookmark")
      .data("user_info", t)
      .appendTo(e)).on("click", function () {
      userBookmarkClick($(this));
    }),
    null != getUserBookmarksIndex(t.name)
      ? ($("<div />")
          .css(
            "background-image",
            "url('" +
              getImageUrl("images/icon-bookmark-small-orange.png") +
              "')",
          )
          .appendTo(o),
        o.addClass("hn-user-hover-bookmark-selected"))
      : $("<div />")
          .css(
            "background-image",
            "url('" + getImageUrl("images/icon-bookmark-small.png") + "')",
          )
          .appendTo(o),
    200 < e.outerHeight() &&
      $("<div />").addClass("hn-user-hover-fade").appendTo(a),
    updateUserHoverPosition());
}
function getStoryBookmarksIndex(e) {
  for (
    var t = null, a = 0;
    a < app.bookmarks.stories_fav_private.items.length;
    a++
  )
    if (
      parseInt(app.bookmarks.stories_fav_private.items[a].id) == parseInt(e)
    ) {
      t = a;
      break;
    }
  return t;
}
function getUserBookmarksIndex(e) {
  for (var t = null, a = 0; a < app.bookmarks.users.items.length; a++)
    if (app.bookmarks.users.items[a].name == e) {
      t = a;
      break;
    }
  return t;
}
function getCommentBookmarksIndex(e) {
  var t = app.bookmarks.comments_fav.items;
  "private" == getBookmarksStorage() &&
    (t = app.bookmarks.comments_fav_private.items);
  for (var a = null, o = 0; o < t.length; o++)
    if (t[o].id == e) {
      a = o;
      break;
    }
  return a;
}
function userBookmarkClick(e) {
  var t = e.data("user_info"),
    a = getUserBookmarksIndex(t.name);
  null == a
    ? (e.addClass("hn-user-hover-bookmark-selected"),
      $("div", e).css(
        "background-image",
        "url('" + getImageUrl("images/icon-bookmark-small-orange.png") + "')",
      ))
    : (e.removeClass("hn-story-bookmark-selected"),
      $("div", e).css(
        "background-image",
        "url('" + getImageUrl("images/icon-bookmark-small.png") + "')",
      )),
    null != a
      ? app.bookmarks.users.items.splice(a, 1)
      : ((a = ""),
        void 0 !== t.about && (a = t.about),
        (a = $("<div />").html(a.replace("<p>", " <p>")).text().slice(0, 150)),
        app.bookmarks.users.items.push({
          name: t.name,
          timestamp: Math.floor(Date.now() / 1e3),
        }),
        (app.bookmarks.users.updated = Math.floor(Date.now() / 1e3))),
    saveBookmarks();
}
function hideUserHover(e, t) {
  t = void 0 === t ? 100 : t;
  clearTimeout(showUserHoverTimer),
    clearTimeout(hideUserHoverTimer),
    (hideUserHoverTimer = setTimeout(function () {
      $("#hn_user_hover").css(
        "animation",
        "hover-hide-anim 0.15s ease-in 0s 1 normal forwards",
      );
    }, t));
}
function scrollToAnchor() {
  var e = window.location.hash.substr(1);
  0 < e.length &&
    0 < $("#" + e).length &&
    $("#" + e)[0].scrollIntoView({ behavior: "smooth" });
}
function onIndexPage() {
  var e = getSectionFromUrl();
  return "top" == e || "front" == e;
}
function onItemPage() {
  var e = getSectionFromUrl();
  return "item" == e || "edit" == e || "delete" == e;
}
function onListPage() {
  var e = getSectionFromUrl();
  return (
    "top" == e ||
    "ask" == e ||
    "asknew" == e ||
    "show" == e ||
    "shownew" == e ||
    "newest" == e ||
    "best" == e ||
    "jobs" == e ||
    "launches" == e ||
    "submitted" == e ||
    "favorites" == e ||
    "hidden" == e ||
    "from" == e ||
    "pool" == e ||
    "noobstories" == e ||
    "active" == e ||
    "upvoted" == e ||
    "front" == e
  );
}
function onCommentsPage() {
  var e = getSectionFromUrl();
  return (
    "threads" == e ||
    "upvoted_comments" == e ||
    "favorite_comments" == e ||
    "newcomments" == e ||
    "noobcomments" == e ||
    "bestcomments" == e
  );
}
function onAnotherPage() {
  return new URLSearchParams(window.location.search).has("p");
}
function parseUser() {
  app.user = null;
  var e = getSectionFromUrl();
  ("submitted" != e &&
    "threads" != e &&
    "favorites" != e &&
    "favorite_comments" != e &&
    "upvoted" != e &&
    "upvoted_comments" != e &&
    "user" != e &&
    "hidden" != e) ||
    ((e = new URLSearchParams(window.location.search)),
    (app.user = e.get("id")),
    (null != app.user && 0 != app.user.length) || (app.user = $("#me").text()));
}
function parseProfile() {
  var e = $.trim(
    $("#hnmain table").last().find("tr").eq(3).find("td").eq(1).html(),
  );
  app.profile = {
    created: $.trim(
      $("#hnmain table")
        .last()
        .find("tr")
        .eq(1)
        .find("td")
        .eq(1)
        .find("a")
        .first()
        .text(),
    ),
    created_link: $("#hnmain table")
      .last()
      .find("tr")
      .eq(1)
      .find("td")
      .eq(1)
      .find("a")
      .first()
      .attr("href"),
    karma: $.trim(
      $("#hnmain table").last().find("tr").eq(2).find("td").eq(1).text(),
    ),
    about: e,
  };
}
function drawProfile() {
  $("#hnmain, center").hide(), $(".fatitem, .comment-tree").remove();
  var e = $("<div />")
    .attr("id", "hn_content")
    .addClass("hn-content")
    .insertAfter("#hn_header");
  drawProfileHeader();
  var t = app.profile.about;
  app.user == getUsername() &&
    (t = $(".profileform textarea[name='about']").val()),
    $("<div />").addClass("hn-profile-about").html(t).linkify().appendTo(e);
}
function drawLeaders() {
  var t = [],
    a = 1;
  $("tr.athing").each(function (e) {
    t.push({
      number: a,
      user: $(".hnuser", this).first().text(),
      karma: $.trim($("td", this).last().text()),
    }),
      a++;
  }),
    $("#hnmain, center").hide(),
    $("#hnmain .athing").remove();
  for (
    var e = $("<div />")
        .attr("id", "hn_content")
        .addClass("hn-content")
        .insertAfter("#hn_header"),
      e = $("<div />").addClass("").appendTo(e),
      o =
        (drawPageHeader(),
        $("<table />").addClass("leaders-table").appendTo(e)),
      s = 0;
    s < t.length;
    s++
  ) {
    var n = $("<tr />").appendTo(o);
    $("<td />")
      .text(t[s].number + "")
      .addClass("leaders-table-number")
      .appendTo(n);
    var i = $("<td />").addClass("leaders-table-user").appendTo(n);
    $("<td />")
      .text(commaSeparateNumber(t[s].karma))
      .addClass("leaders-table-karma")
      .appendTo(n),
      $("<a />")
        .attr("href", "https://news.ycombinator.com/user?id=" + t[s].user)
        .text(t[s].user)
        .appendTo(i),
      9 == s &&
        ((i = $("<tr />").appendTo(o)),
        $("<td />").addClass("leaders-table-spacer").appendTo(i),
        $("<td />").addClass("leaders-table-spacer").appendTo(i),
        $("<td />").addClass("leaders-table-spacer").appendTo(i));
  }
}
function drawProfileHeader() {
  var e = $("#hn_content");
  $("#hn_items_header").remove();
  var t = getSectionFromUrl();
  parseUser();
  var a = $("<div />")
    .attr("id", "hn_items_header")
    .addClass("hn-items-header hn-items-header-profile")
    .prependTo(e);
  $("<div />").addClass("hn-profile-heading").text(app.user).appendTo(a);
  var o = $("<div />")
    .addClass("hn-profile-info")
    .attr("id", "profile_info")
    .appendTo(a);
  $("<div />").addClass("hn-profile-info-text").text("Loading...").appendTo(o),
    loadProfileInfo(app.user);
  var s = $("<div />").addClass("hn-story-icons").appendTo(o);
  app.user != getUsername()
    ? 1 == isPro() &&
      ((i = $("<div />")
        .addClass("hn-story-icon hn-story-bookmark")
        .attr("id", "profile_bookmark")
        .appendTo(s)),
      null != getUserBookmarksIndex(app.user)
        ? ($("<div />")
            .css(
              "background-image",
              "url('" +
                getImageUrl("images/icon-bookmark-small-orange.png") +
                "')",
            )
            .appendTo(i),
          i.addClass("hn-story-bookmark-selected"))
        : $("<div />")
            .css(
              "background-image",
              "url('" + getImageUrl("images/icon-bookmark-small.png") + "')",
            )
            .appendTo(i),
      i.data("user_info", { name: app.user, about: "" }),
      i.on("click", function () {
        userBookmarkClick($(this));
      }))
    : "user" == t &&
      ((r = $("<div />")
        .addClass("hn-story-icon hn-story-edit")
        .attr("id", "profile_edit")
        .appendTo(s)),
      $("<div />")
        .css(
          "background-image",
          "url('" + getImageUrl("images/icon-edit.png") + "')",
        )
        .appendTo(r),
      r.on("click", function () {
        showDialog("edit_profile");
      }));
  var n = $("<div />").addClass("hn-profile-tabs").appendTo(a),
    e = $("<a />")
      .text("About")
      .attr("id", "profile_tab_user")
      .addClass("hn-profile-tab")
      .appendTo(n),
    o = $("<a />")
      .text("Stories")
      .attr("id", "profile_tab_submitted")
      .addClass("hn-profile-tab")
      .appendTo(n),
    i = $("<a />")
      .text("Comments")
      .attr("id", "profile_tab_threads")
      .addClass("hn-profile-tab")
      .appendTo(n),
    s = $("<a />")
      .text("Favorites")
      .attr("id", "profile_tab_favorites")
      .addClass("hn-profile-tab")
      .appendTo(n),
    r = $("<a />")
      .text("Upvoted")
      .attr("id", "profile_tab_upvoted")
      .addClass("hn-profile-tab")
      .appendTo(n),
    n = $("<a />")
      .text("Hidden")
      .attr("id", "profile_tab_hidden")
      .addClass("hn-profile-tab")
      .appendTo(n);
  e.attr("href", "user?id=" + app.user),
    o.attr("href", "submitted?id=" + app.user),
    i.attr("href", "threads?id=" + app.user),
    s.attr("href", "favorites?id=" + app.user),
    r.attr("href", "upvoted?id=" + app.user),
    n.attr("href", "hidden"),
    app.user != getUsername() && (r.hide(), n.hide()),
    selectProfileTab(t, !1),
    $(".hn-profile-tabs a").on("click", function () {
      selectProfileTab($(this).attr("id").split("_")[2]);
    }),
    $("<div />")
      .attr("id", "hn_switcher_wrap")
      .addClass("hn-switcher-wrap hn-switcher-profile-wrap")
      .appendTo(a),
    drawSwitcher(),
    $("#hn_header_title span").text(app.user);
}
function loadProfileInfo(e) {
  userHoverUsername = e;
  for (var t = null, a = 0; a < userHoverCache.length; a++)
    if (userHoverCache[a].name == e) {
      t = a;
      break;
    }
  null == t
    ? (userHoverCache.push({
        name: e,
        created: null,
        karma: null,
        about: null,
        loaded: !1,
      }),
      $.ajax({
        url: "https://hacker-news.firebaseio.com/v0/user/" + e + ".json",
        type: "GET",
        data: {},
        timeout: 15e3,
        dataType: "json",
        success: function (e) {
          if (void 0 !== e.created) {
            for (var t = null, a = 0; a < userHoverCache.length; a++)
              if (userHoverCache[a].name == e.id) {
                t = a;
                break;
              }
            null != t &&
              ((userHoverCache[t].created = e.created),
              (userHoverCache[t].karma = e.karma),
              (userHoverCache[t].about = e.about),
              (userHoverCache[t].loaded = !0),
              e.id == userHoverUsername &&
                drawProfileInfo((t = userHoverCache.length - 1)));
          } else $("#profile_info").text("Error loading profile.");
        },
      }))
    : 1 == userHoverCache[t].loaded && drawProfileInfo(t);
}
function drawProfileInfo(e) {
  var t = userHoverCache[e],
    e =
      "Joined <a href='https://news.ycombinator.com/front?day=" +
      getISODate(t.created) +
      "&birth=" +
      t.name +
      "' title='" +
      getFormattedDate(t.created) +
      "'>" +
      getOldness(t.created) +
      " ago</a> <span>&bull;</span> " +
      commaSeparateNumber(t.karma) +
      " Karma";
  $("#profile_info .hn-profile-info-text").html(e),
    $("#profile_bookmark").data("user_info", {
      name: app.user,
      about: t.about,
    });
}
function updateProfileBookmarkButton() {
  var e = $("#profile_bookmark");
  0 != e.length &&
    (null != getUserBookmarksIndex(app.user)
      ? ($("div", e)
          .css(
            "background-image",
            "url('" +
              getImageUrl("images/icon-bookmark-small-orange.png") +
              "')",
          )
          .appendTo(e),
        e.addClass("hn-story-bookmark-selected"))
      : ($("div", e)
          .css(
            "background-image",
            "url('" + getImageUrl("images/icon-bookmark-small.png") + "')",
          )
          .appendTo(e),
        e.removeClass("hn-story-bookmark-selected")));
}
function selectProfileTab(e, t) {
  t = void 0 === t || t;
  $(".hn-profile-tab").removeClass("hn-profile-tab-selected");
  t = getSectionFromUrl();
  "favorite_comments" == t
    ? (e = "favorites")
    : "upvoted_comments" == t && (e = "upvoted"),
    $("#profile_tab_" + e).addClass("hn-profile-tab-selected");
}
function parseStories() {
  (app.stories = []),
    (app.user = null),
    parseUser(),
    $("#hnmain .athing").each(function (e) {
      parseStoriesItem($(this));
    }),
    (app.more_link = $("#hnmain .morelink").first().attr("href"));
}
function parseStoriesItem(e) {
  var t = e.next(),
    a = "Flag",
    o = $(".subtext a:textEquals('flag')", e.next()).first().attr("href");
  null == o &&
    ((o = $(".subtext a:textEquals('unflag')", e.next()).first().attr("href")),
    (a = "Unflag"));
  var s = "Hide",
    n = $(".subtext a:textEquals('hide')", e.next()).first().attr("href");
  null == n &&
    ((n = $(".subtext a:textEquals('un-hide')", e.next()).first().attr("href")),
    (s = "Unhide"));
  var i = !1;
  $(".votelinks a[id^='up_']", e).first().hasClass("nosee") && (i = !0);
  var r = !1;
  $(".votelinks a[id^='down_']", e).first().hasClass("nosee") && (r = !0);
  var d = $(".votelinks a[id^='up_']", e).first().attr("href"),
    l = $(".votelinks a[id^='down_']", e).first().attr("href"),
    p = $(".subtext a[id^='un_']", e.next()).first().attr("href");
  null != d &&
    $(".votelinks a[id^='up_']", e).first().hasClass("nosee") &&
    (d = void 0),
    null != l &&
      $(".votelinks a[id^='down_']", e).first().hasClass("nosee") &&
      (l = void 0);
  var m = "0 comments";
  1 < $("a[href^='item']", t).length &&
    (m = $("a[href^='item']", t).last().text());
  var u = $(".titlelink", e).first().text(),
    g = $(".titlelink", e).first().attr("href");
  (null != u && 0 != u.length) || (u = $(".titleline a", e).first().text()),
    null == (g = null == g ? $(".titleline a", e).first().attr("href") : g) &&
      (g = ""),
    app.stories.push({
      id: e.attr("id"),
      number: $(".rank", e).first().text(),
      title: u,
      url: g,
      domain: $(".sitestr", e).first().text(),
      user: $(".hnuser", t).first().text(),
      score: $(".score", t).first().text(),
      age: $(".age", t).first().attr("title"),
      oldness: $(".age a", t).first().text(),
      comments: m,
      edit: $("a[href^='edit']", t).last().text(),
      hide_link: n,
      hide_title: s,
      flag_link: o,
      flag_title: a,
      upvoted: i,
      downvoted: r,
      vote_link: d,
      down_link: l,
      unvote_link: p,
    });
}
function drawSwitcher() {
  var e,
    t,
    a,
    o,
    s,
    n = getSectionFromUrl(),
    i = $("#hn_switcher_wrap").html(""),
    r = $("#hn_page_header_controls").html("");
  ("favorites" != n &&
    "favorite_comments" != n &&
    "upvoted" != n &&
    "upvoted_comments" != n) ||
  null == app.user
    ? "ask" == n || "asknew" == n
      ? ((a = $("<div />").addClass("hn-switcher").appendTo(r)),
        (e = $("<a />").text("Top").attr("href", "/ask").appendTo(a)),
        (t = $("<a />").text("New").attr("href", "/asknew").appendTo(a)),
        ("ask" == n ? e : t).addClass("hn-switcher-selected"))
      : "show" == n || "shownew" == n
        ? ((a = $("<div />").addClass("hn-switcher").appendTo(r)),
          (e = $("<a />").text("Top").attr("href", "/show").appendTo(a)),
          (t = $("<a />").text("New").attr("href", "/shownew").appendTo(a)),
          ("show" == n ? e : t).addClass("hn-switcher-selected"))
        : "newest" == n || "newcomments" == n
          ? ((a = $("<div />").addClass("hn-switcher").appendTo(r)),
            (o = $("<a />")
              .text("Stories")
              .attr("href", "/newest")
              .appendTo(a)),
            (s = $("<a />")
              .text("Comments")
              .attr("href", "/newcomments")
              .appendTo(a)),
            ("newest" == n ? o : s).addClass("hn-switcher-selected"))
          : "best" == n || "bestcomments" == n
            ? ((a = $("<div />").addClass("hn-switcher").appendTo(r)),
              (o = $("<a />")
                .text("Stories")
                .attr("href", "/best")
                .appendTo(a)),
              (s = $("<a />")
                .text("Comments")
                .attr("href", "/bestcomments")
                .appendTo(a)),
              ("best" == n ? o : s).addClass("hn-switcher-selected"))
            : ("noobstories" != n && "noobcomments" != n) ||
              ((a = $("<div />").addClass("hn-switcher").appendTo(r)),
              (o = $("<a />")
                .text("Stories")
                .attr("href", "/noobstories")
                .appendTo(a)),
              (s = $("<a />")
                .text("Comments")
                .attr("href", "/noobcomments")
                .appendTo(a)),
              ("noobstories" == n ? o : s).addClass("hn-switcher-selected"))
    : ((a = $("<div />").addClass("hn-switcher").appendTo(i)),
      (o = $("<a />").text("Stories").appendTo(a)),
      (s = $("<a />").text("Comments").appendTo(a)),
      "favorites" == n || "favorite_comments" == n
        ? (o.attr("href", "favorites?id=" + app.user),
          s.attr("href", "favorites?id=" + app.user + "&comments=t"))
        : (o.attr("href", "upvoted?id=" + app.user),
          s.attr("href", "upvoted?id=" + app.user + "&comments=t")),
      "favorites" == n || "upvoted" == n
        ? o.addClass("hn-switcher-selected")
        : ("favorite_comments" != n && "upvoted_comments" != n) ||
          s.addClass("hn-switcher-selected")),
    $(".hn-switcher a")
      .off("click")
      .on("click", function () {
        $(".hn-switcher-selected").removeClass("hn-switcher-selected"),
          $(this).addClass("hn-switcher-selected");
      });
}
function drawStories() {
  $("#hnmain, center").hide(),
    $("#hnmain .athing, #hnmain .morelink, .hn-items, #hn_content").remove();
  var e = $("<div />")
      .attr("id", "hn_content")
      .addClass("hn-content")
      .insertAfter("#hn_header"),
    t = $("<div />").addClass("hn-items").appendTo(e),
    a = getSectionFromUrl(),
    o = drawPageHeader();
  "top" == a || "front" == a
    ? drawFrontControls()
    : ("submitted" != a &&
          "threads" != a &&
          "favorites" != a &&
          "upvoted" != a &&
          "hidden" != a) ||
        null == app.user
      ? "from" == a
        ? ((h = $("<div />").addClass("hn-items-header").appendTo(t)),
          (g = new URLSearchParams(window.location.search).get("site")),
          $("<div />")
            .addClass("hn-items-heading")
            .css("display", "block")
            .css("padding-bottom", "0px")
            .text("From")
            .appendTo(h),
          $("<a />")
            .addClass("hn-items-subheading")
            .text(g)
            .attr("href", "https://" + g)
            .appendTo(h))
        : ("ask" != a &&
            "asknew" != a &&
            "show" != a &&
            "shownew" != a &&
            "newest" != a &&
            "best" != a &&
            "noobstories" != a) ||
          ((o = $("<div />")
            .addClass("hn-items-header hn-items-header-left")
            .appendTo(t)),
          $("<div />")
            .attr("id", "hn_switcher_wrap")
            .addClass("hn-switcher-wrap")
            .appendTo(o),
          drawSwitcher())
      : (drawProfileHeader(),
        ("favorites" != a && "upvoted" != a) || drawSwitcher());
  var s = !1,
    n = app.settings.table_new,
    i = app.settings.list_new;
  if ((0 == isPro() && (i = n = !1), "table" == app.settings.stories_view)) {
    $("#hn_page_header").addClass("hn-page-header-compact");
    var r = $("<table />").addClass("hn-items-table").appendTo(t),
      d = $("<tr />").appendTo(r),
      l = $("<td />").addClass("hn-items-td-number hn-items-td-heading"),
      p = $("<td />")
        .addClass("hn-items-td-points hn-items-td-heading")
        .text("Points"),
      m = $("<td />")
        .addClass("hn-items-td-link hn-items-td-heading")
        .text("Link"),
      u = $("<td />")
        .addClass("hn-items-td-user hn-items-td-heading")
        .text("User"),
      e = $("<td />")
        .addClass("hn-items-td-age hn-items-td-heading")
        .text("Age"),
      g = $("<td />")
        .addClass("hn-items-td-comments hn-items-td-heading")
        .text("Replies"),
      h = $("<td />").addClass("hn-items-td-heading"),
      o = $("<td />").addClass("hn-items-td-heading");
    1 == app.settings.table_number && l.appendTo(d),
      1 == app.settings.table_points && p.appendTo(d),
      m.appendTo(d),
      1 == app.settings.table_user && u.appendTo(d),
      1 == app.settings.table_age && e.appendTo(d),
      1 == app.settings.table_replies && g.appendTo(d),
      1 == n && h.appendTo(d),
      o.appendTo(d);
    for (var c = 0; c < app.stories.length; c++) {
      var f = $("<tr />")
          .addClass("hn-item-row hn-item-row-compact")
          .attr("id", app.stories[c].id)
          .appendTo(r),
        v = $("<td />").addClass("hn-items-td-number"),
        k = $("<td />").addClass("hn-items-td-points"),
        b = $("<td />").addClass("hn-items-td-link"),
        w = $("<td />").addClass("hn-items-td-user"),
        _ = $("<td />").addClass("hn-items-td-age"),
        y = $("<td />").addClass("hn-items-td-comments"),
        T = $("<td />").addClass("hn-items-td-new"),
        C = $("<td />").addClass("hn-items-td-controls");
      1 == app.settings.table_number && v.appendTo(f),
        1 == app.settings.table_points && k.appendTo(f),
        b.appendTo(f),
        1 == app.settings.table_user && w.appendTo(f),
        1 == app.settings.table_age && _.appendTo(f),
        1 == app.settings.table_replies && y.appendTo(f),
        1 == n && T.appendTo(f),
        C.appendTo(f),
        y.on("mouseenter", function () {
          $(this).addClass("hn-items-td-hover");
        }),
        y.on("mouseleave", function () {
          $(this).removeClass("hn-items-td-hover");
        }),
        k.on("mouseenter", function () {
          $(this).addClass("hn-items-td-hover");
        }),
        k.on("mouseleave", function () {
          $(this).removeClass("hn-items-td-hover");
        }),
        $("<div />")
          .addClass("hn-item-number-table")
          .text(app.stories[c].number)
          .appendTo(v);
      v = parseInt(app.stories[c].comments);
      isNaN(v) && (v = 0);
      y = $("<a />")
        .text(v)
        .attr(
          "href",
          "https://news.ycombinator.com/item?id=" + app.stories[c].id,
        )
        .appendTo(y);
      $("<div />")
        .addClass("hn-item-new-dot")
        .attr("id", "item_dot_" + app.stories[c].id)
        .appendTo(y);
      y = parseInt(app.stories[c].score);
      isNaN(y) && (y = 0),
        $("<a />")
          .text(y)
          .attr(
            "href",
            "https://news.ycombinator.com/item?id=" + app.stories[c].id,
          )
          .appendTo(k),
        (P = $("<div />")
          .addClass("hn-item hn-item-compact")
          .attr("id", app.stories[c].id)
          .appendTo(b)).addClass("hn-item-no-number");
      var x = $("<a />")
        .addClass("hn-item-title hn-item-title-compact")
        .text(app.stories[c].title)
        .attr("href", app.stories[c].url)
        .appendTo(P);
      (("table" == app.settings.stories_view &&
        1 == app.settings.table_title_bold) ||
        ("list" == app.settings.stories_view &&
          1 == app.settings.list_title_bold)) &&
        x.addClass("hn-item-title-bold"),
        $("<a />")
          .addClass("hn-item-user hn-item-user-compact hn-user-link")
          .attr("data-username", app.stories[c].user)
          .attr("href", "/user?id=" + app.stories[c].user)
          .text(app.stories[c].user)
          .appendTo(w),
        $("<a />")
          .attr(
            "href",
            "https://news.ycombinator.com/item?id=" + app.stories[c].id,
          )
          .addClass("hn-item-new hn-item-new-compact")
          .prependTo(T),
        0 < app.stories[c].domain.length &&
          "jobs" != a &&
          1 == app.settings.table_domain &&
          ((T =
            "<div class='hn-item-domain'>(" +
            app.stories[c].domain +
            ")</div>"),
          $("<div />").addClass("hn-item-domain-inline-spacer").appendTo(x),
          $("<div />").addClass("hn-item-domain-inline").html(T).appendTo(x)),
        1 == app.settings.new_tab &&
          -1 == app.stories[c].url.indexOf("item?id=") &&
          x.attr("target", "_blank");
      $("<div />")
        .addClass("hn-item-oldness-compact")
        .text(
          app.stories[c].oldness
            .replace(" ago", "")
            .replace("minutes", "mins")
            .replace("on ", ""),
        )
        .attr("title", app.stories[c].age)
        .appendTo(_);
      var S = $("<div />")
          .addClass("hn-item-icons hn-item-icons-list")
          .attr("id", "story_icons_" + c)
          .appendTo(C),
        I = $("<div />")
          .addClass("hn-story-icon hn-story-upvote")
          .attr("id", "story_upvote_" + c)
          .data("story_index", c)
          .appendTo(S);
      1 == app.stories[c].upvoted
        ? ($("<div />")
            .css(
              "background-image",
              "url('" +
                getImageUrl("images/icon-arrow-up-small-orange.png") +
                "')",
            )
            .appendTo(I),
          I.addClass("hn-story-upvote-selected"))
        : null != app.stories[c].vote_link
          ? $("<div />")
              .css(
                "background-image",
                "url('" + getImageUrl("images/icon-arrow-up-small.png") + "')",
              )
              .appendTo(I)
          : I.hide(),
        I.on("click", function () {
          storyListVoteClick($(this));
        }),
        null != app.stories[c].down_link &&
          ((N = $("<div />")
            .addClass("hn-story-icon hn-story-downvote")
            .attr("id", "story_downvote")
            .data("story_index", c)
            .appendTo(S)),
          1 == app.stories[c].downvoted
            ? ($("<div />")
                .css(
                  "background-image",
                  "url('" +
                    getImageUrl("images/icon-arrow-up-small-orange.png") +
                    "')",
                )
                .appendTo(N),
              N.addClass("hn-story-upvote-selected"))
            : null != app.stories[c].down_link
              ? $("<div />")
                  .css(
                    "background-image",
                    "url('" +
                      getImageUrl("images/icon-arrow-up-small.png") +
                      "')",
                  )
                  .appendTo(N)
              : N.hide(),
          N.on("click", function () {
            storyListDownVoteClick($(this));
          })),
        (null == app.stories[c].hide_link &&
          null == app.stories[c].flag_link) ||
          ((O = $("<div />")
            .addClass("hn-story-icon hn-story-dots")
            .attr("id", "story_dots_" + c)
            .data("story_index", c)
            .appendTo(S)),
          $("<div />")
            .css(
              "background-image",
              "url('" + getImageUrl("images/icon-dots-thin.png") + "')",
            )
            .appendTo(O),
          O.on("click", function () {
            var e = parseInt($(this).data("story_index"));
            showMenu(
              "story_list_dots",
              "story_dots_" + (currentMenuStoryIndex = e),
            ),
              $("#story_icons_" + e).addClass("hn-item-icons-active");
          })),
        $(".hn-story-icon", S).on("mousedown", function () {
          $(this).addClass("hn-story-icon-down");
        });
    }
  } else
    for (c = 0; c < app.stories.length; c++) {
      var P = $("<div />")
        .addClass("hn-item")
        .attr("id", app.stories[c].id)
        .appendTo(t);
      0 < app.stories[c].number.length && 1 == app.settings.list_number
        ? ($("<div />")
            .addClass("hn-item-number")
            .text(app.stories[c].number)
            .appendTo(P),
          (s = !0))
        : P.addClass("hn-item-no-number");
      x = $("<a />")
        .addClass("hn-item-title")
        .text(app.stories[c].title)
        .attr("href", app.stories[c].url)
        .appendTo(P);
      1 == app.settings.new_tab &&
        -1 == app.stories[c].url.indexOf("item?id=") &&
        x.attr("target", "_blank"),
        (("table" == app.settings.stories_view &&
          1 == app.settings.table_title_bold) ||
          ("list" == app.settings.stories_view &&
            1 == app.settings.list_title_bold)) &&
          x.addClass("hn-item-title-bold");
      var H,
        U = [];
      0 < app.stories[c].domain.length &&
        "jobs" != a &&
        1 == app.settings.list_domain &&
        U.push(
          "<a href='https://news.ycombinator.com/from?site=" +
            app.stories[c].domain +
            "' class='hn-item-domain'>" +
            app.stories[c].domain +
            "</a>",
        ),
        1 == app.settings.list_points &&
          0 < app.stories[c].score.length &&
          U.push(
            "<a href='https://news.ycombinator.com/item?id=" +
              app.stories[c].id +
              "' class='hn-item-score' title='" +
              app.stories[c].age +
              "'>" +
              app.stories[c].score +
              "</a>",
          ),
        1 == app.settings.list_user &&
          0 < app.stories[c].user.length &&
          U.push(
            "<a href='https://news.ycombinator.com/user?id=" +
              app.stories[c].user +
              "' class='hn-item-user hn-user-link' data-username='" +
              app.stories[c].user +
              "'>" +
              app.stories[c].user +
              "</a>",
          ),
        1 == app.settings.list_age &&
          U.push(
            "<a href='https://news.ycombinator.com/item?id=" +
              app.stories[c].id +
              "' class='hn-item-age' title='" +
              app.stories[c].age +
              "'>" +
              app.stories[c].oldness +
              "</a>",
          ),
        0 < app.stories[c].edit.length &&
          U.push(
            "<a href='https://news.ycombinator.com/edit?id=" +
              app.stories[c].id +
              "'>edit</a>",
          ),
        1 == app.settings.list_replies
          ? ((H =
              "<a href='https://news.ycombinator.com/item?id=" +
              app.stories[c].id +
              "' class='hn-item-oldness'>" +
              app.stories[c].comments +
              "</a>"),
            1 == i &&
              (H +=
                " <a href='https://news.ycombinator.com/item?id=" +
                app.stories[c].id +
                "' class='hn-item-new'></a>"),
            U.push(H))
          : 1 == i && U.push("<b class='hn-item-new'></b>");
      for (var D = "", M = 0; M < U.length; M++)
        (D += U[M]), M < U.length - 1 && (D += " <span>&bull;</span> ");
      $("<div />").addClass("hn-item-info").html(D).appendTo(P);
      var N,
        O,
        S = $("<div />")
          .addClass("hn-item-icons hn-item-icons-list")
          .attr("id", "story_icons_" + c)
          .appendTo(P),
        I = $("<div />")
          .addClass("hn-story-icon hn-story-upvote")
          .attr("id", "story_upvote_" + c)
          .data("story_index", c)
          .appendTo(S);
      1 == app.stories[c].upvoted
        ? ($("<div />")
            .css(
              "background-image",
              "url('" +
                getImageUrl("images/icon-arrow-up-small-orange.png") +
                "')",
            )
            .appendTo(I),
          I.addClass("hn-story-upvote-selected"))
        : null != app.stories[c].vote_link
          ? $("<div />")
              .css(
                "background-image",
                "url('" + getImageUrl("images/icon-arrow-up-small.png") + "')",
              )
              .appendTo(I)
          : I.hide(),
        I.on("click", function () {
          storyListVoteClick($(this));
        }),
        null != app.stories[c].down_link &&
          ((N = $("<div />")
            .addClass("hn-story-icon hn-story-downvote")
            .attr("id", "story_downvote")
            .data("story_index", c)
            .appendTo(S)),
          1 == app.stories[c].downvoted
            ? ($("<div />")
                .css(
                  "background-image",
                  "url('" +
                    getImageUrl("images/icon-arrow-up-small-orange.png") +
                    "')",
                )
                .appendTo(N),
              N.addClass("hn-story-upvote-selected"))
            : null != app.stories[c].down_link
              ? $("<div />")
                  .css(
                    "background-image",
                    "url('" +
                      getImageUrl("images/icon-arrow-up-small.png") +
                      "')",
                  )
                  .appendTo(N)
              : N.hide(),
          N.on("click", function () {
            storyListDownVoteClick($(this));
          })),
        (null == app.stories[c].hide_link &&
          null == app.stories[c].flag_link) ||
          ((O = $("<div />")
            .addClass("hn-story-icon hn-story-dots")
            .attr("id", "story_dots_" + c)
            .data("story_index", c)
            .appendTo(S)),
          $("<div />")
            .css(
              "background-image",
              "url('" + getImageUrl("images/icon-dots-thin.png") + "')",
            )
            .appendTo(O),
          O.on("click", function () {
            var e = parseInt($(this).data("story_index"));
            showMenu(
              "story_list_dots",
              "story_dots_" + (currentMenuStoryIndex = e),
            ),
              $("#story_icons_" + e).addClass("hn-item-icons-active");
          })),
        $(".hn-story-icon", S).on("mousedown", function () {
          $(this).addClass("hn-story-icon-down");
        });
    }
  null != app.more_link &&
    ((d = $("<div />").addClass("hn-items-more-wrap").appendTo(t)),
    (d = $("<a />")
      .addClass("hn-items-more")
      .text("More")
      .attr("href", app.more_link)
      .appendTo(d)),
    0 == s && d.addClass("hn-items-more-no-numbers")),
    0 == isPro() && insertProButton(),
    enableTooltips(),
    applyStyles();
}
function insertProButton() {
  $("#pro_button_bottom").remove();
  var e = $("<div />")
    .attr("id", "pro_button_bottom")
    .addClass("settings-row-more settings-row-pro pro-button-bottom")
    .html(
      "<i></i><b></b>Unlock Modern <u>Pro</u><span>More awesome features...</span><div></div>",
    );
  e.insertAfter("#hn_content"),
    e.on("click", function () {
      showUpgradeDialog();
    });
}
function updateNewComments() {
  if (($("#nav_comments_wrap").hide(), 1 == onListPage())) {
    if (null != app.stories)
      for (var e = 0; e < app.stories.length; e++) {
        var t = app.stories[e].id,
          a = getHistoryIndex(t),
          o = "",
          s = "";
        0 < (i = getNewCommentsCount(e)) &&
          ((o = "<b>" + i + " new</b>"),
          (s = "Since " + getOldness(app.history[a].timestamp, !0))),
          $("#" + t + " .hn-item-new")
            .html(o)
            .attr("title", s),
          0 < i
            ? ($("#item_dot_" + t).addClass("hn-item-new-dot-show"),
              $("#item_dot_" + t)
                .parent()
                .attr("title", s))
            : ($("#item_dot_" + t).removeClass("hn-item-new-dot-show"),
              $("#item_dot_" + t)
                .parent()
                .attr("title", ""));
      }
  } else if (1 == onItemPage()) {
    var n = null,
      i = 0;
    if (
      null !=
      (n =
        null != (a = getHistoryIndex(app.story.id))
          ? app.history[a].last_comment_id
          : n)
    )
      for (e = 0; e < app.story.comments.length; e++)
        parseInt(app.story.comments[e].id) > parseInt(n) &&
          ($("#" + app.story.comments[e].id).addClass("hn-comment-highlight"),
          i++);
    $("#comments_new_count span").text(i + " new"),
      0 < i && 1 == isPro()
        ? ($("#nav_comments_wrap").show(),
          $("#comments_new_count").addClass("hn-comments-new-count-visible"))
        : ($("#nav_comments_wrap").hide(),
          $("#comments_new_count").removeClass(
            "hn-comments-new-count-visible",
          )),
      markStoryAsRead(!1);
  }
}
function getHistoryIndex(e) {
  for (var t = null, a = 0; a < app.history.length; a++)
    if (parseInt(app.history[a].id) == parseInt(e)) {
      t = a;
      break;
    }
  return t;
}
function getNewCommentsCount(e) {
  var t = 0,
    a = getHistoryIndex(app.stories[e].id);
  return (
    null != a &&
      ((e = parseInt(app.stories[e].comments)),
      null != (e = isNaN(e) ? null : e) &&
        e > app.history[a].total_comments &&
        (t = e - app.history[a].total_comments)),
    t
  );
}
function drawFrontControls() {
  getSectionFromUrl();
  var e = $("#hn_content");
  $("#hn_page_header").remove();
  var t = $("<div />")
      .attr("id", "hn_page_header")
      .addClass("hn-page-header hn-page-header-front")
      .prependTo(e),
    a = Math.round(new Date().getTime() / 1e3),
    o = DateTime.fromSeconds(a),
    e = new URLSearchParams(window.location.search),
    a = o.toJSDate();
  e.has("day") && ((a = e.get("day")), (o = DateTime.fromISO(a)));
  (e = o.toFormat("cccc")),
    (a = o.toFormat("d LLLL")),
    (o = o.toFormat("y")),
    (o = $("<div />")
      .attr("id", "hn_front_date")
      .addClass("hn-front-date")
      .html(
        "<div><span class='hn-front-date-day'>" +
          e +
          "</span><span class='hn-front-date-month'>" +
          a +
          "</span><span class='hn-front-date-year'>" +
          o +
          "</span></div><i></i>",
      )
      .prependTo(t));
  1 == isPro() &&
    $("i", o).css(
      "background-image",
      "url('" + getImageUrl("images/icon-chevron-down-thin.png") + "')",
    ),
    o.on("click", function () {
      0 != isPro() && showMenu("front_date", "hn_front_date");
    }),
    addListIcons(t);
}
function addListIcons(e) {
  (e = $("<div />").addClass("hn-list-icons").appendTo(e)),
    (e = $("<div />")
      .addClass("hn-story-icon hn-story-bookmark")
      .attr("id", "list_dots")
      .appendTo(e));
  $("<div />")
    .css(
      "background-image",
      "url('" + getImageUrl("images/icon-dots-thin.png") + "')",
    )
    .appendTo(e),
    e.on("click", function () {
      showMenu("list_dots", "list_dots");
    });
}
function drawPageHeader() {
  var e = getSectionFromUrl(),
    t = $("#hn_content");
  $("#hn_page_header").remove();
  var a = "";
  if (
    ("ask" == e || "asknew" == e
      ? (a = "Ask HN")
      : "show" == e || "shownew" == e
        ? (a = "Show HN")
        : "best" == e || "bestcomments" == e
          ? (a = "Best")
          : "newest" == e || "newcomments" == e
            ? (a = "New")
            : "noobstories" == e || "noobcomments" == e
              ? (a = "Noob")
              : "active" == e
                ? (a = "Active")
                : "pool" == e
                  ? (a = "Second-Chance Pool")
                  : "jobs" == e
                    ? (a = "Jobs")
                    : "launches" == e
                      ? (a = "Launches")
                      : "leaders" == e && (a = "Leaders"),
    "" == a)
  )
    return o;
  var o = $("<div />")
    .attr("id", "hn_page_header")
    .addClass("hn-page-header")
    .prependTo(t);
  $("<div />").addClass("hn-page-heading").text(a).prependTo(o),
    $("<div />")
      .attr("id", "hn_page_header_controls")
      .addClass("hn-page-header-controls")
      .appendTo(o);
  return (
    -1 ==
      [
        "leaders",
        "jobs",
        "bestcomments",
        "newcomments",
        "noobcomments",
      ].indexOf(e) && addListIcons(o),
    o
  );
}
function storyListVoteClick(e) {
  var t;
  requestTooQuick() ||
    (0 != isLoggedIn()
      ? ((t = parseInt(e.data("story_index"))),
        0 == app.stories[t].upvoted
          ? ((app.stories[t].upvoted = !0),
            e.addClass("hn-story-upvote-selected"),
            $("div", e).css(
              "background-image",
              "url('" +
                getImageUrl("images/icon-arrow-up-small-orange.png") +
                "')",
            ),
            doStoryListVote(t, app.stories[t].vote_link))
          : null != app.stories[t].unvote_link
            ? ((app.stories[t].upvoted = !1),
              e.removeClass("hn-story-upvote-selected"),
              $("div", e).css(
                "background-image",
                "url('" + getImageUrl("images/icon-arrow-up-small.png") + "')",
              ),
              doStoryListVote(t, app.stories[t].unvote_link))
            : alert("Unvote is disabled one hour after voting."),
        (app.bookmarks.stories_upvoted.updated = 0),
        saveBookmarks())
      : showDialog("login"));
}
function storyListDownVoteClick(e) {
  var t;
  requestTooQuick() ||
    (0 != isLoggedIn()
      ? ((t = parseInt(e.data("story_index"))),
        0 == app.stories[t].downvoted
          ? ((app.stories[t].downvoted = !0),
            e.addClass("hn-story-upvote-selected"),
            $("div", e).css(
              "background-image",
              "url('" +
                getImageUrl("images/icon-arrow-up-small-orange.png") +
                "')",
            ),
            doStoryListVote(t, app.stories[t].down_link))
          : null != app.stories[t].unvote_link
            ? ((app.stories[t].downvoted = !1),
              e.removeClass("hn-story-upvote-selected"),
              $("div", e).css(
                "background-image",
                "url('" + getImageUrl("images/icon-arrow-up-small.png") + "')",
              ),
              doStoryListVote(t, app.stories[t].unvote_link))
            : alert("Unvote is disabled one hour after voting."),
        (app.bookmarks.stories_upvoted.updated = 0),
        saveBookmarks())
      : showDialog("login"));
}
function doStoryListVote(e, t) {
  var a = new URL(t, location).searchParams,
    t =
      "vote?id=" +
      a.get("id") +
      "&how=" +
      a.get("how") +
      "&auth=" +
      a.get("auth") +
      "&goto=" +
      encodeURIComponent(a.get("goto")) +
      "&js=t";
  (app.stories[e].unvote_link =
    "vote?id=" +
    a.get("id") +
    "&how=un&auth=" +
    a.get("auth") +
    "&goto=" +
    encodeURIComponent(a.get("goto")) +
    "&js=t"),
    (app.bookmarks.stories_upvoted.updated = 0),
    saveBookmarks(),
    sendRequest(t);
}
function parseStory() {
  app.story = {};
  var e = new URLSearchParams(window.location.search);
  (app.story.id = e.get("id")),
    (app.story.title = $(".titlelink").first().text()),
    (app.story.url = $(".titlelink").first().attr("href")),
    (app.story.domain = $(".sitestr").first().text()),
    (null != app.story.title && 0 != app.story.title.length) ||
      (app.story.title = $(".titleline a").first().text()),
    null == app.story.url &&
      (app.story.url = $(".titleline a").first().attr("href")),
    null == app.story.url && (app.story.url = ""),
    (app.story.hmac = $("input[name='hmac']").first().attr("value")),
    (app.story.textarea = $("form textarea").first().val()),
    (app.story.title_input = $(".itemform input[name='title']").first().val()),
    (app.story.url_input = $(".itemform input[name='url']").first().val()),
    (app.story.text = void 0);
  e = $(".fatitem tr").eq(3).find("td").eq(1);
  0 < e.length &&
    (e.find("form").remove(), (app.story.text = $.trim(e.html()))),
    (app.story.score = $(".subtext .score").first().text()),
    (app.story.user = $(".subtext .hnuser").first().text()),
    (app.story.age = $(".subtext .age").first().attr("title")),
    (app.story.oldness = $(".subtext .age a").first().text()),
    (app.story.total_comments = parseInt($(".subtext a").last().text())),
    isNaN(app.story.total_comments) && (app.story.total_comments = 0),
    (app.story.past_link = $(".subtext a:textEquals('past')")
      .first()
      .attr("href")),
    (app.story.flag_title = "Flag"),
    (app.story.flag_link = $(".subtext a:textEquals('flag')")
      .first()
      .attr("href")),
    null == app.story.flag_link &&
      ((app.story.flag_link = $(".subtext a:textEquals('unflag')")
        .first()
        .attr("href")),
      (app.story.flag_title = "Unflag")),
    (app.story.hide_title = "Hide"),
    (app.story.hide_link = $(".subtext a:textEquals('hide')")
      .first()
      .attr("href")),
    null == app.story.hide_link &&
      ((app.story.hide_link = $(".subtext a:textEquals('un-hide')")
        .first()
        .attr("href")),
      (app.story.hide_title = "Unhide")),
    (app.story.edit_link = $(".subtext a:textEquals('edit')")
      .first()
      .attr("href")),
    (app.story.delete_link = $(".subtext a:textEquals('delete')")
      .first()
      .attr("href")),
    (app.story.upvoted = !1),
    $(".votelinks a[id^='up_']").first().hasClass("nosee") &&
      (app.story.upvoted = !0),
    (app.story.vote_link = $(".votelinks a[id^='up_']").first().attr("href")),
    (app.story.unvote_link = $(".subtext a[id^='un_']").first().attr("href")),
    (app.story.faved = !1),
    0 < $(".subtext a:textEquals('un‑favorite')").length &&
      (app.story.faved = !0),
    (app.story.fav_link = $(".subtext a[href^='fave']").first().attr("href")),
    parseComments();
}
function parseComments() {
  null == app.story && (app.story = {}), (app.story.comments = []);
  var T = 0;
  (app.more_link = $(".morelink").first().attr("href")),
    $(".athing").each(function (e) {
      var t,
        a,
        o,
        s,
        n,
        i,
        r,
        d,
        l,
        p,
        m,
        u,
        g,
        h,
        c,
        f,
        v,
        k,
        b,
        w,
        _,
        y = $(".commtext", this).first().html();
      (null == y && null == (y = $.trim($(".comment", this).text()))) ||
        ((y = 0 < (_ = y.split("<div")).length ? _[0] : y).indexOf("<p>"),
        (t = $(this).attr("id")),
        parseInt(t) > T && (T = parseInt(t)),
        (a = $(".navs a:contains('root')", this).first().attr("href")),
        (o = $(".navs a:contains('parent')", this).first().attr("href")),
        (s = $(".navs a:contains('prev')", this).first().attr("href")),
        (n = $(".navs a:contains('next')", this).first().attr("href")),
        (i = $(".navs a:contains('context')", this).first().attr("href")),
        (r = $(".onstory a", this).first().attr("href")),
        (d = $(".onstory a", this).first().text()),
        (l = $(".hnuser", this).first().text()),
        (p = parseInt($(".ind", this).attr("indent"))),
        isNaN(p) && (p = 0),
        0 != y.length &&
          ((m = !1),
          0 < $(".hnuser font[color='#3c963c']", this).length && (m = !0),
          (u = $(".votelinks a[id^='up_']", this).first().attr("href")),
          (g = $(".votelinks a[id^='down_']", this).first().attr("href")),
          (h = $(".comhead a[id^='un_']", this).first().attr("href")),
          null != u &&
            $(".votelinks a[id^='up_']", this).first().hasClass("nosee") &&
            (u = void 0),
          null != g &&
            $(".votelinks a[id^='down_']", this).first().hasClass("nosee") &&
            (g = void 0),
          (c = $(".comhead a[href^='delete-confirm']", this)
            .first()
            .attr("href")),
          (f = $(".comhead a[href^='edit']", this).first().attr("href")),
          (v = $(".comhead a[href^='flag']", this).first().attr("href")),
          (k = !1),
          "unvote" == $("#unv_" + t + " a").text() && (k = !0),
          (b = !1),
          "undown" == $("#unv_" + t + " a").text() && (b = !0),
          (w = 0),
          (_ = $(".commtext", this).first()).hasClass("c5a") && (w = 1),
          _.hasClass("c73") && (w = 2),
          _.hasClass("c82") && (w = 3),
          _.hasClass("c88") && (w = 4),
          _.hasClass("c9c") && (w = 5),
          _.hasClass("cae") && (w = 6),
          _.hasClass("cbe") && (w = 7),
          _.hasClass("cce") && (w = 8),
          _.hasClass("cdd") && (w = 9),
          app.story.comments.push({
            id: t,
            user: l,
            new_user: m,
            indent: p,
            age: $(".age", this).first().attr("title"),
            age_link: $(".age a", this).first().attr("href"),
            oldness: $(".age a", this).first().text(),
            rating: w,
            score: $(".comhead .score", this).first().text(),
            text: y,
            reply_link: $(".reply a", this).first().attr("href"),
            delete_link: c,
            edit_link: f,
            flag_link: v,
            root: a,
            parent: o,
            prev: s,
            next: n,
            context: i,
            on_link: r,
            on_title: d,
            upvoted: k,
            downvoted: b,
            vote_link: u,
            down_link: g,
            unvote_link: h,
            faved: !1,
            flagged: !1,
            auth_code: null,
          })));
    }),
    (app.story.last_comment_id = T = 0 == T ? null : T);
}
function drawProfileComments() {
  $("#hnmain, center").hide(), $(".fatitem, .comment-tree").remove();
  var e = $("<div />")
      .attr("id", "hn_content")
      .addClass("hn-content")
      .insertAfter("#hn_header"),
    t = getSectionFromUrl();
  "newcomments" != t &&
    "noobcomments" != t &&
    "bestcomments" != t &&
    drawProfileHeader(),
    ("newcomments" != t && "bestcomments" != t && "noobcomments" != t) ||
      (drawPageHeader(), drawSwitcher()),
    drawComments(e).addClass("hn-comments-profile");
}
function drawComments(e) {
  var t,
    a = $("<div />").addClass("hn-comments"),
    o = getSectionFromUrl();
  null != app.story.total_comments &&
    0 < app.story.title.length &&
    "edit" != o &&
    ((t = $("<div />")
      .addClass("hn-comments-title")
      .text(app.story.total_comments + " comments")
      .appendTo(a)),
    1 == isPro() &&
      $("<div />")
        .attr("id", "comments_new_count")
        .html("<span></span>")
        .addClass("hn-comments-new-count")
        .appendTo(t)
        .on("click", function () {
          goToNextNewComment();
        }));
  var s = !1;
  1 == onItemPage() &&
    0 == app.story.title.length &&
    (a.addClass("hn-comments-single"), (s = !0));
  for (var n = 0; n < app.story.comments.length; n++) {
    var i = $("<div />")
      .addClass("hn-comment")
      .data("comment_index", n)
      .attr("id", app.story.comments[n].id)
      .appendTo(a);
    i.on("mouseenter", function () {
      var e = parseInt($(this).data("comment_index"));
      1 == isCommentFaved(e) &&
        ($(".hn-story-bookmark", this).addClass("hn-story-bookmark-selected"),
        $(".hn-story-bookmark div", this).css(
          "background-image",
          "url('" + getImageUrl("images/icon-bookmark-small-orange.png") + "')",
        ),
        (app.story.comments[e].faved = !0));
    });
    var r = 0,
      d = app.story.comments[n].indent;
    1 == s && 0 < n && (d++, (r = 24)),
      i.data("indent", d).addClass("hn-comment-indent-" + d),
      0 < n && i.css("padding-left", 23 * d + r + "px"),
      1 == s && 0 == n && i.addClass("hn-comment-parent"),
      n == app.story.comments.length - 1 && i.addClass("hn-comment-last");
    var l = "hn-comment-info-user hn-user-link";
    (app.story.user != app.story.comments[n].user &&
      app.user != app.story.comments[n].user) ||
      (l += " hn-comment-info-user-op"),
      1 == app.story.comments[n].new_user && (l += " hn-comment-info-user-new");
    var p =
      "<a href='https://news.ycombinator.com/user?id=" +
      app.story.comments[n].user +
      "' class='" +
      l +
      "' data-username='" +
      app.story.comments[n].user +
      "'>" +
      app.story.comments[n].user +
      "</a> <span>&bull;</span> <a href='" +
      app.story.comments[n].age_link +
      "' class='hn-story-info-age' title='" +
      app.story.comments[n].age +
      "'>" +
      app.story.comments[n].oldness +
      "</a>";
    null != app.story.comments[n].score &&
      0 < app.story.comments[n].score.length &&
      (p +=
        " <span>&bull;</span> <i class='hn-comment-info-score'>" +
        app.story.comments[n].score +
        "</i>"),
      1 == isPro() && (p += "<div class='hn-story-info-new'><i>New</i></div>"),
      null != app.story.comments[n].on_link &&
        (p +=
          " <span>&bull;</span> <a href='" +
          app.story.comments[n].on_link +
          "#" +
          app.story.comments[n].id +
          "' class='hn-comment-on-link'>" +
          app.story.comments[n].on_title +
          "</a>"),
      0 < app.story.comments[n].rating &&
        ((p +=
          " <div class='hn-story-info-rating' id='comment_rating_" +
          n +
          "'>-" +
          app.story.comments[n].rating +
          " point" +
          (1 == app.story.comments[n].rating ? "" : "s") +
          "</div>"),
        i.addClass("hn-comment-rating" + app.story.comments[n].rating));
    var m = $("<div />").addClass("hn-comment-info").html(p).appendTo(i);
    $("<div />")
      .addClass("hn-comment-info-more")
      .html(" <span>&bull;</span> <div></div>")
      .appendTo(m)
      .on("click", function () {
        toggleChildComments($(this).parent().parent());
      }),
      $("<div />").addClass("hn-comment-collapse").appendTo(m);
    (d = $("<div />")
      .addClass("hn-comment-icons")
      .attr("id", "comment_icons_" + n)
      .appendTo(m)),
      (r = $("<div />")
        .addClass("hn-story-icon hn-story-upvote")
        .attr("id", "comment_upvote_" + n)
        .appendTo(d));
    1 == app.story.comments[n].upvoted
      ? ($("<div />")
          .css(
            "background-image",
            "url('" +
              getImageUrl("images/icon-arrow-up-small-orange.png") +
              "')",
          )
          .appendTo(r),
        r.addClass("hn-story-upvote-selected"))
      : null != app.story.comments[n].vote_link
        ? $("<div />")
            .css(
              "background-image",
              "url('" + getImageUrl("images/icon-arrow-up-small.png") + "')",
            )
            .appendTo(r)
        : r.hide(),
      null != app.story.comments[n].down_link &&
        ((u = $("<div />")
          .addClass("hn-story-icon hn-story-downvote")
          .attr("id", "comment_downvote_" + n)
          .appendTo(d)).data("comment_index", n),
        1 == app.story.comments[n].downvoted
          ? ($("<div />")
              .css(
                "background-image",
                "url('" +
                  getImageUrl("images/icon-arrow-up-small-orange.png") +
                  "')",
              )
              .appendTo(u),
            u.addClass("hn-story-upvote-selected"))
          : null != app.story.comments[n].down_link
            ? $("<div />")
                .css(
                  "background-image",
                  "url('" +
                    getImageUrl("images/icon-arrow-up-small.png") +
                    "')",
                )
                .appendTo(u)
            : u.hide(),
        u.on("click", function () {
          commentDownVoteClick($(this));
        }));
    l = $("<div />")
      .addClass("hn-story-icon hn-story-bookmark")
      .attr("id", "comment_bookmark_" + n)
      .appendTo(d);
    $("<div />")
      .css(
        "background-image",
        "url('" + getImageUrl("images/icon-bookmark-small.png") + "')",
      )
      .appendTo(l),
      0 == isLoggedIn() && 0 == isPro() && l.hide();
    p = $("<div />")
      .addClass("hn-story-icon hn-story-share")
      .attr("id", "comment_share_" + n);
    $("<div />")
      .css(
        "background-image",
        "url('" + getImageUrl("images/icon-share.png") + "')",
      )
      .appendTo(p);
    m = $("<div />")
      .addClass("hn-story-icon hn-comment-reply")
      .attr("id", "comment_reply_" + n)
      .appendTo(d);
    $("<div />")
      .css(
        "background-image",
        "url('" + getImageUrl("images/icon-reply.png") + "')",
      )
      .appendTo(m);
    var u = $("<div />")
      .addClass("hn-story-icon hn-story-dots")
      .attr("id", "comment_dots_" + n)
      .appendTo(d);
    $("<div />")
      .css(
        "background-image",
        "url('" + getImageUrl("images/icon-dots-thin.png") + "')",
      )
      .appendTo(u),
      m.data("comment_index", n),
      r.data("comment_index", n),
      l.data("comment_index", n),
      p.data("comment_index", n),
      u.data("comment_index", n),
      m.on("click", function () {
        showCommentReply(parseInt($(this).data("comment_index")));
      }),
      r.on("click", function () {
        commentVoteClick($(this));
      }),
      l.on("click", function () {
        commentBookmarkClick($(this));
      }),
      p.on("click", function () {
        showMenu(
          "comment_share",
          "comment_share_" + parseInt($(this).data("comment_index")),
        );
      }),
      u.on("click", function () {
        var e = parseInt($(this).data("comment_index"));
        showMenu(
          "comment_dots",
          "comment_dots_" + (currentMenuCommentIndex = e),
        ),
          $("#comment_icons_" + e).addClass("hn-comment-icons-active"),
          $("#comment_rating_" + e).addClass("hn-story-info-rating-hidden");
      }),
      $(".hn-story-icon", d).on("mousedown", function () {
        $(this).addClass("hn-story-icon-down");
      }),
      ("edit" != o && "delete" != o) || m.hide(),
      null == app.story.comments[n].reply_link && m.hide();
    i = $("<div />")
      .addClass("hn-comment-text")
      .html(app.story.comments[n].text)
      .linkify()
      .appendTo(i);
    1 == app.settings.new_tab &&
      $("a", i).each(function () {
        -1 == $(this).attr("href").indexOf("item?id=") &&
          $(this).attr("target", "_blank");
      });
  }
  null != app.more_link &&
    ((f = $("<div />").addClass("hn-items-more-wrap").appendTo(a)),
    $("<a />")
      .addClass("hn-items-more hn-items-more-comments")
      .text("More")
      .attr("href", app.more_link)
      .appendTo(f));
  var g,
    h,
    c,
    f = getImageUrl("images/icon-chevron-down.png");
  return (
    $(".hn-comment-collapse", a).css("background-image", "url('" + f + "')"),
    $(".hn-comment-collapse", a).on("click", function () {
      parseInt($(this).parent().parent().data("indent"));
      toggleChildComments($(this).parent().parent());
    }),
    "edit" == o
      ? ((f = $("<div />").addClass("hn-comment-edit-wrap").appendTo(a)),
        (h = $("<form />")
          .attr("id", "edit_form")
          .attr("method", "post")
          .attr("action", "xedit")
          .addClass("dialog-form")
          .appendTo(f)),
        (f = $("<table />").addClass("dialog-table").appendTo(h)),
        null != app.story.title_input &&
          ((g = $("<tr />").appendTo(f)),
          $("<td />")
            .addClass(
              "dialog-table-left dialog-table-left-small dialog-table-label-edit",
            )
            .text("Title")
            .appendTo(g),
          (g = $("<td />").appendTo(g)),
          $("<input />")
            .attr("type", "text")
            .attr("name", "title")
            .val(app.story.title_input)
            .addClass("hn-comment-reply-input")
            .appendTo(g)),
        null != app.story.url_input &&
          ((g = $("<tr />").appendTo(f)),
          $("<td />")
            .addClass(
              "dialog-table-left dialog-table-left-small dialog-table-label-edit",
            )
            .text("URL")
            .appendTo(g),
          (g = $("<td />").appendTo(g)),
          $("<input />")
            .attr("type", "text")
            .attr("name", "url")
            .val(app.story.url_input)
            .addClass("hn-comment-reply-input")
            .appendTo(g)),
        null != app.story.textarea &&
          ((c = $("<tr />").appendTo(f)),
          $("<td />")
            .addClass(
              "dialog-table-left dialog-table-left-small dialog-table-label-textarea",
            )
            .text("Text")
            .appendTo(c),
          (c = $("<td />").appendTo(c)),
          $("<textarea />")
            .attr("name", "text")
            .attr("rows", 8)
            .val(app.story.textarea)
            .addClass("hn-comment-reply-input")
            .appendTo(c)),
        (c = $("<div />").addClass("hn-comment-edit-buttons-wrap").appendTo(a)),
        $("<input />")
          .attr("type", "submit")
          .val("Update")
          .addClass("hn-comment-reply-button")
          .appendTo(c)
          .on("click", function () {
            $("#edit_form").submit();
          }),
        $("<input />")
          .attr("type", "hidden")
          .attr("name", "hmac")
          .attr("value", app.story.hmac)
          .prependTo(h),
        $("<input />")
          .attr("type", "hidden")
          .attr("name", "id")
          .attr("value", app.story.id)
          .prependTo(h))
      : "delete" == o &&
        ((c = $("<div />").addClass("hn-comment-delete-wrap").appendTo(a)),
        (h = $("<form />")
          .attr("method", "post")
          .attr("action", "xdelete")
          .appendTo(c)),
        $("<div />")
          .text("Do you want this to be deleted?")
          .addClass("hn-comment-delete-label")
          .appendTo(h),
        $("<input />")
          .attr("type", "submit")
          .attr("name", "d")
          .val("Yes")
          .addClass("hn-comment-reply-button")
          .appendTo(h),
        $("<input />")
          .attr("type", "submit")
          .attr("name", "d")
          .val("No")
          .addClass("hn-comment-reply-button")
          .appendTo(h),
        (c = new URL(window.location).searchParams.get("goto")),
        $("<input />")
          .attr("type", "hidden")
          .attr("name", "hmac")
          .attr("value", app.story.hmac)
          .prependTo(h),
        $("<input />")
          .attr("type", "hidden")
          .attr("name", "id")
          .attr("value", app.story.id)
          .prependTo(h),
        $("<input />")
          .attr("type", "hidden")
          .attr("name", "goto")
          .attr("value", c)
          .prependTo(h)),
    a.appendTo(e),
    setTimeout(function () {
      updateNavButtons();
    }, 200),
    0 == isPro() && 10 < app.story.comments.length && insertProButton(),
    a
  );
}
function showStoryReply() {
  var e, t, a, o;
  0 != isLoggedIn()
    ? 0 < $("#story_reply_wrap_" + app.story.id).length
      ? $("#story_reply_wrap_" + app.story.id).remove()
      : ($(".hn-comment-reply-wrap").remove(),
        $(".hn-comment-replying").removeClass("hn-comment-replying"),
        (e = $("<div />")
          .addClass("hn-story-reply-wrap")
          .attr("id", "story_reply_wrap_" + app.story.id)
          .insertBefore(".hn-comments")),
        setTimeout(function () {
          e.addClass("hn-story-reply-wrap-visible");
        }, 10),
        (t = $("<form />")
          .attr("method", "post")
          .attr("action", "comment")
          .appendTo(e)),
        (a = $("<textarea />")
          .attr("name", "text")
          .attr("rows", 8)
          .addClass("hn-comment-reply-input")
          .attr("id", "story_reply_input_" + app.story.id)
          .appendTo(t)),
        $("<input />")
          .attr("type", "submit")
          .val("Add Comment")
          .attr("id", "story_reply_button_" + app.story.id)
          .addClass("hn-comment-reply-button")
          .appendTo(t)
          .on("click", function (e) {
            return (
              setTimeout(function () {
                $("#story_reply_input_" + app.story.id).attr(
                  "disabled",
                  "disabled",
                ),
                  $("#story_reply_button_" + app.story.id).attr(
                    "disabled",
                    "disabled",
                  );
              }, 200),
              (app.bookmarks.comments_posted.updated = 0),
              saveBookmarks(),
              !0
            );
          }),
        (o = (location.pathname + location.search).substr(1)),
        $("<input />")
          .attr("type", "hidden")
          .attr("name", "hmac")
          .attr("value", app.story.hmac)
          .prependTo(t),
        $("<input />")
          .attr("type", "hidden")
          .attr("name", "goto")
          .attr("value", o)
          .prependTo(t),
        $("<input />")
          .attr("type", "hidden")
          .attr("name", "parent")
          .attr("value", app.story.id)
          .prependTo(t),
        a.focus())
    : showDialog("login");
}
function showCommentReply(e) {
  if (0 != isLoggedIn()) {
    var t = app.story.comments[e],
      a = $("#" + t.id);
    if (0 < $("#comment_reply_wrap_" + t.id).length)
      return (
        $("#comment_reply_wrap_" + t.id).remove(),
        void a.removeClass("hn-comment-replying")
      );
    $(".hn-comment-reply-wrap, .hn-story-reply-wrap").remove(),
      $(".hn-comment-replying").removeClass("hn-comment-replying"),
      a.addClass("hn-comment-replying");
    var o = $("<div />")
      .addClass("hn-comment-reply-wrap")
      .attr("id", "comment_reply_wrap_" + t.id)
      .appendTo(a);
    setTimeout(function () {
      o.addClass("hn-comment-reply-wrap-visible");
    }, 10);
    var s = $("<form />")
        .attr("method", "post")
        .attr("action", "comment")
        .attr("id", "comment_reply_form_" + t.id)
        .appendTo(o),
      a = $("<textarea />")
        .attr("name", "text")
        .attr("id", "comment_reply_input_" + t.id)
        .attr("rows", 8)
        .addClass("hn-comment-reply-input")
        .appendTo(s);
    a.on("input", function () {}),
      $("<input />")
        .attr("type", "submit")
        .val("Reply")
        .attr("id", "comment_reply_button_" + t.id)
        .addClass("hn-comment-reply-button")
        .data("comment_index", e)
        .appendTo(s)
        .on("click", function (e) {
          var t = parseInt($(this).data("comment_index")),
            a = app.story.comments[t],
            o = $("#comment_reply_form_" + a.id);
          return 0 == $("input[name='hmac']", o).length
            ? (alert(
                "Error: unable to load reply form attributes. Are you online? Please try again in a few seconds.",
              ),
              getReplyFormParams(t),
              e.preventDefault(),
              !1)
            : (setTimeout(function () {
                $("#comment_reply_input_" + a.id).attr("disabled", "disabled"),
                  $("#comment_reply_button_" + a.id).attr(
                    "disabled",
                    "disabled",
                  );
              }, 200),
              (app.bookmarks.comments_posted.updated = 0),
              saveBookmarks(),
              !0);
        }),
      a.focus(),
      getReplyFormParams(e);
  } else showDialog("login");
}
const getReplyFormParams = async (e) => {
  var t = app.story.comments[e],
    a = await getPageHTML(t.reply_link),
    o = $("form input[name='parent']", a).first().attr("value"),
    e = $("form input[name='goto']", a).first().attr("value"),
    a = $("form input[name='hmac']", a).first().attr("value"),
    t = $("#comment_reply_form_" + t.id);
  $("<input />")
    .attr("type", "hidden")
    .attr("name", "hmac")
    .attr("value", a)
    .prependTo(t),
    $("<input />")
      .attr("type", "hidden")
      .attr("name", "goto")
      .attr("value", e)
      .prependTo(t),
    $("<input />")
      .attr("type", "hidden")
      .attr("name", "parent")
      .attr("value", o)
      .prependTo(t);
};
function getPageHTML(a) {
  return new Promise(async (e) => {
    var t = await fetch(getAbsoluteUrl(a))
      .then((e) => e.text())
      .catch((e) => console.error(e));
    e($("<div />").html(t));
  });
}
function commentVoteClick(e) {
  var t, a;
  0 != isLoggedIn()
    ? requestTooQuick() ||
      ((t = parseInt(e.data("comment_index"))),
      0 == (a = app.story.comments[t]).upvoted
        ? ((app.story.comments[t].upvoted = !0),
          e.addClass("hn-story-upvote-selected"),
          $("div", e).css(
            "background-image",
            "url('" +
              getImageUrl("images/icon-arrow-up-small-orange.png") +
              "')",
          ),
          doCommentVote(t, a.vote_link))
        : null != a.unvote_link &&
          ((app.story.comments[t].upvoted = !1),
          e.removeClass("hn-story-upvote-selected"),
          $("div", e).css(
            "background-image",
            "url('" + getImageUrl("images/icon-arrow-up-small.png") + "')",
          ),
          doCommentVote(t, a.unvote_link)),
      (app.bookmarks.comments_upvoted.updated = 0),
      saveBookmarks())
    : showDialog("login");
}
function commentDownVoteClick(e) {
  var t, a;
  requestTooQuick() ||
    ((t = parseInt(e.data("comment_index"))),
    0 == (a = app.story.comments[t]).downvoted
      ? ((app.story.comments[t].downvoted = !0),
        e.addClass("hn-story-upvote-selected"),
        $("div", e).css(
          "background-image",
          "url('" + getImageUrl("images/icon-arrow-up-small-orange.png") + "')",
        ),
        doCommentVote(t, a.down_link))
      : null != a.unvote_link &&
        ((app.story.comments[t].downvoted = !1),
        e.removeClass("hn-story-upvote-selected"),
        $("div", e).css(
          "background-image",
          "url('" + getImageUrl("images/icon-arrow-up-small.png") + "')",
        ),
        doCommentVote(t, a.unvote_link)),
    (app.bookmarks.comments_upvoted.updated = 0),
    saveBookmarks());
}
function doCommentVote(e, t) {
  var a = new URL(t, location).searchParams,
    t =
      "vote?id=" +
      a.get("id") +
      "&how=" +
      a.get("how") +
      "&auth=" +
      a.get("auth") +
      "&goto=" +
      encodeURIComponent(a.get("goto")) +
      "&js=t";
  (app.story.comments[e].vote_link =
    "vote?id=" +
    a.get("id") +
    "&how=up&auth=" +
    a.get("auth") +
    "&goto=" +
    encodeURIComponent(a.get("goto")) +
    "&js=t"),
    (app.story.comments[e].down_link =
      "vote?id=" +
      a.get("id") +
      "&how=down&auth=" +
      a.get("auth") +
      "&goto=" +
      encodeURIComponent(a.get("goto")) +
      "&js=t"),
    (app.story.comments[e].unvote_link =
      "vote?id=" +
      a.get("id") +
      "&how=un&auth=" +
      a.get("auth") +
      "&goto=" +
      encodeURIComponent(a.get("goto")) +
      "&js=t"),
    sendRequest(t);
}
var commentBookmarkClickActive = !1;
const commentBookmarkClick = async (e) => {
  if ("public" == getBookmarksStorage()) {
    if (0 == isLoggedIn()) return void showDialog("login");
    if (requestTooQuick(2)) return;
    if (1 == commentBookmarkClickActive)
      return void alert("Too quick, try again in a few seconds.");
  }
  commentBookmarkClickActive = !0;
  var t,
    a = parseInt(e.data("comment_index")),
    o = app.story.comments[a],
    s = o.text;
  0 == o.faved
    ? (e.addClass("hn-story-bookmark-selected"),
      $("div", e).css(
        "background-image",
        "url('" + getImageUrl("images/icon-bookmark-small-orange.png") + "')",
      ))
    : (e.removeClass("hn-story-bookmark-selected"),
      $("div", e).css(
        "background-image",
        "url('" + getImageUrl("images/icon-bookmark-small.png") + "')",
      )),
    "private" == getBookmarksStorage()
      ? null == (t = getCommentBookmarksIndex(o.id))
        ? ((app.story.comments[a].faved = !0),
          app.bookmarks.comments_fav_private.items.unshift({
            id: o.id,
            age: o.age,
            on_link: null == o.on_link ? "item?id=" + app.story.id : o.on_link,
            on_title: "" == o.on_title ? app.story.title : o.on_title,
            text: s,
            user: o.user,
          }))
        : ((app.story.comments[a].faved = !1),
          app.bookmarks.comments_fav_private.items.splice(t, 1))
      : (null == o.auth_code && (o.auth_code = await getAuthCode(o.id)),
        0 == o.faved
          ? ((app.story.comments[a].faved = !0),
            sendRequest("fave?id=" + o.id + "&auth=" + o.auth_code),
            app.bookmarks.comments_fav.items.unshift({
              id: o.id,
              age: o.age,
              on_link:
                null == o.on_link ? "item?id=" + app.story.id : o.on_link,
              on_title: "" == o.on_title ? app.story.title : o.on_title,
              text: s,
              user: o.user,
            }))
          : ((app.story.comments[a].faved = !1),
            sendRequest("fave?id=" + o.id + "&un=t&auth=" + o.auth_code),
            null != (t = getCommentBookmarksIndex(o.id)) &&
              app.bookmarks.comments_fav.items.splice(t, 1))),
    (commentBookmarkClickActive = !1),
    saveBookmarks();
};
function drawStory() {
  $("#hnmain, center").hide(), $(".fatitem, .comment-tree").remove();
  var e,
    t,
    a,
    o,
    s,
    n,
    i = $("<div />")
      .attr("id", "hn_content")
      .addClass("hn-content")
      .insertAfter("#hn_header");
  0 < app.story.title.length &&
    ((o = $("<a />").addClass("hn-story-domain").text(app.story.domain)).attr(
      "href",
      "https://news.ycombinator.com/from?site=" + app.story.domain,
    ),
    (t = $("<a />")
      .addClass("hn-story-title")
      .text(app.story.title)
      .attr("href", app.story.url)
      .appendTo(i)),
    1 == app.settings.new_tab &&
      -1 == app.story.url.indexOf("item?id=") &&
      t.attr("target", "_blank"),
    $("#hn_header_title span").text(app.story.title),
    (a =
      app.story.score +
      " <span>&bull;</span> <a href='https://news.ycombinator.com/user?id=" +
      app.story.user +
      "' class='hn-story-info-user hn-user-link' data-username='" +
      app.story.user +
      "'>" +
      app.story.user +
      "</a> <span>&bull;</span> <a href='https://news.ycombinator.com/item?id=" +
      app.story.id +
      "' class='hn-story-info-user hn-oldness-link'>" +
      app.story.oldness +
      "</a> "),
    0 == app.story.user.length && (a = app.story.oldness),
    (s = $("<div />").addClass("hn-story-info").html(a).appendTo(i)),
    0 < app.story.domain.length &&
      ((a += " <span>&bull;</span> " + o),
      s.prepend(" <span>&bull;</span> "),
      s.prepend(o)),
    (n = $("<div />").addClass("hn-story-icons").appendTo(s)),
    (e = $("<div />")
      .addClass("hn-story-icon hn-story-upvote")
      .attr("id", "story_upvote")
      .appendTo(n)),
    1 == app.story.upvoted
      ? ($("<div />")
          .css(
            "background-image",
            "url('" +
              getImageUrl("images/icon-arrow-up-small-orange.png") +
              "')",
          )
          .appendTo(e),
        e.addClass("hn-story-upvote-selected"))
      : null != app.story.vote_link
        ? $("<div />")
            .css(
              "background-image",
              "url('" + getImageUrl("images/icon-arrow-up-small.png") + "')",
            )
            .appendTo(e)
        : e.hide(),
    (t = $("<div />")
      .addClass("hn-story-icon hn-story-bookmark")
      .attr("id", "story_bookmark")
      .appendTo(n)),
    1 == isStoryFaved()
      ? ($("<div />")
          .css(
            "background-image",
            "url('" +
              getImageUrl("images/icon-bookmark-small-orange.png") +
              "')",
          )
          .appendTo(t),
        t.addClass("hn-story-bookmark-selected"))
      : null != app.story.fav_link || "private" == getBookmarksStorage()
        ? $("<div />")
            .css(
              "background-image",
              "url('" + getImageUrl("images/icon-bookmark-small.png") + "')",
            )
            .appendTo(t)
        : t.hide(),
    0 == isLoggedIn() && 0 == isPro() && t.hide(),
    (a = $("<div />").addClass("hn-story-icon hn-story-share")),
    $("<div />")
      .css(
        "background-image",
        "url('" + getImageUrl("images/icon-share.png") + "')",
      )
      .attr("id", "story_share")
      .appendTo(a),
    (o = $("<div />").addClass("hn-story-icon hn-story-reply").appendTo(n)),
    $("<div />")
      .css(
        "background-image",
        "url('" + getImageUrl("images/icon-reply.png") + "')",
      )
      .appendTo(o),
    null == app.story.textarea && o.hide(),
    (s = $("<div />")
      .addClass("hn-story-icon hn-story-dots")
      .attr("id", "story_dots")
      .appendTo(n)),
    $("<div />")
      .css(
        "background-image",
        "url('" + getImageUrl("images/icon-dots-thin.png") + "')",
      )
      .appendTo(s),
    o.on("click", function () {
      showStoryReply();
    }),
    e.on("click", function () {
      storyVoteClick($(this));
    }),
    t.on("click", function () {
      storyBookmarkClick($(this));
    }),
    a.on("click", function () {
      showMenu("story_share", "story_share");
    }),
    s.on("click", function () {
      showMenu("story_dots", "story_dots");
    }),
    $(".hn-story-icon", n).on("mousedown", function () {
      $(this).addClass("hn-story-icon-down");
    }),
    null != app.story.text &&
      0 < app.story.text.length &&
      ((n = $("<div />")
        .addClass("hn-story-text")
        .html(app.story.text)
        .linkify()
        .appendTo(i)),
      1 == app.settings.new_tab &&
        $("a", n).each(function () {
          -1 == $(this).attr("href").indexOf("item?id=") &&
            $(this).attr("target", "_blank");
        }))),
    drawComments(i);
}
var lastRequestTimestamp = 0;
function requestTooQuick(e) {
  var e = void 0 === e ? 2 : e,
    t = !1,
    a = Date.now();
  return (
    a - lastRequestTimestamp < 1e3 * e
      ? (alert("Too quick, try again in a few seconds."), (t = !0))
      : (lastRequestTimestamp = a),
    t
  );
}
function sendRequest(e) {
  fetch(getAbsoluteUrl(e), { redirect: "manual" })
    .then((e) => {
      if (200 <= e.status && e.status <= 299) return e.text();
      if (302 != e.status) throw Error(e.statusText);
    })
    .then((e) => {})
    .catch((e) => {});
}
function storyVoteClick(e) {
  0 != isLoggedIn()
    ? requestTooQuick() ||
      (0 == app.story.upvoted
        ? ((app.story.upvoted = !0),
          e.addClass("hn-story-upvote-selected"),
          $("div", e).css(
            "background-image",
            "url('" +
              getImageUrl("images/icon-arrow-up-small-orange.png") +
              "')",
          ),
          doStoryVote(app.story.vote_link))
        : null != app.story.unvote_link
          ? ((app.story.upvoted = !1),
            e.removeClass("hn-story-upvote-selected"),
            $("div", e).css(
              "background-image",
              "url('" + getImageUrl("images/icon-arrow-up-small.png") + "')",
            ),
            doStoryVote(app.story.unvote_link))
          : alert("Unvote is disabled one hour after voting."))
    : showDialog("login");
}
function doStoryVote(e) {
  var t = new URL(e, location).searchParams,
    e =
      "vote?id=" +
      t.get("id") +
      "&how=" +
      t.get("how") +
      "&auth=" +
      t.get("auth") +
      "&goto=" +
      encodeURIComponent(t.get("goto")) +
      "&js=t";
  (app.story.unvote_link =
    "vote?id=" +
    t.get("id") +
    "&how=un&auth=" +
    t.get("auth") +
    "&goto=" +
    encodeURIComponent(t.get("goto")) +
    "&js=t"),
    (app.bookmarks.stories_upvoted.updated = 0),
    saveBookmarks(),
    sendRequest(e);
}
function isStoryFaved() {
  return "private" != getBookmarksStorage()
    ? app.story.faved
    : null != getStoryBookmarksIndex(app.story.id);
}
function storyBookmarkClick(e) {
  (requestTooQuick() && 1 == isLoggedIn()) ||
    (0 == isStoryFaved()
      ? doStoryBookmark(app.story.fav_link)
      : doStoryBookmark(app.story.fav_link, !0),
    updateStoryBookmarkButton());
}
function updateStoryBookmarkButton() {
  var e = $("#story_bookmark");
  0 != e.length &&
    (1 == isStoryFaved()
      ? (e.addClass("hn-story-bookmark-selected"),
        $("div", e).css(
          "background-image",
          "url('" + getImageUrl("images/icon-bookmark-small-orange.png") + "')",
        ))
      : (e.removeClass("hn-story-bookmark-selected"),
        $("div", e).css(
          "background-image",
          "url('" + getImageUrl("images/icon-bookmark-small.png") + "')",
        )));
}
function updateCommentBookmarkButtons() {
  if (0 != onItemPage())
    for (var e = 0; e < app.story.comments.length; e++) {
      var t = $("#comment_bookmark_" + e);
      0 != t.length &&
        (1 == isCommentFaved(e)
          ? (t.addClass("hn-story-bookmark-selected"),
            $("div", t).css(
              "background-image",
              "url('" +
                getImageUrl("images/icon-bookmark-small-orange.png") +
                "')",
            ))
          : (t.removeClass("hn-story-bookmark-selected"),
            $("div", t).css(
              "background-image",
              "url('" + getImageUrl("images/icon-bookmark-small.png") + "')",
            )));
    }
}
function isCommentFaved(e) {
  return null != getCommentBookmarksIndex(app.story.comments[e].id);
}
function getBookmarksStorage() {
  return 0 == isPro()
    ? 0 == isLoggedIn()
      ? "private"
      : "public"
    : "private" == app.bookmarks.storage || 0 == isLoggedIn()
      ? "private"
      : "public";
}
function doStoryBookmark(e, t) {
  var a,
    t = void 0 !== t && t;
  "private" == getBookmarksStorage()
    ? (0 == t
        ? (app.bookmarks.stories_fav_private.items.push({
            id: app.story.id,
            title: app.story.title,
            domain: app.story.domain,
            user: app.story.user,
            age: app.story.age,
          }),
          (app.bookmarks.stories_fav_private.updated = Math.floor(
            Date.now() / 1e3,
          )))
        : null != (a = getStoryBookmarksIndex(app.story.id)) &&
          app.bookmarks.stories_fav_private.items.splice(a, 1),
      saveBookmarks(),
      1 == menuOpen && "bookmark" == menuName && drawBookmarksMenu())
    : ((app.story.faved = 0 == t),
      (app.bookmarks.stories_fav.updated = 0),
      saveBookmarks(),
      (e =
        "fave?id=" +
        (a = new URL(e, location).searchParams).get("id") +
        "&auth=" +
        a.get("auth")),
      sendRequest(
        (e =
          1 == t
            ? "fave?id=" + a.get("id") + "&un=t&auth=" + a.get("auth")
            : e),
      ));
}
function toggleChildComments(e) {
  var t,
    a = !0;
  1 == (a = e.hasClass("hn-comment-collapsed") ? !1 : a)
    ? e.addClass("hn-comment-collapsed")
    : e.removeClass("hn-comment-collapsed"),
    1 == a
      ? ((t = countChildComments(e)),
        $(".hn-comment-info-more div", e).text(t + " more"),
        $(".hn-comment-info-more", e).css("display", "inline"))
      : $(".hn-comment-info-more", e).hide();
  var o = parseInt(e.data("indent"));
  e.nextAll().each(function (e) {
    return (
      parseInt($(this).data("indent")) > o &&
      void (1 == a
        ? $(this).hide()
        : ($(this).removeClass("hn-comment-collapsed").show(),
          $(".hn-comment-info-more", this).hide()))
    );
  });
}
function countChildComments(e) {
  var t = parseInt(e.data("indent")),
    a = 1;
  return (
    e.nextAll().each(function (e) {
      return parseInt($(this).data("indent")) > t && void a++;
    }),
    a
  );
}
function setupImages() {
  var e = getImageUrl("images/icon-menu2.png"),
    t = getImageUrl("images/icon.png"),
    a = getImageUrl("images/icon-search-50pc.png"),
    o = getImageUrl("images/icon-search-thin.png"),
    s = getImageUrl("images/icon-bookmark-small.png"),
    n = getImageUrl("images/icon-history2.png"),
    i = getImageUrl("images/icon-font2.png"),
    r = getImageUrl("images/icon-lang4.png"),
    d = getImageUrl("images/icon-user.png"),
    l = getImageUrl("images/icon-dots.png"),
    p = getImageUrl("images/icon-cross.png");
  $(".wiki-logo").css("background-image", "url('" + t + "')"),
    $("#wiki_search_icon").css("background-image", "url('" + a + "')"),
    $("#wiki_search_delete").css("background-image", "url('" + p + "')"),
    $("#button_menu div").css("background-image", "url('" + e + "')"),
    $("#button_bookmark div").css("background-image", "url('" + s + "')"),
    $("#button_history div").css("background-image", "url('" + n + "')"),
    $("#button_settings div").css("background-image", "url('" + i + "')"),
    $("#button_search div").css("background-image", "url('" + o + "')"),
    $("#button_lang div").css("background-image", "url('" + r + "')"),
    $("#button_user div").css("background-image", "url('" + d + "')"),
    $("#button_article div").css("background-image", "url('" + l + "')");
}
var updateNavButtonsTimer,
  hideSearchTimer,
  altDown = !1,
  shiftDown = !1,
  menuCommentId = null;
function setupEvents() {
  $(window).on("scroll", function () {
    $(this).scrollTop(),
      ("story_share" != menuName &&
        "story_dots" != menuName &&
        "list_dots" != menuName &&
        "comment_share" != menuName &&
        "comment_dots" != menuName &&
        "story_list_dots" != menuName &&
        "overflow" != menuName &&
        "front_date" != menuName) ||
        hideMenu(!1),
      0 == app.settings.fixed_header && hideMenu(!1),
      updateHeaderTitleShow(),
      clearTimeout(updateNavButtonsTimer),
      (updateNavButtonsTimer = setTimeout(function () {
        updateNavButtons();
      }, 30));
  }),
    $(window).on("resize", function () {
      applyPageWidth();
    }),
    $(document).on("mousedown", function (e) {
      0 < $(e.target).closest(".wiki-highlight-popup-tab").length ||
        0 < $(e.target).closest(".wiki-highlight-popup-inner").length ||
        (1 == wikiHighlightPopupOpen && $(e.target).closest("mark").length,
        hideHighlightPopup());
    }),
    $(document).on("mouseup", function (e) {
      clearInterval(scrollToCommentRepeatTimer),
        clearTimeout(scrollToCommentRepeatDelayTimer),
        (scrollToCommentRepeatStarted = !1),
        (lastMouseUpTop = e.pageY);
      var t = $(window.getSelection().anchorNode)
          .closest(".hn-comment-text")
          .parent()
          .attr("id"),
        a = $(window.getSelection().focusNode)
          .closest(".hn-comment-text")
          .parent()
          .attr("id");
      0 == $(e.target).closest(".menu-inner").length &&
        null != t &&
        t == a &&
        ((menuCommentId = t),
        clearTimeout(showHighlightTimer),
        (showHighlightTimer = setTimeout(function () {
          showHighlight();
        }, 50))),
        $(".wiki-header-button-down").removeClass("wiki-header-button-down"),
        $(".hn-story-icon-down").removeClass("hn-story-icon-down"),
        $(".nav-button-down").removeClass("nav-button-down"),
        1 == contextMenuOpen
          ? 0 < $(e.target).closest("#context_menu .menu-inner").length ||
            (clearTimeout(hideMenuTimer),
            (hideMenuTimer = setTimeout(function () {
              hideContextMenu();
            }, 20)))
          : 1 == menuOpen &&
            (0 < $(e.target).closest(".menu-inner").length ||
              0 < $(e.target).closest(".wiki-search").length ||
              (clearTimeout(hideMenuTimer),
              (hideMenuTimer = setTimeout(function () {
                hideMenu();
              }, 20))));
    }),
    $(document).keydown(function (e) {
      if (
        ((altDown = e.altKey),
        (shiftDown = e.shiftKey),
        !(
          $(e.target).is("input[type='text']:focus") ||
          $(e.target).is("input[type='password']:focus") ||
          $(e.target).is("textarea:focus")
        ) && 1 != e.metaKey)
      )
        return 27 == e.which
          ? (1 == dialogOpen && hideDialog(), e.preventDefault(), !1)
          : 8 == e.which && 1 == isPro()
            ? ((1 == e.shiftKey && 0 == e.altKey
                ? scrollToTop
                : goToPrevComment)(),
              e.preventDefault(),
              !1)
            : 13 == e.which && 1 == isPro()
              ? ((1 == e.shiftKey && 0 == e.altKey
                  ? scrollToBottom
                  : goToNextComment)(),
                e.preventDefault(),
                !1)
              : 37 == e.which && 1 == isPro()
                ? (1 == onListPage() ? goToPrevListPage() : goToPrevComment(!0),
                  e.preventDefault(),
                  !1)
                : 39 == e.which && 1 == isPro()
                  ? (1 == onListPage()
                      ? goToNextListPage()
                      : goToNextComment(!0),
                    e.preventDefault(),
                    !1)
                  : e.repeat || 191 != e.which || $("#wiki_search").is(":focus")
                    ? void 0
                    : (showSearch(), e.preventDefault(), !1);
    }),
    $(document).keyup(function (e) {
      (altDown = e.altKey), (shiftDown = e.shiftKey);
    });
}
function updateHeaderTitleShow() {
  0 < $("#hn_header_title span").text().length &&
    (170 < $(window).scrollTop()
      ? ($("#hn_header_tabs").addClass("hn-header-tabs-hide"),
        $("#hn_header_title").addClass("hn-header-title-show"))
      : ($("#hn_header_tabs").removeClass("hn-header-tabs-hide"),
        $("#hn_header_title").removeClass("hn-header-title-show")));
}
function drawHeader() {
  var e = $("<div />")
      .attr("id", "hn_header")
      .addClass("wiki-header")
      .attr("tabindex", "0")
      .prependTo("body"),
    t = $("<div />")
      .attr("id", "hn_header_inner")
      .addClass("wiki-header-inner")
      .appendTo(e);
  1 == app.settings.fixed_header && e.addClass("wiki-header-fixed");
  var a = $("<div />")
    .attr("id", "button_menu")
    .addClass("wiki-header-button wiki-header-button-menu")
    .appendTo(e);
  a.on("click", function () {
    toggleContents();
  });
  $("<a />")
    .attr("href", "/news")
    .text("Hacker News")
    .addClass("wiki-logo")
    .appendTo(e);
  drawHeaderTabs();
  var o = $("<div />")
    .attr("id", "hn_header_title")
    .addClass("wiki-header-title")
    .appendTo(t);
  $("<span />")
    .appendTo(o)
    .on("click", function () {
      scrollToTop();
    });
  var s = $("<div />")
      .attr("id", "header_buttons")
      .addClass("wiki-header-buttons")
      .appendTo(e),
    n = $("<div />")
      .attr("id", "button_search")
      .addClass("wiki-header-button wiki-header-button-find"),
    i = $("<div />")
      .attr("id", "button_bookmark")
      .addClass("wiki-header-button wiki-header-button-bookmark"),
    t = $("<div />")
      .attr("id", "button_history")
      .addClass("wiki-header-button wiki-header-button-history"),
    o = $("<div />")
      .attr("id", "button_settings")
      .addClass("wiki-header-button wiki-header-button-settings"),
    e = $("<div />")
      .attr("id", "button_user")
      .addClass("wiki-header-button wiki-header-button-user");
  o.appendTo(s),
    t.appendTo(s),
    i.appendTo(s),
    e.appendTo(s),
    n.appendTo(s),
    $("<div />").appendTo(a),
    $("<div />").appendTo(n),
    $("<div />").appendTo(i),
    $("<div />").appendTo(t),
    $("<div />").appendTo(o),
    $("<div />").appendTo(e),
    enableTooltips(),
    n.on("click", function (e) {
      showSearch(), e.preventDefault();
    }),
    i.on("click", function (e) {
      showMenu("bookmark", "button_bookmark"), e.preventDefault();
    }),
    t.on("click", function (e) {
      loadHistoryMenu(), e.preventDefault();
    }),
    o.on("click", function (e) {
      showMenu("settings", "button_settings"), e.preventDefault();
    }),
    e.on("click", function (e) {
      showMenu("user", "button_user"), e.preventDefault();
    }),
    $(".wiki-header-button")
      .off("mousedown")
      .on("mousedown", function () {
        $(this).addClass("wiki-header-button-down");
      });
  (s = $("<div />")
    .attr("id", "wiki_search_wrap")
    .addClass("wiki-search-wrap")
    .html("&nbsp;")
    .appendTo(s)),
    $("<div />")
      .attr("id", "wiki_search_icon")
      .addClass("wiki-search-icon")
      .appendTo(s);
  $("<div />")
    .attr("id", "wiki_search_delete")
    .addClass("wiki-search-delete")
    .appendTo(s)
    .on("click", function () {
      0 != $("#wiki_search").val().length
        ? ($("#wiki_search").val("").focus(), clearTimeout(hideSearchTimer))
        : hideSearch();
    });
  s = $("<input />")
    .attr("type", "text")
    .attr("id", "wiki_search")
    .addClass("wiki-search")
    .appendTo(s);
  s
    .attr("autocomplete", "off")
    .attr("spellcheck", "false")
    .attr("autocapitalize", "off")
    .attr("autocorrect", "off"),
    s.attr("placeholder", "Search"),
    s.on("blur", function () {
      clearTimeout(hideSearchTimer),
        (hideSearchTimer = setTimeout(function () {
          hideSearch();
        }, 200));
    }),
    s.on("keyup", function (e) {
      1 != e.metaKey &&
        (13 == e.which &&
          0 < $("#wiki_search").val().length &&
          (location.href =
            "https://hn.algolia.com/?q=" + $("#wiki_search").val()),
        27 == e.which && hideSearch());
    });
}
var enableTooltipsTimer,
  tippyObj = null,
  tippySingleton = null;
function enableTooltips() {
  if (null != tippyObj)
    try {
      for (var e = 0; e < tippyObj.length; e++) tippyObj[e].destroy();
    } catch (e) {
      console.log("enableTooltips() - error: " + e);
    }
  $(".tippy-box").remove(),
    clearTimeout(enableTooltipsTimer),
    (enableTooltipsTimer = setTimeout(function () {
      tippyObj = tippy("[data-tippy-content]", {
        delay: [600, 0],
        duration: [420, 0],
        animation: "perspective",
        inertia: !0,
        offset: [0, 6],
      });
    }, 100));
}
var showSearchTimer,
  selectCurrentTabTimer,
  showSearchInProgress = !1;
function showSearch() {
  (showSearchInProgress = !0),
    clearTimeout(showSearchTimer),
    (showSearchTimer = setTimeout(function () {
      showSearchInProgress = !1;
    }, 220)),
    $("#wiki_search_wrap").addClass("wiki-search-wrap-show"),
    $("#wiki_search").val("").focus();
}
function hideSearch() {
  1 != showSearchInProgress &&
    ($("#wiki_search_wrap").removeClass("wiki-search-wrap-show"),
    $("#wiki_search").blur());
}
function drawHeaderTabs() {
  var e = getSectionFromUrl(),
    t = $("#hn_header_inner");
  $("#hn_header_tabs").remove();
  var a = $("<div />")
      .attr("id", "hn_header_tabs")
      .addClass("wiki-header-tabs")
      .appendTo(t),
    t =
      ($("<a />")
        .text("Top")
        .attr("href", "/news")
        .attr("id", "tab_top")
        .appendTo(a),
      $("<a />")
        .text("Ask")
        .attr("href", "/ask")
        .attr("id", "tab_ask")
        .appendTo(a),
      $("<a />")
        .text("Show")
        .attr("href", "/show")
        .attr("id", "tab_show")
        .appendTo(a),
      $("<a />")
        .text("Best")
        .attr("href", "/best")
        .attr("id", "tab_best")
        .appendTo(a),
      $("<a />")
        .text("New")
        .attr("href", "/newest")
        .attr("id", "tab_new")
        .appendTo(a),
      $("<a />")
        .text("Active")
        .attr("href", "/active")
        .attr("id", "tab_active")
        .appendTo(a));
  "noobstories" == e ||
  "noobcomments" == e ||
  "noobstories" == app.settings.section ||
  "noobcomments" == app.settings.section
    ? (t.hide(),
      $("<a />")
        .text("Noobs")
        .attr("href", "/noobstories")
        .attr("id", "tab_noobs")
        .appendTo(a))
    : "pool" == e || "pool" == app.settings.section
      ? (t.hide(),
        $("<a />")
          .text("Pool")
          .attr("href", "/pool")
          .attr("id", "tab_pool")
          .appendTo(a))
      : "jobs" == e || "jobs" == app.settings.section
        ? (t.hide(),
          $("<a />")
            .text("Jobs")
            .attr("href", "/jobs")
            .attr("id", "tab_jobs")
            .appendTo(a))
        : "leaders" == e || "leaders" == app.settings.section
          ? (t.hide(),
            $("<a />")
              .text("Leaders")
              .attr("href", "/leaders")
              .attr("id", "tab_leaders")
              .appendTo(a))
          : ("submit" != e && "submit" != app.settings.section) ||
            (t.hide(),
            $("<a />")
              .text("Submit")
              .attr("href", "/submit")
              .attr("id", "tab_submit")
              .appendTo(a)
              .on("click", function (e) {
                return (
                  0 == isLoggedIn()
                    ? showDialog("login")
                    : showDialog("submit"),
                  e.stopPropagation(),
                  e.stopImmediatePropagation(),
                  e.preventDefault(),
                  !1
                );
              }));
  (e = $("<div />")
    .addClass("wiki-header-button wiki-header-tab-overflow")
    .attr("id", "tab_overflow")
    .appendTo(a)),
    (t = $("<div />").appendTo(e));
  e.on("click", function (e) {
    return (
      showMenu("overflow", "tab_overflow"),
      e.stopPropagation(),
      e.stopImmediatePropagation(),
      e.preventDefault(),
      !1
    );
  }),
    e.on("mousedown", function () {
      $(this).addClass("wiki-header-button-down");
    });
  e = getImageUrl("images/icon-chevron-down-thin.png");
  t.css("background-image", "url('" + e + "')"),
    $("<div />")
      .addClass("wiki-header-tabs-bar")
      .attr("id", "tabs_bar")
      .appendTo(a),
    clearTimeout(selectCurrentTabTimer),
    (selectCurrentTabTimer = setTimeout(function () {
      selectCurrentTab();
    }, 200)),
    $(".wiki-header-tabs a").on("click", function () {
      selectTab($(this).attr("id"));
    });
}
function selectCurrentTab() {
  $("#hn_header_tabs");
  var e,
    t = getSectionFromUrl();
  1 == onItemPage()
    ? ((e = getImageUrl("images/icon-chevron-back.png")),
      $("<div />").css("background-image", "url('" + e + "')"),
      "top" == app.settings.section || "front" == app.settings.section
        ? selectTab("tab_top", !1)
        : "newest" == app.settings.section ||
            "newcomments" == app.settings.section
          ? selectTab("tab_new", !1)
          : "show" == app.settings.section || "shownew" == app.settings.section
            ? selectTab("tab_show", !1)
            : "ask" == app.settings.section || "asknew" == app.settings.section
              ? selectTab("tab_ask", !1)
              : "best" == app.settings.section ||
                  "bestcomments" == app.settings.section
                ? selectTab("tab_best", !1)
                : "active" == app.settings.section
                  ? selectTab("tab_active", !1)
                  : "noobstories" == app.settings.section ||
                      "noobcomments" == app.settings.section
                    ? selectTab("tab_noobs", !1)
                    : "pool" == app.settings.section
                      ? selectTab("tab_pool", !1)
                      : "jobs" == app.settings.section
                        ? selectTab("tab_jobs", !1)
                        : "leaders" == app.settings.section
                          ? selectTab("tab_leaders", !1)
                          : 0 == app.story.title.indexOf("Ask HN: ")
                            ? selectTab("tab_ask", !1)
                            : 0 == app.story.title.indexOf("Show HN: ")
                              ? selectTab("tab_show", !1)
                              : selectTab("tab_top", !1))
    : "top" == t || "front" == t
      ? selectTab("tab_top", !1)
      : "newest" == t || "newcomments" == t
        ? selectTab("tab_new", !1)
        : "show" == t || "shownew" == t
          ? selectTab("tab_show", !1)
          : "ask" == t || "asknew" == t
            ? selectTab("tab_ask", !1)
            : "best" == t || "bestcomments" == t
              ? selectTab("tab_best", !1)
              : "active" == t
                ? selectTab("tab_active", !1)
                : "noobstories" == t || "noobcomments" == t
                  ? selectTab("tab_noobs", !1)
                  : "pool" == t
                    ? selectTab("tab_pool", !1)
                    : "jobs" == t
                      ? selectTab("tab_jobs", !1)
                      : "leaders" == t
                        ? selectTab("tab_leaders", !1)
                        : "submit" == t
                          ? selectTab("tab_submit", !1)
                          : $("#tabs_bar").hide();
}
function getSectionFromUrl() {
  var e = "",
    t = window.location.href;
  return (
    -1 != t.indexOf("news.ycombinator.com/newsfaq.html")
      ? (e = "newsfaq")
      : -1 != t.indexOf("news.ycombinator.com/newsguidelines.html")
        ? (e = "newsguidelines")
        : -1 != t.indexOf("news.ycombinator.com/formatdoc")
          ? (e = "formatdoc")
          : -1 != t.indexOf("news.ycombinator.com/showhn.html")
            ? (e = "showhn")
            : -1 != t.indexOf("news.ycombinator.com/launches")
              ? (e = "launches")
              : "https://news.ycombinator.com" == t ||
                  "https://news.ycombinator.com/" == t ||
                  -1 != t.indexOf("news.ycombinator.com/news") ||
                  -1 != t.indexOf("/hn.html")
                ? (e = "top")
                : -1 != t.indexOf("news.ycombinator.com/newcomments")
                  ? (e = "newcomments")
                  : -1 != t.indexOf("news.ycombinator.com/newest")
                    ? (e = "newest")
                    : -1 != t.indexOf("news.ycombinator.com/shownew")
                      ? (e = "shownew")
                      : -1 != t.indexOf("news.ycombinator.com/show")
                        ? (e = "show")
                        : -1 != t.indexOf("news.ycombinator.com/asknew")
                          ? (e = "asknew")
                          : -1 != t.indexOf("news.ycombinator.com/ask")
                            ? (e = "ask")
                            : -1 != t.indexOf("news.ycombinator.com/active")
                              ? (e = "active")
                              : -1 !=
                                  t.indexOf("news.ycombinator.com/bestcomments")
                                ? (e = "bestcomments")
                                : -1 != t.indexOf("news.ycombinator.com/best")
                                  ? (e = "best")
                                  : -1 != t.indexOf("news.ycombinator.com/pool")
                                    ? (e = "pool")
                                    : -1 !=
                                        t.indexOf(
                                          "news.ycombinator.com/leaders",
                                        )
                                      ? (e = "leaders")
                                      : -1 !=
                                          t.indexOf("news.ycombinator.com/jobs")
                                        ? (e = "jobs")
                                        : -1 !=
                                            t.indexOf(
                                              "news.ycombinator.com/noobstories",
                                            )
                                          ? (e = "noobstories")
                                          : -1 !=
                                              t.indexOf(
                                                "news.ycombinator.com/noobcomments",
                                              )
                                            ? (e = "noobcomments")
                                            : -1 !=
                                                t.indexOf(
                                                  "news.ycombinator.com/user",
                                                )
                                              ? (e = "user")
                                              : -1 !=
                                                  t.indexOf(
                                                    "news.ycombinator.com/from",
                                                  )
                                                ? (e = "from")
                                                : -1 !=
                                                    t.indexOf(
                                                      "news.ycombinator.com/front",
                                                    )
                                                  ? (e = "front")
                                                  : -1 !=
                                                      t.indexOf(
                                                        "news.ycombinator.com/threads",
                                                      )
                                                    ? (e = "threads")
                                                    : -1 !=
                                                        t.indexOf(
                                                          "news.ycombinator.com/submitted",
                                                        )
                                                      ? (e = "submitted")
                                                      : -1 !=
                                                            t.indexOf(
                                                              "news.ycombinator.com/favorites",
                                                            ) &&
                                                          -1 !=
                                                            t.indexOf(
                                                              "comments=t",
                                                            )
                                                        ? (e =
                                                            "favorite_comments")
                                                        : -1 !=
                                                            t.indexOf(
                                                              "news.ycombinator.com/favorites",
                                                            )
                                                          ? (e = "favorites")
                                                          : -1 !=
                                                                t.indexOf(
                                                                  "news.ycombinator.com/upvoted",
                                                                ) &&
                                                              -1 !=
                                                                t.indexOf(
                                                                  "comments=t",
                                                                )
                                                            ? (e =
                                                                "upvoted_comments")
                                                            : -1 !=
                                                                t.indexOf(
                                                                  "news.ycombinator.com/upvoted",
                                                                )
                                                              ? (e = "upvoted")
                                                              : -1 !=
                                                                  t.indexOf(
                                                                    "news.ycombinator.com/login",
                                                                  )
                                                                ? (e = "login")
                                                                : -1 !=
                                                                    t.indexOf(
                                                                      "news.ycombinator.com/submit",
                                                                    )
                                                                  ? (e =
                                                                      "submit")
                                                                  : -1 !=
                                                                      t.indexOf(
                                                                        "news.ycombinator.com/hidden",
                                                                      )
                                                                    ? (e =
                                                                        "hidden")
                                                                    : -1 !=
                                                                          t.indexOf(
                                                                            "news.ycombinator.com/item",
                                                                          ) ||
                                                                        -1 !=
                                                                          t.indexOf(
                                                                            "/hn2.html",
                                                                          )
                                                                      ? (e =
                                                                          "item")
                                                                      : -1 !=
                                                                          t.indexOf(
                                                                            "news.ycombinator.com/edit",
                                                                          )
                                                                        ? (e =
                                                                            "edit")
                                                                        : -1 !=
                                                                            t.indexOf(
                                                                              "news.ycombinator.com/delete-confirm",
                                                                            ) &&
                                                                          (e =
                                                                            "delete"),
    e
  );
}
function selectTab(e, t) {
  var a,
    t = void 0 === t || t;
  $("#" + e).hasClass("wiki-header-tab-back") ||
    ($(".wiki-header-tabs a").removeClass(
      "wiki-header-tab-back wiki-header-tab-selected",
    ),
    $("#" + e).addClass("wiki-header-tab-selected"),
    (a = +$("#" + e).position().left),
    (e = $("#" + e).outerWidth() + 0),
    $("#tabs_bar").show(),
    1 == t
      ? $("#tabs_bar").css("transition", "all 0.2s ease-in-out")
      : $("#tabs_bar").css("transition", "none"),
    $("#tabs_bar")
      .css("left", a + "px")
      .css("width", e + "px"));
}
function goToPrevNewComment() {
  var t = $(window).scrollTop() - scrollToCommentOffsetPrev,
    a = null;
  $(".hn-comment-highlight")
    .reverse()
    .each(function (e) {
      if ($(this).offset().top < t) return (a = $(this).attr("id")), !1;
    }),
    null != a && scrollToComment(a);
}
function goToNextNewComment() {
  var t = $(window).scrollTop() + scrollToCommentOffsetNext,
    a = null;
  $(".hn-comment-highlight").each(function (e) {
    if ($(this).offset().top > t) return (a = $(this).attr("id")), !1;
  }),
    null != a && scrollToComment(a);
}
function getPrevNewCommentId() {
  var t = $(window).scrollTop() - scrollToCommentOffsetPrev,
    a = null;
  return (
    $(".hn-comment-highlight")
      .reverse()
      .each(function (e) {
        if ($(this).offset().top < t) return (a = $(this).attr("id")), !1;
      }),
    a
  );
}
function getNextNewCommentId() {
  var t = $(window).scrollTop() + scrollToCommentOffsetNext,
    a = null;
  return (
    $(".hn-comment-highlight").each(function (e) {
      if ($(this).offset().top > t) return (a = $(this).attr("id")), !1;
    }),
    a
  );
}
function drawNavButtons() {
  var e = $("<div />")
      .attr("id", "nav_comments_wrap")
      .addClass("nav-comments-wrap")
      .appendTo("body"),
    t = $("<div />")
      .attr("id", "nav_comments_wrap_inner")
      .addClass("nav-comments-wrap-inner")
      .appendTo(e),
    a = $("<div />")
      .attr("id", "nav_comments_prev")
      .addClass("nav-comments-button nav-comments-button-prev")
      .html("<span></span>")
      .appendTo(t),
    o = $("<div />")
      .attr("id", "nav_comments_next")
      .addClass("nav-comments-button nav-comments-button-next")
      .html("<span></span>")
      .appendTo(t);
  a.on("click", function () {
    goToPrevNewComment();
  }),
    o.on("click", function () {
      goToNextNewComment();
    });
  var s = $("<div />")
      .attr("id", "top_button")
      .addClass("nav-button nav-button-top")
      .appendTo("body"),
    e = $("<div />").addClass("nav-button-inner").appendTo(s);
  s.on("click", function () {
    scrollToTop();
  });
  (t = $("<div />")
    .attr("id", "bottom_button")
    .addClass("nav-button nav-button-bottom")
    .appendTo("body")),
    (a = $("<div />").addClass("nav-button-inner").appendTo(t));
  t.on("click", function () {
    scrollToBottom();
  });
  o = getImageUrl("images/arrow-up.png");
  e.css("background-image", "url('" + o + "')"),
    a.css("background-image", "url('" + o + "')");
  (s = $("<div />")
    .attr("id", "prev_button")
    .addClass("nav-button nav-button-prev")
    .appendTo("body")),
    (t = $("<div />").addClass("nav-button-inner").appendTo(s));
  s.on("mousedown", function () {
    (1 != onItemPage() && 1 != onCommentsPage()) ||
      (clearTimeout(scrollToCommentRepeatDelayTimer),
      (scrollToCommentRepeatDelayTimer = setTimeout(function () {
        clearInterval(scrollToCommentRepeatTimer),
          (scrollToCommentRepeatTimer = setInterval(function () {
            (scrollToCommentRepeatStarted = !0), goToPrevComment();
          }, scrollToCommentRepeatInterval));
      }, scrollToCommentRepeatDelay)));
  }),
    s.on("mouseup", function () {
      1 == onItemPage() || 1 == onCommentsPage()
        ? (clearTimeout(scrollToCommentRepeatDelayTimer),
          clearInterval(scrollToCommentRepeatTimer),
          0 == scrollToCommentRepeatStarted && goToPrevComment(),
          (scrollToCommentRepeatStarted = !1))
        : goToPrevListPage();
    });
  (e = $("<div />")
    .attr("id", "next_button")
    .addClass("nav-button nav-button-next")
    .appendTo("body")),
    (a = $("<div />").addClass("nav-button-inner").appendTo(e));
  e.on("mousedown", function () {
    (1 != onItemPage() && 1 != onCommentsPage()) ||
      (clearTimeout(scrollToCommentRepeatDelayTimer),
      (scrollToCommentRepeatDelayTimer = setTimeout(function () {
        clearInterval(scrollToCommentRepeatTimer),
          (scrollToCommentRepeatTimer = setInterval(function () {
            (scrollToCommentRepeatStarted = !0), goToNextComment();
          }, scrollToCommentRepeatInterval));
      }, scrollToCommentRepeatDelay)));
  }),
    e.on("mouseup", function () {
      1 == onItemPage() || 1 == onCommentsPage()
        ? (clearTimeout(scrollToCommentRepeatDelayTimer),
          clearInterval(scrollToCommentRepeatTimer),
          0 == scrollToCommentRepeatStarted && goToNextComment(),
          (scrollToCommentRepeatStarted = !1))
        : goToNextListPage();
    });
  o = getImageUrl("images/icon-chevron-down.png");
  t.css("background-image", "url('" + o + "')"),
    a.css("background-image", "url('" + o + "')"),
    0 == onItemPage() && 0 == onCommentsPage()
      ? (0 == new URLSearchParams(window.location.search).has("p") &&
          0 == onIndexPage() &&
          s.addClass("nav-button-disabled"),
        (a = Math.round(new Date().getTime() / 1e3)),
        (o = DateTime.fromSeconds(a)),
        (a = getIndexDate()),
        ((0 == onIndexPage() && 0 == $(".hn-items-more").length) ||
          (1 == onIndexPage() && a.toISODate() == o.toISODate())) &&
          e.addClass("nav-button-disabled"),
        s.addClass("nav-button-prev-rotate"),
        e.addClass("nav-button-next-rotate"))
      : (s.removeClass("nav-button-prev-rotate"),
        e.removeClass("nav-button-next-rotate")),
    $(".nav-button, .nav-comments-button").on("mousedown", function () {
      $(this).addClass("nav-button-down");
    }),
    updateNavButtons();
}
function updateNavButtons() {
  0 != isPro()
    ? ($("#nav_comments_prev, #nav_comments_next").removeClass(
        "nav-button-disabled",
      ),
      (null == getNextNewCommentId() ||
        window.innerHeight + window.pageYOffset >=
          document.body.offsetHeight - 2) &&
        $("#nav_comments_next").addClass("nav-button-disabled"),
      null == getPrevNewCommentId() &&
        $("#nav_comments_prev").addClass("nav-button-disabled"))
    : $("#top_button, #bottom_button, #prev_button, #next_button").hide();
}
function goToPrevListPage() {
  var e,
    t = new URL(window.location);
  1 == onIndexPage()
    ? 0 == t.searchParams.has("p")
      ? goToDay(-1)
      : history.back()
    : 1 == t.searchParams.has("p") &&
      ((e = parseInt(t.searchParams.get("p")) - 1) <= 1
        ? t.searchParams.delete("p")
        : t.searchParams.set("p", e),
      (location.href = t.href));
}
function goToNextListPage() {
  var e = new URL(window.location);
  1 == onIndexPage()
    ? 0 == e.searchParams.has("p")
      ? goToDay(1)
      : history.forward()
    : 0 < $(".hn-items-more").length && $(".hn-items-more")[0].click();
}
var scrollToCommentRepeatTimer,
  scrollToCommentRepeatDelayTimer,
  lastScrolledToIdsTimer,
  scrollToCommentOffset = 83,
  scrollToCommentOffsetPrev = -5,
  scrollToCommentOffsetNext = 90,
  scrollToCommentDuration = 80,
  scrollToCommentRepeatDuration = 0,
  scrollToCommentRepeatStarted = !1,
  scrollToCommentRepeatDelay = 250,
  scrollToCommentRepeatInterval = 240,
  lastScrolledToIds = [];
function getCurrentCommentId() {
  var t = $(window).scrollTop() + scrollToCommentOffsetNext - 20,
    a = null;
  return (
    $(".hn-comment").each(function (e) {
      if ($(this).offset().top > t) return (a = $(this).attr("id")), !1;
    }),
    a
  );
}
function goToPrevComment(e) {
  var t,
    e = void 0 !== e && e,
    a = $(window).scrollTop() - scrollToCommentOffsetPrev,
    o = null,
    s = ".hn-comment-indent-0";
  1 == altDown && 1 == shiftDown
    ? null != (t = getCurrentCommentId()) &&
      (s = ".hn-comment-indent-" + $("#" + t).data("indent"))
    : (1 != altDown && 1 != e) || (s = ".hn-comment"),
    $(s)
      .reverse()
      .each(function (e) {
        var t = $(this).attr("id");
        return (
          -1 != lastScrolledToIds.indexOf(t) ||
          ($(this).offset().top < a ? ((o = t), !1) : void 0)
        );
      }),
    null != o ? scrollToComment(o) : scrollToTop();
}
function goToNextComment(e) {
  var t,
    e = void 0 !== e && e,
    a = $(window).scrollTop() + scrollToCommentOffsetNext,
    o = null,
    s = ".hn-comment-indent-0";
  1 == altDown && 1 == shiftDown
    ? null != (t = getCurrentCommentId()) &&
      (s = ".hn-comment-indent-" + $("#" + t).data("indent"))
    : (1 != altDown && 1 != e) || (s = ".hn-comment"),
    $(s).each(function (e) {
      var t = $(this).attr("id");
      return (
        -1 != lastScrolledToIds.indexOf(t) ||
        ($(this).offset().top > a ? ((o = t), !1) : void 0)
      );
    }),
    null != o ? scrollToComment(o) : scrollToBottom();
}
function scrollToComment(e) {
  lastScrolledToIds.push(e);
  var t =
    1 == scrollToCommentRepeatStarted
      ? scrollToCommentRepeatDuration
      : scrollToCommentDuration;
  clearTimeout(lastScrolledToIdsTimer),
    (lastScrolledToIdsTimer = setTimeout(function () {
      lastScrolledToIds = [];
    }, t + 50)),
    null != e &&
      ((e = $("#" + e).offset().top - scrollToCommentOffset),
      $("html, body").stop().animate({ scrollTop: e }, t, "swing"));
}
jQuery.fn.reverse = [].reverse;
var scrollTopBottomDuration = 80;
function scrollToTop() {
  $("html, body")
    .stop()
    .animate({ scrollTop: 0 }, scrollTopBottomDuration, "linear"),
    setTimeout(function () {
      window.location.replace("#"),
        history.replaceState({}, "", window.location.href.slice(0, -1));
    }, scrollTopBottomDuration + 50);
}
function scrollToBottom() {
  $("html, body")
    .stop()
    .animate(
      { scrollTop: $(document).height() },
      scrollTopBottomDuration,
      "linear",
    );
}
var menuOpen = !1,
  menuName = "",
  menuButtonId = null,
  contextMenuOpen = !1,
  contextMenuName = "",
  contextMenuButtonId = null,
  hideMenuTimer = null;
function showMenu(e, t) {
  if (1 == menuOpen) {
    if (menuName == e && t == menuButtonId) return void hideMenu();
    hideMenu();
  }
  [
    "story_share",
    "comment_share",
    "story_dots",
    "list_dots",
    "comment_dots",
    "story_list_dots",
    "front_date",
  ].indexOf(e),
    (menuButtonId = t),
    "search" != (menuName = e) &&
      $("#" + t).addClass("wiki-header-button-active"),
    clearTimeout(hideMenuTimer),
    $("#menu").remove();
  (e = $("<div />")
    .addClass("menu menu-right")
    .attr("id", "menu")
    .appendTo("body")),
    (t = $("<div />")
      .attr("id", "menu_inner")
      .addClass("menu-inner")
      .appendTo(e));
  "settings" == menuName
    ? (e.removeClass("menu-right"),
      t.addClass("wiki-menu-settings"),
      drawSettingsMenu(t))
    : "history" == menuName
      ? (e.removeClass("menu-right").addClass("menu-center"), drawHistoryMenu())
      : "bookmark" == menuName
        ? (e.removeClass("menu-right").addClass("menu-center"),
          drawBookmarksMenu())
        : "search" == menuName
          ? e.removeClass("menu-right")
          : "user" == menuName
            ? drawUserMenu(t)
            : "overflow" == menuName
              ? (e.removeClass("menu-right"), drawOverflowMenu(t))
              : "story_share" == menuName
                ? (e.removeClass("menu-right"), drawStoryShareMenu(t))
                : "story_dots" == menuName
                  ? (e.removeClass("menu-right"), drawStoryDotsMenu(t))
                  : "list_dots" == menuName
                    ? (e.removeClass("menu-right"), drawListDotsMenu())
                    : "comment_share" == menuName
                      ? (e.removeClass("menu-right"), drawCommentShareMenu(t))
                      : "comment_dots" == menuName
                        ? (e.removeClass("menu-right"), drawCommentDotsMenu(t))
                        : "story_list_dots" == menuName
                          ? (e.removeClass("menu-right"),
                            drawStoryListDotsMenu(t))
                          : "front_date" == menuName &&
                            (e.removeClass("menu-right"), drawFrontDateMenu(t)),
    $("a", t).on("click", function () {
      hideMenu();
    }),
    updateMenuPosition(),
    e.css("animation", "menu-show-anim2 0.15s ease 0s 1 normal forwards"),
    (menuOpen = !0);
}
function updateMenuPosition() {
  var e = $("#menu"),
    t = $("#" + menuButtonId).offset(),
    a = t.left - e.width() + 41,
    o = t.top + 29 - $(window).scrollTop();
  "search" == menuName
    ? ((a -= 16), (o += 0))
    : "overflow" == menuName
      ? ((a = +t.left), --o)
      : "story_share" == menuName ||
          "story_dots" == menuName ||
          "comment_share" == menuName ||
          "comment_dots" == menuName ||
          "story_list_dots" == menuName
        ? ((a = +t.left), (o -= 11))
        : "list_dots" == menuName
          ? ((a = +t.left), (o -= 0))
          : "bookmark" == menuName || "history" == menuName
            ? (a = $(window).width() - e.width() - 20)
            : "front_date" == menuName
              ? ((a = t.left + 16), (o += 22))
              : "settings" == menuName &&
                ((a = +t.left), 0 == isPro() && (a -= 20)),
    e.css("left", a + "px").css("right", "auto"),
    o + e.outerHeight() > window.innerHeight &&
      ((o = o - e.outerHeight() - $("#" + menuButtonId).outerHeight() - 12),
      e.addClass("menu-above")),
    e.css("bottom", "").css("top", o + "px");
}
function hideMenu(e) {
  e = void 0 === e || e;
  hideContextMenu(!1),
    $(".wiki-header-button-active").removeClass("wiki-header-button-active"),
    $(".hn-comment-icons-active").removeClass("hn-comment-icons-active"),
    $(".hn-story-info-rating-hidden").removeClass(
      "hn-story-info-rating-hidden",
    ),
    $(".hn-item-icons-active").removeClass("hn-item-icons-active"),
    0 != menuOpen &&
      (1 == e
        ? $("#menu").css(
            "animation",
            "menu-hide-anim2 0.25s ease 0s 1 normal forwards",
          )
        : $("#menu").css(
            "animation",
            "menu-hide-anim2 0.01s ease 0s 1 normal forwards",
          ),
      (menuOpen = !1));
}
function hideContextMenu(e) {
  e = void 0 === e || e;
  $(".wiki-menu-button-active").removeClass("wiki-menu-button-active"),
    0 != contextMenuOpen &&
      (1 == e
        ? $("#context_menu").css(
            "animation",
            "menu-hide-anim2 0.25s ease 0s 1 normal forwards",
          )
        : $("#context_menu").css(
            "animation",
            "menu-hide-anim2 0.01s ease 0s 1 normal forwards",
          ),
      (contextMenuOpen = !1),
      (selectedHighlightId = null));
}
var showContextMenuTimer = null;
function showContextMenu(e, t, a) {
  if (1 == contextMenuOpen) {
    if (contextMenuButtonId == t) return void hideContextMenu();
    hideContextMenu();
  }
  clearTimeout(showContextMenuTimer),
    (showContextMenuTimer = setTimeout(function () {
      doShowContextMenu(e, t, a);
    }, 40));
}
function doShowContextMenu(e, t, a) {
  (contextMenuName = e),
    (contextMenuButtonId = t),
    (selectedHighlightId = a),
    (contextMenuOpen = !0),
    $("#" + t).addClass("wiki-menu-button-active"),
    clearTimeout(hideMenuTimer),
    $("#context_menu").remove();
  (e = $("<div />")
    .addClass("menu menu-right")
    .attr("id", "context_menu")
    .appendTo("body")),
    (a = $("<div />")
      .attr("id", "context_menu_inner")
      .addClass("menu-inner context-menu-inner")
      .appendTo(e)),
    $("#" + t).offset();
  "bookmarks_settings" == contextMenuName
    ? drawBookmarksSettingsMenu(a)
    : "menu_highlights_row" == contextMenuName &&
      (a.addClass("menu-inner-no-overflow"), drawHighlightMenu(a)),
    updateContextMenuPosition(),
    e.css("animation", "menu-show-anim2 0.15s ease 0s 1 normal forwards");
}
function updateContextMenuPosition() {
  var e = $("#context_menu"),
    t = $("#" + contextMenuButtonId).offset(),
    a = t.left - e.width() + 32,
    o = t.top + 6 - $(window).scrollTop(),
    t = !0;
  "bookmarks_settings" == contextMenuName
    ? ((a -= 3), (o += 9), (t = !1))
    : "menu_highlights_row" == contextMenuName && (a -= 3),
    e.css("left", a + "px").css("right", "auto"),
    1 == t &&
      ((o = o - e.outerHeight() - $("#" + menuButtonId).outerHeight() + 15),
      e.addClass("menu-above")),
    e.css("bottom", "").css("top", o + "px");
}
function drawBookmarksSettingsMenu(e) {
  var t, a, o;
  e.html(""),
    e.addClass("menu-inner-rows menu-inner-rows-icons"),
    1 == isLoggedIn() &&
      "highlights" != app.bookmarks.tab &&
      (-1 != app.bookmarks.tab.indexOf("_fav") &&
        ($("<a />")
          .text("Storage")
          .attr("href", "")
          .addClass("menu-row menu-row-heading")
          .appendTo(e)
          .on("click", function (e) {
            return (
              e.stopPropagation(),
              e.stopImmediatePropagation(),
              e.preventDefault(),
              !1
            );
          }),
        (t = $("<a />")
          .text("Private")
          .attr("title", "Saved to local storage")
          .attr("href", "")
          .addClass("menu-row")
          .appendTo(e)),
        (a = $("<a />")
          .text("Public")
          .attr("title", "Saved to your HN profile")
          .attr("href", "")
          .addClass("menu-row")
          .appendTo(e)),
        t.on("click", function (e) {
          return (
            (app.bookmarks.storage = "private"),
            saveBookmarks(),
            hideContextMenu(),
            drawBookmarksMenu(),
            updateStoryBookmarkButton(),
            updateCommentBookmarkButtons(),
            toggleBookmarkSwitchers(),
            e.stopPropagation(),
            e.stopImmediatePropagation(),
            e.preventDefault(),
            !1
          );
        }),
        a.on("click", function (e) {
          return (
            (app.bookmarks.storage = "public"),
            saveBookmarks(),
            onItemPage(),
            hideContextMenu(),
            drawBookmarksMenu(),
            updateStoryBookmarkButton(),
            updateCommentBookmarkButtons(),
            toggleBookmarkSwitchers(),
            e.stopPropagation(),
            e.stopImmediatePropagation(),
            e.preventDefault(),
            !1
          );
        }),
        (o = $("<div />")
          .addClass("menu-row-tick")
          .css(
            "background-image",
            "url('" + getImageUrl("images/icon-tick.png") + "')",
          )),
        "public" == getBookmarksStorage() ? o.prependTo(a) : o.prependTo(t)),
      ("public" != getBookmarksStorage() &&
        -1 != app.bookmarks.tab.indexOf("_fav")) ||
        (-1 != app.bookmarks.tab.indexOf("_fav") &&
          $("<div />").addClass("menu-row-sep").appendTo(e),
        $("<a />")
          .text("Reload")
          .attr("href", "")
          .addClass("menu-row")
          .appendTo(e)
          .on("click", function (e) {
            return (
              hideContextMenu(),
              getBookmarks(),
              e.stopPropagation(),
              e.stopImmediatePropagation(),
              e.preventDefault(),
              !1
            );
          }))),
    (-1 == app.bookmarks.tab.indexOf("comments_") &&
      "highlights" != app.bookmarks.tab) ||
      (1 == isLoggedIn() &&
        "highlights" != app.bookmarks.tab &&
        $("<div />").addClass("menu-row-sep").appendTo(e),
      (e = $("<a />")
        .text("Truncate")
        .attr("href", "")
        .addClass("menu-row")
        .appendTo(e)).on("click", function (e) {
        return (
          "highlights" == app.bookmarks.tab
            ? (app.bookmarks.highlights_truncate =
                !app.bookmarks.highlights_truncate)
            : (app.bookmarks.comments_truncate =
                !app.bookmarks.comments_truncate),
          hideContextMenu(),
          saveBookmarks(),
          drawBookmarksMenu(),
          e.stopPropagation(),
          e.stopImmediatePropagation(),
          e.preventDefault(),
          !1
        );
      }),
      (o = $("<div />")
        .addClass("menu-row-tick")
        .css(
          "background-image",
          "url('" + getImageUrl("images/icon-tick.png") + "')",
        )),
      (("highlights" == app.bookmarks.tab &&
        1 == app.bookmarks.highlights_truncate) ||
        ("highlights" != app.bookmarks.tab &&
          1 == app.bookmarks.comments_truncate)) &&
        o.prependTo(e));
}
var sliderBgColor = "rgba(var(--theme-colors),0.8)";
function drawSettingsMenu(e) {
  var t = $("<div />").addClass("settings-menu-wrap").appendTo(e),
    a = $("<div />").addClass("menu-small-tabs").appendTo(t),
    o = $("<div />")
      .text("Theme")
      .attr("id", "menu_tab_theme")
      .addClass("menu-small-tab")
      .appendTo(a),
    s = $("<div />")
      .text("Settings")
      .attr("id", "menu_tab_settings")
      .addClass("menu-small-tab")
      .appendTo(a),
    e = $("<div />")
      .text("About")
      .attr("id", "menu_tab_about")
      .addClass("menu-small-tab")
      .appendTo(a);
  ("theme" == app.settings.settings_tab
    ? o
    : "about" == app.settings.settings_tab
      ? e
      : s
  ).addClass("menu-small-tab-selected"),
    $("div", a)
      .off("click")
      .on("click", function () {
        var e = $(this).attr("id").split("_")[2];
        (app.settings.settings_tab = e),
          saveSettings(),
          $(".menu-small-tab-selected").removeClass("menu-small-tab-selected"),
          $("#menu_tab_" + app.settings.settings_tab).addClass(
            "menu-small-tab-selected",
          ),
          drawSettingsTab();
      }),
    $("<div />")
      .attr("id", "menu_tab_content")
      .addClass("menu-tab-content")
      .appendTo(t),
    drawSettingsTab();
}
function drawSettingsTab() {
  ("theme" == app.settings.settings_tab
    ? drawTabStyle
    : "about" == app.settings.settings_tab
      ? drawTabAbout
      : drawTabSettings)();
}
function drawTabStyle() {
  var e = $("#menu_tab_content").html(""),
    t = $("<div />")
      .addClass("settings-row settings-row-font settings-row-top")
      .appendTo(e),
    a = $("<div />").addClass("settings-font-wrap").appendTo(t),
    o = $("<div />")
      .addClass("settings-font-button settings-font-button-sans")
      .appendTo(a);
  $("<div />").addClass("settings-font-button-title").text("Sans").appendTo(o),
    $("<div />")
      .addClass("settings-font-button-preview")
      .text("Aa")
      .appendTo(o);
  var s = $("<div />")
    .addClass("settings-font-button settings-font-button-serif")
    .appendTo(a);
  $("<div />").addClass("settings-font-button-title").text("Serif").appendTo(s),
    $("<div />")
      .addClass("settings-font-button-preview")
      .text("Aa")
      .appendTo(s),
    o.on("click", function () {
      updateSettingFont("sans");
    }),
    s.on("click", function () {
      updateSettingFont("serif");
    }),
    "sans" == getSettingFont()
      ? o.addClass("settings-font-button-selected")
      : "serif" == getSettingFont() &&
        s.addClass("settings-font-button-selected");
  var n = $("<div />").addClass("settings-row").appendTo(e),
    t = $("<div />").addClass("settings-slider-wrap").appendTo(n),
    a = $("<div />")
      .addClass("settings-slider-icon settings-slider-icon-left")
      .appendTo(t),
    o = $("<div />")
      .addClass("settings-slider-icon settings-slider-icon-right")
      .appendTo(t);
  a.on("click", function () {
    var e = parseInt($("#font_size_slider").attr("min")),
      t = parseFloat($("#font_size_slider").attr("step")),
      t = getSettingFontSize() - t;
    t < e && (t = e);
    e = $("#font_size_slider").val(t);
    updateSettingFontSize(t), updateSliderTrackSize(e);
  }),
    o.on("click", function () {
      var e = parseInt($("#font_size_slider").attr("max")),
        t = parseFloat($("#font_size_slider").attr("step")),
        t = getSettingFontSize() + t;
      e < t && (t = e);
      e = $("#font_size_slider").val(t);
      updateSettingFontSize(t), updateSliderTrackSize(e);
    });
  (s = getImageUrl("images/icon-font-up.png")),
    getImageUrl("images/icon-font-down.png");
  a
    .css("background-image", "url('" + s + "')")
    .addClass("settings-slider-icon-font-down"),
    o.css("background-image", "url('" + s + "')");
  (n = 0),
    (a = 19),
    (n = 12),
    (a = 24),
    (o = $("<input />")
      .attr("id", "font_size_slider")
      .addClass("knob-slider")
      .appendTo(t));
  o.attr({
    type: "range",
    min: n,
    max: a,
    step: 0.25,
    value: getSettingFontSize(),
  }),
    updateSliderStyle(o),
    updateSliderTrackSize(o),
    o.on("input change", function (e) {
      updateSettingFontSize(parseFloat($(this).val()));
    }),
    o.on("input", function (e) {
      updateSliderTrackSize($(e.target));
    }),
    o.on("mouseup touchend", function () {
      $(this).blur();
    });
  (s = $("<div />").addClass("settings-row").appendTo(e)),
    (t = $("<div />").addClass("settings-slider-wrap").appendTo(s)),
    (n = $("<div />")
      .addClass("settings-slider-icon settings-slider-icon-left")
      .appendTo(t)),
    (a = $("<div />")
      .addClass("settings-slider-icon settings-slider-icon-right")
      .appendTo(t));
  n.on("click", function () {
    var e = parseInt($("#line_height_slider").attr("min")),
      t = parseFloat($("#line_height_slider").attr("step")),
      t = getSettingLineHeight() - t;
    t < e && (t = e);
    e = $("#line_height_slider").val(t);
    updateSettingLineHeight(t), updateSliderTrackSize(e);
  }),
    a.on("click", function () {
      var e = parseInt($("#line_height_slider").attr("max")),
        t = parseFloat($("#line_height_slider").attr("step")),
        t = getSettingLineHeight() + t;
      e < t && (t = e);
      e = $("#line_height_slider").val(t);
      updateSettingLineHeight(t), updateSliderTrackSize(e);
    }),
    n.addClass("settings-slider-icon-line-height"),
    a.addClass("settings-slider-icon-line-height");
  (o = getImageUrl("images/icon-line-height-up2.png")),
    (s = getImageUrl("images/icon-line-height-down2.png"));
  n.css("background-image", "url('" + s + "')"),
    a.css("background-image", "url('" + o + "')");
  (n = 1), (s = 3.5), (a = 0.05);
  1 == onListPage() && ((n = 0), (s = 50), (a = 0.5));
  o = $("<input />")
    .attr("id", "line_height_slider")
    .addClass("knob-slider")
    .appendTo(t);
  o.attr({
    type: "range",
    min: n,
    max: s,
    step: a,
    value: getSettingLineHeight(),
  }),
    updateSliderStyle(o),
    updateSliderTrackSize(o),
    o.on("input change", function (e) {
      updateSettingLineHeight(parseFloat($(this).val()));
    }),
    o.on("input", function (e) {
      updateSliderTrackSize($(e.target));
    }),
    o.on("mouseup touchend", function () {
      $(this).blur();
    });
  (t = $("<div />").addClass("settings-row").appendTo(e)),
    (n = $("<div />").addClass("settings-slider-wrap").appendTo(t)),
    (s = $("<div />")
      .addClass("settings-slider-icon settings-slider-icon-left")
      .appendTo(n)),
    (a = $("<div />")
      .addClass("settings-slider-icon settings-slider-icon-right")
      .appendTo(n));
  s.addClass("settings-slider-icon-width"),
    a.addClass("settings-slider-icon-width"),
    s.on("click", function () {
      var e = getSettingWidth() - 1;
      e < 0 && (e = 0);
      var t = $("#width_slider").val(e);
      updateSettingWidth(e), updateSliderTrackSize(t);
    }),
    a.on("click", function () {
      var e = getSettingWidth() + 1;
      100 < e && (e = 100);
      var t = $("#width_slider").val(e);
      updateSettingWidth(e), updateSliderTrackSize(t);
    });
  (o = getImageUrl("images/icon-width-up6.png")),
    (t = getImageUrl("images/icon-width-down5.png"));
  s.css("background-image", "url('" + t + "')"),
    a.css("background-image", "url('" + o + "')");
  t = $("<input />")
    .attr("id", "width_slider")
    .addClass("knob-slider")
    .appendTo(n);
  t.attr({
    type: "range",
    min: 20,
    max: 100,
    step: 1,
    value: getSettingWidth(),
  }),
    updateSliderStyle(t),
    updateSliderTrackSize(t),
    t.on("input change", function (e) {
      updateSettingWidth(parseInt($(this).val()));
    }),
    t.on("input", function (e) {
      updateSliderTrackSize($(e.target));
    }),
    t.on("mouseup touchend", function () {
      $(this).blur();
    });
  (a = $("<div />").addClass("settings-row settings-row-colors").appendTo(e)),
    (o = $("<div />")
      .addClass("settings-color settings-color-light")
      .appendTo(a)),
    (n = $("<div />")
      .addClass("settings-color settings-color-sepia")
      .appendTo(a)),
    (t = $("<div />")
      .addClass("settings-color settings-color-slate")
      .appendTo(a)),
    (e = $("<div />")
      .addClass("settings-color settings-color-dark")
      .appendTo(a)),
    (a = $("<div />")
      .addClass("settings-color settings-color-black")
      .appendTo(a));
  "light" == app.settings.theme
    ? o.addClass("settings-color-selected")
    : "sepia" == app.settings.theme
      ? n.addClass("settings-color-selected")
      : "slate" == app.settings.theme
        ? t.addClass("settings-color-selected")
        : "dark" == app.settings.theme
          ? e.addClass("settings-color-selected")
          : "black" == app.settings.theme &&
            a.addClass("settings-color-selected"),
    o.on("click", function () {
      updateSettingTheme((app.settings.auto_theme_light = "light"));
    }),
    n.on("click", function () {
      updateSettingTheme((app.settings.auto_theme_light = "sepia"));
    }),
    t.on("click", function () {
      updateSettingTheme((app.settings.auto_theme_dark = "slate"));
    }),
    e.on("click", function () {
      updateSettingTheme((app.settings.auto_theme_dark = "dark"));
    }),
    a.on("click", function () {
      updateSettingTheme((app.settings.auto_theme_dark = "black"));
    });
}
function drawTabAbout() {
  var e = $("#menu_tab_content").html(""),
    t = $("<div />").addClass("settings-about-wrap").appendTo(e);
  $("<a />")
    .attr("href", "https://www.modernhn.com/")
    .attr("target", "_blank")
    .addClass("settings-about-logo")
    .appendTo(t)
    .css("background-image", "url('" + getImageUrl("images/icon.png") + "')"),
    $("<div />")
      .addClass("settings-about-heading")
      .text("Modern for Hacker News")
      .appendTo(t);
  (e = $("<div />").addClass("settings-about-version-wrap").appendTo(t)),
    $("<div />")
      .addClass("settings-about-version")
      .text("Version " + app.version)
      .appendTo(e);
  1 == isPro() &&
    $("<div />").addClass("settings-about-pro").text("Pro").appendTo(e),
    $("<a />")
      .attr("href", "https://www.modernhn.com/")
      .attr("target", "_blank")
      .html("Website")
      .addClass("settings-about-link")
      .appendTo(t),
    $("<a />")
      .attr("href", "https://www.modernhn.com/contact")
      .attr("target", "_blank")
      .text("Contact")
      .addClass("settings-about-link")
      .appendTo(t),
    $("<a />")
      .attr("href", "https://www.modernhn.com/help")
      .attr("target", "_blank")
      .text("Help")
      .addClass("settings-about-link")
      .appendTo(t);
}
function drawTabSettings() {
  var e = $("#menu_tab_content").html(""),
    t = $("<div />")
      .attr("id", "menu_toggles_wrap")
      .addClass("settings-toggles-wrap")
      .appendTo(e);
  0 == isPro() &&
    $("<div />")
      .addClass("settings-row-more settings-row-pro")
      .html(
        "<i></i><b></b>Unlock Modern <u>Pro</u><span>More awesome features...</span><div></div>",
      )
      .appendTo(t)
      .on("click", function () {
        showUpgradeDialog();
      }),
    addSettingsToggle("fixed_header", "Fixed Header"),
    addSettingsToggle("new_tab", "Open Links In New Tab"),
    1 == onItemPage() &&
      (addSettingsToggle("fade_low", "Fade Low Rated"),
      1 == isPro() &&
        addSettingsToggle("highlight_new", "Highlight New Replies")),
    addSettingsToggle("auto_theme", "Auto Dark Theme"),
    1 == onItemPage() && addSettingsToggle("justify", "Justify Text"),
    addSettingsToggle("font_smoothing", "Font Smoothing"),
    addSettingsToggle("fade_visited", "Fade Visited Links"),
    addSettingsToggle("hover_icons", "Show Icons On Hover"),
    1 == isPro() &&
      $("<div />")
        .addClass("settings-row-more")
        .html("Manage Data<div></div>")
        .appendTo(t)
        .on("click", function () {
          $("#menu_toggles_wrap").hide(), $("#menu_backup_wrap").show();
        });
  e = $("<div />")
    .attr("id", "menu_backup_wrap")
    .addClass("settings-backup-wrap")
    .appendTo(e);
  $("<div />")
    .addClass("settings-row-back")
    .html("<div></div>Back")
    .appendTo(e)
    .on("click", function () {
      $("#menu_toggles_wrap").show(), $("#menu_backup_wrap").hide();
    }),
    $("<div />")
      .addClass("settings-row-info")
      .text("Save or restore your data and settings using a JSON file:")
      .appendTo(e);
  e = $("<div />").addClass("settings-buttons-wrap").appendTo(e);
  $("<div />")
    .addClass("settings-row-button")
    .text("Import")
    .appendTo(e)
    .on("click", function () {
      $("#import_file_input").click();
    }),
    $("<input />")
      .attr("type", "file")
      .attr("id", "import_file_input")
      .addClass("settings-file-input")
      .appendTo(e)
      .on("change", function () {
        var t = new FileReader();
        (t.onload = function () {
          var e = t.result;
          1 ==
            confirm(
              "Your current settings, history and private bookmarks will be replaced with the imported data. Are you sure?",
            ) &&
            ((e = JSON.parse(e)),
            (app.settings = e.settings),
            (app.bookmarks = e.bookmarks),
            (app.history = e.history),
            (app.bookmarks.stories_fav = { updated: null, items: [] }),
            (app.bookmarks.stories_upvoted = { updated: null, items: [] }),
            (app.bookmarks.stories_posted = { updated: null, items: [] }),
            (app.bookmarks.comments_fav = { updated: null, items: [] }),
            (app.bookmarks.comments_upvoted = { updated: null, items: [] }),
            (app.bookmarks.comments_posted = { updated: null, items: [] }),
            saveSettings(),
            saveBookmarks(),
            saveHistory(),
            1 == confirm("Import complete. Reload to see changes?") &&
              location.reload());
        }),
          t.readAsText($(this).prop("files")[0]);
      }),
    $("<div />")
      .addClass("settings-row-button")
      .text("Export")
      .appendTo(e)
      .on("click", function () {
        var e = {
          settings: JSON.parse(JSON.stringify(app.settings)),
          bookmarks: JSON.parse(JSON.stringify(app.bookmarks)),
          history: JSON.parse(JSON.stringify(app.history)),
        };
        delete e.bookmarks.stories_fav,
          delete e.bookmarks.stories_upvoted,
          delete e.bookmarks.stories_posted,
          delete e.bookmarks.comments_fav,
          delete e.bookmarks.comments_upvoted,
          delete e.bookmarks.comments_posted;
        var t = JSON.stringify(e),
          a = Math.round(new Date().getTime() / 1e3),
          e = DateTime.fromSeconds(a).toISODate(),
          a = new Blob([t], { type: "application/json" }),
          t = document.createElement("a");
        (t.href = window.URL.createObjectURL(a)),
          (t.download = "modernhn_" + e + ".json"),
          t.click();
      });
}
function showUpgradeDialog() {
  showDialog("upgrade");
}
function addSettingsToggle(e, t, a) {
  var a = void 0 !== a && a,
    o = $("#menu_toggles_wrap"),
    o = $("<div />")
      .addClass("settings-row settings-row-toggle")
      .data("name", e)
      .appendTo(o);
  $("<div />")
    .addClass("toggle")
    .html("<span></span>")
    .attr("id", "toggle_" + e)
    .appendTo(o);
  0 == a && o.addClass("settings-row-top"),
    updateToggleValue(e),
    $("<div />").addClass("settings-menu-label").text(t).appendTo(o),
    o.on("click", function () {
      var e = $(this).data("name");
      $(".toggle", this).toggleClass("toggle-selected"),
        "fixed_header" == e
          ? ((app.settings.fixed_header = !app.settings.fixed_header),
            updateSettingHeader())
          : "justify" == e
            ? ((app.settings.justify = !app.settings.justify),
              updateSettingJustify())
            : "font_smoothing" == e
              ? ((app.settings.font_smoothing = !app.settings.font_smoothing),
                updateSettingFontSmoothing(),
                "firefox" == app.browser &&
                  1 ==
                    confirm(
                      "Font smoothing " +
                        (app.settings.font_smoothing ? "enabled" : "disabled") +
                        ". Reload to see changes?",
                    ) &&
                  location.reload())
              : "new_tab" == e
                ? ((app.settings.new_tab = !app.settings.new_tab),
                  updateSettingNewTab())
                : "auto_theme" == e
                  ? (app.settings.auto_theme = !app.settings.auto_theme)
                  : "fade_low" == e
                    ? ((app.settings.fade_low = !app.settings.fade_low),
                      updateSettingFadeLow())
                    : "fade_visited" == e
                      ? ((app.settings.fade_visited =
                          !app.settings.fade_visited),
                        updateSettingFadeVisited())
                      : "highlight_new" == e
                        ? ((app.settings.highlight_new =
                            !app.settings.highlight_new),
                          updateSettingHighlightNew())
                        : "hover_icons" == e &&
                          ((app.settings.hover_icons =
                            !app.settings.hover_icons),
                          updateSettingHoverIcons()),
        saveSettings();
    });
}
function updateSettingHoverIcons() {
  1 == app.settings.hover_icons
    ? $("body").addClass("theme-hover-icons")
    : $("body").removeClass("theme-hover-icons");
}
function updateSettingFadeLow() {
  1 == app.settings.fade_low
    ? $("body").addClass("theme-fade-low")
    : $("body").removeClass("theme-fade-low");
}
function updateSettingFadeVisited() {
  1 == app.settings.fade_visited
    ? $("body").addClass("theme-fade-visited")
    : $("body").removeClass("theme-fade-visited");
}
function updateSettingHighlightNew() {
  1 == app.settings.highlight_new
    ? $("body").addClass("theme-highlight-new")
    : $("body").removeClass("theme-highlight-new");
}
function updateSettingJustify() {
  1 == app.settings.justify
    ? $("body").addClass("theme-justify")
    : $("body").removeClass("theme-justify");
}
function updateSettingFontSmoothing() {
  1 == app.settings.font_smoothing
    ? $("body").addClass("theme-font-smoothing")
    : $("body").removeClass("theme-font-smoothing");
}
function updateSettingNewTab() {
  1 == app.settings.new_tab
    ? $(
        "a.hn-item-title, a.hn-story-title, .hn-story-text a, .hn-comment-text a",
      ).each(function () {
        return (
          null == $(this).attr("href") ||
          void (
            -1 == $(this).attr("href").indexOf("item?id=") &&
            $(this).attr("target", "_blank")
          )
        );
      })
    : $(
        "a.hn-item-title, a.hn-story-title, .hn-story-text a, .hn-comment-text a",
      ).removeAttr("target");
}
function updateToggleValue(e) {
  var t = $("#toggle_" + e),
    a = !1;
  "fixed_header" == e
    ? (a = app.settings.fixed_header)
    : "justify" == e
      ? (a = app.settings.justify)
      : "font_smoothing" == e
        ? (a = app.settings.font_smoothing)
        : "new_tab" == e
          ? (a = app.settings.new_tab)
          : "auto_theme" == e
            ? (a = app.settings.auto_theme)
            : "fade_low" == e
              ? (a = app.settings.fade_low)
              : "fade_visited" == e
                ? (a = app.settings.fade_visited)
                : "highlight_new" == e
                  ? (a = app.settings.highlight_new)
                  : "hover_icons" == e && (a = app.settings.hover_icons),
    1 == a ? t.addClass("toggle-selected") : t.removeClass("toggle-selected");
}
function drawUserMenu(e) {
  if ((e.addClass("menu-inner-rows"), 0 == isLoggedIn())) {
    var t = $(".pagetop a:contains('login')").first().attr("href");
    null == t && (t = "login"),
      $("<a />")
        .text("Login")
        .attr("href", t)
        .addClass("menu-row")
        .appendTo(e)
        .on("click", function (e) {
          return (
            showDialog("login"),
            e.stopPropagation(),
            e.stopImmediatePropagation(),
            e.preventDefault(),
            !1
          );
        });
  } else {
    var a = $("#me").text(),
      o = 0;
    try {
      o = parseInt($("#karma").text());
    } catch (e) {
      try {
        o = $("#me")[0].nextSibling.nodeValue.split("(")[1].split(")")[0];
      } catch (e) {
        console.log("Error getting karma: " + e);
      }
    }
    var s = $("#me").attr("href"),
      t = $("#logout").attr("href"),
      s = $("<a />")
        .html("<b>" + a + "</b>")
        .attr("href", s)
        .addClass("menu-row")
        .appendTo(e);
    $("<div />")
      .addClass("menu-row-tagline")
      .text(commaSeparateNumber(o) + " Karma")
      .appendTo(s),
      $("<div />").addClass("menu-row-sep").appendTo(e),
      $("<a />")
        .html("Stories")
        .attr("href", "submitted?id=" + a)
        .addClass("menu-row")
        .appendTo(e),
      $("<a />")
        .html("Comments")
        .attr("href", "threads?id=" + a)
        .addClass("menu-row")
        .appendTo(e),
      $("<a />")
        .html("Favorites")
        .attr("href", "favorites?id=" + a)
        .addClass("menu-row")
        .appendTo(e),
      $("<a />")
        .html("Upvoted")
        .attr("href", "upvoted?id=" + a)
        .addClass("menu-row")
        .appendTo(e),
      $("<a />")
        .html("Hidden")
        .attr("href", "hidden")
        .addClass("menu-row")
        .appendTo(e),
      $("<div />").addClass("menu-row-sep").appendTo(e),
      $("<a />")
        .html("Logout")
        .attr("href", t)
        .addClass("menu-row")
        .appendTo(e);
  }
}
function drawOverflowMenu(e) {
  e.addClass("menu-inner-rows"),
    $("<a />")
      .html("Noobs")
      .attr("href", "/noobstories")
      .attr("title", "Posts from new accounts")
      .addClass("menu-row")
      .appendTo(e),
    $("<a />")
      .html("Pool")
      .attr("href", "/pool")
      .attr("title", "Second chance pool")
      .addClass("menu-row")
      .appendTo(e),
    $("<a />")
      .html("Jobs")
      .attr("href", "/jobs")
      .addClass("menu-row")
      .appendTo(e),
    $("<a />")
      .html("Leaders")
      .attr("href", "/leaders")
      .attr("title", "Users with most karma")
      .addClass("menu-row")
      .appendTo(e),
    $("<div />").addClass("menu-row-sep").appendTo(e),
    $("<a />")
      .html("Submit")
      .attr("href", "/submit")
      .addClass("menu-row")
      .appendTo(e)
      .on("click", function (e) {
        return (
          0 == isLoggedIn() ? showDialog("login") : showDialog("submit"),
          e.stopPropagation(),
          e.stopImmediatePropagation(),
          e.preventDefault(),
          !1
        );
      });
}
var applySettingsTimer,
  datePicker = null;
function drawFrontDateMenu(e) {
  null != datePicker && (datePicker.destroy(), (datePicker = null));
  var t = $("<div />")
      .attr("id", "date_picker")
      .addClass("date-picker-wrap")
      .appendTo(e),
    a = Math.round(new Date().getTime() / 1e3),
    e = DateTime.fromSeconds(a),
    a = new URLSearchParams(window.location.search),
    e = e.toJSDate();
  a.has("day") && (e = a.get("day")),
    (datePicker = new Litepicker({
      element: t[0],
      plugins: ["mobilefriendly"],
      singleMode: !0,
      inlineMode: !0,
      scrollToDate: !0,
      minDate: "2007-02-19",
      startDate: e,
      maxDate: Date.now(),
      dropdowns: { minYear: 2007, maxYear: null, months: !0, years: !0 },
      setup: (e) => {
        e.on("selected", (e, t) => {
          e = datePicker.DateTime(e).format("YYYY-MM-DD");
          location.href = "https://news.ycombinator.com/front?day=" + e;
        });
      },
    }));
}
function goToDay(e) {
  var t = Math.round(new Date().getTime() / 1e3),
    a = DateTime.fromSeconds(t),
    t = (t = getIndexDate()).plus({ day: e });
  t < DateTime.fromISO("2007-02-19") ||
    a <= t ||
    ((t = t.toISODate()),
    (location.href = "https://news.ycombinator.com/front?day=" + t));
}
function getIndexDate() {
  var e = Math.round(new Date().getTime() / 1e3),
    t = (DateTime.fromSeconds(e), DateTime.fromSeconds(e)),
    a = new URLSearchParams(window.location.search),
    e = t.toJSDate();
  return a.has("day") && ((e = a.get("day")), (t = DateTime.fromISO(e))), t;
}
function drawStoryShareMenu(e) {
  e.addClass("menu-inner-rows"),
    addShareMenuItems(
      e,
      encodeURIComponent(
        "https://news.ycombinator.com/item?id=" + app.story.id,
      ),
      encodeURIComponent(app.story.title),
      encodeURIComponent(
        app.story.title +
          " https://news.ycombinator.com/item?id=" +
          app.story.id,
      ),
      "https://news.ycombinator.com/item?id=" + app.story.id,
    );
}
function drawCommentShareMenu(e) {
  e.addClass("menu-inner-rows"),
    $("#comment_icons_" + currentMenuCommentIndex).addClass(
      "hn-comment-icons-active",
    ),
    $("#comment_rating_" + currentMenuCommentIndex).addClass(
      "hn-story-info-rating-hidden",
    );
  var t = app.story.comments[currentMenuCommentIndex],
    a = $("<div />").html(t.text.replace("<p>", " <p>")).text();
  100 < a.length && (a = a.slice(0, 100) + "..."),
    addShareMenuItems(
      e,
      encodeURIComponent("https://news.ycombinator.com/item?id=" + t.id),
      encodeURIComponent("Comment by " + t.user + " on Hacker News"),
      encodeURIComponent(
        t.user +
          " wrote: " +
          a +
          " https://news.ycombinator.com/item?id=" +
          t.id,
      ),
      "https://news.ycombinator.com/item?id=" + t.id,
    );
}
function addShareMenuItems(e, t, a, o, s) {
  var n = "mailto:?subject=" + a + "&body=" + t,
    i = "https://twitter.com/share?url=" + t,
    r = "https://www.facebook.com/sharer/sharer.php?u=" + t,
    d = "https://wa.me/?text=" + o,
    a = "https://www.reddit.com/submit?url=" + t + "&title=" + a,
    o =
      "https://www.linkedin.com/shareArticle?mini=true&url=" +
      t +
      "&title=" +
      o,
    s = $("<a />")
      .html("Copy Link")
      .attr("id", "copy_menu_item")
      .data("copy_url", s)
      .attr("href", "")
      .addClass("menu-row")
      .appendTo(e);
  $("<a />")
    .html("Email")
    .attr("href", n)
    .attr("target", "_blank")
    .addClass("menu-row")
    .appendTo(e),
    $("<a />")
      .html("Twitter")
      .attr("href", i)
      .attr("target", "_blank")
      .addClass("menu-row")
      .appendTo(e),
    $("<a />")
      .html("Facebook")
      .attr("href", r)
      .attr("target", "_blank")
      .addClass("menu-row")
      .appendTo(e),
    $("<a />")
      .html("Reddit")
      .attr("href", a)
      .attr("target", "_blank")
      .addClass("menu-row")
      .appendTo(e),
    $("<a />")
      .html("LinkedIn")
      .attr("href", o)
      .attr("target", "_blank")
      .addClass("menu-row")
      .appendTo(e),
    $("<a />")
      .html("WhatsApp")
      .attr("href", d)
      .attr("target", "_blank")
      .addClass("menu-row")
      .appendTo(e),
    s.on("click", function (e) {
      var t = $(this).data("copy_url");
      return (
        clipboard.writeText(t),
        $("#copy_menu_item").text("Copied!"),
        setTimeout(function () {
          hideMenu();
        }, 200),
        e.stopPropagation(),
        e.stopImmediatePropagation(),
        e.preventDefault(),
        !1
      );
    });
}
function drawStoryDotsMenu(e) {
  e.addClass("menu-inner-rows"),
    0 < $(".hn-comment-highlight").length &&
      ($("<a />")
        .text("Mark as read")
        .attr("href", "")
        .addClass("menu-row")
        .appendTo(e)
        .on("click", function (e) {
          return (
            hideMenu(),
            markStoryAsRead(),
            e.stopPropagation(),
            e.stopImmediatePropagation(),
            e.preventDefault(),
            !1
          );
        }),
      $("<div />").addClass("menu-row-sep").appendTo(e)),
    $("<a />")
      .html("Share...")
      .attr("href", "/")
      .addClass("menu-row")
      .appendTo(e)
      .on("click", function (e) {
        return (
          showMenu("story_share", "story_dots"),
          e.stopPropagation(),
          e.stopImmediatePropagation(),
          e.preventDefault(),
          !1
        );
      }),
    $("<div />").addClass("menu-row-sep").appendTo(e),
    $("<a />")
      .html("Past")
      .attr("href", app.story.past_link)
      .attr("target", "_blank")
      .addClass("menu-row")
      .appendTo(e),
    $("<a />")
      .html(app.story.hide_title)
      .attr("href", app.story.hide_link)
      .addClass("menu-row")
      .appendTo(e)
      .on("click", function (e) {
        return (
          hideMenu(),
          hnHideStory(),
          e.stopPropagation(),
          e.stopImmediatePropagation(),
          e.preventDefault(),
          !1
        );
      }),
    null != app.story.flag_link &&
      $("<a />")
        .html(app.story.flag_title)
        .attr("href", app.story.flag_link)
        .addClass("menu-row")
        .appendTo(e)
        .on("click", function (e) {
          return (
            hideMenu(),
            hnFlagStory(),
            e.stopPropagation(),
            e.stopImmediatePropagation(),
            e.preventDefault(),
            !1
          );
        });
  var t = getSectionFromUrl(),
    a = !1;
  null != app.story.edit_link &&
    "edit" != t &&
    ((a = !0),
    $("<div />").addClass("menu-row-sep").appendTo(e),
    $("<a />")
      .html("Edit")
      .attr("href", app.story.edit_link)
      .addClass("menu-row")
      .appendTo(e)),
    null != app.story.delete_link &&
      (0 == a && $("<div />").addClass("menu-row-sep").appendTo(e),
      $("<a />")
        .html("Delete")
        .attr("href", app.story.delete_link)
        .addClass("menu-row")
        .appendTo(e));
}
function applyStylesAfterTimeout() {
  clearTimeout(applySettingsTimer),
    (applySettingsTimer = setTimeout(function () {
      applyStyles();
    }, applySettingsTimeout));
}
function applyStyles() {
  $("body").removeClass(
    "theme-light theme-sepia theme-slate theme-dark theme-black",
  ),
    $("body").removeClass("theme-font-sans theme-font-serif"),
    $("body").removeClass(
      "theme-font-size-0 theme-font-size-1 theme-font-size-2 theme-font-size-3 theme-font-size-4 theme-font-size-5 theme-font-size-6 theme-font-size-7 theme-font-size-8 theme-font-size-9 theme-font-size-10 theme-font-size-11 theme-font-size-12 theme-font-size-13 theme-font-size-14 theme-font-size-15 theme-font-size-16 theme-font-size-17 theme-font-size-18 theme-font-size-19",
    ),
    $("body").removeClass(
      "theme-line-height-0 theme-line-height-1 theme-line-height-2 theme-line-height-3 theme-line-height-4 theme-line-height-5 theme-line-height-6 theme-line-height-7 theme-line-height-8 theme-line-height-9 theme-line-height-10 theme-line-height-11 theme-line-height-12 theme-line-height-13 theme-line-height-14 theme-line-height-15 theme-line-height-16 theme-line-height-17 theme-line-height-18 theme-line-height-19",
    ),
    $("body").addClass("theme-" + app.settings.theme),
    $("body").addClass("theme-font-" + getSettingFont()),
    1 == onListPage()
      ? "table" == app.settings.stories_view
        ? $("body")
            .get(0)
            .style.setProperty("--font-size-table", getSettingFontSize() + "px")
        : $("body")
            .get(0)
            .style.setProperty("--font-size-list", getSettingFontSize() + "px")
      : $("body")
          .get(0)
          .style.setProperty("--font-size", getSettingFontSize() + "px"),
    1 == onListPage()
      ? "table" == app.settings.stories_view
        ? $("body")
            .get(0)
            .style.setProperty(
              "--line-height-table",
              getSettingLineHeight() + "px",
            )
        : $("body")
            .get(0)
            .style.setProperty(
              "--line-height-list",
              getSettingLineHeight() + "px",
            )
      : $("body")
          .get(0)
          .style.setProperty("--line-height", getSettingLineHeight()),
    applyPageWidth();
}
function drawListDotsMenu() {
  var e = $("#menu_inner");
  e.addClass("menu-inner-rows menu-inner-rows-icons menu-inner-list").html(""),
    $("<a />")
      .text("View")
      .attr("href", "")
      .addClass("menu-row menu-row-heading")
      .appendTo(e)
      .on("click", function (e) {
        return (
          e.stopPropagation(),
          e.stopImmediatePropagation(),
          e.preventDefault(),
          !1
        );
      });
  var t = $("<a />")
    .text("List")
    .attr("href", "")
    .addClass("menu-row")
    .appendTo(e);
  t.on("click", function (e) {
    return (
      (app.settings.stories_view = "list"),
      saveSettings(),
      hideMenu(!1),
      drawStories(),
      updateNewComments(),
      setupUserHover(),
      e.stopPropagation(),
      e.stopImmediatePropagation(),
      e.preventDefault(),
      !1
    );
  });
  var a = $("<a />")
    .text("Table")
    .attr("href", "")
    .addClass("menu-row")
    .appendTo(e);
  a.on("click", function (e) {
    return (
      (app.settings.stories_view = "table"),
      saveSettings(),
      hideMenu(!1),
      drawStories(),
      updateNewComments(),
      setupUserHover(),
      e.stopPropagation(),
      e.stopImmediatePropagation(),
      e.preventDefault(),
      !1
    );
  });
  var o = $("<div />")
    .addClass("menu-row-tick")
    .css(
      "background-image",
      "url('" + getImageUrl("images/icon-tick.png") + "')",
    );
  "list" == app.settings.stories_view ? o.prependTo(t) : o.prependTo(a),
    $("<div />").addClass("menu-row-sep").appendTo(e);
  a = "Columns";
  "list" == app.settings.stories_view && (a = "Customize");
  a = $("<a />").text(a).attr("href", "").addClass("menu-row").appendTo(e);
  a.on("click", function (e) {
    return (
      showColumnsMenu(),
      e.stopPropagation(),
      e.stopImmediatePropagation(),
      e.preventDefault(),
      !1
    );
  }),
    $("<div />")
      .addClass("menu-row-more")
      .css(
        "background-image",
        "url('" + getImageUrl("images/icon-chevron-down-thin.png") + "')",
      )
      .appendTo(a);
  a = $("<a />")
    .text("Bold Title")
    .attr("href", "")
    .addClass("menu-row")
    .appendTo(e);
  a.on("click", function (e) {
    return (
      "table" == app.settings.stories_view
        ? (app.settings.table_title_bold = !app.settings.table_title_bold)
        : (app.settings.list_title_bold = !app.settings.list_title_bold),
      saveSettings(),
      drawStories(),
      updateNewComments(),
      setupUserHover(),
      drawListDotsMenu(),
      $("#list_dots").addClass("wiki-header-button-active"),
      e.stopPropagation(),
      e.stopImmediatePropagation(),
      e.preventDefault(),
      !1
    );
  });
  o = $("<div />")
    .addClass("menu-row-tick")
    .css(
      "background-image",
      "url('" + getImageUrl("images/icon-tick.png") + "')",
    );
  (("table" == app.settings.stories_view &&
    1 == app.settings.table_title_bold) ||
    ("list" == app.settings.stories_view &&
      1 == app.settings.list_title_bold)) &&
    o.prependTo(a),
    1 == isPro() &&
      ($("<div />").addClass("menu-row-sep").appendTo(e),
      $("<a />")
        .text("Mark all as read")
        .attr("href", "")
        .addClass("menu-row")
        .appendTo(e)
        .on("click", function (e) {
          return (
            hideMenu(),
            markAllAsRead(),
            e.stopPropagation(),
            e.stopImmediatePropagation(),
            e.preventDefault(),
            !1
          );
        }));
}
function showColumnsMenu() {
  var e = $("#menu_inner");
  e.html("");
  var t = $("<a />")
    .text("Back")
    .attr("href", "")
    .addClass("menu-row")
    .appendTo(e);
  t.on("click", function (e) {
    return (
      drawListDotsMenu(),
      e.stopPropagation(),
      e.stopImmediatePropagation(),
      e.preventDefault(),
      !1
    );
  }),
    $("<div />")
      .addClass("menu-row-back")
      .css(
        "background-image",
        "url('" + getImageUrl("images/icon-chevron-down-thin.png") + "')",
      )
      .appendTo(t),
    $("<div />").addClass("menu-row-sep").appendTo(e);
  var a = $("<a />")
    .text("Number")
    .attr("href", "")
    .addClass("menu-row")
    .appendTo(e);
  a.on("click", function (e) {
    return (
      "table" == app.settings.stories_view
        ? (app.settings.table_number = !app.settings.table_number)
        : (app.settings.list_number = !app.settings.list_number),
      applyColumnChange(),
      e.stopPropagation(),
      e.stopImmediatePropagation(),
      e.preventDefault(),
      !1
    );
  });
  t = $("<div />")
    .addClass("menu-row-tick")
    .css(
      "background-image",
      "url('" + getImageUrl("images/icon-tick.png") + "')",
    );
  (("table" == app.settings.stories_view && 1 == app.settings.table_number) ||
    ("list" == app.settings.stories_view && 1 == app.settings.list_number)) &&
    t.prependTo(a);
  a = $("<a />")
    .text("Points")
    .attr("href", "")
    .addClass("menu-row")
    .appendTo(e);
  a.on("click", function (e) {
    return (
      "table" == app.settings.stories_view
        ? (app.settings.table_points = !app.settings.table_points)
        : (app.settings.list_points = !app.settings.list_points),
      applyColumnChange(),
      e.stopPropagation(),
      e.stopImmediatePropagation(),
      e.preventDefault(),
      !1
    );
  });
  t = $("<div />")
    .addClass("menu-row-tick")
    .css(
      "background-image",
      "url('" + getImageUrl("images/icon-tick.png") + "')",
    );
  (("table" == app.settings.stories_view && 1 == app.settings.table_points) ||
    ("list" == app.settings.stories_view && 1 == app.settings.list_points)) &&
    t.prependTo(a);
  a = $("<a />")
    .text("Domain")
    .attr("href", "")
    .addClass("menu-row")
    .appendTo(e);
  a.on("click", function (e) {
    return (
      "table" == app.settings.stories_view
        ? (app.settings.table_domain = !app.settings.table_domain)
        : (app.settings.list_domain = !app.settings.list_domain),
      applyColumnChange(),
      e.stopPropagation(),
      e.stopImmediatePropagation(),
      e.preventDefault(),
      !1
    );
  });
  t = $("<div />")
    .addClass("menu-row-tick")
    .css(
      "background-image",
      "url('" + getImageUrl("images/icon-tick.png") + "')",
    );
  (("table" == app.settings.stories_view && 1 == app.settings.table_domain) ||
    ("list" == app.settings.stories_view && 1 == app.settings.list_domain)) &&
    t.prependTo(a);
  a = $("<a />").text("User").attr("href", "").addClass("menu-row").appendTo(e);
  a.on("click", function (e) {
    return (
      "table" == app.settings.stories_view
        ? (app.settings.table_user = !app.settings.table_user)
        : (app.settings.list_user = !app.settings.list_user),
      applyColumnChange(),
      e.stopPropagation(),
      e.stopImmediatePropagation(),
      e.preventDefault(),
      !1
    );
  });
  t = $("<div />")
    .addClass("menu-row-tick")
    .css(
      "background-image",
      "url('" + getImageUrl("images/icon-tick.png") + "')",
    );
  (("table" == app.settings.stories_view && 1 == app.settings.table_user) ||
    ("list" == app.settings.stories_view && 1 == app.settings.list_user)) &&
    t.prependTo(a);
  a = $("<a />").text("Age").attr("href", "").addClass("menu-row").appendTo(e);
  a.on("click", function (e) {
    return (
      "table" == app.settings.stories_view
        ? (app.settings.table_age = !app.settings.table_age)
        : (app.settings.list_age = !app.settings.list_age),
      applyColumnChange(),
      e.stopPropagation(),
      e.stopImmediatePropagation(),
      e.preventDefault(),
      !1
    );
  });
  t = $("<div />")
    .addClass("menu-row-tick")
    .css(
      "background-image",
      "url('" + getImageUrl("images/icon-tick.png") + "')",
    );
  (("table" == app.settings.stories_view && 1 == app.settings.table_age) ||
    ("list" == app.settings.stories_view && 1 == app.settings.list_age)) &&
    t.prependTo(a);
  a = $("<a />")
    .text("Replies")
    .attr("href", "")
    .addClass("menu-row")
    .appendTo(e);
  a.on("click", function (e) {
    return (
      "table" == app.settings.stories_view
        ? (app.settings.table_replies = !app.settings.table_replies)
        : (app.settings.list_replies = !app.settings.list_replies),
      applyColumnChange(),
      e.stopPropagation(),
      e.stopImmediatePropagation(),
      e.preventDefault(),
      !1
    );
  });
  t = $("<div />")
    .addClass("menu-row-tick")
    .css(
      "background-image",
      "url('" + getImageUrl("images/icon-tick.png") + "')",
    );
  (("table" == app.settings.stories_view && 1 == app.settings.table_replies) ||
    ("list" == app.settings.stories_view && 1 == app.settings.list_replies)) &&
    t.prependTo(a),
    1 == isPro() &&
      ((e = $("<a />")
        .text("New")
        .attr("href", "")
        .addClass("menu-row")
        .appendTo(e)).on("click", function (e) {
        return (
          "table" == app.settings.stories_view
            ? (app.settings.table_new = !app.settings.table_new)
            : (app.settings.list_new = !app.settings.list_new),
          applyColumnChange(),
          e.stopPropagation(),
          e.stopImmediatePropagation(),
          e.preventDefault(),
          !1
        );
      }),
      (t = $("<div />")
        .addClass("menu-row-tick")
        .css(
          "background-image",
          "url('" + getImageUrl("images/icon-tick.png") + "')",
        )),
      (("table" == app.settings.stories_view && 1 == app.settings.table_new) ||
        ("list" == app.settings.stories_view && 1 == app.settings.list_new)) &&
        t.prependTo(e));
}
function applyColumnChange() {
  saveSettings(),
    drawStories(),
    updateNewComments(),
    setupUserHover(),
    showColumnsMenu(),
    $("#list_dots").addClass("wiki-header-button-active");
}
function drawStoryListDotsMenu(e) {
  e.addClass("menu-inner-rows");
  var t = app.stories[currentMenuStoryIndex];
  null != t.hide_link &&
    $("<a />")
      .html(t.hide_title)
      .attr("href", t.hide_link)
      .addClass("menu-row")
      .appendTo(e)
      .on("click", function (e) {
        return (
          hideMenu(),
          hnHideStory(currentMenuStoryIndex),
          e.stopPropagation(),
          e.stopImmediatePropagation(),
          e.preventDefault(),
          !1
        );
      }),
    null != t.flag_link &&
      $("<a />")
        .html(t.flag_title)
        .attr("href", t.flag_link)
        .addClass("menu-row")
        .appendTo(e)
        .on("click", function (e) {
          return (
            hideMenu(),
            hnFlagStory(currentMenuStoryIndex),
            e.stopPropagation(),
            e.stopImmediatePropagation(),
            e.preventDefault(),
            !1
          );
        }),
    0 < getNewCommentsCount(currentMenuStoryIndex) &&
      $("<a />")
        .text("Mark as read")
        .attr("href", "")
        .addClass("menu-row")
        .appendTo(e)
        .on("click", function (e) {
          return (
            hideMenu(),
            markAsRead(currentMenuStoryIndex),
            e.stopPropagation(),
            e.stopImmediatePropagation(),
            e.preventDefault(),
            !1
          );
        });
}
function markAllAsRead() {
  for (var e = 0; e < app.stories.length; e++) markAsRead(e);
}
function markAsRead(e) {
  var t = app.stories[e],
    e = getHistoryIndex(t.id);
  null != e &&
    ((app.history[e].total_comments = t.total_comments),
    saveHistory(),
    $("#" + t.id + " .hn-item-new")
      .html("")
      .attr("title", ""),
    $("#item_dot_" + t.id).removeClass("hn-item-new-dot-show"));
}
function markStoryAsRead(e) {
  var e = void 0 === e || e,
    t = getHistoryIndex(app.story.id);
  null != t &&
    ((app.history[t].total_comments = app.story.total_comments),
    (app.history[t].last_comment_id = app.story.last_comment_id),
    saveHistory(),
    1 == e &&
      ($(".hn-comment-highlight").removeClass("hn-comment-highlight"),
      $("#comments_new_count").removeClass("hn-comments-new-count-visible"),
      $("#nav_comments_wrap").hide()));
}
function hnHideStory(e) {
  var t,
    e = void 0 === e ? null : e;
  0 != isLoggedIn()
    ? requestTooQuick() ||
      ((t = app.story),
      "Hide" == (t = null != e ? app.stories[e] : t).hide_title
        ? doHnHideStory(!0, e)
        : doHnHideStory(!1, e))
    : showDialog("login");
}
function hnFlagStory(e) {
  var t,
    e = void 0 === e ? null : e;
  requestTooQuick() ||
    ((t = app.story),
    "Flag" == (t = null != e ? app.stories[e] : t).flag_title
      ? doHnFlagStory(!0, e)
      : doHnFlagStory(!1, e));
}
function doHnHideStory(e, t) {
  var e = void 0 !== e && e,
    a = null,
    a = (null != (t = void 0 === t ? null : t) ? app.stories[t] : app.story)
      .hide_link,
    o = new URL(a, location).searchParams,
    s =
      "hide?id=" +
      o.get("id") +
      "&auth=" +
      o.get("auth") +
      "&goto=" +
      encodeURIComponent(o.get("goto")) +
      "&js=t",
    n =
      "hide?id=" +
      o.get("id") +
      "&un=t&auth=" +
      o.get("auth") +
      "&goto=" +
      encodeURIComponent(o.get("goto")) +
      "&js=t";
  1 == e
    ? null == t
      ? (sendRequest(s),
        (app.story.hide_link = n),
        (app.story.hide_title = "Unhide"))
      : (app.stories.splice(t, 1),
        $("#" + app.stories[t].id).remove(),
        (a = null) != app.more_link &&
          (a = parseInt(app.more_link.split("next=")[1])),
        (e = ""),
        "newest" == getSectionFromUrl() && null != a && (e = "&next=" + a),
        (s =
          "snip-story?id=" +
          o.get("id") +
          "&auth=" +
          o.get("auth") +
          "&onop=" +
          encodeURIComponent(o.get("goto")) +
          e),
        $.ajax({
          url: getAbsoluteUrl(s),
          type: "GET",
          data: {},
          timeout: 15e3,
          cache: !1,
          dataType: "json",
          success: function (e) {
            if (0 != e.length) {
              var t = $("<table />").html(e[0]);
              parseStoriesItem($(".athing", t).first());
              for (
                var a = parseInt(app.stories[0].number), o = 0;
                o < app.stories.length;
                o++
              )
                app.stories[o].number = o + a + ".";
              "newest" == getSectionFromUrl() &&
                ((t = parseInt(app.stories[app.stories.length - 1].number)),
                (app.more_link = "newest?next=" + e[1] + "&n=" + (t + 1))),
                drawStories(),
                updateNewComments(),
                setupUserHover();
            }
          },
        }),
        (app.stories[t].hide_link = n),
        (app.stories[t].hide_title = "Unhide"))
    : (sendRequest(n),
      null == t
        ? ((app.story.hide_link = s), (app.story.hide_title = "Hide"))
        : ((app.stories[t].hide_link = s),
          (app.stories[t].hide_title = "Hide")));
}
function doHnFlagStory(e, t) {
  var e = void 0 !== e && e,
    a = null,
    a = (null != (t = void 0 === t ? null : t) ? app.stories[t] : app.story)
      .flag_link,
    o = new URL(a, location).searchParams,
    a =
      "flag?id=" +
      o.get("id") +
      "&auth=" +
      o.get("auth") +
      "&goto=" +
      encodeURIComponent(o.get("goto")) +
      "&js=t",
    o =
      "flag?id=" +
      o.get("id") +
      "&un=t&auth=" +
      o.get("auth") +
      "&goto=" +
      encodeURIComponent(o.get("goto")) +
      "&js=t";
  1 == e
    ? (sendRequest(a),
      null == t
        ? ((app.story.flag_link = o), (app.story.flag_title = "Unflag"))
        : ((app.stories[t].flag_link = o),
          (app.stories[t].flag_title = "Unflag")))
    : (sendRequest(o),
      null == t
        ? ((app.story.flag_link = a), (app.story.flag_title = "Flag"))
        : ((app.stories[t].flag_link = a),
          (app.stories[t].flag_title = "Flag")));
}
function drawCommentDotsMenu(e) {
  e.addClass("menu-inner-rows"),
    $("<a />")
      .html("Share...")
      .attr("href", "/")
      .addClass("menu-row")
      .appendTo(e)
      .on("click", function (e) {
        return (
          showMenu("comment_share", "comment_dots_" + currentMenuCommentIndex),
          e.stopPropagation(),
          e.stopImmediatePropagation(),
          e.preventDefault(),
          !1
        );
      });
  var t,
    a = app.story.comments[currentMenuCommentIndex];
  (null == a.root && null == a.parent && null == a.context) ||
    $("<div />").addClass("menu-row-sep").appendTo(e),
    null != a.root &&
      $("<a />")
        .html("Root")
        .attr("href", a.root)
        .addClass("menu-row")
        .appendTo(e),
    null != a.parent &&
      $("<a />")
        .html("Parent")
        .attr("href", a.parent)
        .addClass("menu-row")
        .appendTo(e),
    null != a.context &&
      $("<a />")
        .html("Context")
        .attr("href", a.context)
        .addClass("menu-row")
        .appendTo(e),
    null != a.prev &&
      $("<a />")
        .html("Prev")
        .attr("href", a.prev)
        .addClass("menu-row")
        .appendTo(e),
    null != a.next &&
      $("<a />")
        .html("Next")
        .attr("href", a.next)
        .addClass("menu-row")
        .appendTo(e),
    (null == a.edit_link && null == a.delete_link) ||
      $("<div />").addClass("menu-row-sep").appendTo(e),
    null != a.edit_link &&
      "edit" != getSectionFromUrl() &&
      $("<a />")
        .html("Edit")
        .attr("href", a.edit_link)
        .addClass("menu-row")
        .appendTo(e),
    null != a.delete_link &&
      "delete" != getSectionFromUrl() &&
      $("<a />")
        .html("Delete")
        .attr("href", a.delete_link)
        .addClass("menu-row")
        .appendTo(e),
    null != a.flag_link &&
      ((null == a.root && null == a.parent && null == a.context) ||
        $("<div />").addClass("menu-row-sep").appendTo(e),
      (t = "Flag"),
      1 == a.flagged && (t = "Unflag"),
      $("<a />")
        .html(t)
        .attr("href", a.flag_link)
        .addClass("menu-row")
        .appendTo(e)
        .on("click", function (e) {
          return (
            hideMenu(),
            hnFlagComment(),
            e.stopPropagation(),
            e.stopImmediatePropagation(),
            e.preventDefault(),
            !1
          );
        }));
}
const hnFlagComment = async () => {
  var e, t;
  requestTooQuick() ||
    ((t = await getAuthCode(
      (e = app.story.comments[currentMenuCommentIndex]).id,
    )),
    0 == e.flagged
      ? ((app.story.comments[currentMenuCommentIndex].flagged = !0),
        sendRequest("flag?id=" + e.id + "&auth=" + t))
      : ((app.story.comments[currentMenuCommentIndex].flagged = !1),
        sendRequest("flag?id=" + e.id + "&un=t&auth=" + t)));
};
function getAuthCode(o) {
  return new Promise(async (e) => {
    var t = await fetch(
        getAbsoluteUrl("https://news.ycombinator.com/item?id=" + o),
      )
        .then((e) => e.text())
        .catch((e) => console.error(e)),
      a = $("<div />").html(t),
      t = $("table.fatitem td.subtext a[href^='hide']", a);
    0 == t.length && (t = $("table.fatitem span.comhead a[href^='fave']", a)),
      e(new URLSearchParams(t.first().attr("href")).get("auth"));
  });
}
function isLoggedIn() {
  return 0 < $("#me").length;
}
function getUsername() {
  return $("#me").text();
}
function addToHistory() {
  var e;
  0 != onItemPage() &&
    null != app.story &&
    0 != app.story.title.length &&
    (null != (e = getHistoryIndex(app.story.id))
      ? (app.history[e].timestamp = Math.floor(Date.now() / 1e3))
      : ((e = {
          id: (e = JSON.parse(JSON.stringify(app.story))).id,
          domain: e.domain,
          user: e.user,
          title: e.title,
          total_comments: e.total_comments,
          last_comment_id: e.last_comment_id,
          age: e.age,
          hmac: e.hmac,
          score: e.score,
          url: e.url,
          timestamp: Math.floor(Date.now() / 1e3),
        }),
        app.history.push(e)),
    saveHistory());
}
function saveHistory() {
  chrome.storage.local.set({ history: JSON.stringify(app.history) });
}
function clearHistory() {
  1 == confirm("Your history will be cleared. Are you sure?") &&
    (chrome.storage.local.remove("history"),
    hideMenu(!(app.history = [])),
    showMenu("history", "button_history"));
}
function loadHistory() {
  chrome.storage.local.get(["history"], function (e) {
    void 0 !== e.history && (app.history = JSON.parse(e.history)),
      addToHistory(),
      updateNewComments();
  });
}
function loadHistoryMenu() {
  if (1 == menuOpen) {
    if ("history" == menuName) return void hideMenu();
    hideMenu();
  }
  chrome.storage.local.get(["history"], function (e) {
    void 0 !== e.history && (app.history = JSON.parse(e.history)),
      showMenu("history", "button_history");
  });
}
function drawHistoryMenu() {
  var e = $("#menu_inner");
  if ((e.addClass("menu-inner-history").html(""), 0 == app.history.length))
    $("<div />")
      .addClass("menu-placeholder")
      .appendTo(e)
      .text("Your history will appear here.");
  else {
    var t = $("<div />").addClass("menu-heading").text("History").appendTo(e);
    $("<div />")
      .addClass("menu-clear-link")
      .text("Clear")
      .appendTo(t)
      .on("click", function () {
        clearHistory();
      });
    var a = $("<div />")
        .addClass("menu-list-wrap menu-list-wrap-history")
        .appendTo(e),
      o = new Date(),
      s = new Date();
    s.setDate(s.getDate() - 1);
    var n = "";
    app.history.sort(function (e, t) {
      return t.timestamp - e.timestamp;
    });
    for (var i = 0; i < app.history.length && !(0 == isPro() && 30 <= i); i++) {
      var r = new Date(1e3 * app.history[i].timestamp),
        d =
          weekdays[r.getDay()] + " " + r.getDate() + " " + months[r.getMonth()];
      d != n &&
        ((l = d),
        o.getDate() == r.getDate() &&
        o.getMonth() == r.getMonth() &&
        o.getFullYear() == r.getFullYear()
          ? (l = "Today")
          : s.getDate() == r.getDate() &&
            s.getMonth() == r.getMonth() &&
            s.getFullYear() == r.getFullYear() &&
            (l = "Yesterday"),
        $("<div />").addClass("menu-day-heading").text(l).appendTo(a),
        (n = d),
        $(".wiki-results-row", a).last().addClass("wiki-results-row-last"));
      var r = $("<a />")
          .addClass("wiki-results-row")
          .attr("id", "history_row_" + i)
          .appendTo(a),
        l = "https://news.ycombinator.com/item?id=" + app.history[i].id;
      r.attr("href", l);
      d = "";
      0 < app.history[i].domain.length &&
        (d += "<i>" + app.history[i].domain + "</i> <span>&bull;</span> "),
        (d += "<b>" + app.history[i].user + "</b>");
      (l = $("<div />")
        .addClass("wiki-results-title wiki-results-title-history")
        .html(app.history[i].title)
        .appendTo(r)),
        $("<div />").addClass("wiki-results-desc").html(d).appendTo(r);
      50 < app.history[i].title.length && l.attr("title", app.history[i].title),
        $("<div />")
          .addClass("wiki-results-age")
          .html(getOldness(app.history[i].timestamp, !1, !0, !0))
          .appendTo(r);
      r = $("<div />")
        .data("history_index", i)
        .addClass("wiki-results-delete")
        .appendTo(r);
      r.css(
        "background-image",
        "url('" + getImageUrl("images/icon-cross.png") + "')",
      ),
        r.on("click", function (e) {
          var t = parseInt($(this).data("history_index"));
          return (
            app.history.splice(t, 1),
            $("#history_row_" + t).remove(),
            saveHistory(),
            0 == app.history.length &&
              (hideMenu(!1), showMenu("history", "button_history")),
            e.preventDefault(),
            !1
          );
        });
    }
  }
}
function drawBookmarksMenu() {
  var e = $("#menu_inner");
  e.addClass("menu-inner-bookmarks").html("");
  var t = $("<div />").addClass("menu-tabs").appendTo(e);
  (0 == isLoggedIn() ||
    ("highlights" == app.bookmarks.tab && 0 == onItemPage())) &&
    drawMenuSettingsButton(t);
  $("<div />")
    .text("Stories")
    .attr("id", "bookmarks_tab_stories")
    .addClass("menu-tab")
    .appendTo(t),
    $("<div />")
      .text("Comments")
      .attr("id", "bookmarks_tab_comments")
      .addClass("menu-tab")
      .appendTo(t),
    $("<div />")
      .text("Highlights")
      .attr("id", "bookmarks_tab_highlights")
      .addClass("menu-tab")
      .appendTo(t),
    $("<div />")
      .text("Users")
      .attr("id", "bookmarks_tab_users")
      .addClass("menu-tab")
      .appendTo(t),
    $("<div />")
      .attr("id", "bookmarks_tab_bar")
      .addClass("menu-tab-bar")
      .appendTo(t);
  selectBookmarkTab(app.bookmarks.tab, !1),
    $(".menu-tab").on("click", function () {
      var e = $(this).attr("id").split("_")[2];
      app.bookmarks.tab.split("_")[0] != e &&
        ("users" != e &&
          "highlights" != e &&
          -1 != app.bookmarks.tab_last.indexOf("_") &&
          (e = e + "_" + app.bookmarks.tab_last.split("_")[1]),
        "users" != app.bookmarks.tab &&
          "highlights" != app.bookmarks.tab &&
          (app.bookmarks.tab_last = app.bookmarks.tab),
        selectBookmarkTab(e),
        drawBookmarksMenu());
    });
  var a = $("<div />")
      .addClass("hn-switcher-container")
      .attr("id", "bookmarks_switcher_container")
      .appendTo(e),
    o = $("<div />")
      .addClass("hn-switcher-small-wrap")
      .attr("id", "highlights_switcher")
      .hide()
      .appendTo(a),
    s = $("<div />").addClass("hn-switcher").appendTo(o),
    n = $("<div />")
      .text("Current")
      .attr("id", "highlights_switcher_current")
      .appendTo(s),
    t = $("<div />")
      .text("All")
      .attr("id", "highlights_switcher_all")
      .appendTo(s);
  ("current" == app.bookmarks.highlights_tab ? n : t).addClass(
    "hn-switcher-selected",
  ),
    $("div", s)
      .off("click")
      .on("click", function () {
        var e = $(this).attr("id").split("_")[2];
        (app.bookmarks.highlights_tab = e),
          saveBookmarks(),
          updateBookmarkSwitcher(),
          showBookmarks();
      }),
    1 == isLoggedIn() &&
      ((o = $("<div />")
        .addClass("hn-switcher-small-wrap")
        .attr("id", "bookmarks_switcher")
        .appendTo(a)),
      (e = $("<div />").addClass("hn-switcher").appendTo(o)),
      (n = $("<div />")
        .text("Favorites")
        .attr("id", "bookmarks_switcher_fav")
        .appendTo(e)),
      (t = $("<div />")
        .text("Upvoted")
        .attr("id", "bookmarks_switcher_upvoted")
        .appendTo(e)),
      (s = $("<div />")
        .text("Posted")
        .attr("id", "bookmarks_switcher_posted")
        .appendTo(e)),
      (-1 != app.bookmarks.tab.indexOf("_upvoted")
        ? t
        : -1 != app.bookmarks.tab.indexOf("_posted")
          ? s
          : n
      ).addClass("hn-switcher-selected"),
      "users" == app.bookmarks.tab && o.hide(),
      $("div", e)
        .off("click")
        .on("click", function () {
          var e = $(this).attr("id").split("_")[2];
          -1 != app.bookmarks.tab.indexOf("stories")
            ? (app.bookmarks.tab = "stories_" + e)
            : (app.bookmarks.tab = "comments_" + e),
            saveBookmarks(),
            updateBookmarkSwitcher(),
            showBookmarks();
        })),
    (("highlights" != app.bookmarks.tab && 1 == isLoggedIn()) ||
      ("highlights" == app.bookmarks.tab && 1 == onItemPage())) &&
      drawMenuSettingsButton(a),
    showBookmarks();
}
function drawMenuSettingsButton(e) {
  e = $("<div />")
    .attr("id", "menu_settings_button")
    .addClass("menu-settings-button")
    .appendTo(e);
  $("<div />")
    .appendTo(e)
    .css(
      "background-image",
      "url('" + getImageUrl("images/icon-dots-thin.png") + "')",
    ),
    e.on("click", function (e) {
      return (
        showContextMenu("bookmarks_settings", "menu_settings_button"),
        e.preventDefault(),
        !1
      );
    }),
    ("users" == app.bookmarks.tab ||
      (-1 == app.bookmarks.tab.indexOf("comments") && 0 == isLoggedIn())) &&
      e.hide();
}
function selectBookmarkTab(e, t) {
  t = void 0 === t || t;
  (app.bookmarks.tab = e), saveBookmarks();
  var a = e.split("_")[0];
  $(".menu-tab").removeClass("menu-tab-selected");
  var o = $("#bookmarks_tab_" + a),
    e = $("#bookmarks_tab_bar");
  o.addClass("menu-tab-selected");
  (a = o.position().left), (o = o.outerWidth());
  1 == t
    ? e.css("transition", "all 0.2s ease-in-out")
    : e.css("transition", "none"),
    e
      .css("left", a + "px")
      .css("width", o + "px")
      .show(),
    toggleBookmarkSwitchers();
}
function toggleBookmarkSwitchers() {
  -1 != app.bookmarks.tab.indexOf("stories") ||
  -1 != app.bookmarks.tab.indexOf("comments")
    ? $("#bookmarks_switcher").show()
    : $("#bookmarks_switcher").hide(),
    -1 != app.bookmarks.tab.indexOf("highlights") && 1 == onItemPage()
      ? $("#highlights_switcher").show()
      : $("#highlights_switcher").hide();
}
function updateBookmarkSwitcher() {
  $(
    "#bookmarks_switcher .hn-switcher-selected, #highlights_switcher .hn-switcher-selected",
  ).removeClass("hn-switcher-selected"),
    "users" == app.bookmarks.tab ||
    (-1 == app.bookmarks.tab.indexOf("comments") && 0 == isLoggedIn())
      ? $("#menu_settings_button").hide()
      : $("#menu_settings_button").show(),
    "users" != app.bookmarks.tab &&
      ((-1 != app.bookmarks.tab.indexOf("_upvoted")
        ? $("#bookmarks_switcher_upvoted")
        : -1 != app.bookmarks.tab.indexOf("_posted")
          ? $("#bookmarks_switcher_posted")
          : $("#bookmarks_switcher_fav")
      ).addClass("hn-switcher-selected"),
      ("current" == app.bookmarks.highlights_tab
        ? $("#highlights_switcher_current")
        : $("#highlights_switcher_all")
      ).addClass("hn-switcher-selected"));
}
function showBookmarks() {
  var e = $("#menu_inner");
  $("#menu_bookmarks_wrap").remove();
  $("<div />")
    .addClass("menu-bookmarks-wrap")
    .attr("id", "menu_bookmarks_wrap")
    .appendTo(e);
  e = Math.floor(Date.now() / 1e3);
  ("users" == app.bookmarks.tab ||
    "highlights" == app.bookmarks.tab ||
    ("private" == getBookmarksStorage() &&
      -1 != app.bookmarks.tab.indexOf("_fav")) ||
    ("private" == getBookmarksStorage() &&
      -1 != app.bookmarks.tab.indexOf("_fav")) ||
    (0 < app.bookmarks[app.bookmarks.tab].items.length &&
      e - app.bookmarks[app.bookmarks.tab].updated < 3600)
    ? drawBookmarks
    : getBookmarks)();
}
function loadCommentFavs() {
  var e;
  0 != isLoggedIn() &&
    1 != isPro() &&
    ((app.bookmarks.tab = "comments_fav"),
    (e = Math.floor(Date.now() / 1e3)),
    (0 == app.bookmarks[app.bookmarks.tab].items.length ||
      3600 < e - app.bookmarks[app.bookmarks.tab].updated) &&
      getBookmarks());
}
function drawBookmarks() {
  var e = $("#menu_bookmarks_wrap").html(""),
    t = app.bookmarks.tab;
  if (
    ((0 == isLoggedIn() ||
      ("private" == getBookmarksStorage() &&
        -1 != app.bookmarks.tab.indexOf("_fav"))) &&
      (-1 != t.indexOf("stories")
        ? (t = "stories_fav_private")
        : -1 != t.indexOf("comments") && (t = "comments_fav_private")),
    0 == app.bookmarks[t].items.length)
  ) {
    var a = "No items found.";
    "users" == t
      ? (a = "Favorite users will appear here.")
      : "stories_upvoted" == t
        ? (a = "Upvoted stories will appear here.")
        : "stories_fav" == t || "stories_fav_private" == t
          ? (a = "Favorite stories will appear here.")
          : "stories_posted" == t
            ? (a = "Posted stories will appear here.")
            : "comments_upvoted" == t
              ? (a = "Upvoted comments will appear here.")
              : "comments_fav" == t || "comments_fav_private" == t
                ? (a = "Favorite comments will appear here.")
                : "comments_posted" == t
                  ? (a = "Posted comments will appear here.")
                  : "highlights" == t && (a = "Highlights will appear here.");
    a = $("<div />").addClass("menu-bookmarks-placeholder").text(a).appendTo(e);
    return (
      "public" == getBookmarksStorage() &&
        "users" != t &&
        "highlights" != t &&
        a.addClass("menu-bookmarks-placeholder-account"),
      void (
        ("users" != t && "highlights" != t) ||
        a.addClass("menu-bookmarks-placeholder-pad")
      )
    );
  }
  e = $("<div />").addClass("menu-list-wrap").appendTo(e);
  -1 != t.indexOf("stories")
    ? drawStoryBookmarks(e, t)
    : -1 != t.indexOf("comments")
      ? drawCommentBookmarks(e, t)
      : "users" == t
        ? drawUserBookmarks(e)
        : "highlights" == t && drawHighlightBookmarks(e),
    1 != isLoggedIn() ||
      ("private" == getBookmarksStorage() &&
        -1 != app.bookmarks.tab.indexOf("_fav")) ||
      (0 < (t = getBookmarksUrl()).length &&
        $("<a />")
          .addClass("wiki-results-more")
          .html("More...<span></span>")
          .attr("href", t)
          .appendTo(e)),
    toggleBookmarkSwitchers(),
    updateBookmarkSwitcher();
}
function drawStoryBookmarks(e, t) {
  getBookmarksStorage();
  var a = JSON.parse(JSON.stringify(app.bookmarks[t].items));
  "private" == getBookmarksStorage() &&
    -1 != app.bookmarks.tab.indexOf("_fav") &&
    a.reverse();
  for (var o = 0; o < a.length; o++) {
    var s = $("<a />")
        .addClass("wiki-results-row wiki-bookmarks-row")
        .attr("id", "bookmarks_row_" + o)
        .appendTo(e),
      n = "https://news.ycombinator.com/item?id=" + a[o].id;
    s.attr("href", n);
    var i = "";
    0 < a[o].domain.length &&
      (i += "<i>" + a[o].domain + "</i> <span>&bull;</span> "),
      (i +=
        "<b>" +
        a[o].user +
        "</b> <span>&bull;</span> " +
        getOldnessFromDate(a[o].age + "Z"));
    (n = $("<div />")
      .addClass(
        "wiki-results-title wiki-bookmarks-title wiki-bookmarks-story-title",
      )
      .html(a[o].title)
      .appendTo(s)),
      $("<div />")
        .addClass("wiki-results-desc wiki-bookmarks-desc")
        .html(i)
        .appendTo(s);
    n.addClass("wiki-results-title-no-truncate"),
      50 < a[o].title.length && n.attr("title", a[o].title);
  }
}
function drawCommentBookmarks(e, t) {
  getBookmarksStorage();
  var a = JSON.parse(JSON.stringify(app.bookmarks[t].items));
  app.bookmarks.tab.indexOf("_fav");
  for (
    var o = (location.pathname + location.search).substr(1), s = 0;
    s < a.length;
    s++
  ) {
    var n = $("<a />")
        .addClass(
          "wiki-results-row wiki-bookmarks-row wiki-comment-bookmarks-row",
        )
        .attr("id", "bookmarks_row_" + s)
        .appendTo(e),
      i = "https://news.ycombinator.com/item?id=" + a[s].id;
    o == a[s].on_link && (i = "#" + a[s].id), n.attr("href", i);
    var r =
      "<b>" +
      a[s].user +
      "</b> <span>&bull;</span> " +
      getOldnessFromDate(a[s].age + "Z");
    r += " <span>&bull;</span> <i>" + a[s].on_title + "</i>";
    $("<div />")
      .addClass("wiki-results-desc wiki-comments-desc")
      .html(r)
      .appendTo(n);
    var d = $("<div />")
        .addClass(
          "wiki-results-title wiki-bookmarks-title wiki-comment-bookmarks-title",
        )
        .appendTo(n),
      i = a[s].text;
    1 == app.bookmarks.comments_truncate
      ? ((i = $("<span />")
          .html(i.replace("<p>", " <p>"))
          .text()
          .slice(0, 400)),
        d.text(i),
        n.addClass("wiki-results-row-truncate"),
        (r = $("<span />").html(a[s].text.replace("<p>", " <p>")).text()),
        d.attr("title", r))
      : ("<p>" != i.slice(0, 2) && (i = "<p>" + i),
        d.html(i),
        n.addClass("wiki-results-row-full"),
        $("a", d).each(function () {
          $(this)
            .removeAttr("href")
            .on("click", function (e) {});
        }));
  }
}
function getOldnessFromDate(e) {
  var t = Math.round(new Date().getTime() / 1e3),
    e = Math.round(new Date(e).getTime() / 1e3);
  return t - e < 31536e3 ? getOldness(e, !0) : getFormattedDate(e);
}
function drawUserBookmarks(e) {
  e.parent().addClass("menu-bookmarks-wrap-pad"),
    e.addClass("menu-list-wrap-users");
  var t = JSON.parse(JSON.stringify(app.bookmarks[app.bookmarks.tab].items));
  t.reverse();
  for (var a = 0; a < t.length; a++) {
    var o = $("<a />")
      .addClass("wiki-results-row wiki-bookmarks-row wiki-bookmarks-row-user")
      .attr("id", "bookmarks_row_" + a)
      .appendTo(e);
    o.attr("href", "https://news.ycombinator.com/user?id=" + t[a].name),
      $("<div />")
        .addClass(
          "wiki-results-title wiki-bookmarks-title wiki-user-bookmarks-title",
        )
        .text(t[a].name)
        .appendTo(o);
    o = $("<div />")
      .data("bookmarks_index", a)
      .addClass("wiki-results-delete")
      .appendTo(o);
    o.css(
      "background-image",
      "url('" + getImageUrl("images/icon-cross.png") + "')",
    ),
      o.on("click", function (e) {
        var t = parseInt($(this).data("bookmarks_index"));
        return (
          app.bookmarks.users.items.splice(t, 1),
          $("#bookmarks_row_" + t).remove(),
          saveBookmarks(),
          updateProfileBookmarkButton(),
          0 == app.bookmarks.users.items.length &&
            (hideMenu(!1), showMenu("bookmark", "button_bookmark")),
          e.preventDefault(),
          !1
        );
      });
  }
}
function drawHighlightBookmarks(e) {
  0 == onItemPage() && e.addClass("menu-list-wrap-pad"),
    e.parent().addClass("menu-bookmarks-wrap-pad"),
    e.on("scroll", function () {
      1 == contextMenuOpen && hideContextMenu(!1);
    });
  var t = JSON.parse(JSON.stringify(app.bookmarks[app.bookmarks.tab].items));
  t.reverse(),
    "current" == app.bookmarks.highlights_tab &&
      t.sort(function (e, t) {
        return e.top - t.top;
      });
  for (var a, o, s, n, i = 0; i < t.length; i++)
    1 != t[i].deleted &&
      (("current" == app.bookmarks.highlights_tab &&
        t[i].story_id != app.story.id) ||
        ((n = $("<a />")
          .addClass(
            "wiki-results-row wiki-bookmarks-row wiki-comment-bookmarks-row",
          )
          .attr("id", "bookmarks_row_" + i)
          .appendTo(e)),
        (o =
          "https://news.ycombinator.com/item?id=" +
          t[i].story_id +
          "#" +
          t[i].comment_id),
        n.attr("href", o),
        (s =
          "<b>" +
          t[i].user +
          "</b> <span>&bull;</span> " +
          getOldness(t[i].timestamp)),
        "current" != app.bookmarks.highlights_tab &&
          (s += " <span>&bull;</span> <i>" + t[i].story_title + "</i>"),
        $("<div />")
          .addClass("wiki-results-desc wiki-comments-desc")
          .html(s)
          .appendTo(n),
        (a = $("<div />")
          .addClass(
            "wiki-results-title wiki-bookmarks-title wiki-comment-bookmarks-title",
          )
          .appendTo(n)),
        (o = t[i].text),
        1 == app.bookmarks.highlights_truncate
          ? ((o = $("<span />")
              .html(o.replace("<p>", " <p>"))
              .text()
              .slice(0, 400)),
            a.text(o),
            n.addClass("wiki-results-row-truncate"),
            (s = $("<span />").html(t[i].text.replace("<p>", " <p>")).text()),
            a.attr("title", s))
          : (a.html(o), n.addClass("wiki-results-row-full")),
        (n = $("<div />")
          .addClass(
            "wiki-results-delete wiki-menu-button wiki-results-delete-highlights",
          )
          .appendTo(n)),
        $("<div />")
          .css(
            "background-image",
            "url('" + getImageUrl("images/icon-dots-thin.png") + "')",
          )
          .appendTo(n),
        n
          .attr("id", "menu_row_button_" + i)
          .data("highlights_id", t[i].id)
          .data("highlights_index", i),
        n.on("click", function (e) {
          return (
            showContextMenu(
              "menu_highlights_row",
              "menu_row_button_" + $(this).data("highlights_index"),
              $(this).data("highlights_id"),
            ),
            e.preventDefault(),
            !1
          );
        })));
}
function getBookmarksUrl() {
  var e = getUsername(),
    t = "";
  return (
    "stories_fav" == app.bookmarks.tab
      ? (t = "/favorites?id=" + e)
      : "stories_upvoted" == app.bookmarks.tab
        ? (t = "/upvoted?id=" + e)
        : "stories_posted" == app.bookmarks.tab
          ? (t = "/submitted?id=" + e)
          : "comments_fav" == app.bookmarks.tab
            ? (t = "/favorites?id=" + e + "&comments=t")
            : "comments_upvoted" == app.bookmarks.tab
              ? (t = "/upvoted?id=" + e + "&comments=t")
              : "comments_posted" == app.bookmarks.tab &&
                (t = "/threads?id=" + e),
    t
  );
}
const getBookmarks = async () => {
  var e = $("#menu_bookmarks_wrap").html("");
  $("<div />")
    .addClass("menu-loading")
    .css("background-image", "url('" + getLoadingImage() + "')")
    .appendTo(e);
  var i,
    r = app.bookmarks.tab;
  "users" != r &&
    ((e = await getPageHTML(getBookmarksUrl())),
    (app.bookmarks[r].items = []),
    (app.bookmarks[r].updated = Math.floor(Date.now() / 1e3)),
    (i = getUsername()),
    -1 != r.indexOf("stories")
      ? $("#hnmain .athing", e).each(function (e) {
          var t = $(this),
            a = t.next(),
            a = {
              id: t.attr("id"),
              title: $(".titlelink", t).first().text(),
              domain: $(".sitestr", t).first().text(),
              user: $(".hnuser", a).first().text(),
              age: $(".age", a).first().attr("title"),
            };
          (null != a.title && 0 != a.title.length) ||
            (a.title = $(".titleline a", t).first().text()),
            app.bookmarks[r].items.push(a);
        })
      : $(".athing", e).each(function (e) {
          var t,
            a,
            o,
            s,
            n = $(".commtext", this).first().html();
          (null == n && null == (n = $.trim($(".comment", this).text()))) ||
            (0 < (o = n.split("<div")).length && (n = o[0]),
            (t = $(this).attr("id")),
            (a = $(".onstory a", this).first().attr("href")),
            (s = $(".onstory a", this).first().text()),
            (o = $(".hnuser", this).first().text()),
            ("comments_posted" == r && o != i) ||
              (0 != n.length &&
                ((s = {
                  id: t,
                  user: o,
                  age: $(".age", this).first().attr("title"),
                  text: n,
                  on_link: a,
                  on_title: s,
                }),
                app.bookmarks[r].items.push(s))));
        }),
    saveBookmarks()),
    drawBookmarks();
};
function saveBookmarks() {
  chrome.storage.local.set({ bookmarks: JSON.stringify(app.bookmarks) });
}
function clearBookmarks() {
  (app.bookmarks = {
    stories_fav: { updated: null, items: [] },
    stories_fav_private: { updated: null, items: [] },
    stories_upvoted: { updated: null, items: [] },
    stories_posted: { updated: null, items: [] },
    comments_fav: { updated: null, items: [] },
    comments_fav_private: { updated: null, items: [] },
    comments_upvoted: { updated: null, items: [] },
    comments_posted: { updated: null, items: [] },
    users: { updated: null, items: [] },
    highlights: { updated: null, items: [] },
    highlights_tab: "all",
    tab: "stories_fav",
    tab_last: "stories_fav",
    storage: "private",
    comments_truncate: !0,
    stories_truncate: !0,
    highlights_truncate: !1,
  }),
    saveBookmarks();
}
function loadBookmarks() {
  chrome.storage.local.get(["bookmarks"], function (e) {
    void 0 !== e.bookmarks &&
      ((app.bookmarks = JSON.parse(e.bookmarks)),
      upgradeBookmarks(),
      drawHighlights(),
      updateProfileBookmarkButton(),
      updateStoryBookmarkButton(),
      updateCommentBookmarkButtons());
  });
}
function updateSettingFontSize(e) {
  1 == onListPage()
    ? "table" == app.settings.stories_view
      ? (app.settings.table_font_size = e)
      : (app.settings.list_font_size = e)
    : (app.settings.font_size = e),
    saveSettings(),
    applyStylesAfterTimeout();
}
function getSettingFontSize() {
  var e = app.settings.font_size;
  return (e =
    1 == onListPage()
      ? "table" == app.settings.stories_view
        ? app.settings.table_font_size
        : app.settings.list_font_size
      : e);
}
function updateSettingLineHeight(e) {
  1 == onListPage()
    ? "table" == app.settings.stories_view
      ? (app.settings.table_line_height = e)
      : (app.settings.list_line_height = e)
    : (app.settings.line_height = e),
    saveSettings(),
    applyStylesAfterTimeout();
}
function getSettingLineHeight() {
  var e = app.settings.line_height;
  return (e =
    1 == onListPage()
      ? "table" == app.settings.stories_view
        ? app.settings.table_line_height
        : app.settings.list_line_height
      : e);
}
function updateSettingWidth(e) {
  1 == onListPage()
    ? "table" == app.settings.stories_view
      ? (app.settings.table_width = e)
      : (app.settings.list_width = e)
    : (app.settings.width = e),
    saveSettings(),
    applyStylesAfterTimeout();
}
function getSettingWidth() {
  var e = app.settings.width;
  return (e =
    1 == onListPage()
      ? "table" == app.settings.stories_view
        ? app.settings.table_width
        : app.settings.list_width
      : e);
}
function updateSettingFont(e) {
  1 == onListPage()
    ? "table" == app.settings.stories_view
      ? (app.settings.table_font = e)
      : (app.settings.list_font = e)
    : (app.settings.font = e),
    saveSettings(),
    applyStylesAfterTimeout(),
    $(".settings-font-button-selected").removeClass(
      "settings-font-button-selected",
    ),
    ("sans" == e
      ? $(".settings-font-button-sans")
      : $(".settings-font-button-serif")
    ).addClass("settings-font-button-selected");
}
function getSettingFont() {
  var e = app.settings.font;
  return (e =
    1 == onListPage()
      ? "table" == app.settings.stories_view
        ? app.settings.table_font
        : app.settings.list_font
      : e);
}
function updateSettingTheme(e) {
  (app.settings.theme = e),
    saveSettings(),
    applyStylesAfterTimeout(),
    $(".settings-color").removeClass("settings-color-selected"),
    $(".settings-color-" + e).addClass("settings-color-selected");
}
function saveSettings() {
  chrome.storage.local.set({ settings: app.settings }), storeBgColor();
}
function loadSettings() {
  chrome.storage.local.get(["settings"], function (e) {
    void 0 !== e.settings && (app.settings = e.settings),
      applySettings(),
      storeSection(),
      hideLoadingOverlay(),
      1 == onListPage() &&
        (drawStories(), updateNewComments(), setupUserHover());
  });
}
function clearSettings() {
  chrome.storage.local.remove("settings");
}
function storeBgColor() {
  var e = "#fff",
    t = !1;
  "sepia" == app.settings.theme
    ? (e = "rgb(246,246,239)")
    : "slate" == app.settings.theme
      ? ((e = "rgb(39,40,45)"), (t = !0))
      : "dark" == app.settings.theme
        ? ((e = "rgb(17,18,22)"), (t = !0))
        : "black" == app.settings.theme && ((e = "rgb(0,0,0)"), (t = !0)),
    localStorage.setItem("bg_color", e),
    localStorage.setItem("bg_dark", t),
    localStorage.setItem("theme", app.settings.theme);
}
var applySettingsTimeout = 0;
function applySettings() {
  var e = !1;
  0 == app.settings.installed &&
    (applyDefaultSettings(), (e = app.settings.installed = !0), saveSettings()),
    upgradeSettings(),
    applyStyles(),
    updateSettingHeader(),
    updateSettingContents(),
    updateSettingJustify(),
    updateSettingFontSmoothing(),
    updateSettingNewTab(),
    updateSettingFadeLow(),
    updateSettingFadeVisited(),
    updateSettingHighlightNew(),
    updateSettingHoverIcons(),
    1 == e
      ? setTimeout(function () {
          showInstalledDialog();
        }, 500)
      : ("price_reduction" == app.settings.update_msg &&
          0 == isPro() &&
          setTimeout(function () {
            showUpgradeDialog();
          }, 500),
        (app.settings.update_msg = ""),
        saveSettings());
}
function showInstalledDialog() {
  showDialog("install");
}
function upgradeSettings() {
  void 0 === app.settings.fade_visited && (app.settings.fade_visited = !0),
    void 0 === app.settings.update_msg &&
      (app.settings.update_msg = "price_reduction"),
    saveSettings();
}
function upgradeBookmarks() {
  void 0 === app.bookmarks.highlights &&
    (app.bookmarks.highlights = { updated: null, items: [] }),
    saveBookmarks();
}
function applyDefaultSettings(e) {
  var e = void 0 !== e && e,
    t = $(window).width();
  (app.settings.width =
    2500 < t
      ? 30
      : 2400 < t
        ? 31
        : 2300 < t
          ? 32
          : 2200 < t
            ? 34
            : 2100 < t
              ? 35
              : 2e3 < t || 1900 < t
                ? 37
                : 1800 < t
                  ? 39
                  : 1700 < t
                    ? 41
                    : 1600 < t
                      ? 44
                      : 1500 < t
                        ? 48
                        : 1400 < t
                          ? 50
                          : 1350 < t
                            ? 52
                            : 1250 < t
                              ? 56
                              : 1200 < t
                                ? 58
                                : 1100 < t
                                  ? 64
                                  : 1050 < t
                                    ? 67
                                    : 1e3 < t
                                      ? 70
                                      : 900 < t
                                        ? 76
                                        : 800 < t
                                          ? 84
                                          : 100),
    (app.settings.table_width = parseInt(1.2 * app.settings.width)),
    (app.settings.list_width = app.settings.width),
    1 == e &&
      (saveSettings(),
      applyStylesAfterTimeout(),
      console.log(
        "applyDefaultSettings() - width: " +
          app.settings.width +
          " table_width: " +
          app.settings.table_width +
          " list_width: " +
          app.settings.list_width,
      ));
}
function applyPageWidth() {
  $("body")
    .get(0)
    .style.setProperty("--page-width", getSettingWidth() + "%"),
    setTimeout(function () {
      $("#hn_content").offset().left < 200
        ? ($("#hn_header_inner").addClass("wiki-header-inner-full"),
          $("#hn_header_tabs").addClass("wiki-header-tabs-pad"),
          $("#hn_header_title").addClass("wiki-header-title-pad"))
        : ($("#hn_header_inner").removeClass("wiki-header-inner-full"),
          $("#hn_header_tabs").removeClass("wiki-header-tabs-pad"),
          $("#hn_header_title").removeClass("wiki-header-title-pad"));
    }, 100);
}
function updateSettingContents(e) {
  e = void 0 !== e && e;
  1 == app.settings.contents
    ? (1 == e
        ? $("#wiki_contents").css("transition", "all 0.27s ease-out")
        : $("#wiki_contents").css("transition", "none"),
      $("#wiki_contents").removeClass("wiki-contents-hide"),
      $("body").removeClass("theme-contents-hidden"),
      $("body").addClass("theme-contents-visible"))
    : (1 == e
        ? $("#wiki_contents").css("transition", "all 0.27s ease-in")
        : $("#wiki_contents").css("transition", "none"),
      $("#wiki_contents").addClass("wiki-contents-hide"),
      1 == e
        ? setTimeout(function () {
            $("body").removeClass("theme-contents-visible"),
              $("body").addClass("theme-contents-hidden");
          }, 250)
        : ($("body").removeClass("theme-contents-visible"),
          $("body").addClass("theme-contents-hidden")));
}
function updateSettingHeader() {
  1 == app.settings.fixed_header
    ? $("#hn_header").addClass("wiki-header-fixed")
    : $("#hn_header").removeClass("wiki-header-fixed");
}
function updateSliderStyle(e) {
  var t = e[0].min;
  e.css(
    "background-image",
    "-webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(" +
      (t < 0 ? "50%" : "0%") +
      ", " +
      sliderBgColor +
      "), color-stop(100%, " +
      sliderBgColor +
      "))",
  );
}
function updateSliderTrackSize(e) {
  var t, a, o, s, n, i, r;
  0 != e.length &&
    ((t = e[0].min),
    (a = e[0].max),
    (o = e[0].value),
    (s = Math.floor(e.width())),
    (n = Math.floor(e.width() / 2)),
    (i = (100 * (o - t)) / (a - t) + "% 100%"),
    (r = "0px 0px"),
    t < 0 && 0 < a
      ? (-0.5 == t && 0.5 == a && (o *= 2),
        (r =
          0 <= o
            ? ((i = n * o + "px 100%"), n + "px 0px")
            : ((i = Math.floor(n * Math.abs(o)) + "px 100%"),
              Math.floor(n - Math.floor(n * Math.abs(o))) + "px 0px")))
      : t < 0 &&
        0 == a &&
        ((r = s - Math.floor(s * (Math.abs(o) / Math.abs(t))) + "px 0px"),
        (i = "100% 100%")),
    e.css({ backgroundSize: i }).css("background-position", r));
}
var dialogOpen = !1;
function showDialog(e, t) {
  t = void 0 === t || t;
  1 == dialogOpen && removeDialog(), hideMenu(!(dialogOpen = !0));
  e = createDialog(e);
  1 == t
    ? e.addClass("dialog-show")
    : e.addClass("dialog-show dialog-show-no-anim"),
    setTimeout(function () {
      $("#dialog_wrap").focus();
    }, 10);
}
function hideDialog(e) {
  1 == (e = void 0 === e || e)
    ? ($("#dialog_wrap").removeClass("dialog-show dialog-show-no-anim"),
      setTimeout(function () {
        removeDialog();
      }, 380))
    : removeDialog();
}
function removeDialog() {
  $("#dialog_wrap").remove(), (dialogOpen = !1);
}
function createDialog(e) {
  var t = $("<div />")
    .addClass("dialog-wrap")
    .attr("id", "dialog_wrap")
    .appendTo("body");
  $("<div />")
    .addClass("dialog-close")
    .appendTo(t)
    .on("click", function () {
      hideDialog();
    });
  var a = $("<div />").addClass("dialog-content-wrap").appendTo(t),
    o = $("<div />").addClass("dialog-content").appendTo(a),
    s = $("<div />").addClass("dialog-header").appendTo(o);
  $("<div />").addClass("dialog-inner").appendTo(o),
    $("<div />").addClass("dialog-footer").appendTo(o);
  t.scroll(function () {}),
    t.off("touchmove").on("touchmove", function (e) {
      if (!(0 < $(e.target).closest(".dialog-content").length)) {
        var t = e.originalEvent,
          a = t.touches[t.touches.length - 1].pageX - $(this).offset().left;
        t.touches[t.touches.length - 1].pageY, $(this).offset().top;
        return (
          a < $(window).width() - 30 && hideDialog(),
          e.preventDefault(),
          e.stopPropagation(),
          !1
        );
      }
    }),
    t.off("mousedown").on("mousedown", function (e) {
      var t;
      0 < $(e.target).closest(".dialog-content").length ||
        ((t = e.pageX - $(this).offset().left),
        e.pageY,
        $(this).offset().top,
        t < $(window).width() - 30 && hideDialog());
    }),
    drawDialog(e, s);
  (s = $(window).width() / 2 - a.width() / 2), $(window).height(), a.height();
  return a.css("left", s + "px").css("top", "0px"), t;
}
function drawDialog(e, t) {
  var a = $("<div />").addClass("dialog-card-header").appendTo(t),
    t = "Submit";
  "login" == e
    ? (t = "Login")
    : "register" == e
      ? (t = "Create Account")
      : "edit_profile" == e
        ? (t = "Edit Profile")
        : ("upgrade" != e && "install" != e) || (t = "Modern Pro");
  $("<div />").addClass("dialog-card-title").text(t).appendTo(a);
  a = $("<div />").addClass("dialog-cross").appendTo(a);
  a.css(
    "background-image",
    "url('" + getImageUrl("images/icon-cross.png") + "')",
  ),
    a.on("click", function () {
      hideDialog();
    }),
    "edit_profile" == e
      ? drawEditProfileDialog()
      : "submit" == e
        ? drawSubmitDialog()
        : "login" == e
          ? drawLoginDialog()
          : "register" == e
            ? drawRegisterDialog()
            : "upgrade" == e
              ? drawUpgradeDialog()
              : "install" == e && drawInstallDialog();
}
function drawEditProfileDialog() {
  var e = $(".dialog-inner").first(),
    t = $(".dialog-footer").first(),
    a = $(".profileform textarea[name='about']").val(),
    o = $(".profileform input[name='email']").val(),
    s = $(".profileform select[name='showd']").val(),
    n = $(".profileform select[name='nopro']").val(),
    i = $(".profileform input[name='maxv']").val(),
    r = $(".profileform input[name='mina']").val(),
    d = $(".profileform input[name='topc']").val(),
    l = $(".profileform input[name='delay']").val(),
    p = $("input[name='hmac']").first().attr("value"),
    m = $("<div />").addClass("dialog-form-wrap").appendTo(e),
    u = $("<form />")
      .attr("id", "edit_profile_form")
      .attr("method", "post")
      .attr("action", "/xuser")
      .addClass("dialog-form")
      .appendTo(m);
  u.on("submit", function () {
    hideDialog();
  }),
    $("<input />")
      .attr("type", "hidden")
      .attr("name", "hmac")
      .attr("value", p)
      .prependTo(u),
    $("<input />")
      .attr("type", "hidden")
      .attr("name", "id")
      .attr("value", app.user)
      .prependTo(u);
  var g = $("<table />").addClass("dialog-table").appendTo(u),
    h = $("<tr />").appendTo(g),
    c = $("<tr />").appendTo(g),
    f = $("<tr />").appendTo(g),
    e = $("<tr />").appendTo(g),
    m = $("<tr />").appendTo(g),
    p = $("<tr />").appendTo(g),
    u = $("<tr />").appendTo(g),
    g = $("<tr />").appendTo(g);
  $("<td />")
    .addClass("dialog-table-left dialog-table-label-textarea")
    .text("About")
    .appendTo(h),
    $("<td />")
      .addClass("dialog-table-left dialog-table-label")
      .text("Email")
      .appendTo(c),
    $("<td />")
      .addClass("dialog-table-left dialog-table-label")
      .text("Show Dead")
      .appendTo(f),
    $("<td />")
      .addClass("dialog-table-left dialog-table-label")
      .text("No Procrast")
      .appendTo(e),
    $("<td />")
      .addClass("dialog-table-left dialog-table-label")
      .text("Max Visit")
      .appendTo(m),
    $("<td />")
      .addClass("dialog-table-left dialog-table-label")
      .text("Min Away")
      .appendTo(p),
    $("<td />")
      .addClass("dialog-table-left dialog-table-label")
      .text("Top Color")
      .appendTo(u),
    $("<td />")
      .addClass("dialog-table-left dialog-table-label")
      .text("Delay")
      .appendTo(g);
  (h = $("<td />").appendTo(h)),
    (c = $("<td />").appendTo(c)),
    (f = $("<td />").appendTo(f)),
    (e = $("<td />").appendTo(e)),
    (m = $("<td />").appendTo(m)),
    (p = $("<td />").appendTo(p)),
    (u = $("<td />").appendTo(u)),
    (g = $("<td />").appendTo(g));
  $("<textarea />")
    .attr("name", "about")
    .attr("rows", 7)
    .val(a)
    .addClass("dialog-form-input dialog-form-input-full")
    .appendTo(h),
    $("<div />")
      .addClass("dialog-form-text")
      .text(
        "Only admins see your email below. To share publicly, add to the 'about' box.",
      )
      .appendTo(h),
    $("<input />")
      .attr("type", "text")
      .attr("name", "email")
      .val(o)
      .addClass("dialog-form-input dialog-form-input-full")
      .appendTo(c);
  (c = $("<select />")
    .attr("name", "showd")
    .addClass("dialog-form-input")
    .appendTo(f)),
    (f = $("<option />").attr("value", "yes").text("Yes").appendTo(c)),
    (c = $("<option />").attr("value", "no").text("No").appendTo(c));
  "yes" == s
    ? f.attr("selected", "selected")
    : "no" == s && c.attr("selected", "selected");
  (c = $("<select />")
    .attr("name", "nopro")
    .addClass("dialog-form-input")
    .appendTo(e)),
    (e = $("<option />").attr("value", "yes").text("Yes").appendTo(c)),
    (c = $("<option />").attr("value", "no").text("No").appendTo(c));
  "yes" == n
    ? e.attr("selected", "selected")
    : "no" == n && c.attr("selected", "selected"),
    $("<input />")
      .attr("type", "text")
      .attr("name", "maxv")
      .val(i)
      .addClass("dialog-form-input")
      .appendTo(m),
    $("<input />")
      .attr("type", "text")
      .attr("name", "mina")
      .val(r)
      .addClass("dialog-form-input")
      .appendTo(p),
    $("<input />")
      .attr("type", "text")
      .attr("name", "topc")
      .val(d)
      .addClass("dialog-form-input")
      .appendTo(u),
    $("<input />")
      .attr("type", "text")
      .attr("name", "delay")
      .val(l)
      .addClass("dialog-form-input")
      .appendTo(g);
  t = $("<div />").addClass("dialog-form-buttons").appendTo(t);
  $("<input />")
    .attr("type", "submit")
    .val("Update")
    .addClass("hn-comment-reply-button dialog-form-button")
    .appendTo(t)
    .on("click", function () {
      $("#edit_profile_form").submit();
    });
}
function drawSubmitDialog() {
  var e = $(".dialog-inner").addClass("dialog-inner-submit").first(),
    t = $(".dialog-footer").first(),
    a = $("<div />").addClass("dialog-form-wrap").appendTo(e),
    o = $("<form />")
      .attr("id", "submit_form")
      .attr("method", "post")
      .attr("action", "/r")
      .addClass("dialog-form")
      .appendTo(a);
  o.on("submit", function () {
    hideDialog();
  }),
    $("<input />")
      .attr("type", "hidden")
      .attr("name", "fnop")
      .attr("value", "submit-page")
      .prependTo(o);
  var s = $("<table />").addClass("dialog-table").appendTo(o),
    e = $("<tr />").appendTo(s),
    a = $("<tr />").appendTo(s),
    o = $("<tr />").appendTo(s);
  $("<td />")
    .addClass(
      "dialog-table-left dialog-table-left-small dialog-table-label-textarea",
    )
    .text("Title")
    .appendTo(e),
    $("<td />")
      .addClass("dialog-table-left dialog-table-left-small dialog-table-label")
      .text("URL")
      .appendTo(a),
    $("<td />")
      .addClass("dialog-table-left dialog-table-left-small dialog-table-label")
      .text("Text")
      .appendTo(o);
  var s = $("<td />").appendTo(e),
    e = $("<td />").appendTo(a),
    a = $("<td />").appendTo(o),
    n = $("<input />")
      .attr("type", "text")
      .attr("name", "title")
      .addClass("dialog-form-input dialog-form-input-full")
      .appendTo(s);
  n
    .attr("autocomplete", "off")
    .attr("spellcheck", "false")
    .attr("autocapitalize", "off")
    .attr("autocorrect", "off"),
    setTimeout(function () {
      n.focus();
    }, 20);
  o = getSectionFromUrl();
  "ask" == o || "asknew" == o
    ? n.val("Ask HN: ")
    : ("show" != o && "shownew" != o) || n.val("Show HN: "),
    $("<div />")
      .attr("id", "dialog_form_chars")
      .addClass("dialog-form-chars")
      .appendTo(s),
    n.on("input focus", function () {
      var e = $(this).val().length - 80;
      0 < e
        ? $("#dialog_form_chars")
            .text(e + " too long")
            .show()
        : $("#dialog_form_chars").text("").hide();
    }),
    $("<input />")
      .attr("type", "text")
      .attr("name", "url")
      .addClass("dialog-form-input dialog-form-input-full")
      .appendTo(e)
      .attr("autocomplete", "off")
      .attr("spellcheck", "false")
      .attr("autocapitalize", "off")
      .attr("autocorrect", "off"),
    $("<textarea />")
      .attr("name", "text")
      .attr("rows", 7)
      .addClass("dialog-form-input dialog-form-input-full")
      .appendTo(a),
    $("<div />")
      .addClass("dialog-form-text")
      .text(
        "Leave url blank to submit a question for discussion. If there is no url, text will appear at the top of the thread. If there is a url, text is optional.",
      )
      .appendTo(a);
  t = $("<div />").addClass("dialog-form-buttons").appendTo(t);
  $("<input />")
    .attr("type", "submit")
    .val("Submit")
    .addClass("hn-comment-reply-button dialog-form-button")
    .appendTo(t)
    .on("click", function () {
      $("#submit_form").submit();
    }),
    getSubmitFormParams();
}
const getSubmitFormParams = async () => {
  var e = await getPageHTML("https://news.ycombinator.com/submit"),
    t = $("form input[name='fnid']", e).first().attr("value"),
    e = $("#submit_form");
  $("<input />")
    .attr("type", "hidden")
    .attr("name", "fnid")
    .attr("value", t)
    .prependTo(e);
};
function drawLoginDialog() {
  var e = $(".dialog-inner").addClass("dialog-inner-login").first(),
    t = $(".dialog-footer").first(),
    a = $("<div />").addClass("dialog-form-wrap").appendTo(e),
    e = $("<form />")
      .attr("id", "login_form")
      .attr("method", "post")
      .attr("action", "/login")
      .addClass("dialog-form")
      .appendTo(a);
  e.on("submit", function () {
    hideDialog();
  });
  (a = $("<table />").addClass("dialog-table").appendTo(e)),
    (e = $("<tr />").appendTo(a)),
    (a = $("<tr />").appendTo(a));
  $("<td />")
    .addClass("dialog-table-left dialog-table-left-medium dialog-table-label")
    .text("Username")
    .appendTo(e),
    $("<td />")
      .addClass("dialog-table-left dialog-table-left-medium dialog-table-label")
      .text("Password")
      .appendTo(a);
  var e = $("<td />").appendTo(e),
    a = $("<td />").appendTo(a),
    o = $("<input />")
      .attr("type", "text")
      .attr("name", "acct")
      .addClass("dialog-form-input dialog-form-input-full")
      .appendTo(e);
  o.on("keydown", function (e) {
    if (13 == e.which) return $("#login_form").submit(), e.preventDefault(), !1;
  }),
    setTimeout(function () {
      o.focus();
    }, 20),
    o
      .attr("autocomplete", "off")
      .attr("autocorrect", "off")
      .attr("spellcheck", "false")
      .attr("autocapitalize", "off"),
    $("<input />")
      .attr("type", "password")
      .attr("name", "pw")
      .addClass("dialog-form-input dialog-form-input-full")
      .appendTo(a)
      .on("keydown", function (e) {
        if (13 == e.which)
          return $("#login_form").submit(), e.preventDefault(), !1;
      });
  t = $("<div />").addClass("dialog-form-buttons").appendTo(t);
  $("<input />")
    .attr("type", "submit")
    .val("Login")
    .addClass("hn-comment-reply-button dialog-form-button")
    .appendTo(t)
    .on("click", function () {
      $("#login_form").submit();
    }),
    $("<div />")
      .addClass("dialog-form-link")
      .text("Create account")
      .prependTo(t)
      .on("click", function () {
        showDialog("register", !1);
      });
}
function drawUpgradeDialog() {
  var e = $(".dialog-inner").first(),
    t = $(".dialog-card-header").first(),
    a = $(".dialog-footer").first();
  e.addClass("dialog-inner-upgrade"), t.hide(), a.hide();
  $("<div />").appendTo(e)
    .html(`<div id="upgrade_close" class="upgrade-close"></div>

		<div class="upgrade-header">
		<img src="${getImageUrl("images/icon2.png")}" class="upgrade-logo" />
	</div>

	<div class="upgrade-content">

		<div class="upgrade-title">Modern <span>Pro</span></div>

		<div class="upgrade-features" id="features">

			<div class="upgrade-message">Take your Hacker News experience to the next level!<div>Now only <i>$10</i> (one-time purchase)</div></div>

			<div class="upgrade-feature-wrap" id="feature_bookmarks">

				<div class="upgrade-feature-left">
					<div id="feature_bookmarks_0" class="upgrade-feature-image upgrade-feature-image-bookmarks-0"></div>
					<div id="feature_bookmarks_1" class="upgrade-feature-image upgrade-feature-image-bookmarks-1"></div>
					<div id="feature_bookmarks_2" class="upgrade-feature-image upgrade-feature-image-bookmarks-2"></div>
					<div id="feature_bookmarks_3" class="upgrade-feature-image upgrade-feature-image-bookmarks-3"></div>
				</div>

				<div class="upgrade-feature-right">
					<div class="upgrade-feature-title">Bookmarks</div>
					<div class="upgrade-feature-text">Save your favorite stories, comments, highlights and users. No account needed. Stored privately in browser. Backup and restore to JSON file.</div>
				</div>

			</div>

			<div class="upgrade-feature-wrap" id="feature_replies">

				<div class="upgrade-feature-left">
					<div id="feature_replies_0" class="upgrade-feature-image upgrade-feature-image-replies-0"></div>
					<div id="feature_replies_1" class="upgrade-feature-image upgrade-feature-image-replies-1"></div>
					<div id="feature_replies_2" class="upgrade-feature-image upgrade-feature-image-replies-2"></div>
				</div>

				<div class="upgrade-feature-right">
					<div class="upgrade-feature-title">New Replies</div>
					<div class="upgrade-feature-text">Shows a badge next to stories with new replies since your last visit. Orange arrows can be used to navigate new comments within stories.</div>
				</div>

			</div>

			<div class="upgrade-feature-wrap" id="feature_highlighter">

				<div class="upgrade-feature-left">
					<div id="feature_highlighter_0" class="upgrade-feature-image upgrade-feature-image-highlighter-0"></div>
					<div id="feature_highlighter_1" class="upgrade-feature-image upgrade-feature-image-highlighter-1"></div>
				</div>

				<div class="upgrade-feature-right">
					<div class="upgrade-feature-title">Highlighter</div>
					<div class="upgrade-feature-text">Select any text and click the bookmark icon to create a highlight. These are also saved to your bookmarks where they can be easily read.</div>
				</div>

			</div>

			<div class="upgrade-feature-wrap" id="feature_user">

				<div class="upgrade-feature-left">
					<div id="feature_user_0" class="upgrade-feature-image upgrade-feature-image-user-0"></div>
					<div id="feature_user_1" class="upgrade-feature-image upgrade-feature-image-user-1"></div>
					<div id="feature_user_2" class="upgrade-feature-image upgrade-feature-image-user-2"></div>
				</div>

				<div class="upgrade-feature-right">
					<div class="upgrade-feature-title">User Popup</div>
					<div class="upgrade-feature-text">Hover over any username to see account age, karma and a full scrollable about section. Save users to your bookmarks using the icon.</div>
				</div>

			</div>

			<div class="upgrade-feature-wrap" id="feature_selection">

				<div class="upgrade-feature-left">
					<div id="feature_selection_0" class="upgrade-feature-image upgrade-feature-image-selection-0"></div>
					<div id="feature_selection_1" class="upgrade-feature-image upgrade-feature-image-selection-1"></div>
					<div id="feature_selection_2" class="upgrade-feature-image upgrade-feature-image-selection-2"></div>
				</div>

				<div class="upgrade-feature-right">
					<div class="upgrade-feature-title">Selection Popup</div>
					<div class="upgrade-feature-text">Select any text to show a useful popup menu. Highlight, reply quoting the text, copy to clipboard, speak the text (TTS), or search on HN.</div>
				</div>

			</div>

			<div class="upgrade-feature-wrap" id="feature_controls">

				<div class="upgrade-feature-left">
					<div id="feature_controls_0" class="upgrade-feature-image upgrade-feature-image-controls-0"></div>
				</div>

				<div class="upgrade-feature-right">
					<div class="upgrade-feature-title">Control Pad</div>
					<div class="upgrade-feature-text">Use the intelligent arrow buttons to quickly navigate between comments and around pages. Includes keyboard shortcuts for full control.</div>
				</div>

			</div>

			<div class="upgrade-feature-wrap" id="feature_date">

				<div class="upgrade-feature-left">
					<div id="feature_date_0" class="upgrade-feature-image upgrade-feature-image-date-0"></div>
					<div id="feature_date_1" class="upgrade-feature-image upgrade-feature-image-date-1"></div>
				</div>

				<div class="upgrade-feature-right">
					<div class="upgrade-feature-title">Date Picker</div>
					<div class="upgrade-feature-text">Quickly navigate back to previous days using the date picker widget. Makes it easy to see the front page of HN on specific days in the past.</div>
				</div>

			</div>

			<div class="upgrade-feature-wrap" id="feature_history">

				<div class="upgrade-feature-left">
					<div id="feature_history_0" class="upgrade-feature-image upgrade-feature-image-history-0"></div>
				</div>

				<div class="upgrade-feature-right">
					<div class="upgrade-feature-title">Unlimited History</div>
					<div class="upgrade-feature-text">The free version is limited to 30 items. Upgrade to save unlimited history. Backup and restore to JSON file.</div>
				</div>

			</div>

			<div class="upgrade-feature-wrap" id="feature_backup">

				<div class="upgrade-feature-left">
					<div id="feature_backup_0" class="upgrade-feature-image upgrade-feature-image-backup-0"></div>
				</div>

				<div class="upgrade-feature-right">
					<div class="upgrade-feature-title">Backup & Restore</div>
					<div class="upgrade-feature-text">Your data is stored privately within the browser, and can also be imported / exported to a JSON file. You are in full control of your data.</div>
				</div>

			</div>

			<div class="upgrade-feature-wrap upgrade-feature-wrap-short" id="feature_sub">

				<div class="upgrade-feature-left">
					<div id="feature_sub_0" class="upgrade-feature-image upgrade-feature-image-sub-0"></div>
				</div>

				<div class="upgrade-feature-right">
					<div class="upgrade-feature-title">Pay Once, Use Forever</div>
					<div class="upgrade-feature-text">The upgrade is a one-time purchase. There's no subscription or hidden costs. Pay once to unlock all the Pro features forever.</div>
				</div>

			</div>

			<div class="upgrade-feature-wrap upgrade-feature-wrap-short" id="feature_indie">

				<div class="upgrade-feature-left">
					<div id="feature_indie_0" class="upgrade-feature-image upgrade-feature-image-indie-0"></div>
				</div>

				<div class="upgrade-feature-right">
					<div class="upgrade-feature-title">Support Indie Development</div>
					<div class="upgrade-feature-text">I'm just one guy building Modern for HN, and your support will allow me to continue developing the extension and making it  even better! Thanks :)</div>
				</div>

			</div>

		</div>


		<div class="upgrade-features-shadow-bottom"></div>

	</div>

	<div class="upgrade-button-wrap upgrade-button-wrap-center">

		<div id="upgrade_button" class="upgrade-button upgrade-button-dark"><span></span>Upgrade to Pro <div>$10</div></div>

	</div>`);
  $("#upgrade_close").on("click", function () {
    hideDialog();
  }),
    $("#upgrade_button").on("click", function () {
      openPayment();
    }),
    $("#features").on("scroll", function () {
      $(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight
        ? $("#upgrade_button").addClass("button-pulse")
        : $("#upgrade_button").removeClass("button-pulse");
    }),
    changeImages(!1);
}
function drawInstallDialog() {
  var e = $(".dialog-inner").first(),
    t = $(".dialog-card-header").first(),
    a = $(".dialog-footer").first();
  e.addClass("dialog-inner-install"), t.hide(), a.hide();
  $("<div />").appendTo(e)
    .html(`<div id="upgrade_close" class="upgrade-close"></div>

		<div class="upgrade-header">
			<img src="${getImageUrl("images/icon2.png")}" class="upgrade-logo installed-logo" />
		</div>

		<div class="upgrade-content installed-content">

			<div class="upgrade-title">Modern for <span>HN</span></div>

			<div class="upgrade-features installed-features" id="features">

				<div class="upgrade-message installed-message">Welcome to <i>Modern for Hacker News</i>. To customize the design to your liking, use the following features:</div>

				<div class="upgrade-feature-wrap" id="feature_theme">

					<div class="upgrade-feature-left">
						<div id="feature_theme_0" class="upgrade-feature-image upgrade-feature-image-theme-0"></div>
						<div id="feature_theme_1" class="upgrade-feature-image upgrade-feature-image-theme-1"></div>
					</div>

					<div class="upgrade-feature-right">
						<div class="upgrade-feature-title">Theme Settings</div>
						<div class="upgrade-feature-text">Click the "<div><span>A</span>A</div>" icon to open. Adjust font, line height & content width. Works separately on index / story pages. Set theme using the circle buttons.</div>
					</div>

				</div>

				<div class="upgrade-feature-wrap" id="feature_list">

					<div class="upgrade-feature-left">
						<div id="feature_list_0" class="upgrade-feature-image upgrade-feature-image-list-0"></div>
						<div id="feature_list_1" class="upgrade-feature-image upgrade-feature-image-list-1"></div>
						<div id="feature_list_2" class="upgrade-feature-image upgrade-feature-image-list-2"></div>
						<div id="feature_list_3" class="upgrade-feature-image upgrade-feature-image-list-3"></div>
					</div>

					<div class="upgrade-feature-right">
						<div class="upgrade-feature-title">Index Settings</div>
						<div class="upgrade-feature-text">Click the dots icon on index pages to open.<br /> Switch between list / table view, customize the columns, make the title bold etc.</div>
					</div>

				</div>

			</div>

		</div>`);
  $("#upgrade_close").on("click", function () {
    hideDialog();
  }),
    changeImages(!0);
}
var featuresUpgrade = [
    {
      name: "bookmarks",
      index: 0,
      frames: [
        { duration: 800, anim: "" },
        { duration: 1500, anim: "" },
        {
          duration: 4e3,
          anim: "feature-bookmarks-menu 3.8s ease-in-out 0s 1 normal forwards",
        },
        {
          duration: 6e3,
          anim: "feature-bookmarks-menu-storage 4.5s ease-out 0s 1 normal forwards",
        },
      ],
    },
    {
      name: "replies",
      index: 0,
      frames: [
        { duration: 3200, anim: "feature-zoom 3s ease 0s 1 normal forwards" },
        { duration: 1600, anim: "feature-push 1.5s ease 0s 1 normal forwards" },
        {
          duration: 3300,
          anim: "feature-zoom-up 3s ease 0s 1 normal forwards",
        },
      ],
    },
    {
      name: "highlighter",
      index: 0,
      frames: [
        {
          duration: 3200,
          anim: "feature-zoom-in 3s ease 0s 1 normal forwards",
        },
        {
          duration: 3600,
          anim: "feature-zoom-out 3s ease 0s 1 normal forwards",
        },
      ],
    },
    {
      name: "user",
      index: 0,
      frames: [
        {
          duration: 3200,
          anim: "feature-zoom-in2 3s ease 0s 1 normal forwards",
        },
        {
          duration: 3600,
          anim: "feature-zoom-out2 3s ease 0s 1 normal forwards",
        },
        { duration: 3600, anim: "" },
      ],
    },
    {
      name: "selection",
      index: 0,
      frames: [
        {
          duration: 1600,
          anim: "feature-zoom-in-selection 1.5s ease-out 0s 1 normal forwards",
        },
        { duration: 70, anim: "" },
        {
          duration: 4600,
          anim: "feature-zoom-out-selection 4s ease 0s 1 normal forwards",
        },
      ],
    },
    {
      name: "date",
      index: 0,
      frames: [
        {
          duration: 3600,
          anim: "feature-zoom-in-date 2s ease 0s 1 normal forwards",
        },
        {
          duration: 2e3,
          anim: "feature-zoom-out-date 1.5s ease 0s 1 normal forwards",
        },
      ],
    },
    {
      name: "controls",
      index: 0,
      frames: [{ duration: 3200, anim: "feature-push 1.5s ease infinite" }],
    },
    {
      name: "history",
      index: 0,
      frames: [
        { duration: 5500, anim: "feature-zoom-in-history 5s ease infinite" },
      ],
    },
    {
      name: "backup",
      index: 0,
      frames: [
        { duration: 5500, anim: "feature-zoom-in-backup 5s ease infinite" },
      ],
    },
    { name: "sub", index: 0, frames: [{ duration: 5500, anim: "" }] },
    { name: "indie", index: 0, frames: [{ duration: 5500, anim: "" }] },
  ],
  featuresInstalled = [
    {
      name: "theme",
      index: 0,
      frames: [
        {
          duration: 4e3,
          anim: "feature-theme-in 3s ease 0s 1 normal forwards",
        },
        {
          duration: 4e3,
          anim: "feature-theme-out 3s ease 0s 1 normal forwards",
        },
      ],
    },
    {
      name: "list",
      index: 0,
      frames: [
        {
          duration: 2650,
          anim: "feature-list 2s ease-in-out 0s 1 normal forwards",
        },
        {
          duration: 200,
          anim: "feature-list-change 0.05s ease 0s 1 normal forwards",
        },
        {
          duration: 2200,
          anim: "feature-list-open 2s ease 0s 1 normal forwards",
        },
        {
          duration: 3500,
          anim: "feature-list-columns 3s ease 0s 1 normal forwards",
        },
      ],
    },
  ];
function changeImages(e) {
  var t = featuresUpgrade;
  1 == e && (t = featuresInstalled);
  for (var a = 0; a < t.length; a++) changeImage(a, e);
}
function changeImage(e, t) {
  var a, o;
  0 != dialogOpen &&
    ((o = 1 == t ? featuresInstalled : featuresUpgrade),
    $("#feature_" + o[e].name + " .upgrade-feature-image")
      .removeClass("upgrade-feature-image-show")
      .css("animation", "none"),
    $("#feature_" + o[e].name + "_" + o[e].index).addClass(
      "upgrade-feature-image-show",
    ),
    (a = o[e].frames[o[e].index].anim),
    $("#feature_" + o[e].name + "_" + o[e].index).css("animation", a),
    (o = o[e].frames[o[e].index].duration),
    1 == t
      ? (featuresInstalled[e].index++,
        featuresInstalled[e].index >= featuresInstalled[e].frames.length &&
          (featuresInstalled[e].index = 0))
      : (featuresUpgrade[e].index++,
        featuresUpgrade[e].index >= featuresUpgrade[e].frames.length &&
          (featuresUpgrade[e].index = 0)),
    setTimeout(function () {
      changeImage(e, t);
    }, o));
}
function drawRegisterDialog() {
  var e = $(".dialog-inner").addClass("dialog-inner-login").first(),
    t = $(".dialog-footer").first(),
    a = $("<div />").addClass("dialog-form-wrap").appendTo(e),
    e = $("<form />")
      .attr("id", "register_form")
      .attr("method", "post")
      .attr("action", "/login")
      .addClass("dialog-form")
      .appendTo(a);
  e.on("submit", function () {
    hideDialog();
  }),
    $("<input />")
      .attr("type", "hidden")
      .attr("name", "creating")
      .attr("value", "t")
      .prependTo(e);
  (a = $("<table />").addClass("dialog-table").appendTo(e)),
    (e = $("<tr />").appendTo(a)),
    (a = $("<tr />").appendTo(a));
  $("<td />")
    .addClass("dialog-table-left dialog-table-left-medium dialog-table-label")
    .text("Username")
    .appendTo(e),
    $("<td />")
      .addClass("dialog-table-left dialog-table-left-medium dialog-table-label")
      .text("Password")
      .appendTo(a);
  var e = $("<td />").appendTo(e),
    a = $("<td />").appendTo(a),
    o = $("<input />")
      .attr("type", "text")
      .attr("name", "acct")
      .addClass("dialog-form-input dialog-form-input-full")
      .appendTo(e);
  setTimeout(function () {
    o.focus();
  }, 20),
    o
      .attr("autocomplete", "off")
      .attr("autocorrect", "off")
      .attr("spellcheck", "false")
      .attr("autocapitalize", "off"),
    $("<input />")
      .attr("type", "password")
      .attr("name", "pw")
      .addClass("dialog-form-input dialog-form-input-full")
      .appendTo(a);
  t = $("<div />").addClass("dialog-form-buttons").appendTo(t);
  $("<input />")
    .attr("type", "submit")
    .val("Create Account")
    .addClass("hn-comment-reply-button dialog-form-button")
    .appendTo(t)
    .on("click", function () {
      $("#register_form").submit();
    }),
    $("<div />")
      .addClass("dialog-form-link")
      .text("Login")
      .prependTo(t)
      .on("click", function () {
        showDialog("login", !1);
      });
}
function toggleContents() {
  (app.settings.contents = !app.settings.contents),
    updateSettingContents(!0),
    saveSettings();
}
function getImageUrl(e) {
  if (0 == app.test)
    try {
      e = chrome.runtime.getURL(e);
    } catch (e) {}
  return e;
}
function getFormattedNumber(e, t) {
  t = void 0 === t ? 1 : t;
  return e < 1e3
    ? e
    : 1e6 <= e
      ? parseFloat((e / 1e6).toFixed(t)) + "M"
      : parseFloat((e / 1e3).toFixed(t)) + "k";
}
function getFormattedNumberAndUnit(e) {
  var t = e,
    a = "";
  return (
    e < 1e3
      ? (t = e)
      : (a =
          1e6 <= e
            ? ((t = parseFloat((e / 1e6).toFixed(1))), "M")
            : ((t = parseFloat((e / 1e3).toFixed(1))), "k")),
    { value: t, unit: a }
  );
}
function commaSeparateNumber(e) {
  for (; /(\d+)(\d{3})/.test(e.toString()); )
    e = e.toString().replace(/(\d+)(\d{3})/, "$1,$2");
  return e;
}
function getFormattedDate(e) {
  var t = new Date(1e3 * e),
    a = (t.getMonth(), t.getDate(), t.getHours()),
    o = t.getMinutes(),
    e = t.getSeconds(),
    a = (a %= 12) || 12,
    o = ("0" + o).slice(-2),
    e = (e < 10 ? "0" : "") + e;
  return months[t.getMonth()] + " " + t.getDate() + ", " + t.getFullYear();
}
function getISODate(e) {
  var t = new Date(1e3 * e),
    a = ((a = t.getMonth() + 1) < 10 ? "0" : "") + a,
    e = ((e = t.getDate()) < 10 ? "0" : "") + e;
  return t.getFullYear() + "-" + a + "-" + e;
}
function getOldness(e, t, a, o, s) {
  var n = Math.round(new Date().getTime() / 1e3),
    t = void 0 !== t && t,
    a = void 0 === a || a,
    o = void 0 !== o && o,
    i = (s = void 0 === s ? n : s) - e;
  i < 0 && (i = 0);
  var r = parseInt(i),
    d = parseInt(i / 60),
    l = parseInt(i / 3600),
    p = parseInt(i / 86400),
    m = parseInt(i / 604800),
    u = Math.round(i / 2678400),
    e = Math.round(i / 31536e3),
    i = 0;
  1 == a && (i = 59);
  return 1 <= e
    ? e + (o ? "y" : " year" + (1 != e ? "s" : "")) + (t ? " ago" : "")
    : 2 <= u
      ? u + (o ? "mo" : " month" + (1 != u ? "s" : "")) + (t ? " ago" : "")
      : 4 <= m
        ? m + (o ? "w" : " week" + (1 != m ? "s" : "")) + (t ? " ago" : "")
        : 23 < l
          ? p + (o ? "d" : " day" + (1 != p ? "s" : "")) + (t ? " ago" : "")
          : 1 <= l
            ? l +
              "".toString() +
              (o ? "h" : " hour" + (1 != l ? "s" : "")) +
              (t ? " ago" : "")
            : i < r
              ? d + (o ? "m" : " min" + (1 != d ? "s" : "")) + (t ? " ago" : "")
              : s == n
                ? "Now"
                : r +
                  (o ? "s" : " sec" + (1 != r ? "s" : "")) +
                  (t ? " ago" : "");
}
function getAbsoluteUrl(e) {
  var t = e;
  return (t =
    "http" != e.slice(0, 4)
      ? "https://news.ycombinator.com" + ("/" == e.slice(0, 1) ? "" : "/") + e
      : t);
}
($.expr[":"].textEquals = function (e, t, a) {
  return $(e)
    .text()
    .match("^" + a[3] + "$");
}),
  "undefined" == typeof testMode && startup();

;}
      } catch(e) { console.error(`  Error executing script ${scriptPath_2ogw9rwb36i}`, e); }
    
  } else {
      console.log(`[${scriptName}] Skipping document-end phase (no document).`);
  }

  // --- Wait for Document Idle ---
  console.log(`[${scriptName}] Waiting for document idle state...`);
  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      await new Promise(resolve => window.requestIdleCallback(resolve, { timeout: 2000 })); // 2-second timeout fallback
      console.log(`[${scriptName}] requestIdleCallback fired or timed out.`);
  } else {
      // Fallback: wait a short period after DOMContentLoaded/current execution if requestIdleCallback is unavailable
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log(`[${scriptName}] Idle fallback timer completed.`);
  }

  // --- Document Idle ---
   if (typeof document !== 'undefined') {
    console.log(`[${scriptName}] Executing document-idle phase...`);
    
    
  } else {
      console.log(`[${scriptName}] Skipping document-idle phase (no document).`);
  }

  console.log(`[${scriptName}] All execution phases complete.`);
}

// --- Main Orchestration Logic ---
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

    // B. Determine if any script matches the current URL
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
            // Assuming Phase 1 focus: content-script-like context
            polyfillContext = buildPolyfill({ isBackground: false });
        } catch (e) {
            console.error(`[${SCRIPT_NAME}] Failed to build polyfill:`, e);
            return; // Cannot proceed without polyfill
        }

        console.log(`[${SCRIPT_NAME}] Polyfill built. Executing combined script logic...`);
        // D. Execute the combined logic
        // Pass the polyfill and CSS data to the function
        await executeAllScripts.call(polyfillContext.globalThis, polyfillContext, extensionCssData);

    } else {
        console.log(`[${SCRIPT_NAME}] No matching content script patterns for this URL. No scripts will be executed.`);
    }

    // E. Options Page Handling - Phase 2+ (May need adjustments if options rely on background state)

    // F. Setup Action/Menu Command - Phase 2+ (May need adjustments)

    console.log(`[${SCRIPT_NAME}] Initialization sequence complete.`); // Note: execution happens within executeAllScripts

} // End of main()

// --- Global Execution Start ---
// Call main() once. The earliest @run-at in metadata block ensures the script
// itself is loaded early enough. The internal logic in executeAllScripts handles
// the actual timing delays.
main().catch(e => console.error(`[${SCRIPT_NAME}] Error during script initialization:`, e));


})(); // End of IIFE