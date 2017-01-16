var Promise = require('promise');
var socketio = require('socket.io');

module.exports = {
  initialize: function(serverUrl) {
    return new Promise(function (resolve, reject) {
      var http = require('http');
      var server = http.createServer(require('./routes.js').init);
      server.listen(3030, serverUrl);
      var io = socketio.listen(server);
      io.set('log level', 1);
      console.log('Server Ready! Go to:', serverUrl + ':' + 3030);
      resolve(io);
    });
  }
};
