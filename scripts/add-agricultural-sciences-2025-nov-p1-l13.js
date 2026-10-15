#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 3.7–3.9: Plant poisoning, diseases and medication (order 13)
 * Question 3.7–3.9 and Section A item 1.1.7 — treating plant poisoning, the role of the state, livestock diseases, disease seriousness and methods of administering medication (five questions: each real sub-question group needs its own concept). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l13.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l13.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l13.js
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
  "name": "Question 3.7–3.9: Plant poisoning, diseases and medication",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 13,
  "content_tier": "free",
  "has_video": false,
  "xp": 13,
  "tags": [
    "plant_poisoning",
    "livestock_diseases",
    "administering_medication"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q13/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q13/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q13/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q13/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q13/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q13/memo_3.png"
  ],
  "exam_question_marks": 13,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each livestock disease to the description that fits it.",
    "metadata": [
      "A - Bluetongue",
      "B - Brucellosis",
      "C - Lumpy wool",
      "D - Redwater",
      "1 - Swollen, blue tongue; spread by midges",
      "2 - Causes abortion; can infect humans",
      "3 - Hard scabs in the fleece of sheep",
      "4 - Dark urine; spread by ticks"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "livestock_diseases",
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
    "paper": "nov_p1"
  },
  {
    "name": "Question 2",
    "question": "A disease develops slowly, lasts for months and keeps coming back in the same cow. How is this disease classified?",
    "metadata": [
      "Acute",
      "Pre-acute",
      "Chronic",
      "Zoonotic",
      ""
    ],
    "answer": [
      "Chronic",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_production_protection_and_control",
    "topic": "livestock_diseases",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Classification by seriousness is based on how quickly the disease develops and how long it lasts."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the actions that a farmer can take to treat animals showing signs of plant poisoning.",
    "metadata": [
      "Chase the animals to make them sweat out the poison",
      "Give activated charcoal or strong tea to neutralise the poison",
      "Feed extra of the poisonous plant to build up resistance",
      "Dose with sugar or glucose",
      "Keep the animals calm and in the shade"
    ],
    "answer": [
      "Keep the animals calm and in the shade",
      "Give activated charcoal or strong tea to neutralise the poison",
      "Dose with sugar or glucose",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "plant_poisoning",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Reduce stress and limit the poison in the body."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the roles that the state plays in animal health.",
    "metadata": [
      "Setting the auction price of livestock",
      "Registering and controlling veterinary medicines",
      "Running awareness campaigns on animal diseases",
      "Dosing every farmer’s animals for free",
      "Controlling animal movement and quarantine"
    ],
    "answer": [
      "Registering and controlling veterinary medicines",
      "Running awareness campaigns on animal diseases",
      "Controlling animal movement and quarantine",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "medication_and_state_role",
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
    "clues": "- Think about laws, information and border control rather than daily farm tasks."
  },
  {
    "name": "Question 5",
    "question": "Match each method of administering medication to a typical example.",
    "metadata": [
      "A - Injection",
      "B - Oral dosing",
      "C - Dipping",
      "D - Eye drops",
      "1 - A vaccine given under the skin",
      "2 - A drench for internal worms",
      "3 - A bath to kill ticks and lice",
      "4 - A treatment for pinkeye in cattle"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "medication_and_state_role",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.7.1",
      "marks": 2,
      "clues": "- Think about what reduces the poison and what keeps the animal calm.\n- Give two measures.",
      "approach": "- Recall the treatment measures for plant poisoning.\n- Choose two.",
      "solution": "1. Keep affected animals calm and in shade, and dose them with sugar or glucose.\n2. Other accepted measures include activated charcoal or strong tea, purgatives and keeping animals away from water for a time."
    },
    {
      "number": "3.7.2",
      "marks": 2,
      "clues": "- The state makes laws, informs and controls movement.\n- Give two roles.",
      "approach": "- Recall the role of government in animal health.\n- Choose two.",
      "solution": "1. Awareness campaigns and the registration or legislation of medication.\n2. Other accepted roles include research, training, quarantine and veterinary services."
    },
    {
      "number": "3.8.1",
      "marks": 1,
      "clues": "- This is a viral disease that causes blisters.\n- The blisters occur in the mouth and between the hooves.",
      "approach": "- Read the symptoms.\n- Find the matching disease in the list.",
      "solution": "1. Round blisters on the mucous membranes of the mouth, tongue and between the hooves are caused by foot-and-mouth disease."
    },
    {
      "number": "3.8.2",
      "marks": 1,
      "clues": "- The disease turns the urine a dark colour.\n- It is transmitted by a tick.",
      "approach": "- Read the symptoms and vector.\n- Find the matching disease in the list.",
      "solution": "1. Brown to dark urine transmitted by blue ticks is redwater."
    },
    {
      "number": "3.8.3",
      "marks": 1,
      "clues": "- The disease affects the fleece with hard scabs.\n- It also occurs on the ears, face and lips.",
      "approach": "- Read the symptoms.\n- Find the matching disease in the list.",
      "solution": "1. Hard scabs that affect the fleece are caused by lumpy wool."
    },
    {
      "number": "3.8.4",
      "marks": 1,
      "clues": "- The disease is transmitted by a bont tick.\n- Signs include fever, nervousness and watery diarrhoea.",
      "approach": "- Read the symptoms and vector.\n- Find the matching disease in the list.",
      "solution": "1. High fever, nervousness, grinding of the teeth and watery diarrhoea, transmitted by the bont tick, is heartwater."
    },
    {
      "number": "3.8.5",
      "marks": 1,
      "clues": "- This is an inflammation of the udder.\n- Look for clots in the milk.",
      "approach": "- Read the symptoms.\n- Find the matching disease in the list.",
      "solution": "1. Inflammation of the udder with thick, flaky milk with clots is mastitis."
    },
    {
      "number": "3.9",
      "marks": 2,
      "clues": "- Think about ways to get medicine into an animal.\n- Name two methods.",
      "approach": "- Recall the methods of administering medication.\n- Choose two.",
      "solution": "1. Injection and oral administration (other methods: topical application, dipping, intra-nasal, rectal, vaginal and eye drops)."
    },
    {
      "number": "1.1.7",
      "marks": 2,
      "clues": "- Think about how the disease develops over time.\n- Compare acute with chronic.",
      "approach": "- Recall the classifications of disease seriousness.\n- Match the description of a long-lasting, recurring disease.",
      "solution": "1. Diseases that are long lasting and occur repeatedly in the same animal are chronic, so the answer is A."
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
