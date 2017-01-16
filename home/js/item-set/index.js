define([
  'app',
  'text!/home/js/item-set/index.html',
  '../item-icon/index.js',
  'socket-service',
],
function(app, html) {

  app.registerDirective('itemSet', [function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'ItemSetController',
      controllerAs: 'ItemSetCtrl',
      template: function() {
        return html;
      },
      bindToController: {
        items: '=?',
      }
    };
  }]);

  app.registerController('ItemSetController', ['$scope', 'cssInjector', 'socketService',
    function($scope, cssInjector, socketService) {
      var _this = this;
      _this.parsedData = [];
      console.log(this);
    }]);
});
