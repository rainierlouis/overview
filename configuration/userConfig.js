const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

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
`;

const filePath = path.join(__dirname, '../Visual/user.config.js');
const folderPath = path.join(__dirname, '../Visual');

const userConfig = {
 createFile: async entry => {
  await mkdirp(folderPath, err => {
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
