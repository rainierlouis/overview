const  entryPoint = '/test_data/src/containers/Viewer.js';
const  babelPlugins = {
  "presets": [
    "react",
    "stage-2"
  ]
};
const  recurCrit = 'ImportDeclaration';

module.exports = {
  entryPoint: entryPoint,
  babelPlugins: babelPlugins,
  recurCrit: recurCrit,
}