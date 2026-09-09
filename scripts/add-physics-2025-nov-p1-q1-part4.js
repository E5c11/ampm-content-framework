#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 1, Part 4 (order 4)
 * MCQ item 1.10 — Matter & Materials (the photoelectric effect: threshold frequency,
 * maximum kinetic energy).
 *
 * See subjects/dbe-physics.md's "Paper structure / video mapping". This is Part 4 of
 * 4 — a single-item part, same reasoning as Part 2: minor knowledge-area weighting on
 * this paper's MCQ block, fuller treatment later as its own long-form question.
 * Question 2 is the first practical use of the scientific-notation fitb pattern
 * DESIGN-PHYS-01 (subjects/dbe-physics.md) flagged as an open item — the exponent is a
 * static metadata label, not part of the matched numeric answer.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q1-part4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q1-part4.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q1-part4.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p1';

const video = {
  name: 'Question 1.10',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['photoelectric_effect'],
  question_image_urls: [`${PAPER}/q1/question_5.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 2,
  supplementary_materials: [
    {
      type: 'formula_sheet',
      label: 'Formula Sheet',
      image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`],
    },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question:
      'A metal surface has a threshold frequency of f₀. Light of frequency f, where f < f₀, is shone on the metal surface. Select ALL the statements below that are correct.',
    metadata: [
      'No photoelectrons are emitted from the surface.',
      'Increasing the intensity of the light will cause photoelectrons to be emitted.',
      'Increasing the frequency of the light to a value above f₀ would cause photoelectrons to be emitted.',
      'The photoelectrons, if emitted, would have a maximum kinetic energy of zero.',
      'The threshold frequency, f₀, depends only on the type of metal used.',
    ],
    answer: [
      'No photoelectrons are emitted from the surface.',
      'Increasing the frequency of the light to a value above f₀ would cause photoelectrons to be emitted.',
      'The threshold frequency, f₀, depends only on the type of metal used.',
      '', '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'matter_materials',
    topic: 'optical_phenomena',
    subtopic: 'photoelectric_effect_threshold',
    skills: ['photoelectric_effect', 'threshold_frequency', 'work_function'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Compare the light’s frequency to the threshold frequency f₀ for this metal.\n- Below f₀, no photoelectrons are emitted no matter how intense the light is — intensity only affects the rate of emission once emission is already possible, not whether it happens at all.',
  },
  {
    name: 'Question 2',
    question: 'Light of frequency 7 × 10¹⁴ Hz is incident on a metal with a work function of 3.0 × 10⁻¹⁹ J. Calculate the maximum kinetic energy of the emitted photoelectrons.',
    metadata: ['E_k(max) = ', '[ ]', ' × 10⁻¹⁹ J'],
    answer: ['1.64', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'matter_materials',
    topic: 'optical_phenomena',
    subtopic: 'photoelectric_effect_threshold',
    skills: ['photoelectric_effect', 'work_function'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Use E_k(max) = hf − W₀.\n- Calculate hf first (h = 6.63 × 10⁻³⁴ J·s), then subtract the work function — keep the powers of ten consistent.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.10',
      marks: 2,
      clues: '- Start from E_k(max) = hf − W₀ and substitute f = c/λ to get E_k(max) in terms of 1/λ.\n- Identify the gradient and the intercepts of this straight-line equation, then match them to the graph shapes.',
      approach: '- Combine E_k(max) = hf − W₀ with c = fλ to express E_k(max) as a function of 1/λ.\n- Recognise this as a straight-line equation y = mx + c, and identify the gradient and y-intercept.\n- Note that the graph must have a positive x-intercept (below the threshold frequency, no electrons are emitted).',
      solution: '1. E_k(max) = hf − W₀\n2. f = c/λ, so E_k(max) = hc(1/λ) − W₀\n3. This is a straight line with a positive gradient (hc) and a negative y-intercept (−W₀).\n4. It therefore has a positive x-intercept (where E_k(max) = 0, corresponding to the threshold frequency).\n5. Graph C shows a straight line with positive gradient crossing the x-axis at a positive value of 1/λ, not passing through the origin.\n6. The correct answer is C.',
    },
  ],
  model: 'claude-sonnet-5',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
};

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
