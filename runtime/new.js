// ===========================================================================
// ARG PARSER (exactly as provided)
// ===========================================================================
function _parseArguments(args) {
    let extensionId = null;
    let message = null;
    let options = null;
    let responseCallback = null;

    // Extract callback if present (last arg and is function)
    if (args.length && typeof args[args.length - 1] === "function") {
        responseCallback = args.pop();
    }

    if (args.length === 1) {
        // sendMessage(message [,callback])
        message = args[0];
    } else if (args.length === 2) {
        const [first, second] = args;
        const secondIsOptions =
            second &&
            typeof second === "object" &&
            (second.includeTlsChannelId === undefined ||
                typeof second.includeTlsChannelId === "boolean");
        if (secondIsOptions) {
            // sendMessage(message, options [,callback])
            message = first;
            options = second;
        } else {
            // sendMessage(extensionId, message [,callback])
            extensionId = first;
            message = second;
        }
    } else if (args.length === 3) {
        // sendMessage(extensionId, message, options [,callback])
        [extensionId, message, options] = args;
    } else {
        throw new Error("sendMessage called with invalid arguments");
    }

    // Validate serializability
    try {
        JSON.parse(JSON.stringify(message));
    } catch (e) {
        throw new Error("Message must be serializable (structured clone algorithm)");
    }

    return { extensionId, message, options, responseCallback };
}

function createEventBus(
    type = "page",
    { allowedOrigin = "*",
        children = [],         // only for page mode: Array<Window>
        parentWindow = null    // only for iframe mode: Window
    } = {}
) {
    const handlers = {};

    function handleIncoming(ev) {
        if (allowedOrigin !== "*" && ev.origin !== allowedOrigin) return;
        const msg = ev.data;
        if (!msg || msg.__eventBus !== true) return;

        const { event, payload, senderPort } = msg;
        (handlers[event] || []).forEach(fn => fn(payload, { origin: ev.origin }));
    }

    window.addEventListener("message", handleIncoming);

    function emitTo(targetWin, event, payload) {
        targetWin.postMessage(
            { __eventBus: true, event, payload },
            allowedOrigin
        );
    }

    return {
        on(event, fn) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(fn);
        },

        off(event, fn) {
            if (!handlers[event]) return;
            handlers[event] = handlers[event].filter(h => h !== fn);
        },

        emit(event, payload) {
            // 1) local invocation
            (handlers[event] || []).forEach(fn => fn(payload, { origin: location.origin }));

            // 2) remote invocation
            if (type === "page") {
                // broadcast to any known children
                children.forEach(win => emitTo(win, event, payload));
            }
            else if (type === "iframe") {
                // post back to your parentWindow (or default)
                const pw = parentWindow || window.parent;
                if (pw && pw.postMessage) emitTo(pw, event, payload);
            }
        }
    };
}
// ===========================================================================
// RUNTIME POLYFILL FACTORY (uses _parseArguments)
// ===========================================================================
function createRuntime(type = "background", bus) {
    let nextId = 1;
    const pending = {};
    const listeners = [];

    // BACKGROUND: handle incoming __REQUEST__
    if (type === "background") {
        bus.on("__REQUEST__", ({ id, message }, _) => {
            let responded = false;
            let isAsync = false;

            function sendResponse(resp) {
                if (responded) return;
                responded = true;
                bus.emit("__RESPONSE__", { id, response: resp });
            }

            const results = listeners.map(fn => {
                try {
                    const ret = fn(message, sendResponse);
                    if (ret === true) {
                        isAsync = true;
                        return;
                    }
                    if (ret && typeof ret.then === "function") {
                        isAsync = true;
                        return ret;
                    }
                    return ret;
                } catch (err) {
                    console.error("onMessage listener error:", err);
                }
            });

            const promises = results.filter(r => r && typeof r.then === "function");
            if (!isAsync && promises.length === 0) {
                const output = results.length === 1 ? results[0] : results;
                sendResponse(output);
            } else if (promises.length) {
                Promise.all(promises).then(vals => {
                    if (!responded) {
                        const output = vals.length === 1 ? vals[0] : vals;
                        sendResponse(output);
                    }
                });
            }
        });
    }

    // NON-BACKGROUND: handle incoming __RESPONSE__
    if (type !== "background") {
        bus.on("__RESPONSE__", ({ id, response }) => {
            const entry = pending[id];
            if (!entry) return;
            entry.resolve(response);
            if (entry.callback) entry.callback(response);
            delete pending[id];
        });
    }

    // sendMessage implementation
    function sendMessage(/* variable args */) {
        if (type === "background") {
            throw new Error("Background pages cannot sendMessage to themselves");
        }

        // convert arguments to array to allow pop()
        const args = Array.from(arguments);
        const { extensionId, message, options, responseCallback } =
            _parseArguments(args);

        const id = nextId++;
        const promise = new Promise(resolve => {
            pending[id] = { resolve, callback: responseCallback };
            // We ignore extensionId and options in this polyfill—always target background
            bus.emit("__REQUEST__", { id, message });
        });

        return promise;
    }

    return {
        sendMessage,
        onMessage: {
            addListener(fn) {
                listeners.push(fn);
            },
            removeListener(fn) {
                const i = listeners.indexOf(fn);
                if (i >= 0) listeners.splice(i, 1);
            }
        }
    };
}


// ===========================================================================
// 3) EXAMPLES
// ===========================================================================

// --- BACKGROUND CONTEXT (run once in your top page) ---
if (window === window.top) {
    // Suppose you have two iframes you want to speak with:
    const childIframes = [
        document.querySelector("#frame1").contentWindow,
        document.querySelector("#frame2").contentWindow
    ];

    const pageBus = createEventBus("page", { children: childIframes });
    const runtime = createRuntime("background", pageBus);

    runtime.onMessage.addListener((msg, sendResponse) => {
        console.log("BG SYNC got", msg);
        return { echo: msg };
    });

    runtime.onMessage.addListener((msg, sendResponse) => {
        if (msg.delay) {
            setTimeout(() => sendResponse({ delayed: true }), 200);
            return true; // telling system “I’ll respond async”
        }
    });

    runtime.onMessage.addListener(msg => {
        if (msg.prom) {
            return new Promise(res => setTimeout(() => res({ promDone: msg.prom }), 300));
        }
    });
}

// --- IFRAME CONTEXT ---
if (window !== window.top) {
    // by default parentWindow = window.parent
    const iframeBus = createEventBus("iframe");
    const runtime = createRuntime("tab", iframeBus);

    // 1) plain promise
    runtime.sendMessage({ hello: 1 })
        .then(res => console.log("resp1", res));

    // 2) callback overload
    runtime.sendMessage({ hello: 2 }, res => console.log("resp2 cb", res));

    // 3) options object ignored in our poly but accepted
    runtime.sendMessage({ hello: 3 }, res => console.log("resp3 cb"), { opt: 123 });

    // 4) trigger background delay
    runtime.sendMessage({ delay: true })
        .then(r => console.log("respDelay", r));

    // 5) trigger background promise
    runtime.sendMessage({ prom: "yes" })
        .then(r => console.log("respProm", r));
}
