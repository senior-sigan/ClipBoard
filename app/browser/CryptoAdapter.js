'use strict';

const PromiseA = require('bluebird');
const Crypto = require('crypto');
const CryptoAsync = PromiseA.promisifyAll(Crypto);

const CryptoAdapter = {};

const HASH_ALGORITHM = 'sha1';
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const SALT_SIZE = 256;
const IV_SIZE = 16;

/**
 * @method generateHashFromPassword
 * @param  {string} password
 * @param  {string} hSalt - salt as string in hex format
 * @return {Promise} password hash with salt as string in hex format
 */
CryptoAdapter.generateHashFromPassword = (password, hSalt) => {
  const bSalt = new Buffer(hSalt, 'hex');
  return CryptoAsync.pbkdf2Async(password, bSalt, 4096, 32, HASH_ALGORITHM).then(hash => hash.toString('hex'));
};

/**
 * @method generateSalt
 * @return {Promise} salt as string in hex format
 */
CryptoAdapter.generateSalt = () => {
  return CryptoAsync.randomBytesAsync(SALT_SIZE).then(salt => salt.toString('hex'));
};

/**
 * @method encrypt
 * @param  {string} data - open data
 * @param  {string} hKey - encryption key in hex format
 * @return {Promise} object with encrypted data as string in hex format
 *                          and initialization vector as string in hex format
 */
CryptoAdapter.encrypt = (data, hKey) => {
  const bKey = new Buffer(hKey, 'hex');
  return CryptoAsync.randomBytesAsync(IV_SIZE).then(iv => {
    const cipher = CryptoAsync.createCipheriv(ENCRYPTION_ALGORITHM, bKey, iv);
    const enc = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');

    return {
      data: enc,
      iv: iv.toString('hex'),
    };
  });
};

/**
 * @method decrypt
 * @param  {string} data - encrypted data in hex format
 * @param  {string} hIv  - initialization vector for encryption algorithm in hex format
 * @param  {string} hKey - key in hex format
 * @return {Promise} open data as string
 */
CryptoAdapter.decrypt = (data, hIv, hKey) => {
  const bKey = new Buffer(hKey, 'hex');
  const bIv = new Buffer(hIv, 'hex');

  const decipher = CryptoAsync.createDecipheriv(ENCRYPTION_ALGORITHM, bKey, bIv);
  const dec = decipher.update(data, 'hex', 'utf8') + decipher.final('utf8');

  return PromiseA.resolve(dec);
};

module.exports = CryptoAdapter;
