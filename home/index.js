define([
  'app',
  'text!item-data/sets.json',
  'lodash',
  'd3tooltips',
  './js/item-icon/index.js',
  './js/item-set/index.js',
  './js/top-items/index.js',
  './js/skill-icon/index.js',
  './js/skill-set/index.js',
  'socket-service',
],
function(app, sets, _, test) {
  ("BNET",Bnet);
  ("WINDOWBNET", window.Bnet);
  app.registerController('HomeController', ['$scope', 'cssInjector', 'socketService',
  'storeService', '$stateParams', '$state',
    function($scope, cssInjector, socketService, storeService, $stateParams, $state) {
      cssInjector.add('js/vendors/bootstrap/4.0.0/css/bootstrap.min.css');
      cssInjector.add('home/index.css');
      var _this = this;
      var popularGearSets;
      var allItems;
      var allSkills
      _this.popularItems = [];
      _this.currentSet = 'raiment-of-a-thousand-storms';
      _this.selectSet = function(selectedSet) {
        $state.go('.', {setId: selectedSet});
      }
      _this.updateGearSets = function updateGearSets() {
        if(_.isEmpty(popularGearSets)) return;
        var setByName = popularGearSets[_this.currentSet];
        _this.popularItems = [];

        for(var i in setByName) {
          var popularSet = setByName[i];
          var setDetails = [];
          var setSkills = [];
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
          for(var k in popularSet.skills[0].list) {
            var skillData = allSkills[popularSet.skills[0].list[k]];
            setSkills.push(skillData);
          }
          // var averageRiftTime = Math.floor(_.sum(popularSet.riftTime)/popularSet.riftTime.length);
          // var averageRiftLevel = Math.floor(_.sum(popularSet.riftLevel)/popularSet.riftLevel.length);
          // _this.popularItems.averageRiftTime = popularSet.riftTime;
          // _this.popularItems.averageRiftTime = popularSet.riftTime;
          var setObj = {
            skills: setSkills,
            items: setItems,
          }
          _this.popularItems.push(setObj);
        }
          (_this.popularItems);
      }
      socketService.emit('getInitialData');
      socketService.on('getInitialData',function(data){
        (data);
        for(var i in data){
          storeService.updateStoreData(i,data[i]);
        }
        popularGearSets = storeService.getStoreData('popularGearSets');
        allItems = storeService.getStoreData('allItems');
        allSkills = storeService.getStoreData('allSkills');
        (allSkills);
        _this.currentSet = $stateParams.setId || 'raiment-of-a-thousand-storms';
        _this.updateGearSets();
      })
      _this.updateGearSets();
      this.allSets = JSON.parse(sets);
      socketService.on('connect', function(){
        ('connected')
      });
      socketService.on('disconnect', function(){
        ("NO")
      });
    }]);
});
