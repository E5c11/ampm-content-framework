#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 2.1–2.2: Supply, demand and promotion (order 8)
 * Question 2.1–2.2 — shortage and equilibrium in a market and the methods of promoting products. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l08.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l08.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l08.js
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
  "name": "Question 2.1–2.2: Supply, demand and promotion",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "supply_and_demand",
    "market_shortage",
    "market_equilibrium"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q8/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q8/memo_1.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A drought halves the supply of onions while consumers still want the same quantity. What situation arises in the market?",
    "metadata": [
      "A surplus",
      "A shortage",
      "Equilibrium",
      "Price fixing",
      ""
    ],
    "answer": [
      "A shortage",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "supply_and_demand",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Compare the quantity supplied with the quantity demanded."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the factors that could lead to a shortage of a product in the market.",
    "metadata": [
      "New technology that raises the yield per hectare",
      "Adverse weather that destroys part of the crop",
      "Fewer producers entering the market",
      "High production costs that discourage production",
      "Farmers planting a larger area of the crop"
    ],
    "answer": [
      "Adverse weather that destroys part of the crop",
      "Fewer producers entering the market",
      "High production costs that discourage production",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "supply_and_demand",
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
    "clues": "- A shortage means that too little is supplied compared with the demand."
  },
  {
    "name": "Question 3",
    "question": "Which statement describes a market that is at equilibrium?",
    "metadata": [
      "The quantity supplied is far above the quantity demanded",
      "The quantity supplied is far below the quantity demanded",
      "The price is fixed by the government",
      "The quantity demanded equals the quantity supplied",
      ""
    ],
    "answer": [
      "The quantity demanded equals the quantity supplied",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "agricultural_management_and_marketing",
    "topic": "supply_and_demand",
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
    "paper": "nov_p2",
    "clues": "- At equilibrium the market is in balance."
  },
  {
    "name": "Question 4",
    "question": "Match each promotion method to an example.",
    "metadata": [
      "A - Advertisement",
      "B - In-store promotion",
      "C - Personal selling",
      "D - Trade fair",
      "1 - A poster showing the weekly special on lamb",
      "2 - A free tasting of cheese in the shop",
      "3 - A representative visiting a restaurant to sell produce",
      "4 - A producer’s stand at an agricultural exhibition"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "product_promotion",
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
    "paper": "nov_p2"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1.1",
      "marks": 1,
      "clues": "- Compare the quantity supplied with the quantity demanded.\n- Fewer products are supplied than demanded.",
      "approach": "- Read the situation described.\n- Name the market condition.",
      "solution": "1. When fewer products are supplied than demanded, there is a shortage (under-supply or deficit)."
    },
    {
      "number": "2.1.2",
      "marks": 1,
      "clues": "- Think about what can reduce supply.\n- Name one factor only.",
      "approach": "- Recall the factors that influence supply.\n- Choose one that leads to a shortage.",
      "solution": "1. High production costs, lack of technology, adverse environmental conditions or fewer producers can all lead to a shortage."
    },
    {
      "number": "2.1.3",
      "marks": 2,
      "clues": "- Compare the quantity demanded with the quantity supplied.\n- At equilibrium the two are balanced.",
      "approach": "- Recall the definition of market equilibrium.\n- State the relationship between demand and supply.",
      "solution": "1. Market equilibrium is the situation where the quantity demanded is equal to the quantity supplied."
    },
    {
      "number": "2.2.1",
      "marks": 1,
      "clues": "- The picture shows an advert with a special offer.\n- It tries to attract buyers.",
      "approach": "- Look at the poster.\n- Name the method of promotion it shows.",
      "solution": "1. The poster is an advertisement."
    },
    {
      "number": "2.2.2",
      "marks": 2,
      "clues": "- Think about ways other than advertising.\n- Give two methods.",
      "approach": "- Recall the methods of promoting products.\n- Choose two.",
      "solution": "1. In-store promotion and personal selling (also accepted: direct mailing, internet selling, trade fairs and exhibitions)."
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
