#!/usr/bin/env node
/**
 * Sets, changes or clears the per-EXAM minimum app version — one `exam_versions` row per
 * (subject, syllabus, year, session), so every paper of a sitting is gated together (D6: a student
 * must never see Paper 3 without Papers 1 and 2).
 *
 *   # dry run (default): shows what would change, writes nothing
 *   node tools/set-exam-gate.js --env dev --subject maths --syllabus dbe --year 2019 --session november --min 2.2.0
 *   # write it
 *   node tools/set-exam-gate.js ... --min 2.2.0 --apply
 *   # remove the gate
 *   node tools/set-exam-gate.js ... --clear --apply
 *
 * Needs the Cloud SQL Auth Proxy first (see tools/README.md). Prod is owner-gated: --env prod
 * additionally requires --i-know-this-is-prod, same posture as push-paper-to-prod.js.
 *
 * WHY THIS BUMPS updated_at (verified live on dev, 2026-10-04): clients sync content with a
 * `since` cursor and the server returns rows with `updated_at > since`. Changing or removing a
 * gate does not touch the exam's rows, so a client that already synced past them never receives
 * an exam that has just become available to it. Every gate change therefore also sets
 * `updated_at = now()` on the exam's lessons and questions, in the same transaction.
 *
 * RAISING a gate on an exam clients may already hold does NOT remove its rows from their devices
 * (gate BEFORE publishing). The tool warns when it sees published rows.
 */

'use strict';

const { getPool, closePool } = require('./lib/postgres');
const { versionCode } = require('./lib/feature-versions');

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); return i !== -1 ? args[i + 1] : null; };
const has = (n) => args.includes(n);

const env = flag('--env') || 'dev';
const subject = flag('--subject');
const syllabus = flag('--syllabus') || 'dbe';
const year = flag('--year');
const session = flag('--session');
const min = flag('--min');
const clear = has('--clear');
const apply = has('--apply');

function usage(msg) {
  if (msg) console.error(`error: ${msg}\n`);
  console.error('Usage: node tools/set-exam-gate.js --env dev|prod --subject <id> [--syllabus dbe] --year <YYYY> --session <june|november> (--min <x.y.z> | --clear) [--apply]');
  process.exit(1);
}

if (!subject || !year || !session) usage('--subject, --year and --session are required');
if (!min && !clear) usage('give --min <x.y.z> or --clear');
if (min && clear) usage('--min and --clear are mutually exclusive');
if (min === 'next') usage('--min next is not a version: the exam depends on a capability planned for the next release, so it is dev-only. Tag the release, record its number in tools/lib/feature-versions.js, then gate with that.');
if (min && versionCode(min) === null) usage(`--min "${min}" is not major.minor.patch`);
if (!['dev', 'prod'].includes(env)) usage('--env must be dev or prod');
if (env === 'prod' && !has('--i-know-this-is-prod')) usage('prod changes need --i-know-this-is-prod (owner-gated)');

const EXAM = [subject, syllabus, year, session];
const EXAM_WHERE = (alias) =>
  `${alias}.subject_id = $1 AND ${alias}.syllabus_id = $2 AND ${alias}.year_id = $3 AND p.session = $4 AND NOT ${alias}.is_deleted`;

async function main() {
  const pool = getPool(env);

  const { rows: cur } = await pool.query(
    'SELECT min_app_version FROM exam_versions WHERE subject_id=$1 AND syllabus_id=$2 AND year_id=$3 AND session=$4', EXAM);
  const current = cur[0]?.min_app_version ?? null;

  const lessons = await pool.query(
    `SELECT count(*)::int AS n, count(*) FILTER (WHERE l.is_published)::int AS published
       FROM lessons l JOIN papers p ON p.id = l.paper_id WHERE ${EXAM_WHERE('l')}`, EXAM);
  const questions = await pool.query(
    `SELECT count(*)::int AS n, count(*) FILTER (WHERE q.is_published)::int AS published
       FROM questions q JOIN papers p ON p.id = q.paper_id WHERE ${EXAM_WHERE('q')}`, EXAM);
  const L = lessons.rows[0], Q = questions.rows[0];

  console.log(`env:        ${env}`);
  console.log(`exam:       ${subject} / ${syllabus} / ${year} / ${session}`);
  console.log(`rows:       ${L.n} lessons (${L.published} published), ${Q.n} questions (${Q.published} published)`);
  console.log(`gate:       ${current ?? '(none)'}  ->  ${clear ? '(none)' : min}`);

  if (L.n + Q.n === 0) {
    console.error('\nNo lessons or questions match this exam — check subject/year/session (session is papers.session: june | november). Nothing to do.');
    process.exit(1);
  }
  if (current === (clear ? null : min)) {
    console.log('\nGate already has this value. Nothing to change.');
    return;
  }
  const raising = !clear && (current === null || versionCode(min) > versionCode(current));
  if (raising && (L.published + Q.published) > 0) {
    console.log('\nWARNING: this exam already has published rows. Raising a gate hides them from builds that');
    console.log('sync AFTER this change, but does NOT remove rows already stored on devices that synced earlier.');
    console.log('Gate before publishing wherever possible.');
  }

  if (!apply) {
    console.log('\nDry run — nothing written. Re-run with --apply to write the gate and bump updated_at on the exam\'s rows.');
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (clear) {
      await client.query('DELETE FROM exam_versions WHERE subject_id=$1 AND syllabus_id=$2 AND year_id=$3 AND session=$4', EXAM);
    } else {
      await client.query(
        `INSERT INTO exam_versions (subject_id, syllabus_id, year_id, session, min_app_version)
              VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (subject_id, syllabus_id, year_id, session)
         DO UPDATE SET min_app_version = EXCLUDED.min_app_version, updated_at = now()`, [...EXAM, min]);
    }
    const l = await client.query(
      `UPDATE lessons l SET updated_at = now() FROM papers p WHERE p.id = l.paper_id AND ${EXAM_WHERE('l')}`, EXAM);
    const q = await client.query(
      `UPDATE questions q SET updated_at = now() FROM papers p WHERE p.id = q.paper_id AND ${EXAM_WHERE('q')}`, EXAM);
    await client.query('COMMIT');
    console.log(`\nApplied. Gate ${clear ? 'cleared' : `set to ${min}`}; bumped updated_at on ${l.rowCount} lessons and ${q.rowCount} questions.`);
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

main().catch((e) => { console.error(e.message); process.exitCode = 1; }).finally(closePool);
