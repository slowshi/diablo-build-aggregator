define([
  'app',
  'text!item-data/sets.json',
  'lodash',
  'd3tooltips',
  './js/player-set/index.js',
  'socket-service',
  '../header/index.js'
],
function(app, sets, _, test) {
  app.registerController('ClassPageController', ['$scope', 'cssInjector', 'socketService',
  'storeService', '$stateParams', '$state',
    function($scope, cssInjector, socketService, storeService, $stateParams, $state) {
      cssInjector.add('js/vendors/bootstrap/4.0.0/css/bootstrap.min.css');
      cssInjector.add('class-page/index.css');
      var _this = this;
      var classMap = {
        'rift-barbarian' : 'barbarian',
        'rift-crusader' : 'crusader',
        'rift-dh' : 'demon_hunter',
        'rift-monk' : 'monk',
        'rift-wd' : 'witch_doctor',
        'rift-wizard' : 'wizard'
      }
      _this.allSets = [];
      _this.popularItems = [];
      var allItems;
      var allSkills;
      _this.currentSet = $stateParams.setId || 'raiment-of-a-thousand-storms';      
      _this.currentClass = $stateParams.className || 'rift-monk';
      var randomGender = Math.random() > .5 ? '_male' : '_female'
      _this.currentClassImage = 'js/characters/'+ classMap[_this.currentClass] + randomGender +'.png';
      _this.selectSet = function(selectedSet) {
        $state.go('.', {setId: selectedSet});
      }
      _this.updateGearSets = function updateGearSets(setByName) {
        var parsedItems = [];
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
          for(var p in popularSet.popularSkills.actives) {
            popularSet.popularSkills.actives[p].skill = allSkills[popularSet.popularSkills.actives[p].skill];
          }
          for(var o in popularSet.popularSkills.passives) {
            popularSet.popularSkills.passives[o] = allSkills[popularSet.popularSkills.passives[o]];
          }
          parsedItems.push(popularSet);
        }
        return parsedItems;
      }

      socketService.emit('getInitialData');
      socketService.on('getInitialData',function(data){
        console.log(data);
        for(var i in data){
          storeService.updateStoreData(i,data[i]);
        }
        var popularGearSets = storeService.getStoreData('popularGearSets')[_this.currentClass].all;
        console.log(popularGearSets);
        var allSets = storeService.getStoreData('allSets');
        allItems = storeService.getStoreData('allItems');
        allSkills = storeService.getStoreData('allSkills');

        var setSlugs = _.keys(popularGearSets);
        _this.allSets = _.map(setSlugs,function(slug) {
          return allSets[slug];
        })
        if(popularGearSets[_this.currentSet] === void 0) {
          _this.currentSet = setSlugs[0];
        }
        _this.popularItems = _this.updateGearSets(popularGearSets[_this.currentSet]);
      })
      socketService.on('connect', function(){
      });
      socketService.on('disconnect', function(){
      });
    }]);
});
