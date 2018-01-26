#!/usr/bin/env node

/*jshint node:true */
/*jshint esversion:6 */
'use strict';

const woofwoof = require('woofwoof');

const cli = woofwoof(
 `
    Usage
    $ hello <input>

    Options
    --name, -n  Who should I greet

`,
 {
  alias: {
   n: 'name'
  },
  default: {
   name: 'world'
  }
 }
);

const hello = (input, flags) => {
 console.log('hello ' + flags.name);
};

module.exports = {
 hello,
 cli
};
