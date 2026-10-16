#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 1: World icons, access and South Africa's brand (Section A) (order 2)
 * Section A items 1.1.7–1.1.12 — the Black Forest, the Great Wall of China, Niagara Falls, universal access, South Africa's brand slogan and SATourism campaigns.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l02.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l02.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l02.js
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
  "name": "Question 1: World icons, access and South Africa's brand (Section A)",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "tourist_icons",
    "icon_location",
    "universal_access"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q2/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each attraction to the country or countries where it is found.",
    "metadata": [
      "A - Niagara Falls",
      "B - The Great Wall",
      "C - The Black Forest",
      "D - Victoria Falls",
      "1 - China",
      "2 - Germany",
      "3 - Zambia and Zimbabwe",
      "4 - Canada and the USA"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "tourist_attractions",
    "topic": "world_icons",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "A museum installs ramps, lifts and braille signs throughout its building. What does this provide?",
    "metadata": [
      "Extra security for valuable displays",
      "Cheaper entry for school groups",
      "Faster queues at the ticket office",
      "Universal access for all visitors",
      ""
    ],
    "answer": [
      "Universal access for all visitors",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourist_attractions",
    "topic": "attraction_success_factors",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the ways an attraction can cater for visitors with disabilities.",
    "metadata": [
      "Higher entry fees for all visitors",
      "Wheelchair ramps at entrances",
      "Accessible toilets on each floor",
      "Audio guides for blind visitors",
      "Steep stairs to every viewing deck"
    ],
    "answer": [
      "Wheelchair ramps at entrances",
      "Audio guides for blind visitors",
      "Accessible toilets on each floor",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourist_attractions",
    "topic": "attraction_success_factors",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Brand South Africa's logo usually carries which slogan?",
    "metadata": [
      "Proudly South African",
      "Simply the best",
      "Inspiring new ways",
      "Africa starts here",
      ""
    ],
    "answer": [
      "Inspiring new ways",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourism_marketing",
    "topic": "destination_marketing",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.7",
      "marks": 1,
      "clues": "- The Black Forest is a mountain forest region in Europe.",
      "approach": "- Recall which European country the Black Forest is in.\n- Rule out the countries outside Europe.",
      "solution": "1. The Black Forest is in south-western Germany: B."
    },
    {
      "number": "1.1.8",
      "marks": 1,
      "clues": "- The structure was built for protection.\n- It is thousands of kilometres long.",
      "approach": "- Think about which icon was built as a defence wall.\n- Compare its length with the other options.",
      "solution": "1. The Great Wall of China was built to protect the country and is over 6 000 km long: A."
    },
    {
      "number": "1.1.9",
      "marks": 1,
      "clues": "- The waterfall is in North America.\n- It lies on the border of two countries.",
      "approach": "- Recall where each waterfall in the options is found.\n- Pick the one between Canada and the USA.",
      "solution": "1. Niagara Falls lies on the border between Canada and the USA: C."
    },
    {
      "number": "1.1.10",
      "marks": 1,
      "clues": "- Think about visitors who use wheelchairs or cannot see well.",
      "approach": "- Look for the option that removes barriers for these visitors.\n- Rule out options that have nothing to do with access.",
      "solution": "1. Universal access makes an attraction usable by visitors with disabilities: B."
    },
    {
      "number": "1.1.11",
      "marks": 1,
      "clues": "- The logo is South Africa's country brand.",
      "approach": "- Recall the slogan that appears with the Brand South Africa logo.\n- Do not confuse it with a campaign for local products.",
      "solution": "1. The brand logo displays the slogan 'Inspiring new ways': A."
    },
    {
      "number": "1.1.12",
      "marks": 1,
      "clues": "- The question asks about a SATourism campaign.",
      "approach": "- Recall the campaign slogans used by SATourism.\n- Note that the memo accepts two options here.",
      "solution": "1. The memo accepts A ('Live South Africa!') and also C ('Alive with possibility')."
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
