const recurse = require('./parser/recurse');
const conf = require('./parser/conf');

const analyze = (entryPoint, recurCrit, babelPlugins) => {
  const res = {};
  const visited = {};

  recurse(entryPoint, recurCrit, babelPlugins);
}

analyze(conf.entryPoint, conf.recurCrit, conf.babelPlugins);