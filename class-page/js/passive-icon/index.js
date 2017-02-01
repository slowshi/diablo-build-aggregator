define([
  'app',
  'text!/class-page/js/passive-icon/index.html',
],
function(app, html) {
  (Bnet);
  app.registerDirective('passiveIcon', [function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'PassiveIconController',
      controllerAs: 'PassiveIconCtrl',
      template: function() {
        return html;
      },
      bindToController: {
        passiveData: '=?',
      }
    };
  }]);

  app.registerController('PassiveIconController', ['$scope', 'cssInjector', 
    function($scope, cssInjector) {
      var stub = 'http://media.blizzard.com/d3/icons/skills/42/'
      var tooltipStub = 'http://us.battle.net/d3/en/'
      this.passiveIcon = stub + this.passiveData.icon + '.png';
      this.passiveTooltip = tooltipStub +  this.passiveData.quickTip;
      
      this.preventDefault = function preventDefault($event) {
        $event.preventDefault()
      }
      // 'http://us.battle.net/d3/en/class/monk/active/fists-of-thunder'
      // 'http://media.blizzard.com/d3/icons/passives/64/monk_fistsofthunder.png'
    }]);
});