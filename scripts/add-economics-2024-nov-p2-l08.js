#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 2.3.1–2.3.3: Externalities graph (order 8)
 * Lesson 8 of 2024 Nov P2 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l08.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l08.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l08.js
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

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 2.3.1–2.3.3: Externalities graph",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "externalities",
    "market_failure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q8/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q8/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the graph (illustrative). Which curve represents the marginal private benefit?",
    "metadata": [
      "S",
      "MPB",
      "MSB",
      "the price axis",
      ""
    ],
    "answer": [
      "MPB",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "reading",
    "unit": "market_failures",
    "topic": "externalities_and_efficiency",
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
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The marginal private benefit is what the individual buyer gains, so it lies below the curve that adds the benefit to others.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p2/q8/diagram_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Study the graph (illustrative). What is the external benefit per vaccination, in rand, at a quantity of 80? []",
    "metadata": [
      "External benefit (R) = ",
      "[ ]"
    ],
    "answer": [
      "20",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "reading",
    "unit": "market_failures",
    "topic": "externalities_and_efficiency",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The external benefit is the vertical gap between the marginal social benefit and the marginal private benefit at that quantity.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p2/q8/diagram_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Which statement describes externalities?",
    "metadata": [
      "prices that are set by the government in law",
      "profits that are earned by the producer alone",
      "costs or benefits for third parties",
      "taxes that are paid by consumers on purchases",
      ""
    ],
    "answer": [
      "costs or benefits for third parties",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "market_failures",
    "topic": "externalities_and_efficiency",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Externalities are spill-overs that the market price does not include."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the examples of negative externalities.",
    "metadata": [
      "Pollution from a factory",
      "Free vaccinations for children",
      "Traffic congestion",
      "Illness caused by smoke",
      "A new road that cuts travel times"
    ],
    "answer": [
      "Pollution from a factory",
      "Traffic congestion",
      "Illness caused by smoke",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "market_failures",
    "topic": "externalities_and_efficiency",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A negative externality imposes a cost on people who did not choose the activity."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3.1",
      "marks": 1,
      "clues": "- Find the curve that shows private benefit.",
      "approach": "- Identify the curve.",
      "solution": "The marginal private benefit is curve DD (D)."
    },
    {
      "number": "2.3.2",
      "marks": 1,
      "clues": "- Think of a cost imposed on third parties.",
      "approach": "- Give one example.",
      "solution": "Pollution, illnesses and diseases or traffic congestion (any other correct response)."
    },
    {
      "number": "2.3.3",
      "marks": 2,
      "clues": "- Think of spill-over costs and benefits.",
      "approach": "- Describe the term.",
      "solution": "Externalities are costs and benefits to third parties that are not included in market prices (spill-over effects)."
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
