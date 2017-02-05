var _ = require('lodash');
var Promise = require('promise');
var itemDataService = require('./item-data-service.js');
var heroDataService = require('./hero-data-service.js');
var allHeroes = {};
var allSets = [];
var allItems = {};
var heroSets = {};
var allHeroSets = [];
var popularGearSets = [];
var popularSkillSets = [];
var brokenData = 0;

var checkGearValid = function checkGearValid(gearSet) {
  var hasSet = '';
  if(gearSet.length < 15 || gearSet.indexOf(null) > -1) return false;
  for(var i in allSets) {
    var setItems = allSets[i].items;
    var setSlug = allSets[i].slug;
    var setCount = 0;
    for(var j in setItems) {
      if(gearSet.indexOf(setItems[j]) > -1){
        setCount ++;
      }
    }
    if((setSlug === 'legacy-of-nightmares' && setCount == 2) || 
      ((setCount == 3 || setCount == 5) && gearSet.indexOf('P3_Unique_Ring_107') > -1) || 
      (setCount  == 6 || setCount == 4)){
      hasSet = setSlug;
    }
  }
  return hasSet;
}

var getHeroGear = function getHeroGear(heroData) {
  var gearSet = [];
  for(var i in heroData.items) {
    var item = heroData.items[i];
    gearSet.push(item.id)
  }
  if(heroData.legendaryPowers !== void 0) {
    gearSet = gearSet.concat(heroData.legendaryPowers)
  }
  var hasSetSlug = checkGearValid(gearSet);
  var hasSet = false;
  var skillList = [];
  for(var j in allHeroSets) {
    var setCheck = allHeroSets[j];
    if(getSetDifference(setCheck.set, gearSet).length == 0){
      hasSet = true;
      setCheck.heroes.push(heroData.id);
      setCheck.riftLevel.push(heroData.riftLevel);
      setCheck.riftTime.push(heroData.riftTime);
      var hasSkillset = false;
      for(var m in setCheck.skills) {
        var popularSkills = setCheck.skills[m];
        if(getSetDifference(popularSkills.list, heroData.skillList).length == 0){
          popularSkills.heroes.push(heroData.id);
          hasSkillset = true;
        }
      }
      if(!hasSkillset) {
          setCheck.skills.push({
          list: heroData.skillList,
          skillList: heroData.playerSkills,
          heroes: [heroData.id]
        });
      }
    }
  }
  if(!hasSet && hasSetSlug) {
    var newGearSet = {
      slug: hasSetSlug,
      set: gearSet,
      gearList: heroData.gearList,
      skills:[{
        list: heroData.skillList,
        skillList: heroData.playerSkills,
        heroes: [heroData.id]
      }],
      heroes: [heroData.id],
      riftLevel:[heroData.riftLevel],
      riftTime:[heroData.riftTime]
    };
    allHeroSets.push(newGearSet);
  }
};

function findAverages(data) {
  var m  = data.sort(function(a, b){
      return parseInt(a) - parseInt(b);
  });
  var median = 0;
  var middle = Math.floor((m.length - 1) / 2); // NB: operator precedence
  if (m.length % 2) {
      median = m[middle];
  } else {
      median = Math.floor((m[middle] + m[middle + 1]) / 2);
  }
  var average = Math.floor(_.sum(m)/m.length);
  return {
    min: m[0],
    max: m[m.length-1],
    median: median,
    average: average,
  }
}
function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

