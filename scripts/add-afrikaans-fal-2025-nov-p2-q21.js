#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 9.2.1–9.2.4: Ken jy die see ... — Uys Krige
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Ken jy die see l.5
 *   Q2: P: Ken jy die see l.1 en refrein
 *   Q3: P: Ken jy die see l.2
 *   Q4: P: Ken jy die see l.16-22
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q21.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q21.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q21.js
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
  "name": "Vraag 9.2: Ken jy die see ... (9.2.1–9.2.4)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 21,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "poetry_analysis",
    "poetic_devices",
    "tone_and_mood"
  ],
  "text_key": "ken_jy_die_see",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q21/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q21/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Poem",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q21/annexure_poem_1.png",
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q21/annexure_poem_2.png"
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
    "text_key": "ken_jy_die_see",
    "order": 1,
    "context_text": null,
    "question": "Voltooi die refrein met een woord: \"Dan sê jy nog, Meneer, die vis is ...\"",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "duur",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "gedigte",
    "topic": "spreker_en_inhoud",
    "subtopic": "refrein",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die refrein herhaal aan die einde van elke strofe.\n- Skryf een woord.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "ken_jy_die_see",
    "order": 2,
    "context_text": null,
    "question": "Wie word in die gedig as \"Meneer\" aangespreek?",
    "metadata": [
      "'n Visserman wat sy vangs verkoop.",
      "Mevrou Mathee wat oor die see tuur.",
      "Die see self.",
      "'n Meneer wat kla dat die vis duur is.",
      ""
    ],
    "answer": [
      "'n Meneer wat kla dat die vis duur is.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "gedigte",
    "topic": "spreker_en_inhoud",
    "subtopic": "aangesprokene_in_die_gedig",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Die spreker sê aan die einde van elke strofe wat Meneer nog sê.\n- Dink aan wie die vis koop."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "ken_jy_die_see",
    "order": 3,
    "context_text": null,
    "question": "Watter stylfiguur kom voor in: \"Hy lyk nou soos jou voorstoep blinkgeskuur\"?",
    "metadata": [
      "metafoor",
      "vergelyking",
      "personifikasie",
      "klanknabootsing",
      ""
    ],
    "answer": [
      "vergelyking",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "gedigte",
    "topic": "beeldspraak_en_stylmiddele",
    "subtopic": "identifiseer_stylfiguur",
    "skills": [
      "afrikaans_fal_identifiseer_stylfiguur"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Let op die woord \"soos\".\n- Die see word met 'n voorstoep vergelyk."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "ken_jy_die_see",
    "order": 4,
    "context_text": null,
    "question": "Kies TWEE gevare van die see wat in die gedig genoem word.",
    "metadata": [
      "Storms wat nooit ophou raas",
      "Haaie wat die bootjies aanval",
      "Golwe so hoog soos 'n tronk se muur",
      "Mis wat die hawe toemaak",
      ""
    ],
    "answer": [
      "Storms wat nooit ophou raas",
      "Golwe so hoog soos 'n tronk se muur",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "gedigte",
    "topic": "spreker_en_inhoud",
    "subtopic": "gevare_van_die_see",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Kyk in strofe 4 en 5 na wat die see doen.\n- Twee opsies kom in die gedig voor."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "9.2.1",
      "marks": 4,
      "clues": "- Lees die paragraaf en dink aan die vissermanne se lewe.",
      "approach": "- Soek elke woord in die gedig",
      "solution": "(a) hulp (redmiddel, kuur).\n(b) pal.\n(c) bootjie(s).\n(d) duur."
    },
    {
      "number": "9.2.2",
      "marks": 2,
      "clues": "- Vergelyk hoe die see lyk met wat hy werklik is.",
      "approach": "- Verduidelik die kontras in eie woorde",
      "solution": "1. Die see lyk rustig en kalm, maar is eintlik baie gevaarlik en bedrieglik."
    },
    {
      "number": "9.2.3",
      "marks": 1,
      "clues": "- Let op die rym.",
      "approach": "- Gee een rede",
      "solution": "1. Die woord \"buur\" pas in by die kruisrym van die gedig en behou die ritme."
    },
    {
      "number": "9.2.4",
      "marks": 1,
      "clues": "- Wie praat in reël 23?",
      "approach": "- Verduidelik die effek van direkte rede",
      "solution": "1. Dit maak die woorde persoonlik en betrek die vissermanne direk; dit beklemtoon dat die see lewens neem."
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
