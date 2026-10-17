#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 4.1–4.3: Flash drives, the motherboard and the recycle bin (order 5)
 * Question 4.1.1–4.1.3, 4.2 and 4.3 — plug-and-play, the information processing cycle, flash drives, the motherboard and the recycle bin.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l05.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l05.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l05.js
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
  "name": "Question 4.1–4.3: Flash drives, the motherboard and the recycle bin",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "plug_and_play",
    "information_processing_cycle",
    "flash_drives",
    "motherboard",
    "recycle_bin"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q5/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q5/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each term to the description that fits it.",
    "metadata": [
      "A - Plug-and-play",
      "B - Motherboard",
      "C - Recycle bin",
      "D - Flash drive",
      "1 - The main circuit board that connects the components",
      "2 - Temporary holding place from which deleted files can be restored",
      "3 - Small portable storage device that connects through a USB port",
      "4 - Detects new hardware and installs its driver automatically"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "systems_technologies",
    "topic": "hardware_and_system_components",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "A learner saves a finished essay onto a memory card so it can be kept for later. Which stage of the information processing cycle is this?",
    "metadata": [
      "Input",
      "Processing",
      "Storage",
      "Output",
      ""
    ],
    "answer": [
      "Storage",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "systems_technologies",
    "topic": "information_processing_cycle",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
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
    "clues": "- The essay is already finished.\n- The data is being kept for later use."
  },
  {
    "name": "Question 3",
    "question": "Which TWO are reasons why a flash drive is not suitable for archiving files for many years?",
    "metadata": [
      "It cannot store document files at all",
      "It needs an internet connection to keep data",
      "Its storage capacity is small for archiving",
      "It is small and easily lost or stolen",
      "It deletes every file when it is removed"
    ],
    "answer": [
      "Its storage capacity is small for archiving",
      "It is small and easily lost or stolen",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "systems_technologies",
    "topic": "storage_devices",
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
  },
  {
    "name": "Question 4",
    "question": "Which TWO describe what the recycle bin is used for?",
    "metadata": [
      "To compress files so they take up less space",
      "To hold deleted files for a while before they are removed for good",
      "To restore a file that was deleted by mistake",
      "To scan files for viruses before they are opened",
      "To make a second copy of every file automatically"
    ],
    "answer": [
      "To hold deleted files for a while before they are removed for good",
      "To restore a file that was deleted by mistake",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "systems_technologies",
    "topic": "file_management",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.1",
      "marks": 1,
      "clues": "- The technology works without manual installation.\n- It detects new hardware and installs a driver.",
      "approach": "- Recall the term for hardware that is detected and set up automatically.",
      "solution": "1. The technology is plug-and-play."
    },
    {
      "number": "4.1.2",
      "marks": 1,
      "clues": "- Think about what a flash drive does with data.\n- Use the stages of the information processing cycle.",
      "approach": "- Match a flash drive to input, processing, output or storage.",
      "solution": "1. A flash drive is used in the storage stage."
    },
    {
      "number": "4.1.3",
      "marks": 2,
      "clues": "- The question asks why a flash drive is NOT suitable for archiving.\n- Think about capacity, loss and cost.",
      "approach": "- Compare a flash drive with archive media such as optical discs or magnetic tape.\n- List two weaknesses.",
      "solution": "1. A flash drive has a smaller storage capacity.\n2. It can easily be misplaced, lost or stolen.\n3. Accepted: a high cost per GB, or better archive technology such as optical storage or magnetic tape."
    },
    {
      "number": "4.2",
      "marks": 2,
      "clues": "- The motherboard links the parts of the computer.\n- Give TWO reasons.",
      "approach": "- Think about connections, communication and power.",
      "solution": "1. It connects all the components.\n2. It connects the peripherals and ports, and allows them to communicate.\n3. Accepted: it provides power to components and peripherals."
    },
    {
      "number": "4.3",
      "marks": 2,
      "clues": "- The recycle bin holds deleted items.\n- Two uses are asked for.",
      "approach": "- Think about what happens to a file when it is deleted.",
      "solution": "1. It temporarily stores deleted files and folders.\n2. It allows the user to recover files that were deleted."
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
