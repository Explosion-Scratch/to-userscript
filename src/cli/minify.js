const fs = require("fs").promises;
const debug = require("debug")("to-userscript:cli:minify");

// Note: Using a simple minifier since terser isn't in dependencies
// In a full implementation, you'd add terser to package.json and use it here

function simpleMinify(code) {
  debug("Applying simple minification");

  // This is a very basic minifier - in production you'd use terser
  return (
    code
      // Remove single-line comments (but preserve URLs and important comments)
      .replace(/\/\/(?![\/\s]*@|[\/\s]*http)[^\r\n]*/g, "")
      // Remove multi-line comments (but preserve license blocks and important comments)
      .replace(/\/\*(?![\s\S]*?@license|[\s\S]*?@preserve)[\s\S]*?\*\//g, "")
      // Remove excessive whitespace
      .replace(/\s+/g, " ")
      // Remove whitespace around operators
      .replace(/\s*([{}();,=+\-*\/&|!<>?:])\s*/g, "$1")
      // Remove trailing semicolons before closing braces
      .replace(/;(\s*})/g, "$1")
      // Remove leading/trailing whitespace
      .trim()
  );
}

async function minifyScript(filePath) {
  debug("Starting minification of: %s", filePath);

  try {
    // Read the script file
    const content = await fs.readFile(filePath, "utf-8");
    debug("Original file size: %d bytes", content.length);

    // Extract userscript metadata block
    const metadataMatch = content.match(
      /(^\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==)/m
    );

    let metadataBlock = "";
    let scriptCode = content;

    if (metadataMatch) {
      metadataBlock = metadataMatch[1];
      scriptCode = content.replace(metadataMatch[0], "").trim();
      debug("Extracted metadata block (%d bytes)", metadataBlock.length);
    } else {
      debug("No userscript metadata block found");
    }

    // Minify the script code (excluding metadata)
    const minifiedCode = simpleMinify(scriptCode);
    debug("Minified code size: %d bytes", minifiedCode.length);

    // Combine metadata and minified code
    const finalContent = metadataBlock
      ? `${metadataBlock}\n\n${minifiedCode}`
      : minifiedCode;

    // Write back to file
    await fs.writeFile(filePath, finalContent, "utf-8");

    const reduction = content.length - finalContent.length;
    const reductionPercent = Math.round((reduction / content.length) * 100);

    debug(
      "Minification complete: %d bytes -> %d bytes (-%d bytes, -%d%%)",
      content.length,
      finalContent.length,
      reduction,
      reductionPercent
    );

    return {
      originalSize: content.length,
      minifiedSize: finalContent.length,
      reduction,
      reductionPercent,
    };
  } catch (error) {
    const errorMsg = `Failed to minify script ${filePath}: ${error.message}`;
    debug("Minification error: %s", errorMsg);
    throw new Error(errorMsg);
  }
}

async function minifyScriptContent(content) {
  debug("Starting minification of content (%d bytes)", content.length);

  try {
    // Extract userscript metadata block
    const metadataMatch = content.match(
      /(^\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==)/m
    );

    let metadataBlock = "";
    let scriptCode = content;

    if (metadataMatch) {
      metadataBlock = metadataMatch[1];
      scriptCode = content.replace(metadataMatch[0], "").trim();
      debug("Extracted metadata block (%d bytes)", metadataBlock.length);
    }

    // Minify the script code
    const minifiedCode = simpleMinify(scriptCode);
    debug("Minified code size: %d bytes", minifiedCode.length);

    // Combine metadata and minified code
    const finalContent = metadataBlock
      ? `${metadataBlock}\n\n${minifiedCode}`
      : minifiedCode;

    const reduction = content.length - finalContent.length;
    const reductionPercent = Math.round((reduction / content.length) * 100);

    debug(
      "Content minification complete: %d bytes -> %d bytes (-%d bytes, -%d%%)",
      content.length,
      finalContent.length,
      reduction,
      reductionPercent
    );

    return {
      content: finalContent,
      originalSize: content.length,
      minifiedSize: finalContent.length,
      reduction,
      reductionPercent,
    };
  } catch (error) {
    const errorMsg = `Failed to minify script content: ${error.message}`;
    debug("Content minification error: %s", errorMsg);
    throw new Error(errorMsg);
  }
}

module.exports = {
  minifyScript,
  minifyScriptContent,
  simpleMinify,
};
