const fs = require("fs").promises;
const path = require("path");
const { normalizePath, matchGlobPattern } = require("./utils");

/**
 * Validates that a file exists and is readable for base64 conversion
 * @param {string} filePath - The file path to validate
 * @returns {Promise<void>}
 * @throws {Error} If file doesn't exist, isn't readable, or is too large
 */
async function validateAssetFile(filePath) {
  try {
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      throw new Error(`Asset path exists but is not a file: ${filePath}`);
    }

    const maxSize = 10 * 1024 * 1024; // 10MB limit for assets
    if (stats.size > maxSize) {
      throw new Error(
        `Asset file is too large (${Math.round(stats.size / 1024 / 1024)}MB > 10MB): ${filePath}`,
      );
    }

    await fs.access(filePath, fs.constants.R_OK);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Asset file not found: ${filePath}`);
    } else if (error.code === "EACCES") {
      throw new Error(`Asset file is not readable: ${filePath}`);
    } else {
      throw new Error(
        `Asset file validation failed: ${filePath} - ${error.message}`,
      );
    }
  }
}

/**
 * Reads a file and returns its base64-encoded content.
 * @param {string} filePath Absolute path to the file.
 * @returns {Promise<string>} Base64 string of the file contents.
 */
async function fileToBase64(filePath) {
  try {
    if (!filePath || typeof filePath !== "string") {
      throw new Error(
        `Invalid file path provided for base64 conversion: ${filePath}`,
      );
    }

    await validateAssetFile(filePath);
    const buffer = await fs.readFile(filePath);

    if (!buffer || buffer.length === 0) {
      console.warn(`Asset file is empty: ${filePath}`);
      return "";
    }
    const base64String = buffer.toString("base64");

    if (!base64String || base64String.length === 0) {
      throw new Error(
        `Base64 conversion resulted in empty string for: ${filePath}`,
      );
    }

    console.log(
      `Successfully converted asset to base64: ${path.relative(process.cwd(), filePath)} (${Math.round(buffer.length / 1024)}KB -> ${Math.round(base64String.length / 1024)}KB)`,
    );

    return base64String;
  } catch (error) {
    const errorMsg = `Error converting file to base64 ${filePath}: ${error.message}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}

/**
 * Enhanced mime-type helper based on file extension with better coverage.
 * @param {string} p Path or filename.
 * @returns {string} Mime type string.
 */
function guessMimeType(p) {
  if (!p || typeof p !== "string") {
    console.warn(`Invalid path provided for MIME type detection: ${p}`);
    return "application/octet-stream";
  }

  const ext = path.extname(p).replace(".", "").toLowerCase() || "";

  const mimeMap = {
    html: "text/html",
    htm: "text/html",
    js: "text/javascript",
    mjs: "text/javascript",
    css: "text/css",
    json: "application/json",
    txt: "text/plain",
    xml: "application/xml",

    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    ico: "image/x-icon",
    bmp: "image/bmp",

    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    otf: "font/otf",
    eot: "application/vnd.ms-fontobject",

    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",

    mp4: "video/mp4",
    webm: "video/webm",

    zip: "application/zip",

    pdf: "application/pdf",
  };

  const mimeType = mimeMap[ext] || "application/octet-stream";

  if (mimeType === "application/octet-stream" && ext) {
    console.warn(
      `Unknown file extension for MIME type detection: .${ext} (file: ${p})`,
    );
  }

  return mimeType;
}

/**
 * Checks if a file extension represents a text asset
 * @param {string} ext - File extension (including the dot)
 * @returns {boolean} Whether it's a text asset
 */
function isTextAsset(ext) {
  const textExtensions = [
    ".html",
    ".htm",
    ".js",
    ".mjs",
    ".css",
    ".json",
    ".svg",
    ".txt",
    ".xml",
  ];
  return textExtensions.includes(ext.toLowerCase());
}

