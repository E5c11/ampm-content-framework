#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 5.5–5.8: Online shopping, mobile internet, accessible websites and private browsing (order 9)
 * Question 5.5, 5.6, 5.7 and 5.8 — disadvantages of online shopping, mobile internet technologies, websites for visually impaired users and incognito browsing.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l09.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l09.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l09.js
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
  "name": "Question 5.5–5.8: Online shopping, mobile internet, accessible websites and private browsing",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "online_shopping",
    "mobile_internet_access",
    "accessible_web_design",
    "private_browsing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q9/memo_1.png"
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
      "A - Incognito browsing",
      "B - LTE",
      "C - Wi-Fi hotspot",
      "D - High contrast",
      "1 - Mobile data technology for connecting while away from the office",
      "2 - A shared wireless connection point for nearby devices",
      "3 - A strong difference between text and background colours",
      "4 - Does not save the history or cookies after the session"
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
    "question": "Which TWO are disadvantages of buying from an online store instead of a physical store?",
    "metadata": [
      "Goods can only be bought during shop opening hours",
      "The product may differ from how it was advertised",
      "Prices cannot be compared between sellers",
      "Return policies can be hard to enforce",
      "Goods must be paid for in cash"
    ],
    "answer": [
      "The product may differ from how it was advertised",
      "Return policies can be hard to enforce",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "internet_technologies",
    "topic": "online_shopping",
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
    "question": "Which TWO aspects help make a website accessible to visually impaired users?",
    "metadata": [
      "Using small light-grey text on a patterned background",
      "Placing many moving adverts on every page",
      "Using a high-contrast colour scheme",
      "Adding audio feedback for navigation",
      "Using only colour to show required fields"
    ],
    "answer": [
      "Using a high-contrast colour scheme",
      "Adding audio feedback for navigation",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "internet_technologies",
    "topic": "accessible_web_design",
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
    "question": "Which statement about incognito (private) browsing is true?",
    "metadata": [
      "The internet service provider cannot see the sites visited",
      "The browsing history is not saved on that device",
      "Websites can no longer identify the user's IP address",
      "Downloaded files are deleted automatically",
      ""
    ],
    "answer": [
      "The browsing history is not saved on that device",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "internet_technologies",
    "topic": "private_browsing",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application",
    "clues": "- Private browsing changes what is kept locally.\n- It does not hide activity from the network."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.5",
      "marks": 2,
      "clues": "- The question asks for disadvantages of buying online.\n- Think about what you cannot check before paying.",
      "approach": "- Consider fake shops, differences from the advert, damage, hidden costs and returns.",
      "solution": "1. The product might not be the same as advertised.\n2. Returns may be hard to enforce.\n3. Accepted: a fake shop, damage in transport, hidden costs such as import tax, not being able to feel the quality or fit."
    },
    {
      "number": "5.6",
      "marks": 2,
      "clues": "- The technologies must work while away from the office.\n- Think about mobile networks and hotspots.",
      "approach": "- Name two mobile internet access technologies.",
      "solution": "1. LTE (4G or 5G).\n2. A Wi-Fi hotspot.\n3. Accepted: WiMax, or Bluetooth through a dongle."
    },
    {
      "number": "5.7",
      "marks": 2,
      "clues": "- The users have difficulty seeing.\n- Think about colour, clutter and sound.",
      "approach": "- Choose two design aspects that help.",
      "solution": "1. Colour scheme or high contrast.\n2. Readability (pages that are not too busy), or audio comments and sound for navigation and feedback."
    },
    {
      "number": "5.8",
      "marks": 2,
      "clues": "- Private browsing affects what the browser stores.\n- Explain TWO reasons it benefits a user.",
      "approach": "- Think about history, cookies, shared computers and autofill.",
      "solution": "1. Browsing activity is not saved in the browser history.\n2. Cookies and site data are deleted when the session is closed.\n3. Accepted: prevents leaving personal data on shared computers, autofill details are not stored, third-party cookies are blocked."
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
