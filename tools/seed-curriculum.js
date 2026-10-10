#!/usr/bin/env node
/**
 * Seeds unit + topic curriculum_nodes for a subject from a JSON file (a bulk create-curriculum-node.js).
 *
 *   node tools/seed-curriculum.js --file tools/seeds/english-fal-curriculum.json [--env dev] [--apply]
 *
 * Dry run unless --apply. Requires the subject row to exist (owner-gated reference data) — refuses otherwise.
 * Subtopics are NOT seeded: they come from the real sub-questions, lesson by lesson (create-curriculum-node.js).
 * Ids come from tools/lib/curriculum.js (english_fal: `english_fal_<unit>`, `english_fal_<unit>__<topic>`).
 * Upsert on id; safe to re-run. Re-dump the vocabulary afterwards.
 */
'use strict';
const fs = require('fs');
const { getPool, closePool } = require('./lib/postgres');
const { upsertRow } = require('./lib/upsert');
const { nodeId, parentIds } = require('./lib/curriculum');

const a = process.argv.slice(2).reduce((acc, x, i, arr) => {
  if (x.startsWith('--')) acc[x.slice(2)] = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true;
  return acc;
}, {});
if (!a.file) { console.error('Usage: --file <seed.json> [--env dev|prod] [--apply]'); process.exit(1); }
const env = a.env || 'dev';
const seed = JSON.parse(fs.readFileSync(a.file, 'utf8'));
const subject = seed.subject;
const COLUMNS = ['id', 'type', 'name', 'subject_id', 'description', 'unit_id', 'topic_id',
  'created_at', 'updated_at', 'is_deleted', 'is_published', 'published_at'];

const rows = [];
for (const u of seed.units) {
  rows.push({ type: 'unit', name: u.name, parts: { unit: u.slug } });
  for (const t of u.topics || []) rows.push({ type: 'topic', name: t.name, parts: { unit: u.slug, topic: t.slug } });
}

async function main() {
  const pool = getPool(env);
  const { rowCount } = await pool.query('SELECT 1 FROM subjects WHERE id = $1', [subject]);
  if (!rowCount) { console.error(`❌ subject "${subject}" does not exist in ${env} — the owner must create the subjects row first`); process.exit(1); }
  const now = new Date();
  for (const r of rows) {
    const id = nodeId(subject, r.parts);
    const { unit_id, topic_id } = parentIds(subject, r.type, r.parts);
    console.log(`${a.apply ? 'upsert' : 'would upsert'} ${r.type.padEnd(5)} ${id}`);
    if (!a.apply) continue;
    await upsertRow({ table: 'curriculum_nodes', columns: COLUMNS, conflictColumns: ['id'] }, {
      id, type: r.type, name: r.name, subject_id: subject, description: null, unit_id, topic_id,
      created_at: now, updated_at: now, is_deleted: false, is_published: true, published_at: now,
    }, { env });
  }
  console.log(`${rows.length} nodes (${seed.units.length} units) ${a.apply ? 'written' : 'planned — pass --apply'}`);
}
main().catch((e) => { console.error('\n❌', e.message); process.exitCode = 1; }).finally(closePool);
