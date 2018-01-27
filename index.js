#! /usr/bin/env node
const userArgs = process.argv.slice(2);
const patternSearch = userArgs[0] || [];

//-- MODULES --//
const { reset, resetEntire } = require('./configuration/consoleReset');
const { menu } = require('./configuration/consoleHelp');
const { create, missingEntry } = require('./configuration/userConfig');
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

${chalk.dim('Entry')}
	${chalk.green(
  '$ ov <entry>'
 )} Declare entry point for the visualisation ${chalk.red.bold('required')}

	${chalk.dim('Begin')}
		${chalk.green('<begin>')} ${chalk.cyan(
  '[-b]'
 )} Once entry is declared, you can start the visual creation

${chalk.dim('Options')}
	${chalk.green('<full|single>')} ${chalk.cyan(
  '[-f -s]'
 )} Declare what to visualise, full structure by default

	${chalk.dim('Reset')}
		${chalk.green('<reset>')} ${chalk.cyan('[-r]')} Reset + delete visual folder

${chalk.dim('Help')}
	${chalk.green('<help>')} ${chalk.cyan('[-h]')} Further detailing on options


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
   },
   help: {
    alias: 'h'
   },
   start: {
    alias: 'b'
   }
  }
 },
 {
  alias: {
   f: 'full',
   s: 'single',
   r: 'reset',
   h: 'help',
   b: 'begin'
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
 const keys = await Object.keys(flags).filter(
  el => el === 'h' || el === 'r' || el === 's' || el === 'f' || el === 'b'
 );
 if (!input && keys.length === 0) {
  await reset();
  await log(missingEntry());
 } else if (input && keys.length === 0) {
  await reset();
  // await create(input);
 }

 keys.forEach(async el => {
  switch (el) {
   case 'h':
    await reset();
    await log(menu);
    break;
   case 'r':
    await resetEntire();
    break;
   case 's':
    await log('s flag!');
    break;
   case 'f':
    await reset();
    await create(input);
    break;
   case 'b':
    log('start flag wooooh');
    break;
   default:
    break;
  }
 });
};

ov(cli.input[0], cli.flags);
