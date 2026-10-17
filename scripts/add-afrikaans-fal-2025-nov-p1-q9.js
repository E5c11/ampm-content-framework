#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P1 — November 2025 — Vraag 5.2: Prent — Teks G
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P1: homonym (mirror 5.2.1)
 *   Q2: P1: diminutive (mirror 5.2.3)
 *   Q3: P1: intensive form (mirror 5.2.4)
 *   Q4: P1: correct Afrikaans (mirror 5.2.5)
 *   Q5: P1: negation (mirror 5.2.6)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p1-q9.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q9.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q9.js
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
  "name": "Vraag 5.2: Prent",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p1",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "grammar",
    "homophones",
    "language"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q9/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q9/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q9/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks G",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q9/annexure_teks_g_1.png"
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
    "context_text": null,
    "question": "In watter sin het \"blad\" 'n ANDER betekenis as in: Die blad het van die boom geval?",
    "metadata": [
      "Die groen blad het in die wind gewaai.",
      "Die blad van die plant is groen.",
      "Die kind het 'n blad aan die tak gesien.",
      "Skryf op 'n skoon blad papier.",
      ""
    ],
    "answer": [
      "Skryf op 'n skoon blad papier.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "woordeskat",
    "topic": "betekenisleer",
    "subtopic": "homonieme",
    "skills": [
      "afrikaans_fal_gebruik_homoniem_in_sin"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- Een betekenis is die deel van 'n plant.\n- Soek die sin waar \"blad\" iets anders is."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 2",
    "order": 2,
    "context_text": "Daar is 'n (hond) langs die pad.",
    "question": "Gee die VERKLEINWOORD van die woord tussen hakies.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "hondjie",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "sinstrukture",
    "topic": "selfstandige_naamwoorde",
    "subtopic": "verkleinwoord",
    "skills": [
      "afrikaans_fal_vorm_verkleinwoord"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- Die verkleinwoord kry die agtervoegsel -jie.\n- Let op die lettergroep voor die agtervoegsel.",
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
    "context_text": "Die water in die dam is (koud).",
    "question": "Gee die INTENSIEWE VORM van die woord tussen hakies.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "yskoud|bitterkoud|vrieskoud",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "sinstrukture",
    "topic": "byvoeglike_naamwoorde",
    "subtopic": "intensiewe_vorm",
    "skills": [
      "afrikaans_fal_vorm_intensiewe_vorm"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- 'n Intensiewe vorm is een woord wat die betekenis versterk.\n- Plak 'n versterkende woord voor die byvoeglike naamwoord.",
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
    "context_text": "Die kinders eet graag (cookies).",
    "question": "Gee die KORREKTE AFRIKAANS vir die woord tussen hakies.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "koekies",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "woordeskat",
    "topic": "betekenisleer",
    "subtopic": "regte_afrikaanse_woord",
    "skills": [
      "afrikaans_fal_gee_korrekte_afrikaans"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- Skryf die Afrikaanse woord, nie die Engelse een nie.\n- Dink aan wat jy by 'n teepartytjie eet.",
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
    "question": "Kies TWEE korrekte ONTKENNINGS van die sin: Almal hou van sjokolade.",
    "metadata": [
      "Niemand hou van sjokolade nie.",
      "Almal hou van sjokolade nie.",
      "Nie almal hou van sjokolade nie.",
      "Niemand hou van sjokolade.",
      ""
    ],
    "answer": [
      "Niemand hou van sjokolade nie.",
      "Nie almal hou van sjokolade nie.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "sinstrukture",
    "topic": "ontkenning",
    "subtopic": "dubbele_ontkenning",
    "skills": [
      "afrikaans_fal_kies_korrekte_ontkenning"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "clues": "- Afrikaans gebruik gewoonlik twee \"nie\"s in 'n ontkenning.\n- Maak seker dat elke sin 'n ontkenning én 'n slot-\"nie\" het."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.2.1",
      "marks": 1,
      "clues": "- \"Vlieg\" kan 'n insek of 'n werkwoord wees.",
      "approach": "- Dink aan 'n ander betekenis van die woord\n- Skryf 'n sin wat die betekenis duidelik maak",
      "solution": "1. Daar sit 'n vlieg op die tafel.\n2. Of: Hy vlieg by die deur uit (enige sin met 'n ander betekenis)."
    },
    {
      "number": "5.2.2",
      "marks": 1,
      "clues": "- Wat doen mens met 'n foto: vat of neem?",
      "approach": "- Dink aan die korrekte werkwoord by \"foto\"\n- Kies een",
      "solution": "1. neem."
    },
    {
      "number": "5.2.3",
      "marks": 1,
      "clues": "- Voeg 'n agtervoegsel by wat \"klein\" aandui.",
      "approach": "- Vorm die verkleinwoord\n- Let op die spelling",
      "solution": "1. blommetjie."
    },
    {
      "number": "5.2.4",
      "marks": 1,
      "clues": "- Plak 'n versterkende deel voor \"nat\".",
      "approach": "- Dink aan wat nog natter as nat is\n- Skryf een woord",
      "solution": "1. papnat, sopnat, waternat, druipnat of deurnat (enige een)."
    },
    {
      "number": "5.2.5",
      "marks": 1,
      "clues": "- Dink aan die Afrikaanse woord vir 'n boodskap.",
      "approach": "- Vervang die Engelse woord met Afrikaans",
      "solution": "1. boodskap."
    },
    {
      "number": "5.2.6",
      "marks": 1,
      "clues": "- Gebruik \"nie ... nie\" of \"niemand\".",
      "approach": "- Maak die sin ontkennend\n- Maak seker die slot-\"nie\" is daar",
      "solution": "1. Niemand is bang vir die haai nie.\n2. Of: Nie almal is bang vir die haai nie."
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
