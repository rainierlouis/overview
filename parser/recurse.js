const parse = require('./parse.js');

const recurse = (entryPoint, recurCrit, babelPlugins) => {

  if (entryPoint.includes('/')) visited[entryPoint] = true;

  parse(entryPoint, recurCrit, babelPlugins)
    .then((data) => {
      data.forEach(el => {
        if (el.filePath.includes('/') && !visited.el) {
          console.log('parsing ', el);
        }
      })
    })
    .catch(err => console.log(err));
}

module.exports = recurse;

