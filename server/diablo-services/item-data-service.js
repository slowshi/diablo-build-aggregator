var _ = require('lodash');
var Promise = require('promise');
var allSets = [];
var allItems = {};

var findSets = function getHeroItems(item) {
  if(item.set !== void 0 && (item.set.ranks.indexOf(6) > -1 || item.set.slug === 'legacy-of-nightmares')) {
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
var getItem = function getItem(itemid) {
  return _.cloneDeep(allItems[itemid]);
}
var getItems = function getItems(itemSet) {
  var expandedSet = [];
  for(var i in itemSet) {
    expandedSet.push(getItem(itemSet[i]));
  }
  return expandedSet;
}
module.exports = {
  parseItems: parseItems,
  getAllItems: getAllItems,
  getAllSets: getAllSets,
  getItem: getItem,
  getItems: getItems
};