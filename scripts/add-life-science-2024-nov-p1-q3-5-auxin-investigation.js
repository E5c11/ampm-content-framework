#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 3.5 (Auxins and Plant Growth Investigation) (order 17)
 *
 * Real Q3.5 (11 marks) is an investigation on 12 plants in the dark: intact tips (A), agar with auxins (B), plain agar (C):
 * independent and controlled variables, expected results for A and C, reliability, and why B bent to the right. One lesson
 * (DESIGN-UNI-10 rule 1). Practice uses a fresh investigation (auxin concentration and root formation in cuttings) and an
 * evenly placed agar block; the bending explanation becomes an ordering (DESIGN-LIFE-02). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q3-5-auxin-investigation.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q3-5-auxin-investigation.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q3-5-auxin-investigation.js
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
  "name": "Question 3.5 (Auxins and Plant Growth Investigation)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "auxins",
    "tropisms",
    "investigation_skills",
    "variables"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q17/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q17/memo_1.png"
  ],
  "exam_question_marks": 11
};

const questions = [
  {
    "name": "Question 1",
    "question": "An investigation tests how auxin concentration affects root growth. Stem cuttings are placed in solutions containing 0, 5, 10 or 20 mg/ℓ of auxin for 14 days, and the roots on each cutting are counted. What is the independent variable?",
    "metadata": [
      "The number of roots on each cutting",
      "The number of days the cuttings were left",
      "The concentration of auxin in the solution",
      "The species of plant used for the cuttings",
      ""
    ],
    "answer": [
      "The concentration of auxin in the solution",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "experimental_variable_identification",
    "skills": [
      "identify_experimental_variables"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The independent variable is the one the investigator chooses to change."
  },
  {
    "name": "Question 2",
    "question": "In the same auxin investigation, which variables should be kept the same for all the cuttings? Select ALL that apply.",
    "metadata": [
      "The species of plant",
      "The concentration of auxin",
      "The volume of each solution",
      "The temperature the cuttings are kept at",
      "The number of roots formed"
    ],
    "answer": [
      "The species of plant",
      "The volume of each solution",
      "The temperature the cuttings are kept at",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "controlled_variables_identification",
    "skills": [
      "identify_controlled_variables"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Remove the variable that is changed on purpose and the one that is measured."
  },
  {
    "name": "Question 3",
    "question": "How could the reliability of the auxin investigation be improved?",
    "metadata": [
      "Use more cuttings in each solution and repeat it",
      "Count the roots only on the cutting that grew the most roots",
      "Use a different plant species for each of the four solutions",
      "Leave out the 0 mg/ℓ solution to save time",
      ""
    ],
    "answer": [
      "Use more cuttings in each solution and repeat it",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "investigation_reliability",
    "skills": [
      "identify_way_to_improve_reliability"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Reliability depends on how much data the result is based on."
  },
  {
    "name": "Question 4",
    "question": "The tip of a shoot is cut off and a block of agar containing auxin is placed so that it covers the whole cut surface. The plant is kept in the dark. What growth is expected?",
    "metadata": [
      "It bends to the left, because more auxin collects on the right side",
      "It stops growing, because auxins only work in the light",
      "It forms side branches instead of growing upward",
      "It grows straight upward, because the auxin spreads evenly down the stem",
      ""
    ],
    "answer": [
      "It grows straight upward, because the auxin spreads evenly down the stem",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "auxin_distribution_growth_prediction",
    "skills": [
      "predict_growth_from_auxin_placement"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Consider whether one side of the stem receives more auxin than the other."
  },
  {
    "name": "Question 5",
    "question": "An agar block containing auxin is placed on only one side of a cut shoot, and the shoot bends. Arrange these events in the correct order.",
    "metadata": [
      "The cells on that side elongate more",
      "Auxins diffuse from the agar into the side of the stem below it",
      "The stem bends away from the side with more auxin",
      "The auxin concentration becomes higher on that side"
    ],
    "answer": [
      "Auxins diffuse from the agar into the side of the stem below it",
      "The auxin concentration becomes higher on that side",
      "The cells on that side elongate more",
      "The stem bends away from the side with more auxin"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "auxin_agar_bending_sequence",
    "skills": [
      "sequence_auxin_induced_bending"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Start with the movement of the hormone.\n- End with the change in the direction of growth."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.5.1(a)",
      "marks": 1,
      "clues": "- Compare what was done differently to groups B and C.",
      "approach": "- Find the factor the investigator changed between the groups.\n- State it.",
      "solution": "1. The only difference between the agar blocks was whether they contained auxins.\n2. The independent variable is the presence of auxins."
    },
    {
      "number": "3.5.1(b)",
      "marks": 2,
      "clues": "- Look for conditions that were the same for all twelve plants.",
      "approach": "- List the conditions described for all the groups.\n- Give the first two only.",
      "solution": "1. Any two: the species of plant; the light conditions (all kept in darkness); the time spent in the dark (72 hours)."
    },
    {
      "number": "3.5.2(a)",
      "marks": 1,
      "clues": "- Group A still has its tip, and the plants are in the dark.",
      "approach": "- Recall where auxins are made.\n- Predict growth with no unequal light.",
      "solution": "1. The tip still makes auxins, which spread evenly in the dark.\n2. The stem grows straight upward."
    },
    {
      "number": "3.5.2(b)",
      "marks": 1,
      "clues": "- Group C has no tip and the agar contains no auxin.",
      "approach": "- Consider whether any auxin reaches the stem.\n- Predict the growth.",
      "solution": "1. No auxin reaches the stem.\n2. No upward growth occurs, and lateral branches may develop."
    },
    {
      "number": "3.5.3",
      "marks": 2,
      "clues": "- Reliability depends on the size of the sample.",
      "approach": "- Look at how many plants were used in each group.\n- State that as the way reliability was ensured.",
      "solution": "1. Four plants were used in each group."
    },
    {
      "number": "3.5.4",
      "marks": 4,
      "clues": "- Bending to the right means the left side grew more.\n- Consider where the auxin from the agar entered the stem.",
      "approach": "- State where the auxins diffused into the stem.\n- Link the higher concentration of auxin to cell elongation.\n- Explain the direction of bending.",
      "solution": "1. The auxins diffused into the left side of the stem.\n2. The higher concentration of auxins on the left side\n3. caused more cell elongation on the left side.\n4. There was less growth on the right side, so the stem bent to the right."
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
