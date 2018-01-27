#! /usr/bin/env node
const userArgs = process.argv.slice(2);
const patternSearch = userArgs[0] || [];

const consReset = require('./configuration/consoleReset').reset; // consoleReset -- clear console + reset cursor
const consHelp = require('./configuration/consoleHelp').help; // consoleHelp -- provide help data on terminal
const userConf = require('./configuration/userConfig'); // userConfig -- create user.config
const user = userConf.userConfig;

const log = console.log;

const woofwoof = require('woofwoof');
const chalk = require('chalk');
const readline = require('readline');

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

function writeWaitingPercent(p) {
 //readline.clearLine(process.stdout);
 readline.cursorTo(process.stdout, 0);
 process.stdout.write(`waiting ... ${p}%`);
}

const ov = async (input, flags) => {
 const keys = await Object.keys(flags);
 keys.forEach(async el => {
  switch (el) {
   case 'h': // help
    await consReset.reset();
    await log(consHelp.helperData);
    break;
   case 'r': // reset
    await setTimeout(() => consReset.percent(0), 0);
    await setTimeout(() => consReset.percent(33), 1500);
    await setTimeout(() => consReset.percent(66), 3000);
    await setTimeout(() => consReset.percent(99), 4500);
    break;
   case 's': // single traversal
    // await consReset.reset();
    await log('s flag!');
    break;
   case 'f': // full traversal
    // await consReset.reset();
    await log('f flag!');
    // await user.createFile(input);
    break;
   default:
  }
 });
};

ov(cli.input[0], cli.flags);
