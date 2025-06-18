## Design Document: `to-userscript` CLI

### 1. Introduction & Goals

This document outlines the design for a new, full-featured Command-Line Interface (CLI) for the `to-userscript` converter. The primary goal is to create a powerful, flexible, and user-friendly tool that streamlines the conversion process from various sources to a final, polished userscript.

**Core Principles:**

*   **Unified Interface:** A single, intuitive entry point (`to-userscript`) for all operations.
*   **Flexible Input Sources:** Natively support conversion from web store URLs (Chrome, Firefox), local archives (`.crx`, `.xpi`, `.zip`), and unpacked directories.
*   **Output Control:** Provide granular control over the output file, including minification and target selection.
*   **Developer Experience:** Offer clear, real-time feedback, including progress indicators for long-running tasks, verbose logging for debugging, and robust error handling.
*   **Modular & Testable Architecture:** Decouple the CLI front-end from the core conversion engine, enabling independent development, testing, and reuse of the converter as a library.

### 2. CLI User Experience & Commands

The CLI will be driven by a primary `convert` command, supported by a rich set of options to tailor the conversion process.

#### 2.1. Command Synopsis

```bash
to-userscript convert <source> [options]
```

#### 2.2. Source Argument

*   `<source>`: A mandatory argument specifying the extension to be converted. The CLI will automatically detect the source type.
    *   **URL:** A full URL to a Chrome Web Store or Firefox Add-on page.
        *   `https://chrome.google.com/webstore/detail/...`
        *   `https://addons.mozilla.org/en-US/firefox/addon/...`
    *   **File Path:** A local path to a packaged extension archive.
        *   `./path/to/my-extension.crx`
        *   `./path/to/my-extension.xpi`
        *   `./path/to/my-extension.zip`
    *   **Directory Path:** A local path to an unpacked extension directory.
        *   `./path/to/my-unpacked-extension/`

#### 2.3. Command Options

*   `-o, --output <file>`
    *   **Description:** Specifies the path for the final `.user.js` output file.
    *   **Default:** If not provided, the output will be named based on the extension's name and version (e.g., `My-Extension-1.0.0.user.js`) and placed in the current working directory.
*   `--minify`
    *   **Description:** Minifies the JavaScript output using `terser` while carefully preserving the userscript metadata block.
    *   **Default:** `false`.
*   `--target <type>`
    *   **Description:** Specifies the build target for the abstraction layer.
    *   **Values:** `userscript`, `vanilla`.
    *   **Default:** `userscript`.
*   `-f, --force`
    *   **Description:** Overwrites the output file if it already exists, without prompting.
    *   **Default:** `false`.
*   `--no-cleanup`
    *   **Description:** Prevents the deletion of the temporary directory where the extension is downloaded and unpacked. Essential for debugging the intermediate state.
    *   **Default:** `false`.
*   `--temp-dir <path>`
    *   **Description:** Specifies a custom directory for temporary files instead of the system's default temporary directory.
    *   **Default:** System's temporary directory (e.g., `/tmp`).

#### 2.4. Usage Examples

```bash
# Convert from a Chrome Web Store URL and minify the output
$ npx to-userscript convert "https://chrome.google.com/webstore/detail/..." -o dark-reader.user.js --minify

# Convert a local XPI file for the vanilla target
$ npx to-userscript convert ./ublock.xpi --target vanilla -o ublock.vanilla.js

# Convert a local directory and inspect the intermediate files
$ npx to-userscript convert ./my-dev-extension/ -o my-script.user.js --no-cleanup
```

### 3. System Architecture

The CLI's architecture is designed for modularity and a clear separation of concerns. All CLI-specific logic will reside in `src/cli/`, while the core conversion engine will be refactored into a pure, reusable library function.

```plaintext
                   +------------------+
                   |   CLI (yargs)    |
                   | src/cli/index.js |
                   +--------+---------+
                            | (config object)
                            v
+------------------+  +------------------+
| Workflow         |  | Core Converter   |
| Orchestrator     +-->| Library          |
| src/cli/workflow.js|  | src/convert.js   |
+--------+---------+  +------------------+
         |
         | Calls...
         |
+--------v---------+  +------------------+  +------------------+
| Downloader       |  | Unpacker         |  | Minifier         |
| src/cli/download.js|  | src/cli/unpack.js|  | src/cli/minify.js|
+------------------+  +------------------+  +------------------+
```

