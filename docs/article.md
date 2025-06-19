# Converting browser extensions to userscripts

## TL;DR:

- **GitHub Repository**: [Explosion-Scratch/to-userscript](https://github.com/explosion-scratch/to-userscript)
- **Quick start**:

```bash
# Install the tool
bun i -g to-userscript
# or pnpx/npx to-userscript
# Convert your favorite extension from the Chrome Store
to-userscript convert "https://chrome.google.com/webstore/detail/..." --minify -o my-script.user.js

# Or download an addon from Mozilla
to-userscript download "https://addons.mozilla.org/en-US/firefox/addon/..."
```

There are a lot of browser extensions out there, and many of them are relatively simple, changing something simple about a page, something somewhat useful, etc. There are also more complex ones that need bundling to be built, rely on libraries and that tyep of thing. Being a programmer and seeing many popular open-source browser extensions on GitHub I noticed one common feature request: A userscript version.

Userscripts offer a lot of power for users, there are Userscript managers for almost every browser, they are self contained, and less ambiguous than chrome extensions. They also are by their nature open source (at least if the code is not heavily obfuscated). In the past I've sunk hours into converting chrome extensions into [userscripts](<[url](https://github.com/infokiller/web-search-navigator/issues/564#issuecomment-1759550504)>) [manually](<[url](https://github.com/Explosion-Scratch/userscripts/blob/main/github_file_icons_material_design_beta.user.js)>). I always thought it would be too difficult to make a general tool to do something like this due to the complexity of browser APIs so I kind of tabled the idea - until now (yay).

The goals of my project were as follows:

- Convert browser extensions to userscript with minimal changes to the actual code
- Make the code as environment agnostic as possible — e.g. allow building to vanilla JS if possible
- The resulting userscript should support as many of the original features as possible.

## My first pass - Emulating `chrome`

My first attempt at this involved iterating for several hours with Gemini (a few months ago before 2.5 pro sadly) to create a design doc that planned out what I had in mind. This was a bit of a complicated thing because I wanted the userscripts to run in a very-close-to-browser environment, this means that variables like `chrome`, `browser`, etc should be declared globally and polyfilled. It also meant meticulously changing the environment of these files so that libraries and things that try to define functions in the global scope work correctly. Here were some attempts I made at this:

This was my first attempt at this. This attempt worked somewhat, declaring the variables I wanted, but not correctly allowing assignment:

```js
function runAllTheCode({chrome, browser, window, this, self, ...etc}){
    /*
    Code that goes here can now access the various things I may want to polyfill, but if there's a library like the following, it won't work:

    ExtPay = {

    }
    -> Now that assignment is still only local to this function
    */
}
```

My second attempt was to essentially do the same, but `.call(polyfill)` the function, so as to better simulate a scope. This unfortunately still didn't allow assignment in the way I wanted.

What finally ended up working, is a bit hacky, but essentially I created a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) which on set would set any values to a custom storage object, then on get check first on that object, before on the target, and then used a `with(polyfill)` statement to make the code run in the polyfilled scope.

```js
let customStorage = {
    chrome: /* ... */,
    browser: /* ... */,
};
new Proxy(target, {
  set(target, prop, value) {
    customStorage[prop] = value;
    return Reflect.set(target, prop, value);
  },
  get(target, prop) {
    return customStorage[prop] || Reflect.get(target, prop);
  },
});

/*
Now code can run in the polyfilled scope:
*/
with (polyfill) {
    /*
    // Yay it works!!
    ExtPay = {}
    */
}
```

But now the problem is I need code like globalThis.chrome to also function correctly, so I made a function that when setting a value, sets it across domains, e.g. for each of `[window, globalThis, customStorage, ...etc]` we set the new key to the value.

Now I was free to polyfill away some of the APIs, and try to make extensions work, but my next big problem was sending messages.

## Sending messages across scopes

Sending messages across scopes was especially tricky, because I needed to allow messages to be sent and recieved from the content script and the background (which are in the same scope, but need to have simulated messaging). My initial take on this was to create an internalMessagingBus which essentially just acted as a hub to send and recieve messages. This could just be a simple object containing `.emit`, `.on`, and `.off` listeners, but this quickly failed as soon as I needed scripts to run in a seperate context, e.g. the options/popup pages.

## Options + Popups

This was one of the biggest hurdles of the project, and involved maybe 12 hours of messing around with various things, the complexity of this task is threefold:

1. [Options or popup pages](https://developer.chrome.com/docs/extensions/develop/ui/options-page) needed to access other resources:
   - These pages needed things such as scripts to make the options page function, styles or libraries. This meant that I had to polyfill `chrome.runtime.getURL` to map to a static assets map generated on build time. This assets map is simply an object keying each file within the extension that may be accessed to its content.
   -
2. Access to browser APIs:
   - These pages needed direct access to Browser APIs, and I couldn't just directly copy over the polyfill because an iframe with `[srcdoc]` set couldn't access `GM_` related functions. Also to keep things working well I didn't want to instances that had to sync with each other.
3.

I eventually settled on a [templates system](../src/templates/) which has a series of templates for a few different "targets" for the build:

- `userscript`: This is the default target, and contains all of the logic for the various APIs.
- `postmessage`: This is for pages like options or the popup, which shouldn't work by just creating a new API instance. Instead [their versions](../src/templates/messaging.template.js) of `chrome.runtime.sendMessage` post to the parent
- `handle_postmessage`: Simply a listener in the userscript that proxies the calls from the iframes back to the real runtime.

## Inlining Assets

As I outlined earlier, for a variety of reasons (namely `runtime.getURL()` and `web_accessible_resources`), the extension needs to have access to files that it comes with, and since we're building the extension to a single script, these must be embedded directly. I settled on creating an `EXTENSION_ASSETS_MAP` that stores `[filename]: [content]` format. For text assets this is stored simply as text, and for other assets, they are stored as base64. This presented a slight hicup though for the options page though, as the map might sometimes contain `</script>` which would obviously derail the content of the script in which it's injected (in iframes).

The other problem of this method, was CSS `url()` imports which might rely on photos, icons, etc throughout, so these needed to also be replaced, but recursively, since we start with an options of popup page.

## Locales

Many extensions rely on locale support within the chrome extension to support multilingual extensions. I didn't want to incorporate every locale into the built userscript so instead I allow this to be passed as part of the CLI. I also had to be careful when replacing not to alter scripts, or anything like that, and then this locale also needed to be passed down to the options and popup pages.

## Background scripts

## Russian nesting doll polyfills

- Building as strings

## Patching things that just don't work
