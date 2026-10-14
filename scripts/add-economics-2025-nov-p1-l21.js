#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 4.3.4: Infrastructure and living standards (order 21)
 * Lesson 21 of the 2025 Nov P1 repair (DESIGN-UNI-14: 2 practice questions). Question 4.3.4: Infrastructure and living standards. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l21.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l21.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l21.js
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
  "name": "Question 4.3.4: Infrastructure and living standards",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 21,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "public_works"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q21/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q21/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q21/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the ways in which poor infrastructure can slow down economic growth.",
    "metadata": [
      "Ageing roads disrupt the distribution of inputs and final goods",
      "High operating costs discourage domestic and foreign investment",
      "Unreliable energy supply forces businesses to produce less",
      "It lowers the cost of doing business",
      "It attracts more investors to the area"
    ],
    "answer": [
      "Ageing roads disrupt the distribution of inputs and final goods",
      "High operating costs discourage domestic and foreign investment",
      "Unreliable energy supply forces businesses to produce less",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "infrastructure_and_growth",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Infrastructure carries goods, power and communication for businesses.\n- Two options describe the effect of good infrastructure."
  },
  {
    "name": "Question 2",
    "question": "Match each feature of a public works programme to the way it helps raise living standards.",
    "metadata": [
      "A - Temporary jobs",
      "B - Training for participants",
      "C - Income plus new skills",
      "1 - Gives poor households a source of income",
      "2 - Builds skills that can lead to permanent jobs",
      "3 - Lets households start small businesses and so reduces poverty"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "public_works_and_development_policy",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Each feature has a direct, distinct benefit for a household.\n- The third pair combines the first two to reach a longer-term outcome."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.3.4",
      "marks": 2,
      "clues": "- Think about transport, energy and the cost of operating a business.",
      "approach": "- Choose one effect of poor infrastructure.\n- Link it to growth.",
      "solution": "1. Poor infrastructure such as ageing roads disrupts the distribution of inputs and goods, lowering production and growth.\n2. It also discourages investment because operating costs are higher, and poor energy supply forces businesses to produce less."
    },
    {
      "number": "4.3.5",
      "marks": 4,
      "clues": "- Consider income, skills and small businesses.",
      "approach": "- Give two distinct ways.\n- Explain each (2 x 2).",
      "solution": "1. The EPWP provides temporary employment, which creates income for disadvantaged households.\n2. It offers skills development so participants can be absorbed into the labour market.\n3. It contributes to poverty alleviation by helping households to start small businesses with the skills acquired."
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
