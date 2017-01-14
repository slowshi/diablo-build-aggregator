var Promise = require('promise');

module.exports = {
  initialize: function(serverUrl) {
    return new Promise(function (resolve, reject) {
      var http = require('http');
      var server = http.createServer(require('./routes.js').init);
      server.listen(3030, serverUrl);
      console.log('Server Ready! Go to:', serverUrl + ':' + 3030);
      resolve();
    });
  }
};
