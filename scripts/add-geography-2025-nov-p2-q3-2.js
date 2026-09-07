#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2025 — Question 3.2 (order 12)
 * Map interpretation: topo map feature recognition, street pattern reasoning, land-use
 * siting interpretation, mining feature identification — technique-taught generically,
 * same rationale as Q3.1 (no physical map available this session).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p2-q3-2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p2-q3-2.js --dry-run
 *   node scripts/add-geography-2025-nov-p2-q3-2.js
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
  name: 'Question 3.2',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p2',
  order: 12,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['map_interpretation'],
  map_key: 'emalahleni_ortho_2529cc15_2025',
  question_image_urls: [`${IMG}/q12/question_1.png`, `${IMG}/q12/question_2.png`],
  memo_image_urls: [`${IMG}/q12/memo_1.png`, `${IMG}/q12/memo_2.png`],
  exam_question_marks: 10,
  supplementary_materials: [],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Match each topographic map feature to the land-use or activity it most likely represents.',
    metadata: [
      'A - A cluster of buildings near sports fields and a running track',
      'B - Rows of small rectangular blocks arranged in a grid close to a town centre',
      'C - An area with disturbed, irregular ground contours and no vegetation',
      '1 - School and recreation area',
      '2 - Formal residential township',
      '3 - Old mining diggings',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['topo_map_feature_recognition'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Sports fields next to buildings suggest an education/recreation use.\n- Irregular, disturbed ground with no vegetation is a classic sign of old excavation/mining.',
  },
  {
    name: 'Question 2',
    question: 'A residential area has a road network with many small intersections and cul-de-sacs, rather than a few long straight roads. What challenge would this street pattern most likely create for commuters travelling through the area?',
    metadata: [
      'Faster travel times due to more route options',
      'More intersections mean more stops and delays getting through the area',
      'No effect on travel time at all',
      'It eliminates the need for traffic signals entirely',
      '',
    ],
    answer: ['More intersections mean more stops and delays getting through the area', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['street_pattern_interpretation'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Every intersection is a potential stop or slow-down point for a vehicle.\n- More intersections packed into an area means more delay travelling through it.',
  },
  {
    name: 'Question 3',
    question: 'A cemetery is shown on a map located in the rural-urban fringe, away from residential and commercial areas. What is the most likely reason a cemetery would be sited in this land-use zone?',
    metadata: [
      'Space is available and land is cheaper away from the built-up city centre',
      'It needs to be as close to the CBD as possible for accessibility',
      'Cemeteries are randomly placed with no locational logic',
      'It must be located next to heavy industry',
      '',
    ],
    answer: ['Space is available and land is cheaper away from the built-up city centre', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['land_use_siting_interpretation'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Land uses that need a lot of space but not high accessibility are usually pushed to cheaper, less central land.\n- The rural-urban fringe offers exactly that combination.',
  },
  {
    name: 'Question 4',
    question: 'Select the map features that would provide evidence of opencast mining activity in an area.',
    metadata: [
      'Large, irregular open pits or disturbed ground',
      'A rail siding or heavy-vehicle access road leading to the site',
      'A school symbol',
      'A river symbol with no other nearby features',
      '',
    ],
    answer: ['Large, irregular open pits or disturbed ground', 'A rail siding or heavy-vehicle access road leading to the site', '', '', ''],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['mining_feature_identification'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Opencast mining disturbs the ground surface and needs transport infrastructure to move the extracted material.\n- A school symbol or an isolated river symbol has nothing to do with mining activity.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '3.2.1',
      marks: 2,
      clues: '- Match each numbered feature on the orthophoto map to its correct label in the key.',
      approach: '- Identify features 6 and 7 on the orthophoto map and match them to the correct land-use description.',
      solution: '1. Feature 6 matches "school and recreation area" and feature 7 matches "golf course".\n2. Answer: (a) B, (b) A',
    },
    {
      number: '3.2.2',
      marks: 2,
      clues: '- A street pattern with many intersections creates delays and other knock-on effects for people travelling through it.',
      approach: '- Explain a specific commuter challenge created by the street pattern shown around feature 8.',
      solution: '1. Many intersections delay commuters and increase travel time.\n2. This can also increase fuel wastage and the risk of accidents.\n3. Answer: any one well-explained challenge',
    },
    {
      number: '3.2.3',
      marks: 1,
      clues: '- Consider which land-use zone typically has available, low-cost land away from the built-up centre.',
      approach: '- Identify the land-use zone the cemetery is located in.',
      solution: '1. The cemetery is located in the rural-urban fringe.\n2. Answer: rural-urban fringe',
    },
    {
      number: '3.2.4',
      marks: 2,
      clues: '- Cemeteries need available space, low land costs, and to be reasonably accessible without disturbing residents.',
      approach: '- Explain why the rural-urban fringe suits a cemetery specifically.',
      solution: '1. Space is available and land is cheap in the rural-urban fringe.\n2. It is also flat, quiet, and accessible to both rural and urban communities.\n3. Answer: any one well-explained reason',
    },
    {
      number: '3.2.5',
      marks: 1,
      clues: '- Opencast mines need infrastructure to transport large volumes of extracted material.',
      approach: '- Identify the type of transport infrastructure typically found at a mine.',
      solution: '1. A railway line or access road serving the mine.\n2. Answer: any one — railway line or road',
    },
    {
      number: '3.2.6',
      marks: 1,
      clues: "- Recall the general information given about eMalahleni's economic activity.",
      approach: '- Identify the mineral associated with opencast mining in this area.',
      solution: '1. eMalahleni is described as a coal mining area.\n2. Answer: coal',
    },
    {
      number: '3.2.7',
      marks: 1,
      clues: '- A physical/natural siting factor relates to the land itself, not the economy or people.',
      approach: '- Identify a natural feature of the site that makes it suitable for industry.',
      solution: '1. Flat, available land suits industrial development.\n2. Answer: any one — flat land, available land',
    },
    {
      number: '3.2.8',
      marks: 2,
      clues: '- Industries provide direct and indirect economic benefits to nearby residents.',
      approach: '- Explain economic advantages the local population gains from nearby industry.',
      solution: '1. Provides employment opportunities and access to improved infrastructure.\n2. Upskills the local workforce and increases local buying power.\n3. Answer: any one well-explained advantage',
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
