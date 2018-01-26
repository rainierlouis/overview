const path = require('path');

module.exports = {
 entry: `./test.js`,
 output: {
  path: path.resolve(__dirname, 'dist'),
  filename: 'ovNpm.js'
 },
 module: {
  rules: [
   {
    test: /\.js$/,
    exclude: /(node_modules|bower_components|visual)/,
    use: {
     loader: 'babel-loader',
     options: {
      presets: ['@babel/preset-env', 'env', 'es2015', 'stage-0', 'react']
     }
    }
   }
  ]
 }
};
