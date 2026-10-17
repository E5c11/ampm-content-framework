#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 1.10–1.20: Kringe in 'n Bos — Teks B
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks B l.13 (device question, not the exam's line)
 *   Q2: P: Teks B l.8-9
 *   Q3: P: Teks B l.1-13
 *   Q4: P: Teks B
 *   Q5: P: Teks B
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q2.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q2.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q2.js
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
  "name": "Vraag 1: Kringe in 'n Bos (1.10–1.20)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "character_analysis",
    "contextual_questions",
    "literary_analysis"
  ],
  "text_key": "kringe_in_n_bos",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q2/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q2/memo_3.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q2/annexure_teks_b_1.png"
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
    "text_key": "kringe_in_n_bos",
    "order": 1,
    "context_text": null,
    "question": "Watter stylfiguur kom voor in: \"Die vuur het lui gebrand\"?",
    "metadata": [
      "vergelyking",
      "hiperbool",
      "personifikasie",
      "klanknabootsing",
      ""
    ],
    "answer": [
      "personifikasie",
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
    "clues": "- 'n Vuur kan nie werklik lui wees nie.\n- Wat word aan die vuur gegee wat net mense het?"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "kringe_in_n_bos",
    "order": 2,
    "context_text": null,
    "question": "Wat beteken: \"Dis net so goed jy skree vir die maan\"?",
    "metadata": [
      "Hy wil na die maan toe gaan en vir altyd daar gaan bly.",
      "Dit het geen nut om te probeer nie, want niemand sal luister nie.",
      "Hy moet die maan se baan deeglik bestudeer voordat hy kan skree.",
      "Dit is 'n baie goeie plan wat hy so gou moontlik moet uitvoer.",
      ""
    ],
    "answer": [
      "Dit het geen nut om te probeer nie, want niemand sal luister nie.",
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
    "exam_weight": 3,
    "clues": "- Dink aan wat die maan sal doen as jy op hom skree.\n- Die woorde is figuurlik bedoel."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "kringe_in_n_bos",
    "order": 3,
    "context_text": null,
    "question": "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.",
    "metadata": [
      "Hy wonder of hulle hom sal glo as hy die goud wys.",
      "Hy gooi hout op die kole.",
      "Hy dink aan die kinders en aan Izak.",
      "Hy sien sy kos is op.",
      ""
    ],
    "answer": [
      "Hy gooi hout op die kole.",
      "Hy sien sy kos is op.",
      "Hy wonder of hulle hom sal glo as hy die goud wys.",
      "Hy dink aan die kinders en aan Izak.",
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
    "clues": "- Volg die uittreksel reël vir reël.\n- Wat doen Saul met die vuur voordat hy begin dink?"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "kringe_in_n_bos",
    "order": 4,
    "context_text": null,
    "question": "Watter stelling oor die uittreksel is ONWAAR?",
    "metadata": [
      "Saul het onder 'n krans geskuil.",
      "Saul het aan die kinders en aan Izak gedink.",
      "Saul wou die vreemde delwers uit die Bos jaag.",
      "Saul se kos was nog nie op nie.",
      ""
    ],
    "answer": [
      "Saul se kos was nog nie op nie.",
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
    "clues": "- Toets elke stelling teen die uittreksel.\n- Net een stelling stem nie met die teks ooreen nie."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "kringe_in_n_bos",
    "order": 5,
    "context_text": null,
    "question": "Kies TWEE temas wat in die uittreksel na vore kom.",
    "metadata": [
      "Die beskerming van die Bos en die natuur",
      "Die voordele van moderne tegnologie",
      "Die swaarkry van die houtkappers",
      "Sportprestasies by die skool",
      ""
    ],
    "answer": [
      "Die beskerming van die Bos en die natuur",
      "Die swaarkry van die houtkappers",
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
    "clues": "- Waaroor dink Saul die meeste in die uittreksel?\n- Twee van die opsies kom in die uittreksel voor."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.10",
      "marks": 4,
      "clues": "- Dink aan die volgorde waarin Saul se ervarings in die roman plaasvind.",
      "approach": "- Rangskik die vier gebeure\n- Gee elkeen op sy regte plek",
      "solution": "1. Saul se ma en suster is oorlede aan die godsiekte.\n2. Saul het Oupoot vir die eerste keer gesien.\n3. Saul het ontdek dat die bloubokkie se gal nie in sy kop sit nie.\n4. Saul het besef dat die dorp nie in die Bos is nie."
    },
    {
      "number": "1.11",
      "marks": 1,
      "clues": "- Aan wie het Saul sy goud verkoop?",
      "approach": "- Gee 'n feit uit die roman wat die stelling weerlê",
      "solution": "1. Saul het sy goud aan Barkley verkoop; hy sou nooit besigheid met MacDonald doen nie."
    },
    {
      "number": "1.12",
      "marks": 1,
      "clues": "- Dink aan wat Saul by die rivier gesien het.",
      "approach": "- Soek wat hy die oggend gesien het",
      "solution": "1. Hy het drie delwers gesien, van wie twee gedelf het terwyl een wag gehou het."
    },
    {
      "number": "1.13",
      "marks": 1,
      "clues": "- Waarom moet die Bos \"sy wonde gesond kry\"?",
      "approach": "- Toets elke opsie\n- Kies die een wat by die konteks pas",
      "solution": "1. B (die Bos is vernietig en moes kans kry om te herstel)."
    },
    {
      "number": "1.14.1",
      "marks": 1,
      "clues": "- Waarom dink Saul dat die Engelse reg kan wees?",
      "approach": "- Kies die opsie tussen hakies wat by die aanhaling pas",
      "solution": "1. die Bosmense gestereotipeer het omdat die meeste nie kon lees en skryf nie."
    },
    {
      "number": "1.14.2",
      "marks": 1,
      "clues": "- Wat was die verskil tussen die Engelse en die Bosmense?",
      "approach": "- Gee een rede wat binne die roman geloofwaardig is",
      "solution": "1. Die meeste Engelse kon lees en skryf, daar was klasseverskille en die houtkopers het die Bosmense verneuk."
    },
    {
      "number": "1.15.1",
      "marks": 1,
      "clues": "- Let op die woord \"soos\".",
      "approach": "- Kies tussen vergelyking en metafoor",
      "solution": "1. vergelyking."
    },
    {
      "number": "1.15.2",
      "marks": 1,
      "clues": "- Wat beteken die vetgedrukte woorde?",
      "approach": "- Verduidelik in jou eie woorde",
      "solution": "1. Swaarkry was so deel van hulle lewe soos asemhaal; hulle het gedink dit is normaal."
    },
    {
      "number": "1.16",
      "marks": 1,
      "clues": "- Dink aan hoe Saul oor sy familie voel.",
      "approach": "- Gee 'n rede waarom jy goed voel",
      "solution": "1. Saul het nie van sy familie vergeet nie en was steeds bekommerd oor Jozef se kinders."
    },
    {
      "number": "1.17",
      "marks": 1,
      "clues": "- Wat het Saul se besluit om goud te delf vir hom moontlik gemaak?",
      "approach": "- Soek die direkte gevolg",
      "solution": "1. Saul het geld gehad om sy familie te help en kon eiendom bekostig."
    },
    {
      "number": "1.18",
      "marks": 2,
      "clues": "- Dink aan wat Kate gedoen het omdat sy self besluit het wat reg is.",
      "approach": "- Soek twee positiewe gevolge vir Kate",
      "solution": "1. Kate kon 'n bydrae maak tot die opvoeding van arm kinders.\n2. Sy kon teen haar pa se geldmag opstaan of die skewe sirkel verbreek."
    },
    {
      "number": "1.19",
      "marks": 1,
      "clues": "- Let op die vrae wat Saul vra.",
      "approach": "- Verduidelik hoe die skrywer jou bekommerd laat voel",
      "solution": "1. Saul vra baie retoriese vrae en klink wrewelrig oor die houtkappers."
    },
    {
      "number": "1.20",
      "marks": 1,
      "clues": "- Wat gebeur met die skewe sirkel aan die einde?",
      "approach": "- Verduidelik hoekom die tema pas",
      "solution": "1. Saul het bewys dat jy die skewe sirkel kan verbreek en sy vergifnis het dit vir sy familie gebreek."
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
