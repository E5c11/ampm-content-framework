#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 1: Disease terms, poisoning and ticks (Section A) (order 4)
 * Section A items on animal protection: 1.1.7 vectors, 1.1.8 treating plant poisoning, 1.2.4 export and import bans, 1.4.2 ticks and the diseases they transmit. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l04.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l04.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l04.js
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
  "name": "Question 1: Disease terms, poisoning and ticks (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "livestock_diseases",
    "plant_poisoning",
    "external_parasites"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q4/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q4/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q4/question_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q4/question_5.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q4/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q4/memo_3.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each animal health term to its meaning.",
    "metadata": [
      "A - Pathogen",
      "B - Vector",
      "C - Toxin",
      "D - Host",
      "1 - Micro-organism that causes a disease",
      "2 - Organism that carries a pathogen between animals",
      "3 - Poisonous substance made by a living organism",
      "4 - Animal on or in which a parasite lives and feeds"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "animal_production_protection_and_control",
    "topic": "livestock_diseases",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A tick that spreads redwater is an example of one of these terms; the protozoan it spreads is another."
  },
  {
    "name": "Question 2",
    "question": "A cow has just eaten a poisonous plant. Select ALL the measures that help to stop the poison from being absorbed.",
    "metadata": [
      "Drench it with activated charcoal",
      "Give it feed with extra additives",
      "Keep it away from drinking water",
      "Make it run to speed up digestion",
      "Dose it with a sugar or glucose solution"
    ],
    "answer": [
      "Drench it with activated charcoal",
      "Keep it away from drinking water",
      "Dose it with a sugar or glucose solution",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "plant_poisoning",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Some substances bind the poison in the gut; water helps to dissolve and spread it."
  },
  {
    "name": "Question 3",
    "question": "Decide whether the description applies to A only, B only, both A and B, or none of them. Description: diseases that ticks transmit to farm animals. A: Ringworm. B: Mastitis.",
    "metadata": [
      "A only",
      "B only",
      "Both A and B",
      "None",
      ""
    ],
    "answer": [
      "None",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_production_protection_and_control",
    "topic": "livestock_diseases",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Check the pathogen behind each disease and how it spreads.\n- Ringworm is a fungus; mastitis usually enters through the teat."
  },
  {
    "name": "Question 4",
    "question": "Read the statement: \"The bont tick transmits redwater (babesiosis) in cattle.\" Which word must replace \"bont\" to make the statement TRUE?",
    "metadata": [
      "brown ear",
      "Karoo paralysis",
      "sand tampan",
      "blue",
      ""
    ],
    "answer": [
      "blue",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_production_protection_and_control",
    "topic": "parasites_of_farm_animals",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The bont tick is linked to heartwater.\n- Which tick is linked to redwater and gallsickness?"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.7",
      "marks": 2,
      "clues": "- The organism carries the agent; it is not the agent itself.\n- Ticks and flies are examples.",
      "approach": "- Separate the disease-causing agent from the organism that carries it.\n- Choose the term for the carrier.",
      "solution": "1. A pathogen, toxin or virus causes disease itself.\n2. A carrier organism that transmits the pathogen is a vector.\n3. Answer: A (Vector)."
    },
    {
      "number": "1.1.8",
      "marks": 2,
      "clues": "- Three measures reduce absorption of the poison.\n- One measure adds feed rather than binding the poison.",
      "approach": "- Test each measure: does it bind or slow the poison?\n- Choose the combination of the correct measures.",
      "solution": "1. Keeping animals from water, giving strong tea or activated charcoal, and dosing with sugar or glucose reduce absorption.\n2. Feed loaded with additives does not.\n3. Answer: D ((i), (ii) and (iv))."
    },
    {
      "number": "1.2.4",
      "marks": 2,
      "clues": "- An export ban stops products leaving the country.\n- An import ban stops products entering it.",
      "approach": "- Decide whether the description fits an export ban.\n- Decide whether it fits an import ban.\n- Choose A only, B only, both or none.",
      "solution": "1. The description covers animals not allowed to enter or leave the country.\n2. Both bans are used to control the spread of diseases.\n3. Answer: Both A and B."
    },
    {
      "number": "1.4.2",
      "marks": 1,
      "clues": "- Heartwater is spread by a three-host tick with brightly banded legs.\n- Which tick is that?",
      "approach": "- Identify the disease named in the statement.\n- Replace the tick with the one that transmits heartwater.",
      "solution": "1. Heartwater is transmitted by the bont tick, a three-host tick.\n2. Answer: Bont."
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
