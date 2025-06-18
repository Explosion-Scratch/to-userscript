const fs = require("fs").promises;
const path = require("path");
const fetch = require("node-fetch");
const chalk = require("chalk");
const debug = require("debug")("to-userscript:downloader");
const { getCrxUrl } = require("./downloadExt");

async function getDownloadableUrl(sourceInfo) {
  debug("Getting downloadable URL for: %o", sourceInfo);

  switch (sourceInfo.type) {
    case "chrome-store":
      return getCrxUrl(sourceInfo.url);

    case "firefox-store":
      return getFirefoxAddonUrl(sourceInfo.url);

    case "url":
      return sourceInfo.url;

    default:
      throw new Error(
        `Unsupported source type for download: ${sourceInfo.type}`
      );
  }
}

async function getFirefoxAddonUrl(webstoreUrl) {
  debug("Extracting Firefox addon download URL from: %s", webstoreUrl);

  // Extract addon ID from Firefox addon URL
  const match = webstoreUrl.match(/\/addon\/([^\/]+)/);
  if (!match) {
    throw new Error("Invalid Firefox addon URL format");
  }

  const addonId = match[1];
  debug("Extracted addon ID: %s", addonId);

  // Firefox addon API endpoint for latest version
  // Note: This is a simplified approach. In production, you might want to:
  // 1. Use the AMO API to get addon details
  // 2. Parse the addon page HTML to find the download link
  // 3. Handle addon permissions and compatibility

  try {
    // Try to get addon details from AMO API
    const apiUrl = `https://addons.mozilla.org/api/v5/addons/addon/${addonId}/`;
    debug("Fetching addon details from API: %s", apiUrl);

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(
        `AMO API request failed: ${response.status} ${response.statusText}`
      );
    }

    const addonData = await response.json();
    debug(
      "Addon data received: %s v%s",
      addonData.name?.en || addonData.name,
      addonData.current_version?.version
    );

    if (!addonData.current_version?.file?.url) {
      throw new Error("No download URL found in addon data");
    }

    return addonData.current_version.file.url;
  } catch (error) {
    debug("AMO API failed, trying direct URL construction: %s", error.message);

    // Fallback: construct direct download URL
    // This might not always work, but it's worth trying
    const directUrl = `https://addons.mozilla.org/firefox/downloads/latest/${addonId}/addon-${addonId}-latest.xpi`;
    debug("Using direct download URL: %s", directUrl);

    return directUrl;
  }
}

const ProgressBar = require("cli-progress");

async function downloadFile(url, destinationPath) {
  debug("Downloading file from: %s", url);
  debug("Destination: %s", destinationPath);

  // Ensure destination directory exists
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Download failed: ${response.status} ${response.statusText} for ${url}`
    );
  }

  const contentLength = parseInt(
    response.headers.get("content-length") || "0",
    10
  );
  const contentType =
    response.headers.get("content-type") || "application/octet-stream";

  debug("Content-Length: %d bytes", contentLength);
  debug("Content-Type: %s", contentType);

  let progressBar = null;
  if (contentLength > 0) {
    progressBar = new ProgressBar.SingleBar({
      format: "Downloading [{bar}] {percentage}% | {value}/{total} bytes",
      barCompleteChar: "█",
      barIncompleteChar: "░",
      hideCursor: true,
    });
    progressBar.start(contentLength, 0);
  } else {
    console.log(chalk.yellow("Downloading... (size unknown)"));
  }

  const fileStream = await fs.open(destinationPath, "w");
  let downloadedBytes = 0;

  try {
    for await (const chunk of response.body) {
      await fileStream.write(chunk);
      downloadedBytes += chunk.length;

      if (contentLength > 0 && progressBar) {
        progressBar.update(downloadedBytes);
      }
    }

    if (progressBar) {
      progressBar.stop();
      console.log(chalk.green(`Downloaded ${downloadedBytes} bytes`));
    } else {
      console.log(chalk.green(`Downloaded ${downloadedBytes} bytes`));
    }
    debug(
      "Download completed: %d bytes written to %s",
      downloadedBytes,
      destinationPath
    );
  } finally {
    await fileStream.close();
  }

  // Verify the downloaded file exists and has content
  const stats = await fs.stat(destinationPath);
  if (stats.size === 0) {
    throw new Error("Downloaded file is empty");
  }

  debug("Download verification successful: %d bytes", stats.size);
  return destinationPath;
}

function guessFileExtension(url, contentType) {
  // Try to guess from URL first
  const urlExt = path.extname(new URL(url).pathname).toLowerCase();
  if ([".crx", ".xpi", ".zip"].includes(urlExt)) {
    return urlExt;
  }

  // Guess from content type
  if (contentType) {
    if (contentType.includes("chrome-extension")) {
      return ".crx";
    } else if (contentType.includes("application/zip")) {
      return ".zip";
    } else if (contentType.includes("application/x-xpinstall")) {
      return ".xpi";
    }
  }

  // Default to .zip as most archives can be handled as zip
  return ".zip";
}

async function downloadExtension(sourceInfo, downloadDir) {
  debug("Starting extension download: %o", sourceInfo);

  try {
    // Ensure download directory exists
    await fs.mkdir(downloadDir, { recursive: true });

    // Get the actual download URL
    const downloadUrl = await getDownloadableUrl(sourceInfo);
    debug("Download URL resolved: %s", downloadUrl);

    // Make a HEAD request to get content info
    const headResponse = await fetch(downloadUrl, {
      method: "HEAD",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!headResponse.ok) {
      debug(
        "HEAD request failed, proceeding with GET: %s %s",
        headResponse.status,
        headResponse.statusText
      );
    }

    const contentType = headResponse.headers.get("content-type") || "";
    const extension = guessFileExtension(downloadUrl, contentType);

    const filename = `extension-${Date.now()}${extension}`;
    const destinationPath = path.join(downloadDir, filename);

    debug("Will save as: %s", destinationPath);

    // Download the file
    await downloadFile(downloadUrl, destinationPath);

    return destinationPath;
  } catch (error) {
    const errorMsg = `Failed to download extension: ${error.message}`;
    debug("Download error: %s", errorMsg);
    throw new Error(errorMsg);
  }
}

module.exports = {
  downloadExtension,
  getDownloadableUrl,
  downloadFile,
  guessFileExtension,
};
