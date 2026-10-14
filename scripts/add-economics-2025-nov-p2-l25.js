#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 5: Characteristics of a monopoly (order 25)
 * Lesson 25 of 2025 Nov P2 (DESIGN-UNI-14: 4 practice questions). Question 5: Characteristics of a monopoly. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l25.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l25.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l25.js
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
  "name": "Question 5: Characteristics of a monopoly",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 25,
  "content_tier": "free",
  "has_video": false,
  "xp": 22,
  "tags": [
    "monopoly_market",
    "market_structures"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q25/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q25/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q25/memo_2.png"
  ],
  "exam_question_marks": 22,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each feature of a monopoly to how it appears in the market.",
    "metadata": [
      "A - Number of firms",
      "B - Nature of the product",
      "C - Market entry",
      "D - Control over price",
      "1 - One supplier of the product",
      "2 - Unique, with no close substitutes",
      "3 - Blocked by barriers to entry",
      "4 - The firm is a price-maker"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "imperfect_markets",
    "topic": "monopoly",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Each left item is a feature of a market structure; the right items show how a monopoly differs."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the features of a natural monopoly.",
    "metadata": [
      "High development costs, such as power stations",
      "It is usually regulated by the government",
      "Many competing firms share the market equally",
      "Entry is blocked mainly by a patent held by the firm",
      "One firm can serve the market at a lower cost"
    ],
    "answer": [
      "High development costs, such as power stations",
      "One firm can serve the market at a lower cost",
      "It is usually regulated by the government",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "imperfect_markets",
    "topic": "monopoly",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- A natural monopoly arises from the economics of production itself.\n- Two statements describe artificial monopolies or competition."
  },
  {
    "name": "Question 3",
    "question": "A pharmaceutical firm holds a 20-year patent on a new medicine and no one else may produce it. What type of monopoly is this?",
    "metadata": [
      "A perfectly competitive firm",
      "A natural monopoly",
      "An artificial monopoly",
      "An oligopoly",
      ""
    ],
    "answer": [
      "An artificial monopoly",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "monopoly",
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
    "paper": "nov_p2",
    "clues": "- The barrier is created by law, not by production costs."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the true statements about the efficiency of a monopoly.",
    "metadata": [
      "It produces where price equals marginal cost",
      "It does not produce at the lowest possible average cost",
      "It achieves allocative efficiency",
      "The quantity it produces does not match what consumers demand",
      "Its price is above marginal cost"
    ],
    "answer": [
      "It does not produce at the lowest possible average cost",
      "The quantity it produces does not match what consumers demand",
      "Its price is above marginal cost",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "monopoly",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Compare the monopoly’s output with the efficient output.\n- Two statements describe an efficient market."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 22,
      "clues": "- Give each feature of a monopoly its own heading with developed points.\n- Headings and examples can earn at most 8 of the 26 main-part marks.",
      "approach": "- Cover number of firms, nature of product, entry, price control, information and the demand curve.\n- Distinguish natural and artificial monopolies with examples.\n- Add decision making, collusion, economic profit or loss, and efficiency.",
      "solution": "1. Number of firms: a single supplier responsible for total output, for example Eskom for thermal electricity.\n2. Product and demand: unique product with no close substitutes, relatively inelastic demand; the demand curve slopes downward and equals AR, with MR below it.\n3. Entry: completely blocked by barriers; natural monopolies from high development costs, artificial monopolies from patents and licences.\n4. Price: the monopolist is a price-maker and may restrict output, although limited by market demand and consumers’ budgets.\n5. Information, decisions and collusion: information may be incomplete, decisions are independent, and collusion is irrelevant.\n6. Efficiency: no productive or allocative efficiency, and price is above marginal cost (max 22 of the 26 main-part marks)."
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
