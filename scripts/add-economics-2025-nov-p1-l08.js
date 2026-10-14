#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 2.3: The Phillips curve (order 8)
 * Lesson 8 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 2.3: The Phillips curve. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l08.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l08.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l08.js
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

const video = {
  "name": "Question 2.3: The Phillips curve",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "phillips_curve",
    "macroeconomic_objectives"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q8/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q8/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q8/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the Phillips curve. What is the inflation rate when the unemployment rate is 8%?",
    "metadata": [
      "2%",
      "5%",
      "8%",
      "9%",
      ""
    ],
    "answer": [
      "5%",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "business_cycles",
    "topic": "phillips_curve",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Find 8% on the horizontal axis, go up to the curve, then across to the vertical axis.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p1/q8/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Study the Phillips curve. At point V, inflation is zero and unemployment is 16%. What is this level of unemployment called?",
    "metadata": [
      "The cyclical rate of unemployment",
      "The frictional rate of unemployment",
      "The natural rate of unemployment",
      "The full-employment level of output",
      ""
    ],
    "answer": [
      "The natural rate of unemployment",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "business_cycles",
    "topic": "phillips_curve",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- It is the unemployment rate that remains when there is no pressure on prices to rise or fall.\n- Cyclical and frictional unemployment are causes of unemployment, not a point on this curve.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p1/q8/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Study the Phillips curve. Select ALL the statements that are true.",
    "metadata": [
      "At point V inflation is zero",
      "Moving from point T to point S lowers unemployment but raises inflation",
      "The curve slopes upward from left to right",
      "Moving from T to S makes unemployment and inflation both fall",
      "When unemployment rises from 4% to 8%, inflation falls"
    ],
    "answer": [
      "When unemployment rises from 4% to 8%, inflation falls",
      "Moving from point T to point S lowers unemployment but raises inflation",
      "At point V inflation is zero",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "interpretation",
    "unit": "business_cycles",
    "topic": "phillips_curve",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Read the coordinates of S, T and V from both axes before judging each statement.\n- Two statements contradict the direction in which the curve slopes.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p1/q8/graph_1.png"
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
      "clues": "- Read upward from 10% on the horizontal axis to the curve.",
      "approach": "- Find 10% unemployment.\n- Read the matching inflation level across to the vertical axis.",
      "solution": "1. At 10% unemployment the curve is at point C, which corresponds to 6% inflation."
    },
    {
      "number": "2.3.2",
      "marks": 1,
      "clues": "- Find where the curve meets the horizontal axis.",
      "approach": "- Note that zero inflation is where the curve crosses the axis.\n- Name the unemployment concept at that point.",
      "solution": "1. The unemployment level where inflation is zero is the natural rate of unemployment."
    },
    {
      "number": "2.3.3",
      "marks": 2,
      "clues": "- The concept is about how policy-makers try to flatten the ups and downs of the cycle.",
      "approach": "- Recall the CAPS content on the cycle.\n- Describe the idea in a sentence.",
      "solution": "1. The new economic paradigm is the smoothing of business cycles (achieving price stability) by using demand-side and supply-side policies.\n2. It holds that growth can be promoted without provoking inflation."
    },
    {
      "number": "2.3.4",
      "marks": 2,
      "clues": "- Look at the direction the curve slopes.",
      "approach": "- State how unemployment moves when inflation rises.\n- Use the word that describes opposite movements.",
      "solution": "1. The graph shows an inverse (trade-off) relationship: when unemployment is higher, inflation is lower, and the reverse."
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
