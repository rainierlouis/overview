const conf = require('./parser/conf');
const parse = require('./parser/parse.js');

const analyze = (entryPoint, recurCrit, babelPlugins) => {
  const res = {};
  const visited = {};

  if (entryPoint.includes('/')) visited[entryPoint] = true;

  parse(entryPoint, recurCrit, babelPlugins)
    .then(data => {
      data.forEach(el => {
        if (el.filePath.includes('/') && !visited.el) {
          console.log('parsing ', el);
        }
      })
    })
    .catch(err => console.log(err));
}

analyze(conf.entryPoint, conf.recurCrit, conf.babelPlugins);