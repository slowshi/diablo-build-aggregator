define([
  'app',
  'text!item-data/sets.json',
  'text!item-data/hero-sets.json',
  'socket-io',
  './js/item-icon/index.js',
  './js/top-items/index.js',
],
function(app, sets, heroSets, io) {
  var json4 = JSON.parse(sets);
  var json5 = JSON.parse(heroSets);
  console.log(json4);
  console.log(json5);
  app.registerController('HomeController', ['$scope', 'cssInjector', 
    function($scope, cssInjector) {
      //this.slots = json3;
      this.sets = json4;
      // var io = socket();
      // console.log(io);
      var userSocket = io.connect('', {reconnect: true});
      userSocket.emit('getHeroData',8475278);
      userSocket.on('getHeroData',function(data){
        console.log('getHeroData', data);
      });

      userSocket.emit('getHeroSets', 'innas-mantra');
      userSocket.on('getHeroSets',function(data){
        console.log('getHeroSets', data);
      });

      userSocket.on('connect', function(){
        console.log('connected')
      });
      userSocket.on('disconnect', function(){
        console.log("NO")
      });
      cssInjector.add('home/index.css');
      cssInjector.add('js/vendors/bootstrap/4.0.0/css/bootstrap.min.css');
    }]);
});
