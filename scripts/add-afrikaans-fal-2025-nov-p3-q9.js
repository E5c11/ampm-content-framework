#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P3 — November 2025 — Vraag 3.3: Rigtingaanwysings
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: M: memo 3.3 Inhoud (chronologies)
 *   Q2: M: memo 3.3 Kenmerke/Taal
 *   Q3: M: memo 3.3 Taal en styl
 *   Q4: M: memo 3.3 Inhoud
 *   Q5: P: paper 3.3
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p3-q9.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q9.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q9.js
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
  "name": "Vraag 3.3: Rigtingaanwysings",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "direction",
    "transactional_writing",
    "language_register"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q9/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q9/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q9/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q9/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q9/memo_3.png"
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
    "question": "Rangskik hierdie rigtingaanwysings in 'n logiese volgorde van die begin tot die skool.",
    "metadata": [
      "Ry verby die garage",
      "Vertrek by die taxi-staanplek",
      "Die skool is aan jou regterkant",
      "Draai links in Kerkstraat",
      ""
    ],
    "answer": [
      "Vertrek by die taxi-staanplek",
      "Draai links in Kerkstraat",
      "Ry verby die garage",
      "Die skool is aan jou regterkant",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "rigtingaanwysings",
    "subtopic": "chronologiese_volgorde",
    "skills": [
      "afrikaans_fal_rangskik_dele_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Rigtingaanwysings word chronologies gegee.\n- Die bestemming kom laaste."
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
    "question": "Watter tipe sin begin rigtingaanwysings gewoonlik met 'n werkwoord (bv. Draai links)? Skryf een woord.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "bevelsin|bevelsinne",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transaksionele_tekste",
    "topic": "rigtingaanwysings",
    "subtopic": "sinstruktuur",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Hierdie sin gee 'n opdrag.\n- Skryf een woord.",
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
    "question": "In watter tyd word rigtingaanwysings geskryf?",
    "metadata": [
      "die verlede tyd",
      "die teenwoordige tyd",
      "die toekomende tyd",
      "enige tyd wat jy wil",
      ""
    ],
    "answer": [
      "die teenwoordige tyd",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "rigtingaanwysings",
    "subtopic": "tyd_in_rigtingaanwysings",
    "skills": [
      "afrikaans_fal_kies_gepaste_register"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die persoon volg die aanwysings terwyl hy ry.\n- Die memo noem die tyd."
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
    "question": "Kies TWEE dinge wat in rigtingaanwysings gebruik word.",
    "metadata": [
      "Padtekens en bakens",
      "Lang beskrywings van jou gevoelens",
      "Woorde wat rigting aandui",
      "Onnodige detail oor jou dag",
      ""
    ],
    "answer": [
      "Padtekens en bakens",
      "Woorde wat rigting aandui",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "rigtingaanwysings",
    "subtopic": "inhoud_van_rigtingaanwysings",
    "skills": [
      "afrikaans_fal_identifiseer_kenmerke_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die teks leen hom nie tot onnodige detail nie.\n- Dink aan wat 'n vreemdeling nodig het."
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
    "question": "Hoe moet die aanwysings volgens die opdrag neergeskryf word?",
    "metadata": [
      "In een lang paragraaf sonder punte",
      "Slegs as 'n lys van straatname",
      "Puntsgewys, onder mekaar en in volsinne",
      "In die verlede tyd as 'n storie",
      ""
    ],
    "answer": [
      "Puntsgewys, onder mekaar en in volsinne",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "rigtingaanwysings",
    "subtopic": "uitleg_van_rigtingaanwysings",
    "skills": [
      "afrikaans_fal_identifiseer_kenmerke_van_teksvorm"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Die opdrag sê hoe die aanwysings uiteengesit moet word.\n- Dit staan aan die einde van die opdrag."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.3",
      "marks": 20,
      "clues": "- Jy gee 'n onderwyser van 'n ander skool rigtingaanwysings van die taxi-staanplek tot by jou skool.",
      "approach": "- Skryf puntsgewys, onder mekaar en in volsinne\n- Gee die aanwysings in chronologiese volgorde",
      "solution": "1. Formaat: genommer of met kolpunte, onder mekaar en in volsinne.\n2. Inhoud: 'n reeks aanwysings met woorde wat rigting aandui, padtekens en bakens, in volgorde.\n3. Taal: bevelsinne in die teenwoordige tyd, min detail; 80–100 woorde."
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
