#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 11 (Part 1) (order 13)
 * Extract E (Act 1, Scene 1): the guards on the battlements await the Ghost.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q11-1.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q11-1.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q11-1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q13';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 11 (Part 1): Hamlet — Extract E",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 13,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "hamlet",
  tags: ["contextual_questions","character_analysis","dramatic_irony","revenge"],
  question_image_urls: [`${BASE}/question_1.png`, `${BASE}/question_2.png`],
  memo_image_urls: [`${BASE}/memo_1.png`],
  exam_question_marks: 12,
  supplementary_materials: [
    { type: 'annexure', label: "Extract E", image_urls: [`${BASE}/annexure_e_1.png`, `${BASE}/annexure_e_2.png`] },
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
    question: "From which university town has Hamlet returned to Elsinore?",
    metadata: ["Town:","[ ]"],
    answer: ["Wittenberg","","","",""],
    presentation: "fitb",
    type: "definition",
    unit: "drama",
    topic: "plot_structure",
    subtopic: "scene_context",
    skills: ["recall_text_knowledge"],
    difficulty: 1,
    exam_weight: 1,
    clues: "- Claudius refuses to let Hamlet go back there.",
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
    question: "Denmark is preparing for war at the start of the play. Select the TWO signs of this that are described in the opening scene.",
    metadata: ["The guards have been issued with new uniforms","Cannons are being cast every day","Fortinbras has already captured Elsinore","Shipwrights are working through Sundays","The king has hired a company of actors"],
    answer: ["Cannons are being cast every day","Shipwrights are working through Sundays","","",""],
    presentation: "multi_select",
    type: "application",
    unit: "drama",
    topic: "plot_structure",
    subtopic: "scene_context",
    skills: ["recall_text_knowledge"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Marcellus asks why there is so much activity day and night.\n- Horatio explains the threat from young Fortinbras.",
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
    question: "In Act 1, Scene 2, Claudius asks Hamlet to think of him as a father and names him next in line to the throne. Why is this ironic?",
    metadata: ["It is ironic because Hamlet is not really Gertrude's son.","It is ironic because Claudius gives up the crown to Hamlet in the next scene.","Claudius murdered Hamlet's real father and stole the throne, and he later plots to have Hamlet killed.","There is no irony, because Claudius is sincerely devoted to Hamlet.",""],
    answer: ["Claudius murdered Hamlet's real father and stole the throne, and he later plots to have Hamlet killed.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "dramatic_techniques",
    subtopic: "irony_in_drama",
    skills: ["identify_irony"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- What do we later learn about how King Hamlet died?\n- What does Claudius arrange for Hamlet in England?",
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
    question: "'Something is rotten in the state of Denmark.' How does Marcellus's observation relate to the significance of honesty in the play?",
    metadata: ["It suggests corruption hidden beneath the court's surface: the truth about the king's murder is concealed, and until it is exposed the whole state is diseased.","It refers only to the bad weather on the battlements.","It shows that Marcellus wants to overthrow the king himself.","It means that the food served at the wedding feast has spoiled.",""],
    answer: ["It suggests corruption hidden beneath the court's surface: the truth about the king's murder is concealed, and until it is exposed the whole state is diseased.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "thematic_analysis",
    subtopic: "corruption_theme",
    skills: ["analyse_theme"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- 'Rotten' suggests decay beneath a surface.\n- What secret is the Ghost about to reveal?",
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
    question: "When the Ghost appears, Horatio challenges it to speak and then insists that Hamlet be told. What does this reveal about Horatio?",
    metadata: ["He is cowardly and runs from the battlements.","He is courageous and level-headed, and his loyalty to Hamlet leads him to share the truth rather than keep it secret.","He is gullible and believes every rumour he hears.","He is disloyal and plans to tell Claudius first.",""],
    answer: ["He is courageous and level-headed, and his loyalty to Hamlet leads him to share the truth rather than keep it secret.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "character_revelation",
    skills: ["analyse_characterisation"],
    difficulty: 2,
    exam_weight: 3,
    clues: "- Who speaks to the Ghost when the soldiers hesitate?\n- Why does he think Hamlet should know?",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "11.1",
      marks: 2,
      clues: "- What has happened to King Hamlet?\n- Who is king now, and whom has he married?",
      approach: "- State the death of the old king\n- State the new king and his marriage",
      solution: "1. King Hamlet has died (been murdered), and his brother Claudius has become king of Denmark.\n2. Claudius has married King Hamlet's widow, Gertrude.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "11.2",
      marks: 2,
      clues: "- What have the guards seen twice?\n- What is happening in Denmark politically?",
      approach: "- Give the Ghost as one reason\n- Give a second reason (its behaviour, or preparation for war)",
      solution: "1. The ghost of the old king, dressed in armour, has appeared to them twice without speaking and vanishes when approached or questioned, leaving them confused and uneasy.\n2. They are also anxious because Denmark appears to be preparing for war.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "11.3",
      marks: 2,
      clues: "- Who is the current king?\n- Does he deserve this loyalty, and does his reign last?",
      approach: "- Explain Bernardo's allegiance\n- Contrast it with what the audience later learns about Claudius",
      solution: "1. Bernardo's words show allegiance to the current king and a wish for his long reign.\n2. Ironically, Claudius does not deserve such loyalty, and his reign is cut short when Hamlet takes revenge.\n3. 2 marks for a clear understanding of irony.",
    },
    {
      number: "11.4",
      marks: 3,
      clues: "- Who in the play is honest, and who lies?\n- What happens to the dishonest characters by the end?",
      approach: "- Discuss Hamlet's struggle for truth amid dishonesty\n- Show the fates of the dishonest and those caught in lies\n- Draw a conclusion about honesty and justice",
      solution: "1. Surrounded by dishonesty, Hamlet struggles to uncover the truth about his father's death; he values honesty but must use deceit to confirm the Ghost's claims.\n2. Claudius, Polonius, Rosencrantz and Guildenstern use lies to serve their own interests and all meet untimely deaths; Ophelia and Gertrude, caught in the web of lies, also suffer tragic fates.\n3. The play shows that dishonesty leads to destruction and that the difficult pursuit of truth is necessary for justice. 3 marks only if well discussed.",
    },
    {
      number: "11.5",
      marks: 3,
      clues: "- Horatio calls the ghost 'our fantasy' and will not believe it.\n- Why have the guards brought him?",
      approach: "- Identify his scepticism and rationality\n- Explain why the guards value his judgement\n- Discuss two ideas",
      solution: "1. Horatio is sceptical, refusing to believe the guards' claims until he sees the ghost himself; he is rational and logical.\n2. The guards value and trust his opinion because he is educated and respected, so they want him to 'approve' their eyes and speak to it.\n3. 3 marks for two ideas well discussed.",
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
