#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 9.1.1–9.1.6: Krisis — Elizabeth Eybers
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Krisis l.1
 *   Q2: P: Krisis l.13-14
 *   Q3: P: Krisis l.9-10
 *   Q4: P: Krisis l.3
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q19.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q19.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q19.js
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
  "name": "Vraag 9.1: Krisis (9.1.1–9.1.6)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 19,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q19/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q19/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Poem",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q19/annexure_poem_1.png"
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
    "question": "Wie word in die gedig \"Krisis\" aangespreek? Skryf een woord.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "Hart",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "gedigte",
    "topic": "spreker_en_inhoud",
    "subtopic": "aangesprokene",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die spreker praat met \"jy\".\n- Die naam staan in reël 1.",
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
    "question": "Watter woord beskryf die toon van die laaste twee reëls: \"Kyk, dit word laat, die kermis is verby, kan jy dit nie begryp? Hier moet ons skei.\"?",
    "metadata": [
      "speels",
      "bang",
      "verward",
      "ongeduldig",
      ""
    ],
    "answer": [
      "ongeduldig",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "gedigte",
    "topic": "toon_en_stemming",
    "subtopic": "toon_van_'n_reel",
    "skills": [
      "afrikaans_fal_bepaal_toon"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Die spreker vra of die Hart dit nie kan begryp nie.\n- Hy wil nie langer wag nie."
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
    "question": "Kies TWEE rolle wat die Hart by die fees gespeel het.",
    "metadata": [
      "seremoniemeester",
      "kok",
      "nar",
      "musikant",
      ""
    ],
    "answer": [
      "seremoniemeester",
      "nar",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "gedigte",
    "topic": "spreker_en_inhoud",
    "subtopic": "rolle_in_die_gedig",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Kyk na reël 9 en 10.\n- Twee rolle pas by die gedig."
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
    "question": "In watter sin gebruik die digter \"weg\" in \"Die weg was lieflik waarlangs jy geleit het\"?",
    "metadata": [
      "Dit verwys na 'n werklike pad in die veld naby die fees.",
      "Dit verwys na die Hart se pad terug na sy huis toe.",
      "Dit verwys na die verhouding van die Hoof en die Hart.",
      "Dit verwys na die pad wat na die kermis toe lei.",
      ""
    ],
    "answer": [
      "Dit verwys na die verhouding van die Hoof en die Hart.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "gedigte",
    "topic": "beeldspraak_en_stylmiddele",
    "subtopic": "figuurlike_betekenis",
    "skills": [
      "afrikaans_fal_verklaar_betekenis_in_konteks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die Hoof en die Hart stap nie werklik langs 'n pad nie.\n- Waarvoor staan die pad?"
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "9.1.1",
      "marks": 1,
      "clues": "- Wie praat in die gedig?",
      "approach": "- Soek wie die spreker is",
      "solution": "1. Die Hoof (die verstand of kop)."
    },
    {
      "number": "9.1.2",
      "marks": 1,
      "clues": "- Wat sê reël 2 oor die skeiding?",
      "approach": "- Haal een woord uit strofe 1 aan",
      "solution": "1. \"onvoorbereid\"."
    },
    {
      "number": "9.1.3",
      "marks": 2,
      "clues": "- Hoe beskryf die Hoof die Hart?",
      "approach": "- Gee twee redes",
      "solution": "1. Die Hart is voortvarend, 'n lafaard, besluiteloos of siek.\n2. Die Hart gee dwase raad en verwar net die Hoof."
    },
    {
      "number": "9.1.4(a)",
      "marks": 1,
      "clues": "- Waarna kyk die Hart terug?",
      "approach": "- Kies tussen onthou en vergeet",
      "solution": "1. onthou."
    },
    {
      "number": "9.1.4(b)",
      "marks": 1,
      "clues": "- Hoe praat die Hoof met die Hart?",
      "approach": "- Kies tussen rustig en ongeduldig",
      "solution": "1. ongeduldig."
    },
    {
      "number": "9.1.5",
      "marks": 1,
      "clues": "- Hoe stel die digter die Hoof en die Hart as mense voor?",
      "approach": "- Soek die tegniek",
      "solution": "1. Personifikasie: hulle het hoofletters, word met \"ek\" en \"jy\" aangespreek en word as persone beskryf."
    },
    {
      "number": "9.1.6",
      "marks": 1,
      "clues": "- Wat het die Hart vir die Hoof gedoen?",
      "approach": "- Verduidelik in jou eie woorde",
      "solution": "1. Die Hoof kon nie goeie besluite neem nie en was verward deur die Hart."
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
