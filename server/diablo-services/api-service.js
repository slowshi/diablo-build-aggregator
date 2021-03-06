var fs = require('fs');
var Promise = require('promise');
var accessToken = '';
var heroDataService = require('./hero-data-service.js');
var crudService = require('./crud-service.js');
var apiTransform = require('./api-transform.js');
var modelHelper = require('../model-helper.js');
var apiModelService = require('./api-model-service.js');
var _ = require('lodash');

var makeEndpointUrl = function makeEndpointUrl(_endpoint, _useApiKey) {
  var endpoint = _endpoint;
  var useApiKey = _useApiKey || false;
  var apiKey = 'apikey=jjpamv7n88e7ng8knequ4shgkj7mvnrp';
  var authGet = useApiKey ? apiKey : accessToken;
  var getter = endpoint.includes("?") ? '&' : '?';
  var url = endpoint + getter + authGet;
  return url;
};

var setAccessToken = function setAccessToken(token) {
  return new Promise(function (resolve, reject) {
    if (token === '') {
      crudService._load('server/access_token.json')
      .then(function(data) {
        accessToken = data.access_token;
        resolve();
      })
    } else {
      accessToken = 'access_token=' + token;
      var tokenOBj = {
        access_token: accessToken
      };
      crudService._save('server/access_token.json', tokenOBj)
      .then(function(){
        resolve();
      });
    }
  });
};


var loadLadderDataFromEndpoint = function loadLadderDataFromEndpoint(_className, region) {
    var endpointString = 'https://' + region + 
    '.api.battle.net/data/d3/season/10/leaderboard/' + _className;
    var endpointUrl = makeEndpointUrl(endpointString);
    return crudService._delayGet(endpointUrl)
    .then(function(data){
      var flatData = apiModelService.parseLadderData(data);
      var formatter = modelHelper.getFormatter(apiTransform.getLadder);
      var formatted = formatter(flatData);
      return crudService._save('js/player-data/' + _className + '/' + data.region + '/ladder.json', formatted);
    });
};
var loadLadderDataFromJson = function loadLadderDataFromJson(_className, region) {
  return crudService._load('js/player-data/'+_className+'/' + region + '/ladder.json');
};

var getLadderData = function getLadderData(_className, _region, _refresh) {
  var region = _region || 'us';
  var refresh = _refresh || false;
  var dir = 'js/player-data/'+_className;
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  if (!fs.existsSync(dir + '/' + region)){
    fs.mkdirSync(dir + '/' + region)
  }
  if(refresh) {
    return loadLadderDataFromEndpoint(_className, region);
  } else { 
    return loadLadderDataFromJson(_className, region);
  }
};

var loadHeroDataFromEndpoint = function loadHeroDataFromEndpoint(heroData, className) {
    var heroEndpoint = 
      makeEndpointUrl(heroDataService.getEndpoint(heroData), true);
    var heroJsonPath = heroDataService.getJsonPath(heroData, className);
    var riftData = heroData.data;
   return crudService._delayGet(heroEndpoint)
    .then(function(data) {
      var formatter = modelHelper.getFormatter(apiTransform.getHero);
      var formatted = formatter(data);
      var remodeledData = apiModelService.parseHeroData(formatted);
      if(riftData !== void 0) {
        remodeledData.riftLevel = riftData.riftLevel;
        remodeledData.riftTime = riftData.riftTime;
      }
      if(remodeledData.id === void 0) {
        remodeledData.id = heroData.player.heroId;
      }
      return  crudService._save(heroJsonPath, remodeledData);
    });
};

var loadHeroDataFromJson = function loadHeroDataFromJson(heroData, className) {
  var heroJsonPath = heroDataService.getJsonPath(heroData, className);
  if(fs.existsSync(heroJsonPath)){
    return crudService._load(heroJsonPath);
  } else {
    return loadHeroDataFromEndpoint(heroData, className);
  }
};

var getHeroData = function getHeroData(heroData, className, _refresh) {
  var refresh = _refresh || false;
  if(refresh) {
    return loadHeroDataFromEndpoint(heroData, className);
  } else { 
    return loadHeroDataFromJson(heroData, className);
  }
};

var loadItemDataFromJson = function loadItemDataFromJson(itemString) {
  return crudService._load(itemString);
};

var loadItemDataFromEndpoint = function loadItemDataFromEndpoint(itemId) {
  var endpoint = "https://us.api.battle.net/d3/data/item/" + itemId;
  var itemString = 'js/item-data/items/' + itemId + '.json';
  var endpointUrl = makeEndpointUrl(endpoint, true);
  return crudService._delayGet(endpointUrl)
  .then(function(data) {
      var formatter = modelHelper.getFormatter(apiTransform.getItem);
      var formatted = formatter(data);
      var remodeledData = apiModelService.parseItemData(formatted);
      return crudService._save(itemString, remodeledData);
  });
};

