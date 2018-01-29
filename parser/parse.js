const esprima = require('esprima');
const fs = require('fs');
const babel = require('babel-core');

const readFile = filePath => new Promise((resolve, reject) => {
  console.log('FilePath', filePath);
  fs.readFile(filePath, 'UTF8', (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

const parse = (filePath, babelPlugins) => {
  return readFile(filePath)
    .then(fileContents => babel.transform(fileContents, babelPlugins).code)
    .then(transpiledData => {
      const nodeCollection = [];
      esprima.parseModule(transpiledData, {jsx: true}, node => analyseNode(node, nodeCollection))
      return nodeCollection;
    })
    .catch(err => console.log(err));
};

const analyseNode = function (node, nodeCollection) {

  if (node.type === 'ImportDeclaration') {
    nodeCollection.push({
      filePath: node.source.value,
    });
  }
  return;
}

module.exports = parse;