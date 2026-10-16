#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 2.3–2.4: Absorption of nutrients and types of feed (order 8)
 * Question 2.3–2.4 — passive and active absorption, and classifying feeds as roughages or concentrates from their nutrient content. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l08.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l08.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l08.js
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
  "name": "Question 2.3–2.4: Absorption of nutrients and types of feed",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 11,
  "tags": [
    "types_of_feed",
    "feed_components",
    "simple_stomach_digestion"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q8/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q8/memo_1.png"
  ],
  "exam_question_marks": 11,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Glucose is still absorbed into the blood when the blood already holds more glucose than the small intestine. Which statement explains this?",
    "metadata": [
      "It diffuses from a low to a high concentration without energy",
      "It is moved against the gradient by active absorption using ATP",
      "It moves by osmosis together with the water in the small intestine",
      "It passes through the gut wall by passive absorption only",
      ""
    ],
    "answer": [
      "It is moved against the gradient by active absorption using ATP",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "alimentary_canals_and_digestion",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Moving a substance from a low to a high concentration does not happen by itself.\n- What does the cell have to spend to do it?"
  },
  {
    "name": "Question 2",
    "question": "Active absorption uses energy that the cells of the intestinal wall release from one molecule. Give the abbreviation of this energy-carrying molecule. []",
    "metadata": [
      "Molecule: ",
      "[ ]"
    ],
    "answer": [
      "atp|adenosine triphosphate",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "animal_nutrition",
    "topic": "alimentary_canals_and_digestion",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- It is the energy currency of every living cell.\n- The abbreviation has three letters."
  },
  {
    "name": "Question 3",
    "question": "FEED P contains 6% crude fibre, 78% total digestible nutrients (TDN) and 20% digestible protein. How is FEED P classified, and why?",
    "metadata": [
      "A roughage, because its fibre is low and its TDN is high",
      "A concentrate, because its fibre is high and its TDN is low",
      "A concentrate, because its fibre is low and its TDN is high",
      "A roughage, because its protein is high and its TDN is low",
      ""
    ],
    "answer": [
      "A concentrate, because its fibre is low and its TDN is high",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "animal_nutrition",
    "topic": "types_of_feed",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Roughages are bulky and fibrous; concentrates are rich in digestible nutrients.\n- Check the fibre value first."
  },
  {
    "name": "Question 4",
    "question": "A farmer has a feed with 28% crude fibre and 45% TDN. Select ALL the correct statements about this feed.",
    "metadata": [
      "It is ideal for fast-growing broiler chicks",
      "Pigs and poultry cannot digest it well",
      "It keeps the rumen of cattle working well",
      "It is the best feed for finishing pigs",
      "It helps dairy cows produce more butterfat"
    ],
    "answer": [
      "Pigs and poultry cannot digest it well",
      "It keeps the rumen of cattle working well",
      "It helps dairy cows produce more butterfat",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "types_of_feed",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A high-fibre feed is a roughage.\n- Which animals have the microbes to break down fibre, and what does that fermentation produce?"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3.1",
      "marks": 2,
      "clues": "- In DIAGRAM A the particles move with no energy shown.\n- In DIAGRAM B a carrier and ATP are shown.",
      "approach": "- Look at the direction of movement and whether energy is used.\n- Name the type of absorption in each diagram.",
      "solution": "1. (a) DIAGRAM A: passive absorption (diffusion/osmosis).\n2. (b) DIAGRAM B: active absorption."
    },
    {
      "number": "2.3.2",
      "marks": 1,
      "clues": "- Glucose and certain amino acids are absorbed against a gradient.\n- Which diagram shows energy being used?",
      "approach": "- Recall how glucose and amino acids are absorbed.\n- Choose the diagram that shows that process.",
      "solution": "1. Glucose and certain amino acids are absorbed actively.\n2. Answer: DIAGRAM B."
    },
    {
      "number": "2.3.3",
      "marks": 2,
      "clues": "- Mention the direction of movement.\n- Mention the source of energy.",
      "approach": "- Describe the movement relative to the concentration gradient.\n- State what supplies the energy.",
      "solution": "1. Nutrients are absorbed from a low to a high concentration, against the concentration gradient.\n2. The process uses ATP as a source of energy."
    },
    {
      "number": "2.4.1",
      "marks": 2,
      "clues": "- Compare the crude fibre and TDN of the two feeds.\n- High fibre and low TDN point to one class.",
      "approach": "- Use the crude fibre content to classify each feed.\n- Confirm with the TDN and protein values.",
      "solution": "1. (a) FEED A (21% fibre, 58% TDN): roughage.\n2. (b) FEED B (8% fibre, 82% TDN): concentrate."
    },
    {
      "number": "2.4.2",
      "marks": 1,
      "clues": "- Use one value from the table for FEED B.",
      "approach": "- Choose one nutrient value that shows FEED B is a concentrate.\n- Quote it.",
      "solution": "1. FEED B has a high protein content (16%), a high TDN (82%) or a low crude fibre content (8%) (any one)."
    },
    {
      "number": "2.4.3",
      "marks": 1,
      "clues": "- FEED A is fibrous.\n- Which animals have no rumen to digest fibre?",
      "approach": "- Identify the animals with a simple stomach.\n- Name one of them.",
      "solution": "1. A pig or poultry (fowl) cannot digest FEED A."
    },
    {
      "number": "2.4.4",
      "marks": 2,
      "clues": "- Fibre keeps the rumen working.\n- Fibre fermentation produces acetic acid, which is used for milk fat.",
      "approach": "- Link each purpose to the high-fibre or the low-fibre feed.\n- Identify the feed for each.",
      "solution": "1. (a) Improves the functioning of the digestive system of ruminants: FEED A.\n2. (b) Stimulates the production of more butterfat in milk: FEED A."
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
