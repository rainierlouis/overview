const babylon = require("babylon");
const walk = require("babylon-walk");
const fs = require("fs");
const path = require("path");

const createNodes = require("./parser/nodeHandlers").createNodes;
const checkNodeValidity = require("./parser/nodeHandlers").checkNodeValidity;
const Node = require("./parser/nodeHandlers").node;
const createFileList = require("./parser/nodeHandlers").createFileList;

const babylonConfig = require("./parser/ASThandlers").babylonConfig;
const visitors = require("./parser/ASThandlers").visitors;
const walker = require("./parser/ASThandlers").walker;

const readFile = require("./parser/fileHandlers").readFile;
const fsAccessAsync = require("./parser/fileHandlers").fsAccessAsync;
const getPathtoParentFolder = require("./parser/fileHandlers")
  .getPathtoParentFolder;
const parseFilePath = require("./parser/fileHandlers").parseFilePath;
Promise.prototype.some = require("./parser/some");

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

    let filesToParse = await Promise.prototype.some(state.imports, node =>
      parseFilePath(node.path, getPathtoParentFolder(filePath))
    );
    console.log(1);
    filesToParse.forEach(obj => {
      obj.result = Array.isArray(obj.result[0].result)
        ? obj.result[0].result[0]
        : obj.result[0].result;
    });
    filesToParse = createFileList(filesToParse, validNodes, visited);
    console.log(2);

    createNodes(validNodes, nodes, parent);
    console.log(3);

    await Promise.all(
      filesToParse
        .map(el => {
          if (visited.includes(el.path)) return;
          else return scan(el.path, el.name);
        })
        .filter(el => el)
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
