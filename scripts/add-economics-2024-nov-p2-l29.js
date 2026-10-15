#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 5: Essay structure (order 29)
 * Lesson 29 of 2024 Nov P2 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l29.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l29.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l29.js
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

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 5: Essay structure",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 29,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "essay_structure",
    "oligopoly"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q29/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q29/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q29/memo_2.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which opening sentence would earn the introduction mark for an essay on the oligopoly market structure?",
    "metadata": [
      "Oligopolies are very important to the whole economy",
      "In this essay I will discuss the features of an oligopoly",
      "Examine in detail the oligopoly market structure",
      "Market structure describes how buyers and sellers interact in a market",
      ""
    ],
    "answer": [
      "Market structure describes how buyers and sellers interact in a market",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A good start defines the main concept.\n- Do not repeat the question and do not preview the body."
  },
  {
    "name": "Question 2",
    "question": "Arrange the parts of this essay in the order in which they should be written.",
    "metadata": [
      "A summary that adds a value judgement",
      "Explained characteristics of the market structure",
      "A definition of the main concept of the topic",
      "An analysis of how the competition policy helped"
    ],
    "answer": [
      "A definition of the main concept of the topic",
      "Explained characteristics of the market structure",
      "An analysis of how the competition policy helped",
      "A summary that adds a value judgement"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The essay opens with an idea about the topic, develops it, then closes."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the ingredients that can earn marks in a higher-order conclusion.",
    "metadata": [
      "A word-for-word repeat of the introduction",
      "A brief summary without repeated facts",
      "An opinion on the facts discussed",
      "A recommendation",
      "New facts about an unrelated topic"
    ],
    "answer": [
      "A brief summary without repeated facts",
      "An opinion on the facts discussed",
      "A recommendation",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A conclusion rounds the discussion off without copying earlier sections."
  },
  {
    "name": "Question 4",
    "question": "A learner lists the features of an oligopoly as headings only, with no explanation. What is the most that headings and examples can earn in the 26-mark main part?",
    "metadata": [
      "2",
      "8",
      "13",
      "26",
      ""
    ],
    "answer": [
      "8",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The printed rubric caps the marks for headings and examples inside the main part."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 4,
      "clues": "- Use the printed rubric: introduction max 2, main part max 26 (headings and examples max 8), additional part max 10 (listing max 2), conclusion max 2.",
      "approach": "- Define the main concept first; end with a higher-order conclusion.",
      "solution": "1. Introduction (max 2): define market structure (how buyers and sellers are organised and interact in a market); do not repeat the question.\n2. Conclusion (max 2): for example, that oligopolies can earn economic profit in the long run and use resources inefficiently. Any other higher-order conclusion is accepted."
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
