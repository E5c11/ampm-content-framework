#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 10.6–10.7: Drones and distribution lists (order 24)
 * Question 10.6 and 10.7 — limitations of drone technology and advantages of an e-mail distribution list.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l24.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l24.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l24.js
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
  "name": "Question 10.6–10.7: Drones and distribution lists",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 24,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "drone_technology",
    "distribution_lists"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q24/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q24/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q24/memo_2.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which TWO are limitations of using drones to capture video?",
    "metadata": [
      "Drones cannot fly outdoors",
      "Battery life is limited",
      "Camera quality may be poor",
      "Drones cannot record any video",
      "Drones need a cable to the ground"
    ],
    "answer": [
      "Battery life is limited",
      "Camera quality may be poor",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "internet_technologies",
    "topic": "emerging_technologies",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
    ],
    "difficulty": 3,
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
    "question": "What is an e-mail distribution list?",
    "metadata": [
      "A list of e-mails waiting to be deleted",
      "A group of e-mail addresses saved under one name",
      "A folder in which all spam messages are stored by the server",
      "A schedule showing when e-mails will be sent",
      ""
    ],
    "answer": [
      "A group of e-mail addresses saved under one name",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "internet_technologies",
    "topic": "email_features",
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
    "question": "Which TWO are advantages of sending a message to a distribution list?",
    "metadata": [
      "The message is hidden from every recipient",
      "Time is saved because only the group name is typed",
      "Attachments automatically become smaller",
      "There is less chance of leaving out an address",
      "The e-mail never reaches a spam folder"
    ],
    "answer": [
      "Time is saved because only the group name is typed",
      "There is less chance of leaving out an address",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "internet_technologies",
    "topic": "email_features",
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
    "question": "Match each term to the description that fits it.",
    "metadata": [
      "A - Drone",
      "B - Distribution list",
      "C - Augmented reality",
      "D - Autonomous vehicle",
      "1 - A group of addresses used to send one e-mail to many people",
      "2 - Digital information shown over a view of the real world",
      "3 - A self-driving vehicle that senses its surroundings",
      "4 - A remote-controlled flying device that can carry a camera"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "internet_technologies",
    "topic": "emerging_technologies",
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
      "number": "10.6",
      "marks": 2,
      "clues": "- Drones capture video outdoors.\n- Think about power, picture quality and storage.",
      "approach": "- State two limitations.",
      "solution": "1. Any two: limited battery life, potentially poor camera quality, potentially low storage capacity, or the risk of flying drones over people."
    },
    {
      "number": "10.7",
      "marks": 2,
      "clues": "- The link is e-mailed to many parents.\n- Think about time and accuracy.",
      "approach": "- State two advantages of a distribution list.",
      "solution": "1. Any two: saves time by typing only the group name, more accuracy because addresses cannot be left out, or the message is sent to many recipients at once."
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
