#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 9.6–9.7: Social networks, cybersecurity and plagiarism (order 20)
 * Question 9.6.1, 9.6.2 and 9.7 — advantages of online social networks, why cybersecurity matters and the meaning of plagiarism.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l20.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l20.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l20.js
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
  "name": "Question 9.6–9.7: Social networks, cybersecurity and plagiarism",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 20,
  "content_tier": "free",
  "has_video": false,
  "xp": 5,
  "tags": [
    "online_social_networks",
    "cybersecurity",
    "plagiarism"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q20/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q20/memo_1.png"
  ],
  "exam_question_marks": 5,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which TWO are advantages of learners using online social networks to research and solve problems?",
    "metadata": [
      "Everything posted is guaranteed to be accurate",
      "No account or sign-up is needed to take part",
      "They can reach people with a wide range of expertise",
      "They can get quick feedback on a question",
      "Learners can never be distracted by them"
    ],
    "answer": [
      "They can reach people with a wide range of expertise",
      "They can get quick feedback on a question",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "social_implications",
    "topic": "social_networking",
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
    "question": "Why is cybersecurity important while learners use online social networks?",
    "metadata": [
      "It makes the posts load faster on every device",
      "It increases the number of followers each learner has",
      "It protects devices and data from malware and hacking",
      "It removes the need to use passwords on any account",
      ""
    ],
    "answer": [
      "It protects devices and data from malware and hacking",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "social_implications",
    "topic": "online_safety",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 1,
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
    "question": "Which situation is plagiarism?",
    "metadata": [
      "Quoting a sentence and listing the source in the bibliography",
      "Copying a paragraph from a website into an assignment without crediting the source",
      "Summarising a chapter in your own words and referencing it",
      "Using a picture under a Creative Commons licence and crediting its original creator",
      ""
    ],
    "answer": [
      "Copying a paragraph from a website into an assignment without crediting the source",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "social_implications",
    "topic": "legal_and_ethical_issues",
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
    "type": "application",
    "clues": "- Plagiarism is about presenting someone else's work as your own.\n- Giving credit is the opposite."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "9.6.1",
      "marks": 2,
      "clues": "- Online social networks connect many people.\n- Think about expertise, feedback and teamwork.",
      "approach": "- State two advantages for learners.",
      "solution": "1. Any two: a wide range of expertise, immediate feedback, or enhanced collaborative problem solving."
    },
    {
      "number": "9.6.2",
      "marks": 1,
      "clues": "- Learners share information on the networks.\n- Think about what could happen to devices and data.",
      "approach": "- Give one reason cybersecurity matters.",
      "solution": "1. Any one: protects devices from malware and hacking, safeguards sensitive data, or prevents unauthorised access."
    },
    {
      "number": "9.7",
      "marks": 2,
      "clues": "- Plagiarism leads to disqualification.\n- It concerns someone else's work.",
      "approach": "- Explain what is used and what is missing.",
      "solution": "1. Using someone else's work or ideas.\n2. Presenting them as your own without giving proper credit."
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
