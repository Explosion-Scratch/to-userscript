## Design Document: Browser Extension to Userscript/Vanilla JS Converter

**1. Introduction & Goal**

- **Goal:** To create a tool that automatically converts simple to moderately complex browser extensions (primarily Manifest V2, potentially with considerations for V3) into functional userscripts _or_ standalone vanilla JavaScript code.
- **Core Principle:** The conversion should require **zero modification** to the original extension's JavaScript code. This is achieved by running the original code within a simulated environment provided by a comprehensive polyfill layer.
- **Build Targets:** The converter will support two output formats:
  - **Userscript:** A standard `.user.js` file for use with managers like Tampermonkey, Greasemonkey, Violentmonkey, leveraging `GM_*` functions where beneficial.
  - **Vanilla JS:** A single `.js` file attempting to replicate functionality using standard browser APIs (`IndexedDB`, `fetch`, `window.open`), suitable for direct inclusion or loading where userscript managers are unavailable, but with significant limitations.
- **Target Users:** Userscript enthusiasts, developers needing to test/run extension logic in different contexts, potentially users in restricted environments without userscript managers (for the vanilla target).

**2. Core Concepts & Approach**

- **Manifest Parsing:** Reads `manifest.json` for structure (scripts, permissions, match patterns, options UI, icons, host permissions).
- **Code Encapsulation:** Original JS files (background, content, options) are wrapped within functions.
- **API Polyfilling & Abstraction:**
  - A function `buildPolyfill({ isBackground, inFrame })` generates a context-aware polyfill object `{ chrome, browser }`.
  - This polyfill function is directly included in the generated userscript/vanilla script as a string using `buildPolyfill.toString()`.
  - The polyfill simulates `chrome.*` and `browser.*` APIs.
  - An internal **"GM/Vanilla Abstraction Layer"** is used by the polyfill. Based on the chosen build target (userscript/vanilla), this layer routes calls to either `GM_*` functions or their defined vanilla JS equivalents (e.g., `IndexedDB` wrappers, `fetch`).
- **Simulated Environment:** The generated script orchestrates the execution of encapsulated functions and provides the polyfills.
- **Metadata/Directives (Userscript Target Only):** Generates userscript metadata (`@name`, `@match`, etc.) through a dedicated metadata generator function that analyzes the extension structure.
- **Resource Handling:** Aims to inline resources (CSS, JS snippets) or convert them to Data URIs. External resources in options pages may trigger `@connect` directives for the userscript target.

**3. Architecture of the Converter Tool**

- **Input:** Path to the extension directory or packaged file.
- **Configuration:**
  - **Build Target:** User selects "Userscript" or "Vanilla JS".
- **Components:**
  - **Manifest Parser:** As before.
  - **Script Bundler/Encapsulator:** As before.
  - **GM/Vanilla Abstraction Layer Definition:** Contains the mapping logic (e.g., `storage.set = target === 'userscript' ? gmSet : indexedDbSet;`). Defines vanilla equivalents for GM functions using `IndexedDB` for storage.
  - **Polyfill Library:** Implements the `buildPolyfill({ isBackground, inFrame })` function which will be directly included in the generated script using `.toString()`.
  - **Metadata Generator:** Analyzes the extension and generates appropriate metadata directives:
    - **Match Patterns:** Aggregates static match patterns from manifest and detects code that could dynamically register content scripts at runtime.
    - **Required Permissions:** Analyzes code to determine necessary GM\_\* functions and required host permissions.
    - **Options Page Integration:** Scans the options page HTML for external resources that need @connect directives.
  - **Options Page Processor:** Handles HTML/CSS/JS conversion. Detects external `<script src="...">` for `@connect` generation (userscript target only). Attempts to inline resources where possible.
  - **Output Generator:** Assembles the final `.user.js` or `.js` file:
    - _Userscript Target:_ Includes Metadata Block (with `@grant`, `@connect`), `buildPolyfill.toString()`, Abstraction Layer (GM path), Encapsulated Code, Orchestration Logic.
    - _Vanilla JS Target:_ Includes `buildPolyfill.toString()`, Abstraction Layer (Vanilla path with `IndexedDB`), Encapsulated Code, Orchestration Logic. No metadata block.

