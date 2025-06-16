const path = require("path");
const fs = require("fs").promises;

export async function getLocale(manifest, manifestPath) {
  // TODO: Configuration
  try {
  const LOCALE = manifest.default_locale || "en";
  const localePath = path.join(
    path.dirname(manifestPath),
    "_locales",
    LOCALE,
    "messages.json",
  );
  const locale = JSON.parse(await fs.readFile(localePath, "utf8"));
  function processString(str) {
    if (!locale) {
      return str;
    }
    return str.replace(/__MSG_(\w+)__/g, (match, p1) => {
      return locale[p1]?.message || match;
    });
  }
    processString.__data = locale;
    return processString;
  } catch (e) {
    return (str) => str;
  }
}
