const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const opn = require('opn');

// require Visual logic
const filePath = path.join(__dirname, `../client/data/data.js`);

const visualData = dataObj => {
 const fileContent = `${dataObj}`;
 fs.writeFile(filePath, fileContent, err => {
  if (err) throw err;
 });
 // continue visualising, return file
};

module.exports = { visualData };
