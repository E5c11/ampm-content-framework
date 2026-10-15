#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 4.3: Hormones in the oestrus cycle (order 15)
 * Question 4.3 — reading a graph of oestrogen and progesterone, stages of the oestrus cycle and pregnancy. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l15.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l15.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l15.js
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
  "name": "Question 4.3: Hormones in the oestrus cycle",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 5,
  "tags": [
    "oestrus_cycle",
    "oestrogen_and_progesterone",
    "stages_of_oestrus"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q15/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q15/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q15/memo_2.png"
  ],
  "exam_question_marks": 5,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "According to the graph, on which day of the cycle is the progesterone level at its highest? []",
    "metadata": [
      "Day: ",
      "[ ]"
    ],
    "answer": [
      "12",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "reading",
    "unit": "animal_reproduction",
    "topic": "oestrus_cycle_and_hormones",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Follow the progesterone curve to its highest point and read down to the day axis.",
    "supplementary_material": {
      "type": "graph",
      "label": "Oestrogen and progesterone levels during the oestrus cycle of a cow (illustrative)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p1/q15/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Between Day 8 and Day 15 on the graph, the corpus luteum is fully active and progesterone is high. Which stage of the oestrus cycle is this?",
    "metadata": [
      "Pro-oestrus",
      "Oestrus",
      "Met-oestrus",
      "Di-oestrus",
      ""
    ],
    "answer": [
      "Di-oestrus",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "animal_reproduction",
    "topic": "oestrus_cycle_and_hormones",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The four stages follow each other: pro-oestrus, oestrus, met-oestrus, di-oestrus.",
    "supplementary_material": {
      "type": "graph",
      "label": "Oestrogen and progesterone levels during the oestrus cycle of a cow (illustrative)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p1/q15/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "By Day 18 the progesterone level on the graph is low and falling while oestrogen rises steeply. What can be concluded?",
    "metadata": [
      "The cow is pregnant and the foetus has implanted",
      "The cow was not pregnant and is approaching her next oestrus",
      "The cow has just ovulated for the first time",
      "The corpus luteum has become larger and more active",
      ""
    ],
    "answer": [
      "The cow was not pregnant and is approaching her next oestrus",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "animal_reproduction",
    "topic": "oestrus_cycle_and_hormones",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Progesterone is needed to maintain a pregnancy.",
    "supplementary_material": {
      "type": "graph",
      "label": "Oestrogen and progesterone levels during the oestrus cycle of a cow (illustrative)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p1/q15/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Select ALL the statements about the hormones of the oestrus cycle that are true.",
    "metadata": [
      "Progesterone is produced by the Graafian follicle",
      "Oestrogen causes the signs of heat",
      "Progesterone is produced by the corpus luteum",
      "Oestrogen is produced mainly by the corpus luteum",
      "High progesterone levels prevent a cow from coming on heat"
    ],
    "answer": [
      "Oestrogen causes the signs of heat",
      "Progesterone is produced by the corpus luteum",
      "High progesterone levels prevent a cow from coming on heat",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "oestrus_cycle_and_hormones",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Decide which structure makes each hormone."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.3.1",
      "marks": 1,
      "clues": "- Look at where the two curves meet.\n- Read the day on the horizontal axis.",
      "approach": "- Find the point on the graph where oestrogen and progesterone are equal near the second ovulation.\n- Read the day below that point.",
      "solution": "1. The two levels are equal on day 2, towards the onset of the second ovulation."
    },
    {
      "number": "4.3.2",
      "marks": 2,
      "clues": "- Compare the two hormones after the corpus luteum stops working.\n- Think about what the cow does next.",
      "approach": "- Describe the trend of progesterone after Day 1.\n- Describe the trend of oestrogen and what it leads to.",
      "solution": "1. Progesterone declines while oestrogen rises.\n2. The cow was able to go into a second oestrus cycle, so she was not pregnant."
    },
    {
      "number": "4.3.3",
      "marks": 1,
      "clues": "- Progesterone falls after day 15.\n- Think about the structure that makes progesterone.",
      "approach": "- Link the fall in progesterone to the corpus luteum.\n- Describe what happens to it.",
      "solution": "1. The corpus luteum degenerates (luteolysis occurs) after day 15."
    },
    {
      "number": "4.3.4",
      "marks": 1,
      "clues": "- Day 5 to Day 8 lies after oestrus.\n- Consider the four stages in order.",
      "approach": "- Recall the four stages of the oestrus cycle.\n- Place days 5 to 8 on the graph.",
      "solution": "1. The stage between day 5 and day 8 is met-oestrus."
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
