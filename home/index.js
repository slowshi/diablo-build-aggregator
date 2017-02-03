define([
  'app',
  'text!item-data/sets.json',
  'lodash',
  'd3tooltips',
  'socket-service',
],
function(app, sets, _, test) {
  app.registerController('HomeController', ['$scope', 'cssInjector', '$stateParams', '$state',
    function($scope, cssInjector, $stateParams, $state) {
      $state.transitionTo('class',{setId: 'raiment-of-a-thousand-storms', className:'monk'})
    }]);
});
