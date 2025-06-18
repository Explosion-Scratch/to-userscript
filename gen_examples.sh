#!/usr/bin/env bash

bun src/cli/index.js convert extensions/particle-iridium -o examples/iridium.js --force
bun src/cli/index.js convert extensions/modernhn -o examples/modernhn.js --force
bun src/cli/index.js convert extensions/modern-wikipedia -o examples/modern-wikipedia.js --force
bun src/cli/index.js convert extensions/web-search-navigator -o examples/web-search-navigator.js --force
bun src/cli/index.js convert extensions/json-formatter -o examples/json-formatter.js --force
bun src/cli/index.js convert extensions/return-dislikes -o examples/return-dislikes.js --force
bun src/cli/index.js convert extensions/material-design-fileicons -o examples/material-design-fileicons.js --force
