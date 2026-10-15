#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 2.7–2.8: Entrepreneurship and the business plan (order 11)
 * Question 2.7–2.8 — the phases of the entrepreneurial process, the meaning of entrepreneurship and what investors look for in a business plan. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l11.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l11.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l11.js
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
  "name": "Question 2.7–2.8: Entrepreneurship and the business plan",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "entrepreneurial_process",
    "entrepreneurship",
    "business_plan_content"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q11/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q11/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange the phases of the entrepreneurial process in the correct order.",
    "metadata": [
      "Mobilise resources",
      "Take action to serve the market",
      "Plan the business",
      "Identify an opportunity"
    ],
    "answer": [
      "Identify an opportunity",
      "Plan the business",
      "Mobilise resources",
      "Take action to serve the market"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "agricultural_management_and_marketing",
    "topic": "entrepreneurial_process",
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
    "year": 2025,
    "paper": "nov_p2"
  },
  {
    "name": "Question 2",
    "question": "A young farmer brings together land, equipment and funds to turn a gap in the market for herbs into a new business. Which concept does this describe?",
    "metadata": [
      "Price fixing",
      "Diversification",
      "Consolidation",
      "Entrepreneurship",
      ""
    ],
    "answer": [
      "Entrepreneurship",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "entrepreneurship_and_business_plan",
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
    "paper": "nov_p2",
    "clues": "- The farmer combines resources to use an opportunity and create a business venture."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the aspects that potential investors look for in a business plan.",
    "metadata": [
      "The colour of the farm’s logo",
      "Financial viability of the business",
      "A marketing plan",
      "An analysis of strengths and threats",
      "The personal hobbies of the owner"
    ],
    "answer": [
      "Financial viability of the business",
      "A marketing plan",
      "An analysis of strengths and threats",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "entrepreneurship_and_business_plan",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Investors want to know if the business will make money and how it will cope."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the electronic resources that can be used as tools to draw up a business plan.",
    "metadata": [
      "A printed telephone directory",
      "A laptop or cell phone",
      "Computer software programmes",
      "An internet or Wi-Fi connection",
      "A paper diary"
    ],
    "answer": [
      "A laptop or cell phone",
      "Computer software programmes",
      "An internet or Wi-Fi connection",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "entrepreneurship_and_business_plan",
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
    "clues": "- The resources must be electronic."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.7.1",
      "marks": 2,
      "clues": "- The process starts with an idea and ends with serving the market.\n- A comes before planning.",
      "approach": "- Read the phases shown in the illustration.\n- Identify the phases that A and B represent.",
      "solution": "1. A is to identify an opportunity (generate a business idea).\n2. B is to plan the business (develop a business plan)."
    },
    {
      "number": "2.7.2",
      "marks": 2,
      "clues": "- Entrepreneurship involves resources and an opportunity.\n- It leads to a new business.",
      "approach": "- Recall the definition.\n- State the key parts.",
      "solution": "1. Entrepreneurship is a process of bringing together resources and assets to use an opportunity to create a business venture."
    },
    {
      "number": "2.8.1",
      "marks": 2,
      "clues": "- Investors want to know the business will succeed.\n- Give two aspects.",
      "approach": "- Recall the contents of a business plan.\n- Choose two aspects investors check.",
      "solution": "1. Financial viability (financial plan) and the SWOT analysis; the marketing plan and human resource plan are also accepted."
    },
    {
      "number": "2.8.2",
      "marks": 2,
      "clues": "- The tools are electronic.\n- Think about devices and software.",
      "approach": "- List electronic tools.\n- Choose two.",
      "solution": "1. Computers, cell phones or laptops, and computer software programmes (also Wi-Fi connections or data)."
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
