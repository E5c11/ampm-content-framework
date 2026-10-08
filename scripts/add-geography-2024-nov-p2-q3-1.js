#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2024 — Question 3.1 — Map Skills and Calculations (order 11)
 * Map skills on invented data: comparing map scales, writing a grid reference, back bearings, calculating an average gradient and matching a gradient to a land use.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p2-q3-1.js --curriculum temp/curriculum-vocab-geography-p2-2024.json
 *   node scripts/add-geography-2024-nov-p2-q3-1.js --dry-run
 *   node scripts/add-geography-2024-nov-p2-q3-1.js
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

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/geography/2024/nov_p2';

const video = {
  name: 'Question 3.1',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p2',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['map_skills', 'gradient', 'true_bearing'],
  question_image_urls: [
    `${IMG}/q11/question_1.png`,
    `${IMG}/q11/question_2.png`,
  ],
  memo_image_urls: [
    `${IMG}/q11/memo_1.png`,
  ],
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
    question: 'Map X has a scale of 1 : 250\u00a0000 and Map Y has a scale of 1 : 25\u00a0000. Which statement is correct?',
    metadata: [
      'Map X has the larger scale and shows a smaller area in more detail',
      'Map Y has the smaller scale and shows a larger area in less detail',
      'Map X has the smaller scale and shows a larger area in less detail',
      'Both maps show the same area, because only the paper size differs',
      '',
    ],
    answer: ['Map X has the smaller scale and shows a larger area in less detail', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'scale_area_and_declination',
    skills: ['map_scale_comparison'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Write each scale as a fraction: the bigger the denominator, the smaller the fraction.\n- A smaller fraction squeezes more ground onto the same sheet.',
  },
  {
    name: 'Question 2',
    question: 'A borehole lies at latitude 33 degrees 52 minutes 40 seconds south and longitude 25 degrees 34 minutes 10 seconds east. Which grid reference is written correctly?',
    metadata: [
      "25°34'10''S; 33°52'40''E",
      "33°52'40''S; 25°34'10''E",
      "33°52'40''E; 25°34'10''S",
      "25°34'10''E; 33°52'40''N",
      '',
    ],
    answer: ["33°52'40''S; 25°34'10''E", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'scale_area_and_declination',
    skills: ['grid_reference_format'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- A grid reference gives latitude first, then longitude.\n- Each value keeps its own hemisphere letter.',
  },
  {
    name: 'Question 3',
    question: 'The true bearing of a church from a windmill is 72°. What is the true bearing of the windmill from the church?',
    metadata: ['Bearing = ', '[ ]', '°'],
    answer: ['252', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'scale_area_and_declination',
    skills: ['true_bearing'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    keyboard_type: 'standard_math',
    clues: '- The reverse direction points the opposite way, half a full turn round.\n- Keep the answer between 0° and 360°.',
  },
  {
    name: 'Question 4',
    question: 'On a 1 : 50\u00a0000 map, spot height P is 1\u00a0284 m and trigonometrical station Q is 1\u00a0371,4 m. The distance from P to Q on the map is 6,2 cm. Calculate the average gradient from P to Q (round to two decimal places).',
    metadata: ['Gradient = ', '[ ]', ' : ', '[ ]'],
    answer: ['1', '35.47', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'gradient_height_and_intervisibility',
    skills: ['gradient_calculation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    keyboard_type: 'standard_math',
    clues: '- Find the vertical interval in metres and the horizontal equivalent in metres.\n- Gradient = VI ÷ HE, written as 1 : HE ÷ VI.',
  },
  {
    name: 'Question 5',
    question: 'Match each average gradient to the land use it suits best.',
    metadata: [
      'A - 1 : 6',
      'B - 1 : 40',
      'C - 1 : 300',
      '1 - An airstrip or flood-irrigated fields',
      '2 - Forestry or a nature reserve',
      '3 - A main road built cheaply, without cuttings or passes',
    ],
    answer: ['A-2', 'B-3', 'C-1'],
    presentation: 'match',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'gradient_height_and_intervisibility',
    skills: ['gradient_comparison'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- The bigger the second number, the gentler the slope.\n- Think about which activities need almost flat ground and which can cope with steep ground.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1.1',
      marks: 1,
      clues: '- Compare 1 : 50 000 with 1 : 10 000 as fractions.',
      approach: '- Write both scales as fractions.\n- The fraction with the larger denominator is the smaller scale.',
      solution: '1. The topographical map is 1 : 50 000 and the orthophoto map is 1 : 10 000.\n2. One fifty-thousandth is smaller than one ten-thousandth.\n3. The topographical map has the smaller scale.',
    },
    {
      number: '3.1.2',
      marks: 1,
      clues: '- Think about how much ground fits on one sheet at a small scale.',
      approach: '- Decide whether a small-scale map shows a large or small area.\n- Decide whether it shows more or less detail.\n- Choose the matching pair.',
      solution: '1. A small-scale map covers a large area.\n2. Because so much is squeezed in, it shows less detail.\n3. Statements (iii) and (iv) apply, so the answer is D.',
    },
    {
      number: '3.1.3',
      marks: 1,
      clues: '- Bloemfontein lies at about 29° south and 26° east.',
      approach: '- Latitude is written first, then longitude.\n- Check which option has 29° with S and 26° with E.',
      solution: "1. A grid reference starts with latitude (south) and then longitude (east).\n2. Only option B places 29°02'55'' S first and 26°10'12'' E second, matching the reservoir at F.\n3. The answer is B.",
    },
    {
      number: '3.1.4',
      marks: 1,
      clues: '- A true bearing is measured clockwise from true north.',
      approach: '- Join point 7 to point 6.\n- Measure the angle clockwise from a north line drawn at 7.',
      solution: '1. Draw a north line at spot height 1427 (point 7) and join it to point 6.\n2. Measure clockwise from north to the line.\n3. The bearing is 316°, with 315° to 317° accepted.',
    },
    {
      number: '3.1.5',
      marks: 4,
      clues: '- Gradient compares the height difference with the ground distance, both in metres.',
      approach: '- Find VI: the height of trig station 96 minus 1358 m.\n- Find HE: 7,8 cm × 500 m.\n- Divide and write the answer as 1 : x.',
      solution: '1. VI = 1 455,6 m − 1 358 m = 97,6 m.\n2. HE = 7,8 cm × 500 = 3 900 m.\n3. Gradient = 97,6 ÷ 3 900.\n4. Gradient = 1 : 39,96 (1 : 40 is accepted).',
    },
    {
      number: '3.1.6',
      marks: 1,
      clues: '- Look at the size of the second number in the ratio.',
      approach: '- Decide what 1 : 40 means in words: 1 m up for every 40 m across.',
      solution: '1. A rise of 1 m over almost 40 m is a gentle slope.\n2. The gradient is gentle.',
    },
    {
      number: '3.1.7',
      marks: 1,
      clues: '- Think about the cost and difficulty of building on steep ground.',
      approach: '- State one benefit of a gentle slope for road builders.',
      solution: '1. On a gentle slope a road is cheaper, easier and safer to build.\n2. No tunnels or passes are needed.\n3. Any one of these earns the mark.',
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
