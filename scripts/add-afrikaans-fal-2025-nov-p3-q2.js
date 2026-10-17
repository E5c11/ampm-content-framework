#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P3 — November 2025 — Vraag 1.6–1.8: Opstel — visuele prikkels
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: M: memo general 9 (Vraag 1.6-1.8)
 *   Q2: M: memo 1.6-1.8
 *   Q3: M: rubric (inleiding, liggaam, samevatting/slot)
 *   Q4: M: memo 'Neerskryf van punte' (30/15/5)
 *   Q5: M: memo general 3
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p3-q2.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q2.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p3-q2.js
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
  "name": "Vraag 1: Opstel (1.6–1.8)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "essay_writing_skills",
    "essay_structure",
    "narrative_writing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q2/question_v2_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q2/question_v2_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q2/memo_v2_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q2/memo_v2_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q2/memo_v2_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p3/q2/memo_v2_4.png"
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
    "question": "Waaraan moet die titel en die visuele prikkel voldoen?",
    "metadata": [
      "Die titel hoef niks met die prent te doen te hê nie.",
      "Die prent moet net oorgeskryf word as 'n sin.",
      "Die titel moet altyd uit die woorde 'prent' en 'opstel' bestaan.",
      "Die titel en die visuele prikkel moet by mekaar aansluit.",
      ""
    ],
    "answer": [
      "Die titel en die visuele prikkel moet by mekaar aansluit.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "opstel",
    "topic": "prikkels_en_titel",
    "subtopic": "titel_en_prikkel",
    "skills": [
      "afrikaans_fal_onderskei_waar_van_onwaar"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die memo sê wat die nasiener oor titel en prent onthou.\n- Dit gaan oor hoe die twee verband hou."
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
    "question": "Kies TWEE maniere waarop jy 'n prent in 'n opstel kan interpreteer.",
    "metadata": [
      "Letterlik: wat jy op die prent sien",
      "Deur die prent net oor te skryf soos dit is",
      "Figuurlik: wat die prent simboliseer",
      "Deur die prent heeltemal te ignoreer",
      ""
    ],
    "answer": [
      "Letterlik: wat jy op die prent sien",
      "Figuurlik: wat die prent simboliseer",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "opstel",
    "topic": "prikkels_en_titel",
    "subtopic": "prent_letterlik_en_figuurlik",
    "skills": [
      "afrikaans_fal_interpreteer_visuele_prikkel"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die memo gee 'n letterlike en 'n figuurlike interpretasie by elke prent.\n- Twee opsies pas by die memo."
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
    "question": "Rangskik die dele van 'n opstel in die volgorde waarin hulle voorkom.",
    "metadata": [
      "Die liggaam van die opstel",
      "Die samevatting of slot",
      "Die inleiding",
      "",
      ""
    ],
    "answer": [
      "Die inleiding",
      "Die liggaam van die opstel",
      "Die samevatting of slot",
      "",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "opstel",
    "topic": "struktuur",
    "subtopic": "dele_van_die_opstel",
    "skills": [
      "afrikaans_fal_rangskik_dele_van_teksvorm"
    ],
    "difficulty": 1,
    "exam_weight": 3,
    "clues": "- Dink aan hoe 'n opstel van begin tot einde opgebou word.\n- Elke deel het sy eie taak."
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
    "question": "Uit hoeveel punte word Inhoud en Beplanning in die opstelrubriek nagesien? Skryf net die getal.",
    "metadata": [
      "Getal:",
      "[ ]"
    ],
    "answer": [
      "30",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "opstel",
    "topic": "taal_en_beoordeling",
    "subtopic": "puntetoekenning",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Die opstel is uit 50 punte nagesien.\n- Inhoud en beplanning dra die meeste punte.",
    "keyboard_type": "text"
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
    "question": "Wat gebeur as 'n opstel heeltemal in Engels geskryf is?",
    "metadata": [
      "Die kandidaat verdien net die struktuurpunte.",
      "Die kandidaat verdien half punte vir die inhoud.",
      "Die kandidaat verdien geen punte nie.",
      "Die kandidaat verdien vol punte vir die taal.",
      ""
    ],
    "answer": [
      "Die kandidaat verdien geen punte nie.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "opstel",
    "topic": "taal_en_beoordeling",
    "subtopic": "opstel_in_engels",
    "skills": [
      "afrikaans_fal_onderskei_waar_van_onwaar"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Die opstel moet in die taal wat geassesseer word geskryf wees.\n- Die memo se algemene reël sê wat dan gebeur."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.6",
      "marks": 50,
      "clues": "- Kyk na die prent: iemand wat vasgeketting is wat 'n selfoon vashou.",
      "approach": "- Interpreteer letterlik en figuurlik",
      "solution": "1. Letterlik: mense gebruik tegnologie vir alles of sit lang ure voor skerms.\n2. Figuurlik: tegnologie maak jou 'n slaaf en beperk jou lewe tot 'n skerm."
    },
    {
      "number": "1.7",
      "marks": 50,
      "clues": "- Kyk na die prent: 'n verfkwas wat 'n pad oopverf en 'n figuur wat die pad volg.",
      "approach": "- Interpreteer letterlik en figuurlik",
      "solution": "1. Letterlik: iemand verf 'n pad of leef sy talent uit.\n2. Figuurlik: 'n lewensreis, 'n skoon begin; ek verf my eie pad oop."
    },
    {
      "number": "1.8",
      "marks": 50,
      "clues": "- Kyk na die prent: 'n kind alleen op 'n swaai.",
      "approach": "- Interpreteer letterlik en figuurlik",
      "solution": "1. Letterlik: 'n kind wat buite speel of vir iemand wag.\n2. Figuurlik: eensaamheid, verwaarlosing of ontvlugting."
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
