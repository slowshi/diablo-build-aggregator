var fs = require('fs');
var Promise = require('promise');
var crudService = require('../crud-service.js');
var apiService = require('../api-service.js');
var heroDataService = require('../hero-data-service.js');
var itemDataService = require('../item-data-service.js');
var setsDataService = require('../sets-data-service.js');
var _ = require('lodash');

var init = function init(_className, _refresh) {
  var refresh = _refresh || false;
  var className = _className || 'rift-monk';
  return new Promise(function (resolve, reject) {
    apiService.getLadderData(className, refresh).
    then(function(data){
      var heroArray = [];
      for(var i =0; i < data.row.length; i++) {
        var hero = data.row[i];
        heroArray.push(
          apiService.getHeroData(hero, refresh)
          .then(heroDataService.parseHero));
      }
      Promise.all(heroArray).then(function(res){
        var invalidHeroes = _.without(res, 0);
        apiService.omitInvalidHeroes(className, invalidHeroes);
        console.log("Done getting users!")
        var allItems = heroDataService.getAllItemIds();
        var allSkills = heroDataService.getAllSkills();
        var heroItems = [];
        for (var j = 0; j < allItems.length; j++) {
          var item = allItems[j];
          heroItems.push(
            apiService.getItemData(item)
            .then(itemDataService.parseItems));
        }
        return Promise.all(heroItems).then(function(res){
          console.log('Done getting items!');
          var allSets = itemDataService.getAllSets();
          return crudService._save('js/item-data/sets.json', allSets)
          .then(crudService._save('js/item-data/itemids.json', allItems))
          .then(crudService._save('js/player-data/skills.json', allSkills))
          .then(setsDataService.init)
          .then(function(){
            resolve();
          });
        });
      });
    });
  });
}
//API service should have a save itemids, sets and skills
//getLadderData should call all regions and combine to one JSON with region as a key
//running this should build all the data needed for a single className
//heroData should save to a specific className folder

module.exports = {
  init: init
};