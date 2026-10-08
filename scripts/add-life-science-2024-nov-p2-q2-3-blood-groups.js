#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 2.3 (Blood Group Inheritance) (order 9)
 *
 * Real Q2.3 (13 marks): SA 2018 blood-donor table (O 48, A 38, B 10, AB 4 %) — most common group, complete dominance, A x AB
 * gives a B child, plot a bar graph (6). Exam page 10; memo pages 6–7. The graph is decomposed (DESIGN-LIFE-04): a generated
 * bar graph of fresh data (500 learners: O 44, A 34, B 16, AB 6 %) at question_supplementary/life_science/2024/nov_p2/q9/graph_1.png,
 * plus graph-type and criteria questions. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q2-3-blood-groups.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q2-3-blood-groups.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q2-3-blood-groups.js
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
  "name": "Question 2.3 (Blood Group Inheritance)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 60,
  "tags": [
    "blood_groups",
    "genetics_and_inheritance",
    "graph_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q9/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q9/memo_2.png"
  ],
  "exam_question_marks": 13
};

const questions = [
  {
    "name": "Question 1",
    "question": "Use the graph. The school has 500 learners. How many learners have blood group AB?",
    "metadata": [
      "= ",
      "[ ]",
      " learners"
    ],
    "answer": [
      "30",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "calc",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "blood_group_percentage_calculation",
    "skills": [
      "calculate_population_percentage"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "supplementary_material": {
      "type": "graph",
      "label": "Blood groups of 500 learners",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2024/nov_p2/q9/graph_1.png"
      ]
    },
    "clues": "- Read the percentage for AB from the graph.\n- Find that percentage of 500."
  },
  {
    "name": "Question 2",
    "question": "Which genotype shows complete dominance of one blood-group allele over another?",
    "metadata": [
      "IᴬIᴮ",
      "Iᴮi",
      "ii",
      "IᴮIᴮ",
      ""
    ],
    "answer": [
      "Iᴮi",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "blood_group_dominance_types",
    "skills": [
      "identify_complete_dominance_in_blood_groups"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- You need two different alleles where only one is expressed."
  },
  {
    "name": "Question 3",
    "question": "A woman with blood group B and a man with blood group A have a child with blood group O. What are the parents' genotypes?",
    "metadata": [
      "Woman IᴮIᴮ, man IᴬIᴬ",
      "Woman IᴮIᴮ, man Iᴬi",
      "Woman Iᴮi, man Iᴬi",
      "Woman Iᴮi, man IᴬIᴬ",
      ""
    ],
    "answer": [
      "Woman Iᴮi, man Iᴬi",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "blood_group_genotype_possibilities",
    "skills": [
      "identify_blood_group_genotypes"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A child with blood group O is ii.\n- The child gets one allele from each parent."
  },
  {
    "name": "Question 4",
    "question": "A man with blood group AB and a woman with blood group O have children. Which genotypes could the children have? Select ALL that apply.",
    "metadata": [
      "IᴬIᴮ",
      "Iᴬi",
      "ii",
      "Iᴮi",
      "IᴬIᴬ"
    ],
    "answer": [
      "Iᴬi",
      "Iᴮi",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "blood_group_cross_offspring",
    "skills": [
      "predict_blood_group_offspring"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The man can pass on Iᴬ or Iᴮ.\n- The woman can only pass on i."
  },
  {
    "name": "Question 5",
    "question": "A learner must draw a graph showing the percentage of learners in each blood group. Which graph should they draw, and why?",
    "metadata": [
      "A line graph, because blood groups are separate categories",
      "A histogram, because blood group is a continuous variable",
      "A line graph, because blood group is a continuous variable",
      "A bar graph, because blood groups are separate categories",
      ""
    ],
    "answer": [
      "A bar graph, because blood groups are separate categories",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "blood_group_graph_type",
    "skills": [
      "identify_bar_graph_requirements"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Blood group A, B, AB and O have no values in between."
  },
  {
    "name": "Question 6",
    "question": "Which features must a learner's bar graph of blood-group data include to get full marks? Select ALL that apply.",
    "metadata": [
      "A caption that names both variables",
      "A line joining the tops of the bars",
      "Bars of equal width with equal gaps",
      "Bars that touch, with no gaps",
      "A y-axis label that includes the unit (%)"
    ],
    "answer": [
      "A caption that names both variables",
      "Bars of equal width with equal gaps",
      "A y-axis label that includes the unit (%)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "blood_group_graph_criteria",
    "skills": [
      "identify_bar_graph_requirements"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Joined bars make a histogram.\n- Marks are given for the caption, the labels and the scale."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.3.1",
      "marks": 1,
      "clues": "- Find the highest percentage in the table.",
      "approach": "- Compare the four percentages.\n- Name the blood group with the highest value.",
      "solution": "1. O = 48%, A = 38%, B = 10%, AB = 4%.\n2. The highest is 48%, so the most common blood group is O."
    },
    {
      "number": "2.3.2",
      "marks": 1,
      "clues": "- Blood group A can be IᴬIᴬ or Iᴬi.",
      "approach": "- Ask what happens to i when it is with Iᴬ.",
      "solution": "1. In Iᴬi, only the Iᴬ allele is expressed and the i allele is masked.\n2. This is complete dominance."
    },
    {
      "number": "2.3.3",
      "marks": 5,
      "clues": "- A child with blood group B could be IᴮIᴮ or Iᴮi.\n- The father has no Iᴮ allele.",
      "approach": "- Work out the parents' genotypes.\n- Say which allele the child gets from each parent.\n- Give the child's genotype.",
      "solution": "1. The man must be heterozygous, Iᴬi.\n2. The woman has an allele for blood group B, IᴬIᴮ.\n3. The child inherits Iᴮ from the mother.\n4. The child inherits i from the father.\n5. So the child is heterozygous Iᴮi and has blood group B."
    },
    {
      "number": "2.3.4",
      "marks": 6,
      "clues": "- Blood groups are separate categories, so draw a bar graph.\n- Include a caption, axis labels with units, a scale and all four bars.",
      "approach": "- Put blood groups on the x-axis and % donors on the y-axis.\n- Use equal bar widths and equal gaps.\n- Plot O 48, A 38, B 10 and AB 4.",
      "solution": "1. Type: bar graph (1 mark).\n2. Caption with both variables, South Africa and 2018 (1 mark), e.g. \"The percentage of blood donors for different blood groups in South Africa for 2018\".\n3. Axis labels with units (1 mark) and correct scale with equal bars (1 mark).\n4. Plotting: 1 to 3 bars correct (1 mark), all 4 correct (2 marks)."
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
