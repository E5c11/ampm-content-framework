#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 12 (order 15)
 * Essay: deception and disguise are central to shaping the actions of the characters in Othello (minimum two characters).
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q12.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q12.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q12.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q15';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 12: Othello — Essay",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 15,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "othello",
  tags: ["literary_essay","manipulation","jealousy","character_analysis"],
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
    text_key: "othello",
    context_text: null,
    question: "Which object does Iago use as 'ocular proof' of Desdemona's supposed unfaithfulness?",
    metadata: ["Object:","[ ]"],
    answer: ["Handkerchief|The handkerchief|A handkerchief","","","",""],
    presentation: "fitb",
    type: "definition",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "iago_manipulation_method",
    skills: ["recall_text_knowledge"],
    difficulty: 1,
    exam_weight: 1,
    clues: "- It was Othello's first gift to Desdemona.",
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
    question: "Match each character in 'Othello' to the part they play in the deception.",
    metadata: ["A - Iago","B - Emilia","C - Roderigo","1 - Is fooled into handing over his money in the hope of winning Desdemona","2 - Plants Desdemona's handkerchief in Cassio's lodging","3 - Tells Desdemona she does not know where the handkerchief is"],
    answer: ["A-2","B-3","C-1"],
    presentation: "match",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "character_method",
    skills: ["analyse_character"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Who picks up the handkerchief first, and who uses it?\n- \"Put money in thy purse.\"",
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
    question: "Why is Othello especially vulnerable to Iago's deception?",
    metadata: ["He has distrusted Desdemona from the day they met, so he is ready to believe the worst.","As an insecure outsider in Venice, he trusts 'honest Iago' completely.","He is an inexperienced young soldier who has never had to think clearly under pressure.","He has overheard Desdemona confessing her love for Cassio to Emilia in the castle garden.",""],
    answer: ["As an insecure outsider in Venice, he trusts 'honest Iago' completely.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "othello_psychological_state",
    skills: ["analyse_characterisation"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- What does Othello say about himself (\"Haply for I am black…\")?\n- Whom does he trust most?",
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
    question: "How can Othello be seen as both a victim AND a perpetrator of deception?",
    metadata: ["He deceives the Senate about his secret marriage and is later punished by Venice for that lie.","He is never truly deceived, since he knows all along that Iago is lying and plays along with it.","He pretends to be jealous in order to test Desdemona's loyalty, and the test goes wrong.","He is deceived by Iago, yet also deceives himself that Desdemona is guilty and must die.",""],
    answer: ["He is deceived by Iago, yet also deceives himself that Desdemona is guilty and must die.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "literary_essay",
    subtopic: "critical_discussion",
    skills: ["evaluate_argument"],
    difficulty: 4,
    exam_weight: 3,
    clues: "- Who lies to Othello?\n- What does Othello tell himself before killing Desdemona (\"It is the cause\")?",
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
    question: "Which topic sentence best introduces a paragraph on Desdemona in this essay?",
    metadata: ["Desdemona is the daughter of Brabantio, a senator, and she marries Othello in secret in Act 1.","In the next paragraph I will talk about Desdemona and the part that she plays in the tragedy.","Desdemona sings the sad Willow Song in Act 4 while Emilia helps her to prepare for bed that night.","Though Desdemona never deceives, Iago's false appearances make her innocence look like guilt.",""],
    answer: ["Though Desdemona never deceives, Iago's false appearances make her innocence look like guilt.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "literary_essay",
    subtopic: "critical_discussion",
    skills: ["identify_topic_sentence"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- A topic sentence links the paragraph's point to the essay statement.",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "12",
      marks: 25,
      clues: "- Show how deception and disguise SHAPE characters' actions, not just that they exist.\n- Refer to at least TWO characters; Iago and Othello are the obvious pair, with Desdemona and Emilia adding depth.",
      approach: "- Introduction: take a stance\n- Iago: false loyalty ('honest Iago'), manipulation of Roderigo, Cassio and Othello, the fabricated 'evidence'\n- Othello: insecurity, trust in Iago, self-deception, the murder and his downfall\n- Desdemona and Emilia as victims of false appearances; conclude; 400–450 words",
      solution: "1. Through manipulated truth and false appearances, Iago, Othello and Desdemona are caught in a web of lies that ends in destruction.\n2. Iago poses as Othello's loyal ensign while plotting his ruin, uses language to disguise his intentions, feigns honesty ('honest Iago') to sow jealousy, deceives Roderigo by pretending to be his friend, and hides his plan to destroy Cassio behind friendship.\n3. Othello's status disguises his insecurity as an outsider, making him vulnerable; trust in Iago blinds him, and fabricated 'evidence' convinces him of a false reality. He becomes both victim and perpetrator, deceiving himself about Desdemona and about the justice of his act, which leads to her murder and his downfall.\n4. Desdemona never deceives, but her innocence is overshadowed by false perceptions; the lost handkerchief is used against her and she cannot defend herself. Emilia deceives about the handkerchief but finally reveals the truth about Iago.\n5. Marked with the rubric: 15 content, 10 structure and language.",
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
