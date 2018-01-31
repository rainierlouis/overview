const fs = require("fs");
const mkdirp = require("mkdirp");
const path = require("path");

// require Visual logic

const filePath = path.join(__dirname, `../client/data/data.js`);

const visualData = dataObj => {
  fs.writeFile(filePath, dataObj, err => {
    if (err) throw err;
  });
};

module.exports = { visualData };
