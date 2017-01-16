var _ = require('lodash');
var Promise = require('promise');
var itemDataService = require('./item-data-service.js');
var allHeroes = {};
var allSets = [];
var allItemIds = [];
var allItems = [];

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
    if(allItemIds.indexOf(item.id) == -1 && item.id != null) {
      allItemIds.push(item.id);
    }
  }
  for (var j in data.legendaryPowers) {
    var legendaryItem = data.legendaryPowers[j];
    if(allItemIds.indexOf(legendaryItem) == -1 && legendaryItem != null) {
      allItemIds.push(legendaryItem);
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


var getAllHeroes = function getAllHeroes() {
  return _.cloneDeep(allHeroes);
}

var getAllItemIds = function getAllItemIds() {
  return _.cloneDeep(allItemIds);
}
var getHeroData = function getHeroData(heroId) {
  return allHeroes[heroId];
}
module.exports = {
  getAllHeroes: getAllHeroes,
  getAllItemIds: getAllItemIds,
  parseHero: parseHero,
  getEndpoint: getEndpoint,
  getJsonPath: getJsonPath,
  getHeroData: getHeroData
};