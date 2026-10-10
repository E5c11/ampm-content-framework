#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2024 — Question 6 (order 6)
 * Trigonometry — deriving a compound-angle formula, identities with reduction formulae, trig equation in an interval, maximum value.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p2-q6.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2024-nov-p2-q6.js --dry-run
 *   node scripts/add-maths-2024-nov-p2-q6.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2024/nov_p2';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 6',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p2',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['compound_angle', 'trig_identities', 'trig_equations', 'maximum_value'],
  question_image_urls: [`${IMG}/q6/question_1.png`],
  memo_image_urls: [`${IMG}/q6/memo_1.png`, `${IMG}/q6/memo_2.png`],
  exam_question_marks: 18,
  supplementary_materials: [
    {
      type: 'formula_sheet',
      label: 'Formula Sheet',
      image_urls: [`${IMG}/q0/question_1.png`],
    },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Arrange the steps that derive the expansion of sin(x − y) from the expansion of sin(x + y).',
    metadata: [
      'Expand: sin x cos(−y) + cos x sin(−y)',
      'Simplify to sin x cos y − cos x sin y',
      'Write sin(x − y) as sin(x + (−y))',
      'Use cos(−y) = cos y and sin(−y) = −sin y',
    ],
    answer: [
      'Write sin(x − y) as sin(x + (−y))',
      'Expand: sin x cos(−y) + cos x sin(−y)',
      'Use cos(−y) = cos y and sin(−y) = −sin y',
      'Simplify to sin x cos y − cos x sin y',
    ],
    presentation: 'ordering',
    type: 'proof',
    unit: 'trigonometry',
    topic: 'trig_identities',
    subtopic: 'compound_angles',
    skills: ['compound_angle_formula', 'logical_sequence'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Start by rewriting the difference as a sum, so the known formula applies.\n- The negative-angle rules are used only after expanding.',
  },
  {
    name: 'Question 2',
    question: 'Simplify \\frac{sin(180° − x)cos y + cos(360° − x)sin(−y)}{cos(−x)cos y + sin(180° + x)sin(−y)} to a single trigonometric ratio.',
    metadata: ['tan(x + y)', '−tan(x − y)', 'tan(x − y)', '\\frac{1}{tan(x + y)}', ''],
    answer: ['tan(x − y)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'proof',
    unit: 'trigonometry',
    topic: 'trig_identities',
    subtopic: 'simplification',
    skills: ['reduction_formulae', 'compound_angle_formula', 'quotient_identity'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Reduce every ratio to a ratio of x or y with the correct sign.\n- The numerator and denominator then match compound-angle expansions.',
  },
  {
    name: 'Question 3',
    question: 'Solve for x if 2sin²x + 5cos(90° − x) − 3 = 0 and x ∈ [0° ; 360°]. Give the smaller solution first.',
    metadata: ['x = ', '[ ]', '° or x = ', '[ ]', '°'],
    answer: ['30', '150', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_equations',
    subtopic: 'trig_equation_solution',
    skills: ['reduction_formulae', 'factorizing_trinomials', 'solving_trig_equations'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Replace cos(90° − x) by sin x to get a quadratic in sin x.\n- Factorise, and reject a factor that gives a sine value outside −1 to 1.',
  },
  {
    name: 'Question 4',
    question: 'Consider f(x) = 6sin x cos x + 1 for x ∈ (0° ; 360°]. Write down the maximum value of f and the smallest value of x at which it occurs.',
    metadata: ['Maximum value = ', '[ ]', ' at x = ', '[ ]', '°'],
    answer: ['4', '45', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_equations',
    subtopic: 'maximum_value',
    skills: ['double_angle_formula', 'selecting_maximum'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Write 6sin x cos x as a multiple of sin 2x.\n- The largest value of sin 2x is 1; find the smallest x that makes it 1.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '6.1.1',
      marks: 2,
      clues: '- Write x + y as x − (−y).\n- Use cos(−y) = cos y and sin(−y) = −sin y.',
      approach: '- cos(x + y) = cos(x − (−y)).\n- Apply the given identity with −y in place of y.\n- Simplify the negative angles.',
      solution: '1. cos(x + y) = cos(x − (−y))\n2. = cos x cos(−y) + sin x sin(−y)\n3. ∴ cos(x + y) = cos x cos y − sin x sin y',
    },
    {
      number: '6.1.2',
      marks: 6,
      clues: '- Reduce each ratio with a reduction formula or a negative-angle rule.\n- Recognise the compound-angle expansions in the numerator and the denominator.',
      approach: '- cos(90° − x) = sin x, sin(−y) = −sin y, cos(180° + x) = −cos x.\n- cos(360° + y) = cos y, sin(360° − x) = −sin x.\n- The numerator becomes sin(x + y) and the denominator cos(x + y).',
      solution: '1. LHS = [sin x cos y + (−sin y)(−cos x)] ÷ [cos x cos y + (−sin x) sin y]\n2. = (sin x cos y + cos x sin y) ÷ (cos x cos y − sin x sin y)\n3. = sin(x + y) ÷ cos(x + y)\n4. = tan(x + y) = RHS',
    },
    {
      number: '6.2',
      marks: 6,
      clues: '- Square both sides to remove the square root.\n- Replace cos(90° + x) by −sin x and solve the quadratic in sin x.',
      approach: '- 6sin²x − 11cos(90° + x) + 7 = 4.\n- cos(90° + x) = −sin x gives 6sin²x + 11sin x + 3 = 0.\n- Factorise, reject the impossible value, and find both angles in the interval.',
      solution: '1. 6sin²x + 11sin x + 3 = 0\n2. (3sin x + 1)(2sin x + 3) = 0\n3. sin x = −1/3 or sin x = −3/2 (no solution)\n4. Reference angle = 19.47°\n5. ∴ x = 199.47° or x = 340.53°',
    },
    {
      number: '6.3.1',
      marks: 3,
      clues: '- Factor out 4 and recognise 1 − 2sin²x as cos 2x.\n- The largest value of cos 2x is 1.',
      approach: '- g(x) = 4(1 − 2sin²x) ÷ 3 = 4cos 2x ÷ 3.\n- The maximum of cos 2x is 1.',
      solution: '1. g(x) = 4(1 − 2sin²x) ÷ 3\n2. = 4cos 2x ÷ 3\n3. ∴ maximum value of g = 4/3',
    },
    {
      number: '6.3.2',
      marks: 1,
      clues: '- cos 2x = 1 when 2x is a multiple of 360°.\n- x = 0° is not in the interval.',
      approach: '- 2x = 360° gives the first x in (0° ; 360°].',
      solution: '1. 2x = 360°\n2. ∴ x = 180°',
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
