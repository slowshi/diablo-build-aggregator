var _ = require('lodash');

var getHeroEndpoints = function getHeroEndpoints(jsonObj, _limit) {
  var limit = _limit || jsonObj.row.length;
  var heroData = [];
  for(var i = 0; i < limit; i++) {
    var playerData = jsonObj.row[i].player[0].data;
    var playerInfo = jsonObj.row[i].data;
    var heroId = 0;
    var battleTag = '';
    var rivtLevel = 0;
    var riftTime = 0;

    for(var j = 0; j < playerData.length; j++) {
      var info = playerData[j];

      if(info.id === "HeroId") {
        heroId = info.number;
      }
    }
    for (var k = 0; k < playerInfo.length; k++) {
      var info = playerInfo[k];
      switch(info.id) {
        case "RiftLevel": 
          riftLevel = info.number;
        break;
        case "RiftTime": 
          riftTime = info.timestamp;
        break;
        case "BattleTag":
          battleTag = info.string;
        break;
      }
    }
    var endpoint = 'https://us.api.battle.net/d3/profile/'+  
      encodeURIComponent(battleTag) + '/hero/'+  heroId + '?locale=en_US';
    var jsonFile = heroId + '.json';
    var playerData = {
      endpoint: endpoint,
      jsonFile: jsonFile,
      riftLevel: riftLevel,
      riftTime: riftTime
    };
    heroData.push(playerData);
  }
  return {
    heroData: heroData
  }
};

var getPopularItems = function() {
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

module.exports = {
  getHeroEndpoints: getHeroEndpoints,
  //getPopularItems: getPopularItems
};