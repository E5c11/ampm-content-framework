#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 4.1–4.2: Male reproductive system and sperm formation (order 14)
 * Question 4.1–4.2 — the male reproductive tract, the functions of its parts and glands, congenital defects, spermatogenesis and the structure of a sperm cell. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l14.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l14.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l14.js
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
  "name": "Question 4.1–4.2: Male reproductive system and sperm formation",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "male_reproductive_anatomy",
    "sperm_formation",
    "sperm_cell_structure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q14/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q14/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q14/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A bull cannot mature or store his sperm cells because the coiled tube lying on the surface of each testis is damaged. Which structure is this?",
    "metadata": [
      "Prostate gland",
      "Vas deferens",
      "Urethra",
      "Epididymis",
      ""
    ],
    "answer": [
      "Epididymis",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "male_reproductive_system",
    "subtopic": "agri_scenario_application",
    "skills": [
      "identify_structure_by_function"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The structure sits between the testis and the tube that carries sperm away."
  },
  {
    "name": "Question 2",
    "question": "Match each part of the male reproductive system to its function.",
    "metadata": [
      "A - Vas deferens",
      "B - Seminal fluid",
      "C - Cowper’s gland",
      "D - Testis",
      "1 - Carries sperm to the urethra during ejaculation",
      "2 - Supplies nutrients to the sperm cells",
      "3 - Cleanses the urethra before ejaculation",
      "4 - Produces sperm cells and testosterone"
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
    "topic": "male_reproductive_system",
    "subtopic": "agri_classification",
    "skills": [
      "identify_structure_by_function"
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
    "question": "Arrange the cells in the order in which they form during spermatogenesis.",
    "metadata": [
      "Spermatozoon",
      "Spermatid",
      "Spermatogonium",
      "Primary spermatocyte",
      "Secondary spermatocyte"
    ],
    "answer": [
      "Spermatogonium",
      "Primary spermatocyte",
      "Secondary spermatocyte",
      "Spermatid",
      "Spermatozoon"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "animal_reproduction",
    "topic": "spermatogenesis",
    "subtopic": "agri_process_sequence",
    "skills": [
      "sequence_agricultural_process"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Each stage divides to form the next, ending with the mature cell."
  },
  {
    "name": "Question 4",
    "question": "Which part of a sperm cell releases enzymes that help it to penetrate the ovum?",
    "metadata": [
      "The acrosome at the tip of the head",
      "The midpiece with its mitochondria",
      "The tail (flagellum)",
      "The nucleus in the head",
      ""
    ],
    "answer": [
      "The acrosome at the tip of the head",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_reproduction",
    "topic": "spermatogenesis",
    "subtopic": "agri_term_recall",
    "skills": [
      "identify_structure_by_function"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The enzymes are carried at the very front of the cell."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.1",
      "marks": 1,
      "clues": "- Part D is a coiled structure on the testis.\n- It matures and stores sperm.",
      "approach": "- Follow the labelled structures from the testis.\n- Identify part D.",
      "solution": "1. Part D is the epididymis."
    },
    {
      "number": "4.1.2",
      "marks": 2,
      "clues": "- Part A is a gland that adds fluid; part C is a tube.\n- Give one function for each.",
      "approach": "- Identify the structures named.\n- State one function for each.",
      "solution": "1. (a) Seminal fluid provides nutrients for the sperm cells, improves their motility and acts as a pH buffer.\n2. (b) The vas deferens transports sperm cells during ejaculation."
    },
    {
      "number": "4.1.3",
      "marks": 1,
      "clues": "- Part E is a testis.\n- Think about defects of the testes that are present at birth.",
      "approach": "- Identify part E.\n- Name a congenital defect of this organ.",
      "solution": "1. Part E (the testis) can have cryptorchidism or hypoplasia."
    },
    {
      "number": "4.2.1",
      "marks": 1,
      "clues": "- The process occurs in the testes.\n- It produces male gametes.",
      "approach": "- Recall the process of forming sperm cells.\n- Name it.",
      "solution": "1. Sperm cells are formed through spermatogenesis."
    },
    {
      "number": "4.2.2",
      "marks": 1,
      "clues": "- The enzyme is stored at the tip of the head.\n- Look for the part labelled at the front of the cell.",
      "approach": "- Identify the parts A, B and C.\n- Find the part that releases the enzyme for penetrating the ovum.",
      "solution": "1. Part C (the acrosome) releases the enzyme that helps the sperm to penetrate the female gamete."
    },
    {
      "number": "4.2.3",
      "marks": 2,
      "clues": "- Spermatogenesis involves both mitosis and meiosis.\n- Meiosis I produces secondary spermatocytes.",
      "approach": "- Recall the divisions in spermatogenesis.\n- Match each to the cells formed.",
      "solution": "1. (a) Secondary spermatocytes are formed by meiosis I.\n2. (b) Primary spermatocytes are formed by mitosis."
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
