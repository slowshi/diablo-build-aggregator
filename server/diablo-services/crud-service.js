var request = require('request');
var Promise = require('promise');
var fs = require('fs');

var _get = function _get(_endpoint) {
  console.log(_endpoint);
  return new Promise(function (resolve, reject) {
    var endpoint = _endpoint;
    request(endpoint, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      }else {
        reject(error);
      }
    });
  });
};

var _load = function(path) {
 return new Promise(function (resolve, reject){
  fs.readFile(path, function(err, data) {
    if (err) throw error;
    console.log("Finished loading from:", path);
    resolve(JSON.parse(data));
    });
  });
};

var _save = function(path, data) {
  return new Promise(function (resolve, reject){
    fs.writeFile(path, JSON.stringify(data), 'utf8', function() {
      console.log("Finished saving to:", path);
      resolve(data);
    });
  }); 
};

module.exports = {
  _get: _get,
  _load: _load,
  _save: _save,
};