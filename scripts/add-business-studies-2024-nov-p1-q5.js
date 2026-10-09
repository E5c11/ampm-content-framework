#!/usr/bin/env node
/**
 * DBE Business Studies P1 — November 2024 — Question 5 (order 5)
 * Section C essay (DESIGN-BUS-03): Skills Development Act. Content items on the four bullets (role of SETAs, purpose, impact, compliance) plus LASO-rubric strategy items.
 * No memo model-answer prose is quoted; rubric mechanics are paraphrased. One aiExplanation guidance entry (marks 40), same as the 2025 essays.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2024-nov-p1-q5.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2024-nov-p1-q5.js --dry-run
 *   node scripts/add-business-studies-2024-nov-p1-q5.js
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
  "name": "Question 5",
  "syllabus": "dbe",
  "subject": "business_studies",
  "year": 2024,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "skills_development_act",
    "setas",
    "essay_writing_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q5/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q5/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q5/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p1/q5/memo_4.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which THREE of the following are roles of SETAs in supporting the Skills Development Act (SDA)?",
    "metadata": [
      "Promote and establish learnerships",
      "Settle disputes between employers and trade unions",
      "Approve workplace skills plans and training reports",
      "Register credit providers in their sector",
      "Collect levies and pay out grants as required"
    ],
    "answer": [
      "Promote and establish learnerships",
      "Approve workplace skills plans and training reports",
      "Collect levies and pay out grants as required",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "impact_of_business_legislation",
    "topic": "skills_development_and_setas",
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
    "clues": "- SETAs oversee training in their own sector of the economy.\n- Dispute resolution and credit registration belong to other bodies."
  },
  {
    "name": "Question 2",
    "question": "Which statement best describes the purpose of the Skills Development Act?",
    "metadata": [
      "To ensure that employees receive equal pay for work of equal value",
      "To set the minimum working hours and leave for all employees",
      "To develop workforce skills so that productivity improves",
      "To provide a framework for collective bargaining and legal strikes",
      ""
    ],
    "answer": [
      "To develop workforce skills so that productivity improves",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Each option describes the purpose of a different Act.\n- Match the purpose to the name of the Act."
  },
  {
    "name": "Question 3",
    "question": "Which TWO of the following are NEGATIVE impacts of the SDA on businesses?",
    "metadata": [
      "Part of the training costs can be claimed back from a SETA",
      "The skills levy can burden businesses that are struggling",
      "Skilled workers improve the quality of products and services",
      "Training is wasted if skilled employees leave the business",
      "The workplace becomes an active learning environment"
    ],
    "answer": [
      "The skills levy can burden businesses that are struggling",
      "Training is wasted if skilled employees leave the business",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "skills_development_and_setas",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_legislation_provision"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Look at each statement from the point of view of the business owner.\n- Three statements describe benefits."
  },
  {
    "name": "Question 4",
    "question": "Which THREE of the following are ways in which a business can comply with the SDA?",
    "metadata": [
      "Pay one per cent of its payroll as a levy through SARS",
      "Display a summary of the CPA at every till point",
      "Appoint a skills development facilitator if it has more than 50 employees",
      "Compile an employment equity plan for designated groups",
      "Submit a workplace skills plan and evidence that it was implemented"
    ],
    "answer": [
      "Pay one per cent of its payroll as a levy through SARS",
      "Appoint a skills development facilitator if it has more than 50 employees",
      "Submit a workplace skills plan and evidence that it was implemented",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "skills_development_and_setas",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Compliance with the SDA is about levies, skills plans and training.\n- Two options describe compliance with other Acts."
  },
  {
    "name": "Question 5",
    "question": "Amandla Engineering's annual payroll is R2\u00a0000\u00a0000. How much must it pay per year as a skills development levy?",
    "metadata": [
      "R2 000",
      "R20 000",
      "R200 000",
      "R10 000",
      ""
    ],
    "answer": [
      "R20 000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "calc",
    "unit": "impact_of_business_legislation",
    "topic": "skills_development_and_setas",
    "subtopic": "scenario_application",
    "skills": [
      "explain_legislation_provision"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The levy is a fixed percentage of the payroll.\n- Recall the percentage, then apply it to R2 000 000."
  },
  {
    "name": "Question 6",
    "question": "Arrange the parts of an essay on the Skills Development Act in the order in which the question asks for them.",
    "metadata": [
      "Discuss the impact of the SDA on businesses",
      "Conclusion",
      "Outline the role of SETAs in supporting the SDA",
      "Recommend ways to comply with the SDA",
      "Introduction",
      "Explain the purpose of the SDA"
    ],
    "answer": [
      "Introduction",
      "Outline the role of SETAs in supporting the SDA",
      "Explain the purpose of the SDA",
      "Discuss the impact of the SDA on businesses",
      "Recommend ways to comply with the SDA",
      "Conclusion"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "skills_development_and_setas",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "sequence_essay_structure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Follow the order of the bullets in the question.\n- The essay opens and closes with its own sections."
  },
  {
    "name": "Question 7",
    "question": "A candidate writes strong facts under every aspect of the SDA essay but never writes the words INTRODUCTION or CONCLUSION. What does the marking guideline say about the Layout marks?",
    "metadata": [
      "Full Layout marks are awarded because the facts are strong",
      "Layout marks are awarded as long as paragraphs are used",
      "The content marks are halved instead of the Layout marks",
      "Layout marks are forfeited as the words are missing",
      ""
    ],
    "answer": [
      "Layout marks are forfeited as the words are missing",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "skills_development_and_setas",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "evaluate_essay_layout_compliance"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Layout is marked separately from the facts.\n- The guideline treats the two headings as a strict requirement."
  },
  {
    "name": "Question 8",
    "question": "Which TWO verbs from the bullets of the SDA essay require greater depth, a fact supported by an explanation?",
    "metadata": [
      "Outline",
      "Explain",
      "Recommend",
      "Discuss",
      "State"
    ],
    "answer": [
      "Explain",
      "Discuss",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "impact_of_business_legislation",
    "topic": "skills_development_and_setas",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "evaluate_essay_layout_compliance"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Some verbs only ask for short points.\n- Others ask you to give reasons or develop the point."
  },
  {
    "name": "Question 9",
    "question": "Which TWO of the following would earn an Originality mark in an SDA essay written in 2024?",
    "metadata": [
      "A textbook definition of the Skills Development Act",
      "A named local business that claimed a SETA grant for its 2024 learnership intake",
      "The year in which the Skills Development Act was passed",
      "A 2023 news report of a named SETA launching a youth learnership drive",
      "A general statement that training improves productivity"
    ],
    "answer": [
      "A named local business that claimed a SETA grant for its 2024 learnership intake",
      "A 2023 news report of a named SETA launching a youth learnership drive",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "skills_development_and_setas",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "identify_originality_worthy_example"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Originality needs a real, specific example.\n- The example must be no more than two years old."
  },
  {
    "name": "Question 10",
    "question": "An essay in Section C is out of 40 marks. How many of those marks are for facts, with the rest for Insight (Layout, Analysis, Synthesis and Originality)?",
    "metadata": [
      "8",
      "24",
      "32",
      "40",
      ""
    ],
    "answer": [
      "32",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "impact_of_business_legislation",
    "topic": "skills_development_and_setas",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "evaluate_essay_layout_compliance"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Each of the four Insight components is worth 2 marks.\n- Subtract the Insight total from 40."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 40,
      "clues": "- Cover all four aspects: role of SETAs, purpose, impact and compliance.\n- Address at least two aspects in the introduction and one in the conclusion.",
      "approach": "- State the word INTRODUCTION and preview at least two aspects in your own words.\n- Give each of the four aspects its own heading, in the order the question asks; outline and recommend briefly, explain and discuss with reasons.\n- Include a recent, real example in at least two aspects for Originality.\n- State the word CONCLUSION and sum up at least one aspect without repeating the introduction.",
      "solution": "1. Introduction: SETAs identify sector skills shortages, and the SDA aims to redress past imbalances through training (2 marks).\n2. Role of SETAs: promote learnerships, collect levies and pay grants, approve workplace skills plans, monitor training providers, develop sector skills plans (12 marks).\n3. Purpose: develop workforce skills to raise productivity, invest in education and training, improve employment chances of the previously disadvantaged (10 marks).\n4. Impact: positive (more skilled workers, global competitiveness, part of training costs claimed back) and/or negative (paperwork, levy burden, training lost when staff leave) (12 marks).\n5. Compliance: register with the SETA, pay 1% of payroll through SARS, submit a workplace skills plan, appoint a skills development facilitator if over 50 employees (12 marks).\n6. Conclusion (2 marks). Facts are capped at 32; Layout, Analysis, Synthesis and Originality add 2 marks each."
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
