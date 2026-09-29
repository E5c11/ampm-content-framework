#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 13 (Part 2) (order 17)
 * Extract H (Act 5, Scene 1): the night attack on Cassio; Iago kills Roderigo.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q13-2.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q13-2.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q13-2.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q17';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 13 (Part 2): Othello — Extract H",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 17,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "othello",
  tags: ["contextual_questions","dramatic_irony","manipulation","tragedy"],
  question_image_urls: [`${BASE}/question_1.png`],
  memo_image_urls: [`${BASE}/memo_1.png`, `${BASE}/memo_2.png`],
  exam_question_marks: 13,
  supplementary_materials: [
    { type: 'annexure', label: "Extract H", image_urls: [`${BASE}/annexure_h_1.png`, `${BASE}/annexure_h_2.png`] },
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
    text_key: "othello",
    context_text: null,
    question: "Arrange these events from Act 5 of 'Othello' in the order in which they occur.",
    metadata: ["Othello smothers Desdemona","Othello kills himself","Roderigo attacks Cassio in the dark","Emilia reveals the truth about the handkerchief","Iago stabs Roderigo"],
    answer: ["Roderigo attacks Cassio in the dark","Iago stabs Roderigo","Othello smothers Desdemona","Emilia reveals the truth about the handkerchief","Othello kills himself"],
    presentation: "ordering",
    type: "application",
    unit: "drama",
    topic: "plot_structure",
    subtopic: "sequence_of_events",
    skills: ["sequence_plot_events"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- The street fight comes first; the play ends in the bedchamber.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 2",
    order: 2,
    text_key: "othello",
    context_text: null,
    question: "The letter Lodovico brings from Venice recalls Othello. Whom does it appoint to govern Cyprus in his place?",
    metadata: ["Character:","[ ]"],
    answer: ["Cassio|Michael Cassio","","","",""],
    presentation: "fitb",
    type: "definition",
    unit: "drama",
    topic: "plot_structure",
    subtopic: "scene_context",
    skills: ["recall_text_knowledge"],
    difficulty: 1,
    exam_weight: 1,
    clues: "- It is the man Othello believes is Desdemona's lover.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 3",
    order: 3,
    text_key: "othello",
    context_text: null,
    question: "Othello repeatedly calls Iago 'honest Iago'. Why is this ironic?",
    metadata: ["It is ironic because Othello knows Iago is lying and is mocking him.","It is ironic because Iago is actually the most honest character in the play.","There is no irony, because Iago never lies to Othello.","The audience knows Iago is the most dishonest character in the play, so each time Othello praises his honesty he is trusting the man who is destroying him.",""],
    answer: ["The audience knows Iago is the most dishonest character in the play, so each time Othello praises his honesty he is trusting the man who is destroying him.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "dramatic_techniques",
    subtopic: "dramatic_irony",
    skills: ["identify_dramatic_irony"],
    difficulty: 2,
    exam_weight: 3,
    clues: "- Dramatic irony: the audience knows something a character does not.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 4",
    order: 4,
    text_key: "othello",
    context_text: null,
    question: "Emilia declares that heaven, men and devils may all cry shame against her, 'yet I'll speak'. What is the significance of this moment for the theme of honesty?",
    metadata: ["Emilia confesses that she was having an affair with Cassio.","Emilia lies to protect Iago from punishment.","Emilia finally chooses truth over obedience to her husband, exposing Iago's lies even though it costs her her life.","Emilia refuses to speak and leaves the stage.",""],
    answer: ["Emilia finally chooses truth over obedience to her husband, exposing Iago's lies even though it costs her her life.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "theme_identification",
    subtopic: "deception_theme",
    skills: ["analyse_theme"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- What does Emilia reveal about the handkerchief?\n- How does Iago respond?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 5",
    order: 5,
    text_key: "othello",
    context_text: null,
    question: "Lodovico calls Iago a 'Spartan dog, / More fell than anguish, hunger, or the sea!' Is this a valid assessment of Iago's character?",
    metadata: ["Valid: Iago destroys Othello, Desdemona, Roderigo and Emilia without remorse, and his refusal to explain himself confirms his cruelty.","Invalid, because Iago is a loyal friend misunderstood by everyone.","Invalid, because Iago shows deep remorse and begs for forgiveness.","Valid, but only because Iago was a poor soldier.",""],
    answer: ["Valid: Iago destroys Othello, Desdemona, Roderigo and Emilia without remorse, and his refusal to explain himself confirms his cruelty.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "villain_characterisation",
    skills: ["evaluate_character"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- 'Fell' means fierce and deadly.\n- 'Demand me nothing: what you know, you know.'",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "13.6",
      marks: 2,
      clues: "- What has Iago convinced Othello of, and what has Othello decided?\n- What did Iago arrange between Roderigo and Cassio?",
      approach: "- Summarise Othello's decision\n- Summarise the failed ambush",
      solution: "1. Iago has manipulated Othello into believing Desdemona has been unfaithful with Cassio, and in jealousy Othello has decided to murder her.\n2. Iago orchestrated an ambush of Cassio by Roderigo which failed: Cassio wounds Roderigo, and Iago then wounds Cassio.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "13.7",
      marks: 2,
      clues: "- Whom do they represent?\n- What news do they bring?",
      approach: "- State that they are on state business for the Duke\n- Give the recall of Othello and/or Brabantio's death",
      solution: "1. Gratiano and Lodovico are in Cyprus on state business as representatives of the Duke; Lodovico has come to recall Othello to Venice because the threat of war has passed.\n2. Gratiano, Desdemona's uncle, also brings news of Brabantio's death.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "13.8",
      marks: 3,
      clues: "- Whom does Cassio call to for help?\n- Who arranged the attack?",
      approach: "- Explain whom Cassio appeals to\n- Show that Iago is responsible for the violence\n- Discuss what this shows about Iago's manipulation",
      solution: "1. Cassio calls for help after being wounded, but he calls to Iago, who orchestrated the violence.\n2. Cassio's faith in Iago is intact because he does not know Iago has been working against him.\n3. This shows the extent of Iago's manipulation: Cassio needs help from the very man who betrayed him. 3 marks for a clear understanding of irony.",
    },
    {
      number: "13.9",
      marks: 3,
      clues: "- Bianca, called a strumpet, claims to be as honest as Emilia.\n- Who has a reputation for honesty in the play, and does he deserve it?",
      approach: "- Discuss appearance versus reality of honesty\n- Refer to Iago, Desdemona, Othello and Emilia\n- Make a cogent comment",
      solution: "1. Bianca's comment suggests that the appearance of honesty matters more than actual honesty: Iago's reputation for honesty lets him carry out his plans, deceive people and exploit Desdemona's honest nature.\n2. Othello's belief in Desdemona's honesty is shattered by Iago's deception; Emilia's dishonesty about the handkerchief gives Iago his 'ocular proof', and both women suffer for it.\n3. Honesty is in short supply, and the honest become victims of others' dishonesty. 3 marks only for a cogent comment.",
    },
    {
      number: "13.10",
      marks: 3,
      clues: "- Roderigo calls Iago 'damned' and an 'inhuman dog' as Iago stabs him.\n- Review everything Iago does across the play.",
      approach: "- Take a stance (the memo expects VALID)\n- Support it with his schemes and lack of remorse\n- Discuss critically",
      solution: "1. VALID: the words capture Iago's corrupt, villainous nature; his actions show malevolence and no moral compass.\n2. His schemes against Othello, Cassio and Desdemona, driven by jealousy, grievance and a thirst for power, his manipulation of Roderigo, his betrayal of Othello's trust and his cold-blooded violence are all damning, and he shows no remorse.\n3. 'Inhuman dog' captures his evil, dehumanising behaviour. A cogent 'invalid' is unlikely; 3 marks only with a critical discussion.",
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
