#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 3.3 (Investigation: Milk and Height) (order 13)
 *
 * Real Q3.3 (12 marks): cow vs soy milk and children's height (4 146 children, 7 years; 151.4 vs 147.4 cm, expected 149.86) —
 * variables, continuous variation, planning, validity (3), a threat to validity, reliability, conclusion. Exam page 13; memo
 * pages 9–10. Practice uses a fresh investigation (200 dairy cows, maize vs lucerne feed, milk yield) restated in each stem.
 * Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q3-3-milk-investigation.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q3-3-milk-investigation.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q3-3-milk-investigation.js
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
  "name": "Question 3.3 (Investigation: Milk and Height)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 13,
  "content_tier": "free",
  "has_video": false,
  "xp": 70,
  "tags": [
    "investigation_skills",
    "variables",
    "variation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q13/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q13/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q13/memo_2.png"
  ],
  "exam_question_marks": 12
};

const questions = [
  {
    "name": "Question 1",
    "question": "Researchers fed 100 dairy cows a maize-based feed and 100 dairy cows a lucerne-based feed for 12 months, then measured each cow's daily milk yield. Every cow was the same breed and age. Match each factor to the type of variable it is.",
    "metadata": [
      "A - The type of feed",
      "B - The daily milk yield",
      "C - The breed and age of the cows",
      "1 - Dependent variable",
      "2 - Controlled (fixed) variable",
      "3 - Independent variable"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "experimental_variable_identification",
    "skills": [
      "identify_experimental_variables"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The researchers changed one factor on purpose.\n- They measured another factor."
  },
  {
    "name": "Question 2",
    "question": "Researchers measured the daily milk yield of 200 dairy cows. Which type of variation does milk yield show, and why?",
    "metadata": [
      "Discontinuous, because the cows were split into two groups",
      "Continuous, because yield is controlled by a single gene",
      "Continuous, because yield can take any value in a range",
      "Discontinuous, because the yield is affected by the feed",
      ""
    ],
    "answer": [
      "Continuous, because yield can take any value in a range",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "continuous_vs_discontinuous_variation",
    "skills": [
      "classify_variation_type"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Height and mass are examples of the same type of variation."
  },
  {
    "name": "Question 3",
    "question": "Researchers fed 100 dairy cows a maize-based feed and 100 a lucerne-based feed for 12 months, then measured their daily milk yield. Which steps would make this investigation valid? Select ALL that apply.",
    "metadata": [
      "Using cows of the same breed",
      "Giving the lucerne group more water",
      "Giving both groups the same mass of feed",
      "Measuring the milk of the maize group only",
      "Keeping all the cows in similar housing"
    ],
    "answer": [
      "Using cows of the same breed",
      "Giving both groups the same mass of feed",
      "Keeping all the cows in similar housing",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "experimental_controlled_variables",
    "skills": [
      "identify_controlled_variables"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- In a valid investigation, only the type of feed differs between the groups."
  },
  {
    "name": "Question 4",
    "question": "Researchers plan to compare the milk yield of dairy cows given two different feeds. Which of these must they decide BEFORE the investigation starts? Select ALL that apply.",
    "metadata": [
      "How many cows to use",
      "Which group produced more milk",
      "How long the investigation will last",
      "What the conclusion will be",
      "How the milk yield will be measured"
    ],
    "answer": [
      "How many cows to use",
      "How long the investigation will last",
      "How the milk yield will be measured",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "investigation_planning_steps",
    "skills": [
      "identify_investigation_planning_steps"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Planning happens before any results exist."
  },
  {
    "name": "Question 5",
    "question": "Researchers compared the milk yield of dairy cows given two different feeds. How did they improve the reliability of their results?",
    "metadata": [
      "They kept all the cows in similar housing",
      "They used 100 cows in each group",
      "They gave both groups the same water",
      "They used cows of the same breed",
      ""
    ],
    "answer": [
      "They used 100 cows in each group",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "investigation_sample_size_reliability",
    "skills": [
      "identify_way_to_improve_reliability"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Reliability is about repeating or using a large sample.\n- The other options control variables, which affects validity."
  },
  {
    "name": "Question 6",
    "question": "Researchers measured the daily milk yield of 100 cows on a maize-based feed and 100 cows on a lucerne-based feed. Each cow's milk yield was not measured before the study began. How could this affect the investigation?",
    "metadata": [
      "It reduces reliability, as too few cows were used in each of the groups",
      "It has no effect, as the groups were equal in number",
      "It reduces validity, as the groups may have differed at the start",
      "It improves validity, as the cows were not handled as much",
      ""
    ],
    "answer": [
      "It reduces validity, as the groups may have differed at the start",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "validity_threats",
    "skills": [
      "identify_factor_reducing_validity"
    ],
    "difficulty": 4,
    "exam_weight": 1,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Without a baseline, a difference in yield could have existed before the feed changed."
  },
  {
    "name": "Question 7",
    "question": "After 12 months, cows on a maize-based feed gave an average of 22.4 litres of milk a day, and cows on a lucerne-based feed gave 18.9 litres a day. Which is a valid conclusion?",
    "metadata": [
      "Cows on the lucerne feed produced more milk than cows on the maize feed",
      "The type of feed had no effect on the milk yield of the cows",
      "Cows that produced more milk ate more feed than the other cows",
      "Cows on the maize feed produced more milk than cows on the lucerne feed",
      ""
    ],
    "answer": [
      "Cows on the maize feed produced more milk than cows on the lucerne feed",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "investigation_conclusion",
    "skills": [
      "draw_valid_conclusion"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A conclusion links the independent variable to the dependent variable.\n- Check which average is higher."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.3.1(a)",
      "marks": 1,
      "clues": "- It is the factor the researchers changed between the two groups.",
      "approach": "- Find what was different between the groups.",
      "solution": "1. One group got cow's milk and the other got soy milk.\n2. The independent variable is the type of milk."
    },
    {
      "number": "3.3.1(b)",
      "marks": 1,
      "clues": "- It is the factor the researchers measured.",
      "approach": "- Find what was measured at the end.",
      "solution": "1. The children's height was measured after 7 years.\n2. The dependent variable is the height of the children."
    },
    {
      "number": "3.3.2",
      "marks": 1,
      "clues": "- Height can take any value in a range.",
      "approach": "- Decide whether height falls into distinct groups or a range.",
      "solution": "1. Height has many values with no clear categories.\n2. It shows continuous variation."
    },
    {
      "number": "3.3.3",
      "marks": 2,
      "clues": "- Planning happens before the investigation starts.",
      "approach": "- Name two decisions made at the start.\n- Only the first two are marked.",
      "solution": "1. Any two, e.g.: decide on the sample size, decide on the duration, ask for parental consent.\n2. Others: choose the type and amount of milk, decide on the source of milk, decide how to measure height, train research assistants, design a recording sheet."
    },
    {
      "number": "3.3.4",
      "marks": 3,
      "clues": "- Validity comes from keeping everything the same except the type of milk.",
      "approach": "- List three things that were kept the same or similar.\n- Only the first three are marked.",
      "solution": "1. Only healthy children were chosen.\n2. The children were the same age, race and gender, and drank the same quantity of milk from the same supplier.\n3. They had the same additional diet, similar daily activities and similar living conditions (any three)."
    },
    {
      "number": "3.3.5",
      "marks": 1,
      "clues": "- Think of what was not controlled or measured.",
      "approach": "- Name one factor that could have affected height besides milk.",
      "solution": "1. Any one: genetic or hormonal influences were not considered.\n2. Or: it is difficult to keep conditions the same for 7 years.\n3. Or: the baseline height was not measured."
    },
    {
      "number": "3.3.6",
      "marks": 1,
      "clues": "- Reliability comes from a large sample or a long study.",
      "approach": "- Find the sample size or duration in the passage.",
      "solution": "1. 4 146 children took part, 2 073 in each group (a large sample).\n2. Also accepted: the investigation ran for 7 years."
    },
    {
      "number": "3.3.7",
      "marks": 2,
      "clues": "- Children on cow's milk: 151.4 cm. Children on soy milk: 147.4 cm.",
      "approach": "- Compare the two averages.\n- Link the type of milk to height.",
      "solution": "1. Children on cow's milk were taller on average than those on soy milk.\n2. Conclusion: drinking cow's milk leads to greater height than drinking soy milk."
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
