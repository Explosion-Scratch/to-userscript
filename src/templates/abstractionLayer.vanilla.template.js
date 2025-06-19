// --- Abstraction Layer: Vanilla Target

let vanillaStorageDB = null;
const STORAGE_DB_NAME = "VanillaExtensionStorage";
const STORAGE_DB_VERSION = 1;
const STORAGE_STORE_NAME = "storage";

/**
 * Initializes the IndexedDB database for storage
 * @returns {Promise<IDBDatabase>} The opened database
 */
async function _initStorage() {
  if (vanillaStorageDB) {
    return vanillaStorageDB;
  }

  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(STORAGE_DB_NAME, STORAGE_DB_VERSION);

      request.onerror = () => {
        const error = new Error(
          `Failed to open IndexedDB: ${
            request.error?.message || "Unknown error"
          }`
        );
        console.error("IndexedDB initialization error:", error);
        reject(error);
      };

      request.onsuccess = () => {
        vanillaStorageDB = request.result;
        console.log("IndexedDB storage initialized successfully");
        resolve(vanillaStorageDB);

        vanillaStorageDB.onclose = () => {
          console.warn("IndexedDB connection closed unexpectedly");
          vanillaStorageDB = null;
        };

        vanillaStorageDB.onerror = (event) => {
          console.error("IndexedDB error:", event.target.error);
        };
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        try {
          if (!db.objectStoreNames.contains(STORAGE_STORE_NAME)) {
            const store = db.createObjectStore(STORAGE_STORE_NAME, {
              keyPath: "key",
            });
            console.log("Created IndexedDB object store:", STORAGE_STORE_NAME);
          }
        } catch (storeError) {
          console.error("Error creating object store:", storeError);
          reject(
            new Error(`Failed to create object store: ${storeError.message}`)
          );
        }
      };

      request.onblocked = () => {
        console.warn("IndexedDB upgrade blocked by another connection");
        reject(
          new Error("IndexedDB upgrade blocked. Please close other tabs.")
        );
      };
    } catch (error) {
      const errorMsg = `IndexedDB not supported or initialization failed: ${error.message}`;
      console.error(errorMsg);
      reject(new Error(errorMsg));
    }
  });
}

/**
 * Ensures database is initialized and returns a transaction
 * @param {string} mode - Transaction mode ('readonly' or 'readwrite')
 * @returns {Promise<IDBObjectStore>} The object store
 */
async function getStorageStore(mode = "readonly") {
  try {
    const db = await _initStorage();
    if (!db) {
      throw new Error("Database is not available");
    }

    const transaction = db.transaction([STORAGE_STORE_NAME], mode);
    const store = transaction.objectStore(STORAGE_STORE_NAME);

    transaction.onerror = () => {
      console.error("Transaction error:", transaction.error);
    };

    return store;
  } catch (error) {
    throw new Error(`Failed to get storage store: ${error.message}`);
  }
}

/**
 * Validates storage key
 * @param {string} key - The storage key to validate
 * @throws {Error} If key is invalid
 */
function validateStorageKey(key) {
  if (typeof key !== "string") {
    throw new Error(`Storage key must be a string, got ${typeof key}`);
  }
  if (key.length === 0) {
    throw new Error("Storage key cannot be empty");
  }
  if (key.length > 8192) {
    throw new Error(`Storage key too long (${key.length} > 8192 characters)`);
  }
}

/**
 * Validates storage value
 * @param {any} value - The storage value to validate
 * @throws {Error} If value is invalid
 */
function validateStorageValue(value) {
  if (value === undefined) {
    throw new Error("Storage value cannot be undefined (use null instead)");
  }

  try {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) {
      throw new Error("Storage value is not serializable");
    }

    const sizeInBytes = new Blob([serialized]).size;
    if (sizeInBytes > maxSize) {
      throw new Error(
        `Storage value too large (${Math.round(
          sizeInBytes / 1024 / 1024
        )}MB > 10MB)`
      );
    }
  } catch (error) {
    if (error.message.includes("circular")) {
      throw new Error("Storage value contains circular references");
    }
    throw new Error(`Storage value validation failed: ${error.message}`);
  }
}

