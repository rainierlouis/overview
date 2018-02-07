const babylon = require("babylon");
const walk = require("babylon-walk");
const fs = require("fs");
const path = require("path");

const createRouter = require("./parser/createRouter");
const createCompNodes = require("./parser/createCompNodes");

const babylonConfig = require("./parser/config").babylonConfig;
const visitors = require("./parser/config").visitors;
const Node = require("./parser/config").node;

const readFile = require("./parser/fileHandlers").readFile;
const fsAccessAsync = require("./parser/fileHandlers").fsAccessAsync;
const getPathtoParentFolder = require("./parser/fileHandlers")
  .getPathtoParentFolder;
const parseFilePath = require("./parser/fileHandlers").parseFilePath;
const walker = require("./parser/walker");
Promise.prototype.some = require("./parser/some");

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
  return JSON.stringify(nodes);
}

let testPath =
  "/Users/karsten/Documents/CodeWorks/senior/overview/parser/test_apps/mapStories/src/Index.js";
parse(testPath)
  .then(data => console.log(data))
  .catch(err => console.log(err));

module.exports = parse;
