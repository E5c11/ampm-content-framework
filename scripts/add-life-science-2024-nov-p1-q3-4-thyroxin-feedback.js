#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 3.4 (Negative Feedback of Thyroxin) (order 16)
 *
 * Real Q3.4 (10 marks) is a flow diagram of TSH and thyroxin between the pituitary and gland Y: name the interaction, gland
 * Y and the enlargement disorder, one thyroxin function, the pituitary role when thyroxin is low, and why under-secretion
 * increases body mass. One lesson (DESIGN-UNI-10 rule 1). Practice tests the reverse case (high thyroxin), iodine-deficiency
 * goitre, excess thyroxin and a TSH/thyroxin diagnosis, with no figure. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q3-4-thyroxin-feedback.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q3-4-thyroxin-feedback.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q3-4-thyroxin-feedback.js
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
  "name": "Question 3.4 (Negative Feedback of Thyroxin)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "negative_feedback",
    "endocrine_system"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q16/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q16/memo_1.png"
  ],
  "exam_question_marks": 10
};

const questions = [
  {
    "name": "Question 1",
    "question": "A person's thyroxin level rises above normal. Arrange the steps that return it to normal in the correct order.",
    "metadata": [
      "The thyroid gland is stimulated less",
      "The thyroxin level returns to normal",
      "The high thyroxin level inhibits the pituitary gland",
      "The thyroid gland secretes less thyroxin",
      "The pituitary gland secretes less TSH"
    ],
    "answer": [
      "The high thyroxin level inhibits the pituitary gland",
      "The pituitary gland secretes less TSH",
      "The thyroid gland is stimulated less",
      "The thyroid gland secretes less thyroxin",
      "The thyroxin level returns to normal"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "thyroxin_high_correction_sequence",
    "skills": [
      "sequence_high_thyroxin_correction"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The pituitary gland responds first.\n- Its hormone controls the thyroid gland."
  },
  {
    "name": "Question 2",
    "question": "In some areas the diet contains very little iodine, which the thyroid gland needs to make thyroxin. Many people there develop a swelling in the neck. Why?",
    "metadata": [
      "Too much thyroxin is made, so the thyroid gland swells with stored hormone",
      "Too little TSH is made, so the thyroid gland grows to make up for the lack",
      "Too much insulin is made, so fat is stored in the neck",
      "Too little thyroxin is made, so more TSH is secreted, which enlarges the thyroid",
      ""
    ],
    "answer": [
      "Too little thyroxin is made, so more TSH is secreted, which enlarges the thyroid",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "goitre_cause",
    "skills": [
      "explain_goitre_development"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Without iodine, the thyroid cannot make enough of its hormone.\n- Follow the negative feedback loop: what does the pituitary do when thyroxin is low?"
  },
  {
    "name": "Question 3",
    "question": "Which of the following are likely effects of the continuous over-secretion of thyroxin? Select ALL that apply.",
    "metadata": [
      "A raised metabolic rate",
      "Gaining weight from stored fat",
      "Losing body mass, even when eating well",
      "Constant tiredness from a slow metabolism",
      "A faster heart rate"
    ],
    "answer": [
      "A raised metabolic rate",
      "Losing body mass, even when eating well",
      "A faster heart rate",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "thyroxin_oversecretion_effects",
    "skills": [
      "identify_effects_of_excess_thyroxin"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Thyroxin controls how fast the body uses food.\n- Two options describe too little thyroxin."
  },
  {
    "name": "Question 4",
    "question": "Name the hormone, secreted by the pituitary gland, that stimulates the thyroid gland to secrete thyroxin.",
    "metadata": [
      "[ ]"
    ],
    "answer": [
      "TSH|thyroid stimulating hormone|thyroid-stimulating hormone|thyrotropin",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "tsh_term",
    "skills": [
      "name_thyroid_stimulating_hormone"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "text",
    "clues": "- Its name says which gland it stimulates."
  },
  {
    "name": "Question 5",
    "question": "A doctor finds that a patient has a very high TSH level but a low thyroxin level. Where is the fault most likely to be?",
    "metadata": [
      "In the pituitary gland, because it is not responding to the low thyroxin",
      "In the pancreas, because it controls the secretion of TSH",
      "In the adrenal glands, because they break down thyroxin",
      "In the thyroid gland, because it is not responding to TSH",
      ""
    ],
    "answer": [
      "In the thyroid gland, because it is not responding to TSH",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "thyroid_disorder_diagnosis",
    "skills": [
      "locate_fault_from_tsh_thyroxin_levels"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- High TSH means the pituitary is responding as it should to low thyroxin.\n- Ask which gland is failing to answer that signal."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.4.1(a)",
      "marks": 1,
      "clues": "- A change in the thyroxin level causes a response that reverses the change.",
      "approach": "- Follow both loops in the diagram.\n- Name the type of control in which the response reverses the change.",
      "solution": "1. A low thyroxin level leads to more TSH, and a high level leads to less TSH, so the change is reversed.\n2. This is a negative feedback mechanism."
    },
    {
      "number": "3.4.1(b)",
      "marks": 1,
      "clues": "- Gland Y secretes thyroxin.",
      "approach": "- Find which gland responds to TSH.\n- Name it.",
      "solution": "1. Gland Y secretes thyroxin when stimulated by TSH.\n2. Gland Y is the thyroid gland."
    },
    {
      "number": "3.4.1(c)",
      "marks": 1,
      "clues": "- The enlarged gland forms a swelling in the neck.",
      "approach": "- Recall the disorder in which the thyroid gland enlarges.\n- Name it.",
      "solution": "1. The disorder is goitre."
    },
    {
      "number": "3.4.2",
      "marks": 1,
      "clues": "- Thyroxin affects how fast the body uses energy.",
      "approach": "- Recall the main role of thyroxin.\n- Give only one function.",
      "solution": "1. Any one: it regulates the metabolic rate; it affects the growth and functioning of the heart and nervous system; it influences bone development and muscle control."
    },
    {
      "number": "3.4.3",
      "marks": 4,
      "clues": "- Thyroxin at X is lower than normal.\n- Follow the dashed or solid arrows to see how the pituitary responds.",
      "approach": "- State the level of thyroxin at X.\n- Describe how the pituitary gland responds.\n- Describe the effect on gland Y and on thyroxin.",
      "solution": "1. The thyroxin level is low.\n2. The pituitary gland is stimulated to secrete more TSH.\n3. TSH stimulates the thyroid gland (gland Y)\n4. to secrete more thyroxin, so the level returns to normal."
    },
    {
      "number": "3.4.4",
      "marks": 2,
      "clues": "- Thyroxin controls the metabolic rate.\n- Consider what happens to nutrients that are not used.",
      "approach": "- State the effect of too little thyroxin on the metabolic rate.\n- Link this to nutrient use and storage.",
      "solution": "1. A low thyroxin level lowers the metabolic rate, so fewer nutrients are used.\n2. The excess nutrients are stored as fat, which increases body mass."
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
