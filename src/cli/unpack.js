const fs = require("fs").promises;
const path = require("path");
const yauzl = require("yauzl");
const debug = require("debug")("to-userscript:unpacker");

async function detectArchiveType(archivePath) {
  debug("Detecting archive type for: %s", archivePath);

  const ext = path.extname(archivePath).toLowerCase();
  if ([".zip", ".xpi"].includes(ext)) {
    return "zip";
  }

  if (ext === ".crx") {
    return "crx";
  }

  // Try to detect by reading file header
  try {
    const handle = await fs.open(archivePath, "r");
    const buffer = Buffer.alloc(8);
    await handle.read(buffer, 0, 8, 0);
    await handle.close();

    // Check for ZIP signature
    if (buffer[0] === 0x50 && buffer[1] === 0x4b) {
      debug("Detected ZIP signature");
      return "zip";
    }

    // Check for CRX signature
    if (
      buffer[0] === 0x43 &&
      buffer[1] === 0x72 &&
      buffer[2] === 0x32 &&
      buffer[3] === 0x34
    ) {
      debug("Detected CRX signature");
      return "crx";
    }
  } catch (error) {
    debug("Error reading file header: %s", error.message);
  }

  // Default to zip if we can't determine
  debug("Defaulting to ZIP format");
  return "zip";
}

async function extractZip(archivePath, destinationDir) {
  debug("Extracting ZIP archive: %s -> %s", archivePath, destinationDir);

  return new Promise((resolve, reject) => {
    yauzl.open(archivePath, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        reject(new Error(`Failed to open ZIP file: ${err.message}`));
        return;
      }

      let extractedFiles = 0;

      zipfile.readEntry();

      zipfile.on("entry", async (entry) => {
        const entryPath = path.join(destinationDir, entry.fileName);

        // Security check: ensure the entry doesn't escape the destination directory
        const normalizedPath = path.normalize(entryPath);
        if (!normalizedPath.startsWith(path.normalize(destinationDir))) {
          debug("Skipping potentially dangerous path: %s", entry.fileName);
          zipfile.readEntry();
          return;
        }

        if (/\/$/.test(entry.fileName)) {
          // Directory entry
          try {
            await fs.mkdir(entryPath, { recursive: true });
            debug("Created directory: %s", entry.fileName);
          } catch (mkdirError) {
            debug(
              "Error creating directory %s: %s",
              entry.fileName,
              mkdirError.message
            );
          }
          zipfile.readEntry();
        } else {
          // File entry
          zipfile.openReadStream(entry, async (streamErr, readStream) => {
            if (streamErr) {
              debug(
                "Error opening read stream for %s: %s",
                entry.fileName,
                streamErr.message
              );
              zipfile.readEntry();
              return;
            }

            try {
              // Ensure parent directory exists
              await fs.mkdir(path.dirname(entryPath), { recursive: true });

              const writeStream = await fs.open(entryPath, "w");

              for await (const chunk of readStream) {
                await writeStream.write(chunk);
              }

              await writeStream.close();
              extractedFiles++;
              debug(
                "Extracted file: %s (%d bytes)",
                entry.fileName,
                entry.uncompressedSize
              );
            } catch (fileError) {
              debug(
                "Error extracting file %s: %s",
                entry.fileName,
                fileError.message
              );
            }

            zipfile.readEntry();
          });
        }
      });

      zipfile.on("end", () => {
        debug("ZIP extraction complete: %d files extracted", extractedFiles);
        resolve(destinationDir);
      });

      zipfile.on("error", (zipError) => {
        reject(new Error(`ZIP extraction failed: ${zipError.message}`));
      });
    });
  });
}

async function extractCrx(archivePath, destinationDir) {
  debug("Extracting CRX archive: %s -> %s", archivePath, destinationDir);

  // CRX files are ZIP files with a header
  // We need to skip the header and extract the ZIP portion

  const handle = await fs.open(archivePath, "r");

  try {
    // Read CRX header to determine ZIP offset
    const headerBuffer = Buffer.alloc(16);
    await handle.read(headerBuffer, 0, 16, 0);

    // CRX3 format: "Cr24" + version (4 bytes) + header_length (4 bytes) + header_content
    if (headerBuffer.toString("ascii", 0, 4) !== "Cr24") {
      throw new Error("Invalid CRX file: missing Cr24 signature");
    }

    const version = headerBuffer.readUInt32LE(4);
    debug("CRX version: %d", version);

    let zipOffset;

    if (version === 2) {
      // CRX2 format
      const publicKeyLength = headerBuffer.readUInt32LE(8);
      const signatureLength = headerBuffer.readUInt32LE(12);
      zipOffset = 16 + publicKeyLength + signatureLength;
    } else if (version === 3) {
      // CRX3 format
      const headerLength = headerBuffer.readUInt32LE(8);
      zipOffset = 12 + headerLength;
    } else {
      throw new Error(`Unsupported CRX version: ${version}`);
    }

    debug("ZIP data starts at offset: %d", zipOffset);

    // Create a temporary ZIP file with just the ZIP portion
    const tempZipPath = archivePath + ".zip";
    const stats = await fs.stat(archivePath);
    const zipSize = stats.size - zipOffset;

    debug("Creating temporary ZIP file: %s (%d bytes)", tempZipPath, zipSize);

    const tempZipHandle = await fs.open(tempZipPath, "w");

    try {
      // Copy ZIP portion to temporary file
      const buffer = Buffer.alloc(64 * 1024); // 64KB buffer
      let position = zipOffset;
      let remaining = zipSize;

      while (remaining > 0) {
        const chunkSize = Math.min(buffer.length, remaining);
        const { bytesRead } = await handle.read(buffer, 0, chunkSize, position);

        if (bytesRead === 0) break;

        await tempZipHandle.write(buffer, 0, bytesRead);
        position += bytesRead;
        remaining -= bytesRead;
      }
    } finally {
      await tempZipHandle.close();
    }

    // Extract the temporary ZIP file
    await extractZip(tempZipPath, destinationDir);

    // Clean up temporary file
    try {
      await fs.unlink(tempZipPath);
      debug("Cleaned up temporary ZIP file");
    } catch (cleanupError) {
      debug(
        "Warning: failed to clean up temporary file: %s",
        cleanupError.message
      );
    }

    return destinationDir;
  } finally {
    await handle.close();
  }
}

async function unpack(archivePath, destinationDir) {
  debug("Starting unpack: %s -> %s", archivePath, destinationDir);

  try {
    // Ensure destination directory exists
    await fs.mkdir(destinationDir, { recursive: true });

    // Detect archive type
    const archiveType = await detectArchiveType(archivePath);
    debug("Archive type detected: %s", archiveType);

    // Extract based on type
    let result;
    if (archiveType === "crx") {
      result = await extractCrx(archivePath, destinationDir);
    } else {
      result = await extractZip(archivePath, destinationDir);
    }

    // Verify manifest.json exists
    const manifestPath = path.join(destinationDir, "manifest.json");
    try {
      await fs.access(manifestPath);
      debug("Manifest verified at: %s", manifestPath);
    } catch (manifestError) {
      throw new Error(
        `No manifest.json found after extraction. This may not be a valid browser extension.`
      );
    }

    debug("Unpack completed successfully: %s", result);
    return result;
  } catch (error) {
    const errorMsg = `Failed to unpack archive ${archivePath}: ${error.message}`;
    debug("Unpack error: %s", errorMsg);
    throw new Error(errorMsg);
  }
}

module.exports = {
  unpack,
  detectArchiveType,
  extractZip,
  extractCrx,
};
