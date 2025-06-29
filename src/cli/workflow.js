const fs = require("fs").promises;
const path = require("path");
const tmp = require("tmp");
const chalk = require("chalk");
const ora = require("ora");
const unpack = require("./unpack");
const minify = require("./minify");
const debug = require("debug")("to-userscript:cli:workflow");
const { getLocale, getLocalizedName } = require("../locales");
const fetch = require("node-fetch");

async function determineSourceType(source) {
  if (!source || typeof source !== "string") {
    throw new Error("Source must be a non-empty string");
  }

  const urlRegex = /^https?:\/\//;
  const chromeStoreRegex =
    /chromewebstore\.google\.com\/detail\/([^\/]+)\/([a-z]{32})/;
  const firefoxStoreRegex = /addons\.mozilla\.org.*\/addon\/([^\/]+)/;

  if (urlRegex.test(source)) {
    if (chromeStoreRegex.test(source)) {
      return { type: "chrome-store", url: source };
    } else if (firefoxStoreRegex.test(source)) {
      return { type: "firefox-store", url: source };
    } else {
      return { type: "url", url: source };
    }
  }

  try {
    const stats = await fs.stat(source);
    if (stats.isDirectory()) {
      return { type: "directory", path: path.resolve(source) };
    } else if (stats.isFile()) {
      const ext = path.extname(source).toLowerCase();
      if ([".crx", ".xpi", ".zip"].includes(ext)) {
        return { type: "archive", path: path.resolve(source) };
      } else {
        throw new Error(
          `Unsupported file type: ${ext}. Supported types: .crx, .xpi, .zip`
        );
      }
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Source not found: ${source}`);
    }
    throw error;
  }

  throw new Error(`Unable to determine source type: ${source}`);
}

async function generateOutputPath(config, manifest, localizedName = null) {
  if (config.output) {
    return path.resolve(config.output);
  }

  // Use localized name if available, otherwise fall back to raw manifest name
  const name = localizedName || manifest?.name || "converted-extension";
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

async function checkOutputFile(outputPath, force, isDirectory = false) {
  try {
    await fs.access(outputPath);
    if (!force) {
      const itemType = isDirectory ? "directory" : "file";
      throw new Error(
        `Output ${itemType} already exists: ${outputPath}. Use --force to overwrite.`
      );
    }
    const itemType = isDirectory ? "directory" : "file";
    debug(`Output ${itemType} exists, will be overwritten due to --force flag`);
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

async function runDownload(config) {
  const download = require("./download");
  const spinner = ora();
  let tempCleanup = null;

  try {
    debug("Starting download with config: %o", config);

    // Source Analysis
    spinner.start("Analyzing source...");
    const sourceInfo = await determineSourceType(config.source);
    debug("Source type determined: %o", sourceInfo);

    // URL Resolution
    spinner.text = "Resolving download URL...";
    const downloadUrl = await download.getDownloadableUrl(sourceInfo);
    debug("Download URL resolved: %s", downloadUrl);

    // Output Path Determination
    spinner.text = "Determining output path...";
    let outputPath;

    if (config.output) {
      const outputStat = await fs.stat(config.output).catch(() => null);
      if (outputStat && outputStat.isDirectory()) {
        // Output is a directory, generate filename
        const headResponse = await fetch(downloadUrl, {
          method: "HEAD",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        }).catch(() => null);

        const contentType = headResponse?.headers.get("content-type") || "";
        const extension = download.guessFileExtension(downloadUrl, contentType);
        const filename = `extension-${Date.now()}${extension}`;
        outputPath = path.join(config.output, filename);
      } else if (config.output.endsWith("/") || config.output.endsWith("\\")) {
        // Treat as directory path
        await fs.mkdir(config.output, { recursive: true });
        const headResponse = await fetch(downloadUrl, {
          method: "HEAD",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        }).catch(() => null);

        const contentType = headResponse?.headers.get("content-type") || "";
        const extension = download.guessFileExtension(downloadUrl, contentType);
        const filename = `extension-${Date.now()}${extension}`;
        outputPath = path.join(config.output, filename);
      } else {
        // Treat as full file path
        outputPath = path.resolve(config.output);
      }
    } else {
      // No output specified, use current working directory
      const headResponse = await fetch(downloadUrl, {
        method: "HEAD",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }).catch(() => null);

      const contentType = headResponse?.headers.get("content-type") || "";
      const extension = download.guessFileExtension(downloadUrl, contentType);
      const filename = `extension-${Date.now()}${extension}`;
      outputPath = path.join(process.cwd(), filename);
    }

    debug("Output path determined: %s", outputPath);

    // Overwrite Check
    await checkOutputFile(outputPath, config.force);

    // File Download
    spinner.stop();
    const downloadedFilePath = await download.downloadFile(
      downloadUrl,
      outputPath
    );

    // Completion
    console.log(chalk.green("Download complete!"));
    console.log(chalk.blue("📄 Downloaded:"), outputPath);

    const stats = await fs.stat(outputPath);
    console.log(chalk.blue("📊 Size:"), humanFileSize(stats.size, true));

    let extractedDirPath = null;
    if (config.extract) {
      spinner.start("Extracting extension...");

      const { tmpPath, cleanupCallback } = await createTempDirectory(
        config.tempDir
      );
      tempCleanup = cleanupCallback;

      const unpackedDir = await unpack.unpack(
        downloadedFilePath,
        path.join(tmpPath, "unpacked")
      );
      debug("Unpacked to: %s", unpackedDir);

      spinner.text = "Reading manifest...";
      const manifestPath = path.join(unpackedDir, "manifest.json");
      const { parseManifest } = require("../manifestParser");

      const manifestResult = await parseManifest(manifestPath, config.locale);
      if (!manifestResult || !manifestResult.parsedManifest) {
        throw new Error(
          "Failed to parse manifest.json from the downloaded archive."
        );
      }
      const { parsedManifest } = manifestResult;
      const version = parsedManifest.version || "1.0.0";

      spinner.succeed(`Read manifest for: ${parsedManifest.name} v${version}`);
      spinner.start("Preparing final directory...");

      const cleanName = (parsedManifest.name || "unnamed-extension")
        .replace(/[^a-z0-9._-]+/gi, "-")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();

      const finalDirName = `${cleanName}-${version}`;
      extractedDirPath = path.join(
        path.dirname(downloadedFilePath),
        finalDirName
      );
      debug("Final extraction path: %s", extractedDirPath);

      await checkOutputFile(extractedDirPath, config.force, true);
      await fs.rename(unpackedDir, extractedDirPath);

      spinner.succeed(chalk.green("Extraction complete!"));
      console.log(chalk.blue("📂 Extracted to:"), extractedDirPath);
    }

    return {
      success: true,
      outputFile: outputPath,
      extractedPath: extractedDirPath,
    };
  } catch (error) {
    spinner.fail(chalk.red("Download failed"));
    debug("Download error: %o", error);
    throw error;
  } finally {
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
    }
  }
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
      const download = require("./download");
      spinner.stop();
      // spinner.text = "Downloading extension...";
      const downloadPath = path.join(tmpPath, "download");
      downloadedFile = await download.downloadExtension(
        sourceInfo,
        downloadPath
      );

      debug("Downloaded file: %s", downloadedFile);
      spinner.start("Extracting downloaded archive...");

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

    const locale = await getLocale(manifest, manifestPath, config.locale);
    // Generate output path
    const localizedName = getLocalizedName(manifest, locale);
    const outputPath = await generateOutputPath(
      config,
      manifest,
      localizedName
    );
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
      locale: config.locale,
      ignoredAssets: config.ignoreAssets,
    };

    const result = await convertExtension(convertConfig);
    debug("Conversion result: %o", result);

    // Minify if requested
    if (config.minify) {
      spinner.text = "Minifying output...";
      await minify.minifyScript(outputPath);
      debug("Minification complete");
    } else if (config.beautify) {
      spinner.text = "Beautifying output...";
      await minify.beautifyScript(outputPath);
      debug("Beautification complete");
    }

    spinner.succeed(chalk.green(`Conversion complete!`));

    // Display results
    const stats = await fs.stat(outputPath);

    console.log(
      chalk.blue("📦 Extension:"),
      chalk.bold(result.extension.name || "Unknown")
    );
    console.log(
      chalk.blue("📋 Version:"),
      result.extension.version || "Unknown"
    );
    if (result.extension.description) {
      console.log(chalk.blue("📝 Description:"), result.extension.description);
    }
    console.log(chalk.blue("🎯 Target:"), config.target);
    if (config.locale) {
      console.log(chalk.blue("🌐 Locale:"), config.locale);
    }
    console.log(chalk.blue("📄 Output:"), outputPath);
    console.log(chalk.blue("📊 Size:"), humanFileSize(stats.size, true));

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

module.exports = { run, runDownload };

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
function humanFileSize(bytes, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return `${bytes.toFixed(dp)} ${units[u]}`;
}
