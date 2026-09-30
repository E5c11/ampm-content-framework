#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 9 (Part 2) (order 11)
 * Extract D (Chapter 92): Pi discovers the truth about the algae island.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q9-2.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q9-2.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q9-2.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q11';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 9 (Part 2): Life of Pi — Extract D",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "life_of_pi",
  tags: ["contextual_questions","survival","faith","symbolism"],
  question_image_urls: [`${BASE}/question_1.png`, `${BASE}/question_2.png`],
  memo_image_urls: [`${BASE}/memo_1.png`, `${BASE}/memo_2.png`],
  exam_question_marks: 13,
  supplementary_materials: [
    { type: 'annexure', label: "Extract D", image_urls: [`${BASE}/annexure_d_1.png`] },
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
    text_key: "life_of_pi",
    context_text: null,
    question: "Arrange these events from Pi's time at sea in the order in which they occur.",
    metadata: ["Pi finds human teeth inside a fruit","The lifeboat reaches the coast of Mexico","Pi meets a blind Frenchman in another lifeboat","Pi leaves the island with Richard Parker","Pi and Richard Parker land on the algae island"],
    answer: ["Pi meets a blind Frenchman in another lifeboat","Pi and Richard Parker land on the algae island","Pi finds human teeth inside a fruit","Pi leaves the island with Richard Parker","The lifeboat reaches the coast of Mexico"],
    presentation: "ordering",
    type: "application",
    unit: "novel",
    topic: "plot_structure",
    subtopic: "scene_context",
    skills: ["place_in_context"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Pi is blind when he meets the Frenchman.\n- The teeth make him decide to leave.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 2",
    order: 2,
    text_key: "life_of_pi",
    context_text: null,
    question: "On the algae island Pi finds fresh water, endless food and safety from the sea. Why is this apparent paradise ironic?",
    metadata: ["It is ironic because the algae island is the very first land that Pi has seen since the ship sank.","It is ironic because Richard Parker refuses to leave the lifeboat even when land is reached.","There is no irony: the island is a safe home where Pi could happily have lived for years.","The island that seems to promise survival feeds him by day but would digest him at night.",""],
    answer: ["The island that seems to promise survival feeds him by day but would digest him at night.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "thematic_analysis",
    subtopic: "survival_theme",
    skills: ["identify_irony"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- Irony: the reality is the opposite of the appearance.\n- What happens to the fish in the ponds at night?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 3",
    order: 3,
    text_key: "life_of_pi",
    context_text: null,
    question: "When Pi goes blind from malnutrition and believes he is dying, how is the reader likely to respond to him, and why?",
    metadata: ["With frustration: he has been careless with his food and water, and now suffers the result.","With amusement: the scene is written as light comedy to relieve the tension of the voyage.","With indifference: by this point the reader has stopped caring whether Pi lives or dies.","With deep sympathy: after months of courageous struggle he seems to be losing strength and hope.",""],
    answer: ["With deep sympathy: after months of courageous struggle he seems to be losing strength and hope.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "character_analysis",
    subtopic: "psychological_state",
    skills: ["evaluate_character"],
    difficulty: 2,
    exam_weight: 3,
    clues: "- Consider everything Pi has survived up to this point.\n- What does losing hope mean for a survivor?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 4",
    order: 4,
    text_key: "life_of_pi",
    context_text: null,
    question: "In the second story Pi tells the Japanese investigators, each animal corresponds to a person. Match each animal to the person it represents.",
    metadata: ["A - Orange Juice, the orangutan","B - The zebra","C - The hyena","D - Richard Parker","1 - The Taiwanese sailor","2 - Pi's mother","3 - Pi himself","4 - The cook"],
    answer: ["A-2","B-1","C-4","D-3"],
    presentation: "match",
    type: "application",
    unit: "novel",
    topic: "symbolism",
    subtopic: "character_symbolism",
    skills: ["interpret_symbol"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- The investigators work out the matches themselves.\n- Who survives in both stories?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 5",
    order: 5,
    text_key: "life_of_pi",
    context_text: null,
    question: "'Pi's scientific knowledge is more useful to his survival than his faith.' Which response is the most convincing critical discussion of this statement?",
    metadata: ["Completely valid: Pi abandons all religion once at sea and relies only on the survival manual.","Invalid: Pi knows nothing about animals or science and survives purely through prayer alone.","Partly valid: science helps him tame Richard Parker and find water, but faith keeps him going.","Invalid: Pi is rescued within days, so neither his science nor his faith is ever really tested.",""],
    answer: ["Partly valid: science helps him tame Richard Parker and find water, but faith keeps him going.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "thematic_analysis",
    subtopic: "faith_and_survival",
    skills: ["evaluate_argument"],
    difficulty: 4,
    exam_weight: 3,
    clues: "- Think of practical problems Pi solves with knowledge.\n- Think of what keeps him from despair.",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "9.6",
      marks: 2,
      clues: "- What have Pi and Richard Parker found?\n- What does Pi learn while exploring?",
      approach: "- Describe the island and what it provides\n- State the discovery that it is acidic and carnivorous",
      solution: "1. Pi and Richard Parker have found an island covered in algae and full of meerkats; its resources satisfy their hunger and thirst, and they spend their days exploring.\n2. While exploring, Pi realises that the apparently idyllic island is actually acidic and carnivorous.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "9.7",
      marks: 2,
      clues: "- What does Richard Parker do when they reach Mexico?\n- In the human story, who is Richard Parker?",
      approach: "- State Pi's concern for Richard Parker\n- Contrast it with the tiger's later behaviour (or the human-story reading)",
      solution: "1. Pi is concerned for Richard Parker's well-being and will not leave him on the island.\n2. Yet when they finally reach land and safety, Richard Parker abandons Pi without a backward glance. In the human story, Pi cannot abandon Richard Parker here because that would mean abandoning himself, yet later he must abandon this alter ego to re-enter civilisation.\n3. 2 marks for a clear understanding of irony.",
    },
    {
      number: "9.8",
      marks: 3,
      clues: "- Notice the string of questions in lines 1–6.\n- What do they show about his state of mind?",
      approach: "- State the reader's response (1 mark)\n- Discuss what the questioning shows about Pi's despair (2 marks)",
      solution: "1. The reader feels empathy, pity or sympathy for Pi.\n2. His questioning shows growing despair: after all he has endured he seems to be losing hope, realising that rescue is becoming unlikely and he may never fulfil his dreams; he feels despondent and utterly alone.\n3. 1 mark for the response and 2 for the discussion.",
    },
    {
      number: "9.9",
      marks: 3,
      clues: "- In the animal story, what does Richard Parker give Pi?\n- In the human story, what part of Pi is Richard Parker?",
      approach: "- Discuss one or both stories\n- Show how Richard Parker keeps Pi alive (purpose, companionship, instinct)\n- Make a cogent comment",
      solution: "1. Animal story: Richard Parker gives Pi a purpose and the will to live (he must survive to look after the tiger) and companionship that keeps him from despair; survival depends on connection with others.\n2. Human story: Richard Parker represents Pi's primal instincts and will to survive, letting him commit the savage acts needed to live; by not leaving the tiger behind he shows he still needs that part of himself, and the invention lets him hold onto his humanity.\n3. Full credit is possible with only one story; 3 marks only for a cogent comment.",
    },
    {
      number: "9.10",
      marks: 3,
      clues: "- Where do faith and science each appear in Pi's life?\n- Consider the algae island and the lifeboat.",
      approach: "- Take a stance (the memo expects agreement)\n- Discuss faith (identity, hope, rituals) and science (problem-solving, deductions)\n- Offer a critical discussion",
      solution: "1. AGREE: faith is central to Pi's identity, giving him hope and a reason to live; his pluralistic faith shows open-mindedness, and his rituals on the lifeboat maintain his connection with God. On the algae island he relies on faith rather than succumbing to 'spiritual death'.\n2. His scientific mind guides practical survival, such as solving the lack of fresh water, and lets him deduce the danger of the island.\n3. A cogent 'disagree' is unlikely but is judged on merit; 3 marks only for a critical discussion.",
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
