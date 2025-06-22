const { normalizePath, scriptBlacklist } = require("./utils");
const fs = require("fs").promises;
const path = require("path");
const debug = require("debug")("to-userscript:resources");

/**
 * Validates that a file exists and is readable
 * @param {string} filePath - The file path to validate
 * @returns {Promise<void>}
 * @throws {Error} If file doesn't exist or isn't readable
 */
async function validateFileAccess(filePath) {
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      throw new Error(`Path exists but is not a file: ${filePath}`);
    }
    await fs.access(filePath, fs.constants.R_OK);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`File not found: ${filePath}`);
    } else if (error.code === "EACCES") {
      throw new Error(`File is not readable: ${filePath}`);
    } else {
      throw new Error(
        `File access validation failed: ${filePath} - ${error.message}`,
      );
    }
  }
}

async function readScript(filePath) {
  try {
    if (!filePath || typeof filePath !== "string") {
      throw new Error(`Invalid file path provided: ${filePath}`);
    }

    await validateFileAccess(filePath);
    const content = await fs.readFile(filePath, "utf-8");

    if (content === null || content === undefined) {
      throw new Error(`File content is null or undefined: ${filePath}`);
    }

    return content;
  } catch (error) {
    const errorMsg = `Error reading script file ${filePath}: ${error.message}`;
    debug("Error reading script file %s: %s", filePath, error.message);

    if (
      error.message.includes("not found") ||
      error.message.includes("not readable")
    ) {
      debug("Returning empty content for inaccessible script: %s", filePath);
      return "";
    }

    throw new Error(errorMsg);
  }
}

async function readCSS(filePath) {
  try {
    if (!filePath || typeof filePath !== "string") {
      throw new Error(`Invalid CSS file path provided: ${filePath}`);
    }

    await validateFileAccess(filePath);
    const content = await fs.readFile(filePath, "utf-8");

    if (content === null || content === undefined) {
      throw new Error(`CSS file content is null or undefined: ${filePath}`);
    }

    return content;
  } catch (error) {
    const errorMsg = `Error reading CSS file ${filePath}: ${error.message}`;
    debug("Error reading CSS file %s: %s", filePath, error.message);

    // For CSS files, missing files are less critical than JS files
    if (
      error.message.includes("not found") ||
      error.message.includes("not readable")
    ) {
      debug("Returning empty content for inaccessible CSS: %s", filePath);
      return "";
    }

    throw new Error(errorMsg);
  }
}

/**
 * Reads JS and CSS files specified in content script configurations.
 * @param {string} baseDir - The root directory of the extension.
 * @param {Array<object>} contentScriptConfigs - Array of content script objects from the manifest.
 * @returns {Promise<{jsContents: object, cssContents: object}>} - Object containing script and style contents keyed by relative path.
 */
