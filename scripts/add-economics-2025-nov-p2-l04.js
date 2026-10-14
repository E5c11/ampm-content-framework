#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 1.3: Key terms (order 4)
 * Lesson 4 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 1.3: Key terms. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l04.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l04.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l04.js
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
  "name": "Question 1.3: Key terms",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "market_structures",
    "oligopoly",
    "externalities"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q4/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Give the term for any obstacle, such as a patent or a licence, that stops new firms from entering a market: []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "barrier to entry|barriers to entry|entry barrier",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "imperfect_markets",
    "topic": "monopoly",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- It is the obstacle that protects firms already in the market."
  },
  {
    "name": "Question 2",
    "question": "Give the term for a good, such as tobacco, that is harmful to the people who consume it and that government taxes heavily: []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "demerit good|demerit goods",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "market_failures",
    "topic": "externalities_and_efficiency",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- It is the opposite of a good whose consumption society wants to encourage."
  },
  {
    "name": "Question 3",
    "question": "A general rise in prices caused by total spending in the economy growing faster than the supply of goods is called …",
    "metadata": [
      "cost-push inflation",
      "demand-pull inflation",
      "deflation",
      "stagnation",
      ""
    ],
    "answer": [
      "demand-pull inflation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "economics_inflation",
    "topic": "inflation_types_and_effects",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The pressure on prices comes from the demand side."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.3.1",
      "marks": 1,
      "clues": "- Give the full term, not an abbreviation or example.",
      "approach": "- Read the description for its key feature.\n- Write the term only.",
      "solution": "1. The term is Unregulated market / Perfect market / Free market (a market in which sellers and buyers decide without government interference)."
    },
    {
      "number": "1.3.2",
      "marks": 1,
      "clues": "- Give the full term, not an abbreviation or example.",
      "approach": "- Read the description for its key feature.\n- Write the term only.",
      "solution": "1. The term is Market share (the percentage of total industry sales that a business controls)."
    },
    {
      "number": "1.3.3",
      "marks": 1,
      "clues": "- Give the full term, not an abbreviation or example.",
      "approach": "- Read the description for its key feature.\n- Write the term only.",
      "solution": "1. The term is Cost-benefit analysis (a technique to evaluate the social costs and benefits of public projects)."
    },
    {
      "number": "1.3.4",
      "marks": 1,
      "clues": "- Give the full term, not an abbreviation or example.",
      "approach": "- Read the description for its key feature.\n- Write the term only.",
      "solution": "1. The term is Cost-push inflation (a general price rise caused by higher costs of the factors of production)."
    },
    {
      "number": "1.3.5",
      "marks": 1,
      "clues": "- Give the full term, not an abbreviation or example.",
      "approach": "- Read the description for its key feature.\n- Write the term only.",
      "solution": "1. The term is World heritage site (a place listed by the United Nations for cultural, historical or scientific significance)."
    },
    {
      "number": "1.3.6",
      "marks": 1,
      "clues": "- Give the full term, not an abbreviation or example.",
      "approach": "- Read the description for its key feature.\n- Write the term only.",
      "solution": "1. The term is Global warming (the gradual rise in the Earth’s temperature from increased carbon emissions)."
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
