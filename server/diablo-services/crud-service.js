var request = require('request');
var Promise = require('promise');
var fs = require('fs');
var throttledRequest = require('throttled-request')(request); 
throttledRequest.configure({
  requests: 1,
  milliseconds: function() {
    var minSeconds = 45, maxSeconds = 90;
    return Math.floor((Math.random() * (maxSeconds - minSeconds) + minSeconds));
  }
});

var _get = function _get(_endpoint) {
  console.log("_get: ", _endpoint);
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
    if (err) throw err;
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

var _delayGet = function _delayGet(_endpoint) {
  console.log("_delayGet: ", _endpoint);
  return new Promise(function (resolve, reject) {
    var endpoint = _endpoint;
    throttledRequest(endpoint, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      }else {
        reject(error);
      }
    });
  });
};
var _deleteFile = function _deleteFile(_path) {
  console.log("_deleteFile: ", _path);
  return new Promise(function (resolve, reject) {
    var path = _path;
    fs.unlink(path, function(){
      resolve()
    })
  });
};
module.exports = {
  _get: _get,
  _load: _load,
  _save: _save,
  _delayGet: _delayGet,
  _deleteFile: _deleteFile,
};