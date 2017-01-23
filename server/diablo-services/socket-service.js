var Promise = require('promise');
var apiService = require('./api-service.js');
var heroDataService = require('./hero-data-service.js');
var setsDataService = require('./sets-data-service.js');
var itemDataService = require('./item-data-service.js');
var io;

var setSocket = function setSocket(connectedIo) {
  return new Promise(function (resolve, reject) {
    io = connectedIo;
    io.sockets.on('connection',function(socket){
      console.log('expose endpoints to socket');
      socket.on('getInitialData', getInitialData)
      socket.on('getHeroData',getHeroData);
      socket.on('getHeroSets',getHeroSets);
      socket.on('getPopularGearSets',getPopularGearSets);
      socket.on('getItems', getItems);
    });
    var getInitialData = function getInitialData() {
      io.sockets.emit('getInitialData',{
        popularGearSets: setsDataService.getPopularGearSets(),
        allSkills: heroDataService.getAllSkills(),
        allItems: itemDataService.getAllItems(),
      })
    }
    var getHeroData = function getHeroData(heroId) {
      io.sockets.emit('getHeroData',heroDataService.getHeroData(heroId));
    }
    var getHeroSets = function getHeroSets(_slug) {
      var slug = _slug || '';
      io.sockets.emit('getHeroSets',setsDataService.getHeroSets(slug));
    }
    var getPopularGearSets = function getPopularGearSets() {
      io.sockets.emit('getPopularGearSets',setsDataService.getPopularGearSets());
    }
    var getItems = function getItems(itemSet) {
      io.sockets.emit('getItems',itemDataService.getItems(itemSet));
    }
    resolve();
  });
}
module.exports = {
  setSocket: setSocket
}