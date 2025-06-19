// -- Polyfill Implementation
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

  const IS_IFRAME = "{{IS_IFRAME}}" === "true";
  const BUS = (function () {
    if (globalThis.__BUS) {
      return globalThis.__BUS;
    }
    globalThis.__BUS = createEventBus(
      "{{SCRIPT_ID}}",
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

  // --- Chrome polyfill
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
