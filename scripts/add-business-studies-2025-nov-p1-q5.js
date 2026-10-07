#!/usr/bin/env node
/**
 * DBE Business Studies P1 — November 2025 — Question 5 (order 5)
 * Section C essay (Business Environments — legislation: Employment Equity Act). DESIGN-BUS-03: content items on the four stated aspects plus LASO rubric items; no free text, no verbatim memo prose.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2025-nov-p1-q5.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2025-nov-p1-q5.js --dry-run
 *   node scripts/add-business-studies-2025-nov-p1-q5.js
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
  "year": 2025,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "employment_equity_act",
    "essay_writing_skills",
    "affirmative_action"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q5/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q5/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q5/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p1/q5/memo_4.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which statement best describes the purpose of the Employment Equity Act (EEA)?",
    "metadata": [
      "To set the minimum wage for every sector",
      "To eliminate unfair discrimination and promote equal opportunity and fair treatment in the workplace",
      "To compensate employees injured at work",
      "To regulate the way credit is granted to consumers",
      ""
    ],
    "answer": [
      "To eliminate unfair discrimination and promote equal opportunity and fair treatment in the workplace",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "impact_of_business_legislation",
    "topic": "employment_equity_act",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The EEA is about fairness and representation in who is employed, promoted and paid.\n- Wages, injuries and credit are covered by other Acts."
  },
  {
    "name": "Question 2",
    "question": "Which TWO of the following are positive impacts of the EEA on businesses?",
    "metadata": [
      "Employees have legal recourse if they are unfairly discriminated against",
      "The business must compile and submit employment equity reports",
      "A compliant business is in a better position to negotiate contracts with the government",
      "Positions may remain unfilled because of a shortage of suitable candidates",
      "The business may be pressured to appoint an unsuitable person"
    ],
    "answer": [
      "Employees have legal recourse if they are unfairly discriminated against",
      "A compliant business is in a better position to negotiate contracts with the government",
      "",
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
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A positive impact helps the business or its employees.\n- Three of the options describe costs or difficulties."
  },
  {
    "name": "Question 3",
    "question": "Which TWO of the following are disadvantages of the EEA for businesses?",
    "metadata": [
      "The workforce becomes more diverse and representative",
      "Employment equity reports must be compiled and submitted to the Department of Labour, which adds administration",
      "The business's BEE rating improves",
      "The business may feel pressure to appoint an unsuitable person to meet EEA requirements",
      "All employees have the same employment opportunities"
    ],
    "answer": [
      "Employment equity reports must be compiled and submitted to the Department of Labour, which adds administration",
      "The business may feel pressure to appoint an unsuitable person to meet EEA requirements",
      "",
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
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A disadvantage creates extra cost, effort or risk for the business.\n- Diversity, a better BEE rating and equal opportunity are benefits."
  },
  {
    "name": "Question 4",
    "question": "Which THREE of the following are ways in which a business can comply with the EEA?",
    "metadata": [
      "Prepare an employment equity plan in consultation with employees",
      "Appoint only candidates from one group to keep the workforce uniform",
      "Assign one or more senior managers to monitor the implementation of the plan",
      "Keep a summary of the Act in the HR manager's private files",
      "Report regularly to the Department of Labour on progress with the plan"
    ],
    "answer": [
      "Prepare an employment equity plan in consultation with employees",
      "Assign one or more senior managers to monitor the implementation of the plan",
      "Report regularly to the Department of Labour on progress with the plan",
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
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Compliance means planning, appointing responsible people and reporting.\n- A summary of the Act must be displayed where employees can see it."
  },
  {
    "name": "Question 5",
    "question": "A labour inspector issues a compliance order to a business that has not met its employment equity requirements, and the business ignores the order. What may happen next?",
    "metadata": [
      "The business may be brought before the Labour Court and face fines",
      "The business's UIF contributions are waived",
      "The employees must pay the fine on the business's behalf",
      "The business receives a higher BEE rating",
      ""
    ],
    "answer": [
      "The business may be brought before the Labour Court and face fines",
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
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Ignoring a compliance order escalates the matter.\n- Penalties fall on the non-compliant business, not on its employees."
  },
  {
    "name": "Question 6",
    "question": "Arrange the parts of an essay on the Employment Equity Act in the order in which the question asks for them.",
    "metadata": [
      "Advise on the penalties for non-compliance",
      "Conclusion",
      "Explain the ways in which businesses can comply",
      "Introduction",
      "Discuss the impact on businesses",
      "Outline the purpose of the Act"
    ],
    "answer": [
      "Introduction",
      "Outline the purpose of the Act",
      "Discuss the impact on businesses",
      "Explain the ways in which businesses can comply",
      "Advise on the penalties for non-compliance",
      "Conclusion"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "employment_equity_act",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "sequence_essay_structure"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The essay should follow the order of the four aspects in the question.\n- The introduction opens the essay and the conclusion closes it."
  },
  {
    "name": "Question 7",
    "question": "A candidate writes the heading INTRODUCTION and copies a definition of the EEA word for word from a textbook, then moves straight to the first aspect. What does the marking guideline say about Layout marks?",
    "metadata": [
      "Full marks are awarded because the heading is present",
      "No Layout marks are awarded because the heading is not supported by the candidate's own explanation of the aspects",
      "Marks are awarded for the definition because it is correct",
      "Layout marks are awarded only for the conclusion",
      ""
    ],
    "answer": [
      "No Layout marks are awarded because the heading is not supported by the candidate's own explanation of the aspects",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "employment_equity_act",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "evaluate_essay_layout_compliance"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The headings INTRODUCTION and CONCLUSION must be stated and supported by an explanation.\n- Quoting definitions word for word is strongly discouraged."
  },
  {
    "name": "Question 8",
    "question": "Which TWO of the following would earn the candidate an Originality mark in an essay on the EEA?",
    "metadata": [
      "A named South African business and a recent development in how it applies employment equity, with a brief explanation",
      "A general statement that many businesses have to comply with the Act",
      "A word-for-word textbook definition of affirmative action",
      "A current news event from the last two years about employment equity compliance, linked to the point being made",
      "A repeat of the introduction in the conclusion"
    ],
    "answer": [
      "A named South African business and a recent development in how it applies employment equity, with a brief explanation",
      "A current news event from the last two years about employment equity compliance, linked to the point being made",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "impact_of_business_legislation",
    "topic": "employment_equity_act",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "identify_originality_worthy_example"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Originality needs an example that is specific and recent (not older than two years).\n- General statements and repetition do not count."
  },
  {
    "name": "Question 9",
    "question": "Which pair of cognitive verbs in the essay question usually requires more depth of understanding than the other pair?",
    "metadata": [
      "Outline and advise",
      "Discuss and explain",
      "Name and state",
      "Give and quote",
      ""
    ],
    "answer": [
      "Discuss and explain",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "impact_of_business_legislation",
    "topic": "employment_equity_act",
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
    "clues": "- Some verbs ask for a short statement; others ask for facts together with reasons.\n- The marking guideline lists these in two separate groups."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 40,
      "clues": "- Cover all four aspects: purpose, impact, compliance and penalties.\n- Address at least two aspects in the introduction and one in the conclusion.",
      "approach": "- State the word INTRODUCTION and preview at least two aspects in your own words.\n- Give each of the four aspects its own heading, in the order the question asks.\n- Include a recent, real example in at least two aspects for Originality.\n- State the word CONCLUSION and sum up at least one aspect without repeating the introduction.",
      "solution": "1. Introduction: the EEA corrects past inequalities, and businesses must align their policies with it.\n2. Purpose: eliminate unfair discrimination, promote equal opportunity, diversity and equal pay for work of equal value, protect against victimisation.\n3. Impact: positive (fair treatment, better BEE rating, legal recourse) and/or negative (administration, cost, pressure to appoint).\n4. Compliance: employment equity plan, senior manager responsible, report to the Department of Labour, remove barriers, display the Act.\n5. Penalties: compliance orders, labour inspectors, Labour Court, fines and compensation, blocked from state business.\n6. Conclusion: compliance brings a representative workforce and access to skills; non-compliance is costly."
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
