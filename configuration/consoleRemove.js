const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const readline = require("readline");

const folderPath = path.join(__dirname, "../Visual");

const remove = {
  remDir: async () => {
    // await fs.rmdir(folderPath, err => {
    //  if (err) throw err;
    // });
    await fs.rmdir(folderPath, err => {
      if (err) throw err;
    });
  },
  remFile: async () => {
    await fs.unlink(`${folderPath}/user.config.js`, err => {
      if (err) throw err;
    });
    // await fs.unlick(`${folderPath}/visual.html`, err => {
    //  if (err) throw err;
    // });
    await remove.remDir();
  }
};

module.exports = {
  remove: remove.remFile
};
