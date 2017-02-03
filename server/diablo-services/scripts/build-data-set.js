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
          apiService.getHeroData(hero, className, refresh)
          .then(heroDataService.parseHero));
      }
      return Promise.all(heroArray).then(function(res){
        console.log("Done getting users!")
        var invalidHeroes = _.without(res, 0);
        var allItems = heroDataService.getAllItemIds();
        var allSkills = heroDataService.getAllSkills();
        var heroItems = [];
        for (var j = 0; j < allItems.length; j++) {
          var item = allItems[j];
          heroItems.push(
            apiService.getItemData(item)
            .then(itemDataService.parseItems));
        }
        var saveSets = function saveSets() {
          var allSets = itemDataService.getAllSets();
          return apiService.updateItemSetTypes(allSets);
        }
        var saveItemIds = function saveItemIds() {
          return apiService.updateAllItemIds(allItems);
        }
        var saveSkillIds = function saveSkillIds() {
          return apiService.updateHeroSkills(className, allSkills);
        }
        var omitInvalidHeroes = function omitInvalidHeroes() {
          return apiService.omitInvalidHeroes(className, invalidHeroes)
        }
        return Promise.all(heroItems)
          .then(saveSets)
          .then(saveItemIds)
          .then(saveSkillIds)
          .then(omitInvalidHeroes)
          .then(setsDataService.init)
          .then(function(){
            resolve();
          });
      });
    });
  });
}
//getLadderData should call all regions and combine to one JSON with region as a key
//Make a separate call to combine every region into one.

module.exports = {
  init: init
};