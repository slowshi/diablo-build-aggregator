define([
  'app',
  'text!item-data/sets.json',
  'text!item-data/hero-sets.json',
  './js/item-icon/index.js',
  './js/item-set/index.js',
  './js/top-items/index.js',
  'socket-service',
],
function(app, sets, heroSets) {
  var json4 = JSON.parse(sets);
  var json5 = JSON.parse(heroSets);
  console.log(json4);
  console.log(json5);
  app.registerController('HomeController', ['$scope', 'cssInjector', 'socketService',
    function($scope, cssInjector, socketService) {
      cssInjector.add('home/index.css');
      cssInjector.add('js/vendors/bootstrap/4.0.0/css/bootstrap.min.css');
      var _this = this;
      _this.testSet = [];
      this.allSets = {};
      _this.loadedItems = {};
      socketService.emit('getPopularGearSets');
      socketService.on('getPopularGearSets',function(data){
        console.log(data);
        var testSet = data[0].set;
        // for(var i = 0; i < data.length; i++) {
        //   var set = data[i].set;
        // }
        socketService.emit('getItems',testSet)
        socketService.on('getItems',function(data){
          _this.testSet = data;
        });
          // var sortable = [];
          // for (var j in data) {
          //   sortable.push({set:j, count: data[j]})
          // }

          // sortable.sort(function(a, b) {
          //     return a.count - b.count
          // }).reverse();
          // console.log(sortable.reverse());
      });
      // this.testSet = 'monkey-kings-garb'
      // socketService.emit('getHeroSets', this.testSet);
      // socketService.on('getHeroSets',function(data){
      //   console.log('getHeroSets',data);
      //    _this.allSets[_this.testSet] = data;
      //    console.log(_this.allSets);
      // });

      socketService.on('connect', function(){
        console.log('connected')
      });
      socketService.on('disconnect', function(){
        console.log("NO")
      });
    }]);
});
