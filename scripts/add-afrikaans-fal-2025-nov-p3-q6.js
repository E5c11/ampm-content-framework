#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P3 — November 2025 — Vraag 2.4: Informele toespraak
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: M: memo 2.4 Inhoud/Formaat
 *   Q2: M: memo 2.4 Formaat
 *   Q3: M: memo 2.4 Taal en styl
 *   Q4: M: memo 2.4 Formaat
 *   Q5: P: paper instruction 3
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p3-q6.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q6.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q6.js
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
  "name": "Vraag 2.4: Informele toespraak",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "speech_structure",
    "transactional_writing",
    "language_register"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q6/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q6/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q6/memo_2.png"
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
    "question": "Rangskik die dele van 'n toespraak in die volgorde waarin hulle voorkom.",
    "metadata": [
      "Hoogtepunte en laagtepunte van die jare",
      "Motivering en voorspoedwense aan die einde",
      "Die groet",
      "Die rede vir die toespraak",
      ""
    ],
    "answer": [
      "Die groet",
      "Die rede vir die toespraak",
      "Hoogtepunte en laagtepunte van die jare",
      "Motivering en voorspoedwense aan die einde",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "toespraak",
    "subtopic": "struktuur_van_die_toespraak",
    "skills": [
      "afrikaans_fal_rangskik_dele_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die toespraak begin met 'n groet.\n- Die voorspoedwense sluit af."
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
    "question": "Waarmee begin 'n toespraak volgens die memo? Skryf een woord.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "groet",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transaksionele_tekste",
    "topic": "toespraak",
    "subtopic": "begin_van_die_toespraak",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 1,
    "exam_weight": 3,
    "clues": "- Dit is wat jy eerste vir jou gehoor sê.\n- Skryf een woord.",
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
    "question": "Watter aanspreekvorm en styl pas by 'n informele toespraak?",
    "metadata": [
      "streng formeel",
      "kwaad en aanvallend",
      "informeel en gemaklik",
      "kortaf soos 'n kennisgewing",
      ""
    ],
    "answer": [
      "informeel en gemaklik",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "toespraak",
    "subtopic": "aanspreekvorm_en_styl",
    "skills": [
      "afrikaans_fal_kies_gepaste_register"
    ],
    "difficulty": 1,
    "exam_weight": 3,
    "clues": "- Jy praat met jou mede-graad 12-leerders.\n- Die toespraak is informeel."
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
    "question": "Kies TWEE dele wat in 'n toespraak hoort.",
    "metadata": [
      "'n Inleiding met die groet en die rede",
      "Die adres van die ontvanger onder die datum",
      "'n Slot met motivering en voorspoedwense",
      "'n Datum regs bo teen die kantlyn",
      ""
    ],
    "answer": [
      "'n Inleiding met die groet en die rede",
      "'n Slot met motivering en voorspoedwense",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "toespraak",
    "subtopic": "kenmerke_van_die_toespraak",
    "skills": [
      "afrikaans_fal_identifiseer_kenmerke_van_teksvorm"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- 'n Toespraak het 'n inleiding, liggaam en slot.\n- 'n Adres en datum pas by 'n brief."
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
    "question": "Watter taalgebruik moet jy in die skryfstuk vermy volgens die vraestel se instruksies?",
    "metadata": [
      "volsinne",
      "sms-taal",
      "'n positiewe toon",
      "paragrawe",
      ""
    ],
    "answer": [
      "sms-taal",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transaksionele_tekste",
    "topic": "toespraak",
    "subtopic": "taal_wat_vermy_moet_word",
    "skills": [
      "afrikaans_fal_identifiseer_kenmerke_van_teksvorm"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Die instruksie sê iets oor 'n kort manier van skryf op die selfoon.\n- Dit pas nie by 'n skryfstuk nie."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.4",
      "marks": 30,
      "clues": "- Jy skryf 'n informele toespraak oor die vyf jaar wat die graad 12-leerders saam op skool was.",
      "approach": "- Begin met die groet en stel die rede dadelik\n- Sluit af met motivering en voorspoedwense",
      "solution": "1. Formaat: groet, inleiding, liggaam in paragrawe, slot.\n2. Inhoud: wat saam beleef is, hoogte- en laagtepunte, wat die jare spesiaal gemaak het, motivering en voorspoedwense.\n3. Taal: informeel en gemaklik, positief; geen sms-taal."
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
