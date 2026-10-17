#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 9.2.5–9.2.10: Ken jy die see ... — Uys Krige
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Ken jy die see l.38
 *   Q2: P: Ken jy die see l.11, 13, 21
 *   Q3: P: Ken jy die see l.36-39
 *   Q4: P: Ken jy die see l.3-36
 *   Q5: P: Ken jy die see
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q22.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q22.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q22.js
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
  "name": "Vraag 9.2: Ken jy die see ... (9.2.5–9.2.10)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 22,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q22/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q22/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q22/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q22/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Poem",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q22/annexure_poem_1.png",
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q22/annexure_poem_2.png"
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
    "question": "Wat is die effek van die verkleinwoord \"briesie\" in: \"Sy dink dié briesie bring haar seuns betyds vir tee\"?",
    "metadata": [
      "Die verkleinwoord wys dat die wind baie sterk waai.",
      "Die verkleinwoord wys dat die vissermanne bang is.",
      "Die verkleinwoord wys sy dink die wind is sag en onskadelik.",
      "Die verkleinwoord wys dat die see vandag glad nie visse het nie.",
      ""
    ],
    "answer": [
      "Die verkleinwoord wys sy dink die wind is sag en onskadelik.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "gedigte",
    "topic": "beeldspraak_en_stylmiddele",
    "subtopic": "effek_van_die_verkleinwoord",
    "skills": [
      "afrikaans_fal_verklaar_betekenis_in_konteks"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- 'n Briesie is 'n klein, sagte wind.\n- Wat dink mevrou Mathee oor die wind?"
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
    "question": "Pas elke woordgroep by die stylfiguur wat dit is.",
    "metadata": [
      "A - Die Dood staan voor die deur.",
      "B - soos 'n veer gevee",
      "C - die swart, swart wind",
      "1 - vergelyking",
      "2 - herhaling",
      "3 - personifikasie"
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
    "unit": "gedigte",
    "topic": "beeldspraak_en_stylmiddele",
    "subtopic": "identifiseer_stylfiguur",
    "skills": [
      "afrikaans_fal_identifiseer_stylfiguur"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Let op die woord \"soos\" en op woorde wat herhaal word.\n- Aan wie word 'n menslike handeling gegee?"
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
    "question": "Wie is mevrou Mathee in die gedig?",
    "metadata": [
      "'n Ou vroutjie wie se drie seuns op see gesterf het.",
      "'n Jong meisie wat elke dag op die kaai haar pa wag.",
      "'n Visserman wat sy bootjie en al sy vangs verloor het.",
      "Die eienaar van die visswinkel in die hawe by die dorp.",
      ""
    ],
    "answer": [
      "'n Ou vroutjie wie se drie seuns op see gesterf het.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "gedigte",
    "topic": "spreker_en_inhoud",
    "subtopic": "karakter_in_die_gedig",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Kyk na reël 36 tot 39.\n- Wat sê reël 39 oor haar seuns?"
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
    "question": "Rangskik die dele in die volgorde waarin hulle in die gedig voorkom.",
    "metadata": [
      "Die Dood staan voor die deur.",
      "Die spreker wys na mevrou Mathee.",
      "Die spreker sê die see lyk kalm.",
      "Die wind word 'n bulderende wind.",
      ""
    ],
    "answer": [
      "Die spreker sê die see lyk kalm.",
      "Die wind word 'n bulderende wind.",
      "Die Dood staan voor die deur.",
      "Die spreker wys na mevrou Mathee.",
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
    "clues": "- Volg die gedig strofe vir strofe.\n- Mevrou Mathee kom in die laaste strofe."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "ken_jy_die_see",
    "order": 5,
    "context_text": null,
    "question": "Watter tema kom in die gedig voor?",
    "metadata": [
      "Die voordele van goedkoop kos vir elke gesin.",
      "Die skoonheid van 'n kalm see en blink strand.",
      "Hoe om 'n bootjie sterk genoeg te bou.",
      "Die gevare van die see vir vissermanne.",
      ""
    ],
    "answer": [
      "Die gevare van die see vir vissermanne.",
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
    "clues": "- Waarom sê die spreker die vis is nie te duur nie?\n- Dink aan mevrou Mathee se seuns."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "9.2.5",
      "marks": 1,
      "clues": "- Wat beteken \"misstappie\" met 'n verkleinwoord?",
      "approach": "- Toets elke opsie",
      "solution": "1. D (die kleinste foutjie kan die vissermanne laat sterf)."
    },
    {
      "number": "9.2.6",
      "marks": 3,
      "clues": "- Hoe voel die spreker oor Meneer se klagte?",
      "approach": "- Kies tussen elke opsie tussen hakies",
      "solution": "(a) ontevrede.\n(b) onregverdig.\n(c) beklemtoon."
    },
    {
      "number": "9.2.7",
      "marks": 3,
      "clues": "- Pas elke aanhaling by die stylfiguur.",
      "approach": "- Let op klanke, mense en vergelykings",
      "solution": "(a) B (personifikasie).\n(b) A (alliterasie).\n(c) D ('n vergelyking)."
    },
    {
      "number": "9.2.8",
      "marks": 1,
      "clues": "- Wat leer jy by die meneer wat kla?",
      "approach": "- Gee een les",
      "solution": "1. Ek moet die konteks van iets verstaan voordat ek kla; vissermanne doen gevaarlike werk."
    },
    {
      "number": "9.2.9",
      "marks": 1,
      "clues": "- Lees reël 37 en 38.",
      "approach": "- Motiveer hoekom jy simpatie het",
      "solution": "1. Mevrou Mathee het haar seuns verloor en tuur nog met verlange oor die see."
    },
    {
      "number": "9.2.10",
      "marks": 1,
      "clues": "- Wat is die doel van die laaste strofe?",
      "approach": "- Verduidelik waarom die storie 'n gepaste slot is",
      "solution": "1. Die vertelling van die gevare bereik 'n hoogtepunt met die dood van die Mathee-seuns en bevestig dat die see jou lewe kan neem."
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
