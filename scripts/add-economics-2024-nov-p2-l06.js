#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 2.2.1–2.2.4: Monopolistic competition (order 6)
 * Lesson 6 of 2024 Nov P2 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l06.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l06.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l06.js
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
  "name": "Question 2.2.1–2.2.4: Monopolistic competition",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "monopolistic_competition",
    "market_structures"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q6/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Read this illustrative extract: \"In a town, many hair salons compete on the quality of their service, their location and their friendliness, while their prices differ only slightly.\" Which feature of the extract is an example of non-price competition?",
    "metadata": [
      "the many salons in the town",
      "the quality of their service",
      "the slight price differences",
      "the town in which they operate",
      ""
    ],
    "answer": [
      "the quality of their service",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "imperfect_markets",
    "topic": "monopolistic_competition",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Non-price competition is about winning customers on something other than a lower price."
  },
  {
    "name": "Question 2",
    "question": "What type of profit does a monopolistic competitor earn in the long run?",
    "metadata": [
      "economic loss",
      "economic profit",
      "normal profit",
      "gross profit",
      ""
    ],
    "answer": [
      "normal profit",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "imperfect_markets",
    "topic": "monopolistic_competition",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- New firms enter when profits are high, which competes the extra profit away."
  },
  {
    "name": "Question 3",
    "question": "Match each market structure to its main feature.",
    "metadata": [
      "A - Perfect competition",
      "B - Monopolistic competition",
      "C - Monopoly",
      "1 - Many sellers offering differentiated products",
      "2 - A single seller protected by barriers to entry",
      "3 - Many sellers offering identical products"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "imperfect_markets",
    "topic": "monopolistic_competition",
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
    "paper": "nov_p2",
    "clues": "- Compare the number of sellers and whether their products are alike or different."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the roles of advertising in a monopolistic competitive market.",
    "metadata": [
      "It removes all differences between products",
      "It creates awareness of the product",
      "It builds brand loyalty",
      "It makes entry into the market impossible",
      "It informs customers of distinctive features"
    ],
    "answer": [
      "It creates awareness of the product",
      "It builds brand loyalty",
      "It informs customers of distinctive features",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "monopolistic_competition",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Advertising helps a firm stand out from many similar rivals."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2.1",
      "marks": 1,
      "clues": "- Look for a way of competing that is not a lower price.",
      "approach": "- Identify one example.",
      "solution": "Product differentiation (quality of ingredients, quality of food, hospitality services) or location."
    },
    {
      "number": "2.2.2",
      "marks": 1,
      "clues": "- Think about what happens to profit when new firms enter.",
      "approach": "- Name the profit.",
      "solution": "Normal profit."
    },
    {
      "number": "2.2.3",
      "marks": 2,
      "clues": "- Think of many firms selling differentiated products.",
      "approach": "- Describe the term.",
      "solution": "Monopolistic competition exists where many businesses sell differentiated products; it combines features of perfect competition and monopoly."
    },
    {
      "number": "2.2.4",
      "marks": 2,
      "clues": "- Think of awareness, loyalty and attracting customers.",
      "approach": "- Give one developed point.",
      "solution": "1. Advertising creates product awareness and brand loyalty.\n2. It informs customers of the distinctive features of the product and attracts customers. Any other correct relevant response is accepted."
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
