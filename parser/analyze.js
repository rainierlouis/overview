const recurse = require('./recurse');
const conf = require('./conf');

const analyze = (entryPoint, recurCrit, babelPlugins) => {
  const res = {};
  const visited = {};

  recurse(entryPoint, recurCrit, babelPlugins);
}

analyze(conf.entryPoint, conf.recurCrit, conf.babelPlugins);