'use strict';

const clipboard = require('clipboard');
const os = require('os');
const DataWrapper = require('./DataWrapper');
const history = [];

function pushToHistory(text, source) {
  source = source || os.hostname();
  history.push({data: text, source: source});
  if (history.length > 10) {
    history.shift();
  }
}

function readClip() {
  return clipboard.readText();
}

function putInClip(data) {
  const text = DataWrapper.unwrap(data)
  const source = DataWrapper.source(data);
  pushToHistory(text, source);
  return clipboard.writeText(text);
}

function isLocalChange(data) {
  return !history[history.length - 1]
    || (data !== history[history.length - 1].data
      && history[history.length - 1].source === os.hostname()
    );
}

function listenChanges(callback) {
  pushToHistory(readClip());
  const intervalId = setInterval(() => {
    const data = readClip();
    if (isLocalChange(data)) {
      pushToHistory(data);
      console.log('Clipboard changed');
      console.log(history);
      callback(data);
    }
  }, 100);

  return () => {
    clearInterval(intervalId);
  };
}

module.exports = {
  readClip: readClip,
  putInClip: putInClip,
  listenChanges: listenChanges
};
