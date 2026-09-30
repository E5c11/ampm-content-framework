#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 1 (order 1)
 * Essay on 'Solitude' (Ella Wheeler Wilcox): despite moments of connection, people are ultimately alone (imagery, structure, tone).
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q1.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q1.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q1';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 1: Poetry — Essay",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "solitude",
  tags: ["poetry_essay","literary_essay","imagery","structural_techniques","tone_and_mood"],
  question_image_urls: [`${BASE}/question_1.png`],
  memo_image_urls: [`${BASE}/memo_1.png`, `${BASE}/memo_2.png`],
  exam_question_marks: 10,
  supplementary_materials: null,
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
    text_key: "solitude",
    context_text: null,
    question: "In 'Solitude', the speaker repeatedly pairs a joyful action with a sorrowful one: 'Laugh' with 'Weep', 'Sing' with 'Sigh', and 'Feast' with 'Fast'. What is the main effect of this structural pattern?",
    metadata: ["It shows that the speaker values sorrow more highly than happiness.","Each pairing sets a shared, joyful experience against a lonely, sorrowful one, reinforcing that grief isolates a person.","It creates a cheerful, sing-song rhythm that lightens the mood of the whole poem.","It suggests that joy and sorrow are always experienced together in a group.",""],
    answer: ["Each pairing sets a shared, joyful experience against a lonely, sorrowful one, reinforcing that grief isolates a person.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "theme_identification",
    subtopic: "contrast_in_poetry",
    skills: ["analyse_structure","explain_effect"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Look at what happens to the person in the first half of each pair, then in the second half.\n- Ask who is present in each half.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 2",
    order: 2,
    text_key: "solitude",
    context_text: null,
    question: "Select the THREE lines from 'Solitude' that show people abandoning someone who is suffering.",
    metadata: ["'Feast, and your halls are crowded'","'Grieve, and they turn and go'","'Sing, and the hills will answer'","'Be sad, and you lose them all'","'Fast, and the world goes by'"],
    answer: ["'Grieve, and they turn and go'","'Be sad, and you lose them all'","'Fast, and the world goes by'","",""],
    presentation: "multi_select",
    type: "application",
    unit: "poetry",
    topic: "figurative_language",
    subtopic: "imagery_effect",
    skills: ["analyse_imagery"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Find the lines describing sorrow, not joy.\n- In each, what do other people (or the world) do?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 3",
    order: 3,
    text_key: "solitude",
    context_text: null,
    question: "Which description best captures the tone of the final four lines of 'Solitude' ('For there is room in the halls of pleasure … Through the narrow aisles of pain')?",
    metadata: ["Joyful and celebratory, because the halls of pleasure have room for everyone.","Angry and accusing, because the speaker blames the reader for abandoning others.","Hopeful, because the narrow aisles lead back to a crowded hall of friends.","Sombre and resigned: the speaker accepts that everyone must finally face suffering and death alone.",""],
    answer: ["Sombre and resigned: the speaker accepts that everyone must finally face suffering and death alone.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "tone_and_mood",
    subtopic: "tone_analysis",
    skills: ["identify_tone"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Contrast the 'large and lordly train' with 'one by one'.\n- How does the speaker feel about something that cannot be avoided?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 4",
    order: 4,
    text_key: "solitude",
    context_text: null,
    question: "'There are none to decline your nectared wine, / But alone you must drink life's gall.' What does the contrast between 'nectared wine' and 'gall' convey?",
    metadata: ["Wine is a sign of wealth, so the speaker is warning readers against greed.","Nobody will drink with a person who is happy and successful.","Others eagerly share a person's sweetness and good fortune, but bitterness and suffering must be endured alone.","The speaker simply prefers bitter drinks to sweet ones.",""],
    answer: ["Others eagerly share a person's sweetness and good fortune, but bitterness and suffering must be endured alone.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "figurative_language",
    subtopic: "connotative_diction",
    skills: ["explain_connotation"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- 'Nectar' is the sweet drink of the gods; 'gall' is proverbially bitter.\n- Notice who drinks each one.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 5",
    order: 5,
    text_key: "solitude",
    context_text: null,
    question: "Arrange these elements into a logical order for a 250–300-word essay arguing that, in 'Solitude', people are ultimately alone despite moments of connection.",
    metadata: ["Analyse images of celebration versus isolation (imagery)","Conclusion: restate the stance, linking it to the poem's final image","Introduction: take a clear stance on the statement","Discuss the resigned, reflective tone of the poem's ending","Discuss the contrasting pairs of actions in each stanza (structure)"],
    answer: ["Introduction: take a clear stance on the statement","Discuss the contrasting pairs of actions in each stanza (structure)","Analyse images of celebration versus isolation (imagery)","Discuss the resigned, reflective tone of the poem's ending","Conclusion: restate the stance, linking it to the poem's final image"],
    presentation: "ordering",
    type: "application",
    unit: "poetry",
    topic: "literary_essay",
    subtopic: "essay_argument_structure",
    skills: ["sequence_essay_elements"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- An essay opens with a stance and closes by returning to it.\n- The body can follow the order the question lists: imagery, structure, tone — or the order of the poem.",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "1",
      marks: 10,
      clues: "- The statement has two parts: 'moments of connection' and 'ultimately alone'. Your essay must address both.\n- The question names three aspects: imagery, structure and tone. Each needs its own evidence.\n- Look at what the world does when you laugh, sing or feast, and what it does when you weep, sigh or fast.",
      approach: "- Take a stance (the memo expects agreement) in a short introduction\n- Structure: show how every stanza pairs a shared joy with a solitary sorrow, and how the indented lines stress isolation\n- Imagery: the hills echoing song but not sighs, friends who 'turn and go', the 'nectared wine' versus 'life's gall', the 'narrow aisles of pain'\n- Tone: reflective and melancholic, ending in resigned acceptance (or critical of people's shallowness); conclude by linking back to the statement",
      solution: "1. The poem presents the paradox that human connection is conditional and fleeting while isolation is permanent: joy draws people in, but sorrow is faced alone.\n2. Imagery: the earth 'has trouble enough of its own' and the hills echo singing but not sighing, so the world is indifferent to grief. Friends 'seek you' in good times but 'turn and go' when you grieve; they want 'full measure of all your pleasure' but not your 'woe'. Feasting fills the halls, fasting leaves you alone, and the final image of filing 'one by one' through 'the narrow aisles of pain' shows that everyone must die alone.\n3. Structure: each stanza is built from contrasting pairs of actions, alternating communal joy with solitary sorrow, and the indented lines draw attention to the isolating half; rhythm and rhyme support the mood.\n4. Tone: reflective, contemplative and melancholic, ending in a sombre, resigned acceptance that sorrow is a personal journey; a critical or satirical reading of people's selfishness is also credited.\n5. The essay is marked with the poetry rubric: 6 marks for content (interpretation and evidence) and 4 for structure and language, in 250–300 words.",
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
