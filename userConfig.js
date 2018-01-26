#! /usr/bin/env node
const exec = require('child_process').exec;

// const createFile = async (...args) => {
//  await exec(`mkdir visual/`);
//  await exec(`echo ${args} > visual/index.html`);
// };
const userConfig = {
 createFile: async entry => {
  await exec(`mkdir visual/`);
  await exec(`echo ${entry} > visual/index.txt`);
 }
};

module.exports = {
 userConfig
};
