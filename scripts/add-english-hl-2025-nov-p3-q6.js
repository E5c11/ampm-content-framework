#!/usr/bin/env node
/**
 * DBE English HL P3 — November 2025 — Question 2.5: Book Review (order 6)
 * Real task: review the bestselling book 'Letter to my future self' (cover image given).
 * Practice set covers review elements (title, author, synopsis, critique), synopsis vs
 * critique, structure, balance, terminology and register, using a fictional novel
 * 'The Lantern Years' for examples (workflow Appendix "Paper 3 structure", DESIGN-UNI-01).
 * aiExplanation has one entry for real 2.5 (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p3-q6.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p3-q6.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p3-q6.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p3/q6';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 2.5: Book Review',
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p3',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['book_review', 'critical_analysis', 'evaluative_writing', 'transactional_writing'],
  question_image_urls: [`${BASE}/question_1.png`, `${BASE}/question_2.png`],
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
    question: 'Select the FOUR elements that a well-written book review should include.',
    metadata: [
      'The title and the author of the book',
      'A brief synopsis that avoids spoiling the ending',
      "A critique of the book's strengths and weaknesses",
      'A detailed account of exactly how the story ends',
      'A recommendation stating who would enjoy it',
    ],
    answer: [
      'The title and the author of the book',
      'A brief synopsis that avoids spoiling the ending',
      "A critique of the book's strengths and weaknesses",
      'A recommendation stating who would enjoy it',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'transactional_writing',
    topic: 'book_review',
    subtopic: 'format_elements',
    skills: ['identify_review_elements', 'recall_text_conventions'],
    difficulty: 1,
    exam_weight: 3,
    clues: '- A review helps a reader decide whether to read the book.\n- Ask which option would ruin the book for that reader.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 2',
    order: 2,
    context_text: null,
    question: "Which sentence from a review of the novel 'The Lantern Years' is CRITIQUE rather than synopsis?",
    metadata: [
      'Lerato leaves her village to study medicine in Johannesburg.',
      "Khumalo's lyrical prose makes Lerato's loneliness ache.",
      'In her first year, Lerato shares a flat with two strangers.',
      'A letter from her grandmother arrives at the start of the third chapter.',
      '',
    ],
    answer: ["Khumalo's lyrical prose makes Lerato's loneliness ache.", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'book_review',
    subtopic: 'synopsis_vs_review',
    skills: ['distinguish_summary_analysis'],
    difficulty: 2,
    exam_weight: 3,
    clues: '- A synopsis reports what happens.\n- A critique judges how well the writer does something.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 3',
    order: 3,
    context_text: null,
    question: 'Arrange the sections of a book review in the most logical order.',
    metadata: [
      'Critique of characters, style and themes',
      'Synopsis of the plot without spoiling the ending',
      'Recommendation and overall rating',
      'Heading with the title, author and publication details',
      'Introduction that hooks the reader and sets the context',
    ],
    answer: [
      'Heading with the title, author and publication details',
      'Introduction that hooks the reader and sets the context',
      'Synopsis of the plot without spoiling the ending',
      'Critique of characters, style and themes',
      'Recommendation and overall rating',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'book_review',
    subtopic: 'review_structure',
    skills: ['sequence_review_sections'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- The reader needs to know what happens before you judge it.\n- Your final verdict comes last.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 4',
    order: 4,
    context_text: null,
    question: 'Which sentence gives the MOST balanced critique?',
    metadata: [
      'The middle chapters drag, but the moving ending makes the wait worthwhile.',
      'This is the best book ever written, and every single page of it is perfect.',
      'I did not like this book at all, and I would never read it again, ever.',
      'The book was fine, I guess, and some parts were good while others were not.',
      '',
    ],
    answer: ['The middle chapters drag, but the moving ending makes the wait worthwhile.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'book_review',
    subtopic: 'tone_and_balance',
    skills: ['evaluate_critical_analysis', 'evaluate_review_quality'],
    difficulty: 3,
    exam_weight: 2,
    clues: '- Balance means weighing a weakness against a strength.\n- Vague judgements are not balanced, only unclear.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 5',
    order: 5,
    context_text: null,
    question: 'Match each part of a book review to its purpose.',
    metadata: [
      'A - Synopsis',
      'B - Critique',
      'C - Recommendation',
      'D - Rating',
      '1 - A score, such as four out of five stars',
      '2 - A short outline of the plot and main characters',
      '3 - Advice on which readers would enjoy the book',
      "4 - An evaluation of the book's strengths and weaknesses",
    ],
    answer: ['A-2', 'B-4', 'C-3', 'D-1'],
    presentation: 'match',
    type: 'definition',
    unit: 'transactional_writing',
    topic: 'book_review',
    subtopic: 'review_format',
    skills: ['identify_review_format'],
    difficulty: 1,
    exam_weight: 2,
    clues: '- Separate telling (what happens) from judging (how good it is) and advising (who should read it).',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 6',
    order: 6,
    context_text: null,
    question: 'Which sentence suits the register of a book review for a school magazine?',
    metadata: [
      'This book is lit, fam, and you have to go and grab it right now, no cap.',
      'The text constitutes a seminal postcolonial bildungsroman of note.',
      'Its themes of ambition and belonging will resonate with teen readers.',
      'I read it. It was a book. It had words in it, and some were good.',
      '',
    ],
    answer: ['Its themes of ambition and belonging will resonate with teen readers.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'book_review',
    subtopic: 'register_and_tone',
    skills: ['evaluate_register'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- Picture a fellow learner reading the review.\n- Avoid both slang and heavy academic jargon.',
  },
];

// ─── AI explanation — real exam Question 2.5 (AIEXP-08) ──────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.5',
      marks: 25,
      clues: '- The book is called Letter to my future self, and the cover is all the paper gives you.\n- Think about what such a book might contain and who it would help.',
      approach: '- Give the heading details: title, author (you may invent one) and other book details\n- Write a brief synopsis of what the book offers without spoiling it\n- Critique its strengths and weaknesses with specific examples\n- End with a recommendation and/or rating, keeping the body to 180–200 words',
      solution: "1. The memo states that the candidate should review the book titled Letter to my future self.\n2. The review must include the title, the author, a synopsis and a critique.\n3. A valid review format should be used, for example a heading with the book's details, then synopsis, evaluation and recommendation.\n4. A strong review is balanced and specific, with an engaging, semi-formal tone; a plot summary alone is not a review.\n5. The rubric gives 15 marks for content, planning and format and 10 for language, style and editing.",
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
