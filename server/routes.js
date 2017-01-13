var fs = require('fs');
var path = require('path');
var mime = require('mime');
module.exports = {
  init: function(req, res) {
    var filePath = '';
    if (req.url === '/') {
      req.url = '';
      filePath = './index.html';
    } else {
      filePath += '.' + req.url;
    }
    module.exports.validatePage(res, filePath);
  },
  validatePage: function(res, filePath) {
    fs.readFile(filePath, function(err, data) {
      if (err) {
        module.exports.get404(res);
      } else {
        module.exports.getPage(res, filePath, data);
      }
    });
  },
  getPage: function(res, filePath, contents) {
    res.writeHead(200, {
      'content-type': mime.lookup(path.basename(filePath))
    });
    res.end(contents);
  },
  get404: function(res) {
    res.writeHead(302, {Location: './'});
    res.end();
  }
};
