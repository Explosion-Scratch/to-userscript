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
              `GM_xmlhttpRequest network error: ${response.statusText || "Unknown Error"}`,
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
  // No initialization required for GM_* storage.
  return Promise.resolve();
}
