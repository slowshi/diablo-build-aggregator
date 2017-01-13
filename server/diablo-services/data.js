var https = require('https');
var getCommunityData = function(_endpoint) {
  var apiKey = 'apikey=jjpamv7n88e7ng8knequ4shgkj7mvnrp';
  var endpoint = _endpoint;
  var getter = endpoint.includes("?") ? '&' : '?';
  var url = endpoint + getter + apiKey;
  https.get(url, function(res) {
    res.on('data', function(data) {
      process.stdout.write(data);
    });
  })
  .on('error', function(res) {
    console.log('err', res);
  });
};
var getGameData = function(_endpoint) {
  var apiKey = 'access_token=ht4b9buxafe3zfgq9vvgwy4a';
  var endpoint = _endpoint;
  var getter = endpoint.includes("?") ? '&' : '?';
  var url = endpoint + getter + apiKey;

  https.get(url, function(res) {
    res.on('data', function(data) {
      process.stdout.write(data);
    });
  })
  .on('error', function(res) {
    console.log('err', res);
  });
};
var string = "https://us.api.battle.net/d3/profile/Len%231226/?locale=en_US";
var string2 = 'https://us.api.battle.net/data/d3/season/9?namespace=2-1-US';
getCommunityData(string);
//getGameData(string2);

module.exports = {
  init: function() {}
};