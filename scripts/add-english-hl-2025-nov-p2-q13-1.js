#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 13 (Part 1) (order 16)
 * Extract G (Act 1, Scene 2): Brabantio accuses Othello of enchanting Desdemona.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q13-1.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q13-1.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q13-1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q16';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 13 (Part 1): Othello — Extract G",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 16,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "othello",
  tags: ["contextual_questions","character_analysis","prejudice","manipulation"],
  question_image_urls: [`${BASE}/question_1.png`],
  memo_image_urls: [`${BASE}/memo_1.png`],
  exam_question_marks: 12,
  supplementary_materials: [
    { type: 'annexure', label: "Extract G", image_urls: [`${BASE}/annexure_g_1.png`, `${BASE}/annexure_g_2.png`] },
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
    question: "Arrange these events from Act 1 of 'Othello' in the order in which they occur.",
    metadata: ["Othello defends himself before the Senate","Othello is ordered to Cyprus","Iago and Roderigo wake Brabantio","Desdemona confirms her love for Othello","Brabantio confronts Othello in the street"],
    answer: ["Iago and Roderigo wake Brabantio","Brabantio confronts Othello in the street","Othello defends himself before the Senate","Desdemona confirms her love for Othello","Othello is ordered to Cyprus"],
    presentation: "ordering",
    type: "application",
    unit: "drama",
    topic: "plot_structure",
    subtopic: "scene_context",
    skills: ["sequence_plot_events"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Othello asks for Desdemona to be sent for so that she can speak for herself.",
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
    question: "Before the Senate, Brabantio describes Desdemona as 'A maiden never bold'. What does this description reveal about his attitude?",
    metadata: ["He is proud that Desdemona has shown such courage in choosing Othello.","He thinks Desdemona is too bold and deserves to be punished.","He cannot believe that his obedient daughter would freely choose Othello, which reveals his prejudice and his view of her as his possession.","He is praising Othello for bringing out his daughter's confidence.",""],
    answer: ["He cannot believe that his obedient daughter would freely choose Othello, which reveals his prejudice and his view of her as his possession.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "prejudice_in_language",
    skills: ["infer_speaker_attitude"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- If she is \"never bold\", how does he explain her elopement?\n- What does he accuse Othello of using?",
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
    question: "Which enemy's fleet threatens Cyprus, causing the Senate to send Othello there?",
    metadata: ["Enemy:","[ ]"],
    answer: ["Turkish|The Turks|Turks|Ottoman|The Turkish fleet","","","",""],
    presentation: "fitb",
    type: "definition",
    unit: "drama",
    topic: "plot_structure",
    subtopic: "sequence_of_events",
    skills: ["recall_text_knowledge"],
    difficulty: 1,
    exam_weight: 1,
    clues: "- The fleet is later destroyed by a storm.",
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
    question: "If you were directing Othello's speech to the Senate beginning 'Most potent, grave, and reverend signiors', how should the actor deliver it?",
    metadata: ["Shouting angrily and drawing his sword, because he wants to frighten the senators.","Standing tall and addressing the senators in a calm, respectful and confident tone, because he trusts that an honest account will clear him of the charges.","Mumbling with his head down, because he is ashamed of his marriage.","Laughing mockingly at Brabantio, because he finds the charges ridiculous.",""],
    answer: ["Standing tall and addressing the senators in a calm, respectful and confident tone, because he trusts that an honest account will clear him of the charges.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "dramatic_techniques",
    subtopic: "stage_direction",
    skills: ["direct_performance"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- How does Othello speak about himself and his wooing in this speech?\n- He is a respected general before the highest authority in Venice.",
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
    question: "Desdemona tells the Senate that she owes duty to her father but now also to her husband. What impression does this create of her?",
    metadata: ["She is timid and does whatever her father tells her.","She is respectful yet firm and independent, calmly defending her own choice of husband before the Senate.","She is rude and openly insults her father.","She is confused and unsure whom she has married.",""],
    answer: ["She is respectful yet firm and independent, calmly defending her own choice of husband before the Senate.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "drama",
    topic: "character_analysis",
    subtopic: "desdemona_role",
    skills: ["analyse_characterisation"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Does she deny her father any respect?\n- Does she back down about her marriage?",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "13.1",
      marks: 2,
      clues: "- Who woke Brabantio and what did they tell him?\n- Where have they led him?",
      approach: "- Name who informed Brabantio and of what\n- State where Roderigo leads him",
      solution: "1. Iago and Roderigo have told Brabantio that his daughter Desdemona has married Othello.\n2. Roderigo leads Brabantio and his officers to the inn where Othello and Desdemona are staying.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "13.2",
      marks: 2,
      clues: "- Brabantio uses words such as 'enchanted' and 'magic'.\n- Why can he not accept that she chose Othello?",
      approach: "- Name his attitude (1 mark)\n- Explain with reference to the lines (1 mark)",
      solution: "1. Brabantio is racist or prejudiced.\n2. He does not believe Othello could win Desdemona's heart by normal means and implies he used unnatural means ('enchanted', 'magic').\n3. 1 mark for attitude, 1 for explanation.",
    },
    {
      number: "13.3",
      marks: 2,
      clues: "- What is threatening Venice?\n- What is Othello's role in the state?",
      approach: "- Give the urgent military reason\n- Explain why Othello specifically is needed",
      solution: "1. An urgent military matter requires Othello's presence.\n2. As a respected military leader, he is needed to lead the Venetian army against the Turks.\n3. Two distinct points earn 2 marks.",
    },
    {
      number: "13.4",
      marks: 3,
      clues: "- Othello stops both sides from fighting.\n- He speaks to an angry senator while the Duke's messengers wait.",
      approach: "- Give body language\n- Give tone\n- Motivate both",
      solution: "1. Othello might hold up his hand to stop the guards, stand tall, gaze steadily at Brabantio, or gesture towards the Duke's messengers.\n2. His tone might be calm, placating, composed or authoritative.\n3. Motivation: he responds in a controlled way, respecting Brabantio while trying to resolve the situation diplomatically without escalating it. 3 marks only if body language, tone and motivation are given.",
    },
    {
      number: "13.5",
      marks: 3,
      clues: "- How does Brabantio describe her ('tender, fair, and happy')?\n- She 'shunned the wealthy curled darlings' of Venice.",
      approach: "- Give one impression (pure, innocent, controlled by others)\n- Give a contrasting impression (strong-willed, independent)\n- Discuss both",
      solution: "1. Desdemona may appear pure, innocent and naive, under some external control rather than making her own decisions.\n2. She also appears strong-willed, independent and defiant, having shunned the 'wealthy curled darlings' who wooed her and chosen an outsider like Othello.\n3. Mixed responses are credited; 3 marks for two ideas well discussed.",
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
