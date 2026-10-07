#!/usr/bin/env node
/**
 * DBE Business Studies P1 — November 2025 — Question 4 (order 4)
 * Section B (Miscellaneous, both topics): defensive strategies, strategic management process, business environments, COIDA, PESTLE social, induction, UIF, TQM, quality circles. 4.3.1 and 4.3.2 are a dependency pair (DESIGN-UNI-13): the classification works on the quoted challenges.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2025-nov-p1-q4.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2025-nov-p1-q4.js --dry-run
 *   node scripts/add-business-studies-2025-nov-p1-q4.js
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
  "name": "Question 4",
  "syllabus": "dbe",
  "subject": "business_studies",
  "year": 2025,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "defensive_strategies",
    "strategic_management_process",
    "business_environments",
    "coida",
    "unemployment_insurance_fund",
    "quality_circles"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q4/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q4/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q4/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q4/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q4/memo_5.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which TWO of the following are defensive strategies?",
    "metadata": [
      "Market penetration",
      "Retrenchment",
      "Forward integration",
      "Liquidation",
      "Horizontal diversification"
    ],
    "answer": [
      "Retrenchment",
      "Liquidation",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "business_strategies",
    "topic": "defensive_strategies",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Defensive strategies are used when a business must shrink, sell off or close parts of itself.\n- The other options are growth strategies."
  },
  {
    "name": "Question 2",
    "question": "Arrange the steps of the strategic management process in the correct order.",
    "metadata": [
      "Implement the strategy through an action plan",
      "Scan the environment using tools such as SWOT and PESTLE",
      "Evaluate the results and take corrective action",
      "Formulate alternative strategies",
      "Set the vision, mission and objectives"
    ],
    "answer": [
      "Set the vision, mission and objectives",
      "Scan the environment using tools such as SWOT and PESTLE",
      "Formulate alternative strategies",
      "Implement the strategy through an action plan",
      "Evaluate the results and take corrective action"
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
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A business must know where it wants to go before it studies its surroundings.\n- Strategies are formulated before they are implemented, and evaluation comes last."
  },
  {
    "name": "Question 3",
    "question": "Read the scenario and select the THREE challenges facing Veldt Foods. Quote from the scenario. Veldt Foods makes jam for supermarkets. A sharp rise in fuel prices has made its deliveries very expensive. Some packers often leave their stations early, leaving orders unfinished. Customers are also switching to a cheaper rival brand. The factory is located in the Western Cape.",
    "metadata": [
      "A sharp rise in fuel prices has made its deliveries very expensive",
      "Some packers often leave their stations early, leaving orders unfinished",
      "Customers are also switching to a cheaper rival brand",
      "Veldt Foods makes jam for supermarkets",
      "The factory is located in the Western Cape"
    ],
    "answer": [
      "A sharp rise in fuel prices has made its deliveries very expensive",
      "Some packers often leave their stations early, leaving orders unfinished",
      "Customers are also switching to a cheaper rival brand",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "business_sectors_and_environments",
    "topic": "business_environments",
    "subtopic": "scenario_evidence_identification",
    "skills": [
      "identify_evidence_from_a_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A challenge is something that makes it harder for the business to operate.\n- Descriptions of what the business does or where it is located are not challenges."
  },
  {
    "name": "Question 4",
    "question": "Classify each challenge facing Veldt Foods into the business environment to which it belongs.",
    "metadata": [
      "A - A sharp rise in fuel prices",
      "B - Packers leaving their stations early",
      "C - Customers switching to a cheaper rival brand",
      "1 - Macro environment",
      "2 - Micro environment",
      "3 - Market environment"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "business_sectors_and_environments",
    "topic": "business_environments",
    "subtopic": "classification_and_criteria",
    "skills": [
      "classify_business_concept"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The micro environment is inside the business, and the business controls it.\n- The market environment contains customers and competitors; the macro environment is the wider economy that the business cannot control."
  },
  {
    "name": "Question 5",
    "question": "Which THREE of the following are positive impacts of the Compensation for Occupational Injuries and Diseases Act (COIDA) on businesses?",
    "metadata": [
      "It eliminates the time and costs of lengthy civil court proceedings",
      "Employees must pay a monthly contribution to the Compensation Fund",
      "It protects an employer from a financial burden after an accident, if the employer was not negligent",
      "It allows employers to ignore safety rules because compensation is guaranteed",
      "It promotes safety in the workplace"
    ],
    "answer": [
      "It eliminates the time and costs of lengthy civil court proceedings",
      "It protects an employer from a financial burden after an accident, if the employer was not negligent",
      "It promotes safety in the workplace",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "coida_and_uif",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_legislation_provision"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Employers, not employees, pay into the Compensation Fund.\n- A positive impact cannot be one that encourages unsafe behaviour."
  },
  {
    "name": "Question 6",
    "question": "Customers of Lerumo Fashions increasingly want clothes that suit their changing lifestyles and trends. Which action is the best way for Lerumo Fashions to deal with this social challenge?",
    "metadata": [
      "Lobbying the government to lower the tax rate on clothing",
      "Installing back-up generators to prevent power interruptions",
      "Developing new clothing ranges that reflect the lifestyles and trends of customers",
      "Moving the head office to a different province",
      ""
    ],
    "answer": [
      "Developing new clothing ranges that reflect the lifestyles and trends of customers",
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
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Social factors are about customers' lifestyles, tastes, language and values.\n- A suitable response must address what customers want."
  },
  {
    "name": "Question 7",
    "question": "Which TWO of the following are purposes of induction?",
    "metadata": [
      "To introduce new employees to their colleagues and managers",
      "To test candidates with psychometric tests before they are appointed",
      "To explain safety regulations and the new employee's responsibilities",
      "To advertise the vacancy to potential applicants",
      "To negotiate salaries with the trade union"
    ],
    "answer": [
      "To introduce new employees to their colleagues and managers",
      "To explain safety regulations and the new employee's responsibilities",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "human_resources_function",
    "topic": "placement_and_induction",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_hr_procedure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Induction takes place after the employee has been appointed.\n- Testing and advertising happen earlier in the process."
  },
  {
    "name": "Question 8",
    "question": "Which statement about the Unemployment Insurance Fund (UIF) is correct?",
    "metadata": [
      "Only employers contribute to the fund",
      "Employees and employers each contribute 1% of the employee's basic salary",
      "Employees contribute 5% of their salary and employers nothing",
      "It pays benefits only to people who resigned voluntarily",
      ""
    ],
    "answer": [
      "Employees and employers each contribute 1% of the employee's basic salary",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "impact_of_business_legislation",
    "topic": "coida_and_uif",
    "subtopic": "term_definition_recall",
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
    "clues": "- UIF contributions are shared between the employee and the employer.\n- The fund helps people who become unemployed through no fault of their own, or cannot work due to illness or maternity."
  },
  {
    "name": "Question 9",
    "question": "Orbit Electronics budgets enough money and has enough skilled staff and equipment to set up its quality systems properly. Which TQM element is Orbit Electronics applying?",
    "metadata": [
      "Total client satisfaction",
      "Monitoring and evaluation",
      "Continuous skills development",
      "Adequate financing and capacity",
      ""
    ],
    "answer": [
      "Adequate financing and capacity",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "quality_of_performance",
    "topic": "total_quality_management",
    "subtopic": "scenario_application",
    "skills": [
      "explain_quality_management_concept"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The scenario is about having the resources to do the job, not about measuring results or training people.\n- Money, staff and equipment are the resources in question."
  },
  {
    "name": "Question 10",
    "question": "Which TWO of the following are benefits of a good quality management system?",
    "metadata": [
      "Customer satisfaction increases because products are constantly improved",
      "Products have more defects so more are returned",
      "The business gains a competitive advantage over its competitors",
      "Time and resources are wasted on repeated inspections",
      "Employee morale falls because of constant checks"
    ],
    "answer": [
      "Customer satisfaction increases because products are constantly improved",
      "The business gains a competitive advantage over its competitors",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "quality_of_performance",
    "topic": "total_quality_management",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_quality_management_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A benefit must improve the business, not harm it.\n- Three options describe problems rather than benefits."
  },
  {
    "name": "Question 11",
    "question": "What is the role of quality circles in the continuous improvement of processes and systems?",
    "metadata": [
      "Inspecting finished goods before they are dispatched",
      "Negotiating wage increases with the trade union",
      "Employees meeting regularly to investigate quality problems and suggest solutions to management",
      "Deciding on the selling price of the product",
      ""
    ],
    "answer": [
      "Employees meeting regularly to investigate quality problems and suggest solutions to management",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "quality_of_performance",
    "topic": "quality_circles_and_continuous_improvement",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_quality_management_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 11,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A quality circle is a small group of employees.\n- It looks for ways to improve, rather than carrying out inspections or negotiations."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1",
      "marks": 2,
      "clues": "- Defensive strategies protect or reduce the business.\n- Two are needed, 1 mark each.",
      "approach": "- Recall the three defensive strategies.\n- Name two.",
      "solution": "1. Divestiture.\n2. Retrenchment or liquidation."
    },
    {
      "number": "4.2",
      "marks": 4,
      "clues": "- The process begins with the vision and ends with evaluation.\n- Outline the main stages.",
      "approach": "- List the stages in order.\n- Two points of two marks each.",
      "solution": "1. Have a clear vision, mission and objectives, then scan the environment using SWOT, PESTLE or Porter's Five Forces.\n2. Formulate strategies and develop an action plan.\n3. Implement the strategy by communicating it and organising resources.\n4. Evaluate and monitor the strategy and take corrective action."
    },
    {
      "number": "4.3.1",
      "marks": 2,
      "clues": "- A challenge makes it harder for the business to operate.\n- Quote from the scenario.",
      "approach": "- Read for problems.\n- Quote two.",
      "solution": "1. \"Their exports have decreased due to unfavourable exchange rates\": 1 mark.\n2. \"The workers of GF are also not meeting their deadlines because they are often late for work\": 1 mark."
    },
    {
      "number": "4.3.2",
      "marks": 2,
      "clues": "- Exchange rates affect the whole economy.\n- Workers being late is an internal matter.",
      "approach": "- Decide whether the business controls each challenge.\n- Place each in the correct environment.",
      "solution": "1. Unfavourable exchange rates are in the macro environment: 1 mark.\n2. Workers arriving late is in the micro environment: 1 mark."
    },
    {
      "number": "4.4",
      "marks": 6,
      "clues": "- COIDA has both advantages and disadvantages.\n- Discuss the impact on businesses.",
      "approach": "- Identify positive and/or negative impacts.\n- Give three points of two marks each.",
      "solution": "1. Positive: it eliminates time and costs spent on lengthy civil court proceedings.\n2. Positive: employers are protected from financial burden after an accident if they were not negligent.\n3. Positive: it promotes safety in the workplace.\n4. Negative: claiming processes can be time consuming or costly in paperwork. Any three points, 2 marks each."
    },
    {
      "number": "4.5",
      "marks": 4,
      "clues": "- Social factors concern customers' lifestyles, language and community.\n- Recommend ways to respond.",
      "approach": "- Recall how businesses respond to social factors.\n- Give two ways with explanations.",
      "solution": "1. Employ people from the local community or learn local languages.\n2. Work with community police forums to improve security.\n3. Keep up with the demands and trends of customers.\n4. Develop new products that suit customers' lifestyles. Any two, 2 marks each."
    },
    {
      "number": "4.6",
      "marks": 4,
      "clues": "- Induction welcomes the new employee.\n- Outline why it is done.",
      "approach": "- Recall what induction achieves.\n- Give two purposes.",
      "solution": "1. Introduce new employees to colleagues and management.\n2. Give a tour of the building and workplace.\n3. Explain safety regulations, roles and responsibilities.\n4. Allow employees to ask questions to reduce anxiety. Any two, 2 marks each."
    },
    {
      "number": "4.7",
      "marks": 6,
      "clues": "- UIF is a benefit required by law.\n- Explain who contributes and who benefits.",
      "approach": "- Recall the contribution rates.\n- Explain who is helped and how.",
      "solution": "1. Employees contribute 1% of their basic salary.\n2. Employers contribute 1% of the employee's basic salary.\n3. The fund offers short-term assistance when workers become unemployed or cannot work due to illness, maternity or adoption leave.\n4. It assists the dependants of a contributing worker who dies. Any three points, 2 marks each."
    },
    {
      "number": "4.8.1",
      "marks": 2,
      "clues": "- The scenario says the business can afford to do research.\n- Which TQM element is about resources?",
      "approach": "- Recall the TQM elements.\n- Match the scenario to the element.",
      "solution": "1. Fibernet can afford to conduct research and benefits from a good quality management system.\n2. Having the money and ability to do this is adequate financing and capacity."
    },
    {
      "number": "4.8.2",
      "marks": 4,
      "clues": "- A benefit improves the business.\n- Explain the benefits of the system.",
      "approach": "- List benefits of a good quality management system.\n- Explain two.",
      "solution": "1. Effective customer service raises customer satisfaction.\n2. Time and resources are used efficiently.\n3. Productivity increases and the business gains a competitive advantage.\n4. Business image improves because of fewer defects and returns. Any two, 2 marks each."
    },
    {
      "number": "4.9",
      "marks": 4,
      "clues": "- A quality circle is a small group.\n- Advise on its role.",
      "approach": "- Recall what quality circles do.\n- Give two roles.",
      "solution": "1. They solve problems related to quality and implement improvements.\n2. They investigate problems and suggest solutions to management.\n3. They make suggestions for improving processes and systems.\n4. They boost employees' morale and team spirit. Any two, 2 marks each."
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
