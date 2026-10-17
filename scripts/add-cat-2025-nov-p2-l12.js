#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 7.4–7.5: Big data privacy and software piracy (order 12)
 * Question 7.4 and 7.5 — privacy issues of big data for individuals and the long-term impact of software piracy.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l12.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l12.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l12.js
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
  "name": "Question 7.4–7.5: Big data privacy and software piracy",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "big_data_privacy",
    "software_piracy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q12/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q12/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q12/memo_2.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which TWO are privacy issues for individuals when businesses use their information in big data?",
    "metadata": [
      "Data is stored in a secure database",
      "Data is collected without the person's consent",
      "Data is analysed by a computer program",
      "Data is shared with third parties",
      "Data is displayed in charts and graphs"
    ],
    "answer": [
      "Data is collected without the person's consent",
      "Data is shared with third parties",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "social_implications",
    "topic": "privacy_and_data",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "Which is a long-term impact of software piracy on the global software industry?",
    "metadata": [
      "Software becomes cheaper for every buyer for ever after",
      "Companies lose income, so prices may rise for honest buyers",
      "Developers earn much more money from every copy that is made",
      "Pirated copies receive free technical support for life",
      ""
    ],
    "answer": [
      "Companies lose income, so prices may rise for honest buyers",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "social_implications",
    "topic": "legal_and_ethical_issues",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application",
    "clues": "- Think about who pays when copies are made illegally.\n- Honest buyers are affected too."
  },
  {
    "name": "Question 3",
    "question": "Match each term to the description that fits it.",
    "metadata": [
      "A - Big data",
      "B - Software piracy",
      "C - Copyright",
      "D - Licence",
      "1 - Illegal copying or use of software",
      "2 - Legal protection of the creator's work",
      "3 - Permission to use software under agreed terms",
      "4 - Very large sets of data analysed to find patterns"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "social_implications",
    "topic": "legal_and_ethical_issues",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "7.4",
      "marks": 2,
      "clues": "- Big data uses information about many people.\n- Think about consent and sharing.",
      "approach": "- Describe two privacy issues for the individual.",
      "solution": "1. Excessive personal data is collected without the individual's consent.\n2. Personal data is shared with third parties.\n3. Accepted: detailed profiles are created, or activities are monitored without knowledge."
    },
    {
      "number": "7.5",
      "marks": 2,
      "clues": "- The impact is on the global software industry.\n- Think about money and security.",
      "approach": "- Explain two long-term impacts.",
      "solution": "1. Financial losses: reduced revenue and higher prices for legitimate users.\n2. Security risks, no technical support, or no updates and upgrades for pirated copies."
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
