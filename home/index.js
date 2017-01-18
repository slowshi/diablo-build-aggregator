define([
  'app',
  'text!item-data/sets.json',
  './js/item-icon/index.js',
  './js/item-set/index.js',
  './js/top-items/index.js',
  'socket-service',
],
function(app, sets) {
  var json4 = JSON.parse(sets);
  console.log(json4);
  app.registerController('HomeController', ['$scope', 'cssInjector', 'socketService',
  'storeService',
    function($scope, cssInjector, socketService, storeService) {
      cssInjector.add('home/index.css');
      cssInjector.add('js/vendors/bootstrap/4.0.0/css/bootstrap.min.css');
      var _this = this;
      _this.popularItems = {
        items: [],
        averageRiftLevel: 0,
        averageRiftTime: 0
      };
      socketService.on('dataDump',function(data){
        for(var i in data){
          storeService.updateStoreData(i,data[i]);
        }
        var popularGearSets = storeService.getStoreData('popularGearSets');
        var allItems = storeService.getStoreData('allItems');
        console.log(popularGearSets);
        for(var i in popularGearSets) {
          var popularSet = popularGearSets[i];
          console.log(popularSet.slug);
          var setDetails = [];
          var setItems = {
            armor: [],
            jewelery: [],
            weapons: []
          };
          for(var j in popularSet.set) {
            var itemData = allItems[popularSet.set[j]];
            if(itemData.slots !== void 0){
              if(itemData.slots.indexOf('left-hand') > -1 ||
                itemData.slots.indexOf('right-hand') > -1) {
                  setItems.weapons.push(itemData);
              } else if(itemData.slots.indexOf('left-finger') > -1 ||
                itemData.slots.indexOf('right-finger') > -1 ||
                itemData.slots.indexOf('neck') > -1) {
                    setItems.jewelery.push(itemData)
              }
              else{
                setItems.armor.push(itemData);
              }
            }
          }
          // var averageRiftTime = Math.floor(_.sum(popularSet.riftTime)/popularSet.riftTime.length);
          // var averageRiftLevel = Math.floor(_.sum(popularSet.riftLevel)/popularSet.riftLevel.length);
          _this.popularItems.averageRiftTime = popularSet.riftTime;
          _this.popularItems.averageRiftLevel = popularSet.riftLevel;
          _this.popularItems.items.push(setItems);
        }
      })
      socketService.on('connect', function(){
        console.log('connected')
      });
      socketService.on('disconnect', function(){
        console.log("NO")
      });
    }]);
});
