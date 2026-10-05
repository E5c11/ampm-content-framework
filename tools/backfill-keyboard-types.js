#!/usr/bin/env node
/**
 * Backfill — `questions.keyboard_type` for existing content, plus a per-exam gate report.
 * (AMPM plan `question-keyboards-and-exam-version-gating.md`, Phase 4 / Initiative 2; Linear BLA-20.)
 *
 *   node tools/backfill-keyboard-types.js --env dev                       # dry run (default): report only
 *   node tools/backfill-keyboard-types.js --env dev --out temp/kb-dev.json  # also save the report as JSON
 *   node tools/backfill-keyboard-types.js --env dev --apply               # write keyboard_type
 *   node tools/backfill-keyboard-types.js --env prod --apply --i-know-this-is-prod
 *
 * Needs the Cloud SQL Auth Proxy (tools/README.md). Reading prod (dry run) is allowed; writing prod needs
 * --i-know-this-is-prod AND the backend migration V80 deployed there (the script checks the column).
 *
 * WHAT IT SETS. For each question that needs a typed keyboard (fitb / fraction / steps / equation) and
 * currently resolves — by the app's subject inference — to a RELEASED declarable keyboard
 * (`standard_math` or `scientific_math`), it stores that value, so the data says what the app already does.
 * Behaviour does not change: released builds that ignore the field infer the same keyboard, and builds that
 * read it get the same one. It deliberately leaves `keyboard_type` NULL for:
 *   - presentations that never need a keyboard (multiple_choice, multi_select, match, ordering);
 *   - `english_hl` — it resolves to the legacy English keyboard, which is not a declarable value;
 *     it becomes `text` when BLA-58 ships (re-run this tool then, extended);
 *   - `None`-routed subjects (life_science, geography, history, business_studies) — system IME; `text` later.
 * It NEVER overwrites a non-null value (a conflicting one is reported, not changed), so it is idempotent
 * and safe to re-run. `physics` (Physical Sciences) is keyed on `paper_id` in the report: P1 = Physics,
 * P2 = Chemistry; both resolve the same today, and diverge only once the `physics`/`chemistry` keyboards
 * ship (then extend `desiredFor` below).
 *
 * UPDATED_AT. By default `updated_at` is NOT touched: the value equals what clients already infer, so there is
 * nothing for them to re-download (touching it would make every client re-fetch ~every typed question once).
 * `--bump-updated-at` forces that, if you need delta-syncing clients to receive the explicit value.
 *
 * GATES. The report derives each EXAM's minimum app version from the rows in the database (same analysis the
 * validator and derive-exam-min.js use), compares it with the existing `exam_versions` row and the subject's
 * own gate, and prints the `set-exam-gate.js` command for each exam that needs one. It does NOT apply gates:
 * gating is a product decision (e.g. whether to hide a live exam from builds below 2.2.0) — see
 * core/app-feature-versions.md. Run those commands yourself after reviewing.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { getPool, closePool } = require('./lib/postgres');
const fv = require('./lib/feature-versions');

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); return i !== -1 ? args[i + 1] : null; };
const has = (n) => args.includes(n);

const env = flag('--env') || 'dev';
const apply = has('--apply');
const bump = has('--bump-updated-at');
const outPath = flag('--out');

if (!['dev', 'prod'].includes(env)) fail('--env must be dev or prod');
if (apply && env === 'prod' && !has('--i-know-this-is-prod')) fail('writing prod needs --i-know-this-is-prod (owner-gated)');

function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

const TYPED = new Set(['fitb', 'fraction', 'steps', 'equation']);
const DECLARABLE_TODAY = new Set(['standard_math', 'scientific_math']);

/**
 * The value to store for a question, and why not when it is null. Mirrors the app's current inference
 * (tools/lib/feature-versions.js resolveKeyboard) restricted to released declarable keyboards.
 */
function desiredFor(q) {
  if (!TYPED.has(q.presentation_id)) return { value: null, why: 'presentation needs no keyboard' };
  const resolved = fv.resolveKeyboard(q.subject_id, q.presentation_id, null);
  if (DECLARABLE_TODAY.has(resolved)) return { value: resolved, why: null };
  if (resolved === 'english') return { value: null, why: 'english keyboard is not declarable (becomes `text`, BLA-58)' };
  return { value: null, why: 'no custom keyboard (system IME; becomes `text`, BLA-58)' };
}

const examKey = (q) => [q.subject_id, q.syllabus_id, q.year_id, q.session].join('|');

