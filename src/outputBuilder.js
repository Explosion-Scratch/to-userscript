const {
  normalizePath,
  convertMatchPatternToRegExp,
  convertMatchPatternToRegExpString,
  replaceComments,
} = require("./utils");
const debug = require("debug")("to-userscript:output");
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
    extensionCss[normalizePath(relativePath)] = JSON.stringify(content);
  }
  // Format as key: value pairs for embedding in the template object literal
  // IMPORTANT OTHERWISE IT GETS DOUBLE ESCAPED
  return (
    `{` +
    Object.entries(extensionCss)
      .map(([key, cssStr]) => `    "${key}": ${cssStr}`)
      .join(",\n") +
    `}`
  );
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

    if (config.css) {
      config.css.forEach((cssPath) => {
        const normalizedPath = normalizePath(cssPath);
        const processKey = `${normalizedPath}@${validRunAt}`;
        if (cssContents[normalizedPath] && !processedCssPaths.has(processKey)) {
          cssToInject[validRunAt].push(normalizedPath);
          processedCssPaths.add(processKey);
        }
      });
    }
  });

  return { scriptsToRun, cssToInject };
}

function buildBackgroundExecutionString(backgroundJsContents = {}, scriptName) {
  const bgPaths = Object.keys(backgroundJsContents);
  if (bgPaths.length === 0) return "";
  const sanitizedScripts = bgPaths.map((p) => ({
    path: normalizePath(p),
    content: backgroundJsContents[p],
  }));
  const getContent = (str) => str.trim().replace(/^['"]use strict['"];?/, "");
  return `
const START_BACKGROUND_SCRIPT = (function(){
  const backgroundPolyfill = buildPolyfill({ isBackground: true });
  const scriptName = ${JSON.stringify(scriptName)};
  const debug = ${JSON.stringify(`[${scriptName}]`)};
  _log(debug + ' Executing background scripts...');

  function executeBackgroundScripts(){
    with(backgroundPolyfill){
  ${sanitizedScripts
    .map((s) => `    // BG: ${s.path}\n${getContent(s.content)}`)
    .join("\n\n")}
    }
  }

  executeBackgroundScripts.call(backgroundPolyfill);

  _log(debug + ' Background scripts execution complete.');
});

setTimeout(() => {
  // Wait for things to be defined
  START_BACKGROUND_SCRIPT();
}, 10);
_log("START_BACKGROUND_SCRIPT", START_BACKGROUND_SCRIPT);
// End background script environment
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
  target = "userscript", // Build target
  ignoredAssets = null, // Ignored asset extensions
}) {
  debug("Generating unified assets map...");
  const assetGenerator = new AssetGenerator(
    extensionRoot,
    locale,
    ignoredAssets,
  );
  const { assetsMap, optionsPagePath, popupPagePath } =
    await assetGenerator.generateAssetsMap(parsedManifest);

  const extensionCssString = prepareCssDataString(cssContents);

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

  const injectedManifestString = JSON.stringify(parsedManifest);

  const { scriptsToRun, cssToInject } = structureScriptsAndCssByRunAt(
    parsedManifest,
    jsContents,
    cssContents,
  );

  const scriptName = parsedManifest.name || "Converted Script";
  const backgroundExecutionString = buildBackgroundExecutionString(
    backgroundJsContents,
    scriptName,
  );

  const combinedExecutionLogicString =
    scriptAssembler.generateCombinedExecutionLogic(
      scriptsToRun,
      cssToInject,
      scriptName,
    );

  const polyfillString = await generateBuildPolyfillString(
    target,
    assetsMap,
    parsedManifest,
  );
  const optionsPolyfillString = await generateBuildPolyfillString(
    "postmessage",
    assetsMap,
    parsedManifest,
  );

  const extensionIcon = extensionRoot
    ? getIcon(parsedManifest, extensionRoot)
    : null;

  const orchestrationTemplate =
    await templateManager.getOrchestrationTemplate();

  const VERBOSE = false;
  const loggingString = VERBOSE
    ? `
  const SCRIPT_NAME = ${JSON.stringify(scriptName)};
  let lastTime = performance.now();
  const __timeWrap = (func) => (...args) => {
    const now = performance.now();
    if (now - lastTime > 100){
      lastTime = performance.now();
    }
    func(...args);
    console.log(\`\${now - lastTime}ms\`);
    lastTime = performance.now();
    return func(...args);
  };
  const _log = __timeWrap((...args) => console.log(\`[\${typeof SCRIPT_NAME === 'string' ? SCRIPT_NAME : '[USERSCRIPT_CONVERTED]'}]\`, ...args));
  const _warn = __timeWrap((...args) => console.warn(\`[\${typeof SCRIPT_NAME === 'string' ? SCRIPT_NAME : '[USERSCRIPT_CONVERTED]'}]\`, ...args));
  const _error = __timeWrap((...args) => console.error(\`[\${typeof SCRIPT_NAME === 'string' ? SCRIPT_NAME : '[USERSCRIPT_CONVERTED]'}]\`, ...args));
  `
    : `
  const SCRIPT_NAME = ${JSON.stringify(scriptName)};
  const _log = (...args) => {};
  const _warn = (...args) => console.warn(\`[\${typeof SCRIPT_NAME === 'string' ? SCRIPT_NAME : '[USERSCRIPT_CONVERTED]'}]\`, ...args);
  const _error = (...args) => {
    let e = args[0];
    console.error(\`[\${typeof SCRIPT_NAME === 'string' ? SCRIPT_NAME : '[USERSCRIPT_CONVERTED]'}]\`, ...args);
  }
  `;
  const replacements = {
    "{{SCRIPT_NAME}}": JSON.stringify(scriptName),
    "{{INJECTED_MANIFEST}}": injectedManifestString,
    "{{CONTENT_SCRIPT_CONFIGS_FOR_MATCHING_ONLY}}":
      contentScriptConfigsForMatchingString,
    "{{EXTENSION_CSS_DATA}}": extensionCssString, // Pass the actual CSS data object literal
    "{{CONVERT_MATCH_PATTERN_FUNCTION_STRING}}":
      convertMatchPatternToRegExpString.toString(),
    "{{CONVERT_MATCH_PATTERN_TO_REGEXP_FUNCTION}}":
      convertMatchPatternToRegExp.toString(),
    "{{COMBINED_EXECUTION_LOGIC}}": combinedExecutionLogicString,
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
    "{{USED_LOCALE}}": JSON.stringify(locale?.__locale || "en"),
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

  let finalScript = [
    metadataBlock,
    "(function() {",
    "    // - Logging",
    loggingString,
    "    // - Unified Polyfill",
    polyfillString,
    "   // - Background Script Environment",
    backgroundExecutionString,
    "",
    "    // - Orchestration Logic",
    orchestrationLogic,
    "",
    "})();",
  ].join("\n");

  finalScript = replaceComments(finalScript);

  return finalScript;
}

module.exports = { buildUserScript };
