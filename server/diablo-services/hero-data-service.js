var _ = require('lodash');
var Promise = require('promise');

var getHeroItems = function getHeroItems(data) {
  console.log('getHeroItems',data);
  var gear = {'foo': 'bar'};

  return gear;
}

var parseHero = function parseHero(data) {
  return new Promise(function (resolve, reject) {
    getHeroItems(data);
    var parsedData = {
      gear: getHeroItems()
    }
    resolve(parsedData);
  });
}

module.exports = {
  parseHero: parseHero
};