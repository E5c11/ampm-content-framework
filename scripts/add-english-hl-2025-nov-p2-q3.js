#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 3 (order 3)
 * Contextual questions on Jofre Rocha's 'Poem of Return': the exile's feelings, repetition, metaphor and shifting tone.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q3.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q3.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q3.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q3';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 3: Poem of Return",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "poem_of_return",
  tags: ["contextual_questions","figurative_language","political_resistance","tone_and_mood"],
  question_image_urls: [`${BASE}/question_1.png`],
  memo_image_urls: [`${BASE}/memo_1.png`],
  exam_question_marks: 10,
  supplementary_materials: [
    { type: 'annexure', label: "Poem", image_urls: [`${BASE}/annexure_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 1",
    order: 1,
    text_key: "poem_of_return",
    context_text: null,
    question: "In 'Poem of Return', the speaker describes his time away as spent in 'the land of exile and silence'. What does this phrase suggest about his experience abroad?",
    metadata: ["He enjoyed a peaceful holiday in a quiet foreign country.","He chose to leave because he prefers silence to conversation.","He was imprisoned inside his own home during the struggle.","He was forced away from home and cut off from his people, so his time away felt lonely and voiceless.",""],
    answer: ["He was forced away from home and cut off from his people, so his time away felt lonely and voiceless.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "figurative_language",
    subtopic: "connotative_diction",
    skills: ["interpret_diction"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- 'Exile' means being sent away or kept away from one's homeland.\n- What might 'silence' suggest about contact with home, or freedom to speak?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 2",
    order: 2,
    text_key: "poem_of_return",
    context_text: null,
    question: "The line 'When I return from the land of exile and silence' appears twice in the poem. What is the effect of repeating it?",
    metadata: ["It shows that the speaker has forgotten what he has already said.","It indicates that the speaker has returned home many times before.","It stresses how central the homecoming is to the speaker and frames his insistence on what he truly wants to receive.","It creates a cheerful chorus to celebrate his arrival.",""],
    answer: ["It stresses how central the homecoming is to the speaker and frames his insistence on what he truly wants to receive.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "theme_identification",
    subtopic: "parallel_structure",
    skills: ["explain_effect"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- What request follows the line each time?\n- Repetition often emphasises what matters most to a speaker.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 3",
    order: 3,
    text_key: "poem_of_return",
    context_text: null,
    question: "Identify the figure of speech in 'tears of dawns which witnessed dramas'.",
    metadata: ["Figure of speech:","[ ]"],
    answer: ["Personification|Metaphor","","","",""],
    presentation: "fitb",
    type: "definition",
    unit: "poetry",
    topic: "poetic_devices",
    subtopic: "device_identification",
    skills: ["identify_figurative_device"],
    difficulty: 2,
    exam_weight: 1,
    clues: "- Can a dawn cry or watch events?\n- Which device gives human actions to non-human things?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 4",
    order: 4,
    text_key: "poem_of_return",
    context_text: null,
    question: "'with mothers mourning, their arms bereft of sons'. Discuss the effectiveness of this image.",
    metadata: ["It shows that the mothers are tired after carrying heavy loads.","The picture of empty arms makes the loss physical and visible, conveying the grief of families whose sons died in the struggle.","It suggests that the sons have simply moved to another town to find work.","It is effective because it celebrates the joy of a family reunion.",""],
    answer: ["The picture of empty arms makes the loss physical and visible, conveying the grief of families whose sons died in the struggle.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "figurative_language",
    subtopic: "imagery_effect",
    skills: ["analyse_imagery"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- 'Bereft' means deprived of something precious.\n- What would a mother's arms normally hold?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 5",
    order: 5,
    text_key: "poem_of_return",
    context_text: null,
    question: "Match each quotation from 'Poem of Return' to the tone it creates.",
    metadata: ["A - 'do not bring me flowers'","B - 'with mothers mourning, their arms bereft of sons'","C - 'a thread of anger snaking from their eyes'","1 - Defiant and threatening","2 - Firm and commanding","3 - Sorrowful and regretful"],
    answer: ["A-2","B-3","C-1"],
    presentation: "match",
    type: "application",
    unit: "poetry",
    topic: "tone_and_mood",
    subtopic: "tone_analysis",
    skills: ["identify_tone"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- A command sounds different from an image of grief.\n- Which image hints at future resistance?",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "3.1",
      marks: 2,
      clues: "- Focus on the word 'return' in the title.\n- The question wants a feeling AND the reason for it.",
      approach: "- Name one feeling suggested by the title\n- Give the reason: exile from home during a struggle for freedom\n- 1 mark for the feeling, 1 for the reason",
      solution: "1. 'Return' suggests the speaker is homesick and longing, eager or determined to go back to his home country.\n2. Reasons credited: the poem reflects the loneliness of exile, his expectations of homecoming, or his guilt at being away while his country fought for freedom.\n3. 1 mark for the feeling and 1 for the reason.",
    },
    {
      number: "3.2",
      marks: 2,
      clues: "- List what the speaker asks to be brought instead of flowers.\n- Why would someone who was absent want these things?",
      approach: "- Say what the repetition emphasises (what he really wants, not praise)\n- Link it to his guilt at being absent and his wish to acknowledge others' suffering",
      solution: "1. The repetition of 'Bring me' emphasises what the speaker actually wants rather than praise and recognition.\n2. His guilt at not being present during the struggle drives him to acknowledge the pain, suffering and deprivation of those who remained.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "3.3.1",
      marks: 1,
      clues: "- Anger is described as something that snakes. Is there a comparison word?",
      approach: "- Check for like/as\n- Name the device",
      solution: "1. Metaphor: anger is described as a thread that snakes, with no 'like' or 'as'.",
    },
    {
      number: "3.3.2",
      marks: 2,
      clues: "- What qualities does a snake have?\n- A thread connects things: who is connected to whom?",
      approach: "- Explain what the snake suggests about the heroes' anger\n- Link it to the effect of their deaths on those left behind",
      solution: "1. The men's anger transforms into a snake, which effectively conveys the danger their deaths will generate: like snake venom, their deaths will spark anger in those left behind.\n2. This anger will inspire others to continue the struggle for freedom, and the 'thread of anger' connects the fallen to the fighters who will demand justice on their behalf.",
    },
    {
      number: "3.4",
      marks: 3,
      clues: "- Track the tone at the start, in the middle and at the end.\n- Watch for commands, then images of mourning, then images of fallen heroes.",
      approach: "- Identify the opening tone (imperative) with evidence\n- Identify the middle tone (melancholic/regretful) with evidence\n- Identify the closing tone (defiant/angry) and discuss the change",
      solution: "1. The poem opens with an imperative tone in the command 'do not bring me flowers' and the repeated statements of what he actually wants.\n2. It becomes melancholic, sad or regretful as he recognises the 'mourning', suffering and loss his compatriots endured while he was in exile.\n3. It ends defiant and angry in the description of the fallen 'heroes', ominously suggesting an imminent uprising. 2 marks for two tones, 1 for the critical discussion.",
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
