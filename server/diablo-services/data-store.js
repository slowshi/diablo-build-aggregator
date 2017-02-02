
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
}
var updateHeroList = function updateHeroList(className, heroData) {

}
var updateSkillList = function updateSkillList(className, skillData) {

}
var getDataStore = function getDataStore(key) {
  key = key || null;
  if(key) {
    return dataStore[key];
  }
  return dataStore;
};
module.exports = {
  updateItemData: updateItemData,
  updateHeroList: updateHeroList,
  getDataStore: getDataStore
};