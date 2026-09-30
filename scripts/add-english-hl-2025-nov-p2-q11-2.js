#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 11 (Part 2) (order 14)
 * Extract F (Act 3, Scene 2): after the Mousetrap; Hamlet prepares to confront Gertrude.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q11-2.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q11-2.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q11-2.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q14';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 11 (Part 2): Hamlet — Extract F",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 14,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "hamlet",
  tags: ["contextual_questions","character_analysis","soliloquy","revenge"],
  question_image_urls: [`${BASE}/question_1.png`],
  memo_image_urls: [`${BASE}/memo_1.png`, `${BASE}/memo_2.png`],
  exam_question_marks: 13,
  supplementary_materials: [
    { type: 'annexure', label: "Extract F", image_urls: [`${BASE}/annexure_f_1.png`, `${BASE}/annexure_f_2.png`] },
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
    text_key: "hamlet",
    context_text: null,
    question: "Arrange these events from Act 3 of 'Hamlet' in the order in which they occur.",
    metadata: ["Hamlet spares Claudius at prayer","The Ghost appears in Gertrude's room","The Mousetrap is performed","Hamlet kills Polonius behind the arras","Claudius storms out of the play"],
    answer: ["The Mousetrap is performed","Claudius storms out of the play","Hamlet spares Claudius at prayer","Hamlet kills Polonius behind the arras","The Ghost appears in Gertrude's room"],
    presentation: "ordering",
    type: "application",
    unit: "drama",
    topic: "plot_structure",
    subtopic: "sequence_of_events",
    skills: ["sequence_plot_events"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Hamlet passes Claudius on his way to his mother's room.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 2",
    order: 2,
    text_key: "hamlet",
    context_text: null,
    question: "Account for Claudius's decision to send Hamlet to England.",
    metadata: ["He wants Hamlet to finish his studies at an English university, away from the court's gossip.","He hopes that a long sea voyage and a change of scene will cure Hamlet of his grief and madness.","Gertrude begs him to send Hamlet away for his own safety after Hamlet threatens her in her room.","He now sees Hamlet as a threat and, pretending to protect him, arranges his execution in England.",""],
    answer: ["He now sees Hamlet as a threat and, pretending to protect him, arranges his execution in England.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "character_intention",
    skills: ["interpret_motivation"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- What does the sealed letter carried by Rosencrantz and Guildenstern order?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 3",
    order: 3,
    text_key: "hamlet",
    context_text: null,
    question: "'Get thee to a nunnery.' What does this command reveal about Hamlet's attitude towards Ophelia?",
    metadata: ["He sincerely wants Ophelia to become a nun because she is so devoted to prayer and study.","He is proposing marriage to her in a playful, teasing way to hide his true feelings from Polonius.","He is bitter and disillusioned, projecting disgust at his mother onto Ophelia and rejecting love.","He is relieved and grateful that she has stayed loyal to him despite her father's orders.",""],
    answer: ["He is bitter and disillusioned, projecting disgust at his mother onto Ophelia and rejecting love.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "hamlet_psychological_state",
    skills: ["infer_speaker_attitude"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Think about Hamlet's earlier words, 'Frailty, thy name is woman'.\n- Does he suspect that Ophelia is being used?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 4",
    order: 4,
    text_key: "hamlet",
    context_text: null,
    question: "If you were directing the closet scene, how should the actor playing Gertrude deliver the line 'O Hamlet, speak no more'?",
    metadata: ["Laughing loudly in a mocking tone, because she finds her son's accusations ridiculous.","Standing tall in a cold, commanding tone, because she feels no shame and wants silence.","Turning away and covering her face, pleading brokenly, as she faces her own guilt.","Whispering calmly while arranging flowers, because she is not really listening to him.",""],
    answer: ["Turning away and covering her face, pleading brokenly, as she faces her own guilt.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "dramatic_techniques",
    subtopic: "stage_direction",
    skills: ["direct_performance"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- The line continues: 'Thou turn'st mine eyes into my very soul'.\n- Match body language and tone to what she feels.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 5",
    order: 5,
    text_key: "hamlet",
    context_text: null,
    question: "In the 'To be, or not to be' soliloquy, Hamlet explains why people endure suffering instead of ending their lives. Select the TWO reasons he gives.",
    metadata: ["The hope of becoming king","The dread of something after death","His love for Ophelia","Conscience makes cowards of us all","Fear of Claudius"],
    answer: ["The dread of something after death","Conscience makes cowards of us all","","",""],
    presentation: "multi_select",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "hamlet_soliloquy",
    skills: ["analyse_character"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- 'The undiscover'd country' is death.\n- Too much thinking stops action.",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "11.6",
      marks: 2,
      clues: "- What play has just been performed, and why?\n- How did Claudius react?",
      approach: "- Explain the Mousetrap and its purpose\n- Describe Claudius's reaction",
      solution: "1. Hamlet has arranged for The Mousetrap, a play mimicking King Hamlet's murder, to be performed before Claudius and the court, to confirm the Ghost's story; Horatio is to watch Claudius.\n2. During the play Claudius becomes agitated, stops the performance and storms out.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "11.7",
      marks: 2,
      clues: "- What does Gertrude want to understand?\n- Who is planning to listen in?",
      approach: "- Give Gertrude's reason\n- Give Polonius's role",
      solution: "1. Gertrude wants to discover the truth behind Hamlet's strange behaviour.\n2. Polonius has persuaded her to let him spy on Hamlet, still trying to prove that heartbreak is the cause of his madness.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "11.8",
      marks: 3,
      clues: "- He will 'speak daggers' but 'use none'.\n- What did the Ghost tell him about his mother?",
      approach: "- Name his attitude (1 mark)\n- Discuss it cogently with reference to the lines and the Ghost's instruction (2 marks)",
      solution: "1. Hamlet is enraged by his mother's hasty marriage and means to be 'cruel' in his words.\n2. He wants to obey the Ghost and not harm her physically, which suggests some sympathy; he knows he should love and respect her but is disgusted and disappointed by her 'frailty', and he is determined to make her confess and take responsibility.\n3. 1 mark for attitude, 2 for a cogent comment.",
    },
    {
      number: "11.9",
      marks: 3,
      clues: "- Hamlet has just seen Claudius's guilty reaction.\n- How does someone behave when proved right?",
      approach: "- Give body language\n- Give tone\n- Motivate both from his state of mind",
      solution: "1. Hamlet might beckon to the musicians, jump up and down or wave his arms, using an excited or determined tone.\n2. Motivation: he feels vindicated now that he knows Claudius is guilty, and is in a celebratory mood.\n3. 3 marks only if body language, tone and motivation are all given.",
    },
    {
      number: "11.10",
      marks: 3,
      clues: "- Why does Hamlet hesitate after the Ghost's command?\n- When does he act rashly, and when does he finally act decisively?",
      approach: "- Explain the conflict between duty and conscience\n- Trace how it causes delay, then impulsive acts\n- Show the resolution after England",
      solution: "1. Instructed to take revenge, Hamlet hesitates because the request conflicts with his values: he is duty-bound as a son, yet knows the act could damn him.\n2. The antic disposition and The Mousetrap test the Ghost's claim so that his actions are honourable; his sense of justice needs evidence. The conflict first causes inaction, then impulsive acts: he rashly kills Polonius and accepts the duel with Laertes.\n3. After returning from England he is determined to kill Claudius and restore his country. 3 marks only with a critical discussion.",
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
