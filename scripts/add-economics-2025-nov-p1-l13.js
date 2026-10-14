#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 3.2.4: Population and clean water (order 13)
 * Lesson 13 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 3.2.4: Population and clean water. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l13.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l13.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l13.js
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
  "name": "Question 3.2.4: Population and clean water",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 13,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "social_indicators"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q13/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q13/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q13/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the possible effects of a rapidly growing working-age population on a country’s labour force.",
    "metadata": [
      "Unemployment may rise if too few jobs are created",
      "A bigger supply of labour can push wages down",
      "The labour force automatically shrinks",
      "More people are available to work",
      "The variety of skills in the labour market disappears"
    ],
    "answer": [
      "More people are available to work",
      "A bigger supply of labour can push wages down",
      "Unemployment may rise if too few jobs are created",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "economic_and_social_indicators",
    "topic": "population_and_labour_force",
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
    "clues": "- Think about both the supply of workers and the demand for them.\n- Two options contradict the idea of a growing population."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which access to clean water can improve a country’s economic performance.",
    "metadata": [
      "A reliable water supply attracts investors to the country",
      "Clean water reduces the productivity of the labour force",
      "More regular school attendance builds a skilled workforce",
      "Fewer water-borne illnesses keep workers productive",
      "Clean water raises the number of water-borne diseases"
    ],
    "answer": [
      "Fewer water-borne illnesses keep workers productive",
      "More regular school attendance builds a skilled workforce",
      "A reliable water supply attracts investors to the country",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
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
    "clues": "- Link water to health, education and the business environment.\n- Two options describe problems that clean water would reduce, not cause."
  },
  {
    "name": "Question 3",
    "question": "Which of the following is an example of sanitation provision?",
    "metadata": [
      "A regular bus service that carries commuters to work",
      "A sewerage system that safely disposes of household waste",
      "A network of street lights along the main roads of towns",
      "A feeding scheme that provides meals at public schools",
      ""
    ],
    "answer": [
      "A sewerage system that safely disposes of household waste",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Sanitation protects health through the safe handling of human waste."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2.4",
      "marks": 2,
      "clues": "- Think about both the supply of workers and whether jobs exist for them.",
      "approach": "- Say how the labour force changes.\n- Add one consequence for wages or unemployment.",
      "solution": "1. An increase in population raises the number of people available to work, which enlarges the labour force.\n2. A larger supply of labour may lower wages, bring more skills and experience, and may increase unemployment if jobs are too few."
    },
    {
      "number": "3.2.5",
      "marks": 4,
      "clues": "- Link water to health, education and investment, then develop two points.",
      "approach": "- Choose two distinct benefits.\n- Explain each through to its economic effect (2 x 2).",
      "solution": "1. Clean water prevents disease, so workers stay healthy, sick days fall and productivity rises.\n2. Access to clean water supports regular school attendance, which builds a better-educated workforce with higher earning potential.\n3. Reliable water may also attract tourists and investors, increasing economic activity."
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
