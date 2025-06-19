const path = require("path");
const debug = require("debug")("to-userscript:utils");

/**
 * Escapes characters in a string that have special meaning in regular expressions.
 * @param {string} s The string to escape.
 * @returns {string} The escaped string.
 */
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\\\$&");
}

/**
 * Converts a WebExtension match pattern string to a RegExp pattern string.
 * Handles schemes (*, http, https, file, ftp), host (*, *.domain, specific), and path (/*).
 * @param {string} pattern The match pattern string.
 * @returns {string} A string representation of the RegExp pattern, suitable for new RegExp().
 *                   Needs double escaping for embedding in generated code strings.
 */
function convertMatchPatternToRegExpString(pattern) {
  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\\\$&");
  }

  if (typeof pattern !== "string" || !pattern) {
    return "$."; // Matches nothing
  }

  const schemeMatch = pattern.match(/^(\*|https?|file|ftp):\/\//);
  if (!schemeMatch) return "$."; // Invalid pattern
  const scheme = schemeMatch[1];
  pattern = pattern.substring(schemeMatch[0].length);
  const schemeRegex = scheme === "*" ? "https?|file|ftp" : scheme;

  const hostMatch = pattern.match(/^([^\/]+)/);
  if (!hostMatch) return "$."; // Invalid pattern
  const host = hostMatch[1];
  pattern = pattern.substring(host.length); // Remainder is path

  let hostRegex;
  if (host === "*") {
    hostRegex = "[^/]+"; // Matches any sequence of non-slash characters
  } else if (host.startsWith("*.")) {
    // Match any subdomain or the main domain
    hostRegex = "(?:[^\\/]+\\.)?" + escapeRegex(host.substring(2));
  } else {
    hostRegex = escapeRegex(host); // Exact host match
  }

  let pathRegex = pattern;
  if (!pathRegex.startsWith("/")) {
    pathRegex = "/" + pathRegex; // Ensure path starts with /
  }
  // Convert glob (*) to regex (.*) and escape other special chars
  pathRegex = pathRegex.split("*").map(escapeRegex).join(".*");

  // Ensure the pattern covers the entire path segment correctly
  if (pathRegex === "/.*") {
    // Equivalent to /* in manifest, matches the root and anything after
    pathRegex = "(?:/.*)?";
  } else {
    // Match the specific path and optionally query/hash or end of string
    pathRegex = pathRegex + "(?:[?#]|$)";
  }

  // Combine and return the pattern string
  // Needs double escaping for direct embedding in generated JS strings
  const finalRegexString = `^${schemeRegex}:\\/\\/${hostRegex}${pathRegex}`;
  return finalRegexString;
}

/**
 * Creates a RegExp object from a match pattern string.
 * @param {string} pattern The match pattern string.
 * @returns {RegExp} The corresponding regular expression.
 */
function convertMatchPatternToRegExp(pattern) {
  if (pattern === "<all_urls>") {
    return new RegExp(".*");
  }
  try {
    const singleEscapedPattern = convertMatchPatternToRegExpString(
      pattern
    ).replace(/\\\\/g, "\\");
    return new RegExp(singleEscapedPattern);
  } catch (error) {
    debug(
      "Error converting match pattern to RegExp: %s, Error: %s",
      pattern,
      error.message
    );
    return new RegExp("$."); // Matches nothing on error
  }
}

/**
 * Normalizes a file path for consistent comparisons.
 * Replaces backslashes with forward slashes.
 * @param {string} filePath The file path to normalize.
 * @returns {string} The normalized file path.
 */
function normalizePath(filePath) {
  return path.normalize(filePath).replace(/\\/g, "/");
}

const scriptBlacklist = {
  "browser-polyfill.js": "",
  "web-ext-polyfill.js": "",
  "webextension-polyfill.js": "",
  "ExtPay.js": `const ExtPay = (extensionId)  => ({
    startBackground() {
    },

    getUser() {
      return new Promise((resolve) => {
        const dummyUser = {
          paid: true,
          paidAt: new Date(),
          email: "dummyuser@example.com",
          installedAt: new Date(),
          trialStartedAt: null,
          plan: {
            unitAmountCents: 1000,
            currency: "usd",
            nickname: "dummy_plan",
            intervalCount: 1,
            interval: "month",
          },
          subscriptionStatus: "active",
          subscriptionCancelAt: null,
        };
        resolve(dummyUser);
      });
    },
    openPaymentPage(planNickname) {
    },
    getPlans() {
      return new Promise((resolve) => {
        const dummyPlans = [
          {
            unitAmountCents: 1000,
            currency: "usd",
            nickname: "monthly_plan",
            interval: "month",
            intervalCount: 1,
          },
          {
            unitAmountCents: 9900,
            currency: "usd",
            nickname: "yearly_plan",
            interval: "year",
            intervalCount: 1,
          },
        ];
        resolve(dummyPlans);
      });
    },

    onPaid: {
      addListener: (callback) => {
        console.log("Dummy onPaid listener added");
        // Simulate a user paying after 2 seconds
        setTimeout(() => {
          const dummyUser = {
            paid: true,
            paidAt: new Date(),
            email: "dummyuser@example.com",
            installedAt: new Date(),
            trialStartedAt: null,
            plan: {
              unitAmountCents: 1000,
              currency: "usd",
              nickname: "dummy_plan",
              intervalCount: 1,
              interval: "month",
            },
            subscriptionStatus: "active",
            subscriptionCancelAt: null,
          };
          callback(dummyUser);
        }, 2000);
      },
      removeListener: () => {},
    },

    openTrialPage(displayText) {
    },

    openLoginPage() {
      console.log("Dummy login page opened");
      }
    });

    window.ExtPay = ExtPay;`,
};

