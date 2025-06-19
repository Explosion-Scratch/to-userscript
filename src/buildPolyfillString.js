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
  const abstractionLayerCode =
    await abstractionLayer.getAbstractionLayerCode(target);

  const assetsHelperFunctions = generateAssetsHelperFunctions(
    assetsMap,
    target === "postmessage",
  );

  const messagingTemplate = await templateManager.getMessagingTemplate();

  const polyfillTemplate = await templateManager.getPolyfillTemplate();

  const combinedPolyfillString = `
${messagingTemplate}

${abstractionLayerCode}

${assetsHelperFunctions}

${polyfillTemplate
  .replaceAll("{{IS_IFRAME}}", target === "postmessage" ? "true" : "false")
  .replaceAll("{{SCRIPT_ID}}", manifest._id)}

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
  const assetMapJson = inlineAssets
    ? `{{EXTENSION_ASSETS_MAP}}`
    : JSON.stringify(assetsMap, null, 2);

  return `const EXTENSION_ASSETS_MAP = ${assetMapJson};`;
}

module.exports = { generateBuildPolyfillString };
