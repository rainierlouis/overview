const readline = require("readline");
const chalk = require("chalk");
const Ora = require("ora");

const menu = require("./consoleHelp").menu;
const remove = require("./consoleRemove").remFile;

const log = console.log;

module.exports = {
  reset: () => process.stdout.write("\x1B[2J\x1B[0f"),
  loadSpinner: async () => {
    const spinner = new Ora({});
  },
  resetMethod: async pathD => {
    await reset.reset();
    // await remove();
    await reset.timerFunc(() => {
      reset.reset();
      log(
        `${chalk.green(
          `[ ${chalk.bold("Removed")} ${chalk.grey(
            "--"
          )} Input entry point to start again! ]`
        )}`
      );
      menu();
    }, 3500);
  }
};
