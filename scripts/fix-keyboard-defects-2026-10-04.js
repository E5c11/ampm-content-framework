#!/usr/bin/env node
/**
 * One-off content fix — 12 live questions whose stored answer cannot be typed on the keyboard they resolve
 * to (KEYBOARD-01), found by `node tools/backfill-keyboard-types.js` on 2026-10-04 (dev and prod identical;
 * same row IDs in both). See core/app-feature-versions.md "Findings from the database-wide run".
 *
 *   node scripts/fix-keyboard-defects-2026-10-04.js --env dev               # dry run: shows before/after
 *   node scripts/fix-keyboard-defects-2026-10-04.js --env dev --apply
 *   node scripts/fix-keyboard-defects-2026-10-04.js --env prod --apply --i-know-this-is-prod
 *
 * Needs the Cloud SQL Auth Proxy (tools/README.md). Every row is checked before it is touched (it must
 * exist and still start with the expected text, so the script refuses to guess on drifted content), each new
 * row is run through the SAME analysis the validator uses, and nothing is written unless every row passes.
 * `updated_at` is bumped on every changed row: clients delta-sync on it, so without that the corrected
 * question would never reach a device that already has the old one (VER-04).
 *
 * WHAT CHANGES
 *   Maths 2019 Nov  P1 Q2, P1 Q3, P2 Q3 : fitb with a slash-fraction answer ("144/5") -> `fraction`
 *       presentation (SCHEMA-TYPE-05): numerator/denominator boxes, metadata [], "simplest form" instruction.
 *       Units/labels that lived in fitb metadata move into the question text (fraction ignores metadata).
 *   Maths 2019 Nov  P2 Q1 : "Express QR in terms of x" (answer `x`; the number pad has no letters) -> a numeric
 *       question (PQ = 14 cm, calculate QR = 7 cm) per KEYBOARD-02. Works on every build, no gate.
 *   English HL 2021/2022/2024 Nov P1 (7 questions) : the stored answer ends in "." which the English keyboard
 *       cannot type and marking does not strip -> trailing full stop removed from every accepted alternative.
 *       2021 Q4 also contains the digits "2015": the year becomes given text and the blank covers only the
 *       part the student changes.
 *   Physics 2025 Nov P1 Q3 (steps) : the answer `-3` needs the ScientificMath minus fixed in 2.2.0 -> the step
 *       asks for |pᵢ| = 3, so no build below 2.2.0 can mis-mark it and the exam needs no gate.
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const fv = require('../tools/lib/feature-versions');

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); return i !== -1 ? args[i + 1] : null; };
const env = flag('--env') || 'dev';
const apply = args.includes('--apply');
if (!['dev', 'prod'].includes(env)) bail('--env must be dev or prod');
if (apply && env === 'prod' && !args.includes('--i-know-this-is-prod')) bail('writing prod needs --i-know-this-is-prod');

function bail(msg) { console.error(`error: ${msg}`); process.exit(1); }

const stripFullStop = (alt) => alt.replace(/\.$/, '');
const stripAnswerFullStops = (answer) => answer.map((a) => (a ? a.split('|').map(stripFullStop).join('|') : a));
const fraction = (num, den) => [num, den, '', '', ''];

/** id -> { label, expect(row) -> bool, change(row) -> partial new fields }. */
const FIXES = [
  // ── Maths 2019: slash fractions -> fraction presentation ───────────────────────────────────────────
  {
    id: 'bcb375f4-a22d-5699-952a-406ec635653e', label: 'maths 2019 nov P1 Q2 (S12 = 144/5)',
    expect: (r) => r.presentation_id === 'fitb' && r.answer[0] === '144/5' && r.question.startsWith('An arithmetic series has first term a = 1/5'),
    change: (r) => ({
      presentation_id: 'fraction', metadata: [], answer: fraction('144', '5'),
      question: `${r.question} Give your answer as a fraction in its simplest form.`,
    }),
  },
  {
    id: 'd753527f-4af4-5be6-b03e-f54d2c0c663f', label: 'maths 2019 nov P1 Q3 (63/10 km)',
    expect: (r) => r.presentation_id === 'fitb' && r.answer[0] === '63/10' && r.question.endsWith('Leave your answer as a fraction.'),
    change: (r) => ({
      presentation_id: 'fraction', metadata: [], answer: fraction('63', '10'),
      question: r.question.replace(/Leave your answer as a fraction\.$/, 'Leave your answer as a fraction in its simplest form.'),
    }),
  },
  {
    id: 'b88a65cb-2f9a-586e-94c4-1662421ee88b', label: 'maths 2019 nov P2 Q3 (gradient -4/3)',
    expect: (r) => r.presentation_id === 'fitb' && r.answer[0] === '-4/3' && r.question.startsWith('A circle has equation (x + 1)²'),
    change: (r) => ({
      presentation_id: 'fraction', metadata: [], answer: fraction('-4', '3'),
      question: `${r.question} Give your answer as a fraction in its simplest form.`,
    }),
  },
  // ── Maths 2019: "in terms of x" -> numeric ─────────────────────────────────────────────────────────
  {
    id: 'fc3120ea-9c07-524d-8af7-d0f897742959', label: 'maths 2019 nov P2 Q1 (QR in terms of x -> 7 cm)',
    expect: (r) => r.presentation_id === 'fitb' && r.answer[0] === 'x' && r.question.includes('PQ = 2x'),
    change: (r) => ({
      question: 'In right-angled triangle PQR, the right angle is at R. PQ = 14 cm and angle QPR = 30°. Calculate the length of QR.',
      metadata: ['QR = ', '[ ]', ' cm'], answer: ['7', '', '', '', ''],
      clues: r.clues.replace('PQ = 2x', 'PQ = 14'),
    }),
  },
  // ── English HL: trailing full stop removed ────────────────────────────────────────────────────────
  ...[
    ['401a9712-acdf-5f8a-a7bb-95ac41d28d5f', 'english 2021 nov P1 Q2', 'The negative mental health effects'],
    ['bfe7b1e5-d226-5b9f-a3a4-67cad6b07bad', 'english 2021 nov P1 Q7', 'The number of young people who report'],
    ['5adcf0ba-86c2-5eb8-a855-78184a97197b', 'english 2022 nov P1 Q1', 'are given the motivation'],
    ['a5c9e638-c755-597d-a88b-8af6a29e9d80', 'english 2022 nov P1 Q3', 'prepare her speech thoroughly'],
    ['703b67fb-4935-5c25-bde3-fc230b317743', 'english 2024 nov P1 Q4 (reported speech)', 'that she would love what he had planned'],
    ['078758ea-2cdc-5abd-a501-0b94a30dd1e7', 'english 2024 nov P1 Q4 (passive)', 'Your understanding of different cultures'],
  ].map(([id, label, startsWith]) => ({
    id, label,
    expect: (r) => r.presentation_id === 'fitb' && r.answer[0].startsWith(startsWith) && /\.(\||$)/.test(r.answer[0]),
    change: (r) => ({ answer: stripAnswerFullStops(r.answer) }),
  })),
  {
    id: 'ea0a4d86-b31d-5903-8233-1dc48c2530a8', label: 'english 2021 nov P1 Q4 (year becomes given text)',
    expect: (r) => r.presentation_id === 'fitb' && r.answer[0].includes('since 2015') && r.metadata.length === 1,
    change: () => ({
      question: 'Complete the sentence correctly, fixing the tense error.',
      metadata: ['Studies show that the number of teenagers suffering from anxiety ', '[ ]', ' since 2015.'],
      answer: ['has increased significantly', '', '', '', ''],
    }),
  },
  // ── Physics: negative answer -> magnitude ─────────────────────────────────────────────────────────
  {
    id: 'c2e5b308-c4ec-5420-957d-50b0520826bb', label: 'physics 2025 nov P1 Q3 (pi = -3 -> |pi| = 3)',
    expect: (r) => r.presentation_id === 'steps' && r.answer[0] === '-3' && r.answer[1] === '15' && r.metadata[1].includes('so pᵢ (in kg·m·s⁻¹):'),
    change: (r) => {
      const metadata = [...r.metadata];
      metadata[1] = metadata[1].replace('so pᵢ (in kg·m·s⁻¹):', 'so |pᵢ| (in kg·m·s⁻¹):');
      return {
        metadata, answer: ['3', '15'],
        clues: r.clues.replace('- Solve for pᵢ, then divide by mass to get vᵢ.', '- Solve for pᵢ, take its magnitude |pᵢ|, then divide by mass to get vᵢ.'),
      };
    },
  },
];

