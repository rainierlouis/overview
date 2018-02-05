const fs = require("fs-extra");
const mkdirp = require("mkdirp");
const path = require("path");
const parse = require("../parser/parse");

const dataContent = {};

const jsonContent = jsonData => `const data = ${jsonData}`;

module.exports = {
  parsing: async (entryPoint, pwd) => {
    const jsonData = await parse(`./${entryPoint}`);
    const filePath = `${pwd}/node_modules/app-overview/client/data/data.js`;
    await fs.outputFile(filePath, jsonContent(jsonData), err => {
      if (err) throw err;
    });
  }
};
