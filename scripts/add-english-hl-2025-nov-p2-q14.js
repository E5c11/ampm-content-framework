#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 14 (order 18)
 * Essay: many villagers in Salem use deception and disguise to achieve their goals (minimum three characters).
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q14.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q14.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q14.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q18';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 14: The Crucible — Essay",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 18,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "the_crucible",
  tags: ["literary_essay","hysteria","integrity","manipulation"],
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
    text_key: "the_crucible",
    context_text: null,
    question: "Match each character in 'The Crucible' to the deception they use.",
    metadata: ["A - Abigail Williams","B - Thomas Putnam","C - Elizabeth Proctor","1 - Lies in court to protect her husband's good name","2 - Has his daughter cry out against neighbours whose land he wants","3 - Claims Elizabeth's spirit stabbed her after sticking a needle into herself"],
    answer: ["A-3","B-2","C-1"],
    presentation: "match",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "character_method",
    skills: ["analyse_character"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Think of the poppet, the land dispute raised by Giles Corey, and the courtroom question about lechery.",
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
    question: "Which object, found in the Proctors' house with a needle in it, is used as evidence against Elizabeth?",
    metadata: ["Object:","[ ]"],
    answer: ["Poppet|A poppet|The poppet|Doll|A doll","","","",""],
    presentation: "fitb",
    type: "definition",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "abigail_motivation",
    skills: ["recall_text_knowledge"],
    difficulty: 1,
    exam_weight: 1,
    clues: "- Mary Warren made it in court and gave it to Elizabeth.",
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
    question: "How does Mary Warren's behaviour in court support an essay on deception?",
    metadata: ["She is the only girl who never lies, and she stays loyal to the Proctors throughout the trial.","She admits the fits are pretence, but when the girls mimic her she panics and accuses Proctor.","She persuades Danforth to halt the trials by proving that the girls have been pretending all along.","She reveals in court that Tituba taught all the girls real witchcraft in the forest at night.",""],
    answer: ["She admits the fits are pretence, but when the girls mimic her she panics and accuses Proctor.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "character_vulnerability",
    skills: ["evaluate_argument"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Why can Mary not 'faint' on command in court?\n- What do the girls do to her?",
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
    question: "In Act 4, Reverend Hale urges the condemned to make false confessions. How could this be used in the essay?",
    metadata: ["It proves that Hale had been deceiving the people of Salem from the moment he arrived.","It shows that Hale secretly wants the accused to hang so that the court's work is finished.","It shows that Hale still believes every accusation and wants the guilty witches to confess.","Even a man who rejects the court's deceit comes to see a lie as justified if it saves lives.",""],
    answer: ["Even a man who rejects the court's deceit comes to see a lie as justified if it saves lives.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "character_development",
    skills: ["evaluate_character"],
    difficulty: 4,
    exam_weight: 3,
    clues: "- Why did Hale denounce the court in Act 3?\n- Why has he returned to Salem?",
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
    question: "Which of the following is the strongest thesis statement for this essay?",
    metadata: ["'The Crucible' is a play by Arthur Miller, set in the Puritan village of Salem, Massachusetts, in 1692.","In this essay I will discuss what happens in each of the four acts of 'The Crucible', one after another.","In a Salem obsessed with piety, Abigail, Parris and Putnam hide selfish motives behind righteousness.","The Crucible has many characters, including John Proctor, his wife Elizabeth and Abigail Williams.",""],
    answer: ["In a Salem obsessed with piety, Abigail, Parris and Putnam hide selfish motives behind righteousness.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "literary_essay",
    subtopic: "critical_discussion",
    skills: ["identify_thesis_statement"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- A thesis names characters and makes an arguable claim about the statement.",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "14",
      marks: 25,
      clues: "- The statement is about villagers who use deception and disguise to achieve their goals.\n- Refer to at least THREE characters, stating each one's goal.\n- Salem's strict religious surface hides grudges and self-interest.",
      approach: "- Introduction: take a stance\n- Body: Abigail, Parris, Tituba, Putnam, Mary Warren, the court (Danforth); Proctor and Elizabeth as reluctant deceivers\n- Consider Hale as a contrast who later justifies deception\n- Conclusion: link back to the statement; 400–450 words",
      solution: "1. Salem's strict religious code hides an undercurrent of deceit, grudges and judgement. Abigail poses as innocent despite her affair with Proctor and the forbidden forest rituals; she manipulates the girls, pretends to see spirits and to be stabbed by Elizabeth's spirit to get Elizabeth killed, and finally steals her uncle's money and flees.\n2. Parris poses as godly but is spiritually lacking, lies about the forest to protect his position and disguises vindictiveness as justice. Tituba takes on the role of the bewitched to save herself, triggering many false accusations. Putnam appears to support Parris but uses the trials to gain land through Ruth's accusations.\n3. Mary Warren wavers between truth and lies and is forced back into deception by Abigail. John Proctor hides his affair, allowing Abigail to keep her innocent image; Elizabeth lies to protect his name.\n4. The court encourages false confessions and values its reputation above justice; Danforth continues the trials after realising he is misled. Hale is not deceptive at first and denounces the court, but later encourages the accused to lie to save their lives.\n5. Marked with the rubric: 15 content, 10 structure and language.",
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
