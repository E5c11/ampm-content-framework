#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 4.1–4.10: Lien se Lankstaanskoene — Teks G
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks G l.14-16
 *   Q2: P: Teks G l.5-6
 *   Q3: P: Teks G l.1-2
 *   Q4: P: Teks G
 *   Q5: L: identify (mirror 4.5)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q7.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q7.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q7.js
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
  "name": "Vraag 4: Lien se Lankstaanskoene (4.1–4.10)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "character_analysis",
    "contextual_questions",
    "literary_analysis"
  ],
  "text_key": "lien_se_lankstaanskoene",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q7/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q7/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q7/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q7/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q7/memo_3.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks G",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q7/annexure_teks_g_1.png"
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
    "text_key": "lien_se_lankstaanskoene",
    "order": 1,
    "context_text": null,
    "question": "Watter rol speel Lien in die skooltoneelstuk? Skryf die naam van die rol.",
    "metadata": [
      "Naam:",
      "[ ]"
    ],
    "answer": [
      "Weird Maria",
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
    "clues": "- Die naam kom in die uittreksel voor.\n- Dit bestaan uit twee woorde.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "lien_se_lankstaanskoene",
    "order": 2,
    "context_text": null,
    "question": "Watter woord beskryf Lien se gevoel in: \"Wat sou hulle sonder tannie Bets gedoen het?\"?",
    "metadata": [
      "bitter",
      "dankbaar",
      "spottend",
      "verveeld",
      ""
    ],
    "answer": [
      "dankbaar",
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
    "clues": "- Let op wat Lien in die glasbak sien.\n- Sy sê dit met 'n warm gevoel."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "lien_se_lankstaanskoene",
    "order": 3,
    "context_text": null,
    "question": "Waarom ervaar Lien innerlike konflik as sy saam met Miemie ry (reël 1 en 2)?",
    "metadata": [
      "Sy is baie bang vir Miemie en wil nooit weer by haar saamry nie.",
      "Sy wil dadelik by Miemie en haar familie gaan woon.",
      "Sy voel ongemaklik by Miemie, maar is dankbaar vir die rit huis toe.",
      "Sy is kwaad dat Miemie elke dag vir haar by die skool wag.",
      ""
    ],
    "answer": [
      "Sy voel ongemaklik by Miemie, maar is dankbaar vir die rit huis toe.",
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
    "clues": "- Die uittreksel sê sy ry \"gewoonlik ongemaklik, maar dikwels dankbaar\".\n- Watter twee gevoelens bots hier?"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "lien_se_lankstaanskoene",
    "order": 4,
    "context_text": null,
    "question": "Pas elke persoon by wat hy of sy in die uittreksel doen.",
    "metadata": [
      "A - Lien",
      "B - Tannie Bets",
      "C - Juffrou Breytenbach",
      "1 - sorg dat daar kos in die kombuis is",
      "2 - wil hê hulle moet Saterdae ook repeteer",
      "3 - speel Weird Maria in die toneelstuk"
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
    "clues": "- Dink aan wie die toneelstuk reël en wie vetkoeke gebring het.\n- Begin met die een wat jy die seker is van."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "lien_se_lankstaanskoene",
    "order": 5,
    "context_text": null,
    "question": "Lien tel haar geld en voel dis haar beste middag nog. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
    "metadata": [
      "Mense is trots as hulle hard werk en 'n doel bereik.",
      "Mense is trots as iemand anders hulle werk doen.",
      "Trots beteken jy hoef nie meer te werk nie.",
      "Geld maak mense altyd ongelukkig.",
      ""
    ],
    "answer": [
      "Mense is trots as hulle hard werk en 'n doel bereik.",
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
    "clues": "- Dink aan 'n keer toe jy iets bereik het waarvoor jy hard gewerk het.\n- Gee 'n rede."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1",
      "marks": 4,
      "clues": "- Lees die paragraaf en dink aan Lien se besige dae.",
      "approach": "- Soek elke woord in die roman",
      "solution": "4.1.1: twaalf.\n4.1.2: (straat)hoek.\n4.1.3: toneelopvoering (skoolkonsert).\n4.1.4: Miemie (Spies)."
    },
    {
      "number": "4.2",
      "marks": 1,
      "clues": "- Wat het by die pawiljoen gebeur?",
      "approach": "- Soek een gebeurtenis",
      "solution": "1. Lien het met Hein gesels of geluister hoe hy mondfluitjie speel."
    },
    {
      "number": "4.3.1",
      "marks": 1,
      "clues": "- Is die berg vetkoeke letterlik 'n berg?",
      "approach": "- Kies die stylfiguur",
      "solution": "1. hiperbool."
    },
    {
      "number": "4.3.2",
      "marks": 1,
      "clues": "- Wat wil die woorde sê oor die hoeveelheid vetkoeke?",
      "approach": "- Verduidelik die vetgedrukte woorde",
      "solution": "1. Daar was baie vetkoeke, genoeg vir Lien-hulle om te eet."
    },
    {
      "number": "4.4",
      "marks": 1,
      "clues": "- Waarvoor spaar Lien haar geld?",
      "approach": "- Soek een rede",
      "solution": "1. Lien wou oorsee gaan of 'n vliegtuigkaartjie koop."
    },
    {
      "number": "4.5",
      "marks": 1,
      "clues": "- Hoe voel Lien oor haar ma se toe deur?",
      "approach": "- Verduidelik waarom jy kan identifiseer",
      "solution": "1. Dis nie lekker om 'n ma te sien as sy dronk is nie en 'n mens wil soms rus."
    },
    {
      "number": "4.6",
      "marks": 1,
      "clues": "- Wat beteken \"kop uittrek\"?",
      "approach": "- Toets elke opsie",
      "solution": "1. A (soms wil sy nie langer deel van die toneel wees nie)."
    },
    {
      "number": "4.7",
      "marks": 1,
      "clues": "- Wat het tannie Bets vir Lien gedoen?",
      "approach": "- Gee 'n rede waarom jy goed voel",
      "solution": "1. Lien was nog 'n kind en tannie Bets het gesorg dat daar kos is en 'n ogie oor haar gehou."
    },
    {
      "number": "4.8",
      "marks": 2,
      "clues": "- Dink aan wat die toneelstuk vir Lien beteken het.",
      "approach": "- Soek twee positiewe voorbeelde",
      "solution": "1. Lien het Miemie en Hein beter leer ken.\n2. Sy kon haar ware talent uitleef en haar omstandighede vir 'n rukkie vergeet."
    },
    {
      "number": "4.9",
      "marks": 1,
      "clues": "- Hoe lyk die woonstel as Lien daar aankom?",
      "approach": "- Soek een aanduiding van eensaamheid",
      "solution": "1. Die woonstel is donker, Braam slaap al en sy eet alleen."
    },
    {
      "number": "4.10",
      "marks": 4,
      "clues": "- Pas elke gebeurtenis by die gevolg.",
      "approach": "- Dink aan wat daaruit gevolg het",
      "solution": "4.10.1: E.\n4.10.2: C.\n4.10.3: A.\n4.10.4: B."
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
