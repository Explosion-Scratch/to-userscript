const fs = require("fs");
const path = require("path");

function getMimeTypeFromExt(ext) {
  switch (ext.toLowerCase()) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "ico":
      return "image/x-icon";
    default:
      return "application/octet-stream";
  }
}

/**
 * Gets the best icon from the manifest, preferring size 48 or closest to it.
 * @param {object} manifest - The parsed manifest object
 * @param {string} extensionRoot - Absolute path to the extension root directory
 * @returns {string|null} Data URL of the icon, or null if no icon found
 */
function getIcon(manifest, extensionRoot) {
  if (!manifest.icons || !extensionRoot) {
    return null;
  }

  const sizes = Object.keys(manifest.icons)
    .map((s) => parseInt(s, 10))
    .filter(Boolean)
    .sort((a, b) => Math.abs(a - 48) - Math.abs(b - 48)); // Sort by distance from 48

  if (sizes.length === 0) {
    return null;
  }

  // Get the size closest to 48
  const bestSize = sizes[0].toString();
  const iconRel = manifest.icons[bestSize];

  try {
    const iconPath = path.join(extensionRoot, iconRel);
    const data = fs.readFileSync(iconPath);
    const ext = path.extname(iconPath).substring(1);
    const mime = getMimeTypeFromExt(ext);
    const dataUri = `data:${mime};base64,${data.toString("base64")}`;
    console.log(`Selected icon: ${iconRel} (size ${bestSize})`);
    return dataUri;
  } catch (e) {
    console.warn("Failed to read icon file:", e);
    return null;
  }
}

module.exports = { getIcon };
