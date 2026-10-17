#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P3 — November 2025 — Vraag 1.1–1.5: Opstel
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: M: memo 1.3-1.5 type descriptions
 *   Q2: P: paper instruction 5
 *   Q3: P: Teks Vraag 1 (250–300 woorde)
 *   Q4: M: memo 1.4
 *   Q5: M: memo 1.1-1.5
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p3-q1.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q1.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q1.js
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
  "name": "Vraag 1: Opstel (1.1–1.5)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "essay_writing_skills",
    "essay_structure",
    "narrative_writing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q1/question_v2_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q1/memo_v2_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q1/memo_v2_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q1/memo_v2_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q1/memo_v2_4.png"
  ],
  "exam_question_marks": 50,
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
    "question": "Pas elke opsteltipe by sy beskrywing.",
    "metadata": [
      "A - Argumenterende opstel",
      "B - Beredeneerde opstel",
      "C - Bespiegelende opstel",
      "1 - beredeneer die onderwerp in 'n gebalanseerde opstel",
      "2 - bespiegel of wonder oor die onderwerp",
      "3 - neem reg van die begin af 'n standpunt in en motiveer dit"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2",
      "",
      ""
    ],
    "presentation": "match",
    "type": "application",
    "unit": "opstel",
    "topic": "opsteltipes",
    "subtopic": "beskrywing_van_opsteltipes",
    "skills": [
      "afrikaans_fal_pas_opsteltipe_by_beskrywing"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Dink aan wat die kandidaat in elke tipe doen.\n- Begin met die een wat jy die mees seker is van."
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
    "question": "Rangskik die stappe van die skryfproses in die volgorde waarin jy dit uitvoer.",
    "metadata": [
      "Skryf die opstel",
      "Kies 'n onderwerp",
      "Redigeer en proeflees die opstel",
      "Beplan met 'n kopkaart of sleutelwoorde",
      ""
    ],
    "answer": [
      "Kies 'n onderwerp",
      "Beplan met 'n kopkaart of sleutelwoorde",
      "Skryf die opstel",
      "Redigeer en proeflees die opstel",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "opstel",
    "topic": "beplanning",
    "subtopic": "volgorde_van_die_skryfproses",
    "skills": [
      "afrikaans_fal_rangskik_skryfproses"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die paper se instruksies sê beplanning kom voordat jy die finale produk skryf.\n- Na die skryf kom nog 'n stap."
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
    "question": "Hoeveel woorde moet jou opstel minstens hê? Skryf net die getal.",
    "metadata": [
      "Getal:",
      "[ ]"
    ],
    "answer": [
      "250",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "opstel",
    "topic": "struktuur",
    "subtopic": "woordelengte_van_die_opstel",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Die paper vra vir 'n opstel van tussen twee getalle.\n- Skryf die kleinste getal.",
    "keyboard_type": "text"
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
    "question": "Watter opsteltipe pas by \"'Nee' is die moeilikste woord om te sê\" as jy reg van die begin af 'n standpunt wil inneem?",
    "metadata": [
      "verhalende opstel",
      "beskrywende opstel",
      "argumenterende opstel",
      "bespiegelende opstel",
      ""
    ],
    "answer": [
      "argumenterende opstel",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "opstel",
    "topic": "opsteltipes",
    "subtopic": "opsteltipe_by_onderwerp",
    "skills": [
      "afrikaans_fal_kies_opsteltipe_by_onderwerp"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die tipe waar jy 'n standpunt inneem en motiveer.\n- Die memo noem dit by onderwerp 1.4."
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
    "question": "Wat sê die memo oor die opsteltipes wat 'n onderwerp toelaat?",
    "metadata": [
      "Jy mag net een opsteltipe in die hele opstel gebruik.",
      "Die opstel kan elemente van verskillende tipes opstelle bevat.",
      "Jy moet altyd 'n argumenterende opstel skryf.",
      "Verskillende tipes opstelle word nie aanvaar nie.",
      ""
    ],
    "answer": [
      "Die opstel kan elemente van verskillende tipes opstelle bevat.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "opstel",
    "topic": "opsteltipes",
    "subtopic": "kombinasie_van_opsteltipes",
    "skills": [
      "afrikaans_fal_onderskei_waar_van_onwaar"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Die memo sê wat die nasiener oor 'n kombinasie van tipes onthou.\n- Dit staan by elke onderwerp."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1",
      "marks": 50,
      "clues": "- Dink aan wat jy van jou maat(s) geleer het.",
      "approach": "- Kies verhalend of beskrywend\n- Beplan en skryf 250–300 woorde",
      "solution": "1. Verhalende opstel: vertel lewendig wat jy by jou maat(s) geleer het.\n2. Beskrywende opstel: beskryf dit lewendig."
    },
    {
      "number": "1.2",
      "marks": 50,
      "clues": "- Dink aan die huis op die hoek van die straat.",
      "approach": "- Kies beskrywend, verhalend of bespiegelend",
      "solution": "1. Beskrywend: beskryf die huis.\n2. Verhalend: vertel van die huis.\n3. Bespiegelend: wonder oor die huis."
    },
    {
      "number": "1.3",
      "marks": 50,
      "clues": "- Wat hou 2026 vir jou in?",
      "approach": "- Kies bespiegelend, beredeneerd of beskrywend",
      "solution": "1. Bespiegelend: wonder oor wat 2026 inhou.\n2. Beredeneerd: beredeneer of jy uitsien na 2026 of nie.\n3. Beskrywend: beskryf hoe jy uitsien na 2026."
    },
    {
      "number": "1.4",
      "marks": 50,
      "clues": "- Is \"nee\" regtig die moeilikste woord om te sê?",
      "approach": "- Neem 'n standpunt in of beredeneer",
      "solution": "1. Argumenterend: neem reg van die begin 'n standpunt in en motiveer dit.\n2. Beredeneerd, verhalend, beskrywend of bespiegelend is ook moontlik."
    },
    {
      "number": "1.5",
      "marks": 50,
      "clues": "- Wat beteken vryheid vir jou?",
      "approach": "- Kies bespiegelend, verhalend, beskrywend of argumenterend",
      "solution": "1. Bespiegelend: wonder oor die idee van vryheid.\n2. Argumenterend: neem 'n standpunt in dat vryheid bestaan al dan nie."
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
