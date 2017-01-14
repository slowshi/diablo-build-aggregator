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
      saveHeroData();
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
var countItems = function() {
  var allItems = {
    head: [],
    torso: [],
    feet: [],
    hands: [],
    shoulders: [],
    legs: [],
    bracers: [],
    mainHand: [],
    offHand: [],
    waist: [],
    rightFinger: [],
    leftFinger: [],
    neck: []
  };
  fs.readFile('js/player-data/endpoints.json', function(err, data) {
    var prefix = 'js/player-data/ladder/';
    var playerIds = JSON.parse(data).playerIds;
    var x = 0;
    var intervalID = setInterval(function () {
      var playerFile = prefix + playerIds[x];
      fs.exists(playerFile, function(exists) {
        if (exists) {
          fs.readFile(playerFile, function(err, playerData) {
            var items = JSON.parse(playerData).items;
            for(var i in allItems) {
              var slot = allItems[i];
              var playerSlot = items[i];
              if(playerSlot === void 0) continue;
              var uniqueItem = true;
              for(var j = 0; j < slot.length; j++) {
                if(playerSlot.id == slot[j].item.id) {
                  uniqueItem = false;
                  slot[j].count++;
                }
              }
              if(uniqueItem) {
                var obj = {
                  item: playerSlot,
                  count: 1
                }
                slot.push(obj);
              }
            }
            if (++x === playerIds.length) {
              clearInterval(intervalID);
              fs.writeFile('js/player-data/items.json', JSON.stringify({items: allItems}), 'utf8', function() {
                console.log("Saved popular items");
              }); 
            }
          });
        }
      });
    }, 10);
  });
};
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
//countItems();
module.exports = {
  init: function() {}
};