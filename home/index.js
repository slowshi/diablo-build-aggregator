define([
  'app'
],
function(app) {
  app.registerController('HomeController', ['$scope', 'cssInjector', 
    function($scope, cssInjector) {
      cssInjector.add('home/index.css');
      cssInjector.add('js/vendors/bootstrap/4.0.0/css/bootstrap.min.css');
    }]);
});
