'use strict';

const clipboard = require('clipboard');

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

  return () => {
    clearInterval(intervalId);
  };
}

module.exports = {
  readClip: readClip,
  putInClip: putInClip,
  listenChanges: listenChanges
};
