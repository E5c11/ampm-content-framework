#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P3 — November 2025 — Vraag 2.2: Dekbrief (formele brief)
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: M: memo 2.2 format
 *   Q2: M: memo 2.2 (Die uwe)
 *   Q3: M: memo 2.2 Taal en styl
 *   Q4: M: memo 2.2 Inhoud
 *   Q5: M: memo 2.2 Kenmerke
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p3-q4.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q4.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q4.js
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
  "name": "Vraag 2.2: Dekbrief",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "formal_letter",
    "letter_format",
    "formal_register"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q4/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q4/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q4/memo_3.png"
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
    "question": "Rangskik die dele van 'n dekbrief van bo na onder.",
    "metadata": [
      "Die formele aanhef",
      "Die skrywer se adres en die datum",
      "Die doel van die brief in hoofletters",
      "Die ontvanger se adres teen die linkerkantlyn",
      ""
    ],
    "answer": [
      "Die skrywer se adres en die datum",
      "Die ontvanger se adres teen die linkerkantlyn",
      "Die formele aanhef",
      "Die doel van die brief in hoofletters",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "formele_brief",
    "subtopic": "formaat_van_die_brief",
    "skills": [
      "afrikaans_fal_rangskik_dele_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die skrywer se adres kom voor die ontvanger s'n.\n- Die doel kom na die aanhef."
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
    "question": "Voltooi die formele afsluiting van die brief met een woord: Die ...",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "uwe",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transaksionele_tekste",
    "topic": "formele_brief",
    "subtopic": "formele_afsluiting",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Dit is die formele slot voor jou naam.\n- Geen leesteken word daarna gebruik nie.",
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
    "question": "Hoe spreek jy die hoof in 'n dekbrief aan?",
    "metadata": [
      "Met \"u\" omdat die brief formeel is",
      "Met \"jy\" en sleng",
      "Net met sy voornaam",
      "Met \"ons\" asof hy 'n maat is",
      ""
    ],
    "answer": [
      "Met \"u\" omdat die brief formeel is",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "formele_brief",
    "subtopic": "aanspreekvorm",
    "skills": [
      "afrikaans_fal_kies_gepaste_register"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- 'n Dekbrief is formeel.\n- Die memo sê die hoof word as 'u' aangespreek."
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
    "question": "Kies TWEE dinge wat in 'n dekbrief moet wees.",
    "metadata": [
      "Die doel van die brief (die aansoek vir die pos)",
      "Jou volledige CV woord vir woord oorgeskryf",
      "Motivering waarom jy in diens geneem moet word",
      "'n Grap om die hoof te laat lag",
      ""
    ],
    "answer": [
      "Die doel van die brief (die aansoek vir die pos)",
      "Motivering waarom jy in diens geneem moet word",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "formele_brief",
    "subtopic": "kenmerke_van_die_brief",
    "skills": [
      "afrikaans_fal_identifiseer_kenmerke_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die dekbrief ondersteun die aansoek.\n- Dit herhaal nie die CV nie."
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
    "question": "Wat is die doel van 'n dekbrief?",
    "metadata": [
      "Om die CV in 'n ander volgorde oor te skryf vir die hoof.",
      "Om die hoof persoonlik te vermaak en te laat lag.",
      "Om die aansoek met nuwe inligting buite die CV te ondersteun.",
      "Om die kandidaat se naam in die koerant bekend te maak.",
      ""
    ],
    "answer": [
      "Om die aansoek met nuwe inligting buite die CV te ondersteun.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "formele_brief",
    "subtopic": "doel_van_die_dekbrief",
    "skills": [
      "afrikaans_fal_identifiseer_doel_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Die dekbrief gaan saam met 'n CV.\n- Wat voeg dit by die CV?"
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2",
      "marks": 30,
      "clues": "- Jy skryf 'n dekbrief aan meneer Dickson, hoof van Laerskool Sonskyn, vir die pos as onderwysassistent.",
      "approach": "- Gebruik die formele formaat en 'u'\n- Motiveer waarom jy in diens geneem moet word",
      "solution": "1. Formaat: skrywer se adres regs bo, datum voluit, ontvanger se adres links, formele aanhef, doel in hoofletters (of onderstreep), Die uwe sonder leesteken.\n2. Inhoud: ondersteun die aansoek met persoonlikheidseienskappe en vaardighede wat nie in die CV is nie.\n3. Taal: formeel en hoopvol; 120–150 woorde."
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
