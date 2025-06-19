#!/usr/bin/env bash

rm -rf examples/*
bun src/cli/index.js convert extensions/particle-iridium -o examples/iridium.user.js --force
bun src/cli/index.js convert extensions/modernhn -o examples/modern-hackernews.user.js --force
bun src/cli/index.js convert extensions/modern-wikipedia -o examples/modern-wikipedia.user.js --force
bun src/cli/index.js convert extensions/web-search-navigator -o examples/web-search-navigator.user.js --force
bun src/cli/index.js convert extensions/json-formatter -o examples/json-formatter.user.js --force
bun src/cli/index.js convert extensions/return-dislikes -o examples/return-dislikes.user.js --force
bun src/cli/index.js convert extensions/material-design-fileicons -o examples/material-design-fileicons.user.js --force
bun src/cli/index.js convert extensions/ublacklist -o examples/ublacklist.user.js --force