#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 1.4 (Male Reproductive System) (order 5)
 *
 * Real Q1.4 (8 marks) is a lettered front-view diagram of the male system: letter + name of the shared urinary/reproductive
 * structure, the sperm store and the testosterone source; then part A (prostate) and the gametogenesis in E. One lesson
 * (DESIGN-UNI-10 rule 1). The figure is the real-question anchor (question_image_urls); practice questions ask the structures
 * by function and consequence with no figure (DESIGN-LIFE-03 option (i)). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q1-4-male-reproductive-system.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q1-4-male-reproductive-system.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q1-4-male-reproductive-system.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const video = {
  "name": "Question 1.4 (Male Reproductive System)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "male_reproductive_system",
    "spermatogenesis",
    "human_reproduction"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q5/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q5/memo_1.png"
  ],
  "exam_question_marks": 8
};

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange these structures in the order in which sperm pass through them, from where they are made to where they leave the body.",
    "metadata": [
      "Vas deferens",
      "Seminiferous tubules of the testis",
      "Urethra",
      "Epididymis"
    ],
    "answer": [
      "Seminiferous tubules of the testis",
      "Epididymis",
      "Vas deferens",
      "Urethra"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "sperm_pathway_sequence",
    "skills": [
      "sequence_sperm_pathway"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Sperm are made, then stored to mature, then carried upward before leaving the body."
  },
  {
    "name": "Question 2",
    "question": "A man has a vasectomy, in which each vas deferens is cut and tied. Which outcome follows?",
    "metadata": [
      "No semen is produced, because the prostate gland stops working",
      "Sperm production stops, because the testes lose their blood supply",
      "Testosterone production stops, so his beard stops growing",
      "Semen is still produced, but it contains no sperm",
      ""
    ],
    "answer": [
      "Semen is still produced, but it contains no sperm",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "vasectomy_consequences",
    "skills": [
      "predict_effect_of_vasectomy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Only the tubes that carry sperm are cut.\n- Consider where the fluid of semen comes from."
  },
  {
    "name": "Question 3",
    "question": "Which statements about the urethra in males are correct? Select ALL that apply.",
    "metadata": [
      "It carries both urine and semen, but not at the same time",
      "It carries urine from the kidneys to the bladder",
      "It runs through the penis",
      "It stores sperm until they mature",
      "It passes through the prostate gland"
    ],
    "answer": [
      "It carries both urine and semen, but not at the same time",
      "It runs through the penis",
      "It passes through the prostate gland",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "urethra_dual_role",
    "skills": [
      "identify_urethra_features"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The urethra is shared by two body systems.\n- Another tube with a similar name joins the kidneys to the bladder."
  },
  {
    "name": "Question 4",
    "question": "A boy's testes are both removed before puberty because of disease. Which outcome is expected?",
    "metadata": [
      "He will produce sperm but no testosterone",
      "He will produce testosterone but no sperm",
      "He will produce neither sperm nor testosterone",
      "His prostate gland will take over sperm production",
      ""
    ],
    "answer": [
      "He will produce neither sperm nor testosterone",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "testis_removal_effects",
    "skills": [
      "predict_effect_of_testis_removal"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The testes have two separate jobs.\n- No other organ takes over either job."
  },
  {
    "name": "Question 5",
    "question": "One diploid cell in a seminiferous tubule undergoes meiosis during spermatogenesis. How many sperm cells are formed from this one cell?",
    "metadata": [
      "= ",
      "[ ]"
    ],
    "answer": [
      "4",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "calc",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "spermatogenesis_meiosis_products",
    "skills": [
      "calculate_sperm_from_meiosis"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Meiosis has two divisions.\n- In males, every cell produced develops into a sperm cell."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.4.1(a)",
      "marks": 2,
      "clues": "- It carries urine from the bladder and also carries semen.",
      "approach": "- Follow the tube that leaves the bladder.\n- Give both the letter on the diagram and the name.",
      "solution": "1. The urethra (C) carries urine and semen, so it belongs to both systems.\n2. The penis (D), which contains the urethra, is also accepted."
    },
    {
      "number": "1.4.1(b)",
      "marks": 2,
      "clues": "- This coiled tube sits on the outside of each testis.",
      "approach": "- Recall where sperm mature and are stored.\n- Match that structure to its letter.",
      "solution": "1. Sperm are stored temporarily in the epididymis.\n2. The answer is B - epididymis."
    },
    {
      "number": "1.4.1(c)",
      "marks": 2,
      "clues": "- The same organ also produces sperm.",
      "approach": "- Recall which cells secrete testosterone.\n- Match the organ that contains them to its letter.",
      "solution": "1. Testosterone is secreted by cells in the testis.\n2. The answer is E - testis."
    },
    {
      "number": "1.4.2(a)",
      "marks": 1,
      "clues": "- It is a gland just below the bladder that surrounds the urethra.",
      "approach": "- Locate part A relative to the bladder and urethra.\n- Name the accessory gland found there.",
      "solution": "1. Part A surrounds the urethra just below the bladder.\n2. It is the prostate gland."
    },
    {
      "number": "1.4.2(b)",
      "marks": 1,
      "clues": "- Part E is the male gonad.",
      "approach": "- Recall the two types of gametogenesis.\n- Choose the one that happens in males.",
      "solution": "1. Part E is the testis, where sperm are made.\n2. The process is spermatogenesis."
    }
  ],
  model: 'claude-opus-5-5',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
};

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
  // database and write it to exam_versions. Dev only; idempotent; the gate is per EXAM, so it covers P2 too.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
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
