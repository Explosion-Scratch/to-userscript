# Project Plan & Todo List

## Instructions for Maintaining This File

### When to Update
- **Before starting any new feature**: Add tasks to appropriate section
- **After completing tasks**: Mark as ✅ and move to completed section
- **When bugs are discovered**: Add to Bug Fixes section immediately
- **During code review**: Update complexity ratings if needed
- **Weekly planning**: Review and prioritize outstanding tasks

### Task Requirements
Each task must include:
- **Clear description** of what needs to be done
- **Complexity rating** (1-10): 1=simple refactor, 10=major architectural change
- **Dependencies** on other tasks (if any)
- **Acceptance criteria** for completion
- **Estimated effort** (if > complexity 5)

### Complexity Guidelines
- **1-2**: Simple bug fixes, minor refactors, documentation updates
- **3-4**: Small features, moderate refactors, template updates
- **5-6**: Medium features, API additions, significant refactors
- **7-8**: Large features, architectural changes, new targets
- **9-10**: Major architectural overhauls, complex integrations

### Planning New Features
1. Add high-level feature to "Future Features" section
2. Break down into smaller tasks (complexity ≤ 6 preferred)
3. Add dependencies and order appropriately
4. Estimate total effort for feature

---

## Phase 1: Complete ✅
- ✅ Basic CLI converter tool
- ✅ Manifest parsing for content scripts
- ✅ Userscript target with GM_* functions
- ✅ Basic polyfill for chrome.* APIs
- ✅ Options page iframe modal system
- ✅ Asset handling and runtime.getURL
- ✅ Background script auto-execution
- ✅ Template-based code generation
- ✅ Icon embedding in userscript metadata

---

## Current Phase: Phase 2 - Expanded Functionality

### Core Phase 2 Features

#### Template Path Resolution [Complexity: 2] ✅
- **Description**: Ensure all template paths resolve correctly in different environments
- **Status**: COMPLETED - Enhanced with validation and fallback logic
- **Location**: `src/templateManager.js`
- **Implementation**: Added path validation, fallback mechanisms, and comprehensive error messages
- **Acceptance**: All templates load in dev/prod environments with proper error handling

#### Error Handling in File Operations [Complexity: 3] ✅
- **Description**: Add comprehensive error handling for file read/write operations
- **Status**: COMPLETED - Comprehensive error handling implemented
- **Locations**: Enhanced throughout resourceProcessor, assetsGenerator, optionsGenerator
- **Implementation**: Wrapped operations in try-catch with meaningful error messages, validation, and graceful failure handling
- **Acceptance**: Graceful failure with helpful error messages and recovery mechanisms

#### Vanilla JS Target Implementation [Complexity: 8] ✅
- **Description**: Complete vanilla target with IndexedDB storage backend
- **Status**: COMPLETED - Full IndexedDB implementation with error handling
- **Files**: `src/templates/abstractionLayer.vanilla.template.js`
- **Implementation**:
  - IndexedDB initialization and error handling ✅
  - Storage operations (get/set/remove/clear) ✅
  - Async wrapper consistency ✅
  - Comprehensive validation and error recovery ✅
  - Enhanced fetch with better error handling ✅
  - Tab opening with popup blocker fallbacks ✅
- **Acceptance**: Extensions work in vanilla JS mode with storage persistence and robust error handling
- **Effort**: Completed in single implementation session

#### Enhanced API Coverage [Complexity: 6] ✅
- **Description**: Add more chrome.* APIs to polyfill
- **Status**: COMPLETED - chrome.notifications, chrome.contextMenus, and runtime.sendMessage enhanced
- **APIs implemented**:
  - chrome.notifications (basic operations) ✅ - COMPLETED
  - chrome.contextMenus (menu registration) ✅ - COMPLETED
  - chrome.runtime.sendMessage (complete MDN spec compliance) ✅ - COMPLETED
  - chrome.runtime.onMessageExternal ✅ - COMPLETED
  - chrome.runtime.getPlatformInfo ✅ - COMPLETED
  - chrome.runtime.getBrowserInfo ✅ - COMPLETED
- **Files**: `src/templates/polyfill.template.js`, `src/templates/enhancedPolyfill.template.js`
- **Implementation**: 
  - Full API compatibility with native browser notifications and menu command fallbacks
  - Complete runtime.sendMessage implementation following Chrome/MDN specification
  - Proper argument parsing for all sendMessage signatures including callback support
  - Support for callback-based and Promise-based API patterns
  - Support for external extension messaging with onMessageExternal
  - Enhanced error handling and message serialization validation
  - Proper lastError handling for callback-based API usage
  - Platform and browser detection APIs
- **Acceptance**: Listed APIs functional in userscript target with proper error handling and full MDN compliance

