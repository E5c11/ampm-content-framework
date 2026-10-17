#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 9.1: Comparing laptop quotations and operating systems (order 17)
 * Question 9.1.1–9.1.5 — the installed operating system, functions of an operating system, comparing two quotations, the 802.11 specification and free antivirus software.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l17.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l17.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l17.js
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
  "name": "Question 9.1: Comparing laptop quotations and operating systems",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "operating_systems",
    "comparing_quotations",
    "wireless_standards",
    "free_antivirus"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q17/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q17/memo_1.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the quotations. Which TWO are reasons why Laptop B is the better choice?",
    "metadata": [
      "It has a larger screen than the other laptop",
      "It has more RAM, so programs run more smoothly",
      "It uses an SSD, which is faster than a hard disk",
      "It has a longer warranty than the other laptop",
      "It uses a faster wireless standard than the other laptop"
    ],
    "answer": [
      "It has more RAM, so programs run more smoothly",
      "It uses an SSD, which is faster than a hard disk",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "systems_technologies",
    "topic": "buying_decisions",
    "subtopic": "cat_data_interpretation",
    "skills": [
      "interpret_cat_stimulus"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation",
    "clues": "- Compare the two columns row by row.\n- Only a difference counts as a reason.",
    "supplementary_material": {
      "type": "table",
      "label": "Two laptop quotations",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/cat/2025/nov_p2/q17/figure_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Match each type of software to its description.",
    "metadata": [
      "A - Operating system",
      "B - Application software",
      "C - Utility program",
      "D - Driver",
      "1 - Programs used for tasks such as writing or calculating",
      "2 - A maintenance tool such as a backup or disk clean-up program",
      "3 - Lets the operating system communicate with a hardware device",
      "4 - Manages the hardware and provides the user interface"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "systems_technologies",
    "topic": "system_software",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
    ],
    "difficulty": 2,
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
    "question": "What is the purpose of the 802.11 specification listed for both laptops?",
    "metadata": [
      "It sets the screen resolution of the laptop display",
      "It states the processor speed of the laptop",
      "It gives the battery capacity of the laptop",
      "It lets the laptop connect to a wireless network",
      ""
    ],
    "answer": [
      "It lets the laptop connect to a wireless network",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "network_technologies",
    "topic": "wireless_technologies",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition",
    "supplementary_material": {
      "type": "table",
      "label": "Two laptop quotations",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/cat/2025/nov_p2/q17/figure_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Which disadvantage can come with using a free antivirus program?",
    "metadata": [
      "It can only scan one single file at a time",
      "It always halves the speed of the network connection",
      "It may offer only limited technical support",
      "It works only when the computer is offline",
      ""
    ],
    "answer": [
      "It may offer only limited technical support",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "social_implications",
    "topic": "malware_and_threats",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "9.1.1",
      "marks": 1,
      "clues": "- Look at the software listed for both laptops.\n- The question asks for the operating system.",
      "approach": "- Find the item that is system software, not an application.",
      "solution": "1. Windows."
    },
    {
      "number": "9.1.2",
      "marks": 2,
      "clues": "- The operating system controls the computer.\n- Give TWO functions.",
      "approach": "- Think about hardware, software, the interface, files, security and memory.",
      "solution": "1. Any two of: manages and controls the hardware, manages and controls the software, provides a user interface, organises files and folders, provides basic security, input and output, memory and device management."
    },
    {
      "number": "9.1.3",
      "marks": 2,
      "clues": "- Compare the two quotations row by row.\n- Look for hardware that makes Quotation 2 stronger.",
      "approach": "- Compare RAM, storage, number of cores and software.",
      "solution": "1. Any two: more primary memory, an SSD that is faster because it is electronic, more cores to process instructions, or Office 365 with the latest features."
    },
    {
      "number": "9.1.4",
      "marks": 1,
      "clues": "- 802.11 is a networking specification.\n- Both laptops list it.",
      "approach": "- Recall which kind of network 802.11 belongs to.",
      "solution": "1. The laptops can connect to a wireless network."
    },
    {
      "number": "9.1.5",
      "marks": 1,
      "clues": "- The antivirus is free.\n- Think about what a free product may lack or include.",
      "approach": "- Give one disadvantage.",
      "solution": "1. Any one: limited technical support, many different versions, may contain malware in certain versions, no guarantee it will not harm the system, or additional pop-up advertisements."
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
