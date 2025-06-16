// This script is template-generated and contains the main execution logic.
const SCRIPT_NAME = {{SCRIPT_NAME}};

const INJECTED_MANIFEST = {{INJECTED_MANIFEST}};
// Minimal configs just to check if *any* script should run on this page
const CONTENT_SCRIPT_CONFIGS_FOR_MATCHING = {{CONTENT_SCRIPT_CONFIGS_FOR_MATCHING_ONLY}};
// Options page path (relative inside EXTENSION_ASSETS_MAP) if available
const OPTIONS_PAGE_PATH = {{OPTIONS_PAGE_PATH}};
// Popup page path (relative inside EXTENSION_ASSETS_MAP) if available
const POPUP_PAGE_PATH = {{POPUP_PAGE_PATH}};
// Extension icon as data URL (size closest to 48px)
const EXTENSION_ICON = {{EXTENSION_ICON}};
// CSS data is needed by the combined execution logic
const extensionCssData = {{EXTENSION_CSS_DATA}};

const LOCALE_KEYS = {{LOCALE}}

// --- Utility Functions Injected During Build ---
// Function to convert match pattern string to a RegExp object
const convertMatchPatternToRegExp = {{CONVERT_MATCH_PATTERN_TO_REGEXP_FUNCTION}};
// Function to convert match pattern string to a double-escaped string for RegExp constructor
const convertMatchPatternToRegExpString = {{CONVERT_MATCH_PATTERN_FUNCTION_STRING}};

