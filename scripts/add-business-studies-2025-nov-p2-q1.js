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
  question_image_urls: [],
  memo_image_urls: [],
  exam_question_marks: 30,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'A leadership theory holds that the most effective style depends on the specific circumstances a leader faces, rather than one fixed approach. Which theory is this?',
    metadata: ['Situational leadership theory', 'Transformational leadership theory', 'Autocratic leadership', 'Servant leadership', ''],
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
    metadata: ['Force-field analysis', 'Delphi technique', 'Brainstorming', 'Nominal group technique', ''],
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
    { number: '1', marks: null, clues: '- Think about what changes from one situation to the next.', approach: '- Recall the leadership theories covered in class.\n- Match the description ("depends on circumstances") to the theory named for exactly that.', solution: '1. Situational leadership theory holds that the best style depends on the specific situation and the team\'s readiness.\n2. It differs from autocratic (always directive) or servant leadership (always subordinate-focused), which do not flex by situation.' },
    { number: '2', marks: null, clues: '- A sole trader and its owner are legally the same entity.', approach: '- Identify the form of ownership.\n- Recall what unlimited liability means for that form.\n- Apply it to the scenario.', solution: "1. Vuna Hardware is a sole trader.\n2. A sole trader has unlimited liability: no legal separation between the owner and the business.\n3. This means the owner's personal assets, such as savings, may be used to pay business debts." },
    { number: '3', marks: null, clues: '- Look for misuse of resources, wasted paid time, or harassment.', approach: '- Read each option.\n- Ask whether it wastes company resources/time or breaches a code of conduct.\n- Select every option that fits, ignore compliant ones.', solution: '1. Using a company vehicle for a private errand without permission misuses workplace resources.\n2. Regularly taking longer breaks than allowed abuses paid work time.\n3. Unwelcome sexual comments towards a colleague is harassment, an unprofessional and unethical practice.\n4. Meeting deadlines and submitting claims on time are both compliant behaviour, not violations.' },
    { number: '4', marks: null, clues: '- This stage follows forming, once politeness wears off.', approach: '- Recall the order of team development stages.\n- Match "competing for leadership" to the stage known for conflict.', solution: '1. The stages in order are forming, storming, norming, performing, adjourning.\n2. Storming is the stage where power struggles and conflict, including over team leadership, typically occur.' },
    { number: '5', marks: null, clues: '- The question asks for action aimed at the business\'s own employees.', approach: '- Compare each option against "directly helps employees with HIV/Aids".\n- Eliminate options aimed at the wider community or unrelated to treatment.', solution: '1. Job creation and poverty-alleviation funds address broader socio-economic issues, not HIV/Aids treatment directly.\n2. A volunteering programme is about attracting staff, not treating HIV/Aids.\n3. Rolling out an antiretroviral treatment programme directly supports employees living with HIV, the correct answer.' },
    { number: '6', marks: null, clues: '- The technique is named after the two "forces" it weighs.', approach: '- Recall each problem-solving technique\'s defining feature.\n- Match "driving vs restraining forces" to its technique.', solution: '1. Force-field analysis lists driving forces for a change against restraining forces against it.\n2. This differs from Delphi (anonymous expert rounds), brainstorming (free idea generation), and nominal group technique (silent idea ranking).' },
    { number: '7', marks: null, clues: '- Two of the three dimensions rhyme.', approach: '- Recall the triple bottom line\'s three Ps.\n- Exclude marketing-mix terms.', solution: '1. The triple bottom line reports on People, Planet and Profit.\n2. Price and Promotion belong to the marketing mix, a different framework entirely.' },
    { number: '8', marks: null, clues: '- "Cumulative" suggests something building up over time.', approach: '- Recall each term\'s definition.\n- Match each to its description.', solution: '1. Cumulative preference shares: unpaid dividends from loss-making years carry forward and are paid once profitable again (A-1).\n2. Average clause: applies when an asset is under-insured relative to its market value (B-2).\n3. Excess: the amount the insured pays before the insurer covers the remainder of a claim (C-3).' },
    { number: '9', marks: null, clues: '- A grievance comes from an employee; whistleblowing is broader.', approach: '- Recall each term\'s definition.\n- Match each to its description.', solution: '1. Grievance: a formal complaint an employee raises with management (A-1).\n2. Professional behaviour: conduct that upholds the business\'s reputation and ethics (B-2).\n3. Whistleblowing: reporting unethical or illegal conduct to the relevant authority (C-3).' },
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
