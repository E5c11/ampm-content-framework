#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 4.2.1–4.2.3: Business cycle table (order 19)
 * Lesson 19 of 2024 Nov P1 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l19.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l19.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l19.js
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
  "name": "Question 4.2.1–4.2.3: Business cycle table",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 19,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "business_cycle_explanations",
    "economic_indicators"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q19/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q19/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the table (illustrative): Upswing 1: Mar 2001 to Jun 2008 (87 months); Downswing 1: Jul 2008 to Feb 2010 (20 months); Upswing 2: Mar 2010 to Sep 2014 (55 months); Downswing 2: Oct 2014 to Aug 2016 (23 months). Identify the period of the longest downswing.",
    "metadata": [
      "Mar 2001 to Jun 2008",
      "Jul 2008 to Feb 2010",
      "Oct 2014 to Aug 2016",
      "Mar 2010 to Sep 2014",
      ""
    ],
    "answer": [
      "Oct 2014 to Aug 2016",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "reading",
    "unit": "business_cycles",
    "topic": "cycle_indicators",
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
    "clues": "- Only the downswing rows count.\n- Compare the durations in months."
  },
  {
    "name": "Question 2",
    "question": "Study the table (illustrative): Upswing 1: Mar 2001 to Jun 2008 (87 months); Downswing 1: Jul 2008 to Feb 2010 (20 months); Upswing 2: Mar 2010 to Sep 2014 (55 months); Downswing 2: Oct 2014 to Aug 2016 (23 months). By how many months was the first upswing longer than the second upswing? []",
    "metadata": [
      "Difference (months) = ",
      "[ ]"
    ],
    "answer": [
      "32",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "business_cycles",
    "topic": "cycle_indicators",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Read the two upswing durations and subtract the smaller from the larger."
  },
  {
    "name": "Question 3",
    "question": "At which turning point of the business cycle is inflation usually at its highest?",
    "metadata": [
      "Trough",
      "Peak",
      "Recovery",
      "Depression",
      ""
    ],
    "answer": [
      "Peak",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "business_cycles",
    "topic": "business_cycle_explanations",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Inflation builds up while demand is strongest.\n- Decide whether that happens at the highest or lowest point."
  },
  {
    "name": "Question 4",
    "question": "Match each business cycle term to its meaning.",
    "metadata": [
      "A - Peak",
      "B - Trough",
      "C - Amplitude",
      "D - Duration",
      "1 - The vertical distance between a peak and the next trough",
      "2 - The highest point of the cycle",
      "3 - The length of time a phase of the cycle lasts",
      "4 - The lowest point of the cycle"
    ],
    "answer": [
      "A-2",
      "B-4",
      "C-1",
      "D-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "business_cycles",
    "topic": "business_cycle_explanations",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Two terms are turning points, one is about height and one is about time."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.1",
      "marks": 1,
      "clues": "- Compare the downswing durations in the table.",
      "approach": "- Identify the period.",
      "solution": "The longest downswing was December 2013 to April 2017."
    },
    {
      "number": "4.2.2",
      "marks": 1,
      "clues": "- Think about the turning point where demand is highest.",
      "approach": "- Name the turning point.",
      "solution": "The peak."
    },
    {
      "number": "4.2.3",
      "marks": 2,
      "clues": "- Think about vertical distance between turning points.",
      "approach": "- Describe the term.",
      "solution": "Amplitude is the vertical difference between a trough and the next peak, or a peak and the next trough, of a business cycle."
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