var parsePopularGearSets = function parsePopularGearSet() {
    var setId = 0;
    for(var j = 0; j < allHeroSets.length; j++) {
      var item = allHeroSets[j];
      item.id = setId;
      item.riftLevel = findAverages(item.riftLevel);
      item.riftTime = findAverages(item.riftTime);
      for (var i in item.riftTime) {
        item.riftTime[i] = millisToMinutesAndSeconds(item.riftTime[i]);
      }
      setId++;
      item.skills = _.sortBy(item.skills,['heroes.length']).reverse();
    }
    allHeroSets = _.sortBy(allHeroSets,['riftLevel.max', 'heroes.length']).reverse();
    var variantDiff = 1;
    var variantCheckSets = _.cloneDeep(allHeroSets);
    var variantsList = {};
    var blacklistedVariants = [];
    for(var j in allHeroSets) {
      var gearSet = allHeroSets[j];
      if(blacklistedVariants.indexOf(gearSet.id) > -1)continue;
      for(var k in variantCheckSets) {
        var variantCheckSet = variantCheckSets[k];
        if(gearSet.id === variantCheckSet.id) continue;
        if(blacklistedVariants.indexOf(variantCheckSet.id) > -1)continue;
        var variantItems = getSetDifference(gearSet.set, variantCheckSet.set);
        if(variantItems.length < 6){
          if(typeof variantsList[gearSet.id] === 'undefined') {
            variantsList[gearSet.id] = [];
          }
          variantsList[gearSet.id].push(variantCheckSet.id);
          blacklistedVariants.push(variantCheckSet.id)
        }
      }
    }
    var allKeys = _.keys(variantsList);
    for(var i in allHeroSets){
      if(allKeys.indexOf(allHeroSets[i].id.toString()) > -1) {
        allHeroSets[i].variants = variantsList[allHeroSets[i].id.toString()];
        popularGearSets.push(allHeroSets[i]);
      }
    }
}
var countSkillRunes = function countSkillRunes() {

}
var countSkillPassives = function countSkillPassives(popularSetSkills) {
  var passives = [];
  var popularPassives = [];
  for(var i in popularSetSkills) { 
    var skillList = popularSetSkills[i].skillList;
    for(var k in skillList.passives) {
        var passiveSkill = skillList.passives[k];
        var passiveIndex = passives.indexOf(passiveSkill);
        if(passiveIndex < 0) {
          var passiveSkillCount = {
            name: passiveSkill,
            count: 0,
          };
          passives.push(passiveSkillCount);
        } else {
          var passiveSkillCount = passives[passiveIndex];
        }
      }
  }
  passives = _.sortBy(passives,['count']).reverse();
  passives.splice(4);
  passives = _.map(passives,'name');

  return passives;
}
var countSkillActives = function countSkillActives(popularSetSkills){
  var spells = [];
  var popularSpells = [];
  var completeActivesList = [];
  for(var i in popularSetSkills) { 
    var skillList = popularSetSkills[i].skillList;
    var activeList = _.map(skillList.actives, 'skill');
    var hasActiveList = false
    for(var w in completeActivesList) {
      if(getSetDifference(activeList, completeActivesList[w].activeList).length === 0) {
        hasActiveList = true
        completeActivesList[w].count++;
      }
    }
    if(!hasActiveList){
      completeActivesList.push({
        activeList: activeList,
        count: 1
      })
    }
    for(var k in skillList.actives) {
        var activeSkill = skillList.actives[k];
        var skillNames = _.map(spells, 'name');
        var skillIndex = skillNames.indexOf(activeSkill.skill);
        if(skillIndex < 0) {
          var spellNameCount = {
            name: activeSkill.skill,
            count: 0,
            runes: []
          };
          spells.push(spellNameCount);
        } else {
          var spellNameCount = spells[skillIndex];
        }
        var runeIndex = spellNameCount.runes.indexOf(activeSkill.rune);
        if(runeIndex < 0) {
          var runeNameCount = {
            name: activeSkill.rune,
            count: 0,
          };
          spellNameCount.runes.push(runeNameCount);
        } else {
          var runeNameCount = spellNameCount.runes[skillIndex];
        }

        spellNameCount.count++;
        runeNameCount.count++;
      }
  }
  var popularSpells = [];
  completeActivesList = _.sortBy(completeActivesList,['count']).reverse();
  for(var i in completeActivesList[0].activeList){
    var spellName = completeActivesList[0].activeList[i];
    for(var j in spells){
      var spell = spells[j];
      if(spellName === spell.name){
        spell.runes = _.sortBy(spell.runes,['count']).reverse();
        var popularActive = {
          skill: spell.name,
          rune: spell.runes[0].name,
          count: spell.count
        }
        popularSpells.push(popularActive);
      }
    }
  }

  return popularSpells;
}
var getSkillSets = function getSkillSets() {
  var popularSkills = {};
  for(var i in popularGearSets) {
    var popularSet = popularGearSets[i];
    var popularSetSkills = popularSet.skills;
    var popularSpellActives = countSkillActives(popularSetSkills);
    var popularSpellPassives = countSkillPassives(popularSetSkills);
    popularSet.popularSkills = {
      actives: popularSpellActives,
      passives: popularSpellPassives
    };
  }
};

var parseHeroSets = function parseHeroSets() {
  var heroesArray = [];
  for(var i in allHeroes) {
    var heroData = allHeroes[i];
    heroesArray.push(heroData);
  } 
  heroesArray = _.sortBy(heroesArray,['riftLevel']).reverse();

  for(var i in heroesArray) {
    var heroData = heroesArray[i];
    getHeroGear(heroData);
  }
}
var bestSets = {};
var getSetDifference = function getSetDifference(set, compare) {
  var setCount = [];
  for(var j in compare) {
    if(set.indexOf(compare[j]) == -1){
      setCount.push(compare[j]);
    }
  }
  return setCount;
}
var groupSets = function groupSets() {
  var groupedPopularSets = {};
  for(var i in popularGearSets){
    var gearSet = popularGearSets[i];
    if(typeof groupedPopularSets[gearSet.slug] === 'undefined'){
      groupedPopularSets[gearSet.slug] = [];
    }
    groupedPopularSets[gearSet.slug].push(gearSet);
  }
 
  popularGearSets = groupedPopularSets;
};
var init = function init(){
  return new Promise(function (resolve, reject) {
    allItems = itemDataService.getAllItems();
    allSets = itemDataService.getAllSets();
    allHeroes = heroDataService.getAllHeroes();
    parseHeroSets();
    parsePopularGearSets();
    getSkillSets();
    groupSets();
    resolve();
  });
};
var getHeroSets = function getHeroSets(slug) {
  if (slug === '') { 
    return _.cloneDeep(heroSets);
  }
  return _.cloneDeep(heroSets[slug]);
}
var getPopularGearSets = function getPopularGearSets() {
  return _.cloneDeep(popularGearSets);
}
module.exports = {
  init: init,
  getHeroSets: getHeroSets,
  getPopularGearSets: getPopularGearSets
};