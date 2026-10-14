#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 4.5: Promoting tourism (order 24)
 * Lesson 24 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 4.5: Promoting tourism. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l24.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l24.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l24.js
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
  "name": "Question 4.5: Promoting tourism",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 24,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "tourism",
    "cultural_tourism"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q24/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q24/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the strategies that can promote tourism in South Africa.",
    "metadata": [
      "Marketing and advertising campaigns for tourist destinations",
      "Improving transport and communication infrastructure at tourist sites",
      "Rewarding businesses that improve the quality of tourism services",
      "Raising taxes sharply on foreign visitors",
      "Closing heritage sites to the public"
    ],
    "answer": [
      "Marketing and advertising campaigns for tourist destinations",
      "Improving transport and communication infrastructure at tourist sites",
      "Rewarding businesses that improve the quality of tourism services",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_benefits_and_policy",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- A strategy should attract more visitors or improve their experience.\n- Two options would put visitors off."
  },
  {
    "name": "Question 2",
    "question": "Which action best promotes local culture to attract international visitors?",
    "metadata": [
      "Closing museums on weekends",
      "Raising entry fees for locals only",
      "Banning craft markets",
      "Offering an authentic experience at a cultural village",
      ""
    ],
    "answer": [
      "Offering an authentic experience at a cultural village",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_benefits_and_policy",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Authenticity is the draw for international visitors."
  },
  {
    "name": "Question 3",
    "question": "Match each tourism strategy to an example.",
    "metadata": [
      "A - Special packages",
      "B - Showcasing products",
      "C - Promoting heritage",
      "D - Promoting the arts",
      "1 - Off-season rates to encourage domestic travel",
      "2 - A tourism indaba that presents the best of the country",
      "3 - Marketing a World Heritage Site such as Robben Island",
      "4 - Supporting a national arts festival"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "tourism",
    "topic": "tourism_benefits_and_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Match the idea to the example that illustrates it."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.5",
      "marks": 8,
      "clues": "- Give four developed strategies, each with its effect.\n- Mere listing earns at most 2 marks.",
      "approach": "- Think of marketing, infrastructure, new sites, quality rewards and events.\n- Explain how each attracts visitors.",
      "solution": "1. Marketing and advertising campaigns create awareness and encourage travel.\n2. Improved infrastructure, such as transport and communication, attracts tourists to destinations.\n3. Rewarding quality services, special packages and tourism indabas promote excellence and showcase products.\n4. Promoting local culture, World Heritage Sites and arts festivals attracts international visitors, and fair taxes encourage foreign tourists."
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
