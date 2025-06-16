const { normalizePath } = require("./utils");
const fs = require("fs").promises;
const { getLocale } = require("./locales");

async function parseManifest(manifestPath) {
  try {
    const content = await fs.readFile(manifestPath, "utf-8");
    const manifest = JSON.parse(content);
    const locale = await getLocale(manifest, manifestPath);
    // Basic validation and extraction
    const parsed = {
      manifest_version: manifest.manifest_version,
      name: locale(manifest.name) || "Unnamed Extension",
      version: manifest.version || "0.0.0",
      description: locale(manifest.description) || "",
      permissions: manifest.permissions || [],
      content_scripts: manifest.content_scripts || [],
      options_ui: manifest.options_ui || {},
      browser_action: manifest.browser_action || {},
      page_action: manifest.page_action || {},
      action: manifest.action || {},
      icons: manifest.icons || {},
      web_accessible_resources: manifest.web_accessible_resources || [],
      _id: locale(manifest.name)
        ?.replace(/[^a-z0-9]+/gi, "-")
        .replace(/\-+$/, "")
        .replace(/^-+/, "")
        .toLowerCase(),
      // Add other relevant fields as needed in later phases (background, options_ui, etc.)
    };

    // Validate content_scripts structure minimally for Phase 1
    if (parsed.content_scripts) {
      parsed.content_scripts = parsed.content_scripts.filter(
        (cs) => cs.matches && (cs.js || cs.css),
      );
      parsed.content_scripts.forEach((cs) => {
        // Preserve the exact ordering of scripts and styles - this is critical
        // for proper execution where scripts depend on each other.
        // Normalize paths here for consistency downstream.
        cs.js = (cs.js || []).map(normalizePath);
        cs.css = (cs.css || []).map(normalizePath);

        // Flag to indicate we're preserving order (useful for debugging)
        cs._orderPreserved = true;
      });
    }

    return { parsedManifest: parsed, locale };
  } catch (error) {
    console.error(
      `Error reading or parsing manifest file at ${manifestPath}:`,
      error,
    );
    return null; // Indicate failure
  }
}

module.exports = { parseManifest };
