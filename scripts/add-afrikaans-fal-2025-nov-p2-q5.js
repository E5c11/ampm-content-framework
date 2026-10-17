#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 3.1–3.10: Meeulanders — Teks E
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: X: Q3.11 (other half), fresh angle
 *   Q2: P: Teks E l.13-14
 *   Q3: P: Teks E l.16-17
 *   Q4: X: Q3.7/3.11 facts
 *   Q5: L: identify (mirror 3.9)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q5.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q5.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q5.js
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
  "name": "Vraag 3: Meeulanders (3.1–3.10)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 5,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q5/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q5/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q5/memo_3.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks E",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q5/annexure_teks_e_1.png"
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
    "question": "Waaroor het Ryna se boek gehandel wat bekendgestel is? Skryf net een woord.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "kusvoëls",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "roman",
    "topic": "intrige_en_gebeure",
    "subtopic": "feit_uit_die_roman",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Dink aan die diere naby Salamanderbaai.\n- Skryf een woord.",
    "keyboard_type": "text"
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
    "question": "Watter woord beskryf Jacob se toon in: \"My God, Ryna. Hoekom het jy nie lankal gepraat nie?\"?",
    "metadata": [
      "vrolik",
      "spottend",
      "onverskillig",
      "geskok",
      ""
    ],
    "answer": [
      "geskok",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "roman",
    "topic": "toon_en_stylmiddele",
    "subtopic": "toon_van_'n_aanhaling",
    "skills": [
      "afrikaans_fal_bepaal_toon"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Let op hoe die uittreksel Jacob se stilte beskryf voordat hy praat.\n- Hy het Ryna se storie net gehoor."
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
    "question": "Waarom ervaar Ryna innerlike konflik as sy sê: \"Ek wou nie daaroor praat nie. Ek wil ook nooit weer daaroor praat nie\"?",
    "metadata": [
      "Sy wil graag oor die verlede praat, maar Jacob wil nie luister nie.",
      "Sy is bly dat die vuur weg is en wil dadelik kuier.",
      "Sy het die trauma weggebêre, maar die vuur het dit weer opgeroep.",
      "Sy het vergeet wat in die verlede gebeur het.",
      ""
    ],
    "answer": [
      "Sy het die trauma weggebêre, maar die vuur het dit weer opgeroep.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "roman",
    "topic": "karakter_en_verhoudings",
    "subtopic": "innerlike_konflik",
    "skills": [
      "afrikaans_fal_verklaar_innerlike_konflik"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Ryna het so pas vir Jacob haar verlede vertel.\n- Wat het die vuur by haar laat gebeur?"
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
    "question": "Pas elke persoon by wat hy of sy in die roman doen.",
    "metadata": [
      "A - Ryna",
      "B - Attie",
      "C - Jacob",
      "1 - het in Windhoek gaan werk",
      "2 - het Meeuland toe gevlug",
      "3 - het 'n boek oor kusvoëls geskryf"
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
    "unit": "roman",
    "topic": "karakter_en_verhoudings",
    "subtopic": "wie_doen_wat",
    "skills": [
      "afrikaans_fal_pas_gebeure_by_persone"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan wie skryf, wie werk en wie vlug.\n- Begin met die een wat jy die seker is van."
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
    "question": "Ryna wil nie oor haar verlede praat nie. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
    "metadata": [
      "Almal praat graag onmiddellik oor hulle seerste ervarings.",
      "Jy kan nooit iemand verstaan wat 'n trauma beleef het nie.",
      "Mense wat vroeër seergekry het, voel nooit weer bang nie.",
      "Mense wat 'n trauma beleef het, wil dit dikwels nie weer oproep nie.",
      ""
    ],
    "answer": [
      "Mense wat 'n trauma beleef het, wil dit dikwels nie weer oproep nie.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "roman",
    "topic": "karakter_en_verhoudings",
    "subtopic": "identifiseer_met_karakter",
    "skills": [
      "afrikaans_fal_identifiseer_met_karakter"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan hoe mense na 'n baie seer ervaring voel.\n- 'n Goeie motivering gee 'n rede."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1",
      "marks": 4,
      "clues": "- Lees die paragraaf en dink aan Ryna se nuwe lewe.",
      "approach": "- Soek elke woord in die roman",
      "solution": "3.1.1: Kaapstad.\n3.1.2: Februarie.\n3.1.3: Mama-Meeu.\n3.1.4: trommeltjie."
    },
    {
      "number": "3.2",
      "marks": 1,
      "clues": "- Hoe praat Jacob met Ryna na die vuur?",
      "approach": "- Toets elke opsie by Jacob se woorde",
      "solution": "1. C (rustig)."
    },
    {
      "number": "3.3.1",
      "marks": 1,
      "clues": "- Hoekom is Ryna in konflik met haarself?",
      "approach": "- Kies die opsie tussen hakies",
      "solution": "1. die vuur het haar aan dinge laat dink wat sy liewer wou vergeet."
    },
    {
      "number": "3.3.2",
      "marks": 1,
      "clues": "- Wat het die vuur by haar opgeroep?",
      "approach": "- Motiveer jou antwoord op 3.3.1",
      "solution": "1. Die vuur het die trauma oor Vincent en Ronnie se dood laat terugkom en die wonde van die verlede oopgemaak."
    },
    {
      "number": "3.4",
      "marks": 1,
      "clues": "- Hoe goed ken Attie vir Ryna?",
      "approach": "- Gee een rede",
      "solution": "1. Jacob het gedink Ryna het alles met Attie gedeel en Attie was haar vertroueling."
    },
    {
      "number": "3.5",
      "marks": 1,
      "clues": "- Wat het Ryna die aand voor die brand vir Jacob en Janka gedoen?",
      "approach": "- Soek wat sy gemaak het",
      "solution": "1. Hulle het by Ryna gaan eet; sy het smoorsnoek gemaak."
    },
    {
      "number": "3.6",
      "marks": 1,
      "clues": "- Wat het met Ryna gebeur na die dood van Vincent en Ronnie?",
      "approach": "- Soek die direkte gevolg",
      "solution": "1. Ryna is vir trauma-behandeling in 'n kliniek opgeneem."
    },
    {
      "number": "3.7",
      "marks": 4,
      "clues": "- Pas elke gebeurtenis by die gevolg.",
      "approach": "- Dink aan wat uit elke gebeurtenis gevolg het",
      "solution": "3.7.1: D.\n3.7.2: A.\n3.7.3: B.\n3.7.4: E."
    },
    {
      "number": "3.8",
      "marks": 1,
      "clues": "- Hoe tree Jacob hier teenoor Ryna op?",
      "approach": "- Verduidelik hoekom dit jou goed laat voel",
      "solution": "1. Jacob het gewys dat hy simpatie het en gehelp het toe Ryna hom nodig gehad het."
    },
    {
      "number": "3.9",
      "marks": 1,
      "clues": "- Let op wat Ryna se liggaam en stem doen.",
      "approach": "- Soek een aanduiding van haar skok",
      "solution": "1. Haar liggaam het geruk, sy het op 'n klein hopie gaan sit en haar stem was doods."
    },
    {
      "number": "3.10",
      "marks": 2,
      "clues": "- Dink aan wat die huis vir Ryna beteken het.",
      "approach": "- Soek twee positiewe voorbeelde",
      "solution": "1. Ryna kon haar eie plekkie inrig soos sy wou.\n2. Sy kon 'n tuiste vir Janka skep of uiteindelik met Jacob oor haar verlede praat."
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
