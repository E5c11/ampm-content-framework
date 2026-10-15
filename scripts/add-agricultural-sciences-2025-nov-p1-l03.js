#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 1: Production systems, handling and housing (Section A) (order 3)
 * Section A items 1.1.5, 1.1.6, 1.2.3, 1.2.4 and 1.3.2 — animal behaviour, transport, housing equipment, signs of health and intensive production systems. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l03.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l03.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l03.js
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
  "name": "Question 1: Production systems, handling and housing (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "animal_behaviour",
    "animal_transport",
    "housing_equipment"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q3/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q3/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q3/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q3/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which behaviour of a cow is a warning sign that she is stressed or ill?",
    "metadata": [
      "Grazing together with the rest of the herd",
      "Following the lead cow to the water point",
      "Moving away when a stranger walks closer",
      "Standing alone with droopy ears and sunken eyes",
      ""
    ],
    "answer": [
      "Standing alone with droopy ears and sunken eyes",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_behaviour_and_handling",
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
    "paper": "nov_p1",
    "clues": "- Cattle are herd animals that follow a leader.\n- Three of the options describe normal, healthy behaviour."
  },
  {
    "name": "Question 2",
    "question": "Sheep are being loaded onto a truck for an auction. Which action follows the basic guidelines for transporting animals?",
    "metadata": [
      "Mixing rams, ewes and lambs in one compartment to save space",
      "Withholding water for two days so that they do not dirty the truck",
      "Loading the sheep the evening before so that they settle",
      "Loading just before departure onto a non-slip floor",
      ""
    ],
    "answer": [
      "Loading just before departure onto a non-slip floor",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_behaviour_and_handling",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about injuries on the truck and how long the animals stand on it.\n- Different classes of animal should not share a compartment."
  },
  {
    "name": "Question 3",
    "question": "Match each piece of equipment on a pig farm to its purpose.",
    "metadata": [
      "A - Infra-red lamp",
      "B - Farrowing crate",
      "C - Thermometer",
      "D - Bedding",
      "1 - Provides warmth for new-born piglets",
      "2 - Stops the sow from lying on her piglets",
      "3 - Measures the temperature of the pen",
      "4 - Insulates the floor and absorbs moisture"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_housing_and_facilities",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the signs that a pig may be in poor health.",
    "metadata": [
      "Bright, clear eyes and alert ears",
      "Refuses feed and looks dull",
      "Active, curious and lively",
      "Smooth, shiny skin and coat",
      "Stays apart from the group"
    ],
    "answer": [
      "Refuses feed and looks dull",
      "Stays apart from the group",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_behaviour_and_handling",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Compare each sign with how a healthy, alert pig behaves."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- Cattle are herd animals.\n- Which option describes behaviour that is NOT normal for a herd animal?",
      "approach": "- Recall the normal behaviour of large ruminants.\n- Pick the statement that does not match it.",
      "solution": "1. Large ruminants follow a leader and are uncomfortable when separated from the herd.\n2. Being comfortable when separated from the herd is therefore not normal: B."
    },
    {
      "number": "1.1.6",
      "marks": 2,
      "clues": "- Think about injury and stress during loading and travel.\n- Which option breaks a basic transport rule?",
      "approach": "- Recall the guidelines for transporting animals.\n- Identify the statement that is NOT one of them.",
      "solution": "1. Floors must not be slippery, animals are loaded just before departure and they cross roads only when it is not busy.\n2. Different animals must not be transported together in the same compartment, so the answer is D."
    },
    {
      "number": "1.2.3",
      "marks": 2,
      "clues": "- Think about what each item does in a pig house.\n- Test the description against A and B separately.",
      "approach": "- Recall the equipment used to keep piglets warm.\n- Check whether a thermometer provides warmth.",
      "solution": "1. Infra-red light provides warmth for piglets.\n2. A thermometer only measures temperature, so the answer is A only."
    },
    {
      "number": "1.2.4",
      "marks": 2,
      "clues": "- Think about the signs of a healthy animal.\n- Ask whether each description is a sign of good or poor health.",
      "approach": "- Recall the signs of a healthy animal.\n- Decide for each of A and B whether it signals poor health.",
      "solution": "1. Bright eyes and an alert, lively appearance are signs of good health.\n2. Neither is a sign of poor health, so the answer is none."
    },
    {
      "number": "1.3.2",
      "marks": 2,
      "clues": "- The system is intensive and uses cages.\n- It is used for egg production.",
      "approach": "- Recall the intensive systems used for laying hens.\n- Match the description of small wire cages for the whole production period.",
      "solution": "1. Laying hens kept in small wire cages for their entire production period are in a battery system."
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
