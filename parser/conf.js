const  entryPoint = '/test_data/src/containers/Viewer.js';
const  babelPlugins = {
  "plugins": [
    "transform-react-jsx",
  ],
  "presets": [
    "stage-2",
  ]
};
const  recurCrit = {
  compareType: 'ImportDeclaration',
  saveValue: 'source',
};

module.exports = {
  entryPoint: entryPoint,
  babelPlugins: babelPlugins,
  recurCrit: recurCrit,
}