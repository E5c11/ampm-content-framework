#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P3 — November 2025 — Vraag 3.1: Uitnodigingskaartjie
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: M: memo 3.1 Inhoud
 *   Q2: P: paper Vraag 3 (80–100)
 *   Q3: M: memo 3.1 Taal en styl
 *   Q4: M: memo 3.1 Formaat
 *   Q5: M: memo 3.1 Formaat
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p3-q7.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q7.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q7.js
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
  "name": "Vraag 3.1: Uitnodigingskaartjie",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "transactional_writing",
    "language_register"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q7/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q7/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q7/memo_2.png"
  ],
  "exam_question_marks": 20,
  "supplementary_materials": null
};

// ─── Practice questions ──────────────────────────────────────────────────────

const questions = [
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Vraag 1",
    "order": 1,
    "context_text": null,
    "question": "Kies TWEE dinge wat op 'n uitnodigingskaartjie moet staan.",
    "metadata": [
      "Wanneer en waar die partytjie gehou word",
      "Die gasheer se laaste skoolrapport en punte",
      "Hoe gaste moet laat weet of hulle kom",
      "Lang paragrawe oor sy kinderjare",
      ""
    ],
    "answer": [
      "Wanneer en waar die partytjie gehou word",
      "Hoe gaste moet laat weet of hulle kom",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "uitnodiging",
    "subtopic": "inhoud_van_die_uitnodiging",
    "skills": [
      "afrikaans_fal_identifiseer_kenmerke_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Gaste moet weet wanneer en waar.\n- Hulle moet kan antwoord."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Vraag 2",
    "order": 2,
    "context_text": null,
    "question": "'n Kort transaksionele teks behoort tussen ... en 100 woorde te hê. Skryf die ondergrens as 'n getal.",
    "metadata": [
      "Getal:",
      "[ ]"
    ],
    "answer": [
      "80",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transaksionele_tekste",
    "topic": "uitnodiging",
    "subtopic": "woordelengte",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Die vraestel noem twee getalle vir Afdeling C.\n- Skryf die kleinste.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Vraag 3",
    "order": 3,
    "context_text": null,
    "question": "Watter toon pas by 'n uitnodigingskaartjie?",
    "metadata": [
      "streng en baie bevelend",
      "skerp en sarkasties",
      "kwaad en ongeduldig",
      "uitnodigend en vriendelik",
      ""
    ],
    "answer": [
      "uitnodigend en vriendelik",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "uitnodiging",
    "subtopic": "toon_van_die_uitnodiging",
    "skills": [
      "afrikaans_fal_kies_gepaste_register"
    ],
    "difficulty": 1,
    "exam_weight": 3,
    "clues": "- Jy nooi jou maats na jou partytjie.\n- Die toon spreek die leser direk aan."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Vraag 4",
    "order": 4,
    "context_text": null,
    "question": "Watter stelling oor die formaat van 'n uitnodigingskaartjie is korrek?",
    "metadata": [
      "Die inligting word in lang, omslagtige paragrawe geskryf.",
      "Net een lettertipe en een lettergrootte word gebruik.",
      "Die belangrikste inligting trek dadelik die leser se aandag.",
      "Die kaartjie het nie inligting oor die tyd nie.",
      ""
    ],
    "answer": [
      "Die belangrikste inligting trek dadelik die leser se aandag.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "uitnodiging",
    "subtopic": "formaat_van_die_uitnodiging",
    "skills": [
      "afrikaans_fal_identifiseer_kenmerke_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die kaartjie moet leservriendelik wees.\n- Dink aan lettertipes en lettergroottes."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Vraag 5",
    "order": 5,
    "context_text": null,
    "question": "Hoe mag die inligting op die kaartjie uiteengesit word?",
    "metadata": [
      "Elke sin moet 'n volle paragraaf wees.",
      "Daar mag geen opskrif wees nie.",
      "Alle inligting moet in hoofletters wees.",
      "Inligting kan puntsgewys gegee word.",
      ""
    ],
    "answer": [
      "Inligting kan puntsgewys gegee word.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "uitnodiging",
    "subtopic": "uitleg_van_die_uitnodiging",
    "skills": [
      "afrikaans_fal_identifiseer_kenmerke_van_teksvorm"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Geen omslagtige paragrawe nie.\n- Kort reëls maak dit leservriendelik."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1",
      "marks": 20,
      "clues": "- Jy skryf 'n uitnodigingskaartjie om jou maats na jou 18de verjaardagpartytjie uit te nooi.",
      "approach": "- Gee wie, wanneer, waar, kleredrag en kontakbesonderhede\n- Maak die belangrikste inligting opvallend",
      "solution": "1. Inhoud: teikengroep, dag, datum en tyd, plek, kleredrag, kontakbesonderhede en hoe gaste laat weet.\n2. Formaat: belangrike inligting trek aandag, verskillende lettertipes, geen omslagtige paragrawe, kan puntsgewys wees.\n3. Taal: uitnodigend, informeel en gemaklik; 80–100 woorde."
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
