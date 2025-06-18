#!/usr/bin/env node
const fs = require("fs").promises;
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const debug = require("debug")("to-userscript:converter");
const manifestParser = require("./manifestParser");
const resourceProcessor = require("./resourceProcessor");
const abstractionLayer = require("./abstractionLayer");
const metadataGenerator = require("./metadataGenerator");
const outputBuilder = require("./outputBuilder");
const utils = require("./utils");

async function main() {
  const argv = yargs(hideBin(process.argv))
    .option("inputDir", {
      alias: "i",
      description: "Path to the input extension directory",
      type: "string",
      demandOption: true,
    })
    .option("outputFile", {
      alias: "o",
      description: "Path to the output .user.js file",
      type: "string",
      demandOption: true,
    })
    .help()
    .alias("help", "h").argv;

  const inputDir = utils.normalizePath(path.resolve(argv.inputDir));
  const outputFile = utils.normalizePath(path.resolve(argv.outputFile));
  const manifestPath = path.join(inputDir, "manifest.json");
  try {
    debug("Parsing manifest: %s", manifestPath);
    const { parsedManifest, locale } =
      await manifestParser.parseManifest(manifestPath);
    if (!parsedManifest) {
      throw new Error("Failed to parse manifest.");
    }
    debug(
      "Manifest parsed: %s v%s",
      parsedManifest.name,
      parsedManifest.version
    );

    const contentScriptConfigs = parsedManifest.content_scripts || [];
    if (contentScriptConfigs.length === 0) {
      debug(
        "Warning: No content scripts found in manifest. Output might be empty or non-functional."
      );
    }

    debug("Processing resources...");
    const { jsContents, cssContents } =
      await resourceProcessor.readScriptsAndStyles(
        inputDir,
        contentScriptConfigs
      );
    debug(
      "Processed %d JS file(s) and %d CSS file(s).",
      Object.keys(jsContents).length,
      Object.keys(cssContents).length
    );

    const backgroundScriptsList =
      parsedManifest.background && parsedManifest.background.scripts
        ? parsedManifest.background.scripts
        : [];
    const backgroundJsContents = await resourceProcessor.readBackgroundScripts(
      inputDir,
      backgroundScriptsList
    );

    const target = "userscript";
    debug("Generating for target: %s", target);

    debug("Generating metadata...");
    const requiredGmGrants = abstractionLayer.getRequiredGmGrants(target);
    const metadataBlock = metadataGenerator.generateMetadata(
      parsedManifest,
      requiredGmGrants,
      inputDir
    );

    debug("Building final script...");
    const finalScriptContent = await outputBuilder.buildUserScript({
      metadataBlock,
      jsContents,
      cssContents,
      parsedManifest,
      backgroundJsContents,
      extensionRoot: inputDir,
      locale,
    });

    debug("Writing output to: %s", path.resolve(outputFile));
    await fs.writeFile(outputFile, finalScriptContent);
    debug("Conversion complete!");
  } catch (error) {
    console.error("Error during conversion:", error);
    process.exit(1);
  }
}

main();
