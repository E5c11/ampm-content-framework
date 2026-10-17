#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P3 — November 2025 — Vraag 3.2: Dagboekinskrywings
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: M: memo 3.2 Formaat
 *   Q2: M: memo 3.2 Taal en styl
 *   Q3: M: memo 3.2 Taal en styl
 *   Q4: P: paper 3.2
 *   Q5: M: memo 3.2 Formaat
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p3-q8.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q8.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q8.js
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
  "name": "Vraag 3.2: Dagboekinskrywings",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "diary_entry",
    "transactional_writing",
    "language_register"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q8/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q8/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q8/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q8/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q8/memo_3.png"
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
    "question": "Wat moet boaan elke dagboekinskrywing geskryf word? Skryf een woord.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "datum|dag",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transaksionele_tekste",
    "topic": "dagboekinskrywing",
    "subtopic": "formaat_van_die_inskrywing",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 1,
    "exam_weight": 3,
    "clues": "- Elke inskrywing word aan 'n dag gekoppel.\n- Skryf een woord.",
    "keyboard_type": "text"
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
    "question": "Aan wie skryf 'n mens in 'n dagboek?",
    "metadata": [
      "Die onderwyser",
      "Hom- of haarself",
      "Die klasmaats",
      "Die hoof",
      ""
    ],
    "answer": [
      "Hom- of haarself",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "dagboekinskrywing",
    "subtopic": "aanspreekvorm",
    "skills": [
      "afrikaans_fal_kies_gepaste_register"
    ],
    "difficulty": 1,
    "exam_weight": 3,
    "clues": "- 'n Dagboek is persoonlik.\n- Die toon is persoonlik."
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
    "question": "Kies TWEE woorde wat gevoelens beskryf, soos in 'n dagboekinskrywing.",
    "metadata": [
      "hartseer",
      "padteken",
      "dankbaar",
      "straatnaam",
      ""
    ],
    "answer": [
      "hartseer",
      "dankbaar",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "dagboekinskrywing",
    "subtopic": "woordkeuse_vir_gevoelens",
    "skills": [
      "afrikaans_fal_identifiseer_kenmerke_van_teksvorm"
    ],
    "difficulty": 1,
    "exam_weight": 3,
    "clues": "- Die memo noem woorde soos ongelukkig en hoopvol.\n- Die ander twee woorde gaan oor rigtings."
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
    "question": "Hoeveel dagboekinskrywings moet die kandidaat maak?",
    "metadata": [
      "Een inskrywing vir die hele week lank",
      "Drie inskrywings, vir drie klasse",
      "Twee, vir twee verskillende dae",
      "Net een kort sin oor jou dag",
      ""
    ],
    "answer": [
      "Twee, vir twee verskillende dae",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "dagboekinskrywing",
    "subtopic": "aantal_inskrywings",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 1,
    "exam_weight": 3,
    "clues": "- Die opdrag noem twee aande.\n- Elke inskrywing het sy eie dag."
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
    "question": "Moet jy elke inskrywing met \"Liewe Dagboek\" begin?",
    "metadata": [
      "Ja, anders kry jy geen punte nie.",
      "Ja, maar net by die eerste inskrywing.",
      "Nee, want 'n dagboek mag nie 'n aanhef hê nie.",
      "Nee, dit is nie verpligtend nie.",
      ""
    ],
    "answer": [
      "Nee, dit is nie verpligtend nie.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "dagboekinskrywing",
    "subtopic": "aanhef_in_die_dagboek",
    "skills": [
      "afrikaans_fal_onderskei_waar_van_onwaar"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Die memo sê iets oor 'n aanhef in 'n dagboek.\n- Dit is 'n opsie, nie 'n vereiste nie."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2",
      "marks": 20,
      "clues": "- Jy maak twee dagboekinskrywings: die aand na jou gunstelingonderwyser weg is en die aand na jou eerste les by die nuwe onderwyser.",
      "approach": "- Skryf elke inskrywing met die dag of datum boaan\n- Beskryf jou gevoelens met fyn gekose woorde",
      "solution": "1. Formaat: twee inskrywings vir twee dae, die dag of datum boaan, geen verpligte aanhef.\n2. Inhoud: jou gevoelens en gedagtes oor die vorige en die nuwe onderwyser.\n3. Taal: persoonlik en informeel; vermy sleng en sms-taal; 80–100 woorde."
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
