#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 2.4–2.5: Digestibility and nutritive ratio (order 8)
 * Question 2.4–2.5 — dry matter absorbed, factors that influence digestibility and the nutritive ratio of a feed. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l08.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l08.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l08.js
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
  "name": "Question 2.4–2.5: Digestibility and nutritive ratio",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "digestibility",
    "nutritive_ratio",
    "dry_matter_calculation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q8/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q8/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q8/memo_1.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A cow eats 20 kg of a feed that contains 16 kg dry matter. She excretes 6 kg of manure with 75% moisture. Calculate the dry matter absorbed by the cow, in kg. []",
    "metadata": [
      "Dry matter absorbed (kg): ",
      "[ ]"
    ],
    "answer": [
      "14.5",
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
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Work out the dry matter in the manure first: it is the part that is not moisture.\n- Subtract the dry matter excreted from the dry matter eaten."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the animal factors that influence the digestibility of a feed.",
    "metadata": [
      "Colour of the feed bag",
      "Type of digestive system of the animal",
      "Price of the feed per ton",
      "Health of the animal",
      "Age and body mass of the animal"
    ],
    "answer": [
      "Age and body mass of the animal",
      "Type of digestive system of the animal",
      "Health of the animal",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "digestibility_of_feeds",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Look for factors that belong to the animal itself, not to the feed packaging or the market."
  },
  {
    "name": "Question 3",
    "question": "A feed contains 65% total digestible nutrients (TDN) and 13% digestible protein (DP). Calculate the nutritive ratio, written as 1 : x. Give the value of x. []",
    "metadata": [
      "Nutritive ratio 1 : ",
      "[ ]"
    ],
    "answer": [
      "4",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "ratio",
    "unit": "animal_nutrition",
    "topic": "nutritive_ratio",
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
    "clues": "- First subtract the digestible protein from the TDN.\n- Then divide the result by the digestible protein."
  },
  {
    "name": "Question 4",
    "question": "A feed has a nutritive ratio of 1 : 4. Which group of animals is it best suited to?",
    "metadata": [
      "Sheep that must be kept on a very low-protein diet",
      "Mature, idle cows that only need maintenance",
      "Cattle that are being fattened on energy-rich grain",
      "Young, growing calves that need plenty of protein",
      ""
    ],
    "answer": [
      "Young, growing calves that need plenty of protein",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "animal_nutrition",
    "topic": "nutritive_ratio",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A small second number means there is a lot of protein compared with energy.\n- Which animals need protein for growth and production?"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.4.1",
      "marks": 3,
      "clues": "- First find how much of the manure is dry matter.\n- Then subtract it from the dry matter the cow ate.",
      "approach": "- Calculate the moisture-free part of the manure (100% − 40%).\n- Multiply by the mass of the manure.\n- Subtract from the dry matter consumed.",
      "solution": "1. Dry matter excreted = 60/100 × 3,5 kg = 2,1 kg.\n2. Dry matter absorbed = 12,5 kg − 2,1 kg.\n3. Dry matter absorbed = 10,4 kg."
    },
    {
      "number": "2.4.2",
      "marks": 1,
      "clues": "- Think about the animal, not the feed.\n- You need one factor.",
      "approach": "- Recall the factors that influence digestibility.\n- Choose one that relates to the animal.",
      "solution": "1. The age, body mass, type of animal, stage of production, breed or health of the animal influences digestibility."
    },
    {
      "number": "2.5.1",
      "marks": 3,
      "clues": "- Find the digestible non-nitrogenous substances first.\n- Then divide by the digestible protein.",
      "approach": "- Calculate %DNNS = %TDN − %DP.\n- Divide %DNNS by %DP.\n- Write the answer as 1 : x.",
      "solution": "1. %DNNS = 89% − 15% = 74%.\n2. NR = 1 : 74/15.\n3. NR = 1 : 4,9 (or 1 : 5)."
    },
    {
      "number": "2.5.2",
      "marks": 1,
      "clues": "- A narrow ratio means a lot of protein.\n- Which uses of a feed need protein?",
      "approach": "- Interpret the nutritive ratio calculated.\n- State one purpose of such a feed.",
      "solution": "1. A feed with this nutritive ratio can be fed for production, reproduction or growth."
    },
    {
      "number": "2.5.3",
      "marks": 1,
      "clues": "- Compare the ratio you calculated with 1 : 6.\n- Is it narrow or wide?",
      "approach": "- Recall what a narrow nutritive ratio means.\n- Link it to protein content.",
      "solution": "1. The ratio is narrower than 1 : 6, which means the feed has a high protein content."
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
