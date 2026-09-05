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

const pools = new Map();

/** Lazily opens the shared pool for `env` ('dev' | 'prod'). Idempotent within a run. */
function getPool(env = 'dev') {
  if (!pools.has(env)) {
    pools.set(env, new Pool({ ...pgConfig(env), max: 4 }));
  }
  return pools.get(env);
}

/** Closes every pool that was opened, so a CLI process exits promptly. */
async function closePool() {
  for (const pool of pools.values()) {
    await pool.end();
  }
  pools.clear();
}

module.exports = { getPool, closePool };
