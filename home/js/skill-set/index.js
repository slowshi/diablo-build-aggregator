define([
  'app',
  'text!/home/js/skill-set/index.html',
  '../skill-icon/index.js',
],
function(app, html) {

  app.registerDirective('skillSet', [function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'SkillSetController',
      controllerAs: 'SkillSetCtrl',
      template: function() {
        return html;
      },
      bindToController: {
        skills: '=?',
      }
    };
  }]);

  app.registerController('SkillSetController', ['$scope', 'cssInjector',
    function($scope, cssInjector) {
      var _this = this;
      (_this.skills);
      _this.parsedData = [];
    }]);
});