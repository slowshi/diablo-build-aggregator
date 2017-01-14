var https = require('http');
var fs = require('fs');
var bfj = require('bfj');
var request = require('request');
var Promise = require('promise');
var apiKey = 'apikey=jjpamv7n88e7ng8knequ4shgkj7mvnrp';

var getGameData = function getGameData(_endpoint, _apiKey) {
  return new Promise(function (fulfill, reject){
    var apiKey = _apiKey || 'access_token=ht4b9buxafe3zfgq9vvgwy4a';
    var endpoint = _endpoint;
    var getter = endpoint.includes("?") ? '&' : '?';
    var url = endpoint + getter + apiKey;
    console.log('doURL', url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        fulfill(body);
      }else {
        reject(error);
      }
    });
  });
};

var saveLadderData = function saveLadderData(_endpoint) {
  getGameData(_endpoint)
  .then(function(data) {
    fs.writeFile('js/player-data/ladder.json', data, 'utf8', function() {
      console.log("Done saving ladder data.");
      saveLadderGets();
    }); 
  });
};

var saveLadderGets = function saveLadderGets() {
  fs.readFile('js/player-data/ladder.json', function(err, data) {
    if (err) throw err;
    var jsonObj = JSON.parse(data);
    var saveJSON = getPlayerEndpoint(jsonObj);
    fs.writeFile('js/player-data/endpoints.json', JSON.stringify(saveJSON), 'utf8', function() {
      console.log("Done saving player gets.");
      //saveHeroData();
    }); 
  });
};

var getPlayerEndpoint = function getPlayerEndpoint(jsonObj, _limit) {
  var limit = _limit || jsonObj.row.length;
  var allPlayers = [];
  var playerIds = [];
  for(var i = 0; i < limit; i++) {
    var playerData = jsonObj.row[i].player[0].data;
    var playerId = 0;
    var playerBattleTag = '';
    for(var j = 0; j < playerData.length; j++) {
      var playerInfo = playerData[j];
      switch(playerInfo.id) {
        case "HeroId": 
          playerId = playerInfo.number;
        break;
        case "HeroBattleTag":
          playerBattleTag =playerInfo.string;
        break;
      }
    }
    var endpoint = 'https://us.api.battle.net/d3/profile/'+  encodeURIComponent(playerBattleTag) +
      '/hero/'+  playerId + '?locale=en_US';
    allPlayers.push(endpoint);
    playerIds.push(playerId + '.json');
  }
  return {
    allPlayer: allPlayers,
    playerIds: playerIds,
  };
};

var saveHeroData = function() {
  fs.readFile('js/player-data/endpoints.json', function(err, data) {
    if (err) throw err;
    var jsonObj = JSON.parse(data);
    var x = 0;
    var intervalID = setInterval(function () {
      getGameData(jsonObj.playerArray[x], apiKey)
      .then(function(items){
        var itemsObj = JSON.parse(items);
        var fileName = itemsObj.id + '.json';
        fs.writeFile('js/player-data/ladder/' + fileName, JSON.stringify(itemsObj), 'utf8', function() {
          console.log("Saved ladder hero: "+ fileName);
        }); 
      });

      if (++x === jsonObj.playerArray.length) {
          clearInterval(intervalID);
      }
    }, 500);
  });
}

var string = "https://us.api.battle.net/d3/profile/Len%231226/?locale=en_US";
var player = "https://us.api.battle.net/d3/profile/Unlighten%231225/hero/83569075?locale=en_US"
var string2 = 'https://us.api.battle.net/data/d3/season/9/leaderboard/rift-monk?namespace=2-1-US';
// getCommunityData(player);
//requestTest(string2);
//getGameData(string2);
//saveLadderData(string2);
//getPlayersItems();
//saveLadderGets();
// walkJson();
module.exports = {
  init: function() {}
};