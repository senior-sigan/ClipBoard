'use strict';

const Clipboard = require('./Clipboard');

function connectToWebSocketServer(path, callback, disconnected) {
  path = path || 'http://localhost:8124';
  const io = require('socket.io-client');
  const client = io(path, {
    reconnection: false,
    multiplex: false
  });
  client.open();

  client.on('connect', () => {
    console.log(`Connected to Clipboard server ${path}`);
    callback();
  });
  client.on('disconnect', (e) => {
    console.log(`Disconnected from Clipboard server ${path} ${e}`)
    disconnected(e === 'transport close');
  });
  client.on('message', data => {
    console.log(data);
    Clipboard.putInClip(data);
  });
  client.on('connect_error', (e) => {
    console.log(JSON.stringify(e));
    disconnected(true, e);
  });

  return {
    send: (data) => client.emit(data),
    close: () => client.disconnect()
  };
}

function initClipboardClient(path, callback, disconnected) {
  const connection = connectToWebSocketServer(path, callback, disconnected);
  const stopListening = Clipboard.listenChanges(data => connection.send(data));

  return {
    close: () => {
      connection.close();
      stopListening();
    }
  };
}

module.exports = initClipboardClient;
