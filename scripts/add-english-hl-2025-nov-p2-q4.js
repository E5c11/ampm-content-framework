#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 4 (order 4)
 * Contextual questions on Karen Press's 'This Winter Coming': diction, repetition, imagery and tone.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q4.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q4.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q4.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q4';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 4: This Winter Coming",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "this_winter_coming",
  tags: ["contextual_questions","figurative_language","social_commentary","tone_and_mood"],
  question_image_urls: [`${BASE}/question_1.png`, `${BASE}/question_2.png`],
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
    text_key: "this_winter_coming",
    context_text: null,
    question: "Select the TWO words from 'the sea is swollen, churning in broken waves / around the rocks' that most strongly suggest the sea's violent restlessness.",
    metadata: ["'around'","'swollen'","'rocks'","'churning'","'sea'"],
    answer: ["'swollen'","'churning'","","",""],
    presentation: "multi_select",
    type: "application",
    unit: "poetry",
    topic: "figurative_language",
    subtopic: "connotative_diction",
    skills: ["interpret_diction"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Look for words that describe movement or pressure, not words that simply name things.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 2",
    order: 2,
    text_key: "this_winter_coming",
    context_text: null,
    question: "The phrase 'pass them, pass them, pass them' repeats the same words three times. What is the effect of this repetition?",
    metadata: ["It shows that the men are racing the cars along the road.","It mimics the endless stream of wealthy cars ignoring the men, stressing their exclusion and the indifference of the privileged.","It suggests that the cars stop to offer the men work.","It creates a happy, musical rhythm to celebrate the city.",""],
    answer: ["It mimics the endless stream of wealthy cars ignoring the men, stressing their exclusion and the indifference of the privileged.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "figurative_language",
    subtopic: "diction_and_effect",
    skills: ["explain_effect"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- Who is passing whom?\n- How does the rhythm imitate the movement it describes?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 3",
    order: 3,
    text_key: "this_winter_coming",
    context_text: null,
    question: "Identify the figure of speech in 'the sky tolling like a black bell'.",
    metadata: ["Figure of speech:","[ ]"],
    answer: ["Simile","","","",""],
    presentation: "fitb",
    type: "definition",
    unit: "poetry",
    topic: "figurative_language",
    subtopic: "simile_identification",
    skills: ["identify_figurative_device"],
    difficulty: 1,
    exam_weight: 1,
    clues: "- Is there a comparison word in the phrase?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 4",
    order: 4,
    text_key: "this_winter_coming",
    context_text: null,
    question: "'old stumps in the rain, tombstones / engraved with open eyes'. Discuss the effectiveness of this image of the men on the street corners.",
    metadata: ["It shows that the men are carpenters waiting to be paid for their woodwork.","It suggests that the men are peacefully resting after a good day of work.","It is effective because it describes the men as tall, strong and full of life.","It presents the unemployed men as cut down and lifeless, yet still watching, conveying their hopeless, deathlike existence and silent resentment.",""],
    answer: ["It presents the unemployed men as cut down and lifeless, yet still watching, conveying their hopeless, deathlike existence and silent resentment.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "figurative_language",
    subtopic: "metaphor_effectiveness",
    skills: ["evaluate_figurative_language"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- What is left when a tree is cut down?\n- Tombstones mark death — why do these ones have open eyes?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 5",
    order: 5,
    text_key: "this_winter_coming",
    context_text: null,
    question: "Refer to 'watching the bright cars full of sated faces'. Which option correctly identifies the tone created by the word 'sated' and explains it?",
    metadata: ["Admiring: 'sated' praises the drivers for their hard work.","Joyful: 'sated' shows that everyone in the city has enough to eat.","Bitter: 'sated' shows that the wealthy are fully fed and content, in harsh contrast to the hungry, neglected men who watch them.","Neutral: 'sated' simply describes the colour of the cars.",""],
    answer: ["Bitter: 'sated' shows that the wealthy are fully fed and content, in harsh contrast to the hungry, neglected men who watch them.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "tone_and_mood",
    subtopic: "tone_analysis",
    skills: ["evaluate_tone"],
    difficulty: 4,
    exam_weight: 3,
    clues: "- 'Sated' means satisfied, full, with appetite completely satisfied.\n- Who is watching the sated faces, and what do they lack?",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "4.1",
      marks: 2,
      clues: "- A shroud is the cloth wrapped around a dead body.\n- What might the sky look like if it is described as a shroud falling?",
      approach: "- Explain what the word shows about the clouds and light\n- Add the ominous, oppressive connotation (political readings credited)",
      solution: "1. 'Shroud' suggests that the rain clouds are widespread, covering a vast area, hiding the light and making visibility poor.\n2. The sky is dark, ominous, heavy and oppressive, appearing to envelop the earth; its link with death adds menace. Allusions to the political climate are credited.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "4.2",
      marks: 2,
      clues: "- The question closes almost every stanza.\n- Who is being asked, and what answer is expected?",
      approach: "- Say what the repetition highlights (the ominous coming storm)\n- Add a second point: everyone will be affected and should be afraid",
      solution: "1. The repetition highlights the ominous nature of the coming storm, emphasising that it should be feared because it promises to be devastating.\n2. It implies that everyone will be affected and that those not yet frightened should be, creating a pervasive feeling of fear. Political readings are credited.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "4.3.1",
      marks: 1,
      clues: "- The children's bodies ARE a raging fire: no 'like' or 'as'. Is it also an exaggeration?",
      approach: "- Check for a direct comparison or exaggeration\n- Name the device",
      solution: "1. Metaphor (hyperbole is also accepted).",
    },
    {
      number: "4.3.2",
      marks: 2,
      clues: "- What drives a fire to 'rage'?\n- Consider the contrast between 'bare bodies' and a powerful fire.",
      approach: "- Explain the comparison (children's anger fuelling resistance)\n- Explain why it is effective (loss of innocence, horror, sacrifice)",
      solution: "1. The children's 'bare bodies' are compared to a 'raging fire', showing how their anger, driven by years of suffering and the deaths of their peers, fuels resistance to oppression.\n2. Despite being vulnerable and hopeless, the children sacrifice their lives to fight apartheid; the image vividly conveys their lost innocence and the horror and tragedy of these conditions.",
    },
    {
      number: "4.4",
      marks: 3,
      clues: "- Look for words about the women, the children and the sky in lines 9–16.\n- 'Tolling' is the sound of a funeral bell.",
      approach: "- Quote TWO examples of diction (1 mark)\n- Name the tone (1 mark)\n- Discuss how the words create it (1 mark)",
      solution: "1. The tone is one of utter despair, sorrow or despondency: the women are 'sad' and the children 'crying', and the world is 'so hungry'.\n2. 'Slow steps' and 'tide of sadness' create hopelessness, while 'tolling', associated with death and 'drown', introduces an ominous, foreboding tone, emphasised by 'will'.\n3. A bitter, resentful tone in 'madam's house is clean' against the poor's harsh conditions is also credited. 1 mark each for diction, tone and discussion.",
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
