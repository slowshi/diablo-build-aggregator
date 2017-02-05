define([
  'app',
  'text!item-data/sets.json',
  'lodash',
  'd3tooltips',
  'socket-service',
],
function(app, sets, _, test) {
  app.registerController('HomeController', ['$scope', 'cssInjector', '$stateParams', '$state', 'socketService',
    function($scope, cssInjector, $stateParams, $state, socketService) {
      //$state.transitionTo('class',{setId: 'raiment-of-a-thousand-storms', className:'monk'})
      socketService.emit('getInitialData');
      socketService.on('getInitialData',function(data){
        console.log(data);
      });
    }]);
});
