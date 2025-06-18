const fs = require("fs").promises;
const path = require("path");
const { normalizePath } = require("../utils");

/**
 * Generates a metadata block with a @require directive pointing to the specified userscript file
 * @param {string} filePath - Path to the .user.js file to reference
 * @returns {Promise<string>} The complete metadata block with @require directive
 */
async function generateRequireBlock(filePath) {
  // File Validation
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      throw new Error(`Path exists but is not a file: ${filePath}`);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`File not found: ${filePath}`);
    }
    throw new Error(`File validation failed: ${error.message}`);
  }

  // File Reading
  const content = await fs.readFile(filePath, "utf-8");

  // Metadata Extraction
  const metadataMatch = content.match(
    /(^\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==)/m
  );

  if (!metadataMatch) {
    throw new Error(`No UserScript metadata block found in: ${filePath}`);
  }

  const existingBlock = metadataMatch[1];

  // Metadata Parsing and Filtering
  const lines = existingBlock.split("\n");
  const filteredLines = lines.filter((line) => {
    // Remove existing @require directives
    return !/\/\/\s*@require\s+/.test(line);
  });

  // Path Resolution
  const absolutePath = path.resolve(filePath);
  const normalizedAbsolutePath = normalizePath(absolutePath);

  // New Block Assembly
  const newRequireDirective = `// @require      file://${normalizedAbsolutePath}`;

  // Find the position to insert the new @require (after the opening tag but before the closing tag)
  const openingIndex = filteredLines.findIndex((line) =>
    /\/\/\s*==UserScript==/.test(line)
  );
  const closingIndex = filteredLines.findIndex((line) =>
    /\/\/\s*==\/UserScript==/.test(line)
  );

  if (openingIndex === -1 || closingIndex === -1) {
    throw new Error(
      `Invalid UserScript metadata block structure in: ${filePath}`
    );
  }

  // Insert the new @require directive before the closing tag
  const finalLines = [
    ...filteredLines.slice(0, closingIndex),
    newRequireDirective,
    ...filteredLines.slice(closingIndex),
  ];

  return finalLines.join("\n") + "\n";
}

module.exports = { generateRequireBlock };
