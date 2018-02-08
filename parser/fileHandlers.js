const fs = require("fs");
const path = require("path");

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

module.exports = {
  readFile,
  fsAccessAsync,
  getPathtoParentFolder,
  parseFilePath
};
