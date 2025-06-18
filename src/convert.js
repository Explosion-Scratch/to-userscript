const fs = require("fs").promises;
const path = require("path");
const debug = require("debug")("to-userscript:convert");
const { parseManifest } = require("./manifestParser");
const {
  readScriptsAndStyles,
  readBackgroundScripts,
} = require("./resourceProcessor");
const { getRequiredGmGrants } = require("./abstractionLayer");
const { generateMetadata } = require("./metadataGenerator");
const { buildUserScript } = require("./outputBuilder");
const { normalizePath } = require("./utils");
const { getLocalizedName, getLocalizedDescription } = require("./locales");

/**
 * Converts a browser extension to a userscript or vanilla JS file.
 * This is a pure library function with no CLI dependencies.
 *
 * @param {Object} config - Configuration object
 * @param {string} config.inputDir - Absolute path to the extension directory
 * @param {string} config.outputFile - Absolute path for the output file
 * @param {string} [config.target='userscript'] - Build target ('userscript' or 'vanilla')
 * @param {string} [config.locale] - Preferred locale for extension name/description
 * @param {string} [config.ignoredAssets] - Comma-separated asset extensions to ignore
 * @returns {Promise<Object>} Result object with success status and details
 */
async function convertExtension(config) {
  const {
    inputDir,
    outputFile,
    target = "userscript",
    locale: preferredLocale,
    ignoredAssets,
  } = config;

  // Validate configuration
  if (!inputDir || typeof inputDir !== "string") {
    throw new Error("config.inputDir must be a non-empty string");
  }

  if (!outputFile || typeof outputFile !== "string") {
    throw new Error("config.outputFile must be a non-empty string");
  }

  if (!["userscript", "vanilla"].includes(target)) {
    throw new Error('config.target must be "userscript" or "vanilla"');
  }

  // Normalize paths
  const normalizedInputDir = normalizePath(path.resolve(inputDir));
  const normalizedOutputFile = normalizePath(path.resolve(outputFile));
  const manifestPath = path.join(normalizedInputDir, "manifest.json");

  try {
    debug("Starting conversion: %s target", target);
    debug("Input directory: %s", normalizedInputDir);
    debug("Output file: %s", normalizedOutputFile);

    if (preferredLocale) {
      debug("Preferred locale: %s", preferredLocale);
    }

    if (ignoredAssets) {
      debug("Ignored asset extensions: %s", ignoredAssets);
    }

    // Verify input directory exists and is accessible
    try {
      const stats = await fs.stat(normalizedInputDir);
      if (!stats.isDirectory()) {
        throw new Error(`Input path is not a directory: ${normalizedInputDir}`);
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new Error(`Input directory not found: ${normalizedInputDir}`);
      }
      throw new Error(
        `Cannot access input directory: ${normalizedInputDir} - ${error.message}`
      );
    }

    // Parse manifest with preferred locale
    debug("Parsing manifest: %s", manifestPath);
    const manifestResult = await parseManifest(manifestPath, preferredLocale);
    if (!manifestResult) {
      throw new Error("Failed to parse manifest.json");
    }

    const { parsedManifest, locale } = manifestResult;

    if (!parsedManifest) {
      throw new Error("Manifest parsing returned null");
    }

    const localizedName = getLocalizedName(parsedManifest, locale);
    const localizedDescription = getLocalizedDescription(
      parsedManifest,
      locale
    );

    debug("Manifest parsed: %s v%s", localizedName, parsedManifest.version);

    if (localizedDescription) {
      debug("Description: %s", localizedDescription);
    }

    // Validate content scripts
    const contentScriptConfigs = parsedManifest.content_scripts || [];
    if (contentScriptConfigs.length === 0) {
      debug(
        "Warning: No content scripts found in manifest. Output might be empty or non-functional."
      );
    }

    // Process resources
    debug("Processing content scripts and styles...");
    const resourceResult = await readScriptsAndStyles(
      normalizedInputDir,
      contentScriptConfigs
    );

    if (!resourceResult) {
      throw new Error("Failed to read scripts and styles");
    }

    const { jsContents, cssContents } = resourceResult;

    debug(
      "Processed %d JS file(s) and %d CSS file(s)",
      Object.keys(jsContents).length,
      Object.keys(cssContents).length
    );

    // Process background scripts
    const backgroundScriptsList =
      parsedManifest.background && parsedManifest.background.scripts
        ? parsedManifest.background.scripts
        : [];

    const backgroundJsContents = await readBackgroundScripts(
      normalizedInputDir,
      backgroundScriptsList
    );

    if (backgroundScriptsList.length > 0) {
      debug(
        "Processed %d background script(s)",
        Object.keys(backgroundJsContents).length
      );
    }

    // Generate metadata (for userscript target)
    let metadataBlock = "";
    if (target === "userscript") {
      debug("Generating userscript metadata...");
      const requiredGmGrants = getRequiredGmGrants(target);
      metadataBlock = generateMetadata(
        parsedManifest,
        requiredGmGrants,
        normalizedInputDir
      );
    }

    // Build final script
    debug("Building final script...");
    const finalScriptContent = await buildUserScript({
      metadataBlock,
      jsContents,
      cssContents,
      parsedManifest,
      backgroundJsContents,
      extensionRoot: normalizedInputDir,
      locale,
      target,
      ignoredAssets, // Pass ignored assets to buildUserScript
    });

    // Ensure output directory exists
    const outputDir = path.dirname(normalizedOutputFile);
    await fs.mkdir(outputDir, { recursive: true });

    // Write output file
    debug("Writing output to: %s", normalizedOutputFile);
    await fs.writeFile(normalizedOutputFile, finalScriptContent, "utf-8");

    // Get file stats for response
    const outputStats = await fs.stat(normalizedOutputFile);

    debug("Conversion completed successfully!");

    return {
      success: true,
      outputFile: normalizedOutputFile,
      target,
      extension: {
        name: localizedName,
        version: parsedManifest.version,
        description: localizedDescription,
      },
      stats: {
        jsFiles: Object.keys(jsContents).length,
        cssFiles: Object.keys(cssContents).length,
        backgroundScripts: Object.keys(backgroundJsContents).length,
        outputSize: outputStats.size,
      },
      warnings: [], // Could be populated with non-fatal issues
    };
  } catch (error) {
    debug("Conversion failed: %s", error.message);

    // Re-throw with additional context but preserve original error
    const enhancedError = new Error(
      `Extension conversion failed: ${error.message}`
    );
    enhancedError.originalError = error;
    enhancedError.inputDir = normalizedInputDir;
    enhancedError.outputFile = normalizedOutputFile;
    enhancedError.target = target;

    throw enhancedError;
  }
}

module.exports = {
  convertExtension,
};
