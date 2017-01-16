define([
  'app',
  'js/socket-service/index-impl.js',
], function(app, socketServiceImpl) {
  app.registerFactory('socketService', ['$rootScope', socketServiceImpl]);
});
