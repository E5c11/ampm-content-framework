#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 1: Risk, labour legislation and diversification (Section A) (order 5)
 * Section A items 1.1.7, 1.1.8 and 1.2.4 — contingency planning, the Unemployment Insurance Act and diversification. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l05.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l05.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l05.js
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
  "name": "Question 1: Risk, labour legislation and diversification (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "contingency_planning",
    "unemployment_insurance_act",
    "diversification"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q5/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q5/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q5/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A farmer prepares a written plan of what to do if a drought destroys the grazing. What is this kind of plan called?",
    "metadata": [
      "Risk anticipation",
      "Strategic expansion",
      "Risk-taking",
      "Contingency planning",
      ""
    ],
    "answer": [
      "Contingency planning",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "production_factors",
    "topic": "risk_management",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The plan is made in advance to recognise and deal with a risk."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the matters regulated by the Unemployment Insurance Act, 2001 (Act 63 of 2001).",
    "metadata": [
      "The minimum wage for farm workers",
      "Both employer and employee contribute to the fund",
      "Workers receive security if they become unemployed",
      "The effects of unemployment for the employee",
      "Protection of workers from unfair discrimination"
    ],
    "answer": [
      "Both employer and employee contribute to the fund",
      "Workers receive security if they become unemployed",
      "The effects of unemployment for the employee",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "production_factors",
    "topic": "labour_legislation",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Discrimination and wages are covered by other Acts."
  },
  {
    "name": "Question 3",
    "question": "A farmer who grows only maize adds sheep and citrus to spread the income over several enterprises. Which strategy is this?",
    "metadata": [
      "Specialisation",
      "Diversification",
      "Consolidation",
      "Mechanisation",
      ""
    ],
    "answer": [
      "Diversification",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "production_factors",
    "topic": "diversification_and_specialisation",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The farmer is spreading the investment across several enterprises."
  },
  {
    "name": "Question 4",
    "question": "Match each labour Act to what it regulates.",
    "metadata": [
      "A - Basic Conditions of Employment Act",
      "B - Unemployment Insurance Act",
      "C - Occupational Health and Safety Act",
      "D - Labour Relations Act",
      "1 - Hours of work, leave and overtime",
      "2 - Benefits for workers who lose their jobs",
      "3 - Safe working conditions and protective gear",
      "4 - Relations between employers and unions"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "production_factors",
    "topic": "labour_legislation",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.7",
      "marks": 2,
      "clues": "- This is a plan of action.\n- It is made to recognise and deal with risks.",
      "approach": "- Recall the terms linked to risk management.\n- Match the description.",
      "solution": "1. A plan of action by the farmer to recognise and deal with risks is strategic risk management: B."
    },
    {
      "number": "1.1.8",
      "marks": 2,
      "clues": "- Think about who pays into the fund.\n- Discrimination is covered by a different Act.",
      "approach": "- Recall what the Unemployment Insurance Act covers.\n- Test statements (i)–(iv).",
      "solution": "1. Employer and employee both contribute (i), it provides security if workers become unemployed (ii) and it addresses the effects of unemployment (iv).\n2. Protection from unfair discrimination is not covered by this Act (iii), so the answer is D."
    },
    {
      "number": "1.2.4",
      "marks": 2,
      "clues": "- The farmer spreads the investment.\n- It is a strategy across several enterprises.",
      "approach": "- Read the description.\n- Match it to the term in Column B.",
      "solution": "1. Spreading the investment over several enterprises is diversification: C."
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
