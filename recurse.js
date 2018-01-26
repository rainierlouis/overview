const parse = require('./parse.js');

const recurse = crit => {

  parse(entryPoint, babelPlugins)
    .then((data) => {
      for (let el of data.body) {
        if (el.type === crit) {
          console.log(el.source.raw);
        }
      }
    })
    .catch(err => console.log(err));
}

module.exports = recurse;