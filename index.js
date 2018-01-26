#! /usr/bin/env node
const userArgs = process.argv.slice(2);
const patternSearch = userArgs[0] || [];

const userConf = require('./userConfig'); // userConfig -- create user.config
const user = userConf.userConfig;

const woofwoof = require('woofwoof');
const chalk = require('chalk');

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
   }
  }
 },
 {
  alias: {
   f: 'full',
   s: 'single'
  },
  default: {
   name: 'App.js',
   full: true,
   single: false
  }
 }
);

const ov = (input, flags) => {
 if (Object.keys(flags).filter(el => el === 's').length > 0) {
  // do -s flag
  console.log('s flag!');
 } else {
  // do default
  console.log('default!');
  user.createFile(input);
 }
};

ov(cli.input[0], cli.flags);
