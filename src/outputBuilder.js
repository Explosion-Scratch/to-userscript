const {
  normalizePath,
  convertMatchPatternToRegExp,
  convertMatchPatternToRegExpString,
} = require("./utils");
const templateManager = require("./templateManager");
const scriptAssembler = require("./scriptAssembler");
const { generateBuildPolyfillString } = require("./buildPolyfillString");
const { getIcon } = require("./getIcon");
const { AssetGenerator } = require("./assetsGenerator");

/**
 * Prepares CSS data for injection into the template.
 * @param {object} cssContents - Object mapping relative CSS paths to their content.
 * @returns {string} A string representation of the CSS data object for template injection.
 */
function prepareCssDataString(cssContents) {
  const extensionCss = {};
  for (const [relativePath, content] of Object.entries(cssContents)) {
    // Use normalized path and escape content for JSON embedding
    extensionCss[normalizePath(relativePath)] = JSON.stringify(content);
  }
  // Format as key: value pairs for embedding in the template object literal
  // IMPORTANT OTHERWISE IT GETS DOUBLE ESCAPED
  return `{` + Object.entries(extensionCss)
    .map(([key, cssStr]) => `    "${key}": ${cssStr}`)
    .join(",\n") + `}`;
}

/**
 * Processes manifest content scripts to structure JS and CSS data by run_at timing.
 * @param {object} parsedManifest - The parsed manifest object.
 * @param {object} jsContents - Object mapping relative JS paths to their content.
 * @param {object} cssContents - Object mapping relative CSS paths to their content.
 * @returns {{scriptsToRun: object, cssToInject: object}} - Objects mapping run_at times to JS/CSS data.
 */
function structureScriptsAndCssByRunAt(
  parsedManifest,
  jsContents,
  cssContents,
) {
  const scriptsToRun = {
    "document-start": [],
    "document-end": [],
    "document-idle": [],
  };
  const cssToInject = {
    "document-start": [],
    "document-end": [],
    "document-idle": [],
  };
  // Use Sets to track added paths *per run_at phase* to avoid duplicates if a script/style
  // is listed in multiple content_script blocks with the same run_at.
  const processedJsPaths = new Set(); // Stores "path@runAt"
  const processedCssPaths = new Set(); // Stores "path@runAt"

  (parsedManifest.content_scripts || []).forEach((config) => {
    const runAt = config.run_at?.replaceAll("_", "-") || "document-idle";
    const validRunAt = [
      "document-start",
      "document-end",
      "document-idle",
    ].includes(runAt)
      ? runAt
      : "document-idle";

    // Add JS
    if (config.js) {
      config.js.forEach((jsPath) => {
        const normalizedPath = normalizePath(jsPath);
        const processKey = `${normalizedPath}@${validRunAt}`;
        if (jsContents[normalizedPath] && !processedJsPaths.has(processKey)) {
          scriptsToRun[validRunAt].push({
            path: normalizedPath,
            content: jsContents[normalizedPath],
          });
          processedJsPaths.add(processKey);
        }
      });
    }
    // Add CSS
    if (config.css) {
      config.css.forEach((cssPath) => {
        const normalizedPath = normalizePath(cssPath);
        const processKey = `${normalizedPath}@${validRunAt}`;
        if (cssContents[normalizedPath] && !processedCssPaths.has(processKey)) {
          cssToInject[validRunAt].push(normalizedPath); // Only need the path for CSS injection lookup
          processedCssPaths.add(processKey);
        }
      });
    }
  });

  return { scriptsToRun, cssToInject };
}

