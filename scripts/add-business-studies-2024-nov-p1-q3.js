#!/usr/bin/env node
/**
 * DBE Business Studies P1 — November 2024 — Question 3 (order 3)
 * Section B (Business Operations): internal recruitment, interviewer duties, employment contract requirements and termination, EEA implications for HR, quality management, financial function quality indicators, total client satisfaction, cost of quality.
 * 3.6 is an exclusion pair (DESIGN-UNI-13): the follow-up asks for OTHER financial-function indicators, so the indicator already in the scenario is offered as a wrong option.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2024-nov-p1-q3.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2024-nov-p1-q3.js --dry-run
 *   node scripts/add-business-studies-2024-nov-p1-q3.js
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
  "name": "Question 3",
  "syllabus": "dbe",
  "subject": "business_studies",
  "year": 2024,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "internal_recruitment",
    "interviewing",
    "employment_contract",
    "quality_indicators",
    "total_quality_management"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q3/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q3/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q3/memo_4.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which THREE of the following are sources of INTERNAL recruitment?",
    "metadata": [
      "Notice board of the business",
      "Advertisement in a national newspaper",
      "Internal newsletter sent to staff",
      "Private recruitment agency",
      "Recommendations from current employees"
    ],
    "answer": [
      "Notice board of the business",
      "Internal newsletter sent to staff",
      "Recommendations from current employees",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "human_resources_function",
    "topic": "recruitment_and_selection",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_hr_procedure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Internal sources reach people who already work for the business or are close to it.\n- Two options advertise the post to the general public."
  },
  {
    "name": "Question 2",
    "question": "Which THREE of the following are roles of the interviewer BEFORE the interview takes place?",
    "metadata": [
      "Book and prepare the venue for the interview",
      "Introduce the panel and put the candidate at ease",
      "Develop a core set of questions for all candidates",
      "Inform unsuccessful candidates of the outcome",
      "Check each candidate's CV for anything unclear"
    ],
    "answer": [
      "Book and prepare the venue for the interview",
      "Develop a core set of questions for all candidates",
      "Check each candidate's CV for anything unclear",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "human_resources_function",
    "topic": "interviewing",
    "subtopic": "sequencing_and_process",
    "skills": [
      "explain_hr_procedure"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Sort each option into before, during or after the interview.\n- One option happens when the candidate arrives, and one once a decision has been made."
  },
  {
    "name": "Question 3",
    "question": "Read the scenario and select the TWO legal requirements of an employment contract that Sipho Couriers met. Quote from the scenario. Sipho Couriers delivers parcels across Gauteng. It appointed Lindiwe as a dispatch clerk, and the HR manager explained the conditions of employment to her in a language she understands. Lindiwe and the HR manager both signed the contract on her first day. She will also be given a laptop for her work.",
    "metadata": [
      "Sipho Couriers delivers parcels across Gauteng",
      "the HR manager explained the conditions of employment to her in a language she understands",
      "Lindiwe and the HR manager both signed the contract",
      "She will also be given a laptop for her work",
      "It appointed Lindiwe as a dispatch clerk"
    ],
    "answer": [
      "the HR manager explained the conditions of employment to her in a language she understands",
      "Lindiwe and the HR manager both signed the contract",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "employment_contracts",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A legal requirement is about how the contract is agreed, not what the business does or provides.\n- Look for the explanation of terms and the agreement of both parties."
  },
  {
    "name": "Question 4",
    "question": "Which THREE of the following are valid reasons for the termination of an employment contract?",
    "metadata": [
      "The employee takes the annual leave owed to them",
      "The employee is dismissed for proven misconduct",
      "The employee reaches the agreed retirement age",
      "The employee is moved to a branch in another town",
      "Both parties agree to end the contract"
    ],
    "answer": [
      "The employee is dismissed for proven misconduct",
      "The employee reaches the agreed retirement age",
      "Both parties agree to end the contract",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "employment_contracts",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_hr_procedure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Termination means the employment relationship ends.\n- Two options keep the employee working for the same business."
  },
  {
    "name": "Question 5",
    "question": "Which THREE of the following are implications of the Employment Equity Act (EEA) for the human resources function?",
    "metadata": [
      "Offer equal pay for work of equal value",
      "Register learnerships with the relevant SETA",
      "Compile an employment equity plan",
      "Pay one per cent of the payroll as a skills levy",
      "Report equity plan progress to the Department of Labour"
    ],
    "answer": [
      "Offer equal pay for work of equal value",
      "Compile an employment equity plan",
      "Report equity plan progress to the Department of Labour",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "employment_equity_act",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The EEA is about fair treatment and representation in the workplace.\n- Learnerships and levies come from the Skills Development Act."
  },
  {
    "name": "Question 6",
    "question": "Which TWO of the following are benefits of a good quality management system?",
    "metadata": [
      "Final inspections of products are no longer needed",
      "Time and resources are used more efficiently",
      "Employees no longer need any further training",
      "The business gains an advantage over its competitors",
      "Customers are guaranteed the lowest prices"
    ],
    "answer": [
      "Time and resources are used more efficiently",
      "The business gains an advantage over its competitors",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "quality_of_performance",
    "topic": "quality_control_and_assurance",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_quality_management_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Be wary of absolute claims such as \"no longer\" or \"guaranteed\".\n- Quality systems improve efficiency and reputation."
  },
  {
    "name": "Question 7",
    "question": "Phakama Hardware invests its surplus cash in a fixed deposit so that it earns interest. Which business function does this scenario relate to?",
    "metadata": [
      "Administration function",
      "Financial function",
      "General management function",
      "Purchasing function",
      ""
    ],
    "answer": [
      "Financial function",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "quality_of_performance",
    "topic": "business_function_quality_indicators",
    "subtopic": "scenario_application",
    "skills": [
      "explain_quality_management_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The scenario is about managing money, not records or stock.\n- Ask which function obtains and invests funds."
  },
  {
    "name": "Question 8",
    "question": "Phakama Hardware already invests its surplus cash to earn interest. Which TWO of the following are OTHER quality indicators of its financial function?",
    "metadata": [
      "Invest surplus funds to create passive income",
      "Negotiate better interest rates to keep costs down",
      "Buy stock in bulk to obtain trade discounts",
      "Implement control measures to prevent fraud",
      "Keep the personal files of employees up to date"
    ],
    "answer": [
      "Negotiate better interest rates to keep costs down",
      "Implement control measures to prevent fraud",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "quality_of_performance",
    "topic": "business_function_quality_indicators",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_quality_management_concept"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The question asks for OTHER indicators, so rule out what the business already does.\n- Bulk buying and employee files belong to other functions."
  },
  {
    "name": "Question 9",
    "question": "Match each business function in Column A to one of its quality indicators in Column B.",
    "metadata": [
      "A - Financial function",
      "B - Purchasing function",
      "C - Production function",
      "D - Public relations function",
      "1 - Draws up budgets so money is allocated sensibly",
      "2 - Buys quality raw materials at reasonable prices",
      "3 - Uses machinery and equipment to full capacity",
      "4 - Builds a positive image of the business in the media"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "quality_of_performance",
    "topic": "business_function_quality_indicators",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_quality_management_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Each function has its own area: money, buying, making or reputation.\n- Match the key word in each description to a function."
  },
  {
    "name": "Question 10",
    "question": "Which of the following is a NEGATIVE impact of total client satisfaction, as a TQM element, on large businesses?",
    "metadata": [
      "Market research helps them respond to changing needs",
      "Higher customer loyalty may let them charge more",
      "Staff who seldom meet customers may not know their needs",
      "They may gain access to customers in global markets",
      ""
    ],
    "answer": [
      "Staff who seldom meet customers may not know their needs",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "quality_of_performance",
    "topic": "total_quality_management",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_quality_management_concept"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Three options are benefits.\n- In a large business, many employees work far from the customer."
  },
  {
    "name": "Question 11",
    "question": "Which TWO of the following are ways in which TQM can reduce the cost of quality?",
    "metadata": [
      "Add more final inspections for every product",
      "Work closely with suppliers to improve inputs",
      "Cut employee training to save on expenses",
      "Maintain machines regularly to prevent breakdowns",
      "Leave all quality decisions to one manager"
    ],
    "answer": [
      "Work closely with suppliers to improve inputs",
      "Maintain machines regularly to prevent breakdowns",
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
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 11,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- TQM prevents defects rather than catching them at the end.\n- Quality is shared by everyone in the business."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1",
      "marks": 4,
      "clues": "- Internal sources reach existing staff.\n- Think about notice boards, e-mails and staff meetings.",
      "approach": "- Recall where a business advertises a post to its own staff.\n- State four sources, 1 mark each; only the first four are marked.",
      "solution": "1. Internal e-mails or the intranet.\n2. Notice board of the business.\n3. Business newsletters or circulars.\n4. Recommendations of current employees, staff meetings or internal referrals."
    },
    {
      "number": "3.2",
      "marks": 4,
      "clues": "- Only tasks done before the candidate arrives count.\n- Think about the venue, the candidates, the panel and the questions.",
      "approach": "- Recall the interviewer's preparation duties.\n- Outline two, 2 marks each.",
      "solution": "1. Book and prepare the venue.\n2. Inform shortlisted candidates and panel members of the date and place.\n3. Develop a core set of questions based on the skills required.\n4. Check each CV and plan the time allocated to each candidate. Any two, 2 marks each."
    },
    {
      "number": "3.3.1",
      "marks": 2,
      "clues": "- Only words quoted from the scenario earn marks.\n- Look for what happened before Thabo signed.",
      "approach": "- Find the statements that describe how the contract was agreed.\n- Quote two, 1 mark each.",
      "solution": "1. \"Management explained the terms and conditions of the employment contract to him.\"\n2. \"Thabo was given an opportunity to read the contract before signing it.\""
    },
    {
      "number": "3.3.2",
      "marks": 4,
      "clues": "- Either the employer or the employee can end the contract.\n- Think about dismissal, retrenchment, resignation and retirement.",
      "approach": "- List reasons an employment contract may end.\n- Advise with two reasons, 2 marks each.",
      "solution": "1. Dismissal for a valid reason, such as misconduct or poor performance.\n2. Retrenchment or redundancy because of restructuring or insolvency.\n3. Voluntary resignation or retirement.\n4. Incapacity, mutual agreement or expiry of the contract. Any two, 2 marks each."
    },
    {
      "number": "3.4",
      "marks": 6,
      "clues": "- The EEA changes how HR appoints, pays and reports.\n- Think about equal pay, equity plans and reporting.",
      "approach": "- Recall what the HR function must do because of the EEA.\n- Discuss three implications, each with a fact and an explanation.",
      "solution": "1. Offer equal pay for work of equal value.\n2. Compile employment equity plans showing how affirmative action will be implemented, and assign a manager to monitor them.\n3. Report progress to the Department of Employment and Labour.\n4. Train designated groups and ensure the workforce reflects the country's demographics. Any three, 2 marks each."
    },
    {
      "number": "3.5",
      "marks": 4,
      "clues": "- Think about customers, resources and competitors.\n- Benefits are good outcomes for the business.",
      "approach": "- Recall what a good quality management system achieves.\n- Outline two benefits, 2 marks each.",
      "solution": "1. Better customer service increases customer satisfaction.\n2. Time and resources are used efficiently, so productivity increases.\n3. The business gains a competitive advantage and a better image.\n4. Regular training improves employees' skills. Any two, 2 marks each."
    },
    {
      "number": "3.6.1",
      "marks": 2,
      "clues": "- The scenario is about bookkeeping records and tax payments.\n- Ask which function these records and payments belong to.",
      "approach": "- Link the activity in the scenario to a business function.\n- Name the function.",
      "solution": "1. Financial function: keeping bookkeeping records up to date and paying tax accurately."
    },
    {
      "number": "3.6.2",
      "marks": 4,
      "clues": "- Indicators quoted from the scenario earn no marks.\n- Think about capital, interest, budgets and fraud.",
      "approach": "- List quality indicators of the financial function other than record keeping and tax.\n- Explain two, with a fact and an explanation each.",
      "solution": "1. Obtain capital from the most suitable sources.\n2. Negotiate better interest rates to keep finance costs down.\n3. Draw up budgets and accurate financial statements.\n4. Implement controls to prevent fraud, and invest surplus funds. Any two, 2 marks each."
    },
    {
      "number": "3.7",
      "marks": 6,
      "clues": "- \"Impact\" allows positive points, negative points or both.\n- Think about research, image, loyalty and staff far from customers.",
      "approach": "- Consider how large businesses achieve, or fail to achieve, total client satisfaction.\n- Discuss three points, each with a fact and an explanation.",
      "solution": "1. Positive: market research and surveys help large businesses track customer needs.\n2. Positive: higher customer loyalty may allow higher prices and access to global markets.\n3. Negative: employees who seldom meet customers may not know what satisfies them.\n4. Negative: complacent or monopolistic businesses may not try to please customers. Any three, 2 marks each."
    },
    {
      "number": "3.8",
      "marks": 4,
      "clues": "- TQM prevents defects instead of fixing them.\n- Think about quality circles, training, suppliers and maintenance.",
      "approach": "- Recall TQM practices that lower the cost of quality.\n- Recommend two, 2 marks each.",
      "solution": "1. Introduce quality circles to improve workmanship.\n2. Train employees at all levels on their role in quality.\n3. Work closely with suppliers to improve inputs.\n4. Maintain machinery proactively and cut ineffective inspections. Any two, 2 marks each."
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
