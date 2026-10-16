#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 5: World Heritage Sites in the Western Cape (order 15)
 * Question 5.1–5.3 — Robben Island and the Cape Floral Region Protected Areas, why Robben Island attracts history tourists, and the role of UNESCO.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l15.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l15.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l15.js
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
  "name": "Question 5: World Heritage Sites in the Western Cape",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "world_heritage_sites",
    "unesco_role",
    "south_african_heritage"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q15/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q15/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which TWO World Heritage Sites are found in the Western Cape?",
    "metadata": [
      "Robben Island and the Vredefort Dome",
      "iSimangaliso and the Cape Floral Region",
      "Mapungubwe and the Cape Floral Region",
      "Robben Island and the Cape Floral Region",
      ""
    ],
    "answer": [
      "Robben Island and the Cape Floral Region",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "culture_heritage_tourism",
    "topic": "south_african_world_heritage",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "Select ALL the reasons why Robben Island attracts tourists interested in South African history.",
    "metadata": [
      "It is the site of a huge meteorite crater",
      "Nelson Mandela was imprisoned there",
      "It has the oldest human fossils on Earth",
      "It held political prisoners under apartheid",
      "It is famous for ancient San rock art"
    ],
    "answer": [
      "Nelson Mandela was imprisoned there",
      "It held political prisoners under apartheid",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "culture_heritage_tourism",
    "topic": "south_african_world_heritage",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Match each organisation to its role.",
    "metadata": [
      "A - UNESCO",
      "B - SAHRA",
      "C - TGCSA",
      "D - SATourism",
      "1 - Protects heritage resources in South Africa",
      "2 - Awards star grading to accommodation",
      "3 - Markets South Africa internationally",
      "4 - Declares World Heritage Sites"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "culture_heritage_tourism",
    "topic": "unesco_role",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "The Cape Floral Region Protected Areas are listed for their rich plant life. What kind of World Heritage Site is this?",
    "metadata": [
      "A cultural site",
      "A natural site",
      "A mixed site",
      "A man-made site",
      ""
    ],
    "answer": [
      "A natural site",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "culture_heritage_tourism",
    "topic": "world_heritage_sites",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.1",
      "marks": 4,
      "clues": "- A is an island off Cape Town.\n- B covers protected areas of unique plants.",
      "approach": "- Name the island site.\n- Name the natural site in full.",
      "solution": "1. A: Robben Island.\n2. B: Cape Floral Region Protected Areas."
    },
    {
      "number": "5.2",
      "marks": 4,
      "clues": "- The cultural site is Robben Island.\n- Think about apartheid and political prisoners.",
      "approach": "- Link the site to South African history.\n- Give two reasons.",
      "solution": "1. Nelson Mandela was imprisoned on Robben Island as a political prisoner.\n2. It served as South Africa's maximum-security political prison from the 1960s to 1991."
    },
    {
      "number": "5.3",
      "marks": 2,
      "clues": "- UNESCO is the United Nations body for culture and heritage.",
      "approach": "- Explain what UNESCO does for sites of outstanding value.\n- Give one role.",
      "solution": "1. UNESCO encourages the identification of global sites of outstanding value to humanity; it also declares, protects and monitors them."
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
