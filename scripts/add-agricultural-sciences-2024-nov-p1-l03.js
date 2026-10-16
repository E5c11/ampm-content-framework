#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 1: Housing, handling and farming systems (Section A) (order 3)
 * Section A items on animal production: 1.1.5 poultry housing, 1.1.6 handling sheep, 1.2.3 consequences of handling, 1.3.2 subsistence farming. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l03.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l03.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l03.js
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
  "name": "Question 1: Housing, handling and farming systems (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "housing_facilities",
    "sheep_handling",
    "farming_systems"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q3/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q3/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q3/question_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q3/question_5.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q3/question_6.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q3/memo_3.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each animal housing system to its description.",
    "metadata": [
      "A - Battery system",
      "B - Deep-litter system",
      "C - Free-range system",
      "D - Farrowing crate",
      "1 - Hens are kept in wire cages arranged in rows",
      "2 - Hens live in a house with shavings on the floor",
      "3 - Hens roam outdoors and shelter in a house at night",
      "4 - A sow is confined to stop her lying on her piglets"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_housing_and_facilities",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Look at where the animals spend their time: in cages, on a covered floor, or outdoors.\n- One structure is used for pigs, not poultry."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the correct practices when handling a flock of sheep.",
    "metadata": [
      "Work quietly and avoid sudden movements",
      "Lift a sheep off the ground by its wool",
      "Grab a sheep low on the leg near the hoof",
      "Move them as a group, as sheep follow a leader",
      "Drive the flock with an electric prodder"
    ],
    "answer": [
      "Work quietly and avoid sudden movements",
      "Move them as a group, as sheep follow a leader",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_behaviour_and_handling",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Sheep are flock animals that panic easily.\n- Handling should not bruise the animal, damage the fleece or injure a leg."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the consequences of rough, incorrect handling of cattle.",
    "metadata": [
      "Bruised carcasses and poorer meat quality",
      "Calmer animals that are easier to load",
      "Nervous animals that become aggressive",
      "A higher price for the carcass at slaughter",
      "More injuries to animals and to workers"
    ],
    "answer": [
      "Bruised carcasses and poorer meat quality",
      "Nervous animals that become aggressive",
      "More injuries to animals and to workers",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_behaviour_and_handling",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Think about what stress and rough treatment do to an animal and to its meat."
  },
  {
    "name": "Question 4",
    "question": "A family keeps a few goats and chickens only to supply milk, eggs and meat for their own household. Which farming system is this?",
    "metadata": [
      "Commercial farming",
      "Intensive farming",
      "Subsistence farming",
      "Feedlot farming",
      ""
    ],
    "answer": [
      "Subsistence farming",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_production_systems",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Nothing is produced for sale.\n- Who uses the products?"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- The floor is covered with an absorbent material.\n- The birds are not kept in cages or outdoors.",
      "approach": "- Recall the intensive poultry housing systems.\n- Match the floor covering of straw or shavings to its system.",
      "solution": "1. In a battery system the hens are in cages; free-range hens are outdoors.\n2. A permanent house with straw or wood shavings on the floor is the deep-litter system.\n3. Answer: A (Deep-litter)."
    },
    {
      "number": "1.1.6",
      "marks": 2,
      "clues": "- Three options are poor handling for any animal.\n- Think about how a sheep is caught without hurting it.",
      "approach": "- Reject methods that frighten or injure animals.\n- Choose the method that is specific to sheep.",
      "solution": "1. Neck clamps are for cattle; random dogs and whips stress animals.\n2. Sheep are caught as high as possible on the hind legs.\n3. Answer: C."
    },
    {
      "number": "1.2.3",
      "marks": 2,
      "clues": "- The description says the handling is correct and frequent.\n- Do poor meat quality and aggression result from good handling?",
      "approach": "- Test each item against \"correct and frequent handling\".\n- Choose A only, B only, both or none.",
      "solution": "1. Poor meat quality and an aggressive temperament are results of incorrect, rough handling.\n2. Neither results from correct handling.\n3. Answer: None."
    },
    {
      "number": "1.3.2",
      "marks": 2,
      "clues": "- The pigs are raised to feed the family.\n- No products are sold for profit.",
      "approach": "- Identify the purpose of the farming.\n- Name the farming system that produces only for the household.",
      "solution": "1. Farming to feed the family rather than for the market is subsistence farming.\n2. Answer: Subsistence."
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
