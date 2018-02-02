const fs = require("fs-extra");
const path = require("path");
const mkdirp = require("mkdirp");

const visualData = async pwd => {
  // create folder
  await mkdirp(`visual`, err => {
    if (err) throw err;
  });
  // copy folder
  await fs.copy("./node_modules/app-overview/client", `visual`);
  // paste folder
};

module.exports = { visualData };
