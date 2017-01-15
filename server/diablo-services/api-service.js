var fs = require('fs');
var Promise = require('promise');
var accessToken = '';
var heroDataService = require('./hero-data-service.js');
var crudService = require('./crud-service.js');
var apiTransform = require('./api-transform.js');
var modelHelper = require('../model-helper.js');
var apiModelService = require('./api-model-service.js');

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


var loadLadderDataFromJson = function loadLadderDataFromJson() {
  return crudService._load('js/player-data/ladder.json');
};

var loadLadderDataFromEndpoint = function loadLadderDataFromEndpoint() {
  var endpoint =  makeEndpointUrl(
    'https://us.api.battle.net/data/d3/season/9/leaderboard/rift-monk?namespace=2-1-US');
    return crudService._get(endpoint)
    .then(function(data){
      var flatData = apiModelService.parseLadderData(data);
      var formatter = modelHelper.getFormatter(apiTransform.getLadder);
      var formatted = formatter(flatData);
      return crudService._save('js/player-data/ladder.json', formatted);
    });
};

var getLadderData = function getLadderData(_refresh) {
  var refresh = _refresh || false;
  if(refresh) {
    return loadLadderDataFromEndpoint();
  } else { 
    return loadLadderDataFromJson();
  }
};

var loadHeroDataFromEndpoint = function loadHeroDataFromEndpoint(heroData) {
    var heroEndpoint = 
      makeEndpointUrl(heroDataService.getEndpoint(heroData), true);
    var heroJsonPath = heroDataService.getJsonPath(heroData);
    var riftData = heroData.data;
   return crudService._delayGet(heroEndpoint)
    .then(function(data) {
      var formatter = modelHelper.getFormatter(apiTransform.getHero);
      var formatted = formatter(data);
      var remodeledData = apiModelService.parseHeroData(formatted);
      if(riftData !== void 0) {
        remodeledData.riftLevel = riftData.heroData;
        remodeledData.riftTime = riftData.riftTime;
      }
      return  crudService._save(heroJsonPath, remodeledData);
    });
}

var loadHeroDataFromJson = function loadHeroDataFromJson(heroData) {
  var heroJsonPath = heroDataService.getJsonPath(heroData);
  return crudService._load(heroJsonPath);
};

var loadItemDataFromJson = function loadItemDataFromJson(itemId) {
  var itemString = 'js/item-data/' + itemId + '.json';
  return crudService._load(itemString);
}

var loadItemDataFromEndpoint = function loadItemDataFromEndpoint(itemId) {
  var endpoint = "https://us.api.battle.net/d3/data/item/" + itemId;
  var itemString = 'js/item-data/' + itemId + '.json';
  var endpointUrl = makeEndpointUrl(endpoint, true);
  return crudService._get(endpointUrl)
  .then(function(data) {
      var formatter = modelHelper.getFormatter(apiTransform.getItem);
      var formatted = formatter(data);
      var remodeledData = apiModelService.parseItemData(formatted);
      return crudService._save(itemString, remodeledData);
  });
}

var getItemData = function getItemData(itemId) {
  var itemString = 'js/item-data/' + itemId + '.json';
  if(fs.existsSync(itemString)){
    return loadItemDataFromJson();
  } else {
    return loadItemDataFromEndpoint(itemId);
  }
};

module.exports = {
  makeEndpointUrl: makeEndpointUrl,
  setAccessToken: setAccessToken,
  getLadderData: getLadderData,
  loadHeroDataFromJson: loadHeroDataFromJson,
  loadHeroDataFromEndpoint: loadHeroDataFromEndpoint,
  getItemData: getItemData
};