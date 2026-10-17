#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 9.1.7–9.1.12: Krisis — Elizabeth Eybers
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Krisis l.4-5
 *   Q2: P: Krisis l.6
 *   Q3: P: Krisis l.1-13
 *   Q4: P: Krisis l.14
 *   Q5: P: Krisis
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q20.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q20.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q20.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Lesson document ─────────────────────────────────────────────────────────

const video = {
  "name": "Vraag 9.1: Krisis (9.1.7–9.1.12)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 20,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "poetry_analysis",
    "poetic_devices",
    "tone_and_mood"
  ],
  "text_key": "krisis",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q20/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q20/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q20/memo_2.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Poem",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q20/annexure_poem_1.png"
      ]
    }
  ]
};

// ─── Practice questions ──────────────────────────────────────────────────────

const questions = [
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 1",
    "text_key": "krisis",
    "order": 1,
    "context_text": null,
    "question": "Noem EEN van die gevaarlike plekke langs die pad in reël 5. Skryf een woord.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "klowe|afgrond|moeras",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "gedigte",
    "topic": "spreker_en_inhoud",
    "subtopic": "feit_uit_die_gedig",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die pad strek langs drie gevaarlike plekke.\n- Skryf een woord.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "krisis",
    "order": 2,
    "context_text": null,
    "question": "Wat beteken \"voortvarend\" in reël 6?",
    "metadata": [
      "rustig en versigtig",
      "stadig en moeg",
      "bang en nederig",
      "onbesonne en roekeloos",
      ""
    ],
    "answer": [
      "onbesonne en roekeloos",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "gedigte",
    "topic": "beeldspraak_en_stylmiddele",
    "subtopic": "betekenis_van_'n_woord",
    "skills": [
      "afrikaans_fal_verklaar_betekenis_in_konteks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Die woord staan langs \"lafaard\" en \"nooit in staat tot enige besluit\".\n- Dink aan iemand wat sonder om te dink vooruit gaan."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "krisis",
    "order": 3,
    "context_text": null,
    "question": "Rangskik die dele in die volgorde waarin hulle in die gedig voorkom.",
    "metadata": [
      "Die Hoof sê die kermis is verby.",
      "Die pad strek langs klowe, afgrond en moeras.",
      "Die Hoof sê dis hier waar hulle skei.",
      "Die Hart was die gas en gasheer by die fees.",
      ""
    ],
    "answer": [
      "Die Hoof sê dis hier waar hulle skei.",
      "Die pad strek langs klowe, afgrond en moeras.",
      "Die Hart was die gas en gasheer by die fees.",
      "Die Hoof sê die kermis is verby.",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "gedigte",
    "topic": "spreker_en_inhoud",
    "subtopic": "volgorde_in_die_gedig",
    "skills": [
      "afrikaans_fal_rangskik_gebeure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Volg die gedig reël vir reël.\n- Die kermis kom in strofe 2 voor."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "krisis",
    "order": 4,
    "context_text": null,
    "question": "Wat is die effek van die laaste reël: \"Hier moet ons skei\"?",
    "metadata": [
      "Dit wys dat die Hoof van plan verander het.",
      "Dit bevestig die Hoof se besluit om te skei.",
      "Dit vra die Hart om te bly.",
      "Dit beskryf die begin van die fees.",
      ""
    ],
    "answer": [
      "Dit bevestig die Hoof se besluit om te skei.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "gedigte",
    "topic": "toon_en_stemming",
    "subtopic": "effek_van_die_slot",
    "skills": [
      "afrikaans_fal_verklaar_betekenis_in_konteks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Die gedig begin ook met die skeiding.\n- Wat wys die herhaling oor die besluit?"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "krisis",
    "order": 5,
    "context_text": null,
    "question": "Watter tema kom in die gedig voor?",
    "metadata": [
      "Die voordele van 'n fees.",
      "Die skoonheid van die natuur.",
      "Die stryd tussen verstand en emosie.",
      "Die gevare van die see.",
      ""
    ],
    "answer": [
      "Die stryd tussen verstand en emosie.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "gedigte",
    "topic": "spreker_en_inhoud",
    "subtopic": "tema_van_die_gedig",
    "skills": [
      "afrikaans_fal_identifiseer_temas"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Wie praat met wie in die gedig?\n- Die Hoof en die Hart stry met mekaar."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "9.1.7",
      "marks": 1,
      "clues": "- Waarom stem die Hoof nie altyd met die Hart saam nie?",
      "approach": "- Haal TWEE opeenvolgende woorde aan",
      "solution": "1. \"dwase raad\" of \"hoof verwar\"."
    },
    {
      "number": "9.1.8",
      "marks": 1,
      "clues": "- Wat beteken \"die kermis is verby\"?",
      "approach": "- Toets elke opsie",
      "solution": "1. B (die spreker wil nie meer konflik hê nie)."
    },
    {
      "number": "9.1.9",
      "marks": 4,
      "clues": "- Volg die pad wat die Hoof en die Hart saam geloop het.",
      "approach": "- Rangskik die vier gebeure",
      "solution": "1. Die pad wat die Hoof en die Hart saamgeloop het, was mooi.\n2. Die pad saam het sleg begin word.\n3. Die Hoof het die Hart nie meer nodig nie.\n4. Hulle het aan die einde van hulle pad saam gekom."
    },
    {
      "number": "9.1.10",
      "marks": 1,
      "clues": "- Waar begin en eindig die gedig?",
      "approach": "- Verduidelik die effek van die herhaling",
      "solution": "1. Die herhaling bind die gedig tot 'n geheel en beklemtoon dat hulle moet skei."
    },
    {
      "number": "9.1.11",
      "marks": 1,
      "clues": "- Dink aan 'n keer toe jou kop en hart verskil het.",
      "approach": "- Verduidelik hoe jy identifiseer",
      "solution": "1. My verstand baklei ook dikwels met my hart en dit is moeilik om die regte besluit te neem."
    },
    {
      "number": "9.1.12",
      "marks": 1,
      "clues": "- Waaroor gaan die gedig?",
      "approach": "- Verduidelik hoekom die titel pas",
      "solution": "1. Die inhoud wys die krisis of stryd tussen die Hoof en die Hart."
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