**4. Architecture of the Generated Script**

- **(Userscript Only) Metadata Block (`// ==UserScript== ... // ==/UserScript==`):**
  - `@name`, `@version`, `@description`: From manifest.
  - `@namespace`: Generated/user-defined.
  - `@match`: Includes:
    - **Static Patterns:** All match patterns defined in manifest.json content_scripts section.
    - **Dynamic Patterns:** Detected from code that uses `chrome.scripting.registerContentScripts` or similar APIs.
    - **Frame Handling:** Automatically adds appropriate `@include`/`@exclude` directives to control script execution in sub-frames based on `all_frames` property in content scripts or explicit detection of frame targeting code.
  - `@grant`: Dynamically determined list of `GM_*` functions used by the _userscript target's_ abstraction layer (e.g., `GM_setValue`, `GM_getValue`, `GM_xmlhttpRequest`, `GM_registerMenuCommand`, `GM_openInTab`, `GM_getResourceURL`). `grant none` if no GM functions are needed.
  - `@connect`: Generated based on:
    - `host_permissions` in manifest
    - URLs referenced in `permissions` array
    - Detected external script/resource domains in the options page HTML
    - Explicit host references found in code that might make cross-origin requests
  - `@run-at`: Determined by analyzing content script `run_at` properties (defaulting to most permissive timing).
  - `@icon`: Data URI from manifest.
  - `@resource`: For assets referenced by the extension.
- **Polyfill Implementation (Included as a string via `buildPolyfill.toString()`):**
  - Fully defined function: `function buildPolyfill({ isBackground, inFrame }) { ... return { chrome, browser }; }`
  - Contains the complete logic for simulating APIs, with context awareness of:
    - Whether running in a background context (`isBackground`)
    - Whether running in a sub-frame (`inFrame`)
  - Calls functions from the Abstraction Layer for actual operations
  - Internal state management for extension messaging
- **Background Script Execution:**
  - Immediately invoked when the userscript runs, wrapped in a controlled environment
  - Persistence simulated through storage APIs
  - Long-running background processes simulated through periodic userscript execution or event-driven calls
  - Messaging between background and content contexts handled through simulated internal event bus
- **Content Script Execution Logic:**
  - URL matching algorithm that respects both static match patterns and dynamic registration
  - Frame execution control based on original extension's `all_frames` property:
    - If `all_frames: true` - Execute in all frames
    - If `all_frames: false` - Restrict to top-level frame only
    - Dynamic detection of explicit frame targeting code to override defaults when necessary
  - Proper script execution ordering based on `run_at` and explicit ordering properties
- **Encapsulated Original Code (`var extensionCode = { ... };`):** As before.
- **Main Orchestration Logic:**
  - IIFE.
  - Determine context (are we running because of a match?).
  - Create appropriate instance: `const { chrome, browser } = buildPolyfill({ isBackground: isBackgroundContext, inFrame: window !== window.top });`
  - Run "background" script logic only in top-level frames (or as configured).
  - Run "content script" logic when URL matches and frame context is appropriate.
  - Implement internal messaging between contexts.
  - Handle options page trigger (`GM_registerMenuCommand` for userscript).

**5. Polyfill Strategy - Detailed (Using Abstraction Layer)**

- **`buildPolyfill({ isBackground, inFrame })`:** Returns `{ chrome, browser }`. This function is defined as follows:

```javascript
function buildPolyfill({ isBackground, inFrame }) {
  // Implementation of Chrome/Browser API simulation
  // that respects the context it's running in
  return { chrome, browser };
}
```

- **`chrome.runtime` / `browser.runtime`:**
  - `sendMessage`, `onMessage`: Internal event bus. No change in core logic, implementation details hidden by polyfill.
  - `getURL(path)`:
    - _Userscript Target:_ May use `GM_getResourceURL` if assets are `@resource`d, otherwise needs path manipulation if inlined/data-URI'd.
    - _Vanilla Target:_ Relies heavily on inlining/Data URIs. Accessing external relative files is generally not possible. _Weakness:_ Asset handling is much harder for vanilla.
  - `getManifest()`: Returns parsed manifest.
