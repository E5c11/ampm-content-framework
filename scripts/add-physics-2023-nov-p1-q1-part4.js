#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2023 — Question 1.10 (order 4)
 * Q1 Matter & Materials MCQ: work function / threshold frequency ratio (Planck's constant).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p1-q1-part4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p1-q1-part4.js --dry-run
 *   node scripts/add-physics-2023-nov-p1-q1-part4.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2023/nov_p1';
const FORMULA_SHEET = {
  type: 'formula_sheet',
  label: 'Formula Sheet',
  image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`],
};

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 1.10',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p1',
  order: 4, // Q1 part 4 of 4: Matter & Materials (photoelectric effect)
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['photoelectric_effect'],
  question_image_urls: [`${PAPER}/q1/question_7.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 2,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'The threshold frequency of metal X is twice the threshold frequency of metal Y. Which ONE of the following correctly compares their work functions, W₀(X) and W₀(Y)?',
    metadata: ['W₀(X) = ½W₀(Y)', 'W₀(X) = 4W₀(Y)', 'W₀(X) = W₀(Y)', 'W₀(X) = 2W₀(Y)', ''],
    answer: ['W₀(X) = 2W₀(Y)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['work_function', 'threshold_frequency'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The work function and the threshold frequency are linked by W₀ = hf₀.\n- h is a constant, so think about how W₀ scales when f₀ scales.',
  },
  {
    name: 'Question 2',
    question:
      'The threshold frequency of a metal is 1.2 × 10¹⁵ Hz. Calculate the work function of the metal.',
    metadata: ['W₀ = ', '[ ]', ' × 10⁻¹⁹ J'],
    answer: ['7.96|7.956', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['work_function', 'threshold_frequency', 'photon_energy_calculation'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Use W₀ = hf₀, with Planck’s constant from the data sheet.\n- Give the coefficient that goes in front of × 10⁻¹⁹ J.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.10',
      marks: 2,
      clues: '- Write the equation that links the work function to the threshold frequency.\n- Rearrange it to find what W₀/f₀ equals.',
      approach: '- Recall W₀ = hf₀ from the data sheet.\n- Divide both sides by f₀ to get the ratio W₀/f₀.\n- Match the result to the options.',
      solution: '1. The work function is the minimum photon energy needed to eject an electron, which corresponds to the threshold frequency: W₀ = hf₀.\n2. Dividing both sides by f₀: W₀/f₀ = h.\n3. h is Planck’s constant, so the ratio is Planck’s constant — not its inverse (B).\n4. The photon energy (C) and Eₖ(max) (D) depend on the incident light, not just on the metal.\n5. Answer: A — Planck’s constant.',
    },
  ],
  model: 'claude-opus-5-5',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
};

// ─── Upload ──────────────────────────────────────────────────────────────────

async function preflightReferenceIds(pool) {
  const used = referenceIdsUsed(video, questions);
  const missing = [];
  for (const [table, ids] of Object.entries(used)) {
    if (ids.length === 0) continue;
    const { rows } = await pool.query(`SELECT id FROM ${table} WHERE id = ANY($1)`, [ids]);
    const present = new Set(rows.map((r) => r.id));
    for (const id of ids) if (!present.has(id)) missing.push({ table, id });
  }
  if (missing.length > 0) {
    console.error('\n❌ Missing reference rows (create them before uploading — PIPE-08):');
    for (const m of missing) console.error(`   ${m.table}: ${m.id}`);
    process.exit(1);
  }
}

async function upload() {
  const { lessonId, rows } = buildContentRows(video, questions, aiExplanation);
  const pool = getPool(ENV);

  if (!DRY_RUN) await preflightReferenceIds(pool);

  const byTable = {};
  for (const spec of rows) {
    await upsertRow(spec, spec.row, { dryRun: DRY_RUN, env: ENV });
    byTable[spec.table] = (byTable[spec.table] ?? 0) + 1;
  }

  console.log(`\n${DRY_RUN ? '[dry-run] ' : ''}✅ lesson ${lessonId} (${ENV})`);
  for (const [t, n] of Object.entries(byTable)) console.log(`   ${t}: ${n}`);
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
