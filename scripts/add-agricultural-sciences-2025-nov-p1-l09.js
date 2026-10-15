#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 2.6–2.7: Types of feed and energy flow (order 9)
 * Question 2.6–2.7 — roughages and concentrates, the importance of roughage for young ruminants and the flow of energy through a feed. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l09.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l09.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l09.js
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
  "name": "Question 2.6–2.7: Types of feed and energy flow",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "types_of_feed",
    "feed_energy_flow",
    "digestible_energy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q9/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each feed to the group to which it belongs.",
    "metadata": [
      "A - Maize silage",
      "B - Wheat straw",
      "C - Fish meal",
      "D - Maize meal",
      "1 - Succulent roughage",
      "2 - Dry roughage",
      "3 - Protein-rich concentrate",
      "4 - Carbohydrate-rich concentrate"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "types_of_feed",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1"
  },
  {
    "name": "Question 2",
    "question": "Why must young ruminants be given some roughage soon after birth?",
    "metadata": [
      "It supplies the extra protein that calves need to grow",
      "It stimulates the development of the forestomach",
      "It replaces the milk they drink in the first weeks",
      "It helps the oesophageal groove to open wider",
      ""
    ],
    "answer": [
      "It stimulates the development of the forestomach",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "types_of_feed",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A new-born ruminant starts with only one working compartment.\n- Fibrous feed has to be present for the others to develop."
  },
  {
    "name": "Question 3",
    "question": "A cow eats 25 kg dry matter of a feed with a gross energy of 18 MJ per kg dry matter. 30% of the energy is lost in the faeces. Calculate the digestible energy consumed, in MJ. []",
    "metadata": [
      "Digestible energy (MJ): ",
      "[ ]"
    ],
    "answer": [
      "315",
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
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Find the total gross energy eaten first.\n- Subtract the energy lost in the faeces."
  },
  {
    "name": "Question 4",
    "question": "Arrange the forms of energy in a feed in the order in which energy is lost from the animal, starting with the most energy.",
    "metadata": [
      "Gross energy",
      "Metabolisable energy",
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
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Faecal energy is lost first, then urine and gases, then heat."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.6.1",
      "marks": 2,
      "clues": "- Look at the branch under “Types of feeds” that is not “Concentrates”.\n- Letter C sits under the dry/succulents split of that branch.",
      "approach": "- Read the schematic from the top.\n- Decide what A and C stand for.",
      "solution": "1. A is roughages.\n2. C is dry roughages (dry), the group that is separate from succulents."
    },
    {
      "number": "2.6.2",
      "marks": 1,
      "clues": "- Think about the compartments of the stomach of a new-born ruminant.\n- Roughage affects their development.",
      "approach": "- Recall the importance of roughage.\n- Apply it to young ruminants.",
      "solution": "1. Roughage stimulates the development of the forestomach in young ruminants."
    },
    {
      "number": "2.6.3",
      "marks": 2,
      "clues": "- B is a concentrate that is rich in carbohydrates.\n- D is a dry roughage that is rich in protein.",
      "approach": "- Identify the groups B and D in the schematic.\n- Give one example of each.",
      "solution": "1. (a) B: maize meal (or oatmeal, barley meal, sorghum meal or wheat meal).\n2. (b) D: lucerne hay (or another legume hay)."
    },
    {
      "number": "2.7.1",
      "marks": 4,
      "clues": "- Find the energy lost in the faeces per kg first.\n- Subtract it from the gross energy, then multiply by the mass fed.",
      "approach": "- Calculate the energy lost through the faeces.\n- Subtract from GE to get DE per kg.\n- Multiply by the mass of feed to find the total DE.",
      "solution": "1. Energy lost in faeces = 35/100 × 21 MJ/kg = 7,35 MJ/kg.\n2. DE = GE − faecal energy = 21 − 7,35 = 13,65 MJ/kg.\n3. DE of 30 kg = 13,65 × 30 = 409,5 MJ."
    },
    {
      "number": "2.7.2",
      "marks": 1,
      "clues": "- Think of the last form of energy in the energy flow diagram.\n- It is what remains after the heat increment.",
      "approach": "- Recall the forms of energy in a feed.\n- Name the one available for maintenance and production.",
      "solution": "1. The energy that remains for maintenance and production is the net energy (NE)."
    }
  ],
  "model": "claude-sonnet-5-5",
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

  // Exam gate (VER-02/VER-04/VER-09): derive the exam minimum from the rows now in the database and write it. Dev only; no-op at the floor.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
