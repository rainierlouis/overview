const babylon = require("babylon");
const walk = require("babylon-walk");
const fs = require("fs");
const path = require("path");

const createNodes = require("./nodeHandlers").createNodes;
const checkNodeValidity = require("./nodeHandlers").checkNodeValidity;
const Node = require("./nodeHandlers").node;
const createFileList = require("./nodeHandlers").createFileList;

const babylonConfig = require("./ASThandlers").babylonConfig;
const visitors = require("./ASThandlers").visitors;
const walker = require("./ASThandlers").walker;

const readFile = require("./fileHandlers").readFile;
const fsAccessAsync = require("./fileHandlers").fsAccessAsync;
const getPathtoParentFolder = require("./fileHandlers").getPathtoParentFolder;
const parseFilePath = require("./fileHandlers").parseFilePath;
Promise.prototype.some = require("./some");

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
    validNodes = checkNodeValidity(state, validNodes);
    if (!state.imports.length) return;

    let filesToParse = await Promise.prototype.some(state.imports, node =>
      parseFilePath(node.path, getPathtoParentFolder(filePath))
    );

    filesToParse.forEach(obj => {
      if (Array.isArray(obj.result)) {
        obj.result = obj.result[0].result;
      }
    });
    filesToParse = createFileList(filesToParse, validNodes, visited);
    createNodes(state, validNodes, nodes, parent);

    await Promise.all(
      filesToParse
        .map(el => {
          if (visited.includes(el.path)) return;
          else {
            return scan(el.path, el.name);
          }
        })
        .filter(el => el)
    );
  }
  await scan(entryPoint, "root").catch(err => console.log("Scan error", err));
  return nodes;
}

module.exports = parse;
