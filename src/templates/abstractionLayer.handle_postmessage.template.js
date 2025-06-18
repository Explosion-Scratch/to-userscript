// --- Abstraction layer: Handle postmesage for
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
