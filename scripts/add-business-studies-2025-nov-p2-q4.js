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
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q4/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q4/memo_1.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q4/memo_2.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q4/memo_3.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q4/memo_4.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q4/memo_5.png"],
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
    { number: '4.1', marks: 2, clues: '- Think about risks so unpredictable, widespread, or deliberate that no insurer will cover them.\n- The memo only requires the first two examples given.', approach: '- Recall what makes a risk non-insurable.\n- Give any two clear examples.', solution: '1. Non-insurable risks include things like war, nuclear weapons, or earthquakes; changes in fashion or trends; changes in technology; irrecoverable debts; a high rate of inflation; and losses due to bad management.\n2. Any two of these examples are acceptable.' },
    { number: '4.2.1', marks: 2, clues: '- Think about a type of loan certificate a company issues, not a share in the company itself.\n- The business is borrowing money from the public, not selling ownership.', approach: '- Recall the different types of investment opportunities.\n- Match "raised capital by borrowing money from the public" to the correct instrument.', solution: '1. Debentures are a way for a company to raise capital by borrowing money from the public, who become creditors rather than owners.\n2. The correct answer is debentures.' },
    { number: '4.2.2', marks: 2, clues: '- Think about an informal savings arrangement among a group of people, not a formal financial-market product.\n- Members contribute regularly and can later withdraw.', approach: '- Recall informal versus formal investment/savings options.\n- Match "monthly contributions to an informal savings scheme with future withdrawals" to the correct term.', solution: '1. Stokvels (and similar mutual/informal savings funds) are informal schemes where members make regular contributions and can later make withdrawals.\n2. The correct answer is stokvels/mutual funds.' },
    { number: '4.3', marks: 4, clues: '- Think about WHERE each one gets their power from, and WHAT they focus on achieving.\n- One is about position and process; the other is about vision and people.', approach: '- Recall the key differences between management and leadership.\n- Contrast at least two clear points of difference.', solution: '1. Management guides behaviour through management functions and administers plans and systems to reach targets; a manager\'s power comes from their position.\n2. Leadership influences behaviour through vision, values, and charisma, and focuses on inspiring and encouraging new ideas; a leader\'s power comes from knowledge, skill, or personal influence.\n3. Management focuses on the short-to-medium term and \'doing things right\'; leadership focuses on the long term and \'doing the right things\'.' },
    { number: '4.4', marks: 6, clues: '- Think about what protection this form of ownership gives its shareholders, and what obligations it\'s exempt from.\n- Consider tax, reporting requirements, and how long the business can exist.', approach: '- Recall the features of a personal liability company.\n- Cover a spread across legal protection, growth potential, and administrative requirements.', solution: '1. A personal liability company has its own legal identity, and shareholders generally have limited liability.\n2. It has potential for good long-term growth and pays tax at a fixed rate to SARS.\n3. It is managed by a board of directors with the required expertise, is not required to file annual financial statements with the CIPC, and has continuity of existence independent of its owners\' lifespans.\n4. It can also raise capital relatively easily by issuing shares.' },
    { number: '4.5', marks: 4, clues: '- Think about what happens before, during, and after the actual talking — structure and delivery both matter.\n- Consider how a presenter opens, holds attention, and closes.', approach: '- Recall the factors that make a presentation effective.\n- Cover a spread across opening, delivery style, and closing.', solution: '1. A presenter should establish credibility early, state the purpose and main points at the start, and use clear headings and sub-headings to structure the content.\n2. During the presentation, they should maintain eye contact, vary their tone to avoid monotony, use visual aids effectively, and speak with energy and enthusiasm.\n3. They should summarise the main points to conclude the presentation.' },
    { number: '4.6', marks: 4, clues: '- These are broad categories a business\'s social investment spending is typically grouped into.\n- The memo requires the first four named.', approach: '- Recall the standard CSI focus areas.\n- Name four of them.', solution: '1. Corporate social investment focus areas include: community, rural development, employees, and the environment.\n2. All four are required for full marks.' },
    { number: '4.7', marks: 6, clues: '- Think about how understanding a team\'s makeup helps a business get more out of its people, not about hiring or pay.\n- Consider task allocation, conflict, and individual strengths.', approach: '- Recall why team dynamic theories matter for performance.\n- Cover a mix of task allocation, conflict reduction, and understanding personalities.', solution: '1. Team dynamic theories explain how effective teams work and operate, allowing businesses to allocate tasks according to team members\' roles.\n2. Team members can maximise performance when tasks are allocated according to their abilities and personalities.\n3. The theories help team leaders understand personality types, assign tasks more effectively, and can reduce conflict when members perform clearly differentiated roles.' },
    { number: '4.8.1', marks: 2, clues: '- Look only at what the scenario explicitly describes the business doing — not general creativity advice.\n- Two specific actions are named.', approach: '- Re-read the scenario carefully.\n- Quote exactly what it says the business does to promote creative thinking.', solution: '1. The scenario states the business ensures the work environment is free from high noise levels and distractions.\n2. It also states the business encourages employees to come up with new ways of performing their duties.\n3. Either of these, quoted from the scenario, is correct.' },
    { number: '4.8.2', marks: 4, clues: '- This asks for ways OTHER than the ones already quoted from the scenario — don\'t repeat those.\n- Think about how ideas get collected, developed, and rewarded, not just the physical environment.', approach: '- Recall general ways businesses can foster a creative work environment.\n- Give ways distinct from what the scenario already described.', solution: '1. Emphasise the importance of creative thinking so staff know management wants to hear their ideas, and make time for regular brainstorming sessions.\n2. Place suggestion boxes around the workplace and keep communication channels open for new ideas.\n3. Train staff in innovative techniques such as mind-mapping or lateral thinking, and encourage job swaps or studying how other businesses do things.\n4. Respond enthusiastically to all ideas so no one feels less important, and reward creativity with incentive schemes for useful ideas.\n5. Any of these, or similar ways not already covered in 4.8.1, are correct.' },
    { number: '4.9', marks: 4, clues: '- Think about fairness to rural customers alongside the real cost pressures a business faces getting goods to remote areas.\n- Consider both pricing itself and the logistics behind it.', approach: '- Recall ways businesses can act ethically around rural pricing.\n- Cover a mix of pricing fairness and cost-reduction strategies.', solution: '1. Businesses can charge fair, market-related prices for goods and services in rural areas rather than exploiting distance and limited competition.\n2. They can investigate cost-effective transport, such as combining deliveries or sharing delivery costs with suppliers, and buy in bulk to secure discounts.\n3. Lobbying government to improve rural infrastructure can also reduce the underlying costs that drive up prices.' },
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
