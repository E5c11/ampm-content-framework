#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 2.4: Duty-free allowances and the red channel (order 10)
 * Question 2.4 — why a returning traveller whose goods exceed the duty-free allowances must use the red channel.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l10.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l10.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l10.js
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
  "name": "Question 2.4: Duty-free allowances and the red channel",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "customs_channels",
    "duty_free_goods"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q10/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q10/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Duty-free allowances for a traveller entering South Africa include 2 litres of wine, 20 cigars and 50 mℓ of perfume. Thandi's luggage holds the items below. Select ALL the items that exceed the allowance.",
    "metadata": [
      "50 mℓ of perfume",
      "One pair of sneakers",
      "3 litres of wine",
      "30 cigars",
      "A box of chocolates"
    ],
    "answer": [
      "3 litres of wine",
      "30 cigars",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "map_work_tour_planning",
    "topic": "customs_regulations",
    "subtopic": "tour_data_interpretation",
    "skills": [
      "interpret_tourism_stimulus"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "interpretation"
  },
  {
    "name": "Question 2",
    "question": "Thandi's goods exceed the duty-free allowance. Which customs channel must she use?",
    "metadata": [
      "The green channel",
      "The transit channel",
      "The red channel",
      "The crew channel",
      ""
    ],
    "answer": [
      "The red channel",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "map_work_tour_planning",
    "topic": "customs_regulations",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Put the steps a returning traveller follows after landing at OR Tambo International Airport in order.",
    "metadata": [
      "Collect baggage at the carousel",
      "Leave the aircraft",
      "Pass through the customs channel",
      "Passport control"
    ],
    "answer": [
      "Leave the aircraft",
      "Passport control",
      "Collect baggage at the carousel",
      "Pass through the customs channel"
    ],
    "presentation": "ordering",
    "unit": "map_work_tour_planning",
    "topic": "customs_regulations",
    "subtopic": "tour_process_sequence",
    "skills": [
      "sequence_tourism_process"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "ordering"
  },
  {
    "name": "Question 4",
    "question": "Why does a traveller go through the red channel?",
    "metadata": [
      "They carry only items within the allowance",
      "They carry goods that must be declared",
      "They are only passing through in transit",
      "They have no checked baggage with them",
      ""
    ],
    "answer": [
      "They carry goods that must be declared",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "map_work_tour_planning",
    "topic": "customs_regulations",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.4",
      "marks": 4,
      "clues": "- Compare each item with the duty-free allowances.\n- The red channel is for goods to declare.",
      "approach": "- Check which items are over the allowance.\n- Explain what that means at customs.",
      "solution": "1. He carried items that had to be declared.\n2. The items exceeded the duty-free allowances (e.g. 30 cigars, 3 litres of wine), so he had to pay tax on them."
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
