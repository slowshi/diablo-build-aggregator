var _ = require('lodash');
var dataStore = {
  allItemIds: [],
  allItems: {},
  allHeroes: {},
  allSkills: {}
};
var updateItemData = function updateItemData(itemData) {
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

var getDataStore = function getDataStore(key) {
  key = key || null;
  if(key) {
    return _.cloneDeep(dataStore[key]);
  }
  return _.cloneDeep(dataStore);
};
module.exports = {
  updateItemData: updateItemData,
  updateHeroList: updateHeroList,
  updateSkillList: updateSkillList,
  getDataStore: getDataStore
};