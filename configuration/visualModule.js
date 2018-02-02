const fs = require("fs-extra");
const path = require("path");
const mkdirp = require("mkdirp");

const visualData = async pwd => {
  await mkdirp(`visual`, err => {
    if (err) throw err;
  });

  await fs.copy("./node_modules/app-overview/client", `visual`);
};

module.exports = { visualData };
