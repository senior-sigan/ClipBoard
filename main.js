'use strict';

const net = require('net');
const clipboard = require('clipboard');
const uuid = require('node-uuid');
const _ = require('lodash');

function startServer() {
  const clients = {};
  const srv = net.createServer(client => {
    console.log('Client connected');
    let clientId = uuid.v4();
    clients[clientId] = client;

    client.on('end', () => {
      console.log('Client disconnected');
      delete clients[clientId];
    });

    client.on('data', data => {
      console.log(data.toString());
      putInClip(data.toString());
    });
  });

  srv.listen(8124, '0.0.0.0', () => {
    console.log('Start listening ' + JSON.stringify(srv.address()));
  });

  return (data) => {
    _.forOwn(clients, client => client.write(data));
  };
}

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
      putInClip(data);
    });

    client.on('disconnect', () => {
      console.log(`Client ${clientId} disconnected`);
      delete clients[clientId];
    });
  });

  app.listen(8124);

  return (data) => {
    _.forOwn(clients, client => client.emit(data));
  }
}

function connectToWebSocketServer(path) {
  path = path || 'http://localhost:8124';
  const io = require('socket.io-client');
  const client = io(path);

  client.on('connect', () => console.log(`Connected to Clipboard server ${path}`));
  client.on('disconnect', () => console.log(`Disconnected from Clipboard server ${path}`));
  client.on('message', data => {
    console.log(data);
    putInClip(data);
  });

  return (data) => {
    client.send(data);
  };
}

function connectToServer(path) {
  path = path || '0.0.0.0';
  const client = net.connect({host: path, port: 8124}, () => {
    console.log('Connected to server');
  });

  client.on('data', (data) => {
    console.log(data.toString());
    putInClip(data.toString());
  });

  client.on('end', () => {
    console.log('Disconnected from server');
  });

  return (data) => {
    client.write(data);
  };
}

function readClip() {
  return clipboard.readText();
}

function putInClip(text) {
  return clipboard.writeText(text);
}

function listenChanges(callback) {
  let currentData = readClip();
  const intervalId = setInterval(() => {
    const data = readClip();
    if (data !== currentData) {
      currentData = data;
      console.log('Clipboard changed');
      callback(data);
    }
  }, 500);
}

function initClipboardServer() {
  const send = startWebSocketServer();
  listenChanges(data => send(data));
}

function initClipboardClient(path) {
  const send = connectToWebSocketServer(path);
  listenChanges(data => send(data));
}
