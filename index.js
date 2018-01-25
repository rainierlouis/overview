#! /usr/bin/env node
const userArgs = process.argv.slice(2);
const patternSearch = userArgs[0] || [];

const exec = require('child_process').exec;

const createFile = async (...args) => {
 await exec(`mkdir build/`);
 await exec(`echo ${args} > build/newFile.txt`);
};

createFile(userArgs);
// console.log(userArgs);
