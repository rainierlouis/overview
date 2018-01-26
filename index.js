#! /usr/bin/env node
const userArgs = process.argv.slice(2);
const patternSearch = userArgs[0] || [];

const userConf = require('./userConfig');
const user = userConf.userConfig;

const woofwoof = require('woofwoof');

const cli = woofwoof(
 `
    Usage
    $ ov <entry> Declare entry point for the visualisation

				Options
				<full|single> -f, -s Declare what to visualise, full structure by default

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
   e: 'entry',
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
 console.log(`ov intialised -- ${flags.name}`);
};

ov(cli.input[0], cli.flags);

// const exec = require('child_process').exec;

// const createFile = async (...args) => {
//  await exec(`mkdir visual/`);
//  await exec(`echo ${args} > visual/index.html`);
// };

// createFile(userArgs);
