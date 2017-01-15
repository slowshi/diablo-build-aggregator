var _ = require('lodash');
var Promise = require('promise');
var itemDataService = require('./item-data-service.js');
var heroDataService = require('./hero-data-service.js');
var allHeroes = {};
var allSets = [];
var allItemIds = [];
var allItems = {};
var heroSets = [];

var addToAllSets = function addToAllSets(heroSet) {
  var hasSet = false;
  for(var j in allSets) {
    var validSet = allSets[j];
    if(_.isEqual(validSet.sets, heroSet.sets)) {
      validSet.heroIds.push(heroSet.heroId);
      hasSet = true;
    }
  }
  if(!hasSet) {
    allSets.push({
      sets: heroSet.sets,
      heroIds: [heroSet.heroId]
    });
  }
}
var findSetSlug = function findSetSlug(itemId) {
  //console.log(allItems[itemId]);
}
var findHeroSets = function getHeroItems(data) {
  var heroSets = [];
  for(var i in data.items) {
    var item = data.items[i];
    if(item.setItemsEquipped !== void 0) {
      var set = item.setItemsEquipped.sort();
      var hasSet = false;
      for(var j in heroSets) {
        if(_.isEqual(heroSets[j], set)) {
          hasSet = true;
        }
      }
      if (!hasSet) { 
        findSetSlug(set[0]);
        heroSets.push(set);
      }
    }
  }
  var hero = {
    sets: heroSets, 
    heroId: data.id
  };
  return hero;
}
var findSetSlug = function findSetSlug(itemId) {
  //console.log(allItems[itemId]);
}
var parseHeroSets = function parseHeroSets() {

  var heroSets = findHeroSets(allHeroes[83494423]);
  console.log(heroSets);
  //addToAllSets(heroSets);
}

var init = function init(){
  allItems = itemDataService.getAllItems();
  allSets = itemDataService.getAllSets();
  allHeroes = heroDataService.getAllHeroes();
  console.log('madeSets');
  parseHeroSets();
};

module.exports = {
  init: init
};