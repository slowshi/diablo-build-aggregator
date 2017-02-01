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
      var popularGearSets;
      var allItems;
      var allSkills
      _this.popularItems = [];
      _this.currentSet = $stateParams.setId || 'raiment-of-a-thousand-storms';      
      _this.currentClass = $stateParams.className || 'monk';
      var randomGender = Math.random() > .5 ? '_male' : '_female'
      _this.currentClassImage = 'js/characters/'+_.snakeCase(_this.currentClass)+ randomGender +'.png';
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
          for(var p in popularSet.popularSkills.actives) {
            popularSet.popularSkills.actives[p].skill = allSkills[popularSet.popularSkills.actives[p].skill];
          }
          for(var o in popularSet.popularSkills.passives) {
            popularSet.popularSkills.passives[o] = allSkills[popularSet.popularSkills.passives[o]];
          }
          // for(var m in popularSet.skills) {
          //   var skillObj = popularSet.skills[m].skillList;
          //   for(var p in skillObj.actives) {
          //     skillObj.actives[p].skill = allSkills[skillObj.actives[p].skill];
          //   }
          //   for(var o in skillObj.passives) {
          //     skillObj.passives[o] = allSkills[skillObj.passives[o]];
          //   }
          // }
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