var getItemData = function getItemData(itemId) {
  var itemString = 'js/item-data/items/' + itemId + '.json';
  if(fs.existsSync(itemString)){
    return loadItemDataFromJson(itemString);
  } else {
    return loadItemDataFromEndpoint(itemId);
  }
};

var omitInvalidHeroes = function omitInvalidHeroes(className, ladderData, invalidHeroes) {
  return new Promise(function (resolve, reject) {
    if(invalidHeroes.length === 0) {
      resolve(ladderData);
      return;
    }
    var region = ladderData.region;
    var heroIds = _.map(invalidHeroes, 'id');
    console.log("Removing invalid heroes:",heroIds);
    var updateLadderJson = function () {
      return crudService._save('js/player-data/' + className + '/' + region + '/ladder.json', ladderData);
    };
    var i = ladderData.row.length;
    while(i--) {
      if(heroIds.indexOf(ladderData.row[i].player.heroId) > -1){
        ladderData.row.splice(i,1)
      }
    }
    _.reduce(heroIds,function(curr, next){
      return curr.then(function(){
        var path = 'js/player-data/' + className + '/' + region + '/' + next + '.json';
        return crudService._deleteFile(path);
      })
    }, Promise.resolve())
    .then(updateLadderJson)
    .then(function(updatedLadderData) {
        resolve(updatedLadderData);
    });
  });
};

// var updateAllItemIds = function updateAllItemIds(itemIds) {
//   return new Promise(function (resolve, reject) {
//     var itemIdsString = 'js/item-data/itemids.json';
//     if(fs.existsSync(itemIdsString)){
//       return loadItemDataFromJson(itemIdsString)
//       .then(function(allItemIds){
//         var differentIds = _.difference(itemIds, allItemIds);
//         if(differentIds.length === 0) {
//           resolve();
//           return;
//         }else {
//           var combinedArrays = _.union(differentIds, allItemIds);
//           return crudService._save(itemIdsString, combinedArrays)
//           .then(function(){
//             resolve();
//           })
//         }
//       });
//     } else {
//         return crudService._save(itemIdsString, itemIds)
//         .then(function(){
//           resolve();
//         })
//     }
//   });
// };

var updateItemSetTypes = function updateItemSetTypes(itemSets) {
  return new Promise(function (resolve, reject) {
    var itemSetsString = 'js/item-data/sets.json';
    if(fs.existsSync(itemSetsString)){
      return loadItemDataFromJson(itemSetsString)
      .then(function(allSets){
        var mappedItemSets = _.map(itemSets,'slug');
        var mappedAllSets = _.map(allSets,'slug');
        var inter = _.intersection(mappedItemSets,mappedAllSets);
        if(_.isEqual(mappedItemSets, inter)){
          resolve();
          return;
        }
        var combinedArrays = _.union(itemSets, allSets);
        var uniqueSetTypes = _.uniqWith(combinedArrays, _.isEqual)
        return crudService._save(itemSetsString, uniqueSetTypes)
        .then(function(){
          resolve();
        })
      });
    } else {
        return crudService._save(itemSetsString, itemSets)
        .then(function(){
          resolve();
        })
    }
  });
};
var updateHeroSkills = function updateHeroSkills(className, heroSkills) {
  return new Promise(function (resolve, reject) {
    var heroSkillsString = 'js/player-data/' + className + '/skills.json';
    if(fs.existsSync(heroSkillsString)){
      return loadItemDataFromJson(heroSkillsString)
      .then(function(allSkills){
        var heroSkillKeys = _.keys(heroSkills);
        var alreadyHasSkills = _.every(heroSkillKeys, _.partial(_.has, allSkills));
        if(alreadyHasSkills){
          resolve();
          return;
        }
        var combinedSkills = _.merge(heroSkills, allSkills);
        return crudService._save(heroSkillsString, combinedSkills)
        .then(function(){
          resolve();
        })
      });
    } else {
        return crudService._save(heroSkillsString, heroSkills)
        .then(function(){
          resolve();
        })
    }
  });
}
module.exports = {
  makeEndpointUrl: makeEndpointUrl,
  setAccessToken: setAccessToken,
  getLadderData: getLadderData,
  getHeroData: getHeroData,
  getItemData: getItemData,
  omitInvalidHeroes: omitInvalidHeroes,
  // updateAllItemIds: updateAllItemIds,
  updateItemSetTypes: updateItemSetTypes,
  updateHeroSkills: updateHeroSkills,
};