const some = function(array, callback) {
  return new Promise((resolve, reject) => {
    let success = [];
    let counter = 0;
    let error;
    array.forEach((element, index) => {
      counter++;
      callback(element, index, array)
        .then(result => {
          success.push(result);
          counter--;
          if (counter === 0) {
            if (success.length) resolve(success);
            else reject(error);
          }
        })
        .catch(e => {
          error = e;
          counter--;
          if (counter === 0) {
            if (success.length) resolve(success);
            else reject(error);
          }
        });
    });
  });
};

module.exports = some;
