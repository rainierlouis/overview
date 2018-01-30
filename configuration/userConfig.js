const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const chalk = require("chalk");
const readline = require("readline");

const { reset, tick } = require("./consoleReset");
const { menu } = require("./consoleHelp");

const log = console.log;

const fileContent = entry => `
	const path = require('path');

	module.exports = {
	 entry: './${entry}',
	 output: {
	  path: path.resolve(__dirname, 'dist'),
	  filename: 'build/visual.html'
	 },
	 module: {
	  rules: [{ test: /\(${entry.split(".")[0]})$/, use: './Parsers/parse.js' }]
	 }
	};
`;

const invalidLog = `


${chalk.red.bold("ERR:")}\n An entry point is ${chalk.green(
  "required"
)} - Please input one and try again. ${chalk.grey(
  "(e.g. ov App.js)"
)}\n\n	For more help, enter ${chalk.green("ov -h")}



			`;

const filePath = path.join(__dirname, "../Visual/user.config.js");
const folderPath = path.join(__dirname, "../Visual");

const userConfig = {
  createFile: async entry => {
    await mkdirp(folderPath, err => {
      if (err) throw err;
    });
    await fs.writeFile(filePath, fileContent(entry), err => {
      if (err) throw err;
    });
  },
  invalidInput: () => invalidLog,
  timerFunc: (func, time) => setTimeout(func, time),
  completedCreation: async entry => {
    await reset();
    await userConfig.timerFunc(
      () => userConfig.percent(28, "|", false, "red"),
      500
    );
    await userConfig.timerFunc(
      () => userConfig.percent(47, "/", false, "yellow"),
      1000
    );
    await userConfig.timerFunc(
      () => userConfig.percent(76, "|", false, "yellow"),
      1500
    );
    await userConfig.createFile(entry);
    await userConfig.timerFunc(
      () => userConfig.percent(99, "\\", false, "green"),
      2000
    );
    await userConfig.timerFunc(
      () => userConfig.percent(100, "|", true, "green"),
      2500
    );
    await userConfig.timerFunc(() => {
      reset();
      log(
        `${chalk.green(
          `[ ${chalk.bold("Finished")} ${chalk.grey(
            "--"
          )} Config file created, ready to start! ]`
        )}`
      );
      log(menu);
    }, 3500);
  },
  percent: (p, t, b = false, c) => {
    readline.cursorTo(process.stdout, 0);
    tick(`[ ${t}`);
    tick(`${t} ]     `);
    process.stdout.write(
      `${chalk.green("Building")} ... ${chalk[c](`${p} %`)}`
    );
    b ? readline.cursorTo(process.stdout, 0) : null;
  }
};

module.exports = {
  create: userConfig.completedCreation,
  missingEntry: userConfig.invalidInput
};
