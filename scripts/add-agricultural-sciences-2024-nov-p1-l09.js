#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 2.5: Feed composition and the digestibility coefficient (order 9)
 * Question 2.5 — the water, organic and inorganic components of a feed, and calculating the digestibility coefficient from dry matter eaten and excreted. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l09.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l09.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l09.js
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
  "name": "Question 2.5: Feed composition and the digestibility coefficient",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "feed_components",
    "digestibility",
    "dry_matter_calculation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q9/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A bag of feed has a mass of 40 kg and contains 34 kg of dry matter. Calculate the mass of water in the feed. []",
    "metadata": [
      "Water (kg): ",
      "[ ]"
    ],
    "answer": [
      "6",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "animal_nutrition",
    "topic": "feed_components_and_minerals",
    "subtopic": "agri_calculation",
    "skills": [
      "apply_agricultural_formula"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A feed is made up of water and dry matter.\n- Subtract the dry matter from the total mass."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the nutrients that belong to the organic component of the dry matter in a feed.",
    "metadata": [
      "Proteins",
      "Calcium and phosphorus",
      "Carbohydrates",
      "Water",
      "Fats and oils"
    ],
    "answer": [
      "Proteins",
      "Carbohydrates",
      "Fats and oils",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "feed_components_and_minerals",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Organic compounds contain carbon and come from living things.\n- Minerals form the inorganic part, and water is not part of the dry matter at all."
  },
  {
    "name": "Question 3",
    "question": "A sheep eats 2,5 kg of dry matter and excretes 0,8 kg of dry matter in its faeces. Calculate the digestibility coefficient of the feed. []",
    "metadata": [
      "Digestibility coefficient (%): ",
      "[ ]"
    ],
    "answer": [
      "68",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "animal_nutrition",
    "topic": "digestibility_of_feeds",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- First work out the dry matter that was digested.\n- Divide it by the dry matter eaten and multiply by 100."
  },
  {
    "name": "Question 4",
    "question": "A learner calculates (dry matter excreted ÷ dry matter eaten) × 100 for a feed and gets 30%. What is the real digestibility coefficient of the feed?",
    "metadata": [
      "30%",
      "70%",
      "130%",
      "43%",
      ""
    ],
    "answer": [
      "70%",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "calc",
    "unit": "animal_nutrition",
    "topic": "digestibility_of_feeds",
    "subtopic": "agri_calculation",
    "skills": [
      "apply_agricultural_formula"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The learner worked out the part that was NOT digested.\n- The digested part and the undigested part add up to 100%."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.5.1",
      "marks": 1,
      "clues": "- Dry matter splits into two parts: one inorganic and one that holds protein and fats.",
      "approach": "- Look at what branches from C.\n- Name the component.",
      "solution": "1. C contains protein, fats and oils, so it is the organic component."
    },
    {
      "number": "2.5.2",
      "marks": 1,
      "clues": "- The feed is 30 kg and its dry matter is 25 kg.\n- A is the rest of the feed.",
      "approach": "- Subtract the dry matter from the mass of the feed.\n- Give the value with its unit.",
      "solution": "1. A (water) = 30 kg − 25 kg = 5 kg."
    },
    {
      "number": "2.5.3",
      "marks": 4,
      "clues": "- Use the dry matter intake from the diagram, not the mass of the feed.\n- Show the formula, the substitution and the unit.",
      "approach": "- Write the formula for the digestibility coefficient.\n- Substitute 25 kg eaten and 6 kg excreted.\n- Calculate and give the answer as a percentage.",
      "solution": "1. DC = (DM intake − DM excreted) ÷ DM intake × 100.\n2. DC = (25 kg − 6 kg) ÷ 25 kg × 100.\n3. DC = 76%."
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
