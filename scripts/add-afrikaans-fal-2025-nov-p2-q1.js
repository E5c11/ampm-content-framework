#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 1.1–1.9: Kringe in 'n Bos — Teks A
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: X: Q1.11 (other half), fresh angle
 *   Q2: P: Teks A l.17-18 (stuurs)
 *   Q3: P: Teks A l.11-12
 *   Q4: P: Teks A + exam 1.1/1.2 facts
 *   Q5: L: identify with character (mirror 1.9)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q1.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q1.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q1.js
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
  "name": "Vraag 1: Kringe in 'n Bos (1.1–1.9)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 1,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q1/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q1/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q1/annexure_teks_a_1.png"
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
    "question": "Aan wie het Saul sy goud verkoop? Skryf net die van.",
    "metadata": [
      "Van:",
      "[ ]"
    ],
    "answer": [
      "Barkley",
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
    "clues": "- Dink aan wat Saul gedoen het nadat hy die goud uitgewas het.\n- Skryf een woord.",
    "keyboard_type": "text"
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
    "question": "Watter woord beskryf die toon van oom Wiljam se woorde: \"As jy kom spaai het of ek tande onder die hout het, kan jy maar omdraai!\"?",
    "metadata": [
      "vriendelik",
      "opgewonde",
      "onvriendelik",
      "bang",
      ""
    ],
    "answer": [
      "onvriendelik",
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
    "clues": "- Let op hoe die uittreksel sê dat hy dit gesê het.\n- Dink aan hoe 'n mens sou praat as jy iemand nie welkom wil laat voel nie."
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
    "question": "Waarom ervaar Saul innerlike konflik as hy dink: \"Maar die hoop het skielik soos vrees in hom gelê\"?",
    "metadata": [
      "Hy is kwaad vir Kate omdat sy weer 'n storie vir hom vertel het.",
      "Hy wil graag glo dat die goud bestaan, maar vrees wat dit aan die Bos sal doen.",
      "Hy wil dadelik vir sy pa gaan vertel dat hy goud gaan soek.",
      "Hy voel niks, want hy dink dit is net weer 'n bosstorie.",
      ""
    ],
    "answer": [
      "Hy wil graag glo dat die goud bestaan, maar vrees wat dit aan die Bos sal doen.",
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
    "clues": "- Innerlike konflik is 'n stryd tussen twee gevoelens in dieselfde mens.\n- Watter twee gevoelens bots hier?"
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
    "question": "Pas elke persoon by wat hy of sy in die roman doen.",
    "metadata": [
      "A - Kate",
      "B - Oom Wiljam",
      "C - Saul",
      "1 - bring die eerste hout van die week met sy wa",
      "2 - werk by MacDonald nadat hy en sy pa baklei het",
      "3 - vertel vir Saul die nuus oor die goud"
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
    "clues": "- Dink aan wie die nuus bring en wie die hout bring.\n- Begin met die een wat jy die seker is van."
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
    "question": "Saul bly onseker wanneer hy die gerugte oor goud hoor. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
    "metadata": [
      "Almal hou daarvan as hulle lewe skielik heeltemal verander.",
      "Jy hoef nooit oor groot nuus bekommerd of bang te wees nie.",
      "Nuus is altyd net 'n storie wat iemand sommer opmaak om te pla.",
      "Mense voel dikwels bang as nuus alles kan verander wat hulle ken.",
      ""
    ],
    "answer": [
      "Mense voel dikwels bang as nuus alles kan verander wat hulle ken.",
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
    "clues": "- Dink aan 'n keer toe slegte of groot nuus jou bang gemaak het.\n- 'n Goeie motivering gee 'n rede."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1",
      "marks": 4,
      "clues": "- Lees die paragraaf en dink aan die gebeure waaroor dit gaan.\n- Elke blanko vra een woord uit die roman.",
      "approach": "- Soek elke gebeurtenis in die roman\n- Skryf net die woord of woorde",
      "solution": "1.1.1: twee.\n1.1.2: Osborne.\n1.1.3: Knysna.\n1.1.4: apteek (apotheek)."
    },
    {
      "number": "1.2",
      "marks": 1,
      "clues": "- Dink aan Saul se verhouding met sy pa.",
      "approach": "- Soek een rede\n- Skryf dit in 'n volsin",
      "solution": "1. Saul en sy pa het baklei en Saul wou nie langer hout kap en 'n pad loop wat nêrens uitkom nie.\n2. MacDonald het vir hom werk, 'n blyplek en kos aangebied."
    },
    {
      "number": "1.3",
      "marks": 1,
      "clues": "- Wat weet Kate werklik van die Bos?",
      "approach": "- Dink aan hoe Kate die Bos beleef\n- Gee een rede",
      "solution": "1. Kate het die Bos nie regtig geken nie en het net stories gehoor of opgemaak wat vir haar mooi was."
    },
    {
      "number": "1.4.1",
      "marks": 1,
      "clues": "- Lees die aanhaling weer: waaroor is Saul bang?",
      "approach": "- Kies die opsie tussen hakies wat by die aanhaling pas",
      "solution": "1. oor wat dit aan die Bos sou doen."
    },
    {
      "number": "1.4.2",
      "marks": 1,
      "clues": "- Dink aan wat Saul se grootste bekommernis is.",
      "approach": "- Gee 'n rede wat by jou antwoord op 1.4.1 pas",
      "solution": "1. Saul wou die Bos altyd beskerm en was bang die gerugte oor goud sou mense lok wat olifante, bloubokkies en bome sou uitroei."
    },
    {
      "number": "1.5.1",
      "marks": 1,
      "clues": "- Wie wil in die uittreksel vinnig geld maak?",
      "approach": "- Let op wie met \"hulle\" bedoel word",
      "solution": "1. Almal wat goud wou uithaal of ryk wou word, soos die houtkappers."
    },
    {
      "number": "1.5.2",
      "marks": 1,
      "clues": "- Wat sal mense doen as daar geld te maak is?",
      "approach": "- Verduidelik die aanhaling in jou eie woorde",
      "solution": "1. Mense sal enigiets doen, selfs met kaal hande grawe, om geld te maak."
    },
    {
      "number": "1.6",
      "marks": 1,
      "clues": "- Kate klink onrustig in die reëls.",
      "approach": "- Toets elke opsie by Kate se woorde",
      "solution": "1. C (onseker)."
    },
    {
      "number": "1.7",
      "marks": 2,
      "clues": "- Dink aan wat Kate vir Saul beteken het.",
      "approach": "- Soek twee voordele\n- Skryf kort volsinne",
      "solution": "1. Saul kon op Kate verlief raak of Engels leer lees en praat.\n2. Hy kon Sondae iemand hê om mee te praat of by Kate boeke kry."
    },
    {
      "number": "1.8",
      "marks": 4,
      "clues": "- Pas elke gebeurtenis by die gevolg wat in die roman volg.",
      "approach": "- Dink aan wat in die roman gebeur het\n- Pas een vir een",
      "solution": "1.8.1: C (Kate is met die Venice na die Kaap gestuur).\n1.8.2: A (Saul kon leer hoe om meubels te maak).\n1.8.3: D (Saul kon die nuus oor Joram se dood kry).\n1.8.4: B (Saul het Kate na 'n lang tyd weer gesien)."
    },
    {
      "number": "1.9",
      "marks": 1,
      "clues": "- Dink aan 'n keer toe mense verkeerde dinge oor jou gesê het.",
      "approach": "- Gee 'n eie ervaring of gevoel\n- Verduidelik jou rede",
      "solution": "1. Byvoorbeeld: dit maak ook seer as mense onwaarhede van jou sê of jou onregverdig behandel."
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
