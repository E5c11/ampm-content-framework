#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 4.7–4.9: Multiple births, cloning and pregnancy (order 18)
 * Question 4.7–4.9 — how twins form, cloning by nuclear transfer, the stages of pregnancy and the causes of abortion (five questions: three separate concepts). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l18.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l18.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l18.js
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
  "name": "Question 4.7–4.9: Multiple births, cloning and pregnancy",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 18,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "multiple_births",
    "cloning",
    "abortion"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q18/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q18/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q18/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q18/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A cow gives birth to twin calves that are not identical. How did the twins form?",
    "metadata": [
      "One fertilised ovum split into two embryos",
      "A cloned embryo was transferred to the uterus",
      "One ovum was fertilised by two sperm cells",
      "Two ova were fertilised by two sperm cells",
      ""
    ],
    "answer": [
      "Two ova were fertilised by two sperm cells",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "fertilisation_and_multiple_births",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Non-identical twins are formed from two separate fertilisations."
  },
  {
    "name": "Question 2",
    "question": "Arrange the stages of pregnancy in a cow in the correct order.",
    "metadata": [
      "Foetal stage",
      "Embryonic stage",
      "Ovum stage"
    ],
    "answer": [
      "Ovum stage",
      "Embryonic stage",
      "Foetal stage"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "animal_reproduction",
    "topic": "pregnancy_and_parturition",
    "subtopic": "agri_process_sequence",
    "skills": [
      "sequence_agricultural_process"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the disadvantages of cloning farm animals.",
    "metadata": [
      "The calves are genetically different from the donor",
      "The procedure is expensive and complex",
      "It is cheaper than natural mating",
      "Genetic diversity is reduced",
      "The conception rate is low"
    ],
    "answer": [
      "The conception rate is low",
      "The procedure is expensive and complex",
      "Genetic diversity is reduced",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "cloning_and_embryo_transfer",
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
    "paper": "nov_p1"
  },
  {
    "name": "Question 4",
    "question": "The nucleus of a body cell from a Jersey cow is placed in the enucleated ovum of a Bonsmara cow, and the embryo is carried by the Bonsmara cow. Which breed will the calf be?",
    "metadata": [
      "Bonsmara, because she carried the embryo",
      "It cannot be determined without a DNA test",
      "A cross between the Jersey and the Bonsmara",
      "Jersey, because the nucleus holds the genes",
      ""
    ],
    "answer": [
      "Jersey, because the nucleus holds the genes",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "cloning_and_embryo_transfer",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Ask where the genetic information of the calf comes from."
  },
  {
    "name": "Question 5",
    "question": "Select ALL the factors that can cause a cow to abort her foetus.",
    "metadata": [
      "A balanced diet with enough minerals",
      "Trauma and stress",
      "Regular deworming on schedule",
      "Poisoning by toxic plants",
      "Infections such as brucellosis"
    ],
    "answer": [
      "Infections such as brucellosis",
      "Trauma and stress",
      "Poisoning by toxic plants",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "pregnancy_and_parturition",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Look for things that harm the cow or the foetus."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.7.1",
      "marks": 2,
      "clues": "- The diagram shows two ova and two sperm cells.\n- Describe what happens to each ovum.",
      "approach": "- Study the diagram of sperm cells, egg cells and embryos.\n- State what fertilises what.",
      "solution": "1. Two different ova are fertilised.\n2. Each is fertilised by a different sperm cell, giving two embryos (non-identical twins)."
    },
    {
      "number": "4.7.2",
      "marks": 1,
      "clues": "- A is the fertilisation of the ova.\n- What follows fertilisation until birth?",
      "approach": "- Identify the event labelled A.\n- Name the reproductive process that follows.",
      "solution": "1. After fertilisation, the process of pregnancy (gestation) occurs."
    },
    {
      "number": "4.8.1",
      "marks": 1,
      "clues": "- A nucleus is taken from a body cell and placed in an enucleated ovum.\n- The embryo develops until birth.",
      "approach": "- Read the procedure described.\n- Name the technique.",
      "solution": "1. The technique is reproductive cloning (nuclear transfer)."
    },
    {
      "number": "4.8.2",
      "marks": 2,
      "clues": "- Where does the genetic material of the calf come from?\n- The Nguni cow only provided the ovum and the uterus.",
      "approach": "- Trace the source of the nucleus.\n- Link the nucleus to the genes of the calf.",
      "solution": "1. The nucleus (genetic material) came from the Holstein cow.\n2. It was inserted into the enucleated ovum of the Nguni cow, so the calf is a Holstein."
    },
    {
      "number": "4.8.3",
      "marks": 1,
      "clues": "- Think about cost, success rate and health of clones.\n- Give one disadvantage.",
      "approach": "- Recall the disadvantages of cloning.\n- Choose one.",
      "solution": "1. Cloning has a low conception rate (also accepted: expensive, complex, shorter life-span, less genetic diversity)."
    },
    {
      "number": "4.9.1",
      "marks": 1,
      "clues": "- The picture shows a developed calf in the uterus.\n- Name the last stage of pregnancy.",
      "approach": "- Look at the development shown in the picture.\n- Match it to a stage of pregnancy.",
      "solution": "1. The stage shown is the foetal stage."
    },
    {
      "number": "4.9.2",
      "marks": 2,
      "clues": "- Think about infections, nutrition and injuries.\n- Give two reasons.",
      "approach": "- Recall the causes of abortion.\n- Choose two.",
      "solution": "1. Infections or diseases.\n2. Nutritional deficiencies or trauma (other accepted: poisoning, hormonal disabilities, genetic defects)."
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
