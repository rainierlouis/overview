const babylon = require("babylon");
const walk = require("babylon-walk");
const fs = require("fs");
const path = require("path");

async function parse(entryPoint) {
  const nodes = {
    root: new Node("root", "Root", "root", entryPoint, [])
  };
  const visited = [];
  let validNodes = [];

  async function scan(filePath, parent) {
    visited.push(filePath);
    const fileContent = await readFile(filePath);
    const ast = babylon.parse(fileContent, babylonConfig);
    const state = await walker(ast, visitors);
    validNodes = [...validNodes, ...checkNodeValidity(state)];

    if (!state.imports.length) return;

    let filesToParse;
    try {
      filesToParse = await Promise.prototype.some(state.imports, node =>
        parseFilePath(node.source.value, getPathtoParentFolder(filePath))
      );
    } catch (e) {
      return;
    }
    filesToParse.forEach(obj => {
      obj.result = Array.isArray(obj.result[0].result)
        ? obj.result[0].result[0]
        : obj.result[0].result;
    });

    createNodes(state, nodes, parent);
    createRouter(state, nodes, parent, validNodes);

    filesToParse = createfileList(filesToParse, state, visited);
    await Promise.all(
      filesToParse.map(el => {
        if (visited.includes(el.path)) return;
        else return scan(el.path, el.name);
      })
    );
  }
  await scan(entryPoint, "root").catch(err => console.log(err));
  return JSON.stringify(nodes);
}

const createNodes = (state, nodes, parent) => {
  state.imports.forEach(el => {
    for (let i = 0; i < el.specifiers.length; i++) {
      let name = el.specifiers[i].local.name;
      if (state.compNames.includes(name)) {
        if (!nodes[name]) {
          nodes[name] = new Node(name, name, "component", null, []);
        }
        nodes[parent].children.push(name);
      }
    }
  });
};

const createRouter = (state, nodes, parent, validNodes) => {
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
          validNodes.includes(route[i].value.expression.name)
        ) {
          let name = route[i].value.expression.name;
          nodes["router"].children.push(name);
          break;
        }
      }
    });
  }
};

const createfileList = (filesToParse, state, visited) => {
  return filesToParse
    .map(obj => {
      for (let i = 0; i < obj.input.specifiers.length; i++) {
        let name = obj.input.specifiers[i].local.name;
        if (state.compNames.includes(name)) {
          if (!visited.includes(obj.result)) {
            return { name, path: obj.result };
          }
          break;
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

    state.imports.push(node);
  },
  JSXIdentifier(node, state) {
    state.compNames.push(node.name);
  },
  // Identifier(node, state) {
  //   state.compNames.push(node.name);
  // },
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
    imports: [],
    routes: [],
    compNames: [],
    compNamesImport: [],
    routerExist: false
  };
  walk.simple(ast, visitors, state);
  return state;
}

const checkNodeValidity = state => {
  let res = [];
  state.imports.forEach(el => {
    for (let i = 0; i < el.specifiers.length; i++) {
      let name = el.specifiers[i].local.name;
      if (state.compNames.includes(name)) res.push(name);
    }
  });
  return res;
};

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
          success.push({ input: element, result });
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

let testPath =
  "/Users/karsten/Documents/CodeWorks/senior/overview/parser/test_apps/mapStories/src/Index.js";
parse(testPath)
  .then(data => console.log(data))
  .catch(err => console.log(err));

module.exports = parse;
