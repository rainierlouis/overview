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
  )}\n\n 	An entry point is ${chalk.green(
  "required"
)} - Please input one and try again. ${chalk.grey(
  "(e.g. overview App.js)"
)}\n\n	For more help, enter ${chalk.green("overview -h")}


			`;

module.exports = {
  loadSpinner: async () => {
    const spinner = new Ora({});

    spinner.start(` Loading ${chalk.magentaBright("OVERVIEW")} system tools`);

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
      "Building visualisation index"
    );
    spin.loadSpinner(
      spinner,
      4000,
      "Building visualisation index",
      "Creating visual folder"
    );
    spin.loadingTime(spinner, 5000);
    setTimeout(() => {
      spinner.succeed(" Creating visual folder");
      asciimo.write("Done", "isometric1", art => {
        log(`
		  			`);
        log(art.cyan);
        log(`
 Please open ${chalk.cyan("visual/overview.html")} in your preferred browser ✌️

		  				`);
      });
    }, 6000);
  },

  invalidInput: () => invalidLog
};
