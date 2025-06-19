/**
 * Generates the string for the `executeAllScripts` function, which handles
 * CSS injection and JS execution based on run_at timing.
 *
 * @param {object} scriptsToRun - Object mapping run_at times to arrays of { path, content }.
 * @param {object} cssToInject - Object mapping run_at times to arrays of CSS file paths.
 * @param {string} scriptName - The name of the script for logging purposes.
 * @returns {string} A string containing the JavaScript function definition.
 */
function generateCombinedExecutionLogic(scriptsToRun, cssToInject, scriptName) {
  // Helper to generate CSS injection code for a given run_at phase
  const generateCssInjection = (runAtKey, phaseName) => {
    return (cssToInject[runAtKey] || [])
      .map(
        (cssPath, idx) => `
        const cssKey_${idx} = ${JSON.stringify(cssPath)};
    try {
      if (extensionCssData[cssKey_${idx}]) {
        _log(\`  Injecting CSS (${phaseName}): \${cssKey_${idx}}\`);
        const style = document.createElement('style');
        style.textContent = extensionCssData[cssKey_${idx}];
        (document.head || document.documentElement).appendChild(style);
      } else { console.warn(\`  CSS not found (${phaseName}): \${cssKey_${idx}}\`); }
    } catch(e) { _error(\`  Failed injecting CSS (\${cssKey_${idx}}) in phase ${phaseName}\`, e, extensionCssData); }
  `
      )
      .join("\n");
  };

  // Helper to generate JS execution code for a given run_at phase
  const generateJsExecution = (runAtKey, phaseName) => {
    const allScripts = scriptsToRun[runAtKey] || [];

    const getContent = (content) =>
      content.trim().replace(/^['"]use strict['"];?/, "");
    return `const scriptPaths = ${JSON.stringify(
      allScripts.map((script) => script.path)
    )};
   _log(\`  Executing JS (${phaseName}): \${scriptPaths}\`);

   try {
       // Keep variables from being redeclared for global scope, but also make them apply to global scope. (Theoretically)
      with (globalThis){;\n${allScripts
        .map(
          (script) =>
            `// START: ${script.path}\n${getContent(script.content)}\n// END: ${
              script.path
            }`
        )
        .join("\n\n")}\n;}
   } catch(e) { _error(\`  Error executing scripts \${scriptPaths}\`, e); }
  `;
  };

  const functionString = `
  // -- Script Execution Logic
async function executeAllScripts(globalThis, extensionCssData) {
  const {chrome, browser, global, window, self} = globalThis;
  const scriptName = ${JSON.stringify(scriptName)};
  _log(\`Starting execution phases...\`);

  // --- Document Start
  if (typeof document !== 'undefined') {
    _log(\`Executing document-start phase...\`);
    ${generateCssInjection("document-start", "start")}
    ${generateJsExecution("document-start", "start")}
  } else {
      _log(\`Skipping document-start phase (no document).\`);
  }

  
  // --- Wait for Document End (DOMContentLoaded) ---
  if (typeof document !== 'undefined' && document.readyState === 'loading') {
    _log(\`Waiting for DOMContentLoaded...\`);
    await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve, { once: true }));
    _log(\`DOMContentLoaded fired.\`);
  } else if (typeof document !== 'undefined') {
    _log(\`DOMContentLoaded already passed or not applicable.\`);
  }
  

  // --- Document End
   if (typeof document !== 'undefined') {
    _log(\`Executing document-end phase...\`);
    ${generateCssInjection("document-end", "end")}
    ${generateJsExecution("document-end", "end")}
  } else {
      _log(\`Skipping document-end phase (no document).\`);
  }

  
  // --- Wait for Document Idle
  _log(\`Waiting for document idle state...\`);
  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
      await new Promise(resolve => window.requestIdleCallback(resolve, { timeout: 2000 })); // 2-second timeout fallback
      _log(\`requestIdleCallback fired or timed out.\`);
  } else {
      // Fallback: wait a short period after DOMContentLoaded/current execution if requestIdleCallback is unavailable
      await new Promise(resolve => setTimeout(resolve, 50));
      _log(\`Idle fallback timer completed.\`);
  }
  

  // --- Document Idle
   if (typeof document !== 'undefined') {
    _log(\`Executing document-idle phase...\`);
    ${generateCssInjection("document-idle", "idle")}
    ${generateJsExecution("document-idle", "idle")}
  } else {
      _log(\`Skipping document-idle phase (no document).\`);
  }

  _log(\`All execution phases complete, re-firing load events.\`);
  document.dispatchEvent(new Event("DOMContentLoaded", {
    bubbles: true,
    cancelable: true
  }));
}`;

  return functionString;
}

module.exports = { generateCombinedExecutionLogic };
