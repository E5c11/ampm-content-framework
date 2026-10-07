#!/usr/bin/env node
/**
 * DBE Business Studies P1 — November 2025 — Question 3 (order 3)
 * Section B (Business Operations): fringe benefits, placement, salary determination, LRA, termination, quality control vs assurance, TQM, PR quality indicators. 3.6.1 and 3.6.2 share a scenario but are not exclusion-linked.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2025-nov-p1-q3.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2025-nov-p1-q3.js --dry-run
 *   node scripts/add-business-studies-2025-nov-p1-q3.js
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
  "year": 2025,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "fringe_benefits",
    "placement_procedure",
    "labour_relations_act",
    "quality_assurance",
    "total_quality_management"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q3/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q3/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q3/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q3/memo_5.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which THREE of the following are examples of fringe benefits?",
    "metadata": [
      "A contribution to a pension fund",
      "The basic monthly salary",
      "A subsidised canteen meal",
      "Overtime pay for extra hours worked",
      "Medical aid contributions"
    ],
    "answer": [
      "A contribution to a pension fund",
      "A subsidised canteen meal",
      "Medical aid contributions",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "human_resources_function",
    "topic": "employee_benefits",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Fringe benefits are extras on top of the wages or salary an employee earns.\n- Salary and overtime pay are payment for work done."
  },
  {
    "name": "Question 2",
    "question": "Which action forms part of the placement procedure as a human resources activity?",
    "metadata": [
      "Advertising the vacancy in the local newspaper",
      "Shortlisting applicants who meet the minimum requirements",
      "Using psychometric tests to match the new employee's strengths and interests to the position",
      "Checking the references supplied by the applicants",
      ""
    ],
    "answer": [
      "Using psychometric tests to match the new employee's strengths and interests to the position",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "placement_and_induction",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Placement happens after the person has been selected.\n- Advertising, shortlisting and reference checks all happen before someone is chosen."
  },
  {
    "name": "Question 3",
    "question": "Cedar Clothing pays its machinists a fixed amount for every 50 garments they complete. Which salary determination method is Cedar Clothing using?",
    "metadata": [
      "Piecemeal wages",
      "Time-related wages",
      "A fixed monthly salary",
      "An annual bonus",
      ""
    ],
    "answer": [
      "Piecemeal wages",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "salary_determination",
    "subtopic": "scenario_application",
    "skills": [
      "classify_business_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Ask what the payment is based on: hours worked or units produced.\n- The employee earns more by finishing more garments."
  },
  {
    "name": "Question 4",
    "question": "Which THREE of the following are implications of the Labour Relations Act (LRA) for the human resources function?",
    "metadata": [
      "Employees may be dismissed only after the proper CCMA or bargaining council processes are followed",
      "The employer may set overtime hours without any limits",
      "Workers have the right to form trade unions and workplace forums",
      "The employer must compensate employees injured at work",
      "Unresolved disputes can be referred to the Labour Court"
    ],
    "answer": [
      "Employees may be dismissed only after the proper CCMA or bargaining council processes are followed",
      "Workers have the right to form trade unions and workplace forums",
      "Unresolved disputes can be referred to the Labour Court",
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
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The LRA is about relations and disputes between employers and employees.\n- Overtime limits come from the BCEA, and injury compensation from COIDA."
  },
  {
    "name": "Question 5",
    "question": "Which THREE of the following are valid reasons for the termination of an employment contract?",
    "metadata": [
      "The employee reaches the agreed retirement age",
      "The employee joins a trade union",
      "The employer and employee agree to end the contract",
      "The employee falls pregnant",
      "The period stated in a fixed-term contract expires"
    ],
    "answer": [
      "The employee reaches the agreed retirement age",
      "The employer and employee agree to end the contract",
      "The period stated in a fixed-term contract expires",
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
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Dismissing someone for exercising a legal right is unfair.\n- Look for reasons that arise from the contract itself or from agreement between the parties."
  },
  {
    "name": "Question 6",
    "question": "Match each quality management term in Column A to its description in Column B.",
    "metadata": [
      "A - Quality control",
      "B - Quality assurance",
      "C - Benchmarking",
      "D - Quality circle",
      "1 - Inspecting the finished product to make sure it meets the required standard",
      "2 - Building quality into every stage so the product is right the first time",
      "3 - Comparing practices with the best performers to find better methods",
      "4 - A small group of employees who meet regularly to solve quality problems"
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
    "topic": "quality_control_and_assurance",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_quality_management_concept"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Quality control checks quality after the fact; quality assurance builds it in beforehand.\n- A circle is a group; benchmarking is a comparison."
  },
  {
    "name": "Question 7",
    "question": "Read the scenario and select the TWO ways in which Granite Tiles applies total quality management (TQM) to reduce the cost of quality. Quote from the scenario. Granite Tiles schedules its activities so that no task is carried out twice. Managers and workers share responsibility for the quality of the tiles. The factory is situated next to a railway line. The business was founded in 1998. Its tiles are sold to builders in three provinces.",
    "metadata": [
      "schedules its activities so that no task is carried out twice",
      "Managers and workers share responsibility for the quality of the tiles",
      "The factory is situated next to a railway line",
      "The business was founded in 1998",
      "Its tiles are sold to builders in three provinces"
    ],
    "answer": [
      "schedules its activities so that no task is carried out twice",
      "Managers and workers share responsibility for the quality of the tiles",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "quality_of_performance",
    "topic": "total_quality_management",
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
    "clues": "- Reducing the cost of quality means avoiding waste and mistakes.\n- Location, age and markets say nothing about how quality is managed."
  },
  {
    "name": "Question 8",
    "question": "Which TWO of the following are likely impacts on a business when TQM is poorly implemented?",
    "metadata": [
      "Employees are not adequately trained, resulting in poor-quality products",
      "Fewer products are returned by customers",
      "The reputation of the business suffers because of defective goods",
      "Productivity improves because of fewer stoppages",
      "Customers become more loyal to the brand"
    ],
    "answer": [
      "Employees are not adequately trained, resulting in poor-quality products",
      "The reputation of the business suffers because of defective goods",
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
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Poor implementation produces the opposite of what TQM promises.\n- Eliminate every option that describes an improvement."
  },
  {
    "name": "Question 9",
    "question": "Which of the following is an advantage of monitoring and evaluating quality processes for a large business?",
    "metadata": [
      "Employees no longer need training",
      "Deviations from the set standards are corrected, which reduces the cost of production",
      "Quality checks are done only once, at the end of the year",
      "Competitors are prevented from entering the market",
      ""
    ],
    "answer": [
      "Deviations from the set standards are corrected, which reduces the cost of production",
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
    "clues": "- Monitoring means measuring performance regularly against a standard.\n- A benefit must follow from doing the monitoring, not replace other activities entirely."
  },
  {
    "name": "Question 10",
    "question": "Which TWO of the following are quality indicators of the public relations function?",
    "metadata": [
      "Positive results from surveys on the public's view of the business's image",
      "A rise in the price of raw materials",
      "Negative publicity is dealt with quickly",
      "A reduction in the number of employees",
      "An increase in the number of products manufactured"
    ],
    "answer": [
      "Positive results from surveys on the public's view of the business's image",
      "Negative publicity is dealt with quickly",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "quality_of_performance",
    "topic": "purchasing_and_public_relations",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Public relations is about the image of the business with the public.\n- Production volumes and staff numbers belong to other functions."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1",
      "marks": 4,
      "clues": "- Fringe benefits are extras on top of wages.\n- Four examples are needed.",
      "approach": "- Recall employee benefits other than salary.\n- Give four, 1 mark each.",
      "solution": "1. Pension fund.\n2. Medical aid fund.\n3. Funeral benefit or provident fund.\n4. Allowances such as car, travel, housing or cell phone; staff discount or subsidised meals. Mark the first four only."
    },
    {
      "number": "3.2",
      "marks": 6,
      "clues": "- Placement follows selection.\n- It matches the new employee to the position.",
      "approach": "- Outline the placement procedure step by step.\n- Make three points of two marks each.",
      "solution": "1. Outline the responsibilities, expectations and skills of the new position.\n2. Use psychometric tests to determine the candidate's strengths, weaknesses, interests and skills.\n3. Determine the relationship between the position and the competencies of the new employee."
    },
    {
      "number": "3.3.1",
      "marks": 2,
      "clues": "- Look at what the employees are paid for in the scenario.\n- They are paid for output, not hours.",
      "approach": "- Name the method of salary determination.\n- Link it to the scenario.",
      "solution": "1. FW pays employees according to the number of rolls of material they sell.\n2. Pay based on output is the piecemeal method."
    },
    {
      "number": "3.3.2",
      "marks": 4,
      "clues": "- The LRA regulates employer-employee relations.\n- Think about disputes, dismissals, unions and the courts.",
      "approach": "- Explain what the Act means for HR work.\n- Make two points with explanations.",
      "solution": "1. It promotes the resolution of labour disputes between employer and employees.\n2. It protects the rights of employees and employers as set out in the Constitution.\n3. Unresolved disputes may be referred to the Labour Courts.\n4. Workers cannot easily be dismissed because bargaining council or CCMA processes must be followed. Any two, 2 marks each."
    },
    {
      "number": "3.4",
      "marks": 4,
      "clues": "- Termination can come from either party or from the contract itself.\n- Advise businesses on the reasons.",
      "approach": "- Recall the reasons contracts end.\n- Give two with an explanation.",
      "solution": "1. Dismissal for a valid reason such as misconduct or poor performance.\n2. Redundancy or retrenchment.\n3. Resignation, retirement, illness or injury.\n4. Mutual agreement or expiry of the contract period. Any two, 2 marks each."
    },
    {
      "number": "3.5",
      "marks": 4,
      "clues": "- One checks the final product; the other builds quality in during production.\n- The difference must be clear.",
      "approach": "- Define each term briefly.\n- State the difference.",
      "solution": "1. Quality control inspects the final product to make sure it meets the required standard.\n2. Quality assurance ensures the required standards are met at every stage of the process.\n3. Control checks quality; assurance builds it in. Two marks each."
    },
    {
      "number": "3.6.1",
      "marks": 2,
      "clues": "- Only quoted words earn marks.\n- Look for ways to avoid duplication and share responsibility.",
      "approach": "- Find the TQM practices in the scenario.\n- Quote two.",
      "solution": "1. \"BM schedule their activities to avoid the duplication of tasks\": 1 mark.\n2. \"The management of BM shares the responsibility for quality output with employees\": 1 mark."
    },
    {
      "number": "3.6.2",
      "marks": 4,
      "clues": "- Think about what goes wrong when TQM is badly done.\n- Consider employees, customers and reputation.",
      "approach": "- Discuss the negative impact.\n- Give two impacts with an explanation each.",
      "solution": "1. Unrealistic deadlines may not be achieved.\n2. Untrained employees produce poor-quality products.\n3. The business's reputation suffers because of defective goods.\n4. Sales decline as unhappy customers return goods. Any two, 2 marks each."
    },
    {
      "number": "3.7",
      "marks": 6,
      "clues": "- Monitoring and evaluation is one TQM element.\n- The advantages apply to large businesses.",
      "approach": "- Describe the benefits of checking quality processes.\n- Give three advantages with explanations.",
      "solution": "1. It prevents product defects and minimises wastage.\n2. It helps the business get things right the first time.\n3. It reduces the cost of production because deviations are corrected.\n4. It supports informed decisions about processes. Any three, 2 marks each."
    },
    {
      "number": "3.8",
      "marks": 4,
      "clues": "- The PR function manages the image of the business.\n- Quality indicators show whether PR is working.",
      "approach": "- Advise on measures of good PR.\n- Give two indicators with a short explanation.",
      "solution": "1. Negative publicity is dealt with quickly.\n2. Regular positive press releases are issued.\n3. Sustainable CSI programmes are implemented.\n4. Positive feedback from surveys on the business's image. Any two, 2 marks each."
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
