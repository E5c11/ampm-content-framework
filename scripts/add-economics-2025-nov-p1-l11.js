#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 3.1: Organisations and export promotion (order 11)
 * Lesson 11 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 3.1: Organisations and export promotion. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l11.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l11.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l11.js
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
  "name": "Question 3.1: Organisations and export promotion",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "international_organisations",
    "trade_policy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q11/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q11/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the international organisations that expect their member countries to standardise their economic and social indicators.",
    "metadata": [
      "World Bank",
      "South African Revenue Service (SARS)",
      "United Nations (UN)",
      "Johannesburg Securities Exchange (JSE)",
      "International Monetary Fund (IMF)"
    ],
    "answer": [
      "International Monetary Fund (IMF)",
      "World Bank",
      "United Nations (UN)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "economic_and_social_indicators",
    "topic": "international_comparisons",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Standard indicators let international bodies compare many countries on the same basis.\n- Two options are national institutions, not international organisations."
  },
  {
    "name": "Question 2",
    "question": "Which of the following is a way of promoting exports?",
    "metadata": [
      "Placing a high tariff on imported steel",
      "Setting a quota on imported cars",
      "Giving exporters subsidies and other incentives",
      "Banning the import of foreign clothing",
      ""
    ],
    "answer": [
      "Giving exporters subsidies and other incentives",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "protection_and_free_trade",
    "topic": "export_promotion",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Export promotion encourages local firms to sell abroad.\n- Three options restrict imports instead, which is a different strategy."
  },
  {
    "name": "Question 3",
    "question": "A government places high tariffs on imported shoes so that local factories can supply the market instead. Which trade strategy is this?",
    "metadata": [
      "Export promotion",
      "Trade liberalisation",
      "Import substitution",
      "Dumping",
      ""
    ],
    "answer": [
      "Import substitution",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "protection_and_free_trade",
    "topic": "tariffs_and_trade_barriers",
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
    "paper": "nov_p1",
    "clues": "- The goal is to replace imported goods with locally produced ones."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1.1",
      "marks": 2,
      "clues": "- Think of global bodies that collect comparable statistics from member countries.",
      "approach": "- Recall international organisations linked to the economy and development.\n- Name any two.",
      "solution": "1. Examples include the International Monetary Fund (IMF), the World Bank and the United Nations (UN).\n2. Any two correct organisations earn the two marks."
    },
    {
      "number": "3.1.2",
      "marks": 2,
      "clues": "- Consider what government does to help firms sell abroad, and what that does to national output.",
      "approach": "- Link support for exporters to production for foreign markets.\n- Finish with the effect on GDP and growth.",
      "solution": "1. Export subsidies and incentives encourage the production of goods and services for export.\n2. This increases gross domestic product and stimulates economic growth."
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
