#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 4.3.1–4.3.3: Waste and biodiversity (order 21)
 * Lesson 21 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 4.3.1–4.3.3: Waste and biodiversity. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l21.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l21.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l21.js
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
  "name": "Question 4.3.1–4.3.3: Waste and biodiversity",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 21,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "environmental_policy",
    "waste_management"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q21/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q21/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A report warns that careless disposal of chemicals is wiping out many plant and animal species in a wetland. Which environmental problem is this?",
    "metadata": [
      "Soil salinity",
      "Global warming",
      "Noise pollution",
      "Biodiversity loss",
      ""
    ],
    "answer": [
      "Biodiversity loss",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "environmental_sustainability",
    "topic": "environmental_problems",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The problem is about the number of different living things."
  },
  {
    "name": "Question 2",
    "question": "A government runs school programmes and media campaigns that teach households to sort their waste. Which method of environmental management is this?",
    "metadata": [
      "Marketable permits",
      "Education to create environmental awareness",
      "Quantity standards",
      "Subsidies to polluters",
      ""
    ],
    "answer": [
      "Education to create environmental awareness",
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
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The aim is to change behaviour by informing people."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the examples of land pollution.",
    "metadata": [
      "Illegal dumping of household waste",
      "Industrial waste left on open ground",
      "Leaking landfill sites",
      "Smog over a city",
      "Noise from a factory"
    ],
    "answer": [
      "Illegal dumping of household waste",
      "Industrial waste left on open ground",
      "Leaking landfill sites",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "environmental_sustainability",
    "topic": "environmental_problems",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Land pollution is waste introduced onto the land surface.\n- Two options pollute the air or the soundscape."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.3.1",
      "marks": 1,
      "clues": "- The extract mentions the loss of living species.",
      "approach": "- Find the problem linked to plant and animal species.",
      "solution": "1. The reduction of plant and animal species is biodiversity loss."
    },
    {
      "number": "4.3.2",
      "marks": 1,
      "clues": "- It is a way of informing the public.",
      "approach": "- Recall government methods for awareness.",
      "solution": "1. The method used by government to create environmental awareness is education."
    },
    {
      "number": "4.3.3",
      "marks": 2,
      "clues": "- The waste ends up on the ground.",
      "approach": "- Define land pollution.",
      "solution": "1. Land pollution occurs when household and industrial waste is introduced onto the land surface."
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
