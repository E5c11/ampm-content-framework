#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 2.3.5 and 2.4: Market efficiency and objectives (order 9)
 * Lesson 9 of the 2025 Nov P1 repair (DESIGN-UNI-14: 4 practice questions). Question 2.3.5 and 2.4: Market efficiency and objectives. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l09.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l09.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l09.js
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
  "name": "Question 2.3.5 and 2.4: Market efficiency and objectives",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 12,
  "tags": [
    "macroeconomic_objectives",
    "economic_indicators"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q9/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q9/memo_2.png"
  ],
  "exam_question_marks": 12,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which statement best describes the new economic paradigm in relation to business cycles?",
    "metadata": [
      "Business cycles are left entirely to market forces and never need smoothing",
      "Demand-side and supply-side policies are combined to smooth the cycle and allow growth without inflation",
      "Only monetary policy is used to prevent every recession",
      "Cycles are caused only by shocks from outside the economy",
      ""
    ],
    "answer": [
      "Demand-side and supply-side policies are combined to smooth the cycle and allow growth without inflation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "business_cycles",
    "topic": "business_cycle_policy",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The word \"paradigm\" refers to the way policy-makers think about the problem.\n- The approach uses more than one kind of policy at once."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the measures government can use to improve the efficiency of markets.",
    "metadata": [
      "Remove unnecessary regulations that make markets inflexible",
      "Encourage competition by welcoming new firms and foreign investment",
      "Level the playing field so that no business is unfairly disadvantaged",
      "Give one firm exclusive rights to dominate a market",
      "Fix minimum prices on all goods"
    ],
    "answer": [
      "Remove unnecessary regulations that make markets inflexible",
      "Encourage competition by welcoming new firms and foreign investment",
      "Level the playing field so that no business is unfairly disadvantaged",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "public_sector",
    "topic": "market_efficiency_measures",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Efficient markets need flexibility and rivalry between firms.\n- Two of the options reduce competition or distort prices."
  },
  {
    "name": "Question 3",
    "question": "Arrange these measures to promote full employment from the one with the quickest effect to the one that takes longest.",
    "metadata": [
      "Support for knowledge-intensive sectors and better education and training",
      "Direct employment schemes and youth employment subsidies",
      "Support for labour-intensive activities such as agriculture, and investment incentives for manufacturing"
    ],
    "answer": [
      "Direct employment schemes and youth employment subsidies",
      "Support for labour-intensive activities such as agriculture, and investment incentives for manufacturing",
      "Support for knowledge-intensive sectors and better education and training"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "public_sector",
    "topic": "macroeconomic_objectives",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about how long each measure takes to create or prepare people for jobs.\n- Changing the skills of the future labour force takes the longest."
  },
  {
    "name": "Question 4",
    "question": "A country’s Gini coefficient is 0,62. What does this value suggest about economic equity?",
    "metadata": [
      "Income is fairly equally distributed",
      "Income is very unequally distributed",
      "Everyone earns the same income",
      "The country has no poverty",
      ""
    ],
    "answer": [
      "Income is very unequally distributed",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "economic_and_social_indicators",
    "topic": "income_inequality_measures",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The coefficient lies between 0 and 1; the higher the value, the further income is from an equal split.\n- A value below 0,5 is regarded as relatively equal."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3.5",
      "marks": 4,
      "clues": "- Think about removing obstacles and encouraging rivalry between firms.",
      "approach": "- Give two distinct measures.\n- Develop each into a full sentence, since the question is worth 2 x 2.",
      "solution": "1. Deregulation: government removes laws and regulations that limit market flexibility.\n2. Competition: government encourages new businesses and foreign direct investment, and removes power imbalances.\n3. Levelling the playing field: all market participants get equal opportunities, so no firm is unfairly disadvantaged.\n4. Any two of these, each explained, earn the 4 marks."
    },
    {
      "number": "2.4",
      "marks": 8,
      "clues": "- Treat the two objectives separately and give two developed points for each.\n- Avoid simply listing facts, since a mere list is capped.",
      "approach": "- Define each objective in a line.\n- Add developed points: short, medium and long-term actions for employment, and income redistribution tools for equity.\n- Use the Gini coefficient as evidence for equity.",
      "solution": "1. Full employment: everyone who wants a job can find one; government aims for decent and sustainable jobs, and employment is measured as a percentage of the economically active population.\n2. Short term: direct employment schemes and subsidies; medium term: support for labour-intensive activities and incentives to industries employing many people; long term: knowledge-intensive sectors and better education.\n3. Economic equity: resources are fairly distributed; a Gini coefficient below 0,5 is more equal, while South Africa is above 0,6.\n4. The progressive tax system, free basic education and health care, social grants and subsidies redistribute income.\n5. A maximum of 4 marks may be awarded for mere listing."
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
