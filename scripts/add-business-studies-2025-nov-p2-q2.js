#!/usr/bin/env node
/**
 * DBE Business Studies P2 — November 2025 — Question 2 (order 2)
 * Business Ventures: insurance concepts, investment (JSE, RSA Retail Savings Bonds),
 * leadership styles applied to a scenario, multimedia-presentation factors, management
 * criteria for public-company success/failure. DESIGN-BUS-02: discursive content
 * decomposes into multiple_choice/multi_select against listed points, never open fitb
 * recall. Two DESIGN-UNI-13 linked pairs (quote-from-scenario -> explain-other), each
 * scoped so the second sub-part's correct options exclude the first's. Fresh scenarios/
 * company names throughout (DESIGN-UNI-01) — never the real exam's own wording.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2025-nov-p2-q2.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2025-nov-p2-q2.js --dry-run
 *   node scripts/add-business-studies-2025-nov-p2-q2.js
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
  name: 'Question 2',
  syllabus: 'dbe',
  subject: 'business_studies',
  year: 2025,
  paper: 'nov_p2',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 40,
  tags: ['leadership_styles', 'insurance_concepts', 'securities_investment', 'presentation_factors'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q2/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q2/memo_1.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q2/memo_2.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q2/memo_3.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q2/memo_4.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q2/memo_5.png"],
  exam_question_marks: 40,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Palesa insured her delivery van for R200 000. Her policy has a R5 000 excess. After an accident causing R30 000 of damage, how much will the insurer actually pay out?',
    metadata: ['R30 000', 'R25 000', 'R5 000', 'R35 000', ''],
    answer: ['R25 000', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'investment_securities_and_insurance',
    topic: 'insurance_concepts',
    subtopic: 'scenario_application',
    skills: ['explain_insurance_concept'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The excess is the amount the insured party pays first, out of their own pocket.\n- Subtract the excess from the total damage to find what the insurer covers.',
  },
  {
    name: 'Question 2',
    question: 'Which of the following are genuine functions the Johannesburg Securities Exchange (JSE) performs for the economy?',
    metadata: [
      'Providing a regulated marketplace where shares can be bought and sold',
      'Helping companies raise capital by listing and selling shares to the public',
      'Guaranteeing that every listed share will increase in value',
      'Protecting investors through listing requirements and disclosure rules',
      'Setting the salaries of executives at every listed company',
    ],
    answer: [
      'Providing a regulated marketplace where shares can be bought and sold',
      'Helping companies raise capital by listing and selling shares to the public',
      'Protecting investors through listing requirements and disclosure rules',
      '',
      '',
    ],
    presentation: 'multi_select',
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
    clues: '- The JSE is a marketplace and a regulator, not a guarantor of returns or an employer.\n- Think about what a stock exchange can and cannot control.',
  },
  {
    name: 'Question 3',
    question: "At Dumisani Logistics (DL), Thapelo, the operations manager, makes every scheduling decision alone and expects staff to follow his instructions without discussion; Naledi, the warehouse manager, sets clear performance targets and gives staff a cash bonus whenever those targets are met. Quote TWO phrases from the scenario that show Thapelo's leadership style in action.",
    metadata: [
      'makes every scheduling decision alone',
      'expects staff to follow his instructions without discussion',
      'sets clear performance targets',
      'gives staff a cash bonus whenever those targets are met',
      '',
    ],
    answer: [
      'makes every scheduling decision alone',
      'expects staff to follow his instructions without discussion',
      '',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'management_and_leadership',
    topic: 'leadership_styles',
    subtopic: 'scenario_evidence_identification',
    skills: ['identify_leadership_style_from_scenario'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Thapelo is described as autocratic — deciding alone, expecting obedience.\n- The other two phrases describe Naledi, a different manager.',
  },
  {
    name: 'Question 4',
    question: "Using the same DUMISANI LOGISTICS (DL) scenario, which leadership style — OTHER than Thapelo's — is Naledi demonstrating?",
    metadata: ['Autocratic leadership', 'Transactional leadership', 'Laissez-faire leadership', 'Bureaucratic leadership', ''],
    answer: ['Transactional leadership', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'management_and_leadership',
    topic: 'leadership_styles',
    subtopic: 'scenario_application',
    skills: ['identify_leadership_style_from_scenario'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Naledi links a clear target to a specific reward.\n- This exchange of reward for performance is the defining feature of one particular style.',
  },
  {
    name: 'Question 5',
    question: 'Which personal attitude is most likely to undermine a leader\'s ability to earn the trust of their team?',
    metadata: ['Consistency between what they say and what they do', 'Willingness to admit and correct mistakes', 'Treating staff differently depending on personal favour', 'Openness to feedback from team members', ''],
    answer: ['Treating staff differently depending on personal favour', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'management_and_leadership',
    topic: 'leadership_styles',
    subtopic: 'term_definition_recall',
    skills: ['identify_leadership_style_from_scenario'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Trust depends on staff believing they will be treated fairly.\n- Three of the options build trust; one clearly damages it.',
  },
  {
    name: 'Question 6',
    question: "Bongani, the marketing manager at Kgosi Financial Services (KFS), designed a client presentation using one consistent colour scheme throughout; he also researched the average age of the clients attending, to decide how much technical detail to include, and rehearsed his delivery three times before the meeting. Quote TWO aspects from the scenario that Bongani considered when DESIGNING his presentation.",
    metadata: [
      'used one consistent colour scheme throughout',
      'rehearsed his delivery three times before the meeting',
      'researched the average age of the clients attending',
      'the average age of the clients attending was over fifty',
      '',
    ],
    answer: [
      'used one consistent colour scheme throughout',
      'researched the average age of the clients attending',
      '',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'presentation_of_business_information',
    topic: 'presentation_factors',
    subtopic: 'scenario_evidence_identification',
    skills: ['explain_presentation_factor'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Rehearsing delivery is a presentation SKILL, not a design consideration quoted here as a design factor.\n- Look for the two design-related choices described, not the rehearsal or a made-up detail about the audience.',
  },
  {
    name: 'Question 7',
    question: 'OTHER than colour scheme and audience research, which factor should a presenter also consider when designing a multimedia presentation?',
    metadata: ['Using as many different font styles as possible', 'Limiting each slide to a small number of key words', 'Including every detail from the written report on each slide', 'Avoiding any images so text is not distracting', ''],
    answer: ['Limiting each slide to a small number of key words', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'presentation_of_business_information',
    topic: 'presentation_factors',
    subtopic: 'classification_and_criteria',
    skills: ['explain_presentation_factor'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 7,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Good slide design limits text so the audience listens rather than reads.\n- Mixing many fonts or cramming in every detail both work against clarity.',
  },
  {
    name: 'Question 8',
    question: 'Which of the following is a genuine advantage of investing in RSA Retail Savings Bonds?',
    metadata: ['The capital invested can never lose value under any circumstances', 'They are backed by the South African government, making them low-risk', 'They typically offer higher returns than any share on the JSE', 'They can be bought and sold freely on the stock exchange at any time', ''],
    answer: ['They are backed by the South African government, making them low-risk', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'investment_securities_and_insurance',
    topic: 'securities_investment',
    subtopic: 'term_definition_recall',
    skills: ['explain_investment_option'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 8,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Government backing is the main reason these bonds are considered low-risk.\n- They are not traded on the JSE like ordinary shares.',
  },
  {
    name: 'Question 9',
    question: 'Which of the following would be used as a criterion to judge whether the MANAGEMENT of a public company contributed to its success or failure?',
    metadata: [
      'Whether the share price moved up or down on a single trading day',
      'Whether management set clear objectives and monitored progress towards them',
      'Whether the company\'s logo was recently redesigned',
      'Whether competitors also operate in the same industry',
      'Whether management made timely, informed decisions based on accurate information',
    ],
    answer: [
      'Whether management set clear objectives and monitored progress towards them',
      'Whether management made timely, informed decisions based on accurate information',
      '',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'management_and_leadership',
    topic: 'management_success_criteria',
    subtopic: 'classification_and_criteria',
    skills: ['evaluate_management_criteria'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 9,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Judge management by its own decisions and processes, not by external or unrelated factors.\n- A single day\'s share price and the logo are not measures of management quality.',
  },
  {
    name: 'Question 10',
    question: 'Arrange these steps of the investment decision process in the correct order.',
    metadata: [
      'Compare the available investment options against each other',
      'Identify the investment goal and how much capital is available',
      'Make the final investment decision',
      'Assess the risk and expected return of each option',
    ],
    answer: [
      'Identify the investment goal and how much capital is available',
      'Assess the risk and expected return of each option',
      'Compare the available investment options against each other',
      'Make the final investment decision',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'investment_securities_and_insurance',
    topic: 'securities_investment',
    subtopic: 'sequencing_and_process',
    skills: ['explain_investment_option'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 10,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Start with what you want to achieve before comparing any options.\n- Risk and return must be assessed before a fair comparison is possible.',
  },
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  sub_questions: [
    { number: '1', marks: null, clues: '- The excess is paid by the insured first.', approach: '- Identify the total damage.\n- Subtract the excess amount.\n- The remainder is what the insurer pays.', solution: '1. Total damage is R30 000.\n2. Palesa\'s excess is R5 000, paid by her.\n3. R30 000 - R5 000 = R25 000, the amount the insurer pays out.' },
    { number: '2', marks: null, clues: '- The JSE regulates and facilitates, it does not guarantee outcomes.', approach: '- Recall what a stock exchange actually does.\n- Eliminate any option describing a guarantee or an unrelated power.', solution: '1. The JSE provides a marketplace for buying/selling shares, correct.\n2. It helps companies raise capital through listings, correct.\n3. It protects investors via listing/disclosure requirements, correct.\n4. No exchange can guarantee share prices will rise, incorrect.\n5. Executive salaries are set by each company\'s own board, not the JSE, incorrect.' },
    { number: '3', marks: null, clues: '- Thapelo decides alone and expects obedience — classic autocratic behaviour.', approach: '- Reread the scenario.\n- Identify which sentences describe Thapelo specifically, not Naledi.', solution: '1. "Makes every scheduling decision alone" and "expects staff to follow his instructions without discussion" both describe Thapelo\'s autocratic style.\n2. The other two phrases describe Naledi\'s different approach, so they are not part of this answer.' },
    { number: '4', marks: null, clues: '- Naledi exchanges a reward (bonus) for a specific result (meeting targets).', approach: '- Identify what Naledi actually does in the scenario.\n- Match "reward tied to performance" to its named leadership style.', solution: '1. Naledi sets clear targets and gives a bonus when they are met — an exchange of reward for performance.\n2. This defines transactional leadership, distinct from Thapelo\'s autocratic style.' },
    { number: '5', marks: null, clues: '- Trust depends on staff believing they are treated fairly.', approach: '- Compare each option against what builds vs. damages trust.\n- Favouritism directly undermines fairness.', solution: '1. Consistency, admitting mistakes, and openness to feedback all build trust.\n2. Treating staff differently based on personal favour is favouritism, which damages trust, the correct answer.' },
    { number: '6', marks: null, clues: '- Rehearsal is a delivery skill, not a design choice.', approach: '- Reread the scenario.\n- Identify the two design-related choices Bongani made when creating the slides themselves.', solution: '1. Using one consistent colour scheme and researching the audience\'s age are both design considerations, quoted directly.\n2. Rehearsing delivery is a separate skill, not a design factor; the age detail in the fourth option is invented, not stated.' },
    { number: '7', marks: null, clues: '- Good slide design limits text so the audience listens rather than reads.', approach: '- Recall multimedia-presentation design guidelines.\n- Eliminate options that add clutter or reduce clarity.', solution: '1. Limiting each slide to a small number of key words keeps the audience focused on the speaker.\n2. Mixing many fonts, cramming in every report detail, or removing all images all reduce clarity instead.' },
    { number: '8', marks: null, clues: '- Government backing is the reason these bonds are considered low-risk.', approach: '- Recall what RSA Retail Savings Bonds are and who issues them.\n- Compare each option against that fact.', solution: '1. RSA Retail Savings Bonds are issued and backed by the South African government, making them low-risk.\n2. They are not traded on the JSE and do not guarantee higher returns than shares.' },
    { number: '9', marks: null, clues: '- Judge management by its own decisions, not by external factors.', approach: '- Identify which options describe an action or decision made by management itself.\n- Eliminate options describing external market movements or unrelated details.', solution: '1. Setting clear objectives and monitoring progress is a management action, a valid criterion.\n2. Making timely, informed decisions is also a management action, a valid criterion.\n3. A single day\'s share price, the logo, and competitor presence are not measures of management\'s own performance.' },
    { number: '10', marks: null, clues: '- Start with the goal before comparing any options.', approach: '- Recall the logical order of the investment decision process.\n- Place each step where it must happen relative to the others.', solution: '1. First identify the investment goal and how much capital is available.\n2. Then assess the risk and expected return of each possible option.\n3. Then compare the available options against each other.\n4. Finally, make the investment decision.' },
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
