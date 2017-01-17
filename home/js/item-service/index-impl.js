define([
  'lodash',
], function(_) {
  'use strict';
  var set = {};
  var itemServiceImpl = function itemServiceImpl(socketService, storeService) {
    socketService.on('getItems',getItemsCallback);
    var getItemsCallback = function getItemsCallback(data) {
      //storeService.update
    }
    var getItemData = function getItemData(testSet) {
      socketService.emit('getItems',testSet)
    }
    return {
      set: set,
      getItemData: getItemData
    }
  };

  return itemServiceImpl;
});
