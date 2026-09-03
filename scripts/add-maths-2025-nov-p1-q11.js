#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2025 — Question 11 (order 11)
 * Probability and counting: independent events in a two-way table,
 * probability without replacement, the block-counting method, total arrangements.
 *
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p1-q11.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p1-q11.js --dry-run
 *   node scripts/add-maths-2025-nov-p1-q11.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2025/nov_p1';

const video = {
  name: 'Question 11',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p1',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['basic_probability', 'counting_principles', 'independent_events', 'fundamental_counting'],
  question_image_urls: [`${IMG}/q11/question_1.png`],
  memo_image_urls: [`${IMG}/q11/memo_1.png`, `${IMG}/q11/memo_2.png`, `${IMG}/q11/memo_3.png`],
  exam_question_marks: 16,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'In a group of 200 people, 80 wear glasses and 120 are female. Wearing glasses and being female are independent events. Determine how many females wear glasses.',
    metadata: ['number of females who wear glasses = ', '[ ]'],
    answer: ['48', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'probability',
    topic: 'basic_probability',
    subtopic: 'independent_events',
    skills: ['independence_formula', 'multiplying_probabilities'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- For independent events P(A and B) = P(A) × P(B).\n- Multiply that probability by the total number of people.',
  },
  {
    name: 'Question 2',
    question: 'A bag contains 5 red and 3 blue balls. Two balls are drawn at random without replacement. Determine the probability that both balls are red, correct to TWO decimal places.',
    metadata: ['P(both red) = ', '[ ]'],
    answer: ['0.36', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'probability',
    topic: 'basic_probability',
    subtopic: 'consecutive_events',
    skills: ['multiplying_probabilities', 'sample_space'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- After the first red ball is drawn, both the number of red balls and the total decrease by 1.\n- Multiply the probability of the first red by the probability of the second red.',
  },
  {
    name: 'Question 3',
    question: 'Six books are arranged in a row on a shelf. Two particular books, P and Q, must be next to each other with P immediately before Q. These steps count the number of arrangements, but are in the wrong order. Arrange them correctly.',
    metadata: [
      'There are 5! ways to arrange the 5 items',
      'Treat P and Q as a single block, giving 5 items',
      'P must come immediately before Q, so the block has only 1 internal order',
      'Total = 5! = 120',
    ],
    answer: [
      'Treat P and Q as a single block, giving 5 items',
      'P must come immediately before Q, so the block has only 1 internal order',
      'There are 5! ways to arrange the 5 items',
      'Total = 5! = 120',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'probability',
    topic: 'counting_principles',
    subtopic: 'counting_with_restriction',
    skills: ['counting_principle', 'applying_restrictions', 'counting_consecutive_pairs'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Tie the two restricted items together and treat them as one item.\n- Count the arrangements of the reduced set, then account for the fixed internal order.',
  },
  {
    name: 'Question 4',
    question: 'In how many different ways can the six letters of the word NUMBER be arranged in a row?',
    metadata: ['6', '720', '36', '120', ''],
    answer: ['720', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'probability',
    topic: 'counting_principles',
    subtopic: 'fundamental_counting_with_restriction',
    skills: ['fundamental_counting_principle', 'sample_space'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- All six letters are different, so any letter can go in any position.\n- The number of arrangements of n different objects is n!.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '11.1.1',
      marks: 3,
      clues: '- For independent events P(Male and Juice) = P(Male) × P(Juice).\n- Express each probability over the total of 210 and solve for e.',
      approach: '- P(Male) = \\frac{90}{210} (36 + 54).\n- P(prefers juice) = \\frac{e}{210}.\n- P(Male and prefers juice) = \\frac{36}{210}.\n- Set \\frac{36}{210} = \\frac{90}{210} × \\frac{e}{210} and solve.',
      solution: '1. P(M and J) = P(M) × P(J)\n2. \\frac{36}{210} = \\frac{90}{210} × \\frac{e}{210}\n3. 36 = \\frac{90e}{210}\n4. ∴ e = 84',
    },
    {
      number: '11.1.2',
      marks: 3,
      clues: '- Work out the missing table entries using the row and column totals.\n- The required probability is (females who like energy drinks) ÷ 210.',
      approach: '- Total juice e = 84, so total energy drinks d = 210 − 84 = 126.\n- Male energy drinks = 54, so female energy drinks b = 126 − 54 = 72.\n- P(female and energy drinks) = \\frac{72}{210}.',
      solution: '1. d = 210 − 84 = 126\n2. b = 126 − 54 = 72\n3. P(female and likes energy drinks) = \\frac{72}{210} = \\frac{12}{35} ≈ 0.34',
    },
    {
      number: '11.2',
      marks: 4,
      clues: '- Let the chance of buying coffee on a non-rainy day be x; on a rainy day it is 3x.\n- Use the law of total probability with P(rain) = 0.75 to solve for x, then multiply by 120.',
      approach: '- Let P(coffee | non-rainy) = x, so P(coffee | rainy) = 3x.\n- P(coffee) = 0.75(3x) + 0.25(x) = \\frac{7}{12}.\n- Solve for x.\n- Number of non-rainy-day coffees = 120x.',
      solution: '1. 0.75(3x) + 0.25(x) = \\frac{7}{12}\n2. 2.5x = \\frac{7}{12}\n3. x = \\frac{7}{30}\n4. Cups on a non-rainy day = 120 × \\frac{7}{30} = 28',
    },
    {
      number: '11.3.1',
      marks: 2,
      clues: '- Bongi must be immediately after Andrew, so tie them together as one block.\n- Arrange the resulting 7 items.',
      approach: '- Treat "Andrew then Bongi" as a single block.\n- This leaves 7 items to arrange (the block plus the other 6 runners).\n- The block has only one internal order.',
      solution: '1. Tie Andrew and Bongi into one block ⟹ 7 items\n2. Arrangements = 7!\n3. ∴ 7! = 5 040',
    },
    {
      number: '11.3.2',
      marks: 4,
      clues: '- Count the finishing orders where at least 2 of the other 6 runners are between Andrew and Bongi.\n- Divide by the total number of orders, 8!.',
      approach: '- List the gap sizes between Andrew and Bongi (Andrew before Bongi) that leave 2, 3, 4 or 5 runners between them.\n- Each case contributes a multiple of 6! favourable orders.\n- Sum the favourable outcomes and divide by 8!.',
      solution: '1. Favourable = 5(6!) + 4(6!) + 3(6!) + 2(6!) + 1(6!) = 6!(15)\n2. Total orders = 8!\n3. P = \\frac{6!(15)}{8!} = \\frac{15}{56} ≈ 0.27',
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
