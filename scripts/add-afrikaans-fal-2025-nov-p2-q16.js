#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 8.1.6–8.1.10: Kom ons stuur vir Tasu — Teks O
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks O
 *   Q2: P: Teks O l.7-15
 *   Q3: P: Teks O l.1-6
 *   Q4: L: identify (mirror 8.1.9)
 *   Q5: P: Teks O
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q16.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q16.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q16.js
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
  "name": "Vraag 8.1: Kom ons stuur vir Tasu (8.1.6–8.1.10)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "narrative_structure",
    "character_analysis",
    "theme_identification"
  ],
  "text_key": "kom_ons_stuur_vir_tasu",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q16/question_v2_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q16/question_v2_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q16/memo_v2_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q16/memo_v2_2.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks O",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q16/annexure_teks_o_v2_1.png"
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
    "paper": "nov_p2",
    "name": "Vraag 1",
    "text_key": "kom_ons_stuur_vir_tasu",
    "order": 1,
    "context_text": null,
    "question": "Pas elke persoon by wat hy of sy in die uittreksel sê of doen.",
    "metadata": [
      "A - Tasu",
      "B - Ma",
      "C - Sterkman",
      "1 - sê sy leen by niemand geld nie",
      "2 - het Tasu laat werk voordat hy sy slypsteen kon gebruik",
      "3 - bied aan om sy tieroë by die petrolpomp te verkoop"
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
    "unit": "kortverhale",
    "topic": "karakter_en_verhoudings",
    "subtopic": "wie_doen_wat",
    "skills": [
      "afrikaans_fal_pas_gebeure_by_persone"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan wie die tieroë wil verkoop en wie nie wil leen nie.\n- Begin met die een wat jy die mees seker is van."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "kom_ons_stuur_vir_tasu",
    "order": 2,
    "context_text": null,
    "question": "Kies TWEE eienskappe wat Tasu in die uittreksel toon.",
    "metadata": [
      "opofferend",
      "gierig",
      "liefdevol",
      "onverskillig",
      ""
    ],
    "answer": [
      "opofferend",
      "liefdevol",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "kortverhale",
    "topic": "karakter_en_verhoudings",
    "subtopic": "eienskappe_van_karakter",
    "skills": [
      "afrikaans_fal_identifiseer_eienskappe"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Wat gee Tasu op, en vir wie?\n- Twee eienskappe pas by sy optrede."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "kom_ons_stuur_vir_tasu",
    "order": 3,
    "context_text": null,
    "question": "Waarom kan 'n mens sê Tasu se ma is 'n verantwoordelike mens?",
    "metadata": [
      "Sy wil net haar eie geld bêre en niks deel nie.",
      "Sy dink skuld maak is 'n manier om vinnig ryk te word.",
      "Sy wil nie skuld maak nie en sorg dat die gesin kos het.",
      "Sy wil die eiers verkoop sodat Tasu kan gaan werk.",
      ""
    ],
    "answer": [
      "Sy wil nie skuld maak nie en sorg dat die gesin kos het.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "kortverhale",
    "topic": "karakter_en_verhoudings",
    "subtopic": "motief_van_karakter",
    "skills": [
      "afrikaans_fal_verklaar_karakter_se_keuse"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Sy leen nie en verkoop nie die eiers nie.\n- Dink aan waarvoor die eiers gebruik word."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "kom_ons_stuur_vir_tasu",
    "order": 4,
    "context_text": null,
    "question": "Tasu bied aan om sy tieroë te verkoop. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
    "metadata": [
      "Mense gee net iets op as hulle dit nie meer wil hê nie.",
      "Mense gee soms iets kosbaars op om iemand lief te help.",
      "Jy hoef nooit iets op te offer vir iemand anders nie.",
      "Kosbare besittings is altyd belangriker as jou familie.",
      ""
    ],
    "answer": [
      "Mense gee soms iets kosbaars op om iemand lief te help.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "kortverhale",
    "topic": "karakter_en_verhoudings",
    "subtopic": "identifiseer_met_karakter",
    "skills": [
      "afrikaans_fal_identifiseer_met_karakter"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan 'n keer toe jy iets prysgegee het vir iemand wat jy liefhet.\n- Gee 'n rede."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "kom_ons_stuur_vir_tasu",
    "order": 5,
    "context_text": null,
    "question": "Watter tema kom die sterkste in die uittreksel na vore?",
    "metadata": [
      "Wraak teenoor iemand wat jou seergemaak het.",
      "Die voordele van 'n goeie opvoeding.",
      "Hoe om vinnig ryk te word.",
      "Opoffering uit liefde vir familie.",
      ""
    ],
    "answer": [
      "Opoffering uit liefde vir familie.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "kortverhale",
    "topic": "tema_en_boodskap",
    "subtopic": "tema_van_die_kortverhaal",
    "skills": [
      "afrikaans_fal_identifiseer_temas"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Waarvoor is Tasu bereid om sy skatte op te gee?\n- Kyk na sy verhouding met sy ouma."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "8.1.6",
      "marks": 4,
      "clues": "- Pas elke gebeurtenis by die gevolg.",
      "approach": "- Dink aan wat uit elke gebeurtenis gevolg het",
      "solution": "(a) D.\n(b) A.\n(c) E.\n(d) B."
    },
    {
      "number": "8.1.7",
      "marks": 2,
      "clues": "- Dink aan hoe Tasu sy verlede hanteer het.",
      "approach": "- Soek twee positiewe gevolge",
      "solution": "1. Tasu het besluit sy verlede sal nie sy lewe bepaal nie.\n2. Hy het sy vrees oorkom om in 'n taxi vol mense te ry."
    },
    {
      "number": "8.1.8",
      "marks": 1,
      "clues": "- Wat wou Tasu se ma nie doen nie?",
      "approach": "- Gee een rede",
      "solution": "1. Sy wou nie by mense geld leen nie en het nie die eiers verkoop nie, want dis die gesin se kos."
    },
    {
      "number": "8.1.9",
      "marks": 1,
      "clues": "- Wat het Tasu prysgegee?",
      "approach": "- Verduidelik waarom jy kan identifiseer",
      "solution": "1. Ek het ook my droom prysgegee om vir my familie te help; familie is belangriker as drome."
    },
    {
      "number": "8.1.10",
      "marks": 1,
      "clues": "- Hoe het Tasu verander?",
      "approach": "- Verduidelik hoekom die tema pas",
      "solution": "1. Tasu kon sy vrese oorwin en verantwoordelikheid namens sy gesin neem."
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
