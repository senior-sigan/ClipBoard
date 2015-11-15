'use strict';

const os = require('os');

function wrap(data) {
  return {
    data: data,
    from: os.hostname()
  }
}

function unwrap(data) {
  return data.data;
}

function source(data) {
  return data.from;
}

module.exports = {
  wrap: wrap,
  unwrap: unwrap,
  source: source
};
