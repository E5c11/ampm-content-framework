#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P1 — November 2025 — Vraag 5.1.6–5.1.10: Artikel — Teks F
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P1: plural (mirror 5.1.6)
 *   Q2: P1: compound with linking sound (mirror 5.1.7)
 *   Q3: P1: word order (mirror 5.1.8)
 *   Q4: P1: preposition (mirror 5.1.9)
 *   Q5: P1: inflected form (mirror 5.1.10)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p1-q7.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q7.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q7.js
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
  "name": "Vraag 5.1: Artikel (5.1.6–5.1.10)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p1",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "grammar",
    "editing",
    "sentence_construction"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q7/question_v2_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q7/question_v2_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q7/memo_v2_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q7/memo_v2_2.png"
  ],
  "exam_question_marks": 5,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks F",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q7/annexure_teks_f_v2_1.png"
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
    "context_text": "Die winkel het gister baie (kliënt) gehad.",
    "question": "Gee die MEERVOUD van die woord tussen hakies.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "kliënte",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "sinstrukture",
    "topic": "selfstandige_naamwoorde",
    "subtopic": "meervoud",
    "skills": [
      "afrikaans_fal_vorm_meervoud"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- Die meervoud kry 'n -e-einde.\n- Onthou die tekens op die e wat die uitspraak aandui.",
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
    "context_text": "Ons vier Pa se (verjaar + dag) met 'n braai.",
    "question": "Gee die korrekte SAMESTELLING van die woorde tussen hakies.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "verjaarsdag",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "woordeskat",
    "topic": "woordvorming",
    "subtopic": "samestelling_met_verbindingsklank",
    "skills": [
      "afrikaans_fal_vorm_samestelling"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "clues": "- Plak die twee woorde aanmekaar tot een woord.\n- Dink aan die verbindingsklank wat tussen die twee dele hoort.",
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
    "context_text": "Hulle het gistermiddag stil in die biblioteek gewerk.",
    "question": "Rangskik die dele in die korrekte WOORDORDE (tyd, wyse, plek) om die sin te voltooi: Hulle het ... gewerk.",
    "metadata": [
      "stil",
      "in die biblioteek",
      "gistermiddag",
      "",
      ""
    ],
    "answer": [
      "gistermiddag",
      "stil",
      "in die biblioteek",
      "",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "sinstrukture",
    "topic": "woordorde",
    "subtopic": "tyd_wyse_plek",
    "skills": [
      "afrikaans_fal_rangskik_bepalings_in_woordorde"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "clues": "- Onthou die volgorde: eers WANNEER, dan HOE, dan WAAR.\n- Die werkwoord \"gewerk\" kom heel laaste."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 4",
    "order": 4,
    "context_text": "Sy is baie bang (...) die donker.",
    "question": "Vul die ontbrekende VOORSETSEL in.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "vir",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "sinstrukture",
    "topic": "woordorde",
    "subtopic": "voorsetsel_in_vaste_verbinding",
    "skills": [
      "afrikaans_fal_vul_voorsetsel_in"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- Dink aan die voorsetsel wat gewoonlik na \"bang\" kom.\n- Skryf een woord.",
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
    "question": "Watter sin gebruik die KORREKTE VORM van die woord \"moeilik\"?",
    "metadata": [
      "Dit is 'n moeilik vraag.",
      "Dit is 'n moeilike vraag.",
      "Dit is 'n moeilikke vraag.",
      "Dit is 'n moeilikes vraag.",
      ""
    ],
    "answer": [
      "Dit is 'n moeilike vraag.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "sinstrukture",
    "topic": "byvoeglike_naamwoorde",
    "subtopic": "verboe_vorm",
    "skills": [
      "afrikaans_fal_kies_korrekte_verboe_vorm"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "clues": "- 'n Byvoeglike naamwoord voor 'n selfstandige naamwoord kry gewoonlik 'n -e.\n- Let op hoeveel letters bygevoeg word."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.1.6",
      "marks": 1,
      "clues": "- Hoe maak jy meer as een skenking?",
      "approach": "- Voeg die meervoudsuitgang by",
      "solution": "1. skenkings."
    },
    {
      "number": "5.1.7",
      "marks": 1,
      "clues": "- Voeg die twee woorde saam en let op die verbindingsklank.",
      "approach": "- Plak aflewering en wa saam\n- Voeg die verbindingsklank by",
      "solution": "1. afleweringswa."
    },
    {
      "number": "5.1.8",
      "marks": 1,
      "clues": "- Onthou: tyd, wyse, plek.",
      "approach": "- Rangskik die bepalings\n- Skryf die hele sin",
      "solution": "1. Luhan het die kos vroeg die oggend vinnig op die perseel afgelaai."
    },
    {
      "number": "5.1.9",
      "marks": 1,
      "clues": "- Wat sê mens met \"trots\"?",
      "approach": "- Dink aan die vaste verbinding\n- Skryf een woord",
      "solution": "1. op."
    },
    {
      "number": "5.1.10",
      "marks": 1,
      "clues": "- Die woord staan voor \"maand\" en moet verbuig word.",
      "approach": "- Voeg die buigings-e by",
      "solution": "1. moeilike."
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
