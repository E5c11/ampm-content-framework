#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 10.1: Presenting in a hall and updates that must finish (order 21)
 * Question 10.1.1, 10.1.2 and 10.1.3 — extra hardware for a presentation, a suitable type of application software and the consequences of switching a laptop off during updates.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l21.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l21.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l21.js
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
  "name": "Question 10.1: Presenting in a hall and updates that must finish",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 21,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "presentation_hardware",
    "presentation_software",
    "software_updates_risks"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q21/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q21/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A learner will present to a large hall using a laptop. Which TWO additional devices are needed?",
    "metadata": [
      "A scanner",
      "A data projector",
      "A microphone",
      "A barcode reader",
      "A card reader"
    ],
    "answer": [
      "A data projector",
      "A microphone",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "systems_technologies",
    "topic": "output_devices",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "A committee wants to show slides with pictures and video clips at an assembly. Which type of application software is most suitable?",
    "metadata": [
      "Spreadsheet software",
      "Database software",
      "Presentation software",
      "Web browser software",
      ""
    ],
    "answer": [
      "Presentation software",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "systems_technologies",
    "topic": "application_software",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application",
    "clues": "- The slides must hold text, images and video.\n- Think about software built for showing slides."
  },
  {
    "name": "Question 3",
    "question": "A laptop is switched off while its updates are still installing. Which TWO consequences can follow?",
    "metadata": [
      "The update finishes faster the next time",
      "The installation is interrupted",
      "The memory capacity of the laptop increases",
      "The software may be left corrupted or with errors",
      "All the files are backed up automatically"
    ],
    "answer": [
      "The installation is interrupted",
      "The software may be left corrupted or with errors",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "systems_technologies",
    "topic": "software_updates",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "10.1.1",
      "marks": 2,
      "clues": "- The chairperson presents in a school hall.\n- Think about what the audience must see and hear.",
      "approach": "- Name two extra devices.",
      "solution": "1. Any two: data projector, pointing device, smart board, microphone or speakers."
    },
    {
      "number": "10.1.2",
      "marks": 2,
      "clues": "- Name the type of software and say why it suits.\n- One mark for the type and one for the motivation.",
      "approach": "- Choose software for showing slides.",
      "solution": "1. Presentation software.\n2. It allows visually engaging slides with text, images and multimedia."
    },
    {
      "number": "10.1.3",
      "marks": 2,
      "clues": "- Updates were installing when the laptop was switched off.\n- Think about what happens to a half-finished installation.",
      "approach": "- Discuss two consequences.",
      "solution": "1. The download or install process is interrupted.\n2. This causes errors or corruption in the software."
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
