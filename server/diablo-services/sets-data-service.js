var _ = require('lodash');
var Promise = require('promise');
var itemDataService = require('./item-data-service.js');
var heroDataService = require('./hero-data-service.js');
var allHeroes = {};
var allSets = [];
var allItemIds = [];
var allItems = {};
var heroSets = {};
var heroGear = [];
var popularGearSets = [];
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
    if((setCount >= 5 && gearSet.indexOf('P3_Unique_Ring_107') > -1) || setCount >= 6 || setSlug === 'legacy-of-nightmares'){
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
  gearSet = gearSet.sort();
  var hasSetSlug = checkGearValid(gearSet);

  var hasSet = false;
  for(var j in popularGearSets) {
    if(_.isEqual(popularGearSets[j].set, gearSet)){
      hasSet = true;
      popularGearSets[j].heroes.push(heroData.id);
      popularGearSets[j].riftLevel.push(heroData.riftLevel);
      popularGearSets[j].riftTime.push(heroData.riftTime);
    }
  }
  if(!hasSet && hasSetSlug) {
    var newGearSet = {
      slug: hasSetSlug,
      set: gearSet,
      heroes: [heroData.id],
      riftLevel:[heroData.riftLevel],
      riftTime:[heroData.riftTime],
    };
    popularGearSets.push(newGearSet)
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
    for(var j in popularGearSets) {
      var item = popularGearSets[j];
      item.riftLevel = findAverages(item.riftLevel);
      item.riftTime = findAverages(item.riftTime);
    }
    var topSets = [];
    popularGearSets = popularGearSets.sort(function(a, b){
      return parseInt(a.riftLevel.max) - parseInt(b.riftLevel.max);
    }).reverse();
    for(var j in popularGearSets) {
      var popularSet = popularGearSets[j];
      for (var i in popularSet.riftTime) {
        popularSet.riftTime[i] = millisToMinutesAndSeconds(item.riftTime[i]);
      }
      if(popularSet.heroes.length >= 20){
        topSets.push(popularSet);
      }
    }
    console.log(popularGearSets.length)
    // popularGearSets = topSets;
}
var parseHeroSets = function parseHeroSets() {
  for(var i in allHeroes) {
    var heroData = allHeroes[i];
    getHeroGear(heroData);
  }
}
var groupSets = function groupSets() {
  var groupedPopularSets = [];
  for(var i in allSets){
    var gearSet = allSets[i];
    
  }
};
var init = function init(){
  return new Promise(function (resolve, reject) {
    allItems = itemDataService.getAllItems();
    allSets = itemDataService.getAllSets();
    allHeroes = heroDataService.getAllHeroes();
    parseHeroSets();
    parsePopularGearSets();
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