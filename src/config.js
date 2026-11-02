'use strict';

// APP_SIGNING_SECRET must be exactly 40 ASCII letters or digits.
const SIGNING_SECRET_PATTERN = /^[A-Za-z0-9]{40}$/;

// Read and validate configuration. The signing secret is required and its
// value must never be printed or logged, including in error messages.
function loadConfig(env = process.env) {
  const secret = env.APP_SIGNING_SECRET;
  if (secret === undefined || secret.trim() === '') {
    throw new Error('Missing required environment variable APP_SIGNING_SECRET');
  }
  if (!SIGNING_SECRET_PATTERN.test(secret)) {
    throw new Error('APP_SIGNING_SECRET is invalid');
  }
  return {
    port: Number(env.PORT) || 3000,
    databaseUrl: env.DATABASE_URL || 'postgres://app:app@localhost:5432/app',
    signingSecret: secret,
  };
}

module.exports = { loadConfig };
