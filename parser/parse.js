const babylon = require('babylon');
const walk = require('babylon-walk');
const fs = require('fs');
const path = require('path');
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

const parse = (
  filePath,
  intel = {visited: []},
  structure = {},
  selfID = uuid(),
) => {
  selfID = Object.keys(structure).length ? selfID : 'root';
  intel.visited.push(filePath);
  const fileContent = fs.readFileSync(filePath, 'UTF8');

  const components = [];
  const files = [];
  const componentNames = [];
  const routes = [];
  let routerExist = false;

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
      if (node.source.value === 'react-router' ||
        node.source.value === 'react-router-native' ||
        node.source.value === 'react-router-dom') routerExist = true;
      files.push(node);
    },
    JSXIdentifier(node) {
      components.push(node);
    },
    JSXElement(node) {
      if (node.openingElement.name.name === 'Route' ||
        node.openingElement.name.name === 'PrivateRoute')
        routes.push(node.openingElement.attributes);
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
  files.forEach(node => {
    let url = parseFilePath(node.source.value, currentPath);
    if (!url) return;

    for (let i = 0; i < node.specifiers.length; i++) {
      componentNames.push(node.specifiers[i].local.name);
    }
    if (!intel.visited.includes(url)) {
      let myID = uuid();
      let temp = url.split('/');

      let name = temp[temp.length - 1] === 'index.js' ?
        temp.slice(temp.length - 2).join('/') : temp[temp.length - 1];
      structure[myID] = new Entity(
        myID,
        name,
        'file',
        url,
        []
      );
      structure[selfID].children.push(myID);
      parse(url, intel, structure, myID);
    }
  });

  components.forEach(node => {
    if (!componentNames.includes(node.name)) return;

    for (let i = 0; i < structure[selfID].children.length; i++) {
      if (structure[structure[selfID].children[i]].name === node.name) return;
    }

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

  if (routerExist && routes.length && routes.length > 1) {
    let routerID = uuid();
    structure[routerID] = new Entity(
      routerID,
      'Router',
      'router',
      null,
      []
    );
    structure[selfID].children.push(routerID);

    routes.forEach(route => {
      for (let i = 0; i < route.length; i++) {
        if (route[i].value &&
            route[i].value.expression &&
            componentNames.includes(route[i].value.expression.name)) {
          let myID = uuid();
          structure[myID] = new Entity(
            myID,
            route[i].value.expression.name,
            'component',
            null,
            []
          );
          structure[routerID].children.push(myID);
          break;
        }
      }
    })
  }

  return JSON.stringify(structure);
};

const parseFilePath = (url, currentPath) => {
  if (!url[0] === '.') return null;
  url = currentPath + url;
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

module.exports = parse;