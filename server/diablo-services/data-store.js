var _ = require('lodash');
var dataStore = {
  allItemIds: [],
  allItems: {},
  allSets: {},
  allHeroes: {},
  allSkills: {},
  ladderList: {},
  popularGearList: {}
};
var updateLadderList = function updateLadderList(ladderData) {
  var className = 'rift-' + ladderData.greaterRiftSoloClass;
  var region = ladderData.region;
  var heroIds = _.map(ladderData.row, 'player.heroId');
  if(typeof dataStore.ladderList[className] === 'undefined') {
    dataStore.ladderList[className] = {
      all: []
    };
  }
  dataStore.ladderList[className][region] = heroIds;
  dataStore.ladderList[className]['all'] = _.union(dataStore.ladderList[className]['all'], heroIds);
}
var updateItemData = function updateItemData(itemData) {
  dataStore.allItems[itemData.id] = itemData;
};

var updateItemList = function updateItemList(itemData) {
  if (dataStore.allItemIds.indexOf(itemData) === -1) {
    dataStore.allItemIds.push(itemData);
  } 
};

var updateHeroList = function updateHeroList(heroData) {
  dataStore.allHeroes[heroData.id] = heroData;
};

var updateSkillList = function updateSkillList(skillData) {
  dataStore.allSkills[skillData.slug] = skillData; 
};
var updateSetList = function updateSetList(itemSet) {
  dataStore.allSets[itemSet.slug] = itemSet;
}
var getDataStore = function getDataStore(key) {
  key = key || null;
  if(key) {
    return _.cloneDeep(dataStore[key]);
  }
  return _.cloneDeep(dataStore);
};
var updatePopularGearList = function updatePopularGearList(className, region, popularSets) {
  if(dataStore.popularGearList[className] === void 0) {
    dataStore.popularGearList[className] = {};
  }
  dataStore.popularGearList[className][region] = popularSets;
}
module.exports = {
  updateItemList: updateItemList,
  updateItemData: updateItemData,
  updateHeroList: updateHeroList,
  updateSkillList: updateSkillList,
  updateSetList: updateSetList,
  updateLadderList: updateLadderList,
  getDataStore: getDataStore,
  updatePopularGearList: updatePopularGearList
};