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
  const extractedData = await readFile(filePath)
    .then(fileContents => babel.transform(fileContents, babelPlugins).code)
    .then(transpiledData => {
      const nodeCollection = [];
      esprima.parseModule(transpiledData, {jsx: true}, node => analyseNode(node, recurCrit, nodeCollection))
      return nodeCollection;
    })
    .catch(err => console.log(err));

  return extractedData;
};

const analyseNode = function (node, recurCrit, nodeCollection) {

  if (node.type === recurCrit.compareType) {
    nodeCollection.push({
      filePath: node.source.value,
    });
  }
  return nodeCollection;
}

module.exports = parse;