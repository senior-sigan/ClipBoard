'use strict';

const _ = require('lodash');
const uuid = require('node-uuid');
const Clipboard = require('./Clipboard');

function startWebSocketServer() {
  const clients = {};
  const app = require('http').createServer((req, res) => {
    res.send('Hello from clipboard server');
  });
  const io = require('socket.io')(app);
  io.on('connection', client => {
    let clientId = uuid.v4();
    console.log(`Client ${clientId} connected`);
    clients[clientId] = client;

    client.on('message', data => {
      console.log(data);
      Clipboard.putInClip(data);
    });

    client.on('disconnect', () => {
      console.log(`Client ${clientId} disconnected`);
      delete clients[clientId];
    });
  });

  app.listen(8124, '0.0.0.0', () => {
    console.log(`Server was started on 0.0.0.0:8124`);
  });

  return {
    send: (data) => {
      _.forOwn(clients, client => client.emit(data));
    },
    close: (callback) => {
      console.log('Stopping server');
      app.close(callback);
    }
  }
}

function initClipboardServer() {
  const connection = startWebSocketServer();
  const stopListening = Clipboard.listenChanges(data => connection.send(data));

  return {
    close: (callback) => {
      stopListening();
      connection.close(callback);
    }
  };
}

module.exports = initClipboardServer;
