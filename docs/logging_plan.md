Of course. Here is a detailed, info-dense design document briefing plan on how to replace all `console` logs across the generation scripts with the `debug` package. This plan can be added to the project's documentation.

---

## Design Document: Modern Logging Strategy with `debug`

### 1. Introduction & Goals

The current logging implementation across the `to-userscript` codebase relies on a mix of `console.log`, `console.warn`, `console.error`, and spinner text. This approach has several drawbacks:

- **Lack of Control:** Logs are always on, cluttering the output unless manually commented out.
- **No Granularity:** It is impossible to view logs for only a specific part of the conversion process (e.g., only asset generation).
- **Inconsistency:** The distinction between developer diagnostics and user-facing messages is not strictly enforced.

This document outlines a plan to refactor the project's logging to use the `debug` package, a lightweight, standard, and highly effective debugging utility in the Node.js ecosystem.

**Primary Goals:**

1.  **Standardize Logging:** Implement a single, consistent logging mechanism for all internal, developer-focused diagnostics.
2.  **Provide Granular Control:** Enable developers to selectively turn on logs for specific modules using namespaces (e.g., `to-userscript:assets`, `to-userscript:cli:unpack`).
3.  **Decouple from Code:** Control log visibility via the `DEBUG` environment variable, eliminating the need for code changes to toggle logs.
4.  **Zero Production Overhead:** Ensure that disabled log statements are effectively no-ops, incurring no performance penalty.
5.  **Clarify Log Intent:** Formally distinguish between internal debug logs and essential user-facing output (progress, results, errors).

### 2. Core Principles of the `debug` Package

The `debug` package works on a simple but powerful concept:

- **Namespaces:** Each logger is created with a unique namespace string.
- **Environment Variable:** The `DEBUG` environment variable is used to specify which namespaces to enable. Wildcards (`*`) are supported.
- **Conditional Execution:** When a script starts, `debug` checks the `DEBUG` variable. If a logger's namespace doesn't match, its logging calls are replaced with an empty function (a no-op), making them virtually free.

### 3. Namespace & Implementation Plan

A hierarchical namespace convention will be adopted to ensure clarity and granular control.

**Convention:** `to-userscript:<module>[:<sub-module>]`

#### 3.1. Module-to-Namespace Mapping

| File Path                    | Proposed Namespace             |
| :--------------------------- | :----------------------------- |
| `src/cli/index.js`           | `to-userscript:cli`            |
| `src/cli/workflow.js`        | `to-userscript:cli:workflow`   |
| `src/cli/download.js`        | `to-userscript:cli:download`   |
| `src/cli/unpack.js`          | `to-userscript:cli:unpack`     |
| `src/cli/minify.js`          | `to-userscript:cli:minify`     |
| `src/convert.js`             | `to-userscript:convert`        |
| `src/abstractionLayer.js`    | `to-userscript:abstraction`    |
| `src/assetsGenerator.js`     | `to-userscript:assets`         |
| `src/buildPolyfillString.js` | `to-userscript:polyfill:build` |
| `src/getIcon.js`             | `to-userscript:icon`           |
| `src/locales.js`             | `to-userscript:locales`        |
| `src/manifestParser.js`      | `to-userscript:manifest`       |
| `src/metadataGenerator.js`   | `to-userscript:metadata`       |
| `src/outputBuilder.js`       | `to-userscript:output`         |
| `src/resourceProcessor.js`   | `to-userscript:resources`      |
| `src/scriptAssembler.js`     | `to-userscript:assembler`      |
| `src/templateManager.js`     | `to-userscript:templates`      |
| `src/utils.js`               | `to-userscript:utils`          |

#### 3.2. Code Implementation

At the top of each file, the logger will be instantiated:

```javascript
// Example in: src/assetsGenerator.js
const debug = require("debug")("to-userscript:assets");
```

All internal logging calls will be converted to use this `debug` instance, preferably with format specifiers for rich output.

```javascript
// Before
console.log(
  `Successfully converted asset to base64: ${path.relative(process.cwd(), filePath)} (${Math.round(buffer.length / 1024)}KB -> ${Math.round(base64String.length / 1024)}KB)`
);

// After
debug(
  "Converted asset to base64: %s (%dKB -> %dKB)",
  path.relative(process.cwd(), filePath),
  Math.round(buffer.length / 1024),
  Math.round(base64String.length / 1024)
);
```

#### 3.3. Enabling Logs

Logs can be enabled from the command line:

- **All Project Logs:** `DEBUG=to-userscript:* to-userscript convert ...`
- **Only CLI Workflow & Unpacking:** `DEBUG=to-userscript:cli:workflow,to-userscript:cli:unpack to-userscript convert ...`
- **All except Asset Generation:** `DEBUG=to-userscript:*,-to-userscript:assets to-userscript convert ...`

### 4. Refactoring Strategy: What to Convert

The most critical part of this refactor is deciding which `console` calls become `debug` calls and which remain as user-facing output.

**Conversion Rules:**

1.  **Convert to `debug()`:** Any log statement intended for a developer to trace the application's internal state or execution flow.

    - **Examples:** "Starting X process...", "File Y found", "Resolved URL to Z", "Generated asset map with N items", "Using fallback for Y", variable dumps, non-fatal error details.
    - This applies to most `console.log()` and many `console.warn()` calls in the current codebase.

2.  **Retain `ora`:** Any log that communicates real-time progress of a long-running task to the user.

    - **Examples:** `spinner.start('Downloading extension...')`, `spinner.succeed('Extraction complete')`, `spinner.fail('Conversion failed')`.
    - These are essential for user experience and should not be hidden behind a debug flag.

3.  **Retain `console` with `chalk`:** Any log that presents the final, critical result or a fatal error to the user.

    - **Examples:** The final summary report of a successful conversion (`chalk.green('Conversion complete!')`, output path, file size).
    - Fatal, user-actionable errors caught in top-level `try...catch` blocks (`console.error(chalk.red('Error: Output file exists. Use --force to overwrite.'))`).

4.  **Retain `console.warn` with `chalk`:** Warnings that the user _must_ be aware of because they may significantly impact the output's quality or functionality.
    - **Examples:** "Warning: No content scripts found in manifest. Output might be empty or non-functional.", "Warning: Could not find locale 'fr', falling back to 'en'."

### 5. Action Plan & Impact

#### 5.1. `src/convert.js`

- The `logger` parameter in the `convertExtension(config)` function will be **removed**. The function should not be responsible for handling different logger implementations.
- An internal `debug` instance (`to-userscript:convert`) will be created and used for all internal logging.
- **Impact:** This decouples the core library from the CLI's presentation logic, making it more reusable and easier to test. Information needed by the CLI (like warnings) should be returned in the result object.

#### 5.2. `src/assetsGenerator.js`

- All `console.log` statements (e.g., "Successfully converted...", "Extracted X asset paths...") will be converted to `debug()`.
- `console.warn` for unknown MIME types or empty files will be converted to `debug()` as this is diagnostic information, not a critical user-facing issue.
- `console.error` inside `catch` blocks will be converted to `debug()` and the error will be re-thrown to be handled by the orchestrator.

#### 5.3. `src/cli/workflow.js`

- This file already uses `debug` correctly. It serves as a model for the other files. User-facing progress is handled by `ora` and `chalk`.

#### 5.4. All Other Source Files

- A systematic pass will be made through every file listed in the namespace map.
- Each `console.log`, `console.warn`, and `console.error` will be evaluated against the **Conversion Rules** in section 4.
- The `debug` package will be added as a dependency, and a `debug` instance will be instantiated at the top of each refactored file.
