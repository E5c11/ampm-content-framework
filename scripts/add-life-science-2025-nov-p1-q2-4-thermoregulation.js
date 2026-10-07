#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 2.4 (Thermoregulation) (order 10)
 *
 * Real Q2.4 (6 marks) is a three-panel figure of an arteriole (constricted X, normal Y, dilated Z) with three items: the controlling
 * brain part, which diagram is a cold day, and the significance of dilation. One lesson (DESIGN-UNI-10 rule 1). Fresh practice
 * questions test the same relationships in words: brain part / skin response, the cold-day response sequence, why constriction helps,
 * and which responses cool the body. Independent lesson (the real 2.4.2 -> 2.4.3 diagram-letter chain is restated in each question).
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q2-4-thermoregulation.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q2-4-thermoregulation.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q2-4-thermoregulation.js
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
  "name": "Question 2.4 (Thermoregulation)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "thermoregulation",
    "homeostasis",
    "vasodilation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q10/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q10/memo_1.png"
  ],
  "exam_question_marks": 6
};

const questions = [
  {
    "name": "Question 1",
    "question": "On a very hot day, which statement correctly describes how the brain and skin cooperate to regulate body temperature?",
    "metadata": [
      "The cerebellum detects the rise in blood temperature and the sweat glands secrete more sweat",
      "The hypothalamus detects the rise in blood temperature and the skin arterioles constrict",
      "The medulla oblongata detects the rise in blood temperature and the skin arterioles constrict",
      "The hypothalamus detects the rise in blood temperature and the sweat glands secrete more sweat",
      ""
    ],
    "answer": [
      "The hypothalamus detects the rise in blood temperature and the sweat glands secrete more sweat",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "hypothalamus_and_sweat_glands",
    "skills": [
      "pair_thermoregulation_control_and_effector"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- One brain region is responsible for homeostasis; the others control balance and breathing."
  },
  {
    "name": "Question 2",
    "question": "Arrange the events in the body's response to a fall in the temperature of the blood in the correct order.",
    "metadata": [
      "The skin arterioles constrict",
      "The hypothalamus detects that the blood temperature has fallen",
      "Less blood flows near the skin surface so less heat is lost",
      "Impulses are sent to the arterioles in the skin",
      "The body temperature returns towards normal"
    ],
    "answer": [
      "The hypothalamus detects that the blood temperature has fallen",
      "Impulses are sent to the arterioles in the skin",
      "The skin arterioles constrict",
      "Less blood flows near the skin surface so less heat is lost",
      "The body temperature returns towards normal"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "cold_response_sequence",
    "skills": [
      "sequence_response_to_cold"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The detection of the stimulus comes first and the return to normal comes last."
  },
  {
    "name": "Question 3",
    "question": "Why does constriction of the arterioles in the skin help a person who is standing in cold wind?",
    "metadata": [
      "More blood flows near the skin surface, so more heat is lost by radiation",
      "The sweat glands secrete more sweat, which cools the skin",
      "Less blood flows near the skin surface, so less heat is lost by radiation",
      "The hairs on the skin lie flat, which traps a layer of warm air",
      ""
    ],
    "answer": [
      "Less blood flows near the skin surface, so less heat is lost by radiation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "vasoconstriction_significance",
    "skills": [
      "explain_significance_of_vasoconstriction"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Compare the amount of blood reaching the skin with the amount of heat that can escape from it."
  },
  {
    "name": "Question 4",
    "question": "Which of the following help to lower body temperature on a hot day?",
    "metadata": [
      "Dilation of the skin arterioles",
      "Sweating",
      "Shivering",
      "Constriction of the skin arterioles",
      "Raising of the body hairs"
    ],
    "answer": [
      "Dilation of the skin arterioles",
      "Sweating",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "cooling_responses_identification",
    "skills": [
      "identify_cooling_responses"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Cooling responses increase heat loss; warming responses reduce it or generate heat."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.4.1",
      "marks": 1,
      "clues": "- This part of the brain regulates homeostasis.",
      "approach": "- Recall which brain region contains the body's temperature control centre.",
      "solution": "1. Thermoregulation is controlled by the hypothalamus."
    },
    {
      "number": "2.4.2",
      "marks": 1,
      "clues": "- On a cold day the body needs to reduce heat loss.\n- Compare the diameter of the opening in each diagram with diagram Y.",
      "approach": "- Decide whether the arteriole should be wider or narrower on a cold day.\n- Pick the diagram that is narrower than the normal diagram.",
      "solution": "1. On a cold day the arterioles in the skin constrict to reduce heat loss.\n2. Diagram X shows a narrower opening than normal.\n3. The answer is X."
    },
    {
      "number": "2.4.3",
      "marks": 4,
      "clues": "- Compare diagram Z with diagram Y: is the opening narrower or wider?\n- Link the amount of blood near the skin to the amount of heat lost.",
      "approach": "- Describe the change in the diameter of the arteriole in diagram Z.\n- State how it changes the blood flow to the skin.\n- State how it changes heat loss.\n- State the purpose for body temperature.",
      "solution": "1. The arteriole dilates (vasodilation) in diagram Z.\n2. More blood flows to the surface of the skin.\n3. More heat is lost by radiation from the skin.\n4. This decreases and regulates the body temperature."
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
