const path = require('path');

module.exports = {
 entry: './app.js',
 output: {
  path: path.resolve(__dirname, 'dist'),
  filename: 'build/visual.html'
 },
 module: {
  rules: [{ test: /\(app|index)$/, use: './Parsers/parse.js' }]
 }
};

module.exports = config;
