const acorn = require('acorn-jsx');
const walk = require('acorn/dist/walk');
const fs = require('fs');
const path = require('path');
const babel = require('babel-core');
const conf = require('./conf');
const uuid = require('uuid');

// output file structure
// {
//   UUID: {
//     name: String,
//     type: Component || File,
//     path: String,
//     children: Array[UUID]
//   },
//   UUID: {
//     ...
//   }
// }

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
  return readFile(filePath)
    .then(fileContents => babel.transform(fileContents, {
      "plugins": [
        "transform-react-jsx",
      ],
      "presets": [
        "stage-2",
      ]
    }).code)
    .then(data => {
      const components = [];
      const files = [];
      walk.simple(acorn.parse(data, {
        sourceType: 'module',
      }), {
        ImportDeclaration(node) {
          files.push(node);
        },
        JSXOpeningElement(node) {
          components.push(node);
        }
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
      });
      console.log(structure);
    })
    .catch(e => console.log(e));
};

const parseFilePath = url => {
  if (!url[0] === '.') return null;
  url = conf.entryFolder + url;
  url = path.normalize(url);
  if (path.parse(url).ext === '.js' || path.parse(url).ext === '.jsx') return url;

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

parse(conf.entryPoint);

module.exports = parse;