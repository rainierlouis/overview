const fs = require("fs-extra");
const path = require("path");
const mkdirp = require("mkdirp");

module.exports = {
  visualData: async pwd => {
    await mkdirp("visual", err => {
      if (err) throw err;
    });
    await fs.copy("./node_modules/app-overview/client", "visual");
  }
};
