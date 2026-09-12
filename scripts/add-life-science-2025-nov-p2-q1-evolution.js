#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 1 (Evolution) (order 4)
 *
 * Bundles real sub-items 1.1.3 (punctuated equilibrium, from the Q1.1 MCQ block) and
 * 1.2.6, 1.2.7 (extinction, continuous variation, from the Q1.2 biological-term block) —
 * the last of the four Q1.1-1.3 knowledge-area clusters per subjects/dbe-life-sciences.md's
 * paper-structure table. 4 real marks — the smallest cluster, so 4 practice questions
 * (not the usual ~1-per-sub-part) to still satisfy DESIGN-UNI-07's 3-distinct-type
 * variety floor for a 4+ question set. Independent lesson (DESIGN-UNI-13).
 *
 * unit/topic differ from the other three Q1 lessons: this is CAPS Strand 4 (Diversity,
 * Change and Continuity) content, not Strand 1 — new curriculum nodes needed.
 *
 * Curriculum nodes NOT yet created in Postgres for this unit/topic — same status as the
 * other three Q1 scripts.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q1-evolution.js
 *   node scripts/add-life-science-2025-nov-p2-q1-evolution.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q1-evolution.js
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
  name: 'Question 1 (Evolution)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 40,
  tags: ['evolution_by_natural_selection', 'variation'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q4/question_1.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q4/question_2.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q4/memo_1.png"],
  exam_question_marks: 4,
};

const questions = [
  {
    name: 'Question 1',
    question:
      'Fossils of a particular mollusc species show almost no change in shell shape for 3 million years, then a series of fossils spanning only 50,000 years shows the shell shape changing dramatically. Which theory of evolutionary change does this fossil record best support?',
    metadata: ['Lamarckism', 'Punctuated equilibrium', 'Gradualism (constant, slow change)', 'Special creation (no change over time)', ''],
    answer: ['Punctuated equilibrium', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'punctuated_equilibrium_vs_gradualism',
    skills: ['apply_punctuated_equilibrium_to_evidence'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- Compare how much time passed during the stable period versus the changing period.\n- Look for a pattern of long stasis interrupted by a short burst, not a steady rate throughout.",
  },
  {
    name: 'Question 2',
    question: 'Match each theory of evolution to its correct description.',
    metadata: [
      'A - Lamarckism',
      'B - Darwinism (Natural Selection)',
      'C - Punctuated Equilibrium',
      "1 - Characteristics acquired during an organism's lifetime are passed on to its offspring",
      '2 - Individuals with favourable variations survive and reproduce more successfully, passing those variations to offspring over many generations',
      '3 - Long periods of little or no change are interrupted by short bursts of rapid change',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'definition',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'evolution_theory_comparison',
    skills: ['compare_evolution_theories'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Lamarckism and Darwinism disagree about what gets inherited — a lifetime change, or a pre-existing variation.\n- Punctuated Equilibrium is about the PACE of change over time, not about how inheritance works at all.',
  },
  {
    name: 'Question 3',
    question:
      'A species that has completely disappeared from Earth, with no living members remaining anywhere, is said to be...?',
    metadata: ['Endangered', 'Extinct', 'Vulnerable', 'Dormant', ''],
    answer: ['Extinct', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'species_extinction',
    skills: ['define_extinction'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- "Endangered" and "vulnerable" both still have living members, just at risk.\n- This term describes a species with zero living members left, anywhere.',
  },
  {
    name: 'Question 4',
    question: 'Which of the following are examples of CONTINUOUS variation in humans?',
    metadata: ['Height', 'Body mass (weight)', 'ABO blood group', 'Skin colour', 'Ability to roll the tongue (present or absent)'],
    answer: ['Height', 'Body mass (weight)', 'Skin colour', '', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'continuous_vs_discontinuous_variation',
    skills: ['classify_variation_type'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Continuous variation forms an unbroken range of values, with no clear-cut categories.\n- Blood group and tongue-rolling instead sort every person into one of a small number of distinct, separate categories.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1.3',
      marks: 2,
      clues: '- This theory is about the PACE of evolutionary change over time.\n- Consider whether the pattern involves constant change, or change that is uneven over time.',
      approach: '- Recall what punctuated equilibrium proposes about the rate of evolutionary change.\n- Eliminate options describing Lamarckism (acquired characteristics) or gradualism (constant, slow change).\n- Match the remaining option to the correct description.',
      solution: '1. Punctuated equilibrium proposes that species show long periods of little or no change.\n2. These stable periods are interrupted by short bursts of rapid change.\n3. This matches option C.',
    },
    {
      number: '1.2.6',
      marks: 1,
      clues: '- This term describes a species with NO living members remaining anywhere.\n- It is different from a species merely being at risk.',
      approach: '- Consider what it means for a species to have zero living members remaining anywhere.\n- Recall the specific term for this permanent disappearance.',
      solution: '1. The permanent disappearance of a species, with no living members remaining, is called extinction.',
    },
    {
      number: '1.2.7',
      marks: 1,
      clues: '- This type of variation forms an unbroken range of values.\n- It contrasts with variation that falls into a small number of distinct, separate categories.',
      approach: '- Consider whether the trait forms an unbroken range of values or falls into a small number of distinct categories.\n- Recall the specific term for variation showing a full range of intermediate values.',
      solution: '1. Variation showing a continuous range of intermediate phenotypes is called continuous variation.',
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
