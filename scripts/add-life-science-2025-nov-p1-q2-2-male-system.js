#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 2.2 (Male Reproductive System and Spermatogenesis) (order 8)
 *
 * Real Q2.2 (11 marks) is one labelled diagram (testis, epididymis, scrotum) with four items: letter-and-name for the testosterone gland and
 * sperm storage, the role of the scrotum, and name-and-describe spermatogenesis. One lesson (DESIGN-UNI-10 rule 1). Fresh practice
 * questions test the same structures by function and the same process as an ordering, with no figure (DESIGN-LIFE-03 option (i)); the
 * 5-mark prose answer becomes ordering + a numeric chromosome count (DESIGN-LIFE-02). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q2-2-male-system.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q2-2-male-system.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q2-2-male-system.js
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
  "name": "Question 2.2 (Male Reproductive System and Spermatogenesis)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "male_reproductive_system",
    "spermatogenesis",
    "testosterone"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q8/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q8/memo_1.png"
  ],
  "exam_question_marks": 11
};

const questions = [
  {
    "name": "Question 1",
    "question": "Match each part of the male reproductive system to its function.",
    "metadata": [
      "A - Testis",
      "B - Epididymis",
      "C - Vas deferens",
      "D - Urethra",
      "1 - Produces sperm and testosterone",
      "2 - Stores sperm until they mature",
      "3 - Carries sperm from the epididymis towards the urethra",
      "4 - Carries urine and semen out of the body"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "male_structure_functions",
    "skills": [
      "match_male_structure_to_function"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Group the structures into those that make, store, transport and release sperm."
  },
  {
    "name": "Question 2",
    "question": "A man sits in a very hot bath for long periods every day over several months. What effect on his sperm production is most likely, and why?",
    "metadata": [
      "It increases, because heat speeds up meiosis",
      "It stays the same, because the scrotum has no role in sperm production",
      "It stops permanently, because the testes are damaged by any heat",
      "It decreases, because the testes need to stay slightly cooler than the rest of the body",
      ""
    ],
    "answer": [
      "It decreases, because the testes need to stay slightly cooler than the rest of the body",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "scrotum_temperature_effect",
    "skills": [
      "predict_effect_of_high_testis_temperature"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about why the testes hang outside the abdominal cavity."
  },
  {
    "name": "Question 3",
    "question": "A diploid cell in the testis of a human has 46 chromosomes. How many chromosomes will each sperm cell formed from it contain?",
    "metadata": [
      "= ",
      "[ ]"
    ],
    "answer": [
      "23",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "sperm_chromosome_number",
    "skills": [
      "calculate_gamete_chromosome_number"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Meiosis halves the chromosome number."
  },
  {
    "name": "Question 4",
    "question": "Arrange the stages of sperm production in the correct order.",
    "metadata": [
      "Four haploid cells form from each diploid cell",
      "Diploid germ cells in the seminiferous tubules grow",
      "The haploid cells develop a head with an acrosome and a tail",
      "The cells undergo meiosis"
    ],
    "answer": [
      "Diploid germ cells in the seminiferous tubules grow",
      "The cells undergo meiosis",
      "Four haploid cells form from each diploid cell",
      "The haploid cells develop a head with an acrosome and a tail"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "spermatogenesis_sequence",
    "skills": [
      "sequence_spermatogenesis_stages"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Meiosis must happen before the cells become haploid.\n- Specialisation into a sperm shape is the final step."
  },
  {
    "name": "Question 5",
    "question": "Which of the following are true of testosterone?",
    "metadata": [
      "It is secreted by the testes",
      "It is secreted by the prostate gland",
      "It stimulates sperm production",
      "It stimulates male secondary sexual characteristics at puberty",
      "It is released by the posterior pituitary"
    ],
    "answer": [
      "It is secreted by the testes",
      "It stimulates sperm production",
      "It stimulates male secondary sexual characteristics at puberty",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "testosterone_roles",
    "skills": [
      "identify_testosterone_roles"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Decide where the hormone is made before judging what it does."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.2.1(a)",
      "marks": 2,
      "clues": "- The gland that secretes testosterone also produces the sperm.\n- Both the letter and the name are required.",
      "approach": "- Recall the gland that secretes testosterone.\n- Find it on the diagram inside the scrotum.\n- Write its letter and its name.",
      "solution": "1. Testosterone is secreted by the testis.\n2. The testis is the large rounded organ labelled C.\n3. The answer is C: testis."
    },
    {
      "number": "2.2.1(b)",
      "marks": 2,
      "clues": "- The part lies against the testis as a coiled tube and sperm mature there.\n- Both the letter and the name are required.",
      "approach": "- Recall the part that stores sperm during maturation.\n- Find the coiled tube on the diagram.\n- Write its letter and name.",
      "solution": "1. Sperm are stored in the epididymis until they mature.\n2. The epididymis is the coiled tube labelled A.\n3. The answer is A: epididymis."
    },
    {
      "number": "2.2.2",
      "marks": 2,
      "clues": "- The scrotum holds the testes outside the body cavity.\n- Link its position to temperature and sperm quality.",
      "approach": "- State how the scrotum affects the temperature of the testes.\n- State what that temperature does for sperm production.",
      "solution": "1. The scrotum keeps the testes at a temperature lower than body temperature.\n2. This lower temperature is needed to produce good quality and quantity of sperm."
    },
    {
      "number": "2.2.3",
      "marks": 5,
      "clues": "- The process has a name that begins with the word for sperm.\n- It takes place in the seminiferous tubules and involves meiosis.",
      "approach": "- Name the process.\n- Say where it takes place and under the influence of which hormone.\n- State the type of cell division and the chromosome number of the products.",
      "solution": "1. The process is spermatogenesis.\n2. It takes place in the seminiferous tubules of the testes, under the influence of testosterone.\n3. Diploid cells undergo meiosis.\n4. This forms haploid sperm cells."
    }
  ],
  model: 'claude-sonnet-5-5',
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
