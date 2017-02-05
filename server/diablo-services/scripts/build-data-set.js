var fs = require('fs');
var Promise = require('promise');
var crudService = require('../crud-service.js');
var apiService = require('../api-service.js');
var heroDataService = require('../hero-data-service.js');
var itemDataService = require('../item-data-service.js');
var setsDataService = require('../sets-data-service.js');
var _ = require('lodash');

var getOneSet = function getOneSet(_className, _region, _refresh) {
  var refresh = _refresh || false;
  var region = _region || 'us';
  var className = _className || 'rift-monk';
  return new Promise(function (resolve, reject) {
    apiService.getLadderData(className, region, refresh).
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
          return apiService.omitInvalidHeroes(className, region, invalidHeroes)
        }
        return Promise.all(heroItems)
          .then(saveSets)
          .then(saveItemIds)
          .then(saveSkillIds)
          .then(omitInvalidHeroes)
          // .then(setsDataService.init)
          .then(function(){
            resolve();
          });
      });
    });
  });
};

var getAllSets = function(_refresh) {
  var refresh = _refresh || false;
  return new Promise(function (resolve, reject) {
    //instead of checking object equal, you have to check if object is contained
    //safely chain everything
    //put data into dataStore and pass it with sockets
    //combine regions
    //checking full set needs to be more clear
    //need smarter popular set. check variants with highest used set.
    var regions = [
      'us',
      // 'eu',
      // 'kr'
      ];
    var classes = [
      // 'rift-barbarian',
      // 'rift-crusader',
      // 'rift-dh',
      'rift-monk',
      // 'rift-wd',
      // 'rift-wizard'
    ];

    var allSets = [];
    for(var i in classes) {
      var className = classes[i];
      for(var j in regions){
        var region = regions[j];
        var parmas = [className, region];
        allSets.push(parmas);
      }
    }
    _.reduce(allSets,function(curr, next){
      return curr.then(function(){
        return getOneSet(next[0],next[1]);
      })
    }, Promise.resolve()).then(function() {
        resolve();
    });
  });
}
module.exports = {
  getOneSet: getOneSet,
  getAllSets: getAllSets
};