- **`chrome.tabs` / `browser.tabs`:**
  - `query(queryInfo, callback)`: Returns **only** the current tab's simulated info: `{ id: 'current_tab_id', url: window.location.href, active: true, windowId: 'current_window_id', ... }`.
  - `create({ url }, callback)`:
    1.  Check if `url` matches the relative path of the options page from the manifest.
    2.  If YES: Trigger internal logic to display the options modal/iframe.
    3.  If NO: Delegate to Abstraction Layer:
        - _Userscript Target:_ Calls `GM_openInTab(url)`.
        - _Vanilla Target:_ Calls `window.open(url)`.
  - `sendMessage`, `executeScript`: As before, targeting only the current tab simulation.
- **`chrome.storage` / `browser.storage` (`local`, `sync`, `managed`)**:
  - Map `get`, `set`, `remove`, `clear` to the Abstraction Layer.
  - _Abstraction Layer - Userscript Target:_ Uses `GM_setValue`, `GM_getValue`, `GM_deleteValue`. Must wrap synchronous GM calls in Promises to match the async nature of `chrome.storage`. `sync` maps to GM local. `managed` is likely read-only empty.
  - _Abstraction Layer - Vanilla Target:_ Uses `IndexedDB` (providing wrappers for get/set/remove/clear). A dedicated database and object store would be created. `IndexedDB` is inherently asynchronous, aligning well with the `chrome.storage` API. `sync` maps to this `IndexedDB` instance. _Weakness:_ While `IndexedDB` offers significantly more storage space than `localStorage`, the data does not sync across devices/browsers like `chrome.storage.sync`. Implementing robust `IndexedDB` operations adds complexity to the generated script. Data is still potentially cleared by the user clearing site data. `managed` is likely read-only empty.
- **`chrome.scripting` / `browser.scripting`:** `registerContentScripts`, `executeScript` simulation remains the same core logic, operating on internal state and encapsulated functions.
- **`chrome.action` / `browser.action` / etc.:**
  - `onClicked`:
    - _Userscript Target:_ Map to `GM_registerMenuCommand`.
    - _Vanilla Target:_ Likely a no-op or console warning. _Weakness:_ No good equivalent.
- **XHR / Fetch:** Calls like `fetch` within the original extension code, or polyfills for `chrome.runtime.sendMessage` requiring background fetches.
  - _Userscript Target:_ Polyfill for background fetches or direct fetches can use `GM_xmlhttpRequest`, respecting `@connect` directives for CORS bypass.
  - _Vanilla Target:_ Uses standard `fetch` or `XMLHttpRequest`. _Major Weakness:_ Subject to standard CORS restrictions. Many extensions needing cross-origin requests will fail in the vanilla target unless the target servers explicitly allow the origin the script runs on. `@connect` has no effect.

**6. Options Page Handling**

- **Trigger:**
  - _Userscript Target:_ `GM_registerMenuCommand`.
  - _Vanilla Target:_ No standard trigger. Could log instructions to console? _Weakness._
- **Container & Content Loading:**
  - Creates modal container element in the DOM
  - Creates iframe with `srcdoc` attribute containing inlined options page content
  - Polyfill injection is performed by inserting a `<script>` tag into the iframe document:
  ```javascript
  const polyfillScript = document.createElement("script");
  polyfillScript.textContent = `
    const { chrome, browser } = (${buildPolyfill.toString()})({ isBackground: true, inFrame: true });
    window.chrome = chrome;
    window.browser = browser;
  `;
  iframe.contentDocument.head.appendChild(polyfillScript);
  ```
- **External Scripts (`<script src="https://some.cdn/library.js">`)**:
  - Metadata generator examines options page HTML during build
  - For each external script:
    - Extract the domain
    - Add to generated `@connect` list in userscript metadata
    - For vanilla target, attempt to inline the scripts if possible
