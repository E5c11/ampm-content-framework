#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 1–3: Social Implications (Section A) (order 3)
 * Section A items on social implications — Questions 1.5, 2.2, 3.2 and 3.4.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l03.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l03.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l03.js
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
  "name": "Question 1–3: Social Implications (Section A)",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "firewall",
    "zombie_and_botnet",
    "fourth_industrial_revolution",
    "intellectual_property"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q3/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q3/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q3/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q3/memo_2.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What is the main job of a firewall on a school network?",
    "metadata": [
      "To remove viruses that are already on a computer",
      "To block unauthorised access to the network",
      "To make the internet connection faster",
      "To back up all files to the cloud",
      ""
    ],
    "answer": [
      "To block unauthorised access to the network",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "social_implications",
    "topic": "network_security",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition",
    "clues": "- A firewall controls what may enter or leave.\n- Removing existing malware is a different tool."
  },
  {
    "name": "Question 2",
    "question": "Match each term to the description that fits it.",
    "metadata": [
      "A - Zombie",
      "B - Botnet",
      "C - Antivirus",
      "D - Spyware",
      "1 - A group of infected computers controlled together",
      "2 - Software that finds and removes malware",
      "3 - Software that secretly records what a user does",
      "4 - An infected computer controlled remotely by a hacker"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "social_implications",
    "topic": "malware_and_threats",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
    ],
    "difficulty": 2,
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
    "question": "A statement says: \"Intellectual property laws protect only physical goods such as furniture.\" If the statement is false, which replacement for \"only physical goods such as furniture\" makes it true?",
    "metadata": [
      "True as written",
      "only websites that have a registered domain name",
      "only computer programs sold in shops and online stores",
      "creations of the mind, such as designs and inventions",
      ""
    ],
    "answer": [
      "creations of the mind, such as designs and inventions",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "social_implications",
    "topic": "legal_and_ethical_issues",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 4",
    "question": "Which TWO of the following are protected as intellectual property?",
    "metadata": [
      "The date of a public holiday",
      "A song that a learner wrote",
      "A newly invented device design",
      "A well-known historical fact",
      "Tomorrow's weather forecast"
    ],
    "answer": [
      "A song that a learner wrote",
      "A newly invented device design",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "social_implications",
    "topic": "legal_and_ethical_issues",
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
      "number": "1.5",
      "marks": 1,
      "clues": "- The question asks for the primary function.\n- Think about control of access.",
      "approach": "- Compare firewall, antivirus and anti-piracy tools.\n- A firewall does not remove malware.",
      "solution": "1. A firewall protects against unauthorised access, option A."
    },
    {
      "number": "2.2",
      "marks": 1,
      "clues": "- A compromised computer.\n- A hacker controls it remotely.",
      "approach": "- Compare zombie, botnet and similar terms.\n- The description is of a single computer.",
      "solution": "1. Zombie is the answer, N."
    },
    {
      "number": "3.2",
      "marks": 1,
      "clues": "- The description is of the ongoing transformation driven by digital, physical and biological technologies.\n- It is not the digital divide.",
      "approach": "- Digital divide is the gap in access to ICT.\n- The description fits another term.",
      "solution": "1. False: the term should be 4IR (the Fourth Industrial Revolution)."
    },
    {
      "number": "3.4",
      "marks": 1,
      "clues": "- The statement is about ownership of ideas and designs.\n- Check each word.",
      "approach": "- Recall what intellectual property is.\n- It is protected by copyright and patent law.",
      "solution": "1. True: intellectual property is ownership of an idea or design protected by copyright and patent laws."
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
