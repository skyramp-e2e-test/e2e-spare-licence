'use strict';

const crypto = require('crypto');

// SHA-256 hex digest of the expected APP_LICENCE_KEY. Only the hash is stored
// here; the key itself is supplied via the environment.
const LICENCE_KEY_SHA256 = '302d702da3ea073b74c9c229229c1751a061f119f201ba1deb461adacfc3ddff';

function sha256Hex(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

// Read and validate configuration. The licence key is required and its value
// must never be printed or logged, including in error messages.
function loadConfig(env = process.env) {
  const licenceKey = env.APP_LICENCE_KEY;
  if (licenceKey === undefined || licenceKey.trim() === '') {
    throw new Error('APP_LICENCE_KEY is not set');
  }
  const actual = Buffer.from(sha256Hex(licenceKey), 'utf8');
  const expected = Buffer.from(LICENCE_KEY_SHA256.toLowerCase(), 'utf8');
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    throw new Error('APP_LICENCE_KEY is wrong');
  }
  return {
    port: Number(env.PORT) || 3000,
    databaseUrl: env.DATABASE_URL || 'postgres://app:app@localhost:5432/app',
    // The validated licence key also signs the session cookie.
    cookieSecret: licenceKey,
  };
}

module.exports = { loadConfig };
