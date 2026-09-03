#!/usr/bin/env node
/**
 * Creates one skills row in the backend's Cloud SQL Postgres — the "create it FIRST, before
 * writing it into any question" step of PIPE-08 (was: add the Firestore doc / rely on
 * distinct usage).
 *
 *   cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432   (first)
 *
 *   node tools/create-skill.js --subject math_lit --id percentage_change \
 *     --name "Percentage Change" [--description "..."]
 *
 * Upsert on id — safe to re-run. Written published (D7). Re-dump the vocabulary snapshot
 * afterwards (tools/dump-curriculum-vocabulary.js).
 */

'use strict';

const { getPool, closePool } = require('./lib/postgres');
const { upsertRow } = require('./lib/upsert');

const a = process.argv.slice(2).reduce((acc, x, i, arr) => {
  if (x.startsWith('--')) acc[x.slice(2)] = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true;
  return acc;
}, {});

const env = a.env || 'dev';
const { subject, id, name } = a;
const description = a.description || null;

if (!subject || !id || !name) {
  console.error('Usage: --subject <s> --id <slug> --name "<display>" [--description "..."]');
  process.exit(1);
}

const COLUMNS = [
  'id', 'name', 'description', 'subject_id',
  'created_at', 'updated_at', 'is_deleted', 'is_published', 'published_at',
];

async function main() {
  const pool = getPool(env);
  const { rowCount } = await pool.query('SELECT 1 FROM subjects WHERE id = $1', [subject]);
  if (!rowCount) { console.error(`❌ unknown subject: ${subject}`); process.exit(1); }

  const now = new Date();
  await upsertRow(
    { table: 'skills', columns: COLUMNS, conflictColumns: ['id'] },
    {
      id, name, description, subject_id: subject,
      created_at: now, updated_at: now, is_deleted: false, is_published: true, published_at: now,
    },
    { env },
  );
  console.log(`✅ skills: ${id} (${subject})`);
  console.log('   Re-dump: node tools/dump-curriculum-vocabulary.js --subject ' + subject + ' --out temp/curriculum-vocab.json');
}

main().catch((e) => { console.error('\n❌', e.message); process.exitCode = 1; }).finally(closePool);
