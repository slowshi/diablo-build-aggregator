var https = require('https');
var fs = require('fs');
var bfj = require('bfj');

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
  var writeStream = fs.createWriteStream('js/data.json');

  https.get(url, function(res) {
    res.on('data', function(data) {
      var stream = bfj.streamify(data);

      // Get data out of the stream with event handlers
      stream.on('data', function(chunk) {
         /* ... */ 
         writeStream.write(JSON.parse(chunk));
         //console.log(JSON.stringify(JSON.parse(chunk));
        });
      stream.on('end', function() { 
        /* ... */
        //writeStream.end();
      });
      stream.on('dataError', function() { /* ... */});

      // bfj.write("js/data.json", data)
      // .then(function() {

      // })
      // .catch(function(err) {
      //   console.log(err);
      // });
      // fs.writeFile("js/data.json", JSON.stringify(JSON.parse(data)), function(err) {
      //     if(err) {
      //         return console.log(err);
      //     }

      //     console.log("The file was saved!");
      // }); 
    });
  })
  .on('error', function(res) {
    console.log('err', res);
  });
};
var string = "https://us.api.battle.net/d3/profile/Len%231226/?locale=en_US";
var string2 = 'https://us.api.battle.net/data/d3/season/9/leaderboard/rift-monk?namespace=2-1-US';
//getCommunityData(string);
getGameData(string2);

module.exports = {
  init: function() {}
};