define([], function() {
  var states = {
    'home': {
      url: 'home/{setId}',
      path: 'home',
      controller: 'HomeController as HomeCtrl'
    }
  };
  return states;
});
