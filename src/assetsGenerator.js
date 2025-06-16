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

    // Check file size - warn for large files that might cause issues
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
    // No locale treatment here - base64 encoded things aren't text
    const base64String = buffer.toString("base64");

    // Validate the base64 conversion worked
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

  // Enhanced MIME type mapping
  const mimeMap = {
    // Text formats
    html: "text/html",
    htm: "text/html",
    js: "text/javascript",
    mjs: "text/javascript",
    css: "text/css",
    json: "application/json",
    txt: "text/plain",
    xml: "application/xml",

    // Image formats
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    ico: "image/x-icon",
    bmp: "image/bmp",

    // Font formats
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    otf: "font/otf",
    eot: "application/vnd.ms-fontobject",

    // Audio formats
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",

    // Video formats
    mp4: "video/mp4",
    webm: "video/webm",

    // Archive formats
    zip: "application/zip",

    // Other common formats
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

    // Configuration for asset processing
    this.PROCESSABLE_ASSET_TYPES = {
      HTML: [".html", ".htm"],
      CSS: [".css"],
    };

    this.IGNORED_INLINE_PATTERNS = [
      /\.(woff|woff2|ttf|otf|eot)$/i, // Font files
      /\.(mp4|webm|ogg|mp3|wav)$/i, // Media files (can be large)
    ];
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

    // Ensure the resolved path is still within the extension directory
    const relativePath = path.relative(this.extensionRoot, absAssetPath);
    if (relativePath.startsWith("..")) {
      throw new Error(
        `Asset path resolves outside extension directory: ${assetPath}`,
      );
    }

    if (!(await fs.exists(absAssetPath))) {
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
   * Extracts asset paths from HTML content
   * @param {string} html
   * @returns {Array<string>}
   */
  extractHtmlAssetPaths(html) {
    try {
      if (!html || typeof html !== "string" || html.trim().length === 0) {
        return [];
      }

      const regex = /(src|href)\s*=\s*["']([^"']+)["']/gi;
      const assets = [];
      let match;
      let matchCount = 0;
      const maxMatches = 1000;

      while ((match = regex.exec(html)) !== null && matchCount < maxMatches) {
        matchCount++;
        const url = match[2];

        if (!url || typeof url !== "string") {
          continue;
        }

        // Skip external URLs, data URLs, and fragments
        if (
          url.startsWith("data:") ||
          url.startsWith("http://") ||
          url.startsWith("https://") ||
          url.startsWith("//") ||
          url.startsWith("#") ||
          url.startsWith("javascript:") ||
          url.startsWith("mailto:")
        ) {
          continue;
        }

        assets.push(url);
      }

      const uniqueAssets = [...new Set(assets)];
      console.log(`Extracted ${uniqueAssets.length} unique HTML asset path(s)`);

      return uniqueAssets;
    } catch (error) {
      console.error("Error extracting HTML asset paths:", error.message);
      return [];
    }
  }

  /**
   * Extracts asset paths from CSS content (url() imports)
   * @param {string} css
   * @returns {Array<string>}
   */
  extractCssAssetPaths(css) {
    try {
      if (!css || typeof css !== "string" || css.trim().length === 0) {
        return [];
      }

      // Match url() imports in CSS
      const regex = /url\s*\(\s*["']?([^"')]+)["']?\s*\)/gi;
      const assets = [];
      let match;
      let matchCount = 0;
      const maxMatches = 1000;

      while ((match = regex.exec(css)) !== null && matchCount < maxMatches) {
        matchCount++;
        const url = match[1];

        if (!url || typeof url !== "string") {
          continue;
        }

        // Skip external URLs and data URLs
        if (
          url.startsWith("data:") ||
          url.startsWith("http://") ||
          url.startsWith("https://") ||
          url.startsWith("//")
        ) {
          continue;
        }

        assets.push(url);
      }

      const uniqueAssets = [...new Set(assets)];
      console.log(`Extracted ${uniqueAssets.length} unique CSS asset path(s)`);

      return uniqueAssets;
    } catch (error) {
      console.error("Error extracting CSS asset paths:", error.message);
      return [];
    }
  }

  /**
   * Replaces asset references in content based on asset type
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

    // Prevent infinite recursion
    if (this.processedFiles.has(normalizedPath)) {
      console.log(`Skipping already processed file: ${normalizedPath}`);
      return content;
    }

    this.processedFiles.add(normalizedPath);
    console.log(`Processing ${assetType} file: ${normalizedPath}`);

    let assetPaths = [];

    if (assetType === "HTML") {
      assetPaths = this.extractHtmlAssetPaths(content);
    } else if (assetType === "CSS") {
      assetPaths = this.extractCssAssetPaths(content);
    }

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
          // Skip common non-resource directories
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
      // Handle glob patterns by recursively walking directories
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
      // Handle exact file paths
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

    // Remove duplicates
    return [...new Set(matchingFiles)];
  }

  /**
   * Processes options page and adds it to the assets map
   * @param {object} manifest - Parsed manifest object
   * @returns {Promise<{optionsPagePath: string|null}>}
   */
  async processOptionsPage(manifest) {
    try {
      const optionsPageRel = this.getOptionsPagePath(manifest);
      if (!optionsPageRel) {
        console.log("No options page declared in manifest.");
        return { optionsPagePath: null };
      }

      console.log(`Processing options page: ${optionsPageRel}`);

      const normalizedOptionsRel = normalizePath(optionsPageRel);
      const optionsFullPath = path.resolve(
        this.extensionRoot,
        normalizedOptionsRel,
      );

      // Validate that the options page is within the extension directory
      const relativePath = path.relative(this.extensionRoot, optionsFullPath);
      if (relativePath.startsWith("..")) {
        throw new Error(
          `Options page path resolves outside extension directory: ${optionsPageRel}`,
        );
      }

      // Validate options page file exists and is readable
      try {
        const stats = await fs.stat(optionsFullPath);
        if (!stats.isFile()) {
          throw new Error(
            `Options page path exists but is not a file: ${optionsPageRel}`,
          );
        }
        await fs.access(optionsFullPath, fs.constants.R_OK);
      } catch (fileError) {
        if (fileError.code === "ENOENT") {
          throw new Error(`Options page file not found: ${optionsPageRel}`);
        } else if (fileError.code === "EACCES") {
          throw new Error(
            `Options page file is not readable: ${optionsPageRel}`,
          );
        } else {
          throw new Error(
            `Options page file validation failed: ${optionsPageRel} - ${fileError.message}`,
          );
        }
      }

      const htmlContent = await fs.readFile(optionsFullPath, "utf-8");

      if (!htmlContent || htmlContent.trim().length === 0) {
        console.warn(`Options page file is empty: ${optionsPageRel}`);
      }

      const updatedHtml = await this.processAssetRecursively(
        htmlContent,
        optionsFullPath,
        "HTML",
      );

      // Add to assets map
      this.assetsMap[normalizedOptionsRel] = this.locale(updatedHtml);

      console.log(
        `Successfully processed options page: ${normalizedOptionsRel} (${Math.round(updatedHtml.length / 1024)}KB)`,
      );

      return { optionsPagePath: normalizedOptionsRel };
    } catch (error) {
      const errorMsg = `Error processing options page: ${error.message}`;
      console.error(errorMsg);

      // Return empty result but don't throw - this allows the conversion to continue
      console.warn(
        "Options page processing failed, continuing without options page",
      );
      return { optionsPagePath: null };
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

      // Collect all resource patterns
      const resourcePatterns = [];
      for (const resource of webAccessibleResources) {
        if (typeof resource === "string") {
          // Manifest v2 format
          resourcePatterns.push(resource);
        } else if (resource && Array.isArray(resource.resources)) {
          // Manifest v3 format
          resourcePatterns.push(...resource.resources);
        }
      }

      // Find all matching files
      const matchingFiles = await this.findMatchingFiles(resourcePatterns);
      console.log(
        `Found ${matchingFiles.length} web accessible resource file(s)`,
      );

      // Process each file
      for (const filePath of matchingFiles) {
        try {
          const relativePath = normalizePath(
            path.relative(this.extensionRoot, filePath),
          );
          const ext = path.extname(filePath).toLowerCase();

          console.log(`  Processing web accessible resource: ${relativePath}`);

          if (ext === ".css") {
            // For CSS files, apply asset inlining
            const cssContent = await fs.readFile(filePath, "utf-8");
            const processedContent = await this.processAssetRecursively(
              cssContent,
              filePath,
              "CSS",
            );

            // Store as text content for CSS
            this.assetsMap[relativePath] = processedContent;
            console.log(
              `    Processed CSS with asset inlining: ${relativePath}`,
            );
          } else if (isTextAsset(ext)) {
            // For other text assets, read as text
            const textContent = this.locale(
              await fs.readFile(filePath, "utf-8"),
            );
            this.assetsMap[relativePath] = textContent;
            console.log(`    Processed text asset: ${relativePath}`);
          } else {
            // For binary assets, convert to base64
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

      // Don't throw - this allows the conversion to continue
      console.warn(
        "Web accessible resources processing failed, continuing without them",
      );
    }
  }

  /**
   * Detects the options page path from manifest (v2 or v3 style).
   * @param {object} manifest Parsed manifest.json content.
   * @returns {string|null} Relative path to the options page within the extension or null.
   */
  getOptionsPagePath(manifest) {
    try {
      if (!manifest || typeof manifest !== "object") {
        console.warn("Invalid manifest provided to getOptionsPagePath");
        return null;
      }

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

      return null;
    } catch (error) {
      console.error(
        "Error extracting options page path from manifest:",
        error.message,
      );
      return null;
    }
  }

  /**
   * Detects the popup page path from manifest (v2 or v3 style).
   * @param {object} manifest Parsed manifest.json content.
   * @returns {string|null} Relative path to the popup page within the extension or null.
   */
  getPopupPagePath(manifest) {
    try {
      if (!manifest || typeof manifest !== "object") {
        console.warn("Invalid manifest provided to getPopupPagePath");
        return null;
      }

      // Manifest v3 - action.default_popup
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

      // Manifest v2 - browser_action.default_popup
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

      // Manifest v2 - page_action.default_popup
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

      return null;
    } catch (error) {
      console.error(
        "Error extracting popup page path from manifest:",
        error.message,
      );
      return null;
    }
  }

  /**
   * Processes popup page and adds it to the assets map
   * @param {object} manifest - Parsed manifest object
   * @returns {Promise<{popupPagePath: string|null}>}
   */
  async processPopupPage(manifest) {
    try {
      const popupPageRel = this.getPopupPagePath(manifest);
      if (!popupPageRel) {
        console.log("No popup page declared in manifest.");
        return { popupPagePath: null };
      }

      console.log(`Processing popup page: ${popupPageRel}`);

      const normalizedPopupRel = normalizePath(popupPageRel);
      const popupFullPath = path.resolve(
        this.extensionRoot,
        normalizedPopupRel,
      );

      // Validate that the popup page is within the extension directory
      const relativePath = path.relative(this.extensionRoot, popupFullPath);
      if (relativePath.startsWith("..")) {
        throw new Error(
          `Popup page path resolves outside extension directory: ${popupPageRel}`,
        );
      }

      // Validate popup page file exists and is readable
      try {
        const stats = await fs.stat(popupFullPath);
        if (!stats.isFile()) {
          throw new Error(
            `Popup page path exists but is not a file: ${popupPageRel}`,
          );
        }
        await fs.access(popupFullPath, fs.constants.R_OK);
      } catch (fileError) {
        if (fileError.code === "ENOENT") {
          throw new Error(`Popup page file not found: ${popupPageRel}`);
        } else if (fileError.code === "EACCES") {
          throw new Error(
            `Popup page file is not readable: ${popupPageRel}`,
          );
        } else {
          throw new Error(
            `Popup page file validation failed: ${popupPageRel} - ${fileError.message}`,
          );
        }
      }

      const htmlContent = await fs.readFile(popupFullPath, "utf-8");

      if (!htmlContent || htmlContent.trim().length === 0) {
        console.warn(`Popup page file is empty: ${popupPageRel}`);
      }

      const updatedHtml = await this.processAssetRecursively(
        htmlContent,
        popupFullPath,
        "HTML",
      );

      // Add to assets map
      this.assetsMap[normalizedPopupRel] = this.locale(updatedHtml);

      console.log(
        `Successfully processed popup page: ${normalizedPopupRel} (${Math.round(updatedHtml.length / 1024)}KB)`,
      );

      return { popupPagePath: normalizedPopupRel };
    } catch (error) {
      const errorMsg = `Error processing popup page: ${error.message}`;
      console.error(errorMsg);

      // Return empty result but don't throw - this allows the conversion to continue
      console.warn(
        "Popup page processing failed, continuing without popup page",
      );
      return { popupPagePath: null };
    }
  }

  /**
   * Generates the complete assets map for the extension
   * @param {object} manifest - Parsed manifest object
   * @returns {Promise<{assetsMap: object, optionsPagePath: string|null, popupPagePath: string|null}>}
   */
  async generateAssetsMap(manifest) {
    console.log("Generating unified assets map...");

    // Reset assets map
    this.assetsMap = {};
    this.processedFiles.clear();

    // Process options page
    const { optionsPagePath } = await this.processOptionsPage(manifest);

    // Process popup page
    const { popupPagePath } = await this.processPopupPage(manifest);

    // Process web accessible resources
    await this.processWebAccessibleResources(manifest);

    console.log(
      `Generated assets map with ${Object.keys(this.assetsMap).length} entries`,
    );

    return {
      assetsMap: { ...this.assetsMap },
      optionsPagePath,
      popupPagePath,
    };
  }
}

module.exports = {
  fileToBase64,
  guessMimeType,
  normalizePath,
  isTextAsset,
  AssetGenerator,
};
