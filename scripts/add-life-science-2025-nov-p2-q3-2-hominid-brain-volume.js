#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 3.2 (Hominid Brain Volume) (order 13)
 *
 * Real Q3.2 (13 marks) is built around a species/brain-volume table — DESIGN-UNI-10
 * rule 1, one lesson. Fresh practice questions give the table data inline as text in
 * each question (species names + volumes stated directly), same approach as the blood-
 * group percentage lesson — a table is fundamentally a small dataset, not something that
 * needs a rendered image to be usable. Fresh species selection (6 species across 4
 * genera, including Paranthropus and Sahelanthropus — not used in the real exam's table)
 * and fresh volume figures, not the real exam's own 5-species/3-genera set (DESIGN-UNI-01).
 *
 * Topic reuses `human_evolution` (add-life-science-2025-nov-p2-q3-1-human-evolution-
 * anatomy.js). Independent lesson (DESIGN-UNI-13).
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q3-2-hominid-brain-volume.js
 *   node scripts/add-life-science-2025-nov-p2-q3-2-hominid-brain-volume.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q3-2-hominid-brain-volume.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const video = {
  name: 'Question 3.2 (Hominid Brain Volume)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 13,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['human_evolution', 'hominid_fossils'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q13/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q13/memo_1.png"],
  exam_question_marks: 13,
};

const questions = [
  {
    name: 'Question 1',
    question:
      'The table below shows the average brain volume of six hominid species: Sahelanthropus tchadensis (360 mL), Australopithecus afarensis (440 mL), Paranthropus boisei (510 mL), Homo habilis (640 mL), Homo erectus (980 mL), Homo sapiens (1350 mL). How many different genera are represented in this table?',
    metadata: ['= ', '[ ]'],
    answer: ['4', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'diversity_change_and_continuity',
    topic: 'human_evolution',
    subtopic: 'hominid_genera_count',
    skills: ['count_hominid_genera'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The genus is the first word of a two-word scientific name.\n- Three of the six species share the same first word.',
  },
  {
    name: 'Question 2',
    question:
      'Using the same six hominid species — Sahelanthropus tchadensis (360 mL), Australopithecus afarensis (440 mL), Paranthropus boisei (510 mL), Homo habilis (640 mL), Homo erectus (980 mL), Homo sapiens (1350 mL) — arrange them in order from SMALLEST to LARGEST average brain volume.',
    metadata: ['Homo erectus', 'Sahelanthropus tchadensis', 'Paranthropus boisei', 'Homo habilis', 'Australopithecus afarensis', 'Homo sapiens'],
    answer: ['Sahelanthropus tchadensis', 'Australopithecus afarensis', 'Paranthropus boisei', 'Homo habilis', 'Homo erectus', 'Homo sapiens'],
    presentation: 'ordering',
    type: 'application',
    unit: 'diversity_change_and_continuity',
    topic: 'human_evolution',
    subtopic: 'hominid_brain_volume_sequence',
    skills: ['sequence_hominid_brain_volumes'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Compare each volume figure directly against the others.\n- Read each species\' number carefully — genus name alone doesn\'t tell you the order.',
  },
  {
    name: 'Question 3',
    question:
      'Using the same table (Homo habilis: 640 mL, Homo sapiens: 1350 mL), calculate the percentage increase in average brain volume between Homo habilis and Homo sapiens. Round your answer to the nearest whole number.',
    metadata: ['= ', '[ ]', '%'],
    answer: ['111', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'diversity_change_and_continuity',
    topic: 'human_evolution',
    subtopic: 'hominid_brain_volume_percentage_change',
    skills: ['calculate_brain_volume_percentage_change'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Percentage increase = (increase ÷ original value) × 100.\n- The "increase" is the difference between the two volumes, and the "original value" is the earlier species\' volume.',
  },
  {
    name: 'Question 4',
    question:
      "Soft brain tissue decomposes completely after death and is never preserved as a fossil. How, then, can scientists determine a fossil hominid's brain volume?",
    metadata: [
      'By measuring the internal volume of the fossilised skull (cranium), which reflects the space the brain once occupied',
      'By extracting and directly weighing preserved brain tissue',
      'Brain volume cannot be determined from fossils at all',
      "By comparing the fossil's DNA to that of living species",
      '',
    ],
    answer: ['By measuring the internal volume of the fossilised skull (cranium), which reflects the space the brain once occupied', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'diversity_change_and_continuity',
    topic: 'human_evolution',
    subtopic: 'fossil_brain_volume_determination',
    skills: ['explain_fossil_brain_volume_method'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The bone that surrounded the brain does fossilise, even though the brain itself does not.\n- The empty space inside that bone is a reliable stand-in for the size of what once filled it.',
  },
  {
    name: 'Question 5',
    question:
      'Across the hominid fossil record, increasing average brain volume over time is generally associated with which trend in the archaeological record?',
    metadata: [
      'Increasingly complex tools and other cultural evidence appear over time',
      'Tool use and cultural complexity decrease as brain volume increases',
      'There is no relationship between brain volume and cultural evidence',
      'Cultural evidence appears suddenly, unrelated to any anatomical change',
      '',
    ],
    answer: ['Increasingly complex tools and other cultural evidence appear over time', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'diversity_change_and_continuity',
    topic: 'human_evolution',
    subtopic: 'brain_volume_cultural_evidence_link',
    skills: ['relate_brain_volume_to_culture'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A larger brain is generally associated with greater cognitive and problem-solving capacity.\n- Look for the option where cultural complexity tracks brain size in the same direction, not the opposite direction.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '3.2.1',
      marks: 1,
      clues: '- The genus is the first word of each two-word scientific species name.\n- Some species in the table share the same first word.',
      approach: '- List the first word (genus) of each species name in the table.\n- Count how many distinct genus names appear.',
      solution: '1. The six species names give genus names: Sahelanthropus, Australopithecus, Paranthropus, Homo, Homo, Homo.\n2. There are 4 distinct genera: Sahelanthropus, Australopithecus, Paranthropus, and Homo.',
    },
    {
      number: '3.2.2',
      marks: 2,
      clues: '- Read each species\' brain volume figure carefully rather than assuming order from genus alone.\n- Line up all six values from smallest to largest before answering.',
      approach: '- List all six brain volume values alongside their species names.\n- Sort them from smallest to largest.\n- Read off the species in that order.',
      solution: '1. The six brain volumes, sorted smallest to largest, are: Sahelanthropus tchadensis (360), Australopithecus afarensis (440), Paranthropus boisei (510), Homo habilis (640), Homo erectus (980), Homo sapiens (1350).',
    },
    {
      number: '3.2.3',
      marks: 3,
      clues: '- This calculation compares two specific values from the table using a percentage-increase formula.\n- Divide the increase by the original (smaller) value, then convert to a percentage.',
      approach: '- Identify the two brain volume values needed for the calculation (Homo habilis and Homo sapiens).\n- Calculate the increase (larger value minus smaller value).\n- Divide the increase by the original value and multiply by 100.',
      solution: '1. Percentage increase = (increase ÷ original value) × 100.\n2. (1350 − 640) ÷ 640 × 100 = 710 ÷ 640 × 100 ≈ 110.9%.\n3. Rounded to the nearest whole number, this is approximately 111%.',
    },
    {
      number: '3.2.4',
      marks: 1,
      clues: '- Soft brain tissue does not survive fossilisation.\n- Consider what part of the skull DOES survive, and what it can tell us.',
      approach: '- Recall what structure remains as a fossil, even though brain tissue itself does not.\n- Explain how this structure relates to the original brain size.',
      solution: '1. The cranium (skull) becomes fossilised, even though the brain tissue itself decomposes.\n2. Since the cranium houses the brain, measuring its internal (cranial) capacity gives an estimate of the original brain volume.',
    },
    {
      number: '3.2.5',
      marks: 2,
      clues: '- Consider what larger brain volume is generally associated with, in terms of behaviour and ability.\n- Connect this ability to evidence found alongside fossils, such as tools.',
      approach: '- Recall what increased brain volume across hominid evolution is generally associated with in terms of intelligence.\n- Connect increased intelligence to the appearance of more complex cultural evidence, such as tools, in the fossil record.',
      solution: '1. Increasing brain volume across the hominid fossil record is generally associated with increasing intelligence.\n2. This increased intelligence is reflected in the appearance of increasingly complex tools and other cultural evidence over time.',
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
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
