#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P1 — November 2025 — Vraag 4: Strokiesprent — Teks E
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P1 language-paper skill / theme, C CAPS:
 *   Q1: P1: indirect speech (mirror 4.5)
 *   Q2: P1: infinitive (mirror 4.6)
 *   Q3: P1: sound words / technique (mirror 4.2.1)
 *   Q4: P1: believability (mirror 4.7)
 *   Q5: P1: order of events (cf. 4.2.2)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p1-q5.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q5.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q5.js
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
  "name": "Vraag 4: Strokiesprent",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "cartoons",
    "direct_and_indirect_speech",
    "grammar"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q5/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q5/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q5/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q5/memo_3.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks E",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q5/annexure_teks_e_1.png"
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
    "context_text": "Ma sê: \"Pieter, dit is Lize se afstandbeheer.\"",
    "question": "Watter sin gee Ma se woorde in die INDIREKTE REDE weer? Begin só: Ma sê ...",
    "metadata": [
      "Ma sê vir Pieter dat dit is Lize se afstandbeheer.",
      "Ma sê vir Pieter dat dit Lize se afstandbeheer was.",
      "Ma sê vir Pieter dat dit Lize se afstandbeheer is.",
      "Ma sê vir Pieter dit is Lize se afstandbeheer dat.",
      ""
    ],
    "answer": [
      "Ma sê vir Pieter dat dit Lize se afstandbeheer is.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "sinstrukture",
    "topic": "direkte_en_indirekte_rede",
    "subtopic": "stelsin_in_indirekte_rede",
    "skills": [
      "afrikaans_fal_skryf_in_indirekte_rede"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- In die indirekte rede gebruik jy \"dat\" en die werkwoord skuif na die einde van die bysin.\n- Ma se uitspraak gebeur nou: die tyd verander nie."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 2",
    "order": 2,
    "context_text": "Dis nie nodig (met hom baklei) nie!",
    "question": "Watter sin gee die gedeelte tussen hakies in die INFINITIEF?",
    "metadata": [
      "Dis nie nodig om te met hom baklei nie!",
      "Dis nie nodig om met hom baklei nie!",
      "Dis nie nodig met hom te baklei nie!",
      "Dis nie nodig om met hom te baklei nie!",
      ""
    ],
    "answer": [
      "Dis nie nodig om met hom te baklei nie!",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "sinstrukture",
    "topic": "werkwoorde",
    "subtopic": "infinitief",
    "skills": [
      "afrikaans_fal_vorm_infinitief"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "clues": "- Die infinitief gebruik \"om ... te\" voor die werkwoord.\n- Die \"te\" staan reg voor die werkwoord."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 3",
    "order": 3,
    "context_text": "BOEM! 'n Bord val van die rak en breek met 'n harde KRAAK.",
    "question": "Watter stylfiguur is BOEM en KRAAK? Skryf net die term.",
    "metadata": [
      "Term:",
      "[ ]"
    ],
    "answer": [
      "klanknabootsing|onomatopee",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "visuele_tekste",
    "topic": "strokiesprent",
    "subtopic": "klanknabootsing",
    "skills": [
      "afrikaans_fal_identifiseer_klanknabootsing"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Hierdie woorde boots 'n geluid na.\n- Skryf een woord.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 4",
    "order": 4,
    "context_text": "Twee broers baklei oor die afstandbeheer terwyl Ma kombuis toe stap.",
    "question": "Waarom is hierdie situasie geloofwaardig?",
    "metadata": [
      "Broers en susters baklei nooit oor sulke klein dingetjies nie.",
      "Dit gebeur gereeld tussen broers en susters.",
      "Net hierdie twee kinders in die hele wêreld baklei so.",
      "Ouers skree altyd op hulle kinders as daar 'n probleem is.",
      ""
    ],
    "answer": [
      "Dit gebeur gereeld tussen broers en susters.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "leesbegrip",
    "topic": "evaluerende_lees",
    "subtopic": "geloofwaardigheid",
    "skills": [
      "afrikaans_fal_verklaar_geloofwaardigheid"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- Dink aan wat in baie huise gebeur.\n- 'n Geloofwaardige situasie klink soos die werklike lewe."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 5",
    "order": 5,
    "context_text": "Pieter sit sy hand op die afstandbeheer. Lize gryp dit. Pieter skree. Ma kom in en praat rustig.",
    "question": "Rangskik die gebeure in die korrekte volgorde.",
    "metadata": [
      "Ma praat rustig.",
      "Lize gryp dit.",
      "Pieter sit sy hand op die afstandbeheer.",
      "Pieter skree.",
      ""
    ],
    "answer": [
      "Pieter sit sy hand op die afstandbeheer.",
      "Lize gryp dit.",
      "Pieter skree.",
      "Ma praat rustig.",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "visuele_tekste",
    "topic": "strokiesprent",
    "subtopic": "volgorde_van_gebeure",
    "skills": [
      "afrikaans_fal_rangskik_gebeure_in_strokiesprent"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan wat eerste gebeur voordat die kinders baklei.\n- Die rustige reaksie kom laaste."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1",
      "marks": 1,
      "clues": "- Kyk na Anna se hande en gesig in raampie 2.",
      "approach": "- Kyk na wat Anna doen of sê\n- Gee EEN bewys",
      "solution": "1. Haar hande is in die lug, of sy skree \"JIPPIE\", of sy glimlag breed."
    },
    {
      "number": "4.2.1",
      "marks": 1,
      "clues": "- Vergelyk die woorde en leestekens in raampie 1 tot 3.",
      "approach": "- Kyk na die grootte en die uitroeptekens\n- Noem EEN tegniek",
      "solution": "1. Daar is al meer uitroeptekens, of die woorde word al groter en meer hoofletters."
    },
    {
      "number": "4.2.2",
      "marks": 2,
      "clues": "- Vergelyk wat Sara in raampie 1 en 3 doen.",
      "approach": "- Beskryf Sara in raampie 1\n- Beskryf Sara in raampie 3",
      "solution": "1. Raampie 1: sy lê en teken, of sy praat hard.\n2. Raampie 3: sy gryp haar goed of sy skree vir Anna."
    },
    {
      "number": "4.3",
      "marks": 1,
      "clues": "- Wat wys 'n bewegingslyn?",
      "approach": "- Dink aan wat die lyn en die woord GRYP wys\n- Kies tussen vinnig en stadig",
      "solution": "1. vinnig."
    },
    {
      "number": "4.4.1",
      "marks": 1,
      "clues": "- Kyk na hoe Ma praat en na die grootte van haar woorde.",
      "approach": "- Kyk na Ma se stemtoon\n- Gee EEN bewys",
      "solution": "1. Sy praat rustig, haar woorde het geen uitroeptekens nie, of sy neem Sara se goed rustig."
    },
    {
      "number": "4.4.2",
      "marks": 1,
      "clues": "- Wat doen 'n kind wat WAAAHHH skree?",
      "approach": "- Dink aan wat die klank beteken",
      "solution": "1. Anna huil of skree baie hard, of sy is hartseer."
    },
    {
      "number": "4.5",
      "marks": 1,
      "clues": "- Begin met \"Ma sê\" en gebruik \"dat\".",
      "approach": "- Verander na indirekte rede\n- Let op voornaamwoorde en woordorde",
      "solution": "1. Ma sê vir Anna dat dit Sara se goed is."
    },
    {
      "number": "4.6",
      "marks": 1,
      "clues": "- Gebruik \"om ... te\" en skryf die hele sin.",
      "approach": "- Maak die infinitief\n- Skryf die hele sin",
      "solution": "1. Dis nie nodig om met haar te raas nie."
    },
    {
      "number": "4.7",
      "marks": 1,
      "clues": "- Dink aan jou eie huis of aan hoe susters en broers is.",
      "approach": "- Dink aan die gewone lewe\n- Gee EEN rede",
      "solution": "1. Dit gebeur gereeld tussen susters of broers dat hulle baklei oor goed."
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
