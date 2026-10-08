#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2024 — Question 1.4 (order 4)
 * Tropical cyclones: formation conditions, reading a track and wind-speed table, weakening over land, the mature-stage cross-section and the clear eye.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p1-q1-4.js --curriculum temp/curriculum-vocab-geography-p1-2024.json
 *   node scripts/add-geography-2024-nov-p1-q1-4.js --dry-run
 *   node scripts/add-geography-2024-nov-p1-q1-4.js
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

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/geography/2024/nov_p1';

const video = {
  name: 'Question 1.4',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p1',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['tropical_cyclone'],
  question_image_urls: [
    `${IMG}/q4/question_1.png`,
    `${IMG}/q4/question_2.png`,
  ],
  memo_image_urls: [
    `${IMG}/q4/memo_1.png`,
    `${IMG}/q4/memo_2.png`,
  ],
  exam_question_marks: 15,
  supplementary_materials: [],
};

// ─── Phase 3 data — the practice questions ───────────────────────────────────
// Per core/question-schema.md + presentations/{type}.md. Logical/authored shape
// (presentation, type, order, unit/topic/subtopic, skills, …) — the mapping to
// Postgres columns is tools/lib/content-rows.js's job.

const questions = [
  {
    name: 'Question 1',
    question: 'Select ALL the conditions needed for a tropical cyclone to develop.',
    metadata: [
      'Sea-surface temperature of at least 26,5 °C',
      'A location directly on the equator',
      'Strong winds that change speed sharply with height',
      'Enough Coriolis force to start the air spinning',
      'Divergence in the upper air above a surface low',
    ],
    answer: [
      'Sea-surface temperature of at least 26,5 °C',
      'Enough Coriolis force to start the air spinning',
      'Divergence in the upper air above a surface low',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'climate_weather',
    topic: 'tropical_cyclones',
    subtopic: 'tropical_cyclone_formation_and_impact',
    skills: ['tropical_cyclone_formation_factors'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- A tropical cyclone is fuelled by warm, moist air.\n- The storm must be able to spin and to remove air from its top.',
  },
  {
    name: 'Question 2',
    question: 'A tropical cyclone recorded maximum wind speeds of 65 km/h, 105 km/h, 140 km/h and 85 km/h on four days in a row. By how much did the wind speed increase from the first reading to the strongest reading?',
    metadata: ['Increase = ', '[ ]', ' km/h'],
    answer: ['75', '', '', '', ''],
    presentation: 'fitb',
    type: 'interpretation',
    unit: 'climate_weather',
    topic: 'tropical_cyclones',
    subtopic: 'tropical_cyclone_formation_and_impact',
    skills: ['data_trend_interpretation'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    keyboard_type: 'standard_math',
    clues: '- Find the highest value in the list first.\n- Subtract the first reading from it.',
  },
  {
    name: 'Question 3',
    question: 'The same cyclone made landfall between its third and fourth readings, and its wind speed dropped from 140 km/h to 85 km/h. Which statement best explains the drop?',
    metadata: [
      'Over land the Coriolis force strengthens and pushes the storm apart',
      'Over land the eye fills with heavy rain, which slows the winds',
      'Over land forests release latent heat, which calms the storm',
      'Over land it loses its warm, moist air supply and friction slows it',
      '',
    ],
    answer: ['Over land it loses its warm, moist air supply and friction slows it', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'tropical_cyclones',
    subtopic: 'tropical_cyclone_formation_and_impact',
    skills: ['tropical_cyclone_weakening'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Think about what feeds a tropical cyclone over the ocean.\n- Consider what a rough land surface does to fast-moving air.',
  },
  {
    name: 'Question 4',
    question: 'Which description matches a correctly labelled cross-section of a mature tropical cyclone?',
    metadata: [
      'One tall cumulonimbus cloud over the centre, with air rising fastest in the eye',
      'Cumulonimbus walls around a clear eye, with air sinking in the eye and rising in the walls',
      'Layered stratus across the whole storm, with air sinking in the walls and rising in the eye',
      'Cumulonimbus walls around a cloud-filled eye, with air rising in both eye and walls',
      '',
    ],
    answer: [
      'Cumulonimbus walls around a clear eye, with air sinking in the eye and rising in the walls',
      '',
      '',
      '',
      '',
    ],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'climate_weather',
    topic: 'tropical_cyclones',
    subtopic: 'tropical_cyclone_formation_and_impact',
    skills: ['tropical_cyclone_eye_structure'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Check three things in each description: the cloud type, the state of the eye and the direction of air movement in the eye.',
  },
  {
    name: 'Question 5',
    question: 'Select ALL the reasons why the eye of a mature tropical cyclone has no cloud or rain.',
    metadata: [
      'The eye lies over cold water that stops evaporation',
      'Air sinks in the eye',
      'Sinking air warms as it is compressed',
      'Strong winds in the eye blow the clouds away',
      'The warming air never cools enough to condense',
    ],
    answer: [
      'Air sinks in the eye',
      'Sinking air warms as it is compressed',
      'The warming air never cools enough to condense',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'climate_weather',
    topic: 'tropical_cyclones',
    subtopic: 'tropical_cyclone_formation_and_impact',
    skills: ['tropical_cyclone_eye_structure'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Clouds form when rising air cools.\n- Ask what happens to air that moves the other way.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.4.1',
      marks: 1,
      clues: '- Think about what a tropical cyclone needs to start: heat, moisture and spin.\n- One condition is enough.',
      approach: '- Recall the formation conditions of tropical cyclones.\n- State one of them briefly.',
      solution: '1. Tropical cyclones need warm ocean water, moisture and spin.\n2. Acceptable conditions include sea temperatures of 26,5 °C or more, a low-pressure area with converging air, Coriolis force, calm conditions, high humidity, latent heat release or upper-air divergence.\n3. Any one of these earns the mark.',
    },
    {
      number: '1.4.2',
      marks: 2,
      clues: '- Use the map for one piece of evidence and the table for the other.\n- Compare the readings for 10 and 11 March.',
      approach: '- From the map, note where the storm was between 10 and 11 March.\n- From the table, compare the wind speeds on those days.',
      solution: '1. The map shows the storm over the ocean, where it was exposed to more moisture.\n2. The table shows the wind speed rising from 63 km/h on 10 March to 95 km/h and then 116 km/h on 11 March.\n3. One point from each source earns the two marks.',
    },
    {
      number: '1.4.3',
      marks: 4,
      clues: '- On 12 March the storm made landfall in Mozambique.\n- Think about what changes when a cyclone moves over land.',
      approach: '- Explain what happens to the energy supply over land.\n- Explain the effect of the land surface on the wind.\n- Give two explained reasons.',
      solution: '1. The storm moved over land, where it had less moisture to feed it.\n2. With less evaporation there was less latent heat to power the storm.\n3. Friction over the rough land surface slowed the winds, and the storm began to dissipate.\n4. Any two of these reasons, each explained, earn the four marks.',
    },
    {
      number: '1.4.4(a)',
      marks: 1,
      clues: '- Draw the storm as if it were sliced through the middle.\n- It should be symmetrical around a central eye.',
      approach: '- Draw a ground line.\n- Draw a cloud mass on either side of a central gap.',
      solution: '1. Draw a side view of the storm across its centre.\n2. A recognisable cross-section, with cloud on both sides of the centre, earns the mark.',
    },
    {
      number: '1.4.4(b)',
      marks: 1,
      clues: '- Which cloud type forms when air rises fast and high?',
      approach: '- Label the clouds in the walls of the storm.',
      solution: '1. The walls of the storm are made of tall, towering clouds.\n2. Label them cumulonimbus.',
    },
    {
      number: '1.4.4(c)',
      marks: 1,
      clues: '- The centre of the storm is calm and clear.',
      approach: '- Label the gap in the middle of the cross-section.',
      solution: '1. Leave a clear gap between the cloud walls at the centre.\n2. Label it the eye.',
    },
    {
      number: '1.4.4(d)',
      marks: 1,
      clues: '- Air in the centre moves in the opposite direction to air in the walls.',
      approach: '- Add arrows in the eye.\n- Show the direction in which the air moves there.',
      solution: '1. Draw arrows in the eye pointing downwards.\n2. These show air sinking (subsiding) in the eye.',
    },
    {
      number: '1.4.5',
      marks: 4,
      clues: '- Clouds and rain need rising, cooling air.\n- Describe what the air in the eye is doing instead.',
      approach: '- State the direction the air moves in the eye.\n- Explain what happens to its temperature and moisture.\n- Give two explained points.',
      solution: '1. Air subsides (sinks) in the eye of the cyclone.\n2. Sinking air is compressed and heats up.\n3. The warm air stays dry because moisture evaporates, so no condensation takes place.\n4. Without condensation, no clouds or rain form; any two points earn the four marks.',
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
