#!/usr/bin/env node
/**
 * DBE English HL P3 — November 2025 — Question 2.2: Speech (order 3)
 * Real task: as a public speaker at an Africa Day rally, speak on the Freedom Charter line
 * 'There shall be peace and friendship ... for all the peoples of Africa.' Practice set
 * covers the speech's opening address, rhetorical devices, focus on a quotation, speech
 * arc, register and closing, on a fresh Youth Day rally / African proverb scenario
 * (workflow Appendix "Paper 3 structure", DESIGN-UNI-01). aiExplanation has one entry for
 * real 2.2 (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p3-q3.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p3-q3.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p3-q3.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p3/q3';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 2.2: Speech',
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p3',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['speech_structure', 'rhetorical_devices', 'transactional_writing', 'register'],
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
    question: 'You are the guest speaker at a Youth Day rally. Which opening is MOST suitable?',
    metadata: [
      'Hey everyone, so today I am going to say some stuff about working together.',
      'Programme director, honoured guests and young people of this community.',
      'Dear Sir or Madam, I am writing to share my views about working together.',
      'Once upon a time, in a land far away, there lived a group of young people.',
      '',
    ],
    answer: ['Programme director, honoured guests and young people of this community.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'speech',
    subtopic: 'opening_address',
    skills: ['identify_speech_opening'],
    difficulty: 1,
    exam_weight: 2,
    clues: '- A speech begins by addressing the people in front of you.\n- Letters and stories open differently.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 2',
    order: 2,
    context_text: null,
    question: 'Match each rhetorical device to the line from the speech that uses it.',
    metadata: [
      'A - Rhetorical question',
      'B - Triad (rule of three)',
      'C - Repetition',
      'D - Inclusive pronouns',
      "1 - 'Africa needs builders, healers and leaders.'",
      "2 - 'Who will fix these streets if not the youth?'",
      "3 - 'The future of this community is ours to shape.'",
      "4 - 'Unity built this nation, and unity will rebuild it.'",
    ],
    answer: ['A-2', 'B-1', 'C-4', 'D-3'],
    presentation: 'match',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'speech',
    subtopic: 'rhetorical_devices',
    skills: ['identify_rhetorical_device', 'match_device_to_purpose'],
    difficulty: 2,
    exam_weight: 3,
    clues: '- Count items, look for a question mark and look for a word that comes back.\n- Pronouns like "we" and "our" draw the audience in.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 3',
    order: 3,
    context_text: null,
    question: "You must speak on the proverb 'If you want to go far, go together.' Which plan keeps the speech MOST focused on the quotation?",
    metadata: [
      'Describe your own life story from birth until the day you finished school',
      'List the history of every African country and their independence dates',
      'Explain the proverb, give teamwork examples and urge youth to unite',
      'Discuss the dangers of social media and why teenagers should limit their screen time',
      '',
    ],
    answer: ['Explain the proverb, give teamwork examples and urge youth to unite', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'speech',
    subtopic: 'speech_components',
    skills: ['evaluate_content_focus'],
    difficulty: 2,
    exam_weight: 3,
    clues: '- Every part of the speech should connect back to the quotation.\n- Interesting but unrelated material counts as digression.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 4',
    order: 4,
    context_text: null,
    question: 'Arrange the parts of the rally speech in the most effective order.',
    metadata: [
      'Support the message with real-life examples',
      'End with a call to action and thank the audience',
      'Introduce the proverb with a striking hook',
      'Greet the audience and acknowledge the occasion',
      'Explain what the proverb means for young people',
    ],
    answer: [
      'Greet the audience and acknowledge the occasion',
      'Introduce the proverb with a striking hook',
      'Explain what the proverb means for young people',
      'Support the message with real-life examples',
      'End with a call to action and thank the audience',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'speech',
    subtopic: 'speech_arc',
    skills: ['identify_speech_structure', 'sequence_text_elements'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- A speech moves from greeting, to message, to evidence, to a final appeal.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 5',
    order: 5,
    context_text: null,
    question: 'Which description BEST fits the register and tone of a speech at a public rally?',
    metadata: [
      'Casual and slangy, as if chatting to one close friend at home',
      'Dry and technical, like a scientific report full of statistics',
      'Bitter and sarcastic, mocking anyone who disagrees with you',
      'Formal yet inspiring, addressing the crowd directly to stir it',
      '',
    ],
    answer: ['Formal yet inspiring, addressing the crowd directly to stir it', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'transactional_writing',
    topic: 'speech',
    subtopic: 'register_and_tone',
    skills: ['evaluate_register', 'evaluate_tone'],
    difficulty: 1,
    exam_weight: 2,
    clues: '- Consider the size of the audience and the purpose of a rally.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 6',
    order: 6,
    context_text: null,
    question: 'Which closing line is MOST effective for this speech?',
    metadata: [
      'That is all I have to say, so thank you very much and goodbye to everyone here today.',
      'So, in conclusion, working together is good and we should all do it more.',
      'Let us leave here not as strangers, but as partners on the long road ahead.',
      'I hope you enjoyed my speech, even though it was a bit long and boring.',
      '',
    ],
    answer: ['Let us leave here not as strangers, but as partners on the long road ahead.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'speech',
    subtopic: 'closing_structure',
    skills: ['identify_speech_closing'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- A memorable ending echoes the message and calls the audience to act.',
  },
];

// ─── AI explanation — real exam Question 2.2 (AIEXP-08) ──────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.2',
      marks: 25,
      clues: '- The speech must be about the Freedom Charter quotation, not about Africa Day in general.\n- Think about what peace and friendship between African peoples would look like today.',
      approach: '- Open by addressing the rally audience and the occasion\n- Introduce and explain the quotation in your own words\n- Develop two or three points (for example ending conflict, welcoming fellow Africans, co-operation) with examples\n- Close with a rousing call to action and thank the audience',
      solution: '1. The memo states that the speech should focus on the quotation: \'There shall be peace and friendship: encouragement of peaceful relations for all the peoples of Africa.\'\n2. A strong response explains what the line means and why it matters now, using examples such as rejecting xenophobia, resolving conflict or building ties across borders.\n3. Speech features earn credit: an address to the audience, rhetorical devices (questions, repetition, triads, inclusive "we"), and a memorable conclusion.\n4. The body should be 180–200 words, with 15 marks for content, planning and format and 10 for language, style and editing.\n5. Speeches that drift into a general history of Africa or ignore the quotation lose content marks.',
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
