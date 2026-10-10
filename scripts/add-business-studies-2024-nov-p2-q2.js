#!/usr/bin/env node
/**
 * DBE Business Studies P2 — November 2024 — Question 2 (order 2)
 * Section B (Business Ventures): investment opportunities, state-owned company advantages, the average clause
 * (name + calculation), multimedia presentation design, leadership theories, autocratic style, handling feedback.
 * 2.5.1 → 2.5.2 is a linked pair (DESIGN-UNI-13): the "other theory" item excludes the theory the scenario names.
 * 2.3.2 is a real calculation in the paper, so it is the one typed blank: bare numeric, keyboard_type standard_math
 * (DESIGN-BUS-01 / KEYBOARD-02; released keyboard, no gate), with the R split into the label.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2024-nov-p2-q2.js --curriculum temp/curriculum-vocab-business-studies-p2-2024.json
 *   node scripts/add-business-studies-2024-nov-p2-q2.js --dry-run
 *   node scripts/add-business-studies-2024-nov-p2-q2.js
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
  "name": "Question 2",
  "syllabus": "dbe",
  "subject": "business_studies",
  "year": 2024,
  "paper": "nov_p2",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "securities_investment",
    "insurance_concepts",
    "presentation_factors",
    "leadership_styles",
    "forms_of_ownership"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q2/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q2/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q2/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q2/memo_4.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which THREE of the following are types of investment opportunities?",
    "metadata": [
      "Retirement annuities",
      "Bank overdrafts",
      "Debentures",
      "Trade credit from suppliers",
      "32-day notice accounts"
    ],
    "answer": [
      "Retirement annuities",
      "Debentures",
      "32-day notice accounts",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "investment_securities_and_insurance",
    "topic": "securities_investment",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_investment_option"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- An investment puts money to work so that it earns a return.\n- Two options are ways of borrowing money, not investing it."
  },
  {
    "name": "Question 2",
    "question": "Which THREE of the following are advantages of a state-owned company?",
    "metadata": [
      "It offers essential services the private sector may not provide",
      "Its shares can be bought freely by the public on the JSE",
      "Its profits may be used to finance other state departments",
      "Its managers are never affected by political decisions",
      "Its planning can be coordinated through central control"
    ],
    "answer": [
      "It offers essential services the private sector may not provide",
      "Its profits may be used to finance other state departments",
      "Its planning can be coordinated through central control",
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
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A state-owned company is owned and controlled by the government.\n- Ask whether its shares are offered to the public, and whether politics can influence it."
  },
  {
    "name": "Question 3",
    "question": "Nala Florists insured its building, worth R900\u00a0000, for only R600\u00a0000. A storm caused R150\u00a0000 of damage, and the insurer paid out less than the full loss. Which insurance clause did the insurer apply?",
    "metadata": [
      "Excess clause",
      "Average clause",
      "Subrogation clause",
      "Indemnity clause",
      ""
    ],
    "answer": [
      "Average clause",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "investment_securities_and_insurance",
    "topic": "insurance_concepts",
    "subtopic": "scenario_application",
    "skills": [
      "explain_insurance_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The building was insured for less than its market value.\n- One clause reduces the payout in proportion to the under-insurance."
  },
  {
    "name": "Question 4",
    "question": "Nala Florists insured its building, worth R900\u00a0000, for R600\u00a0000. A storm caused damage of R150\u00a0000. Apply the average clause to calculate the compensation Nala Florists will receive from the insurer.",
    "metadata": [
      "Compensation = R",
      "[ ]"
    ],
    "answer": [
      "100000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "calc",
    "unit": "investment_securities_and_insurance",
    "topic": "insurance_concepts",
    "subtopic": "scenario_application",
    "skills": [
      "calculate_insurance_compensation"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- Compensation = (amount insured ÷ market value) × loss.\n- Type the number only, without spaces: the R is already given."
  },
  {
    "name": "Question 5",
    "question": "Which THREE of the following should be considered when designing the slides for a multimedia presentation?",
    "metadata": [
      "Use a legible font and font size that is easy to read",
      "Mix several font styles and colours on every slide",
      "Limit each slide to key words instead of full sentences",
      "Copy the full written report onto the slides word for word",
      "Choose a background that complements the text"
    ],
    "answer": [
      "Use a legible font and font size that is easy to read",
      "Limit each slide to key words instead of full sentences",
      "Choose a background that complements the text",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "presentation_of_business_information",
    "topic": "presentation_factors",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_presentation_factor"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Good slides are simple and easy to read.\n- Cluttered slides and long blocks of text lose the audience."
  },
  {
    "name": "Question 6",
    "question": "Read the scenario and select the TWO statements that show the leadership theory used by the managers. Bontle Interiors operates in a fast-changing market and must keep redesigning its products. Its managers coach staff and give them emotional support so that they feel free to share new ideas. The office is open from 08:00 to 17:00. Staff are paid on the last day of each month.",
    "metadata": [
      "Bontle Interiors operates in a fast-changing market",
      "Its managers coach staff",
      "give them emotional support so that they feel free to share new ideas",
      "The office is open from 08:00 to 17:00",
      "Staff are paid on the last day of each month"
    ],
    "answer": [
      "Its managers coach staff",
      "give them emotional support so that they feel free to share new ideas",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "management_and_leadership",
    "topic": "leadership_styles",
    "subtopic": "scenario_evidence_identification",
    "skills": [
      "identify_evidence_from_a_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Look for what the managers actually do with their staff.\n- The market, office hours and pay day describe the business, not the leadership."
  },
  {
    "name": "Question 7",
    "question": "The managers of Bontle Interiors coach staff, give them emotional support and inspire them to share new ideas so that the business can keep up with change. Which leadership theory are they applying?",
    "metadata": [
      "Situational theory",
      "Leaders and followers theory",
      "Transformational theory",
      "Behavioural theory",
      ""
    ],
    "answer": [
      "Transformational theory",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "management_and_leadership",
    "topic": "leadership_styles",
    "subtopic": "scenario_application",
    "skills": [
      "identify_leadership_style_from_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The leaders inspire and develop staff to embrace change.\n- Which theory is about transforming followers rather than adapting to situations?"
  },
  {
    "name": "Question 8",
    "question": "Bontle Interiors applies the transformational theory. Which TWO statements correctly explain a DIFFERENT leadership theory?",
    "metadata": [
      "Situational theory: the leader adapts the style to suit the task and the people",
      "Transformational theory: the leader inspires and coaches employees so that they embrace change",
      "Situational theory: the leader keeps one fixed style in every situation so as to stay consistent",
      "Leaders and followers theory: followers take responsibility and work with the leader towards goals",
      "Leaders and followers theory: followers make every decision while the leader stays out of the work"
    ],
    "answer": [
      "Situational theory: the leader adapts the style to suit the task and the people",
      "Leaders and followers theory: followers take responsibility and work with the leader towards goals",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "management_and_leadership",
    "topic": "leadership_styles",
    "subtopic": "classification_and_criteria",
    "skills": [
      "define_business_term"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The question asks for a theory other than the one Bontle Interiors uses, so rule that one out first.\n- Check that each remaining explanation really matches the theory it names."
  },
  {
    "name": "Question 9",
    "question": "Which THREE statements correctly describe the impact of the autocratic leadership style on a business?",
    "metadata": [
      "Decisions can be taken quickly without consulting employees",
      "Experienced employees are free to set their own goals and methods",
      "Workers may become demotivated when their ideas are ignored",
      "Every decision is reached by a vote among all the employees",
      "Clear instructions help new and inexperienced staff"
    ],
    "answer": [
      "Decisions can be taken quickly without consulting employees",
      "Workers may become demotivated when their ideas are ignored",
      "Clear instructions help new and inexperienced staff",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "management_and_leadership",
    "topic": "leadership_styles",
    "subtopic": "classification_and_criteria",
    "skills": [
      "define_business_term"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- An autocratic leader makes decisions alone and gives clear orders.\n- The impact can be positive or negative; two options describe other styles altogether."
  },
  {
    "name": "Question 10",
    "question": "During question time, an audience member points out an error in one of the presenter's figures. What is the most professional way for the presenter to respond?",
    "metadata": [
      "Argue that the figures are correct to protect their credibility",
      "Ignore the comment and move on quickly to the next question",
      "Promise to discuss it later with that person only, in private",
      "Acknowledge the error and thank the person for pointing it out",
      ""
    ],
    "answer": [
      "Acknowledge the error and thank the person for pointing it out",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "presentation_of_business_information",
    "topic": "presentation_factors",
    "subtopic": "scenario_application",
    "skills": [
      "explain_presentation_factor"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Handling feedback professionally means staying calm and honest.\n- Address the whole audience, not only the person who spoke."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1",
      "marks": 4,
      "clues": "- Investment opportunities are places to put money so that it earns a return.\n- Four are needed; only the first four are marked.",
      "approach": "- Recall the investment options studied in Grade 12.\n- List four, one mark each.",
      "solution": "1. Mutual funds or stokvels.\n2. Managed portfolios.\n3. Venture capital.\n4. 32-day notice accounts.\n5. Debentures, endowments or retirement annuities are also accepted. Any four: 1 mark each."
    },
    {
      "number": "2.2",
      "marks": 6,
      "clues": "- A state-owned company is controlled by government.\n- Think about services, prices, funding and planning.",
      "approach": "- Recall the advantages of state ownership.\n- Outline three points, two marks each.",
      "solution": "1. Profits may be used to finance other state departments.\n2. It offers essential services that the private sector may not offer.\n3. Prices are kept reasonable, making services affordable to more citizens.\n4. Wasteful duplication of services is eliminated, and planning is coordinated centrally.\n5. Jobs are created for all skill levels. Any three: 2 marks each."
    },
    {
      "number": "2.3.1",
      "marks": 2,
      "clues": "- The stock was insured for less than its value.\n- One clause deals with under-insurance.",
      "approach": "- Compare the insured amount with the market value.\n- Name the clause that applies.",
      "solution": "1. Stock worth R400 000 was insured for only R200 000, so it is under-insured.\n2. The average clause applies: 2 marks."
    },
    {
      "number": "2.3.2",
      "marks": 4,
      "clues": "- Use the average clause formula.\n- Insured amount, market value and loss are all given in the scenario.",
      "approach": "- Write the formula: (amount insured ÷ market value) × loss.\n- Substitute and calculate.",
      "solution": "1. Formula: (insured amount ÷ market value) × loss.\n2. (R200 000 ÷ R400 000) × R80 000.\n3. = R40 000.\n4. A correct answer with no workings still earns full marks (4)."
    },
    {
      "number": "2.4",
      "marks": 6,
      "clues": "- Think about text, background, images and special effects.\n- Each aspect needs a short reason.",
      "approach": "- Recall the aspects of designing multimedia slides.\n- Explain each one with a reason, 2 marks per point.",
      "solution": "1. Start with the heading or text, which forms the basis of the presentation.\n2. Select a background that complements the text.\n3. Choose images and graphics that help communicate the message.\n4. Use a legible font and size, keep slides simple, and limit each slide to key words.\n5. Any three explained aspects: 6 marks."
    },
    {
      "number": "2.5.1",
      "marks": 3,
      "clues": "- The managers provide emotional support and coaching.\n- Name the theory, then quote the evidence.",
      "approach": "- Link coaching and support to a leadership theory.\n- Quote the sentence that proves it.",
      "solution": "1. Theory: transformational (transitional) theory: 2 marks.\n2. Motivation: \"The management of EA provide emotional support for employees through coaching so that they can share their ideas more freely\": 1 mark.\n3. No mark is given for the quote if the theory is wrong."
    },
    {
      "number": "2.5.2",
      "marks": 3,
      "clues": "- Choose a theory other than transformational.\n- Name it, then explain it briefly.",
      "approach": "- Pick leaders and followers or situational theory.\n- Name it (2 marks) and give one explanation (1 mark).",
      "solution": "1. Situational theory: 2 marks.\n2. Explanation: different leadership styles are needed for different situations, so the leader adapts to the task: 1 mark.\n3. Leaders and followers theory is also accepted. Only the first theory is marked, and transformational theory earns nothing."
    },
    {
      "number": "2.6",
      "marks": 6,
      "clues": "- Impact can be positive, negative or both.\n- Think about speed of decisions, control and motivation.",
      "approach": "- Give advantages and/or disadvantages of autocratic leadership.\n- Each point is a fact with a reason, 2 marks each.",
      "solution": "1. Quick decisions can be taken without consulting employees.\n2. Clear lines of command mean followers know exactly what to do.\n3. Workers may become demotivated if their ideas are not considered.\n4. Creative or cost-saving ideas may not be used.\n5. Any three discussed points: 6 marks."
    },
    {
      "number": "2.7",
      "marks": 6,
      "clues": "- Feedback should be handled calmly and politely.\n- Think about listening, honesty and not debating.",
      "approach": "- Recommend professional ways of responding to questions.\n- Give three points, two marks each.",
      "solution": "1. Be polite, confident and calm when responding.\n2. Listen first, and make sure each question is understood before answering.\n3. Acknowledge errors pointed out by the audience.\n4. Do not get drawn into a debate; address the question, not the person.\n5. Any three: 2 marks each."
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
