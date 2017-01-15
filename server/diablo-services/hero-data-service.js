var _ = require('lodash');
var Promise = require('promise');
var allHeroes = {};
var allSets = [];
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
var addToAllSets = function addToAllSets(sets) {
  for(var i in sets) {
    var setName = sets[i];
    var hasSet = false;
    for(var j in allSets) {
      var allSet = allSets[j];
      if(allSet.id == setName) {
        allSet.count++;
      }
    }
    if(!hasSet) {
      allSets.push({
        id: setName,
        count: 1
      })
    }
  }
  var test = [1,2,3];
  var test2 = [1,2,3];
  console.log(_.isEqual(test,test2))
  //console.log(allSets)
}

var findHeroSets = function getHeroItems(data) {
  // console.log('getHeroItems',data);
  var heroSets = [];
  for(var i in data.items) {
    var item = data.items[i];
    if(item.setItemsEquipped !== void 0) {
      var setString = item.setItemsEquipped.toString();
      if (heroSets.indexOf(setString) === -1) {
        heroSets.push(setString)
      }
    }
  }
  addToAllSets(heroSets);
  return heroSets;
}
var getLegendaryPowers = function getHeroItems(data) {
  // console.log('getHeroItems',data);
  var gear = {'foo': 'bar'};

  return gear;
}
var parseHero = function parseHero(data) {
  allHeroes[data.id] = data;
  findHeroSets(data);
}

var getAllHeroes = function getAllHeroes() {
  return _.cloneDeep(allHeroes);
}

var getHeroSets = function getHeroSets() {
  return _.cloneDeep(allSets);
}

module.exports = {
  getAllHeroes: getAllHeroes,
  getHeroSets: getHeroSets,
  parseHero: parseHero,
  getEndpoint: getEndpoint,
  getJsonPath: getJsonPath
};