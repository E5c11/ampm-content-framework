#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 1: Feed value and the pancreas (Section A) (order 2)
 * Section A items on feed value and digestion: 1.1.2 digestible non-nitrogenous substances, 1.1.3 biological value, 1.2.1 pancreatic secretions. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l02.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l02.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l02.js
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
  "name": "Question 1: Feed value and the pancreas (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "nutritive_ratio",
    "protein_functions",
    "accessory_glands"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q2/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q2/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q2/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q2/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A feed contains 68% total digestible nutrients (TDN) and 12% digestible protein (DP). Calculate the percentage of digestible non-nitrogenous substances (DNNS) in the feed. []",
    "metadata": [
      "DNNS (%): ",
      "[ ]"
    ],
    "answer": [
      "56",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "animal_nutrition",
    "topic": "nutritive_ratio",
    "subtopic": "agri_calculation",
    "skills": [
      "apply_agricultural_formula"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- DNNS is the part of the TDN that is not protein.\n- Subtract the DP from the TDN."
  },
  {
    "name": "Question 2",
    "question": "Why do animal-origin protein feeds, such as fish meal, have a higher biological value than most plant proteins?",
    "metadata": [
      "They contain more crude fibre, which slows down protein digestion",
      "They contain fewer amino acids, so they are absorbed much faster",
      "They supply all essential amino acids in the right amounts",
      "They are richer in starch, which the animal turns into protein",
      ""
    ],
    "answer": [
      "They supply all essential amino acids in the right amounts",
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
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Biological value measures protein quality, not protein quantity.\n- Think about the building blocks of protein that an animal cannot make itself."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the feeds that are protein-rich concentrates.",
    "metadata": [
      "Fish meal",
      "Yellow maize meal",
      "Sunflower oilcake meal",
      "Blood meal",
      "Lucerne hay"
    ],
    "answer": [
      "Fish meal",
      "Sunflower oilcake meal",
      "Blood meal",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "types_of_feed",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Concentrates are low in fibre; roughages are high in fibre.\n- Some concentrates supply mainly energy rather than protein."
  },
  {
    "name": "Question 4",
    "question": "Decide whether the description applies to A only, B only, both A and B, or none of them. Description: produced by the pancreas of a farm animal. A: Insulin. B: Trypsin.",
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
    "type": "definition",
    "unit": "animal_nutrition",
    "topic": "accessory_glands_of_digestion",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The pancreas is both an endocrine gland (hormones into the blood) and an exocrine gland (enzymes into the duodenum)."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- DNNS is not a ratio, so it is given as a percentage.\n- Subtract the protein from the total digestible nutrients.",
      "approach": "- Recall that %DNNS = %TDN − %DP.\n- Substitute the values given.\n- Choose the option with the correct value and unit.",
      "solution": "1. %DNNS = %TDN − %DP.\n2. %DNNS = 72% − 8% = 64%.\n3. Answer: C (64%)."
    },
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Biological value describes the quality of the protein in a feed.\n- Animal proteins usually score higher than plant proteins.",
      "approach": "- Identify which feeds are of animal origin.\n- Choose the feed whose protein supplies the essential amino acids best.",
      "solution": "1. Linseed meal, peanut oilcake meal and lucerne are plant feeds with a lower biological value.\n2. Fish meal is an animal protein with a complete amino acid profile.\n3. Answer: B (Fish meal)."
    },
    {
      "number": "1.2.1",
      "marks": 2,
      "clues": "- The islets of Langerhans are endocrine cells in the pancreas.\n- One item is a hormone and the other an intestinal enzyme.",
      "approach": "- Decide which item is secreted by the islets of Langerhans.\n- Check whether the other item is also secreted there.\n- Choose A only, B only, both or none.",
      "solution": "1. Maltase is an enzyme of the intestinal juice, not of the islets.\n2. Insulin is the hormone secreted by the islets of Langerhans.\n3. Answer: B only."
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
