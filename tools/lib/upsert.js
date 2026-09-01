'use strict';
/**
 * Re-runnable single-row upsert — `INSERT ... ON CONFLICT (<keys>) DO UPDATE`, matching the
 * pattern ampm-backend already uses for idempotent writes. Falls back to `DO NOTHING` for
 * pure-key junction tables (every column is part of the conflict target, nothing left to
 * SET). Under `dryRun`, logs the row and runs no query.
 *
 * Authored content rows carry deterministic UUIDs (lib/uuid.js), so re-running an upload
 * script upserts the same rows instead of duplicating them.
 */

const { getPool } = require('./postgres');

/**
 * @param {{table: string, columns: string[], conflictColumns: string[]}} spec
 * @param {Record<string, unknown>} row
 * @param {{dryRun?: boolean, env?: string}} [opts]
 */
async function upsertRow(spec, row, opts = {}) {
  const { dryRun = false, env = 'dev' } = opts;

  if (dryRun) {
    console.log(`[dry-run] ${spec.table} <- ${JSON.stringify(row)}`);
    return;
  }

  const values = spec.columns.map((c) => row[c]);
  const placeholders = spec.columns.map((_, i) => `$${i + 1}`).join(', ');
  const updateColumns = spec.columns.filter((c) => !spec.conflictColumns.includes(c));
  const conflictAction =
    updateColumns.length > 0
      ? `DO UPDATE SET ${updateColumns.map((c) => `${c} = EXCLUDED.${c}`).join(', ')}`
      : 'DO NOTHING';

  const sql =
    `INSERT INTO ${spec.table} (${spec.columns.join(', ')}) ` +
    `VALUES (${placeholders}) ` +
    `ON CONFLICT (${spec.conflictColumns.join(', ')}) ${conflictAction}`;

  await getPool(env).query(sql, values);
}

module.exports = { upsertRow };
