#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 1–3: Internet and Network Technologies (Section A) (order 2)
 * Section A items on internet and network technologies — Questions 1.2, 1.3, 1.9, 2.3, 2.4, 2.5 and 2.8.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l02.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l02.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l02.js
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
  "name": "Question 1–3: Internet and Network Technologies (Section A)",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "netiquette",
    "personal_area_network",
    "iot_and_nfc",
    "mobile_data_cap",
    "crowdfunding"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q2/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q2/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q2/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q2/memo_2.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which action is an example of poor netiquette in a work e-mail?",
    "metadata": [
      "Checking the spelling before sending",
      "Using a clear subject line",
      "Typing the whole message in capital letters",
      "Replying politely to a complaint",
      ""
    ],
    "answer": [
      "Typing the whole message in capital letters",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "internet_technologies",
    "topic": "email_and_netiquette",
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
    "clues": "- Netiquette means polite behaviour online.\n- Capital letters are read as shouting."
  },
  {
    "name": "Question 2",
    "question": "Match each term to the description that fits it.",
    "metadata": [
      "A - PAN",
      "B - IoT",
      "C - NFC",
      "D - Crowdfunding",
      "1 - Everyday devices connected so they can share data",
      "2 - Very short-range contactless technology for tap-to-pay",
      "3 - Many people each give a small amount to an online project",
      "4 - Devices around one person linked over a few metres, such as a phone and earphones using Bluetooth"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "internet_technologies",
    "topic": "internet_services_and_trends",
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
    "question": "Why do many mobile users switch their camera off during a video call?",
    "metadata": [
      "Video calls can only send still pictures to the other person",
      "Video calls work without any internet connection or signal",
      "Video calls delete the phone's stored photos after each call",
      "Video uses a lot of data, so the data bundle runs out faster",
      ""
    ],
    "answer": [
      "Video uses a lot of data, so the data bundle runs out faster",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "internet_technologies",
    "topic": "communication_technologies",
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
    "type": "application",
    "clues": "- Think about what is used up while video streams.\n- Mobile data is often limited."
  },
  {
    "name": "Question 4",
    "question": "Which TWO statements about NFC are correct?",
    "metadata": [
      "It sends data over several kilometres",
      "It needs a network cable between the devices",
      "The two devices must be very close together",
      "It is used for tap-to-pay at a point of sale",
      "It only works on desktop computers"
    ],
    "answer": [
      "The two devices must be very close together",
      "It is used for tap-to-pay at a point of sale",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "internet_technologies",
    "topic": "internet_services_and_trends",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
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
      "number": "1.2",
      "marks": 1,
      "clues": "- The question asks which item is NOT netiquette.\n- Netiquette is polite online behaviour.",
      "approach": "- Check each action: proofreading, a missing subject line, small attachments, concise content.\n- Three are good practice.",
      "solution": "1. Not adding a subject line is bad netiquette, so the answer is B."
    },
    {
      "number": "1.3",
      "marks": 1,
      "clues": "- A PAN covers a very small area around one person.\n- Look for a short-range wireless medium.",
      "approach": "- Compare Bluetooth with WiMax, fibre optics and microwaves.\n- Only Bluetooth is a short-range personal medium.",
      "solution": "1. Bluetooth is used in a PAN, option A."
    },
    {
      "number": "1.9",
      "marks": 1,
      "clues": "- The reason concerns mobile users and video calls.\n- Think about what video calls consume.",
      "approach": "- Eliminate the options that are untrue about cameras, storage and privacy.\n- Video uses a lot of data.",
      "solution": "1. The cap (data allowance) is reached quickly, so the answer is C."
    },
    {
      "number": "2.3",
      "marks": 1,
      "clues": "- Household devices connected to one another.\n- The term describes a trend.",
      "approach": "- Think of smart homes.",
      "solution": "1. IoT (Internet of Things) is the answer, T."
    },
    {
      "number": "2.4",
      "marks": 1,
      "clues": "- The software is used to view web pages.\n- Think about what you use to explore the web.",
      "approach": "- Match the description to a software type.",
      "solution": "1. A browser is the answer, K."
    },
    {
      "number": "2.5",
      "marks": 1,
      "clues": "- A wireless payment technology.\n- The devices must be close to the point of sale.",
      "approach": "- Compare NFC and RFID.\n- NFC is used for tap-to-pay.",
      "solution": "1. NFC is the answer, Q."
    },
    {
      "number": "2.8",
      "marks": 1,
      "clues": "- Many people contribute financially.\n- It happens on online platforms.",
      "approach": "- Think about funding a project from a large group.",
      "solution": "1. Crowd funding is the answer, B."
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
