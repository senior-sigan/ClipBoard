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
  const send = startServer();
  listenChanges(data => send(data));
}

function initClipboardClient(address) {
  const send = connectToServer(address);
  listenChanges(data => send(data));
}
