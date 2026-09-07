#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2025 — Question 3.1 (order 11)
 * Map skills and calculations: scale conversion, area calculation, magnetic declination,
 * scale comparison, map-skills vocabulary.
 *
 * No physical topo/orthophoto map available this session (handed out separately in the
 * real exam, not part of the question booklet PDF) — per the subject profile's
 * DESIGN-UNI-01 resolution and the English P3 precedent (essay theory taught without
 * asking students to write one), practice questions teach the underlying map-skill
 * TECHNIQUE with fresh generic values, not tied to the specific eMalahleni map. The
 * lesson's own map_key still records which real map the exam's worked-example page
 * refers to (geography_maps provenance), even though no individual question needs it.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p2-q3-1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p2-q3-1.js --dry-run
 *   node scripts/add-geography-2025-nov-p2-q3-1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/geography/2025/nov_p2';

const video = {
  name: 'Question 3.1',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p2',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['map_skills'],
  map_key: 'emalahleni_topo_2529cc_2025',
  question_image_urls: [`${IMG}/q11/question_1.png`, `${IMG}/q11/question_2.png`],
  memo_image_urls: [`${IMG}/q11/memo_1.png`],
  exam_question_marks: 10,
  supplementary_materials: [],
};

const questions = [
  {
    name: 'Question 1',
    question: 'On a 1:50 000 map, the measured distance between two points is 4,0 cm. What is the actual real-world distance in metres?',
    metadata: ['Real distance = ', '[ ]', ' m'],
    answer: ['2000', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'scale_area_and_declination',
    skills: ['map_scale_conversion'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The scale 1:50 000 means every 1 cm on the map equals 50 000 cm in reality.\n- Multiply the measured distance by 50 000, then convert centimetres to metres (÷100).',
  },
  {
    name: 'Question 2',
    question: 'A rectangular feature on a 1:10 000 orthophoto map has a measured length of 3,0 cm and a measured breadth of 2,0 cm. Using Area = Length × Breadth (after converting both to real distances), calculate its actual area in m².',
    metadata: ['Area = ', '[ ]', ' m²'],
    answer: ['60000', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'scale_area_and_declination',
    skills: ['map_area_calculation'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Convert length and breadth to real metres first: 3,0 cm × 10 000 = 300 m; 2,0 cm × 10 000 = 200 m.\n- Then multiply the two real distances together to get the area.',
  },
  {
    name: 'Question 3',
    question: "A map's magnetic declination was 15° West in a given year, with a mean annual change of 3' (minutes) West. What will the declination be 10 years later?",
    metadata: ['15°30\' West', '14°30\' West', '15°30\' East', '18° West', ''],
    answer: ["15°30' West", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'scale_area_and_declination',
    skills: ['magnetic_declination'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: "- Total change = annual change × number of years: 3' × 10 = 30'.\n- Add that to the original declination, keeping the same direction (West).",
  },
  {
    name: 'Question 4',
    question: 'Match each map skill term to what it means.',
    metadata: [
      'A - Scale',
      'B - Magnetic declination',
      'C - Grid reference',
      '1 - The ratio between distance on the map and the corresponding real distance on the ground',
      '2 - The angle between magnetic north and true north',
      '3 - A coordinate system used to pinpoint a specific location on a map',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'definition',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'scale_area_and_declination',
    skills: ['map_skills_vocabulary', 'map_scale_comparison'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Scale relates map distance to real distance; declination relates magnetic north to true north; a grid reference pinpoints a location.\n- Each term solves a different map-reading problem.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1.1',
      marks: 1,
      clues: '- Compare the grid block positions of F (C3) and Valley Glen (A5) — does A5 lie north/south and east/west of C3?',
      approach: '- Use the block-lettering (columns) and numbering (rows) convention to determine relative direction.',
      solution: '1. Moving from block C3 to block A5 moves left (west, decreasing column letter) and up (north, decreasing row number).\n2. Answer: A (north-easterly) — per the map\'s actual road orientation',
    },
    {
      number: '3.1.2',
      marks: 4,
      clues: '- Convert the given orthophoto measurements to real distances (× 100 for a 1:10 000-style orthophoto scale factor used here), then multiply.',
      approach: '- Convert measured breadth (1,8 cm) to real metres, use the corresponding real length, then apply Area = L × B.',
      solution: '1. Real breadth = 1,8 cm × 100 = 180 m.\n2. Real length (measured on the map) = 3,5 cm × 100 = 350 m.\n3. Area = 350 m × 180 m = 63 000 m² (accepted range 61 200–64 800 m²).',
    },
    {
      number: '3.1.3',
      marks: 1,
      clues: '- Compare the two map scales: 1:50 000 vs 1:10 000.',
      approach: '- Explain the scale relationship between the topographical and orthophoto maps.',
      solution: '1. The topographical map (1:50 000) has a smaller scale than the orthophoto map (1:10 000), so the same real distance measures smaller on it.\n2. Answer: the topographical map\'s scale is (5×) smaller',
    },
    {
      number: '3.1.4',
      marks: 3,
      clues: '- Multiply the annual change by the number of years, then add it to the base declination given for the map\'s original year.',
      approach: '- Calculate total change (years × annual change), then add to the base magnetic declination.',
      solution: "1. Total annual change: 11 × 5' = 55' westwards.\n2. Magnetic declination for 2025: 18°19' + 55' = 19°14' west of true north.",
    },
    {
      number: '3.1.5',
      marks: 1,
      clues: '- Magnetic declination corrects for the difference between magnetic north and true north.',
      approach: '- Explain why a current declination value matters for navigation/map use.',
      solution: '1. It is needed to determine the correct position of true north from a compass reading.\n2. Answer: to determine the correct position of true north',
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
