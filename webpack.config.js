const path = require("path");

module.exports = {
  entry: `./index.js`,
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "ovNpm.js"
  },
  target: "node",
  resolve: { symlinks: false },
  node: {
    readline: "empty"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|visual)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["es2015", "stage-0", "react"]
          }
        }
      }
    ]
  }
};
