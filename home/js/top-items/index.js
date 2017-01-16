define([
  'app',
  'text!/home/js/top-items/index.html',
  '../item-icon/index.js'
],
function(app, html) {

  app.registerDirective('itemIcon', [function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'TopItemsController',
      controllerAs: 'TopItemsCtrl',
      template: function() {
        return html;
      },
      bindToController: {
        slots: '@?',
      }
    };
  }]);

  app.registerController('TopItemsController', ['$scope', 'cssInjector', 
    function($scope, cssInjector) {

    }]);
});
