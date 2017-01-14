var dataService = require('./data-service.js');
var crudService = require('./crud-service.js');
var fs = require('fs');
var Promise = require('promise');
var accessToken = '';

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
      return crudService._save('js/player-data/ladder.json', data);
    });
};

var getLadderData = function getLadderData(_refresh) {
  var refresh = _refresh || false;
  if(refresh) {
    return loadLadderDataFromEndpoint()
  } else { 
    return loadLadderDataFromJson()
  }
};

var loadHeroDataFromJson = function loadHeroData() {
  return crudService._load('js/player-data/endpoints.json');
};

var loadHeroDataFromEndpoint = function loadHeroDataFromEndpoint() {
 return getLadderData(true)
  .then(function(data){
    var saveJson = dataService.getHeroEndpoints(data);
    return crudService._save('js/player-data/endpoints.json', saveJson);
  });
};

var getHeroData = function getHeroData(_refresh) {
  var refresh = _refresh || false;
  if(refresh) {
    return loadHeroDataFromEndpoint()
  } else { 
    return loadHeroDataFromJson()
  }
}
var loadHeroFromJson = function(heroData) {
    var heroFolder = 'js/player-data/ladder/';
    var jsonFile  = heroFolder + heroData.jsonFile;
  return crudService._load(jsonFile);
}
var getHeroItems = function getHeroItems(id) {
  getHeroData().
  then(function(data){
    var heroFolder = 'js/player-data/ladder/';
    var x = 0;
    var heroData = data.heroData;
    var intervalID = setInterval(function () {
      var heroFile = heroFolder + heroData[x].jsonFile;
      getHero(heroData[x]);
      if (++x === 1) {
        clearInterval(intervalID);
      }
    },10);
  })
}


module.exports = {
  setAccessToken: setAccessToken,
  getLadderData: getLadderData,
  getHeroData: getHeroData,
  getHeroItems: getHeroItems,
  loadHeroFromJson: loadHeroFromJson,
};