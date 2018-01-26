#! /usr/bin/env node
const userArgs = process.argv.slice(2);
const patternSearch = userArgs[0] || [];

/*jshint node:true */
/*jshint esversion:6 */
('use strict');

const woofwoof = require('woofwoof');

const cli = woofwoof(
 `
    Usage
    $ ov <input>

				Help
				[--help, -h] detailed description and usage

    Options
    [--name, -n]  Who should I greet

`,
 {
  alias: {
   n: 'name'
  },
  default: {
   name: 'empty'
  }
 }
);

const ov = (input, flags) => {
 console.log('ov intialised -- ' + flags.name);
};

ov(cli.input[0], cli.flags);

const exec = require('child_process').exec;

const createFile = async (...args) => {
 await exec(`mkdir visual/`);
 await exec(`echo ${args} > visual/index.html`);
};

// createFile(userArgs);
// console.log(userArgs);
hello(cli.input[0], cli.flags);
