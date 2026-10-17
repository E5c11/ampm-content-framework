#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 4.4–4.7: File paths, backups, Creative Commons and searching for files (order 6)
 * Question 4.4, 4.5.1, 4.5.2, 4.6 and 4.7 — parts of a file path, data loss, backup policy, the Creative Commons licence and locating files.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l06.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l06.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l06.js
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
  "name": "Question 4.4–4.7: File paths, backups, Creative Commons and searching for files",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "file_paths",
    "data_loss_and_backup",
    "creative_commons",
    "searching_for_files"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q6/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each part of the path F:\\PHOTOS\\TRIP.JPG to what it is.",
    "metadata": [
      "A - F:",
      "B - PHOTOS",
      "C - TRIP",
      "D - .JPG",
      "1 - The folder",
      "2 - The file name",
      "3 - The file extension",
      "4 - The drive"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "systems_technologies",
    "topic": "file_management",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application",
    "clues": "- A path starts with the drive and ends with the file.\n- The extension shows the file type."
  },
  {
    "name": "Question 2",
    "question": "Which TWO events can cause data loss?",
    "metadata": [
      "Files are backed up to a second drive",
      "A power surge damages the hard drive",
      "Antivirus software is kept up to date",
      "A memory card is formatted by accident",
      "Files are stored in clearly named folders"
    ],
    "answer": [
      "A power surge damages the hard drive",
      "A memory card is formatted by accident",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "systems_technologies",
    "topic": "data_loss_and_backup",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Which TWO guidelines about storage media belong in a backup policy?",
    "metadata": [
      "Keep the only backup on the computer's own hard drive",
      "Let each user choose any medium they like",
      "Do not keep the backup in the same place as the original data",
      "Make copies on more than one type of storage medium",
      "Store backup media next to the computer they protect"
    ],
    "answer": [
      "Do not keep the backup in the same place as the original data",
      "Make copies on more than one type of storage medium",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "systems_technologies",
    "topic": "data_loss_and_backup",
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
    "question": "What does a Creative Commons (CC) licence allow?",
    "metadata": [
      "Anyone may claim the work as their own after copying it",
      "The owner gives up all copyright in the work for ever",
      "Only people who pay a licence fee may use the work",
      "Others may use and share it under the owner's conditions",
      ""
    ],
    "answer": [
      "Others may use and share it under the owner's conditions",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "social_implications",
    "topic": "copyright_and_licences",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 5",
    "question": "Which TWO ways can help find a video file when the date it was saved is not known?",
    "metadata": [
      "Compress the whole folder into a ZIP file",
      "Search by part of the file name",
      "Search by the file type (extension)",
      "Empty the recycle bin first",
      "Change the screen resolution"
    ],
    "answer": [
      "Search by part of the file name",
      "Search by the file type (extension)",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "systems_technologies",
    "topic": "file_management",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
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
      "number": "4.4",
      "marks": 2,
      "clues": "- The path is read from the drive down to the file.\n- A and B are the first two parts.",
      "approach": "- Identify what C: is and what MYSTUFF is.",
      "solution": "1. A is the drive (C:).\n2. B is the folder (folder name)."
    },
    {
      "number": "4.5.1",
      "marks": 2,
      "clues": "- Think about hardware, software, people and disasters.\n- Explain TWO ways.",
      "approach": "- Choose two different causes of data loss.",
      "solution": "1. Hardware failure, such as a hard drive crash or a power surge.\n2. Malware, accidental deletion or natural disasters such as fire or flood."
    },
    {
      "number": "4.5.2",
      "marks": 2,
      "clues": "- The guidelines are about storage media.\n- Think about where and on what a backup is kept.",
      "approach": "- Consider location, the type of media and the number of copies.",
      "solution": "1. Do not store the backup in the same location as the original data.\n2. Specify the storage media, and make multiple backups on different types of media."
    },
    {
      "number": "4.6",
      "marks": 2,
      "clues": "- A CC licence is a type of copyright agreement.\n- It sets conditions for use.",
      "approach": "- Say what the agreement allows and under what conditions.",
      "solution": "1. It is a copyright agreement.\n2. It allows anyone to use and share the content under certain conditions set by the owner."
    },
    {
      "number": "4.7",
      "marks": 2,
      "clues": "- The date is unknown.\n- Use other details of the file.",
      "approach": "- Think about the name, the type and the recent files list.",
      "solution": "1. Search by file type or extension.\n2. Search by the file name or part of the name.\n3. Accepted: check the recent files list of the application."
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
