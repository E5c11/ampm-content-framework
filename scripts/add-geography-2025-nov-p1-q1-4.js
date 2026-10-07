#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2025 — Question 1.4 (order 4)
 * Tropical cyclones (case: Dikeledi 2025): stage from fact file, formation latitudes, dangerous semicircle, intensification.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p1-q1-4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p1-q1-4.js --dry-run
 *   node scripts/add-geography-2025-nov-p1-q1-4.js
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
  name: 'Question 1.4',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p1',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['tropical_cyclone'],
  question_image_urls: [`${IMG}/q4/question_1.png`, `${IMG}/q4/question_2.png`],
  memo_image_urls: [`${IMG}/q4/memo_1.png`, `${IMG}/q4/memo_2.png`],
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
    question: 'A fact file for a newly named tropical cyclone off Mozambique records a central pressure of 1004 hPa, maximum winds of 50 km/h and no clearly formed eye. At which stage of development is it?',
    metadata: [
      'Mature stage',
      'Dissipating stage',
      'A tropical disturbance that has not yet developed a closed circulation',
      'Immature stage',
      '',
    ],
    answer: ['Immature stage', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'climate_weather',
    topic: 'tropical_cyclones',
    subtopic: 'tropical_cyclone_formation_and_impact',
    skills: ['tropical_cyclone_stage_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Compare the pressure and wind readings with those of a fully developed cyclone: stronger systems have lower pressure and faster winds.\n- The system already has a name, so it is more than a disturbance.',
  },
  {
    name: 'Question 2',
    question: 'Select ALL factors needed for a tropical cyclone to form.',
    metadata: [
      'A cold ocean current beneath the system',
      'Sea-surface temperatures above about 26 °C',
      'A position right on the equator',
      'A position at least about 5° from the equator so that the Coriolis force can act',
      'Large amounts of water vapour releasing latent heat as it condenses',
    ],
    answer: [
      'Sea-surface temperatures above about 26 °C',
      'A position at least about 5° from the equator so that the Coriolis force can act',
      'Large amounts of water vapour releasing latent heat as it condenses',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'climate_weather',
    topic: 'tropical_cyclones',
    subtopic: 'tropical_cyclone_formation_and_impact',
    skills: ['tropical_cyclone_formation_factors'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Think about what supplies the energy, what makes the air spin, and why the equator itself is excluded.\n- Cold water offers no energy supply.',
  },
  {
    name: 'Question 3',
    question: 'Why is the forward left-hand quadrant of a Southern Hemisphere tropical cyclone called the dangerous semicircle?',
    metadata: [
      'The cyclone\'s forward movement is subtracted from its winds there, causing sudden calm',
      'It is the only quadrant that contains the eye of the storm',
      'The cyclone\'s forward movement adds to its rotational winds there, giving the strongest winds and heaviest rain',
      'Winds there blow away from the centre and carry the storm surge inland',
      '',
    ],
    answer: [
      'The cyclone\'s forward movement adds to its rotational winds there, giving the strongest winds and heaviest rain',
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
    skills: ['dangerous_semicircle'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Wind speed in a moving cyclone is the sum of two motions: its spin and its forward travel.\n- In one quadrant the two act in the same direction.',
  },
  {
    name: 'Question 4',
    question: 'A mature tropical cyclone moves inland over a plain in southern Mozambique. Which explanation best accounts for its weakening?',
    metadata: [
      'Warm land air increases evaporation and raises the central pressure',
      'The Coriolis force becomes stronger over land and breaks up the circulation',
      'Less friction over land slows the wind',
      'It loses the warm-ocean supply of moisture and latent heat, and friction with the land slows its winds',
      '',
    ],
    answer: ['It loses the warm-ocean supply of moisture and latent heat, and friction with the land slows its winds', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'tropical_cyclones',
    subtopic: 'tropical_cyclone_formation_and_impact',
    skills: ['tropical_cyclone_weakening'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Consider what a tropical cyclone draws its energy from and what happens when that source is removed.\n- Compare the friction of land with that of the ocean.',
  },
  {
    name: 'Question 5',
    question: 'Match each impact of a tropical cyclone to the most suitable management strategy.',
    metadata: [
      'A - Storm-surge flooding of coastal homes',
      'B - Roofs torn off by gale-force winds',
      'C - River flooding after torrential rain',
      'D - Loss of life through lack of warning',
      '1 - Broadcast early warnings and rehearse evacuation routes',
      '2 - Restrict building on the low-lying coast and evacuate before landfall',
      '3 - Clear drainage channels and keep settlements off floodplains',
      '4 - Enforce building standards that secure roofs',
    ],
    answer: ['A-2', 'B-4', 'C-3', 'D-1'],
    presentation: 'match',
    type: 'application',
    unit: 'climate_weather',
    topic: 'tropical_cyclones',
    subtopic: 'tropical_cyclone_formation_and_impact',
    skills: ['tropical_cyclone_impact_management'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Ask what actually causes each impact, then choose the response that targets that cause.\n- Two of the strategies deal with water; tell them apart by where the water comes from.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.4.1',
      marks: 1,
      clues: '- Read the 8 January conditions in the fact file.\n- Compare the pressure and wind speed with those of a fully developed cyclone.',
      approach: '- Locate the 8 January pressure and wind speed.\n- Recall the stage names: immature, mature and dissipating.\n- Pick the stage that matches a weaker, early system.',
      solution: '1. On 8 January the centre is still at a relatively high pressure with moderate winds.\n2. That pattern describes a developing system rather than a fully developed one.\n3. Answer: immature stage.',
    },
    {
      number: '1.4.2',
      marks: 2,
      clues: '- Use only the fact file, not the pictures.\n- Quote two values or facts from it that show the cyclone was still developing.',
      approach: '- Pick the pressure reading.\n- Pick the wind-speed reading or another fact such as the cyclone having been named.\n- Write each as a separate point.',
      solution: '1. The central pressure on 8 January was 996 hPa, which is higher than a mature cyclone\'s.\n2. The maximum wind speed was 75 km/h, which is moderate.\n3. The fact that the system had been given a name is also accepted.',
    },
    {
      number: '1.4.3',
      marks: 4,
      clues: '- Look at the latitudes marked on location map B.\n- Link those latitudes to the force that makes the system spin and to the energy supply.',
      approach: '- Explain the role of the Coriolis force at these latitudes.\n- Explain the role of warm ocean water and evaporation.\n- Mention latent heat or the intense low pressure that results.',
      solution: '1. Between 5° and 20° south the Coriolis force is strong enough to deflect the air and start rotation.\n2. Warm tropical oceans give a high evaporation rate and supply moisture.\n3. Latent heat released when the vapour condenses powers the system and intensifies the low pressure.\n4. Two explained points are needed for full marks.',
    },
    {
      number: '1.4.4',
      marks: 4,
      clues: '- Look at satellite image D and the labelled forward left-hand quadrant.\n- Describe the weather in terms of wind and rain.',
      approach: '- State the wind conditions in the dangerous semicircle.\n- State the rainfall conditions.\n- Add qualifying detail to each point.',
      solution: '1. The quadrant has hurricane-force, very destructive winds.\n2. It also has torrential rain and thunderstorms.\n3. Hailstorms and lightning are also accepted; any two descriptions earn full marks.',
    },
    {
      number: '1.4.5',
      marks: 4,
      clues: '- Compare the fact file readings on the two dates, and the position of the cyclone on the maps.\n- Link the change in surface beneath the cyclone to its energy and wind speed.',
      approach: '- Explain the effect of moving from land onto warm water.\n- Explain the effect of reduced friction on wind speed.\n- Use the fall in central pressure as supporting evidence.',
      solution: '1. The cyclone moved away from Madagascar over the warm waters of the Mozambique Channel.\n2. More evaporation and latent heat release strengthened the system.\n3. With less frictional drag over the ocean the winds speeded up.\n4. The central pressure fell from 996 hPa to 976 hPa, confirming the intensification.',
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
