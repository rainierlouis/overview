const conf = require('./conf');
const path = require('path');
const fs = require('fs');
const parse = require('./parse.js');

const analyze = (entryPoint, babelPlugins) => {
  const res = {};
  const visited = [];

  parse(entryPoint, babelPlugins, visited);

  return res;
}

const troll = async () => {
  let superfilanData = await analyze(conf.entryPoint, conf.babelPlugins);
};

troll();