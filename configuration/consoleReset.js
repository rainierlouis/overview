const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const Ora = require("ora");
const asciimo = require("../node_modules/asciimo/lib/asciimo").Figlet;

const menu = require("./consoleHelp").menu;
const remove = require("./consoleRemove").remFile;
const spin = require("./spinLoader");

const log = console.log;

module.exports = {
  reset: () => {
    // process.stdout.write("\x1B[2J\x1B[0f")
  },
  deleteDir: async () => {
    await fs.emptyDir("visual", err => {
      if (err) throw err;
      fs.remove("visual", err => {
        if (err) throw err;
      });
      fs.emptyDir("node_modules/app-overview/client/data", err => {
        if (err) throw err;
        fs.remove("node_modules/app-overview/client/data", err => {
          if (err) throw err;
        });
      });
    });
  },
  spinLoading: async () => {
    const spinner = new Ora({});
    spinner.start(` Loading ${chalk.magentaBright("OVERVIEW")} system tools`);
    spin.loadSpinner(
      spinner,
      0,
      `Loading ${chalk.magentaBright("OVERVIEW")} system tools`,
      "Scanning directories + files for removal"
    );
    spin.loadSpinner(
      spinner,
      1000,
      "Scanning directories + files for removal",
      "Deleting visual directory + it's contents"
    );
    spin.loadSpinner(
      spinner,
      2000,
      "Deleting visual directory + it's contents",
      "Clearing log cache"
    );
    spin.loadingTime(spinner, 3000);
    setTimeout(() => {
      spinner.succeed(" Clearing log cache");
      log(`
 Environment is ready to begin a new ${chalk.magentaBright(
   "OVERVIEW"
 )} visualisation ✌️

				`);
    }, 4000);
  },
  resetMethod: async () => {
    await module.exports.reset();
    await module.exports.spinLoading();
    await module.exports.deleteDir();
  }
};
