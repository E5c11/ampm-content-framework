#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 10 (order 12)
 * Essay: various characters in Hamlet use deception and disguise to achieve their goals (minimum three characters).
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q10.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q10.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q10.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q12';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 10: Hamlet — Essay",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 12,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "hamlet",
  tags: ["literary_essay","manipulation","revenge","character_analysis"],
  question_image_urls: [`${BASE}/question_1.png`],
  memo_image_urls: [`${BASE}/memo_1.png`, `${BASE}/memo_2.png`],
  exam_question_marks: 25,
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
    text_key: "hamlet",
    context_text: null,
    question: "Match each character in 'Hamlet' to the deception he uses.",
    metadata: ["A - Claudius","B - Polonius","C - Rosencrantz and Guildenstern","1 - Pretend to visit Hamlet as old friends while reporting to the king","2 - Poisons his brother while appearing to be a grieving, loving king","3 - Hides behind the arras to spy on Hamlet and Gertrude"],
    answer: ["A-2","B-3","C-1"],
    presentation: "match",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "character_method",
    skills: ["analyse_character"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Who dies behind a curtain?\n- Who were Hamlet's schoolfellows?",
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
    question: "Why does Hamlet adopt an 'antic disposition'?",
    metadata: ["Because meeting the Ghost has driven him genuinely and permanently insane from grief.","To hide his true intentions while he tests the Ghost's claim and watches Claudius.","To win back Ophelia's affection by amusing her with clever, playful and witty behaviour.","To frighten Gertrude into leaving Claudius and fleeing from Denmark with him at once.",""],
    answer: ["To hide his true intentions while he tests the Ghost's claim and watches Claudius.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "hamlet_motivation",
    skills: ["identify_motivation"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- An 'antic disposition' is a mad, clownish manner.\n- What does madness allow him to do unnoticed?",
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
    question: "'The play's the thing / Wherein I'll catch the conscience of the king.' How can this plan be used in an essay on deception and disguise?",
    metadata: ["It shows that Hamlet has given up on revenge and now wants to become a professional actor.","He hides an accusation inside a play, using performance as a disguise to expose Claudius's guilt.","It proves that Claudius has no guilt to hide, since he enjoys the whole of the performance.","It shows that the travelling players are secretly plotting with Hamlet to kill the king on stage.",""],
    answer: ["He hides an accusation inside a play, using performance as a disguise to expose Claudius's guilt.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "theme_identification",
    subtopic: "deception_theme",
    skills: ["apply_concept_to_text"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- What is the Mousetrap designed to reveal?\n- How is theatre itself a kind of disguise?",
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
    question: "As he dies, whom does Hamlet ask to tell his story truthfully to the world?",
    metadata: ["Character:","[ ]"],
    answer: ["Horatio","","","",""],
    presentation: "fitb",
    type: "definition",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "comparative_characterisation",
    skills: ["recall_text_knowledge"],
    difficulty: 1,
    exam_weight: 1,
    clues: "- He is the one character who tries to drink the poison too.",
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
    question: "Laertes agrees to use an unblunted, poisoned sword in the duel with Hamlet. What does this add to an argument about deception?",
    metadata: ["It shows that Laertes is the most honest character in the play, as he openly admits the plan.","It proves that the duel is a fair contest of skill between two equally matched swordsmen.","It shows that Hamlet planned the poisoning himself in order to trap Laertes and Claudius.","Even an honourable son is drawn into Claudius's deceit, which rebounds and kills Laertes.",""],
    answer: ["Even an honourable son is drawn into Claudius's deceit, which rebounds and kills Laertes.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "character_consequence",
    skills: ["evaluate_argument"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Who suggests the poison?\n- Whose blood does the poisoned blade eventually draw?",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "10",
      marks: 25,
      clues: "- The statement asks about deception AND disguise used to achieve goals.\n- You must discuss at least THREE characters.\n- Claudius's crime is the source of the play's deceit; others copy or respond to it.",
      approach: "- Introduction: take a stance\n- Body: Claudius (murder, false image, plots), Hamlet (antic disposition, the Mousetrap), Polonius, Rosencrantz and Guildenstern, Laertes; mention Horatio as a contrast\n- Show each character's goal and the consequence of the deception\n- Conclusion: link back to the statement; 400–450 words",
      solution: "1. Claudius's murder of King Hamlet sets the stage for deception: he charms Gertrude into marriage and deceives the court by posing as a loving stepfather and competent ruler. He plots against Hamlet by using Polonius, Ophelia, Rosencrantz and Guildenstern as spies, sending Hamlet to England supposedly for his safety but intending his death, and arranging a 'friendly' duel with a poisoned sword.\n2. Hamlet feigns madness ('antic disposition') to hide his intentions and verify the Ghost; it gives him an advantage but causes collateral damage, including Ophelia's madness and death. The Mousetrap uses performance as disguise to expose Claudius.\n3. Polonius pretends to serve the court while seeking power, uses his daughter as a tool, and dies spying behind the arras. Rosencrantz and Guildenstern betray Hamlet while posing as concerned friends, yet are themselves deceived by Claudius.\n4. Laertes colludes with Claudius, hiding revenge behind a show of reconciliation; his confession comes only after many deaths. Ophelia is a pawn; Gertrude is manipulated; Horatio remains honest and serves as a moral contrast.\n5. Marked with the rubric: 15 content, 10 structure and language.",
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
