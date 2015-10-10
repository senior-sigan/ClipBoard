'use strict';

const Clipboard = require('./Clipboard');

function connectToWebSocketServer(path) {
  path = path || 'http://localhost:8124';
  const io = require('socket.io-client');
  const client = io(path);

  client.on('connect', () => console.log(`Connected to Clipboard server ${path}`));
  client.on('disconnect', () => console.log(`Disconnected from Clipboard server ${path}`));
  client.on('message', data => {
    console.log(data);
    Clipboard.putInClip(data);
  });

  return {
    send: (data) => client.emit(data),
    close: () => client.disconnect()
  };
}

function initClipboardClient(path) {
  const connection = connectToWebSocketServer(path);
  const stopListening = Clipboard.listenChanges(data => connection.send(data));

  return {
    close: () => {
      connection.close();
      stopListening();
    }
  };
}

module.exports = initClipboardClient;
