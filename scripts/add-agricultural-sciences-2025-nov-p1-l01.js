#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 1: Alimentary canals and digestion (Section A) (order 1)
 * Section A items 1.1.1, 1.1.2, 1.1.4 and 1.4.1 — alimentary canals of farm animals, ruminant stomach compartments, the new-born ruminant and rumen enzymes. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l01.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l01.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l01.js
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
  "name": "Question 1: Alimentary canals and digestion (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "ruminant_digestion",
    "simple_stomach_digestion",
    "rumen_microbes"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q1/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q1/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q1/memo_1.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Free-range hens are given crushed shell grit with their grain. In which part of the alimentary canal does the grit help to break the grain down?",
    "metadata": [
      "Crop",
      "Proventriculus",
      "Gizzard",
      "Caecum",
      ""
    ],
    "answer": [
      "Gizzard",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "alimentary_canals_and_digestion",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Hens have no teeth, so another part must do the mechanical grinding.\n- Think about which part has very thick, muscular walls."
  },
  {
    "name": "Question 2",
    "question": "Fibrous feed such as hay is fermented by microbes before the cow can absorb the products. In which stomach compartment does most of this microbial fermentation take place?",
    "metadata": [
      "Reticulum",
      "Omasum",
      "Rumen",
      "Abomasum",
      ""
    ],
    "answer": [
      "Rumen",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_nutrition",
    "topic": "alimentary_canals_and_digestion",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Look for the compartment that is the largest in a mature ruminant.\n- The true stomach, with its acid and enzymes, does not host these microbes."
  },
  {
    "name": "Question 3",
    "question": "A calf is only a few days old and drinks milk. Which of the following are true for the calf’s digestive system?",
    "metadata": [
      "The rumen is fully developed and digests fibre",
      "The oesophageal groove closes into a channel",
      "Rumen microbes already digest large amounts of cellulose",
      "The abomasum is the main working compartment",
      "Milk bypasses the rumen and reaches the abomasum"
    ],
    "answer": [
      "The oesophageal groove closes into a channel",
      "The abomasum is the main working compartment",
      "Milk bypasses the rumen and reaches the abomasum",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "alimentary_canals_and_digestion",
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
    "clues": "- Compare a very young ruminant with a mature one: which compartments are working?\n- Liquid feed follows a different route from solid feed."
  },
  {
    "name": "Question 4",
    "question": "After eating, a cow brings a bolus of partly digested feed back to her mouth and chews it again. Name the process of re-chewing this bolus (the cud). []",
    "metadata": [
      "Process: ",
      "[ ]"
    ],
    "answer": [
      "rumination",
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
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Separate the bringing-up of the bolus from the chewing of it; this term names the chewing."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- Which type of animal has no teeth to grind feed?\n- Where in the alimentary canal is mechanical grinding done instead?",
      "approach": "- Recall which animals have a gizzard and what it contains.\n- Eliminate the animals that grind feed with their teeth.",
      "solution": "1. A thick, muscular stomach that grinds feed with small stones (grit) is the gizzard of a fowl.\n2. Pigs, cows and goats grind feed with their teeth, so the answer is C (fowls)."
    },
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- Microbial digestion happens in the forestomach, before the true stomach.\n- Think about which two compartments are the biggest.",
      "approach": "- Recall the four compartments of the ruminant stomach.\n- Identify which ones contain rumen microbes that ferment fibre.",
      "solution": "1. The microbes live in the rumen and reticulum (the reticulum is connected to the rumen).\n2. The omasum absorbs water and the abomasum is the true stomach, so the answer is B."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- Think about what a new-born ruminant drinks and where it goes.\n- Decide which statements describe a young, not a mature, ruminant.",
      "approach": "- Write down what is different about the forestomach of a calf.\n- Check each statement (i)–(iv) against that picture, then match the correct combination.",
      "solution": "1. The forestomach of a new-born ruminant is underdeveloped (i) and only the abomasum is functional (ii).\n2. Milk flows through the oesophageal groove directly towards the abomasum (iii).\n3. The rumen is not fully functional yet, so (iv) is false: the answer is A."
    },
    {
      "number": "1.4.1",
      "marks": 1,
      "clues": "- Enzymes are named after the substance they break down.\n- Sucrase acts on sugar, not on fibre.",
      "approach": "- Look at what is being digested: cellulose and hemicellulose.\n- Replace the underlined word with the enzyme that digests those fibres.",
      "solution": "1. The enzyme that digests cellulose and hemicellulose into acetic, butyric and propionic acids is cellulase, made by rumen microbes."
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
