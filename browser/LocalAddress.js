'use strict';

const os = require('os');
const _ = require('lodash');

module.exports = function() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  _.forOwn(interfaces, (value, key) => {
    let ipv4Scopes = _.filter(value, scope => {
      return scope.family === 'IPv4' && scope.address !== '127.0.0.1';
    });

    return _.forEach(ipv4Scopes, scope => addresses.push(scope.address));
  });

  return addresses;
};