// Web accessible resources utility functions
function _matchGlobPattern(pattern, path) {
  if (!pattern || !path) return false;
  
  // Normalize paths to use forward slashes
  pattern = pattern.replace(/\\/g, '/');
  path = path.replace(/\\/g, '/');
  
  // Handle exact matches first
  if (pattern === path) return true;
  
  // Convert glob pattern to regex
  // Escape special regex chars except * and **
  let regexPattern = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')  // Escape regex chars
    .replace(/\*\*/g, '__DOUBLESTAR__')      // Temporarily replace **
    .replace(/\*/g, '[^/]*')                 // * matches any chars except /
    .replace(/__DOUBLESTAR__/g, '.*');       // ** matches any chars including /
  
  // Ensure pattern matches from start to end
  regexPattern = '^' + regexPattern + '$';
  
  try {
    const regex = new RegExp(regexPattern);
    return regex.test(path);
  } catch (e) {
    console.error(`Invalid glob pattern: ${pattern}`, e);
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

// Make utility functions available globally
window._matchGlobPattern = _matchGlobPattern;
window._isWebAccessibleResource = _isWebAccessibleResource;

// --- Combined Execution Logic ---
// This function contains all the CSS injection and JS execution,
// ordered by run_at timing internally using await.
{{COMBINED_EXECUTION_LOGIC}}

function closeOptionsModal() {
    const DURATION = 100;
    const backdrop = document.getElementById('extension-options-backdrop');
    const modal = document.getElementById('extension-options-modal');
    
    if (!backdrop || !modal) return;
    
    modal.style.animation = `modalCloseAnimation ${DURATION / 1000}s ease-out forwards`;
    backdrop.style.animation = `backdropFadeOut ${DURATION / 1000}s ease-out forwards`;
    
    setTimeout(() => {
        if (confirm('Close options and reload the page?')) {
            window.location.reload();
        } else {
            backdrop.remove();
        }
    }, DURATION);
}

function closePopupModal() {
    const DURATION = 100;
    const backdrop = document.getElementById('extension-popup-backdrop');
    const modal = document.getElementById('extension-popup-modal');
    
    if (!backdrop || !modal) return;
    
    modal.style.animation = `modalCloseAnimation ${DURATION / 1000}s ease-out forwards`;
    backdrop.style.animation = `backdropFadeOut ${DURATION / 1000}s ease-out forwards`;
    
    setTimeout(() => {
        backdrop.remove();
    }, DURATION);
}

// --- Popup Page Helper ---
function openPopupPage() {
    if (!POPUP_PAGE_PATH || typeof EXTENSION_ASSETS_MAP === 'undefined') {
        console.warn('No popup page available.');
        return;
    }
    const html = EXTENSION_ASSETS_MAP[POPUP_PAGE_PATH];
    if (!html) { console.warn('Popup HTML not found in asset map'); return; }

    let backdrop = document.getElementById('extension-popup-backdrop');
    let modal, iframe;
    
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'extension-popup-backdrop';
        
        modal = document.createElement('div');
        modal.id = 'extension-popup-modal';
        
        const extensionName = INJECTED_MANIFEST.name || 'Extension Popup';
        const iconSrc = EXTENSION_ICON || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik00IDdoM2ExIDEgMCAwIDAgMSAtMXYtMWEyIDIgMCAwIDEgNCAwdjFhMSAxIDAgMCAwIDEgMWgzYTEgMSAwIDAgMSAxIDF2M2ExIDEgMCAwIDAgMSAxaDFhMiAyIDAgMCAxIDAgNGgtMWExIDEgMCAwIDAgLTEgMXYzYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtMWEyIDIgMCAwIDAgLTQgMHYxYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMWgxYTIgMiAwIDAgMCAwIC00aC0xYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMSIgLz48L3N2Zz4=';
        
        backdrop.innerHTML = `
            <style>
                #extension-popup-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.13);
                    backdrop-filter: blur(3px);
                    z-index: 2147483646;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: backdropFadeIn 0.3s ease-out forwards;
                }
                
                #extension-popup-modal {
                    width: 400px;
                    height: 600px;
                    max-width: calc(100vw - 40px);
                    max-height: calc(100vh - 40px);
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
                
                #extension-popup-modal .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    padding: 0 16px;
                    position: relative;
                    flex-shrink: 0;
                }
                
                #extension-popup-modal .tab {
                    padding: 12px 16px;
                    color: #606266;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    border-radius: var(--rad) var(--rad) 0 0;
                    transition: background-color 0.2s ease;
                    user-select: none;
                }
                
                #extension-popup-modal .tab.active, #extension-popup-modal .tab.close-button {
                    background-color: var(--background);
                    border: var(--border-thickness) solid var(--border);
                    border-bottom-color: var(--background);
                    margin-bottom: -1px;
                    z-index: 1;
                    color: #303133;
                    font-weight: 500;
                }
                
                #extension-popup-modal .tab.close-button {
                    padding: 8px;
                }
                
                #extension-popup-modal .tab.close-button:hover {
                    background-color: #f5f7fa;
                }
                
                #extension-popup-modal .tab svg {
                    stroke: currentColor;
                }
                
                #extension-popup-modal .tab.active svg {
                    width: 16px;
                    height: 16px;
                }
                
                #extension-popup-modal .tab.close-button svg {
                    width: 20px;
                    height: 20px;
                }
                
                #extension-popup-modal .modal-content {
                    flex-grow: 1;
                    position: relative;
                    border-radius: var(--rad);
                    overflow: hidden;
                    bottom: calc(var(--border-thickness) - 1px);
                    border: var(--border-thickness) solid var(--border);
                }
                
                #extension-popup-modal .modal-content iframe {
                    width: 100%;
                    height: 100%;
                    border: 0;
                    background: white;
                }
            </style>
        `;
        
        modal.innerHTML = `
            <div class="modal-header">
                <div class="tab active">
                    <img src="${iconSrc}" style="width: 16px; height: 16px;" onerror="this.style.display='none'">
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
            if (e.target === backdrop) {
                closePopupModal();
            }
        });
        modal.querySelector('.tab.close-button').addEventListener('click', closePopupModal);
        document.body.appendChild(backdrop);
        iframe = modal.querySelector('iframe');
    } else {
        modal = backdrop.querySelector('#extension-popup-modal');
        iframe = modal.querySelector('iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            modal.querySelector('.modal-content').appendChild(iframe);
        }
        backdrop.style.display = 'flex';
    }
    
    try {
        const polyfillString = generateCompletePolyfillForIframe();

        const doc = new DOMParser().parseFromString(html, 'text/html');
        const script = doc.createElement('script');
        script.textContent = polyfillString;
        doc.head.insertAdjacentElement("afterbegin", script);
        iframe.srcdoc = doc.documentElement.outerHTML;
    } catch(e) {
        console.error('Error generating complete polyfill for iframe', e);
        iframe.srcdoc = html;
    }
}

// --- Options Page Helper ---
function openOptionsPage() {
    if (!OPTIONS_PAGE_PATH || typeof EXTENSION_ASSETS_MAP === 'undefined') {
        console.warn('No options page available.');
        return;
    }
    const html = EXTENSION_ASSETS_MAP[OPTIONS_PAGE_PATH];
    if (!html) { console.warn('Options HTML not found in asset map'); return; }

    let backdrop = document.getElementById('extension-options-backdrop');
    let modal, iframe;
    
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'extension-options-backdrop';
        
        modal = document.createElement('div');
        modal.id = 'extension-options-modal';
        
        const extensionName = INJECTED_MANIFEST.name || 'Extension Options';
        const iconSrc = EXTENSION_ICON || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik00IDdoM2ExIDEgMCAwIDAgMSAtMXYtMWEyIDIgMCAwIDEgNCAwdjFhMSAxIDAgMCAwIDEgMWgzYTEgMSAwIDAgMSAxIDF2M2ExIDEgMCAwIDAgMSAxaDFhMiAyIDAgMCAxIDAgNGgtMWExIDEgMCAwIDAgLTEgMXYzYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtMWEyIDIgMCAwIDAgLTQgMHYxYTEgMSAwIDAgMSAtMSAxaC0zYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMWgxYTIgMiAwIDAgMCAwIC00aC0xYTEgMSAwIDAgMSAtMSAtMXYtM2ExIDEgMCAwIDEgMSAtMSIgLz48L3N2Zz4=';
        
        backdrop.innerHTML = `
            <style>
                #extension-options-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.13);
                    backdrop-filter: blur(3px);
                    z-index: 2147483646;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: backdropFadeIn 0.3s ease-out forwards;
                }
                
                @keyframes backdropFadeIn {
                    from {
                        opacity: 0;
                        backdrop-filter: blur(0px);
                    }
                    to {
                        opacity: 1;
                        backdrop-filter: blur(3px);
                    }
                }
                
                @keyframes backdropFadeOut {
                    from {
                        opacity: 1;
                        backdrop-filter: blur(3px);
                    }
                    to {
                        opacity: 0;
                        backdrop-filter: blur(0px);
                    }
                }
                
                @keyframes modalOpenAnimation {
                    from {
                        transform: scaleY(0.8);
                        opacity: 0;
                    }
                    to {
                        transform: scaleY(1);
                        opacity: 1;
                    }
                }
                
                @keyframes modalCloseAnimation {
                    from {
                        transform: scaleY(1);
                        opacity: 1;
                    }
                    to {
                        transform: scaleY(0.8);
                        opacity: 0;
                    }
                }
                
                #extension-options-modal {
                    width: calc(100vw - 80px);
                    height: calc(100vh - 80px);
                    max-width: 1200px;
                    max-height: 800px;
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
                
                #extension-options-modal .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    padding: 0 16px;
                    position: relative;
                    flex-shrink: 0;
                }
                
                #extension-options-modal .tab {
                    padding: 12px 16px;
                    color: #606266;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    border-radius: var(--rad) var(--rad) 0 0;
                    transition: background-color 0.2s ease;
                    user-select: none;
                }
                
                #extension-options-modal .tab.active, #extension-options-modal .tab.close-button {
                    background-color: var(--background);
                    border: var(--border-thickness) solid var(--border);
                    border-bottom-color: var(--background);
                    margin-bottom: -1px;
                    z-index: 1;
                    color: #303133;
                    font-weight: 500;
                }
                
                #extension-options-modal .tab.close-button {
                    padding: 8px;
                }
                
                #extension-options-modal .tab.close-button:hover {
                    background-color: #f5f7fa;
                }
                
                #extension-options-modal .tab svg {
                    stroke: currentColor;
                }
                
                #extension-options-modal .tab.active svg {
                    width: 16px;
                    height: 16px;
                }
                
                #extension-options-modal .tab.close-button svg {
                    width: 20px;
                    height: 20px;
                }
                
                #extension-options-modal .modal-content {
                    flex-grow: 1;
                    position: relative;
                    border-radius: var(--rad);
                    overflow: hidden;
                    bottom: calc(var(--border-thickness) - 1px);
                    border: var(--border-thickness) solid var(--border);
                }
                
                #extension-options-modal .modal-content iframe {
                    width: 100%;
                    height: 100%;
                    border: 0;
                    background: white;
                }
            </style>
        `;
        
        modal.innerHTML = `
            <div class="modal-header">
                <div class="tab active">
                    <img src="${iconSrc}" style="width: 16px; height: 16px;" onerror="this.style.display='none'">
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
            if (e.target === backdrop) {
                closeOptionsModal();
            }
        });
        modal.querySelector('.tab.close-button').addEventListener('click', closeOptionsModal);
        document.body.appendChild(backdrop);
        iframe = modal.querySelector('iframe');
    } else {
        modal = backdrop.querySelector('#extension-options-modal');
        iframe = modal.querySelector('iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            modal.querySelector('.modal-content').appendChild(iframe);
        }
        backdrop.style.display = 'flex';
    }
    
    try {
        const polyfillString = generateCompletePolyfillForIframe();

        const doc = new DOMParser().parseFromString(html, 'text/html');
        const script = doc.createElement('script');
        script.textContent = polyfillString;
        doc.head.insertAdjacentElement("afterbegin", script);
        iframe.srcdoc = doc.documentElement.outerHTML;
    } catch(e) {
        console.error('Error generating complete polyfill for iframe', e);
        iframe.srcdoc = html;
    }
}

