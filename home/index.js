define([
  'app',
  'text!player-data/ladder.json',
  'text!player-data/endpoints.json',
  'text!player-data/items.json',
  './js/item-icon/index.js'
],
function(app,ladder, endpoints, items) {
  var json = JSON.parse(ladder);
  var json2 = JSON.parse(endpoints);
  var json3 = JSON.parse(items);
  console.log(json);
  console.log(json2);
  console.log(json3);
  app.registerController('HomeController', ['$scope', 'cssInjector', 
    function($scope, cssInjector) {
      this.slots = {};
      this.slots.items = json3;
      cssInjector.add('home/index.css');
      cssInjector.add('js/vendors/bootstrap/4.0.0/css/bootstrap.min.css');
    }]);
});
