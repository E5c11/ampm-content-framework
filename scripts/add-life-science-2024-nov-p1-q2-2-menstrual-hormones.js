#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 2.2 (Hormones of the Menstrual Cycle) (order 8)
 *
 * Real Q2.2 (10 marks) is a table of oestrogen and progesterone levels on nine days of a cycle: read the progesterone peak,
 * name the hormone that rises from day 24 and explain it, calculate a percentage increase in oestrogen, and predict and
 * explain progesterone if she were pregnant. One lesson (DESIGN-UNI-10 rule 1). Fresh practice data are stated in each
 * stem; the real 2.2.2→2.2.3 and 2.2.5→2.2.6 chains are restated inside single questions, so the lesson is independent.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q2-2-menstrual-hormones.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q2-2-menstrual-hormones.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q2-2-menstrual-hormones.js
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
  "name": "Question 2.2 (Hormones of the Menstrual Cycle)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "menstrual_cycle",
    "ovarian_hormones",
    "negative_feedback"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q8/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q8/memo_1.png"
  ],
  "exam_question_marks": 10
};

const questions = [
  {
    "name": "Question 1",
    "question": "A woman's oestrogen level rose from 60 pg/mℓ on day 6 to 255 pg/mℓ on day 12 of her menstrual cycle. Calculate the percentage increase in her oestrogen level.",
    "metadata": [
      "= ",
      "[ ]",
      " %"
    ],
    "answer": [
      "325",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "calc",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "hormone_level_percentage_change",
    "skills": [
      "calculate_hormone_percentage_increase"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Find the increase first.\n- Divide the increase by the starting value, then multiply by 100."
  },
  {
    "name": "Question 2",
    "question": "Progesterone levels (ng/mℓ) were measured in another woman: day 5 = 0.4, day 11 = 0.2, day 17 = 9.8, day 22 = 13.6 and day 26 = 3.1. On which of these days was her corpus luteum most active?",
    "metadata": [
      "Day 11",
      "Day 17",
      "Day 22",
      "Day 26",
      ""
    ],
    "answer": [
      "Day 22",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "reading",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "progesterone_level_reading",
    "skills": [
      "read_peak_progesterone_from_data"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The corpus luteum secretes progesterone.\n- Compare all the readings."
  },
  {
    "name": "Question 3",
    "question": "Near the end of a cycle in which no fertilisation took place, a woman's progesterone level falls from 9 ng/mℓ to 1 ng/mℓ. Which hormone will start to rise next, and why?",
    "metadata": [
      "LH, because falling progesterone stimulates the ovary to secrete it",
      "Oestrogen, because falling progesterone stimulates the corpus luteum",
      "FSH, because falling progesterone stimulates the endometrium to secrete it",
      "FSH, because the pituitary gland is no longer inhibited by progesterone",
      ""
    ],
    "answer": [
      "FSH, because the pituitary gland is no longer inhibited by progesterone",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "progesterone_fsh_negative_feedback",
    "skills": [
      "explain_fsh_rise_after_progesterone_drop"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- High progesterone holds back a pituitary hormone.\n- Consider what happens when that brake is removed."
  },
  {
    "name": "Question 4",
    "question": "If a woman becomes pregnant, what happens to her progesterone level during the rest of the pregnancy, and why?",
    "metadata": [
      "It falls, because the corpus luteum breaks down as in a normal cycle",
      "It stays high, because the pituitary gland starts to secrete progesterone itself",
      "It falls, because the placenta uses up the progesterone in the blood",
      "It stays high, because the corpus luteum and later the placenta secrete it",
      ""
    ],
    "answer": [
      "It stays high, because the corpus luteum and later the placenta secrete it",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "progesterone_in_pregnancy",
    "skills": [
      "explain_progesterone_level_in_pregnancy"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The endometrium must be kept in place for the embryo.\n- Two structures take turns producing the hormone."
  },
  {
    "name": "Question 5",
    "question": "Match each hormone to its role in the menstrual cycle.",
    "metadata": [
      "A - FSH",
      "B - LH",
      "C - Oestrogen",
      "D - Progesterone",
      "1 - Keeps the endometrium thick and ready for implantation",
      "2 - Causes ovulation and the formation of the corpus luteum",
      "3 - Stimulates a follicle to develop in the ovary",
      "4 - Causes the endometrium to thicken after menstruation"
    ],
    "answer": [
      "A-3",
      "B-2",
      "C-4",
      "D-1"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "menstrual_hormone_roles",
    "skills": [
      "match_menstrual_hormone_to_role"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Two hormones come from the pituitary gland and two from the ovary.\n- Put them in the order in which they peak during the cycle."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.2.1",
      "marks": 1,
      "clues": "- Read down the progesterone column only.",
      "approach": "- Find the largest progesterone value.\n- Read the day in the same row.",
      "solution": "1. The highest progesterone level is 15,0 ng/mℓ.\n2. This is on day 20."
    },
    {
      "number": "2.2.2",
      "marks": 1,
      "clues": "- From day 24 a new cycle is being prepared, so a new follicle must start to develop.",
      "approach": "- Recall which pituitary hormone stimulates a follicle.\n- Link it to the end of the cycle.",
      "solution": "1. A new follicle has to start developing for the next cycle.\n2. The hormone that rises is FSH."
    },
    {
      "number": "2.2.3",
      "marks": 2,
      "clues": "- Look at the progesterone values from day 24 to day 28.\n- High progesterone inhibits a pituitary hormone.",
      "approach": "- Quote the change in progesterone from the table.\n- Explain the effect on the pituitary gland.",
      "solution": "1. The progesterone level decreases from 5,0 to 0,8 ng/mℓ.\n2. So FSH secretion by the pituitary gland is no longer inhibited, and FSH rises."
    },
    {
      "number": "2.2.4",
      "marks": 3,
      "clues": "- Read the oestrogen values on day 8 and day 10.\n- Percentage increase = increase ÷ starting value × 100.",
      "approach": "- Find the increase between the two days.\n- Divide by the day-8 value.\n- Multiply by 100.",
      "solution": "1. The oestrogen level rises from 70 to 280 pg/mℓ.\n2. (280 - 70) ÷ 70 × 100\n3. = 300%"
    },
    {
      "number": "2.2.5",
      "marks": 1,
      "clues": "- After day 20 the level normally falls; pregnancy changes this.",
      "approach": "- Recall why the endometrium must be kept during pregnancy.\n- Predict the progesterone level.",
      "solution": "1. The progesterone level remains high (it may even increase)."
    },
    {
      "number": "2.2.6",
      "marks": 2,
      "clues": "- Consider which structure normally breaks down at the end of the cycle.\n- Later in pregnancy another structure takes over.",
      "approach": "- State what happens to the corpus luteum in pregnancy.\n- Link it to progesterone secretion.",
      "solution": "1. The corpus luteum does not break down.\n2. It continues to secrete progesterone. Also accepted: the placenta develops and secretes progesterone."
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
