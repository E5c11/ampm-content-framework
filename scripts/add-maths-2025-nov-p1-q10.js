#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2025 — Question 10 (order 10)
 * Optimisation with calculus: setting up a model, finding the maximising value,
 * the second-derivative test, expressing one variable in terms of another.
 *
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p1-q10.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p1-q10.js --dry-run
 *   node scripts/add-maths-2025-nov-p1-q10.js
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
  name: 'Question 10',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p1',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['maximum_value', 'derivative_applications', 'differentiation_rules', 'stationary_point'],
  question_image_urls: [`${IMG}/q10/question_1.png`],
  memo_image_urls: [`${IMG}/q10/memo_1.png`],
  exam_question_marks: 6,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'A farmer has 80 m of fencing for a rectangular enclosure against a straight wall, so only three sides are fenced. These steps find the width x that maximises the area, but are in the wrong order. Arrange them correctly.',
    metadata: [
      'A(x) = x(80 − 2x) = 80x − 2x²',
      'Length in terms of x: L = 80 − 2x',
      'Solve A\u2032(x) = 0: 80 − 4x = 0 ⟹ x = 20',
      'Differentiate: A\u2032(x) = 80 − 4x',
    ],
    answer: [
      'Length in terms of x: L = 80 − 2x',
      'A(x) = x(80 − 2x) = 80x − 2x²',
      'Differentiate: A\u2032(x) = 80 − 4x',
      'Solve A\u2032(x) = 0: 80 − 4x = 0 ⟹ x = 20',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'calculus',
    topic: 'cubic_analysis',
    subtopic: 'maximum_value',
    skills: ['expressing_in_terms_of_given_value', 'setting_derivative_to_zero', 'substitution_into_equation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Write the quantity to be maximised as a function of one variable using the constraint.\n- Differentiate and set the derivative to zero.',
  },
  {
    name: 'Question 2',
    question: 'The volume of an open box is modelled by V(x) = 12x² − x³, where x > 0. Determine the value of x that gives the maximum volume.',
    metadata: ['x = ', '[ ]'],
    answer: ['8', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'calculus',
    topic: 'cubic_analysis',
    subtopic: 'maximum_value',
    skills: ['setting_derivative_to_zero', 'factorizing', 'selecting_maximum'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Differentiate V and set V\u2032(x) = 0.\n- Factorise and choose the positive, non-zero solution.',
  },
  {
    name: 'Question 3',
    question: 'For V(x) = 30x² − x³ a stationary point occurs at x = 20. Which test confirms that this stationary point is a maximum?',
    metadata: [
      'Check that V(0) > 0',
      'Show that V\u2033(20) < 0',
      'Show that V\u2032(20) > 0',
      'Check that x = 20 is positive',
      '',
    ],
    answer: ['Show that V\u2033(20) < 0', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'calculus',
    topic: 'cubic_analysis',
    subtopic: 'maximum_value',
    skills: ['second_derivative', 'stationary_point_definition'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- A stationary point is a local maximum when the graph is concave down there.\n- Concave down means the second derivative is negative.',
  },
  {
    name: 'Question 4',
    question: 'A rectangular sheet has perimeter 60 units, with sides of length x and h. Which expression gives h in terms of x?',
    metadata: ['h = 60 − x', 'h = 30 − x', 'h = 30 − 2x', 'h = \\frac{60}{x}', ''],
    answer: ['h = 30 − x', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'calculus',
    topic: 'cubic_analysis',
    subtopic: 'maximum_value',
    skills: ['expressing_in_terms_of_given_value', 'algebraic_expression'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The perimeter of a rectangle is 2x + 2h.\n- Set 2x + 2h = 60 and make h the subject.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '10.1',
      marks: 3,
      clues: '- Use the perimeter to write h in terms of x.\n- The width x of the sheet becomes the circumference of the cylinder, so 2πr = x; substitute into V = πr²h.',
      approach: '- From 2x + 2h = 50: h = 25 − x.\n- The rolled width gives 2πr = x, so r = \\frac{x}{2π}.\n- Substitute r and h into V = πr²h.\n- Simplify.',
      solution: '1. 2x + 2h = 50 ⟹ h = 25 − x\n2. 2πr = x ⟹ r = \\frac{x}{2π}\n3. V = πr²h = π(\\frac{x}{2π})²(25 − x)\n4. V = \\frac{πx²}{4π²}(25 − x) = \\frac{x²}{4π}(25 − x)\n5. ∴ V = \\frac{25x²}{4π} − \\frac{x³}{4π}',
    },
    {
      number: '10.2',
      marks: 3,
      clues: '- Maximum volume occurs where V\u2032(x) = 0.\n- Differentiate, set to zero and solve, rejecting x = 0.',
      approach: '- Differentiate: V\u2032(x) = \\frac{50x}{4π} − \\frac{3x²}{4π}.\n- Set V\u2032(x) = 0 and multiply through by 4π.\n- Factorise and solve for x.\n- Reject x = 0.',
      solution: '1. V\u2032(x) = \\frac{50x}{4π} − \\frac{3x²}{4π}\n2. \\frac{50x}{4π} − \\frac{3x²}{4π} = 0 ⟹ 50x − 3x² = 0\n3. x(50 − 3x) = 0\n4. x = 0 (rejected)  or  x = \\frac{50}{3}\n5. ∴ x = \\frac{50}{3} ≈ 16.67',
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
