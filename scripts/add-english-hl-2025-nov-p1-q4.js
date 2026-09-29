#!/usr/bin/env node
/**
 * DBE English HL P1 — November 2025 — Question 4: Media (order 4)
 * TEXT F: 'Zits' cartoon (Father's Day gift / first summer job). Practice set mirrors the
 * text-extractable sub-questions — attitude (4.1), prolonged speech (4.3), irony and humour
 * (4.4), apostrophe functions (4.5) — using fresh written comic-strip dialogue as
 * context_text, a different family scenario (DESIGN-UNI-01). 4.2 is body-language
 * (visual-dependent) and skipped for practice; aiExplanation covers all of 4.1–4.5.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p1-q4.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p1-q4.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p1-q4.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p1/q4';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 4: Media',
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p1',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['cartoons', 'media_analysis', 'irony', 'punctuation'],
  question_image_urls: [`${BASE}/question_1.png`],
  memo_image_urls: [`${BASE}/memo_1.png`],
  exam_question_marks: 10,
  supplementary_materials: [
    { type: 'annexure', label: 'Text F', image_urls: [`${BASE}/annexure_text_f_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 1',
    order: 1,
    context_text: "In the first frame of a comic strip, Naledi stands in front of her mother, staring at her shoes and holding out a small box. Naledi: 'Um … Mom? I, er … I got you something.'",
    question: "What is Naledi's attitude towards her mother in this frame?",
    metadata: ['defiant', 'indifferent', 'bashful', 'boastful', ''],
    answer: ['bashful', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'comprehension',
    topic: 'tone_and_mood',
    subtopic: 'attitude_from_diction',
    skills: ['infer_speaker_attitude', 'infer_from_dialogue'],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Notice the hesitations ('Um', 'er') in her speech.\n- Her eyes are on her shoes rather than on her mother.",
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 2',
    order: 2,
    context_text: "FRAME 2 – Naledi: 'It's a scarf …' FRAME 3 – Naledi: '… that I knitted …' FRAME 4 – Naledi: '… by hand …' FRAME 5 – Naledi: '… after watching forty online tutorials.'",
    question: "Why does the cartoonist spread Naledi's sentence across four frames?",
    metadata: [
      'To show that Naledi cannot remember what she wanted to say.',
      'To fill space because the gift itself is unimportant.',
      'To show that her mother keeps interrupting her.',
      'To build suspense and stress her effort, leading to a humorous climax.',
      '',
    ],
    answer: ['To build suspense and stress her effort, leading to a humorous climax.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'comprehension',
    topic: 'inferential_reading',
    subtopic: 'purpose_of_detail',
    skills: ['evaluate_authorial_choice'],
    difficulty: 3,
    exam_weight: 2,
    clues: '- Each frame reveals a little more about how the gift was made.\n- Consider how delaying the last detail affects the reader.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 3',
    order: 3,
    context_text: "FRAME 1 – Mother (flatly, looking at a lopsided cake): 'Oh … a cake. How lovely.' FRAME 2 – Son: 'I baked it myself. And I cleaned the whole kitchen afterwards.' FRAME 3 – Mother (throwing her arms in the air with joy): 'Best birthday present EVER!'",
    question: 'Select the TWO statements that explain how irony creates humour in this comic strip.',
    metadata: [
      "The mother's polite words in Frame 1 hide her lack of enthusiasm for the cake.",
      'The son is angry that his mother does not like the cake.',
      'The mother is thrilled by the clean kitchen, not by the cake that was meant to be the gift.',
      'The cake is described as perfectly made, which contradicts the drawing.',
      'The mother dislikes birthdays and refuses to celebrate them.',
    ],
    answer: [
      "The mother's polite words in Frame 1 hide her lack of enthusiasm for the cake.",
      'The mother is thrilled by the clean kitchen, not by the cake that was meant to be the gift.',
      '',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'comprehension',
    topic: 'figurative_language',
    subtopic: 'irony_and_humour',
    skills: ['identify_irony', 'explain_effect'],
    difficulty: 4,
    exam_weight: 3,
    clues: "- Irony arises when what is said or expected differs from what is meant or what happens.\n- Compare the mother's reaction in Frame 1 with her reaction in Frame 3, and ask what really caused the change.",
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 4',
    order: 4,
    context_text: null,
    question: "Match each word from a comic strip's speech bubbles to the function of its apostrophe.",
    metadata: [
      "A - GRANDMA'S (in 'Grandma's birthday')",
      "B - WE'RE (in 'We're late!')",
      "C - P'S (in 'Mind your p's and q's')",
      '1 - Shows that letters have been left out',
      '2 - Shows ownership',
      '3 - Forms the plural of a lowercase letter',
    ],
    answer: ['A-2', 'B-1', 'C-3'],
    presentation: 'match',
    type: 'definition',
    unit: 'language',
    topic: 'punctuation',
    subtopic: 'apostrophe_function',
    skills: ['identify_punctuation_function'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- Try expanding each word into its full form to see if anything is missing.\n- Ask whether something belongs to someone.',
  },
];

// ─── AI explanation — real exam sub-questions 4.1–4.5 (AIEXP-08) ─────────────

const aiExplanation = {
  sub_questions: [
    {
      number: '4.1',
      marks: 1,
      clues: "- Look at Jeremy's posture and how he speaks to his father in FRAME 1.\n- One adjective describing his attitude is enough.",
      approach: "- Study Jeremy's body language and expression in FRAME 1\n- Choose one adjective that fits it",
      solution: '1. Jeremy appears hesitant, nervous, uncertain or sheepish; respectful, cautious or humble are also accepted.\n2. Any one valid adjective that fits the frame earns the mark.',
    },
    {
      number: '4.2',
      marks: 2,
      clues: '- Look at how the parents are sitting in FRAME 1.\n- Notice where the mother has placed her arm.',
      approach: '- Describe the relationship in one word (1 mark)\n- Support it with a detail of their body language (1 mark)',
      solution: "1. The parents have an affectionate, loving and close relationship (1 mark).\n2. They sit comfortably and cosily on the same chair, with the mother's arm around her husband's shoulder (1 mark).",
    },
    {
      number: '4.3',
      marks: 2,
      clues: "- Jeremy's single sentence is stretched from FRAME 2 to FRAME 5.\n- Think about what each added phrase reveals about the gift.",
      approach: '- Note that the speech is extended across four frames\n- Explain what this exaggerates and how it builds towards a climax',
      solution: "1. The cartoonist stretches Jeremy's speech from FRAME 2 to FRAME 5 to exaggerate the effort he made to get the gift.\n2. This builds up to a climax: the reveal that he paid with money from his first real job.",
    },
    {
      number: '4.4',
      marks: 3,
      clues: "- Compare the father's reaction in FRAME 3 with his reaction in FRAME 5.\n- Consider what FRAME 6 says actually 'counts'.",
      approach: "- Describe the father's mild reaction to the gift in FRAME 3\n- Contrast it with his joy in FRAME 5 when he hears about the job\n- Explain the irony and the tongue-in-cheek line in FRAME 6",
      solution: "1. In FRAME 3 the father is only mildly pleased with an ordinary Father's Day gift.\n2. In FRAME 5 he is overjoyed, but because his son has matured enough to hold a job, not because of the gift. It is ironic that the job pleases him far more than the present.\n3. The tongue-in-cheek line 'CONTEXT THAT COUNTS' in FRAME 6 shows how cleverly Jeremy has manipulated his father. Full marks need a critical discussion.",
    },
    {
      number: '4.5',
      marks: 2,
      clues: "- Find one word with an apostrophe in FRAME 1 and one in FRAME 2.\n- Ask whether each shows belonging or missing letters.",
      approach: "- Identify the apostrophe word in each frame\n- Name the function for each one",
      solution: "1. FRAME 1: 'FATHER'S' uses the apostrophe to show possession (the day belongs to fathers).\n2. FRAME 2: 'IT'S' uses the apostrophe to show a contraction, where the letter 'i' of 'it is' is omitted.",
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
