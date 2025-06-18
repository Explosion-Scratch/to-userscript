const templateManager = require("./templateManager");

/**
 * Retrieves the abstraction layer code string for the specified target.
 * @param {string} target - The build target ('userscript', 'vanilla', 'postmessage', or 'handle_postmessage').
 * @returns {Promise<string>} The code string for the abstraction layer.
 */
async function getAbstractionLayerCode(target = "userscript") {
  let template = await templateManager.getAbstractionLayerTemplate(target);

  // For targets other than postmessage and handle_postmessage, also include the handle_postmessage template
  // This allows the main context to handle postmessage requests from iframes
  if (target !== "postmessage" && target !== "handle_postmessage") {
    const handlePostMessageTemplate =
      await templateManager.getAbstractionLayerTemplate("handle_postmessage");
    template = handlePostMessageTemplate + "\n\n" + template;
  }

  return template;
}

// This list MUST match the GM_* functions actually used in the userscript template
function getRequiredGmGrants(target = "userscript") {
  if (target === "userscript") {
    return [
      "GM_setValue",
      "GM_getValue",
      "GM_listValues", // Used by _storageGet(null), _storageClear
      "GM_deleteValue", // Used by _storageRemove, _storageClear
      "GM_xmlhttpRequest", // Used by _fetch
      "GM_registerMenuCommand", // Used by _registerMenuCommand
      "GM_openInTab", // Used by _openTab
    ].filter(Boolean);
  }

  if (target === "postmessage" || target === "handle_postmessage") {
    return [];
  }

  return [];
}

module.exports = { getAbstractionLayerCode, getRequiredGmGrants };
