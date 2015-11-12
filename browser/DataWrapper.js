'use strict';

const os = require('os');

function wrap(data) {
  return {
    data: data,
    from: os.hostname();
  }
}

function unwrap(data) {
  return data.data;
}

module.exports = {
  wrap: wrap,
  unwrap: unwrap
};
