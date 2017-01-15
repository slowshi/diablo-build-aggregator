var setsDataService = require('../sets-data-service.js');

var init = function init(id) {
  return new Promise(function (resolve, reject) {
    setsDataService.init();
    resolve();
  });
};

module.exports = {
  init: init
};