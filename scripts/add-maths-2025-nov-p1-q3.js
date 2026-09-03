#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2025 — Question 3 (order 3)
 * Quadratic (second-difference) number patterns: extending the sequence,
 * general term, maximum/minimum term, solving Tn = value.
 *
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p1-q3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p1-q3.js --dry-run
 *   node scripts/add-maths-2025-nov-p1-q3.js
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
  name: 'Question 3',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p1',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['quadratic_sequence', 'general_term', 'second_difference', 'maximum_value'],
  question_image_urls: [`${IMG}/q3/question_1.png`],
  memo_image_urls: [`${IMG}/q3/memo_1.png`],
  exam_question_marks: 10,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'The first four terms of a quadratic sequence are 4; 13; 28; 49; … Which expression gives the general term Tₙ?',
    metadata: ['3n² − 1', '3n² + 1', '3n + 1', 'n² + 3', ''],
    answer: ['3n² + 1', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'number_patterns',
    topic: 'quadratic_sequence',
    subtopic: 'general_term',
    skills: ['second_difference', 'general_term_formula', 'simultaneous_equations_abc'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The second difference equals 2a, which gives the coefficient of n².\n- Use two terms to set up equations for the remaining coefficients, then test your Tₙ on a known term.',
  },
  {
    name: 'Question 2',
    question: 'The first four terms of a quadratic sequence are 2; 8; 18; 32; … Determine the 7th term.',
    metadata: ['T₇ = ', '[ ]'],
    answer: ['98', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'number_patterns',
    topic: 'quadratic_sequence',
    subtopic: 'extending_the_sequence',
    skills: ['second_difference', 'first_difference_extension', 'logical_sequence'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The second difference is constant — work it out from the first differences.\n- Extend the first differences forward, then keep adding them to reach the 7th term.',
  },
  {
    name: 'Question 3',
    question: 'A quadratic sequence has general term Tₙ = 2n² − 20n + 3. Determine the value of the smallest term in the sequence.',
    metadata: ['smallest term = ', '[ ]'],
    answer: ['−47', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'number_patterns',
    topic: 'quadratic_sequence',
    subtopic: 'minimum_term',
    skills: ['turning_point', 'minimum_of_quadratic', 'evaluating_at_point'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The smallest term is at the turning point of the quadratic — find n = −\\frac{b}{2a}.\n- Substitute that whole-number n back into Tₙ.',
  },
  {
    name: 'Question 4',
    question: 'For the quadratic sequence Tₙ = −n² + 20n − 4, these steps find the values of n for which Tₙ = 60, but are in the wrong order. Arrange them correctly.',
    metadata: [
      'n = 4 or n = 16',
      'Set −n² + 20n − 4 = 60',
      'Factorise: (n − 4)(n − 16) = 0',
      'Rearrange to n² − 20n + 64 = 0',
    ],
    answer: [
      'Set −n² + 20n − 4 = 60',
      'Rearrange to n² − 20n + 64 = 0',
      'Factorise: (n − 4)(n − 16) = 0',
      'n = 4 or n = 16',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'number_patterns',
    topic: 'quadratic_sequence',
    subtopic: 'finding_term_number',
    skills: ['equating_general_term', 'factorizing_trinomials', 'solving_quadratic'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Set the general term equal to the target value and bring everything to one side.\n- Factorise the quadratic in n; both positive whole-number solutions are valid term numbers.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1',
      marks: 2,
      clues: '- The pattern is quadratic, so the second difference is constant.\n- Extend the first differences, then add them on to reach the 4th and 5th terms.',
      approach: '- First differences of 36, 71, 104 are 35 and 33, so the second difference is −2.\n- The next first differences are 31 and 29.\n- Add these on: T₄ = 104 + 31 and T₅ = T₄ + 29.',
      solution: '1. 36 ; 71 ; 104 → first differences 35 ; 33 (second difference −2)\n2. Next first differences: 31 ; 29\n3. T₄ = 104 + 31 = 135\n4. T₅ = 135 + 29 = 164',
    },
    {
      number: '3.2',
      marks: 3,
      clues: '- For Tₙ = an² + bn + c, the second difference equals 2a.\n- Use the first difference and the first term to find b and c.',
      approach: '- Second difference = 2a = −2, so a = −1.\n- The first difference between T₁ and T₂ gives 3a + b = 35.\n- T₁ = 36 gives a + b + c = 36.\n- Solve for b and c.',
      solution: '1. 2a = −2 ⟹ a = −1\n2. 3a + b = 35 ⟹ 3(−1) + b = 35 ⟹ b = 38\n3. a + b + c = 36 ⟹ −1 + 38 + c = 36 ⟹ c = −1\n4. ∴ Tₙ = −n² + 38n − 1',
    },
    {
      number: '3.3',
      marks: 3,
      clues: '- The maximum term is at the turning point of the quadratic Tₙ.\n- Find n = −\\frac{b}{2a} (a whole number here), then substitute back into Tₙ.',
      approach: '- Tₙ = −n² + 38n − 1 has a maximum since a < 0.\n- The turning point is at n = −\\frac{b}{2a} = −\\frac{38}{2(−1)} = 19.\n- Substitute n = 19 into Tₙ.',
      solution: '1. n = −\\frac{38}{2(−1)} = 19\n2. T₁₉ = −(19)² + 38(19) − 1\n3. T₁₉ = −361 + 722 − 1 = 360\n4. ∴ maximum depth = 360 m',
    },
    {
      number: '3.4',
      marks: 2,
      clues: '- Set Tₙ = 104 and solve the resulting quadratic in n.\n- Two positive values of n satisfy it — the larger one is the "second time".',
      approach: '- Solve −n² + 38n − 1 = 104.\n- Rearrange to n² − 38n + 105 = 0.\n- Factorise and read off the two values of n.\n- The second time the depth is 104 m corresponds to the larger n.',
      solution: '1. −n² + 38n − 1 = 104\n2. n² − 38n + 105 = 0\n3. (n − 35)(n − 3) = 0\n4. n = 3  or  n = 35\n5. ∴ the second time is after 35 seconds',
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
