#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 2.6–2.7: Energy flow and mixing a ration (order 10)
 * Question 2.6–2.7 — the energy flow from gross to net energy, calculating metabolisable energy, and the quantity of a feed in a mixed ration. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l10.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l10.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l10.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 2.6–2.7: Energy flow and mixing a ration",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "feed_energy_flow",
    "digestible_energy",
    "pearson_square"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q10/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q10/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q10/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q10/memo_2.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange the forms of feed energy in the order in which they are calculated, from the energy in the feed to the energy the animal uses.",
    "metadata": [
      "Metabolisable energy",
      "Gross energy",
      "Net energy",
      "Digestible energy"
    ],
    "answer": [
      "Gross energy",
      "Digestible energy",
      "Metabolisable energy",
      "Net energy"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "animal_nutrition",
    "topic": "energy_value_of_feeds",
    "subtopic": "agri_process_sequence",
    "skills": [
      "sequence_agricultural_process"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Each form is found by subtracting one more energy loss from the form before it."
  },
  {
    "name": "Question 2",
    "question": "A ration fed to a ewe contains 42,0 MJ of gross energy. The ewe loses 11,5 MJ in her faeces and 5,3 MJ in urine and gases. Calculate the metabolisable energy. []",
    "metadata": [
      "Metabolisable energy (MJ): ",
      "[ ]"
    ],
    "answer": [
      "25.2",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "animal_nutrition",
    "topic": "energy_value_of_feeds",
    "subtopic": "agri_calculation",
    "skills": [
      "apply_agricultural_formula"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Metabolisable energy is what remains after the losses in faeces, urine and gases.\n- Subtract both losses from the gross energy."
  },
  {
    "name": "Question 3",
    "question": "Which energy loss is subtracted from digestible energy to give metabolisable energy?",
    "metadata": [
      "Energy lost in the faeces",
      "Energy lost as heat of digestion",
      "Energy used for maintenance",
      "Energy lost in urine and gases",
      ""
    ],
    "answer": [
      "Energy lost in urine and gases",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_nutrition",
    "topic": "energy_value_of_feeds",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The faecal loss has already been removed to get digestible energy.\n- The next loss leaves the body as liquid and gas."
  },
  {
    "name": "Question 4",
    "question": "A farmer mixes 3 parts of maize meal with 1 part of oilcake meal. Calculate the mass of oilcake meal in a 600 kg ration. []",
    "metadata": [
      "Oilcake meal (kg): ",
      "[ ]"
    ],
    "answer": [
      "150",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "animal_nutrition",
    "topic": "feed_formulation_pearson_square",
    "subtopic": "agri_calculation",
    "skills": [
      "apply_agricultural_formula"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Add the parts to find the total number of parts.\n- Oilcake meal is 1 of those parts: divide and multiply by the mass of the ration."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.6.1",
      "marks": 2,
      "clues": "- A is the first box after the faecal energy is lost.\n- Define it in terms of gross energy.",
      "approach": "- Identify energy A from its position in the flow.\n- Define it.",
      "solution": "1. A is digestible energy.\n2. Digestible energy is the gross energy minus the energy lost in the faeces."
    },
    {
      "number": "2.6.2",
      "marks": 1,
      "clues": "- B leaves the body together with the gases.\n- It is a liquid waste.",
      "approach": "- Identify the loss paired with the gases.\n- Name it.",
      "solution": "1. B is urine."
    },
    {
      "number": "2.6.3",
      "marks": 1,
      "clues": "- E is the energy left after heat production.\n- What does the animal use it for?",
      "approach": "- Identify energy E as net energy.\n- State one use.",
      "solution": "1. Net energy is used for maintenance, production, reproduction, growth or work (any one)."
    },
    {
      "number": "2.6.4",
      "marks": 2,
      "clues": "- C is metabolisable energy.\n- Subtract both losses from the gross energy.",
      "approach": "- Write ME = GE − faecal energy − (urine and gas) energy.\n- Substitute and calculate.",
      "solution": "1. ME = 37,2 MJ − 9,8 MJ − 4 MJ.\n2. ME = 23,4 MJ."
    },
    {
      "number": "2.7",
      "marks": 3,
      "clues": "- Find the total number of parts first.\n- FEED B is 5 of those parts.",
      "approach": "- Add the parts.\n- Divide FEED B's parts by the total and multiply by 750 kg.\n- Give the answer in kg.",
      "solution": "1. 15 parts + 5 parts = 20 parts.\n2. FEED B = 5 ÷ 20 × 750 kg.\n3. FEED B = 187,5 kg."
    }
  ],
  "model": "claude-opus-5-5",
  "generated_at": Date.now(),
  "version": 2,
  "reviewed": false,
  "input_tokens": 0,
  "output_tokens": 0,
  "avg_rating": null,
  "rating_count": null
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
