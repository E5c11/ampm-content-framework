#!/usr/bin/env node
/**
 * DBE English HL P3 — November 2025 — Question 2.1: E-mail (order 2)
 * Real task: e-mail an entry to the YOUNGMINDS 'Simple solutions for savvy living'
 * competition, describing an invented product and why it would appeal to consumers.
 * Practice set covers e-mail format conventions, subject line, opening, motivating
 * content, body order and register, on a fresh youth-innovation-challenge scenario
 * (workflow Appendix "Paper 3 structure", DESIGN-UNI-01). aiExplanation has one entry for
 * real 2.1 (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p3-q2.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p3-q2.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p3-q2.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p3/q2';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 2.1: E-mail',
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p3',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['email', 'email_structure', 'transactional_writing', 'register'],
  question_image_urls: [`${BASE}/question_1.png`],
  memo_image_urls: [`${BASE}/memo_1.png`, `${BASE}/memo_2.png`, `${BASE}/memo_3.png`, `${BASE}/memo_4.png`],
  exam_question_marks: 25,
  supplementary_materials: null,
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 1',
    order: 1,
    context_text: null,
    question: 'You are e-mailing an entry to a youth innovation challenge. Select the THREE format features your e-mail MUST include.',
    metadata: [
      "The sender's and the recipient's e-mail addresses",
      'A short subject line that names the purpose',
      "The recipient's full postal address and code",
      'A suitable salutation and an appropriate sign-off',
      'A list of sources at the end of the message',
    ],
    answer: [
      "The sender's and the recipient's e-mail addresses",
      'A short subject line that names the purpose',
      'A suitable salutation and an appropriate sign-off',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'transactional_writing',
    topic: 'email',
    subtopic: 'email_format_elements',
    skills: ['identify_email_format', 'recall_text_conventions'],
    difficulty: 1,
    exam_weight: 3,
    clues: '- An e-mail is sent electronically, not through the post.\n- Think about what appears in the header and at the start and end of the message.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 2',
    order: 2,
    context_text: null,
    question: 'Which subject line is MOST suitable for your competition entry?',
    metadata: [
      'Please read this urgently, it is really important',
      'Something I invented that you might like a lot',
      'Competition entry: solar-charging school bag',
      'Hi there, a message from a young entrepreneur',
      '',
    ],
    answer: ['Competition entry: solar-charging school bag', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'email',
    subtopic: 'subject_line',
    skills: ['evaluate_subject_line'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- The reader should know what the e-mail is about before opening it.\n- Specific beats vague.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 3',
    order: 3,
    context_text: null,
    question: 'Which opening paragraph is MOST effective for your entry e-mail?',
    metadata: [
      'Hi guys, I saw your advert and I think I could win, so here is my little thing.',
      'My name is Thabo. I am seventeen. I like science and I also like soccer.',
      'I am writing to enter the BrightSpark Challenge with my new invention.',
      'Before I tell you about my invention, let me tell you about my family.',
      '',
    ],
    answer: ['I am writing to enter the BrightSpark Challenge with my new invention.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'email',
    subtopic: 'opening_paragraph',
    skills: ['identify_effective_opening'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- The first paragraph should state why you are writing.\n- Keep the register suitable for a company you do not know.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 4',
    order: 4,
    context_text: null,
    question: 'The competition asks why your product would appeal to consumers. Which sentence gives the MOST convincing motivation?',
    metadata: [
      'In load-shedding, learners could charge a phone or lamp on the walk home.',
      'The bag looks really cool, and I truly believe that everybody will want one soon.',
      'I have always loved inventing things, ever since I was a very small child.',
      'My teacher said my idea was good, so I am sure that you will agree with her.',
      '',
    ],
    answer: ['In load-shedding, learners could charge a phone or lamp on the walk home.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'email',
    subtopic: 'motivation_content',
    skills: ['evaluate_application_content'],
    difficulty: 3,
    exam_weight: 3,
    clues: '- A convincing motivation focuses on the consumer, not on you.\n- Look for a real problem the product solves.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 5',
    order: 5,
    context_text: null,
    question: "Arrange the paragraphs of the entry e-mail's body in the most logical order.",
    metadata: [
      'Explain why consumers would want to buy and use it',
      'Thank the organisers and say you look forward to their reply',
      'State that you are entering the competition and name your product',
      'Mention how the prize would help you develop the product',
      'Describe what the product is and how it works',
    ],
    answer: [
      'State that you are entering the competition and name your product',
      'Describe what the product is and how it works',
      'Explain why consumers would want to buy and use it',
      'Mention how the prize would help you develop the product',
      'Thank the organisers and say you look forward to their reply',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'email',
    subtopic: 'body_structure',
    skills: ['sequence_email_content', 'evaluate_email_structure'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- Purpose first, polite closing last.\n- The reader needs to know what the product is before hearing why it would sell.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 6',
    order: 6,
    context_text: "Draft line: 'Yo, my bag is lit and it will totally blow your minds, trust me.'",
    question: 'Which revision uses the MOST appropriate register for this e-mail?',
    metadata: [
      'My bag is amazing and it will blow your minds, I promise you all.',
      'Trust me, this bag is the best thing you guys will ever see in life.',
      'My bag is lit and totally awesome, so you should choose it, trust me.',
      'I am confident that my bag offers a practical and appealing solution.',
      '',
    ],
    answer: ['I am confident that my bag offers a practical and appealing solution.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'email',
    subtopic: 'register_and_tone',
    skills: ['evaluate_register', 'apply_formal_register'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- You are writing to a company you have never met.\n- Remove slang and exaggerated promises.',
  },
];

// ─── AI explanation — real exam Question 2.1 (AIEXP-08) ──────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1',
      marks: 25,
      clues: '- The advertisement asks you to describe a product you invented and say why it would appeal to consumers.\n- Format counts: this is an e-mail, not a letter.',
      approach: '- Invent one clear product that makes ordinary life easier\n- Set out the e-mail format: From, To (shine@youngminds.co.za), date, subject line, salutation\n- In 180–200 words, describe the product and give convincing reasons it would sell\n- Close politely and sign off with your name',
      solution: '1. The memo expects a convincing motivation for the candidate\'s product, service or prototype, linked to the competition\'s call for clever products that transform everyday life.\n2. Required format: sender\'s and recipient\'s e-mail addresses, date, subject line, salutation and signing off.\n3. The body should be 180–200 words, in a polite, confident register suited to writing to a company.\n4. The rubric gives 15 marks for content, planning and format and 10 marks for language, style and editing.\n5. Weak answers drift into life stories or slang, or forget the subject line and e-mail addresses.',
    },
  ],
  model: 'claude-opus-5-5',
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
    console.error(
      '\n   curriculum_nodes / skills → node tools/create-curriculum-node.js | create-skill.js' +
      '\n   tags → node tools/create-tag.js',
    );
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

// Only run when invoked directly — so validate-questions.js (and anything else) can load
// this file for its data blocks without opening a DB connection or writing anything.
if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
