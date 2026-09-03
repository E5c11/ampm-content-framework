#!/usr/bin/env node
/**
 * Creates one curriculum_nodes row (unit / topic / subtopic) in the backend's Cloud SQL
 * Postgres — the "create the row FIRST, in the same session, before writing it into any
 * question" step of PIPE-08 (was: add the Firestore doc).
 *
 *   cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432   (first)
 *
 *   node tools/create-curriculum-node.js --subject math_lit --type unit \
 *     --slug maps_and_scale --name "Maps and Scale" [--description "..."]
 *
 *   node tools/create-curriculum-node.js --subject math_lit --type topic \
 *     --unit data_handling --slug percentages --name "Percentages"
 *
 *   node tools/create-curriculum-node.js --subject english_hl --type subtopic \
 *     --unit comprehension --topic figurative_language --slug metaphor_identification \
 *     --name "Metaphor Identification"
 *
 * Pass bare slugs for --unit/--topic/--slug; the namespaced ID (english_hl) is derived.
 * Upsert on id — safe to re-run. Written published (is_published = true, D7). Re-dump the
 * vocabulary snapshot afterwards (tools/dump-curriculum-vocabulary.js).
 */

'use strict';

const { getPool, closePool } = require('./lib/postgres');
const { upsertRow } = require('./lib/upsert');
const { nodeId, parentIds } = require('./lib/curriculum');

const a = process.argv.slice(2).reduce((acc, x, i, arr) => {
  if (x.startsWith('--')) acc[x.slice(2)] = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true;
  return acc;
}, {});

const env = a.env || 'dev';
const { subject, type, unit, topic, slug, name } = a;
const description = a.description || null;

const TYPES = ['unit', 'topic', 'subtopic'];
if (!subject || !TYPES.includes(type) || !slug || !name) {
  console.error('Usage: --subject <s> --type unit|topic|subtopic --slug <bare> --name "<display>" [--unit <bare>] [--topic <bare>] [--description "..."]');
  process.exit(1);
}
if (type !== 'unit' && !unit) { console.error(`--unit is required for type ${type}`); process.exit(1); }
if (type === 'subtopic' && !topic) { console.error('--topic is required for type subtopic'); process.exit(1); }

const parts = { unit: type === 'unit' ? slug : unit, topic: type === 'topic' ? slug : topic, subtopic: type === 'subtopic' ? slug : undefined };
const id = nodeId(subject, parts);
const { unit_id, topic_id } = parentIds(subject, type, parts);

const COLUMNS = [
  'id', 'type', 'name', 'subject_id', 'description', 'unit_id', 'topic_id',
  'created_at', 'updated_at', 'is_deleted', 'is_published', 'published_at',
];

async function main() {
  const pool = getPool(env);

  // FK preflight: the parent nodes must exist.
  for (const pid of [unit_id, topic_id].filter(Boolean)) {
    const { rowCount } = await pool.query('SELECT 1 FROM curriculum_nodes WHERE id = $1', [pid]);
    if (!rowCount) { console.error(`❌ parent curriculum_nodes row missing: ${pid} — create it first`); process.exit(1); }
  }
  const { rowCount: subjOk } = await pool.query('SELECT 1 FROM subjects WHERE id = $1', [subject]);
  if (!subjOk) { console.error(`❌ unknown subject: ${subject}`); process.exit(1); }

  const now = new Date();
  await upsertRow(
    { table: 'curriculum_nodes', columns: COLUMNS, conflictColumns: ['id'] },
    {
      id, type, name, subject_id: subject, description, unit_id, topic_id,
      created_at: now, updated_at: now, is_deleted: false, is_published: true, published_at: now,
    },
    { env },
  );
  console.log(`✅ curriculum_nodes: ${id} (${type}, ${subject})`);
  console.log('   Re-dump: node tools/dump-curriculum-vocabulary.js --subject ' + subject + ' --out temp/curriculum-vocab.json');
}

main().catch((e) => { console.error('\n❌', e.message); process.exitCode = 1; }).finally(closePool);
