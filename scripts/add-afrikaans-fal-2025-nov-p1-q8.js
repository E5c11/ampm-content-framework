#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P1 — November 2025 — Vraag 5.1.11–5.1.14: Artikel — Teks F
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P1 language-paper skill / theme, C CAPS:
 *   Q1: P1: active form (mirror 5.1.11)
 *   Q2: P1: syllables (mirror 5.1.12)
 *   Q3: P1: abbreviation (mirror 5.1.13)
 *   Q4: P1: conjunction/word order (mirror 5.1.14)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p1-q8.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q8.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q8.js
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
  "name": "Vraag 5.1: Artikel (5.1.11–5.1.14)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p1",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "grammar",
    "editing",
    "sentence_construction"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q8/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q8/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q8/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q8/memo_2.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks F",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q8/annexure_teks_f_1.png"
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
    "paper": "nov_p1",
    "name": "Vraag 1",
    "order": 1,
    "context_text": "Die brood is deur die bakker gebak.",
    "question": "Watter sin is die BEDRYWENDE VORM van die gegewe sin?",
    "metadata": [
      "Die brood het die bakker gebak.",
      "Die bakker is die brood gebak.",
      "Die bakker bak die brood.",
      "Die bakker het die brood gebak.",
      ""
    ],
    "answer": [
      "Die bakker het die brood gebak.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "sinstrukture",
    "topic": "aktief_en_passief",
    "subtopic": "lydende_na_bedrywende_vorm",
    "skills": [
      "afrikaans_fal_skryf_in_bedrywende_vorm"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "clues": "- In die bedrywende vorm is die persoon wat iets doen die onderwerp.\n- Die tyd van die sin verander nie."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 2",
    "order": 2,
    "context_text": "Ons gaan in die (vakansie) see toe.",
    "question": "Verdeel die woord tussen hakies korrek in LETTERGREPE. Skei die lettergrepe met koppeltekens.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "va-kan-sie",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "woordeskat",
    "topic": "klankleer_en_spelling",
    "subtopic": "lettergrepe",
    "skills": [
      "afrikaans_fal_verdeel_woord_in_lettergrepe"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- Klap die woord: elke klap is een lettergreep.\n- Skryf al die lettergrepe met 'n koppelteken tussen elk.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 3",
    "order": 3,
    "context_text": null,
    "question": "Pas elke AFKORTING by die woord wat dit voluit beteken.",
    "metadata": [
      "A - mev.",
      "B - dr.",
      "C - mnr.",
      "1 - dokter",
      "2 - meneer",
      "3 - mevrou"
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
    "unit": "woordeskat",
    "topic": "klankleer_en_spelling",
    "subtopic": "afkortings",
    "skills": [
      "afrikaans_fal_skryf_afkorting_voluit"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Dink aan hoe jy iemand met sy of haar titel aanspreek.\n- Begin met die een wat jy die mees seker is van."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 4",
    "order": 4,
    "context_text": null,
    "question": "Watter sin verbind \"Dit het gereën. Ons het binne gebly.\" korrek met die voegwoord \"daarom\"?",
    "metadata": [
      "Dit het gereën; daarom ons het binne gebly.",
      "Dit het gereën daarom; het ons binne gebly.",
      "Dit het gereën; daarom het ons binne gebly.",
      "Dit het gereën; ons daarom het binne gebly.",
      ""
    ],
    "answer": [
      "Dit het gereën; daarom het ons binne gebly.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "sinstrukture",
    "topic": "woordorde",
    "subtopic": "voegwoordelike_bywoord",
    "skills": [
      "afrikaans_fal_verbind_sinne_met_voegwoord"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "clues": "- Na \"daarom\" kom die werkwoord voor die onderwerp.\n- Die twee sinne word met 'n kommapunt of komma verbind."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.1.11",
      "marks": 1,
      "clues": "- Die persoon of ding wat iets doen, word die onderwerp.",
      "approach": "- Plaas die doener voor in die sin\n- Gebruik \"het\" met die voltooide deelwoord",
      "solution": "1. Die gemeenskap se bydrae het die projek moontlik gemaak."
    },
    {
      "number": "5.1.12",
      "marks": 1,
      "clues": "- Verdeel die woord in klankgroepe.",
      "approach": "- Skei die woord volgens klanke\n- Gebruik koppeltekens",
      "solution": "1. dank-baar-heid."
    },
    {
      "number": "5.1.13",
      "marks": 1,
      "clues": "- Wat staan \"gr.\" voluit?",
      "approach": "- Skryf die woord voluit",
      "solution": "1. graad."
    },
    {
      "number": "5.1.14",
      "marks": 1,
      "clues": "- \"Daarom\" is 'n voegwoord wat die woordorde verander.",
      "approach": "- Verbind die twee sinne\n- Plaas die werkwoord reg ná \"daarom\"",
      "solution": "1. ODIN ontvang geen staatshulp nie; daarom is hulle afhanklik van die publiek se hulp."
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