const ARRAY_RULES = {
  fixedAnswer5: new Set(['fitb', 'fraction', 'multiple_choice', 'multi_select', 'equation']),
};

function checkNewRow(row) {
  const problems = [];
  if (ARRAY_RULES.fixedAnswer5.has(row.presentation_id) && row.answer.length !== 5) problems.push(`answer must have 5 elements (has ${row.answer.length})`);
  if (row.presentation_id === 'fraction') {
    if (row.metadata.length !== 0) problems.push('fraction metadata must be []');
    if (!row.answer[0] || !row.answer[1]) problems.push('fraction needs numerator and denominator');
  }
  if (row.presentation_id === 'fitb' || row.presentation_id === 'steps') {
    const blanks = row.metadata.filter((m) => m === '[ ]').length;
    if (blanks === 0) problems.push('no "[ ]" blank token in metadata');
    if (row.presentation_id === 'steps' && row.answer.filter(Boolean).length !== blanks) problems.push('steps: answer count differs from blank count');
  }
  const a = fv.analyzeQuestion({
    subject: row.subject_id, presentation: row.presentation_id, keyboard_type: row.keyboard_type ?? null,
    answer: row.answer, question: row.question, metadata: row.metadata,
  });
  problems.push(...a.errors);
  return problems;
}

