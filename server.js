var http = require('http');
var fs = require('fs');
var path = require('path');

var dir = __dirname;
var port = 8889;

var mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

http.createServer(function(req, res) {
  var filePath = path.join(dir, req.url === '/' ? 'index.html' : req.url);
  var ext = path.extname(filePath);
  var contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, function(err, data) {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType + '; charset=utf-8' });
      res.end(data);
    }
  });
}).listen(port, function() {
  console.log('Server running at http://127.0.0.1:' + port + '/');
});
