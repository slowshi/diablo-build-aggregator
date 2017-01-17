var _ = require('lodash');
var Promise = require('promise');
var itemDataService = require('./item-data-service.js');
var allHeroes = {};
var allSets = [];
var allItemIds = [];
var allItems = [];
var popularItems = [];
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

var parseHero = function parseHero(data) {
  return new Promise(function (resolve, reject) {
    allHeroes[data.id] = data;
    parseAllItemIds(data);
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
module.exports = {
  getAllHeroes: getAllHeroes,
  getAllItemIds: getAllItemIds,
  getPopularItems: getPopularItems,
  parseHero: parseHero,
  getEndpoint: getEndpoint,
  getJsonPath: getJsonPath,
  getHeroData: getHeroData
};