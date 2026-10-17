#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 1–3: Systems Technologies (Section A) (order 1)
 * Section A items on systems technologies — Questions 1.1, 1.4, 1.6, 1.7, 2.1, 2.6, 2.7 and 3.1.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l01.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l01.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l01.js
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
  "name": "Question 1–3: Systems Technologies (Section A)",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "file_compression",
    "touch_screen",
    "projector_settings",
    "ups_and_rom",
    "software_updates"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q1/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q1/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q1/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A learner must e-mail 30 files, but the attachment limit is small. Which action packs the files into one smaller file?",
    "metadata": [
      "Convert the files to RTF format",
      "Save each file as a bitmap image",
      "Compress the files into a ZIP archive",
      "Rename each file with a .wav extension",
      ""
    ],
    "answer": [
      "Compress the files into a ZIP archive",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "systems_technologies",
    "topic": "file_types_and_compression",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application",
    "clues": "- The files must be packed together AND made smaller.\n- Think about the file type used for an archive."
  },
  {
    "name": "Question 2",
    "question": "Match each term to the description that fits it.",
    "metadata": [
      "A - UPS",
      "B - ROM",
      "C - Service pack",
      "D - GPU",
      "1 - Holds start-up instructions even when the computer is switched off",
      "2 - Bundles many earlier fixes and updates into one download",
      "3 - Takes over the heavy work of drawing images and video from the CPU",
      "4 - Keeps a computer running for a few minutes after mains power fails"
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
    "order": 2,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 3",
    "question": "Which TWO statements about a touch screen are true?",
    "metadata": [
      "It can only register one touch at a time",
      "It works as both an input and an output device",
      "It cannot be used on mobile devices",
      "It accepts gestures such as swiping and pinching",
      "It needs a separate keyboard and mouse before it works"
    ],
    "answer": [
      "It works as both an input and an output device",
      "It accepts gestures such as swiping and pinching",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "systems_technologies",
    "topic": "input_and_output_devices",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
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
    "question": "A statement says: \"A snipping tool is used to defragment a hard drive.\" If the statement is false, which replacement for \"defragment a hard drive\" makes it true?",
    "metadata": [
      "True as written",
      "capture a portion of the screen as an image",
      "compress files into a smaller folder",
      "remove a virus from the computer",
      ""
    ],
    "answer": [
      "capture a portion of the screen as an image",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "systems_technologies",
    "topic": "operating_system_utilities",
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
    "question": "Text on a projected slide looks washed out: the dark grey text and light grey background hardly differ. Which projector setting should be increased to separate dark from light areas?",
    "metadata": [
      "Resolution",
      "Aspect ratio",
      "Refresh rate",
      "Contrast ratio",
      ""
    ],
    "answer": [
      "Contrast ratio",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "systems_technologies",
    "topic": "output_devices",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application",
    "clues": "- The problem is the difference between dark and light areas.\n- Resolution changes sharpness, not tone."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1",
      "marks": 1,
      "clues": "- The question is about file extensions.\n- Look for the format used to compress files.",
      "approach": "- Match each extension to its file type: audio, text, image, compressed.\n- Pick the compressed one.",
      "solution": "1. .zip is a compressed (archive) file, so the answer is D."
    },
    {
      "number": "1.4",
      "marks": 1,
      "clues": "- The question asks for the FALSE statement.\n- Think about what a touch screen can and cannot do.",
      "approach": "- Check each statement against what a touch screen does.\n- A touch screen supports gestures, replaces the mouse and keyboard and is standard on mobile devices.\n- Only a limited number of touches can be registered at once.",
      "solution": "1. Option C is false: a touch screen cannot register an unlimited number of simultaneous touches."
    },
    {
      "number": "1.6",
      "marks": 1,
      "clues": "- The text is too light or too dark.\n- Think about which display setting sets the difference between light and dark.",
      "approach": "- Compare the settings: brightness, contrast ratio, resolution and aspect ratio.\n- The memo accepts the contrast ratio.",
      "solution": "1. Adjusting the contrast ratio improves how the text stands out, so the answer is B."
    },
    {
      "number": "1.7",
      "marks": 1,
      "clues": "- The device is dedicated to graphics.\n- It executes the instructions for animations and videos.",
      "approach": "- Think about which processor handles graphics.\n- A CPU is general purpose; a GPU is dedicated to graphics.",
      "solution": "1. The GPU (graphics processing unit) is the answer, option B."
    },
    {
      "number": "2.1",
      "marks": 1,
      "clues": "- The device supplies power for a short time.\n- It prevents data loss.",
      "approach": "- Think about a device that keeps the computer running during a power failure.",
      "solution": "1. A UPS (uninterruptible power supply) gives battery backup for a short time, so the answer is R."
    },
    {
      "number": "2.6",
      "marks": 1,
      "clues": "- The memory stores data and instructions permanently.\n- It keeps its contents when the power is off.",
      "approach": "- Compare ROM and RAM: one is volatile, one is not.",
      "solution": "1. ROM (read-only memory) stores data and instructions permanently, so the answer is D."
    },
    {
      "number": "2.7",
      "marks": 1,
      "clues": "- Several software updates are installed at once.\n- The term describes a bundle of updates.",
      "approach": "- Compare a patch with a service pack.\n- A patch fixes one problem; a bundle contains many.",
      "solution": "1. A service pack bundles multiple updates, so the answer is P."
    },
    {
      "number": "3.1",
      "marks": 1,
      "clues": "- The statement is about a utility that captures part of the screen.\n- Decide whether it is correct as written.",
      "approach": "- Recall what a snipping tool does.",
      "solution": "1. True: a snipping tool captures a portion of the screen."
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
