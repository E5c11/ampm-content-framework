#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 3.3.1–3.3.3: Summits, deforestation and permits (order 14)
 * Lesson 14 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 3.3.1–3.3.3: Summits, deforestation and permits. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l14.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l14.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l14.js
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
  "name": "Question 3.3.1–3.3.3: Summits, deforestation and permits",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "international_agreements",
    "environmental_policy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q14/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q14/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each international agreement to what it is known for.",
    "metadata": [
      "A - Rio de Janeiro Summit (1992)",
      "B - Johannesburg Summit (2002)",
      "C - Kyoto Protocol (1997)",
      "D - Paris Agreement (2015)",
      "1 - An early world summit on environment and development",
      "2 - The world summit on sustainable development",
      "3 - Binding emission targets for industrialised countries",
      "4 - A goal to keep warming well below 2 °C"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "environmental_sustainability",
    "topic": "international_agreements",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Use the year and the focus of each agreement."
  },
  {
    "name": "Question 2",
    "question": "Large areas of forest are cleared for farming and fuel. Which environmental problem does the removal of trees represent?",
    "metadata": [
      "Soil salinity",
      "Deforestation",
      "Ozone depletion",
      "Acid rain",
      ""
    ],
    "answer": [
      "Deforestation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "environmental_sustainability",
    "topic": "environmental_problems",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The problem is named after what is being removed."
  },
  {
    "name": "Question 3",
    "question": "Government sells a limited number of licences that allow factories to release a set amount of a pollutant, and firms may trade unused licences. Which instrument is this?",
    "metadata": [
      "A subsidy",
      "A quality standard",
      "A carbon tax",
      "Marketable (tradable) permits",
      ""
    ],
    "answer": [
      "Marketable (tradable) permits",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "environmental_sustainability",
    "topic": "environmental_policy_instruments",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The licences themselves are bought and sold."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.3.1",
      "marks": 1,
      "clues": "- The cartoon lists several summits.",
      "approach": "- Find the one about sustainable development.",
      "solution": "1. The Johannesburg summit of 2002 is the world summit on sustainable development."
    },
    {
      "number": "3.3.2",
      "marks": 1,
      "clues": "- The problem is named after what is removed.",
      "approach": "- State the environmental problem.",
      "solution": "1. The removal of trees is called deforestation."
    },
    {
      "number": "3.3.3",
      "marks": 2,
      "clues": "- It is a licence with a trading element.",
      "approach": "- Define the term.\n- Mention pollution to a certain degree.",
      "solution": "1. A marketable permit is a licence sold by government to a business that allows it to pollute the environment to a certain degree."
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
