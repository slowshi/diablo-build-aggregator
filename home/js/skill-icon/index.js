define([
  'app',
  'text!/home/js/skill-icon/index.html',
],
function(app, html) {
  console.log(Bnet);
  app.registerDirective('skillIcon', [function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'SkillIconController',
      controllerAs: 'SkillIconCtrl',
      template: function() {
        return html;
      },
      bindToController: {
        skill: '=?',
      }
    };
  }]);

  app.registerController('SkillIconController', ['$scope', 'cssInjector', 
    function($scope, cssInjector) {
      console.log(typeof this.skill)
      var stub = 'http://media.blizzard.com/d3/icons/skills/42/'
      var tooltipStub = 'http://us.battle.net/d3/en/'
      this.skillIcon = stub + this.skill.icon + '.png';
      this.skillTooltip = tooltipStub +  this.skill.quickTip;
      console.log(this.skillTooltip);
      this.skillRune = 'a';
      
      this.preventDefault = function preventDefault($event) {
        $event.preventDefault()
      }
      // 'http://us.battle.net/d3/en/class/monk/active/fists-of-thunder'
      // 'http://media.blizzard.com/d3/icons/skills/64/monk_fistsofthunder.png'
    }]);
});