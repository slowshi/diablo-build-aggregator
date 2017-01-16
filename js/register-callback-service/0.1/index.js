define([
  'app',
  'js/register-callback-service/0.1/index-impl.js'
],
function(app, registerCallbackServiceImpl) {
  'use strict';

  app.registerFactory('registerCallbackService', registerCallbackServiceImpl);
});
