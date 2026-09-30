#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 6 (order 6)
 * Essay: Dorian Gray is too morally weak to stop his nature from changing.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q6.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q6.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q6.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q6';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 6: The Picture of Dorian Gray — Essay",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "dorian_gray",
  tags: ["literary_essay","moral_corruption","character_analysis","aestheticism"],
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
    text_key: "dorian_gray",
    context_text: null,
    question: "Arrange these events from 'The Picture of Dorian Gray' in the order in which they occur.",
    metadata: ["Dorian hides the portrait in the old schoolroom","Dorian stabs the portrait and is found dead","Dorian wishes that the portrait would age instead of him","Dorian murders Basil Hallward","Dorian rejects Sibyl Vane and sees cruelty in the portrait"],
    answer: ["Dorian wishes that the portrait would age instead of him","Dorian rejects Sibyl Vane and sees cruelty in the portrait","Dorian hides the portrait in the old schoolroom","Dorian murders Basil Hallward","Dorian stabs the portrait and is found dead"],
    presentation: "ordering",
    type: "application",
    unit: "novel",
    topic: "plot_structure",
    subtopic: "sequence_of_events",
    skills: ["sequence_plot_events"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- The wish is made while the portrait is newly finished.\n- The novel ends with the portrait restored and its owner changed.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 2",
    order: 2,
    text_key: "dorian_gray",
    context_text: null,
    question: "Match each influence on Dorian to the role it plays in his changing nature.",
    metadata: ["A - Lord Henry Wotton","B - The portrait","C - The 'yellow book'","1 - Becomes a guide that shapes his decadent tastes and way of life","2 - Introduces him to the philosophy of hedonism and the worship of youth","3 - Bears the marks of his sins so that he can sin without visible consequence"],
    answer: ["A-2","B-3","C-1"],
    presentation: "match",
    type: "application",
    unit: "novel",
    topic: "character_analysis",
    subtopic: "influence_and_corruption",
    skills: ["analyse_character"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- One influence is a person, one is a painting and one is a book.\n- Which one works like a mirror of his soul?",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 3",
    order: 3,
    text_key: "dorian_gray",
    context_text: null,
    question: "Dorian resolves to change his ways more than once, for example after Sibyl's death and near the end of the novel. How does this affect the statement that he is 'too morally weak to stop his nature from changing'?",
    metadata: ["It disproves it: his resolutions show that he successfully reforms and becomes good by the end.","It is irrelevant: Dorian never once shows any awareness that his behaviour is wrong or harmful.","It supports it: he knows what is right, yet each resolution soon collapses into self-interest.","It proves that Lord Henry, not Dorian, forces him to break every promise he makes.",""],
    answer: ["It supports it: he knows what is right, yet each resolution soon collapses into self-interest.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "literary_essay",
    subtopic: "critical_discussion",
    skills: ["evaluate_argument"],
    difficulty: 4,
    exam_weight: 3,
    clues: "- Does Dorian keep his good resolutions?\n- Moral weakness means knowing what is right but failing to act on it.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 4",
    order: 4,
    text_key: "dorian_gray",
    context_text: null,
    question: "Which piece of evidence would best support an argument that Dorian's corruption has become complete?",
    metadata: ["He admires the beauty of the portrait when Basil first finishes painting it in the studio.","He murders Basil and blackmails Alan Campbell into destroying the body, without remorse.","He falls passionately in love with Sibyl Vane after watching her play Juliet on stage.","He listens eagerly to Lord Henry's theories about youth and pleasure in Basil's garden.",""],
    answer: ["He murders Basil and blackmails Alan Campbell into destroying the body, without remorse.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "character_analysis",
    subtopic: "moral_decline",
    skills: ["use_textual_evidence"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- The strongest evidence comes from late in the novel.\n- Look for the most serious crime and his reaction to it.",
  },
  {
    xp: 10,
    syllabus: "dbe",
    subject: "english_hl",
    year: 2025,
    paper: "nov_p2",
    name: "Question 5",
    order: 5,
    text_key: "dorian_gray",
    context_text: null,
    question: "Which of the following is the strongest thesis statement for this essay?",
    metadata: ["'The Picture of Dorian Gray', published by Oscar Wilde in 1890, tells the story of a young man and his portrait.","In this essay I will retell the story of Dorian Gray from the first chapter to the last and describe each of the main characters.","Dorian Gray is a handsome young man who has his portrait painted and later becomes a very different person.","Although others tempt him, Dorian's repeated failure to resist vanity and pleasure proves he is too morally weak to change.",""],
    answer: ["Although others tempt him, Dorian's repeated failure to resist vanity and pleasure proves he is too morally weak to change.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "literary_essay",
    subtopic: "critical_discussion",
    skills: ["identify_thesis_statement"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- A thesis takes a clear position on the statement.\n- Facts and plot summary are not arguments.",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "6",
      marks: 25,
      clues: "- The statement makes two claims: Dorian's nature changes, and he is too weak to stop it.\n- Trace the change from innocent youth to murderer, and look for moments where he could have stopped.\n- The memo accepts VALID, INVALID or mixed stances if argued with evidence.",
      approach: "- Introduction: take a clear stance on the statement\n- Body: follow the stages of change (Lord Henry's influence, the wish, Sibyl, the yellow book, hidden portrait, crimes) and show his failure to resist at each stage\n- Address counter-evidence (moments of regret, the attempt to destroy the portrait)\n- Conclusion: return to the stance; 400–450 words",
      solution: "1. VALID: Dorian's changing nature is tied to his descent into decadence as he indulges his vices. His innocence and impressionability leave him open to Lord Henry's hedonism, and his vanity leads to the wish that the portrait should age instead of him.\n2. His callous rejection of Sibyl leads to her suicide and is his first step into depravity. The portrait lets him indulge without visible consequences, and hiding it shows his attempt to conceal his corruption from the world and himself.\n3. Despite moments of regret, his moral weakness pulls him back each time; his crimes escalate to debauchery and murder (Basil), causing the deaths of Alan Campbell and James Vane as well. His final attack on the portrait is an immature attempt to undo the damage, and his death shows the transformation is irreversible.\n4. INVALID: one may argue his nature does not change at all — influences merely reveal latent weakness — or that his regret and destruction of the portrait show some remaining moral awareness.\n5. Marked with the novel/drama rubric: 15 marks for content and 10 for structure and language.",
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