/**
 * Simple glob pattern matcher for web_accessible_resources
 * Supports * for any characters and ** for recursive directory matching
 * @param {string} pattern - The glob pattern
 * @param {string} path - The path to test
 * @returns {boolean} Whether the path matches the pattern
 */
function matchGlobPattern(pattern, path) {
  if (!pattern || !path) return false;

  // Normalize paths to use forward slashes
  pattern = pattern.replace(/\\/g, "/");
  path = path.replace(/\\/g, "/");

  // Handle exact matches first
  if (pattern === path) return true;

  // Convert glob pattern to regex
  // Escape special regex chars except * and **
  let regexPattern = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&") // Escape regex chars
    .replace(/\*\*/g, "__DOUBLESTAR__") // Temporarily replace **
    .replace(/\*/g, "[^/]*") // * matches any chars except /
    .replace(/__DOUBLESTAR__/g, ".*"); // ** matches any chars including /

  // Ensure pattern matches from start to end
  regexPattern = "^" + regexPattern + "$";

  try {
    const regex = new RegExp(regexPattern);
    return regex.test(path);
  } catch (e) {
    debug("Invalid glob pattern: %s, Error: %s", pattern, e.message);
    return false;
  }
}

/**
 * Checks if a resource path matches any of the web_accessible_resources patterns
 * @param {string} resourcePath - The resource path to check
 * @param {Array} webAccessibleResources - Array of web_accessible_resources from manifest
 * @returns {boolean} Whether the resource is web accessible
 */
function isWebAccessibleResource(resourcePath, webAccessibleResources) {
  if (
    !Array.isArray(webAccessibleResources) ||
    webAccessibleResources.length === 0
  ) {
    return false;
  }

  // Normalize the resource path
  const normalizedPath = normalizePath(resourcePath).replace(/^\/+/, "");

  for (const webAccessibleResource of webAccessibleResources) {
    let patterns = [];

    // Handle both manifest v2 and v3 formats
    if (typeof webAccessibleResource === "string") {
      // Manifest v2 format: array of strings
      patterns = [webAccessibleResource];
    } else if (
      webAccessibleResource &&
      Array.isArray(webAccessibleResource.resources)
    ) {
      // Manifest v3 format: objects with resources array
      patterns = webAccessibleResource.resources;
    }

    // Check if the path matches any pattern
    for (const pattern of patterns) {
      if (matchGlobPattern(pattern, normalizedPath)) {
        return true;
      }
    }
  }

  return false;
}

function replaceComments(code) {
  const lines = code.split("\n");
  const output = [];
  const stack = []; // { level, title, indent, startIndex, contentCount }

  const headerRegex = /^(\s*)\/\/\s*(-+)\s*(.+)$/;

  lines.forEach((line) => {
    const match = line.match(headerRegex);
    if (match) {
      const indent = match[1] || "";
      const level = match[2].length;
      // Sanitize title: replace non-alphanumeric with space, collapse spaces
      let title = match[3]
        .trim()
        .replace(/[^a-zA-Z0-9 \-_]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      // Close regions of same or deeper level
      while (stack.length && stack[stack.length - 1].level >= level) {
        const region = stack.pop();
        if (region.contentCount > 0) {
          output.push(`${region.indent}// #endregion`);
        } else {
          // remove empty region opening
          output.splice(region.startIndex, 1);
        }
      }

      // Open new region
      const regionIndex = output.length;
      output.push(`${indent}// #region ${title}`);
      stack.push({
        level,
        title,
        indent,
        startIndex: regionIndex,
        contentCount: 0,
      });
    } else {
      // Regular line: add accumulated indentation from all open regions
      let accumulatedIndent = "";
      stack.forEach(() => {
        accumulatedIndent += "\t";
      });

      // Apply accumulated indentation to the line
      const indentedLine = accumulatedIndent + line;
      output.push(indentedLine);
      stack.forEach((region) => region.contentCount++);
    }
  });

  // Close any remaining open regions
  while (stack.length) {
    const region = stack.pop();
    if (region.contentCount > 0) {
      output.push(`${region.indent}// #endregion`);
    } else {
      output.splice(region.startIndex, 1);
    }
  }

  return output.join("\n");
}

module.exports = {
  convertMatchPatternToRegExpString,
  convertMatchPatternToRegExp,
  normalizePath,
  escapeRegex,
  scriptBlacklist,
  matchGlobPattern,
  isWebAccessibleResource,
  replaceComments,
};
