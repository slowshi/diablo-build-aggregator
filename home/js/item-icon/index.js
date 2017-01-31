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
        itemData:"=?",
        size:'@?',
      }
    };
  }]);

  app.registerController('ItemIconController', ['$scope', 'cssInjector', 
    function($scope, cssInjector) {
      this.size = this.size || 'large';
      this.color = this.itemData.displayColor;
      this.tooltipParams = this.itemData.tooltipParams;
      var stub = 'http://media.blizzard.com/d3/icons/items/'
      this.itemUrl = stub + this.size + '/' + this.itemData.icon + '.png';
      this.preventDefault = function preventDefault($event) {
        $event.preventDefault()
      }
    }]);
});