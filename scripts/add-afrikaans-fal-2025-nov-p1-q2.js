#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P1 — November 2025 — Vraag 1 (1.17–1.22): Leesbegrip — Teks B grafiese teks
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P1: lees data (mirror 1.17)
 *   Q2: P1: lees data (mirror 1.19)
 *   Q3: P1: interpreteer data (mirror 1.18/1.20)
 *   Q4: P1: evalueer bron (mirror 1.22)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p1-q2.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q2.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q2.js
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
  "name": "Vraag 1: Leesbegrip (Teks B)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "comprehension",
    "graph_interpretation",
    "interpretation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q2/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q2/annexure_teks_b_1.png"
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
    "context_text": "Sport by graad 12-leerders (eie opname, 2024): Sokker 40%, Netbal 30%, Atletiek 20%, Swem 10%.",
    "question": "Watter persentasie leerders neem aan atletiek deel? Skryf net die getal.",
    "metadata": [
      "Getal:",
      "[ ]"
    ],
    "answer": [
      "20",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "leesbegrip",
    "topic": "grafiese_tekste",
    "subtopic": "lees_syfer_uit_data",
    "skills": [
      "afrikaans_fal_lees_syfer_uit_data"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Soek atletiek in die lys.\n- Lees die syfer langsaan.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 2",
    "order": 2,
    "context_text": "Sport by graad 12-leerders (eie opname, 2024): Sokker 40%, Netbal 30%, Atletiek 20%, Swem 10%.",
    "question": "In watter sportsoort neem die meeste leerders deel? Skryf EEN woord.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "sokker",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "leesbegrip",
    "topic": "grafiese_tekste",
    "subtopic": "vergelyk_data",
    "skills": [
      "afrikaans_fal_identifiseer_hoogste_waarde"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Vergelyk al vier syfers.\n- Die grootste syfer wys die gewildste sportsoort.",
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
    "context_text": "Sport by graad 12-leerders (eie opname, 2024): Sokker 40%, Netbal 30%, Atletiek 20%, Swem 10%.",
    "question": "Kies TWEE stellings wat volgens die opname waar is.",
    "metadata": [
      "Netbal is gewilder as atletiek.",
      "Sokker het meer as die helfte van die leerders.",
      "Swem het die minste deelnemers.",
      "Atletiek is gewilder as netbal.",
      ""
    ],
    "answer": [
      "Netbal is gewilder as atletiek.",
      "Swem het die minste deelnemers.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "leesbegrip",
    "topic": "grafiese_tekste",
    "subtopic": "ware_stellings_oor_data",
    "skills": [
      "afrikaans_fal_kies_ware_stellings_oor_data"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- Toets elke stelling teen die syfers.\n- Twee stellings is waar."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 4",
    "order": 4,
    "context_text": "Sport by graad 12-leerders (eie opname, 2024): Sokker 40%, Netbal 30%, Atletiek 20%, Swem 10%.",
    "question": "Waarom sal hierdie opname jou nie help om 'n taak oor sportdeelname in 2030 te voltooi nie?",
    "metadata": [
      "Die opname vra net vrae oor een sportsoort, naamlik sokker.",
      "Die syfers in die opname tel nie op tot 100% nie.",
      "Die inligting kom uit 2024 en is dalk verouderd.",
      "Dit is 'n opname wat net volwassenes se sport wys.",
      ""
    ],
    "answer": [
      "Die inligting kom uit 2024 en is dalk verouderd.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "leesbegrip",
    "topic": "grafiese_tekste",
    "subtopic": "betroubaarheid_van_inligting",
    "skills": [
      "afrikaans_fal_beoordeel_betroubaarheid_van_bron"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "clues": "- Kyk na die jaar van die opname.\n- Dink daaraan hoe inligting oor tyd verander."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.17",
      "marks": 1,
      "clues": "- Soek huiswerker in die grafiek.\n- Kyk na die kolom vir mans.",
      "approach": "- Soek die beroep\n- Lees die persentasie vir mans",
      "solution": "1. 3%."
    },
    {
      "number": "1.18",
      "marks": 1,
      "clues": "- Kyk na wat die prentjie van 'n tegnikus wys.",
      "approach": "- Dink aan wat 'n tegnikus doen\n- Kies die opsie wat by die prentjie pas",
      "solution": "1. Hulle maak stukkende goed reg."
    },
    {
      "number": "1.19",
      "marks": 1,
      "clues": "- Soek twee balkies waar die persentasies byna gelyk is.\n- Vergelyk die vroue- en manskolomme.",
      "approach": "- Vind die beroepe met byna gelyke syfers\n- Noem EEN",
      "solution": "1. Beroepslui (49% en 51%) of verkope en dienste (48% en 52%)."
    },
    {
      "number": "1.20",
      "marks": 1,
      "clues": "- Wat sê die statistiek oor landbou (geskool)?",
      "approach": "- Dink aan wat die woord \"geskool\" aandui\n- Kies die opsie",
      "solution": "1. Verder studeer het."
    },
    {
      "number": "1.21",
      "marks": 1,
      "clues": "- Dink aan waarom die werk dalk nie vir vroue aanloklik of beskikbaar is nie.",
      "approach": "- Gee EEN rede met 'n verduideliking",
      "solution": "1. Dit word tradisioneel as 'n manswerk gesien.\n2. Of: dit is gevaarlik, of daar is nie genoeg opleiding vir vroue nie (enige een)."
    },
    {
      "number": "1.22",
      "marks": 1,
      "clues": "- Kyk na die jaar van die bron.",
      "approach": "- Soek die datum van die statistiek\n- Verduidelik waarom dit 'n probleem is",
      "solution": "1. Die inligting is uit 2018 en is verouderd."
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
