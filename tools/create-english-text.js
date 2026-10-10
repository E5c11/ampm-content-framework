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
 * `--section` is a free-form lowercase snake_case string (VARCHAR(32) since backend V83; the enum is
 * gone). Known values: `novel`, `play` (the app labels it "Drama"), `poetry`, `short_stories`
 * (English FAL). A value outside that list is accepted with a warning — see shared/setwork.md
 * SETWORK-SEC-01. A text with a NEW section value (`short_stories`) must not reach prod before
 * app 2.4.1 (SETWORK-GATE-01): older builds break syncing English texts. The tool refuses
 * `--env prod` for a non-legacy section unless --i-know-this-is-prod-and-2.4.1-is-released is passed.
 *
 *   # inspect the registry first (SETWORK-TXT-02: reuse before create)
 *   node tools/create-english-text.js --list [--section short_stories] `--years` is optional and only a record: the app no
 * longer filters the picker by year (see plan/active/english-text-picker-per-paper.md in the
 * AMPM repo). Upsert on id, written published. `is_active` = "in the current prescribed list".
 */

'use strict';

const { getPool, closePool } = require('./lib/postgres');
const { upsertRow } = require('./lib/upsert');

const KNOWN_SECTIONS = ['novel', 'play', 'poetry', 'short_stories'];
const LEGACY_SECTIONS = ['novel', 'play', 'poetry']; // the only values released app builds can decode (< 2.4.1)
const SECTION_RE = /^[a-z][a-z0-9_]{0,31}$/;

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

  if (a.list) {
    const params = typeof a.section === 'string' ? [a.section] : [];
    const { rows } = await pool.query(
      `SELECT id, name, author, section, is_active FROM english_texts WHERE is_deleted = false${params.length ? ' AND section = $1' : ''} ORDER BY section, id`,
      params,
    );
    for (const r of rows) console.log(`${r.section.padEnd(14)} ${r.id.padEnd(36)} ${r.is_active ? ' ' : 'x'} ${r.name} — ${r.author}`);
    console.log(`${rows.length} texts (x = retired) in ${env}`);
    return;
  }

  // create / update
  const { id, name, author, section } = a;
  if (!id || !name || !author || !section) {
    console.error('Usage: --id <text_key> --name "<title>" --author "<author>" --section novel|play|poetry|short_stories [--years 2025,2026]');
    process.exit(1);
  }
  if (section === 'drama') {
    console.error('--section "drama" is not a value — the wire value is "play" (the app labels it Drama)');
    process.exit(1);
  }
  if (!SECTION_RE.test(section)) {
    console.error(`--section must be lowercase snake_case, at most 32 characters (got "${section}")`);
    process.exit(1);
  }
  if (!KNOWN_SECTIONS.includes(section)) {
    console.warn(`⚠ "${section}" is not a known section (${KNOWN_SECTIONS.join(', ')}); record it in shared/setwork.md SETWORK-SEC-01 if it is intentional`);
  }
  if (env === 'prod' && !LEGACY_SECTIONS.includes(section) && !a['i-know-this-is-prod-and-2.4.1-is-released']) {
    console.error(`❌ refusing to write a "${section}" text to prod: older app builds break syncing an unknown section (SETWORK-GATE-01). Wait for app 2.4.1.`);
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
