#!/usr/bin/env node
/**
 * DBE Business Studies P1 — November 2025 — Question 2 (order 2)
 * Section B (Business Environments): BCEA leave, SETAs, Porter's Five Forces, strategy evaluation, intensive strategies, NCA, B-BBEE ownership, diversification. 2.3 and 2.6 are linked pairs (DESIGN-UNI-13): the second sub-part excludes what the first names.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2025-nov-p1-q2.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2025-nov-p1-q2.js --dry-run
 *   node scripts/add-business-studies-2025-nov-p1-q2.js
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
  "name": "Question 2",
  "syllabus": "dbe",
  "subject": "business_studies",
  "year": 2025,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "basic_conditions_of_employment",
    "porters_five_forces",
    "intensive_strategies",
    "national_credit_act",
    "bbbee_ownership"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q2/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q2/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q2/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q2/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q2/memo_5.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q2/memo_6.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which THREE of the following types of leave are stipulated in the Basic Conditions of Employment Act (BCEA)?",
    "metadata": [
      "Annual leave",
      "Sabbatical leave",
      "Maternity leave",
      "Study leave",
      "Family responsibility leave"
    ],
    "answer": [
      "Annual leave",
      "Maternity leave",
      "Family responsibility leave",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "impact_of_business_legislation",
    "topic": "basic_conditions_of_employment",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_legislation_provision"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The BCEA sets minimum conditions that apply to every employee.\n- Two of the options are sometimes granted by an employer but are not required by the Act."
  },
  {
    "name": "Question 2",
    "question": "Which of the following is a role of a Sector Education and Training Authority (SETA) in supporting the Skills Development Act?",
    "metadata": [
      "Negotiating wage increases on behalf of workers in the sector",
      "Setting a minimum wage for each sector of the economy",
      "Approving workplace skills plans and annual training reports",
      "Collecting income tax from businesses in the sector",
      ""
    ],
    "answer": [
      "Approving workplace skills plans and annual training reports",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "skills_development_and_setas",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_legislation_provision"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- SETAs exist to promote and oversee training in their sector.\n- Wage negotiation and tax collection belong to other bodies."
  },
  {
    "name": "Question 3",
    "question": "Lerato Laptops' sales have fallen since a large international retailer opened a store in the same mall and began selling similar laptops at lower prices. Which force of Porter's Five Forces model is most clearly affecting Lerato Laptops?",
    "metadata": [
      "Bargaining power of suppliers",
      "Bargaining power of buyers",
      "Threat of substitute products",
      "Threat of new entrants",
      ""
    ],
    "answer": [
      "Threat of new entrants",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "business_strategies",
    "topic": "porters_five_forces",
    "subtopic": "scenario_application",
    "skills": [
      "analyse_business_environment"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Ask what has just happened in the market: has a new business arrived, or have customers switched to a different type of product?\n- The retailer sells the same kind of product, not a different one that does the same job."
  },
  {
    "name": "Question 4",
    "question": "Lerato Laptops has identified the threat of new entrants as the force affecting it. Which TWO actions show how it could analyse a DIFFERENT force, the bargaining power of suppliers, to assess its position in the market?",
    "metadata": [
      "Check how easy it is for new businesses to enter the laptop market",
      "Assess whether a few suppliers control scarce components and can raise their prices",
      "Find out whether customers are switching to tablets and smartphones",
      "Determine how reliably and quickly suppliers can deliver quality stock",
      "Establish how many customers can bargain the selling price down"
    ],
    "answer": [
      "Assess whether a few suppliers control scarce components and can raise their prices",
      "Determine how reliably and quickly suppliers can deliver quality stock",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "business_strategies",
    "topic": "porters_five_forces",
    "subtopic": "classification_and_criteria",
    "skills": [
      "analyse_business_environment"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The question asks for a force different from the one already named, so rule that one out first.\n- Each wrong option belongs to a different force: new entrants, substitutes or buyers."
  },
  {
    "name": "Question 5",
    "question": "Which of the following is part of the evaluation of a business strategy?",
    "metadata": [
      "Drawing up the vision and mission statement of the business",
      "Comparing the expected performance with the actual performance",
      "Appointing the managers who will implement the strategy",
      "Allocating the budget for the strategy",
      ""
    ],
    "answer": [
      "Comparing the expected performance with the actual performance",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "business_strategies",
    "topic": "strategic_management_process",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_business_strategy"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Evaluation happens after a strategy has been put in place.\n- Think about what a business must measure to know whether the strategy works."
  },
  {
    "name": "Question 6",
    "question": "Match each intensive strategy in Column A to its description in Column B.",
    "metadata": [
      "A - Market penetration",
      "B - Market development",
      "C - Product development",
      "1 - Selling existing products in existing markets to increase market share",
      "2 - Selling existing products in new markets",
      "3 - Introducing new or modified products into existing markets"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "business_strategies",
    "topic": "intensive_strategies",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_business_strategy"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Each strategy changes either the product, the market, or neither.\n- \"Development\" in the name tells you what is new."
  },
  {
    "name": "Question 7",
    "question": "Read the scenario and select the TWO ways in which Imvelo Finance complies with the National Credit Act (NCA). Quote from the scenario. Imvelo Finance advertises its loans on local radio. Before granting credit, it checks each applicant's record at a credit bureau and gives every applicant a pre-agreement statement. Its offices are open from 08:00 to 17:00 on weekdays. Staff receive a thirteenth cheque every December.",
    "metadata": [
      "advertises its loans on local radio",
      "checks each applicant's record at a credit bureau",
      "gives every applicant a pre-agreement statement",
      "Its offices are open from 08:00 to 17:00 on weekdays",
      "Staff receive a thirteenth cheque every December"
    ],
    "answer": [
      "checks each applicant's record at a credit bureau",
      "gives every applicant a pre-agreement statement",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "consumer_and_credit_legislation",
    "subtopic": "scenario_evidence_identification",
    "skills": [
      "identify_evidence_from_a_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The NCA is about responsible lending.\n- Advertising, opening hours and bonuses are not lending procedures."
  },
  {
    "name": "Question 8",
    "question": "Imvelo Finance already checks applicants at a credit bureau and gives them pre-agreement statements. Which TWO of the following are OTHER ways in which a credit provider can comply with the NCA?",
    "metadata": [
      "Register with the National Credit Regulator",
      "Check every applicant's record at a credit bureau",
      "Give every applicant a pre-agreement statement",
      "Add an initiation fee that is not mentioned in the agreement",
      "Assess whether the consumer can afford the repayments before granting credit"
    ],
    "answer": [
      "Register with the National Credit Regulator",
      "Assess whether the consumer can afford the repayments before granting credit",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "consumer_and_credit_legislation",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_legislation_provision"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Two options repeat what the business already does, so they cannot be \"other\" ways.\n- A hidden fee breaks the NCA instead of complying with it."
  },
  {
    "name": "Question 9",
    "question": "Which action is the best example of applying ownership as a pillar of the Broad-Based Black Economic Empowerment (B-BBEE) Act?",
    "metadata": [
      "Sending all managers on a diversity workshop",
      "Selling a share of the business to black partners and investors",
      "Buying stationery only from black-owned suppliers",
      "Paying for bursaries for black learners in the community",
      ""
    ],
    "answer": [
      "Selling a share of the business to black partners and investors",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "bbbee_act",
    "subtopic": "scenario_application",
    "skills": [
      "explain_legislation_provision"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Ownership is about who owns shares in, or stakes in, the business.\n- The other options relate to other pillars: management, procurement and skills or socio-economic development."
  },
  {
    "name": "Question 10",
    "question": "Which THREE of the following are advantages of diversification strategies?",
    "metadata": [
      "They reduce the risk of depending on one product for income",
      "They guarantee that the business will never face competition",
      "They help sustain profit when one product line performs poorly",
      "They remove the need for market research",
      "They allow existing facilities to be used to produce more products"
    ],
    "answer": [
      "They reduce the risk of depending on one product for income",
      "They help sustain profit when one product line performs poorly",
      "They allow existing facilities to be used to produce more products",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "business_strategies",
    "topic": "diversification_strategies",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_business_strategy"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Diversification means spreading into different products or markets.\n- Be wary of options using absolute words such as \"guarantee\" or \"remove the need\"."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1",
      "marks": 4,
      "clues": "- The Act lists several kinds of leave an employee may take.\n- Four are needed; five are acceptable in the memo.",
      "approach": "- Recall the leave provisions in the BCEA.\n- Name four of them.",
      "solution": "1. Annual leave.\n2. Sick leave.\n3. Maternity leave.\n4. Parental, adoption, commissioning parental or paternity leave; or family responsibility leave."
    },
    {
      "number": "2.2",
      "marks": 4,
      "clues": "- SETAs support skills development in their sectors.\n- Think about approving, registering, paying and monitoring.",
      "approach": "- Recall the functions of SETAs.\n- Outline two points of two marks each.",
      "solution": "1. SETAs promote and establish learnerships.\n2. They collect levies and pay out grants as required.\n3. They approve workplace skills plans and annual training reports.\n4. They monitor and evaluate training provided by service providers. Any two such points earn full marks."
    },
    {
      "number": "2.3.1",
      "marks": 3,
      "clues": "- Read what is happening to sales and why.\n- Name the force, then quote the evidence from the scenario.",
      "approach": "- Match the problem to one of the five forces.\n- Quote the part of the scenario that proves it.",
      "solution": "1. Sales have decreased because Bright Eyewear sells unique sunglasses at reasonable prices.\n2. A competitor taking customers is competitive rivalry (power of competitors): 2 marks.\n3. Quote: \"BF sales have decreased as Bright Eyewear sells unique sunglasses at reasonable prices\": 1 mark."
    },
    {
      "number": "2.3.2",
      "marks": 3,
      "clues": "- Choose a force other than the one in 2.3.1.\n- Rivalry earns no marks here.",
      "approach": "- Pick one of the remaining four forces.\n- Name it and describe how a business applies it.",
      "solution": "1. Choose, for example, the bargaining power of suppliers: 2 marks for naming the force.\n2. Describe: assess how much power suppliers have in influencing prices, quality or delivery: 1 mark.\n3. Alternatives: power of buyers, threat of substitutes or threat of new entrants. Only the first force is marked."
    },
    {
      "number": "2.4",
      "marks": 4,
      "clues": "- Strategy evaluation checks whether the strategy is working.\n- Think about comparing, examining and correcting.",
      "approach": "- Recall the steps of strategy evaluation.\n- Give two steps with a short explanation of each.",
      "solution": "1. Examine the underlying basis of the strategy.\n2. Compare the expected performance with the actual performance.\n3. Determine the reasons for deviations and take corrective action.\n4. Any other relevant step, in any order: 2 marks each, maximum 4."
    },
    {
      "number": "2.5",
      "marks": 6,
      "clues": "- Intensive strategies grow the business using existing products or markets.\n- Two types are needed, with a short discussion of each.",
      "approach": "- Name the three intensive strategies.\n- Pick two, naming each (2 marks) and discussing it (1 mark).",
      "solution": "1. Market penetration: selling existing products in existing markets to increase market share, for example through intensive advertising.\n2. Market development: selling existing products in new markets.\n3. Product development: introducing new or modified products to existing markets.\n4. Only the first two strategies answered are marked: (2 + 1) x 2 = 6."
    },
    {
      "number": "2.6.1",
      "marks": 2,
      "clues": "- Only words taken from the scenario earn marks.\n- Look for steps taken before and during lending.",
      "approach": "- Read the scenario for actions linked to credit.\n- Quote two of them exactly.",
      "solution": "1. \"MF conducts credit checks with the credit bureau before the granting of credit\": 1 mark.\n2. \"MF also ensures that their procedures adhere to the provisions of the Financial Intelligence Centre Act (FICA)\": 1 mark."
    },
    {
      "number": "2.6.2",
      "marks": 4,
      "clues": "- The ways must differ from those quoted in 2.6.1.\n- Think about disclosure, registration and affordability.",
      "approach": "- List NCA compliance measures other than the scenario ones.\n- Recommend two, with two marks each.",
      "solution": "1. Offer applicants pre-agreement statements.\n2. Disclose all costs of the loan; no hidden costs.\n3. Register with the National Credit Regulator or submit an annual compliance report.\n4. Assess affordability before granting credit. Any two: 2 marks each; answers quoted from the scenario earn nothing."
    },
    {
      "number": "2.7",
      "marks": 6,
      "clues": "- Ownership is one pillar of the B-BBEE scorecard.\n- Think about who holds shares and stakes in the business.",
      "approach": "- Explain the ways a business applies ownership.\n- Give each way with an explanation, 2 marks per point.",
      "solution": "1. Include black people in shareholding, partnerships or franchises.\n2. Encourage small black investors to invest and share ownership.\n3. Form joint ventures between large and small black-owned businesses.\n4. Create more opportunities for black people to become owners and entrepreneurs. Any three points, 2 marks each."
    },
    {
      "number": "2.8",
      "marks": 4,
      "clues": "- Advantages are benefits to the business.\n- Think about risk, income and growth.",
      "approach": "- Recall what diversification strategies achieve.\n- Advise with two advantages, 2 marks each.",
      "solution": "1. It increases sales, income and growth.\n2. It reduces the risk of relying on a single product.\n3. It sustains profit through different product lines when the economy fluctuates.\n4. Any two advantages, 2 marks each."
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
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