### 4. Component Deep Dive

#### 4.1. `src/cli/index.js` (Entry Point)

*   **Responsibility:** Command parsing and initial dispatch.
*   **Technology:** `yargs`.
*   **Implementation:**
    *   Utilize `yargs.command()` to define the `convert <source> [options]` structure.
    *   Define all options specified in section 2.3 using the `yargs` builder function, including aliases, descriptions, types, and defaults.
    *   The command's `handler` function will receive the parsed `argv` object, which serves as the configuration for the entire process.
    *   This handler will invoke the `run` function from the `Workflow Orchestrator`, passing the configuration object.

#### 4.2. `src/cli/workflow.js` (Workflow Orchestrator)

*   **Responsibility:** Manages the end-to-end conversion process, including temporary file handling and step-by-step execution.
*   **Key Function:** `async function run(config)`
*   **Implementation:**
    1.  Create a temporary directory using `fs.promises.mkdtemp`.
    2.  Wrap the entire workflow in a `try...finally` block. The `finally` block will handle the deletion of the temporary directory unless `config.noCleanup` is true.
    3.  **Source Handling:**
        *   If `source` is a URL, call `download.js` to fetch the archive into the temp directory.
        *   If `source` is an archive file, copy it to the temp directory.
        *   If `source` is a directory, this becomes the `inputDir`.
    4.  **Unpacking:** If the source was an archive, call `unpack.js` to extract it into an `unpacked/` subdirectory within the temp folder. This becomes the `inputDir`.
    5.  **Conversion:** Call the refactored `convertExtension` library function from `src/convert.js`, passing the `inputDir` and `outputFile` path.
    6.  **Minification:** If `config.minify` is true, read the generated script, pass its content to `minify.js`, and overwrite the output file with the minified result.

#### 4.3. `src/cli/download.js` (Downloader)

*   **Responsibility:** Resolving web store URLs to direct download links and fetching the files with progress indication.
*   **Separation of Concerns:**
    *   `async function getDownloadableUrl(webstoreUrl)`: This function will contain the logic to parse a store URL (Chrome or Firefox) and return a direct, downloadable URL for the `.crx` or `.xpi` file. It will encapsulate the existing `getCrxUrl` logic and new logic for Firefox addons.
    *   `async function downloadFile(url, destinationPath)`: This function performs the actual download.
*   **Implementation:**
    *   Use `axios` for HTTP requests with `responseType: 'stream'`.
    *   Use `cli-progress` to create and update a progress bar.
    *   The `downloadFile` function will get the `Content-Length` header for the total size.
    *   It will pipe the response stream to a `fs.createWriteStream`.
    *   By listening to the `'data'` event on the stream, it will increment the progress bar with the `chunk.length`.

#### 4.4. `src/cli/unpack.js` (Unpacker)

*   **Responsibility:** Decompressing extension archives.
*   **Key Function:** `async function unpack(archivePath, destinationDir)`
*   **Implementation:**
    *   Detect archive type by file extension (`.zip`, `.xpi`, `.crx`).
    *   Use `adm-zip` to handle `.zip` and `.xpi` (which are zip-compatible).
    *   For `.crx`, use a dedicated library like `crx-unpack` or a similar modern tool that can handle the CRXv3 format header before the zip data.
    *   After unpacking, verify a `manifest.json` exists at the root of `destinationDir` to confirm a successful unpack.

#### 4.5. `src/cli/minify.js` (Minifier)

*   **Responsibility:** Optional minification of the final script.
*   **Key Function:** `async function minifyScript(jsCode)`
*   **Implementation:**
    *   Use a regular expression `/(^\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==)/m` to extract the metadata block.
    *   If a header is found, minify the rest of the code using `terser.minify()`.
    *   Configure `terser`'s `format.preamble` option with the extracted metadata block to ensure it is prepended to the minified code perfectly, including all comments and formatting.
    *   Return the concatenated header and minified code.

### 5. Core Converter (`convert.js`) Refactoring Plan

Refactoring the existing `converter.js` into a pure, testable library is a critical step.

#### 5.1. Current State

The current `converter.js` is a monolithic script that:
1.  Parses CLI arguments using `yargs`.
2.  Contains the entire conversion orchestration logic.
3.  Performs all file system I/O directly.
4.  Logs directly to the console.
5.  Terminates the process with `process.exit()` on error.

#### 5.2. Target State (`src/convert.js`)

