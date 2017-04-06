var fs = require('fs');
var Promise = require('promise');
var crudService = require('../crud-service.js');
var apiService = require('../api-service.js');
var heroDataService = require('../hero-data-service.js');
var itemDataService = require('../item-data-service.js');
var setsDataService = require('../sets-data-service.js');
var dataStore = require('../data-store.js');
var _ = require('lodash');

var getOneSet = function getOneSet(_className, _region, _refresh) {
  var refresh = _refresh || false;
  var region = _region || 'us';
  var className = _className || 'rift-monk';
  return new Promise(function (resolve, reject) {
    apiService.getLadderData(className, region, refresh).
    then(function(data){
      var ladderData = data;
      var heroArray = [];
      var omitInvalidHeroes = function omitInvalidHeroes(res) {
        var invalidHeroes = _.without(res, 0);
        return apiService.omitInvalidHeroes(className, ladderData, invalidHeroes)
      }
      for(var i =0; i < ladderData.row.length; i++) {
        var hero = ladderData.row[i];
        heroArray.push(
          apiService.getHeroData(hero, className, refresh)
          .then(heroDataService.parseHero));
      }
      // _.reduce(ladderData.row,function(curr, next){
      //   return curr.then(function(){
      //     return apiService.getHeroData(next, className, refresh)
      //     .then(heroDataService.parseHero);
      //   })
      // }, Promise.resolve())
      return Promise.all(heroArray)
      .then(omitInvalidHeroes)
      .then(function(res){
        dataStore.updateLadderList(res);
        console.log("Done getting users!")
        var allItems = dataStore.getDataStore('allItemIds');
        var allSkills = dataStore.getDataStore('allSkills');
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

        var saveSkillIds = function saveSkillIds() {
          return apiService.updateHeroSkills(className, allSkills);
        }

        return Promise.all(heroItems)
        .then(saveSets)
        .then(saveSkillIds)
        .then(function(){
          resolve();
        });
      });
    });
  });
};

var getAllSets = function(_refresh) {
  var refresh = _refresh || false;
//  refresh = true;
  return new Promise(function (resolve, reject) {
    //validate that all the items are sets or uniques too.
    //put itemdata into dataStore and pass it with sockets
    //combine regions when you get popular data
    //need smarter popular set. check variants with highest used set.
    var regions = [
      'us',
      'eu',
      'kr'
      ];
    var classes = [
      'rift-barbarian',
      'rift-crusader',
      'rift-dh',
      'rift-monk',
      'rift-wd',
      'rift-wizard'
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
        return getOneSet(next[0], next[1], refresh);
      })
    }, Promise.resolve()).then(function() {
      var ladderList = dataStore.getDataStore('ladderList');
      for(var className in ladderList){
        var popularGearSet = setsDataService.getPopularGearSets(ladderList[className].all);
        dataStore.updatePopularGearList(className, 'all', popularGearSet);
        // for(var region in ladderList[className]) {
        //   var popularGearSet = setsDataService.getPopularGearSets(ladderList[className][region]);
        //   dataStore.updatepopularGearList(className, region, popularGearSet);
        // }
      }
      console.log(dataStore.getDataStore('popularGearList'))
      resolve();
    });
  });
}
module.exports = {
  getOneSet: getOneSet,
  getAllSets: getAllSets
};