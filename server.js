var serverUrl = process.argv[2] || 'localhost';
var accessToken = process.argv[3] || '';
var startup = require('./server/startup.js');
var test = require('./server/diablo-services/data.js');
var apiService = require('./server/diablo-services/api-service.js');
var heroDataService = require('./server/diablo-services/hero-data-service.js');

startup.initialize(serverUrl)
.then(apiService.setAccessToken(accessToken))
.then(function(){
  apiService.loadHeroFromJson({jsonFile:'83475921.json'})
  .then(heroDataService.parseHero)
  .then(function(data){
    console.log(data);
  });
});

