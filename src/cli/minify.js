const fs = require("fs").promises;
const debug = require("debug")("to-userscript:cli:minify");

let terser = null;
try {
  terser = require("terser");
} catch (error) {
  debug("Terser not available, falling back to simple minification");
}

function simpleMinify(code) {
  debug("Applying simple minification fallback");

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

async function terserMinify(code) {
  if (!terser) {
    debug("Terser not available, using simple minification");
    return simpleMinify(code);
  }

  debug("Applying terser minification");

  try {
    const result = await terser.minify(code, {
      compress: {
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        keep_fargs: false,
        hoist_vars: false,
        if_return: true,
        join_vars: true,
        side_effects: false,
        warnings: false,
        global_defs: {},
      },
      mangle: {
        toplevel: false,
        keep_fnames: false,
        reserved: ["GM_", "GM", "unsafeWindow", "cloneInto", "exportFunction"],
      },
      format: {
        comments: function (node, comment) {
          // Keep @license, @preserve, and important comments
          const text = comment.value;
          return /@license|@preserve|@grant|@match|@include|@exclude|@name|@namespace|@version|@description|@author|@homepage|@homepageURL|@website|@source|@icon|@iconURL|@defaulticon|@icon64|@icon64URL|@run-at|@noframes|@unwrap|@connect|@require|@resource|@supportURL|@updateURL|@downloadURL|@contributionURL|@contributionAmount|@compatible|@incompatible/.test(
            text
          );
        },
        beautify: false,
        preamble: "",
      },
      sourceMap: false,
      toplevel: false,
      parse: {},
      rename: {},
    });

    if (result.error) {
      throw new Error(`Terser error: ${result.error}`);
    }

    return result.code;
  } catch (error) {
    debug(
      "Terser minification failed, falling back to simple: %s",
      error.message
    );
    return simpleMinify(code);
  }
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
    const minifiedCode = await terserMinify(scriptCode);
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
    const minifiedCode = await terserMinify(scriptCode);
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
  terserMinify,
};
