define([
  'app',
  'text!/home/js/player-set/index.html',
  'text!/home/js/player-set/index.css',
  './player-set-vm-service/index.js',
  './item-set/index.js',
  './skill-set/index.js',
],
function(app, html, css) {

  app.registerDirective('playerSet', [function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'PlayerSetController',
      controllerAs: 'PlayerSetCtrl',
      template: function() {
        return html + '<style>' + css + '</style>';
      },
      bindToController: {
        setData: '=?',
      }
    };
  }]);

  app.registerController('PlayerSetController', ['$scope', 'cssInjector', 'playerSetVMService',
    function($scope, cssInjector, playerSetVMService) {
      console.log(this.setData);
      this.skills = this.setData.popularSkills;
      console.log(this.skills)
      this.items = this.setData.gearList;
      this.legendarySet = [['legendary0', 'legendary1','legendary2']];
    }]);
});
