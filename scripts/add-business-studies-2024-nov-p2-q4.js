#!/usr/bin/env node
/**
 * DBE Business Studies P2 — November 2024 — Question 4 (order 4)
 * Section B (Miscellaneous): compulsory insurance, advantages of insurance, visual aids and presentation
 * improvement, capital in a private company (Business Ventures); problem-solving steps, employee well-being,
 * human rights, professional and ethical practice (Business Roles).
 * 4.3.1 → 4.3.2 share a scenario only (name the aids → suggest improvements); no exclusion needed.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2024-nov-p2-q4.js --curriculum temp/curriculum-vocab-business-studies-p2-2024.json
 *   node scripts/add-business-studies-2024-nov-p2-q4.js --dry-run
 *   node scripts/add-business-studies-2024-nov-p2-q4.js
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
  "paper": "nov_p2",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "insurance_concepts",
    "presentation_factors",
    "problem_solving_techniques",
    "human_rights",
    "professional_practice"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q4/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q4/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q4/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q4/memo_5.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which TWO of the following are types of compulsory insurance in South Africa?",
    "metadata": [
      "Household contents insurance",
      "Unemployment Insurance Fund (UIF)",
      "Life assurance",
      "Road Accident Fund (RAF)",
      "Vehicle theft insurance"
    ],
    "answer": [
      "Unemployment Insurance Fund (UIF)",
      "Road Accident Fund (RAF)",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "investment_securities_and_insurance",
    "topic": "insurance_concepts",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_insurance_concept"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Compulsory insurance is required by law and paid through levies or contributions.\n- A business may choose to buy the other types, but it does not have to."
  },
  {
    "name": "Question 2",
    "question": "Which compulsory insurance compensates employees who are injured or become ill because of their work?",
    "metadata": [
      "Unemployment Insurance Fund (UIF)",
      "Road Accident Fund (RAF)",
      "Credit life insurance",
      "Compensation Fund (COIDA)",
      ""
    ],
    "answer": [
      "Compensation Fund (COIDA)",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "investment_securities_and_insurance",
    "topic": "insurance_concepts",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_insurance_concept"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The injury or illness happens on the job.\n- UIF pays out when a worker loses their job, not when they are injured."
  },
  {
    "name": "Question 3",
    "question": "Which THREE of the following are advantages of insurance for businesses?",
    "metadata": [
      "It transfers risk from the business to the insurer",
      "It guarantees that the business makes a profit every year",
      "It compensates the business for insurable losses such as fire",
      "It covers losses caused by poor management decisions",
      "It protects the business against dishonest employees"
    ],
    "answer": [
      "It transfers risk from the business to the insurer",
      "It compensates the business for insurable losses such as fire",
      "It protects the business against dishonest employees",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "investment_securities_and_insurance",
    "topic": "insurance_concepts",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_insurance_concept"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Insurance covers insurable risks, not the normal risks of running a business.\n- No insurer can guarantee profit or cover bad decisions."
  },
  {
    "name": "Question 4",
    "question": "Read the scenario and select the TWO visual aids used. Zola Holdings presented its five-year plan to investors. The chief executive spoke through a microphone, showed charts on an overhead projector and wrote the key figures on a whiteboard. Afterwards, investors completed a short feedback form.",
    "metadata": [
      "a microphone",
      "an overhead projector",
      "its five-year plan",
      "a whiteboard",
      "a short feedback form"
    ],
    "answer": [
      "an overhead projector",
      "a whiteboard",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "presentation_of_business_information",
    "topic": "presentation_factors",
    "subtopic": "scenario_evidence_identification",
    "skills": [
      "identify_evidence_from_a_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A visual aid is something the audience looks at.\n- A microphone helps the audience hear, and the form collects feedback."
  },
  {
    "name": "Question 5",
    "question": "The investors' feedback forms said Zola Holdings' presentation ran too long and that some charts were hard to read. Which TWO areas should management improve for its next presentation?",
    "metadata": [
      "Ignore the criticism so that the format stays familiar",
      "Reflect on the length and add or remove content",
      "Add as much detail as possible to every chart",
      "Replace or remove visual aids that did not work well",
      "Avoid taking any questions from the investors"
    ],
    "answer": [
      "Reflect on the length and add or remove content",
      "Replace or remove visual aids that did not work well",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "presentation_of_business_information",
    "topic": "presentation_factors",
    "subtopic": "scenario_application",
    "skills": [
      "explain_presentation_factor"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Feedback should be analysed and used to improve the next presentation.\n- Match each improvement to a problem the investors raised."
  },
  {
    "name": "Question 6",
    "question": "Which TWO statements explain how capital can contribute to the FAILURE of a private company?",
    "metadata": [
      "It can access long-term capital for good long-term growth",
      "It cannot invite the public to buy shares, which limits its growth",
      "Its shareholders have unlimited liability for its debts",
      "Limits on transferring shares may put off strong investors",
      "It must publish a prospectus before it can raise capital"
    ],
    "answer": [
      "It cannot invite the public to buy shares, which limits its growth",
      "Limits on transferring shares may put off strong investors",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "forms_of_ownership",
    "topic": "ownership_and_liability",
    "subtopic": "classification_and_criteria",
    "skills": [
      "classify_ownership_liability"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A private company may not offer shares to the public, and its shares are not freely transferable.\n- One option is a success factor; two are simply untrue of a private company."
  },
  {
    "name": "Question 7",
    "question": "Arrange the following problem-solving steps in the correct order.",
    "metadata": [
      "Select the most appropriate solution",
      "Monitor and evaluate the solution",
      "Identify and define the problem",
      "Develop and implement an action plan",
      "Evaluate the alternative solutions",
      "Brainstorm possible solutions"
    ],
    "answer": [
      "Identify and define the problem",
      "Brainstorm possible solutions",
      "Evaluate the alternative solutions",
      "Select the most appropriate solution",
      "Develop and implement an action plan",
      "Monitor and evaluate the solution"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "creative_thinking_and_problem_solving",
    "topic": "problem_solving_techniques",
    "subtopic": "sequencing_and_process",
    "skills": [
      "sequence_problem_solving_steps"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- You cannot look for solutions until you know what the problem is.\n- Alternatives are compared before one is chosen, and checked after it is put into action."
  },
  {
    "name": "Question 8",
    "question": "Which THREE of the following show a business contributing time and effort to improve the well-being of its employees?",
    "metadata": [
      "Offer annual medical check-ups to promote health awareness",
      "Extend working hours so that more is produced each day",
      "Provide recreational facilities that strengthen work relations",
      "Cut medical aid contributions to reduce business costs",
      "Make counselling available to employees who need it"
    ],
    "answer": [
      "Offer annual medical check-ups to promote health awareness",
      "Provide recreational facilities that strengthen work relations",
      "Make counselling available to employees who need it",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "csr_and_csi",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_corporate_social_responsibility"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Well-being covers employees' health, relationships and support.\n- Two options benefit the business at the employees' expense."
  },
  {
    "name": "Question 9",
    "question": "Lindiwe Logistics takes the following actions. Match each human right in Column A to the action in Column B that promotes it.",
    "metadata": [
      "A - Dignity",
      "B - Freedom of speech and expression",
      "C - Privacy",
      "D - Freedom of religion",
      "1 - Every employee is treated with respect, whatever their position",
      "2 - Managers encourage employees to share their opinions openly",
      "3 - Employees' personal files are locked away and kept confidential",
      "4 - Staff may take leave for the holy days of their own faith"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "human_rights_and_diversity",
    "subtopic": "scenario_application",
    "skills": [
      "identify_human_right_in_workplace"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Respect for every person, whatever their status, is about dignity.\n- Open communication channels let employees express themselves."
  },
  {
    "name": "Question 10",
    "question": "Which action best shows professional, responsible and ethical business practice?",
    "metadata": [
      "Using a competitor's patented design without asking permission",
      "Paying taxes on time and keeping financial records transparent",
      "Paying overtime below the BCEA rate to keep costs down",
      "Dumping toxic waste in a nearby river at night to save money",
      ""
    ],
    "answer": [
      "Paying taxes on time and keeping financial records transparent",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "ethics_and_professionalism",
    "topic": "professional_conduct",
    "subtopic": "classification_and_criteria",
    "skills": [
      "classify_business_concept"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Ethical practice follows the law and is open with stakeholders.\n- Three options break a law to gain an advantage."
  },
  {
    "name": "Question 11",
    "question": "Which TWO recommendations would help a business conduct professional and ethical business practice?",
    "metadata": [
      "Hire accountants because they are friends of the owner",
      "Draw up a code of ethics and train all staff on it",
      "Keep business decisions hidden from stakeholders",
      "Respond swiftly and fairly to reports of discrimination",
      "Pay below the minimum wage during slow months"
    ],
    "answer": [
      "Draw up a code of ethics and train all staff on it",
      "Respond swiftly and fairly to reports of discrimination",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "ethics_and_professionalism",
    "topic": "professional_conduct",
    "subtopic": "classification_and_criteria",
    "skills": [
      "classify_business_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 11,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Professional practice is transparent, fair and lawful.\n- Hiring should be based on credentials, not friendship."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1",
      "marks": 2,
      "clues": "- Compulsory insurance is required by law.\n- Two are needed; only the first two are marked.",
      "approach": "- Recall the insurance a business must contribute to by law.\n- Name two, one mark each.",
      "solution": "1. Unemployment Insurance Fund (UIF).\n2. Road Accident Fund (RAF) or Road Accident Benefit Scheme.\n3. Compensation Fund under COIDA is also accepted. Any two: 1 mark each."
    },
    {
      "number": "4.2",
      "marks": 6,
      "clues": "- Insurance moves the risk of loss to someone else.\n- Think about theft, fire, dishonest staff and key personnel.",
      "approach": "- Recall how insurance protects a business.\n- Outline three advantages, two marks each.",
      "solution": "1. It transfers risk from the business to the insurer, subject to the contract.\n2. It protects against theft, loss of stock and damage from natural disasters.\n3. The business is compensated for insurable losses such as fire.\n4. It protects against dishonest employees, loss of key personnel and claims from the public.\n5. Any three: 2 marks each."
    },
    {
      "number": "4.3.1",
      "marks": 2,
      "clues": "- Only visual aids named in the scenario earn marks.\n- Two are needed.",
      "approach": "- Find the items the audience could see.\n- Name two of them.",
      "solution": "1. PowerPoint: 1 mark.\n2. Flip charts: 1 mark.\n3. Only the first two are marked."
    },
    {
      "number": "4.3.2",
      "marks": 4,
      "clues": "- Management used shareholders' comments to plan the next presentation.\n- Think about timing, flow, visual aids and relevance.",
      "approach": "- Suggest what a presenter can review and improve.\n- Give two points, two marks each.",
      "solution": "1. Revise objectives that were not achieved.\n2. Reflect on the time and length of the presentation, and add or remove content.\n3. Reflect on the logical flow of the slides and the use of visual aids; replace aids that did not work.\n4. Analyse the feedback and use it to update the presentation. Any two: 2 marks each."
    },
    {
      "number": "4.4",
      "marks": 6,
      "clues": "- Capital can make a private company succeed or fail.\n- Think about the number of shareholders and transferability of shares.",
      "approach": "- Explain success and/or failure factors linked to capital.\n- Each point is a fact with a reason, 2 marks each.",
      "solution": "1. Success: a large amount of capital can be raised, since there is no limit on the number of shareholders.\n2. Success: it can access long-term capital, which gives good long-term growth opportunities.\n3. Failure: it cannot grow very large, because it cannot invite the public to buy shares.\n4. Failure: restrictions on transferring shares may not attract financially strong investors.\n5. Any three explained points, success and/or failure: 6 marks."
    },
    {
      "number": "4.5",
      "marks": 4,
      "clues": "- Problem solving follows a set of steps.\n- Four are needed, in any order.",
      "approach": "- Recall the problem-solving steps.\n- State four, one mark each.",
      "solution": "1. Identify and define the problem.\n2. Identify possible solutions.\n3. Evaluate the alternatives and choose the most appropriate one.\n4. Develop an action plan, implement it, then monitor and evaluate it. Any four steps: 1 mark each."
    },
    {
      "number": "4.6",
      "marks": 6,
      "clues": "- This is about caring for employees beyond their salaries.\n- Think about health, support and facilities.",
      "approach": "- Explain ways a business can invest time and effort in employees.\n- Each point is a fact with a reason, 2 marks each.",
      "solution": "1. Pay fair wages and bonuses based on the nature of the work and business earnings.\n2. Offer annual medical assessments to promote health awareness.\n3. Make counselling or trauma debriefing available to employees who need it.\n4. Provide recreational facilities, childcare or coaching and mentoring programmes.\n5. Any three explained points: 6 marks."
    },
    {
      "number": "4.7",
      "marks": 6,
      "clues": "- Identify two rights, then quote the evidence for each.\n- Respect and open communication point to two different rights.",
      "approach": "- Name each right (2 marks).\n- Quote the matching sentence from the scenario (1 mark).",
      "solution": "1. Dignity: \"They treat all employees with respect regardless of their socio-economic status\".\n2. Freedom of speech and expression: \"The management of BT encourages open communication channels between them and employees\".\n3. Rights: 2 marks each (sub-max 4); motivations: 1 mark each (sub-max 2). No marks for a quote if the right is wrong."
    },
    {
      "number": "4.8",
      "marks": 4,
      "clues": "- Ethical practice is fair, lawful and transparent.\n- Think about codes of ethics, fair pay and accountability.",
      "approach": "- Recommend ways a business can conduct itself professionally.\n- Give two points, two marks each.",
      "solution": "1. Draw up a code of ethics or conduct.\n2. Pay fair wages in line with the BCEA, and pay taxes on time.\n3. Make business decisions transparent and be accountable for them.\n4. Respond swiftly and fairly to reported discrimination. Any two: 2 marks each."
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
    console.error(
      '\n   curriculum_nodes / skills → node tools/create-curriculum-node.js | create-skill.js' +
      '\n   tags → node tools/create-tag.js',
    );
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

  // Exam gate (VER-02/VER-04, tools/apply-exam-gate.js): derive the exam's minimum app version from the rows now in the
  // database and write it to exam_versions, bumping updated_at on the exam's rows. Dev only; a no-op when the derived
  // minimum is the floor (VER-07); idempotent. The gate is per EXAM, so it also gates the sibling papers.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
}

// Only run when invoked directly — so validate-questions.js (and anything else) can load
// this file for its data blocks without opening a DB connection or writing anything.
if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
