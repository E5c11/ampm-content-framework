#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 3.1: SADC and BBBEE (order 11)
 * Lesson 11 of 2024 Nov P1 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l11.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l11.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l11.js
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
  "name": "Question 3.1: SADC and BBBEE",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "sadc",
    "bbbee_act",
    "industrial_development"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q11/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q11/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the countries that are members of the Southern African Development Community (SADC).",
    "metadata": [
      "Kenya",
      "Malawi",
      "Botswana",
      "Mozambique",
      "Ghana"
    ],
    "answer": [
      "Malawi",
      "Botswana",
      "Mozambique",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "protection_and_free_trade",
    "topic": "trade_agreements",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- SADC groups countries of southern Africa.\n- Think about which countries lie in the south of the continent."
  },
  {
    "name": "Question 2",
    "question": "How can Broad-Based Black Economic Empowerment (BBBEE) help to promote industrial development?",
    "metadata": [
      "By limiting the number of new businesses in each industry",
      "By cutting all training so that costs stay low",
      "By helping black-owned firms to start up and expand",
      "By removing the need for skills in industry",
      ""
    ],
    "answer": [
      "By helping black-owned firms to start up and expand",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "redress_and_skills_policies",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Think about who gets to own and run businesses, and what support they receive."
  },
  {
    "name": "Question 3",
    "question": "Match each BBBEE element to its meaning.",
    "metadata": [
      "A - Preferential procurement",
      "B - Skills development",
      "C - Ownership",
      "1 - Training that prepares black people to run businesses",
      "2 - A share of the equity of businesses held by black people",
      "3 - Buying goods and services from black-owned suppliers"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "redress_and_skills_policies",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Procurement is about buying, skills development is about learning, and ownership is about holding a share."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1.1",
      "marks": 2,
      "clues": "- SADC is a group of states in southern Africa.",
      "approach": "- Name any two members.",
      "solution": "Any two SADC members, for example Angola, Botswana, Lesotho, Malawi, Mozambique, Namibia, South Africa, Zambia or Zimbabwe."
    },
    {
      "number": "3.1.2",
      "marks": 2,
      "clues": "- Think about ownership, skills and preferential buying.",
      "approach": "- Give one developed point.",
      "solution": "1. More black-owned businesses may lead to the expansion of existing industries.\n2. Skills development and preferential procurement encourage new black-owned businesses. Any other correct relevant response is accepted."
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
