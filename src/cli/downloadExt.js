/**
 * Get the .crx download URL from a Chrome Web Store URL or extension ID.
 * This is a simplified version based on crxviewer/src/cws_pattern.js.
 * @param {string} webstoreUrlOrId - Chrome Web Store URL or extension ID
 * @returns {string} .crx direct download URL
 */
function getCrxUrl(webstoreUrlOrId) {
  function extractExtensionId(input) {
    // Try new Chrome Web Store format: /detail/extension-name/extension-id
    var m = input.match(/\/detail\/[^/]+\/([a-z]{32})/i);
    if (m) return m[1];

    // Try old format: /detail/extension-id
    m = input.match(/\/detail\/([a-z]{32})/i);
    if (m) return m[1];

    // Direct extension ID
    if (/^[a-z]{32}$/.test(input)) return input;

    throw new Error("Invalid Chrome Web Store URL or extension ID");
  }

  // Fill with highest version to avoid 204 responses from CWS
  var product_version = "9999.0.9999.0"; // see repo comments for why

  // These can be further detected, but here are set to common values for broad compatibility
  var os = "win"; // or 'mac', 'linux', etc.
  var arch = "x64";
  var nacl_arch = "x86-64";
  var prod = "chromecrx"; // 'chromiumcrx' for Chromium
  var prodchannel = "unknown";

  var extensionId = extractExtensionId(webstoreUrlOrId);

  var url = "https://clients2.google.com/service/update2/crx?response=redirect";
  url += "&os=" + os;
  url += "&arch=" + arch;
  url += "&os_arch=" + arch;
  url += "&nacl_arch=" + nacl_arch;
  url += "&prod=" + prod;
  url += "&prodchannel=" + prodchannel;
  url += "&prodversion=" + product_version;
  url += "&acceptformat=crx2,crx3";
  url += "&x=id%3D" + extensionId + "%26uc";

  return url;
}

module.exports = { getCrxUrl };
