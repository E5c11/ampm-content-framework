#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 7 (Part 1) (order 7)
 * Extract A (Chapter 6): Dorian announces his engagement to Sibyl Vane; Basil's concern.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q7-1.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q7-1.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q7-1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q7';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 7 (Part 1): The Picture of Dorian Gray — Extract A",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "dorian_gray",
  tags: ["contextual_questions","character_analysis","irony","moral_corruption"],
  question_image_urls: [`${BASE}/question_1.png`, `${BASE}/question_2.png`],
  memo_image_urls: [`${BASE}/memo_1.png`],
  exam_question_marks: 12,
  supplementary_materials: [
    { type: 'annexure', label: "Extract A", image_urls: [`${BASE}/annexure_a_1.png`] },
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
    question: "Arrange these events from Chapters 4 to 7 in the order in which they occur.",
    metadata: ["The three friends watch Sibyl act badly","Dorian notices a change in the portrait","Dorian tells Lord Henry about the actress he has fallen in love with","Dorian rejects Sibyl in her dressing room","Dorian announces his engagement to Basil and Lord Henry"],
    answer: ["Dorian tells Lord Henry about the actress he has fallen in love with","Dorian announces his engagement to Basil and Lord Henry","The three friends watch Sibyl act badly","Dorian rejects Sibyl in her dressing room","Dorian notices a change in the portrait"],
    presentation: "ordering",
    type: "application",
    unit: "novel",
    topic: "plot_structure",
    subtopic: "sequence_of_events",
    skills: ["sequence_plot_events"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- The engagement is announced at dinner before the theatre.\n- The portrait changes after the rejection.",
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
    question: "Sibyl Vane's talent as an actress first attracts Dorian. How does this same quality lead to her downfall?",
    metadata: ["Her fame makes her too proud to accept Dorian's proposal.","Her acting earns so much money that her brother James becomes jealous of her.","Lord Henry falls in love with her and turns Dorian against her.","Dorian loves the characters she plays rather than Sibyl herself, so when real love makes her act badly, he rejects her cruelly and she takes her own life.",""],
    answer: ["Dorian loves the characters she plays rather than Sibyl herself, so when real love makes her act badly, he rejects her cruelly and she takes her own life.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "character_analysis",
    subtopic: "character_relationship",
    skills: ["analyse_characterisation"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- What happens to her acting once she truly loves Dorian?\n- What does Dorian value most: people or art?",
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
    question: "What name does Sibyl Vane use for Dorian because she does not know his real name?",
    metadata: ["Name:","[ ]"],
    answer: ["Prince Charming","","","",""],
    presentation: "fitb",
    type: "definition",
    unit: "novel",
    topic: "figurative_language",
    subtopic: "connotative_diction",
    skills: ["recall_text_knowledge"],
    difficulty: 1,
    exam_weight: 1,
    clues: "- The name comes from fairy tales.",
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
    question: "Dorian tells his friends that Sibyl's love will make him good and free him from Lord Henry's wrong theories. Why is this ironic in the context of the novel?",
    metadata: ["It is ironic because Sibyl is secretly married to Lord Henry.","It is ironic because Dorian never meets Sibyl again after this conversation.","That very night he rejects her cruelly for acting badly, choosing beauty over love; far from making him good, she becomes his first victim.","There is no irony, because Sibyl does reform Dorian for the rest of his life.",""],
    answer: ["That very night he rejects her cruelly for acting badly, choosing beauty over love; far from making him good, she becomes his first victim.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "character_analysis",
    subtopic: "moral_decline",
    skills: ["identify_irony"],
    difficulty: 4,
    exam_weight: 3,
    clues: "- Irony: the outcome is the opposite of what is expected.\n- What happens at the theatre that same evening?",
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
    question: "Throughout the novel, what does Basil Hallward's attitude towards Dorian reveal about Basil's character?",
    metadata: ["He is cynical and enjoys corrupting Dorian with clever sayings.","He is sincere and morally serious, devoted to Dorian almost to the point of worship, and he tries to guide Dorian towards goodness.","He is jealous of Dorian's wealth and plans to ruin him.","He loses all interest in Dorian once the portrait is finished.",""],
    answer: ["He is sincere and morally serious, devoted to Dorian almost to the point of worship, and he tries to guide Dorian towards goodness.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "character_analysis",
    subtopic: "character_motivation",
    skills: ["analyse_character"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Compare Basil with Lord Henry.\n- What does Basil ask of Dorian during his last visit?",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "7.1",
      marks: 2,
      clues: "- Where did Basil first meet Dorian?\n- What effect did Dorian have on Basil as an artist?",
      approach: "- State how Basil met Dorian\n- Explain why he painted him",
      solution: "1. Basil met Dorian at a party and was captivated by his beauty and innocence.\n2. Inspired, he painted the portrait as an artistic tribute to Dorian.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "7.2",
      marks: 2,
      clues: "- What draws Dorian to Sibyl?\n- What happens when her acting falters?",
      approach: "- Show that her beauty makes Dorian idealise her\n- Show how his superficial love turns to cruel rejection and her death",
      solution: "1. Sibyl's beauty attracts Dorian and causes him to idealise and idolise her.\n2. When genuine love makes her act badly, he cruelly rejects her and she commits suicide: her beauty becomes a curse that binds her fate to his superficial desires.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "7.3",
      marks: 2,
      clues: "- A 'lad' is a boy or young man.\n- At this point, how far has Lord Henry's influence gone?",
      approach: "- Say what 'lad' implies (youth, innocence, immaturity)\n- Add that he is still impressionable and naive",
      solution: "1. 'Lad' implies Dorian's youthful innocence and immaturity.\n2. Although not yet corrupted by Lord Henry, he is impressionable and naive.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "7.4",
      marks: 3,
      clues: "- Basil fears that someone 'vile' might degrade Dorian.\n- Who actually turns out to be vile, and what actually ruins Dorian?",
      approach: "- Explain what Basil fears\n- Show how the opposite happens (any ONE line of irony, discussed clearly)",
      solution: "1. Basil believes Dorian is pure and fears that a lower-class girl will stain his reputation and character.\n2. Ironically, Dorian proves to be the 'vile creature' who destroys Sibyl. Alternatively: Basil's own portrait and Lord Henry's theories are the real catalysts of Dorian's ruin; or Dorian's own decisions, not an outside influence, degrade his soul and intellect.\n3. 3 marks for a clear discussion of any ONE of these ironies.",
    },
    {
      number: "7.5",
      marks: 3,
      clues: "- Look at how Basil speaks about the girl and to Dorian.\n- Why is he hurt that Harry was told first?",
      approach: "- Identify two traits (e.g. protective, moral, petulant, jealous)\n- Support each with evidence from the extract and discuss",
      solution: "1. Basil is cautious, caring and protective: his concern for Dorian and disapproval of an engagement to an unknown girl reflect his moral values, and his reliance on Harry's view shows respect for Henry's judgement.\n2. In not forgiving Dorian for telling Harry first, he appears petulant or sulky; he feels neglected and jealous of the bond between Dorian and Lord Henry because his devotion is not returned.\n3. 3 marks for two ideas well discussed.",
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
