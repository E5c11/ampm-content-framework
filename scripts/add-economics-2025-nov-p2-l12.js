#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 3.2.1–3.2.3: Tourism funding and sectors (order 12)
 * Lesson 12 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 3.2.1–3.2.3: Tourism funding and sectors. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l12.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l12.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l12.js
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
  "name": "Question 3.2.1–3.2.3: Tourism funding and sectors",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "tourism",
    "cultural_tourism"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q12/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q12/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "An extract explains that a fund set up by a government department gives grants, loans and equity to entrepreneurs who invest in tourism. What does the fund provide?",
    "metadata": [
      "Free transport for tourists around the country",
      "Price controls on hotel accommodation rates",
      "Compulsory insurance for all foreign visitors",
      "Financial assistance for capital investment",
      ""
    ],
    "answer": [
      "Financial assistance for capital investment",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "tourism",
    "topic": "tourism_benefits_and_policy",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Look at what the fund gives entrepreneurs."
  },
  {
    "name": "Question 2",
    "question": "Tourism, which provides services to visitors, is classified under which economic sector?",
    "metadata": [
      "Primary sector",
      "Secondary sector",
      "Quaternary sector",
      "Tertiary sector",
      ""
    ],
    "answer": [
      "Tertiary sector",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "tourism",
    "topic": "tourism_concepts",
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
    "clues": "- The sector groups services rather than raw materials or manufacturing."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the activities that are examples of cultural tourism.",
    "metadata": [
      "Touring a heritage village to see traditional crafts",
      "Bungee jumping from a bridge above a river gorge",
      "Visiting a museum to learn about local history",
      "Watching birds in a nature reserve at sunrise",
      "Attending an exhibition at an art gallery"
    ],
    "answer": [
      "Visiting a museum to learn about local history",
      "Touring a heritage village to see traditional crafts",
      "Attending an exhibition at an art gallery",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "tourism",
    "topic": "tourism_concepts",
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
    "clues": "- Cultural tourism is about learning from and engaging with a place’s culture.\n- Two options are adventure or nature activities."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2.1",
      "marks": 1,
      "clues": "- The initiative is named in the extract.",
      "approach": "- Scan the extract for a fund that provides financial assistance.",
      "solution": "1. The Tourism Transformation Fund (TTF) provides financial assistance for tourism investments."
    },
    {
      "number": "3.2.2",
      "marks": 1,
      "clues": "- Tourism provides services.",
      "approach": "- Recall the economic sectors.\n- Name the one for services.",
      "solution": "1. Tourism is classified under the tertiary sector."
    },
    {
      "number": "3.2.3",
      "marks": 2,
      "clues": "- Think of museums, art galleries and learning about a culture.",
      "approach": "- Define cultural tourism in a sentence.",
      "solution": "1. Cultural tourism is the activities of people travelling to museums and art galleries to learn and engage with the culture of the place they visit."
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
