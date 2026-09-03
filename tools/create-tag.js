#!/usr/bin/env node
/**
 * Creates one tags row in the backend's Cloud SQL Postgres. Lesson `tags` (PIPE-06) FK to
 * this table (`name` + `subject_id` are NOT NULL), so a new tag slug must exist here before
 * a lesson referencing it is uploaded.
 *
 *   cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432   (first)
 *
 *   node tools/create-tag.js --subject math_lit --id hire_purchase --name "Hire Purchase"
 *
 * If --name is omitted it's title-cased from the slug. Upsert on id — safe to re-run.
 * Written published (D7).
 */

'use strict';

const { getPool, closePool } = require('./lib/postgres');
const { upsertRow } = require('./lib/upsert');

const a = process.argv.slice(2).reduce((acc, x, i, arr) => {
  if (x.startsWith('--')) acc[x.slice(2)] = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true;
  return acc;
}, {});

const env = a.env || 'dev';
const { subject, id } = a;
const name = a.name || (typeof id === 'string'
  ? id.split('_').map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(' ')
  : undefined);

if (!subject || !id) {
  console.error('Usage: --subject <s> --id <slug> [--name "<display>"]');
  process.exit(1);
}

const COLUMNS = [
  'id', 'name', 'subject_id',
  'created_at', 'updated_at', 'is_deleted', 'is_published', 'published_at',
];

async function main() {
  const pool = getPool(env);
  const { rowCount } = await pool.query('SELECT 1 FROM subjects WHERE id = $1', [subject]);
  if (!rowCount) { console.error(`❌ unknown subject: ${subject}`); process.exit(1); }

  const now = new Date();
  await upsertRow(
    { table: 'tags', columns: COLUMNS, conflictColumns: ['id'] },
    {
      id, name, subject_id: subject,
      created_at: now, updated_at: now, is_deleted: false, is_published: true, published_at: now,
    },
    { env },
  );
  console.log(`✅ tags: ${id} ("${name}", ${subject})`);
}

main().catch((e) => { console.error('\n❌', e.message); process.exitCode = 1; }).finally(closePool);
