#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 3.7–3.9: Internal and external parasites and their control (order 14)
 * Question 3.7–3.9 — parasite life cycles and hosts, mites and blowflies, and matching control methods to the type of parasite. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l14.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l14.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l14.js
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
  "name": "Question 3.7–3.9: Internal and external parasites and their control",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 13,
  "tags": [
    "internal_parasites",
    "external_parasites",
    "parasite_control"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q14/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q14/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q14/memo_1.png"
  ],
  "exam_question_marks": 13,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange the stages of a blowfly strike on a sheep in the correct order.",
    "metadata": [
      "The maggots feed on the skin and flesh",
      "The maggots drop to the soil and pupate",
      "A fly lays eggs in a wet, dirty fleece",
      "The eggs hatch into maggots"
    ],
    "answer": [
      "A fly lays eggs in a wet, dirty fleece",
      "The eggs hatch into maggots",
      "The maggots feed on the skin and flesh",
      "The maggots drop to the soil and pupate"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "animal_production_protection_and_control",
    "topic": "parasites_of_farm_animals",
    "subtopic": "agri_process_sequence",
    "skills": [
      "sequence_agricultural_process"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The adult fly is attracted by the smell of urine and faeces in the wool.\n- The damage is done by the larvae, not by the adult fly."
  },
  {
    "name": "Question 2",
    "question": "The blue tick feeds, moults and mates on the same animal, and drops off only to lay its eggs. How is it classified by the number of hosts it needs?",
    "metadata": [
      "Two-host tick",
      "Three-host tick",
      "Multi-host tick",
      "One-host tick",
      ""
    ],
    "answer": [
      "One-host tick",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "parasites_of_farm_animals",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Count how many animals the tick climbs onto during its life."
  },
  {
    "name": "Question 3",
    "question": "A goat farmer notices several problems in the herd. Select ALL the signs that point to a mite (mange) infestation.",
    "metadata": [
      "Pale gums and a swollen lower jaw",
      "Hair loss with thick, crusty skin",
      "Constant rubbing against fence poles",
      "Red-brown urine after a high fever",
      "Itching that makes the goats restless"
    ],
    "answer": [
      "Hair loss with thick, crusty skin",
      "Constant rubbing against fence poles",
      "Itching that makes the goats restless",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "parasites_of_farm_animals",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Mites live in or on the skin.\n- Signs inside the body point to other parasites or diseases."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the measures that help to prevent blowfly strike in wool sheep.",
    "metadata": [
      "Crutching the wool around the tail",
      "Shearing before the hot, wet season",
      "Dosing the flock with a wormer",
      "Treating any wounds immediately",
      "Leaving the fleece long and unshorn"
    ],
    "answer": [
      "Crutching the wool around the tail",
      "Shearing before the hot, wet season",
      "Treating any wounds immediately",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "parasites_of_farm_animals",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Flies are attracted to wet, soiled wool and open wounds.\n- Remove what attracts them."
  },
  {
    "name": "Question 5",
    "question": "Match each control method to the parasite problem it controls.",
    "metadata": [
      "A - Anthelmintic drench",
      "B - Plunge dipping",
      "C - Rotational grazing",
      "D - Draining wet areas",
      "1 - Roundworms in the stomach and intestines",
      "2 - Ticks and lice on the skin and hair",
      "3 - Worm larvae building up on the pasture",
      "4 - Snails that carry liver fluke larvae"
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
    "topic": "parasites_of_farm_animals",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Drugs given by mouth reach the gut; chemicals on the body reach the skin.\n- Some methods break the life cycle outside the animal."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.7.1",
      "marks": 1,
      "clues": "- Both parasites live inside the body of the animal.",
      "approach": "- Look at where the adult parasites are found.\n- Classify them.",
      "solution": "1. Internal parasites (endoparasites)."
    },
    {
      "number": "3.7.2",
      "marks": 1,
      "clues": "- Parasite A has a scolex attached in the intestines.",
      "approach": "- Use the scolex to identify the parasite.\n- Name it.",
      "solution": "1. Tapeworm."
    },
    {
      "number": "3.7.3",
      "marks": 1,
      "clues": "- Count the animals in the life cycle: one in water and one that eats grass.",
      "approach": "- Identify the hosts of parasite B.\n- Classify it by the number of hosts.",
      "solution": "1. A two-host parasite (snail and cattle)."
    },
    {
      "number": "3.7.4",
      "marks": 2,
      "clues": "- Think about what the farmer pays for when animals are treated.",
      "approach": "- List the direct costs of treatment.\n- Give two.",
      "solution": "1. Treatment costs (the cost of anthelmintics).\n2. Labour costs at the time of treatment."
    },
    {
      "number": "3.8.1",
      "marks": 2,
      "clues": "- Parasite B is microscopic and lives in the skin.\n- Parasite A is a fly.",
      "approach": "- Link scab and mange to one parasite.\n- Link eggs laid in soiled wool and wounds to the other.",
      "solution": "1. (a) Causes scab and mange: PARASITE B.\n2. (b) Lays eggs in soiled areas and wounds of wool sheep: PARASITE A."
    },
    {
      "number": "3.8.2",
      "marks": 2,
      "clues": "- PARASITE B is a mite.\n- Think about what happens to the skin and the behaviour of the animal.",
      "approach": "- Recall the symptoms of a mite infestation.\n- Give any two.",
      "solution": "1. Skin irritation, dermatitis, hair loss, restlessness or skin breaks.\n2. Biting, rubbing, kicking or tail-wagging to relieve the discomfort (any two)."
    },
    {
      "number": "3.8.3",
      "marks": 2,
      "clues": "- PARASITE A is the blowfly.\n- Remove what attracts it to the sheep.",
      "approach": "- Recall the measures that prevent blowfly strike.\n- Give any two.",
      "solution": "1. Correct timing of shearing and crutching; lambing after shearing; clipping and cleaning the coat.\n2. Breeding resistant animals, tail docking, sanitation and proper treatment of wounds (any two)."
    },
    {
      "number": "3.9.1",
      "marks": 1,
      "clues": "- Anthelmintics are dewormers given to the animal.",
      "approach": "- Decide where the parasites treated with anthelmintics live.\n- Name the type.",
      "solution": "1. Internal parasites (endoparasites)."
    },
    {
      "number": "3.9.2",
      "marks": 1,
      "clues": "- The solution is applied to the outside of the body.",
      "approach": "- Decide where the parasites treated this way live.\n- Name the type.",
      "solution": "1. External parasites (ectoparasites)."
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
