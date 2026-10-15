#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 4.1: Mountain icons and sustainable management (order 14)
 * Question 4.1.1–4.1.4 — naming natural icons, the tourists they attract and sustainable and responsible management of a mountain.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l14.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l14.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l14.js
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
  "name": "Question 4.1: Mountain icons and sustainable management",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 18,
  "tags": [
    "natural_icons",
    "tourist_types",
    "sustainable_management"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q14/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q14/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q14/memo_1.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each natural icon to the country where it is found.",
    "metadata": [
      "A - Mount Fuji",
      "B - Mount Everest",
      "C - Swiss Alps (Jungfrau-Aletsch)",
      "D - Uluru",
      "1 - Nepal",
      "2 - Switzerland",
      "3 - Australia",
      "4 - Japan"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "tourist_attractions",
    "topic": "world_icons",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "Uluru is a natural landmark that is also sacred to the Anangu people. Select ALL the types of tourist it is likely to attract.",
    "metadata": [
      "Business tourists attending conferences",
      "Cultural tourists",
      "Leisure tourists",
      "Special-interest tourists",
      "Medical tourists"
    ],
    "answer": [
      "Cultural tourists",
      "Leisure tourists",
      "Special-interest tourists",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourist_attractions",
    "topic": "tourist_types",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the ways a mountain destination can manage visitors sustainably and responsibly.",
    "metadata": [
      "Allowing camping anywhere on the slopes",
      "Keeping visitors to designated trails",
      "Training and fairly paying local guides",
      "Limiting climber numbers with permits in peak season",
      "Removing all rules to attract more visitors"
    ],
    "answer": [
      "Keeping visitors to designated trails",
      "Limiting climber numbers with permits in peak season",
      "Training and fairly paying local guides",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "sustainable_responsible_tourism",
    "topic": "sustainable_management",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Which is the best reason why a mountain icon needs sustainable and responsible practices?",
    "metadata": [
      "They make climbing permits unnecessary",
      "They protect the environment for future visitors",
      "They remove the need for local guides",
      "They allow unlimited growth in visitor numbers",
      ""
    ],
    "answer": [
      "They protect the environment for future visitors",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "sustainable_responsible_tourism",
    "topic": "sustainable_management",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.1",
      "marks": 2,
      "clues": "- Use the banners to find the countries.\n- Match each country with its famous mountain.",
      "approach": "- Read the countries on banners A and C.\n- Recall the icon for each country.",
      "solution": "1. Banner A is Mount Fuji (Japan) and banner C is Mount Everest (Nepal)."
    },
    {
      "number": "4.1.2",
      "marks": 2,
      "clues": "- Think about what both mountains have in common.",
      "approach": "- Compare their status and type.",
      "solution": "1. Both mountains are natural attractions and UNESCO World Heritage Sites; other similarities are accepted."
    },
    {
      "number": "4.1.3",
      "marks": 2,
      "clues": "- Think about the reason people travel to country B.",
      "approach": "- Name a tourist type linked to its icons.",
      "solution": "1. A religious, cultural, leisure or special-interest tourist would visit the icons."
    },
    {
      "number": "4.1.4(a)",
      "marks": 4,
      "clues": "- Think about what makes this mountain special.",
      "approach": "- Give two reasons the icon is unique.",
      "solution": "1. It is the highest mountain in the world.\n2. It is sacred to local communities."
    },
    {
      "number": "4.1.4(b)",
      "marks": 4,
      "clues": "- The memo excludes litter control.\n- Two management practices are needed.",
      "approach": "- Discuss two ways to manage the mountain responsibly.",
      "solution": "1. Use only designated trails to protect the ecosystems.\n2. Enforce permits at different times for different trails to limit climbers in peak season."
    },
    {
      "number": "4.1.4(c)",
      "marks": 4,
      "clues": "- Think about the impact of too many climbers.",
      "approach": "- Explain two reasons for sustainable practice.",
      "solution": "1. It helps to reduce pollution on the climbing trails.\n2. It helps protect the natural environment."
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
