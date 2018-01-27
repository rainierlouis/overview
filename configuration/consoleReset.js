const readline = require('readline');

const reset = {
 reset: () => process.stdout.write('\x1B[2J\x1B[0f'),
 percent: p => {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(`Clearing Visual data --`);
  process.stdout.write(`Clearing ... ${p}%`);
 }
};

module.exports = {
 reset
};
