define(['app', 'states'], function(app, states) {
  var appInit = function() {
    var stateProvider;
    var couchPotatoProvider;
    app.config(['$stateProvider', '$couchPotatoProvider',
      '$sceDelegateProvider', '$locationProvider', '$urlRouterProvider',
      function($stateProvider, $couchPotatoProvider,
		$sceDelegateProvider, $locationProvider, $urlRouterProvider) {
        stateProvider = $stateProvider;
        couchPotatoProvider = $couchPotatoProvider;
        $locationProvider.html5Mode({
          enabled: true,
        });
        $sceDelegateProvider.resourceUrlWhitelist([
				// Allow same origin resource loads.
          'self',
				// Allow loading from our assets domain.
				// Notice the difference between * and **.
          'https://www.youtube.com/**'
        ]);
        $urlRouterProvider.when('', 'root');

      }]);

    app.run(['$couchPotato', '$state', '$stateParams', '$rootScope',
      function($couchPotato, $state, $stateParams, $rootScope) {
        app.lazy = $couchPotato;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        // stateProvider.state('header', {
        //   templateUrl: 'header/index.html',
        //   resolve: {
        //     deps: couchPotatoProvider
        //   .resolveDependencies(['header/index.js'])
        //   },
        //   controller: 'HeaderController as HeaderCtrl'
        // });
        // $state.go('home');
        // stateProvider.state('header', {
        //   views: {
        //     'header': {
        //       templateUrl: '/header/index.html',
        //       resolve: {
        //         deps: couchPotatoProvider.
        //         resolveDependencies(['/header/index.js']),
        //       },
        //         controller: 'HeaderController as HeaderCtrl',
        //     },
        //   },
        // });
        stateProvider.state('root', {
          abstract: true,
          views: {
            'header@':{
              templateUrl: 'header/index.html',
              controller: "HeaderController as HeaderCtrl",
              resolve: {
                loadStateCtrl: couchPotatoProvider
                .resolveDependencies('header/index.js')
              }
            }
          }
        });
        // for (var key in states) {
        //   if (states.hasOwnProperty(key)) {
        //     var state = states[key];
        //     var dependencies = [state.path + '/index.js'];
        //     stateProvider.state(key, {
        //       parent: 'root',
        //       url: state.url,
        //       path: state.path,
        //       views: {
        //         'main@': {
        //           templateUrl: state.path + '/index.html',
        //           controller: state.controller,
        //           resolve: {
        //             loadStateCtrl: couchPotatoProvider
        //             .resolveDependencies(dependencies)
        //           }
        //         }
        //       }
        //     });
        //   }
        // }
        for(var key in states) {
          var state = states[key];
          stateProvider.state(key, {
            url: state.url,
            templateUrl: state.path + '/index.html',
            resolve:{
              deps: couchPotatoProvider
              .resolveDependencies([state.path + '/index.js']),
            },
            controller: state.controller,
          });
        }
        console.log($state.current)
      }]);
    var bootstrapApplication = (function() {
      angular.element(document)
				.ready(function() {
  angular.bootstrap(document, [app.name, function() {
    angular.element(document)
							.find('html')
							.addClass('ng-app');
  }]);
});
    });
    bootstrapApplication();
  };
  return appInit;
});
