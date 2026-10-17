#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 5.1–5.9: Poppie — Die Drama — Teks I
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks I l.11
 *   Q2: P: Teks I l.12-13
 *   Q3: P: Teks I l.1-3
 *   Q4: P: Teks I l.10-15
 *   Q5: L: identify (mirror 5.8)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q9.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q9.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q9.js
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
  "name": "Vraag 5: Poppie – Die Drama (5.1–5.9)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "dramatic_techniques",
    "character_analysis",
    "contextual_questions"
  ],
  "text_key": "poppie_die_drama",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q9/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q9/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q9/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q9/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks I",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q9/annexure_teks_i_1.png"
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
    "text_key": "poppie_die_drama",
    "order": 1,
    "context_text": null,
    "question": "Wat was Bonsile se Engelse naam? Skryf net die naam.",
    "metadata": [
      "Naam:",
      "[ ]"
    ],
    "answer": [
      "Stanford",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "drama",
    "topic": "intrige_en_gebeure",
    "subtopic": "feit_uit_die_drama",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die naam kom in Plank se woorde voor.\n- Skryf een woord.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "poppie_die_drama",
    "order": 2,
    "context_text": null,
    "question": "Watter woord beskryf die toon in Poppie se woorde: \"My klonkie!\"?",
    "metadata": [
      "kwaad",
      "onverskillig",
      "liefdevol",
      "bang",
      ""
    ],
    "answer": [
      "liefdevol",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "toon_en_stylmiddele",
    "subtopic": "toon_van_'n_aanhaling",
    "skills": [
      "afrikaans_fal_bepaal_toon"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Poppie sê dit wanneer sy by haar seun is.\n- Let op die uitroepteken en die woord \"my\"."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "poppie_die_drama",
    "order": 3,
    "context_text": null,
    "question": "Waarom ervaar Poppie innerlike konflik voor haar eerste kind se geboorte (reël 1 en 2)?",
    "metadata": [
      "Sy wil by haar man bly, maar hy stuur haar weg.",
      "Sy verlang na haar ma en wil haar kind by haar ma kry.",
      "Sy is bly oor die swangerskap en wil dit vir niemand sê.",
      "Sy wil nie hê haar ma moet by die geboorte wees nie.",
      ""
    ],
    "answer": [
      "Sy verlang na haar ma en wil haar kind by haar ma kry.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "karakter_en_verhoudings",
    "subtopic": "innerlike_konflik",
    "skills": [
      "afrikaans_fal_verklaar_innerlike_konflik"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Poppie is getroud en het baie verlang.\n- Waarheen wil sy gaan as dit tyd word om haar kind te kry?"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "poppie_die_drama",
    "order": 4,
    "context_text": null,
    "question": "Pas elke naam of benaming by wat dit in die uittreksel beteken.",
    "metadata": [
      "A - Tata-ka-Bonsile",
      "B - Bonsile",
      "C - My klonkie",
      "1 - beteken ons het iets gewys, iets het reggekom",
      "2 - wat Poppie vir haar seun sê as sy alleen by hom is",
      "3 - beteken pa van Bonsile"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2",
      "",
      ""
    ],
    "presentation": "match",
    "type": "application",
    "unit": "drama",
    "topic": "karakter_en_verhoudings",
    "subtopic": "betekenis_van_name",
    "skills": [
      "afrikaans_fal_pas_gebeure_by_persone"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Plank vertel wat die name beteken.\n- Begin met die een wat jy die mees seker is van."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "poppie_die_drama",
    "order": 5,
    "context_text": null,
    "question": "Poppie verloor haar eerste kind, maar gee haar seun 'n positiewe naam. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
    "metadata": [
      "Hartseer beteken jy moet nooit weer hoop hê nie.",
      "Mense voel nie hartseer as hulle genoeg kinders het nie.",
      "Verliese maak dat jy die lewe haat.",
      "Mense kan hartseer wees oor 'n verlies en tog hoop behou.",
      ""
    ],
    "answer": [
      "Mense kan hartseer wees oor 'n verlies en tog hoop behou.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "karakter_en_verhoudings",
    "subtopic": "identifiseer_met_karakter",
    "skills": [
      "afrikaans_fal_identifiseer_met_karakter"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan hoe mense na 'n verlies kan voortgaan.\n- Gee 'n rede."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.1",
      "marks": 4,
      "clues": "- Lees die paragraaf en dink aan Poppie se familie.",
      "approach": "- Soek elke woord in die drama",
      "solution": "5.1.1: Hannie.\n5.1.2: Upington.\n5.1.3: lorriedrywer.\n5.1.4: Rachel."
    },
    {
      "number": "5.2",
      "marks": 1,
      "clues": "- Hoe spreek Poppie haar man aan?",
      "approach": "- Gee een rede",
      "solution": "1. Poppie het so respek teenoor Stone getoon; in haar kultuur het jy jou man so aangespreek."
    },
    {
      "number": "5.3",
      "marks": 1,
      "clues": "- Hoe het Stone se familie oor Poppie gevoel?",
      "approach": "- Gee een rede",
      "solution": "1. Stone se familie het van Poppie gehou en haar deel van die familie gemaak."
    },
    {
      "number": "5.4",
      "marks": 2,
      "clues": "- Dink aan wat Poppie in Herschel geleer het.",
      "approach": "- Soek twee voorbeelde",
      "solution": "1. Poppie het die vrou se rol as ma en vrou leer ken.\n2. Sy het geleer om suurpap te maak of die mielies fyn te maal."
    },
    {
      "number": "5.5.1",
      "marks": 1,
      "clues": "- Hoe voel Poppie oor die swangerskap?",
      "approach": "- Kies die opsie tussen hakies",
      "solution": "1. was onseker of dit die regte tyd was om 'n kind te hê."
    },
    {
      "number": "5.5.2",
      "marks": 1,
      "clues": "- Wat sê haar omstandighede?",
      "approach": "- Motiveer jou antwoord op 5.5.1",
      "solution": "1. Poppie was nog baie jonk, pas getroud en het nog nie haar eie huis gehad nie."
    },
    {
      "number": "5.6",
      "marks": 1,
      "clues": "- Let op die woorde \"Ek kan nie sê nie\".",
      "approach": "- Toets elke opsie by Poppie se woorde",
      "solution": "1. B (onseker)."
    },
    {
      "number": "5.7.1",
      "marks": 1,
      "clues": "- Wie moet gaan waarnatoe hulle wil?",
      "approach": "- Soek na wie \"ons\" verwys",
      "solution": "1. Die Xhosa-mense (Stone en sy gesin)."
    },
    {
      "number": "5.7.2",
      "marks": 1,
      "clues": "- Waarvandaan moes hulle weggaan?",
      "approach": "- Verduidelik die aanhaling",
      "solution": "1. Hulle moes van Lambertsbaai af weggaan."
    },
    {
      "number": "5.8",
      "marks": 1,
      "clues": "- Hoe reageer Poppie op haar eerste kind se dood?",
      "approach": "- Gee 'n rede waarom jy goed voel",
      "solution": "1. Poppie het nie negatief geraak nie en het haar seun steeds 'n positiewe naam gegee."
    },
    {
      "number": "5.9",
      "marks": 4,
      "clues": "- Pas elke gebeurtenis by die gevolg.",
      "approach": "- Dink aan wat uit elke gebeurtenis gevolg het",
      "solution": "5.9.1: D.\n5.9.2: A.\n5.9.3: E.\n5.9.4: B."
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
