const fs = require("fs-extra");
const mkdirp = require("mkdirp");
const path = require("path");
const parse = require("../parser/parse");

// TODO: Require parser function, invoke
// TODO: Take parsed data, create folder/file in client

const dataContent = {};

const jsonContent = jsonData => `
	export const data = ${jsonData}
`;

const parsing = async (entryPoint, pwd) => {
  const jsonData = await parse(`./${entryPoint}`);
  const filePath = `${pwd}/node_modules/app-overview/client/data/data.js`;
  await fs.outputFile(filePath, jsonContent(jsonData), err => {
    if (err) throw err;
  });
};

module.exports = { parsing };
