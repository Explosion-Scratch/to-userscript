// --- Abstraction Layer: PostMessage Target

let nextRequestId = 1;
const pendingRequests = new Map(); // requestId -> { resolve, reject, timeout }

function sendAbstractionRequest(method, args = []) {
  return new Promise((resolve, reject) => {
    const requestId = nextRequestId++;

    const timeout = setTimeout(() => {
      pendingRequests.delete(requestId);
      reject(new Error(`PostMessage request timeout for method: ${method}`));
    }, 10000);

    pendingRequests.set(requestId, { resolve, reject, timeout });

    window.parent.postMessage({
      type: "abstraction-request",
      requestId,
      method,
      args,
    });
  });
}

window.addEventListener("message", (event) => {
  const { type, requestId, success, result, error } = event.data;

  if (type === "abstraction-response") {
    const pending = pendingRequests.get(requestId);
    if (pending) {
      clearTimeout(pending.timeout);
      pendingRequests.delete(requestId);

      if (success) {
        pending.resolve(result);
      } else {
        const err = new Error(error.message);
        err.stack = error.stack;
        pending.reject(err);
      }
    }
  }
});

async function _storageSet(items) {
  return sendAbstractionRequest("_storageSet", [items]);
}

async function _storageGet(keys) {
  return sendAbstractionRequest("_storageGet", [keys]);
}

async function _storageRemove(keysToRemove) {
  return sendAbstractionRequest("_storageRemove", [keysToRemove]);
}

async function _storageClear() {
  return sendAbstractionRequest("_storageClear");
}

async function _cookieList(details) {
  return sendAbstractionRequest("_cookieList", [details]);
}

async function _cookieSet(details) {
  return sendAbstractionRequest("_cookieSet", [details]);
}

async function _cookieDelete(details) {
  return sendAbstractionRequest("_cookieDelete", [details]);
}

async function _fetch(url, options) {
  return sendAbstractionRequest("_fetch", [url, options]);
}

function _registerMenuCommand(name, func) {
  _warn("_registerMenuCommand called from iframe context:", name);
  return sendAbstractionRequest("_registerMenuCommand", [
    name,
    func.toString(),
  ]);
}

function _openTab(url, active) {
  return sendAbstractionRequest("_openTab", [url, active]);
}

async function _initStorage() {
  return sendAbstractionRequest("_initStorage");
}
