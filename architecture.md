# Browser Extension to Userscript Converter - Architecture

## Project Overview

The Browser Extension to Userscript Converter is a tool that automatically converts simple to moderately complex browser extensions into functional userscripts or standalone vanilla JavaScript code. The core principle is **zero modification** requirement for the original extension's JavaScript code by providing a comprehensive polyfill environment.

### Build Targets

1. **Userscript Target**: Generates `.user.js` files for userscript managers (Tampermonkey, Greasemonkey, Violentmonkey) leveraging `GM_*` functions
2. **Vanilla JS Target**: Generates standalone `.js` files using standard browser APIs (IndexedDB, fetch, window.open) with significant limitations
3. **PostMessage Target**: For iframe-based communication (used internally for options pages)

## Core Architecture

### I. Converter Tool (Node.js CLI)

The converter is a command-line tool that processes extension directories and generates userscripts.

#### Key Components

1. **Entry Point (`converter.js`)**
   - Parses command-line arguments (input extension path, output file path)
   - Orchestrates the conversion process
   - Currently only supports userscript target (Phase 1)

2. **Manifest Parser (`manifestParser.js`)**
   - Parses `manifest.json` into structured JavaScript objects
   - Extracts: name, version, description, content_scripts, background scripts, options_ui, permissions, icons
   - Validates and normalizes file paths

3. **Resource Processor (`resourceProcessor.js`)**
   - Reads JavaScript, CSS, and HTML files
   - Handles content scripts and background scripts
   - Processes resources maintaining execution order
   - Uses script blacklist for known problematic files

4. **Options Generator (`optionsGenerator.js`)**
   - Processes options page HTML and inlines local assets
   - Extracts asset paths for external resource detection
   - Creates asset map entries for runtime access

5. **Assets Generator (`assetsGenerator.js`)**
   - Creates EXTENSION_ASSETS_MAP with base64-encoded assets
   - Generates runtime.getURL override logic
   - Handles both text and binary assets appropriately

6. **Template Manager (`templateManager.js`)**
   - Manages template files for different targets and components
   - Caches templates to avoid repeated file reads
   - Supports target-specific templates (userscript, vanilla, postmessage)

7. **Abstraction Layer (`abstractionLayer.js`)**
   - Provides target-specific implementations for storage, fetch, UI operations
   - Maps high-level operations to GM_* functions (userscript) or native APIs (vanilla)
   - Handles PostMessage delegation for iframe contexts

8. **Polyfill System**
   - **buildPolyfillString.js**: Generates unified polyfill code
   - **polyfill.js**: Template management for polyfill functions
   - **enhancedPolyfill.template.js**: Main polyfill implementation with chrome.* APIs

9. **Message Bus System**
   - Unified internal event system for extension messaging
   - Supports multiple contexts (background, content, options)
   - PostMessage-based communication for iframe isolation

10. **Script Assembler (`scriptAssembler.js`)**
    - Generates combined execution logic respecting run_at timing
    - Handles CSS injection and JS execution by phases
    - Creates proper execution context with polyfill integration

11. **Output Builder (`outputBuilder.js`)**
    - Assembles final userscript from all components
    - Integrates metadata, polyfill, scripts, and orchestration logic
    - Handles template replacements and code generation

12. **Metadata Generator (`metadataGenerator.js`)**
    - Generates userscript metadata block from manifest data
    - Determines required @grant directives based on abstraction layer usage
    - Processes icons and match patterns

### II. Generated Script Architecture

The output userscript follows this structure:

```javascript
// ==UserScript==
// @name, @match, @grant, @connect, etc.
// ==/UserScript==

(function() {
    'use strict';
    
    // 1. Message Bus Implementation
    // 2. Abstraction Layer Functions (_storageSet, _fetch, etc.)
    // 3. Asset Helper Functions (EXTENSION_ASSETS_MAP, runtime.getURL override)
    // 4. buildPolyfill Function Definition
    // 5. Background Scripts Auto-Execution
    // 6. Main Orchestration Logic
    //    - URL matching
    //    - Polyfill context creation
    //    - Combined script execution (CSS + JS by run_at timing)
    //    - Options page handling
    
})();
```

### III. Polyfill Strategy

The polyfill system provides chrome.* and browser.* API compatibility:

#### Core APIs Implemented
- **chrome.runtime**: sendMessage, onMessage, getManifest, getURL, connect, onConnect
- **chrome.storage**: local.get/set/remove/clear with change events, sync (mapped to local), managed (empty)
- **chrome.tabs**: query (current tab only), create (with options page detection), sendMessage
- **Message Bus**: Internal event system for cross-context communication
- **Port System**: runtime.connect/onConnect implementation

