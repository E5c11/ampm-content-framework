#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 5 (order 5)
 * Section C essay (Macroeconomics): the four markets of the circular flow and the business sector's contribution to development.
 * DESIGN-ECON-06: no free text anywhere. Content items follow the memo's main-part headings and additional-part (DESIGN-ECON-02);
 * essay-strategy items follow the PRINTED rubric (introduction max 2, main part max 26 with <= 8 for headings/examples, additional
 * part max 10 with <= 2 for mere listing, conclusion max 2). The memo's model prose is paraphrased, never quoted.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-q5.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-q5.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-q5.js
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
  "name": "Question 5",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "circular_flow_markets",
    "financial_markets",
    "business_sector",
    "essay_structure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q5/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q5/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q5/memo_3.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each market in the four-sector circular flow to what is exchanged in it.",
    "metadata": [
      "A - Goods market",
      "B - Factor market",
      "C - Financial market",
      "D - Foreign exchange market",
      "1 - Consumer and capital goods and services",
      "2 - Land, labour, capital and entrepreneurship",
      "3 - Surplus savings, lent to those who need funds",
      "4 - The currencies of different countries"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
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
    "paper": "nov_p1",
    "clues": "- Work out what each market is named after.\n- The factor market deals in inputs, while the goods market deals in outputs."
  },
  {
    "name": "Question 2",
    "question": "Match each factor of production to the payment its owner receives in the factor market.",
    "metadata": [
      "A - Labour",
      "B - Land",
      "C - Capital",
      "D - Entrepreneurship",
      "1 - Wages",
      "2 - Rent",
      "3 - Interest",
      "4 - Profit"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Households own the factors and are paid by firms.\n- Rent is paid for the use of natural resources."
  },
  {
    "name": "Question 3",
    "question": "Which of the following securities is traded in the capital market rather than the money market?",
    "metadata": [
      "Mortgage bonds",
      "Treasury bills",
      "Short-term debentures",
      "Overnight inter-bank loans",
      ""
    ],
    "answer": [
      "Mortgage bonds",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "circular_flow",
    "topic": "financial_markets",
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
    "paper": "nov_p1",
    "clues": "- The capital market deals with long-term savings and loans.\n- Three options are short-term instruments."
  },
  {
    "name": "Question 4",
    "question": "A pair of school shoes lasts about a year and is worn on most days. What kind of consumer good is this?",
    "metadata": [
      "Durable good",
      "Semi-durable good",
      "Non-durable good",
      "Capital good",
      ""
    ],
    "answer": [
      "Semi-durable good",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The shoes can be used many times, but only for a limited period.\n- A capital good is bought by businesses to produce other goods."
  },
  {
    "name": "Question 5",
    "question": "Select ALL the participants that form part of the financial market.",
    "metadata": [
      "Banks",
      "Insurance companies",
      "Pension funds",
      "Households that buy groceries",
      "Government departments that issue ID documents"
    ],
    "answer": [
      "Banks",
      "Insurance companies",
      "Pension funds",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "circular_flow",
    "topic": "financial_markets",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Financial institutions collect surplus funds and lend them out.\n- Two options are ordinary buyers or service providers, not links between savers and borrowers."
  },
  {
    "name": "Question 6",
    "question": "Select ALL the ways in which the business sector contributes positively to the development of the South African economy.",
    "metadata": [
      "It creates jobs directly and indirectly",
      "It pays corporate tax that funds public services and infrastructure",
      "It invests in research and development, which encourages innovation",
      "It always pays wages that close the income gap",
      "It never causes any harm to the environment"
    ],
    "answer": [
      "It creates jobs directly and indirectly",
      "It pays corporate tax that funds public services and infrastructure",
      "It invests in research and development, which encourages innovation",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "circular_flow",
    "topic": "business_sector_contribution",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The two incorrect options make claims that are far too absolute to be defended."
  },
  {
    "name": "Question 7",
    "question": "Which of the following is a negative effect of profit-driven business activity on the economy?",
    "metadata": [
      "Firms pay corporate tax",
      "Firms create job opportunities",
      "Firms invest in skills development",
      "Some firms ignore the pollution that their activities cause",
      ""
    ],
    "answer": [
      "Some firms ignore the pollution that their activities cause",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "circular_flow",
    "topic": "business_sector_contribution",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Look for the option that describes a cost to society rather than a benefit."
  },
  {
    "name": "Question 8",
    "question": "Which opening sentence would earn the introduction mark for an essay on the markets of the circular flow?",
    "metadata": [
      "In this essay I will discuss the goods, factor, financial and foreign exchange markets",
      "Discuss in detail the markets within the four-sector circular-flow model",
      "A market is a mechanism that brings buyers and sellers together to exchange products",
      "Markets are very important and everybody uses them every day",
      ""
    ],
    "answer": [
      "A market is a mechanism that brings buyers and sellers together to exchange products",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The paper says a good starting point is to define the main concept.\n- The introduction must not repeat the question or preview the body."
  },
  {
    "name": "Question 9",
    "question": "Arrange the parts of this essay in the order in which they should be written.",
    "metadata": [
      "Additional part: evaluating the business sector’s contribution",
      "Conclusion with a summary and value judgement",
      "Introduction that defines the main concept",
      "Main part: the four markets, each under its own heading"
    ],
    "answer": [
      "Introduction that defines the main concept",
      "Main part: the four markets, each under its own heading",
      "Additional part: evaluating the business sector’s contribution",
      "Conclusion with a summary and value judgement"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Follow the structure printed in the rubric: introduction, body, conclusion.\n- The body has a main part and an additional part."
  },
  {
    "name": "Question 10",
    "question": "In the 26-mark main part of the essay, what is the maximum number of marks that may be given for headings and examples?",
    "metadata": [
      "2",
      "8",
      "10",
      "26",
      ""
    ],
    "answer": [
      "8",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Headings help structure an answer but the marks are for explained facts."
  },
  {
    "name": "Question 11",
    "question": "Select ALL the features of a higher-order conclusion.",
    "metadata": [
      "A brief summary that does not repeat facts already given",
      "An opinion or value judgement on what was discussed",
      "A recommendation",
      "The introduction copied word for word",
      "Every fact from the body listed again"
    ],
    "answer": [
      "A brief summary that does not repeat facts already given",
      "An opinion or value judgement on what was discussed",
      "A recommendation",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 11,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A conclusion should add judgement, not repeat the essay."
  },
  {
    "name": "Question 12",
    "question": "The 10-mark additional part of the essay asks you to evaluate. At most how many of its marks can mere listing of facts earn?",
    "metadata": [
      "0",
      "2",
      "5",
      "10",
      ""
    ],
    "answer": [
      "2",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "circular_flow",
    "topic": "business_sector_contribution",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 12,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Evaluation needs explained points with a judgement, so lists are capped heavily."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 40,
      "clues": "- Plan the essay in the paper’s own structure: introduction, main part, additional part, conclusion.\n- Headings and examples can earn at most 8 of the 26 main-part marks, so explain every point you list.",
      "approach": "- Define the main concept in the introduction without repeating the question.\n- Give each of the four markets its own heading with developed points.\n- Answer the 10-mark evaluation with positives and negatives, developed rather than listed.\n- Finish with a higher-order conclusion.",
      "solution": "1. Introduction (max 2): define the circular flow or a market, for example a market as a mechanism that brings buyers and sellers together.\n2. Goods market: where goods and services are bought and sold; consumer goods are durable, semi-durable or non-durable, and capital goods are bought by businesses.\n3. Factor market: households sell labour, land, capital and entrepreneurship and receive wages, rent, interest and profit; it includes labour and natural resource markets.\n4. Financial markets: banks, insurers and pension funds link savers and borrowers; the money market handles short-term funds (SARB, treasury bills) and the capital market long-term funds (JSE, shares, bonds).\n5. Foreign exchange market: currencies are traded and the freely traded rand is priced by demand and supply (main part max 26, of which at most 8 for headings or examples).\n6. Additional part (max 10): positives such as jobs, skills, GDP, innovation, tax, partnerships, exports and corporate social investment, and negatives such as inequality, pollution and collusion.\n7. Conclusion (max 2): a higher-order summary or judgement, for example on why markets matter for stability and confidence."
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
