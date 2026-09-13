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
    { number: '1', marks: null, clues: '- You cannot generate solutions before defining the problem.', approach: '- Recall the standard problem-solving process.\n- Place each step in its logical order.', solution: '1. Define the problem clearly.\n2. Generate as many possible solutions as you can.\n3. Evaluate the possible solutions and select the best one.\n4. Implement the chosen solution and monitor the results.' },
    { number: '2', marks: null, clues: '- Diversity brings genuine advantages, not guarantees.', approach: '- Compare each option against real, documented benefits of workforce diversity.\n- Eliminate any option that promises an automatic or absolute outcome.', solution: '1. A wider range of skills/perspectives, better customer-fit products, and increased creativity are all genuine, well-documented benefits of diversity.\n2. Guaranteed profits and the removal of fairness policies are not real consequences of diversity.' },
    { number: '3', marks: null, clues: '- The principle is about owning outcomes, not just reporting them.', approach: '- Reread the scenario.\n- Identify the phrase that describes taking ownership of results.', solution: '1. "Accepts responsibility for the outcomes, whether positive or negative" directly demonstrates accountability.\n2. The other options are scenario details, not the principle itself.' },
    { number: '4', marks: null, clues: '- The King Code covers more than accountability alone.', approach: '- Recall other King Code principles beyond accountability.\n- Match "openly sharing relevant information" to its principle.', solution: '1. Transparency — disclosing information relevant to stakeholders — is a distinct King Code principle from accountability.\n2. Pricing, staffing, and competition decisions are not King Code principles.' },
    { number: '5', marks: null, clues: '- Good team communication flows both ways.', approach: '- Compare each option against what enables shared understanding.\n- Eliminate one-way or overly restrictive communication styles.', solution: '1. Regular, two-way feedback lets team members raise issues and receive guidance, improving performance.\n2. One-way, one-time, or written-only communication all limit understanding between team members.' },
    { number: '6', marks: null, clues: '- Look for the two root causes, not the resulting deadlines.', approach: '- Reread the scenario.\n- Identify the two underlying causes described, separate from their effects.', solution: '1. Conflicting instructions from different managers is one root cause.\n2. A perceived unfair workload distribution is the second root cause.\n3. Missing deadlines is an effect of these causes, not a cause itself.' },
    { number: '7', marks: null, clues: '- An effective resolution addresses the causes directly.', approach: '- Match the identified causes to an action that resolves them.\n- Eliminate options that would worsen or ignore the conflict.', solution: '1. Clarifying roles/instructions and reviewing workload allocation directly addresses both identified causes.\n2. Ignoring the issue, reducing communication, or dismissing staff would not resolve — and would likely worsen — the conflict.' },
    { number: '8', marks: null, clues: '- CSR builds goodwill, not legal exemptions.', approach: '- Recall genuine benefits of CSR activity.\n- Eliminate any option describing an unrealistic legal or financial exemption.', solution: '1. Enhanced brand reputation and customer loyalty are real, well-documented benefits of CSR.\n2. CSR does not remove tax obligations, environmental regulations, or loan requirements.' },
    { number: '9', marks: null, clues: '- This technique combines individual writing with silent ranking.', approach: '- Recall each problem-solving technique\'s defining feature.\n- Match "individual ideas, then silent ranking" to its technique.', solution: '1. The nominal group technique has members generate ideas individually in writing, then rank them silently before discussion.\n2. Brainstorming is open and verbal; Delphi uses anonymous expert rounds; force-field analysis weighs driving vs. restraining forces — none match this description.' },
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
