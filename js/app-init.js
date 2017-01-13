define(['app'], function(app) {
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
          templateUrl: 'home/index.html',
          resolve: {
            deps: couchPotatoProvider
          .resolveDependencies(['home/index.js'])
          },
          controller: 'HomeController as HomeCtrl'
        });
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
