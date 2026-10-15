#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 2.3: The multiplier (order 8)
 * Lesson 8 of 2024 Nov P1 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l08.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l08.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l08.js
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

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 2.3: The multiplier",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "multiplier",
    "injections"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q8/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q8/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q8/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the graph (illustrative). Identify the value of the marginal propensity to consume (mpc): []",
    "metadata": [
      "mpc = ",
      "[ ]"
    ],
    "answer": [
      "0.75",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "reading",
    "unit": "circular_flow",
    "topic": "multiplier",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Look at the number that multiplies Y in the expenditure equations.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p1/q8/diagram_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Study the graph. The value of 12 on the original expenditure line is the point where the line meets the vertical axis. What does it represent?",
    "metadata": [
      "The marginal propensity to save",
      "Spending unrelated to income",
      "The size of the multiplier",
      "Spending that rises as income rises",
      ""
    ],
    "answer": [
      "Spending unrelated to income",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "circular_flow",
    "topic": "multiplier",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- This is the level of expenditure when income is zero.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p1/q8/diagram_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "What happens to the value of the multiplier when the marginal propensity to save increases?",
    "metadata": [
      "It increases",
      "It decreases",
      "It stays the same",
      "It becomes equal to the mpc",
      ""
    ],
    "answer": [
      "It decreases",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "circular_flow",
    "topic": "multiplier",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A larger share saved means a smaller share spent again.\n- Think about how many rounds of spending remain."
  },
  {
    "name": "Question 4",
    "question": "Use the information in the graph to calculate the change in national income (ΔY). Complete the working:",
    "metadata": [
      "K = 1 ÷ (1 - mpc) = 1 ÷ 0.25",
      "[ ]",
      "ΔJ = 20 - 12",
      "[ ]",
      "ΔY = ΔJ × K = 8 × 4, so ΔY (R billion) =",
      "[ ]"
    ],
    "answer": [
      "4",
      "8",
      "32"
    ],
    "presentation": "steps",
    "keyboard_type": "scientific_math",
    "type": "calc",
    "unit": "circular_flow",
    "topic": "multiplier",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The multiplier is 1 divided by the share of extra income that is not spent.\n- The change in income is the change in spending multiplied by the multiplier.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p1/q8/diagram_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3.1",
      "marks": 1,
      "clues": "- Look at the coefficient of Y in the equations.",
      "approach": "- Read the mpc off the graph.",
      "solution": "The mpc is 0,5, the number that multiplies Y in E = 20 + 0,5Y."
    },
    {
      "number": "2.3.2",
      "marks": 1,
      "clues": "- Think of the participants in a two-sector economy.",
      "approach": "- Name one.",
      "solution": "Households / consumers, or businesses / producers / firms."
    },
    {
      "number": "2.3.3",
      "marks": 2,
      "clues": "- Think of spending that does not depend on income.",
      "approach": "- Describe the term in one sentence.",
      "solution": "Autonomous consumption is the level of consumer spending that is independent of the level of income."
    },
    {
      "number": "2.3.4",
      "marks": 2,
      "clues": "- Compare what happens to K when MPS gets bigger.",
      "approach": "- State the relationship.",
      "solution": "1. There is an inverse (negative) relationship between the MPS and the multiplier.\n2. The bigger the MPS, the smaller the multiplier, and vice versa."
    },
    {
      "number": "2.3.5",
      "marks": 4,
      "clues": "- Find K and the change in spending, then multiply.",
      "approach": "- Show the working: 3 marks for the method and 1 for the answer.",
      "solution": "1. K = 1/(1 - mpc) = 1/(1 - 0,5) = 2.\n2. ΔJ = 30 - 20 = 10.\n3. ΔY = ΔJ × K = 10 × 2 = 20.\n4. The memo accepts other methods, such as Y1 - Y or solving E = Y for both lines."
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
