#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 5: Preventing abuse of market power (order 27)
 * Lesson 27 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 5: Preventing abuse of market power. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l27.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l27.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l27.js
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
  "name": "Question 5: Preventing abuse of market power",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 27,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "competition_policy",
    "monopoly_market"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q27/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q27/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the measures government can use to prevent dominant businesses from abusing market power.",
    "metadata": [
      "Regulating the prices of monopolies",
      "Reducing barriers to entry such as patents and licences",
      "Prohibiting mergers that create monopolies",
      "Penalising dominant firms that abuse their power",
      "Granting new monopolies to private firms"
    ],
    "answer": [
      "Regulating the prices of monopolies",
      "Reducing barriers to entry such as patents and licences",
      "Prohibiting mergers that create monopolies",
      "Penalising dominant firms that abuse their power",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Measures either control behaviour or restore competition.\n- One option does the opposite."
  },
  {
    "name": "Question 2",
    "question": "Which body regulates the price of electricity supplied by Eskom?",
    "metadata": [
      "The Competition Tribunal",
      "The Competition Appeal Court",
      "The Reserve Bank",
      "The National Energy Regulator (NERSA)",
      ""
    ],
    "answer": [
      "The National Energy Regulator (NERSA)",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
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
    "paper": "nov_p2",
    "clues": "- The regulator is named for the industry it supervises."
  },
  {
    "name": "Question 3",
    "question": "Match each competition institution to its role.",
    "metadata": [
      "A - Competition Commission",
      "B - Competition Tribunal",
      "C - Competition Appeal Court",
      "1 - Investigates anti-competitive behaviour",
      "2 - Hears cases and imposes penalties",
      "3 - Hears appeals against Tribunal decisions"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The three institutions work in sequence: investigate, decide, appeal."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 10,
      "clues": "- A \"how can\" question needs measures with their effect, not a list of names.\n- Mere listing earns at most 2 of the 10 marks.",
      "approach": "- Choose several measures: price regulation, lower barriers, private investment, competition policy, penalties and merger control.\n- Explain how each limits market power.",
      "solution": "1. Regulating prices, for example NERSA for Eskom, prevents excessively high prices.\n2. Removing barriers such as patents and licences attracts new businesses and raises competition.\n3. Encouraging private investment reduces the dominance of state monopolies.\n4. Competition policy through the Commission, Tribunal and Appeal Court promotes fair competition; the Tribunal penalises abuse and mergers that create monopolies can be prohibited (max 10)."
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
