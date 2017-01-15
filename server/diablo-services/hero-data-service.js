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

var addToAllSets = function addToAllSets(heroSet) {
  var hasSet = false;
  for(var j in allSets) {
    var validSet = allSets[j];
    if(_.isEqual(validSet.sets, heroSet.sets)) {
      validSet.heroIds.push(heroSet.heroId);
      hasSet = true;
    }
  }
  if(!hasSet) {
    allSets.push({
      sets: heroSet.sets,
      heroIds: [heroSet.heroId]
    });
  }
}

var findHeroSets = function getHeroItems(data) {
  var heroSets = [];
  for(var i in data.items) {
    var item = data.items[i];
    if(item.setItemsEquipped !== void 0) {
      var set = item.setItemsEquipped.sort();
      var hasSet = false;
      for(var j in heroSets) {
        if(_.isEqual(heroSets[j], set)) {
          hasSet = true;
        }
      }
      if (!hasSet) { 
        heroSets.push(set);
      }
    }
  }
  var hero = {
    sets: heroSets, 
    heroId: data.id
  };
  return hero;
}

var getLegendaryPowers = function getHeroItems(data) {
  // console.log('getHeroItems',data);
  var gear = {'foo': 'bar'};

  return gear;
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
    // var heroSets = findHeroSets(data);
    // addToAllSets(heroSets);
    parseAllItemIds(data);
    resolve();
  });
}


var getAllHeroes = function getAllHeroes() {
  return _.cloneDeep(allHeroes);
}

var getHeroSets = function getHeroSets() {
  return _.cloneDeep(allSets);
}

var getAllItemIds = function getAllItemIds() {
  return _.cloneDeep(allItemIds);
}
module.exports = {
  getAllHeroes: getAllHeroes,
  getHeroSets: getHeroSets,
  getAllItemIds: getAllItemIds,
  parseHero: parseHero,
  getEndpoint: getEndpoint,
  getJsonPath: getJsonPath,
};