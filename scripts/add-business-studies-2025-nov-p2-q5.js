#!/usr/bin/env node
/**
 * DBE Business Studies P2 — November 2025 — Question 5 (order 5)
 * Business Ventures (Investment: Insurance) — essay question, Section C.
 * DESIGN-BUS-03: no free-text essay input exists in the app — practice questions teach
 * the essay content (insurance vs. assurance, compulsory insurance, advantages,
 * utmost-good-faith/insurable-interest principles) plus the essay-strategy skill
 * objectively, grounded in the real memo's own documented LASO rubric (Layout,
 * Analysis/interpretation, Synthesis, Originality — 8 of the essay's 40 marks).
 * Never a free-text/model-essay item; never verbatim memo prose.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2025-nov-p2-q5.js --curriculum temp/curriculum-vocab-business-studies.json
 *   node scripts/add-business-studies-2025-nov-p2-q5.js --dry-run
 *   node scripts/add-business-studies-2025-nov-p2-q5.js
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
  name: 'Question 5',
  syllabus: 'dbe',
  subject: 'business_studies',
  year: 2025,
  paper: 'nov_p2',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 40,
  tags: ['investment_insurance', 'insurance_principles', 'essay_writing_skills'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q5/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q5/memo_1.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q5/memo_2.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q5/memo_3.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q5/memo_4.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2025/nov_p2/q5/memo_5.png"],
  exam_question_marks: 40,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'What is the key difference between insurance and assurance?',
    metadata: [
      'Insurance is only available to businesses; assurance is only available to individuals',
      'Insurance covers uncertain events; assurance covers an event certain to happen eventually, such as death',
      'Insurance and assurance are simply two different words for the exact same product',
      'Assurance always costs less than insurance for the same level of cover',
      '',
    ],
    answer: ['Insurance covers uncertain events; assurance covers an event certain to happen eventually, such as death', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'investment_securities_and_insurance',
    topic: 'insurance_concepts',
    subtopic: 'term_definition_recall',
    skills: ['explain_insurance_concept'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Insurance protects against something that might happen; assurance covers something that eventually will.\n- Availability and pricing are not what distinguishes the two.',
  },
  {
    name: 'Question 2',
    question: 'Which of the following are types of insurance a business is legally required to have (compulsory insurance)?',
    metadata: [
      'Compensation for Occupational Injuries and Diseases (COIDA) cover for employees',
      'Fire insurance on the business premises',
      'Unemployment Insurance Fund (UIF) contributions',
      'Third-party motor vehicle insurance',
      'Life assurance for every employee',
    ],
    answer: [
      'Compensation for Occupational Injuries and Diseases (COIDA) cover for employees',
      'Unemployment Insurance Fund (UIF) contributions',
      'Third-party motor vehicle insurance',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'investment_securities_and_insurance',
    topic: 'insurance_concepts',
    subtopic: 'classification_and_criteria',
    skills: ['explain_insurance_concept'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Compulsory insurance is required by law, not chosen voluntarily for asset protection.\n- Fire insurance and life assurance are valuable, but a business chooses whether to take them out.',
  },
  {
    name: 'Question 3',
    question: 'Which of the following are genuine advantages insurance offers a business?',
    metadata: [
      'Transferring financial risk to the insurer, protecting the business from a large unexpected loss',
      'A guarantee that the business will always remain profitable',
      'Peace of mind that allows management to focus on running the business',
      'Making it easier to obtain credit, since lenders see insured assets as lower risk',
      'Permanent exemption from any future legal liability',
    ],
    answer: [
      'Transferring financial risk to the insurer, protecting the business from a large unexpected loss',
      'Peace of mind that allows management to focus on running the business',
      'Making it easier to obtain credit, since lenders see insured assets as lower risk',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'investment_securities_and_insurance',
    topic: 'insurance_concepts',
    subtopic: 'classification_and_criteria',
    skills: ['explain_insurance_concept'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Insurance manages risk; it does not guarantee outcomes or remove all future liability.\n- Look for the three benefits that follow directly from transferring risk to an insurer.',
  },
  {
    name: 'Question 4',
    question: "When Naledi applied for business insurance, she disclosed a previous, unrelated small claim from three years ago even though the insurer never asked about it directly, because she believed it was relevant. Which insurance principle is Naledi applying?",
    metadata: ['Insurable interest', 'Utmost good faith', 'Average clause', 'Indemnity', ''],
    answer: ['Utmost good faith', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'investment_securities_and_insurance',
    topic: 'insurance_principles',
    subtopic: 'scenario_application',
    skills: ['explain_insurance_principle'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- This principle requires full, honest disclosure of anything relevant, even if not directly asked.\n- It is not about having a financial stake in the item insured — that is a different principle.',
  },
  {
    name: 'Question 5',
    question: 'A business owner tries to insure a warehouse belonging to a completely unrelated company, hoping to profit if it burns down. Which insurance principle would prevent this policy from being valid?',
    metadata: ['Utmost good faith', 'Average clause', 'Insurable interest', 'Excess', ''],
    answer: ['Insurable interest', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'investment_securities_and_insurance',
    topic: 'insurance_principles',
    subtopic: 'scenario_application',
    skills: ['explain_insurance_principle'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- This principle requires a genuine financial stake in whatever is being insured.\n- Without this stake, an insurer will not recognise the policy as valid.',
  },
  {
    name: 'Question 6',
    question: 'Arrange these parts of an essay on Investment: Insurance into the correct structural order.',
    metadata: [
      'The advantages insurance offers a business',
      'Restating how insurance and assurance both support sound financial planning',
      'The differences between insurance and assurance',
      'Outlining that the essay will cover insurance vs. assurance, compulsory insurance, advantages, and key principles',
      'Utmost good faith and insurable interest as insurance principles',
      'The types of compulsory insurance a business must have',
    ],
    answer: [
      'Outlining that the essay will cover insurance vs. assurance, compulsory insurance, advantages, and key principles',
      'The differences between insurance and assurance',
      'The types of compulsory insurance a business must have',
      'The advantages insurance offers a business',
      'Utmost good faith and insurable interest as insurance principles',
      'Restating how insurance and assurance both support sound financial planning',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'investment_securities_and_insurance',
    topic: 'insurance_concepts',
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
    clues: '- The introduction previews all four aspects; the conclusion sums them up.\n- Each body paragraph should address one of the four required aspects, in the order the essay introduces them.',
  },
  {
    name: 'Question 7',
    question: 'Which introduction would earn full Layout marks for this essay, per the official marking guideline\'s rubric?',
    metadata: [
      'One that jumps straight into the first body paragraph with no heading at all',
      'One that states the word "Introduction" and addresses at least two of the four required aspects in the writer\'s own words',
      'One that states the word "Introduction" but only copies a textbook definition of insurance word-for-word',
      'One that addresses all four aspects in detail, without ever using the word "Introduction"',
      '',
    ],
    answer: ['One that states the word "Introduction" and addresses at least two of the four required aspects in the writer\'s own words', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'investment_securities_and_insurance',
    topic: 'insurance_concepts',
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
    clues: '- Layout marks require both the heading itself and coverage of at least two of the four aspects.\n- A missing heading or a verbatim copied definition both forfeit these marks, even if the content itself is otherwise fine.',
  },
  {
    name: 'Question 8',
    question: 'Which of the following, if included in the essay, would earn an Originality mark under the rubric\'s "recent, real example" requirement?',
    metadata: [
      'A textbook definition of insurable interest with no real-world example attached',
      'A specific, named South African business that adjusted its insurance cover within the last two years, with a brief explanation of why',
      'A general statement that "many businesses use insurance"',
      'A repeated restatement of the essay\'s own introduction',
      '',
    ],
    answer: ['A specific, named South African business that adjusted its insurance cover within the last two years, with a brief explanation of why', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'investment_securities_and_insurance',
    topic: 'insurance_concepts',
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
    clues: '- Originality requires a specific, dated, real example — not a generic definition or a vague statement.\n- The example must actually be an example, not a restatement of something already said.',
  },
  {
    name: 'Question 9',
    question: 'Out of this essay\'s 40 marks, how many come from the "Insight" component of the rubric (Layout, Analysis/interpretation, Synthesis, Originality combined) rather than from content?',
    metadata: ['4', '8', '16', '20', ''],
    answer: ['8', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'investment_securities_and_insurance',
    topic: 'insurance_concepts',
    subtopic: 'essay_structure_and_argumentation',
    skills: ['evaluate_essay_layout_compliance'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 9,
    syllabus: 'dbe',
    subject: 'business_studies',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The Insight component has four parts, worth 2 marks each.\n- Content marks make up the rest of the 40.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — essay guidance, one entry (real exam has
// no numbered sub-questions here) ─────────────────────────────────────────────────
// Derived from the official marking guideline's own aspect breakdown and its documented
// LASO rubric (Layout, Analysis/interpretation, Synthesis, Originality), summarised as
// guidance rather than a model essay (DESIGN-BUS-03 — no free-text essay exists here).

const aiExplanation = {
  sub_questions: [
    {
      number: '5',
      marks: 40,
      clues: '- Cover all four required aspects: insurance vs. assurance, compulsory insurance, advantages, and the two named principles.\n- Address at least two aspects in your introduction and at least one in your conclusion, per the rubric.',
      approach: '- State the word "Introduction" and preview all four aspects in your own words.\n- Give each aspect its own body paragraph, in the order the essay names them.\n- Include one specific, dated, real example somewhere in at least two paragraphs, to earn Originality marks.\n- State the word "Conclusion" and briefly restate how the aspects fit together.',
      solution: '1. Introduction: state that the essay covers insurance vs. assurance, compulsory insurance, the advantages of insurance, and the principles of utmost good faith and insurable interest.\n2. Insurance vs. assurance: insurance covers uncertain events; assurance covers a certain future event such as death.\n3. Compulsory insurance: COIDA cover, UIF contributions, and third-party motor vehicle insurance are all legally required.\n4. Advantages: insurance transfers financial risk, gives peace of mind, and eases access to credit.\n5. Principles: utmost good faith requires full, honest disclosure of relevant facts; insurable interest requires a genuine financial stake in the insured item.\n6. Conclusion: restate that both insurance and assurance, applied correctly and honestly, support sound financial planning for a business.',
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
