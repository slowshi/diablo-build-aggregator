var fs = require('fs');
var Promise = require('promise');
var accessToken = '';
var dataService = require('./data-service.js');
var heroDataService = require('./hero-data-service.js');
var crudService = require('./crud-service.js');
var apiTransform = require('./api-transform.js');
var modelHelper = require('../model-helper.js');
var ladderDataService = require('./ladder-data-service.js');

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
      var flatData = ladderDataService.parseLadderData(data);
      var formatter = modelHelper.getFormatter(apiTransform.getLadder);
      var formatted = formatter(flatData);
      return crudService._save('js/player-data/ladder.json', formatted);
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

var saveHeroData = function setHeroData() {
  return new Promise(function (resolve, reject) {
    getLadderData()
    .then(function(data){
        var x = 0;
        var intervalID = setInterval(function () {
          var heroData = data.row[x];
          var heroEndpoint = 
            makeEndpointUrl(heroDataService.getEndpoint(heroData), true);
          var heroJsonPath = heroDataService.getJsonPath(heroData);
          var heroRiftLevel = heroData.data.riftLevel;
          var heroRiftTime = heroData.data.riftTime;

          crudService._get(heroEndpoint)
          .then(function(data) {
            var formatter = modelHelper.getFormatter(apiTransform.getHero);
            var formatted = formatter(data);
            formatted.riftLevel = heroRiftLevel;
            formatted.riftTime = heroRiftTime;
            crudService._save(heroJsonPath, formatted);
          }) 

          if (++x === data.row.length) {
              clearInterval(intervalID);
              resolve();
          }
        }, 500);
    });
  });
};

var loadHeroDataFromJson = function loadHeroDataFromJson(heroData) {
  var heroJsonPath = heroDataService.getJsonPath(heroData);
  return crudService._load(heroJsonPath);
};

var getHeroItems = function getHeroItems() {
  getLadderData().
  then(function(data){
    var x = 0;
    var intervalID = setInterval(function () {
      loadHeroDataFromJson(data.row[x])
      .then(function(data){
        heroDataService.parseHero(data);
      });
      if (++x === data.row.length) {
        console.log('dodis');
        //console.log(heroDataService.getAllHeroes());
        clearInterval(intervalID);
      }
    },10);
  })
}


module.exports = {
  setAccessToken: setAccessToken,
  getLadderData: getLadderData,
  saveHeroData: saveHeroData,
  getHeroItems: getHeroItems,
  // loadHeroDataFromJson: loadHeroDataFromJson,
};