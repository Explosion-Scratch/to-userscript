const fs = require("fs");
const path = require("path");
const debug = require("debug")("to-userscript:metadata");
const { getIcon } = require("./getIcon");
const { minify_sync } = require("terser");

function generateMetadata(
  parsedManifest,
  requiredGmGrants = [],
  extensionRoot = null,
) {
  const { name, version, description, content_scripts, _id } = parsedManifest;

  const lines = ["// ==UserScript=="];
  lines.push(`// @name        ${name || "Converted Extension"}`);
  lines.push(`// @version     ${version || "1.0.0"}`);
  if (description) {
    lines.push(`// @description ${description}`);
  }
  // Simple namespace generation, improve later
  lines.push(`// @namespace   ${_id}`);
  lines.push(`// @author      Converter Script`); // Placeholder

  const matches = new Set();
  const MATCH_REPLACEMENTS = {
    "<all_urls>": "*://*/*",
  };
  if (content_scripts) {
    content_scripts.forEach((cs) => {
      if (cs.matches) {
        cs.matches.forEach((match) =>
          matches.add(MATCH_REPLACEMENTS[match] || match),
        );
      }
    });
  }
  if (matches.size === 0) {
    debug(
      "No @match patterns found in manifest content_scripts. Adding '// @match *://*/*' as a fallback.",
    );
    lines.push("// @match       *://*/*");
  } else {
    matches.forEach((match) => lines.push(`// @match       ${match}`));
  }

  if (requiredGmGrants.length > 0) {
    requiredGmGrants.forEach((grant) => lines.push(`// @grant       ${grant}`));
  } else {
    lines.push("// @grant       none");
  }

  const iconDataUrl = getIcon(parsedManifest, extensionRoot);
  if (iconDataUrl) {
    lines.push(`// @icon        ${iconDataUrl}`);
  }

  let earliestRunAt = "document-idle";
  const runAtOrder = {
    "document-start": 1,
    "document-end": 2,
    "document-idle": 3,
  };

  if (content_scripts) {
    content_scripts.forEach((cs) => {
      // Note: Can be document-start or document_start formats
      const runAt = cs.run_at?.replaceAll("_", "-") || "document-idle";
      if (runAtOrder[runAt] < runAtOrder[earliestRunAt]) {
        earliestRunAt = runAt;
      }
    });
  }
  lines.push(`// @run-at      ${earliestRunAt}`);
  lines.push("// ==/UserScript==");
  lines.push("");
  lines.push(
    minify_sync(
      fs.readFileSync(
        path.resolve(__dirname, "templates", "trustedTypes.template.js"),
        "utf-8",
      ),
      {
        compress: true,
        mangle: {
          toplevel: true,
        },
      },
    ).code,
  );
  lines.push("");

  return lines.join("\n");
}

module.exports = { generateMetadata };
