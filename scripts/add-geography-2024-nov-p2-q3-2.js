#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2024 — Question 3.2 — Map Interpretation (order 12)
 * Interpreting map evidence on described, self-contained scenarios: settlement patterns, evidence of new development and its impact on farms, street patterns and topography, and evidence for large-scale irrigated farming.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p2-q3-2.js --curriculum temp/curriculum-vocab-geography-p2-2024.json
 *   node scripts/add-geography-2024-nov-p2-q3-2.js --dry-run
 *   node scripts/add-geography-2024-nov-p2-q3-2.js
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
  name: 'Question 3.2',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p2',
  order: 12,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['map_interpretation', 'settlement_pattern'],
  question_image_urls: [
    `${IMG}/q12/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q12/memo_1.png`,
    `${IMG}/q12/memo_2.png`,
  ],
  exam_question_marks: 12,
  supplementary_materials: [],
};

// ─── Phase 3 data — the practice questions ───────────────────────────────────
// Per core/question-schema.md + presentations/{type}.md. Logical/authored shape
// (presentation, type, order, unit/topic/subtopic, skills, …) — the mapping to
// Postgres columns is tools/lib/content-rows.js's job.

const questions = [
  {
    name: 'Question 1',
    question: 'On an orthophoto, farmsteads are spaced 1 to 2 km apart, and each one is surrounded by its own fields. What is the settlement pattern?',
    metadata: ['Nucleated', 'Linear', 'Dispersed', 'Circular', ''],
    answer: ['Dispersed', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['settlement_pattern_types'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Pattern describes how far apart the buildings are, not the outline they make.',
  },
  {
    name: 'Question 2',
    question: 'A map key and description of a new suburb list the features below. Select ALL the features that show the suburb is still being developed.',
    metadata: [
      'Roads shown with the "roads under construction" symbol',
      'A cemetery beside the oldest houses',
      'A street grid with many empty plots',
      'New buildings spreading outwards from the older core',
      'A trigonometrical station on a nearby hill',
    ],
    answer: [
      'Roads shown with the "roads under construction" symbol',
      'A street grid with many empty plots',
      'New buildings spreading outwards from the older core',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['map_evidence_reasoning'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Look for features that are unfinished or still spreading.\n- Some features would be there whether or not building is going on.',
  },
  {
    name: 'Question 3',
    question: 'A new housing estate is being built on land next to a group of irrigated farms. Which is the most likely negative impact on the farms?',
    metadata: [
      'Farm produce prices fall because new residents grow their own food',
      'Soil on the farms becomes more fertile from building dust',
      'Rainfall over the farms increases because of the new roofs',
      'Land prices rise, and farmers are pressured to sell farmland for housing',
      '',
    ],
    answer: ['Land prices rise, and farmers are pressured to sell farmland for housing', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['land_use_siting_interpretation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Think about what happens to land next to a growing town.\n- Reject effects that would help the farmer.',
  },
  {
    name: 'Question 4',
    question: 'Match each street pattern to the setting it most likely developed in.',
    metadata: [
      'A - Gridiron (straight streets crossing at right angles)',
      'B - Curving streets that follow the contours',
      'C - Radial streets meeting at one point',
      '1 - Hilly ground, where roads must keep a gentle slope',
      '2 - Roads that converge on a central square or market',
      '3 - Flat land that is easy to survey and lay out',
    ],
    answer: ['A-3', 'B-1', 'C-2'],
    presentation: 'match',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['street_pattern_interpretation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Ask what each street layout needs from the land beneath it.',
  },
  {
    name: 'Question 5',
    question: 'A description of a farming area lists these features. Select ALL the features that help to ensure a regular water supply for the crops.',
    metadata: [
      'Several small farm dams',
      'Grain silos beside the railway',
      'Furrows leading from the river to the fields',
      'Windpumps on the farms',
      'A main road along the valley',
    ],
    answer: [
      'Several small farm dams',
      'Furrows leading from the river to the fields',
      'Windpumps on the farms',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['topo_map_feature_recognition'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Ask whether each feature stores, moves or pumps water.',
  },
  {
    name: 'Question 6',
    question: 'An area shows large, regular cultivated fields on gently sloping land beside a river, with silos and a main road nearby. Which combination best explains why farming here is large-scale?',
    metadata: [
      'Steep slopes, poor soils and a remote location',
      'Small plots worked with hand tools, with produce sold only at a local market',
      'Gentle slopes, a reliable water supply and access to storage and transport',
      'Dense forest, heavy frost and no road links',
      '',
    ],
    answer: ['Gentle slopes, a reliable water supply and access to storage and transport', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['land_use_siting_interpretation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Large-scale farming needs land that machines can work, water, and a way to store and move the harvest.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '3.2.1',
      marks: 1,
      clues: '- Look at how closely the buildings at area 8 are grouped.',
      approach: '- Decide whether the buildings are clustered or spread out.\n- Pick the pattern that matches.',
      solution: '1. The buildings at area 8 are grouped closely together.\n2. A closely grouped settlement has a nucleated pattern.\n3. The answer is B.',
    },
    {
      number: '3.2.2(a)',
      marks: 2,
      clues: '- Check the map key for a symbol that shows unfinished work.',
      approach: '- Look for roads under construction in Woodland Hills.\n- Look for empty plots or building spreading outwards.\n- Name two pieces of evidence.',
      solution: '1. The map shows roads under construction (incomplete roads).\n2. There are vacant plots, and new building is moving away from the original settlement.\n3. Any two earn the two marks.',
    },
    {
      number: '3.2.2(b)',
      marks: 2,
      clues: '- Woodland Hills is surrounded by farmland.',
      approach: '- Think about what urban growth takes from farms or adds to the area.\n- Explain one negative impact.',
      solution: '1. Urban expansion can reduce the size of farms and the fertile soil available.\n2. Construction can cause pollution, silt up dams, increase flooding and add traffic.\n3. Water scarcity, higher land prices and more crime are also accepted; any one explained impact earns two marks.',
    },
    {
      number: '3.2.3(a)',
      marks: 1,
      clues: '- A gridiron pattern has straight streets at right angles.',
      approach: '- Think about what kind of land makes that layout easy.',
      solution: '1. The land at area 9 is flat or gently sloping.\n2. Flat land makes a gridiron easy to lay out.\n3. Either point earns the mark.',
    },
    {
      number: '3.2.3(b)',
      marks: 2,
      clues: '- Look at what lies close to area 9: roads, shops and places of work.',
      approach: '- Name a nearby feature.\n- Explain how it saves residents money.',
      solution: '1. Residents live close to shopping centres and employment, which lowers transport costs.\n2. Nearby roads give easy access, and rent or land may be cheaper.\n3. Any one explained advantage earns two marks.',
    },
    {
      number: '3.2.4(a)',
      marks: 1,
      clues: '- Look at the land-use symbols in blocks A1/A2 and B1/B2.',
      approach: '- Identify the primary activity shown by the cultivated land.',
      solution: '1. The blocks are covered by cultivated land.\n2. The primary activity is agriculture (farming or cultivation).',
    },
    {
      number: '3.2.4(b)',
      marks: 1,
      clues: '- Think about what the area offers a large farm.',
      approach: '- Check the map for water, land, slope and transport.\n- State one reason.',
      solution: '1. There is a water supply and large tracts of gently sloping, fertile land.\n2. Markets, transport networks and storage (silos) are close by.\n3. Any one reason earns the mark.',
    },
    {
      number: '3.2.4(c)',
      marks: 2,
      clues: '- Look for human-made features that store or deliver water.',
      approach: '- Scan the blocks for dams, furrows, reservoirs and wind pumps.\n- Name two.',
      solution: '1. Dams and furrows have been constructed.\n2. Reservoirs and wind pumps also supply water.\n3. Any two earn the two marks.',
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
