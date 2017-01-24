var _ = require('lodash');
var Promise = require('promise');
var itemDataService = require('./item-data-service.js');
var allHeroes = {};
var allItemIds = [];
var allItems = [];
var popularItems = [];
var allSkills = {};
var getEndpoint = function getEndpoint(ladderData) {
  var player = ladderData.player;
  var endpoint = 'https://us.api.battle.net/d3/profile/'+  
        encodeURIComponent(player.heroBattleTag) + '/hero/' +
          player.heroId + '?locale=en_US';
  return endpoint;
}
var getJsonPath = function getJsonPath(ladderData) { 
  var jsonPath = 'js/player-data/ladder/';
  var player = ladderData.player;

  jsonPath += player.heroId + '.json';

  return jsonPath;
};

var getJsonPathFromId = function getJsonPathFromId(id) {
  var jsonPath = 'js/player-data/ladder/' + id + '.json';
  
  return jsonPath;
};

var parseAllItemIds = function parseAllItemIds(data) {
  for (var i in data.items) {
    var item = data.items[i];
    if(item.id == null) continue;
    if(allItemIds.indexOf(item.id) == -1) {
      allItemIds.push(item.id);
    }
    var hasItem = false;
    for(var k in popularItems) {
      if(popularItems[k].id === item.id) {
        hasItem = true;
        popularItems[k].count++;
      }
    }
    if(!hasItem) {
      var newPopularItem = {
        id: item.id,
        count: 1,
        rank: 0
      };
      popularItems.push(newPopularItem)
    }
  }
  if(data.legendaryPowers !== void 0) {
    for (var j in data.legendaryPowers) {
      var legendaryItem = data.legendaryPowers[j];
      if(legendaryItem == null) continue;
      if(allItemIds.indexOf(legendaryItem) == -1) {
        allItemIds.push(legendaryItem);
      }
      var hasItem = false;
      for(var l in popularItems) {
        if(popularItems[l].id === legendaryItem) {
          hasItem = true;
          popularItems[l].count++;
        }
      }
      if(!hasItem) {
        var newPopularItem = {
          id: legendaryItem,
          count: 1,
          rank: 0
        };
        popularItems.push(newPopularItem)
      }
    }
  }
  
  // for(var k in data.followers) {
  //   var follower = data.followers[k];
  //   for(var p in follower.items) {
  //     var followerItem = follower.items[p];
  //     if(allItemIds.indexOf(followerItem.id) == -1) {
  //       allItemIds.push(followerItem.id);
  //     }
  //   }
  // }
};
var parseAllSkillIds = function parseAllSkillIds(data) {
  var actives = data.skills.active;
  var passives = data.skills.passive;
  var skillObj = {
    skills:[],
    playerSkills: {
      actives:[],
      passives:[]
    }
  };
  if(typeof actives !== 'undefined') {
    for(var i in actives) {
      var active = actives[i];
      var playerSkill = {
        skill:'',
        rune:''
      };
      if(typeof allSkills[active.skill.slug] === 'undefined'){
        active.skill.type = 'active'
        allSkills[active.skill.slug] = active.skill;
        allSkills[active.skill.slug].quickTip = 
          'class/'+ data.class +'/active/' + active.skill.slug;
      }
      if(typeof active.rune !== 'undefined'){
        skillObj.skills.push(active.rune.slug);
        var splitSlug = active.rune.slug.split('-');
        var runeName = splitSlug[splitSlug.length-1];
        playerSkill.rune = runeName;
        if(typeof allSkills[active.rune.slug] === 'undefined'){
          active.rune.type = 'rune'
          allSkills[active.rune.slug] = active.rune;
        }
      }
      skillObj.skills.push(active.skill.slug);
      playerSkill.skill = active.skill.slug;
      skillObj.playerSkills.actives.push(playerSkill);
    }
  }
  if(typeof passives !== 'undefined') {
    for(var j in passives) {
      var passive = passives[j];
      skillObj.skills.push(passive.skill.slug);
      skillObj.playerSkills.passives.push(passive.skill.slug);
      if(typeof allSkills[passive.skill.slug] == 'undefined'){
        passive.skill.type = 'passive';   
        allSkills[passive.skill.slug] = passive.skill;
      }
    }
  }
  return skillObj;
}
var parseGearIds = function parseGearIds(heroData) {
  var gearSet = {};
  for(var itemKey in heroData.items) {
    var item = heroData.items[itemKey];
    gearSet[itemKey] = item.id;
  }
  if(heroData.legendaryPowers !== void 0) {
    for(var i in heroData.legendaryPowers){
      gearSet['legendary' + i] = heroData.legendaryPowers[i];
    }
  }
  return gearSet;
}
var parseHero = function parseHero(data) {
  return new Promise(function (resolve, reject) {
    parseAllItemIds(data);
    var skillsList = parseAllSkillIds(data);
    data.playerSkills = skillsList.playerSkills;
    data.skillList = skillsList.skills;
    var heroGear = parseGearIds(data);
    data.gearList = heroGear;
    allHeroes[data.id] = data;
    resolve();
  });
}


var getHeroData = function getHeroData(heroId) {
  return allHeroes[heroId];
}
var getAllHeroes = function getAllHeroes() {
  return _.cloneDeep(allHeroes);
}

var getAllItemIds = function getAllItemIds() {
  return _.cloneDeep(allItemIds);
}
var getPopularItems = function getPopularItems() {
  return _.cloneDeep(popularItems);
}
var getAllSkills = function getAllSkills() {
  return _.cloneDeep(allSkills);
}
module.exports = {
  getAllHeroes: getAllHeroes,
  getAllItemIds: getAllItemIds,
  getAllSkills: getAllSkills,
  getPopularItems: getPopularItems,
  parseHero: parseHero,
  getEndpoint: getEndpoint,
  getJsonPath: getJsonPath,
  getHeroData: getHeroData
};