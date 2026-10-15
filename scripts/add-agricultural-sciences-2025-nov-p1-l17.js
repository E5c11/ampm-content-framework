#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 4.5–4.6: Detecting oestrus and timing artificial insemination (order 17)
 * Question 4.5–4.6 — aids for detecting oestrus in cattle, signs of heat, the correct time for artificial insemination and the steps in the AI procedure. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l17.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l17.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l17.js
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
  "name": "Question 4.5–4.6: Detecting oestrus and timing artificial insemination",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 5,
  "tags": [
    "oestrus_detection",
    "artificial_insemination_timing",
    "heat_detection_aids"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q17/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q17/memo_1.png"
  ],
  "exam_question_marks": 5,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each aid for detecting oestrus in cattle to how it works.",
    "metadata": [
      "A - Pedometer",
      "B - Tail chalking",
      "C - Teaser bull",
      "D - Heat-mount detector",
      "1 - Records a spike in the cow’s movement",
      "2 - Chalk rubs off when other cows mount her",
      "3 - Shows interest in cows that are on heat",
      "4 - Changes colour under pressure from a mounting cow"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "oestrus_detection",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1"
  },
  {
    "name": "Question 2",
    "question": "Select ALL the signs that a cow is in oestrus (on heat).",
    "metadata": [
      "Lies apart from the herd and refuses feed",
      "Is restless and bellows",
      "Has a persistent cough and a nasal discharge",
      "Has a clear mucus discharge from the vulva",
      "Stands still when other cows mount her"
    ],
    "answer": [
      "Stands still when other cows mount her",
      "Is restless and bellows",
      "Has a clear mucus discharge from the vulva",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "oestrus_detection",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Two of the options are signs of illness, not of heat."
  },
  {
    "name": "Question 3",
    "question": "A farmer sees a cow standing on heat at 07:00. When should she be artificially inseminated?",
    "metadata": [
      "At once, while she is still standing",
      "The same evening, about 12 hours later",
      "Three days later",
      "During her next heat, 21 days later",
      ""
    ],
    "answer": [
      "The same evening, about 12 hours later",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "semen_and_artificial_insemination",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The ovum is released some hours after the first signs of heat."
  },
  {
    "name": "Question 4",
    "question": "Arrange the steps in the artificial insemination of a cow in the correct order.",
    "metadata": [
      "Deposit the semen in the body of the uterus",
      "Detect that the cow is on heat",
      "Thaw the straw of semen in warm water",
      "Pass the insemination gun through the cervix"
    ],
    "answer": [
      "Detect that the cow is on heat",
      "Thaw the straw of semen in warm water",
      "Pass the insemination gun through the cervix",
      "Deposit the semen in the body of the uterus"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "animal_reproduction",
    "topic": "semen_and_artificial_insemination",
    "subtopic": "agri_process_sequence",
    "skills": [
      "sequence_agricultural_process"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.5.1",
      "marks": 2,
      "clues": "- Think about what changes in a cow in heat.\n- The apparatus records two things.",
      "approach": "- Describe what the pedometer records.\n- Link it to the behaviour of a cow in oestrus.",
      "solution": "1. The apparatus records a spike in movement and temperature.\n2. This shows restlessness, which is caused by oestrus."
    },
    {
      "number": "4.5.2",
      "marks": 2,
      "clues": "- Think about what other cows do to a cow on heat.\n- Chalk is applied at the base of the tail.",
      "approach": "- Describe where the chalk is applied.\n- Explain what happens when the cow is in oestrus.",
      "solution": "1. The chalk or marker rubs off the cow in oestrus.\n2. It rubs off because other cows mount her."
    },
    {
      "number": "4.6",
      "marks": 1,
      "clues": "- The ovum is released some hours after the start of heat.\n- Insemination is timed about 12 hours after the signs of heat.",
      "approach": "- Note the time the signs of heat were seen.\n- Apply the timing rule for artificial insemination.",
      "solution": "1. The cow should be inseminated early the next morning, about 12 hours after the signs of oestrus."
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
