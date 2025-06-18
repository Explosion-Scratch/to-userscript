const fs = require("fs").promises;
const path = require("path");
const tmp = require("tmp");
const chalk = require("chalk");
const ora = require("ora");
const download = require("./download");
const unpack = require("./unpack");
const minify = require("./minify");
const debug = require("debug")("to-userscript:cli:workflow");

async function determineSourceType(source) {
  debug("Determining source type for: %s", source);

  // Check if it's a URL
  if (source.match(/^https?:\/\//)) {
    if (
      source.includes("chrome.google.com/webstore") ||
      source.includes("chromewebstore.google.com")
    ) {
      return { type: "chrome-store", url: source };
    } else if (source.includes("addons.mozilla.org")) {
      return { type: "firefox-store", url: source };
    } else {
      return { type: "url", url: source };
    }
  }

  // Check if it's a file
  try {
    const stats = await fs.stat(source);
    if (stats.isFile()) {
      const ext = path.extname(source).toLowerCase();
      if ([".crx", ".xpi", ".zip"].includes(ext)) {
        return { type: "archive", path: path.resolve(source) };
      } else {
        throw new Error(
          `Unsupported file extension: ${ext}. Supported: .crx, .xpi, .zip`
        );
      }
    } else if (stats.isDirectory()) {
      return { type: "directory", path: path.resolve(source) };
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Source not found: ${source}`);
    }
    throw error;
  }

  throw new Error(`Unable to determine source type for: ${source}`);
}

async function generateOutputPath(config, manifest) {
  if (config.output) {
    return path.resolve(config.output);
  }

  // Generate default output name
  const name = manifest?.name || "converted-extension";
  const version = manifest?.version || "1.0.0";
  const target = config.target || "userscript";

  const cleanName = name
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  const extension = target === "userscript" ? ".user.js" : ".js";
  const filename = `${cleanName}-${version}${extension}`;

  return path.resolve(process.cwd(), filename);
}

async function checkOutputFile(outputPath, force) {
  try {
    await fs.access(outputPath);
    if (!force) {
      throw new Error(
        `Output file already exists: ${outputPath}. Use --force to overwrite.`
      );
    }
    debug("Output file exists, will be overwritten due to --force flag");
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

async function createTempDirectory(customTempDir) {
  const tempDirOptions = {
    prefix: "to-userscript-",
    unsafeCleanup: true,
  };

  if (customTempDir) {
    tempDirOptions.dir = customTempDir;
  }

  return new Promise((resolve, reject) => {
    tmp.dir(tempDirOptions, (err, tmpPath, cleanupCallback) => {
      if (err) {
        reject(
          new Error(`Failed to create temporary directory: ${err.message}`)
        );
      } else {
        debug("Created temporary directory: %s", tmpPath);
        resolve({ tmpPath, cleanupCallback });
      }
    });
  });
}

async function run(config) {
  const spinner = ora();
  let tempCleanup = null;

  try {
    debug("Starting conversion with config: %o", config);

    // Determine source type
    spinner.start("Analyzing source...");
    const sourceInfo = await determineSourceType(config.source);
    debug("Source type determined: %o", sourceInfo);

    // Create temporary directory
    const { tmpPath, cleanupCallback } = await createTempDirectory(
      config.tempDir
    );
    tempCleanup = cleanupCallback;

    let inputDir;
    let downloadedFile = null;

    // Handle different source types
    if (sourceInfo.type === "directory") {
      inputDir = sourceInfo.path;
      spinner.succeed(`Source: Local directory (${path.basename(inputDir)})`);
    } else if (sourceInfo.type === "archive") {
      spinner.text = "Extracting archive...";
      inputDir = await unpack.unpack(
        sourceInfo.path,
        path.join(tmpPath, "unpacked")
      );
      spinner.succeed(
        `Source: Archive file (${path.basename(sourceInfo.path)})`
      );
    } else if (
      sourceInfo.type === "chrome-store" ||
      sourceInfo.type === "firefox-store" ||
      sourceInfo.type === "url"
    ) {
      spinner.text = "Downloading extension...";
      const downloadPath = path.join(tmpPath, "download");
      downloadedFile = await download.downloadExtension(
        sourceInfo,
        downloadPath
      );
      debug("Downloaded file: %s", downloadedFile);

      spinner.text = "Extracting downloaded archive...";
      inputDir = await unpack.unpack(
        downloadedFile,
        path.join(tmpPath, "unpacked")
      );
      spinner.succeed(
        `Source: Downloaded from ${sourceInfo.type} (${path.basename(downloadedFile)})`
      );
    }

    // Verify manifest exists
    const manifestPath = path.join(inputDir, "manifest.json");
    try {
      await fs.access(manifestPath);
    } catch (error) {
      throw new Error(
        `No manifest.json found in extracted extension at: ${manifestPath}`
      );
    }

    // Read manifest for output path generation
    let manifest;
    try {
      const manifestContent = await fs.readFile(manifestPath, "utf-8");
      manifest = JSON.parse(manifestContent);
      debug("Manifest loaded: %s v%s", manifest.name, manifest.version);
    } catch (error) {
      throw new Error(`Failed to parse manifest.json: ${error.message}`);
    }

    // Generate output path
    const outputPath = await generateOutputPath(config, manifest);
    debug("Output path: %s", outputPath);

    // Check if output file exists
    await checkOutputFile(outputPath, config.force);

    // Convert using existing converter
    spinner.start("Converting extension to userscript...");
    const { convertExtension } = require("../convert");

    const convertConfig = {
      inputDir,
      outputFile: outputPath,
      target: config.target,
      logger: config.verbose
        ? console
        : { log: () => {}, error: console.error, warn: console.warn },
    };

    const result = await convertExtension(convertConfig);
    debug("Conversion result: %o", result);

    // Minify if requested
    if (config.minify) {
      spinner.text = "Minifying output...";
      await minify.minifyScript(outputPath);
      debug("Minification complete");
    }

    spinner.succeed(chalk.green(`Conversion complete!`));

    // Display results
    const stats = await fs.stat(outputPath);
    const sizeKB = Math.round(stats.size / 1024);

    console.log(
      chalk.blue("📦 Extension:"),
      chalk.bold(manifest.name || "Unknown")
    );
    console.log(chalk.blue("📋 Version:"), manifest.version || "Unknown");
    console.log(chalk.blue("🎯 Target:"), config.target);
    console.log(chalk.blue("📄 Output:"), outputPath);
    console.log(chalk.blue("📊 Size:"), `${sizeKB} KB`);

    if (config.minify) {
      console.log(chalk.blue("🗜️  Minified:"), "Yes");
    }

    return { success: true, outputFile: outputPath };
  } catch (error) {
    spinner.fail(chalk.red("Conversion failed"));
    debug("Conversion error: %o", error);
    throw error;
  } finally {
    // Cleanup temporary files unless requested to keep them
    if (tempCleanup && !config.keepTemp) {
      try {
        tempCleanup();
        debug("Temporary files cleaned up");
      } catch (cleanupError) {
        console.warn(
          chalk.yellow("Warning: Failed to clean up temporary files:"),
          cleanupError.message
        );
      }
    } else if (config.keepTemp && tempCleanup) {
      console.log(
        chalk.yellow("Temporary files preserved for debugging:"),
        tempCleanup.path
      );
    }
  }
}

module.exports = { run };
