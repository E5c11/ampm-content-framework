#!/usr/bin/env node
/**
 * DBE Business Studies P1 — November 2025 — Question 1 (order 1)
 * Section A equivalent: compulsory objective-type items on legislation, PESTLE/SWOT, sectors, HR vocabulary, PDCA and term-matching. DESIGN-BUS-01: no typed answers — every item is multiple_choice/multi_select/match.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2025-nov-p1-q1.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2025-nov-p1-q1.js --dry-run
 *   node scripts/add-business-studies-2025-nov-p1-q1.js
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
  "year": 2025,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 30,
  "tags": [
    "consumer_protection_act",
    "pestle_analysis",
    "swot_analysis",
    "total_quality_management"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q1/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q1/memo_1.png"
  ],
  "exam_question_marks": 30,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Zola Snacks must print the ingredients, the expiry date and the manufacturer's details on every packet it sells so that consumers can make informed choices. Which Act requires this?",
    "metadata": [
      "Employment Equity Act",
      "Labour Relations Act",
      "Consumer Protection Act",
      "National Credit Act",
      ""
    ],
    "answer": [
      "Consumer Protection Act",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "consumer_and_credit_legislation",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about who the rules on packaging are meant to protect.\n- Two of the options deal with employees, and one deals with lending."
  },
  {
    "name": "Question 2",
    "question": "New municipal by-laws now restrict the hours during which Karoo Bistro may trade. Which factor of the PESTLE analysis does this challenge fall under?",
    "metadata": [
      "Political",
      "Legal",
      "Social",
      "Economic",
      ""
    ],
    "answer": [
      "Legal",
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
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- By-laws are rules with which a business must comply.\n- Political factors concern government policy and stability, not specific rules a business must obey."
  },
  {
    "name": "Question 3",
    "question": "Sunrise Dairy buys raw milk from local farmers and processes it into cheese and yoghurt. In which economic sector does Sunrise Dairy operate?",
    "metadata": [
      "Primary sector",
      "Tertiary sector",
      "Informal sector",
      "Secondary sector",
      ""
    ],
    "answer": [
      "Secondary sector",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "business_sectors_and_environments",
    "topic": "economic_sectors",
    "subtopic": "scenario_application",
    "skills": [
      "classify_business_concept"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Ask whether the business extracts a raw material, changes it into something new, or sells a service.\n- The business does not farm the milk itself."
  },
  {
    "name": "Question 4",
    "question": "Which action is the responsibility of the interviewer during an interview?",
    "metadata": [
      "Helping the candidate to answer the difficult questions",
      "Asking relevant, job-related questions and listening carefully to the answers",
      "Sharing the scores of the other candidates with the interviewee",
      "Asking about the candidate's religion and marital status",
      ""
    ],
    "answer": [
      "Asking relevant, job-related questions and listening carefully to the answers",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The interviewer must treat every candidate fairly and keep the process professional.\n- Two options would be unfair or discriminatory, and one would give a candidate an advantage."
  },
  {
    "name": "Question 5",
    "question": "A factory trials a new packing method and finds it halves packing errors, so it adopts the method as the standard in all its plants. Which step of the PDCA cycle is the factory applying?",
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
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The trial and its results have already happened; the question is what the business does with the proven method next.\n- Think about which step turns a result into standard practice."
  },
  {
    "name": "Question 6",
    "question": "Which of the following are EXTERNAL to the business and are therefore classified as opportunities or threats in a SWOT analysis?",
    "metadata": [
      "A competitor opens a branch next door",
      "Staff recently completed an advanced training course",
      "The business uses outdated machinery",
      "The interest rate rises sharply",
      "The business has strong customer loyalty"
    ],
    "answer": [
      "A competitor opens a branch next door",
      "The interest rate rises sharply",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "business_strategies",
    "topic": "swot_and_pestle_analysis",
    "subtopic": "classification_and_criteria",
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
    "clues": "- Strengths and weaknesses are inside the business; opportunities and threats come from outside it.\n- Ask whether the business could change the item itself."
  },
  {
    "name": "Question 7",
    "question": "The part of job analysis that sets out the qualifications, skills and experience a candidate needs for the position is called the job …",
    "metadata": [
      "description",
      "evaluation",
      "rotation",
      "specification",
      ""
    ],
    "answer": [
      "specification",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "human_resources_function",
    "topic": "job_analysis",
    "subtopic": "term_definition_recall",
    "skills": [
      "define_business_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- One component describes the duties of the post; the other describes the person needed.\n- Job evaluation and job rotation are not parts of job analysis."
  },
  {
    "name": "Question 8",
    "question": "Match each business term in Column A to its description in Column B.",
    "metadata": [
      "A - Backward integration",
      "B - Employment contract",
      "C - Purchasing function",
      "D - Total quality management",
      "1 - Acquiring or merging with a supplier to secure inputs",
      "2 - A legally binding agreement between an employer and an individual employee",
      "3 - Buys inputs of the right quality and quantity at the best price",
      "4 - Involves every employee in continuous improvement to satisfy customers"
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
    "topic": "employment_contracts",
    "subtopic": "term_definition_recall",
    "skills": [
      "define_business_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Integration is about who the business joins up with in the supply chain.\n- Total quality management involves everyone, not only the quality department."
  },
  {
    "name": "Question 9",
    "question": "Match each Act in Column A to its main focus in Column B.",
    "metadata": [
      "A - Skills Development Act",
      "B - Compensation for Occupational Injuries and Diseases Act",
      "C - Basic Conditions of Employment Act",
      "D - National Credit Act",
      "1 - Improving workers' skills through training programmes and levies",
      "2 - Compensating employees injured or made ill through their work",
      "3 - Setting minimum rules on working hours, leave and overtime",
      "4 - Protecting consumers against reckless lending"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "impact_of_business_legislation",
    "topic": "basic_conditions_of_employment",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_legislation_provision"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Match on the key word in each Act's name: skills, injuries, conditions, credit.\n- Only one of these Acts is about lending."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- Think about who the rule on product information protects.\n- Two of the Acts deal with employees and one with lending.",
      "approach": "- Link \"information on packaging\" to consumer protection.\n- Rule out the Acts about employment and credit.",
      "solution": "1. Product information on packaging is a consumer right.\n2. The Act that protects consumers is the Consumer Protection Act (CPA).\n3. The correct answer is C."
    },
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- Ask what kind of factor outdated computers represent.\n- The problem is about equipment, not laws or people.",
      "approach": "- Recall the six PESTLE factors.\n- Match \"outdated computers preventing online transactions\" to the factor about technology.",
      "solution": "1. PESTLE factors are political, economic, social, technological, legal and environmental.\n2. Outdated computers that block online transactions are a technology challenge.\n3. The correct answer is A: technological."
    },
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- The business makes a product from raw materials.\n- It neither extracts the materials nor sells a service.",
      "approach": "- Recall the three sectors: primary, secondary, tertiary.\n- Producing goods from timber and steel is manufacturing.",
      "solution": "1. The primary sector extracts raw materials; the secondary sector manufactures; the tertiary sector provides services.\n2. Producing office chairs from timber and steel is manufacturing.\n3. The correct answer is D: secondary."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- Think about what the interviewer must do to get honest, useful answers.\n- The interviewer assesses; the interviewee does not get help.",
      "approach": "- Consider the interviewer's role in creating a good atmosphere.\n- Eliminate options that help the candidate or turn the interviewer into the interviewee.",
      "solution": "1. A relaxed candidate gives more honest and complete answers.\n2. The interviewer should therefore make the interviewee feel at ease.\n3. The correct answer is A."
    },
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- The step described involves watching processes after they have been put in place.\n- It comes after planning and doing.",
      "approach": "- Recall the PDCA cycle: plan, do, check, act.\n- Match \"monitoring processes to see whether they work\" to its step.",
      "solution": "1. PDCA stands for plan, do, check, act.\n2. Monitoring processes to see whether they function effectively is the checking step.\n3. The correct answer is B: check."
    },
    {
      "number": "1.2.1",
      "marks": 2,
      "clues": "- The strategy aims to widen access to training programmes.\n- It is a national strategy that works through the SETAs.",
      "approach": "- Recall the national strategies linked to the Skills Development Act.\n- Choose the word that completes the strategy's name from the list.",
      "solution": "1. The National Skills Development Strategy aims to increase access to programmes that train people.\n2. The correct word is \"National Skills\"."
    },
    {
      "number": "1.2.2",
      "marks": 2,
      "clues": "- The high crime rate comes from outside the business.\n- It harms the business instead of helping it.",
      "approach": "- Decide whether the factor is internal or external.\n- Decide whether it helps or harms the business.",
      "solution": "1. The crime rate is outside the business's control, so it is external.\n2. Losing customers because of it harms the business.\n3. The correct word is \"threat\"."
    },
    {
      "number": "1.2.3",
      "marks": 2,
      "clues": "- One component lists the duties, the other lists the qualifications needed.\n- The statement is about duties and responsibilities.",
      "approach": "- Recall the two outputs of job analysis.\n- Match \"duties and responsibilities\" to the correct one.",
      "solution": "1. Job analysis produces a job description and a job specification.\n2. The job description outlines the duties and responsibilities of the position.\n3. The correct word is \"job description\"."
    },
    {
      "number": "1.2.4",
      "marks": 2,
      "clues": "- Background checks happen after applicants have been shortlisted.\n- The stage that follows is placing the successful person.",
      "approach": "- Place the HR activities in order: recruitment, selection, placement.\n- Decide where checking the background of shortlisted applicants belongs.",
      "solution": "1. Background checks help decide which qualifying applicant is appointed.\n2. That belongs to the selection procedure.\n3. The correct word is \"selection\"."
    },
    {
      "number": "1.2.5",
      "marks": 2,
      "clues": "- The statement is about improving quality across the business.\n- It describes how quality is managed, not only controlled.",
      "approach": "- Link \"new methods and techniques to improve quality\" to the correct term.\n- Choose the word that completes \"quality …\".",
      "solution": "1. Developing new methods to improve product quality is part of managing quality.\n2. The correct word is \"management\"."
    },
    {
      "number": "1.3.1",
      "marks": 2,
      "clues": "- The term in Column A is Black Economic Empowerment, without the word \"Broad-Based\".\n- Compare the two options about spreading the country's wealth.",
      "approach": "- Recall that Black Economic Empowerment (BEE) concentrated benefits in a small group.\n- Broad-Based BEE was introduced to spread the benefits more widely.",
      "solution": "1. Black Economic Empowerment distributed the country's wealth to a few previously disadvantaged individuals.\n2. Broad-Based BEE spreads it across a broader spectrum of society, which is the other option.\n3. The correct match is D."
    },
    {
      "number": "1.3.2",
      "marks": 2,
      "clues": "- Integration means joining with other businesses.\n- \"Horizontal\" refers to businesses at the same level.",
      "approach": "- Recall what horizontal integration achieves.\n- Choose the description about competition.",
      "solution": "1. Horizontal integration is the merging with or buying of a competitor.\n2. It aims to reduce the threat of competition.\n3. The correct match is J."
    },
    {
      "number": "1.3.3",
      "marks": 2,
      "clues": "- The agreement is between two parties, one of them an individual.\n- It is legally binding.",
      "approach": "- Identify who the two parties to an employment contract are.\n- Choose the description about employer and employee.",
      "solution": "1. An employment contract is signed by the employer and the employee.\n2. It is legally binding.\n3. The correct match is A."
    },
    {
      "number": "1.3.4",
      "marks": 2,
      "clues": "- This function deals with buying.\n- Think about what it buys and how.",
      "approach": "- Recall the purpose of the purchasing function.\n- Pick the description about raw materials and prices.",
      "solution": "1. The purchasing function buys raw materials.\n2. It buys in bulk at lower prices.\n3. The correct match is G."
    },
    {
      "number": "1.3.5",
      "marks": 2,
      "clues": "- TQM involves everyone in the business.\n- Its aims are customer satisfaction and continuous improvement.",
      "approach": "- Recall the aims of total quality management.\n- Pick the description that mentions continuous improvement.",
      "solution": "1. Total quality management focuses on customer satisfaction.\n2. It also aims at continuous improvement in all business processes.\n3. The correct match is H."
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
