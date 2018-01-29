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
      structure[selfID] = new Entity(selfID, filePath.split('/')[filePath.length - 1], 'file', filePath, []);
      return Promise.all(files.map(node => new Promise(resolve =>
        resolve(
          parseFilePath(node.source.value)
            .then(url => {
              if (!url) return resolve(null);
              let myID = uuid();
              structure[myID] = new Entity(myID, url.split('/')[url.length - 1], 'file', url, []);
              structure[selfID].children.push(myID);
              // console.log('DEPP', structure);
              return resolve(null);
            })
          // .catch(err => console.log(err))
      ))))
        // .then(console.log('Here we go: ', structure))
    })
    .then(data => console.log(data, structure))
    // .then(data => {
    //   data.forEach(el => {
    //     parseFilePath(el.filePath, visited);
    //   })
    // })
    .catch(err => console.log(err));
};

const parseFilePath = url => new Promise((resolve, reject) => {
  if (url[0] === '.') {
    url = conf.entryFolder + url;
    url = path.normalize(url);
    if (path.parse(url).ext === '.js' || path.parse(url).ext === '.jsx') {
      resolve(url);
    } else if (path.parse(url).ext === '') {
      fs.access(url + '.js', err => {
        if (!err) resolve(url + '.js');
        fs.access(url + 'jsx', err => {
          if (!err) resolve(url + '.jsx');
          fs.access(url + '/index.js', err => {
            if (!err) resolve(url + '/index.js');
            reject(err);
           })
        })
      })
    }
  } else resolve(null);
})

const readFile = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, 'UTF8', (err, data) => {
    if (err) reject(err);
    else resolve(data);
  });
});

parse(conf.entryPoint);

module.exports = parse;