#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 3.1–3.2: Farming systems and factors that increase production (order 10)
 * Question 3.1–3.2 — subsistence and commercial farming and the factors that raise animal production. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l10.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l10.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l10.js
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
  "name": "Question 3.1–3.2: Farming systems and factors that increase production",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "farming_systems",
    "factors_affecting_production",
    "extensive_production"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q10/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q10/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A farmer keeps twelve beef cattle mainly to feed her family and uses two of them for ploughing. Which farming system is this?",
    "metadata": [
      "Commercial farming",
      "Intensive feedlot farming",
      "Subsistence farming",
      "Contract farming",
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
    "clues": "- Ask what the animals are mainly kept for: sale or family use."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the characteristics of commercial livestock farming.",
    "metadata": [
      "Animals are used mainly for ploughing and transport",
      "Animals are produced mainly for sale and profit",
      "Large numbers of animals are kept",
      "Records and inputs are managed to raise output",
      "Animals are kept mainly to feed the family"
    ],
    "answer": [
      "Animals are produced mainly for sale and profit",
      "Large numbers of animals are kept",
      "Records and inputs are managed to raise output",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_production_systems",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Two options describe small-scale subsistence farming instead."
  },
  {
    "name": "Question 3",
    "question": "Match each factor that increases production to an example of good practice.",
    "metadata": [
      "A - Nutrition",
      "B - Breeding",
      "C - Environment",
      "D - General management",
      "1 - Providing a balanced ration and clean water",
      "2 - Using a high-quality bull in the herd",
      "3 - Providing shade and shelter from cold wind",
      "4 - Keeping records and vaccinating on schedule"
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
    "topic": "factors_increasing_production",
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
    "question": "Which factor most often threatens a young calf on an extensive beef farm?",
    "metadata": [
      "Regular supplementary feeding",
      "Daily veterinary checks",
      "Predators and harsh weather",
      "A temperature-controlled house",
      ""
    ],
    "answer": [
      "Predators and harsh weather",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_production_systems",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Extensive systems keep animals outdoors on large areas of veld."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1.1",
      "marks": 2,
      "clues": "- One picture shows a large herd; the other shows a few animals with people working them.\n- Think about the aim of each farm.",
      "approach": "- Compare the size of the herds and what the animals are used for.\n- Match each to commercial or subsistence farming.",
      "solution": "1. (a) Picture B shows a large herd kept for sale: commercial farming.\n2. (b) Picture A shows a few animals used by a family: subsistence farming."
    },
    {
      "number": "3.1.2",
      "marks": 2,
      "clues": "- Give one reason for each picture.\n- Link the reason to the purpose of the farm.",
      "approach": "- State the purpose of the herd in picture B.\n- State the purpose of the animals in picture A.",
      "solution": "1. (a) Picture B: a large beef herd is produced to sell and make a profit.\n2. (b) Picture A: fewer animals are used for ploughing to sustain the family."
    },
    {
      "number": "3.2.1",
      "marks": 2,
      "clues": "- Look at what the animals in each picture are doing.\n- Think about the four factors that raise production.",
      "approach": "- Describe the activity in each picture.\n- Name the factor it represents.",
      "solution": "1. Picture A shows animals feeding from a roll of hay: nutrition (feeding).\n2. Picture B shows a cow with her calf: breeding (reproduction)."
    },
    {
      "number": "3.2.2",
      "marks": 2,
      "clues": "- The calf is on veld, exposed to the outdoors.\n- Think about the environment and the management of the enterprise.",
      "approach": "- List threats in an extensive system.\n- Choose two that are not nutrition or breeding.",
      "solution": "1. Harsh environmental conditions.\n2. Poor general enterprise management (or being more prone to predators)."
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
