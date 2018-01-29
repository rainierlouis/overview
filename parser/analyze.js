const conf = require('./conf');
const path = require('path');
const fs = require('fs');
const parse = require('./parse.js');

const analyze =  (entryPoint, babelPlugins) => {
  const res = {};
  const visited = [];

  visited.push(entryPoint);

  return parse(entryPoint, babelPlugins)
    .then(data => {
      console.log('Parsing ', data);
      data.forEach(el => {
        parseFilePath(el.filePath, babelPlugins);
      })
      return res;
    })
    .catch(err => console.log('Error', err));
}

const parseFilePath = (url, babelPlugins) => {
  if (url[0] === '.') {
    url = conf.entryFolder + url;
    url = path.normalize(url);
    if (path.parse(url).ext === '.js' || path.parse(url).ext === '.jsx') {
      parse(url, babelPlugins)
    } else if (path.parse(url).ext === '') {
      fs.access(url + '.js', (err) => {
        if (err) {
          return fs.access(url + '.jsx', (err) => {
            if (err) {
              return fs.access(url + '/index.js', (err) => {
                if (err) return console.error("DAS ERROR", url, err);
                console.log('Lvl 3 parsing');
                parse(url + '/index.js', babelPlugins);
              })
            }
            console.log('Lvl 2 parsing');
            parse(url + '.jsx', babelPlugins);
          })
        }
        console.log('Lvl 1 parsing');
        parse(url + '.js', babelPlugins);
      })
    } else {
      return;
    }
  }
}

const troll = async () => {
  let superfilanData = await analyze(conf.entryPoint, conf.babelPlugins);
};

troll();