const show = (v) => JSON.stringify(v);

async function main() {
  const pool = getPool(env);
  const ids = FIXES.map((f) => f.id);
  const { rows } = await pool.query(
    `SELECT id, subject_id, year_id, paper_id, name, presentation_id, question, metadata, answer, clues,
            ${await hasCol(pool) ? 'keyboard_type' : 'NULL::text AS keyboard_type'}
       FROM questions WHERE id = ANY($1::uuid[]) AND NOT is_deleted`, [ids]);
  const byId = new Map(rows.map((r) => [r.id, r]));

  const plan = [];
  let bad = 0;
  for (const f of FIXES) {
    const r = byId.get(f.id);
    if (!r) { console.error(`✗ ${f.label}: row ${f.id} not found in ${env}`); bad++; continue; }
    if (!f.expect(r)) { console.error(`✗ ${f.label}: row no longer matches what this script was written for (already fixed, or content drifted) — refusing to touch it`); bad++; continue; }
    const next = { ...r, ...f.change(r) };
    const problems = checkNewRow(next);
    if (problems.length) { console.error(`✗ ${f.label}: the corrected row would still be invalid:\n    ${problems.join('\n    ')}`); bad++; continue; }
    plan.push({ f, before: r, after: next });
  }

  for (const { f, before, after } of plan) {
    console.log(`\n✓ ${f.label}`);
    for (const k of ['presentation_id', 'question', 'metadata', 'answer', 'clues']) {
      if (show(before[k]) !== show(after[k])) {
        console.log(`    ${k}:\n      - ${show(before[k])}\n      + ${show(after[k])}`);
      }
    }
  }
  console.log(`\n${plan.length}/${FIXES.length} rows ready, ${bad} problem(s).`);
  if (bad > 0) { process.exitCode = 1; console.log('Nothing written.'); return; }
  if (!apply) { console.log('Dry run — nothing written. Re-run with --apply.'); return; }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const { after } of plan) {
      await client.query(
        `UPDATE questions SET presentation_id=$2, question=$3, metadata=$4, answer=$5, clues=$6, updated_at=now() WHERE id=$1`,
        [after.id, after.presentation_id, after.question, after.metadata, after.answer, after.clues]);
    }
    await client.query('COMMIT');
    console.log(`Applied to ${env}: ${plan.length} questions updated (updated_at bumped).`);
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

async function hasCol(pool) {
  const r = await pool.query(`SELECT 1 FROM information_schema.columns WHERE table_name='questions' AND column_name='keyboard_type'`);
  return r.rowCount > 0;
}

main().catch((e) => { console.error(e.message); process.exitCode = 1; }).finally(closePool);
