define([
  'app',
  'lodash',
  'text!/header/index.html',
  'text!/header/index.css'
],
function(app, _, html, css) {
  app.registerDirective('appHeader', [function() {
    return {
      restrict: 'E',
      scope: {},
      controller: 'AppHeaderController',
      controllerAs: 'AppHeaderCtrl',
      template: function() {
        return html + '<style>' + css + '</style>';
      },
      bindToController: {

      }
    };
  }]);
  app.registerController('AppHeaderController', ['$scope', 'cssInjector', 'socketService',
  'storeService', '$stateParams', '$state',
    function($scope, cssInjector, socketService, storeService, $stateParams, $state) {
      this.classList = [
        'rift-monk',
        'rift-wizard',
        'rift-dh',
        'rift-crusader',
        'rift-barbarian',
        'rift-wd'
      ];
      this.selectClass = function selectClass(className) {
        $state.transitionTo('class',{className:className,setId:''});
      };
    }]);
});
