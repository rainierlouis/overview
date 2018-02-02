const readline = require('readline');
const chalk = require('chalk');

const { menu } = require('./consoleHelp');
const { remove } = require('./consoleRemove');

const log = console.log;

const reset = {
 // test comment
 reset: () => process.stdout.write('\x1B[2J\x1B[0f'),
 resetTick: (tick, space = '') => {
  return process.stdout.write(`${chalk.green.cyan(tick)}${space}`);
 },
 percent: (p, t, b = false, c) => {
  readline.cursorTo(process.stdout, 0);
  reset.resetTick(`[ ${t}`);
  reset.resetTick(`${t} ]     `);
  process.stdout.write(`${chalk.green('Cleaning')} ... ${chalk[c](`${p} %`)}`);
  b ? readline.cursorTo(process.stdout, 0) : null;
 },
 timerFunc: (func, time) => setTimeout(func, time),
 resetMethod: async () => {
  await reset.reset();
  await reset.timerFunc(() => reset.percent(0, '|', false, 'red'), 0);
  await reset.timerFunc(() => reset.percent(21, '/', false, 'red'), 500);
  await reset.timerFunc(() => reset.percent(43, '|', false, 'yellow'), 1000);
  await reset.timerFunc(() => reset.percent(65, '\\', false, 'yellow'), 1500);
  await reset.timerFunc(() => reset.percent(87, '|', false, 'green'), 2000);
  // await remove();
  await reset.timerFunc(() => reset.percent(99, '/', false, 'green'), 2500);
  await reset.timerFunc(() => reset.percent(100, '|', true, 'green'), 3000);
  await reset.timerFunc(() => {
   reset.reset();
   log(
    `${chalk.green(
     `[ ${chalk.bold('Removed')} ${chalk.grey(
      '--'
     )} Input entry point to start again! ]`
    )}`
   );
   menu();
  }, 3500);
 }
};

module.exports = {
 reset: reset.reset,
 resetEntire: reset.resetMethod,
 tick: reset.resetTick
};