The new module will be a library with a single exported function. It will be stateless, and its behavior will be determined entirely by its input configuration.

#### 5.3. Refactoring Steps

1.  **Create `src/convert.js`:** Move the contents of the old `converter.js` into this new file.
2.  **Define New Signature:** Remove the `main()` function and `yargs` setup. Export a new primary function:
    ```javascript
    export async function convertExtension(config) {
      // config = { inputDir, outputFile, target }
    }
    ```
3.  **Replace `argv`:** Go through the script and replace all instances of `argv.inputDir`, `argv.outputFile`, etc., with `config.inputDir`, `config.outputFile`.
4.  **Isolate Core Logic:** The core logic (manifest parsing, resource processing, metadata generation, output building) will remain but will now be inside the `convertExtension` function.
5.  **Decouple from `process`:** Remove all calls to `process.exit()`. Instead of exiting, the function will `throw` specific, descriptive errors (e.g., `throw new Error("Manifest file not found at path: ...")`).
6.  **Abstract Logging:** Replace `console.log` and `console.error` with calls to an optional logger passed in the `config` object. This allows the CLI to control verbosity while the library remains clean.
    ```javascript
    const { logger = console } = config;
    logger.log('Parsing manifest...');
    ```
7.  **Return Value:** On success, the function should return a status object (e.g., `{ success: true, outputFile: config.outputFile, warnings: [] }`). This provides a clear success signal to the calling orchestrator.
8.  **File I/O Responsibility:** The function will still be responsible for reading files from `config.inputDir` and writing the final script to `config.outputFile`, but it will no longer be concerned with creating or cleaning up the input directory.

***

Of course. Here is a new, brief section for the design document detailing the plan for a modern logging strategy using the `debug` package.

***

### 6. Logging and Debugging Strategy

To provide consistent, controllable, and informative logging throughout the application, we will adopt the `debug` package. This approach replaces scattered `console.log` statements with a unified, namespace-driven system that is standard in the Node.js ecosystem.

#### 6.1. Core Principles

*   **Namespace-Driven:** Each module will have its own unique debug namespace, allowing developers to selectively enable logs for specific parts of the converter.
*   **Environment-Controlled:** Logging is enabled via the `DEBUG` environment variable, completely decoupling log activation from the application's code and CLI flags.
*   **Zero Production Overhead:** When the corresponding `DEBUG` namespace is not enabled, the logging calls are dynamically replaced with no-op functions, incurring zero performance penalty.

#### 6.2. Implementation Plan

1.  **Installation:**
    ```bash
    npm install debug --save
    ```

2.  **Namespace Convention:**
    We will adopt a hierarchical naming convention: `to-userscript:<module>:<sub-module>`.

    *   **CLI Orchestrator:** `to-userscript:cli:workflow`
    *   **Downloader:** `to-userscript:downloader`
    *   **Unpacker:** `to-userscript:unpacker`
    *   **Core Converter:** `to-userscript:converter`
    *   **Asset Generator:** `to-userscript:assets`

3.  **Usage in Code:**
    Each module will instantiate its own logger at the top of the file.

    ```javascript
    // In src/cli/download.js
    const debug = require('debug')('to-userscript:downloader');

    // ... later in the code
    debug('Resolved download URL for CRX: %s', downloadableUrl);
    debug('Starting download to temporary path: %s', destinationPath);
    ```

#### 6.3. Enabling Logs

Logs are activated from the command line by setting the `DEBUG` environment variable.

*   **Enable all logs from this project:**
    ```bash
    DEBUG=to-userscript:* npx to-userscript convert <source>
    ```
*   **Enable logs only for a specific module (e.g., the unpacker):**
    ```bash
    DEBUG=to-userscript:unpacker npx to-userscript convert <source>
    ```
*   **Enable logs for multiple modules:**
    ```bash
    DEBUG=to-userscript:downloader,to-userscript:converter npx to-userscript convert <source>
    ```

#### 6.4. Refactoring and Impact

*   **Replace `console.log`:** All internal, diagnostic `console.log`, `console.warn`, and `console.error` calls will be replaced with calls to the appropriate `debug` instance.
*   **Preserve User-Facing Output:** Critical user feedback that should *always* be displayed (e.g., final success messages, fatal error messages, the path to the output file) will remain on `process.stdout` and `process.stderr`. This ensures the tool provides essential feedback even when debugging is disabled.