async function main() {
  const pool = getPool(env);

  const col = await pool.query(
    `SELECT 1 FROM information_schema.columns WHERE table_name='questions' AND column_name='keyboard_type'`);
  const hasColumn = col.rowCount > 0;
  const tbl = await pool.query(`SELECT to_regclass('public.exam_versions') AS t`);
  const hasExamVersions = tbl.rows[0].t !== null;

  const { rows: questions } = await pool.query(
    `SELECT q.id, q.name, q.subject_id, q.syllabus_id, q.year_id, q.paper_id, p.session,
            q.presentation_id, q.answer, q.question, q.metadata,
            ${hasColumn ? 'q.keyboard_type' : 'NULL::text AS keyboard_type'}
       FROM questions q JOIN papers p ON p.id = q.paper_id
      WHERE NOT q.is_deleted`);

  const examVersions = new Map();
  if (hasExamVersions) {
    const r = await pool.query('SELECT subject_id, syllabus_id, year_id, session, min_app_version FROM exam_versions');
    for (const e of r.rows) examVersions.set([e.subject_id, e.syllabus_id, e.year_id, e.session].join('|'), e.min_app_version);
  }
  const subjectGates = new Map();
  {
    const r = await pool.query('SELECT id, min_app_version FROM subjects');
    for (const s of r.rows) subjectGates.set(s.id, s.min_app_version);
  }

  // ── plan ───────────────────────────────────────────────────────────────
  const toSet = { standard_math: [], scientific_math: [] };
  const conflicts = [];
  const byGroup = new Map(); // subject|paper|presentation -> {set, keep, skip, why}
  const skipReasons = new Map();
  let already = 0;

  for (const q of questions) {
    const { value, why } = desiredFor(q);
    const g = `${q.subject_id}|${q.paper_id}|${q.presentation_id}`;
    const row = byGroup.get(g) || { set: 0, already: 0, skip: 0, conflict: 0, value };
    if (value === null) {
      row.skip += 1;
      skipReasons.set(why, (skipReasons.get(why) || 0) + 1);
    } else if (q.keyboard_type === null || q.keyboard_type === undefined) {
      row.set += 1;
      toSet[value].push(q.id);
    } else if (q.keyboard_type === value) {
      row.already += 1;
      already += 1;
    } else {
      row.conflict += 1;
      conflicts.push({ id: q.id, name: q.name, subject: q.subject_id, paper: q.paper_id, current: q.keyboard_type, desired: value });
    }
    byGroup.set(g, row);
  }

  // ── per-exam derived minimum ───────────────────────────────────────────
  const exams = new Map();
  for (const q of questions) {
    const k = examKey(q);
    const e = exams.get(k) || { subject: q.subject_id, syllabus: q.syllabus_id, year: q.year_id, session: q.session, requires: [], errors: [], questions: 0 };
    e.questions += 1;
    const { value } = desiredFor(q);
    const a = fv.analyzeQuestion({
      subject: q.subject_id, presentation: q.presentation_id, keyboard_type: q.keyboard_type ?? value,
      answer: q.answer, question: q.question, metadata: q.metadata,
    });
    e.requires.push(...a.requires);
    a.errors.forEach((m) => e.errors.push(`${q.name} (${q.paper_id}): ${m}`));
    exams.set(k, e);
  }

  const examRows = [...exams.entries()].map(([k, e]) => {
    const derived = fv.maxVersion(...e.requires.map((r) => r.version));
    const raising = [...new Map(e.requires
      .filter((r) => fv.versionCode(r.version) > fv.versionCode(fv.FLOOR))
      .map((r) => [r.reason, r])).values()];
    return { key: k, ...e, derived, raising, existing: examVersions.get(k) ?? null, subjectGate: subjectGates.get(e.subject) ?? null };
  }).sort((a, b) => a.key.localeCompare(b.key));

  // ── report ─────────────────────────────────────────────────────────────
  const line = '-'.repeat(78);
  console.log(`env: ${env}   questions: ${questions.length}   column keyboard_type: ${hasColumn ? 'present' : 'MISSING'}   exam_versions: ${hasExamVersions ? 'present' : 'MISSING'}`);
  console.log(line);
  console.log('keyboard_type backfill\n');
  console.log(`  would set standard_math:   ${toSet.standard_math.length}`);
  console.log(`  would set scientific_math: ${toSet.scientific_math.length}`);
  console.log(`  already correct:           ${already}`);
  console.log(`  CONFLICTS (never changed): ${conflicts.length}`);
  for (const [why, n] of skipReasons) console.log(`  left NULL (${n}): ${why}`);
  console.log('\n  by subject / paper / presentation (typed ones only):');
  for (const [g, r] of [...byGroup.entries()].sort()) {
    if (r.value === null) continue;
    const [s, p, pr] = g.split('|');
    console.log(`    ${s.padEnd(9)} ${p.padEnd(7)} ${pr.padEnd(6)} -> ${String(r.value).padEnd(15)} set ${String(r.set).padStart(4)}  already ${String(r.already).padStart(4)}${r.conflict ? `  CONFLICT ${r.conflict}` : ''}`);
  }
  if (conflicts.length) {
    console.log('\n  conflicts:');
    for (const c of conflicts.slice(0, 15)) console.log(`    ${c.subject}/${c.paper} ${c.name}: has "${c.current}", inference says "${c.desired}"`);
  }

  console.log(`\n${line}\nexam gates (derived from the rows in ${env}; NOT applied by this tool)\n`);
  let needGate = 0;
  for (const e of examRows) {
    const label = `${e.subject} ${e.year} ${e.session}`;
    const derivedTxt = e.derived;
    const raises = fv.versionCode(e.derived) > fv.versionCode(fv.FLOOR);
    if (!raises && e.existing === null && e.errors.length === 0) continue;
    if (raises) needGate += 1;
    console.log(`  ${label.padEnd(26)} derived ${String(derivedTxt).padEnd(12)} existing gate ${String(e.existing ?? '-').padEnd(7)} subject gate ${e.subjectGate ?? '-'}`);
    for (const r of e.raising.slice(0, 4)) console.log(`      needs ${r.version}: ${r.reason}`);
    if (raises && !fv.isUnreleased(e.derived)) {
      const sg = e.subjectGate;
      if (sg && fv.versionCode(sg) < fv.versionCode(e.derived)) console.log(`      NOTE: subject gate ${sg} is below the exam's ${derivedTxt} — builds in between get this exam but can't answer part of it.`);
      console.log(`      node tools/set-exam-gate.js --env ${env} --subject ${e.subject} --syllabus ${e.syllabus} --year ${e.year} --session ${e.session} --min ${e.derived}`);
    }
    for (const m of e.errors.slice(0, 5)) console.log(`      DEFECT: ${m}`);
  }
  if (needGate === 0) console.log('  no exam needs a gate above the floor.');
  const defects = examRows.reduce((n, e) => n + e.errors.length, 0);
  console.log(`\n  exams: ${examRows.length}   needing a gate: ${needGate}   answer defects found: ${defects}`);

  if (outPath) {
    fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify({
      env, generatedAt: new Date().toISOString(), hasColumn, hasExamVersions,
      counts: { setStandardMath: toSet.standard_math.length, setScientificMath: toSet.scientific_math.length, already, conflicts: conflicts.length },
      conflicts, exams: examRows.map((e) => ({ exam: e.key, questions: e.questions, derived: e.derived, existing: e.existing, subjectGate: e.subjectGate, raising: e.raising, errors: e.errors })),
    }, null, 2));
    console.log(`\n  report written: ${outPath}`);
  }

  if (!apply) {
    console.log(`\nDry run — nothing written. Re-run with --apply to set keyboard_type.${hasColumn ? '' : ' (This env has no keyboard_type column yet — deploy backend V80 first.)'}`);
    return;
  }
  if (!hasColumn) fail(`--apply: ${env} has no questions.keyboard_type column — deploy backend migration V80 there first.`);
  if (conflicts.length) console.log(`\nNote: ${conflicts.length} conflicting row(s) are left untouched.`);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let written = 0;
    for (const [value, ids] of Object.entries(toSet)) {
      for (let i = 0; i < ids.length; i += 500) {
        const chunk = ids.slice(i, i + 500);
        const r = await client.query(
          `UPDATE questions SET keyboard_type = $1${bump ? ', updated_at = now()' : ''}
            WHERE id = ANY($2::uuid[]) AND keyboard_type IS NULL`, [value, chunk]);
        written += r.rowCount;
      }
    }
    await client.query('COMMIT');
    console.log(`\nApplied: set keyboard_type on ${written} question(s)${bump ? ' (updated_at bumped)' : ' (updated_at left alone)'}.`);
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

main().catch((e) => { console.error(e.message); process.exitCode = 1; }).finally(closePool);
