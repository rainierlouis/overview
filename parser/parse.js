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
    .then(fileContents => babel.transform(fileContents, babelPlugins).code)
    .then(data => {
      const res = [];
      esprima.parseModule(data, {jsx: true}, node => analyseNode(node, recurCrit, res))
      return res;
    })
    .catch(err => console.log(err));

  return input;
};

const analyseNode = function (node, recurCrit, res) {

  if (node.type === recurCrit.compareType) {
    res.push({
      filePath: node.source.value,
    });
  }
  return res;
}

module.exports = parse;