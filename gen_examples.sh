#!/usr/bin/env bash

bun src/converter.js -i extensions/particle-iridium -o examples/iridium.js
bun src/converter.js -i extensions/modernhn -o examples/modernhn.js
bun src/converter.js -i extensions/modern-wikipedia -o examples/modern-wikipedia.js
bun src/converter.js -i extensions/web-search-navigator -o examples/web-search-navigator.js