/**
 * Unified Asset Generator class that handles all asset processing
 */
class AssetGenerator {
  constructor(extensionRoot, locale) {
    this.extensionRoot = extensionRoot;
    this.processedFiles = new Set();
    this.assetsMap = {};
    this.locale = locale;

    this.PROCESSABLE_ASSET_TYPES = {
      HTML: [".html", ".htm"],
      CSS: [".css"],
    };

    this.IGNORED_INLINE_PATTERNS = [
      /\.(woff|woff2|ttf|otf|eot)$/i,
      /\.(mp4|webm|ogg|mp3|wav)$/i,
    ];

    this.REGEX_PATTERNS = {
      HTML_ASSETS: /(src|href)\s*=\s*(?:["']([^"']+)["']|([^\s>]+))/gi,
      CSS_ASSETS: /url\s*\(\s*["']?([^"')]+)["']?\s*\)/gi,
      EXTERNAL_URLS: /^(data:|https?:\/\/|\/\/|#|javascript:|mailto:)/,
    };
  }

  /**
   * Checks if an asset should be ignored for inlining
   * @param {string} assetPath
   * @returns {boolean}
   */
  shouldIgnoreAsset(assetPath) {
    return this.IGNORED_INLINE_PATTERNS.some((pattern) =>
      pattern.test(assetPath),
    );
  }

  /**
   * Determines if a file type should be processed for asset extraction
   * @param {string} filePath
   * @returns {string|null} Asset type or null if not processable
   */
  getAssetType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    for (const [type, extensions] of Object.entries(
      this.PROCESSABLE_ASSET_TYPES,
    )) {
      if (extensions.includes(ext)) {
        return type;
      }
    }
    return null;
  }

  /**
   * Validates and resolves asset path
   * @param {string} assetPath
   * @param {string} currentDir
   * @returns {Promise<string>}
   */
  async validateAssetPath(assetPath, currentDir) {
    if (!assetPath || typeof assetPath !== "string") {
      throw new Error(`Invalid asset path: ${assetPath}`);
    }

    let absAssetPath = path.join(currentDir, assetPath);

    const relativePath = path.relative(this.extensionRoot, absAssetPath);
    if (relativePath.startsWith("..")) {
      throw new Error(
        `Asset path resolves outside extension directory: ${assetPath}`,
      );
    }

    async function checkFileExists(file) {
      return fs
        .access(file, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);
    }

    if (!(await checkFileExists(absAssetPath))) {
      absAssetPath = path.join(this.extensionRoot, assetPath);
    }

    try {
      const stats = await fs.stat(absAssetPath);
      if (!stats.isFile()) {
        throw new Error(`Asset path exists but is not a file: ${assetPath}`);
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new Error(`Asset file not found: ${absAssetPath}`);
      } else if (error.code === "EACCES") {
        throw new Error(`Asset file is not readable: ${absAssetPath}`);
      } else {
        throw error;
      }
    }

    return absAssetPath;
  }

  /**
   * Extracts asset paths from content using unified logic
   * @param {string} content
   * @param {string} contentType - 'HTML' or 'CSS'
   * @returns {Array<string>}
   */
  extractAssetPaths(content, contentType) {
    try {
      if (
        !content ||
        typeof content !== "string" ||
        content.trim().length === 0
      ) {
        return [];
      }

      const regex =
        contentType === "HTML"
          ? this.REGEX_PATTERNS.HTML_ASSETS
          : this.REGEX_PATTERNS.CSS_ASSETS;

      const assets = [];
      let match;
      let matchCount = 0;
      const maxMatches = 1000;

      while (
        (match = regex.exec(content)) !== null &&
        matchCount < maxMatches
      ) {
        matchCount++;
        const url = contentType === "HTML" ? match[2] : match[1];

        if (!url || typeof url !== "string") {
          continue;
        }

        // Skip external URLs using unified pattern
        if (this.REGEX_PATTERNS.EXTERNAL_URLS.test(url)) {
          continue;
        }

        assets.push(url);
      }

      const uniqueAssets = [...new Set(assets)];
      console.log(
        `Extracted ${uniqueAssets.length} unique ${contentType} asset path(s)`,
      );

      return uniqueAssets;
    } catch (error) {
      console.error(
        `Error extracting ${contentType} asset paths:`,
        error.message,
      );
      return [];
    }
  }

