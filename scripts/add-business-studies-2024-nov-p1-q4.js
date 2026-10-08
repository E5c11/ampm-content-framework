#!/usr/bin/env node
/**
 * DBE Business Studies P1 — November 2024 — Question 4 (order 4)
 * Section B (Miscellaneous): 4.1-4.4 Business Environments (BCEA provisions, NCA consumer rights, strategy evaluation, power of suppliers); 4.5-4.8 Business Operations (employment contract aspects, job analysis, quality circles, general management quality indicators).
 * 4.3 is an exclusion pair (DESIGN-UNI-13): the follow-up asks for OTHER evaluation steps, so the two steps quoted from the scenario are offered as wrong options. 4.6 (a two-column table) becomes a match plus a scenario classification.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2024-nov-p1-q4.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2024-nov-p1-q4.js --dry-run
 *   node scripts/add-business-studies-2024-nov-p1-q4.js
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
  "year": 2024,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "basic_conditions_of_employment",
    "national_credit_act",
    "strategic_management_process",
    "job_analysis",
    "quality_circles"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q4/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q4/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q4/memo_4.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which THREE of the following are provisions of the Basic Conditions of Employment Act (BCEA)?",
    "metadata": [
      "Regulation of working hours and overtime",
      "A five-day cooling-off period for direct sales",
      "Leave such as annual, sick and maternity leave",
      "Compensation for injuries suffered on duty",
      "Prohibition of child labour and forced labour"
    ],
    "answer": [
      "Regulation of working hours and overtime",
      "Leave such as annual, sick and maternity leave",
      "Prohibition of child labour and forced labour",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The BCEA sets minimum conditions of employment.\n- Cooling-off periods and injury compensation come from two other Acts."
  },
  {
    "name": "Question 2",
    "question": "Which THREE of the following are rights of consumers in terms of the National Credit Act (NCA)?",
    "metadata": [
      "To receive reasons why credit was refused",
      "To have any debt cancelled after twelve months",
      "To receive information in plain, understandable language",
      "To be granted credit regardless of their ability to pay",
      "To apply for debt review if repayments become unaffordable"
    ],
    "answer": [
      "To receive reasons why credit was refused",
      "To receive information in plain, understandable language",
      "To apply for debt review if repayments become unaffordable",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "impact_of_business_legislation",
    "topic": "consumer_and_credit_legislation",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_legislation_provision"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The NCA promotes responsible borrowing as well as responsible lending.\n- No law cancels debt automatically or forces reckless lending."
  },
  {
    "name": "Question 3",
    "question": "Read the scenario and select the TWO steps in strategy evaluation that Mzansi Gym carried out. Quote from the scenario. Mzansi Gym introduced a loyalty programme to keep its members. Six months later, management compared the expected number of renewals with the actual number of renewals. They also set specific dates for follow-up meetings to control the programme. The gym recently installed new treadmills, and members can now book classes online.",
    "metadata": [
      "Mzansi Gym introduced a loyalty programme to keep its members",
      "management compared the expected number of renewals with the actual number of renewals",
      "They also set specific dates for follow-up meetings to control the programme",
      "The gym recently installed new treadmills",
      "members can now book classes online"
    ],
    "answer": [
      "management compared the expected number of renewals with the actual number of renewals",
      "They also set specific dates for follow-up meetings to control the programme",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "business_strategies",
    "topic": "strategic_management_process",
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
    "clues": "- Evaluation happens after a strategy has been put in place.\n- Introducing the programme is implementation, not evaluation."
  },
  {
    "name": "Question 4",
    "question": "Mzansi Gym has already compared expected with actual renewals and set dates for follow-up. Which TWO of the following are OTHER steps in strategy evaluation?",
    "metadata": [
      "Compare the expected performance with the actual performance",
      "Determine the reasons for deviations and analyse them",
      "Set specific dates for control and follow-up",
      "Take corrective action so that deviations are corrected",
      "Conduct a SWOT analysis to formulate a new strategy"
    ],
    "answer": [
      "Determine the reasons for deviations and analyse them",
      "Take corrective action so that deviations are corrected",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "business_strategies",
    "topic": "strategic_management_process",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_business_strategy"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The question asks for OTHER steps, so rule out what the gym already did.\n- A SWOT analysis belongs to an earlier stage of the process."
  },
  {
    "name": "Question 5",
    "question": "Which statement correctly describes the power of suppliers as a force in Porter's Five Forces model?",
    "metadata": [
      "The more suppliers there are, the more power each one has",
      "Suppliers of common, easily found goods have the most power",
      "Powerful suppliers give the business more control over them",
      "The fewer the suppliers, the more power they may have",
      ""
    ],
    "answer": [
      "The fewer the suppliers, the more power they may have",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "business_strategies",
    "topic": "porters_five_forces",
    "subtopic": "classification_and_criteria",
    "skills": [
      "analyse_business_environment"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Think about what happens when a business has little choice of supplier.\n- Scarce or unique supplies strengthen the supplier, not the business."
  },
  {
    "name": "Question 6",
    "question": "Which THREE of the following aspects should be included in an employment contract?",
    "metadata": [
      "Job title and a description of the duties",
      "The employee's political party membership",
      "Remuneration and deductions from pay",
      "The names of the other shortlisted candidates",
      "The length of the probation period"
    ],
    "answer": [
      "Job title and a description of the duties",
      "Remuneration and deductions from pay",
      "The length of the probation period",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "human_resources_function",
    "topic": "employment_contracts",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_hr_procedure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A contract sets out the terms of the job between employer and employee.\n- Two options are private or irrelevant information."
  },
  {
    "name": "Question 7",
    "question": "Match each term in Column A to its description in Column B.",
    "metadata": [
      "A - Job analysis",
      "B - Job description",
      "C - Job specification",
      "D - Job advertisement",
      "1 - Studying a job to find out what it involves and requires",
      "2 - Lists the tasks, duties and responsibilities of the job",
      "3 - Lists the qualifications, skills and experience needed",
      "4 - Announces the vacancy to attract suitable applicants"
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
    "topic": "job_analysis",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Job analysis is the process; two of the other terms are its outcomes.\n- A description is about the job; a specification is about the person."
  },
  {
    "name": "Question 8",
    "question": "Tswelopele Electrical's job analysis for a site electrician contains the statements below. Which TWO belong to the JOB SPECIFICATION?",
    "metadata": [
      "Applicants must hold a trade certificate in electrical work",
      "The electrician will install wiring in new houses",
      "Applicants need at least three years of site experience",
      "The electrician will test circuits for safety",
      "The electrician will supervise two apprentices"
    ],
    "answer": [
      "Applicants must hold a trade certificate in electrical work",
      "Applicants need at least three years of site experience",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "job_analysis",
    "subtopic": "scenario_application",
    "skills": [
      "explain_hr_procedure"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Sort each statement: is it about the person or about the work?\n- Statements about what the electrician will do belong to the job description."
  },
  {
    "name": "Question 9",
    "question": "Which THREE of the following are roles of quality circles as part of continuous improvement to processes and systems?",
    "metadata": [
      "Investigate quality problems and suggest solutions",
      "Set the long-term strategic direction of the business",
      "Make suggestions to improve processes and systems",
      "Approve the annual budget of each department",
      "Improve communication between employees at all levels"
    ],
    "answer": [
      "Investigate quality problems and suggest solutions",
      "Make suggestions to improve processes and systems",
      "Improve communication between employees at all levels",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "quality_of_performance",
    "topic": "quality_circles_and_continuous_improvement",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_quality_management_concept"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A quality circle is a small group of workers who meet to discuss quality.\n- They suggest improvements; they do not run the business."
  },
  {
    "name": "Question 10",
    "question": "Which of the following is a quality indicator of the general management function?",
    "metadata": [
      "Keeps accurate records of all transactions",
      "Develops and monitors effective strategic plans",
      "Buys raw materials at the best possible prices",
      "Runs machinery at full production capacity",
      ""
    ],
    "answer": [
      "Develops and monitors effective strategic plans",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "quality_of_performance",
    "topic": "business_function_quality_indicators",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- General management sets direction for the whole business.\n- The other options belong to the administration, purchasing and production functions."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1",
      "marks": 4,
      "clues": "- The BCEA sets minimum conditions of employment.\n- Think about time, leave, pay and termination.",
      "approach": "- Recall the main areas the BCEA regulates.\n- Name four, 1 mark each; only the first four are marked.",
      "solution": "1. Working time: ordinary hours, overtime, meal intervals and rest periods.\n2. Leave: annual, sick, family responsibility, maternity and parental.\n3. Particulars of employment and remuneration.\n4. Termination of employment, and the prohibition of child and forced labour."
    },
    {
      "number": "4.2",
      "marks": 6,
      "clues": "- The NCA protects people who borrow.\n- Think about applying, information, debt review and credit records.",
      "approach": "- Recall what consumers may expect from credit providers.\n- Outline three rights, 2 marks each.",
      "solution": "1. Apply for credit without discrimination, and receive reasons if refused.\n2. Receive pre-agreement documents and information in plain language.\n3. Apply for debt review if they cannot afford repayments.\n4. Access and challenge credit records, and refuse a credit limit increase. Any three, 2 marks each."
    },
    {
      "number": "4.3.1",
      "marks": 2,
      "clues": "- Only words quoted from the scenario earn marks.\n- Look for what management did after implementing the strategy.",
      "approach": "- Find the statements describing evaluation activities.\n- Quote two, 1 mark each.",
      "solution": "1. \"SB examined the underlying basis of their strategy throughout the implementation process.\"\n2. \"They also analysed the impact of the implemented strategy on their internal and external environments.\""
    },
    {
      "number": "4.3.2",
      "marks": 4,
      "clues": "- Steps already quoted in 4.3.1 earn no marks.\n- Think about comparing, deviations and corrective action.",
      "approach": "- List the remaining steps of strategy evaluation.\n- Explain two, with a fact and an explanation each.",
      "solution": "1. Compare the expected performance with the actual performance.\n2. Determine the reasons for deviations and analyse them.\n3. Take corrective action so that deviations are corrected.\n4. Set specific dates for control and follow-up, or look forward and backward into the implementation process. Any two, 2 marks each."
    },
    {
      "number": "4.4",
      "marks": 4,
      "clues": "- Suppliers can influence prices, quality and delivery.\n- Think about how many suppliers there are and how unique their products are.",
      "approach": "- Explain how a business assesses supplier power.\n- Advise with two points, 2 marks each.",
      "solution": "1. Assess how much power suppliers have to influence prices.\n2. Suppliers of high-quality, unique or scarce products may have power over the business.\n3. The fewer the suppliers, the more powerful they may be.\n4. Identify supplier power regarding quality, reliability and prompt delivery. Any two, 2 marks each."
    },
    {
      "number": "4.5",
      "marks": 4,
      "clues": "- A contract records the terms of the job.\n- Think about personal details, the job, pay and conditions.",
      "approach": "- Recall what an employment contract contains.\n- State four aspects, 1 mark each; only the first four are marked.",
      "solution": "1. Personal details of the employee and details of the employer.\n2. Job title, job description and place of work.\n3. Hours of work, remuneration, benefits and deductions.\n4. Leave, probation period, duration of the contract and signatures of both parties."
    },
    {
      "number": "4.6",
      "marks": 6,
      "clues": "- A job analysis has two components.\n- One is about the person, the other about the work.",
      "approach": "- Identify each component (2 marks) and quote the matching motivation (1 mark).\n- A motivation earns nothing if its component is wrong.",
      "solution": "1. Job specification: \"MC indicated that applicants must have a diploma in construction.\"\n2. Job description: \"The successful candidate will compile progress reports on assigned projects.\""
    },
    {
      "number": "4.7",
      "marks": 6,
      "clues": "- Quality circles are small groups of workers who meet about quality.\n- Think about problems, suggestions, morale and communication.",
      "approach": "- Recall what quality circles contribute to continuous improvement.\n- Explain three roles, each with a fact and an explanation.",
      "solution": "1. Solve quality problems and implement improvements.\n2. Investigate problems and suggest solutions to management.\n3. Make suggestions to improve processes and avoid duplication.\n4. Increase morale and improve communication at all levels. Any three, 2 marks each."
    },
    {
      "number": "4.8",
      "marks": 4,
      "clues": "- General management leads the whole business.\n- Think about plans, resources, vision and example.",
      "approach": "- Recall quality indicators of the general management function.\n- Advise with two, 2 marks each.",
      "solution": "1. Develop, implement and monitor effective strategic plans.\n2. Allocate resources efficiently to achieve long- and short-term plans.\n3. Communicate a shared vision, mission and values.\n4. Set an example of ethical, productive behaviour and ensure deadlines are met. Any two, 2 marks each."
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
