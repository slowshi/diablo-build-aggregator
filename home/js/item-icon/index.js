define([
  'app',
  'text!/home/js/item-icon/index.html',
],
function(app, html) {
  app.registerDirective('itemIcon', [function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'ItemIconController',
      controllerAs: 'ItemIconCtrl',
      template: function() {
        return html;
      },
      bindToController: {
        iconId: '@?',
        size:'@?',
        color:'@?',
        tooltipParams: '@?'
      }
    };
  }]);

  app.registerController('ItemIconController', ['$scope', 'cssInjector', 
    function($scope, cssInjector) {
      this.size = this.size || 'large';
      var stub = 'http://media.blizzard.com/d3/icons/items/'
      this.itemUrl = stub + this.size + '/' + this.iconId + '.png';
      this.preventDefault = function preventDefault($event) {
        $event.preventDefault()
      }
    }]);
});