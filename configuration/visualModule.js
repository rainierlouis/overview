const fs = require("fs-extra");
const path = require("path");
const npmRoot = require("npm-root");

module.exports = {
  visualData: async pwd => {
    await npmRoot({ global: true }, async (err, globalPath) => {
      await fs.ensureDir(`${pwd}/visual`, err => {
        if (err) throw err;
        fs.copy(`${globalPath}/app-overview/client`, `${pwd}/visual`, err => {
          if (err) throw err;
          fs.copy(
            `${pwd}/visualTemp/data.js`,
            `${pwd}/visual/data/data.js`,
            err => {
              if (err) throw err;
              fs.remove(`${pwd}/visualTemp/data.js`, err => {
                if (err) throw err;
                fs.remove(`${pwd}/visualTemp`);
              });
            }
          );
        });
      });
    });
  }
};
