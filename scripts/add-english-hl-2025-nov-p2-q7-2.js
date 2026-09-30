#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 7 (Part 2) (order 8)
 * Extract B (Chapter 14): Dorian waits for Alan Campbell after murdering Basil.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q7-2.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q7-2.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q7-2.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q8';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 7 (Part 2): The Picture of Dorian Gray — Extract B",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "dorian_gray",
  tags: ["contextual_questions","character_analysis","guilt","moral_corruption"],
  question_image_urls: [`${BASE}/question_1.png`, `${BASE}/question_2.png`],
  memo_image_urls: [`${BASE}/memo_1.png`, `${BASE}/memo_2.png`],
  exam_question_marks: 13,
  supplementary_materials: [
    { type: 'annexure', label: "Extract B", image_urls: [`${BASE}/annexure_b_1.png`] },
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
    text_key: "dorian_gray",
    context_text: null,
    question: "Arrange these events from Chapters 12 to 14 in the order in which they occur.",
    metadata: ["Dorian murders Basil","Alan Campbell destroys the body","Basil visits Dorian before leaving for Paris","Dorian sends his servant with a letter to Alan Campbell","Dorian shows Basil the portrait"],
    answer: ["Basil visits Dorian before leaving for Paris","Dorian shows Basil the portrait","Dorian murders Basil","Dorian sends his servant with a letter to Alan Campbell","Alan Campbell destroys the body"],
    presentation: "ordering",
    type: "application",
    unit: "novel",
    topic: "plot_structure",
    subtopic: "scene_context",
    skills: ["place_in_context"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- The murder happens in the room where the portrait is kept.\n- Alan is summoned the next morning.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 2",
    order: 2,
    text_key: "dorian_gray",
    context_text: null,
    question: "As Dorian waits, his hands are described as 'curiously cold'. What does this detail imply about Dorian?",
    metadata: ["The house is cold because the servants have not lit the fires, so everyone feels the chill.","His coldness betrays his fear and strain, and hints at the heartlessness of Basil's murder.","Dorian has caught a chill and is becoming ill, which explains why he feels so agitated.","It shows that Dorian is completely calm and in control, with no nerves about Alan's visit.",""],
    answer: ["His coldness betrays his fear and strain, and hints at the heartlessness of Basil's murder.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "figurative_language",
    subtopic: "connotative_diction",
    skills: ["interpret_diction"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- How do hands feel when someone is terrified?\n- 'Cold' can also describe a person's heart.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 3",
    order: 3,
    text_key: "dorian_gray",
    context_text: null,
    question: "Select the TWO details that show Dorian's lack of remorse after murdering Basil.",
    metadata: ["He confesses to the police","He sleeps peacefully through the night","He weeps at Basil's funeral","He dines at Lady Narborough's and charms the guests","He gives his fortune to Basil's family"],
    answer: ["He sleeps peacefully through the night","He dines at Lady Narborough's and charms the guests","","",""],
    presentation: "multi_select",
    type: "application",
    unit: "novel",
    topic: "character_analysis",
    subtopic: "psychological_state",
    skills: ["evaluate_character"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Which details show him carrying on normally?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 4",
    order: 4,
    text_key: "dorian_gray",
    context_text: null,
    question: "Comment on the change in Basil Hallward's attitude towards Dorian by the time of his final visit.",
    metadata: ["Basil has grown as cynical as Lord Henry and now encourages Dorian to indulge every desire.","Basil no longer cares about Dorian and visits only to ask for money before leaving for Paris.","Basil is exactly as admiring as when he painted the portrait and praises Dorian's beauty.","Once idolising Dorian, Basil now confronts him about rumours and begs him to pray and change.",""],
    answer: ["Once idolising Dorian, Basil now confronts him about rumours and begs him to pray and change.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "character_analysis",
    subtopic: "character_relationship",
    skills: ["trace_character_development"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Why does Basil call on Dorian before leaving for Paris?\n- What does Basil ask Dorian to do when he sees the portrait?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 5",
    order: 5,
    text_key: "dorian_gray",
    context_text: null,
    question: "'Dorian's destruction is caused by Lord Henry, not by Dorian himself.' Which response offers the most convincing critical discussion of this statement?",
    metadata: ["Completely valid: Dorian is simply a puppet, and Lord Henry personally makes every single decision on his behalf.","Invalid: Lord Henry meets Dorian only in the final chapter, too late to have any real influence.","Partly valid: Lord Henry awakens his hedonism, but Dorian chooses to wish, reject Sibyl and kill Basil.","Invalid: Basil, not Dorian, commits the crimes, so neither Dorian nor Lord Henry is to blame.",""],
    answer: ["Partly valid: Lord Henry awakens his hedonism, but Dorian chooses to wish, reject Sibyl and kill Basil.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "thematic_analysis",
    subtopic: "novel_moral_argument",
    skills: ["evaluate_argument"],
    difficulty: 4,
    exam_weight: 3,
    clues: "- Weigh Lord Henry's influence against Dorian's own choices.\n- A critical discussion considers both sides before judging.",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "7.6",
      marks: 2,
      clues: "- Who visited Dorian before leaving for Paris, and what happened?\n- Why does Dorian need Alan Campbell?",
      approach: "- Summarise the events leading up to the extract\n- Give two distinct points",
      solution: "1. Before leaving for Paris, Basil visits Dorian to confront him about the rumours he has heard; in a fit of rage, Dorian murders him.\n2. Realising he needs help to dispose of the body, Dorian writes to Alan Campbell and next morning sends his valet to deliver the letter.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "7.7",
      marks: 2,
      clues: "- What is a caged animal unable to do?\n- Why would something beautiful be caged?",
      approach: "- Explain the loss of freedom\n- Link it to his beauty versus his inner turmoil and sins",
      solution: "1. The phrase highlights Dorian's loss of freedom: his beauty remains, but he is trapped by his own sins, actions and paranoia, the consequences of his hedonistic life.\n2. It also objectifies him, contrasting his outward appearance with his inner turmoil.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "7.8",
      marks: 3,
      clues: "- Time 'stops' and his thoughts drag 'a hideous future from its grave'.\n- Do you feel disgust or pity for him?",
      approach: "- State your attitude (1 mark)\n- Discuss it with reference to the lines and his actions (2 marks)",
      solution: "1. The reader may feel revulsion: Dorian is trying to avoid the consequences of murdering Basil and ruining many lives, his depravity is at its lowest point, and he deserves to feel guilty and horrified.\n2. Alternatively, the reader may feel pity: fear of the consequences overwhelms and immobilises him, and he is petrified that his future is ruined.\n3. 1 mark for the attitude and 2 for a well-developed discussion; mixed responses are credited.",
    },
    {
      number: "7.9",
      marks: 3,
      clues: "- What was Alan like when he first knew Dorian?\n- What does Dorian force him to do, and how does Alan end?",
      approach: "- Describe Alan's early talents and reputation\n- Trace his withdrawal, the blackmail and his suicide\n- Link the change to Dorian's corrupting influence",
      solution: "1. Alan Campbell was a former friend of Dorian, a talented chemist and musician, but the association spoiled his reputation and he became withdrawn and dour, giving up music for science.\n2. Blackmailed by Dorian into destroying Basil's body, he compromises his morals and suffers deep internal conflict; the weight of the crime drives him to suicide.\n3. His change shows Dorian's corrupting influence. 3 marks only for a cogent comment.",
    },
    {
      number: "7.10",
      marks: 3,
      clues: "- List the choices Dorian makes himself.\n- List the influences of Basil, the portrait and Lord Henry.",
      approach: "- Take a stance (agree, disagree or mixed)\n- Support it with evidence from across the novel\n- Discuss critically, weighing responsibility",
      solution: "1. AGREE: Dorian's self-absorption leads to a hedonistic life; his wish, his rejection of Sibyl, following the yellow book and murdering Basil are his own choices; he ignores guilt and remorse, hides everything ugly, and his attempt to destroy the portrait causes his death.\n2. DISAGREE: Basil's portrait awakens Dorian's awareness of his beauty and shields him from consequences, while Lord Henry introduces him to aestheticism and hedonism, treats Sibyl's death as a dramatic finale and gives him the yellow book.\n3. Mixed responses are credited; 3 marks only for a critical discussion.",
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
