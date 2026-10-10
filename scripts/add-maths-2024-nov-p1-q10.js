#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2024 — Question 10 (order 10)
 * Rates of change: maximum speed, distance from a speed function.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p1-q10.js --curriculum temp/curriculum-vocab-maths.json
 *   node scripts/add-maths-2024-nov-p1-q10.js --dry-run
 *   node scripts/add-maths-2024-nov-p1-q10.js
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
  name: 'Question 10',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p1',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['derivative_applications', 'maximum_value', 'rates_of_change'],
  question_image_urls: [`${IMG}/q10/question_1.png`],
  memo_image_urls: [`${IMG}/q10/memo_1.png`],
  exam_question_marks: 8,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: "A boat travels from harbour A to harbour B. Its speed, in km/h, t hours after leaving A is given by s'(t) = −4t² + 24t. Calculate the maximum speed of the boat.",
    metadata: ['Maximum speed = ', '[ ]', ' km/h'],
    answer: ['36', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'application',
    unit: 'calculus',
    topic: 'cubic_analysis',
    subtopic: 'maximum_value',
    skills: ['setting_derivative_to_zero', 'evaluating_derivatives'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: "- The speed is greatest where its own rate of change, s''(t), is zero.\n- Substitute that value of t back into the speed function.",
  },
  {
    name: 'Question 2',
    question: "A ferry's speed, in km/h, t hours after leaving port is s'(t) = −6t² + 36t, where s(t) = at³ + bt² is the distance travelled in km. The ferry stops when it reaches the next port. Complete the working to find the distance between the two ports.",
    metadata: [
      'The speed is 0 when −6t(t − 6) = 0, so the ferry stops at t = 6',
      "s(t) = at³ + bt², so s'(t) = 3at² + 2bt",
      '3a = −6 and 2b = 36, so a:',
      '[ ]',
      'and b:',
      '[ ]',
      'Distance = s(6), in km:',
      '[ ]',
    ],
    answer: ['-2', '18', '216'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'application',
    unit: 'calculus',
    topic: 'rates_of_change',
    subtopic: 'motion',
    skills: ['differentiation_rules', 'evaluating_at_point'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- The ferry stops when its speed is zero.\n- Match the coefficients of the derivative of at³ + bt² with the given speed function.',
  },
  {
    name: 'Question 3',
    question: "If s'(t) gives the speed of a moving object at time t, what does s''(t) represent?",
    metadata: [
      'The total distance travelled',
      'The speed at time t',
      'The rate of change of the speed',
      'The time when the object stops',
      '',
    ],
    answer: ['The rate of change of the speed', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'calculus',
    topic: 'rates_of_change',
    subtopic: 'motion',
    skills: ['derivative_as_gradient'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Each derivative measures how fast the function before it is changing.',
  },
  {
    name: 'Question 4',
    question: "The speed, in km/h, of a train t hours after leaving a station is s'(t) = −2t² + 16t. At what time, while the train is still speeding up, is its speed 30 km/h?",
    metadata: ['t = ', '[ ]', ' hours'],
    answer: ['3', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'application',
    unit: 'calculus',
    topic: 'rates_of_change',
    subtopic: 'motion',
    skills: ['solving_quadratic', 'solution_validation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Set the speed equal to 30 and solve the quadratic equation.\n- The train speeds up only until it reaches its maximum speed, so choose the solution before that time.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '10.1',
      marks: 3,
      clues: '- The maximum speed occurs where the derivative of the speed, s″(t), is zero.',
      approach: '- s″(t) = −6t + 18.\n- Set s″(t) = 0 to get t = 3.\n- Substitute t = 3 into s′(t).',
      solution: '1. s″(t) = −6t + 18 = 0\n2. t = 3\n3. s′(3) = −3(3)² + 18(3) = 27\n4. Maximum speed = 27 km/h',
    },
    {
      number: '10.2',
      marks: 5,
      clues: '- The cyclist stops when the speed is zero.\n- Find s(t) by working back from s′(t), then evaluate it at the stopping time.',
      approach: '- −3t² + 18t = 0 gives t = 0 or t = 6.\n- Let s(t) = at³ + bt², so 3a = −3 and 2b = 18.\n- Evaluate s(6).',
      solution: '1. −3t(t − 6) = 0, so t = 0 or t = 6\n2. s(t) = at³ + bt², so s′(t) = 3at² + 2bt\n3. 3a = −3, so a = −1; 2b = 18, so b = 9\n4. s(t) = −t³ + 9t²\n5. s(6) = −216 + 324 = 108 km',
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
