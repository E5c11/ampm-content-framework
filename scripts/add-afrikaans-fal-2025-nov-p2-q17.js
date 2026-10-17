#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 8.2.1–8.2.5: Opdrag — Teks P
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks P
 *   Q2: P: Teks P l.5
 *   Q3: P: Teks P l.8
 *   Q4: P: Teks P l.3-6
 *   Q5: P: Teks P l.14-16
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q17.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q17.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q17.js
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
  "name": "Vraag 8.2: Opdrag (8.2.1–8.2.5)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "narrative_structure",
    "character_analysis",
    "theme_identification"
  ],
  "text_key": "opdrag",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q17/question_v2_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q17/memo_v2_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q17/memo_v2_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks P",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q17/annexure_teks_p_v2_1.png"
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
    "text_key": "opdrag",
    "order": 1,
    "context_text": null,
    "question": "Rangskik die dele in die volgorde waarin hulle in die uittreksel voorkom.",
    "metadata": [
      "Sy skryf 'n aanbeveling vir die boek.",
      "Sy noem dat haar ouma op sestien getroud is.",
      "Sarah skryf dat sy sewentien is.",
      "Sy sê sy is bang vir die seer van \"ghoebaai\".",
      ""
    ],
    "answer": [
      "Sarah skryf dat sy sewentien is.",
      "Sy noem dat haar ouma op sestien getroud is.",
      "Sy sê sy is bang vir die seer van \"ghoebaai\".",
      "Sy skryf 'n aanbeveling vir die boek.",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "kortverhale",
    "topic": "intrige_en_gebeure",
    "subtopic": "volgorde_in_die_uittreksel",
    "skills": [
      "afrikaans_fal_rangskik_gebeure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Volg Sarah se brief van bo na onder.\n- Die aanbeveling kom aan die einde."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "opdrag",
    "order": 2,
    "context_text": null,
    "question": "Hoeveel kinders het Sarah se ouma later gehad? Skryf die getal in woorde.",
    "metadata": [
      "Getal:",
      "[ ]"
    ],
    "answer": [
      "agt",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "kortverhale",
    "topic": "intrige_en_gebeure",
    "subtopic": "feit_uit_die_teks",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Die getal staan in woorde in die uittreksel.\n- Skryf een woord.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "opdrag",
    "order": 3,
    "context_text": null,
    "question": "Wat beteken: \"Ek is bang dat jou en my paadjies anderdag nie meer sal saamloop nie\"?",
    "metadata": [
      "Sy is bang dat sy en Gerrie eendag uit mekaar sal groei.",
      "Sy is bang dat Gerrie haar vir iemand anders sal los.",
      "Sy is bang dat sy haar ouma se pad moet volg.",
      "Sy is bang dat die paaie na die skool te gevaarlik is.",
      ""
    ],
    "answer": [
      "Sy is bang dat sy en Gerrie eendag uit mekaar sal groei.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "kortverhale",
    "topic": "toon_en_stylmiddele",
    "subtopic": "betekenis_van_'n_aanhaling",
    "skills": [
      "afrikaans_fal_verklaar_betekenis_in_konteks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Paadjies is hier figuurlik bedoel.\n- Sarah skryf aan Gerrie."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "opdrag",
    "order": 4,
    "context_text": null,
    "question": "Watter stelling oor Sarah se ouma is ONWAAR?",
    "metadata": [
      "Sy was sestien toe sy getroud is.",
      "Sy het later agt kinders gehad.",
      "Sy het gaan leer.",
      "Haar oupa was haar eerste kêrel.",
      ""
    ],
    "answer": [
      "Sy het gaan leer.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "kortverhale",
    "topic": "intrige_en_gebeure",
    "subtopic": "onwaar_stelling",
    "skills": [
      "afrikaans_fal_onderskei_waar_van_onwaar"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Wat sê die uittreksel oor leer en studeer?\n- Toets elke stelling teen die uittreksel."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "opdrag",
    "order": 5,
    "context_text": null,
    "question": "Wat word in die uittreksel onder AANBEVELING gesê?",
    "metadata": [
      "Sarah beveel aan dat die boek uit die biblioteek verwyder word.",
      "Sarah beveel aan dat die boek nie in die skool gelees word nie.",
      "Sarah beveel aan dat Gerrie die boek vir haar skryf.",
      "Sarah beveel aan dat die boek vir voorligtingsklasse aangekoop word.",
      ""
    ],
    "answer": [
      "Sarah beveel aan dat die boek vir voorligtingsklasse aangekoop word.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "kortverhale",
    "topic": "tema_en_boodskap",
    "subtopic": "doel_van_die_aanbeveling",
    "skills": [
      "afrikaans_fal_verklaar_betekenis_in_konteks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Kyk wat Sarah onder die woord AANBEVELING skryf.\n- Dit gaan oor die biblioteek en voorligting."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "8.2.1",
      "marks": 4,
      "clues": "- Dink aan die volgorde van Sarah se gedagtes.",
      "approach": "- Rangskik die vier gebeure",
      "solution": "1. Jordaantjie het altyd gesorg vir iets wat anders is.\n2. Sarah het haar feite met E se situasie begin.\n3. Sarah het besef sy worstel eintlik met haar gevoelens vir Gerrie.\n4. Sarah het gehoop Jordaantjie sou tussen die reëls kon lees."
    },
    {
      "number": "8.2.2(a)",
      "marks": 1,
      "clues": "- Wat sê die ouma se verhaal oor vroue?",
      "approach": "- Kies die opsie tussen hakies",
      "solution": "1. gestereotipeer is om jonk te trou en kinders te hê."
    },
    {
      "number": "8.2.2(b)",
      "marks": 1,
      "clues": "- Hoe oud was Sarah se ouma toe sy getroud is?",
      "approach": "- Motiveer jou antwoord",
      "solution": "1. Vroeër is vroue op sestien getroud; as Ouma sestien was en Sarah is al sewentien, moes sy eintlik al getroud gewees het."
    },
    {
      "number": "8.2.3",
      "marks": 1,
      "clues": "- Wat sê die woorde oor verhoudings?",
      "approach": "- Toets elke opsie",
      "solution": "1. C (jy moet nie dinge doen wat 'n verhouding benadeel nie)."
    },
    {
      "number": "8.2.4",
      "marks": 1,
      "clues": "- Wat het Sarah reeds gedoen?",
      "approach": "- Gee 'n feit wat die stelling weerlê",
      "solution": "1. Sarah het tot 'n gevolgtrekking gekom en 'n aanbeveling gemaak."
    },
    {
      "number": "8.2.5(a)",
      "marks": 1,
      "clues": "- Waarna verwys P v W?",
      "approach": "- Soek die titel van die boek",
      "solution": "1. Na die boek 'n Pot vol winter, wat Sarah vir haar boekverslag gekies het."
    },
    {
      "number": "8.2.5(b)",
      "marks": 1,
      "clues": "- Wat het Sarah uit die boek geleer?",
      "approach": "- Gee een rede",
      "solution": "1. Sarah het haar eie idees gevorm en besluit dat dit nie deel van haar verhouding moet wees nie; sy het die boek vir voorligtingsklasse aanbeveel."
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
