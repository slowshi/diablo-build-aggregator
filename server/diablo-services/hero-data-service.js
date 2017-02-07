var _ = require('lodash');
var Promise = require('promise');
var dataStore = require('./data-store.js');

var getEndpoint = function getEndpoint(ladderData) {
  var player = ladderData.player;
  var region = player.region;
  var endpoint = 'https://' + region + '.api.battle.net/d3/profile/'+  
        encodeURIComponent(player.heroBattleTag) + '/hero/' + player.heroId;
  return endpoint;
};

var getJsonPath = function getJsonPath(ladderData, className) { 
  var jsonPath = 'js/player-data/';
  var player = ladderData.player;
  jsonPath += className + '/';
  jsonPath += player.region + '/';
  jsonPath += player.heroId + '.json';

  return jsonPath;
};

var parseAllItemIds = function parseAllItemIds(heroData) {
  for (var i in heroData.items) {
    var item = heroData.items[i];
    if(item.id == null) continue;
    dataStore.updateItemList(item.id);
  }
  if(heroData.legendaryPowers !== void 0) {
    for (var j in heroData.legendaryPowers) {
      var legendaryItem = heroData.legendaryPowers[j];
      if(legendaryItem == null) continue;
      dataStore.updateItemList(legendaryItem);
    }
  }
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
  var dataSkills = dataStore.getDataStore('allSkills');
  if(typeof actives !== 'undefined') {
    for(var i in actives) {
      var active = actives[i];
      if(typeof active.skill !== 'undefined') {
        var playerSkill = {
          skill:'',
          rune:''
        };
        skillObj.skills.push(active.skill.slug);
        if(typeof dataSkills[active.skill.slug] === 'undefined'){
          active.skill.type = 'active'
          active.skill.quickTip = 
            'class/'+ data.class +'/active/' + active.skill.slug;
          dataStore.updateSkillList(active.skill);
        }
        if(typeof active.rune !== 'undefined'){
          skillObj.skills.push(active.rune.slug);
          var splitSlug = active.rune.slug.split('-');
          var runeName = splitSlug[splitSlug.length-1];
          playerSkill.rune = runeName;
          if(typeof dataSkills[active.rune.slug] === 'undefined'){
            active.rune.type = 'rune'
            dataStore.updateSkillList(active.rune);
          }
        }
        playerSkill.skill = active.skill.slug;
        skillObj.playerSkills.actives.push(playerSkill);
      }
    }
  }
  if(typeof passives !== 'undefined') {
    for(var j in passives) {
      var passive = passives[j];
      if(typeof passive.skill !== 'undefined'){
        skillObj.skills.push(passive.skill.slug);
        skillObj.playerSkills.passives.push(passive.skill.slug);
        if(typeof dataSkills[passive.skill.slug] == 'undefined'){
          passive.skill.type = 'passive';
          passive.skill.quickTip = 
            'class/'+ data.class +'/passive/' + passive.skill.slug;   
          dataStore.updateSkillList(passive.skill);
        }
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

var validateFullSet = function validateFullSet(heroData) {
  var fullSet = true;
  var gearListCount = _.values(heroData.gearList).length;
  var skillListCount = heroData.skillList.length;
  var itemSlots = ['head', 'torso', 'feet', 'hands', 'shoulders', 
  'legs', 'bracers', 'mainHand', 'waist', 'rightFinger', 'leftFinger', 
  'neck', 'legendary0', 'legendary1', 'legendary2'];
  var allSlotsFilled = true;
  for(var i in itemSlots) {
    var slot = itemSlots[i];
    if(heroData.gearList[slot] === void 0) {
      allSlotsFilled = false;
    }
  }
  if (!allSlotsFilled || skillListCount < 16) {
    fullSet = false;
  }

  return fullSet;
}

var parseHero = function parseHero(data) {
  return new Promise(function (resolve, reject) {
    if (data.class !== void 0) {
      parseAllItemIds(data);
      var skillsList = parseAllSkillIds(data);
      data.playerSkills = skillsList.playerSkills;
      data.skillList = skillsList.skills;
      var heroGear = parseGearIds(data);
      data.gearList = heroGear;
      if(!validateFullSet(data)){
        resolve(data);      
      }else{
        dataStore.updateHeroList(data);
        resolve(0);
      }
    } else {
      resolve(data);
    }
  });
}

module.exports = {
  parseHero: parseHero,
  getEndpoint: getEndpoint,
  getJsonPath: getJsonPath,
};