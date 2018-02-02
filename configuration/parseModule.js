const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const parse = require("../parser/parse");

// TODO: Require parser function, invoke
// TODO: Take parsed data, create folder/file in client

const dataContent = {};

const jsonContent = jsonData => `
	export const data = [${jsonData}]
`;

const parsing = async entryPoint => {
  const jsonData = await parse(`./${entryPoint}`);
  const folderPath = await path.join(__dirname, `../client/data`);
  const filePath = await path.join(__dirname, `../client/data/data.js`);
  await mkdirp(folderPath, err => {
    if (err) throw err;
  });
  await fs.writeFile(filePath, jsonContent(jsonData), err => {
    if (err) throw err;
  });
};

module.exports = { parsing };
