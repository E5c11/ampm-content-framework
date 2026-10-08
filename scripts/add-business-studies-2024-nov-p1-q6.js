#!/usr/bin/env node
/**
 * DBE Business Studies P1 — November 2024 — Question 6 (order 6)
 * Section C essay (DESIGN-BUS-03): Human resources function. Content items on the four bullets (selection procedure, salary determination methods, impact of fringe benefits, benefits of induction) plus LASO-rubric strategy items.
 * The memo accepts the selection procedure in any order, so it is a multi_select, not an ordering item. Q6 shares its question page with Q5 (paper page 9), so the Q5 image URL is reused.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2024-nov-p1-q6.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2024-nov-p1-q6.js --dry-run
 *   node scripts/add-business-studies-2024-nov-p1-q6.js
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
  "name": "Question 6",
  "syllabus": "dbe",
  "subject": "business_studies",
  "year": 2024,
  "paper": "nov_p1",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "selection_procedure",
    "salary_determination",
    "fringe_benefits",
    "induction",
    "essay_writing_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q5/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q6/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q6/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q6/memo_4.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which THREE of the following are steps in the SELECTION procedure?",
    "metadata": [
      "Advertise the vacancy in a national newspaper",
      "Sort the applications according to the selection criteria",
      "Check references to verify the information in the CVs",
      "Introduce the new employee to colleagues on the first day",
      "Make a written offer to the selected candidate"
    ],
    "answer": [
      "Sort the applications according to the selection criteria",
      "Check references to verify the information in the CVs",
      "Make a written offer to the selected candidate",
      "",
      ""
    ],
    "presentation": "multi_select",
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
    "order": 1,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Selection starts once applications have been received.\n- Advertising comes before selection, and welcoming a new employee comes after it."
  },
  {
    "name": "Question 2",
    "question": "Machinists at Kwena Garments are paid R15 for every shirt they finish, no matter how long each shirt takes. Which salary determination method does Kwena Garments use?",
    "metadata": [
      "Time-related method",
      "Commission method",
      "Overtime method",
      "Piecemeal method",
      ""
    ],
    "answer": [
      "Piecemeal method",
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
      "explain_hr_procedure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Pay is linked to output, not hours.\n- Commission is linked to sales made, not items produced."
  },
  {
    "name": "Question 3",
    "question": "A machinist at Kwena Garments finishes 120 shirts in a week at R15 per shirt. What is her pay for the week?",
    "metadata": [
      "R1 800",
      "R180",
      "R18 000",
      "R1 500",
      ""
    ],
    "answer": [
      "R1 800",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "calc",
    "unit": "human_resources_function",
    "topic": "salary_determination",
    "subtopic": "scenario_application",
    "skills": [
      "explain_hr_procedure"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Under this method, pay = number of items x rate per item.\n- Check your answer by estimating: about 100 shirts at R15."
  },
  {
    "name": "Question 4",
    "question": "Which TWO statements describe the TIME-RELATED salary determination method?",
    "metadata": [
      "Workers are paid for each item they produce",
      "Workers are paid for the hours they spend at work",
      "It is mostly used in textile and clothing factories",
      "Workers with the same qualifications share a salary scale",
      "Pay depends only on the profit the business makes"
    ],
    "answer": [
      "Workers are paid for the hours they spend at work",
      "Workers with the same qualifications share a salary scale",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "human_resources_function",
    "topic": "salary_determination",
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
    "clues": "- Two of the wrong options describe the other salary determination method.\n- Under this method, pay does not depend on the amount of work done."
  },
  {
    "name": "Question 5",
    "question": "Which TWO of the following are POSITIVE impacts of fringe benefits on businesses?",
    "metadata": [
      "Attractive packages may reduce staff turnover",
      "Unequal benefit plans may cause staff resentment",
      "They help attract skilled and experienced employees",
      "The extra costs may cause cash-flow problems",
      "Administration costs rise to record them for tax"
    ],
    "answer": [
      "Attractive packages may reduce staff turnover",
      "They help attract skilled and experienced employees",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "employee_benefits",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_hr_procedure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Look at each statement from the business owner's point of view.\n- Three statements describe costs or problems."
  },
  {
    "name": "Question 6",
    "question": "Which of the following is a NEGATIVE impact of fringe benefits on businesses?",
    "metadata": [
      "Productivity may rise, leading to higher profits",
      "Some workers may stay only for the benefits",
      "Benefits can be used as leverage in salary talks",
      "Employee loyalty and job satisfaction may increase",
      ""
    ],
    "answer": [
      "Some workers may stay only for the benefits",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "employee_benefits",
    "subtopic": "classification_and_criteria",
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
    "clues": "- Three options are advantages.\n- Consider an employee who is committed to the perks rather than the work."
  },
  {
    "name": "Question 7",
    "question": "Which THREE of the following are benefits of induction for businesses?",
    "metadata": [
      "New employees settle in quickly and work effectively",
      "The business no longer needs to recruit staff",
      "New employees understand the rules and safety regulations",
      "New employees may skip their probation period",
      "Staff turnover is reduced"
    ],
    "answer": [
      "New employees settle in quickly and work effectively",
      "New employees understand the rules and safety regulations",
      "Staff turnover is reduced",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "placement_and_induction",
    "subtopic": "classification_and_criteria",
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
    "clues": "- Induction introduces a new employee to the business.\n- It does not replace recruitment or the terms of the contract."
  },
  {
    "name": "Question 8",
    "question": "Arrange the parts of an essay on the human resources function in the order in which the question asks for them.",
    "metadata": [
      "Advise on the benefits of induction",
      "Explain the two salary determination methods",
      "Conclusion",
      "Outline the selection procedure",
      "Introduction",
      "Discuss the impact of fringe benefits"
    ],
    "answer": [
      "Introduction",
      "Outline the selection procedure",
      "Explain the two salary determination methods",
      "Discuss the impact of fringe benefits",
      "Advise on the benefits of induction",
      "Conclusion"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "recruitment_and_selection",
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
    "paper": "nov_p1",
    "clues": "- Follow the order of the bullets in the question.\n- The essay opens and closes with its own sections."
  },
  {
    "name": "Question 9",
    "question": "Which TWO of the following earn the marks for Analysis and Interpretation in a Section C essay?",
    "metadata": [
      "Writing more than four pages",
      "Giving every aspect its own heading",
      "Underlining every heading in the essay",
      "Earning between 16 and 32 marks for facts",
      "Quoting the textbook word for word"
    ],
    "answer": [
      "Giving every aspect its own heading",
      "Earning between 16 and 32 marks for facts",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "recruitment_and_selection",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "evaluate_essay_layout_compliance"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- One mark is for breaking the question into its parts.\n- The other mark depends on how well the content is interpreted, measured in marks for facts."
  },
  {
    "name": "Question 10",
    "question": "A candidate misreads the essay and writes about the recruitment procedure instead of the selection procedure, but writes INTRODUCTION and CONCLUSION with a short explanation under each. Which Insight marks can the candidate still earn, according to the marking guideline?",
    "metadata": [
      "Analysis and Interpretation",
      "No Insight marks at all",
      "Layout",
      "Synthesis",
      ""
    ],
    "answer": [
      "Layout",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "recruitment_and_selection",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "evaluate_essay_layout_compliance"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Misreading the question harms the marks that depend on relevance.\n- One component is about structure only."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 40,
      "clues": "- Cover all four aspects: selection procedure, salary determination methods, fringe benefits and induction.\n- Address at least two aspects in the introduction and one in the conclusion.",
      "approach": "- State the word INTRODUCTION and preview at least two aspects in your own words.\n- Give each of the four aspects its own heading, in the order the question asks; outline and advise briefly, explain and discuss with reasons.\n- For salary determination, name both methods and explain each.\n- State the word CONCLUSION and sum up at least one aspect without repeating the introduction; add a recent, real example in at least two aspects for Originality.",
      "solution": "1. Introduction: careful selection appoints competent staff, and fair pay, benefits and induction build a productive workforce (2 marks).\n2. Selection procedure, in any order: set assessment criteria, receive and sort applications, screen and check references, shortlist, test and interview, make a written offer, inform unsuccessful applicants (12 marks).\n3. Salary determination: piecemeal (paid per item produced, common in factories) and time-related (paid for hours worked, often on salary scales) (12 marks).\n4. Impact of fringe benefits: positive (retention, attract skilled staff, productivity, tax-deductible) and/or negative (extra costs, resentment if unequal, admin costs, staff who stay only for perks) (12 marks).\n5. Benefits of induction: new staff settle in quickly, understand rules and safety, build relationships, need less training, lower staff turnover (10 marks).\n6. Conclusion (2 marks). Facts are capped at 32; Layout, Analysis, Synthesis and Originality add 2 marks each."
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
