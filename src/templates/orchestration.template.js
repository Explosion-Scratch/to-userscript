// Other globals currently defined at this spot: SCRIPT_NAME, _log, _warn, _error
const INJECTED_MANIFEST = {{INJECTED_MANIFEST}};
const CONTENT_SCRIPT_CONFIGS_FOR_MATCHING = {{CONTENT_SCRIPT_CONFIGS_FOR_MATCHING_ONLY}};
const OPTIONS_PAGE_PATH = {{OPTIONS_PAGE_PATH}};
const POPUP_PAGE_PATH = {{POPUP_PAGE_PATH}};
const EXTENSION_ICON = {{EXTENSION_ICON}};
const extensionCssData = {{EXTENSION_CSS_DATA}};

const LOCALE_KEYS = {{LOCALE}};
const USED_LOCALE = {{USED_LOCALE}};
const CURRENT_LOCATION = window.location.href;

const convertMatchPatternToRegExp = {{CONVERT_MATCH_PATTERN_TO_REGEXP_FUNCTION}};
const convertMatchPatternToRegExpString = {{CONVERT_MATCH_PATTERN_FUNCTION_STRING}};
const ALL_PERMISSIONS = [
    ...(INJECTED_MANIFEST.permissions || []),
    ...(INJECTED_MANIFEST.optional_permissions || []),
    ...(INJECTED_MANIFEST.host_permissions || []),
    ...(INJECTED_MANIFEST.content_scripts?.map(cs => cs.matches || [])?.flat() || []),
  ];

const isOrigin = (perm) => {
    if (perm.startsWith("*://") || perm.startsWith("http://") || perm.startsWith("https://")) {
        return true;
    }
    return false;
};
const ORIGIN_PERMISSIONS = ALL_PERMISSIONS.filter(isOrigin);
const EXTENSION_PERMISSIONS = ALL_PERMISSIONS.filter(perm => !isOrigin(perm));

function _testBlobCSP() {
  try {
    const code = `console.log("Blob CSP test");`;
    const blob = new Blob([code], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);

    const script = document.createElement('script');
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
    if (document.readyState === 'loading') {
      return new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
    }
    return Promise.resolve();
};

waitForDOMEnd().then(() => {
  _testBlobCSP().then((result) => {
    CAN_USE_BLOB_CSP = result;
  });
});

function _base64ToBlob(base64, mimeType = 'application/octet-stream') {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mimeType });
}

function _getMimeTypeFromPath(p) {
  const ext = (p.split('.').pop() || '').toLowerCase();
  const map = {
    html: 'text/html',
    htm: 'text/html',
    js: 'text/javascript',
    css: 'text/css',
    json: 'application/json',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    ico: 'image/x-icon',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    otf: 'font/otf',
    eot: 'application/vnd.ms-fontobject'
  };
  return map[ext] || 'application/octet-stream';
}

function _isTextAsset(ext) {
  return ['html','htm','js','css','json','svg','txt','xml'].includes(ext);
}

function _createAssetUrl(path = '') {
  if (path.startsWith('/')) path = path.slice(1);
  const assetData = EXTENSION_ASSETS_MAP[path];
  if (typeof assetData === 'undefined') {
    _warn('[runtime.getURL] Asset not found for', path);
    return path;
  }

  const mime = _getMimeTypeFromPath(path);
  const ext = (path.split('.').pop() || '').toLowerCase();

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

  pattern = pattern.replace(/\\/g, '/');
  path = path.replace(/\\/g, '/');

  if (pattern === path) return true;

  let regexPattern = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')  // Escape regex chars
    .replace(/\*\*/g, '__DOUBLESTAR__')      // Temporarily replace **
    .replace(/\*/g, '[^/]*')                 // * matches any chars except /
    .replace(/__DOUBLESTAR__/g, '.*');       // ** matches any chars including /

  regexPattern = '^' + regexPattern + '$';

  try {
    const regex = new RegExp(regexPattern);
    return regex.test(path);
  } catch (e) {
    _error(`Invalid glob pattern: ${pattern}`, e);
    return false;
  }
}

