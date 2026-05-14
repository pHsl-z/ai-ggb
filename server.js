var http = require("http");
var fs = require("fs");
var path = require("path");

var PORT = 8080;
var DIR = __dirname;

var MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".wasm": "application/wasm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".xml": "text/xml",
  ".txt": "text/plain",
};

http.createServer(function (req, res) {
  var url = req.url.split("?")[0];
  if (url === "/") url = "/index.html";
  var fp = path.join(DIR, url);
  if (!fs.existsSync(fp)) { res.writeHead(404); res.end("Not Found"); return; }
  var ext = path.extname(fp).toLowerCase();
  var ct = MIME[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": ct + "; charset=utf-8" });
  fs.createReadStream(fp).pipe(res);
}).listen(PORT, function () {
  console.log("Server running at http://localhost:" + PORT);
});
