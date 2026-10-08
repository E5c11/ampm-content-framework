#!/usr/bin/env node
/**
 * DBE Business Studies P2 — November 2024 — Question 1 (order 1)
 * Section A (compulsory): leadership styles, forms of ownership, unethical advertising, health and safety
 * representatives, team performance criteria, share types, cultural rights, problem-solving techniques,
 * difficult personalities, insurance vs assurance (security).
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2024-nov-p2-q1.js --curriculum temp/curriculum-vocab-business-studies-p2-2024.json
 *   node scripts/add-business-studies-2024-nov-p2-q1.js --dry-run
 *   node scripts/add-business-studies-2024-nov-p2-q1.js
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
  "paper": "nov_p2",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 30,
  "tags": [
    "leadership_styles",
    "forms_of_ownership",
    "securities_investment",
    "problem_solving_techniques",
    "human_rights"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q1/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q1/memo_1.png"
  ],
  "exam_question_marks": 30,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "The manager of a team of experienced software engineers sets the project goal and then leaves the team to decide how and when the work is done. Which leadership style is the manager using?",
    "metadata": [
      "Autocratic",
      "Laissez-faire",
      "Transactional",
      "Bureaucratic",
      ""
    ],
    "answer": [
      "Laissez-faire",
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
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Ask how much freedom the team has to make its own decisions.\n- One style hands almost all control to skilled followers."
  },
  {
    "name": "Question 2",
    "question": "Which form of ownership is owned and controlled by its members, who join mainly to gain shared benefits rather than to earn a return on capital?",
    "metadata": [
      "Partnership",
      "Private company",
      "Cooperative",
      "Sole trader",
      ""
    ],
    "answer": [
      "Cooperative",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "forms_of_ownership",
    "topic": "ownership_and_liability",
    "subtopic": "term_definition_recall",
    "skills": [
      "classify_ownership_liability"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Think about which form exists to serve its own members.\n- Profit for investors is not its main aim."
  },
  {
    "name": "Question 3",
    "question": "A cellphone shop advertises \"FREE smartphones\" in large print, but the 36-month contract fee appears only in tiny print at the bottom of the poster. Which unethical business practice is this?",
    "metadata": [
      "Pricing of goods in rural areas",
      "Abuse of work time",
      "Tax evasion",
      "Unfair advertising",
      ""
    ],
    "answer": [
      "Unfair advertising",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "ethics_and_professionalism",
    "topic": "professional_conduct",
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
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The problem is in how the product is promoted.\n- Hiding important costs misleads customers."
  },
  {
    "name": "Question 4",
    "question": "Which TWO of the following are roles of health and safety representatives in the workplace?",
    "metadata": [
      "Provide protective clothing to employees at the employer's cost",
      "Inspect the workplace regularly to identify potential hazards",
      "Use the prescribed safety equipment while doing their own work",
      "Investigate complaints from employees about health and safety",
      "Repair and maintain the machinery on the factory floor"
    ],
    "answer": [
      "Inspect the workplace regularly to identify potential hazards",
      "Investigate complaints from employees about health and safety",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "human_rights_and_diversity",
    "subtopic": "classification_and_criteria",
    "skills": [
      "classify_business_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Representatives watch over safety on behalf of the workers.\n- Providing clothing and maintaining machinery are the employer's duties; using equipment is every worker's duty."
  },
  {
    "name": "Question 5",
    "question": "Everyone in the Ubuntu Bakery team believes in honesty and respect, and these beliefs guide how members treat customers and one another. Which criterion for successful team performance does this show?",
    "metadata": [
      "Collaboration",
      "Communication",
      "Shared values",
      "Conflict resolution",
      ""
    ],
    "answer": [
      "Shared values",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "team_performance_and_conflict_management",
    "topic": "team_dynamics",
    "subtopic": "scenario_application",
    "skills": [
      "classify_business_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The scenario is about beliefs the members hold in common.\n- It says nothing about how they share information or divide tasks."
  },
  {
    "name": "Question 6",
    "question": "Match each type of share in Column A to its description in Column B.",
    "metadata": [
      "A - Founders' shares",
      "B - Ordinary shares",
      "C - Cumulative preference shares",
      "D - Redeemable preference shares",
      "1 - Issued to the promoters who started the company",
      "2 - Carry voting rights, with dividends that depend on profit",
      "3 - Unpaid dividends carry over to the following years",
      "4 - Can be bought back at the option of the company"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "investment_securities_and_insurance",
    "topic": "securities_investment",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_investment_option"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The name of each share hints at who holds it or what happens to it.\n- \"Redeemable\" means it can be bought back."
  },
  {
    "name": "Question 7",
    "question": "Siyakhula Motors allows employees to wear traditional attire on Fridays and to mark their own heritage celebrations at work. Which right in the workplace does this mainly promote?",
    "metadata": [
      "Freedom of association",
      "The right to privacy",
      "Cultural rights",
      "Freedom of movement",
      ""
    ],
    "answer": [
      "Cultural rights",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "human_rights_and_diversity",
    "subtopic": "scenario_application",
    "skills": [
      "identify_human_right_in_workplace"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Dress and heritage celebrations are part of a person's culture.\n- Association is about joining groups such as trade unions."
  },
  {
    "name": "Question 8",
    "question": "Match each problem-solving technique in Column A to its description in Column B.",
    "metadata": [
      "A - Nominal group technique",
      "B - Delphi technique",
      "C - Brainstorming",
      "D - Force field analysis",
      "1 - Members first write down ideas silently on their own",
      "2 - Experts answer questionnaires without ever meeting",
      "3 - Group members call out as many ideas as possible",
      "4 - Forces for and against a change are weighed up"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "creative_thinking_and_problem_solving",
    "topic": "problem_solving_techniques",
    "subtopic": "term_definition_recall",
    "skills": [
      "define_business_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- One technique never brings its participants together.\n- Another starts with each person working alone before the group meets."
  },
  {
    "name": "Question 9",
    "question": "Which approach should a manager use when dealing with an \"expert\" personality, an employee who believes they know everything?",
    "metadata": [
      "Limit how long they may speak in each meeting",
      "Ignore their input until they become calmer",
      "Leave them to complete every task on their own",
      "Know your facts and acknowledge what they know",
      ""
    ],
    "answer": [
      "Know your facts and acknowledge what they know",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "team_performance_and_conflict_management",
    "topic": "conflict_management",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_conflict_resolution"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- An expert will challenge any claim that is not backed up.\n- Limiting speaking time suits a different, overly talkative personality."
  },
  {
    "name": "Question 10",
    "question": "Which statement correctly describes assurance (also called security), as opposed to insurance?",
    "metadata": [
      "It covers an event that is certain to happen, like death",
      "It covers an uncertain event, such as a fire or a burglary",
      "It pays out only the actual loss suffered and never more",
      "It is compulsory for every business that employs workers",
      ""
    ],
    "answer": [
      "It covers an event that is certain to happen, like death",
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
    "exam_weight": 2,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Insurance is based on indemnity; assurance is based on certainty.\n- Ask which event will definitely happen at some point."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- The followers are experts.\n- They take full responsibility for their own actions.",
      "approach": "- Decide how much freedom the leader gives the followers.\n- Choose the style that hands over most control.",
      "solution": "1. Expert followers who take full responsibility need little direction.\n2. The leader delegates almost all decision-making.\n3. Answer: C, laissez-faire."
    },
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- The aim is mutual benefit for members.\n- Profit for investors is not the main objective.",
      "approach": "- Recall the main objective of each form of ownership.\n- Pick the one formed to serve its members.",
      "solution": "1. A cooperative is formed by members to meet shared needs.\n2. Its main objective is mutual benefit for its members.\n3. Answer: B, cooperative."
    },
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Fine print hides information from customers.\n- The practice happens during promotion.",
      "approach": "- Link the action to the unethical practice it describes.\n- Rule out options that are not about promotion.",
      "solution": "1. Hiding misleading information in fine print misleads customers.\n2. Misleading promotion is unfair advertising.\n3. Answer: D, unfair advertising."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- Separate the duties of representatives, workers and employers.\n- Representatives check that safety measures are in place.",
      "approach": "- Eliminate duties that belong to workers or employers.\n- Keep the one a representative checks on behalf of workers.",
      "solution": "1. Providing safety clothes and maintaining equipment are employer duties.\n2. Using prescribed equipment is a worker duty.\n3. Ensuring protective clothing is available is a representative's role.\n4. Answer: A."
    },
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- Members agree on methods to get the job done.\n- They avoid wasting time on conflict.",
      "approach": "- Match the behaviour to a team performance criterion.\n- Look for the criterion about working together on methods.",
      "solution": "1. Agreeing on how to do the work together is collaboration.\n2. Answer: C, collaboration."
    },
    {
      "number": "1.2.1",
      "marks": 2,
      "clues": "- The shares go to the promoters of the company.\n- Choose from the word list.",
      "approach": "- Recall which shares are issued to the people who started the company.",
      "solution": "1. Shares issued to promoters are founders' shares.\n2. Answer: founders'."
    },
    {
      "number": "1.2.2",
      "marks": 2,
      "clues": "- Something is given out at the start of the presentation.\n- Choose from the word list.",
      "approach": "- Pick the visual aid that is physically distributed to the audience.",
      "solution": "1. Printed material distributed to the audience is called hand-outs.\n2. Answer: hand-outs."
    },
    {
      "number": "1.2.3",
      "marks": 2,
      "clues": "- Shareholders can lose only what they invested.\n- Choose from the word list.",
      "approach": "- Recall the type of liability that protects shareholders' personal assets.",
      "solution": "1. Losing only the amount invested is limited liability.\n2. Answer: limited."
    },
    {
      "number": "1.2.4",
      "marks": 2,
      "clues": "- Two or more parties disagree.\n- It is not a formal complaint by one employee.",
      "approach": "- Distinguish a general disagreement from a grievance.",
      "solution": "1. A disagreement between two or more parties is a conflict.\n2. A grievance is a formal complaint, so it does not fit.\n3. Answer: conflict."
    },
    {
      "number": "1.2.5",
      "marks": 2,
      "clues": "- Employees use their own language.\n- Language is part of a person's culture.",
      "approach": "- Link the use of one's own language to the right it promotes.",
      "solution": "1. Using one's own language is part of cultural rights.\n2. Answer: cultural."
    },
    {
      "number": "1.3.1",
      "marks": 2,
      "clues": "- Security is another word for assurance.\n- Assurance covers an event that will certainly happen.",
      "approach": "- Recall the principle that assurance is based on.",
      "solution": "1. Security (assurance) is based on the principle of certainty.\n2. Answer: G."
    },
    {
      "number": "1.3.2",
      "marks": 2,
      "clues": "- \"Redeemable\" means it can be bought back.\n- Watch the twin option about closing down.",
      "approach": "- Choose the description about buying back at the company's option.",
      "solution": "1. Redeemable preference shares can be bought back at the option of the issuing company.\n2. Answer: E."
    },
    {
      "number": "1.3.3",
      "marks": 2,
      "clues": "- In this technique, ideas are first produced individually.\n- Calling ideas out aloud is a different technique.",
      "approach": "- Match the technique to silent, individual idea generation.",
      "solution": "1. The nominal group technique lets employees silently generate ideas on their own first.\n2. Answer: A."
    },
    {
      "number": "1.3.4",
      "marks": 2,
      "clues": "- This is a King Code principle.\n- It is about taking responsibility, not about being clear.",
      "approach": "- Separate accountability from transparency.",
      "solution": "1. Accountability means the business takes responsibility for its decisions.\n2. Clear decisions for all stakeholders is transparency.\n3. Answer: I."
    },
    {
      "number": "1.3.5",
      "marks": 2,
      "clues": "- The expert believes they know everything.\n- Restricting discussion time suits a different personality.",
      "approach": "- Choose how a manager should deal with an expert.",
      "solution": "1. Managers must know their facts when dealing with an expert.\n2. Answer: B."
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
