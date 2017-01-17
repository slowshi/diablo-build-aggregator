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

var getHeroGear = function getHeroGear(heroData) {
  var gearSet = [];
  for(var i in heroData.items) {
    var item = heroData.items[i];
    gearSet.push(item.id)
    
  }
  if(heroData.legendaryPowers !== void 0) {
    gearSet = gearSet.concat(heroData.legendaryPowers)
  }
  if(gearSet.length < 15 || gearSet.indexOf(null) > -1) return;
  var hasSet = false;
  for(var j in popularGearSets) {
    gearSet = gearSet.sort();
    if(_.isEqual(popularGearSets[j].set, gearSet)){
      hasSet = true;
      popularGearSets[j].heroes.push(heroData.id);
      popularGearSets[j].riftLevel.push(heroData.riftLevel);
      popularGearSets[j].riftTime.push(heroData.riftTime);
    }
  }
  if(!hasSet) {
    var newGearSet = {
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
      // item.riftLevel = Math.floor(_.sum(item.riftLevel)/item.riftLevel.length);
      // item.riftTime = Math.floor(_.sum(item.riftTime)/item.riftTime.length);
    }
    var topSets = [];
    popularGearSets = popularGearSets.sort(function(a, b){
      return parseInt(a.riftLevel.max) - parseInt(b.riftLevel.max);
    }).reverse();
    for(var j in popularGearSets) {
      var item = popularGearSets[j];
      for (var i in item.riftTime) {
        item.riftTime[i] = millisToMinutesAndSeconds(item.riftTime[i]);
      }
      if(item.heroes.length >= 20){
        topSets.push(item);
      }
    }
    popularGearSets = topSets;
    console.log(popularGearSets);
}
var parseHeroSets = function parseHeroSets() {
  for(var i in allHeroes) {
    var heroData = allHeroes[i];
    getHeroGear(heroData);
  }
  parsePopularGearSets();
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
var getPopularGearSets = function getPopularGearSets() {
  return _.cloneDeep(popularGearSets);
}
module.exports = {
  init: init,
  getHeroSets: getHeroSets,
  getPopularGearSets: getPopularGearSets
};