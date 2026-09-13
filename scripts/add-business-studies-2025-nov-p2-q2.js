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
    { number: '2.1', marks: 2, clues: '- Think about what an investor would weigh up before committing money for a period of time.\n- The memo accepts any two: return, risk, term, inflation, tax, or liquidity.', approach: '- Recall the standard factors any investor considers before investing.\n- Name any two clearly.', solution: '1. Investment decisions typically weigh factors such as return on investment, risk, the investment term, the inflation rate, taxation, and liquidity.\n2. Any two of these factors are acceptable.' },
    { number: '2.2', marks: 4, clues: '- Think about what the insured party pays BEFORE the insurer pays anything.\n- It relates to discouraging small or fraudulent claims.', approach: '- Recall what excess means in an insurance policy.\n- Explain it as an amount paid upfront by the insured, and why it exists.', solution: '1. Excess is the amount the insured agrees to pay upfront when taking out a policy, or towards a claim, before the insurer covers the rest.\n2. It protects the insurer against fraudulent or minor claims, since the insured is less likely to claim for a small loss they must partly fund themselves.' },
    { number: '2.3', marks: 6, clues: '- Think about the JSE\'s role connecting ordinary investors to companies and to information.\n- It does more than just let people buy and sell shares.', approach: '- Recall the JSE\'s core functions.\n- Cover a spread: informing investors, linking investors to companies, and regulating the market.', solution: '1. The JSE links investors to public companies, allowing businesses to raise capital by issuing shares.\n2. It publishes share prices daily, keeping investors informed.\n3. It acts as a barometer of South Africa\'s economic conditions.\n4. It enables small investors to take part in the economy through buying and selling shares.\n5. Strict investment rules ensure a disciplined, orderly market for securities.' },
    { number: '2.4', marks: 6, clues: '- One manager decides alone; the other rewards good performance to motivate staff.\n- Match each behaviour described to its own leadership style, not a mixed style.', approach: '- Identify what each manager actually does in the scenario.\n- Name the leadership style each behaviour represents, and quote the behaviour that supports it.', solution: '1. A manager who takes all decisions alone, without consulting staff, is displaying an autocratic leadership style.\n2. A manager who offers rewards to hardworking employees to increase productivity is displaying a transactional leadership style.\n3. Each style is identified from the specific behaviour described for that manager.' },
    { number: '2.5', marks: 4, clues: '- Think about how a leader\'s own outlook affects the people around them, not their technical skill.\n- The memo accepts several angles — pick any that connect attitude to leadership success.', approach: '- Recall how personal attitude influences a leader\'s effectiveness.\n- Explain the connection between a leader\'s own mindset and their team\'s behaviour or performance.', solution: '1. A leader\'s positive attitude can influence the success of the business and the behaviour of their team.\n2. Leaders who model the attitude they want to see, and who understand their own strengths and weaknesses, apply their leadership style more effectively.\n3. A positive attitude helps a leader persevere through challenges and inspires enthusiasm in employees.' },
    { number: '2.6.1', marks: 2, clues: '- Look only at what the scenario states the presenter actually did — not general presentation advice.\n- Two specific actions are described.', approach: '- Re-read the scenario carefully.\n- Quote exactly what it says the presenter did when designing the presentation.', solution: '1. The scenario states the presenter kept graphs simple by not mixing different styles.\n2. It also states she used key words to limit the information on each slide.\n3. Either of these, quoted from the scenario, is correct.' },
    { number: '2.6.2', marks: 4, clues: '- This asks for aspects OTHER than the ones already quoted from the scenario — don\'t repeat those.\n- Think about the visual/technical building blocks of a slide, not just its content.', approach: '- Recall the general factors to consider when designing a multimedia presentation.\n- Give aspects distinct from what the scenario already described.', solution: '1. Start with a heading/text that forms the basis of the presentation.\n2. Select a background that complements the text, and choose images and graphics that help communicate the message.\n3. Add special effects, sound, or animation to keep the audience interested, and create hyperlinks for quick access to other files or clips.\n4. Use a legible font and font size, check for language and spelling errors, use bright colours to increase visibility, and structure the information in a logical sequence.\n5. Any of these, or similar aspects not already covered in 2.6.1, are correct.' },
    { number: '2.7', marks: 6, clues: '- Think about who backs this investment, and what that means for risk.\n- Consider both the returns offered and how accessible the investment is.', approach: '- Recall the features of RSA Retail Savings Bonds as an investment.\n- Cover a mix of positives: safety, returns, accessibility, and cost.', solution: '1. RSA Retail Savings Bonds offer guaranteed, fixed returns for the investment period.\n2. They are low-risk, being backed by the South African government.\n3. They are accessible, since funds can be withdrawn after the first twelve months.\n4. They are affordable for all income levels, including pensioners, and carry no fees or commissions.' },
    { number: '2.8', marks: 6, clues: '- Consider management from BOTH angles — how it can help a company succeed, and how it can contribute to failure.\n- Link each point specifically to the quality or structure of management, not to the company\'s product or market.', approach: '- Recall how management quality affects a public company\'s outcomes.\n- Give at least one success factor and one failure factor.', solution: '1. Success: a board of competent, skilled directors leads to better decision-making, and directors who are accountable to shareholders tend to manage the company more effectively.\n2. Failure: directors without a direct interest in the company may not be motivated to maximise growth and profit, and a large management structure can slow decision-making while increasing costs through directors\' fees.\n3. Either a success point, a failure point, or both are acceptable.' },
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