#### Context Awareness
- **Background Context**: `buildPolyfill({ isBackground: true })`
- **Content Script Context**: `buildPolyfill({ isBackground: false })`
- **Options Page Context**: `buildPolyfill({ isOtherPage: true })` (in iframe)

#### Abstraction Layer Targets

1. **Userscript Target**
   - Uses GM_setValue, GM_getValue, GM_xmlhttpRequest, GM_openInTab, etc.
   - Full cross-origin request capability via @connect
   - Menu command registration for options page

2. **Vanilla Target** (Phase 2)
   - IndexedDB for storage (no sync capability)
   - Standard fetch (CORS limitations)
   - window.open for new tabs (popup blocker issues)
   - No menu command equivalent

3. **PostMessage Target**
   - For iframe contexts (options pages)
   - Delegates operations to parent window
   - Maintains API compatibility within iframe

### IV. Options Page Handling

Options pages are processed and displayed in an iframe modal:

1. **Processing**: HTML is read, local assets are inlined as data URLs
2. **Modal Creation**: Styled modal with iframe using `srcdoc`
3. **Polyfill Injection**: Complete polyfill environment injected into iframe
4. **Communication**: PostMessage-based abstraction layer for parent communication
5. **Trigger**: GM_registerMenuCommand for userscript target

### V. Asset Management

Assets are handled through EXTENSION_ASSETS_MAP:

- **Text Assets**: Stored as plain text (HTML, JS, CSS, JSON, SVG)
- **Binary Assets**: Base64-encoded (images, fonts, etc.)
- **Runtime Access**: chrome.runtime.getURL creates Blob URLs from map data
- **Options Integration**: Options page HTML stored with inlined sub-assets

### VI. Current Implementation Status

#### Phase 1 Complete (Basic Userscript Conversion)
- ✅ Manifest parsing for basic extensions
- ✅ Content script processing with proper ordering
- ✅ Background script auto-execution
- ✅ Basic chrome.* API polyfill
- ✅ Userscript metadata generation
- ✅ Options page iframe modal system
- ✅ Asset handling with runtime.getURL
- ✅ Message bus for internal communication
- ✅ GM_* abstraction layer
- ✅ Icon embedding in userscript metadata

#### Phase 2 Planned (Expanded Functionality)
- 🔄 Vanilla JS target implementation
- 🔄 IndexedDB storage backend
- 🔄 Enhanced API coverage
- 🔄 Dynamic content script registration
- 🔄 Improved cross-origin handling

#### Phase 3 Planned (Advanced Features)
- ⏳ Comprehensive API coverage
- ⏳ MV3 basic support exploration
- ⏳ Enhanced resource management
- ⏳ Security improvements

#### Phase 4 Planned (Production Ready)
- ⏳ GUI interface
- ⏳ Comprehensive testing
- ⏳ Performance optimization
- ⏳ Documentation and examples

## Key Design Decisions

### Zero Code Modification
Original extension code runs unmodified within polyfilled environment. This is achieved through:
- Complete chrome.* API simulation
- Proper context isolation and management
- Abstraction layer hiding implementation details

### Template-Based Code Generation
Templates allow clean separation of concerns and target-specific implementations:
- `abstractionLayer.{target}.template.js` for different backends
- `messageBus.{target}.template.js` for communication strategies
- `orchestration.template.js` for main execution logic

### Unified Polyfill Architecture
Single polyfill function generates context-aware API objects:
- Eliminates code duplication
- Provides consistent API surface
- Enables proper message bus integration

### Progressive Enhancement
System designed for incremental capability addition:
- Phase-based development allows working system at each stage
- Template system accommodates new targets easily
- Abstraction layer isolates implementation complexity

## Limitations and Challenges

### Userscript Target Limitations
- Depends on userscript manager capabilities
- GM API async wrapper complexity
- @connect domain detection accuracy

### Vanilla JS Target Limitations
- CORS restrictions (major blocker)
- No privileged action equivalents
- Storage lacks sync capability
- Manual injection/loading required
- Limited utility for most extensions

### General Limitations
- Incomplete API coverage (by design for complexity management)
- MV3 service worker lifecycle challenges
- Performance overhead from polyfill layer
- Security implications of broad grants
- Resource handling complexity

### Technical Challenges
- Maintaining async consistency across polyfills
- Proper script execution timing
- Cross-context message delivery
- Asset URL resolution in different environments
- Options page script execution within iframe context

## Future Considerations

- Browser-specific namespace support enhancement
- Basic MV3 compatibility exploration
- Enhanced error handling and validation
- Performance optimization and code splitting
- Comprehensive testing infrastructure
- User-friendly GUI wrapper
- Plugin system for custom handlers
- Advanced security model
