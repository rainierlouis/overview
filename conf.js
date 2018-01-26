const  entryPoint = '/test_data/src/containers/Viewer.js';
const  babelPlugins = {
  "plugins": [
    "babel-plugin-transform-class-properties",
    "transform-react-jsx"
  ],
  "presets": [
    "es2015",
    "react"
  ]
};
const  recurCrit = 'ImportDeclaration';