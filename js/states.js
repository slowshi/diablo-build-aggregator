define([], function() {
  var states = {
    'home': {
      url: '/',
      path: 'home',
      controller: 'HomeController as HomeCtrl'
    },
    'class': {
      url: '/class/{className}/{setId}',
      path: 'class-page',
      controller: 'ClassPageController as ClassPageCtrl'
    }
  };
  return states;
});
