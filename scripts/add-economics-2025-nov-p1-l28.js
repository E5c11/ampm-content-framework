#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 6: Essay structure (order 28)
 * Lesson 28 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 6: Essay structure. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l28.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l28.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l28.js
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
  "name": "Question 6: Essay structure",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 28,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "essay_structure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q28/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q28/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q28/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q28/memo_2.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which opening sentence would earn the introduction mark for an essay on regional development?",
    "metadata": [
      "Discuss in detail South African initiatives in regional development",
      "I will discuss SDIs, IDZs, SEZs and corridors in my essay",
      "South Africa is a beautiful country with many regions",
      "Regional development is the use of policies to improve the economic livelihood of less developed areas of a country",
      ""
    ],
    "answer": [
      "Regional development is the use of policies to improve the economic livelihood of less developed areas of a country",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "regional_development",
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
    "clues": "- A good introduction defines the main concept of the topic.\n- It should not repeat the question or announce what comes next."
  },
  {
    "name": "Question 2",
    "question": "Arrange the parts of this essay in the order in which they should be written.",
    "metadata": [
      "Conclusion with a judgement and a recommendation",
      "Main part: SDIs, IDZs, SEZs and corridors, each under its own heading",
      "Introduction that defines regional development",
      "Additional part: how incentives promote industrial development"
    ],
    "answer": [
      "Introduction that defines regional development",
      "Main part: SDIs, IDZs, SEZs and corridors, each under its own heading",
      "Additional part: how incentives promote industrial development",
      "Conclusion with a judgement and a recommendation"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "growth_and_development",
    "topic": "regional_development",
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
    "clues": "- Follow the printed rubric: introduction, body (main part then additional part), conclusion."
  },
  {
    "name": "Question 3",
    "question": "Which conclusion is higher-order?",
    "metadata": [
      "In conclusion, I discussed SDIs, IDZs, SEZs and corridors",
      "Regional zones can ease unemployment where it is highest, yet their success depends on skills and infrastructure, so incentives should be linked to training",
      "Regional development is a very interesting topic",
      "That is all I know about the topic",
      ""
    ],
    "answer": [
      "Regional zones can ease unemployment where it is highest, yet their success depends on skills and infrastructure, so incentives should be linked to training",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "regional_development",
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
    "clues": "- A higher-order conclusion adds a judgement or recommendation.\n- A bare recap of what was already said does not."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 4,
      "clues": "- Follow the printed rubric: introduction, main part, additional part, conclusion.\n- The introduction and conclusion are worth 2 marks each.",
      "approach": "- Start with a definition and do not repeat the question.\n- Order the essay: introduction, main part, additional part, conclusion.\n- End with a higher-order conclusion.",
      "solution": "1. Introduction (max 2): define regional development; do not copy the question or preview the body.\n2. Body: main part (max 26) then additional part (max 10).\n3. Conclusion (max 2): a judgement or recommendation that adds something new rather than repeating facts."
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
