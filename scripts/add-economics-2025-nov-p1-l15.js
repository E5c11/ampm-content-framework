#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 3.4: BBBEE and the NSDS (order 15)
 * Lesson 15 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 3.4: BBBEE and the NSDS. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l15.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l15.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l15.js
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
  "name": "Question 3.4: BBBEE and the NSDS",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "redress_policies"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q15/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q15/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each South African initiative to its main purpose.",
    "metadata": [
      "A - Broad-Based Black Economic Empowerment (B-BBEE)",
      "B - National Skills Development Strategy (NSDS)",
      "C - Sector Education and Training Authorities (SETAs)",
      "1 - Promote inclusive participation in the economy to redress historical inequalities",
      "2 - Improve the skills of the labour force to reduce unemployment and promote equity",
      "3 - Help to facilitate skills training in particular economic sectors"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "redress_and_skills_policies",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- One initiative is about ownership and participation, and two are about training.\n- Of the two skills items, one is a national strategy and the other is a type of body."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which B-BBEE promotes growth and development.",
    "metadata": [
      "Export subsidies for all firms",
      "Preferential procurement",
      "Skills development",
      "Enterprise development",
      "Fixed minimum prices"
    ],
    "answer": [
      "Preferential procurement",
      "Enterprise development",
      "Skills development",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "redress_and_skills_policies",
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
    "clues": "- B-BBEE focuses on how businesses buy, develop and train.\n- Two options are general trade or pricing tools unrelated to empowerment."
  },
  {
    "name": "Question 3",
    "question": "Which of the following best describes the main aim of the National Skills Development Strategy (NSDS)?",
    "metadata": [
      "To set the interest rate charged by commercial banks",
      "To control the prices of many goods that are imported",
      "To collect more tax revenue from the largest companies",
      "To raise the skills of workers so unemployment falls",
      ""
    ],
    "answer": [
      "To raise the skills of workers so unemployment falls",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "redress_and_skills_policies",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The name of the strategy points to what it develops."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.4",
      "marks": 8,
      "clues": "- Give two developed points on each policy.\n- A bare list of facts is capped at 4 marks.",
      "approach": "- Describe the aim of B-BBEE and how it works.\n- Describe the aim of the NSDS and how it works.\n- Develop each point with a reason or an effect.",
      "solution": "1. B-BBEE promotes inclusive participation of black South Africans in the economy to address historical inequalities and gives a legal basis for transformation.\n2. Its objectives include redress and affirmative action, using preferential procurement, enterprise development, skills development and ownership and management promotion.\n3. The NSDS aims to improve the skills of the labour force to meet economic needs, reduce unemployment and promote equity.\n4. It identifies skills in high demand, works through partnerships with institutions, employers and SETAs, and targets historically disadvantaged groups."
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
