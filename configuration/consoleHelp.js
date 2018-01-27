const chalk = require('chalk');

const help = {
 helperData: `

	${chalk.bold.blue('"OVERVIEW"')} - ${chalk.dim(
  'creates a visual file for your application structure'
 )}


	${chalk.dim('Usage')}
		${chalk.green(
   '$ ov <entry>'
  )} Declare entry point for the visualisation ${chalk.red.bold('required')}

	${chalk.dim('Options')}
		${chalk.green('<full|single>')} ${chalk.cyan(
  '[-f -s]'
 )} Declare what to visualise, full structure by default

	${chalk.dim('Reset')}
		${chalk.green('<reset>')} ${chalk.cyan('[-r]')} Reset + delete visual folder

	${chalk.dim('Help')}
		${chalk.green('<help>')} ${chalk.cyan('[-h]')} Further detailing on options


	`
};

module.exports = {
 help
};
