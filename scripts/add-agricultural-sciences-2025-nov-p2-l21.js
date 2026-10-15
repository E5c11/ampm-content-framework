#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 4.6: Genetic modification (order 21)
 * Question 4.6 — formulating a hypothesis for a genetic modification experiment, the impact on small-scale farmers, advantages over traditional methods and the aims of genetic modification. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l21.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l21.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l21.js
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
  "name": "Question 4.6: Genetic modification",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 21,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "genetic_modification",
    "gm_hypothesis",
    "gm_impact_on_farmers"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q21/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q21/memo_1.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Scientists grow soya seeds with a herbicide-tolerance gene and normal seeds in fields sprayed with a herbicide. Which statement is a valid hypothesis for this experiment?",
    "metadata": [
      "Soya seeds are good for human health and nutrition",
      "GM increases herbicide tolerance in soya plants",
      "All farmers should buy the modified seeds each year",
      "Herbicides are harmful to the environment and to people",
      ""
    ],
    "answer": [
      "GM increases herbicide tolerance in soya plants",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "genetic_modification",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- A hypothesis is a testable statement about the effect of the gene on the plants."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the socio-economic impacts that genetically modified seed can have on small-scale farmers.",
    "metadata": [
      "Farmers no longer need any land to farm",
      "The seed is expensive for small farms",
      "Patents stop farmers saving their seed",
      "New seed must be bought each season",
      "The seed is always free of charge to farmers"
    ],
    "answer": [
      "The seed is expensive for small farms",
      "Patents stop farmers saving their seed",
      "New seed must be bought each season",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "genetic_modification",
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
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Think about cost and the rules attached to the seed."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the advantages of genetic modification over traditional breeding methods.",
    "metadata": [
      "It is limited to organisms of the same species",
      "It is much faster",
      "It is more precise",
      "Genes can come from different species",
      "It needs many generations of crossing"
    ],
    "answer": [
      "It is much faster",
      "It is more precise",
      "Genes can come from different species",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "genetic_modification",
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
    "paper": "nov_p2",
    "clues": "- Traditional methods are slow and restricted to related organisms."
  },
  {
    "name": "Question 4",
    "question": "Match each genetically modified example to the aim it serves.",
    "metadata": [
      "A - Maize with an insect-resistance gene",
      "B - Rice with extra vitamin A",
      "C - Soya that survives herbicide spraying",
      "D - Plants that make a medicine",
      "1 - Increase resistance to pests",
      "2 - Increase the nutritional value of a crop",
      "3 - Improve herbicide resistance",
      "4 - Produce products for human therapeutic use"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "genetic_modification",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.6.1",
      "marks": 1,
      "clues": "- The hypothesis predicts the effect of the gene.\n- It must be testable.",
      "approach": "- Identify the independent and the dependent variable.\n- Write a statement linking them.",
      "solution": "1. GM results in more insect resistance in maize plants (also accepted: less resistance, or no impact)."
    },
    {
      "number": "4.6.2",
      "marks": 2,
      "clues": "- Think about the cost of the seed and who owns it.\n- Give two impacts.",
      "approach": "- Recall the effects on small-scale farmers.\n- Choose two.",
      "solution": "1. GM seeds are expensive and unaffordable, and patent rules stop farmers from keeping seed; the sterile seed also forces farmers to buy new seed."
    },
    {
      "number": "4.6.3",
      "marks": 2,
      "clues": "- Compare GM with traditional breeding.\n- Give two advantages.",
      "approach": "- Recall the advantages of GM.\n- Choose two.",
      "solution": "1. It is fast and precise (also not limited to organisms of the same species)."
    },
    {
      "number": "4.6.4",
      "marks": 2,
      "clues": "- Think about what scientists want to improve.\n- Give two aims.",
      "approach": "- Recall the aims of GM.\n- Choose two.",
      "solution": "1. Improving crop yield and increasing the nutritional value of crops (other accepted aims include disease and pest resistance, herbicide resistance and pharmaceutical products)."
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
