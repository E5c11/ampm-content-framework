#!/usr/bin/env node
/**
 * DBE Business Studies P2 — November 2025 — Question 4 (order 4)
 * Miscellaneous topics (Business Ventures + Business Roles): non-insurable risks,
 * investment-opportunity-type matching, management vs. leadership, personal liability
 * companies, corporate social investment (CSI) focus areas, team dynamics theories, a
 * fresh creative-thinking-environment scenario (quote -> explain-other), and unethical
 * rural pricing. DESIGN-BUS-02: discursive content decomposes into closed-form
 * presentations. One DESIGN-UNI-13 linked pair, scoped so the second sub-part's correct
 * option excludes the first's. Fresh scenarios/company names throughout (DESIGN-UNI-01).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2025-nov-p2-q4.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2025-nov-p2-q4.js --dry-run
 *   node scripts/add-business-studies-2025-nov-p2-q4.js
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
  name: 'Question 4',
  syllabus: 'dbe',
  subject: 'business_studies',
  year: 2025,
  paper: 'nov_p2',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 40,
  tags: ['non_insurable_risks', 'forms_of_ownership', 'corporate_social_responsibility', 'creative_thinking'],
  question_image_urls: [],
  memo_image_urls: [],
  exam_question_marks: 40,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Which of the following would typically be classified as NON-insurable risks for a business?',
    metadata: [
      'Loss of profit caused by a poor strategic decision by management',
      'Fire damage to a business premises',
      'A general downturn in the economy reducing customer demand',
      'Theft of stock from a warehouse',
      'A competitor launching a cheaper alternative product',
    ],
    answer: [
      'Loss of profit caused by a poor strategic decision by management',
      'A general downturn in the economy reducing customer demand',
      'A competitor launching a cheaper alternative product',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'investment_securities_and_insurance',
    topic: 'non_insurable_risks',
    subtopic: 'classification_and_criteria',
    skills: ['explain_insurance_concept'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Insurable risks are specific, accidental, and measurable, like fire or theft.\n- Risks arising from normal business/market decisions are not insurable.',
  },
  {
    name: 'Question 2',
    question: 'Match each investment/financing description in Column A to the type of investment opportunity it represents in Column B.',
    metadata: [
      'A - A company raises capital by selling shares directly to members of the public',
      'B - A group of employees each contribute a fixed monthly amount to a shared, informal savings pool',
      'C - A business borrows a lump sum from a bank, to be repaid with interest over time',
      '1 - Loan finance',
      '2 - Securities (shares)',
      '3 - Informal savings scheme (stokvel)',
    ],
    answer: ['A-2', 'B-3', 'C-1'],
    presentation: 'match',
    type: 'definition',
    unit: 'investment_securities_and_insurance',
    topic: 'securities_investment',
    subtopic: 'classification_and_criteria',
    skills: ['explain_investment_option'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- One of these raises capital by giving away part-ownership; another simply borrows money to repay later.\n- The informal option is not run through a bank or the JSE at all.',
  },
  {
    name: 'Question 3',
    question: 'Which statement correctly distinguishes leadership from management?',
    metadata: [
      'Leadership focuses on planning budgets; management focuses on setting a vision',
      'Leadership focuses on inspiring and influencing people; management focuses on planning, organising and controlling resources',
      'Leadership and management are simply two different words for the exact same role',
      'Management only applies to large companies; leadership only applies to small ones',
      '',
    ],
    answer: ['Leadership focuses on inspiring and influencing people; management focuses on planning, organising and controlling resources', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'management_and_leadership',
    topic: 'management_vs_leadership',
    subtopic: 'term_definition_recall',
    skills: ['distinguish_management_from_leadership'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- One role is about people and vision; the other is about processes and resources.\n- They overlap in practice but are not identical, and neither is limited by company size.',
  },
  {
    name: 'Question 4',
    question: 'Which of the following are genuine advantages of registering a business as a personal liability company?',
    metadata: [
      'Directors have unlimited liability, giving creditors more confidence to extend credit',
      'The company has perpetual succession, continuing even if a director resigns',
      'Directors can never be held responsible for company debts under any circumstances',
      'The company is recognised as a separate legal entity from its directors',
      'The business is fully exempt from paying company tax',
    ],
    answer: [
      'Directors have unlimited liability, giving creditors more confidence to extend credit',
      'The company has perpetual succession, continuing even if a director resigns',
      'The company is recognised as a separate legal entity from its directors',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'forms_of_ownership',
    topic: 'ownership_and_liability',
    subtopic: 'classification_and_criteria',
    skills: ['classify_ownership_liability'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A personal liability company is still a separate legal entity with perpetual succession, unlike a sole trader.\n- Its directors do carry unlimited liability — that is a feature, and lenders value it — but it is not a tax exemption.',
  },
  {
    name: 'Question 5',
    question: 'Which of the following are recognised corporate social investment (CSI) focus areas?',
    metadata: [
      'Education',
      'Health and social welfare',
      'Increasing executive bonuses',
      'Housing and community development',
      'Sport development',
    ],
    answer: ['Education', 'Health and social welfare', 'Housing and community development', 'Sport development', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'csr_and_csi',
    subtopic: 'classification_and_criteria',
    skills: ['explain_csi_focus_area'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- CSI focus areas benefit the wider community, not the business\'s own staff pay.\n- Executive bonuses are an internal cost, not a community investment.',
  },
  {
    name: 'Question 6',
    question: 'Why are team dynamics theories important for improving team performance?',
    metadata: [
      'They guarantee that every team will always agree on every decision',
      'They help explain how team members interact, so managers can address problems affecting performance',
      'They remove the need for a team to ever have a designated leader',
      'They are only relevant to sports teams, not workplace teams',
      '',
    ],
    answer: ['They help explain how team members interact, so managers can address problems affecting performance', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'team_performance_and_conflict_management',
    topic: 'team_dynamics',
    subtopic: 'term_definition_recall',
    skills: ['explain_team_dynamics_theory'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- These theories are diagnostic tools, not guarantees of agreement.\n- They apply equally to workplace teams as to any other group.',
  },
  {
    name: 'Question 7',
    question: "At Zanele Design Studio, staff are given a quiet, private workspace free from interruptions, and management deliberately schedules longer, more frequent breaks to let ideas develop. Quote TWO ways described here in which the studio creates an environment that promotes creative thinking.",
    metadata: [
      'a quiet, private workspace free from interruptions',
      'longer, more frequent breaks',
      'Zanele Design Studio',
      'management deliberately schedules',
      '',
    ],
    answer: ['a quiet, private workspace free from interruptions', 'longer, more frequent breaks', '', '', ''],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'creative_thinking_and_problem_solving',
    topic: 'creative_environment',
    subtopic: 'scenario_evidence_identification',
    skills: ['identify_evidence_from_a_scenario'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 7,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Look for the two concrete workplace conditions described, not the company name or who arranged them.\n- Both quoted phrases relate directly to reducing pressure and distraction.',
  },
  {
    name: 'Question 8',
    question: "OTHER than a quiet workspace and longer breaks, which additional way could Zanele Design Studio create an environment that promotes creative thinking?",
    metadata: ['Setting extremely tight deadlines for every single task', 'Encouraging staff to freely share unusual or unconventional ideas without fear of criticism', 'Strictly enforcing one fixed way of completing every task', 'Discouraging any collaboration between departments', ''],
    answer: ['Encouraging staff to freely share unusual or unconventional ideas without fear of criticism', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'creative_thinking_and_problem_solving',
    topic: 'creative_environment',
    subtopic: 'classification_and_criteria',
    skills: ['identify_evidence_from_a_scenario'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 8,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A creative environment reduces fear of judgement, it does not add pressure or rigid rules.\n- Tight deadlines, one fixed method, and blocking collaboration all work against creativity.',
  },
  {
    name: 'Question 9',
    question: 'A business in a rural area charges significantly higher prices for basic goods than the same business charges in urban areas, despite similar operating costs. What should this business be advised to do?',
    metadata: ['Continue the practice, since rural customers have no other option', 'Review and align its pricing so it reflects actual cost differences rather than exploiting limited customer choice', 'Raise urban prices to match the rural prices instead', 'Close the rural branch rather than address the pricing', ''],
    answer: ['Review and align its pricing so it reflects actual cost differences rather than exploiting limited customer choice', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'ethics_and_professionalism',
    topic: 'professional_conduct',
    subtopic: 'scenario_application',
    skills: ['classify_business_concept'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 9,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Exploiting limited customer choice through unjustified pricing is an unethical business practice.\n- The fair response addresses the pricing itself, not the customers or the branch\'s existence.',
  },
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  sub_questions: [
    { number: '1', marks: null, clues: '- Insurable risks are specific and accidental, like fire or theft.', approach: '- Compare each option against the definition of an insurable risk (accidental, measurable, specific).\n- Eliminate options describing normal business/market outcomes.', solution: '1. Poor management decisions, general economic downturns, and new competition are all normal business risks, not insurable.\n2. Fire damage and theft are specific, accidental, measurable events — both are insurable.' },
    { number: '2', marks: null, clues: '- One option gives away part-ownership; another simply borrows and repays.', approach: '- Recall the defining feature of each investment/financing type.\n- Match each description to its type.', solution: '1. Selling shares to the public raises capital via securities (A-2).\n2. A shared, informal monthly savings pool is a stokvel/informal savings scheme (B-3).\n3. Borrowing a lump sum to repay with interest is loan finance (C-1).' },
    { number: '3', marks: null, clues: '- One role is about people and vision; the other about processes and resources.', approach: '- Recall the standard distinction between leadership and management.\n- Eliminate options that conflate or oversimplify the two.', solution: '1. Leadership is about inspiring and influencing people towards a vision.\n2. Management is about planning, organising and controlling resources to achieve goals.\n3. The two are related but distinct, and neither is limited by company size.' },
    { number: '4', marks: null, clues: '- A personal liability company is still a separate legal entity with perpetual succession.', approach: '- Recall the features of a personal liability company.\n- Distinguish genuine features from invented claims.', solution: '1. Unlimited director liability increases creditor confidence, a genuine advantage.\n2. Perpetual succession and separate legal personality are both genuine features.\n3. Directors are NOT protected from company debts (that is the trade-off for the credit advantage), and there is no blanket tax exemption.' },
    { number: '5', marks: null, clues: '- CSI benefits the wider community, not staff pay.', approach: '- Recall the recognised CSI focus areas.\n- Eliminate any option describing an internal business cost.', solution: '1. Education, health/social welfare, housing/community development, and sport development are all recognised CSI focus areas.\n2. Increasing executive bonuses is an internal cost, not a community investment.' },
    { number: '6', marks: null, clues: '- These theories are diagnostic tools, not guarantees.', approach: '- Consider what a theory about team dynamics actually helps a manager do.\n- Eliminate any option promising an absolute guarantee.', solution: '1. Team dynamics theories explain how members interact, helping managers diagnose and address performance problems.\n2. They do not guarantee agreement, remove the need for leadership, or apply only to sports teams.' },
    { number: '7', marks: null, clues: '- Look for the two concrete workplace conditions described.', approach: '- Reread the scenario.\n- Identify the two specific conditions the studio put in place.', solution: '1. "A quiet, private workspace free from interruptions" is one concrete condition described.\n2. "Longer, more frequent breaks" is the second.\n3. The company name and who arranged them are scenario details, not the conditions themselves.' },
    { number: '8', marks: null, clues: '- A creative environment reduces fear of judgement.', approach: '- Recall other conditions that support creative thinking.\n- Eliminate options that add pressure or rigidity.', solution: '1. Encouraging staff to share unconventional ideas without fear of criticism supports creative thinking.\n2. Tight deadlines, one fixed method, and blocked collaboration all work against it.' },
    { number: '9', marks: null, clues: '- Exploiting limited customer choice through pricing is unethical.', approach: '- Identify the unethical practice described.\n- Choose the response that addresses the practice itself, not the customers or the branch.', solution: '1. Charging higher prices than costs justify, because customers have limited choice, is an unethical business practice.\n2. The appropriate response is to review and align pricing to reflect real costs — not to continue, raise urban prices instead, or close the branch.' },
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
