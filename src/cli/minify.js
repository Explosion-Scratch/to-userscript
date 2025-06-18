const fs = require("fs").promises;
const debug = require("debug")("to-userscript:cli:minify");

let terser = null;
try {
  terser = require("terser");
} catch (error) {
  debug("Terser not available, falling back to simple minification");
}

let prettier = null;
try {
  prettier = require("prettier");
} catch (error) {
  debug("Prettier not available, beautify functionality will be limited.");
}

async function terserMinify(code) {
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
    return code;
  }
}

async function prettierBeautify(code) {
  debug("Applying prettier beautification");

  if (!prettier) {
    debug("Prettier is not available, skipping beautification.");
    return code;
  }

  try {
    const result = await prettier.format(code, {
      parser: "babel",
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      semi: true,
      singleQuote: false,
      quoteProps: "as-needed",
      jsxSingleQuote: false,
      trailingComma: "es5",
      bracketSpacing: true,
      jsxBracketSameLine: false,
      arrowParens: "always",
      requirePragma: false,
      insertPragma: false,
      proseWrap: "preserve",
      htmlWhitespaceSensitivity: "css",
      vueIndentScriptAndStyle: false,
      endOfLine: "lf",
      embeddedLanguageFormatting: "auto",
    });
    return result;
  } catch (error) {
    debug(
      "Prettier beautification failed, falling back to original code: %s",
      error.message
    );
    return code;
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

async function beautifyScript(filePath) {
  debug("Starting beautification of: %s", filePath);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    debug("Original file size: %d bytes", content.length);

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

    const beautifiedCode = await prettierBeautify(scriptCode);
    debug("Beautified code size: %d bytes", beautifiedCode.length);

    const finalContent = metadataBlock
      ? `${metadataBlock}\n\n${beautifiedCode}`
      : beautifiedCode;

    await fs.writeFile(filePath, finalContent, "utf-8");

    const expansion = finalContent.length - content.length;
    const expansionPercent = Math.round((expansion / content.length) * 100);

    debug(
      "Beautification complete: %d bytes -> %d bytes (+%d bytes, +%d%%)",
      content.length,
      finalContent.length,
      expansion,
      expansionPercent
    );

    return {
      originalSize: content.length,
      beautifiedSize: finalContent.length,
      expansion,
      expansionPercent,
    };
  } catch (error) {
    const errorMsg = `Failed to beautify script ${filePath}: ${error.message}`;
    debug("Beautification error: %s", errorMsg);
    throw new Error(errorMsg);
  }
}

module.exports = {
  minifyScript,
  beautifyScript,
};
