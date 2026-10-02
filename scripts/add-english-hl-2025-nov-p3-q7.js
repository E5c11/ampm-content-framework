#!/usr/bin/env node
/**
 * DBE English HL P3 — November 2025 — Question 2.6: Dialogue (order 7)
 * Real task: a critic reviewed a newly opened restaurant; on the critic's second visit
 * the manager approaches — write the dialogue. Practice set covers dialogue format,
 * conventions, opening, character voice, structure and register, on a fresh scenario (a
 * blogger who reviewed a new hair salon and the salon owner) (workflow Appendix "Paper 3
 * structure", DESIGN-UNI-01). aiExplanation has one entry for real 2.6 (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p3-q7.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p3-q7.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p3-q7.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p3/q7';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 2.6: Dialogue',
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p3',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['dialogue', 'dialogue_format', 'transactional_writing', 'tone'],
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
    question: 'Which line is set out CORRECTLY for a dialogue?',
    metadata: [
      '"Welcome back," said the owner. "May I join you for a moment?"',
      'The owner said welcome back and politely asked if she could join her at the table.',
      'OWNER: (smiling) Welcome back. May I join you for a moment?',
      'OWNER - "Welcome back," (smiled politely) "May I join you?"',
      '',
    ],
    answer: ['OWNER: (smiling) Welcome back. May I join you for a moment?', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'transactional_writing',
    topic: 'dialogue',
    subtopic: 'dialogue_format',
    skills: ['identify_dialogue_format'],
    difficulty: 2,
    exam_weight: 3,
    clues: '- Dialogue is set out like a script, not like a story.\n- Check how the speaker is named and how actions are shown.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 2',
    order: 2,
    context_text: null,
    question: 'Select the THREE conventions that a correctly formatted dialogue should follow.',
    metadata: [
      "The speaker's name on the left, followed by a colon",
      'Stage directions in brackets, in the present tense',
      'Quotation marks around every line that is spoken',
      'A new line for each change of speaker',
      "'Said' or 'replied' after each speech, as in a story",
    ],
    answer: [
      "The speaker's name on the left, followed by a colon",
      'Stage directions in brackets, in the present tense',
      'A new line for each change of speaker',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'transactional_writing',
    topic: 'dialogue',
    subtopic: 'speaker_identification',
    skills: ['apply_dialogue_conventions'],
    difficulty: 2,
    exam_weight: 3,
    clues: '- Picture a play script.\n- Narrative punctuation is not needed when the name shows who speaks.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 3',
    order: 3,
    context_text: 'A blogger posted a harsh review of a newly opened hair salon. On her second visit, the owner approaches her.',
    question: 'Which opening line from the owner BEST establishes the situation?',
    metadata: [
      "OWNER: Hello there. Nice weather today, isn't it? Are you having a good week?",
      'OWNER: Excuse me, I believe you wrote that review of our salon last week?',
      'OWNER: I do not know who you are, but please sit down wherever you like.',
      'OWNER: Our salon sells shampoo, conditioner and many other fine products.',
      '',
    ],
    answer: ['OWNER: Excuse me, I believe you wrote that review of our salon last week?', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'dialogue',
    subtopic: 'dialogue_opening',
    skills: ['apply_dialogue_structure'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- The first lines should make clear who these people are to each other.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 4',
    order: 4,
    context_text: "BLOGGER: (folding her arms) I stand by every word. The wait was over an hour.",
    question: 'Which reply BEST shows the owner as professional yet determined to defend the salon?',
    metadata: [
      "OWNER: Fine, then never come back here. We don't need your business.",
      'OWNER: You are completely right, we are terrible, and I am so sorry.',
      'OWNER: Whatever. Bloggers like you just enjoy complaining about absolutely everything.',
      "OWNER: That wait was wrong, but our stylists deserve another look.",
      '',
    ],
    answer: ['OWNER: That wait was wrong, but our stylists deserve another look.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'dialogue',
    subtopic: 'character_voice',
    skills: ['identify_character_voice', 'infer_speaker_attitude'],
    difficulty: 3,
    exam_weight: 3,
    clues: '- Professional means polite and calm; determined means not simply giving in.\n- Look for a reply that does both at once.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 5',
    order: 5,
    context_text: null,
    question: 'Arrange the stages of the dialogue in the most logical order.',
    metadata: [
      'The blogger explains her criticisms',
      'They part on improved terms',
      'The owner approaches and introduces herself',
      'The owner responds and offers a solution',
      "The owner raises the blogger's review",
    ],
    answer: [
      'The owner approaches and introduces herself',
      "The owner raises the blogger's review",
      'The blogger explains her criticisms',
      'The owner responds and offers a solution',
      'They part on improved terms',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'dialogue',
    subtopic: 'dialogue_structure',
    skills: ['identify_dialogue_arc', 'sequence_text_elements'],
    difficulty: 1,
    exam_weight: 2,
    clues: '- A good dialogue has a beginning, a conflict and a resolution.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 6',
    order: 6,
    context_text: null,
    question: 'Which description BEST fits the register this dialogue should use?',
    metadata: [
      'Formal and academic throughout, like a scientific research report',
      'Polite and conversational, suited to a business setting',
      'Crude and aggressive, showing how angry both people are',
      'Childish and playful, full of jokes and silly nicknames',
      '',
    ],
    answer: ['Polite and conversational, suited to a business setting', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'transactional_writing',
    topic: 'dialogue',
    subtopic: 'register_and_tone',
    skills: ['evaluate_register'],
    difficulty: 1,
    exam_weight: 2,
    clues: '- Two adults who barely know each other are talking about business.',
  },
];

// ─── AI explanation — real exam Question 2.6 (AIEXP-08) ──────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.6',
      marks: 25,
      clues: '- The conversation is between the restaurant manager and the critic who reviewed it.\n- Decide whether the review was positive or negative, since that shapes the whole exchange.',
      approach: '- Set the scene briefly and name the two speakers\n- Use dialogue format: names on the left, colons, stage directions in brackets\n- Build the exchange from greeting, to discussing the review, to a resolution\n- Keep the register polite and conversational over 180–200 words',
      solution: "1. The memo states that the dialogue should focus on the manager's interaction with the restaurant critic.\n2. A valid dialogue format should be used: speakers' names followed by colons, a new line per speaker, and stage directions in brackets.\n3. A strong response makes the purpose of the meeting clear early (thanking, challenging or responding to the review) and gives each speaker a distinct, believable voice.\n4. The rubric gives 15 marks for content, planning and format and 10 for language, style and editing.\n5. Narrative-style speech with quotation marks, or a conversation that drifts away from the review, loses marks.",
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
