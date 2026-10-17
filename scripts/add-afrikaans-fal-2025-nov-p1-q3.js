#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P1 — November 2025 — Vraag 2: Opsomming — Teks C
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P1: select tips (mirror Q2, 7 wenke)
 *   Q2: P1: own-words (instruction 1: EIE VOLSINNE)
 *   Q3: P1: select main points vs example
 *   Q4: P1: point-form order
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p1-q3.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q3.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q3.js
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
  "name": "Vraag 2: Opsomming",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "summary",
    "main_points",
    "paraphrase"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q3/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q3/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q3/annexure_teks_c_1.png"
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
    "context_text": "Begin vroeg met leer, want dan het jy tyd om alles te hersien. Jou jonger broer het gesê dit is te moeilik. Maak 'n leerrooster sodat jy weet wat om wanneer te leer.",
    "question": "Kies die TWEE sinne wat wenke vir 'n goeie toetsvoorbereiding gee.",
    "metadata": [
      "Begin vroeg met leer.",
      "Jou jonger broer het gesê dit is te moeilik.",
      "Maak 'n leerrooster.",
      "Dit was 'n warm Dinsdag.",
      ""
    ],
    "answer": [
      "Begin vroeg met leer.",
      "Maak 'n leerrooster.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "opsomming",
    "topic": "hoofgedagtes_en_wenke",
    "subtopic": "kies_wenke_uit_teks",
    "skills": [
      "afrikaans_fal_kies_wenke_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- 'n Wenk sê vir die leser wat hy of sy moet doen.\n- Sinne oor wat iemand anders gesê het of oor die weer is nie wenke nie."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 2",
    "order": 2,
    "context_text": "Probeer om elke aand goed te slaap, want 'n rustige brein onthou beter.",
    "question": "Watter sin gee die wenk in EIE WOORDE weer?",
    "metadata": [
      "Probeer om elke aand goed te slaap, want 'n rustige brein onthou beter.",
      "Slaap genoeg, want dit help jou om te onthou.",
      "Gaan laat slaap, want dan hoef jy nie te leer nie.",
      "Slaap net wanneer jy moeg is, want leer is nie belangrik nie.",
      ""
    ],
    "answer": [
      "Slaap genoeg, want dit help jou om te onthou.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "opsomming",
    "topic": "eie_woorde",
    "subtopic": "herformuleer_in_eie_woorde",
    "skills": [
      "afrikaans_fal_herformuleer_wenk_in_eie_woorde"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- 'n Direkte aanhaling kry geen punt nie.\n- Die sin moet dieselfde idee uitdruk, maar met ander woorde."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 3",
    "order": 3,
    "context_text": "Begin vroeg met leer. Ek het verlede jaar my toets gedruip omdat ek te laat begin leer het. Maak 'n leerrooster. Slaap genoeg voor die toets.",
    "question": "Watter sin sal jy NIE in 'n opsomming van die wenke insluit nie?",
    "metadata": [
      "Begin so vroeg moontlik met jou leerwerk vir die toets.",
      "Maak 'n leerrooster sodat jy jou tyd goed kan indeel.",
      "Slaap genoeg voor die toets sodat jy kan konsentreer.",
      "Verlede jaar het ek gedruip omdat ek laat begin leer het.",
      ""
    ],
    "answer": [
      "Verlede jaar het ek gedruip omdat ek laat begin leer het.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "opsomming",
    "topic": "hoofgedagtes_en_wenke",
    "subtopic": "herken_oortollige_inligting",
    "skills": [
      "afrikaans_fal_herken_oortollige_inligting"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Soek die sin wat 'n ervaring vertel, nie 'n wenk gee nie.\n- Wenke is opdragte aan die leser."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 4",
    "order": 4,
    "context_text": "Eerstens moet jy vroeg begin leer. Dan moet jy 'n leerrooster maak. Slaap voor die toets ook genoeg. Laastens moet jy alles weer hersien.",
    "question": "Rangskik die wenke in die volgorde waarin die teks hulle noem.",
    "metadata": [
      "Slaap genoeg.",
      "Begin vroeg met leer.",
      "Hersien alles weer.",
      "Maak 'n leerrooster.",
      ""
    ],
    "answer": [
      "Begin vroeg met leer.",
      "Maak 'n leerrooster.",
      "Slaap genoeg.",
      "Hersien alles weer.",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "opsomming",
    "topic": "puntvorm_en_volgorde",
    "subtopic": "rangskik_wenke_volgens_teks",
    "skills": [
      "afrikaans_fal_rangskik_wenke_in_teksvolgorde"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Lees die teks en let op die volgorde van die woorde \"eerste\", \"dan\" en \"laastens\".\n- Die eerste wenk kom ná die titel."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2",
      "marks": 10,
      "clues": "- Lees die hele teks en onderstreep die wenke.\n- Skryf sewe wenke in EIE volsinne, in puntvorm en genommer 1 tot 7.\n- Bly onder 70 woorde en dui die getal woorde aan.",
      "approach": "- Merk die wenke: kalm bly, leestyd benut, tyd bestuur, instruksies volg, vrae versigtig lees, sleutelwoorde uitlig, langer vrae beplan, oor tyd gebruik om na te gaan\n- Kies sewe\n- Herskryf elk in 'n eie volsin sonder om aan te haal\n- Tel die woorde",
      "solution": "1. Sewe feite = 7 punte (een punt per feit); die taal gee nog 3 punte as die opsomming nie 'n direkte aanhaling het nie.\n2. Voorbeelde: Bly kalm. Gebruik die leestyd sinvol. Bestuur jou tyd goed. Volg al die instruksies. Lees alle vrae versigtig. Onderstreep sleutelwoorde. Beplan langer vrae.\n3. Een direkte aanhaling kos jou die taalpunte."
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
