var _ = require('lodash');
var Promise = require('promise');
var itemDataService = require('./item-data-service.js');
var heroDataService = require('./hero-data-service.js');
var allHeroes = {};
var allSets = [];
var allItemIds = [];
var allItems = {};
var heroSets = {};
var popularSets = {};
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
var findSetSlug = function findSetSlug(wornSet, heroId) {
  var slug = allItems[wornSet[0]].set.slug;
  if(heroSets[slug] == void 0) {
    heroSets[slug] = {};
  }
  if(heroSets[slug][wornSet.length] == void 0) {
    heroSets[slug][wornSet.length] = {
      heroes: [],
      popularItemBuild: {
        head: [],
        torso: [],
        feet: [],
        hands: [],
        shoulders: [],
        legs: [],
        bracers: [],
        mainHand: [],
        offHand: [],
        waist: [],
        rightFinger: [],
        leftFinger: [],
        neck: []
      }
    };
  }
  heroSets[slug][wornSet.length].heroes.push(allHeroes[heroId]);
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
        findSetSlug(set,data.id);
        heroSets.push(set);
      }
    }
  }
}
var getPopularItems = function getPopularItems() {
  for(var i in heroSets) {
    var setName = heroSets[i];
    for(var j in setName) {
      var setCount = setName[j];
      for(var k in setCount.heroes) {
        var heroItems = setCount.heroes[k].items;
        for(var m in heroItems) {
          var slot = m;
          var item = heroItems[m];
          var popularSlot = setCount.popularItemBuild[slot];
          var hasSetItem = false;
          for(var n in popularSlot) {
            var popularItem = popularSlot[n];
            if(popularItem.id == item.id) {
              hasSetItem = true;
              popularItem.count++;
            }
          } 
          if (!hasSetItem) { 
            var genericItem = allItems[item.id];
            genericItem.count = 1;
            popularSlot.push(genericItem);
          }
        }
      }
    }
  }
}
var parseHeroSets = function parseHeroSets() {
  for(var i in allHeroes) {
    var heroSet = allHeroes[i];
    findHeroSets(heroSet);
  }
}

var init = function init(){
  return new Promise(function (resolve, reject) {
    allItems = itemDataService.getAllItems();
    allSets = itemDataService.getAllSets();
    allHeroes = heroDataService.getAllHeroes();
    parseHeroSets();
    resolve();
  });
};
var getHeroSets = function getHeroSets(slug) {
  if (slug === '') { 
    return _.cloneDeep(heroSets);
  }
  return _.cloneDeep(heroSets[slug]);
}

module.exports = {
  init: init,
  getHeroSets: getHeroSets,
  getPopularItems: getPopularItems
};