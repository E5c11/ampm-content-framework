#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 15 (Part 2) (order 20)
 * Extract J (Act 4): Proctor tears up his confession.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q15-2.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q15-2.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q15-2.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q20';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 15 (Part 2): The Crucible — Extract J",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 20,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "the_crucible",
  tags: ["contextual_questions","integrity","character_analysis","irony"],
  question_image_urls: [`${BASE}/question_1.png`, `${BASE}/question_2.png`],
  memo_image_urls: [`${BASE}/memo_1.png`, `${BASE}/memo_2.png`],
  exam_question_marks: 13,
  supplementary_materials: [
    { type: 'annexure', label: "Extract J", image_urls: [`${BASE}/annexure_j_1.png`] },
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
    text_key: "the_crucible",
    context_text: null,
    question: "With whom does Abigail flee Salem after stealing her uncle's money?",
    metadata: ["Character:","[ ]"],
    answer: ["Mercy Lewis|Mercy","","","",""],
    presentation: "fitb",
    type: "definition",
    unit: "drama",
    topic: "plot_structure",
    subtopic: "sequence_of_events",
    skills: ["recall_text_knowledge"],
    difficulty: 1,
    exam_weight: 1,
    clues: "- She is one of the older girls, a servant of the Putnams.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 2",
    order: 2,
    text_key: "the_crucible",
    context_text: null,
    question: "Danforth insists that no innocent person need fear the court. Why is this ironic?",
    metadata: ["It is ironic because Danforth himself is secretly practising the very witchcraft he condemns.","It is ironic because, at this stage, the court has not yet convicted or sentenced a single person.","There is no irony: every person condemned by the court really is guilty of witchcraft.","The court condemns the innocent on the word of lying girls, so they have much to fear.",""],
    answer: ["The court condemns the innocent on the word of lying girls, so they have much to fear.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "dramatic_techniques",
    subtopic: "irony_in_drama",
    skills: ["identify_irony"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Think of Rebecca Nurse, Martha Corey and Elizabeth Proctor.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 3",
    order: 3,
    text_key: "the_crucible",
    context_text: null,
    question: "Rebecca Nurse refuses to confess to witchcraft even though it will cost her life. Why is this typical of her?",
    metadata: ["She is too proud and stubborn to admit to the court that she might have been wrong.","She is elderly and confused, and does not understand what the court is asking of her.","She is devout and cannot lie before God; her integrity is a moral anchor for Salem.","She hopes that her family will be given her land and money as payment if she dies.",""],
    answer: ["She is devout and cannot lie before God; her integrity is a moral anchor for Salem.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "character_integrity",
    skills: ["evaluate_character"],
    difficulty: 2,
    exam_weight: 3,
    clues: "- How is Rebecca regarded by the villagers in Act 1?\n- What would a false confession mean to her?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 4",
    order: 4,
    text_key: "the_crucible",
    context_text: null,
    question: "If you were directing the moment when Proctor refuses to hand over his signed confession because it is his name, how should the actor deliver the line?",
    metadata: ["In a bored, flat tone, tossing the paper aside, because he no longer cares what happens.","In an anguished tone, clutching the paper, because his good name matters more than life.","In a cheerful, relieved tone, waving to the crowd, because he expects to be released.","In a frightened whisper, hiding behind Hale, because he is terrified of Danforth's anger.",""],
    answer: ["In an anguished tone, clutching the paper, because his good name matters more than life.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "dramatic_techniques",
    subtopic: "stage_direction",
    skills: ["direct_performance"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- What is Proctor protecting?\n- Match body language and tone to his emotion and his decision.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 5",
    order: 5,
    text_key: "the_crucible",
    context_text: null,
    question: "Select the TWO actions that show John Proctor's internal conflict over his affair with Abigail.",
    metadata: ["He sells his farm to Thomas Putnam","He delays telling the court what Abigail told him about the girls' fits","He leads the girls in the forest dance","He confesses his adultery in court to discredit Abigail","He accuses Rebecca Nurse of witchcraft"],
    answer: ["He delays telling the court what Abigail told him about the girls' fits","He confesses his adultery in court to discredit Abigail","","",""],
    presentation: "multi_select",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "proctor_internal_conflict",
    skills: ["analyse_character"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Look for actions where protecting his name and telling the truth pull against each other.",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "15.6",
      marks: 2,
      clues: "- Why is Proctor in prison?\n- Why are Danforth and Hale so keen for him to confess?",
      approach: "- State Proctor's situation\n- Give the court's and Hale's motives, or Elizabeth's visit",
      solution: "1. Proctor has been arrested for refusing to confess to witchcraft; many innocent people have been executed and villagers doubt the court's integrity.\n2. Danforth is anxious to save his and the court's reputation by getting John to confess; Hale has returned to persuade the innocent to confess to save their lives, and Elizabeth has been allowed to see John in the hope she will persuade him.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "15.7",
      marks: 2,
      clues: "- Danforth says he will not deal in lies.\n- Has his court been dealing in truth?",
      approach: "- State what Danforth professes\n- Contrast it with his handling of the trials",
      solution: "1. Danforth professes to want the truth from the accused.\n2. Yet his handling of the trials created the climate in which the girls' lies flourished; he cares more about his and the court's reputation than truth, and although aware the accusations are false, he refuses to hear evidence that could free the accused.\n3. 2 marks for a clear understanding of irony.",
    },
    {
      number: "15.8",
      marks: 3,
      clues: "- Whose judgement does Rebecca mean?\n- How has she behaved throughout the play?",
      approach: "- Explain what she means and how it encourages Proctor\n- Link it to her established character (pious, respected, wise)",
      solution: "1. Rebecca comforts John by saying that only God's judgement matters; she bravely accepts her punishment and walks to the gallows, and John follows her example.\n2. This is typical of her: she is a pious woman who sincerely practises Christian values, respected and trusted as Salem's wise voice of reason.\n3. Her integrity stays untouched and acts as a moral compass for others. 3 marks for a cogent comment.",
    },
    {
      number: "15.9",
      marks: 3,
      clues: "- Danforth has just lost the confession he wanted.\n- What is he trying to show everyone present?",
      approach: "- Give body language\n- Give tone\n- Motivate both",
      solution: "1. Danforth might stand up straight or point into the distance with an open-arm gesture as he shouts his decision.\n2. His tone might be angry, contemptuous, vindictive, condescending or dismissive as he calls for the executions.\n3. Motivation: he realises his hold on the trial is slipping and makes a last-ditch attempt to assert his authority. 3 marks only if body language, tone and motivation are given.",
    },
    {
      number: "15.10",
      marks: 3,
      clues: "- What does Proctor feel about his affair?\n- How does this affect when and how he tells the truth?",
      approach: "- Describe the conflict (affair versus his morals and name)\n- Trace its effect on his actions (silence, revelation, refusal to sign)\n- Show how it resolves in redemption",
      solution: "1. John's affair with Abigail conflicts with his own morals, leaving him ashamed and hypocritical; he stays silent at first because he values his name and standing.\n2. He later reveals the truth to save Elizabeth and the other innocent victims.\n3. His refusal to sign the confession and willingness to die protect his family from disrepute, redeeming him and restoring his honour. 3 marks only with a critical discussion.",
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
