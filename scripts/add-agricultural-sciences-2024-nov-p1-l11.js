#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 3.1–3.3: Production systems, shelters and handling structures (order 11)
 * Question 3.1–3.3 — recognising an intensive production system, choosing shelters for the climate, bedding, and the structures used to manage farm animals. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l11.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l11.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l11.js
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
  "name": "Question 3.1–3.3: Production systems, shelters and handling structures",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "farming_systems",
    "housing_facilities",
    "handling_tools"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q11/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q11/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q11/memo_1.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the features that show a farm uses an intensive production system.",
    "metadata": [
      "Animals graze freely over large natural veld",
      "Many animals are kept on a small area",
      "Large sheds, silos and feeding facilities",
      "Little labour and very few facilities",
      "A high capital investment per animal"
    ],
    "answer": [
      "Many animals are kept on a small area",
      "Large sheds, silos and feeding facilities",
      "A high capital investment per animal",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_production_systems",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Intensive farming produces a lot from a small area of land.\n- That needs buildings, equipment and money."
  },
  {
    "name": "Question 2",
    "question": "Match each farm condition to the most suitable shelter or facility.",
    "metadata": [
      "A - Very cold, windy winters",
      "B - Hot, sunny summer days",
      "C - Newborn piglets in winter",
      "D - Wet, muddy pens",
      "1 - A closed shed with solid walls",
      "2 - An open-sided shade structure",
      "3 - A heat lamp above the creep area",
      "4 - A raised floor made of slats"
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Cold and wind call for protection from draughts; heat calls for shade and air movement.\n- Young animals need extra warmth; wet conditions need drainage."
  },
  {
    "name": "Question 3",
    "question": "A farmer spreads wheat straw on the concrete floor of a calf pen to keep the calves warm and dry. What is this layer of material called? []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "bedding|litter",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "animal_production_protection_and_control",
    "topic": "animal_housing_and_facilities",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- It insulates the animals from the cold floor and absorbs moisture.\n- Animals lie on it, as people lie on a bed."
  },
  {
    "name": "Question 4",
    "question": "Match each structure or tool to its use on a livestock farm.",
    "metadata": [
      "A - Electric fence",
      "B - Neck clamp",
      "C - Loading ramp",
      "D - Thorn-branch boma",
      "1 - Divides grazing into camps for rotation",
      "2 - Holds the head of a cow still in the crush",
      "3 - Lets animals walk up onto a truck",
      "4 - Protects a herd from predators at night"
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
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Think about what each structure controls: grazing, restraint, transport or safety."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1.1",
      "marks": 1,
      "clues": "- Look at the number of animals, the land and the buildings in the picture.",
      "approach": "- Decide whether the system is extensive or intensive.\n- Name it.",
      "solution": "1. The picture shows an intensive production system."
    },
    {
      "number": "3.1.2",
      "marks": 2,
      "clues": "- Use what you can see in the picture.\n- Think about animal density and structures.",
      "approach": "- Identify features of intensive farming in the picture.\n- Give any two.",
      "solution": "1. A large number of animals on a small area of land (high density).\n2. Housing structures, facilities and silos are present; more capital is invested (any two)."
    },
    {
      "number": "3.2.1",
      "marks": 2,
      "clues": "- PICTURE A is an open-sided structure.\n- PICTURE B is closed with walls.",
      "approach": "- Match the closed facility to cold, windy weather.\n- Match the open facility to hot weather.",
      "solution": "1. (a) Very cold and windy conditions: PICTURE B.\n2. (b) Hot summer conditions: PICTURE A."
    },
    {
      "number": "3.2.2",
      "marks": 1,
      "clues": "- The material covers the floor so that animals can lie on it.",
      "approach": "- Identify what the material on the floor is for.\n- Give the term for this insulating floor cover.",
      "solution": "1. Bedding."
    },
    {
      "number": "3.3.1",
      "marks": 1,
      "clues": "- Rotational grazing moves animals between camps.",
      "approach": "- Decide what is needed to divide farmland into camps.\n- Choose its letter from the list.",
      "solution": "1. A (barbed wire fence to demarcate an area of farmland)."
    },
    {
      "number": "3.3.2",
      "marks": 1,
      "clues": "- Subsistence farmers use simple, local materials.",
      "approach": "- Find the structure that keeps animals together overnight.\n- Choose its letter from the list.",
      "solution": "1. D (kraal made of branches)."
    },
    {
      "number": "3.3.3",
      "marks": 1,
      "clues": "- Road users must be warned before they reach the animals.",
      "approach": "- Find the item that is used to alert people.\n- Choose its letter from the list.",
      "solution": "1. C (red flags and warning signs)."
    }
  ],
  "model": "claude-opus-5-5",
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
    console.error(
      '\n   curriculum_nodes / skills → node tools/create-curriculum-node.js | create-skill.js' +
      '\n   tags → node tools/create-tag.js',
    );
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

  // Exam gate (VER-02/VER-04, tools/apply-exam-gate.js): derive the exam's minimum app version from the rows now in the
  // database and write it to exam_versions, bumping updated_at on the exam's rows. Dev only; a no-op when the derived
  // minimum is the floor (VER-07); idempotent. The gate is per EXAM, so it also gates the sibling papers.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
}

// Only run when invoked directly — so validate-questions.js (and anything else) can load
// this file for its data blocks without opening a DB connection or writing anything.
if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
