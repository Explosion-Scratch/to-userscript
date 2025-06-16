#!/usr/bin/env node
const fs = require("fs").promises;
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
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

  // Resolve and normalize paths immediately
  const inputDir = utils.normalizePath(path.resolve(argv.inputDir));
  const outputFile = utils.normalizePath(path.resolve(argv.outputFile));
  const manifestPath = path.join(inputDir, "manifest.json"); // Keep platform separators for fs ops
  try {
    console.log(`Parsing manifest: ${manifestPath}`);
    const { parsedManifest, locale } =
      await manifestParser.parseManifest(manifestPath);
    if (!parsedManifest) {
      throw new Error("Failed to parse manifest.");
    }
    console.log(
      `Manifest parsed: ${parsedManifest.name} v${parsedManifest.version}`,
    );

    // Phase 1: Only handle content scripts
    const contentScriptConfigs = parsedManifest.content_scripts || [];
    if (contentScriptConfigs.length === 0) {
      console.warn(
        "Warning: No content scripts found in manifest. Output might be empty or non-functional.",
      );
    }

    console.log("Processing resources...");
    const { jsContents, cssContents } =
      await resourceProcessor.readScriptsAndStyles(
        inputDir,
        contentScriptConfigs,
      );
    console.log(
      `Processed ${Object.keys(jsContents).length} JS file(s) and ${Object.keys(cssContents).length} CSS file(s).`,
    );

    // Background scripts (manifest v2)
    const backgroundScriptsList =
      parsedManifest.background && parsedManifest.background.scripts
        ? parsedManifest.background.scripts
        : [];
    const backgroundJsContents = await resourceProcessor.readBackgroundScripts(
      inputDir,
      backgroundScriptsList,
    );

    // Phase 1: Only userscript target
    const target = "userscript";
    console.log(`Generating for target: ${target}`);

    console.log("Generating metadata...");
    const requiredGmGrants = abstractionLayer.getRequiredGmGrants(target);
    const metadataBlock = metadataGenerator.generateMetadata(
      parsedManifest,
      requiredGmGrants,
      inputDir,
    );

    console.log("Building final script...");
    const finalScriptContent = await outputBuilder.buildUserScript({
      metadataBlock,
      jsContents,
      cssContents,
      parsedManifest,
      backgroundJsContents,
      extensionRoot: inputDir,
      locale,
    });

    console.log(`Writing output to: ${path.resolve(outputFile)}`);
    await fs.writeFile(outputFile, finalScriptContent);
    console.log("Conversion complete!");
  } catch (error) {
    console.error("Error during conversion:", error);
    process.exit(1);
  }
}

main();
