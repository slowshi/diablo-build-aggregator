var fs = require('fs');
var Promise = require('promise');
var heroDataService = require('../hero-data-service.js');
var crudService = require('../crud-service.js');
var apiService = require('../api-service.js');

var saveHeroData = function setHeroData() {
  return new Promise(function (resolve, reject) {
    apiService.getLadderData(true)
    .then(function(data){
        var heroArray = [];
        for(var  i = 0; i < data.row.length; i++) {
          var heroData = data.row[i];
          var getHero = apiService.loadHeroDataFromEndpoint(heroData);
          heroArray.push(getHero);
        }
        Promise.all(heroArray).then(function(res){
        console.log('Done saving heroes!');
        return;
      });
    });
  });
};

module.exports = {
  saveHeroData: saveHeroData,
};