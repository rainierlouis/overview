const babylon = require('babylon');
const walk = require('babylon-walk');
const fs = require('fs');
const path = require('path');
// var Promise = require('bluebird');
const babylonConfig = {
  sourceType: "module",
  plugins: [
    "jsx",
    "objectRestSpread",
    "classProperties",
  ]
};

process.on('unhandledRejection', (p) => {
  console.log('Unhandled Rejection at:',p);
});

async function parse (entryPoint) {

  const nodes = {};
  const visited = [];

  async function scan (filePath) {
    visited.push(filePath);
    const fileContent = await readFile(filePath);
    const ast = babylon.parse(fileContent, babylonConfig);
    const state = await walker(ast, visitors);
    const filesToParse = await Promise.prototype.some(state.files,
      data => parseFilePath(data.source.value,
        getPathtoParentFolder(entryPoint)));

    // flattening resulting array as Promise.protoype.some returns nested arrays
    state.files = filesToParse.map(path => path[0]);

    return state;
  }

  return scan(entryPoint);
}

const visitors = {
  ImportDeclaration(node, state) {
    if (node.source.value === 'react-router' ||
      node.source.value === 'react-router-native' ||
      node.source.value === 'react-router-dom') routerExist = true;
    state.files.push(node);
  },
  JSXIdentifier(node, state) {
    state.components.push(node);
  },
  JSXElement(node, state) {
    if (node.openingElement.name.name === 'Route' ||
      node.openingElement.name.name === 'PrivateRoute')
      state.routes.push(node.openingElement.attributes);
  },
};

async function walker (ast, visitors) {
  const state = {
    files: [],
    routes: [],
    components: [],
  }
  walk.simple(ast, visitors, state);
  return state;
}

const readFile = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, 'UTF8', (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

const fsAccessAsync = path => new Promise((resolve, reject) => {
  fs.access(path, err => {
    if (err) reject(err);
    resolve(path);
  })
});

const getPathtoParentFolder = filePath =>
  filePath.split('/').slice(0, -1).join('/') + '/';

const parseFilePath = async (source, currDir) => {
  if (source[0] !== '.') return Promise.reject();
  source = currDir + source;
  source = path.normalize(source);

  if (path.parse(source).ext === '.js' ||
    path.parse(source).ext === '.jsx') return source;
  if (path.parse(source).ext !== '') return Promise.reject();
  return Promise.prototype.some(
    [
      source + '.js',
      source + '.jsx',
      source + '/index.js'
    ],
    data => fsAccessAsync(data)
  );
};

Promise.prototype.some = function (array, callback) {
  return new Promise((resolve, reject) => {
    let success = [];
    let counter = 0;
    let error;
    array.forEach((element, index) => {
      counter++;
      callback(element, index, array)
      .then(result => {
        success.push(result);
        counter--;
        if (counter === 0) {
          if(success.length) resolve(success);
          else reject(error);
        }
      })
      .catch(e => {
        error = e;
        counter--;
        if (counter === 0) {
          if(success.length) resolve(success);
          else reject(error);
        }
      })
    });
  });
};

let testPath =  '/Users/karsten/Documents/CodeWorks/senior/overview/parser/test_apps/mapStories/src/index.js';
parse(testPath)
.then(data => console.log(data))
.catch(err => console.log(err));

