#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P3 — November 2025 — Vraag 2.3: Huldeblyk
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: M: memo 2.3 Formaat
 *   Q2: M: memo 2.3 Kenmerke
 *   Q3: M: memo 2.3 Kenmerke
 *   Q4: M: memo 2.3 Formaat/Inhoud
 *   Q5: M: memo 2.3 Kenmerke
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p3-q5.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q5.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q5.js
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
  "name": "Vraag 2.3: Huldeblyk",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "obituary",
    "transactional_writing",
    "language_register"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q5/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q5/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q5/memo_3.png"
  ],
  "exam_question_marks": 30,
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
    "question": "Rangskik die dele van 'n huldeblyk in die volgorde waarin hulle voorkom.",
    "metadata": [
      "Die slot met waardering en bemoediging vir die familie",
      "Die oom se naam en 'n oorsig oor sy lewe",
      "Die inleiding met die groet en die rede vir die samekoms",
      "Staaltjies uit die tyd toe jy hom geken het",
      ""
    ],
    "answer": [
      "Die inleiding met die groet en die rede vir die samekoms",
      "Die oom se naam en 'n oorsig oor sy lewe",
      "Staaltjies uit die tyd toe jy hom geken het",
      "Die slot met waardering en bemoediging vir die familie",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "huldeblyk",
    "subtopic": "struktuur_van_die_huldeblyk",
    "skills": [
      "afrikaans_fal_rangskik_dele_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die huldeblyk begin met 'n groet.\n- Die familie word aan die einde bemoedig."
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
    "question": "In watter tyd word die huldeblyk hoofsaaklik geskryf? Skryf een of twee woorde.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "verlede|verlede tyd",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transaksionele_tekste",
    "topic": "huldeblyk",
    "subtopic": "tyd_in_die_huldeblyk",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die oom is reeds dood.\n- Die vertroosting staan in 'n ander tyd.",
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
    "question": "Watter toon pas by 'n huldeblyk by 'n gedenkdiens?",
    "metadata": [
      "spottend en grappig",
      "kwaad en beskuldigend",
      "onverskillig en kortaf",
      "waarderend en respekvol",
      ""
    ],
    "answer": [
      "waarderend en respekvol",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "huldeblyk",
    "subtopic": "toon_van_die_huldeblyk",
    "skills": [
      "afrikaans_fal_kies_gepaste_register"
    ],
    "difficulty": 1,
    "exam_weight": 3,
    "clues": "- Jy praat oor iemand wat gesterf het en eer sy lewe.\n- Dink aan die gevoel by 'n gedenkdiens."
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
    "question": "Kies TWEE dinge wat 'n huldeblyk moet bevat.",
    "metadata": [
      "'n Opskrif",
      "Die oom se skuldbrief",
      "Bemoediging vir die familie",
      "Instruksies om by die gedenkdiens uit te kom",
      ""
    ],
    "answer": [
      "'n Opskrif",
      "Bemoediging vir die familie",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "huldeblyk",
    "subtopic": "kenmerke_van_die_huldeblyk",
    "skills": [
      "afrikaans_fal_identifiseer_kenmerke_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die memo se Formaat noem 'n opskrif.\n- Dink aan wie jy wil bemoedig."
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
    "question": "Wat is die doel van 'n huldeblyk?",
    "metadata": [
      "Om die familie se skuld by die kerk te bespreek.",
      "Om hulde te bring en die familie te bemoedig.",
      "Om die gedenkdiens se hele program voor te lees.",
      "Om 'n lang toespraak oor skoolwerk te lewer.",
      ""
    ],
    "answer": [
      "Om hulde te bring en die familie te bemoedig.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "huldeblyk",
    "subtopic": "doel_van_die_huldeblyk",
    "skills": [
      "afrikaans_fal_identifiseer_doel_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Die huldeblyk eer iemand.\n- Wie moet ook bemoedig word?"
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3",
      "marks": 30,
      "clues": "- Jy skryf die huldeblyk vir jou oom by wie jy baie van kultuur en tradisies geleer het.",
      "approach": "- Skryf in die verlede tyd met 'n opskrif\n- Bemoedig die familie",
      "solution": "1. Formaat: opskrif, inleidende paragraaf met groet en rede, paragraaf 2 met naam en oorsig, volgende paragrawe met staaltjies, slotparagraaf met waardering.\n2. Toon: waarderend, liefdevol, vertroostend en taktvol.\n3. Lengte 120–150 woorde."
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
