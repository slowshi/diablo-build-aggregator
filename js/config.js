require.config({
  paths: {
    'angular': 'vendors/angular/angular.min',
    'angular-ui-router': 'vendors/angular/angular-ui-router.min',
    'angular-couch-potato': 'vendors/angular/angular-couch-potato',
    'angular-css-injector': 'vendors/angular/angular-css-injector.min',
    'redux': 'vendors/redux/redux.min',
    'lodash': 'vendors/lodash/lodash.min',
    'states': 'states',
    'app': 'app',
    'app-init': 'app-init',
    'text': 'vendors/requirejs-text/2.0.14/text',
    'store-service': 'store-service/index',
    'socket-service': 'socket-service/index',
    'd3tooltips': 'vendors/d3tooltips/d3',
    'preloadjs': 'vendors/createjs/preloadjs/0.6.1/preloadjs-0.6.1.min',
    'soundjs': 'vendors/createjs/soundjs/0.6.1/soundjs-0.6.1.min',
    'numeral': 'vendors/numeral/numeral.min',
    'socket-io': '/socket.io/socket.io',
  },
  shim: {
    'angular': {
      exports: 'angular'
    },
    'app': {
      deps: ['angular']
    },
    'app-init': {
      deps: ['angular', 'app', 'socket-io']
    }
  }
});

require(['app-init'], function(appInit) {
  appInit();
});
