var _ = require('lodash');
var Promise = require('promise');
var allSets = [];
var allItems = {};

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
};

var findSets = function getHeroItems(item) {
  if(item.set !== void 0) {
    var hasSet = false;
    for(var i in allSets) {
      if (allSets[i].slug == item.set.slug) {
        hasSet = true;
      }
    }
    if(!hasSet) {
      allSets.push(item.set);
    }
  }
};

var parseItems = function parseItems(item) {
 return new Promise(function (resolve, reject) {
    allItems[item.id] = item;
    findSets(item);
    resolve();
  });
};

var getAllItems = function getAllItems() {
  return _.cloneDeep(allItems);
};

var getAllSets = function getAllSets() {
  return _.cloneDeep(allSets);
};

module.exports = {
  parseItems: parseItems,
  getAllItems: getAllItems,
  getAllSets: getAllSets
};