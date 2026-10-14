#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 5: Essay structure (order 25)
 * Lesson 25 of the 2025 Nov P1 repair (DESIGN-UNI-14: 4 practice questions). Question 5: Essay structure. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l25.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l25.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l25.js
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
  "name": "Question 5: Essay structure",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 25,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "essay_structure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q25/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q25/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q25/memo_2.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which opening sentence would earn the introduction mark for an essay on the markets of the circular flow?",
    "metadata": [
      "In this essay I will discuss the goods, factor, financial and foreign exchange markets",
      "Discuss in detail the markets within the four-sector circular-flow model",
      "A market is a mechanism that brings buyers and sellers together to exchange products",
      "Markets are very important and everybody uses them every day",
      ""
    ],
    "answer": [
      "A market is a mechanism that brings buyers and sellers together to exchange products",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The paper says a good starting point is to define the main concept.\n- The introduction must not repeat the question or preview the body."
  },
  {
    "name": "Question 2",
    "question": "Arrange the parts of this essay in the order in which they should be written.",
    "metadata": [
      "Additional part: evaluating the business sector’s contribution",
      "Conclusion with a summary and value judgement",
      "Introduction that defines the main concept",
      "Main part: the four markets, each under its own heading"
    ],
    "answer": [
      "Introduction that defines the main concept",
      "Main part: the four markets, each under its own heading",
      "Additional part: evaluating the business sector’s contribution",
      "Conclusion with a summary and value judgement"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Follow the structure printed in the rubric: introduction, body, conclusion.\n- The body has a main part and an additional part."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the features of a higher-order conclusion.",
    "metadata": [
      "A brief summary that does not repeat facts already given",
      "An opinion or value judgement on what was discussed",
      "A recommendation",
      "The introduction copied word for word",
      "Every fact from the body listed again"
    ],
    "answer": [
      "A brief summary that does not repeat facts already given",
      "An opinion or value judgement on what was discussed",
      "A recommendation",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A conclusion should add judgement, not repeat the essay."
  },
  {
    "name": "Question 4",
    "question": "In the 26-mark main part of the essay, what is the maximum number of marks that may be given for headings and examples?",
    "metadata": [
      "2",
      "8",
      "10",
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
    "type": "definition",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Headings help structure an answer but the marks are for explained facts."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 4,
      "clues": "- Follow the printed rubric: introduction, main part, additional part, conclusion.\n- The introduction and conclusion are worth 2 marks each.",
      "approach": "- Start with a definition of the main concept and do not repeat the question.\n- Do not preview the body in the introduction.\n- End with a higher-order conclusion.",
      "solution": "1. Introduction (max 2): define the main concept; do not copy the question or announce the body.\n2. Main part (max 26) then additional part (max 10), with at most 8 marks for headings and examples and 2 for mere listing.\n3. Conclusion (max 2): a brief summary that does not repeat facts, a judgement or recommendation, and where relevant a contradictory view with motivation."
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
