var fs = require('fs');
var Promise = require('promise');
var accessToken = '';
var heroDataService = require('../hero-data-service.js');
var itemDataService = require('../item-data-service.js');
var crudService = require('../crud-service.js');
var apiService = require('../api-service.js');

var init = function init(id) {
  return new Promise(function (resolve, reject) {
    crudService._load('js/item-data/itemids.json')
    .then(function(res){
      var allItems = res;
      var heroItems = [];
      for (var j = 0; j < allItems.length; j++) {
          var item = allItems[j];
          heroItems.push(
            apiService.getItemData(item)
            .then(itemDataService.parseItems));
        }
        Promise.all(heroItems).then(function(res){
          console.log('Done getting items!');
          var allSets = itemDataService.getAllSets();
          crudService._save('js/item-data/sets.json', allSets);
          resolve();
        });
    });
  });
}


module.exports = {
  init: init
};