#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P1 — November 2025 — Vraag 3: Advertensie — Teks D
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P1 language-paper skill / theme, C CAPS:
 *   Q1: P1: spelling (mirror 3.1)
 *   Q2: P1: rhetorical questions (mirror 3.2)
 *   Q3: P1: number in words (mirror 3.6)
 *   Q4: P1: fact vs opinion (mirror 3.3/3.5)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p1-q4.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q4.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q4.js
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
  "name": "Vraag 3: Advertensie",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "advertising",
    "grammar",
    "language"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q4/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q4/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q4/memo_3.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q4/annexure_teks_d_1.png"
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
    "context_text": "Wil jy jou fotovaardighede wys en 'n pryss van R5 000 wen?",
    "question": "Verbeter die SPELFOUT in die sin. Skryf net die woord wat verkeerd gespel is, korrek.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "prys",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "woordeskat",
    "topic": "klankleer_en_spelling",
    "subtopic": "verbeter_spelfout",
    "skills": [
      "afrikaans_fal_verbeter_spelfout"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Lees elke woord stadig.\n- Een woord het 'n letter te veel.",
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
    "context_text": "Is jy lief vir fotografie? Wil jy jou werk aan die wêreld wys?",
    "question": "Wat is die doel van die twee vrae bo-aan die advertensie?",
    "metadata": [
      "Hulle trek die leser se aandag en maak hom nuuskierig.",
      "Hulle gee reeds al die antwoorde op die vrae vir die leser.",
      "Hulle toets die leser se kennis oor fotografie en kameras.",
      "Hulle verduidelik stap vir stap hoe om vir die kompetisie in te skryf.",
      ""
    ],
    "answer": [
      "Hulle trek die leser se aandag en maak hom nuuskierig.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "kritiese_taalbewustheid",
    "topic": "doel_van_taalgebruik",
    "subtopic": "doel_van_retoriese_vrae",
    "skills": [
      "afrikaans_fal_verklaar_doel_van_retoriese_vraag"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Die adverteerder verwag nie dat jy sal antwoord nie.\n- Dink aan wat die vrae met die leser doen."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 3",
    "order": 3,
    "context_text": "Die kompetisie sluit oor (14) dae.",
    "question": "Skryf die GETAL in woorde.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "veertien",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "woordeskat",
    "topic": "klankleer_en_spelling",
    "subtopic": "skryf_getal_in_woorde",
    "skills": [
      "afrikaans_fal_skryf_getal_in_woorde"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Skryf een woord.\n- Let op die spelling van die tiental.",
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
    "context_text": "'n Foto kan duisend woorde sê. Die kompetisie is die beste in die land! Inskrywings moet voor 30 Junie ingestuur word. Almal sal hou van hierdie kompetisie. Die foto's word deur 'n paneel beoordeel.",
    "question": "Kies TWEE stellings wat MENINGS is.",
    "metadata": [
      "Die kompetisie is die beste in die land!",
      "Inskrywings moet voor 30 Junie ingestuur word.",
      "Almal sal hou van hierdie kompetisie.",
      "Die foto's word deur 'n paneel beoordeel.",
      ""
    ],
    "answer": [
      "Die kompetisie is die beste in die land!",
      "Almal sal hou van hierdie kompetisie.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "kritiese_taalbewustheid",
    "topic": "feit_en_mening",
    "subtopic": "onderskei_feit_van_mening",
    "skills": [
      "afrikaans_fal_onderskei_feit_van_mening"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- 'n Feit kan bewys word; 'n mening is wat iemand dink.\n- Woorde soos \"beste\" en \"almal\" wys dikwels op 'n mening."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1",
      "marks": 1,
      "clues": "- Vergelyk die spelling van \"voetspoor\" met die woord in die sin.",
      "approach": "- Lees die sin woord vir woord\n- Verbeter die woord wat verkeerd gespel is",
      "solution": "1. voetspore (nie \"voetspoore\" nie)."
    },
    {
      "number": "3.2",
      "marks": 1,
      "clues": "- Wat doen retoriese vrae met 'n leser?",
      "approach": "- Dink aan wat die vrae vir die leser doen\n- Kies EEN doel",
      "solution": "1. Hulle trek die leser se aandag of prikkel sy belangstelling.\n2. Of: hulle gee die leser kans om na te dink of maak die advertensie persoonlik."
    },
    {
      "number": "3.3",
      "marks": 1,
      "clues": "- Is dit wat die adverteerder sê, iets wat almal sal glo?",
      "approach": "- Motiveer waarom dit 'n mening is\n- Gee 'n rede, nie net MENING nie",
      "solution": "1. Nie almal hou van kompetisies nie, of party mense verkies ander dinge om te skep.\n2. Dit is die adverteerder se opinie en is nie bewys nie."
    },
    {
      "number": "3.4",
      "marks": 1,
      "clues": "- Kyk na hoe die pryse uitgelê is.",
      "approach": "- Dink aan wat blokkies met inligting doen\n- Gee EEN rede",
      "solution": "1. Dit beklemtoon die pryse of groepeer die inligting oor elke prys.\n2. Dit trek die leser se oog na die pryse toe."
    },
    {
      "number": "3.5",
      "marks": 1,
      "clues": "- Soek in die advertensie na enige ouderdomsbeperking.",
      "approach": "- Lees die hele advertensie\n- Motiveer waarom die stelling ONWAAR is",
      "solution": "1. Die advertensie noem geen ouderdomsbeperking nie, dus kan almal deelneem."
    },
    {
      "number": "3.6",
      "marks": 1,
      "clues": "- Skryf die getal 20 as 'n woord.",
      "approach": "- Skryf die getal voluit\n- Let op die spelling",
      "solution": "1. twintig."
    },
    {
      "number": "3.7.1",
      "marks": 1,
      "clues": "- Kyk na die stappe onder die opskrif \"Hoe skryf jy in?\".",
      "approach": "- Lees die stappe\n- Verduidelik waarom dit maklik is",
      "solution": "1. Die instruksies is duidelik en in stappe verduidelik.\n2. Of: daar is nie baie stappe om te volg nie."
    },
    {
      "number": "3.7.2",
      "marks": 1,
      "clues": "- Hoe moet jy inskryf?",
      "approach": "- Dink aan wat jy vir die inskrywing nodig het\n- Gee EEN rede",
      "solution": "1. Die inskrywings is elektronies; nie almal het 'n rekenaar of internet nie."
    },
    {
      "number": "3.8",
      "marks": 1,
      "clues": "- Dink aan wat jy nog wil weet voordat jy inskryf.",
      "approach": "- Kyk wat ontbreek\n- Noem EEN ding",
      "solution": "1. Die inskrywingsfooi, kontakbesonderhede, die aanvangsdatum, wanneer die uitslae bekend gemaak word of die lengte van die stuk (enige een)."
    },
    {
      "number": "3.9",
      "marks": 1,
      "clues": "- Kyk na die drie prentjies en hoe elkeen by skryf pas.",
      "approach": "- Kies EEN prentjie\n- Gee 'n rede wat by 'n skryfkompetisie pas",
      "solution": "1. Die hand met die potlood: jy hou 'n potlood vas as jy skryf.\n2. Die veertjie: stories is vroeër met 'n veer geskryf.\n3. Die boek met potlood en uitveër: mense beplan en skryf in boeke."
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
