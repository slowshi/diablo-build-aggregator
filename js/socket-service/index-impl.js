define([
  'lodash',
  'socket-io'
], function(_, io) {
  'use strict';
  var socketServiceImpl = function socketServiceImpl($rootScope) {
    var socket = io.connect('', {reconnect: true});
    var on = function on(eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    };

    var emit = function emit(eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    };

    return {
      on: on,
      emit: emit
    }
  };

  return socketServiceImpl;
});
