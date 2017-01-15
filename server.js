var serverUrl = process.argv[2] || 'localhost';
var accessToken = process.argv[3] || '';
var startup = require('./server/startup.js');
var test = require('./server/diablo-services/data.js');
var apiService = require('./server/diablo-services/api-service.js');
var heroDataService = require('./server/diablo-services/hero-data-service.js');

var _ = require('lodash');
var apiTransform = require('./server/diablo-services/api-transform.js');
var modelHelper = require('./server/model-helper.js');
var formatter = modelHelper.getFormatter(apiTransform.getLadder);

startup.initialize(serverUrl)
.then(function() {
  apiService.setAccessToken(accessToken)
  .then(function(){
    apiService.loadAllHeroes()
    .then(function(){
      
    });
    // apiService.saveHeroData()
    // .then(function(data){
    //   console.log(data);
    // })
    // .then(function(data) {

    // });
  })
})


