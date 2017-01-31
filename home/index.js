define([
  'app',
  'text!item-data/sets.json',
  'lodash',
  'd3tooltips',
  './js/player-set/index.js',
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
          for(var k in popularSet.gearList) { 
            popularSet.gearList[k] = allItems[popularSet.gearList[k]];
          }
          for(var m in popularSet.skills) {
            var skillObj = popularSet.skills[m].skillList;
            for(var p in skillObj.actives) {
              skillObj.actives[p].skill = allSkills[skillObj.actives[p].skill];
            }
            for(var o in skillObj.passives) {
              skillObj.passives[o] = allSkills[skillObj.passives[o]];
            }
          }
          // var averageRiftTime = Math.floor(_.sum(popularSet.riftTime)/popularSet.riftTime.length);
          // var averageRiftLevel = Math.floor(_.sum(popularSet.riftLevel)/popularSet.riftLevel.length);
          // _this.popularItems.averageRiftTime = popularSet.riftTime;
          // _this.popularItems.averageRiftTime = popularSet.riftTime;
          console.log(popularSet);
          var setObj = {
            popularGear: popularSet.gearList,
            popularSkills: popularSet.skills
          }
          _this.popularItems.push(popularSet);
        }
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
        _this.currentSet = $stateParams.setId || 'raiment-of-a-thousand-storms';
        _this.updateGearSets();
      })
      _this.updateGearSets();
      this.allSets = JSON.parse(sets);
      socketService.on('connect', function(){
      });
      socketService.on('disconnect', function(){
      });
    }]);
});