  /**
   * Replaces asset references in content using unified regex patterns
   * @param {string} content
   * @param {string} assetPath
   * @param {string} dataUrl
   * @param {string} assetType
   * @returns {string}
   */
  replaceAssetReferences(content, assetPath, dataUrl, assetType) {
    const escapedAssetPath = assetPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    if (assetType === "CSS" || content.includes("url(")) {
      // Replace CSS url() references
      const cssRegex = new RegExp(
        `url\\s*\\(\\s*["']?${escapedAssetPath}["']?\\s*\\)`,
        "gi",
      );
      content = content.replace(cssRegex, `url("${dataUrl}")`);
    }

    // Replace HTML src/href references
    const htmlRegex = new RegExp(
      `(src|href)\\s*=\\s*["']${escapedAssetPath}["']`,
      "gi",
    );
    content = content.replace(htmlRegex, (match) => {
      return match.replace(assetPath, dataUrl);
    });

    return content;
  }

  /**
   * Inlines assets into content
   * @param {string} content
   * @param {Array<string>} assetPaths
   * @param {string} currentDir
   * @returns {Promise<string>}
   */
  async inlineAssets(content, assetPaths, currentDir) {
    try {
      let updatedContent = content;
      let successCount = 0;

      console.log(`Attempting to inline ${assetPaths.length} asset(s)...`);

      for (const relativePath of assetPaths) {
        try {
          if (this.shouldIgnoreAsset(relativePath)) {
            console.log(
              `Ignoring asset (matches ignore pattern): ${relativePath}`,
            );
            continue;
          }

          const absAssetPath = await this.validateAssetPath(
            relativePath,
            currentDir,
          );
          const assetType = this.getAssetType(absAssetPath);

          if (assetType) {
            // Recursively process CSS/HTML assets
            const assetContent = await fs.readFile(absAssetPath, "utf-8");
            const processedContent = await this.processAssetRecursively(
              assetContent,
              absAssetPath,
              assetType,
            );

            const base64 = Buffer.from(processedContent, "utf-8").toString(
              "base64",
            );
            const mime = guessMimeType(relativePath);
            const dataUrl = `data:${mime};base64,${base64}`;

            updatedContent = this.replaceAssetReferences(
              updatedContent,
              relativePath,
              dataUrl,
              assetType,
            );
            successCount++;
            console.log(
              `Successfully inlined and processed ${assetType}: ${relativePath}`,
            );
          } else {
            // Handle binary assets (images, etc.)
            const base64 = await fileToBase64(absAssetPath);
            const mime = guessMimeType(relativePath);
            const dataUrl = `data:${mime};base64,${base64}`;

            updatedContent = this.replaceAssetReferences(
              updatedContent,
              relativePath,
              dataUrl,
              "BINARY",
            );
            successCount++;
            console.log(`Successfully inlined binary asset: ${relativePath}`);
          }
        } catch (assetError) {
          console.error(
            `Failed to inline asset ${relativePath}: ${assetError.message}`,
          );
        }
      }

      console.log(
        `Asset inlining complete: ${successCount}/${assetPaths.length} successful`,
      );
      return updatedContent;
    } catch (error) {
      console.error(`Error during asset inlining: ${error.message}`);
      return content;
    }
  }