#### Web Accessible Resources Support [Complexity: 7] ✅
- **Description**: Process web_accessible_resources from manifest with asset inlining support for CSS files
- **Status**: COMPLETED - Full implementation with glob pattern support
- **Files**: 
  - `src/manifestParser.js` - Added web_accessible_resources parsing
  - `src/utils.js` - Added glob pattern matching utilities  
  - `src/assetsGenerator.js` - Unified asset processing with web accessible resources support
  - `src/templates/polyfill.template.js` - Enhanced runtime.getURL implementation
  - `src/templates/orchestration.template.js` - Added utility functions
  - `src/buildPolyfillString.js` - Enhanced asset URL creation
  - `src/converter.js` - Integrated processing pipeline
- **Implementation**:
  - Glob pattern matching for resource patterns (*, **) ✅
  - CSS file processing with url() inlining ✅  
  - Binary and text asset handling ✅
  - Manifest v2 and v3 format support ✅
  - Enhanced runtime.getURL() with web accessible resource detection ✅
- **Acceptance**: Web accessible resources properly processed with CSS asset inlining and glob support
- **Effort**: Completed in comprehensive implementation session

#### Unified Asset Generation System [Complexity: 6] ✅
- **Description**: Consolidate all asset processing into a single, unified system
- **Status**: COMPLETED - All asset processing unified in AssetGenerator class
- **Files**:
  - `src/assetsGenerator.js` - New unified AssetGenerator class with all functionality
  - `src/buildPolyfillString.js` - Updated to use unified asset generation
  - `src/outputBuilder.js` - Simplified to use AssetGenerator
  - `src/optionsGenerator.js` - REMOVED (legacy code eliminated)
  - `src/converter.js` - Removed separate asset processing calls
- **Implementation**:
  - Single AssetGenerator class handles all asset types ✅
  - Options page processing with recursive asset inlining ✅
  - Web accessible resources processing with glob patterns ✅
  - Unified asset map generation for polyfill ✅
  - Removed backwards compatibility code ✅
  - Eliminated duplicate asset processing logic ✅
- **Acceptance**: All asset processing consolidated with no functionality loss
- **Effort**: Completed in single refactoring session

#### Popup Page Support [Complexity: 4] ✅
- **Description**: Implement popup page system using same modal infrastructure as options
- **Status**: COMPLETED - Full popup page support with unified asset processing
- **Files**:
  - `src/manifestParser.js` - Added browser_action, page_action, action parsing ✅
  - `src/assetsGenerator.js` - Added getPopupPagePath and processPopupPage methods ✅
  - `src/outputBuilder.js` - Added popup page path handling ✅
  - `src/templates/orchestration.template.js` - Added popup modal and menu registration ✅
- **Implementation**:
  - Manifest v2 (browser_action, page_action) and v3 (action) support ✅
  - Popup page asset inlining with same system as options ✅
  - Modal styling optimized for popup dimensions (400x600px) ✅
  - Menu command registration for popup access ✅
  - Reused existing modal infrastructure and polyfill injection ✅
  - Removed legacy optionsGenerator.js code ✅
- **Acceptance**: Popup pages work identically to options pages with proper modal display
- **Effort**: Completed by reusing existing options infrastructure

#### Dynamic Content Script Registration [Complexity: 7]
- **Description**: Support chrome.scripting.registerContentScripts at runtime
- **Files**: Enhanced polyfill, orchestration template
- **Subtasks**:
  - Script registration tracking [Complexity: 3]
  - URL matching for dynamic scripts [Complexity: 4]
  - Execution timing management [Complexity: 4]
- **Dependencies**: Enhanced API coverage
- **Acceptance**: Extensions can register/execute dynamic content scripts

#### Improved Cross-Origin Handling [Complexity: 5]
- **Description**: Better @connect domain detection and CORS documentation
- **Files**: `src/metadataGenerator.js`, documentation
- **Subtasks**:
  - Analyze code for fetch/XHR usage [Complexity: 3]
  - Extract domains from various sources [Complexity: 3]
  - Generate comprehensive @connect list [Complexity: 2]
- **Acceptance**: Auto-generated @connect covers extension needs

#### Messaging System Enhancement

#### MessagingHandler Implementation [Complexity: 2]
- **Description**: Create internal `MessagingHandler` class handling `sendMessage` parsing, callback/promise logic, and listener management with support for async responses.
- **Dependencies**: Unified message bus
- **Acceptance**: Class instantiated per context, provides `.sendMessage`, `.addListener`, `.removeListener`, `.hasListener` with full Chrome spec compliance.

#### runtime.sendMessage Polyfill Refactor [Complexity: 3]
- **Description**: Replace existing `runtime.sendMessage` logic with wrapper that delegates to `MessagingHandler`; add `chrome.extension.sendMessage` alias.
- **Dependencies**: MessagingHandler Implementation
- **Acceptance**: All signature variations supported; callbacks receive responses; promise-based usage resolved; onMessage listeners support return patterns (value, promise, true for async).

