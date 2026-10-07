#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2025 — Question 3.1 (order 11)
 * Map skills and calculations: height difference, saddle, average gradient (VI/HE ratio), matching gradient to a profile sketch, intervisibility. Practice teaches the technique with invented values (no map sheet).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p1-q3-1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p1-q3-1.js --dry-run
 *   node scripts/add-geography-2025-nov-p1-q3-1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 data — the lesson/video document ────────────────────────────────
// Full field template: subject profile + core/upload-pipeline.md reference tables.

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/geography/2025/nov_p1';

const video = {
  name: 'Question 3.1',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p1',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['map_skills', 'gradient', 'intervisibility'],
  question_image_urls: [`${IMG}/q11/question_1.png`, `${IMG}/q11/question_2.png`],
  memo_image_urls: [`${IMG}/q11/memo_1.png`],
  exam_question_marks: 10,
  supplementary_materials: [],
};

// ─── Phase 3 data — the practice questions ───────────────────────────────────
// Per core/question-schema.md + presentations/{type}.md. Logical/authored shape
// (presentation, type, order, unit/topic/subtopic, skills, …) — the mapping to
// Postgres columns is tools/lib/content-rows.js's job.

const questions = [
  {
    name: 'Question 1',
    question: 'Trigonometrical station P is marked 1482,3 m above sea level on a topographic map and trigonometrical station Q is marked 1205,8 m. Calculate the difference in height between the two stations.',
    metadata: ['Difference in height = ', '[ ]', ' m'],
    answer: ['276.5', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'gradient_height_and_intervisibility',
    skills: ['height_difference_calc'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    keyboard_type: 'standard_math',
    clues: '- Both heights are measured from the same datum, so the difference is a subtraction.\n- Subtract the lower height from the higher one and keep the decimal place.',
  },
  {
    name: 'Question 2',
    question: 'Two points on a 1 : 10 000 orthophoto map are 2,8 cm apart. The vertical interval between them is 45 m. Calculate the average gradient as 1 : x, giving x to two decimal places (Gradient = vertical interval ÷ horizontal equivalent).',
    metadata: ['[ ]', ' : ', '[ ]'],
    answer: ['1', '6.22', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'gradient_height_and_intervisibility',
    skills: ['gradient_calculation'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    keyboard_type: 'standard_math',
    clues: '- Convert the measured map distance to a real distance first: on a 1 : 10 000 map 1 cm stands for 100 m.\n- Divide the horizontal equivalent by the vertical interval to get the second number of the ratio.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL the gradients that are steeper than 1 : 10.',
    metadata: ['1 : 4', '1 : 20', '1 : 7', '1 : 12', '1 : 9'],
    answer: ['1 : 4', '1 : 7', '1 : 9', '', ''],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'gradient_height_and_intervisibility',
    skills: ['gradient_comparison'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- In a ratio 1 : x, the vertical interval is always 1, so the horizontal distance is what changes.\n- A steeper slope rises more over a shorter horizontal distance.',
  },
  {
    name: 'Question 4',
    question: 'Beacon A (1180 m) and beacon B (1195 m) lie on a mapped ridge. Between them stands a hill with a spot height of 1310 m. Are the two beacons intervisible?',
    metadata: [
      'Yes, they are on the same ridge and B is higher than A',
      'No, the 1310 m hill between them is higher than both and blocks the line of sight',
      'Yes, because they are less than 10 km apart',
      'No, because the contour lines between them are widely spaced',
      '',
    ],
    answer: ['No, the 1310 m hill between them is higher than both and blocks the line of sight', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'gradient_height_and_intervisibility',
    skills: ['intervisibility_analysis'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Intervisibility asks whether anything lies on the straight line between two points.\n- Compare the height of the feature between the points with the heights of both points.',
  },
  {
    name: 'Question 5',
    question: 'Match each landform to the contour pattern or description that identifies it.',
    metadata: [
      'A - Ridge',
      'B - Saddle',
      'C - Valley',
      'D - Spur',
      '1 - Contours of lower value forming V-shapes that point towards higher ground, usually with a stream',
      '2 - A low point between two higher areas, with lower contours in between',
      '3 - Contours forming V-shapes that point towards lower ground',
      '4 - A long, narrow crest with contour values dropping away on both sides',
    ],
    answer: ['A-4', 'B-2', 'C-1', 'D-3'],
    presentation: 'match',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'gradient_height_and_intervisibility',
    skills: ['contour_landform_recognition'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Think about whether the land rises or falls on either side of the feature.\n- Valleys and spurs both give V-shaped contours; the direction the V points tells them apart.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1.1',
      marks: 2,
      clues: '- Read the height of each trigonometrical station from the map.\n- Subtract the smaller value from the larger one.',
      approach: '- Find the heights for F (block C3) and G (block D3).\n- Subtract and keep the unit.',
      solution: '1. Station F is at 1167,5 m and station G is at 928,0 m.\n2. 1167,5 m − 928,0 m = 239,5 m.\n3. Answer: 239,5 m (the unit must be written).',
    },
    {
      number: '3.1.2',
      marks: 1,
      clues: '- Use the coordinates to locate the point, then decide what natural feature the contours show there.\n- Eliminate man-made and non-natural options first.',
      approach: '- Convert the degrees, minutes and seconds into a position on the map.\n- Look at the contour pattern at that point: a low point between two higher areas has a particular name.',
      solution: '1. Trigonometrical stations and spot heights are marked symbols, not landforms.\n2. A perennial river would appear as a line, not a point.\n3. At that position the contours show a low point between two higher areas, which is a saddle: C.',
    },
    {
      number: '3.1.3',
      marks: 4,
      clues: '- Convert the measured map distance to a real distance using the orthophoto scale.\n- Write the formula, substitute, then express the answer as a ratio.',
      approach: '- State the formula: gradient = vertical interval ÷ horizontal equivalent.\n- Convert the measured distance (about 3,8 cm) to metres using 1 cm = 100 m.\n- Substitute and simplify to 1 : x.',
      solution: '1. Formula: gradient = vertical interval (VI) ÷ horizontal equivalent (HE).\n2. VI = 60 m. HE = 3,8 cm × 100 = 380 m (a range of 3,7 to 3,9 cm is accepted).\n3. Gradient = 60 ÷ 380.\n4. As a ratio this is 1 : 6,33 (a range of 1 : 6,16 to 1 : 6,50 is accepted).',
    },
    {
      number: '3.1.4',
      marks: 1,
      clues: '- Compare the steepness of the two sketches with the size of your ratio.\n- A smaller second number in the ratio means a steeper slope.',
      approach: '- Judge how steep a gradient of about 1 : 6 is.\n- Choose the sketch that drops over the shorter horizontal distance.',
      solution: '1. A gradient of 1 : 6,33 is steep.\n2. Sketch A falls quickly over a short horizontal distance, while B falls more gently.\n3. Answer: A.',
    },
    {
      number: '3.1.5',
      marks: 1,
      clues: '- Think about whether anything lies between the two points that is higher than both.\n- Check the contours and spot heights along the line from H to L.',
      approach: '- Draw an imaginary line between H and L.\n- Look for higher ground along it.',
      solution: '1. A feature higher than both points lies on the straight line between H and L.\n2. That obstruction blocks the line of sight.\n3. Answer: no.',
    },
    {
      number: '3.1.6',
      marks: 1,
      clues: '- Name the type of obstruction between the two points.\n- Use something visible on the topographical map.',
      approach: '- Identify what lies between L and H.\n- Describe it as an obstruction.',
      solution: '1. A higher feature or other obstruction (for example a hill or built-up area) stands between L and H.\n2. It stops the observer at H from seeing L.\n3. Any obstruction taken from the map is accepted.',
    },
  ],
  model: 'claude-sonnet-5-5',
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
