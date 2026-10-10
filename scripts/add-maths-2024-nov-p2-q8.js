#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2024 — Question 8 (order 8)
 * Trigonometry — two- and three-dimensional problems: angle of elevation, cosine rule leading to a quadratic, right-angled triangles.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p2-q8.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2024-nov-p2-q8.js --dry-run
 *   node scripts/add-maths-2024-nov-p2-q8.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2024/nov_p2';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 8',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p2',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['3d_trigonometry', 'cosine_rule', 'right_angle_triangle'],
  question_image_urls: [`${IMG}/q8/question_1.png`],
  memo_image_urls: [`${IMG}/q8/memo_1.png`, `${IMG}/q8/memo_2.png`],
  exam_question_marks: 9,
  supplementary_materials: [
    {
      type: 'formula_sheet',
      label: 'Formula Sheet',
      image_urls: [`${IMG}/q0/question_1.png`],
    },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'A vertical mast PQ is 24 m high, with Q at its foot. From a point R on level ground, the angle of elevation of P is 38°. Calculate QR, correct to TWO decimal places.',
    metadata: ['QR = ', '[ ]', ' m'],
    answer: ['30.72', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'application',
    unit: 'trigonometry',
    topic: '3d_trig',
    subtopic: 'trig_ratios',
    skills: ['trig_ratios_in_right_triangle', 'rounding'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- In right-angled △PQR, PQ is opposite the 38° angle and QR is adjacent to it.\n- Use the tangent ratio and make QR the subject.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q8_1/diagram_1.png'],
    },
  },
  {
    name: 'Question 2',
    question: 'Complete the working to calculate the length of LM.',
    metadata: [
      'In △KLM, KL = 13, KM = 7, LM = x and KM̂L = 60°',
      'KL² = KM² + LM² − 2(KM)(LM)cos M̂',
      '13² = 7² + x² − 2(7)(x)cos 60°',
      '169 = 49 + x² − 7x, so x² − 7x − 120 = 0',
      '(x − 15)(x + 8) = 0, and a length is positive, so LM is:',
      '[ ]',
    ],
    answer: ['15'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: '3d_trig',
    subtopic: 'cosine_rule',
    skills: ['cosine_rule', 'solving_quadratic', 'solution_validation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Choose the root of the quadratic that can be a length.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q8_2/diagram_1.png'],
    },
  },
  {
    name: 'Question 3',
    question: 'In △KMN, N̂ = 90°, MN = 9 m and MK̂N = 52°. Which expression gives the length of KN?',
    metadata: ['KN = 9 tan 52°', 'KN = \\frac{9}{tan 52°}', 'KN = 9 sin 52°', 'KN = \\frac{9}{cos 52°}', ''],
    answer: ['KN = \\frac{9}{tan 52°}', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'trigonometry',
    topic: '3d_trig',
    subtopic: 'trig_ratios',
    skills: ['trig_ratios_in_right_triangle', 'finding_unknown_side'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Seen from the 52° angle at K, MN is the opposite side and KN is the adjacent side.\n- Write the tangent ratio, then make KN the subject.',
  },
  {
    name: 'Question 4',
    question: 'GH is a vertical pole 18 m high, with H on level ground. K is a point on GH. From point L on the ground, 14 m from H, the angle of elevation of K is 25°. Calculate GK, correct to TWO decimal places.',
    metadata: ['GK = ', '[ ]', ' m'],
    answer: ['11.47', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'application',
    unit: 'trigonometry',
    topic: '3d_trig',
    subtopic: 'trig_ratios',
    skills: ['trig_ratios_in_right_triangle', 'finding_unknown_side', 'rounding'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Find KH first, using the tangent ratio in right-angled △KHL.\n- GK is the part of the pole above K.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q8_4/diagram_1.png'],
    },
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '8.1',
      marks: 2,
      clues: '- △DCA is right-angled at C, with the 46.85° angle at A.\n- DC is opposite that angle and AC is adjacent to it.',
      approach: '- tan DÂC = DC ÷ AC.\n- Make AC the subject and substitute DC = 16.',
      solution: '1. tan 46.85° = 16 ÷ AC\n2. AC = 16 ÷ tan 46.85°\n3. ∴ AC = 15 m',
    },
    {
      number: '8.2',
      marks: 7,
      clues: '- Use the cosine rule in △ABC with AB = 19, AC = 15 and the 105.61° angle at C to find BC.\n- Then use △EBC, right-angled at C, to find EC, and subtract from DC.',
      approach: '- Let BC = x: 19² = x² + 15² − 2(x)(15)cos 105.61°, which gives a quadratic in x.\n- BÊC = 180° − 122° = 58° (angles on a straight line).\n- tan 58° = BC ÷ EC gives EC, and DE = 16 − EC.',
      solution: '1. 361 = x² + 225 − 30x cos 105.61°\n2. x² + 8.07x − 136 = 0\n3. x = 8.30 m (the negative root is rejected), so BC = 8.30 m\n4. BÊC = 58°\n5. EC = 8.3 ÷ tan 58° = 5.19 m\n6. ∴ DE = 16 − 5.19 = 10.81 m',
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