### Testing Infrastructure [Complexity: 6]
- **Description**: Create comprehensive test suite
- **Subtasks**:
  - Unit tests for core modules [Complexity: 4]
  - Integration tests with sample extensions [Complexity: 5]
  - Automated conversion testing [Complexity: 3]
  - Cross-userscript-manager testing [Complexity: 4]
- **Files**: `test/` directory (new)
- **Acceptance**: 80% code coverage, CI/CD pipeline

### Documentation Improvements [Complexity: 4]
- **Description**: Create user-facing documentation
- **Subtasks**:
  - Installation and usage guide [Complexity: 2]
  - Supported features matrix [Complexity: 2]
  - Troubleshooting guide [Complexity: 3]
  - API compatibility chart [Complexity: 3]
- **Files**: `docs/` directory (new)
- **Acceptance**: Complete documentation site

---

## Phase 3: Advanced Features

### MV3 Basic Support [Complexity: 9]
- **Description**: Explore Manifest V3 compatibility
- **Major challenges**: Service worker lifecycle, background persistence
- **Research required**: 2 weeks
- **Implementation**: 4-6 weeks
- **Priority**: MEDIUM

### Enhanced Resource Management [Complexity: 7]
- **Description**: Improve asset handling for larger extensions
- **Features**:
  - @resource directive support [Complexity: 4]
  - Asset lazy loading [Complexity: 5]
  - Code splitting for large extensions [Complexity: 6]
- **Priority**: MEDIUM

### Security Improvements [Complexity: 6]
- **Description**: Enhance security model and validation
- **Features**:
  - CSP compatibility analysis [Complexity: 4]
  - Privilege escalation prevention [Complexity: 5]
  - Code sanitization options [Complexity: 4]
- **Priority**: HIGH (before production)

### Advanced Polyfill Features [Complexity: 8]
- **Description**: Add complex chrome.* APIs
- **APIs**:
  - chrome.declarativeNetRequest [Complexity: 8]
  - chrome.webNavigation [Complexity: 6]
  - chrome.history [Complexity: 4]
  - chrome.bookmarks [Complexity: 5]
- **Priority**: LOW

---

## Phase 4: Production Ready

### GUI Interface [Complexity: 8]
- **Description**: Web-based or desktop GUI for converter
- **Technology**: Electron or web interface
- **Features**:
  - Drag-drop extension upload [Complexity: 3]
  - Visual configuration options [Complexity: 4]
  - Preview generated userscript [Complexity: 4]
  - Batch conversion support [Complexity: 5]
- **Effort**: 6-8 weeks

### Performance Optimization [Complexity: 6]
- **Description**: Optimize generated userscript size and performance
- **Features**:
  - Code minification [Complexity: 3]
  - Dead code elimination [Complexity: 5]
  - Polyfill tree shaking [Complexity: 6]
  - Lazy polyfill loading [Complexity: 5]

### Comprehensive Error Handling [Complexity: 5]
- **Description**: Production-ready error handling and recovery
- **Features**:
  - Error reporting and telemetry [Complexity: 4]
  - Graceful degradation [Complexity: 4]
  - Recovery mechanisms [Complexity: 5]

---

## Bug Fixes & Immediate Issues

### High Priority Bugs

#### DS_Store File in Repository [Complexity: 1] ✅
- **Description**: Remove `.DS_Store` file from `src/` directory
- **Status**: COMPLETED - File removed from repository
- **Fix**: Added to .gitignore and removed from repo
- **Files**: `src/.DS_Store`

#### Manifest Parsing Edge Cases [Complexity: 3]
- **Description**: Handle malformed manifests gracefully
- **Location**: `src/manifestParser.js`
- **Cases**: Missing required fields, invalid JSON, circular references
- **Acceptance**: Meaningful error messages for all edge cases

#### Template Replacement Security [Complexity: 4]
- **Description**: Secure template replacement to prevent injection
- **Location**: `src/outputBuilder.js`
- **Fix**: Escape replacement values properly
- **Security implication**: Prevents code injection in generated scripts

#### Proxy Global Trap Invalid Descriptor [Complexity: 3]
- **Description**: `with`

- [ ] Event Bus core implementation (complexity: 4)  
  Handles registration (.on), deregistration (.off), and broadcasting (.emit) of events within page context.

- [ ] Event Bus iframe adaptation (complexity: 3)  
  Uses postMessage to communicate with parent window and listens for messages from parent.

- [ ] chrome.runtime polyfill factory (complexity: 4)  
  createRuntime(type, eventBus) returning sendMessage/onMessage abstraction built on Event Bus.

- [ ] Usage example & tests (complexity: 2)  
  Demonstrate background <-> tab message exchange with the polyfill.