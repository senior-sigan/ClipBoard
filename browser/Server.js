'use strict';

const _ = require('lodash');
const uuid = require('node-uuid');
const Clipboard = require('./Clipboard');
const DataWrapper = require('./DataWrapper');
const os = require('os');

function startWebSocketServer(callback) {
  const clients = {};
  const app = require('http').createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello from Clipboard server');
  });
  const io = require('socket.io')(app);
  io.on('connection', client => {
    let clientId = uuid.v4();
    console.log(`Client ${clientId} connected`);
    clients[clientId] = client;

    client.on('message', data => {
      console.log(`[Server] Received from remote: ${JSON.stringify(data, null ,' ')}`);
      Clipboard.putInClip(DataWrapper.unwrap(data));
    });

    client.on('disconnect', () => {
      console.log(`Client ${clientId} disconnected`);
      delete clients[clientId];
    });
  });

  app.listen(8124, '0.0.0.0', () => {
    console.log(`Server was started on 0.0.0.0:8124`);
    callback();
  });

  return {
    send: (data) => {
      _.forOwn(clients, client => client.send(data));
    },
    close: () => {
      console.log('Stopping server');
      io.close();
      app.close();
    }
  }
}

function initClipboardServer(callback) {
  const connection = startWebSocketServer(callback);
  const stopListening = Clipboard.listenChanges(data => connection.send({data: data, from: os.hostname()}));

  return {
    close: () => {
      stopListening();
      connection.close();
    }
  };
}

module.exports = initClipboardServer;
