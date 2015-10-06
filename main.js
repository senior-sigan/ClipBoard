'use strict';

const http = require('http');
const clipboard = require('clipboard');


function startServer() {
  const srv = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(readClip());
  });

  srv.listen(1337);
}

function readClip() {
  return clipboard.readText();
}