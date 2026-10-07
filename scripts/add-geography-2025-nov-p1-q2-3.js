#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2025 — Question 2.3 (order 8)
 * River profiles: longitudinal profile definition, graded profile evidence, temporary vs permanent base levels, cross-profile differences and processes.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p1-q2-3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p1-q2-3.js --dry-run
 *   node scripts/add-geography-2025-nov-p1-q2-3.js
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
  name: 'Question 2.3',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p1',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['river_profiles', 'base_level'],
  question_image_urls: [`${IMG}/q8/question_1.png`],
  memo_image_urls: [`${IMG}/q8/memo_1.png`, `${IMG}/q8/memo_2.png`],
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
    question: 'Four rivers are described. Which one has a graded longitudinal profile?',
    metadata: [
      'River Q: a steep curve with a waterfall and rapids',
      'River P: a smooth, concave curve from source to mouth with no waterfalls, lakes or dams',
      'River R: a step-like profile interrupted by a large dam',
      'River S: an almost straight, steep slope from source to mouth',
      '',
    ],
    answer: ['River P: a smooth, concave curve from source to mouth with no waterfalls, lakes or dams', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'river_profiles_and_base_levels',
    skills: ['graded_profile_features'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- A graded river has balanced erosion and deposition along its whole length.\n- Look for features that interrupt a smooth profile.',
  },
  {
    name: 'Question 2',
    question: 'Match each feature to the correct type of base level.',
    metadata: [
      'A - Waterfall',
      'B - Dam',
      'C - Inland lake',
      'D - Sea',
      '1 - A temporary base level that is human-made and traps sediment',
      '2 - A temporary base level formed where a river enters still water inland',
      '3 - A temporary base level formed by a band of resistant rock',
      '4 - The permanent base level, the lowest limit of erosion',
    ],
    answer: ['A-3', 'B-1', 'C-2', 'D-4'],
    presentation: 'match',
    type: 'definition',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'river_profiles_and_base_levels',
    skills: ['base_level_classification'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Sort the features into natural or human-made first, then into temporary or permanent.\n- Only one feature is the ultimate limit to downcutting.',
  },
  {
    name: 'Question 3',
    question: 'A river\'s cross-profile is narrow, deep and steep-sided. Which course of the river does it represent, and which process dominates?',
    metadata: [
      'Lower course, where deposition dominates',
      'Middle course, where lateral erosion dominates',
      'Lower course, where lateral erosion widens the valley',
      'Upper course, where vertical erosion dominates',
      '',
    ],
    answer: ['Upper course, where vertical erosion dominates', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'river_profiles_and_base_levels',
    skills: ['cross_profile_upper_course'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- A narrow, steep-sided channel is cut downwards much faster than it is widened.\n- Steep gradients give the river energy for cutting down.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL changes that normally occur as a river flows from its upper course to its lower course.',
    metadata: [
      'The load is mostly large boulders',
      'The channel becomes wider',
      'The gradient becomes gentler',
      'Vertical erosion becomes the dominant process',
      'Deposition becomes more important than erosion',
    ],
    answer: ['The channel becomes wider', 'The gradient becomes gentler', 'Deposition becomes more important than erosion', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'river_profiles_and_base_levels',
    skills: ['upper_to_lower_course_changes'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Compare the upper and lower courses for slope, load size and dominant process.\n- Two of the options describe the upper course instead.',
  },
  {
    name: 'Question 5',
    question: 'A dam is built across a river in its middle course. What happens immediately upstream of the dam?',
    metadata: [
      'Vertical erosion increases because the water is deeper',
      'The river is rejuvenated and cuts a gorge',
      'Velocity drops and sediment is deposited, flattening the local gradient',
      'The gradient steepens as the water level falls',
      '',
    ],
    answer: ['Velocity drops and sediment is deposited, flattening the local gradient', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'river_profiles_and_base_levels',
    skills: ['temporary_base_level_effects'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- A dam is a temporary base level: the river cannot erode below it.\n- Think about what slowing water does to its ability to carry sediment.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.3.1',
      marks: 2,
      clues: '- A longitudinal profile follows the river along its length.\n- State where the view starts and ends.',
      approach: '- Describe the direction of the view.\n- Mention the start and end points of the river.',
      solution: '1. A longitudinal profile is a side view of a river.\n2. It runs from the source to the mouth, showing how the height of the channel changes.',
    },
    {
      number: '2.3.2',
      marks: 1,
      clues: '- Compare the two sketches for a smooth curve.\n- A graded profile has no interruptions.',
      approach: '- Look for the profile without obstructions.\n- Choose the smoother concave sketch.',
      solution: '1. Sketch A has a waterfall and a dam interrupting the curve.\n2. Sketch B is a smooth concave curve.\n3. Answer: B.',
    },
    {
      number: '2.3.3',
      marks: 2,
      clues: '- Use two features you can see in sketch B.\n- Compare B with the interrupted profile in A.',
      approach: '- Note what is absent in B.\n- Describe the shape of the curve.',
      solution: '1. There are no temporary base levels or knickpoints in sketch B.\n2. There are no obstructions such as dams or waterfalls.\n3. The profile is a smooth concave curve; any two of these earn the marks.',
    },
    {
      number: '2.3.4',
      marks: 2,
      clues: '- A temporary base level can be a natural feature or one built by people.\n- Classify each labelled feature.',
      approach: '- Identify the two temporary base levels labelled in sketch A.\n- Decide whether nature or people created each.',
      solution: '1. The waterfall forms where a band of resistant rock holds up erosion, so it is natural.\n2. The dam is built by people, so it is human-made.',
    },
    {
      number: '2.3.5',
      marks: 2,
      clues: '- Think about what the sea level limits.\n- Rivers can only erode down to a certain height.',
      approach: '- Define the permanent base level.\n- Link it to the sea.',
      solution: '1. The sea marks the lowest level to which a river can erode.\n2. That makes it the ultimate, permanent base level.',
    },
    {
      number: '2.3.6',
      marks: 2,
      clues: '- Name the shape of each cross-profile and mention both.\n- Use words like narrow, deep, wide and gently sloping.',
      approach: '- Describe profile C.\n- Describe profile D.\n- Compare them in one sentence.',
      solution: '1. Profile C is a closed V shape: narrow, deep and steep-sided.\n2. Profile D is an open U shape: very wide and gently sloping.',
    },
    {
      number: '2.3.7',
      marks: 4,
      clues: '- Give the dominant process for each profile.\n- Link each process to the river\'s course.',
      approach: '- Explain the process that shapes profile C in the upper course.\n- Explain the process that shapes profile D in the lower course.\n- Refer to both profiles to gain full marks.',
      solution: '1. Profile C: vertical (downward) erosion dominates in the steep upper course, cutting a narrow V.\n2. Profile D: deposition dominates in the lower course.\n3. Lateral erosion also widens the valley, producing the open U shape.',
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
