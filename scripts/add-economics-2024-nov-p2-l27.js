#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 5: Oligopoly — kinked demand, collusion and efficiency (order 27)
 * Lesson 27 of 2024 Nov P2 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l27.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l27.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l27.js
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
  "name": "Question 5: Oligopoly — kinked demand, collusion and efficiency",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 27,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "oligopoly",
    "kinked_demand",
    "collusion"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q27/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q27/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q27/memo_2.png"
  ],
  "exam_question_marks": 13,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the graph (illustrative). Which segment of the oligopolist’s demand curve is elastic?",
    "metadata": [
      "Segment 2, below the kink",
      "Segment 1, above the kink",
      "both segments",
      "neither segment",
      ""
    ],
    "answer": [
      "Segment 1, above the kink",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- If one firm raises its price, rivals do not follow and it loses many customers.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p2/q27/diagram_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Study the graph. At which price will an oligopolist tend to keep its price, according to the kinked demand curve model?",
    "metadata": [
      "at the lowest price possible",
      "below the kink price",
      "above the kink price",
      "at the kink price",
      ""
    ],
    "answer": [
      "at the kink price",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Raising or lowering the price both leave the firm worse off.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p2/q27/diagram_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Select ALL the statements that are true about collusion in oligopoly.",
    "metadata": [
      "It is a law that forces firms to compete",
      "It is an agreement to reduce competition",
      "A cartel is a formal collusion",
      "Price leadership is informal collusion",
      "It always raises the number of firms"
    ],
    "answer": [
      "It is an agreement to reduce competition",
      "A cartel is a formal collusion",
      "Price leadership is informal collusion",
      "",
      ""
    ],
    "presentation": "multi_select",
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
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Collusion means firms in the same industry co-operating instead of competing."
  },
  {
    "name": "Question 4",
    "question": "Match each feature of oligopoly to how it works.",
    "metadata": [
      "A - Formal collusion",
      "B - Informal collusion",
      "C - Non-price competition",
      "1 - Firms compete with branding and advertising instead of price cuts",
      "2 - A cartel agreeing on prices",
      "3 - One firm sets the price and the others follow"
    ],
    "answer": [
      "A-2",
      "B-3",
      "C-1"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- One feature is an open agreement, one is an unspoken understanding and one avoids price changes."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 13,
      "clues": "- Cover control over price, mutual dependence, the kinked demand curve, collusion, non-price competition, profit and efficiency.",
      "approach": "- Explain each in full sentences; at most 8 of the 26 marks may be given for headings and examples.",
      "solution": "1. Oligopolies have considerable control over price, especially through price leadership and cartels; each depends on the others' actions.\n2. The kinked demand curve: elastic above the kink (rivals do not follow a price rise), inelastic below it (rivals follow a price cut), so the price stays at the kink.\n3. Formal collusion (cartels such as OPEC) and informal collusion (price leadership); firms prefer non-price competition such as branding and advertising.\n4. Economic profit is possible in the short and long run; neither allocative nor productive efficiency is achieved."
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