async function readScriptsAndStyles(baseDir, contentScriptConfigs) {
  if (!baseDir || typeof baseDir !== "string") {
    throw new Error(`Invalid base directory provided: ${baseDir}`);
  }

  if (!Array.isArray(contentScriptConfigs)) {
    throw new Error(
      `Content script configs must be an array, got: ${typeof contentScriptConfigs}`,
    );
  }

  const jsContents = {};
  const cssContents = {};
  const processedJsPaths = new Set();
  const processedCssPaths = new Set();
  const errors = [];

  try {
    await validateFileAccess(baseDir);
  } catch (error) {
    try {
      const stats = await fs.stat(baseDir);
      if (!stats.isDirectory()) {
        throw new Error(`Base directory is not a directory: ${baseDir}`);
      }
    } catch (dirError) {
      throw new Error(
        `Base directory is not accessible: ${baseDir} - ${dirError.message}`,
      );
    }
  }

  for (const [configIndex, config] of contentScriptConfigs.entries()) {
    if (!config || typeof config !== "object") {
      debug(
        "Skipping invalid content script config at index %d: %o",
        configIndex,
        config,
      );
      continue;
    }

    // Process JS files
    if (config.js && Array.isArray(config.js)) {
      for (const [jsIndex, jsPath] of config.js.entries()) {
        try {
          if (!jsPath || typeof jsPath !== "string") {
            throw new Error(
              `Invalid JS path at config[${configIndex}].js[${jsIndex}]: ${jsPath}`,
            );
          }

          const relativePath = normalizePath(jsPath);
          if (!processedJsPaths.has(relativePath)) {
            if (
              Object.keys(scriptBlacklist).includes(path.basename(relativePath))
            ) {
              debug("Skipping JS: %s (blacklisted)", relativePath);
              jsContents[relativePath] =
                scriptBlacklist[path.basename(relativePath)];
              processedJsPaths.add(relativePath);
            } else {
              const fullPath = path.join(baseDir, relativePath);
              debug("Reading JS: %s", relativePath);

              try {
                jsContents[relativePath] = await readScript(fullPath);
                processedJsPaths.add(relativePath);
              } catch (scriptError) {
                errors.push(
                  `Failed to read JS file ${relativePath}: ${scriptError.message}`,
                );
                // Continue processing other files even if one fails
                jsContents[relativePath] = ""; // Use empty content as fallback
                processedJsPaths.add(relativePath);
              }
            }
          }
        } catch (error) {
          const errorMsg = `Error processing JS path at config[${configIndex}].js[${jsIndex}]: ${error.message}`;
          errors.push(errorMsg);
          debug(
            "Error processing JS path at config[%d].js[%d]: %s",
            configIndex,
            jsIndex,
            error.message,
          );
        }
      }
    }

    // Process CSS files
    if (config.css && Array.isArray(config.css)) {
      for (const [cssIndex, cssPath] of config.css.entries()) {
        try {
          if (!cssPath || typeof cssPath !== "string") {
            throw new Error(
              `Invalid CSS path at config[${configIndex}].css[${cssIndex}]: ${cssPath}`,
            );
          }

          const relativePath = normalizePath(cssPath);
          if (!processedCssPaths.has(relativePath)) {
            const fullPath = path.join(baseDir, relativePath);
            debug("Reading CSS: %s", relativePath);

            try {
              cssContents[relativePath] = await readCSS(fullPath);
              processedCssPaths.add(relativePath);
            } catch (cssError) {
              errors.push(
                `Failed to read CSS file ${relativePath}: ${cssError.message}`,
              );
              // Continue processing other files even if one fails
              cssContents[relativePath] = "";
              processedCssPaths.add(relativePath);
            }
          }
        } catch (error) {
          const errorMsg = `Error processing CSS path at config[${configIndex}].css[${cssIndex}]: ${error.message}`;
          errors.push(errorMsg);
          debug(
            "Error processing CSS path at config[%d].css[%d]: %s",
            configIndex,
            cssIndex,
            error.message,
          );
        }
      }
    }
  }

  // Log summary of errors if any occurred
  if (errors.length > 0) {
    debug(
      "Encountered %d error(s) while reading scripts and styles:",
      errors.length,
    );
    errors.forEach((error, index) => debug("  %d. %s", index + 1, error));

    // Only throw if we couldn't read any files at all
    const totalExpectedFiles = contentScriptConfigs.reduce((count, config) => {
      return (
        count +
        (config.js ? config.js.length : 0) +
        (config.css ? config.css.length : 0)
      );
    }, 0);

    const totalReadFiles =
      Object.keys(jsContents).length + Object.keys(cssContents).length;

    if (totalReadFiles === 0 && totalExpectedFiles > 0) {
      throw new Error(
        `Failed to read any of the ${totalExpectedFiles} expected script/style files. Check file paths and permissions.`,
      );
    }
  }

  debug(
    "Successfully processed %d JS file(s) and %d CSS file(s)",
    Object.keys(jsContents).length,
    Object.keys(cssContents).length,
  );

  return { jsContents, cssContents };
}

/**
 * Reads background script files specified in manifest.background.scripts.
 * @param {string} baseDir Root directory of the extension.
 * @param {Array<string>} bgScripts Array of script paths.
 * @returns {Promise<object>} Object mapping normalized path -> script content.
 */
async function readBackgroundScripts(baseDir, bgScripts = []) {
  if (!baseDir || typeof baseDir !== "string") {
    throw new Error(
      `Invalid base directory for background scripts: ${baseDir}`,
    );
  }

  if (!Array.isArray(bgScripts)) {
    throw new Error(
      `Background scripts must be an array, got: ${typeof bgScripts}`,
    );
  }

  const bgContents = {};
  const processed = new Set();
  const errors = [];

  if (bgScripts.length === 0) {
    debug("No background scripts to process");
    return bgContents;
  }

  debug("Processing %d background script(s)...", bgScripts.length);

  for (const [index, bgPath] of bgScripts.entries()) {
    try {
      if (!bgPath || typeof bgPath !== "string") {
        throw new Error(
          `Invalid background script path at index ${index}: ${bgPath}`,
        );
      }

      const rel = normalizePath(bgPath);
      if (processed.has(rel)) {
        debug("Skipping duplicate background script: %s", rel);
        continue;
      }

      debug("Reading Background JS: %s", rel);
      const full = path.join(baseDir, rel);

      try {
        bgContents[rel] = await readScript(full);
        processed.add(rel);
      } catch (scriptError) {
        errors.push(
          `Failed to read background script ${rel}: ${scriptError.message}`,
        );
        // Add empty content as fallback
        bgContents[rel] = "";
        processed.add(rel);
      }
    } catch (error) {
      const errorMsg = `Error processing background script at index ${index}: ${error.message}`;
      errors.push(errorMsg);
      debug(
        "Error processing background script at index %d: %s",
        index,
        error.message,
      );
    }
  }

  // Log summary
  if (errors.length > 0) {
    debug(
      "Encountered %d error(s) while reading background scripts:",
      errors.length,
    );
    errors.forEach((error, index) => debug("  %d. %s", index + 1, error));

    // Only throw if we couldn't read any background scripts at all
    if (Object.keys(bgContents).length === 0 && bgScripts.length > 0) {
      throw new Error(
        `Failed to read any of the ${bgScripts.length} expected background scripts. Check file paths and permissions.`,
      );
    }
  }

  debug(
    "Successfully processed %d background script(s)",
    Object.keys(bgContents).length,
  );

  return bgContents;
}

module.exports = {
  readScript,
  readCSS,
  readScriptsAndStyles,
  readBackgroundScripts,
};
