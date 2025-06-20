


# to-userscript

<details>
  <summary>
    Demo
  </summary>

##### 2x Speed (conversion takes 4s total normal speed, incl. downloading)
  
https://github.com/user-attachments/assets/e0adebcb-843d-4b04-830b-0b6ef5344652


##### Demo but normal speed

  https://github.com/user-attachments/assets/874dc6fd-ad6c-4e07-9d27-da1184f3036d

  
</details>

A powerful CLI for converting browser extensions into standalone userscripts.

## Examples:

| Extension                                                                                                                          | View output code                                                                                                | Install                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [Material Design File Icons](https://chromewebstore.google.com/detail/material-icons-for-github/bggfcpfjbdkhfhfmkjpbhnkhnpjjeomc/) | [View](https://github.com/Explosion-Scratch/to-userscript/blob/main/examples/material-design-fileicons.user.js) | [Install](https://raw.githubusercontent.com/Explosion-Scratch/to-userscript/main/examples/material-design-fileicons.user.js) |
| [JSON Formatter](https://chromewebstore.google.com/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa)                         | [View](https://github.com/Explosion-Scratch/to-userscript/blob/main/examples/json-formatter.user.js)            | [Install](https://raw.githubusercontent.com/Explosion-Scratch/to-userscript/main/examples/json-formatter.user.js)            |
| [Modern for Wikipedia](https://chromewebstore.google.com/detail/modern-for-wikipedia/emdkdnnopdnajipoapepbeeiemahbjcn?hl=en)       | [View](https://github.com/Explosion-Scratch/to-userscript/blob/main/examples/modern-wikipedia.user.js)          | [Install](https://raw.githubusercontent.com/Explosion-Scratch/to-userscript/main/examples/modern-wikipedia.user.js)          |
| [Return Dislikes](https://chromewebstore.google.com/detail/return-youtube-dislike/gebbhagfogifgggkldgodflihgfeippi)                | [View](https://github.com/Explosion-Scratch/to-userscript/blob/main/examples/return-dislikes.user.js)           | [Install](https://raw.githubusercontent.com/Explosion-Scratch/to-userscript/main/examples/return-dislikes.user.js)           |
| [Web Search Navigator](https://chromewebstore.google.com/detail/web-search-navigator/cohamjploocgoejdfanacfgkhjkhdkek?hl=en)       | [View](https://github.com/Explosion-Scratch/to-userscript/blob/main/examples/web-search-navigator.user.js)      | [Install](https://raw.githubusercontent.com/Explosion-Scratch/to-userscript/main/examples/web-search-navigator.user.js)      |
| [uBlacklist](https://chromewebstore.google.com/detail/ublacklist/pncfbmialoiaghdehhbnbhkkgmjanfhe)                                 | [View](https://github.com/Explosion-Scratch/to-userscript/blob/main/examples/ublacklist.user.js)                | [Install](https://raw.githubusercontent.com/Explosion-Scratch/to-userscript/main/examples/ublacklist.user.js)                |
| [Iridium](https://chromewebstore.google.com/detail/iridium-for-youtube/gbjmgndncjkjfcnpfhgidhbgokofegbl?hl=en-US)                  | [View](https://github.com/Explosion-Scratch/to-userscript/blob/main/examples/iridium.user.js)                   | [Install](https://raw.githubusercontent.com/Explosion-Scratch/to-userscript/main/examples/iridium.user.js)                   |
| [Modern for Hackernews](https://chromewebstore.google.com/detail/modern-for-hacker-news/dabkegjlekdcmefifaolmdhnhdcplklo/)         | [View](https://github.com/Explosion-Scratch/to-userscript/blob/main/examples/modern-hackernews.user.js)         | [Install](https://raw.githubusercontent.com/Explosion-Scratch/to-userscript/main/examples/modern-hackernews.user.js)         |

## What is this?

`to-userscript` bridges the gap between complex, packaged browser extensions and simple, portable userscripts. It takes an extension from the Chrome or Firefox store, a local directory, or a zip/xpi, and creates a single `.user.js` file that can be run in any userscript manager. This allows you to use, or modify extensions on browsers or platforms that might not natively support them.

## Key Features

- **Multi-Source Conversion:** Convert from Chrome Web Store, Firefox Add-ons site, direct URLs, local directories, or archive files (`.crx`, `.xpi`, `.zip`).
- **Comprehensive API Polyfills:** Intelligently replaces common WebExtension APIs (`chrome.storage`, `chrome.runtime`, `chrome.tabs`, etc.) with userscript-compatible equivalents (`GM_*` functions, IndexedDB, and custom event buses).
- **Automatic Asset Inlining:** Seamlessly embeds CSS, images, fonts, and other resources directly into the script using data URIs or Blob URLs, ensuring complete portability (replacing runtime.getURL and options/popup pages).
- **UI Emulation:** Renders extension popup and options pages within an embedded modal (after inlining all asset links), preserving most UI functionality.
- **Background Script Support:** Emulates the background script environment, allowing persistent logic to run as intended and two way messaging.
- **Internationalization (i18n):** Respects `_locales` directories and uses the specified or default locale for names, descriptions, and in-script text.
- **Code Optimization:** Optional minification (`terser`) and code formatting (`prettier`) for the final output.

## Installation

`to-userscript` requires Node.js v16 or higher.

You can install it globally using your preferred package manager:

```bash
# npm
npm install -g to-userscript
```

```bash
# pnpm
pnpm add -g to-userscript
```

```bash
# bun
bun install -g to-userscript
```

Alternatively, you can run it directly without a global installation using `npx`, `pnpm dlx`, or `bunx`.

## Usage & Commands

### `convert`

Converts an extension into a userscript. This is the primary command.

**Syntax:** `to-userscript convert <source> [options]`

**`<source>` Types:**

- **URL:** A Chrome Web Store or Firefox Add-ons URL.
- **Direct URL:** A direct link to a `.crx`, `.xpi`, or `.zip` file.
- **Local Directory:** A path to an unpacked extension directory.
- **Local Archive:** A path to a local `.crx`, `.xpi`, or `.zip` file.

| Option            | Alias | Description                                                                             |
| :---------------- | :---- | :-------------------------------------------------------------------------------------- |
| `--output`        | `-o`  | Specify the output `.user.js` file path.                                                |
| `--target`        | `-t`  | Set build target. `userscript` (default) includes metadata, `vanilla` outputs plain JS. |
| `--minify`        |       | Minify the JavaScript output using `terser`.                                            |
| `--beautify`      |       | Beautify the JavaScript output using `prettier`.                                        |
| `--locale`        | `-l`  | Preferred locale for name/description (e.g., `en`, `fr`, `de`).                         |
| `--ignore-assets` |       | Asset extensions to ignore during inlining (e.g., `mp4,webm,ttf`).                      |
| `--force`         | `-f`  | Overwrite the output file if it exists.                                                 |
| `--keep-temp`     |       | Keep temporary files for debugging purposes.                                            |

#### Examples

**1. Convert from the Chrome Web Store with minification:**

```bash
to-userscript convert "https://chromewebstore.google.com/detail/modern-for-wikipedia/emdkdnnopdnajipoapepbeeiemahbjcn?hl=en" -o modern-wikipedia.user.js --minify
```

**2. Convert a local directory with French localization:**

```bash
to-userscript convert ./my-unpacked-extension/ -o my-script.user.js --locale fr
```

**3. Convert a downloaded XPI to vanilla JS (using `pnpm dlx`):**

```bash
pnpm dlx to-userscript convert ./my-addon.xpi --target vanilla -o my-addon.js
```

### `download`

A utility to only download the extension archive without converting it.

**Syntax:** `to-userscript download <source>`

#### Example

```bash
# Using bunx to download Material Design File Icons
bunx to-userscript download "https://chromewebstore.google.com/detail/material-icons-for-github/bggfcpfjbdkhfhfmkjpbhnkhnpjjeomc/" -o ublock-origin.xpi
```

### `require`

Generates a metadata block to `@require` another local userscript.

This command is especially useful for developers creating an extension. You can establish a hot-reload-like workflow:

1.  Run `to-userscript convert ./my-dev-extension/ -o lib.user.js` to create your main library script.
2.  Run `to-userscript require ./lib.user.js > loader.user.js` to create a tiny loader script.
3.  Install `loader.user.js` in Tampermonkey.
4.  Now, as you make changes to your extension, just re-run the `convert` command. When you reload the page, Tampermonkey will automatically use the updated `lib.user.js` file.

**Syntax:** `to-userscript require <path-to-userscript>`

#### Example

```bash
# Generate a main script that @requires the converted script
to-userscript require ./material-design-fileicons.user.js | pbcopy
```

## How It Works

The conversion process involves several sophisticated steps, from downloading and unpacking the source to parsing the manifest, processing all resources, inlining assets, and assembling the final script from a series of polyfills and templates.

For a detailed explanation of the internal conversion pipeline, see our **[Architecture Guide](docs/architecture.md)**.

## Troubleshooting & Advanced Usage

### Content Security Policy (CSP) Issues

Some websites have strict CSP rules that can prevent converted userscripts from functioning correctly (e.g., by blocking style injection or `eval`-like functions). If your script isn't working as expected on a specific site, you may need to adjust Tampermonkey's security settings.

1.  In Tampermonkey, go to the **Dashboard**.
2.  Click the **Settings** tab.
3.  Change **Config mode** from "Beginner" to **"Advanced"**.
4.  Scroll down to the **Security** section.
5.  For the option **Modify existing Content Security headers**, select **"Remove entirely"**.

## Resulting userscript output format:

```js
// ==UserScript==
// ... Metadata Block ...
// ==/UserScript==

(function () {
  // IIFE for scope isolation
  "use strict";

  // 1. UNIFIED POLYFILL is defined here
  //    - messaging.template.js -> createEventBus, createRuntime
  //    - abstractionLayer.*.template.js -> _storageSet, _fetch, etc.
  //    - assetsGenerator code -> EXTENSION_ASSETS_MAP, _createAssetUrl
  //    - polyfill.template.js -> buildPolyfill() which creates chrome.*

  // 2. BACKGROUND SCRIPT ENVIRONMENT is defined and executed
  //    - Runs all background scripts inside the polyfill's scope.
  //    - This happens immediately on script start.

  // 3. ORCHESTRATION LOGIC is defined and executed
  //    - Checks if location.href matches a content_script pattern.
  //    - If it matches:
  //        - Calls `executeAllScripts()`.
  //        - This function injects CSS and runs JS in phases:
  //          - document-start
  //          - document-end
  //          - document-idle
  //    - Registers GM_registerMenuCommand for options/popup pages.
  //    - Options/Popup pages are rendered in a modal with an iframe.
  //    - The iframe's content is populated with the inlined HTML and
  //      a specialized 'postmessage' version of the polyfill.
})();
```

## Polyfill status:

### Supported APIs

- [x] `chrome.storage`
  - [x] `local` (backed by `GM_*` storage or IndexedDB)
  - [x] `sync` (maps to local storage)
  - [x] `managed` (shimmed; read-only and empty)
  - [x] `onChanged`
- [x] `chrome.runtime`
  - [x] `sendMessage`/`onMessage` (in-page/iframe communication only)
  - [x] `getURL` (for bundled assets only)
  - [x] `getManifest`
  - [x] `openOptionsPage`: Opens options popup
- [x] `chrome.tabs`
  - [x] `create` (maps to `GM_openInTab` or `window.open`)
  - [x] `query` (shimmed; returns current tab only)
  - [x] `sendMessage` (shimmed; redirects to `runtime.sendMessage`)
- [x] `chrome.i18n`
  - [x] `getMessage`
  - [x] `getUILanguage`
- [x] `chrome.contextMenus` (emulated via `GM_registerMenuCommand`; limited functionality)
- [x] `chrome.permissions`
  - [x] `request`/`contains`/`getAll` (shimmed)
- [x] `chrome.notifications` (maps to native Web Notifications API)
- [x] `chrome.cookies`
  - [x] `get`
  - [x] `getAll`
  - [x] `set`
  - [x] `remove`
  - [x] `getAllCookieStores`
  - [x] `getPartitionKey`

### Planned APIs

- [ ] `chrome.tabs.insertCSS`
- [ ] `chrome.tabs.reload`
- [ ] `chrome.tabs.onActivated`
- [ ] `chrome.scripting.insertCSS`
- [ ] `chrome.scripting.executeScript`
- [ ] `chrome.identity`:
  - [ ] `getAuthToken`
  - [ ] `getProfileUserInfo`
  - [ ] `clearAllCachedAuthTokens`
- [ ] `chrome.runtime.onMessageExternal`: Shim
- [ ] `chrome.runtime.sendMessageExternal`: Shim
- [ ] `chrome.webNavigation`
- [ ] (partial) `chrome.permissions`:
  - Get listeners working
  - Removing permission for an origin should persist this change and not match the script on it
- [ ] (mostly implemented) `chrome.storage`: Proper listeners
- [ ] `chrome.action`
  - `onClicked.addListener`: Add menu item for click

## General tasks

- API bindings: `import makeUserscript from 'to-userscript';`
  - Vite plugin
  - Take dir and output
- Create reusable listener logic for supporting callbacks/promises

## Contributing

I welcome contributions! Especially to implement new chrome apis, or fix bugs.
