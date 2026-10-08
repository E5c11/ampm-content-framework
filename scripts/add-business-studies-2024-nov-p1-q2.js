#!/usr/bin/env node
/**
 * DBE Business Studies P1 — November 2024 — Question 2 (order 2)
 * Section B (Business Environments): diversification, intensive and defensive strategies, PESTLE (environmental), B-BBEE pillar and purpose, CPA compliance, LRA impact, strategic management process.
 * 2.3 is a dependency pair (DESIGN-UNI-13): the follow-up deals with the PESTLE factor the first sub-part names, so the practice pair keeps the same scenario and factor.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2024-nov-p1-q2.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2024-nov-p1-q2.js --dry-run
 *   node scripts/add-business-studies-2024-nov-p1-q2.js
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
  "year": 2024,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "diversification_strategies",
    "intensive_strategies",
    "defensive_strategies",
    "pestle_analysis",
    "labour_relations_act"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q2/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q2/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q2/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q2/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q2/memo_5.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which TWO of the following are types of diversification strategies?",
    "metadata": [
      "Market penetration",
      "Concentric diversification",
      "Backward vertical integration",
      "Conglomerate diversification",
      "Divestiture"
    ],
    "answer": [
      "Concentric diversification",
      "Conglomerate diversification",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "business_strategies",
    "topic": "diversification_strategies",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_business_strategy"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Diversification adds new products or businesses to spread risk.\n- The wrong options come from the intensive, integration and defensive families."
  },
  {
    "name": "Question 2",
    "question": "Which THREE of the following are advantages of intensive strategies?",
    "metadata": [
      "Regular sales to existing customers may increase",
      "Risk is spread across unrelated products and industries",
      "Customer loyalty grows through effective promotion campaigns",
      "The business gains control over its source of raw materials",
      "A larger market share reduces vulnerability to competitors"
    ],
    "answer": [
      "Regular sales to existing customers may increase",
      "Customer loyalty grows through effective promotion campaigns",
      "A larger market share reduces vulnerability to competitors",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "business_strategies",
    "topic": "intensive_strategies",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_business_strategy"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Intensive strategies push harder with existing products or markets.\n- Spreading risk is the aim of a different family, and so is controlling supply."
  },
  {
    "name": "Question 3",
    "question": "Umoya Tannery releases untreated waste water from its leather processing into a nearby wetland to save on disposal costs. Which PESTLE factor does this scenario point to?",
    "metadata": [
      "Environmental",
      "Economic",
      "Social",
      "Technological",
      ""
    ],
    "answer": [
      "Environmental",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "business_strategies",
    "topic": "swot_and_pestle_analysis",
    "subtopic": "scenario_application",
    "skills": [
      "analyse_business_environment"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Ask what is being harmed in the scenario.\n- Saving costs is the motive, not the challenge itself."
  },
  {
    "name": "Question 4",
    "question": "Umoya Tannery must now deal with the challenge posed by the PESTLE factor in its scenario. Which TWO actions would best help it do so?",
    "metadata": [
      "Treat or recycle its waste before disposing of it safely",
      "Lower its prices to win back customers it has lost",
      "Pipe the waste water to a river further from town",
      "Conserve natural resources through sustainable practices",
      "Advertise more often on local radio stations"
    ],
    "answer": [
      "Treat or recycle its waste before disposing of it safely",
      "Conserve natural resources through sustainable practices",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "business_strategies",
    "topic": "swot_and_pestle_analysis",
    "subtopic": "scenario_application",
    "skills": [
      "analyse_business_environment"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The action must reduce the harm, not move it somewhere else.\n- Prices and advertising address an economic or marketing problem."
  },
  {
    "name": "Question 5",
    "question": "Match each defensive strategy in Column A to its description in Column B.",
    "metadata": [
      "A - Divestiture",
      "B - Retrenchment",
      "C - Liquidation",
      "1 - Selling divisions or assets that are no longer profitable",
      "2 - Terminating employment contracts for operational reasons",
      "3 - Selling all assets and ending the business to pay creditors"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "business_strategies",
    "topic": "defensive_strategies",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_business_strategy"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- One strategy cuts staff, one sells parts of the business and one closes it.\n- Liquidation is the most final of the three."
  },
  {
    "name": "Question 6",
    "question": "Ikhaya Logistics appointed two black women as executive directors on its board to comply with the Broad-Based Black Economic Empowerment (B-BBEE) Act. Which B-BBEE pillar has Ikhaya Logistics applied?",
    "metadata": [
      "Ownership",
      "Management control",
      "Skills development",
      "Enterprise and supplier development",
      ""
    ],
    "answer": [
      "Management control",
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
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Board and executive positions are about who runs the business.\n- Owning shares is a different pillar."
  },
  {
    "name": "Question 7",
    "question": "Which TWO of the following describe the purpose of the B-BBEE Act?",
    "metadata": [
      "To regulate how credit is granted to consumers",
      "To spread wealth more broadly across all population groups",
      "To protect consumers against unsafe goods and services",
      "To set a minimum wage for every sector of the economy",
      "To increase the number of black people who manage businesses"
    ],
    "answer": [
      "To spread wealth more broadly across all population groups",
      "To increase the number of black people who manage businesses",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "impact_of_business_legislation",
    "topic": "bbbee_act",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_legislation_provision"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- B-BBEE targets inequality in the economy.\n- Credit and consumer safety belong to other Acts."
  },
  {
    "name": "Question 8",
    "question": "Which THREE of the following are ways in which a business can comply with the Consumer Protection Act (CPA)?",
    "metadata": [
      "Display the prices of all products on sale",
      "Conduct a credit check before selling on credit",
      "Allow a five-day cooling-off period on agreements",
      "Submit an employment equity plan every year",
      "Show the business name on invoices and contracts"
    ],
    "answer": [
      "Display the prices of all products on sale",
      "Allow a five-day cooling-off period on agreements",
      "Show the business name on invoices and contracts",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The CPA protects buyers when they shop.\n- Credit checks and equity plans come from two other Acts."
  },
  {
    "name": "Question 9",
    "question": "Which TWO of the following are NEGATIVE impacts of the Labour Relations Act (LRA) on businesses?",
    "metadata": [
      "Labour disputes are settled more quickly and cheaply",
      "Legal strikes may increase the cost of labour",
      "Employers have guidelines for fair disciplinary procedures",
      "Employers may not dismiss employees at will",
      "It promotes a healthy employer-employee relationship"
    ],
    "answer": [
      "Legal strikes may increase the cost of labour",
      "Employers may not dismiss employees at will",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "labour_relations_act",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_legislation_provision"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Look at each statement from the employer's point of view.\n- Three statements describe benefits to the business."
  },
  {
    "name": "Question 10",
    "question": "Arrange the steps of the strategic management process in the correct order.",
    "metadata": [
      "Formulate alternative strategies",
      "Take corrective action where goals are not met",
      "Review the vision and mission statement",
      "Implement the strategy using an action plan",
      "Conduct an environmental scan, such as a SWOT analysis",
      "Monitor and evaluate the implemented strategy"
    ],
    "answer": [
      "Review the vision and mission statement",
      "Conduct an environmental scan, such as a SWOT analysis",
      "Formulate alternative strategies",
      "Implement the strategy using an action plan",
      "Monitor and evaluate the implemented strategy",
      "Take corrective action where goals are not met"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "business_strategies",
    "topic": "strategic_management_process",
    "subtopic": "sequencing_and_process",
    "skills": [
      "explain_business_strategy"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The process starts with where the business wants to go.\n- A strategy must be put into action before it can be evaluated."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1",
      "marks": 2,
      "clues": "- Diversification means moving into new products or businesses.\n- There are three named types.",
      "approach": "- Recall the types of diversification strategies.\n- Name two; only the first two are marked.",
      "solution": "1. Concentric diversification.\n2. Horizontal diversification.\n3. Conglomerate diversification. Any two, 1 mark each."
    },
    {
      "number": "2.2",
      "marks": 6,
      "clues": "- Intensive strategies focus on existing products and markets.\n- Think about sales, loyalty, prices and market share.",
      "approach": "- Recall what a business gains from market penetration, market development and product development.\n- Outline three advantages, 2 marks each.",
      "solution": "1. Sales, income and profitability may increase through advertising campaigns.\n2. Regular sales to existing customers may increase, and customer loyalty grows through promotions.\n3. The business can eliminate competitors and has more control over prices.\n4. A larger market share reduces its vulnerability to competitors. Any three, 2 marks each."
    },
    {
      "number": "2.3.1",
      "marks": 2,
      "clues": "- Look at what the business does with its waste.\n- Ask what is being harmed.",
      "approach": "- Match the challenge in the scenario to one of the six PESTLE factors.\n- Name the factor only.",
      "solution": "1. Environmental: dumping chemical waste into the river harms the natural environment."
    },
    {
      "number": "2.3.2",
      "marks": 4,
      "clues": "- The recommendations must deal with the factor named in 2.3.1.\n- Think about waste, recycling and natural resources.",
      "approach": "- Recommend actions that reduce the harm to the environment.\n- Give two recommendations, 2 marks each.",
      "solution": "1. Use cost-effective, safe ways to dispose of waste.\n2. Recycle and use re-usable or recyclable packaging to prevent pollution.\n3. Conserve natural resources through sustainable practices.\n4. Label chemicals clearly so products are used correctly. Facts are accepted even if 2.3.1 was wrong."
    },
    {
      "number": "2.4",
      "marks": 6,
      "clues": "- Defensive strategies are used when a business is under pressure.\n- Name the strategy, then say what it involves.",
      "approach": "- Choose two of divestiture, retrenchment and liquidation.\n- For each: name it (2 marks) and discuss it (1 mark).",
      "solution": "1. Divestiture: selling assets or divisions that are no longer profitable, for example to pay off debt.\n2. Retrenchment: terminating employment contracts for operational reasons to reduce costs.\n3. Liquidation: selling all assets and ending the business to pay creditors. Only the first two are marked."
    },
    {
      "number": "2.5.1",
      "marks": 2,
      "clues": "- Sandile now serves on the board of directors.\n- Ask which pillar deals with who runs the business.",
      "approach": "- Link the promotion in the scenario to a B-BBEE pillar.\n- Name the pillar.",
      "solution": "1. Management control: promoting a black employee to a senior executive post on the board."
    },
    {
      "number": "2.5.2",
      "marks": 4,
      "clues": "- The Act targets inequality in the economy.\n- Think about wealth, codes of good practice and management.",
      "approach": "- Recall what the B-BBEE Act sets out to achieve.\n- Describe two purposes, with a fact and an explanation each.",
      "solution": "1. Enables wealth to be spread more broadly across all population groups.\n2. Allows the Minister to issue Codes of Good Practice and publish transformation charters.\n3. Establishes the B-BBEE Advisory Council.\n4. Increases the number of black people who manage and control businesses. Any two, 2 marks each."
    },
    {
      "number": "2.6",
      "marks": 4,
      "clues": "- The CPA protects buyers.\n- Think about prices, labels, agreements and complaints.",
      "approach": "- Recall what a business must do to protect consumers under the CPA.\n- Explain two ways, 2 marks each.",
      "solution": "1. Disclose the prices of all products on sale.\n2. Provide a five-day cooling-off period in agreements.\n3. Display the required information on labels and packaging.\n4. Train staff on the CPA and set up ways to handle complaints. Any two, 2 marks each."
    },
    {
      "number": "2.7",
      "marks": 6,
      "clues": "- \"Impact\" allows positive points, negative points or both.\n- Think about disputes, strikes, dismissals and productivity.",
      "approach": "- List benefits and drawbacks of the LRA for employers.\n- Discuss three points, each with a fact and an explanation.",
      "solution": "1. Positive: promotes healthy employer-employee relationships and settles disputes more quickly and cheaply, for example through the CCMA.\n2. Positive: gives employers guidelines on fair disciplinary and dismissal procedures.\n3. Negative: legal strikes increase labour costs and reduce productivity.\n4. Negative: employers may not dismiss employees at will, as procedures must be followed. Any three, 2 marks each."
    },
    {
      "number": "2.8",
      "marks": 4,
      "clues": "- The process runs from the vision to evaluation.\n- Think about scanning, formulating, implementing and evaluating.",
      "approach": "- Recall the steps of the strategic management process.\n- Advise with two steps, 2 marks each.",
      "solution": "1. Review the vision and mission statement.\n2. Conduct an environmental scan using SWOT, PESTLE or Porter's Five Forces.\n3. Formulate and implement a strategy using an action plan.\n4. Evaluate the strategy and take corrective action. Any two, 2 marks each."
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