async function _storageSet(items) {
  try {
    if (!items || typeof items !== "object" || Array.isArray(items)) {
      throw new Error("Storage set items must be a plain object");
    }

    const keys = Object.keys(items);
    if (keys.length === 0) {
      console.warn("No items to set in storage");
      return;
    }

    for (const [key, value] of Object.entries(items)) {
      validateStorageKey(key);
      validateStorageValue(value);
    }

    const store = await getStorageStore("readwrite");
    const promises = [];

    for (const [key, value] of Object.entries(items)) {
      const promise = new Promise((resolve, reject) => {
        const request = store.put({ key, value, timestamp: Date.now() });
        request.onsuccess = () => resolve();
        request.onerror = () =>
          reject(
            new Error(
              `Failed to store key '${key}': ${
                request.error?.message || "Unknown error"
              }`
            )
          );
      });
      promises.push(promise);
    }

    await Promise.all(promises);
    console.log(
      `Successfully stored ${keys.length} item(s) to IndexedDB:`,
      keys
    );
  } catch (error) {
    const errorMsg = `Storage set operation failed: ${error.message}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

async function _storageGet(keys) {
  try {
    const store = await getStorageStore("readonly");
    let keyList = [];
    let defaults = {};
    let requestedKeys = [];

    if (keys === null || keys === undefined) {
      const getAllRequest = store.getAll();
      return new Promise((resolve, reject) => {
        getAllRequest.onsuccess = () => {
          const result = {};
          getAllRequest.result.forEach((item) => {
            result[item.key] = item.value;
          });
          resolve(result);
        };
        getAllRequest.onerror = () => {
          reject(
            new Error(
              `Failed to get all storage items: ${
                getAllRequest.error?.message || "Unknown error"
              }`
            )
          );
        };
      });
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
      throw new Error(`Invalid keys format for storage get: ${typeof keys}`);
    }

    keyList.forEach((key) => {
      if (typeof key !== "string") {
        throw new Error(
          `Storage key must be a string, got ${typeof key} at key: ${key}`
        );
      }
    });

    const results = {};
    const promises = keyList.map((key) => {
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = () => {
          if (request.result) {
            results[key] = request.result.value;
          } else if (defaults.hasOwnProperty(key)) {
            results[key] = defaults[key];
          }
          resolve();
        };
        request.onerror = () => {
          reject(
            new Error(
              `Failed to get storage key '${key}': ${
                request.error?.message || "Unknown error"
              }`
            )
          );
        };
      });
    });

    await Promise.all(promises);

    const finalResult = {};
    for (const key of requestedKeys) {
      if (results.hasOwnProperty(key)) {
        finalResult[key] = results[key];
      } else if (defaults.hasOwnProperty(key)) {
        finalResult[key] = defaults[key];
      }
    }

    console.log(
      `Retrieved ${
        Object.keys(finalResult).length
      } item(s) from IndexedDB storage`
    );
    return finalResult;
  } catch (error) {
    const errorMsg = `Storage get operation failed: ${error.message}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
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
      throw new Error(
        `Invalid keys format for storage remove: ${typeof keysToRemove}`
      );
    }

    if (keyList.length === 0) {
      console.warn("No keys to remove from storage");
      return;
    }

    keyList.forEach((key) => validateStorageKey(key));

    const store = await getStorageStore("readwrite");
    const promises = keyList.map((key) => {
      return new Promise((resolve, reject) => {
        const request = store.delete(key);
        request.onsuccess = () => resolve();
        request.onerror = () => {
          reject(
            new Error(
              `Failed to remove storage key '${key}': ${
                request.error?.message || "Unknown error"
              }`
            )
          );
        };
      });
    });

    await Promise.all(promises);
    console.log(
      `Removed ${keyList.length} item(s) from IndexedDB storage:`,
      keyList
    );
  } catch (error) {
    const errorMsg = `Storage remove operation failed: ${error.message}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

async function _storageClear() {
  try {
    const store = await getStorageStore("readwrite");

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => {
        console.log("Cleared all items from IndexedDB storage");
        resolve();
      };
      request.onerror = () => {
        reject(
          new Error(
            `Failed to clear storage: ${
              request.error?.message || "Unknown error"
            }`
          )
        );
      };
    });
  } catch (error) {
    const errorMsg = `Storage clear operation failed: ${error.message}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

async function _fetch(url, options = {}) {
  try {
    if (!url || typeof url !== "string") {
      throw new Error(`Invalid URL for fetch: ${url}`);
    }

    if (options && typeof options !== "object") {
      throw new Error(`Fetch options must be an object, got ${typeof options}`);
    }

    const response = await fetch(url, options);

    const enhancedResponse = {
      ...response,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      headers: response.headers,
      text: () => response.text(),
      json: () => response.json(),
      blob: () => response.blob(),
      arrayBuffer: () => response.arrayBuffer(),
      clone: () => response.clone(),
    };

    return enhancedResponse;
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        `Network error or invalid URL: ${url} - ${error.message}`
      );
    } else if (error.name === "AbortError") {
      throw new Error(`Fetch request aborted: ${url}`);
    } else {
      throw new Error(`Fetch failed for ${url}: ${error.message}`);
    }
  }
}

function _registerMenuCommand(name, func) {
  if (!name || typeof name !== "string") {
    console.warn("Invalid menu command name:", name);
    return;
  }

  if (!func || typeof func !== "function") {
    console.warn("Invalid menu command function for:", name);
    return;
  }

  console.log(`Menu command registered (vanilla mode): ${name}`);

  if (!window._vanillaMenuCommands) {
    window._vanillaMenuCommands = new Map();
  }
  window._vanillaMenuCommands.set(name, func);

  // Note: In vanilla JS, there's no standard browser equivalent to GM_registerMenuCommand
  // Extensions could implement their own UI for this, but for now we just store it
  console.warn(
    `Vanilla menu command registration: "${name}" - No standard browser equivalent available`
  );
}

function _openTab(url) {
  try {
    if (!url || typeof url !== "string") {
      throw new Error(`Invalid URL for tab opening: ${url}`);
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      throw new Error(`Invalid URL format: ${url}`);
    }

    // Use window.open with security best practices
    const newTab = window.open(url, "_blank", "noopener,noreferrer");

    if (!newTab) {
      console.warn(`Tab opening was blocked by popup blocker for: ${url}`);

      // Fallback: try to create a clickable link for user action
      const fallbackNotification = () => {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = `Open ${url}`;
        link.style.cssText = `
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 999999;
          background: #007cba;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          text-decoration: none;
          font-family: sans-serif;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;

        document.body.appendChild(link);

        // Auto-remove after 10 seconds
        setTimeout(() => {
          if (link.parentNode) {
            link.parentNode.removeChild(link);
          }
        }, 10000);

        console.log("Created fallback link for blocked popup:", url);
      };

      // Only create fallback if we're in a document context
      if (typeof document !== "undefined" && document.body) {
        fallbackNotification();
      }
    } else {
      console.log(`Successfully opened tab: ${url}`);
    }
  } catch (error) {
    const errorMsg = `Tab opening failed: ${error.message}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}
