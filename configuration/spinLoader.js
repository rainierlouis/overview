module.exports = {
  loadingTime: (spinnerItem, time) => {
    setTimeout(() => {
      spinnerItem.color = "red";
    }, time);
    setTimeout(() => {
      spinnerItem.color = "yellow";
    }, time + 400);
    setTimeout(() => {
      spinnerItem.color = "green";
    }, time + 700);
  },
  loadSpinner: async (spinner, time = 0, successText = "", startText = "") => {
    module.exports.loadingTime(spinner, time);
    setTimeout(() => {
      spinner.succeed(` ${successText}`);
      spinner.start(` ${startText}`);
    }, time + 1000);
  }
};