// Helper function to generate complete polyfill code for iframe injection
function generateCompletePolyfillForIframe() {
    // The unified polyfill string is injected here during build
    const polyfillString = {{UNIFIED_POLYFILL_FOR_IFRAME}}
    let newMap = JSON.parse(JSON.stringify(EXTENSION_ASSETS_MAP));
    delete newMap[OPTIONS_PAGE_PATH];
    return `
        ${polyfillString.replaceAll("{{EXTENSION_ASSETS_MAP}}", `atob("${btoa(EXTENSION_ASSETS_MAP)}")`)}

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

    // A2. Initialize background scripts first (they should always run)
    console.log(`[${SCRIPT_NAME}] Starting background scripts...`);
    // Note: Background scripts are auto-executed before this main() function runs
    // This is just a notification that they should have started

    // B. Determine if any content script matches the current URL
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
            // Content script context
            polyfillContext = buildPolyfill({ isBackground: false });
        } catch (e) {
            console.error(`[${SCRIPT_NAME}] Failed to build polyfill:`, e);
            return; // Cannot proceed without polyfill
        }

        console.log(`[${SCRIPT_NAME}] Polyfill built. Executing combined script logic...`);
        // Note: runtime.getURL is now integrated into the polyfill itself
        // D. Execute the combined logic
        // Pass the polyfill and CSS data to the function
        // async function executeAllScripts({chrome, browser, global, window, globalThis, self, __globals}, extensionCssData) {
        await executeAllScripts.call(polyfillContext.globalThis, polyfillContext, extensionCssData);

    } else {
        console.log(`[${SCRIPT_NAME}] No matching content script patterns for this URL. No scripts will be executed.`);
    }

    // E. Options Page Handling - Register menu command if available
    if (OPTIONS_PAGE_PATH) {
        // Register GM menu command if available
        if (typeof _registerMenuCommand === 'function') {
            try { 
                _registerMenuCommand('Open Options', openOptionsPage); 
                console.log(`[${SCRIPT_NAME}] Options menu command registered.`);
            } catch(e) { 
                console.error('Failed to register menu command', e); 
            }
        }
    }

    // F. Popup Page Handling - Register menu command if available
    if (POPUP_PAGE_PATH) {
        // Register GM menu command if available
        if (typeof _registerMenuCommand === 'function') {
            try { 
                _registerMenuCommand('Open Popup', openPopupPage); 
                console.log(`[${SCRIPT_NAME}] Popup menu command registered.`);
            } catch(e) { 
                console.error('Failed to register popup menu command', e); 
            }
        }
    }

    console.log(`[${SCRIPT_NAME}] Initialization sequence complete.`);

} // End of main()

// --- Global Execution Start ---
// Call main() once. The earliest @run-at in metadata block ensures the script
// itself is loaded early enough. The internal logic in executeAllScripts handles
// the actual timing delays.
main().catch(e => console.error(`[${SCRIPT_NAME}] Error during script initialization:`, e));

try {
    const fnKey = 'OPEN_OPTIONS_PAGE_' + String(SCRIPT_NAME).replace(/\s+/g, '_');
    window[fnKey] = openOptionsPage;
} catch(e) {}

try {
    const fnKey = 'OPEN_POPUP_PAGE_' + String(SCRIPT_NAME).replace(/\s+/g, '_');
    window[fnKey] = openPopupPage;
} catch(e) {}
