#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 8.1: Solar-powered airports (order 19)
 * Question 8.1.1–8.1.3 — the meaning of solar power, the pillars of sustainability, and the advantages of solar power for airports.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l19.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l19.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l19.js
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
  "name": "Question 8.1: Solar-powered airports",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 19,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "solar_power",
    "three_pillars"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q19/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q19/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What is solar power?",
    "metadata": [
      "Electricity generated from the movement of wind",
      "Electricity generated from burning coal or gas",
      "Electricity generated from fast-flowing water",
      "Electricity generated from the energy of sunlight",
      ""
    ],
    "answer": [
      "Electricity generated from the energy of sunlight",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "sustainable_responsible_tourism",
    "topic": "environmental_practices",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "An airport switches to solar power and so cuts air pollution. Which pillar of sustainability does this mainly support?",
    "metadata": [
      "Social",
      "Environmental",
      "Political",
      "Cultural",
      ""
    ],
    "answer": [
      "Environmental",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "sustainable_responsible_tourism",
    "topic": "three_pillars",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Match each pillar of sustainability to an example at a solar-powered airport.",
    "metadata": [
      "A - Economic pillar",
      "B - Social pillar",
      "C - Environmental pillar",
      "1 - Training local people as solar technicians",
      "2 - Less air pollution from coal power",
      "3 - Lower electricity costs for the airport"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2"
    ],
    "presentation": "match",
    "unit": "sustainable_responsible_tourism",
    "topic": "three_pillars",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the advantages for an airport of using solar power.",
    "metadata": [
      "It increases the airport's use of coal",
      "It works best at night when it is dark",
      "Operations continue during load shedding",
      "It lowers the airport's carbon footprint",
      "It raises the monthly electricity bill"
    ],
    "answer": [
      "Operations continue during load shedding",
      "It lowers the airport's carbon footprint",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "sustainable_responsible_tourism",
    "topic": "environmental_practices",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "8.1.1",
      "marks": 2,
      "clues": "- Think about where the energy comes from.",
      "approach": "- Name the energy source.\n- Say what it is turned into.",
      "solution": "1. Solar power uses sunlight to generate electricity; solar panels capture sunlight and convert it into electricity."
    },
    {
      "number": "8.1.2",
      "marks": 4,
      "clues": "- There are three pillars: people, planet and profit.\n- Do not repeat the pillar from (a) in (b).",
      "approach": "- (a) Choose the pillar that solar power supports.\n- (b) Name the other two pillars.",
      "solution": "1. (a) Environmental (planet); economic (profit) is also accepted.\n2. (b) Social (people) and economic (profit), or social and environmental if (a) was economic."
    },
    {
      "number": "8.1.3",
      "marks": 4,
      "clues": "- Think about the environment and electricity supply.\n- Solar energy is renewable.",
      "approach": "- Give two advantages of solar power for airports.\n- Explain each one.",
      "solution": "1. It reduces the impact on the environment and the carbon footprint.\n2. Sunlight is a vast, renewable and cost-effective resource; operations are not affected by load shedding."
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
