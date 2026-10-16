#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 1: Alimentary canal and absorption (Section A) (order 1)
 * Section A items on the alimentary canal: 1.1.1 large intestine, 1.1.4 oesophagus, 1.2.2 cud/chyme, 1.3.1 rumen papillae, 1.4.1 absorption. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l01.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l01.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l01.js
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
  "name": "Question 1: Alimentary canal and absorption (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "ruminant_digestion",
    "simple_stomach_digestion"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q1/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q1/question_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q1/question_5.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q1/question_6.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q1/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q1/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q1/memo_4.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each part of the digestive tract of a cow to its description.",
    "metadata": [
      "A - Papillae",
      "B - Caecum",
      "C - Rectum",
      "D - Ileum",
      "1 - Increase the surface of the rumen wall for absorbing fatty acids",
      "2 - Blind pouch where the small and large intestines meet",
      "3 - Final part of the large intestine that stores faeces",
      "4 - Final part of the small intestine, joined to the caecum"
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
    "topic": "alimentary_canals_and_digestion",
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
    "clues": "- The large intestine is made up of the caecum, colon and rectum.\n- The rumen wall is not smooth: it is lined with tiny projections."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the correct statements about the oesophagus of a farm animal.",
    "metadata": [
      "It is the first place where nutrients are absorbed",
      "It links the pharynx at the back of the mouth to the stomach",
      "It secretes enzymes that break down starch in the feed",
      "It stores feed until the animal chews it again",
      "It carries the bolus to the stomach by peristalsis"
    ],
    "answer": [
      "It links the pharynx at the back of the mouth to the stomach",
      "It carries the bolus to the stomach by peristalsis",
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
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The oesophagus is a muscular tube: think about what it connects and how food moves through it.\n- Absorption and feed storage happen further along the canal."
  },
  {
    "name": "Question 3",
    "question": "Decide whether the description applies to A only, B only, both A and B, or none of them. Description: the soft, acidic mass of partly digested feed that passes from the stomach into the duodenum. A: Cud. B: Chyme.",
    "metadata": [
      "A only",
      "B only",
      "Both A and B",
      "None",
      ""
    ],
    "answer": [
      "B only",
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
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Cud is brought back up into the mouth to be chewed again.\n- Which one leaves the stomach for the small intestine?"
  },
  {
    "name": "Question 4",
    "question": "Read the statement: \"Peristalsis is the movement of digested nutrient molecules from the small intestine into the bloodstream.\" Which word must replace \"Peristalsis\" to make the statement TRUE?",
    "metadata": [
      "Assimilation",
      "Rumination",
      "Absorption",
      "Egestion",
      ""
    ],
    "answer": [
      "Absorption",
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
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Peristalsis moves food along the canal; it does not move nutrients into the blood.\n- Which process takes nutrients through the intestine wall?"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- Name the three parts of the large intestine.\n- The odd one out belongs to the small intestine.",
      "approach": "- Recall the parts of the small intestine (duodenum, jejunum, ileum).\n- Recall the parts of the large intestine (caecum, colon, rectum).\n- Choose the option that is not in the large intestine.",
      "solution": "1. The rectum, colon and caecum form part of the large intestine.\n2. The ileum is the last part of the small intestine.\n3. Answer: D (Ileum)."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- Three statements are true and one is false.\n- Check where in the canal absorption actually begins.",
      "approach": "- Test each statement about the oesophagus.\n- Reject the statement about absorption.\n- Choose the combination of the true statements.",
      "solution": "1. The oesophagus connects the mouth with the stomach, carries the bolus and regulates swallowing: (i), (ii) and (iv) are true.\n2. Absorption starts in the small intestine, so (iii) is false.\n3. Answer: D ((i), (ii) and (iv))."
    },
    {
      "number": "1.2.2",
      "marks": 2,
      "clues": "- A regurgitated bolus is brought back up into the mouth.\n- Chyme moves on into the small intestine.",
      "approach": "- Decide whether the description fits cud.\n- Decide whether it fits chyme.\n- Choose A only, B only, both or none.",
      "solution": "1. Cud is the regurgitated bolus that is chewed again in the mouth.\n2. Chyme is the semi-liquid mass that leaves the stomach.\n3. Answer: A only."
    },
    {
      "number": "1.3.1",
      "marks": 2,
      "clues": "- Think of the inner lining of the rumen.\n- The projections increase the surface area for absorption.",
      "approach": "- Recall the structure of the rumen wall.\n- Give the collective name of its finger-like projections.",
      "solution": "1. The rumen wall is covered with finger-like protrusions.\n2. Answer: Papillae."
    },
    {
      "number": "1.4.1",
      "marks": 1,
      "clues": "- Mastication means chewing.\n- Which process moves nutrients into the blood?",
      "approach": "- Identify what the statement describes.\n- Replace the underlined word with the correct process.",
      "solution": "1. Moving water and nutrient molecules from the small intestine into the bloodstream is absorption, not mastication.\n2. Answer: Absorption."
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
