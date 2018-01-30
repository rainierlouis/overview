const babylon = require('babylon');
const walk = require('babylon-walk');
const fs = require('fs');
const path = require('path');
const conf = require('./conf');
const uuid = require('uuid');

class Entity {
  constructor (id, name, type, path, children) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.path = path;
    this.children = children;
  }
}

const parse = (filePath, visited = [], structure = {}, selfID = uuid()) => {
  console.log('JAJAJAJAJAJAJAJA');
  return readFile(filePath)
    .then(data => {
      const components = [];
      const files = [];

      let ast = babylon.parse(data, {
        sourceType: "module",
        plugins: [
          "jsx",
        ]
      });

      walk.simple(ast, {
        ImportDeclaration(node) {
          files.push(node);
        },
        JSXOpeningElement(node) {
          components.push(node.name);
        },
      });

      let temp = filePath.split('/');
      structure[selfID] = new Entity(
        selfID,
        temp[temp.length - 1],
        'file',
        filePath,
        []
      );

      files.forEach(node => {
        let url = parseFilePath(node.source.value);
        if (!url) return;
        let myID = uuid();
        let temp = url.split('/');
        structure[myID] = new Entity(
          myID,
          temp[temp.length - 1],
          'file',
          url,
          []
        );
        structure[selfID].children.push(myID);

        if (!visited.includes(url)) {
          visited.push(url);
          parse(url, visited, structure, selfID = myID);
        }
      });

      components.forEach(node => {
        let myID = uuid();
        structure[myID] = new Entity(
          myID,
          node.name,
          'component',
          null,
          []
        );
        structure[selfID].children.push(myID);
      });
      return structure;
    })
    .then(data => data)
    .catch(e => console.log(e));
};

const parseFilePath = url => {
  if (!url[0] === '.') return null;
  url = conf.entryFolder + url;
  url = path.normalize(url);
  if (path.parse(url).ext === '.js' ||
    path.parse(url).ext === '.jsx') return url;

  if (path.parse(url).ext === '') {
    try {
      fs.accessSync(url + '.js');
      return url + '.js';
    } catch (e) {
      try {
        fs.accessSync(url + '.jsx');
        return url + '.jsx';
      } catch (e) {
        try {
          fs.accessSync(url + '/index.js');
          return url + '/index.js';
        } catch (e) {
          return null;
        }
      }
    }
  } else return null;
};

const readFile = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, 'UTF8', (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

parse(conf.entryPoint)
.then(data => console.log(data));

module.exports = parse;