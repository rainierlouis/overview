const parse = require('./parse.js');

const recurse = (entryPoint, recurCrit, babelPlugins) => {
  parse(entryPoint, babelPlugins)
    .then((data) => {
      for (let el of data.body) {
        if (el.type === recurCrit) {
          console.log(el.source.raw);
        }
      }
    })
    .catch(err => console.log(err));
}

module.exports = recurse;