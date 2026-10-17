#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P3 — November 2025 — Vraag 2.1: Vriendskaplike brief
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: M: memo 2.1 format
 *   Q2: M: memo 2.1 Leestekens
 *   Q3: M: memo 2.1 Aanhef
 *   Q4: M: memo 2.1 Kenmerke
 *   Q5: P: paper Vraag 2 (120–150)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p3-q3.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q3.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q3.js
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
  "name": "Vraag 2.1: Vriendskaplike brief",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "letter_format",
    "transactional_writing",
    "language_register"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q3/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q3/memo_3.png"
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
    "question": "Rangskik die dele van 'n vriendskaplike brief van bo na onder.",
    "metadata": [
      "Die groet en naam aan die einde",
      "Die datum voluit geskryf",
      "Die skrywer se adres regs bo",
      "Die aanhef teen die linkerkantlyn",
      ""
    ],
    "answer": [
      "Die skrywer se adres regs bo",
      "Die datum voluit geskryf",
      "Die aanhef teen die linkerkantlyn",
      "Die groet en naam aan die einde",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "vriendskaplike_brief",
    "subtopic": "formaat_van_die_brief",
    "skills": [
      "afrikaans_fal_rangskik_dele_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die adres en datum staan eerste.\n- Die groet kom aan die einde."
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
    "question": "Watter ding word NIE in die adres, aanhef of slot van die brief gebruik nie? Skryf een woord.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "leestekens",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transaksionele_tekste",
    "topic": "vriendskaplike_brief",
    "subtopic": "leestekens_in_die_brief",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Dit gaan oor punte en kommas.\n- Skryf een woord.",
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
    "question": "Watter aanhef pas by 'n vriendskaplike brief aan 'n maat?",
    "metadata": [
      "Geagte mevrou Cona",
      "Beste Thandi",
      "Aan wie dit mag aangaan",
      "Hooggeagte meneer Dickson",
      ""
    ],
    "answer": [
      "Beste Thandi",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "vriendskaplike_brief",
    "subtopic": "aanhef_en_register",
    "skills": [
      "afrikaans_fal_kies_gepaste_register"
    ],
    "difficulty": 1,
    "exam_weight": 3,
    "clues": "- 'n Vriendskaplike brief is informeel.\n- Die memo noem \"Beste\" of \"Liewe\"."
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
    "question": "Kies TWEE kenmerke van 'n vriendskaplike brief.",
    "metadata": [
      "Die aanslag is informeel",
      "Die doel word in hoofletters geskryf",
      "Die inhoud word in paragrawe aangebied",
      "Die brief word met Die uwe afgesluit",
      ""
    ],
    "answer": [
      "Die aanslag is informeel",
      "Die inhoud word in paragrawe aangebied",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "vriendskaplike_brief",
    "subtopic": "kenmerke_van_die_brief",
    "skills": [
      "afrikaans_fal_identifiseer_kenmerke_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Dink aan hoe jy met 'n maat praat.\n- Hoofletters vir die doel en Die uwe pas by 'n ander soort brief."
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
    "question": "Hoeveel woorde behoort 'n lang transaksionele teks soos hierdie brief te hê?",
    "metadata": [
      "80–100 woorde",
      "250–300 woorde",
      "50–70 woorde",
      "120–150 woorde",
      ""
    ],
    "answer": [
      "120–150 woorde",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "vriendskaplike_brief",
    "subtopic": "woordelengte",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Dit is nie die opstel nie.\n- Afdeling B se lengte staan by die opdrag."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1",
      "marks": 30,
      "clues": "- Jy skryf 'n vriendskaplike brief aan jou maat oor 'n lekker musiekkonsert.",
      "approach": "- Gebruik die regte formaat, 'n informele toon en paragrawe\n- Hou by 120–150 woorde",
      "solution": "1. Formaat: adres regs bo, datum voluit, aanhef (Beste of Liewe) teen die linkerkantlyn, geen leestekens in adres, aanhef of slot.\n2. Inhoud: die doel is om te vertel van die konsert en waarom jy dit baie geniet het.\n3. Taal: informeel, vriendelik en waarderend, korrekte spelling en sinne."
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
