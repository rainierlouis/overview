const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const chalk = require("chalk");
const readline = require("readline");
const asciimo = require("../node_modules/asciimo/lib/asciimo").Figlet;
const colors = require("../node_modules/asciimo/lib/colors");
const Ora = require("ora");

const spin = require("./spinLoader");

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
  )}\n\n 	A valid entry point is ${chalk.green(
  "required"
)} - Please input one and try again. ${chalk.grey(
  "(e.g. overview App.js)"
)}\n\n	For more help, enter ${chalk.green("overview -h")}


			`;

const invalidNode = `


	${chalk.red.bold(
    "ERR - Invalid directory:"
  )}\n\n 	Please change to the root directory of the application - node_modules must be ${chalk.green(
  "present"
)}.
\n	For more help, enter ${chalk.green("overview -h")}


			`;

module.exports = {
  checkNodeModules: pwd => {
    pathCheck = `${pwd}/node_modules`;
    return fs.existsSync(pathCheck);
  },
  checkEntryPoint: (pwd, entryPoint) => {
    entryPathCheck = `${pwd}/${entryPoint}`;
    return fs.existsSync(entryPathCheck);
  },
  loadSpinner: async () => {
    const spinner = new Ora({});

    spinner.start(` 

					Loading ${chalk.magentaBright("OVERVIEW")} system tools`);

    spin.loadSpinner(
      spinner,
      0,
      `Loading ${chalk.magentaBright("OVERVIEW")} system tools`,
      "Acquiring folder structure"
    );
    spin.loadSpinner(
      spinner,
      1000,
      "Acquiring folder structure",
      "Constructing the algorithm with love"
    );
    spin.loadSpinner(
      spinner,
      2000,
      "Constructing the algorithm with love",
      "Parsing the application structure"
    );
    spin.loadSpinner(
      spinner,
      3000,
      "Parsing the application structure",
      "Building visualization index"
    );
    spin.loadSpinner(
      spinner,
      4000,
      "Building visualization index",
      "Creating visual folder"
    );
    spin.loadingTime(spinner, 5000);
    setTimeout(() => {
      spinner.succeed(" Creating visual folder");
      log(`
 Visual file has been created at ${chalk.cyan(
   "visual/overview.html"
 )} - Enjoy! ✌️

								  				`);
    }, 6000);
  },

  invalidInput: () => invalidLog,
  invalidNode: () => invalidNode
};
