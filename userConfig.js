#! /usr/bin/env node
const exec = require('child_process').exec;
const fs = require('fs');
const mkdirp = require('mkdirp');

const fileContent = entry => `
	const path = require('path');

	module.exports = {
	 entry: './${entry}',
	 output: {
	  path: path.resolve(__dirname, 'dist'),
	  filename: 'build/visual.html'
	 },
	 module: {
	  rules: [{ test: /\(${entry.split('.')[0]})$/, use: './Parsers/parse.js' }]
	 }
	};

	module.exports = config;

`;

const filePath = `${__dirname}/visual/user.config.js`;

const userConfig = {
 createFile: async entry => {
  await mkdirp(`${__dirname}/visual`, err => {
   if (err) throw err;
  });
  await fs.writeFile(filePath, fileContent(entry), err => {
   if (err) throw err;
  });
 }
};

module.exports = {
 userConfig
};