function _isWebAccessibleResource(resourcePath, webAccessibleResources) {
  if (!Array.isArray(webAccessibleResources) || webAccessibleResources.length === 0) {
    return false;
  }

  // Normalize the resource path
  const normalizedPath = resourcePath.replace(/\\/g, '/').replace(/^\/+/, '');

  for (const webAccessibleResource of webAccessibleResources) {
    let patterns = [];

    // Handle both manifest v2 and v3 formats
    if (typeof webAccessibleResource === 'string') {
      // Manifest v2 format: array of strings
      patterns = [webAccessibleResource];
    } else if (webAccessibleResource && Array.isArray(webAccessibleResource.resources)) {
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
{{COMBINED_EXECUTION_LOGIC}}


// --- Event Listener (No changes needed here) ---
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


// --- Refactored Modal Closing Functions (Promise-based) ---

function closeOptionsModal() {
    return new Promise(resolve => {
        const DURATION = 100;
        const backdrop = document.getElementById('extension-options-backdrop');
        const modal = document.getElementById('extension-options-modal');

        if (!backdrop || !modal) {
            return resolve();
        }

        modal.style.animation = `modalCloseAnimation ${DURATION / 1000}s ease-out forwards`;
        backdrop.style.animation = `backdropFadeOut ${DURATION / 1000}s ease-out forwards`;

        setTimeout(() => {
            if (confirm('Close options and reload the page?')) {
                window.location.reload(); // Note: This will stop further execution
            } else {
                backdrop.remove();
            }
            resolve();
        }, DURATION);
    });
}

function closePopupModal() {
    return new Promise(resolve => {
        const DURATION = 100;
        const backdrop = document.getElementById('extension-popup-backdrop');
        const modal = document.getElementById('extension-popup-modal');

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


// --- Simplified Public API Functions ---

async function openPopupPage() {
    if (!POPUP_PAGE_PATH || typeof EXTENSION_ASSETS_MAP === 'undefined') {
        _warn('No popup page available.');
        return;
    }
    await openModal({
        type: 'popup',
        pagePath: POPUP_PAGE_PATH,
        defaultTitle: 'Extension Popup',
        closeFn: closePopupModal
    });
}

async function openOptionsPage() {
    if (!OPTIONS_PAGE_PATH || typeof EXTENSION_ASSETS_MAP === 'undefined') {
        _warn('No options page available.');
        return;
    }
    await openModal({
        type: 'options',
        pagePath: OPTIONS_PAGE_PATH,
        defaultTitle: 'Extension Options',
        closeFn: closeOptionsModal
    });
}


// --- Generic Modal Logic & Style Injection ---

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

    // --- Smoothly close the other modal if it's open ---
    const otherType = type === 'popup' ? 'options' : 'popup';
    const otherBackdrop = document.getElementById(`extension-${otherType}-backdrop`);
    if (otherBackdrop) {
        // Await the correct close function
        await (otherType === 'popup' ? closePopupModal() : closeOptionsModal());
    }

    let backdrop = document.getElementById(backdropId);
    let modal, iframe;

    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = backdropId;
        backdrop.className = 'extension-backdrop';

        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = `extension-modal ${sizeClass}`;

        const extensionName = INJECTED_MANIFEST.name || defaultTitle;
        const iconSrc = EXTENSION_ICON || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik00IDdoM2ExIDEgMCAwIDAgMSAtMXYtMWEyIDIgMCAwIDEgNCAwdjFhMSAxIDAgMCAwIDEgMWgzYTEgMSAwIDAgMSAxIDF2M2ExIDEgMCAwIDAgMSAxaDFhMiAyIDAgMCAxIDAgNGgtMWExIDEgMCAwIDAgLTEgMXYzYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtMWEyIDIgMCAwIDAgLTQgMHYxYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMWgxYTIgMiAwIDAgMCAwIC00aC0xYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMSIgLz48L3N2Zz4=';

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

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeFn();
        });
        modal.querySelector('.close-button').addEventListener('click', closeFn);
        
        document.body.appendChild(backdrop);
        iframe = modal.querySelector('iframe');

    } else {
        // If it already exists, just make sure it's visible
        backdrop.style.display = 'flex';
        modal = backdrop.querySelector('.extension-modal');
        iframe = modal.querySelector('iframe');
    }

    // Load content into iframe
    try {
        const polyfillString = generateCompletePolyfillForIframe();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const script = doc.createElement('script');
        script.textContent = polyfillString;
        doc.head.insertAdjacentElement("afterbegin", script);
        iframe.srcdoc = doc.documentElement.outerHTML;
    } catch (e) {
        _error('Error generating complete polyfill for iframe', e);
        iframe.srcdoc = html;
    }
}

function generateCompletePolyfillForIframe() {
    const polyfillString = {{UNIFIED_POLYFILL_FOR_IFRAME}}
    let newMap = JSON.parse(JSON.stringify(EXTENSION_ASSETS_MAP));
    delete newMap[OPTIONS_PAGE_PATH];
    const PASS_ON = Object.fromEntries(Object.entries({
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
        _base64ToBlob,
        _getMimeTypeFromPath,
        _isTextAsset,
        _createAssetUrl,
        _matchGlobPattern,
        _isWebAccessibleResource,
        _log,
        _warn,
        _error,
    }).map(i => {
      let out = [...i];
      if (typeof i[1] === 'function'){
        out[1] = i[1].toString();
      } else {
        out[1] = JSON.stringify(i[1])
      }
      return out;
    }))
    _log(PASS_ON);
    return `
    ${Object.entries(PASS_ON).map(i => `const ${i[0]} = ${i[1]};\nwindow[${JSON.stringify(i[0])}] = ${i[0]}`).join('\n')}

        _log("Initialized polyfill", {${Object.keys(PASS_ON).join(', ')}})
        ${polyfillString.replaceAll("{{EXTENSION_ASSETS_MAP}}", `JSON.parse(atob("${btoa(JSON.stringify(EXTENSION_ASSETS_MAP))}"))`)}

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

    if (typeof _initStorage === 'function') {
        try {
            _initStorage().then(() => {
                _log(`Storage initialized.`);
            }).catch(e => {
                _error('Error during storage initialization:', e);
            });
        } catch (e) {
            _error('Error during storage initialization:', e);
        }
    }

    _log(`Starting content scripts...`);

    const currentUrl = window.location.href;
    let shouldRunAnyScript = false;
    _log(`Checking URL: ${currentUrl}`);

    if (CONTENT_SCRIPT_CONFIGS_FOR_MATCHING && CONTENT_SCRIPT_CONFIGS_FOR_MATCHING.length > 0) {
        for (const config of CONTENT_SCRIPT_CONFIGS_FOR_MATCHING) {
            if (config.matches && config.matches.some(pattern => {
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
            })) {
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
        await executeAllScripts.call(polyfillContext.globalThis, polyfillContext, extensionCssData);

    } else {
        _log(`No matching content script patterns for this URL. No scripts will be executed.`);
    }

    if (OPTIONS_PAGE_PATH) {
        if (typeof _registerMenuCommand === 'function') {
            try {
                _registerMenuCommand('Open Options', openOptionsPage);
                _log(`Options menu command registered.`);
            } catch(e) {
                _error('Failed to register menu command', e);
            }
        }
    }

    if (POPUP_PAGE_PATH) {
        if (typeof _registerMenuCommand === 'function') {
            try {
                _registerMenuCommand('Open Popup', openPopupPage);
                _log(`Popup menu command registered.`);
            } catch(e) {
                _error('Failed to register popup menu command', e);
            }
        }
    }

    _log(`Initialization sequence complete.`);

}

main().catch(e => _error(`Error during script initialization:`, e));

try {
    const fnKey = 'OPEN_OPTIONS_PAGE_' + String(SCRIPT_NAME).replace(/\s+/g, '_');
    window[fnKey] = openOptionsPage;
} catch(e) {}

try {
    const fnKey = 'OPEN_POPUP_PAGE_' + String(SCRIPT_NAME).replace(/\s+/g, '_');
    window[fnKey] = openPopupPage;
} catch(e) {}
