#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 5: Supply reasons for international trade (order 26)
 * Lesson 26 of 2024 Nov P1 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l26.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l26.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l26.js
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
  "name": "Question 5: Supply reasons for international trade",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 26,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "reasons_for_trade",
    "international_trade",
    "specialisation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q26/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q26/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q26/memo_2.png"
  ],
  "exam_question_marks": 13,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A country with a warm, wet climate grows cocoa at a low cost per unit that colder countries cannot match. Which supply reason for trade does this show?",
    "metadata": [
      "Size of the population",
      "Climate conditions",
      "Income levels",
      "Preferences and tastes",
      ""
    ],
    "answer": [
      "Climate conditions",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "foreign_exchange_and_bop",
    "topic": "reasons_for_international_trade",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Look for the natural condition that decides what the country can grow."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the supply reasons for international trade.",
    "metadata": [
      "Size of the population",
      "Natural resources",
      "Technological resources",
      "Labour resources",
      "Changes in wealth"
    ],
    "answer": [
      "Natural resources",
      "Technological resources",
      "Labour resources",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "foreign_exchange_and_bop",
    "topic": "reasons_for_international_trade",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Supply reasons describe the resources a country has available to produce goods."
  },
  {
    "name": "Question 3",
    "question": "Match each supply reason to how it creates a basis for trade.",
    "metadata": [
      "A - Natural resources",
      "B - Labour resources",
      "C - Capital",
      "1 - Skill, quantity and cost of workers differ between countries",
      "2 - Some countries cannot produce all that they need",
      "3 - Resources are not spread evenly across the world"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "foreign_exchange_and_bop",
    "topic": "reasons_for_international_trade",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Think of what differs between countries in each case."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 13,
      "clues": "- Group the supply reasons under headings: natural resources, climate conditions, labour resources, technological resources, specialisation and capital.",
      "approach": "- Explain each in full sentences; at most 8 of the 26 marks may be given for headings and examples.",
      "solution": "1. Natural resources are unevenly spread, which creates opportunities for specialisation and export earnings.\n2. Climate conditions let countries grow specific crops at a lower cost.\n3. Labour differs in quality, quantity and cost between countries; technology lets some countries produce at a lower unit cost.\n4. Specialisation lowers cost through economies of scale; capital gives developed countries an advantage, and countries without it cannot produce all they need."
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
