#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 2.3: Feed components and minerals (order 7)
 * Question 2.3 — the composition of a feed, the role of protein and the minerals that animals need. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l07.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l07.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l07.js
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
  "name": "Question 2.3: Feed components and minerals",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "feed_components",
    "protein_functions",
    "mineral_deficiency"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q7/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q7/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which mineral in a stock lick limits how much of the lick an animal will eat?",
    "metadata": [
      "Calcium",
      "Phosphorus",
      "Sodium",
      "Cobalt",
      ""
    ],
    "answer": [
      "Sodium",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "feed_components_and_minerals",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about the mineral that makes a lick taste salty.\n- Animals stop licking when they have had enough of it."
  },
  {
    "name": "Question 2",
    "question": "Match each mineral to the problem that a deficiency of it causes in farm animals.",
    "metadata": [
      "A - Calcium",
      "B - Iodine",
      "C - Magnesium",
      "D - Phosphorus",
      "1 - Soft, weak bones (osteomalacia)",
      "2 - Enlarged thyroid gland (goitre)",
      "3 - Muscle spasms (grass tetany)",
      "4 - Chewing bones and soil (pica)"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "animal_nutrition",
    "topic": "feed_components_and_minerals",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the roles that protein plays in the feed of a lactating cow.",
    "metadata": [
      "Forms the main source of energy",
      "Is used to make milk",
      "Insulates the body against cold",
      "Forms enzymes and hormones",
      "Builds and repairs body tissue"
    ],
    "answer": [
      "Builds and repairs body tissue",
      "Is used to make milk",
      "Forms enzymes and hormones",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "feed_components_and_minerals",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Energy and insulation are mainly provided by carbohydrates and fats."
  },
  {
    "name": "Question 4",
    "question": "A feed analysis shows a very high calcium and phosphorus content. Which condition is this feed best suited to preventing?",
    "metadata": [
      "Goitre (swollen thyroid) in sheep",
      "Grass tetany (spasms) in cattle",
      "Weak, brittle bones in animals",
      "Anaemia (low iron) in piglets",
      ""
    ],
    "answer": [
      "Weak, brittle bones in animals",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "feed_components_and_minerals",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Decide what the two minerals are needed for in the body."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3.1",
      "marks": 1,
      "clues": "- Think about the mineral that makes a lick palatable.\n- Find it in the table.",
      "approach": "- Read the minerals listed in the table.\n- Match the one that controls lick intake.",
      "solution": "1. Sodium (salt) controls the intake of a stock lick, so the mineral in the table is sodium."
    },
    {
      "number": "2.3.2",
      "marks": 2,
      "clues": "- Think about what muscles, milk and eggs are made of.\n- You need two points.",
      "approach": "- Recall the functions of protein in a feed.\n- State two of them.",
      "solution": "1. Protein is the main component of muscle tissue.\n2. It builds new cells for growth and repairs damaged tissue."
    },
    {
      "number": "2.3.3",
      "marks": 1,
      "clues": "- The table shows protein and carbohydrates as organic components.\n- Which other organic substances do feeds contain?",
      "approach": "- List the organic components of a feed.\n- Select one that is not in the table.",
      "solution": "1. Fats (oils) or vitamins are organic components that are not listed in the table."
    },
    {
      "number": "2.3.4",
      "marks": 2,
      "clues": "- Look at which mineral in the table is high.\n- Link it to the condition osteomalacia.",
      "approach": "- Recall what osteomalacia is and which mineral prevents it.\n- Check the mineral values in the table.",
      "solution": "1. The feed has a high calcium content.\n2. Calcium is needed for strong bones, so it can prevent osteomalacia."
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
