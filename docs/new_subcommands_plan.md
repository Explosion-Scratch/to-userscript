### **Design Doc: New `download` and `require` Commands**

### 1. Overview

This document outlines the plan to extend the `to-userscript` CLI with two new commands:

1.  **`download`**: A utility command to download a browser extension archive (`.crx`, `.xpi`, `.zip`) from a given source (Chrome Web Store, Firefox Add-ons, or a direct URL) without performing any conversion. This provides a convenient way for users to obtain the source archive directly.
2.  **`require`**: A metadata utility command that reads an existing userscript, removes any existing `@require` tags from its metadata block, adds a new `@require` tag pointing to the input file itself via a `file://` URL, and prints the modified metadata block to standard output. This is useful for creating "loader" or "wrapper" scripts.

The implementation will prioritize reusing existing logic for downloading and will introduce new, self-contained modules for new functionality to maintain code organization.

### 2. Command 1: `download`

The `download` command will encapsulate the initial download step of the existing `convert` workflow into a standalone feature.

#### 2.1. CLI Definition (`cli/index.js`)

The `cli/index.js` file will be updated to include the `download` command definition within the `yargs` configuration.

```javascript
// In cli/index.js, inside the yargs chain

.command(
    "download <source>",
    "Download an extension archive from a URL",
    (yargs) => {
        return yargs
            .positional("source", {
                describe: "Extension source URL (Chrome/Firefox store or direct)",
                type: "string",
                demandOption: true,
            })
            .option("output", {
                alias: "o",
                describe: "Output path for the downloaded file. If a directory is provided, a filename will be generated.",
                type: "string",
            })
            .option("force", {
              alias: "f",
              describe: "Overwrite output file if it exists",
              type: "boolean",
              default: false,
            });
    },
    async (argv) => {
        try {
            // This new workflow function will be created
            await workflow.runDownload(argv);
        } catch (error) {
            console.error(chalk.red("Download failed:"), error.message);
            if (process.env.DEBUG) {
                console.error(error.stack);
            }
            process.exit(1);
        }
    }
)
.command(
    "convert <source>",
    // ... existing convert command definition
)
// ... rest of the file
```

The example usage will also be updated:
`['$0 download "https://addons.mozilla.org/..." -o my-addon.xpi', 'Download an extension from the Firefox store']`

#### 2.2. Implementation Plan (`cli/workflow.js`)

A new exported function, `runDownload`, will be added to `cli/workflow.js`. This function will orchestrate the download process, reusing components from `cli/download.js`.

**`runDownload(config)` Logic:**

1.  **Initialization**: Start an `ora` spinner for user feedback.
2.  **Source Analysis**: Reuse `determineSourceType(config.source)` to validate and classify the source URL. This handles Chrome, Firefox, and direct URLs.
3.  **URL Resolution**: Reuse `download.getDownloadableUrl(sourceInfo)` to get the final, direct URL for the extension archive.
4.  **Output Path Determination**:
    - Make a `HEAD` request to the `downloadUrl` to guess the file extension from the `Content-Type` header, reusing the `guessFileExtension` logic from `download.js`.
    - If `config.output` is provided:
      - If it ends with a `/` or `\` or is an existing directory, treat it as a directory. Generate a filename like `extension-${Date.now()}.${ext}` and join it with the directory path.
      - Otherwise, treat it as a full file path.
    - If `config.output` is not provided, use the current working directory (`process.cwd()`) and the generated filename.
5.  **Overwrite Check**: Reuse `checkOutputFile(outputPath, config.force)` to prevent accidental overwrites unless `--force` is used.
6.  **File Download**: Call `download.downloadFile(downloadUrl, outputPath)`. This function already contains a progress bar and handles the streaming download.
7.  **Completion**: Stop the spinner and log a success message with the final path of the downloaded file.

#### 2.3. File Changes

- **`cli/index.js`**:
  - **Add**: New `yargs` command definition for `download`.
  - **Modify**: Add a new example for the `download` command.
- **`cli/workflow.js`**:
  - **Add**: New `runDownload(config)` async function to orchestrate the download-only workflow.
  - **Modify**: Export `runDownload`.
- **`cli/download.js`**:
  - **Modify**: Export `guessFileExtension` so it can be used in `workflow.js` to determine the output filename before downloading.

### 3. Command 2: `require`

The `require` command is a metadata utility. It will have its own dedicated logic file to keep concerns separated from the main conversion process.

#### 3.1. CLI Definition (`cli/index.js`)

A new `yargs` command will be added. It will be placed after `convert` and `download`.

```javascript
// In cli/index.js, inside the yargs chain

.command(
    "require <userscript>",
    "Generate a metadata block with a @require pointing to the file",
    (yargs) => {
        return yargs.positional("userscript", {
            describe: "Path to the .user.js file to reference",
            type: "string",
            demandOption: true,
            normalize: true, // Automatically resolves the path
        });
    },
    async (argv) => {
        try {
            // This new module and function will be created
            const requireBlock = await require('cli/require.js').generateRequireBlock(argv.userscript);
            process.stdout.write(requireBlock);
        } catch (error) {
            console.error(chalk.red("Failed to generate require block:"), error.message);
            if (process.env.DEBUG) {
                console.error(error.stack);
            }
            process.exit(1);
        }
    }
)
// ... rest of the file
```

The example usage will also be updated:
`['$0 require ./path/to/my-script.user.js', 'Outputs a metadata block that @requires my-script.user.js']`

#### 3.2. Implementation Plan (New File: `cli/require.js`)

A new file will be created at `src/cli/require.js` to house the logic for this command.

**`generateRequireBlock(filePath)` Logic:**

1.  **File Validation**:
    - Use `fs.promises.stat` to ensure `filePath` exists and is a file. Throw a user-friendly error if not.
2.  **File Reading**:
    - Read the file content using `fs.promises.readFile(filePath, 'utf-8')`.
3.  **Metadata Extraction**:
    - Use the regex `/(^\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==)/m` to find and extract the existing metadata block. If no block is found, throw an error.
4.  **Metadata Parsing and Filtering**:
    - Split the block into an array of lines.
    - Use `Array.prototype.filter` to create a new array of lines that **do not** match the pattern `/\/\/\s*@require\s+/.test(line)`. This effectively removes all existing `@require` directives.
5.  **Path Resolution**:
    - Use `path.resolve(filePath)` to get the absolute path to the input file.
    - Use the existing `utils.normalizePath()` function to convert any backslashes (`\`) to forward slashes (`/`) for URL compatibility.
6.  **New Block Assembly**:
    - Create the new `@require` directive: `// @require      file://${normalizedAbsolutePath}`. Note the use of multiple spaces for alignment, which is conventional.
    - Construct the final metadata block string:
      - `// ==UserScript==\n`
      - Join the filtered lines.
      - Append the new `@require` line.
      - `// ==/UserScript==\n`
7.  **Return Value**:
    - Return the complete, newly-generated metadata block as a string.

#### 3.3. File Changes

- **`cli/index.js`**:
  - **Add**: New `yargs` command definition for `require`.
- **`src/cli/require.js` (New File)**:
  - **Create**: This new file will contain the `generateRequireBlock` function and its dependencies (`fs`, `path`, `utils`).

---

### 4. Summary of Changes

- **Modified Files**:
  - `src/cli/index.js`: Add definitions and examples for the `download` and `require` commands.
  - `src/cli/workflow.js`: Add and export `runDownload` function.
  - `src/cli/download.js`: Export `guessFileExtension`.
- **New Files**:
  - `src/cli/require.js`: Implement the core logic for the `require` command.
