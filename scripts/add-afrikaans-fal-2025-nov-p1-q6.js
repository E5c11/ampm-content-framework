#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P1 — November 2025 — Vraag 5.1.1–5.1.5: Artikel — Teks F
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P1 language-paper skill / theme, C CAPS:
 *   Q1: P1: noun from verb (mirror 5.1.1)
 *   Q2: P1: one word for a phrase (mirror 5.1.2)
 *   Q3: P1: past tense (mirror 5.1.3)
 *   Q4: P1: superlative (mirror 5.1.4)
 *   Q5: P1: pronoun (mirror 5.1.5)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p1-q6.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q6.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q6.js
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
  "name": "Vraag 5.1: Artikel (5.1.1–5.1.5)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p1",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "grammar",
    "editing",
    "sentence_construction"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q6/question_v2_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q6/question_v2_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q6/question_v2_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q6/memo_v2_1.png"
  ],
  "exam_question_marks": 5,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks F",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q6/annexure_teks_f_v2_1.png"
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
    "context_text": "Pieter is 'n gewilde (skryf) van kinderstories.",
    "question": "Vorm 'n SELFSTANDIGE NAAMWOORD van die werkwoord tussen hakies.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "skrywer",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "sinstrukture",
    "topic": "selfstandige_naamwoorde",
    "subtopic": "selfstandige_naamwoord_van_werkwoord",
    "skills": [
      "afrikaans_fal_vorm_selfstandige_naamwoord"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- Die persoon wat die werkwoord doen, kry 'n -er-einde.\n- Let op die spelling van die stam.",
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
    "context_text": "Die biblioteek word (elke maand) skoongemaak.",
    "question": "Gee EEN WOORD vir die woorde tussen hakies.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "maandeliks",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "woordeskat",
    "topic": "betekenisleer",
    "subtopic": "een_woord_vir_omskrywing",
    "skills": [
      "afrikaans_fal_gee_een_woord_vir_omskrywing"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- Dink aan 'n bywoord van tyd wat uit een woord bestaan.\n- Dit eindig op -liks.",
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
    "question": "Watter sin is die korrekte VERLEDE TYD van: Die leerders ontvang die pryse by die skool?",
    "metadata": [
      "Die leerders ontvang die pryse by die skool gister.",
      "Die leerders sal die pryse by die skool ontvang.",
      "Die leerders het die pryse by die skool ontvang.",
      "Die leerders het die pryse by die skool ontvang het.",
      ""
    ],
    "answer": [
      "Die leerders het die pryse by die skool ontvang.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "sinstrukture",
    "topic": "werkwoorde",
    "subtopic": "verlede_tyd",
    "skills": [
      "afrikaans_fal_kies_sin_in_verlede_tyd"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- Die verlede tyd gebruik \"het\" voor die werkwoord.\n- Die werkwoord self kom aan die einde van die sin."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 4",
    "order": 4,
    "context_text": "Dit is die (goed) kos wat ons nog ooit geproe het.",
    "question": "Gee die OORTREFFENDE TRAP van die woord tussen hakies.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "beste",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "sinstrukture",
    "topic": "byvoeglike_naamwoorde",
    "subtopic": "trappe_van_vergelyking",
    "skills": [
      "afrikaans_fal_vorm_oortreffende_trap"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- Die woord \"goed\" volg 'n onreëlmatige patroon.\n- Skryf net die oortreffende trap.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 5",
    "order": 5,
    "context_text": null,
    "question": "Kies TWEE sinne waarin die VOORNAAMWOORD korrek gebruik is.",
    "metadata": [
      "Thabo het sy fiets verloor.",
      "Thabo het haar fiets verloor.",
      "Annelie het haar tas by die huis gelos.",
      "Annelie het sy tas by die huis gelos.",
      ""
    ],
    "answer": [
      "Thabo het sy fiets verloor.",
      "Annelie het haar tas by die huis gelos.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "sinstrukture",
    "topic": "selfstandige_naamwoorde",
    "subtopic": "besitlike_voornaamwoord",
    "skills": [
      "afrikaans_fal_kies_korrekte_voornaamwoord"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- Die voornaamwoord moet by die geslag van die persoon pas.\n- Twee sinne is korrek."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.1.1",
      "marks": 1,
      "clues": "- Wie doen die werk van 'n inwoon?",
      "approach": "- Dink aan die agtervoegsel -er\n- Let op die spelling",
      "solution": "1. inwoner."
    },
    {
      "number": "5.1.2",
      "marks": 1,
      "clues": "- Een woord vir \"elke jaar\".",
      "approach": "- Dink aan 'n bywoord van tyd\n- Skryf een woord",
      "solution": "1. jaarliks."
    },
    {
      "number": "5.1.3",
      "marks": 1,
      "clues": "- Gebruik die verlede tyd met \"het\" en die voltooide deelwoord.",
      "approach": "- Verander die werkwoord\n- Hou die woordorde korrek",
      "solution": "1. In 2024 het hy drie ton hondekos deur die Kersliggie-projek ontvang."
    },
    {
      "number": "5.1.4",
      "marks": 1,
      "clues": "- Die trappe van vergelyking van \"baie\" is onreëlmatig.",
      "approach": "- Dink aan die oortreffende trap\n- Skryf een woord",
      "solution": "1. meeste."
    },
    {
      "number": "5.1.5",
      "marks": 1,
      "clues": "- Wie se gesin is dit?",
      "approach": "- Kyk na die onderwerp \"Hy\"\n- Kies die voornaamwoord wat by hom pas",
      "solution": "1. sy."
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
