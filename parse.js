const esprima = require('esprima');
const fs = require('fs');
const babel = require('babel-core');

const readFile = filePath => new Promise((resolve, reject) => {
  fs.readFile(__dirname + filePath, 'UTF8', (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

const parse = async (filePath, babelPlugins) => {
   const input = await readFile(filePath)
    .then((fileContents) => {
      babel.transform(fileContents, babelPlugins)
    })
    .catch(err => console.log(err));

   return esprima.parseModule(input, {jsx: true});
};

module.exports = parse;