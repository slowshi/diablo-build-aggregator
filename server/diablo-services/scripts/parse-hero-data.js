var fs = require('fs');
var Promise = require('promise');
var accessToken = '';
var heroDataService = require('../hero-data-service.js');
var crudService = require('../crud-service.js');
var apiService = require('../api-service.js');

var init = function init(_refresh) {
  var refresh = _refresh || false;
  return new Promise(function (resolve, reject) {
    apiService.getLadderData(refresh).
    then(function(data){
      var heroArray = [];
      //data.row.length
      for(var i =0; i < data.row.length; i++) {
        var hero = data.row[i];
        heroArray.push(
          apiService.getHeroData(hero, refresh)
          .then(heroDataService.parseHero));
      }
      Promise.all(heroArray).then(function(res){
        console.log("Done getting users!")
        var allItems = heroDataService.getAllItemIds();
        var allSkills = heroDataService.getAllSkills();
        console.log("YES");
        return crudService._save('js/item-data/itemids.json', allItems)
        .then(function(){
          return crudService._save('js/player-data/skills.json', allSkills)
          .then(
            function(){
              resolve();
            });
        })
      });
    });
  });
}


module.exports = {
  init: init
};