var serverUrl = process.argv[2] || 'localhost';
var startup = require('./server/startup.js');
startup.initialize(serverUrl);
