const esprima = require('esprima');
const fs = require('fs');
const babel = require('babel-core');

const readFile = filePath => new Promise((resolve, reject) => {
  fs.readFile(__dirname + filePath, 'UTF8', (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

const parse = async (filePath, recurCrit, babelPlugins) => {
  const input = await readFile(filePath)
    .then((fileContents) => {
      return babel.transform(fileContents, babelPlugins).code;
    })
    .then(data => {
      var imports = [];
      esprima.parseModule(data, {jsx: true}, node => {
        if (node.type === recurCrit.compareType) {
          imports.push({
            filePath: node.source.value,
          });
        }
      });
      return imports;
    })
    .catch(err => console.log(err));

  return input;
};

module.exports = parse;