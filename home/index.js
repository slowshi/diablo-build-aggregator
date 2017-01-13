define([
  'app',
  'text!data.json'
],
function(app,data) {
  var json = JSON.parse(data);
  console.log(json);
  app.registerController('HomeController', ['$scope', 'cssInjector', 
    function($scope, cssInjector) {
      cssInjector.add('home/index.css');
      cssInjector.add('js/vendors/bootstrap/4.0.0/css/bootstrap.min.css');
    }]);
});
