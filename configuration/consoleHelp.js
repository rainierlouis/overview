const chalk = require('chalk');

const help = {
 menu: `

	${chalk.bold.blue('"OVERVIEW"')} - ${chalk.dim(
  'creates a visual file for your application structure'
 )}


	${chalk.dim('Entry')}
		${chalk.green(
   '$ ov <entry>'
  )} Declare entry point for the visualisation ${chalk.red.bold(
  'required first'
 )}

	${chalk.dim('Begin')}
		${chalk.green('<begin>')} ${chalk.cyan(
  '[-b]'
 )} Once entry is declared, you can start the visual creation

	${chalk.dim('Options')}
		${chalk.green('<full|single>')} ${chalk.cyan(
  '[-f -s]'
 )} Declare what to visualise, ${chalk.red('-f')} by default

	${chalk.dim('Reset')}
		${chalk.green('<reset>')} ${chalk.cyan('[-r]')} Reset + delete visual folder

	${chalk.dim('Help')}
		${chalk.green('<help>')} ${chalk.cyan('[-h]')} Further detailing on options


	`
};

module.exports = {
 menu: help.menu
};
