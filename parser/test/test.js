var chai = require('chai');

const conf = require('../conf');
const parse = require('../parse.js');

describe('Testing analysis workflow', () => {
  describe('Parse function', () => {
    it('Should return an array', async () => {
      const toTest = await parse(conf.entryPoint, conf.recurCrit, conf.babelPlugins);
      chai.assert(Array.isArray(toTest));
    });
  });
});