#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 3.4: Tourism, GDP and poverty (order 16)
 * Lesson 16 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 3.4: Tourism, GDP and poverty. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l16.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l16.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l16.js
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
  "name": "Question 3.4: Tourism, GDP and poverty",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "tourism",
    "income_inequality"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q16/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q16/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A foreign family spends R30 000 on hotel rooms and meals during a visit. Which contribution to GDP is this?",
    "metadata": [
      "A government transfer",
      "An indirect contribution of tourism",
      "A direct contribution of tourism",
      "An import",
      ""
    ],
    "answer": [
      "A direct contribution of tourism",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_benefits_and_policy",
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
    "paper": "nov_p2",
    "clues": "- The spending goes straight to businesses that serve visitors."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which tourism can help to reduce poverty.",
    "metadata": [
      "It diversifies the income sources of poor people",
      "Households can start small businesses serving tourists",
      "It offers on-the-job training in rural communities",
      "It forces people to move to big cities",
      "It always lowers the cost of living"
    ],
    "answer": [
      "It diversifies the income sources of poor people",
      "Households can start small businesses serving tourists",
      "It offers on-the-job training in rural communities",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_benefits_and_policy",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Think about new ways for poor households to earn an income locally."
  },
  {
    "name": "Question 3",
    "question": "Why is tourism described as an alternative to urbanisation?",
    "metadata": [
      "It forces rural families to move to cities",
      "It closes rural businesses",
      "It lets people earn an income while continuing a rural family lifestyle",
      "It raises rural food prices",
      ""
    ],
    "answer": [
      "It lets people earn an income while continuing a rural family lifestyle",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_benefits_and_policy",
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
    "paper": "nov_p2",
    "clues": "- Urbanisation means moving to the city for work."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.4",
      "marks": 8,
      "clues": "- Give two developed points on GDP and two on poverty.\n- A bare list is capped at 4 marks.",
      "approach": "- Explain direct and indirect contributions of tourism to GDP.\n- Explain how tourism spreads development to poor rural areas.\n- Use examples of spending and small businesses.",
      "solution": "1. GDP: tourism contributes directly through spending by residents and non-residents on items such as food, accommodation and transport.\n2. It contributes indirectly through purchases from suppliers, such as hotels buying cleaning services and airlines buying fuel and catering.\n3. Poverty: tourism is a fast, effective redistribution mechanism for the rural poor and an alternative to urbanisation.\n4. It diversifies income sources and allows small-scale tourism businesses and SMMEs, with training and links to mainstream firms."
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
