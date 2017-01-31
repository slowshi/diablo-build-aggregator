define([
  'app',
  'text!/home/js/player-set/item-set/index.html',
  'text!/home/js/player-set/item-set/index.css',
  '../../item-icon/index.js',
  'socket-service',
  '../../item-service/index.js'
],
function(app, html, css) {

  app.registerDirective('itemSet', [function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'ItemSetController',
      controllerAs: 'ItemSetCtrl',
      template: function() {
        return html + '<style>' + css + '</style>';
      },
      bindToController: {
        itemData: '=?',
        rows: '=?'
      }
    };
  }]);

  app.registerController('ItemSetController', ['$scope', 'cssInjector', 'itemService',
    function($scope, cssInjector, itemService) {
      var _this = this;
      this.rows = this.rows || 
        [
          ['shoulders', 'head', 'neck'],
          ['hands', 'torso', 'bracers'],
          ['leftFinger', 'waist', 'rightFinger'],
          ['mainHand', 'legs', 'offHand'],
          ['feet'],
          //['legendary0', 'legendary1','legendary2']
        ];
    }]);
});
