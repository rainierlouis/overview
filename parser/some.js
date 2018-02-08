const some = function(array, callback) {
  return new Promise((resolve, reject) => {
    let success = [];
    let counter = 0;
    let error;
    array.forEach((element, index) => {
      counter++;
      callback(element, index, array)
        .then(result => {
          success.push({ input: element, result });
          counter--;
          if (counter === 0) {
            resolve(success);
          }
        })
        .catch(e => {
          error = e;
          counter--;
          if (counter === 0) {
            resolve(success);
          }
        });
    });
  });
};

module.exports = some;
