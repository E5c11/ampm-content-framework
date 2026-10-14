#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 6: Regional development (order 26)
 * Lesson 26 of the 2025 Nov P1 repair (DESIGN-UNI-14: 4 practice questions). Question 6: Regional development. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l26.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l26.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l26.js
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
  "name": "Question 6: Regional development",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 26,
  "content_tier": "free",
  "has_video": false,
  "xp": 26,
  "tags": [
    "regional_development",
    "special_economic_zones"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q26/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q26/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q26/memo_2.png"
  ],
  "exam_question_marks": 26,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each regional development initiative to the description that fits it.",
    "metadata": [
      "A - Spatial Development Initiative (SDI)",
      "B - Industrial Development Zone (IDZ)",
      "C - Special Economic Zone (SEZ)",
      "D - Development corridor",
      "1 - Links economic hubs and promotes development in areas with high poverty and unemployment",
      "2 - A purpose-built, enclosed industrial estate linked to an international port",
      "3 - A demarcated area with identified activities and tax relief, serving domestic and export markets",
      "4 - A strip of land with infrastructure that gives businesses access between areas"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "regional_development",
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
    "clues": "- Two of these initiatives are zones, and the key difference is the link to a port.\n- The corridor is defined by the passage it provides."
  },
  {
    "name": "Question 2",
    "question": "Which regional development initiative allows businesses to import production-related raw materials duty-free and is linked to an international air or sea port?",
    "metadata": [
      "Spatial Development Initiative",
      "Industrial Development Zone",
      "Special Economic Zone",
      "Development corridor",
      ""
    ],
    "answer": [
      "Industrial Development Zone",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "regional_development",
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
    "clues": "- One of the zone types is not necessarily linked to a port, so it does not fit."
  },
  {
    "name": "Question 3",
    "question": "Which statement describes how Spatial Development Initiatives typically use public-private partnerships?",
    "metadata": [
      "Government builds the factories and private firms build the roads and pipelines",
      "Private firms supply all infrastructure while government supplies the labour",
      "Private firms fund factories and labour; government funds roads and water",
      "Foreign governments provide the money for both factories and roads",
      ""
    ],
    "answer": [
      "Private firms fund factories and labour; government funds roads and water",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "regional_development",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about which partner can supply public infrastructure and which supplies business capital."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the benefits that businesses located in an Industrial Development Zone (IDZ) enjoy.",
    "metadata": [
      "Duty-free importation of production-related inputs",
      "Guaranteed sales of their output to government departments",
      "Exemption from all labour laws and wage regulations",
      "Dedicated customs services for faster clearing",
      "World-class infrastructure and zero-rated VAT on local supplies"
    ],
    "answer": [
      "Duty-free importation of production-related inputs",
      "Dedicated customs services for faster clearing",
      "World-class infrastructure and zero-rated VAT on local supplies",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "regional_development",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The benefits help export-driven producers cut costs and move goods quickly.\n- Two options are unrealistic exemptions or guarantees."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 26,
      "clues": "- Give each initiative its own heading with developed points.\n- Headings and examples can earn at most 8 of the 26 main-part marks, and examples of SDIs and IDZs at most 1 mark each.",
      "approach": "- Define regional development in the introduction without repeating the question.\n- Cover SDIs, IDZs, SEZs and corridors.\n- Explain the purpose, features and benefits of each.",
      "solution": "1. Spatial Development Initiatives: link economic hubs, target areas of high poverty and unemployment, attract investment and use public-private partnerships.\n2. Industrial Development Zones: purpose-built estates linked to ports with duty-free inputs, customs services and tax relief for export-driven production.\n3. Special Economic Zones: demarcated areas with tax relief serving domestic and export markets, not necessarily at a port.\n4. Corridors: land passages with infrastructure that favour mining, manufacturing and transport, such as the Maputo development corridor."
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
