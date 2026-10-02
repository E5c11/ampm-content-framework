#!/usr/bin/env node
/**
 * DBE English HL P3 — November 2025 — Question 2.4: Formal Letter (order 5)
 * Real task: parents keep posting favourable comments about the school on social media;
 * write to the principal expressing your views. Practice set covers formal-letter format
 * order, salutation/sign-off, subject line, register, opening and body development, on a
 * fresh scenario (local businesses praising the school's clean-up project)
 * (workflow Appendix "Paper 3 structure", DESIGN-UNI-01). Topic formal_letter created this
 * session — letter_to_press covers letters to an editor, not a principal. aiExplanation
 * has one entry for real 2.4 (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p3-q5.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p3-q5.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p3-q5.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p3/q5';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 2.4: Formal Letter',
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p3',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['formal_letter', 'letter_format', 'transactional_writing', 'register'],
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
    question: 'Arrange the parts of a formal letter to your principal in the correct order, from top to bottom.',
    metadata: [
      'Salutation',
      "Recipient's address",
      'Body and signing off',
      "Sender's address",
      'Subject line',
      'Date',
    ],
    answer: [
      "Sender's address",
      'Date',
      "Recipient's address",
      'Salutation',
      'Subject line',
      'Body and signing off',
    ],
    presentation: 'ordering',
    type: 'definition',
    unit: 'transactional_writing',
    topic: 'formal_letter',
    subtopic: 'letter_format_order',
    skills: ['identify_letter_format', 'sequence_text_elements'],
    difficulty: 2,
    exam_weight: 3,
    clues: '- Your own details come before the recipient\'s.\n- The subject line follows the salutation in the DBE format.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 2',
    order: 2,
    context_text: null,
    question: 'Your principal is Mrs Dlamini. Which salutation and sign-off pair is CORRECT for this letter?',
    metadata: [
      'Hey Mrs Dlamini … Cheers',
      'Dear Mrs Dlamini … Love always',
      'Dear Mrs Dlamini … Yours sincerely',
      'To whom it may concern … Bye for now',
      '',
    ],
    answer: ['Dear Mrs Dlamini … Yours sincerely', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'transactional_writing',
    topic: 'formal_letter',
    subtopic: 'salutation_and_sign_off',
    skills: ['identify_salutation_convention', 'apply_sign_off_rules'],
    difficulty: 1,
    exam_weight: 2,
    clues: '- Both the greeting and the closing must be formal.\n- You know the recipient\'s name, so use it.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 3',
    order: 3,
    context_text: 'Local businesses have been praising your school\'s community clean-up project on radio and online.',
    question: 'Which subject line is MOST suitable for your letter to the principal?',
    metadata: [
      'Re: Something I wanted to tell you about our school',
      "Re: Community praise for our school's clean-up project",
      'Re: A letter from one of your Grade 12 learners',
      'Re: Social media, radio, newspapers and various other things',
      '',
    ],
    answer: ["Re: Community praise for our school's clean-up project", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'formal_letter',
    subtopic: 'subject_line',
    skills: ['evaluate_subject_line'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- A subject line names the exact topic of the letter in a few words.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 4',
    order: 4,
    context_text: null,
    question: 'Select the THREE sentences whose register suits a formal letter to your principal.',
    metadata: [
      'I was proud to hear local businesses praise our clean-up project.',
      "Ma'am, the shout-outs on the radio were seriously epic!!!",
      'I believe this recognition could inspire more learners to volunteer.',
      'Honestly, nobody even cared about the school before this lol.',
      'I would like to suggest that we thank these businesses publicly.',
    ],
    answer: [
      'I was proud to hear local businesses praise our clean-up project.',
      'I believe this recognition could inspire more learners to volunteer.',
      'I would like to suggest that we thank these businesses publicly.',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'formal_letter',
    subtopic: 'register_and_tone',
    skills: ['evaluate_register', 'apply_formal_register'],
    difficulty: 1,
    exam_weight: 2,
    clues: '- Watch for slang, text-speak and exaggerated punctuation.\n- A respectful letter can still express strong views.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 5',
    order: 5,
    context_text: null,
    question: 'Which opening paragraph BEST states the purpose of the letter?',
    metadata: [
      'I hope you are well. The weather has been lovely lately, and our garden looks great.',
      'I am a Grade 12 learner, and I have been at this school since Grade 8.',
      'Many things happen in a community, and some are good while others are bad.',
      "I am writing to share my views on the recent praise for our school.",
      '',
    ],
    answer: ["I am writing to share my views on the recent praise for our school.", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'formal_letter',
    subtopic: 'opening_paragraph',
    skills: ['identify_effective_opening'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- The principal should know why you are writing after the first sentence.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 6',
    order: 6,
    context_text: "Draft paragraph: 'The praise is nice. It is good. People are saying good things, and that is nice.'",
    question: 'Which revision develops this view MOST effectively?',
    metadata: [
      'The praise is very, very nice, and it is really good for all of us at school.',
      'The praise has lifted morale, and three more learners joined the eco-club.',
      'People keep saying nice things, which is nice, and I think that is good.',
      'Some praise was on the radio, and some was in a newspaper and online too.',
      '',
    ],
    answer: ['The praise has lifted morale, and three more learners joined the eco-club.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'formal_letter',
    subtopic: 'body_development',
    skills: ['support_with_evidence', 'construct_argument'],
    difficulty: 3,
    exam_weight: 3,
    clues: '- A developed view explains an effect and backs it with a specific example.\n- Repeating vague words adds length, not depth.',
  },
];

// ─── AI explanation — real exam Question 2.4 (AIEXP-08) ──────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.4',
      marks: 25,
      clues: '- Your letter is to the principal, and its topic is the parents\' favourable comments online.\n- Decide what you think about this praise and what should be done with it.',
      approach: "- Set out the format: sender's address, date, principal's address, salutation, subject line\n- State your purpose in the first paragraph\n- Give your views on the parents' social-media praise, with reasons and examples (morale, reputation, enrolment)\n- Conclude with a suggestion or request, then sign off formally",
      solution: "1. The memo expects the candidate to express his or her views to the principal about the parents' favourable comments about the school.\n2. Candidates may also focus on parents expressing their views on social media in general.\n3. Required format: sender's address, date, recipient's address, salutation, subject line and signing off.\n4. A strong letter is respectful and formal, gives clear reasons and examples, and stays at 180–200 words in the body.\n5. The rubric gives 15 marks for content, planning and format and 10 for language, style and editing; slang or missing format elements cost marks.",
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
