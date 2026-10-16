#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 1: Cloning, early embryo and pregnancy (Section A) (order 6)
 * Section A items on reproduction: 1.3.3 therapeutic cloning, 1.3.4 morula, 1.4.3 placenta, 1.4.4 nuclear transfer, 1.4.5 corpus luteum. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l06.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l06.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l06.js
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
  "name": "Question 1: Cloning, early embryo and pregnancy (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "cloning",
    "meiosis_and_fertilisation",
    "female_reproductive_organs"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q6/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q6/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q6/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q6/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q6/memo_2.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange the stages of early embryo development in a cow, from fertilisation onwards.",
    "metadata": [
      "Morula",
      "Implantation in the uterus",
      "Zygote",
      "Blastocyst"
    ],
    "answer": [
      "Zygote",
      "Morula",
      "Blastocyst",
      "Implantation in the uterus"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "animal_reproduction",
    "topic": "fertilisation_and_multiple_births",
    "subtopic": "agri_process_sequence",
    "skills": [
      "sequence_agricultural_process"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The fertilised egg first divides into a solid ball of cells.\n- A fluid-filled hollow ball forms before the embryo attaches to the uterus wall."
  },
  {
    "name": "Question 2",
    "question": "A farmer wants a genetically identical copy of her best dairy cow. Which type of cloning produces a whole new animal?",
    "metadata": [
      "Therapeutic cloning",
      "Gene (DNA) cloning",
      "Superovulation",
      "Reproductive cloning",
      ""
    ],
    "answer": [
      "Reproductive cloning",
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
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- One type of cloning only grows tissues and organs from stem cells.\n- Which one ends with a living animal?"
  },
  {
    "name": "Question 3",
    "question": "Match each structure of pregnancy to its function.",
    "metadata": [
      "A - Placenta",
      "B - Amnion",
      "C - Allantois",
      "D - Chorion",
      "1 - Brings the blood of mother and foetus close together",
      "2 - Fluid-filled sac that cushions the foetus",
      "3 - Collects the waste products of the foetus",
      "4 - Outer membrane that attaches to the uterus wall"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "animal_reproduction",
    "topic": "pregnancy_and_parturition",
    "subtopic": "agri_term_recall",
    "skills": [
      "identify_structure_by_function"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Exchange of food and oxygen between mother and foetus needs close contact of two blood supplies.\n- The foetal membranes each have one main job."
  },
  {
    "name": "Question 4",
    "question": "Read the statement: \"The corpus luteum is the fluid-filled structure in the ovary that bursts to release the egg cell at ovulation.\" Which words must replace \"corpus luteum\" to make the statement TRUE?",
    "metadata": [
      "Primary follicle",
      "Corpus albicans",
      "Infundibulum",
      "Graafian follicle",
      ""
    ],
    "answer": [
      "Graafian follicle",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_reproduction",
    "topic": "female_reproductive_system",
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
    "clues": "- The corpus luteum only forms after ovulation.\n- Which mature follicle releases the egg?"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.3.3",
      "marks": 2,
      "clues": "- This cloning does not produce a new animal.\n- It produces cells used to treat or replace tissues.",
      "approach": "- Distinguish reproductive cloning from the other type.\n- Name the cloning used for stem cells, tissues and organs.",
      "solution": "1. Cloning that produces embryonic stem cells for new tissues and organs is used for treatment.\n2. Answer: Therapeutic (cloning)."
    },
    {
      "number": "1.3.4",
      "marks": 2,
      "clues": "- The ball of cells is solid, not hollow.\n- It forms a few days after fertilisation.",
      "approach": "- Recall the stages after the zygote divides.\n- Name the solid ball of about sixteen cells.",
      "solution": "1. The zygote divides into a solid ball of about sixteen cells.\n2. Answer: Morula."
    },
    {
      "number": "1.4.3",
      "marks": 1,
      "clues": "- The underlined membrane has a different job.\n- Which organ allows exchange between the two blood supplies?",
      "approach": "- Identify what the statement describes.\n- Replace the underlined word with the correct structure.",
      "solution": "1. The structure that brings the blood of mother and foetus into close contact is the placenta.\n2. Answer: Placenta."
    },
    {
      "number": "1.4.4",
      "marks": 1,
      "clues": "- Ovum transfer moves an egg or embryo.\n- Here the nucleus of a body cell is moved.",
      "approach": "- Identify the technique described.\n- Replace the underlined words with its name.",
      "solution": "1. Transferring the nucleus of a body cell into an enucleated egg cell is nuclear transfer (cloning).\n2. Answer: Nuclear transfer / cloning."
    },
    {
      "number": "1.4.5",
      "marks": 1,
      "clues": "- The underlined structure exists before ovulation.\n- What forms in the place of the burst follicle afterwards?",
      "approach": "- Identify the structure that forms after ovulation.\n- Replace the underlined words.",
      "solution": "1. After ovulation the burst follicle becomes the corpus luteum.\n2. Answer: Corpus luteum."
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
