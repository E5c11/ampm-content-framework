#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 1: Feed components and feed preparation (Section A) (order 2)
 * Section A items 1.1.3, 1.2.1, 1.2.2, 1.3.1 and 1.4.2 — Pearson square rations, vitamin deficiencies, feed processing, protein quality and non-protein nitrogen. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l02.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l02.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l02.js
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
  "name": "Question 1: Feed components and feed preparation (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "pearson_square",
    "vitamins_in_feed",
    "feed_processing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q2/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q2/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q2/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q2/memo_1.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A farmer mixes maize meal (9% crude protein) with soybean oilcake meal (44% crude protein) to make a ration with 16% crude protein, as shown in the Pearson square. Calculate the mass of maize meal, in kg, needed in 100 kg of the mixture. []",
    "metadata": [
      "Maize meal (kg): ",
      "[ ]"
    ],
    "answer": [
      "80",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "animal_nutrition",
    "topic": "feed_formulation_pearson_square",
    "subtopic": "agri_calculation",
    "skills": [
      "apply_agricultural_formula"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Subtract diagonally across the square to find the parts of each feed.\n- Share 100 kg in the ratio of the two numbers of parts.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Pearson square for a 16% crude protein ration",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p1/q2/diagram_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Match each vitamin to the problem that its deficiency causes in farm animals.",
    "metadata": [
      "A - Vitamin A",
      "B - Vitamin D",
      "C - Vitamin K",
      "D - Vitamin B1",
      "1 - Night blindness and dry, ulcerated eyes",
      "2 - Soft, deformed bones (rickets)",
      "3 - Blood that clots slowly",
      "4 - Loss of appetite and nerve damage"
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
    "question": "Does the following description apply to A only, B only, both A and B, or none? Description: reduces dust and wastage and makes feed easier to handle. A: Pelleting a meal. B: Mixing a meal with molasses.",
    "metadata": [
      "A only",
      "B only",
      "Both A and B",
      "None",
      ""
    ],
    "answer": [
      "Both A and B",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "feed_preparation_and_quality",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Test each of A and B against the description separately.\n- Consider what each process does to a loose, dusty meal."
  },
  {
    "name": "Question 4",
    "question": "Urea is mixed into the feed of ruminants because rumen microbes can use it to make protein. What kind of feed ingredient is urea?",
    "metadata": [
      "A non-protein nitrogen source",
      "A source of calcium for bone growth",
      "A fat-soluble vitamin supplement",
      "A source of crude fibre and bulk",
      ""
    ],
    "answer": [
      "A non-protein nitrogen source",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_nutrition",
    "topic": "feed_components_and_minerals",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Rumen microbes, not the animal itself, turn this ingredient into protein.\n- It contains nitrogen but is not itself a protein."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Draw the Pearson square with the target value in the middle.\n- Subtract diagonally, always the smaller from the larger.",
      "approach": "- Place maize meal (8%) and fish meal (32%) on the left corners and 12% in the centre.\n- Subtract the centre from the higher corner and the lower corner from the centre to find the parts.\n- Read the parts across from each feed.",
      "solution": "1. Parts of maize meal = 32 − 12 = 20.\n2. Parts of fish meal = 12 − 8 = 4.\n3. The mixing ratio is 20 parts maize meal to 4 parts fish meal: B."
    },
    {
      "number": "1.2.1",
      "marks": 2,
      "clues": "- Match the described symptom with the vitamin whose deficiency causes it.\n- Check each of A and B separately.",
      "approach": "- Recall the deficiency symptoms of vitamins B1 and B2.\n- Decide which vitamin, if any, causes deformation and ulceration of the cornea.",
      "solution": "1. Ulceration of the cornea leading to blindness is a vitamin A deficiency symptom.\n2. It is caused by neither vitamin B2 nor vitamin B1, so the answer is none."
    },
    {
      "number": "1.2.2",
      "marks": 2,
      "clues": "- Think about what each method does to the hard outer layer of the grain.\n- Test the description against A and then B.",
      "approach": "- Recall how grinding and roasting change the structure of grain.\n- Check whether each improves the digestibility of grain feeds.",
      "solution": "1. Grinding breaks the seed coat so that enzymes can reach the starch.\n2. Roasting (heat treatment) also improves the digestibility of grain, so the answer is both A and B."
    },
    {
      "number": "1.3.1",
      "marks": 2,
      "clues": "- The description is about the quality of a protein.\n- It names a protein that is missing nothing the animal needs.",
      "approach": "- Recall the terms used for protein quality and biological value.\n- Match the description of all essential and non-essential amino acids at required levels.",
      "solution": "1. A protein with all essential and non-essential amino acids at the required levels is an ideal (complete) protein."
    },
    {
      "number": "1.4.2",
      "marks": 1,
      "clues": "- Salt is not a source of nitrogen.\n- Think about which ingredient supplies nitrogen to rumen microbes and is toxic in large amounts.",
      "approach": "- Identify the non-protein nitrogen source in the sentence.\n- Replace the underlined word with it.",
      "solution": "1. The non-protein nitrogen source that becomes poisonous when consumed in large quantities is urea."
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
