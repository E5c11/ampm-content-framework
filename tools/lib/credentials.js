'use strict';
/**
 * Resolves connection config for this repo's tools from a local, untracked `.env` at the
 * repo root (see .env.example). Real environment variables take precedence over `.env`.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..');

function loadDotEnv() {
  const envPath = path.join(REPO_ROOT, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

/**
 * Resolves the Cloud SQL Postgres connection for `env` ('dev' | 'prod') from
 * PG_{HOST,PORT,DATABASE,USER,PASSWORD}_{DEV,PROD} in .env / real env vars.
 *
 * Connect through the Cloud SQL Auth Proxy, not directly:
 *   cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432
 * so PG_HOST_DEV=127.0.0.1 and PG_PORT_DEV matches the --port above.
 * Prod values are deliberately absent by default — owner-gated (D4).
 */
function pgConfig(env) {
  loadDotEnv();
  const suffix = env === 'prod' ? 'PROD' : 'DEV';
  const need = (name) => {
    const v = process.env[`${name}_${suffix}`];
    if (!v) {
      console.error(
        `${name}_${suffix} is not set. Add the PG_*_${suffix} block to .env ` +
        `(see .env.example / tools/README.md) and start the Cloud SQL Auth Proxy first.`,
      );
      process.exit(1);
    }
    return v;
  };
  return {
    host: need('PG_HOST'),
    port: Number(need('PG_PORT')),
    database: need('PG_DATABASE'),
    user: need('PG_USER'),
    password: need('PG_PASSWORD'),
  };
}

module.exports = { pgConfig };
