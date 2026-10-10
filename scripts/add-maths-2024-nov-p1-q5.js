#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2024 — Question 5 (order 5)
 * Hyperbola: p and q from the domain and line of symmetry, finding a, f(x) >= 0, transformation with a negative derivative.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p1-q5.js --curriculum temp/curriculum-vocab-maths.json
 *   node scripts/add-maths-2024-nov-p1-q5.js --dry-run
 *   node scripts/add-maths-2024-nov-p1-q5.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2024/nov_p1';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 5',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p1',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['hyperbola', 'asymptote', 'transformations', 'inequality'],
  question_image_urls: [`${IMG}/q5/question_1.png`],
  memo_image_urls: [`${IMG}/q5/memo_1.png`],
  exam_question_marks: 10,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'The graph of f(x) = \\frac{a}{x + p} + q has a vertical asymptote at x = −2, and y = x + 5 is a line of symmetry of f. These steps find the horizontal asymptote of f but are in the wrong order. Arrange them in the correct order.',
    metadata: [
      'y = −2 + 5 = 3',
      'The asymptotes intersect on the line of symmetry',
      'The horizontal asymptote is y = 3, so q = 3',
      'Substitute x = −2 into y = x + 5',
    ],
    answer: [
      'The asymptotes intersect on the line of symmetry',
      'Substitute x = −2 into y = x + 5',
      'y = −2 + 5 = 3',
      'The horizontal asymptote is y = 3, so q = 3',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'hyperbola',
    subtopic: 'finding_equation',
    skills: ['axis_of_symmetry', 'asymptote_gives_p'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- The lines of symmetry of a hyperbola pass through the point where its two asymptotes cross.',
  },
  {
    name: 'Question 2',
    question: 'The graph of h(x) = \\frac{a}{x − 1} + 4 passes through the point (3 ; 7). Calculate the value of a.',
    metadata: ['a = ', '[ ]'],
    answer: ['6', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'hyperbola',
    subtopic: 'finding_equation',
    skills: ['substituting_known_point'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Substitute the coordinates of the point into the equation and solve for a.',
  },
  {
    name: 'Question 3',
    question: 'Given f(x) = −\\frac{4}{x + 2} + 3. For which values of x is f(x) ≥ 0?',
    metadata: [
      'x ≤ −2 or x ≥ −\\frac{2}{3}',
      'x < −2 or x ≥ −\\frac{2}{3}',
      '−2 < x ≤ −\\frac{2}{3}',
      'x < −2 or x > −\\frac{2}{3}',
      '',
    ],
    answer: ['x < −2 or x ≥ −\\frac{2}{3}', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'hyperbola',
    subtopic: 'graph_interpretation',
    skills: ['critical_values', 'inequality_sign_analysis'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Find the x-intercept of f, and remember that f is undefined at its vertical asymptote.\n- Use the shape of each branch to decide where the graph lies on or above the x-axis.',
  },
  {
    name: 'Question 4',
    question: "The graph of g(x) = \\frac{2}{x − 3} + 1 is transformed to a graph h that has the same domain and range as g, but h'(x) > 0 for every x in its domain. Which transformation could produce h?",
    metadata: [
      'Translate g 3 units to the left',
      'Reflect g about the line y = x',
      'Reflect g in the y-axis',
      'Reflect g about the line x = 3',
      '',
    ],
    answer: ['Reflect g about the line x = 3', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'functions_graphs',
    topic: 'hyperbola',
    subtopic: 'transformations',
    skills: ['effect_of_coefficient', 'derivative_as_gradient'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- The domain and range are fixed by the asymptotes, so both asymptotes must stay where they are.\n- A positive derivative means the new graph increases on each branch.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '5.1',
      marks: 1,
      clues: '- The x-value left out of the domain is the vertical asymptote.',
      approach: '- The domain excludes x = 1, so the vertical asymptote is x = 1.\n- The denominator x + p is zero at x = 1.',
      solution: '1. Vertical asymptote: x = 1\n2. x + p = 0 when x = 1, so p = −1',
    },
    {
      number: '5.2',
      marks: 2,
      clues: '- The asymptotes of a hyperbola intersect on each of its lines of symmetry.',
      approach: '- Substitute x = 1 into g(x) = x − 3.\n- The y-value you get is the horizontal asymptote.',
      solution: '1. y = 1 − 3\n2. y = −2\n3. Horizontal asymptote: y = −2',
    },
    {
      number: '5.3',
      marks: 2,
      clues: '- Use the y-intercept (0 ; 1) together with p = −1 and q = −2.',
      approach: '- Substitute x = 0 and y = 1 into f(x) = a/(x − 1) − 2.\n- Solve for a.',
      solution: '1. 1 = a/(0 − 1) − 2\n2. 3 = a/(−1)\n3. a = −3',
    },
    {
      number: '5.4',
      marks: 3,
      clues: '- Find the x-intercept of f.\n- Read from the graph where f lies on or above the x-axis, remembering the asymptote x = 1.',
      approach: '- Solve −3/(x − 1) − 2 = 0 to get x = −1/2.\n- The right-hand branch lies below the x-axis.\n- The left-hand branch is on or above the x-axis from x = −1/2 up to the asymptote x = 1.',
      solution: '1. −3/(x − 1) − 2 = 0\n2. −3 = 2x − 2, so x = −1/2\n3. f(x) ≥ 0 for −1/2 ≤ x < 1, or x ∈ [−1/2 ; 1)',
    },
    {
      number: '5.5',
      marks: 2,
      clues: '- Both asymptotes must stay in the same place, so the domain and range do not change.\n- f is increasing, so h must be decreasing.',
      approach: '- A reflection about x = 1 or about y = −2 keeps both asymptotes and reverses the direction of the graph.\n- Combined moves also work: reflect in the y-axis then translate 2 units right, or reflect in the x-axis then translate 4 units down.',
      solution: '1. f is reflected about the line x = 1.\n2. Other accepted answers: a reflection about y = −2; a reflection in the y-axis followed by a translation 2 units to the right; a reflection in the x-axis followed by a translation 4 units down.',
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
    console.error(
      '\n   curriculum_nodes / skills → node tools/create-curriculum-node.js | create-skill.js' +
      '\n   tags → node tools/create-tag.js',
    );
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

  // Exam gate (VER-02/VER-04, tools/apply-exam-gate.js): derive the exam's minimum app version from the rows now in the
  // database and write it to exam_versions, bumping updated_at on the exam's rows. Dev only; a no-op when the derived
  // minimum is the floor (VER-07); idempotent. The gate is per EXAM, so it also gates the sibling papers.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
}

// Only run when invoked directly — so validate-questions.js (and anything else) can load
// this file for its data blocks without opening a DB connection or writing anything.
if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
