#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2024 — Question 1.10 (order 4)
 * Q1 Matter & Materials MCQ: what the photoelectric effect demonstrates about light.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p1-q1-part4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p1-q1-part4.js --dry-run
 *   node scripts/add-physics-2024-nov-p1-q1-part4.js
 */

'use strict';


const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2024/nov_p1';
const FORMULA_SHEET = {
  type: 'formula_sheet',
  label: 'Formula Sheet',
  image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`],
};

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 1.10',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p1',
  order: 4, // Q1 clustered by CAPS knowledge area (DESIGN-UNI-10) — part 4 of 4: Matter & Materials
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['photoelectric_effect'],
  question_image_urls: [`${PAPER}/q1/question_7.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 2,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'Light below the threshold frequency of a metal never ejects electrons, no matter how bright it is or how long it shines. Which conclusion about light does this observation support?',
    metadata: [
      'Light energy spreads out evenly over the whole wavefront',
      'Electrons slowly store energy from the wave until they escape',
      'Light energy arrives in separate packets, called photons',
      'The work function of a metal depends on the light intensity',
      '',
    ],
    answer: ['Light energy arrives in separate packets, called photons', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['photoelectric_effect', 'threshold_frequency'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- In the wave model, a brighter beam or a longer exposure delivers more energy, so it should eventually eject electrons.\n- Only the frequency matters. What does that suggest about how each electron receives its energy?',
  },
  {
    name: 'Question 2',
    question:
      'Select ALL the photoelectric-effect observations that the WAVE model of light CANNOT explain.',
    metadata: [
      'Electrons are ejected almost instantly, even in very dim light',
      'Light spreads out after passing through a narrow slit',
      'No electrons are ejected below the threshold frequency, however bright the light',
      'The maximum kinetic energy of the electrons depends on frequency, not intensity',
      'Light bends around the edges of small obstacles',
    ],
    answer: [
      'Electrons are ejected almost instantly, even in very dim light',
      'No electrons are ejected below the threshold frequency, however bright the light',
      'The maximum kinetic energy of the electrons depends on frequency, not intensity',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['photoelectric_effect', 'threshold_frequency'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- First ask whether each option is something actually observed in a photoelectric experiment.\n- Then ask: would a wave delivering energy continuously and evenly predict it?',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.10',
      marks: 2,
      clues: '- The photoelectric effect is explained by light arriving as photons, each with energy E = hf.\n- Which statements describe that model, and which describes the opposite one?',
      approach: '- Recall how Einstein explained the photoelectric effect.\n- Check each statement against that explanation.\n- Choose the option that lists only the statements it supports.',
      solution: '1. The photoelectric effect is explained by light behaving as particles (photons), so (ii) is true.\n2. Each photon carries a fixed packet of energy E = hf, so light energy is quantised and (iii) is true.\n3. The wave model cannot explain the threshold frequency, so the effect does not show the wave nature of light. (i) is false.\n4. Answer: D — (ii) and (iii) only.',
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
