var fs = require('fs');
var Promise = require('promise');
var accessToken = '';
var heroDataService = require('../hero-data-service.js');
var crudService = require('../crud-service.js');
var apiService = require('../api-service.js');

var init = function init(id) {
  return new Promise(function (resolve, reject) {
    apiService.getLadderData().
    then(function(data){
      var heroArray = [];
      //data.row.length
      for(var i =0; i < data.row.length; i++) {
        var hero = data.row[i];
        heroArray.push(
          apiService.getHeroData(hero)
          .then(heroDataService.parseHero));
      }
      Promise.all(heroArray).then(function(res){
        console.log("Done getting users!")
        var allItems = heroDataService.getAllItemIds();
        return crudService._save('js/item-data/itemids.json', allItems).then(
          function(){
            resolve();
          });
      });
    });
  });
}


module.exports = {
  init: init
};