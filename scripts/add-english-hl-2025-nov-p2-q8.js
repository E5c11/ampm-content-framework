#!/usr/bin/env node
/**
 * DBE English HL P2 — November 2025 — Question 8 (order 9)
 * Essay: Pi's unusual approach to life becomes his greatest strength.
 * Practice set mirrors the real sub-questions' types with fresh targets (DESIGN-ENG-01/02,
 * DESIGN-UNI-01); aiExplanation covers the real exam sub-questions with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p2-q8.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p2-q8.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p2-q8.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p2/q9';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: "Question 8: Life of Pi — Essay",
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p2',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  text_key: "life_of_pi",
  tags: ["literary_essay","survival","faith","character_analysis"],
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
    text_key: "life_of_pi",
    context_text: null,
    question: "Pi practises Hinduism and Christianity. Which third religion does he follow?",
    metadata: ["Religion:","[ ]"],
    answer: ["Islam","","","",""],
    presentation: "fitb",
    type: "definition",
    unit: "novel",
    topic: "character_analysis",
    subtopic: "pi_religious_philosophy",
    skills: ["recall_text_knowledge"],
    difficulty: 1,
    exam_weight: 1,
    clues: "- Pi meets a Sufi baker who prays on a mat.",
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
    question: "Match each of Pi's survival strategies on the lifeboat to the way it helps him survive.",
    metadata: ["A - Building a raft tied to the lifeboat","B - Using a whistle and the rocking of the boat to train Richard Parker","C - Keeping a strict daily routine of tasks and prayer","1 - Gives structure that keeps his mind occupied and his spirits up","2 - Gives him a safe space of his own, away from the tiger","3 - Establishes Pi as the dominant animal so that the two can co-exist"],
    answer: ["A-2","B-3","C-1"],
    presentation: "match",
    type: "application",
    unit: "novel",
    topic: "character_analysis",
    subtopic: "coping_mechanisms",
    skills: ["trace_cause_and_effect"],
    difficulty: 3,
    exam_weight: 2,
    clues: "- One strategy is about physical safety, one about the tiger, one about his mind.",
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
    question: "Pi gives up his lifelong vegetarianism on the lifeboat. How can this be used to support the statement that his unusual approach to life becomes his greatest strength?",
    metadata: ["It shows flexibility: he adapts to survive, yet still grieves over each killing.","It shows that Pi never really believed in anything, so giving up his principles cost him nothing.","It proves that Pi always preferred meat and was only pretending to be a vegetarian at home.","It shows that hunger destroys Pi's faith entirely, so he stops praying for the rest of the voyage.",""],
    answer: ["It shows flexibility: he adapts to survive, yet still grieves over each killing.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "thematic_analysis",
    subtopic: "survival_instinct",
    skills: ["apply_concept_to_text"],
    difficulty: 3,
    exam_weight: 3,
    clues: "- How does Pi feel the first time he kills a fish?\n- Being able to bend without breaking can be a strength.",
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
    question: "At the end of the novel Pi asks the Japanese investigators which of his two stories they prefer. How does this support the essay statement?",
    metadata: ["It shows that Pi has forgotten what really happened and hopes the investigators will decide.","It reflects his view that a story with faith and imagination is as valuable as dry fact.","It shows that Pi wants the investigators to pay him for the story they find more exciting.","It shows that Pi dislikes the investigators and wants to confuse them with two versions.",""],
    answer: ["It reflects his view that a story with faith and imagination is as valuable as dry fact.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "thematic_analysis",
    subtopic: "faith_and_survival",
    skills: ["evaluate_authorial_message"],
    difficulty: 4,
    exam_weight: 3,
    clues: "- The investigators finally agree which story is better.\n- How does Pi link the better story to God?",
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
    question: "Which of the following is the strongest thesis statement for this essay?",
    metadata: ["'Life of Pi', a novel by Yann Martel, tells the story of a boy who is shipwrecked with a Bengal tiger.","In this essay I am going to describe everything that happens to Pi, from his childhood in Pondicherry to his rescue in Mexico.","Pi Patel grows up in Pondicherry, where his father owns a zoo, and later sails to Canada with his family.","Pi's blend of faith, reason and inventiveness, first seen when he renames himself, lets him survive 227 days at sea.",""],
    answer: ["Pi's blend of faith, reason and inventiveness, first seen when he renames himself, lets him survive 227 days at sea.","","","",""],
    presentation: "multiple_choice",
    type: "application",
    unit: "novel",
    topic: "literary_essay",
    subtopic: "critical_discussion",
    skills: ["identify_thesis_statement"],
    difficulty: 2,
    exam_weight: 2,
    clues: "- A thesis answers the question and previews the argument.\n- Background facts are not a thesis.",
  },
];

// ─── AI explanation — real exam sub-questions (AIEXP-08) ─────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: "8",
      marks: 25,
      clues: "- 'Unusual approach' covers his multiple religions, his renaming, his mix of faith and science, and his inventive survival methods.\n- 'Greatest strength' asks you to show how these things help him survive and find meaning.",
      approach: "- Introduction: take a stance (the memo expects agreement)\n- Body: Pondicherry (three religions, renaming himself) → lifeboat (raft, turtle-shell shield, training Richard Parker, routine, giving up vegetarianism) → the second story and Richard Parker as alter ego\n- Show in each paragraph how the unusual approach becomes a strength\n- Conclusion: return to the stance; 400–450 words",
      solution: "1. Pi's unorthodox approach gives him the tools to survive hardship both in Pondicherry and at sea: he combines faith and rationality and finds unique strategies, going beyond traditional thinking.\n2. Practising several religions shows flexibility, open-mindedness and compassion; he defends his position before his parents and the three religious leaders, and this pluralistic faith later comforts him and gives him resilience during his isolation.\n3. His clever response to the teasing about his name shows the resourcefulness he later uses on the lifeboat: building the raft, using a turtle shell as a shield and training Richard Parker. His knowledge of animal behaviour lets him co-exist with the tiger, which gives him purpose, companionship and sanity.\n4. He puts survival and meaning above strict norms (giving up vegetarianism), and in the human story Richard Parker as an alter ego lets him distance himself from the brutality he endured. Seeing his ordeal as a test of faith gives it purpose; he emerges a survivor through creativity, faith and adaptability.\n5. A cogent 'invalid' response is unlikely but is judged on merit. Marked with the rubric: 15 content, 10 structure and language.",
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
