define([
  'angular-couch-potato',
  'angular-ui-router',
  'angular-css-injector'
], function(couchPotato) {
  var app = angular.module('game-server',
    ['ui.router',
      'scs.couch-potato',
      'angular.css.injector']);
  couchPotato.configureApp(app);

  return app;
});
