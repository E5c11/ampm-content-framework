#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 7.11–7.20: Fiela se Kind — Die Drama — Teks N
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks N (Pouse.), (kwaai)
 *   Q2: P: Teks N l.22-23
 *   Q3: P: Teks N
 *   Q4: P: Teks N
 *   Q5: P: Teks N
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q14.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q14.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q14.js
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
  "name": "Vraag 7: Fiela se Kind – Die Drama (7.11–7.20)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "dramatic_techniques",
    "character_analysis",
    "contextual_questions"
  ],
  "text_key": "fiela_se_kind_die_drama",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q14/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q14/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q14/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q14/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q14/memo_3.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks N",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q14/annexure_teks_n_1.png"
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
    "text_key": "fiela_se_kind_die_drama",
    "order": 1,
    "context_text": null,
    "question": "Wat noem ons die woorde tussen hakies soos (Pouse.) en (kwaai) in 'n drama?",
    "metadata": [
      "monoloë",
      "toneelaanwysings",
      "subplotte",
      "epiloë",
      ""
    ],
    "answer": [
      "toneelaanwysings",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "dramatiese_tegnieke",
    "subtopic": "toneelaanwysings",
    "skills": [
      "afrikaans_fal_identifiseer_dramatiese_tegniek"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Hierdie woorde word nie hardop gesê nie.\n- Hulle vertel die akteur hoe om te praat of op te tree."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "fiela_se_kind_die_drama",
    "order": 2,
    "context_text": null,
    "question": "Wat beteken Lukas se woorde: \"vir al die bas wat ek vir jou help afkap het\"?",
    "metadata": [
      "Lukas het Nina se huis in die Bos gebou.",
      "Lukas het vir Nina hout gekoop.",
      "Lukas het Nina met haar werk in die Bos gehelp.",
      "Lukas het Nina se baas geword.",
      ""
    ],
    "answer": [
      "Lukas het Nina met haar werk in die Bos gehelp.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "toon_en_stylmiddele",
    "subtopic": "betekenis_van_'n_aanhaling",
    "skills": [
      "afrikaans_fal_verklaar_betekenis_in_konteks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan die werk wat Bosmense in die Bos gedoen het.\n- Lukas noem al die keer wat hy vir Nina gehelp het."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "fiela_se_kind_die_drama",
    "order": 3,
    "context_text": null,
    "question": "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.",
    "metadata": [
      "Nina verskyn agter miss Weatherbury.",
      "Lukas vra dat Nina vir Pa sê hy kom nie terug nie.",
      "Weatherbury vra waarom Lukas Nina se geld wil kom haal.",
      "Nina sê Lukas moet nie sê waar sy is nie.",
      ""
    ],
    "answer": [
      "Weatherbury vra waarom Lukas Nina se geld wil kom haal.",
      "Nina verskyn agter miss Weatherbury.",
      "Nina sê Lukas moet nie sê waar sy is nie.",
      "Lukas vra dat Nina vir Pa sê hy kom nie terug nie.",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "drama",
    "topic": "intrige_en_gebeure",
    "subtopic": "volgorde_in_die_uittreksel",
    "skills": [
      "afrikaans_fal_rangskik_gebeure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Volg die gesprek reël vir reël.\n- Lukas se versoek kom aan die einde."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "fiela_se_kind_die_drama",
    "order": 4,
    "context_text": null,
    "question": "Watter stelling oor die uittreksel is ONWAAR?",
    "metadata": [
      "Miss Weatherbury was agterdogtig oor Lukas se doel.",
      "Lukas het gesê hy wil een guns vra.",
      "Nina het gesê Lukas moet nie sê waar sy is nie.",
      "Nina wou haar geld nog altyd vir Pa gee.",
      ""
    ],
    "answer": [
      "Nina wou haar geld nog altyd vir Pa gee.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "intrige_en_gebeure",
    "subtopic": "onwaar_stelling",
    "skills": [
      "afrikaans_fal_onderskei_waar_van_onwaar"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Wat sê Nina oor haar geld?\n- Toets elke stelling teen die uittreksel."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "fiela_se_kind_die_drama",
    "order": 5,
    "context_text": null,
    "question": "Kies TWEE temas wat in die uittreksel na vore kom.",
    "metadata": [
      "Die verskil tussen boslewe en dorpslewe",
      "Die voordele van moderne tegnologie in die huis",
      "Lojaliteit tussen broer en suster",
      "Sportprestasies by die skool en in die dorp",
      ""
    ],
    "answer": [
      "Die verskil tussen boslewe en dorpslewe",
      "Lojaliteit tussen broer en suster",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "drama",
    "topic": "tema_en_boodskap",
    "subtopic": "temas_in_die_uittreksel",
    "skills": [
      "afrikaans_fal_identifiseer_temas"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Waarom is Lukas by miss Weatherbury, en wat sê hy oor Bosmense?\n- Twee opsies pas by die uittreksel."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "7.11",
      "marks": 4,
      "clues": "- Dink aan die volgorde van die gebeure in die drama.",
      "approach": "- Rangskik die vier gebeure",
      "solution": "1. Lukas het vir Kaliel gevra om hom van die see te leer.\n2. Lukas het vir Fiela van sy liefde vir Nina vertel.\n3. Terwyl Elias siek gelê het, het Barta erken dat sy in die hof gelieg het.\n4. Die Komoeties het vir Lukas 'n brief geskryf om te sê hulle bid vir hom."
    },
    {
      "number": "7.12.1",
      "marks": 1,
      "clues": "- Hoe gaan Bosmense met geld om?",
      "approach": "- Kies die opsie tussen hakies",
      "solution": "1. gestereotipeer word omdat hulle anders werk met hulle geld."
    },
    {
      "number": "7.12.2",
      "marks": 1,
      "clues": "- Wie beheer die geld in 'n Bosgesin?",
      "approach": "- Gee een rede",
      "solution": "1. Die Bosmense het volgens hulle eie reëls gelewe en die pa was in beheer van die geld."
    },
    {
      "number": "7.13.1",
      "marks": 1,
      "clues": "- Waaroor is Lukas onseker?",
      "approach": "- Kies die opsie tussen hakies",
      "solution": "1. was nie seker of hy vir Nina moes vra om na Elias-hulle toe te gaan nie."
    },
    {
      "number": "7.13.2",
      "marks": 1,
      "clues": "- Wat vra Lukas vir Nina?",
      "approach": "- Motiveer jou antwoord op 7.13.1",
      "solution": "1. Hy het Nina gevra om hom te help en was bang Elias sou haar nie terug laat kom nie."
    },
    {
      "number": "7.14",
      "marks": 1,
      "clues": "- Wat beteken Nina se woorde oor haar pa?",
      "approach": "- Toets elke opsie",
      "solution": "1. B (Elias moet ophou verwag dat sy kinders al sy werk doen)."
    },
    {
      "number": "7.15",
      "marks": 1,
      "clues": "- Wat het Nina gedoen toe sy terug was?",
      "approach": "- Soek die direkte gevolg",
      "solution": "1. Nina het die ou plekke besoek en haar werk by miss Weatherbury verloor omdat sy so lank weggebly het."
    },
    {
      "number": "7.16",
      "marks": 2,
      "clues": "- Wat het die dorp vir Nina gegee?",
      "approach": "- Soek twee positiewe voorbeelde",
      "solution": "1. Nina kon haar eie geld verdien en nuwe klere dra.\n2. Sy kon selfstandig wees of goeie maniere leer."
    },
    {
      "number": "7.17",
      "marks": 1,
      "clues": "- Wat sê Lukas in reël 22 tot 24?",
      "approach": "- Verduidelik hoekom jy goed voel",
      "solution": "1. Lukas het nog altyd vir Nina beskerm en vra nou net een keer sy hulp."
    },
    {
      "number": "7.18",
      "marks": 2,
      "clues": "- Wat het Fiela gekry deur na die waarheid te soek?",
      "approach": "- Soek twee positiewe gevolge",
      "solution": "1. Fiela het haar hanskind teruggekry.\n2. Sy het uitgevind by wie haar kind geplaas was."
    },
    {
      "number": "7.19",
      "marks": 1,
      "clues": "- Hoekom wou miss Weatherbury vir Nina beskerm?",
      "approach": "- Gee een rede",
      "solution": "1. Nina was nog jonk en onervare en miss Weatherbury wou verhoed dat mense haar uitbuit."
    },
    {
      "number": "7.20",
      "marks": 1,
      "clues": "- Wat gebeur aan die einde van die drama?",
      "approach": "- Verduidelik hoekom die tema pas",
      "solution": "1. Barta het die kans gekry om die waarheid te praat en Benjamin kon self oor sy toekoms besluit."
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
