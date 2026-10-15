#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 2.3–2.4: Price elasticity and marketing functions (order 9)
 * Question 2.3–2.4 — price elasticity of demand, substitute products and the main marketing functions. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l09.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l09.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l09.js
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
  "name": "Question 2.3–2.4: Price elasticity and marketing functions",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "price_elasticity",
    "substitute_products",
    "marketing_functions"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q9/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q9/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q9/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q9/memo_2.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A farmer raises the price of potatoes from R30 to R36 a bag and the number of bags sold drops only from 400 to 395. The price of peaches rises from R20 to R26 a box and sales fall from 600 to 300 boxes. Which product shows price inelasticity of demand?",
    "metadata": [
      "Peaches",
      "Potatoes",
      "Both products",
      "Neither product",
      ""
    ],
    "answer": [
      "Potatoes",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "agricultural_management_and_marketing",
    "topic": "price_elasticity",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Inelastic demand means that a change in price has little influence on the quantity bought."
  },
  {
    "name": "Question 2",
    "question": "The price of beef rises sharply, and many buyers switch to chicken. How does the availability of substitutes affect the price elasticity of demand for beef?",
    "metadata": [
      "Demand becomes more inelastic",
      "Demand becomes more elastic",
      "Demand becomes perfectly fixed",
      "It has no effect on elasticity",
      ""
    ],
    "answer": [
      "Demand becomes more elastic",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "price_elasticity",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- When buyers can easily switch, they respond strongly to a price change."
  },
  {
    "name": "Question 3",
    "question": "Match each marketing function to what it involves.",
    "metadata": [
      "A - Storage",
      "B - Processing",
      "C - Transportation",
      "D - Packaging",
      "1 - Safekeeping of products in a cool place",
      "2 - Changing products into a more usable form",
      "3 - Moving products from the farm to the market",
      "4 - Containing products for safe, convenient handling"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "agricultural_management_and_marketing",
    "topic": "marketing_functions",
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
    "paper": "nov_p2"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the advantages of processing farm products.",
    "metadata": [
      "Removes the need for any packaging",
      "Increases the value of the product",
      "Reduces spoilage and extends the shelf life",
      "Makes the product available throughout the year",
      "Makes the product more perishable"
    ],
    "answer": [
      "Increases the value of the product",
      "Reduces spoilage and extends the shelf life",
      "Makes the product available throughout the year",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "marketing_functions",
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
    "paper": "nov_p2",
    "clues": "- Processing should make the product last longer and be worth more."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3.1",
      "marks": 1,
      "clues": "- Compare the change in price with the change in the number of buyers.\n- Which product lost very few buyers?",
      "approach": "- Calculate or compare the change in buyers for each product.\n- Pick the one that changed least.",
      "solution": "1. The number of maize buyers declined only from 800 to 790 although the price rose steeply, so maize is price inelastic."
    },
    {
      "number": "2.3.2",
      "marks": 2,
      "clues": "- Inelastic demand means price has little influence.\n- Refer to the quantity demanded.",
      "approach": "- State what happened to the price and the quantity.\n- Link this to the meaning of inelasticity.",
      "solution": "1. The change in price had little influence on the quantity of maize demanded."
    },
    {
      "number": "2.3.3",
      "marks": 2,
      "clues": "- Think about whether buyers can switch to another product.\n- Link substitutes to elasticity.",
      "approach": "- Recall what a substitute product is.\n- Explain its effect on elasticity.",
      "solution": "1. When substitutes are available, the demand for the product tends to be more elastic; with no substitutes it tends to be more inelastic."
    },
    {
      "number": "2.4.1",
      "marks": 1,
      "clues": "- Function D moves products to the market.\n- Look at the other three functions.",
      "approach": "- Identify functions A, B and C from their descriptions.\n- Name the remaining function, D.",
      "solution": "1. D is transportation."
    },
    {
      "number": "2.4.2",
      "marks": 2,
      "clues": "- B changes products to a more usable form.\n- Give two benefits.",
      "approach": "- Name function B (processing).\n- List two advantages.",
      "solution": "1. Processing increases the value of the product and reduces spoilage; it also ensures year-round availability."
    },
    {
      "number": "2.4.3",
      "marks": 1,
      "clues": "- C is the function shown by a packaged product.\n- Think about food safety.",
      "approach": "- Identify function C (packaging).\n- State one safety guideline.",
      "solution": "1. Packaging must prevent harmful microbial growth, protect against mechanical damage, and keep products free from chemicals or foreign objects."
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
