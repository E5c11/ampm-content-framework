#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2024 — Question 11 (order 11)
 * Probability: three-set Venn diagram, at least two subjects, independent events.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p1-q11.js --curriculum temp/curriculum-vocab-maths.json
 *   node scripts/add-maths-2024-nov-p1-q11.js --dry-run
 *   node scripts/add-maths-2024-nov-p1-q11.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2024/nov_p1';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 11',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p1',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['venn_diagrams', 'independent_events'],
  question_image_urls: [`${IMG}/q11/question_1.png`],
  memo_image_urls: [`${IMG}/q11/memo_1.png`],
  exam_question_marks: 9,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'In a sports club, 22 members play soccer. Of these, 12 play only soccer, 5 play soccer and tennis but not golf, and 3 play soccer and golf but not tennis. How many members play all three sports?',
    metadata: ['Number of members = ', '[ ]'],
    answer: ['2', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'probability',
    topic: 'basic_probability',
    subtopic: 'venn_diagrams',
    skills: ['venn_diagram_reasoning'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- The four regions inside the soccer circle must add up to the soccer total.',
  },
  {
    name: 'Question 2',
    question: 'In a survey of 50 learners, 6 like only reading, 9 like only music, 7 like only sport, 4 like reading and music only, 3 like music and sport only, 5 like reading and sport only, 2 like all three, and the rest like none of these. A learner is chosen at random. Calculate, as a decimal, the probability that the learner likes at least TWO of these activities.',
    metadata: ['P = ', '[ ]'],
    answer: ['0.28', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'probability',
    topic: 'basic_probability',
    subtopic: 'venn_diagrams',
    skills: ['counting_favourable_outcomes', 'venn_diagram_reasoning'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- "At least two" means exactly two of the activities or all three.\n- Divide by the total number of learners in the survey.',
  },
  {
    name: 'Question 3',
    question: 'In a group of 50 people, 22 own a car (C), 19 own a bicycle (B) and 7 own both. Are the events C and B independent?',
    metadata: [
      'Yes, since P(C) × P(B) = 0.1672 and P(C and B) = 0.1672',
      'Yes, since P(C) + P(B) = 0.82 and P(C or B) = 0.68',
      'No, since P(C and B) = 0.14, which is not equal to 0',
      'No, since P(C) × P(B) = 0.1672 and P(C and B) = 0.14',
      '',
    ],
    answer: ['No, since P(C) × P(B) = 0.1672 and P(C and B) = 0.14', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'probability',
    topic: 'basic_probability',
    subtopic: 'independent_events',
    skills: ['independence_formula', 'multiplying_probabilities'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Two events are independent when P(A and B) = P(A) × P(B).\n- Calculate both sides and compare them.',
  },
  {
    name: 'Question 4',
    question: 'These steps complete a three-set Venn diagram from given totals, but they are in the wrong order. Arrange them in the correct order.',
    metadata: [
      'Use each set total to find the region for that set only',
      'Use the overall total to find the number in no set',
      'Write the number in all three sets in the centre',
      'Fill in the regions shared by exactly two sets',
    ],
    answer: [
      'Write the number in all three sets in the centre',
      'Fill in the regions shared by exactly two sets',
      'Use each set total to find the region for that set only',
      'Use the overall total to find the number in no set',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'probability',
    topic: 'basic_probability',
    subtopic: 'venn_diagrams',
    skills: ['venn_diagram_reasoning', 'logical_sequence'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Start from the region that belongs to the most sets and work outwards.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '11.1',
      marks: 3,
      clues: '- Start with the regions you are given, then use the totals for M, T and G to find the rest.',
      approach: '- Given: M and T only = 5, M and G only = 4, T and G only = 3, T only = 6.\n- From the Tourism total of 16, the centre is 16 − 6 − 5 − 3 = 2.\n- Then M only = 22 − 5 − 4 − 2 = 11 and G only = 18 − 4 − 3 − 2 = 9.',
      solution: '1. All three (centre) = 16 − (6 + 5 + 3) = 2\n2. M only = 22 − (5 + 4 + 2) = 11\n3. G only = 18 − (4 + 3 + 2) = 9\n4. Regions: M only 11, T only 6, G only 9, M and T only 5, M and G only 4, T and G only 3, all three 2\n5. Total = 11 + 6 + 9 + 5 + 4 + 3 + 2 = 40 learners',
    },
    {
      number: '11.2',
      marks: 2,
      clues: '- "At least two" means exactly two subjects or all three.',
      approach: '- Add the regions that are in two or three sets: 5 + 4 + 3 + 2 = 14.\n- Divide by the total of 40 learners.',
      solution: '1. n(at least two) = 4 + 2 + 5 + 3 = 14\n2. P(at least two) = 14/40 = 7/20 = 0.35',
    },
    {
      number: '11.3',
      marks: 4,
      clues: '- Compare P(M and T) with P(M) × P(T).',
      approach: '- P(M) = 22/40 and P(T) = 16/40.\n- P(M and T) = (5 + 2)/40 = 7/40.\n- If the product is not equal to P(M and T), the events are not independent.',
      solution: '1. P(M) × P(T) = 22/40 × 16/40 = 11/50 = 0.22\n2. P(M and T) = 7/40 = 0.175\n3. 0.22 ≠ 0.175\n4. The events are not independent.',
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