  /**
   * Recursively processes assets and their dependencies
   * @param {string} content
   * @param {string} contentPath
   * @param {string} assetType
   * @returns {Promise<string>}
   */
  async processAssetRecursively(content, contentPath, assetType) {
    const normalizedPath = normalizePath(contentPath);

    if (this.processedFiles.has(normalizedPath)) {
      console.log(`Skipping already processed file: ${normalizedPath}`);
      return content;
    }

    this.processedFiles.add(normalizedPath);
    console.log(`Processing ${assetType} file: ${normalizedPath}`);

    const assetPaths = this.extractAssetPaths(content, assetType);

    if (assetPaths.length === 0) {
      console.log(`No assets found in ${assetType} file: ${normalizedPath}`);
      return content;
    }

    return await this.inlineAssets(
      content,
      assetPaths,
      path.dirname(contentPath),
    );
  }

  /**
   * Recursively walks a directory and returns all file paths
   * @param {string} dir - Directory to walk
   * @returns {Promise<Array<string>>} - Array of absolute file paths
   */
  async walkDirectory(dir) {
    const files = [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          if (
            !["node_modules", ".git", ".svn", "_metadata"].includes(entry.name)
          ) {
            const subFiles = await this.walkDirectory(fullPath);
            files.push(...subFiles);
          }
        } else if (entry.isFile()) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Error walking directory ${dir}: ${error.message}`);
    }

    return files;
  }

  /**
   * Finds files matching a single glob pattern
   * @param {string} pattern - Glob pattern
   * @returns {Promise<Array<string>>} - Array of absolute file paths
   */
  async findFilesForPattern(pattern) {
    const files = [];

    if (pattern.includes("*")) {
      const allFiles = await this.walkDirectory(this.extensionRoot);

      for (const filePath of allFiles) {
        const relativePath = normalizePath(
          path.relative(this.extensionRoot, filePath),
        );
        if (matchGlobPattern(pattern, relativePath)) {
          files.push(filePath);
        }
      }
    } else {
      const exactPath = path.resolve(this.extensionRoot, pattern);
      try {
        const stats = await fs.stat(exactPath);
        if (stats.isFile()) {
          files.push(exactPath);
        }
      } catch (error) {
        if (error.code !== "ENOENT") {
          console.warn(`Error checking file ${exactPath}: ${error.message}`);
        }
      }
    }

    return files;
  }

  /**
   * Finds all files that match the given glob patterns
   * @param {Array<string>} patterns - Array of glob patterns
   * @returns {Promise<Array<string>>} - Array of absolute file paths
   */
  async findMatchingFiles(patterns) {
    const matchingFiles = [];

    for (const pattern of patterns) {
      try {
        const files = await this.findFilesForPattern(pattern);
        matchingFiles.push(...files);
      } catch (error) {
        console.error(
          `Error finding files for pattern ${pattern}: ${error.message}`,
        );
      }
    }

    return [...new Set(matchingFiles)];
  }

  /**
   * Gets page path from manifest based on page type and manifest structure
   * @param {object} manifest - Parsed manifest object
   * @param {string} pageType - 'options' or 'popup'
   * @returns {string|null} Relative path to the page or null
   */
  getPagePath(manifest, pageType) {
    try {
      if (!manifest || typeof manifest !== "object") {
        console.warn(`Invalid manifest provided to get${pageType}PagePath`);
        return null;
      }

      if (pageType === "options") {
        if (
          manifest.options_ui &&
          typeof manifest.options_ui === "object" &&
          manifest.options_ui.page
        ) {
          if (typeof manifest.options_ui.page === "string") {
            return manifest.options_ui.page;
          } else {
            console.warn(
              "options_ui.page exists but is not a string:",
              typeof manifest.options_ui.page,
            );
          }
        }

        if (manifest.options_page) {
          if (typeof manifest.options_page === "string") {
            return manifest.options_page;
          } else {
            console.warn(
              "options_page exists but is not a string:",
              typeof manifest.options_page,
            );
          }
        }
      } else if (pageType === "popup") {
        if (
          manifest.action &&
          typeof manifest.action === "object" &&
          manifest.action.default_popup
        ) {
          if (typeof manifest.action.default_popup === "string") {
            return manifest.action.default_popup;
          } else {
            console.warn(
              "action.default_popup exists but is not a string:",
              typeof manifest.action.default_popup,
            );
          }
        }

        // Check manifest v2
        if (
          manifest.browser_action &&
          typeof manifest.browser_action === "object" &&
          manifest.browser_action.default_popup
        ) {
          if (typeof manifest.browser_action.default_popup === "string") {
            return manifest.browser_action.default_popup;
          } else {
            console.warn(
              "browser_action.default_popup exists but is not a string:",
              typeof manifest.browser_action.default_popup,
            );
          }
        }

        if (
          manifest.page_action &&
          typeof manifest.page_action === "object" &&
          manifest.page_action.default_popup
        ) {
          if (typeof manifest.page_action.default_popup === "string") {
            return manifest.page_action.default_popup;
          } else {
            console.warn(
              "page_action.default_popup exists but is not a string:",
              typeof manifest.page_action.default_popup,
            );
          }
        }
      }

      return null;
    } catch (error) {
      console.error(
        `Error extracting ${pageType} page path from manifest:`,
        error.message,
      );
      return null;
    }
  }

  /**
   * Unified method to process HTML pages (options or popup)
   * @param {object} manifest - Parsed manifest object
   * @param {string} pageType - 'options' or 'popup'
   * @returns {Promise<{[pageType + 'PagePath']: string|null}>}
   */
  async processHtmlPage(manifest, pageType) {
    try {
      const pageRel = this.getPagePath(manifest, pageType);
      if (!pageRel) {
        console.log(`No ${pageType} page declared in manifest.`);
        return { [`${pageType}PagePath`]: null };
      }

      console.log(`Processing ${pageType} page: ${pageRel}`);

      const normalizedPageRel = normalizePath(pageRel);
      const pageFullPath = path.resolve(this.extensionRoot, normalizedPageRel);

      // Validate that the page is within the extension directory
      const relativePath = path.relative(this.extensionRoot, pageFullPath);
      if (relativePath.startsWith("..")) {
        throw new Error(
          `${pageType} page path resolves outside extension directory: ${pageRel}`,
        );
      }

      // Validate page file exists and is readable
      try {
        const stats = await fs.stat(pageFullPath);
        if (!stats.isFile()) {
          throw new Error(
            `${pageType} page path exists but is not a file: ${pageRel}`,
          );
        }
        await fs.access(pageFullPath, fs.constants.R_OK);
      } catch (fileError) {
        if (fileError.code === "ENOENT") {
          throw new Error(`${pageType} page file not found: ${pageRel}`);
        } else if (fileError.code === "EACCES") {
          throw new Error(`${pageType} page file is not readable: ${pageRel}`);
        } else {
          throw new Error(
            `${pageType} page file validation failed: ${pageRel} - ${fileError.message}`,
          );
        }
      }

      const htmlContent = await fs.readFile(pageFullPath, "utf-8");

      if (!htmlContent || htmlContent.trim().length === 0) {
        console.warn(`${pageType} page file is empty: ${pageRel}`);
      }

      const updatedHtml = await this.processAssetRecursively(
        htmlContent,
        pageFullPath,
        "HTML",
      );

      this.assetsMap[normalizedPageRel] = this.locale(updatedHtml);

      console.log(
        `Successfully processed ${pageType} page: ${normalizedPageRel} (${Math.round(updatedHtml.length / 1024)}KB)`,
      );

      return { [`${pageType}PagePath`]: normalizedPageRel };
    } catch (error) {
      const errorMsg = `Error processing ${pageType} page: ${error.message}`;
      console.error(errorMsg);

      console.warn(
        `${pageType} page processing failed, continuing without ${pageType} page`,
      );
      return { [`${pageType}PagePath`]: null };
    }
  }

  /**
   * Processes web accessible resources and adds them to the assets map
   * @param {object} manifest - Parsed manifest object
   * @returns {Promise<void>}
   */
  async processWebAccessibleResources(manifest) {
    try {
      const webAccessibleResources = manifest.web_accessible_resources || [];
      if (webAccessibleResources.length === 0) {
        console.log("No web accessible resources declared in manifest.");
        return;
      }

      console.log(`Processing web accessible resources...`);

      const resourcePatterns = [];
      for (const resource of webAccessibleResources) {
        if (typeof resource === "string") {
          // Manifest v2
          resourcePatterns.push(resource);
        } else if (resource && Array.isArray(resource.resources)) {
          // Manifest v3
          resourcePatterns.push(...resource.resources);
        }
      }

      const matchingFiles = await this.findMatchingFiles(resourcePatterns);
      console.log(
        `Found ${matchingFiles.length} web accessible resource file(s)`,
      );

      for (const filePath of matchingFiles) {
        try {
          const relativePath = normalizePath(
            path.relative(this.extensionRoot, filePath),
          );
          const ext = path.extname(filePath).toLowerCase();

          console.log(`  Processing web accessible resource: ${relativePath}`);

          if (ext === ".css") {
            const cssContent = await fs.readFile(filePath, "utf-8");
            const processedContent = await this.processAssetRecursively(
              cssContent,
              filePath,
              "CSS",
            );

            this.assetsMap[relativePath] = processedContent;
            console.log(
              `    Processed CSS with asset inlining: ${relativePath}`,
            );
          } else if (isTextAsset(ext)) {
            const textContent = this.locale(
              await fs.readFile(filePath, "utf-8"),
            );
            this.assetsMap[relativePath] = textContent;
            console.log(`    Processed text asset: ${relativePath}`);
          } else {
            const base64Content = await fileToBase64(filePath);
            this.assetsMap[relativePath] = base64Content;
            console.log(`    Processed binary asset: ${relativePath}`);
          }
        } catch (fileError) {
          console.error(
            `    Failed to process web accessible resource ${filePath}: ${fileError.message}`,
          );
        }
      }

      console.log(
        `Successfully processed ${Object.keys(this.assetsMap).length} web accessible resource(s)`,
      );
    } catch (error) {
      const errorMsg = `Error processing web accessible resources: ${error.message}`;
      console.error(errorMsg);

      console.warn(
        "Web accessible resources processing failed, continuing without them",
      );
    }
  }

  /**
   * Generates the complete assets map for the extension
   * @param {object} manifest - Parsed manifest object
   * @returns {Promise<{assetsMap: object, optionsPagePath: string|null, popupPagePath: string|null}>}
   */
  async generateAssetsMap(manifest) {
    console.log("Generating unified assets map...");

    this.assetsMap = {};
    this.processedFiles.clear();

    const optionsPath = this.getPagePath(manifest, "options");
    const popupPath = this.getPagePath(manifest, "popup");

    if (optionsPath && popupPath && optionsPath === popupPath) {
      console.log(`Options and popup share the same page: ${optionsPath}`);
      const { popupPagePath } = await this.processHtmlPage(manifest, "popup");
      return {
        assetsMap: { ...this.assetsMap },
        optionsPagePath: popupPagePath,
        popupPagePath: popupPagePath,
      };
    } else {
      const { optionsPagePath } = await this.processHtmlPage(
        manifest,
        "options",
      );
      const { popupPagePath } = await this.processHtmlPage(manifest, "popup");
      await this.processWebAccessibleResources(manifest);

      return {
        assetsMap: { ...this.assetsMap },
        optionsPagePath,
        popupPagePath,
      };
    }
  }
}

module.exports = {
  fileToBase64,
  guessMimeType,
  normalizePath,
  isTextAsset,
  AssetGenerator,
};