- **API Access:** Polyfill is injected into iframe via script tag as shown above, providing chrome/browser API simulation that uses the same abstraction layer as the main script.

**7. Key Challenges & Limitations (Expanded)**

- **API Completeness:** Unchanged. Many APIs remain impossible to polyfill.
- **Manifest V3:** Unchanged. Service worker lifecycle remains a major hurdle.
- **Vanilla JS Target Limitations:**
  - **CORS:** This is the biggest blocker. Lack of `GM_xmlhttpRequest` + `@connect` means most cross-origin requests made by the extension (or its options page) will fail.
  - **Privileged Actions:** No equivalent for `GM_registerMenuCommand`, making options/actions harder to trigger.
  - **Storage:** `IndexedDB`, while offering more space than `localStorage`, lacks the automatic synchronization of `chrome.storage.sync`, requires more complex implementation within the polyfill/abstraction layer compared to `GM_*` storage, and is still susceptible to user clearing site data.
  - **Execution Context:** How is the vanilla script loaded/run? Needs manual injection or inclusion, losing the automatic URL matching of userscripts. Its `window` context might differ significantly from a content script environment.
  - **Asset Loading:** Relies almost entirely on inlining/Data URIs, which can bloat the script size.
  - **Utility:** The vanilla target may only be viable for very simple extensions that primarily manipulate the current page's DOM and use minimal storage/no cross-origin requests.
- **Userscript Target Limitations:**
  - **GM API Async Wrapper:** Ensuring the polyfill correctly wraps synchronous GM functions (like older storage) into the required asynchronous `chrome.*` API patterns (callbacks/Promises) is crucial and error-prone.
  - `@connect` Management: Automatically determining all necessary `@connect` rules might be imperfect.
- **General:**
  - Performance Overhead.
  - Environment Discrepancies (timing, globals).
  - Content Script Injection Timing precision.
  - Resource Handling complexity (especially for vanilla).
  - Security Implications (userscript `GM_*` grants, vanilla script access to page).
  - **Complexity:** Maintaining two distinct backends (GM vs Vanilla with `IndexedDB`) within the polyfill's abstraction layer significantly increases the converter's internal complexity and testing burden.

**8. Future Considerations**

- Support for `browser.*` namespace (Now explicitly included).
- Basic MV3 support exploration.
- Converter UI.
- Improved asset handling (@resource, better inlining).
- Warning system for unsupported APIs _and_ features likely to fail in vanilla target.
- Configuration options (e.g., force specific storage backend).

**9. Assumptions**

- User has userscript manager (for userscript target).
- Target extensions are primarily JS-based.
- Users understand limitations, _especially_ the severe restrictions of the vanilla JS target regarding CORS, storage synchronization, and privileged actions.

### 2024-Updates

1. Options Page Handling
   • The options page HTML is stored **as plain text** inside `EXTENSION_ASSETS_MAP` instead of base-64. All sub-assets are still inlined as data-URIs. 
   • A helper `openOptionsPage()` is generated (exposed via `window.OPEN_OPTIONS_PAGE_<extname>` and registered through `GM_registerMenuCommand`) which renders the HTML via an `<iframe srcdoc>` modal.

2. Asset Map & runtime.getURL
   • `EXTENSION_ASSETS_MAP` now maps paths → data string. Text assets are emitted verbatim, binaries remain base64.  The run-time override decides whether to wrap text or decode base64 when producing a `Blob` URL.

3. API Polyfills
   • Added `chrome.runtime.connect` / `browser.runtime.connect` and the corresponding `onConnect` implementation using the existing hub() event-bus.

4. Background Script Support
   • All scripts declared in `manifest.background.scripts` are auto-executed once at start inside a polyfill context (`isBackground: true`). Messages flow to content scripts via the shared event bus / connect polyfill.

5. Icon Embedding
   • The converter now embeds the largest icon declared in `manifest.icons` directly into the userscript metadata as a `data:` URI.
