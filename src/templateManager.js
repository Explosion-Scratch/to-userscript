const fs = require("fs").promises;
const path = require("path");

// Cache templates to avoid repeated file reads
const templateCache = {};

/**
 * Validates that template path exists and is accessible
 * @param {string} templatePath - The full path to the template file
 * @returns {Promise<boolean>} Whether the template exists and is readable
 */
async function validateTemplatePath(templatePath) {
  try {
    const stats = await fs.stat(templatePath);
    if (!stats.isFile()) {
      throw new Error(
        `Template path exists but is not a file: ${templatePath}`,
      );
    }
    // Test readability
    await fs.access(templatePath, fs.constants.R_OK);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Template file not found: ${templatePath}`);
    } else if (error.code === "EACCES") {
      throw new Error(`Template file is not readable: ${templatePath}`);
    } else {
      throw new Error(
        `Template path validation failed: ${templatePath} - ${error.message}`,
      );
    }
  }
}

/**
 * Resolves template path with fallback options
 * @param {string} templateName - The base name of the template file
 * @param {string} target - Optional target suffix
 * @returns {Promise<{path: string, fileName: string}>} Resolved template info
 */
async function resolveTemplatePath(templateName, target = null) {
  if (!templateName || typeof templateName !== "string") {
    throw new Error(`Invalid template name: ${templateName}`);
  }

  const fileNameParts = [templateName];
  if (target && typeof target === "string") {
    fileNameParts.push(target);
  }
  fileNameParts.push("template.js");
  const templateFileName = fileNameParts.join(".");

  const templatesDir = path.join(__dirname, "templates");
  const templatePath = path.join(templatesDir, templateFileName);

  try {
    await validateTemplatePath(templatePath);
    return { path: templatePath, fileName: templateFileName };
  } catch (error) {
    // If target-specific template doesn't exist, try the base template
    if (target) {
      const baseFileName = [templateName, "template.js"].join(".");
      const basePath = path.join(templatesDir, baseFileName);
      try {
        await validateTemplatePath(basePath);
        console.warn(
          `Target-specific template not found: ${templateFileName}, using base template: ${baseFileName}`,
        );
        return { path: basePath, fileName: baseFileName };
      } catch (baseError) {
        // Both failed, throw original error with context
        throw new Error(
          `Template resolution failed for '${templateName}' with target '${target}': ${error.message}. Base template also failed: ${baseError.message}`,
        );
      }
    }
    throw error;
  }
}

/**
 * Reads and caches a template file.
 * @param {string} templateName - The base name of the template file (e.g., 'polyfill').
 * @param {string} target - Optional target suffix (e.g., 'userscript', 'vanilla').
 * @returns {Promise<string>} The content of the template file.
 * @throws {Error} If the template file cannot be read.
 */
async function getTemplate(templateName, target = null) {
  try {
    const { path: templatePath, fileName: templateFileName } =
      await resolveTemplatePath(templateName, target);

    const cacheKey = templateFileName; // Use full filename as cache key
    if (templateCache[cacheKey]) {
      return templateCache[cacheKey];
    }

    console.log(`  Reading template: ${templateFileName}`);
    const content = await fs.readFile(templatePath, "utf-8");

    if (!content || content.trim().length === 0) {
      throw new Error(`Template file is empty: ${templateFileName}`);
    }

    templateCache[cacheKey] = content;
    return content;
  } catch (error) {
    const errorMsg = `Failed to load template '${templateName}'${target ? ` with target '${target}'` : ""}: ${error.message}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

// Specific template getter functions for clarity

async function getAbstractionLayerTemplate(target = "userscript") {
  return getTemplate("abstractionLayer", target);
}

async function getPolyfillTemplate() {
  return getTemplate("polyfill");
}

async function getOrchestrationTemplate() {
  return getTemplate("orchestration");
}

async function getMessagingTemplate(target = null) {
  return getTemplate("messaging", target);
}

module.exports = {
  getAbstractionLayerTemplate,
  getPolyfillTemplate,
  getOrchestrationTemplate,
  getMessagingTemplate,
};
