// --- Abstraction Layer: PostMessage Target

let nextRequestId = 1;
const pendingRequests = new Map(); // requestId -> { resolve, reject, timeout }

// Helper function to send postmessage requests to parent window
function sendAbstractionRequest(method, args = []) {
  return new Promise((resolve, reject) => {
    const requestId = nextRequestId++;

    // Set up timeout
    const timeout = setTimeout(() => {
      pendingRequests.delete(requestId);
      reject(new Error(`PostMessage request timeout for method: ${method}`));
    }, 10000); // 10 second timeout

    // Store pending request
    pendingRequests.set(requestId, { resolve, reject, timeout });

    // Send request to parent window
    window.parent.postMessage({
      type: "abstraction-request",
      requestId,
      method,
      args,
    });
  });
}

// Listen for responses from parent window
window.addEventListener("message", (event) => {
  // Only handle messages from same origin for security
  // if (event.origin !== window.location.origin) {
  //     return;
  // }

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

async function _fetch(url, options) {
  return sendAbstractionRequest("_fetch", [url, options]);
}

function _registerMenuCommand(name, func) {
  // Menu commands from iframes don't make much sense, but we'll pass it through
  console.warn("_registerMenuCommand called from iframe context:", name);
  return sendAbstractionRequest("_registerMenuCommand", [
    name,
    func.toString(),
  ]);
}

function _openTab(url) {
  return sendAbstractionRequest("_openTab", [url]);
}

async function _initStorage() {
  return sendAbstractionRequest("_initStorage");
}
