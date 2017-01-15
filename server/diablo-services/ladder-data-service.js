var _ = require('lodash');

var parseLadderData = function parseLadderData(data) {
    var newObj = {};
    for(var i in data.row) {
      var heroData = data.row[i];
      var dataObj = {};
      var playerObj = {};
      for(var j in heroData.data) {
        var stat = heroData.data[j];
        var vals = _.values(stat);
        dataObj[vals[0]] = vals[1];
      }
        for(var k in heroData.player[0].data) {
        var stat = heroData.player[0].data[k];
        var vals = _.values(stat);
        playerObj[vals[0]] = vals[1];
      }
      heroData.data = dataObj;
      heroData.player = playerObj;
    }
    return data;
};

module.exports = {
  parseLadderData: parseLadderData,
  //getPopularItems: getPopularItems
};