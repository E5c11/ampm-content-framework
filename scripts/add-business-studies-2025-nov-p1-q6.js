#!/usr/bin/env node
/**
 * DBE Business Studies P1 — November 2025 — Question 6 (order 6)
 * Section C essay (Business Operations — human resources function). DESIGN-BUS-03: content items on the four stated aspects plus LASO rubric items; no free text, no verbatim memo prose.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2025-nov-p1-q6.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2025-nov-p1-q6.js --dry-run
 *   node scripts/add-business-studies-2025-nov-p1-q6.js
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
  "year": 2025,
  "paper": "nov_p1",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "recruitment_procedure",
    "internal_recruitment",
    "employment_contract",
    "interviewing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q6/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q6/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q6/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q6/memo_5.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q6/memo_6.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which THREE of the following are part of the recruitment procedure as a human resources activity?",
    "metadata": [
      "Preparing a job analysis that includes the job description and job specification",
      "Using psychometric tests to place the new employee in the position",
      "Deciding whether to recruit internally or externally",
      "Negotiating the salary with the successful candidate",
      "Placing the advertisement in media that will reach suitable candidates"
    ],
    "answer": [
      "Preparing a job analysis that includes the job description and job specification",
      "Deciding whether to recruit internally or externally",
      "Placing the advertisement in media that will reach suitable candidates",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Recruitment attracts a pool of suitable applicants.\n- Testing for placement and negotiating salaries happen after candidates have been selected."
  },
  {
    "name": "Question 2",
    "question": "Which THREE of the following are advantages of internal recruitment?",
    "metadata": [
      "It is usually cheaper and quicker to fill the post",
      "It brings fresh ideas from outside the business",
      "Management already knows the employee's skills and strengths, so placement is easier",
      "It opens up a very wide pool of applicants",
      "It provides opportunities for career paths within the business"
    ],
    "answer": [
      "It is usually cheaper and quicker to fill the post",
      "Management already knows the employee's skills and strengths, so placement is easier",
      "It provides opportunities for career paths within the business",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "recruitment_and_selection",
    "subtopic": "classification_and_criteria",
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
    "clues": "- Internal recruitment fills the post from the current staff.\n- Fresh outside ideas and a wide pool of applicants are advantages of external recruitment."
  },
  {
    "name": "Question 3",
    "question": "Which TWO of the following are disadvantages of internal recruitment?",
    "metadata": [
      "Promoting one employee may cause resentment among other employees",
      "It costs more to advertise in national newspapers",
      "The number of applicants is limited to current staff",
      "It takes longer than external recruitment because outside references must be checked",
      "It gives managers less information about the applicants"
    ],
    "answer": [
      "Promoting one employee may cause resentment among other employees",
      "The number of applicants is limited to current staff",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "recruitment_and_selection",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_hr_procedure"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about what is lost when the business looks only inside itself.\n- Two options describe costs of external, not internal, recruitment."
  },
  {
    "name": "Question 4",
    "question": "Which THREE of the following tasks should the interviewer complete BEFORE the interview?",
    "metadata": [
      "Develop a core set of questions based on the skills and knowledge required",
      "Rate and compare the candidates' performance",
      "Read each candidate's application and CV for anything that needs clarification",
      "Allow the candidate to ask questions at the end",
      "Inform all shortlisted candidates of the date and place of the interview"
    ],
    "answer": [
      "Develop a core set of questions based on the skills and knowledge required",
      "Read each candidate's application and CV for anything that needs clarification",
      "Inform all shortlisted candidates of the date and place of the interview",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "interviewing",
    "subtopic": "sequencing_and_process",
    "skills": [
      "explain_hr_procedure"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Preparation includes planning questions, studying the applications and making arrangements.\n- Rating the candidates and candidate questions happen during or after the interview."
  },
  {
    "name": "Question 5",
    "question": "Why should the interviewer plan to give every candidate the same amount of time?",
    "metadata": [
      "To finish the interviews as quickly as possible",
      "To treat all candidates fairly and allow them equal opportunity to present themselves",
      "To avoid reading the candidates' CVs",
      "To make sure the longest candidate is appointed",
      ""
    ],
    "answer": [
      "To treat all candidates fairly and allow them equal opportunity to present themselves",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "human_resources_function",
    "topic": "interviewing",
    "subtopic": "scenario_application",
    "skills": [
      "explain_hr_procedure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Consistency is a mark of a professional interview.\n- Fairness to the candidates is the purpose."
  },
  {
    "name": "Question 6",
    "question": "Which THREE of the following are legal requirements of an employment contract?",
    "metadata": [
      "Both the employer and the employee must sign the contract",
      "The employer may change the terms without informing the employee",
      "The contract may not conflict with the Basic Conditions of Employment Act",
      "No party may unilaterally change the contract",
      "The terms need not be explained to the employee"
    ],
    "answer": [
      "Both the employer and the employee must sign the contract",
      "The contract may not conflict with the Basic Conditions of Employment Act",
      "No party may unilaterally change the contract",
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
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A contract is an agreement between two parties and is legally binding.\n- Changes need the agreement of both parties."
  },
  {
    "name": "Question 7",
    "question": "Arrange the parts of an essay on the human resources function in the order in which the question asks for them.",
    "metadata": [
      "Explain the role of the interviewer before the interview",
      "Conclusion",
      "Advise on the legal requirements of an employment contract",
      "Outline the recruitment procedure",
      "Introduction",
      "Discuss the impact of internal recruitment"
    ],
    "answer": [
      "Introduction",
      "Outline the recruitment procedure",
      "Discuss the impact of internal recruitment",
      "Explain the role of the interviewer before the interview",
      "Advise on the legal requirements of an employment contract",
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
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The essay should follow the order of the four aspects in the question.\n- The introduction opens the essay and the conclusion closes it."
  },
  {
    "name": "Question 8",
    "question": "Which approach best shows \"Analysis and interpretation\" in this essay?",
    "metadata": [
      "Writing one long paragraph that mixes all four aspects together",
      "Giving each of the four aspects its own heading and answering what each one asks",
      "Copying the essay question into the introduction",
      "Writing only about the aspect the candidate knows best",
      ""
    ],
    "answer": [
      "Giving each of the four aspects its own heading and answering what each one asks",
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
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- This component tests whether the question has been broken down correctly.\n- Headings and sub-headings help show it."
  },
  {
    "name": "Question 9",
    "question": "A candidate answers three of the four aspects of the essay using only relevant facts. What is the maximum number of marks for Synthesis?",
    "metadata": [
      "0",
      "1",
      "2",
      "4",
      ""
    ],
    "answer": [
      "2",
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
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Synthesis is one of four Insight components worth 2 marks each.\n- Answering at least half of the aspects with only relevant facts earns the maximum."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 40,
      "clues": "- Cover all four aspects: recruitment procedure, internal recruitment, the interviewer's pre-interview role and the legal requirements of an employment contract.\n- Address at least two aspects in the introduction and one in the conclusion.",
      "approach": "- State the word INTRODUCTION and preview at least two aspects in your own words.\n- Give each aspect its own heading, in the order the question asks.\n- Include a recent, real example in at least two aspects for Originality.\n- State the word CONCLUSION and sum up at least one aspect without repeating the introduction.",
      "solution": "1. Introduction: accurate recruitment procedures help appoint suitable people and the law guides the contract.\n2. Recruitment procedure: job analysis with job description and specification, choose internal or external method, prepare and place the advertisement.\n3. Internal recruitment: cheaper, quicker, easy placement and career paths; but limited applicants, resentment and disruption.\n4. Interviewer before the interview: book the venue, inform candidates and panel, prepare core questions, study CVs, plan the time per candidate.\n5. Employment contract: signed by both parties, no unilateral changes, no conflict with the BCEA, terms explained, remuneration and duties stated.\n6. Conclusion: correct recruitment, a prepared interviewer and a lawful contract help the business avoid disputes."
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
