#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 7.1–7.3: Click-jacking, e-mail threats and online harassment (order 11)
 * Question 7.1, 7.2 and 7.3 — click-jacking, types of e-mail threat and protection against online harassment.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l11.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l11.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l11.js
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
  "name": "Question 7.1–7.3: Click-jacking, e-mail threats and online harassment",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "click_jacking",
    "email_threats",
    "online_harassment"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q11/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q11/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A learner clicks a \"Play\" button on a web page, but a hidden link under the button is clicked instead. What is this threat called?",
    "metadata": [
      "Spoofing",
      "Spamming",
      "Click-jacking",
      "Keylogging",
      ""
    ],
    "answer": [
      "Click-jacking",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "social_implications",
    "topic": "internet_threats",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition",
    "clues": "- The learner was tricked into clicking.\n- A hidden link is involved."
  },
  {
    "name": "Question 2",
    "question": "Match each e-mail threat to its description.",
    "metadata": [
      "A - Phishing",
      "B - Spam",
      "C - Spoofing",
      "D - Malware attachment",
      "1 - Unsolicited bulk e-mail, often used for advertising",
      "2 - An e-mail whose sender details are faked to look genuine",
      "3 - A link or attachment that installs harmful software",
      "4 - A deceptive e-mail that tricks users into giving personal details"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "social_implications",
    "topic": "email_threats",
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
    "question": "Which TWO actions help protect a learner from online harassment?",
    "metadata": [
      "Accept friend requests from everyone",
      "Use strong privacy settings on social media",
      "Avoid engaging with online bullies",
      "Reply to every abusive message",
      "Share your home address to look trustworthy"
    ],
    "answer": [
      "Use strong privacy settings on social media",
      "Avoid engaging with online bullies",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "social_implications",
    "topic": "online_safety",
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
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "7.1",
      "marks": 2,
      "clues": "- Click-jacking involves a hidden link.\n- The user is tricked.",
      "approach": "- Define it in two parts: what the user is made to do and how it is hidden.",
      "solution": "1. Users are tricked into clicking on an item on a web page.\n2. The item acts as a concealed link."
    },
    {
      "number": "7.2",
      "marks": 2,
      "clues": "- Name one threat and describe it.\n- One mark is for the type and one for the description.",
      "approach": "- Choose phishing, spam, malware or spoofing and say what it does.",
      "solution": "1. Name the threat, for example phishing.\n2. Describe it: deceptive e-mails that try to trick users into revealing personal information."
    },
    {
      "number": "7.3",
      "marks": 2,
      "clues": "- Think about settings and behaviour.\n- Two ways are asked for.",
      "approach": "- Choose two protective actions.",
      "solution": "1. Use strong privacy settings on social media and other platforms.\n2. Avoid sharing personal information or engaging with online bullies, and do not make controversial posts."
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
