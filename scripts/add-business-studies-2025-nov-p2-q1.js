#!/usr/bin/env node
/**
 * DBE Business Studies P2 — November 2025 — Question 1 (order 1)
 * Section A equivalent: compulsory objective-type items spanning leadership, ownership/
 * liability, ethics, team development, socio-economic issues, problem-solving techniques,
 * CSR (triple bottom line), and term-matching. DESIGN-BUS-01: no letter-based fitb — every
 * item is multiple_choice/multi_select/match. Fresh scenarios/company names throughout
 * (DESIGN-UNI-01) — never the real exam's own wording or company names.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2025-nov-p2-q1.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2025-nov-p2-q1.js --dry-run
 *   node scripts/add-business-studies-2025-nov-p2-q1.js
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
  name: 'Question 1',
  syllabus: 'dbe',
  subject: 'business_studies',
  year: 2025,
  paper: 'nov_p2',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 30,
  tags: ['leadership_styles', 'ownership_and_liability', 'team_development', 'corporate_social_responsibility'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q1/question_1.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q1/question_2.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q1/question_3.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q1/memo_1.png"],
  exam_question_marks: 30,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'A leadership theory holds that the most effective style depends on the specific circumstances a leader faces, rather than one fixed approach. Which theory is this?',
    metadata: ['Transformational leadership theory', 'Autocratic leadership', 'Situational leadership theory', 'Servant leadership', ''],
    answer: ['Situational leadership theory', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'management_and_leadership',
    topic: 'leadership_styles',
    subtopic: 'term_definition_recall',
    skills: ['define_business_term'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Think about what changes from one situation to the next for this type of leader.\n- The name of the theory describes exactly what it adapts to.',
  },
  {
    name: 'Question 2',
    question: "Vuna Hardware is a sole trader business. When it could not repay a supplier, the owner's personal savings account was used to settle the debt. Which concept explains why the owner's personal assets were at risk?",
    metadata: ['Limited liability', 'Unlimited liability', 'Perpetual succession', 'Separate legal personality', ''],
    answer: ['Unlimited liability', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'forms_of_ownership',
    topic: 'ownership_and_liability',
    subtopic: 'scenario_application',
    skills: ['classify_ownership_liability'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A sole trader and its owner are not legally separate.\n- Think about what "unlimited" is describing here — the business\'s debts, or the owner\'s exposure to them.',
  },
  {
    name: 'Question 3',
    question: 'Which of the following would be classified as unprofessional business practice in the workplace?',
    metadata: [
      "Using the business's delivery vehicle for a private errand without permission",
      'Taking an extended lunch break beyond the time allowed, on a regular basis',
      'Meeting all production deadlines set for the month',
      'Making unwelcome comments of a sexual nature towards a colleague',
      'Submitting expense claims within the required timeframe',
    ],
    answer: [
      "Using the business's delivery vehicle for a private errand without permission",
      'Taking an extended lunch break beyond the time allowed, on a regular basis',
      'Making unwelcome comments of a sexual nature towards a colleague',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'ethics_and_professionalism',
    topic: 'professional_conduct',
    subtopic: 'classification_and_criteria',
    skills: ['classify_business_concept'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Look for behaviour that misuses company resources, wastes paid work time, or harasses a colleague.\n- Meeting deadlines and submitting claims on time are both compliant, not unprofessional.',
  },
  {
    name: 'Question 4',
    question: 'During which stage of team development do members typically compete with one another for the position of team leader, creating conflict within the group?',
    metadata: ['Forming', 'Storming', 'Norming', 'Performing', ''],
    answer: ['Storming', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'team_performance_and_conflict_management',
    topic: 'team_development',
    subtopic: 'term_definition_recall',
    skills: ['identify_team_development_stage'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- This stage comes right after the team first forms, once the politeness wears off.\n- The stage name itself describes the conflict.',
  },
  {
    name: 'Question 5',
    question: 'Thandeka Transport wants to deal directly with HIV/Aids as a socio-economic issue affecting its own employees, rather than a broader societal issue. Which action best achieves this?',
    metadata: [
      'Creating job opportunities for unemployed people in the surrounding community',
      'Rolling out an antiretroviral treatment programme for employees living with HIV',
      'Donating to a national poverty-alleviation fund run by government',
      'Offering a volunteering programme to attract potential new employees',
      '',
    ],
    answer: ['Rolling out an antiretroviral treatment programme for employees living with HIV', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'socio_economic_issues',
    subtopic: 'scenario_application',
    skills: ['explain_corporate_social_responsibility'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: "- The question asks which action targets the business's OWN employees directly, not the wider community.\n- Job creation and poverty funds address other socio-economic issues, not HIV/Aids specifically.",
  },
  {
    name: 'Question 6',
    question: 'A business lists the forces driving a proposed change against the forces resisting it, then weighs the two sides to decide whether to proceed. Which problem-solving technique is being used?',
    metadata: ['Delphi technique', 'Brainstorming', 'Force-field analysis', 'Nominal group technique', ''],
    answer: ['Force-field analysis', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'creative_thinking_and_problem_solving',
    topic: 'problem_solving_techniques',
    subtopic: 'term_definition_recall',
    skills: ['define_business_term'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The technique is named after the two opposing "forces" it compares.\n- It is not the technique that uses anonymous, repeated rounds of expert opinion.',
  },
  {
    name: 'Question 7',
    question: 'The triple bottom line framework asks a business to report on which THREE dimensions of its performance?',
    metadata: ['People', 'Planet', 'Profit', 'Price', 'Promotion'],
    answer: ['People', 'Planet', 'Profit', '', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'csr_and_csi',
    subtopic: 'classification_and_criteria',
    skills: ['explain_corporate_social_responsibility'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 7,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Two of the three dimensions rhyme with each other.\n- "Price" and "Promotion" belong to the marketing mix, not this framework.',
  },
  {
    name: 'Question 8',
    question: 'Match each investment/insurance term in Column A to its description in Column B.',
    metadata: [
      'A - Cumulative preference shares',
      'B - Average clause',
      'C - Excess',
      '1 - Unpaid dividends from previous loss-making years are paid out once the company returns to profit',
      '2 - Applies when a business insures an asset for less than its true market value',
      '3 - The fixed amount an insured party must pay towards a claim before the insurer covers the rest',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'definition',
    unit: 'investment_securities_and_insurance',
    topic: 'insurance_principles',
    subtopic: 'term_definition_recall',
    skills: ['explain_insurance_principle'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 8,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- "Cumulative" hints at something building up over time before being paid.\n- "Average clause" and "excess" are both about under-insurance and shared cost, but at different points in a claim.',
  },
  {
    name: 'Question 9',
    question: 'Match each workplace-ethics term in Column A to its description in Column B.',
    metadata: [
      'A - Grievance',
      'B - Professional behaviour',
      'C - Whistleblowing',
      '1 - A formal complaint an employee raises with management about a workplace issue',
      '2 - Conduct that upholds the reputation and ethical standards expected of a business',
      '3 - Reporting unethical or illegal conduct within a business to the relevant authority',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'definition',
    unit: 'ethics_and_professionalism',
    topic: 'professional_conduct',
    subtopic: 'term_definition_recall',
    skills: ['define_business_term'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 9,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A grievance is raised BY an employee; whistleblowing is about reporting wrongdoing more broadly.\n- Professional behaviour is about the business\'s own reputation, not a single complaint.',
  },
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  sub_questions: [
    { number: '1.1.1', marks: 2, clues: '- Simple interest doesn\'t compound — work out one year\'s interest and multiply by the number of years.\n- Convert the percentage to a decimal before multiplying.', approach: '- Convert 12% to a decimal (0.12).\n- Multiply the principal by the rate to get one year\'s interest.\n- Multiply that by the number of years for simple interest.', solution: '1. Convert 12% to a decimal: 0.12.\n2. One year\'s interest: R30 000 x 0.12 = R3 600.\n3. Simple interest over 3 years: R3 600 x 3 = R10 800.\n4. The correct answer is R10 800.' },
    { number: '1.1.2', marks: 2, clues: '- Think about what happens to the OWNER, not the business itself, when debts can\'t be paid.\n- "Unlimited" describes how far the owner\'s exposure to the business\'s debts extends.', approach: '- Recall that unlimited liability means no legal separation between owner and business.\n- Match this to what happens to the owner\'s own assets when the business can\'t pay its debts.', solution: '1. Unlimited liability means the owner and the business are not legally separate entities.\n2. If the business cannot pay its debts, creditors can pursue the owner\'s personal assets to recover what is owed.\n3. The correct answer is that the owner\'s personal assets may be seized to pay the debts of the business.' },
    { number: '1.1.3', marks: 2, clues: '- The question specifically asks about fraud, not unprofessional behaviour in general.\n- Look for the option involving someone using something that isn\'t theirs to use.', approach: '- Recall the categories of unprofessional business practice.\n- Match fraud specifically to misuse of funds or resources that don\'t belong to the person using them.', solution: '1. Fraud involves the dishonest use of something not belonging to the user.\n2. Of the listed practices, unauthorised use of workplace funds and resources is the one that constitutes fraud.\n3. The correct answer is the unauthorised use of workplace funds and resources.' },
    { number: '1.1.4', marks: 2, clues: '- This stage comes right after a team first forms, once initial politeness fades.\n- The stage\'s own name describes what happens during it.', approach: '- Recall the order of team development stages: forming, storming, norming, performing, adjourning.\n- Match competing for leadership/conflict to the stage named for exactly that.', solution: '1. The stages of team development, in order, are forming, storming, norming, performing, and adjourning.\n2. Storming is the stage where conflict and power struggles, including over team leadership, typically occur.\n3. The correct answer is storming.' },
    { number: '1.1.5', marks: 2, clues: '- The question asks for the option addressing the business\'s OWN employees directly, not the wider community.\n- Job creation and government donations address different socio-economic issues, not HIV/Aids treatment specifically.', approach: '- Compare each option against "directly supports employees living with HIV/Aids".\n- Eliminate options aimed at the broader community or an unrelated cause.', solution: '1. Job creation and poverty-alleviation donations address broader socio-economic issues, not HIV/Aids treatment.\n2. A volunteering programme to attract new staff doesn\'t treat existing employees.\n3. Rolling out an antiretroviral treatment programme directly supports employees already living with HIV.\n4. The correct answer is rolling out an antiretroviral treatment programme for employees living with HIV.' },
    { number: '1.2.1', marks: 2, clues: '- Think about what changes from one situation to the next for this type of leader.\n- The theory\'s name describes exactly what it adapts to.', approach: '- Recall the leadership theories covered in class.\n- Match "depends on circumstances" to the theory named for exactly that.', solution: '1. Situational leadership theory holds that the most effective style depends on the specific situation a leader faces.\n2. The correct word is "situational".' },
    { number: '1.2.2', marks: 2, clues: '- Think about who owns and controls this type of company.\n- It exists specifically to serve the public, not private shareholders.', approach: '- Recall the different forms of ownership.\n- Match "creates jobs and offers essential services to the majority of citizens" to the one owned by the state for public benefit.', solution: '1. A state-owned company is owned and controlled by government specifically to serve the public.\n2. It creates jobs and offers essential services to the majority of citizens as its core purpose.\n3. The correct word is "state-owned".' },
    { number: '1.2.3', marks: 2, clues: '- Think about a physical item placed in-store, not on a screen, to catch a customer\'s eye.\n- It\'s a printed visual aid, not digital media.', approach: '- Recall common visual merchandising tools.\n- Match "strategically placed in the business as a visual aid" to a physical, printed item.', solution: '1. Posters are printed visual aids placed within a business to attract customer attention.\n2. The correct word is "posters".' },
    { number: '1.2.4', marks: 2, clues: '- The technique is named after the two opposing "forces" it compares.\n- It is not the technique that uses anonymous, repeated rounds of expert opinion.', approach: '- Recall each problem-solving technique\'s defining feature.\n- Match "driving forces vs restraining forces, then weighing them" to its technique.', solution: '1. Force-field analysis lists the forces driving a proposed change against the forces resisting it, then weighs the two sides.\n2. The correct term is "force-field analysis".' },
    { number: '1.2.5', marks: 2, clues: '- The triple bottom line has three elements; two of them rhyme.\n- This one concerns environmental sustainability, not profit or people.', approach: '- Recall the triple bottom line\'s three elements: people, planet, profit.\n- Match "eco-friendly production methods" to the environmental element.', solution: '1. The triple bottom line\'s three elements are people, planet, and profit.\n2. Eco-friendly production methods relate to the environmental element.\n3. The correct word is "planet".' },
    { number: '1.3.1', marks: 2, clues: '- Think about what happens to this type of business when its single owner leaves.\n- "Continuity" here refers to whether the business can outlive its owner\'s involvement.', approach: '- Recall the defining features of a sole trader.\n- Match it to the description about continuity of existence.', solution: '1. A sole trader has no legal existence separate from its owner.\n2. This means the business has limited continuity — it ceases to exist if the owner resigns or dies.\n3. The correct match is D: has limited continuity, as the business ceases to exist upon resignation of the owner.' },
    { number: '1.3.2', marks: 2, clues: '- "Cumulative" hints at something building up over time before being paid out.\n- Think about what happens to unpaid dividends in a loss-making year.', approach: '- Recall what makes cumulative preference shares different from ordinary preference shares.\n- Match the term to the description about unpaid dividends carrying forward.', solution: '1. Cumulative preference shares carry forward any dividends not paid in a loss-making year.\n2. Once the company returns to profit, those unpaid dividends are paid out together with the current year\'s dividend.\n3. The correct match is J: investors receive payments for dividends that were not paid out in previous years.' },
    { number: '1.3.3', marks: 2, clues: '- This clause applies when the insured value doesn\'t match the asset\'s true worth.\n- Think about UNDER-insuring, not insuring for the correct or a higher amount.', approach: '- Recall what the average clause penalises.\n- Match it to the description about assets insured for less than market value.', solution: '1. The average clause applies when a business insures an asset for less than its true market value.\n2. In that case, any claim payout is reduced proportionally.\n3. The correct match is H: applies when assets are insured for less than their market value.' },
    { number: '1.3.4', marks: 2, clues: '- Think about what this concept protects for the business as a whole, not for one individual.\n- It concerns the business\'s standing, not a specific complaint or dispute.', approach: '- Recall what professional behaviour is meant to protect.\n- Match it to the description about the business\'s reputation.', solution: '1. Professional behaviour is conduct that upholds the ethical standards and reputation expected of a business.\n2. The correct match is F: focuses on upholding the reputation of the business.' },
    { number: '1.3.5', marks: 2, clues: '- Think about who raises this, and to whom.\n- It\'s a formal process, not an informal disagreement between colleagues.', approach: '- Recall the definition of a grievance in the workplace.\n- Match it to the description about employees lodging complaints with management.', solution: '1. A grievance is a formal complaint an employee raises with management about a workplace issue.\n2. The correct match is A: occur when employees lodge complaints with management in the workplace.' },
  ],
  model: 'claude-sonnet-5',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
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
