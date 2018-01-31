const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");
const parse = require("../parser/parse");

// TODO: Require parser function, invoke
// TODO: Take parsed data, create folder/file in client

const dataContent = {};

const parsing = async entryPoint => {
  const filePath = await path.join(__dirname, `../${entryPoint}`);
  return await parse(filePath);

  console.log("FILE PATH MY NINJA", filePath);
};

module.exports = { parsing };
