#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 3.2–3.3: Labour productivity and labour contracts (order 13)
 * Question 3.2–3.3 — labour productivity, the labour problems that a farmer can address and the components of a labour contract. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l13.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l13.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l13.js
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
  "name": "Question 3.2–3.3: Labour productivity and labour contracts",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 13,
  "content_tier": "free",
  "has_video": false,
  "xp": 11,
  "tags": [
    "farm_labour_productivity",
    "labour_problems",
    "labour_contract"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q13/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q13/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q13/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q13/memo_2.png"
  ],
  "exam_question_marks": 11,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the statements that are true about labour productivity.",
    "metadata": [
      "It is not affected by the tools that workers use",
      "It measures the output per unit of labour input",
      "It relates output to the wages that are paid",
      "It rises when workers are better trained",
      "It falls when workers receive training"
    ],
    "answer": [
      "It measures the output per unit of labour input",
      "It relates output to the wages that are paid",
      "It rises when workers are better trained",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "production_factors",
    "topic": "labour_productivity",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Productivity compares what is produced with what is put in."
  },
  {
    "name": "Question 2",
    "question": "Match each labour problem to the measure that addresses it.",
    "metadata": [
      "A - Lack of skills",
      "B - Poor living conditions",
      "C - Illness and absenteeism",
      "D - Slow, tiring manual work",
      "1 - Establish a training centre",
      "2 - Provide secure houses for workers",
      "3 - Provide health care and awareness programmes",
      "4 - Buy tractors and harvesters"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "production_factors",
    "topic": "labour_productivity",
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
    "paper": "nov_p2"
  },
  {
    "name": "Question 3",
    "question": "Look at the contract extract. Which component of the contract is represented by number 5?",
    "metadata": [
      "Term of employment",
      "Working hours",
      "Mode of payment",
      "Leave",
      ""
    ],
    "answer": [
      "Mode of payment",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "production_factors",
    "topic": "labour_contracts",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Read the item next to the number and decide what it describes.",
    "supplementary_material": {
      "type": "table",
      "label": "Extract from a labour contract (illustrative)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p2/q13/table_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Which item in the contract extract helps the farmer to comply with the Occupational Health and Safety Act, 1993?",
    "metadata": [
      "Wage paid every second Friday",
      "Tractor driver",
      "Dust mask and ear protection",
      "21 consecutive days paid leave per year",
      ""
    ],
    "answer": [
      "Dust mask and ear protection",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "production_factors",
    "topic": "labour_contracts",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The Act protects the health and safety of workers at work.",
    "supplementary_material": {
      "type": "table",
      "label": "Extract from a labour contract (illustrative)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p2/q13/table_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2.1",
      "marks": 2,
      "clues": "- Productivity compares output with input.\n- Mention wages or the labour force.",
      "approach": "- Recall the definition.\n- State the relationship between output and input.",
      "solution": "1. Labour productivity is the production output of the labour force in relation to the money paid as wages, or the output per unit of labour input."
    },
    {
      "number": "3.2.2",
      "marks": 3,
      "clues": "- Match the measure to the problem it addresses.\n- Do each part separately.",
      "approach": "- (a) Training centres address a lack of skills.\n- (b) Condoms and ARVs address illness and absenteeism.\n- (c) Secure houses address living conditions.",
      "solution": "1. B: lack of skills (training).\n2. C: HIV and AIDS, disease or absenteeism.\n3. D: living conditions."
    },
    {
      "number": "3.2.3",
      "marks": 1,
      "clues": "- Think about what tractors and harvesters do to the time needed.\n- Give one effect.",
      "approach": "- Identify the measure in A (mechanisation).\n- State how it increases productivity.",
      "solution": "1. More work is completed in a short time, the work is more efficient and fatigue is eliminated."
    },
    {
      "number": "3.3.1",
      "marks": 3,
      "clues": "- Read each item in the contract.\n- Name the component each item belongs to.",
      "approach": "- Match item 1, 4 and 5 to contract components.\n- Name each component.",
      "solution": "1. 1: term (duration) of employment.\n2. 4: working hours.\n3. 5: mode of payment (remuneration)."
    },
    {
      "number": "3.3.2",
      "marks": 1,
      "clues": "- The Act covers hours, leave and overtime.\n- It was passed in 1997.",
      "approach": "- Recall labour legislation.\n- Name the Act that deals with leave.",
      "solution": "1. The Basic Conditions of Employment Act (Act 75 of 1997) addresses leave benefits."
    },
    {
      "number": "3.3.3",
      "marks": 1,
      "clues": "- The Act deals with worker health and safety.\n- Look in the items column.",
      "approach": "- Find the item that protects the worker.\n- Name it.",
      "solution": "1. Overall, mask and gloves (protective gear) address compliance with the Act."
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
