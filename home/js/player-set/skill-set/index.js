define([
  'app',
  'text!/home/js/player-set/skill-set/index.html',
  'text!/home/js/player-set/skill-set/index.css',
  '../../skill-icon/index.js',
  '../../passive-icon/index.js',
],
function(app, html, css) {

  app.registerDirective('skillSet', [function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'SkillSetController',
      controllerAs: 'SkillSetCtrl',
      template: function() {
        return html + '<style>' + css + '</style>';
      },
      bindToController: {
        skillData: '=?',
      }
    };
  }]);

  app.registerController('SkillSetController', ['$scope', 'cssInjector',
    function($scope, cssInjector) {
      this.skills = this.skillData;
    }]);
});
