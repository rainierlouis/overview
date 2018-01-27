#! /usr/bin/env node
const userArgs = process.argv.slice(2);
const patternSearch = userArgs[0] || [];

//-- MODULES --//
const { reset, resetEntire } = require('./configuration/consoleReset');
const { menu } = require('./configuration/consoleHelp');
const { createUserConf } = require('./configuration/userConfig');
//-------------//

//-- PACKAGES --//
const woofwoof = require('woofwoof');
const chalk = require('chalk');
const readline = require('readline');
//--------------//

const log = console.log;

const cli = woofwoof(
 `
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

${chalk.dim('Help')}
	${chalk.green('<help>')} ${chalk.cyan('[-h]')} Further detailing on options

${chalk.dim('Reset')}
	${chalk.green('<reset>')} ${chalk.cyan('[-r]')} Reset + delete visual folder
`,
 {
  flags: {
   full: {
    type: 'boolean',
    alias: 'f'
   },
   single: {
    type: 'boolean',
    alias: 's'
   },
   reset: {
    type: 'boolean',
    alias: 'r'
   }
  }
 },
 {
  alias: {
   f: 'full',
   s: 'single',
   r: 'reset'
  },
  default: {
   name: 'App.js',
   full: true,
   single: false,
   reset: false
  }
 }
);

const ov = async (input, flags) => {
 const keys = await Object.keys(flags);
 keys.forEach(async el => {
  switch (el) {
   case 'h': // help
    await consReset.reset();
    await log(consHelp.helperData);
    break;
   case 'r': // reset
    resetEntire();
    break;
   case 's': // single traversal
    // await consReset.reset();
    await log('s flag!');
    break;
   case 'f': // full traversal
    // await consReset.reset();
    await createUserConf(input);
    break;
   default:
  }
 });
};

ov(cli.input[0], cli.flags);
