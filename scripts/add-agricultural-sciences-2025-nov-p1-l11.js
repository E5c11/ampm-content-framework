#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 3.3–3.5: Housing facilities, handling tools and sheep handling (order 11)
 * Question 3.3–3.5 — farm animal housing, the use of bedding, the tools used to handle animals and the basic guidelines for handling sheep. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l11.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l11.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l11.js
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
  "name": "Question 3.3–3.5: Housing facilities, handling tools and sheep handling",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "housing_facilities",
    "handling_tools",
    "sheep_handling"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q11/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q11/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q11/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q11/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each handling tool to its use.",
    "metadata": [
      "A - Plywood board",
      "B - Nose pliers",
      "C - Casting harness",
      "D - Prodder",
      "1 - Used as a barrier to steer pigs",
      "2 - Clamped in the nostrils to hold a bull still",
      "3 - Makes a large animal lie down",
      "4 - Moves stubborn cattle with a mild electric shock"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_behaviour_and_handling",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1"
  },
  {
    "name": "Question 2",
    "question": "Which facility should a farmer provide for a sow about to give birth so that her piglets are not crushed?",
    "metadata": [
      "A dipping tank for ticks and lice",
      "A holding pen for sorting animals",
      "A feed shed for storing the feed",
      "A farrowing pen with a crate",
      ""
    ],
    "answer": [
      "A farrowing pen with a crate",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_housing_and_facilities",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The facility must protect the new-born piglets from the weight of their mother."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the reasons why bedding is used in a farrowing pen.",
    "metadata": [
      "Provides the main feed for piglets",
      "Insulates cold cement floors",
      "Protects piglets from rough concrete",
      "Absorbs moisture in the pen",
      "Increases the milk yield of the sow"
    ],
    "answer": [
      "Insulates cold cement floors",
      "Protects piglets from rough concrete",
      "Absorbs moisture in the pen",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_housing_and_facilities",
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
    "clues": "- Think about the floor that the piglets lie on."
  },
  {
    "name": "Question 4",
    "question": "Which action follows the basic guidelines for handling sheep?",
    "metadata": [
      "Catch them by grabbing the wool on their backs",
      "Approach calmly and slowly and keep them as a flock",
      "Chase them with sudden movements to tire them out",
      "Use loud noises and thrown objects to herd them",
      ""
    ],
    "answer": [
      "Approach calmly and slowly and keep them as a flock",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_behaviour_and_handling",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Sheep are easily frightened flock animals."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.3.1",
      "marks": 2,
      "clues": "- Picture A shows a pen used to hold animals; picture B has a crate with bedding.\n- Think about which animal needs a crate at birth.",
      "approach": "- Describe the structure in each picture.\n- Name the facility.",
      "solution": "1. (a) Picture A is a holding pen.\n2. (b) Picture B is a farrowing pen (crate)."
    },
    {
      "number": "3.3.2",
      "marks": 1,
      "clues": "- Think about the floor in a farrowing pen and the piglets lying on it.\n- You need one use.",
      "approach": "- Recall why bedding is used.\n- State one use.",
      "solution": "1. Bedding insulates cold cement floors, protects piglets from rough concrete or absorbs moisture."
    },
    {
      "number": "3.3.3",
      "marks": 2,
      "clues": "- One structure is where animals eat; the other is a building for goods.\n- Compare their purposes.",
      "approach": "- Describe picture C and picture D.\n- State the purpose of each.",
      "solution": "1. The facility in picture C is used to feed animals (feeding trough).\n2. The facility in picture D is used to store animal feed (feed shed)."
    },
    {
      "number": "3.4.1",
      "marks": 1,
      "clues": "- Think about the tool that frightens pigs with sound.\n- Choose from the list.",
      "approach": "- Read the condition.\n- Find the tool that matches it.",
      "solution": "1. A plastic shaker makes a loud noise to steer pigs in a particular direction."
    },
    {
      "number": "3.4.2",
      "marks": 1,
      "clues": "- The tool fits around the head and behind the ears.\n- It is used to lead or restrain.",
      "approach": "- Read the condition.\n- Find the tool that matches it.",
      "solution": "1. A halter is placed around the head, muzzle and behind the ears to restrain or lead an animal."
    },
    {
      "number": "3.4.3",
      "marks": 1,
      "clues": "- This tool uses electricity in a mild form.\n- It is used on large animals.",
      "approach": "- Read the condition.\n- Find the tool that matches it.",
      "solution": "1. A prodder delivers a mild electric shock when handling large animals."
    },
    {
      "number": "3.4.4",
      "marks": 1,
      "clues": "- The tool is tied around the head of a large animal.\n- It makes the animal lie down.",
      "approach": "- Read the condition.\n- Find the tool that matches it.",
      "solution": "1. A casting harness is tied around the head of a large animal to make it lie down."
    },
    {
      "number": "3.5",
      "marks": 1,
      "clues": "- Think about how sheep react to noise and speed.\n- Give one guideline.",
      "approach": "- Recall the handling guidelines for sheep.\n- Choose one.",
      "solution": "1. Approach sheep calmly and slowly, do not catch them by the wool, avoid sudden movements and noise, or handle them as a flock (any one)."
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
