define([
  'app',
  'text!player-data/ladder.json',
  'text!player-data/endpoints.json'
],
function(app,ladder, endpoints) {
  var json = JSON.parse(ladder);
  var json2 = JSON.parse(endpoints);
  console.log(json);
  console.log(json2);
  app.registerController('HomeController', ['$scope', 'cssInjector', 
    function($scope, cssInjector) {
      cssInjector.add('home/index.css');
      cssInjector.add('js/vendors/bootstrap/4.0.0/css/bootstrap.min.css');
    }]);
});
