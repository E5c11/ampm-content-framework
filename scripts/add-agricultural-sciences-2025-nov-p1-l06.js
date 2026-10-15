#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 2.1–2.2: Digestion and the accessory glands (order 6)
 * Question 2.1–2.2 — the flow of feed through the pig’s alimentary canal, hydrochloric acid, and the liver, pancreas and bile. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l06.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l06.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l06.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 2.1–2.2: Digestion and the accessory glands",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "simple_stomach_digestion",
    "accessory_glands",
    "bile_and_emulsification"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q6/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Hydrochloric acid is secreted into the stomach of a pig. Which statement describes one of its functions?",
    "metadata": [
      "It emulsifies fat so that lipase can act on it",
      "It digests fats into fatty acids and glycerol",
      "It breaks cellulose down into volatile fatty acids",
      "It changes inactive pepsinogen into active pepsin",
      ""
    ],
    "answer": [
      "It changes inactive pepsinogen into active pepsin",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_nutrition",
    "topic": "alimentary_canals_and_digestion",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The stomach acid prepares an enzyme for protein digestion.\n- Fat digestion and fibre digestion happen elsewhere."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the statements that are true for digestion in the mouth of a pig.",
    "metadata": [
      "Pepsin digests the protein in the feed",
      "Salivary amylase begins to digest starch",
      "Bile is mixed into the feed to emulsify the fat",
      "Teeth crush the feed into smaller pieces",
      "Microbes ferment the cellulose in the feed"
    ],
    "answer": [
      "Salivary amylase begins to digest starch",
      "Teeth crush the feed into smaller pieces",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "alimentary_canals_and_digestion",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Digestion in the mouth is both mechanical and chemical.\n- Pigs have a simple stomach, not a rumen."
  },
  {
    "name": "Question 3",
    "question": "Match each organ of the digestive system to what it produces or stores.",
    "metadata": [
      "A - Salivary glands",
      "B - Liver",
      "C - Pancreas",
      "D - Stomach wall",
      "1 - Amylase that starts starch digestion",
      "2 - Bile and stored glycogen",
      "3 - Lipase, amylase and proteases",
      "4 - Hydrochloric acid and pepsin"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "animal_nutrition",
    "topic": "accessory_glands_of_digestion",
    "subtopic": "agri_classification",
    "skills": [
      "identify_structure_by_function"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1"
  },
  {
    "name": "Question 4",
    "question": "Bile emulsifies fat before it is digested. Why is this important?",
    "metadata": [
      "It removes the water from the fat droplets",
      "It changes the fat into protein that can be absorbed",
      "It slows down lipase so that it does not damage the gut",
      "It increases the surface area on which lipase can act",
      ""
    ],
    "answer": [
      "It increases the surface area on which lipase can act",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "accessory_glands_of_digestion",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about what happens to the size of the fat droplets.\n- Enzymes work only at the surface of what they digest."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1.1",
      "marks": 1,
      "clues": "- The flow chart shows salivary amylase in the mouth and one simple stomach.\n- Which farm animals have this arrangement?",
      "approach": "- Read the flow chart from ingestion to the intestines.\n- Match the pattern to a non-ruminant farm animal.",
      "solution": "1. The chart shows chemical digestion in the mouth followed by a simple stomach, which is the digestive system of a pig."
    },
    {
      "number": "2.1.2",
      "marks": 1,
      "clues": "- Look at what the chart shows happening in the mouth.\n- Think about what a ruminant would have that this chart does not.",
      "approach": "- Identify the enzyme and the type of digestion shown in the mouth.\n- Link this to the single stomach in the chart.",
      "solution": "1. Salivary amylase is present in the mouth, there is both physical and chemical digestion in the mouth, and the chart shows the route of a simple stomach."
    },
    {
      "number": "2.1.3",
      "marks": 1,
      "clues": "- Think about what a pig uses to pick up and take in feed.\n- You need to name only one part.",
      "approach": "- Recall the parts of the head used in ingestion.\n- Choose one that applies to a pig.",
      "solution": "1. The snout, lips or teeth help a pig to take in feed (the tongue is also accepted)."
    },
    {
      "number": "2.1.4",
      "marks": 1,
      "clues": "- Part A lies between the mouth and the stomach.\n- It is the tube through which the swallowed feed travels.",
      "approach": "- Follow the flow chart from the mouth to the stomach.\n- Name the part in between.",
      "solution": "1. Part A is the oesophagus (gullet)."
    },
    {
      "number": "2.1.5",
      "marks": 1,
      "clues": "- Think about what stomach acid does to bacteria and to enzymes.\n- You need only one function.",
      "approach": "- Recall the roles of hydrochloric acid in the stomach.\n- Pick one function.",
      "solution": "1. Hydrochloric acid kills bacteria, neutralises the alkaline saliva, lowers the pH of the stomach or activates pepsinogen to pepsin."
    },
    {
      "number": "2.2.1",
      "marks": 1,
      "clues": "- Part B lies against the first part of the small intestine.\n- It has a grainy appearance in the diagram.",
      "approach": "- Study the accessory glands in the diagram.\n- Identify the gland that makes enzymes and insulin.",
      "solution": "1. Part B is the pancreas."
    },
    {
      "number": "2.2.2",
      "marks": 1,
      "clues": "- The pancreas makes several digestive enzymes.\n- You need only one.",
      "approach": "- Recall the enzymes in pancreatic juice.\n- Name one that digests starch, fat or protein.",
      "solution": "1. The pancreas secretes amylase, lipase and proteolytic enzymes (such as trypsin); any one is correct."
    },
    {
      "number": "2.2.3",
      "marks": 1,
      "clues": "- Part A is the large gland above the gall bladder.\n- It has many functions; you need one.",
      "approach": "- Identify part A first.\n- Recall one function of that gland.",
      "solution": "1. Part A is the liver; one function is to secrete bile (it also stores glycogen and detoxifies poisons)."
    },
    {
      "number": "2.2.4",
      "marks": 2,
      "clues": "- Think about what bile does to large fat droplets.\n- Link the size of the droplets to enzyme action.",
      "approach": "- Identify part C and its liquid (bile).\n- Say what emulsification does to fat.\n- Link this to the action of lipase.",
      "solution": "1. Emulsification breaks fat into very small droplets, which increases the surface area.\n2. A larger surface area allows lipase to act on the fat more quickly."
    }
  ],
  "model": "claude-sonnet-5-5",
  "generated_at": Date.now(),
  "version": 2,
  "reviewed": false,
  "input_tokens": 0,
  "output_tokens": 0,
  "avg_rating": null,
  "rating_count": null
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

  // Exam gate (VER-02/VER-04/VER-09): derive the exam minimum from the rows now in the database and write it. Dev only; no-op at the floor.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
