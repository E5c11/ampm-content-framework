#!/usr/bin/env node
/**
 * Creates / retires / reinstates one `english_texts` row (a Paper 2 prescribed text).
 * English P2 lessons and questions FK to this table by `text_key` (`english_text_id`), and
 * the app's Paper 2 text-picker reads `id` / `name` / `author` / `section` from it.
 *
 *   cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432    (dev; 15433 + --env prod for prod)
 *
 *   # add a newly-prescribed text
 *   node tools/create-english-text.js --id felix_randal --name "Felix Randal" \
 *     --author "Gerard Manley Hopkins" --section poetry
 *
 *   # drop a text from the current list (its old lessons stay in the DB)
 *   node tools/create-english-text.js --retire picture_of_dorian_gray
 *
 *   # bring one back
 *   node tools/create-english-text.js --reinstate the_crucible
 *
 * `--section` is `novel` | `play` | `poetry` (the native Postgres enum — the app translates
 * `play` <-> its own `drama` label). `--years` is optional and only a record: the app no
 * longer filters the picker by year (see plan/active/english-text-picker-per-paper.md in the
 * AMPM repo). Upsert on id, written published. `is_active` = "in the current prescribed list".
 */

'use strict';

const { getPool, closePool } = require('./lib/postgres');
const { upsertRow } = require('./lib/upsert');

const SECTIONS = ['novel', 'play', 'poetry'];

const a = process.argv.slice(2).reduce((acc, x, i, arr) => {
  if (x.startsWith('--')) acc[x.slice(2)] = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true;
  return acc;
}, {});

const env = a.env || 'dev';
const retireId = a.retire === true ? undefined : a.retire;
const reinstateId = a.reinstate === true ? undefined : a.reinstate;

const COLUMNS = [
  'id', 'name', 'author', 'section', 'prescribed_years', 'is_active',
  'created_at', 'updated_at', 'is_deleted', 'is_published', 'published_at',
];

async function setActive(pool, id, active) {
  const { rowCount } = await pool.query(
    `UPDATE english_texts SET is_active = $1, updated_at = now() WHERE id = $2 AND is_deleted = false`,
    [active, id],
  );
  if (!rowCount) { console.error(`❌ no english_texts row with id "${id}"`); process.exit(1); }
  console.log(`✅ english_texts: ${id} -> is_active = ${active}`);
}

async function main() {
  const pool = getPool(env);

  if ('retire' in a) {
    if (!retireId) { console.error('Usage: --retire <id>'); process.exit(1); }
    return setActive(pool, retireId, false);
  }
  if ('reinstate' in a) {
    if (!reinstateId) { console.error('Usage: --reinstate <id>'); process.exit(1); }
    return setActive(pool, reinstateId, true);
  }

  // create / update
  const { id, name, author, section } = a;
  if (!id || !name || !author || !section) {
    console.error('Usage: --id <text_key> --name "<title>" --author "<author>" --section novel|play|poetry [--years 2025,2026]');
    process.exit(1);
  }
  if (!SECTIONS.includes(section)) {
    console.error(`--section must be one of ${SECTIONS.join(' / ')} (not "drama" — the wire value is "play")`);
    process.exit(1);
  }
  const years = typeof a.years === 'string' ? a.years.split(',').map((y) => y.trim()).filter(Boolean) : [];

  const now = new Date();
  await upsertRow(
    { table: 'english_texts', columns: COLUMNS, conflictColumns: ['id'] },
    {
      id, name, author, section, prescribed_years: years, is_active: true,
      created_at: now, updated_at: now, is_deleted: false, is_published: true, published_at: now,
    },
    { env },
  );
  console.log(`✅ english_texts: ${id} ("${name}", ${section})${years.length ? ` — prescribed_years ${JSON.stringify(years)}` : ''}`);
}

if (require.main === module) {
  main().catch((e) => { console.error('\n❌', e.message); process.exitCode = 1; }).finally(closePool);
}
