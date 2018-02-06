const babylon = require("babylon");
const walk = require("babylon-walk");
const fs = require("fs");
const path = require("path");

async function parse(entryPoint) {
  const nodes = {
    root: new Node("root", "Root", "root", entryPoint, [])
  };
  const visited = [];
  const componentNames = [];

  async function scan(filePath, parent) {
    visited.push(filePath);
    const fileContent = await readFile(filePath);
    const ast = babylon.parse(fileContent, babylonConfig);
    const state = await walker(ast, visitors);

    if (!state.files.length) return;

    let filesToParse;
    try {
      filesToParse = await Promise.prototype.some(state.files, node =>
        parseFilePath(node.source.value, getPathtoParentFolder(filePath))
      );
    } catch (e) {
      return;
    }
    // flattening resulting array as Promise.protoype.some returns nested arrays
    filesToParse = filesToParse.map(
      path => (typeof path === "string" ? path : path[0])
    );
    //implicitly creates nodes and returns list of files to parse
    filesToParse = createCompNodes(filesToParse, state, nodes, parent, visited);
    createRouter(state, nodes, parent);

    await Promise.all(
      filesToParse.map(el => {
        if (visited.includes(el.path)) return;
        else return scan(el.path, el.name);
      })
    );
  }
  await scan(entryPoint, "root").catch(err => console.log(err));
  return nodes;
}

const createRouter = (state, nodes, parent) => {
  if (state.routerExist && state.routes.length && state.routes.length > 1) {
    if (!nodes.router) {
      nodes["router"] = new Node("router", "Router", "router", null, []);
    }
    nodes[parent].children.push("router");

    state.routes.forEach(route => {
      for (let i = 0; i < route.length; i++) {
        if (
          route[i].value &&
          route[i].value.expression &&
          state.componentNames.includes(route[i].value.expression.name)
        ) {
          let name = route[i].value.expression.name;
          if (!nodes[name]) {
            nodes[name] = new Node(name, name, "component", null, []);
          }
          nodes.router.children.push(name);
          break;
        }
      }
    });
  }
};

const createCompNodes = (filesToParse, state, nodes, parent, visited) => {
  return filesToParse
    .map(path => {
      let name = path.match(/(\w*).\w{1,3}$/)[1];
      if (state.componentNames.includes(name)) {
        if (!nodes[name]) {
          nodes[name] = new Node(name, name, "component", path, []);
        }
        nodes[parent].children.push(name);
        if (!visited.includes(path)) {
          return { path, name };
        }
      }
      return;
    })
    .filter(el => el);
};

const babylonConfig = {
  sourceType: "module",
  plugins: ["jsx", "objectRestSpread", "classProperties"]
};

class Node {
  constructor(id, name, type, path, children) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.path = path;
    this.children = children;
  }
}

const visitors = {
  ImportDeclaration(node, state) {
    if (
      node.source.value === "react-router" ||
      node.source.value === "react-router-native" ||
      node.source.value === "react-router-dom"
    )
      state.routerExist = true;
    state.files.push(node);
    for (let i = 0; i < node.specifiers.length; i++) {
      state.componentNames.push(node.specifiers[i].local.name);
    }
  },
  JSXIdentifier(node, state) {
    state.components.push(node);
  },
  JSXElement(node, state) {
    if (
      node.openingElement.name.name === "Route" ||
      node.openingElement.name.name === "PrivateRoute"
    )
      state.routes.push(node.openingElement.attributes);
  }
};

async function walker(ast, visitors) {
  const state = {
    files: [],
    routes: [],
    components: [],
    componentNames: [],
    routerExist: false
  };
  walk.simple(ast, visitors, state);
  return state;
}

const readFile = filePath =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, "UTF8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

const fsAccessAsync = path =>
  new Promise((resolve, reject) => {
    fs.access(path, err => {
      if (err) reject(err);
      resolve(path);
    });
  });

const getPathtoParentFolder = filePath =>
  filePath
    .split("/")
    .slice(0, -1)
    .join("/") + "/";

const parseFilePath = async (source, currDir) => {
  if (source[0] !== ".") return Promise.reject();
  source = currDir + source;
  source = path.normalize(source);

  if (path.parse(source).ext === ".js" || path.parse(source).ext === ".jsx")
    return source;
  if (path.parse(source).ext !== "") return Promise.reject();
  return Promise.prototype.some(
    [source + ".js", source + ".jsx", source + "/index.js"],
    data => fsAccessAsync(data)
  );
};

Promise.prototype.some = function(array, callback) {
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
            if (success.length) resolve(success);
            else reject(error);
          }
        })
        .catch(e => {
          error = e;
          counter--;
          if (counter === 0) {
            if (success.length) resolve(success);
            else reject(error);
          }
        });
    });
  });
};

module.exports = parse;
