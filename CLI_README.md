# Extension to Userscript CLI

A powerful command-line tool to convert browser extensions to userscripts with support for downloading from web stores.

## Installation

```bash
npm install -g extension-to-userscript
```

Or run directly:

```bash
npx extension-to-userscript
```

## Quick Start

```bash
# Convert from Chrome Web Store
ext2us convert https://chrome.google.com/webstore/detail/extension-id

# Convert local extension folder
ext2us convert ./my-extension/

# Convert CRX/XPI/ZIP file
ext2us convert extension.crx -o my-script.user.js

# Download only (no conversion)
ext2us download extension-id -s chrome
```

## Commands

### `convert <source>`

Convert an extension to userscript from various sources:

- **Web Store URL**: `https://chrome.google.com/webstore/detail/...`
- **Extension ID**: `abcdefghijklmnopqrstuvwxyz123456`
- **Local Archive**: `extension.crx`, `extension.xpi`, `extension.zip`
- **Local Directory**: `./extension-folder/`

#### Options

- `-o, --output <file>` - Output file path (default: `extension.user.js`)
- `-s, --store <type>` - Web store type: `chrome` or `firefox` (default: `chrome`)
- `-t, --target <type>` - Build target: `userscript` or `vanilla` (default: `userscript`)
- `-m, --minify` - Minify output (default: `true`)
- `--no-minify` - Disable minification
- `--temp-dir <dir>` - Custom temporary directory
- `--keep-temp` - Keep temporary files after conversion
- `-v, --verbose` - Verbose output with detailed information

#### Examples

```bash
# Convert Chrome extension with custom output
ext2us convert "https://chrome.google.com/webstore/detail/name/abcd..." -o my-script.user.js

# Convert Firefox addon
ext2us convert ublock-origin -s firefox --verbose

# Convert local extension without minification
ext2us convert ./extension-folder/ --no-minify

# Convert to vanilla JS target
ext2us convert extension.crx -t vanilla -o extension.js
```

### `download <url>`

Download extension from web store without converting:

#### Options

- `-o, --output <file>` - Output file path (auto-generated if not specified)
- `-s, --store <type>` - Web store type: `chrome` or `firefox` (default: `chrome`)

#### Examples

```bash
# Download Chrome extension
ext2us download extension-id

# Download Firefox addon
ext2us download addon-name -s firefox -o addon.xpi

# Download from URL
ext2us download "https://addons.mozilla.org/addon/name/"
```

## Supported Formats

### Input Sources

- **Chrome Web Store**: URLs or extension IDs
- **Firefox Add-ons**: URLs or addon names/IDs
- **Archive Files**: `.crx`, `.xpi`, `.zip`
- **Directories**: Local extension folders with `manifest.json`

### Output Targets

- **Userscript** (default): `.user.js` files for Tampermonkey, Greasemonkey, etc.
- **Vanilla JS**: Standalone `.js` files using browser APIs (limited functionality)

## Features

### Web Store Integration

- **Chrome Web Store**: Direct download via CRX URLs
- **Firefox Add-ons**: API integration for latest versions
- **Progress tracking**: Real-time download progress
- **Validation**: File type and size validation

### Archive Handling

- **CRX Support**: Chrome extension format with header parsing
- **XPI Support**: Firefox addon format
- **ZIP Support**: Generic ZIP archives
- **Security**: Path traversal protection
- **Validation**: Manifest.json verification

### Conversion Features

- **Content Scripts**: Full support with proper timing
- **Background Scripts**: Auto-execution in polyfilled environment
- **Options Pages**: Modal iframe implementation
- **Popup Pages**: Modal iframe implementation
- **Assets**: Automatic inlining and resource management
- **Permissions**: Smart grant detection and metadata generation
- **Icons**: Embedded in userscript metadata

### Code Processing

- **Minification**: Prettier-based code formatting (can be disabled)
- **Error Handling**: Comprehensive error reporting
- **Validation**: Input and output validation
- **Cleanup**: Automatic temporary file management

## Advanced Usage

### Verbose Mode

Use `-v` or `--verbose` for detailed information:

```bash
ext2us convert extension.crx -v
```

Output includes:

- Extension metadata
- File processing details
- Conversion summary
- Performance metrics

### Custom Temporary Directory

```bash
ext2us convert extension.crx --temp-dir /custom/temp --keep-temp
```

### Batch Processing

Process multiple extensions:

```bash
ext2us convert ext1.crx -o script1.user.js
ext2us convert ext2.crx -o script2.user.js
```

## Troubleshooting

### Common Issues

1. **"Extension not found"**

   - Verify the extension ID or URL
   - Check if the extension is publicly available
   - Try using the full web store URL

2. **"Archive extraction failed"**

   - Ensure the file is a valid extension archive
   - Check file permissions
   - Verify the file isn't corrupted

3. **"Manifest parsing error"**

   - Ensure the extension contains a valid manifest.json
   - Check for JSON syntax errors
   - Verify required manifest fields are present

4. **"Download failed"**
   - Check internet connection
   - Verify the extension is still available
   - Try again later if web store is temporarily unavailable

### Debug Options

```bash
# Maximum verbosity
ext2us convert extension.crx -v --keep-temp

# Check temporary files
ls /tmp/ext2us-*
```

## Technical Details

### Supported Manifest Versions

- **Manifest V2**: Full support
- **Manifest V3**: Basic support (limitations apply)

### Browser Compatibility

Generated userscripts work with:

- Tampermonkey (Chrome, Firefox, Safari, Edge)
- Greasemonkey (Firefox)
- Violentmonkey (Chrome, Firefox, Edge)

### API Coverage

The converter provides polyfills for:

- `chrome.storage` (local, sync, managed)
- `chrome.runtime` (sendMessage, onMessage, getURL, getManifest)
- `chrome.tabs` (query, create, sendMessage)
- `chrome.notifications` (create, clear, onClicked)
- `chrome.contextMenus` (create, remove, onClicked)
- And more...

### Limitations

- Service workers (MV3) have limited support
- Some privileged APIs cannot be polyfilled
- Cross-origin requests require proper @connect grants
- Vanilla target has significant CORS limitations

## Development

### Project Structure

```
src/cli/
├── index.js              # Main CLI entry point
├── inputValidator.js     # Input type detection and validation
├── storeDownloader.js    # Web store download functionality
├── archiveExtractor.js   # Archive extraction (CRX/XPI/ZIP)
├── workspaceManager.js   # Temporary directory management
├── extensionConverter.js # Conversion orchestration
└── downloadExt.js        # CRX URL generation
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

## License

ISC License - see LICENSE file for details
