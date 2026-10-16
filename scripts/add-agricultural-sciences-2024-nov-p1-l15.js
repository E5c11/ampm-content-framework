#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 4.1: Female reproductive organs, ovulation and fertilisation (order 15)
 * Question 4.1 — gametes and their formation, primary and secondary female organs, ovulation and fertilisation, and the functions of the oviduct and uterus (asked by function, no figure — CLOSED-FIG-02). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l15.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l15.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l15.js
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
  "name": "Question 4.1: Female reproductive organs, ovulation and fertilisation",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "female_reproductive_organs",
    "meiosis_and_fertilisation",
    "gamete_formation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q15/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q15/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each organ of the reproductive system of a cow to its function.",
    "metadata": [
      "A - Ovary",
      "B - Oviduct",
      "C - Uterus",
      "D - Cervix",
      "1 - Produces egg cells and female hormones",
      "2 - Place where fertilisation takes place",
      "3 - Where the embryo implants and develops",
      "4 - Seals off the uterus during pregnancy"
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
    "topic": "female_reproductive_system",
    "subtopic": "agri_term_recall",
    "skills": [
      "identify_structure_by_function"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Follow the egg from where it is formed to where the calf grows.\n- The neck of the uterus closes with a mucus plug during pregnancy."
  },
  {
    "name": "Question 2",
    "question": "Arrange the events from the release of an egg cell to the start of pregnancy in the correct order.",
    "metadata": [
      "The zygote moves to the uterus and implants",
      "The infundibulum catches the egg cell",
      "The ovary releases a mature egg cell",
      "A sperm cell fertilises the egg in the oviduct"
    ],
    "answer": [
      "The ovary releases a mature egg cell",
      "The infundibulum catches the egg cell",
      "A sperm cell fertilises the egg in the oviduct",
      "The zygote moves to the uterus and implants"
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
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Ovulation comes before fertilisation.\n- The funnel at the end of the oviduct sits next to the ovary."
  },
  {
    "name": "Question 3",
    "question": "Which of the following is a PRIMARY reproductive organ of a cow?",
    "metadata": [
      "Uterus",
      "Oviduct",
      "Ovary",
      "Vagina",
      ""
    ],
    "answer": [
      "Ovary",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_reproduction",
    "topic": "female_reproductive_system",
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
    "clues": "- A primary reproductive organ produces the gametes.\n- Secondary organs transport the gametes or house the embryo."
  },
  {
    "name": "Question 4",
    "question": "Name the process in which egg cells (ova) are formed in the ovaries of a female farm animal. []",
    "metadata": [
      "Process: ",
      "[ ]"
    ],
    "answer": [
      "oogenesis|ovogenesis",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "animal_reproduction",
    "topic": "gamete_formation",
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
    "clues": "- In males the matching process forms sperm cells in the testes.\n- The term starts with the Greek word for \"egg\"."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.1",
      "marks": 2,
      "clues": "- A comes from the ovary.\n- B comes from the testes.",
      "approach": "- Identify the gamete released by each organ.\n- Name A and B.",
      "solution": "1. A: Egg cell (ovum, female gamete).\n2. B: Sperm cell (male gamete, spermatozoon)."
    },
    {
      "number": "4.1.2",
      "marks": 1,
      "clues": "- B is formed in the testes.",
      "approach": "- Recall the name of gamete formation in males.\n- Name the process.",
      "solution": "1. Spermatogenesis."
    },
    {
      "number": "4.1.3",
      "marks": 1,
      "clues": "- Secondary organs do not produce gametes.\n- Choose one organ shown in the diagram.",
      "approach": "- Separate the primary organ from the secondary organs.\n- Name one secondary organ in the diagram.",
      "solution": "1. Uterus, fallopian tube (oviduct) or infundibulum (any one)."
    },
    {
      "number": "4.1.4",
      "marks": 2,
      "clues": "- At 1 the egg leaves the ovary.\n- At 2 the egg and sperm meet.",
      "approach": "- Identify the event at each point in the diagram.\n- Name both processes.",
      "solution": "1. 1: Ovulation.\n2. 2: Fertilisation."
    },
    {
      "number": "4.1.5",
      "marks": 2,
      "clues": "- Think about what happens in each organ in the diagram.",
      "approach": "- Give one function of the fallopian tube.\n- Give one function of the uterus.",
      "solution": "1. (a) Fallopian tube: site of fertilisation; transports sperm and egg cells, and the zygote to the uterus (any one).\n2. (b) Uterus: implantation of the embryo; protects, nourishes and houses the embryo; contracts to expel the foetus (any one)."
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
