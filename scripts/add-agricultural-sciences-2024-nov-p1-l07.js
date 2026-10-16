#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 2.1–2.2: Accessory glands, bile and rumen micro-organisms (order 7)
 * Question 2.1–2.2 — the liver, pancreas and intestinal glands, the functions of bile, and the needs and functions of rumen micro-organisms. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l07.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l07.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l07.js
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
  "name": "Question 2.1–2.2: Accessory glands, bile and rumen micro-organisms",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "accessory_glands",
    "bile_and_emulsification",
    "rumen_microbes"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q7/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q7/memo_1.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each digestive organ of a pig to its function.",
    "metadata": [
      "A - Liver",
      "B - Gall bladder",
      "C - Pancreas",
      "D - Salivary glands",
      "1 - Produces bile, which emulsifies fats",
      "2 - Stores bile until it is needed",
      "3 - Releases trypsin and lipase into the duodenum",
      "4 - Moisten feed so that it is easy to swallow"
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
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Bile is made in one organ and stored in another.\n- The organ that releases enzymes into the duodenum also makes insulin."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the functions of bile in the digestive system of a farm animal.",
    "metadata": [
      "It breaks proteins into amino acids",
      "It emulsifies fats into small droplets",
      "It digests cellulose in the rumen",
      "It neutralises the acidic chyme",
      "It helps to absorb fat-soluble vitamins"
    ],
    "answer": [
      "It emulsifies fats into small droplets",
      "It neutralises the acidic chyme",
      "It helps to absorb fat-soluble vitamins",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "accessory_glands_of_digestion",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Bile is alkaline and contains no digestive enzymes.\n- Think about what it does to fat and to the acid from the stomach."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the conditions that rumen micro-organisms need to function normally.",
    "metadata": [
      "No oxygen (anaerobic conditions)",
      "A strongly acidic pH of below 3",
      "A slightly acidic pH of 5,5–6,5",
      "A warm temperature of 38–42 °C",
      "A steady supply of fresh oxygen"
    ],
    "answer": [
      "No oxygen (anaerobic conditions)",
      "A slightly acidic pH of 5,5–6,5",
      "A warm temperature of 38–42 °C",
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
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The rumen is a closed fermentation chamber at body temperature.\n- Very acidic conditions kill many of the microbes."
  },
  {
    "name": "Question 4",
    "question": "A cow can live on poor grass that is low in protein, while a pig fed the same grass would lose condition. What explains the difference?",
    "metadata": [
      "The saliva of the cow has enzymes that digest cellulose",
      "The small intestine of the cow absorbs fibre directly",
      "Rumen microbes build protein from non-protein nitrogen",
      "The liver of the cow changes cellulose into amino acids",
      ""
    ],
    "answer": [
      "Rumen microbes build protein from non-protein nitrogen",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_nutrition",
    "topic": "alimentary_canals_and_digestion",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The cow does not digest cellulose with its own enzymes.\n- What do the micro-organisms in the rumen make that the cow can use?"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1.1",
      "marks": 2,
      "clues": "- A is a large organ next to the gall bladder.\n- B lies in the loop of the duodenum.",
      "approach": "- Use the position of each part relative to the gall bladder and duodenum.\n- Name the two accessory organs.",
      "solution": "1. A is the liver.\n2. B is the pancreas."
    },
    {
      "number": "2.1.2",
      "marks": 2,
      "clues": "- The liver secretes bile, an alkaline substance.\n- Think about what bile does to fats and to acidic chyme.",
      "approach": "- Recall the functions of bile.\n- Give any two.",
      "solution": "1. Bile activates lipase, emulsifies fats and improves the absorption of fatty acids, glycerol and the fat-soluble vitamins A, D, E and K.\n2. It also neutralises the chyme from the stomach.\n3. Any two of these earn the marks."
    },
    {
      "number": "2.1.3",
      "marks": 1,
      "clues": "- Part C is the small intestine.\n- Its glands are named after the scientists who described them.",
      "approach": "- Identify part C.\n- Name one gland in its wall.",
      "solution": "1. Part C is the small intestine.\n2. Intestinal glands: crypts of Lieberkühn or Brunner's (duodenal) glands."
    },
    {
      "number": "2.2.1",
      "marks": 2,
      "clues": "- The rumen is a closed fermentation chamber.\n- Think about what the microbes need to live and work there.",
      "approach": "- Recall the conditions inside a healthy rumen.\n- Give any two requirements.",
      "solution": "1. Anaerobic conditions, carbon dioxide, a pH of 5,5–6,5 and a temperature of 38–42 °C.\n2. A regular intake of food, removal of waste products, moisture and sufficient nutrients.\n3. Any two earn the marks."
    },
    {
      "number": "2.2.2",
      "marks": 1,
      "clues": "- The micro-organisms digest what the cow cannot.\n- They also make nutrients.",
      "approach": "- Recall what rumen micro-organisms do.\n- State one function.",
      "solution": "1. They digest cellulose and hemicellulose, hydrolyse proteins, and synthesise vitamins and amino acids (any one)."
    },
    {
      "number": "2.2.3",
      "marks": 1,
      "clues": "- Bacteria and protozoa are the largest groups.\n- Name one of the smaller groups.",
      "approach": "- Recall the groups of rumen micro-organisms.\n- Name one with the smallest population.",
      "solution": "1. Fungi, viruses or archaea form the smallest population (any one)."
    }
  ],
  "model": "claude-opus-5-5",
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

  // Exam gate (VER-02/VER-04, tools/apply-exam-gate.js): derive the exam's minimum app version from the rows now in the
  // database and write it to exam_versions, bumping updated_at on the exam's rows. Dev only; a no-op when the derived
  // minimum is the floor (VER-07); idempotent. The gate is per EXAM, so it also gates the sibling papers.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
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
