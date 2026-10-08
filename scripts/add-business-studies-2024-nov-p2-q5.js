#!/usr/bin/env node
/**
 * DBE Business Studies P2 — November 2024 — Question 5 (order 5)
 * Business Ventures (Investment: Securities) — essay question, Section C.
 * DESIGN-BUS-03: no free-text essay input exists in the app — practice questions teach the essay content
 * (functions of the JSE, investment decision factors, impact of unit trusts, simple vs compound interest)
 * plus the essay-strategy skill objectively, grounded in the real memo's LASO rubric (Layout,
 * Analysis and Interpretation, Synthesis, Originality — 8 of the essay's 40 marks).
 * Never a free-text/model-essay item; never verbatim memo prose.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2024-nov-p2-q5.js --curriculum temp/curriculum-vocab-business-studies-p2-2024.json
 *   node scripts/add-business-studies-2024-nov-p2-q5.js --dry-run
 *   node scripts/add-business-studies-2024-nov-p2-q5.js
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
  "subject": "business_studies",
  "year": 2024,
  "paper": "nov_p2",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "securities_investment",
    "essay_writing_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q5/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q5/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q5/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q5/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q5/memo_5.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q5/memo_6.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which THREE of the following are functions of the Johannesburg Securities Exchange (JSE)?",
    "metadata": [
      "It acts as a link between investors and public companies",
      "It sets the interest rate that banks charge on loans",
      "It serves as an indicator of economic conditions in South Africa",
      "It guarantees that every listed share will rise in value",
      "It publishes share prices daily to keep investors informed"
    ],
    "answer": [
      "It acts as a link between investors and public companies",
      "It serves as an indicator of economic conditions in South Africa",
      "It publishes share prices daily to keep investors informed",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "investment_securities_and_insurance",
    "topic": "securities_investment",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_investment_option"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The JSE is a market where shares in listed companies are traded.\n- Interest rates are set by the Reserve Bank, and no market can guarantee rising prices."
  },
  {
    "name": "Question 2",
    "question": "Match each investment decision factor in Column A to its description in Column B.",
    "metadata": [
      "A - Return on investment",
      "B - Risk",
      "C - Liquidity",
      "D - Investment term",
      "1 - The income earned, such as interest, dividends or capital growth",
      "2 - The chance that the amount invested loses value or is lost",
      "3 - How quickly and easily the investment can be turned into cash",
      "4 - The length of time for which the money stays invested"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "investment_securities_and_insurance",
    "topic": "securities_investment",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_investment_option"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Liquidity is about access to cash.\n- Return is what you gain; risk is what you might lose."
  },
  {
    "name": "Question 3",
    "question": "Musa wants to invest his savings, but he must be able to reach the money at short notice for emergencies. Which investment decision factor should guide his choice most?",
    "metadata": [
      "Return on investment",
      "Inflation rate",
      "Taxation",
      "Liquidity",
      ""
    ],
    "answer": [
      "Liquidity",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "investment_securities_and_insurance",
    "topic": "securities_investment",
    "subtopic": "scenario_application",
    "skills": [
      "explain_investment_option"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Musa's main need is quick access to his money.\n- Which factor measures how easily an investment becomes cash?"
  },
  {
    "name": "Question 4",
    "question": "An investment earns 6% a year while the inflation rate is 7% a year. What does this mean for the investor?",
    "metadata": [
      "The investment is growing faster than prices are rising",
      "The purchasing power of the money is falling in real terms",
      "The investor is fully protected because the return is positive",
      "The investment now carries no risk of losing value at all",
      ""
    ],
    "answer": [
      "The purchasing power of the money is falling in real terms",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "investment_securities_and_insurance",
    "topic": "securities_investment",
    "subtopic": "scenario_application",
    "skills": [
      "explain_investment_option"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Compare the return with the rate at which prices are rising.\n- A good investment's return should be higher than inflation."
  },
  {
    "name": "Question 5",
    "question": "Which THREE statements correctly describe the impact of unit trusts as a form of investment?",
    "metadata": [
      "A small amount can be invested every month",
      "They suit investors who want to avoid all risk",
      "They are managed by accredited fund managers",
      "They are best suited to very short-term investment",
      "Unit prices may fall when the share market is volatile"
    ],
    "answer": [
      "A small amount can be invested every month",
      "They are managed by accredited fund managers",
      "Unit prices may fall when the share market is volatile",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "investment_securities_and_insurance",
    "topic": "securities_investment",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_investment_option"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Impact includes both advantages and disadvantages.\n- Unit trusts invest in shares, so they carry some risk and work best over the medium to long term."
  },
  {
    "name": "Question 6",
    "question": "Which TWO statements correctly describe compound interest, as opposed to simple interest?",
    "metadata": [
      "Interest is earned only on the original amount invested",
      "Interest is earned on the original amount and on interest already earned",
      "The principal stays the same for the whole investment period",
      "The principal grows as interest is added to it",
      "It always yields a lower return than simple interest"
    ],
    "answer": [
      "Interest is earned on the original amount and on interest already earned",
      "The principal grows as interest is added to it",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "investment_securities_and_insurance",
    "topic": "securities_investment",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_investment_option"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- With compound interest, you earn \"interest on interest\".\n- Two options describe simple interest instead."
  },
  {
    "name": "Question 7",
    "question": "R10 000 is invested for 2 years at 10% interest a year. How much MORE interest does compound interest earn than simple interest over the 2 years?",
    "metadata": [
      "R0",
      "R100",
      "R200",
      "R2 100",
      ""
    ],
    "answer": [
      "R100",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "calc",
    "unit": "investment_securities_and_insurance",
    "topic": "securities_investment",
    "subtopic": "scenario_application",
    "skills": [
      "explain_investment_option"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Simple interest: R1 000 each year for 2 years.\n- Compound interest: the second year's 10% is worked out on R11 000."
  },
  {
    "name": "Question 8",
    "question": "An essay question asks you to outline the functions of the JSE, explain the factors to consider when making investment decisions, discuss the impact of unit trusts, and advise on the differences between simple and compound interest. Arrange the paragraphs of your essay in the correct order.",
    "metadata": [
      "Impact of unit trusts",
      "Conclusion",
      "Functions of the JSE",
      "Differences between simple and compound interest",
      "Introduction",
      "Factors to consider when making investment decisions"
    ],
    "answer": [
      "Introduction",
      "Functions of the JSE",
      "Factors to consider when making investment decisions",
      "Impact of unit trusts",
      "Differences between simple and compound interest",
      "Conclusion"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "investment_securities_and_insurance",
    "topic": "securities_investment",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "sequence_essay_structure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Follow the order of the bullet points in the essay question.\n- The essay starts with an introduction and ends with a conclusion."
  },
  {
    "name": "Question 9",
    "question": "Which TWO of the following would earn an Originality mark in this essay?",
    "metadata": [
      "A textbook definition of a unit trust",
      "A named JSE-listed company's share price change reported in the news this year",
      "A general statement that saving money is important",
      "The current interest rate a named bank offers on its notice account",
      "A stock market crash that happened over 40 years ago"
    ],
    "answer": [
      "A named JSE-listed company's share price change reported in the news this year",
      "The current interest rate a named bank offers on its notice account",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "investment_securities_and_insurance",
    "topic": "securities_investment",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "identify_originality_worthy_example"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Originality needs a specific, real example that is no older than two years.\n- Definitions and general statements are not examples."
  },
  {
    "name": "Question 10",
    "question": "A candidate's essay contains many relevant facts, but the words INTRODUCTION and CONCLUSION never appear. What is the result?",
    "metadata": [
      "The candidate loses all the marks for facts",
      "Nothing, as long as the paragraphs are clear",
      "The candidate forfeits the marks for layout",
      "The candidate loses only the originality marks",
      ""
    ],
    "answer": [
      "The candidate forfeits the marks for layout",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "investment_securities_and_insurance",
    "topic": "securities_investment",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "evaluate_essay_layout_compliance"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Layout checks for an introduction, paragraphs and a conclusion.\n- The marking rules require these headings to be stated."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 40,
      "clues": "- Cover all four aspects: functions of the JSE, four investment decision factors, the impact of unit trusts, and simple vs compound interest.\n- Facts are capped at 32 marks; the other 8 come from Layout, Analysis, Synthesis and Originality (2 each).",
      "approach": "- Write the heading INTRODUCTION and refer to at least two of the aspects in your own words (2 marks).\n- Give each aspect its own heading, in the order the question lists them. Mark guide: JSE functions 10, factors 16, unit trusts 12, interest 8.\n- For the factors, name exactly four and explain each (factor 2 + explanation 2); only the first four are marked.\n- For unit trusts, discuss positives and/or negatives; for interest, give clear differences on both sides.\n- Use at least one real example no older than two years in two of the aspects for Originality.\n- Write the heading CONCLUSION and add one new, relevant point (2 marks).",
      "solution": "1. Introduction: the JSE is the market where listed shares are traded; investors weigh several factors; unit trusts suit small investors; simple and compound interest give different returns.\n2. Functions of the JSE: links investors and public companies, indicates economic conditions, publishes share prices daily, keeps the market orderly through strict rules, and helps raise primary capital.\n3. Factors: return on investment, risk, investment term, inflation rate, taxation and liquidity. Explain any four.\n4. Unit trusts: positives such as small monthly amounts, expert fund managers and easy access to cash; negatives such as price fluctuation and unsuitability for very short-term investing.\n5. Interest: simple interest is earned only on the original amount, so the principal stays the same; compound interest is earned on the principal plus earlier interest, so it yields a higher return.\n6. Conclusion: a new point, for example that understanding these aspects helps investors choose suitable investments."
    }
  ],
  "model": "claude-opus-5-5",
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
    console.error(
      '\n   curriculum_nodes / skills → node tools/create-curriculum-node.js | create-skill.js' +
      '\n   tags → node tools/create-tag.js',
    );
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

  // Exam gate (VER-02/VER-04, tools/apply-exam-gate.js): derive the exam's minimum app version from the rows now in the
  // database and write it to exam_versions, bumping updated_at on the exam's rows. Dev only; a no-op when the derived
  // minimum is the floor (VER-07); idempotent. The gate is per EXAM, so it also gates the sibling papers.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
}

// Only run when invoked directly — so validate-questions.js (and anything else) can load
// this file for its data blocks without opening a DB connection or writing anything.
if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