// Helper to build background execution snippet
function buildBackgroundExecutionString(backgroundJsContents = {}, scriptName) {
  const bgPaths = Object.keys(backgroundJsContents);
  if (bgPaths.length === 0) return "";
  const sanitizedScripts = bgPaths.map((p) => ({
    path: normalizePath(p),
    content: backgroundJsContents[p],
  }));
  const getContent = (str) => str.trim().replace(/^['"]use strict['"];?/, "");
  return `// --- Background Scripts Auto-Execution ---
(function(){
  const scriptName = ${JSON.stringify(scriptName)};
  console.log('[' + scriptName + '] Executing background scripts...');
  
  // Initialize background context with polyfill
  const backgroundPolyfill = buildPolyfill({ isBackground: true });
  
  // Execute background scripts in the polyfilled environment
  with(backgroundPolyfill){
${sanitizedScripts.map((s) => `    // BG: ${s.path}\n${getContent(s.content)}`).join("\n\n")}
  }
  
  console.log('[' + scriptName + '] Background scripts execution complete.');
})();
`;
}

/**
 * Asynchronously builds the final userscript content using templates and processed data.
 */
async function buildUserScript({
  metadataBlock,
  jsContents, // { 'path/to/script.js': 'content...' }
  cssContents, // { 'path/to/style.css': 'content...' }
  parsedManifest, // The parsed manifest object
  backgroundJsContents = {}, // background scripts map
  extensionRoot = null,
  locale,
}) {
  // 1. Generate unified assets map using AssetGenerator
  console.log("Generating unified assets map...");
  const assetGenerator = new AssetGenerator(extensionRoot, locale);
  const { assetsMap, optionsPagePath, popupPagePath } =
    await assetGenerator.generateAssetsMap(parsedManifest);

  // 2. Prepare data for template injection
  const extensionCssString = prepareCssDataString(cssContents);

  // Extract minimal config needed for initial matching check in the template
  const contentScriptConfigsForMatching = (
    parsedManifest.content_scripts || []
  ).map((cs) => ({
    matches: cs.matches || [],
    // No need for js, css, run_at here, only matching patterns
  }));
  const contentScriptConfigsForMatchingString = JSON.stringify(
    contentScriptConfigsForMatching,
    null,
    2,
  );

  // Stringify the manifest for the getManifest() polyfill
  const injectedManifestString = JSON.stringify(parsedManifest);

  // 3. Structure JS/CSS by run_at for the execution logic generator
  const { scriptsToRun, cssToInject } = structureScriptsAndCssByRunAt(
    parsedManifest,
    jsContents,
    cssContents,
  );

  // 4. Prepare background execution string (if any)
  const scriptName = parsedManifest.name || "Converted Script";
  const backgroundExecutionString = buildBackgroundExecutionString(
    backgroundJsContents,
    scriptName,
  );

  // 5. Generate the combined execution function string
  const combinedExecutionLogicString =
    scriptAssembler.generateCombinedExecutionLogic(
      scriptsToRun,
      cssToInject,
      scriptName,
    );

  // 6. Generate the unified polyfill string with the generated assets map
  const polyfillString = await generateBuildPolyfillString(
    "userscript",
    assetsMap,
    parsedManifest,
  );
  const optionsPolyfillString = await generateBuildPolyfillString(
    "postmessage",
    assetsMap,
    parsedManifest,
  );

  // 7. Get extension icon (size closest to 48px)
  const extensionIcon = extensionRoot
    ? getIcon(parsedManifest, extensionRoot)
    : null;

  // 8. Read the Orchestration Template
  const orchestrationTemplate =
    await templateManager.getOrchestrationTemplate();

  // 9. Perform Replacements in the Orchestration Template
  const replacements = {
    "{{SCRIPT_NAME}}": JSON.stringify(scriptName),
    "{{INJECTED_MANIFEST}}": injectedManifestString,
    // Provide minimal configs just for the initial URL match check
    "{{CONTENT_SCRIPT_CONFIGS_FOR_MATCHING_ONLY}}":
      contentScriptConfigsForMatchingString,
    "{{EXTENSION_CSS_DATA}}": extensionCssString, // Pass the actual CSS data object literal
    "{{CONVERT_MATCH_PATTERN_FUNCTION_STRING}}":
      convertMatchPatternToRegExpString.toString(), // Inject the utility function's source code
    "{{CONVERT_MATCH_PATTERN_TO_REGEXP_FUNCTION}}":
      convertMatchPatternToRegExp.toString(), // Inject the utility function's source code
    "{{COMBINED_EXECUTION_LOGIC}}": combinedExecutionLogicString, // Inject the generated function
    "{{OPTIONS_PAGE_PATH}}": optionsPagePath
      ? JSON.stringify(optionsPagePath)
      : "null",
    "{{POPUP_PAGE_PATH}}": popupPagePath
      ? JSON.stringify(popupPagePath)
      : "null",
    "{{EXTENSION_ICON}}": extensionIcon
      ? JSON.stringify(extensionIcon)
      : "null",
    "{{UNIFIED_POLYFILL_FOR_IFRAME}}": JSON.stringify(optionsPolyfillString),
    "{{LOCALE}}": JSON.stringify(locale?.__data || {}),
  };

  let orchestrationLogic = orchestrationTemplate;
  for (const [placeholder, value] of Object.entries(replacements)) {
    // Use a robust regex for replacement
    const regex = new RegExp(
      placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
      "g",
    );
    // Ensure $ signs in the replacement value are properly escaped
    const safeValue =
      typeof value === "string" ? value.replace(/\$/g, "$$$$") : value;
    orchestrationLogic = orchestrationLogic.replace(regex, safeValue);
  }

  // 10. Assemble the final script using the unified polyfill
  const finalScript = [
    metadataBlock, // Generated by metadataGenerator
    "(function() {",
    "    // --- Unified Polyfill (Message Bus + Abstraction Layer + Assets + buildPolyfill) ---",
    polyfillString, // Complete polyfill environment
    backgroundExecutionString, // Auto-executed background scripts (may be empty)
    "",
    "    // --- Orchestration Logic & Combined Execution ---",
    orchestrationLogic, // Processed orchestration template
    "",
    "})(); // End of IIFE",
  ].join("\n");

  return finalScript;
}

module.exports = { buildUserScript };
