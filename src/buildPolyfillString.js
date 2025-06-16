const templateManager = require("./templateManager");
const abstractionLayer = require("./abstractionLayer");

/**
 * Generates a complete polyfill string that includes:
 * - Message bus implementation
 * - Abstraction layer functions
 * - Assets logic and runtime.getURL override
 * - buildPolyfill function with integrated runtime.getURL
 *
 * @param {string} target - The build target ('userscript', 'vanilla', 'postmessage', or 'handle_postmessage')
 * @param {Object} assetsMap - Map of asset paths to content (base64 for binary, text for text assets)
 * @param {Object} manifest - Parsed manifest object
 * @returns {Promise<string>} Complete polyfill code string
 */
async function generateBuildPolyfillString(
  target = "userscript",
  assetsMap = {},
  manifest = {},
) {
  // // 1. Get the message bus code from polyfill.js with appropriate target
  // let messageBusCode = "";
  // if (target === "postmessage") {
  //   messageBusCode = await polyfill.getMessageBusCode("postmessage");
  // } else {
  //   // For userscript, vanilla, and handle_postmessage targets, use default message bus
  //   const defaultMessageBus = await polyfill.getMessageBusCode();
  //   if (target === "handle_postmessage") {
  //     // Also include the handle_postmessage extension
  //     const handlePostMessageBus =
  //       await polyfill.getMessageBusCode("handle_postmessage");
  //     messageBusCode = defaultMessageBus + "\n\n" + handlePostMessageBus;
  //   } else {
  //     messageBusCode = defaultMessageBus;
  //   }
  // }

  // 2. Get abstraction layer code
  const abstractionLayerCode =
    await abstractionLayer.getAbstractionLayerCode(target);

  // 3. Generate assets logic helper functions using the unified approach
  const assetsHelperFunctions = generateAssetsHelperFunctions(
    assetsMap,
    target === "postmessage",
  );

  const messagingTemplate = await templateManager.getMessagingTemplate();

  const polyfillTemplate = await templateManager.getPolyfillTemplate();

  // 4. Combine everything into a single string
  const combinedPolyfillString = `
// --- Unified Polyfill String ---
// This contains all necessary code to create a complete polyfill environment

${messagingTemplate}

${abstractionLayerCode}

${assetsHelperFunctions}

${polyfillTemplate.replaceAll("{{IS_IFRAME}}", target === "postmessage" ? "true" : "false")}

// Export the buildPolyfill function for use
if (typeof window !== 'undefined') {
    window.buildPolyfill = buildPolyfill;
}
`;

  return combinedPolyfillString;
}

/**
 * Generates the asset helper functions and EXTENSION_ASSETS_MAP
 * @param {Object} assetsMap - Map of asset paths to content
 * @param {boolean} inlineAssets - Whether to use placeholder for postmessage target
 * @returns {string} Asset helper functions code
 */
function generateAssetsHelperFunctions(assetsMap = {}, inlineAssets = false) {
  if (Object.keys(assetsMap).length === 0) {
    return `// No assets available
const EXTENSION_ASSETS_MAP = {};
function _base64ToBlob() { return null; }
function _getMimeTypeFromPath() { return 'application/octet-stream'; }
function _isTextAsset() { return false; }
function _createAssetUrl() { return ''; }`;
  }

  // For postmessage target, use a placeholder that will be replaced during template processing
  const assetMapJson = inlineAssets
    ? `{{EXTENSION_ASSETS_MAP}}`
    : JSON.stringify(assetsMap, null, 2);

  return `// --- Extension Assets Map & Helper Functions ---
const EXTENSION_ASSETS_MAP = ${assetMapJson};

function _testBlobCSP() {
  try {
    // Create a random blob with some simple JavaScript content
    const code = \`console.log("Blob CSP test");\`;
    const blob = new Blob([code], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);

    // Create a script tag to load the blob URL
    const script = document.createElement('script');
    script.src = blobUrl;

    // Add an error handler in case the CSP blocks it
    let blocked = false;
    script.onerror = () => {
      blocked = true;
    };

    // Append the script to the document
    document.head.appendChild(script);

    // Since CSP blocks are asynchronous, we need to return a promise
    return new Promise((resolve) => {
      // Wait briefly to see if the error handler fires
      setTimeout(() => {
        resolve(!blocked);
        // Clean up
        document.head.removeChild(script);
        URL.revokeObjectURL(blobUrl);
      }, 100);
    });
  } catch (e) {
    // If creating or assigning the blob fails synchronously
    return Promise.resolve(false);
  }
}

let CAN_USE_BLOB_CSP = false;

_testBlobCSP().then((result) => {
  CAN_USE_BLOB_CSP = result;
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
    console.warn('[runtime.getURL] Asset not found for', path);
    return path;
  }
  
  const mime = _getMimeTypeFromPath(path);
  const ext = (path.split('.').pop() || '').toLowerCase();
  
  if (CAN_USE_BLOB_CSP) {
    // For web accessible resources, handle different content types appropriately
    let blob;
    if (_isTextAsset(ext)) {
      // For text assets (including processed CSS with inlined assets), 
      // the content is already processed and should be used as-is
      blob = new Blob([assetData], { type: mime });
    } else {
      // For binary assets, the content is base64 encoded
      blob = _base64ToBlob(assetData, mime);
    }
    
    return URL.createObjectURL(blob);
  } else {
    if (_isTextAsset(ext)) {
      return \`data:\${mime};base64,\${btoa(assetData)}\`;
    } else {
      return \`data:\${mime};base64,\${assetData}\`;
    }
  }
}`;
}

module.exports = { generateBuildPolyfillString };
