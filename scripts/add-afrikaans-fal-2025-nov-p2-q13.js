#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 7.1–7.10: Fiela se Kind — Die Drama — Teks M
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks M (mister Kapp)
 *   Q2: P: Teks M l.7-8
 *   Q3: P: Teks M l.19
 *   Q4: P: Teks M
 *   Q5: L: identify (mirror 7.7)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q13.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q13.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q13.js
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
  "name": "Vraag 7: Fiela se Kind – Die Drama (7.1–7.10)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 13,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "dramatic_techniques",
    "character_analysis",
    "contextual_questions"
  ],
  "text_key": "fiela_se_kind_die_drama",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q13/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q13/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q13/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q13/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q13/memo_3.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks M",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q13/annexure_teks_m_1.png"
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
    "text_key": "fiela_se_kind_die_drama",
    "order": 1,
    "context_text": null,
    "question": "Watter man het namens die magistraat by Elias-hulle gekom? Skryf net die van.",
    "metadata": [
      "Van:",
      "[ ]"
    ],
    "answer": [
      "Kapp",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "drama",
    "topic": "intrige_en_gebeure",
    "subtopic": "feit_uit_die_drama",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Elias noem hom \"mister\".\n- Skryf een woord.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "fiela_se_kind_die_drama",
    "order": 2,
    "context_text": null,
    "question": "Watter woord beskryf Elias se toon in: \"Weet nie wanneer hulle weer huis kry nie. Hang af\"?",
    "metadata": [
      "opgewonde",
      "hartseer",
      "dankbaar",
      "ontwykend",
      ""
    ],
    "answer": [
      "ontwykend",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "toon_en_stylmiddele",
    "subtopic": "toon_van_'n_aanhaling",
    "skills": [
      "afrikaans_fal_bepaal_toon"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Kapp vra waar die kinders is, maar Elias gee nie 'n reguit antwoord nie.\n- Hy praat om die vraag te omseil."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "fiela_se_kind_die_drama",
    "order": 3,
    "context_text": null,
    "question": "Waarom ervaar Barta innerlike konflik terwyl Elias met Kapp praat?",
    "metadata": [
      "Sy wil Kapp vertel waar die kinders is, maar Elias stop haar.",
      "Sy is bly dat Kapp gekom het en wil langer gesels.",
      "Sy weet Elias lieg, maar is bang om iets te sê.",
      "Sy glo alles wat Elias vir Kapp sê.",
      ""
    ],
    "answer": [
      "Sy weet Elias lieg, maar is bang om iets te sê.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "karakter_en_verhoudings",
    "subtopic": "innerlike_konflik",
    "skills": [
      "afrikaans_fal_verklaar_innerlike_konflik"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Barta se laaste sin is onvoltooid.\n- Watter twee dinge wil sy tegelyk doen?"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "fiela_se_kind_die_drama",
    "order": 4,
    "context_text": null,
    "question": "Pas elke persoon by wat hy of sy in die uittreksel sê of doen.",
    "metadata": [
      "A - Elias",
      "B - Kapp",
      "C - Barta",
      "1 - bring 'n boodskap van die magistraat",
      "2 - sê as Lukas vandag hier was, was jy in die moeilikheid",
      "3 - vra Kapp om vir die meisiekind kinderwagterwerk te soek"
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
    "unit": "drama",
    "topic": "karakter_en_verhoudings",
    "subtopic": "wie_doen_wat",
    "skills": [
      "afrikaans_fal_pas_gebeure_by_persone"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan wie die magistraat se boodskap bring.\n- Begin met die een wat jy die mees seker is van."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "fiela_se_kind_die_drama",
    "order": 5,
    "context_text": null,
    "question": "Barta bly stil terwyl Elias lieg. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
    "metadata": [
      "Mense hoef nooit bang te wees om die waarheid te praat nie.",
      "'n Leuen is altyd makliker om reg te stel as die waarheid.",
      "Mense wat swyg, verstaan nooit wat aangaan nie.",
      "Mense kan bang wees om 'n leuen teenoor ander reg te stel.",
      ""
    ],
    "answer": [
      "Mense kan bang wees om 'n leuen teenoor ander reg te stel.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "karakter_en_verhoudings",
    "subtopic": "identifiseer_met_karakter",
    "skills": [
      "afrikaans_fal_identifiseer_met_karakter"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan 'n keer toe jy bang was om iets te sê.\n- Gee 'n rede."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "7.1",
      "marks": 4,
      "clues": "- Lees die paragraaf en dink aan Benjamin se tyd by Fiela.",
      "approach": "- Soek elke woord in die drama",
      "solution": "7.1.1: nege (9).\n7.1.2: geskop.\n7.1.3: Gertjie.\n7.1.4: bottels (soetoliebottel)."
    },
    {
      "number": "7.2",
      "marks": 1,
      "clues": "- Wat het Barta geweet?",
      "approach": "- Soek een rede",
      "solution": "1. Barta het geweet Lukas was nie hulle kind nie en was bang vir moeilikheid met die gereg."
    },
    {
      "number": "7.3",
      "marks": 1,
      "clues": "- Let op hoe Elias praat.",
      "approach": "- Toets elke opsie by Elias se woorde",
      "solution": "1. B (aggressief)."
    },
    {
      "number": "7.4.1",
      "marks": 1,
      "clues": "- Wie kan moeilikheid kom maak?",
      "approach": "- Soek na wie \"sy\" verwys",
      "solution": "1. Na Fiela (Komoetie)."
    },
    {
      "number": "7.4.2",
      "marks": 1,
      "clues": "- Wat het die magistraat gesê?",
      "approach": "- Verduidelik die aanhaling",
      "solution": "1. Die Van Rooyens moes die magistraat laat weet as Fiela hier moeilikheid kom maak."
    },
    {
      "number": "7.5.1",
      "marks": 1,
      "clues": "- Let op die woord \"nes\".",
      "approach": "- Kies die stylfiguur",
      "solution": "1. vergelyking."
    },
    {
      "number": "7.5.2",
      "marks": 1,
      "clues": "- Hoe is Nina in die Bos?",
      "approach": "- Verduidelik die vetgedrukte woorde",
      "solution": "1. Nina was baie lief vir die Bos en rats daarin."
    },
    {
      "number": "7.6",
      "marks": 1,
      "clues": "- Watter werk het Nina later gekry?",
      "approach": "- Gee 'n feit wat die stelling bevestig",
      "solution": "1. Nina het die skoolmeester se kinders gaan oppas."
    },
    {
      "number": "7.7",
      "marks": 1,
      "clues": "- Hoekom swyg Barta?",
      "approach": "- Verduidelik waarom jy kan identifiseer",
      "solution": "1. Barta was bang vir Elias en bang dat sy uitgevang sou word omdat sy in die hof gelieg het."
    },
    {
      "number": "7.8",
      "marks": 1,
      "clues": "- Wat het by Elias-hulle gebeur voordat Lukas en Nina terugkom?",
      "approach": "- Soek een gebeurtenis",
      "solution": "1. Fiela was by die Van Rooyens om Benjamin se goed te bring en Elias het haar weggejaag."
    },
    {
      "number": "7.9",
      "marks": 1,
      "clues": "- Hoe praat en optree Elias?",
      "approach": "- Gee een rede",
      "solution": "1. Elias het gelieg en was dreigend en aggressief teenoor Kapp en Fiela."
    },
    {
      "number": "7.10",
      "marks": 4,
      "clues": "- Pas elke gebeurtenis by die gevolg.",
      "approach": "- Dink aan wat uit elke gebeurtenis gevolg het",
      "solution": "7.10.1: E.\n7.10.2: D.\n7.10.3: A.\n7.10.4: B."
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
