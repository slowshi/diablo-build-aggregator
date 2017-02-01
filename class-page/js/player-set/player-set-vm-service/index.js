define([
  'app',
  './index-impl.js',
  'socket-service',
  'store-service'
], function(app, socketServiceImpl) {
  app.registerFactory('playerSetVMService', ['socketService', 'storeService', socketServiceImpl]);
});
