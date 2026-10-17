#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 8.5–8.6: Database data types and conditional formatting (order 15)
 * Question 8.5.1, 8.5.2 and 8.6 — a suitable data type, the effect of reducing a field size and reading a conditional formatting rule.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l15.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l15.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l15.js
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
  "name": "Question 8.5–8.6: Database data types and conditional formatting",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "database_data_types",
    "field_size",
    "conditional_formatting"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q15/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q15/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q15/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q15/memo_2.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "The Club field stores words such as Chess and Drama. Which data type is more suitable for it than OLE Object?",
    "metadata": [
      "Currency",
      "Number",
      "Yes/No",
      "Short Text",
      ""
    ],
    "answer": [
      "Short Text",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "solution_development",
    "topic": "database_design",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application",
    "supplementary_material": {
      "type": "table",
      "label": "Fields in a Members table",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/cat/2025/nov_p2/q15/figure_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "The size of the Surname field is reduced to 5 characters although some surnames are longer. Which TWO statements are true?",
    "metadata": [
      "The database enlarges the field by itself",
      "Characters beyond the fifth are lost",
      "The extra characters move to the next field",
      "New longer surnames cannot be stored in full",
      "Nothing changes until the database is closed"
    ],
    "answer": [
      "Characters beyond the fifth are lost",
      "New longer surnames cannot be stored in full",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "solution_development",
    "topic": "database_design",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "What is the result of this conditional formatting rule on cells B2:B6?",
    "metadata": [
      "Cells with a value above the average are shaded amber",
      "Cells equal to the average are deleted from the range",
      "Cells with a value below the average of the range are shaded amber",
      "Every cell in the range is shaded amber",
      ""
    ],
    "answer": [
      "Cells with a value below the average of the range are shaded amber",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "solution_development",
    "topic": "spreadsheet_features",
    "subtopic": "cat_data_interpretation",
    "skills": [
      "interpret_cat_stimulus"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation",
    "clues": "- Read the comparison symbol carefully.\n- The range is compared with its own average.",
    "supplementary_material": {
      "type": "code",
      "label": "Conditional formatting rule",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/cat/2025/nov_p2/q15/figure_2.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Match each data type to the kind of data it holds.",
    "metadata": [
      "A - Short Text",
      "B - Date/Time",
      "C - OLE Object",
      "D - Yes/No",
      "1 - Dates such as a birth date",
      "2 - Linked or embedded files such as an image",
      "3 - One of two values such as true or false",
      "4 - Letters, digits and symbols such as a surname"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "solution_development",
    "topic": "database_design",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "8.5.1",
      "marks": 1,
      "clues": "- SportType holds words, not files.\n- OLE Object is meant for linked or embedded files.",
      "approach": "- Pick a text-based data type.",
      "solution": "1. Short Text or Lookup."
    },
    {
      "number": "8.5.2",
      "marks": 1,
      "clues": "- A field size sets how many characters can be stored.\n- Think about longer surnames.",
      "approach": "- Consider existing and new records.",
      "solution": "1. Any one: all characters after the specified size are lost if the field is edited, or new records cannot store surnames longer than 10 characters."
    },
    {
      "number": "8.6",
      "marks": 2,
      "clues": "- Read the formula in the rule.\n- It compares each cell with the average of the range.",
      "approach": "- Say what is applied, to which cells and when.",
      "solution": "1. Formatting (such as shading) is applied to cells A1:A5.\n2. It is applied where the value of a cell is greater than or equal to the average of the range A1:A5."
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
