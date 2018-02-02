const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const readline = require("readline");

// const folderPath = path.join(__dirname, '../visual');

const remove = {
  remDir: async () => {
    await fs.emptyDir(`./visual`, err => {
      if (err) throw err;
    });
  },
  remFile: async () => {
    await fs.unlink(`${folderPath}/user.config.js`, err => {
      if (err) throw err;
    });
    await remove.remDir();
  }
};

module.exports = {
  remove: remove.remFile
};
