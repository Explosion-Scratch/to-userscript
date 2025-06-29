const { normalizePath } = require("./utils");
const fs = require("fs").promises;
const debug = require("debug")("to-userscript:manifest");
const {
  getLocale,
  getLocalizedName,
  getLocalizedDescription,
} = require("./locales");

async function parseManifest(manifestPath, preferredLocale = null) {
  try {
    const content = await fs.readFile(manifestPath, "utf-8");
    const manifest = JSON.parse(content);
    const locale = await getLocale(manifest, manifestPath, preferredLocale);

    // Use localization functions for name and description
    const localizedName = getLocalizedName(manifest, locale);
    const localizedDescription = getLocalizedDescription(manifest, locale);

    const parsed = {
      manifest_version: manifest.manifest_version,
      name: localizedName,
      version: manifest.version || "0.0.0",
      description: localizedDescription,
      permissions: manifest.permissions || [],
      optional_permissions: manifest.optional_permissions || [],
      content_scripts: manifest.content_scripts || [],
      options_ui: manifest.options_ui || {},
      browser_action: manifest.browser_action || {},
      page_action: manifest.page_action || {},
      action: manifest.action || {},
      icons: manifest.icons || {},
      web_accessible_resources: manifest.web_accessible_resources || [],
      background: manifest.background || {},
      _id: localizedName
        ?.replace(/[^a-z0-9]+/gi, "-")
        .replace(/\-+$/, "")
        .replace(/^-+/, "")
        .toLowerCase(),
    };

    if (parsed.content_scripts) {
      parsed.content_scripts = parsed.content_scripts.filter(
        (cs) => cs.matches && (cs.js || cs.css)
      );
      parsed.content_scripts.forEach((cs) => {
        // Preserve the exact ordering of scripts and styles - this is critical
        // for proper execution where scripts depend on each other.
        // Normalize paths here for consistency downstream.
        cs.js = (cs.js || []).map(normalizePath);
        cs.css = (cs.css || []).map(normalizePath);
      });
    }

    return { parsedManifest: parsed, locale };
  } catch (error) {
    debug(
      "Error reading or parsing manifest file at %s: %s",
      manifestPath,
      error.message
    );
    return null;
  }
}

module.exports = { parseManifest };
