#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2024 — Question 11 (order 11)
 * Euclidean geometry — tan-chord theorem, tangents from a common point, proportionality and similar triangles.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p2-q11.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2024-nov-p2-q11.js --dry-run
 *   node scripts/add-maths-2024-nov-p2-q11.js
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
  name: 'Question 11',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p2',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['tangent_chord_angle', 'similar_triangles', 'tangents_from_external_point', 'AA_similarity'],
  question_image_urls: [`${IMG}/q11/question_1.png`],
  memo_image_urls: [`${IMG}/q11/memo_1.png`, `${IMG}/q11/memo_2.png`, `${IMG}/q11/memo_3.png`],
  exam_question_marks: 20,
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
    question: 'TA is a tangent to a circle at A. Chord AB is drawn, and C is a point on the circle in the alternate segment. If ∠TAB = 58°, which angle is also 58°, and why?',
    metadata: [
      '∠ABC (tan-chord theorem)',
      '∠ACB (tan-chord theorem)',
      '∠ACB (angles in the same segment)',
      '∠BAC (alternate angles)',
      '',
    ],
    answer: ['∠ACB (tan-chord theorem)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'tangent_chord_angle',
    skills: ['tangent_chord_angle_theorem', 'identifying_circle_theorems'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- The angle between a tangent and a chord equals the angle the chord subtends in the alternate segment.\n- Chord AB subtends its angle at C.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q11_1/diagram_1.png'],
    },
  },
  {
    name: 'Question 2',
    question: 'From an external point E, two tangents EA and EC are drawn to a circle, touching it at A and C. If ∠AEC = 48°, calculate ∠EAC.',
    metadata: ['∠EAC = ', '[ ]', '°'],
    answer: ['66', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'tangents_from_external_point',
    skills: ['tangents_equal_from_external_point', 'isosceles_triangle_base_angles'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Tangents from the same point are equal, so △EAC is isosceles.\n- Share the remaining angle of the triangle equally between the base angles.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q11_2/diagram_1.png'],
    },
  },
  {
    name: 'Question 3',
    question: 'Chords AB and CD of a circle intersect at E. Match each statement with its reason.',
    metadata: [
      'A - CÂB = CD̂B',
      'B - AÊC = DÊB',
      'C - △AEC ||| △DEB',
      'D - AE ÷ DE = CE ÷ BE',
      '1 - Angles in the same segment',
      '2 - Vertically opposite angles',
      '3 - Equiangular triangles (∠∠∠)',
      '4 - Sides of similar triangles in proportion',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'proof',
    unit: 'euclidean_geometry',
    topic: 'similarity',
    subtopic: 'similar_triangles',
    skills: ['angles_in_same_segment', 'AA_similarity', 'corresponding_sides_similar_triangles'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Two of the angles stand on the same chord CB; two others are formed where the chords cross.\n- Each reason is used exactly once.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q11_3/diagram_1.png'],
    },
  },
  {
    name: 'Question 4',
    question: 'Chords PQ and RS of a circle intersect at T. It can be shown that △PTR ||| △STQ. If PT = 4, TQ = 9 and RT = 3, calculate TS.',
    metadata: ['TS = ', '[ ]'],
    answer: ['12', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'euclidean_geometry',
    topic: 'similarity',
    subtopic: 'similar_triangles_ratio',
    skills: ['proportion_from_similarity', 'corresponding_sides_similar_triangles'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Write the ratio of corresponding sides: PT ÷ ST = RT ÷ QT.\n- Cross-multiply and solve for TS.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q11_4/diagram_1.png'],
    },
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '11.1',
      marks: 6,
      clues: '- EA is a tangent to both circles, and EBCF is a tangent to the small circle at C.\n- Use the tan-chord theorem in each circle, and vertically opposite angles at C.',
      approach: '- In the small circle, the angle between tangent EA and chord AD equals D̂₁.\n- The angle between tangent CB and chord CA equals the angle in the alternate segment, D̂₁.\n- Ĉ₄ is vertically opposite Ĉ₁; in the large circle, AF̂G equals the angle between tangent EA and chord AG.',
      solution: '1. D̂₁ = EÂG = x (tan-chord theorem)\n2. Ĉ₁ = D̂₁ = x (tan-chord theorem)\n3. Ĉ₄ = Ĉ₁ = x (vert. opp. ∠s)\n4. AF̂G = EÂG = x (tan-chord theorem)',
    },
    {
      number: '11.2',
      marks: 4,
      clues: '- From 11.1, D̂₁ = AF̂G, which are corresponding angles.\n- So DC ∥ FG; use the proportionality theorem in △AGF.',
      approach: '- D̂₁ = AF̂G = x, so DC ∥ FG (corresponding angles equal).\n- In △AGF, AG ÷ AC = AF ÷ AD.\n- Cross-multiply.',
      solution: '1. D̂₁ = AF̂G = x\n2. DC ∥ FG (corresp. ∠s equal)\n3. AG ÷ AC = AF ÷ AD (prop. theorem; DC ∥ FG)\n4. ∴ AG·AD = AC·AF',
    },
    {
      number: '11.3',
      marks: 4,
      clues: '- Find three pairs of equal angles in △AGF and △ABC.\n- Use angles in the same segment and the results from 11.1.',
      approach: '- Ĝ = B̂₂ (angles in the same segment, chord AF).\n- AF̂G = Ĉ₁ = x (from 11.1).\n- The third angles are then equal: Â₃ = Â₂.',
      solution: '1. Ĝ = B̂₂ (∠s in the same seg.)\n2. AF̂G = Ĉ₁ = x (proved in 11.1)\n3. Â₃ = Â₂ (sum of ∠s in △)\n4. ∴ △AGF ||| △ABC (∠∠∠)',
    },
    {
      number: '11.4',
      marks: 6,
      clues: '- From 11.3, GF ÷ BC = AF ÷ AC gives GF in terms of AC.\n- Find a second pair of similar triangles that gives AC in terms of FG, then substitute.',
      approach: '- GF = BC·AF ÷ AC (△AGF ||| △ABC).\n- △ACD ||| △FGC (∠∠∠), so AC ÷ GF = AD ÷ FC, giving AC = AD·FG ÷ FC.\n- Substitute AC into the first result and simplify.',
      solution: '1. GF ÷ BC = AF ÷ AC, so GF = BC·AF ÷ AC\n2. △ACD ||| △FGC (∠∠∠)\n3. AC ÷ GF = AD ÷ FC, so AC = AD·FG ÷ FC\n4. GF = BC·AF × FC ÷ (AD·FG)\n5. ∴ GF² = BC·FC·AF ÷ AD',
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
