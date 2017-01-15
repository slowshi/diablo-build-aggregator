var serverUrl = process.argv[2] || 'localhost';
var accessToken = process.argv[3] || '';
var startup = require('./server/startup.js');
var apiService = require('./server/diablo-services/api-service.js');
var parseHeroData = require('./server/diablo-services/scripts/parse-hero-data.js');
var saveHeroData = require('./server/diablo-services/scripts/save-hero-data.js');
// var _ = require('lodash');
// var apiTransform = require('./server/diablo-services/api-transform.js');
// var modelHelper = require('./server/model-helper.js');
// var formatter = modelHelper.getFormatter(apiTransform.getLadder);

startup.initialize(serverUrl)
.then(function() {
  apiService.setAccessToken(accessToken)
  .then(function(){
    saveHeroData.saveHeroData();
  })
})


