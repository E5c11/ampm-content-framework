#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 8.1.1–8.1.5: Kom ons stuur vir Tasu — Teks O
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks O l.7
 *   Q2: P: Teks O l.1-6
 *   Q3: P: Teks O l.7-11
 *   Q4: P: Teks O l.4
 *   Q5: P: Teks O l.12-15
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q15.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q15.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q15.js
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
  "name": "Vraag 8.1: Kom ons stuur vir Tasu (8.1.1–8.1.5)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "narrative_structure",
    "character_analysis",
    "theme_identification"
  ],
  "text_key": "kom_ons_stuur_vir_tasu",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q15/question_v2_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q15/question_v2_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q15/memo_v2_1.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks O",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q15/annexure_teks_o_v2_1.png"
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
    "text_key": "kom_ons_stuur_vir_tasu",
    "order": 1,
    "context_text": null,
    "question": "Hoeveel botteltjies vol tieroogklippe het Tasu gehad? Skryf net die getal.",
    "metadata": [
      "Getal:",
      "[ ]"
    ],
    "answer": [
      "57",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "kortverhale",
    "topic": "intrige_en_gebeure",
    "subtopic": "feit_uit_die_teks",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die getal kom in die woorde \"sewe-en-vyftig\" voor.\n- Skryf die syfers.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "kom_ons_stuur_vir_tasu",
    "order": 2,
    "context_text": null,
    "question": "Kies TWEE maniere waarop Tasu eerste voorstel dat hulle aan die sestig rand kan kom.",
    "metadata": [
      "Geld by iemand leen",
      "'n Ander taxi bel",
      "Eiers verkoop",
      "Ouma se kruie verkoop",
      ""
    ],
    "answer": [
      "Geld by iemand leen",
      "Eiers verkoop",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "kortverhale",
    "topic": "intrige_en_gebeure",
    "subtopic": "voorstelle_in_die_uittreksel",
    "skills": [
      "afrikaans_fal_onderskei_waar_van_onwaar"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Tasu vra eers of hulle nie iewers kan kry nie.\n- Ma sê hulle eet self die eiers."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "kom_ons_stuur_vir_tasu",
    "order": 3,
    "context_text": null,
    "question": "Waarom wil Tasu sy tieroogklippe in die begin nie verkoop nie?",
    "metadata": [
      "Hy wil al sy klippe vir Sterkman gaan gee.",
      "Hy dink die klippe is glad nie die moeite werd nie.",
      "Hy het baie hard gewerk om die botteltjies vol te maak.",
      "Hy het vergeet waar hy die botteltjies gebêre het.",
      ""
    ],
    "answer": [
      "Hy het baie hard gewerk om die botteltjies vol te maak.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "kortverhale",
    "topic": "karakter_en_verhoudings",
    "subtopic": "motief_van_karakter",
    "skills": [
      "afrikaans_fal_verklaar_karakter_se_keuse"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan wat Tasu en Sterkman gedoen het om die klippe te slyp.\n- Tasu dink: \"Ek het te hard gewerk\"."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "kom_ons_stuur_vir_tasu",
    "order": 4,
    "context_text": null,
    "question": "Watter woord beskryf die toon van Ma se woorde: \"Ek leen by niemand geld nie\"?",
    "metadata": [
      "twyfelend",
      "beslis",
      "spottend",
      "vrolik",
      ""
    ],
    "answer": [
      "beslis",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "kortverhale",
    "topic": "toon_en_stylmiddele",
    "subtopic": "toon_van_'n_aanhaling",
    "skills": [
      "afrikaans_fal_bepaal_toon"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Die uittreksel sê Ma se kop ruk.\n- Sy bly by haar besluit."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "kom_ons_stuur_vir_tasu",
    "order": 5,
    "context_text": null,
    "question": "Waarom kan 'n mens sê Tasu ervaar innerlike konflik as sy mond \"die dinge wat sy hart nie wil sê nie\" sê?",
    "metadata": [
      "Hy wil sy tieroë verkoop, maar Ma laat hom nie.",
      "Hy wil by die petrolpomp gaan werk, maar Ma verbied dit.",
      "Hy wil sy ouma se geld hê, maar skaam hom daaroor.",
      "Hy wil sy tieroë hou, maar sy liefde vir Ouma wen.",
      ""
    ],
    "answer": [
      "Hy wil sy tieroë hou, maar sy liefde vir Ouma wen.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "kortverhale",
    "topic": "karakter_en_verhoudings",
    "subtopic": "innerlike_konflik",
    "skills": [
      "afrikaans_fal_verklaar_innerlike_konflik"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Sy hart en sy mond sê verskillende dinge.\n- Wie is hy baie lief vir?"
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "8.1.1",
      "marks": 4,
      "clues": "- Lees die paragraaf en dink aan Tasu se familie.",
      "approach": "- Soek elke woord in die kortverhaal",
      "solution": "(a) Griekwastad.\n(b) gehuil.\n(c) (kruie)medisyne.\n(d) Jollyman."
    },
    {
      "number": "8.1.2",
      "marks": 1,
      "clues": "- Waarmee was Sterkman besig?",
      "approach": "- Gee een rede",
      "solution": "1. Sterkman was besig met sy matriekeksamen en moes leer."
    },
    {
      "number": "8.1.3",
      "marks": 1,
      "clues": "- Let op hoe Tasu se ma praat.",
      "approach": "- Toets elke opsie by haar woorde",
      "solution": "1. A (ernstig)."
    },
    {
      "number": "8.1.4",
      "marks": 1,
      "clues": "- Wat het Sterkman vir Tasu gesê voordat hy weg is?",
      "approach": "- Soek wat hy gesê het",
      "solution": "1. Tasu moenie sy babagesig opsit nie; hy moenie wys dat hy bang is nie."
    },
    {
      "number": "8.1.5(a)",
      "marks": 1,
      "clues": "- Waaraan dink Tasu terwyl hy in die taxi ry?",
      "approach": "- Kies die opsie tussen hakies",
      "solution": "1. hy het onthou van die slegte ervaring toe daar baie mense saam met hom was."
    },
    {
      "number": "8.1.5(b)",
      "marks": 1,
      "clues": "- Wat onthou Tasu?",
      "approach": "- Motiveer jou antwoord op 8.1.5(a)",
      "solution": "1. Tasu onthou die taxi-ongeluk waarin baie mense seergekry het en iemand gesterf het."
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
