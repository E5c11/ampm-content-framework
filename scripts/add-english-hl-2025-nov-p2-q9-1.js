#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 9 (Part 1) (order 10)
 * Extract C (Chapter 5): Pi renames himself at school.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q9-1.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q9-1.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q9-1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q10';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 9 (Part 1): Life of Pi — Extract C",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "life_of_pi",
  tags: ["contextual_questions","character_analysis","survival","symbolism"],
  question_image_urls: [`${BASE}/question_1.png`, `${BASE}/question_2.png`],
  memo_image_urls: [`${BASE}/memo_1.png`],
  exam_question_marks: 12,
  supplementary_materials: [
    { type: 'annexure', label: "Extract C", image_urls: [`${BASE}/annexure_c_1.png`] },
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
    question: "Before he renames himself, what nickname do the other boys use to mock Piscine's name?",
    metadata: ["Nickname:","[ ]"],
    answer: ["Pissing","","","",""],
    presentation: "fitb",
    type: "definition",
    unit: "novel",
    topic: "plot_structure",
    subtopic: "scene_context",
    skills: ["recall_text_knowledge"],
    difficulty: 1,
    exam_weight: 1,
    clues: "- Say 'Piscine' aloud quickly.",
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
    question: "Select TWO reasons why the name 'Pi' suits Piscine.",
    metadata: ["It was the name of his grandfather","It is short and cannot easily be twisted into an insult","It was the name of the zoo's first tiger","π is an irrational number, fitting a boy who accepts truths that reason alone cannot explain","It was suggested by Mamaji as a swimming term"],
    answer: ["It is short and cannot easily be twisted into an insult","π is an irrational number, fitting a boy who accepts truths that reason alone cannot explain","","",""],
    presentation: "multi_select",
    type: "application",
    unit: "novel",
    topic: "symbolism",
    subtopic: "symbol_interpretation",
    skills: ["explain_symbolic_meaning"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- One reason is practical, the other symbolic.\n- Pi chose this name himself.",
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
    question: "Ravi, Pi's older brother, teases him when he learns that Pi is practising three religions. What does this imply about the relationship between the brothers?",
    metadata: ["The brothers dislike each other and rarely speak, so Ravi's teasing is meant to wound Pi.","Ravi is jealous because Pi, not he, is the popular captain of the school cricket team.","Ravi teases his younger brother as older siblings do, but the mockery is playful, not cruel.","Ravi is deeply religious himself and teases Pi only in order to convert him to one faith.",""],
    answer: ["Ravi teases his younger brother as older siblings do, but the mockery is playful, not cruel.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "character_analysis",
    subtopic: "family_relationships",
    skills: ["infer_character_relationship"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Is Ravi trying to hurt Pi or to amuse himself?",
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
    question: "When Pi's father feeds a live goat to the tiger Mahisha in front of his sons, what does this episode reveal about Pi at this stage of the novel?",
    metadata: ["Pi is secretly cruel and enjoys watching the tiger hunt, which shocks his older brother Ravi.","Pi is fearless and wants to climb into the enclosure to prove that the tiger is harmless.","Pi sees animals as friends; the harsh lesson that they are dangerous later saves his life.","Pi is bored by the zoo and its animals and only wants to return to his studies at school.",""],
    answer: ["Pi sees animals as friends; the harsh lesson that they are dangerous later saves his life.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "character_analysis",
    subtopic: "lesson_and_application",
    skills: ["interpret_behaviour"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Why does Pi's father think the lesson is necessary?\n- How is this lesson useful on the lifeboat?",
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
    question: "On the lifeboat, Pi blows his whistle every time he asserts his territory over Richard Parker. Why does this repeated signal matter?",
    metadata: ["The whistle is used to signal passing ships, so repeating it increases Pi's chances of rescue.","Repetition links the whistle with seasickness, conditioning Richard Parker to respect Pi's space.","The repeated whistle frightens off the sharks that circle the lifeboat at night looking for food.","Pi blows the whistle once a day to help him keep count of how long he has been at sea.",""],
    answer: ["Repetition links the whistle with seasickness, conditioning Richard Parker to respect Pi's space.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "thematic_analysis",
    subtopic: "survival_instinct",
    skills: ["explain_effect"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- How are circus animals trained?\n- What does the tiger learn to connect with the whistle?",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "9.1",
      marks: 2,
      clues: "- What has Pi just written on the board?\n- How would a class react to such a bold act?",
      approach: "- State what Pi has just done\n- Explain the reason for the silence",
      solution: "1. Pi has just written his new name, Pi Patel, on the blackboard.\n2. The silence reflects the surprise of the teacher and classmates at his boldness, audacity and determination.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "9.2",
      marks: 2,
      clues: "- Who chose the name?\n- What is the Piscine Molitor?",
      approach: "- Name who chose it and why that person had the task\n- Explain the link to the swimming pool",
      solution: "1. Mamaji ('Uncle' Francis Adirubasamy), a close family friend, was asked to name the baby.\n2. His love of swimming and admiration for the Piscine Molitor, a beautiful pool in Paris, inspired the name; he wanted to honour the child with a place that brought him joy.\n3. Two distinct reasons earn 2 marks.",
    },
    {
      number: "9.3",
      marks: 2,
      clues: "- Ravi is 'that local god', the cricket captain.\n- Pi expects mocking but stays silent.",
      approach: "- Identify the sibling rivalry/teasing\n- Show the affection beneath it",
      solution: "1. The exchange shows sibling competition and friendship: Ravi often teases Pi.\n2. The teasing is light-hearted rather than malicious; beneath the ridicule lie brotherly love and respect.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "9.4",
      marks: 3,
      clues: "- Why does Pi repeat the stunt with every teacher?\n- What qualities does it take to do this?",
      approach: "- Explain Pi's aim (escaping the teasing, reshaping his identity)\n- Discuss two qualities it reveals, with support",
      solution: "1. The stunt shows Pi's commitment to taking control of his situation: he breaks free of the teasing linked to his birth name by reshaping his identity.\n2. It is brave and assertive, displaying his cleverness, creativity and skill with difficult situations; his ingenuity and resolve show his ability to overcome obstacles.\n3. 3 marks for two ideas well discussed.",
    },
    {
      number: "9.5",
      marks: 3,
      clues: "- How does Pi use repetition to handle Richard Parker?\n- What daily routines does he keep?",
      approach: "- Show how repetition creates order and routine\n- Link it to training Richard Parker and to his spiritual routine\n- Discuss its effect on his survival",
      solution: "1. Repetition builds order and routine on the lifeboat, which is crucial to his physical and mental survival.\n2. Understanding the role of repetition in training animals lets him control Richard Parker so they can co-exist; he also keeps daily routines of checking supplies, fishing, cleaning and prayer.\n3. The repetition keeps him focused, disciplined and optimistic. 3 marks for two ideas well discussed.",
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
