var fs = require('fs');
var Promise = require('promise');
var accessToken = '';
var heroDataService = require('../hero-data-service.js');
var crudService = require('../crud-service.js');
var apiService = require('../api-service.js');

var parseHeroData = function parseHeroData(id) {
  return new Promise(function (resolve, reject) {
    apiService.getLadderData().
    then(function(data){
      var heroArray = [];
      for(var i =0; i< data.row.length; i++) {
        var hero = data.row[i];
        heroArray.push(
          apiService.loadHeroDataFromJson(hero)
          .then(heroDataService.parseHero));
      }
      Promise.all(heroArray).then(function(res){
        crudService._save('js/player-data/sets.json', heroDataService.getHeroSets())
      });
    });
  });
}


module.exports = {
  parseHeroData: parseHeroData
};