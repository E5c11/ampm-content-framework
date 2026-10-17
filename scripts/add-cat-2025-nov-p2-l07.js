#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 4.8–4.11: Accessibility, ergonomics, troubleshooting and 3D printing (order 7)
 * Question 4.8, 4.9, 4.10 and 4.11 — an accessibility feature, ergonomic design, an unresponsive monitor and how a 3D printer works.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l07.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l07.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l07.js
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
  "name": "Question 4.8–4.11: Accessibility, ergonomics, troubleshooting and 3D printing",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "accessibility_features",
    "ergonomics",
    "troubleshooting",
    "3d_printing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q7/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q7/memo_1.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A user with an injury can press only one key at a time. Name the accessibility feature that lets them use shortcuts such as Ctrl+C by pressing the keys one after another. []",
    "metadata": [
      "Feature: ",
      "[ ]"
    ],
    "answer": [
      "sticky keys|sticky key|stickykeys",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "unit": "systems_technologies",
    "topic": "accessibility",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application",
    "clues": "- The problem is pressing several keys together.\n- The fix lets the keys be pressed in turn."
  },
  {
    "name": "Question 2",
    "question": "What does it mean when a keyboard is described as ergonomically designed?",
    "metadata": [
      "It is designed to be as cheap as possible to make",
      "It is designed to work only with computers that are made by one company",
      "It is designed to use very little electricity",
      "It is designed to be comfortable and to prevent health problems",
      ""
    ],
    "answer": [
      "It is designed to be comfortable and to prevent health problems",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "social_implications",
    "topic": "health_and_ergonomics",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 3",
    "question": "A monitor's power light is on, but the screen stays blank. Which TWO checks should be done first?",
    "metadata": [
      "Reinstall the operating system from the start",
      "Check that the display cable is connected",
      "Replace the keyboard with a different one",
      "Check the brightness and contrast settings",
      "Defragment the hard drive and restart twice"
    ],
    "answer": [
      "Check that the display cable is connected",
      "Check the brightness and contrast settings",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "systems_technologies",
    "topic": "troubleshooting",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
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
  },
  {
    "name": "Question 4",
    "question": "Put the steps a 3D printer follows to make an object in the correct order.",
    "metadata": [
      "The printer lays down material in a thin layer",
      "The design is prepared as a digital model in a file",
      "More layers build up on top of each other until the object is complete",
      "The printer reads the design from the file"
    ],
    "answer": [
      "The design is prepared as a digital model in a file",
      "The printer reads the design from the file",
      "The printer lays down material in a thin layer",
      "More layers build up on top of each other until the object is complete"
    ],
    "presentation": "ordering",
    "unit": "systems_technologies",
    "topic": "output_devices",
    "subtopic": "cat_sequencing",
    "skills": [
      "sequence_cat_process"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "ordering"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.8",
      "marks": 1,
      "clues": "- The user struggles to press several keys at once.\n- The feature is built into the operating system.",
      "approach": "- Recall the accessibility options for the keyboard.",
      "solution": "1. Sticky keys, filter keys or toggle keys."
    },
    {
      "number": "4.9",
      "marks": 2,
      "clues": "- Ergonomic design is about comfort.\n- It also affects health.",
      "approach": "- Define the term in two parts.",
      "solution": "1. Devices or equipment designed to be comfortable.\n2. Designed to prevent health issues."
    },
    {
      "number": "4.10",
      "marks": 2,
      "clues": "- The monitor has power but shows nothing.\n- Start with the simplest checks.",
      "approach": "- Think about the computer, the cables and the display settings.",
      "solution": "1. Check that the computer is switched on, or check the connection cables.\n2. Check the brightness and contrast settings, the signal input button or the graphics card."
    },
    {
      "number": "4.11",
      "marks": 2,
      "clues": "- A 3D printer builds an object from a design.\n- It uses layers.",
      "approach": "- Describe where the design comes from and how it is built.",
      "solution": "1. The printer reads the design from a file or digital model of the item.\n2. It gradually adds material in thin layers on top of one another."
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
