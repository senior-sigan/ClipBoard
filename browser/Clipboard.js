'use strict';

const clipboard = require('clipboard');
const NativeImage = require('native-image');
const _ = require('lodash');

function ClipContent(data) {
  const DEFAULT_FORMAT = 'text/plain';
  const Formats = {};
  Formats['text/plain'] = function(content) {
    clipboard.writeText(content);
  };

  Formats['image/png'] = Formats['image/jpg'] = function(content) {
    clipboard.writeImage(NativeImage.createFromDataUrl(content));
  };

  function validateFormat(format) {
    if (Formats[format]) {
      return format
    } else {
      return DEFAULT_FORMAT;
    }
  }

  this.format = validateFormat(data.format);
  this.content = data.content;

  this.saveInClip = function() {
    Formats[this.format](this.content);
  };
}

function readClip() {
  return {
    format: clipboard.availableFormats()[0],
    content: clipboard.readText() || clipboard.readImage().toDataUrl()
  };
}

function putInClip(data) {
  var content = new ClipContent(data);
  content.saveInClip();
}

function listenChanges(callback) {
  let currentData = readClip();
  const intervalId = setInterval(() => {
    const data = readClip();
    if (data.content !== currentData.content) {
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
