#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 5 (order 5)
 * Unseen poetry: Philip Larkin's 'The Trees' — renewal, ageing, metaphor and hopeful tone.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q5.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q5.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q5.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q5';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 5: The Trees",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: null,
  tags: ["unseen_poetry","contextual_questions","figurative_language","tone_and_mood"],
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
    text_key: null,
    context_text: null,
    question: "Select the TWO phrases from 'The Trees' that suggest new life beginning.",
    metadata: ["'a kind of grief'","'coming into leaf'","'rings of grain'","'The recent buds'","'we grow old'"],
    answer: ["'coming into leaf'","'The recent buds'","","",""],
    presentation: "multi_select",
    type: "application",
    unit: "poetry",
    topic: "figurative_language",
    subtopic: "contextual_word_meaning",
    skills: ["vocabulary_in_context"],
    difficulty: 1,
    exam_weight: 1,
    clues: "- Which phrases describe growth that has only just started?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 2",
    order: 2,
    text_key: null,
    context_text: null,
    question: "'Their greenness is a kind of grief.' What attitude towards the trees does this line convey?",
    metadata: ["A melancholy attitude: even the fresh green of spring reminds the speaker of loss, because renewal highlights human ageing.","Pure delight in the bright colour of the leaves.","Indifference, because the speaker barely notices the trees.","Anger that the trees are blocking the view.",""],
    answer: ["A melancholy attitude: even the fresh green of spring reminds the speaker of loss, because renewal highlights human ageing.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "tone_and_mood",
    subtopic: "speaker_attitude",
    skills: ["infer_speaker_attitude"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- Green usually suggests life and freshness. Why would it cause grief?\n- Read the next stanza: who grows old?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 3",
    order: 3,
    text_key: null,
    context_text: null,
    question: "Identify the figure of speech in 'Like something almost being said'.",
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
    clues: "- Look at the first word of the line.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 4",
    order: 4,
    text_key: null,
    context_text: null,
    question: "'Their yearly trick of looking new / Is written down in rings of grain.' Discuss the effectiveness of this image.",
    metadata: ["It shows that the trees are magical and can perform tricks for people.","Calling renewal a 'trick' suggests the trees only appear young; the growth rings record their true age, so they too are ageing and will die.","It suggests that someone has carved writing into the bark of the trees.","It proves that trees never age, because they look new every year.",""],
    answer: ["Calling renewal a 'trick' suggests the trees only appear young; the growth rings record their true age, so they too are ageing and will die.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "figurative_language",
    subtopic: "metaphor_interpretation",
    skills: ["evaluate_figurative_language"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- A trick is a deception: what is the deception here?\n- What do the rings inside a tree trunk record?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 5",
    order: 5,
    text_key: null,
    context_text: null,
    question: "Which word best describes the tone of 'No, they die too.'?",
    metadata: ["Triumphant","Playful","Furious","Resigned",""],
    answer: ["Resigned","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "tone_and_mood",
    subtopic: "tone_identification",
    skills: ["identify_tone"],
    difficulty: 2,
    exam_weight: 1,
    clues: "- The speaker answers his own question with a plain fact.\n- How does someone sound when accepting something they cannot change?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 6",
    order: 6,
    text_key: null,
    context_text: null,
    question: "The final stanza of 'The Trees' begins with the word 'Yet'. What is the effect of this word?",
    metadata: ["It introduces a list of the different kinds of trees.","It shows that the speaker has changed the subject to castles.","It signals a turn: despite knowing that the trees age and die, the speaker notices their unstoppable yearly renewal, shifting the poem towards hope.","It confirms that the poem will end in complete despair.",""],
    answer: ["It signals a turn: despite knowing that the trees age and die, the speaker notices their unstoppable yearly renewal, shifting the poem towards hope.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "poetry",
    topic: "theme_identification",
    subtopic: "contrast_in_poetry",
    skills: ["analyse_structure"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- 'Yet' is a contrasting conjunction.\n- Compare the mood of stanza 2 with that of stanza 3.",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "5.1",
      marks: 2,
      clues: "- Picture a tight bud slowly opening.\n- Does the phrase suggest effort or ease?",
      approach: "- Explain what happens to the buds (they open and unfold)\n- Add the sense of ease and natural progression",
      solution: "1. 'Relax and spread' suggests the buds are opening to reveal new growth, blossoming out of their tightly bound state into fully unfurled leaves.\n2. It conveys a sense of ease and natural progression as the buds unfold.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "5.2",
      marks: 2,
      clues: "- The speaker compares the trees, which are 'born again', with people, who 'grow old'.\n- How might someone feel about a thing that renews itself when they cannot?",
      approach: "- Name an attitude (1 mark)\n- Explain it through the contrast between renewal and human ageing (1 mark)",
      solution: "1. The speaker may be envious, indignant, resentful or admiring towards the trees.\n2. The trees seem superior because they renew themselves every year and hide the effects of ageing, whereas people simply grow older.\n3. 1 mark for the attitude, 1 for the explanation.",
    },
    {
      number: "5.3.1",
      marks: 1,
      clues: "- The trees are called 'castles' and are said to 'thresh'.",
      approach: "- Identify the direct comparison or human action\n- Name the device",
      solution: "1. Metaphor (personification is also accepted).",
    },
    {
      number: "5.3.2",
      marks: 2,
      clues: "- What are castles like? What does 'unresting' add?\n- 'Thresh' suggests vigorous movement.",
      approach: "- Explain the castle comparison (thick, strong, imposing, fortified)\n- Explain why it is effective (majestic, unceasing renewal and resilience)",
      solution: "1. The trees' growth is a continuous cycle of strenuous work, suggested by 'unresting' and 'thresh'; like castles they grow thick, strong and imposing, fortified by their yearly growth.\n2. The image effectively evokes their majestic, unceasing renewal and their resilience against the destructive effects of time.",
    },
    {
      number: "5.4.1",
      marks: 1,
      clues: "- 'Begin afresh' is encouragement. How does it sound?",
      approach: "- Name one tone word",
      solution: "1. Positive, optimistic, encouraging or hopeful.",
    },
    {
      number: "5.4.2",
      marks: 2,
      clues: "- Line 11 says 'Last year is dead'. What does line 12 answer to that?\n- What does repeating a word three times do to its force?",
      approach: "- Explain what the repetition reinforces (resilience, renewal)\n- Link it to the contrast with death and short lives (critical discussion required)",
      solution: "1. The repetition of 'afresh' reinforces the resilience of all living things in contrast with their short lives.\n2. The natural world accepts renewal despite death: every end is an opportunity to begin again.\n3. The 2 marks are awarded only for a critical discussion.",
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
