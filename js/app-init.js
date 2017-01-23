define(['app', 'states'], function(app, states) {
  var appInit = function() {
    var stateProvider;
    var couchPotatoProvider;
    app.config(['$stateProvider', '$couchPotatoProvider',
      '$sceDelegateProvider', '$locationProvider',
      function($stateProvider, $couchPotatoProvider,
		$sceDelegateProvider, $locationProvider) {
        stateProvider = $stateProvider;
        couchPotatoProvider = $couchPotatoProvider;
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        });
        $sceDelegateProvider.resourceUrlWhitelist([
				// Allow same origin resource loads.
          'self',
				// Allow loading from our assets domain.
				// Notice the difference between * and **.
          'https://www.youtube.com/**'
        ]);
      }]);

    app.run(['$couchPotato', '$state', '$stateParams', '$rootScope',
      function($couchPotato, $state, $stateParams, $rootScope) {
        app.lazy = $couchPotato;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        stateProvider.state('home', {
          url:'/{setId}',
          templateUrl: 'home/index.html',
          resolve: {
            deps: couchPotatoProvider
          .resolveDependencies(['home/index.js'])
          },
          controller: 'HomeController as HomeCtrl'
        });
        // $state.go('home');
        // stateProvider.state('root', {
        //   url: '',
        //   views: {
        //     'main@': {
        //       templateUrl: '/home/index.html',
        //       resolve: {
        //         deps: couchPotatoProvider.
        //         resolveDependencies(['/home/index.js']),
        //       },
        //         controller: 'HomeController as HomeCtrl',
        //     },
        //   },
        // });

        // for(var key in states) {
        //   var state = states[key];
        //   stateProvider.state(key, {
        //     url: state.url,
        //     templateUrl: '/' + state.path + '/index.html',
        //     resolve:{
        //       deps: couchPotatoProvider
        //       .resolveDependencies(['/'+ state.path + '/index.js']),
        //     },
        //     controller: state.controller,
        //   });
        // }
        $state.go('home');
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
