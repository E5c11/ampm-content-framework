#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2025 — Question 8 (order 8)
 * Trigonometry — two- and three-dimensional problems: area of a rectangle with a given ratio of sides,
 * Pythagoras, sine rule and cosine rule.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p2-q8.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p2-q8.js --dry-run
 *   node scripts/add-maths-2025-nov-p2-q8.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2025/nov_p2';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 8',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p2',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['3d_trigonometry', 'sine_rule', 'cosine_rule', 'area_of_triangle'],
  question_image_urls: [`${IMG}/q8/question_1.png`],
  memo_image_urls: [`${IMG}/q8/memo_1.png`],
  exam_question_marks: 10,
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
    question: 'A rectangular poster has an area of 392 cm², and its sides are in the ratio length : width = 2 : 1. Calculate the width of the poster.',
    metadata: ['Width = ', '[ ]', ' cm'],
    answer: ['14', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'application',
    unit: 'trigonometry',
    topic: '3d_trig',
    subtopic: 'trig_ratios',
    skills: ['ratio_of_sides', 'solving_quadratic'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Write both sides in terms of the width and use the formula for the area of a rectangle.\n- Take the square root at the end.',
  },
  {
    name: 'Question 2',
    question: 'A rectangular ramp surface is 14 m wide and 28 m long. Calculate the length of its diagonal, correct to TWO decimal places.',
    metadata: ['Diagonal = ', '[ ]', ' m'],
    answer: ['31.3', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: '3d_trig',
    subtopic: 'trig_ratios',
    skills: ['finding_unknown_side', 'rounding'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The diagonal is the hypotenuse of a right-angled triangle whose legs are the width and the length.\n- Round only at the end.',
  },
  {
    name: 'Question 3',
    question: 'In △PQR, ∠Q = 98°, ∠P = 41° and QR = 22 cm. Which expression gives the length of PR?',
    metadata: [
      'PR = 22 sin 41° ÷ sin 98°',
      'PR = 22 sin 98° ÷ sin 41°',
      'PR = 22 cos 98° ÷ cos 41°',
      'PR = 22 ÷ (sin 98° × sin 41°)',
      '',
    ],
    answer: ['PR = 22 sin 98° ÷ sin 41°', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'trigonometry',
    topic: '3d_trig',
    subtopic: 'sine_rule',
    skills: ['sine_rule', 'finding_unknown_side'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Match each side with the angle that lies opposite it.\n- The sine rule sets two side-to-sine ratios equal.',
  },
  {
    name: 'Question 4',
    question: 'A triangle has sides a, b and c, and θ is the angle opposite side c. Arrange these steps for finding θ when all three sides are known.',
    metadata: [
      'Substitute the three side lengths into the formula',
      'Use cos⁻¹ on your calculator to find θ',
      'Write c² = a² + b² − 2ab cos θ and make cos θ the subject',
      'Simplify to find the value of cos θ',
    ],
    answer: [
      'Write c² = a² + b² − 2ab cos θ and make cos θ the subject',
      'Substitute the three side lengths into the formula',
      'Simplify to find the value of cos θ',
      'Use cos⁻¹ on your calculator to find θ',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'trigonometry',
    topic: '3d_trig',
    subtopic: 'cosine_rule',
    skills: ['cosine_rule', 'logical_sequence'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The unknown angle must be opposite the side that is squared on the left of the formula.\n- You cannot use the inverse cosine until the value of cos θ is known.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '8.1',
      marks: 2,
      clues: '- Use BC = 2AB in the formula for the area of a rectangle.\n- Solve for AB.',
      approach: '- AB : BC = 1 : 2, so BC = 2AB.\n- Area = AB × BC = 648.\n- Solve 2AB² = 648.',
      solution: '1. 648 = AB × 2AB\n2. AB² = 324\n3. ∴ AB = 18 cm',
    },
    {
      number: '8.2',
      marks: 2,
      clues: '- ABC is a right-angled triangle, because the backdrop is a rectangle.\n- Use Pythagoras with AB and BC.',
      approach: '- BC = 2 × 18 = 36 cm.\n- AC is the hypotenuse of right-angled triangle ABC.',
      solution: '1. AC² = AB² + BC² = 18² + 36²\n2. AC² = 1620\n3. ∴ AC = 18√5 ≈ 40.25 cm',
    },
    {
      number: '8.3',
      marks: 2,
      clues: '- Look at triangle KBC, where two angles and the side BC are known.\n- Use the sine rule with the side opposite the 104° angle.',
      approach: '- The side opposite angle KBC (104°) is KC; the side opposite angle BKC (52.6°) is BC = 36.\n- Write KC ÷ sin 104° = 36 ÷ sin 52.6° and solve for KC.',
      solution: '1. KC ÷ sin 104° = 36 ÷ sin 52.6°\n2. KC = 36 sin 104° ÷ sin 52.6°\n3. ∴ KC ≈ 43.97 cm',
    },
    {
      number: '8.4',
      marks: 4,
      clues: '- Find AK with Pythagoras in the right-angled triangle ABK.\n- Then use the cosine rule in triangle KAC, with KC opposite the angle you want.',
      approach: '- With AB = BK = 18, AK = √(18² + 18²) = 18√2.\n- Write KC² = AK² + AC² − 2(AK)(AC) cos KÂC, using KC from 8.3 and AC from 8.2.\n- Make cos KÂC the subject and use the inverse cosine.',
      solution: '1. AK = √648 = 18√2 ≈ 25.46 cm\n2. 43.97² = (18√2)² + (18√5)² − 2(18√2)(18√5) cos KÂC\n3. cos KÂC ≈ 0.16\n4. ∴ KÂC ≈ 80.60°',
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
