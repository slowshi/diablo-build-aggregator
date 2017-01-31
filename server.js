var serverUrl = process.argv[2] || 'localhost';
var accessToken = process.argv[3] || '';
var startup = require('./server/startup.js');
var apiService = require('./server/diablo-services/api-service.js');
var socketService = require('./server/diablo-services/socket-service.js');
var parseHeroData = require('./server/diablo-services/scripts/parse-hero-data.js');
var parseItemData = require('./server/diablo-services/scripts/parse-item-data.js');
var parseHeroSetData = require('./server/diablo-services/scripts/parse-hero-set-data.js');


apiService.setAccessToken(accessToken)
.then(function(){
  parseItemData.init()
  // .then(parseItemData.init)
  .then(parseHeroData.init)
  .then(parseHeroSetData.init)
  .then(function(){
    startup.initialize(serverUrl)
    .then(function(io){
      socketService.setSocket(io)
    });
  });
});


