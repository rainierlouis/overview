const readline = require('readline');
const chalk = require('chalk');

const reset = {
 reset: () => process.stdout.write('\x1B[2J\x1B[0f'),
 resetTick: (tick, space = '') => {
  return process.stdout.write(`${chalk.green.cyan(tick)}${space}`);
 },
 percent: (p, t, b = false, c) => {
  readline.cursorTo(process.stdout, 0);
  reset.resetTick(t);
  reset.resetTick(t, '    ');
  process.stdout.write(`${chalk.green('Cleaning')} ... ${chalk[c](`${p} %`)}`);
  b ? readline.cursorTo(process.stdout, 0) : null;
 }
};

module.exports = {
 reset
};
