const fs = require("fs").promises;
const path = require("path");
const { parseManifest } = require("./manifestParser");
const {
  readScriptsAndStyles,
  readBackgroundScripts,
} = require("./resourceProcessor");
const { getRequiredGmGrants } = require("./abstractionLayer");
const { generateMetadata } = require("./metadataGenerator");
const { buildUserScript } = require("./outputBuilder");
const { normalizePath } = require("./utils");

/**
 * Converts a browser extension to a userscript or vanilla JS file.
 * This is a pure library function with no CLI dependencies.
 *
 * @param {Object} config - Configuration object
 * @param {string} config.inputDir - Absolute path to the extension directory
 * @param {string} config.outputFile - Absolute path for the output file
 * @param {string} [config.target='userscript'] - Build target ('userscript' or 'vanilla')
 * @param {Object} [config.logger=console] - Logger object with log, warn, error methods
 * @returns {Promise<Object>} Result object with success status and details
 */
async function convertExtension(config) {
  const {
    inputDir,
    outputFile,
    target = "userscript",
    logger = console,
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
    logger.log(`Starting conversion: ${target} target`);
    logger.log(`Input directory: ${normalizedInputDir}`);
    logger.log(`Output file: ${normalizedOutputFile}`);

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

    // Parse manifest
    logger.log(`Parsing manifest: ${manifestPath}`);
    const manifestResult = await parseManifest(manifestPath);
    if (!manifestResult) {
      throw new Error("Failed to parse manifest.json");
    }

    const { parsedManifest, locale } = manifestResult;

    if (!parsedManifest) {
      throw new Error("Manifest parsing returned null");
    }

    logger.log(
      `Manifest parsed: ${parsedManifest.name} v${parsedManifest.version}`
    );

    // Validate content scripts
    const contentScriptConfigs = parsedManifest.content_scripts || [];
    if (contentScriptConfigs.length === 0) {
      logger.warn(
        "Warning: No content scripts found in manifest. Output might be empty or non-functional."
      );
    }

    // Process resources
    logger.log("Processing content scripts and styles...");
    const resourceResult = await readScriptsAndStyles(
      normalizedInputDir,
      contentScriptConfigs
    );

    if (!resourceResult) {
      throw new Error("Failed to read scripts and styles");
    }

    const { jsContents, cssContents } = resourceResult;

    logger.log(
      `Processed ${Object.keys(jsContents).length} JS file(s) and ${Object.keys(cssContents).length} CSS file(s)`
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
      logger.log(
        `Processed ${Object.keys(backgroundJsContents).length} background script(s)`
      );
    }

    // Generate metadata (for userscript target)
    let metadataBlock = "";
    if (target === "userscript") {
      logger.log("Generating userscript metadata...");
      const requiredGmGrants = getRequiredGmGrants(target);
      metadataBlock = generateMetadata(
        parsedManifest,
        requiredGmGrants,
        normalizedInputDir
      );
    }

    // Build final script
    logger.log("Building final script...");
    const finalScriptContent = await buildUserScript({
      metadataBlock,
      jsContents,
      cssContents,
      parsedManifest,
      backgroundJsContents,
      extensionRoot: normalizedInputDir,
      locale,
      target, // Pass target to buildUserScript for future vanilla support
    });

    // Ensure output directory exists
    const outputDir = path.dirname(normalizedOutputFile);
    await fs.mkdir(outputDir, { recursive: true });

    // Write output file
    logger.log(`Writing output to: ${normalizedOutputFile}`);
    await fs.writeFile(normalizedOutputFile, finalScriptContent, "utf-8");

    // Get file stats for response
    const outputStats = await fs.stat(normalizedOutputFile);

    logger.log("Conversion completed successfully!");

    return {
      success: true,
      outputFile: normalizedOutputFile,
      target,
      extension: {
        name: parsedManifest.name,
        version: parsedManifest.version,
        description: parsedManifest.description,
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
    logger.error(`Conversion failed: ${error.message}`);

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
