#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 3.11–3.20: Meeulanders — Teks F
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks F l.5-6
 *   Q2: P: Teks F l.8
 *   Q3: P: Teks F l.4-22
 *   Q4: P: Teks F
 *   Q5: P: Teks F
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q6.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q6.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q6.js
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
  "name": "Vraag 3: Meeulanders (3.11–3.20)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "character_analysis",
    "contextual_questions",
    "literary_analysis"
  ],
  "text_key": "meeulanders",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q6/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q6/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q6/memo_2.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks F",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q6/annexure_teks_f_1.png"
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
    "text_key": "meeulanders",
    "order": 1,
    "context_text": null,
    "question": "Watter stylfiguur kom voor in: \"My aarde, man, waar in die wêreld is jy?\"?",
    "metadata": [
      "vergelyking",
      "hiperbool",
      "personifikasie",
      "ironie",
      ""
    ],
    "answer": [
      "hiperbool",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "roman",
    "topic": "toon_en_stylmiddele",
    "subtopic": "identifiseer_stylfiguur",
    "skills": [
      "afrikaans_fal_identifiseer_stylfiguur"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die woorde oordryf hoe ver Ryna weg was.\n- Dit is 'n uitroep, nie 'n letterlike vraag nie."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "meeulanders",
    "order": 2,
    "context_text": null,
    "question": "Wat beteken: \"Sy voel dat hy haar dophou\"?",
    "metadata": [
      "Sy voel dat hy haar wil laat bly.",
      "Sy voel dat hy haar nie wil sien nie.",
      "Sy voel dat hy haar noukeurig dophou.",
      "Sy voel dat hy haar tee wil laat drink.",
      ""
    ],
    "answer": [
      "Sy voel dat hy haar noukeurig dophou.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "roman",
    "topic": "toon_en_stylmiddele",
    "subtopic": "betekenis_van_'n_aanhaling",
    "skills": [
      "afrikaans_fal_verklaar_betekenis_in_konteks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Wat doen jy met jou oë as jy iemand dophou?\n- Die woorde staan na die tee gekom het."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "meeulanders",
    "order": 3,
    "context_text": null,
    "question": "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.",
    "metadata": [
      "Henning sê die naam lui geen klokkie nie.",
      "Henning bestel tee vir twee.",
      "Ryna vra of die naam Schalk Blanckenberg bekend klink.",
      "Ryna sê sy hou skool op Salamanderbaai.",
      ""
    ],
    "answer": [
      "Henning bestel tee vir twee.",
      "Ryna sê sy hou skool op Salamanderbaai.",
      "Ryna vra of die naam Schalk Blanckenberg bekend klink.",
      "Henning sê die naam lui geen klokkie nie.",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "roman",
    "topic": "intrige_en_gebeure",
    "subtopic": "volgorde_in_die_uittreksel",
    "skills": [
      "afrikaans_fal_rangskik_gebeure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Volg die gesprek tussen Ryna en Henning reël vir reël.\n- Hulle drink tee voor Ryna die naam noem."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "meeulanders",
    "order": 4,
    "context_text": null,
    "question": "Watter stelling oor die uittreksel is ONWAAR?",
    "metadata": [
      "Ryna het vir Henning gesê dat sy skool op Salamanderbaai hou.",
      "Henning het by sy kantoor tee vir hulle albei bestel.",
      "Ryna het Henning gevra om haar met 'n saak te help.",
      "Henning het die naam Schalk Blanckenberg dadelik herken.",
      ""
    ],
    "answer": [
      "Henning het die naam Schalk Blanckenberg dadelik herken.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "roman",
    "topic": "intrige_en_gebeure",
    "subtopic": "onwaar_stelling",
    "skills": [
      "afrikaans_fal_onderskei_waar_van_onwaar"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Wat sê Henning toe hy die naam hoor?\n- Toets elke stelling teen die uittreksel."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "meeulanders",
    "order": 5,
    "context_text": null,
    "question": "Kies TWEE temas wat in die uittreksel na vore kom.",
    "metadata": [
      "Die soeke na die waarheid oor 'n misdaad",
      "Die voordele van onderwys op die platteland",
      "Die gevolge van geheime uit die verlede",
      "Hoe om 'n boek te skryf",
      ""
    ],
    "answer": [
      "Die soeke na die waarheid oor 'n misdaad",
      "Die gevolge van geheime uit die verlede",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "roman",
    "topic": "tema_en_boodskap",
    "subtopic": "temas_in_die_uittreksel",
    "skills": [
      "afrikaans_fal_identifiseer_temas"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Waarvoor gaan Ryna na Henning se kantoor?\n- Twee opsies pas by die uittreksel."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.11",
      "marks": 4,
      "clues": "- Dink aan die volgorde van die gebeure in die roman.",
      "approach": "- Rangskik die vier gebeure",
      "solution": "1. Ryna se boek oor kusvoëls is bekendgestel.\n2. Attie het in Windhoek gaan werk.\n3. Jacob het Skalla doodgesteek.\n4. Ryna het vir Fred vertel dat Janka sy kind is."
    },
    {
      "number": "3.12.1",
      "marks": 1,
      "clues": "- Let op die woord \"soos\".",
      "approach": "- Kies tussen hiperbool en vergelyking",
      "solution": "1. vergelyking."
    },
    {
      "number": "3.12.2",
      "marks": 1,
      "clues": "- Wat beteken dit as iemand soos 'n speld verdwyn?",
      "approach": "- Verduidelik die vetgedrukte woorde",
      "solution": "1. Niemand het geweet waar sy was nie; sy het net verdwyn."
    },
    {
      "number": "3.13",
      "marks": 1,
      "clues": "- Wat sê Henning se woorde oor sy geheue?",
      "approach": "- Toets elke opsie",
      "solution": "1. B (hy kon glad nie die naam onthou nie)."
    },
    {
      "number": "3.14.1",
      "marks": 1,
      "clues": "- Hoe het Henning vir Ryna geken?",
      "approach": "- Soek na wie \"Camilla\" verwys",
      "solution": "1. Na Ryna (van Rensburg)."
    },
    {
      "number": "3.14.2",
      "marks": 1,
      "clues": "- Wat het Henning nie geweet nie?",
      "approach": "- Verduidelik die aanhaling",
      "solution": "1. Henning het haar net as Camilla geken en het nie geweet sy is nou Ryna nie."
    },
    {
      "number": "3.15",
      "marks": 1,
      "clues": "- Wat het Skalla op sy arm gehad?",
      "approach": "- Gee 'n feit wat die stelling weerlê",
      "solution": "1. Skalla het 'n tatoeëermerk van 'n slang (of 'n anker met 'n slang) op sy arm gehad."
    },
    {
      "number": "3.16.1",
      "marks": 1,
      "clues": "- Wat dink Ryna oor wat Henning weet?",
      "approach": "- Kies die opsie tussen hakies",
      "solution": "1. die aanname gemaak dat Henning weet."
    },
    {
      "number": "3.16.2",
      "marks": 1,
      "clues": "- Wat was Henning se rol in die saak?",
      "approach": "- Gee een rede",
      "solution": "1. Henning en Vincent was vriende en Henning was die prokureur wat aan die saak gewerk het."
    },
    {
      "number": "3.17",
      "marks": 1,
      "clues": "- Wat sou Henning verloor as die waarheid uitkom?",
      "approach": "- Gee een rede",
      "solution": "1. Henning was deel van die skelmstreke en sou sy werk en status verloor het."
    },
    {
      "number": "3.18",
      "marks": 1,
      "clues": "- Dink aan wat met Janka gebeur het.",
      "approach": "- Verduidelik waarom jy kan identifiseer",
      "solution": "1. Ryna wou geregtigheid vir Janka en Jacob hê en keer dat Skalla nog mense seermaak."
    },
    {
      "number": "3.19",
      "marks": 2,
      "clues": "- Wat kon Fred erken?",
      "approach": "- Soek twee positiewe gevolge",
      "solution": "1. Fred kon erken dat hy Jacob se lewe ontwrig het en 'n leuenaar was.\n2. Hy kon erken dat hy die vrouens in sy lewe sleg behandel het."
    },
    {
      "number": "3.20",
      "marks": 1,
      "clues": "- Wie word aan die einde soos familie vir mekaar?",
      "approach": "- Verduidelik hoekom die tema pas",
      "solution": "1. Ryna het vir Jannerik blyplek gegee en kon met Doreen en Ousanna alles deel."
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
