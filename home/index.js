define([
  'app',
  'text!item-data/sets.json',
  './js/item-icon/index.js',
  './js/item-set/index.js',
  './js/top-items/index.js',
  'socket-service',
],
function(app, sets) {
  app.registerController('HomeController', ['$scope', 'cssInjector', 'socketService',
  'storeService',
    function($scope, cssInjector, socketService, storeService) {
      cssInjector.add('home/index.css');
      cssInjector.add('js/vendors/bootstrap/4.0.0/css/bootstrap.min.css');
      var _this = this;
      _this.popularItems = {
        items: [],
        averageRiftLevel: 0,
        averageRiftTime: 0,
        skills: [],
      };
      socketService.on('dataDump',function(data){
        for(var i in data){
          storeService.updateStoreData(i,data[i]);
        }
        var popularGearSets = storeService.getStoreData('popularGearSets');
        var setByName = popularGearSets['monkey-kings-garb'];
        var allItems = storeService.getStoreData('allItems');

        for(var i in setByName) {
          var popularSet = setByName[i];
          console.log(popularSet);
          if(popularSet.slug !== 'monkey-kings-garb') continue;
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
          _this.popularItems.averageRiftTime = popularSet.riftTime;
          _this.popularItems.skills.push(popularSet.skills);
          _this.popularItems.items.push(setItems);
        }
        console.log(popularGearSets);
      })
      this.allSets = JSON.parse(sets);
      socketService.on('connect', function(){
        console.log('connected')
      });
      socketService.on('disconnect', function(){
        console.log("NO")
      });
    }]);
});
