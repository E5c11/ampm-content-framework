#!/usr/bin/env node
/**
 * DBE Business Studies P2 — November 2025 — Question 3 (order 3)
 * Business Roles: problem-solving steps, workplace diversity, King Code principles
 * applied to a scenario, communication for team performance, conflict in the workplace,
 * CSR advantages, the nominal group technique. DESIGN-BUS-02: discursive content
 * decomposes into closed-form presentations, never open fitb recall. One DESIGN-UNI-13
 * linked pair (King Code quote -> explain-other), scoped so the second sub-part's
 * correct option excludes the first's. Fresh scenarios/company names throughout
 * (DESIGN-UNI-01).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2025-nov-p2-q3.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2025-nov-p2-q3.js --dry-run
 *   node scripts/add-business-studies-2025-nov-p2-q3.js
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
  name: 'Question 3',
  syllabus: 'dbe',
  subject: 'business_studies',
  year: 2025,
  paper: 'nov_p2',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 40,
  tags: ['problem_solving_techniques', 'king_code_principles', 'conflict_management', 'corporate_social_responsibility'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q3/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q3/memo_1.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q3/memo_2.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q3/memo_3.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q3/memo_4.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q3/memo_5.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q3/memo_6.png"],
  exam_question_marks: 40,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Arrange these problem-solving steps in the correct order.',
    metadata: [
      'Evaluate the possible solutions and select the best one',
      'Define the problem clearly',
      'Implement the chosen solution and monitor the results',
      'Generate as many possible solutions as you can',
    ],
    answer: [
      'Define the problem clearly',
      'Generate as many possible solutions as you can',
      'Evaluate the possible solutions and select the best one',
      'Implement the chosen solution and monitor the results',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'creative_thinking_and_problem_solving',
    topic: 'problem_solving_techniques',
    subtopic: 'sequencing_and_process',
    skills: ['sequence_problem_solving_steps'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- You cannot generate solutions before you know what problem you are solving.\n- Monitoring only makes sense once a solution has actually been implemented.',
  },
  {
    name: 'Question 2',
    question: 'Which of the following are genuine benefits a business gains from having a diverse workforce?',
    metadata: [
      'A wider range of skills, experience and perspectives to draw on',
      'Automatically guaranteed higher profits every year',
      'Products and services that better reflect a diverse customer base',
      'Increased creativity and innovation from varied viewpoints',
      'No further need for any workplace policies on fairness',
    ],
    answer: [
      'A wider range of skills, experience and perspectives to draw on',
      'Products and services that better reflect a diverse customer base',
      'Increased creativity and innovation from varied viewpoints',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'human_rights_and_diversity',
    subtopic: 'classification_and_criteria',
    skills: ['explain_diversity_benefit'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Diversity brings genuine, real advantages, not guarantees.\n- No business benefit removes the ongoing need for fair policies.',
  },
  {
    name: 'Question 3',
    question: "Nkosi Manufacturing's board publishes a detailed annual report explaining every major decision it made and accepts responsibility for the outcomes, whether positive or negative. Quote the phrase from this description that best shows the King Code principle being applied.",
    metadata: [
      'publishes a detailed annual report explaining every major decision',
      'accepts responsibility for the outcomes, whether positive or negative',
      'Nkosi Manufacturing',
      'every major decision it made',
      '',
    ],
    answer: ['accepts responsibility for the outcomes, whether positive or negative', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'ethics_and_professionalism',
    topic: 'king_code_principles',
    subtopic: 'scenario_evidence_identification',
    skills: ['identify_evidence_from_a_scenario'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The principle being shown is about owning the consequences of decisions, not just reporting them.\n- Two options are just details from the scenario, not the principle itself.',
  },
  {
    name: 'Question 4',
    question: 'OTHER than accountability, which King Code principle should a business also apply to improve its ethical conduct?',
    metadata: ['Charging the lowest possible price for every product', 'Transparency in disclosing information relevant to stakeholders', 'Employing as many staff as legally possible', 'Avoiding all forms of business competition', ''],
    answer: ['Transparency in disclosing information relevant to stakeholders', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'ethics_and_professionalism',
    topic: 'king_code_principles',
    subtopic: 'classification_and_criteria',
    skills: ['explain_king_code_principle'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The King Code names several principles beyond accountability, including how openly a business shares information.\n- Pricing, staffing levels and competition are business decisions, not King Code principles.',
  },
  {
    name: 'Question 5',
    question: 'Which communication practice would most improve a team\'s performance?',
    metadata: ['Only the team leader ever speaks during meetings', 'Regular, two-way feedback between all team members', 'Instructions are given once and never repeated or clarified', 'Team members communicate only through written memos', ''],
    answer: ['Regular, two-way feedback between all team members', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'team_performance_and_conflict_management',
    topic: 'communication_in_teams',
    subtopic: 'term_definition_recall',
    skills: ['explain_team_communication'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Effective team communication flows in both directions, not just top-down.\n- One-way or overly rigid communication limits understanding and performance.',
  },
  {
    name: 'Question 6',
    question: "At Fezile Interiors, staff frequently miss project deadlines because two departments were given conflicting instructions by different managers, and some employees feel their workload is unfairly distributed compared to colleagues. Quote TWO causes of workplace conflict described here.",
    metadata: [
      'two departments were given conflicting instructions by different managers',
      'employees feel their workload is unfairly distributed compared to colleagues',
      'staff frequently miss project deadlines',
      'Fezile Interiors',
      '',
    ],
    answer: [
      'two departments were given conflicting instructions by different managers',
      'employees feel their workload is unfairly distributed compared to colleagues',
      '',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'team_performance_and_conflict_management',
    topic: 'conflict_management',
    subtopic: 'scenario_evidence_identification',
    skills: ['identify_evidence_from_a_scenario'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Look for the two root causes described, not the resulting missed deadlines.\n- Conflicting instructions and a sense of unfair treatment are both classic sources of workplace conflict.',
  },
  {
    name: 'Question 7',
    question: 'Given the causes identified at Fezile Interiors, which action would best help resolve the conflict?',
    metadata: ['Ignore the issue and hope it resolves itself over time', 'Reduce communication between the two departments involved', 'Clarify roles and instructions between departments, and review how workload is allocated', 'Dismiss the employees who raised the concern', ''],
    answer: ['Clarify roles and instructions between departments, and review how workload is allocated', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'team_performance_and_conflict_management',
    topic: 'conflict_management',
    subtopic: 'scenario_application',
    skills: ['explain_conflict_resolution'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 7,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- An effective resolution directly addresses the causes just identified.\n- Ignoring, reducing communication, or dismissing staff would all make the conflict worse, not better.',
  },
  {
    name: 'Question 8',
    question: 'Which of the following is a genuine advantage a business gains from corporate social responsibility (CSR) initiatives?',
    metadata: ['It permanently removes the business\'s obligation to pay tax', 'Enhanced brand reputation and stronger customer loyalty', 'Guaranteed exemption from all environmental regulations', 'Automatic approval for every future business loan', ''],
    answer: ['Enhanced brand reputation and stronger customer loyalty', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'csr_and_csi',
    subtopic: 'classification_and_criteria',
    skills: ['explain_corporate_social_responsibility'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 8,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- CSR builds goodwill with customers and the community.\n- None of the other options are real legal or financial consequences of CSR activity.',
  },
  {
    name: 'Question 9',
    question: 'A business collects ideas from group members individually and in writing, then has the group silently rank the ideas before any open discussion takes place. Which problem-solving technique is this?',
    metadata: ['Nominal group technique', 'Brainstorming', 'Delphi technique', 'Force-field analysis', ''],
    answer: ['Nominal group technique', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'creative_thinking_and_problem_solving',
    topic: 'problem_solving_techniques',
    subtopic: 'term_definition_recall',
    skills: ['define_business_term'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 9,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- This technique combines individual, written idea generation with a silent ranking step.\n- Brainstorming is open and verbal; this technique deliberately limits discussion until after ranking.',
  },
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  sub_questions: [
    { number: '3.1', marks: 4, clues: '- Think about the order a business would logically follow, from noticing a problem through to checking the fix worked.\n- The memo only requires the first four steps in the sequence.', approach: '- Recall the standard problem-solving process.\n- List any four steps in a logical order.', solution: '1. The problem-solving process includes: identify the problem; define the problem; identify possible solutions; evaluate alternative solutions; choose the most appropriate solution; develop an action plan; implement it; monitor it; evaluate it.\n2. Any four of these, in a sensible order, are acceptable.' },
    { number: '3.2', marks: 6, clues: '- Think about how a mix of backgrounds and perspectives changes how a business operates, not just how it looks.\n- Consider effects on customers, employees, and problem-solving.', approach: '- Recall the benefits diversity brings to a workplace.\n- Cover a spread across morale, image, competitiveness, and innovation.', solution: '1. A diverse workforce improves employee morale and motivation.\n2. It gives the business a better public image and helps attract more customers.\n3. It provides a competitive advantage through a wider range of skills and perspectives.\n4. It improves the business\'s ability to solve problems and innovate.' },
    { number: '3.3.1', marks: 3, clues: '- Look at what the scenario says the business actually did about pollution — that action reflects one specific King Code principle.\n- This principle is about taking ownership of the consequences of the business\'s actions.', approach: '- Identify the action described in the scenario.\n- Match that action to the King Code principle it best reflects, and quote the scenario detail supporting it.', solution: '1. The scenario describes Jaleel Pharmacy developing a remedial programme to reduce air pollution and protect the environment.\n2. Taking ownership of and addressing the consequences of the business\'s operations reflects the King Code principle of Responsibility.\n3. The supporting detail is the remedial programme to reduce air pollution and protect the environment.' },
    { number: '3.3.2', marks: 3, clues: '- Choose a King Code principle different from the one already identified from the scenario.\n- Think about openness and clear communication with stakeholders as one alternative.', approach: '- Recall the other King Code principles beyond Responsibility.\n- Describe one clearly, in your own words.', solution: '1. Transparency is another King Code principle businesses can apply.\n2. It means decisions and actions must be clear to all stakeholders, staffing and other processes should be open, and audit reports should be accurate and available to shareholders and employees.\n3. Any other genuine King Code principle (e.g. accountability, fairness) is also acceptable.' },
    { number: '3.4', marks: 6, clues: '- Think about how the flow of information between team members affects how well a team performs, not about the team\'s task itself.\n- Consider both giving and receiving communication.', approach: '- Recall how communication supports successful team performance.\n- Cover a mix of clarity, feedback, and problem-resolution.', solution: '1. Clear communication processes ensure every team member understands their role.\n2. Efficient communication between team members allows for quicker decisions.\n3. Quality feedback improves team morale, and open, honest discussion leads to effective solutions to problems.\n4. Continuous review of progress, supported by good communication, lets the team correct mistakes proactively.' },
    { number: '3.5.1', marks: 2, clues: '- Look only at what the scenario explicitly describes as sources of tension — not general causes of conflict.\n- Two specific causes are named.', approach: '- Re-read the scenario carefully.\n- Quote exactly what it says is causing conflict at the business.', solution: '1. The scenario states some employees show a lack of cooperation, causing delays in production.\n2. It also states management sets unrealistic deadlines that increase employee stress levels.\n3. Either of these, quoted from the scenario, is correct.' },
    { number: '3.5.2', marks: 4, clues: '- Think about the steps a business follows once conflict has already been identified, in a logical sequence.\n- The process starts with recognising the problem exists.', approach: '- Recall the standard steps for handling workplace conflict.\n- List them in a logical order.', solution: '1. Acknowledge that conflict exists between the parties involved.\n2. Identify the cause of the conflict to understand its nature.\n3. Arrange a time and place for negotiation where all involved parties are present.\n4. Hold a meeting between the conflicting parties to work towards a resolution.' },
    { number: '3.6', marks: 6, clues: '- Think about how being seen to act responsibly benefits the business itself, not just the community.\n- Consider effects on reputation, staff, investors, and government relations.', approach: '- Recall the advantages CSR offers a business.\n- Cover a spread across goodwill, teamwork, investment, and compliance.', solution: '1. CSR helps businesses enjoy the goodwill and support of the communities they operate in.\n2. CSR projects promote teamwork within the business.\n3. CSR helps attract investors, since socially responsible businesses are often seen as lower-risk and more profitable.\n4. Businesses that voluntarily participate in CSR are less likely to face strict government-enforced legislation, and may receive tax advantages.' },
    { number: '3.7', marks: 6, clues: '- Consider the nominal group technique from BOTH angles — what it does well, and where it falls short.\n- Think about how limiting group size and structuring turns affects the quality and speed of ideas.', approach: '- Recall how the nominal group technique works.\n- Give at least one positive and one negative impact.', solution: '1. Positive: it prevents conformity to group pressure, gives every participant a chance to contribute without domination, and generates and prioritises many ideas quickly and democratically.\n2. Negative: it is time-consuming since each member must present, can be hard to implement with large groups, and may cause good ideas to be voted out before they are fully developed.\n3. Either a positive point, a negative point, or both are acceptable.' },
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
