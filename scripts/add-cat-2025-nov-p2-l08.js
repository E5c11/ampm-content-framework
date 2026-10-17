#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 5.1–5.4: Podcasts, ISP services, the AUP and cloud computing (order 8)
 * Question 5.1, 5.2, 5.3 and 5.4 — podcasts, services of an ISP, the effect of an acceptable use policy and cloud computing.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l08.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l08.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l08.js
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
  "name": "Question 5.1–5.4: Podcasts, ISP services, the AUP and cloud computing",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "podcasts",
    "isp_services",
    "acceptable_use_policy",
    "cloud_computing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q8/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q8/memo_1.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each term to the description that fits it.",
    "metadata": [
      "A - Podcast",
      "B - AUP",
      "C - ISP",
      "D - Cloud computing",
      "1 - Rules that limit what users may do on a network",
      "2 - A company that provides internet access to customers",
      "3 - Storing and using files and software on remote servers over the internet",
      "4 - A series of recorded audio or video files to download or stream"
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
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "Which TWO services, apart from internet access, can an ISP offer?",
    "metadata": [
      "Printing the customer's documents on request",
      "Repairing the customer's laptop screen",
      "Hosting a website for a customer",
      "Providing personalised e-mail addresses",
      "Installing an operating system on the customer's laptop"
    ],
    "answer": [
      "Hosting a website for a customer",
      "Providing personalised e-mail addresses",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "internet_technologies",
    "topic": "internet_service_providers",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
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
    "question": "A school has an acceptable use policy (AUP). What effect does it have on a learner who streams video at school?",
    "metadata": [
      "It gives every learner unlimited free streaming at any time of day",
      "It limits excessive streaming to protect network performance",
      "It allows any content to be streamed on any device",
      "It encrypts every video the learner watches",
      ""
    ],
    "answer": [
      "It limits excessive streaming to protect network performance",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "network_technologies",
    "topic": "network_policies",
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
    "question": "Which TWO statements about cloud computing are correct, one benefit and one limitation?",
    "metadata": [
      "Files can never be lost or damaged",
      "Files can be reached on any device online",
      "Uploading files uses up mobile data",
      "A fast connection is never needed",
      "The user controls where the servers are"
    ],
    "answer": [
      "Files can be reached on any device online",
      "Uploading files uses up mobile data",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "network_technologies",
    "topic": "cloud_computing",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
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
      "number": "5.1",
      "marks": 2,
      "clues": "- A podcast is made of recorded files.\n- Users can download or stream it.",
      "approach": "- Define it in two parts: what it is made of and how it is used.",
      "solution": "1. A series of pre-recorded audio or video files.\n2. That a user can download or stream to a computer or mobile device."
    },
    {
      "number": "5.2",
      "marks": 2,
      "clues": "- The services are apart from internet access.\n- Think about what ISPs bundle.",
      "approach": "- Consider e-mail, hosting, security software and customer support.",
      "solution": "1. Personalised e-mail addresses.\n2. Web hosting, bundled security software or customer support."
    },
    {
      "number": "5.3",
      "marks": 1,
      "clues": "- The AUP sets rules for users.\n- Streaming uses a lot of bandwidth.",
      "approach": "- Think about what a policy prohibits or limits.",
      "solution": "1. Any one: it prohibits inappropriate content, limits excessive streaming to preserve network performance, or prevents sharing of streaming accounts."
    },
    {
      "number": "5.4",
      "marks": 2,
      "clues": "- One benefit and one limitation are asked for.\n- Think about access, storage, connection and cost.",
      "approach": "- State a benefit, then a limitation.",
      "solution": "1. Benefit (any one): access from anywhere, saves local storage, collaboration, latest versions or backup.\n2. Limitation (any one): slow connection, less control over security and backup, uses data or limited free versions."
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
