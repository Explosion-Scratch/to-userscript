const path = require("path");
const fs = require("fs").promises;

async function getLocale(manifest, manifestPath, preferredLocale = null) {
  try {
    const LOCALE = preferredLocale || manifest.default_locale || "en";
    const localePath = path.join(
      path.dirname(manifestPath),
      "_locales",
      LOCALE,
      "messages.json"
    );

    let locale = null;
    try {
      locale = JSON.parse(await fs.readFile(localePath, "utf8"));
    } catch (localeError) {
      // If preferred locale fails, try default locale
      if (
        preferredLocale &&
        preferredLocale !== (manifest.default_locale || "en")
      ) {
        const fallbackLocale = manifest.default_locale || "en";
        const fallbackPath = path.join(
          path.dirname(manifestPath),
          "_locales",
          fallbackLocale,
          "messages.json"
        );
        try {
          locale = JSON.parse(await fs.readFile(fallbackPath, "utf8"));
          console.warn(
            `Locale '${preferredLocale}' not found, using fallback '${fallbackLocale}'`
          );
        } catch (fallbackError) {
          console.warn(
            `No locale files found for '${preferredLocale}' or '${fallbackLocale}', using raw text`
          );
        }
      } else {
        console.warn(`No locale file found for '${LOCALE}', using raw text`);
      }
    }

    function processString(str) {
      if (!locale || !str) {
        return str;
      }
      return str.replace(/__MSG_(\w+)__/g, (match, p1) => {
        return locale[p1]?.message || match;
      });
    }
    processString.__data = locale;
    processString.__locale = LOCALE;
    return processString;
  } catch (e) {
    console.warn(`Error loading locale: ${e.message}`);
    return (str) => str;
  }
}

/**
 * Gets localized extension name from manifest
 * @param {object} manifest - The extension manifest
 * @param {function} localeProcessor - Locale processing function from getLocale
 * @returns {string} Localized extension name
 */
function getLocalizedName(manifest, localeProcessor) {
  if (!manifest || !manifest.name) {
    return "Unknown Extension";
  }

  const name = localeProcessor ? localeProcessor(manifest.name) : manifest.name;
  return name || manifest.name || "Unknown Extension";
}

/**
 * Gets localized extension description from manifest
 * @param {object} manifest - The extension manifest
 * @param {function} localeProcessor - Locale processing function from getLocale
 * @returns {string} Localized extension description
 */
function getLocalizedDescription(manifest, localeProcessor) {
  if (!manifest || !manifest.description) {
    return "";
  }

  const description = localeProcessor
    ? localeProcessor(manifest.description)
    : manifest.description;
  return description || manifest.description || "";
}

/**
 * Lists available locales in the extension
 * @param {string} manifestPath - Path to the manifest file
 * @returns {Promise<Array<string>>} Array of available locale codes
 */
async function getAvailableLocales(manifestPath) {
  try {
    const localesDir = path.join(path.dirname(manifestPath), "_locales");
    const entries = await fs.readdir(localesDir, { withFileTypes: true });

    const locales = [];
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const messagesFile = path.join(localesDir, entry.name, "messages.json");
        try {
          await fs.access(messagesFile, fs.constants.F_OK);
          locales.push(entry.name);
        } catch {
          // Skip directories without messages.json
        }
      }
    }

    return locales.sort();
  } catch (error) {
    console.warn(`Error listing available locales: ${error.message}`);
    return [];
  }
}

module.exports = {
  getLocale,
  getLocalizedName,
  getLocalizedDescription,
  getAvailableLocales,
};
