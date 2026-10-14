#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 5: Essay structure (order 28)
 * Lesson 28 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 5: Essay structure. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l28.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l28.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l28.js
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
  "paper": "nov_p2",
  "order": 28,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "essay_structure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q28/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q28/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q28/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q28/memo_2.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which opening sentence would earn the introduction mark for an essay on the monopoly market structure?",
    "metadata": [
      "Discuss the characteristics of a monopoly in detail",
      "I will discuss the number of firms, entry and price",
      "Market structure describes how buyers and sellers interact",
      "A monopoly is one very big and powerful firm in a market",
      ""
    ],
    "answer": [
      "Market structure describes how buyers and sellers interact",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "monopoly",
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
    "paper": "nov_p2",
    "clues": "- Define the main concept without repeating the question or announcing the body."
  },
  {
    "name": "Question 2",
    "question": "Arrange the parts of this essay in the order in which they should be written.",
    "metadata": [
      "A judgement on the effects of monopolies on living standards",
      "Explained features of a monopoly, with the long-run profit graph",
      "A definition of market structure",
      "Explained measures that prevent abuse of market power"
    ],
    "answer": [
      "A definition of market structure",
      "Explained features of a monopoly, with the long-run profit graph",
      "Explained measures that prevent abuse of market power",
      "A judgement on the effects of monopolies on living standards"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "imperfect_markets",
    "topic": "monopoly",
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
    "paper": "nov_p2",
    "clues": "- Follow the printed rubric: introduction, body, conclusion."
  },
  {
    "name": "Question 3",
    "question": "In the additional part of an essay, at most how many marks can mere listing of facts earn?",
    "metadata": [
      "0",
      "2",
      "4",
      "10",
      ""
    ],
    "answer": [
      "2",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The rubric caps marks for facts that are only listed."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 4,
      "clues": "- Follow the printed rubric: introduction and conclusion are worth 2 marks each.",
      "approach": "- Start with a definition and do not repeat the question.\n- End with a higher-order conclusion.",
      "solution": "1. Introduction (max 2): for example, market structure describes how buyers and sellers are organised and interact.\n2. Conclusion (max 2): a higher-order point such as monopolies lowering growth and raising inflation and so reducing standards of living."
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
