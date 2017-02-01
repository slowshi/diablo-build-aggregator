define([
  'app',
  'text!/class-page/js/skill-icon/index.html',
  'text!/class-page/js/skill-icon/index.css',
],
function(app, html, css) {
  (Bnet);
  app.registerDirective('skillIcon', [function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'SkillIconController',
      controllerAs: 'SkillIconCtrl',
      template: function() {
        return html + '<style>' + css + '</style>';
      },
      bindToController: {
        skillData: '=?',
      }
    };
  }]);

  app.registerController('SkillIconController', ['$scope', 'cssInjector', 
    function($scope, cssInjector) {
      var stub = 'http://media.blizzard.com/d3/icons/skills/42/'
      var tooltipStub = 'http://us.battle.net/d3/en/'
      this.skillIcon = stub + this.skillData.skill.icon + '.png';
      this.skillTooltip = tooltipStub +  this.skillData.skill.quickTip;
      this.skillRune = this.skillData.rune;
      
      this.preventDefault = function preventDefault($event) {
        $event.preventDefault()
      }
      // 'http://us.battle.net/d3/en/class/monk/active/fists-of-thunder'
      // 'http://media.blizzard.com/d3/icons/skills/64/monk_fistsofthunder.png'
    }]);
});