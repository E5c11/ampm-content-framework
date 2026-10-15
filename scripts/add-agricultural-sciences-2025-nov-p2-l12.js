#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 3.1: Land as a production factor (order 12)
 * Question 3.1 — the economic characteristics of land and the methods that increase land productivity. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l12.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l12.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l12.js
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
  "name": "Question 3.1: Land as a production factor",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "land_characteristics",
    "land_productivity",
    "land_consolidation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q12/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q12/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each statement about land to the economic characteristic it describes.",
    "metadata": [
      "A - The price of land tends to rise over time",
      "B - A bank accepts land as security for a loan",
      "C - Extra inputs on a fixed area give smaller and smaller extra output",
      "D - The total area of land cannot be increased",
      "1 - Appreciation",
      "2 - Collateral",
      "3 - Law of diminishing returns",
      "4 - Availability"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "production_factors",
    "topic": "land_as_production_factor",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2"
  },
  {
    "name": "Question 2",
    "question": "Select ALL the scientific methods that increase the productivity of land.",
    "metadata": [
      "Applying the same fertiliser to every field",
      "Testing the soil before applying fertiliser",
      "Rotating crops from season to season",
      "Using weather and pest data to plan spraying",
      "Planting the same crop every year without tests"
    ],
    "answer": [
      "Testing the soil before applying fertiliser",
      "Rotating crops from season to season",
      "Using weather and pest data to plan spraying",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "production_factors",
    "topic": "land_as_production_factor",
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
    "paper": "nov_p2",
    "clues": "- Scientific methods use reliable data to make decisions."
  },
  {
    "name": "Question 3",
    "question": "A district has many small uneconomical plots that are joined into larger units. How does this consolidation increase land productivity?",
    "metadata": [
      "Each plot must have its own set of equipment",
      "The number of workers needed per hectare increases",
      "The price of the land falls to a very low level",
      "Infrastructure costs are spread over a larger area",
      ""
    ],
    "answer": [
      "Infrastructure costs are spread over a larger area",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "production_factors",
    "topic": "land_as_production_factor",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Larger units spread the cost of infrastructure."
  },
  {
    "name": "Question 4",
    "question": "A farmer bought land for R1 200 000. Five years later it is valued at R1 560 000. Calculate the percentage by which the land has appreciated. []",
    "metadata": [
      "Appreciation (%): ",
      "[ ]"
    ],
    "answer": [
      "30",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "production_factors",
    "topic": "land_as_production_factor",
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
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Find the increase in value first, then express it as a percentage of the original price."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1.1",
      "marks": 2,
      "clues": "- One statement is about price over time; the other about security for a loan.\n- Choose from the list of characteristics.",
      "approach": "- Read each statement.\n- Match it to a characteristic in the list.",
      "solution": "1. (a) The price of land tends to increase over time: appreciation.\n2. (b) Land used as security for a loan: collateral."
    },
    {
      "number": "3.1.2",
      "marks": 4,
      "clues": "- Think about decisions based on data and about efficiency of investment.\n- Explain each method in two marks.",
      "approach": "- Explain how scientific methods improve production.\n- Explain how consolidation improves efficiency.",
      "solution": "1. (a) Farmers make informed decisions based on reliable data about soil, crops, weather and pests, which optimises resources and maximises yield.\n2. (b) Land consolidation improves the efficiency and cost-effectiveness of investments in transport, communication, utilities and irrigation."
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
