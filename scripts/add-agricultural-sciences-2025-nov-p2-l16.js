#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 3.6–3.7: External forces, sources of risk and management skills (order 16)
 * Question 3.6–3.7 — external forces that influence a farm enterprise, sources of risk and general management skills. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l16.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l16.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l16.js
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
  "name": "Question 3.6–3.7: External forces, sources of risk and management skills",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "external_forces",
    "sources_of_risk",
    "management_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q16/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q16/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each event to the source of risk that it creates for the farmer.",
    "metadata": [
      "A - Interest rates on the farm loan rise",
      "B - The price of maize falls at harvest",
      "C - Hail destroys the crop",
      "D - A key worker is injured on the farm",
      "1 - Financial risk",
      "2 - Market and price risk",
      "3 - Production risk",
      "4 - Human risk"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "production_factors",
    "topic": "risks_and_forces",
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
    "question": "The government raises the fuel levy, which increases the farmer’s running costs. Which external force is this?",
    "metadata": [
      "Technological change",
      "Social and cultural",
      "Economic or political",
      "Competition from rivals",
      ""
    ],
    "answer": [
      "Economic or political",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "production_factors",
    "topic": "risks_and_forces",
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
    "clues": "- Decisions about taxes and levies come from government."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the general management skills that are needed to manage a farming business.",
    "metadata": [
      "Avoiding decisions",
      "Financial management",
      "Labour management",
      "Planning and organising skills",
      "Ignoring new knowledge"
    ],
    "answer": [
      "Financial management",
      "Labour management",
      "Planning and organising skills",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "production_factors",
    "topic": "management_skills",
    "subtopic": "agri_classification",
    "skills": [
      "apply_management_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Good managers plan, organise and look after finances and people."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.6.1",
      "marks": 2,
      "clues": "- One force involves taxes; the other involves buyers.\n- Think about economic, political and competition.",
      "approach": "- Read each event.\n- Name the external force.",
      "solution": "1. (a) An increase in VAT on commodities is an economic or political force.\n2. (b) New emerging markets for farm products are a competition force."
    },
    {
      "number": "3.6.2",
      "marks": 2,
      "clues": "- Link each force to the risk it creates.\n- Do each part separately.",
      "approach": "- Think about the effect of the VAT increase.\n- Think about the effect of new markets.",
      "solution": "1. (a) The VAT increase is a financial (market and price) risk.\n2. (b) New emerging markets are a market and price risk."
    },
    {
      "number": "3.7",
      "marks": 2,
      "clues": "- Think about what a manager must handle.\n- Give two skills.",
      "approach": "- Recall the general management skills.\n- Choose two.",
      "solution": "1. Labour management and financial management (also accepted: land management, planning, organising and communication skills)."
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
