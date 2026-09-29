#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 15 (Part 1) (order 19)
 * Extract I (Act 1): Abigail threatens the girls in Betty's bedroom.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q15-1.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q15-1.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q15-1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q19';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 15 (Part 1): The Crucible — Extract I",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 19,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "the_crucible",
  tags: ["contextual_questions","character_analysis","hysteria","manipulation"],
  question_image_urls: [`${BASE}/question_1.png`],
  memo_image_urls: [`${BASE}/memo_1.png`],
  exam_question_marks: 12,
  supplementary_materials: [
    { type: 'annexure', label: "Extract I", image_urls: [`${BASE}/annexure_i_1.png`] },
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
    question: "Whom does Parris find with the girls in the forest, singing over a fire?",
    metadata: ["Character:","[ ]"],
    answer: ["Tituba","","","",""],
    presentation: "fitb",
    type: "definition",
    unit: "drama",
    topic: "plot_structure",
    subtopic: "scene_context",
    skills: ["recall_text_knowledge"],
    difficulty: 1,
    exam_weight: 1,
    clues: "- She is a servant in Parris's own household.",
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
    question: "Why does Parris want the rumours of witchcraft in his house to be denied at first?",
    metadata: ["He secretly practises witchcraft himself.","He wants to protect Tituba from being punished.","He fears that a scandal in his own household will give his enemies in Salem a reason to drive him from the pulpit.","He believes that witchcraft does not exist.",""],
    answer: ["He fears that a scandal in his own household will give his enemies in Salem a reason to drive him from the pulpit.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "parris_attitude",
    skills: ["interpret_motivation"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Parris often complains that there is a faction against him.\n- What matters most to him: truth or his position?",
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
    question: "Arrange these events from 'The Crucible' in the order in which they occur.",
    metadata: ["Tituba confesses and names others","Mary Warren accuses Proctor in court","Parris discovers the girls dancing in the forest","Elizabeth is arrested after the poppet is found","Hale arrives to examine Betty"],
    answer: ["Parris discovers the girls dancing in the forest","Hale arrives to examine Betty","Tituba confesses and names others","Elizabeth is arrested after the poppet is found","Mary Warren accuses Proctor in court"],
    presentation: "ordering",
    type: "application",
    unit: "drama",
    topic: "plot_structure",
    subtopic: "sequence_of_events",
    skills: ["sequence_plot_events"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Act 1 ends with the first accusations; Act 2 with an arrest; Act 3 is set in court.",
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
    question: "John Proctor delays telling the court about his affair with Abigail. How does this silence contribute to the role of dishonesty in the play?",
    metadata: ["It has no effect, because the court already knows about the affair.","By hiding the truth to protect his name, he allows Abigail's reputation for innocence to stand, which strengthens her accusations.","It proves that Proctor is the most dishonest character in Salem.","It shows that Proctor supports the witch trials.",""],
    answer: ["By hiding the truth to protect his name, he allows Abigail's reputation for innocence to stand, which strengthens her accusations.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "theme_identification",
    subtopic: "deception_theme",
    skills: ["analyse_theme"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- What would revealing the affair do to Abigail's credibility?\n- Why is Proctor reluctant to speak?",
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
    question: "In court, Abigail warns Danforth to beware in case the power of hell turns his wits. What does this reveal about her?",
    metadata: ["She is terrified of Danforth and begs for his mercy.","She is confessing that she has been lying all along.","She is trying to protect Mary Warren from punishment.","She is so bold and manipulative that she intimidates even the Deputy Governor, turning his own belief in witchcraft against him.",""],
    answer: ["She is so bold and manipulative that she intimidates even the Deputy Governor, turning his own belief in witchcraft against him.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "abigail_dramatic_function",
    skills: ["analyse_characterisation"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Who holds the most power in the courtroom?\n- How does Abigail use the fear of witchcraft?",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "15.1",
      marks: 2,
      clues: "- What did Parris discover?\n- Why is Betty lying in bed, and whom has Parris sent for?",
      approach: "- Describe the discovery in the forest\n- Describe what has happened since (Betty, Hale, Abigail questioned)",
      solution: "1. Parris has discovered the girls dancing in the forest; Betty has been pretending to be unconscious to avoid punishment, and Parris, upset that his household is the centre of witchcraft rumours, has sent for Reverend Hale.\n2. Abigail has been confronted by Parris about the forest, and the girls have gathered at the Parris home to discuss their fear of what may happen.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "15.2",
      marks: 2,
      clues: "- Why did Abigail lose her place in the Proctor house?\n- What does she hope for with John?",
      approach: "- Give the dismissal after the affair\n- Give her hope of replacing Elizabeth (or her anger at Elizabeth's gossip)",
      solution: "1. Elizabeth dismissed Abigail after discovering her affair with John.\n2. By getting rid of Elizabeth, Abigail believes she will win John back and become the next Goody Proctor; she is also angry that Elizabeth has been tarnishing her name.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "15.3",
      marks: 2,
      clues: "- Whom did Mary Warren replace?\n- What work is she expected to do?",
      approach: "- State her role\n- State her duties",
      solution: "1. Mary Warren has replaced Abigail as the Proctors' servant after Abigail's dismissal.\n2. She is expected to help Elizabeth with the household chores.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "15.4",
      marks: 3,
      clues: "- Betty exposes a lie of Abigail's here.\n- List other lies in the play and who is harmed by them.",
      approach: "- Link the lines to Abigail's dishonesty\n- Discuss further examples (the girls, Putnams, Proctor/Elizabeth, Danforth)\n- Conclude on who becomes the victims",
      solution: "1. Dishonesty is central: Betty exposes Abigail's lie, and Abigail leads the girls in lying about the forest and then accusing innocent people, which empowers them.\n2. Villagers lie for gain (land); Mrs Putnam's lies lead to Rebecca's death. John's affair leads the honest Elizabeth to lie to save his reputation, while John redeems himself by refusing a false confession. Danforth claims impartial justice but continues prosecuting after realising the court is misled.\n3. Dishonest characters make victims of the honest. 3 marks for two ideas well discussed.",
    },
    {
      number: "15.5",
      marks: 3,
      clues: "- Notice the threats: 'a pointy reckoning', her parents' deaths.\n- Why does she need the girls silent?",
      approach: "- Identify her nature (threatening, vicious, vengeful)\n- Explain her motive (self-preservation, control)\n- Discuss with reference to the lines",
      solution: "1. The lines show Abigail's threatening, vicious and vengeful nature: she is determined to stop the girls revealing the truth to avoid punishment at all costs, so her aggression is self-preservation.\n2. Her references to 'a pointy reckoning' and her parents' deaths are intimidation tactics to keep control; her powerful personality dominates the impressionable girls.\n3. 3 marks for two ideas well discussed.",
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
