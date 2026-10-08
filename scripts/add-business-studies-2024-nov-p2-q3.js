#!/usr/bin/env node
/**
 * DBE Business Studies P2 — November 2024 — Question 3 (order 3)
 * Section B (Business Roles): CSI focus areas, workers' health and safety duties, abuse of work time, creative
 * environment, team development stage, team dynamics theories, handling conflict, gender diversity.
 * 3.3.1 → 3.3.2 is a linked pair (DESIGN-UNI-13): the "other ways" item excludes the ways the scenario quotes.
 * Fresh scenarios/company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2024-nov-p2-q3.js --curriculum temp/curriculum-vocab-business-studies-p2-2024.json
 *   node scripts/add-business-studies-2024-nov-p2-q3.js --dry-run
 *   node scripts/add-business-studies-2024-nov-p2-q3.js
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
  "year": 2024,
  "paper": "nov_p2",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "professional_practice",
    "creative_thinking",
    "team_development",
    "conflict_management",
    "diversity"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q3/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q3/memo_3.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which TWO of the following are focus areas of corporate social investment (CSI)?",
    "metadata": [
      "Shareholder dividends",
      "Rural development",
      "Product advertising",
      "The environment",
      "Executive bonuses"
    ],
    "answer": [
      "Rural development",
      "The environment",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "csr_and_csi",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_csi_focus_area"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- CSI projects benefit people and places outside the business's own profit.\n- Payments to owners and managers are not social investment."
  },
  {
    "name": "Question 2",
    "question": "Which THREE of the following are responsibilities of WORKERS (not employers) in promoting health and safety in the workplace?",
    "metadata": [
      "Report accidents to the employer by the end of the shift",
      "Provide first-aid kits throughout the workplace",
      "Wear the prescribed safety clothing and equipment",
      "Appoint health and safety representatives",
      "Tell the employer about any illness that may affect their work"
    ],
    "answer": [
      "Report accidents to the employer by the end of the shift",
      "Wear the prescribed safety clothing and equipment",
      "Tell the employer about any illness that may affect their work",
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
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Workers are responsible for their own conduct and for reporting problems.\n- Providing equipment and appointing representatives are the employer's duties."
  },
  {
    "name": "Question 3",
    "question": "Which of the following is an example of abuse of work time?",
    "metadata": [
      "Using company money to pay for personal purchases",
      "Accepting gifts from a supplier in return for a contract",
      "Taking long lunch breaks without the manager's permission",
      "Sharing confidential client details with a competitor",
      ""
    ],
    "answer": [
      "Taking long lunch breaks without the manager's permission",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "ethics_and_professionalism",
    "topic": "professional_conduct",
    "subtopic": "term_definition_recall",
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
    "clues": "- Abuse of work time is about time paid for but not worked.\n- The other options are theft, bribery and breach of confidentiality."
  },
  {
    "name": "Question 4",
    "question": "Read the scenario and select the TWO ways in which Kwezi Textiles deals with abuse of work time. Kwezi Textiles makes school uniforms. Supervisors check each worker's output every two hours to make sure deadlines are met. Only the finance manager may approve payments. Management holds team-building days so that employees feel jointly responsible for meeting targets. Every worker receives a free uniform.",
    "metadata": [
      "Supervisors check each worker's output every two hours",
      "Only the finance manager may approve payments",
      "Management holds team-building days so that employees feel jointly responsible for meeting targets",
      "Every worker receives a free uniform",
      "Kwezi Textiles makes school uniforms"
    ],
    "answer": [
      "Supervisors check each worker's output every two hours",
      "Management holds team-building days so that employees feel jointly responsible for meeting targets",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "ethics_and_professionalism",
    "topic": "professional_conduct",
    "subtopic": "scenario_evidence_identification",
    "skills": [
      "identify_evidence_from_a_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Look for actions that make sure paid time is used productively.\n- Controlling who approves payments guards against fraud, not wasted time."
  },
  {
    "name": "Question 5",
    "question": "Kwezi Textiles already checks output every two hours and holds team-building days. Which TWO of the following are OTHER ways in which a business can deal with abuse of work time?",
    "metadata": [
      "Check each worker's output every two hours",
      "Include clear rules about work time in the code of conduct",
      "Hold team-building days so that employees feel responsible",
      "Speak directly to the employees who abuse work time",
      "Remove all tea breaks from the working day"
    ],
    "answer": [
      "Include clear rules about work time in the code of conduct",
      "Speak directly to the employees who abuse work time",
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
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Two options repeat what the business already does, so they cannot be \"other\" ways.\n- Taking away all breaks would harm employees rather than solve the problem."
  },
  {
    "name": "Question 6",
    "question": "Which THREE of the following help to create a workplace environment that promotes creative thinking?",
    "metadata": [
      "Place suggestion boxes around the workplace",
      "Criticise unworkable ideas in front of the whole team",
      "Reward employees who come up with useful new ideas",
      "Allow only senior managers to propose new ideas",
      "Train staff in creative problem-solving techniques"
    ],
    "answer": [
      "Place suggestion boxes around the workplace",
      "Reward employees who come up with useful new ideas",
      "Train staff in creative problem-solving techniques",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "creative_thinking_and_problem_solving",
    "topic": "creative_environment",
    "subtopic": "classification_and_criteria",
    "skills": [
      "classify_business_concept"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Creativity grows where every employee feels safe to share ideas.\n- Public criticism and limiting who may speak both discourage ideas."
  },
  {
    "name": "Question 7",
    "question": "Thabo leads a team of skilled, experienced members who make decisions on their own and work smoothly towards their goals without close supervision. Which stage of team development has this team reached?",
    "metadata": [
      "Norming",
      "Performing",
      "Storming",
      "Forming",
      ""
    ],
    "answer": [
      "Performing",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "team_performance_and_conflict_management",
    "topic": "team_development",
    "subtopic": "scenario_application",
    "skills": [
      "identify_team_development_stage"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The team no longer needs its leader to supervise or settle disputes.\n- Which stage comes after the team has agreed on its norms?"
  },
  {
    "name": "Question 8",
    "question": "Which THREE statements explain why team dynamics theories are important for improving team performance?",
    "metadata": [
      "Tasks can be allocated according to each member's role",
      "Every member performs the same role to avoid confusion",
      "Leaders understand personality types and assign tasks better",
      "Team leaders no longer need to monitor team performance",
      "Conflict may be reduced when members perform different roles"
    ],
    "answer": [
      "Tasks can be allocated according to each member's role",
      "Leaders understand personality types and assign tasks better",
      "Conflict may be reduced when members perform different roles",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "team_performance_and_conflict_management",
    "topic": "team_dynamics",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_team_dynamics_theory"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Team dynamics theories describe the different roles people play in a team.\n- They help leaders use those differences; they do not remove the need for monitoring."
  },
  {
    "name": "Question 9",
    "question": "Arrange the following steps for handling conflict in the workplace in the correct order.",
    "metadata": [
      "Brainstorm possible ways of resolving the conflict",
      "Identify the cause of the conflict",
      "Follow up to make sure the conflict has been resolved",
      "Acknowledge that there is a conflict",
      "Select and implement the best solution",
      "Arrange a meeting where each party states its views"
    ],
    "answer": [
      "Acknowledge that there is a conflict",
      "Identify the cause of the conflict",
      "Arrange a meeting where each party states its views",
      "Brainstorm possible ways of resolving the conflict",
      "Select and implement the best solution",
      "Follow up to make sure the conflict has been resolved"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "team_performance_and_conflict_management",
    "topic": "conflict_management",
    "subtopic": "sequencing_and_process",
    "skills": [
      "explain_conflict_resolution"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A conflict cannot be solved until everyone admits it exists.\n- Solutions are found after the parties have been heard, and checked after they are implemented."
  },
  {
    "name": "Question 10",
    "question": "Which THREE of the following are suitable ways for a business to deal with gender as a diversity issue in the workplace?",
    "metadata": [
      "Offer men and women equal employment opportunities",
      "Reserve physically demanding jobs for male employees",
      "Pay men and women equally for work of equal value",
      "Appoint new staff by gender rather than skills and ability",
      "Set targets for gender equity in management positions"
    ],
    "answer": [
      "Offer men and women equal employment opportunities",
      "Pay men and women equally for work of equal value",
      "Set targets for gender equity in management positions",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "human_rights_and_diversity",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_diversity_benefit"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Dealing with gender diversity means treating men and women fairly.\n- Appointments should still be based on skills and ability."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1",
      "marks": 2,
      "clues": "- CSI projects target areas outside the business's profit.\n- Two are needed; only the first two are marked.",
      "approach": "- Recall the areas businesses invest in through CSI.\n- Name two, one mark each.",
      "solution": "1. Community.\n2. Rural development.\n3. Employees or the environment are also accepted. Any two: 1 mark each."
    },
    {
      "number": "3.2",
      "marks": 6,
      "clues": "- These are the workers' duties, not the employer's.\n- Think about equipment, reporting and their own health.",
      "approach": "- Recall what the Occupational Health and Safety Act expects of workers.\n- Outline three duties, two marks each.",
      "solution": "1. Use prescribed safety equipment.\n2. Report accidents to the employer by the end of the shift.\n3. Report unsafe or unhealthy working conditions.\n4. Inform the employer of any illness that may affect their ability to work.\n5. Take care of their own health and safety, and follow the rules. Any three: 2 marks each."
    },
    {
      "number": "3.3.1",
      "marks": 2,
      "clues": "- Only words taken from the scenario earn marks.\n- Look for actions that keep employees using work time well.",
      "approach": "- Find the sentences about monitoring and responsibility.\n- Quote two of them.",
      "solution": "1. \"They monitor their employees on an hourly basis to ensure that tasks are completed on time\": 1 mark.\n2. \"TF also strengthens the team spirit among the employees so that they feel responsible for what needs to be achieved\": 1 mark.\n3. Limiting access to business funds is about theft, not work time."
    },
    {
      "number": "3.3.2",
      "marks": 4,
      "clues": "- The ways must differ from those quoted in 3.3.1.\n- Think about the code of conduct and direct conversations.",
      "approach": "- List measures other than monitoring and team spirit.\n- Explain two, two marks each.",
      "solution": "1. Speak directly to employees who abuse work time.\n2. Include clear rules about work time in the code of conduct, and train staff on it.\n3. Have all employees sign the code of conduct so they know its contents.\n4. Make employees aware that lower profit means smaller bonuses, or structure hours to allow flexible time. Any two: 2 marks each; answers quoted in 3.3.1 earn nothing."
    },
    {
      "number": "3.4",
      "marks": 6,
      "clues": "- Creativity needs encouragement, time and rewards.\n- Think about suggestion boxes, brainstorming and training.",
      "approach": "- Recommend ways management can encourage new ideas.\n- Give three points, two marks each.",
      "solution": "1. Emphasise that management wants to hear everyone's ideas.\n2. Make time for brainstorming sessions and workshops.\n3. Place suggestion boxes around the workplace and keep communication open.\n4. Train staff in creative problem-solving, and reward useful ideas.\n5. Any three: 2 marks each."
    },
    {
      "number": "3.5.1",
      "marks": 2,
      "clues": "- The team members are experienced and competent.\n- They make decisions without supervision.",
      "approach": "- Match the team's behaviour to a stage of team development.",
      "solution": "1. A team that works independently and confidently towards its goals is at the performing stage.\n2. Answer: performing: 2 marks."
    },
    {
      "number": "3.5.2",
      "marks": 6,
      "clues": "- Team dynamics theories explain the roles people play in teams.\n- Think about allocating tasks and reducing conflict.",
      "approach": "- Discuss how understanding team roles improves performance.\n- Each point is a fact with a reason, 2 marks each.",
      "solution": "1. The theories explain how effective teams operate.\n2. Tasks can be allocated according to members' roles and abilities, which optimises performance.\n3. Leaders understand members' personality types, so tasks are assigned more effectively.\n4. Conflict may be reduced when members perform different roles.\n5. Any three discussed points: 6 marks."
    },
    {
      "number": "3.6",
      "marks": 6,
      "clues": "- Conflict is handled in steps.\n- Start by acknowledging it and end by monitoring the solution.",
      "approach": "- Explain the steps a business follows to handle conflict.\n- Each step is a fact with a reason, 2 marks each.",
      "solution": "1. Acknowledge that there is conflict, and identify its cause.\n2. Arrange a meeting where each party can state its views.\n3. Brainstorm possible solutions and agree on criteria to evaluate them.\n4. Select and implement the best solution, then follow up and monitor progress.\n5. Any three explained points: 6 marks."
    },
    {
      "number": "3.7",
      "marks": 6,
      "clues": "- Gender diversity is about fair treatment of men and women.\n- Think about opportunities, promotion and pay.",
      "approach": "- Suggest ways to promote gender equality at work.\n- Give three points, two marks each.",
      "solution": "1. Offer men and women equal employment opportunities.\n2. Promote both men and women into management positions.\n3. Set targets for gender equity, in line with the Employment Equity Act.\n4. Base appointments on skills and ability, and pay men and women fairly and equally.\n5. Any three: 2 marks each."
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
