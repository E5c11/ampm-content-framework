#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 2 (order 2)
 * Contextual questions on Wordsworth's sonnet: setting, the nun simile, personification of the sea, and the speaker's realisation about the child.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q2.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q2.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q2.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q2';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 2: It is a Beauteous Evening, Calm and Free",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "it_is_a_beauteous_evening",
  tags: ["contextual_questions","figurative_language","imagery","tone_and_mood"],
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
    text_key: "it_is_a_beauteous_evening",
    context_text: null,
    question: "In 'It is a Beauteous Evening, Calm and Free', what do the words 'the broad sun / Is sinking down' suggest about the setting?",
    metadata: ["A storm is approaching and the light is fading dangerously.","It is early morning and the day is only beginning.","It is sunset, and the slow descent of the wide sun adds to the calm, unhurried atmosphere of the evening.","The sun is so hot that the speaker and the child must look for shelter.",""],
    answer: ["It is sunset, and the slow descent of the wide sun adds to the calm, unhurried atmosphere of the evening.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "imagery",
    subtopic: "setting_imagery",
    skills: ["interpret_diction"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- When does the sun sink?\n- Does 'sinking down' sound sudden or gradual?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 2",
    order: 2,
    text_key: "it_is_a_beauteous_evening",
    context_text: null,
    question: "Account for the phrase 'Breathless with adoration' in the speaker's description of the evening.",
    metadata: ["The speaker is out of breath after a long walk along the beach with the child.","Like a worshipper silent with awe, the evening seems to hold its breath in reverence, stressing the holiness and stillness of the moment.","The evening is frightening, leaving the speaker unable to breathe.","It suggests that the wind is strong and noisy along the shore.",""],
    answer: ["Like a worshipper silent with awe, the evening seems to hold its breath in reverence, stressing the holiness and stillness of the moment.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "figurative_language",
    subtopic: "personification_effect",
    skills: ["explain_figurative_meaning"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- 'Adoration' is a religious word: who adores, and whom?\n- What does holding your breath suggest about how still something is?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 3",
    order: 3,
    text_key: "it_is_a_beauteous_evening",
    context_text: null,
    question: "Identify the figure of speech in 'The holy time is quiet as a nun'.",
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
    clues: "- Look for a comparison word such as 'like' or 'as'.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 4",
    order: 4,
    text_key: "it_is_a_beauteous_evening",
    context_text: null,
    question: "'The gentleness of heaven is on the sea'. Discuss the effectiveness of this image.",
    metadata: ["It warns that the sea is dangerous and should be avoided at night.","It is effective because it describes the exact colour of the water at sunset.","It suggests that heaven is far away and has no link with the earth.","It presents the calm sea as if touched by heaven itself, suggesting that God's peaceful presence rests over the natural world.",""],
    answer: ["It presents the calm sea as if touched by heaven itself, suggesting that God's peaceful presence rests over the natural world.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "figurative_language",
    subtopic: "imagery_effect",
    skills: ["evaluate_figurative_language"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- What quality does 'gentleness' give the sea?\n- The poem is full of religious words — how does 'heaven' fit that pattern?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 5",
    order: 5,
    text_key: "it_is_a_beauteous_evening",
    context_text: null,
    question: "In the sestet, the speaker realises that the child is close to God even when she seems unmoved by the scene. Select the THREE words or phrases from the sestet that best support this realisation.",
    metadata: ["'walkest with me here'","'divine'","'solemn thought'","'worshipp'st at the Temple's inner shrine'","'Abraham's bosom'"],
    answer: ["'divine'","'worshipp'st at the Temple's inner shrine'","'Abraham's bosom'","",""],
    presentation: "multi_select",
    type: "application",
    unit: "poetry",
    topic: "figurative_language",
    subtopic: "connotative_diction",
    skills: ["analyse_diction"],
    difficulty: 4,
    exam_weight: 3,
    clues: "- Choose words that describe the child's spiritual state, not the adult's.\n- 'Solemn thought' describes what the child does NOT appear to have.",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "2.1",
      marks: 2,
      clues: "- 'Tranquillity' is a synonym for calm and peace.\n- Look at what the sea and the setting sun are doing in the octave.",
      approach: "- Define the word in context\n- Link it to details of the setting (sea, sinking sun)\n- Make two distinct points",
      solution: "1. 'Tranquillity' conveys the calm, peaceful quality of the evening.\n2. Nature seems harmonious and serene, reflected in the still sea and the slowly setting sun; time appears to slow down, creating a quiet, meditative setting.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "2.2",
      marks: 2,
      clues: "- What does a nun devote her life to?\n- Think about how a nun behaves at evening prayers.",
      approach: "- Identify the qualities of a nun (devotion, quiet adoration)\n- Link these to the speaker's feeling of awe at the evening\n- Show that both sense God's presence",
      solution: "1. A nun is consumed by devotion to and worship of God, quiet and adoring at evening prayer.\n2. The speaker links this quality to his own awe at the beauty of nature at this time of day: just as a nun feels God's presence, so does he as he appreciates the wonders around him.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "2.3.1",
      marks: 1,
      clues: "- 'The mighty Being' is the sea (and God within it). Can the sea literally be awake?",
      approach: "- Check whether a non-human thing is given a human quality\n- Name the device",
      solution: "1. Personification: the sea/mighty Being is described as being awake, a human quality.",
    },
    {
      number: "2.3.2",
      marks: 2,
      clues: "- The 'eternal motion' is the ebb and flow of the tide.\n- What does the sound 'like thunder' suggest about power?",
      approach: "- Explain what the sea image represents (God's presence in nature)\n- Link 'thunder' to power and 'eternal'/'everlastingly' to permanence\n- Say why the comparison is effective",
      solution: "1. The image of the sea alludes to God's presence in nature; the constant ebb and flow of the tides shows His involvement in all living things.\n2. The thunderous sound of the waves suggests God's power, while the vast, endless ocean implies His constant presence and omnipotence.\n3. The comparison effectively presents a 'mighty' God who is ever-present, everlasting and all-powerful.",
    },
    {
      number: "2.4",
      marks: 3,
      clues: "- The sestet begins 'Dear child! dear girl!'.\n- Compare the adult's 'solemn thought' with the child who seems 'untouched' by it.",
      approach: "- Quote TWO pieces of diction from lines 9–14 (1 mark)\n- Explain the realisation: the child is naturally and constantly close to God, unlike the adult\n- Show the speaker's longing for that closeness (2 marks for critical discussion)",
      solution: "1. The speaker realises that, unlike his conscious awareness ('solemn thought') of God in nature, his daughter is instinctively in tune with God.\n2. As a child she is naturally close ('dear') to God; she seems 'untouched' by the scenery because closeness to God is an everyday state for her. She 'worshipp'st at the Temple's inner shrine' and lies in 'Abraham's bosom', a state of constant blessedness, with 'God being with thee when we know it not'.\n3. He acknowledges that children have a direct access to God that adults lack, and longs for the same connection. 1 mark for diction, 2 for the discussion.",
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
