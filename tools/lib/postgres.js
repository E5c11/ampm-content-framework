'use strict';
/**
 * Single lazy Postgres connection pool for this repo's content-write tooling.
 *
 * Connects through the Cloud SQL Auth Proxy, not directly — start it first:
 *   cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432
 *
 * Connection details come from `.env` via lib/credentials.js's pgConfig(env).
 * See workflows/active/repoint-authoring-to-postgres.md (Phase 1).
 */

const { Pool } = require('pg');
const { pgConfig } = require('./credentials');

let pool;

/** Lazily opens the shared pool for `env` ('dev' | 'prod'). Idempotent within a run. */
function getPool(env = 'dev') {
  if (!pool) {
    pool = new Pool({ ...pgConfig(env), max: 4 });
  }
  return pool;
}

/** Closes the pool if one was opened, so a CLI process exits promptly. */
async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

module.exports = { getPool, closePool };
