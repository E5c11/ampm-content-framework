#!/usr/bin/env node
/**
 * DBE Business Studies P2 — November 2025 — Question 6 (order 6)
 * Business Roles (Human Rights, Inclusivity and Environmental Issues) — essay question,
 * Section C. DESIGN-BUS-03: no free-text essay input exists in the app — practice
 * questions teach the essay content (employer health/safety responsibilities, human
 * rights in the workplace, environmental/health strategies, age/disability diversity)
 * plus the essay-strategy skill objectively, grounded in the real memo's documented LASO
 * rubric. Never a free-text/model-essay item; never verbatim memo prose.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2025-nov-p2-q6.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2025-nov-p2-q6.js --dry-run
 *   node scripts/add-business-studies-2025-nov-p2-q6.js
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
  name: 'Question 6',
  syllabus: 'dbe',
  subject: 'business_studies',
  year: 2025,
  paper: 'nov_p2',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 40,
  tags: ['human_rights', 'diversity', 'environmental_issues', 'essay_writing_skills'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q5/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q6/memo_1.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q6/memo_2.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q6/memo_3.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q6/memo_4.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q6/memo_5.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q6/memo_6.png"],
  exam_question_marks: 40,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Which of the following is a genuine employer responsibility in promoting human health and safety in the workplace?',
    metadata: [
      'Allowing employees to decide for themselves whether safety equipment is necessary',
      'Providing appropriate safety equipment and training for hazardous tasks',
      'Only addressing safety concerns once an accident has already occurred',
      'Charging employees for the cost of their own protective equipment',
      '',
    ],
    answer: ['Providing appropriate safety equipment and training for hazardous tasks', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'human_rights_and_diversity',
    subtopic: 'term_definition_recall',
    skills: ['identify_human_right_in_workplace'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Employer responsibility is proactive, not reactive or shifted onto staff.\n- Look for the option that prevents harm before it happens.',
  },
  {
    name: 'Question 2',
    question: 'Which of the following are recognised human rights that businesses must uphold in the workplace?',
    metadata: [
      'The right to fair labour practices',
      'The right to choose one\'s own salary without negotiation',
      'The right to equality and freedom from unfair discrimination',
      'The right to privacy',
      'The right to unlimited paid leave at any time',
    ],
    answer: [
      'The right to fair labour practices',
      'The right to equality and freedom from unfair discrimination',
      'The right to privacy',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'human_rights_and_diversity',
    subtopic: 'classification_and_criteria',
    skills: ['identify_human_right_in_workplace'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- These are constitutionally grounded rights, not open-ended personal demands.\n- Choosing one\'s own salary and unlimited leave are not recognised workplace rights.',
  },
  {
    name: 'Question 3',
    question: 'Which of the following are genuine strategies a business can use to protect the environment and human health?',
    metadata: [
      'Properly disposing of hazardous waste rather than dumping it',
      'Reducing harmful emissions from its operations',
      'Ignoring environmental regulations whenever they raise production costs',
      'Promoting employee wellness programmes, such as health screenings',
      'Relocating operations to avoid any environmental oversight',
    ],
    answer: [
      'Properly disposing of hazardous waste rather than dumping it',
      'Reducing harmful emissions from its operations',
      'Promoting employee wellness programmes, such as health screenings',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'environmental_health_strategies',
    subtopic: 'classification_and_criteria',
    skills: ['explain_environmental_health_strategy'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A genuine strategy actively reduces harm, rather than avoiding oversight of it.\n- Look for the three options describing real, active measures.',
  },
  {
    name: 'Question 4',
    question: 'Which approach best deals with AGE as a diversity issue in the workplace?',
    metadata: [
      'Automatically retrenching all employees once they reach a certain age',
      'Offering flexible or phased retirement options and encouraging cross-generational mentoring',
      'Only hiring employees from a single, narrow age group',
      'Assuming older employees cannot learn new skills or technology',
      '',
    ],
    answer: ['Offering flexible or phased retirement options and encouraging cross-generational mentoring', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'human_rights_and_diversity',
    subtopic: 'scenario_application',
    skills: ['explain_diversity_benefit'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A fair approach accommodates different career stages rather than excluding any of them.\n- Assumptions about ability based purely on age are themselves a form of discrimination.',
  },
  {
    name: 'Question 5',
    question: 'Which approach best deals with DISABILITY as a diversity issue in the workplace?',
    metadata: [
      'Excluding candidates with disabilities from the interview process entirely',
      'Providing reasonable accommodations, such as accessible facilities and assistive technology',
      'Assuming employees with disabilities require no workplace adjustments at all',
      'Placing the full cost of any accommodation onto the employee themselves',
      '',
    ],
    answer: ['Providing reasonable accommodations, such as accessible facilities and assistive technology', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'human_rights_and_diversity',
    subtopic: 'scenario_application',
    skills: ['explain_diversity_benefit'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A fair approach removes barriers rather than excluding candidates or ignoring genuine needs.\n- Shifting all accommodation costs onto the employee undermines the point of the accommodation.',
  },
  {
    name: 'Question 6',
    question: 'Arrange these parts of an essay on Human Rights, Inclusivity and Environmental Issues into the correct structural order.',
    metadata: [
      'Age and disability as diversity issues, and how to address them',
      'Three human rights businesses must uphold in the workplace',
      'Outlining that the essay will cover employer health/safety duties, workplace human rights, environmental strategies, and diversity issues',
      'Strategies to protect the environment and human health',
      'Restating how upholding these responsibilities builds a fair, sustainable workplace',
      'Employer responsibilities for promoting human health and safety',
    ],
    answer: [
      'Outlining that the essay will cover employer health/safety duties, workplace human rights, environmental strategies, and diversity issues',
      'Employer responsibilities for promoting human health and safety',
      'Three human rights businesses must uphold in the workplace',
      'Strategies to protect the environment and human health',
      'Age and disability as diversity issues, and how to address them',
      'Restating how upholding these responsibilities builds a fair, sustainable workplace',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'human_rights_and_diversity',
    subtopic: 'essay_structure_and_argumentation',
    skills: ['sequence_essay_structure'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The introduction previews all four aspects, in the order the essay covers them.\n- Each body paragraph addresses one aspect; the conclusion sums them all up.',
  },
  {
    name: 'Question 7',
    question: 'A candidate\'s essay addresses three of the four required aspects in its introduction and clearly labels both the "Introduction" and "Conclusion" headings. What does the rubric say about this candidate\'s Layout marks?',
    metadata: [
      'Zero Layout marks — every one of the four aspects must appear in the introduction',
      'Full Layout marks — the minimum requirement is at least two of the four aspects in the introduction, and this candidate exceeds it',
      'Zero Layout marks — headings alone are never enough, regardless of content',
      'Full marks are impossible unless the conclusion is longer than the introduction',
      '',
    ],
    answer: ['Full Layout marks — the minimum requirement is at least two of the four aspects in the introduction, and this candidate exceeds it', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'human_rights_and_diversity',
    subtopic: 'essay_structure_and_argumentation',
    skills: ['evaluate_essay_layout_compliance'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 7,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The rubric sets a minimum of two aspects in the introduction, not all four.\n- Stated headings plus that minimum coverage is what earns full Layout marks.',
  },
  {
    name: 'Question 8',
    question: 'Which of the following, if included in this essay, would earn an Originality mark under the rubric\'s "recent, real example" requirement?',
    metadata: [
      'A dictionary-style definition of "human rights" with no real-world example attached',
      'A vague claim that "some businesses care about the environment"',
      'A named South African company that introduced a specific workplace accessibility measure within the last two years',
      'A restatement of a point already made in the essay\'s own conclusion',
      '',
    ],
    answer: ['A named South African company that introduced a specific workplace accessibility measure within the last two years', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'human_rights_and_diversity',
    subtopic: 'essay_structure_and_argumentation',
    skills: ['identify_originality_worthy_example'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 8,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Originality requires a specific, dated, real example, not a generic claim or definition.\n- Repeating an earlier point does not count as a new example.',
  },
  {
    name: 'Question 9',
    question: 'A candidate answers only ONE of this essay\'s four required aspects using relevant facts, and the rest with irrelevant content. What is the maximum Synthesis mark this candidate can earn, out of 2?',
    metadata: ['2', '1', '0', 'It cannot be determined from this information', ''],
    answer: ['1', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'corporate_social_responsibility_and_human_rights',
    topic: 'human_rights_and_diversity',
    subtopic: 'essay_structure_and_argumentation',
    skills: ['evaluate_essay_layout_compliance'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 9,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Full Synthesis marks require at least half of the aspects answered with only relevant facts.\n- Answering less than half with relevant facts still earns partial credit, not zero.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — essay guidance, one entry (real exam has
// no numbered sub-questions here) ─────────────────────────────────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: '6',
      marks: 40,
      clues: '- Cover all four required aspects: health/safety responsibilities, workplace human rights, environmental strategies, and age/disability diversity.\n- Address at least two aspects in your introduction and at least one in your conclusion, per the rubric.',
      approach: '- State the word "Introduction" and preview all four aspects in your own words.\n- Give each aspect its own body paragraph, in the order the essay names them.\n- Include one specific, dated, real example in at least two paragraphs, to earn Originality marks.\n- State the word "Conclusion" and briefly restate how the aspects fit together.',
      solution: '1. Introduction: state that the essay covers employer health/safety responsibilities, workplace human rights, environmental protection strategies, and age/disability diversity.\n2. Health and safety: employers must provide safety equipment, training, and a proactive approach to hazard prevention.\n3. Human rights: fair labour practices, equality/non-discrimination, and privacy are all rights businesses must uphold.\n4. Environmental strategies: proper waste disposal, reducing emissions, and employee wellness programmes all protect the environment and human health.\n5. Diversity: age is addressed through flexible retirement and cross-generational mentoring; disability is addressed through reasonable accommodations such as accessible facilities.\n6. Conclusion: restate that meeting these responsibilities builds a fair, sustainable, and legally compliant workplace.',
    },
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
