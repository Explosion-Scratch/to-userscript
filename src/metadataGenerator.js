const fs = require("fs");
const path = require("path");
const { getIcon } = require("./getIcon");

function generateMetadata(
  parsedManifest,
  requiredGmGrants = [],
  extensionRoot = null,
) {
  const { name, version, description, content_scripts } = parsedManifest;

  const lines = ["// ==UserScript=="];
  lines.push(`// @name        ${name || "Converted Extension"}`);
  lines.push(`// @version     ${version || "1.0.0"}`);
  if (description) {
    lines.push(`// @description ${description}`);
  }
  // Simple namespace generation, improve later
  lines.push(
    `// @namespace   ${name ? name.toLowerCase().replace(/\s+/g, "-") : "converted-extension"}-namespace`,
  );
  lines.push(`// @author      Converter Script`); // Placeholder
  lines.push(
    `// @require      data:text/plain;base64,d2luZG93LnRydXN0ZWRUeXBlcy5jcmVhdGVQb2xpY3koJ2RlZmF1bHQnLCB7IGNyZWF0ZUhUTUw6IHN0ciA9PiBzdHIsIGNyZWF0ZVNjcmlwdFVSTDogc3RyPT4gc3RyLCBjcmVhdGVTY3JpcHQ6IHN0cj0+IHN0ciB9KTs=`,
  );
  // Aggregate @match directives from all content scripts
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
    // Add a broad match if none specified, maybe too broad? Or require manual edit?
    console.warn(
      "No @match patterns found in manifest content_scripts. Adding '// @match *://*/*' as a fallback. Review this carefully!",
    );
    lines.push("// @match       *://*/*");
  } else {
    matches.forEach((match) => lines.push(`// @match       ${match}`));
  }

  // Add @grant directives
  if (requiredGmGrants.length > 0) {
    requiredGmGrants.forEach((grant) => lines.push(`// @grant       ${grant}`));
  } else {
    lines.push("// @grant       none"); // Explicitly state no grants if none needed
  }

  // Add other common directives (can be expanded later)
  // Handle icons (pick size closest to 48px)
  const iconDataUrl = getIcon(parsedManifest, extensionRoot);
  if (iconDataUrl) {
    lines.push(`// @icon        ${iconDataUrl}`);
  }

  // Determine the earliest run-at time required by any content script
  let earliestRunAt = "document-idle"; // Default to latest
  const runAtOrder = {
    "document-start": 1,
    "document-end": 2,
    "document-idle": 3,
  };

  if (content_scripts) {
    content_scripts.forEach((cs) => {
      // Note: Can be document-start or document_start formats
      const runAt = cs.run_at?.replaceAll("_", "-") || "document-idle"; // Default for individual script if missing
      if (runAtOrder[runAt] < runAtOrder[earliestRunAt]) {
        earliestRunAt = runAt;
      }
    });
  }
  lines.push(`// @run-at      ${earliestRunAt}`);

  lines.push("// ==/UserScript==");
  lines.push(""); // Add a blank line after the block

  return lines.join("\n");
}

module.exports = { generateMetadata };
