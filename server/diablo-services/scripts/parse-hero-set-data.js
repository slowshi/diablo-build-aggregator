var fs = require('fs');
var Promise = require('promise');
var accessToken = '';
var setsDataService = require('../sets-data-service.js');
var crudService = require('../crud-service.js');
var apiService = require('../api-service.js');

var init = function init(id) {
  return new Promise(function (resolve, reject) {
    setsDataService.init()
    .then(function(){
      resolve();
    });
  });
};

module.exports = {
  init: init
};