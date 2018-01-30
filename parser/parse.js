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
  visited.push(filePath);
  // console.log(filePath);
  // console.log(visited);
  const fileContent = fs.readFileSync(filePath, 'UTF8');
  const components = [];
  const files = [];
  let ast = babylon.parse(fileContent, {
    sourceType: "module",
    plugins: [
      "jsx",
      "objectRestSpread",
      "classProperties",
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

  let currentPath = temp.slice(0, temp.length - 1).join('/') + '/';

  structure[selfID] = new Entity(
    selfID,
    temp[temp.length - 1],
    'file',
    filePath,
    []
  );

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

  files.forEach(node => {
    let url = parseFilePath(node.source.value, currentPath);
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
      parse(url, visited, structure, myID);
    }
  });

  return structure;
};

const parseFilePath = (url, entryFolder = conf.entryFolder) => {
  if (!url[0] === '.') return null;
  url = entryFolder + url;
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

console.log(parse(conf.entryPoint));
// parse(conf.entryPoint);

module.exports = parse;