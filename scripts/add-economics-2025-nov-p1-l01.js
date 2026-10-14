#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 1.1.1–1.1.4: Cycles, multiplier and trade (order 1)
 * Lesson 1 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 1.1.1–1.1.4: Cycles, multiplier and trade. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l01.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l01.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l01.js
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
  "name": "Question 1.1.1–1.1.4: Cycles, multiplier and trade",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "business_cycles",
    "multiplier",
    "international_trade"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q1/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q1/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Economist Ayanda argues that a recent downturn began because banks lent too freely and households became over-indebted, so the slump grew out of the economy's own financial behaviour. Which kind of business cycle explanation is she giving?",
    "metadata": [
      "An exogenous explanation",
      "A new economic paradigm explanation",
      "An endogenous explanation",
      "A balance of payments explanation",
      ""
    ],
    "answer": [
      "An endogenous explanation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "business_cycles",
    "topic": "business_cycle_explanations",
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
    "clues": "- Ask whether the cause lies within the economic system or arrives from outside it.\n- Lending and borrowing are decisions made by participants in the economy itself."
  },
  {
    "name": "Question 2",
    "question": "In a two-sector economy the marginal propensity to save (mps) is 0.25. Work out the marginal propensity to consume (mpc): []",
    "metadata": [
      "mpc = ",
      "[ ]"
    ],
    "answer": [
      "0.75",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "circular_flow",
    "topic": "multiplier",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Every extra rand of income is either spent or saved.\n- Take the saved share away from the whole."
  },
  {
    "name": "Question 3",
    "question": "In one day, Country P can produce either 10 chairs or 20 tables, and Country Q can produce either 8 chairs or 10 tables, using the same inputs. Which statement is correct?",
    "metadata": [
      "P has an absolute advantage in both goods, and a comparative advantage in chairs",
      "Q has an absolute advantage in chairs, and a comparative advantage in tables",
      "Neither country can gain from trade, because P is better at making both goods",
      "P has an absolute advantage in both goods, and Q has a comparative advantage in chairs",
      ""
    ],
    "answer": [
      "P has an absolute advantage in both goods, and Q has a comparative advantage in chairs",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "protection_and_free_trade",
    "topic": "comparative_advantage",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Compare total output first for absolute advantage, then work out what each country gives up per chair.\n- The country that gives up fewer tables per chair has the comparative advantage in chairs."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- Decide whether the cause of the fluctuation sits inside the market system or outside it.",
      "approach": "- Read the words \"forces inside the market system\".\n- Match the origin of the cycle to the explanation that blames internal forces.",
      "solution": "1. The question describes fluctuations caused by forces inside the market system.\n2. Explanations that blame internal forces are called endogenous, so option A is correct.\n3. Exogenous explanations blame outside shocks, so B is wrong; the other two options name approaches rather than a place of origin."
    },
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- Think about what a household can do with an extra rand of income.",
      "approach": "- Recall that the propensities describe the shares of extra income spent and saved.\n- Add the two shares together.",
      "solution": "1. In a two-sector model, additional income is either consumed or saved.\n2. So mpc + mps accounts for the whole additional rand and equals 1.\n3. The answer is B."
    },
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Look for the cause that describes rules coming before service.",
      "approach": "- Pick out the key phrase: too many rules and procedures at the cost of service.\n- Match it to the public sector failure cause with that meaning.",
      "solution": "1. Excessive rules and procedures that slow service delivery are known as bureaucracy.\n2. The answer is D; apathy is a lack of concern, rent seeking is using power to gain for oneself, and efficiency is the opposite of the problem described."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- Compare output from the same inputs, not the cost of giving up something else.",
      "approach": "- Notice the phrase \"more output with the same input\".\n- Choose the advantage that is based on absolute productivity.",
      "solution": "1. Producing more output than other countries from the same inputs is an absolute advantage.\n2. Comparative advantage is about lower opportunity cost, so D is wrong; the answer is C."
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
