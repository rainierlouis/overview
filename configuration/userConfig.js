const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const chalk = require("chalk");
const readline = require("readline");
const asciimo = require("../node_modules/asciimo/lib/asciimo").Figlet;
const colors = require("../node_modules/asciimo/lib/colors");
const Ora = require("ora");

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


	${chalk.red.bold(
    "ERR - Invalid input or flag:"
  )}\n\n 	An entry point is ${chalk.green(
  "required"
)} - Please input one and try again. ${chalk.grey(
  "(e.g. overview App.js)"
)}\n\n	For more help, enter ${chalk.green("overview -h")}


			`;

const userConfig = {
  loadingTime: (spinnerItem, time) => {
    setTimeout(() => {
      spinnerItem.color = "red";
    }, time);
    setTimeout(() => {
      spinnerItem.color = "yellow";
    }, time + 400);
    setTimeout(() => {
      spinnerItem.color = "green";
    }, time + 700);
  },
  loadSpinner: async () => {
    const spinner = new Ora({});

    spinner.start(" Loading OVERVIEW system tools");
    userConfig.loadingTime(spinner, 0);
    setTimeout(() => {
      spinner.succeed(" Loading OVERVIEW system tools");
      spinner.start(" Acquiring folder structure");
    }, 1000);
    userConfig.loadingTime(spinner, 1000);

    setTimeout(() => {
      spinner.succeed(" Acquiring folder structure");
      spinner.color = "white";
      spinner.start(" Constructing the algorithm with love");
    }, 2000);
    userConfig.loadingTime(spinner, 2000);
    setTimeout(() => {
      spinner.succeed(" Constructing the algorithm with love");
      spinner.color = "gray";
      spinner.start(" Parsing the application structure");
    }, 3000);
    userConfig.loadingTime(spinner, 3000);
    setTimeout(() => {
      spinner.succeed(" Parsing the application structure");
      spinner.color = "red";
      spinner.start(" Eating your sandwich whilst you read this");
    }, 4000);
    userConfig.loadingTime(spinner, 4000);
    setTimeout(() => {
      spinner.succeed(" Eating your sandwich whilst you read this");
      spinner.color = "green";
      spinner.start(" Still parsing the application structure");
    }, 5000);
    userConfig.loadingTime(spinner, 5000);
    setTimeout(() => {
      spinner.succeed(" Still parsing the application structure");
      spinner.color = "yellow";
      spinner.start(" Building visualisation index");
    }, 6000);
    userConfig.loadingTime(spinner, 6000);
    setTimeout(() => {
      spinner.succeed(" Building visualisation index");
      spinner.color = "magenta";
      spinner.start(" Creating visual folder");
    }, 7000);
    userConfig.loadingTime(spinner, 7000);
    setTimeout(() => {
      spinner.succeed(" Creating visual folder");
      asciimo.write("Enjoy", "larry3d", art => {
        log(`

				`);
        log(art.green);
        log(`
 Please open ${chalk.cyan("visual/index.html")} in your preferred browser ✌️

					`);
      });
    }, 8000);
  },

  createFile: async (entry, path) => {
    await mkdirp(folderPath, err => {
      if (err) throw err;
    });
    await fs.writeFile(filePath, fileContent(entry), err => {
      if (err) throw err;
    });
  },
  invalidInput: () => invalidLog,
  completedCreation: async entry => {
    // build file
    await menu();
  }
};

module.exports = {
  create: userConfig.loadSpinner,
  missingEntry: userConfig.invalidInput
};
