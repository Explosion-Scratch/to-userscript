#!/usr/bin/env node

const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const path = require("path");
const chalk = require("chalk");
const workflow = require("./workflow");

async function main() {
  try {
    await yargs(hideBin(process.argv))
      .scriptName("to-userscript")
      .usage("$0 <command> [options]")
      .command(
        "convert <source>",
        "Convert an extension to userscript",
        (yargs) => {
          return yargs
            .positional("source", {
              describe: "Extension source (URL, archive file, or directory)",
              type: "string",
              demandOption: true,
            })
            .option("output", {
              alias: "o",
              describe: "Output .user.js file path",
              type: "string",
            })
            .option("minify", {
              describe: "Minify the JavaScript output using terser",
              type: "boolean",
              default: false,
            })
            .option("target", {
              describe: "Build target type",
              choices: ["userscript", "vanilla"],
              default: "userscript",
            })
            .option("locale", {
              alias: "l",
              describe:
                "Preferred locale for extension name/description (e.g., 'en', 'fr', 'de')",
              type: "string",
            })
            .option("ignore-assets", {
              describe:
                "Asset file extensions to ignore during inlining (comma-separated, e.g., 'mp4,webm,ttf')",
              type: "string",
            })
            .option("force", {
              alias: "f",
              describe: "Overwrite output file if it exists",
              type: "boolean",
              default: false,
            })
            .option("keep-temp", {
              describe: "Keep temporary files for debugging",
              type: "boolean",
              default: false,
            })
            .option("temp-dir", {
              describe: "Custom temporary directory path",
              type: "string",
            });
        },
        async (argv) => {
          try {
            await workflow.run(argv);
          } catch (error) {
            console.error(chalk.red("Conversion failed:"), error.message);
            if (process.env.DEBUG) {
              console.error(error.stack);
            }
            process.exit(1);
          }
        }
      )
      .option("verbose", {
        alias: "v",
        describe: "Enable verbose logging",
        type: "boolean",
        global: true,
      })
      .help()
      .alias("help", "h")
      .version()
      .alias("version", "V")
      .example([
        [
          '$0 convert "https://chrome.google.com/webstore/detail/..." -o dark-reader.user.js --minify',
          "Convert from Chrome Web Store with minification",
        ],
        [
          "$0 convert ./extension.xpi --target vanilla -o extension.js --locale fr",
          "Convert XPI to vanilla JS with French locale",
        ],
        [
          "$0 convert ./my-extension/ -o my-script.user.js --ignore-assets mp4,webm,ttf",
          "Convert local directory ignoring video and font assets",
        ],
        [
          "$0 convert ./extension/ --locale en --minify --keep-temp",
          "Convert with English locale, minification, and debug files",
        ],
      ])
      .demandCommand(1, "You must specify a command")
      .strict()
      .parse();
  } catch (error) {
    console.error(chalk.red("CLI error:"), error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
