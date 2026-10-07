#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 2.3 (Menstrual Cycle and the Endometrium) (order 9)
 *
 * Real Q2.3 (14 marks) is an endometrium-thickness table with hormone explanations (2.3.1), changes in the endometrium (2.3.2), its
 * significance (2.3.3) and DRAW A BAR GRAPH (2.3.4, 6 marks). One lesson (DESIGN-UNI-10 rule 1). Per DESIGN-LIFE-04 the graph is
 * never drawn: the fresh practice set shows a generated bar graph with NEW data (a different woman, different days) and tests reading
 * it, plus the memo's own bar-graph criteria (Type/Caption/Labels/Scale/Plotting) as a multi_select. Real answers are in the
 * aiExplanation, not the practice set (AIEXP-08). Independent lesson. Graph: matplotlib, uploaded with tools/upload-question-supplementary.js (question_supplementary/life_science/2025/nov_p1/q9/graph_1.png).
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q2-3-menstrual-cycle.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q2-3-menstrual-cycle.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q2-3-menstrual-cycle.js
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
  "name": "Question 2.3 (Menstrual Cycle and the Endometrium)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "menstrual_cycle",
    "endometrium",
    "ovarian_hormones",
    "graph_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q9/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q9/memo_2.png"
  ],
  "exam_question_marks": 14
};

const questions = [
  {
    "name": "Question 1",
    "question": "In a menstrual cycle in which no fertilisation takes place, what causes the endometrium to break down and be shed?",
    "metadata": [
      "The corpus luteum degenerates, so the progesterone level falls",
      "The corpus luteum grows larger, so the progesterone level rises",
      "The Graafian follicle secretes more oestrogen",
      "The pituitary stops secreting LH for the rest of the year",
      ""
    ],
    "answer": [
      "The corpus luteum degenerates, so the progesterone level falls",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "progesterone_fall_menstruation",
    "skills": [
      "explain_endometrium_breakdown"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The lining is maintained only while a particular hormone stays high.\n- Think about what happens to the structure that secretes it when there is no embryo."
  },
  {
    "name": "Question 2",
    "question": "Use the graph to calculate by how many millimetres the thickness of the endometrium increased between day 9 and day 21.",
    "metadata": [
      "= ",
      "[ ]"
    ],
    "answer": [
      "8",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "endometrium_graph_reading",
    "skills": [
      "calculate_endometrium_thickness_change"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Read both bar heights from the vertical axis and subtract the smaller from the larger.",
    "supplementary_material": {
      "type": "graph",
      "label": "Endometrium thickness during a menstrual cycle",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p1/q9/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Which of the following changes cause the endometrium to become thicker during the cycle?",
    "metadata": [
      "It becomes more vascular, with more blood vessels",
      "It becomes more glandular, with more secretory glands",
      "Its blood vessels shrink and disappear",
      "The number of glands decreases",
      "The muscular wall of the uterus becomes thinner"
    ],
    "answer": [
      "It becomes more vascular, with more blood vessels",
      "It becomes more glandular, with more secretory glands",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "endometrium_thickening_changes",
    "skills": [
      "identify_endometrium_thickening_changes"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A lining that must nourish an embryo needs a rich supply of blood and nutrients."
  },
  {
    "name": "Question 4",
    "question": "The endometrium is at its thickest around the time that a fertilised ovum could arrive in the uterus. Which statement best explains the significance of this?",
    "metadata": [
      "A thick lining prevents sperm from reaching the ovum",
      "A thick, well-supplied lining allows the blastocyst to implant and be nourished",
      "A thick lining stops the corpus luteum from forming",
      "A thick lining causes ovulation to take place",
      ""
    ],
    "answer": [
      "A thick, well-supplied lining allows the blastocyst to implant and be nourished",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "endometrium_thickness_significance",
    "skills": [
      "explain_significance_of_thick_endometrium"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Ask what the embryo needs from the uterus when it arrives."
  },
  {
    "name": "Question 5",
    "question": "A learner must draw a bar graph of the endometrium thickness recorded on five separate days. Which of the following must the graph include?",
    "metadata": [
      "A caption that names both variables",
      "Both axes labelled, with the unit (mm) on the thickness axis",
      "Bars of equal width and equal spacing on a suitable even scale",
      "A line joining the tops of the bars",
      "Bars drawn touching each other without gaps"
    ],
    "answer": [
      "A caption that names both variables",
      "Both axes labelled, with the unit (mm) on the thickness axis",
      "Bars of equal width and equal spacing on a suitable even scale",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "bar_graph_criteria",
    "skills": [
      "identify_bar_graph_requirements"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about what a reader needs to understand a graph without any other text.\n- A bar graph is not a line graph or a histogram."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.3.1(a)",
      "marks": 3,
      "clues": "- Thickness falls when the hormone that maintains the lining drops.\n- Think about what happens to the corpus luteum if there is no pregnancy.",
      "approach": "- Identify which ovarian structure secretes the hormone that maintains the endometrium.\n- State what happens to that structure and that hormone.\n- State the effect on the endometrium.",
      "solution": "1. The corpus luteum degenerates.\n2. The progesterone level therefore decreases.\n3. The endometrium is no longer maintained and menstruation occurs, so it becomes thinner."
    },
    {
      "number": "2.3.1(b)",
      "marks": 2,
      "clues": "- The first half of the cycle is controlled by the developing follicle.",
      "approach": "- Identify the structure that secretes the hormone in the first half of the cycle.\n- State its effect on the endometrium.",
      "solution": "1. The Graafian follicle secretes oestrogen.\n2. Oestrogen increases the thickness of the endometrium."
    },
    {
      "number": "2.3.2",
      "marks": 2,
      "clues": "- A thicker lining is better able to nourish an embryo.\n- Think about blood supply and secretions.",
      "approach": "- Recall two features of the endometrium that develop before implantation.",
      "solution": "1. The endometrium becomes more vascular (more blood vessels).\n2. It also becomes more glandular."
    },
    {
      "number": "2.3.3",
      "marks": 1,
      "clues": "- Ask what a fertilised ovum needs when it reaches the uterus.",
      "approach": "- Link a thick, vascular lining to the needs of an embryo.",
      "solution": "1. A thicker endometrium allows implantation of the embryo, the development of the placenta and a good blood supply for nutrition."
    },
    {
      "number": "2.3.4",
      "marks": 6,
      "clues": "- A bar graph is marked on type, caption, labels with the unit, scale and plotting.\n- The days are plotted along the horizontal axis and the thickness in millimetres up the vertical axis.",
      "approach": "- Choose a bar graph and give it a caption that names both variables.\n- Label the horizontal axis with the day of the cycle and the vertical axis with thickness, including the unit mm.\n- Use equal bar widths and spacing, and a suitable even vertical scale such as 0 to 20 mm.\n- Plot all five bars at the correct heights.",
      "solution": "1. Draw bars for days 0, 7, 14, 21 and 28 at equal spacing and width: this is the type of graph.\n2. Add a caption such as \"Thickness of the endometrium on different days of the menstrual cycle\".\n3. Label the axes \"Day of the menstrual cycle\" and \"Thickness of the endometrium (mm)\".\n4. Use an even scale, for example 0, 5, 10, 15 and 20 mm.\n5. Plot the heights 14 mm, 3 mm, 5 mm, 13 mm and 16 mm."
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
