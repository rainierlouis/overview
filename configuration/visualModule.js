const fs = require("fs-extra");
const path = require("path");

module.exports = {
  visualData: async pwd => {
    await fs.ensureDir("visual", err => {
      if (err) throw err;
    });
    await fs.copy("./node_modules/app-overview/client", "visual");
  }
};
