#!/usr/bin/env node
/**
 * DBE Business Studies P1 — November 2024 — Question 1 (order 1)
 * Section A: compulsory objective-type items on legislation, SWOT, business environments, HR roles, business functions, integration, sectors, PDCA and term-matching.
 * DESIGN-BUS-01: no typed answers. Q1.2 is a pick-from-list item on the real paper, so it is modelled as multiple_choice/match, never fitb.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2024-nov-p1-q1.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2024-nov-p1-q1.js --dry-run
 *   node scripts/add-business-studies-2024-nov-p1-q1.js
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
  "name": "Question 1",
  "syllabus": "dbe",
  "subject": "business_studies",
  "year": 2024,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 30,
  "tags": [
    "employment_equity_act",
    "swot_analysis",
    "business_environments",
    "quality_indicators",
    "recruitment_procedure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q1/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q1/memo_1.png"
  ],
  "exam_question_marks": 30,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Thandi is the best-qualified applicant for a supervisor post, but the business appoints a less-qualified candidate because Thandi uses a wheelchair. Which Act most directly protects Thandi against this treatment?",
    "metadata": [
      "Labour Relations Act (LRA)",
      "Basic Conditions of Employment Act (BCEA)",
      "Employment Equity Act (EEA)",
      "Consumer Protection Act (CPA)",
      ""
    ],
    "answer": [
      "Employment Equity Act (EEA)",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "employment_equity_act",
    "subtopic": "scenario_application",
    "skills": [
      "explain_legislation_provision"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The issue is unfair discrimination on the grounds of disability.\n- One Act deals with working hours and leave, another with strikes and disputes, and another with customers."
  },
  {
    "name": "Question 2",
    "question": "Khanya Printers keeps losing its most experienced designers, who resign after only a few months. How should this be classified in Khanya Printers' SWOT analysis?",
    "metadata": [
      "Threat",
      "Opportunity",
      "Strength",
      "Weakness",
      ""
    ],
    "answer": [
      "Weakness",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "business_strategies",
    "topic": "swot_and_pestle_analysis",
    "subtopic": "classification_and_criteria",
    "skills": [
      "analyse_business_environment"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- First decide whether the problem comes from inside or outside the business.\n- Staff turnover is something the business itself can manage."
  },
  {
    "name": "Question 3",
    "question": "Bongani's Bakery buys its flour from a single supplier, which has just raised its prices. How much control does Bongani's Bakery have over this supplier?",
    "metadata": [
      "No control",
      "Limited control",
      "Full control",
      "Complete control",
      ""
    ],
    "answer": [
      "Limited control",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "business_sectors_and_environments",
    "topic": "business_environments",
    "subtopic": "classification_and_criteria",
    "skills": [
      "analyse_business_environment"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Suppliers belong to the market environment, not the micro or macro environment.\n- The business can negotiate or switch, but cannot dictate."
  },
  {
    "name": "Question 4",
    "question": "Which of the following is a role of the INTERVIEWEE during an interview?",
    "metadata": [
      "Explain the purpose of the interview to the candidate",
      "Ask questions to clarify aspects of the position",
      "Make the candidate feel at ease before starting",
      "Record notes on the answers of every candidate",
      ""
    ],
    "answer": [
      "Ask questions to clarify aspects of the position",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "human_resources_function",
    "topic": "interviewing",
    "subtopic": "term_definition_recall",
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
    "clues": "- The interviewee is the candidate, not the panel.\n- Three options describe what the panel does."
  },
  {
    "name": "Question 5",
    "question": "Ndlovu Motors schedules regular maintenance so that the robots on its assembly line run at full capacity with very little downtime. In which business function is this a quality indicator?",
    "metadata": [
      "Purchasing function",
      "Marketing function",
      "Administration function",
      "Production function",
      ""
    ],
    "answer": [
      "Production function",
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
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Ask which function turns inputs into finished products.\n- Using machinery and equipment well is its concern."
  },
  {
    "name": "Question 6",
    "question": "In terms of the Labour Relations Act (LRA), who has the right to embark on a legal strike as a remedy for grievances?",
    "metadata": [
      "Employers",
      "The CCMA",
      "Employees",
      "The Labour Court",
      ""
    ],
    "answer": [
      "Employees",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "impact_of_business_legislation",
    "topic": "labour_relations_act",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_legislation_provision"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A strike is a refusal to work.\n- The other party has a different remedy, the lockout."
  },
  {
    "name": "Question 7",
    "question": "A furniture manufacturer buys the timber plantation that supplies its wood. Which integration strategy has it applied?",
    "metadata": [
      "Forward vertical integration",
      "Horizontal integration",
      "Backward vertical integration",
      "Conglomerate diversification",
      ""
    ],
    "answer": [
      "Backward vertical integration",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "business_strategies",
    "topic": "integration_strategies",
    "subtopic": "scenario_application",
    "skills": [
      "explain_business_strategy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Is the business it bought a competitor, a supplier or a distributor?\n- Moving towards the source of raw materials points in one direction along the supply chain."
  },
  {
    "name": "Question 8",
    "question": "Which TWO of the following businesses operate in the tertiary sector?",
    "metadata": [
      "A salon that sells hair products and styles hair",
      "A sugar-cane farm in KwaZulu-Natal",
      "A factory that turns steel into car parts",
      "A bank that grants loans to small businesses",
      "A mine that extracts coal for export"
    ],
    "answer": [
      "A salon that sells hair products and styles hair",
      "A bank that grants loans to small businesses",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "business_sectors_and_environments",
    "topic": "economic_sectors",
    "subtopic": "classification_and_criteria",
    "skills": [
      "classify_business_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The primary sector extracts natural resources and the secondary sector manufactures.\n- The tertiary sector sells goods or provides services."
  },
  {
    "name": "Question 9",
    "question": "Match each human resources activity in Column A to its description in Column B.",
    "metadata": [
      "A - Recruitment",
      "B - Selection",
      "C - Placement",
      "D - Induction",
      "1 - Finding potential candidates for an available vacancy",
      "2 - Determining which candidate is best suited to the position",
      "3 - Matching a new employee's skills and qualifications to the job",
      "4 - Introducing a new employee to the workplace and its rules"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "human_resources_function",
    "topic": "recruitment_and_selection",
    "subtopic": "sequencing_and_process",
    "skills": [
      "explain_hr_procedure"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- These activities follow one another, from a vacancy to a settled new employee.\n- Selection chooses the person; placement fits that person to the job."
  },
  {
    "name": "Question 10",
    "question": "Lebo Paints has tested a new mixing process, confirmed that it reduces waste, and now makes it the standard process in every factory while continuing to refine it. Which step of the PDCA cycle is Lebo Paints carrying out?",
    "metadata": [
      "Plan",
      "Do",
      "Check",
      "Act",
      ""
    ],
    "answer": [
      "Act",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "quality_of_performance",
    "topic": "quality_circles_and_continuous_improvement",
    "subtopic": "sequencing_and_process",
    "skills": [
      "explain_quality_management_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The trial and the testing have already happened.\n- The last step puts the proven change into wider use."
  },
  {
    "name": "Question 11",
    "question": "Match each term in Column A to its description in Column B.",
    "metadata": [
      "A - Learnership",
      "B - COIDA",
      "C - Quality control",
      "D - Adequate financing and capacity",
      "1 - Structured training on the job that leads to a recognised qualification",
      "2 - Protects workers who are injured or become ill because of their work",
      "3 - Inspects finished products to check that they meet the required standard",
      "4 - Large businesses can afford systems that prevent defects in products"
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
    "topic": "total_quality_management",
    "subtopic": "term_definition_recall",
    "skills": [
      "define_business_term"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 11,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- COIDA stands for the Compensation for Occupational Injuries and Diseases Act.\n- One term is a TQM element seen from the point of view of large businesses."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- The Act is about fairness at work for groups that were treated unequally.",
      "approach": "- Read the statement and every option carefully.\n- Match the purpose to the Act: discrimination in the workplace on race, gender and disability.",
      "solution": "1. B: the Employment Equity Act (EEA) prevents unfair discrimination in the workplace."
    },
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- Decide whether high staff turnover is inside or outside the business.",
      "approach": "- Read the statement and every option carefully.\n- Internal factors are strengths or weaknesses; a negative internal factor is a weakness.",
      "solution": "1. A: weakness. High employee turnover is an internal problem the business can control."
    },
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Suppliers are part of the market environment.",
      "approach": "- Read the statement and every option carefully.\n- Recall the level of control a business has over each environment.",
      "solution": "1. C: limited. A business can influence, but not control, the market environment."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- The interviewee is the candidate.",
      "approach": "- Read the statement and every option carefully.\n- Eliminate the options that describe the interviewer or the panel.",
      "solution": "1. D: ask clarity-seeking questions about the position."
    },
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- Think about which function uses machinery to make products.",
      "approach": "- Read the statement and every option carefully.\n- Link the use of machinery and equipment to a business function.",
      "solution": "1. B: production. Using machinery and equipment optimally is a quality indicator of the production function."
    },
    {
      "number": "1.2.1",
      "marks": 2,
      "clues": "- Only one party in the employment relationship goes on strike.",
      "approach": "- Read the statement and every option carefully.\n- Recall the rights the LRA gives employees and employers.",
      "solution": "1. employee. Employees have the right to a legal strike; employers have the right to a lockout."
    },
    {
      "number": "1.2.2",
      "marks": 2,
      "clues": "- A wheat farm supplies a bakery with its raw material.",
      "approach": "- Read the statement and every option carefully.\n- Buying a supplier moves the business back along the supply chain.",
      "solution": "1. backward vertical. Buying a supplier is backward vertical integration."
    },
    {
      "number": "1.2.3",
      "marks": 2,
      "clues": "- Selling goods to customers is a trade activity.",
      "approach": "- Read the statement and every option carefully.\n- Recall the three economic sectors.",
      "solution": "1. tertiary. Businesses that sell goods or provide services operate in the tertiary sector."
    },
    {
      "number": "1.2.4",
      "marks": 2,
      "clues": "- This happens after the candidate has been chosen.",
      "approach": "- Read the statement and every option carefully.\n- Distinguish selection from the step that fits the new employee to the job.",
      "solution": "1. placement. During placement the employee's qualifications and skills are matched to the job's requirements."
    },
    {
      "number": "1.2.5",
      "marks": 2,
      "clues": "- The business is revising its processes after checking results.",
      "approach": "- Read the statement and every option carefully.\n- Recall the four PDCA steps in order: Plan, Do, Check, Act.",
      "solution": "1. act. Continuously revising processes to improve quality is the Act step."
    },
    {
      "number": "1.3.1",
      "marks": 2,
      "clues": "- A learnership combines practical training with a qualification.",
      "approach": "- Read the statement and every option carefully.\n- Find the description that ends in a recognised qualification.",
      "solution": "1. E: practical training opportunities that lead to a recognised qualification."
    },
    {
      "number": "1.3.2",
      "marks": 2,
      "clues": "- COIDA compensates employees for workplace injuries and diseases.",
      "approach": "- Read the statement and every option carefully.\n- Distinguish COIDA from the LRA (unfair dismissal).",
      "solution": "1. D: provides protection to employees who become disabled due to a workplace accident."
    },
    {
      "number": "1.3.3",
      "marks": 2,
      "clues": "- Recruitment comes before selection.",
      "approach": "- Read the statement and every option carefully.\n- Distinguish finding candidates from judging their suitability.",
      "solution": "1. A: process of finding potential candidates for available vacancies."
    },
    {
      "number": "1.3.4",
      "marks": 2,
      "clues": "- Quality control checks products after they are made.",
      "approach": "- Read the statement and every option carefully.\n- Distinguish checking finished products from the features meeting a need.",
      "solution": "1. J: ensures that finished products meet the required standards."
    },
    {
      "number": "1.3.5",
      "marks": 2,
      "clues": "- This TQM element concerns money and resources.",
      "approach": "- Read the statement and every option carefully.\n- Two descriptions mention large businesses; choose the one that is an advantage.",
      "solution": "1. I: large businesses can afford to put systems in place to prevent defects in products."
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
