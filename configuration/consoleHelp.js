const chalk = require('chalk');

const asciimo = require('../node_modules/asciimo/lib/asciimo').Figlet;
const colors = require('../node_modules/asciimo/lib/colors');

const log = console.log;

const help = {
 menu: async () => {
  await asciimo.write('Overview', 'isometric1', async art => {
   await log(art.cyan);
   await log(`
   
   ${chalk.dim('creates a visual file for your application structure - v0.3.0')}
   
   
   ${chalk.dim('Entry')}
   	${chalk.green(
     '$ overview <entry>'
    )} Declare entry point for the visualisation ${chalk.magenta.bold(
    'required first'
   )}
   
   ${chalk.dim('Reset')}
   	${chalk.green('<reset>')} ${chalk.cyan('[-r]')} Reset + delete visual folder
   
   ${chalk.dim('Path')}
   	${chalk.green('<path>')} ${chalk.cyan(
    '[-p]'
   )} View the current path for the entry file
   
   ${chalk.dim('Help')}
   	${chalk.green('<help>')} ${chalk.cyan('[-h]')} Further detailing on options
   
   
    	`);
  });
 }
};

module.exports = {
 menu: help.menu
};
